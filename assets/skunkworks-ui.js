/* Skunkworks Academy Global UI — canonical navigation runtime */
(function () {
  "use strict";

  if (window.SkunkworksAcademy && window.SkunkworksAcademy.uiLoaded) return;

  var VERSION = "2026.09.08.3";
  var ASSET_ROOT = "https://skunkworksacademy.com";
  var imageHost = String(window.location && window.location.hostname || "").toLowerCase();
  var isLocalImagePreview = imageHost === "localhost" || imageHost === "127.0.0.1" || imageHost === "::1" || imageHost === "[::1]";
  var IMAGE_ROOT = isLocalImagePreview ? window.location.origin.replace(/\/$/, "") : ASSET_ROOT;
  var LOGO_LIGHT = IMAGE_ROOT + "/images/favicon-black.png?v=" + VERSION;
  var LOGO_DARK = IMAGE_ROOT + "/images/logo-white.svg?v=" + VERSION;
  var SIGN_IN_URL = "https://portal.skunkworksacademy.com/";
  var destinations = [
    { label: "Home", url: "https://skunkworksacademy.com/", domains: ["skunkworksacademy.com", "www.skunkworksacademy.com"], description: "Skunkworks Academy home" },
    { label: "Learning catalogue", url: "https://skunkworksacademy.com/catalogue/", description: "Self-paced and instructor-led learning" },
    { label: "Courses", url: "https://www.skunkworksacademy.com/courses/", description: "Browse published Academy courses and learning outcomes" },
    { label: "Course registration", url: "https://www.skunkworksacademy.com/course-registration/", description: "Register for training and enquiries" },
    { label: "Learning design plugin", url: "https://www.skunkworksacademy.com/plugins/academy-learning-design/", description: "Create accessible, visual and assessment-led Academy courses with ChatGPT" },
    { label: "Plans & purchases", url: "https://skunkworksacademy.com/plans-and-purchases/", description: "Training plans and purchases" },
    { label: "Learner portal", url: "https://portal.skunkworksacademy.com/", domains: ["portal.skunkworksacademy.com"], description: "Your Academy account and learning portal" },
    { label: "Labs", url: "https://labs.skunkworksacademy.com/", domains: ["labs.skunkworksacademy.com", "lab.skunkworksacademy.com"], description: "Hands-on technical labs" },
    { label: "Security", url: "https://security.skunkworksacademy.com/", domains: ["security.skunkworksacademy.com"], description: "Security learning and services" },
    { label: "Microsoft learning", url: "https://microsoft.skunkworksacademy.com/", domains: ["microsoft.skunkworksacademy.com"], description: "Microsoft training and certification" },
    { label: "IBM learning", url: "https://ibm.skunkworksacademy.com/", domains: ["ibm.skunkworksacademy.com"], description: "IBM enterprise training" },
    { label: "Badging", url: "https://badging.skunkworksacademy.com/", domains: ["badging.skunkworksacademy.com", "badge-hub.skunkworksacademy.com"], description: "Digital credentials and badges" },
    { label: "Jobs", url: "https://jobs.skunkworksacademy.com/", domains: ["jobs.skunkworksacademy.com"], description: "Academy careers and opportunities" },
    { label: "Forms", url: "https://skunkworksacademy.com/forms/", description: "Academy forms and requests" },
    { label: "Connections", url: "https://portal.skunkworksacademy.com/connections/", description: "Learning connections" },
    { label: "Reports", url: "https://portal.skunkworksacademy.com/reports/", description: "Learning reports" },
    { label: "Docs", url: "https://docs.skunkworksacademy.com/", domains: ["docs.skunkworksacademy.com"], description: "Academy documentation" },
    { label: "Publish", url: "https://publish.skunkworksacademy.com/", domains: ["publish.skunkworksacademy.com"], description: "Academy publishing" },
    { label: "Blog", url: "https://blog.skunkworksacademy.com/", domains: ["blog.skunkworksacademy.com"], description: "Academy updates and articles" }
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
      "body.swa-has-global-nav{padding-top:84px!important}",
      ".swa-global-nav,.swa-global-nav *{box-sizing:border-box!important}",
      ".swa-global-nav{--swa-bg:#000;--swa-panel:#000;--swa-panel-strong:#1a1a1a;--swa-text:#fff;--swa-muted:#d9d9d9;--swa-line:rgba(255,255,255,.28);--swa-accent:#fff;--swa-link:#fff;position:fixed!important;inset:0 0 auto 0!important;z-index:2147483000!important;min-height:84px!important;background:var(--swa-bg)!important;color:var(--swa-text)!important;border:0!important;box-shadow:0 8px 20px rgba(0,0,0,.28)!important;font-family:Segoe UI,SegoeUI,system-ui,-apple-system,BlinkMacSystemFont,Arial,sans-serif!important}",
      ".swa-global-nav::after{content:\"\"!important;position:absolute!important;right:0!important;bottom:0!important;left:0!important;height:1px!important;background:var(--swa-accent)!important;opacity:.32!important}",
      ".swa-global-nav__inner{position:relative!important;display:flex!important;align-items:center!important;min-height:80px!important;width:100%!important;padding:0 clamp(20px,4vw,56px)!important;gap:12px!important}",
      ".swa-global-nav__identity{display:flex!important;align-items:center!important;min-width:0!important;gap:12px!important}",
      ".swa-global-nav__brand{display:inline-flex!important;align-items:center!important;min-width:0!important;gap:10px!important;color:var(--swa-text)!important;text-decoration:none!important;font-size:clamp(18px,2vw,28px)!important;font-weight:600!important;letter-spacing:-.025em!important;line-height:1!important}",
      ".swa-global-nav__brand:focus-visible,.swa-global-nav__crest:focus-visible,.swa-global-nav__sign-in:focus-visible,.swa-global-nav__toggle:focus-visible,.swa-global-nav__search:focus-visible,.swa-global-nav__link:focus-visible,.swa-global-nav__search-result:focus-visible{outline:3px solid #fff!important;outline-offset:3px!important}",
      ".swa-global-nav__brand-text{overflow:hidden!important;text-overflow:ellipsis!important;white-space:nowrap!important}",
      ".swa-global-nav__brand-logo{display:none!important;flex:0 0 auto!important;width:30px!important;height:30px!important;object-fit:contain!important}",
      ".swa-global-nav__crest{position:absolute!important;top:50%!important;left:50%!important;display:inline-flex!important;align-items:center!important;justify-content:center!important;width:50px!important;height:50px!important;transform:translate(-50%,-50%)!important;color:#fff!important;text-decoration:none!important}",
      ".swa-global-nav__crest-logo{display:block!important;width:46px!important;height:46px!important;object-fit:contain!important}",
      ".swa-global-nav .swa-logo-light{display:none!important}.swa-global-nav .swa-logo-dark{display:block!important}",
      ".swa-global-nav__controls{display:flex!important;align-items:center!important;gap:8px!important;margin-left:auto!important}",
      ".swa-global-nav__search,.swa-global-nav__toggle{display:inline-flex!important;align-items:center!important;justify-content:center!important;width:50px!important;height:50px!important;margin:0!important;padding:0!important;border:0!important;border-radius:2px!important;background:transparent!important;color:var(--swa-text)!important;cursor:pointer!important}",
      ".swa-global-nav__search:hover,.swa-global-nav__search:focus,.swa-global-nav__toggle:hover,.swa-global-nav__toggle:focus{background:#1a1a1a!important}",
      ".swa-global-nav__search svg{width:31px!important;height:31px!important;fill:none!important;stroke:currentColor!important;stroke-linecap:round!important;stroke-linejoin:round!important;stroke-width:2!important}",
      ".swa-global-nav__toggle-lines{display:grid!important;gap:6px!important}.swa-global-nav__toggle-lines span{display:block!important;width:29px!important;height:3px!important;border-radius:0!important;background:currentColor!important}",
      ".swa-global-nav__sign-in{display:inline-flex!important;align-items:center!important;justify-content:center!important;min-height:50px!important;padding:0 8px!important;color:var(--swa-link)!important;background:transparent!important;border:0!important;text-decoration:none!important;font-size:clamp(15px,1.55vw,20px)!important;font-weight:400!important;letter-spacing:0!important;white-space:nowrap!important}",
      ".swa-global-nav__sign-in:hover,.swa-global-nav__sign-in:focus{color:#fff!important;text-decoration:underline!important;text-underline-offset:4px!important}",
      ".swa-global-nav__account-name{max-width:clamp(92px,13vw,180px)!important;overflow:hidden!important;color:var(--swa-muted)!important;font-size:14px!important;font-weight:600!important;text-overflow:ellipsis!important;white-space:nowrap!important}",
      ".swa-global-nav__account{position:relative!important;flex:none!important;min-width:0!important}.swa-global-nav__account[hidden],.swa-global-nav__account-menu[hidden],.swa-global-nav__account-item[hidden],.swa-global-nav__sign-in[hidden],.swa-global-nav__account-name[hidden]{display:none!important}",
      ".swa-global-nav__account-toggle{display:inline-flex!important;align-items:center!important;gap:8px!important;max-width:240px!important;min-height:44px!important;margin:0!important;padding:5px 8px!important;border:1px solid transparent!important;border-radius:24px!important;background:transparent!important;color:var(--swa-text)!important;font:inherit!important;font-size:14px!important;line-height:1.2!important;cursor:pointer!important}",
      ".swa-global-nav__account-toggle:hover,.swa-global-nav__account-toggle[aria-expanded=\"true\"]{background:var(--swa-panel-strong)!important;border-color:var(--swa-line)!important}.swa-global-nav__account-toggle:focus-visible,.swa-global-nav__account-item:focus-visible{outline:3px solid var(--swa-text)!important;outline-offset:3px!important}",
      ".swa-global-nav__account-avatar{display:inline-flex!important;align-items:center!important;justify-content:center!important;flex:none!important;width:32px!important;height:32px!important;border:1px solid var(--swa-line)!important;border-radius:50%!important;background:#2b2b2b!important;color:#fff!important;font-size:12px!important;font-weight:700!important;letter-spacing:0!important}.swa-global-nav__account-label{max-width:160px!important;overflow:hidden!important;text-overflow:ellipsis!important;white-space:nowrap!important}.swa-global-nav__account-chevron{font-size:12px!important;flex:none!important}",
      ".swa-global-nav__account-menu{position:absolute!important;top:calc(100% + 8px)!important;right:0!important;z-index:2!important;display:grid!important;min-width:180px!important;width:max-content!important;max-width:calc(100vw - 20px)!important;max-height:calc(100vh - 100px)!important;overflow:auto!important;margin:0!important;padding:6px!important;border:1px solid var(--swa-line)!important;border-radius:10px!important;background:var(--swa-panel)!important;color:var(--swa-text)!important;box-shadow:0 14px 32px rgba(0,0,0,.35)!important}",
      ".swa-global-nav__account-item{display:flex!important;align-items:center!important;min-height:44px!important;width:100%!important;margin:0!important;padding:10px 12px!important;border:0!important;border-radius:5px!important;background:transparent!important;color:var(--swa-text)!important;text-decoration:none!important;text-align:left!important;font:inherit!important;font-size:14px!important;line-height:1.3!important;cursor:pointer!important}.swa-global-nav__account-item:hover,.swa-global-nav__account-item:focus{background:var(--swa-panel-strong)!important;color:var(--swa-text)!important}",
      "@media(max-width:620px){.swa-global-nav__account-toggle{gap:0!important;padding:5px!important;max-width:44px!important;width:44px!important;height:44px!important;justify-content:center!important}.swa-global-nav__account-label,.swa-global-nav__account-chevron{display:none!important}.swa-global-nav__controls{gap:2px!important}.swa-global-nav__account-menu{max-height:calc(100svh - 90px)!important}}",
      ".swa-global-nav__links,.swa-global-nav__search-panel{position:absolute!important;top:calc(100% + 4px)!important;right:clamp(16px,4vw,56px)!important;width:min(450px,calc(100vw - 32px))!important;max-height:calc(100vh - 104px)!important;overflow:auto!important;display:none!important;padding:20px!important;background:var(--swa-panel)!important;border:1px solid var(--swa-line)!important;border-top:0!important;border-radius:0 0 10px 10px!important;box-shadow:0 22px 48px rgba(0,0,0,.45)!important}",
      ".swa-global-nav.swa-menu-open .swa-global-nav__links{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:8px!important}",
      ".swa-global-nav.swa-search-open .swa-global-nav__search-panel{display:block!important}",
      ".swa-global-nav__panel-heading{grid-column:1/-1!important;margin:0 0 8px!important;color:var(--swa-muted)!important;font-size:12px!important;font-weight:700!important;letter-spacing:.12em!important;line-height:1.2!important;text-transform:uppercase!important}",
      ".swa-global-nav__link{display:flex!important;align-items:center!important;min-height:46px!important;padding:10px 12px!important;border:1px solid transparent!important;border-radius:3px!important;background:transparent!important;color:var(--swa-text)!important;text-decoration:none!important;font-size:15px!important;font-weight:600!important;line-height:1.25!important}",
      ".swa-global-nav__link:hover,.swa-global-nav__link:focus,.swa-global-nav__link[aria-current=\"page\"]{background:var(--swa-panel-strong)!important;border-color:#616161!important;color:#fff!important}",
      ".swa-global-nav__search-label{display:block!important;margin:0 0 10px!important;color:var(--swa-text)!important;font-size:16px!important;font-weight:600!important}",
      ".swa-global-nav__search-box{display:flex!important;align-items:center!important;gap:10px!important;border:1px solid #707070!important;background:#fff!important;padding:0 12px!important}",
      ".swa-global-nav__search-box svg{flex:0 0 auto!important;width:21px!important;height:21px!important;fill:none!important;stroke:#1f1f1f!important;stroke-linecap:round!important;stroke-linejoin:round!important;stroke-width:2!important}",
      ".swa-global-nav__search-input{width:100%!important;min-height:46px!important;padding:0!important;border:0!important;outline:0!important;background:transparent!important;color:#1f1f1f!important;font:inherit!important;font-size:16px!important}",
      ".swa-global-nav__search-input::placeholder{color:#5e5e5e!important;opacity:1!important}",
      ".swa-global-nav__search-results{display:grid!important;gap:6px!important;margin-top:14px!important}",
      ".swa-global-nav__search-status{margin:0 0 4px!important;color:var(--swa-muted)!important;font-size:13px!important}",
      ".swa-global-nav__search-result{display:grid!important;gap:3px!important;padding:10px 12px!important;border:1px solid transparent!important;border-radius:3px!important;background:transparent!important;color:var(--swa-text)!important;text-decoration:none!important}",
      ".swa-global-nav__search-result:hover,.swa-global-nav__search-result:focus{background:var(--swa-panel-strong)!important;border-color:#616161!important}",
      ".swa-global-nav__search-result strong{font-size:15px!important;font-weight:700!important;line-height:1.3!important}.swa-global-nav__search-result span{color:var(--swa-muted)!important;font-size:13px!important;line-height:1.35!important}",
      ".swa-global-nav__search-empty{margin:0!important;padding:12px!important;border:1px solid var(--swa-line)!important;color:var(--swa-muted)!important;font-size:14px!important}",
      "@media(max-width:860px){.swa-global-nav__crest{display:none!important}.swa-global-nav__brand-logo.swa-logo-dark{display:block!important}.swa-global-nav__identity{gap:6px!important}.swa-global-nav__inner{padding:0 18px!important}}",
      "@media(max-width:620px){body.swa-has-global-nav{padding-top:74px!important}.swa-global-nav{min-height:74px!important}.swa-global-nav__inner{min-height:70px!important;padding:0 10px!important;gap:4px!important}.swa-global-nav__identity{gap:2px!important}.swa-global-nav__search,.swa-global-nav__toggle{width:44px!important;height:44px!important}.swa-global-nav__search svg{width:27px!important;height:27px!important}.swa-global-nav__toggle-lines span{width:25px!important}.swa-global-nav__sign-in{min-height:44px!important;padding:0 6px!important;font-size:16px!important}.swa-global-nav__account-name{display:none!important}.swa-global-nav__brand{font-size:18px!important}.swa-global-nav__brand-logo{width:26px!important;height:26px!important}.swa-global-nav__links,.swa-global-nav__search-panel{right:10px!important;width:calc(100vw - 20px)!important;max-height:calc(100vh - 88px)!important}.swa-global-nav.swa-menu-open .swa-global-nav__links{grid-template-columns:1fr!important}}",
      "@media(max-width:410px){.swa-global-nav__brand{font-size:16px!important}.swa-global-nav__brand-text{max-width:calc(100vw - 216px)!important}.swa-global-nav__sign-in{font-size:14px!important}.swa-global-nav__brand-logo{display:none!important}}"
    ].join("\n");
    document.head.appendChild(style);
  }

  function isInsideContent(node) {
    return Boolean(node.closest && node.closest("main,article,section,aside,.document,.sk-document"));
  }

  function removeLegacyHeaders() {
    var selectors = [
      "header.top",
      "header.topbar",
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
    image.className = className;
    image.src = source;
    image.alt = "";
    image.width = 46;
    image.height = 46;
    image.decoding = "async";
    image.fetchPriority = "high";
    image.setAttribute("aria-hidden", "true");
    image.addEventListener("error", function () { image.style.display = "none"; }, { once: true });
    return image;
  }

  function createSearchIcon() {
    var namespace = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(namespace, "svg");
    var circle = document.createElementNS(namespace, "circle");
    var line = document.createElementNS(namespace, "path");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("aria-hidden", "true");
    circle.setAttribute("cx", "10.5");
    circle.setAttribute("cy", "10.5");
    circle.setAttribute("r", "6.5");
    line.setAttribute("d", "m16 16 5 5");
    svg.appendChild(circle);
    svg.appendChild(line);
    return svg;
  }

  function createDestinationLink(destination, className) {
    var link = document.createElement("a");
    link.className = className;
    link.href = destination.url;
    if (isCurrent(destination)) link.setAttribute("aria-current", "page");
    return link;
  }

  function buildNavigation() {
    if (!document.body || document.body.getAttribute("data-sk-global-nav") === "off") return;
    if (document.querySelector(".swa-global-nav")) return;

    removeLegacyHeaders();

    var header = document.createElement("header");
    var inner = document.createElement("div");
    var identity = document.createElement("div");
    var toggle = document.createElement("button");
    var toggleLines = document.createElement("span");
    var brand = document.createElement("a");
    var brandText = document.createElement("span");
    var crest = document.createElement("a");
    var controls = document.createElement("div");
    var search = document.createElement("button");
    var accountName = document.createElement("span");
    var signIn = document.createElement("a");
    var accountControl = document.createElement("div");
    var accountToggle = document.createElement("button");
    var accountAvatar = document.createElement("span");
    var accountLabel = document.createElement("span");
    var accountChevron = document.createElement("span");
    var accountMenu = document.createElement("div");
    var profileLink = document.createElement("a");
    var settingsLink = document.createElement("a");
    var accountSignOut = document.createElement("button");
    var links = document.createElement("nav");
    var linksHeading = document.createElement("p");
    var searchPanel = document.createElement("section");
    var searchLabel = document.createElement("label");
    var searchBox = document.createElement("div");
    var searchInput = document.createElement("input");
    var searchResults = document.createElement("div");

    header.className = "swa-global-nav";
    header.setAttribute("data-skunkworks-global-header", "canonical-v9-reference-layout");
    inner.className = "swa-global-nav__inner";

    identity.className = "swa-global-nav__identity";

    toggle.className = "swa-global-nav__toggle";
    toggle.type = "button";
    toggle.setAttribute("aria-label", "Open Academy menu");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-controls", "swa-global-nav-links");
    toggleLines.className = "swa-global-nav__toggle-lines";
    toggleLines.setAttribute("aria-hidden", "true");
    for (var index = 0; index < 3; index += 1) {
      toggleLines.appendChild(document.createElement("span"));
    }
    toggle.appendChild(toggleLines);

    brand.className = "swa-global-nav__brand";
    brand.href = ASSET_ROOT + "/";
    brand.setAttribute("aria-label", "Skunkworks Academy home");
    brand.appendChild(createLogo("swa-global-nav__brand-logo swa-logo-light", LOGO_LIGHT));
    brand.appendChild(createLogo("swa-global-nav__brand-logo swa-logo-dark", LOGO_DARK));
    brandText.className = "swa-global-nav__brand-text";
    brandText.textContent = "Skunkworks Academy";
    brand.appendChild(brandText);

    crest.className = "swa-global-nav__crest";
    crest.href = ASSET_ROOT + "/";
    crest.setAttribute("aria-label", "Skunkworks Academy home");
    crest.appendChild(createLogo("swa-global-nav__crest-logo swa-logo-light", LOGO_LIGHT));
    crest.appendChild(createLogo("swa-global-nav__crest-logo swa-logo-dark", LOGO_DARK));

    controls.className = "swa-global-nav__controls";
    search.className = "swa-global-nav__search";
    search.type = "button";
    search.setAttribute("aria-label", "Search Academy destinations");
    search.setAttribute("aria-expanded", "false");
    search.setAttribute("aria-controls", "swa-global-nav-search");
    search.appendChild(createSearchIcon());

    signIn.className = "swa-global-nav__sign-in";
    signIn.href = SIGN_IN_URL;
    signIn.textContent = "Sign in";
    signIn.setAttribute("aria-label", "Sign in to the Skunkworks Academy learner portal");
    accountName.className = "swa-global-nav__account-name";
    accountName.hidden = true;

    accountControl.className = "swa-global-nav__account";
    accountControl.hidden = true;
    accountToggle.className = "swa-global-nav__account-toggle";
    accountToggle.type = "button";
    accountToggle.setAttribute("aria-haspopup", "menu");
    accountToggle.setAttribute("aria-expanded", "false");
    accountToggle.setAttribute("aria-controls", "swa-global-nav-account-menu");
    accountAvatar.className = "swa-global-nav__account-avatar";
    accountAvatar.setAttribute("aria-hidden", "true");
    accountLabel.className = "swa-global-nav__account-label";
    accountChevron.className = "swa-global-nav__account-chevron";
    accountChevron.textContent = "\u25be";
    accountChevron.setAttribute("aria-hidden", "true");
    accountToggle.appendChild(accountAvatar);
    accountToggle.appendChild(accountLabel);
    accountToggle.appendChild(accountChevron);
    accountMenu.className = "swa-global-nav__account-menu";
    accountMenu.id = "swa-global-nav-account-menu";
    accountMenu.hidden = true;
    accountMenu.setAttribute("role", "menu");
    accountMenu.setAttribute("aria-label", "Account");
    [profileLink, settingsLink, accountSignOut].forEach(function (item, index) {
      item.className = "swa-global-nav__account-item";
      item.setAttribute("role", "menuitem");
      item.tabIndex = -1;
      item.textContent = ["Profile", "Settings", "Sign out"][index];
      accountMenu.appendChild(item);
    });
    accountSignOut.type = "button";
    accountControl.appendChild(accountToggle);
    accountControl.appendChild(accountMenu);

    links.className = "swa-global-nav__links";
    links.id = "swa-global-nav-links";
    links.setAttribute("aria-label", "Academy menu");
    linksHeading.className = "swa-global-nav__panel-heading";
    linksHeading.textContent = "Skunkworks Academy";
    links.appendChild(linksHeading);
    destinations.forEach(function (destination) {
      var link = createDestinationLink(destination, "swa-global-nav__link");
      link.textContent = destination.label;
      links.appendChild(link);
    });

    searchPanel.className = "swa-global-nav__search-panel";
    searchPanel.id = "swa-global-nav-search";
    searchPanel.setAttribute("role", "search");
    searchLabel.className = "swa-global-nav__search-label";
    searchLabel.htmlFor = "swa-global-nav-search-input";
    searchLabel.textContent = "Search the Academy";
    searchBox.className = "swa-global-nav__search-box";
    searchBox.appendChild(createSearchIcon());
    searchInput.className = "swa-global-nav__search-input";
    searchInput.id = "swa-global-nav-search-input";
    searchInput.type = "search";
    searchInput.placeholder = "Find a destination";
    searchInput.autocomplete = "off";
    searchInput.setAttribute("spellcheck", "false");
    searchInput.setAttribute("aria-describedby", "swa-global-nav-search-status");
    searchResults.className = "swa-global-nav__search-results";
    searchResults.setAttribute("aria-live", "polite");
    searchResults.setAttribute("aria-atomic", "true");

    searchPanel.appendChild(searchLabel);
    searchPanel.appendChild(searchBox);
    searchBox.appendChild(searchInput);
    searchPanel.appendChild(searchResults);

    identity.appendChild(toggle);
    identity.appendChild(brand);
    controls.appendChild(search);
    controls.appendChild(accountName);
    controls.appendChild(signIn);
    controls.appendChild(accountControl);
    inner.appendChild(identity);
    inner.appendChild(crest);
    inner.appendChild(controls);
    inner.appendChild(links);
    inner.appendChild(searchPanel);
    header.appendChild(inner);
    document.body.insertBefore(header, document.body.firstChild);
    document.body.classList.add("swa-has-global-nav");

    var accountHandler = null;

    function isPortalWorkspace(account) {
      return window.location.hostname.toLowerCase() === "portal.skunkworksacademy.com" &&
        account && account.source === "portal" && account.authenticated === true && account.workspaceNavigation === "sidebar";
    }

    function isPortalAccount(account) {
      return isPortalWorkspace(account) && typeof account.signOut === "function";
    }

    function safeAccountUrl(value) {
      if (typeof value !== "string" || !value.trim()) return "";
      try {
        var target = new URL(value, window.location.origin);
        if (target.origin !== window.location.origin || !/^https?:$/.test(target.protocol) || target.username || target.password) return "";
        return target.href;
      } catch (_error) { return ""; }
    }

    function setAccountLink(link, value) {
      var href = safeAccountUrl(value);
      link.hidden = !href;
      if (href) link.href = href;
      else link.removeAttribute("href");
    }

    function accountItems() {
      return [profileLink, settingsLink, accountSignOut].filter(function (item) { return !item.hidden; });
    }

    function closeAccountMenu(restoreFocus) {
      var wasOpen = !accountMenu.hidden;
      accountMenu.hidden = true;
      accountToggle.setAttribute("aria-expanded", "false");
      if (wasOpen && restoreFocus && !accountControl.hidden) accountToggle.focus();
    }

    function openAccountMenu(last) {
      if (accountControl.hidden) return;
      closeMenu();
      closeSearch();
      accountMenu.hidden = false;
      accountToggle.setAttribute("aria-expanded", "true");
      var items = accountItems();
      items[last ? items.length - 1 : 0].focus();
    }

    accountToggle.addEventListener("click", function () {
      if (accountMenu.hidden) openAccountMenu(false);
      else closeAccountMenu(true);
    });
    accountToggle.addEventListener("keydown", function (event) {
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        openAccountMenu(event.key === "ArrowUp");
      }
    });
    accountMenu.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        closeAccountMenu(true);
        return;
      }
      var items = accountItems();
      var index = items.indexOf(document.activeElement);
      var next = index;
      if (event.key === "ArrowDown") next = (index + 1) % items.length;
      else if (event.key === "ArrowUp") next = (index - 1 + items.length) % items.length;
      else if (event.key === "Home") next = 0;
      else if (event.key === "End") next = items.length - 1;
      else if (event.key === " ") {
        event.preventDefault();
        if (index !== -1) items[index].click();
        return;
      } else if (event.key === "Tab") {
        window.setTimeout(function () { closeAccountMenu(false); }, 0);
        return;
      } else return;
      event.preventDefault();
      items[next].focus();
    });
    accountControl.addEventListener("focusout", function (event) {
      if (event.relatedTarget && !accountControl.contains(event.relatedTarget)) closeAccountMenu(false);
    });
    [profileLink, settingsLink].forEach(function (link) {
      link.addEventListener("click", function () { closeAccountMenu(false); });
    });
    accountSignOut.addEventListener("click", function () {
      var account = window.SKUNKWORKS_ACADEMY_NAV_ACCOUNT;
      closeAccountMenu(true);
      if (isPortalAccount(account)) account.signOut();
    });

    function removeAccountHandler() {
      if (!accountHandler) return;
      signIn.removeEventListener("click", accountHandler);
      accountHandler = null;
    }

    function resetSignIn() {
      removeAccountHandler();
      signIn.textContent = "Sign in";
      signIn.href = SIGN_IN_URL;
      signIn.removeAttribute("role");
      signIn.setAttribute("aria-label", "Sign in to the Skunkworks Academy learner portal");
    }

    function setAccountAction(label, description, action) {
      resetSignIn();
      signIn.textContent = label;
      signIn.href = "#";
      signIn.setAttribute("role", "button");
      signIn.setAttribute("aria-label", description);
      accountHandler = function (event) {
        event.preventDefault();
        action();
      };
      signIn.addEventListener("click", accountHandler);
    }

    function applyAccountControl() {
      var account = window.SKUNKWORKS_ACADEMY_NAV_ACCOUNT;
      var userName = account && typeof account.userName === "string" ? account.userName.trim() : "";
      var hadAccountFocus = accountControl.contains(document.activeElement);
      var portalWorkspace = isPortalWorkspace(account);
      var workspaceMenuOpen = portalWorkspace && toggle.getAttribute("aria-controls") === "academy-portal-sidebar" && toggle.getAttribute("aria-expanded") === "true";
      var academyMenuOpen = !portalWorkspace && header.classList.contains("swa-menu-open");
      header.classList.toggle("swa-portal-workspace", Boolean(portalWorkspace));
      toggle.setAttribute("aria-controls", portalWorkspace ? "academy-portal-sidebar" : "swa-global-nav-links");
      toggle.setAttribute("aria-label", portalWorkspace ? (workspaceMenuOpen ? "Close workspace navigation" : "Open workspace navigation") : (academyMenuOpen ? "Close Academy menu" : "Open Academy menu"));
      toggle.setAttribute("aria-expanded", String(Boolean(portalWorkspace ? workspaceMenuOpen : academyMenuOpen)));

      accountName.hidden = !userName;
      accountName.textContent = userName;
      closeAccountMenu(false);
      accountControl.hidden = true;
      signIn.hidden = false;

      if (isPortalAccount(account)) {
        var displayName = userName || "Account";
        var words = displayName.split(/\s+/);
        accountLabel.textContent = displayName;
        accountAvatar.textContent = (Array.from(words[0])[0] + (words.length > 1 ? Array.from(words[words.length - 1])[0] : "")).toUpperCase();
        accountToggle.setAttribute("aria-label", "Account menu for " + displayName);
        accountToggle.title = displayName;
        setAccountLink(profileLink, account.profileUrl);
        setAccountLink(settingsLink, account.settingsUrl);
        removeAccountHandler();
        accountName.hidden = true;
        signIn.hidden = true;
        accountControl.hidden = false;
        if (hadAccountFocus) accountToggle.focus();
        return;
      }

      if (hadAccountFocus) signIn.focus();

      if (!account || typeof account !== "object") {
        resetSignIn();
        return;
      }

      if (account.authenticated && typeof account.signOut === "function") {
        setAccountAction(account.signOutLabel || "Sign out", "Sign out of Skunkworks Academy", account.signOut);
        return;
      }

      if (!account.authenticated && typeof account.signIn === "function") {
        setAccountAction(account.signInLabel || "Sign in", "Sign in to Skunkworks Academy", account.signIn);
        return;
      }

      resetSignIn();
    }

    // Only a same-origin BFF session may light up public authenticated navigation.
    // A static GitHub Pages 404 or HTML fallback is not identity evidence.
    function refreshServerSession() {
      if (window.SKUNKWORKS_ACADEMY_NAV_ACCOUNT?.authenticated === true) return;
      if (typeof window.fetch !== "function") return;
      window.fetch("/session", {
        credentials: "same-origin",
        cache: "no-store",
        headers: { Accept: "application/json" }
      }).then(function (response) {
        if (!response.ok || !(response.headers.get("content-type") || "").includes("application/json")) return null;
        return response.json();
      }).then(function (session) {
        if (!session || session.authenticated !== true || typeof session.subject !== "string" || !session.subject) return;
        if (window.SKUNKWORKS_ACADEMY_NAV_ACCOUNT?.authenticated === true) return;
        var roles = Array.isArray(session.roles) ? session.roles.filter(function (role) {
          return typeof role === "string" && ["learner", "instructor", "staff", "administrator"].includes(role);
        }) : [];
        var userName = typeof session.displayName === "string" ? session.displayName.slice(0, 80) : "Academy account";
        var csrfToken = typeof session.csrfToken === "string" ? session.csrfToken : "";
        window.SKUNKWORKS_ACADEMY_NAV_ACCOUNT = {
          source: "bff",
          authenticated: true,
          userName: userName,
          roles: roles,
          signOut: function () {
            if (!csrfToken) return;
            window.fetch("/auth/logout", {
              method: "POST", credentials: "same-origin", cache: "no-store",
              headers: { "X-CSRF-Token": csrfToken, "Accept": "application/json" }
            }).then(function (response) {
              if (!response.ok) throw new Error("Sign-out failed");
              window.SKUNKWORKS_ACADEMY_NAV_ACCOUNT = null;
              window.dispatchEvent(new Event("skunkworksacademy:account-change"));
              window.location.reload();
            }).catch(function () { window.alert("Sign-out could not be completed. Please try again."); });
          }
        };
        window.dispatchEvent(new Event("skunkworksacademy:account-change"));
      }).catch(function () { /* Anonymous fallback on unconfigured/static properties. */ });
    }

    applyAccountControl();
    refreshServerSession();
    window.addEventListener("pageshow", refreshServerSession);
    window.addEventListener("skunkworksacademy:account-change", applyAccountControl);
    window.addEventListener("skunkworksacademy:portal-menu-state", function (event) {
      if (!isPortalWorkspace(window.SKUNKWORKS_ACADEMY_NAV_ACCOUNT) || !event.detail || typeof event.detail.open !== "boolean") return;
      toggle.setAttribute("aria-expanded", String(event.detail.open));
      toggle.setAttribute("aria-label", event.detail.open ? "Close workspace navigation" : "Open workspace navigation");
    });

    function renderSearchResults(query) {
      var value = String(query || "").trim().toLowerCase();
      var matches = value ? destinations.filter(function (destination) {
        return [destination.label, destination.description, destination.url].join(" ").toLowerCase().indexOf(value) !== -1;
      }) : destinations.slice(0, 6);
      var status = document.createElement("p");

      while (searchResults.firstChild) searchResults.removeChild(searchResults.firstChild);
      status.className = "swa-global-nav__search-status";
      status.id = "swa-global-nav-search-status";
      status.textContent = value ? (matches.length ? matches.length + " matching destination" + (matches.length === 1 ? "" : "s") : "No matching destinations") : "Suggested destinations";
      searchResults.appendChild(status);

      if (!matches.length) {
        var empty = document.createElement("p");
        empty.className = "swa-global-nav__search-empty";
        empty.textContent = "Try a service, topic or destination name.";
        searchResults.appendChild(empty);
        return;
      }

      matches.forEach(function (destination) {
        var link = createDestinationLink(destination, "swa-global-nav__search-result");
        var label = document.createElement("strong");
        var description = document.createElement("span");
        label.textContent = destination.label;
        description.textContent = destination.description || destination.url;
        link.appendChild(label);
        link.appendChild(description);
        searchResults.appendChild(link);
      });
    }

    function closeMenu() {
      header.classList.remove("swa-menu-open");
      if (isPortalWorkspace(window.SKUNKWORKS_ACADEMY_NAV_ACCOUNT)) return;
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open Academy menu");
    }

    function closeSearch() {
      header.classList.remove("swa-search-open");
      search.setAttribute("aria-expanded", "false");
    }

    function openMenu() {
      closeSearch();
      closeAccountMenu(false);
      header.classList.add("swa-menu-open");
      toggle.setAttribute("aria-expanded", "true");
      toggle.setAttribute("aria-label", "Close Academy menu");
    }

    function openSearch() {
      closeMenu();
      closeAccountMenu(false);
      header.classList.add("swa-search-open");
      search.setAttribute("aria-expanded", "true");
      renderSearchResults(searchInput.value);
      searchInput.focus();
    }

    toggle.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();
      if (isPortalWorkspace(window.SKUNKWORKS_ACADEMY_NAV_ACCOUNT)) {
        closeSearch();
        closeAccountMenu(false);
        window.dispatchEvent(new CustomEvent("skunkworksacademy:portal-menu-toggle"));
        return;
      }
      if (header.classList.contains("swa-menu-open")) closeMenu();
      else openMenu();
    });

    search.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();
      if (header.classList.contains("swa-search-open")) closeSearch();
      else openSearch();
    });

    links.addEventListener("click", function (event) {
      if (event.target && event.target.closest("a")) closeMenu();
    });

    searchResults.addEventListener("click", function (event) {
      if (event.target && event.target.closest("a")) closeSearch();
    });

    searchInput.addEventListener("input", function () {
      renderSearchResults(searchInput.value);
    });

    searchInput.addEventListener("keydown", function (event) {
      if (event.key !== "Enter") return;
      var firstResult = searchResults.querySelector("a");
      if (firstResult) {
        event.preventDefault();
        firstResult.click();
      }
    });

    document.addEventListener("click", function (event) {
      if (!accountControl.contains(event.target)) closeAccountMenu(accountMenu.contains(document.activeElement));
      if (!header.contains(event.target)) {
        closeMenu();
        closeSearch();
      }
    });

    document.addEventListener("keydown", function (event) {
      var target = event.target;
      var isTyping = target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.tagName === "SELECT" || target.isContentEditable);

      if (event.key === "Escape") {
        if (!accountMenu.hidden) {
          event.preventDefault();
          closeAccountMenu(true);
        } else if (header.classList.contains("swa-search-open")) {
          event.preventDefault();
          closeSearch();
          search.focus();
        } else if (header.classList.contains("swa-menu-open")) {
          closeMenu();
          toggle.focus();
        }
        return;
      }

      if (event.key === "/" && !isTyping) {
        event.preventDefault();
        openSearch();
      }
    });
  }

  ready(function () {
    addStyles();
    buildNavigation();
  });
})();
