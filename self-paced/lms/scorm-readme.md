# SCORM Packaging Notes — CLD-UF-101

This folder contains a basic SCORM-style manifest placeholder for packaging the self-paced course into an LMS.

---

## Recommended Packaging Approach

For production LMS delivery, package the self-paced course as either:

1. **Native LMS modules** — recommended for easier tracking, quiz control, and capstone grading.
2. **SCORM 1.2 or SCORM 2004 package** — useful where the LMS requires a portable package.
3. **Static website package** — useful for internal portals or GitHub Pages-style delivery.

---

## Static Package Contents

Include:

```text
self-paced/index.html
self-paced/assets/course.css
self-paced/assets/course.js
self-paced/modules/*.md
self-paced/resources/*.md
self-paced/assessments/*.md
self-paced/lms/imsmanifest.xml
```

For a polished SCORM package, convert module Markdown files to HTML pages and link them from `index.html`.

---

## Tracking Recommendation

The included static JavaScript tracks progress in local browser storage only. It is not a replacement for LMS-grade tracking.

For LMS tracking, configure:

- Module completion status
- Knowledge-check scores
- Final assessment score
- Capstone submission status
- Certificate trigger

---

## Production SCORM Requirements

A production SCORM build should include:

- HTML versions of all modules
- SCORM API wrapper
- Completion reporting
- Score reporting
- Exit/suspend data support
- LMS launch testing
- Browser compatibility testing

---

## QA Checklist

Before uploading to the LMS:

- Confirm manifest identifiers are unique.
- Confirm all referenced files exist.
- Confirm launch file opens.
- Confirm navigation works offline in the package.
- Confirm score/completion reporting if SCORM tracking is implemented.
- Confirm course title and metadata display correctly.
