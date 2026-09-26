/**
 * Utility functions for formatting weather data, temperatures, and dates.
 */

/**
 * Converts Celsius to Fahrenheit if unit is 'F'
 * @param {number} celsius 
 * @param {'C' | 'F'} unit 
 * @returns {number}
 */
export function formatTemp(celsius, unit = 'C') {
  if (celsius === undefined || celsius === null || isNaN(celsius)) return '--';
  if (unit === 'F') {
    return Math.round((celsius * 9) / 5 + 32);
  }
  return Math.round(celsius);
}

/**
 * Returns formatted temperature string with unit symbol
 * @param {number} celsius 
 * @param {'C' | 'F'} unit 
 * @returns {string}
 */
export function formatTempString(celsius, unit = 'C') {
  const val = formatTemp(celsius, unit);
  return `${val}°${unit}`;
}

/**
 * Converts km/h to mph if unit is 'F' (imperial)
 * @param {number} speedKmh 
 * @param {'C' | 'F'} unit 
 * @returns {string}
 */
export function formatWindSpeed(speedKmh, unit = 'C') {
  if (speedKmh === undefined || speedKmh === null || isNaN(speedKmh)) return '--';
  if (unit === 'F') {
    const mph = Math.round(speedKmh * 0.621371);
    return `${mph} mph`;
  }
  return `${Math.round(speedKmh)} km/h`;
}

/**
 * Formats 24h ISO string or time string to user-friendly time (e.g. 3:00 PM)
 * Preserves the location's native time without browser UTC skew.
 * @param {string} timeString 
 * @returns {string}
 */
export function formatTime(timeString) {
  if (!timeString) return '';
  
  // If ISO string like '2026-09-25T14:30' or '14:30'
  const timeOnly = timeString.includes('T') ? timeString.split('T')[1] : timeString;
  const parts = timeOnly.split(':');
  
  if (parts.length >= 2) {
    const hour = parseInt(parts[0], 10);
    const minute = parts[1].slice(0, 2);
    if (!isNaN(hour)) {
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
      return `${formattedHour}:${minute} ${ampm}`;
    }
  }

  return timeString;
}

/**
 * Formats date string to friendly format e.g. "Thursday, Sep 25"
 * @param {Date | string} date 
 * @returns {string}
 */
export function formatDate(date = new Date()) {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  });
}

/**
 * Formats ISO date 'YYYY-MM-DD' to short weekday & date e.g. "Fri, Sep 26"
 * @param {string} isoDateStr 
 * @returns {{ dayName: string, dateLabel: string }}
 */
export function formatDayDate(isoDateStr) {
  if (!isoDateStr) return { dayName: '', dateLabel: '' };
  
  const [year, month, day] = isoDateStr.split('-').map(Number);
  const d = new Date(year, month - 1, day);
  
  const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
  const dateLabel = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  
  return { dayName, dateLabel };
}

/**
 * Returns category and colors for Air Quality Index (AQI)
 * @param {number} aqi 
 * @returns {{ label: string, color: string, badgeBg: string, badgeText: string, description: string }}
 */
export function getAQIInfo(aqi) {
  const val = Number(aqi) || 0;
  if (val <= 50) {
    return {
      label: 'Good',
      color: '#10b981', // emerald-500
      badgeBg: 'bg-emerald-100 dark:bg-emerald-900/40',
      badgeText: 'text-emerald-700 dark:text-emerald-300',
      description: 'Air quality is satisfactory and poses little or no health risk.'
    };
  } else if (val <= 100) {
    return {
      label: 'Moderate',
      color: '#f59e0b', // amber-500
      badgeBg: 'bg-amber-100 dark:bg-amber-900/40',
      badgeText: 'text-amber-700 dark:text-amber-300',
      description: 'Air quality is acceptable; however, some sensitive individuals may experience mild symptoms.'
    };
  } else if (val <= 150) {
    return {
      label: 'Unhealthy for Sensitive Groups',
      color: '#f97316', // orange-500
      badgeBg: 'bg-orange-100 dark:bg-orange-900/40',
      badgeText: 'text-orange-700 dark:text-orange-300',
      description: 'Members of sensitive groups may experience health effects. General public is less likely affected.'
    };
  } else if (val <= 200) {
    return {
      label: 'Unhealthy',
      color: '#ef4444', // red-500
      badgeBg: 'bg-red-100 dark:bg-red-900/40',
      badgeText: 'text-red-700 dark:text-red-300',
      description: 'Everyone may begin to experience health effects. Limit prolonged outdoor exertion.'
    };
  } else if (val <= 300) {
    return {
      label: 'Very Unhealthy',
      color: '#8b5cf6', // purple-500
      badgeBg: 'bg-purple-100 dark:bg-purple-900/40',
      badgeText: 'text-purple-700 dark:text-purple-300',
      description: 'Health alert: the risk of health effects is increased for everyone.'
    };
  } else {
    return {
      label: 'Hazardous',
      color: '#881337', // rose-900
      badgeBg: 'bg-rose-100 dark:bg-rose-900/40',
      badgeText: 'text-rose-700 dark:text-rose-300',
      description: 'Health warning of emergency conditions: everyone is more likely to be affected.'
    };
  }
}

/**
 * Returns level and color for UV index
 * @param {number} uv 
 * @returns {{ label: string, color: string, badgeBg: string, badgeText: string }}
 */
export function getUVInfo(uv) {
  const val = Number(uv) || 0;
  if (val <= 2) {
    return {
      label: 'Low',
      color: '#10b981',
      badgeBg: 'bg-emerald-100 dark:bg-emerald-900/40',
      badgeText: 'text-emerald-700 dark:text-emerald-300'
    };
  } else if (val <= 5) {
    return {
      label: 'Moderate',
      color: '#f59e0b',
      badgeBg: 'bg-amber-100 dark:bg-amber-900/40',
      badgeText: 'text-amber-700 dark:text-amber-300'
    };
  } else if (val <= 7) {
    return {
      label: 'High',
      color: '#f97316',
      badgeBg: 'bg-orange-100 dark:bg-orange-900/40',
      badgeText: 'text-orange-700 dark:text-orange-300'
    };
  } else if (val <= 10) {
    return {
      label: 'Very High',
      color: '#ef4444',
      badgeBg: 'bg-red-100 dark:bg-red-900/40',
      badgeText: 'text-red-700 dark:text-red-300'
    };
  } else {
    return {
      label: 'Extreme',
      color: '#8b5cf6',
      badgeBg: 'bg-purple-100 dark:bg-purple-900/40',
      badgeText: 'text-purple-700 dark:text-purple-300'
    };
  }
}
