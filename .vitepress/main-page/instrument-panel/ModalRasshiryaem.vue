<script setup>
import { ref } from 'vue'

const openAccordions = ref(new Set())
const toggle = (key) => {
  const s = new Set(openAccordions.value)
  s.has(key) ? s.delete(key) : s.add(key)
  openAccordions.value = s
}
const isOpen = (key) => openAccordions.value.has(key)
</script>

<template>
  <div class="modal-rasshiryaem">
    <h1 class="md-h1">РАСШИРЯЕМ</h1>
    <h2 class="md-h2">Модуль Роста® — принцип модульной сборки бизнеса</h2>
    <p class="md-text">Не движок. Не метод. Не платформа. Принцип, по которому цифровые продукты проектируются и стыкуются.</p>
    <p class="md-text md-bold">Модули стыкуются друг с другом. Бизнес в цифре растёт. Каждый модуль усиливает всю систему.</p>

    <div class="md-divider"></div>

    <h2 class="md-h2">Принцип модульной сборки</h2>
    <p class="md-text">Каждый модуль автономен — работает сам по себе.<br/>Каждый спроектирован для стыковки — соединяется с другими.<br/>Когда модулей больше — они интегрируются друг с другом и с тем, куда растёт бизнес.<br/>Целое сильнее суммы частей.</p>
    <p class="md-text">Каждый модуль запускается отдельно, работает автономно, решает конкретное узкое горлышко. Но каждый спроектирован так, чтобы стыковаться с другими. Когда модулей больше — они интегрируются друг с другом и с тем, куда и как растёт компания.</p>

    <div class="md-divider"></div>

    <h2 class="md-h2">Модуль за модулем</h2>
    <p class="md-text">Не нужно покупать «всё сразу». Один модуль, результат, решение запустить второй. Потом третий. В какой-то момент — полная цифровая система. Но путь к ней — модуль за модулем.</p>

    <div class="md-accordion" :class="{ open: isOpen('1') }">
      <button class="md-accordion-header" @click="toggle('1')">
        <span class="md-accordion-icon">{{ isOpen('1') ? '−' : '+' }}</span>
        <span class="md-accordion-title">Как это работает на практике</span>
      </button>
      <div class="md-accordion-body" :class="{ expanded: isOpen('1') }">
        <div class="md-accordion-content">
          <p class="md-text-inner md-module-line">Модуль бронирования запущен → работает.</p>
          <p class="md-text-inner md-module-line">Модуль лояльности запущен → работает + стыкуется с бронированием.</p>
          <p class="md-text-inner md-module-line">Модуль аналитики запущен → работает + видит данные из обоих модулей.</p>
          <p class="md-text-inner md-module-line">Витрина запущена → работает + связана с бронированием + лояльностью + аналитикой.</p>
          <p class="md-text-inner" style="margin-top: 12px;">Каждый модуль — отдельный запуск, отдельный результат. Но вместе — система, которая управляет бизнесом.</p>
        </div>
      </div>
    </div>

    <div class="md-accordion" :class="{ open: isOpen('2') }">
      <button class="md-accordion-header" @click="toggle('2')">
        <span class="md-accordion-icon">{{ isOpen('2') ? '−' : '+' }}</span>
        <span class="md-accordion-title">Что происходит когда система собрана</span>
      </button>
      <div class="md-accordion-body" :class="{ expanded: isOpen('2') }">
        <div class="md-accordion-content">
          <p class="md-text-inner">Конкуренты реагируют. Вы действуете.</p>
          <p class="md-text-inner">Вы масштабируетесь. Они нанимают.</p>
          <p class="md-text-inner">Ваша система работает. Их команда совещается.</p>
          <p class="md-text-inner">Вы уже запустили. Они ещё обсуждают.</p>
        </div>
      </div>
    </div>

    <div class="md-divider"></div>

    <h2 class="md-h2">Единственная метрика</h2>
    <p class="md-text md-bold">Доминирует ли бизнес на своём рынке после запуска.</p>
    <p class="md-text">Не «работает ли система». Не «доволен ли клиент». А: стал ли бизнес сильнее?</p>
    <p class="md-text">Если да — расширяемся. Если нет — чиним.</p>
    <p class="md-text">Каждое расширение — новый модуль, новый результат. Бизнес не уходит — он достраивает.</p>
  </div>
</template>
