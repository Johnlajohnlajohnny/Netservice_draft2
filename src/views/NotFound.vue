<template>
  <div class="nf-page">

    <!-- Background -->
    <div class="nf-bg" aria-hidden="true">
      <div class="nf-glow" />
      <div class="nf-grid" />
    </div>

    <div class="nf-inner">

      <!-- COMING SOON mode (Terms / PDPA / Whistleblower) -->
      <template v-if="isSoon">
        <div class="nf-icon-wrap" aria-hidden="true">
          <svg width="42" height="42" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="7" y="4" width="26" height="36" rx="3" stroke="currentColor" stroke-width="1.4"/>
            <path d="M7 12h26" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
            <path d="M13 20h16M13 26h11M13 32h7" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
          </svg>
        </div>
        <span class="nf-tag">{{ locale === 'th' ? 'อยู่ระหว่างดำเนินการ' : 'Coming Soon' }}</span>
        <h1 class="nf-title">{{ currentLabel }}</h1>
        <p class="nf-desc">
          {{ locale === 'th'
            ? 'หน้านี้อยู่ระหว่างการจัดทำ เราจะเปิดให้บริการในเร็วๆ นี้'
            : "This page is currently being prepared. We'll have it ready soon." }}
        </p>
      </template>

      <!-- 404 mode -->
      <template v-else>
        <p class="nf-code" aria-hidden="true">404</p>
        <span class="nf-tag">{{ locale === 'th' ? 'ไม่พบหน้าที่ต้องการ' : 'Page Not Found' }}</span>
        <p class="nf-desc">
          {{ locale === 'th'
            ? 'หน้าที่คุณกำลังมองหาอาจถูกย้ายหรือไม่มีอยู่แล้ว'
            : "The page you're looking for may have been moved or no longer exists." }}
        </p>
      </template>

      <RouterLink to="/" class="nf-btn">
        <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M10.5 3.5L5.5 8l5 4.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        {{ locale === 'th' ? 'กลับหน้าหลัก' : 'Back to Home' }}
      </RouterLink>

    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useLocale } from '../composables/useLocale'

const route = useRoute()
const { locale } = useLocale()

const isSoon = computed(() => route.meta?.mode === 'soon')
const currentLabel = computed(() => {
  const label = route.meta?.label as { en: string; th: string } | undefined
  if (!label) return ''
  return locale.value === 'th' ? label.th : label.en
})
</script>

<style scoped>
.nf-page {
  min-height: 100vh;
  background: #060912;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  padding: 100px 24px 80px;
}

.nf-bg { position: absolute; inset: 0; pointer-events: none; }

.nf-glow {
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 660px;
  height: 660px;
  background: radial-gradient(ellipse, rgba(49,99,200,0.13) 0%, transparent 68%);
  border-radius: 50%;
}

.nf-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
  background-size: 64px 64px;
  mask-image: radial-gradient(ellipse 70% 70% at 50% 50%, black 20%, transparent 100%);
  -webkit-mask-image: radial-gradient(ellipse 70% 70% at 50% 50%, black 20%, transparent 100%);
}

.nf-inner {
  position: relative;
  z-index: 1;
  text-align: center;
  max-width: 540px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  animation: nfFadeUp 0.65s cubic-bezier(0.16, 1, 0.3, 1) both;
}

@keyframes nfFadeUp {
  from { opacity: 0; transform: translateY(28px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* 404 large code */
.nf-code {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: clamp(96px, 18vw, 160px);
  font-weight: 800;
  line-height: 0.88;
  letter-spacing: -4px;
  background: linear-gradient(170deg, rgba(255,255,255,0.88) 20%, rgba(255,255,255,0.14) 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 4px;
}

/* Document icon wrap for coming-soon */
.nf-icon-wrap {
  width: 68px;
  height: 68px;
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255,255,255,0.5);
  background: rgba(255,255,255,0.03);
  margin-bottom: 4px;
}

.nf-tag {
  display: inline-block;
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: 4px;
  text-transform: uppercase;
  color: var(--primary, #3163c5);
  padding: 4px 14px;
  border: 1px solid rgba(49,99,200,0.28);
  border-radius: 50px;
}

.nf-title {
  font-size: clamp(22px, 3.5vw, 36px);
  font-weight: 700;
  color: #fff;
  line-height: 1.2;
  margin: 0;
}

.nf-desc {
  font-size: 14.5px;
  color: rgba(255,255,255,0.46);
  line-height: 1.75;
  max-width: 380px;
  margin: 0;
}

.nf-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
  padding: 11px 26px;
  border: 1px solid rgba(255,255,255,0.13);
  border-radius: 50px;
  color: rgba(255,255,255,0.72);
  font-size: 13px;
  font-weight: 600;
  font-family: 'Kanit', sans-serif;
  letter-spacing: 0.3px;
  text-decoration: none;
  transition: background 0.22s, border-color 0.22s, color 0.22s;
  background: rgba(255,255,255,0.033);
}
.nf-btn:hover {
  background: rgba(255,255,255,0.08);
  border-color: rgba(255,255,255,0.26);
  color: #fff;
}
</style>
