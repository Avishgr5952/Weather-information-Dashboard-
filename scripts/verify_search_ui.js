import puppeteer from 'puppeteer-core';

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function verifySearchInteractions() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    ignoreHTTPSErrors: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
  await sleep(2000);

  const searchInput = await page.$('input[placeholder*="Search location"]');

  // Test 1: Typing "Kol"
  console.log('Testing "Kol":');
  await searchInput.click();
  await page.evaluate(() => {
    const input = document.querySelector('input[placeholder*="Search location"]');
    input.value = '';
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });
  await searchInput.type('Kol', { delay: 100 });
  await sleep(1500);

  const kolSuggestions = await page.evaluate(() => {
    const el = document.querySelector('[data-testid="search-dropdown"]');
    if (!el) return [];
    return Array.from(el.querySelectorAll('button')).map(b => ({
      title: b.querySelector('.text-sm')?.innerText?.trim() || '',
      subtitle: b.querySelector('.text-xs')?.innerText?.trim() || ''
    }));
  });
  console.log('  Kol Suggestions:', kolSuggestions);

  // Test 2: Typing "benga"
  console.log('Testing "benga":');
  await page.evaluate(() => {
    const input = document.querySelector('input[placeholder*="Search location"]');
    input.value = '';
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });
  await searchInput.type('benga', { delay: 100 });
  await sleep(1500);

  const bengaSuggestions = await page.evaluate(() => {
    const el = document.querySelector('[data-testid="search-dropdown"]');
    if (!el) return [];
    return Array.from(el.querySelectorAll('button')).map(b => ({
      title: b.querySelector('.text-sm')?.innerText?.trim() || '',
      subtitle: b.querySelector('.text-xs')?.innerText?.trim() || ''
    }));
  });
  console.log('  Benga Suggestions:', bengaSuggestions);

  // Test 3: Typing "xyzabc123456"
  console.log('Testing "xyzabc123456":');
  await page.evaluate(() => {
    const input = document.querySelector('input[placeholder*="Search location"]');
    input.value = '';
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });
  await searchInput.type('xyzabc123456', { delay: 100 });
  await sleep(1500);

  const invalidText = await page.evaluate(() => {
    const el = document.querySelector('[data-testid="search-dropdown"]');
    return el ? el.innerText.trim().replace(/\n/g, ' ') : 'DROPDOWN_NOT_VISIBLE';
  });
  console.log('  Invalid Search Dropdown Text:', invalidText);

  await browser.close();
}

verifySearchInteractions().catch(console.error);
