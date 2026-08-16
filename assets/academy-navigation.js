/* Skunkworks Academy public web-shell compatibility include. */
(function () {
  "use strict";

  var VERSION = "2026.08.15.1";
  var ROOT = "https://skunkworksacademy.com/assets/";

  if (typeof document === "undefined") return;

  window.SKUNKWORKS_ACADEMY_SHELL = Object.assign(window.SKUNKWORKS_ACADEMY_SHELL || {}, {
    version: VERSION,
    compatibility: "v10",
    canonicalUi: ROOT + "skunkworks-ui.js?v=" + VERSION,
    canonicalFooter: ROOT + "skunkworks-footer.js?v=" + VERSION,
    canonicalDesignSystem: ROOT + "skunkworks-design-system.css?v=" + VERSION
  });

  function ensureDesignSystem() {
    var selector = 'link[data-skunkworks-design-system="canonical"]';
    var existing = document.querySelector(selector);
    var href = ROOT + "skunkworks-design-system.css?v=" + VERSION;

    if (existing) {
      if (existing.getAttribute("href") !== href) existing.setAttribute("href", href);
      return existing;
    }

    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    link.setAttribute("data-skunkworks-design-system", "canonical");
    (document.head || document.documentElement).appendChild(link);
    return link;
  }

  function ensureRuntime(src, attribute, value) {
    var selector = 'script[' + attribute + '="' + value + '"]';
    var existing = document.querySelector(selector);
    if (existing) return existing;

    var script = document.createElement("script");
    script.defer = true;
    script.src = src;
    script.crossOrigin = "anonymous";
    script.setAttribute(attribute, value);
    (document.head || document.documentElement).appendChild(script);
    return script;
  }

  function isPreserved(node, kind) {
    if (!node || !node.matches) return true;
    if (kind === "header") {
      return node.matches('.swa-global-nav,[data-sk-preserve-header],[data-skunkworks-ui="canonical"]');
    }
    return node.matches('.swa-global-footer,[data-sk-preserve-footer],[data-skunkworks-global-footer="canonical"]');
  }

  function removeNode(node, kind) {
    if (!node || isPreserved(node, kind)) return;
    if (node.parentNode) node.parentNode.removeChild(node);
  }

  function removeKnownPublicChrome() {
    var headerSelectors = [
      'nav.navbar.navbar--fixed-top',
      '#__docusaurus > nav.navbar',
      '#__docusaurus .theme-layout-navbar > nav.navbar',
      '.site-header',
      '.main-header',
      '.sk-topbar',
      '[data-sk-nav-shell]',
      'header[data-skunkworks-global-header]',
      'header.swa-fallback-top',
      'header.fallback-top',
      'body > nav.ibm-masthead'
    ];
    var footerSelectors = [
      '#__docusaurus > footer.footer',
      '#__docusaurus footer.footer',
      '.site-footer[data-site-footer]',
      'footer[data-skunkworks-global-footer]:not([data-skunkworks-global-footer="canonical"])',
      '[data-site-footer][data-skunkworks-public-shell]'
    ];

    headerSelectors.forEach(function (selector) {
      Array.prototype.slice.call(document.querySelectorAll(selector)).forEach(function (node) {
        if (isPreserved(node, "header")) return;
        if (node.closest && node.closest('main,article,[data-sk-preserve-header]')) return;
        removeNode(node, "header");
      });
    });

    /* Catch legacy static public mastheads without relying on a repo-specific class.
     * A direct body header is removed only when it clearly contains navigation/brand chrome.
     * Content-only document headers remain untouched. */
    Array.prototype.slice.call(document.querySelectorAll('body > header')).forEach(function (node) {
      if (isPreserved(node, "header")) return;
      var hasPublicChrome = Boolean(node.querySelector('nav,.brand,.logo,.nav-toggle,[aria-label*="navigation" i]'));
      if (hasPublicChrome) removeNode(node, "header");
    });

    footerSelectors.forEach(function (selector) {
      Array.prototype.slice.call(document.querySelectorAll(selector)).forEach(function (node) {
        if (isPreserved(node, "footer")) return;
        if (node.closest && node.closest('[data-sk-preserve-footer]')) return;
        removeNode(node, "footer");
      });
    });
  }

  function startChromeGuard() {
    removeKnownPublicChrome();
    if (!document.body || typeof MutationObserver === "undefined") return;

    var observer = new MutationObserver(function () {
      removeKnownPublicChrome();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    window.addEventListener("pagehide", function () {
      observer.disconnect();
    }, { once: true });
  }

  ensureDesignSystem();
  ensureRuntime(ROOT + "skunkworks-ui.js?v=" + VERSION, "data-skunkworks-ui", "canonical");
  ensureRuntime(ROOT + "skunkworks-footer.js?v=" + VERSION, "data-skunkworks-global-footer", "canonical");

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", startChromeGuard, { once: true });
  } else {
    startChromeGuard();
  }
})();
