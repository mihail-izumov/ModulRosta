# Сигнал Радара

Отслеживайте любую компанию, которая попала в фокус Радара: конкурентов, инвестпроекты и свою компанию. Проверяйте гипотезы, следите за трендами и находите то, что другие упускают прямо на ходу. <br>

Когда угодно. С кем угодно.

## Лог Сигналов

<div class="radar-signals-table">

| Период | Сигнал Радара | Статус |
| :--- | :--- | :--- |
| **Сейчас** | [Рынок кофеен (Самара) // фокус на «Корж»](/radar/signal/coffee-points-smr-2025/dashboard) | ⚡️ Демо-версия |
| **Август 2025** | [Рынок кофеен (Новосибирск) // Green House vs Skuratov](/radar/signal/coffee-points-nsk-2025/launch) | 📦 Финальная сборка |
| **Август 2025** | Москва | 🔎 Работает Радар |
| **Сентябрь 2025**| Санкт-Петербург, Сочи | 🎯 Захват целей |
| **Октябрь 2025** | Казань, Екатеринбург, Краснодар | 🎯 Захват целей |

</div>

<div class="start-button-container">
  <a href="/radar/overview" class="btn btn-primary"  rel="noopener noreferrer">Компании в фокусе</a>
</div>

## Что такое «Сигнал Радара»
Это не отчет с советами, а объективный анализ рыночного позиционирования. Технология «Радара» превращает тысячи отзывов клиентов в четкую карту фактов.

Анализ определяет истинных конкурентов, выделяет 10 ключевых критериев, по которым клиенты принимают решение, и создает честную сравнительную таблицу, показывающую реальные сильные и слабые стороны бизнеса.

[Как это работает: полная методология](/radar/signal/how-it-works)

## Анна

ИИ-аналитик «Анна» – это ядро системы «Радар». Анна непрерывно анализирует сотни компаний на предмет скрытого потенциала роста. 

Анна сканирует публичное поле компаний, находит структурные разрывы и точки роста, и далее связывает с командой Модуля Роста®.

[Кто Анна](/radar/who-is-anna)

<style>
/* --- СТИЛИ ДЛЯ ТАБЛИЦ --- */

/* Контейнер таблицы оборачиваем для скролла */
.radar-signals-table {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

/* Общие правила для таблицы "Сигналы Радара" */
.radar-signals-table table {
  width: 100%;
  /* Минимальная ширина гарантирует, что таблица не сожмется и появится скролл на мобильных */
  min-width: 650px; 
  table-layout: fixed;
  border-collapse: collapse;
}

/* Стили для ячеек для аккуратного вида */
.radar-signals-table th,
.radar-signals-table td {
  padding: 12px 15px;
  vertical-align: top; /* Выравнивание по верху — лучший вариант при разной высоте строк */
  text-align: left;
}

/* Столбец 1 ("Период"): Фиксированная ширина, без переноса */
.radar-signals-table td:nth-child(1) {
  width: 130px;
  white-space: nowrap;
}

/* Столбец 2 ("Сигнал Радара"): ГЛАВНОЕ ИЗМЕНЕНИЕ. 
   Убираем сложное ограничение по строкам и просто разрешаем тексту свободно переноситься. */
.radar-signals-table td:nth-child(2) {
  width: 350px;
  white-space: normal; /* Разрешаем перенос текста */
  word-break: break-word; /* Разрешаем перенос для длинных слов */
}

/* Столбец 3 ("Статус"): Фиксированная ширина, без переноса */
.radar-signals-table td:nth-child(3) {
  width: 170px;
  white-space: nowrap;
}

/* Таблица сравнения "ДО/ПОСЛЕ" (остается без изменений) */
.comparison-table table {
  table-layout: fixed;
  width: 100%;
}
.comparison-table td {
  width: 50%;
  word-break: break-word;
}

/* --- ОБЩИЕ СТИЛИ ДЛЯ ВСЕХ КНОПОК (остаются без изменений) --- */
.btn {
  display: inline-block;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 700;
  font-size: 16px;
  text-align: center;
  text-decoration: none;
  transition: all 0.3s ease;
  cursor: pointer;
  border: none;
  margin: 10px 0;
}

.btn:hover {
  transform: translateY(-2px);
  text-decoration: none !important;
}

/* --- СТИЛЬ 1: ОСНОВНАЯ КНОПКА (ЯРКАЯ) --- */
.btn-primary {
  background-color: #C5F946; /* Яркий лаймовый */
  color: #000 !important;
}

.btn-primary:hover {
  background-color: #347b6c; /* Темный при наведении */
  color: white !important;
}

/* --- СТИЛЬ 2: ВТОРОСТЕПЕННАЯ КНОПКА (ТЕМНАЯ) --- */
.btn-secondary {
  background-color: #347b6c; /* Темный */
  color: white !important;
}

.btn-secondary:hover {
  background-color: #C5F946; /* Яркий при наведении */
  color: #000 !important;
}

/* --- Контейнер для отдельной кнопки --- */
.start-button-container {
  margin: 20px 0;
  text-align: left;
}

.start-button-container .btn {
  display: inline-block;
  margin: 0;
}
</style>

<style>
/* --- ОБЩИЕ СТИЛИ ДЛЯ ВСЕХ КНОПОК --- */
.btn {
  display: inline-block;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 700;
  font-size: 16px;
  text-align: center;
  text-decoration: none;
  transition: all 0.3s ease;
  cursor: pointer;
  border: none;
  margin: 10px 0;
}

.btn:hover {
  transform: translateY(-2px);
  text-decoration: none !important;
}

/* --- СТИЛЬ ОСНОВНОЙ КНОПКИ (ЯРКАЯ) --- */
.btn-primary {
  background-color: #C5F946; /* Яркий лаймовый */
  color: #000 !important;
}

.btn-primary:hover {
  background-color: #347b6c; /* Темный при наведении */
  color: white !important;
}

/* --- Контейнер для отдельной кнопки --- */
.start-button-container {
  margin: 20px 0;
  text-align: left;
}

.start-button-container .btn {
  display: inline-block;
  margin: 0;
}
</style>
