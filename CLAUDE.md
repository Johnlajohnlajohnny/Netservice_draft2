# Netservice (Thailand) — Corporate Website

Vue 3 + TypeScript + Vite. `npm run dev` to start.

## Stack
- **Vue 3** (Composition API, `<script setup>`)
- **Vue Router 4** — `src/router.ts`
- **GSAP + ScrollTrigger** — animations & scroll effects
- **Lenis** — smooth scroll (`src/composables/useLenis.ts`)
- **Three.js** — 3D elements
- **No CSS framework** — plain scoped CSS per component

## Routes
```
/                    Home.vue
/about               About.vue
/products            Products.vue
/portfolio           Portfolio.vue
/portfolio/:slug     PortfolioDetail.vue
/corporate-governance  CorporateGovernance.vue
/news                News.vue
/contact             Contact.vue
/privacy             Privacy.vue
/partners            Partners.vue
```

## File Structure
```
src/
  views/          — one file per route
  components/
    home/         — HeroSection, ServicesSection, AboutSection, StatsSection,
                    ClientsSection, PortfolioSection, NewsSection, CtaBand
    home/mobile/  — mobile variants of home sections
    about/        — CompanyProfile, VisionSection, StrategiesSection,
                    CertificationsSection, StatsStrip, AboutClients
    products/     — EdocSection, WhoWeAre
    portfolio/    — PortfolioGrid, PortfolioLoader, PortfolioCinematic
    partners/     — PartnersSection, CorporatePartners, AllianceNetwork
    contact/      — ContactSection, ContactInfo, ContactForm
    governance/   — ComplianceListing
    news/         — CompanyNews, TechNews
    privacy/      — PrivacySection, PrivacyPolicyList
    SiteHeader.vue, SiteFooter.vue, FloatingContact.vue,
    PageBanner.vue, CountUp.vue, ScrambleText.vue
  composables/
    useLocale.ts       — EN/TH i18n
    useScrollReveal.ts — data-reveal → is-revealed
    useLenis.ts
    useDevice.ts
  data/portfolioData.ts
  router.ts
  main.ts
public/            — static assets (png, jpg, svg)
```

## Key Patterns

### i18n
All text goes through `useLocale`. Add keys to BOTH `en` and `th` blocks in `src/composables/useLocale.ts`.
```ts
const { t } = useLocale()
// template: {{ t('key') }}
```

### Scroll Reveal
Add `data-reveal` attribute to any element — it gets `.is-revealed` when scrolled into view (88% viewport).
```html
<div data-reveal>content</div>
```
CSS must handle the `is-revealed` transition (opacity/transform).

### GSAP / ScrollTrigger
- Register plugins in the component, NOT globally (except ScrollTrigger in router.ts)
- **CRITICAL:** router.beforeEach kills ALL ScrollTrigger instances before route change. This is intentional — Portfolio uses `pin:true` which creates `.gsap-pin-spacer` outside Vue's tree. Don't fight this.
- Always kill triggers in `onUnmounted`

### Page Transition
App.vue handles route transitions with a curtain overlay + GSAP fade. Portfolio destination uses black curtain (`#000000`), others use `#060912`.

### Global SVG Filter
`#container-glass` — liquid glass distortion filter defined once in App.vue. Reference via `filter: url(#container-glass)` in CSS.

## Gotchas
- `ScrollTrigger.refresh()` must be called after DOM changes (useScrollReveal does this automatically)
- Lenis `.stop()` on leave, `.start()` on enter (handled in App.vue onPageLeave/onPageEnter)
- Mobile breakpoint: `@media (max-width: 900px)` — home sections have separate mobile components
- Side portal (fixed bottom-left links) hidden on mobile
- Portfolio data lives in `src/data/portfolioData.ts`
- Assets served from `public/` — reference as `/filename.png` (no `src/assets`)
