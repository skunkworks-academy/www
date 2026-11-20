import { createGuide, topicHints } from './contact-guide.mjs';
const $ = id => document.getElementById(id);
const form = $('contact-form'), status = $('contact-status'), send = $('contact-send');
const controls = ['name', 'email', 'topic', 'message'].map(key => $('contact-' + key));
let pending = null, busy = false;
function feedback(message, failed = false) {
  status.setAttribute('role', failed ? 'alert' : 'status'); status.textContent = message; status.focus();
}
form.addEventListener('input', event => { event.target.removeAttribute('aria-invalid'); });
$('contact-topic').addEventListener('change', () => { $('topic-help').textContent = topicHints[$('contact-topic').value] || topicHints.general; });
form.addEventListener('submit', async event => {
  event.preventDefault(); if (busy) return;
  controls.forEach(control => { control.value = control.value.trim(); control.removeAttribute('aria-invalid'); });
  const invalid = controls.find(control => !control.checkValidity() || !control.value);
  if (invalid) { invalid.setAttribute('aria-invalid', 'true'); feedback(invalid.id === 'contact-email' ? 'Please enter a valid reply email.' : invalid.id === 'contact-message' ? 'Please write a message of 10–5,000 characters.' : 'Please complete your name, reply email, topic and message.', true); invalid.focus(); return; }
  const data = Object.fromEntries(new FormData(form));
  const signature = JSON.stringify(data);
  if (!pending || pending.signature !== signature) pending = { signature, id: crypto.randomUUID() };
  busy = true; send.disabled = true; send.textContent = 'Sending…';
  const controller = new AbortController(), timeout = setTimeout(() => controller.abort(), 25000);
  try {
    const response = await fetch('https://api.skunkworksacademy.com/api/contact/enquiries', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...data, id: pending.id }), signal: controller.signal, credentials: 'omit', referrerPolicy: 'no-referrer' });
    const body = await response.json().catch(() => ({}));
    if (!response.ok || body.received !== true || body.reference !== pending.id) throw new Error(response.status === 429 ? 'Too many enquiries right now. Please wait an hour and retry, or use email below.' : 'We could not confirm receipt. Your message is still here. Please retry; the same enquiry will not be duplicated.');
    feedback(`Thank you — your enquiry has been received. Your reference is ${body.reference}. The Academy team can follow up at your reply email.`);
    form.reset(); pending = null; resetGuide(); $('topic-help').textContent = topicHints.general;
  } catch (error) {
    feedback(error.name === 'AbortError' || error instanceof TypeError ? 'We could not confirm receipt. Your message is still here. Check your connection and retry; the same enquiry will not be duplicated.' : error.message, true);
  } finally { clearTimeout(timeout); busy = false; send.disabled = false; send.innerHTML = 'Send enquiry <span aria-hidden="true">→</span>'; }
});
const dialog = $('skunkie-dialog'), log = $('skunkie-log'), chatForm = $('skunkie-form'), input = $('skunkie-input');
let guide = createGuide(), opener;
function say(speaker, text) { const p = document.createElement('p'); p.dataset.speaker = speaker; p.textContent = `${speaker}: ${text}`; log.append(p); log.scrollTop = log.scrollHeight; }
function resetGuide() { guide = createGuide(); log.replaceChildren(); $('skunkie-use').hidden = true; chatForm.hidden = false; input.value = ''; }
document.querySelectorAll('[data-open-skunkie]').forEach(button => button.addEventListener('click', () => {
  opener = button; dialog.showModal();
  if (!log.children.length) say('Skunkie', 'What would you like the Academy team to help with? I can guide you through a short enquiry. Please leave out passwords and sensitive documents.');
  input.focus();
}));
$('skunkie-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('close', () => opener?.focus());
$('skunkie-reset').addEventListener('click', () => { resetGuide(); say('Skunkie', 'What would you like the Academy team to help with?'); input.focus(); });
chatForm.addEventListener('submit', event => {
  event.preventDefault(); const value = input.value.trim(); if (!value) return;
  say('You', value); input.value = ''; const reply = guide.reply(value); say('Skunkie', reply.text);
  if (reply.ready) { $('skunkie-use').hidden = false; chatForm.hidden = true; $('skunkie-use').focus(); } else input.focus();
});
$('skunkie-use').addEventListener('click', () => {
  // Preserve anything already written in the direct form: never silently overwrite it.
  const draft = guide.draft;
  for (const key of ['name', 'email', 'topic']) if (!$('contact-' + key).value) $('contact-' + key).value = draft[key];
  const message = $('contact-message');
  if (!message.value) message.value = draft.message;
  else if (!message.value.includes(draft.message)) {
    if (message.value.length + draft.message.length + 2 > 5000) { say('Skunkie', 'Your form already has a long message. Please review it before adding this draft. Your existing text has been kept.'); return; }
    message.value += '\n\n' + draft.message;
  }
  $('contact-topic').dispatchEvent(new Event('change')); dialog.close();
  form.scrollIntoView({ block: 'center', behavior: 'instant' }); $('contact-message').focus();
});
