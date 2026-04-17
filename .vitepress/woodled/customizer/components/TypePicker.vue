<script setup lang="ts">
/**
 * TypePicker.vue — Модалка «Добавить комнату».
 *
 * Источник: woodled-v42.jsx (TypePicker).
 * Сетка 2×2 из типов комнат.
 */

import { T } from '../theme/tokens'
import { RTS, type RoomTypeId } from '../data/rooms'
import Modal from './ui/Modal.vue'

const emit = defineEmits<{
  pick: [typeId: RoomTypeId]
  close: []
}>()
</script>

<template>
  <Modal @close="emit('close')">
    <div :style="{ padding: '20px' }">
      <div
        :style="{
          fontSize: '14px',
          fontWeight: 700,
          color: T.text,
          marginBottom: '14px',
        }"
      >
        Добавить комнату
      </div>
      <div :style="{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }">
        <button
          v-for="rt in RTS"
          :key="rt.id"
          :style="{
            padding: '12px',
            border: `1px solid ${T.border}`,
            borderRadius: '8px',
            background: T.cardAlt,
            cursor: 'pointer',
            color: T.text,
            fontSize: '13px',
          }"
          @click="emit('pick', rt.id)"
        >
          {{ rt.name }}
        </button>
      </div>
      <button
        :style="{
          marginTop: '12px',
          width: '100%',
          padding: '10px',
          background: 'none',
          border: `1px solid ${T.border}`,
          borderRadius: '6px',
          cursor: 'pointer',
          color: T.textSec,
        }"
        @click="emit('close')"
      >
        Отмена
      </button>
    </div>
  </Modal>
</template>
