import React from 'react';
import { AlertCircle, RotateCcw, Search, Compass } from 'lucide-react';
import { useWeather } from '../context/WeatherContext';

export default function ErrorState() {
  const { error, retry, searchCity } = useWeather();

  return (
    <div className="rounded-3xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 p-8 sm:p-12 text-center max-w-xl mx-auto shadow-sm my-8">
      <div className="w-16 h-16 rounded-3xl bg-rose-50 dark:bg-rose-950/50 text-rose-500 mx-auto flex items-center justify-center mb-5 border border-rose-200 dark:border-rose-900/50">
        <AlertCircle size={32} />
      </div>

      <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
        Weather Data Unavailable
      </h2>

      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
        {error || "We couldn't retrieve the weather details for that location. Please check the spelling or try searching another city."}
      </p>

      {/* Suggested Actions */}
      <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          type="button"
          onClick={retry}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-sm font-semibold shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <RotateCcw size={16} />
          <span>Try Again</span>
        </button>

        <button
          type="button"
          onClick={() => searchCity('London')}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Compass size={16} />
          <span>Load London (Default)</span>
        </button>
      </div>

      {/* Quick Search Helper */}
      <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700/60">
        <span className="text-xs text-slate-400 dark:text-slate-500 block mb-3">
          Or select one of these locations:
        </span>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {['Tokyo', 'New York', 'Mumbai', 'Paris', 'Sydney'].map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => searchCity(c)}
              className="px-3 py-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-sky-300 dark:hover:border-sky-600 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
            >
              {c}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
