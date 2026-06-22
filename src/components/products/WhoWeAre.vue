<template>
  <section class="who-we-are">
    <div class="section-inner">

      <div class="section-header-block" data-reveal>
        <p class="eyebrow">{{ t('products.whoWeAre') }}</p>
        <h2 class="section-heading">{{ locale === 'th' ? 'นวัตกรรมและบริการดิจิทัลภาครัฐ' : 'Digital Innovations for Public Sector' }}</h2>
        <p class="vision-text">{{ t('products.vision') }}</p>
      </div>

      <div class="services-grid">
        <div class="service-card" data-reveal data-delay="1">
          <div class="card-icon-wrap">
            <img src="/product-icon1.png" alt="Web Application" class="card-icon-img" />
          </div>
          <h4>Web Application / Mobile Application</h4>
          <ul class="service-features">
            <li><svg class="feat-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>Workflow Management</li>
            <li><svg class="feat-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>E-Service / E-Form</li>
            <li><svg class="feat-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>Web &amp; API Service</li>
          </ul>
        </div>

        <div class="service-card" data-reveal data-delay="2">
          <div class="card-icon-wrap">
            <img src="/product-icon2.png" alt="E-Document" class="card-icon-img" />
          </div>
          <h4>E-Document Management</h4>
          <ul class="service-features">
            <li><svg class="feat-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>Document Management</li>
            <li><svg class="feat-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>Paperless Solution / OCR</li>
            <li><svg class="feat-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>Digital Signature / Approval</li>
          </ul>
        </div>

        <div class="service-card" data-reveal data-delay="3">
          <div class="card-icon-wrap">
            <img src="/product-icon3.png" alt="GIS" class="card-icon-img" />
          </div>
          <h4>GIS (Geographic Info System)</h4>
          <ul class="service-features">
            <li><svg class="feat-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>Platform GIS</li>
            <li><svg class="feat-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>Spatial Data Storage</li>
            <li><svg class="feat-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>Visual Map &amp; API Services</li>
          </ul>
        </div>
      </div>

    </div>
  </section>
</template>

<script setup lang="ts">
import { useLocale } from '../../composables/useLocale'
const { t, locale } = useLocale()
</script>

<style scoped>
.who-we-are { padding: 100px 0; background: #ffffff; }
.eyebrow { display: block; font-size: 11px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: var(--primary); margin-bottom: 0.75rem; }
.section-heading { font-size: clamp(24px, 3.2vw, 40px); font-weight: 800; line-height: 1.2; color: var(--text-dark); margin-bottom: 1.5rem; }
.section-header-block { max-width: 880px; margin-bottom: 60px; }
.vision-text { font-size: clamp(15px, 1.25vw, 18px); color: #555; line-height: 1.8; font-weight: 400; }
.services-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 28px; }
.service-card { background: #f4f6fb; border-radius: 20px; padding: 36px 28px; border-top: 3px solid var(--primary); transition: transform 0.35s cubic-bezier(0.16,1,0.3,1), box-shadow 0.35s cubic-bezier(0.16,1,0.3,1), background 0.3s; }
.service-card:hover { transform: translateY(-6px); background: #ffffff; box-shadow: 0 16px 48px rgba(49,99,149,0.1); }
.card-icon-wrap { width: 60px; height: 60px; display: flex; align-items: center; justify-content: center; margin-bottom: 24px; border-radius: 12px; background: #ffffff; box-shadow: 0 4px 16px rgba(0,0,0,0.03); transition: transform 0.3s; }
.service-card:hover .card-icon-wrap { transform: scale(1.1); background: #f4f6fb; }
.card-icon-img { width: 32px; height: 32px; object-fit: contain; }
.service-card h4 { font-size: 16.5px; font-weight: 700; color: var(--text-dark); margin-bottom: 1.25rem; line-height: 1.45; height: 48px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.service-features { display: flex; flex-direction: column; gap: 12px; }
.service-features li { display: flex; align-items: flex-start; gap: 10px; font-size: 13.5px; color: #555; line-height: 1.4; }
.feat-check { width: 14px; height: 14px; color: var(--primary); flex-shrink: 0; margin-top: 3px; }

@media (max-width: 900px) { .services-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 768px) { .who-we-are { padding: 72px 0; } }
@media (max-width: 600px) { .services-grid { grid-template-columns: 1fr; } }
</style>
