<template>
  <section class="latest-section" ref="sectionRef">
    <div class="section-inner">

      <p class="latest-eyebrow" ref="eyebrowRef">
        {{ locale === 'th' ? 'โครงการที่เพิ่งลงนามล่าสุด' : 'Latest Signed Project' }}
      </p>

      <div class="lp-feature">

        <!-- Image -->
        <div class="lp-media" ref="mediaRef">
          <span class="lp-flag">{{ locale === 'th' ? 'ล่าสุด' : 'New' }}</span>
          <img :src="p.img" :alt="locale === 'th' ? p.title : p.titleEn" loading="lazy" ref="imgRef" />
        </div>

        <!-- Details -->
        <div class="lp-detail" ref="detailRef">
          <span class="lp-kicker">
            <svg class="lp-cal" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />
            </svg>
            {{ locale === 'th' ? 'ลงนาม ' + signed.th : 'Signed ' + signed.en }}
          </span>

          <h2 class="lp-name">{{ locale === 'th' ? p.title : p.titleEn }}</h2>
          <p class="lp-client">{{ locale === 'th' ? p.client : p.clientEn }}</p>
          <p class="lp-desc">{{ locale === 'th' ? p.desc : p.descEn }}</p>

          <div class="lp-meta">
            <div class="lp-meta-item">
              <span class="lp-meta-label">{{ locale === 'th' ? 'มูลค่าโครงการ' : 'Project Value' }}</span>
              <span class="lp-meta-val">{{ formatBudget(p.budget, locale === 'en') }}</span>
            </div>
            <div class="lp-meta-divider"></div>
            <div class="lp-meta-item">
              <span class="lp-meta-label">{{ locale === 'th' ? 'ระยะเวลา' : 'Duration' }}</span>
              <span class="lp-meta-val">{{ p.year }}</span>
            </div>
          </div>

          <RouterLink :to="`/portfolio/${p.slug}`" class="lp-link">
            {{ locale === 'th' ? 'ดูรายละเอียดโครงการ' : 'View Project' }}
            <span class="lp-arrow" aria-hidden="true">→</span>
          </RouterLink>
        </div>
      </div>

    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLocale } from '../../composables/useLocale'
import { projects, formatBudget } from '../../data/portfolioData'

const { locale } = useLocale()

const p = projects.find(x => x.slug === 'aerothai-api') ?? projects[0]
const signed = { th: '14 ก.พ. 2569', en: 'Feb 14, 2026' }

const sectionRef = ref<HTMLElement | null>(null)
const eyebrowRef = ref<HTMLElement | null>(null)
const mediaRef   = ref<HTMLElement | null>(null)
const imgRef     = ref<HTMLImageElement | null>(null)
const detailRef  = ref<HTMLElement | null>(null)

let triggers: ScrollTrigger[] = []

onMounted(() => {
  gsap.registerPlugin(ScrollTrigger)
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  // Grab direct children of lp-detail as the stagger targets
  const detailEls = detailRef.value
    ? Array.from(detailRef.value.children) as HTMLElement[]
    : []

  // Set initial states
  gsap.set(eyebrowRef.value, { y: 48, opacity: 0 })
  gsap.set(mediaRef.value,   { clipPath: 'inset(0 100% 0 0 round 20px)' })
  gsap.set(imgRef.value,     { scale: 1.1 })
  gsap.set(detailEls,        { y: 36, opacity: 0 })

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: sectionRef.value,
      start: 'top 72%',
      once: true,
    },
  })

  // 1 — Section title slides up
  tl.to(eyebrowRef.value, {
    y: 0, opacity: 1,
    duration: 0.85, ease: 'power3.out',
  })

  // 2 — Image wipes in from left, photo zooms out simultaneously
  tl.to(mediaRef.value, {
    clipPath: 'inset(0 0% 0 0 round 20px)',
    duration: 1.05, ease: 'power3.inOut',
  }, '-=0.25')
  tl.to(imgRef.value, {
    scale: 1,
    duration: 1.4, ease: 'power2.out',
  }, '<')

  // 3 — Detail children stagger in
  tl.to(detailEls, {
    y: 0, opacity: 1,
    duration: 0.65, ease: 'power3.out',
    stagger: 0.11,
  }, '-=0.85')

  triggers = ScrollTrigger.getAll().slice(-1)
})

onUnmounted(() => {
  triggers.forEach(t => t.kill())
})
</script>

<style scoped>
.latest-section {
  background: #060912;
  padding: 120px 0;
  position: relative;
  z-index: 1;
}

.latest-eyebrow {
  font-family: 'Kanit', sans-serif;
  font-size: clamp(28px, 3vw, 42px);
  font-weight: 800;
  letter-spacing: -0.02em;
  text-transform: none;
  color: #fff;
  margin-bottom: 48px;
}

/* ── Feature block ── */
.lp-feature {
  display: grid;
  grid-template-columns: 1.15fr 1fr;
  gap: 56px;
  align-items: center;
}

/* Image */
.lp-media {
  position: relative;
  aspect-ratio: 16 / 11;
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 30px 70px rgba(0, 0, 0, 0.5);
}
.lp-media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}
.lp-feature:hover .lp-media img { transform: scale(1.04); }
.lp-flag {
  position: absolute;
  top: 16px;
  left: 16px;
  z-index: 2;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: #060912;
  background: var(--accent);
  padding: 5px 12px;
  border-radius: 50px;
}

/* Details */
.lp-detail { display: flex; flex-direction: column; align-items: flex-start; }
.lp-kicker {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 12.5px;
  font-weight: 600;
  letter-spacing: 0.5px;
  color: var(--accent);
  margin-bottom: 16px;
}
.lp-cal { width: 15px; height: 15px; flex-shrink: 0; }

.lp-name {
  font-size: clamp(28px, 3.2vw, 44px);
  font-weight: 800;
  line-height: 1.28;
  letter-spacing: -0.01em;
  color: #fff;
  text-wrap: balance;
  margin-bottom: 12px;
}
.lp-client {
  font-size: 14px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.62);
  margin-bottom: 24px;
}
.lp-desc {
  font-size: 15px;
  line-height: 1.85;
  color: rgba(255, 255, 255, 0.72);
  max-width: 480px;
  margin-bottom: 32px;
}

/* Meta row */
.lp-meta {
  display: flex;
  align-items: center;
  gap: 32px;
  margin-bottom: 36px;
}
.lp-meta-item { display: flex; flex-direction: column; gap: 6px; }
.lp-meta-label {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.5);
}
.lp-meta-val { font-size: 16px; font-weight: 700; color: #fff; }
.lp-meta-divider { width: 1px; height: 36px; background: rgba(255, 255, 255, 0.12); }

/* Link */
.lp-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 13.5px;
  font-weight: 700;
  letter-spacing: 0.5px;
  color: var(--accent);
  padding: 12px 26px;
  border: 1px solid rgba(56, 189, 248, 0.4);
  border-radius: 50px;
  transition: background 0.25s, gap 0.25s, border-color 0.25s;
}
.lp-link:hover { background: rgba(56, 189, 248, 0.1); gap: 14px; border-color: var(--accent); }
.lp-link:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; }
.lp-arrow { display: inline-block; transition: transform 0.25s; }
.lp-link:hover .lp-arrow { transform: translateX(3px); }

/* ── Responsive ── */
@media (max-width: 900px) {
  .lp-feature { grid-template-columns: 1fr; gap: 32px; }
}
@media (max-width: 640px) {
  .latest-section { padding: 80px 0; }
  .lp-meta { gap: 24px; }
}
</style>
