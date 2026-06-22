import { chromium } from 'playwright'
import { writeFileSync, mkdirSync } from 'fs'
import path from 'path'

const BASE = 'http://localhost:5201'
const PAGES = [
  { name: 'home',        path: '/' },
  { name: 'about',       path: '/about' },
  { name: 'products',    path: '/products' },
  { name: 'portfolio',   path: '/portfolio' },
  { name: 'corporate',   path: '/corporate-governance' },
  { name: 'news',        path: '/news' },
  { name: 'contact',     path: '/contact' },
  { name: 'privacy',     path: '/privacy' },
  { name: 'partners',    path: '/partners' },
]

mkdirSync('./screenshots', { recursive: true })

function contrastRatio(r1,g1,b1, r2,g2,b2) {
  const lum = (r,g,b) => {
    const [rs,gs,bs] = [r,g,b].map(c => {
      c /= 255
      return c <= 0.04045 ? c/12.92 : Math.pow((c+0.055)/1.055, 2.4)
    })
    return 0.2126*rs + 0.7152*gs + 0.0722*bs
  }
  const L1 = lum(r1,g1,b1), L2 = lum(r2,g2,b2)
  const lighter = Math.max(L1,L2), darker = Math.min(L1,L2)
  return (lighter+0.05)/(darker+0.05)
}

function parseRgb(str) {
  const m = str.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/)
  return m ? [+m[1],+m[2],+m[3]] : null
}

const browser = await chromium.launch()
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
const page = await ctx.newPage()

const results = {}

for (const pg of PAGES) {
  await page.goto(BASE + pg.path, { waitUntil: 'networkidle', timeout: 15000 })
  await page.waitForTimeout(1200)

  // Screenshot
  await page.screenshot({ path: `./screenshots/${pg.name}.png`, fullPage: false })

  // ── Typography ──
  const typo = await page.evaluate(() => {
    const h1 = document.querySelector('h1, .hero-title, .banner-title, [class*="title"]')
    const body = document.querySelector('p, .body-text, main p')
    const nav = document.querySelector('.desktop-menu a')
    return {
      h1Font:    h1  ? getComputedStyle(h1).fontFamily  : 'none',
      h1Size:    h1  ? getComputedStyle(h1).fontSize    : 'none',
      h1Weight:  h1  ? getComputedStyle(h1).fontWeight  : 'none',
      h1LineH:   h1  ? getComputedStyle(h1).lineHeight  : 'none',
      bodyFont:  body ? getComputedStyle(body).fontFamily : 'none',
      bodySize:  body ? getComputedStyle(body).fontSize   : 'none',
      bodyLineH: body ? getComputedStyle(body).lineHeight : 'none',
      navFont:   nav  ? getComputedStyle(nav).fontFamily  : 'none',
    }
  })

  // ── Colors ──
  const colors = await page.evaluate(() => {
    const body = document.body
    const primary = document.querySelector('[class*="primary"], .btn-primary, .nav-cta, .banner-badge')
    const heading = document.querySelector('h1, h2, .section-title')
    const bodyText = document.querySelector('p')
    const bg = document.querySelector('main, .page-content, section')
    return {
      bodyBg:      getComputedStyle(body).backgroundColor,
      primaryEl:   primary  ? { bg: getComputedStyle(primary).backgroundColor, color: getComputedStyle(primary).color, el: primary.className } : null,
      headingColor: heading ? getComputedStyle(heading).color : 'none',
      bodyTextColor: bodyText ? getComputedStyle(bodyText).color : 'none',
      bgEl:        bg ? getComputedStyle(bg).backgroundColor : 'none',
    }
  })

  // ── Spacing ──
  const spacing = await page.evaluate(() => {
    const sections = [...document.querySelectorAll('section, .section, [class*="-section"]')]
    return sections.slice(0,6).map(s => ({
      cls: s.className.slice(0,40),
      h: s.offsetHeight,
      pt: getComputedStyle(s).paddingTop,
      pb: getComputedStyle(s).paddingBottom,
    }))
  })

  // ── Interactive elements ──
  const interactive = await page.evaluate(() => {
    const btns = [...document.querySelectorAll('a, button')].slice(0,5)
    return btns.map(b => {
      const r = b.getBoundingClientRect()
      return {
        tag: b.tagName,
        txt: b.textContent?.trim().slice(0,20),
        w: Math.round(r.width),
        h: Math.round(r.height),
        cursor: getComputedStyle(b).cursor,
      }
    })
  })

  // ── Contrast spot-check ──
  const contrast = await page.evaluate(() => {
    // Check body text on background
    const p = document.querySelector('p')
    const section = document.querySelector('section, main')
    if (!p || !section) return null
    return {
      textColor: getComputedStyle(p).color,
      bgColor:   getComputedStyle(p).backgroundColor || getComputedStyle(section).backgroundColor,
    }
  })

  // ── Visual clutter / noise check ──
  const noise = await page.evaluate(() => {
    const allText = [...document.querySelectorAll('*')]
      .filter(el => {
        const r = el.getBoundingClientRect()
        return r.width > 0 && r.height > 0 && r.top >= 0 && r.top < window.innerHeight
      })
    return {
      visibleEls: allText.length,
      imgCount: document.querySelectorAll('img').length,
      svgCount: document.querySelectorAll('svg').length,
      animEls: document.querySelectorAll('[class*="animate"], [data-gsap], canvas').length,
    }
  })

  // ── Section rhythm for full scroll ──
  const rhythm = await page.evaluate(() => {
    const gaps = []
    const sections = [...document.querySelectorAll('section, .section')]
    for (let i=1; i<sections.length; i++) {
      const prev = sections[i-1].getBoundingClientRect()
      const curr = sections[i].getBoundingClientRect()
      gaps.push(Math.round(curr.top - prev.bottom + window.scrollY))
    }
    return { sectionCount: sections.length, gaps }
  })

  results[pg.name] = { typo, colors, spacing, interactive, contrast, noise, rhythm }
}

// Mobile check on home + contact
const mob = await browser.newContext({ viewport: { width: 390, height: 844 } })
const mobPage = await mob.newPage()
const mobileResults = {}
for (const pg of [PAGES[0], PAGES[6]]) {
  await mobPage.goto(BASE + pg.path, { waitUntil: 'networkidle', timeout: 15000 })
  await mobPage.waitForTimeout(800)
  await mobPage.screenshot({ path: `./screenshots/${pg.name}_mobile.png`, fullPage: false })
  const mobileTypo = await mobPage.evaluate(() => {
    const h1 = document.querySelector('h1, .hero-title, .banner-title, [class*="title"]')
    const p = document.querySelector('p')
    return {
      h1Size: h1 ? getComputedStyle(h1).fontSize : 'none',
      h1LineH: h1 ? getComputedStyle(h1).lineHeight : 'none',
      bodySize: p ? getComputedStyle(p).fontSize : 'none',
    }
  })
  mobileResults[pg.name] = mobileTypo
}
await mob.close()

// CSS variables audit
await page.goto(BASE + '/', { waitUntil: 'networkidle' })
const cssVars = await page.evaluate(() => {
  const root = getComputedStyle(document.documentElement)
  return {
    primary: root.getPropertyValue('--primary').trim(),
    secondary: root.getPropertyValue('--secondary').trim(),
    accent: root.getPropertyValue('--accent').trim(),
    textDark: root.getPropertyValue('--text-dark').trim(),
    textLight: root.getPropertyValue('--text-light').trim(),
    bg: root.getPropertyValue('--bg').trim(),
  }
})

await browser.close()

const report = { cssVars, pages: results, mobile: mobileResults }
writeFileSync('./ui-audit-result.json', JSON.stringify(report, null, 2))
console.log('DONE — results saved to ui-audit-result.json')
console.log('CSS VARS:', JSON.stringify(cssVars, null, 2))
