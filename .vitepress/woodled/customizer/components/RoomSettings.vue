<script setup lang="ts">
/**
 * RoomSettings.vue — Полноэкранный экран настроек комнаты.
 *
 * Источник: woodled-v42.jsx (showSettings ветка в RoomDetail).
 * Содержит: название, размер (3 пресета + своя), потолок, лимиты точек по зонам.
 */

import { computed, ref } from 'vue'
import { T, Z } from '../theme/tokens'
import { SZ, type Room, type RoomType, type ZoneLimits } from '../data/rooms'
import type { ZoneId } from '../data/catalog'
import { baseLm, getArea } from '../engine/brightness'
import { pw } from '../engine/i18n'
import { roomZones } from '../engine/zone-engine'
import Chip from './ui/Chip.vue'
import Sec from './ui/Sec.vue'
import Icon from './ui/Icons.vue'

interface Props {
  rt: RoomType
  room: Room
}
const props = defineProps<Props>()
const emit = defineEmits<{
  patch: [key: keyof Room, value: unknown, toast?: string]
  close: []
}>()

const editName = ref(false)

const zones = computed(() => roomZones(props.rt))

function updateSize(i: 0 | 1 | 2) {
  const label = SZ[i]
  const lm = Math.round(
    props.rt.lux * props.rt.sizes[i] * (props.room.ceilingH / 2.7),
  )
  emit('patch', 'sizeIndex', i, `${label}: нужно ${lm.toLocaleString('ru-RU')} лм`)
}

function updateCustomSize() {
  emit('patch', 'sizeIndex', 3)
}

function updateCustomArea(v: number) {
  emit('patch', 'customArea', v, `${v} м²`)
}

function updateCeiling(h: number) {
  const lm = Math.round(props.rt.lux * getArea(props.rt, props.room) * (h / 2.7))
  emit('patch', 'ceilingH', h, `Потолок ${h.toFixed(1)}м — нужно ${lm.toLocaleString('ru-RU')} лм`)
}

function updateLimit(zid: ZoneId, delta: -1 | 1) {
  const cur = (props.room.limits ?? props.rt.limits)?.[zid] ?? 1
  const next = Math.max(0, cur + delta)
  const nl: ZoneLimits = { ...(props.room.limits ?? props.rt.limits), [zid]: next }
  const zoneName = zones.value.find((z) => z.id === zid)?.name ?? zid
  emit('patch', 'limits', nl, `${zoneName}: макс ${next} ${pw(next)}`)
}

function saveName(nextName: string) {
  emit('patch', 'customName', nextName, 'Название сохранено')
  editName.value = false
}

/* Базовый расчёт для подсказки */
const areaForHint = computed(() => getArea(props.rt, props.room))

/* Заглушка, используется чтобы избежать ошибки линтера. */
void baseLm
</script>

<template>
  <div
    :style="{
      position: 'fixed',
      inset: 0,
      background: T.bg,
      zIndex: Z.fullscreenModal,
      overflow: 'auto',
    }"
  >
    <div :style="{ padding: '20px', maxWidth: '480px', margin: '0 auto' }">
      <!-- Header -->
      <div
        :style="{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '20px',
        }"
      >
        <button
          :style="{
            background: 'none',
            border: 'none',
            color: T.textSec,
            fontSize: '20px',
            cursor: 'pointer',
          }"
          @click="emit('close')"
        >
          ←
        </button>
        <span
          :style="{
            flex: 1,
            fontSize: '16px',
            fontWeight: 700,
            color: T.text,
          }"
        >
          {{ props.room.customName || props.rt.name }}
        </span>
        <button
          :style="{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px',
          }"
          @click="editName = !editName"
        >
          <Icon name="pen" :color="T.textSec" :size="16" />
        </button>
      </div>

      <!-- Редактирование имени -->
      <div
        v-if="editName"
        :style="{
          marginBottom: '16px',
          background: T.card,
          borderRadius: '8px',
          padding: '12px',
        }"
      >
        <div :style="{ fontSize: '11px', color: T.textDim, marginBottom: '6px' }">
          Название комнаты
        </div>
        <div :style="{ display: 'flex', gap: '8px' }">
          <input
            :value="props.room.customName || ''"
            :placeholder="props.rt.name"
            autofocus
            :style="{
              flex: 1,
              padding: '8px 10px',
              background: T.bg,
              border: `1px solid ${T.border}`,
              borderRadius: '6px',
              color: T.text,
              fontSize: '14px',
              outline: 'none',
            }"
            @input="emit('patch', 'customName', ($event.target as HTMLInputElement).value)"
            @keydown.enter="saveName(props.room.customName)"
          />
          <button
            :style="{
              padding: '8px 14px',
              background: T.neutral,
              color: T.bg,
              border: 'none',
              borderRadius: '6px',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '12px',
            }"
            @click="saveName(props.room.customName)"
          >
            OK
          </button>
        </div>
      </div>

      <!-- Размер -->
      <Sec label="Размер">
        <div :style="{ display: 'flex', gap: '5px' }">
          <Chip
            v-for="(label, i) in SZ.slice(0, 3)"
            :key="i"
            :active="props.room.sizeIndex === i"
            :style="{ flex: 1, textAlign: 'center' }"
            @click="updateSize(i as 0 | 1 | 2)"
          >
            <div>{{ label }}</div>
            <div :style="{ fontSize: '9px', opacity: 0.6 }">{{ props.rt.ranges[i] }} м²</div>
          </Chip>
        </div>
        <button
          :style="{
            marginTop: '6px',
            width: '100%',
            padding: '10px 0',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '12px',
            border: `1px solid ${props.room.sizeIndex === 3 ? T.neutral : T.border}`,
            background: props.room.sizeIndex === 3 ? T.neutral + '22' : 'transparent',
            color: props.room.sizeIndex === 3 ? T.text : T.textSec,
            textAlign: 'center',
          }"
          @click="updateCustomSize"
        >
          <template v-if="props.room.sizeIndex === 3">
            Своя:
            <input
              type="number"
              :value="props.room.customArea ?? ''"
              placeholder="25"
              :style="{
                width: '50px',
                padding: '2px 6px',
                background: T.bg,
                border: `1px solid ${T.neutral}44`,
                borderRadius: '4px',
                color: T.text,
                fontSize: '13px',
                textAlign: 'center',
                outline: 'none',
              }"
              @click.stop
              @input="updateCustomArea(+($event.target as HTMLInputElement).value)"
            />
            м²
          </template>
          <template v-else>Своя площадь</template>
        </button>
      </Sec>

      <!-- Потолок -->
      <Sec :label="`Потолок: ${props.room.ceilingH} м`">
        <input
          type="range"
          min="2.2"
          max="4.5"
          step="0.1"
          :value="props.room.ceilingH"
          :style="{ width: '100%', accentColor: T.neutral }"
          @input="updateCeiling(+($event.target as HTMLInputElement).value)"
        />
      </Sec>

      <!-- Лимиты точек -->
      <Sec label="Точки для света">
        <div :style="{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }">
          <div
            v-for="z in zones"
            :key="z.id"
            :style="{
              background: T.card,
              borderRadius: '8px',
              padding: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }"
          >
            <span :style="{ fontSize: '12px', color: T.text }">{{ z.name }}</span>
            <div :style="{ display: 'flex', alignItems: 'center', gap: '4px' }">
              <button
                :style="{
                  width: '26px',
                  height: '26px',
                  borderRadius: '4px',
                  background: T.border,
                  border: 'none',
                  color: T.text,
                  cursor: 'pointer',
                }"
                @click="updateLimit(z.id, -1)"
              >
                −
              </button>
              <span
                :style="{
                  fontSize: '13px',
                  fontWeight: 700,
                  color: T.text,
                  minWidth: '18px',
                  textAlign: 'center',
                }"
              >
                {{ (props.room.limits ?? props.rt.limits)[z.id] ?? 1 }}
              </span>
              <button
                :style="{
                  width: '26px',
                  height: '26px',
                  borderRadius: '4px',
                  background: T.border,
                  border: 'none',
                  color: T.text,
                  cursor: 'pointer',
                }"
                @click="updateLimit(z.id, 1)"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </Sec>

      <button
        :style="{
          width: '100%',
          padding: '10px',
          background: T.neutral,
          color: T.bg,
          border: 'none',
          borderRadius: '6px',
          fontWeight: 700,
          cursor: 'pointer',
        }"
        @click="emit('close')"
      >
        Сохранить
      </button>

      <!-- hidden — для избегания warnings -->
      <span v-show="false">{{ areaForHint }}</span>
    </div>
  </div>
</template>
