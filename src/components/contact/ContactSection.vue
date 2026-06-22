<template>
  <section class="page-section">
    <div class="page-inner">
      <div class="contact-grid">
        
        <!-- Left Column: Contact Cards -->
        <ContactInfo />

        <!-- Right Column: Premium Form -->
        <ContactForm />

      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import ContactInfo from './ContactInfo.vue'
import ContactForm from './ContactForm.vue'
</script>

<style scoped>
.page-section {
  padding: 100px 0;
  background: #ffffff;
}
.page-inner {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
}

/* ─────────────────────────────────────────
   CONTACT GRID
───────────────────────────────────────── */
.contact-grid {
  display: grid;
  grid-template-columns: 0.8fr 1.2fr;
  gap: 60px;
  align-items: start;
}

/* ─────────────────────────────────────────
   RESPONSIVE
───────────────────────────────────────── */
@media (max-width: 1024px) {
  .contact-grid {
    grid-template-columns: 1fr;
    gap: 40px;
  }
}

@media (max-width: 768px) {
  .page-section {
    padding: 72px 0;
  }
}
</style>
