<template>
  <span ref="el" class="count-up-wrapper">
    <span class="count-up-number">{{ displayedValue }}</span><span v-if="suffix" class="count-up-suffix">{{ suffix }}</span>
  </span>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import gsap from 'gsap'

const props = defineProps({
  text: { type: String, required: true },
  duration: { type: Number, default: 1.8 },
  delay: { type: Number, default: 0 },
})

const el = ref<HTMLElement | null>(null)
const currentVal = ref(0)
let tween: gsap.core.Tween | null = null
let observer: IntersectionObserver | null = null

// Parse target number and suffix
// e.g. "6,000+" -> target = 6000, suffix = "+"
// e.g. "10+" -> target = 10, suffix = "+"
const parsed = computed(() => {
  const cleanText = props.text.replace(/,/g, '')
  const numMatch = cleanText.match(/^[\d.]+/)
  if (numMatch) {
    const num = Number(numMatch[0])
    const suffix = cleanText.substring(numMatch[0].length)
    return { num, suffix }
  }
  return { num: 0, suffix: props.text }
})

const suffix = computed(() => parsed.value.suffix)

const displayedValue = computed(() => {
  return Math.round(currentVal.value).toLocaleString()
})

const startAnimation = () => {
  tween = gsap.to(currentVal, {
    value: parsed.value.num,
    duration: props.duration,
    delay: props.delay / 1000, // convert ms to seconds
    ease: 'power2.out',
  })
}

onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    currentVal.value = parsed.value.num
    return
  }

  observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      observer?.disconnect()
      startAnimation()
    }
  }, { threshold: 0.1 })

  if (el.value) {
    observer.observe(el.value)
  }
})

onUnmounted(() => {
  if (tween) tween.kill()
  if (observer) observer.disconnect()
})
</script>

<style scoped>
.count-up-wrapper {
  display: inline-flex;
  align-items: baseline;
  font-variant-numeric: tabular-nums;
}

.count-up-suffix {
  font-size: 0.55em;
  align-self: flex-start;
  margin-top: 0.1em;
  margin-left: 5px;
  background: var(--accent);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>
