<template>
  <section class="stats-strip">
    <div class="stats-strip-inner">
      <div class="strip-item" data-reveal data-delay="1">
        <div class="strip-number">
          <span class="strip-count" data-count="19">19</span>
        </div>
        <div class="strip-label">{{ t('stat.years') }}</div>
        <div class="strip-sub">{{ t('stat.years.sub') }}</div>
      </div>
      <div class="strip-item" data-reveal data-delay="2">
        <div class="strip-number">
          <span class="strip-count" data-count="48">48</span>
        </div>
        <div class="strip-label">{{ t('stat.projects') }}</div>
        <div class="strip-sub">{{ t('stat.projects.sub') }}</div>
      </div>
      <div class="strip-item" data-reveal data-delay="3">
        <div class="strip-number">
          <span class="strip-count" data-count="2441">2,441</span><span class="strip-plus">+</span>
        </div>
        <div class="strip-label">{{ t('stat.value') }}</div>
        <div class="strip-sub">{{ t('stat.value.sub') }}</div>
      </div>
      <div class="strip-item" data-reveal data-delay="4">
        <div class="strip-number">
          <span class="strip-count" data-count="11">11</span>
        </div>
        <div class="strip-label">{{ t('stat.clients') }}</div>
        <div class="strip-sub">{{ t('stat.clients.sub') }}</div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLocale } from '../../composables/useLocale'

const { t } = useLocale()

onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  document.querySelectorAll<HTMLElement>('.strip-count').forEach((el) => {
    const target = Number(el.dataset.count)
    const obj = { val: 0 }

    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to(obj, {
          val: target,
          duration: 1.8,
          ease: 'power2.out',
          onUpdate() {
            el.textContent = Math.round(obj.val).toLocaleString()
          },
        })
      },
    })
  })
})
</script>

<style scoped>
.stats-strip { background: #060912; padding: 80px 0; border-top: 1px solid rgba(255,255,255,0.04); border-bottom: 1px solid rgba(255,255,255,0.04); }
.stats-strip-inner { max-width: 1280px; margin: 0 auto; padding: 0 24px; display: grid; grid-template-columns: repeat(4, 1fr); }
.strip-item { text-align: center; padding: 0 24px; position: relative; }
.strip-item + .strip-item::before { content: ''; position: absolute; left: 0; top: 50%; transform: translateY(-50%); height: 55%; width: 1px; background: rgba(255,255,255,0.08); }
.strip-number { font-size: clamp(38px, 4.5vw, 58px); font-weight: 800; color: #fff; line-height: 1; margin-bottom: 0.6rem; letter-spacing: -1px; }
.strip-plus { font-size: 0.55em; color: var(--accent); vertical-align: 0.45em; margin-left: 4px; }
.strip-label { font-size: 13px; line-height: 1.3; color: rgba(255,255,255,0.55); font-weight: 500; margin-bottom: 4px; min-height: 2.6em; }   /* reserve 2 lines so the sub-label stays aligned across EN/TH */
.strip-sub { font-size: 11px; color: rgba(255,255,255,0.66); letter-spacing: 0.5px; }   /* WCAG AA: raised from 0.55 */

@media (max-width: 1024px) {
  .stats-strip-inner { grid-template-columns: repeat(2, 1fr); gap: 40px 0; }
  .strip-item:nth-child(3)::before { display: none; }
}
@media (max-width: 768px) {
  .stats-strip { padding: 60px 0; }
}
@media (max-width: 500px) {
  .stats-strip-inner { grid-template-columns: repeat(2, 1fr); }
  .strip-item::before { display: none !important; }
}
</style>
