(() => {
  'use strict';

  const VERSION = '2026.08.16.1';
  const SHELL_URL = `https://skunkworksacademy.com/assets/skunkworks-shell.js?v=${VERSION}`;

  const destinations = Object.freeze({
    home: 'https://skunkworksacademy.com/',
    catalogue: 'https://skunkworksacademy.com/catalogue/',
    selfPaced: 'https://skunkworksacademy.com/self-paced/',
    instructorLed: 'https://skunkworksacademy.com/instructor-led/',
    plans: 'https://skunkworksacademy.com/plans-and-purchases/',
    portal: 'https://portal.skunkworksacademy.com/',
    labs: 'https://labs.skunkworksacademy.com/',
    security: 'https://security.skunkworksacademy.com/',
    microsoft: 'https://microsoft.skunkworksacademy.com/',
    ibm: 'https://ibm.skunkworksacademy.com/',
    badging: 'https://badging.skunkworksacademy.com/',
    jobs: 'https://jobs.skunkworksacademy.com/',
    forms: 'https://skunkworksacademy.com/forms/',
    docs: 'https://docs.skunkworksacademy.com/',
    publish: 'https://publish.skunkworksacademy.com/',
    blog: 'https://blog.skunkworksacademy.com/'
  });

  window.SKUNKWORKS_ACADEMY_NAVIGATION = Object.freeze({
    version: VERSION,
    destinations,
    shell: SHELL_URL
  });

  if (window.__SKUNKWORKS_ACADEMY_SHELL_LOADER__ === VERSION) return;
  window.__SKUNKWORKS_ACADEMY_SHELL_LOADER__ = VERSION;

  const load = () => {
    const existing = document.querySelector('script[data-skunkworks-shell-runtime]');
    if (existing?.dataset.skunkworksShellRuntime === VERSION) return;
    if (existing) existing.remove();

    const script = document.createElement('script');
    script.src = SHELL_URL;
    script.defer = true;
    script.dataset.skunkworksShellRuntime = VERSION;
    script.crossOrigin = 'anonymous';
    document.head.appendChild(script);
  };

  if (document.head) load();
  else document.addEventListener('DOMContentLoaded', load, { once: true });
})();
