<template>
  <div class="about-page">
    <!-- PageBanner replaces the old AboutBanner.vue (which was a hardcoded copy) -->
    <PageBanner :eyebrow="t('about.eyebrow')" :title="t('about.banner')" :subtitle="t('footer.tagline')" />
    <CompanyProfile />
    <StatsStrip />
    <VisionSection />
    <StrategiesSection />
    <AboutClients />
    <CertificationsSection />
    <CtaBand />
  </div>
</template>

<script setup lang="ts">
import { useLocale } from '../composables/useLocale'
import PageBanner         from '../components/PageBanner.vue'
import CompanyProfile     from '../components/about/CompanyProfile.vue'
import StatsStrip         from '../components/about/StatsStrip.vue'
import VisionSection      from '../components/about/VisionSection.vue'
import StrategiesSection  from '../components/about/StrategiesSection.vue'
import AboutClients       from '../components/about/AboutClients.vue'
import CertificationsSection from '../components/about/CertificationsSection.vue'
import CtaBand            from '../components/home/CtaBand.vue'

const { t } = useLocale()
</script>
