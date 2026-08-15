/* Skunkworks Academy Global Footer — canonical public footer runtime */
(function () {
  "use strict";

  var VERSION = "2026.08.15.1";
  var ROOT_URL = "https://skunkworksacademy.com";
  var STORAGE_KEY = "swa-theme";

  if (window.SkunkworksAcademy && window.SkunkworksAcademy.footerLoaded) return;
  window.SkunkworksAcademy = Object.assign(window.SkunkworksAcademy || {}, {
    footerLoaded: true,
    footerVersion: VERSION
  });

  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback, { once: true });
    } else {
      callback();
    }
  }

  function addStyles() {
    if (document.getElementById("swa-global-footer-styles")) return;

    var style = document.createElement("style");
    style.id = "swa-global-footer-styles";
    style.textContent = [
      ".swa-global-footer,.swa-global-footer *{box-sizing:border-box!important}",
      ".swa-global-footer{--swa-footer-bg:#f3f1ec;--swa-footer-text:#151515;--swa-footer-muted:#5d5d5d;--swa-footer-hover:#dedbd3;--swa-footer-line:#d5d2ca;--swa-footer-focus:#0067b8;position:relative!important;z-index:20!important;width:100%!important;margin:0!important;padding:34px clamp(24px,3.4vw,64px) 28px!important;background:var(--swa-footer-bg)!important;color:var(--swa-footer-text)!important;border:0!important;border-top:1px solid var(--swa-footer-line)!important;font-family:Segoe UI,SegoeUI,system-ui,-apple-system,BlinkMacSystemFont,Arial,sans-serif!important;font-size:15px!important;line-height:1.4!important}",
      ".swa-global-footer a,.swa-global-footer button,.swa-global-footer summary{font:inherit!important}",
      ".swa-global-footer a{color:inherit!important;text-decoration:none!important}",
      ".swa-global-footer a:hover{text-decoration:underline!important;text-underline-offset:3px!important}",
      ".swa-global-footer a:focus-visible,.swa-global-footer button:focus-visible,.swa-global-footer summary:focus-visible{outline:2px solid var(--swa-footer-focus)!important;outline-offset:3px!important}",
      ".swa-global-footer__utility{display:flex!important;align-items:center!important;flex-wrap:wrap!important;gap:16px 34px!important;min-height:34px!important;margin:0 0 30px!important}",
      ".swa-global-footer__utility-item{display:inline-flex!important;align-items:center!important;gap:9px!important;min-height:32px!important;padding:2px 0!important;color:var(--swa-footer-text)!important;white-space:nowrap!important}",
      ".swa-global-footer__icon{display:inline-flex!important;align-items:center!important;justify-content:center!important;width:18px!important;height:18px!important;flex:0 0 18px!important;color:currentColor!important}",
      ".swa-global-footer__icon svg{display:block!important;width:18px!important;height:18px!important;fill:none!important;stroke:currentColor!important;stroke-width:1.8!important;stroke-linecap:round!important;stroke-linejoin:round!important}",
      ".swa-global-footer__privacy-mark{position:relative!important;width:24px!important;height:15px!important;flex:0 0 24px!important;border:2px solid #0067c0!important;border-radius:9px!important;background:#fff!important}",
      ".swa-global-footer__privacy-mark::before{content:\"✓\"!important;position:absolute!important;left:3px!important;top:-6px!important;color:#0067c0!important;font-size:13px!important;font-weight:700!important}",
      ".swa-global-footer__privacy-mark::after{content:\"×\"!important;position:absolute!important;right:2px!important;top:-6px!important;color:#0067c0!important;font-size:15px!important;font-weight:700!important}",
      ".swa-global-footer__theme{position:relative!important}",
      ".swa-global-footer__theme summary{display:inline-flex!important;align-items:center!important;gap:9px!important;min-height:32px!important;padding:2px 0!important;color:var(--swa-footer-text)!important;cursor:pointer!important;list-style:none!important;user-select:none!important}",
      ".swa-global-footer__theme summary::-webkit-details-marker{display:none!important}",
      ".swa-global-footer__chevron{width:8px!important;height:8px!important;margin-left:1px!important;border-right:1.5px solid currentColor!important;border-bottom:1.5px solid currentColor!important;transform:rotate(45deg) translateY(-2px)!important}",
      ".swa-global-footer__theme[open] .swa-global-footer__chevron{transform:rotate(225deg) translate(-1px,-1px)!important}",
      ".swa-global-footer__theme-menu{position:absolute!important;bottom:calc(100% + 8px)!important;left:-12px!important;display:grid!important;min-width:154px!important;padding:8px!important;background:#fff!important;color:#151515!important;border:1px solid #b9b7b1!important;box-shadow:0 8px 24px rgba(0,0,0,.16)!important}",
      ".swa-global-footer__theme-option{width:100%!important;padding:9px 11px!important;border:0!important;background:transparent!important;color:inherit!important;text-align:left!important;cursor:pointer!important}",
      ".swa-global-footer__theme-option:hover,.swa-global-footer__theme-option[aria-pressed=\"true\"]{background:#eceae5!important}",
      ".swa-global-footer__legal{display:flex!important;align-items:center!important;justify-content:flex-end!important;flex-wrap:wrap!important;gap:14px 30px!important;margin:0!important;padding:0!important;list-style:none!important}",
      ".swa-global-footer__legal a,.swa-global-footer__copyright{display:inline-flex!important;align-items:center!important;min-height:26px!important;color:var(--swa-footer-text)!important;font-size:14px!important;white-space:nowrap!important}",
      ".swa-global-footer__external{font-size:11px!important;margin-left:3px!important;transform:translateY(-2px)!important}",
      "html[data-swa-theme=\"dark\"] .swa-global-footer,html[data-theme=\"dark\"] .swa-global-footer{--swa-footer-bg:#202020;--swa-footer-text:#f5f5f5;--swa-footer-muted:#c8c8c8;--swa-footer-hover:#343434;--swa-footer-line:#3c3c3c;--swa-footer-focus:#75b6e7}",
      "html[data-swa-theme=\"dark\"] .swa-global-footer__theme-menu,html[data-theme=\"dark\"] .swa-global-footer__theme-menu{background:#2b2b2b!important;color:#f5f5f5!important;border-color:#555!important}",
      "html[data-swa-theme=\"dark\"] .swa-global-footer__theme-option:hover,html[data-swa-theme=\"dark\"] .swa-global-footer__theme-option[aria-pressed=\"true\"],html[data-theme=\"dark\"] .swa-global-footer__theme-option:hover,html[data-theme=\"dark\"] .swa-global-footer__theme-option[aria-pressed=\"true\"]{background:#3a3a3a!important}",
      "@media(max-width:900px){.swa-global-footer{padding:28px 24px 24px!important}.swa-global-footer__utility{margin-bottom:24px!important}.swa-global-footer__legal{justify-content:flex-start!important;gap:12px 24px!important}}",
      "@media(max-width:560px){.swa-global-footer{padding:24px 18px!important}.swa-global-footer__utility{display:grid!important;grid-template-columns:1fr!important;gap:10px!important;margin-bottom:22px!important}.swa-global-footer__legal{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:8px 18px!important}.swa-global-footer__legal li:last-child{grid-column:1/-1!important;margin-top:8px!important}.swa-global-footer__legal a,.swa-global-footer__copyright{white-space:normal!important}}",
      "@media(prefers-reduced-motion:reduce){.swa-global-footer *{scroll-behavior:auto!important;transition:none!important}}"
    ].join("\n");
    document.head.appendChild(style);
  }

  function removeLegacyFooters() {
    Array.prototype.slice.call(document.querySelectorAll("body > footer, body > .site-footer, body > [data-site-footer]")).forEach(function (node) {
      if (node.classList.contains("swa-global-footer") || node.hasAttribute("data-sk-preserve-footer")) return;
      if (node.parentNode) node.parentNode.removeChild(node);
    });
  }

  function getSavedTheme() {
    try {
      var saved = window.localStorage.getItem(STORAGE_KEY);
      return saved === "light" || saved === "dark" || saved === "system" ? saved : "system";
    } catch (error) {
      return "system";
    }
  }

  function saveTheme(mode) {
    try {
      window.localStorage.setItem(STORAGE_KEY, mode);
    } catch (error) {
      /* Storage can be blocked by privacy controls. Theme still works for this page. */
    }
  }

  function applyTheme(mode) {
    var root = document.documentElement;
    var wasManaged = root.getAttribute("data-swa-theme-managed") === "true";

    root.setAttribute("data-swa-theme", mode);

    if (mode === "system") {
      if (wasManaged) root.removeAttribute("data-theme");
      root.removeAttribute("data-swa-theme-managed");
      root.style.colorScheme = "light dark";
    } else {
      root.setAttribute("data-theme", mode);
      root.setAttribute("data-swa-theme-managed", "true");
      root.style.colorScheme = mode;
    }

    Array.prototype.slice.call(document.querySelectorAll(".swa-global-footer__theme-option")).forEach(function (button) {
      button.setAttribute("aria-pressed", String(button.getAttribute("data-theme-value") === mode));
    });

    try {
      window.dispatchEvent(new CustomEvent("skunkworksacademy:theme-change", { detail: { theme: mode } }));
    } catch (error) {
      /* CustomEvent can be unavailable in very old embedded browsers. */
    }
  }

  function externalLink(href, label) {
    var link = document.createElement("a");
    link.href = href;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.appendChild(document.createTextNode(label));
    var mark = document.createElement("span");
    mark.className = "swa-global-footer__external";
    mark.setAttribute("aria-hidden", "true");
    mark.textContent = "↗";
    link.appendChild(mark);
    return link;
  }

  function standardLink(href, label) {
    var link = document.createElement("a");
    link.href = href;
    link.textContent = label;
    return link;
  }

  function createFooter() {
    if (!document.body || document.querySelector(".swa-global-footer")) return;

    removeLegacyFooters();
    addStyles();

    var footer = document.createElement("footer");
    footer.className = "swa-global-footer";
    footer.setAttribute("data-skunkworks-global-footer", VERSION);
    footer.setAttribute("role", "contentinfo");
    footer.setAttribute("aria-label", "Skunkworks Academy footer");

    var utility = document.createElement("div");
    utility.className = "swa-global-footer__utility";

    var language = document.createElement("span");
    language.className = "swa-global-footer__utility-item";
    language.innerHTML = '<span class="swa-global-footer__icon" aria-hidden="true"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"></circle><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"></path></svg></span><span>English (South Africa)</span>';
    utility.appendChild(language);

    var privacy = standardLink(ROOT_URL + "/cookie-policy.html", "Your Privacy Choices");
    privacy.className = "swa-global-footer__utility-item";
    var privacyMark = document.createElement("span");
    privacyMark.className = "swa-global-footer__privacy-mark";
    privacyMark.setAttribute("aria-hidden", "true");
    privacy.insertBefore(privacyMark, privacy.firstChild);
    utility.appendChild(privacy);

    var theme = document.createElement("details");
    theme.className = "swa-global-footer__theme";
    theme.innerHTML = '<summary><span class="swa-global-footer__icon" aria-hidden="true"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3.5"></circle><path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42"></path></svg></span><span>Theme</span><span class="swa-global-footer__chevron" aria-hidden="true"></span></summary>';

    var themeMenu = document.createElement("div");
    themeMenu.className = "swa-global-footer__theme-menu";
    [
      ["system", "Use system setting"],
      ["light", "Light"],
      ["dark", "Dark"]
    ].forEach(function (item) {
      var button = document.createElement("button");
      button.type = "button";
      button.className = "swa-global-footer__theme-option";
      button.setAttribute("data-theme-value", item[0]);
      button.textContent = item[1];
      button.addEventListener("click", function () {
        saveTheme(item[0]);
        applyTheme(item[0]);
        theme.removeAttribute("open");
      });
      themeMenu.appendChild(button);
    });
    theme.appendChild(themeMenu);
    utility.appendChild(theme);
    footer.appendChild(utility);

    var legal = document.createElement("ul");
    legal.className = "swa-global-footer__legal";
    legal.setAttribute("aria-label", "Legal and company links");

    [
      ["standard", ROOT_URL + "/about.html", "About"],
      ["external", "https://blog.skunkworksacademy.com/", "Blog"],
      ["external", "https://github.com/skunkworks-academy", "Contribute"],
      ["standard", ROOT_URL + "/privacy.html", "Privacy"],
      ["standard", ROOT_URL + "/cookie-policy.html", "Cookie Policy"],
      ["standard", ROOT_URL + "/terms.html", "Terms of Use"],
      ["standard", ROOT_URL + "/editorial-policy.html", "Editorial Policy"],
      ["standard", ROOT_URL + "/advertising-disclosure.html", "Advertising Disclosure"],
      ["standard", ROOT_URL + "/contact.html", "Contact"]
    ].forEach(function (item) {
      var li = document.createElement("li");
      li.appendChild(item[0] === "external" ? externalLink(item[1], item[2]) : standardLink(item[1], item[2]));
      legal.appendChild(li);
    });

    var copyrightItem = document.createElement("li");
    var copyright = document.createElement("span");
    copyright.className = "swa-global-footer__copyright";
    copyright.textContent = "© Skunkworks Academy " + new Date().getFullYear();
    copyrightItem.appendChild(copyright);
    legal.appendChild(copyrightItem);

    footer.appendChild(legal);
    document.body.appendChild(footer);

    applyTheme(getSavedTheme());
  }

  ready(createFooter);
})();
