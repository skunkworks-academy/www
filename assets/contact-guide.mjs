export const topicLabels = { training: 'Training & courses', support: 'Learner & lab support', business: 'Business & partnerships', editorial: 'Editorial correction', privacy: 'Privacy & personal information', legal: 'Legal & rights concerns', general: 'Something else' };
export const topicHints = {
  training: 'Tell us the course or skill, preferred dates and number of learners, if you know them.',
  support: 'Include the course or lab name, what went wrong and any error text. Never include your password.',
  business: 'Tell us about your organisation and what you would like to explore together.',
  editorial: 'Include the page URL, the statement to correct and any supporting context.',
  privacy: 'Describe your privacy question. Please do not upload or include identity documents.',
  legal: 'Include the relevant page URL and a brief description of your concern.',
  general: 'Not sure? Choose “Something else” and we’ll help route your enquiry.'
};
export function suggestTopic(text) {
  const rules = [
    ['privacy', /privacy|personal (data|information)|delete my|data protection/i],
    ['legal', /copyright|legal|rights|trademark/i],
    ['editorial', /correction|incorrect|typo|article|editorial/i],
    ['support', /cannot|can't|unable|not work|broken|error|log.?in|sign.?in|access|lab/i],
    ['business', /partner|business|corporate|organisation|organization|collaborat/i],
    ['training', /train|course|learn|certif|price|cost|enrol|register|schedule/i]
  ];
  return rules.find(([, pattern]) => pattern.test(text))?.[0] || 'general';
}
export function createGuide() {
  let step = 'message';
  const draft = { name: '', email: '', message: '', topic: 'general' };
  return {
    draft,
    reply(text) {
      const value = text.trim();
      if (!value) return { text: 'Type a reply and I’ll help you take the next step.' };
      if (step === 'message') {
        if (value.length < 10) return { text: 'Tell me a little more about what you need help with.' };
        draft.message = value.slice(0, 4000); draft.topic = suggestTopic(value); step = 'details';
        return { text: `I suggest “${topicLabels[draft.topic]}”. You can change that in the form. ${topicHints[draft.topic]} Add any useful detail, or reply “skip”.` };
      }
      if (step === 'details') {
        if (!/^skip[.!]?$/i.test(value)) draft.message += '\n\n' + value.slice(0, 900);
        step = 'name'; return { text: 'What name should the team use when replying?' };
      }
      if (step === 'name') {
        if (value.length > 100) return { text: 'Please keep your name under 100 characters.' };
        draft.name = value; step = 'email'; return { text: 'And what email address should the team reply to?' };
      }
      if (step === 'email') {
        if (value.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return { text: 'That email address doesn’t look complete. Please check it and try again.' };
        draft.email = value; step = 'ready';
        return { text: `Your draft is ready, ${draft.name}. Choose “Review enquiry in the form”, check the details, and send when you’re ready. I haven’t sent anything to the team.`, ready: true };
      }
      return { text: 'Your draft is ready to review. You can make changes in the form before sending.', ready: true };
    }
  };
}
