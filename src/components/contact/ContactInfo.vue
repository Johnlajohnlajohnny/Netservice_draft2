<template>
  <div class="info-cards" data-reveal>
    
    <div class="info-card" data-reveal data-delay="1">
      <div class="info-icon-wrap">
        <svg class="info-svg" viewBox="0 0 512 512" fill="currentColor" aria-hidden="true" focusable="false"><path d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z"/></svg>
      </div>
      <div class="info-body">
        <h4>{{ t('contact.phoneLabel') }}</h4>
        <a href="tel:0-2502-6000" class="info-link">0-2502-6000</a>
      </div>
    </div>

    <div class="info-card" data-reveal data-delay="2">
      <div class="info-icon-wrap">
        <svg class="info-svg" viewBox="0 0 512 512" fill="currentColor" aria-hidden="true" focusable="false"><path d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48H48zM0 176V384c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V176L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z"/></svg>
      </div>
      <div class="info-body">
        <h4>{{ t('contact.emailLabel') }}</h4>
        <a href="mailto:info@netservicethailand.com" class="info-link">info@netservicethailand.com</a>
      </div>
    </div>

    <div class="info-card" data-reveal data-delay="3">
      <div class="info-icon-wrap">
        <svg class="info-svg" viewBox="0 0 384 512" fill="currentColor" aria-hidden="true" focusable="false"><path d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"/></svg>
      </div>
      <div class="info-body">
        <h4>{{ t('contact.addressLabel') }}</h4>
        <p class="info-text">{{ t('contact.addressValue') }}</p>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { useLocale } from '../../composables/useLocale'
const { t } = useLocale()
</script>

<style scoped>
.info-cards {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.info-card {
  display: flex;
  gap: 20px;
  align-items: flex-start;
  padding: 32px;
  background: #f4f6fb;
  border-radius: 20px;
  border: 1px solid rgba(0,0,0,0.03);
  transition: transform 0.3s, box-shadow 0.3s, background 0.3s;
}
.info-card:hover {
  transform: translateY(-4px);
  background: #ffffff;
  box-shadow: 0 12px 36px rgba(49,99,149,0.08);
  border-color: rgba(49,99,149,0.15);
}
.info-icon-wrap {
  width: 52px;
  height: 52px;
  border-radius: 12px;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 16px rgba(0,0,0,0.02);
  flex-shrink: 0;
  transition: background 0.3s;
}
.info-card:hover .info-icon-wrap {
  background: #f4f6fb;
}
.info-svg {
  width: 24px;
  height: 24px;
  color: var(--primary);
}
.info-body h4 {
  font-size: 15px;
  font-weight: 700;
  color: var(--text-dark);
  margin-bottom: 6px;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}
.info-link {
  font-size: 16px;
  font-weight: 600;
  color: var(--primary);
}
.info-link:hover {
  text-decoration: underline;
}
.info-text {
  font-family: 'Kanit', sans-serif;
  font-size: 14px;
  color: #555;
  line-height: 1.6;
}
</style>
