<template>
  <div v-show="loading" class="mr-loader-overlay" :class="{ 'mr-loader-hiding': hiding }">
    <div class="mr-loader-ring"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vitepress'

const loading = ref(false)
const hiding = ref(false)
let hideTimeout: ReturnType<typeof setTimeout> | null = null
let originalGo: ((href: string) => Promise<void>) | null = null

function show() {
  hiding.value = false
  loading.value = true
}

function hide() {
  hiding.value = true
  hideTimeout = setTimeout(() => {
    loading.value = false
    hiding.value = false
  }, 350)
}

onMounted(() => {
  const router = useRouter()

  // Patch router.go to intercept ALL navigations
  originalGo = router.go.bind(router)
  router.go = async (href: string) => {
    // Don't show for same-page anchors
    try {
      const url = new URL(href, window.location.origin)
      if (url.pathname === window.location.pathname) {
        return originalGo!(href)
      }
    } catch {}

    show()

    // Small delay to let the overlay render before heavy navigation
    await new Promise(r => setTimeout(r, 50))
    await originalGo!(href)

    // Hide after navigation completes
    if (hideTimeout) clearTimeout(hideTimeout)
    hide()
  }

  // Also catch direct link clicks that VitePress intercepts
  document.addEventListener('click', handleClick, true)
})

function handleClick(e: MouseEvent) {
  const anchor = (e.target as HTMLElement)?.closest('a')
  if (!anchor) return
  const href = anchor.getAttribute('href')
  if (!href) return
  if (href.startsWith('#')) return
  if (href.startsWith('http') || href.startsWith('mailto:')) return
  
  // Internal link
  try {
    const url = new URL(href, window.location.origin)
    if (url.pathname !== window.location.pathname) {
      show()
    }
  } catch {}
}

onUnmounted(() => {
  document.removeEventListener('click', handleClick, true)
  if (hideTimeout) clearTimeout(hideTimeout)
  // Restore original router.go
  if (originalGo) {
    const router = useRouter()
    router.go = originalGo
  }
})
</script>

<style scoped>
.mr-loader-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.97);
  z-index: 99999;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 1;
  transition: opacity 0.1s ease-out;
}

.mr-loader-overlay.mr-loader-hiding {
  opacity: 0;
  transition: opacity 0.35s ease-in;
}

.mr-loader-ring {
  width: 70vmin;
  height: 70vmin;
  max-width: 600px;
  max-height: 600px;
  border-radius: 50%;
  border: 1px solid rgba(0, 255, 136, 0.04);
  position: relative;
}

.mr-loader-ring::before {
  content: '';
  position: absolute;
  inset: -1px;
  border-radius: 50%;
  border: 1.5px solid transparent;
  border-top-color: #00ff88;
  border-right-color: rgba(0, 255, 136, 0.3);
  animation: mr-loader-spin 1.2s linear infinite;
  filter: drop-shadow(0 0 8px rgba(0, 255, 136, 0.3));
}

@keyframes mr-loader-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
