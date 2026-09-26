import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, X, Loader2, Compass } from 'lucide-react';
import { useWeather } from '../context/WeatherContext';
import { searchLocations } from '../services/weatherService.js';

export default function SearchBar() {
  const { searchCity, getCurrentLocation, loading } = useWeather();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  
  const containerRef = useRef(null);
  const searchTimeoutRef = useRef(null);

  // Debounced live geocoding suggestions as user types
  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setSuggestions([]);
      setIsOpen(false);
      setIsSearching(false);
      return;
    }

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    setIsSearching(true);
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const results = await searchLocations(trimmed);
        setSuggestions(results);
        setIsOpen(true);
      } catch (err) {
        console.warn('Autocomplete fetch error:', err);
        setSuggestions([]);
        setIsOpen(true);
      } finally {
        setIsSearching(false);
      }
    }, 280);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [query]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle clicking a specific search suggestion item
  const handleSelectLocation = (location) => {
    setQuery(location.name);
    setIsOpen(false);
    searchCity(location);
  };

  // Form submit via Enter key or Search button
  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    // If suggestions are currently visible and populated, select the top ranked match
    if (suggestions.length > 0) {
      handleSelectLocation(suggestions[0]);
    } else {
      setIsOpen(false);
      searchCity(trimmed);
    }
  };

  const handleQuickCity = (city) => {
    setQuery(city);
    setIsOpen(false);
    searchCity(city);
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <div className="relative flex-1 min-w-0">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
            {isSearching ? (
              <Loader2 size={18} className="animate-spin text-sky-500" />
            ) : (
              <Search size={18} />
            )}
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => suggestions.length > 0 && setIsOpen(true)}
            placeholder="Search location (e.g. Bangalore, Rajasthan, Kalaburagi)..."
            className="w-full pl-10 pr-9 py-2 sm:py-2.5 bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 rounded-xl text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 transition-all shadow-xs"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setSuggestions([]);
                setIsOpen(false);
              }}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Search Submit Button */}
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="px-3.5 sm:px-4 py-2 sm:py-2.5 bg-sky-500 hover:bg-sky-600 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white text-sm font-medium rounded-xl shadow-xs transition-all flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer disabled:cursor-not-allowed flex-shrink-0"
        >
          <Search size={16} />
          <span className="hidden sm:inline">Search</span>
        </button>

        {/* Current Location Button */}
        <button
          type="button"
          onClick={getCurrentLocation}
          disabled={loading}
          title="Use current location"
          className="p-2 sm:p-2.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/80 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700/80 rounded-xl shadow-xs transition-all focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer disabled:opacity-50 flex-shrink-0"
        >
          <MapPin size={18} className="text-sky-500 dark:text-sky-400" />
        </button>
      </form>

      {/* Modern Location Autocomplete Dropdown */}
      {isOpen && (
        <div data-testid="search-dropdown" className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden max-h-72 overflow-y-auto custom-scrollbar animate-fadeIn">
          {suggestions.length > 0 ? (
            <>
              <div className="p-2 border-b border-slate-100 dark:border-slate-700/60 bg-slate-50/70 dark:bg-slate-900/40 text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center justify-between">
                <span>Matching Locations</span>
                <span>{suggestions.length} results</span>
              </div>

              <div className="py-1">
                {suggestions.map((loc) => {
                  const regionText = loc.state
                    ? `${loc.state}, ${loc.country}`
                    : (loc.district ? `${loc.district}, ${loc.country}` : loc.country);

                  return (
                    <button
                      key={`${loc.id}_${loc.latitude}_${loc.longitude}`}
                      type="button"
                      onClick={() => handleSelectLocation(loc)}
                      className="w-full text-left px-3.5 py-2.5 hover:bg-sky-50/80 dark:hover:bg-slate-700/70 transition-colors flex items-center gap-3 group cursor-pointer border-b border-slate-50 dark:border-slate-700/40 last:border-b-0"
                    >
                      <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-700 group-hover:bg-sky-500 group-hover:text-white text-slate-500 dark:text-slate-400 transition-colors flex-shrink-0">
                        <MapPin size={15} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors truncate">
                          {loc.name}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                          {regionText}
                        </p>
                      </div>

                      {loc.featureCode === 'ADM1' && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex-shrink-0">
                          State
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </>
          ) : (
            !isSearching && query.trim().length >= 2 && (
              <div className="p-4 text-center text-xs text-slate-500 dark:text-slate-400">
                <p className="font-semibold text-slate-700 dark:text-slate-200 mb-1">
                  No locations found for '{query}'
                </p>
                <p className="text-[11px] text-slate-400">
                  Try another spelling or nearby city.
                </p>
              </div>
            )
          )}
        </div>
      )}

      {/* Suggested Quick Cities */}
      <div className="flex items-center gap-1.5 mt-2 overflow-x-auto pb-0.5 text-xs custom-scrollbar">
        <span className="text-slate-400 dark:text-slate-500 font-medium mr-1 whitespace-nowrap">Suggested:</span>
        {['Bangalore', 'Kolar', 'Rajasthan', 'Kalaburagi', 'Mumbai', 'Delhi', 'London', 'Tokyo'].map((city) => (
          <button
            key={city}
            type="button"
            onClick={() => handleQuickCity(city)}
            className="px-2.5 py-0.5 sm:py-1 bg-slate-100 dark:bg-slate-800/80 hover:bg-sky-50 hover:text-sky-600 dark:hover:bg-slate-700 dark:hover:text-sky-300 text-slate-600 dark:text-slate-300 rounded-full font-medium transition-colors whitespace-nowrap cursor-pointer border border-transparent hover:border-sky-200 dark:hover:border-sky-800"
          >
            {city}
          </button>
        ))}
      </div>
    </div>
  );
}
