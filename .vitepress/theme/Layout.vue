<template>
  <DefaultLayout>
    <template #layout-top>
      <slot name="layout-top" />
    </template>
  </DefaultLayout>

  <Teleport to="body">
    <Transition name="mr-preloader-fade">
      <div v-if="showPreloader" class="mr-preloader">
        <div class="mr-preloader-ring"></div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vitepress'
import DefaultTheme from 'vitepress/theme'

const DefaultLayout = DefaultTheme.Layout
const router = useRouter()

const showPreloader = ref(false)
let preloaderTimeout = null
let preloaderStart = 0
let preloaderRendered = false
const PRELOADER_MIN_MS = 600

onMounted(() => {
  router.onBeforeRouteChange = () => {
    showPreloader.value = true
    preloaderStart = Date.now()
    preloaderRendered = false
    clearTimeout(preloaderTimeout)
    // Safety: auto-hide after 3s
    preloaderTimeout = setTimeout(() => { showPreloader.value = false }, 3000)
    // Mark as rendered after next frame
    nextTick(() => {
      requestAnimationFrame(() => {
        preloaderRendered = true
      })
    })
  }

  router.onAfterRouteChanged = () => {
    const hidePreloader = () => {
      const elapsed = Date.now() - preloaderStart
      const remaining = Math.max(0, PRELOADER_MIN_MS - elapsed)
      clearTimeout(preloaderTimeout)
      preloaderTimeout = setTimeout(() => { showPreloader.value = false }, remaining)
    }

    // If preloader hasn't rendered yet, wait until it does
    if (!preloaderRendered) {
      nextTick(() => {
        requestAnimationFrame(() => {
          hidePreloader()
        })
      })
    } else {
      hidePreloader()
    }
  }
})

onUnmounted(() => {
  clearTimeout(preloaderTimeout)
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

.mr-preloader-fade-enter-active {
  transition: opacity 0.1s ease;
}
.mr-preloader-fade-leave-active {
  transition: opacity 0.35s ease;
}
.mr-preloader-fade-enter-from,
.mr-preloader-fade-leave-to {
  opacity: 0;
}
</style>
