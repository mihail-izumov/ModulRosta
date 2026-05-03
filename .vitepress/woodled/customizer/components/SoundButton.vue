<script setup lang="ts">
/**
 * SoundButton.vue — Кнопка звука леса.
 *
 * ТРИ состояния, ТРИ разные иконки:
 *   1. muted   — volume-x       (звук выключен; клик включает).
 *   2. loading — эквалайзер     (включено, ждём playback;
 *                               6 rect'ов с CSS scaleY-анимацией —
 *                               надёжнее SMIL внутри Vue-template).
 *   3. playing — volume-2       (играет; клик выключает).
 *
 * loading длится минимум MIN_LOADING_MS — даже если play() резолвится
 * мгновенно (файл в кэше), эквалайзер видно секунду.
 */

import { computed, ref, onMounted, onUnmounted } from 'vue'
import { T } from '../theme/tokens'

const AUDIO_SRC = 'https://runscale.ru/woodled/onboarding/forest-soundscape.mp3'

const MIN_LOADING_MS = 1000

const muted = ref(true)
const playing = ref(false)
const showHint = ref(true)
const audioRef = ref<HTMLAudioElement | null>(null)

const loading = computed(() => !muted.value && !playing.value)

const iconColor = computed(() => {
  if (muted.value) return T.textDim
  if (loading.value) return T.textSec
  return T.neutral
})

let hintTimer: ReturnType<typeof setTimeout> | null = null
let toggleStartTs = 0
let pendingPlayingTimer: ReturnType<typeof setTimeout> | null = null

function scheduleTransitionToPlaying() {
  if (muted.value) return
  const elapsed = Date.now() - toggleStartTs
  const remaining = Math.max(0, MIN_LOADING_MS - elapsed)
  if (pendingPlayingTimer) clearTimeout(pendingPlayingTimer)
  pendingPlayingTimer = setTimeout(() => {
    if (!muted.value) playing.value = true
    pendingPlayingTimer = null
  }, remaining)
}

function toggleSound() {
  showHint.value = false
  const a = audioRef.value
  if (!a) return

  if (muted.value) {
    if (pendingPlayingTimer) {
      clearTimeout(pendingPlayingTimer)
      pendingPlayingTimer = null
    }
    toggleStartTs = Date.now()
    muted.value = false
    a.muted = false
    a.volume = 0.6
    const p = a.play()
    if (p && typeof p.then === 'function') {
      p.then(() => {
        scheduleTransitionToPlaying()
      }).catch(() => {
        muted.value = true
        a.muted = true
        playing.value = false
      })
    } else {
      scheduleTransitionToPlaying()
    }
  } else {
    if (pendingPlayingTimer) {
      clearTimeout(pendingPlayingTimer)
      pendingPlayingTimer = null
    }
    muted.value = true
    a.muted = true
    a.pause()
    playing.value = false
  }
}

function onPlaying() {
  if (!muted.value) scheduleTransitionToPlaying()
}

function onError() {
  if (pendingPlayingTimer) {
    clearTimeout(pendingPlayingTimer)
    pendingPlayingTimer = null
  }
  playing.value = false
  muted.value = true
}

onMounted(() => {
  hintTimer = setTimeout(() => { showHint.value = false }, 8000)
})

onUnmounted(() => {
  if (hintTimer) clearTimeout(hintTimer)
  if (pendingPlayingTimer) clearTimeout(pendingPlayingTimer)
  if (audioRef.value) {
    audioRef.value.pause()
    audioRef.value.currentTime = 0
  }
})

/* Стили палочек эквалайзера. Каждая со своим dur/delay → асинхронная
 * пульсация. transform-box: fill-box нужен чтобы scaleY шёл от центра
 * самого rect, а не от 0,0 svg.
 *
 * Координаты — те же, что у Lucide audio-lines: палочки на x=2,6,10,14,
 * 18,22 с разной высотой. Шириной 2 (как stroke-width=2) с rx=1 для
 * скруглённых концов.
 */
function barStyle(dur: number, delay: number) {
  return {
    animation: `wlSoundBar ${dur}s ease-in-out ${delay}s infinite`,
    transformOrigin: 'center',
    transformBox: 'fill-box' as const,
  }
}
</script>

<template>
  <div :style="{ position: 'relative' }">
    <audio
      ref="audioRef"
      :src="AUDIO_SRC"
      loop
      preload="auto"
      @playing="onPlaying"
      @error="onError"
    />

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
        color: iconColor,
        transition: 'color .3s',
      }"
      :aria-label="muted ? 'Включить звук' : 'Выключить звук'"
      @click="toggleSound"
    >
      <!-- 1. Muted: volume-x -->
      <svg v-if="muted" width="18" height="18" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z"/>
        <line x1="22" y1="9" x2="16" y2="15"/>
        <line x1="16" y1="9" x2="22" y2="15"/>
      </svg>

      <!-- 2. Loading: 6 rect-палочек с CSS-эквалайзером -->
      <svg v-else-if="loading" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <rect x="1"  y="10" width="2" height="3"  rx="1" :style="barStyle(0.55, 0)" />
        <rect x="5"  y="6"  width="2" height="11" rx="1" :style="barStyle(0.7,  0.08)" />
        <rect x="9"  y="3"  width="2" height="18" rx="1" :style="barStyle(0.8,  0.16)" />
        <rect x="13" y="8"  width="2" height="7"  rx="1" :style="barStyle(0.65, 0.24)" />
        <rect x="17" y="5"  width="2" height="13" rx="1" :style="barStyle(0.6,  0.04)" />
        <rect x="21" y="10" width="2" height="3"  rx="1" :style="barStyle(0.75, 0.12)" />
      </svg>

      <!-- 3. Playing: volume-2 -->
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
      Включите звук леса
    </div>
  </div>
</template>

<style>
@keyframes wlSoundBar {
  0%, 100% { transform: scaleY(1); }
  50%      { transform: scaleY(0.3); }
}
</style>
