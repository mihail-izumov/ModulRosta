// composables/usePDFGenerator.js
import { OPTIMA_SPACE, ASSET_CLASSES } from '../constants.js'
import { formatCurrency } from '../utils.js'

export function usePDFGenerator() {
  const generatePDF = (data) => {
    const { totalCapital, allocations, portfolioMetrics, optimaInvestment, chartData } = data
    const shares = Math.floor(optimaInvestment / 500)
    const totalIncome = optimaInvestment * (OPTIMA_SPACE.rounds[0].roi / 100) * 4.5
    const ma = OPTIMA_SPACE.marketAnalytics
    
    const allQuestions = [
      { q: 'Откуда доходность 38%?', a: `Бизнес-модель: аренда по 1000₽/кв.м, сдача по ~6000₽/кв.м. При загрузке 90% прибыль 6 млн/мес.` },
      { q: 'Как защищены инвестиции?', a: `Опционный договор, выкуп через 4,5 года. Залог: ${OPTIMA_SPACE.collateral} кв.м (~${formatCurrency(OPTIMA_SPACE.collateralValue)}).` },
      { q: 'Какие документы?', a: `Договор купли-продажи, выписка ВТБ, опционный договор, акционерное соглашение.` },
      { q: 'Как выйти раньше?', a: `Продажа инвесторам, участие в раундах, дивиденды (окупаемость 29 мес).` },
      { q: 'Распределение прибыли?', a: `100% до окупаемости (29 мес), затем 44% на привилегированные акции.` },
      { q: 'Загрузка ниже плана?', a: `При 70% — ~22%. При 50% — ~12%. Худший: 500₽/акция через опцион.` },
    ]

    const htmlContent = `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><title>Инвестиционный отчёт</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Inter',sans-serif;background:#fff;color:#000;line-height:1.6;padding:40px;max-width:800px;margin:0 auto}
.header{text-align:center;margin-bottom:40px;padding-bottom:20px;border-bottom:2px solid #00D9C0}
.header h1{font-size:24px;font-weight:600;margin-bottom:8px}
.section{margin-bottom:32px}
.section h2{font-size:16px;font-weight:600;color:#000;margin-bottom:16px;padding-bottom:8px;border-bottom:1px solid #ccc}
.metric-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:24px}
.metric{background:#f5f5f5;padding:16px;border-radius:8px;text-align:center;border:1px solid #ddd}
.metric-label{font-size:10px;color:#666;text-transform:uppercase;margin-bottom:4px}
.metric-value{font-size:20px;font-weight:600}
table{width:100%;border-collapse:collapse;margin-bottom:24px}
th,td{padding:12px;text-align:left;border:1px solid #ccc;font-size:13px}
th{background:#f0f0f0;font-weight:600;font-size:11px;text-transform:uppercase}
.highlight-row{background:rgba(0,217,192,0.1)}
.info-block{background:#f5f5f5;padding:20px;border-radius:8px;margin-bottom:24px;border-left:4px solid #00D9C0}
.info-block h3{font-size:14px;font-weight:600;margin-bottom:8px}
.info-block p{font-size:13px;color:#333}
.faq-item{margin-bottom:16px}
.faq-q{font-size:13px;font-weight:600;margin-bottom:4px}
.faq-a{font-size:12px;color:#444}
.footer{margin-top:40px;padding-top:20px;border-top:1px solid #ccc;text-align:center;font-size:11px;color:#666}
.page-break{page-break-after:always}
.partner-badge{display:inline-block;padding:10px 20px;border:2px solid #00D9C0;border-radius:6px;font-size:12px;font-weight:600;margin-top:16px;color:#00D9C0}
@media print{body{padding:20px}}
</style></head><body>

<div class="header">
<h1>Персональный инвестиционный отчёт</h1>
<p>Консультант по долевым инвестициям в офисную недвижимость</p>
<p style="font-size:12px;color:#888;margin-top:8px">Сформирован: ${new Date().toLocaleDateString('ru-RU')}</p>
</div>

<div class="section">
<h2>Ваш инвестиционный портфель</h2>
<div class="metric-grid">
<div class="metric"><div class="metric-label">Общий капитал</div><div class="metric-value">${formatCurrency(totalCapital)}</div></div>
<div class="metric"><div class="metric-label">Доходность</div><div class="metric-value" style="color:#00D9C0">${portfolioMetrics.yield.toFixed(1)}%</div></div>
<div class="metric"><div class="metric-label">Риск</div><div class="metric-value">${portfolioMetrics.risk.toFixed(1)}/10</div></div>
<div class="metric"><div class="metric-label">Доход 4,5г</div><div class="metric-value" style="color:#00D9C0">${formatCurrency(totalCapital * (portfolioMetrics.yield / 100) * 4.5)}</div></div>
</div>
<table><thead><tr><th>Актив</th><th>Доля</th><th>Сумма</th><th>Доходность</th><th>Риск</th></tr></thead><tbody>
${chartData.map(item => {
  const asset = ASSET_CLASSES.find(a => a.name === item.name)
  return `<tr class="${item.name === 'Optima Space' ? 'highlight-row' : ''}"><td>${item.name}</td><td>${item.value}%</td><td>${formatCurrency(item.amount)}</td><td>${asset?.minYield || 0}-${asset?.maxYield || 0}%</td><td>${asset?.risk || 0}/10</td></tr>`
}).join('')}
</tbody></table>
</div>

<div class="section">
<h2>Инвестиция в Optima Space</h2>
<div class="metric-grid">
<div class="metric"><div class="metric-label">Сумма</div><div class="metric-value" style="color:#00D9C0">${formatCurrency(optimaInvestment)}</div></div>
<div class="metric"><div class="metric-label">Акции</div><div class="metric-value">${shares.toLocaleString()}</div></div>
<div class="metric"><div class="metric-label">ROI</div><div class="metric-value" style="color:#00D9C0">${OPTIMA_SPACE.rounds[0].roi}%</div></div>
<div class="metric"><div class="metric-label">Доход 4,5г</div><div class="metric-value" style="color:#00D9C0">${formatCurrency(totalIncome)}</div></div>
</div>
<div class="info-block">
<h3>Гарантия обратного выкупа</h3>
<p>Через 4,5 года основатель обязан выкупить акции: <strong>1000₽ − дивиденды</strong> (минимум 500₽).</p>
<p style="margin-top:8px">Залог: ${OPTIMA_SPACE.collateral} кв.м (~${formatCurrency(OPTIMA_SPACE.collateralValue)}). Покрытие: <strong>${(OPTIMA_SPACE.collateralValue / optimaInvestment).toFixed(0)}×</strong></p>
</div>
<table><thead><tr><th>Год</th><th>Дивиденды</th><th>Накоплено</th><th>ROI</th></tr></thead><tbody>
${[1, 2, 3, 4, '4,5'].map((year, i) => {
  const period = i < 4 ? 1 : 0.5
  const yearlyIncome = optimaInvestment * (OPTIMA_SPACE.rounds[0].roi / 100) * period
  const cumulative = optimaInvestment * (OPTIMA_SPACE.rounds[0].roi / 100) * (i < 4 ? (i + 1) : 4.5)
  return `<tr><td>Год ${year}</td><td>${formatCurrency(yearlyIncome)}</td><td>${formatCurrency(cumulative)}</td><td>${((cumulative / optimaInvestment) * 100).toFixed(0)}%</td></tr>`
}).join('')}
</tbody></table>
</div>

<div class="section">
<h2>Сравнение раундов</h2>
<table><thead><tr><th>Раунд</th><th>Цена</th><th>ROI</th><th>Акций</th><th>Доход 4,5г</th></tr></thead><tbody>
${OPTIMA_SPACE.rounds.map(r => {
  const s = Math.floor(optimaInvestment / r.price)
  const income = optimaInvestment * (r.roi / 100) * 4.5
  return `<tr class="${r.id === 1 ? 'highlight-row' : ''}"><td>Раунд ${r.id}</td><td>${r.price}₽</td><td>${r.roi}%</td><td>${s.toLocaleString()}</td><td>${formatCurrency(income)}</td></tr>`
}).join('')}
</tbody></table>
</div>

<div class="page-break"></div>

<div class="section">
<h2>Аналитика рынка офисной недвижимости г. Самара</h2>
<div class="info-block" style="border-left-color:#333">
<h3>Ключевые показатели рынка</h3>
<p><strong>Общая площадь офисов класса А и В:</strong> ${(ma.totalOfficeArea / 1000).toFixed(0)} тыс. кв.м</p>
<p><strong>Класс А:</strong> ${(ma.classAArea / 1000).toFixed(0)} тыс. кв.м (12%) — вакантность ${ma.classAVacancy}%</p>
<p><strong>Класс В:</strong> ${(ma.classBArea / 1000).toFixed(0)} тыс. кв.м (88%) — вакантность ${ma.classBVacancy}%</p>
<p style="margin-top:12px"><strong>Доля Optima Space на рынке класса А:</strong> ${ma.projectShare}%</p>
</div>

<table><thead><tr><th>Показатель</th><th>Класс А</th><th>Класс В</th></tr></thead><tbody>
<tr><td>Вакантность</td><td>${ma.classAVacancy}%</td><td>${ma.classBVacancy}%</td></tr>
<tr><td>Медианная ставка/кв.м/год</td><td>24 000₽</td><td>10 200₽</td></tr>
<tr><td>Медианная ставка/место/год</td><td>287 880₽</td><td>112 800₽</td></tr>
</tbody></table>

<p style="font-size:12px;color:#444;margin-bottom:16px"><strong>Вывод:</strong> Показатель вакантности 4% в классе А свидетельствует о фазе активного роста рынка. Спрос равен или превышает предложение.</p>

<h3 style="font-size:14px;margin-bottom:12px">Конкуренты (сервисные офисы класса А)</h3>
<table><thead><tr><th>Название</th><th>Город</th><th>Ставка/год</th><th>Вакантность</th></tr></thead><tbody>
${ma.competitors.map(c => `<tr><td>${c.name}</td><td>${c.city}</td><td>${formatCurrency(c.rent)}</td><td>${c.vacancy}%</td></tr>`).join('')}
<tr class="highlight-row"><td><strong>Optima Space</strong></td><td>Самара</td><td><strong>300 000₽</strong></td><td>прогноз 10%</td></tr>
</tbody></table>

<p style="font-size:12px;color:#444;margin-top:12px"><strong>Важно:</strong> Локация является критически важным параметром. Аналогичный проект вне делового центра имеет вакантность 69%. Optima Space расположен в деловом центре Самары.</p>
</div>

<div class="section">
<h2>Вопросы и ответы</h2>
${allQuestions.map(item => `<div class="faq-item"><div class="faq-q">${item.q}</div><div class="faq-a">${item.a}</div></div>`).join('')}
</div>

<div class="section">
<h2>Команда проекта</h2>
<table><thead><tr><th>Имя</th><th>Роль</th><th>Опыт</th></tr></thead><tbody>
${OPTIMA_SPACE.team.map(t => `<tr><td>${t.name}</td><td>${t.role}</td><td>${t.exp}</td></tr>`).join('')}
</tbody></table>
</div>

<div class="section">
<h2>Следующие шаги</h2>
<ol style="margin-left:20px;font-size:13px">
<li style="margin-bottom:8px">Записаться на встречу с основателем</li>
<li style="margin-bottom:8px">Подготовить документы для ВТБ Регистратор</li>
<li style="margin-bottom:8px">Перевести средства после подписания договора</li>
<li>Получить акции и ожидать дивиденды</li>
</ol>
</div>

<div class="section">
<h2>Контакты</h2>
<p style="font-size:13px"><strong>Telegram:</strong> @paimukov | <strong>Сайт:</strong> profitrooms.ru</p>
</div>

<div class="footer">
<p><strong>Важно:</strong> Данный отчёт не является публичной офертой. Инвестиции связаны с рисками.</p>
<p style="margin-top:12px">© 2026 Optima Space • Консультант по долевым инвестициям</p>
<div class="partner-badge">Технологический партнёр | Модуль Роста®</div>
</div>

</body></html>`

    const blob = new Blob([htmlContent], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `Инвестиционный_отчёт_${new Date().toISOString().split('T')[0]}.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return { generatePDF }
}
