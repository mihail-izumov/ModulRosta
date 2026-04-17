<script setup lang="ts">
/**
 * ZoneCard.vue — Карточка одной зоны (ceiling/wall/floor/table).
 *
 * Источник: woodled-v42.jsx (блок зоны внутри 2×2 сетки RoomDetail).
 * Содержит: заголовок + процент + счётчик ламп + список светильников или ghost + кнопка «Больше Света».
 */

import { computed } from 'vue'
import { T, RGBA } from '../theme/tokens'
import { MD, type Zone, type Fixture } from '../data/catalog'
import type { Mood } from '../data/moods'
import { pw } from '../engine/i18n'
import { zoneLm, zoneFxCount } from '../engine/zone-engine'
import Icon, { fxIcName } from './ui/Icons.vue'

interface Props {
  zone: Zone
  fixtures: Fixture[]
  mood: Mood
  totalLm: number
  limit: number
}
const props = defineProps<Props>()
const emit = defineEmits<{
  add: []
  edit: [fxIdx: number]
  limitHit: []
}>()

/** Светильники только этой зоны, с сохранёнными исходными индексами. */
const zFx = computed(() =>
  props.fixtures
    .map((it, idx) => ({ ...it, _idx: idx }))
    .filter((it) => (it.zone ?? 'ceiling') === props.zone.id),
)

const zLamps = computed(() =>
  zFx.value.reduce(
    (s, it) => s + (it.l ?? MD[it.m]?.lamps ?? 0) * (it.q ?? 1),
    0,
  ),
)

const zPct = computed(() => {
  if (props.totalLm <= 0) return 0
  return Math.round((zoneLm(props.fixtures, props.zone.id) / props.totalLm) * 100)
})

const curCount = computed(() => zoneFxCount(props.fixtures, props.zone.id))
const canAdd = computed(() => curCount.value < props.limit)

const isEmptyMood = computed(() => props.mood.id === 'empty')
</script>

<template>
  <div
    :style="{
      background: T.card + '88',
      borderRadius: '10px',
      padding: '12px',
      display: 'flex',
      flexDirection: 'column',
    }"
  >
    <!-- Заголовок + бейдж процента + счётчик -->
    <div
      :style="{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '6px',
      }"
    >
      <span
        :style="{
          fontSize: '10px',
          fontWeight: 700,
          color: T.text,
          textTransform: 'uppercase',
          letterSpacing: '1px',
        }"
      >
        {{ zone.name }}
        <span
          v-if="zPct > 0"
          :style="{
            marginLeft: '4px',
            padding: '1px 5px',
            borderRadius: '4px',
            background: mood.color + '20',
            fontSize: '9px',
            fontWeight: 600,
            color: mood.color,
          }"
        >
          {{ zPct }}%
        </span>
      </span>
      <span
        v-if="zLamps > 0"
        :style="{
          fontSize: '10px',
          color: mood.color,
          display: 'flex',
          alignItems: 'center',
          gap: '3px',
        }"
      >
        <Icon name="bulb" :color="mood.color" :size="12" />
        {{ zLamps }}
      </span>
    </div>

    <!-- Ghost-иконка в пустой зоне -->
    <div
      v-if="zFx.length === 0"
      :style="{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '10px 0',
        opacity: 0.4,
      }"
    >
      <Icon
        name="leafy"
        :color="isEmptyMood ? T.textSec : mood.color"
        :size="28"
      />
    </div>

    <!-- Список светильников -->
    <div
      v-for="it in zFx"
      :key="it._idx"
      :style="{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '6px 8px',
        cursor: 'pointer',
        background: RGBA.white04,
        border: `1px solid ${RGBA.white08}`,
        borderRadius: '6px',
        marginBottom: '4px',
      }"
      @click="emit('edit', it._idx)"
    >
      <div
        :style="{
          width: '24px',
          height: '24px',
          borderRadius: '5px',
          background: mood.color + '15',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }"
      >
        <Icon
          :name="fxIcName(MD[it.m].type)"
          :color="mood.color"
          :size="14"
        />
      </div>
      <span
        :style="{
          flex: 1,
          fontSize: '11px',
          color: T.text,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }"
      >
        {{ MD[it.m]?.name }}
      </span>
    </div>

    <div :style="{ flex: 1 }" />

    <!-- Кнопка «Больше Света» / «Макс. N точек» -->
    <button
      v-if="canAdd"
      :style="{
        marginTop: '6px',
        padding: '7px 10px',
        background: RGBA.white10,
        border: `1px solid ${RGBA.white18}`,
        borderRadius: '6px',
        color: T.text,
        cursor: 'pointer',
        fontSize: '11px',
        fontWeight: 600,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '4px',
      }"
      @click="emit('add')"
    >
      <Icon name="up" :color="T.text" :size="14" />
      Больше Света
    </button>
    <button
      v-else
      :style="{
        marginTop: '6px',
        padding: '7px 10px',
        background: RGBA.white03,
        border: `1px solid ${RGBA.white08}`,
        borderRadius: '6px',
        color: T.textDim,
        cursor: 'pointer',
        fontSize: '11px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '4px',
      }"
      @click="emit('limitHit')"
    >
      Макс. {{ limit }} {{ pw(limit) }}
    </button>
  </div>
</template>
