/* Compatibility loader for legacy Skunkworks Academy navigation includes. */
(function () {
  'use strict';
  var version = '2026.08.15.2';
  var canonicalUrl = 'https://skunkworksacademy.com/assets/academy-navigation.js?v=' + version;
  var selector = 'script[data-skunkworks-global-shell-loader="' + version + '"]';

  if (typeof document === 'undefined') return;
  if (document.querySelector(selector)) return;

  var script = document.createElement('script');
  script.defer = true;
  script.src = canonicalUrl;
  script.setAttribute('data-skunkworks-global-shell-loader', version);
  (document.head || document.documentElement).appendChild(script);
})();
