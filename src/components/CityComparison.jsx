import React, { useState } from 'react';
import {
  Scale,
  Plus,
  Trash2,
  X,
  Droplets,
  Wind,
  Compass,
  Gauge,
  Eye,
  SunMedium,
  Cloud,
  Sunrise,
  Sunset,
  Activity,
  ArrowUp,
  ArrowDown,
  Search,
  Loader2
} from 'lucide-react';
import { useWeather } from '../context/WeatherContext';
import { searchLocations } from '../services/weatherService.js';
import { formatTemp, formatWindSpeed, getAQIInfo, getUVInfo } from '../utils/formatters.js';
import WeatherIcon from '../utils/weatherIcons';

export default function CityComparison() {
  const {
    comparisonCities,
    addCityToCompare,
    removeCityFromCompare,
    clearComparison,
    favorites,
    recentSearches,
    unit,
    weatherData
  } = useWeather();

  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [addingError, setAddingError] = useState(null);
  const [isAdding, setIsAdding] = useState(false);

  const hasInitializedRef = React.useRef(false);

  // Initialize with current active city only once on first mount
  React.useEffect(() => {
    if (!hasInitializedRef.current && comparisonCities.length === 0 && weatherData) {
      hasInitializedRef.current = true;
      addCityToCompare(weatherData);
    }
  }, [weatherData, comparisonCities.length, addCityToCompare]);

  // Handle typing in comparison search
  const handleSearchChange = async (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    setAddingError(null);

    if (val.trim().length >= 2) {
      setIsSearching(true);
      try {
        const results = await searchLocations(val.trim());
        setSuggestions(results);
      } catch {
        setSuggestions([]);
      } finally {
        setIsSearching(false);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleAddLocation = async (loc) => {
    setIsAdding(true);
    setAddingError(null);
    setSearchQuery('');
    setSuggestions([]);

    const res = await addCityToCompare(loc);
    if (!res.success) {
      setAddingError(res.message);
    }
    setIsAdding(false);
  };

  // Find min and max values across compared cities for visual comparison
  const temps = comparisonCities.map((c) => c.current?.temp ?? 0);
  const maxTemp = temps.length > 0 ? Math.max(...temps) : 0;
  const minTemp = temps.length > 0 ? Math.min(...temps) : 0;

  const aqis = comparisonCities.map((c) => c.airQuality?.aqi || 50);
  const bestAqi = aqis.length > 0 ? Math.min(...aqis) : 50;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <Scale className="text-sky-500" size={24} />
            <span>Multi-City Weather Comparison</span>
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Compare meteorological metrics, atmospheric conditions, and air quality across up to 4 global locations.
          </p>
        </div>

        {comparisonCities.length > 0 && (
          <button
            type="button"
            onClick={clearComparison}
            className="self-start sm:self-auto px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <Trash2 size={14} />
            <span>Clear Comparison</span>
          </button>
        )}
      </div>

      {/* City Selector & Quick Add Section */}
      <div className="rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          {/* Autocomplete Input */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              {isSearching ? <Loader2 size={16} className="animate-spin text-sky-500" /> : <Search size={16} />}
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              disabled={comparisonCities.length >= 4 || isAdding}
              placeholder={
                comparisonCities.length >= 4
                  ? 'Maximum 4 cities reached (remove a city to add another)'
                  : 'Add city to compare (e.g. Mumbai, London, Tokyo, Delhi)...'
              }
              className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 disabled:opacity-50"
            />

            {/* Suggestions Dropdown */}
            {suggestions.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-1 z-30 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl overflow-hidden max-h-56 overflow-y-auto custom-scrollbar">
                {suggestions.map((loc) => (
                  <button
                    key={`${loc.id}_${loc.latitude}_${loc.longitude}`}
                    type="button"
                    onClick={() => handleAddLocation(loc)}
                    className="w-full text-left px-3.5 py-2 hover:bg-sky-50 dark:hover:bg-slate-700/70 text-xs font-medium text-slate-700 dark:text-slate-200 transition-colors flex items-center justify-between border-b border-slate-50 dark:border-slate-700/40 last:border-b-0 cursor-pointer"
                  >
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white">{loc.name}</span>
                      <span className="text-slate-400 ml-1.5">
                        ({loc.state ? `${loc.state}, ` : ''}{loc.country})
                      </span>
                    </div>
                    <span className="text-sky-600 dark:text-sky-400 font-bold flex items-center gap-0.5">
                      <Plus size={13} /> Add
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Error message if city already exists or limit reached */}
        {addingError && (
          <p className="text-xs text-rose-500 font-medium">
            {addingError}
          </p>
        )}

        {/* Quick Add from Favorites & Recent Searches */}
        {(favorites.length > 0 || recentSearches.length > 0) && comparisonCities.length < 4 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs custom-scrollbar">
            <span className="text-slate-400 font-medium whitespace-nowrap">Quick add:</span>
            {favorites.slice(0, 4).map((f) => (
              <button
                key={f.name}
                type="button"
                onClick={() => handleAddLocation(f)}
                className="px-2.5 py-1 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200/60 dark:border-amber-900/40 rounded-full font-semibold whitespace-nowrap hover:bg-amber-100 transition-colors cursor-pointer flex items-center gap-1"
              >
                <Plus size={11} /> {f.name}
              </button>
            ))}
            {recentSearches.slice(0, 4).map((r) => (
              <button
                key={r.name}
                type="button"
                onClick={() => handleAddLocation(r)}
                className="px-2.5 py-1 bg-slate-100 dark:bg-slate-700/60 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-full font-medium whitespace-nowrap hover:bg-slate-200 transition-colors cursor-pointer flex items-center gap-1"
              >
                <Plus size={11} /> {r.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Comparison Grid / Table View */}
      {comparisonCities.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 p-12 text-center bg-white/40 dark:bg-slate-800/40">
          <Scale size={36} className="mx-auto text-slate-300 dark:text-slate-600 mb-2" />
          <p className="text-base font-semibold text-slate-700 dark:text-slate-200">
            No cities selected for comparison
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 max-w-sm mx-auto">
            Use the search box above or click quick add to compare up to 4 locations side by side.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto pb-4 custom-scrollbar">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 min-w-[320px]">
            {comparisonCities.map((cityData) => {
              const { city: cityName, country, current, airQuality, sunInfo, hourly } = cityData;
              const isHighestTemp = current.temp === maxTemp && comparisonCities.length > 1;
              const isLowestTemp = current.temp === minTemp && comparisonCities.length > 1;
              const aqiVal = airQuality?.aqi || 50;
              const aqiInfo = getAQIInfo(aqiVal);
              const uvInfo = getUVInfo(current.uvIndex);
              const isBestAqi = aqiVal === bestAqi && comparisonCities.length > 1;
              const rainChance = hourly?.[0]?.rainProb || 0;

              return (
                <div
                  key={cityName}
                  className="rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 p-5 shadow-xs flex flex-col justify-between transition-all hover:shadow-md relative"
                >
                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => removeCityFromCompare(cityName)}
                    className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                    title={`Remove ${cityName} from comparison`}
                  >
                    <X size={16} />
                  </button>

                  <div className="space-y-4">
                    {/* City Header */}
                    <div className="pr-8">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white truncate">
                        {cityName}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {country}
                      </p>
                    </div>

                    {/* Temperature & Condition Card */}
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-sky-500/10 via-sky-50/50 to-indigo-50/20 dark:from-sky-950/40 dark:via-slate-800 dark:to-indigo-950/30 border border-sky-100 dark:border-slate-700 flex items-center justify-between">
                      <div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-4xl font-black text-slate-900 dark:text-white">
                            {formatTemp(current.temp, unit)}
                          </span>
                          <span className="text-lg font-light text-sky-600 dark:text-sky-400">
                            °{unit}
                          </span>
                        </div>
                        <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 mt-0.5">
                          {current.condition}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          Feels like {formatTemp(current.feelsLike, unit)}°
                        </p>
                      </div>

                      <div className="p-2.5 rounded-xl bg-white/80 dark:bg-slate-700/60 shadow-2xs">
                        <WeatherIcon condition={current.condition} isNight={current.isNight} size={36} />
                      </div>
                    </div>

                    {/* Relative Highlights / Badges */}
                    <div className="flex flex-wrap gap-1.5">
                      {isHighestTemp && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 flex items-center gap-0.5">
                          <ArrowUp size={11} /> Warmest
                        </span>
                      )}
                      {isLowestTemp && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 flex items-center gap-0.5">
                          <ArrowDown size={11} /> Coolest
                        </span>
                      )}
                      {isBestAqi && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 flex items-center gap-0.5">
                          ★ Best Air
                        </span>
                      )}
                    </div>

                    {/* Meteorological Metric Rows */}
                    <div className="divide-y divide-slate-100 dark:divide-slate-700/60 text-xs">
                      {/* AQI */}
                      <div className="py-2 flex items-center justify-between">
                        <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                          <Activity size={14} className="text-emerald-500" /> AQI
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-900 dark:text-white">{aqiVal}</span>
                          <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${aqiInfo.badgeBg} ${aqiInfo.badgeText}`}>
                            {aqiInfo.label}
                          </span>
                        </div>
                      </div>

                      {/* Humidity */}
                      <div className="py-2 flex items-center justify-between">
                        <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                          <Droplets size={14} className="text-sky-500" /> Humidity
                        </span>
                        <span className="font-bold text-slate-800 dark:text-slate-100">
                          {current.humidity}%
                        </span>
                      </div>

                      {/* Wind Speed */}
                      <div className="py-2 flex items-center justify-between">
                        <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                          <Wind size={14} className="text-teal-500" /> Wind
                        </span>
                        <span className="font-bold text-slate-800 dark:text-slate-100">
                          {formatWindSpeed(current.windSpeed, unit)}
                        </span>
                      </div>

                      {/* Wind Direction */}
                      <div className="py-2 flex items-center justify-between">
                        <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                          <Compass size={14} className="text-indigo-500" /> Direction
                        </span>
                        <span className="font-bold text-slate-800 dark:text-slate-100 truncate max-w-[120px]">
                          {current.windDirection}
                        </span>
                      </div>

                      {/* Pressure */}
                      <div className="py-2 flex items-center justify-between">
                        <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                          <Gauge size={14} className="text-blue-500" /> Pressure
                        </span>
                        <span className="font-bold text-slate-800 dark:text-slate-100">
                          {current.pressure} hPa
                        </span>
                      </div>

                      {/* Visibility */}
                      <div className="py-2 flex items-center justify-between">
                        <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                          <Eye size={14} className="text-emerald-500" /> Visibility
                        </span>
                        <span className="font-bold text-slate-800 dark:text-slate-100">
                          {current.visibility} km
                        </span>
                      </div>

                      {/* UV Index */}
                      <div className="py-2 flex items-center justify-between">
                        <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                          <SunMedium size={14} className="text-amber-500" /> UV Index
                        </span>
                        <div className="flex items-center gap-1">
                          <span className="font-bold text-slate-800 dark:text-slate-100">{current.uvIndex}</span>
                          <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${uvInfo.badgeBg} ${uvInfo.badgeText}`}>
                            {uvInfo.label}
                          </span>
                        </div>
                      </div>

                      {/* Cloud Cover */}
                      <div className="py-2 flex items-center justify-between">
                        <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                          <Cloud size={14} className="text-slate-500" /> Cloud Cover
                        </span>
                        <span className="font-bold text-slate-800 dark:text-slate-100">
                          {current.cloudCover}%
                        </span>
                      </div>

                      {/* Precipitation Probability */}
                      <div className="py-2 flex items-center justify-between">
                        <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                          <Droplets size={14} className="text-cyan-500" /> Rain Chance
                        </span>
                        <span className="font-bold text-cyan-600 dark:text-cyan-400">
                          {rainChance}%
                        </span>
                      </div>

                      {/* Sun Timings */}
                      <div className="py-2 flex items-center justify-between">
                        <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                          <Sunrise size={14} className="text-amber-500" /> Sun Cycle
                        </span>
                        <span className="font-medium text-slate-600 dark:text-slate-300 text-[11px]">
                          {sunInfo?.sunrise || '--'} • {sunInfo?.sunset || '--'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
