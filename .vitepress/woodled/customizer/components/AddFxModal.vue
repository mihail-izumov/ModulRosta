<script setup lang="ts">
/**
 * AddFxModal.vue — Одношаговый пикер светильника.
 *
 * Источник: woodled-v42.jsx (AddFxModal).
 * Один шаг: выбор модели/семейства (сетка 2×2).
 * Размер внутри семейства подбирается автоматически через pickBestSize
 * на основе площади комнаты и дефицита люмен (см. AUTOSIZE.md).
 */

import { computed } from 'vue'
import { T, WCOL } from '../theme/tokens'
import {
  MD, ALL_ZONES, FAMILIES,
  type ZoneId, type ModelId, type FamilyId, type Fixture,
} from '../data/catalog'
import { type Wood } from '../data/materials'
import { lw } from '../engine/i18n'
import { pickBestSize } from '../engine/autosize'
import Modal from './ui/Modal.vue'
import Icon, { fxIcName } from './ui/Icons.vue'

interface Props {
  zone: ZoneId
  defWood: Wood
  roomArea: number
  roomBaseLm: number
  roomCurrentLm: number
}
const props = defineProps<Props>()
const emit = defineEmits<{
  add: [fx: Fixture]
  close: []
}>()

/* ──────────────── Группы моделей ──────────────── */

interface Group {
  type: 'family' | 'single'
  family?: FamilyId
  name: string
  models: ModelId[]
}

const zone = computed(() => ALL_ZONES.find((z) => z.id === props.zone)!)

const groups = computed<Group[]>(() => {
  const seen = new Set<string>()
  const out: Group[] = []
  for (const mid of zone.value.models) {
    const m = MD[mid]
    if (!m || seen.has(mid)) continue
    if (m.family && FAMILIES[m.family]) {
      if (!seen.has(m.family)) {
        seen.add(m.family)
        const fams = FAMILIES[m.family].filter((fid) => zone.value.models.includes(fid))
        if (fams.length > 0) {
          const baseName =
            fams.length > 1
              ? (MD[fams[0]].name.replace(/ [SML]$| \d+$/, '') as string)
              : MD[fams[0]].name
          out.push({
            type: 'family',
            family: m.family,
            name: baseName,
            models: [...fams],
          })
        }
      }
      seen.add(mid)
    } else {
      seen.add(mid)
      out.push({ type: 'single', name: m.name, models: [mid] })
    }
  }
  return out
})

/* ──────────────── Действия ──────────────── */

function pickModel(mid: ModelId) {
  emit('add', { m: mid, q: 1, wood: props.defWood, zone: props.zone })
  emit('close')
}

/**
 * Клик по группе:
 * - Семейство > 1 модели → pickBestSize автоматически подбирает размер
 * - Одна модель → добавляем её напрямую
 */
function handleGroupClick(g: Group) {
  if (g.type === 'family' && g.models.length > 1) {
    const deficit = props.roomBaseLm - props.roomCurrentLm
    const bestMid = pickBestSize(g.models, props.roomArea, deficit)
    pickModel(bestMid)
  } else {
    pickModel(g.models[0])
  }
}

function sizesLabel(count: number): string {
  if (count > 4) return 'размеров'
  if (count > 1) return 'размера'
  return 'размер'
}

function minSqOf(models: ModelId[]): number {
  return Math.min(...models.map((id) => MD[id].sqMin))
}
function maxSqOf(models: ModelId[]): number {
  return Math.max(...models.map((id) => MD[id].sqMax))
}

/**
 * Какой размер подберёт система — для подсказки под карточкой семейства.
 */
function autoPickName(g: Group): string | null {
  if (g.type !== 'family' || g.models.length <= 1) return null
  const deficit = props.roomBaseLm - props.roomCurrentLm
  const bestMid = pickBestSize(g.models, props.roomArea, deficit)
  return MD[bestMid]?.name ?? null
}
</script>

<template>
  <Modal @close="emit('close')">
    <div :style="{ padding: '20px' }">
      <div
        :style="{
          fontSize: '14px',
          fontWeight: 700,
          color: T.text,
          marginBottom: '14px',
        }"
      >
        {{ zone.name }} — выберите модель
      </div>
      <div :style="{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }">
        <button
          v-for="(g, i) in groups"
          :key="i"
          :style="{
            padding: '14px',
            border: `1px solid ${T.border}`,
            borderRadius: '8px',
            background: T.card,
            cursor: 'pointer',
            textAlign: 'center',
          }"
          @click="handleGroupClick(g)"
        >
          <Icon
            :name="fxIcName(MD[g.models[0]].type)"
            :color="WCOL[props.defWood]"
            :size="28"
          />
          <div
            :style="{
              fontSize: '12px',
              fontWeight: 600,
              color: T.text,
              marginTop: '6px',
            }"
          >
            {{ g.name }}
          </div>
          <div
            v-if="g.type === 'family' && g.models.length > 1"
            :style="{ fontSize: '10px', color: T.neutral, marginTop: '2px' }"
          >
            {{ minSqOf(g.models) }}–{{ maxSqOf(g.models) }} м²
          </div>
          <div
            v-else
            :style="{ fontSize: '10px', color: T.textDim, marginTop: '2px' }"
          >
            {{ MD[g.models[0]].lamps }} {{ lw(MD[g.models[0]].lamps) }}
            <template v-if="MD[g.models[0]].sqMin">
              · {{ MD[g.models[0]].sqMin }}–{{ MD[g.models[0]].sqMax }} м²
            </template>
          </div>
          <!-- Подсказка: какой размер подберёт система -->
          <div
            v-if="autoPickName(g)"
            :style="{
              fontSize: '9px',
              color: T.green,
              marginTop: '4px',
              fontWeight: 600,
            }"
          >
            → {{ autoPickName(g) }}
          </div>
        </button>
      </div>

      <button
        :style="{
          marginTop: '12px',
          width: '100%',
          padding: '10px',
          background: 'none',
          border: `1px solid ${T.border}`,
          borderRadius: '6px',
          cursor: 'pointer',
          color: T.textSec,
        }"
        @click="emit('close')"
      >
        Отмена
      </button>
    </div>
  </Modal>
</template>
