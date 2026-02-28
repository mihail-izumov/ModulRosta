<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  data: { type: Array, default: () => [] }
})

const hoveredIndex = ref(null)

const gradientStyle = computed(() => {
  if (props.data.length === 0) return { background: '#1a1a1a' }
  
  let gradient = ''
  let currentAngle = 0
  
  props.data.forEach((item, index) => {
    const angle = (item.value / 100) * 360
    const color = hoveredIndex.value === index ? lightenColor(item.color, 20) : item.color
    gradient += `${color} ${currentAngle}deg ${currentAngle + angle}deg`
    if (index < props.data.length - 1) gradient += ', '
    currentAngle += angle
  })
  
  return { background: `conic-gradient(${gradient})` }
})

// Осветление цвета для hover
const lightenColor = (color, percent) => {
  const num = parseInt(color.replace('#', ''), 16)
  const amt = Math.round(2.55 * percent)
  const R = Math.min(255, (num >> 16) + amt)
  const G = Math.min(255, ((num >> 8) & 0x00FF) + amt)
  const B = Math.min(255, (num & 0x0000FF) + amt)
  return `#${(0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1)}`
}
</script>

<template>
  <div class="chart-container">
    <div class="pie-chart" :style="gradientStyle">
      <div class="pie-hole">
        <div v-if="hoveredIndex !== null && data[hoveredIndex]" class="hover-info">
          <div class="hover-value">{{ data[hoveredIndex].value }}%</div>
          <div class="hover-name">{{ data[hoveredIndex].name }}</div>
        </div>
      </div>
    </div>
    
    <!-- Legend with hover interaction -->
    <div class="chart-legend">
      <div 
        v-for="(item, index) in data" 
        :key="item.name"
        class="legend-item"
        :class="{ active: hoveredIndex === index }"
        @mouseenter="hoveredIndex = index"
        @mouseleave="hoveredIndex = null"
      >
        <span class="legend-dot" :style="{ background: item.color }"></span>
        <span class="legend-name">{{ item.name }}</span>
        <span class="legend-value">{{ item.value }}%</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.chart-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
}

.pie-chart {
  width: 180px;
  height: 180px;
  border-radius: 50%;
  position: relative;
  transition: transform 0.3s ease;
}

.pie-hole {
  position: absolute;
  width: 100px;
  height: 100px;
  background: #0a0a0a;
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.hover-info {
  text-align: center;
  animation: fadeIn 0.15s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
}

.hover-value {
  font-size: 24px;
  font-weight: 600;
  color: #00D9C0;
}

.hover-name {
  font-size: 10px;
  color: #888;
  max-width: 80px;
  text-align: center;
}

.chart-legend {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.legend-item:hover,
.legend-item.active {
  background: rgba(255, 255, 255, 0.05);
}

.legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 3px;
  flex-shrink: 0;
}

.legend-name {
  flex: 1;
  font-size: 12px;
  color: #888;
}

.legend-item.active .legend-name {
  color: #fff;
}

.legend-value {
  font-size: 12px;
  font-weight: 600;
  color: #fff;
}
</style>
