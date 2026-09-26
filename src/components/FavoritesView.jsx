import React from 'react';
import { Star, Clock, Trash2, ArrowUpRight, MapPin, Sparkles } from 'lucide-react';
import { useWeather } from '../context/WeatherContext';

export default function FavoritesView() {
  const {
    favorites,
    recentSearches,
    removeFavorite,
    clearRecentSearches,
    searchCity,
    setActiveTab,
    city
  } = useWeather();

  const handleSelectLocation = (loc) => {
    searchCity(loc);
    setActiveTab('overview');
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Page Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
          <Star className="text-amber-400 fill-amber-400" size={24} />
          <span>Saved Locations & History</span>
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Quickly switch between your pinned favorite cities and recent meteorological lookups.
        </p>
      </div>

      {/* 1. Favorites Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
              Pinned Favorites
            </h3>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300">
              {favorites.length}
            </span>
          </div>
          <span className="text-xs text-slate-400">
            Click any city to view live dashboard
          </span>
        </div>

        {favorites.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 p-8 text-center bg-white/40 dark:bg-slate-800/40">
            <Star size={32} className="mx-auto text-slate-300 dark:text-slate-600 mb-2" />
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
              No favorites saved yet
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 max-w-sm mx-auto">
              Click the star icon next to any city on the Overview dashboard to pin it here for one-click access.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {favorites.map((fav) => {
              const isCurrent = fav.name.toLowerCase() === city.toLowerCase();

              return (
                <div
                  key={fav.id || `${fav.name}_${fav.country}`}
                  className={`group rounded-2xl p-5 border transition-all flex flex-col justify-between shadow-2xs relative ${
                    isCurrent
                      ? 'bg-gradient-to-br from-amber-500/10 via-sky-500/5 to-white dark:from-amber-950/30 dark:via-sky-950/20 dark:to-slate-800 border-amber-300 dark:border-amber-700/80'
                      : 'bg-white dark:bg-slate-800/80 border-slate-200/80 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-xs'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-500 flex-shrink-0">
                          <Star size={16} className="fill-amber-400" />
                        </div>
                        <div>
                          <h4 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                            {fav.name}
                          </h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {fav.state ? `${fav.state}, ${fav.country}` : fav.country}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFavorite(fav.id || fav.name);
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                        title="Remove from favorites"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                    {isCurrent && (
                      <div className="mt-3 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Currently Active
                      </div>
                    )}
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">
                      Lat: {Number(fav.latitude || 0).toFixed(2)}, Lon: {Number(fav.longitude || 0).toFixed(2)}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleSelectLocation(fav)}
                      className="inline-flex items-center gap-1 text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline cursor-pointer"
                    >
                      <span>Load Weather</span>
                      <ArrowUpRight size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 2. Recent Searches Section */}
      <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock size={18} className="text-slate-400" />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
              Recent Searches
            </h3>
            <span className="text-xs text-slate-400">
              (Latest {recentSearches.length})
            </span>
          </div>

          {recentSearches.length > 0 && (
            <button
              type="button"
              onClick={clearRecentSearches}
              className="text-xs font-semibold text-rose-500 hover:text-rose-600 dark:hover:text-rose-400 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Trash2 size={13} />
              <span>Clear History</span>
            </button>
          )}
        </div>

        {recentSearches.length === 0 ? (
          <p className="text-xs text-slate-400 dark:text-slate-500">
            No recent searches. Locations you search will automatically appear here.
          </p>
        ) : (
          <div className="flex flex-wrap items-center gap-2">
            {recentSearches.map((rec, i) => (
              <button
                key={`${rec.name}_${i}`}
                type="button"
                onClick={() => handleSelectLocation(rec)}
                className="group inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 hover:border-sky-300 dark:hover:border-sky-700 hover:bg-sky-50/50 dark:hover:bg-slate-700/60 transition-all text-xs font-medium text-slate-700 dark:text-slate-200 cursor-pointer shadow-2xs"
              >
                <MapPin size={13} className="text-slate-400 group-hover:text-sky-500 transition-colors" />
                <span className="font-semibold">{rec.name}</span>
                {rec.country && (
                  <span className="text-slate-400 dark:text-slate-500">
                    ({rec.country})
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
