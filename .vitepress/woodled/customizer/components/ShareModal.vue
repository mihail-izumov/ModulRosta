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

import { onMounted, ref } from 'vue'
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

function makeUrl(): string {
  return buildShareUrl(props.name, props.rooms)
}

/* ──────────── stage3-shortener: prefetch + ClipboardItem-pattern ────────────
   При открытии модалки в фоне готовится короткая ссылка. К моменту клика
   обычно уже разрешена.

   Cache check: используем prefetched promise только если он соответствует
   ТЕКУЩЕМУ longUrl. Если props.name или props.rooms изменились между
   prefetch и кликом — делаем свежий запрос. */
let prefetched: { longUrl: string; promise: Promise<string> } | null = null
const shortenedUrl = ref<string | null>(null)

function refreshShortPromise() {
  const longUrl = makeUrl()
  if (prefetched && prefetched.longUrl === longUrl) return
  shortenedUrl.value = null
  const promise = shortenLongUrl(longUrl).catch(() => longUrl)
  prefetched = { longUrl, promise }
  promise.then(url => {
    /* Если шортнер реально вернул короткую (отличается от длинной) — кэшируем
       и обновляем ref для Web Share. Если вернулась длинная (cold start timeout
       или сервер недоступен) — НЕ кэшируем: следующий клик сделает fresh
       запрос, который попадёт на уже прогретый Apps Script и обычно
       успевает за 1-2 секунды. */
    if (url !== longUrl) {
      if (prefetched && prefetched.longUrl === longUrl) {
        shortenedUrl.value = url
      }
    } else {
      // Длинная в результате — стираем кэш, чтобы следующий клик попробовал снова
      if (prefetched && prefetched.longUrl === longUrl) {
        prefetched = null
      }
    }
  })
}

onMounted(refreshShortPromise)

function copyLink() {
  /* Кнопка в template :disabled="!shortenedUrl" — сюда попадаем только
     когда короткая готова. Используем её синхронно (в user gesture context)
     без всякого promise-ожидания — это гарантирует что в буфер пойдёт
     именно короткая, никаких fallback на длинную. */
  const url = shortenedUrl.value
  if (!url) return
  navigator.clipboard.writeText(url)
    .then(() => {
      emit('feedback', 'Ссылка скопирована')
      emit('close')
    })
    .catch(() => {
      /* Очень редкий случай — clipboard.writeText упал. Показываем URL в тосте,
         чтобы юзер мог скопировать вручную. */
      emit('feedback', url)
    })
}

function webShare() {
  /* Кнопка в template помечена :disabled="!shortenedUrl", так что сюда
     попадаем только когда shortenedUrl готова. На всякий случай защита: */
  const url = shortenedUrl.value
  if (!url) return
  const totalLamps = props.rooms.reduce((s, r) => s + fxLamps(r.fixtures), 0)
  const text = `${props.name} — ${totalLamps} ламп\n${url}`
  if (navigator.share) {
    navigator.share({ title: props.name, text })
      .then(() => emit('close'))
      .catch(() => { /* отмена пользователем */ })
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
          :disabled="!shortenedUrl"
          :style="{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '6px',
            background: 'none',
            border: 'none',
            cursor: shortenedUrl ? 'pointer' : 'wait',
            opacity: shortenedUrl ? 1 : 0.5,
            transition: 'opacity .2s',
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
              v-if="!shortenedUrl"
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
            {{ shortenedUrl ? 'Скопировать' : 'Готовим…' }}
          </span>
        </button>

        <button
          :disabled="!shortenedUrl"
          :style="{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '6px',
            background: 'none',
            border: 'none',
            cursor: shortenedUrl ? 'pointer' : 'wait',
            opacity: shortenedUrl ? 1 : 0.5,
            transition: 'opacity .2s',
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
              v-if="!shortenedUrl"
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
            {{ shortenedUrl ? 'Поделиться' : 'Готовим…' }}
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
