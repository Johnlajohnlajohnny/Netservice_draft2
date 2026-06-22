<template>
  <Teleport to="body">
    <div v-if="!isContactPage" class="fab-wrap">

      <!-- Info panel -->
      <Transition name="fab-panel">
        <div
          v-if="open"
          class="fab-panel"
          role="dialog"
          aria-modal="false"
          :aria-label="t('nav.contact')"
        >
          <div class="fab-head">
            <span class="fab-head-title">{{ t('nav.contact') }}</span>
            <button class="fab-close" @click="open = false" aria-label="Close">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="15" height="15">
                <path d="M18 6 6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <div class="fab-divider"/>

          <div class="fab-rows">
            <a class="fab-row" href="tel:+6625026000">
              <span class="fab-row-ico">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.4a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.68h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 10.4a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
              </span>
              <div class="fab-row-text">
                <span class="fab-row-label">{{ t('contact.phoneLabel') }}</span>
                <span class="fab-row-value">0-2502-6000</span>
              </div>
            </a>

            <a class="fab-row" href="mailto:info@netservice.co.th">
              <span class="fab-row-ico">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15">
                  <rect width="20" height="16" x="2" y="4" rx="2"/>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                </svg>
              </span>
              <div class="fab-row-text">
                <span class="fab-row-label">{{ t('contact.emailLabel') }}</span>
                <span class="fab-row-value">info@netservice.co.th</span>
              </div>
            </a>

            <a
              class="fab-row"
              href="https://www.google.com/maps/place/%E0%B9%80%E0%B8%82%E0%B8%95%E0%B8%AD%E0%B8%B8%E0%B8%95%E0%B8%AA%E0%B8%B2%E0%B8%AB%E0%B8%81%E0%B8%A3%E0%B8%A3%E0%B8%A1%E0%B8%8B%E0%B8%AD%E0%B8%9F%E0%B8%95%E0%B9%8C%E0%B9%81%E0%B8%A7%E0%B8%A3%E0%B9%8C%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B9%80%E0%B8%97%E0%B8%A8%E0%B9%84%E0%B8%97%E0%B8%A2/@13.9042062,100.5271277,17z/data=!3m1!4b1!4m6!3m5!1s0x30e283629d3d57bd:0x2a72be2241b7c621!8m2!3d13.9042062!4d100.529708!16s%2Fg%2F1tf559v9"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span class="fab-row-ico">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
              </span>
              <div class="fab-row-text">
                <span class="fab-row-label">{{ t('contact.addressLabel') }}</span>
                <span class="fab-row-value">{{ t('fab.shortAddr') }}</span>
              </div>
            </a>
          </div>

          <RouterLink to="/contact" class="fab-cta" @click="open = false">
            {{ t('fab.contactNow') }}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="13" height="13">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </RouterLink>
        </div>
      </Transition>

      <!-- FAB trigger -->
      <button
        class="fab-btn"
        :class="{ 'fab-btn--open': open }"
        :aria-expanded="open"
        :aria-label="t('nav.contact')"
        @click="open = !open"
      >
        <span v-if="!open" class="fab-pulse" aria-hidden="true"/>
        <Transition name="fab-ico" mode="out-in">
          <svg v-if="!open" key="phone" class="fab-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.4a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.68h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 10.4a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
          </svg>
          <svg v-else key="close" class="fab-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M18 6 6 18M6 6l12 12"/>
          </svg>
        </Transition>
      </button>

    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useLocale } from '../composables/useLocale'

const route = useRoute()
const { t } = useLocale()
const open  = ref(false)

const isContactPage = computed(() => route.path === '/contact')

watch(() => route.path, () => { open.value = false })

function onKeyDown(e: KeyboardEvent) {
  if (e.key === 'Escape' && open.value) open.value = false
}
onMounted(() => window.addEventListener('keydown', onKeyDown))
onUnmounted(() => window.removeEventListener('keydown', onKeyDown))
</script>

<style scoped>
/* ── Wrapper ─────────────────────────────────────────────── */
.fab-wrap {
  position: fixed;
  bottom: 32px;
  right: 32px;
  z-index: 995;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 12px;
  font-family: 'Kanit', sans-serif;
}

/* ── Panel ───────────────────────────────────────────────── */
.fab-panel {
  width: 296px;
  background: rgba(8, 12, 28, 0.94);
  backdrop-filter: blur(48px) saturate(200%);
  -webkit-backdrop-filter: blur(48px) saturate(200%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  overflow: hidden;
  box-shadow:
    0 24px 64px rgba(0, 0, 0, 0.55),
    0 8px 24px  rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.fab-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 18px 14px;
}
.fab-head-title {
  font-size: 14px;
  font-weight: 700;
  color: #fff;
  letter-spacing: 0.3px;
}
.fab-close {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.55);
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
  margin: -8px -8px -8px 0;
}
.fab-close:hover {
  background: rgba(255, 255, 255, 0.14);
  color: #fff;
}

.fab-divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.07);
  margin: 0 18px;
}

/* ── Rows ────────────────────────────────────────────────── */
.fab-rows {
  padding: 10px 8px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.fab-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 9px 10px;
  border-radius: 12px;
  text-decoration: none;
  color: inherit;
  transition: background 0.2s;
}
a.fab-row:hover { background: rgba(255, 255, 255, 0.06); }

.fab-row-ico {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  background: rgba(49, 99, 149, 0.3);
  color: #38bdf8;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.fab-row-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}
.fab-row-label {
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.6px;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.38);
}
.fab-row-value {
  font-size: 13px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.88);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ── CTA button ──────────────────────────────────────────── */
.fab-cta {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin: 4px 14px 14px;
  padding: 12px 20px;
  background: #316395;
  border-radius: 12px;
  font-family: 'Kanit', sans-serif;
  font-size: 13.5px;
  font-weight: 700;
  color: #fff;
  text-decoration: none;
  letter-spacing: 0.3px;
  transition: opacity 0.2s, gap 0.25s, box-shadow 0.2s;
  box-shadow: 0 4px 16px rgba(49, 99, 149, 0.4);
}
.fab-cta:hover {
  opacity: 0.9;
  gap: 12px;
  box-shadow: 0 6px 20px rgba(49, 99, 149, 0.55);
}

/* ── FAB button ──────────────────────────────────────────── */
.fab-btn {
  position: relative;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: none;
  background: #316395;
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow:
    0 8px 28px rgba(49, 99, 149, 0.55),
    0 2px 8px  rgba(49, 99, 149, 0.3);
  transition:
    transform     0.35s cubic-bezier(0.34, 1.56, 0.64, 1),
    box-shadow    0.3s ease,
    background    0.3s ease;
}
.fab-btn:hover {
  transform: scale(1.1);
  box-shadow:
    0 12px 36px rgba(49, 99, 149, 0.65),
    0 4px 12px  rgba(49, 99, 149, 0.4);
}
.fab-btn--open {
  background: rgba(30, 45, 80, 0.9);
  backdrop-filter: blur(12px);
  transform: scale(1);
}
.fab-svg {
  width: 22px;
  height: 22px;
  position: relative;
  z-index: 1;
}

/* Pulse ring — draws attention when closed */
.fab-pulse {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: #316395;
  animation: fab-ring 2.8s ease-out infinite;
}
@keyframes fab-ring {
  0%   { transform: scale(1);   opacity: 0.55; }
  65%  { transform: scale(1.7); opacity: 0;    }
  100% { transform: scale(1.7); opacity: 0;    }
}

/* ── Panel transition ────────────────────────────────────── */
.fab-panel-enter-active {
  transition: opacity 0.28s ease, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.fab-panel-leave-active {
  transition: opacity 0.18s ease, transform 0.22s cubic-bezier(0.4, 0, 1, 1);
}
.fab-panel-enter-from,
.fab-panel-leave-to {
  opacity: 0;
  transform: scale(0.88) translateY(14px);
}

/* ── Icon swap ───────────────────────────────────────────── */
.fab-ico-enter-active { transition: opacity 0.14s ease, transform 0.2s ease; }
.fab-ico-leave-active { transition: opacity 0.12s ease, transform 0.16s ease; }
.fab-ico-enter-from   { opacity: 0; transform: rotate(-90deg) scale(0.5); }
.fab-ico-leave-to     { opacity: 0; transform: rotate(90deg)  scale(0.5); }

/* ── Reduced motion ──────────────────────────────────────── */
@media (prefers-reduced-motion: reduce) {
  .fab-pulse { animation: none; }
  .fab-panel-enter-active,
  .fab-panel-leave-active { transition: opacity 0.2s ease; }
  .fab-panel-enter-from,
  .fab-panel-leave-to { transform: none; }
  .fab-ico-enter-active,
  .fab-ico-leave-active { transition: opacity 0.15s ease; }
  .fab-ico-enter-from,
  .fab-ico-leave-to { transform: none; }
}

/* ── Mobile ──────────────────────────────────────────────── */
@media (max-width: 768px) {
  .fab-wrap {
    bottom: 80px;
    right: 16px;
  }
  .fab-panel {
    width: min(296px, calc(100vw - 32px));
  }
}
</style>
