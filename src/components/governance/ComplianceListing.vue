<template>
  <section class="cg-section">
    <div class="section-inner">
      <div class="cg-header" data-reveal>
        <p class="eyebrow centered">{{ t('nav.corporate') }}</p>
        <h2 class="block-title centered">{{ t('cg.ethicsTitle') }}</h2>
        <p class="cg-intro centered">
          {{ t('cg.intro') }}
        </p>
      </div>
    </div>

    <div class="pdf-list-band">
      <div class="section-inner">
      <div class="pdf-grid">
        <!-- Loop over 7 documents -->
        <div 
          v-for="(docKey, idx) in ['cg.doc1', 'cg.doc2', 'cg.doc3', 'cg.doc4', 'cg.doc5', 'cg.doc6', 'cg.doc7']" 
          :key="docKey"
          class="pdf-card" 
          data-reveal 
          :data-delay="idx + 1"
        >
          <div class="pdf-format-badge">
            <svg class="pdf-icon-svg" viewBox="0 0 384 512" fill="currentColor"><path d="M64 0C28.7 0 0 28.7 0 64V448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V160L224 0H64zM256 160H384L224 0v128c0 17.7 14.3 32 32 32zM128 320h96c13.3 0 24 10.7 24 24s-10.7 24-24 24H128v40c0 13.3-10.7 24-24 24s-24-10.7-24-24V304c0-13.3 10.7-24 24-24h48c13.3 0 24 10.7 24 24s-10.7 24-24 24z"/></svg>
            <span>PDF</span>
          </div>
          <div class="pdf-card-body">
            <div class="pdf-meta">Compliance Document &bull; ENG / THI</div>
            <h3 class="pdf-title">{{ t(docKey) }}</h3>
            <p class="pdf-desc">
              {{ getDocDesc(docKey) }}
            </p>
          </div>
          <div class="pdf-card-action">
            <a :href="getPdfPath(docKey)" download class="btn-download">
              <span>{{ t('cg.download') }}</span>
              <svg class="dl-icon" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M4 16v1a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-1m-4-4-4 4m0 0-4-4m4 4V4"></path></svg>
            </a>
          </div>
        </div>
      </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useLocale } from '../../composables/useLocale'

const { t, locale } = useLocale()

const pdfMap: Record<string, string> = {
  'cg.doc1': '/1.จริยธรรมธุรกิจ.pdf',
  'cg.doc2': '/6.การติดตามดูแลในเรื่องจริยธรรมทางธุรกิจ.pdf',
  'cg.doc3': '/4.นโยบายการต่อต้านการทุจริตคอร์รัปชั่น.pdf',
  'cg.doc4': '/2.จรรยาบรรณของกรรมการและผู้บริหาร.pdf',
  'cg.doc5': '/3.จรรยาบรรณของพนักงาน.pdf',
  'cg.doc6': '/7.นโยบายบริหารความเสี่ยง.pdf',
  'cg.doc7': '/5.ขั้นตอนและวิธีการแจ้งเบาะแส.pdf',
}

function getPdfPath(key: string) {
  return pdfMap[key] ?? '#'
}

function getDocDesc(key: string) {
  const descMap: Record<string, { en: string; th: string }> = {
    'cg.doc1': {
      en: 'Ethical framework and guidelines for running our business with absolute compliance and integrity.',
      th: 'ข้อกำหนดจริยธรรมทางธุรกิจสำหรับการดำเนินงานที่โปร่งใสและตรวจสอบได้'
    },
    'cg.doc2': {
      en: 'Systematic procedures to monitor, audit, and reinforce ethical corporate behaviors.',
      th: 'มาตรการติดตามและประเมินผลการปฏิบัติตามจริยธรรมทางธุรกิจของบุคลากร'
    },
    'cg.doc3': {
      en: 'Strict policy prohibiting bribery, corruption, and financial misconduct across all divisions.',
      th: 'แนวทางการดำเนินธุรกิจที่ปราศจากทุจริตและการให้สินบนในทุกระดับ'
    },
    'cg.doc4': {
      en: 'Standards governing executive leadership decisions and corporate stewardship activities.',
      th: 'หลักเกณฑ์การปฏิบัติหน้าที่ด้วยความรับผิดชอบและความซื่อสัตย์ของผู้บริหาร'
    },
    'cg.doc5': {
      en: 'Daily conduct regulations ensuring employee professionalism, safety, and mutual respect.',
      th: 'ข้อพึงปฏิบัติและจรรยาบรรณในการปฏิบัติงานประจำวันสำหรับพนักงานทุกคน'
    },
    'cg.doc6': {
      en: 'Strategic protocol to identify, evaluate, and mitigate financial and operational risks.',
      th: 'กรอบโครงสร้างการระบุ ประเมิน และบริหารความเสี่ยงระดับองค์กร'
    },
    'cg.doc7': {
      en: 'Safe whistleblowing channels guaranteeing identity protection and fair investigations.',
      th: 'ขั้นตอนการแจ้งเรื่องร้องเรียน การคุ้มครองผู้ให้เบาะแส และการสืบสวนที่เป็นธรรม'
    }
  }
  return descMap[key]?.[locale.value] || ''
}
</script>

<style scoped>
.cg-section {
  padding: 0;
  background: #060912;
}
/* .section-inner is defined globally in style.css — no override needed */

/* Dark header band */
.cg-header {
  padding: 100px 0 80px;
}

.eyebrow {
  display: block;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: var(--primary);
  margin-bottom: 0.75rem;
}
.eyebrow.centered { text-align: center; }

.block-title {
  font-size: clamp(26px, 3.2vw, 42px);
  font-weight: 700;
  line-height: 1.2;
  color: #ffffff;
  margin-bottom: 3.5rem;
}
.block-title.centered { text-align: center; }

.cg-intro {
  max-width: 800px;
  margin: -2.5rem auto 0 auto;
  color: rgba(255,255,255,0.62);
  line-height: 1.8;
  font-size: 15px;
}

/* Light document list band */
.pdf-list-band {
  background: #f4f6fb;
  border-radius: 32px 32px 0 0;
  padding: 72px 0 100px;
}

.pdf-grid {
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 960px;
  margin: 0 auto;
}

/* Document Cards */
.pdf-card {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 32px;
  align-items: center;
  padding: 32px;
  background: #ffffff;
  border-radius: 20px;
  border: 1px solid rgba(0,0,0,0.03);
  transition: transform 0.3s, box-shadow 0.3s, background 0.3s, border-color 0.3s;
}
.pdf-card:hover {
  transform: translateY(-4px);
  background: #ffffff;
  box-shadow: 0 16px 40px rgba(49,99,149,0.08);
  border-color: rgba(49,99,149,0.15);
}

.pdf-format-badge {
  width: 64px;
  height: 64px;
  border-radius: 14px;
  background: #f4f6fb;
  box-shadow: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  color: #e53e3e;
  font-weight: 800;
  font-size: 11px;
  flex-shrink: 0;
  border: 1px solid rgba(0,0,0,0.04);
  transition: background 0.3s, color 0.3s;
}
.pdf-card:hover .pdf-format-badge {
  background: #e53e3e;
  color: #ffffff;
}
.pdf-icon-svg {
  width: 20px;
  height: 20px;
}

.pdf-card-body {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.pdf-meta {
  font-size: 11px;
  font-weight: 700;
  color: var(--primary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.pdf-title {
  font-size: 17px;
  font-weight: 700;
  color: var(--text-dark);
}
.pdf-desc {
  font-size: 13.5px;
  color: #666;
  line-height: 1.6;
}

.btn-download {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: var(--primary);
  color: #ffffff;
  font-family: 'Kanit', sans-serif;
  font-size: 13.5px;
  font-weight: 700;
  padding: 12px 24px;
  border-radius: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: opacity 0.25s, gap 0.25s;
  border: none;
  cursor: pointer;
  text-decoration: none;
}
.btn-download:hover {
  opacity: 0.9;
  gap: 14px;
}
.dl-icon {
  width: 14px;
  height: 14px;
}

@media (max-width: 900px) {
  .pdf-card {
    grid-template-columns: auto 1fr;
    gap: 24px;
  }
  .pdf-card-action {
    grid-column: span 2;
    text-align: right;
  }
  .btn-download {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .cg-header {
    padding: 72px 0 56px;
  }
  .pdf-list-band {
    padding: 48px 0 72px;
    border-radius: 24px 24px 0 0;
  }
  .pdf-card {
    padding: 24px;
  }
}

@media (max-width: 500px) {
  .pdf-card {
    grid-template-columns: 1fr;
    text-align: center;
  }
  .pdf-format-badge {
    margin: 0 auto;
  }
  .pdf-card-action {
    grid-column: span 1;
  }
}
</style>
