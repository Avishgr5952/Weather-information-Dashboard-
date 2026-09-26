async function findLatestArchiveDate() {
  const lat = 19.0760;
  const lon = 72.8777;
  const now = new Date(); // e.g. Sep 26

  for (let daysAgo = 1; daysAgo <= 20; daysAgo++) {
    const d = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
    const dateStr = d.toISOString().split('T')[0];
    const url = `https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lon}&start_date=${dateStr}&end_date=${dateStr}&daily=temperature_2m_max&timezone=auto`;

    try {
      const res = await fetch(url);
      if (res.ok) {
        console.log(`✓ Open-Meteo Archive IS AVAILABLE for ${dateStr} (${daysAgo} days ago)! Status: ${res.status}`);
        break;
      } else {
        console.log(`✗ Open-Meteo Archive NOT available for ${dateStr} (${daysAgo} days ago). Status: ${res.status}`);
      }
    } catch (e) {
      console.log(`✗ Error for ${dateStr}: ${e.message}`);
    }
  }
}

findLatestArchiveDate();
