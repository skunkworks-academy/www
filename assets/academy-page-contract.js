/* Skunkworks Academy global favicon and foreground/background contrast runtime. */
(function () {
  "use strict";

  if (typeof document === "undefined") return;
  if (window.SKUNKWORKS_ACADEMY_PAGE_CONTRACT) return;

  var VERSION = "2026.08.27.1";
  var FORMS_VERSION = "2026.08.20.1";
  var PUBLIC_ROOT = "https://www.skunkworksacademy.com/";
  var host = String(window.location && window.location.hostname || "").toLowerCase();
  var isLocalPreview = host === "localhost" || host === "127.0.0.1" || host === "::1";
  var isApexAlias = host === "skunkworksacademy.com" || host === "www.skunkworksacademy.com";
  var ASSET_ROOT = (isApexAlias || isLocalPreview)
    ? window.location.origin.replace(/\/$/, "") + "/"
    : PUBLIC_ROOT;
  var FAVICON_LIGHT = ASSET_ROOT + "images/favicon-black.png?v=" + VERSION;
  var FAVICON_DARK = ASSET_ROOT + "images/favicon-white.png?v=" + VERSION;
  var FORMS_DESIGN_SYSTEM = ASSET_ROOT + "assets/skunkworks-design-system.css?v=2026.08.20.1&rev=2026.08.20.1";
  var FORMS_STYLES = ASSET_ROOT + "assets/academy-forms.css?v=" + FORMS_VERSION;
  var FORMS_GLOBAL_NAV = ASSET_ROOT + "assets/academy-navigation.js?v=2026.08.27.1&rev=2026.08.27.1";
  var pathname = String(window.location && window.location.pathname || "/");
  var isFormsPage = /^\/forms(?:\/|$)/i.test(pathname);

  var SURFACE_SELECTOR = [
    "main",
    "main section",
    "main article",
    "main aside",
    "main figure",
    "main details",
    "main fieldset",
    "main div[class]",
    "main [data-swa-surface]",
    "main [class*='card']",
    "main [class*='panel']",
    "main [class*='tile']",
    "main [class*='box']",
    "main [class*='container']",
    "main [class*='surface']",
    "main [class*='module']",
    "main [class*='block']",
    "main [class*='hero']",
    "main [class*='section']",
    ".document",
    ".document section",
    ".document article",
    ".document aside",
    ".document fieldset",
    ".document form",
    ".document table",
    ".document th",
    ".document td",
    ".document div[class]",
    ".document > .cover",
    "section.cover"
  ].join(",");

  function faviconSpec() {
    return [
      { rel: "icon", href: FAVICON_LIGHT, media: "", sizes: "32x32" },
      { rel: "shortcut icon", href: FAVICON_LIGHT, media: "", sizes: "" },
      { rel: "icon", href: FAVICON_LIGHT, media: "(prefers-color-scheme: light)", sizes: "32x32" },
      { rel: "icon", href: FAVICON_DARK, media: "(prefers-color-scheme: dark)", sizes: "32x32" }
    ];
  }

  function canonicalFaviconsAreCurrent() {
    var expected = faviconSpec();
    var nodes = Array.prototype.slice.call(document.querySelectorAll('link[data-skunkworks-favicon="canonical"]'));
    if (nodes.length !== expected.length) return false;

    return expected.every(function (icon) {
      return nodes.some(function (node) {
        return node.getAttribute("rel") === icon.rel &&
          node.getAttribute("href") === icon.href &&
          (node.getAttribute("media") || "") === icon.media &&
          (node.getAttribute("sizes") || "") === icon.sizes;
      });
    });
  }

  function ensureCanonicalFavicons() {
    var head = document.head || document.documentElement;
    if (!head || canonicalFaviconsAreCurrent()) return;

    Array.prototype.slice.call(document.querySelectorAll('link[rel~="icon"], link[rel="shortcut icon"]'))
      .forEach(function (node) {
        if (node.parentNode) node.parentNode.removeChild(node);
      });

    faviconSpec().forEach(function (icon) {
      var link = document.createElement("link");
      link.rel = icon.rel;
      link.type = "image/png";
      link.href = icon.href;
      if (icon.media) link.media = icon.media;
      if (icon.sizes) link.sizes = icon.sizes;
      link.setAttribute("data-skunkworks-favicon", "canonical");
      head.appendChild(link);
    });
  }

  function ensureStylesheet(attribute, value, href) {
    var head = document.head || document.documentElement;
    if (!head) return null;
    var selector = 'link[' + attribute + '="' + value + '"]';
    var existing = document.querySelector(selector);
    if (existing) {
      if (existing.getAttribute("href") !== href) existing.setAttribute("href", href);
      return existing;
    }
    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    link.setAttribute(attribute, value);
    head.appendChild(link);
    return link;
  }

  function ensureScript(attribute, value, src) {
    var head = document.head || document.documentElement;
    if (!head) return null;
    var selector = 'script[' + attribute + '="' + value + '"]';
    var existing = document.querySelector(selector);
    if (existing) {
      if (existing.getAttribute("src") !== src) existing.setAttribute("src", src);
      return existing;
    }
    var script = document.createElement("script");
    script.defer = true;
    script.src = src;
    script.referrerPolicy = "strict-origin-when-cross-origin";
    script.setAttribute(attribute, value);
    head.appendChild(script);
    return script;
  }

  function ensureFormsExperience() {
    if (!isFormsPage) return;
    ensureStylesheet("data-skunkworks-design-system", "forms-canonical", FORMS_DESIGN_SYSTEM);
    ensureStylesheet("data-skunkworks-forms-style", "canonical", FORMS_STYLES);
    ensureScript("data-skunkworks-global-nav", "forms-canonical", FORMS_GLOBAL_NAV);
    if (document.body) document.body.setAttribute("data-skunkworks-forms-theme", "canonical");
  }

  function parseColour(value) {
    if (!value) return null;
    var match = String(value).match(/rgba?\(\s*([\d.]+)[, ]+\s*([\d.]+)[, ]+\s*([\d.]+)(?:\s*[,/]\s*([\d.]+))?\s*\)/i);
    if (!match) return null;
    return {
      r: Math.max(0, Math.min(255, Number(match[1]))),
      g: Math.max(0, Math.min(255, Number(match[2]))),
      b: Math.max(0, Math.min(255, Number(match[3]))),
      a: match[4] == null ? 1 : Math.max(0, Math.min(1, Number(match[4])))
    };
  }

  function colourFromGradient(backgroundImage) {
    if (!backgroundImage || backgroundImage === "none") return null;
    var match = String(backgroundImage).match(/rgba?\([^)]*\)/i);
    return match ? parseColour(match[0]) : null;
  }

  function effectiveBackground(element) {
    var node = element;
    while (node && node.nodeType === 1) {
      var style = window.getComputedStyle(node);
      var colour = parseColour(style.backgroundColor);
      if (colour && colour.a >= 0.82) return colour;

      var gradientColour = colourFromGradient(style.backgroundImage);
      if (gradientColour && gradientColour.a >= 0.82) return gradientColour;

      node = node.parentElement;
    }
    return { r: 255, g: 255, b: 255, a: 1 };
  }

  function channel(value) {
    var c = value / 255;
    return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  }

  function luminance(colour) {
    return 0.2126 * channel(colour.r) + 0.7152 * channel(colour.g) + 0.0722 * channel(colour.b);
  }

  function classifySurface(element) {
    if (!element || element.closest('[data-swa-contrast="preserve"]')) return;
    if (element.closest('.swa-global-nav, .swa-global-footer, .site-footer, footer')) return;

    var background = effectiveBackground(element);
    var tone = luminance(background) <= 0.42 ? "dark" : "light";
    if (element.getAttribute("data-swa-surface-tone") !== tone) {
      element.setAttribute("data-swa-surface-tone", tone);
    }
    if (element.getAttribute("data-swa-auto-contrast") !== "true") {
      element.setAttribute("data-swa-auto-contrast", "true");
    }
  }

  var scheduled = false;
  function refreshSurfaceContracts() {
    scheduled = false;
    ensureCanonicalFavicons();
    ensureFormsExperience();
    var nodes = document.querySelectorAll(SURFACE_SELECTOR);
    for (var i = 0; i < nodes.length; i += 1) classifySurface(nodes[i]);
  }

  function scheduleRefresh() {
    if (scheduled) return;
    scheduled = true;
    (window.requestAnimationFrame || window.setTimeout)(refreshSurfaceContracts);
  }

  ensureCanonicalFavicons();
  ensureFormsExperience();

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", scheduleRefresh, { once: true });
  } else {
    scheduleRefresh();
  }

  window.addEventListener("load", scheduleRefresh, { once: true });
  window.addEventListener("pageshow", scheduleRefresh);
  window.addEventListener("skunkworksacademy:theme-change", scheduleRefresh);

  if (typeof MutationObserver !== "undefined") {
    var observerRoot = document.body || document.documentElement;
    var observer = new MutationObserver(scheduleRefresh);
    observer.observe(observerRoot, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["class", "style", "data-theme", "data-swa-theme", "data-swa-surface", "data-swa-contrast"]
    });
  }

  window.SKUNKWORKS_ACADEMY_PAGE_CONTRACT = {
    version: VERSION,
    formsVersion: FORMS_VERSION,
    faviconLight: FAVICON_LIGHT,
    faviconDark: FAVICON_DARK,
    formsDesignSystem: FORMS_DESIGN_SYSTEM,
    formsStyles: FORMS_STYLES,
    refresh: refreshSurfaceContracts
  };
})();
