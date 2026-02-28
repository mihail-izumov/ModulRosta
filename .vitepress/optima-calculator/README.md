# Optima Space Calculator v2

## Что изменилось

### 🎨 Дизайн
- ✅ Все эмодзи заменены на Lucide иконки (16 иконок)
- ✅ Улучшенная SVG диаграмма с hover-эффектами и tooltip на секторах
- ✅ Текст кнопки авто-распределения исправлен

### 📦 Установка

**1. Установите lucide-vue-next:**
```bash
npm install lucide-vue-next
```

**2. Замените содержимое папки:**
```
.vitepress/components/optima-calculator/
```

Все 12 файлов должны быть в этой папке:
- OptimaSpaceCalculator.vue (главный)
- BuybackGuarantee.vue
- QAModule.vue
- PortfolioChart.vue (улучшенная диаграмма)
- constants.js
- utils.js
- usePortfolio.js
- usePDFGenerator.js
- InfoTooltip.vue
- CustomSlider.vue
- CurrencyInput.vue
- ModulRostaBadge.vue

**3. Проверьте index.ts:**
```typescript
import OptimaSpaceCalculator from '../components/optima-calculator/OptimaSpaceCalculator.vue'
```

**4. Запустите:**
```bash
npm run dev
```

## Использованные иконки Lucide

| Компонент | Иконки |
|-----------|--------|
| OptimaSpaceCalculator | PhoneOff, Vault, Scale, Building2, FileText, Rocket |
| BuybackGuarantee | ShieldCheck, Settings2, Sigma, BrickWall |
| QAModule | Wallet, ScrollText, Cog, TriangleAlert, DoorOpen, ChevronRight |

## Диаграмма

Новая SVG-диаграмма с:
- Hover на секторах (подсветка + смещение)
- Tooltip при наведении
- Синхронизация hover между диаграммой и легендой
- Плавные анимации
