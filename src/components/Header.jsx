import React from 'react';
import { CloudSun, Sun, Moon } from 'lucide-react';
import { useWeather } from '../context/WeatherContext';
import SearchBar from './SearchBar';

export default function Header() {
  const { theme, toggleTheme, unit, toggleUnit } = useWeather();

  const actionControls = (
    <div className="flex items-center gap-2 sm:gap-2.5 flex-shrink-0">
      {/* Unit Toggle Button */}
      <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 sm:p-1 rounded-xl border border-slate-200 dark:border-slate-700/80">
        <button
          type="button"
          onClick={() => unit !== 'C' && toggleUnit()}
          className={`px-2.5 sm:px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            unit === 'C'
              ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-400 shadow-xs'
              : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
          title="Switch to Celsius"
        >
          °C
        </button>
        <button
          type="button"
          onClick={() => unit !== 'F' && toggleUnit()}
          className={`px-2.5 sm:px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            unit === 'F'
              ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-400 shadow-xs'
              : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
          title="Switch to Fahrenheit"
        >
          °F
        </button>
      </div>

      {/* Dark / Light Toggle */}
      <button
        type="button"
        onClick={toggleTheme}
        className="p-2 sm:p-2.5 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200 shadow-xs transition-all cursor-pointer"
        title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      >
        {theme === 'dark' ? (
          <Sun size={18} className="text-amber-400" />
        ) : (
          <Moon size={18} className="text-indigo-600" />
        )}
      </button>
    </div>
  );

  return (
    <header className="sticky top-0 z-30 bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 lg:gap-6">
          
          {/* Top Row on Mobile/Tablet: Brand on Left, Controls on Right */}
          <div className="flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center shadow-md shadow-sky-500/20 text-white flex-shrink-0">
                <CloudSun size={24} />
              </div>
              <div>
                <h1 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
                  Weather Information Dashboard
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Real-Time Meteorological Monitoring System
                </p>
              </div>
            </div>

            {/* Mobile / Tablet Controls (<1024px) */}
            <div className="flex lg:hidden">
              {actionControls}
            </div>
          </div>

          {/* Search Bar - Full Width on Mobile/Tablet, Centered/Flexible on Desktop */}
          <div className="w-full lg:flex-1 lg:max-w-xl xl:max-w-2xl">
            <SearchBar />
          </div>

          {/* Desktop Controls (>=1024px) */}
          <div className="hidden lg:flex">
            {actionControls}
          </div>

        </div>
      </div>
    </header>
  );
}
