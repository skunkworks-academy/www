/* Skunkworks Academy global favicon and foreground/background contrast runtime. */
(function () {
  "use strict";

  if (typeof document === "undefined") return;
  if (window.SKUNKWORKS_ACADEMY_PAGE_CONTRACT) return;

  var VERSION = "2026.08.20.1";
  var PUBLIC_ROOT = "https://www.skunkworksacademy.com/";
  var FAVICON_LIGHT = PUBLIC_ROOT + "images/favicon-black.png";
  var FAVICON_DARK = PUBLIC_ROOT + "images/favicon-white.png";
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
    "main [class*='section']"
  ].join(",");

  function ensureCanonicalFavicons() {
    var head = document.head || document.documentElement;
    if (!head) return;

    Array.prototype.slice.call(document.querySelectorAll('link[rel~="icon"], link[rel="shortcut icon"]'))
      .forEach(function (node) {
        if (node.parentNode) node.parentNode.removeChild(node);
      });

    [
      { href: FAVICON_LIGHT, media: "(prefers-color-scheme: light)" },
      { href: FAVICON_DARK, media: "(prefers-color-scheme: dark)" }
    ].forEach(function (icon) {
      var link = document.createElement("link");
      link.rel = "icon";
      link.type = "image/png";
      link.href = icon.href;
      link.media = icon.media;
      link.setAttribute("data-skunkworks-favicon", "canonical");
      head.appendChild(link);
    });
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
    element.setAttribute("data-swa-surface-tone", tone);
    element.setAttribute("data-swa-auto-contrast", "true");
  }

  var scheduled = false;
  function refreshSurfaceContracts() {
    scheduled = false;
    ensureCanonicalFavicons();
    var nodes = document.querySelectorAll(SURFACE_SELECTOR);
    for (var i = 0; i < nodes.length; i += 1) classifySurface(nodes[i]);
  }

  function scheduleRefresh() {
    if (scheduled) return;
    scheduled = true;
    (window.requestAnimationFrame || window.setTimeout)(refreshSurfaceContracts);
  }

  ensureCanonicalFavicons();

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", scheduleRefresh, { once: true });
  } else {
    scheduleRefresh();
  }

  window.addEventListener("load", scheduleRefresh, { once: true });
  window.addEventListener("pageshow", scheduleRefresh);

  if (typeof MutationObserver !== "undefined") {
    var observer = new MutationObserver(scheduleRefresh);
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["class", "style", "data-theme", "data-swa-theme", "data-swa-surface", "data-swa-contrast"]
    });
  }

  window.SKUNKWORKS_ACADEMY_PAGE_CONTRACT = {
    version: VERSION,
    faviconLight: FAVICON_LIGHT,
    faviconDark: FAVICON_DARK,
    refresh: refreshSurfaceContracts
  };
})();
