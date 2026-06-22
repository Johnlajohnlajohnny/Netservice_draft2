const { chromium } = require('playwright');
const CHROME_DATA = process.env.LOCALAPPDATA + '\\Google\\Chrome\\User Data';

(async () => {
  let browser;
  try {
    browser = await chromium.launchPersistentContext(CHROME_DATA, {
      headless: false,
      channel: 'chrome',
      args: ['--start-maximized'],
      viewport: null,
    });
  } catch(e) {
    console.log('Chrome profile locked, using fresh browser');
    browser = await chromium.launchPersistentContext('', { headless: false, channel: 'chrome' });
  }

  const pages = await browser.pages();
  const page = pages.length > 0 ? pages[0] : await browser.newPage();

  console.log('Navigating to Figma token settings...');
  await page.goto('https://www.figma.com/settings#security', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(4000);

  const title = await page.title();
  console.log('Title:', title);

  await page.screenshot({ path: 'C:\\Users\\User\\AppData\\Local\\Temp\\figma_token_page.png' });

  // Check if logged in
  if (title.toLowerCase().includes('log in') || title.toLowerCase().includes('sign in')) {
    console.log('NOT_LOGGED_IN');
    await browser.close();
    return;
  }

  // Try clicking "Generate new token" button
  const btnSelectors = [
    'button:has-text("Generate new token")',
    'button:has-text("Create new token")',
    '[data-testid*="token"] button',
    'button:has-text("New token")',
  ];

  let clicked = false;
  for (const sel of btnSelectors) {
    try {
      const el = page.locator(sel).first();
      if (await el.isVisible({ timeout: 3000 })) {
        await el.click();
        console.log('Clicked generate button:', sel);
        clicked = true;
        await page.waitForTimeout(2000);
        break;
      }
    } catch {}
  }

  await page.screenshot({ path: 'C:\\Users\\User\\AppData\\Local\\Temp\\figma_token_modal.png' });

  if (!clicked) {
    console.log('BUTTON_NOT_FOUND — check screenshot');
    await browser.close();
    return;
  }

  // Fill token name
  try {
    const nameInput = page.locator('input[placeholder*="Token name"], input[placeholder*="Name"], input[type="text"]').first();
    if (await nameInput.isVisible({ timeout: 3000 })) {
      await nameInput.fill('claude-mcp-' + Date.now());
      await page.waitForTimeout(500);
    }
  } catch {}

  // Click confirm/generate
  const confirmSelectors = [
    'button:has-text("Generate token")',
    'button:has-text("Create token")',
    'button:has-text("Generate")',
    'button[type="submit"]',
  ];
  for (const sel of confirmSelectors) {
    try {
      const el = page.locator(sel).first();
      if (await el.isVisible({ timeout: 2000 })) {
        await el.click();
        console.log('Confirmed with:', sel);
        await page.waitForTimeout(2000);
        break;
      }
    } catch {}
  }

  await page.screenshot({ path: 'C:\\Users\\User\\AppData\\Local\\Temp\\figma_token_result.png' });

  // Try to read the token from the page
  const tokenSelectors = [
    'input[readonly]',
    'code',
    '[data-testid*="token-value"]',
    'input[value^="figd_"]',
  ];

  let token = null;
  for (const sel of tokenSelectors) {
    try {
      const el = page.locator(sel).first();
      if (await el.isVisible({ timeout: 2000 })) {
        token = await el.inputValue().catch(() => el.innerText());
        if (token && token.startsWith('figd_')) {
          console.log('TOKEN:' + token);
          break;
        }
      }
    } catch {}
  }

  if (!token) {
    // Try getting all text that looks like a token
    const allText = await page.content();
    const match = allText.match(/figd_[A-Za-z0-9_\-]{20,}/);
    if (match) {
      console.log('TOKEN:' + match[0]);
    } else {
      console.log('TOKEN_NOT_FOUND — check figma_token_result.png');
    }
  }

  await page.waitForTimeout(3000);
  await browser.close();
})();
