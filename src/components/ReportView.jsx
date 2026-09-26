import React, { useState } from 'react';
import { useWeather } from '../context/WeatherContext';
import { generateWeatherReportPDF } from '../services/reportService';
import { formatTemp, formatTempString, formatWindSpeed } from '../utils/formatters.js';
import {
  FileText,
  Download,
  CheckCircle,
  FileCheck,
  Calendar,
  Clock,
  ShieldAlert,
  Sparkles,
  Sliders,
  AlertCircle,
  Printer,
  Loader2,
  RefreshCw
} from 'lucide-react';

/**
 * Robust Error Boundary to guarantee the Reports page NEVER crashes to a blank screen
 */
class ReportErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ReportView render error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-rose-200 dark:border-rose-900/50 text-center max-w-xl mx-auto shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 mx-auto flex items-center justify-center mb-4">
            <AlertCircle size={24} />
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
            Report Preview Error
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            An unexpected error occurred while preparing the report preview: {this.state.error?.message || 'Rendering error'}
          </p>
          <button
            type="button"
            onClick={() => this.setState({ hasError: false, error: null })}
            className="mt-5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold inline-flex items-center gap-2 transition-all shadow-sm cursor-pointer"
          >
            <RefreshCw size={14} />
            <span>Reload Report View</span>
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function ReportViewContent() {
  const { weatherData, unit, loading } = useWeather();

  const [includeForecast, setIncludeForecast] = useState(true);
  const [includeHourly, setIncludeHourly] = useState(true);
  const [includeAirQuality, setIncludeAirQuality] = useState(true);
  const [includeRecommendations, setIncludeRecommendations] = useState(true);

  const [downloading, setDownloading] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 border border-slate-200 dark:border-slate-800 text-center shadow-xs">
        <Loader2 className="w-8 h-8 mx-auto text-blue-600 animate-spin mb-3" />
        <p className="text-slate-700 dark:text-slate-300 font-semibold text-sm">
          Compiling meteorological data for report...
        </p>
        <p className="text-xs text-slate-400 mt-1">Please wait a moment.</p>
      </div>
    );
  }

  if (!weatherData) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 text-center shadow-xs">
        <FileText className="w-12 h-12 mx-auto text-slate-400 mb-3" />
        <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200">No Location Loaded</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Search for a location first to compile a meteorological PDF report.
        </p>
      </div>
    );
  }

  const city = weatherData?.location?.city || weatherData?.city || 'Selected Location';
  const country = weatherData?.location?.country || weatherData?.country || '';
  const current = weatherData?.current || {};
  const forecastList = weatherData?.daily || weatherData?.weekly || [];
  const coordsLat = weatherData?.coordinates?.lat ?? weatherData?.location?.latitude ?? 0;
  const coordsLon = weatherData?.coordinates?.lon ?? weatherData?.location?.longitude ?? 0;

  const handleDownloadPDF = () => {
    try {
      setDownloading(true);
      setErrorMsg(null);
      setSuccessMsg(null);

      const res = generateWeatherReportPDF(weatherData, unit, {
        includeForecast,
        includeHourly,
        includeAirQuality,
        includeRecommendations
      });

      setSuccessMsg(`Report successfully downloaded as "${res.filename}"!`);
      setTimeout(() => setSuccessMsg(null), 6000);
    } catch (err) {
      console.error('Error generating PDF report:', err);
      setErrorMsg(err.message || 'Failed to compile PDF report.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="p-2.5 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 rounded-2xl">
              <FileText size={24} />
            </span>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100">
                Official Meteorological Report Generator
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Generate and export publication-ready PDF documentation for <span className="font-semibold text-slate-700 dark:text-slate-200">{city}, {country}</span>
              </p>
            </div>
          </div>

          {/* Download Action Button */}
          <button
            type="button"
            onClick={handleDownloadPDF}
            disabled={downloading}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            {downloading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Generating PDF...
              </>
            ) : (
              <>
                <Download size={16} />
                Download PDF Report
              </>
            )}
          </button>
        </div>

        {/* Feedback alerts */}
        {successMsg && (
          <div className="mt-4 p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
            <CheckCircle size={16} className="text-emerald-600 flex-shrink-0" />
            {successMsg}
          </div>
        )}

        {errorMsg && (
          <div className="mt-4 p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl text-rose-800 dark:text-rose-300 text-xs font-semibold flex items-center gap-2">
            <AlertCircle size={16} className="text-rose-600 flex-shrink-0" />
            {errorMsg}
          </div>
        )}
      </div>

      {/* Grid: Customizer Options & Document Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Report Customization Panel */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <Sliders size={18} className="text-indigo-500" />
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">
              Customize Report Sections
            </h3>
          </div>

          <div className="space-y-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={includeForecast}
                onChange={(e) => setIncludeForecast(e.target.checked)}
                className="mt-1 w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
              />
              <div>
                <span className="font-semibold text-xs text-slate-800 dark:text-slate-200 block">
                  7-Day Synoptic Forecast Table
                </span>
                <span className="text-[11px] text-slate-500 block">
                  Detailed day-by-day table including highs, lows, precipitation probabilities, and UV values.
                </span>
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={includeHourly}
                onChange={(e) => setIncludeHourly(e.target.checked)}
                className="mt-1 w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
              />
              <div>
                <span className="font-semibold text-xs text-slate-800 dark:text-slate-200 block">
                  12-Hour Chronological Breakdown
                </span>
                <span className="text-[11px] text-slate-500 block">
                  Hourly progression with temperature, feels-like, wind speed, and rain likelihood.
                </span>
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={includeAirQuality}
                onChange={(e) => setIncludeAirQuality(e.target.checked)}
                className="mt-1 w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
              />
              <div>
                <span className="font-semibold text-xs text-slate-800 dark:text-slate-200 block">
                  Air Quality & Particulate Analysis
                </span>
                <span className="text-[11px] text-slate-500 block">
                  AQI index and PM2.5, PM10, NO2, O3 concentrations evaluated against WHO thresholds.
                </span>
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={includeRecommendations}
                onChange={(e) => setIncludeRecommendations(e.target.checked)}
                className="mt-1 w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
              />
              <div>
                <span className="font-semibold text-xs text-slate-800 dark:text-slate-200 block">
                  AI Lifestyle & Health Recommendations
                </span>
                <span className="text-[11px] text-slate-500 block">
                  Expert advice for clothing, rain gear, UV protection, hydration, workouts, and travel.
                </span>
              </div>
            </label>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="text-[11px] text-slate-400 space-y-1">
              <div>• Format: Standard A4 Portrait PDF</div>
              <div>• Engine: jsPDF + autoTable (100% Client-Side)</div>
              <div>• Academic Project Verification Ready</div>
            </div>
          </div>
        </div>

        {/* Right: Live Interactive Report Document Mockup */}
        <div className="lg:col-span-2 bg-slate-100 dark:bg-slate-950/60 p-4 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 flex justify-center">
          <div className="w-full max-w-xl bg-white text-slate-900 shadow-xl rounded-lg p-6 sm:p-8 font-sans border border-slate-300 space-y-5 text-xs">
            {/* Mock Header */}
            <div className="border-b-2 border-blue-900 pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-base font-extrabold text-blue-900 tracking-tight">
                    WEATHER INFORMATION DASHBOARD
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Meteorological Executive Briefing • BCA Final-Year Project
                  </p>
                </div>
                <div className="text-right text-[10px] text-slate-400 font-mono">
                  {new Date().toISOString().split('T')[0]}
                </div>
              </div>
            </div>

            {/* Mock Location */}
            <div>
              <div className="text-lg font-bold text-slate-900">{city}, {country}</div>
              <div className="text-[11px] text-slate-500 font-mono">
                Lat: {coordsLat}°, Lon: {coordsLon}°
              </div>
            </div>

            {/* Mock Key Metrics */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 bg-slate-50 p-3 rounded-lg border border-slate-200">
              <div>
                <div className="text-[9px] text-slate-400 uppercase">Temp</div>
                <div className="font-bold text-slate-800 text-xs">{formatTempString(current.temp, unit)}</div>
              </div>
              <div>
                <div className="text-[9px] text-slate-400 uppercase">Feels</div>
                <div className="font-bold text-slate-800 text-xs">{formatTempString(current.feelsLike, unit)}</div>
              </div>
              <div>
                <div className="text-[9px] text-slate-400 uppercase">Sky</div>
                <div className="font-bold text-slate-800 text-xs truncate">{current.condition || 'Fair'}</div>
              </div>
              <div>
                <div className="text-[9px] text-slate-400 uppercase">Humidity</div>
                <div className="font-bold text-slate-800 text-xs">{current.humidity ?? '--'}%</div>
              </div>
              <div>
                <div className="text-[9px] text-slate-400 uppercase">Wind</div>
                <div className="font-bold text-slate-800 text-xs">{formatWindSpeed(current.windSpeed, unit)}</div>
              </div>
              <div>
                <div className="text-[9px] text-slate-400 uppercase">AQI</div>
                <div className="font-bold text-emerald-700 text-xs">{weatherData.airQuality?.value ?? weatherData.airQuality?.aqi ?? '--'}</div>
              </div>
            </div>

            {/* Forecast Preview Snippet */}
            {includeForecast && (
              <div className="space-y-1.5">
                <div className="font-bold text-blue-900 text-xs">7-Day Synoptic Forecast</div>
                <div className="bg-slate-50 border border-slate-200 rounded p-2 text-[10px] text-slate-600">
                  <div className="grid grid-cols-4 font-semibold text-slate-700 pb-1 border-b border-slate-200">
                    <span>Day</span>
                    <span>Condition</span>
                    <span>High / Low</span>
                    <span>Rain %</span>
                  </div>
                  {forecastList.slice(0, 4).map((d) => (
                    <div key={d.dateLabel || d.dayName} className="grid grid-cols-4 py-0.5">
                      <span>{d.dayName}</span>
                      <span className="truncate">{d.condition}</span>
                      <span>{formatTemp(d.tempMax ?? d.high, unit)}° / {formatTemp(d.tempMin ?? d.low, unit)}°</span>
                      <span>{d.pop ?? d.rainProb ?? 0}%</span>
                    </div>
                  ))}
                  <div className="text-center text-[9px] text-slate-400 italic pt-1">
                    + 3 additional days included in full PDF
                  </div>
                </div>
              </div>
            )}

            {/* Recommendations Preview Snippet */}
            {includeRecommendations && (
              <div className="space-y-1.5">
                <div className="font-bold text-blue-900 text-xs">Lifestyle & Health Advisory (Page 2)</div>
                <div className="bg-blue-50/60 border border-blue-200 rounded p-2 text-[10px] text-blue-950 space-y-1">
                  <div>• <b>Wardrobe:</b> Weather-appropriate attire recommended based on current temperatures.</div>
                  <div>• <b>Precipitation Protection:</b> Rain gear advisories coordinated with precipitation risk.</div>
                  <div>• <b>UV Sun Defense & Workouts:</b> Safe exercise timeframes and sun exposure limits.</div>
                </div>
              </div>
            )}

            {/* Mock Footer */}
            <div className="pt-3 border-t border-slate-200 text-center text-[9px] text-slate-400 flex items-center justify-between">
              <span>Weather Information Dashboard • Final-Year Project</span>
              <span>Page 1 of 2</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ReportView() {
  return (
    <ReportErrorBoundary>
      <ReportViewContent />
    </ReportErrorBoundary>
  );
}
