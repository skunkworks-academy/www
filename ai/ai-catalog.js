(function () {
  'use strict';
  const root = document.querySelector('.ai-directory');
  if (!root) return;
  const search = root.querySelector('#ai-search');
  const category = root.querySelector('#ai-category');
  const delivery = root.querySelector('#ai-delivery');
  const level = root.querySelector('#ai-level');
  const reset = root.querySelector('#ai-reset');
  const grid = root.querySelector('#ai-results');
  const count = root.querySelector('#ai-results-count');
  const empty = root.querySelector('#ai-empty');
  const error = root.querySelector('#ai-error');
  const resourceList = root.querySelector('#ai-resources-list');
  let courses = [];
  const availableHosts = new Set(['www.skunkworksacademy.com', 'skunkworksacademy.com', 'portal.skunkworksacademy.com', 'marketing.skunkworksacademy.com', 'security.skunkworksacademy.com', 'github.com']);
  function safeUrl(value) {
    try {
      const url = new URL(String(value), window.location.href);
      return url.protocol === 'https:' && availableHosts.has(url.hostname) ? url.href : null;
    } catch (_) { return null; }
  }
  function element(tag, className, content) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (content !== undefined) node.textContent = String(content);
    return node;
  }
  function anchor(title, url, className) {
    const safe = safeUrl(url);
    if (!safe) return null;
    const a = element('a', className, title);
    a.href = safe;
    if (new URL(safe).origin !== window.location.origin) {
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
    }
    return a;
  }
  function renderCard(course) {
    const card = element('article', 'ai-course-card');
    const top = element('div', 'ai-card-top');
    top.append(element('span', 'ai-pill', course.courseCode || 'Learning resource'));
    top.append(element('span', 'ai-pill ai-pill-review', course.enrolmentStatus === 'portal-allowlisted' ? 'Portal listed' : 'Review / enquiry'));
    card.append(top, element('h3', '', course.title));
    const meta = element('div', 'ai-meta');
    for (const value of [course.category, course.level, course.deliveryMode, course.duration]) {
      if (value) meta.append(element('span', 'ai-pill', value));
    }
    card.append(meta);
    if (course.possibleDuplicateGroup) card.append(element('p', 'ai-source', 'Related course variant — comparison pending.'));
    const status = course.kind === 'generated-foundation' ? 'Generated foundation curriculum; subject-matter review required.' : (course.reviewStatus || '').replaceAll('-', ' ');
    card.append(element('p', 'ai-source', status + ' Live delivery has not been verified.'));
    const links = element('div', 'ai-card-actions');
    const overview = anchor('View course overview / source', course.overviewUrl);
    const source = anchor('GitHub source', course.sourceUrl);
    if (overview) links.append(overview);
    if (source && source.href !== overview?.href) links.append(source);
    if (course.enrolmentStatus === 'portal-allowlisted' && course.checkoutUrl) {
      const checkout = anchor('Portal checkout', course.checkoutUrl, 'ai-checkout');
      if (checkout) links.append(checkout);
    } else {
      const subject = encodeURIComponent('AI course enquiry: ' + course.title + (course.courseCode ? ' (' + course.courseCode + ')' : ''));
      const enquiry = element('a', '', 'Request information');
      enquiry.href = 'mailto:training@skunkworks.africa?subject=' + subject;
      links.append(enquiry);
    }
    card.append(links);
    return card;
  }
  function options(select, values) {
    for (const value of [...new Set(values.filter(Boolean))].sort((a, b) => a.localeCompare(b))) {
      const option = element('option', '', value);
      option.value = value;
      select.append(option);
    }
  }
  function updateUrl() {
    const url = new URL(window.location.href);
    for (const [key, value] of [['q', search.value.trim()], ['category', category.value], ['delivery', delivery.value], ['level', level.value]]) {
      if (value) url.searchParams.set(key, value);
      else url.searchParams.delete(key);
    }
    window.history.replaceState(null, '', url.pathname + url.search + url.hash);
  }
  function render() {
    const q = search.value.toLocaleLowerCase().trim();
    const filtered = courses.filter(course => {
      const content = [course.title, course.courseCode, course.category, course.level, course.deliveryMode, course.kind].join(' ').toLocaleLowerCase();
      return (!q || content.includes(q)) && (!category.value || course.category === category.value) && (!delivery.value || course.deliveryMode === delivery.value) && (!level.value || course.level === level.value);
    });
    const fragment = document.createDocumentFragment();
    for (const course of filtered) fragment.append(renderCard(course));
    grid.replaceChildren(fragment);
    grid.setAttribute('aria-busy', 'false');
    count.textContent = String(filtered.length) + ' of ' + String(courses.length) + ' AI-related course entries';
    empty.hidden = filtered.length > 0;
    updateUrl();
  }
  function renderResources(resources) {
    const fragment = document.createDocumentFragment();
    for (const resource of resources || []) {
      const li = element('li');
      const link = anchor(resource.title + ' (' + resource.kind.replaceAll('-', ' ') + ')', resource.url);
      if (link) { li.append(link); fragment.append(li); }
    }
    if (fragment.childNodes.length) resourceList.replaceChildren(fragment);
  }
  Promise.resolve().then(async () => {
    const response = await fetch('/ai/ai-master-catalog.json', {cache: 'no-store'});
    if (!response.ok) throw new Error('AI catalogue HTTP ' + response.status);
    const data = await response.json();
    if (data.schema !== 'skunkworks-academy/ai-master-catalog/v1' || !Array.isArray(data.courses)) throw new Error('Unrecognised AI catalogue');
    courses = data.courses;
    options(category, courses.map(c => c.category));
    options(delivery, courses.map(c => c.deliveryMode));
    options(level, courses.map(c => c.level));
    const params = new URLSearchParams(window.location.search);
    search.value = params.get('q') || '';
    category.value = params.get('category') || '';
    delivery.value = params.get('delivery') || '';
    level.value = params.get('level') || '';
    renderResources(data.resources);
    render();
    for (const field of [search, category, delivery, level]) field.addEventListener(field === search ? 'input' : 'change', render);
    reset.addEventListener('click', () => { search.value = ''; category.value = ''; delivery.value = ''; level.value = ''; render(); search.focus(); });
  }).catch(() => {
    grid.setAttribute('aria-busy', 'false');
    count.textContent = 'Catalogue temporarily unavailable';
    error.hidden = false;
  });
})();
