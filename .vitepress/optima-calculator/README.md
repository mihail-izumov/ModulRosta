# Optima Space Calculator v3

**Версия без внешних зависимостей** — все SVG иконки встроены в `icons.js`.

## Что изменилось

- ✅ Все эмодзи заменены на SVG иконки
- ✅ Иконки встроены в `icons.js` (без lucide-vue-next)
- ✅ Улучшенная SVG диаграмма с hover-эффектами
- ✅ Нет новых npm зависимостей

## Установка

**Просто замените содержимое папки:**
```
.vitepress/optima-calculator/
```

Все 14 файлов:
- `icons.js` ← **НОВЫЙ** (встроенные SVG иконки)
- OptimaSpaceCalculator.vue
- BuybackGuarantee.vue
- QAModule.vue
- PortfolioChart.vue
- constants.js
- utils.js
- usePortfolio.js
- usePDFGenerator.js
- InfoTooltip.vue
- CustomSlider.vue
- CurrencyInput.vue
- ModulRostaBadge.vue

## Запуск

```bash
npm run dev
```

Никаких дополнительных установок не требуется!

## Иконки в icons.js

| Иконка | Использование |
|--------|---------------|
| PhoneOff | Mobile warning |
| Vault | Шаг "Ваш капитал" |
| Scale | Шаг "Распределите активы" |
| Building2 | Шаг "Детали Optima Space" |
| FileText | Шаг "Скачайте отчёт", кнопка PDF |
| Rocket | Кнопка "Инвестировать" |
| ShieldCheck | Гарантия выкупа |
| Settings2 | Интерактивный расчёт |
| Sigma | Формула |
| BrickWall | Залоговое обеспечение |
| Wallet | Q&A: Финансы |
| ScrollText | Q&A: Юридическое |
| Cog | Q&A: Операционное |
| TriangleAlert | Q&A: Риски |
| DoorOpen | Q&A: Выход |
| ChevronRight | Стрелка в Q&A |
