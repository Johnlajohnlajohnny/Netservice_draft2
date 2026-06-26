import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { onMounted, onUnmounted } from 'vue'

export function useScrollReveal() {
  const triggers: ScrollTrigger[] = []

  function observe() {
    // Kill stale triggers from previous page before rescanning
    triggers.forEach(t => t.kill())
    triggers.length = 0

    // Reveal all instantly when user prefers reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.querySelectorAll('[data-reveal]:not(.is-revealed)').forEach(el =>
        el.classList.add('is-revealed')
      )
      ScrollTrigger.refresh()
      return
    }

    document.querySelectorAll('[data-reveal]:not(.is-revealed)').forEach((el) => {
      const st = ScrollTrigger.create({
        trigger: el,
        start: 'top 88%',
        once: true,
        onEnter: () => el.classList.add('is-revealed'),
      })
      triggers.push(st)
    })

    // Refresh ScrollTrigger to recalculate DOM heights/offsets
    ScrollTrigger.refresh()
  }

  onMounted(observe)
  onUnmounted(() => {
    triggers.forEach(t => t.kill())
    triggers.length = 0
  })

  return { observe }
}
