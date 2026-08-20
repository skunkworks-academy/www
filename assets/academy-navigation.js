/* Skunkworks Academy public web-shell compatibility include. */
(function () {
  "use strict";

  var VERSION = "2026.08.15.1";
  var REVISION = "2026.08.16.1";
  var RUNTIME_VERSION = "2026.08.20.1";
  var PAGE_CONTRACT_VERSION = "2026.08.20.3";
  var CANONICAL_ROOT = "https://skunkworksacademy.com/assets/";
  var PUBLIC_ROOT = "https://www.skunkworksacademy.com/";
  var host = String(window.location && window.location.hostname || "").toLowerCase();
  var isLocalPreview = host === "localhost" || host === "127.0.0.1" || host === "::1";
  var isApexAlias = host === "skunkworksacademy.com" || host === "www.skunkworksacademy.com";
  var PRIMARY_ROOT = (isApexAlias || isLocalPreview)
    ? window.location.origin.replace(/\/$/, "") + "/assets/"
    : CANONICAL_ROOT;

  if (typeof document === "undefined") return;

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
      "body { min-height: 100vh; }"
    ].join("\n");
    (document.head || document.documentElement).appendChild(style);
  }

  function installCanonicalFavicons() {
    var head = document.head || document.documentElement;
    if (!head || document.querySelector('link[data-skunkworks-favicon="canonical"]')) return;

    Array.prototype.slice.call(document.querySelectorAll('link[rel~="icon"], link[rel="shortcut icon"]'))
      .forEach(function (node) {
        if (node.parentNode) node.parentNode.removeChild(node);
      });

    [
      { rel: "icon", href: PUBLIC_ROOT + "images/favicon-black.png?v=" + PAGE_CONTRACT_VERSION, media: "", sizes: "32x32" },
      { rel: "shortcut icon", href: PUBLIC_ROOT + "images/favicon-black.png?v=" + PAGE_CONTRACT_VERSION, media: "", sizes: "" },
      { rel: "icon", href: PUBLIC_ROOT + "images/favicon-black.png?v=" + PAGE_CONTRACT_VERSION, media: "(prefers-color-scheme: light)", sizes: "32x32" },
      { rel: "icon", href: PUBLIC_ROOT + "images/favicon-white.png?v=" + PAGE_CONTRACT_VERSION, media: "(prefers-color-scheme: dark)", sizes: "32x32" }
    ].forEach(function (icon) {
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

  function installPageContract() {
    var head = document.head || document.documentElement;
    if (!head) return;

    if (!document.querySelector('link[data-skunkworks-page-contract="css"]')) {
      var css = document.createElement("link");
      css.rel = "stylesheet";
      css.href = PUBLIC_ROOT + "assets/academy-page-contract.css?v=" + PAGE_CONTRACT_VERSION;
      css.setAttribute("data-skunkworks-page-contract", "css");
      head.appendChild(css);
    }

    if (!document.querySelector('script[data-skunkworks-page-contract="runtime"]')) {
      var runtime = document.createElement("script");
      runtime.defer = true;
      runtime.src = PUBLIC_ROOT + "assets/academy-page-contract.js?v=" + PAGE_CONTRACT_VERSION;
      runtime.setAttribute("data-skunkworks-page-contract", "runtime");
      head.appendChild(runtime);
    }
  }

  installWhiteBodyContract();
  installCanonicalFavicons();
  installPageContract();

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      installWhiteBodyContract();
      installCanonicalFavicons();
      installPageContract();
    }, { once: true });
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
    pageContractVersion: PAGE_CONTRACT_VERSION,
    pageContractRuntime: PUBLIC_ROOT + "assets/academy-page-contract.js?v=" + PAGE_CONTRACT_VERSION,
    bodyBackground: "#ffffff",
    faviconLight: PUBLIC_ROOT + "images/favicon-black.png?v=" + PAGE_CONTRACT_VERSION,
    faviconDark: PUBLIC_ROOT + "images/favicon-white.png?v=" + PAGE_CONTRACT_VERSION
  };

  (document.head || document.documentElement).appendChild(script);
})();
