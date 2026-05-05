<script setup lang="ts">
/**
 * WelcomeScreen.vue — Первая страница при первом запуске.
 *
 * Заголовок «Спроектируйте свой лес» — мостик из онбординга.
 *
 * Карточки шаблонов показывают НЕ светильники, а ДЕРЕВЬЯ — это
 * заводит в метафору с первой секунды. Каждая карточка:
 *   - слева плашка с метражом квартиры (~45 / ~65 / ~85 м²)
 *   - справа список комнат с цветными точками (ROOM_TINTS)
 *     и миниатюрами деревьев в каждой (oak / walnut / black)
 *
 * Это:
 *   1. Превращает интерфейс в «игру» — видишь свой будущий лес
 *   2. Связывает welcome с главным экраном (там тоже цветные комнаты)
 *   3. Не дублирует информацию — каждый шаблон визуально уникален
 *      по составу комнат и пород дерева
 *   4. Снимает путаницу со «светильники vs точки подключения»
 *
 * Брендовый header (Живой Дом / WOODLED ROTOR) намеренно убран.
 */

import { computed } from 'vue'
import { T, ROOM_TINTS, WCOL } from '../theme/tokens'
import { TEMPLATES, type HomeTemplate, type TemplateRoom } from '../data/templates'
import { getRT, type RoomTypeId } from '../data/rooms'
import type { Wood } from '../data/materials'
import { useConfigurator } from '../store/configurator'

const cfg = useConfigurator()

interface RoomMini {
  name: string
  tint: string
  /** Цвета деревьев для каждого светильника (с учётом q). */
  trees: string[]
}

interface TplCard {
  id: string
  areaLabel: string
  rooms: RoomMini[]
}

/**
 * Превращает TemplateRoom в RoomMini с цветной точкой комнаты
 * и массивом цветов деревьев (с учётом q каждого светильника).
 */
function buildRoomMini(tr: TemplateRoom): RoomMini {
  const rt = getRT(tr.typeId as RoomTypeId)
  const trees: string[] = []
  for (const fx of tr.fixtures) {
    const wood: Wood = fx.wood
    const color = WCOL[wood]
    const q = fx.q ?? 1
    for (let i = 0; i < q; i++) trees.push(color)
  }
  return {
    name: rt.name,
    tint: ROOM_TINTS[tr.typeId as RoomTypeId],
    trees,
  }
}

const cards = computed<TplCard[]>(() =>
  TEMPLATES.map((t: HomeTemplate) => ({
    id: t.id,
    areaLabel: t.areaLabel,
    rooms: t.rooms.map(buildRoomMini),
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
          gap: '16px',
          width: '100%',
          padding: '16px',
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
            alignSelf: 'center',
          }"
        >
          {{ c.areaLabel }}
        </div>

        <!-- Список комнат с деревьями -->
        <div
          :style="{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
          }"
        >
          <div
            v-for="(r, ri) in c.rooms"
            :key="ri"
            :style="{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '12px',
            }"
          >
            <!-- Цветная точка комнаты -->
            <span
              :style="{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: r.tint,
                flexShrink: 0,
              }"
            />
            <!-- Название комнаты -->
            <span
              :style="{
                color: T.text,
                fontWeight: 500,
                minWidth: '70px',
                flexShrink: 0,
              }"
            >
              {{ r.name }}
            </span>
            <!-- Деревья -->
            <span
              :style="{
                display: 'flex',
                gap: '3px',
                alignItems: 'center',
                flexWrap: 'wrap',
              }"
            >
              <span
                v-for="(treeColor, ti) in r.trees"
                :key="ti"
                :style="{
                  width: '14px',
                  height: '14px',
                  borderRadius: '50%',
                  background: treeColor,
                  border: treeColor === WCOL.black
                    ? `1px solid ${T.textDim}`
                    : 'none',
                  flexShrink: 0,
                }"
              />
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

    <!-- Легенда снизу — едва заметная подпись чтобы юзер понял что точки = деревья -->
    <div
      :style="{
        marginTop: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '14px',
        fontSize: '11px',
        color: T.textDim,
      }"
    >
      <span :style="{ display: 'flex', alignItems: 'center', gap: '5px' }">
        <span
          :style="{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            background: WCOL.oak,
          }"
        />
        Дуб
      </span>
      <span :style="{ display: 'flex', alignItems: 'center', gap: '5px' }">
        <span
          :style="{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            background: WCOL.walnut,
          }"
        />
        Орех
      </span>
      <span :style="{ display: 'flex', alignItems: 'center', gap: '5px' }">
        <span
          :style="{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            background: WCOL.black,
            border: `1px solid ${T.textDim}`,
          }"
        />
        Чёрный
      </span>
    </div>
  </div>
</template>
