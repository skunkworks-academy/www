const { Resend } = require('resend');
const { randomUUID } = require('crypto');

const RECIPIENT = process.env.WORKBOOK_RECIPIENT || 'training@skunkworksacademy.com';
const MAX_BODY_BYTES = 180000;
const MAX_FIELD_LENGTH = 4000;

const escapeHtml = (value = '') => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

function validate(payload) {
  if (!payload || typeof payload !== 'object') return 'Missing request payload.';
  if (Buffer.byteLength(JSON.stringify(payload), 'utf8') > MAX_BODY_BYTES) return 'Submission is too large.';
  if (payload.antiSpam) return 'Spam submission rejected.';
  if (payload.metadata?.workbookCode !== 'PP-101') return 'Invalid workbook code.';
  const contact = payload.contact || {};
  if (!contact.fullName || !contact.email || !contact.phone || !contact.country || !contact.trainingDate || contact.consent !== 'on') return 'Required participant details are missing.';
  if (!/^\S+@\S+\.\S+$/.test(contact.email)) return 'Invalid participant email address.';
  const oversized = Object.values(payload.answers || {}).flat().some((value) => String(value).length > MAX_FIELD_LENGTH);
  if (oversized) return 'One or more responses exceed the allowed length.';
  if (!payload.answers?.commitmentNextStep) return 'Workbook responses are incomplete.';
  return null;
}

function display(value) {
  if (Array.isArray(value)) return value.join(', ');
  if (value === false || value === undefined || value === null || value === '') return '—';
  return String(value);
}

function emailHtml(payload, reference) {
  const rows = Object.entries(payload.answers || {})
    .filter(([key]) => key !== 'website')
    .map(([key, value]) => `<tr><th style="width:34%;padding:9px;text-align:left;vertical-align:top;border-bottom:1px solid #edf1f6;color:#53657a">${escapeHtml(key)}</th><td style="padding:9px;white-space:pre-wrap;border-bottom:1px solid #edf1f6">${escapeHtml(display(value))}</td></tr>`)
    .join('');
  return `<!doctype html><html><body style="margin:0;background:#f3f6fa;font-family:Arial,sans-serif;color:#142033"><div style="max-width:920px;margin:auto;padding:28px"><header style="padding:28px;border-radius:18px;background:#0c1a2e;color:#fff"><p style="margin:0;color:#61dafb;font-weight:700;text-transform:uppercase;letter-spacing:.08em">Skunkworks Academy</p><h1 style="margin:8px 0">PP-101 Personal Productivity Workbook</h1><p style="margin:0;color:#b8c6d9">${escapeHtml(payload.contact.fullName)} · ${escapeHtml(reference)}</p></header><section style="margin-top:18px;padding:22px;border:1px solid #dbe3ed;border-radius:14px;background:#fff"><h2>Participant details</h2><p><strong>Email:</strong> ${escapeHtml(payload.contact.email)}<br><strong>Mobile:</strong> ${escapeHtml(payload.contact.phone)}<br><strong>Country:</strong> ${escapeHtml(payload.contact.country)}<br><strong>Training date:</strong> ${escapeHtml(payload.contact.trainingDate)}</p></section><section style="margin-top:18px;padding:22px;border:1px solid #dbe3ed;border-radius:14px;background:#fff"><h2>Workbook responses</h2><table style="width:100%;border-collapse:collapse">${rows}</table></section></div></body></html>`;
}

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed.' });
  const error = validate(req.body);
  if (error) return res.status(400).json({ message: error });
  if (!process.env.RESEND_API_KEY || !process.env.WORKBOOK_FROM_EMAIL) return res.status(503).json({ message: 'Email delivery is not configured.' });

  const reference = `PPW-${new Date().toISOString().slice(0, 10).replaceAll('-', '')}-${randomUUID().slice(0, 8).toUpperCase()}`;
  const resend = new Resend(process.env.RESEND_API_KEY);
  const attachment = Buffer.from(JSON.stringify({ reference, ...req.body }, null, 2)).toString('base64');

  try {
    const { error: sendError } = await resend.emails.send({
      from: process.env.WORKBOOK_FROM_EMAIL,
      to: [RECIPIENT],
      replyTo: req.body.contact.email,
      subject: `Completed PP-101 Workbook — ${req.body.contact.fullName} — ${reference}`,
      html: emailHtml(req.body, reference),
      attachments: [{ filename: `${reference}.json`, content: attachment }]
    });
    if (sendError) throw sendError;
    return res.status(200).json({ ok: true, reference });
  } catch (sendError) {
    console.error('PP-101 workbook email failed', sendError);
    return res.status(502).json({ message: 'Email delivery failed. Please retry.' });
  }
};

module.exports._test = { validate, escapeHtml };
