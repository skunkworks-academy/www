# CLD-UF-101 — Claude User Fundamentals

![Course](https://img.shields.io/badge/course-CLD--UF--101-b8563a)
![Level](https://img.shields.io/badge/level-Foundational%20Level%201-2b2723)
![Format](https://img.shields.io/badge/format-Instructor--led%20%7C%20Self--paced-blue)
![Duration](https://img.shields.io/badge/duration-3h%2050m%20ILT%20%7C%204--5h%20self--paced-green)

**Claude User Fundamentals** is a foundational course for knowledge workers and business users who need a practical, non-technical foundation in using Claude for everyday work.

The course takes learners from first principles — what Claude is and where its limits are — through real workplace use cases, prompting, document analysis, Projects, Memory, safe-use practices, and a final hands-on task.

This repository now includes both:

- **Instructor-led edition** — half-day live delivery with instructor facilitation.
- **Online self-paced edition** — complete asynchronous learner pathway with modules, workbook, prompt library, checks, final assessment, capstone, LMS guidance, and static course entry page.

---

## Course Snapshot

| Field | Detail |
|---|---|
| Course code | CLD-UF-101 |
| Course title | Claude User Fundamentals |
| Level | Foundational — Level 1 |
| Audience | Knowledge workers and business users |
| Instructor-led duration | Half-day, approximately 3 hours 50 minutes including breaks |
| Self-paced duration | Approximately 4–5 hours total learner effort |
| Delivery modes | Instructor-led, in-person, live virtual, or online self-paced |
| Prerequisites | None; basic computer and internet literacy only |
| ILT assessment | Knowledge quiz 40% + hands-on lab review 60% |
| Self-paced assessment | Module checks 20% + final knowledge check 40% + capstone 40% |
| Passing criteria | 70% combined score and completed practical/capstone activity |

---

## Learning Outcomes

By the end of this course, learners will be able to:

1. Explain what Claude is, how it differs from a search engine, and where its limitations are.
2. Start and manage conversations across web, desktop, and mobile interfaces.
3. Apply Claude to five core workplace use cases: writing, summarization, brainstorming, analysis, and Q&A.
4. Write clear prompts that include audience, context, constraints, examples, tone, and output format.
5. Upload and work with documents, files, screenshots, and structured outputs.
6. Use Projects, custom instructions, and Memory to support recurring work.
7. Identify situations where Claude output needs verification or caution.
8. Complete one real work task using the course methodology.

---

## Course Structure

| Unit | Topic | ILT Duration | Self-Paced Duration | Main activity |
|---:|---|---:|---:|---|
| 1 | Introduction to Claude | 20 min | 30 min | AI experience reflection and limits check |
| 2 | Getting Started | 25 min | 30 min | Send a first Claude message about learner role |
| 3 | Core Use Cases | 40 min | 45 min | Complete one real task using a core use case |
| 4 | Effective Prompting | 35 min | 45 min | Improve an earlier prompt and compare results |
| 5 | Working with Documents and Files | 30 min | 40 min | Upload a safe document and ask targeted questions |
| 6 | Projects and Memory | 25 min | 35 min | Map recurring tasks to context features |
| 7 | Best Practices and Pitfalls | 25 min | 40 min | Build a personal verification list |
| 8 | Hands-On Practice / Capstone | 30 min | 60 min | Complete and review a real work task |

---

## Online Self-Paced Edition

The self-paced course is available in [`self-paced/`](./self-paced/).

Key entry points:

- [`self-paced/README.md`](./self-paced/README.md) — self-paced course overview
- [`self-paced/index.html`](./self-paced/index.html) — static course landing page with browser-based progress tracking
- [`self-paced/course-map.yml`](./self-paced/course-map.yml) — LMS-friendly course metadata
- [`self-paced/modules/`](./self-paced/modules/) — full learner module content
- [`self-paced/resources/learner-workbook.md`](./self-paced/resources/learner-workbook.md) — learner workbook
- [`self-paced/resources/prompt-library.md`](./self-paced/resources/prompt-library.md) — reusable prompt library
- [`self-paced/resources/verification-checklist.md`](./self-paced/resources/verification-checklist.md) — responsible-use checklist
- [`self-paced/assessments/final-knowledge-check.md`](./self-paced/assessments/final-knowledge-check.md) — final quiz
- [`self-paced/assessments/capstone-project.md`](./self-paced/assessments/capstone-project.md) — capstone project brief
- [`self-paced/lms/implementation-guide.md`](./self-paced/lms/implementation-guide.md) — LMS deployment guide

---

## Repository Structure

```text
.
├── README.md
├── course.yml
├── docs/
│   ├── student-guide.md
│   ├── instructor-guide.md
│   └── facilitation-plan.md
├── activities/
│   └── hands-on-labs.md
├── assessments/
│   ├── quiz.md
│   └── lab-review-rubric.md
├── self-paced/
│   ├── README.md
│   ├── course-map.yml
│   ├── index.html
│   ├── assets/
│   │   ├── course.css
│   │   └── course.js
│   ├── modules/
│   │   ├── module-01-introduction.md
│   │   ├── module-02-getting-started.md
│   │   ├── module-03-core-use-cases.md
│   │   ├── module-04-effective-prompting.md
│   │   ├── module-05-documents-files.md
│   │   ├── module-06-projects-memory.md
│   │   ├── module-07-best-practices-pitfalls.md
│   │   └── module-08-capstone-qa.md
│   ├── resources/
│   │   ├── prompt-library.md
│   │   ├── learner-workbook.md
│   │   ├── verification-checklist.md
│   │   └── ai-use-policy-template.md
│   ├── assessments/
│   │   ├── module-knowledge-checks.md
│   │   ├── final-knowledge-check.md
│   │   ├── capstone-project.md
│   │   └── grading-guide.md
│   └── lms/
│       ├── implementation-guide.md
│       ├── scorm-readme.md
│       └── imsmanifest.xml
├── slides/
│   └── README.md
├── website/
│   └── index.html
└── .github/
    └── workflows/
        └── markdown-check.yml
```

---

## Assessment Model

### Instructor-Led Edition

| Component | Weight | Evidence |
|---|---:|---|
| Knowledge quiz | 40% | Short quiz covering Claude concepts, prompting, document/file workflows, Projects/Memory, and safe-use practices |
| Hands-on lab review | 60% | Instructor-reviewed real task from Unit 8 |

### Self-Paced Edition

| Component | Weight | Evidence |
|---|---:|---|
| Module knowledge checks | 20% | Formative checks after each module |
| Final knowledge check | 40% | 20-question final assessment |
| Capstone project | 40% | Real or realistic task with prompt, iteration, verification, and workplace application |

Learners pass with **70% or higher combined**, provided the practical/capstone activity is completed and reviewed.

---

## Instructor and LMS Delivery Notes

The course is designed to be practical and low-friction:

- Keep the tone non-technical and workplace-oriented.
- Use real tasks rather than toy examples.
- Reinforce iteration: the first response is a draft.
- Reinforce that Claude augments judgment; it does not replace verification or decision ownership.
- Defer organization-specific privacy and AI usage rules to the client’s approved policy owner.
- For self-paced LMS deployment, use the implementation guide in `self-paced/lms/`.

---

## Pathway

```text
CLD-UF-101 Claude User Fundamentals
        ↓
CLD-DEV-201 Claude for Developers
```

CLD-UF-101 is sufficient for many non-technical users. Learners who write code or work closely with engineering teams should progress to **CLD-DEV-201: Claude for Developers**.

---

## Maintainers

**Skunkworks Academy**  
Website: https://www.skunkworksacademy.com  
Training contact: training@skunkworks.africa
