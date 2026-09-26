// Open-Meteo Historical Weather Service with Primary & Fallback Endpoints, Caching, and Retries

const FORECAST_BASE_URL = 'https://api.open-meteo.com/v1/forecast';
const ARCHIVE_BASE_URL = 'https://archive-api.open-meteo.com/v1/archive';
const REQUEST_TIMEOUT_MS = 10000;

/**
 * Format Date object to YYYY-MM-DD
 */
export function formatDateISO(date) {
  const d = new Date(date);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/**
 * Returns the most recent completed calendar day (typically 2 days ago for finalized observations)
 */
export function getSafeHistoricalEndDate() {
  const now = new Date();
  now.setDate(now.getDate() - 2);
  return formatDateISO(now);
}

/**
 * Get date presets dynamically based on the safe historical end date
 */
export function getHistoricalPresets() {
  const safeEndStr = getSafeHistoricalEndDate();
  const safeEndDate = new Date(safeEndStr + 'T00:00:00');

  const d7 = new Date(safeEndDate);
  d7.setDate(safeEndDate.getDate() - 6);

  const d14 = new Date(safeEndDate);
  d14.setDate(safeEndDate.getDate() - 13);

  const d30 = new Date(safeEndDate);
  d30.setDate(safeEndDate.getDate() - 29);

  const d90 = new Date(safeEndDate);
  d90.setDate(safeEndDate.getDate() - 89);

  return [
    { id: '7d', label: 'Last 7 Days', startDate: formatDateISO(d7), endDate: safeEndStr },
    { id: '14d', label: 'Last 14 Days', startDate: formatDateISO(d14), endDate: safeEndStr },
    { id: '30d', label: 'Last 30 Days', startDate: formatDateISO(d30), endDate: safeEndStr },
    { id: '90d', label: 'Last 3 Months', startDate: formatDateISO(d90), endDate: safeEndStr },
  ];
}

/**
 * Cache key generation helper
 */
function getCacheKey(lat, lon, start, end) {
  const numLat = Number(lat).toFixed(4);
  const numLon = Number(lon).toFixed(4);
  return `weather_history_${numLat}_${numLon}_${start}_${end}`;
}

/**
 * Clear cached historical responses from sessionStorage
 */
export function clearHistoricalCache() {
  try {
    const toRemove = [];
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key && key.startsWith('weather_history_')) {
        toRemove.push(key);
      }
    }
    toRemove.forEach(k => sessionStorage.removeItem(k));
  } catch (e) {
    console.warn('Failed to clear historical cache:', e);
  }
}

/**
 * Fetch with timeout using AbortController
 */
async function fetchWithTimeout(url, options = {}, timeoutMs = REQUEST_TIMEOUT_MS) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return response;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Build Open-Meteo query string
 */
function buildDailyQueryParams(lat, lon, startDate, endDate) {
  return new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    start_date: startDate,
    end_date: endDate,
    daily: 'weather_code,temperature_2m_max,temperature_2m_min,temperature_2m_mean,precipitation_sum,wind_speed_10m_max',
    timezone: 'auto'
  }).toString();
}

/**
 * Fetch historical daily records from Open-Meteo
 * Handles caching, timeout, retry, primary & fallback endpoints, and statistics
 */
export async function fetchHistoricalWeather(latitude, longitude, startDate, endDate, bypassCache = false) {
  if (!latitude || !longitude || !startDate || !endDate) {
    throw new Error('Latitude, longitude, startDate, and endDate are required.');
  }

  const cacheKey = getCacheKey(latitude, longitude, startDate, endDate);

  // 1. Check sessionStorage cache
  if (!bypassCache) {
    try {
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed && Array.isArray(parsed.days) && parsed.days.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Ignore cache read failures
    }
  }

  const queryString = buildDailyQueryParams(latitude, longitude, startDate, endDate);

  // Decide endpoint priority:
  // api.open-meteo.com/v1/forecast provides past daily data up to 92 days reliably with valid SSL.
  // archive-api.open-meteo.com/v1/archive is an alternative for older periods if reachable.
  const endpoints = [
    `${FORECAST_BASE_URL}?${queryString}`,
    `${ARCHIVE_BASE_URL}?${queryString}`
  ];

  let rawData = null;
  let lastError = null;

  for (let attempt = 0; attempt < endpoints.length; attempt++) {
    const targetUrl = endpoints[attempt];

    // Retry loop for the current endpoint (up to 2 tries: immediate + 1 retry)
    for (let retry = 0; retry < 2; retry++) {
      try {
        const response = await fetchWithTimeout(targetUrl, {}, REQUEST_TIMEOUT_MS);

        if (response.ok) {
          rawData = await response.json();
          break;
        }

        // Handle HTTP error responses
        const errorJson = await response.json().catch(() => ({}));
        const reason = errorJson.reason || '';

        // If start_date is out of range on forecast endpoint, try next endpoint or report clearly
        if (response.status === 400 && reason.includes('out of allowed range')) {
          lastError = new Error('Historical observations are available for the past 90 days. Please select dates within the last 3 months.');
          break; // Don't retry same URL
        }

        lastError = new Error(reason || `Historical weather API returned status ${response.status}`);
        break; // Don't retry 4xx errors
      } catch (err) {
        if (err.name === 'AbortError') {
          lastError = new Error('Historical weather request timed out (10s limit). Please check your internet connection.');
        } else {
          lastError = new Error('Unable to connect to Open-Meteo historical weather service. Please check your connection.');
        }

        // Short pause before retry if this was attempt 0
        if (retry === 0) {
          await new Promise(r => setTimeout(r, 400));
        }
      }
    }

    if (rawData) {
      break;
    }
  }

  if (!rawData) {
    throw lastError || new Error('Failed to retrieve historical weather archive.');
  }

  if (!rawData.daily || !Array.isArray(rawData.daily.time) || rawData.daily.time.length === 0) {
    throw new Error('No historical observation records found for the selected date range.');
  }

  const { time, weather_code, temperature_2m_max, temperature_2m_min, temperature_2m_mean, precipitation_sum, wind_speed_10m_max } = rawData.daily;

  const days = time.map((dateStr, idx) => ({
    date: dateStr,
    weatherCode: weather_code?.[idx] ?? 0,
    tempMax: temperature_2m_max?.[idx] != null ? Math.round(temperature_2m_max[idx] * 10) / 10 : null,
    tempMin: temperature_2m_min?.[idx] != null ? Math.round(temperature_2m_min[idx] * 10) / 10 : null,
    tempMean: temperature_2m_mean?.[idx] != null ? Math.round(temperature_2m_mean[idx] * 10) / 10 : null,
    precipitation: precipitation_sum?.[idx] != null ? Math.max(0, Math.round(precipitation_sum[idx] * 10) / 10) : 0,
    windMax: wind_speed_10m_max?.[idx] != null ? Math.max(0, Math.round(wind_speed_10m_max[idx])) : 0,
  }));

  // Calculate statistics
  const validMax = days.filter(d => d.tempMax != null).map(d => d.tempMax);
  const validMin = days.filter(d => d.tempMin != null).map(d => d.tempMin);
  const validPrecip = days.map(d => d.precipitation);
  const validWind = days.map(d => d.windMax);

  const avgMax = validMax.length > 0 ? (validMax.reduce((a, b) => a + b, 0) / validMax.length) : null;
  const avgMin = validMin.length > 0 ? (validMin.reduce((a, b) => a + b, 0) / validMin.length) : null;
  const totalPrecip = validPrecip.reduce((a, b) => a + b, 0);
  const peakWind = validWind.length > 0 ? Math.max(...validWind) : 0;
  const rainyDays = days.filter(d => d.precipitation > 0.1).length;

  let warmestDay = null;
  let coolestDay = null;

  if (validMax.length > 0) {
    const maxVal = Math.max(...validMax);
    const day = days.find(d => d.tempMax === maxVal);
    if (day) warmestDay = { date: day.date, temp: maxVal };
  }

  if (validMin.length > 0) {
    const minVal = Math.min(...validMin);
    const day = days.find(d => d.tempMin === minVal);
    if (day) coolestDay = { date: day.date, temp: minVal };
  }

  const result = {
    latitude: rawData.latitude,
    longitude: rawData.longitude,
    elevation: rawData.elevation,
    startDate,
    endDate,
    days,
    summary: {
      avgMaxTemp: avgMax != null ? Math.round(avgMax * 10) / 10 : null,
      avgMinTemp: avgMin != null ? Math.round(avgMin * 10) / 10 : null,
      totalPrecipitation: Math.round(totalPrecip * 10) / 10,
      peakWindSpeed: peakWind,
      rainyDaysCount: rainyDays,
      totalDays: days.length,
      warmestDay,
      coolestDay,
    }
  };

  // Cache result in sessionStorage
  try {
    sessionStorage.setItem(cacheKey, JSON.stringify(result));
  } catch {
    // Ignore storage quota errors
  }

  return result;
}
