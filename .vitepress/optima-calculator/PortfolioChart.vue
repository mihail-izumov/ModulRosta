<script setup>
import { computed, ref } from 'vue'
import { formatCurrency } from './utils.js'

const props = defineProps({
  data: { type: Array, required: true }
})

const hoveredIndex = ref(null)
const tooltipPosition = ref({ x: 0, y: 0 })

const size = 200
const cx = size / 2
const cy = size / 2
const outerRadius = 90
const innerRadius = 55

const segments = computed(() => {
  const total = props.data.reduce((sum, item) => sum + item.value, 0)
  if (total === 0) return []
  
  let currentAngle = -90
  return props.data.map((item, index) => {
    const percentage = item.value / total
    const angle = percentage * 360
    const startAngle = currentAngle
    const endAngle = currentAngle + angle
    currentAngle = endAngle
    
    const startRad = (startAngle * Math.PI) / 180
    const endRad = (endAngle * Math.PI) / 180
    
    const x1Outer = cx + outerRadius * Math.cos(startRad)
    const y1Outer = cy + outerRadius * Math.sin(startRad)
    const x2Outer = cx + outerRadius * Math.cos(endRad)
    const y2Outer = cy + outerRadius * Math.sin(endRad)
    const x1Inner = cx + innerRadius * Math.cos(endRad)
    const y1Inner = cy + innerRadius * Math.sin(endRad)
    const x2Inner = cx + innerRadius * Math.cos(startRad)
    const y2Inner = cy + innerRadius * Math.sin(startRad)
    
    const largeArc = angle > 180 ? 1 : 0
    const path = `M ${x1Outer} ${y1Outer} A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${x2Outer} ${y2Outer} L ${x1Inner} ${y1Inner} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x2Inner} ${y2Inner} Z`
    
    const midAngle = ((startAngle + endAngle) / 2 * Math.PI) / 180
    const centerX = cx + ((outerRadius + innerRadius) / 2) * Math.cos(midAngle)
    const centerY = cy + ((outerRadius + innerRadius) / 2) * Math.sin(midAngle)
    
    return { path, color: item.color, name: item.name, value: item.value, amount: item.amount, centerX, centerY }
  })
})

const handleMouseEnter = (index, event) => {
  hoveredIndex.value = index
  updateTooltipPosition(event)
}

const handleMouseMove = (event) => {
  if (hoveredIndex.value !== null) updateTooltipPosition(event)
}

const handleMouseLeave = () => { hoveredIndex.value = null }

const updateTooltipPosition = (event) => {
  const rect = event.currentTarget.closest('.osc-chart-container').getBoundingClientRect()
  tooltipPosition.value = { x: event.clientX - rect.left, y: event.clientY - rect.top - 10 }
}

const getSegmentTransform = (segment, index) => {
  if (hoveredIndex.value !== index) return ''
  const offsetX = (segment.centerX - cx) * 0.08
  const offsetY = (segment.centerY - cy) * 0.08
  return `translate(${offsetX}, ${offsetY})`
}
</script>

<template>
  <div class="osc-chart-container" @mousemove="handleMouseMove">
    <div v-if="data.length === 0" class="osc-empty-chart">
      <svg :width="size" :height="size" :viewBox="`0 0 ${size} ${size}`">
        <circle :cx="cx" :cy="cy" :r="(outerRadius + innerRadius) / 2" fill="none" stroke="rgba(255,255,255,0.1)" :stroke-width="outerRadius - innerRadius" />
      </svg>
      <div class="osc-empty-text">Распределите<br>капитал</div>
    </div>

    <svg v-else :width="size" :height="size" :viewBox="`0 0 ${size} ${size}`" class="osc-pie-chart">
      <g v-for="(segment, index) in segments" :key="index" class="osc-segment-group" :style="{ transform: getSegmentTransform(segment, index), transformOrigin: `${cx}px ${cy}px` }" @mouseenter="handleMouseEnter(index, $event)" @mouseleave="handleMouseLeave">
        <path :d="segment.path" :fill="segment.color" class="osc-segment" :class="{ hovered: hoveredIndex === index, dimmed: hoveredIndex !== null && hoveredIndex !== index }" />
      </g>
      <circle :cx="cx" :cy="cy" :r="innerRadius - 1" fill="var(--vp-c-bg, #1a1a1a)" />
    </svg>

    <Transition name="osc-tooltip">
      <div v-if="hoveredIndex !== null && segments[hoveredIndex]" class="osc-chart-tooltip" :style="{ left: tooltipPosition.x + 'px', top: tooltipPosition.y + 'px' }">
        <div class="osc-tooltip-name">{{ segments[hoveredIndex].name }}</div>
        <div class="osc-tooltip-value" :style="{ color: segments[hoveredIndex].color }">{{ segments[hoveredIndex].value }}%</div>
        <div class="osc-tooltip-amount">{{ formatCurrency(segments[hoveredIndex].amount) }}</div>
      </div>
    </Transition>

    <div class="osc-chart-legend">
      <div v-for="(item, index) in data" :key="item.name" class="osc-legend-item" :class="{ hovered: hoveredIndex === index, dimmed: hoveredIndex !== null && hoveredIndex !== index }" @mouseenter="hoveredIndex = index" @mouseleave="hoveredIndex = null">
        <span class="osc-legend-dot" :style="{ background: item.color }"></span>
        <span class="osc-legend-name">{{ item.name }}</span>
        <span class="osc-legend-percent">{{ item.value }}%</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.osc-chart-container { position: relative; display: flex; flex-direction: column; align-items: center; min-height: 200px; }
.osc-empty-chart { position: relative; display: flex; align-items: center; justify-content: center; }
.osc-empty-text { position: absolute; text-align: center; font-size: 12px; color: #777; line-height: 1.4; }
.osc-pie-chart { cursor: pointer; }
.osc-segment-group { transition: transform 0.2s ease; }
.osc-segment { transition: opacity 0.2s ease, filter 0.2s ease; cursor: pointer; }
.osc-segment.hovered { filter: brightness(1.2); }
.osc-segment.dimmed { opacity: 0.4; }

.osc-chart-tooltip {
  position: absolute;
  pointer-events: none;
  background: #1a1a1a;
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 8px;
  padding: 12px;
  transform: translate(-50%, -100%);
  z-index: 100;
  min-width: 120px;
  text-align: center;
}
.osc-tooltip-name { font-size: 12px; color: #aaa; margin-bottom: 4px; }
.osc-tooltip-value { font-size: 20px; font-weight: 600; }
.osc-tooltip-amount { font-size: 12px; color: #888; margin-top: 4px; }

.osc-tooltip-enter-active, .osc-tooltip-leave-active { transition: opacity 0.15s ease, transform 0.15s ease; }
.osc-tooltip-enter-from, .osc-tooltip-leave-to { opacity: 0; transform: translate(-50%, -90%); }

.osc-chart-legend { margin-top: 16px; width: 100%; }
.osc-legend-item { display: flex; align-items: center; gap: 8px; padding: 6px 8px; border-radius: 6px; cursor: pointer; transition: all 0.2s ease; }
.osc-legend-item:hover { background: rgba(255,255,255,0.05); }
.osc-legend-item.hovered { background: rgba(255,255,255,0.08); }
.osc-legend-item.dimmed { opacity: 0.4; }
.osc-legend-dot { width: 10px; height: 10px; border-radius: 3px; flex-shrink: 0; }
.osc-legend-name { flex: 1; font-size: 11px; color: #aaa; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.osc-legend-percent { font-size: 12px; font-weight: 600; color: #fff; min-width: 32px; text-align: right; }
.osc-legend-item.hovered .osc-legend-name { color: #fff; }
</style>
