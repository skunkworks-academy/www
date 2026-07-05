/*
  Skunkworks Academy global navigation shell.
  Canonical org-wide navigation asset.
  Version: 2026.07.05
*/
(function () {
  "use strict";

  var pages = [
    { label: "Home", domain: "skunkworksacademy.com", url: "https://skunkworksacademy.com/", verified: true },
    { label: "AI Learning", domain: "skunkworksacademy.com", url: "https://skunkworksacademy.com/#new-way-to-learn", verified: true },
    { label: "Self-paced", domain: "skunkworksacademy.com", url: "https://skunkworksacademy.com/self-paced/", verified: true },
    { label: "Portal", domain: "portal.skunkworksacademy.com", url: "https://portal.skunkworksacademy.com/", verified: true },
    { label: "Labs", domain: "labs.skunkworksacademy.com", url: "https://labs.skunkworksacademy.com/", verified: true },
    { label: "Badge Hub", domain: "badging.skunkworksacademy.com", url: "https://badging.skunkworksacademy.com/", verified: true },
    { label: "Jobs", domain: "jobs.skunkworksacademy.com", url: "https://jobs.skunkworksacademy.com/", verified: true },
    { label: "Media", domain: "media.skunkworksacademy.com", url: "https://media.skunkworksacademy.com/", verified: true },
    { label: "Security", domain: "security.skunkworksacademy.com", url: "https://security.skunkworksacademy.com/", verified: true },
    { label: "IBM", domain: "ibm.skunkworksacademy.com", url: "https://ibm.skunkworksacademy.com/", verified: true },
    { label: "Plans", domain: "skunkworksacademy.com", url: "https://skunkworksacademy.com/pricing.index.html#pricing", verified: true },
    { label: "Purchase", domain: "skunkworksacademy.com", url: "https://skunkworksacademy.com/pricing.index.html#purchasing", verified: true }
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

  function injectStyles() {
    if (document.getElementById("swa-global-navigation-styles")) return;

    var css = ""
      + ":root{--swa-nav-bg:rgba(255,255,255,.94);--swa-nav-text:#0f172a;--swa-nav-muted:#64748b;--swa-nav-border:rgba(15,23,42,.12);--swa-nav-panel:#fff;--swa-nav-shadow:0 22px 70px rgba(15,23,42,.18);}" 
      + "@media(prefers-color-scheme:dark){:root{--swa-nav-bg:rgba(5,5,5,.90);--swa-nav-text:#f8fafc;--swa-nav-muted:#94a3b8;--swa-nav-border:rgba(255,255,255,.16);--swa-nav-panel:#0f172a;--swa-nav-shadow:0 22px 70px rgba(0,0,0,.5);}}"
      + "body.swa-has-global-nav{padding-top:82px;}"
      + ".swa-global-nav{position:fixed;top:0;left:0;right:0;z-index:2147483000;border-bottom:1px solid var(--swa-nav-border);background:var(--swa-nav-bg);backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);color:var(--swa-nav-text);font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;}"
      + ".swa-global-nav__inner{width:min(1180px,calc(100% - 32px));min-height:72px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;gap:18px;}"
      + ".swa-global-nav__brand{display:inline-flex;align-items:center;gap:10px;color:var(--swa-nav-text);text-decoration:none;font-weight:900;letter-spacing:-.035em;white-space:nowrap;}"
      + ".swa-global-nav__brand img{width:34px;height:34px;border-radius:10px;object-fit:contain;}"
      + ".swa-global-nav__brand .swa-logo-dark{display:none;}@media(prefers-color-scheme:dark){.swa-global-nav__brand .swa-logo-light{display:none}.swa-global-nav__brand .swa-logo-dark{display:inline-block}}"
      + ".swa-global-nav__links{display:flex;align-items:center;justify-content:flex-end;gap:6px;flex-wrap:wrap;}"
      + ".swa-global-nav__link{display:inline-flex;align-items:center;justify-content:center;min-height:38px;border:1px solid transparent;border-radius:999px;padding:8px 10px;color:var(--swa-nav-muted);text-decoration:none;font-size:13px;font-weight:850;line-height:1;}"
      + ".swa-global-nav__link:hover,.swa-global-nav__link:focus,.swa-global-nav__link[aria-current='page']{border-color:var(--swa-nav-border);background:rgba(148,163,184,.12);color:var(--swa-nav-text);outline:none;}"
      + ".swa-global-nav__toggle{display:none;align-items:center;gap:10px;border:1px solid var(--swa-nav-border);border-radius:999px;background:transparent;color:var(--swa-nav-text);padding:10px 14px;font:inherit;font-weight:850;cursor:pointer;}"
      + ".swa-global-nav__toggle-lines{display:grid;gap:4px}.swa-global-nav__toggle-lines span{display:block;width:18px;height:2px;background:currentColor;border-radius:999px;}"
      + "@media(max-width:980px){body.swa-has-global-nav{padding-top:74px}.swa-global-nav__inner{width:min(100% - 20px,1180px);min-height:66px}.swa-global-nav__brand span{display:none}.swa-global-nav__toggle{display:inline-flex}.swa-global-nav__links{position:fixed;top:74px;left:50%;transform:translateX(-50%);width:calc(100% - 20px);max-height:calc(100vh - 92px);overflow:auto;display:none;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;border:1px solid var(--swa-nav-border);border-radius:20px;background:var(--swa-nav-panel);box-shadow:var(--swa-nav-shadow);padding:14px}.swa-global-nav.swa-open .swa-global-nav__links{display:grid}.swa-global-nav__link{justify-content:flex-start;min-height:44px;border-color:var(--swa-nav-border);padding:12px 14px;font-size:14px}}"
      + "@media(max-width:560px){.swa-global-nav__links{grid-template-columns:1fr}}";

    var style = document.createElement("style");
    style.id = "swa-global-navigation-styles";
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);
  }

  function isInsideContent(node) {
    return !!(node.closest && node.closest("main,article,section,aside"));
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
        if (isInsideContent(node) && !node.matches("header[data-skunkworks-global-header],[data-sk-nav-shell]")) return;
        node.parentNode && node.parentNode.removeChild(node);
      });
    });
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
    if (typeof window === "undefined") return false;
    var current = normalizeUrl(window.location.href);
    var target = normalizeUrl(page.url);
    return current === target || current.indexOf(target + "/") === 0;
  }

  function makeLink(page) {
    var link = document.createElement("a");
    link.className = "swa-global-nav__link";
    link.href = page.url;
    link.textContent = page.label;
    link.setAttribute("data-swa-domain", page.domain);

    if (page.verified) {
      link.setAttribute("data-swa-verified", "true");
    }

    if (isCurrent(page)) {
      link.setAttribute("aria-current", "page");
    }

    return link;
  }

  function buildNav() {
    if (document.querySelector(".swa-global-nav")) return;

    injectStyles();
    removeLegacyHeaders();

    var nav = document.createElement("header");
    nav.className = "swa-global-nav";
    nav.setAttribute("data-skunkworks-global-header", "v4");

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

  ready(buildNav);
})();
