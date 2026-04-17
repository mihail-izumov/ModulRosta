<script setup lang="ts">
/**
 * AddFxModal.vue — Двухшаговый пикер светильника.
 *
 * Источник: woodled-v42.jsx (AddFxModal).
 * Шаг 1: выбор модели/семейства (сетка 2×2).
 * Шаг 2 (для семейств >1): выбор размера (список с растущим кружком).
 */

import { computed, ref } from 'vue'
import { T, WCOL } from '../theme/tokens'
import {
  MD, ALL_ZONES, FAMILIES,
  type ZoneId, type ModelId, type FamilyId, type Fixture,
} from '../data/catalog'
import { type Wood } from '../data/materials'
import { lw } from '../engine/i18n'
import Modal from './ui/Modal.vue'
import Icon, { fxIcName } from './ui/Icons.vue'

interface Props {
  zone: ZoneId
  defWood: Wood
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

/* ──────────────── Шаг 2 ──────────────── */

const selFamily = ref<string | null>(null)

const familyGroup = computed<Group | null>(() => {
  if (!selFamily.value) return null
  return (
    groups.value.find((g) => g.family === selFamily.value || g.models[0] === selFamily.value) ??
    null
  )
})

function pickModel(mid: ModelId) {
  emit('add', { m: mid, q: 1, wood: props.defWood, zone: props.zone })
  emit('close')
}

function handleGroupClick(g: Group) {
  if (g.type === 'family' && g.models.length > 1) {
    selFamily.value = g.family ?? g.models[0]
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
</script>

<template>
  <!-- Шаг 2: размер внутри семейства -->
  <Modal v-if="selFamily && familyGroup" @close="emit('close')">
    <div :style="{ padding: '20px' }">
      <div :style="{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }">
        <button
          :style="{
            background: 'none',
            border: 'none',
            color: T.textSec,
            fontSize: '18px',
            cursor: 'pointer',
          }"
          @click="selFamily = null"
        >
          ←
        </button>
        <span :style="{ fontSize: '14px', fontWeight: 700, color: T.text }">
          {{ familyGroup.name }}
        </span>
      </div>

      <div :style="{ display: 'flex', flexDirection: 'column', gap: '8px' }">
        <button
          v-for="(mid, idx) in familyGroup.models"
          :key="mid"
          :style="{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 14px',
            border: `1px solid ${T.border}`,
            borderRadius: '8px',
            background: T.card,
            cursor: 'pointer',
            textAlign: 'left',
            width: '100%',
          }"
          @click="pickModel(mid)"
        >
          <div
            :style="{
              width: '40px',
              flexShrink: 0,
              display: 'flex',
              justifyContent: 'center',
            }"
          >
            <div
              :style="{
                width: `${12 + ((idx + 1) / familyGroup.models.length) * 24}px`,
                height: `${12 + ((idx + 1) / familyGroup.models.length) * 24}px`,
                borderRadius: '50%',
                background: T.neutral + '25',
                border: `2px solid ${T.neutral}55`,
              }"
            />
          </div>
          <div :style="{ flex: 1 }">
            <div :style="{ fontSize: '14px', fontWeight: 700, color: T.text }">
              {{ MD[mid].name }}
            </div>
            <div :style="{ fontSize: '11px', color: T.textSec }">
              {{ MD[mid].lamps }} {{ lw(MD[mid].lamps) }} ·
              {{ (MD[mid].lamps * MD[mid].lmPer).toLocaleString('ru-RU') }} лм
            </div>
          </div>
          <span
            :style="{
              padding: '4px 10px',
              borderRadius: '6px',
              background: T.neutral + '15',
              fontSize: '12px',
              fontWeight: 700,
              color: T.text,
              flexShrink: 0,
            }"
          >
            {{ MD[mid].sqMin }}–{{ MD[mid].sqMax }} м²
          </span>
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
        @click="selFamily = null"
      >
        Назад
      </button>
    </div>
  </Modal>

  <!-- Шаг 1: выбор модели/семейства -->
  <Modal v-else @close="emit('close')">
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
            {{ g.models.length }} {{ sizesLabel(g.models.length) }} ·
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
