import React from 'react';
import { Sunrise, Sunset, Sun, Clock } from 'lucide-react';
import { useWeather } from '../context/WeatherContext';

export default function SunInfo() {
  const { weatherData } = useWeather();

  if (!weatherData || !weatherData.sunInfo) return null;

  const { sunInfo } = weatherData;
  const { sunrise, sunset, dayLength, progress = 50 } = sunInfo;

  return (
    <div className="rounded-3xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 p-5 sm:p-6 shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
            <Sun size={18} className="text-amber-500" />
            <span>Sun & Daylight</span>
          </h2>
          <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <Clock size={13} />
            <span>Daylight: {dayLength}</span>
          </div>
        </div>

        {/* Visual Solar Arc Display */}
        <div className="py-2 px-2 flex flex-col items-center">
          <div className="relative w-full max-w-[280px] h-28 overflow-hidden flex items-end justify-center">
            {/* Semicircular Dotted Arc Track */}
            <svg viewBox="0 0 200 100" className="w-full h-full overflow-visible">
              <path
                d="M 15 95 A 85 85 0 0 1 185 95"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeDasharray="4 4"
                className="text-slate-200 dark:text-slate-700"
              />

              {/* Active Golden Arc Track representing daylight elapsed */}
              <path
                d="M 15 95 A 85 85 0 0 1 185 95"
                fill="none"
                stroke="url(#sunArcGradient)"
                strokeWidth="3.5"
                strokeDasharray="267"
                strokeDashoffset={267 - (267 * progress) / 100}
                strokeLinecap="round"
              />

              <defs>
                <linearGradient id="sunArcGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#ea580c" />
                </linearGradient>
              </defs>

              {/* Sun position calculation on arc: angle from Math.PI to 0 */}
              {(() => {
                const angle = Math.PI - (progress / 100) * Math.PI;
                const cx = 100 + 85 * Math.cos(angle);
                const cy = 95 - 85 * Math.sin(angle);
                return (
                  <g transform={`translate(${cx}, ${cy})`}>
                    <circle r="7" fill="#f59e0b" className="animate-pulse" />
                    <circle r="12" fill="#f59e0b" opacity="0.25" />
                  </g>
                );
              })()}

              {/* Horizon Line */}
              <line
                x1="0"
                y1="95"
                x2="200"
                y2="95"
                stroke="currentColor"
                strokeWidth="1.5"
                className="text-slate-300 dark:text-slate-700"
              />
            </svg>
          </div>

          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 font-medium">
            Solar position: {progress}% of daytime cycle
          </p>
        </div>
      </div>

      {/* Sunrise & Sunset Time Badges */}
      <div className="grid grid-cols-2 gap-3 mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60">
        <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-900/30">
          <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400">
            <Sunrise size={20} />
          </div>
          <div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium block">
              Sunrise
            </span>
            <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
              {sunrise}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-200/50 dark:border-indigo-900/30">
          <div className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400">
            <Sunset size={20} />
          </div>
          <div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium block">
              Sunset
            </span>
            <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
              {sunset}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
