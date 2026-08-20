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
   * Global page-canvas contract.
   * Every public Academy page that loads the shared shell receives a white
   * document/body canvas regardless of local theme, OS colour preference or
   * page-specific background tokens. Individual sections/cards may still use
   * their own intentional dark or coloured surfaces.
   */
  var BODY_BACKGROUND_STYLE_ID = "swa-global-white-body-contract";

  function installWhiteBodyContract() {
    if (document.getElementById(BODY_BACKGROUND_STYLE_ID)) return;

    var style = document.createElement("style");
    style.id = BODY_BACKGROUND_STYLE_ID;
    style.setAttribute("data-skunkworks-body-background", "white");
    style.textContent = [
      "html, body {",
      "  background-color: #ffffff !important;",
      "  background-image: none !important;",
      "}",
      "body {",
      "  min-height: 100vh;",
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
    bodyBackground: "#ffffff"
  };

  (document.head || document.documentElement).appendChild(script);
})();
