<template>
  <div class="cg-page">

    <!-- ══ PAGE BANNER ══ -->
    <PageBanner
      :eyebrow="t('cg.eyebrow')"
      :title="t('cg.banner')"
      :subtitle="t('footer.tagline')"
    />

    <!-- ══ COMPLIANCE LISTING ══ -->
    <ComplianceListing />

    <!-- ══ CTA ══ -->
    <CtaBand />

  </div>
</template>

<script setup lang="ts">
import { useLocale } from '../composables/useLocale'
import PageBanner        from '../components/PageBanner.vue'
import ComplianceListing from '../components/governance/ComplianceListing.vue'
import CtaBand           from '../components/home/CtaBand.vue'

const { t } = useLocale()
</script>
