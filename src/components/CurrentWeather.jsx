import React from 'react';
import { MapPin, ArrowUp, ArrowDown, Star } from 'lucide-react';
import { useWeather } from '../context/WeatherContext';
import { formatTemp, formatDate } from '../utils/formatters.js';
import WeatherIcon from '../utils/weatherIcons';

export default function CurrentWeather() {
  const { weatherData, unit, isFavorited, toggleFavorite } = useWeather();

  if (!weatherData) return null;

  const { city, country, current } = weatherData;
  const { temp, feelsLike, condition, high, low, isNight, updatedAt } = current;
  const favorited = isFavorited(city);

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-sky-50/40 to-indigo-50/20 dark:from-slate-800/95 dark:via-slate-800/60 dark:to-slate-900 border border-slate-200/80 dark:border-slate-700/70 p-5 sm:p-7 shadow-xs transition-all hover:shadow-md h-full flex flex-col justify-between">
      
      {/* Decorative ambient background glows */}
      <div className="absolute -top-16 -right-16 w-44 h-44 bg-sky-400/15 dark:bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-44 h-44 bg-indigo-500/10 dark:bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        
        {/* Left Column: Location, Date & Main Temp */}
        <div className="space-y-3">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100/80 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 text-xs font-semibold tracking-wide">
                <MapPin size={13} />
                <span>{city}, {country}</span>
              </div>
              <button
                type="button"
                onClick={() => toggleFavorite(weatherData)}
                className={`p-1.5 rounded-full transition-all cursor-pointer ${
                  favorited
                    ? 'text-amber-400 hover:text-amber-500 bg-amber-50 dark:bg-amber-950/60 shadow-xs'
                    : 'text-slate-400 hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
                title={favorited ? 'Remove from Favorites' : 'Add to Favorites'}
              >
                <Star size={16} className={favorited ? 'fill-amber-400' : ''} />
              </button>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
              {formatDate()}
            </p>
          </div>

          {/* Dominant Main Temperature Focus */}
          <div className="flex items-baseline gap-2">
            <span className="text-6xl sm:text-7xl lg:text-8xl font-black tracking-tighter text-slate-900 dark:text-white leading-none">
              {formatTemp(temp, unit)}
            </span>
            <span className="text-2xl sm:text-3xl font-light text-sky-600 dark:text-sky-400 -translate-y-3">
              °{unit}
            </span>
          </div>

          {/* Condition & Feels-like info */}
          <div className="space-y-0.5">
            <p className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-800 dark:text-slate-100 leading-tight">
              {condition}
            </p>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Feels like <span className="font-semibold text-slate-700 dark:text-slate-200">{formatTemp(feelsLike, unit)}°{unit}</span>
            </p>
          </div>
        </div>

        {/* Right Column: Weather Icon & High / Low summary */}
        <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-4 pt-3 md:pt-0 border-t md:border-t-0 border-slate-200/60 dark:border-slate-700/60">
          
          {/* Weather Icon Badge */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-white/80 dark:bg-slate-700/50 backdrop-blur-xs border border-slate-200/50 dark:border-slate-600/50 shadow-xs flex items-center justify-center flex-shrink-0">
            <WeatherIcon condition={condition} isNight={isNight} size={64} className="drop-shadow-xs" />
          </div>

          {/* High / Low & Live Status */}
          <div className="space-y-2 text-right">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-2.5 py-1 rounded-lg text-xs font-bold">
                <ArrowUp size={13} />
                <span>H: {formatTemp(high, unit)}°</span>
              </div>
              <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-2.5 py-1 rounded-lg text-xs font-bold">
                <ArrowDown size={13} />
                <span>L: {formatTemp(low, unit)}°</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 dark:text-slate-500 justify-end font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Status: {updatedAt}</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
