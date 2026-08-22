/* Skunkworks Academy public web-shell compatibility include. */
(function () {
  "use strict";

  var VERSION = "2026.08.22.1";
  var REVISION = "2026.08.22.1";
  var RUNTIME_VERSION = "2026.08.20.1";
  var PAGE_CONTRACT_VERSION = "2026.08.22.1";
  var BRAND_THEME_VERSION = "2026.08.22.1";
  var CANONICAL_ROOT = "https://skunkworksacademy.com/assets/";
  var PUBLIC_ROOT = "https://www.skunkworksacademy.com/";
  var host = String(window.location && window.location.hostname || "").toLowerCase();
  var isLocalPreview = host === "localhost" || host === "127.0.0.1" || host === "::1";
  var isApexAlias = host === "skunkworksacademy.com" || host === "www.skunkworksacademy.com";
  var PRIMARY_ROOT = (isApexAlias || isLocalPreview)
    ? window.location.origin.replace(/\/$/, "") + "/assets/"
    : CANONICAL_ROOT;

  if (typeof document === "undefined") return;

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

  function applyDeclaredTheme() {
    var root = document.documentElement;
    if (!root || root.hasAttribute("data-theme")) return;

    var meta = document.querySelector('meta[name="color-scheme"]');
    var declared = meta ? String(meta.getAttribute("content") || "").toLowerCase().trim() : "";
    var hasDark = /(^|\s)dark(\s|$)/.test(declared);
    var hasLight = /(^|\s)light(\s|$)/.test(declared);

    /* Respect pages that explicitly declare a single visual mode. Pages that
       support both modes continue to follow the user's OS preference. */
    if (hasDark && !hasLight) root.setAttribute("data-theme", "dark");
    if (hasLight && !hasDark) root.setAttribute("data-theme", "light");
  }

  function installPageContract() {
    var head = document.head || document.documentElement;
    if (!head) return;

    var cssHref = PUBLIC_ROOT + "assets/academy-page-contract.css?v=" + PAGE_CONTRACT_VERSION;
    var css = document.querySelector('link[data-skunkworks-page-contract="css"]');
    if (!css) {
      css = document.createElement("link");
      css.rel = "stylesheet";
      css.setAttribute("data-skunkworks-page-contract", "css");
      head.appendChild(css);
    }
    if (css.getAttribute("href") !== cssHref) css.setAttribute("href", cssHref);

    var runtimeSrc = PUBLIC_ROOT + "assets/academy-page-contract.js?v=" + PAGE_CONTRACT_VERSION;
    var runtime = document.querySelector('script[data-skunkworks-page-contract="runtime"]');
    if (!runtime) {
      runtime = document.createElement("script");
      runtime.defer = true;
      runtime.setAttribute("data-skunkworks-page-contract", "runtime");
      head.appendChild(runtime);
    }
    if (runtime.getAttribute("src") !== runtimeSrc) runtime.setAttribute("src", runtimeSrc);
  }

  function installBrandTheme(moveToEnd) {
    var head = document.head || document.documentElement;
    if (!head) return null;

    var href = PUBLIC_ROOT + "assets/academy-brand-theme.css?v=" + BRAND_THEME_VERSION;
    var link = document.querySelector('link[data-skunkworks-brand-theme="canonical"]');
    if (!link) {
      link = document.createElement("link");
      link.rel = "stylesheet";
      link.setAttribute("data-skunkworks-brand-theme", "canonical");
      head.appendChild(link);
    }
    if (link.getAttribute("href") !== href) link.setAttribute("href", href);
    if (moveToEnd && link.parentNode === head) head.appendChild(link);
    return link;
  }

  applyDeclaredTheme();
  installCanonicalFavicons();
  installPageContract();
  installBrandTheme(false);

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      applyDeclaredTheme();
      installCanonicalFavicons();
      installPageContract();
      installBrandTheme(true);
    }, { once: true });
  }

  if (document.querySelector('script[data-skunkworks-global-nav-runtime="v11"]')) {
    installBrandTheme(true);
    return;
  }

  var primarySrc = PRIMARY_ROOT + "academy-navigation-v11.js?v=" + RUNTIME_VERSION;
  var fallbackSrc = CANONICAL_ROOT + "academy-navigation-v11.js?v=" + RUNTIME_VERSION;
  var script = document.createElement("script");
  script.defer = true;
  script.src = primarySrc;
  script.referrerPolicy = "strict-origin-when-cross-origin";
  script.setAttribute("data-skunkworks-global-nav-runtime", "v11");
  script.setAttribute("data-skunkworks-global-nav-version", RUNTIME_VERSION);

  script.addEventListener("load", function () {
    /* academy-navigation-v11 injects the shared design system. Move the brand
       theme after it so canonical token overrides win deterministically. */
    installBrandTheme(true);
  });

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
    brandThemeVersion: BRAND_THEME_VERSION,
    brandTheme: PUBLIC_ROOT + "assets/academy-brand-theme.css?v=" + BRAND_THEME_VERSION,
    bodyBackground: "theme-owned",
    faviconLight: PUBLIC_ROOT + "images/favicon-black.png?v=" + PAGE_CONTRACT_VERSION,
    faviconDark: PUBLIC_ROOT + "images/favicon-white.png?v=" + PAGE_CONTRACT_VERSION
  };

  (document.head || document.documentElement).appendChild(script);
})();