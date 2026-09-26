import React from 'react';
import { Wind, Activity, Info } from 'lucide-react';
import { useWeather } from '../context/WeatherContext';
import { getAQIInfo } from '../utils/formatters';

export default function AirQuality() {
  const { weatherData } = useWeather();

  if (!weatherData || !weatherData.airQuality) return null;

  const { airQuality } = weatherData;
  const { aqi, pm25, pm10, o3, no2 } = airQuality;
  const aqiInfo = getAQIInfo(aqi);

  // Calculate percentage of scale (0 to 300)
  const aqiPercent = Math.min(100, Math.round((aqi / 300) * 100));

  return (
    <div className="rounded-3xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 p-5 sm:p-6 shadow-sm flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
            <Activity size={18} className="text-emerald-500" />
            <span>Air Quality Index</span>
          </h2>
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${aqiInfo.badgeBg} ${aqiInfo.badgeText}`}>
            {aqiInfo.label}
          </span>
        </div>

        {/* Primary AQI Score Display */}
        <div className="flex items-baseline gap-3 mb-3">
          <span className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            {aqi}
          </span>
          <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            AQI Score
          </span>
        </div>

        {/* Color Spectrum Progress Bar */}
        <div className="space-y-1.5 mb-5">
          <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-700 rounded-full relative overflow-hidden">
            {/* Multi-color gradient representing standard AQI color spectrum */}
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-amber-400 via-orange-500 via-red-500 to-purple-600 opacity-80" />
            
            {/* Indicator pointer */}
            <div
              className="absolute top-0 bottom-0 w-2 bg-white dark:bg-slate-900 border-2 border-slate-900 dark:border-white rounded-full shadow-md -translate-x-1"
              style={{ left: `${aqiPercent}%` }}
            />
          </div>

          <div className="flex justify-between text-[10px] text-slate-400 font-medium">
            <span>Good (0)</span>
            <span>Moderate (100)</span>
            <span>Poor (200)</span>
            <span>Hazardous (300+)</span>
          </div>
        </div>

        {/* Pollutants Breakdown Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-4">
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-800">
            <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium block">
              PM 2.5
            </span>
            <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
              {pm25} <span className="text-[10px] font-normal text-slate-400">µg/m³</span>
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-800">
            <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium block">
              PM 10
            </span>
            <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
              {pm10} <span className="text-[10px] font-normal text-slate-400">µg/m³</span>
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-800">
            <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium block">
              O₃ (Ozone)
            </span>
            <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
              {o3 || 32} <span className="text-[10px] font-normal text-slate-400">ppb</span>
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-800">
            <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium block">
              NO₂
            </span>
            <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
              {no2 || 18} <span className="text-[10px] font-normal text-slate-400">ppb</span>
            </span>
          </div>
        </div>
      </div>

      {/* Advisory Note */}
      <div className="flex items-start gap-2 p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/80 text-xs text-slate-600 dark:text-slate-300">
        <Info size={15} className="text-slate-400 mt-0.5 flex-shrink-0" />
        <p className="leading-relaxed">
          {aqiInfo.description}
        </p>
      </div>
    </div>
  );
}
