<template>
  <section class="hero" ref="heroSectionRef">
    <div class="hero-bg" ref="heroBgRef"></div>
    <div class="hero-overlay"></div>
    <div class="hero-grid" aria-hidden="true"></div>
    <div class="hero-spotlight"></div>

    <div class="hero-body">
      <div class="hero-text" ref="heroTextRef">
        <p class="hero-eyebrow">
          <span class="eyebrow-text">{{ t('hero.subtitle') }}</span>
        </p>
        <div class="hero-title-wrap">
          <h1 class="hero-title" v-html="t('hero.title')"></h1>
          <p class="hero-title-sub">{{ t('hero.titleSub') }}</p>
        </div>
        <span class="hero-title-rule" aria-hidden="true"></span>
        <p class="hero-desc">{{ t('hero.desc') }}</p>
        <div class="hero-actions">
          <RouterLink to="/contact" class="btn btn-primary">{{ t('hero.getStarted') }}</RouterLink>
          <RouterLink to="/about" class="btn btn-ghost">{{ t('hero.viewMore') }}</RouterLink>
        </div>
      </div>
    </div>

    <div class="hero-scroll-hint" aria-hidden="true">
      <span>Scroll</span>
      <div class="scroll-bar"></div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { useLocale } from '../../composables/useLocale'
import { useLenis } from '../../composables/useLenis'

const { t } = useLocale()
const { lenis } = useLenis()

const heroBgRef    = ref<HTMLElement | null>(null)
const heroSectionRef = ref<HTMLElement | null>(null)
const heroTextRef  = ref<HTMLElement | null>(null)

let mouseX = 0, mouseY = 0
let rafMouse: number | null = null
let scrollUnsubscribe: ((e: any) => void) | null = null

function applyHeroTransform() {
  if (!heroBgRef.value) return
  const scrollY = lenis.value?.scroll ?? window.scrollY
  const progress = Math.min(scrollY / window.innerHeight, 1)
  const scrollPanX = (progress - 0.5) * 120
  heroBgRef.value.style.transform =
    `translate(${scrollPanX + mouseX}px, ${scrollY * 0.28 + mouseY}px)`
}

function onScroll(e: any) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  if (e.scroll < window.innerHeight) applyHeroTransform()
}

function onMouseMove(e: MouseEvent) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  cancelAnimationFrame(rafMouse!)
  rafMouse = requestAnimationFrame(() => {
    const cx = window.innerWidth / 2
    const cy = window.innerHeight / 2
    const nx = (e.clientX - cx) / cx
    const ny = (e.clientY - cy) / cy

    mouseX = nx * -56
    mouseY = ny * -10
    applyHeroTransform()

    if (e.clientY > window.innerHeight) return

    if (heroSectionRef.value) {
      heroSectionRef.value.style.setProperty('--cx', `${e.clientX}px`)
      heroSectionRef.value.style.setProperty('--cy', `${e.clientY}px`)
    }
    if (heroTextRef.value) {
      heroTextRef.value.style.transform =
        `perspective(900px) rotateX(${ny * -1.5}deg) rotateY(${nx * 2.5}deg) translate(${nx * -2.5}px, ${ny * -1.5}px)`
    }
    if (heroSectionRef.value) {
      heroSectionRef.value.style.setProperty('--ox', `${(nx * 0.08 + 0.60).toFixed(3)}`)
    }
  })
}

function onHeroLeave() {
  heroSectionRef.value?.style.setProperty('--spot-opacity', '0')
  if (heroTextRef.value) {
    heroTextRef.value.style.transition = 'transform 0.9s cubic-bezier(0.16, 1, 0.3, 1)'
    heroTextRef.value.style.transform = ''
    setTimeout(() => { if (heroTextRef.value) heroTextRef.value.style.transition = '' }, 900)
  }
}
function onHeroEnter() {
  heroSectionRef.value?.style.setProperty('--spot-opacity', '1')
}

onMounted(() => {
  // Entrance animation
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches && heroTextRef.value) {
    const hero = heroTextRef.value
    const hint = heroSectionRef.value?.querySelector('.hero-scroll-hint')
    gsap.timeline({ delay: 0.1 })
      .from(hero.querySelector('.hero-eyebrow'),    { y: 22, opacity: 0, duration: 0.7,  ease: 'power3.out' })
      .from(hero.querySelector('.hero-title-wrap'), { y: 30, opacity: 0, duration: 0.85, ease: 'power3.out' }, '-=0.5')
      .from(hero.querySelector('.hero-title-rule'), { scaleX: 0, opacity: 0, transformOrigin: 'left center', duration: 0.55, ease: 'power3.out' }, '-=0.55')
      .from(hero.querySelector('.hero-desc'),       { y: 18, opacity: 0, duration: 0.65, ease: 'power3.out' }, '-=0.45')
      .from(hero.querySelector('.hero-actions'),    { y: 18, opacity: 0, duration: 0.6,  ease: 'power3.out' }, '-=0.4')
      .from(hint,                                   { opacity: 0, duration: 0.55, ease: 'power2.out' }, '-=0.2')
  }

  window.addEventListener('mousemove', onMouseMove)
  heroSectionRef.value?.addEventListener('mouseleave', onHeroLeave)
  heroSectionRef.value?.addEventListener('mouseenter', onHeroEnter)

  const subscribe = (instance: any) => {
    scrollUnsubscribe = (e) => onScroll(e)
    instance.on('scroll', scrollUnsubscribe)
  }
  if (lenis.value) {
    subscribe(lenis.value)
  } else {
    const unwatch = watch(lenis, (instance) => {
      if (instance) { subscribe(instance); unwatch() }
    })
  }
})

onUnmounted(() => {
  window.removeEventListener('mousemove', onMouseMove)
  heroSectionRef.value?.removeEventListener('mouseleave', onHeroLeave)
  heroSectionRef.value?.removeEventListener('mouseenter', onHeroEnter)
  cancelAnimationFrame(rafMouse!)
  if (lenis.value && scrollUnsubscribe) lenis.value.off('scroll', scrollUnsubscribe)
})
</script>

<style scoped>
.hero {
  position: relative;
  height: 100vh;
  min-height: 620px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: var(--dark);
}
.hero-bg {
  position: absolute;
  inset: -29%;
  background: url(/hero-bg2.webp) 45% center / auto 65% no-repeat;
  will-change: transform;
  z-index: 0;
}
.hero-overlay {
  position: absolute;
  inset: 0;
  z-index: 1;
  background:
    linear-gradient(to right, rgba(14,17,36,0.45) 0%, rgba(14,17,36,0.15) 45%, transparent 100%),
    linear-gradient(to top, rgba(14,17,36,0.5) 0%, transparent 40%);
}
.hero-grid, .hero-spotlight { display: none; }

.hero-body {
  position: relative;
  z-index: 3;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 clamp(24px, 5vw, 72px) 0;
}
.hero-text {
  width: 100%;
  max-width: 100%;
  will-change: transform;
  transform-origin: left bottom;
  backface-visibility: hidden;
}
.hero-eyebrow {
  font-family: 'Outfit', sans-serif !important;
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 5px;
  text-transform: uppercase;
  color: rgba(255,255,255,0.55);
  margin-bottom: 2rem;
}
.eyebrow-line {
  display: inline-block;
  width: 30px;
  height: 1.5px;
  background: var(--primary);
  flex-shrink: 0;
  animation: lineExpand 0.7s cubic-bezier(0.16,1,0.3,1) 0.1s both;
}
.eyebrow-text { animation: fadeIn 0.6s ease 0.52s both; }

@keyframes lineExpand {
  from { width: 0; opacity: 0; }
  to   { width: 30px; opacity: 1; }
}
@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}

.hero-title-wrap {
  overflow: hidden;
  padding-bottom: 0.12em;
  margin-bottom: 0;
}
.hero-title {
  font-family: 'Outfit', sans-serif !important;
  font-size: clamp(56px, 10.2vw, 148px);
  font-weight: 800; /* Refined weight for a cleaner look */
  line-height: 0.95;
  letter-spacing: -0.015em; /* Tighter spacing for modern geometric impact */
  background: linear-gradient(to bottom, #ffffff 50%, #e2e8f0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 10px 20px rgba(0,0,0,0.3));
  margin-bottom: 0;
  animation: titleSlideUp 1.0s cubic-bezier(0.16,1,0.3,1) 0.24s both;
}
.hero-title-sub {
  font-family: 'Outfit', sans-serif !important;
  font-size: clamp(12px, 1.5vw, 22px);
  font-weight: 500;
  letter-spacing: 6px;
  color: rgba(255,255,255,0.80);
  margin: 14px 0 0 12px;
  white-space: nowrap;
  animation: titleSlideUp 1.0s cubic-bezier(0.16,1,0.3,1) 0.34s both;
}
@keyframes titleSlideUp {
  from { transform: translateY(110%); opacity: 0; }
  to   { transform: translateY(0); opacity: 1; }
}

.hero-title-rule {
  display: block;
  width: 80px;
  height: 1px;
  background: linear-gradient(to right, var(--accent), transparent);
  margin: 24px 0 20px;
  animation: lineExpand2 0.9s cubic-bezier(0.16,1,0.3,1) 0.5s both;
}
@keyframes lineExpand2 {
  from { width: 0; opacity: 0; }
  to   { width: 80px; opacity: 1; }
}

.hero-desc {
  font-size: clamp(13px, 1.05vw, 16px);
  color: rgba(255,255,255,0.68);
  line-height: 1.85;
  max-width: 440px;
  margin-bottom: 2rem;
  animation: fadeUp 0.9s cubic-bezier(0.16,1,0.3,1) 0.52s both;
}
.hero-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  animation: fadeUp 0.9s cubic-bezier(0.16,1,0.3,1) 0.5s both;
}
.btn-ghost {
  display: inline-block;
  padding: 10px 28px;
  border-radius: 8px;
  font-weight: 500;
  font-size: 1rem;
  cursor: pointer;
  letter-spacing: 1.5px;
  border: 1.5px solid rgba(255,255,255,0.25);
  color: rgba(255,255,255,0.82);
  background: transparent;
  transition: border-color 0.25s, background 0.25s, color 0.25s;
}
.btn-ghost:hover {
  border-color: rgba(255,255,255,0.6);
  background: rgba(255,255,255,0.07);
  color: #fff;
}

.hero-scroll-hint {
  position: absolute;
  bottom: 48px;
  right: 36px;
  z-index: 3;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}
.hero-scroll-hint span {
  font-size: 9px;
  letter-spacing: 2.5px;
  text-transform: uppercase;
  color: rgba(255,255,255,0.28);
  writing-mode: vertical-rl;
}
.scroll-bar {
  width: 1px;
  height: 56px;
  background: linear-gradient(to bottom, rgba(255,255,255,0.5), transparent);
  animation: scrollDrop 2s ease-in-out infinite;
}
@keyframes scrollDrop {
  0%, 100% { opacity: 0.3; transform: scaleY(0.5) translateY(-10px); }
  60%       { opacity: 1;   transform: scaleY(1) translateY(0); }
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(26px); }
  to   { opacity: 1; transform: translateY(0); }
}

@media (max-width: 600px) {
  .hero-title { letter-spacing: 3px; }
  .hero-body  { padding: 0 28px 72px; align-items: flex-end; }
  .hero-scroll-hint { display: none; }
}
@media (hover: none) {
  .hero-bg { transform: none !important; }
}
</style>
