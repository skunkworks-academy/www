const COURSE_KEY = 'd365-ce-bp-101-progress-v1';
const ENROL_KEY = 'd365-ce-bp-101-enrolment-v1';

const modules = [
  {
    id: 'm1',
    title: 'Course orientation and Customer Engagement extension model',
    outcome: 'Explain where Dynamics 365 Customer Engagement custom development fits across tables, forms, business logic, integration services and ISV packaging.',
    tasks: ['Identify customization types', 'Map code-based versus configuration-based changes', 'Describe the risk of unsupported customization']
  },
  {
    id: 'm2',
    title: 'Performance engineering fundamentals',
    outcome: 'Apply performance practices for bulk operations, service calls, GUID creation, query scope and unnecessary processing.',
    tasks: ['Use multiple worker threads safely', 'Let the platform create identifiers where possible', 'Limit columns, records and service round trips']
  },
  {
    id: 'm3',
    title: 'Fast plug-in design',
    outcome: 'Design plug-ins that complete quickly, run at the right stage, retrieve only required data and avoid avoidable synchronous blocking.',
    tasks: ['Choose synchronous or asynchronous execution', 'Register filtering attributes', 'Avoid broad retrieve operations']
  },
  {
    id: 'm4',
    title: 'Customization decision patterns',
    outcome: 'Choose between existing tables, custom tables, workflows, plug-ins and client-side logic based on supportability and execution needs.',
    tasks: ['Use logical table names in code', 'Prefer extending existing tables when appropriate', 'Select plug-in or workflow patterns']
  },
  {
    id: 'm5',
    title: 'Offline and service channel optimization',
    outcome: 'Limit offline-enabled scope and tune service channel allocation, proxy creation and connection reuse patterns.',
    tasks: ['Reduce offline tables to real mobile needs', 'Reuse proxy/service clients appropriately', 'Avoid enabling unnecessary plug-ins']
  },
  {
    id: 'm6',
    title: 'Security architecture and least privilege',
    outcome: 'Create a security data plan that protects business data, applies least privilege and reduces privilege escalation risk.',
    tasks: ['Define roles by job function', 'Avoid broad elevated execution', 'Document sensitive table access']
  },
  {
    id: 'm7',
    title: 'ISV extensibility and operational configuration',
    outcome: 'Build ISV-ready extensions that externalize service URLs, separate configuration from code and isolate custom websites when needed.',
    tasks: ['Use configuration files or settings', 'Document deployment environment values', 'Create separate web apps for independent lifecycle control']
  },
  {
    id: 'm8',
    title: 'Capstone: development best-practices review',
    outcome: 'Review a Dynamics 365 Customer Engagement customization design and produce a best-practices remediation plan.',
    tasks: ['Score performance risk', 'Score customization and supportability risk', 'Score security and ISV extensibility readiness']
  }
];

const domains = ['Performance', 'Plug-ins', 'Customization', 'Security', 'ISV extensibility'];
const stems = [
  'A team is importing records into Customer Engagement and notices slow writes. What is the best first design response?',
  'A plug-in retrieves every column from an account record for a simple validation. What should be improved?',
  'A customization requirement can be met by extending an existing table. What is the preferred approach?',
  'A user role has broad privileges to simplify support. What should the solution architect do?',
  'An ISV solution stores service endpoint URLs directly in compiled code. What is the best correction?'
];
const answers = [
  ['Use safe parallel processing and reduce service round trips.', 'Move all work to the browser.', 'Disable security roles.', 'Create duplicate tables for every process.'],
  ['Retrieve only required columns and avoid broad queries.', 'Retrieve all columns to simplify future changes.', 'Use synchronous calls for every operation.', 'Ignore filtering attributes.'],
  ['Customize or extend the existing table when it supports the scenario.', 'Always create a new table.', 'Store business data in notes only.', 'Disable existing relationships.'],
  ['Create a least-privilege role model aligned to job functions.', 'Give every user system administrator rights.', 'Hide fields only in JavaScript.', 'Move sensitive data to unmanaged spreadsheets.'],
  ['Move endpoint values into configuration or environment settings.', 'Hard-code production URLs in plug-ins.', 'Ask users to edit source code.', 'Duplicate assemblies per customer without configuration.']
];

const questionBank = [];
// for (let i = 0; i < 200; i++)
for (let i = 0; i < 200; i++) {
  const idx = i % stems.length;
  questionBank.push({
    id: `q${i + 1}`,
    domain: domains[i % domains.length],
    question: `${stems[idx]} Scenario ${Math.floor(i / stems.length) + 1}.`,
    options: answers[idx],
    correct: 0,
    explain: `Best practice focus: ${domains[i % domains.length]} should improve supportability, performance and risk control.`
  });
}

const caseBank = [];
// for (let i = 0; i < 50; i++)
for (let i = 0; i < 50; i++) {
  caseBank.push({
    id: `case${i + 1}`,
    domain: domains[i % domains.length],
    question: `Case ${i + 1}: A Dynamics 365 Customer Engagement solution has slow synchronous logic, broad data retrieval and weak deployment configuration. Which response best aligns to development best practices?`,
    options: [
      'Refactor the design by reducing synchronous work, retrieving only required data, applying least privilege and externalizing configuration.',
      'Keep the design unchanged because code works in test.',
      'Increase user privileges to avoid access issues.',
      'Move all logic to unsupported database changes.'
    ],
    correct: 0,
    explain: 'The strongest answer combines performance, customization supportability, security and ISV extensibility controls.'
  });
}

const state = JSON.parse(localStorage.getItem(COURSE_KEY) || '{"complete":{},"checklist":{},"score":null}');
const enrolment = JSON.parse(localStorage.getItem(ENROL_KEY) || 'null');

function save(){ localStorage.setItem(COURSE_KEY, JSON.stringify(state)); }
function saveEnrolment(data){ localStorage.setItem(ENROL_KEY, JSON.stringify(data)); }
function pick(items, count){ return [...items].sort(() => Math.random() - .5).slice(0, count); }

function renderModules(){
  const target = document.querySelector('[data-modules]');
  if(!target) return;
  target.innerHTML = modules.map((m, index) => `
    <article class="d365-module">
      <p class="d365-eyebrow">Module ${index + 1}</p>
      <h3>${m.title}</h3>
      <p>${m.outcome}</p>
      <ul>${m.tasks.map(t => `<li>${t}</li>`).join('')}</ul>
      <label class="d365-answer"><input type="checkbox" data-module="${m.id}" ${state.complete[m.id] ? 'checked' : ''}> Mark module complete</label>
    </article>`).join('');
  target.querySelectorAll('[data-module]').forEach(box => box.addEventListener('change', e => {
    state.complete[e.target.dataset.module] = e.target.checked;
    save();
    updateProgress();
  }));
}

function updateProgress(){
  const done = modules.filter(m => state.complete[m.id]).length;
  const pct = Math.round((done / modules.length) * 100);
  document.querySelectorAll('[data-progress-bar]').forEach(el => el.style.width = `${pct}%`);
  document.querySelectorAll('[data-progress-text]').forEach(el => el.textContent = `${pct}% complete (${done}/${modules.length} modules)`);
}

function renderChecklist(){
  const items = [
    'Bulk operations use controlled parallelism and limited service round trips.',
    'Identifiers, query columns and retrieved records are optimized for platform and SQL performance.',
    'Plug-ins are registered at the correct stage, mode and filtering scope.',
    'Existing tables are extended where appropriate instead of duplicating the data model.',
    'Security roles are based on least privilege and sensitive data access is documented.',
    'ISV endpoints and environment values are externalized into configuration.'
  ];
  const target = document.querySelector('[data-checklist]');
  if(!target) return;
  target.innerHTML = items.map((item, index) => `<label><input type="checkbox" data-check="c${index}" ${state.checklist[`c${index}`] ? 'checked' : ''}> ${item}</label>`).join('');
  target.querySelectorAll('[data-check]').forEach(box => box.addEventListener('change', e => {
    state.checklist[e.target.dataset.check] = e.target.checked;
    save();
  }));
}

function renderQuiz(){
  const target = document.querySelector('[data-quiz]');
  if(!target) return;
  const quiz = [...pick(questionBank, 50), ...pick(caseBank, 5)];
  target.innerHTML = quiz.map((q, index) => `
    <article class="d365-quiz-card" data-qid="${q.id}" data-correct="${q.correct}">
      <p class="d365-eyebrow">${q.domain}</p>
      <h3>${index + 1}. ${q.question}</h3>
      ${q.options.map((opt, i) => `<label class="d365-answer"><input type="radio" name="${q.id}" value="${i}"> ${opt}</label>`).join('')}
      <p class="d365-alert d365-hidden" data-explain>${q.explain}</p>
    </article>`).join('');
}

function scoreQuiz(){
  const cards = [...document.querySelectorAll('[data-qid]')];
  let score = 0;
  cards.forEach(card => {
    const selected = card.querySelector('input:checked');
    const correct = Number(card.dataset.correct);
    const explain = card.querySelector('[data-explain]');
    if(selected && Number(selected.value) === correct) score++;
    if(explain) explain.classList.remove('d365-hidden');
  });
  const pct = Math.round((score / cards.length) * 100);
  state.score = { score, total: cards.length, pct, date: new Date().toISOString() };
  save();
  const result = document.querySelector('[data-score]');
  if(result) result.textContent = `Score: ${score}/${cards.length} (${pct}%). ${pct >= 80 ? 'Pass threshold met.' : 'Revise modules and retry.'}`;
}

function download(filename, text){
  const blob = new Blob([text], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = Object.assign(document.createElement('a'), { href: url, download: filename });
  a.click();
  URL.revokeObjectURL(url);
}

function courseBrief(){
  return `# D365-CE-BP-101 Development Best Practices Brief\n\n## Focus\nPerformance, plug-in design, customization supportability, security and ISV extensibility for Dynamics 365 Customer Engagement.\n\n## Module Completion\n${modules.map((m, i) => `${i + 1}. ${m.title}: ${state.complete[m.id] ? 'Complete' : 'Open'}`).join('\n')}\n\n## Final Score\n${state.score ? `${state.score.score}/${state.score.total} (${state.score.pct}%)` : 'Not attempted'}\n`;
}

function capstoneEvidence(){
  const form = document.querySelector('[data-capstone-form]');
  const data = new FormData(form);
  return `# D365-CE-BP-101 Capstone Evidence\n\n## Scenario\n${data.get('scenario') || ''}\n\n## Performance Remediation\n${data.get('performance') || ''}\n\n## Customization and Plug-in Remediation\n${data.get('customization') || ''}\n\n## Security Plan\n${data.get('security') || ''}\n\n## ISV Extensibility Plan\n${data.get('isv') || ''}\n`;
}

function initEnrolment(){
  const form = document.querySelector('[data-enrol-form]');
  const locked = document.querySelectorAll('[data-locked]');
  const panel = document.querySelector('[data-enrol-panel]');
  if(enrolment){
    locked.forEach(el => el.classList.remove('d365-hidden'));
    if(panel) panel.classList.add('d365-hidden');
  }
  if(form){
    form.addEventListener('submit', () => {
      saveEnrolment(Object.fromEntries(new FormData(form).entries()));
      localStorage.setItem(ENROL_KEY, JSON.stringify(Object.fromEntries(new FormData(form).entries())));
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initEnrolment();
  renderModules();
  renderChecklist();
  renderQuiz();
  updateProgress();
  document.querySelector('[data-score-quiz]')?.addEventListener('click', scoreQuiz);
  document.querySelector('[data-download-brief]')?.addEventListener('click', () => download('d365-ce-bp-101-brief.md', courseBrief()));
  document.querySelector('[data-download-capstone]')?.addEventListener('click', () => download('d365-ce-bp-101-capstone.md', capstoneEvidence()));
});
