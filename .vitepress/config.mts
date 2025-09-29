import { defineConfig, DefaultTheme } from 'vitepress'
import pkg from '../package.json' assert { type: 'json' }

const { version } = pkg

export default defineConfig({
  title: 'Модуль Роста®',
  appearance: 'force-dark',
  locales: {
    '/': {
      lang: 'ru-RU',
      title: 'Модуль Роста®',
      description: 'Находим то, что другие упускают.',
    },
  },
  transformPageData(pageData) {
    return pageData
  },
  buildEnd(siteConfig) {
    // Этот хук выполняется после сборки
  },
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    ['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1.0' }],
    ['script', {}, `
    (function() {
      function createFooterContent() {
        const links = [
          { text: 'Журнал', href: '/journal/contents/overview' },
          { text: 'Телеграм-канал', href: 'https://t.me/runscale', target: '_blank' },
          { text: 'Поддержка', href: '/support' },
          { text: 'Условия использования', href: '/terms' },
          { text: 'Контакт', href: '/about/contacts' },
          { text: 'Реквизиты', href: '/credits' },
          { text: 'Orxaos', href: 'https://orxaos.sbs', target: '_blank' }
        ];
        let html = '<hr style="border: 0; border-top: 1px solid var(--vp-c-divider); margin: 24px 0;">';
        html += '<div class="custom-footer-links"><div class="footer-row">';
        links.slice(0, 3).forEach((link, i) => {
          if (i > 0) html += '<span class="dot-separator">•</span>';
          html += '<a href="' + link.href + '"' + (link.target ? ' target="' + link.target + '" rel="noopener noreferrer"' : '') + '>' + link.text + '</a>';
        });
        html += '</div><div class="footer-row">';
        links.slice(3).forEach((link, i) => {
          if (i > 0) html += '<span class="dot-separator">•</span>';
          html += '<a href="' + link.href + '"' + (link.target ? ' target="' + link.target + '" rel="noopener noreferrer"' : '') + '>' + link.text + '</a>';
        });
        html += '</div></div>';
        html += '<div style="margin-top: 24px; text-align: center;">';
        html += '<div style="color: white; font-size: 14px;">Расти по своим правилам</div>';
        html += '<div style="color: var(--vp-c-text-2); margin-top: 4px; font-size: 14px; text-align: center;">© Модуль Роста® 2010 — 2025</div>';
        return html;
      }
      function replaceFooter() {
        let footer = document.querySelector('.VPFooter');
        if (!footer) {
          footer = document.createElement('footer');
          footer.className = 'VPFooter';
          document.body.appendChild(footer);
        }
        footer.innerHTML = createFooterContent();
        if (window.location.pathname !== '/') {
          footer.style.position = 'relative';
          footer.style.bottom = '70px';
          footer.style.zIndex = '10';
          footer.style.marginBottom = '-70px';
        } else {
          footer.style.position = '';
          footer.style.bottom = '';
          footer.style.zIndex = '';
          footer.style.paddingBottom = '30px';
        }
      }
      function updateApplyLinkTarget() {
        const applyLinks = document.querySelectorAll('.VPSocialLink[aria-label="apply-link"]');
        applyLinks.forEach(applyLink => {
          applyLink.href = '/apply';
          applyLink.setAttribute('target', '_self');
          applyLink.removeAttribute('rel');
          const newLink = document.createElement('a');
          newLink.href = '/apply';
          newLink.className = applyLink.className;
          newLink.setAttribute('aria-label', 'apply-link');
          newLink.setAttribute('target', '_self');
          Array.from(applyLink.attributes).forEach(attr => {
            if (attr.name !== 'href' && attr.name !== 'target' && attr.name !== 'rel') {
              newLink.setAttribute(attr.name, attr.value);
            }
          });
          applyLink.parentNode.replaceChild(newLink, applyLink);
        });
      }
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => { replaceFooter(); updateApplyLinkTarget(); });
      } else { replaceFooter(); updateApplyLinkTarget(); }
      window.addEventListener('load', () => { replaceFooter(); updateApplyLinkTarget(); });
      setTimeout(() => { replaceFooter(); updateApplyLinkTarget(); }, 1000);
      setTimeout(() => { replaceFooter(); updateApplyLinkTarget(); }, 2000);
      let lastUrl = location.href;
      new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
          lastUrl = url;
          setTimeout(() => { replaceFooter(); updateApplyLinkTarget(); }, 100);
        }
      }).observe(document, { subtree: true, childList: true });
    })();
    `],
    ['style', {}, `
    .VPSwitchAppearance{display:none!important}
    .VPSocialLink[aria-label="login-link"]::after{font-weight:600!important}
    .VPHero .name,.VPHero .text,.VPHero .tagline{color:white!important}
    .VPHero .tagline a{color:var(--vp-c-brand-2)!important;text-decoration:none;transition:all .3s ease}
    .VPHero .tagline a:hover{color:var(--vp-c-brand-1)!important;text-decoration:underline}
    .VPHero .VPButton{background-color:var(--vp-c-brand-1)!important;border-color:var(--vp-c-brand-1)!important;color:white!important;transition:all .3s ease;text-decoration:none!important}
    .VPHero .VPButton:hover{background-color:var(--vp-c-brand-2)!important;border-color:var(--vp-c-brand-2)!important;color:#000!important;transform:translateY(-2px);text-decoration:none!important}
    .VPContent a{color:var(--vp-c-brand-2);text-decoration:none;border-bottom:1px solid transparent;transition:all .3s ease}
    .VPContent a:hover{color:var(--vp-c-brand-1);border-bottom-color:var(--vp-c-brand-1)}
    .VPFeature .title,.VPFeature .link-text{transition:color .25s ease-in-out}
    .VPFeature .link-text{color:var(--vp-c-brand-1)}
    a.VPFeature.link:hover .title,a.VPFeature.link:hover .link-text{color:var(--vp-c-brand-2)}
    html:not(.dark) .VPFeature{background-color:#202124!important;border-color:#3c3c3c!important}
    html:not(.dark) .VPFeature .title{color:#C5F946!important}
    html:not(.dark) .VPFeature .details{color:rgba(235,235,245,.6)!important}
    html:not(.dark) .VPFeature .link-text{color:#347b6c!important}
    html:not(.dark) .VPFeature .link-text .icon{fill:#347b6c!important}
    html:not(.dark) a.VPFeature.link:hover{background-color:#2f2f2f!important;border-color:#555!important}
    :root{--vp-c-brand-1:#347b6c;--vp-c-brand-2:#C5F946;--vp-c-brand-3:#347b6c;--vp-c-brand-soft:rgba(52,123,108,.14)}
    .VPNavBarTitle .logo{height:32px!important;width:auto!important}
    @media (min-width:961px){
      .VPNavBar .content{gap:0!important}
      .VPNavBarMenu{margin-right:0!important}
      .VPNavBarSocialLinks{min-width:auto!important;justify-content:flex-end!important;gap:16px!important;margin-left:0!important;flex-shrink:0!important}
      .VPSocialLink:not(:last-child){margin-right:4px!important}
    }
    @media (max-width:960px) and (min-width:769px){
      .VPNavBar .content{gap:0!important}
      .VPNavBarMenu{margin-right:0!important}
      .VPNavBarSocialLinks{margin-left:4px!important;gap:12px!important;flex-shrink:0!important}
      .VPSocialLink:not(:last-child){margin-right:2px!important}
    }
    @media (max-width:768px){
      .VPNavBar .VPNavBarSocialLinks{display:none!important}
      .VPNavScreen{overflow-y:auto!important}
      .VPNavScreen .VPNavScreenMenu{padding-bottom:16px!important}
      .VPNavScreen .VPNavScreenSocialLinks,.VPNavScreen .VPNavScreenAppearance{margin:16px!important;padding:16px!important;border:1px solid var(--vp-c-divider)!important;border-radius:8px!important;background:var(--vp-c-bg-soft)!important}
      .VPNavScreen .VPNavScreenAppearance{display:none!important}
      .VPNavScreen .VPNavScreenSocialLinks{display:flex!important;flex-direction:column!important;gap:12px!important}
      .VPNavScreen .VPSocialLink{display:flex!important;align-items:center!important;justify-content:center!important;padding:12px!important;background:var(--vp-c-bg)!important;border-radius:6px!important;border:1px solid var(--vp-c-divider)!important;transition:all .3s ease!important;text-decoration:none!important}
      .VPNavScreen .VPSocialLink:hover{background:var(--vp-c-bg-mute)!important;border-color:var(--vp-c-brand)!important}
      .VPNavScreen .VPSocialLink[aria-label="login-link"]::after{content:"Войти"!important;font-size:16px!important;font-weight:600!important;color:var(--vp-c-text-1)!important}
      .footer-row{flex-direction:column!important;gap:8px!important}
      .dot-separator{display:none!important}
    }
    .VPSocialLink .vpi-social-github{display:none!important}
    .VPSocialLink{width:auto!important;height:auto!important;display:inline-flex!important;align-items:center!important;justify-content:center!important;flex-shrink:0!important}
    .VPSocialLink[aria-label="login-link"]::after{content:"Войти";font-size:14px;color:var(--vp-c-text-1);padding:6px 12px;border:1px solid var(--vp-c-divider);border-radius:6px;background:transparent;transition:all .3s ease;white-space:nowrap;margin:0;flex-shrink:0}
    .VPSocialLink[aria-label="login-link"]:hover::after{background:var(--vp-c-bg-soft);border-color:var(--vp-c-brand)}
    .custom-footer-links{display:flex;flex-direction:column;gap:3px;align-items:center}
    .footer-row{display:flex;align-items:center;gap:8px;flex-wrap:wrap;justify-content:center}
    .footer-row a{color:var(--vp-c-text-2);text-decoration:none;transition:color .3s ease}
    .footer-row a:hover{color:var(--vp-c-brand)}
    .dot-separator{color:var(--vp-c-text-3);font-weight:bold}
    .VPFooter .copyright{margin-top:2px!important}
    `]
  ],
  base: '/',
  outDir: '.vitepress/dist',
  description: 'Находим то, что другие упускают.',
  themeConfig: {
    logo: '/favicon.svg',
    siteTitle: "Модуль Роста®",
    sidebarMenuLabel: 'Меню',
    outlineTitle: 'На этой странице',
    returnToTopLabel: 'Наверх',
    docFooter: {
      prev: 'Предыдущая страница',
      next: 'Следующая страница'
    },
    
    // --- ДОБАВЛЕННЫЙ БЛОК ДЛЯ СТРАНИЦЫ 404 ---
    notFound: {
      title: 'СТРАНИЦА НЕ НАЙДЕНА',
      quote: 'Но если вы не измените направление, и если вы продолжите искать, вы можете в конечном итоге оказаться там, куда вы направляетесь.',
      linkText: 'Вернуться домой'
    },
    // --- КОНЕЦ ДОБАВЛЕННОГО БЛОКА ---
    
    // ВАЖНО: порядок от более специфичных к более общим!
    sidebar: {
      // BREW
      '/brew/': { items: sidebarBrew() },
      // Самара: обзор/метод
      '/radar/index-smr/': { items: sidebarRadarSamara() },
      // ИСПРАВЛЕНИЕ: Принудительная привязка страницы log к сайдбару России (ПЕРЕД /radar/signal/)
      '/radar/signal/log': { items: sidebarRadarRussia() },
      // Новосибирск — без сайдбара
      '/radar/signal/coffee-points-nsk-2025/': { items: [] },
      // Самара: весь остальной блок signal
      '/radar/signal/': { items: sidebarRadarSamara() },
      // Фильтр и Программа рекомендаций — привязка к Чекапу
      '/radar/filter': { items: sidebarCheckup() },
      '/radar/invite': { items: sidebarCheckup() },
      // Чекап
      '/checkup/': { items: sidebarCheckup() },
      '/checkup/prep/': { items: sidebarCheckupPrep() },
      // Общий Радар (Россия)
      '/radar/': { items: sidebarRadarRussia() },
      // Остальные разделы
      '/about/': { items: sidebarAbout() },
      '/method/': { items: sidebarMethod() },
      '/technology/': { items: sidebarTechnology() },
      '/system/': { items: sidebarSystem() },
      '/journal/': { items: sidebarJournal() },
      '/clients/': { items: sidebarClients() },
      '/terms/': { items: sidebarTerms() }
    },
    search: {
      provider: 'local',
      options: {
        placeholder: 'Поиск…',
        translations: {
          button: { buttonText: 'Поиск', buttonAriaLabel: 'Поиск' },
          modal: {
            displayDetails: 'Показать подробные результаты',
            resetButtonTitle: 'Сбросить поиск',
            backButtonTitle: 'Закрыть поиск',
            noResultsText: 'Результаты не найдены для',
            footer: { selectText: 'выбрать', navigateText: 'навигация', closeText: 'закрыть' }
          }
        }
      }
    },
    nav: nav(),
    socialLinks: [
      { 
        icon: { 
          svg: '<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Telegram</title><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" fill="currentColor"/></svg>' 
        }, 
        link: 'https://t.me/runscale' 
      },
      { icon: 'github', link: 'https://app.mplan.sbs', ariaLabel: 'login-link' }
    ],
  }
})

function nav(): DefaultTheme.NavItem[] {
  return [
    {
      text: 'Индекс Роста',
      items: [
        { text: 'Кофейни // Россия', link: '/radar/overview' },
        { text: 'Кофейни // Самара', link: '/radar/index-smr/overview' },
        { text: 'Кофейни // Новосибирск', link: '/radar/signal/coffee-points-nsk-2025/launch.md' }
      ]
    },
    { text: 'Чекап', link: '/checkup/overview' },
    { text: 'Система', link: '/checkup/overview' },
    { 
      text: 'Компания', items: [
        { text: 'Кто мы', link: '/about/company' },
        { text: 'Метод', link: '/method/overview' },
        { text: 'Продукты', link: '/products/overview' },
        { text: 'Технологии', link: '/technology/overview' },
        { text: 'Клиенты', link: '/clients/list' }
      ]
    }
  ]
}

function sidebarBrew(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: "B‑R‑E‑W",
      collapsed: false,
      items: [
        { text: 'Платформа', link: '/brew/run' },
        { text: 'Протокол', link: '/brew/protocol' },
        { text: '→ Подключиться', link: '/brew/membership' }
      ]
    }
  ]
}

function sidebarRadarSamara(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: 'Индекс Роста // Самара', // <--- Заголовок для сайдбара
      collapsed: false,
      items: [
        { text: 'Рейтинг', link: '/radar/index-smr/overview' },
        { text: 'Калькулятор', link: '/radar/index-smr/calc' },
        { text: 'Симулятор', link: '/radar/signal/coffee-points-smr-2025/dashboard' }
      ]
    }
  ]
}

function sidebarRadarRussia(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: 'Индекс Роста // Россия', // <--- Заголовок для сайдбара
      collapsed: false,
      items: [
        { text: 'Обзор рынка', link: '/radar/overview' },
        { text: 'Скрытый потенциал', link: '/radar/scale_index' },
        { text: 'Кто Анна', link: '/radar/who-is-anna' },
        { text: 'Радар', link: '/radar/signal/log' }
      ]
    }
  ]
}

function sidebarCheckup(): DefaultTheme.SidebarItem[] {
  return [
    { 
      text: 'Чекап', 
      collapsed: false, 
      items: [
        { text: 'Обзор', link: '/checkup/overview' },
        { text: '→ Пройти Чекап', link: '/apply' },
        { text: 'Подготовка к чекапу', link: '/checkup/prep/overview' },
        { text: 'Детали чекапа', link: '/checkup/specs' },
        { text: 'Глубокий чекап', link: '/checkup/deep' },
        { text: 'Платите за движение', link: '/checkup/pay-as-you-go' },
        { text: 'Чек-лист готовности', link: '/checkup/checklist' },
        { text: 'Фильтр потенциала', link: '/radar/filter' },
        { text: 'Программа рекомендаций', link: '/radar/invite' }
      ]
    }
  ]
}

function sidebarCheckupPrep(): DefaultTheme.SidebarItem[] {
  return [
    { 
      text: 'Подготовка к чекапу', 
      collapsed: false, 
      items: [
        { text: 'Обзор', link: '/checkup/prep/overview' },        
        { text: '1 - Скрытые проблемы, которые блокируют рост', link: '/checkup/prep/01-hidden-problems-blocking-growth' },
        { text: '2 - Почему мы запрашиваем готовые отчёты, а не доступы к системам', link: '/checkup/prep/02-why-we-request-ready-reports-not-system-access' },
        { text: '3 - Почему важно смотреть на весь бизнес, а не на «локальные проблемы»', link: '/checkup/prep/03-system-diagnostics-vs-one-time-solutions' },
        { text: '4 - Чекап как первый шаг к фрейм-менеджменту', link: '/checkup/prep/04-checkup-for-data-driven-decisions' },
        { text: '5 - ИИ-аналитика в модели RAG: как живая база знаний меняет подход', link: '/checkup/prep/05-ai-analytics-rag-management' },
        { text: '6 - 10 разделов аналитики: анатомия вашего бизнеса', link: '/checkup/prep/06-10-diagnostic-sections' },
        { text: '7 - Три принципа здоровой аналитики на практике', link: '/checkup/prep/07-three-reliable-analytics-principles' },
        { text: '8 - Как превратить аналитику в ресурс роста – Итоги серии', link: '/checkup/prep/08-analytics-transparent-management' }
      ]
    }
  ]
}

function sidebarAbout(): DefaultTheme.SidebarItem[] {
  return [{
      text: 'Компания', collapsed: false, items: [
        { text: 'Кто мы', link: '/about/company' },
        { text: 'Мы, Растем', link: '/about/mission' },
        { text: 'Не только цифры, но и эмоции', link: '/about/balance' },
        { text: 'Контакт', link: '/about/contacts' }
      ]
    }]
}

function sidebarMethod(): DefaultTheme.SidebarItem[] {
  return [{
      text: 'Метод', collapsed: false, items: [
        { text: 'Обзор', link: '/method/overview' },
        { text: '3 принципа здоровой аналитики', link: '/method/the-three-principles' },
        { text: 'Метод эффективной трансформации', link: '/method/transform' },
        { text: 'Фрейм-менеджмент', link: '/method/frames' },
        { text: 'Рост – это не гонка, а приключение', link: '/method/not-a-race' },
        { text: 'Сравнить', link: '/method/pro-et-contra' }
      ]
    }]
}

function sidebarTechnology(): DefaultTheme.SidebarItem[] {
  return [{
      text: 'Технологии', collapsed: false, items: [
        { text: 'Обзор', link: '/technology/overview' },
        { text: 'Живая база знаний', link: '/technology/datahub' },
        { text: 'Аналитика 360°', link: '/technology/analytics-360' },
        { text: 'ИИ-ассистент продаж', link: '/technology/anna' },
        { text: 'Речевая аналитика', link: '/technology/wordpower' },
        { text: 'Дистанционные стратегические сессии', link: '/technology/vision-now' },
        { text: 'Живые Стандарты', link: '/technology/live-standarts' },
      ]
    }]
}

function sidebarSystem(): DefaultTheme.SidebarItem[] {
  return [{
      text: 'Система роста бизнеса', collapsed: false, items: [
        { text: 'Обзор', link: '/system/overview' },
        { text: '12-нед. интенсив', link: '/system/12-weeks' }
      ]
    }]
}

function sidebarJournal(): DefaultTheme.SidebarItem[] {
  return [{
      text: 'Журнал', collapsed: false, items: [
        { text: 'Содержание', link: '/journal/contents/overview' },        
        { text: 'Кейсы', link: '/journal/contents/cases' },
        { text: 'Статьи', link: '/journal/contents/articles' }
      ]
    }]
}

function sidebarClients(): DefaultTheme.SidebarItem[] {
  return [{
      text: 'Клиенты', collapsed: false, items: [
        { text: 'Обзор', link: '/clients/list' },
        { text: 'Конкордия-Авто', link: '/clients/konkordiya-auto' },
        { text: 'Блумкидс', link: '/clients/bloomkids' },
        { text: 'Чишминский Молочный Завод', link: '/clients/chishminskiy' },
        { text: 'Ермолаевъ', link: '/clients/ermolaev' },
        { text: 'FIZ Культура', link: '/clients/fiz-kultura.md' },
        { text: 'Фонд им. Дмитрия Хворостовского', link: '/clients/hvorostovsky-foundation' },
        { text: 'Milimon', link: '/clients/milimon.md' },
        { text: 'SM Live', link: '/clients/sm-live' },
        { text: 'SMSTRETCHING', link: '/clients/smstretching' },
        { text: 'СУПЕРЛЕНД', link: '/clients/superland' },
        { text: 'WOODLED', link: '/clients/woodled' },
        { text: 'World Plastics Summit 2022', link: '/clients/world-plastics-summit-2022' },
      ]
    }]
}

function sidebarTerms(): DefaultTheme.SidebarItem[] {
  return [{
      text: 'Условия использования', collapsed: false, items: [
        { text: 'Соглашения', link: '/terms' },
        { text: 'Политика конфиденциальности', link: '/terms/policy' },
        { text: 'Согласие на обработку данных', link: '/terms/privacy' }
      ]
    }]
}
