<template>
  <section class="portfolio-mobile">
    <div class="pf-glow"></div>
    <div class="section-inner">

      <div class="pf-header">
        <div class="pf-header-text">
          <p class="eyebrow pf-eyebrow" data-reveal>{{ t('home.portfolioSub') }}</p>
          <h2 class="block-title pf-heading" data-reveal data-delay="1">{{ t('home.portfolioTitle') }}</h2>
        </div>
        <RouterLink to="/portfolio" class="pf-view-all" data-reveal data-delay="2">
          {{ locale === 'th' ? 'ดูโครงการทั้งหมด' : 'View All Projects' }} <span class="pf-arrow">→</span>
        </RouterLink>
      </div>

    </div>

    <!-- Horizontal scroll track — bleeds past section-inner padding -->
    <div class="pf-track" ref="trackRef" @scroll.passive="onScroll">
      <RouterLink
        v-for="p in featuredProjects"
        :key="p.title"
        :to="`/portfolio/${p.slug}`"
        class="pf-card"
        :style="{ '--accent': p.color }"
      >
        <div class="pf-visual" :style="{ backgroundImage: `url(${p.img})` }">
          <span class="pf-budget" v-if="p.budget">{{ formatBudget(p.budget, locale === 'en') }}</span>
          <span class="pf-type">{{ p.type }}</span>
          <div class="pf-visual-grad"></div>
        </div>

        <div class="pf-info">
          <p class="pf-client">{{ locale === 'en' ? p.clientEn : p.client }}</p>
          <p class="pf-title">{{ locale === 'en' ? p.titleEn : p.title }}</p>
          <div class="pf-tags">
            <span v-for="tag in p.tags.slice(0, 3)" :key="tag">{{ tag }}</span>
          </div>
        </div>
      </RouterLink>
    </div>

    <!-- Controls: prev / dots / next -->
    <div class="pf-controls">
      <button
        class="pf-nav-btn"
        :disabled="activeIndex === 0"
        @click="scrollTo(activeIndex - 1)"
        aria-label="Previous"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="16" height="16">
          <path d="M15 18l-6-6 6-6"/>
        </svg>
      </button>

      <div class="pf-dots">
        <span
          v-for="(_, i) in featuredProjects"
          :key="i"
          class="pf-dot"
          :class="{ active: activeIndex === i }"
          @click="scrollTo(i)"
        ></span>
      </div>

      <button
        class="pf-nav-btn"
        :disabled="activeIndex === featuredProjects.length - 1"
        @click="scrollTo(activeIndex + 1)"
        aria-label="Next"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="16" height="16">
          <path d="M9 18l6-6-6-6"/>
        </svg>
      </button>
    </div>

  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useLocale } from '../../../composables/useLocale'
import { featuredProjects as allFeatured, formatBudget } from '../../../data/portfolioData'

const { locale, t } = useLocale()
const trackRef   = ref<HTMLElement | null>(null)
const activeIndex = ref(0)

const featuredProjects = allFeatured.filter(p => p.img)

function onScroll() {
  if (!trackRef.value) return
  const el    = trackRef.value
  const cardW = el.scrollWidth / featuredProjects.length
  activeIndex.value = Math.round(el.scrollLeft / cardW)
}

function scrollTo(index: number) {
  if (!trackRef.value) return
  const cardW = trackRef.value.scrollWidth / featuredProjects.length
  trackRef.value.scrollTo({ left: cardW * index, behavior: 'smooth' })
}
</script>

<style scoped>
.portfolio-mobile {
  padding: 60px 0 40px;
  background: #060810;
  position: relative;
  overflow: hidden;
}

.portfolio-mobile::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
  background-size: 40px 40px;
  pointer-events: none;
  z-index: 0;
}

.pf-glow {
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 280px;
  height: 280px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(56,189,248,0.12) 0%, transparent 70%);
  pointer-events: none;
}

/* ── Header ─────────────────────────────── */
.pf-header {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 15px;
  margin-bottom: 2rem;
  position: relative;
  z-index: 1;
}

.pf-eyebrow { color: var(--primary) !important; margin-bottom: 0.25rem; }
.pf-heading { color: #fff; font-size: 28px; }

.pf-view-all {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12.5px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.7);
  border: 1.5px solid rgba(255, 255, 255, 0.15);
  padding: 8px 18px;
  border-radius: 50px;
  background: rgba(255, 255, 255, 0.02);
}

/* ── Horizontal scroll track ────────────── */
.pf-track {
  display: flex;
  gap: 14px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-padding-left: 20px;
  -webkit-overflow-scrolling: touch;
  padding: 4px 16px 20px 20px;
  scrollbar-width: none;
  position: relative;
  z-index: 1;
}
.pf-track::-webkit-scrollbar { display: none; }

/* ── Card ───────────────────────────────── */
.pf-card {
  flex: 0 0 76vw;
  max-width: 300px;
  scroll-snap-align: start;
  border-radius: 14px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-top: 3px solid var(--accent);
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.45);
  text-decoration: none;
  display: flex;
  flex-direction: column;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}
.pf-card:active { transform: scale(0.97); }

.pf-visual {
  height: 190px;
  background-size: cover;
  background-position: center;
  position: relative;
  flex-shrink: 0;
}

.pf-visual-grad {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, transparent 40%, rgba(6,8,16,0.85) 100%);
}

.pf-budget {
  position: absolute;
  bottom: 12px;
  right: 12px;
  font-size: 11px;
  font-weight: 700;
  color: #fff;
  background: rgba(0,0,0,0.55);
  padding: 3px 9px;
  border-radius: 20px;
  backdrop-filter: blur(4px);
  z-index: 2;
}

.pf-type {
  position: absolute;
  top: 12px;
  left: 12px;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: #fff;
  background: var(--accent);
  padding: 3px 9px;
  border-radius: 4px;
  z-index: 2;
}

.pf-info {
  padding: 16px 18px 20px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
}

.pf-client {
  font-size: 11.5px;
  font-weight: 700;
  color: var(--accent);
  text-transform: uppercase;
  letter-spacing: 0.4px;
}

.pf-title {
  font-size: 14px;
  font-weight: 700;
  color: #fff;
  line-height: 1.4;
}

.pf-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-top: 4px;
}
.pf-tags span {
  font-size: 9.5px;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 6px;
  border: 1px solid rgba(255,255,255,0.12);
  color: rgba(255,255,255,0.7);
  background: rgba(255,255,255,0.05);
}

/* ── Controls row ───────────────────────── */
.pf-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 12px 0 8px;
  position: relative;
  z-index: 1;
}

.pf-nav-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1.5px solid rgba(255,255,255,0.18);
  background: rgba(255,255,255,0.06);
  color: rgba(255,255,255,0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s, border-color 0.2s, color 0.2s, opacity 0.2s;
  flex-shrink: 0;
}
.pf-nav-btn:hover:not(:disabled) {
  background: rgba(56,189,248,0.15);
  border-color: rgba(56,189,248,0.5);
  color: #38bdf8;
}
.pf-nav-btn:disabled {
  opacity: 0.25;
  cursor: default;
}

/* ── Dots ───────────────────────────────── */
.pf-dots {
  display: flex;
  align-items: center;
  gap: 6px;
}
.pf-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgba(255,255,255,0.2);
  cursor: pointer;
  transition: background 0.25s, transform 0.25s, width 0.25s;
}
.pf-dot.active {
  background: var(--accent, #38bdf8);
  width: 18px;
  border-radius: 3px;
}

/* Entrance reveal */
.portfolio-mobile [data-reveal] {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.6s cubic-bezier(0.16,1,0.3,1), transform 0.6s cubic-bezier(0.16,1,0.3,1);
}
.portfolio-mobile [data-reveal].is-revealed {
  opacity: 1;
  transform: translateY(0);
}
</style>
