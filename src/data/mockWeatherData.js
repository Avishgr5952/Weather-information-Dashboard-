/**
 * Realistic Mock Weather Database for development and testing.
 * Provides complete data structures matching what a production weather API provides.
 */

export const mockWeatherData = {
  "london": {
    city: "London",
    country: "United Kingdom",
    coordinates: { lat: 51.5074, lon: -0.1278 },
    current: {
      temp: 18,
      feelsLike: 17,
      condition: "Partly Cloudy",
      high: 21,
      low: 13,
      humidity: 68,
      windSpeed: 18,
      windDirection: "SW (225°)",
      pressure: 1015,
      visibility: 10,
      uvIndex: 4,
      cloudCover: 55,
      isNight: false,
      updatedAt: "Just now"
    },
    airQuality: {
      aqi: 38,
      pm25: 9.2,
      pm10: 16.4,
      o3: 42,
      no2: 21,
      status: "Good"
    },
    sunInfo: {
      sunrise: "06:48 AM",
      sunset: "06:58 PM",
      dayLength: "12h 10m",
      progress: 68 // % of daylight elapsed
    },
    alert: {
      hasAlert: true,
      severity: "advisory",
      title: "Breezy Wind Advisory",
      description: "Gusty southwest winds up to 40 km/h expected along open areas and bridges this evening. Secure loose outdoor objects.",
      issued: "Today at 10:30 AM",
      expires: "Today at 9:00 PM"
    },
    summary: "Today in London brings pleasant mild autumn conditions with scattered clouds and occasional sunshine. Light southwest breezes keep temperatures comfortable around 18°C.",
    hourly: [
      { time: "00:00", temp: 14, condition: "Partly Cloudy", rainProb: 10, isNight: true },
      { time: "02:00", temp: 13, condition: "Clear", rainProb: 5, isNight: true },
      { time: "04:00", temp: 13, condition: "Clear", rainProb: 5, isNight: true },
      { time: "06:00", temp: 14, condition: "Clear", rainProb: 10, isNight: false },
      { time: "08:00", temp: 15, condition: "Partly Cloudy", rainProb: 15, isNight: false },
      { time: "10:00", temp: 17, condition: "Partly Cloudy", rainProb: 20, isNight: false },
      { time: "12:00", temp: 19, condition: "Cloudy", rainProb: 25, isNight: false },
      { time: "14:00", temp: 21, condition: "Partly Cloudy", rainProb: 20, isNight: false },
      { time: "16:00", temp: 20, condition: "Sunny", rainProb: 10, isNight: false },
      { time: "18:00", temp: 18, condition: "Partly Cloudy", rainProb: 15, isNight: false },
      { time: "20:00", temp: 16, condition: "Clear", rainProb: 10, isNight: true },
      { time: "22:00", temp: 15, condition: "Clear", rainProb: 5, isNight: true }
    ],
    weekly: [
      { day: "Today", date: "Sep 25", condition: "Partly Cloudy", high: 21, low: 13, rainProb: 20 },
      { day: "Fri", date: "Sep 26", condition: "Light Rain", high: 19, low: 12, rainProb: 65 },
      { day: "Sat", date: "Sep 27", condition: "Sunny", high: 22, low: 14, rainProb: 10 },
      { day: "Sun", date: "Sep 28", condition: "Partly Cloudy", high: 20, low: 13, rainProb: 25 },
      { day: "Mon", date: "Sep 29", condition: "Cloudy", high: 18, low: 11, rainProb: 35 },
      { day: "Tue", date: "Sep 30", condition: "Heavy Rain", high: 16, low: 10, rainProb: 80 },
      { day: "Wed", date: "Oct 01", condition: "Partly Cloudy", high: 17, low: 11, rainProb: 30 }
    ]
  },

  "new york": {
    city: "New York",
    country: "United States",
    coordinates: { lat: 40.7128, lon: -74.0060 },
    current: {
      temp: 24,
      feelsLike: 25,
      condition: "Sunny",
      high: 26,
      low: 17,
      humidity: 52,
      windSpeed: 14,
      windDirection: "NW (315°)",
      pressure: 1018,
      visibility: 16,
      uvIndex: 7,
      cloudCover: 20,
      isNight: false,
      updatedAt: "Just now"
    },
    airQuality: {
      aqi: 45,
      pm25: 11.0,
      pm10: 19.5,
      o3: 35,
      no2: 18,
      status: "Good"
    },
    sunInfo: {
      sunrise: "06:45 AM",
      sunset: "06:52 PM",
      dayLength: "12h 07m",
      progress: 55
    },
    alert: null, // No active alert
    summary: "Clear blue skies and comfortable humidity across New York today. Highs approaching 26°C with low chance of rain throughout the day.",
    hourly: [
      { time: "00:00", temp: 18, condition: "Clear", rainProb: 0, isNight: true },
      { time: "02:00", temp: 17, condition: "Clear", rainProb: 0, isNight: true },
      { time: "04:00", temp: 17, condition: "Clear", rainProb: 0, isNight: true },
      { time: "06:00", temp: 18, condition: "Clear", rainProb: 0, isNight: false },
      { time: "08:00", temp: 20, condition: "Sunny", rainProb: 5, isNight: false },
      { time: "10:00", temp: 22, condition: "Sunny", rainProb: 5, isNight: false },
      { time: "12:00", temp: 25, condition: "Sunny", rainProb: 5, isNight: false },
      { time: "14:00", temp: 26, condition: "Sunny", rainProb: 10, isNight: false },
      { time: "16:00", temp: 25, condition: "Partly Cloudy", rainProb: 10, isNight: false },
      { time: "18:00", temp: 23, condition: "Clear", rainProb: 5, isNight: false },
      { time: "20:00", temp: 21, condition: "Clear", rainProb: 0, isNight: true },
      { time: "22:00", temp: 19, condition: "Clear", rainProb: 0, isNight: true }
    ],
    weekly: [
      { day: "Today", date: "Sep 25", condition: "Sunny", high: 26, low: 17, rainProb: 5 },
      { day: "Fri", date: "Sep 26", condition: "Partly Cloudy", high: 25, low: 18, rainProb: 20 },
      { day: "Sat", date: "Sep 27", condition: "Thunderstorm", high: 23, low: 16, rainProb: 75 },
      { day: "Sun", date: "Sep 28", condition: "Clear", high: 21, low: 14, rainProb: 10 },
      { day: "Mon", date: "Sep 29", condition: "Sunny", high: 23, low: 15, rainProb: 5 },
      { day: "Tue", date: "Sep 30", condition: "Partly Cloudy", high: 24, low: 16, rainProb: 15 },
      { day: "Wed", date: "Oct 01", condition: "Light Rain", high: 20, low: 13, rainProb: 50 }
    ]
  },

  "tokyo": {
    city: "Tokyo",
    country: "Japan",
    coordinates: { lat: 35.6762, lon: 139.6503 },
    current: {
      temp: 22,
      feelsLike: 22,
      condition: "Clear",
      high: 25,
      low: 16,
      humidity: 60,
      windSpeed: 11,
      windDirection: "E (90°)",
      pressure: 1016,
      visibility: 12,
      uvIndex: 5,
      cloudCover: 15,
      isNight: true,
      updatedAt: "Just now"
    },
    airQuality: {
      aqi: 28,
      pm25: 6.8,
      pm10: 12.1,
      o3: 28,
      no2: 15,
      status: "Good"
    },
    sunInfo: {
      sunrise: "05:32 AM",
      sunset: "05:37 PM",
      dayLength: "12h 05m",
      progress: 92
    },
    alert: null,
    summary: "Calm evening in Tokyo with clear starry skies and mild autumn temperatures settling around 22°C. Crisp air quality throughout metropolitan districts.",
    hourly: [
      { time: "00:00", temp: 18, condition: "Clear", rainProb: 0, isNight: true },
      { time: "02:00", temp: 17, condition: "Clear", rainProb: 0, isNight: true },
      { time: "04:00", temp: 16, condition: "Clear", rainProb: 0, isNight: true },
      { time: "06:00", temp: 18, condition: "Clear", rainProb: 0, isNight: false },
      { time: "08:00", temp: 20, condition: "Sunny", rainProb: 0, isNight: false },
      { time: "10:00", temp: 23, condition: "Sunny", rainProb: 5, isNight: false },
      { time: "12:00", temp: 25, condition: "Sunny", rainProb: 5, isNight: false },
      { time: "14:00", temp: 24, condition: "Partly Cloudy", rainProb: 10, isNight: false },
      { time: "16:00", temp: 23, condition: "Clear", rainProb: 5, isNight: false },
      { time: "18:00", temp: 21, condition: "Clear", rainProb: 0, isNight: true },
      { time: "20:00", temp: 19, condition: "Clear", rainProb: 0, isNight: true },
      { time: "22:00", temp: 18, condition: "Clear", rainProb: 0, isNight: true }
    ],
    weekly: [
      { day: "Today", date: "Sep 25", condition: "Clear", high: 25, low: 16, rainProb: 5 },
      { day: "Fri", date: "Sep 26", condition: "Partly Cloudy", high: 24, low: 17, rainProb: 15 },
      { day: "Sat", date: "Sep 27", condition: "Sunny", high: 26, low: 18, rainProb: 10 },
      { day: "Sun", date: "Sep 28", condition: "Light Rain", high: 21, low: 15, rainProb: 60 },
      { day: "Mon", date: "Sep 29", condition: "Cloudy", high: 20, low: 14, rainProb: 40 },
      { day: "Tue", date: "Sep 30", condition: "Sunny", high: 23, low: 15, rainProb: 10 },
      { day: "Wed", date: "Oct 01", condition: "Sunny", high: 24, low: 16, rainProb: 5 }
    ]
  },

  "mumbai": {
    city: "Mumbai",
    country: "India",
    coordinates: { lat: 19.0760, lon: 72.8777 },
    current: {
      temp: 31,
      feelsLike: 37,
      condition: "Thunderstorm",
      high: 33,
      low: 26,
      humidity: 84,
      windSpeed: 24,
      windDirection: "WSW (245°)",
      pressure: 1008,
      visibility: 6,
      uvIndex: 8,
      cloudCover: 90,
      isNight: false,
      updatedAt: "Just now"
    },
    airQuality: {
      aqi: 112,
      pm25: 41.5,
      pm10: 78.2,
      o3: 54,
      no2: 39,
      status: "Moderate"
    },
    sunInfo: {
      sunrise: "06:28 AM",
      sunset: "06:33 PM",
      dayLength: "12h 05m",
      progress: 60
    },
    alert: {
      hasAlert: true,
      severity: "warning",
      title: "Yellow Alert: Heavy Rainfall & Thunderstorms",
      description: "Moderate to intense spells of rain accompanied with thunderstorm and gusty winds reaching 40-50 kmph very likely to occur over Mumbai and coastal districts.",
      issued: "Today at 08:00 AM",
      expires: "Tomorrow at 06:00 AM"
    },
    summary: "Monsoon showers and thunderstorms active across coastal areas. High humidity (84%) making 31°C feel like 37°C. Carry rain gear and expect transit delays during intense spells.",
    hourly: [
      { time: "00:00", temp: 27, condition: "Cloudy", rainProb: 40, isNight: true },
      { time: "02:00", temp: 26, condition: "Light Rain", rainProb: 60, isNight: true },
      { time: "04:00", temp: 26, condition: "Light Rain", rainProb: 70, isNight: true },
      { time: "06:00", temp: 27, condition: "Thunderstorm", rainProb: 85, isNight: false },
      { time: "08:00", temp: 28, condition: "Heavy Rain", rainProb: 90, isNight: false },
      { time: "10:00", temp: 30, condition: "Thunderstorm", rainProb: 80, isNight: false },
      { time: "12:00", temp: 32, condition: "Thunderstorm", rainProb: 75, isNight: false },
      { time: "14:00", temp: 33, condition: "Heavy Rain", rainProb: 85, isNight: false },
      { time: "16:00", temp: 31, condition: "Light Rain", rainProb: 70, isNight: false },
      { time: "18:00", temp: 29, condition: "Cloudy", rainProb: 50, isNight: false },
      { time: "20:00", temp: 28, condition: "Partly Cloudy", rainProb: 40, isNight: true },
      { time: "22:00", temp: 27, condition: "Cloudy", rainProb: 45, isNight: true }
    ],
    weekly: [
      { day: "Today", date: "Sep 25", condition: "Thunderstorm", high: 33, low: 26, rainProb: 85 },
      { day: "Fri", date: "Sep 26", condition: "Heavy Rain", high: 31, low: 25, rainProb: 90 },
      { day: "Sat", date: "Sep 27", condition: "Light Rain", high: 32, low: 26, rainProb: 70 },
      { day: "Sun", date: "Sep 28", condition: "Partly Cloudy", high: 33, low: 27, rainProb: 45 },
      { day: "Mon", date: "Sep 29", condition: "Cloudy", high: 32, low: 26, rainProb: 35 },
      { day: "Tue", date: "Sep 30", condition: "Sunny", high: 34, low: 27, rainProb: 20 },
      { day: "Wed", date: "Oct 01", condition: "Sunny", high: 34, low: 27, rainProb: 15 }
    ]
  },

  "paris": {
    city: "Paris",
    country: "France",
    coordinates: { lat: 48.8566, lon: 2.3522 },
    current: {
      temp: 20,
      feelsLike: 20,
      condition: "Sunny",
      high: 22,
      low: 12,
      humidity: 58,
      windSpeed: 13,
      windDirection: "NE (45°)",
      pressure: 1020,
      visibility: 15,
      uvIndex: 4,
      cloudCover: 10,
      isNight: false,
      updatedAt: "Just now"
    },
    airQuality: {
      aqi: 32,
      pm25: 7.5,
      pm10: 14.0,
      o3: 38,
      no2: 24,
      status: "Good"
    },
    sunInfo: {
      sunrise: "07:38 AM",
      sunset: "07:44 PM",
      dayLength: "12h 06m",
      progress: 45
    },
    alert: null,
    summary: "Sunny and delightful throughout the city of light today. Mild northerly breezes with daytime temperatures hovering around 20°C, ideal for outdoor walks along the Seine.",
    hourly: [
      { time: "00:00", temp: 13, condition: "Clear", rainProb: 0, isNight: true },
      { time: "02:00", temp: 12, condition: "Clear", rainProb: 0, isNight: true },
      { time: "04:00", temp: 12, condition: "Clear", rainProb: 0, isNight: true },
      { time: "06:00", temp: 13, condition: "Clear", rainProb: 0, isNight: false },
      { time: "08:00", temp: 15, condition: "Sunny", rainProb: 0, isNight: false },
      { time: "10:00", temp: 18, condition: "Sunny", rainProb: 5, isNight: false },
      { time: "12:00", temp: 20, condition: "Sunny", rainProb: 5, isNight: false },
      { time: "14:00", temp: 22, condition: "Sunny", rainProb: 5, isNight: false },
      { time: "16:00", temp: 21, condition: "Sunny", rainProb: 5, isNight: false },
      { time: "18:00", temp: 19, condition: "Clear", rainProb: 0, isNight: false },
      { time: "20:00", temp: 16, condition: "Clear", rainProb: 0, isNight: true },
      { time: "22:00", temp: 14, condition: "Clear", rainProb: 0, isNight: true }
    ],
    weekly: [
      { day: "Today", date: "Sep 25", condition: "Sunny", high: 22, low: 12, rainProb: 5 },
      { day: "Fri", date: "Sep 26", condition: "Sunny", high: 23, low: 13, rainProb: 5 },
      { day: "Sat", date: "Sep 27", condition: "Partly Cloudy", high: 21, low: 14, rainProb: 20 },
      { day: "Sun", date: "Sep 28", condition: "Light Rain", high: 18, low: 11, rainProb: 65 },
      { day: "Mon", date: "Sep 29", condition: "Cloudy", high: 17, low: 10, rainProb: 30 },
      { day: "Tue", date: "Sep 30", condition: "Partly Cloudy", high: 19, low: 11, rainProb: 15 },
      { day: "Wed", date: "Oct 01", condition: "Sunny", high: 20, low: 12, rainProb: 10 }
    ]
  },

  "sydney": {
    city: "Sydney",
    country: "Australia",
    coordinates: { lat: -33.8688, lon: 151.2093 },
    current: {
      temp: 19,
      feelsLike: 18,
      condition: "Partly Cloudy",
      high: 22,
      low: 13,
      humidity: 62,
      windSpeed: 21,
      windDirection: "S (180°)",
      pressure: 1022,
      visibility: 14,
      uvIndex: 6,
      cloudCover: 40,
      isNight: true,
      updatedAt: "Just now"
    },
    airQuality: {
      aqi: 22,
      pm25: 5.1,
      pm10: 9.8,
      o3: 22,
      no2: 11,
      status: "Good"
    },
    sunInfo: {
      sunrise: "05:46 AM",
      sunset: "05:51 PM",
      dayLength: "12h 05m",
      progress: 85
    },
    alert: null,
    summary: "Fresh coastal breeze sweeping through Sydney Harbour. Pleasant spring weather with daytime peaks near 22°C and clear evening skies.",
    hourly: [
      { time: "00:00", temp: 15, condition: "Clear", rainProb: 5, isNight: true },
      { time: "02:00", temp: 14, condition: "Clear", rainProb: 5, isNight: true },
      { time: "04:00", temp: 13, condition: "Clear", rainProb: 5, isNight: true },
      { time: "06:00", temp: 15, condition: "Partly Cloudy", rainProb: 10, isNight: false },
      { time: "08:00", temp: 17, condition: "Partly Cloudy", rainProb: 10, isNight: false },
      { time: "10:00", temp: 19, condition: "Sunny", rainProb: 5, isNight: false },
      { time: "12:00", temp: 21, condition: "Sunny", rainProb: 5, isNight: false },
      { time: "14:00", temp: 22, condition: "Partly Cloudy", rainProb: 10, isNight: false },
      { time: "16:00", temp: 20, condition: "Clear", rainProb: 10, isNight: false },
      { time: "18:00", temp: 18, condition: "Clear", rainProb: 5, isNight: true },
      { time: "20:00", temp: 16, condition: "Clear", rainProb: 0, isNight: true },
      { time: "22:00", temp: 15, condition: "Clear", rainProb: 0, isNight: true }
    ],
    weekly: [
      { day: "Today", date: "Sep 25", condition: "Partly Cloudy", high: 22, low: 13, rainProb: 10 },
      { day: "Fri", date: "Sep 26", condition: "Sunny", high: 24, low: 14, rainProb: 5 },
      { day: "Sat", date: "Sep 27", condition: "Sunny", high: 25, low: 15, rainProb: 5 },
      { day: "Sun", date: "Sep 28", condition: "Cloudy", high: 21, low: 13, rainProb: 25 },
      { day: "Mon", date: "Sep 29", condition: "Light Rain", high: 19, low: 12, rainProb: 55 },
      { day: "Tue", date: "Sep 30", condition: "Sunny", high: 22, low: 13, rainProb: 10 },
      { day: "Wed", date: "Oct 01", condition: "Sunny", high: 23, low: 14, rainProb: 5 }
    ]
  }
};
