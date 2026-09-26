import React, { useState, useEffect, useMemo } from 'react';
import { useWeather } from '../context/WeatherContext';
import { fetchHistoricalWeather, getHistoricalPresets, getSafeHistoricalEndDate } from '../services/historicalWeatherService';
import { getConditionFromCode } from '../services/weatherService';
import { formatTemp, formatTempString, formatWindSpeed, formatDayDate } from '../utils/formatters';
import { WeatherIcon } from '../utils/weatherIcons';
import {
  TrendingUp,
  Droplets,
  Wind,
  AlertCircle,
  Loader2,
  ArrowUpRight,
  ArrowDownRight,
  CalendarRange,
  RotateCw
} from 'lucide-react';

export default function HistoricalWeather() {
  const { weatherData, unit } = useWeather();
  const presets = useMemo(() => getHistoricalPresets(), []);

  const [activePreset, setActivePreset] = useState('7d');
  const [customStart, setCustomStart] = useState(presets[0]?.startDate || '');
  const [customEnd, setCustomEnd] = useState(presets[0]?.endDate || '');
  const [showCustomPicker, setShowCustomPicker] = useState(false);
  const [customError, setCustomError] = useState(null);

  const [reloadTrigger, setReloadTrigger] = useState(0);
  const [bypassCache, setBypassCache] = useState(false);
  const [historyData, setHistoryData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hoveredDay, setHoveredDay] = useState(null);

  const lat = weatherData?.coordinates?.lat ?? weatherData?.location?.latitude;
  const lon = weatherData?.coordinates?.lon ?? weatherData?.location?.longitude;
  const city = weatherData?.city ?? weatherData?.location?.city ?? weatherData?.name ?? 'Location';
  const country = weatherData?.country ?? weatherData?.location?.country ?? '';

  const safeEndDate = presets[0]?.endDate || getSafeHistoricalEndDate();
  const minAllowedDate = presets[3]?.startDate; // ~90 days ago

  // Load historical data whenever location, preset, or reload trigger changes
  useEffect(() => {
    if (lat == null || lon == null) {
      return;
    }

    let start = presets[0]?.startDate;
    let end = presets[0]?.endDate;

    if (activePreset === 'custom') {
      start = customStart;
      end = customEnd;
    } else {
      const match = presets.find(p => p.id === activePreset);
      if (match) {
        start = match.startDate;
        end = match.endDate;
      }
    }

    if (!start || !end) return;

    let isMounted = true;
    async function loadData() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetchHistoricalWeather(lat, lon, start, end, bypassCache);
        if (isMounted) {
          setHistoryData(res);
        }
      } catch (err) {
        if (isMounted) {
          console.error('Error fetching historical weather:', err);
          setError(err.message || 'Failed to retrieve historical weather archive.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
          setBypassCache(false);
        }
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [lat, lon, activePreset, reloadTrigger, presets]);

  const handleRefresh = () => {
    setBypassCache(true);
    setReloadTrigger(prev => prev + 1);
  };

  const handleApplyCustom = (e) => {
    e.preventDefault();
    setCustomError(null);
    if (!customStart || !customEnd) {
      setCustomError('Please choose both start and end dates.');
      return;
    }
    if (new Date(customStart) > new Date(customEnd)) {
      setCustomError('Start date cannot be after end date.');
      return;
    }
    if (customEnd > safeEndDate) {
      setCustomError(`End date cannot be later than ${safeEndDate} (completed archive date).`);
      return;
    }
    if (minAllowedDate && customStart < minAllowedDate) {
      setCustomError(`Start date cannot be earlier than ${minAllowedDate} (past 90 days limit).`);
      return;
    }
    setActivePreset('custom');
    setReloadTrigger(prev => prev + 1);
  };

  if (lat == null || lon == null) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 text-center">
        <CalendarRange className="w-12 h-12 mx-auto text-slate-400 mb-3" />
        <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200">No Location Selected</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Search for a city first to view its historical weather archive.
        </p>
      </div>
    );
  }

  // Chart calculation helpers
  const days = historyData?.days || [];
  const validMaxTemps = days.filter(d => d.tempMax != null).map(d => formatTemp(d.tempMax, unit));
  const validMinTemps = days.filter(d => d.tempMin != null).map(d => formatTemp(d.tempMin, unit));
  const maxPrecip = Math.max(...days.map(d => d.precipitation || 0), 5);

  const highestChartTemp = validMaxTemps.length ? Math.max(...validMaxTemps) + 3 : 40;
  const lowestChartTemp = validMinTemps.length ? Math.min(...validMinTemps) - 3 : 0;
  const tempRange = Math.max(highestChartTemp - lowestChartTemp, 1);

  // SVG dimensions
  const svgWidth = 700;
  const svgHeight = 220;
  const paddingX = 40;
  const paddingY = 30;
  const plotWidth = svgWidth - paddingX * 2;
  const plotHeight = svgHeight - paddingY * 2;

  const getX = (idx) => {
    if (days.length <= 1) return paddingX + plotWidth / 2;
    return paddingX + (idx / (days.length - 1)) * plotWidth;
  };

  const getY = (tempVal) => {
    const ratio = (tempVal - lowestChartTemp) / tempRange;
    return svgHeight - paddingY - ratio * plotHeight;
  };

  // Generate SVG polyline points (filtering nulls)
  const maxPoints = days
    .map((d, i) => d.tempMax != null ? `${getX(i)},${getY(formatTemp(d.tempMax, unit))}` : null)
    .filter(Boolean)
    .join(' ');

  const minPoints = days
    .map((d, i) => d.tempMin != null ? `${getX(i)},${getY(formatTemp(d.tempMin, unit))}` : null)
    .filter(Boolean)
    .join(' ');

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-xl">
                <CalendarRange size={22} />
              </span>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100">
                  Historical Weather Archive
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Observed historical climate records for <span className="font-semibold text-slate-700 dark:text-slate-200">{city}{country ? `, ${country}` : ''}</span> via Open-Meteo
                </p>
              </div>
            </div>
          </div>

          {/* Preset Buttons + Refresh */}
          <div className="flex flex-wrap items-center gap-2">
            {presets.map(p => (
              <button
                key={p.id}
                onClick={() => {
                  setActivePreset(p.id);
                  setShowCustomPicker(false);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  activePreset === p.id && !showCustomPicker
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                {p.label}
              </button>
            ))}
            <button
              onClick={() => setShowCustomPicker(!showCustomPicker)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                showCustomPicker || activePreset === 'custom'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              Custom Range
            </button>

            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              disabled={loading}
              title="Refresh Historical Data"
              className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors disabled:opacity-50 flex items-center gap-1.5 px-2.5 text-xs font-medium"
            >
              <RotateCw size={13} className={loading ? 'animate-spin text-indigo-500' : ''} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Custom Range Selector Collapse */}
        {showCustomPicker && (
          <form
            onSubmit={handleApplyCustom}
            className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-3 text-xs"
          >
            <div className="flex items-center gap-2">
              <label className="font-medium text-slate-600 dark:text-slate-400">Start Date:</label>
              <input
                type="date"
                value={customStart}
                min={minAllowedDate}
                max={safeEndDate}
                onChange={(e) => setCustomStart(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="font-medium text-slate-600 dark:text-slate-400">End Date:</label>
              <input
                type="date"
                value={customEnd}
                min={minAllowedDate}
                max={safeEndDate}
                onChange={(e) => setCustomEnd(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-colors shadow-sm"
            >
              Fetch Archive
            </button>
            {customError && (
              <span className="w-full text-xs text-rose-500 font-medium mt-1">
                {customError}
              </span>
            )}
          </form>
        )}
      </div>

      {/* Loading & Error States */}
      {loading && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 border border-slate-200 dark:border-slate-800 text-center">
          <Loader2 className="w-8 h-8 mx-auto text-indigo-600 animate-spin mb-3" />
          <p className="text-slate-600 dark:text-slate-300 font-medium">Fetching historical weather archives from Open-Meteo...</p>
        </div>
      )}

      {error && !loading && (
        <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 rounded-2xl p-6 text-rose-700 dark:text-rose-300 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-rose-500" />
            <div>
              <h4 className="font-semibold text-sm">Failed to Load Historical Data</h4>
              <p className="text-xs mt-1 text-rose-600 dark:text-rose-400">{error}</p>
            </div>
          </div>
          <button
            onClick={handleRefresh}
            className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold whitespace-nowrap transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && historyData && days.length === 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 text-center">
          <CalendarRange className="w-10 h-10 mx-auto text-slate-400 mb-2" />
          <h4 className="font-semibold text-sm text-slate-700 dark:text-slate-200">No Records Found</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            No historical meteorological observations were returned for this date range.
          </p>
        </div>
      )}

      {/* Content when data loaded */}
      {!loading && !error && historyData && days.length > 0 && (
        <>
          {/* Summary Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {/* Avg High */}
            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400 dark:text-slate-500">
                <span className="text-xs font-semibold tracking-wider uppercase">Avg High</span>
                <span className="p-1.5 bg-rose-50 dark:bg-rose-950/50 text-rose-500 rounded-lg">
                  <ArrowUpRight size={14} />
                </span>
              </div>
              <div className="mt-2">
                <div className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100">
                  {formatTempString(historyData.summary.avgMaxTemp, unit)}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Peak daytime warmth
                </div>
              </div>
            </div>

            {/* Avg Low */}
            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400 dark:text-slate-500">
                <span className="text-xs font-semibold tracking-wider uppercase">Avg Low</span>
                <span className="p-1.5 bg-sky-50 dark:bg-sky-950/50 text-sky-500 rounded-lg">
                  <ArrowDownRight size={14} />
                </span>
              </div>
              <div className="mt-2">
                <div className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100">
                  {formatTempString(historyData.summary.avgMinTemp, unit)}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Coolest overnight
                </div>
              </div>
            </div>

            {/* Total Rainfall */}
            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400 dark:text-slate-500">
                <span className="text-xs font-semibold tracking-wider uppercase">Total Rain</span>
                <span className="p-1.5 bg-blue-50 dark:bg-blue-950/50 text-blue-500 rounded-lg">
                  <Droplets size={14} />
                </span>
              </div>
              <div className="mt-2">
                <div className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100">
                  {historyData.summary.totalPrecipitation} <span className="text-sm font-normal text-slate-500">mm</span>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Across {historyData.summary.totalDays} days
                </div>
              </div>
            </div>

            {/* Rainy Days */}
            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400 dark:text-slate-500">
                <span className="text-xs font-semibold tracking-wider uppercase">Rainy Days</span>
                <span className="p-1.5 bg-cyan-50 dark:bg-cyan-950/50 text-cyan-500 rounded-lg">
                  <Droplets size={14} />
                </span>
              </div>
              <div className="mt-2">
                <div className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100">
                  {historyData.summary.rainyDaysCount} <span className="text-sm font-normal text-slate-500">days</span>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  {Math.round((historyData.summary.rainyDaysCount / Math.max(historyData.summary.totalDays, 1)) * 100)}% of period
                </div>
              </div>
            </div>

            {/* Peak Wind */}
            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between col-span-2 sm:col-span-1">
              <div className="flex items-center justify-between text-slate-400 dark:text-slate-500">
                <span className="text-xs font-semibold tracking-wider uppercase">Peak Wind</span>
                <span className="p-1.5 bg-teal-50 dark:bg-teal-950/50 text-teal-500 rounded-lg">
                  <Wind size={14} />
                </span>
              </div>
              <div className="mt-2">
                <div className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100">
                  {formatWindSpeed(historyData.summary.peakWindSpeed, unit)}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Maximum observed gust
                </div>
              </div>
            </div>
          </div>

          {/* Temperature Trend SVG Chart */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-base text-slate-800 dark:text-slate-100 flex items-center gap-2">
                  <TrendingUp size={18} className="text-indigo-500" />
                  Historical Temperature Curve
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Observed daily high vs low trends (°{unit})
                </p>
              </div>

              {/* Legend */}
              <div className="flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
                  <span className="text-slate-600 dark:text-slate-300 font-medium">Daily Max</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-sky-500 inline-block" />
                  <span className="text-slate-600 dark:text-slate-300 font-medium">Daily Min</span>
                </span>
              </div>
            </div>

            {/* SVG Visual */}
            <div className="relative overflow-x-auto">
              <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto min-w-[550px] overflow-visible">
                {/* Horizontal reference lines */}
                {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
                  const yVal = svgHeight - paddingY - ratio * plotHeight;
                  const tempLabel = Math.round(lowestChartTemp + ratio * tempRange);
                  return (
                    <g key={i}>
                      <line
                        x1={paddingX}
                        y1={yVal}
                        x2={svgWidth - paddingX}
                        y2={yVal}
                        stroke="currentColor"
                        strokeDasharray="4 4"
                        className="text-slate-200 dark:text-slate-800"
                        strokeWidth="1"
                      />
                      <text
                        x={paddingX - 8}
                        y={yVal + 4}
                        textAnchor="end"
                        className="text-[10px] fill-slate-400 font-mono"
                      >
                        {tempLabel}°
                      </text>
                    </g>
                  );
                })}

                {/* Min Temp Line */}
                {minPoints && (
                  <polyline
                    fill="none"
                    stroke="#0284c7"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={minPoints}
                  />
                )}

                {/* Max Temp Line */}
                {maxPoints && (
                  <polyline
                    fill="none"
                    stroke="#f43f5e"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={maxPoints}
                  />
                )}

                {/* Points and Tooltips */}
                {days.map((day, idx) => {
                  const x = getX(idx);
                  const yMax = day.tempMax != null ? getY(formatTemp(day.tempMax, unit)) : null;
                  const yMin = day.tempMin != null ? getY(formatTemp(day.tempMin, unit)) : null;
                  const isHovered = hoveredDay?.date === day.date;

                  return (
                    <g
                      key={day.date}
                      className="cursor-pointer transition-transform"
                      onMouseEnter={() => setHoveredDay(day)}
                      onMouseLeave={() => setHoveredDay(null)}
                    >
                      {/* Vertical line indicator on hover */}
                      {isHovered && (
                        <line
                          x1={x}
                          y1={paddingY}
                          x2={x}
                          y2={svgHeight - paddingY}
                          stroke="#6366f1"
                          strokeWidth="1.5"
                          strokeDasharray="3 3"
                        />
                      )}

                      {/* Max circle */}
                      {yMax != null && (
                        <circle
                          cx={x}
                          cy={yMax}
                          r={isHovered ? 6 : 4}
                          fill="#f43f5e"
                          stroke="#fff"
                          strokeWidth="2"
                          className="transition-all"
                        />
                      )}

                      {/* Min circle */}
                      {yMin != null && (
                        <circle
                          cx={x}
                          cy={yMin}
                          r={isHovered ? 6 : 4}
                          fill="#0284c7"
                          stroke="#fff"
                          strokeWidth="2"
                          className="transition-all"
                        />
                      )}

                      {/* Bottom Date Label (sparse if many days) */}
                      {(days.length <= 14 || idx % Math.ceil(days.length / 10) === 0 || idx === days.length - 1) && (
                        <text
                          x={x}
                          y={svgHeight - 8}
                          textAnchor="middle"
                          className="text-[10px] fill-slate-500 font-medium"
                        >
                          {day.date.slice(5)}
                        </text>
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Hover details badge */}
            <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl flex items-center justify-between text-xs">
              {hoveredDay ? (
                <div className="flex items-center gap-4 flex-wrap">
                  <span className="font-semibold text-slate-700 dark:text-slate-200">
                    {formatDayDate(hoveredDay.date).dayName}, {formatDayDate(hoveredDay.date).dateLabel}
                  </span>
                  <span className="text-rose-600 dark:text-rose-400 font-medium">
                    Max: {formatTempString(hoveredDay.tempMax, unit)}
                  </span>
                  <span className="text-sky-600 dark:text-sky-400 font-medium">
                    Min: {formatTempString(hoveredDay.tempMin, unit)}
                  </span>
                  <span className="text-blue-600 dark:text-blue-400 font-medium">
                    Rain: {hoveredDay.precipitation} mm
                  </span>
                  <span className="text-slate-600 dark:text-slate-300">
                    {getConditionFromCode(hoveredDay.weatherCode, true)}
                  </span>
                </div>
              ) : (
                <span className="text-slate-400 italic">
                  Hover over any data point on the chart to inspect daily temperature and rainfall figures.
                </span>
              )}
            </div>
          </div>

          {/* Precipitation Histogram Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-base text-slate-800 dark:text-slate-100 flex items-center gap-2">
                  <Droplets size={18} className="text-blue-500" />
                  Daily Precipitation Histogram
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Observed rainfall per day (mm)
                </p>
              </div>
              <div className="text-xs font-semibold text-slate-500">
                Peak: {Math.max(...days.map(d => d.precipitation || 0))} mm
              </div>
            </div>

            <div className="h-32 flex items-end gap-1 sm:gap-2 pt-6">
              {days.map((day) => {
                const heightPct = maxPrecip > 0 ? ((day.precipitation || 0) / maxPrecip) * 100 : 0;
                const hasRain = day.precipitation > 0;
                return (
                  <div
                    key={day.date}
                    className="flex-1 flex flex-col items-center group relative h-full justify-end"
                  >
                    {/* Tooltip on hover */}
                    <div className="absolute -top-7 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-[10px] px-1.5 py-0.5 rounded pointer-events-none whitespace-nowrap z-10">
                      {day.precipitation} mm
                    </div>
                    <div
                      style={{ height: `${Math.max(heightPct, 4)}%` }}
                      className={`w-full rounded-t transition-all ${
                        hasRain
                          ? 'bg-blue-500 hover:bg-blue-400 group-hover:brightness-110'
                          : 'bg-slate-100 dark:bg-slate-800'
                      }`}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Historical Daily Log Table */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-slate-800 dark:text-slate-100">
                  Daily Observation Records
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Comprehensive meteorological log ({days.length} entries)
                </p>
              </div>
            </div>

            <div className="overflow-x-auto max-h-96">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Condition</th>
                    <th className="py-3 px-4 text-rose-500">Max Temp</th>
                    <th className="py-3 px-4 text-sky-500">Min Temp</th>
                    <th className="py-3 px-4">Mean</th>
                    <th className="py-3 px-4 text-blue-500">Precipitation</th>
                    <th className="py-3 px-4 text-teal-500">Peak Wind</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                  {days.slice().reverse().map((day) => {
                    const { dayName, dateLabel } = formatDayDate(day.date);
                    const condText = getConditionFromCode(day.weatherCode, true);
                    return (
                      <tr
                        key={day.date}
                        className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                      >
                        <td className="py-3 px-4 whitespace-nowrap text-slate-800 dark:text-slate-200 font-semibold">
                          {dayName}, {dateLabel}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <WeatherIcon condition={condText} size={18} />
                            <span className="text-slate-700 dark:text-slate-300">{condText}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap font-bold text-rose-600 dark:text-rose-400">
                          {formatTempString(day.tempMax, unit)}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap font-bold text-sky-600 dark:text-sky-400">
                          {formatTempString(day.tempMin, unit)}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap text-slate-600 dark:text-slate-400">
                          {formatTempString(day.tempMean, unit)}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap text-blue-600 dark:text-blue-400">
                          {day.precipitation} mm
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap text-teal-600 dark:text-teal-400">
                          {formatWindSpeed(day.windMax, unit)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
