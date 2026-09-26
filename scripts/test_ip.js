import https from 'https';

function testDirectIP() {
  const options = {
    hostname: '94.130.142.35', // Open-Meteo actual server IP
    port: 443,
    path: '/v1/archive?latitude=19.076&longitude=72.8777&start_date=2026-08-01&end_date=2026-08-10&daily=temperature_2m_max&timezone=auto',
    method: 'GET',
    headers: {
      'Host': 'archive-api.open-meteo.com',
      'User-Agent': 'WeatherApp/1.0'
    },
    rejectUnauthorized: false
  };

  const req = https.request(options, (res) => {
    console.log('Direct IP Status:', res.statusCode);
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => console.log('Direct IP Body:', data.slice(0, 300)));
  });

  req.on('error', e => console.error('Direct IP Error:', e));
  req.end();
}

testDirectIP();
