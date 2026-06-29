const COURSE_CODE = 'SKW-OWASP10-2025';
const COURSE_URL = 'https://skunkworksacademy.com/self-paced/security/skw-owasp-top10-2025/';
const STORE = 'skw-owasp10-2025-progress-v3';
const ENTITLEMENT_KEY = `skwacademy.entitlement.${COURSE_CODE}`;
const DEFAULT_LAB_BASE = 'http://localhost:3025';

let state = loadState();
let courseData = null;
let labsData = [];
let finalData = [];
let resourcesData = [];

function $(id) { return document.getElementById(id); }
function esc(value) { return String(value ?? '').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#039;'); }
function loadState() { try { return Object.assign({ tab:'modules', active:'M00', lab:'L01', modules:{}, labs:{}, answers:{}, notes:{}, base:DEFAULT_LAB_BASE }, JSON.parse(localStorage.getItem(STORE)) || {}); } catch { return { tab:'modules', active:'M00', lab:'L01', modules:{}, labs:{}, answers:{}, notes:{}, base:DEFAULT_LAB_BASE }; } }
function saveState() { localStorage.setItem(STORE, JSON.stringify(state)); renderProgress(); }
function labUrl(path) { return path.startsWith('./') ? path : `${state.base}${path}`; }

async function hasEnrolment() {
  if (window.SkunkworksAcademyEnrollment?.hasCourseAccess) {
    try { return Boolean(await window.SkunkworksAcademyEnrollment.hasCourseAccess(COURSE_CODE)); } catch {}
  }
  try {
    const response = await fetch(`/api/enrolments/${encodeURIComponent(COURSE_CODE)}`, { credentials: 'include', headers: { 'Accept': 'application/json' } });
    if (response.ok) {
      const result = await response.json();
      if (result?.enrolled === true || result?.access === 'granted') return true;
    }
  } catch {}
  return localStorage.getItem(ENTITLEMENT_KEY) === 'granted';
}

function setAccessMessage(granted) {
  const access = $('accessState');
  access.textContent = granted ? 'Enrolment verified. Course unlocked.' : 'Enrolment required. Course content locked.';
  access.className = `access-state ${granted ? 'granted' : 'denied'}`;
}

function lockCourse() {
  setAccessMessage(false);
  document.querySelectorAll('[data-tab]').forEach(button => button.disabled = true);
  $('moduleMetric').textContent = 'Locked';
  $('labMetric').textContent = 'Locked';
  $('scoreMetric').textContent = '0%';
  $('progressBar').style.width = '0%';
  $('moduleNav').innerHTML = '<p class="muted">Enrol to unlock module navigation and course content.</p>';
  $('view').innerHTML = `<article class="locked-panel"><div class="eyebrow">Enrolment required</div><h2>Course content locked</h2><p>The full course is restricted to enrolled learners. Use the registration page, then return here and verify enrolment.</p><div class="actions"><a class="btn primary" href="/course-registration/?course=${COURSE_CODE}&return=${encodeURIComponent(location.pathname)}">Enrol now</a><button class="btn" id="retryAccess" type="button">Verify enrolment</button></div><p class="muted">The page supports the Academy entitlement API at <code>/api/enrolments/${COURSE_CODE}</code> and the optional portal hook <code>window.SkunkworksAcademyEnrollment.hasCourseAccess()</code>.</p></article>`;
  $('retryAccess').onclick = initialise;
}

async function unlockCourse() {
  setAccessMessage(true);
  const content = await import('./course-content.js');
  const labContent = await import('./course-labs.js');
  courseData = content.course;
  labsData = labContent.labs;
  finalData = labContent.finalAssessment;
  resourcesData = labContent.resources;
  document.querySelectorAll('[data-tab]').forEach(button => button.disabled = false);
  render();
}

function renderProgress() {
  if (!courseData) return;
  const moduleDone = Object.values(state.modules).filter(Boolean).length;
  const labDone = Object.values(state.labs).filter(Boolean).length;
  const total = courseData.modules.length + labsData.length;
  const percent = Math.round(((moduleDone + labDone) / total) * 100);
  $('moduleMetric').textContent = `${moduleDone}/${courseData.modules.length}`;
  $('labMetric').textContent = `${labDone}/${labsData.length}`;
  $('scoreMetric').textContent = `${percent}%`;
  $('progressBar').style.width = `${percent}%`;
}

function renderTabs() {
  document.querySelectorAll('[data-tab]').forEach(button => {
    button.setAttribute('aria-selected', String(button.dataset.tab === state.tab));
    button.onclick = () => { state.tab = button.dataset.tab; saveState(); render(); };
  });
}

function renderNav() {
  $('moduleNav').innerHTML = courseData.modules.map(module => `<button type="button" data-module="${module.id}" aria-current="${state.active === module.id}"><strong>${module.code}</strong> ${esc(module.title)}<small>${module.time} · ${state.modules[module.id] ? 'complete' : 'not complete'}</small></button>`).join('');
  document.querySelectorAll('[data-module]').forEach(button => {
    button.onclick = () => { state.active = button.dataset.module; state.tab = 'modules'; saveState(); render(); };
  });
}

function render() {
  renderTabs();
  renderNav();
  renderProgress();
  if (state.tab === 'modules') renderModule();
  if (state.tab === 'labs') renderLabs();
  if (state.tab === 'assessment') renderAssessment();
  if (state.tab === 'resources') renderResources();
}

function renderModule() {
  const module = courseData.modules.find(item => item.id === state.active) || courseData.modules[0];
  $('view').innerHTML = `<article><div class="eyebrow">${module.code}</div><h2>${esc(module.title)}</h2><p class="lead">${esc(module.summary)}</p><div class="pills"><span class="pill">${module.time}</span><span class="pill">Guided lessons</span><span class="pill">Knowledge check</span></div><h3 class="section-title">Learning outcomes</h3><div class="grid">${module.outcomes.map(item => `<section class="card"><p>${esc(item)}</p></section>`).join('')}</div><h3 class="section-title">Lesson content</h3><div class="grid">${module.lessons.map(item => `<section class="card"><p>${esc(item)}</p></section>`).join('')}</div><h3 class="section-title">Practical checklist</h3><div class="grid">${module.checklist.map(item => `<section class="card"><p>${esc(item)}</p></section>`).join('')}</div><section class="question" id="moduleQuiz"></section><div class="actions" style="margin-top:1rem"><button class="btn primary" id="completeModule" type="button">${state.modules[module.id] ? 'Completed' : 'Mark module complete'}</button><button class="btn" id="nextModule" type="button">Next module</button></div></article>`;
  renderQuestion('moduleQuiz', `module-${module.id}`, module.quiz[0]);
  $('completeModule').onclick = () => { state.modules[module.id] = true; saveState(); render(); };
  $('nextModule').onclick = () => { const index = courseData.modules.findIndex(item => item.id === module.id); state.active = courseData.modules[(index + 1) % courseData.modules.length].id; saveState(); render(); };
}

function renderQuestion(targetId, key, question) {
  $(targetId).innerHTML = `<fieldset><legend>${esc(question[0])}</legend>${question[1].map((option, index) => `<label><input type="radio" name="${key}" value="${index}"> ${esc(option)}</label>`).join('')}</fieldset><p class="feedback" id="fb-${key}"></p>`;
  document.querySelectorAll(`input[name="${key}"]`).forEach(input => {
    input.onchange = () => {
      const ok = Number(input.value) === question[2];
      state.answers[key] = ok;
      saveState();
      const feedback = $(`fb-${key}`);
      feedback.textContent = ok ? 'Correct. Continue.' : 'Review the lesson content and try again.';
      feedback.className = `feedback ${ok ? 'ok' : 'bad'}`;
    };
  });
}

function renderLabs() {
  $('view').innerHTML = `<section><div class="eyebrow">Hands-on labs</div><h2>Practical lab workspace</h2><p class="lead">Labs are available after enrolment. Start the local lab server, then launch the guided route for each exercise.</p><label>Local lab base URL<input type="url" id="baseUrl" value="${esc(state.base)}"></label><div class="actions" style="margin:1rem 0"><button class="btn primary" id="saveBase" type="button">Save lab URL</button><a class="btn" href="./vulnerable-app/README.md">Open setup guide</a><button class="btn" id="healthBtn" type="button">Check lab server</button></div><p class="feedback" id="health"></p><div class="lab-grid">${labsData.map(lab => `<article class="lab-card"><h3>${lab.id} · ${esc(lab.title)}</h3><p>${esc(lab.objective)}</p><div class="actions"><button class="btn small" data-open-lab="${lab.id}" type="button">Open lab</button><a class="btn small" href="${esc(labUrl(lab.path))}" target="_blank" rel="noopener">Launch</a><button class="btn small ${state.labs[lab.id] ? 'good' : ''}" data-lab-done="${lab.id}" type="button">${state.labs[lab.id] ? 'Done' : 'Mark done'}</button></div></article>`).join('')}</div><div id="labDetail"></div></section>`;
  $('saveBase').onclick = () => { state.base = $('baseUrl').value.trim() || DEFAULT_LAB_BASE; saveState(); renderLabs(); };
  $('healthBtn').onclick = checkLabServer;
  document.querySelectorAll('[data-open-lab]').forEach(button => button.onclick = () => { state.lab = button.dataset.openLab; saveState(); renderLabDetail(); });
  document.querySelectorAll('[data-lab-done]').forEach(button => button.onclick = () => { state.labs[button.dataset.labDone] = true; saveState(); renderLabs(); });
  renderLabDetail();
}

async function checkLabServer() {
  try {
    const response = await fetch(`${state.base}/api/health`);
    const result = await response.json();
    $('health').textContent = `Lab server online: ${result.name || 'local lab'} (${result.status || 'ok'})`;
    $('health').className = 'feedback ok';
  } catch {
    $('health').textContent = 'Lab server not reachable. Start it from vulnerable-app with npm start.';
    $('health').className = 'feedback bad';
  }
}

function renderLabDetail() {
  const lab = labsData.find(item => item.id === state.lab) || labsData[0];
  const command = lab.method === 'POST'
    ? `curl -X POST ${state.base}${lab.path} -H "Content-Type: application/json" -d '{"learner":"demo","amount":100}'`
    : `curl ${labUrl(lab.path)}`;
  $('labDetail').innerHTML = `<article class="lab-detail"><div class="eyebrow">${lab.module} · ${lab.id}</div><h3>${esc(lab.title)}</h3><p>${esc(lab.objective)}</p><ol>${lab.steps.map(step => `<li>${esc(step)}</li>`).join('')}</ol><p><strong>Evidence:</strong> ${esc(lab.evidence)}</p><div class="code"><code>${esc(command)}</code></div><div class="actions" style="margin:1rem 0"><button class="btn" id="copyCommand" type="button">Copy command</button><a class="btn primary" href="${esc(labUrl(lab.path))}" target="_blank" rel="noopener">Launch target</a></div><label>Evidence notes<textarea id="labNotes">${esc(state.notes[lab.id] || '')}</textarea></label><div class="actions" style="margin-top:1rem"><button class="btn" id="saveNotes" type="button">Save evidence notes</button><button class="btn good" id="finishLab" type="button">Mark lab complete</button></div></article>`;
  $('copyCommand').onclick = () => navigator.clipboard?.writeText(command);
  $('saveNotes').onclick = () => { state.notes[lab.id] = $('labNotes').value; saveState(); };
  $('finishLab').onclick = () => { state.notes[lab.id] = $('labNotes').value; state.labs[lab.id] = true; saveState(); renderLabs(); };
}

function renderAssessment() {
  $('view').innerHTML = `<section><div class="eyebrow">Assessment</div><h2>Scenario-based final assessment</h2><p class="lead">Complete the knowledge check and capstone notes after finishing the modules and labs.</p><div id="finalQuestions"></div><div class="actions"><button class="btn primary" id="gradeAssessment" type="button">Grade assessment</button><button class="btn" id="downloadRecord" type="button">Download completion record</button></div><p class="feedback" id="assessmentScore"></p><section class="card" style="margin-top:1rem"><h3>Capstone remediation report</h3><p>Summarise findings, risk, root cause, remediation owner, verification step and residual risk.</p><textarea id="capstoneNotes">${esc(state.notes.capstone || '')}</textarea><button class="btn" type="button" id="saveCapstone" style="margin-top:1rem">Save capstone notes</button></section></section>`;
  $('finalQuestions').innerHTML = finalData.map((question, index) => `<div class="question"><fieldset><legend>${index + 1}. ${esc(question[0])}</legend>${question[1].map((option, optionIndex) => `<label><input type="radio" name="final-${index}" value="${optionIndex}"> ${esc(option)}</label>`).join('')}</fieldset></div>`).join('');
  $('saveCapstone').onclick = () => { state.notes.capstone = $('capstoneNotes').value; saveState(); };
  $('gradeAssessment').onclick = gradeAssessment;
  $('downloadRecord').onclick = downloadRecord;
}

function gradeAssessment() {
  let score = 0;
  finalData.forEach((question, index) => {
    const selected = document.querySelector(`input[name="final-${index}"]:checked`);
    if (selected && Number(selected.value) === question[2]) score += 1;
  });
  const percent = Math.round((score / finalData.length) * 100);
  state.answers.finalScore = percent;
  saveState();
  $('assessmentScore').textContent = `Score: ${score}/${finalData.length} (${percent}%). ${percent >= 70 ? 'Pass threshold met.' : 'Review the modules and retry.'}`;
  $('assessmentScore').className = `feedback ${percent >= 70 ? 'ok' : 'bad'}`;
}

function renderResources() {
  $('view').innerHTML = `<section><div class="eyebrow">Resources</div><h2>Course references and learner materials</h2><div class="grid"><section class="card"><h3>References</h3><ul>${resourcesData.map(item => `<li><a href="${item[1]}" target="_blank" rel="noopener">${esc(item[0])}</a></li>`).join('')}</ul></section><section class="card"><h3>Local lab</h3><div class="code"><code>cd self-paced/security/skw-owasp-top10-2025/vulnerable-app\nnpm start</code></div></section><section class="card"><h3>Publishing URL</h3><div class="code"><code>${COURSE_URL}</code></div></section><section class="card"><h3>Access model</h3><p>Full content loads only after the Academy enrolment check grants access.</p></section></div></section>`;
}

function downloadRecord() {
  const moduleDone = Object.values(state.modules).filter(Boolean).length;
  const labDone = Object.values(state.labs).filter(Boolean).length;
  const body = [`Skunkworks Academy OWASP Top 10:2025 Completion Record`, `Course: ${COURSE_URL}`, `Date: ${new Date().toISOString()}`, `Modules completed: ${moduleDone}/${courseData.modules.length}`, `Labs completed: ${labDone}/${labsData.length}`, `Final score: ${state.answers.finalScore ?? 'not graded'}%`, `Capstone notes:`, state.notes.capstone || 'Not supplied'].join('\n');
  const blob = new Blob([body], { type: 'text/plain' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'skw-owasp10-2025-completion-record.txt';
  link.click();
  URL.revokeObjectURL(link.href);
}

function attachGlobalHandlers() {
  $('year').textContent = new Date().getFullYear();
  const verifyButtons = [$('verifyAccessBtn'), $('lockedVerifyBtn')].filter(Boolean);
  verifyButtons.forEach(button => { button.onclick = initialise; });
}

async function initialise() {
  attachGlobalHandlers();
  if (await hasEnrolment()) await unlockCourse();
  else lockCourse();
}

document.addEventListener('DOMContentLoaded', initialise);
