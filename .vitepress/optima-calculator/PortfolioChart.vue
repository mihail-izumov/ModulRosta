<script setup>
import { computed } from 'vue'

const props = defineProps({
  data: { type: Array, required: true },
  size: { type: Number, default: 200 }
})

const total = computed(() => props.data.reduce((sum, item) => sum + item.value, 0))

const segments = computed(() => {
  if (props.data.length === 0) return []
  
  // Если один актив на 100% — особый случай
  if (props.data.length === 1 && props.data[0].value === 100) {
    return [{
      ...props.data[0],
      startAngle: 0,
      endAngle: 360,
      path: describeArc(props.size / 2, props.size / 2, props.size / 2 - 10, 0, 359.99)
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
      path: describeArc(props.size / 2, props.size / 2, props.size / 2 - 10, startAngle, endAngle - 0.5)
    }
  })
})

const centerText = computed(() => {
  if (props.data.length === 1) {
    return props.data[0].name
  }
  return null
})

const centerColor = computed(() => {
  if (props.data.length === 1) {
    return props.data[0].color
  }
  return '#00D9C0'
})

function polarToCartesian(cx, cy, r, angleDeg) {
  const angleRad = (angleDeg * Math.PI) / 180
  return {
    x: cx + r * Math.cos(angleRad),
    y: cy + r * Math.sin(angleRad)
  }
}

function describeArc(cx, cy, r, startAngle, endAngle) {
  const start = polarToCartesian(cx, cy, r, endAngle)
  const end = polarToCartesian(cx, cy, r, startAngle)
  const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`
}
</script>

<template>
  <div class="osc-chart-container">
    <svg :width="size" :height="size" class="osc-donut-chart">
      <!-- Empty state -->
      <circle 
        v-if="data.length === 0"
        :cx="size / 2" 
        :cy="size / 2" 
        :r="size / 2 - 10"
        fill="none"
        stroke="rgba(255,255,255,0.1)"
        stroke-width="20"
      />
      
      <!-- Segments -->
      <path
        v-for="(segment, i) in segments"
        :key="i"
        :d="segment.path"
        fill="none"
        :stroke="segment.color"
        stroke-width="20"
        stroke-linecap="round"
        class="osc-chart-segment"
      />
      
      <!-- Center text for single asset -->
      <text 
        v-if="centerText"
        :x="size / 2" 
        :y="size / 2"
        text-anchor="middle"
        dominant-baseline="middle"
        :fill="centerColor"
        font-size="12"
        font-weight="600"
        class="osc-chart-center-text"
      >
        {{ centerText }}
      </text>
    </svg>
    
    <!-- Legend -->
    <div class="osc-chart-legend">
      <div v-for="item in data" :key="item.name" class="osc-legend-item">
        <span class="osc-legend-dot" :style="{ background: item.color }"></span>
        <span class="osc-legend-name">{{ item.name }}</span>
        <span class="osc-legend-value">{{ item.value }}%</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.osc-chart-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.osc-donut-chart {
  transform: rotate(0deg);
}

.osc-chart-segment {
  transition: opacity 0.2s;
  cursor: pointer;
}

.osc-chart-segment:hover {
  opacity: 0.8;
}

.osc-chart-center-text {
  font-family: inherit;
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
}

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
