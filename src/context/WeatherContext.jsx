import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { fetchWeatherData, fetchWeatherByCoordinates } from '../services/weatherService.js';

const WeatherContext = createContext(null);

export function WeatherProvider({ children }) {
  const [city, setCity] = useState('Bangalore');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Active navigation tab ('overview' | 'favorites' | 'compare' | 'history' | 'map' | 'analytics' | 'recommendations' | 'reports')
  const [activeTab, setActiveTab] = useState('overview');

  // Selected hour state for interactive hourly forecast cards
  const [selectedHourIndex, setSelectedHourIndex] = useState(0);
  const [selectedHour, setSelectedHour] = useState(null);

  // Favorites stored in localStorage
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('weather_dashboard_favorites');
      return saved ? JSON.parse(saved) : [
        {
          id: 'Bengaluru_India',
          name: 'Bengaluru',
          state: 'Karnataka',
          country: 'India',
          latitude: 12.9716,
          longitude: 77.5946,
          timezone: 'Asia/Kolkata'
        },
        {
          id: 'Mumbai_India',
          name: 'Mumbai',
          state: 'Maharashtra',
          country: 'India',
          latitude: 19.0760,
          longitude: 72.8777,
          timezone: 'Asia/Kolkata'
        },
        {
          id: 'London_United Kingdom',
          name: 'London',
          state: 'England',
          country: 'United Kingdom',
          latitude: 51.5085,
          longitude: -0.1257,
          timezone: 'Europe/London'
        }
      ];
    } catch {
      return [];
    }
  });

  // Recent searches stored in localStorage (max 8)
  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      const saved = localStorage.getItem('weather_dashboard_recent_searches');
      return saved ? JSON.parse(saved) : [
        { name: 'Bengaluru', country: 'India', latitude: 12.9716, longitude: 77.5946 },
        { name: 'Kalaburagi', country: 'India', latitude: 17.3358, longitude: 76.8376 },
        { name: 'Mumbai', country: 'India', latitude: 19.0760, longitude: 72.8777 },
        { name: 'London', country: 'United Kingdom', latitude: 51.5085, longitude: -0.1257 }
      ];
    } catch {
      return [];
    }
  });

  // Comparison cities (up to 4)
  const [comparisonCities, setComparisonCities] = useState([]);
  
  // Theme: checks localStorage or system preference
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('weather_dashboard_theme');
    if (saved) return saved;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  });

  // Temperature unit: 'C' or 'F'
  const [unit, setUnit] = useState(() => {
    return localStorage.getItem('weather_dashboard_unit') || 'C';
  });

  // Track dismissed alerts
  const [dismissedAlert, setDismissedAlert] = useState(false);

  // Sync theme with DOM documentElement
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('weather_dashboard_theme', theme);
  }, [theme]);

  // Sync unit with localStorage
  useEffect(() => {
    localStorage.setItem('weather_dashboard_unit', unit);
  }, [unit]);

  // Sync favorites with localStorage
  useEffect(() => {
    try {
      localStorage.setItem('weather_dashboard_favorites', JSON.stringify(favorites));
    } catch (e) {
      console.warn('Failed to save favorites to localStorage:', e);
    }
  }, [favorites]);

  // Sync recent searches with localStorage
  useEffect(() => {
    try {
      localStorage.setItem('weather_dashboard_recent_searches', JSON.stringify(recentSearches));
    } catch (e) {
      console.warn('Failed to save recent searches to localStorage:', e);
    }
  }, [recentSearches]);

  // Add location to recent searches
  const addToRecentSearches = useCallback((loc) => {
    if (!loc || !loc.name) return;
    setRecentSearches((prev) => {
      const filtered = prev.filter(
        (item) => item.name.toLowerCase() !== loc.name.toLowerCase()
      );
      return [
        {
          name: loc.name,
          state: loc.state || '',
          country: loc.country || '',
          latitude: loc.latitude,
          longitude: loc.longitude,
          timezone: loc.timezone || 'auto'
        },
        ...filtered
      ].slice(0, 8);
    });
  }, []);

  // Clear recent searches
  const clearRecentSearches = () => {
    setRecentSearches([]);
  };

  // Toggle favorite status for a city/location
  const toggleFavorite = (loc) => {
    if (!loc) return;
    const locName = loc.city || loc.name;
    const locCountry = loc.country || 'Global';
    const locState = loc.state || '';
    const locId = `${locName}_${locCountry}`;

    setFavorites((prev) => {
      const exists = prev.some(
        (f) => f.name.toLowerCase() === locName.toLowerCase() || f.id === locId
      );
      if (exists) {
        return prev.filter(
          (f) => f.name.toLowerCase() !== locName.toLowerCase() && f.id !== locId
        );
      } else {
        return [
          {
            id: locId,
            name: locName,
            state: locState,
            country: locCountry,
            latitude: loc.coordinates?.lat || loc.latitude,
            longitude: loc.coordinates?.lon || loc.longitude,
            timezone: loc.timezone || 'auto',
            addedAt: Date.now()
          },
          ...prev
        ];
      }
    });
  };

  // Check if current city is in favorites
  const isFavorited = (cityName) => {
    if (!cityName) return false;
    return favorites.some(
      (f) => f.name.toLowerCase() === cityName.toLowerCase()
    );
  };

  // Remove specific favorite by ID
  const removeFavorite = (id) => {
    setFavorites((prev) => prev.filter((f) => f.id !== id && f.name !== id));
  };

  // Load weather function supporting both city string and location object
  const loadWeather = useCallback(async (queryOrLocation) => {
    setLoading(true);
    setError(null);
    setDismissedAlert(false);

    try {
      const data = await fetchWeatherData(queryOrLocation);
      setWeatherData(data);
      setCity(data.city);

      // Record into recent searches
      addToRecentSearches({
        name: data.city,
        country: data.country,
        latitude: data.coordinates.lat,
        longitude: data.coordinates.lon,
        timezone: data.timezone
      });

      // Default selected hour to the first ("Now") hourly entry
      if (data?.hourly?.length > 0) {
        setSelectedHour(data.hourly[0]);
        setSelectedHourIndex(0);
      } else {
        setSelectedHour(null);
        setSelectedHourIndex(0);
      }
    } catch (err) {
      console.error("Error fetching weather:", err);
      setError(err.message || 'Unable to fetch weather data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [addToRecentSearches]);

  // Initial load
  useEffect(() => {
    loadWeather(city);
  }, [loadWeather]);

  // Comparison Management
  const addCityToCompare = useCallback(async (locOrData) => {
    if (comparisonCities.length >= 4) {
      return { success: false, message: 'You can compare up to 4 cities at once.' };
    }

    try {
      // Check if already in comparison
      const cityNameToCompare = locOrData.city || locOrData.name;
      if (comparisonCities.some(c => c.city.toLowerCase() === cityNameToCompare.toLowerCase())) {
        return { success: false, message: `${cityNameToCompare} is already in the comparison.` };
      }

      // If full weather data was passed
      if (locOrData.current && locOrData.airQuality) {
        setComparisonCities(prev => [...prev, locOrData]);
        return { success: true };
      }

      // Fetch weather for the city to compare
      const data = await fetchWeatherData(locOrData);
      setComparisonCities(prev => [...prev, data]);
      return { success: true };
    } catch (err) {
      console.error('Error adding city to compare:', err);
      return { success: false, message: err.message || 'Failed to load weather for comparison.' };
    }
  }, [comparisonCities]);

  const removeCityFromCompare = (cityName) => {
    setComparisonCities(prev => prev.filter(c => c.city.toLowerCase() !== cityName.toLowerCase()));
  };

  const clearComparison = () => {
    setComparisonCities([]);
  };

  // Select hourly forecast time handler (instant, without network reload)
  const selectHour = (index) => {
    if (weatherData?.hourly?.[index]) {
      setSelectedHour(weatherData.hourly[index]);
      setSelectedHourIndex(index);
    }
  };

  // Toggle Theme handler
  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Toggle Unit handler
  const toggleUnit = () => {
    setUnit((prev) => (prev === 'C' ? 'F' : 'C'));
  };

  // Search City handler
  const searchCity = (queryOrLocation) => {
    if (!queryOrLocation) return;
    if (typeof queryOrLocation === 'string' && !queryOrLocation.trim()) return;
    loadWeather(queryOrLocation);
  };

  // Current Location handler using HTML5 Geolocation API
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    setLoading(true);
    setError(null);
    setDismissedAlert(false);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const data = await fetchWeatherByCoordinates(latitude, longitude);
          setWeatherData(data);
          setCity(data.city);

          addToRecentSearches({
            name: data.city,
            country: data.country,
            latitude: data.coordinates.lat,
            longitude: data.coordinates.lon,
            timezone: data.timezone
          });

          if (data?.hourly?.length > 0) {
            setSelectedHour(data.hourly[0]);
            setSelectedHourIndex(0);
          }
        } catch (err) {
          setError('Failed to fetch weather for your coordinates.');
        } finally {
          setLoading(false);
        }
      },
      (geoError) => {
        setLoading(false);
        let msg = 'Could not access your location.';
        if (geoError.code === geoError.PERMISSION_DENIED) {
          msg = 'Location access was denied. Please allow location permissions in your browser settings or search for a city above.';
        } else if (geoError.code === geoError.POSITION_UNAVAILABLE) {
          msg = 'Location information is currently unavailable. Please search for a city above.';
        } else if (geoError.code === geoError.TIMEOUT) {
          msg = 'Location request timed out. Please try again or search for a city above.';
        }
        setError(msg);
      },
      { timeout: 10000 }
    );
  };

  // Fetch weather directly by coordinates (used by map click)
  const fetchWeatherByCoords = useCallback(async (latitude, longitude) => {
    setLoading(true);
    setError(null);
    setDismissedAlert(false);

    try {
      const data = await fetchWeatherByCoordinates(latitude, longitude);
      setWeatherData(data);
      setCity(data.city);

      addToRecentSearches({
        name: data.city,
        country: data.country,
        latitude: data.coordinates.lat,
        longitude: data.coordinates.lon,
        timezone: data.timezone
      });

      if (data?.hourly?.length > 0) {
        setSelectedHour(data.hourly[0]);
        setSelectedHourIndex(0);
      }
    } catch (err) {
      console.error('Failed to fetch weather for coordinates:', err);
      setError('Failed to fetch weather for coordinates.');
    } finally {
      setLoading(false);
    }
  }, [addToRecentSearches]);

  const retry = () => {
    loadWeather(city || 'Bangalore');
  };

  const dismissAlert = () => {
    setDismissedAlert(true);
  };

  return (
    <WeatherContext.Provider
      value={{
        weatherData,
        city,
        loading,
        error,
        theme,
        unit,
        activeTab,
        selectedHour,
        selectedHourIndex,
        favorites,
        recentSearches,
        comparisonCities,
        dismissedAlert,
        setActiveTab,
        selectHour,
        toggleFavorite,
        isFavorited,
        removeFavorite,
        clearRecentSearches,
        addCityToCompare,
        removeCityFromCompare,
        clearComparison,
        toggleTheme,
        toggleUnit,
        searchCity,
        loadWeather,
        fetchWeatherByCoords,
        getCurrentLocation,
        retry,
        dismissAlert
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
}

export function useWeather() {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }
  return context;
}
