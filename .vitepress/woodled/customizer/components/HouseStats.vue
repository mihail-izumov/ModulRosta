<script setup lang="ts">
/**
 * HouseStats.vue — Виджет дома сверху главного экрана.
 *
 * Tesla-style: 3 параметра в одну строку (S комнат / потолок / свет),
 * разделённые тонкими divider'ами. Без рамок и теней.
 *
 * Интерактивность (механика онбординга):
 *
 * 1. Тап на сам виджет (не на конкретное поле) → раскрывается expand-панель:
 *    - разбивка по комнатам
 *    - кнопка «Сохранить ссылку на дом»
 *    - кнопка «Сменить дом»
 *
 * 2. Тап на поле (S комнат / потолок / свет) → раскрытие с подсветкой
 *    именно этого поля + его пояснение в expand-панели.
 *
 * 3. Скрываемая подсказка под виджетом «Тапните для деталей →» —
 *    показывается пока не выполнено любое из условий:
 *      - юзер запустил тур
 *      - юзер раскрыл виджет хотя бы раз
 *      - юзер закрыл подсказку вручную
 *    Все три варианта выставляют единый флаг dashboardTourSeen в localStorage.
 *
 * 4. Затемняющий 3-шаговый spotlight tour запускается автоматически при
 *    первом заходе с заполненным домом (rooms.length > 0 и tourSeen=false).
 *    Можно пропустить ✕ или пройти все шаги.
 *
 * Эмиты: shareLink (юзер хочет скопировать ссылку), changeHome (юзер хочет
 * сменить дом). App.vue реагирует на оба.
 *
 * См. docs/TEMPLATES_SYSTEM.md раздел 4.
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

/* Разбивка по комнатам в expand-режиме. */
const roomsBreakdown = computed(() =>
  rooms.value.map((r) => {
    const rt = getRT(r.typeId)
    return {
      id: r.id,
      name: r.customName || rt.name,
      area: Math.round(getArea(rt, r)),
      ceiling: r.ceilingH,
    }
  }),
)

/* ────────── Expand state и подсветка ────────── */

const expanded = ref(false)
const focusField = ref<FieldId | null>(null)

function toggleExpand(field: FieldId | null = null) {
  if (focusField.value === field && expanded.value) {
    // Тап на уже подсвеченное поле → закрываем
    expanded.value = false
    focusField.value = null
  } else {
    expanded.value = true
    focusField.value = field
  }
  // Любое раскрытие — снимает hint, скрывает tour
  if (!cfg.dashboardTourSeen.value) {
    cfg.markDashboardTourSeen()
  }
}

function collapseExpand() {
  expanded.value = false
  focusField.value = null
}

/* ────────── Spotlight tour ────────── */

/**
 * Показывается автоматически при первом заходе с заполненным домом.
 * После прохождения/пропуска — markDashboardTourSeen → флаг навсегда.
 *
 * Включается через nextTick после mount чтобы UI успел отрисоваться,
 * иначе spotlight может попасть «в пустоту» во время гидратации.
 */
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
    text: 'Точки для светильников: занято/всего возможно. Лимиты можно поднять в настройках комнаты.',
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
  // Первый заход с заполненным домом → запустить тур
  if (!cfg.dashboardTourSeen.value && rooms.value.length > 0) {
    setTimeout(() => {
      // ещё раз проверяем — за это время юзер мог сам тапнуть, тогда не нужно
      if (!cfg.dashboardTourSeen.value) {
        startTour()
      }
    }, 600)
  }
})

/* ────────── Toast при тапе на поле (мини-объяснение) ────────── */

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

/* ────────── Tap-handlers ────────── */

function onFieldTap(field: FieldId) {
  if (tourActive.value) return // во время тура — игнор
  showFieldToast(field)
  toggleExpand(field)
}

function onWidgetTap() {
  if (tourActive.value) return
  if (expanded.value && focusField.value === null) {
    // Тап по «фону» виджета когда уже открыт без фокуса → закрыть
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

/* ────────── Подсветка поля ────────── */

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
    background: isFocused ? T.neutral + '12' : 'transparent',
    transition: 'background .2s',
    cursor: isEmpty.value ? 'default' : 'pointer',
  }
}

/* ────────── Tour spotlight геометрия ────────── */

const tourCurrentField = computed<FieldId>(() => TOUR_FIELDS[tourStep.value].id)
const tourCurrentText = computed(() => TOUR_FIELDS[tourStep.value])
</script>

<template>
  <div :style="{ position: 'relative' }">
    <!-- ═══════ Сам виджет ═══════ -->
    <div
      :style="{
        display: 'flex',
        alignItems: 'stretch',
        borderTop: `1px solid ${T.border}`,
        borderBottom: `1px solid ${T.border}`,
        padding: '14px 0',
        marginBottom: cfg.dashboardTourSeen.value ? '16px' : '6px',
        cursor: isEmpty ? 'default' : 'pointer',
        position: 'relative',
        zIndex: tourActive ? 60 : 1,
      }"
      @click.self="onWidgetTap"
    >
      <!-- S комнат -->
      <div
        :style="fieldStyle('area')"
        @click.stop="onFieldTap('area')"
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
          S комнат
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
        <div :style="{ fontSize: '11px', color: T.textSec }">м²</div>
      </div>

      <!-- Divider -->
      <div :style="{ width: '1px', background: T.border, margin: '4px 0' }" />

      <!-- Потолок -->
      <div
        :style="fieldStyle('ceiling')"
        @click.stop="onFieldTap('ceiling')"
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
        <div :style="{ fontSize: '11px', color: T.textSec }">м</div>
      </div>

      <!-- Divider -->
      <div :style="{ width: '1px', background: T.border, margin: '4px 0' }" />

      <!-- Свет -->
      <div
        :style="fieldStyle('light')"
        @click.stop="onFieldTap('light')"
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
          свет
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
        <div :style="{ fontSize: '11px', color: T.textSec }">точек</div>
      </div>
    </div>

    <!-- ═══════ Скрываемая подсказка (Вариант C) ═══════ -->
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
      <!-- Если фокус на поле — пояснение для него -->
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

      <!-- Разбивка по комнатам -->
      <div :style="{ marginBottom: '14px' }">
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
        <div
          v-for="r in roomsBreakdown"
          :key="r.id"
          :style="{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '6px 0',
            fontSize: '13px',
            color: T.text,
            borderBottom: `1px solid ${T.border}`,
          }"
        >
          <span>{{ r.name }}</span>
          <span :style="{ color: T.textSec, fontVariantNumeric: 'tabular-nums' }">
            {{ r.area }} м² · {{ r.ceiling.toFixed(1) }} м
          </span>
        </div>
      </div>

      <!-- Действия -->
      <div :style="{ display: 'flex', flexDirection: 'column', gap: '8px' }">
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
          Сменить дом
        </button>
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

    <!-- ═══════ Spotlight tour (Вариант A — дополнительный) ═══════ -->
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
      <!-- Прогресс -->
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

    <!-- Подсветка текущего поля во время тура — без position:absolute,
         просто визуальный фокус через z-index виджета и подсветку -->
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
