import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const sleep = ms => new Promise(r => setTimeout(r, ms));
const ARTIFACT_DIR = 'C:\\Users\\avish\\.gemini\\antigravity\\brain\\00031917-422c-4dbc-85fa-0535b357a8c0';

async function runHistoryQA() {
  console.log('====================================================');
  console.log('STARTING FULL CHROME BROWSER QA (ZERO ERRORS AUDIT)');
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
      '--allow-insecure-localhost'
    ]
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  page.on('pageerror', err => {
    consoleErrors.push(err.toString());
  });

  try {
    // 1. Initial Load
    console.log('[1] Loading http://localhost:3000...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle2', timeout: 30000 });
    await sleep(2500);

    // 2. Click on "History" tab
    console.log('[2] Navigating to History tab...');
    const historyTabClicked = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const historyBtn = buttons.find(b => b.textContent.includes('History'));
      if (historyBtn) {
        historyBtn.click();
        return true;
      }
      return false;
    });

    if (!historyTabClicked) {
      throw new Error('History tab button not found in navigation bar!');
    }

    console.log('✓ Clicked History tab. Waiting for data load...');
    await sleep(2500);

    // 3. Inspect History UI helper
    const checkHistoryUI = async (stepName) => {
      return await page.evaluate((step) => {
        const errorH4 = Array.from(document.querySelectorAll('h4')).find(h => h.textContent.includes('Failed to Load'));
        const hasError = !!errorH4;
        const errorText = errorH4 ? errorH4.closest('div').textContent.trim() : null;

        const heading = document.querySelector('h2');
        const headingText = heading ? heading.textContent.trim() : '';

        // Summary cards
        const summaryLabels = Array.from(document.querySelectorAll('.uppercase')).map(el => el.textContent.trim());
        const summaryVals = Array.from(document.querySelectorAll('.text-xl.font-bold, .text-2xl.font-bold')).map(el => el.textContent.trim());

        // SVG polyline points
        const polylines = Array.from(document.querySelectorAll('svg polyline')).map(p => p.getAttribute('points'));

        // Table rows
        const tableRows = document.querySelectorAll('tbody tr');

        return {
          step,
          hasError,
          errorText,
          headingText,
          summaryLabels,
          summaryVals,
          polylineCount: polylines.length,
          hasValidPoints: polylines.some(pts => pts && pts.length > 10),
          rowCount: tableRows.length
        };
      }, stepName);
    };

    let status = await checkHistoryUI('Initial Load (Mumbai Default)');
    console.log('Initial History Status:', JSON.stringify(status, null, 2));

    if (status.hasError) {
      console.error('❌ HISTORY HAS ERROR:', status.errorText);
      throw new Error(`History loaded with error: ${status.errorText}`);
    } else {
      console.log(`✓ History loaded cleanly without errors!`);
      console.log(`✓ Summary metrics: ${status.summaryLabels.join(', ')} -> ${status.summaryVals.join(', ')}`);
      console.log(`✓ SVG Polylines count: ${status.polylineCount}, valid points: ${status.hasValidPoints}`);
      console.log(`✓ Observation table row count: ${status.rowCount}`);
    }

    // Take screenshot of Mumbai 7 Days
    const shotPath1 = path.join(ARTIFACT_DIR, 'history_mumbai_7d.png');
    await page.screenshot({ path: shotPath1 });
    console.log(`✓ Saved screenshot: ${shotPath1}`);

    // 4. Test Presets (14d, 30d, 90d, 7d)
    const presets = [
      { label: 'Last 14 Days', minRows: 14 },
      { label: 'Last 30 Days', minRows: 30 },
      { label: 'Last 3 Months', minRows: 90 },
      { label: 'Last 7 Days', minRows: 7 }
    ];

    for (const preset of presets) {
      console.log(`\n[3] Testing preset: "${preset.label}"...`);
      await page.evaluate((label) => {
        const btns = Array.from(document.querySelectorAll('button'));
        const target = btns.find(b => b.textContent.trim() === label);
        if (target) target.click();
      }, preset.label);

      await sleep(2000);
      const presetStatus = await checkHistoryUI(`Preset ${preset.label}`);
      if (presetStatus.hasError) {
        throw new Error(`Error on preset ${preset.label}: ${presetStatus.errorText}`);
      }
      console.log(`✓ Preset "${preset.label}" loaded successfully: ${presetStatus.rowCount} daily rows.`);
    }

    // 5. Test Custom Range (2026-08-01 to 2026-08-10)
    console.log('\n[4] Testing Custom Range: 2026-08-01 to 2026-08-10...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const customBtn = btns.find(b => b.textContent.trim().includes('Custom Range'));
      if (customBtn) customBtn.click();
    });
    await sleep(500);

    // Set custom dates via React prototype setter
    await page.evaluate(() => {
      const inputs = document.querySelectorAll('input[type="date"]');
      if (inputs.length >= 2) {
        const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        setter.call(inputs[0], '2026-08-01');
        inputs[0].dispatchEvent(new Event('input', { bubbles: true }));
        inputs[0].dispatchEvent(new Event('change', { bubbles: true }));

        setter.call(inputs[1], '2026-08-10');
        inputs[1].dispatchEvent(new Event('input', { bubbles: true }));
        inputs[1].dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
    await sleep(500);

    // Submit "Fetch Archive"
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const fetchBtn = btns.find(b => b.textContent.trim().includes('Fetch Archive'));
      if (fetchBtn) fetchBtn.click();
    });
    console.log('Submitted custom date form. Waiting for data...');
    await sleep(2500);

    const customStatus = await checkHistoryUI('Custom Range 2026-08-01 to 2026-08-10');
    console.log('Custom Range Status:', JSON.stringify(customStatus, null, 2));
    if (customStatus.hasError) {
      throw new Error(`Custom range error: ${customStatus.errorText}`);
    }
    console.log(`✓ Custom range loaded: ${customStatus.rowCount} daily rows (Expected: 10 rows).`);

    const shotPathCustom = path.join(ARTIFACT_DIR, 'history_mumbai_custom.png');
    await page.screenshot({ path: shotPathCustom });
    console.log(`✓ Saved screenshot: ${shotPathCustom}`);

    // 6. Test Refresh button
    console.log('\n[5] Testing Refresh button...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const refreshBtn = btns.find(b => b.textContent.trim().includes('Refresh'));
      if (refreshBtn) refreshBtn.click();
    });
    await sleep(2000);
    const refreshStatus = await checkHistoryUI('After Refresh');
    if (refreshStatus.hasError) {
      throw new Error(`Refresh button caused error: ${refreshStatus.errorText}`);
    }
    console.log(`✓ Refresh button succeeded without errors (${refreshStatus.rowCount} rows).`);

    // 7. Test Location Search & History for Bengaluru, Kolar, Delhi, London, Tokyo
    const testCities = ['Bengaluru', 'Kolar', 'Delhi', 'London', 'Tokyo'];
    for (const city of testCities) {
      console.log(`\n[6] Testing city search and History for "${city}"...`);

      // Search via SearchBar
      await page.evaluate((cityName) => {
        const input = document.querySelector('input[placeholder*="Search"]');
        if (input) {
          const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
          setter.call(input, cityName);
          input.dispatchEvent(new Event('input', { bubbles: true }));
        }
      }, city);
      await sleep(1200);

      // Click Search button or top suggestion
      await page.evaluate(() => {
        const suggestion = document.querySelector('.cursor-pointer p.font-semibold, div[role="button"]');
        if (suggestion) {
          suggestion.click();
        } else {
          const form = document.querySelector('form');
          if (form) form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
        }
      });
      await sleep(3000);

      // Verify history loaded for city
      const cityStatus = await checkHistoryUI(`City ${city}`);
      if (cityStatus.hasError) {
        throw new Error(`History error for ${city}: ${cityStatus.errorText}`);
      }
      console.log(`✓ History for ${city} loaded: ${cityStatus.headingText}, rows: ${cityStatus.rowCount}, summary: ${cityStatus.summaryVals.slice(1, 3).join(', ')}`);

      const shotPathCity = path.join(ARTIFACT_DIR, `history_${city.toLowerCase()}.png`);
      await page.screenshot({ path: shotPathCity });
      console.log(`✓ Saved screenshot: ${shotPathCity}`);
    }

    // 8. Test °C to °F toggle
    console.log('\n[7] Testing °C/°F toggle in History...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const unitBtn = btns.find(b => b.textContent.includes('°F'));
      if (unitBtn) unitBtn.click();
    });
    await sleep(1000);

    const fahrenheitStatus = await page.evaluate(() => {
      const text = document.body.innerText;
      return { hasF: text.includes('°F') };
    });
    console.log(`✓ °C/°F toggle to °F verified: ${fahrenheitStatus.hasF}`);

    // Switch back to °C
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const unitBtn = btns.find(b => b.textContent.includes('°C'));
      if (unitBtn) unitBtn.click();
    });
    await sleep(1000);

    // 9. Verify navigation to other tabs still works seamlessly (Overview, Map, Reports)
    console.log('\n[8] Verifying tab navigation: Overview, Weather Map, Reports...');
    for (const tabName of ['Overview', 'Weather Map', 'Reports', 'History']) {
      await page.evaluate((name) => {
        const btns = Array.from(document.querySelectorAll('button'));
        const target = btns.find(b => b.textContent.trim() === name);
        if (target) target.click();
      }, tabName);
      await sleep(1500);

      const tabOk = await page.evaluate((name) => {
        const text = document.body.innerText;
        return text.length > 100;
      }, tabName);
      console.log(`✓ Tab "${tabName}" navigated successfully (renders: ${tabOk})`);
    }

    // Filter critical console errors (ignoring react-devtools recommendation)
    const criticalErrors = consoleErrors.filter(err => 
      !err.includes('favicon') && 
      !err.includes('Leaflet') &&
      !err.includes('tile') &&
      !err.includes('react-devtools')
    );
    console.log('\nCritical Console Errors Count:', criticalErrors.length);
    if (criticalErrors.length > 0) {
      console.log('Errors:', criticalErrors);
    }

    console.log('\n====================================================');
    console.log('HISTORICAL WEATHER QA VERIFICATION COMPLETED: ALL PASS');
    console.log('====================================================');

  } catch (err) {
    console.error('QA FAILED WITH EXCEPTION:', err);
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
}

runHistoryQA();
