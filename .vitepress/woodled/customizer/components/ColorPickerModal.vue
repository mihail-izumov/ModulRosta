<script setup lang="ts">
/**
 * ColorPickerModal.vue — Полноэкранный Hue-style цветовой пикер.
 *
 * Два режима:
 *   1. Пресеты — 12 цветов в сетке (по умолчанию)
 *   2. Колесо — conic gradient + drag по кругу
 *
 * Закрытие только по «Готово».
 */

import { ref, computed, nextTick } from 'vue'
import { T, Z } from '../theme/tokens'

interface Props {
  current: string | undefined
  roomName: string
}
const props = defineProps<Props>()
const emit = defineEmits<{
  pick: [color: string | undefined]
  close: []
}>()

/* ──── State ──── */

const picked = ref<string | undefined>(props.current)
const mode = ref<'presets' | 'wheel'>('presets')
const wheelCanvas = ref<HTMLCanvasElement | null>(null)
const wheelSize = 240

/* ──── Пресеты ──── */

const PRESETS: { color: string; name: string }[] = [
  { color: '#D4956B', name: 'Закат' },
  { color: '#C9A84C', name: 'Янтарь' },
  { color: '#C4A46C', name: 'Песок' },
  { color: '#A89878', name: 'Лён' },
  { color: '#8BAA6B', name: 'Поляна' },
  { color: '#7BA05B', name: 'Лес' },
  { color: '#5B8BA0', name: 'Озеро' },
  { color: '#6B8DC4', name: 'Небо' },
  { color: '#8B6BA0', name: 'Лаванда' },
  { color: '#B85C6C', name: 'Рубин' },
  { color: '#B85C4C', name: 'Глина' },
  { color: '#8B6242', name: 'Орех' },
]

/* ──── Имя цвета ──── */

const colorName = computed(() => {
  if (!picked.value) return 'Нет цвета'
  const preset = PRESETS.find(p => p.color === picked.value)
  if (preset) return preset.name
  return hueToName(picked.value)
})

function hueToName(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  const l = (max + min) / 2 / 255
  if (max - min < 20) return l > 0.6 ? 'Светлый' : 'Тёмный'
  let h = 0
  const d = max - min
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) * 60
  else if (max === g) h = ((b - r) / d + 2) * 60
  else h = ((r - g) / d + 4) * 60
  if (h < 15 || h >= 345) return 'Красный'
  if (h < 40) return 'Оранжевый'
  if (h < 70) return 'Золотой'
  if (h < 150) return 'Зелёный'
  if (h < 195) return 'Бирюзовый'
  if (h < 260) return 'Синий'
  if (h < 310) return 'Фиолетовый'
  return 'Розовый'
}

/* ──── Колесо ──── */

function drawWheel() {
  const cvs = wheelCanvas.value
  if (!cvs) return
  const ctx = cvs.getContext('2d')
  if (!ctx) return
  const cx = wheelSize / 2, cy = wheelSize / 2, radius = wheelSize / 2 - 4

  const img = ctx.createImageData(wheelSize, wheelSize)
  for (let y = 0; y < wheelSize; y++) {
    for (let x = 0; x < wheelSize; x++) {
      const dx = x - cx, dy = y - cy
      const dist = Math.sqrt(dx * dx + dy * dy)
      const idx = (y * wheelSize + x) * 4
      if (dist <= radius && dist >= radius * 0.45) {
        const angle = (Math.atan2(dy, dx) * 180 / Math.PI + 360) % 360
        const sat = 75 + ((dist - radius * 0.45) / (radius * 0.55)) * 20
        const rgb = hslToRgb(angle, sat, 55)
        img.data[idx] = rgb[0]
        img.data[idx + 1] = rgb[1]
        img.data[idx + 2] = rgb[2]
        img.data[idx + 3] = 255
      } else {
        img.data[idx + 3] = 0
      }
    }
  }
  ctx.putImageData(img, 0, 0)
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  s /= 100; l /= 100
  const c = (1 - Math.abs(2 * l - 1)) * s
  const x = c * (1 - Math.abs((h / 60) % 2 - 1))
  const m = l - c / 2
  let r = 0, g = 0, b = 0
  if (h < 60) { r = c; g = x }
  else if (h < 120) { r = x; g = c }
  else if (h < 180) { g = c; b = x }
  else if (h < 240) { g = x; b = c }
  else if (h < 300) { r = x; b = c }
  else { r = c; b = x }
  return [Math.round((r + m) * 255), Math.round((g + m) * 255), Math.round((b + m) * 255)]
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(c => c.toString(16).padStart(2, '0')).join('')
}

function pickFromWheel(e: MouseEvent | TouchEvent) {
  const cvs = wheelCanvas.value
  if (!cvs) return
  const rect = cvs.getBoundingClientRect()
  const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
  const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
  const x = Math.round((clientX - rect.left) * (wheelSize / rect.width))
  const y = Math.round((clientY - rect.top) * (wheelSize / rect.height))
  const ctx = cvs.getContext('2d')
  if (!ctx) return
  const px = ctx.getImageData(x, y, 1, 1).data
  if (px[3] < 128) return
  picked.value = rgbToHex(px[0], px[1], px[2])
}

let dragging = false
function onWheelDown(e: MouseEvent | TouchEvent) {
  dragging = true
  pickFromWheel(e)
}
function onWheelMove(e: MouseEvent | TouchEvent) {
  if (!dragging) return
  e.preventDefault()
  pickFromWheel(e)
}
function onWheelUp() { dragging = false }

function switchToWheel() {
  mode.value = 'wheel'
  nextTick(() => drawWheel())
}

/* ──── Actions ──── */

function done() {
  emit('pick', picked.value)
  emit('close')
}

function reset() {
  picked.value = undefined
}
</script>

<template>
  <div
    :style="{
      position: 'fixed',
      inset: 0,
      background: T.bg,
      zIndex: Z.fullscreenModal,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'auto',
    }"
  >
    <!-- Header -->
    <div
      :style="{
        padding: '16px 20px 0',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }"
    >
      <button
        :style="{
          background: 'none',
          border: 'none',
          color: T.textSec,
          fontSize: '14px',
          cursor: 'pointer',
          padding: '0 4px',
        }"
        @click="emit('close')"
      >
        ← Назад
      </button>
    </div>

    <!-- Content -->
    <div
      :style="{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 28px',
      }"
    >
      <!-- Title -->
      <div :style="{ fontSize: '22px', fontWeight: 700, color: T.text, marginBottom: '4px' }">
        Цвет комнаты
      </div>
      <div :style="{ fontSize: '13px', color: T.textSec, marginBottom: '24px' }">
        {{ props.roomName }}
      </div>

      <!-- Preview block -->
      <div
        :style="{
          width: '100%',
          maxWidth: '340px',
          height: '80px',
          borderRadius: '14px',
          background: picked
            ? `linear-gradient(135deg, ${picked}55, ${picked}22)`
            : T.card,
          border: `1px solid ${picked ? picked + '66' : T.border}`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '28px',
          transition: 'all .3s',
        }"
      >
        <svg
          width="28" height="28" viewBox="0 0 24 24" fill="none"
          :stroke="picked ?? T.textDim" stroke-width="1.5"
          stroke-linecap="round" stroke-linejoin="round"
          :style="{ opacity: 0.8, marginBottom: '4px' }"
        >
          <path d="M12 2v5"/>
          <path d="M14.829 15.998a3 3 0 1 1-5.658 0"/>
          <path d="M20.92 14.606A1 1 0 0 1 20 16H4a1 1 0 0 1-.92-1.394l3-7A1 1 0 0 1 7 7h10a1 1 0 0 1 .92.606z"/>
        </svg>
        <div :style="{ fontSize: '12px', fontWeight: 600, color: picked ?? T.textDim }">
          {{ colorName }}
        </div>
      </div>

      <!-- ═══ PRESETS ═══ -->
      <template v-if="mode === 'presets'">
        <div
          :style="{
            display: 'grid',
            gridTemplateColumns: 'repeat(6, 1fr)',
            gap: '12px',
            justifyItems: 'center',
            width: '100%',
            maxWidth: '340px',
          }"
        >
          <button
            v-for="p in PRESETS"
            :key="p.color"
            :style="{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${p.color}, ${p.color}cc)`,
              border: picked === p.color ? '3px solid #fff' : '2px solid transparent',
              cursor: 'pointer',
              boxShadow: picked === p.color ? `0 0 14px ${p.color}55` : 'none',
              transition: 'all .2s',
              padding: 0,
            }"
            :title="p.name"
            @click="picked = p.color"
          />
        </div>

        <button
          :style="{
            marginTop: '20px',
            padding: '10px 24px',
            background: 'none',
            border: `1px solid ${T.border}`,
            borderRadius: '8px',
            color: T.textSec,
            cursor: 'pointer',
            fontSize: '12px',
          }"
          @click="switchToWheel"
        >
          Выбрать свой цвет
        </button>
      </template>

      <!-- ═══ WHEEL ═══ -->
      <template v-if="mode === 'wheel'">
        <div :style="{ position: 'relative', width: wheelSize + 'px', height: wheelSize + 'px' }">
          <canvas
            ref="wheelCanvas"
            :width="wheelSize"
            :height="wheelSize"
            :style="{
              width: wheelSize + 'px',
              height: wheelSize + 'px',
              borderRadius: '50%',
              cursor: 'crosshair',
              touchAction: 'none',
            }"
            @mousedown="onWheelDown"
            @mousemove="onWheelMove"
            @mouseup="onWheelUp"
            @mouseleave="onWheelUp"
            @touchstart.prevent="onWheelDown"
            @touchmove="onWheelMove"
            @touchend="onWheelUp"
          />
          <!-- Center lamp -->
          <div
            :style="{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: (wheelSize * 0.38) + 'px',
              height: (wheelSize * 0.38) + 'px',
              borderRadius: '50%',
              background: picked
                ? `linear-gradient(135deg, ${picked}44, ${picked}18)`
                : T.card,
              border: `1px solid ${picked ? picked + '44' : T.border}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'none',
              transition: 'all .15s',
            }"
          >
            <svg
              width="32" height="32" viewBox="0 0 24 24" fill="none"
              :stroke="picked ?? T.textDim" stroke-width="1.5"
              stroke-linecap="round" stroke-linejoin="round"
            >
              <path d="M12 2v5"/>
              <path d="M14.829 15.998a3 3 0 1 1-5.658 0"/>
              <path d="M20.92 14.606A1 1 0 0 1 20 16H4a1 1 0 0 1-.92-1.394l3-7A1 1 0 0 1 7 7h10a1 1 0 0 1 .92.606z"/>
            </svg>
          </div>
        </div>

        <button
          :style="{
            marginTop: '16px',
            padding: '8px 20px',
            background: 'none',
            border: `1px solid ${T.border}`,
            borderRadius: '8px',
            color: T.textSec,
            cursor: 'pointer',
            fontSize: '12px',
          }"
          @click="mode = 'presets'"
        >
          Готовые цвета
        </button>
      </template>
    </div>

    <!-- Footer -->
    <div :style="{ padding: '0 28px 28px', maxWidth: '400px', width: '100%', margin: '0 auto' }">
      <button
        :style="{
          width: '100%',
          padding: '14px',
          background: picked ? T.text : T.border,
          color: picked ? T.bg : T.textDim,
          border: 'none',
          borderRadius: '10px',
          fontWeight: 700,
          cursor: 'pointer',
          fontSize: '14px',
          marginBottom: '8px',
        }"
        @click="done"
      >
        Готово
      </button>
      <button
        v-if="picked"
        :style="{
          width: '100%',
          padding: '10px',
          background: 'none',
          border: `1px solid ${T.border}`,
          borderRadius: '8px',
          color: T.textSec,
          cursor: 'pointer',
          fontSize: '12px',
        }"
        @click="reset"
      >
        Сбросить цвет
      </button>
    </div>
  </div>
</template>
