/* Root alias for the Skunkworks Academy shared UI behaviours. */
(function () {
  const root = document.documentElement;
  const nav = document.querySelector('[data-sk-nav]');
  const navToggle = document.querySelector('[data-sk-nav-toggle]');
  const themeToggle = document.querySelector('[data-sk-theme-toggle]');
  const yearNodes = document.querySelectorAll('[data-sk-year]');

  yearNodes.forEach((node) => {
    node.textContent = new Date().getFullYear();
  });

  if (nav && navToggle) {
    navToggle.addEventListener('click', () => {
      const isOpen = nav.getAttribute('data-open') === 'true';
      nav.setAttribute('data-open', String(!isOpen));
      navToggle.setAttribute('aria-expanded', String(!isOpen));
    });
  }

  const storedTheme = window.localStorage.getItem('skunkworks-theme');
  if (storedTheme) {
    root.setAttribute('data-theme', storedTheme);
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = root.getAttribute('data-theme') || 'light';
      const next = current === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      window.localStorage.setItem('skunkworks-theme', next);
      themeToggle.setAttribute('aria-label', `Switch to ${current} mode`);
    });
  }

  document.querySelectorAll('form[data-sk-validate]').forEach((form) => {
    form.addEventListener('submit', (event) => {
      if (!form.checkValidity()) {
        event.preventDefault();
        form.classList.add('sk-form--invalid');
        const firstInvalid = form.querySelector(':invalid');
        if (firstInvalid) firstInvalid.focus();
      }
    });
  });
})();
