<script setup lang="ts">
/**
 * MoodBlock.vue — Блок настроения с MoodArc.
 *
 * Fix 12: Прогресс-дуга обрезается по горизонту (clipPath) —
 *         убран артефакт свечения внизу слева от stroke-linecap:round.
 */

import { computed } from 'vue'
import { T } from '../theme/tokens'
import type { Mood } from '../data/moods'
import { ratioToAngle } from '../engine/brightness'
import Icon, { type IconName } from './ui/Icons.vue'

interface Props {
  mood: Mood
  ratio: number
  roomPrepName: string
}
const props = defineProps<Props>()
const emit = defineEmits<{ showDetail: [] }>()

const CX = 140
const CY = 140
const R = 120
const W = 10
const OR = R + W / 2
const IR = R - W / 2
const SVG_H = CY + 4

function pt(deg: number, radius: number) {
  const rad = (deg * Math.PI) / 180
  return { x: CX - radius * Math.cos(rad), y: CY - radius * Math.sin(rad) }
}

function bandPath(d1: number, d2: number): string {
  const oA = pt(d1, OR), oB = pt(d2, OR)
  const iA = pt(d1, IR), iB = pt(d2, IR)
  const lg = (d2 - d1) > 180 ? 1 : 0
  return `M${oA.x.toFixed(2)},${oA.y.toFixed(2)} A${OR},${OR},0,${lg},1,${oB.x.toFixed(2)},${oB.y.toFixed(2)} L${iB.x.toFixed(2)},${iB.y.toFixed(2)} A${IR},${IR},0,${lg},0,${iA.x.toFixed(2)},${iA.y.toFixed(2)}Z`
}

function strokeArc(d1: number, d2: number): string {
  const a = pt(d1, R), b = pt(d2, R)
  const lg = (d2 - d1) > 180 ? 1 : 0
  return `M${a.x.toFixed(2)},${a.y.toFixed(2)} A${R},${R},0,${lg},1,${b.x.toFixed(2)},${b.y.toFixed(2)}`
}

const fullBand = bandPath(0, 180)

const progressArc = computed(() => {
  const angle = Math.max(ratioToAngle(props.ratio), 0.5)
  return strokeArc(0, Math.min(angle, 179.5))
})
</script>

<template>
  <div class="mood-block">
    <div class="mood-header" :style="{ color: mood.color + 'bb' }">
      Настроение {{ roomPrepName }}
    </div>

    <div :style="{ display: 'flex', justifyContent: 'center', margin: '4px 0' }">
      <svg
        :viewBox="`0 0 280 ${SVG_H}`"
        :style="{ width: '280px', height: SVG_H + 'px' }"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="moodProgressGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" :stop-color="mood.color" stop-opacity="0.05" />
            <stop offset="100%" :stop-color="mood.color" stop-opacity="1.0" />
          </linearGradient>
          <!-- Fix 12: clipPath обрезает и свечение, и прогресс-дугу -->
          <clipPath id="moodHorizonClip">
            <rect x="0" y="0" width="280" :height="CY" />
          </clipPath>
        </defs>

        <!-- Свечение — обрезано по горизонту -->
        <g clip-path="url(#moodHorizonClip)">
          <ellipse :cx="CX" :cy="CY - 10" rx="130" ry="100"
            :fill="mood.color" opacity="0.06" :style="{ filter: 'blur(30px)' }" />
          <ellipse :cx="CX" :cy="CY - 30" rx="90" ry="70"
            :fill="mood.color" opacity="0.08" :style="{ filter: 'blur(20px)' }" />
        </g>

        <!-- Трек -->
        <path :d="fullBand" fill="rgba(255,255,255,0.07)" />

        <!-- Прогресс — Fix 12: обрезан тем же clipPath, round cap не вылезает -->
        <g clip-path="url(#moodHorizonClip)">
          <path
            :d="progressArc"
            fill="none"
            stroke="url(#moodProgressGrad)"
            :stroke-width="W"
            stroke-linecap="round"
          />
        </g>

        <!-- Иконка -->
        <circle :cx="CX" :cy="CY - 36" r="26" fill="transparent" :stroke="mood.color + '33'" stroke-width="1" />
        <circle :cx="CX" :cy="CY - 36" r="22" :fill="mood.color + '08'" stroke="none" />
        <g :transform="`translate(${CX - 14}, ${CY - 36 - 14})`">
          <foreignObject width="28" height="28">
            <Icon :name="(mood.iconKey ?? 'sun') as IconName" :color="mood.color" :size="28" />
          </foreignObject>
        </g>
      </svg>
    </div>

    <div class="mood-name">{{ mood.name }}</div>
    <div class="mood-desc">{{ mood.desc }}</div>

    <button
      class="mood-detail-btn"
      :style="{ background: mood.color, color: T.bg }"
      @click="emit('showDetail')"
    >
      Больше о настроении
    </button>
  </div>
</template>

<style scoped>
.mood-block {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  padding: 16px 20px 20px;
  margin-bottom: 16px;
  text-align: center;
}
.mood-header {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 2.5px;
  margin-bottom: 4px;
}
.mood-name {
  font-size: 18px;
  font-weight: 700;
  color: v-bind('T.text');
  margin-top: 8px;
}
.mood-desc {
  font-size: 12px;
  color: v-bind('T.textSec');
  line-height: 1.5;
  margin-top: 4px;
  max-width: 280px;
  margin-left: auto;
  margin-right: auto;
}
.mood-detail-btn {
  margin-top: 16px;
  padding: 9px 22px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 700;
  font-family: inherit;
}
</style>
