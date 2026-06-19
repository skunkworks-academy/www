# CLD-UF-101 LMS Implementation Guide

This guide explains how to deploy the online self-paced edition of **CLD-UF-101 — Claude User Fundamentals** into an LMS.

---

## 1. Recommended LMS Course Settings

| Setting | Recommendation |
|---|---|
| Course type | Self-paced / asynchronous |
| Visibility | Enrolled learners only or public catalogue preview |
| Module release | Sequential |
| Completion tracking | Enabled |
| Estimated duration | 4–5 hours |
| Certificate | Enabled after passing criteria are met |
| Attempts | Two attempts for final knowledge check recommended |
| Capstone | Required upload or text response |

---

## 2. Course Structure

Create eight LMS sections:

1. Introduction to Claude
2. Getting Started
3. Core Use Cases
4. Effective Prompting
5. Working with Documents and Files
6. Projects and Memory
7. Best Practices and Pitfalls
8. Capstone Practice and Reflection

Each section should include:

- Module reading content
- Practice activity
- Knowledge check
- Workbook prompt or reflection
- Completion checkpoint

---

## 3. LMS Content Mapping

| LMS Section | Source File |
|---|---|
| Course overview | `self-paced/README.md` |
| Course map | `self-paced/course-map.yml` |
| Module 1 | `self-paced/modules/module-01-introduction.md` |
| Module 2 | `self-paced/modules/module-02-getting-started.md` |
| Module 3 | `self-paced/modules/module-03-core-use-cases.md` |
| Module 4 | `self-paced/modules/module-04-effective-prompting.md` |
| Module 5 | `self-paced/modules/module-05-documents-files.md` |
| Module 6 | `self-paced/modules/module-06-projects-memory.md` |
| Module 7 | `self-paced/modules/module-07-best-practices-pitfalls.md` |
| Module 8 | `self-paced/modules/module-08-capstone-qa.md` |
| Prompt library | `self-paced/resources/prompt-library.md` |
| Learner workbook | `self-paced/resources/learner-workbook.md` |
| Verification checklist | `self-paced/resources/verification-checklist.md` |
| Final knowledge check | `self-paced/assessments/final-knowledge-check.md` |
| Capstone project | `self-paced/assessments/capstone-project.md` |
| Grading guide | `self-paced/assessments/grading-guide.md` |

---

## 4. Assessment Configuration

### Module Checks

- Question type: multiple choice, true/false, short answer
- Attempts: unlimited or two attempts
- Feedback: show immediately
- Weight: 20% total or completion-only

### Final Knowledge Check

- 20 questions
- Recommended time limit: 30 minutes
- Attempts: 2
- Passing score: 70%
- Weight: 40%

### Capstone Project

Submission type:

- Text entry, document upload, or LMS assignment

Required fields:

- Task description
- Use case selected
- Initial prompt
- Follow-up prompt
- Output summary
- Verification list
- Workplace application

Weight: 40%

---

## 5. Completion Rules

Recommended completion rule:

Learner completes the course when all conditions are true:

1. All eight modules are marked complete.
2. Module checks are attempted.
3. Final knowledge check score is 70% or higher.
4. Capstone project is submitted.
5. Capstone project is marked complete or scored 70% or higher.

---

## 6. Certificate Text

Suggested certificate title:

> Certificate of Completion — CLD-UF-101 Claude User Fundamentals

Suggested description:

> Awarded for successful completion of the online self-paced Claude User Fundamentals course, including knowledge checks and a practical capstone demonstrating responsible Claude use for workplace productivity.

---

## 7. Accessibility Notes

When converting Markdown to LMS pages:

- Use proper heading structure.
- Preserve tables with header rows.
- Provide descriptive link text.
- Avoid relying on colour alone for meaning.
- Ensure quizzes are keyboard navigable.
- Provide downloadable resources in accessible formats where possible.

---

## 8. Quality Assurance Checklist

Before launch, confirm:

- All module links work.
- All downloadable resources open correctly.
- Quiz answers and scoring are correct.
- Capstone assignment accepts submissions.
- Completion criteria trigger correctly.
- Certificate issues only after passing criteria are met.
- Data/privacy warnings are visible before file-upload activities.
- Learners know who to contact for support.

---

## 9. Suggested LMS Tags

- AI Literacy
- Claude
- Generative AI
- Prompting
- Productivity
- Responsible AI
- Business Skills
- Digital Transformation
- Self-Paced
- Foundational
