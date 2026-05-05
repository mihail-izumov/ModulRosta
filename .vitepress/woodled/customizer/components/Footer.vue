<script setup lang="ts">
/**
 * Footer.vue — Лого WOODLED + ссылка «Начать заново».
 *
 * Лого — SVG как CSS-маска, окрашена в T.neutral.
 * Ссылка «Начать заново» — нейтральная (T.textSec), маленькая, не bold.
 * Это safe-action, не destructive: при тапе показывается модалка
 * подтверждения (рендерится в App.vue), затем resetAll().
 *
 * Показывается только если есть хотя бы одна комната — иначе сбрасывать
 * нечего, ссылка не нужна (на welcome screen Footer не виден вовсе).
 */

import { T } from '../theme/tokens'
import { useConfigurator } from '../store/configurator'

const cfg = useConfigurator()
const emit = defineEmits<{ resetClick: [] }>()

const LOGO_URL = 'https://runscale.ru/woodled/customizer/woodled-logo.svg'

function onResetClick() {
  emit('resetClick')
}
</script>

<template>
  <div :style="{ marginTop: '60px', marginBottom: '20px' }">
    <!-- Лого -->
    <div
      :style="{
        display: 'flex',
        justifyContent: 'center',
        opacity: 0.55,
      }"
    >
      <div
        :style="{
          width: '130px',
          height: '22px',
          background: T.neutral,
          maskImage: `url(${LOGO_URL})`,
          maskSize: 'contain',
          maskRepeat: 'no-repeat',
          maskPosition: 'center',
          WebkitMaskImage: `url(${LOGO_URL})`,
          WebkitMaskSize: 'contain',
          WebkitMaskRepeat: 'no-repeat',
          WebkitMaskPosition: 'center',
        }"
      />
    </div>

    <!-- Ссылка «Начать заново» — только если уже есть комнаты -->
    <div
      v-if="cfg.rooms.length > 0"
      :style="{ display: 'flex', justifyContent: 'center', marginTop: '14px' }"
    >
      <button
        :style="{
          background: 'none',
          border: 'none',
          color: T.textSec,
          fontSize: '12px',
          cursor: 'pointer',
          padding: '4px 8px',
          textDecoration: 'underline',
          textUnderlineOffset: '3px',
          fontFamily: 'inherit',
        }"
        @click="onResetClick"
      >
        Начать заново
      </button>
    </div>
  </div>
</template>
