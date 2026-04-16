<script setup>
import { ref, watch, onUnmounted } from 'vue'
import { C, IMG } from '../woodled-data.js'

const props = defineProps({
  active: { type: Boolean, required: true }
})
const emit = defineEmits(['start'])

const p = ref(-1)
let timers = []

function clearTimers() {
  timers.forEach(clearTimeout)
  timers = []
}

watch(() => props.active, (active) => {
  clearTimers()
  if (!active) { p.value = -1; return }
  p.value = -1
  const schedule = [[300, 0], [900, 1], [2400, 2]]
  schedule.forEach(([ms, val]) => {
    timers.push(setTimeout(() => { p.value = val }, ms))
  })
}, { immediate: true })

onUnmounted(clearTimers)

const C_REF = C
</script>

<template>
  <div class="ci ch-rt">
    <div class="ctl">
      <span :class="['cs', { v: p >= 0 }]">Глава четвёртая</span>
      <span :class="['cn', { v: p >= 0 }]">Дом с WOODLED Rotor</span>
    </div>

    <div class="rt-stage">
      <div :class="['rt-interior', { v: p >= 1 }]">
        <img :src="IMG.interior" alt="Rotor в интерьере" class="rt-int-img">
        <div class="rt-int-fade" />
      </div>
    </div>

    <div :class="['txt', { v: p >= 2 }]">
      <div class="txth">Свет дерева</div>
      <div class="txtp">Мягкое тепло дуба и ореха оживляет пространство дома.</div>
    </div>

    <div v-if="p >= 2" class="d5cta">
      <button
        class="d5btn"
        :style="{ background: '#fff', color: C_REF.bg, boxShadow: '0 4px 24px rgba(255,255,255,.15)' }"
        @click="emit('start')"
      >Оживить Мой Дом</button>
    </div>
  </div>
</template>
