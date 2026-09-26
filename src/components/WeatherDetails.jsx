import React from 'react';
import {
  Droplets,
  Wind,
  Compass,
  Gauge,
  Eye,
  SunMedium,
  Cloud
} from 'lucide-react';
import { useWeather } from '../context/WeatherContext';
import { formatWindSpeed, getUVInfo } from '../utils/formatters';

export default function WeatherDetails() {
  const { weatherData, unit } = useWeather();

  if (!weatherData) return null;

  const { current } = weatherData;
  const uvInfo = getUVInfo(current.uvIndex);

  const detailCards = [
    {
      id: 'humidity',
      label: 'Humidity',
      value: `${current.humidity}%`,
      subtext: current.humidity > 70 ? 'High moisture' : current.humidity < 30 ? 'Dry air' : 'Comfortable',
      icon: <Droplets size={22} className="text-sky-500" />,
      bgIcon: 'bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400'
    },
    {
      id: 'wind-speed',
      label: 'Wind Speed',
      value: formatWindSpeed(current.windSpeed, unit),
      subtext: current.windSpeed > 30 ? 'Strong wind' : current.windSpeed > 15 ? 'Moderate breeze' : 'Light breeze',
      icon: <Wind size={22} className="text-teal-500" />,
      bgIcon: 'bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400'
    },
    {
      id: 'wind-direction',
      label: 'Wind Direction',
      value: current.windDirection,
      subtext: 'Surface air current',
      icon: <Compass size={22} className="text-indigo-500" />,
      bgIcon: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400'
    },
    {
      id: 'pressure',
      label: 'Atmospheric Pressure',
      value: `${current.pressure} hPa`,
      subtext: current.pressure > 1013 ? 'High pressure' : 'Normal / Low pressure',
      icon: <Gauge size={22} className="text-blue-500" />,
      bgIcon: 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400'
    },
    {
      id: 'visibility',
      label: 'Visibility',
      value: `${current.visibility} km`,
      subtext: current.visibility >= 10 ? 'Clear line of sight' : 'Reduced visibility',
      icon: <Eye size={22} className="text-emerald-500" />,
      bgIcon: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400'
    },
    {
      id: 'uv-index',
      label: 'UV Index',
      value: current.uvIndex,
      subtext: (
        <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${uvInfo.badgeBg} ${uvInfo.badgeText}`}>
          {uvInfo.label}
        </span>
      ),
      icon: <SunMedium size={22} className="text-amber-500" />,
      bgIcon: 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400'
    },
    {
      id: 'cloud-cover',
      label: 'Cloud Cover',
      value: `${current.cloudCover}%`,
      subtext: current.cloudCover > 80 ? 'Overcast sky' : current.cloudCover > 40 ? 'Scattered clouds' : 'Clear sky',
      icon: <Cloud size={22} className="text-slate-500" />,
      bgIcon: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
    }
  ];

  return (
    <div className="space-y-3">
      <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
        <span>Weather Highlights</span>
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {detailCards.map((item) => (
          <div
            key={item.id}
            className="group rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 p-4 shadow-sm hover:shadow transition-all flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                {item.label}
              </span>
              <div className={`p-2 rounded-xl transition-transform group-hover:scale-105 ${item.bgIcon}`}>
                {item.icon}
              </div>
            </div>

            <div>
              <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                {item.value}
              </div>
              <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {item.subtext}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
