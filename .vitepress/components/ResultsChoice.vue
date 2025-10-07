<template>
  <div class="signal-demo-wrapper">
    <!-- Переключатель секций -->
    <div class="signal-demo__header">
      <div class="signal-demo__breadcrumbs" role="tablist">
        <button
          v-for="section in sections"
          :key="section.id"
          class="signal-breadcrumb"
          :class="[section.id, isActive(section.id) ? 'is-active' : '']"
          @click="selectedSection = section.id"
        >
          <div class="signal-breadcrumb-circle"></div>
        </button>
      </div>
    </div>

    <!-- Кнопка информации и переключатель пола -->
    <div class="signal-controls-row">
      <button 
        class="signal-info-button"
        :class="{ 
          'signal-info-female': selectedGender === 'female',
          'signal-info-male': selectedGender === 'male'
        }"
        @click="showInfoModal = true"
      >
        Как работает
      </button>
      <div class="signal-gender-switch">
        <div class="signal-gender-container">
          <div 
            class="signal-gender-btn signal-gender-female"
            :class="{ 'is-active': selectedGender === 'female' }"
            @click="onGenderClick('female')"
          ></div>
          <div 
            class="signal-gender-btn signal-gender-male"
            :class="{ 'is-active': selectedGender === 'male' }"
            @click="onGenderClick('male')"
          ></div>
        </div>
      </div>
    </div>

    <!-- Модальное окно -->
    <div v-if="showInfoModal" class="modal-overlay" @click.self="showInfoModal = false">
      <div class="modal">
        <div class="modal-title">Ваши отзывы меняют всё.</div>
        <div class="modal-body">
          Каждый отзыв делает любимую кофейню еще лучше, а Сигнал помогает решить Вашу проблему за 24 часа. Почувствуйте силу настоящих перемен.<br><br>
          <a href="https://cffx.ru/signals.html" target="_blank" class="modal-link no-double-underline">Как Работает Сигнал</a>
        </div>
        <div class="modal-footer">
          <button class="modal-ok" @click="showInfoModal = false">Понятно</button>
        </div>
      </div>
    </div>

    <!-- Контейнер с формой -->
    <div class="signal-demo__form-container">

      <!-- Секция 2: Эмоции -->
      <div v-if="selectedSection === 'emotions'" class="signal-form-section">
        <div class="signal-question-block" style="--accent-color: #6f5d9f;">
          <div class="signal-rotating-phrase-container signal-rotating-fixed-height">
            <transition name="fade" mode="out-in">
              <p :key="currentQuestion1" class="signal-question-label">{{ currentQuestion1 }}</p>
            </transition>
          </div>
          <textarea 
            v-model="form.emotionalRelease" 
            @focus="startRotation(1)" 
            :rows="isMobile ? 5 : 3"
            :placeholder="selectedGender === 'female' ? 'Или напишите своими словами...' : 'Или напишите своими словами...'"
          ></textarea>
          <div class="signal-suggestions-container">
            <div 
              v-for="suggestion in currentSuggestions.emotions" 
              :key="suggestion"
              class="signal-suggestion-bubble signal-emotion-bubble"
              @click="selectSuggestion('emotionalRelease', suggestion, 'emotions')"
            >
              {{ suggestion }}
            </div>
            <div 
              v-if="!isInitialSuggestions('emotions')"
              class="signal-suggestion-bubble signal-reset-bubble signal-emotion-bubble"
              @click="resetSuggestions('emotions')"
            >
              ← Ещё варианты
            </div>
          </div>
        </div>
      </div>

      <!-- Секция 3: Факты -->
      <div v-if="selectedSection === 'facts'" class="signal-form-section">
        <div class="signal-question-block" style="--accent-color: #3a8862;">
          <div class="signal-rotating-phrase-container signal-rotating-fixed-height">
            <transition name="fade" mode="out-in">
              <p :key="currentQuestion2" class="signal-question-label">{{ currentQuestion2 }}</p>
            </transition>
          </div>
          <textarea 
            v-model="form.factualAnalysis" 
            @focus="startRotation(2)" 
            :rows="isMobile ? 5 : 3"
            placeholder="Несколько фактов: что и когда случилось..."
          ></textarea>
          <div class="signal-suggestions-container">
            <div 
              v-for="suggestion in currentSuggestions.facts" 
              :key="suggestion"
              class="signal-suggestion-bubble signal-fact-bubble"
              @click="selectSuggestion('factualAnalysis', suggestion, 'facts')"
            >
              {{ suggestion }}
            </div>
            <div 
              v-if="!isInitialSuggestions('facts')"
              class="signal-suggestion-bubble signal-reset-bubble signal-fact-bubble"
              @click="resetSuggestions('facts')"
            >
              ← Ещё варианты
            </div>
          </div>
        </div>
      </div>

      <!-- Секция 4: Решение -->
      <div v-if="selectedSection === 'solutions'" class="signal-form-section">
        <div class="signal-question-block" style="--accent-color: #4A90E2;">
          <div class="signal-rotating-phrase-container signal-rotating-fixed-height">
            <transition name="fade" mode="out-in">
              <p :key="currentQuestion3" class="signal-question-label">{{ currentQuestion3 }}</p>
            </transition>
          </div>
          <textarea 
            v-model="form.constructiveSuggestions" 
            @focus="startRotation(3)" 
            :rows="isMobile ? 5 : 3"
            placeholder="Можно пропустить, но это самое интересное ..."
          ></textarea>
          <div class="signal-suggestions-container">
            <div 
              v-for="suggestion in currentSuggestions.solutions" 
              :key="suggestion"
              class="signal-suggestion-bubble signal-solution-bubble"
              @click="selectSuggestion('constructiveSuggestions', suggestion, 'solutions')"
            >
              {{ suggestion }}
            </div>
            <div 
              v-if="!isInitialSuggestions('solutions')"
              class="signal-suggestion-bubble signal-reset-bubble signal-solution-bubble"
              @click="resetSuggestions('solutions')"
            >
              ← Ещё варианты
            </div>
          </div>
        </div>
      </div>

      <!-- Секция 5: Итого -->
      <div v-if="selectedSection === 'summary'" class="signal-form-section">
        <div class="signal-question-block" style="--accent-color: #FFB800;">
          <p class="signal-direction-label">Ваш Сигнал</p>
          <div class="signal-rotating-phrase-container">
            <p class="signal-question-label">Что должно измениться?</p>
          </div>
        <textarea 
          v-model="form.summaryText" 
          :rows="isMobile ? 8 : 6"
          placeholder="Перемены начинаются здесь ..."
        ></textarea>
          <p class="signal-example-hint signal-example-hint-white">Команда к действию для кофейни и видимый результат для вас</p>
        </div>
      </div>

      <!-- Секция 6: Локация -->
      <div v-if="selectedSection === 'location'" class="signal-form-section">
        <div class="signal-question-block" style="--accent-color: #5A9FB8;">
          <p class="signal-direction-label">Выбрать локацию</p>
          <div class="signal-rotating-phrase-container">
            <p class="signal-question-label">В какой кофейне разобрать этот Сигнал?</p>
          </div>
          <select v-model="form.selectedNetwork" @change="form.selectedBranch = ''" class="signal-select">
            <option disabled value="">Выберите сеть</option>
            <option v-for="(cafe, name) in cafes" :key="name" :value="name">{{ name }}</option>
          </select>
          <select v-model="form.selectedBranch" class="signal-select" :disabled="!form.selectedNetwork">
            <option disabled value="">Выберите адрес</option>
            <option v-for="(branch, index) in selectedNetworkBranches" :key="index" :value="branch.address">
              {{ branch.address }}
            </option>
          </select>
        </div>
      </div>

<!-- Секция 7: Контакт -->
<div v-if="selectedSection === 'contact'" class="signal-form-section">

  <!-- Экран подтверждения (показывается ПОСЛЕ отправки) -->
  <div v-if="formSubmitted" class="signal-success-screen">
    <div class="signal-success-content">
      <h3>Сигнал отправлен ⚡</h3>
      <div class="signal-success-ticket-info">
        <span class="signal-success-date">{{ currentDate }}</span>
        <span class="signal-success-ticket">{{ formattedTicketNumber }}</span>
      </div>
      <p class="signal-success-description">Отправьте тикет Анне, чтобы получить результат в Телеграм.</p>
      <a :href="`https://t.me/Anna_Signal?text=Тикет%20${rawTicketNumber}`" target="_blank" :class="['signal-telegram-button', selectedGender === 'female' ? 'female' : 'male']">Получить Ответ</a>
      <a href="/signals#знакомьтесь-–-анна" target="_blank" class="signal-secondary-link no-double-underline">Кто Анна и как работает</a>
    </div>
  </div>

  <!-- Форма отправки (показывается ДО отправки) -->
  <template v-if="!formSubmitted">
    <div class="signal-question-block contact" style="--accent-color: #00C2A8;">
      <div class="signal-rotating-phrase-container">
        <p class="signal-question-label">Отправьте Сигнал</p>
      </div>

      <!-- Поле ввода имени -->
      <div v-if="!form.isIncognito" class="signal-name-field">
        <label>Для персонального разбора</label>
        <input v-model="form.userName" class="signal-input" placeholder="Ваше Имя" />
      </div>

      <!-- Переключатель "Инкогнито" -->
      <div class="signal-incognito-toggle">
        <label class="signal-toggle-label">
          <input type="checkbox" v-model="form.isIncognito" class="signal-toggle-checkbox" />
          <span class="signal-toggle-slider"></span>
          <span class="signal-toggle-text">Анонимно</span>
        </label>
      </div>

      <!-- Динамическая подсказка -->
      <p class="signal-input-hint">
        {{ form.isIncognito 
           ? 'Кофейня получит Сигнал. Ответ по запросу у Анны.' 
           : 'Кофейня ответит. Анна вернёт и поможет уточнить.' }}
      </p>
    </div>

    <!-- Соглашение с условиями -->
    <label class="signal-agreement">
      <input type="checkbox" v-model="form.agreedToTerms" />
      <span>Подтверждаю согласие с <a href="/terms" target="_blank" class="signal-policy-link no-double-underline">Условиями использования</a></span>
    </label>

    <!-- Кнопка отправки -->
<button 
  class="signal-submit-button" 
  :disabled="submitStatus === 'processing' || !form.agreedToTerms"
  @click="submitForm"
>
  <span class="signal-liquid-next-text">{{ submitButtonText }}</span>
</button>
  </template>

</div>

      <!-- Кнопки навигации -->
      <div v-if="selectedSection !== 'contact'" class="signal-next-button-container">
        <button
  class="signal-liquid-next-btn"
  :class="[
    selectedSection === 'share' ? 'signal-share-next' : '',
    selectedSection === 'emotions' ? 'signal-emotion-next' : '',
    selectedSection === 'facts' ? 'signal-fact-next' : '',
    selectedSection === 'solutions' ? 'signal-solution-next' : '',
    selectedSection === 'summary' ? 'signal-summary-next' : '',
    selectedSection === 'location' ? 'signal-location-next' : ''
  ]"
  @click="goToNextSection"
  :disabled="(selectedSection === 'summary' && (!form.summaryText || !form.summaryText.trim())) || (selectedSection === 'location' && (!form.selectedNetwork || !form.selectedBranch))"
>
  <span class="signal-liquid-next-text">{{ currentSectionData.buttonText }}</span>
  <CupFillIcon
    class="signal-next-icon"
    :step-index="sections.findIndex(s => s.id === selectedSection)"
    :steps-total="6"
    :size="22"
  />
</button>


        
        <div v-if="selectedSection === 'summary'" class="signal-humanize-button-container">
          <button class="signal-liquid-humanize-btn" @click="summarizeAllContent()" :disabled="humanizeStatus === 'processing'">
            <span class="signal-liquid-humanize-text">
              {{ humanizeStatus === 'completed' ? 'Готово' : humanizeStatus === 'processing' ? 'Обновление...' : 'Обновить' }}
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onUnmounted, computed, onMounted } from 'vue';

const form = reactive({ 
  shareExperience: '',
  emotionalRelease: '',
  factualAnalysis: '',
  constructiveSuggestions: '',
  summaryText: '',
  selectedNetwork: '',
  selectedBranch: '',
  userName: '',
  isIncognito: false,
  agreedToTerms: false
});

const isMobile = ref(false);
const selectedGender = ref('female');
const humanizeStatus = ref('idle');
const showInfoModal = ref(false);
const submitStatus = ref('idle');
const submitButtonText = computed(() => {
  if (submitStatus.value === 'processing') {
    return '⏳ Отправляется...';
  }
  if (form.selectedNetwork) {
    return `Отправить в ${form.selectedNetwork}`;
  }
  return 'Отправить в кофейню';
});
const formSubmitted = ref(false);
const rawTicketNumber = ref(null);
const formattedTicketNumber = ref(null);
const currentDate = ref('');

const cafes = {
  'Корж': {
    branches: [
      { address: 'Куйбышева, 103' },
      { address: 'Революционная, 101В' },
      { address: '9 просека 5-я малая линия, 3б' },
      { address: 'Льва Толстого, 30Б' },
      { address: 'Самарская, 270' },
      { address: 'Дачная, 2к2' },
      { address: 'Ульяновская, 19' },
      { address: 'Ново-Садовая, 106б' }
    ]
  },
  'MOSAIC': {
    branches: [
      { address: 'Бывшая гостиница "Националь"' },
      { address: 'Волжский просп., 50' },
      { address: 'Речной вокзал' },
      { address: 'Максима Горького, 82' },
      { address: 'Волжский просп., 40' },
      { address: 'ЖК Ботанический' },
      { address: 'ТЦ Аквариум' },
      { address: 'ТЦ Аврора' },
      { address: 'ТЦ Самолет' },
      { address: 'Волгина, 127А' },
      { address: 'БЦ ЗИМ' },
      { address: '5-я просека' },
      { address: 'Красноармейский спуск' },
      { address: 'Напротив ЦСКА' }
    ]
  },
  'Skuratov': {
    branches: [
      { address: 'Самарская, 190' },
      { address: 'Молодогвардейская, 80' },
      { address: 'Максима Горького, 129' },
      { address: 'Красноармейская, 133' },
      { address: 'Первомайская, 29' },
      { address: 'Куйбышева, 68/70' }
    ]
  },
  'Surf': {
    branches: [
      { address: 'Некрасовская, 57' },
      { address: 'Полевая, 54' },
      { address: 'Куйбышева, 100' }
    ]
  },
  'Белотурка': {
    branches: [
      { address: 'Куйбышева, 99' },
      { address: 'Молодогвардейская, 153' },
      { address: 'Ново-Садовая, 106' },
      { address: 'Московское шоссе, 41 (РДЦ)' },
      { address: 'Московское шоссе, 81Б (Парк Хаус)' }
    ]
  },
  'Кэрри': {
    branches: [
      { address: 'Ново-Садовая ул., 160М' },
      { address: 'Московское шоссе, 252' },
      { address: 'Дачная ул., 2, корп. 1' },
      { address: 'Дыбенко, 30 (Космопорт)' }
    ]
  }
};

const selectedNetworkBranches = computed(() => {
  if (!form.selectedNetwork) return [];
  return cafes[form.selectedNetwork]?.branches || [];
});

onMounted(() => {
  const checkMobile = () => {
    isMobile.value = window.innerWidth <= 768;
  };
  checkMobile();
  window.addEventListener('resize', checkMobile);
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') showInfoModal.value = false;
  });
  updateSuggestionsForGender();
  
  rawTicketNumber.value = String(Date.now()).slice(-6);
  formattedTicketNumber.value = `${rawTicketNumber.value.slice(0, 3)}-${rawTicketNumber.value.slice(3, 6)}`;
  const now = new Date();
  const options = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' };
  currentDate.value = now.toLocaleString('ru-RU', options).replace(',', '');
});

const sections = [
  { id: 'location', title: 'Локация', buttonText: 'Начать' },
  { id: 'emotions', title: 'Эмоции', buttonText: 'Дальше к фактам' },
  { id: 'facts', title: 'Факты', buttonText: 'К решению ситуации' },
  { id: 'solutions', title: 'Решения', buttonText: 'Сформировать Сигнал' },
  { id: 'summary', title: 'Резюме', buttonText: 'Формат ответа' },
  { id: 'contact', title: 'Контакт', buttonText: '' } // На последнем шаге кнопка не отображается
];

const selectedSection = ref('location');

const currentSectionData = computed(() => {
return sections.find(s => s.id === selectedSection.value);
});

const coffeeFillHeight = computed(() => {
  const i = sections.findIndex(s => s.id === selectedSection.value)
  const steps = [0, 2, 4, 6, 7, 8]   // 6 экранов = 6 видимых уровней
  return steps[Math.max(0, Math.min(i, steps.length - 1))]
})

const isActive = (id) => id === selectedSection.value;

const goToNextSection = () => {
  const currentIndex = sections.findIndex(s => s.id === selectedSection.value);
  if (selectedSection.value === 'solutions') {
    summarizeAllContent();
  }
  if (currentIndex < sections.length - 1) {
    selectedSection.value = sections[currentIndex + 1].id;
  }
};

function summarizeAllContent() {
  humanizeStatus.value = 'processing';
  try {
    const structuredText = structureAndCleanText(
      form.shareExperience.trim(),
      form.emotionalRelease.trim(),
      form.factualAnalysis.trim(),
      form.constructiveSuggestions.trim(),
      selectedGender.value
    );
    form.summaryText = applyGenderCorrection(structuredText, selectedGender.value);
    humanizeStatus.value = 'completed';
    setTimeout(() => {
      humanizeStatus.value = 'idle';
    }, 2000);
  } catch (error) {
    console.error('Ошибка:', error);
    humanizeStatus.value = 'idle';
  }
}

function onGenderClick(gender) {
  selectedGender.value = gender;
  updateSuggestionsForGender();
  if (selectedSection.value === 'summary') {
    summarizeAllContent();
  }
}

async function submitForm() {
  submitStatus.value = 'processing';
  const formData = {
    _subject: `Новый отзыв от ${form.userName || 'Аноним'}`,
    "Дата": currentDate.value,
    "Код тикета": rawTicketNumber.value,
    "Сеть": form.selectedNetwork,
    "Адрес": form.selectedBranch,
    "Имя": form.userName,
    "Отзыв": form.summaryText
  };
  try {
    const response = await fetch('https://formspree.io/f/mdkzjopz', {
      method: 'POST',
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    if (!response.ok) throw new Error('Ошибка');
    formSubmitted.value = true;
    submitStatus.value = 'idle';
  } catch (error) {
    console.error('Ошибка:', error);
    alert('Не удалось отправить отзыв. Попробуйте позже.');
    submitStatus.value = 'idle';
  }
}

// ===== ИСПРАВЛЕННАЯ ЧАСТЬ: ТРЕХУРОВНЕВАЯ СИСТЕМА ПОДСКАЗОК =====

const baseSuggestions = {
emotions: {
  // Положительные эмоции - первый уровень
  initial: ['довольна', 'восхищена', 'благодарна', 'удивлена', 'расстроена', 'разочарована', 'недовольна', 'возмущена'],
  
  // Мужской род - положительные
  'доволен': ['качеством кофе', 'скоростью обслуживания', 'вежливостью персонала', 'атмосферой заведения', 'чистотой помещения'],
  'восхищён': ['мастерством бариста', 'качеством десертов', 'дизайном интерьера', 'музыкальным сопровождением', 'ароматом кофе'],
  'благодарен': ['за внимание к деталям', 'за решение проблемы', 'за рекомендацию напитка', 'за уютную обстановку', 'за профессионализм'],

  // Нейтральные эмоции - удивление
  'удивлён': ['таким сервисом', 'проблемами', 'невниманием', 'беспорядком', 'отношением'],

  // Мужской род - негативные
  'расстроен': ['долго ждал', 'грязная посуда', 'холодный кофе', 'грубый персонал', 'забыли заказ'],
  'разочарован': ['качеством', 'сервисом', 'ожиданиями', 'атмосферой', 'чистотой'],
  'недоволен': ['обслуживанием', 'очередью', 'ошибкой в заказе', 'температурой блюд', 'упаковкой'],
  'возмущён': ['антисанитарией', 'хамством', 'обманом', 'некачественной едой', 'инородными предметами'],

  // Женский род - положительные
  'довольна': ['качеством кофе', 'скоростью обслуживания', 'вежливостью персонала', 'атмосферой заведения', 'чистотой помещения'],
  'восхищена': ['мастерством бариста', 'качеством десертов', 'дизайном интерьера', 'музыкальным сопровождением', 'ароматом кофе'],
  'благодарна': ['за внимание к деталям', 'за решение проблемы', 'за рекомендацию напитка', 'за уютную обстановку', 'за профессионализм'],

  // Нейтральные эмоции - удивление (женский род)
  'удивлена': ['таким сервисом', 'проблемами', 'невниманием', 'беспорядком', 'отношением'],

  // Женский род - негативные
  'расстроена': ['долго ждала', 'грязная посуда', 'холодный кофе', 'грубый персонал', 'забыли заказ'],
  'разочарована': ['качеством', 'сервисом', 'ожиданиями', 'атмосферой', 'чистотой'],
  'недовольна': ['обслуживанием', 'очередью', 'ошибкой в заказе', 'температурой блюд', 'упаковкой'],
  'возмущена': ['антисанитарией', 'хамством', 'обманом', 'некачественной едой', 'инородными предметами'],
  
  // ГЕНДЕРНО-НЕЙТРАЛЬНЫЕ второй и третий уровни (используются для обоих родов)
  'долго ждал': ['20 минут', '30 минут', 'более часа', 'без объяснений', 'видя пустую кофейню'],
  'долго ждала': ['20 минут', '30 минут', 'более часа', 'без объяснений', 'видя пустую кофейню'],
  'грязная посуда': ['следы помады', 'остатки еды', 'жирные пятна', 'засохший кофе', 'странный запах'],
  'холодный кофе': ['едва теплый', 'совсем остыл', 'подали холодным', 'температура комнатная'],
  'грубый персонал': ['не поздоровались', 'хамили', 'игнорировали', 'были раздражены', 'повысили голос'],
  'забыли заказ': ['через 40 минут', 'не записали', 'потеряли чек', 'не передали на кухню'],
  'качеством': ['хуже чем обычно', 'не соответствует цене', 'испортилось за месяц', 'как в фастфуде', 'совсем не то'],
  'сервисом': ['медленный', 'невнимательный', 'равнодушный', 'непрофессиональный', 'хаотичный'],
  'ожиданиями': ['по отзывам лучше', 'раньше было вкуснее', 'не оправдал репутацию'],
  'атмосферой': ['шумно и грязно', 'неуютно', 'холодно', 'плохая музыка', 'неприятные запахи'],
  'чистотой': ['грязные столы', 'липкий пол', 'немытая посуда', 'пыль везде', 'антисанитария'],
  'обслуживанием': ['долгое ожидание', 'путаница в заказах', 'невежливость', 'игнорирование', 'ошибки кассира'],
  'очередью': ['не двигалась', 'час ожидания', 'нет системы', 'хаос', 'всех пропускают'],
  'ошибкой в заказе': ['не тот напиток', 'забыли позицию', 'неправильный размер', 'другой сироп', 'перепутали'],
  'температурой блюд': ['холодные', 'остывшие', 'чуть теплые', 'не разогрели', 'ледяные'],
  'упаковкой': ['протекающие крышки', 'слабые пакеты', 'разорвалась', 'неудобная', 'грязная'],
  'антисанитарией': ['грязные руки', 'упал и подали', 'на полу готовят', 'мухи', 'тараканы'],
  'хамством': ['нагрубили', 'оскорбили', 'накричали', 'показали характер', 'послали'],
  'обманом': ['не тот объем', 'обвесили', 'скрыли стоимость', 'навязали', 'обсчитали'],
  'некачественной едой': ['испорченная', 'несвежая', 'странный вкус', 'горькая', 'кислая'],
  'инородными предметами': ['волосы в еде', 'пластик в круассане', 'проволока', 'нитки', 'жук'],
  'таким сервисом': ['впервые такое', 'шокирован', 'не верю', 'ужасно'],
  'проблемами': ['постоянные', 'одни и те же', 'системные', 'не решаются', 'игнорируются'],
  'невниманием': ['не слушают', 'не реагируют', 'все равно', 'безразличие', 'не заботятся'],
  'беспорядком': ['хаос', 'непорядок', 'бардак', 'неорганизованность', 'суета'],
  'отношением': ['пренебрежение', 'высокомерие', 'равнодушие', 'неуважение', 'хамство'],
  'качеством кофе': ['идеальная температура', 'богатый аромат', 'сбалансированный вкус', 'красивая подача', 'свежая обжарка'],
  'скоростью обслуживания': ['заказ за 3 минуты', 'мгновенная подача', 'нет очередей', 'четкая организация', 'быстрая оплата'],
  'вежливостью персонала': ['улыбчивые сотрудники', 'внимательное отношение', 'помощь в выборе', 'вежливое общение', 'профессионализм'],
  'атмосферой заведения': ['уютный интерьер', 'приятная музыка', 'комфортные места', 'теплое освещение', 'спокойная обстановка'],
  'чистотой помещения': ['сверкающая посуда', 'чистые столы', 'порядок везде', 'свежий воздух', 'аккуратность'],
  'мастерством бариста': ['красивый латте-арт', 'точные пропорции', 'умение готовить', 'знание рецептов', 'творческий подход'],
  'качеством десертов': ['свежая выпечка', 'идеальный вкус', 'красивая презентация', 'домашний вкус', 'качественные ингредиенты'],
  'дизайном интерьера': ['стильное оформление', 'продуманные детали', 'современный дизайн', 'удобная мебель', 'гармоничные цвета'],
  'музыкальным сопровождением': ['приятная фоновая музыка', 'подходящий плейлист', 'комфортная громкость', 'качественный звук', 'атмосферные композиции'],
  'ароматом кофе': ['насыщенный запах', 'свежемолотые зерна', 'манящий аромат', 'качественные сорта', 'профессиональная обжарка'],
  'за внимание к деталям': ['запомнили предпочтения', 'учли пожелания', 'индивидуальный подход', 'забота о госте', 'персональный сервис'],
  'за решение проблемы': ['быстро исправили ошибку', 'заменили напиток', 'извинились за неудобство', 'предложили компенсацию', 'проявили понимание'],
  'за рекомендацию напитка': ['подобрали по вкусу', 'посоветовали новинку', 'объяснили особенности', 'учли предпочтения', 'помогли выбрать'],
  'за уютную обстановку': ['домашняя атмосфера', 'теплый прием', 'комфортные условия', 'располагающая обстановка', 'приятное времяпрепровождение'],
  'за профессионализм': ['высокий уровень сервиса', 'компетентность', 'качественная работа', 'внимание к деталям', 'превосходное обслуживание']
},

  facts: {
    initial: ['ожидание', 'ошибка в заказе', 'качество блюд', 'чистота', 'персонал'],
    'ожидание': ['20 минут', '30 минут', 'более часа', 'забыли заказ', 'очередь не двигалась'],
    'ошибка в заказе': ['не тот напиток', 'не доложили позицию', 'неправильный соус', 'перепутали объём', 'другое молоко'],
    'качество блюд': ['холодный кофе', 'невкусная еда', 'недоваренный рис', 'комочки в матче', 'чёрствая выпечка'],
    'чистота': ['грязная посуда', 'волосы в еде', 'грязная уборная', 'насекомые', 'пластик в круассане'],
    'персонал': ['грубость', 'невнимательность', 'некомпетентность', 'трогали еду руками', 'не извинились'],
    '20 минут': ['засекала по часам', 'спросила у соседнего стола', 'заказала в 14:30, получила в 14:50', 'долгое ожидание для простого заказа', 'других обслужили быстрее'],
    '30 минут': ['полчаса точно', 'с 15:00 до 15:30', 'дважды подходила узнать', 'время на телефоне показало', 'успела прочитать новости'],
    'более часа': ['час и 10 минут', 'полтора часа ждала', 'с 12:00 до 13:15', 'весь обед потратила', 'опоздала на встречу'],
    'забыли заказ': ['не записали', 'потеряли чек', 'не передали на кухню', 'перепутали с другим', 'готовили не то'],
    'очередь не двигалась': ['стояла полчаса', 'один кассир на всех', 'касса сломалась', 'менялись местами', 'хаос'],
    'не тот напиток': ['заказала латте, принесли капучино', 'просила без сахара, был сладкий', 'хотела большой, дали маленький', 'другой сироп добавили', 'обычное молоко вместо овсяного'],
    'не доложили позицию': ['забыли десерт', 'нет половины заказа', 'пропали сэндвичи', 'только кофе принесли', 'блинчики не было'],
    'неправильный соус': ['положили не тот соус к тыквенным панкейкам', 'острый вместо сладкого', 'майонез вместо сметаны', 'кетчуп забыли', 'соус отдельно не дали'],
    'перепутали объём': ['несоответствие объема напитков', 'маленький вместо большого', 'дали меньше чем заказала', 'размер не тот', 'обманули с порцией'],
    'другое молоко': ['обычное вместо овсяного', 'соевое вместо миндального', 'с лактозой дали', 'не предупредили', 'аллергия может быть'],
    'холодный кофе': ['градусов 40-50', 'можно было пить сразу', 'не обжигал язык', 'как будто стоял долго', 'температура комнатная'],
    'невкусная еда': ['пересоленная', 'недосоленная', 'горькая', 'кислая', 'странный вкус'],
    'недоваренный рис': ['недоваренный рис, не свежий лайм и черный волос в редисе', 'жесткий', 'сырой', 'хрустит на зубах', 'не доварили'],
    'комочки в матче': ['комочки в матче', 'не размешали', 'порошок не растворился', 'комки муки', 'неоднородная масса'],
    'чёрствая выпечка': ['как камень', 'вчерашняя', 'сухая', 'твердая', 'невозможно откусить'],
    'грязная посуда': ['на чашке помада', 'жирные разводы на тарелке', 'крошки от предыдущих гостей', 'капли кофе на блюдце', 'следы от губной помады'],
    'волосы в еде': ['черный волос в редисе', 'длинный волос в салате', 'волосы на булочке', 'в супе волос', 'противно есть'],
    'грязная уборная': ['не убирали', 'бумаги нет', 'воняет', 'лужи на полу', 'грязь везде'],
    'насекомые': ['тараканы бегают', 'муха в кофе', 'жук в салате', 'паук на стене', 'противно смотреть'],
    'пластик в круассане': ['кусочек пластика в круассане', 'твердый кусок', 'чуть не сломала зуб', 'опасно', 'могла подавиться'],
    'грубость': ['не поздоровались', 'ответили резко', 'закатили глаза', 'проигнорировали вопрос', 'были явно недовольны'],
    'невнимательность': ['не слушали', 'переспрашивали', 'отвлекались', 'забыли просьбу', 'записали неправильно'],
    'некомпетентность': ['не знали меню', 'не умели готовить', 'путались в кнопках', 'долго соображали', 'спрашивали у коллег'],
    'трогали еду руками': ['трогали трубочку грязными руками', 'лапали булочки', 'без перчаток', 'грязными руками', 'неаккуратно'],
    'не извинились': ['даже не извинились', 'было все равно', 'сделали вид что нормально', 'проигнорировали', 'сказали что так и надо']
  },

  solutions: {
    initial: ['таймер ожидания', 'обучение персонала', 'контроль качества', 'система проверки', 'стандарты сервиса'],
    'таймер ожидания': ['визуальный контроль бариста', 'с номерами заказов', 'видимый гостям', 'контроль времени', 'сигналы на баре', 'обратная связь от гостей'],
    'обучение персонала': ['по сервису', 'по санитарии', 'по качеству', 'по коммуникации', 'регулярные тренинги'],
    'контроль качества': ['проверка блюд', 'температурный контроль', 'свежесть продуктов', 'упаковка', 'дегустация'],
    'система проверки': ['чек-лист качества', 'двойная проверка', 'контроль чистоты', 'стандарты подачи', 'фото блюд'],
    'стандарты сервиса': ['вежливость', 'скорость', 'точность', 'чистота', 'профессионализм'],
    'визуальный контроль бариста': ['песочные часы на стойке', 'отчёты по среднему времени заказа', 'замеры скорости обслуживания менеджером', 'сравнение с нормой', 'обсуждение на пятиминутке'],
    'с номерами заказов': ['в мобильном приложении', 'на чеке QR-код', 'на чеке номер заказа'],
    'видимый гостям': ['в мобильном приложении', 'на чеке QR-код', 'на чеке номер заказа'],
    'контроль времени': ['стандарт 7 минут', 'красная зона после 10 мин', 'автоотсчёт от момента пробития чека'],
    'сигналы на баре': ['цветовые индикаторы готовности', 'звуковой таймер для бариста'],
    'обратная связь от гостей': ['опрос о времени ожидания', 'кнопка "долго жду" в приложении', 'комментарий в чеке QR-кодом'],
    'по сервису': ['тренинги вежливости', 'ролевые игры', 'работа с жалобами', 'стандарты общения', 'мотивация персонала'],
    'по санитарии': ['мытье посуды', 'уборка столов', 'проверка чистоты', 'гигиена рук', 'контроль температуры'],
    'по качеству': ['дегустация напитков', 'проверка ингредиентов', 'температура подачи', 'внешний вид блюд', 'сроки годности'],
    'по коммуникации': ['активное слушание', 'решение конфликтов', 'извинения и компенсации', 'позитивное общение', 'работа с негативом'],
    'регулярные тренинги': ['раз в месяц', 'новых сотрудников', 'переаттестация', 'мастер-классы', 'обмен опытом'],
    'проверка блюд': ['перед подачей', 'температура напитков', 'внешний вид', 'соответствие заказу', 'свежесть ингредиентов'],
    'температурный контроль': ['термометр для кофе', '85-90 градусов', 'горячие блюда', 'холодные напитки', 'контроль каждый час'],
    'свежесть продуктов': ['ежедневная поставка', 'сроки годности', 'ротация товара', 'маркировка даты', 'утилизация просрочки'],
    'упаковка': ['герметичные крышки', 'качественные пакеты', 'стаканы не протекают', 'салфетки в комплекте', 'удобная переноска'],
    'дегустация': ['каждая партия', 'новые рецепты', 'мнение гостей', 'тестирование вкуса', 'корректировка рецептур'],
    'чек-лист качества': ['для каждого заказа', 'проверка температуры', 'чистота посуды', 'правильность состава', 'время подачи'],
    'двойная проверка': ['готовящий и подающий', 'кассир и бариста', 'менеджер и персонал', 'фото готового блюда', 'подпись ответственного'],
    'контроль чистоты': ['каждый час', 'чек-лист уборки', 'дезинфекция', 'мытье рук', 'чистая форма'],
    'стандарты подачи': ['правильная посуда', 'украшение блюд', 'салфетки и приборы', 'температура подачи', 'презентация'],
    'фото блюд': ['перед подачей', 'контроль качества', 'обучение персонала', 'соцсети', 'архив образцов'],
    'вежливость': ['приветствие с улыбкой', 'благодарность гостю', 'извинения за ошибки', 'помощь в выборе', 'прощание'],
    'скорость': ['стандарт 10 минут', 'быстрое принятие заказа', 'оперативная готовка', 'мгновенная подача', 'ускоренная оплата'],
    'точность': ['записывать заказы', 'повторять вслух', 'проверять чек', 'уточнять детали', 'контроль состава'],
    'чистота': ['мытье рук каждые 30 мин', 'чистая форма', 'дезинфекция поверхностей', 'порядок на рабочем месте', 'свежая посуда'],
    'профессионализм': ['знание меню', 'умение готовить', 'решение проблем', 'работа в команде', 'развитие навыков']
  }
};

const maleEmotionsInitial = ['расстроен', 'разочарован', 'недоволен', 'возмущён', 'удивлён', 'доволен', 'восхищён', 'благодарен'];

const currentSuggestions = reactive({
  emotions: baseSuggestions.emotions.initial,
  facts: baseSuggestions.facts.initial,
  solutions: baseSuggestions.solutions.initial
});

let selectedFirstLevelSuggestions = reactive({
  emotions: [],
  facts: [],
  solutions: []
});

function selectSuggestion(fieldName, suggestion, suggestionType) {
  const currentText = form[fieldName].trim();
  const isNewBranch = isInitialSuggestions(suggestionType);

  if (currentText) {
    if (isNewBranch) {
      form[fieldName] = currentText + '. ' + suggestion.charAt(0).toUpperCase() + suggestion.slice(1);
    } else {
      form[fieldName] = currentText + ' ' + suggestion;
    }
  } else {
    form[fieldName] = suggestion.charAt(0).toUpperCase() + suggestion.slice(1);
  }

  if (suggestionType === 'emotions') {
    if (!selectedFirstLevelSuggestions.emotions.includes(suggestion)) {
      selectedFirstLevelSuggestions.emotions.push(suggestion);
    }
  } else {
    if (!selectedFirstLevelSuggestions[suggestionType].includes(suggestion)) {
      selectedFirstLevelSuggestions[suggestionType].push(suggestion);
    }
  }

  updateSuggestions(suggestionType, suggestion);
}

function updateSuggestions(suggestionType, selectedWord) {
  let nextSuggestions = baseSuggestions[suggestionType][selectedWord];

  if (suggestionType === 'emotions' && selectedGender.value === 'male') {
    if (!nextSuggestions) {
      const remaining = maleEmotionsInitial.filter(e => !selectedFirstLevelSuggestions.emotions.includes(e));
      if (remaining.length === 0) {
        selectedFirstLevelSuggestions.emotions = [];
        currentSuggestions.emotions = [...maleEmotionsInitial];
      } else {
        currentSuggestions.emotions = remaining;
      }
      return;
    }
  }

  if (nextSuggestions && nextSuggestions.length > 0) {
    currentSuggestions[suggestionType] = [...nextSuggestions];
  } else {
    if (suggestionType === 'emotions' && selectedGender.value === 'male') {
      const remaining = maleEmotionsInitial.filter(e => !selectedFirstLevelSuggestions.emotions.includes(e));
      if (remaining.length === 0) {
        selectedFirstLevelSuggestions.emotions = [];
        currentSuggestions.emotions = [...maleEmotionsInitial];
      } else {
        currentSuggestions.emotions = remaining;
      }
    } else {
      const remaining = baseSuggestions[suggestionType].initial.filter(item => !selectedFirstLevelSuggestions[suggestionType].includes(item));
      if (remaining.length === 0) {
        selectedFirstLevelSuggestions[suggestionType] = [];
        currentSuggestions[suggestionType] = [...baseSuggestions[suggestionType].initial];
      } else {
        currentSuggestions[suggestionType] = remaining;
      }
    }
  }
}

function resetSuggestions(suggestionType) {
  selectedFirstLevelSuggestions[suggestionType] = [];
  if (suggestionType === 'emotions' && selectedGender.value === 'male') {
    currentSuggestions.emotions = [...maleEmotionsInitial];
  } else {
    currentSuggestions[suggestionType] = [...baseSuggestions[suggestionType].initial];
  }
}

function isInitialSuggestions(suggestionType) {
  const initialSuggs = suggestionType === 'emotions' && selectedGender.value === 'male' 
    ? maleEmotionsInitial
    : baseSuggestions[suggestionType].initial;

  const unusedInitial = initialSuggs.filter(
    item => !selectedFirstLevelSuggestions[suggestionType].includes(item)
  );

  return JSON.stringify(currentSuggestions[suggestionType]) === JSON.stringify(unusedInitial);
}

function updateSuggestionsForGender() {
  if (selectedGender.value === 'male') {
    const remaining = maleEmotionsInitial.filter(e => !selectedFirstLevelSuggestions.emotions.includes(e));
    currentSuggestions.emotions = remaining.length > 0 ? remaining : [...maleEmotionsInitial];
  } else {
    const remaining = baseSuggestions.emotions.initial.filter(e => !selectedFirstLevelSuggestions.emotions.includes(e));
    currentSuggestions.emotions = remaining.length > 0 ? remaining : [...baseSuggestions.emotions.initial];
  }
}


// ===== КОНЕЦ ИСПРАВЛЕННОЙ ЧАСТИ =====

const questionsShare = ['Что произошло?', 'Расскажите о ситуации', 'Опишите вашу проблему'];
const questions1 = { 
  female: ['Что вы почувствовали?', 'Какие эмоции испытали?', 'Что вас расстроило?'],
  male: ['Что вы почувствовали?', 'Какие эмоции испытали?', 'Что вас расстроило?']
};
const questions2 = ['Что именно произошло?', 'Какие детали важны?', 'Опишите факты'];
const questions3 = ['Как это исправить?', 'Что может помочь?', 'Ваши предложения?'];

const currentQuestionShare = ref(questionsShare[0]);
const currentQuestion1 = ref(questions1.female[0]);
const currentQuestion2 = ref(questions2[0]);
const currentQuestion3 = ref(questions3[0]);

let rotationInterval = null;

function startRotation(questionNum) {
  if (rotationInterval) clearInterval(rotationInterval);
  
  let questions, currentQuestion;
  
  if (questionNum === 1) {
    questions = selectedGender.value === 'female' ? questions1.female : questions1.male;
    currentQuestion = currentQuestion1;
  } else if (questionNum === 2) {
    questions = questions2;
    currentQuestion = currentQuestion2;
  } else if (questionNum === 3) {
    questions = questions3;
    currentQuestion = currentQuestion3;
  }
  
  let currentIndex = questions.indexOf(currentQuestion.value);
  
  rotationInterval = setInterval(() => {
    currentIndex = (currentIndex + 1) % questions.length;
    currentQuestion.value = questions[currentIndex];
  }, 3000);
}

function applyGenderCorrection(text, gender) {
  return text;
}

function structureAndCleanText(share, emotional, factual, solutions, gender) {
  let result = '';

  // Набор устойчивых пар и словосочетаний, которые нельзя разрывать запятой
  const protectedBigrams = new Set([
    'нет системы',
    'мгновенная подача',
    'длинный волос',
    'архив образцов',
    'по санитарии',
    'качественный звук',
    'идеальный вкус',
    'точные пропорции',
    'за решение',
    'за внимание',
    'за профессионализм',
    'за рекомендацию',
    'за уютную',
    'по качеству',
    'по сервису',
    'по коммуникации',
    'по времени',
    'чистая посуда',
    'грязная посуда',
    'холодный кофе',
    'волосы в',
    'ошибка в',
  ]);

  // Попытаться склеить устойчивые пары внутри строки (чтобы не резать запятой)
  function joinProtectedBigrams(text) {
    let words = text.trim().split(/\s+/);
    if (words.length < 2) return text.trim();

    const joined = [];
    for (let i = 0; i < words.length; i++) {
      const bigram = (words[i] + ' ' + (words[i + 1] || '')).toLowerCase();
      if (i < words.length - 1 && protectedBigrams.has(bigram)) {
        joined.push(words[i] + ' ' + words[i + 1]);
        i += 1;
      } else {
        joined.push(words[i]);
      }
    }
    return joined.join(' ');
  }

  // Разбор «цепочки» на уровни: ожидаем 1–3 блока
  // Мы формируем уровни по логике ввода: первая лексема — уровень1, далее — уровень2 (одно или два слова),
  // остальное — уровень3 (детали). Для улучшения читаемости допускаем 2 слова в уровне2, если это устойчивое сочетание.
  function splitIntoLevels(sentence) {
    const cleaned = sentence.trim().replace(/\s+/g, ' ');
    let words = cleaned.split(' ');
    if (words.length === 0) return { l1: '', l2: '', l3: '' };

    const l1 = words[0]; // всегда первое слово — уровень1
    words = words.slice(1);

    if (words.length === 0) return { l1, l2: '', l3: '' };

    // кандидаты для l2: одно слово как минимум
    let l2 = words[0];
    let remainder = words.slice(1);

    // если первые два слова образуют защищённую пару — берём их как уровень2
    if (remainder.length >= 1) {
      const candidateBigram = (l2 + ' ' + remainder[0]).toLowerCase();
      if (protectedBigrams.has(candidateBigram)) {
        l2 = l2 + ' ' + remainder[0];
        remainder = remainder.slice(1);
      }
    }

    const l3 = remainder.join(' '); // всё, что осталось — детали
    return { l1, l2, l3 };
  }

  // Форматирование одной «цепочки» с корректной пунктуацией
  function formatChain(sentence) {
    // Склеиваем устойчивые пары, чтобы не рвать их запятой
    const normalized = sentence.charAt(0).toUpperCase() + sentence.slice(1);
    const glued = joinProtectedBigrams(normalized);
    const { l1, l2, l3 } = splitIntoLevels(glued);

    if (!l1) return '';

    // 1 уровень
    if (!l2 && !l3) {
      return l1;
    }

    // 1 + 2 уровни
    if (l2 && !l3) {
      return `${l1} ${l2}:`;
    }

    // 1 + 2 + 3 уровни
    // Внутри l3 попробуем поставить ОДНУ запятую, если есть явные два смысловых блока
    // Критерии: ищем короткое служебное слово (<=3) примерно в середине или защищенную биграмму — запятую ставим ДО неё
    let l3Words = l3.split(/\s+/);
    let commaIdx = -1;

    // попытка: найти служебное/короткое слово во второй трети — поставить запятую перед ним
    for (let i = 1; i < l3Words.length - 1; i++) {
      const w = l3Words[i].toLowerCase();
      if (w.length <= 3 && i >= Math.floor(l3Words.length / 3)) {
        commaIdx = i;
        break;
      }
    }

    if (commaIdx === -1 && l3Words.length >= 4) {
      // запасной вариант: запятая на 2/3
      commaIdx = Math.floor(l3Words.length * 0.66);
    }

    // НО: не разрывать защищённые биграммы
    if (commaIdx > 0) {
      const leftBigram = (l3Words[commaIdx - 1] + ' ' + l3Words[commaIdx]).toLowerCase();
      if (protectedBigrams.has(leftBigram) && commaIdx < l3Words.length - 1) {
        // если запятая попала внутрь биграммы — сдвигаем вправо
        commaIdx += 1;
      }
    }

    let l3Formatted;
    if (commaIdx > 0 && commaIdx < l3Words.length - 1) {
      l3Formatted = l3Words.slice(0, commaIdx).join(' ') + ', ' + l3Words.slice(commaIdx).join(' ');
    } else {
      l3Formatted = l3; // не разобрали — оставляем как есть
    }

    return `${l1} ${l2}: ${l3Formatted}`;
  }

  // Удаление дублей между цепочками
  function formatSection(text) {
    const lines = text.split('. ').map(s => s.trim()).filter(Boolean);
    const seen = new Set();
    const out = [];
    for (const line of lines) {
      const key = line.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      const formatted = formatChain(line);
      if (formatted) out.push(`• ${formatted}`);
    }
    return out.join('\n');
  }

  // МОЙ ОТЗЫВ
  if (share) {
    result += `МОЙ ОТЗЫВ\n${share}\n\n`;
  }

  // ВПЕЧАТЛЕНИЯ
  if (emotional) {
    result += `ВПЕЧАТЛЕНИЯ\n`;
    result += formatSection(emotional) + '\n\n';
  }

  // ПРОБЛЕМЫ
  if (factual) {
    result += `ПРОБЛЕМЫ\n`;
    result += formatSection(factual) + '\n\n';
  }

  // ПРЕДЛОЖЕНИЯ
  if (solutions) {
    result += `ПРЕДЛОЖЕНИЯ\n`;
    result += formatSection(solutions);
  }

  return result.trim();
}

onUnmounted(() => {
  if (rotationInterval) clearInterval(rotationInterval);
});
</script>

<style scoped>
:root {
  --signal-font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  --signal-font-mono: 'SF Mono', 'Monaco', monospace;
}

.signal-demo-wrapper {
  font-family: var(--signal-font-sans);
  width: 100%;
  max-width: none;
  margin: 0;
}

.signal-demo__header {
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
}

.signal-demo__breadcrumbs {
  display: flex;
  gap: 12px;
  align-items: center;
}

.signal-breadcrumb {
  appearance: none;
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 0;
}

.signal-breadcrumb-circle {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #444;
  transition: all 0.3s ease;
}

.signal-breadcrumb.is-active .signal-breadcrumb-circle {
  width: 24px;
  height: 8px;
  border-radius: 4px;
}

.signal-breadcrumb.contact.is-active .signal-breadcrumb-circle {
  background: linear-gradient(90deg, #00C2FF 0%, #00C2A8 100%);
  box-shadow: 0 0 10px rgba(0, 194, 168, 0.5);
}

.signal-breadcrumb.share.is-active .signal-breadcrumb-circle {
  background: #fff;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
}

.signal-breadcrumb.emotions.is-active .signal-breadcrumb-circle {
  background: #6f5d9f;
}

.signal-breadcrumb.facts.is-active .signal-breadcrumb-circle {
  background: #3a8862;
}

.signal-breadcrumb.solutions.is-active .signal-breadcrumb-circle {
  background: #4A90E2;
}

.signal-breadcrumb.summary.is-active .signal-breadcrumb-circle {
  background: #FFB800;
}

.signal-breadcrumb.location.is-active .signal-breadcrumb-circle {
  background: #5A9FB8;
}

.signal-controls-row {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.signal-info-button {
  background: rgba(135, 206, 235, 0.1);
  border: 1px solid rgba(135, 206, 235, 0.3);
  color: #87ceeb;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  height: 32px;
  display: inline-flex;
  align-items: center;
  width: auto;
}

.signal-info-button.signal-info-female {
  background: rgba(255, 105, 180, 0.1);
  border-color: rgba(255, 105, 180, 0.3);
  color: #ff69b4;
}

.signal-info-button.signal-info-female:hover {
  background: rgba(255, 105, 180, 0.2);
  border-color: rgba(255, 105, 180, 0.5);
}

.signal-info-button.signal-info-male {
  background: rgba(135, 206, 235, 0.1);
  border-color: rgba(135, 206, 235, 0.3);
  color: #87ceeb;
}

.signal-info-button.signal-info-male:hover {
  background: rgba(135, 206, 235, 0.2);
  border-color: rgba(135, 206, 235, 0.5);
}

.signal-gender-switch {
  display: flex;
  justify-content: center;
}

.signal-gender-container {
  display: flex;
  background: #2a2a2e;
  border-radius: 20px;
  padding: 4px;
  border: 1px solid #444;
  height: 32px;
  align-items: center;
}

.signal-gender-btn {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  margin: 0 2px;
}

.signal-gender-female {
  background: rgba(255, 105, 180, 0.3);
}

.signal-gender-female.is-active {
  background: #ff69b4;
  box-shadow: 0 0 12px rgba(255, 105, 180, 0.5);
}

.signal-gender-male {
  background: rgba(135, 206, 235, 0.3);
}

.signal-gender-male.is-active {
  background: #87ceeb;
  box-shadow: 0 0 12px rgba(135, 206, 235, 0.5);
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: #111;
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 12px;
  width: min(520px, 96vw);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
  padding: 32px;
}

.modal-title {
  font-weight: 700;
  font-size: 16px;
  margin-bottom: 16px;
}

.modal-body {
  font-size: 14px;
  line-height: 1.5;
}

.modal-link {
  color: #fff !important;
  font-weight: 600;
  transition: all 0.3s ease;
}

.modal-link:hover {
  color: #ddd !important;
}

.no-double-underline {
  text-decoration: none !important;
  border-bottom: 1px solid currentColor !important;
  padding-bottom: 1px !important;
}

.no-double-underline:hover {
  border-bottom: 1px solid currentColor !important;
}

.modal-footer {
  margin-top: 24px;
  display: flex;
  justify-content: flex-end;
}

.modal-ok {
  background: #222;
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #fff;
  border-radius: 8px;
  padding: 10px 16px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.modal-ok:hover {
  background: #333;
}

.signal-demo__form-container {
  background-color: #1E1E20;
  border-radius: 24px;
  padding: 2rem;
  color: #f0f0f0;
  border: 1px solid #2c2c2f;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
}

.signal-form-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.signal-question-block {
  background-color: #2a2a2e;
  border-radius: 16px;
  padding: 1.25rem;
  border: 1px solid #3a3a3e;
  border-left: 4px solid var(--accent-color, #444);
}

.signal-question-block.contact {
  border-left-color: #00C2A8 !important;
  border-left-width: 4px;
}

.signal-direction-label {
  font-weight: 600;
  font-size: 0.75rem;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.5rem;
}

.signal-rotating-phrase-container {
  min-height: 1.3em;
  margin-bottom: 0.6rem;
}

.signal-rotating-fixed-height {
  min-height: 2.6em;
}

.signal-question-label {
  font-weight: 500;
  font-size: 1rem;
  margin: 0;
  color: #f0f0f0;
  line-height: 1.3;
}

.fade-enter-active, .fade-leave-active { 
  transition: opacity 0.5s ease; 
}

.fade-enter-from, .fade-leave-to { 
  opacity: 0; 
}

textarea, .signal-input, .signal-select {
  width: 100%;
  background-color: #242426;
  border: 1px solid #444;
  border-radius: 10px;
  padding: 0.75rem 1rem;
  font-size: 0.95rem;
  color: #f0f0f0;
  transition: all 0.3s ease;
  font-family: var(--signal-font-sans);
  margin-bottom: 0.75rem;
}

textarea:focus, .signal-input:focus, .signal-select:focus {
  outline: none;
  border-color: var(--accent-color);
  background-color: #2a2a2e;
}

::placeholder { 
  color: #666; 
}

.signal-suggestions-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.75rem;
  margin-bottom: 0.5rem;
}

.signal-suggestion-bubble {
  padding: 0.35rem 0.85rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid transparent;
}

.signal-emotion-bubble {
  background: rgba(169, 114, 255, 0.1);
  border-color: rgba(169, 114, 255, 0.3);
  color: #A972FF;
}

.signal-fact-bubble {
  background: rgba(61, 220, 132, 0.1);
  border-color: rgba(61, 220, 132, 0.3);
  color: #3DDC84;
}

.signal-solution-bubble {
  background: rgba(74, 144, 226, 0.1);
  border-color: rgba(74, 144, 226, 0.3);
  color: #4A90E2;
}

/* Применяем ховер-эффекты только для устройств с мышью */
@media (hover: hover) and (pointer: fine) {
  .signal-emotion-bubble:hover {
    background: #A972FF;
    color: #000;
  }

  .signal-fact-bubble:hover {
    background: #3DDC84;
    color: #000;
  }
  
  /* Добавляем недостающий hover для .signal-solution-bubble */
  .signal-solution-bubble:hover {
    background: #4A90E2;
    color: #fff;
  }
}


.signal-solution-bubble:hover {
  background: #4A90E2;
  color: #fff;
}

.signal-reset-bubble {
  font-weight: 600;
  opacity: 0.8;
  font-size: 0.75rem;
  border-style: dashed !important;
}

.signal-example-hint {
  font-size: 0.8rem;
  color: #777;
  margin: 0.5rem 0 0 0.25rem;
  line-height: 1.15;
}

.signal-example-hint-white {
  color: #f0f0f0 !important;
}

.signal-example-hint b {
  color: #aaa;
  font-weight: 600;
}

.signal-next-button-container {
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.signal-humanize-button-container {
  order: 2;
}

.signal-liquid-humanize-btn {
  width: 100%;
  height: 56px;
  border-radius: 18px;
  border: 2px solid #444;
  background: #2a2a2e;
  color: #888;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.signal-liquid-humanize-btn:not(:disabled):hover {
  border-color: #666;
  color: #bbb;
  background: #333;
}

.signal-liquid-humanize-text {
  font-size: 16px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.signal-liquid-next-btn {
  width: 100%;
  height: 56px;
  border-radius: 20px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: all 0.3s ease;
  order: 1;
  font-size: 0;
}

.signal-liquid-next-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.signal-liquid-next-btn:not(:disabled):hover {
  transform: translateY(-2px);
}

.signal-liquid-next-text {
  font-size: 16px;
  font-weight: 600;
  text-transform: none;
  letter-spacing: normal;
  line-height: 1;
  display: flex;
  align-items: center;
}

.signal-next-icon {
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
  vertical-align: middle;
  transform: translate(0, 0px);
}

.signal-next-icon .signal-coffee-fill {
  fill: currentColor;
  opacity: 1;
  transition: height 0.3s ease-in-out, y 0.3s ease-in-out;
}


.signal-emotion-next {
  background: linear-gradient(135deg, #6f5d9f, #8a7ab8);
}

.signal-emotion-next .signal-liquid-next-text,
.signal-emotion-next .signal-next-icon {
  color: #fff;
}

.signal-fact-next {
  background: linear-gradient(135deg, #3a8862, #4fa87a);
}

.signal-fact-next .signal-liquid-next-text,
.signal-fact-next .signal-next-icon {
  color: #fff;
}

.signal-solution-next {
  background: linear-gradient(135deg, #4A90E2, #6BA8F0);
}

.signal-solution-next .signal-liquid-next-text,
.signal-solution-next .signal-next-icon {
  color: #fff;
}

.signal-summary-next {
  background: linear-gradient(135deg, #FFB800, #FFC933);
}

.signal-summary-next .signal-liquid-next-text,
.signal-summary-next .signal-next-icon {
  color: #000;
}

.signal-location-next {
  background: linear-gradient(135deg, #5A9FB8, #7AB8CD);
}

.signal-location-next .signal-liquid-next-text,
.signal-location-next .signal-next-icon {
  color: #fff;
}

.signal-columns {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.signal-column {
  flex: 1;
}

.signal-column label {
  display: block;
  font-size: 0.9rem;
  font-weight: 500;
  color: #aaa;
  margin-bottom: 0.5rem;
}

.signal-input-hint {
  font-size: 0.9rem;
  color: #777;
  margin-top: 0;
  line-height: 1.2;
}

.signal-agreement {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #ccc;
  cursor: pointer;
  margin: 0;
  padding: 0;
}

.signal-agreement input[type="checkbox"] {
  width: 16px;
  height: 16px;
  accent-color: #00C2A8;
  cursor: pointer;
  margin: 0;
  flex-shrink: 0;
}

.signal-agreement span {
  margin: 0;
  padding: 0;
  line-height: 1.4;
}

.signal-policy-link {
  color: #999 !important;
  padding: 0 !important;
  margin: 0 !important;
  transition: color 0.3s ease;
}

.signal-policy-link:hover {
  color: #fff !important;
}

.signal-submit-button {
  width: 100%;
  height: 56px;
  border-radius: 12px;
  border: none;
  background: linear-gradient(90deg, #A972FF 0%, #00C2FF 50%, #FFB800 100%);
  background-size: 200% auto;
  background-position: 25% 50%;
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.4s ease-out;
  margin-top: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 0;    /* Убрать любые паддинги */
}

.signal-submit-button .signal-liquid-next-text {
  display: block;
  width: 100%;
  text-align: center;
  padding: 0;   /* Убрать любые паддинги у текста */
  margin: 0;    /* Убрать любые отступы */
}

.signal-submit-button:hover:not(:disabled) {
  background-position: 75% 50%;
  transform: scale(1.02);
}

.signal-submit-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* ПРАВКА 1, 2: Экран подтверждения */
.signal-success-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 3rem 2rem;
  width: 100%;
}

.signal-success-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  width: 100%;
  max-width: 600px;
}

.signal-success-content h3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #fff;
  margin: 0 0 1.5rem 0;
  text-align: center;
}

/* ПРАВКА 1: Больше серого поля для тикета */
.signal-success-ticket-info {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  margin-bottom: 2.5rem;
  flex-wrap: wrap;
}

.signal-success-date {
  font-family: var(--signal-font-mono);
  font-size: 0.9rem;
  color: #888;
}

.signal-success-ticket {
  background-color: #2a2a2e;
  color: #fff;
  font-weight: 700;
  padding: 0.7rem 2.5rem !important;
  border-radius: 12px;
  letter-spacing: 1px;
  font-family: var(--signal-font-mono);
  font-size: 1.1rem;
}

.signal-success-description {
  color: #b0b0b0;
  line-height: 1.6;
  margin: 0 0 1.5rem 0;
  text-align: center !important;
  width: 100% !important;
  display: block !important;
}

/* ПРАВКА 3, 4: Кнопка без артефактов */
.signal-telegram-button {
  display: inline-block;
  padding: 0.8rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  text-decoration: none !important;
  border: none !important;
  outline: none !important;
  box-shadow: none !important;
  transition: all 0.3s;
}

.signal-telegram-button.female {
  background-color: #ff69b4;
  color: #fff;
}

.signal-telegram-button.male {
  background-color: #87ceeb;
  color: #000;
}

.signal-telegram-button:hover {
  filter: brightness(110%);
  transform: scale(1.05);
  text-decoration: none !important;
  border: none !important;
}

.signal-secondary-link {
  display: block;
  margin-top: 1.5rem;
  font-size: 0.85rem;
  color: #888;
  transition: color 0.3s;
}

.signal-secondary-link:hover {
  color: #fff !important;
}

@media (max-width: 768px) {
  .signal-demo__header {
    margin-bottom: 12px;
  }

  .signal-controls-row {
    margin-bottom: 12px;
  }

  /* Увеличиваем ширину основного контейнера формы */
  .signal-demo__form-container {
    padding: 1rem 0.75rem; /* Уменьшаем боковые отступы */
    max-width: 100%; /* Используем всю доступную ширину */
  }
  
  /* Увеличиваем ширину блока с вопросами */
  .signal-question-block {
    padding: 1rem 0.85rem; /* Уменьшаем внутренние отступы */
  }

  /* Увеличиваем ширину кнопки "Дальше" */
  .signal-liquid-next-btn {
    width: 100%;
    height: 52px; /* Можно немного уменьшить высоту для мобильных */
  }

  /* Увеличиваем размер шрифта в баблах подсказок */
  .signal-suggestion-bubble {
    font-size: 0.85rem; /* Немного больше для удобства нажатия */
    padding: 0.4rem 0.9rem;
  }
  
  .signal-columns {
    flex-direction: column;
    gap: 1rem;
  }

  .signal-success-ticket-info {
    flex-direction: column;
    gap: 0.75rem;
  }

  .signal-success-ticket {
    padding: 0.6rem 2rem;
  }
}

  .signal-incognito-toggle {
  margin-bottom: 12px;
}

.signal-toggle-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  user-select: none;
}

.signal-toggle-checkbox {
  display: none;
}

.signal-toggle-slider {
  position: relative;
  width: 48px;
  height: 26px;
  background-color: #444;
  border-radius: 26px;
  transition: background-color 0.3s ease;
  flex-shrink: 0;
}

.signal-toggle-slider::before {
  content: '';
  position: absolute;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: #fff;
  top: 3px;
  left: 3px;
  transition: transform 0.3s ease;
}

.signal-toggle-checkbox:checked + .signal-toggle-slider {
  background-color: #00C2A8;
}

.signal-toggle-checkbox:checked + .signal-toggle-slider::before {
  transform: translateX(22px);
}

.signal-toggle-text {
  font-size: 0.95rem;
  font-weight: 500;
  color: #ccc;
}

.signal-name-field {
  margin-bottom: 12px;
}

.signal-name-field label {
  display: block;
  font-size: 0.9rem;
  font-weight: 500;
  color: #FFFFFF;
  margin-bottom: 0.5rem;
}

/* Плавная смена иконок */
.signal-next-icon {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  transform: translateY(1px);
  transition: opacity 0.2s ease-in-out; /* ← ДОБАВИТЬ */
}

</style>
