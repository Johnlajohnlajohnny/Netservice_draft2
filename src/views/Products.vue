<template>
  <div class="products-page">
    <PageBanner :eyebrow="t('products.eyebrow')" :title="t('products.banner')" :subtitle="t('footer.tagline')" />
    <ExpertiseSection />
    <CtaBand />
  </div>
</template>

<script setup lang="ts">
import { useLocale } from '../composables/useLocale'
import PageBanner      from '../components/PageBanner.vue'
import ExpertiseSection from '../components/products/ExpertiseSection.vue'
import CtaBand         from '../components/home/CtaBand.vue'

const { t } = useLocale()
</script>
