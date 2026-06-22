<template>
  <section class="edoc-section">
    <div class="section-inner">

      <div class="edoc-header" data-reveal>
        <p class="eyebrow">{{ t('products.edocTitle') }}</p>
        <h2 class="section-heading">{{ t('products.edocSub') }}</h2>
      </div>

      <div class="timeline-container">
        <div class="timeline-step" data-reveal data-delay="1">
          <div class="step-badge">01</div>
          <div class="step-card">
            <div class="step-card-header"><span class="step-dot"></span><h5>{{ t('products.step1.title') }}</h5></div>
            <p>{{ t('products.step1.desc') }}</p>
          </div>
        </div>
        <div class="timeline-step" data-reveal data-delay="2">
          <div class="step-badge">02</div>
          <div class="step-card">
            <div class="step-card-header"><span class="step-dot"></span><h5>{{ t('products.step2.title') }}</h5></div>
            <p>{{ t('products.step2.desc') }}</p>
          </div>
        </div>
        <div class="timeline-step" data-reveal data-delay="3">
          <div class="step-badge">03</div>
          <div class="step-card">
            <div class="step-card-header"><span class="step-dot"></span><h5>{{ t('products.step3.title') }}</h5></div>
            <p>{{ t('products.step3.desc') }}</p>
          </div>
        </div>
      </div>

      <div class="highlights-container">
        <div class="highlights-header" data-reveal>
          <h3 class="highlight-title">{{ t('products.highlightTitle') }}</h3>
          <div class="title-line"></div>
        </div>
        <div class="highlights-grid" ref="gridRef">
          <div
            class="highlight-item"
            v-for="n in 7"
            :key="n"
          >
            <div class="hi-icon-wrap">
              <svg class="hi-check-svg" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            <div class="hi-body">
              <strong>{{ t(`products.h${n}.title`) }}</strong>
              <p>{{ t(`products.h${n}.desc`) }}</p>
            </div>
          </div>
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

const { t } = useLocale()
const gridRef = ref<HTMLElement | null>(null)
let st: ScrollTrigger | null = null

onMounted(() => {
  if (!gridRef.value) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  const items = gridRef.value.querySelectorAll<HTMLElement>('.highlight-item')
  gsap.set(items, { opacity: 0, y: 30 })

  st = ScrollTrigger.create({
    trigger: gridRef.value,
    start: 'top 82%',
    once: true,
    onEnter: () => {
      gsap.to(items, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power3.out',
        stagger: 0.1,
        clearProps: 'transform,opacity',
      })
    },
  })
})

onUnmounted(() => { st?.kill() })
</script>

<style scoped>
.edoc-section { padding: 110px 0; background: #060912; }
.eyebrow { display: block; font-size: 11px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: var(--primary); margin-bottom: 0.75rem; }
.section-heading { font-size: clamp(24px, 3.2vw, 40px); font-weight: 800; line-height: 1.2; color: #ffffff; margin-bottom: 1.5rem; }
.edoc-header { margin-bottom: 60px; }
.timeline-container { display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px; margin-bottom: 100px; position: relative; }
.timeline-container::before { content: ''; position: absolute; top: 96px; left: 24px; right: 24px; height: 2px; background: rgba(255,255,255,0.08); z-index: 0; }
.timeline-step { position: relative; z-index: 1; }
.step-badge { width: 48px; height: 48px; border-radius: 50%; background: var(--primary); color: #ffffff; display: flex; align-items: center; justify-content: center; font-size: 18px; font-weight: 800; margin-bottom: 24px; box-shadow: 0 4px 16px rgba(49,99,149,0.4); }
.step-card { background: rgba(255,255,255,0.05); border-radius: 16px; padding: 32px; box-shadow: none; border: 1px solid rgba(255,255,255,0.08); height: calc(100% - 72px); transition: transform 0.3s, box-shadow 0.3s, background 0.3s, border-color 0.3s; }
.step-card:hover { transform: translateY(-4px); background: rgba(255,255,255,0.09); border-color: rgba(49,99,149,0.4); box-shadow: 0 16px 40px rgba(0,0,0,0.3); }
.step-card-header { display: flex; align-items: center; gap: 12px; margin-bottom: 1rem; }
.step-dot { width: 8px; height: 8px; background: var(--primary); border-radius: 50%; }
.step-card h5 { font-size: 16px; font-weight: 700; color: #ffffff; }
.step-card p { font-size: 13.5px; color: rgba(255,255,255,0.62); line-height: 1.7; }
.highlights-container { background: rgba(255,255,255,0.04); border-radius: 24px; padding: 60px; box-shadow: none; border: 1px solid rgba(255,255,255,0.07); }
.highlights-header { margin-bottom: 40px; }
.highlight-title { font-size: 24px; font-weight: 800; color: #ffffff; margin-bottom: 12px; }
.title-line { width: 50px; height: 3px; background: var(--primary); }
.highlights-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
.highlight-item { display: flex; gap: 16px; align-items: flex-start; padding: 20px; border-radius: 12px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.06); transition: background 0.3s, border-color 0.3s; }
.highlight-item:hover { background: rgba(255,255,255,0.08); border-color: rgba(49,99,149,0.35); }
.hi-icon-wrap { width: 28px; height: 28px; border-radius: 8px; background: rgba(49,99,149,0.25); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.hi-check-svg { width: 14px; height: 14px; color: var(--primary); }
.hi-body strong { display: block; font-size: 14.5px; font-weight: 700; color: #ffffff; margin-bottom: 6px; }
.hi-body p { font-size: 12.5px; color: rgba(255,255,255,0.62); line-height: 1.6; }

@media (max-width: 1200px) { .highlights-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 1024px) { .timeline-container { grid-template-columns: 1fr; gap: 40px; } .timeline-container::before { display: none; } .step-badge { margin-bottom: 12px; } .step-card { height: auto; } }
@media (max-width: 768px) { .edoc-section { padding: 72px 0; } .highlights-container { padding: 32px 24px; } }
@media (max-width: 600px) { .highlights-grid { grid-template-columns: 1fr; } }
</style>
