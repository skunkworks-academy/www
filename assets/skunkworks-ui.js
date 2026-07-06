/*
  Skunkworks Academy Global UI
  Canonical source: /assets/skunkworks-ui.js
  Provides global navigation, legacy header cleanup, theme persistence, year injection, and form validation.
*/
(function () {
  "use strict";

  if (window.SkunkworksAcademy && window.SkunkworksAcademy.uiLoaded) return;

  var version = "2026.07.06";
  var root = document.documentElement;
  var assetBase = "https://skunkworksacademy.com/assets";
  var logoLight = "https://raw.githubusercontent.com/skunkworks-academy/.github/refs/heads/main/images/favicon-black.png";
  var logoDark = "https://raw.githubusercontent.com/skunkworks-academy/.github/refs/heads/main/images/favicon-white.png";

  window.SkunkworksAcademy = Object.assign(window.SkunkworksAcademy || {}, {
    uiLoaded: true,
    version: version
  });

  var pages = [
    { label: "Home", domain: "skunkworksacademy.com", url: "https://skunkworksacademy.com/" },
    { label: "AI Learning", domain: "skunkworksacademy.com", url: "https://skunkworksacademy.com/#new-way-to-learn" },
    { label: "Self-paced", domain: "skunkworksacademy.com", url: "https://skunkworksacademy.com/self-paced/" },
    { label: "Portal", domain: "portal.skunkworksacademy.com", url: "https://portal.skunkworksacademy.com/" },
    { label: "Labs", domain: "labs.skunkworksacademy.com", url: "https://labs.skunkworksacademy.com/" },
    { label: "Badging", domain: "badging.skunkworksacademy.com", url: "https://badging.skunkworksacademy.com/" },
    { label: "Jobs", domain: "jobs.skunkworksacademy.com", url: "https://jobs.skunkworksacademy.com/" },
    { label: "Media", domain: "media.skunkworksacademy.com", url: "https://media.skunkworksacademy.com/" },
    { label: "Security", domain: "security.skunkworksacademy.com", url: "https://security.skunkworksacademy.com/" },
    { label: "IBM", domain: "ibm.skunkworksacademy.com", url: "https://ibm.skunkworksacademy.com/" },
    { label: "Plans", domain: "skunkworksacademy.com", url: "https://skunkworksacademy.com/pricing.index.html#pricing" },
    { label: "Purchase", domain: "skunkworksacademy.com", url: "https://skunkworksacademy.com/pricing.index.html#purchasing" }
  ];

  var config = {
    brand: "Skunkworks Academy",
    homeUrl: "https://skunkworksacademy.com/"
  };

  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn, { once: true });
    } else {
      fn();
    }
  }

  function ensureDesignSystem() {
    if (document.querySelector('link[data-skunkworks-design-system="canonical"]')) return;
    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = assetBase + "/skunkworks-design-system.css?v=" + version;
    link.setAttribute("data-skunkworks-design-system", "canonical");
    document.head.appendChild(link);
  }

  function ensureNavigationOverrides() {
    if (document.getElementById("swa-global-nav-menu-only-overrides")) return;
    var style = document.createElement("style");
    style.id = "swa-global-nav-menu-only-overrides";
    style.textContent = [
      "body.swa-has-global-nav{padding-top:82px;}",
      ".swa-global-nav{--swa-nav-bg:rgba(5,5,5,.92);--swa-nav-text:#fff;--swa-nav-line:rgba(255,255,255,.16);--swa-nav-panel:#101010;position:fixed!important;top:0!important;left:0!important;right:0!important;z-index:9999!important;background:var(--swa-nav-bg)!important;color:var(--swa-nav-text)!important;border-bottom:1px solid var(--swa-nav-line)!important;backdrop-filter:blur(18px)!important;-webkit-backdrop-filter:blur(18px)!important;}",
      "@media(prefers-color-scheme:light){.swa-global-nav{--swa-nav-bg:rgba(255,255,255,.92);--swa-nav-text:#050505;--swa-nav-line:rgba(5,5,5,.16);--swa-nav-panel:#fff;}}",
      ".swa-global-nav__inner{width:min(1180px,calc(100% - 32px))!important;min-height:72px!important;margin-inline:auto!important;display:flex!important;align-items:center!important;justify-content:space-between!important;gap:1rem!important;}",
      ".swa-global-nav__brand{display:inline-flex!important;order:0!important;align-items:center!important;gap:.65rem!important;color:var(--swa-nav-text)!important;text-decoration:none!important;font-weight:900!important;letter-spacing:-.03em!important;white-space:nowrap!important;min-width:0!important;}",
      ".swa-global-nav__brand img{display:block!important;width:34px!important;height:34px!important;border-radius:.65rem!important;object-fit:contain!important;}",
      ".swa-global-nav__brand span{display:inline-block!important;position:static!important;width:auto!important;height:auto!important;margin:0!important;padding:0!important;overflow:hidden!important;clip:auto!important;white-space:nowrap!important;border:0!important;text-overflow:ellipsis!important;color:var(--swa-nav-text)!important;}",
      ".swa-logo-dark{display:block!important;}.swa-logo-light{display:none!important;}@media(prefers-color-scheme:light){.swa-logo-light{display:block!important;}.swa-logo-dark{display:none!important;}}",
      ".swa-global-nav__toggle{display:inline-flex!important;order:1!important;align-items:center!important;justify-content:center!important;border:1px solid var(--swa-nav-line)!important;background:color-mix(in srgb,var(--swa-nav-panel) 72%,transparent)!important;color:var(--swa-nav-text)!important;border-radius:999px!important;min-width:46px!important;min-height:46px!important;padding:.65rem .75rem!important;cursor:pointer!important;}",
      ".swa-global-nav__toggle:hover,.swa-global-nav__toggle:focus{background:color-mix(in srgb,var(--swa-nav-panel) 90%,transparent)!important;}",
      ".swa-global-nav__toggle-lines{display:grid!important;gap:5px!important;}",
      ".swa-global-nav__toggle-lines span{display:block!important;width:22px!important;height:2px!important;border-radius:999px!important;background:currentColor!important;}",
      ".swa-global-nav__links{position:absolute!important;top:calc(100% + 10px)!important;right:calc((100vw - min(1180px,calc(100vw - 32px)))/2)!important;left:auto!important;transform:none!important;width:min(410px,calc(100vw - 32px))!important;max-height:calc(100vh - 96px)!important;overflow:auto!important;display:none!important;grid-template-columns:1fr!important;gap:.5rem!important;border:1px solid var(--swa-nav-line)!important;border-radius:1.25rem!important;background:var(--swa-nav-panel)!important;box-shadow:0 30px 90px rgba(0,0,0,.46)!important;padding:.9rem!important;}",
      ".swa-global-nav.swa-open .swa-global-nav__links{display:grid!important;}",
      ".swa-global-nav__link{justify-content:flex-start!important;min-height:44px!important;border:1px solid var(--swa-nav-line)!important;border-radius:.9rem!important;color:var(--swa-nav-text)!important;background:color-mix(in srgb,var(--swa-nav-panel) 82%,transparent)!important;padding:.75rem .9rem!important;font-size:.92rem!important;text-decoration:none!important;font-weight:800!important;}",
      ".swa-global-nav__link:hover,.swa-global-nav__link:focus,.swa-global-nav__link[aria-current='page']{background:rgba(15,98,254,.22)!important;border-color:rgba(127,127,127,.42)!important;color:var(--swa-nav-text)!important;}",
      "@media(max-width:720px){body.swa-has-global-nav{padding-top:74px;}.swa-global-nav__inner{width:min(100% - 20px,1180px)!important;min-height:66px!important;}.swa-global-nav__links{right:10px!important;width:calc(100% - 20px)!important;}}"
    ].join("\n");
    document.head.appendChild(style);
  }

  function normalizeUrl(url) {
    try {
      var parsed = new URL(url, window.location.origin);
      parsed.hash = "";
      return parsed.href.replace(/\/$/, "");
    } catch (error) {
      return url;
    }
  }

  function isCurrent(page) {
    var current = normalizeUrl(window.location.href);
    var target = normalizeUrl(page.url);
    return current === target || current.indexOf(target + "/") === 0;
  }

  function isInsideContent(node) {
    return !!(node.closest && node.closest("main,article,section,aside,.document,.sk-document"));
  }

  function removeLegacyHeaders() {
    var selectors = [
      "header.top",
      ".site-header",
      ".main-header",
      ".sk-topbar",
      "[data-sk-nav-shell]",
      "header[data-skunkworks-global-header]",
      "header.swa-fallback-top",
      "header.fallback-top"
    ];

    selectors.forEach(function (selector) {
      Array.prototype.slice.call(document.querySelectorAll(selector)).forEach(function (node) {
        if (node.classList.contains("swa-global-nav")) return;
        if (node.hasAttribute("data-sk-preserve-header")) return;
        if (isInsideContent(node) && !node.matches("header[data-skunkworks-global-header],[data-sk-nav-shell]")) return;
        if (node.parentNode) node.parentNode.removeChild(node);
      });
    });
  }

  function makeLink(page) {
    var link = document.createElement("a");
    link.className = "swa-global-nav__link";
    link.href = page.url;
    link.textContent = page.label;
    link.setAttribute("data-swa-domain", page.domain);
    link.setAttribute("data-swa-verified", "true");
    if (isCurrent(page)) link.setAttribute("aria-current", "page");
    return link;
  }

  function buildGlobalNav() {
    if (document.body && document.body.getAttribute("data-sk-global-nav") === "off") return;
    if (document.querySelector(".swa-global-nav")) return;

    removeLegacyHeaders();

    var nav = document.createElement("header");
    nav.className = "swa-global-nav";
    nav.setAttribute("data-skunkworks-global-header", "canonical-v3-logo-text-burger");

    var inner = document.createElement("div");
    inner.className = "swa-global-nav__inner";

    var brand = document.createElement("a");
    brand.className = "swa-global-nav__brand";
    brand.href = config.homeUrl;
    brand.setAttribute("aria-label", "Skunkworks Academy home");

    var lightLogo = document.createElement("img");
    lightLogo.className = "swa-logo-light";
    lightLogo.alt = "";
    lightLogo.loading = "lazy";
    lightLogo.src = logoLight;

    var darkLogo = document.createElement("img");
    darkLogo.className = "swa-logo-dark";
    darkLogo.alt = "";
    darkLogo.loading = "lazy";
    darkLogo.src = logoDark;

    var brandText = document.createElement("span");
    brandText.textContent = config.brand;

    brand.appendChild(lightLogo);
    brand.appendChild(darkLogo);
    brand.appendChild(brandText);

    var button = document.createElement("button");
    button.className = "swa-global-nav__toggle";
    button.type = "button";
    button.setAttribute("aria-label", "Toggle site navigation");
    button.setAttribute("aria-expanded", "false");
    button.setAttribute("aria-controls", "swa-global-nav-links");

    var lines = document.createElement("span");
    lines.className = "swa-global-nav__toggle-lines";
    lines.setAttribute("aria-hidden", "true");
    lines.innerHTML = "<span></span><span></span><span></span>";

    button.appendChild(lines);

    var links = document.createElement("nav");
    links.className = "swa-global-nav__links";
    links.id = "swa-global-nav-links";
    links.setAttribute("aria-label", "Skunkworks Academy navigation");

    pages.forEach(function (page) {
      links.appendChild(makeLink(page));
    });

    inner.appendChild(brand);
    inner.appendChild(button);
    inner.appendChild(links);
    nav.appendChild(inner);

    document.body.insertBefore(nav, document.body.firstChild);
    document.body.classList.add("swa-has-global-nav");

    function closeMenu() {
      nav.classList.remove("swa-open");
      button.setAttribute("aria-expanded", "false");
    }

    function toggleMenu() {
      var open = nav.classList.toggle("swa-open");
      button.setAttribute("aria-expanded", open ? "true" : "false");
    }

    button.addEventListener("click", function (event) {
      event.stopPropagation();
      toggleMenu();
    });

    links.addEventListener("click", function (event) {
      if (event.target && event.target.matches("a")) closeMenu();
    });

    document.addEventListener("click", function (event) {
      if (!nav.contains(event.target)) closeMenu();
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeMenu();
    });
  }

  function bindLegacyNavToggle() {
    var nav = document.querySelector("[data-sk-nav]");
    var navToggle = document.querySelector("[data-sk-nav-toggle]");
    if (!nav || !navToggle) return;

    navToggle.addEventListener("click", function () {
      var isOpen = nav.getAttribute("data-open") === "true";
      nav.setAttribute("data-open", String(!isOpen));
      navToggle.setAttribute("aria-expanded", String(!isOpen));
    });
  }

  function bindThemeToggle() {
    var storedTheme = window.localStorage.getItem("skunkworks-theme");
    if (storedTheme) root.setAttribute("data-theme", storedTheme);

    Array.prototype.slice.call(document.querySelectorAll("[data-sk-theme-toggle]")).forEach(function (themeToggle) {
      themeToggle.addEventListener("click", function () {
        var current = root.getAttribute("data-theme") || "light";
        var next = current === "dark" ? "light" : "dark";
        root.setAttribute("data-theme", next);
        window.localStorage.setItem("skunkworks-theme", next);
        themeToggle.setAttribute("aria-label", "Switch to " + current + " mode");
      });
    });
  }

  function bindYear() {
    Array.prototype.slice.call(document.querySelectorAll("[data-sk-year]")).forEach(function (node) {
      node.textContent = new Date().getFullYear();
    });
  }

  function bindValidation() {
    Array.prototype.slice.call(document.querySelectorAll("form[data-sk-validate]")).forEach(function (form) {
      form.addEventListener("submit", function (event) {
        if (!form.checkValidity()) {
          event.preventDefault();
          form.classList.add("sk-form--invalid");
          var firstInvalid = form.querySelector(":invalid");
          if (firstInvalid) firstInvalid.focus();
        }
      });
    });
  }

  ready(function () {
    ensureDesignSystem();
    ensureNavigationOverrides();
    buildGlobalNav();
    bindLegacyNavToggle();
    bindThemeToggle();
    bindYear();
    bindValidation();
  });
})();
