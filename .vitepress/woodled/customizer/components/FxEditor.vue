<script setup lang="ts">
/**
 * FxEditor.vue — Полноэкранный редактор светильника.
 *
 * Источник: woodled-v42.jsx (FxEditor).
 * Секции: Дерево, Размер (если есть family), Патроны (слайдер), Температура,
 * Чаша (только люстры), Крепление (только люстры), Дополнительно.
 */

import { computed, ref, watch } from 'vue'
import { T, Z } from '../theme/tokens'
import {
  MD, FAMILIES,
  type Fixture, type ModelId,
} from '../data/catalog'
import {
  MATS, BOWLS, MOUNTS, BTEMPS, DEF_OPT,
  WOOD_TIPS, BOWL_TIPS, MOUNT_TIPS, BTEMP_TIPS, OPT_TIPS,
  WCOL, type Wood, type Bowl, type Mount,
} from '../data/materials'
import { itemPrice } from '../engine/price-engine'
import { lw } from '../engine/i18n'
import Icon, { fxIcName } from './ui/Icons.vue'
import Chip from './ui/Chip.vue'
import Sec from './ui/Sec.vue'

interface Props {
  item: Fixture
  defWood?: Wood
}
const props = defineProps<Props>()
const emit = defineEmits<{
  save: [fx: Fixture]
  delete: []
  close: []
  feedback: [msg: string]
}>()

/* ──────────────── Локальный state ──────────────── */

/* Копия item с гарантированными значениями. */
const s = ref<Fixture>({
  ...props.item,
  wood: props.item.wood ?? props.defWood ?? 'oak',
  l: props.item.l ?? MD[props.item.m].lamps,
  opts: { ...DEF_OPT, ...(props.item.opts ?? {}) },
})

/* Если props.item сменится (редкий кейс) — пересобрать. */
watch(
  () => props.item,
  (v) => {
    s.value = {
      ...v,
      wood: v.wood ?? props.defWood ?? 'oak',
      l: v.l ?? MD[v.m].lamps,
      opts: { ...DEF_OPT, ...(v.opts ?? {}) },
    }
  },
)

const m = computed(() => MD[s.value.m])
const isL = computed(() => m.value.type === 'люстра')
const vars = computed<ModelId[] | null>(() =>
  m.value.family ? [...FAMILIES[m.value.family]] : null,
)
const price = computed(() => itemPrice(s.value))

const fType = computed(() => {
  const t = m.value.type
  return t.charAt(0).toUpperCase() + t.slice(1)
})

/* ──────────────── Мутации ──────────────── */

function setWood(w: Wood) {
  s.value = { ...s.value, wood: w }
  emit('feedback', WOOD_TIPS[w])
}

function setSize(mid: ModelId) {
  const nm = MD[mid]
  s.value = { ...s.value, m: mid, l: nm.lamps }
  const lm = nm.lamps * nm.lmPer
  const msg = mid.includes('1000')
    ? 'Максимальный размер — для больших пространств'
    : `${nm.name}: ${nm.lamps} ${lw(nm.lamps)}, свет на ${lm} лм`
  emit('feedback', msg)
}

function setLamps(v: number) {
  const mv = m.value
  const prev = s.value.l ?? mv.lamps
  const diff = v - prev
  s.value = { ...s.value, l: v }

  let msg = ''
  if (v > prev) {
    msg =
      v === mv.lamps
        ? 'Стандартная комплектация'
        : `+${v - mv.lamps} патрон${v - mv.lamps === 1 ? '' : 'а'} — ярче свет, +${diff * mv.sur} ₽`
  } else {
    msg = v === mv.lamps ? 'Стандартная комплектация' : 'Меньше патронов — мягче свет'
  }
  emit('feedback', msg)
}

function setOpt<K extends keyof typeof DEF_OPT>(k: K, v: (typeof DEF_OPT)[K], toast?: string) {
  s.value = {
    ...s.value,
    opts: { ...(s.value.opts ?? DEF_OPT), [k]: v },
  }
  if (toast) emit('feedback', toast)
}

function setBtemp(id: string) {
  setOpt('btemp', id, BTEMP_TIPS[id])
}

function setBowl(b: Bowl) {
  setOpt('bowl', b, BOWL_TIPS[b])
}

function setMount(mt: Mount) {
  setOpt('mount', mt, MOUNT_TIPS[mt])
}

function toggleDiffuser() {
  const next = !s.value.opts?.diffuser
  setOpt('diffuser', next, next ? OPT_TIPS.diffuser.on : OPT_TIPS.diffuser.off)
}
function toggleMoisture() {
  const next = !s.value.opts?.moisture
  setOpt('moisture', next, next ? OPT_TIPS.moisture.on : OPT_TIPS.moisture.off)
}
function toggleBulbs() {
  const next = !s.value.opts?.bulbs
  setOpt('bulbs', next, next ? OPT_TIPS.bulbs.on : OPT_TIPS.bulbs.off)
}

function save() {
  emit('save', s.value)
  emit('close')
}

/** Для предупреждения «Потеряете N лм — станет темнее». */
const lostLm = computed(() => (s.value.l ?? m.value.lamps) * m.value.lmPer)
</script>

<template>
  <div
    :style="{
      position: 'fixed',
      inset: 0,
      background: T.bg,
      zIndex: Z.fullscreenModal,
      overflow: 'auto',
    }"
  >
    <div
      :style="{
        padding: '20px',
        maxWidth: '480px',
        margin: '0 auto',
        position: 'relative',
      }"
    >
      <!-- Закрытие -->
      <button
        :style="{
          position: 'absolute',
          top: '16px',
          right: '16px',
          background: 'none',
          border: 'none',
          color: T.textDim,
          fontSize: '22px',
          cursor: 'pointer',
          zIndex: 1,
        }"
        @click="emit('close')"
      >
        ✕
      </button>

      <!-- Заголовок: иконка + название + цена -->
      <div
        :style="{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '16px',
          marginBottom: '20px',
        }"
      >
        <div
          :style="{
            width: '80px',
            height: '80px',
            borderRadius: '14px',
            background: WCOL[s.wood] + '22',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }"
        >
          <Icon
            :name="fxIcName(m.type)"
            :color="WCOL[s.wood]"
            :size="44"
          />
        </div>
        <div>
          <div
            :style="{
              fontSize: '10px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '1px',
              color: T.neutral,
              marginBottom: '2px',
            }"
          >
            {{ fType }}
          </div>
          <div :style="{ fontSize: '22px', fontWeight: 700, color: T.text }">
            {{ m.name }}
          </div>
          <div
            :style="{
              fontSize: '16px',
              fontWeight: 600,
              color: T.neutral,
              marginTop: '2px',
            }"
          >
            {{ price.toLocaleString('ru-RU') }} ₽
          </div>
        </div>
      </div>

      <!-- Дерево -->
      <Sec label="Дерево">
        <div :style="{ display: 'flex', gap: '8px' }">
          <button
            v-for="mt in MATS"
            :key="mt.id"
            :style="{
              flex: 1,
              padding: '12px 0',
              borderRadius: '10px',
              cursor: 'pointer',
              border: s.wood === mt.id
                ? `2px solid ${WCOL[mt.id]}`
                : `1px solid ${T.border}`,
              background: s.wood === mt.id ? WCOL[mt.id] + '22' : T.card,
              textAlign: 'center',
            }"
            @click="setWood(mt.id)"
          >
            <div
              :style="{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: WCOL[mt.id],
                margin: '0 auto',
                border: mt.id === 'black' ? `2px solid ${T.textDim}` : 'none',
              }"
            />
            <div
              :style="{
                fontSize: '12px',
                fontWeight: 600,
                color: s.wood === mt.id ? T.text : T.textSec,
                marginTop: '6px',
              }"
            >
              {{ mt.name }}
            </div>
          </button>
        </div>
      </Sec>

      <!-- Размер (если семейство содержит >1 модель) -->
      <Sec v-if="vars && vars.length > 1" label="Размер">
        <div :style="{ display: 'flex', gap: '6px' }">
          <Chip
            v-for="vid in vars"
            :key="vid"
            :active="s.m === vid"
            :style="{ flex: 1, textAlign: 'center' }"
            @click="setSize(vid)"
          >
            {{ MD[vid].letter }}
          </Chip>
        </div>
      </Sec>

      <!-- Патроны (если диапазон минимум 2) -->
      <Sec
        v-if="m.minL !== m.maxL"
        :label="`Патроны · ${s.l} ${lw(s.l ?? m.lamps)} · ${((s.l ?? m.lamps) * m.lmPer).toLocaleString('ru-RU')} лм`"
      >
        <input
          type="range"
          :min="m.minL"
          :max="m.maxL"
          :value="s.l"
          :style="{ width: '100%', accentColor: T.neutral, cursor: 'pointer' }"
          @input="setLamps(+($event.target as HTMLInputElement).value)"
        />
        <div
          :style="{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '10px',
            color: T.textDim,
            marginTop: '6px',
          }"
        >
          <span>{{ m.minL }}</span>
          <span :style="{ color: s.l === m.lamps ? T.neutral : T.textDim }">
            станд. {{ m.lamps }}
          </span>
          <span>{{ m.maxL }}</span>
        </div>
      </Sec>

      <!-- Температура -->
      <Sec label="Температура">
        <div :style="{ display: 'flex', gap: '6px' }">
          <button
            v-for="bt in BTEMPS"
            :key="bt.id"
            :style="{
              flex: 1,
              padding: '10px 4px',
              borderRadius: '8px',
              cursor: 'pointer',
              border: s.opts?.btemp === bt.id
                ? `2px solid ${T.neutral}`
                : `1px solid ${T.border}`,
              background: s.opts?.btemp === bt.id ? T.neutral + '15' : T.card,
              textAlign: 'center',
            }"
            @click="setBtemp(bt.id)"
          >
            <div
              :style="{
                fontSize: '12px',
                fontWeight: 600,
                color: s.opts?.btemp === bt.id ? T.text : T.textSec,
              }"
            >
              {{ bt.l }}
            </div>
            <div :style="{ fontSize: '10px', color: T.textDim }">{{ bt.k }}</div>
          </button>
        </div>
      </Sec>

      <!-- Чаша (только люстры) -->
      <Sec v-if="isL" label="Чаша">
        <div :style="{ display: 'flex', flexWrap: 'wrap', gap: '4px' }">
          <Chip
            v-for="b in BOWLS"
            :key="b"
            :active="s.opts?.bowl === b"
            @click="setBowl(b)"
          >
            {{ b }}
          </Chip>
        </div>
      </Sec>

      <!-- Крепление (только люстры) -->
      <Sec v-if="isL" label="Крепление">
        <div :style="{ display: 'flex', flexWrap: 'wrap', gap: '4px' }">
          <Chip
            v-for="mt in MOUNTS"
            :key="mt"
            :active="s.opts?.mount === mt"
            @click="setMount(mt)"
          >
            {{ mt }}
          </Chip>
        </div>
      </Sec>

      <!-- Дополнительно -->
      <div
        :style="{
          fontSize: '12px',
          fontWeight: 600,
          color: T.text,
          marginBottom: '8px',
          marginTop: '4px',
        }"
      >
        Дополнительно
      </div>
      <div
        :style="{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '4px',
          marginBottom: '24px',
        }"
      >
        <Chip :active="!!s.opts?.diffuser" @click="toggleDiffuser">Рассеиватель</Chip>
        <Chip :active="!!s.opts?.moisture" @click="toggleMoisture">Влагозащита</Chip>
        <Chip :active="!!s.opts?.bulbs" @click="toggleBulbs">Лампочки</Chip>
      </div>

      <!-- Сохранить -->
      <button
        :style="{
          width: '100%',
          padding: '12px',
          background: T.neutral,
          color: T.bg,
          border: 'none',
          borderRadius: '6px',
          fontWeight: 700,
          cursor: 'pointer',
          fontSize: '14px',
          marginBottom: '16px',
        }"
        @click="save"
      >
        Сохранить
      </button>

      <!-- Удалить -->
      <div :style="{ textAlign: 'center' }">
        <button
          :style="{
            padding: '8px 20px',
            background: 'none',
            border: `1px solid ${T.red}55`,
            borderRadius: '6px',
            color: T.red,
            cursor: 'pointer',
            fontSize: '12px',
          }"
          @click="emit('delete')"
        >
          Удалить светильник
        </button>
      </div>
      <div
        :style="{
          fontSize: '11px',
          color: T.textDim,
          marginTop: '6px',
          textAlign: 'center',
        }"
      >
        Потеряете {{ lostLm.toLocaleString('ru-RU') }} лм — станет темнее
      </div>
    </div>
  </div>
</template>
