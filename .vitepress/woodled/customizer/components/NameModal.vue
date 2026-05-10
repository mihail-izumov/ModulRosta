<script setup lang="ts">
/**
 * NameModal.vue — Редактирование названия дома.
 *
 * batch11 #8 v3:
 *   #4 — Заголовок fontSize 15 → 18 (+3 кегля).
 *         «до 16 символов» — строчная, курсив, справа, внутри поля ввода сверху.
 */

import { ref, onMounted, onUnmounted } from 'vue'
import { T, Z } from '../theme/tokens'

const MAX_LEN = 16

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
        position: 'fixed', inset: 0, background: T.bg,
        zIndex: Z.modalOverlay, display: 'flex', alignItems: 'center',
        justifyContent: 'center', padding: '20px',
      }"
      @click.self="emit('close')"
    >
      <div
        :style="{
          width: '100%', maxWidth: '380px', background: '#FFFFFF',
          borderRadius: '14px', padding: '24px 22px', border: 'none',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
        }"
      >
        <!-- batch11 #8 v3 (#4): fontSize 15 → 18 -->
        <div
          :style="{
            fontSize: '18px', fontWeight: 700, color: T.bg,
            marginBottom: '14px', textAlign: 'center', lineHeight: 1.4,
          }"
        >
          Какой свет — такой дом
        </div>

        <!-- Обёртка: input + hint внутри -->
        <div :style="{ position: 'relative' }">
          <input
            v-model="v"
            autofocus
            :maxlength="MAX_LEN"
            :style="{
              width: '100%', padding: '22px 14px 12px',
              background: '#F5F0E8', border: 'none', borderRadius: '8px',
              color: T.bg, fontSize: '15px', fontWeight: 500,
              outline: 'none', boxSizing: 'border-box', textAlign: 'center',
            }"
            @keydown.enter="save"
          />
          <!-- batch11 #8 v3 (#4): строчная, курсив, справа, внутри поля сверху -->
          <div
            :style="{
              position: 'absolute', top: '6px', right: '12px',
              fontSize: '10px', fontStyle: 'italic', color: '#A0998F',
              pointerEvents: 'none',
            }"
          >
            до {{ MAX_LEN }} символов
          </div>
        </div>

        <!-- batch11 #8 v2 (#4): padding 16, font 16, weight 500 -->
        <button
          :style="{
            marginTop: '14px', width: '100%', padding: '16px',
            background: T.bg, color: '#FFFFFF', border: 'none',
            borderRadius: '8px', fontWeight: 500, fontSize: '16px',
            fontFamily: 'inherit', cursor: 'pointer',
          }"
          @click="save"
        >
          Сохранить
        </button>
      </div>
    </div>
  </Teleport>
</template>
