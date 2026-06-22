<template>
  <section class="strategies-section">
    <div class="section-inner">

      <div class="strategies-header" data-reveal>
        <p class="eyebrow centered">{{ t('about.strategiesTitle') }}</p>
        <h2 class="block-title centered">{{ locale === 'th' ? 'แผนกลยุทธ์และการเติบโต' : 'Strategic Roadmap & Growth' }}</h2>
      </div>

      <div class="strategies-roadmap">
        <div class="roadmap-connector"></div>
        <div
          class="roadmap-step"
          v-for="(sKey, index) in ['about.s1', 'about.s2', 'about.s3']"
          :key="index"
          data-reveal
          :data-delay="index + 1"
        >
          <div class="roadmap-node">0{{ index + 1 }}</div>
          <div class="roadmap-card">
            <p class="strategy-text">{{ t(sKey) }}</p>
          </div>
        </div>
      </div>

      <div class="ccim-container" data-reveal>
        <div class="ccim-header-block">
          <h3 class="ccim-title">{{ locale === 'th' ? 'ปัจจัยสู่ความสำเร็จ (CCIM)' : 'Key Success Factors (CCIM)' }}</h3>
          <p class="ccim-desc">{{ t('about.s4') }}</p>
        </div>
        <div class="ccim-grid">
          <div class="ccim-card" data-reveal data-delay="1" style="--accent: #316395;">
            <div class="ccim-card-header"><span class="ccim-letter">C</span><span class="ccim-label">{{ t('about.ccim.c.factor') }}</span></div>
            <p class="ccim-text">{{ t('about.ccim.c.action') }}</p>
          </div>
          <div class="ccim-card" data-reveal data-delay="2" style="--accent: #8b3a8f;">
            <div class="ccim-card-header"><span class="ccim-letter">C</span><span class="ccim-label">{{ t('about.ccim.cv.factor') }}</span></div>
            <p class="ccim-text">{{ t('about.ccim.cv.action') }}</p>
          </div>
          <div class="ccim-card" data-reveal data-delay="3" style="--accent: #e67e22;">
            <div class="ccim-card-header"><span class="ccim-letter">I</span><span class="ccim-label">{{ t('about.ccim.i.factor') }}</span></div>
            <p class="ccim-text">{{ t('about.ccim.i.action') }}</p>
          </div>
          <div class="ccim-card" data-reveal data-delay="4" style="--accent: #2a7d4f;">
            <div class="ccim-card-header"><span class="ccim-letter">M</span><span class="ccim-label">{{ t('about.ccim.m.factor') }}</span></div>
            <p class="ccim-text">{{ t('about.ccim.m.action') }}</p>
          </div>
        </div>
      </div>

    </div>
  </section>
</template>

<script setup lang="ts">
import { useLocale } from '../../composables/useLocale'
const { t, locale } = useLocale()
</script>

<style scoped>
.strategies-section { padding: 120px 0; background: #060912; }
.eyebrow { display: block; font-size: 11px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: rgba(255,255,255,0.5); margin-bottom: 0.75rem; }
.eyebrow.centered { text-align: center; }
.block-title { font-size: clamp(26px, 3.2vw, 42px); font-weight: 700; line-height: 1.2; color: #fff; margin-bottom: 2.5rem; }
.block-title.centered { text-align: center; margin-bottom: 1.5rem; }
.strategies-header { margin-bottom: 64px; }
.strategies-roadmap { position: relative; display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px; margin-bottom: 96px; padding: 20px 0; }
.roadmap-connector { position: absolute; left: 0; right: 0; top: 40px; height: 2px; background: rgba(255,255,255,0.06); z-index: 0; }
.roadmap-step { position: relative; z-index: 1; display: flex; flex-direction: column; align-items: center; }
.roadmap-node { width: 44px; height: 44px; border-radius: 50%; background: rgba(49,99,149,0.25); border: 2px solid var(--accent); display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 700; color: var(--accent); box-shadow: 0 0 0 6px rgba(49,99,149,0.08), 0 8px 24px rgba(0,0,0,0.3); margin-bottom: 1.75rem; transition: transform 0.3s cubic-bezier(0.16,1,0.3,1), background-color 0.3s, color 0.3s; }
.roadmap-step:hover .roadmap-node { transform: scale(1.12); background: var(--primary); color: #fff; border-color: var(--primary); }
.roadmap-card { background: rgba(255,255,255,0.05); border-radius: 18px; padding: 32px 28px; border: 1px solid rgba(255,255,255,0.07); text-align: center; transition: transform 0.35s cubic-bezier(0.16,1,0.3,1), box-shadow 0.35s, background 0.3s; }
.roadmap-step:hover .roadmap-card { transform: translateY(-5px); background: rgba(255,255,255,0.08); box-shadow: 0 16px 44px rgba(0,0,0,0.3); }
.strategy-text { font-size: 14.5px; color: rgba(255,255,255,0.65); line-height: 1.8; font-weight: 400; }
.ccim-container { border-radius: 24px; background: rgba(255,255,255,0.04); padding: 56px; border: 1px solid rgba(255,255,255,0.07); }
.ccim-header-block { max-width: 720px; margin-bottom: 40px; }
.ccim-title { font-size: 24px; font-weight: 800; color: #fff; margin-bottom: 0.75rem; }
.ccim-desc  { font-size: 14.5px; color: rgba(255,255,255,0.62); line-height: 1.7; }
.ccim-grid  { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
.ccim-card { background: rgba(255,255,255,0.05); border-radius: 16px; padding: 28px 24px; border-top: 3px solid var(--accent); transition: transform 0.3s cubic-bezier(0.16,1,0.3,1), box-shadow 0.3s, background 0.2s; }
.ccim-card:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(0,0,0,0.3); background: rgba(255,255,255,0.09); }
.ccim-card-header { display: flex; align-items: center; gap: 10px; margin-bottom: 1rem; }
.ccim-letter { font-size: 32px; font-weight: 800; color: var(--accent); line-height: 1; }
.ccim-label  { font-size: 14px; font-weight: 700; color: rgba(255,255,255,0.85); }
.ccim-text   { font-size: 13px; color: rgba(255,255,255,0.55); line-height: 1.7; }

@media (max-width: 1024px) {
  .strategies-roadmap { grid-template-columns: 1fr; gap: 40px; padding-left: 20px; }
  .roadmap-connector { width: 2px; height: 100%; left: 21px; right: auto; top: 0; }
  .roadmap-step { flex-direction: row; align-items: flex-start; gap: 20px; }
  .roadmap-node { margin-bottom: 0; flex-shrink: 0; }
  .roadmap-card { text-align: left; flex: 1; }
  .ccim-grid { grid-template-columns: repeat(2, 1fr); gap: 16px; }
}
@media (max-width: 768px) {
  .strategies-section { padding: 72px 0; }
  .ccim-container { padding: 32px 24px; }
}
@media (max-width: 500px) {
  .ccim-grid { grid-template-columns: 1fr; }
}
</style>
