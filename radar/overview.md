# Радар

### Все забыли, что такое настоящий рост.

Они измеряют рейтинг на 2ГИС и Яндекс. <br>
Мы находим в обратной связи клиентов то, что не видят другие. <br><br>
**Радар показывает не размер бизнеса сегодня, а возможности, которые он может реализовать завтра.**

## В фокусе Радара

<style>
  /*
    Магия адаптивности:
    Мы используем переменные VitePress (--vp-c-...),
    которые автоматически меняют цвет для темной и светлой тем.
    Это гарантирует, что текст всегда будет читаемым.
  */
  .radar-table-container {
    width: 100%;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
  
  .radar-table-html {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    table-layout: fixed;
  }
  
  .radar-table-html th, .radar-table-html td {
    padding: 12px 15px;
    border-bottom: 1px solid var(--vp-c-divider);
  }
  
  .radar-table-html th {
    text-transform: uppercase;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.5px;
    color: var(--vp-c-text-2);
  }
  
  .radar-table-html th a {
    color: inherit;
    text-decoration: none;
    border-bottom: 1px dotted var(--vp-c-text-3);
  }
  
  .radar-table-html th a:hover {
    color: var(--vp-c-text-1);
    border-bottom-color: var(--vp-c-text-1);
  }
  
  .radar-table-html th:nth-child(2), .radar-table-html td:nth-child(2),
  .radar-table-html th:nth-child(3), .radar-table-html td:nth-child(3) {
    text-align: center;
  }
  
  /* Оптимизированная ширина столбцов для десктопа */
  .radar-table-html th:nth-child(1), .radar-table-html td:nth-child(1) { width: 13%; } /* Компания */
  .radar-table-html th:nth-child(2), .radar-table-html td:nth-child(2) { width: 7%; }  /* Потенциал */
  .radar-table-html th:nth-child(3), .radar-table-html td:nth-child(3) { width: 10%; } /* Сигнал */
  .radar-table-html th:nth-child(4), .radar-table-html td:nth-child(4) { width: 40%; } /* Поиск */
  .radar-table-html th:nth-child(5), .radar-table-html td:nth-child(5) { width: 22%; } /* Цели */
  .radar-table-html th:nth-child(6), .radar-table-html td:nth-child(6) { width: 8%; }  /* Статус */
  
  /* Запрет переноса для столбцов Сигнал и Статус */
  .radar-table-html th:nth-child(3), .radar-table-html td:nth-child(3),
  .radar-table-html th:nth-child(6), .radar-table-html td:nth-child(6) {
    white-space: nowrap;
  }
  
  .signal-active-symbol {
    color: #fde047;
  }
  
  .signal-passive-symbol {
    color: #6b7280;
    font-weight: bold;
  }
  
  .highlight-signal-cell {
     background-color: rgba(74, 58, 6, 0.3);
  }
  
  /* Адаптивность для планшетов - добавляем горизонтальную прокрутку */
  @media (max-width: 1024px) {
    .radar-table-html {
      min-width: 800px;
    }
    
    .radar-table-html th, .radar-table-html td {
      padding: 10px 12px;
      font-size: 14px;
    }
  }
  
  /* Адаптивность для мобильных */
  @media (max-width: 768px) {
    .radar-table-html {
      min-width: 700px;
      font-size: 13px;
    }
    
    .radar-table-html th, .radar-table-html td {
      padding: 8px 10px;
    }
    
    .radar-table-html th {
      font-size: 11px;
    }
  }
  
  /* Для очень узких экранов */
  @media (max-width: 480px) {
    .radar-table-html {
      min-width: 600px;
      font-size: 12px;
    }
    
    .radar-table-html th, .radar-table-html td {
      padding: 6px 8px;
    }
    
    .radar-table-html th {
      font-size: 10px;
    }
  }
</style>

<div class="radar-table-container">
  <table class="radar-table-html">
    <thead>
      <tr>
        <th>Компания</th>
        <th><a href="/radar/overview.html#как-мы-находим-компании-со-скрытым-потенциалом">Потенциал</a></th>
        <th><a href="/radar/overview.html#что-такое-«сигнал-радара»">Сигнал</a></th>
        <th>Поиск</th>
        <th>Цели</th>
        <th><a href="/radar/overview.html#почему-в-архиве">Статус</a></th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><a href="https://grnhs.ru/" target="_blank" rel="noopener noreferrer">Green House</a></td>
        <td>~126+</td>
        <td class="highlight-signal-cell"><span class="signal-active-symbol">⚡</span> <a href="/radar/signal/coffee-points-nsk-2025/launch">BREW</a></td>
        <td>Региональное доминирование и риски экспансии</td>
        <td>Формула успеха, Ключевые элементы, Адаптация</td>
        <td>В фокусе</td>
      </tr>
      <tr>
        <td><a href="https://korzhcoffee.ru/" target="_blank" rel="noopener noreferrer">Корж</a></td>
        <td>~10+</td>
        <td class="highlight-signal-cell"><span class="signal-active-symbol">⚡</span> <a href="/radar/signal/coffee-points-smr-2025/dashboard">BREW</a></td>
        <td>Масштабировать уют без потери магии бренда</td>
        <td>Создать культ бренда, Доминировать по цене</td>
        <td>В фокусе</td>
      </tr>
      <tr>
        <td><a href="https://skuratovcoffee.ru/" target="_blank" rel="noopener noreferrer">Skuratov Coffee</a></td>
        <td>~63+</td>
        <td class="highlight-signal-cell"><span class="signal-active-symbol">⚡</span> <a href="/radar/signal/coffee-points-smr-2025/dashboard">BREW</a></td>
        <td>Формула «скорости» и пределы роста для «качества»</td>
        <td>Формула успеха, Рост без потерь</td>
        <td>В фокусе</td>
      </tr>
      <tr>
        <td><a href="https://www.surfcoffee.ru/" target="_blank" rel="noopener noreferrer">Surf Coffee</a></td>
        <td>~110+</td>
        <td class="highlight-signal-cell"><span class="signal-active-symbol">⚡</span> <a href="/radar/signal/coffee-points-smr-2025/dashboard">BREW</a></td>
        <td>Масштабирование на формуле «атмосферы»</td>
        <td>Ядро бренда, Рост без потерь</td>
        <td>В фокусе</td>
      </tr>
      <tr>
        <td>Cofix</td>
        <td>~290+</td>
        <td><span class="signal-passive-symbol">·</span></td>
        <td>Формула прибыли при фиксированной цене в разных локациях</td>
        <td>Выбор локации, Трафик, Прибыль точки</td>
        <td>В фокусе</td>
      </tr>
      <tr>
        <td>Дринкит</td>
        <td>~65+</td>
        <td><span class="signal-passive-symbol">·</span></td>
        <td>Пределы IT-автоматизации и эмоциональная связь с клиентом</td>
        <td>Поведение гостей, Сценарии, Сбои системы</td>
        <td>В фокусе</td>
      </tr>
      <tr>
        <td>Do.bro Coffee</td>
        <td>~236+</td>
        <td><span class="signal-passive-symbol">·</span></td>
        <td>Баланс между скоростью роста и устойчивостью системы</td>
        <td>Скорость роста, Точность операций, Стабильность</td>
        <td>В фокусе</td>
      </tr>
      <tr>
        <td>Stars Coffee</td>
        <td>~110+</td>
        <td><span class="signal-passive-symbol">·</span></td>
        <td>Поиск своего лица и выход из тени унаследованного бренда</td>
        <td>Поиск идентичности, Продукты, Реакция рынка</td>
        <td>В фокусе</td>
      </tr>
      <tr>
        <td>ДаблБи</td>
        <td>~66+</td>
        <td><span class="signal-passive-symbol">·</span></td>
        <td>Ключевые детали сервиса, создающие премиум-опыт</td>
        <td>Ключевые детали, Влияние мелочей, Карта сервиса</td>
        <td>В фокусе</td>
      </tr>
      <tr>
        <td>ДаблБи Express</td>
        <td>~70+</td>
        <td><span class="signal-passive-symbol">·</span></td>
        <td>Баланс скорости и качества в экспресс-формате</td>
        <td>Скорость, Стабильность, Качество опыта</td>
        <td>В фокусе</td>
      </tr>
      <tr>
        <td>Jeffrey's Coffeeshop</td>
        <td>~28+</td>
        <td><span class="signal-passive-symbol">·</span></td>
        <td>Как расти, оставаясь "своим" и не теряя уникальности</td>
        <td>Новая аудитория, Ценности, Расширение круга</td>
        <td>В фокусе</td>
      </tr>
    </tbody>
  </table>
</div>

## Как работает

Каждый день вы принимаете десятки решений: какой продукт предложить, как обучить персонал, куда вложить деньги, почему клиенты не возвращаются. При этом опираетесь на собственные ощущения, мнения сотрудников или советы знакомых. 

Но ваши клиенты уже знают ответы на все вопросы. Они каждый день оставляют сотни честных отзывов и обратную связь о вас и ваших конкурентах. 

**Радар превращает этот хаос мнений в четкую карту действий для роста выручки Вашего бизнеса.**

<RadarHowItWorks />

## Как мы находим компании со скрытым потенциалом
Наш Радар — это не стандартный бизнес-анализ. Это проприетарная система оценки, созданная для поиска компаний, чей потенциал значительно превышает их текущие результаты. Мы не ищем «проблемные» бизнесы. Мы ищем «спящих гигантов».

Индекс рассчитывается на основе взвешенного анализа четырех ключевых областей по десяткам публичных и косвенных признаков. Наш алгоритм анализирует не столько сами факты, сколько разрывы, противоречия и резонансы между ними.

[Критерии для расчёта Индекса](/radar/scale_index)

## Персональный расчет вашего Индекса

Радар видит потенциал компании по тысячам внешних сигналов. Но точный Индекс Роста, на основе которого вы сможете принимать решения, требует глубокой диагностики — синхронизации рыночных данных с вашими внутренними процессами.

Эту задачу решает Чекап. Это единственный инструмент, который превращает внешнюю оценку в вашу персональную карту роста.

[Как пройти Чекап и получить свой Индекс](/checkup/overview)

## Что такое Сигнал Радара
Это не отчет с советами, а объективный анализ рыночного позиционирования. Технология «Радара» превращает тысячи отзывов клиентов в четкую карту фактов.

Анализ определяет истинных конкурентов, выделяет 10 ключевых критериев, по которым клиенты принимают решение, и создает честную сравнительную таблицу, показывающую реальные сильные и слабые стороны бизнеса.

[Как это работает: полная методология](/radar/signal/how-it-works)

## Анна

ИИ-аналитик «Анна» – это ядро системы «Радар». Анна непрерывно анализирует сотни компаний на предмет скрытого потенциала роста. 

Анна сканирует публичное поле компаний, находит структурные разрывы и точки роста, и далее связывает с командой Модуля Роста®.

[Кто Анна](/radar/who-is-anna)


## В архиве

<table class="radar-table-html">
  <thead>
    <tr>
      <th>Компания</th>
      <th><a href="/radar/overview.html#как-мы-находим-компании-со-скрытым-потенциалом">Потенциал</a></th>
      <th><a href="/radar/overview.html#что-такое-«сигнал-радара»">Сигнал</a></th>
      <th><a href="/radar/overview.html#почему-в-архиве">Статус</a></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><a href="https://rchc.ru/" target="_blank" rel="noopener noreferrer">Ресторан Честных Цен</a></td>
      <td>81,5%</td>
      <td><span class="signal-passive-symbol">·</span></td>
      <td>В архиве <a href="/radar/overview.html#почему-в-архиве">(Почему?)</a></td>
    </tr>
    <tr>
      <td><a href="https://brooklynbowl.ru/" target="_blank" rel="noopener noreferrer">Brooklyn Bowl</a></td>
      <td>75,6%</td>
      <td><span class="signal-passive-symbol">·</span></td>
      <td>В архиве <a href="/radar/overview.html#почему-в-архиве">(Почему?)</a></td>
    </tr>
    <tr>
      <td><a href="https://vaffel.ru/" target="_blank" rel="noopener noreferrer">Vaffel</a></td>
      <td>56,2%</td>
      <td><span class="signal-passive-symbol">·</span></td>
      <td>В архиве <a href="/radar/overview.html#почему-в-архиве">(Почему?)</a></td>
    </tr>
    <tr>
      <td><a href="https://reimaginedvillas.com/" target="_blank" rel="noopener noreferrer">Re:Imagined Villas Ubud</a></td>
      <td>52,1%</td>
      <td><span class="signal-passive-symbol">·</span></td>
      <td>В архиве <a href="/radar/overview.html#почему-в-архиве">(Почему?)</a></td>
    </tr>
  </tbody>
</table>

### Почему в архиве

Статус "В архиве" означает, что потенциал роста компании подтвержден, но готовность к изменениям не определена.

Наша философия требует от нас начинать работу только в тех случаях, где мы видим потенциал для кратного роста. По нашей оценке, таким критериям соответствует не более 30% компаний, попадающих в фокус нашего “Радара”.

[Фильтр Потенциала: Почему мы говорим “нет”](/radar/filter)
