(() => {
  'use strict';

  const ADSENSE_CLIENT = 'ca-pub-9270041066336676';
  const localHosts = new Set(['localhost', '127.0.0.1', '[::1]']);

  const navToggle = document.querySelector('[data-nav-toggle]');
  const nav = document.querySelector('[data-primary-nav]');
  navToggle?.addEventListener('click', () => {
    const open = nav?.classList.toggle('open') ?? false;
    navToggle.setAttribute('aria-expanded', String(open));
  });

  function canLoadAdsense() {
    return window.location.protocol === 'https:' && !localHosts.has(window.location.hostname);
  }

  function loadAdsenseForEligiblePublisherContent() {
    const inventory = document.body.dataset.adInventory;
    document.documentElement.dataset.adInventory = inventory || 'unclassified';

    if (inventory !== 'eligible' || !canLoadAdsense()) return;
    if (document.querySelector('script[data-skunkworks-adsense]')) return;

    /*
     * Consent for EEA, UK and Switzerland traffic must be collected by a
     * Google-certified CMP configured in AdSense Privacy & messaging. The
     * AdSense tag must be present on a live HTTPS publisher page so that
     * Google's CMP and regional ad-serving controls can operate. This file
     * deliberately does not invent or simulate IAB TCF consent strings.
     */
    const script = document.createElement('script');
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.dataset.skunkworksAdsense = 'true';
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`;
    document.head.appendChild(script);
  }

  loadAdsenseForEligiblePublisherContent();
})();
