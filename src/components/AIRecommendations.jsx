import React, { useMemo } from 'react';
import { useWeather } from '../context/WeatherContext';
import { generateWeatherRecommendations } from '../services/recommendationService';
import { formatTempString } from '../utils/formatters';
import {
  Sparkles,
  Shirt,
  Umbrella,
  Sun,
  Droplets,
  Flame,
  Activity,
  Car,
  Clock,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  ShieldCheck,
  Compass
} from 'lucide-react';

export default function AIRecommendations() {
  const { weatherData, unit } = useWeather();

  const recs = useMemo(() => {
    return generateWeatherRecommendations(weatherData);
  }, [weatherData]);

  if (!weatherData || !recs) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 text-center">
        <Sparkles className="w-12 h-12 mx-auto text-slate-400 mb-3" />
        <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200">No Weather Data Available</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Search for a location to view AI weather recommendations.
        </p>
      </div>
    );
  }

  const { city, country } = weatherData.location || { city: weatherData.city, country: weatherData.country };
  const currentTemp = weatherData?.current?.temp ?? 25;
  const currentCond = weatherData?.current?.condition ?? 'Fair';

  return (
    <div className="space-y-6">
      {/* Top Banner Card */}
      <div className="bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-200/60 dark:border-indigo-900/40 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="p-2.5 bg-indigo-600 text-white rounded-2xl shadow-md">
              <Sparkles size={24} />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100">
                  AI Weather Lifestyle & Health Advisory
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300">
                  Expert System
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-0.5">
                Personalized daily guidance for <span className="font-semibold text-slate-800 dark:text-slate-100">{city}, {country}</span> based on real-time atmospheric conditions ({formatTempString(currentTemp, unit)}, {currentCond})
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid of 6 Expert Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* 1. Wardrobe & Clothing */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="p-2 bg-amber-50 dark:bg-amber-950/50 text-amber-600 rounded-xl">
                <Shirt size={20} />
              </span>
              <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${recs.clothing.badgeColor}`}>
                {recs.clothing.badge}
              </span>
            </div>

            <h3 className="font-bold text-base text-slate-800 dark:text-slate-100">
              {recs.clothing.title}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
              {recs.clothing.description}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Recommended Pieces
            </div>
            <div className="flex flex-wrap gap-1.5">
              {recs.clothing.items.map((it, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium"
                >
                  {it}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 2. Umbrella & Rain Protection */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="p-2 bg-blue-50 dark:bg-blue-950/50 text-blue-600 rounded-xl">
                <Umbrella size={20} />
              </span>
              <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${recs.rainAdvice.badgeColor}`}>
                {recs.rainAdvice.badge}
              </span>
            </div>

            <h3 className="font-bold text-base text-slate-800 dark:text-slate-100">
              {recs.rainAdvice.title}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
              {recs.rainAdvice.description}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
            {recs.rainAdvice.needed ? (
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                <CheckCircle size={14} /> Umbrella Recommended
              </span>
            ) : (
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <CheckCircle size={14} /> Low Precipitation Risk
              </span>
            )}
          </div>
        </div>

        {/* 3. Solar & UV Sun Safety */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="p-2 bg-amber-50 dark:bg-amber-950/50 text-amber-500 rounded-xl">
                <Sun size={20} />
              </span>
              <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${recs.uvAdvice.badgeColor}`}>
                {recs.uvAdvice.badge}
              </span>
            </div>

            <h3 className="font-bold text-base text-slate-800 dark:text-slate-100">
              {recs.uvAdvice.level}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
              {recs.uvAdvice.description}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 flex items-center justify-between">
            <span>Peak Sun Risk: 11 AM – 3 PM</span>
            <span className="font-semibold text-amber-600">SPF Defense</span>
          </div>
        </div>

        {/* 4. Hydration & Electrolytes */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="p-2 bg-cyan-50 dark:bg-cyan-950/50 text-cyan-600 rounded-xl">
                <Droplets size={20} />
              </span>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-cyan-100 text-cyan-800 dark:bg-cyan-950/60 dark:text-cyan-300">
                Target: {recs.hydrationAdvice.target}
              </span>
            </div>

            <h3 className="font-bold text-base text-slate-800 dark:text-slate-100">
              {recs.hydrationAdvice.title}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
              {recs.hydrationAdvice.tips}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-500">Fluid Goal</span>
            <span className="font-bold text-cyan-600 dark:text-cyan-400">
              {recs.hydrationAdvice.target}
            </span>
          </div>
        </div>

        {/* 5. Outdoor Fitness & Running */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="p-2 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 rounded-xl">
                <Activity size={20} />
              </span>
              <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${recs.fitnessAdvice.badgeColor}`}>
                {recs.fitnessAdvice.status}
              </span>
            </div>

            <h3 className="font-bold text-base text-slate-800 dark:text-slate-100">
              Workout & Jogging Window
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
              {recs.fitnessAdvice.description}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
            <span className="text-slate-400 font-semibold block text-[10px] uppercase">Optimal Hours</span>
            <span className="font-bold text-slate-800 dark:text-slate-200 mt-0.5 block">
              {recs.fitnessAdvice.bestTime}
            </span>
          </div>
        </div>

        {/* 6. Travel & Commute Advisory */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="p-2 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 rounded-xl">
                <Car size={20} />
              </span>
              <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${recs.travelAdvice.badgeColor}`}>
                {recs.travelAdvice.status}
              </span>
            </div>

            <h3 className="font-bold text-base text-slate-800 dark:text-slate-100">
              Commute & Road Safety
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
              {recs.travelAdvice.description}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1.5 text-xs text-slate-500">
            <ShieldCheck size={14} className="text-emerald-500" />
            <span>Real-time atmospheric transit evaluation</span>
          </div>
        </div>
      </div>

      {/* Daily Time-Block Routine Suggestion */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
        <h3 className="font-bold text-base text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
          <Clock size={18} className="text-indigo-500" />
          Optimal Day Schedule for Today
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Morning */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <div className="text-xs font-bold uppercase text-amber-500">Morning (6 AM - 11 AM)</div>
            <div className="font-semibold text-sm text-slate-800 dark:text-slate-200 mt-1">Best for Outdoor Cardio</div>
            <p className="text-xs text-slate-500 mt-1">
              Coolest temperatures and lower UV indices. Ideal for walks, jogs, and errands.
            </p>
          </div>

          {/* Midday */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <div className="text-xs font-bold uppercase text-rose-500">Afternoon (11 AM - 3 PM)</div>
            <div className="font-semibold text-sm text-slate-800 dark:text-slate-200 mt-1">Indoor Focus & Hydration</div>
            <p className="text-xs text-slate-500 mt-1">
              Peak solar UV and daily temperature high. Seek indoor shaded spaces and sip water regularly.
            </p>
          </div>

          {/* Evening */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <div className="text-xs font-bold uppercase text-indigo-500">Evening (3 PM - 7 PM)</div>
            <div className="font-semibold text-sm text-slate-800 dark:text-slate-200 mt-1">Leisure & Socializing</div>
            <p className="text-xs text-slate-500 mt-1">
              Temperature subsides with gentle breezes. Pleasant for outdoor cafes and park visits.
            </p>
          </div>

          {/* Night */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <div className="text-xs font-bold uppercase text-purple-500">Night (7 PM Onwards)</div>
            <div className="font-semibold text-sm text-slate-800 dark:text-slate-200 mt-1">Rest & Recuperation</div>
            <p className="text-xs text-slate-500 mt-1">
              Comfortable overnight cooling. Good room ventilation recommended for deep sleep.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
