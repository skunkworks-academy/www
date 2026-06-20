const COURSE_KEY = 'cld-uf-101-app-v1';
const TRAINING_EMAIL = 'training@skunkworksacademy.com';

const modules = [
  { id: 'm1', title: 'Introduction to Claude', minutes: 30, focus: 'What Claude is, where it fits, and where human judgement is required.' },
  { id: 'm2', title: 'Getting Started', minutes: 30, focus: 'Start conversations, use natural language, and manage context.' },
  { id: 'm3', title: 'Core Use Cases', minutes: 45, focus: 'Writing, summarization, brainstorming, analysis, and explanation.' },
  { id: 'm4', title: 'Effective Prompting', minutes: 45, focus: 'Audience, context, constraints, tone, examples, and output format.' },
  { id: 'm5', title: 'Documents and Files', minutes: 40, focus: 'Upload safe files, ask targeted questions, and transform outputs.' },
  { id: 'm6', title: 'Projects and Memory', minutes: 35, focus: 'Use context features for recurring work without exposing sensitive data.' },
  { id: 'm7', title: 'Best Practices and Pitfalls', minutes: 40, focus: 'Verification, sensitive information, and risk-based review.' },
  { id: 'm8', title: 'Capstone Practice', minutes: 60, focus: 'Complete a real or realistic Claude task end to end.' }
];

const checklist = [
  'Names, roles, titles, and organisation names are correct.',
  'Dates, deadlines, time zones, and version dates are correct.',
  'Numbers, totals, percentages, pricing, and calculations are verified.',
  'Quotes and citations are checked against the source.',
  'Legal, compliance, contractual, or policy wording is reviewed by the right person.',
  'Customer-facing claims are accurate and supported.',
  'Sensitive data has not been entered or exposed unnecessarily.',
  'Output has been checked against source documents where relevant.',
  'Assumptions and limitations are clear.',
  'Final output follows organisation approval rules.'
];

const promptLibrary = `# CLD-UF-101 Prompt Library\n\n## Universal Prompt\nI need help with [task]. Context: [background]. Audience: [who this is for]. Goal: [outcome]. Format: [email/table/checklist/report]. Tone: [tone]. Constraints: [length, required points, exclusions]. Before answering, ask critical questions if anything is unclear.\n\n## Writing\nDraft a [tone] email to [audience] about [topic]. Include [required points]. Keep it under [word count] words and include a subject line.\n\n## Summarization\nSummarize this content into decisions, action items, risks, and open questions. Use a table for action items with owner and due date where available.\n\n## Analysis\nCompare these options using [criteria]. Present a table and recommend the strongest option with assumptions and risks.\n\n## Verification\nReview this output and identify every claim, number, date, name, quote, citation, recommendation, assumption, and sensitive-data item that should be verified before use.`;

const learnerWorkbook = `# CLD-UF-101 Learner Workbook\n\n## Learner Details\nName:\nRole:\nCompany:\nDate started:\n\n## Module Reflections\nFor each module, record your prompt, output notes, follow-up prompt, and verification list.\n\n## Capstone\nTask description:\nUse case selected:\nInitial prompt:\nFollow-up prompt:\nVerification list:\nWorkplace application:`;

const activityPrompts = [
  ['Define Claude in one sentence', 'List two things Claude can help with', 'List two things Claude output cannot replace'],
  ['Write your first role-based prompt', 'Add a follow-up instruction', 'Start a new clean conversation'],
  ['Choose a use case', 'Run one workplace task', 'Identify what must be verified'],
  ['Rewrite a vague prompt', 'Add audience and format', 'Ask Claude for clarifying questions'],
  ['Use a safe file or sample text', 'Ask a targeted document question', 'Transform the answer into a checklist'],
  ['Plan a Project', 'Write one custom instruction', 'Name information you should not store'],
  ['Build a verification list', 'Classify output by risk', 'Remove sensitive details from a prompt'],
  ['Select a capstone task', 'Run initial and follow-up prompts', 'Document verification and workplace use']
];

function getState() {
  try { return JSON.parse(localStorage.getItem(COURSE_KEY)) || {}; } catch { return {}; }
}
function setState(state) { localStorage.setItem(COURSE_KEY, JSON.stringify(state)); }
function savePatch(patch) { const s = getState(); setState({ ...s, ...patch }); renderProgress(); }
function byId(id) { return document.getElementById(id); }
function download(filename, mime, content) {
  const blob = content instanceof Blob ? content : new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = filename; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 500);
}
function shuffle(items) { return [...items].sort(() => Math.random() - 0.5); }
function pick(items, count) { return shuffle(items).slice(0, count); }
function esc(s) { return String(s).replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c])); }

function buildQuestionBank() {
  const topics = [
    ['Claude basics', 'Claude is an AI assistant for language, reasoning, drafting, summarization, and analysis.', 'Claude is a guaranteed source of current truth.', 'Claude replaces all review.', 'Claude is only a password manager'],
    ['Search difference', 'Claude generates responses and may need current-source verification.', 'Claude is always a live search index.', 'Claude only returns links.', 'Claude cannot summarize text'],
    ['Knowledge cutoff', 'A knowledge cutoff means recent changes may need verification.', 'It means Claude stops after ten messages.', 'It means Claude only works offline.', 'It means Claude can approve contracts'],
    ['Writing use case', 'Writing and editing tasks include emails, reports, policies, and summaries.', 'Writing tasks never need review.', 'Writing tasks require API keys.', 'Writing tasks only work in spreadsheets'],
    ['Summarization', 'Good summaries specify audience, focus, and format.', 'All summaries should be one sentence.', 'Summaries never need source checking.', 'Summaries replace source documents'],
    ['Brainstorming', 'Brainstorming is useful for options, alternatives, and ideas.', 'Brainstorming confirms legal facts.', 'Brainstorming replaces stakeholder decisions.', 'Brainstorming requires confidential data'],
    ['Analysis', 'Analysis prompts should include criteria, assumptions, risks, and format.', 'Analysis is always correct without checking.', 'Analysis should hide assumptions.', 'Analysis only works for poems'],
    ['Prompting', 'Strong prompts include context, task, audience, constraints, tone, and format.', 'Short vague prompts are always best.', 'Claude never needs context.', 'Tone and audience do not matter'],
    ['Documents', 'Before uploading files, check sensitivity, policy, and approval.', 'Upload all documents without checking.', 'Files never contain sensitive data.', 'Screenshots cannot expose secrets'],
    ['Projects', 'Projects help with recurring work that needs shared context.', 'Projects should store passwords.', 'Projects remove all need for prompting.', 'Projects are only for images'],
    ['Memory', 'Memory can be useful but must be managed carefully.', 'Memory should store all confidential facts.', 'Memory makes every answer verified.', 'Memory is a spreadsheet formula'],
    ['Verification', 'Verify names, dates, numbers, claims, citations, and high-stakes recommendations.', 'Never verify polished output.', 'Verification only matters for colours.', 'Confident wording proves accuracy'],
    ['Sensitive data', 'Use minimum necessary context and avoid unapproved sensitive information.', 'Always paste customer records.', 'Always paste passwords.', 'Sensitive data improves safety'],
    ['Capstone', 'A capstone should show task, prompt, iteration, verification, and workplace application.', 'A capstone only needs a screenshot.', 'A capstone should avoid reflection.', 'A capstone cannot use follow-up prompts'],
    ['Responsible use', 'Claude supports judgement; it does not replace accountability.', 'Claude signs off all work.', 'Claude owns final decisions.', 'Claude removes policy obligations'],
    ['Artifacts', 'Artifacts are useful for reusable outputs such as documents, checklists, and structured drafts.', 'Artifacts are only for deleting content.', 'Artifacts verify legal claims automatically.', 'Artifacts are passwords']
  ];
  const stems = [
    'Which statement is most accurate about', 'What is the best practice for', 'Which option correctly describes',
    'What should a learner remember about', 'Which answer is safest for', 'What is the correct approach to',
    'Which statement reflects course guidance on', 'What is the practical workplace rule for',
    'Which option would be recommended for', 'What is most important when working with'
  ];
  const bank = [];
  for (let i = 0; i < 200; i++) {
    const t = topics[i % topics.length];
    const stem = stems[i % stems.length];
    bank.push({ id: `Q${i+1}`, text: `${stem} ${t[0]}?`, options: [t[1], t[2], t[3], t[4]], answer: 0, explanation: t[1] });
  }
  return bank;
}

function buildCaseBank() {
  const scenarios = [
    'A sales coordinator uses Claude to draft a client proposal after a discovery call.',
    'An operations manager uploads a safe process document and asks Claude to create a checklist.',
    'A learner asks Claude to summarize meeting notes containing dates, owners, and action items.',
    'A manager wants to use Claude for a customer-facing policy explanation.',
    'A team lead creates a Project for recurring weekly reporting.',
    'A learner receives a polished answer with unsupported statistics.',
    'A training coordinator prepares a learner reminder email.',
    'A support analyst wants to paste a screenshot containing customer data.',
    'An HR user wants to draft a role announcement with sensitive employee details.',
    'A project manager compares three delivery options with Claude.'
  ];
  const prompts = [
    ['What should be verified before use?', 'Names, dates, numbers, scope, pricing, claims, and commitments.', 'Only spelling.', 'Nothing if the tone is professional.', 'Only the logo colour'],
    ['What is the safest next step?', 'Use minimum necessary context and follow organisation policy.', 'Paste all source records.', 'Ignore data sensitivity.', 'Remove human review'],
    ['Which evidence best shows competent Claude use?', 'A clear prompt, follow-up iteration, verification list, and workplace application.', 'A single vague prompt.', 'A copied output with no review.', 'No explanation of assumptions'],
    ['How should Claude be treated in this scenario?', 'As an assistant for drafting and structure, not the final authority.', 'As a legal approver.', 'As a replacement for data policy.', 'As a guaranteed current source']
  ];
  const bank = [];
  for (let i = 0; i < 50; i++) {
    const s = scenarios[i % scenarios.length];
    const p = prompts[i % prompts.length];
    bank.push({ id: `C${i+1}`, case: s, text: p[0], options: [p[1], p[2], p[3], p[4]], answer: 0, explanation: p[1] });
  }
  return bank;
}

const questionBank = buildQuestionBank();
const caseBank = buildCaseBank();

function renderProgress() {
  const state = getState();
  const done = modules.filter(m => state[`${m.id}Done`]).length;
  const pct = Math.round(done / modules.length * 100);
  if (byId('progressText')) byId('progressText').textContent = `${pct}% complete · ${done}/${modules.length} modules`;
  if (byId('progressFill')) byId('progressFill').style.width = `${pct}%`;
  document.querySelectorAll('.module-card').forEach(card => card.classList.toggle('done', !!state[`${card.dataset.id}Done`]));
}

function renderModules() {
  const grid = byId('moduleGrid');
  grid.innerHTML = modules.map((m, i) => `
    <article class="module-card" data-id="${m.id}" tabindex="0" role="button" aria-label="Open ${esc(m.title)}">
      <div class="module-number">${String(i+1).padStart(2,'0')}</div>
      <h3>${esc(m.title)}</h3>
      <p>${esc(m.focus)}</p>
      <small>${m.minutes} minutes · Activity + quiz</small>
    </article>`).join('');
  grid.querySelectorAll('.module-card').forEach(card => {
    card.addEventListener('click', () => openModule(card.dataset.id));
    card.addEventListener('keydown', e => { if (e.key === 'Enter') openModule(card.dataset.id); });
  });
  openModule('m1');
  renderProgress();
}

function moduleQuestions(moduleId) {
  const idx = modules.findIndex(m => m.id === moduleId);
  return questionBank.filter((_, i) => i % modules.length === idx).slice(0, 12);
}

function openModule(moduleId) {
  const m = modules.find(x => x.id === moduleId);
  const index = modules.indexOf(m);
  document.querySelectorAll('.module-card').forEach(c => c.classList.toggle('active', c.dataset.id === moduleId));
  const questions = pick(moduleQuestions(moduleId), 5);
  byId('moduleWorkspace').classList.add('pop');
  byId('moduleWorkspace').innerHTML = `
    <h3>Module ${index+1}: ${esc(m.title)}</h3>
    <p>${esc(m.focus)}</p>
    <h4>Animated click activity</h4>
    <p>Click each action card as you complete it.</p>
    <div class="activity-grid">${activityPrompts[index].map((a, n) => `<button class="activity-card" data-activity="${n}">${esc(a)}</button>`).join('')}</div>
    <h4>Module knowledge check</h4>
    <div class="module-quiz" data-module="${moduleId}">
      ${questions.map((q, qi) => renderQuestion(q, qi, `module-${moduleId}`)).join('')}
    </div>
    <button class="complete-btn" data-mark-module="${moduleId}">Mark module complete</button>
    <p class="form-status" id="moduleStatus"></p>`;
  setTimeout(() => byId('moduleWorkspace').classList.remove('pop'), 260);
  document.querySelectorAll('.activity-card').forEach(btn => btn.addEventListener('click', () => { btn.classList.toggle('selected'); btn.classList.add('pulse'); setTimeout(()=>btn.classList.remove('pulse'), 650); }));
  attachQuestionHandlers(byId('moduleWorkspace'));
  document.querySelector('[data-mark-module]').addEventListener('click', () => { savePatch({ [`${moduleId}Done`]: true }); byId('moduleStatus').textContent = `${m.title} marked complete.`; });
}

function renderQuestion(q, idx, group) {
  const options = q.options.map((o, oi) => `<button class="quiz-option" data-group="${group}" data-q="${q.id}" data-answer="${oi}" data-correct="${q.answer}">${String.fromCharCode(65+oi)}. ${esc(o)}</button>`).join('');
  return `<div class="quiz-question" data-qid="${q.id}">${q.case ? `<span class="case-label">Case Study</span><p><strong>Scenario:</strong> ${esc(q.case)}</p>` : ''}<h4>${idx+1}. ${esc(q.text)}</h4><div class="quiz-options">${options}</div><p class="quiz-explain" hidden>${esc(q.explanation)}</p></div>`;
}

function attachQuestionHandlers(root = document) {
  root.querySelectorAll('.quiz-option').forEach(btn => {
    btn.addEventListener('click', () => {
      const parent = btn.closest('.quiz-question');
      parent.querySelectorAll('.quiz-option').forEach(b => { b.disabled = true; b.classList.toggle('correct', b.dataset.answer === b.dataset.correct); });
      if (btn.dataset.answer !== btn.dataset.correct) btn.classList.add('wrong');
      parent.querySelector('.quiz-explain').hidden = false;
    });
  });
}

function renderChecklist() {
  const state = getState();
  byId('checklistApp').innerHTML = checklist.map((item, i) => `<label class="check-item"><input type="checkbox" data-check="${i}" ${state[`check${i}`] ? 'checked' : ''}/><span>${esc(item)}</span></label>`).join('');
  byId('checklistApp').querySelectorAll('[data-check]').forEach(chk => chk.addEventListener('change', () => savePatch({ [`check${chk.dataset.check}`]: chk.checked })));
}

function checklistRows() { const state = getState(); return checklist.map((item, i) => ({ item, status: state[`check${i}`] ? 'Complete' : 'Not complete' })); }
function checklistMarkdown() { return `# CLD-UF-101 Verification Checklist\n\n${checklistRows().map(r => `- [${r.status === 'Complete' ? 'x' : ' '}] ${r.item}`).join('\n')}\n`; }
function checklistHtml() { return `<!doctype html><html><head><meta charset="utf-8"><title>Verification Checklist</title></head><body><h1>CLD-UF-101 Verification Checklist</h1><ul>${checklistRows().map(r => `<li><strong>${r.status}:</strong> ${esc(r.item)}</li>`).join('')}</ul></body></html>`; }
function checklistText() { return checklistRows().map(r => `${r.status}: ${r.item}`).join('\n'); }

function exportPdf(filename, title, text) {
  const lines = [title, '', ...text.split('\n')].map(s => s.slice(0, 90));
  const body = lines.map((line, i) => `BT /F1 11 Tf 50 ${760 - i*15} Td (${line.replace(/[()\\]/g, '')}) Tj ET`).join('\n');
  const pdf = `%PDF-1.4\n1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj\n2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj\n3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >> endobj\n4 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj\n5 0 obj << /Length ${body.length} >> stream\n${body}\nendstream endobj\nxref\n0 6\n0000000000 65535 f \ntrailer << /Root 1 0 R /Size 6 >>\nstartxref\n0\n%%EOF`;
  download(filename, 'application/pdf', pdf);
}

function crc32(str) {
  const table = crc32.table || (crc32.table = Array.from({length:256}, (_, n) => { let c=n; for(let k=0;k<8;k++) c=((c&1)?(0xedb88320^(c>>>1)):(c>>>1)); return c>>>0; }));
  let crc = -1; for (let i=0;i<str.length;i++) crc = (crc>>>8) ^ table[(crc ^ str.charCodeAt(i)) & 255]; return (crc ^ -1) >>> 0;
}
function le(n, bytes) { let s=''; for(let i=0;i<bytes;i++) s += String.fromCharCode((n >> (8*i)) & 255); return s; }
function zip(files) {
  let local='', central='', offset=0;
  for (const f of files) {
    const data = f.content; const crc = crc32(data); const name = f.name;
    const header = 'PK\x03\x04' + le(20,2) + le(0,2) + le(0,2) + le(0,2) + le(0,2) + le(crc,4) + le(data.length,4) + le(data.length,4) + le(name.length,2) + le(0,2) + name;
    local += header + data;
    central += 'PK\x01\x02' + le(20,2)+le(20,2)+le(0,2)+le(0,2)+le(0,2)+le(0,2)+le(crc,4)+le(data.length,4)+le(data.length,4)+le(name.length,2)+le(0,2)+le(0,2)+le(0,2)+le(0,2)+le(0,4)+le(offset,4)+name;
    offset += header.length + data.length;
  }
  return new Blob([local + central + 'PK\x05\x06' + le(0,2)+le(0,2)+le(files.length,2)+le(files.length,2)+le(central.length,4)+le(local.length,4)+le(0,2)], { type:'application/zip' });
}
function exportDocx(filename, title, text) {
  const para = text.split('\n').filter(Boolean).map(p => `<w:p><w:r><w:t>${esc(p)}</w:t></w:r></w:p>`).join('');
  const files = [
    {name:'[Content_Types].xml', content:'<?xml version="1.0"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>'},
    {name:'_rels/.rels', content:'<?xml version="1.0"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>'},
    {name:'word/document.xml', content:`<?xml version="1.0"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body><w:p><w:r><w:t>${esc(title)}</w:t></w:r></w:p>${para}</w:body></w:document>`}
  ]; download(filename, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', zip(files));
}
function exportXlsx(filename) {
  const rows = checklistRows();
  const sheetRows = rows.map((r,i) => `<row r="${i+2}"><c r="A${i+2}" t="inlineStr"><is><t>${esc(r.item)}</t></is></c><c r="B${i+2}" t="inlineStr"><is><t>${r.status}</t></is></c></row>`).join('');
  const files = [
    {name:'[Content_Types].xml', content:'<?xml version="1.0"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/></Types>'},
    {name:'_rels/.rels', content:'<?xml version="1.0"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>'},
    {name:'xl/workbook.xml', content:'<?xml version="1.0"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="Checklist" sheetId="1" r:id="rId1"/></sheets></workbook>'},
    {name:'xl/_rels/workbook.xml.rels', content:'<?xml version="1.0"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/></Relationships>'},
    {name:'xl/worksheets/sheet1.xml', content:`<?xml version="1.0"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetData><row r="1"><c r="A1" t="inlineStr"><is><t>Checklist Item</t></is></c><c r="B1" t="inlineStr"><is><t>Status</t></is></c></row>${sheetRows}</sheetData></worksheet>`}
  ]; download(filename, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', zip(files));
}
function exportPptx(filename) {
  const items = checklistRows().slice(0,8).map(r => `${r.status}: ${r.item}`).join(' | ');
  const files = [
    {name:'[Content_Types].xml', content:'<?xml version="1.0"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/ppt/presentation.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml"/><Override PartName="/ppt/slides/slide1.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml"/></Types>'},
    {name:'_rels/.rels', content:'<?xml version="1.0"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="ppt/presentation.xml"/></Relationships>'},
    {name:'ppt/presentation.xml', content:'<?xml version="1.0"?><p:presentation xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><p:sldIdLst><p:sldId id="256" r:id="rId1"/></p:sldIdLst></p:presentation>'},
    {name:'ppt/_rels/presentation.xml.rels', content:'<?xml version="1.0"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide" Target="slides/slide1.xml"/></Relationships>'},
    {name:'ppt/slides/slide1.xml', content:`<?xml version="1.0"?><p:sld xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"><p:cSld><p:spTree><p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr/><p:sp><p:nvSpPr><p:cNvPr id="2" name="Title"/><p:cNvSpPr/><p:nvPr/></p:nvSpPr><p:txBody><a:bodyPr/><a:lstStyle/><a:p><a:r><a:t>CLD-UF-101 Verification Checklist</a:t></a:r></a:p><a:p><a:r><a:t>${esc(items)}</a:t></a:r></a:p></p:txBody></p:sp></p:spTree></p:cSld></p:sld>`}
  ]; download(filename, 'application/vnd.openxmlformats-officedocument.presentationml.presentation', zip(files));
}

function attachExports() {
  document.querySelectorAll('[data-export-resource]').forEach(btn => btn.addEventListener('click', () => {
    const text = btn.dataset.exportResource === 'prompt-library' ? promptLibrary : learnerWorkbook;
    const name = btn.dataset.exportResource;
    if (btn.dataset.format === 'md') download(`${name}.md`, 'text/markdown', text);
    if (btn.dataset.format === 'pdf') exportPdf(`${name}.pdf`, name.replace('-', ' '), text);
  }));
  document.querySelectorAll('[data-export-checklist]').forEach(btn => btn.addEventListener('click', () => {
    const format = btn.dataset.exportChecklist;
    if (format === 'md') download('verification-checklist.md', 'text/markdown', checklistMarkdown());
    if (format === 'html') download('verification-checklist.html', 'text/html', checklistHtml());
    if (format === 'pdf') exportPdf('verification-checklist.pdf', 'Verification Checklist', checklistText());
    if (format === 'docx') exportDocx('verification-checklist.docx', 'Verification Checklist', checklistText());
    if (format === 'xlsx') exportXlsx('verification-checklist.xlsx');
    if (format === 'pptx') exportPptx('verification-checklist.pptx');
  }));
}

function renderFinalQuiz() {
  const app = byId('finalQuizApp');
  app.innerHTML = '';
  const questions = [...pick(questionBank, 50), ...pick(caseBank, 5)];
  app.dataset.total = questions.length;
  app.innerHTML = `<div class="final-summary"><div class="summary-card"><strong>55</strong><span>Total questions</span></div><div class="summary-card"><strong>50</strong><span>MCQ from 200 pool</span></div><div class="summary-card"><strong>5</strong><span>Case questions from 50 pool</span></div></div>${questions.map((q, i) => renderQuestion(q, i, 'final')).join('')}<button id="scoreFinalQuiz" class="button primary" type="button">Score final quiz</button><p id="finalScore" class="form-status"></p>`;
  attachQuestionHandlers(app);
  byId('scoreFinalQuiz').addEventListener('click', scoreFinalQuiz);
}
function scoreFinalQuiz() {
  const qs = [...byId('finalQuizApp').querySelectorAll('.quiz-question')];
  let correct = 0, answered = 0;
  qs.forEach(q => { const chosen = q.querySelector('.quiz-option.wrong,.quiz-option.correct[disabled]'); if (chosen) answered++; if (chosen && chosen.dataset.answer === chosen.dataset.correct) correct++; });
  const pct = Math.round(correct / qs.length * 100);
  byId('finalScore').textContent = `Score: ${correct}/${qs.length} (${pct}%). ${pct >= 70 ? 'Passed recommended threshold.' : 'Review modules and try again.'}`;
}

function attachAgreement() {
  const state = getState();
  if (state.agreementAccepted) { byId('agreementAccept').checked = true; byId('agreementStatus').textContent = `Accepted on ${state.agreementAccepted}`; }
  byId('saveAgreement').addEventListener('click', () => {
    if (!byId('agreementAccept').checked) { byId('agreementStatus').textContent = 'Tick the acknowledgement checkbox first.'; return; }
    const date = new Date().toLocaleString(); savePatch({ agreementAccepted: date }); byId('agreementStatus').textContent = `Accepted on ${date}`;
  });
}

function attachEnrolment() {
  byId('enrolmentForm').addEventListener('submit', e => {
    const fd = new FormData(e.currentTarget);
    const subject = encodeURIComponent('CLD-UF-101 Self-Paced Course Enrolment');
    const body = encodeURIComponent([...fd.entries()].map(([k,v]) => `${k}: ${v}`).join('\n'));
    byId('enrolmentStatus').innerHTML = `Submitting registration. If your browser blocks the submission, <a href="mailto:${TRAINING_EMAIL}?subject=${subject}&body=${body}">email the registration to training manually</a>.`;
  });
}

function attachCapstone() {
  const fields = ['Task','UseCase','Prompt','Followup','Verification','Application'];
  const saved = getState().capstone || {};
  fields.forEach(f => { const el = byId(`capstone${f}`); if (el) el.value = saved[f] || ''; });
  byId('saveCapstone').addEventListener('click', () => {
    const capstone = {}; fields.forEach(f => capstone[f] = byId(`capstone${f}`).value);
    savePatch({ capstone }); byId('capstoneStatus').textContent = 'Capstone saved locally in this browser.';
  });
  byId('downloadCapstone').addEventListener('click', () => {
    const capstone = {}; fields.forEach(f => capstone[f] = byId(`capstone${f}`).value);
    const md = `# CLD-UF-101 Capstone Project\n\n## Task Description\n${capstone.Task}\n\n## Use Case Selected\n${capstone.UseCase}\n\n## Initial Prompt\n${capstone.Prompt}\n\n## Follow-Up Prompt\n${capstone.Followup}\n\n## Verification List\n${capstone.Verification}\n\n## Workplace Application\n${capstone.Application}\n`;
    download('cld-uf-101-capstone.md', 'text/markdown', md);
  });
}

function init() {
  renderModules(); renderChecklist(); attachExports(); attachAgreement(); attachEnrolment(); attachCapstone();
  byId('startFinalQuiz').addEventListener('click', renderFinalQuiz);
  byId('resetFinalQuiz').addEventListener('click', () => byId('finalQuizApp').innerHTML = '');
}

document.addEventListener('DOMContentLoaded', init);
