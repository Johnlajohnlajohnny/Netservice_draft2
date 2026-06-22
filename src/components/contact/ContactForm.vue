<template>
  <div class="contact-form-wrap" data-reveal data-delay="2">
    <form class="contact-form" @submit.prevent="sendMessage">
      <h2>{{ t('contact.getInTouch') }}</h2>
      <div class="form-underline"></div>

      <div class="form-row">
        <div class="form-group">
          <label for="cf-name">{{ t('contact.name') }}</label>
          <input
            id="cf-name"
            name="name"
            v-model="form.name"
            type="text"
            :placeholder="t('contact.name')"
            :class="{ 'has-error': errors.name }"
            @input="errors.name = ''"
          />
          <span v-if="errors.name" class="field-error">{{ errors.name }}</span>
        </div>
        <div class="form-group">
          <label for="cf-email">{{ t('contact.email') }}</label>
          <input
            id="cf-email"
            name="email"
            v-model="form.email"
            type="email"
            :placeholder="t('contact.email')"
            :class="{ 'has-error': errors.email }"
            @input="errors.email = ''"
          />
          <span v-if="errors.email" class="field-error">{{ errors.email }}</span>
        </div>
      </div>

      <div class="form-group">
        <label for="cf-subject">{{ t('contact.subject') }}</label>
        <input id="cf-subject" name="subject" v-model="form.subject" type="text" :placeholder="t('contact.subject')" />
      </div>

      <div class="form-group">
        <label for="cf-message">{{ t('contact.message') }}</label>
        <textarea
          id="cf-message"
          name="message"
          v-model="form.message"
          rows="5"
          :placeholder="t('contact.message')"
          :class="{ 'has-error': errors.message }"
          @input="errors.message = ''"
        ></textarea>
        <span v-if="errors.message" class="field-error">{{ errors.message }}</span>
      </div>

      <div class="form-actions">
        <button type="submit" class="btn btn-submit" :disabled="sending">
          <span v-if="sending" class="spinner"></span>
          <span v-else>{{ t('contact.send') }}</span>
          <svg v-if="!sending" class="send-icon" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"></path></svg>
        </button>
      </div>

      <div aria-live="polite" aria-atomic="true" class="form-announce">
        <transition name="fade-in">
          <p v-if="sent" class="sent-msg">{{ t('contact.sent') }}</p>
        </transition>
        <transition name="fade-in">
          <p v-if="error" class="error-msg">{{ locale === 'th' ? 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง' : 'Something went wrong. Please try again.' }}</p>
        </transition>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useLocale } from '../../composables/useLocale'

// ─── EmailJS Config ────────────────────────────────────────────────────────
// 1. สมัคร https://www.emailjs.com (free tier ส่งได้ 200 email/เดือน)
// 2. สร้าง Email Service → คัดลอก Service ID ใส่ EMAILJS_SERVICE_ID
// 3. สร้าง Email Template → คัดลอก Template ID ใส่ EMAILJS_TEMPLATE_ID
//    Template variables ที่ใช้: {{from_name}}, {{from_email}}, {{subject}}, {{message}}
// 4. Account > API Keys → คัดลอก Public Key ใส่ EMAILJS_PUBLIC_KEY
const EMAILJS_SERVICE_ID  = 'YOUR_SERVICE_ID'
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID'
const EMAILJS_PUBLIC_KEY  = 'YOUR_PUBLIC_KEY'
// ──────────────────────────────────────────────────────────────────────────

const { t, locale } = useLocale()
const form    = ref({ name: '', email: '', subject: '', message: '' })
const sending = ref(false)
const sent    = ref(false)
const error   = ref(false)
const errors  = ref({ name: '', email: '', message: '' })

function validate(): boolean {
  errors.value = { name: '', email: '', message: '' }
  let ok = true
  if (!form.value.name.trim()) {
    errors.value.name = locale.value === 'th' ? 'กรุณากรอกชื่อ' : 'Name is required'
    ok = false
  }
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!form.value.email.trim()) {
    errors.value.email = locale.value === 'th' ? 'กรุณากรอกอีเมล' : 'Email is required'
    ok = false
  } else if (!emailRe.test(form.value.email)) {
    errors.value.email = locale.value === 'th' ? 'รูปแบบอีเมลไม่ถูกต้อง' : 'Please enter a valid email'
    ok = false
  }
  if (!form.value.message.trim()) {
    errors.value.message = locale.value === 'th' ? 'กรุณากรอกข้อความ' : 'Message is required'
    ok = false
  }
  return ok
}

async function sendMessage() {
  if (sending.value) return
  if (!validate()) return
  sending.value = true
  error.value   = false

  try {
    const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service_id:      EMAILJS_SERVICE_ID,
        template_id:     EMAILJS_TEMPLATE_ID,
        user_id:         EMAILJS_PUBLIC_KEY,
        template_params: {
          from_name:  form.value.name,
          from_email: form.value.email,
          subject:    form.value.subject || (locale.value === 'th' ? 'ติดต่อจากเว็บไซต์' : 'Contact from website'),
          message:    form.value.message,
        },
      }),
    })
    if (!res.ok) throw new Error('send failed')
    sent.value  = true
    form.value  = { name: '', email: '', subject: '', message: '' }
    setTimeout(() => { sent.value = false }, 6000)
  } catch {
    error.value = true
    setTimeout(() => { error.value = false }, 6000)
  } finally {
    sending.value = false
  }
}
</script>

<style scoped>
.contact-form-wrap {
  background: #ffffff;
  border-radius: 24px;
  padding: 56px;
  box-shadow: 0 16px 48px rgba(0,0,0,0.04);
  border: 1px solid rgba(0,0,0,0.04);
}
.contact-form h2 {
  font-size: 28px;
  font-weight: 800;
  color: var(--text-dark);
  margin-bottom: 8px;
}
.form-underline {
  width: 48px;
  height: 3px;
  background: var(--primary);
  margin-bottom: 36px;
}
.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}
.form-group {
  margin-bottom: 24px;
  display: flex;
  flex-direction: column;
}
.form-group label {
  font-family: 'Kanit', sans-serif;
  font-size: 12.5px;
  font-weight: 700;
  color: #666;
  margin-bottom: 8px;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}
.form-group input,
.form-group textarea {
  width: 100%;
  padding: 12px 16px;
  border: 1.5px solid #e2e8f0;
  border-radius: 8px;
  font-family: 'Kanit', sans-serif;
  font-size: 14.5px;
  color: var(--text-dark);
  background: #ffffff;
  transition: border-color 0.25s, box-shadow 0.25s;
}
.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(49,99,149,0.12);
}
.form-group textarea {
  resize: vertical;
}
.form-group input.has-error,
.form-group textarea.has-error {
  border-color: #c0392b;
  box-shadow: 0 0 0 3px rgba(192,57,43,0.12);
}
.field-error {
  display: block;
  margin-top: 5px;
  font-size: 11.5px;
  font-weight: 600;
  color: #c0392b;
  letter-spacing: 0.2px;
}

.form-actions {
  margin-top: 12px;
}
.btn-submit {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: var(--primary);
  color: #ffffff;
  font-weight: 700;
  padding: 12px 32px;
  border-radius: 8px;
  transition: opacity 0.25s, gap 0.25s;
  border: none;
  cursor: pointer;
  min-width: 140px;
  justify-content: center;
}
.btn-submit:hover:not(:disabled) {
  opacity: 0.9;
  gap: 12px;
}
.btn-submit:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}
.send-icon {
  width: 14px;
  height: 14px;
}
.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255,255,255,0.35);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  flex-shrink: 0;
}
@keyframes spin { to { transform: rotate(360deg); } }

.form-announce { min-height: 1.5em; }

.sent-msg {
  font-family: 'Kanit', sans-serif;
  margin-top: 20px;
  color: var(--primary);
  font-size: 14.5px;
  font-weight: 600;
}
.error-msg {
  font-family: 'Kanit', sans-serif;
  margin-top: 20px;
  color: #c0392b;
  font-size: 14.5px;
  font-weight: 600;
}

/* Transitions */
.fade-in-enter-active,
.fade-in-leave-active {
  transition: opacity 0.3s;
}
.fade-in-enter-from,
.fade-in-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .contact-form-wrap {
    padding: 32px 24px;
  }
}

@media (max-width: 600px) {
  .form-row {
    grid-template-columns: 1fr;
    gap: 0;
  }
}
</style>
