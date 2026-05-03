<script setup lang="ts">
/**
 * App.vue — Корневой роутер.
 *
 * Архитектура — взаимоисключающие «маршруты»:
 *   1. FxEditor   (cfg.activeFx) — топ-приоритет, полный экран светильника
 *   2. BuyModal   (cfg.showBuy)  — поверх главной/RoomDetail, но ниже FxEditor
 *   3. RoomDetail (cfg.active)   — карточка комнаты
 *   4. Home                       — главный экран
 *
 * Когда открыт FxEditor, всё остальное РАЗМОНТИРОВАНО — никаких stacking
 * context'ов и z-index гонок. Это гарантирует, что страница светильника
 * виден всегда поверх любого другого UI.
 */

import { computed, onMounted, ref } from 'vue'
import { T } from '../theme/tokens'
import { useConfigurator } from '../store/configurator'
import type { Room } from '../data/rooms'
import { getRT } from '../data/rooms'
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
import { readModelLink, clearModelLink } from '../engine/useModelLink'
import { decodeFixture, readHashFixture } from '../engine/share'

const cfg = useConfigurator()

/* ────────── Deeplinks ────────── */

onMounted(() => {
  cfg.loadFromHash()

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
    }
    clearModelLink()
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

const fxBackLabel = computed(() => {
  if (cfg.showBuy.value) return '← Мой лес'
  if (cfg.active.value) return '← Комната'
  return '← Назад'
})

const stickyVisible = computed(
  () => cfg.hasFixtures.value && !cfg.showBuy.value && !cfg.activeFx.value,
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
</script>

<template>
  <!-- ═══════ РЕЖИМ 1: открыт светильник — только он + звук + тосты ═══════ -->
  <template v-if="activeFxData">
    <FxEditor
      :key="activeFxData.roomId + ':' + activeFxData.fxIdx"
      :item="activeFxData.fx"
      :def-wood="activeFxData.fx.wood ?? 'oak'"
      :back-label="fxBackLabel"
      @save="onFxSave"
      @delete="onFxDelete"
      @close="onFxClose"
      @feedback="cfg.showFB"
    />

    <div :style="{ position: 'fixed', top: '10px', right: '16px', zIndex: 90 }">
      <SoundButton />
    </div>

    <Toast :msg="cfg.fb.value" @done="cfg.clearFB" />
  </template>

  <!-- ═══════ РЕЖИМ 2: всё остальное ═══════ -->
  <template v-else>
    <!-- Главный или RoomDetail (взаимоисключающие) -->
    <template v-if="activeRoom">
      <RoomDetail
        :room="activeRoom"
        @update="onEditRoom"
        @delete="onDeleteRoom"
        @close="onCloseRoom"
        @feedback="cfg.showFB"
        @open-fx="(roomId, fxIdx) => cfg.openFx(roomId, fxIdx)"
      />
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

        <div
          :style="{
            fontSize: '14px',
            fontWeight: 600,
            color: T.text,
            marginBottom: '10px',
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

    <!-- Глобальные модалки (НЕ показываются если открыт FxEditor) -->
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
      @close="cfg.showBuy.value = false"
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

    <div :style="{ position: 'fixed', top: '10px', right: '16px', zIndex: 90 }">
      <SoundButton />
    </div>

    <StickyBar
      v-if="stickyVisible"
      @share="cfg.showShare.value = true"
      @buy="cfg.showBuy.value = true"
    />

    <Toast :msg="cfg.fb.value" @done="cfg.clearFB" />
  </template>
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
</style>
