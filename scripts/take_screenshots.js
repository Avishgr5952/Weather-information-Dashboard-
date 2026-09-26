import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function captureScreenshots() {
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
  await page.setViewport({ width: 1400, height: 900 });

  console.log('Navigating to http://localhost:3000...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2', timeout: 30000 });
  await sleep(2500);

  // 1. Weather Map Tab Screenshot
  console.log('Capturing Weather Map...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('nav button'));
    const mapBtn = btns.find(b => b.textContent.includes('Weather Map') || b.textContent.includes('Map'));
    if (mapBtn) mapBtn.click();
  });
  await sleep(3000);
  const mapPath = path.join(artifactDir, 'weather_map_verified.png');
  await page.screenshot({ path: mapPath, fullPage: false });
  console.log(`Saved map screenshot: ${mapPath}`);

  // 2. Reports Tab Screenshot
  console.log('Capturing Reports view...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('nav button'));
    const repBtn = btns.find(b => b.textContent.includes('Reports'));
    if (repBtn) repBtn.click();
  });
  await sleep(2500);
  const reportPath = path.join(artifactDir, 'reports_verified.png');
  await page.screenshot({ path: reportPath, fullPage: false });
  console.log(`Saved reports screenshot: ${reportPath}`);

  await browser.close();
  console.log('Screenshots successfully taken.');
}

captureScreenshots().catch(err => {
  console.error('Screenshot capture failed:', err);
  process.exit(1);
});
