import { ref, onMounted, onUnmounted } from 'vue'

const isMobile = ref(false)
let initialized = false

function updateDevice() {
  isMobile.value = window.innerWidth <= 900
}

export function useDevice() {
  onMounted(() => {
    if (!initialized) {
      updateDevice()
      window.addEventListener('resize', updateDevice)
      initialized = true
    }
  })

  onUnmounted(() => {
    // If it's a global singleton listener, we can keep it, but to prevent leaks
    // on hot-reload, we can clean up if the composable is destroyed.
    // However, since it is used in views/Home.vue, it is safe to listen globally.
  })

  return {
    isMobile
  }
}
