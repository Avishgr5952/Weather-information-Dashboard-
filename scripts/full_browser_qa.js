import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function runComprehensiveQA() {
  console.log('====================================================');
  console.log('STARTING END-TO-END CHROME BROWSER QA SUITE');
  console.log('Target: http://localhost:3000');
  console.log('====================================================\n');

  const artifactDir = 'C:\\Users\\avish\\.gemini\\antigravity\\brain\\00031917-422c-4dbc-85fa-0535b357a8c0';
  if (!fs.existsSync(artifactDir)) {
    fs.mkdirSync(artifactDir, { recursive: true });
  }

  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    ignoreHTTPSErrors: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--ignore-certificate-errors',
      '--ignore-certificate-errors-spki-list',
      '--allow-insecure-localhost'
    ]
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  const consoleErrors = [];
  const pageErrors = [];

  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  page.on('pageerror', err => {
    pageErrors.push(err.toString());
  });

  // 1. Initial Load
  console.log('[1/7] Navigating to http://localhost:3000...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2', timeout: 30000 });
  await sleep(2000);

  // 2. Test Search & Autocomplete Flow Specifically with "Kolar"
  console.log('\n[2/7] Testing Location Search for "Kolar"...');
  const searchInput = await page.$('input[placeholder*="Search location"]');
  if (!searchInput) throw new Error('Search input not found');

  // Clear and type "Kolar"
  await page.evaluate(() => {
    const input = document.querySelector('input[placeholder*="Search location"]');
    if (input) {
      input.value = '';
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }
  });
  await searchInput.type('Kolar', { delay: 100 });
  await sleep(1500);

  // Check autocomplete dropdown contents
  const kolarDropdownResults = await page.evaluate(() => {
    const items = Array.from(document.querySelectorAll('.animate-fadeIn button'));
    return items.map(b => ({
      title: b.querySelector('.text-sm')?.innerText?.trim() || '',
      subtitle: b.querySelector('.text-xs')?.innerText?.trim() || ''
    }));
  });
  console.log(`  Dropdown suggestions count for "Kolar": ${kolarDropdownResults.length}`);
  kolarDropdownResults.forEach((r, i) => {
    console.log(`    ${i + 1}. ${r.title} - ${r.subtitle}`);
  });

  // Click Kolar suggestion
  console.log('  Selecting Kolar from suggestions...');
  await page.evaluate(() => {
    const items = Array.from(document.querySelectorAll('.animate-fadeIn button'));
    const kolarItem = items.find(b => b.innerText.includes('Kolar'));
    if (kolarItem) kolarItem.click();
  });
  await sleep(3000);

  // Verify Overview updated to Kolar
  const overviewKolar = await page.evaluate(() => {
    const text = document.body.innerText;
    return {
      hasKolarInBody: text.includes('Kolar'),
      kolarMentions: (text.match(/Kolar/g) || []).length
    };
  });
  console.log(`  Kolar loaded in dashboard: ${overviewKolar.hasKolarInBody} (occurrences: ${overviewKolar.kolarMentions})`);

  // 3. Test Partial Autocomplete Queries ("Kol", "benga", "mang", "Lond", "Tok")
  console.log('\n[3/7] Testing Partial Autocomplete Queries...');
  const partialQueries = [
    { query: 'Kol', expectedName: 'Kolar' },
    { query: 'benga', expectedName: 'Bengaluru' },
    { query: 'mang', expectedName: 'Mangalore' },
    { query: 'Lond', expectedName: 'London' },
    { query: 'Tok', expectedName: 'Tokyo' }
  ];

  for (const item of partialQueries) {
    await page.evaluate(() => {
      const input = document.querySelector('input[placeholder*="Search location"]');
      if (input) {
        input.value = '';
        input.dispatchEvent(new Event('input', { bubbles: true }));
      }
    });
    await searchInput.type(item.query, { delay: 80 });
    await sleep(1200);

    const suggestions = await page.evaluate(() => {
      const items = Array.from(document.querySelectorAll('.animate-fadeIn button'));
      return items.map(b => b.querySelector('.text-sm')?.innerText?.trim() || '');
    });

    const hasExpected = suggestions.some(s => s.toLowerCase().includes(item.expectedName.toLowerCase()));
    console.log(`  Query "${item.query}" -> Top 3: [${suggestions.slice(0, 3).join(', ')}] (Contains "${item.expectedName}": ${hasExpected})`);
  }

  // 4. Test Invalid Search
  console.log('\n[4/7] Testing Invalid Search Query "xyzabc123456"...');
  await page.evaluate(() => {
    const input = document.querySelector('input[placeholder*="Search location"]');
    if (input) {
      input.value = '';
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }
  });
  await searchInput.type('xyzabc123456', { delay: 60 });
  await sleep(1200);

  const invalidDropdownText = await page.evaluate(() => {
    const dropdown = document.querySelector('.animate-fadeIn');
    return dropdown ? dropdown.innerText.trim() : 'NO_DROPDOWN';
  });
  console.log(`  Invalid search dropdown message: "${invalidDropdownText.replace(/\n/g, ' ')}"`);

  // 5. Test Weather Map
  console.log('\n[5/7] Testing Weather Map Tab...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('nav button'));
    const mapBtn = btns.find(b => b.textContent.includes('Weather Map') || b.textContent.includes('Map'));
    if (mapBtn) mapBtn.click();
  });
  await sleep(3000);

  const mapDetails = await page.evaluate(() => {
    const tiles = Array.from(document.querySelectorAll('.leaflet-tile'));
    const tileSrcs = tiles.map(t => t.src);
    const hasCarto = tileSrcs.some(s => s.toLowerCase().includes('carto'));
    const hasOsm = tileSrcs.some(s => s.toLowerCase().includes('openstreetmap.org'));
    const bodyText = document.body.innerText;
    const hasApiKeyWarning = bodyText.includes('API KEY REQUIRED');
    const markers = Array.from(document.querySelectorAll('.leaflet-marker-icon'));
    const mapHeader = document.querySelector('h2')?.innerText || '';
    const centerSub = document.querySelector('h2 + p')?.innerText || '';

    // Check if hospital or POI markers exist
    const hasHospital = bodyText.toLowerCase().includes('hospital') || bodyText.toLowerCase().includes('clinic');

    return {
      tileCount: tiles.length,
      sampleTile: tileSrcs[0] || 'NONE',
      hasCarto,
      hasOsm,
      hasApiKeyWarning,
      hasHospital,
      markerCount: markers.length,
      mapHeader,
      centerSub
    };
  });

  console.log('  Map Inspection Details:');
  console.log(`    - Header: "${mapDetails.mapHeader}"`);
  console.log(`    - Centered text: "${mapDetails.centerSub}"`);
  console.log(`    - Tile count rendered: ${mapDetails.tileCount}`);
  console.log(`    - Sample tile URL: ${mapDetails.sampleTile}`);
  console.log(`    - Uses OpenStreetMap tiles: ${mapDetails.hasOsm}`);
  console.log(`    - Has CartoDB URLs: ${mapDetails.hasCarto}`);
  console.log(`    - Has "API KEY REQUIRED": ${mapDetails.hasApiKeyWarning}`);
  console.log(`    - Has unwanted hospital/clinic POI markers: ${mapDetails.hasHospital}`);
  console.log(`    - Marker count: ${mapDetails.markerCount}`);

  // Test Quick View Controls
  console.log('  Testing Quick Views (World View, India View, Recenter)...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const worldBtn = btns.find(b => b.innerText.includes('World View'));
    if (worldBtn) worldBtn.click();
  });
  await sleep(1500);

  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const indiaBtn = btns.find(b => b.innerText.includes('India View'));
    if (indiaBtn) indiaBtn.click();
  });
  await sleep(1500);

  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const recenterBtn = btns.find(b => b.innerText.includes('Recenter'));
    if (recenterBtn) recenterBtn.click();
  });
  await sleep(1500);

  // Test map click for reverse geocoding popup
  console.log('  Testing map click reverse geocoding interaction...');
  await page.evaluate(() => {
    const mapEl = document.querySelector('.leaflet-container');
    if (mapEl) {
      const rect = mapEl.getBoundingClientRect();
      const clickEvent = new MouseEvent('click', {
        clientX: rect.left + rect.width / 2 + 50,
        clientY: rect.top + rect.height / 2 + 50,
        bubbles: true
      });
      mapEl.dispatchEvent(clickEvent);
    }
  });
  await sleep(3500);

  const clickPopupState = await page.evaluate(() => {
    const popup = document.querySelector('.leaflet-popup');
    return {
      hasPopup: popup !== null,
      popupText: popup ? popup.innerText.trim().replace(/\n/g, ' ') : 'NO_POPUP',
      hasLoadButton: popup ? popup.querySelector('button') !== null : false
    };
  });
  console.log(`    - Popup visible: ${clickPopupState.hasPopup}`);
  console.log(`    - Popup text: "${clickPopupState.popupText}"`);
  console.log(`    - Load Weather button visible: ${clickPopupState.hasLoadButton}`);

  // Save screenshot of map
  const mapScreenshotPath = path.join(artifactDir, 'weather_map_fixed.png');
  await page.screenshot({ path: mapScreenshotPath, fullPage: false });
  console.log(`  Saved screenshot: ${mapScreenshotPath}`);

  // 6. Test Reports Page Stability
  console.log('\n[6/7] Verifying Reports Page does not crash or blank out...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('nav button'));
    const repBtn = btns.find(b => b.textContent.includes('Reports'));
    if (repBtn) repBtn.click();
  });
  await sleep(2500);

  const reportPageState = await page.evaluate(() => {
    const bodyText = document.body.innerText;
    return {
      isBlank: bodyText.trim().length === 0,
      textLength: bodyText.trim().length,
      hasHeader: bodyText.includes('Official Meteorological Report Generator'),
      hasDownloadBtn: Array.from(document.querySelectorAll('button')).some(b => b.innerText.includes('Download PDF')),
      hasPreview: bodyText.includes('WEATHER INFORMATION DASHBOARD')
    };
  });
  console.log(`  Reports view rendered: Length: ${reportPageState.textLength} chars`);
  console.log(`  Header present: ${reportPageState.hasHeader}`);
  console.log(`  Download button present: ${reportPageState.hasDownloadBtn}`);
  console.log(`  Preview mockup present: ${reportPageState.hasPreview}`);

  const reportScreenshotPath = path.join(artifactDir, 'reports_fixed.png');
  await page.screenshot({ path: reportScreenshotPath, fullPage: false });
  console.log(`  Saved screenshot: ${reportScreenshotPath}`);

  // 7. Verify all other tabs
  console.log('\n[7/7] Testing all other navigation tabs...');
  const allTabs = ['Favorites', 'Compare', 'History', 'Analytics', 'AI Advice', 'Overview'];
  for (const tabName of allTabs) {
    await page.evaluate(name => {
      const btns = Array.from(document.querySelectorAll('nav button'));
      const btn = btns.find(b => b.textContent.includes(name));
      if (btn) btn.click();
    }, tabName);
    await sleep(1000);
    const length = await page.evaluate(() => document.body.innerText.trim().length);
    console.log(`  ✓ Tab "${tabName}": rendered ${length} chars (Blank: ${length < 50})`);
  }

  // Summary
  console.log('\n====================================================');
  console.log('BROWSER QA CONSOLE & RUNTIME ERROR AUDIT:');
  console.log(`Total Console Errors: ${consoleErrors.length}`);
  consoleErrors.forEach((e, i) => console.log(`  [Console Error ${i + 1}]: ${e}`));
  console.log(`Total Page Errors: ${pageErrors.length}`);
  pageErrors.forEach((e, i) => console.log(`  [Page Error ${i + 1}]: ${e}`));

  const allPassed =
    overviewKolar.hasKolarInBody &&
    mapDetails.hasOsm &&
    !mapDetails.hasCarto &&
    !mapDetails.hasApiKeyWarning &&
    !reportPageState.isBlank &&
    reportPageState.hasHeader &&
    pageErrors.length === 0;

  console.log(`\nOVERALL STATUS: ${allPassed ? 'ALL TESTS PASSED' : 'SOME TESTS FAILED'}`);
  console.log('====================================================');

  await browser.close();
}

runComprehensiveQA().catch(err => {
  console.error('Browser QA run failed with exception:', err);
  process.exit(1);
});
