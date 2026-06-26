<template>
  <section class="company-profile">
    <div class="section-inner">
      <div class="profile-grid">

        <div class="profile-text" data-reveal>
          <p class="eyebrow">{{ t('about.profileTitle') }}</p>
          <h2 class="section-heading">{{ t('footer.company') }}</h2>
          <p class="profile-desc">{{ t('about.companyDesc') }}</p>
        </div>

        <div class="profile-visuals" data-reveal data-delay="2">
          <div class="chart-viewer-card">
            <div class="viewer-tabs">
              <button class="tab-btn" :class="{ active: activeChartTab === 1 }" @click="activeChartTab = 1">
                {{ locale === 'th' ? 'โครงสร้างองค์กร' : 'Organization Chart' }}
              </button>
              <button class="tab-btn" :class="{ active: activeChartTab === 2 }" @click="activeChartTab = 2">
                {{ locale === 'th' ? 'โครงสร้างการบริหาร' : 'Management Structure' }}
              </button>
            </div>
            <div class="viewer-content">
              <transition name="fade-scale" mode="out-in">
                <div
                  :key="activeChartTab"
                  class="chart-img-wrap"
                  role="button"
                  tabindex="0"
                  :aria-label="activeChartTab === 1 ? (locale === 'th' ? 'คลิกเพื่อขยายโครงสร้างองค์กร' : 'Expand organization chart') : (locale === 'th' ? 'คลิกเพื่อขยายโครงสร้างการบริหาร' : 'Expand management structure')"
                  @click="zoomImage"
                  @keydown.enter.prevent="zoomImage"
                  @keydown.space.prevent="zoomImage"
                >
                  <img
                    :src="activeChartTab === 1 ? '/about-chart1.png' : '/about-chart2.png'"
                    :alt="activeChartTab === 1 ? 'Organization Chart' : 'Management Structure'"
                    class="chart-img"
                  />
                  <div class="zoom-overlay">
                    <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
                    <span>{{ locale === 'th' ? 'คลิกเพื่อขยายรูป' : 'Click to expand' }}</span>
                  </div>
                </div>
              </transition>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- Lightbox -->
    <Teleport to="body">
      <transition name="fade">
        <div v-if="zoomedImageSrc" class="lightbox-overlay" @click="closeZoom">
          <div class="lightbox-dialog" @click.stop>
            <div class="lightbox-header">
              <p class="lightbox-title">
                {{ activeChartTab === 1
                  ? (locale === 'th' ? 'โครงสร้างองค์กร' : 'Organization Chart')
                  : (locale === 'th' ? 'โครงสร้างการบริหาร' : 'Management Structure') }}
              </p>
              <button class="close-btn" aria-label="Close" @click="closeZoom">&times;</button>
            </div>
            <div class="lightbox-body">
              <img :src="zoomedImageSrc" alt="Zoomed Chart" class="lightbox-img" />
            </div>
            <div class="lightbox-footer">
              <span>{{ locale === 'th' ? 'บริษัท เน็ตเซอร์วิส (ประเทศไทย) จำกัด' : 'Netservice (Thailand) Co., Ltd.' }}</span>
              <button class="close-text-btn" @click="closeZoom">{{ locale === 'th' ? 'ปิด' : 'Close' }}</button>
            </div>
          </div>
        </div>
      </transition>
    </Teleport>
  </section>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useLocale } from '../../composables/useLocale'

const { t, locale } = useLocale()
const activeChartTab  = ref(1)
const zoomedImageSrc  = ref<string | null>(null)

function zoomImage() {
  zoomedImageSrc.value = activeChartTab.value === 1 ? '/about-chart1.png' : '/about-chart2.png'
}
function closeZoom() {
  zoomedImageSrc.value = null
}
watch(zoomedImageSrc, (val) => {
  document.body.style.overflow = val ? 'hidden' : ''
})

// Escape key closes the lightbox
function onKeyDown(e: KeyboardEvent) {
  if (e.key === 'Escape' && zoomedImageSrc.value) closeZoom()
}
onMounted(() => window.addEventListener('keydown', onKeyDown))
onUnmounted(() => {
  window.removeEventListener('keydown', onKeyDown)
  // Ensure body scroll is restored if component unmounts while lightbox is open
  document.body.style.overflow = ''
})
</script>

<style scoped>
.company-profile { padding: 120px 0; background: #f4f6fb; box-shadow: inset 0 1px 0 rgba(0,0,0,0.07); }
.profile-grid { display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 80px; align-items: center; }
.eyebrow { display: block; font-size: 11px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: var(--primary); margin-bottom: 0.75rem; }
.section-heading { font-size: clamp(24px, 3.2vw, 40px); font-weight: 800; line-height: 1.2; color: var(--text-dark); margin-bottom: 1.5rem; }
.profile-desc { font-size: clamp(14.5px, 1.1vw, 16px); color: #555; line-height: 1.85; }

.chart-viewer-card { background: #fff; border-radius: 20px; padding: 24px; box-shadow: 0 16px 48px rgba(0,0,0,0.06); border: 1px solid rgba(0,0,0,0.04); }
.viewer-tabs { display: flex; gap: 8px; background: #f0f2f7; padding: 5px; border-radius: 12px; margin-bottom: 20px; }
.tab-btn { flex: 1; border: none; background: transparent; padding: 10px 14px; font-family: 'Kanit', sans-serif; font-size: 12.5px; font-weight: 600; border-radius: 8px; color: #666; cursor: pointer; white-space: nowrap; transition: all 0.25s ease; }
.tab-btn:hover  { color: var(--primary); }
.tab-btn.active { background: #fff; color: var(--primary); box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
.viewer-content { position: relative; overflow: hidden; border-radius: 12px; background: #fcfdfe; border: 1px solid rgba(0,0,0,0.03); }
.chart-img-wrap { width: 100%; display: flex; position: relative; align-items: center; justify-content: center; padding: 12px; cursor: zoom-in; }
.chart-img { max-width: 100%; height: auto; display: block; border-radius: 8px; }
.zoom-overlay { position: absolute; inset: 0; background: rgba(14,17,36,0.4); backdrop-filter: blur(2px); display: flex; flex-direction: column; gap: 8px; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.3s; color: #fff; font-size: 12.5px; font-weight: 600; }
.chart-img-wrap:hover .zoom-overlay { opacity: 1; }

.fade-scale-enter-active, .fade-scale-leave-active { transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1); }
.fade-scale-enter-from { opacity: 0; transform: scale(0.97); }
.fade-scale-leave-to   { opacity: 0; transform: scale(1.03); }

/* Lightbox */
.lightbox-overlay { position: fixed; inset: 0; background: rgba(6,9,18,0.72); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 24px; }
.lightbox-dialog { background: #0e1124; border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; box-shadow: 0 40px 100px rgba(0,0,0,0.65); width: min(960px, 92vw); max-height: 90vh; display: flex; flex-direction: column; overflow: hidden; animation: dialogIn 0.35s cubic-bezier(0.16,1,0.3,1); }
@keyframes dialogIn { from { transform: scale(0.96) translateY(12px); opacity: 0; } to { transform: scale(1) translateY(0); opacity: 1; } }
.lightbox-header { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px 16px 24px; border-bottom: 1px solid rgba(255,255,255,0.07); flex-shrink: 0; }
.lightbox-title { font-size: 14px; font-weight: 700; color: rgba(255,255,255,0.85); letter-spacing: 0.3px; }
.close-btn { background: rgba(255,255,255,0.07); border: none; border-radius: 8px; color: rgba(255,255,255,0.55); font-size: 22px; font-weight: 400; width: 36px; height: 36px; cursor: pointer; display: flex; align-items: center; justify-content: center; line-height: 1; transition: background 0.2s, color 0.2s; }
.close-btn:hover { background: rgba(255,255,255,0.13); color: #fff; }
.lightbox-body { flex: 1; overflow: auto; display: flex; align-items: center; justify-content: center; padding: 24px; min-height: 0; }
.lightbox-img { max-width: 100%; max-height: calc(90vh - 130px); object-fit: contain; border-radius: 8px; display: block; }
.lightbox-footer { display: flex; align-items: center; justify-content: space-between; padding: 12px 20px 12px 24px; border-top: 1px solid rgba(255,255,255,0.07); flex-shrink: 0; }
.lightbox-footer span { font-size: 12px; color: rgba(255,255,255,0.3); }
.close-text-btn { background: rgba(255,255,255,0.07); border: none; border-radius: 7px; color: rgba(255,255,255,0.6); font-size: 12.5px; font-weight: 600; font-family: 'Kanit', sans-serif; padding: 6px 16px; cursor: pointer; transition: background 0.2s, color 0.2s; }
.close-text-btn:hover { background: rgba(255,255,255,0.13); color: #fff; }
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

@media (max-width: 1024px) {
  .profile-grid { grid-template-columns: 1fr; gap: 48px; }
  .company-profile { padding: 72px 0; }
}
</style>
