<script setup lang="ts">
/**
 * App.vue — Корневой роутер.
 *
 * Изменение: вычисляет контекст комнаты (area, baseLm, currentLmWithoutThis)
 * и передаёт в FxEditor для рекомендации размера (см. AUTOSIZE.md).
 */

import { computed, onMounted, ref, watch, nextTick } from 'vue'
import { T } from '../theme/tokens'
import { useConfigurator } from '../store/configurator'
import type { Room } from '../data/rooms'
import { getRT } from '../data/rooms'
import { MD } from '../data/catalog'
import { baseLm, fxLm, getArea } from '../engine/brightness'
import { rw } from '../engine/i18n'
import type { Fixture } from '../data/catalog'
import Icon from './ui/Icons.vue'
import Toast from './ui/Toast.vue'

import OnboardingLink from './OnboardingLink.vue'
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
import FxEditor from './FxEditor.vue'
import MoodDetailModal from './MoodDetailModal.vue'
import WelcomeScreen from './WelcomeScreen.vue'
import Preloader from './Preloader.vue'
import HouseStats from './HouseStats.vue'
import Modal from './ui/Modal.vue'
import { readModelLink, clearModelLink } from '../engine/useModelLink'
import { decodeFixture, readHashFixture } from '../engine/share'

const cfg = useConfigurator()

/* ────────── Deeplinks ────────── */

onMounted(() => {
  if (cfg.loadFromHash()) {
    cfg.dismissWelcome()
    return
  }

  const fxEncoded = readHashFixture()
  if (fxEncoded) {
    const fx = decodeFixture(fxEncoded)
    if (fx) {
      let targetRoom = cfg.rooms.find((r: Room) => r.typeId === 'living') ?? null
      if (!targetRoom) {
        const roomId = cfg.add('living')
        targetRoom = cfg.rooms.find((r: Room) => r.id === roomId) ?? null
      }
      if (targetRoom) {
        cfg.addFixture(targetRoom.id, fx)
        const fxIdx = targetRoom.fixtures.length - 1
        cfg.showBuy.value = true
        cfg.openFx(targetRoom.id, fxIdx)
      }
      cfg.dismissWelcome()
    }
    window.history.replaceState({}, '', window.location.pathname)
    return
  }

  const link = readModelLink()
  if (link) {
    let targetRoom = cfg.rooms.find((r: Room) => r.typeId === 'living') ?? null
    if (!targetRoom) {
      const roomId = cfg.add('living')
      targetRoom = cfg.rooms.find((r: Room) => r.id === roomId) ?? null
    }
    if (targetRoom) {
      const fx = { m: link.modelId, q: 1, wood: 'oak' as const, zone: link.zone }
      cfg.addFixture(targetRoom.id, fx)
      const fxIdx = targetRoom.fixtures.length - 1
      cfg.showBuy.value = true
      cfg.openFx(targetRoom.id, fxIdx)
      cfg.dismissWelcome()
    }
    clearModelLink()
    return
  }

  if (cfg.welcomeSeen.value) {
    cfg.ensureStarterRooms()
  }
})

/* ────────── Computed ────────── */

const rooms = computed<Room[]>(() => cfg.rooms as Room[])

const sortedRooms = computed<Room[]>(() => {
  return [...rooms.value].sort((a, b) => {
    const aFilled = a.fixtures.length > 0 ? 0 : 1
    const bFilled = b.fixtures.length > 0 ? 0 : 1
    return aFilled - bFilled
  })
})

const activeRoom = computed(() => cfg.activeRoom.value)

const subtitle = computed(() => {
  const n = rooms.value.length
  if (n === 0) return 'Добавьте комнату'
  return `${n} ${rw(n)}`
})

const activeFxData = computed(() => {
  const af = cfg.activeFx.value
  if (!af) return null
  const room = cfg.rooms.find((r: Room) => r.id === af.roomId)
  if (!room) return null
  const fx = room.fixtures[af.fxIdx]
  if (!fx) return null
  return { room, fx, roomId: af.roomId, fxIdx: af.fxIdx }
})

/**
 * Контекст комнаты для FxEditor — площадь, baseLm, currentLm без этого светильника.
 * Используется для рекомендации размера в шаге «Размер» (AUTOSIZE.md).
 * null если нет активного светильника или комнаты.
 */
const fxEditorRoomContext = computed(() => {
  if (!activeFxData.value) return null
  const { room, fx } = activeFxData.value
  const rt = getRT(room.typeId)
  const roomArea = getArea(rt, room as Room)
  const roomBaseLm = baseLm(rt, room as Room)
  const roomCurrentLm = fxLm(room.fixtures)
  const m = MD[fx.m]
  const thisFxLm = m ? m.lmPer * (fx.l ?? m.lamps) * (fx.q ?? 1) : 0
  const roomCurrentLmWithoutThis = roomCurrentLm - thisFxLm
  const roomName = (room as Room).customName || rt.name
  return { roomArea, roomBaseLm, roomCurrentLmWithoutThis, roomName }
})

const fxBackLabel = computed(() => {
  if (cfg.showBuy.value) return '← Мой лес'
  if (cfg.active.value) return '← Комната'
  return '← Назад'
})

const stickyVisible = computed(
  () =>
    cfg.hasFixtures.value &&
    !cfg.showBuy.value &&
    !cfg.activeFx.value &&
    !cfg.showMoodDetail.value,
)

/* ────────── Handlers ────────── */

function onPromoClick() {
  cfg.showBuy.value = true
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

function onBuyEditFx(roomId: string, fxIdx: number, next: Fixture | null) {
  if (next === null) cfg.removeFixture(roomId, fxIdx)
  else cfg.updateFixture(roomId, fxIdx, next)
}

function onBuyClose() {
  cfg.showBuy.value = false
  cfg.active.value = null
}

function onFxSave(next: Fixture) {
  const af = cfg.activeFx.value
  if (!af) return
  cfg.updateFixture(af.roomId, af.fxIdx, next)
  cfg.showFB('Светильник сохранён')
  cfg.closeFx()
}

function onFxDelete() {
  const af = cfg.activeFx.value
  if (!af) return
  cfg.removeFixture(af.roomId, af.fxIdx)
  cfg.closeFx()
  cfg.showFB('Светильник удалён')
}

function onFxClose() {
  cfg.closeFx()
}

/* ────────── Цвет карточки ────────── */

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

/* ────────── Сброс ────────── */

const showResetConfirm = ref(false)

function onResetClick() {
  showResetConfirm.value = true
}

function onResetConfirm() {
  cfg.resetAll()
  showResetConfirm.value = false
}

function onResetCancel() {
  showResetConfirm.value = false
}

function onSaveShareLink() {
  cfg.showShare.value = true
}

const anyModalOpen = computed<boolean>(() =>
  cfg.showFirst.value ||
  cfg.showName.value ||
  cfg.showStory.value ||
  cfg.showShare.value ||
  cfg.showMoodDetail.value !== null ||
  cfg.picker.value ||
  colorPickRoom.value !== null ||
  showResetConfirm.value,
)

/* ────────── Scroll to top ────────── */

watch(
  () => [cfg.active.value, cfg.activeFx.value, cfg.welcomeSeen.value, cfg.showBuy.value],
  () => {
    nextTick(() => window.scrollTo({ top: 0, behavior: 'instant' }))
  },
)

/* ────────── Preloader ────────── */

const preloaderDone = ref(false)

watch(
  () => cfg.welcomeSeen.value,
  (seen) => {
    if (!seen) preloaderDone.value = false
  },
)

function onPreloaderDone() {
  preloaderDone.value = true
}
</script>

<template>
  <!-- ═══════ МАРШРУТЫ (взаимоисключающие) ═══════ -->
  <template v-if="activeFxData">
    <FxEditor
      :key="activeFxData.roomId + ':' + activeFxData.fxIdx"
      :item="activeFxData.fx"
      :def-wood="activeFxData.fx.wood ?? 'oak'"
      :back-label="fxBackLabel"
      :room-area="fxEditorRoomContext?.roomArea"
      :room-base-lm="fxEditorRoomContext?.roomBaseLm"
      :room-current-lm-without-this="fxEditorRoomContext?.roomCurrentLmWithoutThis"
      :room-name="fxEditorRoomContext?.roomName"
      @save="onFxSave"
      @delete="onFxDelete"
      @close="onFxClose"
      @feedback="cfg.showFB"
    />
  </template>

  <template v-else-if="activeRoom">
    <RoomDetail
      :room="activeRoom"
      @update="onEditRoom"
      @delete="onDeleteRoom"
      @close="onCloseRoom"
      @feedback="cfg.showFB"
      @open-fx="(roomId, fxIdx) => cfg.openFx(roomId, fxIdx)"
    />
  </template>

  <template v-else-if="!cfg.welcomeSeen.value">
    <Transition name="preloader-fade" mode="out-in">
      <Preloader v-if="!preloaderDone" key="preloader" @done="onPreloaderDone" />
      <WelcomeScreen v-else key="welcome" />
    </Transition>
  </template>

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
      <div :style="{ textAlign: 'center', marginBottom: '20px', paddingTop: '8px' }">
        <div
          :style="{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }"
        >
          <div :style="{ fontSize: '22px', fontWeight: 700, color: T.text }">
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
        <div
          :style="{
            display: 'inline-block',
            marginTop: '6px',
            padding: '3px 12px',
            borderRadius: '10px',
            background: T.neutral + '18',
            fontSize: '10px',
            fontWeight: 700,
            color: T.neutral,
            letterSpacing: '0.5px',
          }"
        >
          WOODLED ROTOR
        </div>
      </div>

      <HouseStats
        @share-link="onSaveShareLink"
        @change-home="onResetClick"
      />

      <div
        :style="{
          fontSize: '16px',
          fontWeight: 600,
          color: T.text,
          marginBottom: '12px',
          marginTop: '20px',
          textAlign: 'center',
        }"
      >
        {{ subtitle }}
      </div>

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

      <PromoBlock @click="onPromoClick" />
      <OnboardingLink />
      <Footer />

      <div v-if="stickyVisible" :style="{ height: '80px' }" />
    </div>
  </template>

  <!-- ═══════ Модалки ═══════ -->
  <template v-if="!activeFxData">
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

    <BuyModal
      v-if="cfg.showBuy.value"
      :rooms="rooms"
      @edit-fx="onBuyEditFx"
      @open-fx="(roomId, fxIdx) => cfg.openFx(roomId, fxIdx)"
      @close="onBuyClose"
      @feedback="cfg.showFB"
      @story="cfg.showStory.value = true"
    />

    <StoryModal
      v-if="cfg.showStory.value"
      :rooms="rooms"
      :name="cfg.name.value"
      @close="cfg.showStory.value = false"
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

    <MoodDetailModal
      v-if="cfg.showMoodDetail.value"
      :mood="cfg.showMoodDetail.value"
      @close="cfg.showMoodDetail.value = null"
    />

    <Modal v-if="showResetConfirm" @close="onResetCancel">
      <div :style="{ padding: '24px 20px', textAlign: 'center' }">
        <div
          :style="{
            fontSize: '17px',
            fontWeight: 700,
            color: T.text,
            marginBottom: '10px',
          }"
        >
          Сбросить дом?
        </div>
        <div
          :style="{
            fontSize: '13px',
            color: T.textSec,
            lineHeight: 1.55,
            marginBottom: '20px',
            maxWidth: '320px',
            marginLeft: 'auto',
            marginRight: 'auto',
          }"
        >
          Текущий дом и все настройки сбросятся. Вы вернётесь к выбору формата.
        </div>
        <div :style="{ display: 'flex', gap: '8px' }">
          <button
            :style="{
              flex: 1,
              padding: '12px',
              background: 'none',
              border: `1px solid ${T.border}`,
              color: T.textSec,
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 600,
              fontFamily: 'inherit',
            }"
            @click="onResetCancel"
          >
            Отмена
          </button>
          <button
            :style="{
              flex: 1,
              padding: '12px',
              background: T.neutral,
              color: T.bg,
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 700,
              fontFamily: 'inherit',
            }"
            @click="onResetConfirm"
          >
            Да, сбросить
          </button>
        </div>
      </div>
    </Modal>

    <StickyBar
      v-if="stickyVisible"
      @share="cfg.showShare.value = true"
      @buy="cfg.showBuy.value = true"
    />
  </template>

  <!-- ═══════ ГЛОБАЛЬНЫЕ ═══════ -->
  <div
    :style="{
      position: 'fixed',
      top: '10px',
      right: '16px',
      zIndex: 90,
      display: anyModalOpen ? 'none' : 'block',
    }"
  >
    <SoundButton />
  </div>

  <Toast :msg="cfg.fb.value" @done="cfg.clearFB" />
</template>

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

.preloader-fade-leave-active {
  transition: opacity 0.8s ease;
}
.preloader-fade-enter-active {
  transition: opacity 0.6s ease;
}
.preloader-fade-leave-to,
.preloader-fade-enter-from {
  opacity: 0;
}
</style>
