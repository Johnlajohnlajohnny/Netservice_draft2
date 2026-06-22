import { chromium } from 'playwright';
import path from 'path';

(async () => {
  console.log("Launching browser...");
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 }
  });
  const page = await context.newPage();

  console.log("Navigating to http://localhost:5201/portfolio ...");
  try {
    await page.goto('http://localhost:5201/portfolio', { waitUntil: 'networkidle' });
  } catch (e) {
    console.log("Initial load failed or timed out, retrying in 2s...");
    await new Promise(r => setTimeout(r, 2000));
    await page.goto('http://localhost:5201/portfolio', { waitUntil: 'load' });
  }

  console.log("Waiting for WebGL to render...");
  // Wait 3 seconds for Three.js and textures to load and render
  await page.waitForTimeout(3000);

  const screenshotPath = path.resolve('C:/Users/User/.gemini/antigravity/brain/2d57a8e0-d85d-4975-9700-9e06ed2a1c89/screenshot.png');
  console.log(`Saving screenshot to ${screenshotPath}...`);
  await page.screenshot({ path: screenshotPath });

  await browser.close();
  console.log("Done!");
})();
