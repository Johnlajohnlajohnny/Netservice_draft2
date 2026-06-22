<template>
  <div class="network-container">
    <h3 class="network-title" data-reveal>{{ locale === 'th' ? 'โครงข่ายพันธมิตรและบริษัทแม่' : 'Parent Enterprise & Group Network' }}</h3>
    
    <div class="partners-grid">
      
      <!-- Samart Telcoms -->
      <div class="partner-card" data-reveal data-delay="1">
        <div class="partner-logo-wrap">
          <img src="/logo_samart%20telcom.png" alt="Samart Telcoms PCL" class="partner-logo" />
        </div>
        <div class="partner-body">
          <h5>Samart Telcoms PCL</h5>
          <span class="partner-relation">{{ locale === 'th' ? 'กลุ่มบริษัทหลัก' : 'Parent Group Company' }}</span>
          <p>{{ t('partners.desc') }}</p>
        </div>
      </div>

      <!-- Samart Comtech -->
      <div class="partner-card" data-reveal data-delay="2">
        <div class="partner-logo-wrap">
          <img src="/samart%20logo%20comtech.webp" alt="Samart Comtech Co., Ltd." class="partner-logo" />
        </div>
        <div class="partner-body">
          <h5>Samart Comtech Co., Ltd.</h5>
          <span class="partner-relation">{{ locale === 'th' ? 'ผู้ถือหุ้นหลัก 100%' : 'Major Shareholder (100%)' }}</span>
          <p>{{ locale === 'th' ? 'บริษัทในเครือสามารถเทลคอมในการขับเคลื่อนนวัตกรรมและเทคโนโลยีสารสนเทศเพื่อความปลอดภัยและความคุ้มค่า' : 'Driving force of information technology and infrastructure safety for national-scale developments.' }}</p>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { useLocale } from '../../composables/useLocale'
const { t, locale } = useLocale()
</script>

<style scoped>
.network-container {
  margin-bottom: 80px;
}
.network-title {
  font-size: 22px;
  font-weight: 800;
  color: var(--text-dark);
  margin-bottom: 32px;
  border-left: 4px solid var(--primary);
  padding-left: 16px;
}

.partners-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 32px;
}

/* Partner Cards */
.partner-card {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 32px;
  align-items: center;
  background: linear-gradient(135deg, #f8faff 0%, #f2f6fc 100%);
  border-radius: 24px;
  padding: 40px;
  border: 1px solid rgba(49,99,149,0.10);
  box-shadow: 0 4px 24px rgba(49,99,149,0.07), 0 1px 4px rgba(0,0,0,0.04);
  position: relative;
  overflow: hidden;
  transition: transform 0.35s cubic-bezier(0.16,1,0.3,1), box-shadow 0.35s, border-color 0.35s, background 0.35s;
}
.partner-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 2px;
  background: linear-gradient(to right, var(--primary), var(--accent));
  border-radius: 24px 24px 0 0;
  opacity: 0;
  transition: opacity 0.35s;
}
.partner-card:hover::before { opacity: 1; }
.partner-card:hover {
  transform: translateY(-6px);
  background: #ffffff;
  box-shadow: 0 20px 56px rgba(49,99,149,0.13), 0 4px 12px rgba(0,0,0,0.06);
  border-color: rgba(49,99,149,0.18);
}
.partner-logo-wrap {
  width: 140px;
  height: 96px;
  background: #ffffff;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  border: 1px solid rgba(49,99,149,0.09);
  box-shadow: 0 2px 12px rgba(49,99,149,0.06), 0 1px 3px rgba(0,0,0,0.04);
  flex-shrink: 0;
  transition: background 0.35s, box-shadow 0.35s, border-color 0.35s;
}
.partner-card:hover .partner-logo-wrap {
  background: #f8faff;
  border-color: rgba(49,99,149,0.16);
  box-shadow: 0 4px 18px rgba(49,99,149,0.10), 0 1px 4px rgba(0,0,0,0.05);
}
.partner-logo {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}
.partner-logo.grayscale {
  filter: grayscale(1) opacity(0.85);
  transition: filter 0.3s;
}
.partner-card:hover .partner-logo.grayscale {
  filter: none;
}

.partner-body h5 {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-dark);
  margin-bottom: 4px;
}
.partner-relation {
  display: inline-block;
  font-size: 11px;
  font-weight: 700;
  color: var(--primary);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 12px;
}
.partner-body p {
  font-size: 13.5px;
  color: #666;
  line-height: 1.7;
}

@media (max-width: 1024px) {
  .partners-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .partner-card {
    grid-template-columns: 1fr;
    text-align: center;
    padding: 32px;
  }
  .partner-logo-wrap {
    margin: 0 auto;
  }
}
</style>
