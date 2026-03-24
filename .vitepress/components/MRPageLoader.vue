<template>
  <Transition name="mr-loader">
    <div v-if="loading" class="mr-loader-overlay">
      <div class="mr-loader-ring">
        <svg viewBox="0 0 200 200" width="120" height="120">
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
            stroke="rgba(0,255,136,0.06)"
            stroke-width="1.5"
          />
          <circle
            cx="100" cy="100" r="90"
            fill="none"
            stroke="url(#mr-loader-grad)"
            stroke-width="2"
            stroke-linecap="round"
            stroke-dasharray="180 388"
            class="mr-loader-spinner"
          />
        </svg>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vitepress'

const loading = ref(false)
let timeout: ReturnType<typeof setTimeout> | null = null

onMounted(() => {
  const router = useRouter()

  router.onBeforeRouteChange = () => {
    loading.value = true
  }

  router.onAfterRouteChanged = () => {
    // Small delay so animation is visible
    timeout = setTimeout(() => {
      loading.value = false
    }, 400)
  }
})

onUnmounted(() => {
  if (timeout) clearTimeout(timeout)
})
</script>

<style scoped>
.mr-loader-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.95);
  z-index: 99999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mr-loader-ring {
  animation: mr-loader-fade-in 0.15s ease-out;
}

.mr-loader-spinner {
  transform-origin: center;
  animation: mr-loader-spin 1s linear infinite;
}

@keyframes mr-loader-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes mr-loader-fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Transition */
.mr-loader-enter-active {
  transition: opacity 0.15s ease-out;
}
.mr-loader-leave-active {
  transition: opacity 0.3s ease-in;
}
.mr-loader-enter-from,
.mr-loader-leave-to {
  opacity: 0;
}
</style>
