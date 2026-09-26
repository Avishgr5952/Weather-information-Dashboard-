// Full Karnataka Districts DB with accurate coordinates
const KARNATAKA_DISTRICTS_DB = {
  'kolar': { name: 'Kolar', state: 'Karnataka', country: 'India', countryCode: 'IN', latitude: 13.1367, longitude: 78.1337, timezone: 'Asia/Kolkata', population: 1536401 },
  'bengaluru': { name: 'Bengaluru', state: 'Karnataka', country: 'India', countryCode: 'IN', latitude: 12.9716, longitude: 77.5946, timezone: 'Asia/Kolkata', population: 8443675 },
  'bangalore': { name: 'Bengaluru', state: 'Karnataka', country: 'India', countryCode: 'IN', latitude: 12.9716, longitude: 77.5946, timezone: 'Asia/Kolkata', population: 8443675 },
  'mysuru': { name: 'Mysuru', state: 'Karnataka', country: 'India', countryCode: 'IN', latitude: 12.2958, longitude: 76.6394, timezone: 'Asia/Kolkata', population: 920550 },
  'mysore': { name: 'Mysuru', state: 'Karnataka', country: 'India', countryCode: 'IN', latitude: 12.2958, longitude: 76.6394, timezone: 'Asia/Kolkata', population: 920550 },
  'mangalore': { name: 'Mangalore', state: 'Karnataka', country: 'India', countryCode: 'IN', latitude: 12.9141, longitude: 74.8560, timezone: 'Asia/Kolkata', population: 499487 },
  'mangaluru': { name: 'Mangalore', state: 'Karnataka', country: 'India', countryCode: 'IN', latitude: 12.9141, longitude: 74.8560, timezone: 'Asia/Kolkata', population: 499487 },
  'tumakuru': { name: 'Tumakuru', state: 'Karnataka', country: 'India', countryCode: 'IN', latitude: 13.3422, longitude: 77.1017, timezone: 'Asia/Kolkata', population: 305821 },
  'tumkur': { name: 'Tumakuru', state: 'Karnataka', country: 'India', countryCode: 'IN', latitude: 13.3422, longitude: 77.1017, timezone: 'Asia/Kolkata', population: 305821 },
  'davanagere': { name: 'Davanagere', state: 'Karnataka', country: 'India', countryCode: 'IN', latitude: 14.4644, longitude: 75.9218, timezone: 'Asia/Kolkata', population: 435128 },
  'hubballi': { name: 'Hubballi', state: 'Karnataka', country: 'India', countryCode: 'IN', latitude: 15.3647, longitude: 75.1240, timezone: 'Asia/Kolkata', population: 943788 },
  'hubli': { name: 'Hubballi', state: 'Karnataka', country: 'India', countryCode: 'IN', latitude: 15.3647, longitude: 75.1240, timezone: 'Asia/Kolkata', population: 943788 },
  'dharwad': { name: 'Dharwad', state: 'Karnataka', country: 'India', countryCode: 'IN', latitude: 15.4589, longitude: 75.0078, timezone: 'Asia/Kolkata', population: 943788 },
  'belagavi': { name: 'Belagavi', state: 'Karnataka', country: 'India', countryCode: 'IN', latitude: 15.8497, longitude: 74.4977, timezone: 'Asia/Kolkata', population: 488157 },
  'belgaum': { name: 'Belagavi', state: 'Karnataka', country: 'India', countryCode: 'IN', latitude: 15.8497, longitude: 74.4977, timezone: 'Asia/Kolkata', population: 488157 },
  'kalaburagi': { name: 'Kalaburagi', state: 'Karnataka', country: 'India', countryCode: 'IN', latitude: 17.3297, longitude: 76.8343, timezone: 'Asia/Kolkata', population: 533587 },
  'gulbarga': { name: 'Kalaburagi', state: 'Karnataka', country: 'India', countryCode: 'IN', latitude: 17.3297, longitude: 76.8343, timezone: 'Asia/Kolkata', population: 533587 },
  'shivamogga': { name: 'Shivamogga', state: 'Karnataka', country: 'India', countryCode: 'IN', latitude: 13.9299, longitude: 75.5681, timezone: 'Asia/Kolkata', population: 322650 },
  'shimoga': { name: 'Shivamogga', state: 'Karnataka', country: 'India', countryCode: 'IN', latitude: 13.9299, longitude: 75.5681, timezone: 'Asia/Kolkata', population: 322650 },
  'ballari': { name: 'Ballari', state: 'Karnataka', country: 'India', countryCode: 'IN', latitude: 15.1394, longitude: 76.9214, timezone: 'Asia/Kolkata', population: 410445 },
  'bellary': { name: 'Ballari', state: 'Karnataka', country: 'India', countryCode: 'IN', latitude: 15.1394, longitude: 76.9214, timezone: 'Asia/Kolkata', population: 410445 },
  'chikkamagaluru': { name: 'Chikkamagaluru', state: 'Karnataka', country: 'India', countryCode: 'IN', latitude: 13.3161, longitude: 75.7720, timezone: 'Asia/Kolkata', population: 118401 },
  'hassan': { name: 'Hassan', state: 'Karnataka', country: 'India', countryCode: 'IN', latitude: 13.0033, longitude: 76.1004, timezone: 'Asia/Kolkata', population: 155006 },
  'mandya': { name: 'Mandya', state: 'Karnataka', country: 'India', countryCode: 'IN', latitude: 12.5244, longitude: 76.8958, timezone: 'Asia/Kolkata', population: 137358 },
  'udupi': { name: 'Udupi', state: 'Karnataka', country: 'India', countryCode: 'IN', latitude: 13.3409, longitude: 74.7421, timezone: 'Asia/Kolkata', population: 125306 },
  'kodagu': { name: 'Kodagu', state: 'Karnataka', country: 'India', countryCode: 'IN', latitude: 12.4244, longitude: 75.7382, timezone: 'Asia/Kolkata', population: 554762 },
  'coorg': { name: 'Kodagu', state: 'Karnataka', country: 'India', countryCode: 'IN', latitude: 12.4244, longitude: 75.7382, timezone: 'Asia/Kolkata', population: 554762 },
  'chitradurga': { name: 'Chitradurga', state: 'Karnataka', country: 'India', countryCode: 'IN', latitude: 14.2251, longitude: 76.3980, timezone: 'Asia/Kolkata', population: 145806 },
  'raichur': { name: 'Raichur', state: 'Karnataka', country: 'India', countryCode: 'IN', latitude: 16.2076, longitude: 77.3463, timezone: 'Asia/Kolkata', population: 234073 },
  'vijayapura': { name: 'Vijayapura', state: 'Karnataka', country: 'India', countryCode: 'IN', latitude: 16.8302, longitude: 75.7100, timezone: 'Asia/Kolkata', population: 327427 },
  'bijapur': { name: 'Vijayapura', state: 'Karnataka', country: 'India', countryCode: 'IN', latitude: 16.8302, longitude: 75.7100, timezone: 'Asia/Kolkata', population: 327427 },
  'koppal': { name: 'Koppal', state: 'Karnataka', country: 'India', countryCode: 'IN', latitude: 15.3456, longitude: 76.1558, timezone: 'Asia/Kolkata', population: 70649 },
  'bidar': { name: 'Bidar', state: 'Karnataka', country: 'India', countryCode: 'IN', latitude: 17.9104, longitude: 77.5199, timezone: 'Asia/Kolkata', population: 216020 },
  'bagalkot': { name: 'Bagalkot', state: 'Karnataka', country: 'India', countryCode: 'IN', latitude: 16.1817, longitude: 75.6615, timezone: 'Asia/Kolkata', population: 111935 }
};

const MAJOR_GLOBAL_CITIES_DB = {
  'london': { name: 'London', state: 'England', country: 'United Kingdom', countryCode: 'GB', latitude: 51.5074, longitude: -0.1278, timezone: 'Europe/London', population: 8982000 },
  'tokyo': { name: 'Tokyo', state: 'Tokyo', country: 'Japan', countryCode: 'JP', latitude: 35.6762, longitude: 139.6503, timezone: 'Asia/Tokyo', population: 13960000 },
  'new york': { name: 'New York', state: 'New York', country: 'United States', countryCode: 'US', latitude: 40.7128, longitude: -74.0060, timezone: 'America/New_York', population: 8336817 },
  'paris': { name: 'Paris', state: 'Île-de-France', country: 'France', countryCode: 'FR', latitude: 48.8566, longitude: 2.3522, timezone: 'Europe/Paris', population: 2161000 },
  'dubai': { name: 'Dubai', state: 'Dubai', country: 'United Arab Emirates', countryCode: 'AE', latitude: 25.2048, longitude: 55.2708, timezone: 'Asia/Dubai', population: 3331420 },
  'singapore': { name: 'Singapore', state: '', country: 'Singapore', countryCode: 'SG', latitude: 1.3521, longitude: 103.8198, timezone: 'Asia/Singapore', population: 5686000 },
  'sydney': { name: 'Sydney', state: 'New South Wales', country: 'Australia', countryCode: 'AU', latitude: -33.8688, longitude: 151.2093, timezone: 'Australia/Sydney', population: 5312000 },
  'toronto': { name: 'Toronto', state: 'Ontario', country: 'Canada', countryCode: 'CA', latitude: 43.6532, longitude: -79.3832, timezone: 'America/Toronto', population: 2794356 },
  'los angeles': { name: 'Los Angeles', state: 'California', country: 'United States', countryCode: 'US', latitude: 34.0522, longitude: -118.2437, timezone: 'America/Los_Angeles', population: 3898747 },
  'chicago': { name: 'Chicago', state: 'Illinois', country: 'United States', countryCode: 'US', latitude: 41.8781, longitude: -87.6298, timezone: 'America/Chicago', population: 2746388 },
  'berlin': { name: 'Berlin', state: 'Berlin', country: 'Germany', countryCode: 'DE', latitude: 52.5200, longitude: 13.4050, timezone: 'Europe/Berlin', population: 3645000 },
  'rome': { name: 'Rome', state: 'Lazio', country: 'Italy', countryCode: 'IT', latitude: 41.9028, longitude: 12.4964, timezone: 'Europe/Rome', population: 2873000 },
  'madrid': { name: 'Madrid', state: 'Community of Madrid', country: 'Spain', countryCode: 'ES', latitude: 40.4168, longitude: -3.7038, timezone: 'Europe/Madrid', population: 3223000 },
  'mumbai': { name: 'Mumbai', state: 'Maharashtra', country: 'India', countryCode: 'IN', latitude: 19.0760, longitude: 72.8777, timezone: 'Asia/Kolkata', population: 12442373 },
  'delhi': { name: 'Delhi', state: 'Delhi', country: 'India', countryCode: 'IN', latitude: 28.6519, longitude: 77.2315, timezone: 'Asia/Kolkata', population: 16787941 },
  'hyderabad': { name: 'Hyderabad', state: 'Telangana', country: 'India', countryCode: 'IN', latitude: 17.3850, longitude: 78.4867, timezone: 'Asia/Kolkata', population: 6809970 },
  'chennai': { name: 'Chennai', state: 'Tamil Nadu', country: 'India', countryCode: 'IN', latitude: 13.0827, longitude: 80.2707, timezone: 'Asia/Kolkata', population: 7088003 },
  'pune': { name: 'Pune', state: 'Maharashtra', country: 'India', countryCode: 'IN', latitude: 18.5204, longitude: 73.8567, timezone: 'Asia/Kolkata', population: 3124458 },
  'kolkata': { name: 'Kolkata', state: 'West Bengal', country: 'India', countryCode: 'IN', latitude: 22.5726, longitude: 88.3639, timezone: 'Asia/Kolkata', population: 4496694 },
  'ahmedabad': { name: 'Ahmedabad', state: 'Gujarat', country: 'India', countryCode: 'IN', latitude: 23.0225, longitude: 72.5714, timezone: 'Asia/Kolkata', population: 5577940 },
  'jaipur': { name: 'Jaipur', state: 'Rajasthan', country: 'India', countryCode: 'IN', latitude: 26.9124, longitude: 75.7873, timezone: 'Asia/Kolkata', population: 3046163 },
  'lucknow': { name: 'Lucknow', state: 'Uttar Pradesh', country: 'India', countryCode: 'IN', latitude: 26.8467, longitude: 80.9462, timezone: 'Asia/Kolkata', population: 2817105 },
  'bhopal': { name: 'Bhopal', state: 'Madhya Pradesh', country: 'India', countryCode: 'IN', latitude: 23.2599, longitude: 77.4126, timezone: 'Asia/Kolkata', population: 1798218 },
  'patna': { name: 'Patna', state: 'Bihar', country: 'India', countryCode: 'IN', latitude: 25.5941, longitude: 85.1376, timezone: 'Asia/Kolkata', population: 1684222 },
  'kochi': { name: 'Kochi', state: 'Kerala', country: 'India', countryCode: 'IN', latitude: 9.9312, longitude: 76.2673, timezone: 'Asia/Kolkata', population: 602046 },
  'coimbatore': { name: 'Coimbatore', state: 'Tamil Nadu', country: 'India', countryCode: 'IN', latitude: 11.0168, longitude: 76.9558, timezone: 'Asia/Kolkata', population: 1050721 },
  'visakhapatnam': { name: 'Visakhapatnam', state: 'Andhra Pradesh', country: 'India', countryCode: 'IN', latitude: 17.6868, longitude: 83.2185, timezone: 'Asia/Kolkata', population: 1728128 },
  'surat': { name: 'Surat', state: 'Gujarat', country: 'India', countryCode: 'IN', latitude: 21.1702, longitude: 72.8311, timezone: 'Asia/Kolkata', population: 4467797 }
};

const LOCATION_ALIASES = {
  bangalore: 'Bengaluru',
  mysore: 'Mysuru',
  mangalore: 'Mangalore',
  mangaluru: 'Mangalore',
  davanagere: 'Davanagere',
  davangere: 'Davanagere',
  hubli: 'Hubballi',
  belgaum: 'Belagavi',
  bombay: 'Mumbai',
  calcutta: 'Kolkata',
  madras: 'Chennai',
  bellary: 'Ballari',
  shimoga: 'Shivamogga',
  tumkur: 'Tumakuru',
  gulbarga: 'Kalaburagi',
  bijapur: 'Vijayapura',
  coorg: 'Kodagu',
  baroda: 'Vadodara',
  cochin: 'Kochi',
  trivandrum: 'Thiruvananthapuram',
  poona: 'Pune',
  peking: 'Beijing',
  kyiv: 'Kiev'
};

function normalizeOpenMeteoResult(r) {
  const name = r.name || '';
  const state = r.admin1 || '';
  const district = r.admin2 || r.admin3 || '';
  const country = r.country || '';
  const countryCode = (r.country_code || '').toUpperCase();

  const parts = [name];
  if (state && state !== name) parts.push(state);
  if (country && country !== state) parts.push(country);
  const displayName = parts.join(', ');

  return {
    id: `om_${r.id || `${r.latitude}_${r.longitude}`}`,
    name,
    latitude: Number(r.latitude),
    longitude: Number(r.longitude),
    country,
    countryCode,
    state,
    district,
    timezone: r.timezone || 'auto',
    population: Number(r.population) || 0,
    displayName,
    featureCode: r.feature_code || 'PPL',
    source: 'open-meteo'
  };
}

function normalizeNominatimResult(r) {
  const addr = r.address || {};
  const name = addr.city || addr.town || addr.village || addr.suburb || addr.municipality || addr.state_district || r.name || (r.display_name ? r.display_name.split(',')[0].trim() : 'Unknown');
  const state = addr.state || addr.province || addr.region || '';
  const district = addr.state_district || addr.county || '';
  const country = addr.country || '';
  const countryCode = (addr.country_code || '').toUpperCase();

  const parts = [name];
  if (state && state !== name) parts.push(state);
  if (country && country !== state) parts.push(country);
  const displayName = parts.join(', ');

  return {
    id: `nom_${r.place_id || `${r.lat}_${r.lon}`}`,
    name,
    latitude: Number(r.lat),
    longitude: Number(r.lon),
    country,
    countryCode,
    state,
    district,
    timezone: 'auto',
    population: 0,
    displayName: displayName || r.display_name,
    featureCode: r.type || 'PPL',
    source: 'nominatim'
  };
}

async function searchLocations(query) {
  const clean = (query || '').trim();
  if (!clean || clean.length < 2) return [];
  const lower = clean.toLowerCase();

  const rawResults = [];

  // 1. Check Karnataka districts preset
  for (const [k, d] of Object.entries(KARNATAKA_DISTRICTS_DB)) {
    if (k === lower || k.startsWith(lower) || lower.startsWith(k)) {
      rawResults.push({
        id: `ka_${k}`,
        name: d.name,
        latitude: d.latitude,
        longitude: d.longitude,
        country: d.country,
        countryCode: d.countryCode,
        state: d.state,
        district: d.name,
        timezone: d.timezone,
        population: d.population,
        displayName: `${d.name}, ${d.state}, ${d.country}`,
        featureCode: 'PPLA',
        source: 'preset'
      });
    }
  }

  // 2. Check Major Global Cities DB
  for (const [k, c] of Object.entries(MAJOR_GLOBAL_CITIES_DB)) {
    if (k === lower || k.startsWith(lower) || lower.startsWith(k)) {
      rawResults.push({
        id: `major_${k}`,
        name: c.name,
        latitude: c.latitude,
        longitude: c.longitude,
        country: c.country,
        countryCode: c.countryCode,
        state: c.state,
        district: c.name,
        timezone: c.timezone,
        population: c.population,
        displayName: c.state ? `${c.name}, ${c.state}, ${c.country}` : `${c.name}, ${c.country}`,
        featureCode: 'PPLC',
        source: 'preset'
      });
    }
  }

  // 3. Query Open-Meteo as Primary
  let openMeteoCount = 0;
  const queries = [clean];
  const aliased = LOCATION_ALIASES[lower];
  if (aliased && aliased.toLowerCase() !== lower) {
    queries.push(aliased);
  }

  for (const q of queries) {
    try {
      const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=20&language=en&format=json`;
      const res = await fetch(url, { signal: AbortSignal.timeout(3500) });
      if (res.ok) {
        const data = await res.json();
        if (data.results && data.results.length > 0) {
          openMeteoCount += data.results.length;
          data.results.forEach(r => rawResults.push(normalizeOpenMeteoResult(r)));
        }
      }
    } catch (err) {
      // Open-Meteo failed
    }
  }

  // 4. Fallback to Nominatim if Open-Meteo returned 0 usable results
  if (openMeteoCount === 0) {
    try {
      const nomUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(clean)}&format=jsonv2&addressdetails=1&limit=10`;
      const res = await fetch(nomUrl, {
        signal: AbortSignal.timeout(3500),
        headers: {
          'User-Agent': 'WeatherInformationDashboard/1.0 (academic BCA project; contact@weatherdashboard.edu)'
        }
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          data.forEach(r => rawResults.push(normalizeNominatimResult(r)));
        }
      }
    } catch (err) {
      // Nominatim failed
    }
  }

  // 5. Deduplicate
  const seen = new Set();
  const unique = [];
  for (const item of rawResults) {
    const key = `${item.name.toLowerCase()}_${(item.state || '').toLowerCase()}_${(item.country || '').toLowerCase()}`;
    const coordKey = `${item.latitude.toFixed(2)}_${item.longitude.toFixed(2)}`;
    if (!seen.has(key) && !seen.has(coordKey)) {
      seen.add(key);
      seen.add(coordKey);
      unique.push(item);
    }
  }

  // 6. Intelligent Score-Based Ranking
  const getScore = (item, lower, aliased) => {
    let score = 0;
    const nameLower = item.name.toLowerCase();
    const pop = item.population || 0;
    const isExact = nameLower === lower || (aliased && nameLower === aliased.toLowerCase());
    const startsWith = nameLower.startsWith(lower);
    const isPlace = item.featureCode && (item.featureCode.startsWith('PPL') || item.featureCode.startsWith('ADM'));

    if (isExact) {
      if (pop > 500000) score += 150000 + Math.min(pop / 100, 50000);
      else if (pop > 50000) score += 90000 + Math.min(pop / 100, 30000);
      else if (pop > 0) score += 40000 + Math.min(pop / 100, 10000);
      else score += 15000; // tiny zero-pop exact match
    } else if (startsWith) {
      if (pop > 1000000) score += 100000 + Math.min(pop / 100, 50000);
      else if (pop > 200000) score += 70000 + Math.min(pop / 100, 25000);
      else if (pop > 50000) score += 45000 + Math.min(pop / 100, 15000);
      else if (pop > 0) score += 25000 + Math.min(pop / 100, 5000);
      else score += 8000;
    } else {
      score += Math.min(pop / 1000, 5000);
    }

    if (item.source === 'preset') score += 20000;
    if (isPlace) score += 3000;
    if (item.countryCode === 'IN' || item.country === 'India') score += 4000;

    return score;
  };

  unique.sort((a, b) => {
    return getScore(b, lower, aliased) - getScore(a, lower, aliased);
  });

  return unique.slice(0, 8);
}

async function run() {
  console.log('Testing partial queries with Major Cities DB:');
  for (const q of ['Kol', 'benga', 'mang', 'Lond', 'Tok']) {
    const results = await searchLocations(q);
    console.log(`\nQuery "${q}" suggestions (${results.length}):`);
    results.forEach((r, i) => {
      console.log(`  ${i + 1}. ${r.name} - ${r.state || ''}, ${r.country} (${r.source}, pop: ${r.population})`);
    });
  }
}

run();
