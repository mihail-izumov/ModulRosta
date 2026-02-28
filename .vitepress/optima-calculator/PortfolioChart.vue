<script setup>
import { ref, computed } from 'vue'
import { formatCurrency } from './utils.js'

const props = defineProps({
  data: { type: Array, required: true },
  size: { type: Number, default: 200 }
})

const hoveredIndex = ref(null)
const tooltipPosition = ref({ x: 0, y: 0 })

const cx = computed(() => props.size / 2)
const cy = computed(() => props.size / 2)
const radius = computed(() => props.size / 2 - 10)

const total = computed(() => props.data.reduce((sum, item) => sum + item.value, 0))

const segments = computed(() => {
  if (props.data.length === 0) return []
  
  // Один актив на 100%
  if (props.data.length === 1 && props.data[0].value === 100) {
    return [{
      ...props.data[0],
      startAngle: 0,
      endAngle: 359.99,
      path: describeArc(cx.value, cy.value, radius.value, 0, 359.99),
      isFull: true
    }]
  }
  
  let currentAngle = -90
  return props.data.map(item => {
    const angle = (item.value / total.value) * 360
    const startAngle = currentAngle
    const endAngle = currentAngle + angle
    currentAngle = endAngle
    
    return {
      ...item,
      startAngle,
      endAngle,
      path: describeArc(cx.value, cy.value, radius.value, startAngle, endAngle - 0.5),
      isFull: false
    }
  })
})

function polarToCartesian(centerX, centerY, r, angleDeg) {
  const angleRad = (angleDeg * Math.PI) / 180
  return {
    x: centerX + r * Math.cos(angleRad),
    y: centerY + r * Math.sin(angleRad)
  }
}

function describeArc(centerX, centerY, r, startAngle, endAngle) {
  const start = polarToCartesian(centerX, centerY, r, endAngle)
  const end = polarToCartesian(centerX, centerY, r, startAngle)
  const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`
}

const handleMouseEnter = (index, event) => {
  hoveredIndex.value = index
  updateTooltipPosition(event)
}

const handleMouseMove = (event) => {
  if (hoveredIndex.value !== null) updateTooltipPosition(event)
}

const handleMouseLeave = () => { hoveredIndex.value = null }

const updateTooltipPosition = (event) => {
  const rect = event.target.closest('.osc-chart-wrapper').getBoundingClientRect()
  tooltipPosition.value = {
    x: event.clientX - rect.left + 10,
    y: event.clientY - rect.top - 30
  }
}

const getSegmentTransform = (segment, index) => {
  if (hoveredIndex.value !== index || segment.isFull) return ''
  const midAngle = (segment.startAngle + segment.endAngle) / 2
  const rad = (midAngle * Math.PI) / 180
  const offset = 6
  return `translate(${Math.cos(rad) * offset}px, ${Math.sin(rad) * offset}px)`
}
</script>

<template>
  <div class="osc-chart-wrapper">
    <svg :width="size" :height="size" class="osc-donut-chart">
      <!-- Empty state -->
      <circle 
        v-if="data.length === 0"
        :cx="cx" 
        :cy="cy" 
        :r="radius"
        fill="none"
        stroke="rgba(255,255,255,0.1)"
        stroke-width="20"
      />
      
      <!-- Segments with hover -->
      <g v-for="(segment, index) in segments" :key="index" class="osc-segment-group" :style="{ transform: getSegmentTransform(segment, index), transformOrigin: `${cx}px ${cy}px` }" @mouseenter="handleMouseEnter(index, $event)" @mousemove="handleMouseMove" @mouseleave="handleMouseLeave">
        <path :d="segment.path" fill="none" :stroke="segment.color" stroke-width="20" stroke-linecap="round" class="osc-segment" :class="{ hovered: hoveredIndex === index, dimmed: hoveredIndex !== null && hoveredIndex !== index, full: segment.isFull }" />
      </g>
    </svg>
    
    <!-- Tooltip -->
    <div v-if="hoveredIndex !== null && segments[hoveredIndex]" class="osc-chart-tooltip" :style="{ left: tooltipPosition.x + 'px', top: tooltipPosition.y + 'px' }">
      <div class="osc-tooltip-name">{{ segments[hoveredIndex].name }}</div>
      <div class="osc-tooltip-value" :style="{ color: segments[hoveredIndex].color }">{{ segments[hoveredIndex].value }}%</div>
      <div class="osc-tooltip-amount">{{ formatCurrency(segments[hoveredIndex].amount) }}</div>
    </div>
    
    <!-- Legend -->
    <div class="osc-chart-legend">
      <div v-for="(item, index) in data" :key="item.name" class="osc-legend-item" :class="{ hovered: hoveredIndex === index, dimmed: hoveredIndex !== null && hoveredIndex !== index }" @mouseenter="hoveredIndex = index" @mouseleave="hoveredIndex = null">
        <span class="osc-legend-dot" :style="{ background: item.color }"></span>
        <span class="osc-legend-name">{{ item.name }}</span>
        <span class="osc-legend-value">{{ item.value }}%</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.osc-chart-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.osc-donut-chart {
  overflow: visible;
}

.osc-segment-group {
  transition: transform 0.2s ease;
}

.osc-segment {
  transition: opacity 0.2s, filter 0.2s;
  cursor: pointer;
}

.osc-segment.dimmed { opacity: 0.4; }
.osc-segment.hovered { filter: brightness(1.15); }

.osc-chart-tooltip {
  position: absolute;
  background: rgba(30,30,30,0.95);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 8px;
  padding: 10px 14px;
  pointer-events: none;
  z-index: 100;
  white-space: nowrap;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
}

.osc-tooltip-name {
  font-size: 12px;
  color: #aaa;
  margin-bottom: 4px;
}

.osc-tooltip-value {
  font-size: 20px;
  font-weight: 700;
}

.osc-tooltip-amount {
  font-size: 12px;
  color: #888;
  margin-top: 2px;
}

.osc-chart-legend {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}

.osc-legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  cursor: pointer;
  transition: opacity 0.2s;
  padding: 4px 8px;
  border-radius: 6px;
}

.osc-legend-item:hover { background: rgba(255,255,255,0.05); }
.osc-legend-item.dimmed { opacity: 0.4; }

.osc-legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.osc-legend-name {
  flex: 1;
  color: #aaa;
}

.osc-legend-value {
  font-weight: 600;
  color: #fff;
}
</style>
