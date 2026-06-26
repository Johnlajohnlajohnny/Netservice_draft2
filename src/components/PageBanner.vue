<template>
  <div class="page-banner" ref="bannerRef">
    <canvas ref="canvasRef" class="banner-canvas" aria-hidden="true"></canvas>
    <div class="banner-beam-overlay" aria-hidden="true"></div>

    <div class="banner-content">
      <p class="banner-eyebrow">
        <span class="eyebrow-line"></span>
        {{ eyebrow }}
        <span class="eyebrow-line"></span>
      </p>
      <h1 class="banner-title">{{ title }}</h1>
      <p v-if="subtitle" class="banner-sub">{{ subtitle }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

defineProps<{
  eyebrow: string
  title: string
  subtitle?: string
}>()

const canvasRef = ref<HTMLCanvasElement | null>(null)
const bannerRef = ref<HTMLElement | null>(null)

interface Beam {
  x: number; y: number; width: number; length: number
  angle: number; speed: number; opacity: number
  hue: number; pulse: number; pulseSpeed: number
}

let beams: Beam[] = []
let rafId = 0
const BEAM_COUNT = 20

function createBeam(w: number, h: number): Beam {
  return {
    x: Math.random() * w * 1.5 - w * 0.25,
    y: Math.random() * h * 1.5 - h * 0.25,
    width: 30 + Math.random() * 60,
    length: h * 2.5,
    angle: -35 + Math.random() * 10,
    speed: 0.6 + Math.random() * 1.2,
    opacity: 0.12 + Math.random() * 0.16,
    hue: 190 + Math.random() * 50,
    pulse: Math.random() * Math.PI * 2,
    pulseSpeed: 0.02 + Math.random() * 0.03,
  }
}

function resetBeam(beam: Beam, index: number, w: number, h: number) {
  const spacing = w / 3
  const col = index % 3
  beam.y = h + 100
  beam.x = col * spacing + spacing / 2 + (Math.random() - 0.5) * spacing * 0.5
  beam.width = 100 + Math.random() * 100
  beam.speed = 0.5 + Math.random() * 0.4
  beam.hue = 190 + (index * 50) / BEAM_COUNT
  beam.opacity = 0.2 + Math.random() * 0.1
}

function drawBeam(ctx: CanvasRenderingContext2D, beam: Beam) {
  ctx.save()
  ctx.translate(beam.x, beam.y)
  ctx.rotate((beam.angle * Math.PI) / 180)
  const op = beam.opacity * (0.8 + Math.sin(beam.pulse) * 0.2)
  const g = ctx.createLinearGradient(0, 0, 0, beam.length)
  g.addColorStop(0,   `hsla(${beam.hue},85%,65%,0)`)
  g.addColorStop(0.1, `hsla(${beam.hue},85%,65%,${op * 0.5})`)
  g.addColorStop(0.4, `hsla(${beam.hue},85%,65%,${op})`)
  g.addColorStop(0.6, `hsla(${beam.hue},85%,65%,${op})`)
  g.addColorStop(0.9, `hsla(${beam.hue},85%,65%,${op * 0.5})`)
  g.addColorStop(1,   `hsla(${beam.hue},85%,65%,0)`)
  ctx.fillStyle = g
  ctx.fillRect(-beam.width / 2, 0, beam.width, beam.length)
  ctx.restore()
}

function initCanvas() {
  const canvas = canvasRef.value
  const banner = bannerRef.value
  if (!canvas || !banner) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const dpr = window.devicePixelRatio || 1
  const w = banner.offsetWidth
  const h = banner.offsetHeight
  canvas.width  = w * dpr
  canvas.height = h * dpr
  canvas.style.width  = `${w}px`
  canvas.style.height = `${h}px`
  ctx.scale(dpr, dpr)

  beams = Array.from({ length: Math.round(BEAM_COUNT * 1.5) }, () => createBeam(w, h))

  cancelAnimationFrame(rafId)

  function tick() {
    if (!ctx) return
    ctx.clearRect(0, 0, w, h)
    ctx.filter = 'blur(35px)'
    beams.forEach((beam, i) => {
      beam.y -= beam.speed
      beam.pulse += beam.pulseSpeed
      if (beam.y + beam.length < -100) resetBeam(beam, i, w, h)
      drawBeam(ctx, beam)
    })
    rafId = requestAnimationFrame(tick)
  }

  tick()
}

onMounted(() => {
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    initCanvas()
    window.addEventListener('resize', initCanvas)
  }
})

onUnmounted(() => {
  cancelAnimationFrame(rafId)
  window.removeEventListener('resize', initCanvas)
})
</script>

<style scoped>
.page-banner {
  position: relative;
  height: 560px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  background: #060912;
  border-bottom: 1px solid rgba(255,255,255,0.07);
}

.banner-canvas {
  position: absolute;
  inset: 0;
  z-index: 0;
  filter: blur(15px);
  opacity: 0.9;
}

.banner-beam-overlay {
  position: absolute;
  inset: 0;
  z-index: 1;
  background: rgba(6,9,18,0.08);
  backdrop-filter: blur(2px);
  animation: beam-pulse 10s ease-in-out infinite;
}

@keyframes beam-pulse {
  0%, 100% { opacity: 0.6; }
  50%       { opacity: 1; }
}

.banner-content {
  position: relative;
  z-index: 2;
  padding-top: 76px;
  padding-left: clamp(24px, 6vw, 80px);
  padding-right: clamp(24px, 6vw, 80px);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.banner-eyebrow {
  display: flex;
  align-items: center;
  gap: 14px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 3.5px;
  text-transform: uppercase;
  color: rgba(255,255,255,0.55);
  margin-bottom: 1.5rem;
  animation: bannerFadeUp 0.65s cubic-bezier(0.16,1,0.3,1) 0.05s both;
}

.eyebrow-line {
  display: inline-block;
  width: 28px;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(56,189,248,0.7), transparent);
  flex-shrink: 0;
  animation: lineGrow 0.55s cubic-bezier(0.16,1,0.3,1) 0.05s both;
}

@keyframes lineGrow {
  from { width: 0; opacity: 0; }
  to   { width: 28px; opacity: 1; }
}

.banner-title {
  color: #fff;
  font-size: clamp(42px, 7vw, 86px);
  font-weight: 800;
  letter-spacing: -2px;
  line-height: 1.0;
  margin-bottom: 1.25rem;
  animation: bannerFadeUp 0.75s cubic-bezier(0.16,1,0.3,1) 0.15s both;
}

.banner-sub {
  font-size: clamp(13px, 1.1vw, 15.5px);
  color: rgba(255,255,255,0.55);
  max-width: 520px;
  line-height: 1.8;
  animation: bannerFadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.25s both;
}

@keyframes bannerFadeUp {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: none; }
}

@media (prefers-reduced-motion: reduce) {
  .banner-eyebrow,
  .banner-title,
  .banner-sub,
  .eyebrow-line   { animation: none; }
  .banner-canvas  { display: none; }
  .banner-beam-overlay { animation: none; }
}

@media (max-width: 600px) {
  .page-banner { height: 420px; }
  .banner-title { letter-spacing: -1px; }
}
</style>
