<template>
  <section class="privacy-section">
    <div class="section-inner">

      <PrivacyPolicyList />

    </div>
  </section>
</template>

<script setup lang="ts">
import { useLocale } from '../../composables/useLocale'
import PrivacyPolicyList from './PrivacyPolicyList.vue'

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
  margin-bottom: 2rem;
}
.block-title.centered { text-align: center; }

.section-inner {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 24px;
}

/* ─────────────────────────────────────────
   PRIVACY CONTENT
───────────────────────────────────────── */
.privacy-section {
  padding: 100px 0;
  background: #ffffff;
}
.privacy-header {
  margin-bottom: 60px;
  text-align: center;
}

@media (max-width: 768px) {
  .privacy-section {
    padding: 72px 0;
  }
}
</style>
