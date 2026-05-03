<script setup lang="ts">
/**
 * SoundButton.vue — Кнопка звука леса.
 *
 * ТРИ состояния, ТРИ разные иконки:
 *   1. muted   — volume-x       (звук выключен; клик включает).
 *   2. loading — audio-lines    (включено, но playback ещё не стартовал;
 *                               анимированная SMIL-пульсация эквалайзера).
 *   3. playing — volume-2       (играет; клик выключает).
 *
 * Переход loading → playing происходит когда Promise от audio.play()
 * резолвится (это надёжнее, чем event 'playing' — у Safari/iOS event
 * не всегда срабатывает при loop=true). Дублируем event 'playing' как
 * страховку.
 *
 * НЕ слушаем waiting/pause/stalled — они могут сбрасывать playing в false
 * во время штатной перемотки loop'а в некоторых браузерах.
 */

import { computed, ref, onMounted, onUnmounted } from 'vue'
import { T } from '../theme/tokens'

const AUDIO_SRC = 'https://runscale.ru/woodled/onboarding/forest-soundscape.mp3'

/* Минимальная длительность loading-состояния — даёт юзеру время заметить
 * иконку эквалайзера, даже если файл уже в кэше и play() резолвится мгновенно. */
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

/* Запланировать переход в playing с учётом минимума MIN_LOADING_MS. */
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
    // Включаем — переход в loading, потом в playing с минимумом 1с.
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
        // Autoplay policy / file error — откатываемся.
        muted.value = true
        a.muted = true
        playing.value = false
      })
    } else {
      // Старые браузеры без Promise-возврата.
      scheduleTransitionToPlaying()
    }
  } else {
    // Выключаем — мгновенно сбрасываем всё.
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

/* Страховка: если Promise по какой-то причине не резолвится, ловим
 * стандартное событие playing (тоже с минимумом MIN_LOADING_MS). */
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

      <!-- 2. Loading: audio-lines с пульсирующей SMIL-анимацией -->
      <svg v-else-if="loading" width="18" height="18" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M2 10v3">
          <animate attributeName="d" dur="0.6s" repeatCount="indefinite"
            values="M2 10v3;M2 11v1;M2 10v3" />
        </path>
        <path d="M6 6v11">
          <animate attributeName="d" dur="0.7s" begin="0.08s" repeatCount="indefinite"
            values="M6 6v11;M6 9v5;M6 6v11" />
        </path>
        <path d="M10 3v18">
          <animate attributeName="d" dur="0.8s" begin="0.16s" repeatCount="indefinite"
            values="M10 3v18;M10 8v8;M10 3v18" />
        </path>
        <path d="M14 8v7">
          <animate attributeName="d" dur="0.65s" begin="0.24s" repeatCount="indefinite"
            values="M14 8v7;M14 10v3;M14 8v7" />
        </path>
        <path d="M18 5v13">
          <animate attributeName="d" dur="0.55s" begin="0.04s" repeatCount="indefinite"
            values="M18 5v13;M18 9v5;M18 5v13" />
        </path>
        <path d="M22 10v3">
          <animate attributeName="d" dur="0.75s" begin="0.12s" repeatCount="indefinite"
            values="M22 10v3;M22 11v1;M22 10v3" />
        </path>
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
