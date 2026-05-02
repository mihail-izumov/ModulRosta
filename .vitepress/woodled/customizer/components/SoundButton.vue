<script setup lang="ts">
/**
 * SoundButton.vue — Кнопка звука леса.
 * Порт из WoodledOnboarding.vue.
 */

import { ref, onMounted, onUnmounted } from 'vue'
import { T } from '../theme/tokens'

const AUDIO_SRC = 'https://runscale.ru/woodled/onboarding/forest-soundscape.mp3'

const muted = ref(true)
const showHint = ref(true)
const audioRef = ref<HTMLAudioElement | null>(null)

let hintTimer: ReturnType<typeof setTimeout> | null = null

function toggleSound() {
  showHint.value = false
  const newMuted = !muted.value
  muted.value = newMuted
  const a = audioRef.value
  if (!a) return
  a.muted = newMuted
  if (!newMuted) {
    a.volume = 0.6
    const p = a.play()
    if (p && p.catch) p.catch(() => {})
  } else {
    a.pause()
  }
}

onMounted(() => {
  hintTimer = setTimeout(() => { showHint.value = false }, 8000)
})

onUnmounted(() => {
  if (hintTimer) clearTimeout(hintTimer)
  if (audioRef.value) {
    audioRef.value.pause()
    audioRef.value.currentTime = 0
  }
})
</script>

<template>
  <div :style="{ position: 'relative' }">
    <audio ref="audioRef" :src="AUDIO_SRC" loop preload="auto" />

    <button
      :style="{
        background: 'none',
        border: `1px solid ${T.border}`,
        borderRadius: '8px',
        padding: '6px 8px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: muted ? T.textDim : T.neutral,
        transition: 'all .3s',
      }"
      :aria-label="muted ? 'Включить звук' : 'Выключить звук'"
      @click="toggleSound"
    >
      <svg v-if="muted" width="18" height="18" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M16 9a5 5 0 0 1 .95 2.293"/>
        <path d="M19.364 5.636a9 9 0 0 1 1.889 9.96"/>
        <path d="m2 2 20 20"/>
        <path d="m7 7-.587.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298V11"/>
        <path d="M9.828 4.172A.686.686 0 0 1 11 4.657v.686"/>
      </svg>
      <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z"/>
        <path d="M16 9a5 5 0 0 1 0 6"/>
        <path d="M19.364 18.364a9 9 0 0 0 0-12.728"/>
      </svg>
    </button>

    <div
      v-if="showHint && muted"
      :style="{
        position: 'absolute',
        top: '100%',
        right: 0,
        marginTop: '8px',
        background: T.neutral,
        color: T.bg,
        fontSize: '11px',
        fontWeight: 600,
        padding: '5px 10px',
        borderRadius: '6px',
        whiteSpace: 'nowrap',
        boxShadow: '0 4px 12px rgba(0,0,0,.3)',
        pointerEvents: 'none',
        animation: 'float 1.4s ease-in-out infinite',
      }"
    >
      🔊 Включить звук леса
    </div>
  </div>
</template>
