(function () {
  "use strict";

  var canonicalUrl = "https://skunkworksacademy.com/assets/academy-navigation.js?v=2026.07.05";
  var selector = 'script[data-skunkworks-global-nav]';
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

  if (typeof window !== "undefined") {
    window.SKUNKWORKS_ACADEMY_NAVIGATION = {
      version: "2026.07.05",
      title: "Skunkworks Academy navigation",
      statusLabel: "Verified domains",
      pages: pages
    };
  }

  if (typeof document === "undefined") return;
  if (document.querySelector(selector)) return;

  var script = document.createElement("script");
  script.defer = true;
  script.src = canonicalUrl;
  script.setAttribute("data-skunkworks-global-nav", "v4");

  (document.head || document.documentElement).appendChild(script);
})();
