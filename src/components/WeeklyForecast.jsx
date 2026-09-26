import React from 'react';
import { Calendar, Droplets } from 'lucide-react';
import { useWeather } from '../context/WeatherContext';
import { formatTemp } from '../utils/formatters';
import WeatherIcon from '../utils/weatherIcons';

export default function WeeklyForecast() {
  const { weatherData, unit } = useWeather();

  if (!weatherData || !weatherData.weekly) return null;

  const { weekly } = weatherData;

  // Calculate overall min & max for normalized temperature bar
  const allLows = weekly.map((d) => d.low);
  const allHighs = weekly.map((d) => d.high);
  const minWeekTemp = Math.min(...allLows);
  const maxWeekTemp = Math.max(...allHighs);
  const tempRange = Math.max(1, maxWeekTemp - minWeekTemp);

  return (
    <div className="rounded-3xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 p-5 sm:p-6 shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
            <Calendar size={18} className="text-sky-500" />
            <span>7-Day Forecast</span>
          </h2>
          <span className="text-xs text-slate-400 dark:text-slate-500">
            Next 7 Days
          </span>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-700/60">
          {weekly.map((day, index) => {
            // Calculate percentage position for bar
            const leftPct = Math.round(((day.low - minWeekTemp) / tempRange) * 100);
            const widthPct = Math.max(12, Math.round(((day.high - day.low) / tempRange) * 100));

            return (
              <div
                key={index}
                className="py-3 sm:py-3.5 flex items-center justify-between gap-3 text-sm hover:bg-slate-50/60 dark:hover:bg-slate-700/30 px-2 rounded-xl transition-colors"
              >
                {/* Day name & date */}
                <div className="w-24 sm:w-28 flex-shrink-0">
                  <p className="font-semibold text-slate-800 dark:text-slate-200">
                    {day.day}
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">
                    {day.date}
                  </p>
                </div>

                {/* Rain Probability */}
                <div className="w-12 flex items-center gap-1 text-xs font-medium text-cyan-600 dark:text-cyan-400">
                  {day.rainProb > 15 ? (
                    <>
                      <Droplets size={12} />
                      <span>{day.rainProb}%</span>
                    </>
                  ) : (
                    <span className="text-slate-300 dark:text-slate-600 font-normal">--</span>
                  )}
                </div>

                {/* Icon & condition text */}
                <div className="flex items-center gap-2.5 flex-1 min-w-0">
                  <WeatherIcon condition={day.condition} size={22} className="flex-shrink-0" />
                  <span className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 truncate hidden md:inline">
                    {day.condition}
                  </span>
                </div>

                {/* Temperature Range Bar & High/Low values */}
                <div className="flex items-center gap-2 sm:gap-3 justify-end flex-shrink-0 w-auto sm:w-48 lg:w-52">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 w-7 sm:w-8 text-right">
                    {formatTemp(day.low, unit)}°
                  </span>

                  {/* Horizontal visual range bar */}
                  <div className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full relative overflow-hidden hidden sm:block">
                    <div
                      className="absolute top-0 bottom-0 rounded-full bg-gradient-to-r from-sky-400 via-amber-400 to-rose-400"
                      style={{
                        left: `${leftPct}%`,
                        width: `${widthPct}%`
                      }}
                    />
                  </div>

                  <span className="text-sm font-bold text-slate-800 dark:text-slate-100 w-8 text-right">
                    {formatTemp(day.high, unit)}°
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
