import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { onMounted, ref } from 'vue'

gsap.registerPlugin(ScrollTrigger)

const lenisInstance = ref<InstanceType<typeof Lenis> | null>(null)
let initialized = false

export function useLenis() {
  onMounted(() => {
    if (initialized) return
    initialized = true

    const lenis = new Lenis({ lerp: 0.08, smoothWheel: true })
    lenisInstance.value = lenis

    // Sync ScrollTrigger scroll position with Lenis.
    // Also call refresh so pinned sections recalculate after Lenis reports a scroll.
    lenis.on('scroll', () => {
      ScrollTrigger.update()
    })

    // Drive Lenis via GSAP ticker so all animations share one tick
    gsap.ticker.add((time) => lenis.raf(time * 1000))
    gsap.ticker.lagSmoothing(0)
  })

  return { lenis: lenisInstance }
}
