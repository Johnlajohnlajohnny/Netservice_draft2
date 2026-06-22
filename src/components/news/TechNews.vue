<template>
  <section class="news-section news-section--tech">
    <div class="news-inner">
      <div class="section-heading" data-reveal>
        <h2 class="section-title">{{ t('news.sectionTech') }}</h2>
        <p class="section-sub">{{ t('news.sectionTechSub') }}</p>
      </div>

      <div class="news-grid" ref="trackRef" @scroll.passive="onScroll">

        <article class="news-card" data-reveal data-delay="1">
          <div class="news-thumb-wrap">
            <img src="/tech_news_google.jpg" alt="Google Blackstone AI Joint Venture" class="news-img" />
            <div class="news-badge news-badge--tech">AI Infrastructure</div>
          </div>
          <div class="news-body">
            <div class="news-meta">
              <span class="news-date">May 19, 2026</span>
              <span class="meta-dot"></span>
              <span class="news-author">Tech Startups</span>
            </div>
            <h3 class="news-card-title">{{ t('news5.title') }}</h3>
            <p class="news-card-desc">{{ t('news5.desc') }}</p>
            <div class="news-footer">
              <a href="https://techstartups.com/2026/05/19/top-tech-news-today-may-19-2026/" target="_blank" rel="noopener" class="read-more-btn read-more-btn--tech">
                {{ t('news.readMore') }}
                <svg class="arrow-icon" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"></path></svg>
              </a>
            </div>
          </div>
        </article>

        <article class="news-card" data-reveal data-delay="2">
          <div class="news-thumb-wrap">
            <img src="/tech_news_mistral.jpg" alt="Mistral AI acquires Emmi AI" class="news-img" />
            <div class="news-badge news-badge--tech">AI Startup</div>
          </div>
          <div class="news-body">
            <div class="news-meta">
              <span class="news-date">May 19, 2026</span>
              <span class="meta-dot"></span>
              <span class="news-author">Tech Startups</span>
            </div>
            <h3 class="news-card-title">{{ t('news6.title') }}</h3>
            <p class="news-card-desc">{{ t('news6.desc') }}</p>
            <div class="news-footer">
              <a href="https://techstartups.com/2026/05/19/top-tech-news-today-may-19-2026/" target="_blank" rel="noopener" class="read-more-btn read-more-btn--tech">
                {{ t('news.readMore') }}
                <svg class="arrow-icon" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"></path></svg>
              </a>
            </div>
          </div>
        </article>

        <article class="news-card" data-reveal data-delay="3">
          <div class="news-thumb-wrap">
            <img src="/tech_news_defense.jpg" alt="Anduril defense AI funding" class="news-img" />
            <div class="news-badge news-badge--tech">Defense Tech</div>
          </div>
          <div class="news-body">
            <div class="news-meta">
              <span class="news-date">May 14, 2026</span>
              <span class="meta-dot"></span>
              <span class="news-author">Coaio</span>
            </div>
            <h3 class="news-card-title">{{ t('news7.title') }}</h3>
            <p class="news-card-desc">{{ t('news7.desc') }}</p>
            <div class="news-footer">
              <a href="https://coaio.com/news/2026/05/breaking-tech-news-on-may-14-2026-ai-revolution-security-threats-and-2q0c/" target="_blank" rel="noopener" class="read-more-btn read-more-btn--tech">
                {{ t('news.readMore') }}
                <svg class="arrow-icon" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"></path></svg>
              </a>
            </div>
          </div>
        </article>

        <article class="news-card" data-reveal data-delay="1">
          <div class="news-thumb-wrap">
            <img src="/tech_news_tsmc.png" alt="TSMC Japan second fab" class="news-img" />
            <div class="news-badge news-badge--tech">Semiconductor</div>
          </div>
          <div class="news-body">
            <div class="news-meta">
              <span class="news-date">May 12, 2026</span>
              <span class="meta-dot"></span>
              <span class="news-author">Reuters</span>
            </div>
            <h3 class="news-card-title">{{ t('news8.title') }}</h3>
            <p class="news-card-desc">{{ t('news8.desc') }}</p>
            <div class="news-footer">
              <a href="https://techstartups.com/2026/05/19/top-tech-news-today-may-19-2026/" target="_blank" rel="noopener" class="read-more-btn read-more-btn--tech">
                {{ t('news.readMore') }}
                <svg class="arrow-icon" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"></path></svg>
              </a>
            </div>
          </div>
        </article>

        <article class="news-card" data-reveal data-delay="2">
          <div class="news-thumb-wrap">
            <img src="/scale-geotech.jpg" alt="Thailand cloud-first digital government" class="news-img" />
            <div class="news-badge news-badge--tech">GovTech Thailand</div>
          </div>
          <div class="news-body">
            <div class="news-meta">
              <span class="news-date">May 8, 2026</span>
              <span class="meta-dot"></span>
              <span class="news-author">Bangkok Post</span>
            </div>
            <h3 class="news-card-title">{{ t('news9.title') }}</h3>
            <p class="news-card-desc">{{ t('news9.desc') }}</p>
            <div class="news-footer">
              <a href="https://techstartups.com/2026/05/19/top-tech-news-today-may-19-2026/" target="_blank" rel="noopener" class="read-more-btn read-more-btn--tech">
                {{ t('news.readMore') }}
                <svg class="arrow-icon" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"></path></svg>
              </a>
            </div>
          </div>
        </article>

      </div>

      <!-- Dot indicators (mobile only) -->
      <div class="news-dots">
        <span
          v-for="(_, i) in 5" :key="i"
          class="news-dot"
          :class="{ active: activeIndex === i }"
          @click="scrollToCard(i)"
        ></span>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useLocale } from '../../composables/useLocale'
const { t } = useLocale()

const trackRef    = ref<HTMLElement | null>(null)
const activeIndex = ref(0)

function onScroll() {
  const el = trackRef.value
  if (!el) return
  const card = el.firstElementChild as HTMLElement | null
  const cardW = card ? card.offsetWidth + 16 : el.offsetWidth
  activeIndex.value = Math.round(el.scrollLeft / cardW)
}

function scrollToCard(i: number) {
  const el = trackRef.value
  if (!el) return
  const card = el.firstElementChild as HTMLElement | null
  const cardW = card ? card.offsetWidth + 16 : el.offsetWidth
  el.scrollTo({ left: cardW * i, behavior: 'smooth' })
}
</script>

<style scoped>
.news-section {
  padding: 80px 0 100px;
  background: #f4f6fb;
}
.news-section--tech {
  padding-top: 80px;
  background: #f4f6fb;
}
.news-inner {
  max-width: 1380px;
  margin: 0 auto;
  padding: 0 40px;
}

.section-heading {
  margin-bottom: 40px;
}
.section-title {
  font-size: clamp(24px, 3.2vw, 36px);
  font-weight: 800;
  color: var(--text-dark);
  line-height: 1.2;
  margin-bottom: 8px;
}
.section-sub {
  font-size: 14.5px;
  color: #666;
  line-height: 1.6;
}

/* 3-col first row, 2-col second row centred */
.news-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

/* Last two cards span centred when they sit alone in a row */
.news-card:nth-child(4) {
  grid-column: 1;
}
.news-card:nth-child(5) {
  grid-column: 2;
}

/* Cards */
.news-card {
  background: #ffffff;
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid rgba(0,0,0,0.03);
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1),
              box-shadow  0.35s cubic-bezier(0.16, 1, 0.3, 1),
              border-color 0.35s;
  display: flex;
  flex-direction: column;
  position: relative;
  cursor: pointer;
}
.news-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 16px 40px rgba(49,99,149,0.08);
  border-color: rgba(49,99,149,0.15);
}

.news-thumb-wrap {
  position: relative;
  height: 200px;
  overflow: hidden;
  background: #eaeef6;
  flex-shrink: 0;
}
.news-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.5s ease;
}
.news-card:hover .news-img { transform: scale(1.05); }

.news-badge {
  position: absolute;
  top: 14px;
  left: 14px;
  z-index: 2;
  background: var(--primary);
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  padding: 4px 10px;
  border-radius: 50px;
  box-shadow: 0 2px 8px rgba(49,99,149,0.3);
}
.news-badge--tech {
  background: #0e7c52;
  box-shadow: 0 2px 8px rgba(14,124,82,0.3);
}

.news-body {
  padding: 24px 24px 20px;
  display: flex;
  flex-direction: column;
  flex: 1;
}
.news-meta {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 10px;
}
.news-date,
.news-author {
  font-size: 11px;
  color: #666;
  font-weight: 600;
}
.meta-dot {
  width: 3px;
  height: 3px;
  background: rgba(0,0,0,0.15);
  border-radius: 50%;
}
.news-card-title {
  font-size: 15px;
  font-weight: 700;
  color: var(--text-dark);
  line-height: 1.5;
  margin-bottom: 10px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.news-card-desc {
  font-size: 13px;
  color: #666;
  line-height: 1.7;
  margin-bottom: 0;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.news-footer {
  border-top: 1px solid rgba(0,0,0,0.06);
  padding-top: 16px;
  margin-top: auto;
}
.read-more-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 12.5px;
  font-weight: 700;
  color: var(--primary);
  letter-spacing: 0.3px;
  transition: gap 0.25s, color 0.2s;
  text-decoration: none;
}
.read-more-btn:hover { gap: 8px; }
.read-more-btn--tech { color: #0e7c52; }
.read-more-btn--tech:hover { color: #0b6140; }

/* stretched link */
.news-card .read-more-btn::after {
  content: '';
  position: absolute;
  inset: 0;
}
.arrow-icon { width: 13px; height: 13px; }

.news-dots {
  display: none;
  justify-content: center;
  align-items: center;
  gap: 7px;
  padding: 4px 0 8px;
}
.news-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgba(14,124,82,0.2);
  cursor: pointer;
  transition: background 0.25s, width 0.25s, border-radius 0.25s;
}
.news-dot.active {
  background: #0e7c52;
  width: 18px;
  border-radius: 3px;
}

@media (max-width: 640px) {
  .news-dots { display: flex; }
}

@media (max-width: 1024px) {
  .news-grid { grid-template-columns: repeat(2, 1fr); }
  .news-card:nth-child(4),
  .news-card:nth-child(5) { grid-column: auto; }
}
@media (max-width: 640px) {
  .news-inner { padding: 0 20px; }
  .section-heading { margin-bottom: 24px; }

  .news-grid {
    display: flex;
    gap: 16px;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scroll-padding-left: 20px;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    /* reset grid positioning */
    grid-template-columns: unset;
    /* bleed past news-inner padding */
    margin-left: -20px;
    margin-right: -20px;
    padding: 4px 16px 24px 20px;
  }
  .news-grid::-webkit-scrollbar { display: none; }

  .news-card {
    flex: 0 0 82vw;
    max-width: 320px;
    scroll-snap-align: start;
    opacity: 1 !important;
    transform: none !important;
  }

  /* reset nth-child grid-column overrides */
  .news-card:nth-child(4),
  .news-card:nth-child(5) { grid-column: auto; }
}
</style>
