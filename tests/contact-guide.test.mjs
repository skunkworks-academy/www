import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createGuide, suggestTopic } from '../assets/contact-guide.mjs';
test('free-text conversation drafts a complete enquiry and validates reply email', () => {
  const guide = createGuide();
  assert.match(guide.reply('I cannot access my lab').text, /Learner & lab support/);
  guide.reply('Synthetic lab error 42'); guide.reply('Synthetic Visitor');
  assert.match(guide.reply('bad-address').text, /doesn’t look complete/);
  assert.equal(guide.reply('synthetic@example.invalid').ready, true);
  assert.deepEqual(guide.draft, { name: 'Synthetic Visitor', email: 'synthetic@example.invalid', topic: 'support', message: 'I cannot access my lab\n\nSynthetic lab error 42' });
});
test('routes each topic from free text, with general fallback', () => {
  for (const [text, topic] of [['course prices', 'training'], ['lab access', 'support'], ['business partnership', 'business'], ['article correction', 'editorial'], ['privacy request', 'privacy'], ['copyright concern', 'legal'], ['something different', 'general']]) assert.equal(suggestTopic(text), topic);
});
test('skipping extra details does not add skip to the message', () => {
  const guide = createGuide(); guide.reply('A synthetic general enquiry'); guide.reply('skip'); assert.equal(guide.draft.message, 'A synthetic general enquiry');
});
