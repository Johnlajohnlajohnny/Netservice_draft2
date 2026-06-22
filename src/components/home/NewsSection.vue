<template>
  <section class="news-section">
    <div class="section-inner">
      <div class="news-head" data-reveal>
        <div>
          <p class="eyebrow">{{ t('home.newsEye') }}</p>
          <h2 class="block-title" style="margin-bottom:0">{{ t('home.newsTitle') }}</h2>
        </div>
        <RouterLink to="/news" class="btn-link">{{ t('home.exploreMore') }} →</RouterLink>
      </div>

      <div class="cn-label" data-reveal>{{ t('news.sectionCompany') }}</div>

      <div class="cn-layout" data-reveal>
        <article class="cn-featured">
          <RouterLink to="/news" class="cn-card-link">
            <img src="/news1.webp" class="cn-feat-img" alt="ISO Certification" />
            <div class="cn-feat-grad"></div>
            <div class="cn-feat-body">
              <span class="cn-badge">ISO Certification</span>
              <h3 class="cn-feat-title">{{ t('news1.title') }}</h3>
              <p class="cn-feat-desc">{{ t('news1.desc') }}</p>
              <span class="cn-read">{{ t('home.knowMore') }} →</span>
            </div>
          </RouterLink>
        </article>
        <div class="cn-side">
          <article class="cn-side-card">
            <RouterLink to="/news" class="cn-card-link">
              <div class="cn-side-img"><img src="/news2.webp" alt="Ting to Trash CSR project" /></div>
              <div class="cn-side-body">
                <span class="cn-badge">CSR</span>
                <h3 class="cn-side-title">{{ t('news2.title') }}</h3>
                <span class="cn-read cn-read--sm">{{ t('home.knowMore') }} →</span>
              </div>
            </RouterLink>
          </article>
          <article class="cn-side-card">
            <RouterLink to="/news" class="cn-card-link">
              <div class="cn-side-img"><img src="/about-chart1.png" alt="CMMI Level 3 certification" /></div>
              <div class="cn-side-body">
                <span class="cn-badge">CMMI Level 3</span>
                <h3 class="cn-side-title">{{ t('news3.title') }}</h3>
                <span class="cn-read cn-read--sm">{{ t('home.knowMore') }} →</span>
              </div>
            </RouterLink>
          </article>
        </div>
      </div>
    </div>

    <div class="news-divider" aria-hidden="true"></div>

    <div class="tech-band">
      <div class="section-inner">
        <div class="news-head" data-reveal>
          <div>
            <p class="eyebrow">{{ t('home.techEye') }}</p>
            <h3 class="block-title" style="margin-bottom:0">{{ t('news.sectionTech') }}</h3>
          </div>
          <div class="tech-head-right">
            <RouterLink to="/news" class="btn-link">{{ t('home.exploreMore') }} →</RouterLink>
            <div class="tech-arrows">
              <button class="tech-arrow" @click="techScroll(-1)" aria-label="Previous">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </button>
              <button class="tech-arrow" @click="techScroll(1)" aria-label="Next">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </button>
            </div>
          </div>
        </div>
        <div class="tech-grid" ref="techCarouselRef">
          <article class="tech-card"><RouterLink to="/news" class="cn-card-link"><div class="tech-card-img"><img src="/tech_news_google.jpg" alt="" /></div><div class="tech-card-body"><span class="tech-badge">AI Infrastructure</span><h4 class="tech-card-title">{{ t('news5.title') }}</h4><p class="tech-card-desc">{{ t('news5.desc') }}</p><span class="tech-read">{{ t('home.knowMore') }} →</span></div></RouterLink></article>
          <article class="tech-card"><RouterLink to="/news" class="cn-card-link"><div class="tech-card-img"><img src="/tech_news_mistral.jpg" alt="" /></div><div class="tech-card-body"><span class="tech-badge">AI Startup</span><h4 class="tech-card-title">{{ t('news6.title') }}</h4><p class="tech-card-desc">{{ t('news6.desc') }}</p><span class="tech-read">{{ t('home.knowMore') }} →</span></div></RouterLink></article>
          <article class="tech-card"><RouterLink to="/news" class="cn-card-link"><div class="tech-card-img"><img src="/tech_news_defense.jpg" alt="" /></div><div class="tech-card-body"><span class="tech-badge">Defense Tech</span><h4 class="tech-card-title">{{ t('news7.title') }}</h4><p class="tech-card-desc">{{ t('news7.desc') }}</p><span class="tech-read">{{ t('home.knowMore') }} →</span></div></RouterLink></article>
          <article class="tech-card"><RouterLink to="/news" class="cn-card-link"><div class="tech-card-img"><img src="/about-chart2.png" alt="" /></div><div class="tech-card-body"><span class="tech-badge">Semiconductor</span><h4 class="tech-card-title">{{ t('news8.title') }}</h4><p class="tech-card-desc">{{ t('news8.desc') }}</p><span class="tech-read">{{ t('home.knowMore') }} →</span></div></RouterLink></article>
          <article class="tech-card"><RouterLink to="/news" class="cn-card-link"><div class="tech-card-img"><img src="/scale-geotech.jpg" alt="" /></div><div class="tech-card-body"><span class="tech-badge">GovTech Thailand</span><h4 class="tech-card-title">{{ t('news9.title') }}</h4><p class="tech-card-desc">{{ t('news9.desc') }}</p><span class="tech-read">{{ t('home.knowMore') }} →</span></div></RouterLink></article>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useLocale } from '../../composables/useLocale'

const { t } = useLocale()
const techCarouselRef = ref<HTMLElement | null>(null)

function techScroll(dir: number) {
  if (!techCarouselRef.value) return
  const cardWidth = (techCarouselRef.value.querySelector('.tech-card') as HTMLElement)?.offsetWidth + 20 || 360
  techCarouselRef.value.scrollBy({ left: dir * cardWidth, behavior: 'smooth' })
}
</script>

<style scoped>
.news-section { background: #06080f; padding-top: 120px; position: relative; overflow: hidden; }
.news-section::before { content:''; position:absolute; inset:0; pointer-events:none; background: radial-gradient(ellipse 70% 55% at 85% 25%, rgba(56,189,248,0.07) 0%,transparent 60%), radial-gradient(ellipse 55% 50% at 10% 70%, rgba(49,99,149,0.12) 0%,transparent 55%); z-index:0; }
.news-section .section-inner { position:relative; z-index:1; }
.news-section .eyebrow { color: rgba(255,255,255,0.5); }
.news-section .block-title { color: #fff; }
.news-section .btn-link { color: rgba(255,255,255,0.55); }
.news-section .btn-link:hover { color: #fff; opacity: 1; }
.news-head { display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:2rem; }
.cn-label { font-size:clamp(16px,1.6vw,20px); font-weight:700; color:#fff; margin-bottom:1.25rem; }
.cn-layout { display:grid; grid-template-columns:3fr 2fr; gap:1.5rem; margin-bottom:0; padding-bottom:56px; }
.cn-featured { border-radius:18px; overflow:hidden; position:relative; min-height:460px; }
.cn-card-link { display:flex; flex-direction:column; height:100%; text-decoration:none; cursor:pointer; }
.cn-feat-img { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; transition:transform 0.6s ease; }
.cn-featured:hover .cn-feat-img { transform:scale(1.04); }
.cn-feat-grad { position:absolute; inset:0; background:linear-gradient(to top,rgba(4,8,24,0.93) 0%,rgba(4,8,24,0.45) 50%,rgba(4,8,24,0.1) 100%); }
.cn-feat-body { position:absolute; bottom:0; left:0; right:0; padding:2rem 2rem 1.75rem; }
.cn-badge { display:inline-block; align-self:flex-start; font-size:10px; font-weight:700; letter-spacing:1px; text-transform:uppercase; color:#fff; background:var(--primary); padding:3px 10px; border-radius:50px; margin-bottom:0.7rem; }
.cn-feat-title { font-size:clamp(16px,1.4vw,21px); font-weight:700; color:#fff; line-height:1.45; margin-bottom:0.55rem; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
.cn-feat-desc { font-size:13px; color:rgba(255,255,255,0.6); line-height:1.7; margin-bottom:1rem; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
.cn-read { font-size:12.5px; font-weight:600; color:rgba(255,255,255,0.8); transition:color 0.2s; position:relative; display:inline-block; width:fit-content; }
.cn-read::after { content:''; position:absolute; bottom:-2px; left:0; width:0; height:1px; background:currentColor; transition:width 0.3s cubic-bezier(0.16,1,0.3,1); }
.cn-featured:hover .cn-read,
.cn-card-link:hover .cn-read { color:#fff; }
.cn-card-link:hover .cn-read::after { width:100%; }
.cn-side { display:flex; flex-direction:column; gap:1.5rem; }
.cn-side-card { flex:1; border-radius:14px; overflow:hidden; background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08); transition:transform 0.3s,border-color 0.3s,box-shadow 0.3s; cursor:pointer; }
.cn-side-card:hover { transform:translateY(-3px); border-color:rgba(56,189,248,0.22); box-shadow:0 0 28px rgba(56,189,248,0.06); }
.cn-side-card .cn-card-link { flex-direction:column; }
.cn-side-img { height:148px; overflow:hidden; flex-shrink:0; }
.cn-side-img img { width:100%; height:100%; object-fit:cover; transition:transform 0.45s ease; }
.cn-side-card:hover .cn-side-img img { transform:scale(1.05); }
.cn-side-body { padding:1rem 1.2rem 1.1rem; display:flex; flex-direction:column; flex:1; }
.cn-side-body .cn-badge { background:rgba(56,189,248,0.12); color:var(--accent); }
.cn-side-title { font-size:13.5px; font-weight:600; color:rgba(255,255,255,0.85); line-height:1.5; margin:0.45rem 0 auto; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
.cn-read--sm { font-size:12px; color:rgba(255,255,255,0.62); font-weight:600; margin-top:0.65rem; }
.news-divider { height:1px; margin:0 auto; max-width:1320px; background:linear-gradient(90deg,transparent 0%,rgba(255,255,255,0.07) 20%,rgba(56,189,248,0.18) 50%,rgba(255,255,255,0.07) 80%,transparent 100%); }
.tech-band { position:relative; padding:52px 0 72px; }
.tech-band .section-inner { position:relative; z-index:1; }
.tech-head-right { display:flex; align-items:center; gap:16px; }
.tech-arrows { display:flex; gap:8px; }
.tech-arrow { width:38px; height:38px; border-radius:50%; border:1px solid rgba(255,255,255,0.12); background:rgba(255,255,255,0.05); color:#fff; display:flex; align-items:center; justify-content:center; cursor:pointer; transition:background 0.2s,border-color 0.2s,transform 0.15s; flex-shrink:0; }
.tech-arrow:hover { background:rgba(56,189,248,0.15); border-color:rgba(56,189,248,0.4); transform:scale(1.08); }
.tech-grid { display:flex; gap:1.25rem; overflow-x:scroll; scroll-snap-type:x mandatory; -webkit-overflow-scrolling:touch; padding:4px 0 8px; scrollbar-width:none; }
.tech-grid::-webkit-scrollbar { display:none; }
.tech-card { flex:0 0 calc((100% - 2 * 1.25rem) / 3); scroll-snap-align:start; background:rgba(255,255,255,0.035); border:1px solid rgba(255,255,255,0.07); border-radius:14px; overflow:hidden; transition:border-color 0.3s,transform 0.3s,box-shadow 0.3s; cursor:pointer; }
.tech-card:hover { border-color:rgba(56,189,248,0.25); transform:translateY(-4px); box-shadow:0 0 28px rgba(56,189,248,0.07); }
.tech-card .cn-card-link { flex-direction:column; }
.tech-card-img { height:165px; overflow:hidden; flex-shrink:0; }
.tech-card-img img { width:100%; height:100%; object-fit:cover; transition:transform 0.5s ease; }
.tech-card:hover .tech-card-img img { transform:scale(1.05); }
.tech-card-body { padding:1.1rem 1.2rem 1.25rem; display:flex; flex-direction:column; flex:1; }
.tech-badge { display:inline-block; font-size:9.5px; font-weight:700; letter-spacing:1px; text-transform:uppercase; color:var(--accent); background:rgba(56,189,248,0.10); padding:3px 9px; border-radius:50px; margin-bottom:0.6rem; align-self:flex-start; }
.tech-card-title { font-size:16px; font-weight:600; color:#fff; line-height:1.5; margin-bottom:0.5rem; display:-webkit-box; -webkit-line-clamp:2; line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; flex:1; }
.tech-card-desc { font-size:12.5px; color:rgba(255,255,255,0.65); line-height:1.65; display:-webkit-box; -webkit-line-clamp:2; line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; margin-bottom:0.75rem; }
.tech-read { font-size:12px; font-weight:600; color:var(--accent); position:relative; display:inline-block; width:fit-content; transition:color 0.2s; }
.tech-read::after { content:''; position:absolute; bottom:-2px; left:0; width:0; height:1px; background:currentColor; transition:width 0.3s cubic-bezier(0.16,1,0.3,1); }
.cn-card-link:hover .tech-read::after { width:100%; }

@media (max-width: 900px) {
  .cn-layout { grid-template-columns: 1fr; }
  .cn-featured { min-height: 280px; }
  .news-head { flex-direction: column; align-items: flex-start; gap: 12px; }
  .tech-card { flex: 0 0 78vw; max-width: 300px; }
}
@media (max-width: 600px) {
  .news-section { padding-top: 72px; padding-bottom: 72px; }
}
</style>
