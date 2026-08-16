(() => {
  'use strict';

  const VERSION = '2026.08.16.1';
  const ROOT = 'https://skunkworksacademy.com';
  const ICON = `${ROOT}/images/favicon-white.png`;

  const destinations = Object.freeze({
    home: `${ROOT}/`,
    catalogue: `${ROOT}/catalogue/`,
    selfPaced: `${ROOT}/self-paced/`,
    instructorLed: `${ROOT}/instructor-led/`,
    plans: `${ROOT}/plans-and-purchases/`,
    portal: 'https://portal.skunkworksacademy.com/',
    labs: 'https://labs.skunkworksacademy.com/',
    security: 'https://security.skunkworksacademy.com/',
    microsoft: 'https://microsoft.skunkworksacademy.com/',
    ibm: 'https://ibm.skunkworksacademy.com/',
    comptia: `${ROOT}/comptia/`,
    badges: 'https://badging.skunkworksacademy.com/',
    jobs: 'https://jobs.skunkworksacademy.com/',
    forms: `${ROOT}/forms/`,
    docs: 'https://docs.skunkworksacademy.com/',
    publish: 'https://publish.skunkworksacademy.com/',
    blog: 'https://blog.skunkworksacademy.com/',
    github: 'https://github.com/skunkworks-academy',
    about: `${ROOT}/about.html`,
    contact: `${ROOT}/contact.html`,
    privacy: `${ROOT}/privacy.html`,
    cookies: `${ROOT}/cookie-policy.html`,
    terms: `${ROOT}/terms.html`,
    editorial: `${ROOT}/editorial-policy.html`,
    advertising: `${ROOT}/advertising-disclosure.html`
  });

  window.SKUNKWORKS_ACADEMY_GLOBAL_SHELL = Object.freeze({ version: VERSION, destinations });
  window.__SKUNKWORKS_ACADEMY_GLOBAL_SHELL__ = VERSION;

  const svg = (name) => {
    const paths = {
      chevron: '<path d="m7 9 5 5 5-5"/>',
      menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
      close: '<path d="M6 6l12 12M18 6 6 18"/>',
      arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
      external: '<path d="M14 4h6v6M10 14 20 4M20 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h4"/>'
    };
    return `<svg class="swa-shell-icon" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${paths[name] || ''}</svg>`;
  };

  const navigationGroups = [
    {
      label: 'Courses',
      items: [
        ['Course catalogue', destinations.catalogue, 'Browse the complete Academy catalogue'],
        ['Self-paced', destinations.selfPaced, 'Learn on demand with structured pathways'],
        ['Instructor-led', destinations.instructorLed, 'Book facilitated delivery for individuals or teams'],
        ['Plans & purchase', destinations.plans, 'Compare learning and delivery options']
      ]
    },
    {
      label: 'Partners',
      items: [
        ['Microsoft', destinations.microsoft, 'Microsoft learning and certification pathways'],
        ['IBM', destinations.ibm, 'IBM enterprise technology learning'],
        ['CompTIA', destinations.comptia, 'CompTIA certification and voucher pathways']
      ]
    },
    {
      label: 'Resources',
      items: [
        ['Security', destinations.security, 'Cybersecurity learning and defensive resources'],
        ['Jobs', destinations.jobs, 'Career discovery and placement pathways'],
        ['Badging', destinations.badges, 'Credentials and learner evidence'],
        ['Docs', destinations.docs, 'Technical documentation and references'],
        ['Blog', destinations.blog, 'Academy articles, analysis and updates']
      ]
    }
  ];

  const mobileSections = [
    ['Learn', [
      ['Home', destinations.home],
      ['Course catalogue', destinations.catalogue],
      ['Self-paced', destinations.selfPaced],
      ['Instructor-led', destinations.instructorLed],
      ['Plans & purchase', destinations.plans]
    ]],
    ['Practice & progress', [
      ['Labs', destinations.labs],
      ['Portal', destinations.portal],
      ['Security', destinations.security],
      ['Jobs', destinations.jobs],
      ['Badging', destinations.badges]
    ]],
    ['Partners', [
      ['Microsoft', destinations.microsoft],
      ['IBM', destinations.ibm],
      ['CompTIA', destinations.comptia],
      ['GitHub', destinations.github]
    ]],
    ['Academy', [
      ['About', destinations.about],
      ['Blog', destinations.blog],
      ['Docs', destinations.docs],
      ['Forms', destinations.forms],
      ['Contact', destinations.contact]
    ]]
  ];

  const styleText = `
    :root {
      --swa-ink: #03033A;
      --swa-blue: #1E6BD0;
      --swa-orange: #F24208;
      --swa-white: #FFFFFF;
      --swa-off-white: #F7F9FC;
      --swa-graphite: #15171A;
      --swa-steel: #D8DEE8;
      --swa-slate: #5A6472;
      --swa-nav-height: 76px;
    }
    html { scroll-padding-top: calc(var(--swa-nav-height) + 16px); }
    .swa-shell-hidden-legacy { display: none !important; visibility: hidden !important; }
    #swa-global-shell-nav, #swa-global-shell-nav *, #swa-global-shell-mobile, #swa-global-shell-mobile *, #swa-global-shell-footer, #swa-global-shell-footer * { box-sizing: border-box; }
    #swa-global-shell-spacer { height: var(--swa-nav-height); width: 100%; pointer-events: none; }
    #swa-global-shell-nav {
      position: fixed; inset: 0 0 auto 0; z-index: 2147483000; height: var(--swa-nav-height);
      background: rgba(3,3,58,.985); color: var(--swa-white); border-bottom: 1px solid rgba(255,255,255,.12);
      box-shadow: 0 10px 34px rgba(3,3,58,.20); backdrop-filter: blur(18px); -webkit-backdrop-filter: blur(18px);
      font-family: "Open Sans", Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }
    #swa-global-shell-nav a, #swa-global-shell-mobile a, #swa-global-shell-footer a { color: inherit; text-decoration: none; }
    .swa-shell-bar { width: min(1480px, 100%); height: 100%; margin: 0 auto; padding: 0 24px; display: flex; align-items: center; gap: 20px; }
    .swa-shell-brand { display: inline-flex; align-items: center; gap: 12px; flex: 0 0 auto; min-width: max-content; border-radius: 8px; }
    .swa-shell-brand img { width: 40px; height: 40px; display: block; object-fit: contain; }
    .swa-shell-brand-copy { display: grid; gap: 4px; line-height: 1; }
    .swa-shell-brand-copy strong { font-size: 15px; font-weight: 800; letter-spacing: .025em; text-transform: uppercase; }
    .swa-shell-brand-copy span { color: #9CC8FF; font-size: 9px; font-weight: 800; letter-spacing: .28em; text-transform: uppercase; }
    .swa-shell-primary { display: flex; align-items: center; justify-content: center; gap: 3px; flex: 1 1 auto; min-width: 0; }
    .swa-shell-link, .swa-shell-dd-button {
      min-height: 42px; display: inline-flex; align-items: center; justify-content: center; gap: 6px; padding: 0 11px;
      border: 0; border-radius: 8px; background: transparent; color: #E8EEF8; font: 700 13px/1 "Open Sans", Inter, system-ui, sans-serif;
      white-space: nowrap; cursor: pointer; transition: background-color .16s ease, color .16s ease;
    }
    .swa-shell-link:hover, .swa-shell-dd-button:hover, .swa-shell-dd[data-current="true"] > .swa-shell-dd-button { background: rgba(30,107,208,.22); color: #FFF; }
    .swa-shell-link[aria-current="page"] { color: #FFF; background: rgba(30,107,208,.26); box-shadow: inset 0 -3px 0 var(--swa-blue); }
    .swa-shell-dd { position: relative; }
    .swa-shell-dd-panel {
      display: none; position: absolute; top: calc(100% + 10px); left: 0; width: 318px; padding: 8px;
      border: 1px solid var(--swa-steel); border-radius: 14px; background: var(--swa-white); color: var(--swa-graphite);
      box-shadow: 0 22px 58px rgba(3,3,58,.22);
    }
    .swa-shell-dd[data-open="true"] .swa-shell-dd-panel { display: grid; }
    .swa-shell-dd-panel a { display: grid; gap: 3px; padding: 11px 12px; border-radius: 9px; color: var(--swa-graphite) !important; }
    .swa-shell-dd-panel a span { font-size: 13px; font-weight: 800; line-height: 1.3; }
    .swa-shell-dd-panel a small { color: var(--swa-slate); font-size: 12px; font-weight: 500; line-height: 1.4; }
    .swa-shell-dd-panel a:hover, .swa-shell-dd-panel a[aria-current="page"] { background: #EEF5FE; color: #0C4FA3 !important; }
    .swa-shell-actions { display: flex; align-items: center; gap: 8px; flex: 0 0 auto; margin-left: auto; }
    .swa-shell-cta { min-height: 42px; display: inline-flex; align-items: center; gap: 7px; padding: 0 14px; border-radius: 8px; background: var(--swa-blue); color: #FFF !important; font-size: 13px; font-weight: 800; white-space: nowrap; }
    .swa-shell-cta:hover { background: #155CB8; }
    .swa-shell-mobile-button { display: none; width: 44px; height: 44px; place-items: center; border: 1px solid rgba(255,255,255,.25); border-radius: 9px; background: transparent; color: #FFF; cursor: pointer; }
    .swa-shell-icon { width: 16px; height: 16px; flex: 0 0 auto; }
    .swa-shell-brand:focus-visible, .swa-shell-link:focus-visible, .swa-shell-dd-button:focus-visible, .swa-shell-cta:focus-visible, .swa-shell-mobile-button:focus-visible, #swa-global-shell-mobile a:focus-visible, #swa-global-shell-footer a:focus-visible { outline: 3px solid #8BC0FF; outline-offset: 3px; }

    #swa-global-shell-mobile {
      display: none; position: fixed; z-index: 2147482999; top: var(--swa-nav-height); left: 0; right: 0;
      max-height: calc(100dvh - var(--swa-nav-height)); overflow: auto; padding: 14px 18px 26px;
      background: var(--swa-ink); color: #FFF; border-bottom: 3px solid var(--swa-blue); box-shadow: 0 24px 52px rgba(3,3,58,.28);
      font-family: "Open Sans", Inter, system-ui, sans-serif;
    }
    #swa-global-shell-mobile[data-open="true"] { display: block; }
    .swa-shell-mobile-section { max-width: 720px; margin: 0 auto; padding: 14px 0 6px; border-top: 1px solid rgba(255,255,255,.14); }
    .swa-shell-mobile-section:first-child { border-top: 0; }
    .swa-shell-mobile-label { display: block; margin: 0 0 6px; color: #9CC8FF; font-size: 10px; font-weight: 800; letter-spacing: .16em; text-transform: uppercase; }
    #swa-global-shell-mobile a { min-height: 46px; display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 9px 10px; border-radius: 8px; font-size: 14px; font-weight: 700; }
    #swa-global-shell-mobile a:hover, #swa-global-shell-mobile a[aria-current="page"] { background: rgba(30,107,208,.24); }

    #swa-global-shell-footer {
      position: relative; z-index: 20; margin: 0; border-top: 3px solid var(--swa-blue); background: var(--swa-ink); color: #FFF;
      font-family: "Open Sans", Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }
    .swa-shell-footer-main { width: min(1280px, calc(100% - 48px)); margin: 0 auto; padding: 48px 0 32px; display: grid; grid-template-columns: minmax(250px,1.45fr) repeat(4,minmax(140px,1fr)); gap: 30px; }
    .swa-shell-footer-brand { max-width: 330px; }
    .swa-shell-footer-lockup { display: flex; align-items: center; gap: 13px; margin-bottom: 16px; }
    .swa-shell-footer-lockup img { width: 46px; height: 46px; object-fit: contain; }
    .swa-shell-footer-lockup strong { display: block; font-size: 16px; line-height: 1.15; letter-spacing: .025em; text-transform: uppercase; }
    .swa-shell-footer-lockup span { display: block; margin-top: 5px; color: #9CC8FF; font-size: 9px; font-weight: 800; letter-spacing: .28em; text-transform: uppercase; }
    .swa-shell-footer-brand p { margin: 0 0 12px; color: #C8D2E0; font-size: 13px; line-height: 1.6; }
    .swa-shell-footer-brand .swa-shell-footer-tagline { color: #FFF; font-weight: 700; }
    .swa-shell-footer-col h2 { margin: 0 0 12px; color: #9CC8FF; font-size: 11px; font-weight: 800; letter-spacing: .14em; text-transform: uppercase; }
    .swa-shell-footer-col nav { display: grid; gap: 9px; }
    .swa-shell-footer-col a { display: inline-flex; align-items: center; gap: 5px; width: fit-content; color: #F4F7FB; font-size: 13px; line-height: 1.4; }
    .swa-shell-footer-col a:hover { color: #9CC8FF; text-decoration: underline; text-underline-offset: 3px; }
    .swa-shell-footer-bottom { border-top: 1px solid rgba(255,255,255,.15); }
    .swa-shell-footer-bottom-inner { width: min(1280px, calc(100% - 48px)); min-height: 68px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; gap: 20px; color: #BAC5D5; font-size: 12px; }
    .swa-shell-footer-meta { display: flex; flex-wrap: wrap; align-items: center; gap: 8px 16px; }
    .swa-shell-footer-campaign { color: #FFF; font-weight: 700; }
    .swa-shell-footer-legal { display: flex; flex-wrap: wrap; justify-content: flex-end; gap: 14px; }
    .swa-shell-footer-legal a { color: #D6DDEA; }
    .swa-shell-footer-legal a:hover { color: #FFF; text-decoration: underline; text-underline-offset: 3px; }

    @media (max-width: 1220px) {
      .swa-shell-bar { padding: 0 18px; gap: 14px; }
      .swa-shell-brand-copy span { display: none; }
      .swa-shell-link, .swa-shell-dd-button { padding-inline: 9px; }
      .swa-shell-footer-main { grid-template-columns: 1.35fr repeat(2,1fr); }
      .swa-shell-footer-brand { grid-column: 1 / -1; max-width: 680px; }
    }
    @media (max-width: 1030px) {
      :root { --swa-nav-height: 66px; }
      .swa-shell-primary, .swa-shell-cta { display: none; }
      .swa-shell-actions { margin-left: auto; }
      .swa-shell-mobile-button { display: grid; }
      .swa-shell-brand img { width: 36px; height: 36px; }
      .swa-shell-brand-copy span { display: block; }
    }
    @media (max-width: 720px) {
      .swa-shell-footer-main { width: min(100% - 32px, 1280px); grid-template-columns: 1fr 1fr; gap: 26px 20px; padding-top: 38px; }
      .swa-shell-footer-brand { grid-column: 1 / -1; }
      .swa-shell-footer-bottom-inner { width: min(100% - 32px, 1280px); padding: 18px 0; align-items: flex-start; flex-direction: column; }
      .swa-shell-footer-legal { justify-content: flex-start; }
    }
    @media (max-width: 480px) {
      .swa-shell-bar { padding: 0 13px; }
      .swa-shell-brand { gap: 9px; }
      .swa-shell-brand-copy strong { font-size: 13px; }
      .swa-shell-brand-copy span { font-size: 8px; letter-spacing: .22em; }
      .swa-shell-footer-main { grid-template-columns: 1fr; }
      .swa-shell-footer-brand { grid-column: auto; }
    }
    @media (prefers-reduced-motion: reduce) {
      .swa-shell-link, .swa-shell-dd-button { transition: none; }
    }
    @media print {
      #swa-global-shell-nav, #swa-global-shell-spacer, #swa-global-shell-mobile, #swa-global-shell-footer { display: none !important; }
      html { scroll-padding-top: 0; }
    }
  `;

  const normalize = (url) => {
    try {
      const parsed = new URL(url, location.href);
      const path = parsed.pathname.replace(/index\.html?$/i, '').replace(/\/+$/, '') || '/';
      return `${parsed.hostname.toLowerCase()}${path.toLowerCase()}`;
    } catch {
      return '';
    }
  };

  const isCurrent = (href) => {
    const current = normalize(location.href);
    const target = normalize(href);
    if (!current || !target) return false;
    if (current === target) return true;
    const slash = target.indexOf('/');
    const host = slash === -1 ? target : target.slice(0, slash);
    const path = slash === -1 ? '/' : target.slice(slash) || '/';
    if (path === '/') return false;
    return current.startsWith(`${host}${path}/`);
  };

  const markCurrent = (root) => {
    if (!root) return;
    root.querySelectorAll('a[href]').forEach((link) => {
      if (isCurrent(link.href)) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
    root.querySelectorAll('.swa-shell-dd').forEach((group) => {
      group.dataset.current = String(Boolean(group.querySelector('a[aria-current="page"]')));
    });
  };

  const removeLegacyShell = () => {
    const selectors = [
      'header.site-header', 'header.top', 'header.topbar', 'header.main-header', 'header.sk-topbar',
      '[data-sk-nav-shell]', 'nav.navbar.navbar--fixed-top', '.swa-global-nav', '#skunkworks-global-header', '[data-skunkworks-global-header]',
      'footer.site-footer', 'footer.footer', '.swa-global-footer', '#skunkworks-global-footer', '[data-skunkworks-global-footer]'
    ];
    document.querySelectorAll(selectors.join(',')).forEach((node) => {
      if (node.closest('#swa-global-shell-nav, #swa-global-shell-mobile, #swa-global-shell-footer')) return;
      if (node.matches('[data-sk-preserve-header], [data-sk-preserve-footer], [data-sk-preserve-navigation]') || node.closest('[data-sk-preserve-navigation]')) return;
      node.classList.add('swa-shell-hidden-legacy');
      node.setAttribute('aria-hidden', 'true');
      node.dataset.swaLegacyShell = 'hidden';
    });
  };

  const dropdownMarkup = (group, index) => `
    <div class="swa-shell-dd" data-swa-dropdown="${index}" data-open="false" data-current="false">
      <button class="swa-shell-dd-button" type="button" aria-haspopup="true" aria-expanded="false">
        ${group.label}${svg('chevron')}
      </button>
      <div class="swa-shell-dd-panel" role="menu">
        ${group.items.map(([label, href, description]) => `<a role="menuitem" href="${href}"><span>${label}</span><small>${description}</small></a>`).join('')}
      </div>
    </div>`;

  const navMarkup = () => `
    <div class="swa-shell-bar">
      <a class="swa-shell-brand" href="${destinations.home}" aria-label="Skunkworks Academy home">
        <img src="${ICON}" alt="" width="40" height="40" decoding="async" />
        <span class="swa-shell-brand-copy"><strong>Skunkworks Academy</strong><span>Dream · Design · Deliver</span></span>
      </a>
      <nav class="swa-shell-primary" aria-label="Global Academy navigation">
        <a class="swa-shell-link" href="${destinations.home}">Home</a>
        ${dropdownMarkup(navigationGroups[0], 0)}
        <a class="swa-shell-link" href="${destinations.labs}">Labs</a>
        <a class="swa-shell-link" href="${destinations.portal}">Portal</a>
        ${dropdownMarkup(navigationGroups[1], 1)}
        ${dropdownMarkup(navigationGroups[2], 2)}
        <a class="swa-shell-link" href="${destinations.about}">About</a>
      </nav>
      <div class="swa-shell-actions">
        <a class="swa-shell-cta" href="${destinations.catalogue}">Explore courses ${svg('arrow')}</a>
        <button class="swa-shell-mobile-button" type="button" aria-expanded="false" aria-controls="swa-global-shell-mobile" aria-label="Open Academy menu">${svg('menu')}</button>
      </div>
    </div>`;

  const mobileMarkup = () => mobileSections.map(([label, items]) => `
    <section class="swa-shell-mobile-section">
      <span class="swa-shell-mobile-label">${label}</span>
      ${items.map(([name, href]) => `<a href="${href}"><span>${name}</span>${svg('arrow')}</a>`).join('')}
    </section>`).join('');

  const footerMarkup = () => {
    const year = new Date().getFullYear();
    const columns = [
      ['Learning', [
        ['Course catalogue', destinations.catalogue],
        ['Self-paced', destinations.selfPaced],
        ['Instructor-led', destinations.instructorLed],
        ['Plans & purchase', destinations.plans]
      ]],
      ['Practice & careers', [
        ['Labs', destinations.labs],
        ['Security', destinations.security],
        ['Jobs', destinations.jobs],
        ['Badging', destinations.badges]
      ]],
      ['Partners', [
        ['Microsoft', destinations.microsoft],
        ['IBM', destinations.ibm],
        ['CompTIA', destinations.comptia],
        ['GitHub', destinations.github]
      ]],
      ['Academy', [
        ['About', destinations.about],
        ['Blog', destinations.blog],
        ['Docs', destinations.docs],
        ['Forms', destinations.forms],
        ['Contact', destinations.contact]
      ]]
    ];

    return `
      <div class="swa-shell-footer-main">
        <section class="swa-shell-footer-brand" aria-label="Skunkworks Academy">
          <div class="swa-shell-footer-lockup">
            <img src="${ICON}" alt="" width="46" height="46" loading="lazy" />
            <div><strong>Skunkworks Academy</strong><span>Dream · Design · Deliver</span></div>
          </div>
          <p>Practical technology capability through instructor-led training, self-paced learning, hands-on labs and implementation-ready resources.</p>
          <p class="swa-shell-footer-tagline">Train smarter. Build faster. Deliver better.</p>
        </section>
        ${columns.map(([title, links]) => `
          <section class="swa-shell-footer-col">
            <h2>${title}</h2>
            <nav aria-label="${title}">
              ${links.map(([name, href]) => {
                const external = href.includes('github.com');
                return `<a href="${href}"${external ? ' target="_blank" rel="noopener"' : ''}>${name}${external ? svg('external') : ''}</a>`;
              }).join('')}
            </nav>
          </section>`).join('')}
      </div>
      <div class="swa-shell-footer-bottom">
        <div class="swa-shell-footer-bottom-inner">
          <div class="swa-shell-footer-meta"><span>© ${year} Skunkworks Academy. All rights reserved.</span><span class="swa-shell-footer-campaign">Dream. Design. Deliver.</span></div>
          <nav class="swa-shell-footer-legal" aria-label="Legal and publishing policies">
            <a href="${destinations.privacy}">Privacy</a>
            <a href="${destinations.cookies}">Cookies</a>
            <a href="${destinations.terms}">Terms</a>
            <a href="${destinations.editorial}">Editorial</a>
            <a href="${destinations.advertising}">Advertising disclosure</a>
          </nav>
        </div>
      </div>`;
  };

  const closeDropdowns = (except = null) => {
    document.querySelectorAll('#swa-global-shell-nav .swa-shell-dd').forEach((group) => {
      if (group === except) return;
      group.dataset.open = 'false';
      group.querySelector('.swa-shell-dd-button')?.setAttribute('aria-expanded', 'false');
    });
  };

  const setMobileOpen = (open) => {
    const panel = document.getElementById('swa-global-shell-mobile');
    const button = document.querySelector('#swa-global-shell-nav .swa-shell-mobile-button');
    if (panel) panel.dataset.open = String(open);
    if (button) {
      button.setAttribute('aria-expanded', String(open));
      button.setAttribute('aria-label', open ? 'Close Academy menu' : 'Open Academy menu');
      button.innerHTML = svg(open ? 'close' : 'menu');
    }
    document.documentElement.style.overflow = open ? 'hidden' : '';
  };

  const bindNavigation = (nav) => {
    nav.querySelectorAll('.swa-shell-dd-button').forEach((button) => {
      button.addEventListener('click', (event) => {
        event.stopPropagation();
        const group = button.closest('.swa-shell-dd');
        const opening = group?.dataset.open !== 'true';
        closeDropdowns(group);
        if (group) group.dataset.open = String(opening);
        button.setAttribute('aria-expanded', String(opening));
        if (opening) group?.querySelector('.swa-shell-dd-panel a')?.focus({ preventScroll: true });
      });
    });

    nav.querySelector('.swa-shell-mobile-button')?.addEventListener('click', () => {
      const panel = document.getElementById('swa-global-shell-mobile');
      setMobileOpen(panel?.dataset.open !== 'true');
    });
  };

  const mount = () => {
    if (!document.head || !document.body) return;

    let style = document.getElementById('swa-global-shell-style');
    if (!style) {
      style = document.createElement('style');
      style.id = 'swa-global-shell-style';
      document.head.appendChild(style);
    }
    if (style.dataset.version !== VERSION) {
      style.dataset.version = VERSION;
      style.textContent = styleText;
    }

    removeLegacyShell();

    let nav = document.getElementById('swa-global-shell-nav');
    if (!nav) {
      nav = document.createElement('header');
      nav.id = 'swa-global-shell-nav';
      nav.setAttribute('role', 'banner');
      document.body.insertBefore(nav, document.body.firstChild);
    }
    if (nav.dataset.skunkworksGlobalShell !== VERSION) {
      nav.dataset.skunkworksGlobalShell = VERSION;
      nav.innerHTML = navMarkup();
      bindNavigation(nav);
    }

    let spacer = document.getElementById('swa-global-shell-spacer');
    if (!spacer) {
      spacer = document.createElement('div');
      spacer.id = 'swa-global-shell-spacer';
      spacer.setAttribute('aria-hidden', 'true');
      nav.insertAdjacentElement('afterend', spacer);
    }

    let mobile = document.getElementById('swa-global-shell-mobile');
    if (!mobile) {
      mobile = document.createElement('nav');
      mobile.id = 'swa-global-shell-mobile';
      mobile.setAttribute('aria-label', 'Mobile Academy navigation');
      mobile.dataset.open = 'false';
      spacer.insertAdjacentElement('afterend', mobile);
    }
    if (mobile.dataset.skunkworksGlobalShell !== VERSION) {
      mobile.dataset.skunkworksGlobalShell = VERSION;
      mobile.innerHTML = mobileMarkup();
      mobile.dataset.open = 'false';
    }

    let footer = document.getElementById('swa-global-shell-footer');
    if (!footer) {
      footer = document.createElement('footer');
      footer.id = 'swa-global-shell-footer';
      document.body.appendChild(footer);
    }
    if (footer.dataset.skunkworksGlobalShell !== VERSION) {
      footer.dataset.skunkworksGlobalShell = VERSION;
      footer.innerHTML = footerMarkup();
    }

    markCurrent(nav);
    markCurrent(mobile);

    if (!document.documentElement.dataset.swaShellEventsBound) {
      document.documentElement.dataset.swaShellEventsBound = VERSION;
      document.addEventListener('click', (event) => {
        if (!event.target.closest('#swa-global-shell-nav .swa-shell-dd')) closeDropdowns();
        if (event.target.closest('#swa-global-shell-mobile a')) setMobileOpen(false);
      });
      document.addEventListener('keydown', (event) => {
        if (event.key !== 'Escape') return;
        closeDropdowns();
        setMobileOpen(false);
        document.querySelector('#swa-global-shell-nav .swa-shell-mobile-button')?.focus({ preventScroll: true });
      });
      addEventListener('resize', () => {
        if (innerWidth > 1030) setMobileOpen(false);
      }, { passive: true });
    }

    if (!window.__SWA_SHELL_LEGACY_OBSERVER__) {
      let queued = false;
      const observer = new MutationObserver(() => {
        if (queued) return;
        queued = true;
        queueMicrotask(() => {
          queued = false;
          removeLegacyShell();
        });
      });
      observer.observe(document.body, { childList: true, subtree: true });
      window.__SWA_SHELL_LEGACY_OBSERVER__ = observer;
    }
  };

  const syncRoute = () => {
    markCurrent(document.getElementById('swa-global-shell-nav'));
    markCurrent(document.getElementById('swa-global-shell-mobile'));
  };

  const patchHistory = () => {
    ['pushState', 'replaceState'].forEach((name) => {
      const original = history[name];
      if (typeof original !== 'function' || original.__swaShellPatched) return;
      const wrapped = function (...args) {
        const result = original.apply(this, args);
        queueMicrotask(syncRoute);
        return result;
      };
      wrapped.__swaShellPatched = true;
      history[name] = wrapped;
    });
    addEventListener('popstate', syncRoute);
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount, { once: true });
  else mount();
  patchHistory();
})();
