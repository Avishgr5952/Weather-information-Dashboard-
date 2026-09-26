async function testSearch(term) {
  console.log(`\n=== Testing: "${term}" ===`);
  const omUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(term)}&count=20&language=en&format=json`;
  try {
    const res = await fetch(omUrl);
    console.log(`Open-Meteo HTTP status: ${res.status} ${res.statusText}`);
    const text = await res.text();
    console.log(`Open-Meteo raw body: ${text.slice(0, 150)}`);
    const data = JSON.parse(text);
    console.log(`Open-Meteo returned ${data.results?.length || 0} results:`);
    if (data.results && data.results.length > 0) {
      data.results.slice(0, 5).forEach(r => {
        console.log(` - ${r.name} (${r.admin1 || ''}, ${r.country || ''}) [lat: ${r.latitude}, lon: ${r.longitude}, feature: ${r.feature_code}]`);
      });
    }
  } catch (e) {
    console.error('Open-Meteo error:', e.message);
  }

  // Also test Nominatim
  const nomUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(term)}&format=jsonv2&addressdetails=1&limit=10`;
  try {
    const res = await fetch(nomUrl, {
      headers: {
        'User-Agent': 'WeatherInformationDashboard/1.0 (academic BCA project; contact@weatherdashboard.edu)'
      }
    });
    const data = await res.json();
    console.log(`Nominatim returned ${data?.length || 0} results:`);
    if (data && data.length > 0) {
      data.slice(0, 5).forEach(r => {
        const addr = r.address || {};
        console.log(` - ${r.display_name} [lat: ${r.lat}, lon: ${r.lon}, type: ${r.type}, class: ${r.class}]`);
      });
    }
  } catch (e) {
    console.error('Nominatim error:', e.message);
  }
}

async function run() {
  await testSearch('Kolar');
  await testSearch('Kol');
  await testSearch('Bengaluru');
  await testSearch('Bangalore');
  await testSearch('London');
}

run();
