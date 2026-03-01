<script setup>
import { ref, computed } from 'vue'
import { formatCurrency } from './utils.js'

const props = defineProps({
  data: { type: Array, required: true },
  size: { type: Number, default: 220 }
})

const emit = defineEmits(['select'])

const selectedIndex = ref(null)
const hoveredIndex = ref(null)

const activeIndex = computed(() => 
  hoveredIndex.value !== null ? hoveredIndex.value : selectedIndex.value
)

const selectedItem = computed(() => 
  activeIndex.value !== null ? props.data[activeIndex.value] : null
)

const handleCardClick = (index) => {
  selectedIndex.value = selectedIndex.value === index ? null : index
  emit('select', selectedIndex.value !== null ? props.data[selectedIndex.value] : null)
}

const handleMouseEnter = (index) => {
  hoveredIndex.value = index
}

const handleMouseLeave = () => {
  hoveredIndex.value = null
}

const isOptima = (item) => item.name === 'Optima Space'
</script>

<template>
  <div class="osc-cards-wrapper">
    <!-- Cards Grid -->
    <div class="osc-cards-grid" v-if="data.length > 0">
      <div
        v-for="(item, index) in data"
        :key="item.name"
        class="osc-asset-card"
        :class="{ 
          selected: activeIndex === index,
          optima: isOptima(item)
        }"
        :style="{
          '--card-color': item.color,
          '--card-bg': activeIndex === index ? item.color + '25' : 'rgba(255,255,255,0.03)',
          '--card-border': activeIndex === index ? item.color : isOptima(item) ? item.color + '40' : 'rgba(255,255,255,0.08)'
        }"
        @click="handleCardClick(index)"
        @mouseenter="handleMouseEnter(index)"
        @mouseleave="handleMouseLeave"
      >
        <!-- Progress bar -->
        <div class="osc-card-progress">
          <div 
            class="osc-card-progress-fill"
            :style="{ width: item.value + '%', background: item.color }"
          />
        </div>
        
        <!-- Percent -->
        <div class="osc-card-percent" :style="{ color: activeIndex === index ? item.color : '#fff' }">
          {{ item.value }}%
        </div>
        
        <!-- Name -->
        <div class="osc-card-name">{{ item.name }}</div>
        
        <!-- Amount -->
        <div class="osc-card-amount" :style="{ color: activeIndex === index ? item.color : '#555' }">
          {{ formatCurrency(item.amount) }}
        </div>
      </div>
    </div>
    
    <!-- Empty state -->
    <div v-else class="osc-cards-empty">
      <span>Распределите капитал между активами</span>
    </div>
    
    <!-- Info panel -->
    <div 
      class="osc-cards-info"
      :style="{
        background: selectedItem 
          ? `linear-gradient(135deg, ${selectedItem.color}15 0%, ${selectedItem.color}05 100%)`
          : 'rgba(255,255,255,0.03)',
        borderColor: selectedItem ? selectedItem.color + '40' : 'rgba(255,255,255,0.08)'
      }"
    >
      <template v-if="selectedItem">
        <div class="osc-cards-info-name">{{ selectedItem.name }}</div>
        <div class="osc-cards-info-amount" :style="{ color: selectedItem.color }">
          {{ formatCurrency(selectedItem.amount) }}
        </div>
      </template>
      <template v-else>
        <div class="osc-cards-info-hint">
          Выберите актив для просмотра деталей
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.osc-cards-wrapper {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
}

.osc-cards-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.osc-asset-card {
  padding: 16px;
  border-radius: 14px;
  cursor: pointer;
  background: var(--card-bg);
  border: 2px solid var(--card-border);
  transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.osc-asset-card:hover {
  transform: translateY(-2px);
}

.osc-asset-card.selected {
  transform: translateY(-4px) scale(1.02);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}

.osc-card-progress {
  height: 6px;
  border-radius: 3px;
  background: rgba(255,255,255,0.1);
  margin-bottom: 12px;
  overflow: hidden;
}

.osc-card-progress-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.4s ease;
}

.osc-card-percent {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 4px;
  font-family: 'SF Mono', Monaco, monospace;
  transition: color 0.2s;
}

.osc-card-name {
  font-size: 12px;
  color: #888;
  margin-bottom: 8px;
  font-weight: 400;
  transition: color 0.2s;
}

.osc-asset-card.selected .osc-card-name {
  color: #fff;
  font-weight: 500;
}

.osc-card-amount {
  font-size: 13px;
  font-family: 'SF Mono', Monaco, monospace;
  transition: color 0.2s;
}

.osc-cards-empty {
  padding: 40px;
  text-align: center;
  color: #555;
  font-size: 14px;
}

.osc-cards-info {
  padding: 16px 24px;
  border-radius: 12px;
  border: 1px solid;
  transition: all 0.3s ease;
  text-align: center;
  min-height: 70px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 6px;
}

.osc-cards-info-name {
  font-size: 13px;
  color: #888;
}

.osc-cards-info-amount {
  font-size: 24px;
  font-weight: 700;
  font-family: 'SF Mono', Monaco, monospace;
}

.osc-cards-info-hint {
  font-size: 13px;
  color: #555;
}

/* Responsive */
@media (max-width: 500px) {
  .osc-cards-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
