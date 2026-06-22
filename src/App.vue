<template>
  <div class="app-wrapper">

    <a href="#main-content" class="skip-link">Skip to main content</a>

    <!-- Page-transition curtain — colour matches the destination page background -->
    <div
      class="nav-curtain"
      :class="{ 'nav-curtain--open': curtainOpen }"
      :style="{ background: curtainColor }"
      aria-hidden="true"
    />

    <SiteHeader />

    <main id="main-content">
      <RouterView v-slot="{ Component }">
        <Transition :css="false" mode="out-in" @enter="onPageEnter" @leave="onPageLeave">
          <component :is="Component" :key="route.path" />
        </Transition>
      </RouterView>
    </main>

    <nav class="side-portal" aria-label="Quick links">
      <RouterLink to="/privacy">{{ t('nav.privacy') }}</RouterLink>
      <span class="side-portal-sep"></span>
      <a href="https://www.samartcorp.com/en/join-us/" target="_blank" rel="noopener">{{ t('nav.career') }}</a>
      <span class="side-portal-sep"></span>
      <RouterLink to="/partners">{{ t('nav.partners') }}</RouterLink>
    </nav>

    <SiteFooter />

    <FloatingContact />

    <!-- Global Liquid glass SVG filter -->
    <svg class="hidden-svg-filter">
      <defs>
        <filter
          id="container-glass"
          x="0%"
          y="0%"
          width="100%"
          height="100%"
          colorInterpolationFilters="sRGB"
        >
          <!-- Generate turbulent noise for distortion -->
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.05 0.05"
            numOctaves="1"
            seed="1"
            result="turbulence"
          />

          <!-- Blur the turbulence pattern slightly -->
          <feGaussianBlur in="turbulence" stdDeviation="2" result="blurredNoise" />

          <!-- Displace the source graphic with the noise -->
          <feDisplacementMap
            in="SourceGraphic"
            in2="blurredNoise"
            scale="70"
            xChannelSelector="R"
            yChannelSelector="B"
            result="displaced"
          />

          <!-- Apply overall blur on the final result -->
          <feGaussianBlur in="displaced" stdDeviation="4" result="finalBlur" />

          <!-- Output the result -->
          <feComposite in="finalBlur" in2="finalBlur" operator="over" />
        </filter>
      </defs>
    </svg>

  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLocale } from './composables/useLocale'
import { useLenis } from './composables/useLenis'
import { useScrollReveal } from './composables/useScrollReveal'
import SiteHeader from './components/SiteHeader.vue'
import SiteFooter from './components/SiteFooter.vue'
import FloatingContact from './components/FloatingContact.vue'

const { t } = useLocale()
const route  = useRoute()

const { lenis } = useLenis()
const { observe } = useScrollReveal()

// Transition curtain — colour matches the destination page background
const curtainOpen  = ref(false)
const curtainColor = ref('#fefefe')  // default: white (matches body bg)

function onPageEnter(el: Element, done: () => void) {
  lenis.value?.start()

  // Enforce dark background color on the body during the enter transition
  // to prevent outgoing page's onUnmounted hooks from resetting the background
  // color to white and causing a flash.
  if (route.path !== '/portfolio') {
    document.body.style.setProperty('background-color', curtainColor.value, 'important')
  }

  nextTick(() => {
    observe()
    // New page's content height differs from the previous one (Portfolio's
    // pinned grid is very tall). Lenis caches the old height, so without a
    // resize the scroll position lands in empty space until a manual refresh.
    // Double rAF lets layout settle before we recalculate.
    requestAnimationFrame(() => requestAnimationFrame(() => {
      lenis.value?.resize()
      ScrollTrigger.refresh()
      // Re-pin to top AFTER height is recalculated — the leave hook's scrollTo(0)
      // runs before the new (shorter/taller) page has rendered, so the scroll
      // position can land in empty space below the real content.
      window.scrollTo(0, 0)
      lenis.value?.scrollTo(0, { immediate: true, force: true })
    }))
  })
  gsap.from(el, {
    opacity: 0, y: 18, duration: 0.45, ease: 'power2.out',
    clearProps: 'transform,opacity',
    onStart: () => { curtainOpen.value = false },
    onComplete: () => {
      // Restore default body background-color once transition is complete
      if (route.path !== '/portfolio') {
        document.body.style.removeProperty('background-color')
      }
      done()
    },
  })
}
function onPageLeave(el: Element, done: () => void) {
  lenis.value?.stop()
  // route.path is already the NEW route when the leave hook fires
  curtainColor.value = route.path === '/portfolio' ? '#000000' : '#060912'
  curtainOpen.value  = true

  // Set the body background color temporarily to match the curtain color.
  // This prevents the default white (#fefefe) body background from flashing through
  // when the page fades out.
  document.body.style.setProperty('background-color', curtainColor.value, 'important')

  gsap.to(el, {
    opacity: 0, y: -12, duration: 0.28, ease: 'power2.in',
    onComplete: () => {
      window.scrollTo(0, 0)
      lenis.value?.scrollTo(0, { immediate: true })
      done()
    },
  })
}

watch(route, async () => {
  await nextTick()
  observe()
})
</script>

<style scoped>
/* ── Page-transition curtain ─────────────────────────────────── */
.skip-link {
  position: absolute;
  top: -100%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10000;
  background: var(--accent);
  color: #060912;
  font-size: 14px;
  font-weight: 700;
  padding: 10px 24px;
  border-radius: 0 0 8px 8px;
  white-space: nowrap;
  transition: top 0.15s;
}
.skip-link:focus {
  top: 0;
  outline: 2px solid #060912;
  outline-offset: 2px;
}

/* ── Page-transition curtain ─────────────────────────────────── */
.nav-curtain {
  position: fixed;
  inset: 0;
  z-index: 9990;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.18s ease;
  /* background set dynamically via :style */
}
.nav-curtain--open {
  opacity: 1;
}

.page-offset { padding-top: 76px; }

/* ════════════════════════════════════════════
   SIDE PORTAL — vertical text, fixed bottom-left
════════════════════════════════════════════ */
.side-portal {
  position: fixed;
  left: 24px;
  bottom: 40px;
  z-index: 90;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
}
.side-portal a {
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.70);
  white-space: nowrap;
  transition: color 0.2s;
}
.side-portal a:hover { color: #fff; }
.side-portal-sep { display: none; }

@media (max-width: 900px) {
  .side-portal { display: none; }
  .page-offset  { padding-top: 64px; }
}
</style>
