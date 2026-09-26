import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatTempString, formatWindSpeed } from '../utils/formatters.js';
import { generateWeatherRecommendations } from './recommendationService.js';

/**
 * Generates and downloads a publication-grade PDF Weather Report
 * using jsPDF and jspdf-autotable.
 * 
 * @param {Object} weatherData - Complete weather dataset from WeatherContext
 * @param {'C' | 'F'} unit - Temperature unit
 * @param {Object} options - Configuration toggles
 */
export function generateWeatherReportPDF(weatherData, unit = 'C', options = {}) {
  if (!weatherData) {
    throw new Error('Weather data is required to generate report.');
  }

  const {
    includeForecast = true,
    includeHourly = true,
    includeAirQuality = true,
    includeRecommendations = true
  } = options;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const city = weatherData.city || weatherData.location?.city || 'Location';
  const country = weatherData.country || weatherData.location?.country || '';
  const lat = weatherData.coordinates?.lat ?? weatherData.location?.latitude ?? 0;
  const lon = weatherData.coordinates?.lon ?? weatherData.location?.longitude ?? 0;
  const current = weatherData.current || {};
  const airQuality = weatherData.airQuality || {};
  const daily = weatherData.daily || [];
  const hourly = (weatherData.hourly || []).slice(0, 12); // First 12 hours for crisp table

  const generatedDate = new Date().toLocaleString('en-US', {
    dateStyle: 'full',
    timeStyle: 'short'
  });

  // Color Palette Constants
  const PRIMARY = [30, 58, 138];    // #1e3a8a deep indigo/blue
  const ACCENT = [14, 165, 233];    // #0ea5e9 sky blue
  const DARK = [15, 23, 42];        // #0f172a slate 900
  const TEXT_MUTED = [100, 116, 139];// #64748b slate 500
  const BG_LIGHT = [248, 250, 252]; // #f8fafc slate 50

  // 1. TOP HEADER BANNER
  doc.setFillColor(...PRIMARY);
  doc.rect(0, 0, 210, 32, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('WEATHER INFORMATION DASHBOARD', 14, 13);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(224, 242, 254);
  doc.text('Comprehensive Meteorological Executive Briefing • BCA Final-Year Project', 14, 20);

  doc.setFontSize(8);
  doc.setTextColor(186, 230, 253);
  doc.text(`Generated on: ${generatedDate} | Provider: Open-Meteo WMO Live Service`, 14, 26);

  // 2. LOCATION & OBSERVED CONDITIONS SUMMARY
  let currentY = 42;

  doc.setTextColor(...DARK);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text(`${city}, ${country}`, 14, currentY);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...TEXT_MUTED);
  doc.text(`Geographic Coordinates: ${Number(lat).toFixed(4)}°N, ${Number(lon).toFixed(4)}°E`, 14, currentY + 5);

  currentY += 14;

  // Key Metrics Grid Box
  doc.setFillColor(...BG_LIGHT);
  doc.roundedRect(14, currentY, 182, 30, 2, 2, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(14, currentY, 182, 30, 2, 2, 'D');

  const metrics = [
    { label: 'Current Temp', val: formatTempString(current.temp, unit) },
    { label: 'Feels Like', val: formatTempString(current.feelsLike, unit) },
    { label: 'Condition', val: current.condition || 'Fair' },
    { label: 'Humidity', val: `${current.humidity ?? '--'}%` },
    { label: 'Wind Speed', val: formatWindSpeed(current.windSpeed, unit) },
    { label: 'Air Pressure', val: `${current.pressure ?? '--'} hPa` }
  ];

  const colWidth = 182 / 6;
  metrics.forEach((m, idx) => {
    const xPos = 14 + idx * colWidth + 4;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...TEXT_MUTED);
    doc.text(m.label, xPos, currentY + 10);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(...DARK);
    doc.text(String(m.val), xPos, currentY + 20);
  });

  currentY += 38;

  // 3. AIR QUALITY OVERVIEW
  if (includeAirQuality && airQuality.value != null) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(...PRIMARY);
    doc.text('Air Quality & Atmospheric Composition', 14, currentY);
    currentY += 4;

    const aqiTableData = [
      ['US AQI Index', `${airQuality.value} (${airQuality.status || 'Moderate'})`, 'Overall atmospheric health indicator'],
      ['Fine Dust (PM2.5)', `${airQuality.pm25 ?? '--'} µg/m³`, 'WHO 24h Threshold: 15 µg/m³'],
      ['Coarse Dust (PM10)', `${airQuality.pm10 ?? '--'} µg/m³`, 'WHO 24h Threshold: 45 µg/m³'],
      ['Nitrogen Dioxide (NO₂)', `${airQuality.nitrogenDioxide ?? '--'} µg/m³`, 'Vehicle exhaust indicator'],
      ['Ground Ozone (O₃)', `${airQuality.ozone ?? '--'} µg/m³`, 'Solar chemical emission index']
    ];

    autoTable(doc, {
      startY: currentY,
      head: [['Metric / Pollutant', 'Current Level', 'Context / Reference']],
      body: aqiTableData,
      theme: 'grid',
      headStyles: { fillColor: PRIMARY, textColor: 255, fontSize: 8, fontStyle: 'bold' },
      bodyStyles: { fontSize: 8, textColor: DARK },
      styles: { cellPadding: 2.2 },
      margin: { left: 14, right: 14 }
    });

    currentY = doc.lastAutoTable.finalY + 10;
  }

  // 4. 7-DAY FORECAST TABLE
  if (includeForecast && daily.length > 0) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(...PRIMARY);
    doc.text('7-Day Synoptic Weather Forecast', 14, currentY);
    currentY += 4;

    const forecastData = daily.map(d => [
      `${d.dayName}, ${d.dateLabel}`,
      d.condition || 'Fair',
      formatTempString(d.tempMax, unit),
      formatTempString(d.tempMin, unit),
      `${d.pop ?? 0}%`,
      d.uvIndexMax != null ? `${d.uvIndexMax.toFixed(1)}` : '--'
    ]);

    autoTable(doc, {
      startY: currentY,
      head: [['Day & Date', 'Expected Condition', 'Day High', 'Night Low', 'Rain Prob.', 'Peak UV']],
      body: forecastData,
      theme: 'striped',
      headStyles: { fillColor: PRIMARY, textColor: 255, fontSize: 8, fontStyle: 'bold' },
      bodyStyles: { fontSize: 8, textColor: DARK },
      styles: { cellPadding: 2 },
      margin: { left: 14, right: 14 }
    });

    currentY = doc.lastAutoTable.finalY + 10;
  }

  // 5. CHECK PAGE BREAK OR ADD PAGE 2 FOR HOURLY & AI RECOMMENDATIONS
  if (includeHourly || includeRecommendations) {
    doc.addPage();
    let p2Y = 20;

    // Header banner on Page 2
    doc.setFillColor(...PRIMARY);
    doc.rect(0, 0, 210, 14, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text(`WEATHER INFORMATION DASHBOARD — ${city.toUpperCase()} DETAILED BRIEFING (PAGE 2)`, 14, 9);

    // Hourly Forecast Table
    if (includeHourly && hourly.length > 0) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(...PRIMARY);
      doc.text('Next 12-Hour Hourly Trend', 14, p2Y);
      p2Y += 4;

      const hourlyData = hourly.map(h => [
        h.time || '--',
        formatTempString(h.temp, unit),
        formatTempString(h.feelsLike, unit),
        h.condition || 'Fair',
        `${h.rainChance ?? h.precipitationProbability ?? 0}%`,
        formatWindSpeed(h.windSpeed, unit),
        `${h.humidity ?? '--'}%`
      ]);

      autoTable(doc, {
        startY: p2Y,
        head: [['Time', 'Temp', 'Feels Like', 'Condition', 'Rain Chance', 'Wind', 'Humidity']],
        body: hourlyData,
        theme: 'striped',
        headStyles: { fillColor: [40, 80, 160], textColor: 255, fontSize: 8, fontStyle: 'bold' },
        bodyStyles: { fontSize: 7.5, textColor: DARK },
        styles: { cellPadding: 1.8 },
        margin: { left: 14, right: 14 }
      });

      p2Y = doc.lastAutoTable.finalY + 10;
    }

    // AI Weather Recommendations
    if (includeRecommendations) {
      const recs = generateWeatherRecommendations(weatherData);
      if (recs) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.setTextColor(...PRIMARY);
        doc.text('AI Meteorological Health & Lifestyle Advisory', 14, p2Y);
        p2Y += 5;

        const advisoryItems = [
          ['Wardrobe & Clothing', `${recs.clothing.title} (${recs.clothing.badge})`, recs.clothing.description],
          ['Umbrella & Precipitation', recs.rainAdvice.title, recs.rainAdvice.description],
          ['UV & Solar Safety', recs.uvAdvice.level, recs.uvAdvice.description],
          ['Hydration Goal', `Target: ${recs.hydrationAdvice.target}`, recs.hydrationAdvice.tips],
          ['Outdoor Workout', recs.fitnessAdvice.status, `${recs.fitnessAdvice.bestTime} - ${recs.fitnessAdvice.description}`],
          ['Commute & Travel', recs.travelAdvice.status, recs.travelAdvice.description]
        ];

        autoTable(doc, {
          startY: p2Y,
          head: [['Advisory Category', 'Assessment', 'Recommended Action']],
          body: advisoryItems,
          theme: 'grid',
          headStyles: { fillColor: [50, 70, 120], textColor: 255, fontSize: 8, fontStyle: 'bold' },
          bodyStyles: { fontSize: 7.5, textColor: DARK },
          styles: { cellPadding: 2 },
          columnStyles: {
            0: { cellWidth: 40, fontStyle: 'bold' },
            1: { cellWidth: 45 },
            2: { cellWidth: 97 }
          },
          margin: { left: 14, right: 14 }
        });
      }
    }
  }

  // 6. ADD FOOTER PAGE NUMBERS
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...TEXT_MUTED);
    doc.text(
      `Weather Information Dashboard • Final-Year Project • Page ${i} of ${totalPages}`,
      105,
      290,
      { align: 'center' }
    );
  }

  // 7. SAVE & DOWNLOAD FILE
  const sanitizedCity = city.replace(/[^a-zA-Z0-9_-]/g, '_');
  const dateStr = new Date().toISOString().split('T')[0];
  const filename = `Weather_Report_${sanitizedCity}_${dateStr}.pdf`;
  doc.save(filename);

  return { success: true, filename };
}
