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

  ensureDesignSystem();
  ensureRuntime(ROOT + "skunkworks-ui.js?v=" + VERSION, "data-skunkworks-ui", "canonical");
  ensureRuntime(ROOT + "skunkworks-footer.js?v=" + VERSION, "data-skunkworks-global-footer", "canonical");
})();
