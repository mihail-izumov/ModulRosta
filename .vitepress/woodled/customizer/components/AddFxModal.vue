<script setup lang="ts">
/**
 * AddFxModal.vue — Горизонтальный слайдер коллекций.
 *
 * v3: Вертикальные карточки 3:4 с фото, автослайдер,
 *     сегменты, «Уже в {комнате}» оверлей.
 */

import { computed, ref, onMounted, onUnmounted } from 'vue'
import { T } from '../theme/tokens'
import {
  MD, ALL_ZONES, FAMILIES,
  type ZoneId, type ModelId, type FamilyId, type Fixture,
} from '../data/catalog'
import { type Wood } from '../data/materials'
import { pickBestSize } from '../engine/autosize'

interface Props {
  zone: ZoneId
  defWood: Wood
  roomArea: number
  roomBaseLm: number
  roomCurrentLm: number
  roomFixtures?: Fixture[]
  roomName?: string
}
const props = withDefaults(defineProps<Props>(), { roomFixtures: () => [], roomName: '' })
const emit = defineEmits<{ add: [fx: Fixture]; close: [] }>()

/* ──────────── Склонение: «Уже в Гостиной» ──────────── */

function inRoom(name: string): string {
  if (!name) return ''
  if (name.endsWith('ая')) return name.slice(0, -2) + 'ой'
  if (name.endsWith('яя')) return name.slice(0, -2) + 'ей'
  if (name.endsWith('ня')) return name.slice(0, -2) + 'не'
  if (name.endsWith('я')) return name.slice(0, -1) + 'е'
  if (name.endsWith('а')) return name.slice(0, -1) + 'е'
  return name + 'е'
}

/* ──────────── Группы (как раньше, но упрощённые) ──────────── */

interface Group {
  type: 'family' | 'single'
  family?: FamilyId
  name: string
  models: ModelId[]
}

const zone = computed(() => ALL_ZONES.find(z => z.id === props.zone)!)

const groups = computed<Group[]>(() => {
  const seen = new Set<string>()
  const out: Group[] = []
  for (const mid of zone.value.models) {
    const m = MD[mid]
    if (!m || seen.has(mid)) continue
    if (m.family && FAMILIES[m.family]) {
      if (!seen.has(m.family)) {
        seen.add(m.family)
        const fams = FAMILIES[m.family].filter(fid => zone.value.models.includes(fid))
        if (fams.length > 0) {
          const baseName = fams.length > 1
            ? (MD[fams[0]].name.replace(/ [SML]$| \d+$/, '') as string)
            : MD[fams[0]].name
          out.push({ type: 'family', family: m.family, name: baseName, models: fams })
        }
      }
    } else {
      seen.add(mid)
      out.push({ type: 'single', name: m.name, models: [mid] })
    }
  }
  return out
})

/* ──────────── Уже добавленные семейства ──────────── */

const addedFamilies = computed(() => {
  const set = new Set<string>()
  for (const fx of props.roomFixtures) {
    const m = MD[fx.m]
    if (m?.family) set.add(m.family)
    else set.add(fx.m)
  }
  return set
})

function isAdded(g: Group): boolean {
  if (g.family) return addedFamilies.value.has(g.family)
  return addedFamilies.value.has(g.models[0])
}

/* ──────────── Площадь покрытия ──────────── */

function sqRange(models: ModelId[]): string {
  const mins = models.map(id => MD[id].sqMin).filter(Boolean)
  const maxs = models.map(id => MD[id].sqMax).filter(Boolean)
  if (mins.length === 0) return ''
  return `${Math.min(...mins)}–${Math.max(...maxs)} м²`
}

/* ──────────── Фото коллекции ──────────── */

const PHOTO_MAP: Record<string, string> = {
  rotor: 'rotor_family',
  rotor_x: 'rotor-x_family',
  elliptical: 'elliptical_family',
  spot: 'spot_family',
  bra_v: 'bra_vertical_family',
  bra_h: 'bra_horizontal_family',
  unit: 'unit_family',
  table_lamp: 'table_lamp',
  floor_lamp: 'floor_lamp',
  floor_lamp_s: 'floor_lamp_s',
}

function collectionPhotos(g: Group): [string, string] {
  const key = g.family ?? g.models[0]
  const prefix = PHOTO_MAP[key] ?? key
  const base = '/woodled/customizer/collections/'
  return [`${base}${prefix}_1.jpg`, `${base}${prefix}_2.jpg`]
}

/* ──────────── Выбор ──────────── */

const selected = ref<number | null>(null)

function handleSelect(idx: number) {
  const g = groups.value[idx]
  if (isAdded(g)) return
  if (selected.value === idx) {
    // Подтверждение — добавить
    confirmAdd(g)
  } else {
    selected.value = idx
  }
}

function confirmAdd(g: Group) {
  let mid: ModelId
  if (g.models.length === 1) {
    mid = g.models[0]
  } else {
    const deficit = props.roomBaseLm - props.roomCurrentLm
    mid = pickBestSize(g.models, props.roomArea, deficit)
  }
  const m = MD[mid]
  emit('add', { m: mid, q: 1, wood: props.defWood, zone: props.zone, l: m.lamps })
}

/* ──────────── Скролл-трекинг ──────────── */

const CARD_W = 220
const GAP = 12
const scrollEl = ref<HTMLDivElement | null>(null)
const activeIdx = ref(0)

function onScroll() {
  if (!scrollEl.value) return
  const idx = Math.round(scrollEl.value.scrollLeft / (CARD_W + GAP))
  activeIdx.value = Math.min(idx, groups.value.length - 1)
}

function scrollTo(idx: number) {
  scrollEl.value?.scrollTo({ left: idx * (CARD_W + GAP), behavior: 'smooth' })
}

/* ──────────── Фото-слайдер (CSS-driven) ──────────── */

const photoPhase = ref(0)
let photoTimer: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  photoTimer = setInterval(() => { photoPhase.value = (photoPhase.value + 1) % 2 }, 3500)
})
onUnmounted(() => { if (photoTimer) clearInterval(photoTimer) })
</script>

<template>
  <!-- Fullscreen overlay -->
  <div :style="{
    position: 'fixed', inset: 0, zIndex: 40,
    background: 'rgba(0,0,0,.7)',
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    gap: '16px', padding: '0 16px',
  }" @click.self="emit('close')">

    <!-- Zone badge — OUTSIDE modal -->
    <div :style="{
      padding: '8px 20px', borderRadius: '22px',
      background: T.neutral + '22', border: `1px solid ${T.neutral}44`,
      fontSize: '14px', fontWeight: 600, color: T.neutral,
    }">
      {{ zone.name }}
    </div>

    <!-- Modal card -->
    <div :style="{
      width: '100%', maxWidth: '400px',
      background: T.card, borderRadius: '18px',
      border: `1px solid ${T.border}`, overflow: 'hidden',
    }">
      <!-- Title -->
      <div :style="{ padding: '18px 24px 8px', textAlign: 'center', fontSize: '17px', fontWeight: 700, color: T.text }">
        Коллекции WOODLED
      </div>

      <!-- Segment indicators -->
      <div :style="{ display: 'flex', justifyContent: 'center', gap: '5px', padding: '0 24px 14px' }">
        <button
          v-for="(_, i) in groups"
          :key="i"
          :style="{
            height: '4px', border: 'none', cursor: 'pointer',
            width: '36px', borderRadius: '2px', padding: 0,
            background: i === activeIdx ? T.neutral : T.neutral + '33',
            transition: 'background .3s',
          }"
          @click="scrollTo(i)"
        />
      </div>

      <!-- Horizontal slider -->
      <div
        ref="scrollEl"
        class="fx-add-slider"
        :style="{
          overflowX: 'auto', overflowY: 'hidden',
          display: 'flex', gap: GAP + 'px',
          padding: `0 ${GAP}px 20px 24px`,
          WebkitOverflowScrolling: 'touch',
        }"
        @scroll="onScroll"
      >
        <button
          v-for="(g, i) in groups"
          :key="i"
          :style="{
            flexShrink: 0, width: CARD_W + 'px',
            cursor: isAdded(g) ? 'not-allowed' : 'pointer',
            border: 'none',
            background: selected === i
              ? `linear-gradient(135deg, ${T.neutral}44, ${T.neutral}22)`
              : 'transparent',
            borderRadius: '18px', padding: '6px',
            textAlign: 'center',
            transition: 'all .35s ease',
            opacity: (isAdded(g) || (selected !== null && selected !== i)) ? 0.4 : 1,
            filter: (isAdded(g) || (selected !== null && selected !== i)) ? 'brightness(0.65)' : 'none',
            position: 'relative',
          }"
          @click="handleSelect(i)"
        >
          <!-- Photo 3:4 -->
          <div :style="{ position: 'relative' }">
            <div :style="{
              width: '100%', aspectRatio: '3 / 4', borderRadius: '14px',
              overflow: 'hidden', position: 'relative',
              background: 'linear-gradient(170deg, #E8DFD0 0%, #D4C4A8 40%, #C8B894 100%)',
            }">
              <!-- Photo layer 1 -->
              <img
                :src="collectionPhotos(g)[0]"
                alt=""
                :style="{
                  position: 'absolute', inset: 0, width: '100%', height: '100%',
                  objectFit: 'cover',
                  opacity: photoPhase === 0 ? 1 : 0,
                  transition: 'opacity 1.2s ease-in-out',
                }"
                @error="($event.target as HTMLImageElement).style.display='none'"
              />
              <!-- Photo layer 2 -->
              <img
                :src="collectionPhotos(g)[1]"
                alt=""
                :style="{
                  position: 'absolute', inset: 0, width: '100%', height: '100%',
                  objectFit: 'cover',
                  opacity: photoPhase === 1 ? 1 : 0,
                  transition: 'opacity 1.2s ease-in-out',
                }"
                @error="($event.target as HTMLImageElement).style.display='none'"
              />
            </div>

            <!-- Overlay: «Уже в ...» -->
            <div
              v-if="isAdded(g) && props.roomName"
              :style="{
                position: 'absolute', inset: 0, borderRadius: '14px',
                background: 'rgba(10,9,8,0.65)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }"
            >
              <div :style="{ fontSize: '13px', fontWeight: 600, color: T.text }">
                Уже в {{ inRoom(props.roomName) }}
              </div>
            </div>
          </div>

          <!-- Name + badge -->
          <div :style="{ padding: '10px 4px 8px' }">
            <div :style="{ fontSize: '16px', fontWeight: 700, color: T.text, marginBottom: '6px' }">
              {{ g.name }}
            </div>
            <span
              v-if="sqRange(g.models)"
              :style="{
                display: 'inline-block',
                padding: '3px 12px', borderRadius: '10px',
                background: T.neutral + '22',
                border: `1px solid ${T.neutral}44`,
                fontSize: '12px', fontWeight: 600, color: T.neutral,
              }"
            >
              {{ sqRange(g.models) }}
            </span>
          </div>
        </button>
        <!-- Right spacer -->
        <div :style="{ flexShrink: 0, width: '12px' }" />
      </div>

      <!-- Cancel -->
      <div :style="{ padding: '0 24px 18px' }">
        <button
          :style="{
            width: '100%', padding: '12px', background: 'none',
            border: `1px solid ${T.border}`, borderRadius: '10px',
            cursor: 'pointer', color: T.textSec, fontSize: '13px',
          }"
          @click="emit('close')"
        >
          Отмена
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fx-add-slider::-webkit-scrollbar { display: none; }
.fx-add-slider { -ms-overflow-style: none; scrollbar-width: none; }
</style>
