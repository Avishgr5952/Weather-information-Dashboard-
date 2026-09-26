import React from 'react';
import {
  LayoutDashboard,
  Star,
  Scale,
  CalendarClock,
  Map as MapIcon,
  BarChart3,
  Sparkles,
  FileText
} from 'lucide-react';
import { useWeather } from '../context/WeatherContext';

export default function NavigationTabs() {
  const { activeTab, setActiveTab, favorites } = useWeather();

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={16} /> },
    {
      id: 'favorites',
      label: 'Favorites',
      icon: <Star size={16} />,
      badge: favorites.length > 0 ? favorites.length : null
    },
    { id: 'compare', label: 'Compare', icon: <Scale size={16} /> },
    { id: 'history', label: 'History', icon: <CalendarClock size={16} /> },
    { id: 'map', label: 'Weather Map', icon: <MapIcon size={16} /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 size={16} /> },
    { id: 'recommendations', label: 'AI Advice', icon: <Sparkles size={16} /> },
    { id: 'reports', label: 'Reports', icon: <FileText size={16} /> }
  ];

  return (
    <div className="w-full border-b border-slate-200/80 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto py-2.5 custom-scrollbar select-none">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer flex-shrink-0 ${
                  isActive
                    ? 'bg-sky-500 text-white shadow-xs shadow-sky-500/20'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/80'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
