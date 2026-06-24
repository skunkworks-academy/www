import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();

const requiredFiles = [
  'self-paced/index.html',
  'self-paced/claude/cld-uf-101/index.html',
  'self-paced/claude/cld-uf-101/assets/styles.css',
  'self-paced/claude/cld-uf-101/assets/app.js'
];

const requiredContent = [
  {
    file: 'self-paced/index.html',
    text: '/self-paced/claude/cld-uf-101/',
    description: 'self-paced index links to CLD-UF-101'
  },
  {
    file: 'self-paced/index.html',
    text: '/pricing.index.html',
    description: 'self-paced index links to pricing'
  },
  {
    file: 'self-paced/claude/cld-uf-101/index.html',
    text: 'CLD-UF-101 Claude User Fundamentals | Self-Paced AI Course | Skunkworks Academy',
    description: 'course page title is present'
  },
  {
    file: 'self-paced/claude/cld-uf-101/index.html',
    text: 'https://skunkworksacademy.com/favicon.ico',
    description: 'legacy favicon reference is present'
  },
  {
    file: 'self-paced/claude/cld-uf-101/index.html',
    text: 'https://formsubmit.co/training@skunkworksacademy.com',
    description: 'enrolment form target is present'
  },
  {
    file: 'self-paced/claude/cld-uf-101/index.html',
    text: 'Final Knowledge Check',
    description: 'final assessment section exists'
  },
  {
    file: 'self-paced/claude/cld-uf-101/index.html',
    text: 'Capstone Project',
    description: 'capstone section exists'
  },
  {
    file: 'self-paced/claude/cld-uf-101/assets/app.js',
    text: 'for (let i = 0; i < 200; i++)',
    description: '200-question MCQ pool generation exists'
  },
  {
    file: 'self-paced/claude/cld-uf-101/assets/app.js',
    text: 'for (let i = 0; i < 50; i++)',
    description: '50-question case-study pool generation exists'
  },
  {
    file: 'self-paced/claude/cld-uf-101/assets/app.js',
    text: "pick(questionBank, 50)",
    description: 'final quiz selects 50 randomized MCQs'
  },
  {
    file: 'self-paced/claude/cld-uf-101/assets/app.js',
    text: "pick(caseBank, 5)",
    description: 'final quiz selects 5 randomized case-study questions'
  }
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
  console.error('CLD-UF-101 self-paced site validation failed.');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('CLD-UF-101 self-paced site validation passed.');
console.log(`Validated ${requiredFiles.length} files and ${requiredContent.length} content checks.`);
