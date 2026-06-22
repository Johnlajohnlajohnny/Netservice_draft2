<template>
  <!-- Desktop grid (shown after cinematic intro completes) -->
  <section
    v-if="!isMobile"
    class="portfolio-grid-section"
    :class="{ 'is-visible': introComplete }"
    ref="gridSectionRef"
  >
    <div class="section-inner">
      <!-- Header -->
      <div class="portfolio-header">
        <div class="pf-header-top">
          <p class="eyebrow">{{ t('portfolio.eyebrow') }}</p>
          <span class="pf-project-count">{{ projects.length }} {{ t('portfolio.count') }}</span>
        </div>
        <h2 class="block-title">{{ t('portfolio.heading') }}</h2>
        <p class="portfolio-desc">{{ t('portfolio.desc') }}</p>
      </div>

      <!-- Category Groups -->
      <div class="category-sections">
        <div
          v-for="cat in categories"
          :key="cat.slug"
          :id="`category-section-${cat.slug}`"
          class="category-group"
        >
          <!-- Category Header -->
          <div class="category-header">
            <div class="cat-header-top">
              <span class="cat-num">{{ cat.num }}</span>
              <h3 class="cat-title">{{ locale === 'en' ? cat.titleEn : cat.titleTh }}</h3>
            </div>
            <p class="cat-desc">{{ cat.descKey ? t(cat.descKey) : (locale === 'en' ? cat.descEn : cat.descTh) }}</p>
          </div>

          <!-- Sub-Grid -->
          <div class="pf-grid">
            <RouterLink
              class="pf-card"
              v-for="(p, i) in getProjectsForCategory(cat.slug)"
              :key="p.slug"
              :to="`/portfolio/${p.slug}`"
              :style="{ '--accent': p.color }"
            >
              <div class="pf-visual" :class="{ 'pf-visual--img': p.img }"
                   :style="p.img
                     ? { backgroundImage: 'url(' + p.img + ')' }
                     : { background: 'linear-gradient(135deg, ' + p.color + 'ee 0%, ' + p.color + '55 100%)' }">
                <div class="pf-visual-grid" v-if="!p.img"></div>
                <div class="pf-visual-icon" v-if="!p.img" v-html="pfCatIcon(p.category)"></div>
                <span class="pf-index">{{ String(i + 1).padStart(2, '0') }}</span>
                <span class="pf-visual-budget" v-if="p.budget">{{ formatBudget(p.budget, locale === 'en') }}</span>
                <div class="pf-hover-overlay">
                  <p class="pf-overlay-title">{{ locale === 'en' ? (p.titleEn || p.title) : p.title }}</p>
                  <div class="pf-tags">
                    <span v-for="tag in p.tags" :key="tag">{{ tag }}</span>
                  </div>
                </div>
              </div>
              <div class="pf-info">
                <div class="pf-info-row">
                  <div class="pf-info-text">
                    <h4 class="pf-client-name">{{ locale === 'en' ? (p.clientEn || p.client) : p.client }}</h4>
                    <span
                      class="pf-type-chip"
                      :style="{ color: p.color, borderColor: p.color + '55', background: p.color + '18' }"
                    >{{ p.type }}</span>
                  </div>
                  <div class="pf-arrow-btn">
                    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8">
                      <path d="M3 8h10M9 4l4 4-4 4"/>
                    </svg>
                  </div>
                </div>
              </div>
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Mobile: simple high-performance list (no WebGL) -->
  <section v-else class="portfolio-grid-section is-visible mobile-only">
    <div class="section-inner">
      <p class="eyebrow">{{ t('portfolio.eyebrow') }}</p>
      <h2 class="block-title">{{ t('portfolio.heading') }}</h2>
      <p class="portfolio-desc">{{ t('portfolio.mobileDesc') }}</p>
      
      <!-- Category Groups -->
      <div class="category-sections">
        <div
          v-for="cat in categories"
          :key="cat.slug"
          :id="`category-section-${cat.slug}`"
          class="category-group"
        >
          <!-- Category Header -->
          <div class="category-header">
            <div class="cat-header-top">
              <span class="cat-num">{{ cat.num }}</span>
              <h3 class="cat-title">{{ locale === 'en' ? cat.titleEn : cat.titleTh }}</h3>
            </div>
            <p class="cat-desc">{{ cat.descKey ? t(cat.descKey) : (locale === 'en' ? cat.descEn : cat.descTh) }}</p>
          </div>

          <div class="pf-cat-scroll-wrap">
            <div
              class="pf-track-mobile"
              :ref="el => { catTrackRefs[cat.slug] = el as HTMLElement | null }"
              @scroll.passive="onCatScroll(cat.slug)"
            >
              <RouterLink
                class="pf-card-mobile"
                v-for="p in getProjectsForCategory(cat.slug)"
                :key="p.slug"
                :to="`/portfolio/${p.slug}`"
                :style="{ '--accent': p.color }"
              >
                <div class="pf-visual pf-visual--mobile" :class="{ 'pf-visual--img': p.img }"
                     :style="p.img
                       ? { backgroundImage: 'url(' + p.img + ')' }
                       : { background: 'linear-gradient(135deg, ' + p.color + 'ee 0%, ' + p.color + '77 100%)' }">
                  <div class="pf-visual-grid" v-if="!p.img"></div>
                  <div class="pf-visual-icon" v-if="!p.img" v-html="pfCatIcon(p.category)"></div>
                  <span class="pf-visual-budget" v-if="p.budget">{{ formatBudget(p.budget, locale === 'en') }}</span>
                </div>
                <div class="pf-info pf-info--mobile">
                  <p class="pf-client-name">{{ locale === 'en' ? (p.clientEn || p.client) : p.client }}</p>
                  <span class="pf-type-label">{{ p.type }}</span>
                  <p class="pf-project-title">{{ locale === 'en' ? (p.titleEn || p.title) : p.title }}</p>
                  <div class="pf-tags">
                    <span v-for="tag in p.tags.slice(0, 3)" :key="tag">{{ tag }}</span>
                  </div>
                </div>
              </RouterLink>
            </div>

            <!-- Prev / Next arrows — only for numbered categories (not 00) -->
            <template v-if="cat.num !== '00'">
              <button
                class="pf-scroll-btn pf-scroll-btn--prev"
                :disabled="!(catActiveIdx[cat.slug] ?? 0)"
                @click="scrollCat(cat.slug, -1)"
                aria-label="Previous"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="16" height="16"><path d="M15 18l-6-6 6-6"/></svg>
              </button>
              <button
                class="pf-scroll-btn pf-scroll-btn--next"
                :disabled="(catActiveIdx[cat.slug] ?? 0) >= getProjectsForCategory(cat.slug).length - 1"
                @click="scrollCat(cat.slug, 1)"
                aria-label="Next"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="16" height="16"><path d="M9 18l6-6-6-6"/></svg>
              </button>
            </template>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLocale } from '../../composables/useLocale'
import { formatBudget } from '../../data/portfolioData'
import { useLenis } from '../../composables/useLenis'

gsap.registerPlugin(ScrollTrigger)

const { t, locale } = useLocale()
const route = useRoute()
const { lenis } = useLenis()

interface Project {
  slug: string
  client: string;  clientEn?: string
  title: string;   titleEn?: string
  type: string
  category: string
  color: string
  budget?: string
  tags: string[]
  img?: string
  categories?: string[]
}

const props = defineProps<{
  projects: Project[]
  introComplete: boolean
  isMobile: boolean
}>()

// ── Categories definition ────────────────────────────────────
const categories: { slug: string; num: string; titleTh: string; titleEn: string; descKey?: string; descTh?: string; descEn?: string }[] = [
  {
    slug: 'latest',
    num: '00',
    titleTh: 'โครงการที่เพิ่งลงนามล่าสุด',
    titleEn: 'Latest Signed Project',
    descTh: 'โครงการล่าสุดที่บริษัทเพิ่งลงนามสัญญา',
    descEn: 'The most recent project we have signed.'
  },
  {
    slug: 'workflow',
    num: '01',
    titleTh: 'ระบบจัดการกระบวนการทำงาน (Workflow Management)',
    titleEn: 'Workflow Management System',
    descKey: 'expertise.dev.1'
  },
  {
    slug: 'eservice',
    num: '02',
    titleTh: 'ระบบบริการอิเล็กทรอนิกส์ (E-Service)',
    titleEn: 'E-Service Platform',
    descKey: 'expertise.dev.2'
  },
  {
    slug: 'webservice',
    num: '03',
    titleTh: 'บริการผ่านเว็บ (Web Service)',
    titleEn: 'Web Service System',
    descKey: 'expertise.dev.3'
  },
  {
    slug: 'apiservice',
    num: '04',
    titleTh: 'บริการอินเทอร์เฟซ (API Service)',
    titleEn: 'API Service Gateway',
    descKey: 'expertise.dev.4'
  },
  {
    slug: 'gis',
    num: '05',
    titleTh: 'ระบบภูมิสารสนเทศ (GIS Platform)',
    titleEn: 'GIS Platform',
    descKey: 'expertise.dev.5'
  },
  {
    slug: 'spatial',
    num: '06',
    titleTh: 'การจัดเก็บข้อมูลเชิงพื้นที่ (Spatial Data Storage)',
    titleEn: 'Spatial Data Storage',
    descKey: 'expertise.dev.6'
  }
]

function getProjectsForCategory(categorySlug: string) {
  if (categorySlug === 'latest') {
    return props.projects.filter(p => p.slug === 'aerothai-api')
  }
  return props.projects.filter(p => p.categories && p.categories.includes(categorySlug))
}

// ── Category icons ────────────────────────────────────────────
const svgWebApp = `<svg width="30" height="30" viewBox="0 0 448 512" fill="currentColor" style="display:block"><path d="M400 32C426.5 32 448 53.49 448 80V336C448 362.5 426.5 384 400 384H266.7L277.3 416H352C369.7 416 384 430.3 384 448C384 465.7 369.7 480 352 480H96C78.33 480 64 465.7 64 448C64 430.3 78.33 416 96 416H170.7L181.3 384H48C21.49 384 0 362.5 0 336V80C0 53.49 21.49 32 48 32H400zM64 96V320H384V96H64z"/></svg>`
const svgEDoc   = `<svg width="30" height="30" viewBox="0 0 384 512" fill="currentColor"><path d="M224 136V0H24C10.7 0 0 10.7 0 24v464c0 13.3 10.7 24 24 24h336c13.3 0 24-10.7 24-24V160H248c-13.2 0-24-10.8-24-24zm64 236c0 6.6-5.4 12-12 12H108c-6.6 0-12-5.4-12-12v-8c0-6.6 5.4-12 12-12h168c6.6 0 12 5.4 12 12v8zm0-64c0 6.6-5.4 12-12 12H108c-6.6 0-12-5.4-12-12v-8c0-6.6 5.4-12 12-12h168c6.6 0 12 5.4 12 12v8zm0-72v8c0 6.6-5.4 12-12 12H108c-6.6 0-12-5.4-12-12v-8c0-6.6 5.4-12 12-12h168c6.6 0 12 5.4 12 12zm96-153.1L286.1 32C279.1 25 269.8 21 260 21h-4v127h127v-4.1c0-9.7-4-19.1-11.1-26.1z"/></svg>`
const svgGIS    = `<svg width="30" height="30" viewBox="0 0 576 512" fill="currentColor"><path d="M408 120C408 174.6 334.9 271.9 302.8 311.1C295.1 321.6 280.9 321.6 273.2 311.1C241.1 271.9 168 174.6 168 120C168 53.73 221.7 0 288 0C354.3 0 408 53.73 408 120zM288 152C310.1 152 328 134.1 328 112C328 89.91 310.1 72 288 72C265.9 72 248 89.91 248 112C248 134.1 265.9 152 288 152zM432 416c0 35.3-64.2 64-143.5 64S144 451.3 144 416s64.2-64 143.5-64S432 380.7 432 416z"/></svg>`

function pfCatIcon(category: string) {
  if (category === 'edoc') return svgEDoc
  if (category === 'gis')  return svgGIS
  return svgWebApp
}

// ── Mobile carousel state ─────────────────────────────────────
const catTrackRefs    = ref<Record<string, HTMLElement | null>>({})
const catActiveIdx    = ref<Record<string, number>>({})

function onCatScroll(slug: string) {
  const el = catTrackRefs.value[slug]
  if (!el) return
  const firstCard = el.firstElementChild as HTMLElement | null
  const cardW = firstCard ? firstCard.offsetWidth + 14 : el.offsetWidth
  catActiveIdx.value[slug] = Math.round(el.scrollLeft / cardW)
}

function scrollCat(slug: string, dir: number) {
  const el = catTrackRefs.value[slug]
  if (!el) return
  const firstCard = el.firstElementChild as HTMLElement | null
  const cardW = firstCard ? firstCard.offsetWidth + 14 : el.offsetWidth
  const next = (catActiveIdx.value[slug] ?? 0) + dir
  el.scrollTo({ left: next * cardW, behavior: 'smooth' })
  catActiveIdx.value[slug] = next
}

// ── Grid ref ─────────────────────────────────────────────────
const gridSectionRef = ref<HTMLElement | null>(null)

// Handles for cleanup
let revealTimer: ReturnType<typeof setTimeout> | null = null
let scrollUnlisten: (() => void) | null = null
let cardTriggers: ScrollTrigger[] = []

function resetGrid(section: HTMLElement) {
  if (revealTimer)    { clearTimeout(revealTimer); revealTimer = null }
  if (scrollUnlisten) { scrollUnlisten(); scrollUnlisten = null }
  cardTriggers.forEach(st => st.kill())
  cardTriggers = []
  
  const header = section.querySelector<HTMLElement>('.portfolio-header')
  const catHeaders = section.querySelectorAll<HTMLElement>('.category-header')
  const cards  = section.querySelectorAll<HTMLElement>('.pf-card')
  
  gsap.killTweensOf([
    ...(header ? [header] : []),
    ...Array.from(catHeaders),
    ...Array.from(cards)
  ])
  
  gsap.set(header, { opacity: 0, y: 28 })
  gsap.set(catHeaders, { opacity: 0, y: 24 })
  gsap.set(cards,  { opacity: 0, y: 24 })
}

function revealGrid(section: HTMLElement) {
  resetGrid(section)
  const header = section.querySelector<HTMLElement>('.portfolio-header')
  const catHeaders = section.querySelectorAll<HTMLElement>('.category-header')
  const cards = section.querySelectorAll<HTMLElement>('.pf-card')
  
  gsap.to(header, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', delay: 0.2 })
  
  gsap.to(catHeaders, {
    opacity: 1,
    y: 0,
    duration: 0.6,
    stagger: 0.04,
    ease: 'power2.out',
    delay: 0.3
  })
  
  gsap.to(cards, {
    opacity: 1,
    y: 0,
    duration: 0.6,
    stagger: 0.03,
    ease: 'power2.out',
    delay: 0.4
  })
}

// ── Scrolling coordination ────────────────────────────────────
function scrollToCategory(slug: string, immediate = false) {
  const targetId = `#category-section-${slug}`
  const targetEl = document.querySelector(targetId)
  if (!targetEl) return

  setTimeout(() => {
    if (lenis.value) {
      lenis.value.scrollTo(targetEl as HTMLElement, {
        offset: -120,
        duration: immediate ? 0 : 1.2,
        immediate: immediate
      })
    } else {
      const top = targetEl.getBoundingClientRect().top + window.scrollY - 120
      window.scrollTo({
        top,
        behavior: immediate ? 'auto' : 'smooth'
      })
    }
  }, 120)
}

watch(() => props.introComplete, (val) => {
  if (props.isMobile) return
  const section = gridSectionRef.value
  if (!section) return

  if (val) {
    revealGrid(section)
  } else {
    resetGrid(section)
  }
})

watch(() => route.query.category, (newCat) => {
  if (newCat) {
    scrollToCategory(newCat as string)
  }
})

onMounted(() => {
  if (props.isMobile) {
    const category = route.query.category as string
    if (category) {
      scrollToCategory(category, true)
    }
    return
  }

  const section = gridSectionRef.value
  if (!section) return
  const header  = section.querySelector<HTMLElement>('.portfolio-header')
  gsap.set(header, { opacity: 0, y: 28 })

  if (props.introComplete) {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        revealGrid(section)
        const category = route.query.category as string
        if (category) {
          scrollToCategory(category)
        }
      })
    })
  }
})

onUnmounted(() => {
  if (gridSectionRef.value) resetGrid(gridSectionRef.value)
})
</script>

<style scoped>
/* Portfolio List Grid section styling */
/* ══════════════════════════════════════════════
   PORTFOLIO GRID SECTION
   ...
*/
.portfolio-grid-section {
  position: relative;
  z-index: 3;
  background: #060810;
  padding: 100px 0 120px;
  overflow: hidden;
}
/* Subtle grid lines */
.portfolio-grid-section::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background-image:
    linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px);
  background-size: 52px 52px;
  mask-image: radial-gradient(ellipse 85% 75% at 50% 30%, #000 45%, transparent 100%);
  -webkit-mask-image: radial-gradient(ellipse 85% 75% at 50% 30%, #000 45%, transparent 100%);
}

/* ── 2-phase reveal: initial hidden state ── */
.portfolio-header,
.category-header,
.pf-card {
  opacity: 0;
  transform: translateY(24px);
}

/* Mobile grid always visible */
.mobile-only .portfolio-header,
.mobile-only .category-header,
.mobile-only .pf-card-mobile,
.mobile-only .pf-card {
  opacity: 1 !important;
  transform: none !important;
}

.section-inner {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 48px;
  position: relative;
  z-index: 1;
}

/* ── Header ── */
.portfolio-header {
  margin-bottom: 64px;
  max-width: 720px;
}
.pf-header-top {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}
.pf-project-count {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1.5px;
  color: rgba(255,255,255,0.62);
  text-transform: uppercase;
  border: 1px solid rgba(255,255,255,0.15);
  padding: 3px 10px;
  border-radius: 40px;
}
.block-title {
  font-size: clamp(36px, 5vw, 62px);
  font-weight: 800;
  color: #fff;
  line-height: 1.1;
  letter-spacing: -0.02em;
  margin-bottom: 18px;
}
.block-title em {
  font-style: italic;
  font-weight: 300;
  color: rgba(255,255,255,0.45);
}
.block-title em.em-th {
  font-style: normal;
  font-weight: 400;
  color: rgba(255,255,255,0.55);
}
.portfolio-desc {
  font-size: 15px;
  line-height: 1.75;
  color: rgba(255,255,255,0.60);
  max-width: 540px;
}

/* ── Category Sections ────────────────────────── */
.category-sections {
  display: flex;
  flex-direction: column;
  gap: 80px;
  margin-top: 60px;
}

.category-group {
  position: relative;
  scroll-margin-top: 140px;
}

.category-header {
  border-left: 2px solid rgba(255, 255, 255, 0.08);
  padding-left: 24px;
  margin-bottom: 32px;
  max-width: 800px;
  transition: border-color 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.category-group:hover .category-header {
  border-left-color: #316395;
}

.cat-header-top {
  display: flex;
  align-items: baseline;
  gap: 12px;
  margin-bottom: 6px;
}

.cat-num {
  font-size: 14px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.3);
  font-family: monospace;
}

.cat-title {
  font-size: clamp(20px, 2.2vw, 26px);
  font-weight: 700;
  color: #fff;
  letter-spacing: -0.3px;
}

.cat-desc {
  font-size: 13.5px;
  color: rgba(255, 255, 255, 0.62);
  line-height: 1.6;
}

/* ── Grid ── */
.pf-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

/* ── Card ── */
.pf-card, .pf-card-mobile {
  border-radius: 12px;
  overflow: hidden;
  background: rgba(255,255,255,0.035);
  border: 1px solid rgba(255,255,255,0.07);
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1),
              box-shadow  0.4s cubic-bezier(0.16, 1, 0.3, 1),
              border-color 0.4s,
              background  0.4s;
  cursor: pointer;
  text-decoration: none;
}
.pf-card:hover {
  transform: translateY(-6px);
  background: rgba(255,255,255,0.06);
  border-color: rgba(255,255,255,0.14);
  box-shadow: 0 24px 60px rgba(0,0,0,0.55),
              0 0 0 1px rgba(49,99,149, 0.20);
}

/* ── Thumbnail ── */
.pf-visual {
  position: relative;
  height: 210px;
  overflow: hidden;
  background: #0d1020;
}
.pf-visual--img {
  background-size: cover;
  background-position: center top;
  transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}
.pf-card:hover .pf-visual--img {
  transform: scale(1.06);
}
/* Gradient scrim bottom */
.pf-visual--img::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    transparent 40%,
    rgba(6,8,16,0.75) 100%
  );
  z-index: 1;
}

/* Placeholder grid for no-image cards */
.pf-visual-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px);
  background-size: 28px 28px;
}
.pf-visual-icon {
  position: relative;
  z-index: 2;
  opacity: 0.18;
  color: #fff;
  transform: scale(3);
}

/* ── Project index number ── */
.pf-index {
  position: absolute;
  top: 14px;
  left: 16px;
  z-index: 4;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 2px;
  color: rgba(255,255,255,0.5);
  font-variant-numeric: tabular-nums;
}

/* ── Budget chip ── */
.pf-visual-budget {
  position: absolute;
  bottom: 14px;
  right: 14px;
  z-index: 4;
  font-size: 11.5px;
  font-weight: 700;
  color: #fff;
  background: rgba(0,0,0,0.55);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255,255,255,0.15);
  padding: 5px 12px;
  border-radius: 40px;
  letter-spacing: 0.3px;
}

/* ── Hover overlay ── */
.pf-hover-overlay {
  position: absolute;
  inset: 0;
  z-index: 3;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 18px 18px 14px;
  background: linear-gradient(to top, rgba(6,8,16,0.9) 0%, rgba(6,8,16,0.4) 50%, transparent 100%);
  opacity: 0;
  transition: opacity 0.38s ease;
}
.pf-card:hover .pf-hover-overlay {
  opacity: 1;
}
.pf-overlay-title {
  font-size: 12.5px;
  font-weight: 600;
  color: rgba(255,255,255,0.88);
  line-height: 1.55;
  margin-bottom: 10px;
}

/* ── Tags ── */
.pf-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}
.pf-tags span {
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 0.5px;
  padding: 3px 9px;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: rgba(255, 255, 255, 0.8);
  background: rgba(255, 255, 255, 0.05);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
  text-transform: uppercase;
  will-change: transform, box-shadow;
  transition:
    transform 0.4s cubic-bezier(0.16, 1, 0.3, 1),
    color 0.4s cubic-bezier(0.16, 1, 0.3, 1),
    border-color 0.4s cubic-bezier(0.16, 1, 0.3, 1),
    box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.pf-tags span:hover {
  transform: translateY(-1.5px) scale(1.03);
  color: #ffffff;
  border-color: rgba(255, 255, 255, 0.28);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

/* ── Info row ── */
.pf-info {
  padding: 18px 20px 18px;
  display: flex;
  align-items: center;
  gap: 12px;
}
.pf-info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}
.pf-info-text {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}
.pf-client-name {
  font-size: 14.5px;
  font-weight: 700;
  color: #fff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.pf-type-chip {
  font-size: 9.5px;
  font-weight: 700;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  padding: 3px 9px;
  border-radius: 4px;
  border: 1px solid;
  white-space: nowrap;
  flex-shrink: 0;
}
.pf-arrow-btn {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: 1px solid rgba(255,255,255,0.12);
  background: rgba(255,255,255,0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255,255,255,0.6);
  flex-shrink: 0;
  transition: background 0.25s, border-color 0.25s, color 0.25s, transform 0.3s cubic-bezier(0.16,1,0.3,1);
}
.pf-arrow-btn svg {
  width: 15px;
  height: 15px;
}
.pf-card:hover .pf-arrow-btn {
  background: var(--accent);
  border-color: var(--accent);
  color: #fff;
  transform: translate(2px, -2px);
}

/* Mobile responsive styles */
.portfolio-grid-section.mobile-only {
  padding-top: 80px;
}

@media (max-width: 1100px) {
  .pf-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .section-inner {
    padding: 0 24px;
  }

  /* Wrapper holds both the track and the floating arrows */
  .pf-cat-scroll-wrap {
    position: relative;
  }

  /* Mobile: each category gets a horizontal swipe track */
  .mobile-only .pf-track-mobile {
    display: flex;
    gap: 14px;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scroll-padding-left: 20px;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    /* Bleed past section-inner padding */
    margin-left: -24px;
    margin-right: -24px;
    padding: 4px 16px 20px 20px;
  }
  .mobile-only .pf-track-mobile::-webkit-scrollbar { display: none; }

  .mobile-only .pf-card-mobile {
    flex: 0 0 76vw;
    max-width: 300px;
    scroll-snap-align: start;
    text-decoration: none;
    color: inherit;
    display: flex;
    flex-direction: column;
  }

  .mobile-only .pf-visual--mobile {
    height: 160px;
  }

  .mobile-only .pf-info--mobile {
    padding: 14px 16px 18px;
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }

  /* Floating prev/next arrows */
  .pf-scroll-btn {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: rgba(6, 9, 18, 0.72);
    border: 1.5px solid rgba(255, 255, 255, 0.22);
    color: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 10;
    transition: background 0.2s, border-color 0.2s, opacity 0.2s;
  }
  .pf-scroll-btn:hover:not(:disabled) {
    background: rgba(49, 99, 149, 0.55);
    border-color: rgba(49, 99, 149, 0.7);
  }
  .pf-scroll-btn:disabled {
    opacity: 0.18;
    cursor: default;
  }
  /* Position: arrows sit just inside the negative-margin bleed zone */
  .pf-scroll-btn--prev { left: -16px; }
  .pf-scroll-btn--next { right: -16px; }

  .pf-type-label {
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 0.6px;
    text-transform: uppercase;
    color: var(--accent, #38bdf8);
    order: -1;
  }

  .pf-project-title {
    font-size: 13px;
    font-weight: 700;
    color: rgba(255,255,255,0.9);
    line-height: 1.4;
  }
}
</style>
