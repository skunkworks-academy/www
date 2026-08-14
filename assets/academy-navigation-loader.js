/*
  Compatibility loader for legacy Skunkworks Academy navigation includes.
  Canonical global UI is owned by /assets/skunkworks-ui.js.
*/
(function () {
  "use strict";

  var version = "2026.08.14.2";
  var canonicalUrl = "https://skunkworksacademy.com/assets/skunkworks-ui.js?v=" + version;
  var selector = 'script[data-skunkworks-ui="canonical"]';
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
  script.setAttribute("data-skunkworks-global-nav", "v9");

  (document.head || document.documentElement).appendChild(script);
})();
