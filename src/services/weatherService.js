import { formatDayDate, formatTime, getAQIInfo } from '../utils/formatters.js';

/**
 * Open-Meteo Weather Service Layer
 * 
 * Provides live weather, geocoding, air quality, hourly and 7-day forecast data.
 * Enhanced with India-aware location search, states, districts, and extended hourly variables.
 */

// WMO Weather Interpretation Codes (WW)
const isLocalhostEnv = typeof window !== 'undefined' && 
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

function getGeocodingUrls(query, count = 20) {
  const enc = encodeURIComponent(query);
  const path = `?name=${enc}&count=${count}&language=en&format=json`;
  if (isLocalhostEnv) {
    return [`/geo-proxy/v1/search${path}`];
  }
  return [`https://geocoding-api.open-meteo.com/v1/search${path}`];
}

function getAirQualityUrls(lat, lon) {
  const query = `?latitude=${lat}&longitude=${lon}&current=european_aqi,us_aqi,pm10,pm2_5,nitrogen_dioxide,ozone&timezone=auto`;
  if (isLocalhostEnv) {
    return [`/aqi-proxy/v1/air-quality${query}`];
  }
  return [`https://air-quality-api.open-meteo.com/v1/air-quality${query}`];
}

const WMO_CODES = {
  0: { day: 'Sunny', night: 'Clear' },
  1: { day: 'Mainly Sunny', night: 'Mainly Clear' },
  2: { day: 'Partly Cloudy', night: 'Partly Cloudy' },
  3: { day: 'Cloudy', night: 'Cloudy' },
  45: { day: 'Foggy', night: 'Foggy' },
  48: { day: 'Depositing Rime Fog', night: 'Depositing Rime Fog' },
  51: { day: 'Light Drizzle', night: 'Light Drizzle' },
  53: { day: 'Moderate Drizzle', night: 'Moderate Drizzle' },
  55: { day: 'Dense Drizzle', night: 'Dense Drizzle' },
  56: { day: 'Light Freezing Drizzle', night: 'Light Freezing Drizzle' },
  57: { day: 'Dense Freezing Drizzle', night: 'Dense Freezing Drizzle' },
  61: { day: 'Light Rain', night: 'Light Rain' },
  63: { day: 'Moderate Rain', night: 'Moderate Rain' },
  65: { day: 'Heavy Rain', night: 'Heavy Rain' },
  66: { day: 'Light Freezing Rain', night: 'Light Freezing Rain' },
  67: { day: 'Heavy Freezing Rain', night: 'Heavy Freezing Rain' },
  71: { day: 'Light Snow', night: 'Light Snow' },
  73: { day: 'Moderate Snow', night: 'Moderate Snow' },
  75: { day: 'Heavy Snow', night: 'Heavy Snow' },
  77: { day: 'Snow Grains', night: 'Snow Grains' },
  80: { day: 'Light Showers', night: 'Light Showers' },
  81: { day: 'Moderate Showers', night: 'Moderate Showers' },
  82: { day: 'Violent Showers', night: 'Violent Showers' },
  85: { day: 'Light Snow Showers', night: 'Light Snow Showers' },
  86: { day: 'Heavy Snow Showers', night: 'Heavy Snow Showers' },
  95: { day: 'Thunderstorm', night: 'Thunderstorm' },
  96: { day: 'Thunderstorm with Slight Hail', night: 'Thunderstorm with Slight Hail' },
  99: { day: 'Thunderstorm with Heavy Hail', night: 'Thunderstorm with Heavy Hail' }
};

/**
 * Maps WMO code to human-readable condition text
 * @param {number} code 
 * @param {boolean|number} isDay 
 * @returns {string}
 */
export function getConditionFromCode(code, isDay = 1) {
  const isDaytime = Boolean(isDay);
  const match = WMO_CODES[code];
  if (!match) return isDaytime ? 'Sunny' : 'Clear';
  return isDaytime ? match.day : match.night;
}

/**
 * Converts wind degrees (0-360) to cardinal direction with degree readout
 * @param {number} degrees 
 * @returns {string}
 */
export function getWindDirectionCardinal(degrees) {
  if (degrees === undefined || degrees === null || isNaN(degrees)) return '--';
  const cardinals = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round((degrees % 360) / 22.5) % 16;
  return `${cardinals[index]} (${Math.round(degrees)}°)`;
}

/**
 * Returns short cardinal wind direction without degrees
 * @param {number} degrees 
 * @returns {string}
 */
export function getWindDirectionShort(degrees) {
  if (degrees === undefined || degrees === null || isNaN(degrees)) return '--';
  const cardinals = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round((degrees % 360) / 22.5) % 16;
  return cardinals[index];
}

// 28 Indian States & 8 Union Territories database with capital coordinates
// 28 Indian States & 8 Union Territories database with capital coordinates
const INDIAN_STATES_DB = {
  'rajasthan': { name: 'Rajasthan', state: 'Rajasthan', country: 'India', country_code: 'IN', latitude: 26.9124, longitude: 75.7873, admin1: 'Rajasthan', timezone: 'Asia/Kolkata', population: 68548437, feature_code: 'ADM1' },
  'karnataka': { name: 'Karnataka', state: 'Karnataka', country: 'India', country_code: 'IN', latitude: 12.9716, longitude: 77.5946, admin1: 'Karnataka', timezone: 'Asia/Kolkata', population: 61095297, feature_code: 'ADM1' },
  'maharashtra': { name: 'Maharashtra', state: 'Maharashtra', country: 'India', country_code: 'IN', latitude: 19.0760, longitude: 72.8777, admin1: 'Maharashtra', timezone: 'Asia/Kolkata', population: 112374333, feature_code: 'ADM1' },
  'tamil nadu': { name: 'Tamil Nadu', state: 'Tamil Nadu', country: 'India', country_code: 'IN', latitude: 13.0827, longitude: 80.2707, admin1: 'Tamil Nadu', timezone: 'Asia/Kolkata', population: 72147030, feature_code: 'ADM1' },
  'kerala': { name: 'Kerala', state: 'Kerala', country: 'India', country_code: 'IN', latitude: 8.5241, longitude: 76.9366, admin1: 'Kerala', timezone: 'Asia/Kolkata', population: 33406061, feature_code: 'ADM1' },
  'telangana': { name: 'Telangana', state: 'Telangana', country: 'India', country_code: 'IN', latitude: 17.3850, longitude: 78.4867, admin1: 'Telangana', timezone: 'Asia/Kolkata', population: 35003674, feature_code: 'ADM1' },
  'andhra pradesh': { name: 'Andhra Pradesh', state: 'Andhra Pradesh', country: 'India', country_code: 'IN', latitude: 16.5062, longitude: 80.6480, admin1: 'Andhra Pradesh', timezone: 'Asia/Kolkata', population: 49577103, feature_code: 'ADM1' },
  'gujarat': { name: 'Gujarat', state: 'Gujarat', country: 'India', country_code: 'IN', latitude: 23.2156, longitude: 72.6369, admin1: 'Gujarat', timezone: 'Asia/Kolkata', population: 60439692, feature_code: 'ADM1' },
  'goa': { name: 'Goa', state: 'Goa', country: 'India', country_code: 'IN', latitude: 15.2993, longitude: 74.1240, admin1: 'Goa', timezone: 'Asia/Kolkata', population: 1458545, feature_code: 'ADM1' },
  'punjab': { name: 'Punjab', state: 'Punjab', country: 'India', country_code: 'IN', latitude: 30.7333, longitude: 76.7794, admin1: 'Punjab', timezone: 'Asia/Kolkata', population: 27743338, feature_code: 'ADM1' },
  'haryana': { name: 'Haryana', state: 'Haryana', country: 'India', country_code: 'IN', latitude: 30.7333, longitude: 76.7794, admin1: 'Haryana', timezone: 'Asia/Kolkata', population: 25351462, feature_code: 'ADM1' },
  'uttar pradesh': { name: 'Uttar Pradesh', state: 'Uttar Pradesh', country: 'India', country_code: 'IN', latitude: 26.8467, longitude: 80.9462, admin1: 'Uttar Pradesh', timezone: 'Asia/Kolkata', population: 199812341, feature_code: 'ADM1' },
  'west bengal': { name: 'West Bengal', state: 'West Bengal', country: 'India', country_code: 'IN', latitude: 22.5726, longitude: 88.3639, admin1: 'West Bengal', timezone: 'Asia/Kolkata', population: 91276115, feature_code: 'ADM1' },
  'madhya pradesh': { name: 'Madhya Pradesh', state: 'Madhya Pradesh', country: 'India', country_code: 'IN', latitude: 23.2599, longitude: 77.4126, admin1: 'Madhya Pradesh', timezone: 'Asia/Kolkata', population: 72626809, feature_code: 'ADM1' },
  'bihar': { name: 'Bihar', state: 'Bihar', country: 'India', country_code: 'IN', latitude: 25.5941, longitude: 85.1376, admin1: 'Bihar', timezone: 'Asia/Kolkata', population: 104099452, feature_code: 'ADM1' },
  'odisha': { name: 'Odisha', state: 'Odisha', country: 'India', country_code: 'IN', latitude: 20.2961, longitude: 85.8245, admin1: 'Odisha', timezone: 'Asia/Kolkata', population: 41974218, feature_code: 'ADM1' },
  'orissa': { name: 'Odisha', state: 'Odisha', country: 'India', country_code: 'IN', latitude: 20.2961, longitude: 85.8245, admin1: 'Odisha', timezone: 'Asia/Kolkata', population: 41974218, feature_code: 'ADM1' },
  'assam': { name: 'Assam', state: 'Assam', country: 'India', country_code: 'IN', latitude: 26.1445, longitude: 91.7362, admin1: 'Assam', timezone: 'Asia/Kolkata', population: 31205576, feature_code: 'ADM1' },
  'jharkhand': { name: 'Jharkhand', state: 'Jharkhand', country: 'India', country_code: 'IN', latitude: 23.3441, longitude: 85.3096, admin1: 'Jharkhand', timezone: 'Asia/Kolkata', population: 32988134, feature_code: 'ADM1' },
  'chhattisgarh': { name: 'Chhattisgarh', state: 'Chhattisgarh', country: 'India', country_code: 'IN', latitude: 21.2514, longitude: 81.6296, admin1: 'Chhattisgarh', timezone: 'Asia/Kolkata', population: 25545198, feature_code: 'ADM1' },
  'uttarakhand': { name: 'Uttarakhand', state: 'Uttarakhand', country: 'India', country_code: 'IN', latitude: 30.3165, longitude: 78.0322, admin1: 'Uttarakhand', timezone: 'Asia/Kolkata', population: 10086292, feature_code: 'ADM1' },
  'himachal pradesh': { name: 'Himachal Pradesh', state: 'Himachal Pradesh', country: 'India', country_code: 'IN', latitude: 31.1048, longitude: 77.1734, admin1: 'Himachal Pradesh', timezone: 'Asia/Kolkata', population: 6864602, feature_code: 'ADM1' },
  'tripura': { name: 'Tripura', state: 'Tripura', country: 'India', country_code: 'IN', latitude: 23.8315, longitude: 91.2868, admin1: 'Tripura', timezone: 'Asia/Kolkata', population: 3673917, feature_code: 'ADM1' },
  'meghalaya': { name: 'Meghalaya', state: 'Meghalaya', country: 'India', country_code: 'IN', latitude: 25.5788, longitude: 91.8933, admin1: 'Meghalaya', timezone: 'Asia/Kolkata', population: 2966889, feature_code: 'ADM1' },
  'manipur': { name: 'Manipur', state: 'Manipur', country: 'India', country_code: 'IN', latitude: 24.8170, longitude: 93.9368, admin1: 'Manipur', timezone: 'Asia/Kolkata', population: 2855794, feature_code: 'ADM1' },
  'nagaland': { name: 'Nagaland', state: 'Nagaland', country: 'India', country_code: 'IN', latitude: 25.6751, longitude: 94.1086, admin1: 'Nagaland', timezone: 'Asia/Kolkata', population: 1978502, feature_code: 'ADM1' },
  'arunachal pradesh': { name: 'Arunachal Pradesh', state: 'Arunachal Pradesh', country: 'India', country_code: 'IN', latitude: 27.0844, longitude: 93.6053, admin1: 'Arunachal Pradesh', timezone: 'Asia/Kolkata', population: 1383727, feature_code: 'ADM1' },
  'mizoram': { name: 'Mizoram', state: 'Mizoram', country: 'India', country_code: 'IN', latitude: 23.7271, longitude: 92.7176, admin1: 'Mizoram', timezone: 'Asia/Kolkata', population: 1097206, feature_code: 'ADM1' },
  'sikkim': { name: 'Sikkim', state: 'Sikkim', country: 'India', country_code: 'IN', latitude: 27.3389, longitude: 88.6065, admin1: 'Sikkim', timezone: 'Asia/Kolkata', population: 610577, feature_code: 'ADM1' },
  'delhi': { name: 'Delhi', state: 'National Capital Territory of Delhi', country: 'India', country_code: 'IN', latitude: 28.6519, longitude: 77.2315, admin1: 'Delhi', timezone: 'Asia/Kolkata', population: 16787941, feature_code: 'PPLC' },
  'jammu and kashmir': { name: 'Jammu and Kashmir', state: 'Jammu and Kashmir', country: 'India', country_code: 'IN', latitude: 34.0837, longitude: 74.7973, admin1: 'Jammu and Kashmir', timezone: 'Asia/Kolkata', population: 12267032, feature_code: 'ADM1' },
  'ladakh': { name: 'Ladakh', state: 'Ladakh', country: 'India', country_code: 'IN', latitude: 34.1526, longitude: 77.5771, admin1: 'Ladakh', timezone: 'Asia/Kolkata', population: 274289, feature_code: 'ADM1' },
  'chandigarh': { name: 'Chandigarh', state: 'Chandigarh', country: 'India', country_code: 'IN', latitude: 30.7333, longitude: 76.7794, admin1: 'Chandigarh', timezone: 'Asia/Kolkata', population: 1055450, feature_code: 'ADM1' },
  'puducherry': { name: 'Puducherry', state: 'Puducherry', country: 'India', country_code: 'IN', latitude: 11.9416, longitude: 79.8083, admin1: 'Puducherry', timezone: 'Asia/Kolkata', population: 1247953, feature_code: 'ADM1' }
};

// Full 31 Karnataka Districts & Major Regional Centers
const KARNATAKA_DISTRICTS_DB = {
  'kolar': { name: 'Kolar', state: 'Karnataka', country: 'India', countryCode: 'IN', latitude: 13.1367, longitude: 78.1337, timezone: 'Asia/Kolkata', population: 1536401 },
  'bengaluru': { name: 'Bengaluru', state: 'Karnataka', country: 'India', countryCode: 'IN', latitude: 12.9716, longitude: 77.5946, timezone: 'Asia/Kolkata', population: 8443675 },
  'bangalore': { name: 'Bengaluru', state: 'Karnataka', country: 'India', countryCode: 'IN', latitude: 12.9716, longitude: 77.5946, timezone: 'Asia/Kolkata', population: 8443675 },
  'mysuru': { name: 'Mysuru', state: 'Karnataka', country: 'India', countryCode: 'IN', latitude: 12.2958, longitude: 76.6394, timezone: 'Asia/Kolkata', population: 920550 },
  'mysore': { name: 'Mysuru', state: 'Karnataka', country: 'India', countryCode: 'IN', latitude: 12.2958, longitude: 76.6394, timezone: 'Asia/Kolkata', population: 920550 },
  'mangalore': { name: 'Mangalore', state: 'Karnataka', country: 'India', countryCode: 'IN', latitude: 12.9141, longitude: 74.8560, timezone: 'Asia/Kolkata', population: 499487 },
  'mangaluru': { name: 'Mangalore', state: 'Karnataka', country: 'India', countryCode: 'IN', latitude: 12.9141, longitude: 74.8560, timezone: 'Asia/Kolkata', population: 499487 },
  'tumakuru': { name: 'Tumakuru', state: 'Karnataka', country: 'India', countryCode: 'IN', latitude: 13.3422, longitude: 77.1017, timezone: 'Asia/Kolkata', population: 305821 },
  'tumkur': { name: 'Tumakuru', state: 'Karnataka', country: 'India', countryCode: 'IN', latitude: 13.3422, longitude: 77.1017, timezone: 'Asia/Kolkata', population: 305821 },
  'davanagere': { name: 'Davanagere', state: 'Karnataka', country: 'India', countryCode: 'IN', latitude: 14.4644, longitude: 75.9218, timezone: 'Asia/Kolkata', population: 435128 },
  'davangere': { name: 'Davanagere', state: 'Karnataka', country: 'India', countryCode: 'IN', latitude: 14.4644, longitude: 75.9218, timezone: 'Asia/Kolkata', population: 435128 },
  'hubballi': { name: 'Hubballi', state: 'Karnataka', country: 'India', countryCode: 'IN', latitude: 15.3647, longitude: 75.1240, timezone: 'Asia/Kolkata', population: 943788 },
  'hubli': { name: 'Hubballi', state: 'Karnataka', country: 'India', countryCode: 'IN', latitude: 15.3647, longitude: 75.1240, timezone: 'Asia/Kolkata', population: 943788 },
  'dharwad': { name: 'Dharwad', state: 'Karnataka', country: 'India', countryCode: 'IN', latitude: 15.4589, longitude: 75.0078, timezone: 'Asia/Kolkata', population: 943788 },
  'belagavi': { name: 'Belagavi', state: 'Karnataka', country: 'India', countryCode: 'IN', latitude: 15.8497, longitude: 74.4977, timezone: 'Asia/Kolkata', population: 488157 },
  'belgaum': { name: 'Belagavi', state: 'Karnataka', country: 'India', countryCode: 'IN', latitude: 15.8497, longitude: 74.4977, timezone: 'Asia/Kolkata', population: 488157 },
  'kalaburagi': { name: 'Kalaburagi', state: 'Karnataka', country: 'India', countryCode: 'IN', latitude: 17.3297, longitude: 76.8343, timezone: 'Asia/Kolkata', population: 533587 },
  'gulbarga': { name: 'Kalaburagi', state: 'Karnataka', country: 'India', countryCode: 'IN', latitude: 17.3297, longitude: 76.8343, timezone: 'Asia/Kolkata', population: 533587 },
  'shivamogga': { name: 'Shivamogga', state: 'Karnataka', country: 'India', countryCode: 'IN', latitude: 13.9299, longitude: 75.5681, timezone: 'Asia/Kolkata', population: 322650 },
  'shimoga': { name: 'Shivamogga', state: 'Karnataka', country: 'India', countryCode: 'IN', latitude: 13.9299, longitude: 75.5681, timezone: 'Asia/Kolkata', population: 322650 },
  'ballari': { name: 'Ballari', state: 'Karnataka', country: 'India', countryCode: 'IN', latitude: 15.1394, longitude: 76.9214, timezone: 'Asia/Kolkata', population: 410445 },
  'bellary': { name: 'Ballari', state: 'Karnataka', country: 'India', countryCode: 'IN', latitude: 15.1394, longitude: 76.9214, timezone: 'Asia/Kolkata', population: 410445 },
  'chikkamagaluru': { name: 'Chikkamagaluru', state: 'Karnataka', country: 'India', countryCode: 'IN', latitude: 13.3161, longitude: 75.7720, timezone: 'Asia/Kolkata', population: 118401 },
  'hassan': { name: 'Hassan', state: 'Karnataka', country: 'India', countryCode: 'IN', latitude: 13.0033, longitude: 76.1004, timezone: 'Asia/Kolkata', population: 155006 },
  'mandya': { name: 'Mandya', state: 'Karnataka', country: 'India', countryCode: 'IN', latitude: 12.5244, longitude: 76.8958, timezone: 'Asia/Kolkata', population: 137358 },
  'udupi': { name: 'Udupi', state: 'Karnataka', country: 'India', countryCode: 'IN', latitude: 13.3409, longitude: 74.7421, timezone: 'Asia/Kolkata', population: 125306 },
  'kodagu': { name: 'Kodagu', state: 'Karnataka', country: 'India', countryCode: 'IN', latitude: 12.4244, longitude: 75.7382, timezone: 'Asia/Kolkata', population: 554762 },
  'coorg': { name: 'Kodagu', state: 'Karnataka', country: 'India', countryCode: 'IN', latitude: 12.4244, longitude: 75.7382, timezone: 'Asia/Kolkata', population: 554762 },
  'chitradurga': { name: 'Chitradurga', state: 'Karnataka', country: 'India', countryCode: 'IN', latitude: 14.2251, longitude: 76.3980, timezone: 'Asia/Kolkata', population: 145806 },
  'raichur': { name: 'Raichur', state: 'Karnataka', country: 'India', countryCode: 'IN', latitude: 16.2076, longitude: 77.3463, timezone: 'Asia/Kolkata', population: 234073 },
  'vijayapura': { name: 'Vijayapura', state: 'Karnataka', country: 'India', countryCode: 'IN', latitude: 16.8302, longitude: 75.7100, timezone: 'Asia/Kolkata', population: 327427 },
  'bijapur': { name: 'Vijayapura', state: 'Karnataka', country: 'India', countryCode: 'IN', latitude: 16.8302, longitude: 75.7100, timezone: 'Asia/Kolkata', population: 327427 },
  'koppal': { name: 'Koppal', state: 'Karnataka', country: 'India', countryCode: 'IN', latitude: 15.3456, longitude: 76.1558, timezone: 'Asia/Kolkata', population: 70649 },
  'bidar': { name: 'Bidar', state: 'Karnataka', country: 'India', countryCode: 'IN', latitude: 17.9104, longitude: 77.5199, timezone: 'Asia/Kolkata', population: 216020 },
  'bagalkot': { name: 'Bagalkot', state: 'Karnataka', country: 'India', countryCode: 'IN', latitude: 16.1817, longitude: 75.6615, timezone: 'Asia/Kolkata', population: 111935 }
};

// Major Global & Indian Metropolises
const MAJOR_GLOBAL_CITIES_DB = {
  'london': { name: 'London', state: 'England', country: 'United Kingdom', countryCode: 'GB', latitude: 51.5074, longitude: -0.1278, timezone: 'Europe/London', population: 8982000 },
  'tokyo': { name: 'Tokyo', state: 'Tokyo', country: 'Japan', countryCode: 'JP', latitude: 35.6762, longitude: 139.6503, timezone: 'Asia/Tokyo', population: 13960000 },
  'new york': { name: 'New York', state: 'New York', country: 'United States', countryCode: 'US', latitude: 40.7128, longitude: -74.0060, timezone: 'America/New_York', population: 8336817 },
  'paris': { name: 'Paris', state: 'Île-de-France', country: 'France', countryCode: 'FR', latitude: 48.8566, longitude: 2.3522, timezone: 'Europe/Paris', population: 2161000 },
  'dubai': { name: 'Dubai', state: 'Dubai', country: 'United Arab Emirates', countryCode: 'AE', latitude: 25.2048, longitude: 55.2708, timezone: 'Asia/Dubai', population: 3331420 },
  'singapore': { name: 'Singapore', state: '', country: 'Singapore', countryCode: 'SG', latitude: 1.3521, longitude: 103.8198, timezone: 'Asia/Singapore', population: 5686000 },
  'sydney': { name: 'Sydney', state: 'New South Wales', country: 'Australia', countryCode: 'AU', latitude: -33.8688, longitude: 151.2093, timezone: 'Australia/Sydney', population: 5312000 },
  'toronto': { name: 'Toronto', state: 'Ontario', country: 'Canada', countryCode: 'CA', latitude: 43.6532, longitude: -79.3832, timezone: 'America/Toronto', population: 2794356 },
  'los angeles': { name: 'Los Angeles', state: 'California', country: 'United States', countryCode: 'US', latitude: 34.0522, longitude: -118.2437, timezone: 'America/Los_Angeles', population: 3898747 },
  'chicago': { name: 'Chicago', state: 'Illinois', country: 'United States', countryCode: 'US', latitude: 41.8781, longitude: -87.6298, timezone: 'America/Chicago', population: 2746388 },
  'berlin': { name: 'Berlin', state: 'Berlin', country: 'Germany', countryCode: 'DE', latitude: 52.5200, longitude: 13.4050, timezone: 'Europe/Berlin', population: 3645000 },
  'rome': { name: 'Rome', state: 'Lazio', country: 'Italy', countryCode: 'IT', latitude: 41.9028, longitude: 12.4964, timezone: 'Europe/Rome', population: 2873000 },
  'madrid': { name: 'Madrid', state: 'Community of Madrid', country: 'Spain', countryCode: 'ES', latitude: 40.4168, longitude: -3.7038, timezone: 'Europe/Madrid', population: 3223000 },
  'mumbai': { name: 'Mumbai', state: 'Maharashtra', country: 'India', countryCode: 'IN', latitude: 19.0760, longitude: 72.8777, timezone: 'Asia/Kolkata', population: 12442373 },
  'delhi': { name: 'Delhi', state: 'Delhi', country: 'India', countryCode: 'IN', latitude: 28.6519, longitude: 77.2315, timezone: 'Asia/Kolkata', population: 16787941 },
  'hyderabad': { name: 'Hyderabad', state: 'Telangana', country: 'India', countryCode: 'IN', latitude: 17.3850, longitude: 78.4867, timezone: 'Asia/Kolkata', population: 6809970 },
  'chennai': { name: 'Chennai', state: 'Tamil Nadu', country: 'India', countryCode: 'IN', latitude: 13.0827, longitude: 80.2707, timezone: 'Asia/Kolkata', population: 7088003 },
  'pune': { name: 'Pune', state: 'Maharashtra', country: 'India', countryCode: 'IN', latitude: 18.5204, longitude: 73.8567, timezone: 'Asia/Kolkata', population: 3124458 },
  'kolkata': { name: 'Kolkata', state: 'West Bengal', country: 'India', countryCode: 'IN', latitude: 22.5726, longitude: 88.3639, timezone: 'Asia/Kolkata', population: 4496694 },
  'ahmedabad': { name: 'Ahmedabad', state: 'Gujarat', country: 'India', countryCode: 'IN', latitude: 23.0225, longitude: 72.5714, timezone: 'Asia/Kolkata', population: 5577940 },
  'jaipur': { name: 'Jaipur', state: 'Rajasthan', country: 'India', countryCode: 'IN', latitude: 26.9124, longitude: 75.7873, timezone: 'Asia/Kolkata', population: 3046163 },
  'lucknow': { name: 'Lucknow', state: 'Uttar Pradesh', country: 'India', countryCode: 'IN', latitude: 26.8467, longitude: 80.9462, timezone: 'Asia/Kolkata', population: 2817105 },
  'bhopal': { name: 'Bhopal', state: 'Madhya Pradesh', country: 'India', countryCode: 'IN', latitude: 23.2599, longitude: 77.4126, timezone: 'Asia/Kolkata', population: 1798218 },
  'patna': { name: 'Patna', state: 'Bihar', country: 'India', countryCode: 'IN', latitude: 25.5941, longitude: 85.1376, timezone: 'Asia/Kolkata', population: 1684222 },
  'kochi': { name: 'Kochi', state: 'Kerala', country: 'India', countryCode: 'IN', latitude: 9.9312, longitude: 76.2673, timezone: 'Asia/Kolkata', population: 602046 },
  'coimbatore': { name: 'Coimbatore', state: 'Tamil Nadu', country: 'India', countryCode: 'IN', latitude: 11.0168, longitude: 76.9558, timezone: 'Asia/Kolkata', population: 1050721 },
  'visakhapatnam': { name: 'Visakhapatnam', state: 'Andhra Pradesh', country: 'India', countryCode: 'IN', latitude: 17.6868, longitude: 83.2185, timezone: 'Asia/Kolkata', population: 1728128 },
  'surat': { name: 'Surat', state: 'Gujarat', country: 'India', countryCode: 'IN', latitude: 21.1702, longitude: 72.8311, timezone: 'Asia/Kolkata', population: 4467797 }
};

// Aliases for Indian and global cities
const LOCATION_ALIASES = {
  bangalore: 'Bengaluru',
  mysore: 'Mysuru',
  mangalore: 'Mangalore',
  mangaluru: 'Mangalore',
  davanagere: 'Davanagere',
  davangere: 'Davanagere',
  hubli: 'Hubballi',
  belgaum: 'Belagavi',
  bombay: 'Mumbai',
  calcutta: 'Kolkata',
  madras: 'Chennai',
  bellary: 'Ballari',
  shimoga: 'Shivamogga',
  tumkur: 'Tumakuru',
  gulbarga: 'Kalaburagi',
  bijapur: 'Vijayapura',
  coorg: 'Kodagu',
  baroda: 'Vadodara',
  cochin: 'Kochi',
  trivandrum: 'Thiruvananthapuram',
  benares: 'Varanasi',
  banaras: 'Varanasi',
  poona: 'Pune',
  calicut: 'Kozhikode',
  pondicherry: 'Puducherry',
  peking: 'Beijing',
  kyiv: 'Kiev'
};

/**
 * Normalizes Open-Meteo geocoding result into standard internal location object
 */
export function normalizeOpenMeteoResult(r) {
  const name = r.name || '';
  const state = r.admin1 || '';
  const district = r.admin2 || r.admin3 || '';
  const country = r.country || '';
  const countryCode = (r.country_code || '').toUpperCase();

  const parts = [name];
  if (state && state !== name) parts.push(state);
  if (country && country !== state) parts.push(country);
  const displayName = parts.join(', ');

  return {
    id: `om_${r.id || `${r.latitude}_${r.longitude}`}`,
    name,
    latitude: Number(r.latitude),
    longitude: Number(r.longitude),
    country,
    countryCode,
    state,
    district,
    timezone: r.timezone || 'auto',
    population: Number(r.population) || 0,
    displayName,
    featureCode: r.feature_code || 'PPL',
    source: 'open-meteo'
  };
}

/**
 * Normalizes OpenStreetMap Nominatim result into standard internal location object
 */
export function normalizeNominatimResult(r) {
  const addr = r.address || {};
  const name = addr.city || addr.town || addr.village || addr.suburb || addr.municipality || addr.state_district || r.name || (r.display_name ? r.display_name.split(',')[0].trim() : 'Unknown');
  const state = addr.state || addr.province || addr.region || '';
  const district = addr.state_district || addr.county || '';
  const country = addr.country || '';
  const countryCode = (addr.country_code || '').toUpperCase();

  const parts = [name];
  if (state && state !== name) parts.push(state);
  if (country && country !== state) parts.push(country);
  const displayName = parts.join(', ');

  return {
    id: `nom_${r.place_id || `${r.lat}_${r.lon}`}`,
    name,
    latitude: Number(r.lat),
    longitude: Number(r.lon),
    country,
    countryCode,
    state,
    district,
    timezone: 'auto',
    population: 0,
    displayName: displayName || r.display_name,
    featureCode: r.type || 'PPL',
    source: 'nominatim'
  };
}

/**
 * Searches locations worldwide with Open-Meteo primary and Nominatim fallback.
 * Supports countries, states, districts, cities, towns, villages, and partial queries.
 * @param {string} query 
 * @returns {Promise<Array<Object>>}
 */
export async function searchLocations(query) {
  const clean = (query || '').trim();
  if (!clean || clean.length < 2) return [];

  const lower = clean.toLowerCase();
  const rawResults = [];

  // 1. Check Indian States DB
  for (const [key, stateData] of Object.entries(INDIAN_STATES_DB)) {
    if (key === lower || key.startsWith(lower) || lower.startsWith(key)) {
      rawResults.push({
        id: `state_${key}`,
        name: stateData.name,
        state: stateData.admin1,
        district: '',
        country: stateData.country,
        countryCode: stateData.country_code,
        latitude: stateData.latitude,
        longitude: stateData.longitude,
        timezone: stateData.timezone,
        population: stateData.population,
        displayName: `${stateData.name}, India`,
        featureCode: 'ADM1',
        source: 'preset'
      });
    }
  }

  // 2. Check Karnataka Districts DB
  for (const [key, distData] of Object.entries(KARNATAKA_DISTRICTS_DB)) {
    if (key === lower || key.startsWith(lower) || lower.startsWith(key)) {
      rawResults.push({
        id: `ka_${key}`,
        name: distData.name,
        state: distData.state,
        district: distData.name,
        country: distData.country,
        countryCode: distData.countryCode,
        latitude: distData.latitude,
        longitude: distData.longitude,
        timezone: distData.timezone,
        population: distData.population,
        displayName: `${distData.name}, ${distData.state}, ${distData.country}`,
        featureCode: 'PPLA',
        source: 'preset'
      });
    }
  }

  // 3. Check Major Global Cities DB
  for (const [key, cityData] of Object.entries(MAJOR_GLOBAL_CITIES_DB)) {
    if (key === lower || key.startsWith(lower) || lower.startsWith(key)) {
      rawResults.push({
        id: `major_${key}`,
        name: cityData.name,
        state: cityData.state,
        district: cityData.name,
        country: cityData.country,
        countryCode: cityData.countryCode,
        latitude: cityData.latitude,
        longitude: cityData.longitude,
        timezone: cityData.timezone,
        population: cityData.population,
        displayName: cityData.state ? `${cityData.name}, ${cityData.state}, ${cityData.country}` : `${cityData.name}, ${cityData.country}`,
        featureCode: 'PPLC',
        source: 'preset'
      });
    }
  }

  // 4. Primary Provider: Query Open-Meteo Geocoding API (count=20)
  let openMeteoSuccessCount = 0;
  const queries = [clean];
  const aliased = LOCATION_ALIASES[lower];
  if (aliased && aliased.toLowerCase() !== lower) {
    queries.push(aliased);
  }

  for (const q of queries) {
    const urls = getGeocodingUrls(q, 20);
    let matched = false;

    for (const url of urls) {
      if (matched) break;
      try {
        const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
        const timeoutId = controller ? setTimeout(() => controller.abort('Geocoding timeout'), 7000) : null;

        const res = await fetch(url, { signal: controller?.signal });
        if (timeoutId) clearTimeout(timeoutId);

        if (res.ok) {
          const data = await res.json();
          if (data.results && data.results.length > 0) {
            openMeteoSuccessCount += data.results.length;
            data.results.forEach((r) => {
              rawResults.push(normalizeOpenMeteoResult(r));
            });
            matched = true;
          }
        }
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.debug('Geocoding query fallback for', q, err.message);
        }
      }
    }
  }

  // 5. Fallback Provider: OpenStreetMap Nominatim (only if Open-Meteo returned 0 usable results)
  if (openMeteoSuccessCount === 0) {
    try {
      const nomUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(clean)}&format=jsonv2&addressdetails=1&limit=10`;
      const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
      const timeoutId = controller ? setTimeout(() => controller.abort('Nominatim timeout'), 7000) : null;

      const res = await fetch(nomUrl, {
        signal: controller?.signal,
        headers: {
          'User-Agent': 'WeatherInformationDashboard/1.0 (academic BCA project; contact@weatherdashboard.edu)'
        }
      });
      if (timeoutId) clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          data.forEach((r) => {
            rawResults.push(normalizeNominatimResult(r));
          });
        }
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.debug('Nominatim fallback geocoding error for', clean, err.message);
      }
    }
  }

  // 6. Deduplicate results by name + state + country and coordinate proximity
  const seen = new Set();
  const unique = [];
  for (const item of rawResults) {
    const dedupeKey = `${item.name.toLowerCase()}_${(item.state || '').toLowerCase()}_${(item.country || '').toLowerCase()}`;
    const coordKey = `${item.latitude.toFixed(2)}_${item.longitude.toFixed(2)}`;
    if (!seen.has(dedupeKey) && !seen.has(coordKey)) {
      seen.add(dedupeKey);
      seen.add(coordKey);
      unique.push(item);
    }
  }

  // 7. Intelligent Score-Based Ranking & Prioritization
  const getScore = (item) => {
    let score = 0;
    const nameLower = item.name.toLowerCase();
    const pop = item.population || 0;
    const isExact = nameLower === lower || (aliased && nameLower === aliased.toLowerCase());
    const startsWith = nameLower.startsWith(lower);
    const isPlace = item.featureCode && (item.featureCode.startsWith('PPL') || item.featureCode.startsWith('ADM'));

    if (isExact) {
      if (pop > 500000) score += 150000 + Math.min(pop / 100, 50000);
      else if (pop > 50000) score += 90000 + Math.min(pop / 100, 30000);
      else if (pop > 0) score += 40000 + Math.min(pop / 100, 10000);
      else score += 15000;
    } else if (startsWith) {
      if (pop > 1000000) score += 100000 + Math.min(pop / 100, 50000);
      else if (pop > 200000) score += 70000 + Math.min(pop / 100, 25000);
      else if (pop > 50000) score += 45000 + Math.min(pop / 100, 15000);
      else if (pop > 0) score += 25000 + Math.min(pop / 100, 5000);
      else score += 8000;
    } else {
      score += Math.min(pop / 1000, 5000);
    }

    if (item.source === 'preset') score += 20000;
    if (isPlace) score += 3000;
    if (item.countryCode === 'IN' || item.country === 'India') score += 4000;

    return score;
  };

  unique.sort((a, b) => getScore(b) - getScore(a));

  return unique.slice(0, 8);
}

/**
 * Reverse geocode latitude and longitude using OpenStreetMap Nominatim with BigDataCloud and coordinate fallbacks.
 * @param {number} latitude 
 * @param {number} longitude 
 * @returns {Promise<{ city: string, country: string, name: string, state: string, district: string, displayName: string }>}
 */
export async function reverseGeocode(latitude, longitude) {
  // 1. Primary: Nominatim Reverse Geocoding
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=jsonv2&zoom=10&addressdetails=1`;
    const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
    const timeoutId = controller ? setTimeout(() => controller.abort(), 3500) : null;

    const res = await fetch(url, {
      signal: controller?.signal,
      headers: {
        'User-Agent': 'WeatherInformationDashboard/1.0 (academic BCA project; contact@weatherdashboard.edu)'
      }
    });
    if (timeoutId) clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      const addr = data.address || {};
      const name = addr.city || addr.town || addr.village || addr.suburb || addr.municipality || addr.county || addr.state_district || data.name || (data.display_name ? data.display_name.split(',')[0].trim() : 'Detected Location');
      const state = addr.state || addr.province || addr.region || '';
      const country = addr.country || '';
      const stateCountry = [state, country].filter(Boolean).join(', ');

      return {
        city: name,
        country: stateCountry || country || 'Global',
        name,
        state,
        district: addr.state_district || addr.county || '',
        displayName: data.display_name || `${name}, ${stateCountry}`
      };
    }
  } catch (err) {
    console.warn('Nominatim reverse geocoding error:', err);
  }

  // 2. Secondary fallback: BigDataCloud
  try {
    const res = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
    );
    if (res.ok) {
      const data = await res.json();
      const city = data.city || data.locality || data.principalSubdivision || 'Detected Location';
      const country = data.countryName || 'Global';
      return {
        city,
        country,
        name: city,
        state: data.principalSubdivision || '',
        district: '',
        displayName: `${city}, ${country}`
      };
    }
  } catch (err) {
    console.warn('BigDataCloud reverse geocode error:', err);
  }

  // 3. Coordinate fallback
  return {
    city: `Location (${latitude.toFixed(2)}°, ${longitude.toFixed(2)}°)`,
    country: 'Coordinates',
    name: `Lat: ${latitude.toFixed(2)}, Lon: ${longitude.toFixed(2)}`,
    state: '',
    district: '',
    displayName: `${latitude.toFixed(2)}°, ${longitude.toFixed(2)}°`
  };
}

/**
 * Parses time string and calculates daylight duration and progress
 * @param {string} sunriseIso 
 * @param {string} sunsetIso 
 * @param {string} currentIso 
 */
function calculateSunMetrics(sunriseIso, sunsetIso, currentIso) {
  if (!sunriseIso || !sunsetIso) {
    return { sunrise: '--', sunset: '--', dayLength: '--', progress: 50 };
  }

  const parseMinutes = (iso) => {
    const timePart = iso.includes('T') ? iso.split('T')[1] : iso;
    const [h, m] = timePart.split(':').map(Number);
    return h * 60 + m;
  };

  const riseMin = parseMinutes(sunriseIso);
  const setMin = parseMinutes(sunsetIso);
  const curMin = currentIso ? parseMinutes(currentIso) : 720;

  const totalDayMin = Math.max(1, setMin - riseMin);
  const hours = Math.floor(totalDayMin / 60);
  const minutes = totalDayMin % 60;
  const dayLength = `${hours}h ${minutes.toString().padStart(2, '0')}m`;

  let progress = 50;
  if (curMin <= riseMin) {
    progress = 0;
  } else if (curMin >= setMin) {
    progress = 100;
  } else {
    progress = Math.round(((curMin - riseMin) / totalDayMin) * 100);
  }

  return {
    sunrise: formatTime(sunriseIso),
    sunset: formatTime(sunsetIso),
    dayLength,
    progress: Math.min(100, Math.max(0, progress))
  };
}

/**
 * Generates natural language meteorological summary based on live metrics
 */
function generateNaturalSummary(cityName, current, daily, condition) {
  const temp = Math.round(current.temperature_2m);
  const max = Math.round(daily.temperature_2m_max[0]);
  const min = Math.round(daily.temperature_2m_min[0]);
  const rainChance = daily.precipitation_probability_max[0] || 0;
  const windSpeed = Math.round(current.wind_speed_10m);

  let windDesc = 'light breezes';
  if (windSpeed > 35) windDesc = 'gusty winds';
  else if (windSpeed > 18) windDesc = 'a moderate breeze';

  let rainDesc = 'Low chance of precipitation.';
  if (rainChance > 70) rainDesc = 'High probability of rain throughout the day.';
  else if (rainChance > 30) rainDesc = 'Occasional showers possible today.';

  return `Currently in ${cityName}, expect ${condition.toLowerCase()} with temperatures around ${temp}°C. Daytime temperatures will peak near ${max}°C before dipping to ${min}°C overnight with ${windDesc}. ${rainDesc}`;
}

/**
 * Checks for severe meteorological alerts from live data
 */
function detectSevereWeatherAlert(current, hourly, daily, aqiVal) {
  const code = current.weather_code;
  const windSpeed = current.wind_speed_10m;
  const uvMax = daily.uv_index_max ? daily.uv_index_max[0] : 0;

  // Severe Thunderstorm
  if (code === 95 || code === 96 || code === 99) {
    return {
      hasAlert: true,
      severity: 'warning',
      title: 'Thunderstorm Warning',
      description: 'Active lightning strikes, torrential rain, and possible hail detected in the region. Seek sturdy shelter immediately.',
      issued: 'Active now',
      expires: 'Until storm system passes'
    };
  }

  // Violent Rain / Heavy Showers
  if (code === 65 || code === 82) {
    return {
      hasAlert: true,
      severity: 'warning',
      title: 'Heavy Rainfall Warning',
      description: 'Intense rain showers observed. Potential waterlogging and reduced visibility on roadways. Drive with caution.',
      issued: 'Active now',
      expires: 'Next 6 hours'
    };
  }

  // High Winds / Gale
  if (windSpeed >= 45) {
    return {
      hasAlert: true,
      severity: 'warning',
      title: 'Gale Wind Advisory',
      description: `Sustained high winds exceeding ${Math.round(windSpeed)} km/h. Secure loose outdoor furniture and exercise caution outdoors.`,
      issued: 'Active now',
      expires: 'This evening'
    };
  }

  // Dense Fog
  if (code === 45 || code === 48) {
    return {
      hasAlert: true,
      severity: 'advisory',
      title: 'Dense Fog Advisory',
      description: 'Heavy fog is causing significantly reduced surface visibility. Allow extra travel time and use fog headlights.',
      issued: 'Active now',
      expires: 'Until morning clearing'
    };
  }

  // Extreme UV
  if (uvMax >= 10 && current.is_day) {
    return {
      hasAlert: true,
      severity: 'advisory',
      title: 'Very High UV Radiation Alert',
      description: `Peak UV index reaching ${Math.round(uvMax)}. Minimize direct sun exposure during midday hours and apply SPF 50+ sunscreen.`,
      issued: 'Daytime advisory',
      expires: 'Until sunset'
    };
  }

  // Hazardous Air Quality
  if (aqiVal > 150) {
    return {
      hasAlert: true,
      severity: 'warning',
      title: 'Unhealthy Air Quality Alert',
      description: `AQI levels have risen to ${aqiVal}. Sensitive groups and general public should avoid prolonged outdoor exertion and wear protective masks.`,
      issued: 'Active now',
      expires: 'Pending atmospheric dispersion'
    };
  }

  return null;
}

/**
 * Fetch and assemble complete weather dashboard dataset from Open-Meteo APIs.
 * Requests full suite of hourly parameters for interactive hourly forecast.
 * @param {number} latitude 
 * @param {number} longitude 
 * @param {string} cityName 
 * @param {string} countryName 
 * @param {string} locationTimezone
 * @returns {Promise<Object>}
 */
export async function fetchLiveWeatherData(latitude, longitude, cityName, countryName, locationTimezone = 'auto') {
  // 1. Forecast API URL with extended hourly parameters
  const forecastUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,cloud_cover,surface_pressure,wind_speed_10m,wind_direction_10m&hourly=temperature_2m,apparent_temperature,relative_humidity_2m,precipitation_probability,precipitation,weather_code,wind_speed_10m,wind_direction_10m,visibility,uv_index,cloud_cover,is_day&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_probability_max,uv_index_max&timezone=auto`;

  // 2. Air Quality Fetch with dev proxy support to prevent browser cert authority invalid errors
  const fetchSafeAirQuality = async () => {
    const urls = getAirQualityUrls(latitude, longitude);
    for (const url of urls) {
      try {
        const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
        const timer = controller ? setTimeout(() => controller.abort('Air quality timeout'), 5000) : null;
        const res = await fetch(url, { signal: controller?.signal });
        if (timer) clearTimeout(timer);
        if (res.ok) {
          return await res.json();
        }
      } catch {
        // try next endpoint or return null quietly
      }
    }
    return null;
  };

  // Execute requests in parallel
  const [forecastRes, airQuality] = await Promise.all([
    fetch(forecastUrl),
    fetchSafeAirQuality()
  ]);

  if (!forecastRes.ok) {
    throw new Error(`Open-Meteo forecast service returned status ${forecastRes.status}.`);
  }

  const forecast = await forecastRes.json();

  const { current, hourly, daily } = forecast;

  // Determine current hour index in the hourly timeline
  const currentHourPrefix = current.time.slice(0, 13);
  let curIndex = hourly.time.findIndex((t) => t.startsWith(currentHourPrefix));
  if (curIndex === -1) curIndex = 0;

  // Current condition text
  const condition = getConditionFromCode(current.weather_code, current.is_day);

  // Single normalized current temperature source of truth
  const currentTempNormalized = Math.round(current.temperature_2m);
  const currentFeelsLike = Math.round(current.apparent_temperature);

  // Hourly visibility & UV index
  const currentVisibilityMeters = hourly.visibility ? hourly.visibility[curIndex] : 10000;
  const visibilityKm = (currentVisibilityMeters / 1000).toFixed(1);
  const currentUvIndex = hourly.uv_index ? Math.round(hourly.uv_index[curIndex] || 0) : Math.round(daily.uv_index_max?.[0] || 0);

  // Air Quality Processing
  const aqiVal = airQuality?.current?.us_aqi || airQuality?.current?.european_aqi || 42;
  const aqiInfo = getAQIInfo(aqiVal);
  const airQualityData = {
    aqi: Math.round(aqiVal),
    value: Math.round(aqiVal),
    pm25: airQuality?.current?.pm2_5 != null ? Number(airQuality.current.pm2_5).toFixed(1) : '10.5',
    pm10: airQuality?.current?.pm10 != null ? Number(airQuality.current.pm10).toFixed(1) : '18.2',
    o3: airQuality?.current?.ozone != null ? Math.round(airQuality.current.ozone) : 34,
    ozone: airQuality?.current?.ozone != null ? Math.round(airQuality.current.ozone) : 34,
    no2: airQuality?.current?.nitrogen_dioxide != null ? Math.round(airQuality.current.nitrogen_dioxide) : 20,
    nitrogenDioxide: airQuality?.current?.nitrogen_dioxide != null ? Math.round(airQuality.current.nitrogen_dioxide) : 20,
    status: aqiInfo.label
  };

  // Sun Cycle Metrics
  const sunriseIso = daily.sunrise?.[0];
  const sunsetIso = daily.sunset?.[0];
  const sunInfo = calculateSunMetrics(sunriseIso, sunsetIso, current.time);

  // Hourly Forecast (Next 24 hours starting from current hour)
  // Ensure the "Now" forecast (offset 0) uses the exact same normalized current weather values
  const next24Times = hourly.time.slice(curIndex, curIndex + 24);
  const hourlyData = next24Times.map((timeStr, offset) => {
    const idx = curIndex + offset;
    const isNow = offset === 0;
    const hourWindDeg = isNow ? current.wind_direction_10m : (hourly.wind_direction_10m?.[idx] || 0);

    return {
      time: timeStr,
      temp: isNow ? currentTempNormalized : Math.round(hourly.temperature_2m[idx]),
      feelsLike: isNow ? currentFeelsLike : Math.round(hourly.apparent_temperature?.[idx] ?? hourly.temperature_2m[idx]),
      condition: isNow ? condition : getConditionFromCode(hourly.weather_code[idx], hourly.is_day[idx]),
      rainProb: hourly.precipitation_probability ? Math.round(hourly.precipitation_probability[idx] || 0) : 0,
      precipitation: hourly.precipitation ? Number(hourly.precipitation[idx] || 0).toFixed(1) : '0.0',
      humidity: isNow ? current.relative_humidity_2m : Math.round(hourly.relative_humidity_2m?.[idx] || 0),
      windSpeed: isNow ? Math.round(current.wind_speed_10m) : Math.round(hourly.wind_speed_10m?.[idx] || 0),
      windDirection: getWindDirectionCardinal(hourWindDeg),
      windDirectionShort: getWindDirectionShort(hourWindDeg),
      visibility: hourly.visibility ? Number((hourly.visibility[idx] / 1000).toFixed(1)) : Number(visibilityKm),
      uvIndex: hourly.uv_index ? Math.round(hourly.uv_index[idx] || 0) : (isNow ? currentUvIndex : 0),
      cloudCover: hourly.cloud_cover ? Math.round(hourly.cloud_cover[idx] || 0) : current.cloud_cover,
      isNight: isNow ? current.is_day === 0 : hourly.is_day[idx] === 0,
      isNow
    };
  });

  // 7-Day Extended Forecast
  const weeklyData = daily.time.map((dateStr, i) => {
    const { dayName, dateLabel } = formatDayDate(dateStr);
    const high = Math.round(daily.temperature_2m_max[i]);
    const low = Math.round(daily.temperature_2m_min[i]);
    const rainProb = daily.precipitation_probability_max ? Math.round(daily.precipitation_probability_max[i] || 0) : 0;
    const cond = getConditionFromCode(daily.weather_code[i], 1);
    const uvMax = daily.uv_index_max ? Number(daily.uv_index_max[i]) : 0;

    return {
      day: i === 0 ? 'Today' : dayName,
      dayName: i === 0 ? 'Today' : dayName,
      date: dateLabel,
      dateLabel,
      dateStr,
      condition: cond,
      high,
      low,
      tempMax: high,
      tempMin: low,
      rainProb,
      pop: rainProb,
      uvIndexMax: uvMax
    };
  });

  // Severe Alert
  const alert = detectSevereWeatherAlert(current, hourly, daily, aqiVal);

  // Summary
  const summary = generateNaturalSummary(cityName, current, daily, condition);

  return {
    city: cityName,
    country: countryName,
    location: {
      city: cityName,
      country: countryName,
      latitude,
      longitude
    },
    timezone: forecast.timezone || 'Asia/Kolkata',
    coordinates: { lat: latitude, lon: longitude },
    current: {
      temp: currentTempNormalized,
      feelsLike: currentFeelsLike,
      condition,
      high: Math.round(daily.temperature_2m_max[0]),
      low: Math.round(daily.temperature_2m_min[0]),
      humidity: current.relative_humidity_2m,
      windSpeed: Math.round(current.wind_speed_10m),
      windDirection: getWindDirectionCardinal(current.wind_direction_10m),
      pressure: Math.round(current.surface_pressure),
      visibility: Number(visibilityKm),
      uvIndex: currentUvIndex,
      cloudCover: current.cloud_cover,
      isNight: current.is_day === 0,
      updatedAt: 'Live'
    },
    airQuality: airQualityData,
    sunInfo,
    alert,
    summary,
    hourly: hourlyData,
    weekly: weeklyData,
    daily: weeklyData
  };
}

/**
 * Public function: Fetch complete dashboard weather data for a city name or location object
 * @param {string|Object} queryOrLocation 
 * @returns {Promise<Object>}
 */
export async function fetchWeatherData(queryOrLocation = 'Bangalore') {
  try {
    // If a pre-resolved location object is provided (e.g. clicked from dropdown)
    if (typeof queryOrLocation === 'object' && queryOrLocation !== null && queryOrLocation.latitude) {
      const loc = queryOrLocation;
      const formattedCountry = loc.state ? `${loc.state}, ${loc.country}` : loc.country;
      return await fetchLiveWeatherData(loc.latitude, loc.longitude, loc.name, formattedCountry, loc.timezone);
    }

    const cityName = String(queryOrLocation).trim();
    if (!cityName) {
      throw new Error('Please enter a location name to search.');
    }

    // Search locations using India-aware geocoding
    const matches = await searchLocations(cityName);
    if (!matches || matches.length === 0) {
      throw new Error(`Location "${cityName}" not found. Please check spelling or try another location.`);
    }

    const top = matches[0];
    const formattedCountry = top.state ? `${top.state}, ${top.country}` : top.country;
    return await fetchLiveWeatherData(top.latitude, top.longitude, top.name, formattedCountry, top.timezone);
  } catch (err) {
    console.error('Error fetching live weather for', queryOrLocation, err);
    throw err;
  }
}

/**
 * Public function: Fetch weather by GPS coordinates (Browser Geolocation)
 * @param {number} latitude 
 * @param {number} longitude 
 * @returns {Promise<Object>}
 */
export async function fetchWeatherByCoordinates(latitude, longitude) {
  try {
    const location = await reverseGeocode(latitude, longitude);
    return await fetchLiveWeatherData(latitude, longitude, location.city, location.country);
  } catch (err) {
    console.error('Error fetching live weather for coordinates', latitude, longitude, err);
    throw err;
  }
}
