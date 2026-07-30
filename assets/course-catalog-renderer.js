(() => {
  'use strict';

  const GENERATED_CATALOG_URL = '/assets/course-catalog.generated.js';
  const PAKO_URL = 'https://cdn.jsdelivr.net/npm/pako@2.1.0/dist/pako.min.js';
  let pakoPromise;

  function createElement(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  }

  const uniqueSorted = (items) => [...new Set(items.filter(Boolean))].sort((a, b) => a.localeCompare(b));

  function option(value) {
    const item = document.createElement('option');
    item.value = value;
    item.textContent = value;
    return item;
  }

  function normaliseText(value) {
    return String(value ?? '')
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, ' ')
      .trim();
  }

  function normaliseCourse(fields, row) {
    const course = Array.isArray(row)
      ? Object.fromEntries(fields.map((field, index) => [field, row[index]]))
      : { ...row };

    course.courseId = String(course.courseId ?? '').trim();
    course.title = String(course.title ?? 'Untitled course').trim();
    course.category = String(course.category ?? 'General').trim();
    course.level = String(course.level ?? 'Not specified').trim();
    course.estimatedEffort = String(course.estimatedEffort ?? 'Flexible').trim();
    course.deliveryMode = String(course.deliveryMode ?? '').trim();
    course.courseUrl = String(course.courseUrl ?? '#').trim();
    course.description = course.description || (course.deliveryMode === 'Self-Paced'
      ? `A structured self-paced learning journey for ${course.title}, including guided theory, practical labs, assessment and evidence of capability.`
      : `A facilitator-led practical course for ${course.title}, including demonstrations, guided labs, assessment and evidence of capability.`);
    course.enrollUrl = `https://portal.skunkworksacademy.com/checkout/?courseId=${encodeURIComponent(course.courseId)}`;
    course.searchText = normaliseText([
      course.courseId,
      course.title,
      course.category,
      course.level,
      course.estimatedEffort,
      course.deliveryMode,
      course.description,
      course.keywords,
      course.courseUrl
    ].join(' '));
    return course;
  }

  function validatePayload(payload) {
    if (!payload || !Array.isArray(payload.fields) || !Array.isArray(payload.courses)) {
      throw new TypeError('Course catalogue payload is malformed.');
    }
    if (!payload.fields.includes('courseId') || !payload.fields.includes('title') || !payload.fields.includes('deliveryMode')) {
      throw new TypeError('Course catalogue payload is missing required fields.');
    }
    return payload;
  }

  function buildCard(course) {
    const card = createElement('article', 'card');
    const tags = createElement('div', 'tags');
    [course.category, course.level, course.estimatedEffort]
      .filter(Boolean)
      .forEach((value) => tags.appendChild(createElement('span', 'tag', value)));

    const actions = createElement('div', 'card-actions');
    const open = createElement('a', 'btn primary', 'Open course');
    open.href = course.courseUrl;
    const enrol = createElement('a', 'btn', 'Register or enrol');
    enrol.href = course.enrollUrl;
    actions.append(open, enrol);

    card.append(
      createElement('p', 'eyebrow', `${course.courseId} · ${course.deliveryMode}`),
      createElement('h3', '', course.title),
      createElement('p', '', course.description),
      tags,
      actions
    );
    return card;
  }

  function loadPako() {
    if (window.pako?.ungzip) return Promise.resolve(window.pako);
    if (pakoPromise) return pakoPromise;

    pakoPromise = new Promise((resolve, reject) => {
      const existing = document.querySelector('script[data-course-catalog-pako]');
      if (existing) {
        existing.addEventListener('load', () => resolve(window.pako), { once: true });
        existing.addEventListener('error', () => reject(new Error('The catalogue decompression fallback could not be loaded.')), { once: true });
        return;
      }

      const script = document.createElement('script');
      script.src = PAKO_URL;
      script.defer = true;
      script.crossOrigin = 'anonymous';
      script.dataset.courseCatalogPako = 'true';
      script.onload = () => window.pako?.ungzip
        ? resolve(window.pako)
        : reject(new Error('The catalogue decompression fallback did not initialise.'));
      script.onerror = () => reject(new Error('The catalogue decompression fallback could not be loaded.'));
      document.head.appendChild(script);
    });

    return pakoPromise;
  }

  async function decompressWithNativeStream(compressed) {
    if (typeof window.DecompressionStream !== 'function') {
      throw new Error('The browser does not support DecompressionStream.');
    }
    const stream = new Blob([compressed]).stream().pipeThrough(new DecompressionStream('gzip'));
    return new Response(stream).text();
  }

  async function recoverGeneratedPayload() {
    const response = await fetch(`${GENERATED_CATALOG_URL}?recovery=2026.07.30.1`, {
      cache: 'reload',
      credentials: 'same-origin'
    });
    if (!response.ok) throw new Error(`Generated catalogue asset returned HTTP ${response.status}.`);

    const source = await response.text();
    const match = source.match(/const\s+encoded\s*=\s*['"]([A-Za-z0-9+/=]+)['"]/);
    if (!match) throw new Error('Generated catalogue data could not be located in the asset.');

    const compressed = Uint8Array.from(atob(match[1]), (character) => character.charCodeAt(0));
    let json;

    try {
      json = await decompressWithNativeStream(compressed);
    } catch (nativeError) {
      console.warn('Native catalogue decompression failed; using the compatibility fallback.', nativeError);
      const pako = await loadPako();
      json = pako.ungzip(compressed, { to: 'string' });
    }

    return validatePayload(JSON.parse(json));
  }

  async function loadCatalogPayload() {
    if (window.SKUNKWORKS_COURSE_CATALOG_PROMISE) {
      try {
        return validatePayload(await window.SKUNKWORKS_COURSE_CATALOG_PROMISE);
      } catch (error) {
        console.warn('Primary course catalogue loader failed; attempting recovery.', error);
      }
    } else {
      console.warn('Primary course catalogue loader was not present; attempting recovery.');
    }

    return recoverGeneratedPayload();
  }

  function syncQueryString(search, category, level) {
    const url = new URL(window.location.href);
    const values = {
      q: search.value.trim(),
      category: category.value,
      level: level.value
    };

    for (const [key, value] of Object.entries(values)) {
      if (value) url.searchParams.set(key, value);
      else url.searchParams.delete(key);
    }
    window.history.replaceState(null, '', url);
  }

  function applyQueryString(search, category, level) {
    const params = new URLSearchParams(window.location.search);
    search.value = params.get('q') ?? '';
    category.value = params.get('category') ?? '';
    level.value = params.get('level') ?? '';
  }

  async function initialise(root) {
    const deliveryMode = root.dataset.deliveryMode;
    const grid = root.querySelector('[data-course-grid]');
    const search = root.querySelector('[data-course-search]');
    const category = root.querySelector('[data-course-category]');
    const level = root.querySelector('[data-course-level]');
    const result = root.querySelector('[data-course-results]');
    const empty = root.querySelector('[data-course-empty]');

    if (!grid || !search || !category || !level || !result || !empty) {
      console.error('Course catalogue markup is incomplete.', root);
      return;
    }

    search.disabled = true;
    category.disabled = true;
    level.disabled = true;
    result.textContent = 'Loading course catalogue…';

    try {
      const payload = await loadCatalogPayload();
      const courses = payload.courses
        .map((row) => normaliseCourse(payload.fields, row))
        .filter((course) => course.deliveryMode === deliveryMode)
        .sort((a, b) => a.title.localeCompare(b.title));

      if (!courses.length) throw new Error(`No ${deliveryMode} courses were found in the catalogue.`);

      uniqueSorted(courses.map((course) => course.category)).forEach((value) => category.appendChild(option(value)));
      uniqueSorted(courses.map((course) => course.level)).forEach((value) => level.appendChild(option(value)));

      document.querySelectorAll('[data-catalog-count]').forEach((node) => { node.textContent = String(courses.length); });
      document.querySelectorAll('[data-category-count]').forEach((node) => {
        node.textContent = String(uniqueSorted(courses.map((course) => course.category)).length);
      });

      applyQueryString(search, category, level);
      search.disabled = false;
      category.disabled = false;
      level.disabled = false;

      function render() {
        const tokens = normaliseText(search.value).split(' ').filter(Boolean);
        const visible = courses.filter((course) => {
          const textMatches = tokens.every((token) => course.searchText.includes(token));
          const categoryMatches = !category.value || course.category === category.value;
          const levelMatches = !level.value || course.level === level.value;
          return textMatches && categoryMatches && levelMatches;
        });

        grid.replaceChildren(...visible.map(buildCard));
        result.textContent = `${visible.length} of ${courses.length} courses shown`;
        empty.hidden = visible.length !== 0;
        empty.textContent = visible.length === 0
          ? 'No courses match the current search and filters. Clear one or more filters and try again.'
          : '';
        syncQueryString(search, category, level);
      }

      search.addEventListener('input', render);
      category.addEventListener('change', render);
      level.addEventListener('change', render);
      render();
    } catch (error) {
      search.disabled = false;
      result.textContent = 'The course catalogue could not be loaded.';
      empty.hidden = false;
      empty.textContent = 'Course data is temporarily unavailable. Refresh the page or use the learner portal while the catalogue service is restored.';
      console.error('Course catalogue initialisation failed.', error);
    }
  }

  function start() {
    document.querySelectorAll('[data-course-catalog]').forEach(initialise);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
