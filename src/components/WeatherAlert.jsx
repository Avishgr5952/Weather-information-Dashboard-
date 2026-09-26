import React from 'react';
import { AlertTriangle, AlertCircle, X, ShieldAlert } from 'lucide-react';
import { useWeather } from '../context/WeatherContext';

export default function WeatherAlert() {
  const { weatherData, dismissedAlert, dismissAlert } = useWeather();

  if (!weatherData || !weatherData.alert || !weatherData.alert.hasAlert || dismissedAlert) {
    return null;
  }

  const { alert } = weatherData;
  const isWarning = alert.severity === 'warning';

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border p-4 sm:p-5 transition-all shadow-sm ${
        isWarning
          ? 'bg-rose-50/90 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800/80 text-rose-950 dark:text-rose-100'
          : 'bg-amber-50/90 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800/80 text-amber-950 dark:text-amber-100'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div
            className={`p-2 rounded-xl flex-shrink-0 mt-0.5 ${
              isWarning
                ? 'bg-rose-100 dark:bg-rose-900/60 text-rose-600 dark:text-rose-300'
                : 'bg-amber-100 dark:bg-amber-900/60 text-amber-600 dark:text-amber-300'
            }`}
          >
            {isWarning ? <ShieldAlert size={22} /> : <AlertTriangle size={22} />}
          </div>

          {/* Content */}
          <div className="space-y-1 pr-2">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider rounded-md ${
                  isWarning
                    ? 'bg-rose-600 text-white'
                    : 'bg-amber-600 text-white'
                }`}
              >
                {alert.severity}
              </span>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                {alert.title}
              </h3>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed pt-0.5">
              {alert.description}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-500 dark:text-slate-400 pt-1">
              <span>Issued: {alert.issued}</span>
              {alert.expires && <span>• Expires: {alert.expires}</span>}
            </div>
          </div>
        </div>

        {/* Dismiss Button */}
        <button
          type="button"
          onClick={dismissAlert}
          className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer flex-shrink-0"
          title="Dismiss alert"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
}
