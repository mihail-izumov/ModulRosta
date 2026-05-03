<script setup lang="ts">
/**
 * WelcomeScreen.vue — Стартовый экран при первом запуске.
 *
 * Показывает 3 шаблона домов (~45/65/85 м²) + кнопку «Начать с пустого дома».
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
      position: 'fixed',
      inset: 0,
      background: T.bg,
      zIndex: 200,
      overflow: 'auto',
      fontFamily: `'Segoe UI', system-ui, sans-serif`,
    }"
  >
    <div
      :style="{
        maxWidth: '560px',
        margin: '0 auto',
        padding: '32px 20px',
        boxSizing: 'border-box',
      }"
    >
      <!-- Закрытие -->
      <div
        :style="{
          display: 'flex',
          justifyContent: 'flex-end',
          marginBottom: '8px',
        }"
      >
        <button
          :style="{
            background: 'none',
            border: 'none',
            color: T.textSec,
            fontSize: '20px',
            cursor: 'pointer',
            padding: '8px',
          }"
          @click="startEmpty"
        >
          ✕
        </button>
      </div>

      <!-- Заголовок -->
      <div
        :style="{
          fontSize: '24px',
          fontWeight: 700,
          color: T.text,
          marginBottom: '8px',
        }"
      >
        Начните здесь
      </div>
      <div
        :style="{
          fontSize: '14px',
          color: T.textSec,
          lineHeight: 1.5,
          marginBottom: '28px',
        }"
      >
        Выберите формат дома для старта — далее всё сделаете под себя
      </div>

      <!-- Карточки шаблонов -->
      <div
        :style="{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
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
            <!-- Заголовок: количество светильников -->
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

      <!-- Начать с пустого дома (равнозначная кнопка) -->
      <button
        :style="{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          padding: '20px 14px',
          background: T.cardAlt,
          border: `1px solid ${T.border}`,
          borderRadius: '12px',
          cursor: 'pointer',
          fontSize: '15px',
          fontWeight: 600,
          color: T.text,
          fontFamily: 'inherit',
        }"
        @click="startEmpty"
      >
        Начать с пустого дома
      </button>
    </div>
  </div>
</template>
