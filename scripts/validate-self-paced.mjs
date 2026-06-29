import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();

const requiredFiles = [
  'self-paced/index.html',
  'self-paced/claude/cld-uf-101/index.html',
  'self-paced/claude/cld-uf-101/assets/styles.css',
  'self-paced/claude/cld-uf-101/assets/app.js',
  'self-paced/microsoft/ms-saas-plan-101/index.html',
  'self-paced/microsoft/ms-saas-plan-101/assets/styles.css',
  'self-paced/microsoft/ms-saas-plan-101/assets/app.js',
  'self-paced/microsoft/d365-ce-bp-101/index.html',
  'self-paced/microsoft/d365-ce-bp-101/assets/styles.css',
  'self-paced/microsoft/d365-ce-bp-101/assets/app.js',
  'self-paced/microsoft/ms-mp-bp-101/index.html',
  'self-paced/microsoft/ms-mp-bp-101/assets/styles.css',
  'self-paced/microsoft/ms-mp-bp-101/assets/app.js'
];

const requiredContent = [
  { file: 'self-paced/index.html', text: '/self-paced/claude/cld-uf-101/', description: 'self-paced index links to CLD-UF-101' },
  { file: 'self-paced/index.html', text: '/pricing.index.html', description: 'self-paced index links to pricing' },
  { file: 'self-paced/index.html', text: '/self-paced/microsoft/ms-saas-plan-101/', description: 'self-paced index links to MS-SaaS-PLAN-101' },
  { file: 'self-paced/index.html', text: 'MS-SaaS-PLAN-101 · Create Plans for a SaaS Offer', description: 'self-paced index lists the Microsoft SaaS plan course card' },
  { file: 'self-paced/index.html', text: '/self-paced/microsoft/d365-ce-bp-101/', description: 'self-paced index links to D365-CE-BP-101' },
  { file: 'self-paced/index.html', text: 'D365-CE-BP-101 · Dynamics 365 Customer Engagement Best Practices', description: 'self-paced index lists the Dynamics CE best practices course card' },
  { file: 'self-paced/index.html', text: '/self-paced/microsoft/ms-mp-bp-101/', description: 'self-paced index links to MS-MP-BP-101' },
  { file: 'self-paced/index.html', text: 'MS-MP-BP-101 · Create a Business Profile for Microsoft Marketplace', description: 'self-paced index lists the Marketplace business profile course card' },
  { file: 'self-paced/claude/cld-uf-101/index.html', text: 'CLD-UF-101 Claude User Fundamentals | Self-Paced AI Course | Skunkworks Academy', description: 'course page title is present' },
  { file: 'self-paced/claude/cld-uf-101/index.html', text: 'https://skunkworksacademy.com/favicon.ico', description: 'legacy favicon reference is present' },
  { file: 'self-paced/claude/cld-uf-101/index.html', text: 'https://formsubmit.co/training@skunkworksacademy.com', description: 'enrolment form target is present' },
  { file: 'self-paced/claude/cld-uf-101/index.html', text: 'Final Knowledge Check', description: 'final assessment section exists' },
  { file: 'self-paced/claude/cld-uf-101/index.html', text: 'Capstone Project', description: 'capstone section exists' },
  { file: 'self-paced/claude/cld-uf-101/assets/app.js', text: 'for (let i = 0; i < 200; i++)', description: '200-question MCQ pool generation exists' },
  { file: 'self-paced/claude/cld-uf-101/assets/app.js', text: 'for (let i = 0; i < 50; i++)', description: '50-question case-study pool generation exists' },
  { file: 'self-paced/claude/cld-uf-101/assets/app.js', text: "pick(questionBank, 50)", description: 'final quiz selects 50 randomized MCQs' },
  { file: 'self-paced/claude/cld-uf-101/assets/app.js', text: "pick(caseBank, 5)", description: 'final quiz selects 5 randomized case-study questions' },
  { file: 'self-paced/microsoft/ms-saas-plan-101/index.html', text: 'MS-SaaS-PLAN-101 Create Plans for a SaaS Offer | Self-Paced Microsoft Course | Skunkworks Academy', description: 'Microsoft SaaS plan course page title is present' },
  { file: 'self-paced/microsoft/ms-saas-plan-101/index.html', text: 'Create Plans for a SaaS Offer', description: 'Microsoft SaaS plan course heading is present' },
  { file: 'self-paced/microsoft/ms-saas-plan-101/index.html', text: 'https://learn.microsoft.com/en-us/partner-center/marketplace-offers/create-new-saas-offer-plans', description: 'course links to primary Microsoft Learn source' },
  { file: 'self-paced/microsoft/ms-saas-plan-101/index.html', text: 'https://formsubmit.co/training@skunkworksacademy.com', description: 'Microsoft course enrolment form target is present' },
  { file: 'self-paced/microsoft/ms-saas-plan-101/index.html', text: 'Final Knowledge Check', description: 'Microsoft course final assessment section exists' },
  { file: 'self-paced/microsoft/ms-saas-plan-101/index.html', text: 'Capstone Project', description: 'Microsoft course capstone section exists' },
  { file: 'self-paced/microsoft/ms-saas-plan-101/assets/app.js', text: 'for (let i = 0; i < 200; i++)', description: 'Microsoft course 200-question MCQ pool generation exists' },
  { file: 'self-paced/microsoft/ms-saas-plan-101/assets/app.js', text: 'for (let i = 0; i < 50; i++)', description: 'Microsoft course 50-question case-study pool generation exists' },
  { file: 'self-paced/microsoft/ms-saas-plan-101/assets/app.js', text: "pick(questionBank, 50)", description: 'Microsoft course final quiz selects 50 randomized MCQs' },
  { file: 'self-paced/microsoft/ms-saas-plan-101/assets/app.js', text: "pick(caseBank, 5)", description: 'Microsoft course final quiz selects 5 randomized case-study questions' },
  { file: 'self-paced/microsoft/d365-ce-bp-101/index.html', text: 'D365-CE-BP-101 Best Practices for Developing with Dynamics 365 Customer Engagement | Self-Paced Microsoft Course | Skunkworks Academy', description: 'Dynamics CE best practices course page title is present' },
  { file: 'self-paced/microsoft/d365-ce-bp-101/index.html', text: 'https://formsubmit.co/training@skunkworksacademy.com', description: 'Dynamics CE course enrolment form target is present' },
  { file: 'self-paced/microsoft/d365-ce-bp-101/index.html', text: 'Final Knowledge Check', description: 'Dynamics CE final assessment section exists' },
  { file: 'self-paced/microsoft/d365-ce-bp-101/index.html', text: 'Capstone Project', description: 'Dynamics CE capstone section exists' },
  { file: 'self-paced/microsoft/d365-ce-bp-101/index.html', text: 'https://learn.microsoft.com/en-us/dynamics365/', description: 'Dynamics CE course links to Microsoft Dynamics 365 documentation' },
  { file: 'self-paced/microsoft/d365-ce-bp-101/assets/app.js', text: 'for (let i = 0; i < 200; i++)', description: 'Dynamics CE 200-question MCQ pool generation exists' },
  { file: 'self-paced/microsoft/d365-ce-bp-101/assets/app.js', text: 'for (let i = 0; i < 50; i++)', description: 'Dynamics CE 50-question case-study pool generation exists' },
  { file: 'self-paced/microsoft/d365-ce-bp-101/assets/app.js', text: "pick(questionBank, 50)", description: 'Dynamics CE final quiz selects 50 randomized MCQs' },
  { file: 'self-paced/microsoft/d365-ce-bp-101/assets/app.js', text: "pick(caseBank, 5)", description: 'Dynamics CE final quiz selects 5 randomized case-study questions' },
  { file: 'self-paced/microsoft/ms-mp-bp-101/index.html', text: 'MS-MP-BP-101 Create a Business Profile for Microsoft Marketplace to Get Sales Leads and Referrals | Self-Paced Microsoft Course | Skunkworks Academy', description: 'Marketplace business profile course page title is present' },
  { file: 'self-paced/microsoft/ms-mp-bp-101/index.html', text: 'https://formsubmit.co/training@skunkworksacademy.com', description: 'Marketplace business profile course enrolment form target is present' },
  { file: 'self-paced/microsoft/ms-mp-bp-101/index.html', text: 'Final Knowledge Check', description: 'Marketplace business profile final assessment section exists' },
  { file: 'self-paced/microsoft/ms-mp-bp-101/index.html', text: 'Capstone Project', description: 'Marketplace business profile capstone section exists' },
  { file: 'self-paced/microsoft/ms-mp-bp-101/index.html', text: 'https://learn.microsoft.com/en-us/partner-center/', description: 'Marketplace business profile course links to Microsoft Partner Center documentation' },
  { file: 'self-paced/microsoft/ms-mp-bp-101/assets/app.js', text: 'for (let i = 0; i < 200; i++)', description: 'Marketplace business profile 200-question MCQ pool generation exists' },
  { file: 'self-paced/microsoft/ms-mp-bp-101/assets/app.js', text: 'for(let i=0;i<50;i++)', description: 'Marketplace business profile 50-question case-study pool generation exists' },
  { file: 'self-paced/microsoft/ms-mp-bp-101/assets/app.js', text: 'pick(questionBank,50)', description: 'Marketplace business profile final quiz selects 50 randomized MCQs' },
  { file: 'self-paced/microsoft/ms-mp-bp-101/assets/app.js', text: 'pick(caseBank,5)', description: 'Marketplace business profile final quiz selects 5 randomized case-study questions' }
];

const errors = [];

for (const file of requiredFiles) {
  if (!existsSync(join(root, file))) {
    errors.push(`Missing required file: ${file}`);
  }
}

for (const check of requiredContent) {
  const fullPath = join(root, check.file);
  if (!existsSync(fullPath)) {
    errors.push(`Cannot check missing file: ${check.file}`);
    continue;
  }
  const content = readFileSync(fullPath, 'utf8');
  if (!content.includes(check.text)) {
    errors.push(`Missing expected content in ${check.file}: ${check.description}`);
  }
}

if (errors.length) {
  console.error('Self-paced site validation failed.');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('Self-paced site validation passed.');
console.log(`Validated ${requiredFiles.length} files and ${requiredContent.length} content checks.`);
