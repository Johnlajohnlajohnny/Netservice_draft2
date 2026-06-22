<template>
  <section class="hero-mobile">
    <div class="hero-bg"></div>
    <div class="hero-overlay"></div>

    <div class="hero-body">
      <div class="hero-text">
        <p class="hero-eyebrow">
          <span class="eyebrow-line"></span>
          <span class="eyebrow-text">{{ t('hero.subtitle') }}</span>
          <span class="eyebrow-line"></span>
        </p>
        <div class="hero-title-wrap">
          <h1 class="hero-title">{{ t('hero.title') }}</h1>
          <p class="hero-title-sub">{{ t('hero.titleSub') }}</p>
        </div>
        <span class="hero-title-rule" aria-hidden="true"></span>
        <p class="hero-desc">{{ t('hero.desc') }}</p>
        <div class="hero-actions">
          <RouterLink to="/contact" class="btn btn-primary">{{ t('hero.getStarted') }}</RouterLink>
          <RouterLink to="/about" class="btn btn-ghost">{{ t('hero.viewMore') }}</RouterLink>
        </div>
      </div>
    </div>

    <div class="scroll-hint" aria-hidden="true">
      <span class="scroll-hint-text">Scroll Down</span>
      <div class="scroll-hint-arrow">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 5v14M5 12l7 7 7-7"/>
        </svg>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useLocale } from '../../../composables/useLocale'

const { t } = useLocale()
</script>

<style scoped>
.hero-mobile {
  position: relative;
  height: 100vh;
  min-height: 560px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: var(--dark);
  color: #fff;
}

.hero-bg {
  position: absolute;
  inset: 0;
  background: url(/hero-bg2.webp) center center / cover no-repeat;
  z-index: 0;
  opacity: 0.5; /* slightly lower opacity for higher contrast on mobile screens */
}

.hero-overlay {
  position: absolute;
  inset: 0;
  z-index: 1;
  background: linear-gradient(to top, rgba(14,17,36,0.95) 0%, rgba(14,17,36,0.45) 50%, rgba(14,17,36,0.8) 100%);
}

.hero-body {
  position: relative;
  z-index: 3;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 0 24px;
}

.hero-text {
  width: 100%;
  max-width: 480px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.hero-eyebrow {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 1.5rem;
}

.eyebrow-line {
  display: inline-block;
  width: 20px;
  height: 1px;
  background: var(--primary);
  opacity: 0.7;
}

.hero-title {
  font-size: clamp(38px, 10vw, 56px);
  font-weight: 700;
  line-height: 1.05;
  letter-spacing: 1px;
  color: #fff;
  margin-bottom: 0.5rem;
  animation: titleFadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
}

.hero-title-sub {
  font-size: clamp(13px, 3.5vw, 16px);
  font-weight: 400;
  letter-spacing: 3px;
  color: rgba(255, 255, 255, 0.85);
  margin: 8px 0 0 0;
  animation: titleFadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both;
}

.hero-title-rule {
  display: block;
  width: 60px;
  height: 2px;
  background: linear-gradient(to right, transparent, var(--accent), transparent);
  margin: 1.5rem 0;
  animation: ruleExpand 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both;
}

.hero-desc {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.65);
  line-height: 1.7;
  max-width: 380px;
  margin-bottom: 2rem;
  text-wrap: balance;
  animation: elementFadeUp 0.8s ease-out 0.3s both;
}

.hero-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  max-width: 280px;
  animation: elementFadeUp 0.8s ease-out 0.4s both;
}

.btn-primary {
  width: 100%;
}

.btn-ghost {
  display: inline-flex;
  align-items: center;
  align-self: center;
  gap: 5px;
  padding: 6px 0;
  border: none;
  border-bottom: 1px solid rgba(255, 255, 255, 0.18);
  background: transparent;
  color: rgba(255, 255, 255, 0.55);
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.5px;
  cursor: pointer;
  text-decoration: none;
  transition: color 0.2s, border-color 0.2s;
}

.btn-ghost::after {
  content: '→';
  font-size: 13px;
  transition: transform 0.2s;
}

.btn-ghost:hover {
  color: rgba(255, 255, 255, 0.75);
  border-color: rgba(255, 255, 255, 0.35);
  background: transparent;
}

.btn-ghost:hover::after {
  transform: translateX(3px);
}

@keyframes titleFadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes ruleExpand {
  from { width: 0; opacity: 0; }
  to { width: 60px; opacity: 1; }
}

@keyframes elementFadeUp {
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
}

.scroll-hint {
  position: absolute;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 3;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  animation: elementFadeUp 0.8s ease-out 0.8s both;
}

.scroll-hint-text {
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 2.5px;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.38);
}

.scroll-hint-arrow {
  color: rgba(255, 255, 255, 0.45);
  animation: scrollBounce 1.8s ease-in-out infinite;
}

@keyframes scrollBounce {
  0%, 100% { transform: translateY(0); opacity: 0.45; }
  50%       { transform: translateY(6px); opacity: 0.75; }
}

@media (prefers-reduced-motion: reduce) {
  .scroll-hint-arrow { animation: none; }
}
</style>
