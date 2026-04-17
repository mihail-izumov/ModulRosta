<script setup lang="ts">
/**
 * ShareModal.vue — Поделиться ссылкой.
 *
 * Источник: woodled-v42.jsx (ShareModal inline).
 * Две кнопки: Скопировать + Web Share API (где доступен).
 */

import { T } from '../theme/tokens'
import type { Room } from '../data/rooms'
import { fxLamps } from '../engine/brightness'
import Modal from './ui/Modal.vue'

interface Props {
  name: string
  rooms: Room[]
}
const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
  feedback: [msg: string]
}>()

async function copyLink() {
  try {
    await navigator.clipboard.writeText(window.location.href)
    emit('feedback', 'Ссылка скопирована')
    emit('close')
  } catch {
    emit('feedback', window.location.href)
  }
}

async function webShare() {
  const totalLamps = props.rooms.reduce((s, r) => s + fxLamps(r.fixtures), 0)
  const text = `${props.name} — ${totalLamps} ламп`
  if (navigator.share) {
    try {
      await navigator.share({ title: props.name, text, url: window.location.href })
      emit('close')
    } catch {
      /* Отмена пользователем — не ошибка, просто закрыли sheet. */
    }
  } else {
    emit('feedback', 'Шаринг недоступен')
  }
}
</script>

<template>
  <Modal @close="emit('close')">
    <div :style="{ padding: '28px', textAlign: 'center', position: 'relative' }">
      <button
        :style="{
          position: 'absolute',
          top: '12px',
          right: '12px',
          background: 'none',
          border: 'none',
          color: T.textDim,
          fontSize: '20px',
          cursor: 'pointer',
        }"
        @click="emit('close')"
      >
        ✕
      </button>
      <div
        :style="{
          fontSize: '18px',
          fontWeight: 700,
          color: T.text,
          marginBottom: '8px',
        }"
      >
        Поделиться
      </div>
      <div :style="{ fontSize: '13px', color: T.textSec, marginBottom: '20px' }">
        Покажите друзьям свой лес WOODLED
      </div>

      <div :style="{ display: 'flex', justifyContent: 'center', gap: '20px' }">
        <button
          :style="{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '6px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
          }"
          @click="copyLink"
        >
          <div
            :style="{
              width: '52px',
              height: '52px',
              borderRadius: '50%',
              background: T.card,
              border: `1px solid ${T.border}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }"
          >
            <svg
              width="22" height="22" viewBox="0 0 24 24"
              fill="none" :stroke="T.text" stroke-width="2"
              stroke-linecap="round" stroke-linejoin="round"
            >
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
          </div>
          <span :style="{ fontSize: '11px', color: T.textSec }">Скопировать</span>
        </button>

        <button
          :style="{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '6px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
          }"
          @click="webShare"
        >
          <div
            :style="{
              width: '52px',
              height: '52px',
              borderRadius: '50%',
              background: T.card,
              border: `1px solid ${T.border}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }"
          >
            <svg
              width="22" height="22" viewBox="0 0 24 24"
              fill="none" :stroke="T.text" stroke-width="2"
              stroke-linecap="round" stroke-linejoin="round"
            >
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
              <polyline points="16 6 12 2 8 6" />
              <line x1="12" y1="2" x2="12" y2="15" />
            </svg>
          </div>
          <span :style="{ fontSize: '11px', color: T.textSec }">Поделиться</span>
        </button>
      </div>
    </div>
  </Modal>
</template>
