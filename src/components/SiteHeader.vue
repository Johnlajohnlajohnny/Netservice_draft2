<template>
  <header
    ref="headerRef"
    class="site-header"
    :class="{
      scrolled:    isScrolled,
      'at-home':   isTransparentStart && !isScrolled,
      'menu-open': mobileOpen,
    }"
  >
    <nav class="navbar">
      <div class="nav-inner">

        <div class="logo">
          <RouterLink to="/" @click="mobileOpen = false">
            <img src="/logo.png" alt="Netservice Thailand" />
          </RouterLink>
        </div>

        <div class="desktop-menu">
          <RouterLink to="/about">
            <span class="nav-char-wrap">
              <span
                v-for="(char, idx) in t('nav.about').split('')"
                :key="idx"
                class="nav-char"
                :style="{ '--char-idx': idx }"
              >{{ char === ' ' ? ' ' : char }}</span>
            </span>
          </RouterLink>
          <RouterLink to="/products">
            <span class="nav-char-wrap">
              <span
                v-for="(char, idx) in t('nav.products').split('')"
                :key="idx"
                class="nav-char"
                :style="{ '--char-idx': idx }"
              >{{ char === ' ' ? ' ' : char }}</span>
            </span>
          </RouterLink>
          <RouterLink to="/portfolio">
            <span class="nav-char-wrap">
              <span
                v-for="(char, idx) in t('nav.portfolio').split('')"
                :key="idx"
                class="nav-char"
                :style="{ '--char-idx': idx }"
              >{{ char === ' ' ? ' ' : char }}</span>
            </span>
          </RouterLink>
          <RouterLink to="/news">
            <span class="nav-char-wrap">
              <span
                v-for="(char, idx) in t('nav.news').split('')"
                :key="idx"
                class="nav-char"
                :style="{ '--char-idx': idx }"
              >{{ char === ' ' ? ' ' : char }}</span>
            </span>
          </RouterLink>
        </div>

        <div class="nav-right">
          <RouterLink to="/contact" class="nav-cta">{{ t('nav.contact') }}</RouterLink>
          <span class="nav-lang">
            <button :class="{ active: locale === 'th' }" @click="setLocale('th')">TH</button>
            <span>/</span>
            <button :class="{ active: locale === 'en' }" @click="setLocale('en')">EN</button>
          </span>
          <button
            class="hamburger"
            :class="{ open: mobileOpen }"
            :aria-expanded="mobileOpen"
            aria-controls="mobile-drawer"
            aria-label="Menu"
            @click="mobileOpen = !mobileOpen"
          >
            <span></span><span></span><span></span>
          </button>
        </div>

      </div>
    </nav>

    <div id="mobile-drawer" class="mobile-drawer" :class="{ open: mobileOpen }" role="navigation" :aria-hidden="!mobileOpen" :inert="!mobileOpen">
      <RouterLink to="/about"    @click="mobileOpen = false">{{ t('nav.about') }}</RouterLink>
      <RouterLink to="/products" @click="mobileOpen = false">{{ t('nav.products') }}</RouterLink>
      <RouterLink to="/portfolio"@click="mobileOpen = false">{{ t('nav.portfolio') }}</RouterLink>
      <RouterLink to="/news"     @click="mobileOpen = false">{{ t('nav.news') }}</RouterLink>
      <RouterLink to="/contact"  @click="mobileOpen = false">{{ t('nav.contact') }}</RouterLink>
      <div class="drawer-lang">
        <button :class="{ active: locale === 'th' }" @click="setLocale('th'); mobileOpen = false">TH</button>
        <span>|</span>
        <button :class="{ active: locale === 'en' }" @click="setLocale('en'); mobileOpen = false">EN</button>
      </div>
    </div>

  </header>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useLocale } from '../composables/useLocale'

const { locale, t, setLocale } = useLocale()
const route = useRoute()

const headerRef  = ref<HTMLElement | null>(null)
const isScrolled = ref(false)
const mobileOpen = ref(false)
const isTransparentStart = computed(() => [
  '/', '/portfolio', '/about', '/news', '/partners',
  '/corporate-governance', '/contact', '/products', '/privacy'
].includes(route.path))

const handleScroll = () => {
  // Portfolio page: header always stays transparent/full-width at top:0
  // — prevents the 16px floating-pill gap from showing as a dark strip
  // over the Three.js scene when the user scrolls back up.
  if (route.path === '/portfolio' && !document.body.dataset.portfolioGrid) {
    isScrolled.value = false
    return
  }
  isScrolled.value = window.scrollY > 60
}

// Reset scrolled state when navigating between pages
watch(() => route.path, (path) => {
  if (path === '/portfolio' && !document.body.dataset.portfolioGrid) {
    isScrolled.value = false
  } else {
    // Reset on route change so navbar starts transparent
    isScrolled.value = window.scrollY > 60
  }
})

let rafNav: number | null = null
function onNavReflect(e: MouseEvent) {
  if (!isScrolled.value) return
  if (rafNav !== null) cancelAnimationFrame(rafNav)
  rafNav = requestAnimationFrame(() => {
    const mx     = e.clientX / window.innerWidth
    const bright = Math.max(0, 1 - mx / 0.55)
    if (headerRef.value) {
      headerRef.value.style.setProperty('--rx', `${mx * 100}%`)
      headerRef.value.style.setProperty('--rb', String(bright))
    }
  })
}

watch(locale, () => {
  if (!headerRef.value) return
  headerRef.value.classList.add('no-char-anim')
  setTimeout(() => headerRef.value?.classList.remove('no-char-anim'), 80)
})

watch(route, () => { mobileOpen.value = false })

function onKeyDown(e: KeyboardEvent) {
  if (e.key === 'Escape' && mobileOpen.value) mobileOpen.value = false
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  window.addEventListener('mousemove', onNavReflect)
  window.addEventListener('keydown', onKeyDown)
})
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('mousemove', onNavReflect)
  window.removeEventListener('keydown', onKeyDown)
  if (rafNav !== null) cancelAnimationFrame(rafNav)
})
</script>

<style scoped>
/* ════════════════════════════════════════════
   SITE HEADER
════════════════════════════════════════════ */
.site-header {
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%) translateZ(0);
  width: 100%;
  z-index: 1000;
  will-change: width, top, border-radius;
  transition:
    width         0.75s cubic-bezier(0.16, 1, 0.3, 1),
    top           0.75s cubic-bezier(0.16, 1, 0.3, 1),
    border-radius 0.75s cubic-bezier(0.16, 1, 0.3, 1),
    background    0.55s cubic-bezier(0.16, 1, 0.3, 1),
    border-color  0.55s cubic-bezier(0.16, 1, 0.3, 1),
    box-shadow    0.55s cubic-bezier(0.16, 1, 0.3, 1);
}
.site-header.at-home { background: transparent; }
.site-header.scrolled {
  top:    16px;
  width:  min(1020px, calc(100% - 32px));
  border-radius: 50px;
  overflow: hidden;
  background: rgba(12, 14, 26, 0.45);
  backdrop-filter:         blur(16px) saturate(160%);
  -webkit-backdrop-filter: blur(16px) saturate(160%);
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow:
    0 16px 48px rgba(0, 0, 0, 0.25),
    0 4px 12px rgba(0, 0, 0, 0.15),
    0 0 8px rgba(0, 0, 0, 0.03),
    0 2px 6px rgba(0, 0, 0, 0.08),
    0 0 12px rgba(0, 0, 0, 0.15),
    inset 3px 3px 0.5px -3.5px rgba(255, 255, 255, 0.09),
    inset -3px -3px 0.5px -3.5px rgba(255, 255, 255, 0.85),
    inset 1px 1px 1px -0.5px rgba(255, 255, 255, 0.6),
    inset -1px -1px 1px -0.5px rgba(255, 255, 255, 0.6),
    inset 0 0 6px 6px rgba(255, 255, 255, 0.12),
    inset 0 0 2px 2px rgba(255, 255, 255, 0.06);
}
.site-header.scrolled::before {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  border-radius: inherit;
  background: radial-gradient(
    ellipse 50% 200% at var(--rx, 0%) -20%,
    rgba(255, 195, 80, calc(var(--rb, 0) * 0.22)),
    rgba(255, 140, 40, calc(var(--rb, 0) * 0.10)) 45%,
    transparent 70%
  );
  transition: opacity 0.3s ease;
}

/* ════════════════════════════════════════════
   NAVBAR
════════════════════════════════════════════ */
.nav-inner {
  display: flex;
  align-items: center;
  padding: 0 40px;
  height: 76px;
  position: relative;
  z-index: 1;
  transition: height 0.75s cubic-bezier(0.16, 1, 0.3, 1), padding 0.75s cubic-bezier(0.16, 1, 0.3, 1);
}
.site-header.scrolled .nav-inner {
  height: 64px;
  display: grid;
  grid-template-columns: auto 1fr auto;
  padding: 0 24px;
}

.logo img {
  height: 38px;
  display: block;
  transition: height 0.5s cubic-bezier(0.16, 1, 0.3, 1), filter 0.45s ease;
}
.site-header.scrolled .nav-inner .logo img { height: 30px; }
.site-header.at-home .logo img { filter: brightness(0) invert(1); }

.desktop-menu {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 0;
  margin-left: auto;
}
.site-header.scrolled .desktop-menu {
  margin-left: 0;
  justify-content: center;
}
.desktop-menu a {
  padding: 7px 13px;
  border-radius: 8px;
  font-size: 12.5px;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: var(--text-dark);
  white-space: nowrap;
  position: relative;
  transition: color 0.2s, background 0.2s;
}
.desktop-menu a::after {
  content: '';
  position: absolute;
  bottom: 2px;
  left: 13px;
  right: 13px;
  height: 1.5px;
  background: currentColor;
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.49s cubic-bezier(0.16, 1, 0.3, 1);
}
.desktop-menu a:hover              { color: var(--primary); background: rgba(49,99,149,0.07); }
.desktop-menu a.router-link-active { color: var(--primary); }
.site-header.at-home  .desktop-menu a { color: rgba(255,255,255,0.82); }
.site-header.at-home  .desktop-menu a:hover { color: #fff; background: transparent; }
.site-header.at-home  .desktop-menu a:hover::after { transform: scaleX(1); }
.site-header.scrolled .desktop-menu a { color: rgba(255, 255, 255, 0.78); }
.site-header.scrolled .desktop-menu a:hover { color: #fff; background: rgba(255, 255, 255, 0.08); }
.site-header.scrolled .desktop-menu a.router-link-active { color: #fff; }

.site-header.no-char-anim .nav-char { animation: none !important; }
.nav-char-wrap { display: inline-flex; }
.nav-char {
  display: inline-block;
  white-space: pre;
  will-change: transform, opacity, filter;
}
.site-header.scrolled .desktop-menu a .nav-char {
  animation: char-morph-down 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
  animation-delay: calc(var(--char-idx) * 18ms);
}
.site-header:not(.scrolled) .desktop-menu a .nav-char {
  animation: char-morph-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
  animation-delay: calc(var(--char-idx) * 18ms);
}
@keyframes char-morph-down {
  0%   { transform: translateY(-10px) scale(0.82); opacity: 0; filter: blur(5px); }
  60%  { filter: blur(0px); }
  100% { transform: translateY(0) scale(1); opacity: 1; filter: blur(0px); }
}
@keyframes char-morph-up {
  0%   { transform: translateY(10px) scale(0.82); opacity: 0; filter: blur(5px); }
  60%  { filter: blur(0px); }
  100% { transform: translateY(0) scale(1); opacity: 1; filter: blur(0px); }
}

.nav-right {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
}
.nav-lang {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 11.5px;
  font-weight: 700;
  color: rgba(0,0,0,0.4);
  margin-right: 4px;
}
.nav-lang button {
  color: rgba(0,0,0,0.45);
  transition: color 0.2s;
  padding: 13px 8px;
  min-width: 44px;
  min-height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  cursor: pointer;
  font-size: inherit;
  font-weight: inherit;
  font-family: inherit;
  letter-spacing: inherit;
}
.nav-lang button:hover  { color: var(--primary); }
.nav-lang button.active { color: var(--primary); }
.nav-lang span          { color: rgba(0,0,0,0.2); }
.site-header.at-home  .nav-lang button,
.site-header.at-home  .nav-lang span,
.site-header.scrolled .nav-lang button,
.site-header.scrolled .nav-lang span { color: rgba(255,255,255,0.62); }
.site-header.at-home  .nav-lang button:hover,
.site-header.scrolled .nav-lang button:hover { color: #fff; }
.site-header.at-home  .nav-lang button.active,
.site-header.scrolled .nav-lang button.active { color: var(--primary); }

.nav-cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 128px;
  min-height: 44px;
  padding: 7px 18px;
  border-radius: 8px;
  font-size: 12.5px;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  background: var(--primary);
  color: #fff;
  white-space: nowrap;
  transition: opacity 0.2s, background 0.2s;
}
.nav-cta:hover { opacity: 0.88; }
.site-header.at-home .nav-cta {
  background: rgba(255,255,255,0.15);
  border: 1px solid rgba(255,255,255,0.3);
}
.site-header.scrolled .nav-cta { background: var(--primary); border: none; }

/* ════════════════════════════════════════════
   HAMBURGER
════════════════════════════════════════════ */
.hamburger {
  display: none;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  width: 44px;
  height: 44px;
  padding: 10px;
  background: none;
  border: none;
  cursor: pointer;
  border-radius: 8px;
}
.hamburger span {
  display: block;
  height: 2px;
  width: 100%;
  background: var(--text-dark);
  border-radius: 2px;
  transition: transform 0.3s, opacity 0.3s, background 0.3s;
}
.site-header.at-home  .hamburger span,
.site-header.scrolled .hamburger span { background: #fff; }
.hamburger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
.hamburger.open span:nth-child(2) { opacity: 0; }
.hamburger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

/* ════════════════════════════════════════════
   MOBILE DRAWER
════════════════════════════════════════════ */
.mobile-drawer {
  display: none;
  flex-direction: column;
  max-height: 0;
  overflow: hidden;
  background: rgba(255,255,255,0.97);
  backdrop-filter: blur(20px);
  border-top: 1px solid rgba(0,0,0,0.07);
  transition: max-height 0.4s cubic-bezier(0.16,1,0.3,1);
}
.mobile-drawer.open { max-height: 500px; }
.mobile-drawer a {
  display: block;
  padding: 14px 24px;
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 0.3px;
  text-transform: uppercase;
  color: var(--text-dark);
  border-bottom: 1px solid rgba(0,0,0,0.05);
}
.mobile-drawer a:hover,
.mobile-drawer a.router-link-active { color: var(--primary); }
.drawer-lang {
  display: flex;
  gap: 12px;
  padding: 14px 24px 20px;
  align-items: center;
  font-size: 13px;
  font-weight: 700;
  color: #999;
}
.drawer-lang button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: inherit;
  font-weight: inherit;
  font-family: inherit;
  color: #666;
  min-width: 44px;
  min-height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: color 0.2s;
}
.drawer-lang button.active { color: var(--primary); }
.drawer-lang button:hover  { color: var(--primary); }
.drawer-lang a {
  color: #666;
  padding: 10px 14px;
  min-width: 44px;
  min-height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.drawer-lang a.active { color: var(--primary); }

/* ════════════════════════════════════════════
   RESPONSIVE
════════════════════════════════════════════ */
@media (max-width: 900px) {
  .desktop-menu { display: none; }
  .nav-lang     { display: none; }
  .nav-cta      { display: none; }
  .hamburger    { display: flex; }
  .mobile-drawer { display: flex; }
  .nav-right    { margin-left: auto; }
  .nav-inner    { padding: 0 20px; }

  /* Mobile scrolled — full-width flat bar, no pill, no shrink */
  .site-header.scrolled {
    top: 0;
    width: 100%;
    border-radius: 0;
    border-left: none;
    border-right: none;
    border-top: none;
    background: rgba(14,17,36,0.88);
  }
  .site-header.scrolled .nav-inner {
    height: 64px;
    display: flex;
    grid-template-columns: unset;
    padding: 0 20px;
  }
  .site-header.scrolled .nav-inner .logo img {
    height: 34px;
  }
}
</style>
