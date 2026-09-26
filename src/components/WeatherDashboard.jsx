import React from 'react';
import { useWeather } from '../context/WeatherContext';
import WeatherAlert from './WeatherAlert';
import CurrentWeather from './CurrentWeather';
import WeatherSummary from './WeatherSummary';
import HourlyForecast from './HourlyForecast';
import TemperatureChart from './TemperatureChart';
import WeatherDetails from './WeatherDetails';
import WeeklyForecast from './WeeklyForecast';
import AirQuality from './AirQuality';
import SunInfo from './SunInfo';
import LoadingState from './LoadingState';
import ErrorState from './ErrorState';

/**
 * Main Weather Dashboard layout orchestrator.
 * Combines all modular weather widgets into an organized, responsive grid.
 */
export default function WeatherDashboard() {
  const { loading, error } = useWeather();

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState />;
  }

  return (
    <div className="space-y-5 sm:space-y-7 animate-fadeIn">
      {/* 1. Severe Weather Alert Banner (conditionally displayed if active) */}
      <WeatherAlert />

      {/* 2. Primary Hero Grid: Current Weather & Meteorological Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch">
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col">
          <CurrentWeather />
        </div>
        <div className="lg:col-span-5 xl:col-span-4 flex flex-col">
          <WeatherSummary />
        </div>
      </div>

      {/* 3. Hourly Forecast (Horizontal 24-hour sequence) */}
      <HourlyForecast />

      {/* 4. Diurnal Temperature Trend Line Chart */}
      <TemperatureChart />

      {/* 5. Meteorological Detail Highlights (7 cards: Humidity, Wind, Pressure, etc.) */}
      <WeatherDetails />

      {/* 6. Environmental & Extended Forecast Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
        {/* 7-Day Forecast */}
        <div className="lg:col-span-6 xl:col-span-6">
          <WeeklyForecast />
        </div>

        {/* Air Quality Index & Sun Cycle */}
        <div className="lg:col-span-6 xl:col-span-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-5 sm:gap-6">
          <AirQuality />
          <SunInfo />
        </div>
      </div>
    </div>
  );
}
