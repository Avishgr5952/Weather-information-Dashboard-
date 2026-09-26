async function testDates() {
  const lat = 19.0760;
  const lon = 72.8777;

  const testDates = [
    { start: '2026-09-20', end: '2026-09-26', label: 'Today (Sep 26)' },
    { start: '2026-09-19', end: '2026-09-25', label: 'Yesterday (Sep 25)' },
    { start: '2026-09-18', end: '2026-09-24', label: '2 Days Ago (Sep 24)' },
    { start: '2026-09-17', end: '2026-09-23', label: '3 Days Ago (Sep 23)' },
  ];

  for (const t of testDates) {
    const url = `https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lon}&start_date=${t.start}&end_date=${t.end}&daily=weather_code,temperature_2m_max,temperature_2m_min,temperature_2m_mean,precipitation_sum,wind_speed_10m_max&timezone=auto`;
    console.log(`\nTesting ${t.label}: ${t.start} -> ${t.end}`);
    try {
      const res = await fetch(url);
      console.log(`  Status: ${res.status} ${res.statusText}`);
      const text = await res.text();
      console.log(`  Body: ${text.slice(0, 160)}`);
    } catch (e) {
      console.log(`  Error:`, e.message);
    }
  }
}

testDates();
