import React from 'react';
import { WeatherProvider, useWeather } from './context/WeatherContext';
import Header from './components/Header';
import NavigationTabs from './components/NavigationTabs';
import WeatherDashboard from './components/WeatherDashboard';
import FavoritesView from './components/FavoritesView';
import CityComparison from './components/CityComparison';
import HistoricalWeather from './components/HistoricalWeather';
import WeatherMap from './components/WeatherMap';
import WeatherAnalytics from './components/WeatherAnalytics';
import AIRecommendations from './components/AIRecommendations';
import ReportView from './components/ReportView';
import { Cloud, Code2 } from 'lucide-react';

function MainContent() {
  const { activeTab } = useWeather();

  switch (activeTab) {
    case 'favorites':
      return <FavoritesView />;
    case 'compare':
      return <CityComparison />;
    case 'history':
      return <HistoricalWeather />;
    case 'map':
      return <WeatherMap />;
    case 'analytics':
      return <WeatherAnalytics />;
    case 'recommendations':
      return <AIRecommendations />;
    case 'reports':
      return <ReportView />;
    case 'overview':
    default:
      return <WeatherDashboard />;
  }
}

export default function App() {
  return (
    <WeatherProvider>
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-200">
        {/* Global App Header */}
        <Header />

        {/* Feature Navigation Tabs */}
        <NavigationTabs />

        {/* Dynamic Main Content Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <MainContent />
        </main>

        {/* Professional Project Footer */}
        <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm py-6 transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <Cloud size={16} className="text-sky-500" />
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                Weather Information Dashboard
              </span>
              <span>• BCA Final-Year Project</span>
            </div>

            <div className="flex items-center gap-4">
              <span className="inline-flex items-center gap-1">
                <Code2 size={14} className="text-indigo-500" /> Built with React 18, Vite 6 & Tailwind CSS
              </span>
              <span>•</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">Open-Meteo Live API</span>
            </div>
          </div>
        </footer>
      </div>
    </WeatherProvider>
  );
}
