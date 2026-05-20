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

import { onMounted, ref, watch } from 'vue'
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
   Когда модалка открывается, в фоне сразу стартует запрос в шортнер.
   Пользователь читает заголовок 1-2 секунды → к клику ссылка уже готова.

   Copy: ClipboardItem с pending promise — работает синхронно с gesture,
         ждёт promise без появления permission prompt.
   Web Share: navigator.share требует синхронной строки. Если короткая уже
         готова (shortenedUrl.value !== null) — используем её. Иначе длинную —
         iOS share sheet всё равно мгновенно откроется. */
let shortPromise: Promise<string> | null = null
const shortenedUrl = ref<string | null>(null)
const isShortening = ref(false)

function refreshShortPromise() {
  const longUrl = makeUrl()
  shortenedUrl.value = null
  shortPromise = shortenLongUrl(longUrl).catch(() => longUrl)
  shortPromise.then(url => { shortenedUrl.value = url })
}

onMounted(refreshShortPromise)
watch(() => [props.name, props.rooms] as const, refreshShortPromise, { deep: true })

async function copyLink() {
  if (isShortening.value) return
  isShortening.value = true
  const longUrl = makeUrl()
  const urlPromise = shortPromise ?? Promise.resolve(longUrl)
  try {
    if (typeof ClipboardItem !== 'undefined') {
      const blobPromise = urlPromise.then(url => new Blob([url], { type: 'text/plain' }))
      await navigator.clipboard.write([new ClipboardItem({ 'text/plain': blobPromise })])
      emit('feedback', 'Ссылка скопирована')
      emit('close')
    } else {
      /* Safari старше 14: ClipboardItem недоступен → длинную sync. */
      await navigator.clipboard.writeText(longUrl)
      emit('feedback', 'Ссылка скопирована')
      emit('close')
    }
  } catch {
    emit('feedback', longUrl)
  } finally {
    isShortening.value = false
  }
}

function webShare() {
  /* Если prefetch успел — даём короткую. Если нет — длинную (iOS Messages OK). */
  const url = shortenedUrl.value ?? makeUrl()
  const totalLamps = props.rooms.reduce((s, r) => s + fxLamps(r.fixtures), 0)
  const text = `${props.name} — ${totalLamps} ламп`
  if (navigator.share) {
    navigator.share({ title: props.name, text, url })
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
            {{ isShortening ? 'Копируем…' : 'Скопировать' }}
          </span>
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
