<template>
  <section class="exp-section">

    <!-- Block 01: Software Development -->
    <div class="exp-block">
      <div class="exp-photo" data-reveal="left">
        <img src="/Service and product 1.png" alt="Software Development" />
        <div class="exp-photo-overlay"></div>
        <span class="exp-photo-label">{{ t('expertise.dev.title').toUpperCase() }}</span>
      </div>
      <div class="exp-body" data-reveal="right">
        <span class="exp-watermark">01</span>
        <div class="exp-body-top">
          <span class="exp-index">01 / 03</span>
          <h3 class="exp-block-title">{{ t('expertise.dev.title') }}</h3>
          <p class="exp-block-sub">{{ t('expertise.dev.sub') }}</p>
        </div>
        <ul class="exp-caps">
          <li v-for="n in 6" :key="n" class="has-link">
            <RouterLink :to="`/portfolio?grid=1&category=${devCategories[n - 1]}`" class="cap-link">
              <span class="cap-n">{{ String(n).padStart(2,'0') }}</span>
              <span class="cap-text" v-html="bold(t(`expertise.dev.${n}`))"></span>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" class="cap-arrow">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </RouterLink>
          </li>
        </ul>
      </div>
    </div>

    <div class="exp-divider"></div>

    <!-- Block 02: Project Management (flipped) -->
    <div class="exp-block">
      <div class="exp-body exp-body--r" data-reveal="left">
        <span class="exp-watermark">02</span>
        <div class="exp-body-top">
          <span class="exp-index">02 / 03</span>
          <h3 class="exp-block-title exp-block-title--purple">{{ t('expertise.pm.title') }}</h3>
          <p class="exp-block-sub exp-block-sub--purple">{{ t('expertise.pm.sub') }}</p>
        </div>
        <ul class="exp-caps">
          <li v-for="n in 3" :key="n">
            <span class="cap-n">{{ String(n).padStart(2,'0') }}</span>
            <span v-html="bold(t(`expertise.pm.${n}`))"></span>
          </li>
        </ul>
      </div>
      <div class="exp-photo" data-reveal="right">
        <img src="/Service and product 2.png" alt="Project Management" />
        <div class="exp-photo-overlay exp-photo-overlay--purple"></div>
        <span class="exp-photo-label">{{ t('expertise.pm.title').toUpperCase() }}</span>
      </div>
    </div>

    <div class="exp-divider"></div>

    <!-- Block 03: Data Services -->
    <div class="exp-block">
      <div class="exp-photo" data-reveal="left">
        <img src="/Service and product 3.png" alt="Data Services" />
        <div class="exp-photo-overlay exp-photo-overlay--green"></div>
        <span class="exp-photo-label">{{ t('expertise.data.title').toUpperCase() }}</span>
      </div>
      <div class="exp-body" data-reveal="right">
        <span class="exp-watermark">03</span>
        <div class="exp-body-top">
          <span class="exp-index">03 / 03</span>
          <h3 class="exp-block-title exp-block-title--green">{{ t('expertise.data.title') }}</h3>
          <p class="exp-block-sub exp-block-sub--green">{{ t('expertise.data.sub') }}</p>
        </div>
        <ul class="exp-caps">
          <li v-for="n in 4" :key="n">
            <span class="cap-n">{{ String(n).padStart(2,'0') }}</span>
            <span v-html="bold(t(`expertise.data.${n}`))"></span>
          </li>
        </ul>
      </div>
    </div>

    <div class="exp-divider"></div>

  </section>
</template>

<script setup lang="ts">
import { useLocale } from '../../composables/useLocale'
const { t } = useLocale()

const devCategories = [
  'workflow',
  'eservice',
  'webservice',
  'apiservice',
  'gis',
  'spatial'
]

const KEYWORDS = [
  'Workflow Management','E-Service','Web Service','API Service',
  'RESTful API','Platform GIS','GIS Platform','Spatial Data Storage',
  'Agile','Waterfall','Hybrid','Data Entry','RESTful',
]
function bold(text: string): string {
  let out = text
  KEYWORDS.forEach(kw => {
    out = out.replace(
      new RegExp(`(${kw.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')})`, 'g'),
      '<b>$1</b>'
    )
  })
  return out
}
</script>

<style scoped>
/* ─── Section shell ─────────────────────────── */
.exp-section {
  background: #060912;
  overflow: hidden;
}

/* ─── Intro ─────────────────────────────────── */
.exp-intro {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 48px;
  align-items: start;
  padding-top: 110px;
  padding-bottom: 72px;
}
.exp-eyebrow {
  display: block;
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: 3.5px;
  text-transform: uppercase;
  color: rgba(255,255,255,0.35);
  padding-top: 6px;
}
.exp-heading {
  font-size: clamp(30px, 3.8vw, 52px);
  font-weight: 800;
  color: #fff;
  line-height: 1.1;
  letter-spacing: -0.8px;
  margin-bottom: 1.25rem;
}
.exp-lead {
  font-size: 15px;
  color: rgba(255,255,255,0.62);
  line-height: 1.85;
  max-width: 520px;
}

/* ─── Divider ────────────────────────────────── */
.exp-divider {
  height: 1px;
  background: rgba(255,255,255,0.07);
  margin: 0;
}

/* ─── Block ──────────────────────────────────── */
.exp-block {
  display: grid;
  grid-template-columns: 50% 50%;
  min-height: 560px;
}
.exp-block--flip {
  direction: rtl;
}
.exp-block--flip > * { direction: ltr; }

/* ─── Photo ──────────────────────────────────── */
.exp-photo {
  position: relative;
  overflow: hidden;
}
.exp-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  display: block;
  transition: transform 0.9s cubic-bezier(0.16,1,0.3,1);
}
.exp-block:hover .exp-photo img {
  transform: scale(1.04);
}
.exp-photo-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    120deg,
    rgba(6,9,18,0.72) 0%,
    rgba(6,9,18,0.30) 60%,
    rgba(6,9,18,0.55) 100%
  );
}
.exp-photo-overlay--purple {
  background: linear-gradient(
    120deg,
    rgba(6,9,18,0.65) 0%,
    rgba(24,12,48,0.38) 55%,
    rgba(6,9,18,0.60) 100%
  );
}
.exp-photo-overlay--green {
  background: linear-gradient(
    120deg,
    rgba(6,9,18,0.70) 0%,
    rgba(6,24,18,0.35) 55%,
    rgba(6,9,18,0.60) 100%
  );
}
.exp-photo-label {
  position: absolute;
  bottom: 28px;
  left: 32px;
  font-size: 9.5px;
  font-weight: 700;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: rgba(255,255,255,0.28);
}

/* ─── Body ───────────────────────────────────── */
.exp-body {
  position: relative;
  padding: 72px 68px 72px 72px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: #060912;
  overflow: hidden;
}
.exp-body--r {
  padding: 72px 72px 72px 68px;
}

/* Watermark number */
.exp-watermark {
  position: absolute;
  bottom: -32px;
  right: -16px;
  font-size: 220px;
  font-weight: 900;
  line-height: 1;
  color: rgba(255,255,255,0.025);
  pointer-events: none;
  user-select: none;
  letter-spacing: -12px;
}

/* Body top */
.exp-body-top { margin-bottom: 2.5rem; }

.exp-index {
  display: block;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 2px;
  color: rgba(255,255,255,0.22);
  margin-bottom: 1.1rem;
}

.exp-block-title {
  font-size: clamp(26px, 2.6vw, 38px);
  font-weight: 800;
  color: #fff;
  line-height: 1.1;
  letter-spacing: -0.5px;
  margin-bottom: 0.5rem;
}
.exp-block-title--purple { color: #fff; }
.exp-block-title--green  { color: #fff; }

.exp-block-sub {
  font-size: 13.5px;
  color: rgba(107,165,214,0.80);
  letter-spacing: 0.3px;
  line-height: 1.5;
}
.exp-block-sub--purple { color: rgba(167,139,250,0.65); }
.exp-block-sub--green  { color: rgba(52,211,153,0.65); }

/* ─── Capabilities list ──────────────────────── */
.exp-caps { list-style: none; }
.exp-caps li {
  border-bottom: 1px solid rgba(255,255,255,0.055);
}
.exp-caps li:first-child { border-top: 1px solid rgba(255,255,255,0.055); }

/* Static items (PM, Data) */
.exp-caps li:not(.has-link) {
  display: flex;
  align-items: baseline;
  gap: 16px;
  padding: 14px 0;
  font-size: 15.5px;
  color: rgba(255,255,255,0.72);
  line-height: 1.5;
  transition: color 0.2s;
}
.exp-caps li:not(.has-link):hover {
  color: rgba(255,255,255,0.88);
}

/* Link items */
.cap-link {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 14px 0;
  font-size: 15.5px;
  color: rgba(255,255,255,0.65);
  line-height: 1.5;
  text-decoration: none;
  width: 100%;
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.cap-text {
  flex-grow: 1;
  transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.cap-arrow {
  opacity: 0.55;
  transform: translateX(0);
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  color: #6ba5d6;
  flex-shrink: 0;
}

/* Hover effects for link items */
.cap-link:hover {
  color: #fff;
  padding-left: 8px;
}

.cap-link:hover .cap-arrow {
  opacity: 1;
  transform: translateX(4px);
}

.cap-n {
  font-size: 9.5px;
  font-weight: 700;
  color: rgba(255,255,255,0.18);
  letter-spacing: 1px;
  flex-shrink: 0;
  width: 20px;
}
.exp-caps li :deep(b) {
  font-weight: 700;
  color: rgba(255,255,255,0.88);
}

/* ─── Responsive ─────────────────────────────── */
@media (max-width: 1024px) {
  .exp-body, .exp-body--r { padding: 56px 40px; }
}
@media (max-width: 768px) {
  .exp-intro {
    grid-template-columns: 1fr;
    gap: 24px;
    padding-top: 72px;
    padding-bottom: 48px;
  }
  .exp-block, .exp-block--flip {
    grid-template-columns: 1fr;
    direction: ltr;
    min-height: auto;
  }
  .exp-photo { height: 220px; order: 1; }
  .exp-body  { order: 2; }
  /* Block 02 has text-first in DOM (desktop flips it visually).
     On mobile, restore image-first order so blocks are consistent
     and we avoid two images stacking back-to-back. */
  .exp-body--r { order: 2; }
  .exp-body, .exp-body--r { padding: 36px 24px 40px; }
  .exp-watermark { font-size: 140px; }
}
</style>
