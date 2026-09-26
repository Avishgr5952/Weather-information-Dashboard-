async function testForecastRanges() {
  const lat = 19.0760;
  const lon = 72.8777;

  const testCases = [
    { label: 'Past 7 days via start/end', start: '2026-09-17', end: '2026-09-24' },
    { label: 'Past 14 days via start/end', start: '2026-09-10', end: '2026-09-24' },
    { label: 'Past 30 days via start/end', start: '2026-08-25', end: '2026-09-24' },
    { label: 'Past 90 days (3 mo)', start: '2026-06-25', end: '2026-09-24' },
    { label: 'Custom Aug 1-10', start: '2026-08-01', end: '2026-08-10' },
    { label: 'Custom 2025-01-01 -> 2025-01-10', start: '2025-01-01', end: '2025-01-10' },
    { label: 'Custom 2024-06-01 -> 2024-06-15', start: '2024-06-01', end: '2024-06-15' },
    { label: 'Past 7 days via past_days param', param: 'past_days=7' },
    { label: 'Past 92 days via past_days param', param: 'past_days=92' }
  ];

  for (const tc of testCases) {
    let url = '';
    if (tc.start) {
      url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&start_date=${tc.start}&end_date=${tc.end}&daily=weather_code,temperature_2m_max,temperature_2m_min,temperature_2m_mean,precipitation_sum,wind_speed_10m_max&timezone=auto`;
    } else {
      url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&${tc.param}&daily=weather_code,temperature_2m_max,temperature_2m_min,temperature_2m_mean,precipitation_sum,wind_speed_10m_max&timezone=auto`;
    }

    try {
      const res = await fetch(url);
      console.log(`\n${tc.label}: Status ${res.status} ${res.statusText}`);
      if (res.ok) {
        const d = await res.json();
        console.log(`  Dates returned: ${d.daily?.time?.length} (${d.daily?.time?.[0]} to ${d.daily?.time?.[d.daily.time.length - 1]})`);
        console.log(`  Sample Max Temps:`, d.daily?.temperature_2m_max?.slice(0, 3));
      } else {
        const err = await res.json().catch(() => ({}));
        console.log(`  Failed:`, err);
      }
    } catch (e) {
      console.log(`  Network error:`, e.message);
    }
  }
}

testForecastRanges();
