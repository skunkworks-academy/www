/* Global Skunkworks Academy fallback header.
   Applies the same header and pricing navigation structure to every page that loads this asset. */
(function () {
  const logoLight = 'https://raw.githubusercontent.com/skunkworks-academy/.github/refs/heads/main/images/favicon-black.png';
  const logoDark = 'https://raw.githubusercontent.com/skunkworks-academy/.github/refs/heads/main/images/favicon-white.png';

  const headerMarkup = `
    <div class="shell nav">
      <a class="brand" href="https://skunkworksacademy.com/" aria-label="Skunkworks Academy home">
        <img class="brand-logo logo-light" src="${logoLight}" alt="">
        <img class="brand-logo logo-dark" src="${logoDark}" alt="">
        <span>Skunkworks Academy <span style="color:var(--muted);font-weight:700;letter-spacing:0">Pricing</span></span>
      </a>
      <nav class="links" aria-label="Primary pricing navigation">
        <a href="https://skunkworksacademy.com/">Home</a>
        <a href="https://skunkworksacademy.com/self-paced/">Self-paced</a>
        <a href="https://portal.skunkworksacademy.com/">Portal</a>
        <a href="https://labs.skunkworksacademy.com/">Labs</a>
        <a href="#pricing">Plans</a>
        <a href="#purchasing">Purchase</a>
      </nav>
    </div>
  `;

  function injectHeaderStyles() {
    if (document.getElementById('academy-navigation-styles')) return;

    const style = document.createElement('style');
    style.id = 'academy-navigation-styles';
    style.textContent = `
      .nav-toggle,
      .sk-nav-toggle {
        display: none !important;
      }

      header.top[data-fallback-header="true"] {
        position: sticky;
        top: 0;
        z-index: 1000;
        border-bottom: 1px solid var(--line, var(--sk-border, rgba(148, 163, 184, .22)));
        background: color-mix(in srgb, var(--bg, var(--sk-bg, #050505)) 92%, transparent);
        backdrop-filter: blur(18px);
      }

      header.top[data-fallback-header="true"] .shell.nav {
        width: min(1180px, calc(100% - 32px));
        margin: 0 auto;
        min-height: 76px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 18px;
      }

      header.top[data-fallback-header="true"] .brand {
        display: inline-flex;
        align-items: center;
        gap: 12px;
        color: var(--text, var(--sk-text, currentColor));
        text-decoration: none;
        font-weight: 900;
        letter-spacing: -.02em;
        white-space: nowrap;
      }

      header.top[data-fallback-header="true"] .brand-logo {
        width: 38px;
        height: 38px;
        border-radius: 12px;
        object-fit: contain;
        flex: 0 0 auto;
      }

      header.top[data-fallback-header="true"] .logo-dark { display: none; }

      @media (prefers-color-scheme: dark) {
        header.top[data-fallback-header="true"] .logo-light { display: none; }
        header.top[data-fallback-header="true"] .logo-dark { display: inline-block; }
      }

      header.top[data-fallback-header="true"] nav.links[aria-label="Primary pricing navigation"] {
        display: flex !important;
        flex-wrap: wrap;
        justify-content: flex-end;
        align-items: center;
        gap: 8px;
      }

      header.top[data-fallback-header="true"] nav.links[aria-label="Primary pricing navigation"] a {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-height: 42px;
        border: 1px solid var(--line, var(--sk-border, rgba(148, 163, 184, .26)));
        border-radius: 999px;
        padding: 10px 14px;
        color: var(--muted, var(--sk-muted, #a3a3a3));
        background: rgba(255, 255, 255, .035);
        text-decoration: none;
        font-weight: 800;
        line-height: 1;
        white-space: nowrap;
      }

      header.top[data-fallback-header="true"] nav.links[aria-label="Primary pricing navigation"] a:hover,
      header.top[data-fallback-header="true"] nav.links[aria-label="Primary pricing navigation"] a[aria-current="page"] {
        color: var(--text, var(--sk-text, currentColor));
        border-color: color-mix(in srgb, var(--text, currentColor) 42%, transparent);
      }

      @media (max-width: 860px) {
        header.top[data-fallback-header="true"] .shell.nav {
          align-items: flex-start;
          flex-direction: column;
          padding: 14px 0;
        }

        header.top[data-fallback-header="true"] nav.links[aria-label="Primary pricing navigation"] {
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

  function setCurrentState(header) {
    const currentUrl = new URL(window.location.href);
    header.querySelectorAll('nav.links a').forEach((anchor) => {
      try {
        const linkUrl = new URL(anchor.getAttribute('href'), window.location.href);
        const samePage = linkUrl.origin === currentUrl.origin && linkUrl.pathname.replace(/\/$/, '') === currentUrl.pathname.replace(/\/$/, '');
        if (samePage) anchor.setAttribute('aria-current', 'page');
      } catch (_) {
        // Leave non-standard hrefs untouched.
      }
    });
  }

  function buildHeader() {
    const header = document.createElement('header');
    header.className = 'top';
    header.setAttribute('data-fallback-header', 'true');
    header.innerHTML = headerMarkup;
    setCurrentState(header);
    return header;
  }

  function applyGlobalHeader() {
    injectHeaderStyles();

    const replacement = buildHeader();
    const existingHeader = document.querySelector('header.top[data-fallback-header="true"], header.site-header, header.sk-topbar, header.top, .site-header, .sk-topbar');

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
})();
