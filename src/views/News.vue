<template>
  <div class="news-page">

    <!-- ══ PAGE BANNER ══ -->
    <PageBanner
      :eyebrow="t('news.eyebrow')"
      :title="t('news.banner')"
      :subtitle="t('footer.tagline')"
    />

    <!-- ══ NETSERVICE NEWS ══ -->
    <CompanyNews />

    <!-- ══ SECTION DIVIDER ══ -->
    <div class="news-divider" aria-hidden="true">
      <div class="divider-inner">
        <span class="divider-line"></span>
        <span class="divider-label">{{ t('news.sectionTech') }}</span>
        <span class="divider-line"></span>
      </div>
    </div>

    <!-- ══ TECH NEWS ══ -->
    <TechNews />

    <!-- ══ CTA ══ -->
    <CtaBand />

  </div>
</template>

<style scoped>
.news-divider {
  background: #f4f6fb;
  padding: 0 40px;
}
.divider-inner {
  max-width: 1380px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 32px 0;
  border-top: 1px solid rgba(0,0,0,0.07);
}
.divider-line {
  flex: 1;
  height: 1px;
  background: rgba(0,0,0,0.08);
}
.divider-label {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: var(--primary);
  white-space: nowrap;
}
@media (max-width: 640px) {
  .news-divider { padding: 0 20px; }
}
</style>

<script setup lang="ts">
import { useLocale } from '../composables/useLocale'
import PageBanner  from '../components/PageBanner.vue'
import CompanyNews from '../components/news/CompanyNews.vue'
import TechNews    from '../components/news/TechNews.vue'
import CtaBand     from '../components/home/CtaBand.vue'

const { t } = useLocale()
</script>
