<template>
  <section class="partners-section">
    <div class="section-inner">
      
      <div class="partners-header" data-reveal>
        <p class="eyebrow centered">{{ t('nav.partners') }}</p>
        <h2 class="block-title centered">{{ t('partners.title') }}</h2>
      </div>

      <!-- Parent & Shareholder Network -->
      <CorporatePartners />

      <!-- Alliance Categories -->
      <AllianceNetwork />

    </div>
  </section>
</template>

<script setup lang="ts">
import { useLocale } from '../../composables/useLocale'
import CorporatePartners from './CorporatePartners.vue'
import AllianceNetwork from './AllianceNetwork.vue'

const { t } = useLocale()
</script>

<style scoped>
/* ─────────────────────────────────────────
   SHARED UTILITIES
───────────────────────────────────────── */
.eyebrow {
  display: block;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: var(--primary);
  margin-bottom: 0.75rem;
}
.eyebrow.centered { text-align: center; }

.block-title {
  font-size: clamp(26px, 3.2vw, 42px);
  font-weight: 700;
  line-height: 1.2;
  color: var(--text-dark);
  margin-bottom: 3.5rem;
}
.block-title.centered { text-align: center; }

/* .section-inner is defined globally in style.css — no override needed */

/* ─────────────────────────────────────────
   PARTNERS CONTENT
───────────────────────────────────────── */
.partners-section {
  padding: 100px 0;
  background: #ffffff;
}
.partners-header {
  margin-bottom: 60px;
}

@media (max-width: 768px) {
  .partners-section {
    padding: 72px 0;
  }
}
</style>
