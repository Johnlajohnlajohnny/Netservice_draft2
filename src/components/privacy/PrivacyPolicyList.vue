<template>
  <div class="policy-list">

    <div class="policy-card" data-reveal data-delay="1">
      <div class="policy-card-header">
        <div class="policy-num">01</div>
        <h3>{{ t('privacy.card1.title') }}</h3>
      </div>
      <div class="policy-card-body">
        <p>{{ t('privacy.card1.desc') }}</p>
        <div class="policy-subpoints">
          <div class="subpoint">
            <span class="bullet">✔</span>
            <span>{{ locale === 'th' ? 'การเก็บรวบรวมข้อมูลส่วนบุคคลที่จำเป็นและถูกกฎหมาย' : 'Lawful and transparent collection of necessary personal identifier data.' }}</span>
          </div>
          <div class="subpoint">
            <span class="bullet">✔</span>
            <span>{{ locale === 'th' ? 'การประมวลผลข้อมูลตามวัตถุประสงค์การบริการที่แจ้งไว้' : 'Processing limits strictly aligned with designated service operations.' }}</span>
          </div>
          <div class="subpoint">
            <span class="bullet">✔</span>
            <span>{{ locale === 'th' ? 'สิทธิ์การเข้าถึง ตรวจสอบ และขอลบข้อมูลภายใต้ พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล' : 'User rights to inspect, update, or revoke consent under Thailand PDPA.' }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="policy-card" data-reveal data-delay="2">
      <div class="policy-card-header">
        <div class="policy-num">02</div>
        <h3>{{ t('privacy.card2.title') }}</h3>
      </div>
      <div class="policy-card-body">
        <p>{{ t('privacy.card2.desc') }}</p>
        <div class="policy-subpoints">
          <div class="subpoint">
            <span class="bullet">✔</span>
            <span>{{ locale === 'th' ? 'คุกกี้ที่จำเป็นต่อการรันระบบและจดจำเซสชันผู้ใช้' : 'Essential cookies required for functional operations and secure session states.' }}</span>
          </div>
          <div class="subpoint">
            <span class="bullet">✔</span>
            <span>{{ locale === 'th' ? 'คุกกี้สถิติและการวิเคราะห์เพื่อปรับปรุงประสิทธิภาพเว็บไซต์' : 'Analytical cookies to map usage flows and boost application loading speeds.' }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="policy-card" data-reveal data-delay="3">
      <div class="policy-card-header">
        <div class="policy-num">03</div>
        <h3>{{ locale === 'th' ? 'การรักษาความมั่นคงปลอดภัยและระยะเวลาเก็บข้อมูล' : 'Data Security & Retention Period' }}</h3>
      </div>
      <div class="policy-card-body">
        <p>{{ locale === 'th'
          ? 'บริษัทฯ ใช้มาตรการทางเทคนิคและการบริหารจัดการที่เหมาะสมเพื่อป้องกันการสูญหาย การเข้าถึงโดยไม่ได้รับอนุญาต การเปิดเผย หรือการแก้ไขข้อมูลส่วนบุคคลโดยมิชอบ'
          : 'We implement appropriate technical and organizational security measures to protect personal data against loss, unauthorized access, disclosure, or unlawful modification.' }}</p>
        <div class="policy-subpoints">
          <div class="subpoint">
            <span class="bullet">✔</span>
            <span>{{ locale === 'th' ? 'การเข้ารหัสข้อมูลด้วยมาตรฐาน TLS/SSL สำหรับการส่งผ่านข้อมูลทั้งหมด' : 'TLS/SSL encryption for all data transmissions between systems.' }}</span>
          </div>
          <div class="subpoint">
            <span class="bullet">✔</span>
            <span>{{ locale === 'th' ? 'เก็บข้อมูลตามระยะเวลาที่กฎหมายกำหนด แล้วลบหรือทำให้ไม่สามารถระบุตัวตนได้' : 'Data retained only for the legally required duration, then deleted or anonymized.' }}</span>
          </div>
          <div class="subpoint">
            <span class="bullet">✔</span>
            <span>{{ locale === 'th' ? 'ระบบควบคุมการเข้าถึงข้อมูลตามสิทธิ์หน้าที่ของพนักงาน (Role-Based Access Control)' : 'Role-based access control limiting data access to authorized personnel only.' }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="policy-card" data-reveal data-delay="4">
      <div class="policy-card-header">
        <div class="policy-num">04</div>
        <h3>{{ locale === 'th' ? 'การเปิดเผยข้อมูลแก่บุคคลที่สาม' : 'Third-Party Data Disclosure' }}</h3>
      </div>
      <div class="policy-card-body">
        <p>{{ locale === 'th'
          ? 'บริษัทฯ จะไม่จำหน่าย แลกเปลี่ยน หรือถ่ายโอนข้อมูลส่วนบุคคลของท่านให้แก่บุคคลภายนอก เว้นแต่จะได้รับความยินยอมจากท่าน หรือเป็นการดำเนินการตามที่กฎหมายกำหนด'
          : 'We do not sell, trade, or transfer personal data to external parties without your explicit consent, except as required by applicable law or to deliver contracted services.' }}</p>
        <div class="policy-subpoints">
          <div class="subpoint">
            <span class="bullet">✔</span>
            <span>{{ locale === 'th' ? 'ผู้ให้บริการระบบคลาวด์และโครงสร้างพื้นฐานที่ผ่านการรับรองมาตรฐาน ISO 27001' : 'Cloud infrastructure providers certified to ISO 27001 standard.' }}</span>
          </div>
          <div class="subpoint">
            <span class="bullet">✔</span>
            <span>{{ locale === 'th' ? 'หน่วยงานภาครัฐและหน่วยงานกำกับดูแลตามที่กฎหมายกำหนด' : 'Regulatory authorities and government bodies as required by law.' }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="policy-card" data-reveal data-delay="1">
      <div class="policy-card-header">
        <div class="policy-num">05</div>
        <h3>{{ locale === 'th' ? 'สิทธิ์ของเจ้าของข้อมูลภายใต้ พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล' : 'Your Rights Under PDPA' }}</h3>
      </div>
      <div class="policy-card-body">
        <p>{{ locale === 'th'
          ? 'ภายใต้พระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 ท่านมีสิทธิ์ดังต่อไปนี้ในฐานะเจ้าของข้อมูลส่วนบุคคล'
          : 'Under the Personal Data Protection Act B.E. 2562 (PDPA), you have the following rights as a data subject.' }}</p>
        <div class="policy-subpoints">
          <div class="subpoint">
            <span class="bullet">✔</span>
            <span>{{ locale === 'th' ? 'สิทธิ์เข้าถึงและรับสำเนาข้อมูลส่วนบุคคลของท่าน' : 'Right to access and receive a copy of your personal data.' }}</span>
          </div>
          <div class="subpoint">
            <span class="bullet">✔</span>
            <span>{{ locale === 'th' ? 'สิทธิ์ขอแก้ไขข้อมูลที่ไม่ถูกต้องหรือไม่ครบถ้วน' : 'Right to rectify inaccurate or incomplete data.' }}</span>
          </div>
          <div class="subpoint">
            <span class="bullet">✔</span>
            <span>{{ locale === 'th' ? 'สิทธิ์ขอลบ ระงับการใช้ หรือถอนความยินยอมเมื่อใดก็ได้' : 'Right to erasure, restriction of processing, or withdrawal of consent at any time.' }}</span>
          </div>
          <div class="subpoint">
            <span class="bullet">✔</span>
            <span>{{ locale === 'th' ? 'ติดต่อเจ้าหน้าที่คุ้มครองข้อมูล (DPO) ได้ที่ info@netservicethailand.com' : 'Contact our Data Protection Officer at info@netservicethailand.com' }}</span>
          </div>
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
.policy-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.policy-card {
  background: #f4f6fb;
  border-radius: 20px;
  padding: 36px;
  border: 1px solid rgba(0,0,0,0.03);
  transition: transform 0.3s, box-shadow 0.3s, background 0.3s, border-color 0.3s;
}
.policy-card:hover {
  transform: translateY(-4px);
  background: #ffffff;
  box-shadow: 0 16px 40px rgba(49,99,149,0.06);
  border-color: rgba(49,99,149,0.15);
}

.policy-card-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 1.25rem;
}
.policy-num {
  font-size: 24px;
  font-weight: 800;
  color: var(--primary);
  opacity: 0.25;
  transition: opacity 0.3s;
  flex-shrink: 0;
}
.policy-card:hover .policy-num {
  opacity: 0.8;
}
.policy-card-header h3 {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-dark);
}

.policy-card-body p {
  font-size: 14px;
  color: #555;
  line-height: 1.8;
}

.policy-subpoints {
  margin-top: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 12px;
  color: #555;
  font-size: 14px;
}
.subpoint {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}
.bullet {
  color: var(--primary);
  font-weight: bold;
  flex-shrink: 0;
}

@media (max-width: 768px) {
  .policy-card {
    padding: 24px;
  }
  .policy-card-header {
    gap: 16px;
  }
}
</style>
