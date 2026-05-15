<script setup lang="ts">
import { ref } from 'vue'
import { PAGE } from './tokens'

const FAQ_ITEMS = [
  {
    q: 'Это действительно бесплатно?',
    a: 'Заглушка ответа. Здесь будет реальный текст: коротко про то, что сборка плана и помощь эксперта — без оплаты, светильники покупаются отдельно по желанию.',
  },
  {
    q: 'Нужно ли регистрироваться?',
    a: 'Заглушка. Ответ о том, что регистрация не нужна, план сохраняется по ссылке, и к нему можно вернуться когда угодно.',
  },
  {
    q: 'Что я получу в результате?',
    a: 'Заглушка. Описание итога: персональный план дома, список светильников с ценами, рекомендации по комнатам, возможность отправить эксперту.',
  },
  {
    q: 'Я не дизайнер — разберусь ли?',
    a: 'Заглушка. Ответ о том, что есть готовые шаблоны под площадь, подсказки по каждой комнате, и эксперт WOODLED помогает на любом шаге.',
  },
  {
    q: 'Кто такие «эксперты WOODLED»?',
    a: 'Заглушка. Описание: специалисты по освещению WOODLED, которые консультируют бесплатно, помогают подобрать светильники под комнату, мебель и бюджет.',
  },
  {
    q: 'Можно ли менять план потом?',
    a: 'Заглушка. Ответ о том, что план редактируется бесконечно, доступен по ссылке, можно возвращаться через дни и недели.',
  },
  {
    q: 'Можно ли покупать постепенно, а не сразу всё?',
    a: 'Заглушка. Объяснение: план не обязывает покупать сразу, светильники докупаются по мере ремонта.',
  },
  {
    q: 'Работает ли на телефоне?',
    a: 'Заглушка. Да, конструктор полностью работает в браузере на любом устройстве — телефон, планшет, ноутбук.',
  },
  {
    q: 'Чем это отличается от Hue или умного дома?',
    a: 'Заглушка. Это не управление умным светом, а подбор и расстановка реальных физических светильников WOODLED ROTOR для покупки и установки в квартире.',
  },
]

const openIndex = ref<number | null>(null)

function toggle(i: number) {
  openIndex.value = openIndex.value === i ? null : i
}
</script>

<template>
  <section :style="{ padding: '40px 24px 56px', maxWidth: '720px', margin: '0 auto' }">
    <h2
      :style="{
        fontSize: 'clamp(28px, 6vw, 40px)',
        fontWeight: 700,
        color: PAGE.text,
        textAlign: 'center',
        margin: '0 0 36px',
        letterSpacing: '-0.025em',
      }"
    >
      Вопросы и ответы
    </h2>

    <div :style="{ display: 'flex', flexDirection: 'column', gap: '10px' }">
      <div
        v-for="(item, i) in FAQ_ITEMS"
        :key="i"
        :style="{
          background: 'rgba(255, 250, 244, 0.55)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          border: `1px solid rgba(255, 255, 255, 0.5)`,
          borderRadius: '18px',
          boxShadow: '0 4px 14px rgba(184, 125, 82, 0.08)',
          overflow: 'hidden',
        }"
      >
        <button
          @click="toggle(i)"
          :style="{
            width: '100%',
            background: 'transparent',
            border: 'none',
            padding: '18px 22px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            cursor: 'pointer',
            fontFamily: 'inherit',
            textAlign: 'left',
          }"
        >
          <span
            :style="{
              fontSize: '17px',
              fontWeight: 600,
              color: PAGE.text,
              lineHeight: 1.4,
            }"
          >
            {{ item.q }}
          </span>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            :stroke="PAGE.textSec"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            :style="{
              flexShrink: 0,
              transform: openIndex === i ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 200ms ease',
            }"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        <div
          :style="{
            maxHeight: openIndex === i ? '240px' : '0px',
            overflow: 'hidden',
            transition: 'max-height 300ms ease, padding 300ms ease',
            padding: openIndex === i ? '0 22px 18px' : '0 22px',
          }"
        >
          <p
            :style="{
              margin: 0,
              fontSize: '15px',
              fontWeight: 500,
              lineHeight: 1.55,
              color: PAGE.textSec,
            }"
          >
            {{ item.a }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
