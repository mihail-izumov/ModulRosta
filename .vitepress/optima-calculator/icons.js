// icons.js
// Inline SVG иконки как функциональные Vue компоненты
import { h } from 'vue'

// Базовый wrapper для создания иконки
const createIcon = (pathD, props = {}) => {
  const { size = 24, color = 'currentColor', strokeWidth = 2 } = props
  return h('svg', {
    xmlns: 'http://www.w3.org/2000/svg',
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: color,
    'stroke-width': strokeWidth,
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
    style: { display: 'inline-block', verticalAlign: 'middle' }
  }, Array.isArray(pathD) ? pathD.map(d => h('path', { d })) : [h('path', { d: pathD })])
}

// PhoneOff - для mobile warning
export const PhoneOff = {
  props: { size: { type: Number, default: 24 }, color: { type: String, default: 'currentColor' } },
  render() {
    return h('svg', {
      xmlns: 'http://www.w3.org/2000/svg',
      width: this.size,
      height: this.size,
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: this.color,
      'stroke-width': 2,
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round'
    }, [
      h('path', { d: 'M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.42 19.42 0 0 1-3.33-2.67m-2.67-3.34a19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91' }),
      h('line', { x1: 22, y1: 2, x2: 2, y2: 22 })
    ])
  }
}

// Vault - капитал
export const Vault = {
  props: { size: { type: Number, default: 24 }, color: { type: String, default: 'currentColor' } },
  render() {
    return h('svg', {
      xmlns: 'http://www.w3.org/2000/svg',
      width: this.size,
      height: this.size,
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: this.color,
      'stroke-width': 2,
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round'
    }, [
      h('rect', { width: 18, height: 18, x: 3, y: 3, rx: 2 }),
      h('circle', { cx: 7.5, cy: 7.5, r: 0.5, fill: this.color }),
      h('path', { d: 'm7.9 7.9 2.7 2.7' }),
      h('circle', { cx: 16.5, cy: 7.5, r: 0.5, fill: this.color }),
      h('path', { d: 'm13.4 10.6 2.7-2.7' }),
      h('circle', { cx: 7.5, cy: 16.5, r: 0.5, fill: this.color }),
      h('path', { d: 'm7.9 16.1 2.7-2.7' }),
      h('circle', { cx: 16.5, cy: 16.5, r: 0.5, fill: this.color }),
      h('path', { d: 'm13.4 13.4 2.7 2.7' }),
      h('circle', { cx: 12, cy: 12, r: 2 })
    ])
  }
}

// Scale - распределение
export const Scale = {
  props: { size: { type: Number, default: 24 }, color: { type: String, default: 'currentColor' } },
  render() {
    return h('svg', {
      xmlns: 'http://www.w3.org/2000/svg',
      width: this.size,
      height: this.size,
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: this.color,
      'stroke-width': 2,
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round'
    }, [
      h('path', { d: 'm16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z' }),
      h('path', { d: 'm2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z' }),
      h('path', { d: 'M7 21h10' }),
      h('path', { d: 'M12 3v18' }),
      h('path', { d: 'M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2' })
    ])
  }
}

// Building2 - здание/офис
export const Building2 = {
  props: { size: { type: Number, default: 24 }, color: { type: String, default: 'currentColor' } },
  render() {
    return h('svg', {
      xmlns: 'http://www.w3.org/2000/svg',
      width: this.size,
      height: this.size,
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: this.color,
      'stroke-width': 2,
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round'
    }, [
      h('path', { d: 'M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z' }),
      h('path', { d: 'M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2' }),
      h('path', { d: 'M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2' }),
      h('path', { d: 'M10 6h4' }),
      h('path', { d: 'M10 10h4' }),
      h('path', { d: 'M10 14h4' }),
      h('path', { d: 'M10 18h4' })
    ])
  }
}

// FileText - документ/отчёт
export const FileText = {
  props: { size: { type: Number, default: 24 }, color: { type: String, default: 'currentColor' } },
  render() {
    return h('svg', {
      xmlns: 'http://www.w3.org/2000/svg',
      width: this.size,
      height: this.size,
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: this.color,
      'stroke-width': 2,
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round'
    }, [
      h('path', { d: 'M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z' }),
      h('polyline', { points: '14 2 14 8 20 8' }),
      h('line', { x1: 16, y1: 13, x2: 8, y2: 13 }),
      h('line', { x1: 16, y1: 17, x2: 8, y2: 17 }),
      h('line', { x1: 10, y1: 9, x2: 8, y2: 9 })
    ])
  }
}

// Rocket - инвестировать
export const Rocket = {
  props: { size: { type: Number, default: 24 }, color: { type: String, default: 'currentColor' } },
  render() {
    return h('svg', {
      xmlns: 'http://www.w3.org/2000/svg',
      width: this.size,
      height: this.size,
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: this.color,
      'stroke-width': 2,
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round'
    }, [
      h('path', { d: 'M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z' }),
      h('path', { d: 'm12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z' }),
      h('path', { d: 'M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0' }),
      h('path', { d: 'M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5' })
    ])
  }
}

// ShieldCheck - гарантия
export const ShieldCheck = {
  props: { size: { type: Number, default: 24 }, color: { type: String, default: 'currentColor' } },
  render() {
    return h('svg', {
      xmlns: 'http://www.w3.org/2000/svg',
      width: this.size,
      height: this.size,
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: this.color,
      'stroke-width': 2,
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round'
    }, [
      h('path', { d: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' }),
      h('path', { d: 'm9 12 2 2 4-4' })
    ])
  }
}

// Settings2 - настройки/интерактив
export const Settings2 = {
  props: { size: { type: Number, default: 24 }, color: { type: String, default: 'currentColor' } },
  render() {
    return h('svg', {
      xmlns: 'http://www.w3.org/2000/svg',
      width: this.size,
      height: this.size,
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: this.color,
      'stroke-width': 2,
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round'
    }, [
      h('path', { d: 'M20 7h-9' }),
      h('path', { d: 'M14 17H5' }),
      h('circle', { cx: 17, cy: 17, r: 3 }),
      h('circle', { cx: 7, cy: 7, r: 3 })
    ])
  }
}

// Sigma - формула
export const Sigma = {
  props: { size: { type: Number, default: 24 }, color: { type: String, default: 'currentColor' } },
  render() {
    return h('svg', {
      xmlns: 'http://www.w3.org/2000/svg',
      width: this.size,
      height: this.size,
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: this.color,
      'stroke-width': 2,
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round'
    }, [
      h('path', { d: 'M18 7V4H6l6 8-6 8h12v-3' })
    ])
  }
}

// BrickWall - залог/недвижимость
export const BrickWall = {
  props: { size: { type: Number, default: 24 }, color: { type: String, default: 'currentColor' } },
  render() {
    return h('svg', {
      xmlns: 'http://www.w3.org/2000/svg',
      width: this.size,
      height: this.size,
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: this.color,
      'stroke-width': 2,
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round'
    }, [
      h('rect', { width: 18, height: 18, x: 3, y: 3, rx: 2 }),
      h('path', { d: 'M12 9v6' }),
      h('path', { d: 'M16 15v6' }),
      h('path', { d: 'M16 3v6' }),
      h('path', { d: 'M3 15h18' }),
      h('path', { d: 'M3 9h18' }),
      h('path', { d: 'M8 15v6' }),
      h('path', { d: 'M8 3v6' })
    ])
  }
}

// Wallet - финансы
export const Wallet = {
  props: { size: { type: Number, default: 24 }, color: { type: String, default: 'currentColor' } },
  render() {
    return h('svg', {
      xmlns: 'http://www.w3.org/2000/svg',
      width: this.size,
      height: this.size,
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: this.color,
      'stroke-width': 2,
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round'
    }, [
      h('path', { d: 'M21 12V7H5a2 2 0 0 1 0-4h14v4' }),
      h('path', { d: 'M3 5v14a2 2 0 0 0 2 2h16v-5' }),
      h('path', { d: 'M18 12a2 2 0 0 0 0 4h4v-4Z' })
    ])
  }
}

// ScrollText - юридическое
export const ScrollText = {
  props: { size: { type: Number, default: 24 }, color: { type: String, default: 'currentColor' } },
  render() {
    return h('svg', {
      xmlns: 'http://www.w3.org/2000/svg',
      width: this.size,
      height: this.size,
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: this.color,
      'stroke-width': 2,
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round'
    }, [
      h('path', { d: 'M8 21h12a2 2 0 0 0 2-2v-2H10v2a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v3h4' }),
      h('path', { d: 'M19 17V5a2 2 0 0 0-2-2H4' }),
      h('path', { d: 'M15 8h-5' }),
      h('path', { d: 'M15 12h-5' })
    ])
  }
}

// Cog - операционное
export const Cog = {
  props: { size: { type: Number, default: 24 }, color: { type: String, default: 'currentColor' } },
  render() {
    return h('svg', {
      xmlns: 'http://www.w3.org/2000/svg',
      width: this.size,
      height: this.size,
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: this.color,
      'stroke-width': 2,
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round'
    }, [
      h('path', { d: 'M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z' }),
      h('path', { d: 'M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z' }),
      h('path', { d: 'M12 2v2' }),
      h('path', { d: 'M12 22v-2' }),
      h('path', { d: 'm17 20.66-1-1.73' }),
      h('path', { d: 'M11 10.27 7 3.34' }),
      h('path', { d: 'm20.66 17-1.73-1' }),
      h('path', { d: 'm3.34 7 1.73 1' }),
      h('path', { d: 'M14 12h8' }),
      h('path', { d: 'M2 12h2' }),
      h('path', { d: 'm20.66 7-1.73 1' }),
      h('path', { d: 'm3.34 17 1.73-1' }),
      h('path', { d: 'm17 3.34-1 1.73' }),
      h('path', { d: 'm11 13.73-4 6.93' })
    ])
  }
}

// TriangleAlert - риски
export const TriangleAlert = {
  props: { size: { type: Number, default: 24 }, color: { type: String, default: 'currentColor' } },
  render() {
    return h('svg', {
      xmlns: 'http://www.w3.org/2000/svg',
      width: this.size,
      height: this.size,
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: this.color,
      'stroke-width': 2,
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round'
    }, [
      h('path', { d: 'm21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z' }),
      h('path', { d: 'M12 9v4' }),
      h('path', { d: 'M12 17h.01' })
    ])
  }
}

// DoorOpen - выход
export const DoorOpen = {
  props: { size: { type: Number, default: 24 }, color: { type: String, default: 'currentColor' } },
  render() {
    return h('svg', {
      xmlns: 'http://www.w3.org/2000/svg',
      width: this.size,
      height: this.size,
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: this.color,
      'stroke-width': 2,
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round'
    }, [
      h('path', { d: 'M13 4h3a2 2 0 0 1 2 2v14' }),
      h('path', { d: 'M2 20h3' }),
      h('path', { d: 'M13 20h9' }),
      h('path', { d: 'M10 12v.01' }),
      h('path', { d: 'M13 4.562v16.157a1 1 0 0 1-1.242.97L5 20V5.562a2 2 0 0 1 1.515-1.94l4-1A2 2 0 0 1 13 4.561Z' })
    ])
  }
}

// ChevronRight - стрелка
export const ChevronRight = {
  props: { size: { type: Number, default: 24 }, color: { type: String, default: 'currentColor' } },
  render() {
    return h('svg', {
      xmlns: 'http://www.w3.org/2000/svg',
      width: this.size,
      height: this.size,
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: this.color,
      'stroke-width': 2,
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round'
    }, [
      h('path', { d: 'm9 18 6-6-6-6' })
    ])
  }
}
