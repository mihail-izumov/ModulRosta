<script setup lang="ts">
/**
 * WelcomeScreen.vue — Первая страница при первом запуске.
 *
 * Это НЕ модалка/overlay. Рендерится как route через App.vue
 * (наравне с RoomDetail / FxEditor / Home).
 *
 * Заголовок «Спроектируйте свой лес» — мостик из онбординга
 * (последняя глава: «В каждой комнате — своё дерево. Спроектируйте свой лес»).
 * Это связывает онбординг и конфигуратор единым языком.
 *
 * Брендовый header (Живой Дом / WOODLED ROTOR) намеренно убран —
 * на первом экране бренд избыточен и дублирует главную.
 *
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
      padding: '40px 16px 24px',
      fontFamily: `'Segoe UI', system-ui, sans-serif`,
      color: T.text,
      background: T.bg,
      minHeight: '100vh',
      boxSizing: 'border-box',
    }"
  >
    <!-- Заголовок-мостик из онбординга -->
    <div
      :style="{
        fontSize: '26px',
        fontWeight: 700,
        color: T.text,
        marginBottom: '10px',
        lineHeight: 1.2,
      }"
    >
      Спроектируйте свой лес
    </div>
    <div
      :style="{
        fontSize: '14px',
        color: T.textSec,
        lineHeight: 1.55,
        marginBottom: '28px',
        maxWidth: '480px',
      }"
    >
      Каждая комната — своё дерево. Выберите формат — мы расставим свет
      по реальной статистике WOODLED. Дальше всё под себя.
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
