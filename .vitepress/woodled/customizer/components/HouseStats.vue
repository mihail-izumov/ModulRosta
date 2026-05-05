<script setup lang="ts">
/**
 * HouseStats.vue — Виджет дома сверху главного экрана.
 *
 * Tesla-style: 3 параметра в одну строку, разделённые вертикальными
 * линиями, без рамок и теней. Тёмный фон, тонкие divider'ы.
 *
 * Параметры:
 *   1. Площадь — Σ getArea(rt, room) по всем комнатам
 *   2. Потолок — если у всех одинаковый, одно число; иначе диапазон
 *   3. Точки света — занято / максимум (по лимитам зон в каждой комнате)
 *
 * Когда комнат нет — все поля показывают прочерки «—». Это менее
 * агрессивно чем «0», и ощущается как «ещё не определено», а не «провал».
 *
 * См. docs/TEMPLATES_SYSTEM.md раздел 4.
 */

import { computed } from 'vue'
import { T } from '../theme/tokens'
import { useConfigurator } from '../store/configurator'
import { getRT, type Room } from '../data/rooms'
import { getArea } from '../engine/brightness'

const cfg = useConfigurator()

const rooms = computed<Room[]>(() => cfg.rooms as Room[])

const totalArea = computed<number | null>(() => {
  if (rooms.value.length === 0) return null
  return Math.round(
    rooms.value.reduce((s, r) => s + getArea(getRT(r.typeId), r), 0),
  )
})

/**
 * Если все комнаты с одинаковым потолком — одно число «2.7».
 * Если разные — диапазон «2.7–3.0».
 */
const ceilingDisplay = computed<string | null>(() => {
  if (rooms.value.length === 0) return null
  const heights = [...new Set(rooms.value.map((r) => r.ceilingH))].sort(
    (a, b) => a - b,
  )
  if (heights.length === 1) return heights[0].toFixed(1)
  return `${heights[0].toFixed(1)}–${heights[heights.length - 1].toFixed(1)}`
})

/**
 * Точки света — занято / максимум (сумма лимитов всех зон во всех комнатах).
 */
const lightPoints = computed<{ used: number; max: number } | null>(() => {
  if (rooms.value.length === 0) return null
  let used = 0
  let max = 0
  for (const r of rooms.value) {
    const rt = getRT(r.typeId)
    const limits = r.limits ?? rt.limits
    for (const z of rt.zones) {
      max += limits[z] ?? 0
    }
    for (const fx of r.fixtures) {
      used += fx.q ?? 1
    }
  }
  return { used, max }
})

const isEmpty = computed(() => rooms.value.length === 0)
</script>

<template>
  <div
    :style="{
      display: 'flex',
      alignItems: 'stretch',
      borderTop: `1px solid ${T.border}`,
      borderBottom: `1px solid ${T.border}`,
      padding: '14px 0',
      marginBottom: '16px',
    }"
  >
    <!-- Площадь -->
    <div
      :style="{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '4px',
      }"
    >
      <div
        :style="{
          fontSize: '9px',
          fontWeight: 700,
          color: T.textDim,
          textTransform: 'uppercase',
          letterSpacing: '1px',
        }"
      >
        площадь
      </div>
      <div
        :style="{
          fontSize: '26px',
          fontWeight: 700,
          color: isEmpty ? T.textDim : T.text,
          fontVariantNumeric: 'tabular-nums',
          lineHeight: 1,
        }"
      >
        {{ totalArea ?? '—' }}
      </div>
      <div
        :style="{
          fontSize: '11px',
          color: T.textSec,
        }"
      >
        м²
      </div>
    </div>

    <!-- Divider -->
    <div
      :style="{
        width: '1px',
        background: T.border,
        margin: '4px 0',
      }"
    />

    <!-- Потолок -->
    <div
      :style="{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '4px',
      }"
    >
      <div
        :style="{
          fontSize: '9px',
          fontWeight: 700,
          color: T.textDim,
          textTransform: 'uppercase',
          letterSpacing: '1px',
        }"
      >
        потолок
      </div>
      <div
        :style="{
          fontSize: '26px',
          fontWeight: 700,
          color: isEmpty ? T.textDim : T.text,
          fontVariantNumeric: 'tabular-nums',
          lineHeight: 1,
        }"
      >
        {{ ceilingDisplay ?? '—' }}
      </div>
      <div
        :style="{
          fontSize: '11px',
          color: T.textSec,
        }"
      >
        м
      </div>
    </div>

    <!-- Divider -->
    <div
      :style="{
        width: '1px',
        background: T.border,
        margin: '4px 0',
      }"
    />

    <!-- Точки света -->
    <div
      :style="{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '4px',
      }"
    >
      <div
        :style="{
          fontSize: '9px',
          fontWeight: 700,
          color: T.textDim,
          textTransform: 'uppercase',
          letterSpacing: '1px',
        }"
      >
        света
      </div>
      <div
        :style="{
          fontSize: '26px',
          fontWeight: 700,
          color: isEmpty ? T.textDim : T.text,
          fontVariantNumeric: 'tabular-nums',
          lineHeight: 1,
          display: 'flex',
          alignItems: 'baseline',
        }"
      >
        <template v-if="lightPoints">
          <span>{{ lightPoints.used }}</span>
          <span
            :style="{
              fontSize: '14px',
              color: T.textDim,
              fontWeight: 500,
            }"
          >
            /{{ lightPoints.max }}
          </span>
        </template>
        <template v-else>—</template>
      </div>
      <div
        :style="{
          fontSize: '11px',
          color: T.textSec,
        }"
      >
        точек
      </div>
    </div>
  </div>
</template>
