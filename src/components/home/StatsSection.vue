<template>
  <section class="stats-section" ref="statsRef">
    <div class="stats-bar" :class="{ 'in-view': statsVisible }">
      <div class="hero-stat" v-for="(s, i) in stats" :key="s.label">
        <template v-if="s.value !== 'certs'">
          <div class="stat-number">
            <CountUp v-if="statsVisible" :text="s.value" :delay="i * 100" :duration="1.8" />
          </div>
          <div class="stat-label">{{ t(s.label) }}</div>
          <div class="stat-sub">{{ t(s.sub) }}</div>
        </template>
        <template v-else>
          <div class="stat-certs">
            <img src="/cert1.jpg" alt="CMMI Level 3" class="stat-cert-img" />
            <img src="/cert2.png" alt="ISO 29110" class="stat-cert-img" />
          </div>
          <div class="stat-label">{{ t(s.label) }}</div>
          <div class="stat-sub">{{ t(s.sub) }}</div>
        </template>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useLocale } from '../../composables/useLocale'
import CountUp from '../CountUp.vue'

const { t } = useLocale()

const statsRef     = ref<HTMLElement | null>(null)
const statsVisible = ref(false)
let statsObs: IntersectionObserver | null = null

const stats = [
  { value: '19',     label: 'stat.years',    sub: 'stat.years.sub' },
  { value: '48',      label: 'stat.projects', sub: 'stat.projects.sub' },
  { value: '2,441+', label: 'stat.value',    sub: 'stat.value.sub' },
  { value: 'certs',  label: 'stat.certs',    sub: 'stat.certs.sub' },
]

onMounted(() => {
  if (statsRef.value) {
    statsObs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          statsVisible.value = true
          statsObs?.disconnect()
        }
      },
      { threshold: 0.25 }
    )
    statsObs.observe(statsRef.value)
  }
})

onUnmounted(() => { statsObs?.disconnect() })
</script>

<style scoped>
.stats-section {
  background: var(--dark);
  padding: 32px 0;
  position: relative;
  z-index: 2;
}
.stats-bar {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  max-width: 1280px;
  margin: 0 auto;
  border-top: 1px solid rgba(255,255,255,0.08);
  border-bottom: 1px solid rgba(255,255,255,0.08);
}
.hero-stat { opacity: 0; transform: translateY(14px); }
.stats-bar.in-view .hero-stat:nth-child(1) { animation: statIn 0.55s cubic-bezier(0.16,1,0.3,1) 0.00s both; }
.stats-bar.in-view .hero-stat:nth-child(2) { animation: statIn 0.55s cubic-bezier(0.16,1,0.3,1) 0.10s both; }
.stats-bar.in-view .hero-stat:nth-child(3) { animation: statIn 0.55s cubic-bezier(0.16,1,0.3,1) 0.20s both; }
.stats-bar.in-view .hero-stat:nth-child(4) { animation: statIn 0.55s cubic-bezier(0.16,1,0.3,1) 0.30s both; }

@keyframes statIn {
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: none; }
}
.hero-stat {
  padding: 12px 48px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  position: relative;
}
.hero-stat:not(:last-child)::after {
  content: '';
  position: absolute;
  right: 0; top: 18%; bottom: 18%;
  width: 1px;
  background: linear-gradient(to bottom, transparent, rgba(255,255,255,0.08), transparent);
}
.stat-number {
  font-size: clamp(36px, 3.8vw, 60px);
  font-weight: 700;
  line-height: 1.12;
  padding-bottom: 2px;
  letter-spacing: -1px;
  font-variant-numeric: tabular-nums;
  background: linear-gradient(135deg, #ffffff 30%, var(--accent) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.stat-label {
  font-size: 12px;
  line-height: 1.4;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  color: rgba(255,255,255,0.85);
  margin-top: 8px;
  min-height: 2.8em;   /* reserve 2 lines so the sub-label stays aligned across EN/TH */
}
.stat-sub {
  font-size: 11px;
  color: rgba(255,255,255,0.66);   /* WCAG AA: raised from 0.48 */
  letter-spacing: 0.5px;
  margin-top: 2px;
}
.stat-certs {
  display: flex;
  align-items: center;
  gap: 16px;
  height: 60px;
}
.stat-cert-img {
  max-height: 52px;
  width: auto;
  object-fit: contain;
  filter: none;
  transition: transform 0.3s ease;
}
.stat-cert-img:hover {
  transform: scale(1.08) translateY(-2px);
}

@media (max-width: 900px) {
  .stats-bar { grid-template-columns: repeat(2, 1fr); }
  .hero-stat:nth-child(2)::after { display: none; }
  .hero-stat:nth-child(3),
  .hero-stat:nth-child(4) { border-top: 1px solid rgba(255,255,255,0.08); }
  .hero-stat:nth-child(3)::after { display: none; }
}
</style>
