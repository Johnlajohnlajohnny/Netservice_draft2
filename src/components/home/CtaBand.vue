<template>
  <section class="cta-band" ref="bandRef">

    <!-- Background image with parallax -->
    <div class="cta-band-bg" ref="bgRef"></div>

    <!-- Dark gradient overlay -->
    <div class="cta-band-overlay"></div>

    <!-- Subtle grid lines -->
    <div class="cta-band-grid"></div>

    <!-- Ambient glows -->
    <div class="cta-glow cta-glow--a" ref="glowA"></div>
    <div class="cta-glow cta-glow--b" ref="glowB"></div>

    <!-- Floating particles -->
    <div class="cta-particles" aria-hidden="true">
      <span class="cta-particle" style="--x:64.1%;--delay:1.46s;--dur:4.75s;--sz:2.8px"></span>
      <span class="cta-particle" style="--x:56.3%;--delay:2.94s;--dur:4.42s;--sz:2.3px"></span>
      <span class="cta-particle" style="--x:66.1%;--delay:3.75s;--dur:4.35s;--sz:3.1px"></span>
      <span class="cta-particle" style="--x:91.8%;--delay:3.98s;--dur:4.76s;--sz:3.1px"></span>
      <span class="cta-particle" style="--x:22.6%;--delay:1.86s;--dur:3.11s;--sz:3.5px"></span>
      <span class="cta-particle" style="--x:64.3%;--delay:4.88s;--dur:4.36s;--sz:4.8px"></span>
      <span class="cta-particle" style="--x:6.6%; --delay:1.69s;--dur:3.77s;--sz:4.4px"></span>
      <span class="cta-particle" style="--x:61.9%;--delay:4.86s;--dur:4.55s;--sz:3.0px"></span>
      <span class="cta-particle" style="--x:43.4%;--delay:3.36s;--dur:3.34s;--sz:2.8px"></span>
      <span class="cta-particle" style="--x:45.3%;--delay:3.43s;--dur:5.03s;--sz:2.0px"></span>
      <span class="cta-particle" style="--x:5.4%; --delay:4.29s;--dur:4.30s;--sz:2.4px"></span>
      <span class="cta-particle" style="--x:7.7%; --delay:1.55s;--dur:4.81s;--sz:4.0px"></span>
      <span class="cta-particle" style="--x:68.4%;--delay:3.82s;--dur:4.18s;--sz:4.4px"></span>
      <span class="cta-particle" style="--x:22.0%;--delay:4.60s;--dur:4.76s;--sz:4.6px"></span>
      <span class="cta-particle" style="--x:40.1%;--delay:0.05s;--dur:3.49s;--sz:4.3px"></span>
      <span class="cta-particle" style="--x:71.9%;--delay:3.80s;--dur:5.41s;--sz:2.5px"></span>
      <span class="cta-particle" style="--x:12.8%;--delay:4.54s;--dur:5.06s;--sz:3.5px"></span>
      <span class="cta-particle" style="--x:55.5%;--delay:2.79s;--dur:3.15s;--sz:2.6px"></span>
    </div>

    <!-- Content -->
    <div class="cta-band-content">

      <div class="cta-eyebrow-row" data-reveal>
        <span class="cta-rule"></span>
        <p class="cta-eyebrow">{{ t('help.subtitle') }}</p>
        <span class="cta-rule cta-rule--right"></span>
      </div>

      <h2 class="cta-title" data-reveal="left">{{ t('help.title') }}</h2>

      <p class="cta-desc" data-reveal="right" data-delay="1">{{ t('help.desc') }}</p>

      <div class="cta-band-actions" data-reveal data-delay="2">
        <RouterLink to="/contact" class="btn btn-primary">{{ t('help.getStarted') }}</RouterLink>
      </div>

    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useLocale } from '../../composables/useLocale'
import { useLenis } from '../../composables/useLenis'

const { t } = useLocale()
const { lenis } = useLenis()

const bandRef = ref<HTMLElement | null>(null)
const bgRef   = ref<HTMLElement | null>(null)
const glowA   = ref<HTMLElement | null>(null)
const glowB   = ref<HTMLElement | null>(null)

/* ── Mouse spotlight + glow parallax ── */
function onMouseMove(e: MouseEvent) {
  if (!bandRef.value) return
  const rect = bandRef.value.getBoundingClientRect()
  const cx = e.clientX - rect.left
  const cy = e.clientY - rect.top
  bandRef.value.style.setProperty('--cx', cx + 'px')
  bandRef.value.style.setProperty('--cy', cy + 'px')
  bandRef.value.style.setProperty('--spot-opacity', '1')
  const rx = (cx / rect.width  - 0.5) * 2
  const ry = (cy / rect.height - 0.5) * 2
  if (glowA.value) glowA.value.style.transform = `translate(${rx * 30}px, ${ry * 20}px)`
  if (glowB.value) glowB.value.style.transform = `translate(${rx * -20}px, ${ry * -15}px)`
}
function onMouseLeave() {
  bandRef.value?.style.setProperty('--spot-opacity', '0')
}

/* ── Scroll parallax on background ── */
let cachedTop = 0
function cacheOffset() {
  if (bandRef.value) cachedTop = bandRef.value.offsetTop
}
let scrollUnsub: ((e: any) => void) | null = null
function onScroll(e: any) {
  if (!bgRef.value) return
  const offset = (e.scroll - cachedTop) * 0.30
  bgRef.value.style.transform = `translateY(${offset}px)`
}

onMounted(() => {
  cacheOffset()
  window.addEventListener('resize', cacheOffset)
  bandRef.value?.addEventListener('mousemove', onMouseMove)
  bandRef.value?.addEventListener('mouseleave', onMouseLeave)

  const subscribe = (instance: any) => {
    scrollUnsub = (e) => onScroll(e)
    instance.on('scroll', scrollUnsub)
  }
  if (lenis.value) subscribe(lenis.value)
  else {
    const unwatch = watch(lenis, (inst) => { if (inst) { subscribe(inst); unwatch() } })
  }
})
onUnmounted(() => {
  window.removeEventListener('resize', cacheOffset)
  bandRef.value?.removeEventListener('mousemove', onMouseMove)
  bandRef.value?.removeEventListener('mouseleave', onMouseLeave)
  if (lenis.value && scrollUnsub) lenis.value.off('scroll', scrollUnsub)
})
</script>

<style scoped>
/* ── Section shell ── */
.cta-band {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 120px 24px;
  position: relative;
  overflow: hidden;
}

/* ── Background image ── */
.cta-band-bg {
  position: absolute;
  inset: -30%;
  z-index: 0;
  will-change: transform;
  background: url('/ctasecbg.webp') 50% center / cover no-repeat;
}

/* ── Gradient overlay ── */
.cta-band-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(6,9,18,0.80)  0%,
    rgba(14,30,70,0.68) 40%,
    rgba(180,130,20,0.08) 65%,
    rgba(6,9,18,0.82)  100%
  );
}

/* ── Dot grid ── */
.cta-band-grid {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image:
    linear-gradient(rgba(107,165,214,0.043) 1px, transparent 1px),
    linear-gradient(90deg, rgba(107,165,214,0.043) 1px, transparent 1px);
  background-size: 64px 64px;
  mask-image: radial-gradient(75% 80%, #000 0%, transparent 100%);
}

/* ── Mouse spotlight ── */
.cta-band::after {
  content: '';
  pointer-events: none;
  z-index: 1;
  opacity: var(--spot-opacity, 0);
  background: radial-gradient(
    ellipse 380px 280px at var(--cx,50%) var(--cy,50%),
    rgba(107,165,214,0.10) 0%,
    rgba(49,99,149,0.04)   50%,
    transparent 70%
  );
  transition: opacity 0.4s;
  position: absolute;
  inset: 0;
}

/* ── Glows ── */
.cta-glow {
  position: absolute;
  pointer-events: none;
  border-radius: 50%;
  transition: transform 80ms linear;
}
.cta-glow--a {
  width: 720px; height: 720px;
  top: -200px; left: -140px;
  background: radial-gradient(circle, rgba(49,99,149,0.32) 0%, transparent 65%);
}
.cta-glow--b {
  width: 600px; height: 600px;
  bottom: -160px; right: -100px;
  background: radial-gradient(circle, rgba(220,140,30,0.22) 0%, rgba(107,165,214,0.10) 55%, transparent 70%);
}

/* ── Particles ── */
.cta-particles {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 1;
}
.cta-particle {
  position: absolute;
  bottom: -10px;
  left: var(--x, 50%);
  width:  var(--sz, 3px);
  height: var(--sz, 3px);
  background: rgba(107,165,214,0.85);
  border-radius: 50%;
  box-shadow: 0 0 8px rgba(107,165,214,0.70);
  animation: ctaRise var(--dur, 4s) var(--delay, 0s) infinite linear;
}

@keyframes ctaRise {
  0%   { opacity: 0; transform: translateY(0)      scale(1);   }
  15%  { opacity: 0.7; }
  85%  { opacity: 0.3; }
  100% { opacity: 0; transform: translateY(-420px) scale(0.4); }
}

/* ── Content ── */
.cta-band-content {
  position: relative;
  z-index: 2;
  text-align: center;
  max-width: 700px;
}

/* Eyebrow row with flanking rules */
.cta-eyebrow-row {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-bottom: 1.75rem;
}
.cta-eyebrow {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: rgba(255,255,255,0.6);
}
.cta-rule {
  flex: 1;
  max-width: 72px;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(107,165,214,0.60));
}
.cta-rule--right {
  background: linear-gradient(270deg, transparent, rgba(107,165,214,0.60));
}

/* Gradient title */
.cta-title {
  font-size: clamp(26px, 3.5vw, 48px);
  font-weight: 800;
  line-height: 1.15;
  letter-spacing: -0.5px;
  margin-bottom: 1.25rem;
  background: linear-gradient(135deg, #fff 20%, #38bdf8 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.cta-desc {
  font-size: 15.5px;
  color: rgba(255,255,255,0.58);
  line-height: 1.85;
  max-width: 540px;
  margin: 0 auto 2.5rem;
}

.cta-band-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 14px;
}

@media (prefers-reduced-motion: reduce) {
  .cta-particle { animation: none; }
}
@media (max-width: 600px) {
  .cta-band { padding: 100px 24px; }
}
</style>
