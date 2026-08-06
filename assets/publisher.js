(() => {
  'use strict';

  const CONSENT_KEY = 'skunkworks-academy-cookie-consent-v1';
  const ADSENSE_CLIENT = 'ca-pub-9270041066336676';

  const navToggle = document.querySelector('[data-nav-toggle]');
  const nav = document.querySelector('[data-primary-nav]');
  navToggle?.addEventListener('click', () => {
    const open = nav?.classList.toggle('open') ?? false;
    navToggle.setAttribute('aria-expanded', String(open));
  });

  function getConsent() {
    try { return JSON.parse(localStorage.getItem(CONSENT_KEY) || 'null'); }
    catch { return null; }
  }

  function setConsent(value) {
    localStorage.setItem(CONSENT_KEY, JSON.stringify({ value, updatedAt: new Date().toISOString() }));
  }

  function loadAdsense() {
    if (document.querySelector('script[data-skunkworks-adsense]')) return;
    const inventory = document.body.dataset.adInventory;
    const consent = getConsent();
    if (inventory !== 'eligible' || consent?.value !== 'accepted') return;

    const script = document.createElement('script');
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.dataset.skunkworksAdsense = 'true';
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`;
    document.head.appendChild(script);
  }

  function renderConsentBanner() {
    if (getConsent()) {
      loadAdsense();
      return;
    }

    const banner = document.createElement('section');
    banner.className = 'cookie-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Cookie preferences');
    banner.innerHTML = `
      <strong>Cookie preferences</strong>
      <p>We use essential storage for site operation. Optional advertising cookies are loaded only on eligible content pages after consent. See our <a href="/privacy.html">Privacy Policy</a> and <a href="/cookie-policy.html">Cookie Policy</a>.</p>
      <div class="cookie-actions">
        <button type="button" class="accept" data-consent="accepted">Accept optional cookies</button>
        <button type="button" data-consent="rejected">Use essential only</button>
      </div>`;

    banner.addEventListener('click', (event) => {
      const button = event.target.closest('[data-consent]');
      if (!button) return;
      setConsent(button.dataset.consent);
      banner.remove();
      loadAdsense();
    });

    document.body.appendChild(banner);
  }

  renderConsentBanner();
})();
