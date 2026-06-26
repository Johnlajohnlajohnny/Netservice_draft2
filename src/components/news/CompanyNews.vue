<template>
  <section class="news-section">
    <div class="news-inner">
      <div class="section-heading" data-reveal>
        <div class="section-heading-left">
          <span class="section-pill">Netservice</span>
          <h2 class="section-title">{{ t('news.sectionCompany') }}</h2>
          <p class="section-sub">{{ t('news.sectionCompanySub') }}</p>
        </div>
        <div class="section-rule"></div>
      </div>

      <div class="news-grid" ref="trackRef" @scroll.passive="onScroll">
        <article class="news-card" data-reveal data-delay="1">
          <div class="news-thumb-wrap">
            <img src="/news1.webp" alt="ISO Certification" class="news-img" />
            <div class="news-badge">ISO Standard</div>
          </div>
          <div class="news-body">
            <div class="news-meta">
              <span class="news-date">April 2026</span>
              <span class="meta-dot"></span>
              <span class="news-author">Netservice</span>
            </div>
            <h3 class="news-card-title">{{ t('news1.title') }}</h3>
            <p class="news-card-desc">{{ t('news1.desc') }}</p>
            <div class="news-footer">
              <RouterLink to="/contact" class="read-more-btn" :aria-label="t('nav.contact')">
                {{ t('nav.contact') }}
                <svg class="arrow-icon" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"></path></svg>
              </RouterLink>
            </div>
          </div>
        </article>

        <article class="news-card" data-reveal data-delay="2">
          <div class="news-thumb-wrap">
            <img src="/news2.webp" alt="Ting to Trash Project" class="news-img" />
            <div class="news-badge">CSR Initiative</div>
          </div>
          <div class="news-body">
            <div class="news-meta">
              <span class="news-date">March 2026</span>
              <span class="meta-dot"></span>
              <span class="news-author">Netservice</span>
            </div>
            <h3 class="news-card-title">{{ t('news2.title') }}</h3>
            <p class="news-card-desc">{{ t('news2.desc') }}</p>
            <div class="news-footer">
              <RouterLink to="/contact" class="read-more-btn" :aria-label="t('nav.contact')">
                {{ t('nav.contact') }}
                <svg class="arrow-icon" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"></path></svg>
              </RouterLink>
            </div>
          </div>
        </article>

        <article class="news-card" data-reveal data-delay="3">
          <div class="news-thumb-wrap">
            <img src="/news1.webp" alt="CMMI Level 3" class="news-img" />
            <div class="news-badge">CMMI Level 3</div>
          </div>
          <div class="news-body">
            <div class="news-meta">
              <span class="news-date">February 2026</span>
              <span class="meta-dot"></span>
              <span class="news-author">Netservice</span>
            </div>
            <h3 class="news-card-title">{{ t('news3.title') }}</h3>
            <p class="news-card-desc">{{ t('news3.desc') }}</p>
            <div class="news-footer">
              <RouterLink to="/contact" class="read-more-btn" :aria-label="t('nav.contact')">
                {{ t('nav.contact') }}
                <svg class="arrow-icon" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"></path></svg>
              </RouterLink>
            </div>
          </div>
        </article>

        <article class="news-card" data-reveal data-delay="4">
          <div class="news-thumb-wrap">
            <img src="/port_sso.webp" alt="e-Saraban platform" class="news-img" />
            <div class="news-badge">New Project</div>
          </div>
          <div class="news-body">
            <div class="news-meta">
              <span class="news-date">January 2026</span>
              <span class="meta-dot"></span>
              <span class="news-author">Netservice</span>
            </div>
            <h3 class="news-card-title">{{ t('news4.title') }}</h3>
            <p class="news-card-desc">{{ t('news4.desc') }}</p>
            <div class="news-footer">
              <RouterLink to="/contact" class="read-more-btn" :aria-label="t('nav.contact')">
                {{ t('nav.contact') }}
                <svg class="arrow-icon" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"></path></svg>
              </RouterLink>
            </div>
          </div>
        </article>
      </div>

      <!-- Dot indicators (mobile only) -->
      <div class="news-dots">
        <span
          v-for="(_, i) in 4" :key="i"
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
  padding: 100px 0;
  background: #ffffff;
}
.news-inner {
  max-width: 1380px;
  margin: 0 auto;
  padding: 0 40px;
}

/* ── Section heading ── */
.section-heading {
  margin-bottom: 36px;
}
.section-heading-left { flex-shrink: 0; }
.section-pill { display: none; }
.section-title {
  font-size: clamp(24px, 3.2vw, 36px);
  font-weight: 800;
  color: var(--text-dark);
  line-height: 1.2;
  margin-bottom: 0;
}
.section-sub { display: none; }
.section-rule { display: none; }

/* ── 4-col grid ── */
.news-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

/* ── Cards ── */
.news-card {
  background: #f4f6fb;
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid rgba(0,0,0,0.03);
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1),
              box-shadow  0.35s cubic-bezier(0.16, 1, 0.3, 1),
              border-color 0.35s,
              background-color 0.3s;
  display: flex;
  flex-direction: column;
  position: relative;
  cursor: pointer;
}
.news-card:hover {
  transform: translateY(-5px);
  background: #ffffff;
  box-shadow: 0 16px 40px rgba(49,99,149,0.08);
  border-color: rgba(49,99,149,0.15);
}

.news-thumb-wrap {
  position: relative;
  height: 180px;
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
  font-size: 16px;
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
  font-size: 13.5px;
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
.read-more-btn:hover { gap: 8px; color: var(--accent); }

/* Removed stretched-link: entire card should NOT navigate to /contact.
   Only the explicit Read More button is the clickable CTA. */
.arrow-icon { width: 13px; height: 13px; }

@media (max-width: 1100px) {
  .news-grid { grid-template-columns: repeat(2, 1fr); }
}
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
  background: rgba(49,99,149,0.2);
  cursor: pointer;
  transition: background 0.25s, width 0.25s, border-radius 0.25s;
}
.news-dot.active {
  background: var(--primary);
  width: 18px;
  border-radius: 3px;
}

@media (max-width: 640px) {
  .news-dots { display: flex; }
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
    /* disable reveal transform so hidden cards don't stay invisible */
    opacity: 1 !important;
    transform: none !important;
  }
}
</style>
