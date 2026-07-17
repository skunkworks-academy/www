/*
  Compatibility loader for Skunkworks Academy navigation includes.
  Canonical global UI is owned by /assets/skunkworks-ui.js.
*/
(function () {
  "use strict";

  var version = "2026.07.17.4";
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
    { label: "IBM", url: "https://ibm.skunkworksacademy.com/" },
    { label: "Badging", url: "https://badging.skunkworksacademy.com/" },
    { label: "Jobs", url: "https://jobs.skunkworksacademy.com/" },
    { label: "Connections", url: "https://portal.skunkworksacademy.com/connections/" },
    { label: "Reports", url: "https://portal.skunkworksacademy.com/reports/" },
    { label: "Docs", url: "https://docs.skunkworksacademy.com/" },
    { label: "Publish", url: "https://publish.skunkworksacademy.com/" },
    { label: "Blog", url: "https://blog.skunkworksacademy.com/" }
  ];

  function removeRedHatLegacyNavigation() {
    if (typeof window === "undefined" || typeof document === "undefined") return;
    if (!/^\/redhat(?:\/|$)/i.test(window.location.pathname)) return;

    Array.prototype.slice.call(document.querySelectorAll("body > header, body > nav")).forEach(function (node) {
      if (node.classList.contains("swa-global-nav") || node.classList.contains("swa-global-nav__links")) return;
      if (node.parentNode) node.parentNode.removeChild(node);
    });
  }

  if (typeof window !== "undefined") {
    window.SKUNKWORKS_ACADEMY_NAVIGATION = {
      version: version,
      title: "Skunkworks Academy navigation",
      pages: pages
    };
  }

  if (typeof window !== "undefined" && window.SkunkworksAcademy && window.SkunkworksAcademy.uiLoaded) return;
  if (typeof document === "undefined" || document.querySelector(selector)) return;

  removeRedHatLegacyNavigation();

  var script = document.createElement("script");
  script.defer = true;
  script.src = canonicalUrl;
  script.setAttribute("data-skunkworks-ui", "canonical");
  script.setAttribute("data-skunkworks-global-nav", "v7");
  (document.head || document.documentElement).appendChild(script);
})();