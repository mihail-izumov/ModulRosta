<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import AktivLaunches from './AktivLaunches.vue'

// ─── Scroll Reveal ───
let observer = null
onMounted(() => {
  // Load Orbitron font
  if (!document.querySelector('link[href*="Orbitron"]')) {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&display=swap'
    document.head.appendChild(link)
  }
  observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('revealed') })
  }, { threshold: 0.1 })
  nextTick(() => document.querySelectorAll('.reveal').forEach(el => observer.observe(el)))
})
onUnmounted(() => observer?.disconnect())

// ─── Counter ───
const counterRefs = ref([])
function useCounter(el, end) {
  if (!el) return
  const obs = new IntersectionObserver(([e]) => {
    if (e.isIntersecting) {
      obs.disconnect()
      const start = performance.now()
      const tick = (now) => {
        const p = Math.min((now - start) / 2000, 1)
        el.textContent = Math.round((1 - Math.pow(1 - p, 3)) * end).toLocaleString('ru-RU')
        if (p < 1) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    }
  }, { threshold: 0.3 })
  obs.observe(el)
}
onMounted(() => nextTick(() => counterRefs.value.forEach(({ el, end }) => el && useCounter(el, end))))
function setCounterRef(el, end) { if (el) counterRefs.value.push({ el, end }) }

// ─── Data ───
const heroStats = [
  { val: 10, label: 'механик', color: '#00ff88', glow: 'rgba(0,255,136,0.15)' },
  { val: 6, label: 'классов активов', color: '#ff8800', glow: 'rgba(255,136,0,0.15)' },
  { val: 14, label: 'сценариев советника', color: '#58a6ff', glow: 'rgba(88,166,255,0.15)' },
  { val: 5, label: 'категорий Q&A', color: '#ff8800', glow: 'rgba(255,136,0,0.15)' },
]

const archModules = [
  { name: 'Главный модуль', desc: 'Оркестрация всех блоков калькулятора, управление потоком данных', color: '#00ff88' },
  { name: 'Конфигурация проекта', desc: 'Все параметры, раунды, команда, риски — в одном файле', color: '#ff8800' },
  { name: 'Алгоритмы портфеля', desc: 'Средневзвешенная доходность, риск с поправкой на концентрацию', color: '#58a6ff' },
  { name: 'Генератор PDF', desc: 'Персональный отчёт: паспорт, портфель, дивиденды, аналитика', color: '#ff8800' },
  { name: 'Блок гарантий', desc: 'Сценарии загрузки, таймлайн, покрытие залогом, формула выкупа', color: '#00ff88' },
  { name: 'Визуализация портфеля', desc: 'Cards Grid — наглядное отображение распределения капитала', color: '#58a6ff' },
  { name: 'Q&A модуль', desc: '5 категорий вопросов с ответами на конкретных цифрах проекта', color: '#ff8800' },
  { name: 'Ввод и управление', desc: 'Слайдеры, поля суммы, модальные окна, тултипы, валидация', color: 'rgba(255,255,255,0.3)' },
]

const flowSteps = [
  { label: 'Конфигурация', desc: 'Статичные данные проекта', color: '#ff8800' },
  { label: 'Алгоритмы', desc: 'Реактивные вычисления', color: '#58a6ff' },
  { label: 'Интерфейс', desc: 'Отображение и взаимодействие', color: '#00ff88' },
]

const radarStats = [
  { val: '300 000+', label: 'инвесторов проанализировано', color: '#00ff88' },
  { val: '4', label: 'стратегии', color: '#ff8800' },
  { val: '6', label: 'классов активов', color: '#58a6ff' },
  { val: '14', label: 'сценариев советника', color: '#ff8800' },
]

const formulas = [
  { label: 'Формула доходности', color: '#00ff88', formula: 'Доходность = Σ (доля_i × (minYield_i + maxYield_i) / 2)', note: 'Средневзвешенная по долям каждого актива' },
  { label: 'Формула риска', color: '#ff8800', formula: 'Риск = Σ (доля_i × risk_i) + штраф_концентрации', note: '100% в одном: +2 (с гарантией) или +3 (без)' },
  { label: 'Формула выкупа', color: '#58a6ff', formula: 'Цена = max(500₽, 1000₽ − дивиденды/акция)', note: 'Через 55 месяцев, гарантия в опционном договоре' },
  { label: 'Покрытие залогом', color: 'rgba(255,255,255,0.4)', formula: 'Покрытие = стоимость_залога / инвестиция', note: '> 30× — отлично · > 10× — хорошо · > 3× — норма' },
]

const assets = [
  { name: 'Кейс Optima Space', yld: '31-36%', risk: '4/10', tag: 'РЕКОМЕНДУЕМ', color: '#00D9C0', desc: 'Сервисные офисы с обратным выкупом', hl: true },
  { name: 'Складская логистика', yld: '11-13%', risk: '3/10', tag: 'СТАБИЛЬНО', color: '#3B82F6', desc: 'ЗПИФ, дефицит 1.5%' },
  { name: 'Street-retail', yld: '9-16%', risk: '3/10', tag: 'ЛИКВИДНО', color: '#06B6D4', desc: 'Первые этажи, вакансия 4-5%' },
  { name: 'Облигации', yld: '10-13%', risk: '2/10', tag: 'УМЕРЕННО', color: '#8B5CF6', desc: 'Корпоративные и ОФЗ' },
  { name: 'Дивидендные акции', yld: '12-15%', risk: '5/10', tag: 'ДОХОДНО', color: '#FF7A45', desc: 'Голубые фишки' },
  { name: 'Резерв (депозиты)', yld: '18-20%', risk: '1/10', tag: 'ЗАЩИТА', color: '#10B981', desc: 'АСВ до 1.4 млн' },
]

const strategies = [
  { name: 'Консервативная', target: '14-16%', optima: 10, alloc: '25% склады · 20% облигации · 15% retail · 15% акции · 15% депозиты', color: '#58a6ff', tooltip: 'Горизонт 3-5 лет' },
  { name: 'Сбалансированная', target: '18-22%', optima: 20, alloc: '25% склады · 15% retail · 15% облигации · 15% акции · 10% депозиты', color: '#00ff88', tooltip: 'Горизонт 5-10 лет' },
  { name: 'Рост капитала', target: '22-28%', optima: 30, alloc: '20% склады · 20% retail · 15% акции · 10% облигации · 5% депозиты', color: '#ff8800', tooltip: 'Горизонт 10+ лет' },
  { name: 'Полный фокус', target: '36%', optima: 100, alloc: '100% основной актив · Гарантия выкупа', color: '#ff8800', tooltip: 'Макс. доходность', max: true },
]

const advisorRows = [
  { c: 'yield ≥ 20%, risk ≤ 4, основной 15-30%', t: 'Отличный баланс! Диверсифицирован, цель 20%+ достигнута.', type: 'success' },
  { c: 'yield ≥ 20%, основной ≥ 20%, депозиты ≥ 10%', t: 'Грамотная структура: основной — доходность, депозиты — резерв.', type: 'success' },
  { c: '4+ активов, total = 100%', t: 'Хорошая диверсификация между классами.', type: 'success' },
  { c: 'yield 15-20%, risk ≤ 3', t: 'Консервативный подход. Для 20%+ увеличьте основной.', type: 'info' },
  { c: 'основной = 100%', t: 'Максимальный фокус. Доходность 36% с гарантией.', type: 'info' },
  { c: 'основной ≥ 50%', t: 'Агрессивная стратегия с макс. доходностью.', type: 'info' },
  { c: 'основной < 10%, yield < 20%', t: 'Доля слишком мала для влияния на доходность.', type: 'warning' },
  { c: 'risk > 5', t: 'Повышенный риск. Добавьте облигации или депозиты.', type: 'warning' },
  { c: 'депозиты = 0%, total = 100%', t: 'Рекомендуем 5-10% в депозитах как резерв.', type: 'warning' },
  { c: 'yield < 20%, total = 100%', t: 'Цель не достигнута. Увеличьте основной.', type: 'warning' },
  { c: 'сумма < минимума', t: 'Минимальная инвестиция не достигнута.', type: 'error' },
  { c: 'total > 100%', t: 'Превышение 100%. Скорректируйте.', type: 'error' },
  { c: 'total = 0%', t: 'Выберите стратегию или распределите вручную.', type: 'neutral' },
  { c: 'fallback', t: 'Настройте портфель под ваши цели.', type: 'neutral' },
]

const mechanics = [
  { num: 1, title: 'Универсальный портфель', problem: '«Мне не нужен коворкинг, я хочу склады»', solution: 'Все 6 классов активов с реальными доходностями и рисками. Можно собрать любой портфель.', result: 'Основной актив выигрывает по соотношению доходность/риск при любой комбинации' },
  { num: 2, title: 'Стратегии как точки входа', problem: 'Новичок не знает как распределить деньги', solution: '4 стратегии с конкретными долями: от 10% до 100% в основном активе.', result: 'Любой психотип находит «свою» стратегию — в каждой есть основной актив' },
  { num: 3, title: 'Визуальная доминанта', problem: 'В списке из 6 активов основной может потеряться', solution: 'Бейдж РЕКОМЕНДУЕМ, отдельный цвет, первая позиция, блок деталей.', result: 'Взгляд всегда возвращается к основному активу' },
  { num: 4, title: 'Советник', problem: 'Пользователь не понимает хорош ли портфель', solution: '14 сценариев автоматических комментариев в порядке приоритета.', result: 'Обратная связь с мягким nudge к увеличению основного актива' },
  { num: 5, title: 'Цель 20%+', problem: 'Нет ориентира сколько должен зарабатывать портфель', solution: 'Явный индикатор достижения 20%+ годовых.', result: 'Достижим только с основным активом в портфеле' },
  { num: 6, title: 'Сценарии загрузки', problem: '«А что если не сработает?»', solution: 'Слайдер 50-95%. Три сценария: план, умеренный, худший.', result: 'Даже при 50% — гарантированный выкуп, возврат ~190% за 4.5 года' },
  { num: 7, title: 'Покрытие залогом', problem: '«А если всё пропадёт?»', solution: 'Динамический расчёт: стоимость залога / инвестиция.', result: '1 млн — 104×, 5 млн — 21×, 10 млн — 10×' },
  { num: 8, title: 'Таймлайн', problem: '55 месяцев — абстракция', solution: '4 точки: покупка — запуск — окупаемость — выкуп.', result: 'Конкретный путь с понятными milestone\'ами' },
  { num: 9, title: 'Q&A', problem: 'Сомнения, которые инвестор не озвучивает', solution: '5 категорий: финансы, юридическое, операционное, риски, выход.', result: 'Возражения закрыты до того как стали барьером' },
  { num: 10, title: 'PDF-отчёт', problem: 'Ушёл «подумать» и забыл', solution: 'Персональный документ: паспорт, портфель, дивиденды, аналитика, Q&A.', result: 'Якорь, который возвращает к решению.' },
]

const userSteps = [
  { n: '01', label: 'Обратный отсчёт', desc: 'До запуска проекта. Дни, часы, минуты.', color: '#ff8800' },
  { n: '02', label: 'Паспорт проекта', desc: '4 вкладки: Локация, Финансы, Гарантии, О компании.', color: '#58a6ff' },
  { n: '03', label: 'Ваш капитал', desc: 'Слайдер + быстрые кнопки. Поле ввода с форматированием.', color: '#00ff88' },
  { n: '04', label: 'Распределение', desc: 'Слайдеры 6 активов + визуализация. Стратегии или ручной режим.', color: '#ff8800' },
  { n: '05', label: 'Детали основного актива', desc: 'Акции, дивиденды, покрытие, сценарии, таймлайн, гарантии.', color: '#00ff88' },
  { n: '06', label: 'Q&A', desc: '5 категорий × 3 вопроса. Реальные цифры. Accordion.', color: '#58a6ff' },
  { n: '07', label: 'Итог + PDF', desc: 'Портфель + доход. «Инвестировать» + «Скачать PDF».', color: '#ff8800' },
]

const scenarios = [
  { load: 90, roi: '36%', label: 'ПЛАН', color: '#00ff88', profit: '5 997 000 ₽/мес', buyback: '500 ₽/акция' },
  { load: 70, roi: '28%', label: 'УМЕРЕННЫЙ', color: '#58a6ff', profit: '3 500 000 ₽/мес', buyback: '720 ₽/акция' },
  { load: 50, roi: '20%', label: 'ХУДШИЙ', color: '#ff8800', profit: '1 800 000 ₽/мес', buyback: '500 ₽ (гарантия)' },
]

const timeline = [
  { date: 'Сейчас', label: 'Покупка акций', active: true, tip: 'Выписка из реестра' },
  { date: 'Июнь 2026', label: 'Запуск', active: false, tip: 'Открытие после ремонта' },
  { date: 'Ноябрь 2028', label: 'Окупаемость', active: false, tip: 'ROI 100% за 29 мес' },
  { date: 'Май 2030', label: 'Выкуп', active: false, tip: 'Опцион через 55 мес' },
]

const guarantees = [
  { title: 'Обратный выкуп', desc: '1000₽ − дивиденды (мин. 500₽) через 4,5 года.' },
  { title: 'Экстренная продажа', desc: 'По цене покупки с 4-го года.' },
  { title: 'Прозрачность', desc: 'Ежемесячная управленческая отчётность.' },
  { title: 'Встречи с основателем', desc: 'Ежемесячные онлайн-встречи.' },
  { title: 'Акционерное соглашение', desc: 'Управленческие рычаги влияния.' },
]

const caseMetrics = [
  { val: '1 880', u: 'кв.м', l: 'Площадь' }, { val: '409', u: '', l: 'Рабочих мест' },
  { val: '144', u: 'млн ₽', l: 'Инвестиции' }, { val: '122', u: 'млн ₽/год', l: 'Выручка' },
  { val: '36', u: '%', l: 'ROI I раунда' }, { val: '29', u: 'мес', l: 'Окупаемость' },
  { val: '104', u: 'млн ₽', l: 'Залог' }, { val: '288k', u: 'шт', l: 'Акций' },
]

const poc = [{ v: '97%', l: 'Заполняемость' }, { v: '4.7 млн', l: 'Выручка/мес' }, { v: '2.3 млн', l: 'Прибыль/мес' }, { v: '1 495 кв.м', l: 'Площадь' }]
const anik = [{ v: '15 лет', l: 'На рынке' }, { v: '56', l: 'Объектов' }, { v: '7', l: 'Городов' }, { v: '140 млн ₽', l: 'Выручка 2024' }]
const scaleItems = ['Коммерческая недвижимость', 'Жилая недвижимость', 'Инвестфонды', 'Краудлендинг', 'Платформы для инвесторов']
const advisorTypeColor = (t) => ({ success:'#00ff88', warning:'#ff8800', info:'#58a6ff', error:'#E8192C', neutral:'rgba(255,255,255,0.3)' }[t] || 'rgba(255,255,255,0.3)')
const riskWidth = (r) => (parseInt(r)/10)*100+'%'
</script>

<template>
<div class="aktiv-landing">

  <!-- ═══ HERO ═══ -->
  <section class="hero">
    <div class="hero-glow" />
    <div class="reveal" style="--d:0s">
      <svg class="hero-origami" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 12V4a1 1 0 0 1 1-1h6.297a1 1 0 0 1 .651 1.759l-4.696 4.025"/><path d="m12 21-7.414-7.414A2 2 0 0 1 4 12.172V6.415a1.002 1.002 0 0 1 1.707-.707L20 20.009"/><path d="m12.214 3.381 8.414 14.966a1 1 0 0 1-.167 1.199l-1.168 1.163a1 1 0 0 1-.706.291H6.351a1 1 0 0 1-.625-.219L3.25 18.8a1 1 0 0 1 .631-1.781l4.165.027"/>
      </svg>
    </div>
    <div class="reveal" style="--d:0.2s"><img src="/icons/aktiv-icon.svg" alt="Актив" class="hero-aktiv-icon" /></div>
    <div class="reveal" style="--d:0.4s"><div class="exo hero-sub">Инвестиционная система Модуля Роста®</div></div>

    <!-- Glass morphism stat tiles -->
    <div class="reveal" style="--d:0.55s">
      <div class="glass-stats">
        <div v-for="(s, i) in heroStats" :key="s.label" class="glass-tile" :style="{ '--accent': s.color, '--glow': s.glow, animationDelay: (0.6 + i * 0.15) + 's' }">
          <div class="glass-bg" />
          <div class="glass-shine" />
          <div class="glass-border" />
          <div class="glass-content">
            <div class="orbitron glass-val" :style="{ color: s.color }"><span :ref="el => setCounterRef(el, s.val)">0</span></div>
            <div class="glass-label">{{ s.label }}</div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- ═══ LAUNCHES ═══ -->
  <section class="sec launches-sec"><div class="container">
    <div class="reveal"><div class="mono sec-label" style="color:#00ff88">Запуски</div></div>
    <div class="reveal" style="--d:0.1s"><h2 class="sec-title">Модули на Активе</h2></div>
    <div class="launches-wrap"><AktivLaunches /></div>
  </div></section>

  <!-- ═══ PROBLEM ═══ -->
  <section class="sec"><div class="container">
    <div class="reveal"><div class="mono sec-label" style="color:#58a6ff">Проблема</div></div>
    <div class="reveal" style="--d:0.1s"><h2 class="sec-title">PDF на 40 страниц. Закрыл.<br><span class="dim">Встреча на час. Забыл.</span></h2></div>
    <div class="reveal" style="--d:0.2s">
      <div class="problem-grid">
        <div class="problem-side"><div class="mono micro-label">На стороне инвестора</div><p class="problem-text">Под конкретную сумму никто ничего не считал. Сравнить не с чем. Показать партнёру нечего. Решение откладывается.</p></div>
        <div class="problem-side no-left-border"><div class="mono micro-label">На стороне проекта</div><p class="problem-text">Каждый инвестор требует отдельную встречу, отдельный расчёт, отдельное объяснение. Не масштабируется.</p></div>
      </div>
    </div>
    <div class="reveal" style="--d:0.3s"><div class="solution-block"><div class="mono micro-label" style="color:#00ff88">Решение</div><p class="solution-text">Интерактивный калькулятор. Инвестор сам двигает слайдеры, сам собирает портфель, сам видит как меняются цифры. Всё перед глазами. Работает 24/7. Заменяет первую встречу, презентацию, Excel-модель и менеджера на ранней стадии.</p></div></div>
  </div></section>

  <!-- ═══ ARCHITECTURE ═══ -->
  <section class="sec"><div class="container">
    <div class="reveal"><div class="mono sec-label" style="color:#00ff88">Как устроен</div></div>
    <div class="reveal" style="--d:0.1s"><h2 class="sec-title">Компонентная система</h2><p class="sec-sub">Модульная архитектура. Все параметры проекта — в одном месте. Логика расчётов отделена от интерфейса.</p></div>
    <div class="grid-auto-240">
      <div v-for="(m, i) in archModules" :key="i" class="reveal card-top" :style="{ '--d': i*0.03+'s', borderTopColor: m.color }">
        <div class="card-name">{{ m.name }}</div><div class="card-desc">{{ m.desc }}</div>
      </div>
    </div>
    <div class="reveal" style="--d:0.3s">
      <div class="flow-box">
        <div class="mono sec-label" style="color:#58a6ff;margin-bottom:20px">Поток данных</div>
        <div class="flow-row">
          <template v-for="(step, i) in flowSteps" :key="i">
            <div v-if="i > 0" class="flow-arrow">▸</div>
            <div class="flow-step" :style="{ background: step.color + '14', borderColor: step.color + '33' }">
              <div class="mono flow-label" :style="{ color: step.color }">{{ step.label }}</div><div class="flow-desc">{{ step.desc }}</div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div></section>

  <!-- ═══ RADAR ═══ -->
  <section class="sec"><div class="container">
    <div class="reveal"><div class="mono sec-label">Под капотом</div></div>
    <div class="reveal" style="--d:0.1s"><h2 class="sec-title">Анализ Радаром</h2><p class="sec-sub">Фирменная технология бизнес-аналитики Модуля Роста®. Из массива 300 000+ инвесторов выделены 4 стратегии.</p></div>
    <div class="grid-4"><div v-for="(r, i) in radarStats" :key="i" class="reveal card-top" :style="{ '--d': i*0.08+'s', borderTopColor: r.color }"><div class="mono" :style="{ fontSize:'clamp(22px,3vw,34px)', fontWeight:700, color:r.color, marginBottom:'6px' }">{{ r.val }}</div><div class="mono stat-label-sm">{{ r.label }}</div></div></div>
    <div class="grid-auto-300 reveal" style="--d:0.3s">
      <div v-for="(f, i) in formulas" :key="i" class="formula-card" :style="{ borderLeftColor: f.color }"><div class="mono micro-label" :style="{ color: f.color }">{{ f.label }}</div><div class="mono formula-text">{{ f.formula }}<br><span class="formula-note">{{ f.note }}</span></div></div>
    </div>
  </div></section>

  <!-- ═══ ASSETS ═══ -->
  <section class="sec"><div class="container">
    <div class="reveal"><div class="mono sec-label" style="color:#00ff88">Шесть классов активов</div></div>
    <div class="reveal" style="--d:0.1s"><h2 class="sec-title">Полная картина рынка</h2><p class="sec-sub">Не только основной актив. Вся картина рынка.</p></div>
    <div class="reveal asset-scroll" style="--d:0.2s">
      <div class="asset-table">
        <div class="asset-header"><span class="mono">Актив</span><span class="mono">Доходность</span><span class="mono">Риск</span><span class="mono">Тег</span><span></span></div>
        <div v-for="(a, i) in assets" :key="i" class="asset-row" :class="{ highlighted: a.hl }" :style="{ borderLeftColor: a.hl ? a.color : 'transparent' }">
          <div><span class="asset-name" :class="{ bold: a.hl }">{{ a.name }}</span><div class="asset-desc">{{ a.desc }}</div></div>
          <span class="mono" :style="{ fontSize:'13px', color: a.hl ? '#00ff88' : 'rgba(255,255,255,0.5)' }">{{ a.yld }}</span>
          <span class="mono" style="font-size:13px;color:rgba(255,255,255,0.4)">{{ a.risk }}</span>
          <span class="mono asset-tag" :style="{ color: a.color, borderColor: a.color + '33' }">{{ a.tag }}</span>
          <div class="risk-bar"><div :style="{ width: riskWidth(a.risk), background: a.color }" /></div>
        </div>
      </div>
    </div>
  </div></section>

  <!-- ═══ STRATEGIES ═══ -->
  <section class="sec"><div class="container">
    <div class="reveal"><div class="mono sec-label">Четыре стратегии</div></div>
    <div class="reveal" style="--d:0.1s"><h2 class="sec-title">Точка входа для любого инвестора</h2></div>
    <div class="grid-4">
      <div v-for="(s, i) in strategies" :key="i" class="reveal strat-card" :style="{ '--d': i*0.08+'s', borderTopColor: s.color }">
        <div v-if="s.max" class="mono max-badge">MAX</div>
        <div class="mono strat-name">{{ s.name }}</div>
        <div class="mono strat-target" :style="{ color: s.color }">{{ s.target }}</div>
        <div class="strat-bar"><span class="mono bar-label">ОСН</span><div class="bar-track"><div :style="{ width: s.optima+'%', background: s.color }" /></div><span class="mono bar-val" :style="{ color: s.color }">{{ s.optima }}%</span></div>
        <div class="strat-alloc">{{ s.alloc }}</div>
        <div class="mono strat-tip">{{ s.tooltip }}</div>
      </div>
    </div>
  </div></section>

  <!-- ═══ ADVISOR ═══ -->
  <section class="sec"><div class="container">
    <div class="reveal"><div class="mono sec-label" style="color:#58a6ff">Встроенный советник</div></div>
    <div class="reveal" style="--d:0.1s"><h2 class="sec-title">14 сценариев реакции</h2></div>
    <div class="advisor-table">
      <div class="advisor-header"><span class="mono">Условие</span><span class="mono">Комментарий</span><span class="mono" style="text-align:right">Тип</span></div>
      <div v-for="(r, i) in advisorRows" :key="i" class="reveal advisor-row" :style="{ '--d': i*0.02+'s' }">
        <div class="advisor-cond">{{ r.c }}</div><div class="advisor-text">{{ r.t }}</div><span class="mono advisor-type" :style="{ color: advisorTypeColor(r.type) }">{{ r.type }}</span>
      </div>
    </div>
  </div></section>

  <!-- ═══ 10 MECHANICS ═══ -->
  <section class="sec"><div class="container">
    <div class="reveal"><div class="mono sec-label" style="color:#00ff88">Система</div></div>
    <div class="reveal" style="--d:0.1s"><h2 class="sec-title big">10 механик</h2><p class="sec-sub">Каждая решает конкретную проблему на пути инвестора к решению.</p></div>
    <div class="mechanics-grid">
      <div v-for="m in mechanics" :key="m.num" class="reveal mechanic" :style="{ '--d': ((m.num-1)%2)*0.05+'s' }">
        <div class="mech-top-line" />
        <div class="mech-header"><span class="mono mech-num">{{ String(m.num).padStart(2, '0') }}</span><h3 class="mech-title">{{ m.title }}</h3></div>
        <div v-for="(b, bi) in [{ l:'Проблема', c:'#58a6ff', t:m.problem, tc:'rgba(255,255,255,0.45)' }, { l:'Решение', c:'#00ff88', t:m.solution, tc:'rgba(255,255,255,0.7)' }, { l:'Результат', c:'#ff8800', t:m.result, tc:'#ff8800' }]" :key="bi" :style="{ marginBottom: bi < 2 ? '10px' : 0 }">
          <span class="mono micro-label" :style="{ color: b.c }">{{ b.l }}</span><p class="mech-text" :style="{ color: b.tc, fontWeight: bi===2?500:400 }">{{ b.t }}</p>
        </div>
      </div>
    </div>
  </div></section>

  <!-- ═══ USER FLOW ═══ -->
  <section class="sec"><div class="container narrow">
    <div class="reveal"><div class="mono sec-label" style="color:#58a6ff">Путь пользователя</div></div>
    <div class="reveal" style="--d:0.1s"><h2 class="sec-title">7 шагов от входа до PDF</h2></div>
    <div v-for="(s, i) in userSteps" :key="i" class="reveal step-row" :style="{ '--d': i*0.05+'s' }">
      <div class="mono step-num" :style="{ borderColor: s.color, color: s.color }">{{ s.n }}</div>
      <div><h4 class="step-label">{{ s.label }}</h4><p class="step-desc">{{ s.desc }}</p></div>
    </div>
  </div></section>

  <!-- ═══ SCENARIOS ═══ -->
  <section class="sec"><div class="container">
    <div class="reveal"><div class="mono sec-label" style="color:#00ff88">Сценарии загрузки</div></div>
    <div class="reveal" style="--d:0.1s"><h2 class="sec-title">Даже дно — в плюсе</h2></div>
    <div class="grid-auto-280">
      <div v-for="(s, i) in scenarios" :key="i" class="reveal scenario-card" :style="{ '--d': i*0.08+'s', borderTopColor: s.color }">
        <div class="mono" :style="{ fontSize:'10px', letterSpacing:'3px', color:s.color, marginBottom:'8px' }">{{ s.label }}</div>
        <div style="display:flex;align-items:baseline;gap:6px;margin-bottom:6px"><span class="mono" :style="{ fontSize:'40px', fontWeight:700, color:s.color }">{{ s.roi }}</span><span style="font-size:12px;color:rgba(255,255,255,0.25)">годовых</span></div>
        <div style="display:flex;align-items:center;gap:6px;margin-bottom:12px"><span class="mono" style="font-size:10px;color:rgba(255,255,255,0.3)">Загрузка</span><div class="bar-track"><div :style="{ width:s.load+'%', background:s.color }" /></div><span class="mono bar-val" :style="{ color:s.color }">{{ s.load }}%</span></div>
        <div class="mono" style="font-size:10px;color:rgba(255,255,255,0.3);margin-bottom:3px">Прибыль: <span style="color:rgba(255,255,255,0.55)">{{ s.profit }}</span></div>
        <div class="mono" style="font-size:10px;color:rgba(255,255,255,0.3)">Выкуп: <span style="color:rgba(255,255,255,0.55)">{{ s.buyback }}</span></div>
      </div>
    </div>
    <div class="reveal" style="--d:0.3s">
      <div class="timeline"><div class="timeline-line" /><div class="timeline-row">
        <div v-for="(d, i) in timeline" :key="i" class="tl-item">
          <div class="mono tl-label" :class="{ active: d.active }">{{ d.label }}</div>
          <div class="tl-dot" :class="{ active: d.active }" /><div class="mono tl-date" :class="{ active: d.active }">{{ d.date }}</div><div class="tl-tip">{{ d.tip }}</div>
        </div>
      </div></div>
    </div>
    <div class="guarantee-grid">
      <div v-for="(g, i) in guarantees" :key="i" class="reveal guarantee-card" :style="{ '--d': i*0.04+'s' }">
        <div style="font-size:13px;font-weight:600;color:#fff;margin-bottom:4px">{{ g.title }}</div><div style="font-size:11px;color:rgba(255,255,255,0.35);line-height:1.45">{{ g.desc }}</div>
      </div>
    </div>
  </div></section>

  <!-- ═══ CASE ═══ -->
  <section class="sec"><div class="container">
    <div class="reveal"><div class="mono sec-label">Кейс</div></div>
    <div class="reveal" style="--d:0.1s"><h2 class="sec-title">Кейс Optima Space</h2><p class="sec-sub">Сервисные офисы класса А · Самара-Сити</p></div>
    <div class="case-metrics"><div v-for="(m, i) in caseMetrics" :key="i" class="reveal case-metric" :style="{ '--d': i*0.03+'s' }"><div class="mono" style="font-size:22px;font-weight:700;color:#fff">{{ m.val }}<span style="font-size:11px;color:rgba(255,255,255,0.35);margin-left:3px">{{ m.u }}</span></div><div class="mono" style="font-size:10px;color:rgba(255,255,255,0.35);margin-top:3px;letter-spacing:1px;text-transform:uppercase">{{ m.l }}</div></div></div>
    <div class="poc-grid">
      <div class="reveal" style="--d:0.3s"><div class="poc-card green"><div class="mono micro-label" style="color:#00ff88">Proof of Concept · Profit Rooms · с 2021</div><div class="poc-inner"><div v-for="(p, i) in poc" :key="i"><div class="mono" style="font-size:20px;font-weight:700;color:#00ff88">{{ p.v }}</div><div style="font-size:11px;color:rgba(255,255,255,0.35)">{{ p.l }}</div></div></div></div></div>
      <div class="reveal" style="--d:0.35s"><div class="poc-card orange"><div class="mono micro-label" style="color:#ff8800">Партнёр · ГК «Аник»</div><div class="poc-inner"><div v-for="(p, i) in anik" :key="i"><div class="mono" style="font-size:20px;font-weight:700;color:#ff8800">{{ p.v }}</div><div style="font-size:11px;color:rgba(255,255,255,0.35)">{{ p.l }}</div></div></div></div></div>
    </div>
  </div></section>

  <!-- ═══ SCALE ═══ -->
  <section class="sec"><div class="container">
    <div class="reveal"><div class="mono sec-label" style="color:#58a6ff">Масштабирование</div></div>
    <div class="reveal" style="--d:0.1s"><h2 class="sec-title">Любой инвестпроект. Те же 10 механик.</h2></div>
    <div class="grid-auto-200"><div v-for="(item, i) in scaleItems" :key="i" class="reveal scale-item" :style="{ '--d': i*0.04+'s' }">{{ item }}</div></div>
  </div></section>

  <!-- ═══ CTA ═══ -->
  <section class="sec" style="padding:80px 0 48px"><div class="container" style="text-align:center">
    <div class="reveal"><div class="mono sec-label">Актив</div></div>
    <div class="reveal" style="--d:0.1s"><h2 class="sec-title" style="text-align:center">Соберём такой же модуль<br><span style="color:#ff8800">под ваши цифры</span></h2></div>
    <div class="reveal cta-buttons" style="--d:0.2s">
      <a href="/book-my-launch" class="aktiv-btn-primary">Заявка</a>
      <a href="/launches" class="aktiv-btn-ghost">Запуски</a>
    </div>
  </div></section>

</div>
</template>

<style scoped>
.aktiv-landing { color: #fff; font-family: 'Inter', -apple-system, sans-serif; }
.mono { font-family: 'JetBrains Mono', monospace; }
.exo { font-family: 'Exo 2', sans-serif; }
.orbitron { font-family: 'Orbitron', sans-serif; }
.container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
.narrow { max-width: 900px; }
.dim { color: rgba(255,255,255,0.2); }

/* Reveal */
.reveal { opacity: 0; transform: translateY(32px); transition: opacity 0.7s var(--d, 0s) cubic-bezier(.16,1,.3,1), transform 0.7s var(--d, 0s) cubic-bezier(.16,1,.3,1); }
.reveal.revealed { opacity: 1; transform: translateY(0); }

/* Section */
.sec { padding: 64px 0; }
.sec-label { font-size: 11px; letter-spacing: 4px; color: #ff8800; margin-bottom: 20px; text-transform: uppercase; }
.sec-title { font-size: clamp(26px, 4vw, 46px); font-weight: 700; margin: 0 0 16px; letter-spacing: -0.02em; line-height: 1.15; }
.sec-title.big { font-size: clamp(32px, 5vw, 56px); font-weight: 800; letter-spacing: -0.03em; }
.sec-sub { font-size: 14px; color: rgba(255,255,255,0.4); line-height: 1.7; max-width: 700px; margin: 0 0 40px; }
.micro-label { font-size: 10px; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 10px; color: rgba(255,255,255,0.35); }
.stat-label-sm { font-size: 10px; color: rgba(255,255,255,0.35); text-transform: uppercase; letter-spacing: 1px; }

/* ═══ HERO ═══ */
.hero { min-height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; padding: 60px 24px; position: relative; }
.hero-glow { position: absolute; inset: 0; background: radial-gradient(ellipse at 50% 40%, rgba(255,136,0,0.04) 0%, transparent 60%); pointer-events: none; }
.hero-origami { width: clamp(160px, 30vw, 320px); height: clamp(160px, 30vw, 320px); margin-bottom: 24px; opacity: 0.9; }
.hero-aktiv-icon { width: clamp(200px, 50vw, 600px); height: auto; margin-bottom: 8px; }
.hero-sub { font-size: clamp(12px, 1.8vw, 18px); letter-spacing: 0.3em; text-transform: uppercase; color: #fff; margin-top: 24px; margin-bottom: 64px; opacity: 0.7; }

/* ═══ GLASS MORPHISM STAT TILES ═══ */
.glass-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1px; width: 100%; max-width: 960px; }

.glass-tile {
  position: relative; text-align: center; padding: 32px 16px; overflow: hidden;
  animation: glassAppear 0.8s ease both; cursor: default;
}

.glass-bg {
  position: absolute; inset: 0; z-index: 0;
  background: rgba(255,255,255,0.03);
  backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255,255,255,0.08);
}

.glass-shine {
  position: absolute; inset: 0; z-index: 1; pointer-events: none;
  background: linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 50%, rgba(255,255,255,0.02) 100%);
  opacity: 0; transition: opacity 0.6s;
}

.glass-tile:hover .glass-shine { opacity: 1; }

.glass-border {
  position: absolute; inset: 0; z-index: 1; pointer-events: none;
  border: 1px solid var(--accent);
  opacity: 0.15;
  transition: opacity 0.4s;
}

.glass-tile:hover .glass-border { opacity: 0.5; }

.glass-tile:hover {
  transform: translateY(-2px);
  transition: transform 0.3s ease;
}

.glass-tile::after {
  content: ''; position: absolute; bottom: 0; left: 50%; width: 40%; height: 1px;
  background: var(--accent); transform: translateX(-50%); opacity: 0.3;
  transition: width 0.5s cubic-bezier(.16,1,.3,1), opacity 0.5s;
}
.glass-tile:hover::after { width: 80%; opacity: 0.7; }

.glass-content { position: relative; z-index: 2; cursor: default; }
.glass-val { font-size: 36px; font-weight: 700; line-height: 1; cursor: default; }
.glass-label { font-family: 'Inter', -apple-system, sans-serif; font-size: 10px; letter-spacing: 1.5px; color: rgba(255,255,255,0.4); text-transform: uppercase; margin-top: 10px; white-space: nowrap; cursor: default; }

@keyframes glassAppear {
  from { opacity: 0; transform: translateY(20px) scale(0.95); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

/* Problem */
.problem-grid { display: grid; grid-template-columns: 1fr 1fr; margin-top: 40px; }
.problem-side { padding: 28px 24px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); }
.no-left-border { border-left: none; }
.problem-text { font-size: 14px; color: #fff; line-height: 1.65; margin: 0; }
.solution-block { padding: 28px 24px; background: rgba(0,255,136,0.04); border: 1px solid rgba(0,255,136,0.15); border-top: 2px solid #00ff88; margin-top: -1px; }
.solution-text { font-size: 14px; color: rgba(255,255,255,0.65); line-height: 1.65; margin: 0; }

/* Grids */
.grid-auto-240 { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 2px; margin-top: 40px; }
.grid-auto-300 { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2px; margin-top: 32px; }
.grid-auto-280 { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr)); gap: 2px; margin-top: 32px; }
.grid-auto-200 { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 200px), 1fr)); gap: 10px; margin-top: 32px; }
.grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 2px; margin-top: 32px; }

/* Cards */
.card-top { background: rgba(255,255,255,0.03); padding: 22px 20px; border-top: 2px solid; }
.card-name { font-size: 13px; font-weight: 600; color: #fff; margin-bottom: 6px; }
.card-desc { font-size: 12px; color: rgba(255,255,255,0.4); line-height: 1.5; }

/* Flow */
.flow-box { margin-top: 32px; padding: 28px 24px; background: rgba(88,166,255,0.04); border: 1px solid rgba(88,166,255,0.12); }
.flow-row { display: flex; align-items: stretch; justify-content: center; }
.flow-arrow { display: flex; align-items: center; padding: 0 16px; color: rgba(255,255,255,0.2); font-size: 18px; }
.flow-step { flex: 1; text-align: center; padding: 20px; border: 1px solid; min-width: 140px; }
.flow-label { font-size: 13px; font-weight: 600; margin-bottom: 4px; }
.flow-desc { font-size: 11px; color: rgba(255,255,255,0.35); }

/* Formulas */
.formula-card { background: rgba(255,255,255,0.03); padding: 24px 20px; border-left: 2px solid; }
.formula-text { font-size: 12px; color: rgba(255,255,255,0.6); line-height: 1.8; word-break: break-word; }
.formula-note { color: rgba(255,255,255,0.3); }

/* Assets */
.asset-scroll { overflow-x: auto; margin-top: 32px; }
.asset-table { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); min-width: 700px; }
.asset-header, .asset-row { display: grid; grid-template-columns: 2fr 1fr 1fr 0.6fr 1fr; padding: 10px 16px; align-items: center; }
.asset-header { border-bottom: 1px solid rgba(255,255,255,0.08); }
.asset-header span { font-size: 10px; letter-spacing: 2px; color: rgba(255,255,255,0.25); text-transform: uppercase; }
.asset-row { border-bottom: 1px solid rgba(255,255,255,0.04); border-left: 3px solid transparent; padding: 12px 16px; }
.asset-row.highlighted { background: rgba(0,217,192,0.05); }
.asset-name { font-size: 13px; color: rgba(255,255,255,0.65); }
.asset-name.bold { color: #fff; font-weight: 600; }
.asset-desc { font-size: 10px; color: rgba(255,255,255,0.3); margin-top: 1px; }
.asset-tag { font-size: 8px; border: 1px solid; padding: 2px 5px; letter-spacing: 1px; }
.risk-bar { height: 4px; background: rgba(255,255,255,0.06); overflow: hidden; }
.risk-bar div { height: 100%; }

/* Strategies */
.strat-card { background: rgba(255,255,255,0.03); padding: 28px 20px; position: relative; border-top: 2px solid; height: 100%; }
.max-badge { position: absolute; top: 8px; right: 8px; font-size: 8px; background: #ff8800; color: #0a0a0a; padding: 2px 6px; font-weight: 700; }
.strat-name { font-size: 10px; color: rgba(255,255,255,0.3); margin-bottom: 6px; letter-spacing: 1px; text-transform: uppercase; }
.strat-target { font-size: clamp(28px, 4vw, 38px); font-weight: 700; margin-bottom: 8px; }
.strat-bar { display: flex; align-items: center; gap: 6px; margin-bottom: 10px; }
.bar-label { font-size: 9px; color: rgba(255,255,255,0.2); }
.bar-track { flex: 1; height: 3px; background: rgba(255,255,255,0.06); overflow: hidden; }
.bar-track div { height: 100%; }
.bar-val { font-size: 11px; font-weight: 600; }
.strat-alloc { font-size: 10px; color: rgba(255,255,255,0.2); line-height: 1.5; }
.strat-tip { font-size: 9px; color: rgba(255,255,255,0.15); margin-top: 8px; }

/* Advisor */
.advisor-table { margin-top: 32px; }
.advisor-header, .advisor-row { display: grid; grid-template-columns: 1fr 1.2fr 80px; gap: 12px; padding: 10px 0; align-items: center; }
.advisor-header { border-bottom: 1px solid rgba(255,255,255,0.08); }
.advisor-header span { font-size: 10px; letter-spacing: 2px; color: rgba(255,255,255,0.25); text-transform: uppercase; }
.advisor-row { border-bottom: 1px solid rgba(255,255,255,0.04); padding: 12px 0; }
.advisor-cond { font-size: 12px; color: rgba(255,255,255,0.4); line-height: 1.4; }
.advisor-text { font-size: 13px; color: rgba(255,255,255,0.7); line-height: 1.4; }
.advisor-type { font-size: 10px; text-transform: uppercase; letter-spacing: 1px; text-align: right; }

/* Mechanics */
.mechanics-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 480px), 1fr)); gap: 10px; }
.mechanic { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); padding: 28px 24px; position: relative; overflow: hidden; transition: all 0.4s; }
.mechanic:hover { background: rgba(255,136,0,0.04); border-color: rgba(255,136,0,0.25); }
.mech-top-line { position: absolute; top: 0; left: 0; width: 0; height: 2px; background: #ff8800; transition: width 0.5s cubic-bezier(.16,1,.3,1); }
.mechanic:hover .mech-top-line { width: 100%; }
.mech-header { display: flex; align-items: baseline; gap: 12px; margin-bottom: 16px; }
.mech-num { font-size: 12px; color: #ff8800; opacity: 0.5; }
.mech-title { font-size: 17px; font-weight: 700; color: #fff; margin: 0; }
.mech-text { font-size: 13px; line-height: 1.6; margin: 4px 0 0; }

/* Steps */
.step-row { display: flex; gap: 16px; align-items: flex-start; padding: 18px 0; border-bottom: 1px solid rgba(255,255,255,0.04); }
.step-num { width: 40px; height: 40px; border: 1.5px solid; display: flex; align-items: center; justify-content: center; font-size: 12px; flex-shrink: 0; }
.step-label { margin: 0 0 3px; font-size: 15px; font-weight: 600; color: #fff; }
.step-desc { margin: 0; color: rgba(255,255,255,0.45); font-size: 13px; line-height: 1.45; }

/* Scenario */
.scenario-card { background: rgba(255,255,255,0.03); padding: 32px 20px; border-top: 3px solid; }

/* Timeline */
.timeline { margin-top: 48px; position: relative; }
.timeline-line { position: absolute; top: 38px; left: 50px; right: 50px; height: 1px; background: linear-gradient(90deg, #00ff88, rgba(255,255,255,0.08) 30%, rgba(255,255,255,0.08)); }
.timeline-row { display: flex; justify-content: space-between; gap: 8px; position: relative; }
.tl-item { flex: 1; text-align: center; position: relative; z-index: 1; }
.tl-label { font-size: 10px; color: rgba(255,255,255,0.3); margin-bottom: 6px; letter-spacing: 1px; text-transform: uppercase; }
.tl-label.active { color: #00ff88; }
.tl-dot { width: 12px; height: 12px; border-radius: 50%; border: 2px solid rgba(255,255,255,0.12); background: transparent; margin: 0 auto 6px; }
.tl-dot.active { border-color: #00ff88; background: #00ff88; box-shadow: 0 0 14px rgba(0,255,136,0.3); }
.tl-date { font-size: 12px; color: rgba(255,255,255,0.4); }
.tl-date.active { color: #fff; }
.tl-tip { font-size: 10px; color: rgba(255,255,255,0.2); margin-top: 3px; }

/* Guarantees */
.guarantee-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 2px; margin-top: 40px; }
.guarantee-card { background: rgba(255,255,255,0.03); padding: 20px 16px; border-top: 1px solid rgba(0,255,136,0.15); }

/* Case */
.case-metrics { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 2px; margin-top: 32px; }
.case-metric { background: rgba(255,255,255,0.05); padding: 22px 16px; }
.poc-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2px; margin-top: 12px; }
.poc-card { padding: 28px 24px; height: 100%; }
.poc-card.green { background: rgba(0,255,136,0.05); border: 1px solid rgba(0,255,136,0.15); }
.poc-card.orange { background: rgba(255,136,0,0.05); border: 1px solid rgba(255,136,0,0.15); }
.poc-inner { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 16px; }

/* Scale */
.scale-item { padding: 16px 20px; border: 1px solid rgba(255,255,255,0.06); background: rgba(255,255,255,0.03); font-size: 13px; color: rgba(255,255,255,0.55); }

/* Launches — override AktivLaunches internal spacing */
.launches-sec { padding-top: 48px !important; padding-bottom: 64px !important; }
.launches-wrap :deep(.mr-history-section) { padding: 0 !important; }

/* ═══ BUTTONS — override VitePress with high specificity ═══ */
.cta-buttons { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }

.aktiv-btn-primary,
.aktiv-landing .aktiv-btn-primary,
a.aktiv-btn-primary {
  display: inline-flex !important;
  padding: 14px 40px !important;
  background: #fff !important;
  color: #ff8800 !important;
  font-size: 13px !important;
  font-weight: 700 !important;
  font-family: 'JetBrains Mono', monospace !important;
  letter-spacing: 2px !important;
  text-transform: uppercase !important;
  text-decoration: none !important;
  border: none !important;
  border-radius: 0 !important;
  cursor: pointer !important;
  transition: all 0.3s ease !important;
  box-shadow: none !important;
}
.aktiv-btn-primary:hover,
a.aktiv-btn-primary:hover {
  background: #ff8800 !important;
  color: #fff !important;
  transform: translateY(-1px) !important;
  box-shadow: 0 4px 20px rgba(255,136,0,0.3) !important;
}

.aktiv-btn-ghost,
.aktiv-landing .aktiv-btn-ghost,
a.aktiv-btn-ghost {
  display: inline-flex !important;
  padding: 14px 32px !important;
  background: transparent !important;
  color: #ff8800 !important;
  font-size: 13px !important;
  font-family: 'JetBrains Mono', monospace !important;
  letter-spacing: 2px !important;
  text-transform: uppercase !important;
  text-decoration: none !important;
  border: 1px solid rgba(255,136,0,0.3) !important;
  border-radius: 0 !important;
  cursor: pointer !important;
  transition: all 0.3s ease !important;
  box-shadow: none !important;
}
.aktiv-btn-ghost:hover,
a.aktiv-btn-ghost:hover {
  border-color: #ff8800 !important;
  background: rgba(255,136,0,0.08) !important;
  color: #ff8800 !important;
  box-shadow: none !important;
}

/* ═══ MOBILE ═══ */
@media (max-width: 768px) {
  .problem-grid, .poc-grid { grid-template-columns: 1fr; }
  .no-left-border { border-left: 1px solid rgba(255,255,255,0.08); border-top: none; }
  .grid-4 { grid-template-columns: 1fr 1fr; }
  .glass-stats { grid-template-columns: 1fr 1fr; }
  .mechanics-grid { grid-template-columns: 1fr; }
  .advisor-header, .advisor-row { grid-template-columns: 1fr; gap: 4px; }
  .advisor-type { text-align: left; }
  .flow-row { flex-direction: column; align-items: center; }
  .flow-arrow { transform: rotate(90deg); padding: 8px 0; }
  .timeline-line { display: none; }
  .timeline-row { flex-direction: column; gap: 20px; }
  .tl-item { text-align: left; display: flex; gap: 16px; align-items: center; }
  .tl-dot { margin: 0; flex-shrink: 0; }
  .guarantee-grid { grid-template-columns: 1fr; }
  .case-metrics { grid-template-columns: 1fr 1fr; }
  .glass-val { font-size: 28px; }
  .glass-label { font-size: 8px; }
  .hero-origami { width: 120px; height: 120px; }
  .hero-aktiv-icon { width: 70vw; }
  .hero { padding: 60px 16px 40px; }
}
</style>
