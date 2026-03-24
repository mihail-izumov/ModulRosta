<template>
  <Transition name="mr-loader">
    <div v-if="loading" class="mr-loader-overlay">
      <svg class="mr-loader-svg" viewBox="0 0 200 200">
        <defs>
          <linearGradient id="mr-loader-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#00ff88" stop-opacity="0" />
            <stop offset="50%" stop-color="#00ff88" stop-opacity="0.6" />
            <stop offset="100%" stop-color="#00ff88" stop-opacity="1" />
          </linearGradient>
        </defs>
        <circle
          cx="100" cy="100" r="90"
          fill="none"
          stroke="rgba(0,255,136,0.04)"
          stroke-width="0.5"
        />
        <circle
          cx="100" cy="100" r="90"
          fill="none"
          stroke="url(#mr-loader-grad)"
          stroke-width="1"
          stroke-linecap="round"
          stroke-dasharray="140 425"
          class="mr-loader-spinner"
        />
      </svg>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { useRoute } from 'vitepress'

const loading = ref(false)
const route = useRoute()
let hideTimeout: ReturnType<typeof setTimeout> | null = null

// Watch route path — fires on EVERY navigation including cached pages
watch(() => route.path, (newPath, oldPath) => {
  if (newPath !== oldPath) {
    // Hide after content has rendered
    nextTick(() => {
      hideTimeout = setTimeout(() => {
        loading.value = false
      }, 500)
    })
  }
})

onMounted(() => {
  // Intercept clicks on internal links
  const handleClick = (e: MouseEvent) => {
    const target = (e.target as HTMLElement)?.closest('a')
    if (!target) return
    const href = target.getAttribute('href')
    if (!href) return
    
    // Internal links only
    if (href.startsWith('/') || href.startsWith('./') || href.startsWith('../')) {
      // Don't trigger for same page anchors
      const url = new URL(href, window.location.origin)
      if (url.pathname === window.location.pathname) return
      
      if (hideTimeout) clearTimeout(hideTimeout)
      loading.value = true
    }
  }

  document.addEventListener('click', handleClick, true)

  onUnmounted(() => {
    document.removeEventListener('click', handleClick, true)
    if (hideTimeout) clearTimeout(hideTimeout)
  })
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
}

.mr-loader-svg {
  width: 70vmin;
  height: 70vmin;
  max-width: 600px;
  max-height: 600px;
}

.mr-loader-spinner {
  transform-origin: center;
  animation: mr-loader-spin 1.2s linear infinite;
}

@keyframes mr-loader-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.mr-loader-enter-active {
  transition: opacity 0.1s ease-out;
}
.mr-loader-leave-active {
  transition: opacity 0.35s ease-in;
}
.mr-loader-enter-from,
.mr-loader-leave-to {
  opacity: 0;
}
</style>
