// ═══════════════════════════════════════════════════════════════════════════
// WOODLED Onboarding — shared constants & data
// ═══════════════════════════════════════════════════════════════════════════

// Colour palette
export const C = {
  bg: '#0A0908',
  warm: '#f5e6c8',
  gold: '#c8a872',
  goldB: '#E0C882',
  oak: '#b4915a',
  oakL: '#d4b87a',
  oakD: '#8a6e3e',
  text: '#F0EAE0',
  text2: '#C0B8AE',
  dim: '#6B6259',
  dawn: '#D4956B',
  noon: '#C9B86C',
  clearing: '#7BA05B',
  card: '#1E1B16',
  border: '#2E2921'
}

// CSS-vars object for the root element :style binding
// Lets us write var(--gold) in <style> blocks instead of v-bind everywhere.
export const cssVars = {
  '--bg': C.bg, '--warm': C.warm, '--gold': C.gold, '--goldB': C.goldB,
  '--oak': C.oak, '--oakL': C.oakL, '--oakD': C.oakD,
  '--text': C.text, '--text2': C.text2, '--dim': C.dim,
  '--dawn': C.dawn, '--noon': C.noon, '--clearing': C.clearing,
  '--card': C.card, '--border': C.border
}

// Wood materials
export const WCOL = { oak: C.oak, walnut: '#8B6242', black: '#5A4E42' }
export const WNAME = { oak: 'Дуб', walnut: 'Орех', black: 'Чёрный дуб' }

// Image paths (served from /public/woodled/onboarding/)
export const IMG = {
  oak: '/woodled/onboarding/oak.png',
  rotor: '/woodled/onboarding/rotor.jpg',
  wood: '/woodled/onboarding/wood.jpg',
  interior: '/woodled/onboarding/interior.jpg',
  bird: '/woodled/onboarding/bird.png',
  rabbit: '/woodled/onboarding/rabbit.png',
  squirrel: '/woodled/onboarding/squirell.svg'
}

// Audio source
export const AUDIO_SRC = 'https://runscale.ru/woodled/onboarding/forest-soundscape.mp3'
// Or, if you copy the mp3 locally:
// export const AUDIO_SRC = '/woodled/onboarding/forest-soundscape.mp3'

// Animals shown on the shadow-stage (Ch2 after switch)
export const FIG = [
  { id: 'bd', label: 'Птица', img: 'bird' },
  { id: 'rb', label: 'Кролик', img: 'rabbit' },
  { id: 'sq', label: 'Белка', img: 'squirrel' }
]

// Bottom-button labels per step
export const BTN_LABELS = ['Дальше', 'Дальше', 'Дальше', '']

// Chapter meta (used by nav)
export const CHAPTERS = [
  { id: 0, name: 'Ламели WOODLED' },
  { id: 1, name: 'WOODLED Rotor' },
  { id: 2, name: 'Живой дом' },
  { id: 3, name: 'Дом с WOODLED Rotor' }
]

// Demo rooms for Ch3 (Живой дом)
export const DEMO = [
  {
    name: 'Гостиная', mood: 'Ясный день', mc: C.noon, pct: 96,
    lm: '3 600', base: '3 750', desc: 'Света достаточно для всех сценариев',
    fixtures: [{ t: 'люстра', w: 'oak' }, { t: 'бра', w: 'oak' }],
    zones: [
      { id: 'ceiling', pct: 70, n: 'Потолок', m: 'Rotor L' },
      { id: 'wall', pct: 18, n: 'Стены', m: 'Бра ×2' },
      { id: 'floor', pct: 8, n: 'Пол', m: 'Торшер' },
      { id: 'table', pct: 4, n: 'Стол', m: 'Настольная' }
    ]
  },
  {
    name: 'Спальня', mood: 'Рассвет', mc: C.dawn, pct: 62,
    lm: '1 000', base: '1 600', desc: 'Мягкий свет для покоя и отдыха',
    fixtures: [{ t: 'люстра', w: 'walnut' }, { t: 'бра', w: 'walnut' }, { t: 'настольная', w: 'walnut' }],
    zones: [
      { id: 'ceiling', pct: 50, n: 'Потолок', m: 'Rotor S' },
      { id: 'wall', pct: 35, n: 'Стены', m: 'Бра ×2' },
      { id: 'floor', pct: 0, n: 'Пол', m: '—' },
      { id: 'table', pct: 15, n: 'Стол', m: 'Настольная' }
    ]
  },
  {
    name: 'Детская', mood: 'Поляна', mc: C.clearing, pct: 95,
    lm: '2 700', base: '2 800', desc: 'Максимальная яркость для учёбы и игры',
    fixtures: [{ t: 'люстра', w: 'black' }, { t: 'настольная', w: 'black' }],
    zones: [
      { id: 'ceiling', pct: 72, n: 'Потолок', m: 'Rotor M' },
      { id: 'wall', pct: 0, n: 'Стены', m: '—' },
      { id: 'floor', pct: 0, n: 'Пол', m: '—' },
      { id: 'table', pct: 28, n: 'Стол', m: 'Настольная' }
    ]
  }
]

// Fixture-type icon for summary cards (Ch3)
// Returns the path data + viewBox for an SVG.  Rendered inline by ChHome.
export function fixtureIconPath(type) {
  if (type === 'бра') return [
    '<path d="M19.929 9.629A1 1 0 0 1 19 11H9a1 1 0 0 1-.928-1.371l2-5A1 1 0 0 1 11 4h6a1 1 0 0 1 .928.629z"/>',
    '<path d="M6 15a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H5a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1z"/>',
    '<path d="M8 18h4a2 2 0 0 0 2-2v-5"/>'
  ].join('')
  if (type === 'настольная') return [
    '<path d="M12 12v6"/>',
    '<path d="M4.077 10.615A1 1 0 0 0 5 12h14a1 1 0 0 0 .923-1.385l-3.077-7.384A2 2 0 0 0 15 2H9a2 2 0 0 0-1.846 1.23Z"/>',
    '<path d="M8 20a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1z"/>'
  ].join('')
  if (type === 'торшер') return [
    '<path d="M12 10v12"/>',
    '<path d="M17.929 7.629A1 1 0 0 1 17 9H7a1 1 0 0 1-.928-1.371l2-5A1 1 0 0 1 9 2h6a1 1 0 0 1 .928.629z"/>',
    '<path d="M9 22h6"/>'
  ].join('')
  // ceiling (default)
  return [
    '<path d="M12 2v5"/>',
    '<path d="M14.829 15.998a3 3 0 1 1-5.658 0"/>',
    '<path d="M20.92 14.606A1 1 0 0 1 20 16H4a1 1 0 0 1-.92-1.394l3-7A1 1 0 0 1 7 7h10a1 1 0 0 1 .92.606z"/>'
  ].join('')
}

// Nav button icons (rendered via v-html to bypass Vue v-if SVG quirks)
export const NAV_ICONS = [
  // 1: leafy-green
  '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 22c1.25-.987 2.27-1.975 3.9-2.2a5.56 5.56 0 0 1 3.8 1.5 4 4 0 0 0 6.187-2.353 3.5 3.5 0 0 0 3.69-5.116A3.5 3.5 0 0 0 20.95 8 3.5 3.5 0 1 0 16 3.05a3.5 3.5 0 0 0-5.831 1.373 3.5 3.5 0 0 0-5.116 3.69 4 4 0 0 0-2.348 6.155C3.499 15.42 4.409 16.712 4.2 18.1 3.926 19.743 3.014 20.732 2 22"/><path d="M2 22 17 7"/></svg>',
  // 2: bird
  '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 7h.01"/><path d="M3.4 18H12a8 8 0 0 0 8-8V7a4 4 0 0 0-7.28-2.3L2 20"/><path d="m20 7 2 .5-2 .5"/><path d="M10 18v3"/><path d="M14 17.75V21"/><path d="M7 18a6 6 0 0 0 3.84-10.61"/></svg>',
  // 3: house
  '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>',
  // 4: sun
  '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>'
]
