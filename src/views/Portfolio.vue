<template>
  <div class="portfolio-container">

    <!-- Desktop: cinematic Three.js intro — skipped when coming from a detail page -->
    <PortfolioCinematic
      v-if="!isMobile && !skipCinematic"
      v-model:introComplete="introComplete"
      v-model:scrollProgress="scrollProgress"
    />

    <!-- Portfolio grid — visible on desktop after intro + always on mobile -->
    <PortfolioGrid
      :projects="featuredProjects"
      :intro-complete="introComplete"
      :is-mobile="isMobile"
    />

  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useDevice } from '../composables/useDevice'
import PortfolioCinematic from '../components/portfolio/PortfolioCinematic.vue'
import PortfolioGrid from '../components/portfolio/PortfolioGrid.vue'
import { featuredProjects } from '../data/portfolioData'

const route = useRoute()
const { isMobile } = useDevice()

const skipCinematic  = route.query.grid === '1' || !!route.query.category
const introComplete  = ref(skipCinematic)
const scrollProgress = ref(0)

// Tell SiteHeader whether the grid is visible so it can enable the scrolled pill state
watch(introComplete, (v) => { if (v) document.body.dataset.portfolioGrid = '1' })
if (skipCinematic) document.body.dataset.portfolioGrid = '1'


// ── Page-level side effects ───────────────────────────────────
// Dark body background prevents #fefefe body bleeding through pin spacer gaps.
// html background is intentionally left untouched so overscroll gutter stays
// invisible (setting it to #060810 caused a dark strip at the top on scroll-up).
onMounted(() => {
  document.body.style.setProperty('background-color', '#060810')
  document.documentElement.style.setProperty('overscroll-behavior-y', 'none')
})
onUnmounted(() => {
  document.body.style.removeProperty('background-color')
  document.documentElement.style.removeProperty('overscroll-behavior-y')
  delete document.body.dataset.portfolioGrid
})
</script>

<style scoped>
/* Scoped overrides to enforce Kanit font globally on Portfolio page (excluding the Playfair serif title) */
.portfolio-container *:not(.floating-title) {
  font-family: 'Kanit', sans-serif !important;
}

.portfolio-container {
  min-height: 100vh;
  background: #060810;
  color: #fff;
  position: relative;
  overflow-x: clip;
}
</style>
