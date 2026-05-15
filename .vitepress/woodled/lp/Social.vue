<script setup lang="ts">
import { PAGE } from './tokens'

const ITEMS = [
  {
    label: 'ВКонтакте',
    href: '#',
    gradient: `linear-gradient(135deg, ${PAGE.pastelPink} 0%, ${PAGE.pastelPinkD} 100%)`,
    iconColor: PAGE.roseDeep,
    icon: 'vk',
  },
  {
    label: 'Telegram',
    href: '#',
    gradient: `linear-gradient(135deg, ${PAGE.pastelPeach} 0%, ${PAGE.pastelPeachD} 100%)`,
    iconColor: PAGE.roseDeep,
    icon: 'tg',
  },
  {
    label: 'Дзен',
    href: '#',
    gradient: `linear-gradient(135deg, ${PAGE.pastelCream} 0%, ${PAGE.pastelCreamD} 100%)`,
    iconColor: PAGE.rose,
    icon: 'dzen',
  },
] as const

function onCardEnter(e: MouseEvent) {
  ;(e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'
}
function onCardLeave(e: MouseEvent) {
  ;(e.currentTarget as HTMLElement).style.transform = 'translateY(0)'
}
</script>

<template>
  <!--
    Social cards section. Logically continues the "Big Forest" block that
    starts in TreesBadge (H2 + dark trees plate above this). No top H2 here —
    moved to TreesBadge. Reduced top padding so the two halves visually merge.
  -->
  <section
    :style="{
      padding: '8px 24px 48px',
      maxWidth: '720px',
      margin: '0 auto',
      textAlign: 'center',
    }"
  >
    <p
      :style="{
        fontSize: '15px',
        fontWeight: 500,
        color: PAGE.textSec,
        lineHeight: 1.55,
        maxWidth: '460px',
        margin: '0 auto 28px',
      }"
    >
      Реальные дома владельцев, новые модели светильников и истории из мастерской — следите за вдохновением каждую неделю.
    </p>

    <div
      :style="{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 'clamp(10px, 2.5vw, 16px)',
        maxWidth: '480px',
        margin: '0 auto',
      }"
    >
      <a
        v-for="item in ITEMS"
        :key="item.label"
        :href="item.href"
        target="_blank"
        rel="noopener noreferrer"
        :style="{
          aspectRatio: '1 / 1',
          borderRadius: 'clamp(20px, 5vw, 26px)',
          background: item.gradient,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 'clamp(8px, 2vw, 12px)',
          boxShadow:
            'inset 0 1px 0 rgba(255, 255, 255, 0.50), 0 12px 28px rgba(184, 125, 82, 0.18), 0 0 0 1px rgba(184, 125, 82, 0.08)',
          transition: 'transform 250ms ease, box-shadow 250ms ease',
          padding: 'clamp(8px, 2vw, 14px)',
          boxSizing: 'border-box',
        }"
        @mouseenter="onCardEnter"
        @mouseleave="onCardLeave"
        :aria-label="item.label"
      >
        <!-- Icon — scales with viewport. VK / Telegram / Дзен -->
        <svg
          v-if="item.icon === 'vk'"
          :style="{ width: 'clamp(40px, 10vw, 56px)', height: 'clamp(40px, 10vw, 56px)', flexShrink: 0 }"
          viewBox="0 0 24 24"
          :fill="item.iconColor"
        >
          <path
            d="M12.785 16.241s.288-.032.435-.193c.135-.148.131-.426.131-.426s-.019-1.302.582-1.494c.593-.19 1.353 1.262 2.159 1.821.61.422 1.074.33 1.074.33l2.156-.03s1.128-.07.594-.96c-.044-.073-.311-.659-1.598-1.86-1.348-1.258-1.167-1.054.456-3.231.99-1.325 1.385-2.135 1.262-2.481-.117-.331-.846-.244-.846-.244l-2.428.016s-.18-.025-.314.056c-.13.079-.214.262-.214.262s-.383 1.022-.894 1.891c-1.078 1.832-1.51 1.929-1.685 1.815-.408-.265-.306-1.07-.306-1.642 0-1.787.27-2.531-.527-2.724-.265-.064-.46-.106-1.137-.113-.87-.009-1.605.003-2.022.207-.277.135-.491.437-.361.454.16.022.522.099.713.36.247.336.239 1.092.239 1.092s.142 2.078-.331 2.336c-.325.176-.77-.184-1.732-1.85-.493-.853-.865-1.795-.865-1.795s-.072-.176-.2-.27c-.155-.114-.371-.15-.371-.15l-2.307.015s-.346.01-.473.16c-.114.135-.009.412-.009.412s1.807 4.226 3.851 6.355c1.875 1.953 4.005 1.825 4.005 1.825h.964z"
          />
        </svg>
        <svg
          v-else-if="item.icon === 'tg'"
          :style="{ width: 'clamp(40px, 10vw, 56px)', height: 'clamp(40px, 10vw, 56px)', flexShrink: 0 }"
          viewBox="0 0 24 24"
          :fill="item.iconColor"
        >
          <path
            d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z"
          />
        </svg>
        <svg
          v-else
          :style="{ width: 'clamp(40px, 10vw, 56px)', height: 'clamp(40px, 10vw, 56px)', flexShrink: 0 }"
          viewBox="0 0 24 24"
          :fill="item.iconColor"
        >
          <path
            d="M12 2C12 6.5 13 9 14.5 10.5C16 12 18 12 22 12C18 12 16 12 14.5 13.5C13 15 12 17.5 12 22C12 17.5 11 15 9.5 13.5C8 12 6 12 2 12C6 12 8 12 9.5 10.5C11 9 12 6.5 12 2Z"
          />
        </svg>

        <!-- Label — now INSIDE the square card, below the icon -->
        <div
          :style="{
            fontSize: 'clamp(13px, 3vw, 16px)',
            fontWeight: 600,
            color: PAGE.text,
            letterSpacing: 0,
            lineHeight: 1.2,
            textAlign: 'center',
          }"
        >
          {{ item.label }}
        </div>
      </a>
    </div>
  </section>
</template>
