async function testHostnames() {
  const lat = 19.0760;
  const lon = 72.8777;
  const start = '2026-08-01';
  const end = '2026-08-10';

  const urls = [
    `https://api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lon}&start_date=${start}&end_date=${end}&daily=temperature_2m_max,temperature_2m_min&timezone=auto`,
    `https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lon}&start_date=${start}&end_date=${end}&daily=temperature_2m_max,temperature_2m_min&timezone=auto`,
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&start_date=${start}&end_date=${end}&daily=temperature_2m_max,temperature_2m_min&timezone=auto`,
  ];

  for (const u of urls) {
    console.log('\nTesting URL:', u);
    try {
      const res = await fetch(u);
      console.log('Status:', res.status, res.statusText);
      const text = await res.text();
      console.log('Body:', text.slice(0, 200));
    } catch (e) {
      console.log('Error:', e.message);
    }
  }
}

testHostnames();
