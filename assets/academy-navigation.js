/*
  Compatibility loader for legacy Skunkworks Academy navigation includes.
  Canonical global UI is owned by /assets/skunkworks-ui.js.
*/
(function () {
  "use strict";

  var version = "2026.07.07.1";
  var canonicalUrl = "https://skunkworksacademy.com/assets/skunkworks-ui.js?v=" + version;
  var selector = 'script[data-skunkworks-ui="canonical"]';
  var pages = [
    { label: "Home", domain: "skunkworksacademy.com", url: "https://skunkworksacademy.com/", verified: true },
    { label: "Plans & Purchases", domain: "skunkworksacademy.com", url: "https://skunkworksacademy.com/plans-and-purchases/", verified: true },
    { label: "Secure Checkout", domain: "portal.skunkworksacademy.com", url: "https://portal.skunkworksacademy.com/checkout/", verified: true },
    { label: "AI Learning", domain: "skunkworksacademy.com", url: "https://skunkworksacademy.com/#new-way-to-learn", verified: true },
    { label: "Self-paced", domain: "skunkworksacademy.com", url: "https://skunkworksacademy.com/self-paced/", verified: true },
    { label: "Portal", domain: "portal.skunkworksacademy.com", url: "https://portal.skunkworksacademy.com/", verified: true },
    { label: "Labs", domain: "lab.skunkworksacademy.com", url: "https://lab.skunkworksacademy.com/", aliases: ["labs.skunkworksacademy.com"], verified: true },
    { label: "Forms", domain: "skunkworksacademy.com", url: "https://skunkworksacademy.com/forms/", verified: true },
    { label: "Badging", domain: "badging.skunkworksacademy.com", url: "https://badging.skunkworksacademy.com/", verified: true },
    { label: "Jobs", domain: "jobs.skunkworksacademy.com", url: "https://jobs.skunkworksacademy.com/", verified: true },
    { label: "Media", domain: "media.skunkworksacademy.com", url: "https://media.skunkworksacademy.com/", verified: true },
    { label: "Security", domain: "security.skunkworksacademy.com", url: "https://security.skunkworksacademy.com/", verified: true },
    { label: "IBM", domain: "ibm.skunkworksacademy.com", url: "https://ibm.skunkworksacademy.com/", verified: true }
  ];

  if (typeof window !== "undefined") {
    window.SKUNKWORKS_ACADEMY_NAVIGATION = {
      version: version,
      title: "Skunkworks Academy navigation",
      statusLabel: "Verified domains",
      pages: pages
    };
  }

  if (typeof window !== "undefined" && window.SkunkworksAcademy && window.SkunkworksAcademy.uiLoaded) return;
  if (typeof document === "undefined") return;
  if (document.querySelector(selector)) return;

  var script = document.createElement("script");
  script.defer = true;
  script.src = canonicalUrl;
  script.setAttribute("data-skunkworks-ui", "canonical");
  script.setAttribute("data-skunkworks-global-nav", "v6");

  (document.head || document.documentElement).appendChild(script);
})();
