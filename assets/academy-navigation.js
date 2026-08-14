/*
  Compatibility loader for Skunkworks Academy navigation includes.
  Canonical global UI is owned by /assets/skunkworks-ui.js.
*/
(function () {
  "use strict";

  var version = "2026.08.14.1";
  var canonicalUrl = "https://skunkworksacademy.com/assets/skunkworks-ui.js?v=" + version;
  var selector = 'script[data-skunkworks-ui="canonical"]';
  var logoLight = "https://raw.githubusercontent.com/skunkworks-academy/www/refs/heads/main/images/favicon-black.png";
  var logoDark = "https://raw.githubusercontent.com/skunkworks-academy/www/refs/heads/main/images/favicon-white.png";
  var pages = [
    {
      "label": "Home",
      "url": "https://skunkworksacademy.com/",
      "domains": [
        "skunkworksacademy.com",
        "www.skunkworksacademy.com"
      ],
      "description": "Skunkworks Academy home"
    },
    {
      "label": "Learning catalogue",
      "url": "https://skunkworksacademy.com/catalogue/",
      "description": "Self-paced and instructor-led learning"
    },
    {
      "label": "Plans & purchases",
      "url": "https://skunkworksacademy.com/plans-and-purchases/",
      "description": "Training plans and purchases"
    },
    {
      "label": "Learner portal",
      "url": "https://portal.skunkworksacademy.com/",
      "domains": [
        "portal.skunkworksacademy.com"
      ],
      "description": "Your Academy account and learning portal"
    },
    {
      "label": "Labs",
      "url": "https://labs.skunkworksacademy.com/",
      "domains": [
        "labs.skunkworksacademy.com",
        "lab.skunkworksacademy.com"
      ],
      "description": "Hands-on technical labs"
    },
    {
      "label": "Security",
      "url": "https://security.skunkworksacademy.com/",
      "domains": [
        "security.skunkworksacademy.com"
      ],
      "description": "Security learning and services"
    },
    {
      "label": "Microsoft learning",
      "url": "https://microsoft.skunkworksacademy.com/",
      "domains": [
        "microsoft.skunkworksacademy.com"
      ],
      "description": "Microsoft training and certification"
    },
    {
      "label": "IBM learning",
      "url": "https://ibm.skunkworksacademy.com/",
      "domains": [
        "ibm.skunkworksacademy.com"
      ],
      "description": "IBM enterprise training"
    },
    {
      "label": "Badging",
      "url": "https://badging.skunkworksacademy.com/",
      "domains": [
        "badging.skunkworksacademy.com",
        "badge-hub.skunkworksacademy.com"
      ],
      "description": "Digital credentials and badges"
    },
    {
      "label": "Jobs",
      "url": "https://jobs.skunkworksacademy.com/",
      "domains": [
        "jobs.skunkworksacademy.com"
      ],
      "description": "Academy careers and opportunities"
    },
    {
      "label": "Forms",
      "url": "https://skunkworksacademy.com/forms/",
      "description": "Academy forms and requests"
    },
    {
      "label": "Connections",
      "url": "https://portal.skunkworksacademy.com/connections/",
      "description": "Learning connections"
    },
    {
      "label": "Reports",
      "url": "https://portal.skunkworksacademy.com/reports/",
      "description": "Learning reports"
    },
    {
      "label": "Docs",
      "url": "https://docs.skunkworksacademy.com/",
      "domains": [
        "docs.skunkworksacademy.com"
      ],
      "description": "Academy documentation"
    },
    {
      "label": "Publish",
      "url": "https://publish.skunkworksacademy.com/",
      "domains": [
        "publish.skunkworksacademy.com"
      ],
      "description": "Academy publishing"
    },
    {
      "label": "Blog",
      "url": "https://blog.skunkworksacademy.com/",
      "domains": [
        "blog.skunkworksacademy.com"
      ],
      "description": "Academy updates and articles"
    }
  ];

  function isPartnerLandingPage() {
    return /^\/(?:comptia|cisco|redhat)(?:\/|$)/i.test(window.location.pathname);
  }

  function removeLegacyNavigation() {
    if (typeof window === "undefined" || typeof document === "undefined") return;
    if (!isPartnerLandingPage()) return;

    Array.prototype.slice.call(document.querySelectorAll("body > header, body > nav")).forEach(function (node) {
      if (node.classList.contains("swa-global-nav") || node.classList.contains("swa-global-nav__links")) return;
      if (node.hasAttribute("data-sk-preserve-header")) return;
      if (node.parentNode) node.parentNode.removeChild(node);
    });
  }

  function ensureCanonicalLogos() {
    if (typeof document === "undefined") return false;
    var light = document.querySelector(".swa-global-nav .swa-logo-light");
    var dark = document.querySelector(".swa-global-nav .swa-logo-dark");
    if (!light || !dark) return false;

    light.src = logoLight;
    dark.src = logoDark;
    light.alt = "";
    dark.alt = "";
    return true;
  }

  function ensurePartnerPathwayLinks() {
    if (typeof document === "undefined") return false;
    var links = document.querySelector(".swa-global-nav__links");
    if (!links) return false;

    [
      { label: "Partner Pathways", url: "https://skunkworksacademy.com/#partner-pathways" },
      { label: "CompTIA", url: "https://skunkworksacademy.com/comptia/" },
      { label: "Cisco", url: "https://skunkworksacademy.com/cisco/" }
    ].forEach(function (destination) {
      var exists = Array.prototype.some.call(links.querySelectorAll("a"), function (link) {
        return link.href.replace(/\/$/, "") === destination.url.replace(/\/$/, "");
      });
      if (exists) return;

      var link = document.createElement("a");
      link.className = "swa-global-nav__link";
      link.href = destination.url;
      link.textContent = destination.label;
      if (window.location.href.replace(/\/$/, "") === destination.url.replace(/\/$/, "")) {
        link.setAttribute("aria-current", "page");
      }
      links.appendChild(link);
    });

    return true;
  }

  function reconcileNavigation() {
    removeLegacyNavigation();
    ensureCanonicalLogos();
    ensurePartnerPathwayLinks();
  }

  if (typeof window !== "undefined") {
    window.SKUNKWORKS_ACADEMY_NAVIGATION = {
      version: version,
      title: "Skunkworks Academy navigation",
      pages: pages
    };
  }

  if (typeof document === "undefined") return;

  removeLegacyNavigation();

  if (!(window.SkunkworksAcademy && window.SkunkworksAcademy.uiLoaded) && !document.querySelector(selector)) {
    var script = document.createElement("script");
    script.defer = true;
    script.src = canonicalUrl;
    script.setAttribute("data-skunkworks-ui", "canonical");
    script.setAttribute("data-skunkworks-global-nav", "v9");
    script.addEventListener("load", reconcileNavigation, { once: true });
    (document.head || document.documentElement).appendChild(script);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", reconcileNavigation, { once: true });
  } else {
    reconcileNavigation();
  }

  var observer = new MutationObserver(function () {
    reconcileNavigation();
    if (document.querySelector(".swa-global-nav") && ensureCanonicalLogos() && ensurePartnerPathwayLinks()) {
      observer.disconnect();
    }
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });
})();