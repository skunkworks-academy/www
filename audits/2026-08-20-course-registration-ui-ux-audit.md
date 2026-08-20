# Course Registration UI/UX Audit — 2026-08-20

Scope: `course-registration/` in `skunkworks-academy/www`.

## Active runtime documents

- `course-registration/index.html`
- `course-registration/thank-you.html`
- `course-registration/skunkworks-academy-cyber-security-training-email.html`

`index.html.bak-20260624-104719` is an archival backup, not an active route, and is intentionally left unchanged so it remains a historical recovery copy.

## Findings addressed

1. **Duplicate/local navigation styling** — the registration page had a custom sticky top bar in addition to the Academy global shell. The page now uses the canonical Academy navigation runtime and design system.
2. **Non-canonical registration redirect** — FormSubmit `_next` pointed at an old GitHub Pages path. It now returns to `https://www.skunkworksacademy.com/course-registration/thank-you.html`.
3. **Stale intake copy** — hard-coded June 2026 wording was removed from the registration route and email template in favour of evergreen/current-intake wording.
4. **Encoding corruption** — mojibake such as `â€¢`, `âœ“` and `Â©` was removed from active registration content.
5. **Theme inconsistency** — a dedicated registration stylesheet now maps components to Academy light/dark semantic surfaces and supports explicit light, explicit dark and system dark preferences.
6. **Foreground/background contrast** — headings, body text, inputs, controls, cards and inverse hero surfaces use deterministic foreground/background pairs. Existing Academy accessibility and page-contract layers remain loaded.
7. **Mobile responsiveness** — registration layout collapses from two columns to one, form fields collapse to a single column, buttons become full width, sticky supporting content becomes static, and additional 640px/360px protections prevent horizontal overflow.
8. **Touch targets and focus** — primary controls are at least 44px high and receive visible keyboard focus outlines.
9. **Form feedback** — invalid email/phone input now produces an `aria-live` error message and moves focus to the invalid field.
10. **Confirmation redirect safety** — return URLs are constrained to the same origin. The confirmation page also includes a user-controlled way to cancel automatic redirection.
11. **Email responsiveness** — the training email retains table-based email compatibility, a 640px stacking breakpoint, full-width mobile buttons and a `prefers-color-scheme: dark` presentation.
12. **Favicons** — all active HTML documents retain the canonical four-link Academy browser-tab favicon set.

## Automated regression coverage

`npm run validate:course-registration` statically checks all three active documents for:

- canonical favicon declarations;
- viewport metadata;
- encoding corruption;
- canonical Academy design/runtime hooks;
- canonical FormSubmit redirect;
- required registration controls;
- responsive CSS breakpoints;
- explicit light/dark/system theme support;
- email mobile layout contract.

`tests/course-registration-ui.spec.js` runs Chromium interaction tests at:

- 1440 × 900
- 1024 × 768
- 768 × 1024
- 390 × 844
- 320 × 568

The browser suite checks horizontal overflow, control target sizes, favicon presence, form validation/focus behaviour, light/dark text contrast, confirmation same-origin redirect protection and mobile email width.

The `UX and load regression` workflow installs Chromium with Playwright and runs these tests on push, pull request and manual dispatch.
