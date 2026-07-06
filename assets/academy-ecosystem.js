/* Legacy Academy ecosystem helper. Public navigation is consolidated in skunkworks-ui.js. */
(function () {
  "use strict";

  var version = "2026.07.07.1";

  function ensureCanonicalUi() {
    if (window.SkunkworksAcademy && window.SkunkworksAcademy.uiLoaded) return;
    if (document.querySelector('script[data-skunkworks-ui="canonical"]')) return;
    var script = document.createElement("script");
    script.defer = true;
    script.src = "https://skunkworksacademy.com/assets/skunkworks-ui.js?v=" + version;
    script.setAttribute("data-skunkworks-ui", "canonical");
    script.setAttribute("data-skunkworks-global-nav", "v6");
    (document.head || document.documentElement).appendChild(script);
  }

  function bindLegacySearch() {
    var input = document.querySelector("[data-site-search]");
    if (!input) return;
    var searchable = Array.prototype.slice.call(document.querySelectorAll("[data-search]"));
    input.addEventListener("input", function () {
      var query = input.value.trim().toLowerCase();
      searchable.forEach(function (card) {
        var haystack = (card.textContent + " " + (card.getAttribute("data-search") || "")).toLowerCase();
        card.style.display = !query || haystack.indexOf(query) !== -1 ? "" : "none";
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      ensureCanonicalUi();
      bindLegacySearch();
    }, { once: true });
  } else {
    ensureCanonicalUi();
    bindLegacySearch();
  }
})();
