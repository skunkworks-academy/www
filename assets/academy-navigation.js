/*
  Compatibility loader for Skunkworks Academy navigation includes.
  Canonical global UI is owned by /assets/skunkworks-ui.js.
*/
(function () {
  "use strict";

  var version = "2026.07.17.5";
  var canonicalUrl = "https://skunkworksacademy.com/assets/skunkworks-ui.js?v=" + version;
  var selector = 'script[data-skunkworks-ui="canonical"]';
  var pages = [
    { label: "Home", url: "https://skunkworksacademy.com/" },
    { label: "Plans & Purchases", url: "https://skunkworksacademy.com/plans-and-purchases/" },
    { label: "Secure Checkout", url: "https://portal.skunkworksacademy.com/checkout/" },
    { label: "Forms", url: "https://skunkworksacademy.com/forms/" },
    { label: "Self-Paced Catalogue", url: "https://skunkworksacademy.com/catalogue/" },
    { label: "Learner Portal", url: "https://portal.skunkworksacademy.com/" },
    { label: "Labs", url: "https://labs.skunkworksacademy.com/" },
    { label: "Security", url: "https://security.skunkworksacademy.com/" },
    { label: "Partner Pathways", url: "https://skunkworksacademy.com/#partner-pathways" },
    { label: "CompTIA", url: "https://skunkworksacademy.com/comptia/" },
    { label: "Cisco", url: "https://skunkworksacademy.com/cisco/" },
    { label: "IBM", url: "https://ibm.skunkworksacademy.com/" },
    { label: "Badging", url: "https://badging.skunkworksacademy.com/" },
    { label: "Jobs", url: "https://jobs.skunkworksacademy.com/" },
    { label: "Connections", url: "https://portal.skunkworksacademy.com/connections/" },
    { label: "Reports", url: "https://portal.skunkworksacademy.com/reports/" },
    { label: "Docs", url: "https://docs.skunkworksacademy.com/" },
    { label: "Publish", url: "https://publish.skunkworksacademy.com/" },
    { label: "Blog", url: "https://blog.skunkworksacademy.com/" }
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
    script.setAttribute("data-skunkworks-global-nav", "v8");
    (document.head || document.documentElement).appendChild(script);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", reconcileNavigation, { once: true });
  } else {
    reconcileNavigation();
  }

  var observer = new MutationObserver(function () {
    reconcileNavigation();
    if (document.querySelector(".swa-global-nav") && ensurePartnerPathwayLinks()) {
      observer.disconnect();
    }
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });
})();
