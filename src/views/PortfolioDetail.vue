<template>
  <div class="pd-detail-root">
  <div class="pd-page" v-if="project">
    <!-- Header -->
    <div class="pd-header" :style="project.img ? { '--hero-img': `url(${project.img})` } : {}">
      <div class="pd-header-bg" :class="{ 'has-img': project.img }"
           :style="!project.img ? { background: `linear-gradient(135deg, ${project.color}cc 0%, ${project.color}55 60%, #060812 100%)` } : {}">
      </div>
      <div class="pd-header-content">
        <RouterLink to="/portfolio?grid=1" class="pd-back">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M13 8H3M7 4l-4 4 4 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
          Portfolio
        </RouterLink>
        <p class="pd-eyebrow">{{ project.type }}</p>
        <h1 class="pd-title">{{ isEN ? project.titleEn : project.title }}</h1>
        <div class="pd-meta-row">
          <span class="pd-client-badge">{{ isEN ? project.clientEn : project.client }}</span>
          <span v-if="project.budget" class="pd-budget">{{ formatBudget(project.budget, isEN) }}</span>
          <span v-if="project.year" class="pd-year">{{ project.year }}</span>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="pd-body">
      <div class="section-inner">
        <div class="pd-grid">
          <!-- Left: main content -->
          <div class="pd-main">
            <div class="pd-section" v-if="project.desc">
              <h2 class="pd-section-title">{{ t('pd.about') }}</h2>
              <p class="pd-desc">{{ isEN ? (project.descEn || project.desc) : project.desc }}</p>
            </div>

            <div class="pd-section" v-if="project.features?.length">
              <h2 class="pd-section-title">{{ t('pd.features') }}</h2>
              <ul class="pd-features">
                <li v-for="feat in (isEN ? (project.featuresEn || project.features) : project.features)" :key="feat">
                  <span class="pd-feat-dot" :style="{ background: project.color }"></span>
                  {{ feat }}
                </li>
              </ul>
            </div>

            <div class="pd-section">
              <h2 class="pd-section-title">{{ t('pd.tech') }}</h2>
              <div class="pd-tags">
                <span v-for="tag in project.tags" :key="tag"
                      :style="{ color: project.color, borderColor: project.color + '55', background: project.color + '18' }">
                  {{ tag }}
                </span>
              </div>
            </div>

            <!-- Gallery -->
            <div class="pd-section" v-if="project.gallery?.length">
              <h2 class="pd-section-title">{{ t('pd.gallery') }}</h2>
              <p class="pd-gallery-hint">{{ t('pd.galleryHint') }}</p>
              <div class="pd-gallery">
                <button
                  v-for="(img, idx) in visibleThumbs"
                  :key="img"
                  class="pd-gallery-item"
                  :style="{ '--accent': project.color }"
                  @click="openLightbox(idx)"
                  :aria-label="`View image ${idx + 1}`"
                >
                  <img :src="img" :alt="`${project.title} — ${idx + 1}`" loading="lazy" />
                  <!-- Last thumb shows +N overlay when there are more images -->
                  <span v-if="idx === MAX_THUMBS - 1 && remainingCount > 0" class="pd-gallery-more">
                    +{{ remainingCount }}
                  </span>
                  <span v-else class="pd-gallery-zoom">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/>
                    </svg>
                  </span>
                </button>
              </div>
            </div>

            <RouterLink to="/portfolio?grid=1" class="pd-back-bottom">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M13 8H3M7 4l-4 4 4 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
              {{ t('pd.back') }}
            </RouterLink>
          </div>

          <!-- Right: project card -->
          <aside class="pd-sidebar">
            <div class="pd-info-card">
              <div class="pd-info-header" :style="{ background: project.color + '22', borderColor: project.color + '44' }">
                <span class="pd-info-type" :style="{ color: project.color }">{{ project.type }}</span>
              </div>
              <dl class="pd-info-list">
                <div class="pd-info-item">
                  <dt>{{ t('pd.client') }}</dt>
                  <dd>{{ isEN ? project.clientEn : project.client }}</dd>
                </div>
                <div class="pd-info-item" v-if="project.budget">
                  <dt>{{ t('pd.budget') }}</dt>
                  <dd class="pd-info-budget" :style="{ color: project.color }">{{ formatBudget(project.budget, isEN) }}</dd>
                </div>
                <div class="pd-info-item" v-if="project.year">
                  <dt>{{ t('pd.duration') }}</dt>
                  <dd>{{ yearEN(project.year) }}</dd>
                </div>
                <div class="pd-info-item">
                  <dt>{{ t('pd.type') }}</dt>
                  <dd>{{ project.category === 'gis' ? 'GIS / Spatial' : project.category === 'edoc' ? 'E-Document' : 'Web Application' }}</dd>
                </div>
              </dl>
              <RouterLink to="/contact" class="pd-contact-btn">
                {{ t('pd.contact') }}
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </RouterLink>
            </div>

            <!-- Other projects -->
            <div class="pd-others">
              <p class="pd-others-label">{{ t('pd.others') }}</p>
              <RouterLink
                v-for="p in otherProjects"
                :key="p.slug"
                :to="`/portfolio/${p.slug}`"
                class="pd-other-item"
              >
                <div class="pd-other-dot" :style="{ background: p.color }"></div>
                <div>
                  <p class="pd-other-client">{{ isEN ? p.clientEn : p.client }}</p>
                  <p class="pd-other-title">{{ isEN ? p.titleEn : p.title }}</p>
                </div>
              </RouterLink>
            </div>
          </aside>
        </div>
      </div>
    </div>
  </div>

  <!-- 404 -->
  <div v-else class="pd-not-found">
    <p>{{ t('pd.notFound') }}</p>
    <RouterLink to="/portfolio?grid=1">← {{ t('pd.back') }}</RouterLink>
  </div>

  <!-- Lightbox -->
  <Teleport to="body">
    <transition name="lb-fade">
      <div v-if="lightboxOpen && galleryImgs.length" class="lb-overlay" @click="closeLightbox">
        <button class="lb-close" aria-label="Close" @click="closeLightbox">&times;</button>

        <button v-if="galleryImgs.length > 1" class="lb-nav lb-nav--prev" aria-label="Previous" @click.stop="prevImg">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
        </button>

        <div class="lb-stage" @click.stop>
          <img :src="galleryImgs[lightboxIndex]" :alt="`Image ${lightboxIndex + 1}`" class="lb-img" />
          <div class="lb-counter">{{ lightboxIndex + 1 }} / {{ galleryImgs.length }}</div>

          <!-- Thumbnail strip -->
          <div v-if="galleryImgs.length > 1" class="lb-strip">
            <button
              v-for="(img, i) in galleryImgs"
              :key="img"
              class="lb-thumb"
              :class="{ 'is-active': i === lightboxIndex }"
              @click.stop="lightboxIndex = i"
              :aria-label="`Go to image ${i + 1}`"
            >
              <img :src="img" :alt="`Thumbnail ${i + 1}`" loading="lazy" />
            </button>
          </div>
        </div>

        <button v-if="galleryImgs.length > 1" class="lb-nav lb-nav--next" aria-label="Next" @click.stop="nextImg">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>
        </button>
      </div>
    </transition>
  </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { projects, formatBudget } from '../data/portfolioData'
import { useLocale } from '../composables/useLocale'

const { t, locale } = useLocale()
const route = useRoute()
const project = computed(() => projects.find(p => p.slug === route.params.slug))
const otherProjects = computed(() => projects.filter(p => p.slug !== route.params.slug).slice(0, 4))

const isEN = computed(() => locale.value === 'en')

function yearEN(year?: string) {
  if (!year || !isEN.value) return year
  return year.replace(/\d{4}/g, y => String(parseInt(y) - 543))
}

// ── Gallery ───────────────────────────────────────────
const MAX_THUMBS    = 4
const galleryImgs   = computed(() => project.value?.gallery ?? [])
const visibleThumbs = computed(() => galleryImgs.value.slice(0, MAX_THUMBS))
const remainingCount = computed(() => Math.max(0, galleryImgs.value.length - MAX_THUMBS))

// ── Lightbox ──────────────────────────────────────────
const lightboxOpen  = ref(false)
const lightboxIndex = ref(0)

function openLightbox(idx: number) {
  lightboxIndex.value = idx
  lightboxOpen.value = true
}
function closeLightbox() { lightboxOpen.value = false }
function nextImg() { lightboxIndex.value = (lightboxIndex.value + 1) % galleryImgs.value.length }
function prevImg() { lightboxIndex.value = (lightboxIndex.value - 1 + galleryImgs.value.length) % galleryImgs.value.length }

watch(lightboxOpen, (val) => { document.body.style.overflow = val ? 'hidden' : '' })

function onKeyDown(e: KeyboardEvent) {
  if (!lightboxOpen.value) return
  if (e.key === 'Escape') closeLightbox()
  else if (e.key === 'ArrowRight') nextImg()
  else if (e.key === 'ArrowLeft') prevImg()
}
onMounted(() => window.addEventListener('keydown', onKeyDown))
onUnmounted(() => {
  window.removeEventListener('keydown', onKeyDown)
  document.body.style.overflow = ''
})
</script>

<style scoped>
.pd-page {
  background: #060812;
  min-height: 100vh;
  color: #fff;
}

/* ── Header ─────────────────────────────────────────── */
.pd-header {
  position: relative;
  min-height: 460px;
  display: flex;
  align-items: flex-end;
  overflow: hidden;
}

.pd-header-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
}
.pd-header-bg.has-img {
  background-image: var(--hero-img, none);
  background-size: cover;
  background-position: center;
}
.pd-header-bg.has-img::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, #060812 0%, rgba(6,8,18,0.65) 50%, rgba(6,8,18,0.25) 100%);
}
.pd-header-bg::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse 60% 80% at 80% 50%, rgba(255,255,255,0.04) 0%, transparent 65%);
}

.pd-header-content {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: clamp(100px, 12vw, 140px) clamp(24px, 5vw, 72px) 56px;
}

.pd-back {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: rgba(255,255,255,0.62);
  text-decoration: none;
  margin-bottom: 2rem;
  transition: color 0.2s;
}
.pd-back:hover { color: #fff; }

.pd-eyebrow {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: rgba(255,255,255,0.5);
  margin-bottom: 0.75rem;
  animation: fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) both;
}

.pd-title {
  font-size: clamp(22px, 3.2vw, 46px);
  font-weight: 800;
  line-height: 1.2;
  letter-spacing: -0.02em;
  color: #fff;
  margin-bottom: 1.5rem;
  max-width: 780px;
  animation: fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.08s both;
}

.pd-meta-row {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  animation: fadeUp 0.65s cubic-bezier(0.16,1,0.3,1) 0.16s both;
}

.pd-client-badge {
  font-size: 12px;
  font-weight: 600;
  padding: 5px 14px;
  border-radius: 50px;
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.18);
  color: #fff;
}
.pd-budget, .pd-year {
  font-size: 12px;
  font-weight: 600;
  color: rgba(255,255,255,0.55);
  padding: 5px 14px;
  border-radius: 50px;
  border: 1px solid rgba(255,255,255,0.1);
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: none; }
}

/* ── Body ────────────────────────────────────────────── */
.pd-body {
  padding: 72px 0 120px;
}

.pd-grid {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 64px;
  align-items: start;
}

/* Main */
.pd-main { display: flex; flex-direction: column; gap: 48px; }

.pd-section-title {
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: rgba(255,255,255,0.6);
  margin-bottom: 1.25rem;
}

.pd-desc {
  font-size: 16px;
  line-height: 1.9;
  color: rgba(255,255,255,0.75);
  max-width: 640px;
}

.pd-features {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.pd-features li {
  display: flex;
  align-items: center;
  gap: 14px;
  font-size: 15px;
  color: rgba(255,255,255,0.72);
  line-height: 1.6;
}
.pd-feat-dot {
  width: 8px; height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
  opacity: 0.85;
}

.pd-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.pd-tags span {
  font-size: 12px;
  font-weight: 600;
  padding: 5px 14px;
  border-radius: 50px;
  border: 1px solid;
}

.pd-back-bottom {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 600;
  color: rgba(255,255,255,0.62);
  text-decoration: none;
  transition: color 0.2s;
  margin-top: 8px;
}
.pd-back-bottom:hover { color: #fff; }

/* Sidebar */
.pd-sidebar { display: flex; flex-direction: column; gap: 24px; }

.pd-info-card {
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.09);
  border-radius: 18px;
  overflow: hidden;
}

.pd-info-header {
  padding: 16px 24px;
  border-bottom: 1px solid;
}
.pd-info-type {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
}

.pd-info-list {
  padding: 8px 0;
}
.pd-info-item {
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding: 14px 24px;
  border-bottom: 1px solid rgba(255,255,255,0.05);
}
.pd-info-item:last-child { border-bottom: none; }
.pd-info-item dt {
  font-size: 10.5px;
  font-weight: 600;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: rgba(255,255,255,0.55);
}
.pd-info-item dd {
  font-size: 14px;
  font-weight: 600;
  color: rgba(255,255,255,0.85);
  margin: 0;
}
.pd-info-budget { font-weight: 800 !important; font-size: 16px !important; }

.pd-contact-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin: 16px;
  padding: 12px;
  background: rgba(49,99,149,0.25);
  border: 1px solid rgba(49,99,149,0.4);
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  color: var(--accent, #38bdf8);
  text-decoration: none;
  transition: background 0.2s, border-color 0.2s;
}
.pd-contact-btn:hover {
  background: rgba(49,99,149,0.4);
  border-color: rgba(56,189,248,0.5);
}

/* Other projects */
.pd-others { display: flex; flex-direction: column; gap: 2px; }
.pd-others-label {
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: rgba(255,255,255,0.55);
  margin-bottom: 10px;
  padding: 0 4px;
}

.pd-other-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
  border-radius: 10px;
  text-decoration: none;
  transition: background 0.2s;
}
.pd-other-item:hover { background: rgba(255,255,255,0.05); }

.pd-other-dot {
  width: 8px; height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
  margin-top: 5px;
}
.pd-other-client {
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: rgba(255,255,255,0.55);
  margin-bottom: 2px;
}
.pd-other-title {
  font-size: 12.5px;
  font-weight: 600;
  color: rgba(255,255,255,0.65);
  line-height: 1.45;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* ── Gallery ─────────────────────────────────────────── */
.pd-gallery-hint {
  font-size: 13px;
  color: rgba(255,255,255,0.6);
  margin: -0.5rem 0 1.5rem;
}
.pd-gallery {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
}
.pd-gallery-item {
  position: relative;
  aspect-ratio: 16 / 10;
  border: none;
  padding: 0;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  background: rgba(255,255,255,0.04);
  outline: 1px solid rgba(255,255,255,0.07);
  outline-offset: -1px;
  transition: outline-color 0.25s, transform 0.35s cubic-bezier(0.16,1,0.3,1);
}
.pd-gallery-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.5s cubic-bezier(0.16,1,0.3,1), filter 0.3s;
  filter: brightness(0.92);
}
.pd-gallery-item:hover {
  outline-color: var(--accent, #38bdf8);
  transform: translateY(-3px);
}
.pd-gallery-item:hover img {
  transform: scale(1.06);
  filter: brightness(1);
}
.pd-gallery-zoom {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  background: rgba(6,8,18,0.35);
  opacity: 0;
  transition: opacity 0.25s;
}
.pd-gallery-item:hover .pd-gallery-zoom { opacity: 1; }
.pd-gallery-zoom svg {
  background: rgba(0,0,0,0.4);
  border-radius: 50%;
  padding: 10px;
  width: 44px;
  height: 44px;
  backdrop-filter: blur(4px);
}
.pd-gallery-item:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }

/* "+N" overlay on last visible thumb */
.pd-gallery-more {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  font-weight: 800;
  letter-spacing: -0.5px;
  color: #fff;
  background: rgba(6,8,18,0.62);
  backdrop-filter: blur(1px);
  transition: background 0.25s;
}
.pd-gallery-item:hover .pd-gallery-more { background: rgba(6,8,18,0.48); }

/* ── Lightbox ────────────────────────────────────────── */
.lb-overlay {
  position: fixed;
  inset: 0;
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(4,6,14,0.92);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  padding: 24px;
}
.lb-stage {
  position: relative;
  max-width: min(1100px, 92vw);
  max-height: 86vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.lb-img {
  max-width: 100%;
  max-height: 82vh;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 30px 90px rgba(0,0,0,0.6);
  animation: lbZoom 0.35s cubic-bezier(0.16,1,0.3,1);
}
@keyframes lbZoom {
  from { opacity: 0; transform: scale(0.96); }
  to   { opacity: 1; transform: scale(1); }
}
.lb-counter {
  margin-top: 14px;
  font-size: 12.5px;
  font-weight: 600;
  letter-spacing: 1px;
  color: rgba(255,255,255,0.6);
}

/* Thumbnail strip */
.lb-strip {
  display: flex;
  gap: 10px;
  margin-top: 16px;
  max-width: 100%;
  overflow-x: auto;
  padding: 4px 2px;
  scrollbar-width: thin;
  scrollbar-color: rgba(255,255,255,0.2) transparent;
}
.lb-strip::-webkit-scrollbar { height: 6px; }
.lb-strip::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 3px; }
.lb-thumb {
  flex: 0 0 auto;
  width: 84px;
  height: 56px;
  border: none;
  padding: 0;
  border-radius: 7px;
  overflow: hidden;
  cursor: pointer;
  opacity: 0.5;
  outline: 2px solid transparent;
  outline-offset: -2px;
  transition: opacity 0.2s, outline-color 0.2s;
}
.lb-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }
.lb-thumb:hover { opacity: 0.85; }
.lb-thumb.is-active {
  opacity: 1;
  outline-color: #38bdf8;
}
.lb-close {
  position: fixed;
  top: 24px;
  right: 28px;
  width: 44px;
  height: 44px;
  border: none;
  border-radius: 50%;
  background: rgba(255,255,255,0.08);
  color: #fff;
  font-size: 26px;
  line-height: 1;
  cursor: pointer;
  transition: background 0.2s;
}
.lb-close:hover { background: rgba(255,255,255,0.18); }
.lb-nav {
  position: fixed;
  top: 50%;
  transform: translateY(-50%);
  width: 52px;
  height: 52px;
  border: none;
  border-radius: 50%;
  background: rgba(255,255,255,0.08);
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}
.lb-nav:hover { background: rgba(255,255,255,0.2); }
.lb-nav--prev { left: 28px; }
.lb-nav--next { right: 28px; }

.lb-fade-enter-active, .lb-fade-leave-active { transition: opacity 0.25s; }
.lb-fade-enter-from, .lb-fade-leave-to { opacity: 0; }

/* Not found */
.pd-not-found {
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  color: rgba(255,255,255,0.5);
  background: #060812;
}
.pd-not-found a { color: var(--accent); text-decoration: none; }

@media (max-width: 900px) {
  .pd-grid { grid-template-columns: 1fr; }
  .pd-sidebar { order: -1; }
}
@media (max-width: 600px) {
  .pd-header { min-height: 380px; }
  .pd-title { font-size: clamp(20px, 5.5vw, 32px); }
  .pd-gallery { grid-template-columns: repeat(2, 1fr); gap: 10px; }
  .lb-nav--prev { left: 12px; }
  .lb-nav--next { right: 12px; }
  .lb-thumb { width: 64px; height: 44px; }
}
</style>
