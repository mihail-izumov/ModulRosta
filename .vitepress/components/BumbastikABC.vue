<!-- BumbastikABC.vue -->
<template>
  <div class="bumbastik-container">
    <header class="page-header">
      <h1>🎮 Бумбастик: Все 134 Аппарата</h1>
      <p>ABC-анализ выручки и downtime (ноябрь 2025)</p>
    </header>

    <div class="info-box">
      <strong>💡 Подсказка:</strong> Кликните на заголовки столбцов для сортировки.<br />
      Используйте фильтры для поиска по сегментам, названию или статусу.
    </div>

    <div class="summary-grid">
      <div class="summary-card segment-a">
        <h3>📊 A: Критичное (до 80%)</h3>
        <p><strong>{{ summary.A.count }}</strong> машин ({{ summary.A.percentOfPark }}% парка)</p>
        <p>Выручка: <strong>{{ formatCurrency(summary.A.revenue) }}</strong> ({{ summary.A.revenueShare }}%)</p>
        <p>Потеря: <strong>{{ formatCurrency(summary.A.loss) }}</strong>/месяц</p>
      </div>

      <div class="summary-card segment-b">
        <h3>📊 B: Важное (80–94%)</h3>
        <p><strong>{{ summary.B.count }}</strong> машин ({{ summary.B.percentOfPark }}% парка)</p>
        <p>Выручка: <strong>{{ formatCurrency(summary.B.revenue) }}</strong> ({{ summary.B.revenueShare }}%)</p>
        <p>Потеря: <strong>{{ formatCurrency(summary.B.loss) }}</strong>/месяц</p>
      </div>

      <div class="summary-card segment-c">
        <h3>📊 C: Низкий приоритет</h3>
        <p><strong>{{ summary.C.count }}</strong> машин ({{ summary.C.percentOfPark }}% парка)</p>
        <p>Выручка: <strong>{{ formatCurrency(summary.C.revenue) }}</strong> ({{ summary.C.revenueShare }}%)</p>
        <p>Потеря: <strong>{{ formatCurrency(summary.C.loss) }}</strong>/месяц</p>
      </div>
    </div>

    <div class="controls-grid">
      <div class="control-group">
        <label for="search">🔍 Поиск по названию:</label>
        <input id="search" v-model="filters.search" placeholder="Big Bass Wheel..." />
      </div>

      <div class="control-group">
        <label for="segment">📊 Сегмент ABC:</label>
        <select id="segment" v-model="filters.segment">
          <option value="">Все сегменты</option>
          <option value="A">A (Критичное, 80% выручки)</option>
          <option value="B">B (Важное, 80-94%)</option>
          <option value="C">C (Низкий приоритет)</option>
        </select>
      </div>

      <div class="control-group">
        <label for="health">🏥 Статус здоровья:</label>
        <select id="health" v-model="filters.health">
          <option value="">Все статусы</option>
          <option value="✅">✅ Здоров</option>
          <option value="⚠️">⚠️ Внимание</option>
          <option value="🟠">🟠 Предупреждение</option>
          <option value="🔴">🔴 Критичный</option>
        </select>
      </div>

      <div class="control-group">
        <label for="downtime">📉 Downtime (дней):</label>
        <select id="downtime" v-model="filters.downtime">
          <option value="">Все</option>
          <option value="0">0 (Без downtime)</option>
          <option value="1-3">1-3 (Низкий)</option>
          <option value="4-7">4-7 (Средний)</option>
          <option value="8+">8+ (Критичный)</option>
        </select>
      </div>
    </div>

    <div class="table-wrapper">
      <table class="data-table">
        <thead>
          <tr>
            <th @click="sort(0)">№</th>
            <th @click="sort(1)">Аппарат</th>
            <th @click="sort(2)" style="width: 80px;">Сегмент</th>
            <th @click="sort(3)" class="number">Выручка ₽</th>
            <th @click="sort(4)" class="pct">Доля %</th>
            <th @click="sort(5)" class="pct">Cumsum %</th>
            <th @click="sort(6)" class="number">Раб. дн</th>
            <th @click="sort(7)" class="number">Downtime</th>
            <th @click="sort(8)" class="number">Средн. ₽/дн</th>
            <th @click="sort(9)" class="number">Потеря ₽</th>
            <th @click="sort(10)" class="pct">Потеря %</th>
            <th @click="sort(11)" style="width: 120px;">Здоровье</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in filteredAndSorted" :key="row.rank" :class="getSegmentClass(row.segment)">
            <td>{{ row.rank }}</td>
            <td><strong>{{ row.name }}</strong></td>
            <td><span :class="`badge ${row.segment.toLowerCase()}`">{{ row.segment }}</span></td>
            <td class="number">{{ formatCurrency(row.revenue) }}</td>
            <td class="pct">{{ row.share.toFixed(2) }}%</td>
            <td class="pct">{{ row.cumsum.toFixed(2) }}%</td>
            <td class="number">{{ row.work_days }}</td>
            <td class="number"><strong>{{ row.downtime }}</strong></td>
            <td class="number">₽{{ formatNumber(row.daily_avg) }}</td>
            <td class="number">{{ formatCurrency(row.loss) }}</td>
            <td class="pct">{{ row.loss_pct.toFixed(1) }}%</td>
            <td><span :class="getHealthClass(row.health)">{{ row.health }}</span></td>
          </tr>

          <tr v-if="filteredAndSorted.length === 0">
            <td colspan="12" class="no-results">Нет результатов, попробуйте изменить фильтры</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="stats-grid">
      <div class="stat-item">
        <div class="stat-label">Всего аппаратов</div>
        <div class="stat-value">{{ filteredAndSorted.length }}</div>
      </div>
      <div class="stat-item">
        <div class="stat-label">Итоговая выручка</div>
        <div class="stat-value">{{ formatCurrency(totalRevenue) }}</div>
      </div>
      <div class="stat-item">
        <div class="stat-label">Потери от downtime</div>
        <div class="stat-value">{{ formatCurrency(totalLoss) }}</div>
      </div>
      <div class="stat-item">
        <div class="stat-label">С критичным downtime</div>
        <div class="stat-value">{{ criticalDowntimeCount }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const rawData = [
  { rank: 1, name: "Big Bass Wheel Pro", segment: "A", revenue: 286627, share: 6.47, cumsum: 6.47, work_days: 30, downtime: 0, daily_avg: 9554, loss: 0, loss_pct: 0.0, health: "✅ HEALTHY" },
  { rank: 2, name: "Big Bass Wheel", segment: "A", revenue: 249737, share: 5.64, cumsum: 12.1, work_days: 30, downtime: 0, daily_avg: 8325, loss: 0, loss_pct: 0.0, health: "✅ HEALTHY" },
  // ... остальные данные (вставьте все 134 записи)
  // Для краткости оставлено только 2 записи — замените на полный массив
]

const filters = ref({
  search: '',
  segment: '',
  health: '',
  downtime: ''
})

const sortState = ref({
  column: 0,
  ascending: true
})

const columns = [
  'rank', 'name', 'segment', 'revenue', 'share', 'cumsum',
  'work_days', 'downtime', 'daily_avg', 'loss', 'loss_pct', 'health'
]

const formatCurrency = (value) => {
  if (value === 0) return '₽0'
  if (value >= 1_000_000) return (value / 1_000_000).toFixed(2) + 'M ₽'
  if (value >= 1_000) return (value / 1_000).toFixed(0) + 'k ₽'
  return '₽' + Math.round(value)
}

const formatNumber = (value) => {
  return new Intl.NumberFormat('ru-RU').format(Math.round(value))
}

const getHealthClass = (health) => {
  if (health.includes('✅')) return 'health-good'
  if (health.includes('⚠️')) return 'health-caution'
  if (health.includes('🟠')) return 'health-warning'
  if (health.includes('🔴')) return 'health-critical'
  return ''
}

const getSegmentClass = (segment) => `segment-${segment.toLowerCase()}`

const filtered = computed(() => {
  return rawData.filter(row => {
    if (filters.value.search && !row.name.toLowerCase().includes(filters.value.search.toLowerCase())) return false
    if (filters.value.segment && row.segment !== filters.value.segment) return false
    if (filters.value.health && !row.health.includes(filters.value.health)) return false

    if (filters.value.downtime) {
      const d = row.downtime
      if (filters.value.downtime === '0' && d !== 0) return false
      if (filters.value.downtime === '1-3' && (d < 1 || d > 3)) return false
      if (filters.value.downtime === '4-7' && (d < 4 || d > 7)) return false
      if (filters.value.downtime === '8+' && d < 8) return false
    }

    return true
  })
})

const filteredAndSorted = computed(() => {
  const data = [...filtered.value]

  data.sort((a, b) => {
    const col = columns[sortState.value.column]
    let va = a[col]
    let vb = b[col]

    if (typeof va === 'string') {
      va = va.toLowerCase()
      vb = vb.toLowerCase()
    }

    if (sortState.value.ascending) {
      return va > vb ? 1 : va < vb ? -1 : 0
    } else {
      return va < vb ? 1 : va > vb ? -1 : 0
    }
  })

  return data
})

const sort = (index) => {
  if (sortState.value.column === index) {
    sortState.value.ascending = !sortState.value.ascending
  } else {
    sortState.value.column = index
    sortState.value.ascending = true
  }
}

const totalRevenue = computed(() => filtered.value.reduce((sum, r) => sum + r.revenue, 0))
const totalLoss = computed(() => filtered.value.reduce((sum, r) => sum + r.loss, 0))
const criticalDowntimeCount = computed(() => filtered.value.filter(r => r.downtime >= 8).length)

const summary = computed(() => {
  const groups = { A: { count: 0, revenue: 0, loss: 0 }, B: { count: 0, revenue: 0, loss: 0 }, C: { count: 0, revenue: 0, loss: 0 } }
  const totalCount = rawData.length
  const totalRev = rawData.reduce((s, r) => s + r.revenue, 0)

  rawData.forEach(r => {
    groups[r.segment].count++
    groups[r.segment].revenue += r.revenue
    groups[r.segment].loss += r.loss
  })

  return {
    A: {
      ...groups.A,
      percentOfPark: ((groups.A.count / totalCount) * 100).toFixed(1),
      revenueShare: ((groups.A.revenue / totalRev) * 100).toFixed(1)
    },
    B: {
      ...groups.B,
      percentOfPark: ((groups.B.count / totalCount) * 100).toFixed(1),
      revenueShare: ((groups.B.revenue / totalRev) * 100).toFixed(1)
    },
    C: {
      ...groups.C,
      percentOfPark: ((groups.C.count / totalCount) * 100).toFixed(1),
      revenueShare: ((groups.C.revenue / totalRev) * 100).toFixed(1)
    }
  }
})
</script>

<style scoped>
/* -------------------------------------------------------------------------- */
/* Стили почти без изменений, только адаптированы под scoped + небольшие улучшения */
.bumbastik-container {
  max-width: 1400px;
  margin: 0 auto 2rem;
  background: white;
  border-radius: 10px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.25);
  padding: 2rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.page-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
  border-radius: 10px;
  text-align: center;
  margin-bottom: 2rem;
}

.page-header h1 {
  margin: 0 0 0.5rem;
  font-size: 2.6rem;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.25rem;
  margin-bottom: 2rem;
}

.summary-card {
  padding: 1.25rem;
  border-radius: 8px;
  border-left: 5px solid;
}

.summary-card.segment-a { background: #e8f5e9; border-left-color: #4caf50; }
.summary-card.segment-b { background: #fff3e0; border-left-color: #ff9800; }
.summary-card.segment-c { background: #ffebee; border-left-color: #f44336; }

.controls-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.25rem;
  margin-bottom: 2rem;
  background: #f8f9fa;
  padding: 1.25rem;
  border-radius: 8px;
}

.control-group label {
  font-weight: 600;
  margin-bottom: 0.5rem;
  display: block;
  color: #333;
}

.control-group input,
.control-group select {
  width: 100%;
  padding: 0.65rem;
  border: 2px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
}

.control-group input:focus,
.control-group select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102,126,234,0.15);
}

.table-wrapper {
  overflow-x: auto;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
  margin-bottom: 2rem;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.95em;
}

.data-table thead {
  background: #f5f5f5;
  position: sticky;
  top: 0;
  z-index: 10;
}

.data-table th {
  padding: 1rem 1.1rem;
  text-align: left;
  cursor: pointer;
  user-select: none;
}

.data-table th:hover {
  background: #eee;
}

.data-table td {
  padding: 0.9rem 1.1rem;
  border-bottom: 1px solid #f0f0f0;
}

.data-table tbody tr:hover {
  background: #fafafa;
}

tr.segment-a { border-left: 4px solid #4caf50; }
tr.segment-b { border-left: 4px solid #ff9800; }
tr.segment-c { border-left: 4px solid #f44336; }

.number { text-align: right; font-variant-numeric: tabular-nums; }
.pct    { text-align: right; color: #555; }

.health-good     { color: #4caf50; font-weight: 600; }
.health-caution  { color: #ff9800; font-weight: 600; }
.health-warning  { color: #f57c00; font-weight: 600; }
.health-critical { color: #f44336; font-weight: 600; }

.badge {
  padding: 0.35em 0.65em;
  border-radius: 4px;
  font-size: 0.82em;
  font-weight: 600;
}

.badge.a { background: #c8e6c9; color: #2e7d32; }
.badge.b { background: #ffe0b2; color: #e65100; }
.badge.c { background: #ffcdd2; color: #b71c1c; }

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  background: #f8f9fa;
  padding: 1.25rem;
  border-radius: 8px;
}

.stat-item {
  background: white;
  padding: 1rem;
  border-radius: 6px;
  border-left: 4px solid #667eea;
}

.stat-label {
  font-size: 0.9em;
  color: #666;
  margin-bottom: 0.3rem;
}

.stat-value {
  font-size: 1.7em;
  font-weight: 700;
}

.no-results {
  text-align: center;
  padding: 3rem;
  color: #aaa;
  font-size: 1.1em;
}

.info-box {
  background: #e3f2fd;
  border-left: 5px solid #2196f3;
  padding: 1rem 1.2rem;
  border-radius: 6px;
  margin-bottom: 1.5rem;
  color: #1565c0;
}
</style>
