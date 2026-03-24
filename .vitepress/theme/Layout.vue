<template>
  <DefaultLayout>
    <template #layout-top>
      <slot name="layout-top" />
    </template>
  </DefaultLayout>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vitepress'
import DefaultTheme from 'vitepress/theme'

const DefaultLayout = DefaultTheme.Layout
const router = useRouter()

let preloaderEl = null
let preloaderTimeout = null
const PRELOADER_MIN_MS = 600

function createPreloader() {
  if (typeof document === 'undefined') return
  if (preloaderEl) return

  preloaderEl = document.createElement('div')
  preloaderEl.className = 'mr-preloader'
  preloaderEl.innerHTML = '<div class="mr-preloader-ring"></div>'
  preloaderEl.style.opacity = '0'
  preloaderEl.style.pointerEvents = 'none'
  document.body.appendChild(preloaderEl)
}

function showPreloader() {
  if (!preloaderEl) createPreloader()
  if (!preloaderEl) return

  clearTimeout(preloaderTimeout)
  preloaderEl.style.transition = 'opacity 0.1s ease'
  preloaderEl.style.opacity = '1'
  preloaderEl.style.pointerEvents = 'all'

  // Safety: auto-hide after 3s
  preloaderTimeout = setTimeout(hidePreloader, 3000)
}

function hidePreloader() {
  if (!preloaderEl) return
  clearTimeout(preloaderTimeout)

  preloaderEl.style.transition = 'opacity 0.35s ease'
  preloaderEl.style.opacity = '0'
  preloaderEl.style.pointerEvents = 'none'
}

onMounted(() => {
  createPreloader()

  router.onBeforeRouteChange = () => {
    showPreloader()

    // Force browser to paint before navigation continues
    preloaderEl?.offsetHeight
  }

  router.onAfterRouteChanged = () => {
    clearTimeout(preloaderTimeout)
    preloaderTimeout = setTimeout(hidePreloader, PRELOADER_MIN_MS)
  }
})

onUnmounted(() => {
  clearTimeout(preloaderTimeout)
  if (preloaderEl && preloaderEl.parentNode) {
    preloaderEl.parentNode.removeChild(preloaderEl)
    preloaderEl = null
  }
})
</script>

<style>
.mr-preloader {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 99999;
  background: #0a0a0a;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mr-preloader-ring {
  width: 70vmin;
  height: 70vmin;
  max-width: 600px;
  max-height: 600px;
  border-radius: 50%;
  border: 1px solid rgba(0, 255, 136, 0.04);
  position: relative;
}

.mr-preloader-ring::before {
  content: '';
  position: absolute;
  inset: -1px;
  border-radius: 50%;
  border: 1.5px solid transparent;
  border-top-color: #00ff88;
  border-right-color: rgba(0, 255, 136, 0.3);
  animation: mr-preloader-spin 1.2s linear infinite;
  filter: drop-shadow(0 0 8px rgba(0, 255, 136, 0.3));
}

@keyframes mr-preloader-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
