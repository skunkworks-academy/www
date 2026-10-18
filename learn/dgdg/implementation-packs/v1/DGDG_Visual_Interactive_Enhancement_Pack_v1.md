# DGDG Visual & Interactive Enhancement Pack v1
**Skunkworks Academy · Digital Growth & Demand Generation**  
**Canonical route:** https://www.skunkworksacademy.com/learn/dgdg/  
**Target repository:** skunkworks-academy/www  
**Version:** 1.0 · 18 October 2026  
**Scope:** implementation specification, 10 editable concept diagrams, 40-lesson experience matrix and a functioning dependency-free reference prototype.  
**Release status:** proposal/PR only — **not deployed or merged**.

## Executive brief
Transform the existing **10 courses, 40 lessons, 10 practical labs and 10 formative assessments** into a visual, hands-on learning experience. The guiding cycle is **See → Try → Explain → Apply → Reflect**. Every asset has instructional purpose: no stock imagery for decoration, no faux interactivity and no claim of guaranteed digital-marketing income.

The live repository already uses static HTML, a scoped DGDG stylesheet and browser-side quiz code. This pack augments the existing canonical URLs and Academy shared theme, rather than replacing them with an incompatible framework.

## 1. Outcome-based enhancement contract
Each of the 10 course overviews must offer a labelled concept diagram, 4-stage lesson roadmap, usable course-specific flagship activity, learning objectives, lab evidence and a clear self-paced start.
Each of the 40 lessons must offer an instructive graphic or annotated illustration, a **textual walkthrough**, an outcome-matched task, feedback, a reflective prompt, and a route to the existing workbook/lab. Source concepts and lesson wording must be validated by a subject expert.
Each lab must have a visual procedure, checklist, sample format, evidence download and rubric readiness view; each assessment must have accessible feedback, links to review specific lessons, retry functionality and **no claim of authenticated grading**.

### Core page composition
**Course:** Academy shell → breadcrumbs → illustrated hero → skills/outcomes → progress/roadmap → four illustrated lesson cards → flagship practice tool → lab/assessment/toolkit → next course.  
**Lesson:** shell → progress context → essential SVG + 100–150-word accessible explanation → tabs (Learn | Example | Try | Reflect) → outcome-linked widget → corrective feedback → worksheet → practice-complete action → next lesson.  
**Lab:** case illustration → numbered steps → readiness checks → evidence model → scoring rubric → reflection.  
**Assessment:** 8 existing questions as an accessible fallback → optional progressive one-by-one mode → explanations and review links → practice score, not credential.

## 2. Visual style and constraints
Adopt existing Academy **Ink Navy #03033A, Skunk Blue #1E6BD0, Signal Orange #F24208** and site-wide light/dark rules. Preserve the Academy shared nav/footer, page-contract metadata, typography and canonical URLs. Use original SVGs sized 1200×600 with visible stage labels, minimum 18px text where feasible, descriptive title/description and adjacent accessible text. Prefer diagrams, annotated interfaces, authentic example snapshots and data maps over generic people stock photos. If later using photos, verify licence, attribution, factual relevance and learner consent.

**New shared assets to integrate in production:** `/learn/dgdg/assets/dgdg-interactive-v1.css`, `/learn/dgdg/assets/dgdg-interactive-v1.js`, `/learn/dgdg/assets/diagrams/dgdg-101.svg` through `dgdg-110.svg`, and a manifest-driven component loader. **Do not rename current course routes**.

## 3. Reusable components
| ID | Component | Behaviour and use | Fallback |
|---|---|---|---|
| I01 | Learning roadmap | Four indexed steps, active/complete states; optional explicit device save | Ordered links |
| I02 | Lesson tabs | Four content modes; roving arrow-key focus, correct ARIA | All material available without JS |
| I03 | Accordion | Native details/summary definitions, FAQ and errors | Native openable disclosure |
| I04 | Diagram explorer | Labelled SVG with numeric hotspot buttons and explanation | Text steps describing all stages |
| I05 | Decision challenge | Scenario choices with reasoned feedback | Plain-text model solution |
| I06 | Calculator | Formula, input validation, units, explicit simulated output | Worked equation |
| I07 | Activity checklist | Completion count, clear/reset, optional device storage | Printable checklist |
| I08 | Reflection notebook | Visible notes, explicit save/export/clear controls | Printable workbook |
| I09 | Mini knowledge check | 1–3 inline questions with corrections and remediation | Existing 8-question course assessment |
| I10 | Campaign builder | Form-driven artefact preview, copy/export; no live publishing | Worksheet |
| I11 | KPI visualisation | Data-driven chart + full numeric table; captions and cautions | Data table |
| I12 | Rubric readiness | Criteria coverage and missing-evidence prompts | Plain rubric |

**State & privacy:** keep authentication tokens and personal/customer data out of browser storage. The prototype implements **opt-in local device saving** for non-sensitive learning preferences/notes only, with a visible erase control. Do not treat a local tick or client-side quiz as verified assessment evidence. Academy portal progress is a later authenticated server-side integration subject to access control, consent and retention review.

## 4. Exact course-level plans
### DGDG-101 — Affiliate Marketing Fundamentals
- **Visual:** Referral value exchange — Merchant → Publisher → Buyer → Approved sale.
- **Flagship practice:** undefined.
- **Module interactions:** 1. Affiliate roles and value exchange: relationship-explorer; 2. Customer journey and conversion math: commission-calculator; 3. Offer evaluation and product integrity: offer-scorecard; 4. Promotion ethics and disclosures: disclosure-decision.
- **Applied lab:** undefined.
- **Required supporting evidence:** worked numbers/sample, feedback explanation, exportable notes/checklist; never live personal/customer data.

### DGDG-102 — Niche & Audience Research
- **Visual:** Audience fit and validation — Market niche → Ideal customer → Buyer jobs → Demand test.
- **Flagship practice:** undefined.
- **Module interactions:** 1. Niches, ICPs and personas: persona-builder; 2. Market research with source controls: source-review; 3. Value propositions and buyer jobs: value-proposition-builder; 4. Small-scale demand experiments: experiment-planner.
- **Applied lab:** undefined.
- **Required supporting evidence:** worked numbers/sample, feedback explanation, exportable notes/checklist; never live personal/customer data.

### DGDG-103 — Affiliate Tracking & Attribution
- **Visual:** Observable customer touchpoints — Source → UTM visit → Lead event → Approved ledger.
- **Flagship practice:** undefined.
- **Module interactions:** 1. Events and URL taxonomy: utm-builder; 2. Attribution models: attribution-toggle; 3. Reconciliation and ratios: funnel-calculator; 4. Consent, security and access: data-minimisation-check.
- **Applied lab:** undefined.
- **Required supporting evidence:** worked numbers/sample, feedback explanation, exportable notes/checklist; never live personal/customer data.

### DGDG-104 — Lead Generation & Social Media
- **Visual:** A qualified lead's journey — Channel → Content → Enquiry → Qualified lead.
- **Flagship practice:** undefined.
- **Module interactions:** 1. Channel and audience selection: channel-fit-matrix; 2. Editorial planning and proof: content-calendar; 3. Lead forms, permission and routing: lead-routing-simulator; 4. Channel quality scorecards: lead-quality-calculator.
- **Applied lab:** undefined.
- **Required supporting evidence:** worked numbers/sample, feedback explanation, exportable notes/checklist; never live personal/customer data.

### DGDG-105 — Landing Pages & Sales Funnels
- **Visual:** An accessible conversion journey — Discover → Evaluate → Enquire → Confirm.
- **Flagship practice:** undefined.
- **Module interactions:** 1. Mapping the conversion journey: funnel-hotspots; 2. Page structure and trust signals: landing-anatomy; 3. Usable and lawful forms: form-accessibility-audit; 4. Evidence-led optimisation: ab-test-planner.
- **Applied lab:** undefined.
- **Required supporting evidence:** worked numbers/sample, feedback explanation, exportable notes/checklist; never live personal/customer data.

### DGDG-106 — Email Marketing & AI Automation
- **Visual:** Permission-aware automation — Purpose → Eligibility → Nurture → Exit/opt-out.
- **Flagship practice:** undefined.
- **Module interactions:** 1. List provenance and permitted purpose: consent-decision; 2. Lifecycle design and frequency: nurture-sequence-builder; 3. Automation and reliability: workflow-retry-simulator; 4. Responsible AI copy and analytics: claim-review.
- **Applied lab:** undefined.
- **Required supporting evidence:** worked numbers/sample, feedback explanation, exportable notes/checklist; never live personal/customer data.

### DGDG-107 — Paid Advertising & Traffic
- **Visual:** Controlled paid acquisition — Budget → Targeting → Creative → Qualified lead.
- **Flagship practice:** undefined.
- **Module interactions:** 1. Spend and acquisition economics: cpl-cac-simulator; 2. Keywords, audience and exclusions: keyword-grouping; 3. Creative and destination alignment: ad-landing-match; 4. Campaign controls and release gates: launch-controls.
- **Applied lab:** undefined.
- **Required supporting evidence:** worked numbers/sample, feedback explanation, exportable notes/checklist; never live personal/customer data.

### DGDG-108 — SEO & Content Marketing
- **Visual:** A useful topic cluster — Search intent → Hub page → Guides → Enquiry.
- **Flagship practice:** undefined.
- **Module interactions:** 1. Intent and topic clusters: intent-sort; 2. On-page content architecture: metadata-builder; 3. Fact-checking and editorial governance: source-verification; 4. Content distribution and maintenance: content-maintenance-audit.
- **Applied lab:** undefined.
- **Required supporting evidence:** worked numbers/sample, feedback explanation, exportable notes/checklist; never live personal/customer data.

### DGDG-109 — Marketing Analytics & Conversion
- **Visual:** Metrics to decisions — Events → Cohorts → Analysis → Decision.
- **Flagship practice:** undefined.
- **Module interactions:** 1. Metric definitions and data governance: kpi-tree; 2. Cohort funnels and lag: cohort-comparison; 3. Tests, uncertainty and safety metrics: experiment-design; 4. Executive decisions and improvement: decision-memo.
- **Applied lab:** undefined.
- **Required supporting evidence:** worked numbers/sample, feedback explanation, exportable notes/checklist; never live personal/customer data.

### DGDG-110 — Digital Growth Capstone Project
- **Visual:** End-to-end campaign delivery — Charter → Acquire → Measure → Improve.
- **Flagship practice:** undefined.
- **Module interactions:** 1. Campaign scope and charter: charter-builder; 2. Integration architecture: system-architecture-explorer; 3. Scenario modelling and controls: risk-simulator; 4. Portfolio defence and reflection: portfolio-readiness.
- **Applied lab:** undefined.
- **Required supporting evidence:** worked numbers/sample, feedback explanation, exportable notes/checklist; never live personal/customer data.

The companion **`dgdg-lesson-visual-map.json` contains all 40 exact page paths**, lesson titles, visual focus, interaction type and text-equivalent requirement. The **`dgdg-course-features.json` covers all ten course-level visuals and features**.

## 5. Page interactions, with realistic examples
- **101 net commission:** payout = max(0, approved sales − reversals) × eligible offer value × commission rate. Label as a simulation; specify commission programme rules can differ.
- **102 niche score:** weighted scoring for fit, evidence quality, competitive position and buyer reach; expose the criteria rather than inventing an algorithmic truth.
- **103 UTM builder:** encode non-sensitive campaign labels only; no names, emails or phone numbers in URLs.
- **104 lead-quality calculator:** qualified rate = qualified leads ÷ leads × 100, with zero-denominator guard.
- **105 funnel designer:** show discovery → review → enquiry → confirmation, with step losses and explicit definitions.
- **106 email simulator:** consent eligibility and unsubscribe/exit logic stop an automated chain.
- **107 budget model:** test low, base and high CPL, compute CAC with a separately provided closing rate; never claim forecasts are actual revenue.
- **108 SEO builder:** editable descriptive title/meta and topic cluster with editorial verification reminders.
- **109 KPI sandbox:** event counts and cohorts feeding a small chart and source-linked data table.
- **110 capstone:** integrated readiness gate tied to charter, funnel, tracking, privacy, risk and assessor evidence.

## 6. Accessibility, safety and mobile QA
Target **WCAG 2.2 AA**, which includes minimum target size/spacing rules; use a more comfortable 44×44px internal target for key buttons. Provide keyboard controls, visible focus, 200% zoom, contrast in light/dark, screen-reader announcement for updated results and all essential information without hovering. Respect reduced-motion preference. For charts include units, denominators, sample period, and a table. Avoid drag-only tasks. Tests at 320/390/768/1280px; test using keyboard and an actual screen reader. Source: https://www.w3.org/TR/WCAG22/

Prevent widget outputs with NaN/Infinity/invalid negative sales or refunds. Never have the learning simulator purchase adverts, send outreach or fetch contact lists. Use only mock/sample data. Do not store notes automatically. Any future analytics must be consent-aware and must exclude typed practice data.

## 7. ISO-informed evidence framework
- **ISO 21001:2025:** define learning needs, instructional outcomes, formative feedback, inclusive access and continual improvement. ISO 21001 applies to educational organisational management, **not automatic course certification**. https://www.iso.org/standard/21001
- **ISO 29993:2017:** clear training service information, delivery commitments and evaluation evidence. https://www.iso.org/standard/70357.html
- **ISO 10015:2019:** competency development practices; observable skills tested by lab and instructor review. https://www.iso.org/standard/69459.html
- **ISO/IEC 27001:2022:** privacy/security controls for any future authenticated learner data and integrations.
- **W3C WCAG 2.2 AA:** interface accessibility target requiring real validation.

The original courseware and this UI pack are **standards-informed** and are not ISO-accredited, independently certified or proof of an organisation-wide EOMS. Clause-by-clause conformity claims require licensed standard text and a qualified independent assessment.

## 8. Delivery phases and PR boundaries
**Phase 0 — baseline:** current link inventory, 390px and desktop screenshots, existing visual-regression failures documented.  
**Phase 1 — reusable layer:** CSS scoped under `.dgdg-enhanced`, tabs, diagram, calculator, opt-in local state, checklist, feedback and progressive enhancement. No global CSS changes.  
**Phase 2 — ten overviews:** diagrams/roadmaps/preview tools implemented and verified.  
**Phase 3 — 40 lessons:** meaningful visual + matched interaction + feedback + fallback on every lesson; SME reviews each diagram's factual mapping.  
**Phase 4 — 10 labs and assessments:** interactive lab readiness, source/checklist export, answer-specific remediation and accessibility QA.  
**Phase 5 — release:** CI, contrast, keyboard, screen-reader, responsive and real-browsers smoke, legal/privacy/content approval and monitored live verification.

### Definition of Done
- 10/10 course overviews and 40/40 lessons provide genuinely distinct, outcome-aligned visual learning rather than repeated decoration.
- Existing URLs, canonical metadata and platform shell remain intact.
- 10/10 labs and formative assessments have accessible interactive enhancements and non-JS fallback.
- No broken internal links; mobile and dark/light readability tested; no accessibility P0/P1 defects.
- Curriculum SME, privacy and release owner record review evidence; no ISO certification claims or unverified credential issuance.
- Existing platform-wide visual-regression issues are triaged without weakening approved visual baselines just to pass CI.

## 9. Acceptance test checklist
1. Open all existing 10 course routes and 40 lesson routes; confirm 200 status, correct H1/canonical.
2. Keyboard-only complete tabs, diagram explorer, quiz, calculator and checklist.
3. Switch dark/light and 320/390px viewport; check no core content overflow.
4. Disable JS; lesson teaching content and essential diagram description remain readable.
5. Calculator rejects blank/invalid/negative values and impossible reversals; handles zero safely.
6. Storage default OFF; opt-in explicitly; erase reliably removes all demo device data.
7. Browser score never produces a certificate, course completion record or claim of approved accreditation.
8. Hero visual and lesson illustrations have explanatory captions and meaningful text equivalents.
9. No third-party script or network dependency introduced by the pack.
10. Courseware owner signs off the visual correctness of all 40 modules.

## 10. Pack manifest
- `DGDG_Visual_Interactive_Enhancement_Pack_v1.md` — main specification.
- `dgdg-course-features.json` — course-level feature and diagram specs.
- `dgdg-lesson-visual-map.json` — forty lesson specifications.
- `prototype/index.html` — interactive reference (DGDG-101).
- `prototype/interactive.css` and `prototype/interactive.js` — dependency-free example components.
- `prototype/diagrams/dgdg-101.svg … dgdg-110.svg` — ten editable vector learning diagrams.
- `README.md` — local preview instructions and integration checklist.

### Source-of-truth paths checked
https://github.com/skunkworks-academy/www/blob/main/learn/dgdg/index.html  
https://github.com/skunkworks-academy/www/blob/main/learn/dgdg/courses.json  
https://github.com/skunkworks-academy/www/blob/main/learn/dgdg/assets/dgdg.css  
https://github.com/skunkworks-academy/www/blob/main/learn/dgdg/assets/assessment.js
