(() => {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.main-nav');
  toggle?.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  document.addEventListener('click', event => {
    if (!event.target.closest('.nav-wrap')) {
      nav?.classList.remove('open');
      toggle?.setAttribute('aria-expanded', 'false');
    }
  });
  const input = document.querySelector('[data-site-search]');
  const searchable = [...document.querySelectorAll('[data-search]')];
  input?.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    searchable.forEach(card => {
      const hay = `${card.textContent} ${card.dataset.search || ''}`.toLowerCase();
      card.style.display = !q || hay.includes(q) ? '' : 'none';
    });
  });
})();
