/* Skunkworks Academy public web-shell compatibility include. */
(function () {
  "use strict";

  var VERSION = "2026.08.15.1";
  var REVISION = "2026.08.16.1";
  var CANONICAL_ROOT = "https://skunkworksacademy.com/assets/";
  var host = String(window.location && window.location.hostname || "").toLowerCase();
  var isApexAlias = host === "skunkworksacademy.com" || host === "www.skunkworksacademy.com";
  var PRIMARY_ROOT = isApexAlias ? window.location.origin.replace(/\/$/, "") + "/assets/" : CANONICAL_ROOT;
  var TOP_MENU = [
    { label: "Home", url: "https://skunkworksacademy.com/" },
    { label: "Catalogue", url: "https://skunkworksacademy.com/catalogue/" },
    { label: "Labs", url: "https://labs.skunkworksacademy.com/" },
    { label: "Microsoft", url: "https://microsoft.skunkworksacademy.com/" },
    { label: "IBM", url: "https://ibm.skunkworksacademy.com/" },
    { label: "Security", url: "https://security.skunkworksacademy.com/" },
    { label: "Badging", url: "https://badging.skunkworksacademy.com/" },
    { label: "Jobs", url: "https://jobs.skunkworksacademy.com/" },
    { label: "Blog", url: "https://blog.skunkworksacademy.com/" }
  ];

  if (typeof document === "undefined") return;

  function assetUrl(root, file) {
    return root + file + "?v=" + VERSION + "&rev=" + REVISION;
  }

  window.SKUNKWORKS_ACADEMY_SHELL = Object.assign(window.SKUNKWORKS_ACADEMY_SHELL || {}, {
    version: VERSION,
    revision: REVISION,
    compatibility: "v10",
    canonicalUi: assetUrl(CANONICAL_ROOT, "skunkworks-ui.js"),
    canonicalFooter: assetUrl(CANONICAL_ROOT, "skunkworks-footer.js"),
    canonicalDesignSystem: assetUrl(CANONICAL_ROOT, "skunkworks-design-system.css"),
    assetRoot: PRIMARY_ROOT,
    topMenu: TOP_MENU.slice()
  });

  function ensureDesignSystem() {
    var selector = 'link[data-skunkworks-design-system="canonical"]';
    var existing = document.querySelector(selector);
    var primaryHref = assetUrl(PRIMARY_ROOT, "skunkworks-design-system.css");
    var fallbackHref = assetUrl(CANONICAL_ROOT, "skunkworks-design-system.css");

    if (existing) {
      if (existing.getAttribute("href") !== primaryHref) existing.setAttribute("href", primaryHref);
      return existing;
    }

    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = primaryHref;
    link.setAttribute("data-skunkworks-design-system", "canonical");
    if (primaryHref !== fallbackHref) {
      link.addEventListener("error", function () {
        if (link.href !== fallbackHref) link.href = fallbackHref;
      }, { once: true });
    }
    (document.head || document.documentElement).appendChild(link);
    return link;
  }

  function ensureRuntime(file, attribute, value) {
    var selector = 'script[' + attribute + '="' + value + '"]';
    var existing = document.querySelector(selector);
    if (existing) return existing;

    var primarySrc = assetUrl(PRIMARY_ROOT, file);
    var fallbackSrc = assetUrl(CANONICAL_ROOT, file);
    var script = document.createElement("script");
    script.defer = true;
    script.src = primarySrc;
    script.referrerPolicy = "strict-origin-when-cross-origin";
    script.setAttribute(attribute, value);

    /*
     * IMPORTANT: do not set script.crossOrigin here.
     * These are classic scripts intentionally shared by multiple Academy origins.
     * Setting crossorigin="anonymous" turns the request into a CORS-enforced fetch,
     * while GitHub Pages does not emit Access-Control-Allow-Origin for these assets.
     */
    if (primarySrc !== fallbackSrc) {
      script.addEventListener("error", function () {
        if (script.src === fallbackSrc) return;
        script.src = fallbackSrc;
      });
    }

    (document.head || document.documentElement).appendChild(script);
    return script;
  }

  function ensureTopMenuStyles() {
    if (document.getElementById("swa-global-top-menu-styles")) return;

    var style = document.createElement("style");
    style.id = "swa-global-top-menu-styles";
    style.textContent = [
      "html body.swa-has-global-nav.swa-has-top-menu{padding-top:128px!important}",
      ".swa-global-nav.swa-has-top-menu{min-height:128px!important}",
      ".swa-global-nav__top-menu{display:flex!important;align-items:center!important;min-height:44px!important;width:100%!important;padding:0 clamp(20px,4vw,56px)!important;gap:2px!important;overflow-x:auto!important;overflow-y:hidden!important;background:#1c1c1c!important;border-top:1px solid #484848!important;scrollbar-width:none!important;white-space:nowrap!important}",
      ".swa-global-nav__top-menu::-webkit-scrollbar{display:none!important}",
      ".swa-global-nav__top-menu-link{display:inline-flex!important;align-items:center!important;justify-content:center!important;min-height:43px!important;padding:0 15px!important;border:0!important;border-bottom:3px solid transparent!important;background:transparent!important;color:#f5f5f5!important;text-decoration:none!important;font-family:Segoe UI,SegoeUI,system-ui,-apple-system,BlinkMacSystemFont,Arial,sans-serif!important;font-size:14px!important;font-weight:600!important;line-height:1!important;letter-spacing:.005em!important}",
      ".swa-global-nav__top-menu-link:hover,.swa-global-nav__top-menu-link:focus{background:#303030!important;color:#fff!important;text-decoration:none!important}",
      ".swa-global-nav__top-menu-link:focus-visible{outline:3px solid #fff!important;outline-offset:-4px!important}",
      ".swa-global-nav__top-menu-link[aria-current=\"page\"]{border-bottom-color:#2b88d8!important;background:#303030!important;color:#fff!important}",
      "@media(max-width:980px){html body.swa-has-global-nav.swa-has-top-menu{padding-top:84px!important}.swa-global-nav.swa-has-top-menu{min-height:84px!important}.swa-global-nav__top-menu{display:none!important}}",
      "@media(max-width:620px){html body.swa-has-global-nav.swa-has-top-menu{padding-top:74px!important}.swa-global-nav.swa-has-top-menu{min-height:74px!important}}"
    ].join("\n");
    (document.head || document.documentElement).appendChild(style);
  }

  function isCurrentTopDestination(destination) {
    try {
      var current = new URL(window.location.href);
      var target = new URL(destination.url);
      if (current.hostname !== target.hostname) return false;
      var targetPath = target.pathname.replace(/\/$/, "") || "/";
      var currentPath = current.pathname.replace(/\/$/, "") || "/";
      return targetPath === "/" || currentPath === targetPath || currentPath.indexOf(targetPath + "/") === 0;
    } catch (_error) {
      return false;
    }
  }

  function ensureTopMenu() {
    if (!document.body || document.body.getAttribute("data-sk-global-nav") === "off") return false;
    var header = document.querySelector(".swa-global-nav");
    if (!header) return false;

    var existing = header.querySelector(".swa-global-nav__top-menu");
    if (existing) {
      header.classList.add("swa-has-top-menu");
      document.body.classList.add("swa-has-top-menu");
      return true;
    }

    var nav = document.createElement("nav");
    nav.className = "swa-global-nav__top-menu";
    nav.setAttribute("aria-label", "Primary Academy navigation");
    nav.setAttribute("data-skunkworks-top-menu", "canonical");

    TOP_MENU.forEach(function (destination) {
      var link = document.createElement("a");
      link.className = "swa-global-nav__top-menu-link";
      link.href = destination.url;
      link.textContent = destination.label;
      if (isCurrentTopDestination(destination)) link.setAttribute("aria-current", "page");
      nav.appendChild(link);
    });

    header.appendChild(nav);
    header.classList.add("swa-has-top-menu");
    document.body.classList.add("swa-has-top-menu");
    return true;
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

  function refreshCanonicalChrome() {
    removeKnownPublicChrome();
    ensureTopMenu();
  }

  function startChromeGuard() {
    refreshCanonicalChrome();
    if (!document.body || typeof MutationObserver === "undefined") return;

    var observer = new MutationObserver(function () {
      refreshCanonicalChrome();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    window.addEventListener("popstate", function () {
      var nav = document.querySelector(".swa-global-nav__top-menu");
      if (nav && nav.parentNode) nav.parentNode.removeChild(nav);
      ensureTopMenu();
    });

    window.addEventListener("pagehide", function () {
      observer.disconnect();
    }, { once: true });
  }

  ensureDesignSystem();
  ensureTopMenuStyles();
  ensureRuntime("skunkworks-ui.js", "data-skunkworks-ui", "canonical");
  ensureRuntime("skunkworks-footer.js", "data-skunkworks-global-footer", "canonical");

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", startChromeGuard, { once: true });
  } else {
    startChromeGuard();
  }
})();