<script setup lang="ts">
/**
 * HouseStats.vue — Виджет дома (приборная панель).
 *
 * Tesla-style: инвертированный — светлая заливка (T.text) на тёмном фоне
 * страницы. Контрастно, читается как «панель управления». 3 параметра
 * в одну строку (S комнат / потолок / свет).
 *
 * Интерактивность:
 *
 * 1. Тап на сам виджет → expand с общей таблицей (название · S · потолок · свет)
 *
 * 2. Тап на поле → expand с подсветкой и УНИКАЛЬНОЙ для этого поля инфой:
 *      - area:    список комнат с диапазонами площадей (либо точная customArea)
 *      - ceiling: список комнат только с высотами потолков
 *      - light:   список комнат с «N светильников · M точек подключения»
 *
 * 3. Внизу expand — единственный блок «Дополнительно» (collapsed по умолчанию).
 *    Раскрывается → две кнопки: «Сохранить ссылку», «Начать заново».
 *    Эти действия больше нигде не дублируются — ни в Footer, ни в reset modal.
 *
 * 4. Скрываемая подсказка под виджетом (Вариант C) пока tour не пройден.
 *
 * 5. Затемняющий 3-шаговый tour (Вариант A) — при первом заходе с домом.
 *
 * 6. Тап на поле → toast с короткой пояснилкой (Вариант B).
 *
 * Эмиты: shareLink, changeHome — App.vue реагирует.
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

const rooms = computed<Room[]>(() => cfg.rooms as Room[])

const totalArea = computed<number | null>(() => {
  if (rooms.value.length === 0) return null
  return Math.round(
    rooms.value.reduce((s, r) => s + getArea(getRT(r.typeId), r), 0),
  )
})

const ceilingDisplay = computed<string | null>(() => {
  if (rooms.value.length === 0) return null
  const heights = [...new Set(rooms.value.map((r) => r.ceilingH))].sort(
    (a, b) => a - b,
  )
  if (heights.length === 1) return heights[0].toFixed(1)
  return `${heights[0].toFixed(1)}–${heights[heights.length - 1].toFixed(1)}`
})

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

/* ────────── Разбивка по комнатам в разных режимах ────────── */

interface RoomBreakdownAll {
  id: string
  name: string
  area: number
  ceiling: number
  fxCount: number
  pointsMax: number
}

interface RoomBreakdownArea {
  id: string
  name: string
  /** Диапазон или точная цифра (если customArea задана). */
  display: string
}

interface RoomBreakdownCeiling {
  id: string
  name: string
  ceiling: number
}

interface RoomBreakdownLight {
  id: string
  name: string
  fxCount: number
  pointsMax: number
}

const roomsAll = computed<RoomBreakdownAll[]>(() =>
  rooms.value.map((r) => {
    const rt = getRT(r.typeId)
    const limits = r.limits ?? rt.limits
    let pointsMax = 0
    for (const z of rt.zones) pointsMax += limits[z] ?? 0
    let fxCount = 0
    for (const fx of r.fixtures) fxCount += fx.q ?? 1
    return {
      id: r.id,
      name: r.customName || rt.name,
      area: Math.round(getArea(rt, r)),
      ceiling: r.ceilingH,
      fxCount,
      pointsMax,
    }
  }),
)

const roomsByArea = computed<RoomBreakdownArea[]>(() =>
  rooms.value.map((r) => {
    const rt = getRT(r.typeId)
    let display: string
    if (r.sizeIndex === 3 && r.customArea != null) {
      display = `${r.customArea} м²`
    } else {
      const idx = (r.sizeIndex ?? 1) as 0 | 1 | 2
      display = `${rt.ranges[idx]} м²`
    }
    return {
      id: r.id,
      name: r.customName || rt.name,
      display,
    }
  }),
)

const roomsByCeiling = computed<RoomBreakdownCeiling[]>(() =>
  rooms.value.map((r) => {
    const rt = getRT(r.typeId)
    return {
      id: r.id,
      name: r.customName || rt.name,
      ceiling: r.ceilingH,
    }
  }),
)

const roomsByLight = computed<RoomBreakdownLight[]>(() =>
  rooms.value.map((r) => {
    const rt = getRT(r.typeId)
    const limits = r.limits ?? rt.limits
    let pointsMax = 0
    for (const z of rt.zones) pointsMax += limits[z] ?? 0
    let fxCount = 0
    for (const fx of r.fixtures) fxCount += fx.q ?? 1
    return {
      id: r.id,
      name: r.customName || rt.name,
      fxCount,
      pointsMax,
    }
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
    moreOpen.value = false
  } else {
    expanded.value = true
    focusField.value = field
    moreOpen.value = false
  }
  if (!cfg.dashboardTourSeen.value) {
    cfg.markDashboardTourSeen()
  }
}

function collapseExpand() {
  expanded.value = false
  focusField.value = null
  moreOpen.value = false
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
  if (!cfg.dashboardTourSeen.value && rooms.value.length > 0) {
    setTimeout(() => {
      if (!cfg.dashboardTourSeen.value) startTour()
    }, 600)
  }
})

/* ────────── Toast при тапе на поле ────────── */

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
    collapseExpand()
  } else {
    toggleExpand(null)
  }
}

function dismissHint() {
  if (!cfg.dashboardTourSeen.value) {
    cfg.markDashboardTourSeen()
  }
}

/* ────────── Стили инвертированной панели ────────── */

/* Цветовая схема: фон T.text (кремовый светлый), текст T.bg (тёмный),
   границы и divider'ы — слегка прозрачный T.bg. */

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
    <!-- ═══════ САМ ВИДЖЕТ — ИНВЕРТИРОВАННАЯ ПАНЕЛЬ ═══════ -->
    <div
      :style="{
        display: 'flex',
        alignItems: 'stretch',
        background: PANEL_BG,
        borderRadius: '14px',
        padding: '16px 4px',
        marginBottom: cfg.dashboardTourSeen.value ? '16px' : '6px',
        cursor: isEmpty ? 'default' : 'pointer',
        position: 'relative',
        zIndex: tourActive ? 60 : 1,
        boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
      }"
      @click.self="onWidgetTap"
    >
      <!-- S комнат -->
      <div :style="fieldStyle('area')" @click.stop="onFieldTap('area')">
        <div
          :style="{
            fontSize: '9px',
            fontWeight: 700,
            color: PANEL_FG_SEC,
            textTransform: 'uppercase',
            letterSpacing: '1px',
            opacity: 0.7,
          }"
        >
          S комнат
        </div>
        <div
          :style="{
            fontSize: '28px',
            fontWeight: 800,
            color: isEmpty ? PANEL_FG_SEC : PANEL_FG,
            fontVariantNumeric: 'tabular-nums',
            lineHeight: 1,
          }"
        >
          {{ totalArea ?? '—' }}
        </div>
        <div :style="{ fontSize: '11px', color: PANEL_FG_SEC, opacity: 0.7 }">м²</div>
      </div>

      <div :style="{ width: '1px', background: PANEL_DIVIDER, margin: '4px 0' }" />

      <!-- Потолок -->
      <div :style="fieldStyle('ceiling')" @click.stop="onFieldTap('ceiling')">
        <div
          :style="{
            fontSize: '9px',
            fontWeight: 700,
            color: PANEL_FG_SEC,
            textTransform: 'uppercase',
            letterSpacing: '1px',
            opacity: 0.7,
          }"
        >
          потолок
        </div>
        <div
          :style="{
            fontSize: '28px',
            fontWeight: 800,
            color: isEmpty ? PANEL_FG_SEC : PANEL_FG,
            fontVariantNumeric: 'tabular-nums',
            lineHeight: 1,
          }"
        >
          {{ ceilingDisplay ?? '—' }}
        </div>
        <div :style="{ fontSize: '11px', color: PANEL_FG_SEC, opacity: 0.7 }">м</div>
      </div>

      <div :style="{ width: '1px', background: PANEL_DIVIDER, margin: '4px 0' }" />

      <!-- Свет -->
      <div :style="fieldStyle('light')" @click.stop="onFieldTap('light')">
        <div
          :style="{
            fontSize: '9px',
            fontWeight: 700,
            color: PANEL_FG_SEC,
            textTransform: 'uppercase',
            letterSpacing: '1px',
            opacity: 0.7,
          }"
        >
          свет
        </div>
        <div
          :style="{
            fontSize: '28px',
            fontWeight: 800,
            color: isEmpty ? PANEL_FG_SEC : PANEL_FG,
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
                color: PANEL_FG_SEC,
                fontWeight: 500,
                opacity: 0.55,
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
        marginBottom: '16px',
        fontSize: '11px',
        color: T.textSec,
      }"
    >
      <span :style="{ flex: 1 }">
        Тапните на виджет для деталей и управления →
      </span>
      <button
        :style="{
          background: 'none',
          border: 'none',
          color: T.textDim,
          cursor: 'pointer',
          padding: '2px 6px',
          fontSize: '14px',
          lineHeight: 1,
        }"
        @click="dismissHint"
      >
        ✕
      </button>
    </div>

    <!-- ═══════ Expand-панель ═══════ -->
    <div
      v-if="expanded && !isEmpty"
      :style="{
        background: T.card,
        border: `1px solid ${T.border}`,
        borderRadius: '12px',
        padding: '14px',
        marginBottom: '16px',
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
            fontSize: '10px',
            fontWeight: 700,
            color: T.neutral,
            textTransform: 'uppercase',
            letterSpacing: '0.8px',
            marginBottom: '4px',
          }"
        >
          {{ TOUR_FIELDS.find(f => f.id === focusField)?.title }}
        </div>
        <div
          :style="{
            fontSize: '12px',
            color: T.text,
            lineHeight: 1.5,
          }"
        >
          {{ TOUR_FIELDS.find(f => f.id === focusField)?.text }}
        </div>
      </div>

      <!-- Заголовок «по комнатам» -->
      <div
        :style="{
          fontSize: '10px',
          fontWeight: 700,
          color: T.textDim,
          textTransform: 'uppercase',
          letterSpacing: '0.8px',
          marginBottom: '8px',
        }"
      >
        по комнатам
      </div>

      <!-- Без фокуса — общая таблица (всё в одной строке) -->
      <template v-if="focusField === null">
        <div
          v-for="r in roomsAll"
          :key="r.id"
          :style="{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            padding: '8px 0',
            fontSize: '13px',
            color: T.text,
            borderBottom: `1px solid ${T.border}`,
            gap: '12px',
          }"
        >
          <span :style="{ flexShrink: 0 }">{{ r.name }}</span>
          <span
            :style="{
              color: T.textSec,
              fontVariantNumeric: 'tabular-nums',
              fontSize: '12px',
              textAlign: 'right',
            }"
          >
            {{ r.area }} м² · {{ r.ceiling.toFixed(1) }} м · {{ r.fxCount }}/{{ r.pointsMax }}
          </span>
        </div>
      </template>

      <!-- Фокус: area — только площади (диапазон или customArea) -->
      <template v-else-if="focusField === 'area'">
        <div
          v-for="r in roomsByArea"
          :key="r.id"
          :style="{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '8px 0',
            fontSize: '13px',
            color: T.text,
            borderBottom: `1px solid ${T.border}`,
          }"
        >
          <span>{{ r.name }}</span>
          <span :style="{ color: T.textSec, fontVariantNumeric: 'tabular-nums' }">
            {{ r.display }}
          </span>
        </div>
      </template>

      <!-- Фокус: ceiling — только высоты потолков -->
      <template v-else-if="focusField === 'ceiling'">
        <div
          v-for="r in roomsByCeiling"
          :key="r.id"
          :style="{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '8px 0',
            fontSize: '13px',
            color: T.text,
            borderBottom: `1px solid ${T.border}`,
          }"
        >
          <span>{{ r.name }}</span>
          <span :style="{ color: T.textSec, fontVariantNumeric: 'tabular-nums' }">
            {{ r.ceiling.toFixed(1) }} м
          </span>
        </div>
      </template>

      <!-- Фокус: light — светильники и точки подключения -->
      <template v-else-if="focusField === 'light'">
        <div
          v-for="r in roomsByLight"
          :key="r.id"
          :style="{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            padding: '8px 0',
            fontSize: '13px',
            color: T.text,
            borderBottom: `1px solid ${T.border}`,
            gap: '8px',
          }"
        >
          <span>{{ r.name }}</span>
          <span
            :style="{
              color: T.textSec,
              fontVariantNumeric: 'tabular-nums',
              fontSize: '12px',
            }"
          >
            {{ r.fxCount }}
            <span :style="{ color: T.textDim }">из</span>
            {{ r.pointsMax }} точек
          </span>
        </div>
      </template>

      <!-- Блок «Дополнительно» — единственная точка для shareLink/changeHome -->
      <div :style="{ marginTop: '14px' }">
        <button
          :style="{
            width: '100%',
            padding: '12px 14px',
            background: 'none',
            border: `1px solid ${T.border}`,
            borderRadius: '8px',
            color: T.textSec,
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
          <span>Дополнительно</span>
          <svg
            width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round"
            :style="{
              transform: moreOpen ? 'rotate(180deg)' : 'none',
              transition: 'transform .2s',
            }"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        <!-- Раскрытое: 2 действия -->
        <div
          v-if="moreOpen"
          :style="{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            marginTop: '8px',
          }"
        >
          <button
            :style="{
              width: '100%',
              padding: '12px',
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
            @click="emit('shareLink'); collapseExpand()"
          >
            <svg
              width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2"
              stroke-linecap="round" stroke-linejoin="round"
            >
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
            Сохранить ссылку на дом
          </button>
          <button
            :style="{
              width: '100%',
              padding: '12px',
              background: 'none',
              border: `1px solid ${T.border}`,
              borderRadius: '8px',
              color: T.textSec,
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: 600,
              fontFamily: 'inherit',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }"
            @click="emit('changeHome'); collapseExpand()"
          >
            <svg
              width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2"
              stroke-linecap="round" stroke-linejoin="round"
            >
              <polyline points="17 1 21 5 17 9" />
              <path d="M3 11V9a4 4 0 0 1 4-4h14" />
              <polyline points="7 23 3 19 7 15" />
              <path d="M21 13v2a4 4 0 0 1-4 4H3" />
            </svg>
            Начать заново
          </button>
        </div>
      </div>
    </div>

    <!-- ═══════ Toast при тапе на поле ═══════ -->
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
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.78)',
        zIndex: 55,
      }"
      @click="finishTour"
    />
    <div
      v-if="tourActive"
      :style="{
        position: 'fixed',
        bottom: '24px',
        left: '50%',
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
            height: '3px',
            borderRadius: '2px',
            flex: i === tourStep ? 2 : 1,
            background: i === tourStep ? T.neutral : T.border,
            transition: 'all .3s',
          }"
        />
      </div>

      <div
        :style="{
          fontSize: '10px',
          fontWeight: 700,
          color: T.neutral,
          textTransform: 'uppercase',
          letterSpacing: '0.8px',
          marginBottom: '6px',
        }"
      >
        {{ tourCurrentText.title }}
      </div>
      <div
        :style="{
          fontSize: '14px',
          color: T.text,
          lineHeight: 1.55,
          marginBottom: '16px',
        }"
      >
        {{ tourCurrentText.text }}
      </div>

      <div :style="{ display: 'flex', gap: '8px' }">
        <button
          :style="{
            flex: 1,
            padding: '10px',
            background: 'none',
            border: `1px solid ${T.border}`,
            color: T.textSec,
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: 600,
            fontFamily: 'inherit',
          }"
          @click="finishTour"
        >
          Пропустить
        </button>
        <button
          :style="{
            flex: 1,
            padding: '10px',
            background: T.neutral,
            color: T.bg,
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: 700,
            fontFamily: 'inherit',
          }"
          @click="nextTourStep"
        >
          {{ tourStep < 2 ? 'Дальше' : 'Готово' }}
        </button>
      </div>
    </div>

    <!-- Подсветка текущего поля во время тура -->
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
