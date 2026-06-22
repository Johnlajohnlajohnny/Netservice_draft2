<template>
  <span ref="el" style="font-size: inherit; font-weight: inherit; color: inherit; letter-spacing: inherit;">{{ displayText }}</span>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  text: { type: String, required: true },
  chars: { type: String, default: '0123456789!@#$%' },
  duration: { type: Number, default: 20 },
  delay: { type: Number, default: 0 }, // ms delay before starting
})

const el = ref(null)
const displayText = ref(props.text)
let rafId = null
let observer = null

const scramble = () => {
  const newText = props.text
  let frame = 0
  const queue = []
  for (let i = 0; i < newText.length; i++) {
    const to = newText[i]
    const start = 0
    const end = Math.floor(Math.random() * props.duration) + 8
    queue.push({ from: '', to, start, end, char: '' })
  }
  
  cancelAnimationFrame(rafId)
  
  const update = () => {
    let output = ''
    let complete = 0
    for (let i = 0; i < queue.length; i++) {
      let { from, to, start, end, char } = queue[i]
      if (frame >= end) {
        complete++
        output += to
      } else if (frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = props.chars[Math.floor(Math.random() * props.chars.length)]
          queue[i].char = char
        }
        output += char
      } else {
        output += from
      }
    }
    displayText.value = output
    if (complete !== queue.length) {
      rafId = requestAnimationFrame(update)
      frame++
    }
  }
  update()
}

onMounted(() => {
  const trigger = () => {
    if (props.delay > 0) {
      setTimeout(scramble, props.delay)
    } else {
      scramble()
    }
  }

  observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      observer.disconnect()
      trigger()
    }
  }, { threshold: 0, rootMargin: '0px 0px 50px 0px' })

  if (el.value) {
    // ถ้า element อยู่ใน viewport แล้วตั้งแต่แรก ให้ trigger เลย
    const rect = el.value.getBoundingClientRect()
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      trigger()
    } else {
      observer.observe(el.value)
    }
  }
})

onUnmounted(() => {
  cancelAnimationFrame(rafId)
  observer?.disconnect()
})
</script>
