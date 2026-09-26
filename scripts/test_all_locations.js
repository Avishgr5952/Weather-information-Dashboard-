const locations = [
  'Bengaluru', 'Bangalore', 'Kolar', 'Mysuru', 'Mangalore', 'Tumakuru',
  'Davanagere', 'Hubballi', 'Dharwad', 'Belagavi', 'Kalaburagi',
  'Shivamogga', 'Ballari', 'Chikkamagaluru', 'Hassan', 'Mandya',
  'Udupi', 'Kodagu', 'Chitradurga', 'Raichur', 'Vijayapura',
  'Koppal', 'Bidar', 'Bagalkot',
  'Mumbai', 'Delhi', 'Hyderabad', 'Chennai', 'Pune', 'Kolkata',
  'Ahmedabad', 'Jaipur', 'Lucknow', 'Bhopal', 'Patna', 'Kochi',
  'Coimbatore', 'Visakhapatnam', 'Surat',
  'London', 'Tokyo', 'New York', 'Paris', 'Dubai', 'Singapore',
  'Sydney', 'Toronto', 'Los Angeles', 'Chicago', 'Berlin', 'Rome', 'Madrid',
  'Kol', 'Benga', 'Manga', 'Lond', 'Tok'
];

async function checkAll() {
  const failedOM = [];
  const failedBoth = [];

  for (const loc of locations) {
    let omSuccess = false;
    let nomSuccess = false;

    // Open-Meteo
    try {
      const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(loc)}&count=20&language=en&format=json`);
      if (res.ok) {
        const d = await res.json();
        if (d.results && d.results.length > 0) {
          omSuccess = true;
        }
      }
    } catch {}

    if (!omSuccess) {
      failedOM.push(loc);
      // Try Nominatim
      try {
        const nres = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(loc)}&format=jsonv2&addressdetails=1&limit=5`, {
          headers: {
            'User-Agent': 'WeatherInformationDashboard/1.0 (academic BCA project; contact@weatherdashboard.edu)'
          }
        });
        if (nres.ok) {
          const nd = await nres.json();
          if (nd && nd.length > 0) {
            nomSuccess = true;
          }
        }
      } catch {}

      if (!nomSuccess) {
        failedBoth.push(loc);
      }
      // Be polite to Nominatim
      await new Promise(r => setTimeout(r, 200));
    }
  }

  console.log(`Total tested: ${locations.length}`);
  console.log(`Failed in Open-Meteo (${failedOM.length}):`, failedOM);
  console.log(`Failed in Both (${failedBoth.length}):`, failedBoth);
}

checkAll();
