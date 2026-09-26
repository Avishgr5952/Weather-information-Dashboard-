async function checkReverse() {
  const url = 'https://nominatim.openstreetmap.org/reverse?lat=13.1805&lon=78.2669&format=jsonv2&zoom=10&addressdetails=1';
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'WeatherInformationDashboard/1.0 (academic BCA project; contact@weatherdashboard.edu)'
    }
  });
  const data = await res.json();
  console.log('Nominatim Reverse JSON:', JSON.stringify(data, null, 2));
}

checkReverse();
