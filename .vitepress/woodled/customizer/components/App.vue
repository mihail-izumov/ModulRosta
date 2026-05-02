<script setup lang="ts">
/**
 * App.vue — Корневой компонент конфигуратора.
 *
 * Источник: woodled-v42.jsx (App).
 * Отвечает за:
 *   - Главный экран: заголовок + 4 блока (онбординг, сториз, промо) + сетка комнат + StickyBar
 *   - Переключение на RoomDetail при active !== null
 *   - Модалки: TypePicker, NameModal, FirstModal, StoryModal, BuyModal, ShareModal
 *   - Toast внизу
 */

import { computed, onMounted, ref } from 'vue'
import { T } from '../theme/tokens'
import { useConfigurator } from '../store/configurator'
import type { Room } from '../data/rooms'
import { getRT } from '../data/rooms'
import { rw } from '../engine/i18n'
import Icon from './ui/Icons.vue'
import Toast from './ui/Toast.vue'

import OnboardingLink from './OnboardingLink.vue'
import StoryLink from './StoryLink.vue'
import PromoBlock from './PromoBlock.vue'
import RoomCard from './RoomCard.vue'
import SoundButton from './SoundButton.vue'
import StickyBar from './StickyBar.vue'
import Footer from './Footer.vue'
import TypePicker from './TypePicker.vue'
import NameModal from './NameModal.vue'
import FirstModal from './FirstModal.vue'
import StoryModal from './StoryModal.vue'
import BuyModal from './BuyModal.vue'
import ShareModal from './ShareModal.vue'
import ColorPickerModal from './ColorPickerModal.vue'
import RoomDetail from './RoomDetail.vue'

const cfg = useConfigurator()

/* Подхватываем shared-ссылку при загрузке. Только на клиенте. */
onMounted(() => {
  cfg.loadFromHash()
})

const rooms = computed<Room[]>(() => cfg.rooms as Room[])

/**
 * Отсортированный список для главной сетки: заполненные сверху.
 * Относительный порядок внутри каждой группы сохраняется.
 * Сам массив в store не переставляется — иначе IDs путаются при навигации.
 */
const sortedRooms = computed<Room[]>(() => {
  return [...rooms.value].sort((a, b) => {
    const aFilled = a.fixtures.length > 0 ? 0 : 1
    const bFilled = b.fixtures.length > 0 ? 0 : 1
    return aFilled - bFilled
  })
})

const activeRoom = computed(() => cfg.activeRoom.value)

/* ──────────────── Обработчики ──────────────── */

function onPromoClick() {
  const lr = rooms.value.find((r) => r.typeId === 'living')
  if (lr) cfg.active.value = lr.id
}

function onEditRoom(room: Room) {
  cfg.updateRoom(room)
}

function onDeleteRoom() {
  if (activeRoom.value) cfg.removeRoom(activeRoom.value.id)
}

function onCloseRoom() {
  cfg.active.value = null
}

/* ──────────────── Цвет карточки ──────────────── */

const colorPickRoom = ref<Room | null>(null)

function onPickColor(room: Room) {
  colorPickRoom.value = room
}

function onColorPicked(color: string | undefined) {
  if (colorPickRoom.value) {
    cfg.updateRoom({ ...colorPickRoom.value, cardColor: color })
    colorPickRoom.value = { ...colorPickRoom.value, cardColor: color }
  }
}

/* Тексты в заголовке. */
const subtitle = computed(() => {
  const n = rooms.value.length
  if (n === 0) return 'Добавьте комнату'
  return `${n} ${rw(n)}`
})
</script>

<template>
  <!-- Экран комнаты (полный экран) -->
  <template v-if="activeRoom">
    <RoomDetail
      :room="activeRoom"
      @update="onEditRoom"
      @delete="onDeleteRoom"
      @close="onCloseRoom"
      @feedback="cfg.showFB"
    />
    <Toast :msg="cfg.fb.value" @done="cfg.clearFB" />
  </template>

  <!-- Главный экран -->
  <template v-else>
    <div
      :style="{
        maxWidth: '560px',
        margin: '0 auto',
        padding: '16px',
        fontFamily: `'Segoe UI', system-ui, sans-serif`,
        color: T.text,
        background: T.bg,
        minHeight: '100vh',
      }"
    >
      <!-- Заголовок -->
      <div :style="{ textAlign: 'center', marginBottom: '20px', paddingTop: '8px' }">
        <div
          :style="{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }"
        >
          <div :style="{ fontSize: '20px', fontWeight: 700, color: T.text }">
            {{ cfg.name.value }}
          </div>
          <button
            :style="{
              background: 'none',
              border: 'none',
              color: T.textSec,
              cursor: 'pointer',
              padding: '4px',
            }"
            @click="cfg.showName.value = true"
          >
            <Icon name="pen" :color="T.textSec" :size="18" />
          </button>
        </div>
        <div :style="{ fontSize: '11px', color: T.textDim, marginTop: '2px' }">
          {{ subtitle }}
        </div>
      </div>

      <!-- Сетка комнат -->
      <div
        :style="{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '10px',
          marginBottom: '16px',
        }"
      >
        <RoomCard
          v-for="r in sortedRooms"
          :key="r.id"
          :room="r"
          @click="cfg.active.value = r.id"
          @pick-color="onPickColor(r)"
        />
        <div
          :style="{
            border: `1px dashed ${T.border}`,
            borderRadius: '12px',
            minHeight: '140px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            cursor: 'pointer',
            color: T.textDim,
            gap: '6px',
          }"
          @click="cfg.picker.value = true"
        >
          <div :style="{ fontSize: '28px' }">+</div>
          <div :style="{ fontSize: '11px' }">Добавить комнату</div>
        </div>
      </div>

      <!-- Промо (всегда) -->
      <PromoBlock @click="onPromoClick" />

      <!-- Сториз (если есть светильники) -->
      <StoryLink
        v-if="cfg.hasFixtures.value"
        @click="cfg.showStory.value = true"
      />

      <!-- Онбординг (всегда) -->
      <OnboardingLink />

      <!-- Sticky bar (если есть светильники) -->
      <StickyBar
        v-if="cfg.hasFixtures.value"
        @share="cfg.showShare.value = true"
        @buy="cfg.showBuy.value = true"
      />

      <Footer />

      <!-- Bottom spacer для sticky bar -->
      <div v-if="cfg.hasFixtures.value" :style="{ height: '80px' }" />

      <!-- ───── Модалки ───── -->

      <TypePicker
        v-if="cfg.picker.value"
        @pick="(tid) => cfg.add(tid)"
        @close="cfg.picker.value = false"
      />

      <FirstModal
        v-if="cfg.showFirst.value"
        :rooms="rooms"
        :first-id="cfg.firstId.value"
        @update="(id) => (cfg.firstId.value = id)"
        @close="cfg.showFirst.value = false"
      />

      <NameModal
        v-if="cfg.showName.value"
        :value="cfg.name.value"
        @save="cfg.setName"
        @close="cfg.showName.value = false"
      />

      <StoryModal
        v-if="cfg.showStory.value"
        :rooms="rooms"
        :name="cfg.name.value"
        @close="cfg.showStory.value = false"
      />

      <BuyModal
        v-if="cfg.showBuy.value"
        :rooms="rooms"
        @edit-fx="(roomId, fxIdx, next) => {
          if (next === null) cfg.removeFixture(roomId, fxIdx)
          else cfg.updateFixture(roomId, fxIdx, next)
        }"
        @close="cfg.showBuy.value = false"
        @feedback="cfg.showFB"
      />

      <ShareModal
        v-if="cfg.showShare.value"
        :name="cfg.name.value"
        :rooms="rooms"
        @close="cfg.showShare.value = false"
        @feedback="cfg.showFB"
      />

      <ColorPickerModal
        v-if="colorPickRoom"
        :current="colorPickRoom.cardColor"
        :room-name="colorPickRoom.customName || getRT(colorPickRoom.typeId).name"
        @pick="onColorPicked"
        @close="colorPickRoom = null"
      />

      <Toast :msg="cfg.fb.value" @done="cfg.clearFB" />
    </div>
  </template>

  <!-- Глобальная кнопка звука — поверх всех экранов -->
  <div
    :style="{
      position: 'fixed',
      top: '10px',
      right: '16px',
      zIndex: 45,
    }"
  >
    <SoundButton />
  </div>
</template>

<!-- Глобальные стили — не scoped, применяются ко всему документу.
     В VitePress можно вынести в theme/custom.css, но inline проще при миграции. -->
<style>
html, body {
  background: #13110E !important;
  margin: 0;
  padding: 0;
}
input::placeholder,
textarea::placeholder {
  color: #5C544A !important;
  opacity: 0.7 !important;
}
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}
</style>
