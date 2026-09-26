import React from 'react';
import {
  Clock,
  Droplets,
  Thermometer,
  Wind,
  Compass,
  Eye,
  SunMedium,
  Cloud,
  CheckCircle2
} from 'lucide-react';
import { useWeather } from '../context/WeatherContext';
import { formatTemp, formatTime, formatWindSpeed, getUVInfo } from '../utils/formatters.js';
import WeatherIcon from '../utils/weatherIcons';

export default function HourlyForecast() {
  const { weatherData, unit, selectedHour, selectedHourIndex, selectHour } = useWeather();

  if (!weatherData || !weatherData.hourly || weatherData.hourly.length === 0) return null;

  const { hourly } = weatherData;
  const activeHour = selectedHour || hourly[0];
  const uvInfo = getUVInfo(activeHour.uvIndex);

  return (
    <div className="rounded-3xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 p-5 sm:p-6 shadow-xs space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
          <Clock size={18} className="text-sky-500" />
          <span>Hourly Forecast</span>
          <span className="text-xs font-normal text-slate-400 dark:text-slate-500">
            (Next 24 Hours • Click any time)
          </span>
        </h2>
        <span className="text-xs text-slate-400 dark:text-slate-500 hidden sm:inline">
          {weatherData.timezone ? `Local Time (${weatherData.timezone})` : 'Scroll horizontally'}
        </span>
      </div>

      {/* 24-Hour Scrollable Track with Clickable Cards */}
      <div className="flex items-center gap-2.5 sm:gap-3 overflow-x-auto pb-2.5 pt-1 custom-scrollbar">
        {hourly.map((hour, index) => {
          const isNow = index === 0;
          const isSelected = selectedHourIndex === index;

          return (
            <button
              key={index}
              type="button"
              onClick={() => selectHour(index)}
              title={`View detailed forecast for ${isNow ? 'Now' : formatTime(hour.time)}`}
              className={`flex-shrink-0 w-[82px] sm:w-[88px] h-[150px] py-3 px-2 rounded-2xl border transition-all flex flex-col items-center justify-between text-center select-none cursor-pointer focus:outline-none ${
                isSelected
                  ? 'bg-sky-50 dark:bg-sky-950/70 border-sky-500 dark:border-sky-400 shadow-sm ring-2 ring-sky-500/40 dark:ring-sky-400/40 -translate-y-0.5'
                  : isNow
                  ? 'bg-gradient-to-b from-sky-50/70 to-sky-100/40 dark:from-sky-950/40 dark:to-sky-900/20 border-sky-200 dark:border-sky-800 hover:border-sky-300'
                  : 'bg-slate-50/70 dark:bg-slate-900/40 border-slate-200/70 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-100/50'
              }`}
            >
              {/* Time Slot */}
              <div className="h-5 flex items-center justify-center">
                {isNow ? (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    isSelected ? 'bg-sky-600 text-white shadow-xs' : 'bg-sky-500 text-white shadow-xs'
                  }`}>
                    Now
                  </span>
                ) : (
                  <span className={`text-xs font-semibold whitespace-nowrap ${
                    isSelected ? 'text-sky-700 dark:text-sky-300 font-bold' : 'text-slate-500 dark:text-slate-400'
                  }`}>
                    {formatTime(hour.time)}
                  </span>
                )}
              </div>

              {/* Weather Icon Slot */}
              <div className="h-9 flex items-center justify-center my-0.5">
                <WeatherIcon condition={hour.condition} isNight={hour.isNight} size={28} />
              </div>

              {/* Temperature Slot */}
              <div className="h-6 flex items-center justify-center">
                <span className={`text-sm font-bold ${
                  isSelected
                    ? 'text-sky-700 dark:text-sky-300 font-extrabold text-base'
                    : isNow
                    ? 'text-sky-700 dark:text-sky-300 font-bold'
                    : 'text-slate-800 dark:text-slate-100'
                }`}>
                  {formatTemp(hour.temp, unit)}°
                </span>
              </div>

              {/* Rain Probability Slot */}
              <div className="h-5 flex items-center justify-center gap-0.5 text-[11px] font-medium text-cyan-600 dark:text-cyan-400">
                <Droplets size={11} className="flex-shrink-0" />
                <span>{hour.rainProb}%</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Hour Weather Detail Section */}
      {activeHour && (
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700/60 rounded-2xl bg-slate-50/60 dark:bg-slate-900/40 p-4 sm:p-5 border border-slate-200/60 dark:border-slate-800 transition-all">
          {/* Active Hour Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-200/60 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 shadow-2xs">
                <WeatherIcon condition={activeHour.condition} isNight={activeHour.isNight} size={28} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                    {activeHour.isNow ? 'Current Hour (Now)' : formatTime(activeHour.time)} Forecast
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-sky-100 dark:bg-sky-950/80 text-sky-700 dark:text-sky-300">
                    {activeHour.condition}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Detailed meteorological parameters for this hour
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
              <span className="text-2xl font-black text-slate-900 dark:text-white">
                {formatTemp(activeHour.temp, unit)}°{unit}
              </span>
              <span className="text-slate-400 font-normal">|</span>
              <span className="text-slate-500 dark:text-slate-400 font-normal">
                Feels like <strong className="font-semibold text-slate-700 dark:text-slate-200">{formatTemp(activeHour.feelsLike, unit)}°{unit}</strong>
              </span>
            </div>
          </div>

          {/* Detailed Metric Cards Grid (Stacks vertically on mobile, multi-column on larger screens) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-2.5 sm:gap-3">
            {/* Precipitation Chance */}
            <div className="p-3 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/70 dark:border-slate-700/60 shadow-2xs">
              <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 flex items-center gap-1 block">
                <Droplets size={12} className="text-cyan-500" /> Precipitation
              </span>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-1 block">
                {activeHour.rainProb}%
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                {activeHour.precipitation ? `${activeHour.precipitation} mm` : '0.0 mm'}
              </span>
            </div>

            {/* Humidity */}
            <div className="p-3 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/70 dark:border-slate-700/60 shadow-2xs">
              <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 flex items-center gap-1 block">
                <Droplets size={12} className="text-sky-500" /> Humidity
              </span>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-1 block">
                {activeHour.humidity}%
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                Relative moisture
              </span>
            </div>

            {/* Wind Speed */}
            <div className="p-3 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/70 dark:border-slate-700/60 shadow-2xs">
              <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 flex items-center gap-1 block">
                <Wind size={12} className="text-teal-500" /> Wind Speed
              </span>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-1 block">
                {formatWindSpeed(activeHour.windSpeed, unit)}
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                Surface airflow
              </span>
            </div>

            {/* Wind Direction */}
            <div className="p-3 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/70 dark:border-slate-700/60 shadow-2xs">
              <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 flex items-center gap-1 block">
                <Compass size={12} className="text-indigo-500" /> Direction
              </span>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-1 block truncate">
                {activeHour.windDirectionShort || activeHour.windDirection}
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5 truncate">
                {activeHour.windDirection}
              </span>
            </div>

            {/* Visibility */}
            <div className="p-3 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/70 dark:border-slate-700/60 shadow-2xs">
              <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 flex items-center gap-1 block">
                <Eye size={12} className="text-emerald-500" /> Visibility
              </span>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-1 block">
                {activeHour.visibility} km
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                {activeHour.visibility >= 10 ? 'Clear line of sight' : 'Reduced visibility'}
              </span>
            </div>

            {/* UV Index */}
            <div className="p-3 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/70 dark:border-slate-700/60 shadow-2xs">
              <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 flex items-center gap-1 block">
                <SunMedium size={12} className="text-amber-500" /> UV Index
              </span>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-1 flex items-center gap-1.5">
                <span>{activeHour.uvIndex}</span>
                <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded ${uvInfo.badgeBg} ${uvInfo.badgeText}`}>
                  {uvInfo.label}
                </span>
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                Solar intensity
              </span>
            </div>

            {/* Cloud Cover */}
            <div className="p-3 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/70 dark:border-slate-700/60 shadow-2xs col-span-2 sm:col-span-1">
              <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 flex items-center gap-1 block">
                <Cloud size={12} className="text-slate-500" /> Cloud Cover
              </span>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-1 block">
                {activeHour.cloudCover}%
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                Atmospheric opacity
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
