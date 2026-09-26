 HEAD
# Weather Information Dashboard (BCA Final-Year Project)

A modern, responsive, production-quality Meteorological Information Dashboard built with React, Vite, Tailwind CSS, and Lucide React.

## 🌟 Key Features

1. **Header & Navigation**
   - Search bar for any city with auto-fallback dynamic simulation
   - Quick suggested city chips (London, New York, Tokyo, Mumbai, Paris, Sydney)
   - Current Location detector using HTML5 Geolocation API
   - Instant Dark / Light mode toggle
   - Temperature unit toggle (°C / °F)
2. **Current Weather Hero**
   - Dominant visual temperature display
   - Weather condition text with dynamic Lucide weather icons
   - Feels-like temperature, daily highs and lows
   - City, country, and formatted date / time stamps
3. **Meteorological Highlights (7 Cards)**
   - Humidity (%)
   - Wind Speed (km/h or mph)
   - Wind Direction (degrees & compass cardinal)
   - Atmospheric Pressure (hPa)
   - Visibility (km)
   - UV Index (with color-coded severity badges: Low, Moderate, High, Extreme)
   - Cloud Cover (%)
4. **Hourly Forecast**
   - Smooth horizontal scrollable 24-hour forecast
   - Time, weather icon, temperature, and rain probability indicator
5. **7-Day Extended Forecast**
   - Full weekly breakdown with day names and dates
   - High / low temperatures with visual normalized temperature range bars
   - Rain probability percentage
6. **Diurnal Temperature Trend Chart**
   - Interactive SVG line chart with smooth cubic bezier curves and gradient shading
   - Interactive hover inspection showing time, condition, temp, and rain chance
7. **Air Quality Index (AQI)**
   - Primary AQI score with color spectrum gauge
   - Detailed pollutant metrics: PM2.5, PM10, O₃ (Ozone), NO₂
   - Health advisory and category rating
8. **Sun & Daylight Cycle**
   - Sunrise and sunset times
   - Total day length
   - Visual solar position arc representing elapsed daytime
9. **Weather Alert Banner**
   - High-visibility banner for severe weather warnings, watches, and advisories
   - Dismissible with alert level indicator
10. **Meteorological Briefing & Summary**
    - Natural-language weather synthesis
    - Lifestyle recommendations (attire, umbrella need, UV protection)
11. **UX States**
    - Skeleton loading placeholders
    - Friendly error recovery screen with retry and fallback city options

---

## 🏗️ Project Architecture & Folder Structure

```
weather dashboard/
├── index.html                  # HTML5 entry with Inter font
├── package.json                # Project dependencies and npm scripts
├── vite.config.js              # Vite configuration
├── tailwind.config.js          # Tailwind styling with dark mode support
├── postcss.config.js           # PostCSS configuration
├── .env.example                # Template for live API keys
├── src/
│   ├── main.jsx                # React DOM root entry
│   ├── App.jsx                 # Root layout & footer
│   ├── index.css               # Tailwind directives & custom scrollbars
│   ├── components/             # Reusable UI Components
│   │   ├── Header.jsx          # Header with branding and controls
│   │   ├── SearchBar.jsx       # City search with suggestions & GPS
│   │   ├── CurrentWeather.jsx  # Main hero temperature card
│   │   ├── WeatherDetails.jsx  # 7 meteorological highlight cards
│   │   ├── HourlyForecast.jsx  # 24-hour horizontal forecast
│   │   ├── WeeklyForecast.jsx  # 7-day forecast with range bars
│   │   ├── TemperatureChart.jsx# Interactive SVG temperature trend line
│   │   ├── AirQuality.jsx      # AQI score, gauge, and pollutants
│   │   ├── SunInfo.jsx         # Sunrise, sunset & solar arc
│   │   ├── WeatherAlert.jsx    # Severe weather alert banner
│   │   ├── WeatherSummary.jsx  # Natural language briefing
│   │   ├── WeatherDashboard.jsx# Main grid layout orchestrator
│   │   ├── LoadingState.jsx    # Animated skeleton loader
│   │   └── ErrorState.jsx      # Friendly error view with retry
│   ├── context/
│   │   └── WeatherContext.jsx  # State management (theme, unit, weather data)
│   ├── data/
│   │   └── mockWeatherData.js  # Rich realistic weather database
│   ├── services/
│   │   └── weatherService.js   # Abstraction layer for API integration
│   └── utils/
│       ├── formatters.js       # Formatting for temps, dates, AQI, and UV
│       └── weatherIcons.jsx    # Dynamic Lucide icon mapping
```

---

## 🚀 How to Run the Project

1. Open PowerShell or Terminal in the project root:
   ```bash
   cd "weather dashboard"
   ```

2. Start the Vite development server:
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

4. To build for production:
   ```bash
   npm run build
   ```

---

## 🔌 API Integration Guide

All data-fetching logic is centralized in [`src/services/weatherService.js`](file:///c:/Users/avish/OneDrive/Desktop/weather%20dashboard/src/services/weatherService.js).
To connect a live API (such as OpenWeatherMap or Open-Meteo):
1. Add your API key in `.env`: `VITE_WEATHER_API_KEY=your_key`
2. In `src/services/weatherService.js`, set `USE_REAL_API = true`.
3. The UI components will consume the data automatically without any modifications!
=======
# Weather-information-Dashboard-
React-based Weather Dashboard with forecasts, historical weather, AQI, interactive maps, city comparison, analytics, and PDF reports.
>>>>>>> 36cde6a4858ad81ec2017f641ce6fb49b85ebb65
