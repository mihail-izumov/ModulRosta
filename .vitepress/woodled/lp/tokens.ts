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

  // Rose family — terracotta-leaning to harmonize with the salmon/peach
  // bg gradient (FAE8DB → F0C5B5). Was wheat/gold (#B97D52..#F0D2A4) but read
  // as khaki against the rose page. New palette keeps the warm earthy feel
  // and pushes the warm tone away from yellow-gold toward red-rose.
  rose:        '#BD6553',  // terracotta — base CTA gradient stop
  roseDeep:    '#9B4332',  // deep terracotta — H2 highlights, footer link
  roseLight:   '#D88871',  // coral-rose — mid shimmer stop
  roseGlow:    '#EFBBA1',  // peach-pink — bright shimmer peak
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
