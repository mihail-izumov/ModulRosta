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
  <div class="modal-zapuskaem">
    <h1 class="md-h1">ЗАПУСКАЕМ</h1>
    <h2 class="md-h2">Первый цифровой модуль в Ранскейл режиме</h2>
    <p class="md-text md-bold">Один модуль — один результат. Работает с первого дня.</p>
    <p class="md-text md-bold">Пока конкуренты думают, вы уже запустили.</p>
    <p class="md-text">Не делаем «сайты», «приложения» или «CRM». Форма определяется в процессе. Запускаем цифровые модули, которые решают конкретное узкое горлышко бизнеса.</p>

    <div class="md-divider"></div>

    <h2 class="md-h2">Ранскейл режим (R&D Циклы)</h2>
    <p class="md-text">Срезаем всё лишнее: ТЗ, согласования, бюрократию, перфекционизм. Оставляем только то, что работает.</p>
    <p class="md-text md-color-green">Маленькая версия → ошибки → корректировка → масштаб.<br/>Не «большой план → идеальное исполнение».</p>

    <div class="md-divider"></div>

    <h2 class="md-h2">Каждый модуль — готовый цифровой продукт</h2>

    <div class="md-accordion" :class="{ open: isOpen('1') }">
      <button class="md-accordion-header" @click="toggle('1')">
        <span class="md-accordion-icon">{{ isOpen('1') ? '−' : '+' }}</span>
        <span class="md-accordion-title">Работает без владельца</span>
      </button>
      <div class="md-accordion-body" :class="{ expanded: isOpen('1') }">
        <div class="md-accordion-content">
          <p class="md-text-inner">Система принимает решения. Всё видно с телефона. Не нужно быть на месте, чтобы контролировать.</p>
        </div>
      </div>
    </div>

    <div class="md-accordion" :class="{ open: isOpen('2') }">
      <button class="md-accordion-header" @click="toggle('2')">
        <span class="md-accordion-icon">{{ isOpen('2') ? '−' : '+' }}</span>
        <span class="md-accordion-title">Работает без участия сотрудников</span>
      </button>
      <div class="md-accordion-body" :class="{ expanded: isOpen('2') }">
        <div class="md-accordion-content">
          <p class="md-text-inner">Или с минимальным. Модуль берёт на себя то, что раньше делали люди — точнее, быстрее, без выходных.</p>
        </div>
      </div>
    </div>

    <div class="md-accordion" :class="{ open: isOpen('3') }">
      <button class="md-accordion-header" @click="toggle('3')">
        <span class="md-accordion-icon">{{ isOpen('3') ? '−' : '+' }}</span>
        <span class="md-accordion-title">Без нового штата</span>
      </button>
      <div class="md-accordion-body" :class="{ expanded: isOpen('3') }">
        <div class="md-accordion-content">
          <p class="md-text-inner">Позволяет масштабироваться без увеличения сложности. Больше рынка — меньше людей.</p>
        </div>
      </div>
    </div>

    <div class="md-accordion" :class="{ open: isOpen('4') }">
      <button class="md-accordion-header" @click="toggle('4')">
        <span class="md-accordion-icon">{{ isOpen('4') ? '−' : '+' }}</span>
        <span class="md-accordion-title">Становится лучше сам по себе</span>
      </button>
      <div class="md-accordion-body" :class="{ expanded: isOpen('4') }">
        <div class="md-accordion-content">
          <p class="md-text-inner">Шаг за шагом. Каждое взаимодействие калибрует систему — она учится на реальных данных вашего бизнеса.</p>
        </div>
      </div>
    </div>

    <div class="md-divider"></div>

    <div class="md-summary">
      <p class="md-summary-heading">Итого:</p>
      <p class="md-summary-line">Работает 24/7.</p>
      <p class="md-summary-line">Без зарплаты. Без больничных.</p>
      <p class="md-summary-line">Без обучения и совещаний.</p>
    </div>
  </div>
</template>
