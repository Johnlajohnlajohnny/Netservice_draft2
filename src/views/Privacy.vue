<template>
  <div class="privacy-page">
    
    <!-- ══ PAGE BANNER ══ -->
    <PageBanner 
      :eyebrow="t('privacy.eyebrow')"
      :title="t('privacy.banner')"
      :subtitle="t('footer.tagline')"
    />

    <!-- ══ PRIVACY CONTENT ══ -->
    <PrivacySection />

  </div>
</template>

<script setup lang="ts">
import { useLocale } from '../composables/useLocale'
import PageBanner from '../components/PageBanner.vue'
import PrivacySection from '../components/privacy/PrivacySection.vue'

const { t } = useLocale()
</script>
