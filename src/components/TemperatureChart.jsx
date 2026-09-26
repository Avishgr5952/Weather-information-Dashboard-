import React, { useState } from 'react';
import { TrendingUp, Droplets } from 'lucide-react';
import { useWeather } from '../context/WeatherContext';
import { formatTemp, formatTime } from '../utils/formatters.js';

export default function TemperatureChart() {
  const { weatherData, unit, selectedHourIndex, selectHour } = useWeather();
  const [activePoint, setActivePoint] = useState(null);

  if (!weatherData || !weatherData.hourly) return null;

  const points = weatherData.hourly;
  if (!points || points.length === 0) return null;

  // Chart Dimensions
  const width = 640;
  const height = 180;
  const paddingX = 40;
  const paddingTop = 25;
  const paddingBottom = 35;

  const temps = points.map((p) => formatTemp(p.temp, unit));
  const minTemp = Math.min(...temps) - 1;
  const maxTemp = Math.max(...temps) + 1;
  const range = Math.max(1, maxTemp - minTemp);

  // Map data to coordinate plane
  const coords = points.map((point, i) => {
    const x = paddingX + (i / (points.length - 1)) * (width - paddingX * 2);
    const tempVal = formatTemp(point.temp, unit);
    const y = height - paddingBottom - ((tempVal - minTemp) / range) * (height - paddingTop - paddingBottom);
    return { x, y, point, tempVal, index: i };
  });

  // Generate smooth cubic bezier SVG path
  const generateSmoothPath = (pts) => {
    if (pts.length < 2) return '';
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i === 0 ? i : i - 1];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[i + 2] || p2;

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
    }
    return d;
  };

  const linePath = generateSmoothPath(coords);
  const areaPath = `${linePath} L ${coords[coords.length - 1].x} ${height - paddingBottom} L ${coords[0].x} ${height - paddingBottom} Z`;

  // Display active point details (hover takes priority, fallback to selected hour)
  const displayPoint = activePoint || coords[selectedHourIndex] || null;

  return (
    <div className="rounded-3xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 p-5 sm:p-6 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
            <TrendingUp size={18} className="text-sky-500" />
            <span>Temperature Trend</span>
          </h2>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
            24-hour diurnal temperature profile (°{unit})
          </p>
        </div>

        {/* Dynamic Tooltip Badge for Active/Selected Hour */}
        {displayPoint ? (
          <div className="flex items-center gap-2 bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 px-3 py-1 rounded-xl text-xs">
            <span className="font-semibold text-slate-700 dark:text-slate-200">
              {displayPoint.index === 0 ? 'Now' : formatTime(displayPoint.point.time)}:
            </span>
            <span className="font-bold text-sky-600 dark:text-sky-400">
              {displayPoint.tempVal}°{unit}
            </span>
            <span className="text-slate-400">|</span>
            <span className="text-slate-600 dark:text-slate-300">
              {displayPoint.point.condition}
            </span>
            <span className="text-cyan-600 dark:text-cyan-400 flex items-center gap-0.5">
              <Droplets size={11} /> {displayPoint.point.rainProb}%
            </span>
          </div>
        ) : (
          <div className="text-xs text-slate-400 dark:text-slate-500 hidden sm:block">
            Click or hover points for details
          </div>
        )}
      </div>

      {/* SVG Interactive Chart */}
      <div className="w-full overflow-x-auto custom-scrollbar">
        <div className="min-w-[500px]">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-auto overflow-visible select-none"
          >
            <defs>
              {/* Gradient fill beneath area */}
              <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.35" />
                <stop offset="85%" stopColor="#0ea5e9" stopOpacity="0.02" />
                <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0" />
              </linearGradient>

              {/* Grid stroke pattern */}
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-slate-200 dark:text-slate-800" />
              </pattern>
            </defs>

            {/* Horizontal Guide Lines */}
            <line
              x1={paddingX}
              y1={paddingTop}
              x2={width - paddingX}
              y2={paddingTop}
              stroke="currentColor"
              strokeDasharray="3 3"
              className="text-slate-200 dark:text-slate-700/60"
            />
            <line
              x1={paddingX}
              y1={height - paddingBottom}
              x2={width - paddingX}
              y2={height - paddingBottom}
              stroke="currentColor"
              className="text-slate-200 dark:text-slate-700/60"
            />

            {/* Area Fill */}
            <path d={areaPath} fill="url(#tempGradient)" />

            {/* Smooth Spline Curve Line */}
            <path
              d={linePath}
              fill="none"
              stroke="#0ea5e9"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="drop-shadow-xs"
            />

            {/* Points & Labels */}
            {coords.map((c, i) => {
              const isSelected = selectedHourIndex === i;
              const isHovered = activePoint?.point.time === c.point.time;
              const showHighlightLine = isHovered || isSelected;

              return (
                <g key={i}>
                  {/* Vertical guide for active/selected point */}
                  {showHighlightLine && (
                    <line
                      x1={c.x}
                      y1={paddingTop}
                      x2={c.x}
                      y2={height - paddingBottom}
                      stroke="#0ea5e9"
                      strokeWidth={isSelected ? 1.5 : 1}
                      strokeDasharray={isSelected ? undefined : '2 2'}
                      opacity={isSelected ? 0.8 : 0.4}
                    />
                  )}

                  {/* Temperature Value over Dot */}
                  {(points.length <= 12 || i % 2 === 0 || isHovered || isSelected) && (
                    <text
                      x={c.x}
                      y={c.y - 10}
                      textAnchor="middle"
                      className={`text-[11px] font-bold ${
                        isSelected
                          ? 'fill-sky-600 dark:fill-sky-400 font-extrabold'
                          : isHovered
                          ? 'fill-sky-600 dark:fill-sky-400'
                          : 'fill-slate-700 dark:fill-slate-200'
                      }`}
                    >
                      {c.tempVal}°
                    </text>
                  )}

                  {/* Interactive circle hotspot */}
                  <circle
                    cx={c.x}
                    cy={c.y}
                    r={isHovered ? 6 : isSelected ? 5.5 : 3.5}
                    fill={isHovered || isSelected ? '#0ea5e9' : '#ffffff'}
                    stroke="#0ea5e9"
                    strokeWidth={isHovered || isSelected ? 3 : 2}
                    className="transition-all cursor-pointer"
                    onClick={() => selectHour && selectHour(i)}
                    onMouseEnter={() => setActivePoint(c)}
                    onMouseLeave={() => setActivePoint(null)}
                  />

                  {/* Invisible larger hit area for easier mouse/touch click and hover */}
                  <circle
                    cx={c.x}
                    cy={c.y}
                    r={18}
                    fill="transparent"
                    className="cursor-pointer"
                    onClick={() => selectHour && selectHour(i)}
                    onMouseEnter={() => setActivePoint(c)}
                    onMouseLeave={() => setActivePoint(null)}
                  />

                  {/* Time label below axis */}
                  {(points.length <= 12 || i % 3 === 0 || i === points.length - 1 || isSelected) && (
                    <text
                      x={c.x}
                      y={height - 12}
                      textAnchor="middle"
                      className={`text-[10px] ${
                        isSelected
                          ? 'font-bold fill-sky-600 dark:fill-sky-400'
                          : 'font-medium fill-slate-400 dark:fill-slate-500'
                      }`}
                    >
                      {i === 0 ? 'Now' : formatTime(c.point.time)}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    </div>
  );
}
