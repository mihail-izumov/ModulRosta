# Готовы получить прозрачные процессы и точные цифры для решений?

Если вы прошли 5-дневную подготовку и готовы к системным изменениям, 
эта заявка — ваш следующий шаг на пути к системному росту.

### Прежде чем отправить заявку
Убедитесь, что вы знакомы с основными принципами нашего подхода: <br>
🔍 [Системная диагностика вместо локальных правок](/checkup/prep/03-system-diagnostics-vs-one-time-solutions) <br>
📊 [Анализ по 10 разделам бизнеса](/checkup/prep/06-10-diagnostic-sections) <br>
🤖 [ИИ-аналитика на основе RAG-модели](/checkup/prep/05-ai-analytics-rag-management) <br>

Если вы уже изучили эти материалы и готовы войти в процесс, заполните форму ниже.

## Заявка на бизнес-чекап

> В этом квартале осталось <Badge type="info" text="2 места" /> <br>
> <Badge type="info" text="1 компания" /> уже в листе ожидания на следующий период
<br>

<form id="myForm" class="custom-form">
  <!-- Основные поля для заявки -->
  <div class="form-group">
    <label for="name">Имя:</label>
    <input type="text" id="name" name="name" class="form-input" required>
  </div>
  
  <div class="form-group">
    <label for="phone">Телефон:</label>
    <input type="tel" id="phone" name="phone" class="form-input" required>
  </div>
  
  <div class="form-group">
    <label for="email">Email:</label>
    <input type="email" id="email" name="email" class="form-input" required>
  </div>

  <!-- Блок для профессиональной рекомендации -->
  <div class="recommendation-section">
    <h4>Профессиональная рекомендация</h4>
    <div class="form-group">
      <label for="friendContact">Telegram или телефон партнера:</label>
      <input type="text" id="friendContact" name="friendContact" class="form-input" placeholder="@username или +7 ___ ___-__-__">
    </div>
    <!-- Пояснение к программе рекомендаций (ПЕРЕМЕЩЕНО И СТИЛИЗОВАНО) -->
    <div class="form-hint">
      Если вы укажете контакт партнера, после оплаты вашей сессии мы от вашего имени порекомендуем ему анализ системой «Радар».
      <a href="/radar/invite" target="_blank" class="policy-link">Программа профессиональных рекомендаций</a>
    </div>
  </div>
  
  <!-- Согласие на обработку данных -->
  <div class="form-group checkbox-group">
    <input type="checkbox" id="consent" name="consent" required>
    <label for="consent">
      Нажимая на кнопку, вы соглашаетесь с 
      <a href="/terms/policy" target="_blank" class="policy-link">политикой конфиденциальности</a> и 
      <a href="/terms/privacy" target="_blank" class="policy-link">согласием на обработку персональных данных</a>.
    </label>
  </div>
  
  <!-- Кнопка отправки -->
  <button type="submit" class="submit-btn" disabled>
    Получить ответ →
  </button>
</form>

<!-- Сообщение об успешной отправке -->
<div id="successMessage" class="success-message" style="display: none;">
  Заявка успешно отправлена. Скоро свяжемся.
</div>

<style>
/* --- ОБЩИЕ СТИЛИ ФОРМЫ --- */
.custom-form { max-width: 500px; margin: 0; padding: 20px; background-color: #000000; border-radius: 5px; color: #ffffff; }
.form-group { margin-bottom: 15px; }
.form-input { width: 100%; padding: 10px; box-sizing: border-box; border: 1px solid #444; border-radius: 4px; font-size: 16px; background-color: #000000; color: #ffffff; }
.checkbox-group { display: flex; align-items: flex-start; gap: 8px; margin-bottom: 20px; }
.checkbox-group input { margin-top: 3px; width: auto; }
.checkbox-group label { font-size: 14px; line-height: 1.4; }
.policy-link { color: #4CAF50; text-decoration: underline; }

/* --- СТИЛИ КНОПКИ И СООБЩЕНИЙ --- */
.submit-btn { background-color: #ffffff; color: #000000; padding: 12px 20px; border: none; border-radius: 4px; cursor: pointer; font-size: 16px; width: 100%; font-weight: bold; transition: opacity 0.3s; }
.submit-btn:hover { opacity: 0.9; }
.submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.success-message { margin-top: 15px; color: white; font-weight: normal; font-size: 16px; display: flex; align-items: center; gap: 8px; }
.success-message::before { content: "✓"; color: white; font-size: 18px; }

/* --- СТИЛИ ДЛЯ БЛОКА РЕКОМЕНДАЦИЙ (ИЗМЕНЕНО) --- */
.recommendation-section {
  border-top: 1px solid #444;
  margin-top: 20px;
  /* Увеличены отступы сверху и снизу */
  padding-top: 30px; 
  padding-bottom: 30px;
}
.recommendation-section h4 {
  margin-top: 0;
  margin-bottom: 15px;
  color: #ffffff;
  font-weight: 500;
}

/* Увеличен отступ для метки поля */
.recommendation-section .form-group label {
  display: block;
  margin-bottom: 10px;
}

/* Стили для поясняющего текста (ИЗМЕНЕНО) */
.form-hint {
  color: #808080;
  /* Убран курсив, выравнивание по левому краю по умолчанию */
  font-style: normal;
  text-align: left;
  /* Уменьшен кегль */
  font-size: 0.8em; 
  line-height: 1.5;
  margin-top: 15px; /* Отступ от поля ввода сверху */
}
</style>

<script>
// JavaScript остается без изменений, так как правки касались только HTML и CSS.
// Он готов к работе.
export default {
  mounted() {
    this.initForm();
  },
  methods: {
    initForm() {
      // ... (Весь ваш JS код без изменений)
      if (typeof document === 'undefined') return;
      const form = document.getElementById('myForm');
      if (!form) return;
      const successMessage = document.getElementById('successMessage');
      const submitBtn = form.querySelector('.submit-btn');
      const requiredInputs = Array.from(form.querySelectorAll('input[required]'));
      const checkFormValidity = () => {
        const allRequiredFilled = requiredInputs.every(input => input.value.trim() !== '');
        submitBtn.disabled = !allRequiredFilled;
      };
      requiredInputs.forEach(input => {
        input.addEventListener('input', checkFormValidity);
      });
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (submitBtn.disabled) return;
        const friendContact = form.friendContact.value.trim();
        const formData = {
          name: form.name.value,
          phone: form.phone.value,
          email: form.email.value,
          _subject: `Новая заявка на сессию ${friendContact ? '(+ Рекомендация)' : ''}`,
          ...(friendContact && { recommendation_for: friendContact })
        };
        form.reset();
        successMessage.style.display = 'flex';
        submitBtn.disabled = true;
        fetch('https://formspree.io/f/mdkzjopz', {
          method: 'POST',
          headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        }).then(response => { if (!response.ok) throw new Error('Ошибка сервера');
        }).catch(error => { console.error('Ошибка:', error);
          const mailtoBody = `Имя: ${formData.name}\\nТелефон: ${formData.phone}\\nEmail: ${formData.email}${friendContact ? `\\nРекомендация для: ${friendContact}`:''}`;
          window.location.href = `mailto:theorchestramanco@gmail.com?subject=${encodeURIComponent(formData._subject)}&body=${encodeURIComponent(mailtoBody)}`;
        }).finally(() => { setTimeout(() => { successMessage.style.display = 'none'; checkFormValidity(); }, 15000); });
      });
      checkFormValidity();
    }
  }
}
</script>



_Звонки не принимаем. Только письменные заявки._

## Компании в фокусе

| Компания                                                 | Потенциал Роста | Статус               |
| -------------------------------------------------------- | --------------- | -------------------- |
| [Brooklyn Bowl](https://brooklynbowl.ru/)                | 75,4%           | Потенциал обнаружен |
| [Ресторан Честных Цен](https://rchc.ru/)                 | 81,5%           | В архиве [Почему?](/radar/overview#почему-в-архиве)   |
| [Vaffel](https://vaffel.ru/)                             | 56,2%           | В архиве [Почему?](/radar/overview#почему-в-архиве)   |
| [Re:Imagined Villas Ubud](https://reimaginedvillas.com/) | 52,1%           | В архиве [Почему?](/radar/overview#почему-в-архиве)   |

[Как работает Радар](/radar/overview) <br>

## Процесс подачи заявки

### Ключевые этапы
1. **Отправить заявку**
2. **Получить форму** и дать честные ответы
3. **Получить приглашение** на диагностическую сессию
4. **Диагностическая сессия** — 90 мин. интервью (₽35 000)
5. **Решение за 24 ч** — приглашаем на [чекап](/checkup/overview) или отказываем
6. **Договор** и старт через 48 ч

### Инвестиция
- От **365 000 ₽** за полный цикл анализа бизнеса
- **Индивидуальный** расчёт после диагностики
- **Гарантия**: [платите за движение](checkup/pay-as-you-go)
	- Если через 30 дней **хотя бы один** из трех пилотных проектов не запущен **по нашей вине**, мы продолжаем работать до выполнения **без дополнительной оплаты**

### Не готовы?
[Скачайте чек-лист готовности](/checkup/checklist) и вернитесь позже
<br><br>

## Глубокая бизнес-аналитика для компаний, готовых к серьёзным изменениям.
### Превращаем данные в конкурентные преимущества. Работаем только с 12 компаниями в год.

#### ❌ Мы работаем только с компаниями, которые готовы к глубокому системному изменению

1. **Хотите «быстрый результат»** <br>
Ищете готовые ответы за 1-2 недели – cерьёзная аналитика требует 2-3 месяцев глубокой работы
2. **Не готовы к полной прозрачности** <br>
Скрываете финансовые данные или ограничиваете доступ «из соображений конфиденциальности»
3. **Работаете без предоплаты** <br>
Не готовы вкладывать собственные средства в анализ своего бизнеса. Мы не работаем с теми, кто не верит в результат
4. **Ищете подтверждение готовых решений** <br>
У вас уже всё решено, нужен только «официальный отчёт». Мы даём честную обратную связь, даже если она неудобна <br>
5. **Не планируете внедрять рекомендации** <br>
«Аналитика ради аналитики» без бюджета и полномочий для изменений

> **Честная оценка готовности к трансформации:** 70% обратившихся компаний не проходят наш отбор.

#### ✅ Мы работаем с вами, если

1. **Готовы инвестировать в глубину** <br>
Осознаёте, что качественный анализ требует времени и ресурсов
2. **Имеете полномочия для изменений** <br>
Руководитель лично вовлечён, есть бюджет и власть для внедрения
3. **Готовы к честной обратной связи** <br>
Рассматриваете критику как инвестицию в рост, а не угрозу
4. **Мыслите долгосрочно** <br>
Видите аналитику как постоянный инструмент развития, а не разовую услугу

> **Наш уровень:** за 15 лет консалтинга наша методология выявила скрытый рост 30-50% прибыли у клиентов.

## Чек-лист самодиагностики: готовы ли вы к серьёзной аналитике?

### 📋 Организационные требования (выполнить за 48 ч)

- Назначить ответственного сотрудника с полными полномочиями
- Предоставить полный пакет финансовых, операционных и иных отчётов по состоянию на текущий момент, никаких новых отчётов и/или доступов в вашу систему
- Согласовать календарь интервью со всеми ключевыми сотрудниками
- Готовность к еженедельным 90 мин. сессиям с руководителями и владельцами бизнеса

### 💰 Финансовые гарантии

- 100% предоплата до старта
- Договор с ответственностью за задержки предоставления данных
- Бюджет на внедрение рекомендаций (обычно 300-500% от стоимости анализа)
- Готовность доплачивать за срочные запросы

### 🔄 Готовность к изменениям
- Согласие пересмотреть любые процессы с нашей аргументацией
- Готовность услышать неудобную правду
- Активное внедрение в течение 6 месяцев после согласования результатов чекапа
- Стратегия работы с сопротивлением команды

> **Если хотя бы 3 пункта вызывают трудности — мы не подходим друг другу.**

## Цена несерьёзного подхода

| Типичная ошибка              | Что происходит                               | Итог для бизнеса                                |
| :--------------------------- | :------------------------------------------- | :---------------------------------------------- |
| Информационный саботаж       | Не дают полных данных                        | Поверхностный анализ, ошибочные выводы          |
| Делегирование без полномочий | Проект поручают исполнителю без права решать | 3-6 мес потерь, деморализация команды           |
| Аналитический паралич        | Бесконечно «дособирают» информацию           | Пока вы анализируете, рынок забирают конкуренты |
| Бюджетная близорукость       | Нет средств на внедрение                     | Презентации пылятся, прибыль не растёт          |

> **Упущенная прибыль** от неэффективной аналитики превышает её цену в 10-50 раз.
> Ваши конкуренты уже используют аналитику — вопрос лишь, как быстро вы догоните.

## Наш процесс: жёсткие стандарты качества

### 🔍 Этап 1. Диагностика готовности (5 рабочих дней)

**Ваши обязательства**
- Данные за 48 ч
- Интервью со всеми ключевыми сотрудниками
- 100% предоплата
- Единый ответственный

**Результат:** решение *GO / NO-GO*. При нашем отказе — возврат средств.

### 📊 Этап 2. Глубокий анализ (15 рабочих дней)

**Контрольные точки каждые 3 дня**
- Дополнительные данные — 24 ч
- Совместная валидация выводов
- Корректировка фокуса
- Еженедельные встречи

**Результат:** полная карта бизнеса, 10 точек роста, которые дают максимальный эффект за 30 дней.
### Этап 3. Стратегические рекомендации (5 рабочих дней)

**Финальные требования**
- Личная презентация владельцу
- Утверждение плана и бюджета за 48 ч
- Подписание соглашения о трекинге
- Старт внедрения ≤ 2 недели

**Результат:** план трансформации, гарантирующий рост показателей по DMAIC.
### ⚠️ Жёсткие правила игры
1. Немедленное прекращение работ при нарушении условий
2. Отказ без компенсаций при саботаже
3. Личная ответственность владельца бизнеса

<br>

# Почему нам доверяют сильные компании

## Хорошо = Хорошо, Плохо = Плохо, Не плохо ≠ Хорошо 

- **70%** обращений отсекаются на этапе диагностики
- **12** максимум проектов в год — глубокая работа с каждым
- **100%** успешных кейсов среди прошедших отбор
- **45%** средний рост прибыли за первый год после внедрения

## Важное уточнение для вашей успешной заявки

Если вы дочитали до этого момента и всё ещё сомневаетесь — мы не подходим друг другу.
Серьёзная аналитика — это партнёрство, а не услуга.

| Решение | Действие |
| :-- | :-- |
| **ДА** | [Заполняйте заявку](/apply#заявка-на-бизнес-чекап) |
| **НЕТ** | [Изучить методологию подробнее](/checkup/overview) |
| **НЕ ЗНАЮ** | [Возвращайтесь](/checkup/checklist), когда будете готовы |

## Контакты для серьёзных заявок

<div class="specs-button">
  <a href="/apply#заявка-на-бизнес-чекап">Получить ответ →</a>
</div>

<style>
.specs-button a {
  display: inline-block;
  padding: 8px 16px;
  background-color: #42b983;
  color: white !important;
  text-decoration: none !important;
  border-radius: 4px;
  font-family: inherit;
  border: none;
  cursor: pointer;
  transition: background 0.2s;
  /* Новые важные свойства */
  -webkit-user-select: none;
  user-select: none;
  line-height: 1.5;
}

.specs-button a:hover {
  background-color: #33a06f;
  transform: translateY(-1px); /* Эффект нажатия */
}
</style>

> После получения заявки – отправим форму подтверждения.
> Звонки не принимаем. Только письменные заявки с развёрнутыми ответами.

### Ещё не готовы к заявке?
- [Вернуться к 5-дневной подготовке](/checkup/prep/overview)
- [Проверить готовность по чек-листу](/checkup/checklist)
