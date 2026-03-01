<script setup>
import { ref, computed, watch } from 'vue'
import { formatCurrency } from './utils.js'

const props = defineProps({
  data: { type: Array, required: true },
  size: { type: Number, default: 220 }
})

const hoveredIndex = ref(null)
const tooltipPosition = ref({ x: 0, y: 0 })
const chartRef = ref(null)

const cx = computed(() => props.size / 2)
const cy = computed(() => props.size / 2)
const radius = computed(() => props.size / 2 - 20)
const strokeWidth = 32

const total = computed(() => props.data.reduce((sum, item) => sum + item.value, 0))

const segments = computed(() => {
  if (props.data.length === 0) return []
  
  // Single asset at 100%
  if (props.data.length === 1 && props.data[0].value >= 100) {
    return [{
      ...props.data[0],
      startAngle: -90,
      endAngle: 270,
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
      isFull: false
    }
  })
})

// Calculate arc path
const getArcPath = (startAngle, endAngle, r) => {
  const start = polarToCartesian(cx.value, cy.value, r, endAngle)
  const end = polarToCartesian(cx.value, cy.value, r, startAngle)
  const largeArc = endAngle - startAngle > 180 ? 1 : 0
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y}`
}

const polarToCartesian = (centerX, centerY, r, angleDeg) => {
  const rad = (angleDeg * Math.PI) / 180
  return {
    x: centerX + r * Math.cos(rad),
    y: centerY + r * Math.sin(rad)
  }
}

const handleMouseEnter = (index, event) => {
  hoveredIndex.value = index
  updateTooltipPosition(event)
}

const handleMouseMove = (event) => {
  if (hoveredIndex.value !== null) {
    updateTooltipPosition(event)
  }
}

const handleMouseLeave = () => {
  hoveredIndex.value = null
}

const updateTooltipPosition = (event) => {
  if (!chartRef.value) return
  const rect = chartRef.value.getBoundingClientRect()
  tooltipPosition.value = {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top - 60
  }
}

const getSegmentOffset = (segment, index) => {
  if (hoveredIndex.value !== index || segment.isFull) return { x: 0, y: 0 }
  const midAngle = (segment.startAngle + segment.endAngle) / 2
  const rad = (midAngle * Math.PI) / 180
  const offset = 8
  return {
    x: Math.cos(rad) * offset,
    y: Math.sin(rad) * offset
  }
}

// Center display
const centerDisplay = computed(() => {
  if (hoveredIndex.value !== null && segments.value[hoveredIndex.value]) {
    const seg = segments.value[hoveredIndex.value]
    return {
      show: true,
      name: seg.name,
      value: seg.value,
      amount: seg.amount,
      color: seg.color
    }
  }
  return { show: false }
})
</script>

<template>
  <div class="osc-chart-wrapper" ref="chartRef">
    <svg :width="size" :height="size" class="osc-donut-chart">
      <!-- Background circle -->
      <circle 
        :cx="cx" 
        :cy="cy" 
        :r="radius"
        fill="none"
        stroke="rgba(255,255,255,0.06)"
        :stroke-width="strokeWidth"
      />
      
      <!-- Segments -->
      <g v-for="(segment, index) in segments" :key="index">
        <!-- Full circle case -->
        <circle
          v-if="segment.isFull"
          :cx="cx"
          :cy="cy"
          :r="radius"
          fill="none"
          :stroke="segment.color"
          :stroke-width="strokeWidth"
          class="osc-segment"
          :class="{ hovered: hoveredIndex === index }"
          @mouseenter="handleMouseEnter(index, $event)"
          @mousemove="handleMouseMove"
          @mouseleave="handleMouseLeave"
        />
        <!-- Arc segment -->
        <path
          v-else
          :d="getArcPath(segment.startAngle, segment.endAngle - 0.5, radius)"
          fill="none"
          :stroke="segment.color"
          :stroke-width="strokeWidth"
          stroke-linecap="round"
          class="osc-segment"
          :class="{ 
            hovered: hoveredIndex === index, 
            dimmed: hoveredIndex !== null && hoveredIndex !== index 
          }"
          :style="{
            transform: `translate(${getSegmentOffset(segment, index).x}px, ${getSegmentOffset(segment, index).y}px)`,
            transformOrigin: `${cx}px ${cy}px`
          }"
          @mouseenter="handleMouseEnter(index, $event)"
          @mousemove="handleMouseMove"
          @mouseleave="handleMouseLeave"
        />
      </g>
      
      <!-- Center display on hover -->
      <g v-if="centerDisplay.show">
        <text 
          :x="cx" 
          :y="cy - 18"
          text-anchor="middle"
          class="osc-center-name"
        >
          {{ centerDisplay.name }}
        </text>
        <text 
          :x="cx" 
          :y="cy + 8"
          text-anchor="middle"
          class="osc-center-value"
          :fill="centerDisplay.color"
        >
          {{ centerDisplay.value }}%
        </text>
        <text 
          :x="cx" 
          :y="cy + 30"
          text-anchor="middle"
          class="osc-center-amount"
        >
          {{ formatCurrency(centerDisplay.amount) }}
        </text>
      </g>
      
      <!-- Empty state text -->
      <text 
        v-if="data.length === 0"
        :x="cx" 
        :y="cy"
        text-anchor="middle"
        dominant-baseline="middle"
        fill="#666"
        font-size="14"
      >
        Выберите активы
      </text>
    </svg>
    
    <!-- Floating Tooltip -->
    <Transition name="tooltip-fade">
      <div 
        v-if="hoveredIndex !== null && segments[hoveredIndex]" 
        class="osc-chart-tooltip"
        :style="{ 
          left: tooltipPosition.x + 'px', 
          top: tooltipPosition.y + 'px'
        }"
      >
        <div class="osc-tooltip-dot" :style="{ background: segments[hoveredIndex].color }"></div>
        <div class="osc-tooltip-content">
          <div class="osc-tooltip-name">{{ segments[hoveredIndex].name }}</div>
          <div class="osc-tooltip-value" :style="{ color: segments[hoveredIndex].color }">
            {{ segments[hoveredIndex].value }}%
          </div>
          <div class="osc-tooltip-amount">{{ formatCurrency(segments[hoveredIndex].amount) }}</div>
        </div>
      </div>
    </Transition>
    
    <!-- Legend -->
    <div class="osc-chart-legend">
      <div 
        v-for="(item, index) in data" 
        :key="item.name" 
        class="osc-legend-item"
        :class="{ 
          hovered: hoveredIndex === index, 
          dimmed: hoveredIndex !== null && hoveredIndex !== index 
        }"
        @mouseenter="hoveredIndex = index"
        @mouseleave="hoveredIndex = null"
      >
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
  gap: 20px;
}

.osc-donut-chart {
  overflow: visible;
}

.osc-segment {
  transition: transform 0.25s ease, opacity 0.2s ease, filter 0.2s ease;
  cursor: pointer;
}

.osc-segment.dimmed {
  opacity: 0.35;
}

.osc-segment.hovered {
  filter: brightness(1.2) drop-shadow(0 0 8px currentColor);
}

.osc-center-name {
  font-size: 12px;
  fill: #aaa;
  font-weight: 500;
}

.osc-center-value {
  font-size: 28px;
  font-weight: 700;
  font-family: 'SF Mono', Monaco, monospace;
}

.osc-center-amount {
  font-size: 11px;
  fill: #888;
}

.osc-chart-tooltip {
  position: absolute;
  display: flex;
  align-items: flex-start;
  gap: 10px;
  background: rgba(20, 20, 20, 0.96);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 10px;
  padding: 12px 16px;
  pointer-events: none;
  z-index: 100;
  box-shadow: 0 8px 24px rgba(0,0,0,0.4);
  transform: translateX(-50%);
  white-space: nowrap;
}

.osc-tooltip-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-top: 4px;
  flex-shrink: 0;
}

.osc-tooltip-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.osc-tooltip-name {
  font-size: 12px;
  color: #aaa;
}

.osc-tooltip-value {
  font-size: 22px;
  font-weight: 700;
  font-family: 'SF Mono', Monaco, monospace;
}

.osc-tooltip-amount {
  font-size: 12px;
  color: #777;
}

.tooltip-fade-enter-active,
.tooltip-fade-leave-active {
  transition: opacity 0.15s ease;
}

.tooltip-fade-enter-from,
.tooltip-fade-leave-to {
  opacity: 0;
}

.osc-chart-legend {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  padding: 0 8px;
}

.osc-legend-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  cursor: pointer;
  transition: opacity 0.2s, background 0.2s;
  padding: 8px 12px;
  border-radius: 8px;
  margin: 0 -12px;
}

.osc-legend-item:hover {
  background: rgba(255,255,255,0.05);
}

.osc-legend-item.dimmed {
  opacity: 0.4;
}

.osc-legend-item.hovered {
  background: rgba(255,255,255,0.08);
}

.osc-legend-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
}

.osc-legend-name {
  flex: 1;
  color: #ccc;
}

.osc-legend-value {
  font-weight: 600;
  color: #fff;
  font-family: 'SF Mono', Monaco, monospace;
}
</style>
