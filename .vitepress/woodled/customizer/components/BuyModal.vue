<script setup lang="ts">
/**
 * BuyModal.vue — «Мой лес» (v2).
 *
 * Редизайн шага list:
 *   - StoryLink с warm pearl glass (inline, не компонент)
 *   - «Освещение в доме» заголовок + объединённый блок итого/скидка
 *   - Комнаты как accordion (свёрнуть/развернуть)
 *   - Карточки: название модели + бейдж дерева + цена. Клик → openFx
 *   - Скидка — toggle-опция, не основной фокус
 *   - CTA-блок: «Лес собран» + кнопка + пояснение
 *
 * Шаги:
 *   1. list  — комнаты со светильниками; опциональная скидка
 *   2. form  — имя, телефон, комментарий
 *   3. done  — «План отправлен»
 */

import { computed, ref, reactive } from 'vue'
import { T, Z, WCOL } from '../theme/tokens'
import { MD, type Fixture } from '../data/catalog'
import { MATS } from '../data/materials'
import { fxPrice, itemPrice } from '../data/price-engine'
import { getRT, type Room } from '../data/rooms'
import Icon, { fxIcName } from './ui/Icons.vue'

/* ─── Constants ─── */

const PANEL_BG = '#EAE0CA'
const PANEL_FG = T.bg

interface Props {
  rooms: Room[]
}
const props = defineProps<Props>()
const emit = defineEmits<{
  editFx: [roomId: string, fxIdx: number, next: Fixture | null]
  openFx: [roomId: string, fxIdx: number]
  close: []
  feedback: [msg: string]
  story: []
}>()

type Step = 'list' | 'form' | 'done'

const step = ref<Step>('list')
const discountMode = ref(false)
const discountFx = ref<{ roomId: string; fxIdx: number } | null>(null)
const contact = ref({ name: '', phone: '', comment: '' })

const filledRooms = computed(() => props.rooms.filter((r) => r.fixtures.length > 0))

/* ─── Accordion state ─── */

const expandedRooms = reactive<Record<string, boolean>>({})

function isExpanded(roomId: string): boolean {
  return expandedRooms[roomId] !== false // default: expanded
}

function toggleRoom(roomId: string) {
  expandedRooms[roomId] = !isExpanded(roomId)
}

/* ─── Discount ─── */

function toggleDiscountMode() {
  if (discountMode.value) {
    discountMode.value = false
    discountFx.value = null
  } else {
    discountMode.value = true
  }
}

function toggleDiscount(roomId: string, fxIdx: number) {
  const sel = discountFx.value
  if (sel && sel.roomId === roomId && sel.fxIdx === fxIdx) {
    discountFx.value = null
  } else {
    discountFx.value = { roomId, fxIdx }
  }
}

function isDiscounted(roomId: string, fxIdx: number): boolean {
  const sel = discountFx.value
  return !!sel && sel.roomId === roomId && sel.fxIdx === fxIdx
}

const discountApplied = computed(() => discountFx.value !== null)

const discountDetails = computed(() => {
  if (!discountFx.value) return null
  const r = props.rooms.find((rm) => rm.id === discountFx.value!.roomId)
  const fx = r?.fixtures[discountFx.value!.fxIdx]
  if (!r || !fx) return null
  const m = MD[fx.m]
  if (!m) return null
  const woodName = MATS.find((x) => x.id === (fx.wood ?? 'oak'))?.name ?? 'Дуб'
  return { room: r, fx, m, woodName }
})

/* ─── Totals ─── */

const totalAll = computed(() =>
  filledRooms.value.reduce((s, r) => s + fxPrice(r.fixtures), 0),
)

const grandTotal = computed(() =>
  totalAll.value - (discountApplied.value ? 3000 : 0),
)

function roomTotal(r: Room): number {
  const base = fxPrice(r.fixtures)
  if (discountFx.value?.roomId === r.id) return Math.max(0, base - 3000)
  return base
}

function fxCount(r: Room): number {
  return r.fixtures.reduce((s, fx) => s + (fx.q ?? 1), 0)
}

/* ─── Handlers ─── */

function onFxClick(roomId: string, fxIdx: number) {
  if (discountMode.value) {
    toggleDiscount(roomId, fxIdx)
  } else {
    emit('openFx', roomId, fxIdx)
  }
}

function submitList() {
  step.value = 'form'
}

function submitForm() {
  if (!contact.value.phone) {
    emit('feedback', 'Укажите телефон')
    return
  }
  step.value = 'done'
}

/* ─── Style helpers ─── */

function storyLinkStyle() {
  return {
    background: `
      radial-gradient(ellipse 90% 70% at 20% 0%, rgba(255,255,255,0.38), transparent 55%),
      radial-gradient(ellipse 70% 60% at 85% 95%, rgba(19,17,14,0.06), transparent 60%),
      ${PANEL_BG}
    `,
    border: '1px solid rgba(255,255,255,0.22)',
    boxShadow: `
      inset 0 1px 0 rgba(255,255,255,0.5),
      inset 0 -1px 3px rgba(19,17,14,0.04),
      0 4px 20px rgba(0,0,0,0.28)
    `,
    borderRadius: '12px',
    padding: '14px 16px',
    marginBottom: '20px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  }
}

function fxCardStyle(roomId: string, fxIdx: number) {
  const sel = isDiscounted(roomId, fxIdx)
  return {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '9px 12px',
    background: sel ? 'rgba(255,255,255,0.05)' : T.card,
    border: `1px solid ${sel ? 'rgba(255,255,255,0.15)' : T.border}`,
    borderRadius: '10px',
    cursor: 'pointer',
    textAlign: 'left',
    fontFamily: 'inherit',
    transition: 'background 0.15s, border-color 0.15s',
  }
}

function woodBadgeStyle(woodColor: string) {
  return {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '5px',
    marginTop: '3px',
    padding: '2px 7px 2px 5px',
    borderRadius: '5px',
    background: woodColor + '14',
    fontSize: '11px',
    color: woodColor,
    fontWeight: 500,
  }
}
</script>

<template>
  <!-- ═══ ШАГ 3: done ═══ -->
  <div
    v-if="step === 'done'"
    :style="{
      position: 'fixed',
      inset: 0,
      background: T.bg,
      zIndex: Z.fullscreenModal,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '28px',
      textAlign: 'center',
    }"
  >
    <div
      :style="{
        width: '90px',
        height: '90px',
        borderRadius: '20px',
        background: T.green + '22',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '40px',
        marginBottom: '20px',
        animation: 'float 3s ease-in-out infinite',
      }"
    >
      ✓
    </div>
    <div :style="{ fontSize: '22px', fontWeight: 700, color: T.green, marginBottom: '8px' }">
      План отправлен
    </div>
    <div :style="{ fontSize: '14px', color: T.textSec, lineHeight: 1.7, maxWidth: '300px' }">
      <template v-if="discountDetails">
        Скидка 3 000 ₽ на
        <span :style="{ color: T.text, fontWeight: 600 }">
          {{ discountDetails.woodName }} · {{ discountDetails.m.name }}</span>.
      </template>
      Консультант WOODLED свяжется с вами
    </div>
    <button
      :style="{
        marginTop: '24px',
        padding: '12px 40px',
        background: T.neutral,
        border: 'none',
        borderRadius: '8px',
        color: T.bg,
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: 700,
        fontFamily: 'inherit',
      }"
      @click="emit('close')"
    >
      Вернуться к лесу
    </button>
  </div>

  <!-- ═══ ШАГ 2: form ═══ -->
  <div
    v-else-if="step === 'form'"
    :style="{
      position: 'fixed',
      inset: 0,
      background: T.bg,
      zIndex: Z.fullscreenModal,
      overflow: 'auto',
    }"
  >
    <div
      :style="{
        padding: '12px 16px',
        borderBottom: `1px solid ${T.border}`,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }"
    >
      <button
        :style="{
          background: 'none',
          border: 'none',
          color: T.textSec,
          fontSize: '14px',
          cursor: 'pointer',
          fontFamily: 'inherit',
        }"
        @click="step = 'list'"
      >
        ← Мой лес
      </button>
      <span :style="{ flex: 1, fontWeight: 700, fontSize: '16px', color: T.text, textAlign: 'center' }">
        Оставить заявку
      </span>
      <span :style="{ width: '70px' }" />
    </div>
    <div :style="{ padding: '20px', maxWidth: '400px', margin: '0 auto' }">
      <div
        v-if="discountDetails"
        :style="{
          background: T.green + '12',
          borderRadius: '10px',
          padding: '14px',
          marginBottom: '20px',
          border: `1px solid ${T.green}22`,
        }"
      >
        <div :style="{ display: 'flex', alignItems: 'center', gap: '10px' }">
          <div
            :style="{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: WCOL[discountDetails.fx.wood ?? 'oak'] + '22',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }"
          >
            <Icon
              :name="fxIcName(discountDetails.m.type)"
              :color="WCOL[discountDetails.fx.wood ?? 'oak']"
              :size="20"
            />
          </div>
          <div :style="{ flex: 1 }">
            <div :style="{ fontSize: '13px', fontWeight: 600, color: T.text }">
              {{ discountDetails.woodName }} · {{ discountDetails.m.name }}
            </div>
            <div :style="{ fontSize: '12px', color: T.green, fontWeight: 600 }">
              Скидка 3 000 ₽
            </div>
          </div>
        </div>
      </div>

      <div :style="{ marginBottom: '14px' }">
        <div :style="{ fontSize: '11px', color: T.text, marginBottom: '6px', fontWeight: 600 }">
          Имя
        </div>
        <input
          v-model="contact.name"
          placeholder="Как к вам обращаться"
          :style="{
            width: '100%',
            padding: '10px 12px',
            background: T.card,
            border: `1px solid ${T.border}`,
            borderRadius: '6px',
            color: T.text,
            fontSize: '14px',
            outline: 'none',
            boxSizing: 'border-box',
          }"
        />
      </div>

      <div :style="{ marginBottom: '14px' }">
        <div :style="{ fontSize: '11px', color: T.text, marginBottom: '6px', fontWeight: 600 }">
          Телефон
        </div>
        <input
          v-model="contact.phone"
          type="tel"
          placeholder="+7"
          :style="{
            width: '100%',
            padding: '10px 12px',
            background: T.card,
            border: `1px solid ${T.border}`,
            borderRadius: '6px',
            color: T.text,
            fontSize: '14px',
            outline: 'none',
            boxSizing: 'border-box',
          }"
        />
      </div>

      <div :style="{ marginBottom: '20px' }">
        <div :style="{ fontSize: '11px', color: T.text, marginBottom: '6px', fontWeight: 600 }">
          Комментарий
        </div>
        <textarea
          v-model="contact.comment"
          placeholder="Вопросы, пожелания"
          rows="3"
          :style="{
            width: '100%',
            padding: '10px 12px',
            background: T.card,
            border: `1px solid ${T.border}`,
            borderRadius: '6px',
            color: T.text,
            fontSize: '14px',
            outline: 'none',
            boxSizing: 'border-box',
            resize: 'none',
          }"
        />
      </div>

      <button
        :style="{
          width: '100%',
          padding: '14px',
          background: '#FFFFFF',
          color: T.bg,
          border: 'none',
          borderRadius: '10px',
          fontWeight: 700,
          cursor: 'pointer',
          fontSize: '14px',
          fontFamily: 'inherit',
        }"
        @click="submitForm"
      >
        Отправить план леса
      </button>
      <div :style="{ fontSize: '11px', color: T.textDim, marginTop: '10px', textAlign: 'center' }">
        Консультант свяжется в течение часа
      </div>
    </div>
  </div>

  <!-- ═══ ШАГ 1: list ═══ -->
  <div
    v-else
    :style="{
      position: 'fixed',
      inset: 0,
      background: T.bg,
      zIndex: Z.fullscreenModal,
      overflow: 'auto',
    }"
  >
    <!-- Sticky header -->
    <div
      :style="{
        padding: '12px 16px',
        borderBottom: `1px solid ${T.border}`,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        position: 'sticky',
        top: 0,
        background: T.bg,
        zIndex: 1,
      }"
    >
      <button
        :style="{
          background: 'none',
          border: 'none',
          color: T.textSec,
          fontSize: '14px',
          cursor: 'pointer',
          fontFamily: 'inherit',
        }"
        @click="emit('close')"
      >
        ← Домой
      </button>
      <span
        :style="{
          flex: 1,
          fontWeight: 700,
          fontSize: '18px',
          color: T.text,
          textAlign: 'center',
        }"
      >
        Мой лес
      </span>
      <span :style="{ width: '70px' }" />
    </div>

    <div :style="{ padding: '16px', maxWidth: '480px', margin: '0 auto' }">

      <!-- ═══ StoryLink — warm pearl glass ═══ -->
      <div
        v-if="filledRooms.length > 0"
        :style="storyLinkStyle()"
        @click="emit('story')"
      >
        <div
          :style="{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'rgba(19,17,14,0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }"
        >
          <Icon name="trees" :color="PANEL_FG" :size="22" />
        </div>
        <div :style="{ flex: 1 }">
          <div :style="{ fontSize: '13px', fontWeight: 600, color: PANEL_FG }">
            Посмотрите на свой лес
          </div>
          <div :style="{ fontSize: '11px', color: PANEL_FG, opacity: 0.55 }">
            Узнайте, какой свет вы создали
          </div>
        </div>
        <svg
          width="20" height="20" viewBox="0 0 24 24" fill="none"
          :stroke="PANEL_FG" stroke-width="1.8"
          stroke-linecap="round" stroke-linejoin="round"
          :style="{ flexShrink: 0 }"
        >
          <polyline points="9 6 15 12 9 18" />
        </svg>
      </div>

      <!-- ═══ Heading ═══ -->
      <div
        :style="{
          textAlign: 'center',
          marginBottom: '16px',
          fontSize: '18px',
          fontWeight: 700,
          color: T.text,
        }"
      >
        Освещение в доме
      </div>

      <!-- ═══ Total + Discount card ═══ -->
      <div
        v-if="filledRooms.length > 0"
        :style="{
          background: T.card,
          border: `1px solid ${T.border}`,
          borderRadius: '12px',
          padding: '14px 16px',
          marginBottom: '20px',
        }"
      >
        <!-- Total row -->
        <div
          :style="{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '12px',
          }"
        >
          <span :style="{ fontSize: '13px', color: T.textSec, fontWeight: 500 }">
            Итого
          </span>
          <div :style="{ display: 'flex', alignItems: 'baseline', gap: '6px' }">
            <span
              v-if="discountApplied"
              :style="{
                fontSize: '12px',
                color: T.textDim,
                textDecoration: 'line-through',
              }"
            >
              {{ totalAll.toLocaleString('ru-RU') }} ₽
            </span>
            <span :style="{ fontSize: '18px', fontWeight: 700, color: T.text }">
              {{ grandTotal.toLocaleString('ru-RU') }} ₽
            </span>
          </div>
        </div>

        <!-- Divider -->
        <div :style="{ height: '1px', background: T.border, marginBottom: '12px' }" />

        <!-- Discount toggle -->
        <div
          :style="{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            cursor: 'pointer',
            padding: '4px 0',
          }"
          @click="toggleDiscountMode"
        >
          <div
            :style="{
              width: '30px',
              height: '30px',
              borderRadius: '7px',
              background: discountMode ? 'rgba(255,255,255,0.1)' : T.neutral + '15',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.2s',
            }"
          >
            <Icon name="gift" :color="discountMode ? T.text : T.neutral" :size="15" />
          </div>
          <div :style="{ flex: 1 }">
            <div :style="{ fontSize: '13px', fontWeight: 600, color: T.text }">
              Скидка 3 000 ₽
            </div>
            <div :style="{ fontSize: '11px', color: T.textSec }">
              {{ discountMode
                ? (discountApplied ? 'Применена' : 'Выберите светильник')
                : 'На первый светильник'
              }}
            </div>
          </div>
          <!-- Toggle switch -->
          <div
            :style="{
              width: '38px',
              height: '22px',
              borderRadius: '11px',
              background: discountMode ? T.text : T.textDim + '44',
              position: 'relative',
              transition: 'background 0.2s',
              flexShrink: 0,
            }"
          >
            <div
              :style="{
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                background: discountMode ? T.bg : '#888',
                position: 'absolute',
                top: '3px',
                left: discountMode ? '19px' : '3px',
                transition: 'left 0.2s',
              }"
            />
          </div>
        </div>
      </div>

      <!-- ═══ Room accordions ═══ -->
      <div v-for="(r, ri) in filledRooms" :key="r.id" :style="{ marginBottom: '2px' }">
        <!-- Room header -->
        <div
          :style="{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 0',
            cursor: 'pointer',
          }"
          @click="toggleRoom(r.id)"
        >
          <div :style="{ display: 'flex', alignItems: 'center', gap: '8px' }">
            <span :style="{ fontSize: '14px', fontWeight: 600, color: T.text }">
              {{ r.customName || getRT(r.typeId).name }}
            </span>
            <!-- Count badge -->
            <span
              :style="{
                fontSize: '10px',
                fontWeight: 500,
                color: T.textDim,
                border: `1px solid ${T.border}`,
                borderRadius: '10px',
                padding: '1px 7px',
                lineHeight: '16px',
              }"
            >
              {{ fxCount(r) }} шт
            </span>
          </div>
          <div :style="{ display: 'flex', alignItems: 'center', gap: '8px' }">
            <span :style="{ fontSize: '13px', fontWeight: 500, color: T.textDim }">
              {{ roomTotal(r).toLocaleString('ru-RU') }} ₽
            </span>
            <svg
              width="16" height="16" viewBox="0 0 24 24" fill="none"
              :stroke="T.textDim" stroke-width="2"
              stroke-linecap="round" stroke-linejoin="round"
              :style="{
                transition: 'transform 0.25s ease',
                transform: isExpanded(r.id) ? 'rotate(180deg)' : 'rotate(0)',
              }"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        </div>

        <!-- Fixtures -->
        <div
          :style="{
            maxHeight: isExpanded(r.id) ? '800px' : '0',
            overflow: 'hidden',
            transition: 'max-height 0.3s ease',
          }"
        >
          <div
            :style="{
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              paddingBottom: ri < filledRooms.length - 1 ? '12px' : '0',
            }"
          >
            <button
              v-for="(fx, i) in r.fixtures"
              :key="i"
              :style="fxCardStyle(r.id, i)"
              @click="onFxClick(r.id, i)"
            >
              <!-- Discount radio -->
              <div
                v-if="discountMode"
                :style="{
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  border: `2px solid ${isDiscounted(r.id, i) ? T.text : T.textDim}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }"
              >
                <div
                  v-if="isDiscounted(r.id, i)"
                  :style="{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: T.text,
                  }"
                />
              </div>

              <!-- Info -->
              <div :style="{ flex: 1, minWidth: 0 }">
                <div
                  :style="{
                    fontSize: '13px',
                    fontWeight: 600,
                    color: T.text,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }"
                >
                  <span>{{ MD[fx.m].name }}</span>
                  <span
                    v-if="(fx.q ?? 1) > 1"
                    :style="{ color: T.textSec, fontWeight: 400, fontSize: '12px' }"
                  >
                    × {{ fx.q }}
                  </span>
                </div>
                <!-- Wood badge -->
                <div :style="woodBadgeStyle(WCOL[fx.wood ?? 'oak'])">
                  <div
                    :style="{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: WCOL[fx.wood ?? 'oak'],
                    }"
                  />
                  {{ MATS.find((x) => x.id === (fx.wood ?? 'oak'))?.name }}
                </div>
              </div>

              <!-- Price -->
              <div :style="{ flexShrink: 0, textAlign: 'right' }">
                <div
                  v-if="isDiscounted(r.id, i)"
                  :style="{
                    fontSize: '10px',
                    color: T.textDim,
                    textDecoration: 'line-through',
                  }"
                >
                  {{ itemPrice(fx).toLocaleString('ru-RU') }} ₽
                </div>
                <div :style="{ fontSize: '13px', fontWeight: 600, color: T.text }">
                  {{
                    (isDiscounted(r.id, i)
                      ? Math.max(0, itemPrice(fx) - 3000)
                      : itemPrice(fx)
                    ).toLocaleString('ru-RU')
                  }} ₽
                </div>
              </div>
            </button>
          </div>
        </div>

        <!-- Separator (not on last room) -->
        <div
          v-if="ri < filledRooms.length - 1"
          :style="{ height: '1px', background: T.border, opacity: 0.6 }"
        />
      </div>

      <!-- Empty state -->
      <div
        v-if="filledRooms.length === 0"
        :style="{ textAlign: 'center', padding: '40px', color: T.textDim }"
      >
        Добавьте светильники
      </div>

      <!-- ═══ CTA block ═══ -->
      <div
        v-if="filledRooms.length > 0"
        :style="{ marginTop: '32px', textAlign: 'center', paddingBottom: '32px' }"
      >
        <div :style="{ fontSize: '18px', fontWeight: 700, color: T.text, marginBottom: '10px' }">
          Лес собран
        </div>
        <div
          :style="{
            fontSize: '14px',
            fontWeight: 600,
            color: T.text,
            lineHeight: 1.5,
            marginBottom: '24px',
          }"
        >
          Отправьте план —<br />дерево засветит у вас дома
        </div>

        <button
          :style="{
            width: '100%',
            padding: '14px',
            background: '#FFFFFF',
            color: T.bg,
            border: 'none',
            borderRadius: '10px',
            fontWeight: 700,
            cursor: 'pointer',
            fontSize: '14px',
            fontFamily: 'inherit',
          }"
          @click="submitList"
        >
          Отправить план леса
        </button>

        <div
          :style="{
            fontSize: '12px',
            color: T.textSec,
            lineHeight: 1.6,
            maxWidth: '320px',
            margin: '14px auto 0',
          }"
        >
          Специалист WOODLED получит ваш план освещения
          и комплектацию каждого светильника.
        </div>
      </div>
    </div>
  </div>
</template>

<style>
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}
</style>
