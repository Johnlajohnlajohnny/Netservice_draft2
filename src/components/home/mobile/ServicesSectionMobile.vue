<template>
  <section class="services-mobile">
    <div class="services-glow"></div>
    <div class="section-inner">
      <div class="services-header">
        <p class="eyebrow">{{ t('home.servicesEye') }}</p>
        <h2 class="block-title">{{ t('home.productsTitle') }}</h2>
      </div>

      <!-- Tab Buttons for Mobile Selection -->
      <div class="services-tabs-wrap">
        <div class="services-tabs">
          <button 
            v-for="(svc, idx) in services" 
            :key="idx" 
            class="tab-btn" 
            :class="{ active: activeTab === idx }"
            @click="activeTab = idx"
          >
            <span class="tab-icon" v-html="svc.miniIcon"></span>
            <span class="tab-title">{{ svc.tabLabel }}</span>
          </button>
        </div>
      </div>

      <!-- Tab Content Area with Smooth Transitions -->
      <div class="services-content-card">
        <transition name="fade-slide" mode="out-in">
          <div :key="activeTab" class="svc-card-inner">
            <div class="svc-image-banner" :style="{ backgroundImage: `url(${services[activeTab].image})` }">
              <span class="svc-counter">{{ activeTab + 1 }} / 3</span>
            </div>
            
            <div class="svc-body">
              <div class="svc-title-row">
                <div class="svc-icon" v-html="services[activeTab].icon"></div>
                <h3>{{ services[activeTab].title }}</h3>
              </div>
              
              <p class="svc-desc">{{ t(services[activeTab].descKey) }}</p>
              
              <ul class="svc-features">
                <li v-for="feat in services[activeTab].features" :key="feat">
                  <span class="feat-dot"></span>
                  {{ feat }}
                </li>
              </ul>
              
              <ul class="svc-tags">
                <li v-for="tag in services[activeTab].tags" :key="tag">{{ tag }}</li>
              </ul>
              
              <RouterLink to="/products" class="svc-cta">
                {{ t('service.cta') }} <span aria-hidden="true">→</span>
              </RouterLink>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useLocale } from '../../../composables/useLocale'

const { t } = useLocale()
const activeTab = ref(0)

const svgWebApp = `<svg width="24" height="24" viewBox="0 0 448 512" fill="currentColor"><path d="M400 32C426.5 32 448 53.49 448 80V336C448 362.5 426.5 384 400 384H266.7L277.3 416H352C369.7 416 384 430.3 384 448C384 465.7 369.7 480 352 480H96C78.33 480 64 465.7 64 448C64 430.3 78.33 416 96 416H170.7L181.3 384H48C21.49 384 0 362.5 0 336V80C0 53.49 21.49 32 48 32H400zM64 96V320H384V96H64z"/></svg>`
const svgEDoc   = `<svg width="24" height="24" viewBox="0 0 384 512" fill="currentColor"><path d="M224 136V0H24C10.7 0 0 10.7 0 24v464c0 13.3 10.7 24 24 24h336c13.3 0 24-10.7 24-24V160H248c-13.2 0-24-10.8-24-24zm64 236c0 6.6-5.4 12-12 12H108c-6.6 0-12-5.4-12-12v-8c0-6.6 5.4-12 12-12h168c6.6 0 12 5.4 12 12v8zm0-64c0 6.6-5.4 12-12 12H108c-6.6 0-12-5.4-12-12v-8c0-6.6 5.4-12 12-12h168c6.6 0 12 5.4 12 12v8zm0-72v8c0 6.6-5.4 12-12 12H108c-6.6 0-12-5.4-12-12v-8c0-6.6 5.4-12 12-12h168c6.6 0 12 5.4 12 12zm96-153.1L286.1 32C279.1 25 269.8 21 260 21h-4v127h127v-4.1c0-9.7-4-19.1-11.1-26.1z"/></svg>`
const svgGIS    = `<svg width="24" height="24" viewBox="0 0 576 512" fill="currentColor"><path d="M408 120C408 174.6 334.9 271.9 302.8 311.1C295.1 321.6 280.9 321.6 273.2 311.1C241.1 271.9 168 174.6 168 120C168 53.73 221.7 0 288 0C354.3 0 408 53.73 408 120zM288 152C310.1 152 328 134.1 328 112C328 89.91 310.1 72 288 72C265.9 72 248 89.91 248 112C248 134.1 265.9 152 288 152zM432 416c0 35.3-64.2 64-143.5 64S144 451.3 144 416s64.2-64 143.5-64S432 380.7 432 416z"/></svg>`

const services = [
  {
    tabLabel: 'Web & Mobile',
    title: 'Web Application / Mobile Application',
    descKey: 'service.webapp.desc',
    icon: svgWebApp,
    miniIcon: svgWebApp,
    image: '/ser1.webp',
    features: ['Custom workflow & E-Service portals', 'REST / GraphQL API integration', 'Cross-platform mobile-first build'],
    tags: ['Workflow', 'E-Service', 'Web API', 'E-Form'],
  },
  {
    tabLabel: 'E-Document',
    title: 'E-Document Management',
    descKey: 'service.edoc.desc',
    icon: svgEDoc,
    miniIcon: svgEDoc,
    image: '/ser2.webp',
    features: ['Paperless document digitization', 'OCR + Digital Signature pipeline', 'Approval workflow automation'],
    tags: ['Doc Management', 'OCR', 'E-Signature', 'Approval'],
  },
  {
    tabLabel: 'GIS Platform',
    title: 'GIS (Geographic Information System)',
    descKey: 'service.gis.desc',
    icon: svgGIS,
    miniIcon: svgGIS,
    image: '/ser3.webp',
    features: ['Spatial data storage & map layers', 'Custom GIS visualization platform', 'API-connected location services'],
    tags: ['Spatial GIS', 'Map Layer', 'Location API'],
  },
]
</script>

<style scoped>
.services-mobile {
  background: var(--dark);
  padding: 60px 0;
  position: relative;
  overflow: hidden;
}

.services-glow {
  position: absolute;
  top: 50%;
  left: 0;
  width: 250px;
  height: 250px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(49,99,149,0.1) 0%, transparent 70%);
  pointer-events: none;
}

.services-header {
  margin-bottom: 2rem;
}

.services-header .eyebrow {
  color: var(--accent);
  margin-bottom: 0.5rem;
}

.services-header .block-title {
  font-size: 28px;
  color: #fff;
}

.services-tabs-wrap {
  margin-bottom: 20px;
  overflow-x: auto;
  scrollbar-width: none; /* Hide scrollbar for Firefox */
  -ms-overflow-style: none;  /* Hide scrollbar for IE */
  margin-inline: -24px;
  padding-inline: 24px;
}

.services-tabs-wrap::-webkit-scrollbar {
  display: none; /* Hide scrollbar for Chrome, Safari, Opera */
}

.services-tabs {
  display: flex;
  gap: 10px;
  width: max-content;
  padding-bottom: 8px;
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  border-radius: 50px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.04);
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.tab-btn.active {
  background: var(--primary);
  border-color: var(--accent);
  color: #fff;
  box-shadow: 0 4px 12px rgba(49, 99, 149, 0.3);
}

.tab-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.tab-btn.active .tab-icon {
  color: var(--accent);
}

.tab-title {
  font-size: 13px;
  font-weight: 600;
}

.services-content-card {
  background: rgba(10, 13, 28, 0.6);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  overflow: hidden;
  box-shadow: 0 12px 36px rgba(0, 0, 0, 0.4);
}

.svc-image-banner {
  height: 180px;
  background-size: cover;
  background-position: center;
  position: relative;
}

.svc-image-banner::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, transparent 30%, rgba(10, 13, 28, 0.9) 100%);
}

.svc-counter {
  position: absolute;
  top: 14px;
  right: 14px;
  font-size: 11px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.85);
  background: rgba(0, 0, 0, 0.4);
  padding: 3px 9px;
  border-radius: 20px;
  backdrop-filter: blur(4px);
  z-index: 2;
}

.svc-body {
  padding: 24px;
  position: relative;
  z-index: 2;
  margin-top: -20px; /* pull content over image gradient slightly */
}

.svc-title-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.svc-icon {
  width: 44px;
  height: 44px;
  background: rgba(49, 99, 149, 0.25);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--accent);
  flex-shrink: 0;
}

.svc-body h3 {
  font-size: 18px;
  font-weight: 700;
  color: #fff;
  line-height: 1.3;
}

.svc-desc {
  font-size: 13.5px;
  color: rgba(255, 255, 255, 0.65);
  line-height: 1.7;
  margin-bottom: 1.25rem;
}

.svc-features {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 1.5rem;
}

.svc-features li {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 12.5px;
  color: rgba(255, 255, 255, 0.75);
}

.feat-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent);
  margin-top: 6px;
  flex-shrink: 0;
}

.svc-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 1.75rem;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  padding-top: 14px;
}

.svc-tags li {
  font-size: 10px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 30px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: rgba(255, 255, 255, 0.82);
  background: rgba(255, 255, 255, 0.05);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
  will-change: transform, box-shadow;
  transition:
    transform 0.4s cubic-bezier(0.16, 1, 0.3, 1),
    color 0.4s cubic-bezier(0.16, 1, 0.3, 1),
    border-color 0.4s cubic-bezier(0.16, 1, 0.3, 1),
    box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.svc-tags li:hover {
  transform: translateY(-2px) scale(1.04);
  color: #ffffff;
  border-color: rgba(255, 255, 255, 0.3);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
}

.svc-cta {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 13px;
  font-weight: 700;
  color: var(--accent);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Tab transitions */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.28s ease, transform 0.28s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(10px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}
</style>
