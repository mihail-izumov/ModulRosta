<script setup lang="ts">
/**
 * SoundButton.vue — Кнопка звука леса.
 *
 * ТРИ разных иконки, чтобы состояния были визуально различимы:
 *   1. muted   — volume-x       (звук выключен, default).
 *   2. loading — audio-lines    (юзер нажал, файл грузится / ждём playing
 *                               событие). С анимированной SMIL-пульсацией.
 *   3. playing — volume-2       (звук реально воспроизводится).
 *
 * Из loading в playing переходим по событию `playing` audio-элемента.
 * Если файл не загружается (event `error`) — откатываемся в muted.
 */

import { computed, ref, onMounted, onUnmounted } from 'vue'
import { T } from '../theme/tokens'

const AUDIO_SRC = 'https://runscale.ru/woodled/onboarding/forest-soundscape.mp3'

const muted = ref(true)
const playing = ref(false)
const showHint = ref(true)
const audioRef = ref<HTMLAudioElement | null>(null)

/* Когда юзер хочет звук, но playing event ещё не пришёл. */
const loading = computed(() => !muted.value && !playing.value)

const iconColor = computed(() => {
  if (muted.value) return T.textDim
  if (loading.value) return T.textSec
  return T.neutral
})

let hintTimer: ReturnType<typeof setTimeout> | null = null

function toggleSound() {
  showHint.value = false
  const a = audioRef.value
  if (!a) return

  if (muted.value) {
    muted.value = false
    a.muted = false
    a.volume = 0.6
    const p = a.play()
    if (p && p.catch) {
      p.catch(() => {
        // play отказан (autoplay policy / file error) — откатываемся.
        muted.value = true
        a.muted = true
        playing.value = false
      })
    }
  } else {
    muted.value = true
    a.muted = true
    a.pause()
    playing.value = false
  }
}

function onPlaying() {
  if (!muted.value) playing.value = true
}
function onWaiting() {
  playing.value = false
}
function onPauseEvt() {
  playing.value = false
}
function onStalled() {
  playing.value = false
}
function onError() {
  // Файл не загружается — выходим из loading в muted.
  playing.value = false
  muted.value = true
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
    <audio
      ref="audioRef"
      :src="AUDIO_SRC"
      loop
      preload="auto"
      @playing="onPlaying"
      @waiting="onWaiting"
      @pause="onPauseEvt"
      @stalled="onStalled"
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

      <!-- 2. Loading: audio-lines с пульсирующей SMIL-анимацией.
           Каждая палочка анимируется самостоятельно с разным dur/begin
           для эффекта эквалайзера. -->
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

      <!-- 3. Playing: volume-2 (звук вкл) -->
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
