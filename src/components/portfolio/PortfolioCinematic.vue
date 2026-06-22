<template>
  <!-- Loader + dark flash overlay — both Teleported to <body> so they're
       unaffected by any parent GSAP/opacity transformations and persist
       even after the cinematic section collapses. -->
  <Teleport to="body">
    <PortfolioLoader v-if="showLoader" :done="sceneReady" @complete="onLoaderDone" />
    <!-- Dark screen: fades in during scroll, then fades out after the grid is ready -->
    <div class="transition-overlay" :style="{ opacity: flashOpacity }" v-if="showFlash"></div>
  </Teleport>

  <!-- Root div acts as ScrollTrigger pin target (100vh).
       cinematicHidden collapses it to 0 height after the intro transition fires,
       so the grid section rises to the top before the flash fades out. -->
  <div class="cinematic-section" ref="cinematicRootRef"
       :class="{ 'cinematic-hidden': cinematicHidden }"
       @mousedown="handleMouseDown"
       @mousemove="handleMouseMove"
       @mouseleave="handleMouseLeave"
       @touchstart="handleTouchStart"
       @touchmove="handleTouchMove"
       @dragstart.prevent>

    <!-- Cinematic WebGL Intro -->
    <div class="cinematic-viewport" ref="viewportRef" v-show="!introComplete" :style="{ opacity: viewportOpacity }">
      <canvas ref="canvasRef" class="webgl-canvas"></canvas>

      <!-- Cinematic vignette — darkens the edges so the eye lands on the desk -->
      <div class="cinematic-vignette" aria-hidden="true"></div>

      <!-- Scene 1 title overlay — outer wrapper receives the entrance animation,
           inner wrapper receives the scroll-driven opacity/scale from titleStyle -->
      <div class="floating-title-container" ref="titleWrapperRef">
        <div :style="titleStyle">
          <h1 class="floating-title">PORTFOLIO</h1>
          <p class="floating-subtitle">NETSERVICE MASTERPIECES</p>
        </div>
      </div>

      <!-- Scroll prompt -->
      <div class="scroll-prompt-container" v-show="scrollProgress < 0.25">
        <span class="scroll-arrow">↓</span> Scroll or drag to open book
      </div>

      <!-- Skip intro -->
      <button
        v-if="!showLoader"
        ref="skipBtnRef"
        class="skip-intro-btn"
        @click="skipIntro"
        aria-label="Skip intro"
      >
        Skip intro
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M3 8h8M8 5l3 3-3 3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
          <line x1="13" y1="4" x2="13" y2="12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
        </svg>
      </button>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useDevice } from '../../composables/useDevice'
import { useLenis } from '../../composables/useLenis'
import * as THREE from 'three'
import PortfolioLoader from '../../components/portfolio/PortfolioLoader.vue'

gsap.registerPlugin(ScrollTrigger)
const emit = defineEmits<{
  'update:introComplete': [value: boolean]
  'update:scrollProgress': [value: number]
}>()


const { isMobile } = useDevice()
const { lenis } = useLenis()

// Loading screen: shown until the Three.js scene has completed first render
const sceneReady = ref(false)
const showLoader  = ref(true)   // becomes false once the loader fires its 'complete' event
const onLoaderDone = () => {
  showLoader.value = false
  // Wait ~260ms for the loader overlay to fully fade out, then reveal the 3D scene
  setTimeout(() => {
    // Fade viewport in from darkness
    gsap.to(viewportOpacity, { value: 1, duration: 0.75, ease: 'power2.out' })
    // Slide title up from below after viewport appears
    if (titleWrapperRef.value) {
      gsap.fromTo(titleWrapperRef.value,
        { opacity: 0, y: 22 },
        { opacity: 1, y: 0, duration: 1.0, ease: 'power2.out', delay: 0.18 }
      )
    }
  }, 260)
}

// Light & Shadow Enhancement Features Toggle (Set false to roll back/disable any feature)
const shadowFeatures = {
  leafFlutter: true,       // 1. Dynamic independent leaf swaying
  komorebiFill: true,      // 2. Translucent yellow-green leaf filtered light fill
  dustVolumetricGlow: true,// 3. Golden dust particle illumination inside the light beam
  metallicGlints: true,    // 4. Lens flare glints on gold metal pen/nameplate
  sunsetProgression: true  // 5. Sunset orange color shift as user scrolls
}

// Shared references for custom features
const leafFlutterPivots: { group: THREE.Group; baseRotX: number; baseRotY: number; baseRotZ: number; offset: number }[] = []
const glintSprites: THREE.Sprite[] = []
let komorebiLight: THREE.DirectionalLight | null = null
let leftWarmSunLight: THREE.DirectionalLight | null = null
let flareTex: THREE.CanvasTexture | null = null
let glintMat: THREE.SpriteMaterial | null = null

function initFlareMaterial() {
  if (flareTex) return
  const flareCanvas = document.createElement('canvas')
  flareCanvas.width = 64
  flareCanvas.height = 64
  const fCtx = flareCanvas.getContext('2d')
  if (fCtx) {
    const fGrad = fCtx.createRadialGradient(32, 32, 0, 32, 32, 32)
    fGrad.addColorStop(0, 'rgba(255, 245, 220, 1.0)') // Bright core
    fGrad.addColorStop(0.15, 'rgba(255, 230, 180, 0.8)')
    fGrad.addColorStop(0.4, 'rgba(212, 175, 55, 0.2)') // Gold outer glow
    fGrad.addColorStop(1.0, 'rgba(0, 0, 0, 0.0)')
    fCtx.fillStyle = fGrad
    fCtx.fillRect(0, 0, 64, 64)
  }
  flareTex = new THREE.CanvasTexture(flareCanvas)
  glintMat = new THREE.SpriteMaterial({
    map: flareTex,
    blending: THREE.AdditiveBlending,
    transparent: true,
    opacity: 0.0,
    depthWrite: false
  })
}

// Viewport Refs
const cinematicRootRef = ref<HTMLElement | null>(null)   // ScrollTrigger pin target
const viewportRef = ref<HTMLElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const skipBtnRef = ref<HTMLElement | null>(null)
const titleWrapperRef = ref<HTMLElement | null>(null)

// Viewport & title fade-in after loader (0 = invisible on load, animated to 1 in onLoaderDone)
const viewportOpacity = ref(0)

// Reusable vector for projecting book corner to screen — no GC per frame
let _skipCorner: THREE.Vector3 | null = null
let _skipBtnMountedAt = 0   // timestamp when button first appears (after loader done)

// Animation Control States
const scrollProgress = ref(0)
const introComplete = ref(false)
const flashOpacity = ref(0)
const cinematicHidden = ref(false)           // collapses cinematic section after intro transition
const showFlash = computed(() => flashOpacity.value > 0)

// Title Fade Style
const titleStyleVals = ref({ opacity: 1, scale: 1, yPercent: 0 })
const titleStyle = computed(() => {
  return {
    opacity: titleStyleVals.value.opacity,
    transform: `scale(${titleStyleVals.value.scale}) translateY(${titleStyleVals.value.yPercent}%)`
  }
})

// Mouse Interaction parameters (Parallax Camera Tilt & Click-to-Drag Scroll)
const mouse = { x: 0, y: 0 }
let targetTiltX = 0
let targetTiltY = 0
let currentTiltX = 0
let currentTiltY = 0

// Drag scroll parameters
let isDragging = false
let startX = 0
let startY = 0
let lastScrollY = 0

function handleMouseDown(e: MouseEvent) {
  if (isMobile.value || introComplete.value) return
  
  // Prevent native selection and drag-and-drop ghosting that freeze mouseup events
  e.preventDefault()
  
  isDragging = true
  startX = e.clientX
  startY = e.clientY
  lastScrollY = lenis.value?.scroll ?? window.scrollY
  
  if (viewportRef.value) {
    viewportRef.value.style.cursor = 'grabbing'
  }
}

function handleMouseMove(e: MouseEvent) {
  if (isMobile.value || introComplete.value) return
  
  // Normalize mouse coordinates from -1 to 1 (for 3D scene tilt parallax)
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1
  // Also keep hoverMouse2D in sync for raycasting
  hoverMouse2D.set(mouse.x, mouse.y)

  // Set target rotation offsets — boosted 2.5x for stronger cinematic camera movement
  targetTiltY = mouse.x * 0.60
  targetTiltX = mouse.y * 0.40

  // Handle active drag-to-scroll
  if (isDragging) {
    const deltaX = e.clientX - startX
    const deltaY = e.clientY - startY
    
    // Dragging left (-deltaX) or dragging up (-deltaY) scrolls down (flips page forward)
    // Dragging right (+deltaX) or dragging down (+deltaY) scrolls up (flips page backward)
    // dragMultiplier tuned to require a 50% longer drag distance for deliberate, heavy page turning
    const dragMultiplier = 2.3
    const targetScroll = lastScrollY - (deltaX + deltaY) * dragMultiplier
    
    if (lenis.value) {
      lenis.value.scrollTo(targetScroll, { immediate: true })
    } else {
      window.scrollTo(0, targetScroll)
    }
  }
}

function handleMouseLeave() {
  targetTiltX = 0
  targetTiltY = 0
}

function handleMouseUp() {
  if (!isDragging) return
  isDragging = false
  if (viewportRef.value) {
    viewportRef.value.style.cursor = ''
  }
}

// Touch support for drag-to-scroll (e.g. tablet screens)
function handleTouchStart(e: TouchEvent) {
  if (isMobile.value || introComplete.value) return
  if (e.touches.length > 0) {
    isDragging = true
    startX = e.touches[0].clientX
    startY = e.touches[0].clientY
    lastScrollY = lenis.value?.scroll ?? window.scrollY
  }
}

function handleTouchMove(e: TouchEvent) {
  if (isMobile.value || introComplete.value || !isDragging) return
  if (e.touches.length > 0) {
    const deltaX = e.touches[0].clientX - startX
    const deltaY = e.touches[0].clientY - startY
    
    // dragMultiplier tuned to require a 50% longer drag distance for deliberate, heavy page turning
    const dragMultiplier = 2.3
    const targetScroll = lastScrollY - (deltaX + deltaY) * dragMultiplier
    
    if (lenis.value) {
      lenis.value.scrollTo(targetScroll, { immediate: true })
    } else {
      window.scrollTo(0, targetScroll)
    }
    
    // Prevent standard rubberband/scroll fighting on touch devices
    e.preventDefault()
  }
}

function handleTouchEnd() {
  isDragging = false
}

// Three.js instances
let scene: THREE.Scene
let stageGroup: THREE.Group
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let animationFrameId: number | null = null
let isIntersecting = true
let observer: IntersectionObserver | null = null

// Animatable Three.js Node objects
let folderGroup: THREE.Group
let frontCoverGroup: THREE.Group
const pageGroups: THREE.Group[] = []
const pageMeshes: THREE.Mesh[] = []
const wobblingPens: { group: THREE.Group; baseRotX: number; baseRotZ: number; multiplier: number }[] = []

// Leaf shadow animation objects
let leafShadowGroup: THREE.Group
const leafPlanes: THREE.Mesh[] = []

// Dust particles system
let dustParticles: THREE.Points
let dustPositions: Float32Array
let dustSpeeds: Float32Array
const particleCount = 60

// Target vector for camera to look at (for interpolation)
const cameraTarget = new THREE.Vector3(-0.2, -0.95, -0.2)

let scrollTriggerInstance: ScrollTrigger | null = null
let handleVisibilityChange: () => void

// Desk object hover interaction groups (for micro-hover animation)
let hoverPenStandGroup: THREE.Group | null = null
let hoverCupGroup: THREE.Group | null = null
let hoverNoteHolderGroup: THREE.Group | null = null
let hoverTrayGroup: THREE.Group | null = null

// Hover state tracking — target Y lift per object
const hoverLift = { penStand: 0, cup: 0, noteHolder: 0, tray: 0 }
// Base Y positions (set after groups are created)
const hoverBaseY = { penStand: 0, cup: 0, noteHolder: 0, tray: 0 }

// Raycaster for hover detection
const hoverRaycaster = new THREE.Raycaster()
const hoverMouse2D = new THREE.Vector2()

// Helper functions for generating procedural textures
function createWoodTexture(isBump = false) {
  const scale = 4
  const canvas = document.createElement('canvas')
  // 512 x 368 base scaled up by scale (4) to 2048 x 1472 for high-definition rendering
  canvas.width = 512 * scale
  canvas.height = 368 * scale
  const ctx = canvas.getContext('2d')
  if (!ctx) return new THREE.Texture()

  // Seeded PRNG for identical mapping
  let seed = 98765;
  const random = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  }

  // Base colors - Premium modern Dark Walnut Veneer
  if (isBump) {
    ctx.fillStyle = '#808080' // Neutral height midpoint
  } else {
    ctx.fillStyle = '#1c100c' // Rich, deep dark chocolate walnut base
  }
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // Configure Wood Knots (ตาไม้/วงปีเป็นหย่อมๆ) based on the reference image
  const knots = [
    {
      x: canvas.width * 0.65,
      y: canvas.height * 0.70,
      rx: 60 * scale,
      ry: 13 * scale,
      strength: 1.05
    },
    {
      x: canvas.width * 0.34,
      y: canvas.height * 0.40,
      rx: 35 * scale,
      ry: 8 * scale,
      strength: 0.95
    }
  ]

  // Phase offsets for the base waves
  const phaseOffset1 = random() * Math.PI * 2
  const phaseOffset2 = random() * Math.PI * 2

  // Warp function: deforms Y-coordinates to wrap around wood knots
  const warp = (x: number, y_base: number) => {
    let warpedY = y_base
    for (let k of knots) {
      const dx = x - k.x
      const dy = y_base - k.y
      const dist2 = (dx / k.rx) * (dx / k.rx) + (dy / k.ry) * (dy / k.ry)
      const factor = Math.exp(-dist2 * 0.85) // Gaussian decay field
      if (factor > 0.001) {
        // Push grain lines away from the knot center (up or down)
        const push = (dy >= 0 ? 1 : -1) * k.ry * factor * k.strength
        warpedY += push
      }
    }
    return warpedY
  }

  // Draw Wood Knots Background & Glow (applied only to diffuse)
  if (!isBump) {
    for (let k of knots) {
      const knotGlow = ctx.createRadialGradient(
        k.x, k.y, k.ry * 0.15,
        k.x, k.y, k.rx * 1.3
      )
      knotGlow.addColorStop(0, 'rgba(105, 68, 48, 0.35)') // Rich caramel glow
      knotGlow.addColorStop(0.5, 'rgba(74, 48, 36, 0.15)')
      knotGlow.addColorStop(1, 'rgba(0, 0, 0, 0)')
      ctx.fillStyle = knotGlow
      ctx.beginPath()
      ctx.ellipse(k.x, k.y, k.rx * 1.4, k.ry * 1.4, 0, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  // Layer 1: Wide growth bands (warped around knots)
  const numBands = 24
  for (let i = 0; i < numBands; i++) {
    const isDark = random() > 0.45
    const y_base = (-40 + (i / (numBands - 1)) * (368 + 80) + (random() - 0.5) * 20) * scale
    const width = (25 + random() * 45) * scale
    const alphaVal = 0.12 + random() * 0.16

    if (isBump) {
      ctx.strokeStyle = isDark ? `rgba(100, 100, 100, ${alphaVal * 0.5})` : `rgba(145, 145, 145, ${alphaVal * 0.4})`
    } else {
      const randColor = random()
      if (randColor > 0.6) {
        ctx.strokeStyle = `rgba(10, 5, 3, ${alphaVal * 1.4})` // Deep dark charcoal
      } else if (randColor > 0.25) {
        ctx.strokeStyle = `rgba(74, 48, 36, ${alphaVal * 1.0})` // Rich warm dark brown
      } else {
        ctx.strokeStyle = `rgba(110, 72, 50, ${alphaVal * 0.6})` // Caramel highlight band
      }
    }
    ctx.lineWidth = width

    ctx.beginPath()
    let first = true
    for (let x = 0; x <= canvas.width + 32 * scale; x += 32 * scale) {
      const wave = (Math.sin((x / scale) * 0.0015 + phaseOffset1) * 3.2 + Math.sin((x / scale) * 0.006 + phaseOffset2) * 0.8) * scale
      const warpedY = warp(x, y_base + wave)
      if (first) {
        ctx.moveTo(x, warpedY)
        first = false
      } else {
        ctx.lineTo(x, warpedY)
      }
    }
    ctx.stroke()
  }

  // Layer 2: High-definition growth rings (warped around knots)
  const numRings = 40
  for (let i = 0; i < numRings; i++) {
    const y_base = (-20 + (i / (numRings - 1)) * (368 + 40) + (random() - 0.5) * 10) * scale
    const width = (0.8 + random() * 1.5) * scale
    const alphaVal = 0.20 + random() * 0.20

    if (isBump) {
      ctx.strokeStyle = `rgba(105, 105, 105, ${alphaVal * 0.6})`
    } else {
      ctx.strokeStyle = random() > 0.45 
        ? `rgba(12, 6, 4, ${alphaVal * 1.4})` 
        : `rgba(74, 48, 36, ${alphaVal * 0.9})`
    }
    ctx.lineWidth = width

    ctx.beginPath()
    let first = true
    for (let x = 0; x <= canvas.width + 16 * scale; x += 16 * scale) {
      const wave = (Math.sin((x / scale) * 0.0015 + phaseOffset1) * 3.2 + Math.sin((x / scale) * 0.006 + phaseOffset2) * 0.8) * scale
      const warpedY = warp(x, y_base + wave)
      if (first) {
        ctx.moveTo(x, warpedY)
        first = false
      } else {
        ctx.lineTo(x, warpedY)
      }
    }
    ctx.stroke()
  }

  // Draw Wood Knots Concentric Rings inside the warped blank spaces
  for (let k of knots) {
    // 1. Dark core center
    ctx.fillStyle = isBump ? '#555555' : '#0a0503'
    ctx.beginPath()
    ctx.ellipse(k.x, k.y, k.rx * 0.06, k.ry * 0.06, 0, 0, Math.PI * 2)
    ctx.fill()

    // 2. Concentric rings matching the shape with organic growth variations
    const numKnotRings = 22
    for (let rStep = 0; rStep < numKnotRings; rStep++) {
      const t = rStep / (numKnotRings - 1)
      const rx_ring = k.rx * (0.05 + t * 0.85)
      const ry_ring = k.ry * (0.05 + t * 0.85)
      
      // Randomize ring opacity slightly to look more natural
      const ringAlpha = (0.35 - t * 0.16) * k.strength * (0.75 + random() * 0.4)

      if (isBump) {
        ctx.strokeStyle = `rgba(100, 100, 100, ${ringAlpha * 0.6})`
      } else {
        ctx.strokeStyle = `rgba(12, 6, 4, ${ringAlpha * 1.4})`
      }
      ctx.lineWidth = (0.6 + t * 1.8) * scale

      ctx.beginPath()
      const segments = 48
      let first = true
      for (let s = 0; s <= segments; s++) {
        const theta = (s / segments) * Math.PI * 2
        // Organic growth wobbling to eliminate vector-perfect appearance
        const radialNoise = 1.0 + Math.sin(theta * 5 + phaseOffset1) * 0.03 + Math.sin(theta * 9 + phaseOffset2) * 0.015
        const px = k.x + rx_ring * radialNoise * Math.cos(theta)
        const py = k.y + ry_ring * radialNoise * Math.sin(theta)
        if (first) {
          ctx.moveTo(px, py)
          first = false
        } else {
          ctx.lineTo(px, py)
        }
      }
      ctx.stroke()
    }

    // 3. Subtle radial cracks / checking lines in the knot (รอยแห้งแตกลายตามธรรมชาติ)
    const numCracks = 4
    for (let c = 0; c < numCracks; c++) {
      const angle = (c / numCracks) * Math.PI * 2 + (random() - 0.5) * 0.6
      const startT = 0.15 + random() * 0.15
      const endT = 0.45 + random() * 0.35
      
      if (!isBump) {
        ctx.strokeStyle = `rgba(12, 6, 4, ${(0.25 + random() * 0.25) * k.strength})`
      } else {
        ctx.strokeStyle = `rgba(70, 70, 70, ${(0.2 + random() * 0.2) * k.strength})`
      }
      ctx.lineWidth = (0.5 + random() * 0.6) * scale

      ctx.beginPath()
      let first = true
      const steps = 4
      for (let s = 0; s <= steps; s++) {
        const t = startT + (s / steps) * (endT - startT)
        const wAngle = angle + (random() - 0.5) * 0.12
        const cx = k.x + Math.cos(wAngle) * k.rx * t
        const cy = k.y + Math.sin(wAngle) * k.ry * t
        if (first) {
          ctx.moveTo(cx, cy)
          first = false
        } else {
          ctx.lineTo(cx, cy)
        }
      }
      ctx.stroke()
    }
  }

  // Layer 3: Dense fine wood fibers (gentle straight parallel lines warped around knots)
  const numFibers = 220
  for (let i = 0; i < numFibers; i++) {
    const y_base = random() * canvas.height
    const width = (0.3 + random() * 0.5) * scale
    const alphaVal = 0.11 + random() * 0.17
    const isDark = random() > 0.4

    if (isBump) {
      ctx.strokeStyle = isDark ? `rgba(75, 75, 75, ${alphaVal * 0.6})` : `rgba(165, 165, 165, ${alphaVal * 0.4})`
    } else {
      ctx.strokeStyle = isDark ? `rgba(22, 12, 8, ${alphaVal * 1.3})` : `rgba(90, 60, 45, ${alphaVal * 0.75})`
    }
    ctx.lineWidth = width

    ctx.beginPath()
    let first = true
    for (let x = 0; x <= canvas.width + 32 * scale; x += 32 * scale) {
      const wave = (Math.sin((x / scale) * 0.0015 + phaseOffset1) * 3.2 + Math.sin((x / scale) * 0.006 + phaseOffset2) * 0.8) * scale
      const warpedY = warp(x, y_base + wave) + (random() - 0.5) * 0.4 * scale
      if (first) {
        ctx.moveTo(x, warpedY)
        first = false
      } else {
        ctx.lineTo(x, warpedY)
      }
    }
    ctx.stroke()
  }

  // Layer 4: Micro-pores (dashed pores warped around knots)
  const numPores = 400
  for (let i = 0; i < numPores; i++) {
    const y_base = random() * canvas.height
    const alphaVal = 0.07 + random() * 0.08
    const width = (0.35 + random() * 0.45) * scale
    
    if (isBump) {
      ctx.strokeStyle = `rgba(60, 60, 60, ${alphaVal * 0.6})`
    } else {
      ctx.strokeStyle = `rgba(15, 8, 5, ${alphaVal * 1.1})`
    }
    ctx.lineWidth = width

    // Randomize dash size and starting offset per line to completely eliminate vertical Moire alignments (which resembled tire tracks)
    const dashLen = (1.0 + random() * 1.5) * scale
    const gapLen = (2.5 + random() * 2.5) * scale
    ctx.setLineDash([dashLen, gapLen])
    ctx.lineDashOffset = random() * 100 * scale

    ctx.beginPath()
    let first = true
    for (let x = 0; x <= canvas.width + 32 * scale; x += 32 * scale) {
      const wave = (Math.sin((x / scale) * 0.0015 + phaseOffset1) * 3.2 + Math.sin((x / scale) * 0.006 + phaseOffset2) * 0.8) * scale
      const warpedY = warp(x, y_base + wave) + (random() - 0.5) * 0.4 * scale
      if (first) {
        ctx.moveTo(x, warpedY)
        first = false
      } else {
        ctx.lineTo(x, warpedY)
      }
    }
    ctx.stroke()
  }
  ctx.setLineDash([]) // Reset dash

  // Layer 5: Radial Vignette Overlay for premium visual depth (applied only to diffuse)
  if (!isBump) {
    const vignette = ctx.createRadialGradient(
      canvas.width / 2, canvas.height / 2, canvas.width / 4,
      canvas.width / 2, canvas.height / 2, canvas.width * 0.75
    )
    vignette.addColorStop(0, 'rgba(0, 0, 0, 0.0)')
    vignette.addColorStop(0.5, 'rgba(0, 0, 0, 0.05)')
    vignette.addColorStop(1, 'rgba(0, 0, 0, 0.38)') // Mutes edges to draw focus to the book
    ctx.fillStyle = vignette
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.ClampToEdgeWrapping
  texture.wrapT = THREE.ClampToEdgeWrapping
  return texture
}

function createDocumentTexture(isDocument2 = false) {
  const canvas = document.createElement('canvas')
  // Use high-definition 1024x1408 resolution for crisp text lines
  canvas.width = 1024
  canvas.height = 1408
  const ctx = canvas.getContext('2d')
  if (!ctx) return new THREE.Texture()

  // Base paper color
  ctx.fillStyle = '#faf8f4' // Premium warm editorial paper
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // Seeded PRNG for identical mapping
  let seed = isDocument2 ? 987654 : 123456;
  const random = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  }

  // Draw elegant double-line border
  ctx.strokeStyle = 'rgba(30, 41, 59, 0.04)'
  ctx.lineWidth = 4
  ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80)
  ctx.strokeStyle = 'rgba(30, 41, 59, 0.02)'
  ctx.lineWidth = 1
  ctx.strokeRect(48, 48, canvas.width - 96, canvas.height - 96)

  // 1. Header (Mock branding/metadata)
  // Mock Logo (two horizontal bars next to each other)
  ctx.fillStyle = 'rgba(30, 41, 59, 0.85)' // Dark navy grey
  ctx.fillRect(80, 90, 160, 28)
  ctx.fillStyle = 'rgba(196, 154, 69, 0.8)' // Accent Gold
  ctx.fillRect(250, 90, 40, 28)

  // Sub-header metadata lines (aligned right)
  ctx.fillStyle = 'rgba(120, 130, 145, 0.5)'
  ctx.fillRect(canvas.width - 240, 90, 160, 12)
  ctx.fillRect(canvas.width - 200, 112, 120, 10)

  // Horizontal separating line
  ctx.fillStyle = 'rgba(196, 154, 69, 0.3)' // Soft gold accent line
  ctx.fillRect(80, 150, canvas.width - 160, 4)

  // 2. Body Text Paragraphs (Mock "greeked" text)
  let y = 200
  while (y < canvas.height - 180) {
    const rVal = random()
    
    // Check if we should draw a heading block
    if (rVal > 0.8 && y < canvas.height - 300) {
      y += 24
      ctx.fillStyle = 'rgba(30, 41, 59, 0.75)'
      ctx.fillRect(80, y, 220 + random() * 180, 22) // Bold heading line
      y += 44
    }

    // Standard paragraph of text lines
    const numLines = 4 + Math.floor(random() * 6)
    ctx.fillStyle = 'rgba(71, 85, 105, 0.65)' // Grey body text simulation
    for (let l = 0; l < numLines; l++) {
      if (y >= canvas.height - 180) break
      
      // Last line in paragraph is shorter
      const lineLen = (l === numLines - 1)
        ? (0.35 + random() * 0.45) * (canvas.width - 160)
        : (0.92 + random() * 0.08) * (canvas.width - 160)
        
      ctx.fillRect(80, y, lineLen, 10) // Text line
      y += 22
    }
    y += 36 // Space between paragraphs
  }

  // 3. Footer area (Signatures & Stamp)
  // Gold circular mock stamp
  ctx.fillStyle = 'rgba(196, 154, 69, 0.22)' // Translucent gold stamp
  ctx.beginPath()
  ctx.arc(canvas.width - 160, canvas.height - 130, 36, 0, Math.PI * 2)
  ctx.fill()
  
  // Inner stamp details
  ctx.strokeStyle = 'rgba(196, 154, 69, 0.4)'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.arc(canvas.width - 160, canvas.height - 130, 26, 0, Math.PI * 2)
  ctx.stroke()

  // Signature line
  ctx.strokeStyle = 'rgba(120, 130, 145, 0.4)'
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.moveTo(80, canvas.height - 110)
  ctx.lineTo(280, canvas.height - 110)
  ctx.stroke()

  // Signature script scribble (simulated handwriting curve)
  ctx.strokeStyle = 'rgba(30, 50, 90, 0.6)' // Cursive blue ink
  ctx.lineWidth = 2.5
  ctx.beginPath()
  ctx.moveTo(90, canvas.height - 120)
  ctx.bezierCurveTo(
    130, canvas.height - 145,
    180, canvas.height - 90,
    220, canvas.height - 130
  )
  ctx.bezierCurveTo(
    240, canvas.height - 145,
    260, canvas.height - 115,
    275, canvas.height - 125
  )
  ctx.stroke()

  ctx.fillStyle = 'rgba(120, 130, 145, 0.5)'
  ctx.fillRect(80, canvas.height - 90, 120, 10) // Mock title under signature

  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.ClampToEdgeWrapping
  texture.wrapT = THREE.ClampToEdgeWrapping
  return texture
}

function createReflectionEnvMap() {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 256
  const ctx = canvas.getContext('2d')
  if (!ctx) return new THREE.Texture()

  // Dark background represents dark night outside
  ctx.fillStyle = '#060810'
  ctx.fillRect(0, 0, 512, 256)

  // Add warm glow from the desk lamps and room lighting
  const warmGlow = ctx.createRadialGradient(256, 128, 0, 256, 128, 180)
  warmGlow.addColorStop(0, 'rgba(255, 170, 85, 0.15)')
  warmGlow.addColorStop(1, 'rgba(6, 8, 16, 0)')
  ctx.fillStyle = warmGlow
  ctx.fillRect(0, 0, 512, 256)

  // Add cool soft light panel reflections (representing ceiling lights or office panels)
  ctx.fillStyle = 'rgba(200, 230, 255, 0.08)'
  // Vertical strip 1
  ctx.fillRect(80, 20, 60, 120)
  // Vertical strip 2
  ctx.fillRect(380, 50, 40, 160)
  
  // Soft horizontal strip (ceiling light)
  const ceilGrad = ctx.createLinearGradient(0, 0, 512, 0)
  ceilGrad.addColorStop(0, 'rgba(255,255,255,0)')
  ceilGrad.addColorStop(0.5, 'rgba(255,255,255,0.06)')
  ceilGrad.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = ceilGrad
  ctx.fillRect(0, 10, 512, 15)

  // Abstract grid reflections (like window pane structures in the background)
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)'
  ctx.lineWidth = 2
  ctx.strokeRect(100, 40, 120, 80)
  ctx.strokeRect(300, 60, 120, 100)

  const texture = new THREE.CanvasTexture(canvas)
  texture.mapping = THREE.EquirectangularReflectionMapping
  return texture
}

function createNightSkylineTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 1024
  canvas.height = 768
  const ctx = canvas.getContext('2d')
  if (!ctx) return new THREE.Texture()

  // 1. Night Sky Gradient - Deep navy blue fading to black
  const skyGrad = ctx.createLinearGradient(0, 768, 0, 0)
  skyGrad.addColorStop(0, '#0c1020') // deep navy blue horizon
  skyGrad.addColorStop(0.4, '#060810') // dark night sky
  skyGrad.addColorStop(1.0, '#030408')
  ctx.fillStyle = skyGrad
  ctx.fillRect(0, 0, 1024, 768)

  // 2. Subtle distant stars
  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)'
  for (let i = 0; i < 40; i++) {
    const x = Math.random() * 1024
    const y = Math.random() * 400
    const r = Math.random() * 1.5
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.fill()
  }

  // 3. Distant City Silhouettes (Building Towers) - Very dark
  ctx.fillStyle = '#030408' // dark silhouette color
  const numBuildings = 12
  for (let i = 0; i < numBuildings; i++) {
    const w = 50 + Math.random() * 70
    const h = 150 + Math.random() * 200
    const x = i * 90 - 30
    const y = 768 - h
    ctx.fillRect(x, y, w, h)
    
    // Add tiny soft white/blue window lights inside the building silhouettes
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)'
    const rows = Math.floor(h / 30)
    const cols = Math.floor(w / 20)
    for (let r = 2; r < rows - 1; r++) {
      for (let c = 1; c < cols - 1; c++) {
        if (Math.random() > 0.8) {
          ctx.fillRect(x + c * 20, y + r * 30, 2, 4)
        }
      }
    }
    ctx.fillStyle = '#030408' // restore building color
  }

  // 4. Soft horizon glow/mist (deep blue)
  const hazeGrad = ctx.createLinearGradient(0, 768, 0, 450)
  hazeGrad.addColorStop(0, 'rgba(12, 16, 32, 0.5)')
  hazeGrad.addColorStop(1, 'rgba(6, 8, 16, 0)')
  ctx.fillStyle = hazeGrad
  ctx.fillRect(0, 450, 1024, 318)

  const texture = new THREE.CanvasTexture(canvas)
  return texture
}


function createDeskPadTexture() {
  const canvas = document.createElement('canvas')
  // Downscaled resolution to fix startup lag
  canvas.width = 1024
  canvas.height = 724
  const ctx = canvas.getContext('2d')
  if (!ctx) return new THREE.Texture()

  // Base charcoal black leather color
  ctx.fillStyle = '#151516'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // Draw some subtle noise/grain for leather texture (reduced from 80000 to 4000)
  for (let i = 0; i < 4000; i++) {
    const x = Math.random() * canvas.width
    const y = Math.random() * canvas.height
    const size = Math.random() * 2.0 + 0.5
    const opacity = Math.random() * 0.04
    ctx.fillStyle = Math.random() > 0.5 ? `rgba(255, 255, 255, ${opacity})` : `rgba(0, 0, 0, ${opacity * 1.5})`
    ctx.fillRect(x, y, size, size)
  }

  // Draw elegant gold stitched border line
  ctx.strokeStyle = '#c49a45' // Gold/Bronze color
  ctx.lineWidth = 1.1 // Scaled down from 2.2 for smaller canvas
  ctx.setLineDash([2.5, 2]) // Denser stitching dash pattern
  
  const pad = 24
  ctx.beginPath()
  ctx.roundRect(pad, pad, canvas.width - pad * 2, canvas.height - pad * 2, 12)
  ctx.stroke()

  // Draw vertical gold stitching lines (left and right side panels)
  ctx.beginPath()
  ctx.moveTo(160, 24)
  ctx.lineTo(160, canvas.height - 24)
  ctx.moveTo(864, 24)
  ctx.lineTo(864, canvas.height - 24)
  ctx.stroke()

  // Draw debossed dark crease lines next to the vertical stitching for realistic panel indentation
  ctx.strokeStyle = '#09090a' // Dark shadow line
  ctx.lineWidth = 1.0 // Thinner seam line
  ctx.setLineDash([]) // Solid line
  ctx.beginPath()
  ctx.moveTo(157, 24)
  ctx.lineTo(157, canvas.height - 24)
  ctx.moveTo(867, 24)
  ctx.lineTo(867, canvas.height - 24)
  ctx.stroke()

  const texture = new THREE.CanvasTexture(canvas)
  return texture
}

function createDeskPadBumpTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 1024
  canvas.height = 724
  const ctx = canvas.getContext('2d')
  if (!ctx) return new THREE.Texture()

  // Mid grey base for neutral height
  ctx.fillStyle = '#808080'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // Leather grain noise (reduced from 60000 to 3000)
  for (let i = 0; i < 3000; i++) {
    const x = Math.random() * canvas.width
    const y = Math.random() * canvas.height
    const size = Math.random() * 2.0 + 0.5
    const val = Math.random() > 0.5 ? 83 : 77 // subtle bumps
    ctx.fillStyle = `rgb(${val}, ${val}, ${val})`
    ctx.fillRect(x, y, size, size)
  }

  const pad = 24
  
  // Stitches (embossed / raised - lighter than 128)
  ctx.strokeStyle = '#a5a5a5'
  ctx.lineWidth = 1.1
  ctx.setLineDash([2.5, 2])
  ctx.beginPath()
  ctx.roundRect(pad, pad, canvas.width - pad * 2, canvas.height - pad * 2, 12)
  ctx.stroke()

  // Vertical stitches
  ctx.beginPath()
  ctx.moveTo(160, 24)
  ctx.lineTo(160, canvas.height - 24)
  ctx.moveTo(864, 24)
  ctx.lineTo(864, canvas.height - 24)
  ctx.stroke()

  // Seams (debossed / recessed - darker than 128)
  ctx.strokeStyle = '#555555'
  ctx.lineWidth = 1.0
  ctx.setLineDash([])
  ctx.beginPath()
  ctx.moveTo(157, 24)
  ctx.lineTo(157, canvas.height - 24)
  ctx.moveTo(867, 24)
  ctx.lineTo(867, canvas.height - 24)
  ctx.stroke()

  const texture = new THREE.CanvasTexture(canvas)
  return texture
}


const pagesData = [
  { title: "Introduction & Contents", color: "#1e293b" },
  { title: "GIS Spatial Platform", color: "#2e7d32" },
  { title: "E-Document System", color: "#316395" },
  { title: "Cyber Security Shield", color: "#6d28d9" },
  { title: "Enterprise Cloud Platforms", color: "#c2410c" },
  { title: "Big Data & Analytics Engine", color: "#0d9488" },
  { title: "Smart City Solutions", color: "#1d4ed8" },
  { title: "Unified API Gateway", color: "#b45309" },
  { title: "Identity Access Management", color: "#374151" },
  { title: "AI Predictive Analytics", color: "#7e22ce" },
  { title: "Private Land Survey System", color: "#15803d" },
  { title: "Structural Integrity Database", color: "#be123c" }
]

const bookPages = [
  null,
  // Page 1: Sheet 0 Front (Intro)
  { type: "intro", title: "ARCHITECTS", text: "Engineering the digital foundations of enterprise systems." },
  // Page 2: Sheet 0 Back (GIS Spatial Left)
  { type: "left", concept: "SPATIAL" },
  // Page 3: Sheet 1 Front (GIS Spatial Right)
  { type: "right", text: "Mapping land telemetry into real-time geospatial intelligence." },
  // Page 4: Sheet 1 Back (E-Doc Left)
  { type: "left", concept: "FLOW" },
  // Page 5: Sheet 2 Front (E-Doc Right)
  { type: "right", text: "Transitioning legacy paper archives into secure digital workflows." },
  // Page 6: Sheet 2 Back (Security Left)
  { type: "left", concept: "SHIELD" },
  // Page 7: Sheet 3 Front (Security Right)
  { type: "right", text: "Defending critical national networks with zero-trust architectures." },
  // Page 8: Sheet 3 Back (Cloud Left)
  { type: "left", concept: "SCALE" },
  // Page 9: Sheet 4 Front (Cloud Right)
  { type: "right", text: "Migrating enterprise infrastructures into high-performance hybrid clouds." },
  // Page 10: Sheet 4 Back (Big Data Left)
  { type: "left", concept: "INSIGHT" },
  // Page 11: Sheet 5 Front (Big Data Right)
  { type: "right", text: "Processing massive data streams into actionable intelligence." },
  // Page 12: Sheet 5 Back (Smart City Left)
  { type: "left", concept: "UNIFIED" },
  // Page 13: Sheet 6 Front (Smart City Right)
  { type: "right", text: "Integrating urban IoT sensors and communication grids." },
  // Page 14: Sheet 6 Back (API Left)
  { type: "left", concept: "CONNECT" },
  // Page 15: Sheet 7 Front (API Right)
  { type: "right", text: "Standardizing secure interaction between microservices." },
  // Page 16: Sheet 7 Back (IAM Left)
  { type: "left", concept: "IDENTITY" },
  // Page 17: Sheet 8 Front (IAM Right)
  { type: "right", text: "Securing user authentication with advanced cryptographic controls." },
  // Page 18: Sheet 8 Back (AI Left)
  { type: "left", concept: "PROACTIVE" },
  // Page 19: Sheet 9 Front (AI Right)
  { type: "right", text: "Forecasting infrastructure demands with intelligent machine learning." },
  // Page 20: Sheet 9 Back (Survey Left)
  { type: "left", concept: "PRECISION" },
  // Page 21: Sheet 10 Front (Survey Right)
  { type: "right", text: "Verifying property boundaries with absolute satellite telemetry." },
  // Page 22: Sheet 10 Back (Structural Left)
  { type: "left", concept: "STABILITY" },
  // Page 23: Sheet 11 Front (Structural Right)
  { type: "right", text: "Securing the future of national digital infrastructure." },
  // Page 24: Sheet 11 Back (Outro Left)
  { type: "outro", title: "NETSERVICE", text: "Engineered for impact." }
]

function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
  const words = text.split(' ')
  let line = ''
  const lines = []

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' '
    const metrics = ctx.measureText(testLine)
    const testWidth = metrics.width
    if (testWidth > maxWidth && n > 0) {
      lines.push(line)
      line = words[n] + ' '
    } else {
      line = testLine
    }
  }
  lines.push(line)

  const totalHeight = lines.length * lineHeight
  let startY = y - (totalHeight / 2) + (lineHeight / 2)

  for (let i = 0; i < lines.length; i++) {
    ctx.fillText(lines[i].trim(), x, startY)
    startY += lineHeight
  }
}

function createPageTexture(pageNum: number, _title: string, color: string, isBack: boolean = false) {
  const canvas = document.createElement('canvas')
  canvas.width = 584
  canvas.height = 706
  const ctx = canvas.getContext('2d')
  if (!ctx) return new THREE.Texture()

  // Background - off-white premium paper texture
  ctx.fillStyle = '#faf8f5'
  ctx.fillRect(0, 0, 584, 706)

  // Rotate canvas by 180 degrees for back pages to cancel 3D flipping rotation
  if (isBack) {
    ctx.translate(292, 353)
    ctx.rotate(Math.PI)
    ctx.translate(-292, -353)
  }

  // Subtle clean editorial grid margins
  ctx.strokeStyle = 'rgba(30, 41, 59, 0.02)'
  ctx.lineWidth = 1
  ctx.strokeRect(36, 36, 512, 634)

  // Get content for the specific page
  const page = bookPages[pageNum]
  if (page) {
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    // Temporary backup for letter spacing
    const hasSpacing = 'letterSpacing' in ctx

    if (page.type === 'intro' || page.type === 'outro') {
      // Intro/Outro title - Playfair Display for high-fashion editorial feel
      ctx.font = "700 32px 'Playfair Display', Georgia, serif"
      ctx.fillStyle = '#1e293b'
      if (hasSpacing) (ctx as any).letterSpacing = '8px'
      ctx.fillText(page.title || '', 292, 300)
      if (hasSpacing) (ctx as any).letterSpacing = '0px'

      // Minimalist divider line
      ctx.fillStyle = color || '#1e293b'
      ctx.fillRect(252, 345, 80, 2)

      // Subtitle
      ctx.font = "300 18px 'Kanit', 'Helvetica Neue', Arial, sans-serif"
      ctx.fillStyle = '#475569'
      wrapText(ctx, page.text || '', 292, 400, 420, 28)

    } else if (page.type === 'left') {
      // Large bold concept word in the center - Playfair Display
      ctx.font = "700 36px 'Playfair Display', Georgia, serif"
      ctx.fillStyle = '#1e293b'
      if (hasSpacing) (ctx as any).letterSpacing = '10px'
      ctx.fillText(page.concept || '', 292, 353)
      if (hasSpacing) (ctx as any).letterSpacing = '0px'

    } else if (page.type === 'right') {
      // Elegant minimal mission sentence
      ctx.font = "300 20px 'Kanit', 'Helvetica Neue', Arial, sans-serif"
      ctx.fillStyle = '#475569'
      wrapText(ctx, page.text || '', 292, 353, 420, 32)
    }
  }

  // Draw page numbers
  ctx.font = "300 14px 'Kanit', 'Helvetica Neue', Arial, sans-serif"
  ctx.fillStyle = '#94a3b8'
  ctx.textBaseline = 'bottom'
  const pageStr = pageNum < 10 ? '0' + pageNum : '' + pageNum
  if (isBack) {
    // Left page number (bottom-left)
    ctx.textAlign = 'left'
    ctx.fillText(pageStr, 60, 646)
  } else {
    // Right page number (bottom-right)
    ctx.textAlign = 'right'
    ctx.fillText(pageStr, 524, 646)
  }

  const texture = new THREE.CanvasTexture(canvas)
  if (isBack) {
    texture.center.set(0.5, 0.5)
  }
  return texture
}

function createDeskProps(parent: THREE.Object3D, leatherMat: THREE.Material, goldMat: THREE.Material, paperMat: THREE.Material) {
  // Main group for props
  const propsGroup = new THREE.Group()
  parent.add(propsGroup)

  // 1. Stacked Paper Tray (Left Side) - sitting on the table outside the desk mat
  const trayGroup = new THREE.Group()
  trayGroup.position.set(-4.2, -0.945, 0.2)
  hoverTrayGroup = trayGroup
  hoverBaseY.tray = -0.945
  trayGroup.rotation.y = 0
  propsGroup.add(trayGroup)

  const buildTray = () => {
    const group = new THREE.Group()
    // Bottom
    const bottom = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.02, 2.0), leatherMat)
    bottom.receiveShadow = true
    bottom.castShadow = true
    group.add(bottom)
    // Walls
    const wallL = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.12, 2.0), leatherMat)
    wallL.position.set(-0.74, 0.06, 0)
    wallL.castShadow = true
    group.add(wallL)
    
    const wallR = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.12, 2.0), leatherMat)
    wallR.position.set(0.74, 0.06, 0)
    wallR.castShadow = true
    group.add(wallR)
    
    const wallB = new THREE.Mesh(new THREE.BoxGeometry(1.46, 0.12, 0.02), leatherMat)
    wallB.position.set(0, 0.06, -0.99)
    wallB.castShadow = true
    group.add(wallB)
    
    const wallF = new THREE.Mesh(new THREE.BoxGeometry(1.46, 0.04, 0.02), leatherMat)
    wallF.position.set(0, 0.02, 0.99)
    wallF.castShadow = true
    group.add(wallF)

    return group
  }

  // Bottom Tray
  const trayBottom = buildTray()
  trayGroup.add(trayBottom)

  // Top Tray (raised and slightly back)
  const trayTop = buildTray()
  trayTop.position.set(0, 0.35, -0.15)
  trayGroup.add(trayTop)

  // Add some papers in the trays
  const paperInTray1 = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.01, 1.8), paperMat)
  paperInTray1.position.set(0, 0.015, 0.05)
  trayBottom.add(paperInTray1)

  const paperInTray2 = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.01, 1.8), paperMat)
  paperInTray2.position.set(0, 0.015, 0.05)
  trayTop.add(paperInTray2)

  // U-shaped curved gold brackets on left and right sides
  const buildBracket = (xPos: number) => {
    const bracket = new THREE.Group()
    bracket.position.set(xPos, 0.175, -0.075)
    
    // Top handle rod
    const topRod = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.5), goldMat)
    topRod.rotation.x = Math.PI / 2
    topRod.position.set(0, 0.175, 0)
    topRod.castShadow = true
    bracket.add(topRod)
    
    // Front vertical leg
    const legF = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.35), goldMat)
    legF.position.set(0, 0, 0.25)
    legF.castShadow = true
    bracket.add(legF)
    
    // Back vertical leg
    const legB = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.35), goldMat)
    legB.position.set(0, 0, -0.25)
    legB.castShadow = true
    bracket.add(legB)
    
    return bracket
  }
  trayGroup.add(buildBracket(-0.75))
  trayGroup.add(buildBracket(0.75))


  // 2. Double Pen Stand with Nameplate (Middle Top - parallel to desk mat)
  const penStandGroup = new THREE.Group()
  penStandGroup.position.set(0, -0.945, -2.4)
  penStandGroup.rotation.y = 0
  propsGroup.add(penStandGroup)
  hoverPenStandGroup = penStandGroup
  hoverBaseY.penStand = -0.945

  const standBase = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.04, 0.6), leatherMat)
  standBase.castShadow = true
  standBase.receiveShadow = true
  penStandGroup.add(standBase)

  // Gold nameplate with "SIMPLY" text
  const textCanvas = document.createElement('canvas')
  textCanvas.width = 256
  textCanvas.height = 64
  const textCtx = textCanvas.getContext('2d')
  if (textCtx) {
    textCtx.fillStyle = '#c49a45' // Muted gold base
    textCtx.fillRect(0, 0, 256, 64)
    textCtx.fillStyle = '#1e110c' // Dark brown text
    textCtx.font = 'bold 36px Georgia, serif'
    textCtx.textAlign = 'center'
    textCtx.textBaseline = 'middle'
    textCtx.fillText('SIMPLY', 128, 32)
  }
  const nameplateTex = new THREE.CanvasTexture(textCanvas)
  const nameplateMat = new THREE.MeshStandardMaterial({
    map: nameplateTex,
    roughness: 0.2,
    metalness: 0.9
  })

  const nameplate = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.18, 0.015), nameplateMat)
  nameplate.position.set(0, 0.11, 0)
  nameplate.rotation.x = -0.15
  nameplate.castShadow = true
  penStandGroup.add(nameplate)

  // Gold nameplate corners sparkles
  if (shadowFeatures.metallicGlints) {
    initFlareMaterial()
    if (glintMat) {
      const nameplateGlintL = new THREE.Sprite(glintMat)
      nameplateGlintL.scale.set(0.2, 0.2, 1.0)
      nameplateGlintL.position.set(-0.38, 0.14, 0.01)
      penStandGroup.add(nameplateGlintL)
      glintSprites.push(nameplateGlintL)

      const nameplateGlintR = new THREE.Sprite(glintMat)
      nameplateGlintR.scale.set(0.2, 0.2, 1.0)
      nameplateGlintR.position.set(0.38, 0.14, 0.01)
      penStandGroup.add(nameplateGlintR)
      glintSprites.push(nameplateGlintR)
    }
  }

  const nameplateBase = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.02, 0.15), goldMat)
  nameplateBase.position.set(0, 0.03, 0.05)
  penStandGroup.add(nameplateBase)

  // Two Gold Pen Holders & Pens (with detailed bi-color bodies)
  const penBodyMat = new THREE.MeshStandardMaterial({
    color: 0x111115, // Glossy black resin
    roughness: 0.15,
    metalness: 0.8
  })

  const buildPen = (xPos: number, rotZ: number) => {
    const holder = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.03, 0.12, 8), goldMat)
    holder.position.set(xPos, 0.07, 0)
    holder.rotation.set(0.1, 0, rotZ)
    holder.castShadow = true
    penStandGroup.add(holder)

    // Detailed Pen Group (combining black lower body, gold upper body, gold band, and gold clip)
    const penSubGroup = new THREE.Group()
    penSubGroup.position.set(xPos + rotZ * 0.25, 0.42, -0.05)
    penSubGroup.rotation.set(0.1, 0, rotZ)
    
    // Lower body (inserted into the holder)
    const lowerBody = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.008, 0.45, 8), penBodyMat)
    lowerBody.position.y = -0.15
    lowerBody.castShadow = true
    penSubGroup.add(lowerBody)

    // Upper body (cap/upper section sticking out)
    const upperBody = new THREE.Mesh(new THREE.CylinderGeometry(0.011, 0.01, 0.35, 8), goldMat)
    upperBody.position.y = 0.2
    upperBody.castShadow = true
    penSubGroup.add(upperBody)

    // Center Gold Accent Band
    const band = new THREE.Mesh(new THREE.CylinderGeometry(0.0115, 0.0115, 0.03, 8), goldMat)
    band.position.y = 0.01
    band.castShadow = true
    penSubGroup.add(band)

    // Pen Clip
    const clip = new THREE.Mesh(new THREE.BoxGeometry(0.003, 0.18, 0.008), goldMat)
    clip.position.set(0, 0.18, 0.012)
    clip.castShadow = true
    penSubGroup.add(clip)

    // Pen Tip (tapered point)
    const tip = new THREE.Mesh(new THREE.ConeGeometry(0.008, 0.06, 8), goldMat)
    tip.position.y = -0.38
    tip.rotation.x = Math.PI
    tip.castShadow = true
    penSubGroup.add(tip)

    penStandGroup.add(penSubGroup)

    // Register pen group for scroll inertia wobble physics
    wobblingPens.push({
      group: penSubGroup,
      baseRotX: 0.1,
      baseRotZ: rotZ,
      multiplier: 1.0
    })
  }
  buildPen(-0.6, -0.3)
  buildPen(0.6, 0.3)


  // 3. Square Note Holder (Right Side, Top - parallel to desk mat)
  const noteHolderGroup = new THREE.Group()
  noteHolderGroup.position.set(2.2, -0.945, -2.4)
  noteHolderGroup.rotation.y = 0
  propsGroup.add(noteHolderGroup)
  hoverNoteHolderGroup = noteHolderGroup
  hoverBaseY.noteHolder = -0.945

  const noteBottom = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.02, 0.8), leatherMat)
  noteBottom.receiveShadow = true
  noteBottom.castShadow = true
  noteHolderGroup.add(noteBottom)

  const noteWallL = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.16, 0.8), leatherMat)
  noteWallL.position.set(-0.39, 0.08, 0)
  noteWallL.castShadow = true
  noteHolderGroup.add(noteWallL)

  const noteWallR = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.16, 0.8), leatherMat)
  noteWallR.position.set(0.39, 0.08, 0)
  noteWallR.castShadow = true
  noteHolderGroup.add(noteWallR)

  const noteWallB = new THREE.Mesh(new THREE.BoxGeometry(0.76, 0.16, 0.02), leatherMat)
  noteWallB.position.set(0, 0.08, -0.39)
  noteWallB.castShadow = true
  noteHolderGroup.add(noteWallB)

  const noteWallF = new THREE.Mesh(new THREE.BoxGeometry(0.76, 0.04, 0.02), leatherMat)
  noteWallF.position.set(0, 0.02, 0.39)
  noteWallF.castShadow = true
  noteHolderGroup.add(noteWallF)

  // Paper stack inside note holder
  const notePaper = new THREE.Mesh(new THREE.BoxGeometry(0.74, 0.11, 0.74), paperMat)
  notePaper.position.set(0, 0.065, 0)
  noteHolderGroup.add(notePaper)


  // 4. Pen Cup Holder (Right Side, Bottom-ish - parallel to desk mat)
  const cupGroup = new THREE.Group()
  cupGroup.position.set(2.4, -0.945, -1.0)
  cupGroup.rotation.y = 0
  propsGroup.add(cupGroup)
  hoverCupGroup = cupGroup
  hoverBaseY.cup = -0.945

  const cupBottom = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.02, 0.6), leatherMat)
  cupBottom.receiveShadow = true
  cupBottom.castShadow = true
  cupGroup.add(cupBottom)

  const cupWallL = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.8, 0.6), leatherMat)
  cupWallL.position.set(-0.29, 0.4, 0)
  cupWallL.castShadow = true
  cupGroup.add(cupWallL)

  const cupWallR = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.8, 0.6), leatherMat)
  cupWallR.position.set(0.29, 0.4, 0)
  cupWallR.castShadow = true
  cupGroup.add(cupWallR)

  const cupWallB = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.8, 0.02), leatherMat)
  cupWallB.position.set(0, 0.4, -0.29)
  cupWallB.castShadow = true
  cupGroup.add(cupWallB)

  const cupWallF = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.8, 0.02), leatherMat)
  cupWallF.position.set(0, 0.4, 0.29)
  cupWallF.castShadow = true
  cupGroup.add(cupWallF)

  // Add 3 pens sticking out of the cup with highly realistic details (caps, clips, color schemes)
  // Lengthened and positioned to rest on the floor and lean heavily against the top corners/edges of the cup
  const buildCupPen = (xPos: number, yPos: number, zPos: number, xRot: number, zRot: number, bodyColor: number, trimMat: THREE.Material) => {
    const penSubGroup = new THREE.Group()
    penSubGroup.position.set(xPos, yPos, zPos)
    penSubGroup.rotation.set(xRot, 0, zRot)

    const matBody = new THREE.MeshStandardMaterial({
      color: bodyColor,
      roughness: 0.2,
      metalness: 0.7
    })

    // Lower pen body (inserted into cup) - Lengthened from 0.45 to 0.65 to touch the floor
    const lower = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.01, 0.65, 8), matBody)
    lower.position.y = -0.22
    lower.castShadow = true
    penSubGroup.add(lower)

    // Upper pen body (cap / upper section) - Lengthened from 0.3 to 0.4 to stick out of the cup
    const upper = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.015, 0.4, 8), matBody)
    upper.position.y = 0.3
    upper.castShadow = true
    penSubGroup.add(upper)

    // Accent Ring
    const band = new THREE.Mesh(new THREE.CylinderGeometry(0.0165, 0.0165, 0.02, 8), trimMat)
    band.position.y = 0.1
    band.castShadow = true
    penSubGroup.add(band)

    // Cap Crown (on top)
    const crown = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.012, 0.04, 8), trimMat)
    crown.position.y = 0.5
    crown.castShadow = true
    penSubGroup.add(crown)

    // Pen Clip - Lengthened to match longer cap
    const clip = new THREE.Mesh(new THREE.BoxGeometry(0.003, 0.22, 0.008), trimMat)
    clip.position.set(0, 0.32, 0.017)
    clip.castShadow = true
    penSubGroup.add(clip)

    cupGroup.add(penSubGroup)

    // Register pen group for scroll inertia wobble physics
    wobblingPens.push({
      group: penSubGroup,
      baseRotX: xRot,
      baseRotZ: zRot,
      multiplier: 1.6
    })
  }

  const silverMat = new THREE.MeshStandardMaterial({
    color: 0xcccccc,
    roughness: 0.2,
    metalness: 0.9
  })

  // Set pens to rest naturally against the cup floor and lean heavily outward against opposite corner rims
  buildCupPen(0.12, 0.45, 0.12, 0.45, -0.45, 0x111115, goldMat)    // Black & Gold Pen (leaning heavily front-right)
  buildCupPen(-0.10, 0.45, -0.10, -0.42, 0.42, 0x13223f, silverMat) // Navy & Silver Pen (leaning heavily back-left)
  buildCupPen(-0.10, 0.44, 0.10, 0.42, 0.42, 0x0f2c1c, goldMat)    // Forest Green & Gold Pen (leaning heavily front-left)
}

function createRoomEnvironment(parent: THREE.Object3D, goldMat: THREE.Material, _paperMat: THREE.Material) {
  const roomGroup = new THREE.Group()
  parent.add(roomGroup)

  const wallMat = new THREE.MeshStandardMaterial({
    color: 0x181a20, // Match room wall paint (dark elegant navy-grey)
    roughness: 0.95
  })

  // --- BACK WALL WITH FLOOR-TO-CEILING PENTHOUSE WINDOW VIEW ---
  // 1. Right portion of back wall (behind/enclosing the wooden cabinet)
  const backWallR = new THREE.Mesh(new THREE.BoxGeometry(9.0, 6.0, 0.2), wallMat)
  backWallR.position.set(3.5, 3.0, -5.9)
  backWallR.receiveShadow = true
  roomGroup.add(backWallR)

  // 2. Left portion of back wall next to window
  const backWallL = new THREE.Mesh(new THREE.BoxGeometry(2.0, 6.0, 0.2), wallMat)
  backWallL.position.set(-7.0, 3.0, -5.9)
  backWallL.receiveShadow = true
  roomGroup.add(backWallL)

  // 3. Solid Left Wall of the room
  const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.2, 6.0, 12.0), wallMat)
  leftWall.position.set(-8.0, 3.0, 0.1)
  leftWall.receiveShadow = true
  roomGroup.add(leftWall)

  // 4. Solid Right Wall of the room
  const rightWall = new THREE.Mesh(new THREE.BoxGeometry(0.2, 6.0, 12.0), wallMat)
  rightWall.position.set(8.0, 3.0, 0.1)
  rightWall.receiveShadow = true
  roomGroup.add(rightWall)

  // 5. Penthouse Window Glass Pane (Translucent physical glass with reflection)
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    roughness: 0.05,
    transmission: 0.90, // Highly transparent
    thickness: 0.15,
    ior: 1.52,
    transparent: true,
    opacity: 0.25,
    reflectivity: 1.0,
    clearcoat: 1.0,
    clearcoatRoughness: 0.05,
    envMapIntensity: 2.5, // Strong room reflection
  })
  const glass = new THREE.Mesh(new THREE.BoxGeometry(5.0, 6.0, 0.04), glassMat)
  glass.position.set(-3.5, 3.0, -5.9)
  roomGroup.add(glass)

  // 6. Night City Skyline Background Plane (aligned with window) - beautiful night view instead of yellow sunset
  const skylineTex = createNightSkylineTexture()
  const landscapeMat = new THREE.MeshBasicMaterial({
    map: skylineTex,
    color: 0x777777 // Dimmed slightly for quiet night sky backdrop
  })
  const landscapeGeom = new THREE.PlaneGeometry(12, 12)
  const landscape = new THREE.Mesh(landscapeGeom, landscapeMat)
  landscape.position.set(-3.5, 3.0, -6.8)
  roomGroup.add(landscape)

  // 7. Window Frame & Mullion Dividers
  const frameMat = new THREE.MeshStandardMaterial({ color: 0x111113, roughness: 0.5 })
  
  // Outer frame parts
  const frameL = new THREE.Mesh(new THREE.BoxGeometry(0.08, 6.0, 0.08), frameMat)
  frameL.position.set(-6.0, 3.0, -5.85)
  roomGroup.add(frameL)

  const frameR = new THREE.Mesh(new THREE.BoxGeometry(0.08, 6.0, 0.08), frameMat)
  frameR.position.set(-1.0, 3.0, -5.85)
  roomGroup.add(frameR)

  // Horizontal Mullions (Dividers to split the vertical window into panes)
  const mullionH1 = new THREE.Mesh(new THREE.BoxGeometry(5.0, 0.06, 0.06), frameMat)
  mullionH1.position.set(-3.5, 2.0, -5.85)
  roomGroup.add(mullionH1)

  const mullionH2 = new THREE.Mesh(new THREE.BoxGeometry(5.0, 0.06, 0.06), frameMat)
  mullionH2.position.set(-3.5, 4.0, -5.85)
  roomGroup.add(mullionH2)

  // Vertical Mullion (Divider) in the center of the window
  const mullionV = new THREE.Mesh(new THREE.BoxGeometry(0.06, 6.0, 0.06), frameMat)
  mullionV.position.set(-3.5, 3.0, -5.85)
  roomGroup.add(mullionV)

  // 8. Window Curtains (Drapes) framing the back window
  const curtainMat = new THREE.MeshStandardMaterial({
    color: 0x6e685f, // Neutral warm grey curtain
    roughness: 0.95
  })

  // Left Curtain column
  const curtainL = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 6.0, 12), curtainMat)
  curtainL.position.set(-5.8, 3.0, -5.7)
  curtainL.scale.x = 0.5 // flatten slightly
  curtainL.castShadow = false
  roomGroup.add(curtainL)

  // Right Curtain column
  const curtainR = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 6.0, 12), curtainMat)
  curtainR.position.set(-1.2, 3.0, -5.7)
  curtainR.scale.x = 0.5
  curtainR.castShadow = false
  roomGroup.add(curtainR)

  // 1. Executive Office Chair - Removed (as requested by user)


  // 2. Large Wooden Cabinet (ตู้เอกสารใบใหญ่ด้านหลัง) - Resized and shifted to the right
  const cabinetGroup = new THREE.Group()
  cabinetGroup.position.set(3.5, -0.95, -5.8)
  roomGroup.add(cabinetGroup)

  const cabinetWoodMat = new THREE.MeshStandardMaterial({
    color: 0x220c06, // Slightly darker mahogany wood
    roughness: 0.55,
    metalness: 0.05
  })

  // Cabinet Body (width 9.0)
  const body = new THREE.Mesh(new THREE.BoxGeometry(9.0, 3.2, 1.8), cabinetWoodMat)
  body.position.y = 1.6
  body.castShadow = true
  body.receiveShadow = true
  cabinetGroup.add(body)

  // Drawer faces and Gold Knobs (3 columns, 3 rows)
  const drawerGeom = new THREE.BoxGeometry(2.6, 0.8, 0.05)
  const handleGeom = new THREE.CylinderGeometry(0.012, 0.012, 0.16, 8)
  handleGeom.rotateZ(Math.PI / 2) // Make it horizontal

  const addDrawer = (x: number, y: number) => {
    const face = new THREE.Mesh(drawerGeom, cabinetWoodMat)
    face.position.set(x, y, 0.925)
    face.castShadow = true
    cabinetGroup.add(face)

    // Gold handle
    const handle = new THREE.Mesh(handleGeom, goldMat)
    handle.position.set(x, y, 0.97)
    handle.castShadow = true
    cabinetGroup.add(handle)
  }

  // Distribution of drawers
  const xCoords = [-2.8, 0, 2.8]
  const yCoords = [0.8, 1.8, 2.8]
  for (const x of xCoords) {
    for (const y of yCoords) {
      addDrawer(x, y)
    }
  }

  // --- CABINET TOP DECORATIONS & LIGHTING ---
  // 1. Cozy Table Lamp on top of the cabinet
  const lampGroup = new THREE.Group()
  lampGroup.position.set(-2.8, 3.2, 0.0) // On top of the cabinet, left side
  cabinetGroup.add(lampGroup)

  // Lamp base (Gold brass cylinder)
  const lampBaseGeom = new THREE.CylinderGeometry(0.18, 0.20, 0.06, 16)
  const lampBase = new THREE.Mesh(lampBaseGeom, goldMat)
  lampBase.position.y = 0.03
  lampBase.castShadow = true
  lampGroup.add(lampBase)

  // Lamp stem (Gold brass rod)
  const lampStemGeom = new THREE.CylinderGeometry(0.02, 0.02, 0.6, 8)
  const lampStem = new THREE.Mesh(lampStemGeom, goldMat)
  lampStem.position.y = 0.33
  lampStem.castShadow = true
  lampGroup.add(lampStem)

  // Lamp shade (Warm cream translucent cone)
  const lampShadeMat = new THREE.MeshPhysicalMaterial({
    color: 0xffe6c4,
    emissive: 0xff8833,
    emissiveIntensity: 0.8,
    roughness: 0.9,
    transmission: 0.6,
    thickness: 0.05,
    transparent: true,
    opacity: 0.95
  })
  const lampShadeGeom = new THREE.CylinderGeometry(0.22, 0.35, 0.38, 16)
  const lampShade = new THREE.Mesh(lampShadeGeom, lampShadeMat)
  lampShade.position.y = 0.70
  lampShade.castShadow = true
  lampGroup.add(lampShade)

  // Warm SpotLight inside the shade pointing downwards to light up the cabinet top, wall and curtains
  const cabinetLampLight = new THREE.SpotLight(0xffaa55, 20.0, 8.0, Math.PI / 2.5, 0.5, 1.0)
  cabinetLampLight.position.set(0, 0.70, 0)
  cabinetLampLight.castShadow = true
  cabinetLampLight.shadow.bias = -0.002
  cabinetLampLight.shadow.mapSize.width = 512
  cabinetLampLight.shadow.mapSize.height = 512
  lampGroup.add(cabinetLampLight)
  
  // Set Spotlight target a bit below the cabinet top
  const lampTarget = new THREE.Object3D()
  lampTarget.position.set(0, -1.0, 0)
  lampGroup.add(lampTarget)
  cabinetLampLight.target = lampTarget

  // 2. Stack of 2 decorative books on top of the cabinet (next to the lamp)
  const cabBookGroup = new THREE.Group()
  cabBookGroup.position.set(-1.6, 3.2, 0.2)
  cabBookGroup.rotation.y = 0.15
  cabinetGroup.add(cabBookGroup)

  const book1 = new THREE.Mesh(
    new THREE.BoxGeometry(0.6, 0.08, 0.8),
    new THREE.MeshStandardMaterial({ color: 0x4a2a1b, roughness: 0.7 })
  )
  book1.position.y = 0.04
  book1.castShadow = true
  book1.receiveShadow = true
  cabBookGroup.add(book1)

  const book2 = new THREE.Mesh(
    new THREE.BoxGeometry(0.55, 0.07, 0.75),
    new THREE.MeshStandardMaterial({ color: 0x1f3c2c, roughness: 0.8 })
  )
  book2.position.y = 0.115
  book2.rotation.y = -0.2
  book2.castShadow = true
  book2.receiveShadow = true
  cabBookGroup.add(book2)

  // 3. A sleek minimalist golden ring sculpture / vase on the right side of the cabinet top
  const vaseGroup = new THREE.Group()
  vaseGroup.position.set(2.8, 3.2, -0.1)
  cabinetGroup.add(vaseGroup)

  // Ceramic base
  const vaseBase = new THREE.Mesh(
    new THREE.CylinderGeometry(0.18, 0.25, 0.5, 16),
    new THREE.MeshPhysicalMaterial({ color: 0xdedede, roughness: 0.15, clearcoat: 0.8 })
  )
  vaseBase.position.y = 0.25
  vaseBase.castShadow = true
  vaseBase.receiveShadow = true
  vaseGroup.add(vaseBase)

  // Golden accent ring
  const vaseRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.16, 0.03, 8, 24),
    goldMat
  )
  vaseRing.position.y = 0.58
  vaseRing.rotation.y = Math.PI / 4
  vaseRing.castShadow = true
  vaseGroup.add(vaseRing)
}

const handleResize = () => {
  if (!canvasRef.value || !camera || !renderer) return
  const w = canvasRef.value.clientWidth
  const h = canvasRef.value.clientHeight
  camera.aspect = w / h
  camera.updateProjectionMatrix()
  renderer.setSize(w, h, false)
}

// ── Reverse transition: grid → cinematic ─────────────────────────────────────
// Called when the user scrolls UP past the very top of the grid page.
// Flashes white, restores the cinematic section, re-enables the ScrollTrigger,
// and positions scroll so the book appears fully open and ready to close.
// Computes gradual screen darkening during book zoom-in phase (from time 3.1 to 4.6 in timeline)
// Timeline duration is 4.6. Zoom-in starts at 3.1. Threshold is 0.95 (at 4.37s).
function getGradualDarkness(progress: number): number {
  const ZOOM_START = 3.1 / 4.6 // approx 0.6739
  const ZOOM_END = 0.95
  if (progress < ZOOM_START) return 0
  if (progress >= ZOOM_END) return 1
  const ratio = (progress - ZOOM_START) / (ZOOM_END - ZOOM_START)
  return Math.pow(ratio, 1.5) // Smooth eased darkening
}

// Flashes white, restores the cinematic section, re-enables the ScrollTrigger,
// and positions scroll so the book appears fully open and ready to close.
let reversingToIntro = false
let flashTriggered = false   // true once real-time white-fade starts (progress ≥ 0.58)

function skipIntro() {
  if (introComplete.value || flashTriggered) return
  flashTriggered = true
  if (lenis.value) lenis.value.stop()
  document.body.style.overflow = 'hidden'
  gsap.killTweensOf(flashOpacity)
  gsap.to(flashOpacity, {
    value: 1, duration: 1.2, ease: 'power1.inOut',
    onComplete: () => {
      introComplete.value = true
      emit('update:introComplete', true)
      requestAnimationFrame(() => {
        if (scrollTriggerInstance) scrollTriggerInstance.disable()
        cinematicHidden.value = true
        window.scrollTo(0, 0)
        if (lenis.value) lenis.value.scrollTo(0, { immediate: true })
        setTimeout(() => {
          if (lenis.value) lenis.value.start()
          document.body.style.overflow = ''
          gsap.to(flashOpacity, { value: 0, duration: 1.9, ease: 'power2.out' })
        }, 450)
      })
    }
  })
}

async function reverseToIntro() {
  if (!introComplete.value || reversingToIntro) return
  reversingToIntro = true

  // Stop Lenis smooth scroll and native scroll immediately to prevent scrolling during transition
  if (lenis.value) lenis.value.stop()
  document.body.style.overflow = 'hidden'

  // 1. Slowly fade in the dark overlay to cover the grid page smoothly
  gsap.killTweensOf(flashOpacity)
  gsap.to(flashOpacity, {
    value: 1,
    duration: 0.7, // Smooth 0.7s fade to dark
    ease: 'power2.inOut',
    onComplete: async () => {
      // Screen is now fully dark (#060810) — perform DOM swap behind the scenes

      // 2. Restore cinematic section and signal parent.
      flashTriggered = false          // allow flash to re-arm on next forward scroll
      cinematicHidden.value = false
      introComplete.value = false
      emit('update:introComplete', false)

      await nextTick()

      // 3. Scroll to just below the threshold so the book is fully open when revealed.
      //    ST end = "+=500%" → total scroll = 5 × innerHeight. At progress 0.90 the
      //    book is fully open and zoomed in — perfect re-entry point.
      const targetScroll = 0.90 * 5 * window.innerHeight
      window.scrollTo(0, targetScroll)
      if (lenis.value) {
        lenis.value.scrollTo(targetScroll, { immediate: true })
      }

      // 4. Re-enable the ScrollTrigger (was disabled, not killed).
      if (scrollTriggerInstance) {
        scrollTriggerInstance.enable()
        ScrollTrigger.refresh()
      }

      // Wait a small beat for the DOM and scroll position to fully settle
      setTimeout(() => {
        if (lenis.value) lenis.value.start()
        document.body.style.overflow = ''

        // 5. Fade overlay out to the matching scroll progress darkness — reveals the zoomed-in open book,
        //    allowing the user to scroll up naturally to zoom out and close it.
        const targetOpacity = getGradualDarkness(0.90)
        gsap.to(flashOpacity, {
          value: targetOpacity,
          duration: 1.1,
          ease: 'power2.out',
          onComplete: () => { reversingToIntro = false }
        })
      }, 200)
    }
  })
}

// Fires when user tries to scroll UP from scroll-position 0 (top of grid page).
function handleReverseWheel(e: WheelEvent) {
  if (!introComplete.value) return        // Already in cinematic
  if (window.scrollY > 10) return         // Not at the very top of grid
  if (e.deltaY >= 0) return               // Only upward scroll
  reverseToIntro()
}

onMounted(async () => {

  if (isMobile.value) return

  // Force native scroll to top BEFORE ScrollTrigger initializes.
  // Without this, if the user arrived from a scrolled page, GSAP will see
  // a non-zero scroll position, jump the timeline to progress ≥ 0.744 and
  // immediately hide the cinematic intro (looks like "going to another page").
  window.scrollTo(0, 0)

  await nextTick()
  if (!canvasRef.value) return

  // Expose reactive values for automated visual and state testing
  if (typeof window !== 'undefined') {
    (window as any).debugData = {
      flashOpacity,
      introComplete,
      scrollProgress,
      showFlash,
      getCamera: () => camera,
      getFolderGroup: () => folderGroup
    }
  }

  scene = new THREE.Scene()
  const envMap = createReflectionEnvMap()
  scene.environment = envMap

  // Container group for all room and desk physical elements (enables unified stage tilting)
  stageGroup = new THREE.Group()
  scene.add(stageGroup)
  
  let width = canvasRef.value.clientWidth
  let height = canvasRef.value.clientHeight
  if (width === 0 || height === 0) {
    width = window.innerWidth
    height = window.innerHeight
  }
  
  camera = new THREE.PerspectiveCamera(26, width / height, 0.1, 100)
  
  // Start with camera matching reference photo angle (front-left high angle, zoomed out to show room)
  // Zoomed in by 25% from 50% zoom-out (net 1.2x of original distance)
  camera.position.set(-2.96, 4.75, 8.20)
  camera.lookAt(cameraTarget)

  renderer = new THREE.WebGLRenderer({
    canvas: canvasRef.value,
    antialias: true,
    alpha: true,
    powerPreference: "default"   // allow iGPU on laptops — "high-performance" forced discrete GPU
  })
  renderer.setSize(width, height, false)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFShadowMap
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.0
  // Solid scene background — prevents alpha-transparent canvas from showing
  // the dark CSS body background as a "black border" at the top of the viewport
  // where no 3D geometry exists. Matches the portfolio page background colour.
  scene.background = new THREE.Color(0x060810)

  // Ambient fill: low warm ambient so the leaf/branch shadows stay visible and deep
  const ambientLight = new THREE.AmbientLight(0xfff6ed, 0.40)
  scene.add(ambientLight)

  // Window light: strong directional sun from the left window for dramatic contrast
  const windowLight = new THREE.DirectionalLight(0xfff7ec, 3.0)
  windowLight.position.set(-10.0, 3.2, -4.5)
  windowLight.castShadow = true
  // Ultra-high 4K shadow map for incredibly crisp and smooth shadows
  windowLight.shadow.mapSize.width = 4096
  windowLight.shadow.mapSize.height = 4096
  windowLight.shadow.camera.near = 1.0
  windowLight.shadow.camera.far = 25.0 // Increased to ensure shadows don't cut off on the right of the desk
  windowLight.shadow.camera.left = -10 // Expanded shadow bounds to match zoomed-out camera perspective
  windowLight.shadow.camera.right = 10
  windowLight.shadow.camera.top = 10
  windowLight.shadow.camera.bottom = -10
  windowLight.shadow.camera.updateProjectionMatrix() // Update shadow camera projection matrix
  windowLight.shadow.bias = -0.00005 // Tighter bias for finer details
  windowLight.shadow.radius = 1.3 // Crisper filter so the leaf/branch komorebi shapes read clearly on the desk
  scene.add(windowLight)
  scene.add(windowLight.target)
 
  // 2. Komorebi Filtered Light Fill (Warm green-gold soft light)
  if (shadowFeatures.komorebiFill) {
    komorebiLight = new THREE.DirectionalLight(0xdbe8b5, 0.20)
    komorebiLight.position.copy(windowLight.position)
    komorebiLight.castShadow = false
    scene.add(komorebiLight)
  }
 
  // 3. Subtle Warm Window Light (แสงอุ่นบางๆ สาดเข้าจากทางซ้ายตามแนวทิศทางของเงา)
  leftWarmSunLight = new THREE.DirectionalLight(0xff9944, 0.28) // Soft golden-amber glow
  leftWarmSunLight.position.copy(windowLight.position)
  leftWarmSunLight.castShadow = false
  scene.add(leftWarmSunLight)

  // Soft overhead spotlight: Subtle warm glow accent without casting clashing shadows (intensity boosted for zoomed out view)
  const spotLight = new THREE.SpotLight(0xffdfa9, 60.0)
  spotLight.position.set(3.0, 5.5, 3.0)
  spotLight.angle = Math.PI / 4.2
  spotLight.penumbra = 0.8
  spotLight.decay = 2.0
  spotLight.castShadow = false
  scene.add(spotLight)
  
  spotLight.target.position.set(0, -0.95, 0)
  scene.add(spotLight.target)

  // Soft cool-white front-right fill light (kept low so the left-window beam dominates)
  const dirLight = new THREE.DirectionalLight(0xd1d5db, 0.16)
  dirLight.position.set(3.0, 5.0, 4.0)
  scene.add(dirLight)

  // Cool blue-grey rim spotlight from back-left (intensity boosted for zoomed out view)
  const rimLight = new THREE.SpotLight(0x7fbfff, 70.0)
  rimLight.position.set(-4.5, 5.0, -3.0)
  rimLight.angle = Math.PI / 4.5
  rimLight.penumbra = 0.8
  rimLight.decay = 2.0
  rimLight.castShadow = false
  scene.add(rimLight)

  const textureLoader = new THREE.TextureLoader()
  
  const woodCol = createWoodTexture(false)
  const woodBump = createWoodTexture(true)
  woodCol.repeat.set(1.0, 1.0)
  woodBump.repeat.set(1.0, 1.0)
  
  // Enable maximum anisotropy for razor-sharp details at oblique viewing angles
  const maxAnisotropy = renderer.capabilities.getMaxAnisotropy()
  woodCol.anisotropy = maxAnisotropy
  woodBump.anisotropy = maxAnisotropy

  // Premium lacquered wood material with clearcoat gloss and glossy highlights
  const deskMat = new THREE.MeshPhysicalMaterial({
    map: woodCol,
    bumpMap: woodBump,
    bumpScale: 0.0018,
    roughnessMap: woodBump,    // Reuse woodBump as roughnessMap
    roughness: 0.8,
    metalness: 0.05,
    clearcoat: 1.0,            // Sharp polished protective varnish layer
    clearcoatRoughness: 0.08,  // Clear and crisp specular highlights
  })

  const leatherMatFront = new THREE.MeshStandardMaterial({
    roughness: 0.6,
    metalness: 0.15
  })
  textureLoader.load('/leather_folder_cover_cropped.png', (txt) => {
    leatherMatFront.map = txt
    
    // Process cover texture to generate leather bump, roughness, and metalness maps
    const img = txt.image
    if (img && img.width > 0 && img.height > 0) {
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.drawImage(img, 0, 0)
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const data = imgData.data
        
        const bumpCanvas = document.createElement('canvas')
        bumpCanvas.width = img.width
        bumpCanvas.height = img.height
        const bumpCtx = bumpCanvas.getContext('2d')
        
        const roughCanvas = document.createElement('canvas')
        roughCanvas.width = img.width
        roughCanvas.height = img.height
        const roughCtx = roughCanvas.getContext('2d')
        
        const metalCanvas = document.createElement('canvas')
        metalCanvas.width = img.width
        metalCanvas.height = img.height
        const metalCtx = metalCanvas.getContext('2d')
        
        if (bumpCtx && roughCtx && metalCtx) {
          const bumpData = bumpCtx.createImageData(img.width, img.height)
          const roughData = roughCtx.createImageData(img.width, img.height)
          const metalData = metalCtx.createImageData(img.width, img.height)
          
          for (let i = 0; i < data.length; i += 4) {
            const r = data[i]
            const g = data[i+1]
            const b = data[i+2]
            
            const lum = 0.299 * r + 0.587 * g + 0.114 * b
            const isMetal = lum > 95 // Gold text and stitches
            
            // 1. Height map (bumpMap)
            let height = lum
            if (!isMetal) {
              // Fine leather grain noise
              const grain = (Math.random() - 0.5) * 12
              height = Math.max(0, Math.min(255, height + grain))
            } else {
              height = Math.min(255, height + 25) // Emboss text
            }
            bumpData.data[i] = height
            bumpData.data[i+1] = height
            bumpData.data[i+2] = height
            bumpData.data[i+3] = 255
            
            // 2. Roughness map (Shiny text, matte leather)
            const rough = isMetal ? 38 : 190
            roughData.data[i] = rough
            roughData.data[i+1] = rough
            roughData.data[i+2] = rough
            roughData.data[i+3] = 255
            
            // 3. Metalness map (metallic text, non-metal leather)
            const metal = isMetal ? 242 : 0
            metalData.data[i] = metal
            metalData.data[i+1] = metal
            metalData.data[i+2] = metal
            metalData.data[i+3] = 255
          }
          
          bumpCtx.putImageData(bumpData, 0, 0)
          roughCtx.putImageData(roughData, 0, 0)
          metalCtx.putImageData(metalData, 0, 0)
          
          const bumpTex = new THREE.CanvasTexture(bumpCanvas)
          const roughTex = new THREE.CanvasTexture(roughCanvas)
          const metalTex = new THREE.CanvasTexture(metalCanvas)
          
          bumpTex.minFilter = THREE.LinearMipmapLinearFilter
          bumpTex.magFilter = THREE.LinearFilter
          roughTex.minFilter = THREE.LinearMipmapLinearFilter
          roughTex.magFilter = THREE.LinearFilter
          metalTex.minFilter = THREE.LinearMipmapLinearFilter
          metalTex.magFilter = THREE.LinearFilter
          
          leatherMatFront.bumpMap = bumpTex
          leatherMatFront.bumpScale = 0.003
          leatherMatFront.roughnessMap = roughTex
          leatherMatFront.metalnessMap = metalTex
        }
      }
    }
    leatherMatFront.needsUpdate = true
  })

  const paperMat = new THREE.MeshStandardMaterial({
    color: 0xfaf8f5,
    roughness: 0.85,
    metalness: 0.05
  })

  // Material for the edges of the pages to simulate sheet stack
  const pageEdgeMat = new THREE.MeshStandardMaterial({
    color: 0xe5e1d3, // Slightly darker warm page edge color
    roughness: 0.95,
    metalness: 0.0
  })

  const darkLeatherSides = new THREE.MeshStandardMaterial({ 
    color: 0x222224,
    roughness: 0.75 
  })

  // Desk Plane
  const deskGeom = new THREE.BoxGeometry(25, 0.5, 18)
  const deskMesh = new THREE.Mesh(deskGeom, deskMat)
  deskMesh.position.set(0, -1.2, 0)
  deskMesh.receiveShadow = true
  stageGroup.add(deskMesh)

  // Premium Leather Desk Pad under the book for added scene elements and depth
  const padCol = createDeskPadTexture()
  const padBump = createDeskPadBumpTexture()
  
  const padTopMat = new THREE.MeshPhysicalMaterial({
    map: padCol,
    bumpMap: padBump,
    bumpScale: 0.003,
    roughness: 0.55,
    metalness: 0.1,
    clearcoat: 0.35,            // Subtle glossy sheen matching premium desk pads
    clearcoatRoughness: 0.2
  })

  const padSideMat = new THREE.MeshStandardMaterial({
    color: 0x151516, // Match new charcoal black leather to eliminate dark frame look
    roughness: 0.75
  })

  const padMaterials = [
    padSideMat, // X+
    padSideMat, // X-
    padTopMat,  // Y+ (Top surface)
    padSideMat, // Y-
    padSideMat, // Z+
    padSideMat  // Z-
  ]

  const padGeom = new THREE.BoxGeometry(6.2, 0.015, 4.4) // Compact pad matching photo
  const padMesh = new THREE.Mesh(padGeom, padMaterials)
  padMesh.position.set(0.1, -0.9425, 0.2) // Sitting on the desk, shifted slightly forward
  padMesh.receiveShadow = true
  padMesh.castShadow = true
  stageGroup.add(padMesh)


  // Scattered background documents on the desk (partially under the folder)
  const docTex1 = createDocumentTexture(false)
  const docTex2 = createDocumentTexture(true)

  docTex1.anisotropy = maxAnisotropy
  docTex2.anisotropy = maxAnisotropy

  const bgPaperMatPlain = new THREE.MeshStandardMaterial({
    color: 0xfbf9f5,
    roughness: 0.9,
    metalness: 0.0
  })

  const bgPaper1Mat = new THREE.MeshPhysicalMaterial({
    map: docTex1,
    roughness: 0.85,
    metalness: 0.0,
    clearcoat: 0.05
  })

  const bgPaper2Mat = new THREE.MeshPhysicalMaterial({
    map: docTex2,
    roughness: 0.85,
    metalness: 0.0,
    clearcoat: 0.05
  })

  const bgPaper1Materials = [
    bgPaperMatPlain, // X+
    bgPaperMatPlain, // X-
    bgPaper1Mat,     // Y+ (Top surface with text)
    bgPaperMatPlain, // Y-
    bgPaperMatPlain, // Z+
    bgPaperMatPlain  // Z-
  ]

  const bgPaper2Materials = [
    bgPaperMatPlain, // X+
    bgPaperMatPlain, // X-
    bgPaper2Mat,     // Y+ (Top surface with text)
    bgPaperMatPlain, // Y-
    bgPaperMatPlain, // Z+
    bgPaperMatPlain  // Z-
  ]

  // Document 1 (left side)
  const bgPaper1Geom = new THREE.BoxGeometry(1.6, 0.002, 2.2)
  const bgPaper1 = new THREE.Mesh(bgPaper1Geom, bgPaper1Materials)
  bgPaper1.position.set(-2.2, -0.932, -0.4)
  bgPaper1.rotation.y = 0.28
  bgPaper1.receiveShadow = true
  bgPaper1.castShadow = true
  stageGroup.add(bgPaper1)

  // Document 2 (right side)
  const bgPaper2Geom = new THREE.BoxGeometry(1.5, 0.002, 2.0)
  const bgPaper2 = new THREE.Mesh(bgPaper2Geom, bgPaper2Materials)
  bgPaper2.position.set(2.0, -0.932, -0.8)
  bgPaper2.rotation.y = -0.32
  bgPaper2.receiveShadow = true
  bgPaper2.castShadow = true
  stageGroup.add(bgPaper2)

  // Premium Gold/Dark Resin Fountain Pen resting to the bottom right of the book
  const penGroup = new THREE.Group()
  penGroup.position.set(2.3, -0.932, 0.9) // Resting on the desk pad
  penGroup.rotation.set(0.08, -0.55, 0.04)
  stageGroup.add(penGroup)

  const bodyMat = new THREE.MeshStandardMaterial({
    color: 0x111115,
    roughness: 0.15,
    metalness: 0.8
  })
  const goldMat = new THREE.MeshStandardMaterial({
    color: 0xd4af37, // Gold
    roughness: 0.2,
    metalness: 0.95
  })

  // Pen Body
  const penBodyGeom = new THREE.CylinderGeometry(0.025, 0.02, 1.0, 12)
  const penBody = new THREE.Mesh(penBodyGeom, bodyMat)
  penBody.position.z = 0.0
  penBody.rotation.x = Math.PI / 2
  penBody.castShadow = true
  penBody.receiveShadow = true
  penGroup.add(penBody)

  // Pen Cap (posted on the back of the pen, z = -0.4)
  const penCapGeom = new THREE.CylinderGeometry(0.028, 0.028, 0.5, 12)
  const penCap = new THREE.Mesh(penCapGeom, goldMat)
  penCap.position.z = -0.4
  penCap.rotation.x = Math.PI / 2
  penCap.castShadow = true
  penCap.receiveShadow = true
  penGroup.add(penCap)

  // Gold Band ring on the cap edge
  const capBandGeom = new THREE.CylinderGeometry(0.029, 0.029, 0.03, 12)
  const capBand = new THREE.Mesh(capBandGeom, goldMat)
  capBand.position.z = -0.2
  capBand.rotation.x = Math.PI / 2
  capBand.castShadow = true
  penGroup.add(capBand)

  // Pen Clip
  const penClipGeom = new THREE.BoxGeometry(0.008, 0.008, 0.25)
  const penClip = new THREE.Mesh(penClipGeom, goldMat)
  penClip.position.set(0, 0.032, -0.4)
  penClip.castShadow = true
  penGroup.add(penClip)

  // Pen Grip Section (exposed when uncapped)
  const gripGeom = new THREE.CylinderGeometry(0.02, 0.016, 0.2, 12)
  const grip = new THREE.Mesh(gripGeom, bodyMat)
  grip.position.z = 0.6
  grip.rotation.x = Math.PI / 2
  grip.castShadow = true
  grip.receiveShadow = true
  penGroup.add(grip)

  // Gold Ring between body and grip
  const ringGeom = new THREE.CylinderGeometry(0.022, 0.022, 0.02, 12)
  const goldRing = new THREE.Mesh(ringGeom, goldMat)
  goldRing.position.z = 0.5
  goldRing.rotation.x = Math.PI / 2
  goldRing.castShadow = true
  penGroup.add(goldRing)

  // Black Ink Feed under the nib
  const feedGeom = new THREE.CylinderGeometry(0.008, 0.008, 0.08, 8)
  const feed = new THREE.Mesh(feedGeom, bodyMat)
  feed.position.set(0, -0.006, 0.74) // shifted slightly down
  feed.rotation.x = Math.PI / 2
  feed.castShadow = true
  penGroup.add(feed)

  // Pen Tip (Fountain Pen Gold Nib)
  const penTipGeom = new THREE.ConeGeometry(0.016, 0.12, 12)
  penTipGeom.rotateX(-Math.PI / 2)
  const penTip = new THREE.Mesh(penTipGeom, goldMat)
  penTip.position.z = 0.76
  penTip.castShadow = true
  penTip.receiveShadow = true
  penGroup.add(penTip)

  // Fountain pen gold nib sparkle
  if (shadowFeatures.metallicGlints) {
    initFlareMaterial()
    if (glintMat) {
      const penGlint = new THREE.Sprite(glintMat)
      penGlint.scale.set(0.18, 0.18, 1.0)
      penGlint.position.set(0, 0.015, 0.84) // Align with nib tip
      penGroup.add(penGlint)
      glintSprites.push(penGlint)
    }
  }

  // Add leather desk props to match the reference photo
  const propLeatherMat = new THREE.MeshStandardMaterial({
    color: 0x151516,
    roughness: 0.7,
    metalness: 0.1
  })
  createDeskProps(stageGroup, propLeatherMat, goldMat, paperMat)

  // Add room furniture, background cabinet, window and executive chair
  createRoomEnvironment(stageGroup, goldMat, paperMat)

  // 1. Volumetric Window Light Beam (ลำแสงแดดส่องจากหน้าต่าง)
  const beamGroup = new THREE.Group()
  beamGroup.position.set(-10.0, 3.2, -4.5) // Start at window directional light source
  stageGroup.add(beamGroup)

  const beamGeom = new THREE.CylinderGeometry(0.8, 2.6, 9.46, 16, 1, true) // Open-ended cone/cylinder
  beamGeom.translate(0, -9.46 / 2, 0) // Shift center to start pivot
  beamGeom.rotateX(Math.PI / 2) // Align with local Z axis

  const beamMat = new THREE.MeshBasicMaterial({
    color: 0xffe6c4, // Warm glowing sunlight haze
    transparent: true,
    opacity: 0.07, // Subtle, translucent volumetric effect
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
    depthWrite: false
  })
  const beamMesh = new THREE.Mesh(beamGeom, beamMat)
  beamGroup.add(beamMesh)
  beamGroup.lookAt(new THREE.Vector3(0, -0.95, 0.2)) // Aim directly at desk pad center

  // 2. Off-screen swaying leaves casting shadows (ใบไม้ไหวนอกหน้าต่างสั่นไหว)
  leafShadowGroup = new THREE.Group()
  leafShadowGroup.position.set(-5.5, 2.5, -0.5) // Base position (will be updated dynamically in tick)
  leafShadowGroup.rotation.set(0, 0, 0) // Kept vertical/default for beautiful, natural organic leaf shadows
  stageGroup.add(leafShadowGroup)

  const leafShapeMat = new THREE.MeshBasicMaterial({
    color: 0x000000,
    transparent: true,
    opacity: 0.0, // Invisible to camera but still casts shadows
    side: THREE.DoubleSide
  })

  // ═══════════════════════════════════════════════════════════════
  //  ORGANIC FRACTAL LEAF SHADOW SYSTEM  (natural tree silhouette)
  // ═══════════════════════════════════════════════════════════════

  // Jitter helper for organic randomness
  const jit = (scale: number) => (Math.random() - 0.5) * scale

  // Leaf shape: ovate-lanceolate with natural midrib asymmetry — realistic leaf silhouette
  const createLeafGeom = (): THREE.BufferGeometry => {
    const len  = 0.42 + Math.random() * 0.30   // 0.42–0.72 total length
    const wMax = 0.18 + Math.random() * 0.10   // 0.18–0.28 (premium leaf proportions)
    const asym = (Math.random() - 0.5) * 0.03  // subtle midrib shift

    const s = new THREE.Shape()
    s.moveTo(0, len * 0.50)  // pointed tip
    // Right lobe: widest ~35% from tip, then graceful taper to rounded base
    s.bezierCurveTo( wMax * 0.48 + asym,  len * 0.26,
                     wMax + asym,          len * 0.04,
                     wMax * 0.35 + asym,  -len * 0.38)
    s.bezierCurveTo( wMax * 0.10 + asym, -len * 0.49,
                     0.003,               -len * 0.50,
                     0,                   -len * 0.50)  // rounded base
    // Left lobe mirror
    s.bezierCurveTo(-0.003,                -len * 0.50,
                    -(wMax * 0.10 - asym), -len * 0.49,
                    -(wMax * 0.35 - asym), -len * 0.38)
    s.bezierCurveTo(-(wMax - asym),         len * 0.04,
                    -(wMax * 0.48 - asym),  len * 0.26,
                    0,                      len * 0.50)
    return new THREE.ShapeGeometry(s)
  }

  // Foliage placement helper: adds small secondary twigs + leaf clusters along a main branch
  const createFoliageOnCurve = (
    curve: THREE.Curve<THREE.Vector3>,
    startT: number,
    endT: number,
    parent: THREE.Group,
    twigLength: number,
    numTwigs: number
  ): void => {
    // 1. Draw the twigs
    for (let i = 0; i < numTwigs; i++) {
      const t = startT + (i / (numTwigs - 1 || 1)) * (endT - startT)
      const origin = curve.getPoint(t)
      const tangent = curve.getTangent(t)

      // Generate a twig growing outwards from the curve in the X-Z plane
      const angle = (i % 2 === 0 ? 1 : -1) * (0.5 + Math.random() * 0.3)
      const twigDir = new THREE.Vector3(
        tangent.x * Math.cos(angle) - tangent.z * Math.sin(angle),
        jit(0.12),
        tangent.x * Math.sin(angle) + tangent.z * Math.cos(angle)
      ).normalize()

      const twigCurve = new THREE.CatmullRomCurve3([
        origin,
        origin.clone().add(twigDir.clone().multiplyScalar(twigLength * 0.5)).add(new THREE.Vector3(jit(0.05), jit(0.04), jit(0.05))),
        origin.clone().add(twigDir.clone().multiplyScalar(twigLength)).add(new THREE.Vector3(jit(0.1), jit(0.06), jit(0.1)))
      ])

      const twigRadius = 0.012
      const twigGeom = new THREE.TubeGeometry(twigCurve, 8, twigRadius, 4, false)
      const twigMesh = new THREE.Mesh(twigGeom, leafShapeMat)
      twigMesh.castShadow = true
      parent.add(twigMesh)

      // Add leaf clusters along the twig
      const leafAttachPoints = 3
      for (let la = 0; la < leafAttachPoints; la++) {
        const lt = (la + 1) / leafAttachPoints
        const leafPos = twigCurve.getPoint(lt)
        const isTip = la === leafAttachPoints - 1
        const leavesCount = isTip ? 5 : 3 + Math.floor(Math.random() * 2)

        for (let l = 0; l < leavesCount; l++) {
          const pivot = new THREE.Group()
          pivot.position.copy(leafPos)
          const fanAngle = (l / leavesCount) * Math.PI * 2 + jit(0.4)
          const droop = 0.3 + Math.random() * 0.5
          const rotZ = jit(0.3)
          pivot.rotation.set(droop, fanAngle, rotZ)

          const leafScale = Math.max(0.65, 0.95 + jit(0.15))
          const leaf = new THREE.Mesh(createLeafGeom(), leafShapeMat)
          leaf.scale.setScalar(leafScale)
          leaf.rotation.x = -Math.PI * 0.25
          leaf.castShadow = true
          pivot.add(leaf)
          parent.add(pivot)

          // Store for leaf flutter animation
          leafFlutterPivots.push({
            group: pivot,
            baseRotX: droop,
            baseRotY: fanAngle,
            baseRotZ: rotZ,
            offset: Math.random() * Math.PI * 2
          })
        }
      }
    }

    // 2. Also add some leaves directly on the main curve for extra density
    const directLeaves = numTwigs * 3
    for (let i = 0; i < directLeaves; i++) {
      const t = startT + Math.random() * (endT - startT)
      const pos = curve.getPoint(t)

      const pivot = new THREE.Group()
      pivot.position.copy(pos)
      const fanAngle = Math.random() * Math.PI * 2
      const droop = 0.4 + Math.random() * 0.5
      const rotZ = jit(0.3)
      pivot.rotation.set(droop, fanAngle, rotZ)

      const leafScale = Math.max(0.7, 1.05 + jit(0.15))
      const leaf = new THREE.Mesh(createLeafGeom(), leafShapeMat)
      leaf.scale.setScalar(leafScale)
      leaf.rotation.x = -Math.PI * 0.25
      leaf.castShadow = true
      pivot.add(leaf)
      parent.add(pivot)

      // Store for leaf flutter animation
      leafFlutterPivots.push({
        group: pivot,
        baseRotX: droop,
        baseRotY: fanAngle,
        baseRotZ: rotZ,
        offset: Math.random() * Math.PI * 2
      })
    }
  }

  // ═══════════════════════════════════════════════════════════════
  //  USER'S HAND-DRAWN BRANCH PATH LAYOUT SYSTEM (Nodal Geometry)
  // ═══════════════════════════════════════════════════════════════

  // SYSTEM 1: MAIN TREE BRANCH SYSTEM (from left, across book to right)
  // 1. Main Trunk (stretched further left and thickened)
  const curveTrunk = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-3.8, 0.00, 0.40),
    new THREE.Vector3(-2.32, 0.04, 0.13),
    new THREE.Vector3(-0.84, 0.08, -0.13),
  ])

  // 2. Branch 1 (Upper Left Branch curving up onto top-middle of the book)
  const curveBranch1 = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.84, 0.08, -0.13),
    new THREE.Vector3(-0.30, 0.14, -0.45),
    new THREE.Vector3( 0.14, 0.18, -0.68),
    new THREE.Vector3( 0.63, 0.22, -0.83),
  ])

  // 3. Branch 2 (Lower Left Branch curving down onto bottom-middle of the book)
  const curveBranch2 = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.84, 0.08, -0.13),
    new THREE.Vector3(-0.45, 0.12,  0.45),
    new THREE.Vector3(-0.07, 0.16,  0.85),
    new THREE.Vector3( 0.28, 0.20,  1.14),
  ])

  // 4. Branch 3 (Middle Branch going across the middle of the book)
  const curveBranch3 = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.84, 0.08, -0.13),
    new THREE.Vector3(-0.25, 0.10, -0.12),
    new THREE.Vector3( 0.25, 0.11, -0.06),
    new THREE.Vector3( 0.77, 0.12, -0.13),
  ])

  // 5. Sub-Branch 3a (Upper Right Branch towards the pen holder)
  const curveSub3a = new THREE.CatmullRomCurve3([
    new THREE.Vector3( 0.77, 0.12, -0.13),
    new THREE.Vector3( 1.25, 0.15, -0.40),
    new THREE.Vector3( 1.76, 0.18, -0.69),
  ])

  // 6. Sub-Branch 3b (Lower Right Branch towards the bottom right)
  const curveSub3b = new THREE.CatmullRomCurve3([
    new THREE.Vector3( 0.77, 0.12, -0.13),
    new THREE.Vector3( 1.60, 0.15,  0.30),
    new THREE.Vector3( 2.46, 0.18,  0.72),
  ])


  // SYSTEM 2: LEFT-BOTTOM BRANCH SYSTEM (climbing from bottom-left of left paper)
  // 1. LB Trunk: (stretched further left and thickened)
  const curveLBTrunk = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-2.20, 0.00, 1.30),
    new THREE.Vector3(-1.80, 0.02, 0.76),
    new THREE.Vector3(-1.41, 0.04, 0.22),
  ])

  // 2. LB Branch A: from node (-1.41, 0.04, 0.22) to upper node (-1.34, 0.08, -0.27)
  const curveLBBranchA = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-1.41, 0.04, 0.22),
    new THREE.Vector3(-1.37, 0.06, -0.02),
    new THREE.Vector3(-1.34, 0.08, -0.27),
  ])

  // 3. LB Twig A1 (Upper Left Twig)
  const curveLBTwigA1 = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-1.34, 0.08, -0.27),
    new THREE.Vector3(-1.44, 0.10, -0.48),
    new THREE.Vector3(-1.55, 0.12, -0.69),
  ])

  // 4. LB Twig A2 (Upper Middle Twig)
  const curveLBTwigA2 = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-1.34, 0.08, -0.27),
    new THREE.Vector3(-1.27, 0.10, -0.44),
    new THREE.Vector3(-1.20, 0.12, -0.62),
  ])

  // 5. LB Twig A3 (Upper Right Twig towards book edge)
  const curveLBTwigA3 = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-1.34, 0.08, -0.27),
    new THREE.Vector3(-1.09, 0.10, -0.30),
    new THREE.Vector3(-0.84, 0.12, -0.34),
  ])

  // 6. LB Twig B1 (Lower Left Twig)
  const curveLBTwigB1 = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-1.41, 0.04, 0.22),
    new THREE.Vector3(-1.62, 0.06, 0.64),
    new THREE.Vector3(-1.83, 0.08, 1.07),
  ])

  // 7. LB Twig B2 (Lower Right Twig)
  const curveLBTwigB2 = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-1.41, 0.04, 0.22),
    new THREE.Vector3(-1.44, 0.06, 0.82),
    new THREE.Vector3(-1.48, 0.08, 1.42),
  ])


  // Build the branch tubes with natural tapering
  const addTube = (curve: THREE.Curve<THREE.Vector3>, radius: number) => {
    const geom = new THREE.TubeGeometry(curve, 25, radius, 8, false)
    const mesh = new THREE.Mesh(geom, leafShapeMat)
    mesh.castShadow = true // Enabled shadow-casting on branch/trunk tubes to project shadows matching the red lines
    leafShadowGroup.add(mesh)
  }

  // Render System 1 Tubes (Main Trunk thickened to 0.08)
  addTube(curveTrunk, 0.08)
  addTube(curveBranch1, 0.045)
  addTube(curveBranch2, 0.045)
  addTube(curveBranch3, 0.05)
  addTube(curveSub3a, 0.03)
  addTube(curveSub3b, 0.03)

  // Render System 2 Tubes (LB Trunk thickened to 0.06)
  addTube(curveLBTrunk, 0.06)
  addTube(curveLBBranchA, 0.04)
  addTube(curveLBTwigA1, 0.025)
  addTube(curveLBTwigA2, 0.025)
  addTube(curveLBTwigA3, 0.025)
  addTube(curveLBTwigB1, 0.025)
  addTube(curveLBTwigB2, 0.025)

  // Add twigs and leaf clusters to System 1
  createFoliageOnCurve(curveBranch1, 0.2, 1.0, leafShadowGroup, 0.45, 3)
  createFoliageOnCurve(curveBranch2, 0.2, 1.0, leafShadowGroup, 0.45, 3)
  createFoliageOnCurve(curveBranch3, 0.3, 0.9, leafShadowGroup, 0.35, 1)
  createFoliageOnCurve(curveSub3a, 0.1, 1.0, leafShadowGroup, 0.40, 2)
  createFoliageOnCurve(curveSub3b, 0.1, 1.0, leafShadowGroup, 0.45, 3)

  // Add twigs and leaf clusters to System 2
  createFoliageOnCurve(curveLBTwigA1, 0.3, 1.0, leafShadowGroup, 0.40, 2)
  createFoliageOnCurve(curveLBTwigA2, 0.3, 1.0, leafShadowGroup, 0.40, 2)
  createFoliageOnCurve(curveLBTwigA3, 0.3, 1.0, leafShadowGroup, 0.40, 2)
  createFoliageOnCurve(curveLBTwigB1, 0.3, 1.0, leafShadowGroup, 0.40, 2)
  createFoliageOnCurve(curveLBTwigB2, 0.3, 1.0, leafShadowGroup, 0.40, 2)

  // 3. Floating Dust Particles System (ฝุ่นละอองปลิวว่อน)
  const particleGeom = new THREE.BufferGeometry()
  dustPositions = new Float32Array(particleCount * 3)
  dustSpeeds = new Float32Array(particleCount * 3)
  const dustColors = new Float32Array(particleCount * 3)

  let particleSeed = 12345
  const prng = () => {
    particleSeed = (particleSeed * 1664525 + 1013904223) % 4294967296
    return particleSeed / 4294967296
  }

  for (let i = 0; i < particleCount; i++) {
    dustPositions[i * 3] = (prng() - 0.5) * 10.0 // x
    dustPositions[i * 3 + 1] = (prng() - 0.5) * 4.0 + 1.0 // y (from -1 to 3)
    dustPositions[i * 3 + 2] = (prng() - 0.5) * 8.0 // z

    dustSpeeds[i * 3] = (prng() - 0.5) * 0.003
    dustSpeeds[i * 3 + 1] = prng() * 0.0015 + 0.0008 // Rise slowly
    dustSpeeds[i * 3 + 2] = (prng() - 0.5) * 0.003

    // Default color: dim white
    dustColors[i * 3] = 0.5
    dustColors[i * 3 + 1] = 0.5
    dustColors[i * 3 + 2] = 0.5
  }

  particleGeom.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3))
  particleGeom.setAttribute('color', new THREE.BufferAttribute(dustColors, 3))

  // Soft glowing white circular particle canvas texture
  const pCanvas = document.createElement('canvas')
  pCanvas.width = 16
  pCanvas.height = 16
  const pCtx = pCanvas.getContext('2d')
  if (pCtx) {
    const pGrad = pCtx.createRadialGradient(8, 8, 0, 8, 8, 8)
    pGrad.addColorStop(0, 'rgba(255, 248, 235, 1.0)') // Warm core
    pGrad.addColorStop(0.3, 'rgba(255, 248, 235, 0.8)')
    pGrad.addColorStop(1.0, 'rgba(255, 248, 235, 0.0)')
    pCtx.fillStyle = pGrad
    pCtx.fillRect(0, 0, 16, 16)
  }
  const pTex = new THREE.CanvasTexture(pCanvas)

  const particleMat = new THREE.PointsMaterial({
    vertexColors: true, // Use vertex colors for volumetric glow
    size: 0.08,
    map: pTex,
    transparent: true,
    opacity: 0.7,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  })

  dustParticles = new THREE.Points(particleGeom, particleMat)
  stageGroup.add(dustParticles)

  // Book Main Group - raised slightly to sit perfectly on top of pad
  folderGroup = new THREE.Group()
  folderGroup.position.set(-1.25, 0.025, 0) // เลื่อนตำแหน่งสมุดตามความกว้างใหม่ 2.4 (กึ่งกลางคือ 1.20 และขอบปกคือ 1.25)
  stageGroup.add(folderGroup)

  // Spine Cylinder (Morphs from thick closed spine to thin open spine)
  const spineGeom = new THREE.CylinderGeometry(0.02, 0.02, 3.0, 16)
  spineGeom.rotateX(Math.PI / 2)
  const spineMesh = new THREE.Mesh(spineGeom, darkLeatherSides)
  spineMesh.position.set(0, -0.88, 0) // Start at Y = -0.88 (center of the closed stack)
  spineMesh.scale.set(3.2, 3.2, 1.0)  // Start scaled up to look like a thick spine
  folderGroup.add(spineMesh)

  // Back Cover (Static at bottom of right page, thickness 0.02)
  const backCoverGeom = new THREE.BoxGeometry(2.5, 0.02, 3.0) // ขยายหน้าปกให้กว้างขึ้นจาก 2.2 เป็น 2.5
  const backCoverMaterials = [
    darkLeatherSides, // X+
    darkLeatherSides, // X-
    paperMat,         // Y+
    leatherMatFront,  // Y-
    darkLeatherSides, // Z+
    darkLeatherSides  // Z-
  ]
  const backCover = new THREE.Mesh(backCoverGeom, backCoverMaterials)
  backCover.position.set(1.25, -0.94, 0) // เลื่อนตำแหน่งขอบขวาให้สมดุล (ครึ่งหนึ่งของ 2.5)
  backCover.receiveShadow = true
  backCover.castShadow = false // ปิดเพื่อแก้ปัญหาเงาดำเป็นแท่งแนวตั้งข้างสันหนังสือ
  folderGroup.add(backCover)

  // Render 10 right static sheets of paper (stacking on top of back cover)
  for (let j = 0; j < 10; j++) {
    // Jitter size and position slightly to make the paper edges look organic and individual
    const wJitter = 2.4 + (Math.random() - 0.5) * 0.015 // ขยายหน้ากระดาษจาก 2.1 เป็น 2.4 เพื่อให้เปิดกว้างขึ้น (Wide)
    const hJitter = 2.9 + (Math.random() - 0.5) * 0.015
    const xJitter = 1.20 + (Math.random() - 0.5) * 0.006 // ครึ่งหนึ่งของความกว้าง 2.4
    const zJitter = 0 + (Math.random() - 0.5) * 0.006

    const sheetGeom = new THREE.BoxGeometry(wJitter, 0.003, hJitter)
    const sheetMaterials = [
      pageEdgeMat, // X+
      pageEdgeMat, // X-
      paperMat,    // Y+
      paperMat,    // Y-
      pageEdgeMat, // Z+
      pageEdgeMat  // Z-
    ]
    const sheetMesh = new THREE.Mesh(sheetGeom, sheetMaterials)
    sheetMesh.position.set(xJitter, -0.93 + (j + 0.5) * 0.003, zJitter)
    sheetMesh.castShadow = false // Disable sheet castShadow to eliminate vertical shadow stripe next to spine
    sheetMesh.receiveShadow = true
    folderGroup.add(sheetMesh)
  }

  // 12 Flipping Pages
  for (let i = 0; i < 12; i++) {
    const data = pagesData[i]
    const frontTex = createPageTexture(i * 2 + 1, data.title, data.color, false)
    const backTex = createPageTexture(i * 2 + 2, data.title, data.color, true)
    
    const frontPageMat = new THREE.MeshStandardMaterial({
      map: frontTex,
      roughness: 0.85,
      metalness: 0.05
    })
    const backPageMat = new THREE.MeshStandardMaterial({
      map: backTex,
      roughness: 0.85,
      metalness: 0.05
    })

    const pageMaterials = [
      pageEdgeMat,  // X+
      pageEdgeMat,  // X-
      frontPageMat, // Y+
      backPageMat,  // Y-
      pageEdgeMat,  // Z+
      pageEdgeMat   // Z-
    ]

    const wJitter = 2.4 + (Math.random() - 0.5) * 0.012 // ขยายหน้ากระดาษพับจาก 2.1 เป็น 2.4 เพื่อให้เปิดกว้างขึ้น (Wide)
    const hJitter = 2.9 + (Math.random() - 0.5) * 0.012
    const xJitter = wJitter / 2 + (Math.random() - 0.5) * 0.004
    const zJitter = 0 + (Math.random() - 0.5) * 0.004

    const pageGeom = new THREE.BoxGeometry(wJitter, 0.003, hJitter, 30, 1, 15)
    
    // Store initial vertex positions and sizes for real-time mathematical bending
    const posAttr = pageGeom.attributes.position
    const count = posAttr.count
    const initialPositions = new Float32Array(count * 3)
    for (let j = 0; j < count * 3; j++) {
      initialPositions[j] = posAttr.array[j]
    }
    pageGeom.userData = {
      initialPositions,
      wJitter,
      hJitter
    }

    const pageGroup = new THREE.Group()
    const pivotYClosed = -0.90 + (11 - i + 0.5) * 0.003
    pageGroup.position.set(0, pivotYClosed, zJitter)
    
    const pageMesh = new THREE.Mesh(pageGeom, pageMaterials)
    pageMesh.position.set(xJitter, 0, 0)
    pageMesh.castShadow = false // Disable page castShadow to eliminate vertical shadow stripe next to spine
    pageMesh.receiveShadow = true
    
    pageGroup.add(pageMesh)
    folderGroup.add(pageGroup)
    pageGroups.push(pageGroup)
    pageMeshes.push(pageMesh)
  }

  // Front Cover Group (Pivot at 0, -0.824, 0 when closed)
  frontCoverGroup = new THREE.Group()
  frontCoverGroup.position.set(0, -0.824, 0)
  folderGroup.add(frontCoverGroup)

  const coverGeom = new THREE.BoxGeometry(2.5, 0.02, 3.0) // ขยายหน้าปกให้กว้างขึ้นจาก 2.2 เป็น 2.5
  const coverMaterials = [
    darkLeatherSides, // X+
    darkLeatherSides, // X-
    leatherMatFront,  // Y+
    paperMat,         // Y-
    darkLeatherSides, // Z+
    darkLeatherSides  // Z-
  ]
  const coverMesh = new THREE.Mesh(coverGeom, coverMaterials)
  coverMesh.position.set(1.25, 0, 0) // เลื่อนตำแหน่งขอบซ้ายให้สมดุล (ครึ่งหนึ่งของ 2.5)
  coverMesh.castShadow = false // ปิดเพื่อแก้ปัญหาเงาดำเป็นแท่งแนวตั้งข้างสันหนังสือ
  coverMesh.receiveShadow = true
  frontCoverGroup.add(coverMesh)

  // Render 10 left static sheets of paper (attached inside front cover group)
  for (let k = 0; k < 10; k++) {
    const wJitter = 2.4 + (Math.random() - 0.5) * 0.015 // ขยายหน้ากระดาษซ้ายจาก 2.1 เป็น 2.4 เพื่อความกว้างกว้างขึ้น
    const hJitter = 2.9 + (Math.random() - 0.5) * 0.015
    const xJitter = 1.20 + (Math.random() - 0.5) * 0.006 // ครึ่งหนึ่งของความกว้าง 2.4
    const zJitter = 0 + (Math.random() - 0.5) * 0.006

    const sheetGeom = new THREE.BoxGeometry(wJitter, 0.003, hJitter)
    const sheetMaterials = [
      pageEdgeMat, // X+
      pageEdgeMat, // X-
      paperMat,    // Y+
      paperMat,    // Y-
      pageEdgeMat, // Z+
      pageEdgeMat  // Z-
    ]
    const sheetMesh = new THREE.Mesh(sheetGeom, sheetMaterials)
    sheetMesh.position.set(xJitter, -0.01 - (k + 0.5) * 0.003, zJitter)
    sheetMesh.castShadow = false // Disable sheet castShadow to eliminate vertical shadow stripe next to spine
    sheetMesh.receiveShadow = true
    frontCoverGroup.add(sheetMesh)
  }

  // Scroll Timeline
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: cinematicRootRef.value,
      start: "top top",
      end: "+=500%",
      scrub: 1.3,
      pin: true,
      anticipatePin: 1,
      fastScrollEnd: true,
      onUpdate: (self) => {
        scrollProgress.value = self.progress
        emit("update:scrollProgress", self.progress)

        // ── Real-time transition gate ─────────────────────────────────────────
        // FLASH_TRIGGER ≈ when camera has fully zoomed into the paper.
        // Crossing it starts a real-time (not scrub-speed) fade to the grid background color.
        const FLASH_TRIGGER = 0.95

        if (self.progress >= FLASH_TRIGGER && !flashTriggered && !introComplete.value) {
          skipIntro()

        } else if (self.progress < FLASH_TRIGGER && flashTriggered && !introComplete.value) {
          // ── Scrolled back before transition finished → cancel and fade out ─────
          flashTriggered = false
          gsap.killTweensOf(flashOpacity)
          const targetOpacity = getGradualDarkness(self.progress)
          gsap.to(flashOpacity, { value: targetOpacity, duration: 0.6, ease: 'power2.out' })
        }

        // Apply gradual darkening if not in active transition
        if (!flashTriggered && !reversingToIntro) {
          flashOpacity.value = getGradualDarkness(self.progress)
        }

        if (!introComplete.value) {
          emit('update:introComplete', false)
        }
      }
    }
  })

  scrollTriggerInstance = tl.scrollTrigger || null

  // Refresh all ScrollTrigger instances so pin spacer heights are calculated
  // against the current (top = 0) scroll position, preventing timeline from
  // firing at a wrong progress value on first mount.
  ScrollTrigger.refresh()

  // SCENE 1 -> SCENE 2: Camera rotates to top-down 90 deg, camera up vector animates, and title fades
  tl.to(camera.position, {
    x: 0,
    y: 7.10, // Zoomed in 15% more (was 8.35)
    z: 0.001,
    duration: 1.0,
    ease: "power1.inOut"
  }, 0)

  // Dynamic light shifts: Animate lights in sync with camera angle to create realistic moving shadows & specular reflections
  tl.to(windowLight.position, {
    x: -5.0,
    y: 5.5,
    z: 0.5,
    duration: 1.0,
    ease: "power1.inOut"
  }, 0)

  tl.to(spotLight.position, {
    x: 1.5,
    y: 6.0,
    z: 2.0,
    duration: 1.0,
    ease: "power1.inOut"
  }, 0)

  tl.to(cameraTarget, {
    x: 0,
    y: -0.95,
    z: 0,
    duration: 1.0,
    ease: "power1.inOut"
  }, 0)

  tl.to(camera.up, {
    x: 0,
    y: 0,
    z: -1, // Rotate camera up-vector to orient the book vertically
    duration: 1.0,
    ease: "power1.inOut"
  }, 0)

  tl.to(titleStyleVals.value, {
    opacity: 0,
    scale: 0.82,
    yPercent: -20,
    duration: 0.85,
    ease: "power1.inOut"
  }, 0)

  // Morph spine position and scale to lie flat between covers
  tl.to(spineMesh.position, {
    y: -0.94,
    duration: 1.0,
    ease: "power1.inOut"
  }, 1.0)

  tl.to(spineMesh.scale, {
    x: 1.0,
    y: 1.0,
    z: 1.0,
    duration: 1.0,
    ease: "power1.inOut"
  }, 1.0)

  // Center the folderGroup as it opens
  tl.to(folderGroup.position, {
    x: 0,
    duration: 1.0,
    ease: "power2.inOut"
  }, 1.0)

  // Camera zooms in progressively during the page flips to show more details
  tl.to(camera.position, {
    x: 0,
    y: 5.27, // Zoomed in 15% more (was 6.2)
    z: 0.001,
    duration: 1.7, // Slower, progressive zoom-in
    ease: "power1.inOut"
  }, 1.3) // Starts at 1.3 when page flips begin

  // Slowly shift the windowLight and spotLight during page flips for rich organic depth
  tl.to(windowLight.position, {
    x: -4.0,
    y: 5.8,
    z: 1.2,
    duration: 1.7,
    ease: "power1.inOut"
  }, 1.3)

  tl.to(spotLight.position, {
    x: 0.5,
    y: 6.2,
    z: 1.0,
    duration: 1.7,
    ease: "power1.inOut"
  }, 1.3)

  // Front Cover opens to the left (Z rotation swings open to Math.PI)
  tl.to(frontCoverGroup.rotation, {
    z: Math.PI,
    duration: 1.0,
    ease: "power1.inOut"
  }, 1.0)

  // Lower front cover pivot Y to rest cover flat on desk when open
  tl.to(frontCoverGroup.position, {
    y: -0.94,
    duration: 1.0,
    ease: "power1.inOut"
  }, 1.0)

  // 12 Pages flip in staggered sequence
  pageGroups.forEach((pageGroup, i) => {
    const startTime = 1.3 + i * 0.11
    const pivotYClosed = -0.90 + (11 - i + 0.5) * 0.003
    const pivotYOpen = -0.90 + (i + 0.5) * 0.003

    // Flip page
    tl.to(pageGroup.rotation, {
      z: Math.PI,
      duration: 0.8,
      ease: "power1.inOut"
    }, startTime)

    // Lift and land page to simulate realistic page arch
    tl.to(pageGroup.position, {
      y: Math.max(pivotYClosed, pivotYOpen) + 0.15,
      duration: 0.4,
      ease: "power1.out"
    }, startTime)

    // Lower page back to target stack height
    tl.to(pageGroup.position, {
      y: pivotYOpen,
      duration: 0.4,
      ease: "power1.in"
    }, startTime + 0.4)
  })

  // SCENE 3 -> SCENE 4: Zoom into the right page stack deeply
  // We zoom into x = 1.20 (the center of the right page stack)
  tl.to(camera.position, {
    x: 1.20, // เปลี่ยนค่าจุดซูมขวาตามขนาดหน้าใหม่ 2.4 (กึ่งกลางคือ 1.20)
    y: 0.27, // Deep zoom so the paper fills the screen — 15% closer (was 0.32)
    z: 0.001,
    duration: 1.5, // Increased from 0.8s to 1.5s for a longer, smoother zoom scroll
    ease: "power2.inOut"
  }, 3.1) // Started earlier (3.1 instead of 3.4) to eliminate the static pause

  // Zoom light in closer to the pages during deep zoom to highlight the paper texture details
  tl.to(windowLight.position, {
    x: -2.0,
    y: 4.5,
    z: 2.5,
    duration: 1.5,
    ease: "power2.inOut"
  }, 3.1)

  tl.to(cameraTarget, {
    x: 1.20, // เปลี่ยนเป้าหมายขวาตามขนาดหน้าใหม่ 2.4 (กึ่งกลางคือ 1.20)
    y: -0.95,
    z: 0,
    duration: 1.5,
    ease: "power2.inOut"
  }, 3.1)



  // NOTE: flash (flashOpacity) is NOT in the scrub timeline.
  // A scrub-driven fade means scroll speed = flash speed → "instant flash" if
  // scrolling fast. Instead, the fade is triggered as a real-time tween from
  // onUpdate when progress crosses FLASH_TRIGGER_PROGRESS (see below).

  // Function to deform pages in real-time to create a smooth, wavy paper-like bending transition
  function updatePageBends() {
    if (isMobile.value || introComplete.value) return

    for (let i = 0; i < pageGroups.length; i++) {
      const group = pageGroups[i]
      const mesh = pageMeshes[i]
      if (!group || !mesh) continue

      const theta = group.rotation.z
      
      // If page is fully closed (0) or fully open (PI), keep it perfectly flat
      if (theta <= 0.0001 || theta >= Math.PI - 0.0001) {
        if (mesh.userData.isFlat) {
          continue
        }
        const geom = mesh.geometry
        const posAttr = geom.attributes.position
        const initialPos = geom.userData.initialPositions
        if (initialPos) {
          const count = posAttr.count
          for (let j = 0; j < count * 3; j++) {
            posAttr.array[j] = initialPos[j]
          }
          posAttr.needsUpdate = true
          geom.computeVertexNormals()
        }
        mesh.userData.isFlat = true
        continue
      }

      mesh.userData.isFlat = false

      const progress = theta / Math.PI
      const geom = mesh.geometry
      const posAttr = geom.attributes.position
      const initialPos = geom.userData.initialPositions
      const w = geom.userData.wJitter
      const h = geom.userData.hJitter

      if (!initialPos) continue

      const count = posAttr.count
      for (let j = 0; j < count; j++) {
        const ix = initialPos[j * 3]
        const iy = initialPos[j * 3 + 1]
        const iz = initialPos[j * 3 + 2]

        // u goes from 0 (spine) to 1 (outer edge)
        // spine is at x = -w/2, outer is at x = w/2 in local coordinates
        const u = (ix / w) + 0.5

        // Ripple envelope: peaks in the middle of page turn, 0 at start/end
        const envelope = Math.sin(progress * Math.PI)
        
        // Deep C-curve bend for structural flexible sag under gravity and movement forces
        const C_curve = -0.52 * envelope * Math.pow(u, 1.8)

        // Beautiful harmonic S-wave with higher frequency and longer phase delay for rippling flutter
        const wave = Math.sin(progress * Math.PI * 1.5 - u * 3.8)
        const S_wave = -0.26 * envelope * wave * Math.pow(u, 2.0)
        
        // Total organic bending amplitude (almost triple the prior flexibility!)
        const amp = C_curve + S_wave

        // Highly visible corner twist to capture realistic thumb-rolling / page peeling
        const v = iz / (h / 2) // from -1 to 1
        const twist = 0.12 * envelope * Math.sin(progress * Math.PI * 1.3) * v * Math.pow(u, 1.8)

        posAttr.setY(j, iy + amp + twist)
      }

      posAttr.needsUpdate = true
      geom.computeVertexNormals()
    }
  }

  // ── Pre-allocated Vec3s for the dust-particle hot loop ────────────────────
  // Avoids 27 000+ new THREE.Vector3() allocations per second (150 particles × 60fps × 3)
  const _dustPVec   = new THREE.Vector3()
  const _projPoint  = new THREE.Vector3()
  const _dustPt     = new THREE.Vector3()

  // WebGL Loop tick handler — capped at 74fps to reduce GPU heat
  const TARGET_MS = 1000 / 74
  let _lastTick = 0
  const tick = (now: number) => {
    if (isMobile.value || introComplete.value || !isIntersecting) {
      animationFrameId = null
      return
    }
    animationFrameId = requestAnimationFrame(tick)
    if (now - _lastTick < TARGET_MS) return   // skip frame — not yet time
    _lastTick = now
    
    // Update paper bending animations
    updatePageBends()
    
    // Lerp folder back to zero tilt (Mouse tilt disabled)
    folderGroup.rotation.x += (0 - folderGroup.rotation.x) * 0.08
    folderGroup.rotation.y += (0 - folderGroup.rotation.y) * 0.08

    // Update leaf shadow sways (กิ่งก้านใบไม้พริ้วไหว) - dynamically align branch to cast shadow onto desk pad center
    const time = Date.now() * 0.001
    if (leafShadowGroup && windowLight) {
      const L = windowLight.position
      const T_x = -0.3 // Centered slightly left to ensure the branch shadow starts way off-screen on the left
      const T_y = -0.95
      const T_z = 0.18 // Slightly forward to cover the book perfectly along the diagonal path
      const B_y = 0.52 // Lowered height to ensure crisp, highly visible, and dramatic shadows crossing the binder
      
      // Calculate dynamic alignment so the branch is in direct path of light to desk center
      const t = (B_y - L.y) / (T_y - L.y)
      const base_x = L.x + t * (T_x - L.x)
      const base_z = L.z + t * (T_z - L.z)
      
      // Add smooth wind sway offsets — larger amplitude so the shadow visibly drifts like wind
      leafShadowGroup.position.x = base_x + Math.cos(time * 0.45) * 0.14
      leafShadowGroup.position.y = B_y + Math.sin(time * 0.6) * 0.10
      leafShadowGroup.position.z = base_z + Math.sin(time * 0.35) * 0.11
    }

    // Feature 1: Leaf Flutter (พริ้วไหวของใบไม้ทีละใบอิสระ)
    if (shadowFeatures.leafFlutter && leafFlutterPivots.length > 0) {
      for (let i = 0; i < leafFlutterPivots.length; i++) {
        const item = leafFlutterPivots[i]
        // Independent high-frequency fluttering sway (stronger so leaves visibly shimmer)
        item.group.rotation.z = item.baseRotZ + Math.sin(time * 2.2 + item.offset) * 0.09
        item.group.rotation.x = item.baseRotX + Math.cos(time * 1.8 + item.offset) * 0.06
      }
    }

    // Feature 2: Komorebi and Left Warm Sun Light Position Sync
    if (komorebiLight && windowLight) {
      komorebiLight.position.copy(windowLight.position)
    }
    if (leftWarmSunLight && windowLight) {
      leftWarmSunLight.position.copy(windowLight.position)
    }

    // Feature 5: Sunset Color Progression (สีแดดคล้อยตามการเลื่อนสกロール)
    if (shadowFeatures.sunsetProgression && windowLight && ambientLight) {
      const p = scrollProgress.value // 0 to 1
      
      // Afternoon gold (1.0, 0.97, 0.92) to sunset orange (1.0, 0.50, 0.25)
      const r = 1.0
      const g = 0.97 - p * 0.47
      const b = 0.92 - p * 0.67
      windowLight.color.setRGB(r, g, b)
      
      // Afternoon ambient (1.0, 0.96, 0.93) at 0.7 to deep purple-navy (0.4, 0.3, 0.6) at 0.3
      const ambR = 1.0 - p * 0.6
      const ambG = 0.96 - p * 0.66
      const ambB = 0.93 - p * 0.33
      ambientLight.color.setRGB(ambR, ambG, ambB)
      ambientLight.intensity = 0.70 - p * 0.40
    } else {
      if (windowLight) windowLight.color.setHex(0xfff7ec)
      if (ambientLight) {
        ambientLight.color.setHex(0xfff6ed)
        ambientLight.intensity = 0.70
      }
    }

    // Feature 4: Specular Metallic Glints Sparkle
    if (shadowFeatures.metallicGlints && glintSprites.length > 0) {
      // Calculate glint based on camera motion + sine shimmer
      const glintIntensity = Math.max(0, Math.sin(time * 4.0 + 0.5)) * 0.6 * Math.sin(scrollProgress.value * Math.PI)
      glintSprites.forEach((sprite) => {
        sprite.material.opacity = glintIntensity
        const pulse = 1.0 + Math.sin(time * 12.0) * 0.15
        sprite.scale.setScalar(0.18 * pulse)
      })
    } else {
      glintSprites.forEach((sprite) => {
        sprite.material.opacity = 0.0
      })
    }

    // Update dust particles drifting motion & Feature 3: Volumetric Glow
    if (dustParticles && dustPositions && dustSpeeds) {
      const posAttr = dustParticles.geometry.getAttribute('position') as THREE.BufferAttribute
      const positions = posAttr.array as Float32Array
      const colAttr = dustParticles.geometry.getAttribute('color') as THREE.BufferAttribute
      const colors = colAttr.array as Float32Array
      const pTime = time * 0.5

      // Volumetric beam axis calculations
      const L_pos = windowLight.position
      const T_pos = new THREE.Vector3(0, -0.95, 0.2)
      const beamVec = new THREE.Vector3().subVectors(T_pos, L_pos)
      const beamLen = beamVec.length()
      const beamUnit = beamVec.clone().normalize()

      for (let i = 0; i < particleCount; i++) {
        // Apply speed + sinusoidal drift
        positions[i * 3] += dustSpeeds[i * 3] + Math.sin(pTime + i) * 0.001
        positions[i * 3 + 1] += dustSpeeds[i * 3 + 1]
        positions[i * 3 + 2] += dustSpeeds[i * 3 + 2] + Math.cos(pTime + i) * 0.001

        // Loop back when floating above the desk scene
        if (positions[i * 3 + 1] > 3.0) {
          positions[i * 3 + 1] = -1.0
          positions[i * 3] = (Math.random() - 0.5) * 10.0
          positions[i * 3 + 2] = (Math.random() - 0.5) * 8.0
        }

        // Feature 3: Volumetric glow inside sunbeam
        if (shadowFeatures.dustVolumetricGlow) {
          const px = positions[i * 3]
          const py = positions[i * 3 + 1]
          const pz = positions[i * 3 + 2]

          // Reuse pre-allocated Vec3s — no heap allocation per particle per frame
          _dustPVec.set(px, py, pz).sub(L_pos)
          const proj = _dustPVec.dot(beamUnit)

          let glowFactor = 0.0
          if (proj > 0 && proj < beamLen) {
            _projPoint.copy(L_pos).addScaledVector(beamUnit, proj)
            _dustPt.set(px, py, pz)
            const dist = _projPoint.distanceTo(_dustPt)
            const beamRadius = 0.8 + (proj / beamLen) * 1.8
            if (dist < beamRadius) {
              // Smooth glow fading towards the beam edges
              glowFactor = 1.0 - (dist / beamRadius)
            }
          }

          // Golden glow color when inside, faint white/grey color when outside
          colors[i * 3] = 0.4 + glowFactor * 0.6          // R
          colors[i * 3 + 1] = 0.4 + glowFactor * 0.4      // G
          colors[i * 3 + 2] = 0.4 + glowFactor * 0.1      // B
        } else {
          // Standard white color
          colors[i * 3] = 0.8
          colors[i * 3 + 1] = 0.8
          colors[i * 3 + 2] = 0.8
        }
      }
      posAttr.needsUpdate = true
      colAttr.needsUpdate = true
    }

    // Lerp mouse tilt offsets towards target
    currentTiltX += (targetTiltX - currentTiltX) * 0.08
    currentTiltY += (targetTiltY - currentTiltY) * 0.08

    // Parallax strength scales with camera height above the desk.
    // At y ≈ 7.10 (normal view) → full effect.
    // At y ≈ 0.06 (paper zoom) → zero effect (prevents jitter when very close).
    const CAM_Y_FULL  = 7.10
    const CAM_Y_CLOSE = 0.50   // start fading below this height
    const parallaxScale = Math.max(0, Math.min(1,
      (camera.position.y - CAM_Y_CLOSE) / (CAM_Y_FULL - CAM_Y_CLOSE)
    ))

    // Apply stage tilt based on mouse interaction
    stageGroup.rotation.x = currentTiltX * 0.030 * parallaxScale
    stageGroup.rotation.z = -currentTiltY * 0.030 * parallaxScale

    // Backup camera position for GSAP timeline compatibility
    const animCamPos = camera.position.clone()

    // Apply camera translation parallax (fades out as camera zooms in)
    camera.position.x += currentTiltY * 0.38 * parallaxScale
    camera.position.y += currentTiltX * 0.20 * parallaxScale

    // Apply camera rotation target parallax
    const animTarget = cameraTarget.clone()
    animTarget.x += currentTiltY * 0.12 * parallaxScale
    animTarget.y += currentTiltX * 0.07 * parallaxScale
    
    // Direct camera to look at target vector on every frame
    camera.lookAt(animTarget)

    // ── Object Micro-Hover Raycast ──────────────────────────────────────────────
    // Cast a ray from the camera using the current normalised mouse position
    hoverMouse2D.set(mouse.x, mouse.y)
    hoverRaycaster.setFromCamera(hoverMouse2D, camera)

    // Helper: check if ray intersects any descendant of a group
    const isHovered = (group: THREE.Group | null): boolean => {
      if (!group) return false
      const hits = hoverRaycaster.intersectObject(group, true)
      return hits.length > 0
    }

    const lerpSpeed = 0.07  // Smooth lerp factor for floating animation
    const liftAmount = 0.18 // How many units each object rises

    // Pen Stand — gentle float up on hover
    if (hoverPenStandGroup) {
      hoverLift.penStand += ((isHovered(hoverPenStandGroup) ? liftAmount : 0) - hoverLift.penStand) * lerpSpeed
      hoverPenStandGroup.position.y = hoverBaseY.penStand + hoverLift.penStand
    }

    // Pen Cup — gentle float up on hover
    if (hoverCupGroup) {
      hoverLift.cup += ((isHovered(hoverCupGroup) ? liftAmount : 0) - hoverLift.cup) * lerpSpeed
      hoverCupGroup.position.y = hoverBaseY.cup + hoverLift.cup
    }

    // Note Holder — gentle float up on hover
    if (hoverNoteHolderGroup) {
      hoverLift.noteHolder += ((isHovered(hoverNoteHolderGroup) ? liftAmount : 0) - hoverLift.noteHolder) * lerpSpeed
      hoverNoteHolderGroup.position.y = hoverBaseY.noteHolder + hoverLift.noteHolder
    }

    // Paper Tray — gentle float up on hover
    if (hoverTrayGroup) {
      hoverLift.tray += ((isHovered(hoverTrayGroup) ? liftAmount : 0) - hoverLift.tray) * lerpSpeed
      hoverTrayGroup.position.y = hoverBaseY.tray + hoverLift.tray
    }
    // ─────────────────────────────────────────────────────────────────────────────

    renderer.render(scene, camera)

    // ── Project book corner → screen coords for skip button ──────────────────
    if (skipBtnRef.value && frontCoverGroup && !introComplete.value) {
      if (!_skipCorner) _skipCorner = new THREE.Vector3()
      if (!_skipBtnMountedAt) _skipBtnMountedAt = Date.now()

      _skipCorner.set(2.3, 0.1, 1.3)
      frontCoverGroup.localToWorld(_skipCorner)
      _skipCorner.project(camera)
      const sx = (_skipCorner.x * 0.5 + 0.5) * window.innerWidth
      const sy = (-_skipCorner.y * 0.5 + 0.5) * window.innerHeight
      skipBtnRef.value.style.left = sx + 'px'
      skipBtnRef.value.style.top  = sy + 'px'

      // fade-in: 0→1 over 500ms starting 2s after mount
      // fade-out: tied to front cover rotation — fades as cover swings open (0.75π → π)
      const elapsed      = Date.now() - _skipBtnMountedAt
      const fadeIn       = Math.min(1, Math.max(0, (elapsed - 1000) / 400))
      const coverAngle   = frontCoverGroup.rotation.z / Math.PI  // 0 = closed, 1 = fully open
      const fadeOut      = 1 - Math.max(0, Math.min(1, (coverAngle - 0.08) / 0.20))
      skipBtnRef.value.style.opacity = String(Math.min(fadeIn, fadeOut))
    }

    // Restore camera position so GSAP updates next frame from clean, non-offset position
    camera.position.copy(animCamPos)
    // Signal loader after the very first frame is drawn
    if (!sceneReady.value) sceneReady.value = true
  }

  // Restart WebGL tick loop when scrolling back up
  watch(introComplete, (newVal) => {
    if (!newVal && !isMobile.value) {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
      animationFrameId = requestAnimationFrame(tick)
    }
  })

  // Page Visibility API — kill the render loop when tab is hidden, restart on return
  handleVisibilityChange = () => {
    if (document.hidden) {
      if (animationFrameId) { cancelAnimationFrame(animationFrameId); animationFrameId = null }
    } else if (!introComplete.value && !isMobile.value) {
      animationFrameId = requestAnimationFrame(tick)
    }
  }
  document.addEventListener('visibilitychange', handleVisibilityChange)

  // Setup IntersectionObserver for dynamic rendering (เรนเดอร์เฉพาะตอนมองเห็นในจอ)
  observer = new IntersectionObserver((entries) => {
    const entry = entries[0]
    isIntersecting = entry.isIntersecting
    if (isIntersecting && !introComplete.value && !isMobile.value) {
      if (!animationFrameId) {
        animationFrameId = requestAnimationFrame(tick)
      }
    } else {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
        animationFrameId = null
      }
    }
  }, { threshold: 0.05 }) // เริ่มทำงานเมื่อมีส่วนใดส่วนหนึ่งเห็นในจออย่างน้อย 5%

  if (viewportRef.value) {
    observer.observe(viewportRef.value)
  }

  window.addEventListener('resize', handleResize)
  window.addEventListener('mouseup', handleMouseUp)
  window.addEventListener('touchend', handleTouchEnd)
  window.addEventListener('wheel', handleReverseWheel, { passive: true })
})

onUnmounted(() => {
  if (observer) {
    observer.disconnect()
  }
  window.removeEventListener('resize', handleResize)
  window.removeEventListener('mouseup', handleMouseUp)
  window.removeEventListener('touchend', handleTouchEnd)
  window.removeEventListener('wheel', handleReverseWheel)
  document.removeEventListener('visibilitychange', handleVisibilityChange)
  if (scrollTriggerInstance) {
    scrollTriggerInstance.kill()
  }
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }
  if (renderer) {
    renderer.dispose()
  }
  if (scene) {
    scene.traverse((obj) => {
      if (!(obj instanceof THREE.Mesh)) return
      obj.geometry.dispose()
      if (Array.isArray(obj.material)) {
        obj.material.forEach((m) => m.dispose())
      } else {
        obj.material.dispose()
      }
    })
  }
  pageGroups.length = 0
  pageMeshes.length = 0
  wobblingPens.length = 0
  leafPlanes.length = 0
})
</script>

<style scoped>
/* Enforce Kanit font inside the cinematic section (excluding the Playfair serif title) */
.cinematic-section *:not(.floating-title) {
  font-family: 'Kanit', sans-serif !important;
}

/* Root element height gives ScrollTrigger a 100vh anchor to pin against */
.cinematic-section {
  height: 100vh;
  position: relative;
}

/* After the intro transition fires, collapse this section to 0 so the grid
   rises to the very top of the page (hidden behind the black flash overlay). */
.cinematic-section.cinematic-hidden {
  height: 0 !important;
  overflow: hidden !important;
  pointer-events: none;
}


/* Scoped overrides to enforce Kanit font globally on Portfolio page (excluding the Playfair serif title) */
.portfolio-container *:not(.floating-title) {
  font-family: 'Kanit', sans-serif !important;
}

/* Container limits scroll space properly */
.portfolio-container {
  min-height: 100vh;
  background: #060810;
  color: #fff;
  position: relative;
  /* clip ≠ hidden: clips overflow visually but does NOT create a new scroll
     container — so the browser won't add an implicit overflow-y:auto that
     would produce an inner scrollbar fighting with the outer window scroll. */
  overflow-x: clip;
}

/* 3D WebGL viewport */
.cinematic-viewport {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  z-index: 5;
  cursor: grab;
  user-select: none;
  -webkit-user-select: none;
}

.webgl-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
}

/* Cinematic vignette — multiply-blended dark edges for depth & focus */
.cinematic-vignette {
  position: absolute;
  inset: 0;
  z-index: 3;
  pointer-events: none;
  mix-blend-mode: multiply;
  background: radial-gradient(
    ellipse 78% 82% at 50% 46%,
    transparent 30%,
    rgba(0, 0, 0, 0.32) 66%,
    rgba(0, 0, 0, 0.72) 100%
  );
}

/* Title (Scene 1) — opacity is GSAP-controlled, no CSS transition needed */
.floating-title-container {
  position: absolute;
  left: 8%;
  top: 20%;
  pointer-events: none;
  z-index: 10;
  opacity: 0;
}

.floating-title {
  font-family: 'Playfair Display', serif !important;
  font-size: clamp(52px, 7vw, 105px);
  font-weight: 800;
  letter-spacing: 6px;
  line-height: 0.95;
  background: linear-gradient(to bottom, #ffffff 40%, #dcdbe2 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 15px 30px rgba(0,0,0,0.65));
}

.floating-subtitle {
  font-family: 'Kanit', sans-serif !important;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 6px;
  color: var(--accent, #38bdf8);
  margin-top: 12px;
  text-transform: uppercase;
  text-shadow: 0 5px 15px rgba(0,0,0,0.5);
}

/* Scroll indicator overlay prompt */
.skip-intro-btn {
  position: fixed;
  /* left/top set per-frame by JS projection — transform anchors top-right corner of button to projected point */
  transform: translate(-100%, -100%);
  z-index: 20;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 50px;
  border: 1px solid rgba(255,255,255,0.18);
  background: rgba(8, 10, 20, 0.55);
  backdrop-filter: blur(16px) saturate(160%);
  -webkit-backdrop-filter: blur(16px) saturate(160%);
  color: rgba(255,255,255,0.70);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.5px;
  cursor: pointer;
  /* hover transform offsets from base — use margin trick to keep anchor point stable */
  transition: background 0.25s, border-color 0.25s, color 0.25s;
  box-shadow: 0 4px 20px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.08);
  will-change: left, top, opacity;
  pointer-events: auto;
  opacity: 0;
}
.skip-intro-btn:hover {
  background: rgba(255,255,255,0.10);
  border-color: rgba(255,255,255,0.35);
  color: #fff;
}
.skip-intro-btn:active { opacity: 0.7; }

.scroll-prompt-container {
  position: absolute;
  bottom: 5%;
  left: 50%;
  transform: translateX(-50%);
  font-size: 17.6px;
  font-weight: 700;
  letter-spacing: 3px;
  color: rgba(255, 255, 255, 0.45);
  display: flex;
  align-items: center;
  gap: 13px;
  text-transform: uppercase;
  z-index: 10;
  pointer-events: none;
}

.scroll-arrow {
  animation: sscroll 1.6s infinite ease-in-out;
  display: inline-block;
  color: var(--accent, #38bdf8);
}

@keyframes sscroll {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(5px); }
}

/* Transition overlay — matches the grid page background color */
.transition-overlay {
  position: fixed;
  inset: 0;
  background: #060810;
  z-index: 100;
  pointer-events: none;
}

/* Portfolio List Grid section styling */
</style>
