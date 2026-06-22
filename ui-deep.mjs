import { chromium } from 'playwright'

const BASE = 'http://localhost:5201'
const browser = await chromium.launch()
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
const page = await ctx.newPage()

// ── 1. About page — check real body text sizes in content sections ──────
await page.goto(BASE + '/about', { waitUntil: 'networkidle' })
await page.waitForTimeout(600)

const aboutTypo = await page.evaluate(() => {
  // Get all p tags and their sizes
  const allP = [...document.querySelectorAll('p')].map(el => {
    const s = getComputedStyle(el)
    const r = el.getBoundingClientRect()
    return {
      text: el.textContent?.trim().slice(0, 40),
      size: s.fontSize,
      lineH: s.lineHeight,
      color: s.color,
      font: s.fontFamily.split(',')[0],
      visible: r.width > 0 && r.height > 0,
      topY: Math.round(r.top),
    }
  }).filter(x => x.visible && x.topY > 100)
  return allP.slice(0, 12)
})

// ── 2. Home hero — check what element has the big hero text ──────────────
await page.goto(BASE + '/', { waitUntil: 'networkidle' })
await page.waitForTimeout(600)

const homeHero = await page.evaluate(() => {
  const big = [...document.querySelectorAll('*')].filter(el => {
    const s = getComputedStyle(el)
    const sz = parseFloat(s.fontSize)
    const r = el.getBoundingClientRect()
    return sz > 40 && r.top < 800 && r.width > 0 && el.children.length < 5
  }).map(el => {
    const s = getComputedStyle(el)
    return {
      tag: el.tagName,
      cls: el.className?.toString().slice(0, 50),
      size: s.fontSize,
      weight: s.fontWeight,
      lineH: s.lineHeight,
      font: s.fontFamily.split(',')[0],
      text: el.textContent?.trim().slice(0, 50),
    }
  })
  return big
})

// ── 3. Check CTA band on home — composition ─────────────────────────────
const homeCTA = await page.evaluate(() => {
  const cta = document.querySelector('.cta-band')
  if (!cta) return null
  const children = [...cta.querySelectorAll('*')].filter(el => {
    const r = el.getBoundingClientRect()
    return r.width > 0 && r.height > 0 && el.children.length === 0
  }).map(el => {
    const s = getComputedStyle(el)
    return {
      tag: el.tagName,
      cls: el.className?.toString().slice(0, 40),
      size: s.fontSize,
      text: el.textContent?.trim().slice(0, 50),
    }
  })
  return { h: cta.offsetHeight, children: children.slice(0, 8) }
})

// ── 4. Contact — check form layout ──────────────────────────────────────
await page.goto(BASE + '/contact', { waitUntil: 'networkidle' })
await page.waitForTimeout(600)

const contactForm = await page.evaluate(() => {
  const inputs = [...document.querySelectorAll('input, textarea')].map(el => {
    const r = el.getBoundingClientRect()
    const s = getComputedStyle(el)
    return { type: el.type, w: Math.round(r.width), h: Math.round(r.height), fontSize: s.fontSize, borderRadius: s.borderRadius }
  })
  const labels = [...document.querySelectorAll('label')].map(el => {
    const s = getComputedStyle(el)
    return { text: el.textContent?.trim().slice(0, 20), size: s.fontSize, weight: s.fontWeight, color: s.color }
  })
  return { inputs, labels }
})

// ── 5. Products — check card sizes ──────────────────────────────────────
await page.goto(BASE + '/products', { waitUntil: 'networkidle' })
await page.waitForTimeout(600)

const productCards = await page.evaluate(() => {
  const cards = [...document.querySelectorAll('[class*="card"], [class*="service"], [class*="feature"]')]
  return cards.slice(0, 4).map(el => {
    const r = el.getBoundingClientRect()
    const s = getComputedStyle(el)
    return { cls: el.className?.toString().slice(0, 40), w: Math.round(r.width), h: Math.round(r.height), bg: s.backgroundColor, borderRadius: s.borderRadius }
  })
})

// ── 6. Portfolio — grid card size ────────────────────────────────────────
await page.goto(BASE + '/portfolio', { waitUntil: 'networkidle' })
await page.waitForTimeout(1200)

const portCards = await page.evaluate(() => {
  const cards = [...document.querySelectorAll('[class*="card"], [class*="project"], [class*="port"]')]
  return cards.slice(0, 4).map(el => {
    const r = el.getBoundingClientRect()
    const s = getComputedStyle(el)
    const texts = [...el.querySelectorAll('*')].filter(x => !x.querySelector('*')).map(x => ({
      tag: x.tagName,
      size: getComputedStyle(x).fontSize,
      text: x.textContent?.trim().slice(0, 30),
    })).filter(x => x.text)
    return { cls: el.className?.toString().slice(0, 40), w: Math.round(r.width), h: Math.round(r.height), bg: s.backgroundColor, texts: texts.slice(0, 6) }
  })
})

// ── 7. Nav — exact dimensions of TH/EN links ────────────────────────────
await page.goto(BASE + '/', { waitUntil: 'networkidle' })
await page.waitForTimeout(400)

const navLang = await page.evaluate(() => {
  const links = [...document.querySelectorAll('.nav-lang a')]
  return links.map(el => {
    const r = el.getBoundingClientRect()
    const s = getComputedStyle(el)
    return { text: el.textContent?.trim(), w: Math.round(r.width), h: Math.round(r.height), padding: s.padding, fontSize: s.fontSize }
  })
})

// ── 8. Scroll-triggered — check Home full scroll body text ───────────────
await page.goto(BASE + '/', { waitUntil: 'networkidle' })
await page.evaluate(() => window.scrollBy(0, 1000))
await page.waitForTimeout(500)

const homeBodyAfterScroll = await page.evaluate(() => {
  const allP = [...document.querySelectorAll('p')].map(el => {
    const s = getComputedStyle(el)
    const r = el.getBoundingClientRect()
    return {
      text: el.textContent?.trim().slice(0, 40),
      size: s.fontSize,
      color: s.color,
      lineH: s.lineHeight,
    }
  }).filter(x => x.size !== '0px' && x.text.length > 10)
  return allP.slice(0, 8)
})

await browser.close()

console.log('\n=== ABOUT PAGE BODY TEXT ===')
console.log(JSON.stringify(aboutTypo, null, 2))

console.log('\n=== HOME HERO BIG ELEMENTS ===')
console.log(JSON.stringify(homeHero, null, 2))

console.log('\n=== HOME CTA BAND ===')
console.log(JSON.stringify(homeCTA, null, 2))

console.log('\n=== CONTACT FORM ===')
console.log(JSON.stringify(contactForm, null, 2))

console.log('\n=== PRODUCT CARDS ===')
console.log(JSON.stringify(productCards, null, 2))

console.log('\n=== PORTFOLIO CARDS ===')
console.log(JSON.stringify(portCards, null, 2))

console.log('\n=== NAV LANG LINKS ===')
console.log(JSON.stringify(navLang, null, 2))

console.log('\n=== HOME BODY TEXT (after scroll) ===')
console.log(JSON.stringify(homeBodyAfterScroll, null, 2))
