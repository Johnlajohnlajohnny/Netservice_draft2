<template>
  <section class="about-certs-section">
    <div class="section-inner">
      <div class="certs-header" data-reveal>
        <p class="eyebrow centered">{{ t('footer.standards') }}</p>
        <h2 class="block-title centered">{{ locale === 'th' ? 'มาตรฐานวิศวกรรมซอฟต์แวร์ระดับสากล' : 'International Quality Certifications' }}</h2>
      </div>
      <div class="certs-grid">
        <div class="cert-item-card" data-reveal data-delay="1">
          <div class="cert-img-box">
            <img src="/cert1.jpg" alt="CMMI Level 3" />
          </div>
          <div class="cert-info">
            <h3>CMMI Maturity Level 3</h3>
            <p>{{ locale === 'th' ? 'ได้รับการประเมินมาตรฐานกระบวนการพัฒนาระบบซอฟต์แวร์ระดับสากล ยืนยันกระบวนการทำงานที่มีมาตรฐานเสถียรภาพ และมีการปรับปรุงคุณภาพอย่างต่อเนื่องในทุกโครงการพัฒนาขององค์กร' : "Appraised at Capability Maturity Model Integration Maturity Level 3, recognizing NetService's highly mature, disciplined, and proactive software development processes." }}</p>
          </div>
        </div>
        <div class="cert-item-card" data-reveal data-delay="2">
          <div class="cert-img-box">
            <img src="/cert2.png" alt="ISO/IEC 29110" />
          </div>
          <div class="cert-info">
            <h3>ISO/IEC 29110 Software lifecycle</h3>
            <p>{{ locale === 'th' ? 'มาตรฐานสากลรับรองคุณภาพกระบวนการบริหารโครงการวิศวกรรมซอฟต์แวร์และการพัฒนาผลิตภัณฑ์ซอฟต์แวร์ให้มีคุณภาพและความปลอดภัยสูงสุดระดับเวิลด์คลาส' : 'Certified under Systems and Software Engineering Lifecycle Profiles, guaranteeing standard quality in software project management and lifecycle execution.' }}</p>
          </div>
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
.about-certs-section { padding: 120px 0; background: #fff; }
.eyebrow { display: block; font-size: 11px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: var(--primary); margin-bottom: 0.75rem; }
.eyebrow.centered { text-align: center; }
.block-title { font-size: clamp(26px, 3.2vw, 42px); font-weight: 700; line-height: 1.2; color: var(--text-dark); margin-bottom: 2.5rem; }
.block-title.centered { text-align: center; margin-bottom: 1.5rem; }
.certs-header { margin-bottom: 20px; }
.certs-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 32px; margin-top: 20px; }
.cert-item-card { background: #f4f6fb; border-radius: 24px; padding: 44px; display: flex; gap: 36px; align-items: center; border: 1px solid rgba(0,0,0,0.03); transition: transform 0.3s cubic-bezier(0.16,1,0.3,1), box-shadow 0.3s, background-color 0.25s; }
.cert-item-card:hover { transform: translateY(-4px); box-shadow: 0 16px 48px rgba(49,99,149,0.08); background: #fff; }
.cert-img-box { flex-shrink: 0; width: 110px; height: 110px; display: flex; align-items: center; justify-content: center; background: #fff; border-radius: 18px; padding: 12px; box-shadow: 0 8px 24px rgba(0,0,0,0.03); }
.cert-img-box img { max-width: 100%; max-height: 100%; object-fit: contain; transition: transform 0.3s; }
.cert-item-card:hover .cert-img-box img { transform: scale(1.05); }
.cert-info h3 { font-size: 17px; font-weight: 700; color: var(--text-dark); margin-bottom: 0.75rem; }
.cert-info p  { font-size: 13.5px; color: #666; line-height: 1.75; }

@media (max-width: 1024px) { .certs-grid { grid-template-columns: 1fr; gap: 20px; } }
@media (max-width: 768px) { .about-certs-section { padding: 72px 0; } .cert-item-card { padding: 28px; flex-direction: column; text-align: center; gap: 20px; } .cert-info h3 { padding-right: 52px; padding-left: 52px; } }
</style>
