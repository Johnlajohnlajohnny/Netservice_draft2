<template>
  <section class="services-section">
    <!-- Aurora background layer -->
    <div class="svc-aurora" aria-hidden="true">
      <div class="svc-orb svc-orb--a"></div>
      <div class="svc-orb svc-orb--b"></div>
      <div class="svc-orb svc-orb--c"></div>
    </div>

    <div class="services-wrap">
      <div class="services-sticky">
        <p class="eyebrow">{{ t('home.servicesEye') }}</p>
        <h2 class="block-title">{{ t('home.productsTitle') }}</h2>
        <div class="step-counter">
          <span class="step-num">{{ String(activeProduct + 1).padStart(2, '0') }}</span>
          <span class="step-total">/ 03</span>
        </div>
        <div class="step-bar">
          <div class="step-fill" :style="{ width: ((activeProduct + 1) / 3 * 100) + '%' }"></div>
        </div>
        <div class="step-dots">
          <button v-for="i in 3" :key="i" class="step-dot" :class="{ active: activeProduct === i - 1 }"
            @click="scrollToStep(i - 1)" :aria-label="`Service ${i}`"></button>
        </div>
        <p class="step-label">{{ services[activeProduct].title }}</p>
      </div>

      <div class="services-scroll">
        <div class="svc-track-container" style="position:absolute;inset:0;pointer-events:none;z-index:0;">
          <div class="svc-tracker" v-for="i in services.length" :key="'tracker-' + i" :data-idx="i - 1" style="height:70vh;"></div>
        </div>
        <div class="svc-step" v-for="(svc, idx) in services" :key="idx" :data-idx="idx">
          <div class="svc-card" :class="{ 'is-active': activeProduct === idx }">
            <div class="svc-body">
              <div class="svc-icon" v-html="svc.icon"></div>
              <h3>{{ svc.title }}</h3>
              <p>{{ t(svc.descKey) }}</p>
              <ul class="svc-features">
                <li v-for="feat in svc.features" :key="feat">{{ feat }}</li>
              </ul>
              <ul class="svc-tags">
                <li v-for="tag in svc.tags" :key="tag">{{ tag }}</li>
              </ul>
              <RouterLink to="/products" class="svc-cta">{{ t('service.cta') }} <span aria-hidden="true">→</span></RouterLink>
            </div>
            <div class="svc-visual" :data-type="svc.visual"></div>
          </div>
        </div>
        <div style="height:20vh;"></div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useLocale } from '../../composables/useLocale'

const { t } = useLocale()

const activeProduct = ref(0)
let stepObs: IntersectionObserver | null = null
const stepEls = ref<Element[]>([])

function scrollToStep(idx: number) {
  stepEls.value[idx]?.scrollIntoView({ behavior: 'smooth', block: 'center' })
}

onMounted(() => {
  const stepNodes = document.querySelectorAll('.svc-step')
  stepEls.value = Array.from(stepNodes)
  const trackers = document.querySelectorAll('.svc-tracker')
  stepObs = new IntersectionObserver(
    entries => entries.forEach(e => {
      if (e.isIntersecting) activeProduct.value = +(e.target as HTMLElement).dataset.idx!
    }),
    { rootMargin: '0px', threshold: 0.5 }
  )
  trackers.forEach(el => stepObs!.observe(el))
})

onUnmounted(() => { stepObs?.disconnect() })

const svgWebApp = `<svg width="30" height="30" viewBox="0 0 448 512" fill="currentColor" style="display:block"><path d="M400 32C426.5 32 448 53.49 448 80V336C448 362.5 426.5 384 400 384H266.7L277.3 416H352C369.7 416 384 430.3 384 448C384 465.7 369.7 480 352 480H96C78.33 480 64 465.7 64 448C64 430.3 78.33 416 96 416H170.7L181.3 384H48C21.49 384 0 362.5 0 336V80C0 53.49 21.49 32 48 32H400zM64 96V320H384V96H64z"/></svg>`
const svgEDoc   = `<svg width="30" height="30" viewBox="0 0 384 512" fill="currentColor"><path d="M224 136V0H24C10.7 0 0 10.7 0 24v464c0 13.3 10.7 24 24 24h336c13.3 0 24-10.7 24-24V160H248c-13.2 0-24-10.8-24-24zm64 236c0 6.6-5.4 12-12 12H108c-6.6 0-12-5.4-12-12v-8c0-6.6 5.4-12 12-12h168c6.6 0 12 5.4 12 12v8zm0-64c0 6.6-5.4 12-12 12H108c-6.6 0-12-5.4-12-12v-8c0-6.6 5.4-12 12-12h168c6.6 0 12 5.4 12 12v8zm0-72v8c0 6.6-5.4 12-12 12H108c-6.6 0-12-5.4-12-12v-8c0-6.6 5.4-12 12-12h168c6.6 0 12 5.4 12 12zm96-153.1L286.1 32C279.1 25 269.8 21 260 21h-4v127h127v-4.1c0-9.7-4-19.1-11.1-26.1z"/></svg>`
const svgGIS    = `<svg width="30" height="30" viewBox="0 0 576 512" fill="currentColor"><path d="M408 120C408 174.6 334.9 271.9 302.8 311.1C295.1 321.6 280.9 321.6 273.2 311.1C241.1 271.9 168 174.6 168 120C168 53.73 221.7 0 288 0C354.3 0 408 53.73 408 120zM288 152C310.1 152 328 134.1 328 112C328 89.91 310.1 72 288 72C265.9 72 248 89.91 248 112C248 134.1 265.9 152 288 152zM432 416c0 35.3-64.2 64-143.5 64S144 451.3 144 416s64.2-64 143.5-64S432 380.7 432 416z"/></svg>`

const services = [
  {
    title: 'Web Application / Mobile Application',
    descKey: 'service.webapp.desc',
    icon: svgWebApp,
    visual: 'webapp',
    features: ['Custom workflow & E-Service portals', 'REST / GraphQL API integration', 'Cross-platform mobile-first build'],
    tags: ['Workflow Management', 'E-Service', 'Web & API Service', 'E-Form'],
  },
  {
    title: 'E-Document Management',
    descKey: 'service.edoc.desc',
    icon: svgEDoc,
    visual: 'edoc',
    features: ['Paperless document digitization', 'OCR + Digital Signature pipeline', 'Approval workflow automation'],
    tags: ['Document Management', 'Paperless / OCR', 'Digital Signature', 'Workflow Approval'],
  },
  {
    title: 'GIS (Geographic Information System)',
    descKey: 'service.gis.desc',
    icon: svgGIS,
    visual: 'gis',
    features: ['Spatial data storage & map layers', 'Custom GIS visualization platform', 'API-connected location services'],
    tags: ['Platform GIS', 'Spatial Data Storage', 'Visual Map', 'API Service'],
  },
]
</script>

<style scoped>
.services-section {
  background: var(--dark);
  position: relative;
  padding: 120px 0;
}
.services-section::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle, rgba(255,255,255,0.045) 1px, transparent 1px);
  background-size: 30px 30px;
  pointer-events: none;
  mask-image: radial-gradient(ellipse 60% 80% at 78% 50%, black 0%, transparent 75%);
  -webkit-mask-image: radial-gradient(ellipse 60% 80% at 78% 50%, black 0%, transparent 75%);
  z-index: 0;
}
/* ── Modern ambient aurora — drifting radial orbs ── */
.svc-aurora {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
}

/* Conic sweep — slow rotation gives a subtle cinematic shimmer */
.svc-aurora::before {
  content: '';
  position: absolute;
  width: 900px; height: 900px;
  right: 8%; top: 50%;
  border-radius: 50%;
  background: conic-gradient(
    from 180deg,
    transparent 0deg,
    rgba(49,99,149,0.09) 60deg,
    rgba(56,189,248,0.13) 120deg,
    rgba(49,99,149,0.05) 185deg,
    transparent 225deg
  );
  filter: blur(22px);
  transform: translateY(-50%);
}

.svc-orb {
  position: absolute;
  border-radius: 50%;
  will-change: transform;
}

/* Orb A — deep navy, bleeds from bottom-right */
.svc-orb--a {
  width: 900px; height: 780px;
  right: -180px; bottom: -220px;
  background: radial-gradient(circle at center, rgba(49,99,149,0.35) 0%, rgba(36,70,130,0.12) 50%, transparent 70%);
  filter: blur(72px);
}

/* Orb B — cyan accent, bleeds from top-right */
.svc-orb--b {
  width: 650px; height: 570px;
  right: -60px; top: -140px;
  background: radial-gradient(circle at center, rgba(56,189,248,0.16) 0%, rgba(56,189,248,0.04) 50%, transparent 70%);
  filter: blur(68px);
}

/* Orb C — indigo, bleeds from left-center */
.svc-orb--c {
  width: 560px; height: 500px;
  left: -80px; top: 35%;
  background: radial-gradient(circle at center, rgba(36,55,120,0.22) 0%, rgba(36,55,120,0.06) 50%, transparent 70%);
  filter: blur(62px);
}

@media (prefers-reduced-motion: reduce) {
  .svc-aurora::before,
  .svc-orb { animation: none; }
}
.services-wrap {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 100px;
  align-items: start;
  position: relative;
  z-index: 1;
}
.services-sticky { position: sticky; top: 130px; padding-bottom: 80px; }
.services-sticky .eyebrow { color: rgba(255,255,255,0.5); }
.services-sticky .block-title { font-size: clamp(28px, 3vw, 44px); color: #fff; margin-bottom: 3rem; }

.step-counter { display: flex; align-items: baseline; gap: 6px; margin: 1.25rem 0 1rem; }
.step-num {
  font-size: 64px; font-weight: 900; line-height: 1;
  background: linear-gradient(135deg, #fff 20%, var(--accent) 100%);
  -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;
}
.step-total { font-size: 20px; font-weight: 700; color: rgba(255,255,255,0.15); }
.step-bar { height: 3px; background: rgba(255,255,255,0.08); border-radius: 4px; overflow: hidden; margin-bottom: 1.5rem; }
.step-fill { height: 100%; background: linear-gradient(90deg, #316395, #6ba5d6); border-radius: 4px; transition: width 0.6s cubic-bezier(0.16,1,0.3,1); }
.step-dots { display: flex; gap: 10px; }
.step-dot { width: 10px; height: 10px; border-radius: 50%; border: none; background: rgba(255,255,255,0.15); cursor: pointer; padding: 0; transition: background 0.3s, transform 0.3s; }
.step-dot.active { background: var(--accent); transform: scale(1.4); }
.step-dot:focus-visible { outline: 2px solid var(--accent); outline-offset: 4px; border-radius: 50%; }
.step-label { margin-top: 1.5rem; font-size: 12px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; color: rgba(255,255,255,0.62); line-height: 1.6; max-width: 200px; }

.services-scroll { position: relative; }
.svc-step { height: 70vh; display: flex; align-items: center; position: sticky; top: 130px; z-index: 1; }
.svc-card {
  background: rgba(8, 12, 26, 0.38);
  backdrop-filter: blur(28px) saturate(160%);
  -webkit-backdrop-filter: blur(28px) saturate(160%);
  border-radius: 24px; width: 100%;
  border: 1px solid rgba(255,255,255,0.07);
  opacity: 0.35; transform: scale(0.94) translateX(20px);
  filter: grayscale(100%);
  transition: opacity 0.65s cubic-bezier(0.16,1,0.3,1), transform 0.65s cubic-bezier(0.16,1,0.3,1),
              filter 0.65s cubic-bezier(0.16,1,0.3,1), background 0.65s, border-color 0.65s, box-shadow 0.65s;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  display: grid; grid-template-columns: 1fr 280px; overflow: hidden;
}
.svc-card.is-active {
  background: rgba(6, 10, 22, 0.55);
  backdrop-filter: blur(36px) saturate(210%);
  -webkit-backdrop-filter: blur(36px) saturate(210%);
  border: 1.5px solid rgba(56,189,248,0.35);
  border-left: 3px solid var(--accent);
  opacity: 1; transform: scale(1) translateX(0); filter: grayscale(0%);
  box-shadow:
    -8px 0 48px rgba(56,189,248,0.28),
    0 0 0 1px rgba(200,155,40,0.12),
    inset 0 1px 0 rgba(255,255,255,0.18),
    inset 0 -1px 0 rgba(0,0,0,0.15),
    inset 1px 0 0 rgba(200,155,40,0.15),
    0 40px 100px rgba(0,0,0,0.75);
}
.svc-body { padding: 3.5rem; transform: translateX(-16px); opacity: 0; transition: transform 1.1s cubic-bezier(0.16,1,0.3,1), opacity 1.1s cubic-bezier(0.16,1,0.3,1); }
.svc-card.is-active .svc-body { transform: translateX(0); opacity: 1; }
.svc-visual { position: relative; border-left: 1px solid rgba(255,255,255,0.06); overflow: hidden; clip-path: inset(0 100% 0 0); transform: scale(1.06); transition: clip-path 1.2s cubic-bezier(0.16,1,0.3,1) 0.1s, transform 1.2s cubic-bezier(0.16,1,0.3,1) 0.1s; }
.svc-card.is-active .svc-visual { clip-path: inset(0 0% 0 0); transform: scale(1); }
.svc-visual[data-type="webapp"] { background-image: linear-gradient(to left, transparent 55%, rgba(14,17,36,0.55) 100%), url('/ser1.webp'); background-size: cover; background-position: 75% center; }
.svc-visual[data-type="webapp"]::before, .svc-visual[data-type="webapp"]::after { content: none; }
.svc-visual[data-type="edoc"]   { background-image: linear-gradient(to left, transparent 55%, rgba(14,17,36,0.55) 100%), url('/ser2.webp'); background-size: cover; background-position: center; }
.svc-visual[data-type="edoc"]::before, .svc-visual[data-type="edoc"]::after { content: none; }
.svc-visual[data-type="gis"]    { background-image: linear-gradient(to left, transparent 55%, rgba(14,17,36,0.55) 100%), url('/ser3.webp'); background-size: cover; background-position: center; }
.svc-visual[data-type="gis"]::before, .svc-visual[data-type="gis"]::after { content: none; }
.svc-icon { width: 68px; height: 68px; background: rgba(49,99,149,0.15); border-radius: 18px; display: flex; align-items: center; justify-content: center; color: var(--accent); margin-bottom: 2rem; flex-shrink: 0; transition: transform 0.4s cubic-bezier(0.16,1,0.3,1), background 0.4s; }
.svc-card.is-active .svc-icon { transform: scale(1.15); background: rgba(49,99,149,0.3); }
.svc-card h3 { font-size: 26px; font-weight: 700; color: #fff; margin-bottom: 1rem; line-height: 1.3; transform: translateY(12px); opacity: 0; transition: transform 1.0s cubic-bezier(0.16,1,0.3,1) 0.15s, opacity 1.0s cubic-bezier(0.16,1,0.3,1) 0.15s; }
.svc-card.is-active h3 { transform: translateY(0); opacity: 1; }
.svc-card p { font-size: 15px; color: rgba(255,255,255,0.65); line-height: 1.8; transform: translateY(12px); opacity: 0; transition: transform 1.0s cubic-bezier(0.16,1,0.3,1) 0.22s, opacity 1.0s cubic-bezier(0.16,1,0.3,1) 0.22s; }
.svc-card.is-active p { transform: translateY(0); opacity: 1; margin-bottom: 1.5rem; }
.svc-features { list-style: none; padding: 0; margin-bottom: 1.75rem; display: flex; flex-direction: column; gap: 10px; }
.svc-features li { display: flex; align-items: center; gap: 10px; font-size: 13.5px; color: rgba(255,255,255,0.62); transition: color 0.5s; }
.svc-features li::before { content: ''; width: 18px; height: 18px; border-radius: 50%; border: 1.5px solid rgba(107,165,214,0.20); flex-shrink: 0; transition: background 0.4s, border-color 0.4s, box-shadow 0.4s; }
.svc-card.is-active .svc-features li { color: rgba(255,255,255,0.80); animation: featureIn 0.5s cubic-bezier(0.16,1,0.3,1) both; }
.svc-card.is-active .svc-features li:nth-child(1) { animation-delay: 0.08s; }
.svc-card.is-active .svc-features li:nth-child(2) { animation-delay: 0.17s; }
.svc-card.is-active .svc-features li:nth-child(3) { animation-delay: 0.26s; }
.svc-card.is-active .svc-features li::before { background: rgba(49,99,149,0.45); border-color: var(--accent); box-shadow: 0 0 0 3px rgba(61,184,130,0.12); }
@keyframes featureIn { from { opacity: 0; transform: translateX(-14px); } to { opacity: 1; transform: none; } }
.svc-tags { list-style: none; padding: 0; display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 2rem; }
.svc-tags li {
  font-size: 12px;
  font-weight: 600;
  padding: 5px 14px;
  border-radius: 50px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: rgba(255, 255, 255, 0.82);
  background: rgba(255, 255, 255, 0.05);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
  letter-spacing: 0.5px;
  cursor: default;
  will-change: transform, box-shadow;
  transition:
    transform 0.4s cubic-bezier(0.16, 1, 0.3, 1),
    color 0.4s cubic-bezier(0.16, 1, 0.3, 1),
    border-color 0.4s cubic-bezier(0.16, 1, 0.3, 1),
    box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.svc-tags li:hover {
  transform: translateY(-2px) scale(1.04);
  color: #ffffff;
  border-color: rgba(255, 255, 255, 0.3);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
}
.svc-cta { display: inline-flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 600; color: rgba(107,165,214,0.65); opacity: 0; transform: translateY(8px); transition: color 0.25s, opacity 0.45s 0.28s, transform 0.45s 0.28s; }
.svc-cta span { display: inline-block; transition: transform 0.25s; }
.svc-cta:hover { color: var(--accent); }
.svc-cta:hover span { transform: translateX(4px); }
.svc-card.is-active .svc-cta { opacity: 1; transform: none; }

@media (max-width: 900px) {
  .services-wrap { grid-template-columns: 1fr; gap: 2rem; }
  .services-sticky { position: static; }
  .svc-step { min-height: 0; }
  .svc-card { position: static; opacity: 1; transform: none; filter: none; z-index: auto; margin-bottom: 1.5rem; }
  .svc-body { padding: 2.25rem; }
}
@media (max-width: 600px) {
  .services-section { padding-top: 72px; padding-bottom: 72px; }
  .svc-card { padding: 2.25rem; }
}
</style>
