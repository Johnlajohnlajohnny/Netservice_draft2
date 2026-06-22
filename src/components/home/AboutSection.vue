<template>
  <section class="about-section" ref="sectionRef">
    <div class="about-ambient" aria-hidden="true"></div>
    <div class="section-inner">

      <!-- Top label -->
      <div class="about-label" data-reveal>
        <span class="about-label-dot"></span>
        {{ t('home.aboutEye') }}
      </div>

      <div class="about-grid">

        <!-- LEFT: content -->
        <div class="about-left" ref="contentRef" style="will-change: transform, opacity;">

          <!-- Heading — stacked, one word per line for weight -->
          <h2 class="about-heading" data-reveal data-delay="1">
            <span class="line">Netservice <span class="line--accent">(Thailand)</span></span>
            <span class="line">Co., Ltd.</span>
          </h2>

          <p class="about-desc" data-reveal data-delay="2">{{ t('home.aboutDesc') }}</p>

          <!-- Two unequal stats — hierarchy not equality -->
          <div class="about-nums" data-reveal data-delay="3">
            <div class="about-num about-num--big">
              <span class="num">19</span>
              <span class="num-label">{{ t('stat.years') }}</span>
            </div>
            <div class="about-num-divider"></div>
            <div class="about-num about-num--small">
              <span class="num">2,441<em>+</em></span>
              <span class="num-label">{{ t('stat.value') }}</span>
            </div>
          </div>

          <!-- Certs — inline minimal -->
          <div class="about-certs" data-reveal data-delay="3">
            <span>CMMI Level 3</span>
            <span class="cert-dot">·</span>
            <span>ISO 29110</span>
            <span class="cert-dot">·</span>
            <span>150+ Projects</span>
          </div>

          <RouterLink to="/about" class="about-cta" data-reveal data-delay="4">
            {{ t('about.cta') }}
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" class="about-cta-arrow">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </RouterLink>
        </div>

        <!-- RIGHT: image bleeds to edge, no card -->
        <div class="about-right" data-reveal="right" ref="imgRef" style="will-change: transform;">
          <div class="about-img-clip">
            <img src="/pic-h7.webp" alt="Netservice Thailand office" loading="lazy" />
            <div class="about-img-overlay"></div>
          </div>
          <!-- Floating text accent on image -->
          <div class="about-img-tag">
            <span>{{ locale === 'th' ? 'ก่อตั้ง พ.ศ.' : 'Est.' }}</span>
            <strong>{{ locale === 'th' ? '2550' : '2007' }}</strong>
          </div>
        </div>

      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useLocale } from '../../composables/useLocale'
import { useLenis } from '../../composables/useLenis'

const { t, locale } = useLocale()
const { lenis } = useLenis()

const sectionRef = ref<HTMLElement | null>(null)
const imgRef     = ref<HTMLElement | null>(null)
const contentRef = ref<HTMLElement | null>(null)

let cachedTop = 0, cachedH = 0
let scrollUnsubscribe: ((e: any) => void) | null = null

function cacheOffset() {
  if (sectionRef.value) {
    cachedTop = sectionRef.value.offsetTop
    cachedH   = sectionRef.value.offsetHeight
  }
}

function onScroll(e: any) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  if (!imgRef.value || !contentRef.value || cachedH === 0) return
  const scrollY = e.scroll
  const vh = window.innerHeight
  const exitProgress = Math.max(0, Math.min(1, 1 - (cachedTop + cachedH - scrollY) / (vh * 0.8)))
  if (exitProgress > 0) {
    imgRef.value.style.transition     = 'none'
    imgRef.value.style.transform      = `translateY(${exitProgress * 100}px)`
    imgRef.value.style.opacity        = String(1 - exitProgress * 0.9)
    contentRef.value.style.transition = 'none'
    contentRef.value.style.transform  = `translateY(${exitProgress * -80}px)`
    contentRef.value.style.opacity    = String(1 - exitProgress * 0.9)
  } else {
    imgRef.value.style.transition = contentRef.value.style.transition = ''
    imgRef.value.style.transform  = contentRef.value.style.transform  = ''
    imgRef.value.style.opacity    = contentRef.value.style.opacity    = ''
  }
}

onMounted(() => {
  cacheOffset()
  window.addEventListener('resize', cacheOffset)
  const subscribe = (instance: any) => {
    scrollUnsubscribe = (e) => onScroll(e)
    instance.on('scroll', scrollUnsubscribe)
  }
  if (lenis.value) subscribe(lenis.value)
  else {
    const unwatch = watch(lenis, (instance) => {
      if (instance) { subscribe(instance); unwatch() }
    })
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', cacheOffset)
  if (lenis.value && scrollUnsubscribe) lenis.value.off('scroll', scrollUnsubscribe)
})
</script>

<style scoped>
.about-section {
  padding: 120px 0 0;
  background: #080d1c;
  position: relative;
  overflow: hidden;
}

.about-section .section-inner {
  position: relative;
  z-index: 2;
  /* Extend inner beyond normal max-width on the right so image can bleed */
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 clamp(24px, 5vw, 72px);
  padding-right: 0;
}

/* ── Ambient depth glow ── */
.about-ambient {
  position: absolute;
  top: 50%;
  left: -8%;
  transform: translateY(-50%);
  width: 700px;
  height: 700px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(49,99,149,0.09) 0%, transparent 65%);
  pointer-events: none;
  z-index: 0;
}

/* ── Label ── */
.about-label {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: rgba(255,255,255,0.55);
  margin-bottom: 52px;
  padding-right: clamp(24px, 5vw, 72px);
}
.about-label-dot {
  width: 6px; height: 6px;
  border-radius: 50%;
  background: var(--accent);
  flex-shrink: 0;
}

/* ── Grid: 55/45, image bleeds right ── */
.about-grid {
  display: grid;
  grid-template-columns: 46fr 45fr;
  align-items: stretch;
  min-height: 560px;
}

/* ── LEFT ── */
.about-left {
  padding-right: 34px;
  padding-bottom: 100px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  /* Subtle left border as editorial accent */
  border-left: 1px solid rgba(255,255,255,0.06);
  padding-left: clamp(24px, 5vw, 72px);
  margin-left: calc(-1 * clamp(24px, 5vw, 72px));
}

/* ── Heading: stacked, each line its own weight ── */
.about-heading {
  display: flex;
  flex-direction: column;
  margin-bottom: 1.75rem;
}
.line {
  font-size: clamp(26px, 3vw, 44px);
  font-weight: 800;
  color: #fff;
  line-height: 1.05;
  letter-spacing: -0.025em;
}
.line--accent {
  /* "Digital" gets accent — single word with personality */
  background: linear-gradient(90deg, var(--accent) 0%, #7dd3fc 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.about-desc {
  font-size: 15px;
  color: rgba(255,255,255,0.62);
  line-height: 1.85;
  max-width: 420px;
  margin-bottom: 2.25rem;
  text-wrap: balance;   /* even out line lengths so the last line isn't a short orphan */
  min-height: calc(1.85em * 6);   /* reserve up to 6 lines so EN/TH wrap differences don't resize the section */
}

/* ── Stats: deliberately unequal sizes ── */
.about-nums {
  display: flex;
  align-items: flex-end;
  gap: 0;
  margin-bottom: 1.75rem;
}
.about-num {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.about-num--big { padding-right: 28px; min-width: 180px; }   /* fixed width so the divider + 2,441+ don't shift when TH label is shorter */
.about-num--small { padding-left: 28px; }

.num {
  font-weight: 900;
  color: #fff;
  line-height: 1;
  letter-spacing: 0.01em; /* Increased base spacing */
}
.about-num--big   .num { font-size: clamp(40px, 4vw, 58px); }
.about-num--small .num { 
  font-size: clamp(22px, 2.2vw, 32px); 
  color: rgba(255,255,255,0.7); 
  letter-spacing: 0.08em; /* Specifically increased spacing for the 2,441+ digits as requested */
}

.num em {
  font-style: normal;
  color: var(--accent);
  font-size: 0.6em;
}
.num-label {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: rgba(255,255,255,0.55);
}
.about-num-divider {
  width: 1px;
  height: 48px;
  background: rgba(255,255,255,0.10);
  flex-shrink: 0;
  align-self: center;
}

/* ── Certs: inline, low-key ── */
.about-certs {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 2.25rem;
  font-size: 11.5px;
  font-weight: 600;
  color: rgba(255,255,255,0.52);
  letter-spacing: 0.3px;
}
.cert-dot { color: rgba(255,255,255,0.30); }

/* ── CTA: text link not button ── */
.about-cta {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 13.5px;
  font-weight: 700;
  color: #fff;
  text-decoration: none;
  letter-spacing: 0.3px;
  transition: color 0.2s;
  width: fit-content;
  min-height: 44px;
  padding: 10px 0;
}
.about-cta-arrow {
  transition: transform 0.25s cubic-bezier(0.16,1,0.3,1);
}
.about-cta:hover { color: var(--accent); }
.about-cta:hover .about-cta-arrow { transform: translateX(6px); }
.about-cta:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 4px;
  border-radius: 3px;
}

/* ── RIGHT: image bleeds to the right edge ── */
.about-right {
  position: relative;
}
.about-img-clip {
  position: absolute;
  top: -175px;
  left: 0;
  right: 0;
  bottom: 0;
}
.about-img-clip img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 8%;
  display: block;
}
/* Left-side gradient fade into dark bg */
.about-img-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to right,
    #080d1c 0%,
    rgba(8,13,28,0.6) 25%,
    transparent 55%
  );
}

/* Minimal floating tag — not a badge card */
.about-img-tag {
  position: absolute;
  bottom: 28px;
  right: 28px;
  display: flex;
  flex-direction: column;
  line-height: 1;
  text-align: right;
}
.about-img-tag span {
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: rgba(255,255,255,0.60);
}
.about-img-tag strong {
  font-size: 26px;
  font-weight: 900;
  color: rgba(255,255,255,0.85);
  letter-spacing: -1px;
}

/* ── Reveal timing ── */
.about-section [data-reveal],
.about-section [data-reveal="right"] { transition-duration: 0.45s; }
.about-section [data-reveal][data-delay='1'] { transition-delay: 0.08s; }
.about-section [data-reveal][data-delay='2'] { transition-delay: 0.16s; }
.about-section [data-reveal][data-delay='3'] { transition-delay: 0.24s; }
.about-section [data-reveal][data-delay='4'] { transition-delay: 0.32s; }

@media (prefers-reduced-motion: reduce) {
  .about-section * { animation: none !important; }
}
@media (max-width: 1024px) {
  .about-grid { grid-template-columns: 1fr; min-height: auto; }
  .about-section .section-inner { padding-right: clamp(24px, 5vw, 72px); }
  .about-right { height: 340px; }
  .about-img-overlay {
    background: linear-gradient(to top, #080d1c 0%, rgba(8,13,28,0.5) 30%, transparent 60%);
  }
  .about-left { padding-right: 0; padding-bottom: 48px; }
}
@media (max-width: 600px) {
  .about-section { padding-top: 80px; }
  .about-right { height: 260px; }
}
</style>
