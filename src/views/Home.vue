<template>
  <div>
    <!-- Mobile optimized layout -->
    <div v-if="isMobile" class="mobile-layout">
      <HeroSectionMobile />
      <StatsSection />
      <AboutSectionMobile />
      <ServicesSectionMobile />
      <ClientsSection />
      <LatestProjects />
      <CtaBand />
      <PortfolioSectionMobile />
      <NewsSection />
    </div>

    <!-- Original Desktop layout (100% Unaffected) -->
    <div v-else class="desktop-layout">
      <HeroSection />
      <StatsSection />
      <AboutSection />
      <ServicesSection />
      <ClientsSection />
      <LatestProjects />
      <CtaBand />
      <PortfolioSection />
      <NewsSection />
    </div>
  </div>
</template>

<script setup lang="ts">
import { watch, nextTick } from 'vue'
import { useLenis } from '../composables/useLenis'
import { useScrollReveal } from '../composables/useScrollReveal'
import { useDevice } from '../composables/useDevice'

// Desktop sections
import HeroSection      from '../components/home/HeroSection.vue'
import StatsSection     from '../components/home/StatsSection.vue'
import AboutSection     from '../components/home/AboutSection.vue'
import ServicesSection  from '../components/home/ServicesSection.vue'
import ClientsSection   from '../components/home/ClientsSection.vue'
import LatestProjects   from '../components/home/LatestProjects.vue'
import CtaBand          from '../components/home/CtaBand.vue'
import PortfolioSection from '../components/home/PortfolioSection.vue'
import NewsSection      from '../components/home/NewsSection.vue'

// Mobile sections
import HeroSectionMobile      from '../components/home/mobile/HeroSectionMobile.vue'
import AboutSectionMobile      from '../components/home/mobile/AboutSectionMobile.vue'
import ServicesSectionMobile  from '../components/home/mobile/ServicesSectionMobile.vue'
import PortfolioSectionMobile from '../components/home/mobile/PortfolioSectionMobile.vue'

useLenis()
const { observe } = useScrollReveal()
const { isMobile } = useDevice()

// Re-observe elements when switching layout dynamically (e.g. browser resizing)
watch(isMobile, () => {
  nextTick(() => {
    observe()
  })
})
</script>
