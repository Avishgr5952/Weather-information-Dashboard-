import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import { useWeather } from '../context/WeatherContext';
import { formatTempString } from '../utils/formatters';
import { getConditionFromCode } from '../services/weatherService';
import {
  Navigation,
  Globe,
  Layers,
  MapPin,
  Compass,
  Loader2
} from 'lucide-react';

// Preset curated major world weather discovery hubs (No POIs/hospitals)
const DISCOVERY_CITIES = [
  { name: 'Bengaluru', state: 'Karnataka', country: 'India', lat: 12.9716, lon: 77.5946 },
  { name: 'New Delhi', state: 'Delhi', country: 'India', lat: 28.6139, lon: 77.2090 },
  { name: 'Mumbai', state: 'Maharashtra', country: 'India', lat: 19.0760, lon: 72.8777 },
  { name: 'Kolkata', state: 'West Bengal', country: 'India', lat: 22.5726, lon: 88.3639 },
  { name: 'Chennai', state: 'Tamil Nadu', country: 'India', lat: 13.0827, lon: 80.2707 },
  { name: 'Hyderabad', state: 'Telangana', country: 'India', lat: 17.3850, lon: 78.4867 },
  { name: 'London', state: 'England', country: 'United Kingdom', lat: 51.5074, lon: -0.1278 },
  { name: 'Tokyo', state: 'Tokyo', country: 'Japan', lat: 35.6762, lon: 139.6503 },
  { name: 'New York', state: 'New York', country: 'United States', lat: 40.7128, lon: -74.0060 },
  { name: 'Dubai', state: 'Dubai', country: 'United Arab Emirates', lat: 25.2048, lon: 55.2708 },
  { name: 'Paris', state: 'Île-de-France', country: 'France', lat: 48.8566, lon: 2.3522 },
  { name: 'Sydney', state: 'New South Wales', country: 'Australia', lat: -33.8688, lon: 151.2093 }
];

// 100% Free Public OpenStreetMap Basemap (Standard Raster Tiles)
const OSM_TILE_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const OSM_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

export default function WeatherMap() {
  const {
    weatherData,
    loadWeather,
    setActiveTab,
    favorites,
    unit,
    theme
  } = useWeather();

  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);
  const clickMarkerRef = useRef(null);

  const [mapStyle, setMapStyle] = useState('auto'); // 'auto', 'light', 'dark'

  const activeLat = weatherData?.coordinates?.lat ?? weatherData?.location?.latitude ?? 12.9716;
  const activeLon = weatherData?.coordinates?.lon ?? weatherData?.location?.longitude ?? 77.5946;
  const activeCity = weatherData?.city ?? weatherData?.location?.city ?? 'Bengaluru';
  const activeCountry = weatherData?.country ?? weatherData?.location?.country ?? 'India';
  const activeTemp = formatTempString(weatherData?.current?.temp ?? 24, unit);
  const activeCondition = weatherData?.current?.condition ?? 'Clear';
  const activeHumidity = weatherData?.current?.humidity ?? 65;

  const isDarkMode = mapStyle === 'dark' || (mapStyle === 'auto' && theme === 'dark');

  // Load weather handler for popups
  const handleLoadLocation = useCallback((loc) => {
    loadWeather(loc);
    setActiveTab('overview');
  }, [loadWeather, setActiveTab]);

  // Handle map click with reverse geocoding and live weather
  const handleMapClick = useCallback(async (lat, lon) => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    const clickIcon = L.divIcon({
      className: 'custom-click-pin',
      html: `
        <div class="relative flex items-center justify-center">
          <div class="w-8 h-8 rounded-full bg-sky-500/30 animate-ping absolute"></div>
          <div class="w-6 h-6 rounded-full bg-sky-600 border-2 border-white shadow-lg flex items-center justify-center text-white text-xs font-bold">
            📍
          </div>
        </div>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });

    if (clickMarkerRef.current) {
      clickMarkerRef.current.setLatLng([lat, lon]);
    } else {
      clickMarkerRef.current = L.marker([lat, lon], { icon: clickIcon }).addTo(map);
    }

    // Initial loading popup
    const popup = L.popup({ minWidth: 220 })
      .setLatLng([lat, lon])
      .setContent(`
        <div class="p-3 font-sans text-center">
          <div class="flex items-center justify-center gap-2 text-sky-600 font-semibold text-xs mb-1">
            <span>⏳</span> Detecting location & weather...
          </div>
          <div class="text-[11px] text-slate-500 font-mono">${lat.toFixed(4)}°, ${lon.toFixed(4)}°</div>
        </div>
      `)
      .openOn(map);

    let placeName = `Point (${lat.toFixed(2)}°, ${lon.toFixed(2)}°)`;
    let stateCountry = 'Geographic Coordinates';
    let tempStr = '--';
    let condition = 'Partly Cloudy';
    let humidity = '--';

    // 1. Nominatim Reverse Geocoding
    try {
      const nomUrl = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=jsonv2&zoom=10&addressdetails=1`;
      const res = await fetch(nomUrl, {
        headers: {
          'User-Agent': 'WeatherInformationDashboard/1.0 (academic BCA project; contact@weatherdashboard.edu)'
        }
      });
      if (res.ok) {
        const d = await res.json();
        const addr = d.address || {};
        const extracted = addr.city || addr.town || addr.village || addr.suburb || addr.municipality || addr.county || addr.state_district || d.name;
        if (extracted) placeName = extracted;
        const state = addr.state || addr.province || addr.region || '';
        const country = addr.country || '';
        const parts = [state, country].filter(Boolean);
        if (parts.length > 0) stateCountry = parts.join(', ');
      }
    } catch (err) {
      console.warn('Reverse geocoding error:', err);
    }

    // 2. Fetch Live Weather for Coordinates
    try {
      const wUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code&timezone=auto`;
      const wRes = await fetch(wUrl);
      if (wRes.ok) {
        const wData = await wRes.json();
        if (wData.current) {
          const rawTemp = wData.current.temperature_2m;
          tempStr = formatTempString(rawTemp, unit);
          condition = getConditionFromCode(wData.current.weather_code, 1);
          humidity = `${wData.current.relative_humidity_2m}%`;
        }
      }
    } catch (err) {
      console.warn('Point weather error:', err);
    }

    const popupHtml = `
      <div class="p-3 min-w-[210px] font-sans">
        <div class="font-bold text-sm text-slate-900 leading-tight mb-0.5">${placeName}</div>
        <div class="text-xs text-slate-500 mb-2">${stateCountry}</div>
        <div class="text-base font-extrabold text-sky-600 mb-0.5">${tempStr}</div>
        <div class="text-xs text-slate-700 font-medium mb-1">${condition}</div>
        <div class="text-xs text-slate-500 mb-3">Humidity: <b>${humidity}</b></div>
        <button
          id="btn-load-map-point"
          class="w-full py-1.5 px-3 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
        >
          Load Weather
        </button>
      </div>
    `;

    popup.setContent(popupHtml);

    setTimeout(() => {
      const btn = document.getElementById('btn-load-map-point');
      if (btn) {
        btn.onclick = () => {
          handleLoadLocation({
            name: placeName,
            country: stateCountry,
            latitude: lat,
            longitude: lon
          });
        };
      }
    }, 50);
  }, [unit, handleLoadLocation]);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [activeLat, activeLon],
        zoom: 6,
        zoomControl: false,
        worldCopyJump: true
      });

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // Standard OpenStreetMap Tile Layer
      L.tileLayer(OSM_TILE_URL, {
        attribution: OSM_ATTRIBUTION,
        maxZoom: 19,
        minZoom: 2
      }).addTo(map);

      markersLayerRef.current = L.layerGroup().addTo(map);

      // Click anywhere to discover weather
      map.on('click', (e) => {
        const { lat, lng } = e.latlng;
        handleMapClick(Number(lat.toFixed(4)), Number(lng.toFixed(4)));
      });

      mapInstanceRef.current = map;

      // Invalidate size to guarantee no gray tiles
      setTimeout(() => map.invalidateSize(), 150);
      setTimeout(() => map.invalidateSize(), 400);
    }

    // Invalidate size on window resize
    const handleResize = () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    };
    window.addEventListener('resize', handleResize);

    // ResizeObserver for container element
    let resizeObserver = null;
    if (typeof ResizeObserver !== 'undefined' && mapContainerRef.current) {
      resizeObserver = new ResizeObserver(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      });
      resizeObserver.observe(mapContainerRef.current);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      if (resizeObserver) resizeObserver.disconnect();
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Markers when active location, favorites, or unit changes
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;
    const map = mapInstanceRef.current;
    const layer = markersLayerRef.current;
    layer.clearLayers();

    // 1. Active / Selected Weather Location Marker
    const activeIcon = L.divIcon({
      className: 'active-city-pin',
      html: `
        <div class="relative flex items-center justify-center cursor-pointer">
          <div class="w-10 h-10 rounded-full bg-sky-500/40 animate-pulse absolute"></div>
          <div class="w-8 h-8 rounded-full bg-sky-600 border-2 border-white shadow-xl flex items-center justify-center text-white text-xs font-bold">
            🌤️
          </div>
          <div class="absolute -bottom-6 bg-slate-900/90 text-white text-[11px] font-bold px-2 py-0.5 rounded shadow whitespace-nowrap">
            ${activeCity} (${activeTemp})
          </div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });

    const activeMarker = L.marker([activeLat, activeLon], { icon: activeIcon });
    activeMarker.bindPopup(`
      <div class="p-3 min-w-[200px] font-sans">
        <div class="font-bold text-sm text-slate-900 mb-0.5">${activeCity}</div>
        <div class="text-xs text-sky-600 font-semibold mb-2">⭐ Active Selected Location</div>
        <div class="text-base font-extrabold text-sky-600 mb-0.5">${activeTemp}</div>
        <div class="text-xs text-slate-700 font-medium mb-1">${activeCondition}</div>
        <div class="text-xs text-slate-500 mb-3">Humidity: <b>${activeHumidity}%</b></div>
        <button
          id="btn-active-loc-overview"
          class="w-full py-1.5 px-3 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-semibold shadow-xs cursor-pointer"
        >
          View Full Overview
        </button>
      </div>
    `);

    activeMarker.on('popupopen', () => {
      const btn = document.getElementById('btn-active-loc-overview');
      if (btn) btn.onclick = () => setActiveTab('overview');
    });

    layer.addLayer(activeMarker);

    // 2. Favorite Cities Markers
    favorites.forEach((fav) => {
      if (fav.latitude && fav.longitude && (fav.name.toLowerCase() !== activeCity.toLowerCase())) {
        const favIcon = L.divIcon({
          className: 'fav-city-pin',
          html: `
            <div class="relative flex items-center justify-center cursor-pointer">
              <div class="w-6 h-6 rounded-full bg-amber-500 border-2 border-white shadow-md flex items-center justify-center text-white text-xs">
                ⭐
              </div>
              <div class="absolute -bottom-5 bg-amber-900/90 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded shadow whitespace-nowrap">
                ${fav.name}
              </div>
            </div>
          `,
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        });

        const favMarker = L.marker([fav.latitude, fav.longitude], { icon: favIcon });
        const favId = `fav-btn-${fav.id || fav.name}`.replace(/[^a-zA-Z0-9_-]/g, '');

        favMarker.bindPopup(`
          <div class="p-3 min-w-[190px] font-sans">
            <div class="font-bold text-sm text-slate-900 mb-0.5">${fav.name}</div>
            <div class="text-xs text-amber-600 font-medium mb-1">⭐ Favorite Location</div>
            <div class="text-xs text-slate-500 mb-3">${fav.state ? fav.state + ', ' : ''}${fav.country}</div>
            <button
              id="${favId}"
              class="w-full py-1.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs cursor-pointer"
            >
              Load Weather
            </button>
          </div>
        `);

        favMarker.on('popupopen', () => {
          const btn = document.getElementById(favId);
          if (btn) {
            btn.onclick = () => handleLoadLocation(fav);
          }
        });

        layer.addLayer(favMarker);
      }
    });

    // 3. Curated World Weather Discovery Hubs
    DISCOVERY_CITIES.forEach((dc) => {
      const isAlreadyActive = dc.name.toLowerCase() === activeCity.toLowerCase();
      const isFav = favorites.some(f => f.name.toLowerCase() === dc.name.toLowerCase());
      if (isAlreadyActive || isFav) return;

      const discoIcon = L.divIcon({
        className: 'disco-city-pin',
        html: `
          <div class="relative flex items-center justify-center opacity-85 hover:opacity-100 transition-opacity cursor-pointer">
            <div class="w-3.5 h-3.5 rounded-full bg-slate-600 border border-white shadow-sm flex items-center justify-center text-[7px] text-white">
              •
            </div>
          </div>
        `,
        iconSize: [14, 14],
        iconAnchor: [7, 7]
      });

      const discoMarker = L.marker([dc.lat, dc.lon], { icon: discoIcon });
      const discoId = `disco-btn-${dc.name}`.replace(/[^a-zA-Z0-9_-]/g, '');

      discoMarker.bindPopup(`
        <div class="p-3 min-w-[180px] font-sans">
          <div class="font-bold text-sm text-slate-900 mb-0.5">${dc.name}</div>
          <div class="text-xs text-slate-500 mb-1">${dc.state ? dc.state + ', ' : ''}${dc.country}</div>
          <div class="text-[11px] text-slate-400 mb-3">Global Weather Station</div>
          <button
            id="${discoId}"
            class="w-full py-1.5 px-3 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-semibold shadow-xs cursor-pointer"
          >
            Load Weather
          </button>
        </div>
      `);

      discoMarker.on('popupopen', () => {
        const btn = document.getElementById(discoId);
        if (btn) {
          btn.onclick = () => handleLoadLocation({
            name: dc.name,
            state: dc.state,
            country: dc.country,
            latitude: dc.lat,
            longitude: dc.lon
          });
        }
      });

      layer.addLayer(discoMarker);
    });

  }, [activeLat, activeLon, activeCity, activeCountry, activeTemp, activeCondition, activeHumidity, favorites, handleLoadLocation, setActiveTab]);

  // Recenter on Active City
  const handleRecenter = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([activeLat, activeLon], 8, { duration: 1.2 });
    }
  };

  // Preset Region Views
  const handleZoomIndia = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([22.5, 82.5], 5, { duration: 1.2 });
    }
  };

  const handleZoomWorld = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([20, 0], 2, { duration: 1.2 });
    }
  };

  return (
    <div className="space-y-4">
      {/* Map Control Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 rounded-xl">
              <Globe size={20} />
            </span>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-slate-100">
                Interactive Weather Map
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Centered on <span className="font-semibold text-slate-700 dark:text-slate-200">{activeCity}, {activeCountry}</span> • Click anywhere to discover weather
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Recenter */}
          <button
            type="button"
            onClick={handleRecenter}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-50 hover:bg-sky-100 dark:bg-sky-950/60 dark:hover:bg-sky-900/60 text-sky-700 dark:text-sky-300 rounded-xl text-xs font-semibold transition-all border border-sky-200 dark:border-sky-800 cursor-pointer"
          >
            <Navigation size={13} className="text-sky-500" />
            Recenter {activeCity}
          </button>

          {/* Quick Views */}
          <button
            type="button"
            onClick={handleZoomIndia}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold transition-all cursor-pointer"
          >
            India View
          </button>
          <button
            type="button"
            onClick={handleZoomWorld}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold transition-all cursor-pointer"
          >
            World View
          </button>

          {/* Style Selector */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setMapStyle('auto')}
              className={`px-2 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                mapStyle === 'auto' ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-300 shadow-xs' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Adaptive
            </button>
            <button
              type="button"
              onClick={() => setMapStyle('light')}
              className={`px-2 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                mapStyle === 'light' ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-300 shadow-xs' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Light
            </button>
            <button
              type="button"
              onClick={() => setMapStyle('dark')}
              className={`px-2 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                mapStyle === 'dark' ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-300 shadow-xs' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Dark
            </button>
          </div>
        </div>
      </div>

      {/* Map Display Card */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-md h-[450px] sm:h-[600px] w-full max-w-full">
        {/* Leaflet Container */}
        <div
          ref={mapContainerRef}
          className={`w-full h-full z-0 transition-all ${isDarkMode ? 'dark-map-tiles' : ''}`}
        />

        {/* Legend Overlay */}
        <div className="absolute top-4 left-4 z-10 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-xl p-3 border border-slate-200/80 dark:border-slate-800/80 shadow-md text-xs space-y-1.5 pointer-events-auto">
          <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 mb-1">
            <Layers size={14} className="text-sky-500" /> Map Legend
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-sky-500 border border-white shadow-xs"></span>
            <span className="text-slate-600 dark:text-slate-400 text-[11px]">Active Location ({activeCity})</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-amber-500 border border-white shadow-xs"></span>
            <span className="text-slate-600 dark:text-slate-400 text-[11px]">Favorites ({favorites.length})</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-600 border border-white shadow-xs"></span>
            <span className="text-slate-600 dark:text-slate-400 text-[11px]">Global Discovery Hubs</span>
          </div>
        </div>
      </div>
    </div>
  );
}
