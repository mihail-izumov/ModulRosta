<script setup lang="ts">
import { PAGE } from './tokens'

// Three cards with Apple-tight typography and rose-deep highlights
</script>

<template>
  <section :style="{ padding: '20px 24px 56px', maxWidth: '720px', margin: '0 auto' }">
    <h2
      :style="{
        fontSize: 'clamp(32px, 7vw, 48px)',
        fontWeight: 700,
        color: PAGE.text,
        textAlign: 'center',
        margin: '0 0 36px',
        letterSpacing: '-0.025em',
        lineHeight: 1.08,
      }"
    >
      Три шага к&nbsp;живому дому.
    </h2>

    <div :style="{ display: 'flex', flexDirection: 'column', gap: '14px' }">
      <!-- Card 1 -->
      <div
        :style="{
          padding: '32px 28px',
          borderRadius: '28px',
          background: 'rgba(255, 250, 244, 0.55)',
          backdropFilter: 'blur(24px) saturate(180%)',
          WebkitBackdropFilter: 'blur(24px) saturate(180%)',
          border: `1px solid ${PAGE.glassBorder}`,
          boxShadow: `0 8px 32px rgba(184, 125, 82, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.65)`,
        }"
      >
        <p
          :style="{
            margin: 0,
            fontSize: 'clamp(22px, 4.8vw, 28px)',
            lineHeight: 1.0,
            letterSpacing: '-0.022em',
            textAlign: 'center',
            fontWeight: 600,
            color: PAGE.text,
          }"
        >
          Соберите свой дом — комнаты, стены, мебель.
          <br />
          <span :style="{ color: PAGE.roseDeep, fontWeight: 600 }">Дизайнер – это&nbsp;я.</span>
        </p>
      </div>

      <!-- Card 2 -->
      <div
        :style="{
          padding: '32px 28px',
          borderRadius: '28px',
          background: 'rgba(255, 250, 244, 0.55)',
          backdropFilter: 'blur(24px) saturate(180%)',
          WebkitBackdropFilter: 'blur(24px) saturate(180%)',
          border: `1px solid ${PAGE.glassBorder}`,
          boxShadow: `0 8px 32px rgba(184, 125, 82, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.65)`,
        }"
      >
        <p
          :style="{
            margin: 0,
            fontSize: 'clamp(22px, 4.8vw, 28px)',
            lineHeight: 1.0,
            letterSpacing: '-0.022em',
            textAlign: 'center',
            fontWeight: 600,
            color: PAGE.text,
          }"
        >
          Поставьте светильники WOODLED
          <span :style="{ color: PAGE.roseDeep, fontWeight: 600 }">в&nbsp;каждой комнате</span>
          — выбирайте дерево, цвет и&nbsp;форму.
        </p>
      </div>

      <!-- Card 3 -->
      <div
        :style="{
          padding: '32px 28px',
          borderRadius: '28px',
          background: 'rgba(255, 250, 244, 0.55)',
          backdropFilter: 'blur(24px) saturate(180%)',
          WebkitBackdropFilter: 'blur(24px) saturate(180%)',
          border: `1px solid ${PAGE.glassBorder}`,
          boxShadow: `0 8px 32px rgba(184, 125, 82, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.65)`,
        }"
      >
        <p
          :style="{
            margin: 0,
            fontSize: 'clamp(22px, 4.8vw, 28px)',
            lineHeight: 1.0,
            letterSpacing: '-0.022em',
            textAlign: 'center',
            fontWeight: 600,
            color: PAGE.text,
          }"
        >
          <span :style="{ color: PAGE.roseDeep, fontWeight: 600 }">Дом оживает на&nbsp;глазах</span>
          — настроение и&nbsp;баланс света считаются сразу.
        </p>
      </div>
    </div>
  </section>
</template>
