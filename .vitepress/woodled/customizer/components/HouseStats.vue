<script setup lang="ts">
/**
 * HouseStats.vue — Виджет дома (приборная панель).
 *
 * v4 — переработка по фидбеку:
 *
 *   ┌──────────────────────────────────┐
 *   │  S комнат    потолок    свет     │  ← без разделителей, подсветка
 *   │   26          2.7      5/16     │     фоном при тапе/туре
 *   ├──────────────────────────────────┤
 *   │  🔗 Сохранить   🔄 Заново       │  ← 2 кнопки в ряд, всегда видны
 *   └──────────────────────────────────┘
 *
 *   Expand-панель (при тапе на поле):
 *   ┌──────────────────────────────────┐
 *   │  [пояснение]                     │
 *   │  по комнатам:                    │
 *   │  Кухня                 6–12 м²   │  ← без border-bottom на последнем
 *   │  Спальня               8–14 м²   │
 *   └──────────────────────────────────┘
 *
 * Изменения v4:
 *   1. «Дополнительно» убран — кнопки внутри панели.
 *   2. Два действия в один ряд: «Сохранить ссылку» + «Начать заново».
 *   3. Разделители между полями убраны — подсветка фоном.
 *   4. Border-bottom убран у последнего элемента в expand-списке.
 *   5. Свет: при 0 used → показываем «—» (не «0/22»).
 *   6. Tour: вместо рамки — подсветка фоном + dimming остальных полей.
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

/** Есть ли хотя бы один светильник во всех комнатах. */
const hasAnyFixtures = computed(() =>
  cfg.rooms.some((r) => r.fixtures.length > 0),
)

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

/* ────────── Handlers ────────── */

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

function onShareClick() {
  emit('shareLink')
}

function onChangeHomeClick() {
  emit('changeHome')
}

/* ────────── Стили ────────── */

/* Тёплая жемчужная гамма WOODLED — ближе к онбордингу/основным страницам.
 * Чуть теплее и золотистее чем T.text (#E8E0D4). */
const PANEL_BG = '#EAE0CA'
const PANEL_FG = T.bg
const PANEL_FG_SEC = T.cardAlt
const PANEL_PASSIVE_BG = 'rgba(19,17,14,0.07)'
const PANEL_DIVIDER = 'rgba(19,17,14,0.10)'
/* Активное состояние — БЕЛАЯ плашка (светлее жемчужного фона).
 * Используется и для активной плашки в дашборде, и для двух плашек
 * внутри expand-блока. Инверсия яркости: активное = свет, фон = жемчуг.
 * Это переворачивает иерархию: акцент уходит из кнопок (которые раньше
 * были белыми) в выбранное состояние данных. */
const PANEL_FIELD_ACTIVE = '#FFFFFF'
/* Кнопки внизу панели — чуть темнее пассивных плашек.
 * Меньшая высота визуально «съедает» 0.07 фон, поэтому 0.12 даёт
 * кнопкам чёткую форму, не перетягивая акцент с белой активной плашки.
 * Иерархия по фону: активная (белая) > пассивные (0.07) > кнопки (0.12). */
const PANEL_BTN_BG = 'rgba(19,17,14,0.12)'
const PANEL_BTN_BG_HOVER = 'rgba(19,17,14,0.18)'

const tourCurrentField = computed<FieldId>(() => TOUR_FIELDS[tourStep.value].id)
const tourCurrentText = computed(() => TOUR_FIELDS[tourStep.value])

/**
 * Стиль поля дашборда.
 * v4: пассивный фон (subtle) показывает что поле кликабельно.
 * При тапе — более яркий фон. При туре — dim остальных.
 */
function fieldStyle(field: FieldId) {
  const isFocused = expanded.value && focusField.value === field
  const isTourField = tourActive.value && tourCurrentField.value === field
  const isDimmed = tourActive.value && !isTourField
  let bg: string = PANEL_PASSIVE_BG
  if (isFocused || isTourField) bg = PANEL_FIELD_ACTIVE
  return {
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4px',
    padding: '8px 0',
    borderRadius: '8px',
    background: bg,
    opacity: isDimmed ? 0.3 : 1,
    transition: 'all .3s',
    cursor: isEmpty.value ? 'default' : 'pointer',
  }
}
</script>

<template>
  <div :style="{ position: 'relative' }">
    <!-- ═══════ ВИДЖЕТ — ИНВЕРТИРОВАННАЯ ПАНЕЛЬ ═══════ -->
    <div
      :style="{
        background: PANEL_BG,
        borderRadius: '14px',
        padding: '6px',
        marginBottom: '8px',
        cursor: isEmpty ? 'default' : 'pointer',
        position: 'relative',
        zIndex: tourActive ? 60 : 1,
        boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
      }"
      @click.self="onWidgetTap"
    >
      <!-- Три поля — равные gap, без разделителей -->
      <div
        :style="{
          display: 'flex',
          alignItems: 'stretch',
          gap: '6px',
        }"
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
            <!-- При 0 используемых — показываем «—», не «0/22» -->
            <template v-if="lightPoints && hasAnyFixtures">
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

      <!-- Две кнопки — без разделителей, светлее плашек, тот же gap -->
      <div
        :style="{
          display: 'flex',
          gap: '6px',
        }"
      >
        <button
          :style="{
            flex: 1,
            padding: '10px 6px',
            background: PANEL_BTN_BG,
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            fontSize: '11px',
            fontWeight: 600,
            color: PANEL_FG,
            fontFamily: 'inherit',
          }"
          @click.stop="onShareClick"
        >
          <!-- Иконка share -->
          <svg
            width="13" height="13" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round"
          >
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
            <polyline points="16 6 12 2 8 6" />
            <line x1="12" y1="2" x2="12" y2="15" />
          </svg>
          Поделиться домом
        </button>
        <button
          :style="{
            flex: 1,
            padding: '10px 6px',
            background: PANEL_BTN_BG,
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            fontSize: '11px',
            fontWeight: 600,
            color: PANEL_FG,
            fontFamily: 'inherit',
          }"
          @click.stop="onChangeHomeClick"
        >
          <!-- Иконка iteration-cw -->
          <svg
            width="13" height="13" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round"
          >
            <path d="M4 10a8 8 0 1 1 8 8H4" />
            <path d="m8 22-4-4 4-4" />
          </svg>
          Начать заново
        </button>
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
        Тапните на параметр для деталей →
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

    <!-- ═══════ Expand-панель (разбивка по комнатам) ═══════
         Двойная преемственность с дашбордом:
           - Контейнер expand = PANEL_BG (как сама панель дашборда)
           - 2 равнозначные плашки внутри = PANEL_FIELD_ACTIVE
             (как фон активной выбранной плашки в дашборде).
         Плашка 1 — пояснение тапнутого поля (если есть focus).
         Плашка 2 — данные «по комнатам».                        -->
    <div
      v-if="expanded && !isEmpty"
      :style="{
        background: PANEL_BG,
        borderRadius: '12px',
        padding: '6px',
        marginBottom: '8px',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
      }"
    >
      <!-- Плашка 1 — пояснение тапнутого поля -->
      <div
        v-if="focusField"
        :style="{
          background: PANEL_FIELD_ACTIVE,
          borderRadius: '8px',
          padding: '12px 14px',
        }"
      >
        <div
          :style="{
            fontSize: '10px', fontWeight: 700, color: PANEL_FG,
            textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '4px',
            opacity: 0.7,
          }"
        >
          {{ TOUR_FIELDS.find(f => f.id === focusField)?.title }}
        </div>
        <div :style="{ fontSize: '12px', color: PANEL_FG, lineHeight: 1.5 }">
          {{ TOUR_FIELDS.find(f => f.id === focusField)?.text }}
        </div>
      </div>

      <!-- Плашка 2 — список по комнатам -->
      <div
        :style="{
          background: PANEL_FIELD_ACTIVE,
          borderRadius: '8px',
          padding: '12px 14px',
        }"
      >
        <div
          :style="{
            fontSize: '10px', fontWeight: 700, color: PANEL_FG,
            textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '4px',
            opacity: 0.7,
          }"
        >
          по комнатам
        </div>

        <!-- Без фокуса — общая таблица -->
        <template v-if="focusField === null">
          <div
            v-for="(r, i) in roomsAll"
            :key="r.id"
            :style="{
              display: 'flex', justifyContent: 'space-between',
              alignItems: 'baseline', padding: '8px 0',
              fontSize: '13px', color: PANEL_FG,
              borderBottom: i < roomsAll.length - 1 ? `1px solid ${PANEL_DIVIDER}` : 'none',
              gap: '12px',
            }"
          >
            <span :style="{ flexShrink: 0 }">{{ r.name }}</span>
            <span
              :style="{
                color: PANEL_FG_SEC, fontVariantNumeric: 'tabular-nums',
                fontSize: '12px', textAlign: 'right',
              }"
            >
              {{ r.area }} м² · {{ r.ceiling.toFixed(1) }} м · {{ r.fxCount }}/{{ r.pointsMax }}
            </span>
          </div>
        </template>

        <!-- area -->
        <template v-else-if="focusField === 'area'">
          <div
            v-for="(r, i) in roomsByArea"
            :key="r.id"
            :style="{
              display: 'flex', justifyContent: 'space-between',
              padding: '8px 0', fontSize: '13px', color: PANEL_FG,
              borderBottom: i < roomsByArea.length - 1 ? `1px solid ${PANEL_DIVIDER}` : 'none',
            }"
          >
            <span>{{ r.name }}</span>
            <span :style="{ color: PANEL_FG_SEC, fontVariantNumeric: 'tabular-nums' }">
              {{ r.display }}
            </span>
          </div>
        </template>

        <!-- ceiling -->
        <template v-else-if="focusField === 'ceiling'">
          <div
            v-for="(r, i) in roomsByCeiling"
            :key="r.id"
            :style="{
              display: 'flex', justifyContent: 'space-between',
              padding: '8px 0', fontSize: '13px', color: PANEL_FG,
              borderBottom: i < roomsByCeiling.length - 1 ? `1px solid ${PANEL_DIVIDER}` : 'none',
            }"
          >
            <span>{{ r.name }}</span>
            <span :style="{ color: PANEL_FG_SEC, fontVariantNumeric: 'tabular-nums' }">
              {{ r.ceiling.toFixed(1) }} м
            </span>
          </div>
        </template>

        <!-- light -->
        <template v-else-if="focusField === 'light'">
          <div
            v-for="(r, i) in roomsByLight"
            :key="r.id"
            :style="{
              display: 'flex', justifyContent: 'space-between',
              alignItems: 'baseline', padding: '8px 0',
              fontSize: '13px', color: PANEL_FG,
              borderBottom: i < roomsByLight.length - 1 ? `1px solid ${PANEL_DIVIDER}` : 'none',
              gap: '8px',
            }"
          >
            <span>{{ r.name }}</span>
            <span
              :style="{
                color: PANEL_FG_SEC, fontVariantNumeric: 'tabular-nums', fontSize: '12px',
              }"
            >
              {{ r.fxCount }}
              <span :style="{ opacity: 0.6 }">из</span>
              {{ r.pointsMax }} точек
            </span>
          </div>
        </template>
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

    <!-- Tour: подсветка поля убрана (v4) — вместо рамки dim/focus в fieldStyle -->
  </div>
</template>
