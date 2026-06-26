<template>
  <Transition name="pl-fade">
    <div v-if="visible" class="pl" aria-label="Loading portfolio" role="status">

      <div class="pl__inner">
        <img src="/logo.png" alt="Netservice" class="pl__logo" />

        <div class="pl__track" aria-hidden="true">
          <!-- Sweep bounces during load, fades out when done -->
          <div class="pl__sweep" :class="{ 'pl__sweep--done': done }" />
          <!-- Fill grows to 100% when done — separate element avoids the animation-snap lag -->
          <div class="pl__bar" :class="{ 'pl__bar--done': done }" />
        </div>
      </div>

    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  done?: boolean
}>()

const emit = defineEmits<{
  complete: []
}>()

const visible = ref(true)

watch(() => props.done, (isDone) => {
  if (!isDone) return
  // Let the fill bar complete (500ms) + brief hold, then fade the overlay
  setTimeout(() => {
    visible.value = false
    setTimeout(() => emit('complete'), 250)
  }, 580)
})
</script>

<style scoped>
/* ── Overlay ───────────────────────────────────────────────── */
.pl {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9999;
  background: #000000;
  display: grid;
  place-items: center;
}

/* ── Inner stack ────────────────────────────────────────────── */
.pl__inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

/* ── Logo ────────────────────────────────────────────────────── */
.pl__logo {
  height: 36px;
  width: auto;
  filter: brightness(0) invert(1);
  display: block;
}

/* ── Track ──────────────────────────────────────────────────── */
.pl__track {
  width: 200px;
  height: 2px;
  background: rgba(255, 255, 255, 0.12);
  border-radius: 2px;
  overflow: hidden;
  position: relative;
}

/* Sweep indicator — bounces indefinitely during load */
.pl__sweep {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 40%;
  background: #ffffff;
  border-radius: 2px;
  animation: sweep 1.1s cubic-bezier(0.4, 0, 0.2, 1) infinite;
  will-change: transform;
  transition: opacity 0.18s ease;
}
/* Fade sweep out when done — no animation-stop snap */
.pl__sweep--done {
  opacity: 0;
  animation-play-state: paused;
}

/* Fill bar — grows smoothly from 0 → 100% when done */
.pl__bar {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 0%;
  background: #ffffff;
  border-radius: 2px;
  transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}
.pl__bar--done {
  width: 100%;
}

@keyframes sweep {
  0%   { transform: translateX(-100%); }
  100% { transform: translateX(350%); }
}

/* ── Fade-out transition ─────────────────────────────────────── */
.pl-fade-leave-active {
  transition: opacity 0.5s ease;
}
.pl-fade-leave-to {
  opacity: 0;
}
</style>
