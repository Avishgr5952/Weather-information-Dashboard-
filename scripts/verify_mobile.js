import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function verifyMobile() {
  const artifactDir = 'C:\\Users\\avish\\.gemini\\antigravity\\brain\\00031917-422c-4dbc-85fa-0535b357a8c0';
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    ignoreHTTPSErrors: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 375, height: 812, isMobile: true, hasTouch: true });

  console.log('Testing mobile view at 375x812...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
  await sleep(2000);

  // Check map on mobile
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('nav button'));
    const mapBtn = btns.find(b => b.textContent.includes('Weather Map') || b.textContent.includes('Map'));
    if (mapBtn) mapBtn.click();
  });
  await sleep(2500);

  const mapDimensions = await page.evaluate(() => {
    const mapEl = document.querySelector('.leaflet-container');
    const bodyWidth = document.body.clientWidth;
    const scrollWidth = document.documentElement.scrollWidth;
    return {
      mapWidth: mapEl ? mapEl.clientWidth : 0,
      mapHeight: mapEl ? mapEl.clientHeight : 0,
      bodyWidth,
      scrollWidth,
      hasHorizontalOverflow: scrollWidth > bodyWidth
    };
  });

  console.log('Mobile Map Dimensions:', mapDimensions);
  const mobileScreenshotPath = path.join(artifactDir, 'weather_map_mobile.png');
  await page.screenshot({ path: mobileScreenshotPath, fullPage: false });
  console.log(`Saved mobile screenshot: ${mobileScreenshotPath}`);

  await browser.close();
}

verifyMobile().catch(console.error);
