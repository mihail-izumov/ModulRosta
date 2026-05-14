// tokens.ts — Visual system for /woodled/lp landing
// PAGE/T palettes mirror WoodledLanding.jsx (locked design system).
// WCOL — canonical wood colors from materials.md, used inside TreesBadge orbs
// to match WelcomeScreen.vue exactly.

export const PAGE = {
  bgTop:    '#FAE8DB',
  bgMid:    '#F5D5C5',
  bgBottom: '#F0C5B5',

  text:     '#1D1D1F',
  textSec:  '#6B5847',
  textDim:  '#9A8775',

  // Rose-gold family — warm copper-pink with gold undertone (14K rose gold
  // aesthetic). Pulled back from the previous coral/terracotta which read
  // pink, toward a more refined metallic rose-gold. Sits between wheat/khaki
  // (#B97D52) and coral (#BD6553).
  rose:        '#BB7868',  // 14K rose-gold base — warm copper-pink
  roseDeep:    '#985846',  // deep rose-gold — H2 highlights, footer link
  roseLight:   '#D8A293',  // light rose-gold — mid shimmer stop
  roseGlow:    '#EFC8B8',  // peach rose-gold — bright shimmer peak
  pearl:       '#F8EFE0',
  blush:       '#E8B5A0',
  cocoa:       '#5A3D26',
  walnut:      '#8B5A2B',

  pastelPink:    '#F8DAD2',
  pastelPinkD:   '#ECC2B5',
  pastelPeach:   '#FBE3D4',
  pastelPeachD:  '#ECCAB6',
  pastelCream:   '#FCEFE6',
  pastelCreamD:  '#F0D5C5',

  border:      'rgba(42, 31, 24, 0.10)',
  borderSoft:  'rgba(42, 31, 24, 0.05)',
  glassBg:     'rgba(255, 250, 244, 0.55)',
  glassBorder: 'rgba(255, 255, 255, 0.50)',
} as const

// Dark palette — used ONLY for the TreesBadge backplate (warmed rose-brown).
// Inside the badge the orbs themselves use canonical WCOL (below).
export const T = {
  bg:       '#3A2A1F',
  bgDeep:   '#281710',
  text:     '#F5EBE0',
  textSec:  '#C9B89A',
  textDim:  '#9A8775',
  border:   'rgba(245, 235, 224, 0.10)',
} as const

// Canonical wood colors from materials.md — must match WelcomeScreen.vue
export const WCOL = {
  oak:    '#C4A46C',
  walnut: '#8B6242',
  black:  '#5A4E42',
} as const

export type Wood = 'oak' | 'walnut' | 'black'
