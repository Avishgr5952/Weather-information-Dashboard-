import React from 'react';

export default function LoadingState() {
  return (
    <div className="space-y-6 animate-pulse select-none">
      {/* Alert placeholder shimmer */}
      <div className="h-16 bg-slate-200 dark:bg-slate-800 rounded-2xl w-full" />

      {/* Main Grid: Current Weather & Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current Weather Card Skeleton */}
        <div className="lg:col-span-2 h-64 bg-slate-200 dark:bg-slate-800 rounded-3xl p-8 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="h-5 w-40 bg-slate-300 dark:bg-slate-700 rounded-full" />
            <div className="h-4 w-28 bg-slate-300 dark:bg-slate-700 rounded-full" />
          </div>
          <div className="flex items-end justify-between">
            <div className="h-20 w-44 bg-slate-300 dark:bg-slate-700 rounded-2xl" />
            <div className="w-20 h-20 bg-slate-300 dark:bg-slate-700 rounded-2xl" />
          </div>
        </div>

        {/* Air Quality / Summary Skeleton */}
        <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-3xl p-6 flex flex-col justify-between">
          <div className="h-5 w-32 bg-slate-300 dark:bg-slate-700 rounded-full" />
          <div className="h-16 w-28 bg-slate-300 dark:bg-slate-700 rounded-xl" />
          <div className="space-y-2">
            <div className="h-3 w-full bg-slate-300 dark:bg-slate-700 rounded-full" />
            <div className="h-3 w-3/4 bg-slate-300 dark:bg-slate-700 rounded-full" />
          </div>
        </div>
      </div>

      {/* Hourly Forecast Carousel Skeleton */}
      <div className="h-44 bg-slate-200 dark:bg-slate-800 rounded-3xl p-6">
        <div className="h-4 w-36 bg-slate-300 dark:bg-slate-700 rounded-full mb-4" />
        <div className="flex gap-3 overflow-hidden">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="w-20 h-24 bg-slate-300 dark:bg-slate-700/60 rounded-2xl flex-shrink-0" />
          ))}
        </div>
      </div>

      {/* Highlights Grid Skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4, 5, 6, 7].map((i) => (
          <div key={i} className="h-28 bg-slate-200 dark:bg-slate-800 rounded-2xl p-4 flex flex-col justify-between">
            <div className="h-4 w-20 bg-slate-300 dark:bg-slate-700 rounded-full" />
            <div className="h-7 w-24 bg-slate-300 dark:bg-slate-700 rounded-lg" />
          </div>
        ))}
      </div>

      {/* 2-Column bottom: Chart & 7-Day Forecast */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-80 bg-slate-200 dark:bg-slate-800 rounded-3xl p-6">
          <div className="h-5 w-48 bg-slate-300 dark:bg-slate-700 rounded-full mb-6" />
          <div className="h-52 bg-slate-300 dark:bg-slate-700/40 rounded-2xl" />
        </div>
        <div className="h-80 bg-slate-200 dark:bg-slate-800 rounded-3xl p-6">
          <div className="h-5 w-40 bg-slate-300 dark:bg-slate-700 rounded-full mb-6" />
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-8 bg-slate-300 dark:bg-slate-700/50 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
