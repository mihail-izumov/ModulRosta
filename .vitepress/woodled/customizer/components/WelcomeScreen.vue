<script setup lang="ts">
/**
 * WelcomeScreen.vue — Первая страница «План вашего леса».
 *
 * Концепция: garden planner.
 * Карточка шаблона = одна горизонтальная диаграмма-лента всех комнат
 * (включая кухню и коридор), где ширина каждой плашки пропорциональна
 * её площади. Это даёт сразу два визуальных ответа:
 *   1. Какие комнаты в формате
 *   2. Их относительные размеры (видно «откуда складывается общая площадь»)
 *
 * Деревья — главный акцент:
 *   - Размер кружков заметно крупнее (16px), располагаются под названием
 *   - На пастельном фоне комнаты читаются как «посаженные в эту комнату»
 *
 * Стрелка → справа от плашки метража подчёркивает что вся карточка
 * кликабельна целиком (юзер не путает «тап на комнату» с «тап на дом»).
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

interface RoomBlock {
  name: string
  tint: string
  range: string
  sizeArea: number
  trees: string[]
}

interface TplCard {
  id: string
  areaLabel: string
  rooms: RoomBlock[]
}

function collectTrees(tr: TemplateRoom): string[] {
  const trees: string[] = []
  for (const fx of tr.fixtures) {
    const wood: Wood = fx.wood
    const color = WCOL[wood]
    const q = fx.q ?? 1
    for (let i = 0; i < q; i++) trees.push(color)
  }
  return trees
}

function buildCard(tpl: HomeTemplate): TplCard {
  const blocks: RoomBlock[] = tpl.rooms.map((tr) => {
    const rt = getRT(tr.typeId as RoomTypeId)
    const sizeIdx = (tr.sizeIndex ?? 1) as 0 | 1 | 2
    return {
      name: rt.name,
      tint: ROOM_TINTS[tr.typeId as RoomTypeId],
      range: rt.ranges[sizeIdx],
      sizeArea: rt.sizes[sizeIdx],
      trees: collectTrees(tr),
    }
  })
  return {
    id: tpl.id,
    areaLabel: tpl.areaLabel,
    rooms: blocks,
  }
}

const cards = computed<TplCard[]>(() => TEMPLATES.map(buildCard))

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
      padding: '32px 16px 20px',
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
        fontSize: '24px',
        fontWeight: 700,
        color: T.text,
        marginBottom: '8px',
        lineHeight: 1.2,
      }"
    >
      Спроектируйте свой лес
    </div>
    <div
      :style="{
        fontSize: '13px',
        color: T.textSec,
        lineHeight: 1.5,
        marginBottom: '20px',
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
        gap: '8px',
        marginBottom: '10px',
      }"
    >
      <button
        v-for="c in cards"
        :key="c.id"
        :style="{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          width: '100%',
          padding: '12px',
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
        <!-- Слева: плашка с метражом -->
        <div
          :style="{
            flexShrink: 0,
            width: '56px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: T.neutral + '15',
            border: `1px solid ${T.neutral}28`,
            borderRadius: '8px',
            padding: '8px 4px',
            alignSelf: 'stretch',
          }"
        >
          <div
            :style="{
              fontSize: '13px',
              fontWeight: 700,
              color: T.neutral,
              lineHeight: 1,
              fontVariantNumeric: 'tabular-nums',
              whiteSpace: 'nowrap',
            }"
          >
            {{ c.areaLabel }}
          </div>
        </div>

        <!-- Лента всех комнат (включая кухню и коридор) — пропорциональные ширины -->
        <div
          :style="{
            flex: 1,
            display: 'flex',
            gap: '3px',
            minHeight: '76px',
            minWidth: 0,
          }"
        >
          <div
            v-for="(r, ri) in c.rooms"
            :key="ri"
            :style="{
              flexGrow: r.sizeArea,
              flexShrink: 1,
              flexBasis: '0',
              minWidth: '40px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              background: r.tint,
              borderRadius: '6px',
              padding: '7px 8px',
              gap: '4px',
              overflow: 'hidden',
            }"
          >
            <!-- Название -->
            <div
              :style="{
                fontSize: '10px',
                fontWeight: 700,
                color: T.bg,
                lineHeight: 1.1,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                opacity: 0.85,
              }"
            >
              {{ r.name }}
            </div>

            <!-- Деревья — главный акцент, крупнее -->
            <div
              :style="{
                display: 'flex',
                gap: '4px',
                alignItems: 'center',
                flexWrap: 'wrap',
                flex: 1,
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
                    ? `1px solid rgba(19,17,14,0.4)`
                    : 'none',
                  flexShrink: 0,
                  boxShadow: '0 1px 2px rgba(0,0,0,0.15)',
                }"
              />
            </div>

            <!-- Диапазон м² -->
            <div
              :style="{
                fontSize: '9px',
                color: 'rgba(19,17,14,0.5)',
                fontVariantNumeric: 'tabular-nums',
                lineHeight: 1,
                whiteSpace: 'nowrap',
              }"
            >
              {{ r.range }}
            </div>
          </div>
        </div>

        <!-- Справа: явная CTA-стрелка чтобы карточка читалась как кнопка-выбор -->
        <div
          :style="{
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: T.textSec,
          }"
        >
          <svg
            width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
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
        padding: '14px',
        background: T.cardAlt,
        border: `1px solid ${T.border}`,
        borderRadius: '12px',
        cursor: 'pointer',
        fontSize: '13px',
        fontWeight: 600,
        color: T.text,
        fontFamily: 'inherit',
      }"
      @click="startEmpty"
    >
      Начать с пустого дома
    </button>

    <!-- Легенда деревьев -->
    <div
      :style="{
        marginTop: '14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '14px',
        fontSize: '10px',
        color: T.textDim,
      }"
    >
      <span :style="{ display: 'flex', alignItems: 'center', gap: '4px' }">
        <span
          :style="{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: WCOL.oak,
          }"
        />
        Дуб
      </span>
      <span :style="{ display: 'flex', alignItems: 'center', gap: '4px' }">
        <span
          :style="{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: WCOL.walnut,
          }"
        />
        Орех
      </span>
      <span :style="{ display: 'flex', alignItems: 'center', gap: '4px' }">
        <span
          :style="{
            width: '8px',
            height: '8px',
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
