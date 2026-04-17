<script setup lang="ts">
/**
 * BuyModal.vue — «Ваш лес WOODLED» с 3-шаговым flow.
 *
 * Источник: woodled-v42.jsx (BuyModal).
 * Шаги:
 *   1. list  — список комнат со светильниками, выбор одного для скидки
 *   2. form  — имя, телефон, комментарий
 *   3. done  — «План отправлен» + имя выбранной модели
 */

import { computed, ref } from 'vue'
import { T, Z } from '../theme/tokens'
import { MD, type Fixture } from '../data/catalog'
import { MATS, WCOL } from '../data/materials'
import { autoMood } from '../data/moods'
import { baseLm, fxLm } from '../engine/brightness'
import { fxPrice, itemPrice } from '../engine/price-engine'
import { lw } from '../engine/i18n'
import { getRT, type Room } from '../data/rooms'
import Icon, { fxIcName } from './ui/Icons.vue'
import FxEditor from './FxEditor.vue'

interface Props {
  rooms: Room[]
}
const props = defineProps<Props>()
const emit = defineEmits<{
  editFx: [roomId: string, fxIdx: number, next: Fixture | null]
  close: []
  feedback: [msg: string]
}>()

type Step = 'list' | 'form' | 'done'

const step = ref<Step>('list')
const discountFx = ref<{ roomId: string; fxIdx: number } | null>(null)
const editItem = ref<{ roomId: string; fxIdx: number } | null>(null)

const contact = ref({ name: '', phone: '', comment: '' })

const filledRooms = computed(() => props.rooms.filter((r) => r.fixtures.length > 0))

/* Найти выбранный (со скидкой) fixture для отображения в form/done. */
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

function toggleDiscount(roomId: string, fxIdx: number) {
  const sel = discountFx.value
  if (sel && sel.roomId === roomId && sel.fxIdx === fxIdx) {
    discountFx.value = null
  } else {
    discountFx.value = { roomId, fxIdx }
  }
}

function openEdit(roomId: string, fxIdx: number) {
  editItem.value = { roomId, fxIdx }
}

function submitList() {
  if (!discountFx.value) {
    emit('feedback', 'Выберите светильник для скидки')
    return
  }
  step.value = 'form'
}

function submitForm() {
  if (!contact.value.phone) {
    emit('feedback', 'Укажите телефон')
    return
  }
  step.value = 'done'
}

/* Под редактирование конкретного светильника. */
const editItemData = computed(() => {
  if (!editItem.value) return null
  const room = props.rooms.find((r) => r.id === editItem.value!.roomId)
  const fx = room?.fixtures[editItem.value!.fxIdx]
  if (!room || !fx) return null
  return { room, fx }
})
</script>

<template>
  <!-- ШАГ 3: done -->
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
          {{ discountDetails.woodName }} · {{ discountDetails.m.name }}</span
        >.
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
      }"
      @click="emit('close')"
    >
      Вернуться к лесу
    </button>
  </div>

  <!-- ШАГ 2: form -->
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
          fontSize: '20px',
          cursor: 'pointer',
        }"
        @click="step = 'list'"
      >
        ←
      </button>
      <span :style="{ flex: 1, fontWeight: 700, fontSize: '16px', color: T.text }">
        Оставить заявку
      </span>
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
          background: T.neutral,
          color: T.bg,
          border: 'none',
          borderRadius: '8px',
          fontWeight: 700,
          cursor: 'pointer',
          fontSize: '14px',
        }"
        @click="submitForm"
      >
        Отправить план леса
      </button>
      <div
        :style="{
          fontSize: '11px',
          color: T.textDim,
          marginTop: '10px',
          textAlign: 'center',
        }"
      >
        Консультант свяжется в течение часа
      </div>
    </div>
  </div>

  <!-- ШАГ 1: list -->
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
    <!-- Header -->
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
          fontSize: '20px',
          cursor: 'pointer',
        }"
        @click="emit('close')"
      >
        ←
      </button>
      <span :style="{ flex: 1, fontWeight: 700, fontSize: '16px', color: T.text }">
        Ваш лес WOODLED
      </span>
    </div>

    <div :style="{ padding: '16px', maxWidth: '480px', margin: '0 auto' }">
      <div :style="{ textAlign: 'center', marginBottom: '16px' }">
        <div :style="{ fontSize: '16px', fontWeight: 700, color: T.text }">
          3 000 ₽ на любой светильник
        </div>
        <div :style="{ fontSize: '12px', color: T.textSec, marginTop: '4px' }">
          Нажмите, чтобы применить скидку
        </div>
      </div>

      <!-- Комнаты со светильниками -->
      <div v-for="r in filledRooms" :key="r.id" :style="{ marginBottom: '16px' }">
        <!-- Заголовок комнаты + цена -->
        <div
          :style="{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '8px',
          }"
        >
          <div
            :style="{
              fontSize: '13px',
              fontWeight: 600,
              color:
                autoMood(
                  baseLm(getRT(r.typeId), r) > 0
                    ? fxLm(r.fixtures) / baseLm(getRT(r.typeId), r)
                    : 0,
                ).id !== 'empty'
                  ? autoMood(
                      baseLm(getRT(r.typeId), r) > 0
                        ? fxLm(r.fixtures) / baseLm(getRT(r.typeId), r)
                        : 0,
                    ).color
                  : T.text,
            }"
          >
            {{ r.customName || getRT(r.typeId).name }}
          </div>
          <div
            :style="{
              fontSize: '13px',
              fontWeight: 700,
              color: T.text,
              display: 'flex',
              gap: '6px',
              alignItems: 'baseline',
            }"
          >
            <span
              v-if="discountFx?.roomId === r.id"
              :style="{
                fontSize: '11px',
                color: T.textDim,
                textDecoration: 'line-through',
                fontWeight: 400,
              }"
            >
              {{ fxPrice(r.fixtures).toLocaleString('ru-RU') }} ₽
            </span>
            <span>
              {{
                (discountFx?.roomId === r.id
                  ? Math.max(0, fxPrice(r.fixtures) - 3000)
                  : fxPrice(r.fixtures)
                ).toLocaleString('ru-RU')
              }} ₽
            </span>
          </div>
        </div>

        <!-- Светильники комнаты -->
        <div
          v-for="(fx, i) in r.fixtures"
          :key="i"
          :style="{ marginBottom: '6px' }"
        >
          <button
            :style="{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 12px',
              background:
                discountFx?.roomId === r.id && discountFx?.fxIdx === i
                  ? T.green + '08'
                  : T.card,
              border: `1px solid ${
                discountFx?.roomId === r.id && discountFx?.fxIdx === i
                  ? T.green + '33'
                  : T.border
              }`,
              borderRadius: '8px',
              cursor: 'pointer',
              textAlign: 'left',
            }"
            @click="toggleDiscount(r.id, i)"
          >
            <div
              :style="{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: WCOL[fx.wood ?? 'oak'] + '22',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }"
            >
              <Icon
                :name="fxIcName(MD[fx.m].type)"
                :color="WCOL[fx.wood ?? 'oak']"
                :size="18"
              />
            </div>
            <div :style="{ flex: 1 }">
              <div :style="{ fontSize: '13px', fontWeight: 600, color: T.text }">
                {{ MATS.find((x) => x.id === (fx.wood ?? 'oak'))?.name }} ·
                {{ MD[fx.m].name }}
                <template v-if="(fx.q ?? 1) > 1">× {{ fx.q }}</template>
              </div>
              <div :style="{ fontSize: '11px', color: T.textSec }">
                {{ (fx.l ?? MD[fx.m].lamps) * (fx.q ?? 1) }}
                {{ lw((fx.l ?? MD[fx.m].lamps) * (fx.q ?? 1)) }}
              </div>
            </div>
            <div :style="{ textAlign: 'right', flexShrink: 0 }">
              <div
                v-if="discountFx?.roomId === r.id && discountFx?.fxIdx === i"
                :style="{
                  display: 'inline-block',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  background: T.green + '22',
                  fontSize: '9px',
                  fontWeight: 700,
                  color: T.text,
                  marginBottom: '2px',
                }"
              >
                СКИДКА
              </div>
              <template v-if="discountFx?.roomId === r.id && discountFx?.fxIdx === i">
                <div
                  :style="{
                    fontSize: '10px',
                    color: T.textDim,
                    textDecoration: 'line-through',
                  }"
                >
                  {{ itemPrice(fx).toLocaleString('ru-RU') }} ₽
                </div>
                <div :style="{ fontSize: '13px', fontWeight: 700, color: T.text }">
                  {{ Math.max(0, itemPrice(fx) - 3000).toLocaleString('ru-RU') }} ₽
                </div>
              </template>
              <div
                v-else
                :style="{ fontSize: '12px', fontWeight: 600, color: T.textSec }"
              >
                {{ itemPrice(fx).toLocaleString('ru-RU') }} ₽
              </div>
            </div>
          </button>

          <!-- Кнопка перейти в редактор (скрытая, в оригинале только через тап на карточку — но там
               нужно не сбить скидку. Делаем через длительное нажатие в будущем, пока не добавляем.) -->
        </div>
      </div>

      <div
        v-if="filledRooms.length === 0"
        :style="{ textAlign: 'center', padding: '40px', color: T.textDim }"
      >
        Добавьте светильники
      </div>
    </div>

    <!-- Sticky submit -->
    <div v-if="filledRooms.length > 0" :style="{ position: 'sticky', bottom: 0 }">
      <div
        :style="{
          height: '24px',
          background: `linear-gradient(to bottom, transparent, ${T.bg})`,
        }"
      />
      <div
        :style="{
          background: T.bg,
          padding: '0 16px 20px',
          maxWidth: '480px',
          margin: '0 auto',
        }"
      >
        <button
          :style="{
            width: '100%',
            padding: '14px',
            background: discountFx ? T.text : T.border,
            color: discountFx ? T.bg : T.textDim,
            border: 'none',
            borderRadius: '8px',
            fontWeight: 700,
            cursor: 'pointer',
            fontSize: '14px',
          }"
          @click="submitList"
        >
          Отправить план леса
        </button>
      </div>
    </div>

    <!-- Редактор светильника поверх -->
    <FxEditor
      v-if="editItemData"
      :item="editItemData.fx"
      :def-wood="editItemData.fx.wood ?? 'oak'"
      @save="(n) => emit('editFx', editItem!.roomId, editItem!.fxIdx, n)"
      @delete="emit('editFx', editItem!.roomId, editItem!.fxIdx, null)"
      @close="editItem = null"
      @feedback="(msg) => emit('feedback', msg)"
    />
  </div>

  <!-- reference to silence linter -->
  <span v-show="false">{{ openEdit }}</span>
</template>

<style>
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}
</style>
