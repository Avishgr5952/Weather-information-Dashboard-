import puppeteer from 'puppeteer-core';

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function diagnose() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  const consoleErrors = [];

  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  page.on('pageerror', err => {
    consoleErrors.push('PAGE_ERROR: ' + err.toString());
  });

  console.log('--- NAVIGATING TO http://localhost:3000 ---');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
  await sleep(2000);

  // 1. Check Weather Map tab
  console.log('\n--- CLICKING WEATHER MAP TAB ---');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('nav button'));
    const mapBtn = btns.find(b => b.textContent.includes('Weather Map'));
    if (mapBtn) mapBtn.click();
  });
  await sleep(3000);

  // Check tile images
  const mapData = await page.evaluate(() => {
    const tiles = Array.from(document.querySelectorAll('.leaflet-tile'));
    const srcList = tiles.slice(0, 5).map(t => t.src);
    const bodyText = document.body.innerText;
    return {
      tileCount: tiles.length,
      sampleSrcs: srcList,
      hasApiKeyText: bodyText.includes('API KEY REQUIRED')
    };
  });
  console.log('Weather Map Data:', mapData);

  // 2. Check Reports tab
  console.log('\n--- CLICKING REPORTS TAB ---');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('nav button'));
    const reportBtn = btns.find(b => b.textContent.includes('Reports'));
    if (reportBtn) reportBtn.click();
  });
  await sleep(2000);

  const reportsData = await page.evaluate(() => {
    const bodyText = document.body.innerText;
    const mainEl = document.querySelector('main');
    return {
      mainHtml: mainEl ? mainEl.innerHTML.slice(0, 200) : 'NO_MAIN',
      mainTextLength: mainEl ? mainEl.innerText.trim().length : 0,
      bodyHasReportTitle: bodyText.includes('Official Meteorological Report')
    };
  });
  console.log('Reports Page State:', reportsData);

  console.log('\n--- COLLECTED CONSOLE ERRORS ---');
  consoleErrors.forEach(err => console.error('  [BROWSER ERROR]:', err));

  await browser.close();
}

diagnose().catch(console.error);
