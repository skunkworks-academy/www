(() => {
  'use strict';

  const VERSION = '2026.08.15.2';
  if (window.__SKUNKWORKS_ACADEMY_GLOBAL_SHELL__ === VERSION) return;
  window.__SKUNKWORKS_ACADEMY_GLOBAL_SHELL__ = VERSION;

  const ROOT = 'https://skunkworksacademy.com';
  const ICON = `${ROOT}/images/favicon-white.png`;
  const HOME = `${ROOT}/`;

  const destinations = {
    home: HOME,
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
  };

  window.SKUNKWORKS_ACADEMY_GLOBAL_SHELL = Object.freeze({ version: VERSION, destinations });

  const icon = (name) => {
    const paths = {
      chevron: '<path d="m6 9 6 6 6-6"/>',
      menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
      close: '<path d="M6 6l12 12M18 6 6 18"/>',
      external: '<path d="M14 3h7v7M10 14 21 3M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5"/>',
      arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>'
    };
    return `<svg class="swa-shell-icon" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${paths[name] || ''}</svg>`;
  };

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
      --swa-shell-nav-height: 72px;
    }
    body.swa-global-shell-enabled { padding-top: var(--swa-shell-nav-height) !important; }
    .swa-shell-hidden-legacy { display: none !important; visibility: hidden !important; }
    #swa-global-shell-nav, #swa-global-shell-nav *, #swa-global-shell-footer, #swa-global-shell-footer * { box-sizing: border-box; }
    #swa-global-shell-nav {
      position: fixed; inset: 0 0 auto 0; z-index: 2147483000; height: var(--swa-shell-nav-height);
      background: rgba(3,3,58,.985); color: var(--swa-white); border-bottom: 2px solid var(--swa-orange);
      font-family: "Open Sans", Arial, sans-serif; box-shadow: 0 8px 28px rgba(3,3,58,.18);
    }
    #swa-global-shell-nav a { color: inherit; text-decoration: none; }
    .swa-shell-bar { width: min(1440px, 100%); height: 100%; margin: 0 auto; padding: 0 20px; display: flex; align-items: center; gap: 18px; }
    .swa-shell-brand { display: inline-flex; align-items: center; gap: 11px; min-width: max-content; height: 48px; padding: 4px 0; border-radius: 6px; }
    .swa-shell-brand:focus-visible, .swa-shell-link:focus-visible, .swa-shell-dd-button:focus-visible, .swa-shell-mobile-button:focus-visible, .swa-shell-cta:focus-visible, #swa-global-shell-footer a:focus-visible { outline: 3px solid #8BC0FF; outline-offset: 3px; }
    .swa-shell-brand img { width: 38px; height: 38px; object-fit: contain; display: block; }
    .swa-shell-brand-copy { display: grid; line-height: 1; gap: 3px; }
    .swa-shell-brand-copy strong { font: 800 15px/1 "Open Sans", Arial, sans-serif; letter-spacing: .035em; text-transform: uppercase; }
    .swa-shell-brand-copy span { font: 700 9px/1 "Open Sans", Arial, sans-serif; letter-spacing: .32em; text-transform: uppercase; color: #9CC8FF; }
    .swa-shell-primary { flex: 1 1 auto; display: flex; align-items: center; justify-content: center; gap: 2px; min-width: 0; }
    .swa-shell-link, .swa-shell-dd-button { height: 42px; display: inline-flex; align-items: center; gap: 5px; padding: 0 11px; border: 0; border-radius: 7px; background: transparent; color: #E8EEF8; font: 700 13px/1 "Open Sans", Arial, sans-serif; cursor: pointer; white-space: nowrap; }
    .swa-shell-link:hover, .swa-shell-dd-button:hover, .swa-shell-link[aria-current="page"] { background: rgba(30,107,208,.25); color: #FFF; }
    .swa-shell-link[aria-current="page"] { box-shadow: inset 0 -3px 0 var(--swa-blue); }
    .swa-shell-dd { position: relative; }
    .swa-shell-icon { width: 16px; height: 16px; flex: 0 0 auto; }
    .swa-shell-dd-panel { display: none; position: absolute; top: calc(100% + 10px); left: 0; width: 290px; padding: 8px; background: #FFF; color: var(--swa-graphite); border: 1px solid var(--swa-steel); border-radius: 12px; box-shadow: 0 18px 52px rgba(3,3,58,.2); }
    .swa-shell-dd[data-open="true"] .swa-shell-dd-panel { display: grid; }
    .swa-shell-dd-panel a { display: grid; gap: 2px; padding: 10px 11px; border-radius: 8px; color: var(--swa-graphite) !important; font: 700 13px/1.25 "Open Sans", Arial, sans-serif; }
    .swa-shell-dd-panel a small { color: var(--swa-slate); font-weight: 500; line-height: 1.35; }
    .swa-shell-dd-panel a:hover { background: #EEF5FE; color: #0C4FA3 !important; }
    .swa-shell-actions { display: flex; align-items: center; gap: 8px; margin-left: auto; }
    .swa-shell-cta { height: 42px; display: inline-flex; align-items: center; justify-content: center; gap: 7px; padding: 0 14px; border-radius: 7px; background: var(--swa-blue); color: #FFF !important; font: 800 13px/1 "Open Sans", Arial, sans-serif; white-space: nowrap; box-shadow: inset 0 0 0 1px rgba(255,255,255,.16); }
    .swa-shell-cta:hover { background: #155CB8; }
    .swa-shell-mobile-button { display: none; width: 44px; height: 44px; place-items: center; border: 1px solid rgba(255,255,255,.28); border-radius: 8px; background: transparent; color: #FFF; cursor: pointer; }
    .swa-shell-mobile { display: none; position: fixed; z-index: 2147482999; top: var(--swa-shell-nav-height); left: 0; right: 0; max-height: calc(100dvh - var(--swa-shell-nav-height)); overflow: auto; padding: 12px 16px 22px; background: var(--swa-ink); color: #FFF; border-bottom: 2px solid var(--swa-orange); box-shadow: 0 20px 50px rgba(3,3,58,.25); font-family: "Open Sans", Arial, sans-serif; }
    .swa-shell-mobile[data-open="true"] { display: block; }
    .swa-shell-mobile-section { border-top: 1px solid rgba(255,255,255,.14); padding: 12px 0 4px; }
    .swa-shell-mobile-section:first-child { border-top: 0; }
    .swa-shell-mobile-label { display: block; margin: 0 0 6px; color: #9CC8FF; font-size: 10px; font-weight: 800; letter-spacing: .16em; text-transform: uppercase; }
    .swa-shell-mobile a { display: flex; justify-content: space-between; align-items: center; min-height: 44px; padding: 8px 10px; border-radius: 7px; color: #FFF; text-decoration: none; font-size: 14px; font-weight: 700; }
    .swa-shell-mobile a:hover, .swa-shell-mobile a[aria-current="page"] { background: rgba(30,107,208,.26); }
    #swa-global-shell-footer { position: relative; z-index: 10; margin: 0; background: var(--swa-ink); color: #FFF; border-top: 3px solid var(--swa-blue); font-family: "Open Sans", Arial, sans-serif; }
    .swa-shell-footer-main { width: min(1240px, calc(100% - 40px)); margin: 0 auto; padding: 42px 0 28px; display: grid; grid-template-columns: 1.45fr repeat(4, 1fr); gap: 28px; }
    .swa-shell-footer-brand { max-width: 300px; }
    .swa-shell-footer-lockup { display: flex; align-items: center; gap: 12px; margin-bottom: 14px; }
    .swa-shell-footer-lockup img { width: 42px; height: 42px; object-fit: contain; }
    .swa-shell-footer-lockup strong { display: block; font-size: 15px; line-height: 1.15; letter-spacing: .03em; text-transform: uppercase; }
    .swa-shell-footer-lockup span { display: block; margin-top: 4px; color: #9CC8FF; font-size: 9px; font-weight: 700; letter-spacing: .28em; text-transform: uppercase; }
    .swa-shell-footer-brand p { margin: 0; color: #C6D0E0; font-size: 13px; line-height: 1.6; }
    .swa-shell-footer-col h2 { margin: 0 0 11px; color: #9CC8FF; font-size: 11px; font-weight: 800; letter-spacing: .14em; text-transform: uppercase; }
    .swa-shell-footer-col nav { display: grid; gap: 8px; }
    .swa-shell-footer-col a { color: #F3F6FB; font-size: 13px; line-height: 1.35; text-decoration: none; }
    .swa-shell-footer-col a:hover { color: #9CC8FF; text-decoration: underline; text-underline-offset: 3px; }
    .swa-shell-footer-bottom { border-top: 1px solid rgba(255,255,255,.16); }
    .swa-shell-footer-bottom-inner { width: min(1240px, calc(100% - 40px)); min-height: 62px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; gap: 18px; color: #B9C4D4; font-size: 12px; }
    .swa-shell-footer-legal { display: flex; flex-wrap: wrap; gap: 14px; }
    .swa-shell-footer-legal a { color: #D6DDEA; text-decoration: none; }
    .swa-shell-footer-legal a:hover { color: #FFF; text-decoration: underline; }
    @media (max-width: 1180px) {
      .swa-shell-primary .swa-shell-link:nth-of-type(n+4) { display: none; }
      .swa-shell-footer-main { grid-template-columns: 1.3fr repeat(2, 1fr); }
    }
    @media (max-width: 900px) {
      :root { --swa-shell-nav-height: 64px; }
      .swa-shell-bar { padding: 0 14px; }
      .swa-shell-primary, .swa-shell-actions .swa-shell-cta { display: none; }
      .swa-shell-actions { margin-left: auto; }
      .swa-shell-mobile-button { display: grid; }
      .swa-shell-brand img { width: 34px; height: 34px; }
      .swa-shell-footer-main { grid-template-columns: 1fr 1fr; }
      .swa-shell-footer-brand { grid-column: 1 / -1; max-width: 620px; }
    }
    @media (max-width: 560px) {
      .swa-shell-brand-copy strong { font-size: 13px; }
      .swa-shell-brand-copy span { font-size: 8px; }
      .swa-shell-footer-main { width: min(100% - 28px, 1240px); grid-template-columns: 1fr; gap: 22px; padding-top: 32px; }
      .swa-shell-footer-brand { grid-column: auto; }
      .swa-shell-footer-bottom-inner { width: min(100% - 28px, 1240px); padding: 16px 0; align-items: flex-start; flex-direction: column; }
    }
    @media print {
      #swa-global-shell-nav, #swa-global-shell-footer, .swa-shell-mobile { display: none !important; }
      body.swa-global-shell-enabled { padding-top: 0 !important; }
    }
  `;

  const topLinks = [
    ['Home', destinations.home],
    ['Courses', destinations.catalogue],
    ['Labs', destinations.labs],
    ['Portal', destinations.portal]
  ];

  const dropdowns = [
    {
      label: 'Partners',
      items: [
        ['Microsoft', destinations.microsoft, 'Microsoft learning and certification pathways'],
        ['IBM', destinations.ibm, 'IBM enterprise technology learning'],
        ['CompTIA', destinations.comptia, 'CompTIA certification pathways']
      ]
    },
    {
      label: 'Resources',
      items: [
        ['Security', destinations.security, 'Cybersecurity learning and resources'],
        ['Jobs', destinations.jobs, 'Career and placement pathways'],
        ['Badging', destinations.badges, 'Credentials and learner evidence'],
        ['Docs', destinations.docs, 'Documentation and technical references'],
        ['Blog', destinations.blog, 'Academy articles and updates']
      ]
    }
  ];

  const mobileSections = [
    ['Learning', [['Courses', destinations.catalogue], ['Self-paced', destinations.selfPaced], ['Instructor-led', destinations.instructorLed], ['Labs', destinations.labs], ['Portal', destinations.portal], ['Plans & purchase', destinations.plans]]],
    ['Partners', [['Microsoft', destinations.microsoft], ['IBM', destinations.ibm], ['CompTIA', destinations.comptia]]],
    ['Platforms', [['Security', destinations.security], ['Badging', destinations.badges], ['Jobs', destinations.jobs], ['Forms', destinations.forms], ['Docs', destinations.docs], ['Publish', destinations.publish], ['Blog', destinations.blog]]]
  ];

  const normalize = (url) => {
    try {
      const parsed = new URL(url, location.href);
      let path = parsed.pathname.replace(/index\.html?$/i, '').replace(/\/+$/, '') || '/';
      return `${parsed.hostname.toLowerCase()}${path.toLowerCase()}`;
    } catch { return ''; }
  };

  const isCurrent = (href) => {
    const current = normalize(location.href);
    const target = normalize(href);
    if (!current || !target) return false;
    if (current === target) return true;
    const [targetHost, ...targetPathParts] = target.split('/');
    const targetPath = `/${targetPathParts.join('/')}`.replace(/\/+$/, '') || '/';
    if (targetPath === '/' && current.startsWith(`${targetHost}/`)) return current === `${targetHost}/`;
    return current.startsWith(`${targetHost}${targetPath}/`);
  };

  const markCurrent = (root) => {
    root.querySelectorAll('a[href]').forEach((a) => {
      if (isCurrent(a.href)) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });
  };

  const removeLegacyShell = () => {
    const selectors = [
      'header.site-header', 'header.top', 'header.topbar', 'header.main-header', 'header.sk-topbar',
      '[data-sk-nav-shell]', 'nav.navbar', '.navbar.navbar--fixed-top',
      '.swa-global-nav', '#skunkworks-global-header', '[data-skunkworks-global-header]',
      'footer.site-footer', 'footer.footer', '.swa-global-footer', '#skunkworks-global-footer', '[data-skunkworks-global-footer]'
    ];
    document.querySelectorAll(selectors.join(',')).forEach((node) => {
      if (node.id === 'swa-global-shell-nav' || node.id === 'swa-global-shell-footer') return;
      if (node.closest('#swa-global-shell-nav, #swa-global-shell-footer')) return;
      if (node.matches('[data-sk-preserve-header], [data-sk-preserve-footer], [data-sk-preserve-navigation]') || node.closest('[data-sk-preserve-navigation]')) return;
      node.classList.add('swa-shell-hidden-legacy');
      node.setAttribute('aria-hidden', 'true');
      node.dataset.swaLegacyShell = 'hidden';
    });
  };

  const navMarkup = () => `
    <div class="swa-shell-bar">
      <a class="swa-shell-brand" href="${destinations.home}" aria-label="Skunkworks Academy home">
        <img src="${ICON}" alt="" width="38" height="38" decoding="async" />
        <span class="swa-shell-brand-copy"><strong>Skunkworks Academy</strong><span>Dream · Design · Deliver</span></span>
      </a>
      <nav class="swa-shell-primary" aria-label="Global Academy navigation">
        ${topLinks.map(([label, href]) => `<a class="swa-shell-link" href="${href}">${label}</a>`).join('')}
        ${dropdowns.map((group, index) => `
          <div class="swa-shell-dd" data-swa-dropdown="${index}" data-open="false">
            <button class="swa-shell-dd-button" type="button" aria-expanded="false">${group.label}${icon('chevron')}</button>
            <div class="swa-shell-dd-panel">
              ${group.items.map(([label, href, desc]) => `<a href="${href}"><span>${label}</span><small>${desc}</small></a>`).join('')}
            </div>
          </div>`).join('')}
      </nav>
      <div class="swa-shell-actions">
        <a class="swa-shell-cta" href="${destinations.plans}">Plans & purchase ${icon('arrow')}</a>
        <button class="swa-shell-mobile-button" type="button" aria-expanded="false" aria-controls="swa-global-shell-mobile" aria-label="Open Academy menu">${icon('menu')}</button>
      </div>
    </div>`;

  const mobileMarkup = () => mobileSections.map(([label, items]) => `
    <section class="swa-shell-mobile-section">
      <span class="swa-shell-mobile-label">${label}</span>
      ${items.map(([name, href]) => `<a href="${href}"><span>${name}</span>${icon('arrow')}</a>`).join('')}
    </section>`).join('');

  const footerMarkup = () => {
    const year = new Date().getFullYear();
    const cols = [
      ['Learning', [['Course catalogue', destinations.catalogue], ['Self-paced', destinations.selfPaced], ['Instructor-led', destinations.instructorLed], ['Labs', destinations.labs]]],
      ['Platforms', [['Learner portal', destinations.portal], ['Security', destinations.security], ['Badging', destinations.badges], ['Jobs', destinations.jobs]]],
      ['Partners', [['Microsoft', destinations.microsoft], ['IBM', destinations.ibm], ['CompTIA', destinations.comptia], ['GitHub', destinations.github]]],
      ['Academy', [['About', destinations.about], ['Forms', destinations.forms], ['Docs', destinations.docs], ['Contact', destinations.contact]]]
    ];
    return `
      <div class="swa-shell-footer-main">
        <section class="swa-shell-footer-brand" aria-label="Skunkworks Academy">
          <div class="swa-shell-footer-lockup"><img src="${ICON}" alt="" width="42" height="42" loading="lazy" /><div><strong>Skunkworks Academy</strong><span>Dream · Design · Deliver</span></div></div>
          <p>Practical technology capability through instructor-led training, self-paced learning, hands-on labs and implementation-ready resources.</p>
        </section>
        ${cols.map(([title, links]) => `<section class="swa-shell-footer-col"><h2>${title}</h2><nav aria-label="${title}">${links.map(([name, href]) => `<a href="${href}"${href.includes('github.com') ? ' target="_blank" rel="noopener"' : ''}>${name}${href.includes('github.com') ? ` ${icon('external')}` : ''}</a>`).join('')}</nav></section>`).join('')}
      </div>
      <div class="swa-shell-footer-bottom"><div class="swa-shell-footer-bottom-inner"><span>© ${year} Skunkworks Academy. All rights reserved.</span><nav class="swa-shell-footer-legal" aria-label="Legal"><a href="${destinations.privacy}">Privacy</a><a href="${destinations.cookies}">Cookies</a><a href="${destinations.terms}">Terms</a><a href="${destinations.editorial}">Editorial</a><a href="${destinations.advertising}">Advertising disclosure</a></nav></div></div>`;
  };

  const closeDropdowns = (except = null) => {
    document.querySelectorAll('#swa-global-shell-nav .swa-shell-dd').forEach((dd) => {
      if (dd === except) return;
      dd.dataset.open = 'false';
      dd.querySelector('button')?.setAttribute('aria-expanded', 'false');
    });
  };

  const mount = () => {
    if (!document.head || !document.body) return;

    let style = document.getElementById('swa-global-shell-style');
    if (!style) {
      style = document.createElement('style');
      style.id = 'swa-global-shell-style';
      style.dataset.version = VERSION;
      style.textContent = styleText;
      document.head.appendChild(style);
    }

    removeLegacyShell();
    document.body.classList.add('swa-global-shell-enabled');

    let nav = document.getElementById('swa-global-shell-nav');
    if (!nav) {
      nav = document.createElement('header');
      nav.id = 'swa-global-shell-nav';
      nav.dataset.skunkworksGlobalShell = VERSION;
      nav.setAttribute('role', 'banner');
      nav.innerHTML = navMarkup();
      document.body.insertBefore(nav, document.body.firstChild);

      nav.querySelectorAll('.swa-shell-dd-button').forEach((button) => {
        button.addEventListener('click', (event) => {
          event.stopPropagation();
          const dd = button.closest('.swa-shell-dd');
          const opening = dd.dataset.open !== 'true';
          closeDropdowns(dd);
          dd.dataset.open = String(opening);
          button.setAttribute('aria-expanded', String(opening));
        });
      });

      const mobileButton = nav.querySelector('.swa-shell-mobile-button');
      mobileButton?.addEventListener('click', () => {
        const mobile = document.getElementById('swa-global-shell-mobile');
        const opening = mobile?.dataset.open !== 'true';
        if (mobile) mobile.dataset.open = String(opening);
        mobileButton.setAttribute('aria-expanded', String(opening));
        mobileButton.setAttribute('aria-label', opening ? 'Close Academy menu' : 'Open Academy menu');
        mobileButton.innerHTML = icon(opening ? 'close' : 'menu');
      });
    }

    let mobile = document.getElementById('swa-global-shell-mobile');
    if (!mobile) {
      mobile = document.createElement('nav');
      mobile.id = 'swa-global-shell-mobile';
      mobile.className = 'swa-shell-mobile';
      mobile.dataset.open = 'false';
      mobile.setAttribute('aria-label', 'Mobile Academy navigation');
      mobile.innerHTML = mobileMarkup();
      nav.insertAdjacentElement('afterend', mobile);
    }

    let footer = document.getElementById('swa-global-shell-footer');
    if (!footer) {
      footer = document.createElement('footer');
      footer.id = 'swa-global-shell-footer';
      footer.dataset.skunkworksGlobalShell = VERSION;
      footer.innerHTML = footerMarkup();
      document.body.appendChild(footer);
    }

    markCurrent(nav);
    markCurrent(mobile);

    document.addEventListener('click', (event) => {
      if (!event.target.closest('#swa-global-shell-nav .swa-shell-dd')) closeDropdowns();
    }, { passive: true });

    document.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape') return;
      closeDropdowns();
      const mobilePanel = document.getElementById('swa-global-shell-mobile');
      const mobileButton = document.querySelector('#swa-global-shell-nav .swa-shell-mobile-button');
      if (mobilePanel) mobilePanel.dataset.open = 'false';
      if (mobileButton) {
        mobileButton.setAttribute('aria-expanded', 'false');
        mobileButton.setAttribute('aria-label', 'Open Academy menu');
        mobileButton.innerHTML = icon('menu');
      }
    });
  };

  const syncRoute = () => {
    const nav = document.getElementById('swa-global-shell-nav');
    const mobile = document.getElementById('swa-global-shell-mobile');
    if (nav) markCurrent(nav);
    if (mobile) markCurrent(mobile);
  };

  const patchHistory = () => {
    ['pushState', 'replaceState'].forEach((name) => {
      const original = history[name];
      if (typeof original !== 'function' || original.__swaPatched) return;
      const wrapped = function (...args) {
        const result = original.apply(this, args);
        queueMicrotask(syncRoute);
        return result;
      };
      wrapped.__swaPatched = true;
      history[name] = wrapped;
    });
    addEventListener('popstate', syncRoute);
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount, { once: true });
  else mount();
  patchHistory();
})();
