<template>
  <section class="clients-section">
    <div class="clients-header">
      <span class="clients-tag" data-reveal>OUR CLIENTS</span>
      <h2 class="clients-title" data-reveal>{{ t('home.clientsHeadline') }} <span class="clients-accent">{{ t('home.clientsAccent') }}</span></h2>
      <div class="clients-meta" data-reveal>
        <div class="clients-sectors">
          <span>{{ t('home.clientsSector1') }}</span>
          <span>{{ t('home.clientsSector2') }}</span>
        </div>
      </div>
    </div>
    <div class="clients-fade clients-fade--left"></div>
    <div class="clients-fade clients-fade--right"></div>
    <div class="marquee-outer">
      <div class="marquee-track">
        <div class="marquee-item" v-for="(c, i) in [...clients, ...clients]" :key="i">
          <div class="client-logo-wrap" :class="{ 'is-round': c.round }"
            :style="{
              animationDelay: `${(i % 8) * 0.38}s`,
              ...(c.round ? { width: `${c.size ?? 96}px`, height: `${c.size ?? 96}px` } : {})
            }">
            <img :src="c.logo" :alt="c.name" class="client-logo"
              :style="!c.round ? { width: `${c.size ?? 96}px`, height: `${c.size ?? 96}px` } : {}" />
          </div>
          <span class="client-name">{{ c.name }}</span>
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
  { nameTh: 'กรมที่ดิน',                          nameEn: 'Department of Lands',                          logo: '/client_land_dept.png', round: false, size: 96 },
  { nameTh: 'กรมธนารักษ์',                        nameEn: 'Treasury Department',                          logo: '/client_treasury.png', round: true,  size: 96 },
  { nameTh: 'สำนักงานประกันสังคม',                nameEn: 'Social Security Office',                       logo: '/client_sso.png',      round: false, size: 96 },
  { nameTh: 'กรมโยธาธิการและผังเมือง',            nameEn: 'Dept. of Public Works & Town Planning',        logo: '/dpt.png',             round: true,  size: 96 },
  { nameTh: 'กรมป้องกันและบรรเทาสาธารณภัย',      nameEn: 'Dept. of Disaster Prevention & Mitigation',    logo: '/client_ddpm.png',     round: false, size: 96 },
  { nameTh: 'การนิคมอุตสาหกรรมแห่งประเทศไทย',    nameEn: 'Industrial Estate Authority of Thailand',      logo: '/client_ieat.png',     round: false, size: 96 },
  { nameTh: 'สำนักงาน ป.ป.ท.',                    nameEn: 'Office of the PACC',                           logo: '/client_ppat.png',     round: false, size: 96 },
  { nameTh: 'กรมส่งเสริมการเรียนรู้',             nameEn: 'Dept. of Lifelong Learning Promotion',         logo: '/client_dcel.png',     round: false, size: 96 },
  { nameTh: 'กรมพัฒนาพลังงานทดแทนและอนุรักษ์พลังงาน', nameEn: 'Dept. of Alternative Energy Development and Efficiency', logo: '/client_กรมพัฒนาพลังงานทดเเทน.png', round: false, size: 96 },
  { nameTh: 'บริษัท วิทยุการบินแห่งประเทศไทย จำกัด', nameEn: 'Aeronautical Radio of Thailand',           logo: '/client_กรมวิทยุการบิน.png', round: false, size: 96 },
  { nameTh: 'กรมส่งเสริมการปกครองท้องถิ่น',       nameEn: 'Department of Local Administration',           logo: '/Emblem_of_the_Department_of_Local_Administration.svg.png', round: false, size: 96 },
]
const clients = computed(() =>
  clientsData.map(c => ({ ...c, name: locale.value === 'th' ? c.nameTh : c.nameEn }))
)
</script>

<style scoped>
.clients-section {
  padding: 80px 0;
  background: #080d1c;
  overflow: hidden;
  position: relative;
}
.clients-section::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 55% 80% at 15% 50%, rgba(49,99,200,0.13) 0%, transparent 70%),
    radial-gradient(ellipse 45% 70% at 85% 50%, rgba(90,40,200,0.10) 0%, transparent 65%),
    radial-gradient(ellipse 35% 50% at 50% 100%, rgba(30,80,160,0.08) 0%, transparent 60%);
  pointer-events: none;
}
.clients-header { padding: 0 72px; margin-bottom: 36px; }
.clients-tag {
  display: inline-block; font-size: 12px; font-weight: 600; letter-spacing: 0.08em;
  color: rgba(255,255,255,0.85); border: 1px solid rgba(255,255,255,0.18);
  border-radius: 5px; padding: 4px 12px; margin-bottom: 18px;
}
.clients-title { font-size: clamp(2rem, 3.8vw, 3.2rem); font-weight: 700; color: #fff; line-height: 1.15; letter-spacing: -0.02em; margin: 0; }
.clients-meta { display: flex; align-items: center; gap: 20px; margin-top: 16px; flex-wrap: wrap; }
.clients-sectors { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }
.clients-sectors span { font-size: 12px; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase; color: rgba(255,255,255,0.6); border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; padding: 4px 12px; }
.clients-accent { color: var(--accent); }
.marquee-outer { overflow: hidden; position: relative; padding: 8px 0; }
.clients-fade { position: absolute; top: 0; bottom: 0; width: 88px; z-index: 2; pointer-events: none; }
.clients-fade--left  { left: 0;  background: linear-gradient(to right, #080d1c 30%, transparent); }
.clients-fade--right { right: 0; background: linear-gradient(to left,  #080d1c 30%, transparent); }
.marquee-track { display: flex; align-items: flex-start; width: max-content; animation: marquee 12.6s linear infinite; }
.marquee-track:hover { animation-play-state: paused; }
@keyframes marquee {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}
.marquee-item { display: flex; flex-direction: column; align-items: center; gap: 10px; padding: 0 44px; cursor: default; }
.client-logo-wrap { width: 96px; height: 96px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.client-logo-wrap.is-round { border-radius: 50%; overflow: hidden; }
.client-logo-wrap.is-round .client-logo { width: 100%; height: 100%; object-fit: cover; }
.client-logo { object-fit: contain; flex-shrink: 0; }
.clients-tag[data-reveal] { opacity: 0; transform: translateY(14px); transition: opacity 0.6s cubic-bezier(0.16,1,0.3,1), transform 0.6s cubic-bezier(0.16,1,0.3,1); }
.clients-tag[data-reveal].is-revealed { opacity: 1; transform: translateY(0); }
.clients-title[data-reveal] { opacity: 0; transform: translateY(22px); transition: opacity 0.8s cubic-bezier(0.16,1,0.3,1) 0.15s, transform 0.8s cubic-bezier(0.16,1,0.3,1) 0.15s; }
.clients-title[data-reveal].is-revealed { opacity: 1; transform: translateY(0); }
.client-name { font-size: 9.5px; font-weight: 500; color: rgba(255,255,255,0.68); text-align: center; max-width: 88px; line-height: 1.4; white-space: normal; }
@media (max-width: 900px) {
  .client-logo-wrap { width: 56px !important; height: 56px !important; }
  .client-logo { max-width: 56px !important; max-height: 56px !important; }
  .marquee-item { padding: 0 16px; }
  .client-name { font-size: 8.5px; max-width: 64px; }
}
@media (prefers-reduced-motion: reduce) {
  .marquee-track { animation-play-state: paused; }
}
</style>
