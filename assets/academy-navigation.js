/* Skunkworks Academy public web-shell compatibility include. */
(function () {
  "use strict";

  var VERSION = "2026.08.15.1";
  var REVISION = "2026.08.16.1";
  var RUNTIME_VERSION = "2026.08.20.1";
  var CANONICAL_ROOT = "https://skunkworksacademy.com/assets/";
  var host = String(window.location && window.location.hostname || "").toLowerCase();
  var isLocalPreview = host === "localhost" || host === "127.0.0.1" || host === "::1";
  var isApexAlias = host === "skunkworksacademy.com" || host === "www.skunkworksacademy.com";
  var PRIMARY_ROOT = (isApexAlias || isLocalPreview)
    ? window.location.origin.replace(/\/$/, "") + "/assets/"
    : CANONICAL_ROOT;

  if (typeof document === "undefined") return;

  /*
   * Global white-surface contract.
   * Every public Academy page that loads the shared shell receives a white
   * document canvas and white content surfaces, regardless of local theme,
   * OS colour preference or page-specific background tokens.
   *
   * Scope is intentionally limited to the page content area so the canonical
   * global navigation and footer may retain their own design-system surfaces.
   * Interactive controls and media retain their component-specific styling.
   */
  var BODY_BACKGROUND_STYLE_ID = "swa-global-white-body-contract";

  function installWhiteBodyContract() {
    if (document.getElementById(BODY_BACKGROUND_STYLE_ID)) return;

    var style = document.createElement("style");
    style.id = BODY_BACKGROUND_STYLE_ID;
    style.setAttribute("data-skunkworks-body-background", "white");
    style.setAttribute("data-skunkworks-content-surfaces", "white");
    style.textContent = [
      "html, body {",
      "  background-color: #ffffff !important;",
      "  background-image: none !important;",
      "}",
      "body {",
      "  min-height: 100vh;",
      "}",
      "main,",
      "main section,",
      "main article,",
      "main aside,",
      "main div[class],",
      "main figure,",
      "main details,",
      "main fieldset,",
      "main [class*='card'],",
      "main [class*='panel'],",
      "main [class*='tile'],",
      "main [class*='box'],",
      "main [class*='container'],",
      "main [class*='surface'],",
      "main [class*='module'],",
      "main [class*='block'],",
      "main [class*='resource'],",
      "main [class*='steps'],",
      "main [class*='note'],",
      "main [class*='hero'],",
      "main [class*='section'] {",
      "  background-color: #ffffff !important;",
      "  background-image: none !important;",
      "}",
      "main,",
      "main section,",
      "main article,",
      "main aside,",
      "main div[class],",
      "main figure,",
      "main details,",
      "main fieldset {",
      "  color: #161616 !important;",
      "}",
      "main h1, main h2, main h3, main h4, main h5, main h6 {",
      "  color: #161616 !important;",
      "}",
      "main p, main li, main dt, main dd, main label {",
      "  color: #3f3f46 !important;",
      "}",
      "main a:not(.btn):not(.button):not([class*='button']) {",
      "  color: #004f9e;",
      "}",
      "main .btn.primary,",
      "main .button--primary,",
      "main [class*='button--primary'] {",
      "  color: #ffffff !important;",
      "}"
    ].join("\n");

    (document.head || document.documentElement).appendChild(style);
  }

  installWhiteBodyContract();

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", installWhiteBodyContract, { once: true });
  }

  if (document.querySelector('script[data-skunkworks-global-nav-runtime="v11"]')) return;

  var primarySrc = PRIMARY_ROOT + "academy-navigation-v11.js?v=" + RUNTIME_VERSION;
  var fallbackSrc = CANONICAL_ROOT + "academy-navigation-v11.js?v=" + RUNTIME_VERSION;
  var script = document.createElement("script");
  script.defer = true;
  script.src = primarySrc;
  script.referrerPolicy = "strict-origin-when-cross-origin";
  script.setAttribute("data-skunkworks-global-nav-runtime", "v11");
  script.setAttribute("data-skunkworks-global-nav-version", RUNTIME_VERSION);

  if (!isLocalPreview && primarySrc !== fallbackSrc) {
    script.addEventListener("error", function () {
      if (script.src !== fallbackSrc) script.src = fallbackSrc;
    });
  }

  window.SKUNKWORKS_ACADEMY_SHELL_BOOTSTRAP = {
    version: VERSION,
    revision: REVISION,
    runtimeVersion: RUNTIME_VERSION,
    runtime: primarySrc,
    bodyBackground: "#ffffff",
    contentSurface: "#ffffff"
  };

  (document.head || document.documentElement).appendChild(script);
})();
