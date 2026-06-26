/* Global Skunkworks Academy navigation.
   Injects a consistent, responsive organisation header across Academy pages. */
(function () {
  'use strict';

  const logoLight = 'https://raw.githubusercontent.com/skunkworks-academy/.github/refs/heads/main/images/favicon-black.png';
  const logoDark = 'https://raw.githubusercontent.com/skunkworks-academy/.github/refs/heads/main/images/favicon-white.png';
  const pricingBase = 'https://skunkworksacademy.com/pricing.index.html';
  const currentPath = window.location.pathname.replace(/\/$/, '');
  const isPricingPage = /\/pricing\.index\.html\/?$/.test(window.location.pathname);

  const navItems = [
    { label: 'Home', href: 'https://skunkworksacademy.com/' },
    { label: 'AI Learning', href: 'https://skunkworksacademy.com/#new-way-to-learn' },
    { label: 'Self-paced', href: 'https://skunkworksacademy.com/self-paced/' },
    { label: 'Portal', href: 'https://portal.skunkworksacademy.com/' },
    { label: 'Labs', href: 'https://labs.skunkworksacademy.com/' },
    { label: 'Badge Hub', href: 'https://badging.skunkworksacademy.com/' },
    { label: 'Jobs', href: 'https://jobs.skunkworksacademy.com/' },
    { label: 'Media', href: 'https://media.skunkworksacademy.com/' },
    { label: 'Security', href: 'https://security.skunkworksacademy.com/' },
    { label: 'IBM', href: 'https://ibm.skunkworksacademy.com/' },
    { label: 'Plans', href: isPricingPage ? '#pricing' : `${pricingBase}#pricing` },
    { label: 'Purchase', href: isPricingPage ? '#purchasing' : `${pricingBase}#purchasing` }
  ];

  function escapeAttr(value) {
    return String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
  }

  function getHeaderMarkup() {
    const links = navItems.map((item) => `<a href="${escapeAttr(item.href)}">${item.label}</a>`).join('');
    return `
      <div class="sk-shell sk-nav-shell">
        <a class="sk-brand" href="https://skunkworksacademy.com/" aria-label="Skunkworks Academy home">
          <img class="sk-brand-logo sk-logo-light" src="${logoLight}" alt="">
          <img class="sk-brand-logo sk-logo-dark" src="${logoDark}" alt="">
          <span>Skunkworks Academy</span>
        </a>
        <button class="sk-nav-toggle" type="button" aria-label="Toggle site navigation" aria-expanded="false" aria-controls="academyPrimaryNav">
          <span class="sk-nav-toggle-bars" aria-hidden="true"></span>
        </button>
        <nav class="sk-links" id="academyPrimaryNav" aria-label="Skunkworks Academy navigation">
          ${links}
        </nav>
      </div>
    `;
  }

  function injectHeaderStyles() {
    if (document.getElementById('academy-navigation-styles')) return;

    const style = document.createElement('style');
    style.id = 'academy-navigation-styles';
    style.textContent = `
      :root { --sk-nav-height: 76px; }
      body.sk-nav-open { overflow: hidden; }
      header.sk-global-header {
        position: sticky;
        top: 0;
        z-index: 1000;
        border-bottom: 1px solid var(--line, var(--sk-border, rgba(148, 163, 184, .22)));
        background: rgba(5, 5, 5, .88);
        color: var(--text, var(--sk-text, #f5f5f5));
        backdrop-filter: blur(18px);
        -webkit-backdrop-filter: blur(18px);
      }
      header.sk-global-header .sk-shell {
        width: min(1180px, calc(100% - 32px));
        margin: 0 auto;
      }
      header.sk-global-header .sk-nav-shell {
        min-height: var(--sk-nav-height);
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 18px;
        position: relative;
      }
      header.sk-global-header .sk-brand {
        display: inline-flex;
        align-items: center;
        gap: 12px;
        min-width: 0;
        color: inherit;
        text-decoration: none;
        font-weight: 900;
        letter-spacing: -.035em;
        white-space: nowrap;
      }
      header.sk-global-header .sk-brand-logo {
        width: 36px;
        height: 36px;
        border-radius: 11px;
        object-fit: contain;
        flex: 0 0 auto;
      }
      header.sk-global-header .sk-logo-dark { display: none; }
      @media (prefers-color-scheme: dark) {
        header.sk-global-header .sk-logo-light { display: none; }
        header.sk-global-header .sk-logo-dark { display: inline-block; }
      }
      header.sk-global-header .sk-links {
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-end;
        align-items: center;
        gap: 8px;
      }
      header.sk-global-header .sk-links a {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-height: 40px;
        border: 1px solid var(--line, var(--sk-border, rgba(148, 163, 184, .26)));
        border-radius: 999px;
        padding: 10px 13px;
        color: var(--muted, var(--sk-muted, #a3a3a3));
        background: rgba(255, 255, 255, .035);
        text-decoration: none;
        font-weight: 800;
        line-height: 1;
        white-space: nowrap;
      }
      header.sk-global-header .sk-links a:hover,
      header.sk-global-header .sk-links a[aria-current="page"] {
        color: var(--text, var(--sk-text, #f5f5f5));
        border-color: rgba(6, 182, 212, .45);
        background: rgba(6, 182, 212, .10);
      }
      header.sk-global-header .sk-nav-toggle {
        display: none;
        align-items: center;
        justify-content: center;
        width: 46px;
        height: 46px;
        flex: 0 0 auto;
        border: 1px solid var(--line, var(--sk-border, rgba(148, 163, 184, .26)));
        border-radius: 16px;
        background: rgba(255,255,255,.045);
        color: inherit;
        cursor: pointer;
      }
      header.sk-global-header .sk-nav-toggle-bars,
      header.sk-global-header .sk-nav-toggle-bars::before,
      header.sk-global-header .sk-nav-toggle-bars::after {
        display: block;
        width: 20px;
        height: 2px;
        border-radius: 99px;
        background: currentColor;
        transition: transform .2s ease, opacity .2s ease;
      }
      header.sk-global-header .sk-nav-toggle-bars { position: relative; }
      header.sk-global-header .sk-nav-toggle-bars::before,
      header.sk-global-header .sk-nav-toggle-bars::after { content: ""; position: absolute; left: 0; }
      header.sk-global-header .sk-nav-toggle-bars::before { top: -7px; }
      header.sk-global-header .sk-nav-toggle-bars::after { top: 7px; }
      header.sk-global-header .sk-nav-toggle[aria-expanded="true"] .sk-nav-toggle-bars { background: transparent; }
      header.sk-global-header .sk-nav-toggle[aria-expanded="true"] .sk-nav-toggle-bars::before { transform: translateY(7px) rotate(45deg); }
      header.sk-global-header .sk-nav-toggle[aria-expanded="true"] .sk-nav-toggle-bars::after { transform: translateY(-7px) rotate(-45deg); }
      @media (prefers-color-scheme: light) {
        header.sk-global-header {
          background: rgba(255, 255, 255, .88);
          color: var(--text, var(--sk-text, #050505));
        }
      }
      @media (max-width: 980px) {
        :root { --sk-nav-height: 68px; }
        header.sk-global-header .sk-nav-toggle { display: inline-flex; }
        header.sk-global-header .sk-links {
          display: none;
          position: fixed;
          top: calc(var(--sk-nav-height) + env(safe-area-inset-top, 0px) + 10px);
          left: max(12px, env(safe-area-inset-left, 0px));
          right: max(12px, env(safe-area-inset-right, 0px));
          z-index: 1001;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 8px;
          max-height: calc(100dvh - var(--sk-nav-height) - env(safe-area-inset-top, 0px) - env(safe-area-inset-bottom, 0px) - 24px);
          overflow-y: auto;
          padding: 12px;
          border: 1px solid rgba(255,255,255,.14);
          border-radius: 22px;
          background: rgba(17,18,20,.97);
          box-shadow: 0 24px 70px rgba(0,0,0,.6);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
        }
        header.sk-global-header .sk-links.sk-open { display: grid; }
        header.sk-global-header .sk-links a { width: 100%; justify-content: flex-start; min-height: 48px; border-radius: 14px; color: #f5f5f5; }
      }
      @media (max-width: 560px) {
        header.sk-global-header .sk-shell { width: min(100% - 24px, 1180px); }
        header.sk-global-header .sk-links { grid-template-columns: 1fr; }
        header.sk-global-header .sk-brand span { font-size: 1rem; }
      }
    `;
    document.head.appendChild(style);
  }

  function setCurrentState(header) {
    const currentUrl = new URL(window.location.href);
    header.querySelectorAll('.sk-links a').forEach((anchor) => {
      try {
        const linkUrl = new URL(anchor.getAttribute('href'), window.location.href);
        const samePage = linkUrl.origin === currentUrl.origin && linkUrl.pathname.replace(/\/$/, '') === currentPath;
        if (samePage) anchor.setAttribute('aria-current', 'page');
      } catch (_) {
        // Leave non-standard hrefs untouched.
      }
    });
  }

  function bindMenu(header) {
    const toggle = header.querySelector('.sk-nav-toggle');
    const nav = header.querySelector('#academyPrimaryNav');
    if (!toggle || !nav) return;

    const close = () => {
      toggle.setAttribute('aria-expanded', 'false');
      nav.classList.remove('sk-open');
      document.body.classList.remove('sk-nav-open');
    };
    const open = () => {
      toggle.setAttribute('aria-expanded', 'true');
      nav.classList.add('sk-open');
      document.body.classList.add('sk-nav-open');
    };

    toggle.addEventListener('click', () => toggle.getAttribute('aria-expanded') === 'true' ? close() : open());
    nav.addEventListener('click', (event) => { if (event.target.closest('a')) close(); });
    document.addEventListener('click', (event) => {
      if (!nav.classList.contains('sk-open')) return;
      if (!event.target.closest('header.sk-global-header')) close();
    });
    document.addEventListener('keydown', (event) => { if (event.key === 'Escape') close(); });
    window.matchMedia('(min-width: 981px)').addEventListener('change', close);
  }

  function buildHeader() {
    const header = document.createElement('header');
    header.className = 'sk-global-header top';
    header.setAttribute('data-skunkworks-global-header', 'v2');
    header.innerHTML = getHeaderMarkup();
    setCurrentState(header);
    bindMenu(header);
    return header;
  }

  function applyGlobalHeader() {
    injectHeaderStyles();

    const replacement = buildHeader();
    const existingHeader = document.querySelector('header[data-skunkworks-global-header], header.top[data-fallback-header="true"], header.site-header, header.sk-topbar, header.top, .site-header, .sk-topbar');

    if (existingHeader) {
      existingHeader.replaceWith(replacement);
      return;
    }

    document.body.insertBefore(replacement, document.body.firstChild);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyGlobalHeader, { once: true });
  } else {
    applyGlobalHeader();
  }
}());
