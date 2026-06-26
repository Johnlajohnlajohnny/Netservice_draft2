<template>
  <section class="clients-section">
    <div class="section-inner">
      <div class="clients-header" data-reveal>
        <p class="eyebrow centered light">{{ t('home.clientsTitle') }}</p>
        <h2 class="block-title centered light">{{ locale === 'th' ? 'หน่วยงานที่ไว้วางใจเรา' : 'Organizations That Trust Us' }}</h2>
      </div>
      <div class="clients-grid">
        <div
          class="client-card"
          v-for="(c, i) in clients"
          :key="c.name"
          data-reveal
          :data-delay="(i % 4) + 1"
        >
          <div class="client-logo-wrap" :style="{ padding: c.padding || '10px' }">
            <img :src="c.logo" :alt="c.name" class="client-logo" />
          </div>
          <span class="client-name-text">{{ c.name }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useLocale } from '../../composables/useLocale'
const { t, locale } = useLocale()

const clientsData = [
  { nameTh: 'กรมที่ดิน',                          nameEn: 'Department of Lands',                          logo: '/client_land_dept.png', padding: '4px' },
  { nameTh: 'กรมธนารักษ์',                        nameEn: 'Treasury Department',                          logo: '/client_treasury.png', padding: '6px' },
  { nameTh: 'สำนักงานประกันสังคม',                nameEn: 'Social Security Office',                       logo: '/client_sso.png',      padding: '10px' },
  { nameTh: 'กรมโยธาธิการและผังเมือง',            nameEn: 'Dept. of Public Works & Town Planning',        logo: '/dpt.png',             padding: '5px' },
  { nameTh: 'กรมป้องกันและบรรเทาสาธารณภัย',      nameEn: 'Dept. of Disaster Prevention & Mitigation',    logo: '/client_ddpm.png',     padding: '8px' },
  { nameTh: 'การนิคมอุตสาหกรรมแห่งประเทศไทย',    nameEn: 'Industrial Estate Authority of Thailand',      logo: '/client_ieat.png',     padding: '8px' },
  { nameTh: 'สำนักงาน ป.ป.ท.',                    nameEn: 'Office of the PACC',                           logo: '/client_ppat.png',     padding: '2px' },
  { nameTh: 'กรมส่งเสริมการเรียนรู้',             nameEn: 'Dept. of Lifelong Learning Promotion',         logo: '/client_dcel.png',     padding: '2px' },
  { nameTh: 'กรมพัฒนาพลังงานทดแทนและอนุรักษ์พลังงาน', nameEn: 'Dept. of Alternative Energy Development and Efficiency', logo: '/client_กรมพัฒนาพลังงานทดเเทน.png', padding: '10px' },
  { nameTh: 'บริษัท วิทยุการบินแห่งประเทศไทย จำกัด', nameEn: 'Aeronautical Radio of Thailand',           logo: '/client_กรมวิทยุการบิน.png', padding: '7px' },
  { nameTh: 'กรมส่งเสริมการปกครองท้องถิ่น',       nameEn: 'Department of Local Administration',           logo: '/Emblem_of_the_Department_of_Local_Administration.svg.png', padding: '7px' },
]
const clients = computed(() =>
  clientsData.map(c => ({ ...c, name: locale.value === 'th' ? c.nameTh : c.nameEn }))
)
</script>

<style scoped>
.clients-section { background: #060912; padding: 80px 0; }
.eyebrow { display: block; font-size: 11px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: var(--primary); margin-bottom: 0.75rem; }
.eyebrow.centered { text-align: center; }
.eyebrow.light { color: rgba(255,255,255,0.5); }
.block-title { font-size: clamp(26px, 3.2vw, 42px); font-weight: 700; line-height: 1.2; color: var(--text-dark); margin-bottom: 2.5rem; }
.block-title.centered { text-align: center; margin-bottom: 1.5rem; }
.block-title.light { color: #fff; }
.clients-header { margin-bottom: 56px; }
.clients-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
.client-card { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07); border-radius: 18px; padding: 32px 20px; display: flex; flex-direction: column; align-items: center; gap: 16px; transition: background 0.25s, border-color 0.25s, transform 0.3s cubic-bezier(0.16,1,0.3,1); }
.client-card:hover { background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.14); transform: translateY(-4px); }
.client-logo-wrap { width: 80px; height: 80px; background: #fff; border-radius: 50%; overflow: hidden; display: flex; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: 0 4px 16px rgba(0,0,0,0.3); }
.client-logo { max-width: 100%; max-height: 100%; object-fit: contain; }
.client-name-text { font-size: 11.5px; font-weight: 600; color: rgba(255,255,255,0.6); text-align: center; line-height: 1.55; }

@media (max-width: 1024px) { .clients-grid { grid-template-columns: repeat(4, 1fr); } }
@media (max-width: 768px) { .clients-section { padding: 72px 0; } .clients-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 500px) { .clients-grid { grid-template-columns: repeat(2, 1fr); } }
</style>
