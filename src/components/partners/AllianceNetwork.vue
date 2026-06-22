<template>
  <div class="alliance-container" data-reveal data-delay="3">
    <div class="alliance-header">
      <h3 class="alliance-title">{{ locale === 'th' ? 'หน่วยงานภาครัฐที่ไว้วางใจเรา' : 'Public Sector Clients' }}</h3>
      <p class="alliance-subtitle">{{ locale === 'th' ? 'เรามุ่งมั่นให้บริการและพัฒนาระบบแก่กระทรวง กรม และรัฐวิสาหกิจหลักของไทย' : 'Providing enterprise workflows and robust system architecture to Thailand\'s leading ministries and agencies.' }}</p>
    </div>

    <div class="alliance-grid">

      <div class="alliance-card" v-for="client in clients" :key="client.nameTh">
        <div class="client-logo-wrap" :style="{ padding: client.padding || '8px' }">
          <img :src="client.logo" :alt="locale === 'th' ? client.nameTh : client.nameEn" class="client-logo" />
        </div>
        <div>
          <strong>{{ locale === 'th' ? client.nameTh : client.nameEn }}</strong>
          <p>{{ locale === 'th' ? client.descTh : client.descEn }}</p>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { useLocale } from '../../composables/useLocale'
const { locale } = useLocale()

const clients = [
  {
    nameTh: 'กรมที่ดิน', nameEn: 'Department of Lands',
    logo: '/client_land_dept.png', padding: '3px',
    descTh: 'ระบบจัดการเอกสารอิเล็กทรอนิกส์และระบบ GIS ด้านที่ดิน',
    descEn: 'Electronic document management and GIS systems for land administration.',
  },
  {
    nameTh: 'กรมธนารักษ์', nameEn: 'Treasury Department',
    logo: '/client_treasury.png', padding: '4px',
    descTh: 'ระบบบริหารทรัพย์สินราชการและระบบจัดซื้อจัดจ้างภาครัฐ',
    descEn: 'State property management and government procurement tracking services.',
  },
  {
    nameTh: 'สำนักงานประกันสังคม', nameEn: 'Social Security Office',
    logo: '/client_sso.png', padding: '6.5px',
    descTh: 'ระบบ e-Saraban และระบบบริหารข้อมูลประกันสังคมดิจิทัล',
    descEn: 'e-Saraban document system and digital social security data management.',
  },
  {
    nameTh: 'กรมโยธาธิการและผังเมือง', nameEn: 'Dept. of Public Works & Town Planning',
    logo: '/dpt.png', padding: '3.5px',
    descTh: 'ระบบสารสนเทศภูมิศาสตร์ (GIS) ผังเมืองรวมและโครงสร้างพื้นฐาน',
    descEn: 'GIS platform for urban planning and infrastructure management.',
  },
  {
    nameTh: 'กรมป้องกันและบรรเทาสาธารณภัย', nameEn: 'Dept. of Disaster Prevention & Mitigation',
    logo: '/client_ddpm.png', padding: '5.5px',
    descTh: 'ระบบบริหารจัดการข้อมูลภัยพิบัติและการแจ้งเตือนภัยออนไลน์',
    descEn: 'Disaster data management and online alert notification systems.',
  },
  {
    nameTh: 'การนิคมอุตสาหกรรมแห่งประเทศไทย', nameEn: 'Industrial Estate Authority of Thailand',
    logo: '/client_ieat.png', padding: '5.5px',
    descTh: 'ระบบบริหารนิคมอุตสาหกรรมและระบบยื่นคำขอดิจิทัล',
    descEn: 'Industrial estate management and digital permit application systems.',
  },
  {
    nameTh: 'สำนักงาน ป.ป.ท.', nameEn: 'Office of the PACC',
    logo: '/client_ppat.png', padding: '1.5px',
    descTh: 'ระบบสารสนเทศเพื่อการป้องกันและปราบปรามการทุจริต',
    descEn: 'Information systems supporting anti-corruption investigation and prevention.',
  },
  {
    nameTh: 'กรมส่งเสริมการเรียนรู้', nameEn: 'Dept. of Lifelong Learning Promotion',
    logo: '/client_dcel.png', padding: '1.5px',
    descTh: 'แพลตฟอร์มการเรียนรู้ดิจิทัลและระบบจัดการเนื้อหาออนไลน์',
    descEn: 'Digital learning platform and online content management system.',
  },
  {
    nameTh: 'กรมพัฒนาพลังงานทดแทนและอนุรักษ์พลังงาน', nameEn: 'Dept. of Alternative Energy Development and Efficiency',
    logo: '/client_กรมพัฒนาพลังงานทดเเทน.png', padding: '6.5px',
    descTh: 'ระบบฐานข้อมูลดิจิทัลเพื่อการพัฒนาพลังงานทดแทนและอนุรักษ์พลังงาน',
    descEn: 'Digital database platform for alternative energy development and conservation.',
  },
  {
    nameTh: 'บริษัท วิทยุการบินแห่งประเทศไทย จำกัด', nameEn: 'Aeronautical Radio of Thailand',
    logo: '/client_กรมวิทยุการบิน.png', padding: '5px',
    descTh: 'ระบบสารสนเทศความปลอดภัยและการจัดการจราจรทางอากาศ',
    descEn: 'Aviation safety databases and air traffic management support systems.',
  },
  {
    nameTh: 'กรมส่งเสริมการปกครองท้องถิ่น', nameEn: 'Department of Local Administration',
    logo: '/Emblem_of_the_Department_of_Local_Administration.svg.png', padding: '5px',
    descTh: 'ระบบสารสนเทศบริหารงานบุคคลและงบประมาณองค์กรปกครองส่วนท้องถิ่น',
    descEn: 'Human resources and budget management systems for local administrative organizations.',
  },
]
</script>

<style scoped>
.alliance-container {
  background: #060912;
  border-radius: 24px;
  padding: 56px;
  border: 1px solid rgba(255,255,255,0.06);
}
.alliance-header {
  margin-bottom: 40px;
  max-width: 800px;
}
.alliance-title {
  font-size: 22px;
  font-weight: 800;
  color: #ffffff;
  margin-bottom: 8px;
}
.alliance-subtitle {
  font-size: 14.5px;
  color: rgba(255,255,255,0.62);
  line-height: 1.6;
}

.alliance-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}
.alliance-card {
  background: rgba(8,12,26,0.38);
  backdrop-filter: blur(20px) saturate(170%);
  -webkit-backdrop-filter: blur(20px) saturate(170%);
  border-radius: 16px;
  padding: 24px;
  border: 1px solid rgba(56,189,248,0.18);
  display: flex;
  gap: 18px;
  align-items: flex-start;
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.10), 0 8px 24px rgba(0,0,0,0.25);
  transition: transform 0.35s cubic-bezier(0.16,1,0.3,1), box-shadow 0.35s, background 0.35s;
}
.alliance-card:hover {
  transform: translateY(-4px);
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.14), 0 16px 44px rgba(0,0,0,0.4), 0 0 0 1px rgba(200,155,40,0.15);
}

.client-logo-wrap {
  width: 52px;
  height: 52px;
  background: rgba(255,255,255,0.9);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  flex-shrink: 0;
}
.client-logo {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.alliance-card strong {
  display: block;
  font-size: 14px;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 6px;
  line-height: 1.4;
}
.alliance-card p {
  font-size: 13px;
  color: rgba(255,255,255,0.62);
  line-height: 1.6;
}

@media (max-width: 1024px) {
  .alliance-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .alliance-container {
    padding: 32px 24px;
  }
}
</style>
