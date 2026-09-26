import React from 'react';
import {
  Sun,
  Moon,
  Cloud,
  CloudSun,
  CloudMoon,
  CloudRain,
  CloudDrizzle,
  CloudLightning,
  CloudSnow,
  CloudFog,
  Wind
} from 'lucide-react';

/**
 * Returns a styled Lucide icon based on condition string and whether it's night
 * @param {{ condition: string, isNight?: boolean, className?: string, size?: number }} props
 */
export function WeatherIcon({ condition = '', isNight = false, className = '', size = 28 }) {
  const cond = condition.toLowerCase();

  if (cond.includes('thunder') || cond.includes('storm') || cond.includes('lightning')) {
    return <CloudLightning size={size} className={`text-amber-500 dark:text-amber-400 ${className}`} />;
  }
  if (cond.includes('snow') || cond.includes('flurry') || cond.includes('sleet') || cond.includes('ice')) {
    return <CloudSnow size={size} className={`text-sky-300 dark:text-sky-200 ${className}`} />;
  }
  if (cond.includes('heavy rain') || cond.includes('downpour')) {
    return <CloudRain size={size} className={`text-blue-500 dark:text-blue-400 ${className}`} />;
  }
  if (cond.includes('rain') || cond.includes('shower') || cond.includes('drizzle')) {
    return <CloudDrizzle size={size} className={`text-cyan-500 dark:text-cyan-400 ${className}`} />;
  }
  if (cond.includes('fog') || cond.includes('mist') || cond.includes('haze') || cond.includes('smoke')) {
    return <CloudFog size={size} className={`text-slate-400 dark:text-slate-300 ${className}`} />;
  }
  if (cond.includes('wind') || cond.includes('breeze') || cond.includes('gale')) {
    return <Wind size={size} className={`text-teal-500 dark:text-teal-400 ${className}`} />;
  }
  if (cond.includes('partly') || cond.includes('scattered') || cond.includes('few clouds')) {
    return isNight ? (
      <CloudMoon size={size} className={`text-indigo-400 dark:text-indigo-300 ${className}`} />
    ) : (
      <CloudSun size={size} className={`text-amber-500 dark:text-amber-400 ${className}`} />
    );
  }
  if (cond.includes('cloud') || cond.includes('overcast')) {
    return <Cloud size={size} className={`text-slate-500 dark:text-slate-400 ${className}`} />;
  }
  if (cond.includes('clear') || cond.includes('sun')) {
    return isNight ? (
      <Moon size={size} className={`text-indigo-300 dark:text-indigo-200 ${className}`} />
    ) : (
      <Sun size={size} className={`text-amber-500 dark:text-amber-400 ${className}`} />
    );
  }

  // Default fallback
  return isNight ? (
    <Moon size={size} className={`text-indigo-300 ${className}`} />
  ) : (
    <Sun size={size} className={`text-amber-500 ${className}`} />
  );
}

export default WeatherIcon;
