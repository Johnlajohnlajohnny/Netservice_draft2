<template>
  <footer class="site-footer">
    <div class="ft-main">

      <div class="ft-brand">
        <img src="/logo.png" alt="Netservice" class="ft-logo" />
        <p class="ft-tagline">{{ t('footer.tagline') }}</p>
        <div class="ft-divider"></div>
        <p class="ft-follow-label">{{ t('footer.follow') }}</p>
        <div class="ft-socials">
          <a href="#" class="ft-social ft-social--fb" aria-label="Facebook">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
          </a>
          <a href="#" class="ft-social ft-social--tt" aria-label="TikTok">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.34 6.34 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.78a4.85 4.85 0 0 1-1.01-.09z"/></svg>
          </a>
          <a href="#" class="ft-social ft-social--ig" aria-label="Instagram">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>
          </a>
        </div>
      </div>

      <div class="ft-col">
        <p class="ft-col-head">{{ t('footer.quickLink') }}</p>
        <ul class="ft-links">
          <li><RouterLink to="/about">{{ t('nav.about') }}</RouterLink></li>
          <li><RouterLink to="/products">{{ t('nav.products') }}</RouterLink></li>
          <li><RouterLink to="/portfolio">{{ t('nav.portfolio') }}</RouterLink></li>
          <li><RouterLink to="/corporate-governance">{{ t('nav.corporate') }}</RouterLink></li>
          <li><RouterLink to="/partners">{{ t('nav.partners') }}</RouterLink></li>
          <li><RouterLink to="/news">{{ t('nav.news') }}</RouterLink></li>
          <li><RouterLink to="/contact">{{ t('nav.contact') }}</RouterLink></li>
        </ul>
      </div>

      <div class="ft-col">
        <p class="ft-col-head">{{ t('footer.contact') }}</p>
        <div class="ft-contact-block">
          <p class="ft-contact-lbl">{{ t('footer.addrLabel') }}</p>
          <p class="ft-contact-val">{{ t('footer.addr') }}</p>
        </div>
        <div class="ft-contact-block">
          <p class="ft-contact-lbl">{{ t('footer.emailLabel') }}</p>
          <p class="ft-contact-val">{{ t('footer.email') }}</p>
        </div>
        <div class="ft-contact-block">
          <p class="ft-contact-lbl">{{ t('footer.webLabel') }}</p>
          <p class="ft-contact-val">{{ t('footer.web') }}</p>
        </div>
      </div>

      <div class="ft-cta-block">
        <p class="ft-cta-eye">{{ locale === 'th' ? 'พร้อมเริ่มต้นแล้วหรือยัง?' : 'Ready to get started?' }}</p>
        <h3 class="ft-cta-title">{{ locale === 'th' ? 'มาพูดคุยเรื่องโครงการของคุณกัน' : "Let's talk about your project" }}</h3>
        <p class="ft-cta-desc">{{ locale === 'th' ? 'ทีมผู้เชี่ยวชาญของเราพร้อมให้คำปรึกษาและออกแบบโซลูชันที่เหมาะสมกับองค์กรของคุณ' : 'Our specialists are ready to consult and design solutions tailored to your organization.' }}</p>
        <div class="ft-cta-actions">
          <RouterLink to="/contact" class="ft-cta-btn ft-cta-btn--primary">{{ t('nav.contact') }}</RouterLink>
          <RouterLink to="/portfolio" class="ft-cta-btn ft-cta-btn--ghost">{{ locale === 'th' ? 'ดูผลงาน' : 'View Portfolio' }}</RouterLink>
        </div>
      </div>

    </div>

    <div class="ft-bottom">
      <p class="ft-copy">{{ t('footer.copyright') }}</p>
      <div class="ft-bottom-links">
        <RouterLink to="/corporate-governance">{{ t('nav.corporate') }}</RouterLink>
        <RouterLink to="/privacy">{{ t('footer.privacy') }}</RouterLink>
        <RouterLink to="/terms">{{ t('footer.terms') }}</RouterLink>
        <RouterLink to="/pdpa">{{ t('footer.pdpa') }}</RouterLink>
        <RouterLink to="/whistleblower">{{ t('footer.whistle') }}</RouterLink>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { useLocale } from '../composables/useLocale'
const { locale, t } = useLocale()
</script>

<style scoped>
.site-footer {
  background: #060912;
  color: rgba(255,255,255,0.5);
  border-top: 1px solid rgba(255,255,255,0.06);
}
.ft-main {
  max-width: 1380px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1.7fr 1fr 1.4fr 2fr;
  gap: 2.5rem;
  padding: 60px 40px 52px;
  align-items: start;
}
.ft-logo {
  height: 52px;
  width: auto;
  margin-bottom: 1.1rem;
  display: block;
  filter: brightness(0) invert(1) drop-shadow(0 0 4px rgba(255,255,255,0.35)) drop-shadow(0 0 10px rgba(255,255,255,0.12));
  transform: translateY(-4px);
  transition: filter 0.35s ease, transform 0.35s ease;
}
.ft-logo:hover {
  filter: brightness(0) invert(1) drop-shadow(0 0 6px rgba(255,255,255,0.55)) drop-shadow(0 0 16px rgba(255,255,255,0.2));
  transform: translateY(-7px);
}
.ft-tagline { font-size: 12.5px; line-height: 1.75; color: rgba(255,255,255,0.6); margin-bottom: 1.25rem; }
.ft-divider { width: 100%; height: 1px; background: rgba(255,255,255,0.08); margin-bottom: 1.1rem; }
.ft-follow-label { font-size: 11.5px; color: rgba(255,255,255,0.5); margin-bottom: 0.75rem; font-weight: 500; }
.ft-socials { display: flex; gap: 10px; }
.ft-social {
  width: 44px; height: 44px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  transition: transform 0.2s, opacity 0.2s;
}
.ft-social:hover { transform: translateY(-2px); opacity: 0.85; }
.ft-social svg { width: 18px; height: 18px; }
.ft-social--fb { background: #1877f2; color: #fff; }
.ft-social--tt { background: #010101; color: #fff; }
.ft-social--ig {
  background: radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%);
  color: #fff;
}
.ft-col-head {
  font-size: 11px; font-weight: 700; letter-spacing: 2px;
  text-transform: uppercase; color: #fff; margin-bottom: 1.25rem;
}
.ft-links { display: flex; flex-direction: column; gap: 0.65rem; list-style: none; }
.ft-links a { font-size: 13.5px; color: rgba(255,255,255,0.62); transition: color 0.2s; }
.ft-links a:hover { color: #fff; }
.ft-contact-block { margin-bottom: 1rem; }
.ft-contact-lbl { font-size: 11px; font-weight: 600; letter-spacing: 0.5px; color: rgba(255,255,255,0.5); margin-bottom: 3px; text-transform: uppercase; }
.ft-contact-val { font-size: 13px; color: rgba(255,255,255,0.6); line-height: 1.65; }
.ft-cta-block {
  background: linear-gradient(135deg, rgba(49,99,149,0.18) 0%, rgba(49,99,149,0.06) 100%);
  border: 1px solid rgba(49,99,149,0.28);
  border-radius: 14px;
  padding: 28px 26px;
}
.ft-cta-eye { font-size: 10.5px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: rgba(255,255,255,0.5); margin-bottom: 0.55rem; }
.ft-cta-title { font-size: 18px; font-weight: 700; color: #fff; line-height: 1.35; margin-bottom: 0.75rem; }
.ft-cta-desc { font-size: 13px; color: rgba(255,255,255,0.62); line-height: 1.65; margin-bottom: 1.4rem; }
.ft-cta-actions { display: flex; flex-direction: column; gap: 10px; }
.ft-cta-btn {
  display: block; padding: 10px 20px; border-radius: 8px;
  font-size: 12.5px; font-weight: 700; letter-spacing: 0.5px;
  text-align: center; text-transform: uppercase;
  transition: opacity 0.2s, transform 0.2s, border-color 0.2s, color 0.2s;
}
.ft-cta-btn--primary { background: var(--primary); color: #fff; }
.ft-cta-btn--primary:hover { opacity: 0.88; transform: translateY(-1px); }
.ft-cta-btn--ghost { background: transparent; color: rgba(255,255,255,0.65); border: 1px solid rgba(255,255,255,0.18); }
.ft-cta-btn--ghost:hover { color: #fff; border-color: rgba(255,255,255,0.4); transform: translateY(-1px); }
.ft-bottom {
  border-top: 1px solid rgba(255,255,255,0.06);
  max-width: 1380px; margin: 0 auto;
  padding: 16px 40px;
  display: flex; align-items: center; justify-content: space-between; gap: 1rem;
}
.ft-copy { font-size: 12.5px; color: rgba(255,255,255,0.6); }
.ft-bottom-links { display: flex; gap: 1.5rem; }
.ft-bottom-links a { font-size: 12px; color: rgba(255,255,255,0.5); transition: color 0.2s; }
.ft-bottom-links a:hover { color: rgba(255,255,255,0.7); }

@media (max-width: 900px) {
  .ft-main { grid-template-columns: 1fr 1fr; gap: 2rem; padding: 40px 24px; }
  .ft-cta-block { grid-column: 1 / -1; }
  .ft-bottom { padding: 14px 24px; flex-direction: column; align-items: flex-start; gap: 0.5rem; }
}
@media (max-width: 600px) {
  .ft-main { grid-template-columns: 1fr; }
  .ft-bottom-links { flex-wrap: wrap; gap: 0.75rem; }
}
</style>
