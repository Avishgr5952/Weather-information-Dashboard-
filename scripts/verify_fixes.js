import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function runBrowserVerification() {
  console.log('====================================================');
  console.log('STARTING AUTOMATED CHROME BROWSER VERIFICATION');
  console.log('Target: http://localhost:3000');
  console.log('====================================================\n');

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
  const networkErrors = [];

  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  page.on('pageerror', err => {
    pageErrors.push(err.toString());
  });

  page.on('requestfailed', req => {
    networkErrors.push(`${req.method()} ${req.url()} - ${req.failure()?.errorText || 'failed'}`);
  });

  // 1. Initial Load
  console.log('[1/6] Navigating to http://localhost:3000...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2', timeout: 30000 });
  await sleep(2500);

  const title = await page.title();
  console.log(`✓ Page Loaded. Title: "${title}"`);

  // Verify Overview content
  const overviewState = await page.evaluate(() => {
    const cityNameEl = document.querySelector('h1, h2, [data-testid="city-name"]');
    const tempEl = document.querySelector('.text-5xl, .text-6xl, [data-testid="current-temp"]');
    return {
      cityName: cityNameEl ? cityNameEl.innerText.trim() : 'NOT_FOUND',
      temp: tempEl ? tempEl.innerText.trim() : 'NOT_FOUND',
      navTabs: Array.from(document.querySelectorAll('nav button')).map(b => b.innerText.trim())
    };
  });
  console.log(`✓ Overview loaded. City: ${overviewState.cityName}, Temp: ${overviewState.temp}`);
  console.log(`✓ Navigation tabs present: ${overviewState.navTabs.join(', ')}`);

  // 2. Weather Map Test
  console.log('\n[2/6] Testing Weather Map Tab...');
  const mapNavSuccess = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('nav button'));
    const mapBtn = btns.find(b => b.textContent.includes('Weather Map') || b.textContent.includes('Map'));
    if (mapBtn) {
      mapBtn.click();
      return true;
    }
    return false;
  });
  console.log(`  Map button clicked: ${mapNavSuccess}`);
  await sleep(3500);

  const mapVerification = await page.evaluate(() => {
    const tiles = Array.from(document.querySelectorAll('.leaflet-tile'));
    const tileSrcs = tiles.map(t => t.src);
    const hasCarto = tileSrcs.some(s => s.toLowerCase().includes('carto'));
    const hasOsm = tileSrcs.some(s => s.toLowerCase().includes('openstreetmap.org'));
    const markers = document.querySelectorAll('.leaflet-marker-icon');
    const bodyText = document.body.innerText;
    const hasApiKeyWarning = bodyText.includes('API KEY REQUIRED');
    const attribution = document.querySelector('.leaflet-control-attribution')?.innerText || '';

    // Style buttons check
    const buttons = Array.from(document.querySelectorAll('button')).map(b => b.innerText.trim());

    return {
      tileCount: tiles.length,
      sampleTileSrc: tileSrcs[0] || 'NONE',
      hasCarto,
      hasOsm,
      markerCount: markers.length,
      hasApiKeyWarning,
      attribution,
      buttonsFound: buttons.filter(b => ['Adaptive', 'Light', 'Dark', 'Satellite', 'Precipitation', 'Wind'].includes(b))
    };
  });

  console.log('  Map Verification Details:');
  console.log(`    - Tile count rendered: ${mapVerification.tileCount}`);
  console.log(`    - Sample tile URL: ${mapVerification.sampleTileSrc}`);
  console.log(`    - Uses OpenStreetMap tiles: ${mapVerification.hasOsm}`);
  console.log(`    - Contains any CartoDB tile URLs: ${mapVerification.hasCarto}`);
  console.log(`    - "API KEY REQUIRED" text found in DOM: ${mapVerification.hasApiKeyWarning}`);
  console.log(`    - Leaflet markers rendered: ${mapVerification.markerCount}`);
  console.log(`    - Attribution: "${mapVerification.attribution}"`);
  console.log(`    - Map control buttons: ${mapVerification.buttonsFound.join(', ')}`);

  // Test map click for popup
  if (mapVerification.markerCount > 0) {
    console.log('  Testing marker click interaction...');
    await page.evaluate(() => {
      const firstMarker = document.querySelector('.leaflet-marker-icon');
      if (firstMarker) firstMarker.click();
    });
    await sleep(1000);
    const popupVisible = await page.evaluate(() => {
      return document.querySelector('.leaflet-popup') !== null;
    });
    console.log(`    - Popup visible after marker click: ${popupVisible}`);
  }

  // 3. Reports Tab Test
  console.log('\n[3/6] Testing Reports Tab...');
  const reportsNavSuccess = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('nav button'));
    const repBtn = btns.find(b => b.textContent.includes('Reports'));
    if (repBtn) {
      repBtn.click();
      return true;
    }
    return false;
  });
  console.log(`  Reports button clicked: ${reportsNavSuccess}`);
  await sleep(2500);

  const reportsVerification = await page.evaluate(() => {
    const bodyText = document.body.innerText;
    const isBlank = bodyText.trim().length === 0;
    const hasHeader = bodyText.includes('Weather Report Generator') || bodyText.includes('Official Meteorological Report');
    const hasConfigPanel = bodyText.includes('Report Type') || bodyText.includes('Report Sections');
    const hasDownloadBtn = Array.from(document.querySelectorAll('button')).some(b => b.innerText.includes('Download PDF') || b.innerText.includes('PDF'));
    const hasPreview = bodyText.includes('Document Preview') || bodyText.includes('Preview');
    const errorBoundaryActive = bodyText.includes('Unable to display weather report');

    return {
      isBlank,
      textLength: bodyText.trim().length,
      hasHeader,
      hasConfigPanel,
      hasDownloadBtn,
      hasPreview,
      errorBoundaryActive
    };
  });

  console.log('  Reports Verification Details:');
  console.log(`    - Page is blank: ${reportsVerification.isBlank}`);
  console.log(`    - Rendered text length: ${reportsVerification.textLength} chars`);
  console.log(`    - Report header found: ${reportsVerification.hasHeader}`);
  console.log(`    - Configuration panel found: ${reportsVerification.hasConfigPanel}`);
  console.log(`    - Download PDF button found: ${reportsVerification.hasDownloadBtn}`);
  console.log(`    - Live preview found: ${reportsVerification.hasPreview}`);
  console.log(`    - Error Boundary triggered: ${reportsVerification.errorBoundaryActive}`);

  // Test PDF download click handler
  if (reportsVerification.hasDownloadBtn) {
    console.log('  Testing PDF Download button click...');
    const pdfClickResult = await page.evaluate(async () => {
      const dlBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Download PDF') || b.innerText.includes('PDF'));
      if (dlBtn) {
        dlBtn.click();
        return { clicked: true, disabled: dlBtn.disabled };
      }
      return { clicked: false };
    });
    console.log(`    - PDF Download button clicked: ${pdfClickResult.clicked}`);
    await sleep(2000);
  }

  // 4. Test all remaining tabs to ensure complete stability
  console.log('\n[4/6] Testing all other dashboard tabs for errors...');
  const otherTabs = ['Favorites', 'Compare', 'History', 'Analytics', 'AI Advice', 'Overview'];
  for (const tabName of otherTabs) {
    await page.evaluate(name => {
      const btns = Array.from(document.querySelectorAll('nav button'));
      const btn = btns.find(b => b.textContent.includes(name));
      if (btn) btn.click();
    }, tabName);
    await sleep(1200);
    const tabState = await page.evaluate(name => {
      const text = document.body.innerText.trim();
      return { tab: name, length: text.length, isBlank: text.length < 50 };
    }, tabName);
    console.log(`  ✓ Tab "${tabName}": rendered ${tabState.length} chars (Blank: ${tabState.isBlank})`);
  }

  // 5. Console & Runtime Error Summary
  console.log('\n[5/6] Checking Browser Console & Runtime Errors...');
  console.log(`  Total Console Errors: ${consoleErrors.length}`);
  consoleErrors.forEach((err, i) => console.log(`    [Console Error ${i + 1}]: ${err}`));

  console.log(`  Total Page Uncaught Errors: ${pageErrors.length}`);
  pageErrors.forEach((err, i) => console.log(`    [Page Error ${i + 1}]: ${err}`));

  const fatalTileErrors = networkErrors.filter(e => e.includes('tile.openstreetmap.org') || e.includes('cartocdn'));
  console.log(`  Tile Network Failures: ${fatalTileErrors.length}`);
  fatalTileErrors.forEach((err, i) => console.log(`    [Network Error ${i + 1}]: ${err}`));

  // 6. Summary Result
  console.log('\n[6/6] Final Determination:');
  const mapPassed = mapVerification.tileCount > 0 && mapVerification.hasOsm && !mapVerification.hasCarto && !mapVerification.hasApiKeyWarning;
  const reportsPassed = !reportsVerification.isBlank && reportsVerification.hasHeader && !reportsVerification.errorBoundaryActive && pageErrors.length === 0;

  console.log(`  Weather Map Fix Verified: ${mapPassed ? 'PASS' : 'FAIL'}`);
  console.log(`  Reports Fix Verified:     ${reportsPassed ? 'PASS' : 'FAIL'}`);

  if (mapPassed && reportsPassed && pageErrors.length === 0) {
    console.log('\n>>> STATUS: WEATHER MAP + REPORTS BROWSER FIX VERIFIED <<<');
  } else {
    console.log('\n>>> STATUS: VERIFICATION FAILED <<<');
  }

  await browser.close();
}

runBrowserVerification().catch(err => {
  console.error('Browser verification failed with exception:', err);
  process.exit(1);
});
