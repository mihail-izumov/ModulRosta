<script setup lang="ts">
/**
 * HouseStats.vue — Виджет дома (приборная панель).
 *
 * Архитектура (после правок v3):
 *
 *   ┌──────────────────────────────────┐
 *   │  S комнат  │ потолок │  свет     │  ← инвертированная панель
 *   │   26       │  2.7    │  5/16     │     (тап для деталей с фокусом
 *   └──────────────────────────────────┘      на параметре)
 *
 *   ┌──────────────────────────────────┐
 *   │  Подсказка (скрываемая) ...   ✕  │  ← пока tour не пройден
 *   └──────────────────────────────────┘
 *
 *   ┌──────────────────────────────────┐
 *   │  Дополнительно           ▼/▲     │  ← всегда видный блок
 *   ├──────────────────────────────────┤     (раскрывает 2 действия)
 *   │  🔗 Сохранить ссылку на дом      │
 *   │  ⇄ Начать заново                 │
 *   └──────────────────────────────────┘
 *
 *   Expand-панель появляется ниже при тапе на виджет — содержит
 *   разбивку по комнатам без действий (они теперь снаружи).
 *
 * Это даёт быстрый доступ к ключевым действиям без необходимости
 * раскрывать виджет: «Дополнительно» — отдельная утилитарная зона,
 * виджет — главная приборная панель.
 *
 * Эмиты: shareLink, changeHome.
 */

import { computed, onMounted, ref } from 'vue'
import { T } from '../theme/tokens'
import { useConfigurator } from '../store/configurator'
import { getRT, type Room } from '../data/rooms'
import { getArea } from '../engine/brightness'

type FieldId = 'area' | 'ceiling' | 'light'

const cfg = useConfigurator()

const emit = defineEmits<{
  shareLink: []
  changeHome: []
}>()

/* ────────── Производные данные ────────── */


const totalArea = computed<number | null>(() => {
  if (cfg.rooms.length === 0) return null
  return Math.round(
    cfg.rooms.reduce((s, r) => s + getArea(getRT(r.typeId), r as Room), 0),
  )
})

const ceilingDisplay = computed<string | null>(() => {
  if (cfg.rooms.length === 0) return null
  const heights = [...new Set(cfg.rooms.map((r) => r.ceilingH))].sort(
    (a, b) => a - b,
  )
  if (heights.length === 1) return heights[0].toFixed(1)
  return `${heights[0].toFixed(1)}–${heights[heights.length - 1].toFixed(1)}`
})

const lightPoints = computed<{ used: number; max: number } | null>(() => {
  if (cfg.rooms.length === 0) return null
  let used = 0
  let max = 0
  for (const r of cfg.rooms) {
    const rt = getRT(r.typeId)
    /* Defensive: r.limits может быть пустым объектом или undefined
       при некорректной миграции state — фолбэк на rt.limits. */
    const limits = (r.limits && Object.keys(r.limits).length > 0)
      ? r.limits
      : rt.limits
    for (const z of rt.zones) {
      max += limits[z] ?? 0
    }
    for (const fx of r.fixtures) {
      used += fx.q ?? 1
    }
  }
  return { used, max }
})

const isEmpty = computed(() => cfg.rooms.length === 0)

/* ────────── Разбивка по комнатам ────────── */

interface RoomBreakdownAll {
  id: string
  name: string
  area: number
  ceiling: number
  fxCount: number
  pointsMax: number
}

const roomsAll = computed<RoomBreakdownAll[]>(() =>
  cfg.rooms.map((r) => {
    const rt = getRT(r.typeId)
    const limits = (r.limits && Object.keys(r.limits).length > 0)
      ? r.limits
      : rt.limits
    let pointsMax = 0
    for (const z of rt.zones) pointsMax += limits[z] ?? 0
    let fxCount = 0
    for (const fx of r.fixtures) fxCount += fx.q ?? 1
    return {
      id: r.id,
      name: r.customName || rt.name,
      area: Math.round(getArea(rt, r as Room)),
      ceiling: r.ceilingH,
      fxCount,
      pointsMax,
    }
  }),
)

const roomsByArea = computed(() =>
  cfg.rooms.map((r) => {
    const rt = getRT(r.typeId)
    /* Clamp sizeIndex в [0,2] на случай неконсистентного state. */
    const raw = r.sizeIndex ?? 1
    const idx = (raw >= 0 && raw <= 2 ? raw : 1) as 0 | 1 | 2
    const display = (r.sizeIndex === 3 && r.customArea != null)
      ? `${r.customArea} м²`
      : `${rt.ranges[idx]} м²`
    return { id: r.id, name: r.customName || rt.name, display }
  }),
)

const roomsByCeiling = computed(() =>
  cfg.rooms.map((r) => ({
    id: r.id,
    name: r.customName || getRT(r.typeId).name,
    ceiling: r.ceilingH,
  })),
)

const roomsByLight = computed(() =>
  cfg.rooms.map((r) => {
    const rt = getRT(r.typeId)
    const limits = (r.limits && Object.keys(r.limits).length > 0)
      ? r.limits
      : rt.limits
    let pointsMax = 0
    for (const z of rt.zones) pointsMax += limits[z] ?? 0
    let fxCount = 0
    for (const fx of r.fixtures) fxCount += fx.q ?? 1
    return { id: r.id, name: r.customName || rt.name, fxCount, pointsMax }
  }),
)

/* ────────── Expand state ────────── */

const expanded = ref(false)
const focusField = ref<FieldId | null>(null)
const moreOpen = ref(false)

function toggleExpand(field: FieldId | null = null) {
  if (focusField.value === field && expanded.value) {
    expanded.value = false
    focusField.value = null
  } else {
    expanded.value = true
    focusField.value = field
  }
  if (!cfg.dashboardTourSeen.value) {
    cfg.markDashboardTourSeen()
  }
}

/* ────────── Spotlight tour ────────── */

const tourActive = ref(false)
const tourStep = ref<0 | 1 | 2>(0)

const TOUR_FIELDS: { id: FieldId; title: string; text: string }[] = [
  {
    id: 'area',
    title: 'S комнат',
    text: 'Сумма площадей всех комнат вашего плана. Меняется при добавлении новой или изменении размера.',
  },
  {
    id: 'ceiling',
    title: 'Потолок',
    text: 'Высота потолков. Чем выше — тем больше люмен нужно для комфортного света.',
  },
  {
    id: 'light',
    title: 'Свет',
    text: 'Светильников установлено / точек подключения. Чем больше точек — тем гибче можно расставлять свет.',
  },
]

function startTour() {
  tourActive.value = true
  tourStep.value = 0
}

function nextTourStep() {
  if (tourStep.value < 2) {
    tourStep.value = (tourStep.value + 1) as 0 | 1 | 2
  } else {
    finishTour()
  }
}

function finishTour() {
  tourActive.value = false
  cfg.markDashboardTourSeen()
}

onMounted(() => {
  if (!cfg.dashboardTourSeen.value && cfg.rooms.length > 0) {
    setTimeout(() => {
      if (!cfg.dashboardTourSeen.value) startTour()
    }, 600)
  }
})

/* ────────── Toast ────────── */

const fieldToast = ref<string | null>(null)
let toastTimer: ReturnType<typeof setTimeout> | null = null

function showFieldToast(field: FieldId) {
  const t = TOUR_FIELDS.find((x) => x.id === field)
  if (!t) return
  fieldToast.value = t.text
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => {
    fieldToast.value = null
  }, 4500)
}

function onFieldTap(field: FieldId) {
  if (tourActive.value) return
  showFieldToast(field)
  toggleExpand(field)
}

function onWidgetTap() {
  if (tourActive.value) return
  if (expanded.value && focusField.value === null) {
    expanded.value = false
    focusField.value = null
  } else {
    toggleExpand(null)
  }
}

function dismissHint() {
  if (!cfg.dashboardTourSeen.value) {
    cfg.markDashboardTourSeen()
  }
}

/* ────────── Действия — теперь снаружи в блоке «Дополнительно» ────────── */

function onSaveLinkClick() {
  emit('shareLink')
  moreOpen.value = false
}

function onChangeHomeClick() {
  emit('changeHome')
  moreOpen.value = false
}

/* ────────── Стили ────────── */

const PANEL_BG = T.text
const PANEL_FG = T.bg
const PANEL_FG_SEC = T.cardAlt
const PANEL_DIVIDER = 'rgba(19,17,14,0.12)'
const PANEL_FOCUS_BG = 'rgba(19,17,14,0.06)'

function fieldStyle(field: FieldId) {
  const isFocused = expanded.value && focusField.value === field
  return {
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4px',
    padding: '4px 0',
    borderRadius: '6px',
    background: isFocused ? PANEL_FOCUS_BG : 'transparent',
    transition: 'background .2s',
    cursor: isEmpty.value ? 'default' : 'pointer',
  }
}

const tourCurrentField = computed<FieldId>(() => TOUR_FIELDS[tourStep.value].id)
const tourCurrentText = computed(() => TOUR_FIELDS[tourStep.value])
</script>

<template>
  <div :style="{ position: 'relative' }">
    <!-- ═══════ ВИДЖЕТ — ИНВЕРТИРОВАННАЯ ПАНЕЛЬ ═══════ -->
    <div
      :style="{
        display: 'flex',
        alignItems: 'stretch',
        background: PANEL_BG,
        borderRadius: '14px',
        padding: '16px 4px',
        marginBottom: '8px',
        cursor: isEmpty ? 'default' : 'pointer',
        position: 'relative',
        zIndex: tourActive ? 60 : 1,
        boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
      }"
      @click.self="onWidgetTap"
    >
      <div :style="fieldStyle('area')" @click.stop="onFieldTap('area')">
        <div
          :style="{
            fontSize: '9px', fontWeight: 700, color: PANEL_FG_SEC,
            textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.7,
          }"
        >
          S комнат
        </div>
        <div
          :style="{
            fontSize: '28px', fontWeight: 800,
            color: isEmpty ? PANEL_FG_SEC : PANEL_FG,
            fontVariantNumeric: 'tabular-nums', lineHeight: 1,
          }"
        >
          {{ totalArea ?? '—' }}
        </div>
        <div :style="{ fontSize: '11px', color: PANEL_FG_SEC, opacity: 0.7 }">м²</div>
      </div>

      <div :style="{ width: '1px', background: PANEL_DIVIDER, margin: '4px 0' }" />

      <div :style="fieldStyle('ceiling')" @click.stop="onFieldTap('ceiling')">
        <div
          :style="{
            fontSize: '9px', fontWeight: 700, color: PANEL_FG_SEC,
            textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.7,
          }"
        >
          потолок
        </div>
        <div
          :style="{
            fontSize: '28px', fontWeight: 800,
            color: isEmpty ? PANEL_FG_SEC : PANEL_FG,
            fontVariantNumeric: 'tabular-nums', lineHeight: 1,
          }"
        >
          {{ ceilingDisplay ?? '—' }}
        </div>
        <div :style="{ fontSize: '11px', color: PANEL_FG_SEC, opacity: 0.7 }">м</div>
      </div>

      <div :style="{ width: '1px', background: PANEL_DIVIDER, margin: '4px 0' }" />

      <div :style="fieldStyle('light')" @click.stop="onFieldTap('light')">
        <div
          :style="{
            fontSize: '9px', fontWeight: 700, color: PANEL_FG_SEC,
            textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.7,
          }"
        >
          свет
        </div>
        <div
          :style="{
            fontSize: '28px', fontWeight: 800,
            color: isEmpty ? PANEL_FG_SEC : PANEL_FG,
            fontVariantNumeric: 'tabular-nums', lineHeight: 1,
            display: 'flex', alignItems: 'baseline',
          }"
        >
          <template v-if="lightPoints">
            <span>{{ lightPoints.used }}</span>
            <span
              :style="{
                fontSize: '14px', color: PANEL_FG_SEC,
                fontWeight: 500, opacity: 0.55,
              }"
            >
              /{{ lightPoints.max }}
            </span>
          </template>
          <template v-else>—</template>
        </div>
        <div :style="{ fontSize: '11px', color: PANEL_FG_SEC, opacity: 0.7 }">точек</div>
      </div>
    </div>

    <!-- ═══════ Скрываемая подсказка ═══════ -->
    <div
      v-if="!cfg.dashboardTourSeen.value && !isEmpty && !expanded && !tourActive"
      :style="{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 12px',
        background: T.neutral + '10',
        borderRadius: '8px',
        marginBottom: '8px',
        fontSize: '11px',
        color: T.textSec,
      }"
    >
      <span :style="{ flex: 1 }">
        Тапните на параметр или «Дополнительно» для деталей →
      </span>
      <button
        :style="{
          background: 'none', border: 'none', color: T.textDim,
          cursor: 'pointer', padding: '2px 6px', fontSize: '14px', lineHeight: 1,
        }"
        @click="dismissHint"
      >
        ✕
      </button>
    </div>

    <!-- ═══════ Expand-панель (только разбивка, без действий) ═══════ -->
    <div
      v-if="expanded && !isEmpty"
      :style="{
        background: T.card,
        border: `1px solid ${T.border}`,
        borderRadius: '12px',
        padding: '14px',
        marginBottom: '8px',
      }"
    >
      <!-- Если фокус — пояснение для конкретного поля -->
      <div
        v-if="focusField"
        :style="{
          background: T.neutral + '10',
          border: `1px solid ${T.neutral}22`,
          borderRadius: '8px',
          padding: '10px 12px',
          marginBottom: '12px',
        }"
      >
        <div
          :style="{
            fontSize: '10px', fontWeight: 700, color: T.neutral,
            textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '4px',
          }"
        >
          {{ TOUR_FIELDS.find(f => f.id === focusField)?.title }}
        </div>
        <div :style="{ fontSize: '12px', color: T.text, lineHeight: 1.5 }">
          {{ TOUR_FIELDS.find(f => f.id === focusField)?.text }}
        </div>
      </div>

      <div
        :style="{
          fontSize: '10px', fontWeight: 700, color: T.textDim,
          textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px',
        }"
      >
        по комнатам
      </div>

      <!-- Без фокуса — общая таблица -->
      <template v-if="focusField === null">
        <div
          v-for="r in roomsAll"
          :key="r.id"
          :style="{
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'baseline', padding: '8px 0',
            fontSize: '13px', color: T.text,
            borderBottom: `1px solid ${T.border}`, gap: '12px',
          }"
        >
          <span :style="{ flexShrink: 0 }">{{ r.name }}</span>
          <span
            :style="{
              color: T.textSec, fontVariantNumeric: 'tabular-nums',
              fontSize: '12px', textAlign: 'right',
            }"
          >
            {{ r.area }} м² · {{ r.ceiling.toFixed(1) }} м · {{ r.fxCount }}/{{ r.pointsMax }}
          </span>
        </div>
      </template>

      <!-- area: только диапазоны площадей -->
      <template v-else-if="focusField === 'area'">
        <div
          v-for="r in roomsByArea"
          :key="r.id"
          :style="{
            display: 'flex', justifyContent: 'space-between',
            padding: '8px 0', fontSize: '13px', color: T.text,
            borderBottom: `1px solid ${T.border}`,
          }"
        >
          <span>{{ r.name }}</span>
          <span :style="{ color: T.textSec, fontVariantNumeric: 'tabular-nums' }">
            {{ r.display }}
          </span>
        </div>
      </template>

      <!-- ceiling: только высоты -->
      <template v-else-if="focusField === 'ceiling'">
        <div
          v-for="r in roomsByCeiling"
          :key="r.id"
          :style="{
            display: 'flex', justifyContent: 'space-between',
            padding: '8px 0', fontSize: '13px', color: T.text,
            borderBottom: `1px solid ${T.border}`,
          }"
        >
          <span>{{ r.name }}</span>
          <span :style="{ color: T.textSec, fontVariantNumeric: 'tabular-nums' }">
            {{ r.ceiling.toFixed(1) }} м
          </span>
        </div>
      </template>

      <!-- light: светильники / точки -->
      <template v-else-if="focusField === 'light'">
        <div
          v-for="r in roomsByLight"
          :key="r.id"
          :style="{
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'baseline', padding: '8px 0',
            fontSize: '13px', color: T.text,
            borderBottom: `1px solid ${T.border}`, gap: '8px',
          }"
        >
          <span>{{ r.name }}</span>
          <span
            :style="{
              color: T.textSec, fontVariantNumeric: 'tabular-nums', fontSize: '12px',
            }"
          >
            {{ r.fxCount }}
            <span :style="{ color: T.textDim }">из</span>
            {{ r.pointsMax }} точек
          </span>
        </div>
      </template>
    </div>

    <!-- ═══════ Блок «Дополнительно» — всегда снаружи, на главном виде ═══════ -->
    <div :style="{ marginBottom: '16px' }">
      <button
        :style="{
          width: '100%',
          padding: '12px 14px',
          background: T.card,
          border: `1px solid ${T.border}`,
          borderRadius: '10px',
          color: T.text,
          cursor: 'pointer',
          fontSize: '13px',
          fontWeight: 600,
          fontFamily: 'inherit',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }"
        @click="moreOpen = !moreOpen"
      >
        <span :style="{ display: 'flex', alignItems: 'center', gap: '8px' }">
          <svg
            width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round"
            :style="{ color: T.textSec }"
          >
            <circle cx="12" cy="12" r="1" />
            <circle cx="19" cy="12" r="1" />
            <circle cx="5" cy="12" r="1" />
          </svg>
          Дополнительно
        </span>
        <svg
          width="14" height="14" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2"
          stroke-linecap="round" stroke-linejoin="round"
          :style="{
            transform: moreOpen ? 'rotate(180deg)' : 'none',
            transition: 'transform .2s',
            color: T.textSec,
          }"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      <!-- Раскрытое: 2 действия в столбец -->
      <div
        v-if="moreOpen"
        :style="{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          marginTop: '8px',
        }"
      >
        <!-- Сохранить ссылку -->
        <button
          :style="{
            width: '100%',
            padding: '14px',
            background: T.cardAlt,
            border: `1px solid ${T.border}`,
            borderRadius: '8px',
            color: T.text,
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: 600,
            fontFamily: 'inherit',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }"
          @click="onSaveLinkClick"
        >
          <svg
            width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round"
          >
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
          <span :style="{ color: T.text }">Сохранить ссылку на дом</span>
        </button>

        <!-- Начать заново -->
        <button
          :style="{
            width: '100%',
            padding: '14px',
            background: T.cardAlt,
            border: `1px solid ${T.border}`,
            borderRadius: '8px',
            color: T.text,
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: 600,
            fontFamily: 'inherit',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }"
          @click="onChangeHomeClick"
        >
          <svg
            width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round"
          >
            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
            <path d="M21 3v5h-5" />
            <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
            <path d="M8 16H3v5" />
          </svg>
          <span :style="{ color: T.text }">Начать заново</span>
        </button>
      </div>
    </div>

    <!-- ═══════ Toast ═══════ -->
    <div
      v-if="fieldToast && !expanded"
      :style="{
        position: 'fixed',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: T.text,
        color: T.bg,
        padding: '12px 18px',
        borderRadius: '10px',
        fontSize: '12px',
        fontWeight: 500,
        lineHeight: 1.5,
        zIndex: 95,
        maxWidth: '85%',
        textAlign: 'center',
        boxShadow: '0 4px 20px rgba(0,0,0,.4)',
      }"
    >
      {{ fieldToast }}
    </div>

    <!-- ═══════ Spotlight tour ═══════ -->
    <div
      v-if="tourActive"
      :style="{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.78)',
        zIndex: 55,
      }"
      @click="finishTour"
    />
    <div
      v-if="tourActive"
      :style="{
        position: 'fixed',
        bottom: '24px', left: '50%',
        transform: 'translateX(-50%)',
        width: 'calc(100% - 32px)',
        maxWidth: '420px',
        background: T.card,
        border: `1px solid ${T.neutral}33`,
        borderRadius: '14px',
        padding: '18px 20px',
        zIndex: 65,
        boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
      }"
    >
      <div :style="{ display: 'flex', gap: '4px', marginBottom: '12px' }">
        <div
          v-for="(_, i) in TOUR_FIELDS"
          :key="i"
          :style="{
            height: '3px', borderRadius: '2px',
            flex: i === tourStep ? 2 : 1,
            background: i === tourStep ? T.neutral : T.border,
            transition: 'all .3s',
          }"
        />
      </div>
      <div
        :style="{
          fontSize: '10px', fontWeight: 700, color: T.neutral,
          textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '6px',
        }"
      >
        {{ tourCurrentText.title }}
      </div>
      <div
        :style="{
          fontSize: '14px', color: T.text, lineHeight: 1.55, marginBottom: '16px',
        }"
      >
        {{ tourCurrentText.text }}
      </div>
      <div :style="{ display: 'flex', gap: '8px' }">
        <button
          :style="{
            flex: 1, padding: '10px', background: 'none',
            border: `1px solid ${T.border}`, color: T.textSec,
            borderRadius: '8px', cursor: 'pointer',
            fontSize: '13px', fontWeight: 600, fontFamily: 'inherit',
          }"
          @click="finishTour"
        >
          Пропустить
        </button>
        <button
          :style="{
            flex: 1, padding: '10px', background: T.neutral, color: T.bg,
            border: 'none', borderRadius: '8px', cursor: 'pointer',
            fontSize: '13px', fontWeight: 700, fontFamily: 'inherit',
          }"
          @click="nextTourStep"
        >
          {{ tourStep < 2 ? 'Дальше' : 'Готово' }}
        </button>
      </div>
    </div>

    <!-- Подсветка поля во время тура -->
    <div
      v-if="tourActive"
      :style="{
        position: 'absolute',
        top: '-4px',
        bottom: '-4px',
        background: T.neutral + '18',
        border: `2px solid ${T.neutral}`,
        borderRadius: '8px',
        zIndex: 61,
        pointerEvents: 'none',
        transition: 'left .3s, width .3s',
        left: tourCurrentField === 'area' ? '0%'
              : tourCurrentField === 'ceiling' ? '33.33%'
              : '66.66%',
        width: '33.33%',
      }"
    />
  </div>
</template>
