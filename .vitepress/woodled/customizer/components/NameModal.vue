<script setup lang="ts">
/**
 * NameModal.vue — Редактирование названия дома.
 *
 * Источник: woodled-v42.jsx (NameModal).
 */

import { ref } from 'vue'
import { T } from '../theme/tokens'
import Modal from './ui/Modal.vue'

interface Props {
  value: string
}
const props = defineProps<Props>()
const emit = defineEmits<{
  save: [value: string]
  close: []
}>()

const v = ref(props.value)

function save() {
  emit('save', v.value)
  emit('close')
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
          marginBottom: '12px',
        }"
      >
        Название
      </div>
      <input
        v-model="v"
        autofocus
        :style="{
          width: '100%',
          padding: '10px 12px',
          background: T.bg,
          border: `1px solid ${T.border}`,
          borderRadius: '6px',
          color: T.text,
          fontSize: '15px',
          outline: 'none',
          boxSizing: 'border-box',
        }"
        @keydown.enter="save"
      />
      <button
        :style="{
          marginTop: '12px',
          width: '100%',
          padding: '10px',
          background: T.neutral,
          color: T.bg,
          border: 'none',
          borderRadius: '6px',
          fontWeight: 700,
          cursor: 'pointer',
        }"
        @click="save"
      >
        Сохранить
      </button>
    </div>
  </Modal>
</template>
