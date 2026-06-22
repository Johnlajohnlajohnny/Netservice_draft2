<template>
  <div class="partners-page">
    
    <!-- ══ PAGE BANNER ══ -->
    <PageBanner 
      :eyebrow="t('partners.eyebrow')"
      :title="t('partners.banner')"
      :subtitle="t('footer.tagline')"
    />

    <!-- ══ PARTNERS CONTENT ══ -->
    <PartnersSection />

    <!-- ══ CTA ══ -->
    <CtaBand />

  </div>
</template>

<script setup lang="ts">
import { useLocale } from '../composables/useLocale'
import PageBanner from '../components/PageBanner.vue'
import PartnersSection from '../components/partners/PartnersSection.vue'
import CtaBand from '../components/home/CtaBand.vue'

const { t } = useLocale()
</script>
