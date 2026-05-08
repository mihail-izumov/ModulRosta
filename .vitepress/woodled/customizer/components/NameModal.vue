<script setup lang="ts">
/**
 * NameModal.vue — Редактирование названия дома.
 *
 * batch7 #9:
 *   - Полное затемнение страницы (solid overlay, без прозрачности).
 *     Не используем общий Modal.vue — у него полупрозрачный фон,
 *     а тут нужен полностью непрозрачный, плюс белая карточка
 *     модалки. Делаем самостоятельный teleport-overlay.
 *   - Заголовок изменён: «Название» → «Какой дом — такое настроение».
 *   - Карточка модалки белая, без обводки.
 *   - Скролл body блокируется на время показа (как в Modal.vue).
 */

import { ref, onMounted, onUnmounted } from 'vue'
import { T, Z } from '../theme/tokens'

interface Props {
  value: string
}
const props = defineProps<Props>()
const emit = defineEmits<{
  save: [value: string]
  close: []
}>()

const v = ref(props.value)

let prevOverflow = ''
onMounted(() => {
  prevOverflow = document.body.style.overflow
  document.body.style.overflow = 'hidden'
})
onUnmounted(() => {
  document.body.style.overflow = prevOverflow
})

function save() {
  emit('save', v.value)
  emit('close')
}
</script>

<template>
  <Teleport to="body">
    <div
      :style="{
        position: 'fixed',
        inset: 0,
        background: T.bg,
        zIndex: Z.modalOverlay,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }"
      @click.self="emit('close')"
    >
      <div
        :style="{
          width: '100%',
          maxWidth: '380px',
          background: '#FFFFFF',
          borderRadius: '14px',
          padding: '24px 22px',
          border: 'none',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
        }"
      >
        <div
          :style="{
            fontSize: '15px',
            fontWeight: 700,
            color: T.bg,
            marginBottom: '14px',
            textAlign: 'center',
            lineHeight: 1.4,
          }"
        >
          Какой свет — такой дом
        </div>
        <input
          v-model="v"
          autofocus
          :style="{
            width: '100%',
            padding: '12px 14px',
            background: '#F5F0E8',
            border: 'none',
            borderRadius: '8px',
            color: T.bg,
            fontSize: '15px',
            fontWeight: 500,
            outline: 'none',
            boxSizing: 'border-box',
          }"
          @keydown.enter="save"
        />
        <button
          :style="{
            marginTop: '14px',
            width: '100%',
            padding: '12px',
            background: T.bg,
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 700,
            fontSize: '14px',
            fontFamily: 'inherit',
            cursor: 'pointer',
          }"
          @click="save"
        >
          Сохранить
        </button>
      </div>
    </div>
  </Teleport>
</template>
