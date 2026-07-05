/*
  Skunkworks Academy Global UI
  Canonical source: /assets/skunkworks-ui.js
  Provides global navigation, legacy header cleanup, theme persistence, year injection, and form validation.
*/
(function () {
  "use strict";

  if (window.SkunkworksAcademy && window.SkunkworksAcademy.uiLoaded) return;

  var version = "2026.07.05";
  var root = document.documentElement;

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
    { label: "Badge Hub", domain: "badging.skunkworksacademy.com", url: "https://badging.skunkworksacademy.com/" },
    { label: "Jobs", domain: "jobs.skunkworksacademy.com", url: "https://jobs.skunkworksacademy.com/" },
    { label: "Media", domain: "media.skunkworksacademy.com", url: "https://media.skunkworksacademy.com/" },
    { label: "Security", domain: "security.skunkworksacademy.com", url: "https://security.skunkworksacademy.com/" },
    { label: "IBM", domain: "ibm.skunkworksacademy.com", url: "https://ibm.skunkworksacademy.com/" },
    { label: "Plans", domain: "skunkworksacademy.com", url: "https://skunkworksacademy.com/pricing.index.html#pricing" },
    { label: "Purchase", domain: "skunkworksacademy.com", url: "https://skunkworksacademy.com/pricing.index.html#purchasing" }
  ];

  var config = {
    brand: "Skunkworks Academy",
    homeUrl: "https://skunkworksacademy.com/",
    logoLight: "https://raw.githubusercontent.com/skunkworks-academy/.github/refs/heads/main/images/favicon-black.png",
    logoDark: "https://raw.githubusercontent.com/skunkworks-academy/.github/refs/heads/main/images/favicon-white.png"
  };

  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn, { once: true });
    } else {
      fn();
    }
  }

  function ensureDesignSystem() {
    if (document.querySelector('link[href$="/assets/skunkworks-design-system.css"],link[href$="/faculty/assets/css/skunkworks-design-system.css"]')) return;
    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "/assets/skunkworks-design-system.css";
    link.setAttribute("data-skunkworks-design-system", "canonical");
    document.head.appendChild(link);
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
    nav.setAttribute("data-skunkworks-global-header", "canonical-v1");

    var inner = document.createElement("div");
    inner.className = "swa-global-nav__inner";

    var brand = document.createElement("a");
    brand.className = "swa-global-nav__brand";
    brand.href = config.homeUrl;
    brand.setAttribute("aria-label", "Skunkworks Academy home");

    var logoLight = document.createElement("img");
    logoLight.className = "swa-logo-light";
    logoLight.alt = "";
    logoLight.loading = "lazy";
    logoLight.src = config.logoLight;

    var logoDark = document.createElement("img");
    logoDark.className = "swa-logo-dark";
    logoDark.alt = "";
    logoDark.loading = "lazy";
    logoDark.src = config.logoDark;

    var brandText = document.createElement("span");
    brandText.textContent = config.brand;

    brand.appendChild(logoLight);
    brand.appendChild(logoDark);
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

    var buttonText = document.createElement("span");
    buttonText.textContent = "Menu";

    button.appendChild(lines);
    button.appendChild(buttonText);

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
    buildGlobalNav();
    bindLegacyNavToggle();
    bindThemeToggle();
    bindYear();
    bindValidation();
  });
})();
