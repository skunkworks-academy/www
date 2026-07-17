import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();

const catalogPath = 'self-paced/catalog.json';
const legacyCourseFiles = [
  'self-paced/claude/cld-uf-101/index.html',
  'self-paced/claude/cld-uf-101/assets/styles.css',
  'self-paced/claude/cld-uf-101/assets/app.js'
];

const requiredFiles = [
  'self-paced/index.html',
  catalogPath,
  ...legacyCourseFiles
];

const errors = [];

for (const file of requiredFiles) {
  if (!existsSync(join(root, file))) {
    errors.push(`Missing required file: ${file}`);
  }
}

let catalog = null;
if (existsSync(join(root, catalogPath))) {
  try {
    catalog = JSON.parse(readFileSync(join(root, catalogPath), 'utf8'));
  } catch (error) {
    errors.push(`Invalid JSON in ${catalogPath}: ${error.message}`);
  }
}

if (catalog) {
  if (!Array.isArray(catalog.courses) || catalog.courses.length === 0) {
    errors.push(`${catalogPath} must define at least one course.`);
  } else {
    const indexPath = join(root, 'self-paced/index.html');
    const indexContent = existsSync(indexPath) ? readFileSync(indexPath, 'utf8') : '';
    const seenCodes = new Set();
    const seenSlugs = new Set();

    for (const course of catalog.courses) {
      const requiredFields = ['code', 'slug', 'title', 'delivery', 'href', 'enrollmentHref'];
      for (const field of requiredFields) {
        if (!course[field]) errors.push(`Catalog course is missing required field "${field}".`);
      }

      if (course.code) {
        if (seenCodes.has(course.code)) errors.push(`Duplicate course code in catalog: ${course.code}`);
        seenCodes.add(course.code);
      }

      if (course.slug) {
        if (seenSlugs.has(course.slug)) errors.push(`Duplicate course slug in catalog: ${course.slug}`);
        seenSlugs.add(course.slug);

        const landingPage = `self-paced/${course.slug}/index.html`;
        requiredFiles.push(landingPage);
        if (!existsSync(join(root, landingPage))) {
          errors.push(`Missing course landing page: ${landingPage}`);
        }
      }

      if (course.delivery !== 'Self-paced') {
        errors.push(`Course ${course.code || course.slug || '(unknown)'} must use delivery "Self-paced".`);
      }

      if (course.href && !indexContent.includes(course.href)) {
        errors.push(`Self-paced catalog page does not link to ${course.href}.`);
      }

      if (course.code && !indexContent.includes(course.code)) {
        errors.push(`Self-paced catalog page does not display course code ${course.code}.`);
      }
    }
  }

  if (!catalog.accessPolicy || !/enrollment/i.test(catalog.accessPolicy)) {
    errors.push(`${catalogPath} must define an enrollment access policy.`);
  }
}

const requiredContent = [
  {
    file: 'self-paced/index.html',
    text: 'Self-Paced Course Catalog | Skunkworks Academy',
    description: 'catalog page title is present'
  },
  {
    file: 'self-paced/index.html',
    text: 'Students cannot access lessons, assessments, labs or downloads until enrollment is successfully completed',
    description: 'enrollment-gated access notice is present'
  },
  {
    file: 'self-paced/claude/cld-uf-101/index.html',
    text: 'CLD-UF-101 | Claude User Fundamentals | Skunkworks Academy',
    description: 'legacy Claude course page title is present'
  },
  {
    file: 'self-paced/claude/cld-uf-101/index.html',
    text: 'https://skunkworksacademy.com/favicon.ico',
    description: 'legacy Claude course uses the main Skunkworks Academy favicon'
  },
  {
    file: 'self-paced/claude/cld-uf-101/index.html',
    text: 'https://formsubmit.co/training@skunkworksacademy.com',
    description: 'legacy Claude enrolment form submits to the training mailbox'
  },
  {
    file: 'self-paced/claude/cld-uf-101/index.html',
    text: 'Final Knowledge Check',
    description: 'legacy Claude final assessment section exists'
  },
  {
    file: 'self-paced/claude/cld-uf-101/index.html',
    text: 'Capstone Project',
    description: 'legacy Claude capstone section exists'
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
    text: 'pick(questionBank, 50)',
    description: 'final quiz selects 50 randomized MCQs'
  },
  {
    file: 'self-paced/claude/cld-uf-101/assets/app.js',
    text: 'pick(caseBank, 5)',
    description: 'final quiz selects 5 randomized case-study questions'
  }
];

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
  console.error('Self-paced catalog validation failed.');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('Self-paced catalog validation passed.');
console.log(`Validated ${new Set(requiredFiles).size} files, ${catalog?.courses?.length || 0} catalog courses and ${requiredContent.length} content checks.`);
