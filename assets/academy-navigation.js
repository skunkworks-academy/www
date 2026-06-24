/* Global Skunkworks Academy navigation normaliser.
   Keeps top-level pages aligned around the same menu class and destination set. */
(function () {
  const navSelectors = [
    'nav.links',
    'nav.sk-nav',
    '#primaryNav',
    '[data-sk-nav]'
  ];

  const isPricingPage = /\/pricing\.index\.html\/?$/.test(window.location.pathname) || window.location.hash === '#pricing' || window.location.hash === '#purchasing';
  const pricingBase = 'https://skunkworksacademy.com/pricing.index.html';

  const planHref = isPricingPage ? '#pricing' : `${pricingBase}#pricing`;
  const purchaseHref = isPricingPage ? '#purchasing' : `${pricingBase}#purchasing`;

  const menuItems = [
    ['https://skunkworksacademy.com/', 'Home'],
    ['https://skunkworksacademy.com/self-paced/', 'Self-paced'],
    ['https://portal.skunkworksacademy.com/', 'Portal'],
    ['https://labs.skunkworksacademy.com/', 'Labs'],
    [planHref, 'Plans'],
    [purchaseHref, 'Purchase']
  ];

  function injectNavigationStyles() {
    if (document.getElementById('academy-navigation-styles')) return;

    const style = document.createElement('style');
    style.id = 'academy-navigation-styles';
    style.textContent = `
      nav.links[aria-label="Primary pricing navigation"] {
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-end;
        align-items: center;
        gap: 8px;
      }

      nav.links[aria-label="Primary pricing navigation"] a {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-height: 42px;
        border: 1px solid var(--line, var(--sk-border, #2a2a2a));
        border-radius: 999px;
        padding: 10px 14px;
        color: var(--muted, var(--sk-muted, #a3a3a3));
        text-decoration: none;
        font-weight: 800;
        line-height: 1;
        white-space: nowrap;
      }

      nav.links[aria-label="Primary pricing navigation"] a:hover,
      nav.links[aria-label="Primary pricing navigation"] a[aria-current="page"] {
        color: var(--text, var(--sk-text, currentColor));
        border-color: color-mix(in srgb, var(--text, currentColor) 42%, transparent);
      }

      @media (max-width: 760px) {
        nav.links[aria-label="Primary pricing navigation"] {
          width: 100%;
          justify-content: flex-start;
          overflow-x: auto;
          padding-bottom: 8px;
          scrollbar-width: thin;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function getCurrentMatch(href) {
    try {
      const linkUrl = new URL(href, window.location.href);
      if (linkUrl.origin !== window.location.origin) return false;
      const current = window.location.pathname.replace(/\/$/, '');
      const target = linkUrl.pathname.replace(/\/$/, '');
      return current === target;
    } catch (_) {
      return false;
    }
  }

  function renderMenu(nav) {
    nav.className = 'links';
    nav.setAttribute('aria-label', 'Primary pricing navigation');
    nav.removeAttribute('data-sk-nav');

    nav.innerHTML = menuItems
      .map(([href, label]) => {
        const current = getCurrentMatch(href) ? ' aria-current="page"' : '';
        return `<a href="${href}"${current}>${label}</a>`;
      })
      .join('');
  }

  function normaliseNavigation() {
    injectNavigationStyles();
    const seen = new Set();

    navSelectors
      .flatMap((selector) => Array.from(document.querySelectorAll(selector)))
      .forEach((nav) => {
        if (seen.has(nav)) return;
        seen.add(nav);
        renderMenu(nav);
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', normaliseNavigation, { once: true });
  } else {
    normaliseNavigation();
  }
})();
