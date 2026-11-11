# Skunkworks Academy training for IBM technologies

Canonical route: `https://www.skunkworksacademy.com/ibm/`.

This is the public course discovery and training-enquiry surface, not a new authenticated LMS. It retains the canonical Academy navigation, footer, theme switching and registration form. Existing IBM lesson routes remain intact. It replaces the old page's mixed Bootstrap/Tailwind/legacy Carbon stack, simulated enrolment/progress, and unsupported success metrics.

## Design and learning contract

- Carbon Design System `@carbon/styles` 1.119.0 buttons, tags, theme and layout tokens, compiled into CSS scoped to `#ibm-learning`.
- IBM Plex Sans 1.1.0 fonts served locally. Carbon Apache-2.0 and Plex OFL notices are in `assets/ibm-licenses`. No runtime component CDN is required.
- Skunkworks Academy is the prominent provider identity in the masthead and hero. The page explicitly identifies its operator and says it is not an official IBM website. IBM is referenced in text as the technology/course source; no standalone IBM logo or partner badge appears on this portal.
- The Academy shell retains its global typography and identity UX. Carbon components are scoped to the content region and use Academy blue, navy and orange accents, without changing other vendor pages. The introductory panel describes the Skunkworks training-planning process rather than imitating IBM corporate artwork.
- IBM trademark attribution is included. These branding changes do not establish permission to redistribute catalogue content or legal approval; those rights remain separate from Carbon's code licence.
- Course search supports code/title/content, technology, source skill level, current/reference status and pagination. Topic groupings are Academy navigation categories, not IBM certification pathways.
- Detail dialogs expose IBM-provided overview, intended audience, prerequisites, objectives and topics. Missing fields are identified. Source links go to IBM Training. No invented lab, assessment, accreditation or completion evidence.
- Course details have shareable `?course=CODE` URLs. Search/family/level/status filters survive URL sharing. The shortlist stores only up to 30 course codes on the current browser. It is not an account profile or enrolment.
- Enquiries use the existing registration route and preserve course codes and titles. Registration prefill is isolated to `source=ibm-learning`; schedule and other registration integrations are unchanged. No enquiry is sent by browsing, testing or saving a course.

## Catalogue provenance and refresh

Source: `https://www.ibm.com/training/files/GTPjson/CourseFeed_Global.json`.

`data/ibm-learning/catalogue.json` records retrieval time, source SHA-256 and record count. Data is imported as text and rendered with `textContent`, not injected HTML. Source PRICE fields are deliberately omitted: they do not establish learner tuition or currency. Content availability does not establish Academy delivery rights or instructor/lab readiness.

Current content requires Content Available, a valid future expiry date and no replacement/retirement reason. This is evaluated at view time. All other rows remain accessible as reference records, with alternative-training enquiry wording. A snapshot older than 30 days displays a freshness warning.

Refresh with `node scripts/import-ibm-learning.mjs` (or pass a downloaded feed file as the first argument). The importer fails on empty/invalid/duplicate identities and only replaces the snapshot after successful validation. Review the resulting diff and run checks before publication. This change does not install a scheduled updater or claim live synchronization.

The scheduling work in PR #151 owns public class dates. This page works independently while that PR is pending; it neither fabricates dates nor links to a schedule that is not yet deployed. Later integration should join confirmed sessions by IBM course code, not title.

## Build and verify

```sh
npm ci --prefix tools/ibm-portal --ignore-scripts
npm --prefix tools/ibm-portal run build
npm run build
node --test tests/ibm-learning.test.mjs
npm --prefix tools/ibm-portal test
```

The browser test configuration starts `tools/ibm-portal/serve.py` on localhost:4188 and handles JavaScript-module MIME types explicitly. Windows tests use installed Edge; Linux uses Playwright Chromium (`npx playwright install --with-deps chromium`). Tests cover enquiry prefill, shortlist persistence, deep links, reference statuses, failure/retry, keyboard dismissal, mobile/tablet/desktop, light/dark, a single shared header/footer, overflow and axe WCAG A/AA checks within the IBM surface. They do not submit a real training enquiry or prove live sign-in.

For a local preview, run `python tools/ibm-portal/serve.py` and open `http://127.0.0.1:4188/ibm/`. Production publication requires the usual reviewed PR and successful deployment; a local build is not a live release.
