<script setup lang="ts">
/**
 * ColorPickerModal.vue — Hue-style цвет фона карточки комнаты.
 *
 * Набор пресетов + сброс. Цвет сохраняется в room.cardColor.
 */

import { T } from '../theme/tokens'
import Modal from './ui/Modal.vue'

interface Props {
  current: string | undefined
  roomName: string
}
const props = defineProps<Props>()
const emit = defineEmits<{
  pick: [color: string | undefined]
  close: []
}>()

const PRESETS: { color: string; name: string }[] = [
  { color: '#D4956B', name: 'Закат' },
  { color: '#C9A84C', name: 'Янтарь' },
  { color: '#C4A46C', name: 'Песок' },
  { color: '#A89878', name: 'Лён' },
  { color: '#8BAA6B', name: 'Поляна' },
  { color: '#7BA05B', name: 'Лес' },
  { color: '#5B8BA0', name: 'Озеро' },
  { color: '#6B8DC4', name: 'Небо' },
  { color: '#8B6BA0', name: 'Лаванда' },
  { color: '#B85C6C', name: 'Рубин' },
  { color: '#B85C4C', name: 'Глина' },
  { color: '#8B6242', name: 'Орех' },
]

function isSelected(c: string): boolean {
  return props.current === c
}
</script>

<template>
  <Modal @close="emit('close')">
    <div :style="{ padding: '20px' }">
      <div
        :style="{
          fontSize: '14px',
          fontWeight: 700,
          color: T.text,
          marginBottom: '4px',
        }"
      >
        Цвет комнаты
      </div>
      <div :style="{ fontSize: '11px', color: T.textSec, marginBottom: '16px' }">
        {{ props.roomName }}
      </div>

      <!-- Превью -->
      <div
        :style="{
          height: '48px',
          borderRadius: '10px',
          marginBottom: '16px',
          background: props.current
            ? `linear-gradient(135deg, ${props.current}44, ${props.current}18)`
            : T.card,
          border: `1px solid ${props.current ? props.current + '55' : T.border}`,
          transition: 'all .3s',
        }"
      />

      <!-- Сетка цветов -->
      <div
        :style="{
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 1fr)',
          gap: '10px',
          justifyItems: 'center',
        }"
      >
        <button
          v-for="p in PRESETS"
          :key="p.color"
          :style="{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${p.color}, ${p.color}cc)`,
            border: isSelected(p.color)
              ? '3px solid #fff'
              : '2px solid transparent',
            cursor: 'pointer',
            boxShadow: isSelected(p.color)
              ? `0 0 12px ${p.color}66`
              : 'none',
            transition: 'all .2s',
            padding: 0,
          }"
          :title="p.name"
          @click="emit('pick', p.color); emit('close')"
        />
      </div>

      <!-- Сброс -->
      <button
        :style="{
          marginTop: '14px',
          width: '100%',
          padding: '10px',
          background: 'none',
          border: `1px solid ${T.border}`,
          borderRadius: '6px',
          cursor: 'pointer',
          color: T.textSec,
          fontSize: '12px',
        }"
        @click="emit('pick', undefined); emit('close')"
      >
        Сбросить цвет
      </button>
    </div>
  </Modal>
</template>
