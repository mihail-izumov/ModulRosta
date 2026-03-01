<script setup>
import { ref, computed } from 'vue'
import { formatCurrency } from './utils.js'

const props = defineProps({
  data: { type: Array, required: true },
  size: { type: Number, default: 220 }
})

const emit = defineEmits(['select'])

const selectedIndex = ref(null)

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

const handleSegmentClick = (index) => {
  if (selectedIndex.value === index) {
    selectedIndex.value = null
  } else {
    selectedIndex.value = index
  }
  emit('select', selectedIndex.value !== null ? segments.value[selectedIndex.value] : null)
}

const handleLegendClick = (index) => {
  handleSegmentClick(index)
}

// Selected item info
const selectedItem = computed(() => {
  if (selectedIndex.value !== null && segments.value[selectedIndex.value]) {
    return segments.value[selectedIndex.value]
  }
  return null
})

// Сортированные сегменты - выбранный последний (рендерится поверх)
const sortedSegments = computed(() => {
  if (selectedIndex.value === null) return segments.value.map((s, i) => ({ ...s, originalIndex: i }))
  
  return segments.value
    .map((s, i) => ({ ...s, originalIndex: i }))
    .sort((a, b) => {
      if (a.originalIndex === selectedIndex.value) return 1
      if (b.originalIndex === selectedIndex.value) return -1
      return 0
    })
})

const getSegmentScale = (index) => {
  return selectedIndex.value === index ? 1.05 : 1
}
</script>

<template>
  <div class="osc-chart-wrapper">
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
      <g v-for="segment in sortedSegments" :key="segment.originalIndex">
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
          :class="{ selected: selectedIndex === segment.originalIndex }"
          @click="handleSegmentClick(segment.originalIndex)"
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
          :class="{ selected: selectedIndex === segment.originalIndex }"
          :style="{
            transform: `scale(${getSegmentScale(segment.originalIndex)})`,
            transformOrigin: `${cx}px ${cy}px`
          }"
          @click="handleSegmentClick(segment.originalIndex)"
        />
      </g>
      
      <!-- Center display when selected - only percentage -->
      <g v-if="selectedItem">
        <text 
          :x="cx" 
          :y="cy + 8"
          text-anchor="middle"
          class="osc-center-value"
          :fill="selectedItem.color"
        >
          {{ selectedItem.value }}%
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
    
    <!-- Static Info Block below chart -->
    <div 
      class="osc-chart-info-block"
      :style="selectedItem ? { background: selectedItem.color + '15' } : {}"
    >
      <template v-if="selectedItem">
        <div class="osc-info-selected">
          <div class="osc-info-name">{{ selectedItem.name }}</div>
          <div class="osc-info-amount" :style="{ color: selectedItem.color }">{{ formatCurrency(selectedItem.amount) }}</div>
        </div>
      </template>
      <template v-else-if="data.length > 0">
        <div class="osc-info-hint">
          <span>Нажмите на сегмент или актив ниже</span>
        </div>
      </template>
      <template v-else>
        <div class="osc-info-hint">
          <span>Распределите капитал между активами</span>
        </div>
      </template>
    </div>
    
    <!-- Legend -->
    <div class="osc-chart-legend">
      <div 
        v-for="(item, index) in data" 
        :key="item.name" 
        class="osc-legend-item"
        :class="{ selected: selectedIndex === index }"
        @click="handleLegendClick(index)"
      >
        <span class="osc-legend-dot" :style="{ background: item.color }"></span>
        <span class="osc-legend-name">{{ item.name }}</span>
        <span class="osc-legend-value" :style="{ color: item.color }">{{ item.value }}%</span>
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

.osc-segment {
  transition: transform 0.25s ease, filter 0.2s ease;
  cursor: pointer;
  opacity: 1;
}

.osc-segment:hover {
  filter: brightness(1.15);
}

.osc-segment.selected {
  filter: brightness(1.2) drop-shadow(0 0 10px currentColor);
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

/* Static Info Block */
.osc-chart-info-block {
  width: 100%;
  min-height: 44px;
  padding: 10px 16px;
  background: rgba(255,255,255,0.03);
  border-radius: 10px;
  transition: background 0.2s;
}

.osc-info-selected {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  text-align: center;
}

.osc-info-name {
  font-size: 13px;
  font-weight: 500;
  color: #aaa;
}

.osc-info-amount {
  font-size: 18px;
  font-weight: 700;
  font-family: 'SF Mono', Monaco, monospace;
}

.osc-info-hint {
  font-size: 12px;
  color: #666;
  text-align: center;
  line-height: 1.4;
}
  justify-content: center;
}

.osc-info-hint-icon {
  font-size: 16px;
}

/* Legend */
.osc-chart-legend {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  padding: 0 4px;
}

.osc-legend-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  cursor: pointer;
  transition: background 0.2s;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid transparent;
}

.osc-legend-item:hover {
  background: rgba(255,255,255,0.05);
}

.osc-legend-item.selected {
  background: rgba(255,255,255,0.08);
  border-color: rgba(255,255,255,0.15);
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
  font-family: 'SF Mono', Monaco, monospace;
}
</style>
