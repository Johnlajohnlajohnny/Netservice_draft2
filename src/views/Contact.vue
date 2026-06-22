<template>
  <div class="contact-page">
    
    <!-- ══ PAGE BANNER ══ -->
    <PageBanner 
      :eyebrow="t('contact.eyebrow')"
      :title="t('contact.banner')"
      :subtitle="t('footer.tagline')"
    />

    <!-- ══ CONTACT CONTENT ══ -->
    <ContactSection />

  </div>
</template>

<script setup lang="ts">
import { useLocale } from '../composables/useLocale'
import PageBanner from '../components/PageBanner.vue'
import ContactSection from '../components/contact/ContactSection.vue'

const { t } = useLocale()
</script>
