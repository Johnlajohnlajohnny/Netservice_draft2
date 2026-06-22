import { chromium } from 'playwright'

const BASE = 'http://localhost:5201'
const browser = await chromium.launch()
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
const page = await ctx.newPage()

// Full page screenshots of all sections
await page.goto(BASE + '/', { waitUntil: 'networkidle' })
await page.waitForTimeout(1000)

// Scroll through home page sections
const homeScrolls = [0, 900, 1800, 2800, 4200, 5500, 6500]
for (const [i, y] of homeScrolls.entries()) {
  await page.evaluate(y => window.scrollTo(0, y), y)
  await page.waitForTimeout(600)
  await page.screenshot({ path: `./screenshots/home_scroll_${i}.png` })
}

// Subpages
const pages = ['about', 'products', 'portfolio', 'news', 'contact', 'partners']
for (const pg of pages) {
  await page.goto(BASE + '/' + pg, { waitUntil: 'networkidle' })
  await page.waitForTimeout(800)
  await page.screenshot({ path: `./screenshots/color_${pg}.png` })
  // Scroll to show content sections
  await page.evaluate(() => window.scrollTo(0, 600))
  await page.waitForTimeout(500)
  await page.screenshot({ path: `./screenshots/color_${pg}_mid.png` })
}

// Get all section background colors across the whole site
await page.goto(BASE + '/', { waitUntil: 'networkidle' })
await page.waitForTimeout(600)

const sectionColors = await page.evaluate(() => {
  const sections = [...document.querySelectorAll('section, .section, [class*="-section"], .hero, .cta-band')]
  return sections.map(el => {
    const s = getComputedStyle(el)
    const firstHeading = el.querySelector('h1,h2,h3,.block-title,.hero-title,.section-title')
    const firstP = el.querySelector('p')
    return {
      cls: el.className.toString().slice(0, 50),
      bg: s.backgroundColor,
      color: firstHeading ? getComputedStyle(firstHeading).color : null,
      bodyColor: firstP ? getComputedStyle(firstP).color : null,
      h: el.offsetHeight,
    }
  })
})

console.log('=== HOME SECTION COLORS ===')
sectionColors.forEach(s => console.log(JSON.stringify(s)))

// CSS var actual values
const vars = await page.evaluate(() => {
  const r = getComputedStyle(document.documentElement)
  const bodyS = getComputedStyle(document.body)
  return {
    '--primary':   r.getPropertyValue('--primary').trim(),
    '--accent':    r.getPropertyValue('--accent').trim(),
    '--dark':      r.getPropertyValue('--dark').trim(),
    '--text-dark': r.getPropertyValue('--text-dark').trim(),
    'body bg':     bodyS.backgroundColor,
  }
})
console.log('\n=== CSS VARS ===')
console.log(JSON.stringify(vars, null, 2))

await browser.close()
console.log('\nScreenshots saved.')
