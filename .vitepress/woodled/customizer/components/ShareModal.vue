<script setup lang="ts">
/**
 * ShareModal.vue — Поделиться ссылкой c текущим состоянием.
 *
 * Состояние конфигуратора пакуется в URL hash (#s=...). Перед копированием
 * пробуем сходить в шортнер (Apps Script) — при успехе копируется короткая
 * ссылка вида /woodled/share/?id=xxxxxx (~50 символов). Если шортнер не
 * ответил за 5 секунд — fallback на длинную ссылку, всё работает без
 * деградации функциональности, только URL длиннее.
 *
 * Спиннер показывается на иконке кнопки пока идёт запрос к серверу.
 */

import { ref } from 'vue'
import { T } from '../theme/tokens'
import type { Room } from '../data/rooms'
import { fxLamps } from '../engine/brightness'
import { buildShareUrl } from '../engine/share'
import { shortenLongUrl } from '../engine/shortener'
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

const isShortening = ref(false)

function makeUrl(): string {
  return buildShareUrl(props.name, props.rooms)
}

async function getShareableUrl(): Promise<string> {
  return shortenLongUrl(makeUrl())
}

async function copyLink() {
  if (isShortening.value) return
  isShortening.value = true
  try {
    const url = await getShareableUrl()
    try {
      await navigator.clipboard.writeText(url)
      emit('feedback', 'Ссылка скопирована')
      emit('close')
    } catch {
      /* iOS/Safari в некоторых контекстах возвращают ошибку — покажем URL в тосте. */
      emit('feedback', url)
    }
  } finally {
    isShortening.value = false
  }
}

async function webShare() {
  if (isShortening.value) return
  isShortening.value = true
  try {
    const url = await getShareableUrl()
    const totalLamps = props.rooms.reduce((s, r) => s + fxLamps(r.fixtures), 0)
    const text = `${props.name} — ${totalLamps} ламп`
    if (navigator.share) {
      try {
        await navigator.share({ title: props.name, text, url })
        emit('close')
      } catch {
        /* Отмена пользователем — тост не нужен. */
      }
    } else {
      emit('feedback', 'Шаринг недоступен')
    }
  } finally {
    isShortening.value = false
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
          :disabled="isShortening"
          :style="{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '6px',
            background: 'none',
            border: 'none',
            cursor: isShortening ? 'wait' : 'pointer',
            opacity: isShortening ? 0.7 : 1,
            transition: 'opacity .15s',
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
              v-if="isShortening"
              class="share-spinner"
              width="22" height="22" viewBox="0 0 24 24"
              fill="none" :stroke="T.text" stroke-width="2.5"
              stroke-linecap="round"
            >
              <path d="M12 2a10 10 0 0 1 10 10" />
            </svg>
            <svg
              v-else
              width="22" height="22" viewBox="0 0 24 24"
              fill="none" :stroke="T.text" stroke-width="2"
              stroke-linecap="round" stroke-linejoin="round"
            >
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
          </div>
          <span :style="{ fontSize: '11px', color: T.textSec }">
            {{ isShortening ? 'Сокращаем…' : 'Скопировать' }}
          </span>
        </button>

        <button
          :disabled="isShortening"
          :style="{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '6px',
            background: 'none',
            border: 'none',
            cursor: isShortening ? 'wait' : 'pointer',
            opacity: isShortening ? 0.7 : 1,
            transition: 'opacity .15s',
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
              v-if="isShortening"
              class="share-spinner"
              width="22" height="22" viewBox="0 0 24 24"
              fill="none" :stroke="T.text" stroke-width="2.5"
              stroke-linecap="round"
            >
              <path d="M12 2a10 10 0 0 1 10 10" />
            </svg>
            <svg
              v-else
              width="22" height="22" viewBox="0 0 24 24"
              fill="none" :stroke="T.text" stroke-width="2"
              stroke-linecap="round" stroke-linejoin="round"
            >
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
              <polyline points="16 6 12 2 8 6" />
              <line x1="12" y1="2" x2="12" y2="15" />
            </svg>
          </div>
          <span :style="{ fontSize: '11px', color: T.textSec }">
            {{ isShortening ? 'Сокращаем…' : 'Поделиться' }}
          </span>
        </button>
      </div>
    </div>
  </Modal>
</template>

<style scoped>
.share-spinner {
  transform-origin: center;
  animation: shareSpin 0.8s linear infinite;
}
@keyframes shareSpin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
