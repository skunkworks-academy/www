/* Skunkworks Academy public web-shell compatibility include. */
(function () {
  "use strict";

  var VERSION = "2026.08.25.2";
  var REVISION = "2026.08.25.2";
  var RUNTIME_VERSION = "2026.08.20.1";
  var PAGE_CONTRACT_VERSION = "2026.08.25.1";
  var BRAND_THEME_VERSION = "2026.08.22.2";
  var THEME_CONFORMANCE_VERSION = "2026.08.23.2";
  var LEARN_THEME_VERSION = "2026.08.25.2";
  var CANONICAL_ROOT = "https://skunkworksacademy.com/assets/";
  var PUBLIC_ROOT = "https://www.skunkworksacademy.com/";
  var host = String(window.location && window.location.hostname || "").toLowerCase();
  var pathname = String(window.location && window.location.pathname || "/").toLowerCase();
  var isLocalPreview = host === "localhost" || host === "127.0.0.1" || host === "::1";
  var isApexAlias = host === "skunkworksacademy.com" || host === "www.skunkworksacademy.com";
  var ORIGIN_ROOT = (isApexAlias || isLocalPreview)
    ? window.location.origin.replace(/\/$/, "") + "/"
    : PUBLIC_ROOT;
  var PRIMARY_ROOT = (isApexAlias || isLocalPreview)
    ? ORIGIN_ROOT + "assets/"
    : CANONICAL_ROOT;

  if (typeof document === "undefined") return;

  function isLearnSurface() {
    if ([
      "microsoft.skunkworksacademy.com",
      "ibm.skunkworksacademy.com",
      "security.skunkworksacademy.com"
    ].indexOf(host) !== -1) return true;

    if (!(isApexAlias || isLocalPreview)) return false;
    return /^\/(learn|courses|learning-paths|self-paced|instructor-led|comptia|cisco)(?:\/|$)/.test(pathname);
  }

  function isLearnLandingSurface() {
    if ([
      "microsoft.skunkworksacademy.com",
      "ibm.skunkworksacademy.com",
      "security.skunkworksacademy.com"
    ].indexOf(host) !== -1) return pathname === "/" || pathname === "";

    if (!(isApexAlias || isLocalPreview)) return false;
    return /^\/(learn|courses|learning-paths|self-paced|instructor-led|comptia|cisco)\/?$/.test(pathname);
  }

  function installCanonicalFavicons() {
    var head = document.head || document.documentElement;
    if (!head || document.querySelector('link[data-skunkworks-favicon="canonical"]')) return;

    Array.prototype.slice.call(document.querySelectorAll('link[rel~="icon"], link[rel="shortcut icon"]'))
      .forEach(function (node) {
        if (node.parentNode) node.parentNode.removeChild(node);
      });

    [
      { rel: "icon", href: ORIGIN_ROOT + "images/favicon-black.png?v=" + PAGE_CONTRACT_VERSION, media: "", sizes: "32x32" },
      { rel: "shortcut icon", href: ORIGIN_ROOT + "images/favicon-black.png?v=" + PAGE_CONTRACT_VERSION, media: "", sizes: "" },
      { rel: "icon", href: ORIGIN_ROOT + "images/favicon-black.png?v=" + PAGE_CONTRACT_VERSION, media: "(prefers-color-scheme: light)", sizes: "32x32" },
      { rel: "icon", href: ORIGIN_ROOT + "images/favicon-white.png?v=" + PAGE_CONTRACT_VERSION, media: "(prefers-color-scheme: dark)", sizes: "32x32" }
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

    var cssHref = ORIGIN_ROOT + "assets/academy-page-contract.css?v=" + PAGE_CONTRACT_VERSION;
    var css = document.querySelector('link[data-skunkworks-page-contract="css"]');
    if (!css) {
      css = document.createElement("link");
      css.rel = "stylesheet";
      css.setAttribute("data-skunkworks-page-contract", "css");
      head.appendChild(css);
    }
    if (css.getAttribute("href") !== cssHref) css.setAttribute("href", cssHref);

    var runtimeSrc = ORIGIN_ROOT + "assets/academy-page-contract.js?v=" + PAGE_CONTRACT_VERSION;
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

    var href = ORIGIN_ROOT + "assets/academy-brand-theme.css?v=" + BRAND_THEME_VERSION;
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

  function installThemeConformance(moveToEnd) {
    var head = document.head || document.documentElement;
    if (!head) return null;

    var href = ORIGIN_ROOT + "assets/academy-theme-conformance.css?v=" + THEME_CONFORMANCE_VERSION;
    var link = document.querySelector('link[data-skunkworks-theme-conformance="canonical"]');
    if (!link) {
      link = document.createElement("link");
      link.rel = "stylesheet";
      link.setAttribute("data-skunkworks-theme-conformance", "canonical");
      head.appendChild(link);
    }
    if (link.getAttribute("href") !== href) link.setAttribute("href", href);
    if (moveToEnd && link.parentNode === head) head.appendChild(link);
    return link;
  }

  function installLearnTheme(moveToEnd) {
    if (!isLearnSurface()) return null;
    var head = document.head || document.documentElement;
    if (!head) return null;

    var href = ORIGIN_ROOT + "assets/academy-learn.css?v=" + LEARN_THEME_VERSION;
    var link = document.querySelector('link[data-skunkworks-learn-theme="canonical"]');
    if (!link) {
      link = document.createElement("link");
      link.rel = "stylesheet";
      link.setAttribute("data-skunkworks-learn-theme", "canonical");
      head.appendChild(link);
    }
    if (link.getAttribute("href") !== href) link.setAttribute("href", href);
    if (moveToEnd && link.parentNode === head) head.appendChild(link);
    return link;
  }

  function learnLinks() {
    return [
      ["Learn overview", "https://www.skunkworksacademy.com/learn/", "learn"],
      ["All courses", "https://www.skunkworksacademy.com/courses", "courses"],
      ["Learning paths", "https://www.skunkworksacademy.com/learning-paths/", "learning-paths"],
      ["Self-paced", "https://www.skunkworksacademy.com/self-paced/", "self-paced"],
      ["Instructor-led", "https://www.skunkworksacademy.com/instructor-led/", "instructor-led"],
      ["Microsoft", "https://microsoft.skunkworksacademy.com/", "microsoft"],
      ["IBM", "https://ibm.skunkworksacademy.com/", "ibm"],
      ["CompTIA", "https://www.skunkworksacademy.com/comptia/", "comptia"],
      ["Cisco", "https://www.skunkworksacademy.com/cisco/", "cisco"],
      ["Security", "https://security.skunkworksacademy.com/", "security"]
    ];
  }

  function currentLearnKey() {
    if (host === "microsoft.skunkworksacademy.com") return "microsoft";
    if (host === "ibm.skunkworksacademy.com") return "ibm";
    if (host === "security.skunkworksacademy.com") return "security";
    var match = pathname.match(/^\/(learn|courses|learning-paths|self-paced|instructor-led|comptia|cisco)(?:\/|$)/);
    return match ? match[1] : "";
  }

  function markLearnSurface() {
    if (!isLearnSurface() || !document.body) return;
    document.body.setAttribute("data-swa-section", "learn");

    var main = document.querySelector("main, [role=main], .main-wrapper");
    if (!main) return;

    var hero = main.querySelector("[data-sk-component=hero], .sk-hero, .hero, .heroBanner, .swa-hub__hero");
    if (hero) {
      hero.setAttribute("data-swa-learn-hero", "true");
      if (isLearnLandingSurface()) {
        var heading = hero.querySelector("h1");
        if (heading) heading.classList.add("swa-learn-heading--float");
      }
    }

    if (!isLearnLandingSurface() || main.querySelector(".swa-learn-subnav")) return;

    var nav = document.createElement("nav");
    nav.className = "swa-learn-subnav";
    nav.setAttribute("aria-label", "Learn section navigation");
    var current = currentLearnKey();
    learnLinks().forEach(function (item) {
      var anchor = document.createElement("a");
      anchor.href = item[1];
      anchor.textContent = item[0];
      if (item[2] === current) anchor.setAttribute("aria-current", "page");
      nav.appendChild(anchor);
    });

    if (hero && hero.parentNode === main) {
      hero.insertAdjacentElement("afterend", nav);
    } else {
      main.insertBefore(nav, main.firstChild);
    }
  }

  applyDeclaredTheme();
  installCanonicalFavicons();
  installPageContract();
  installBrandTheme(false);
  installThemeConformance(false);
  installLearnTheme(false);

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      applyDeclaredTheme();
      installCanonicalFavicons();
      installPageContract();
      installBrandTheme(true);
      installThemeConformance(true);
      installLearnTheme(true);
      markLearnSurface();
    }, { once: true });
  } else {
    markLearnSurface();
  }

  if (document.querySelector('script[data-skunkworks-global-nav-runtime="v11"]')) {
    installBrandTheme(true);
    installThemeConformance(true);
    installLearnTheme(true);
    markLearnSurface();
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
    /* academy-navigation-v11 injects the shared design system. Move the brand,
       conformance and Learn layers after it so canonical overrides win. */
    installBrandTheme(true);
    installThemeConformance(true);
    installLearnTheme(true);
    markLearnSurface();
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
    pageContractRuntime: ORIGIN_ROOT + "assets/academy-page-contract.js?v=" + PAGE_CONTRACT_VERSION,
    brandThemeVersion: BRAND_THEME_VERSION,
    brandTheme: ORIGIN_ROOT + "assets/academy-brand-theme.css?v=" + BRAND_THEME_VERSION,
    themeConformanceVersion: THEME_CONFORMANCE_VERSION,
    themeConformance: ORIGIN_ROOT + "assets/academy-theme-conformance.css?v=" + THEME_CONFORMANCE_VERSION,
    learnThemeVersion: LEARN_THEME_VERSION,
    learnTheme: ORIGIN_ROOT + "assets/academy-learn.css?v=" + LEARN_THEME_VERSION,
    learnSurface: isLearnSurface(),
    bodyBackground: "theme-owned",
    faviconLight: ORIGIN_ROOT + "images/favicon-black.png?v=" + PAGE_CONTRACT_VERSION,
    faviconDark: ORIGIN_ROOT + "images/favicon-white.png?v=" + PAGE_CONTRACT_VERSION
  };

  (document.head || document.documentElement).appendChild(script);
})();
