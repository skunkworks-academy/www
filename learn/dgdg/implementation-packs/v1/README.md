# DGDG Visual & Interactive Enhancement Pack v1

Original learning experience enhancement proposal for the Skunkworks Academy DGDG programme.

## Included
- Main specification: `DGDG_Visual_Interactive_Enhancement_Pack_v1.md`
- Exact ten-course and 40-lesson manifests: `dgdg-course-features.json`, `dgdg-lesson-visual-map.json`
- Ten editable instructional SVG diagrams, each distinct and labelled
- Accessible vanilla-JS reference in `prototype/index.html` (tabs, diagram explorer, calculator, scenario feedback, checklist, local-only opt-in notes and progress)
- Scoped styles in `prototype/interactive.css` and dependency-free JavaScript in `prototype/interactive.js`

## Preview
Open `prototype/index.html` using a local static HTTP server, e.g. `python3 -m http.server 8000` and visit the corresponding URL. No external services or live advertising required.

## Rollout
This is a specification and **reference implementation**, not the 40 live lesson upgrades. Copy vetted styles, SVGs and component methods to `learn/dgdg/assets/` on a separate integration branch, connect each page according to the 40-lesson manifest, run accessibility review and site release tests, then merge after curriculum approval.

**Important:** Do not expose browser grades as verified LMS evidence; no ISO certification or earnings promises.
