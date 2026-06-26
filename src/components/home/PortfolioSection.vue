<template>
  <section class="portfolio-section" ref="sectionRef" @mousemove="onPfMouseMove" @mouseleave="onPfMouseLeave">
    <div class="pf-glows" aria-hidden="true">
      <div class="pf-glow-dot pf-glow-dot--1"></div>
      <div class="pf-glow-dot pf-glow-dot--2"></div>
      <div class="pf-glow-dot pf-glow-dot--3"></div>
      <div class="pf-glow-dot pf-glow-dot--4"></div>
      <div class="pf-glow-dot pf-glow-dot--5"></div>
      <div class="pf-glow-dot pf-glow-dot--6"></div>
    </div>
    <div class="section-inner">
      <div class="pf-header">
        <div>
          <p class="eyebrow pf-eyebrow" data-reveal>{{ t('home.portfolioSub') }}</p>
          <h2 class="block-title pf-heading" data-reveal data-delay="1">{{ t('home.portfolioTitle') }}</h2>
        </div>
        <RouterLink to="/portfolio" class="pf-view-all" data-reveal data-delay="2">
          View All Projects <span class="pf-arrow">→</span>
        </RouterLink>
      </div>
      <div class="pf-grid">
        <RouterLink class="pf-card" v-for="(p, i) in featuredProjects" :key="p.title"
          :to="`/portfolio/${p.slug}`"
          :ref="el => { pfCardRefs[i] = ((el as any)?.$el ?? el) as HTMLElement }"
          data-reveal :data-delay="(i % 3) + 1" :style="{ '--accent': p.color }">
          <div class="pf-visual" :class="{ 'pf-visual--img': p.img }"
            :style="p.img
              ? { backgroundImage: `url(${p.img})` }
              : { background: `linear-gradient(135deg, ${p.color}ee 0%, ${p.color}77 100%)` }">
            <div class="pf-visual-grid" v-if="!p.img"></div>
            <div class="pf-visual-icon" v-if="!p.img" v-html="pfCatIcon(p.category)"></div>
            <span class="pf-visual-budget" v-if="p.budget">{{ formatBudget(p.budget, locale === 'en') }}</span>
          </div>
          <div class="pf-info">
            <div class="pf-info-row">
              <div>
                <p class="pf-client-name">{{ locale === 'en' ? p.clientEn : p.client }}</p>
                <span class="pf-type-label">{{ p.type }}</span>
              </div>
              <div class="pf-arrow-btn" :style="{ background: p.color }">→</div>
            </div>
            <div class="pf-reveal">
              <div class="pf-reveal-inner">
                <p class="pf-project-title">{{ locale === 'en' ? p.titleEn : p.title }}</p>
                <div class="pf-tags">
                  <span v-for="tag in p.tags" :key="tag">{{ tag }}</span>
                </div>
                <span class="pf-learn-btn" :style="{ '--btn-color': p.color }">
                  Learn More <span class="pf-arrow">→</span>
                </span>
              </div>
            </div>
          </div>
        </RouterLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { useLocale } from '../../composables/useLocale'
import { featuredProjects as allFeatured, formatBudget } from '../../data/portfolioData'

const { t, locale } = useLocale()

const sectionRef  = ref<HTMLElement | null>(null)
const pfCardRefs  = ref<HTMLElement[]>([])
const PF_MOVE     = { x: 38, y: 28 }

let cachedTop = 0, cachedH = 0, cachedLeft = 0, cachedW = 0
let rafPf: number | null = null

function cacheOffset() {
  if (sectionRef.value) {
    const r   = sectionRef.value.getBoundingClientRect()
    cachedTop  = r.top + window.scrollY
    cachedH    = r.height
    cachedLeft = r.left
    cachedW    = r.width
  }
}

function onPfMouseMove(e: MouseEvent) {
  cancelAnimationFrame(rafPf!)
  rafPf = requestAnimationFrame(() => {
    if (!cachedW) return
    const pfTop = cachedTop - window.scrollY
    const nx = ((e.clientX - cachedLeft) / cachedW - 0.5) * 2
    const ny = ((e.clientY - pfTop) / cachedH - 0.5) * 2
    pfCardRefs.value.forEach(card => {
      if (!card) return
      card.style.transition = ''
      card.style.translate   = `${nx * PF_MOVE.x}px ${ny * PF_MOVE.y}px`
    })
  })
}
function onPfMouseLeave() {
  cancelAnimationFrame(rafPf!)
  pfCardRefs.value.forEach(card => {
    if (!card) return
    gsap.to(card, { translate: '0px 0px', duration: 1.1, ease: 'power4.out', overwrite: true })
  })
}

onMounted(() => {
  cacheOffset()
  window.addEventListener('resize', cacheOffset)
})
onUnmounted(() => {
  window.removeEventListener('resize', cacheOffset)
  cancelAnimationFrame(rafPf!)
})

const svgWebApp = `<svg width="30" height="30" viewBox="0 0 448 512" fill="currentColor" style="display:block"><path d="M400 32C426.5 32 448 53.49 448 80V336C448 362.5 426.5 384 400 384H266.7L277.3 416H352C369.7 416 384 430.3 384 448C384 465.7 369.7 480 352 480H96C78.33 480 64 465.7 64 448C64 430.3 78.33 416 96 416H170.7L181.3 384H48C21.49 384 0 362.5 0 336V80C0 53.49 21.49 32 48 32H400zM64 96V320H384V96H64z"/></svg>`
const svgEDoc   = `<svg width="30" height="30" viewBox="0 0 384 512" fill="currentColor"><path d="M224 136V0H24C10.7 0 0 10.7 0 24v464c0 13.3 10.7 24 24 24h336c13.3 0 24-10.7 24-24V160H248c-13.2 0-24-10.8-24-24zm64 236c0 6.6-5.4 12-12 12H108c-6.6 0-12-5.4-12-12v-8c0-6.6 5.4-12 12-12h168c6.6 0 12 5.4 12 12v8zm0-64c0 6.6-5.4 12-12 12H108c-6.6 0-12-5.4-12-12v-8c0-6.6 5.4-12 12-12h168c6.6 0 12 5.4 12 12v8zm0-72v8c0 6.6-5.4 12-12 12H108c-6.6 0-12-5.4-12-12v-8c0-6.6 5.4-12 12-12h168c6.6 0 12 5.4 12 12zm96-153.1L286.1 32C279.1 25 269.8 21 260 21h-4v127h127v-4.1c0-9.7-4-19.1-11.1-26.1z"/></svg>`
const svgGIS    = `<svg width="30" height="30" viewBox="0 0 576 512" fill="currentColor"><path d="M408 120C408 174.6 334.9 271.9 302.8 311.1C295.1 321.6 280.9 321.6 273.2 311.1C241.1 271.9 168 174.6 168 120C168 53.73 221.7 0 288 0C354.3 0 408 53.73 408 120zM288 152C310.1 152 328 134.1 328 112C328 89.91 310.1 72 288 72C265.9 72 248 89.91 248 112C248 134.1 265.9 152 288 152zM432 416c0 35.3-64.2 64-143.5 64S144 451.3 144 416s64.2-64 143.5-64S432 380.7 432 416z"/></svg>`

function pfCatIcon(category: string) {
  if (category === 'edoc') return svgEDoc
  if (category === 'gis')  return svgGIS
  return svgWebApp
}

const featuredProjects = allFeatured.slice(0, 6)
</script>

<style scoped>
.portfolio-section { padding: 120px 0; position: relative; overflow: hidden; background: #060810; }
.pf-glows { position: absolute; inset: 0; pointer-events: none; z-index: 0; }
.pf-glow-dot { position: absolute; border-radius: 50%; background: radial-gradient(circle, rgba(56,189,248,0.9) 0%, rgba(56,189,248,0.35) 35%, transparent 70%); filter: blur(48px); }
.pf-glow-dot--1 { width:280px; height:280px; top:20%; left:10%;  animation: ffloat1 14s ease-in-out infinite, fblink1 3.8s ease-in-out infinite; }
.pf-glow-dot--2 { width:220px; height:220px; top:10%; left:55%;  animation: ffloat2 17s ease-in-out infinite, fblink2 3.1s ease-in-out infinite; animation-delay:-5s,-1.2s; }
.pf-glow-dot--3 { width:260px; height:260px; top:60%; left:30%;  animation: ffloat3 19s ease-in-out infinite, fblink3 4.7s ease-in-out infinite; animation-delay:-8s,-2.4s; }
.pf-glow-dot--4 { width:180px; height:180px; top:15%; left:80%;  animation: ffloat4 12s ease-in-out infinite, fblink1 2.6s ease-in-out infinite; animation-delay:-3s,-0.6s; }
.pf-glow-dot--5 { width:240px; height:240px; top:70%; left:65%;  animation: ffloat1 16s ease-in-out infinite, fblink2 3.5s ease-in-out infinite; animation-delay:-10s,-1.8s; }
.pf-glow-dot--6 { width:200px; height:200px; top:45%; left:5%;   animation: ffloat2 13s ease-in-out infinite, fblink3 2.2s ease-in-out infinite; animation-delay:-6s,-0.9s; }
@keyframes ffloat1 { 0%{transform:translate(0,0)} 18%{transform:translate(286px,-104px)} 38%{transform:translate(104px,234px)} 58%{transform:translate(416px,130px)} 78%{transform:translate(195px,-182px)} 100%{transform:translate(0,0)} }
@keyframes ffloat2 { 0%{transform:translate(0,0)} 22%{transform:translate(-234px,156px)} 45%{transform:translate(130px,260px)} 65%{transform:translate(-338px,78px)} 85%{transform:translate(-104px,-208px)} 100%{transform:translate(0,0)} }
@keyframes ffloat3 { 0%{transform:translate(0,0)} 20%{transform:translate(208px,-234px)} 42%{transform:translate(-156px,-104px)} 65%{transform:translate(312px,104px)} 82%{transform:translate(52px,208px)} 100%{transform:translate(0,0)} }
@keyframes ffloat4 { 0%{transform:translate(0,0)} 25%{transform:translate(-260px,130px)} 50%{transform:translate(-104px,-208px)} 75%{transform:translate(-364px,-78px)} 100%{transform:translate(0,0)} }
@keyframes fblink1 { 0%,100%{opacity:0.85} 35%{opacity:0.15} 55%{opacity:0.75} 78%{opacity:0.08} }
@keyframes fblink2 { 0%,100%{opacity:0.7}  20%{opacity:0.9}  48%{opacity:0.05} 70%{opacity:0.65} }
@keyframes fblink3 { 0%,100%{opacity:0.6}  30%{opacity:0.1}  50%{opacity:0.85} 80%{opacity:0.2} }

.portfolio-section::before { content:''; position:absolute; inset:0; background-image: linear-gradient(rgba(255,255,255,0.055) 1px,transparent 1px), linear-gradient(90deg,rgba(255,255,255,0.055) 1px,transparent 1px); background-size:52px 52px; pointer-events:none; z-index:0; }
.portfolio-section .section-inner { position: relative; z-index: 1; }
.pf-header { display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:4rem; flex-wrap:wrap; gap:1rem; }
.pf-eyebrow { color: rgba(255,255,255,0.5) !important; }
.pf-heading  { color: #fff; }
.pf-view-all { display:inline-flex; align-items:center; gap:8px; font-size:13px; font-weight:700; letter-spacing:0.5px; color:rgba(255,255,255,0.55); border:1.5px solid rgba(255,255,255,0.14); padding:10px 22px; border-radius:50px; transition:border-color 0.25s,color 0.25s; }
.pf-view-all:hover { border-color:rgba(255,255,255,0.45); color:#fff; }
.pf-view-all .pf-arrow { transition:transform 0.22s; display:inline-block; }
.pf-view-all:hover .pf-arrow { transform:translateX(4px); }
.pf-grid { display:grid; grid-template-columns:repeat(3,1fr); column-gap:7rem; row-gap:3.5rem; align-items:start; margin-inline:-5vw; }
.pf-card:nth-child(1) { rotate:-1.6deg; }
.pf-card:nth-child(2) { margin-top:100px; rotate:1.3deg; }
.pf-card:nth-child(3) { margin-top:40px;  rotate:-0.7deg; }
.pf-card:nth-child(4) { margin-top:60px;  rotate:2deg; }
.pf-card:nth-child(5) { margin-top:150px; rotate:-1.2deg; }
.pf-card:nth-child(6) { margin-top:20px;  rotate:0.8deg; }
.pf-card { border-radius:4px; overflow:hidden; background:rgba(255,255,255,0.04); box-shadow:0 0 0 1px rgba(255,255,255,0.06),0 8px 32px rgba(0,0,0,0.5); border-top:3px solid var(--accent); transition:translate 0s linear,transform 0.38s cubic-bezier(0.16,1,0.3,1),rotate 0.38s cubic-bezier(0.16,1,0.3,1),box-shadow 0.38s cubic-bezier(0.16,1,0.3,1),background 0.38s cubic-bezier(0.16,1,0.3,1); cursor:pointer; }
.pf-card:hover { background:#12152a; rotate:0deg; transform:translateY(-10px) scale(1.02); box-shadow:0 0 0 1px rgba(56,189,248,0.22),0 0 40px rgba(56,189,248,0.08),0 28px 64px rgba(0,0,0,0.45); }
.pf-visual { position:relative; height:235px; display:flex; align-items:center; justify-content:center; overflow:hidden; }
.pf-visual--img { background-size:130%; background-position:center 30%; transition:background-size 0.6s cubic-bezier(0.16,1,0.3,1),background-position 0.6s cubic-bezier(0.16,1,0.3,1); }
.pf-visual--img::after { content:''; position:absolute; inset:0; background:linear-gradient(to bottom,rgba(0,0,0,0.18) 0%,rgba(0,0,0,0.45) 100%); transition:opacity 0.4s cubic-bezier(0.16,1,0.3,1); z-index:1; }
.pf-card:hover .pf-visual--img::after { opacity:0; }
.pf-card:hover .pf-visual--img { background-size:140%; background-position:center 35%; }
.pf-visual-grid { position:absolute; inset:0; background-image:linear-gradient(rgba(255,255,255,0.09) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.09) 1px,transparent 1px); background-size:26px 26px; z-index:2; }
.pf-visual-icon { position:relative; z-index:2; opacity:0.28; color:#fff; transform:scale(3.2); }
.pf-visual-budget { position:absolute; bottom:12px; right:14px; font-size:12px; font-weight:800; color:rgba(255,255,255,0.92); background:rgba(0,0,0,0.28); padding:4px 11px; border-radius:50px; backdrop-filter:blur(6px); z-index:2; }
.pf-info { padding:1.5rem 1.75rem 1.75rem; }
.pf-info-row { display:flex; justify-content:space-between; align-items:center; }
.pf-client-name { font-size:16px; font-weight:700; color:#fff; margin-bottom:3px; line-height:1.3; }
.pf-type-label { font-size:10.5px; font-weight:600; letter-spacing:0.8px; text-transform:uppercase; color:rgba(255,255,255,0.6); }
.pf-arrow-btn { width:36px; height:36px; border-radius:50%; display:flex; align-items:center; justify-content:center; color:#fff; font-size:15px; flex-shrink:0; transition:transform 0.25s cubic-bezier(0.16,1,0.3,1); }
.pf-card:hover .pf-arrow-btn { transform:translate(2px,-2px); }
.pf-reveal { display:grid; grid-template-rows:0fr; transition:grid-template-rows 0.4s cubic-bezier(0.16,1,0.3,1),margin-top 0.4s cubic-bezier(0.16,1,0.3,1); margin-top:0; }
.pf-card:hover .pf-reveal { grid-template-rows:1fr; margin-top:1rem; }
.pf-reveal-inner { overflow:hidden; display:flex; flex-direction:column; gap:0.75rem; }
.pf-project-title { font-size:12px; color:rgba(255,255,255,0.62); line-height:1.65; }   /* WCAG AA: raised from 0.45 */
.pf-tags { display:flex; flex-wrap:wrap; gap:5px; }
.pf-tags span {
  font-size: 10px;
  font-weight: 550;
  padding: 3px 9px;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: rgba(255, 255, 255, 0.8);
  background: rgba(255, 255, 255, 0.05);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
  will-change: transform, box-shadow;
  transition:
    transform 0.4s cubic-bezier(0.16, 1, 0.3, 1),
    color 0.4s cubic-bezier(0.16, 1, 0.3, 1),
    border-color 0.4s cubic-bezier(0.16, 1, 0.3, 1),
    box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.pf-tags span:hover {
  transform: translateY(-1.5px) scale(1.03);
  color: #ffffff;
  border-color: rgba(255, 255, 255, 0.28);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}
.pf-learn-btn { display:inline-flex; align-items:center; gap:6px; font-size:11.5px; font-weight:700; color:var(--btn-color,#38bdf8); align-self:flex-start; padding:6px 14px 6px 12px; border-radius:20px; border:1px solid var(--btn-color,#38bdf8); position:relative; overflow:hidden; transition:gap 0.22s,opacity 0.22s; }
.pf-learn-btn::before { content:''; position:absolute; inset:0; background:var(--btn-color,#38bdf8); opacity:0.12; pointer-events:none; }
.pf-learn-btn:hover { gap:10px; opacity:0.85; }
.pf-learn-btn .pf-arrow { display:inline-block; transition:transform 0.22s; }
.pf-learn-btn:hover .pf-arrow { transform:translateX(3px); }

@media (max-width: 1024px) { .pf-grid { grid-template-columns: repeat(2,1fr); } }
@media (max-width: 600px)  { .pf-grid { grid-template-columns: 1fr; } .portfolio-section { padding-top:72px; padding-bottom:72px; } }
</style>
