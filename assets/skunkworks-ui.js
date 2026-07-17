/* Skunkworks Academy Global UI — canonical navigation runtime */
(function () {
  "use strict";

  if (window.SkunkworksAcademy && window.SkunkworksAcademy.uiLoaded) return;

  var VERSION = "2026.07.17.2";
  var ASSET_ROOT = "https://skunkworksacademy.com";
  var LOGO_LIGHT = ASSET_ROOT + "/images/favicon-black.png?v=" + VERSION;
  var LOGO_DARK = ASSET_ROOT + "/images/favicon-white.png?v=" + VERSION;

  var destinations = [
    { label: "Home", url: "https://skunkworksacademy.com/", domains: ["skunkworksacademy.com", "www.skunkworksacademy.com"] },
    { label: "Plans & Purchases", url: "https://skunkworksacademy.com/plans-and-purchases/" },
    { label: "Secure Checkout", url: "https://portal.skunkworksacademy.com/checkout/" },
    { label: "Forms", url: "https://skunkworksacademy.com/forms/" },
    { label: "Self-Paced Catalogue", url: "https://skunkworksacademy.com/catalogue/" },
    { label: "Learner Portal", url: "https://portal.skunkworksacademy.com/", domains: ["portal.skunkworksacademy.com"] },
    { label: "Labs", url: "https://labs.skunkworksacademy.com/", domains: ["labs.skunkworksacademy.com", "lab.skunkworksacademy.com"] },
    { label: "Security", url: "https://security.skunkworksacademy.com/", domains: ["security.skunkworksacademy.com"] },
    { label: "IBM", url: "https://ibm.skunkworksacademy.com/", domains: ["ibm.skunkworksacademy.com"] },
    { label: "Badging", url: "https://badging.skunkworksacademy.com/", domains: ["badging.skunkworksacademy.com", "badge-hub.skunkworksacademy.com"] },
    { label: "Jobs", url: "https://jobs.skunkworksacademy.com/", domains: ["jobs.skunkworksacademy.com"] },
    { label: "Connections", url: "https://portal.skunkworksacademy.com/connections/" },
    { label: "Reports", url: "https://portal.skunkworksacademy.com/reports/" },
    { label: "Docs", url: "https://docs.skunkworksacademy.com/", domains: ["docs.skunkworksacademy.com"] },
    { label: "Publish", url: "https://publish.skunkworksacademy.com/", domains: ["publish.skunkworksacademy.com"] },
    { label: "Blog", url: "https://blog.skunkworksacademy.com/", domains: ["blog.skunkworksacademy.com"] }
  ];

  window.SkunkworksAcademy = Object.assign(window.SkunkworksAcademy || {}, {
    uiLoaded: true,
    version: VERSION,
    navigation: { pages: destinations }
  });
  window.SKUNKWORKS_ACADEMY_NAVIGATION = {
    version: VERSION,
    title: "Skunkworks Academy navigation",
    pages: destinations
  };

  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback, { once: true });
    } else {
      callback();
    }
  }

  function addStyles() {
    if (document.getElementById("swa-global-nav-canonical-styles")) return;
    var style = document.createElement("style");
    style.id = "swa-global-nav-canonical-styles";
    style.textContent = [
      "body.swa-has-global-nav{padding-top:82px}",
      ".swa-global-nav{--swa-bg:rgba(11,15,20,.94);--swa-panel:#111a24;--swa-text:#e6edf3;--swa-line:#243041;position:fixed!important;inset:0 0 auto 0!important;z-index:9999!important;background:var(--swa-bg)!important;color:var(--swa-text)!important;border-bottom:1px solid var(--swa-line)!important;backdrop-filter:blur(18px)!important;-webkit-backdrop-filter:blur(18px)!important}",
      "@media(prefers-color-scheme:light){.swa-global-nav{--swa-bg:rgba(248,250,252,.94);--swa-panel:#fff;--swa-text:#0f172a;--swa-line:#d8e1ed}}",
      ".swa-global-nav__inner{width:min(1180px,calc(100% - 32px))!important;min-height:72px!important;margin:auto!important;display:flex!important;align-items:center!important;justify-content:space-between!important;gap:16px!important}",
      ".swa-global-nav__brand{display:inline-flex!important;align-items:center!important;gap:12px!important;min-width:0!important;color:var(--swa-text)!important;text-decoration:none!important;font-weight:800!important;letter-spacing:-.03em!important}",
      ".swa-global-nav__brand-logo{display:block!important;width:40px!important;height:40px!important;box-sizing:border-box!important;object-fit:contain!important;border-radius:10px!important;background:transparent!important;border:1px solid var(--swa-line)!important;padding:6px!important;flex:0 0 auto!important}",
      ".swa-logo-dark{display:block!important}.swa-logo-light{display:none!important}@media(prefers-color-scheme:light){.swa-logo-light{display:block!important}.swa-logo-dark{display:none!important}}",
      ".swa-global-nav__brand-text{display:block!important;overflow:hidden!important;text-overflow:ellipsis!important;white-space:nowrap!important;color:var(--swa-text)!important}",
      ".swa-global-nav__toggle{display:inline-flex!important;align-items:center!important;justify-content:center!important;min-width:44px!important;min-height:44px!important;padding:0!important;border:1px solid var(--swa-line)!important;border-radius:999px!important;background:var(--swa-panel)!important;color:var(--swa-text)!important;cursor:pointer!important}",
      ".swa-global-nav__toggle-lines{display:grid!important;gap:5px!important}.swa-global-nav__toggle-lines span{display:block!important;width:22px!important;height:2px!important;border-radius:999px!important;background:currentColor!important}",
      ".swa-global-nav__links{position:absolute!important;top:calc(100% + 10px)!important;right:calc((100vw - min(1180px,calc(100vw - 32px)))/2)!important;width:min(410px,calc(100vw - 32px))!important;max-height:calc(100vh - 96px)!important;overflow:auto!important;display:none!important;grid-template-columns:1fr!important;gap:8px!important;padding:14px!important;border:1px solid var(--swa-line)!important;border-radius:20px!important;background:var(--swa-panel)!important;box-shadow:0 30px 90px rgba(0,0,0,.4)!important}",
      ".swa-global-nav.swa-open .swa-global-nav__links{display:grid!important}",
      ".swa-global-nav__link{display:flex!important;align-items:center!important;min-height:44px!important;padding:11px 14px!important;border:1px solid var(--swa-line)!important;border-radius:14px!important;color:var(--swa-text)!important;background:transparent!important;text-decoration:none!important;font-size:.92rem!important;font-weight:800!important}",
      ".swa-global-nav__link:hover,.swa-global-nav__link:focus,.swa-global-nav__link[aria-current='page']{background:color-mix(in srgb,#0891b2 14%,transparent)!important;border-color:color-mix(in srgb,#0891b2 45%,var(--swa-line))!important}",
      "@media(max-width:720px){body.swa-has-global-nav{padding-top:74px}.swa-global-nav__inner{width:calc(100% - 20px)!important;min-height:66px!important}.swa-global-nav__links{right:10px!important;width:calc(100% - 20px)!important}}"
    ].join("\n");
    document.head.appendChild(style);
  }

  function isInsideContent(node) {
    return Boolean(node.closest && node.closest("main,article,section,aside,.document,.sk-document"));
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
        if (node.classList.contains("swa-global-nav") || node.hasAttribute("data-sk-preserve-header")) return;
        if (isInsideContent(node) && !node.matches("header[data-skunkworks-global-header],[data-sk-nav-shell]")) return;
        if (node.parentNode) node.parentNode.removeChild(node);
      });
    });
  }

  function normalise(url) {
    try {
      var parsed = new URL(url, window.location.origin);
      parsed.hash = "";
      return parsed.href.replace(/\/$/, "");
    } catch (_error) {
      return String(url || "");
    }
  }

  function isCurrent(destination) {
    var currentUrl = normalise(window.location.href);
    var targetUrl = normalise(destination.url);
    if (currentUrl === targetUrl || currentUrl.indexOf(targetUrl + "/") === 0) return true;
    return Array.isArray(destination.domains) && destination.domains.indexOf(window.location.hostname) !== -1;
  }

  function createLogo(className, source) {
    var image = document.createElement("img");
    image.className = "swa-global-nav__brand-logo " + className;
    image.src = source;
    image.alt = "";
    image.width = 40;
    image.height = 40;
    image.decoding = "async";
    image.fetchPriority = "high";
    image.addEventListener("error", function () {
      image.style.display = "none";
    }, { once: true });
    return image;
  }

  function buildNavigation() {
    if (!document.body || document.body.getAttribute("data-sk-global-nav") === "off") return;
    if (document.querySelector(".swa-global-nav")) return;

    removeLegacyHeaders();

    var header = document.createElement("header");
    var inner = document.createElement("div");
    var brand = document.createElement("a");
    var brandText = document.createElement("span");
    var toggle = document.createElement("button");
    var toggleLines = document.createElement("span");
    var links = document.createElement("nav");

    header.className = "swa-global-nav";
    header.setAttribute("data-skunkworks-global-header", "canonical-v7-theme-logo");
    inner.className = "swa-global-nav__inner";

    brand.className = "swa-global-nav__brand";
    brand.href = "https://skunkworksacademy.com/";
    brand.setAttribute("aria-label", "Skunkworks Academy home");
    brand.appendChild(createLogo("swa-logo-light", LOGO_LIGHT));
    brand.appendChild(createLogo("swa-logo-dark", LOGO_DARK));
    brandText.className = "swa-global-nav__brand-text";
    brandText.textContent = "Skunkworks Academy";
    brand.appendChild(brandText);

    toggle.className = "swa-global-nav__toggle";
    toggle.type = "button";
    toggle.setAttribute("aria-label", "Toggle site navigation");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-controls", "swa-global-nav-links");
    toggleLines.className = "swa-global-nav__toggle-lines";
    toggleLines.setAttribute("aria-hidden", "true");
    toggleLines.innerHTML = "<span></span><span></span><span></span>";
    toggle.appendChild(toggleLines);

    links.className = "swa-global-nav__links";
    links.id = "swa-global-nav-links";
    links.setAttribute("aria-label", "Academy destinations");

    destinations.forEach(function (destination) {
      var link = document.createElement("a");
      link.className = "swa-global-nav__link";
      link.href = destination.url;
      link.textContent = destination.label;
      if (isCurrent(destination)) link.setAttribute("aria-current", "page");
      links.appendChild(link);
    });

    inner.appendChild(brand);
    inner.appendChild(toggle);
    inner.appendChild(links);
    header.appendChild(inner);
    document.body.insertBefore(header, document.body.firstChild);
    document.body.classList.add("swa-has-global-nav");

    function closeMenu() {
      header.classList.remove("swa-open");
      toggle.setAttribute("aria-expanded", "false");
    }

    toggle.addEventListener("click", function (event) {
      event.stopPropagation();
      var open = header.classList.toggle("swa-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    links.addEventListener("click", function (event) {
      if (event.target && event.target.matches("a")) closeMenu();
    });
    document.addEventListener("click", function (event) {
      if (!header.contains(event.target)) closeMenu();
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeMenu();
    });
  }

  ready(function () {
    addStyles();
    buildNavigation();
  });
})();