/*
  Compatibility loader for legacy Skunkworks Academy navigation includes.
  The canonical global UI is owned by /assets/skunkworks-ui.js.
*/
(function () {
  "use strict";

  var version = "2026.07.06.2";
  var canonicalUrl = "https://skunkworksacademy.com/assets/skunkworks-ui.js?v=" + version;
  var selector = 'script[data-skunkworks-ui="canonical"]';

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
