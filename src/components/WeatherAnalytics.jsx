import React, { useMemo } from 'react';
import { useWeather } from '../context/WeatherContext';
import { computeWeatherAnalytics } from '../services/analyticsService';
import { formatTemp, formatTempString, formatWindSpeed } from '../utils/formatters';
import {
  BarChart3,
  TrendingUp,
  Droplets,
  Wind,
  Sun,
  ShieldAlert,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Info
} from 'lucide-react';

export default function WeatherAnalytics() {
  const { weatherData, unit } = useWeather();

  const analytics = useMemo(() => {
    return computeWeatherAnalytics(weatherData);
  }, [weatherData]);

  if (!weatherData || !analytics) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 text-center">
        <Activity className="w-12 h-12 mx-auto text-slate-400 mb-3" />
        <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200">No Weather Data Available</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Search for a location to generate meteorological analytics.
        </p>
      </div>
    );
  }

  const { city, country } = weatherData.location || { city: weatherData.city, country: weatherData.country };
  const { temperature, precipitation, wind, uv, airQuality } = analytics;

  return (
    <div className="space-y-6">
      {/* Analytics Header Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="p-2.5 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-2xl">
              <BarChart3 size={24} />
            </span>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100">
                Weather Analytics & Meteorological Insights
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Synthesized 7-day forecast distribution, air pollutants, and atmospheric patterns for <span className="font-semibold text-slate-700 dark:text-slate-200">{city}, {country}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-emerald-100/80 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 rounded-full text-xs font-semibold flex items-center gap-1.5">
              <Activity size={13} /> Live Model Analysis
            </span>
          </div>
        </div>
      </div>

      {/* SECTION 1: TEMPERATURE DYNAMICS */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
          <TrendingUp size={18} className="text-indigo-500" />
          Temperature Dynamics & Diurnal Range
        </h3>

        {/* Temperature KPI Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {/* Average Max */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold uppercase">Avg Daytime High</span>
              <span className="p-1 bg-rose-50 dark:bg-rose-950/50 text-rose-500 rounded-md">
                <ArrowUpRight size={13} />
              </span>
            </div>
            <div className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-2">
              {formatTempString(temperature.avgMax, unit)}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Mean 7-day peak</div>
          </div>

          {/* Average Min */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold uppercase">Avg Overnight Low</span>
              <span className="p-1 bg-sky-50 dark:bg-sky-950/50 text-sky-500 rounded-md">
                <ArrowDownRight size={13} />
              </span>
            </div>
            <div className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-2">
              {formatTempString(temperature.avgMin, unit)}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Mean 7-day trough</div>
          </div>

          {/* Diurnal Range */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold uppercase">Diurnal Swing</span>
              <span className="p-1 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-500 rounded-md">
                <Activity size={13} />
              </span>
            </div>
            <div className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-2">
              {temperature.avgDiurnalRange}°{unit}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Day-to-night spread</div>
          </div>

          {/* Extremes */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold uppercase">Forecast Peak</span>
              <span className="p-1 bg-amber-50 dark:bg-amber-950/50 text-amber-500 rounded-md">
                <Flame size={13} />
              </span>
            </div>
            <div className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-2">
              {temperature.warmestDay ? formatTempString(temperature.warmestDay.tempMax, unit) : '--'}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              {temperature.warmestDay ? `${temperature.warmestDay.dayName} (${temperature.warmestDay.dateLabel})` : 'N/A'}
            </div>
          </div>
        </div>

        {/* 7-Day Floating Range Bars */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">
            Daily High / Low Range Spread
          </h4>
          <div className="space-y-3">
            {temperature.dailyRangeList.map((day) => {
              const maxC = day.max;
              const minC = day.min;
              // Normalize relative to 0-45C scale
              const leftPct = Math.max(0, Math.min(100, ((minC - 0) / 45) * 100));
              const rightPct = Math.max(0, Math.min(100, ((maxC - 0) / 45) * 100));
              const widthPct = Math.max(rightPct - leftPct, 4);

              return (
                <div key={day.dateLabel} className="flex items-center gap-4 text-xs">
                  <div className="w-20 font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap">
                    {day.dayName} <span className="text-[10px] font-normal text-slate-400">{day.dateLabel}</span>
                  </div>

                  {/* Horizontal Bar Track */}
                  <div className="flex-1 h-6 bg-slate-100 dark:bg-slate-800 rounded-full relative overflow-hidden flex items-center">
                    <div
                      style={{
                        marginLeft: `${leftPct}%`,
                        width: `${widthPct}%`
                      }}
                      className="h-full bg-gradient-to-r from-sky-400 via-indigo-400 to-rose-400 rounded-full flex items-center justify-between px-2 text-[10px] font-bold text-white shadow-xs"
                    >
                      <span>{formatTemp(minC, unit)}°</span>
                      <span>{formatTemp(maxC, unit)}°</span>
                    </div>
                  </div>

                  {/* Spread readout */}
                  <div className="w-16 text-right font-mono text-[11px] text-slate-500">
                    Δ {day.spread}°{unit}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* SECTION 2: PRECIPITATION & RAINFALL RISK */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
          <Droplets size={18} className="text-blue-500" />
          Precipitation Probability & Rain Distribution
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Probability Summary */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase">Mean Rain Probability</span>
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-2">
                {precipitation.avgProbability}%
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Average likelihood of measurable rain across the next 7 days.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs flex justify-between">
              <span className="text-slate-600 dark:text-slate-300">
                Rain Risk Days (≥40%): <b>{precipitation.rainyDaysCount}</b>
              </span>
              <span className="text-slate-600 dark:text-slate-300">
                Clear Dry Days: <b>{precipitation.dryDaysCount}</b>
              </span>
            </div>
          </div>

          {/* 7-Day Probability Bars */}
          <div className="md:col-span-2 bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
              Daily Precipitation Likelihood (PoP %)
            </h4>
            <div className="flex items-end gap-2 sm:gap-3 h-32 pt-4">
              {weatherData.daily.map((d) => {
                const pop = d.pop ?? 0;
                return (
                  <div key={d.dateLabel} className="flex-1 flex flex-col items-center h-full justify-end group">
                    <span className="text-[10px] font-mono text-slate-400 group-hover:text-blue-500 font-bold mb-1">
                      {pop}%
                    </span>
                    <div
                      style={{ height: `${Math.max(pop, 6)}%` }}
                      className={`w-full rounded-t transition-all ${
                        pop >= 50
                          ? 'bg-blue-600'
                          : pop >= 20
                          ? 'bg-blue-400'
                          : 'bg-slate-200 dark:bg-slate-700'
                      }`}
                    />
                    <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-400 mt-1.5 whitespace-nowrap">
                      {d.dayName}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: AIR QUALITY & WHO LIMITS */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
          <ShieldAlert size={18} className="text-teal-500" />
          Air Pollutant Breakdown vs WHO Safety Guidelines
        </h3>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div className="text-xs font-bold uppercase text-slate-400">Current Air Quality Index</div>
              <div className="text-xl font-bold text-slate-800 dark:text-slate-100 mt-0.5">
                AQI {airQuality.aqiValue} • <span className="text-emerald-600 dark:text-emerald-400">{airQuality.aqiStatus}</span>
              </div>
            </div>
            {airQuality.dominantPollutant && (
              <div className="text-xs bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 px-3 py-1.5 rounded-xl border border-amber-200 dark:border-amber-900/50 font-medium">
                Primary Contributor: <b>{airQuality.dominantPollutant.name}</b> ({airQuality.dominantPollutant.value} {airQuality.dominantPollutant.unit})
              </div>
            )}
          </div>

          {/* Pollutant Table */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {airQuality.pollutants.map((p) => {
              const isExceeded = p.value > p.whoLimit;
              const pctOfLimit = Math.round((p.value / p.whoLimit) * 100);

              return (
                <div
                  key={p.name}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-sm text-slate-800 dark:text-slate-100">{p.name}</span>
                      <span className="text-[11px] text-slate-400 ml-1.5">({p.fullName})</span>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isExceeded
                          ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                          : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                      }`}
                    >
                      {isExceeded ? 'Exceeds WHO' : 'Safe'}
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between mt-2">
                    <div className="text-xl font-bold text-slate-800 dark:text-slate-100">
                      {p.value} <span className="text-xs font-normal text-slate-500">{p.unit}</span>
                    </div>
                    <div className="text-xs text-slate-500">
                      WHO Limit: {p.whoLimit} {p.unit} ({pctOfLimit}%)
                    </div>
                  </div>

                  {/* Progress meter */}
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full mt-2 overflow-hidden">
                    <div
                      style={{ width: `${Math.min(pctOfLimit, 100)}%` }}
                      className={`h-full rounded-full ${
                        isExceeded ? 'bg-rose-500' : 'bg-emerald-500'
                      }`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* SECTION 4: WIND & UV INDEX PROFILES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Wind Profile */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <span className="p-1.5 bg-teal-50 dark:bg-teal-950/50 text-teal-600 rounded-lg">
              <Wind size={16} />
            </span>
            <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">Wind Speed Dynamics</h4>
          </div>

          <div className="grid grid-cols-3 gap-2 py-2">
            <div>
              <div className="text-[11px] text-slate-400 uppercase">Peak 24h</div>
              <div className="text-lg font-bold text-slate-800 dark:text-slate-100">
                {formatWindSpeed(wind.peakSpeed, unit)}
              </div>
            </div>
            <div>
              <div className="text-[11px] text-slate-400 uppercase">Average 24h</div>
              <div className="text-lg font-bold text-slate-800 dark:text-slate-100">
                {formatWindSpeed(wind.avgSpeed, unit)}
              </div>
            </div>
            <div>
              <div className="text-[11px] text-slate-400 uppercase">Direction</div>
              <div className="text-lg font-bold text-slate-800 dark:text-slate-100 truncate">
                {wind.currentDirection}
              </div>
            </div>
          </div>
        </div>

        {/* UV Index Profile */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <span className="p-1.5 bg-amber-50 dark:bg-amber-950/50 text-amber-600 rounded-lg">
              <Sun size={16} />
            </span>
            <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">Solar & UV Radiation</h4>
          </div>

          <div className="grid grid-cols-2 gap-2 py-2">
            <div>
              <div className="text-[11px] text-slate-400 uppercase">Peak Solar UV</div>
              <div className="text-lg font-bold text-slate-800 dark:text-slate-100">
                {uv.peakUV} / 11+
              </div>
            </div>
            <div>
              <div className="text-[11px] text-slate-400 uppercase">Peak Exposure Window</div>
              <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-1">
                {uv.dangerWindow}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
