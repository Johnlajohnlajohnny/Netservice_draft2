import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { locale } from './composables/useLocale'
import Home from './views/Home.vue'
import About from './views/About.vue'
import Products from './views/Products.vue'
import Portfolio from './views/Portfolio.vue'
import CorporateGovernance from './views/CorporateGovernance.vue'
import News from './views/News.vue'
import Contact from './views/Contact.vue'
import Privacy from './views/Privacy.vue'
import Partners from './views/Partners.vue'
import PortfolioDetail from './views/PortfolioDetail.vue'
import NotFound from './views/NotFound.vue'

gsap.registerPlugin(ScrollTrigger)

const titles: Record<string, { en: string; th: string }> = {
  '/':                      { en: 'Netservice Thailand — Enterprise IT Solutions', th: 'เน็ตเซอร์วิส (ประเทศไทย) — โซลูชั่นไอทีระดับองค์กร' },
  '/about':                 { en: 'About Us | Netservice Thailand', th: 'เกี่ยวกับเรา | เน็ตเซอร์วิส (ประเทศไทย)' },
  '/products':              { en: 'Products & Services | Netservice Thailand', th: 'ผลิตภัณฑ์และบริการ | เน็ตเซอร์วิส (ประเทศไทย)' },
  '/portfolio':             { en: 'Portfolio | Netservice Thailand', th: 'ผลงาน | เน็ตเซอร์วิส (ประเทศไทย)' },
  '/corporate-governance':  { en: 'Corporate Governance | Netservice Thailand', th: 'การกำกับดูแลกิจการ | เน็ตเซอร์วิส (ประเทศไทย)' },
  '/news':                  { en: 'News & Activities | Netservice Thailand', th: 'ข่าวสารและกิจกรรม | เน็ตเซอร์วิส (ประเทศไทย)' },
  '/contact':               { en: 'Contact Us | Netservice Thailand', th: 'ติดต่อเรา | เน็ตเซอร์วิส (ประเทศไทย)' },
  '/privacy':               { en: 'Privacy Policy | Netservice Thailand', th: 'นโยบายความเป็นส่วนตัว | เน็ตเซอร์วิส (ประเทศไทย)' },
  '/partners':              { en: 'Partners | Netservice Thailand', th: 'พันธมิตร | เน็ตเซอร์วิส (ประเทศไทย)' },
  '/terms':                 { en: 'Terms of Service | Netservice Thailand', th: 'ข้อกำหนดการใช้งาน | เน็ตเซอร์วิส (ประเทศไทย)' },
  '/pdpa':                  { en: 'PDPA Policy | Netservice Thailand', th: 'นโยบาย PDPA | เน็ตเซอร์วิส (ประเทศไทย)' },
  '/whistleblower':         { en: 'Whistleblowing | Netservice Thailand', th: 'แจ้งเบาะแสทุจริต | เน็ตเซอร์วิส (ประเทศไทย)' },
}

const routes: RouteRecordRaw[] = [
  { path: '/', component: Home },
  { path: '/about', component: About },
  { path: '/products', component: Products },
  { path: '/portfolio', component: Portfolio },
  { path: '/portfolio/:slug', component: PortfolioDetail },
  { path: '/corporate-governance', component: CorporateGovernance },
  { path: '/news', component: News },
  { path: '/contact', component: Contact },
  { path: '/privacy', component: Privacy },
  { path: '/partners', component: Partners },
  { path: '/terms', component: NotFound, meta: { mode: 'soon', label: { en: 'Terms of Service', th: 'ข้อกำหนดการใช้งาน' } } },
  { path: '/pdpa', component: NotFound, meta: { mode: 'soon', label: { en: 'PDPA Policy', th: 'นโยบาย PDPA' } } },
  { path: '/whistleblower', component: NotFound, meta: { mode: 'soon', label: { en: 'Whistleblowing', th: 'แจ้งเบาะแสทุจริต' } } },
  { path: '/:pathMatch(.*)*', component: NotFound },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return false
  },
})

// ─── Kill all GSAP ScrollTrigger instances BEFORE every route change ──────────
// Portfolio uses pin:true which wraps the trigger element inside a
// .gsap-pin-spacer div that lives OUTSIDE Vue's component tree.
// If we wait until onUnmounted (after Vue removes the element) GSAP can no
// longer locate the spacer and it is left orphaned — breaking every
// subsequent page's layout.
// beforeEach fires while all current-page elements are still in the DOM,
// so GSAP can cleanly remove the pin spacer here.
router.beforeEach(() => {
  ScrollTrigger.getAll().forEach(st => st.kill())
})

// ─── Dynamic page titles (EN/TH) ─────────────────────────────────────────────
router.afterEach((to) => {
  const entry = titles[to.path]
  if (entry) document.title = locale.value === 'th' ? entry.th : entry.en
})

export default router
