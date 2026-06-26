<template>
  <section class="about-section-mobile">
    <div class="about-glow"></div>
    <div class="section-inner">
      <div class="about-container">
        <!-- Text Content on top for mobile (better reading flow) -->
        <div class="about-content">
          <p class="eyebrow about-eyebrow" data-reveal>{{ t('home.aboutEye') }}</p>
          <h2 class="block-title about-heading" data-reveal data-delay="1">{{ t('home.aboutTitle') }}</h2>
          <p class="about-text" data-reveal data-delay="2">{{ t('home.aboutDesc') }}</p>
          
          <div class="about-stats" data-reveal data-delay="3">
            <div class="astat">
              <span class="astat-num">20<em>+</em></span>
              <span class="astat-label">{{ t('stat.years') }}</span>
            </div>
            <div class="astat-div"></div>
            <div class="astat">
              <span class="astat-num">150<em>+</em></span>
              <span class="astat-label">{{ t('stat.projects') }}</span>
            </div>
            <div class="astat-div"></div>
            <div class="astat">
              <span class="astat-num">CMMI</span>
              <span class="astat-label">{{ t('stat.certs') }}</span>
            </div>
          </div>

          <div class="about-btn-wrap" data-reveal data-delay="4">
            <RouterLink to="/about" class="btn btn-primary">{{ t('hero.viewMore') }}</RouterLink>
          </div>
        </div>

        <!-- Image on bottom for mobile -->
        <div class="about-img-wrap" data-reveal>
          <img src="/pic-h7.webp" alt="Netservice Thailand office" loading="lazy" class="about-img" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useLocale } from '../../../composables/useLocale'

const { t } = useLocale()

</script>

<style scoped>
.about-section-mobile {
  padding: 60px 0 80px 0;
  background: var(--dark);
  position: relative;
  overflow: hidden;
}

.about-glow {
  position: absolute;
  top: 20%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 320px;
  height: 320px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(49,99,149,0.14) 0%, transparent 70%);
  pointer-events: none;
}

.about-container {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.about-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.about-eyebrow {
  color: var(--accent) !important;
  margin-bottom: 0.5rem;
}

.about-heading {
  color: #fff;
  font-size: 28px !important;
  line-height: 1.25;
  margin-bottom: 1.25rem;
}

.about-text {
  font-size: 14.5px;
  color: rgba(255, 255, 255, 0.65);
  line-height: 1.8;
  margin-bottom: 1.75rem;
}

.about-stats {
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 18px 0;
  background: rgba(255, 255, 255, 0.02);
}
.astat {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}
.astat-num {
  font-size: 22px;
  font-weight: 800;
  color: #fff;
  letter-spacing: -0.02em;
  line-height: 1;
}
.astat-num em {
  font-style: normal;
  color: var(--accent);
  font-size: 0.6em;
}
.astat-label {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.55);
  text-align: center;
  max-width: 80px;
  line-height: 1.3;
}
.astat-div {
  width: 1px;
  height: 32px;
  background: rgba(255, 255, 255, 0.08);
  flex-shrink: 0;
}

.about-btn-wrap {
  width: 100%;
}

.about-btn-wrap .btn-primary {
  width: 100%;
  max-width: 280px;
}

.about-img-wrap {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.about-img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  object-position: center 20%;
}

/* Scrolled entry transitions */
.about-section-mobile [data-reveal] {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.about-section-mobile [data-reveal].is-revealed {
  opacity: 1;
  transform: translateY(0);
}

.about-section-mobile [data-reveal][data-delay='1'] { transition-delay: 0.1s; }
.about-section-mobile [data-reveal][data-delay='2'] { transition-delay: 0.2s; }
.about-section-mobile [data-reveal][data-delay='3'] { transition-delay: 0.3s; }
.about-section-mobile [data-reveal][data-delay='4'] { transition-delay: 0.4s; }
</style>
