/**
 * Weather Analytics Service
 * Computes descriptive meteorological analytics from live forecast and air quality data.
 */

export function computeWeatherAnalytics(weatherData) {
  if (!weatherData) return null;

  const { current, hourly = [], daily = [], airQuality = {} } = weatherData;

  // 1. Temperature Analysis across 7-day forecast
  const validDaily = daily.filter(d => d.tempMax != null && d.tempMin != null);
  const maxTemps = validDaily.map(d => d.tempMax);
  const minTemps = validDaily.map(d => d.tempMin);

  const avgMax = maxTemps.length ? maxTemps.reduce((a, b) => a + b, 0) / maxTemps.length : 0;
  const avgMin = minTemps.length ? minTemps.reduce((a, b) => a + b, 0) / minTemps.length : 0;
  
  // Daily diurnal range (high - low)
  const diurnalRanges = validDaily.map(d => d.tempMax - d.tempMin);
  const avgDiurnalRange = diurnalRanges.length
    ? diurnalRanges.reduce((a, b) => a + b, 0) / diurnalRanges.length
    : 0;

  // Warmest & coolest days
  let warmestDay = null;
  let coolestDay = null;
  if (validDaily.length > 0) {
    const peakMax = Math.max(...maxTemps);
    const troughMin = Math.min(...minTemps);
    warmestDay = validDaily.find(d => d.tempMax === peakMax);
    coolestDay = validDaily.find(d => d.tempMin === troughMin);
  }

  // 2. Precipitation Analysis
  const rainProbabilities = daily.map(d => d.pop ?? 0);
  const rainyDaysCount = daily.filter(d => (d.pop ?? 0) >= 40).length;
  const dryDaysCount = daily.filter(d => (d.pop ?? 0) < 15).length;
  const avgRainProb = rainProbabilities.length
    ? rainProbabilities.reduce((a, b) => a + b, 0) / rainProbabilities.length
    : 0;

  // 3. Hourly Wind & UV Distribution
  const validHourly = hourly.slice(0, 24);
  const hourlyWind = validHourly.map(h => h.windSpeed ?? 0);
  const hourlyUV = validHourly.map(h => h.uvIndex ?? 0);

  const peakWindHourly = hourlyWind.length ? Math.max(...hourlyWind) : 0;
  const avgWindHourly = hourlyWind.length ? hourlyWind.reduce((a, b) => a + b, 0) / hourlyWind.length : 0;
  const peakUVHourly = hourlyUV.length ? Math.max(...hourlyUV) : 0;

  // Peak UV hours (hours where UV index >= 6)
  const highUVHours = validHourly.filter(h => (h.uvIndex ?? 0) >= 6).map(h => h.time);

  // 4. Pollutant Concentrations & WHO Thresholds
  const pollutants = [
    {
      name: 'PM2.5',
      fullName: 'Fine Particulate Matter (< 2.5 µm)',
      value: airQuality.pm25 ?? 0,
      unit: 'µg/m³',
      whoLimit: 15,
      ratio: Math.round(((airQuality.pm25 ?? 0) / 15) * 100) / 100
    },
    {
      name: 'PM10',
      fullName: 'Coarse Particulate Matter (< 10 µm)',
      value: airQuality.pm10 ?? 0,
      unit: 'µg/m³',
      whoLimit: 45,
      ratio: Math.round(((airQuality.pm10 ?? 0) / 45) * 100) / 100
    },
    {
      name: 'NO₂',
      fullName: 'Nitrogen Dioxide',
      value: airQuality.nitrogenDioxide ?? airQuality.no2 ?? 0,
      unit: 'µg/m³',
      whoLimit: 25,
      ratio: Math.round(((airQuality.nitrogenDioxide ?? airQuality.no2 ?? 0) / 25) * 100) / 100
    },
    {
      name: 'O₃',
      fullName: 'Ground-level Ozone',
      value: airQuality.ozone ?? airQuality.o3 ?? 0,
      unit: 'µg/m³',
      whoLimit: 100,
      ratio: Math.round(((airQuality.ozone ?? airQuality.o3 ?? 0) / 100) * 100) / 100
    }
  ];

  // Find dominant pollutant (highest ratio to WHO safety guideline)
  const dominantPollutant = pollutants.slice().sort((a, b) => b.ratio - a.ratio)[0];

  return {
    temperature: {
      avgMax: Math.round(avgMax * 10) / 10,
      avgMin: Math.round(avgMin * 10) / 10,
      avgDiurnalRange: Math.round(avgDiurnalRange * 10) / 10,
      warmestDay,
      coolestDay,
      dailyRangeList: validDaily.map(d => ({
        dayName: d.dayName,
        dateLabel: d.dateLabel,
        max: d.tempMax,
        min: d.tempMin,
        spread: Math.round((d.tempMax - d.tempMin) * 10) / 10
      }))
    },
    precipitation: {
      avgProbability: Math.round(avgRainProb),
      rainyDaysCount,
      dryDaysCount,
      totalDays: daily.length
    },
    wind: {
      peakSpeed: Math.round(peakWindHourly),
      avgSpeed: Math.round(avgWindHourly * 10) / 10,
      currentDirection: current?.windDirection ?? 'Variable'
    },
    uv: {
      peakUV: Math.round(peakUVHourly * 10) / 10,
      highUVHoursCount: highUVHours.length,
      dangerWindow: highUVHours.length > 0 ? `${highUVHours[0]} - ${highUVHours[highUVHours.length - 1]}` : 'Minimal exposure risk'
    },
    airQuality: {
      aqiValue: airQuality.value ?? airQuality.aqi ?? 0,
      aqiStatus: airQuality.status ?? 'Good',
      pollutants,
      dominantPollutant
    }
  };
}
