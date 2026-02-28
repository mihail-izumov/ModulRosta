// icons.js
// Inline SVG icons - no external dependencies
import { h } from 'vue'

const createIcon = (paths, viewBox = '0 0 24 24') => ({
  props: {
    size: { type: Number, default: 24 },
    color: { type: String, default: 'currentColor' }
  },
  render() {
    return h('svg', {
      xmlns: 'http://www.w3.org/2000/svg',
      width: this.size,
      height: this.size,
      viewBox,
      fill: 'none',
      stroke: this.color,
      'stroke-width': 2,
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round'
    }, paths.map(d => typeof d === 'string' ? h('path', { d }) : h(d.tag, d.attrs)))
  }
})

export const PhoneOff = createIcon([
  'M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.42 19.42 0 0 1-3.33-2.67m-2.67-3.34a19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91',
  'M22 2 2 22'
])

export const Vault = createIcon([
  { tag: 'rect', attrs: { width: 18, height: 18, x: 3, y: 3, rx: 2 } },
  { tag: 'circle', attrs: { cx: 7.5, cy: 7.5, r: 0.5, fill: 'currentColor' } },
  { tag: 'path', attrs: { d: 'm7.9 7.9 2.7 2.7' } },
  { tag: 'circle', attrs: { cx: 12, cy: 12, r: 2 } },
  'M12 12v4'
])

export const Scale = createIcon([
  'm16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z',
  'm2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z',
  'M7 21h10',
  'M12 3v18',
  'M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2'
])

export const Building2 = createIcon([
  'M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z',
  'M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2',
  'M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2',
  'M10 6h4',
  'M10 10h4',
  'M10 14h4',
  'M10 18h4'
])

export const FileText = createIcon([
  'M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z',
  { tag: 'polyline', attrs: { points: '14 2 14 8 20 8' } },
  { tag: 'line', attrs: { x1: 16, y1: 13, x2: 8, y2: 13 } },
  { tag: 'line', attrs: { x1: 16, y1: 17, x2: 8, y2: 17 } },
  { tag: 'line', attrs: { x1: 10, y1: 9, x2: 8, y2: 9 } }
])

export const Rocket = createIcon([
  'M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z',
  'M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z',
  'M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0',
  'M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5'
])

export const ShieldCheck = createIcon([
  'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10',
  'M9 12l2 2 4-4'
])

export const Settings2 = createIcon([
  'M20 7h-9',
  'M14 17H5',
  { tag: 'circle', attrs: { cx: 17, cy: 17, r: 3 } },
  { tag: 'circle', attrs: { cx: 7, cy: 7, r: 3 } }
])

export const Sigma = createIcon([
  'M18 7V4H6l6 8-6 8h12v-3'
])

export const BrickWall = createIcon([
  { tag: 'rect', attrs: { width: 18, height: 18, x: 3, y: 3, rx: 2 } },
  'M12 9v6',
  'M3 9h18',
  'M3 15h18'
])

export const HelpCircle = createIcon([
  { tag: 'circle', attrs: { cx: 12, cy: 12, r: 10 } },
  'M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3',
  'M12 17h.01'
])

export const ChevronDown = createIcon([
  'M6 9l6 6 6-6'
])

export const ChevronRight = createIcon([
  'M9 18l6-6-6-6'
])

export const Wallet = createIcon([
  'M21 12V7H5a2 2 0 0 1 0-4h14v4',
  'M3 5v14a2 2 0 0 0 2 2h16v-5',
  'M18 12a2 2 0 0 0 0 4h4v-4Z'
])

export const ScrollText = createIcon([
  'M8 21h12a2 2 0 0 0 2-2v-2H10v2a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v3h4',
  'M19 17V5a2 2 0 0 0-2-2H4',
  'M15 8h-5',
  'M15 12h-5'
])

export const Cog = createIcon([
  { tag: 'path', attrs: { d: 'M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z' } },
  { tag: 'path', attrs: { d: 'M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z' } },
  { tag: 'path', attrs: { d: 'M12 2v2' } },
  { tag: 'path', attrs: { d: 'M12 22v-2' } },
  { tag: 'path', attrs: { d: 'm17 20.66-1-1.73' } },
  { tag: 'path', attrs: { d: 'M11 10.27 7 3.34' } },
  { tag: 'path', attrs: { d: 'm20.66 17-1.73-1' } },
  { tag: 'path', attrs: { d: 'm3.34 7 1.73 1' } },
  { tag: 'path', attrs: { d: 'M14 12h8' } },
  { tag: 'path', attrs: { d: 'M2 12h2' } },
  { tag: 'path', attrs: { d: 'm20.66 7-1.73 1' } },
  { tag: 'path', attrs: { d: 'm3.34 17 1.73-1' } },
  { tag: 'path', attrs: { d: 'm17 3.34-1 1.73' } },
  { tag: 'path', attrs: { d: 'm11 13.73-4 6.93' } }
])

export const TriangleAlert = createIcon([
  'M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z',
  'M12 9v4',
  'M12 17h.01'
])

export const SquareArrowRight = createIcon([
  { tag: 'rect', attrs: { width: 18, height: 18, x: 3, y: 3, rx: 2 } },
  'M8 12h8',
  'M12 8l4 4-4 4'
])
