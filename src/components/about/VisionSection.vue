<template>
  <section class="vision-section">
    <div class="vision-inner">
      <p class="eyebrow centered" data-reveal>{{ t('about.visionLabel') }}</p>
      <blockquote class="vision-quote" data-reveal data-delay="1">
        {{ t('about.vision') }}
      </blockquote>
      <div class="vision-divider" data-reveal data-delay="2"></div>
      <p class="vision-meta" data-reveal data-delay="3">
        {{ locale === 'th' ? 'บริษัท เน็ตเซอร์วิส (ประเทศไทย) จำกัด · ก่อตั้งปี พ.ศ. 2550' : 'Netservice (Thailand) Co., Ltd. · Est. 2007' }}
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useLocale } from '../../composables/useLocale'
const { t, locale } = useLocale()
</script>

<style scoped>
.vision-section { background: #fff; padding: 120px 0; overflow: hidden; box-shadow: inset 0 1px 0 rgba(0,0,0,0.07); }
.vision-inner { max-width: 800px; margin: 0 auto; padding: 0 clamp(24px,5vw,72px); text-align: center; }
.eyebrow { display: block; font-size: 11px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: var(--primary); margin-bottom: 0.75rem; }
.eyebrow.centered { text-align: center; }
.vision-quote {
  font-size: clamp(18px, 2.2vw, 26px);
  font-weight: 700;
  color: var(--text-dark);
  line-height: 1.6;
  margin: 0 0 2rem;
  position: relative;
  quotes: '\201C' '\201D';
}
.vision-quote::before,
.vision-quote::after {
  position: absolute;
  font-size: 110px;
  color: rgba(49,99,149,0.08);
  font-family: Georgia, serif;
  line-height: 1;
  pointer-events: none;
}
.vision-quote::before { content: '\201C'; top: -28px; left: -64px; }
.vision-quote::after  { content: '\201D'; bottom: -64px; right: -64px; }
.vision-divider { width: 48px; height: 3px; background: var(--primary); border-radius: 2px; margin: 0 auto 1.5rem; }
.vision-meta { font-size: 12.5px; color: rgba(0,0,0,0.55); letter-spacing: 1px; font-weight: 600; text-transform: uppercase; }

@media (max-width: 768px) { .vision-section { padding: 80px 0; } }
</style>
