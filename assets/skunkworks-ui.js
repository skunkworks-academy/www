/* Skunkworks Academy Global UI — canonical navigation runtime */
(function () {
  "use strict";

  if (window.SkunkworksAcademy && window.SkunkworksAcademy.uiLoaded) return;

  var VERSION = "2026.08.14.1";
  var ASSET_ROOT = "https://skunkworksacademy.com";
  var LOGO_LIGHT = ASSET_ROOT + "/images/favicon-black.png?v=" + VERSION;
  var LOGO_DARK = ASSET_ROOT + "/images/favicon-white.png?v=" + VERSION;
  var SIGN_IN_URL = "https://portal.skunkworksacademy.com/";
  var destinations = [
    { label: "Home", url: "https://skunkworksacademy.com/", domains: ["skunkworksacademy.com", "www.skunkworksacademy.com"], description: "Skunkworks Academy home" },
    { label: "Learning catalogue", url: "https://skunkworksacademy.com/catalogue/", description: "Self-paced and instructor-led learning" },
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
      ".swa-global-nav{--swa-bg:#242424;--swa-panel:#1c1c1c;--swa-panel-strong:#303030;--swa-text:#fff;--swa-muted:#c8c8c8;--swa-line:#484848;--swa-accent:#0f6cbd;--swa-link:#9ed0ff;position:fixed!important;inset:0 0 auto 0!important;z-index:2147483000!important;min-height:84px!important;background:var(--swa-bg)!important;color:var(--swa-text)!important;border:0!important;box-shadow:0 8px 20px rgba(0,0,0,.28)!important;font-family:Segoe UI,SegoeUI,system-ui,-apple-system,BlinkMacSystemFont,Arial,sans-serif!important}",
      ".swa-global-nav::after{content:\"\"!important;position:absolute!important;right:0!important;bottom:0!important;left:0!important;height:4px!important;background:var(--swa-accent)!important}",
      ".swa-global-nav__inner{position:relative!important;display:flex!important;align-items:center!important;min-height:80px!important;width:100%!important;padding:0 clamp(20px,4vw,56px)!important;gap:12px!important}",
      ".swa-global-nav__identity{display:flex!important;align-items:center!important;min-width:0!important;gap:12px!important}",
      ".swa-global-nav__brand{display:inline-flex!important;align-items:center!important;min-width:0!important;gap:10px!important;color:var(--swa-text)!important;text-decoration:none!important;font-size:clamp(20px,2.45vw,34px)!important;font-weight:600!important;letter-spacing:-.025em!important;line-height:1!important}",
      ".swa-global-nav__brand:focus-visible,.swa-global-nav__crest:focus-visible,.swa-global-nav__sign-in:focus-visible,.swa-global-nav__toggle:focus-visible,.swa-global-nav__search:focus-visible,.swa-global-nav__link:focus-visible,.swa-global-nav__search-result:focus-visible{outline:3px solid #fff!important;outline-offset:3px!important}",
      ".swa-global-nav__brand-text{overflow:hidden!important;text-overflow:ellipsis!important;white-space:nowrap!important}",
      ".swa-global-nav__brand-logo{display:none!important;flex:0 0 auto!important;width:30px!important;height:30px!important;object-fit:contain!important}",
      ".swa-global-nav__crest{position:absolute!important;top:50%!important;left:50%!important;display:inline-flex!important;align-items:center!important;justify-content:center!important;width:50px!important;height:50px!important;transform:translate(-50%,-50%)!important;color:#fff!important;text-decoration:none!important}",
      ".swa-global-nav__crest-logo{display:block!important;width:46px!important;height:46px!important;object-fit:contain!important}",
      ".swa-global-nav .swa-logo-light{display:none!important}.swa-global-nav .swa-logo-dark{display:block!important}",
      ".swa-global-nav__controls{display:flex!important;align-items:center!important;gap:8px!important;margin-left:auto!important}",
      ".swa-global-nav__search,.swa-global-nav__toggle{display:inline-flex!important;align-items:center!important;justify-content:center!important;width:50px!important;height:50px!important;margin:0!important;padding:0!important;border:0!important;border-radius:2px!important;background:transparent!important;color:var(--swa-text)!important;cursor:pointer!important}",
      ".swa-global-nav__search:hover,.swa-global-nav__search:focus,.swa-global-nav__toggle:hover,.swa-global-nav__toggle:focus{background:#353535!important}",
      ".swa-global-nav__search svg{width:31px!important;height:31px!important;fill:none!important;stroke:currentColor!important;stroke-linecap:round!important;stroke-linejoin:round!important;stroke-width:2!important}",
      ".swa-global-nav__toggle-lines{display:grid!important;gap:6px!important}.swa-global-nav__toggle-lines span{display:block!important;width:29px!important;height:3px!important;border-radius:0!important;background:currentColor!important}",
      ".swa-global-nav__sign-in{display:inline-flex!important;align-items:center!important;justify-content:center!important;min-height:50px!important;padding:0 8px!important;color:var(--swa-link)!important;background:transparent!important;border:0!important;text-decoration:none!important;font-size:clamp(16px,2vw,25px)!important;font-weight:400!important;letter-spacing:0!important;white-space:nowrap!important}",
      ".swa-global-nav__sign-in:hover,.swa-global-nav__sign-in:focus{color:#c9e7ff!important;text-decoration:underline!important;text-underline-offset:4px!important}",
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
      "@media(max-width:620px){body.swa-has-global-nav{padding-top:74px!important}.swa-global-nav{min-height:74px!important}.swa-global-nav__inner{min-height:70px!important;padding:0 10px!important;gap:4px!important}.swa-global-nav__identity{gap:2px!important}.swa-global-nav__search,.swa-global-nav__toggle{width:44px!important;height:44px!important}.swa-global-nav__search svg{width:27px!important;height:27px!important}.swa-global-nav__toggle-lines span{width:25px!important}.swa-global-nav__sign-in{min-height:44px!important;padding:0 6px!important;font-size:17px!important}.swa-global-nav__brand{font-size:20px!important}.swa-global-nav__brand-logo{width:26px!important;height:26px!important}.swa-global-nav__links,.swa-global-nav__search-panel{right:10px!important;width:calc(100vw - 20px)!important;max-height:calc(100vh - 88px)!important}.swa-global-nav.swa-menu-open .swa-global-nav__links{grid-template-columns:1fr!important}}",
      "@media(max-width:410px){.swa-global-nav__brand{font-size:17px!important}.swa-global-nav__brand-text{max-width:calc(100vw - 216px)!important}.swa-global-nav__sign-in{font-size:15px!important}.swa-global-nav__brand-logo{display:none!important}}"
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
    var signIn = document.createElement("a");
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
    controls.appendChild(signIn);
    inner.appendChild(identity);
    inner.appendChild(crest);
    inner.appendChild(controls);
    inner.appendChild(links);
    inner.appendChild(searchPanel);
    header.appendChild(inner);
    document.body.insertBefore(header, document.body.firstChild);
    document.body.classList.add("swa-has-global-nav");

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
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open Academy menu");
    }

    function closeSearch() {
      header.classList.remove("swa-search-open");
      search.setAttribute("aria-expanded", "false");
    }

    function openMenu() {
      closeSearch();
      header.classList.add("swa-menu-open");
      toggle.setAttribute("aria-expanded", "true");
      toggle.setAttribute("aria-label", "Close Academy menu");
    }

    function openSearch() {
      closeMenu();
      header.classList.add("swa-search-open");
      search.setAttribute("aria-expanded", "true");
      renderSearchResults(searchInput.value);
      searchInput.focus();
    }

    toggle.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();
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
      if (!header.contains(event.target)) {
        closeMenu();
        closeSearch();
      }
    });

    document.addEventListener("keydown", function (event) {
      var target = event.target;
      var isTyping = target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.tagName === "SELECT" || target.isContentEditable);

      if (event.key === "Escape") {
        if (header.classList.contains("swa-search-open")) {
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
