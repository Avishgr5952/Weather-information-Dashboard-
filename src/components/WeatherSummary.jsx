import React from 'react';
import { Sparkles, Shirt, Umbrella, HeartPulse } from 'lucide-react';
import { useWeather } from '../context/WeatherContext';

export default function WeatherSummary() {
  const { weatherData } = useWeather();

  if (!weatherData || !weatherData.summary) return null;

  const { summary, current } = weatherData;

  // Derive contextual recommendations based on live metrics
  const isRainy = (current.condition && current.condition.toLowerCase().includes('rain')) || current.humidity > 80;
  const isCold = current.temp < 15;
  const isHot = current.temp > 28;
  const highUv = current.uvIndex > 6;

  return (
    <div className="rounded-3xl bg-gradient-to-br from-sky-500/10 via-indigo-500/5 to-purple-500/10 dark:from-sky-950/40 dark:via-indigo-950/20 dark:to-purple-950/30 border border-sky-200/80 dark:border-sky-800/60 p-5 sm:p-7 shadow-xs h-full flex flex-col justify-between">
      <div className="space-y-3.5">
        {/* Header with Icon and Badge */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-sky-500 text-white shadow-xs">
              <Sparkles size={16} />
            </div>
            <h2 className="text-xs font-bold text-sky-800 dark:text-sky-300 uppercase tracking-wider">
              Meteorological Briefing
            </h2>
          </div>
          <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
            Automated Synthesis
          </span>
        </div>

        {/* Natural Language Summary Text */}
        <p className="text-sm sm:text-base font-medium text-slate-800 dark:text-slate-200 leading-relaxed pt-0.5">
          "{summary}"
        </p>
      </div>

      {/* Actionable Lifestyle Recommendation Chips */}
      <div className="space-y-2 pt-4 mt-2 border-t border-sky-100 dark:border-slate-800/80">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
          Daily Advisories
        </span>
        <div className="flex flex-wrap items-center gap-2">
          {/* Clothing Chip */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/90 dark:bg-slate-800/90 border border-slate-200/70 dark:border-slate-700/70 text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-2xs">
            <Shirt size={14} className="text-indigo-500 flex-shrink-0" />
            <span>
              {isCold ? 'Warm layers recommended' : isHot ? 'Light breathable clothing' : 'Comfortable casual wear'}
            </span>
          </div>

          {/* Umbrella Chip */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/90 dark:bg-slate-800/90 border border-slate-200/70 dark:border-slate-700/70 text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-2xs">
            <Umbrella size={14} className="text-blue-500 flex-shrink-0" />
            <span>
              {isRainy ? 'Carry an umbrella' : 'No umbrella required'}
            </span>
          </div>

          {/* Outdoor Activity / Health Chip */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/90 dark:bg-slate-800/90 border border-slate-200/70 dark:border-slate-700/70 text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-2xs">
            <HeartPulse size={14} className="text-rose-500 flex-shrink-0" />
            <span>
              {highUv ? 'High UV: Apply sunscreen' : 'Good conditions for outdoor strolls'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
