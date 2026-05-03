<script setup lang="ts">
/**
 * WelcomeScreen.vue — Первая страница при первом запуске.
 *
 * Это НЕ модалка/overlay. Рендерится как route через App.vue
 * (наравне с RoomDetail / FxEditor / Home), занимает всё место
 * на экране и использует те же визуальные стили что главная
 * (max-width 560px, padding 16px, тёмный фон, шрифт Segoe UI).
 *
 * 3 шаблона домов (~45/65/85 м²) + кнопка «Начать с пустого дома».
 * После выбора закрывается навсегда (флаг welcomeSeen в localStorage).
 */

import { computed } from 'vue'
import { T } from '../theme/tokens'
import { TEMPLATES, type HomeTemplate } from '../data/templates'
import { getRT, type RoomTypeId } from '../data/rooms'
import { useConfigurator } from '../store/configurator'

const cfg = useConfigurator()

interface TplCard {
  id: string
  areaLabel: string
  fixturesCount: number
  roomNames: string[]
}

const cards = computed<TplCard[]>(() =>
  TEMPLATES.map((t: HomeTemplate) => ({
    id: t.id,
    areaLabel: t.areaLabel,
    fixturesCount: t.rooms.reduce(
      (s, r) => s + r.fixtures.reduce((a, f) => a + (f.q ?? 1), 0),
      0,
    ),
    roomNames: t.rooms.map((r) => getRT(r.typeId as RoomTypeId).name),
  })),
)

function pickTemplate(id: string) {
  cfg.loadTemplate(id)
}

function startEmpty() {
  cfg.dismissWelcome()
}
</script>

<template>
  <div
    :style="{
      maxWidth: '560px',
      margin: '0 auto',
      padding: '16px',
      fontFamily: `'Segoe UI', system-ui, sans-serif`,
      color: T.text,
      background: T.bg,
      minHeight: '100vh',
      boxSizing: 'border-box',
    }"
  >
    <!-- Тот же header что на главной — WOODLED ROTOR badge -->
    <div :style="{ textAlign: 'center', marginBottom: '32px', paddingTop: '8px' }">
      <div :style="{ fontSize: '22px', fontWeight: 700, color: T.text }">
        Живой Дом
      </div>
      <div
        :style="{
          display: 'inline-block',
          marginTop: '6px',
          padding: '3px 12px',
          borderRadius: '10px',
          background: T.neutral + '18',
          fontSize: '10px',
          fontWeight: 700,
          color: T.neutral,
          letterSpacing: '0.5px',
        }"
      >
        WOODLED ROTOR
      </div>
    </div>

    <!-- Заголовок -->
    <div
      :style="{
        fontSize: '20px',
        fontWeight: 700,
        color: T.text,
        marginBottom: '6px',
      }"
    >
      Начните здесь
    </div>
    <div
      :style="{
        fontSize: '13px',
        color: T.textSec,
        lineHeight: 1.5,
        marginBottom: '20px',
      }"
    >
      Выберите формат дома для старта — далее всё сделаете под себя
    </div>

    <!-- Карточки шаблонов -->
    <div
      :style="{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        marginBottom: '12px',
      }"
    >
      <button
        v-for="c in cards"
        :key="c.id"
        :style="{
          display: 'flex',
          alignItems: 'stretch',
          gap: '14px',
          width: '100%',
          padding: '14px',
          background: T.card,
          border: `1px solid ${T.border}`,
          borderRadius: '12px',
          cursor: 'pointer',
          textAlign: 'left',
          color: T.text,
          fontFamily: 'inherit',
        }"
        @click="pickTemplate(c.id)"
      >
        <!-- Плашка с метражом (слева) -->
        <div
          :style="{
            flexShrink: 0,
            width: '88px',
            minHeight: '88px',
            borderRadius: '10px',
            background: T.neutral + '18',
            border: `1px solid ${T.neutral}33`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
            fontWeight: 700,
            color: T.neutral,
          }"
        >
          {{ c.areaLabel }}
        </div>

        <!-- Правая часть -->
        <div :style="{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }">
          <div
            :style="{
              fontSize: '17px',
              fontWeight: 700,
              color: T.text,
            }"
          >
            {{ c.fixturesCount }} светильников
          </div>

          <!-- Бейджи комнат -->
          <div :style="{ display: 'flex', flexWrap: 'wrap', gap: '4px' }">
            <span
              v-for="(name, i) in c.roomNames"
              :key="i"
              :style="{
                fontSize: '11px',
                padding: '3px 8px',
                borderRadius: '4px',
                background: T.neutral + '15',
                color: T.textSec,
              }"
            >
              {{ name }}
            </span>
          </div>
        </div>
      </button>
    </div>

    <!-- Начать с пустого дома -->
    <button
      :style="{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        padding: '18px 14px',
        background: T.cardAlt,
        border: `1px solid ${T.border}`,
        borderRadius: '12px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: 600,
        color: T.text,
        fontFamily: 'inherit',
      }"
      @click="startEmpty"
    >
      Начать с пустого дома
    </button>
  </div>
</template>
