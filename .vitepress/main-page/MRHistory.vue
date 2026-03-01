<template>
  <section class="mr-launches-section">
    <div class="mr-launches-container">
      <div class="mr-launches-header">
        <div class="mr-section-label">Launch History</div>
        <h2 class="mr-section-title">Журнал запусков</h2>
      </div>

      <!-- Filters -->
      <div class="mr-status-filters">
        <button 
          v-for="filter in filters" 
          :key="filter.value"
          :class="['mr-filter-btn', { active: activeFilter === filter.value }]"
          @click="activeFilter = filter.value"
        >
          <span v-if="filter.dot" :class="['mr-dot', filter.dot]"></span>
          {{ filter.label }}
          <span class="mr-count-badge">{{ getCount(filter.value) }}</span>
        </button>
      </div>

      <!-- Projects Grid -->
      <div class="mr-launch-grid">
        <div 
          v-for="project in filteredProjects" 
          :key="project.id"
          :class="['mr-launch-card', `mr-status-${project.status}`]"
        >
          <div class="mr-launch-card-header">
            <span class="mr-launch-status-badge">
              <span :class="['mr-status-dot', project.status]"></span>
              {{ getStatusLabel(project.status) }}
            </span>
            <span class="mr-launch-date">{{ project.date }}</span>
          </div>
          
          <h3 class="mr-launch-name">{{ project.name }}</h3>
          <p class="mr-launch-description">{{ project.description }}</p>
          
          <div class="mr-launch-tags">
            <span v-for="tag in project.tags" :key="tag" class="mr-launch-tag">{{ tag }}</span>
          </div>
          
          <a v-if="project.link" :href="project.link" target="_blank" class="mr-launch-link">
            Открыть проект →
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Project {
  id: string
  name: string
  description: string
  status: 'orbit' | 'soon' | 'grounded'
  date: string
  tags: string[]
  link?: string
}

const activeFilter = ref('all')

const filters = [
  { value: 'all', label: 'Все модули' },
  { value: 'soon', label: 'Скоро', dot: 'blue' },
  { value: 'orbit', label: 'Запущен', dot: 'green' },
  { value: 'grounded', label: 'Отложен', dot: 'gray' }
]

const projects = ref<Project[]>([
  {
    id: 'boom',
    name: 'b00m.fun',
    description: 'Платформа для создания вирального контента с AI-генерацией',
    status: 'soon',
    date: '2026',
    tags: ['AI', 'SaaS', 'B2C']
  },
  {
    id: 'woodled',
    name: 'WOODLED',
    description: 'Премиальные светильники из натурального дерева',
    status: 'orbit',
    date: '2024',
    tags: ['E-commerce', 'Premium', 'B2C'],
    link: 'https://woodled.ru'
  },
  {
    id: 'smstretching',
    name: 'SMSTRETCHING',
    description: 'Сеть студий растяжки. Полный ребрендинг и цифровая система',
    status: 'orbit',
    date: '2024',
    tags: ['Fitness', 'Franchise', 'B2C'],
    link: 'https://smstretching.ru'
  },
  {
    id: 'superland',
    name: 'СУПЕРЛЕНД',
    description: 'Сеть детских развлекательных центров',
    status: 'orbit',
    date: '2023',
    tags: ['Entertainment', 'Franchise', 'B2C']
  },
  {
    id: 'milimon',
    name: 'Milimon',
    description: 'Бренд детской одежды с уникальным позиционированием',
    status: 'orbit',
    date: '2023',
    tags: ['Fashion', 'Kids', 'B2C']
  },
  {
    id: 'cffx',
    name: 'Сигнал',
    description: 'Инструмент анализа кофеен для инвесторов и операторов',
    status: 'orbit',
    date: '2025',
    tags: ['Analytics', 'HoReCa', 'B2B'],
    link: 'https://cffx.ru'
  }
])

const filteredProjects = computed(() => {
  if (activeFilter.value === 'all') return projects.value
  return projects.value.filter(p => p.status === activeFilter.value)
})

function getCount(filter: string) {
  if (filter === 'all') return projects.value.length
  return projects.value.filter(p => p.status === filter).length
}

function getStatusLabel(status: string) {
  const labels: Record<string, string> = {
    orbit: 'Запущен',
    soon: 'Скоро',
    grounded: 'Отложен'
  }
  return labels[status] || status
}
</script>

<style scoped>
.mr-launches-section {
  padding: 80px 24px;
}

.mr-launches-container {
  max-width: 1200px;
  margin: 0 auto;
}

.mr-launches-header {
  margin-bottom: 32px;
}

.mr-section-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  color: var(--vp-c-brand-1);
  text-transform: uppercase;
  letter-spacing: 3px;
  margin-bottom: 16px;
}

.mr-section-title {
  font-size: clamp(28px, 5vw, 42px);
  font-weight: 300;
  color: var(--vp-c-text-1);
}

.mr-status-filters {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 32px;
}

.mr-filter-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  color: var(--vp-c-text-2);
  font-size: 13px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.mr-filter-btn:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-text-1);
}

.mr-filter-btn.active {
  background: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
  color: #fff;
}

.mr-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.mr-dot.blue { background: #58a6ff; }
.mr-dot.green { background: var(--vp-c-brand-1); }
.mr-dot.gray { background: #7d8590; }

.mr-count-badge {
  background: rgba(255, 255, 255, 0.1);
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 11px;
}

.mr-filter-btn.active .mr-count-badge {
  background: rgba(0, 0, 0, 0.2);
}

.mr-launch-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}

.mr-launch-card {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 24px;
  transition: all 0.3s ease;
}

.mr-launch-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

.mr-launch-card.mr-status-orbit {
  border-top: 3px solid var(--vp-c-brand-1);
}

.mr-launch-card.mr-status-soon {
  border-top: 3px solid #58a6ff;
}

.mr-launch-card.mr-status-grounded {
  border-top: 3px solid #7d8590;
}

.mr-launch-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.mr-launch-status-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--vp-c-text-3);
}

.mr-status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.mr-status-dot.orbit { background: var(--vp-c-brand-1); }
.mr-status-dot.soon { background: #58a6ff; }
.mr-status-dot.grounded { background: #7d8590; }

.mr-launch-date {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  color: var(--vp-c-text-3);
}

.mr-launch-name {
  font-size: 20px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin-bottom: 8px;
}

.mr-launch-description {
  font-size: 14px;
  color: var(--vp-c-text-2);
  line-height: 1.6;
  margin-bottom: 16px;
}

.mr-launch-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}

.mr-launch-tag {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  padding: 4px 10px;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  color: var(--vp-c-text-3);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.mr-launch-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: var(--vp-c-brand-1);
  text-decoration: none;
  transition: all 0.3s ease;
}

.mr-launch-link:hover {
  color: var(--vp-c-brand-2);
}
</style>
