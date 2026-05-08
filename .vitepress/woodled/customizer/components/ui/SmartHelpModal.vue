<script setup lang="ts">
/**
 * SmartHelpModal.vue — Единая модалка «Как подбирается размер светильника».
 *
 * batch8 #1: Раньше эта модалка существовала в двух местах с дублированием
 * шаблона/CSS:
 *   1. FxEditor.vue (showHelp) — полная версия
 *   2. RoomDetail.vue (showSmartHelp в Teleport) — урезанная версия
 *
 * Теперь обе точки вызова используют этот компонент. Эталон —
 * полная версия из FxEditor (более развёрнутые описания статусов).
 *
 * Кнопка «Супер!» просто закрывает модалку через emit `close` →
 * родительский экран остаётся под ней без изменений → возврат
 * на правильный экран работает автоматически.
 *
 * Заголовок: «WOODLED SMART» (после batch7 #2 общая замена термина).
 * Анимация rotor-hero — внутри этого компонента, в других файлах
 * соответствующий CSS удалён.
 */

import { T } from '../../theme/tokens'

defineEmits<{ close: [] }>()

const helpStatuses = [
  { label: 'Не хватает',  color: T.red,     desc: 'Меньше половины нормы. Будет темно даже днём.' },
  { label: 'Приглушённо', color: T.yellow,  desc: '0.5–0.8× от нормы. Хорошо для атмосферы и засыпания.' },
  { label: 'Комфортно',   color: T.green,   desc: '0.8–2× — целевой диапазон. Достаточно для всех задач.' },
  { label: 'С запасом',   color: T.neutral, desc: '2–4×. Для рабочих зон или комнат с тёмными стенами.' },
  { label: 'Избыточно',   color: T.textDim, desc: 'Больше 4× нормы. Поставьте диммер или возьмите меньше.' },
]
</script>

<template>
  <Teleport to="body">
    <div
      :style="{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: 'rgba(0,0,0,.75)',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
      }"
      @click.self="$emit('close')"
    >
      <div
        :style="{
          width: '100%',
          maxWidth: '480px',
          maxHeight: '92vh',
          overflow: 'auto',
          background: T.bg,
          borderTopLeftRadius: '18px',
          borderTopRightRadius: '18px',
          borderTop: `1px solid ${T.border}`,
        }"
      >
        <div :style="{ padding: '20px 20px 16px' }">
          <div :style="{ display: 'flex', justifyContent: 'center', padding: '20px 0 14px' }">
            <div class="rotor-hero" aria-hidden="true">
              <div
                v-for="i in 16"
                :key="i"
                class="rotor-hero-l"
                :style="{
                  '--rot': ((i - 1) / 16 * 360) + 'deg',
                  animationDelay: ((i - 1) * 40) + 'ms',
                }"
              />
            </div>
          </div>

          <div :style="{ textAlign: 'center', marginBottom: '24px' }">
            <div
              :style="{
                fontSize: '10px',
                fontWeight: 700,
                color: T.neutral,
                letterSpacing: '1.5px',
                marginBottom: '8px',
              }"
            >
              WOODLED SMART
            </div>
            <div
              :style="{
                fontSize: '22px',
                fontWeight: 800,
                color: T.text,
                lineHeight: 1.2,
                marginBottom: '10px',
              }"
            >
              Как подбирается<br />размер светильника
            </div>
            <div
              :style="{
                fontSize: '13px',
                color: T.textSec,
                lineHeight: 1.6,
                maxWidth: '340px',
                margin: '0 auto',
              }"
            >
              Алгоритм WOODLED сравнивает яркость всех светильников в комнате с нормой и подсказывает лучшее сочетание.
            </div>
          </div>

          <div :style="{ marginBottom: '24px' }">
            <div
              :style="{
                fontSize: '12px',
                fontWeight: 700,
                color: T.textSec,
                textTransform: 'uppercase',
                letterSpacing: '.8px',
                marginBottom: '10px',
              }"
            >
              Что означают статусы
            </div>
            <div :style="{ display: 'flex', flexDirection: 'column', gap: '6px' }">
              <div
                v-for="row in helpStatuses"
                :key="row.label"
                :style="{
                  padding: '10px 12px',
                  background: T.card,
                  border: `1px solid ${T.border}`,
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }"
              >
                <div
                  :style="{
                    padding: '4px 10px',
                    borderRadius: '6px',
                    background: row.color + '22',
                    color: row.color,
                    fontSize: '11px',
                    fontWeight: 700,
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                    minWidth: '92px',
                    textAlign: 'center',
                  }"
                >
                  {{ row.label }}
                </div>
                <div
                  :style="{
                    fontSize: '12px',
                    color: T.textSec,
                    lineHeight: 1.4,
                    flex: 1,
                  }"
                >
                  {{ row.desc }}
                </div>
              </div>
            </div>
          </div>

          <button
            :style="{
              width: '100%',
              padding: '14px',
              background: T.text,
              color: T.bg,
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 700,
              fontFamily: 'inherit',
              marginBottom: '12px',
            }"
            @click="$emit('close')"
          >
            Супер!
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.rotor-hero {
  width: 100px;
  height: 100px;
  position: relative;
  animation: rotorHeroSpin 18s linear infinite;
}
.rotor-hero-l {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 3px;
  height: 22px;
  margin: -11px 0 0 -1.5px;
  border-radius: 2px;
  background: linear-gradient(to bottom, #d4b87a, #b4915a, #8a6e3e);
  transform-origin: 50% 50%;
  animation: rotorHeroAssemble 3500ms ease-in-out infinite;
  opacity: 0;
}
@keyframes rotorHeroSpin { to { transform: rotate(360deg); } }
@keyframes rotorHeroAssemble {
  0%   { transform: rotate(var(--rot)) translateY(-70px) scale(0.4); opacity: 0; }
  20%  { transform: rotate(var(--rot)) translateY(-32px) scale(1);   opacity: 0.9; }
  70%  { transform: rotate(var(--rot)) translateY(-32px) scale(1);   opacity: 0.9; }
  85%  { transform: rotate(var(--rot)) translateY(-70px) scale(0.4); opacity: 0; }
  100% { transform: rotate(var(--rot)) translateY(-70px) scale(0.4); opacity: 0; }
}
</style>
