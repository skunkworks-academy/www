(() => {
  'use strict';
  function createElement(tag, className, text) { const element = document.createElement(tag); if (className) element.className = className; if (text !== undefined) element.textContent = text; return element; }
  const uniqueSorted = (items) => [...new Set(items)].sort((a, b) => a.localeCompare(b));
  function option(value) { const item = document.createElement('option'); item.value = value; item.textContent = value; return item; }
  function normaliseCourse(fields, row) {
    const course = Object.fromEntries(fields.map((field, index) => [field, row[index]]));
    course.description = course.deliveryMode === 'Self-Paced'
      ? `A structured self-paced learning journey for ${course.title}, including guided theory, practical labs, assessment and evidence of capability.`
      : `A facilitator-led practical course for ${course.title}, including demonstrations, guided labs, assessment and evidence of capability.`;
    course.enrollUrl = `https://portal.skunkworksacademy.com/checkout/?courseId=${encodeURIComponent(course.courseId)}`;
    return course;
  }
  function buildCard(course) {
    const card = createElement('article', 'card');
    const tags = createElement('div', 'tags');
    [course.category, course.level, course.estimatedEffort].forEach((value) => tags.appendChild(createElement('span', 'tag', value)));
    const actions = createElement('div', 'card-actions');
    const open = createElement('a', 'btn primary', 'Open course'); open.href = course.courseUrl;
    const enrol = createElement('a', 'btn', 'Register or enrol'); enrol.href = course.enrollUrl;
    actions.append(open, enrol);
    card.append(createElement('p', 'eyebrow', `${course.courseId} · ${course.deliveryMode}`), createElement('h3', '', course.title), createElement('p', '', course.description), tags, actions);
    return card;
  }
  async function initialise(root) {
    const deliveryMode = root.dataset.deliveryMode;
    const grid = root.querySelector('[data-course-grid]');
    const search = root.querySelector('[data-course-search]');
    const category = root.querySelector('[data-course-category]');
    const level = root.querySelector('[data-course-level]');
    const result = root.querySelector('[data-course-results]');
    const empty = root.querySelector('[data-course-empty]');
    try {
      if (!window.SKUNKWORKS_COURSE_CATALOG_PROMISE) throw new Error('Generated course catalogue was not loaded.');
      const payload = await window.SKUNKWORKS_COURSE_CATALOG_PROMISE;
      const courses = payload.courses.map((row) => normaliseCourse(payload.fields, row)).filter((course) => course.deliveryMode === deliveryMode);
      uniqueSorted(courses.map((course) => course.category)).forEach((value) => category.appendChild(option(value)));
      uniqueSorted(courses.map((course) => course.level)).forEach((value) => level.appendChild(option(value)));
      document.querySelectorAll('[data-catalog-count]').forEach((node) => { node.textContent = String(courses.length); });
      document.querySelectorAll('[data-category-count]').forEach((node) => { node.textContent = String(uniqueSorted(courses.map((course) => course.category)).length); });
      function render() {
        const needle = search.value.trim().toLowerCase();
        const visible = courses.filter((course) => `${course.courseId} ${course.title} ${course.category} ${course.level} ${course.description}`.toLowerCase().includes(needle) && (!category.value || course.category === category.value) && (!level.value || course.level === level.value));
        grid.replaceChildren(...visible.map(buildCard));
        result.textContent = `${visible.length} of ${courses.length} courses shown`;
        empty.hidden = visible.length !== 0;
      }
      search.addEventListener('input', render); category.addEventListener('change', render); level.addEventListener('change', render); render();
    } catch (error) {
      result.textContent = 'The course catalogue could not be loaded.'; empty.hidden = false; empty.textContent = 'Course data is temporarily unavailable. Use the learner portal or contact Skunkworks Academy training support.'; console.error(error);
    }
  }
  document.addEventListener('DOMContentLoaded', () => document.querySelectorAll('[data-course-catalog]').forEach(initialise));
})();
