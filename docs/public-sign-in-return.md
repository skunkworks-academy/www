# Preserve the public page during portal sign-in

The compatibility shell loads `assets/academy-sign-in-return.js` before the course-layout early return. The helper changes only explicit `data-academy-sign-in` links or links labelled Sign in that target the portal root. Ordinary Portal/account links and third-party sign-in links are unchanged. It never reparents page content, prevents default clicks, changes OAuth state or shares authentication tokens.

Approved HTTPS public pages supply their current path, query and anchor in an encoded `returnTo` navigation hint. Exact host matching and rejection of OAuth/nested-redirect parameters mirror `portal/src/public-return.ts`; keep both policies aligned. Late-injected navigation, keyboard activation, modified clicks, context menus and client-side URL changes are covered.

## Rollout

Deploy https://github.com/skunkworks-academy/portal/pull/177 first. The portal validates and retains the hint for at most 30 minutes, then offers **Return to page** and **Open my portal** after MSAL resolves an account. Invalid hints fall back to the existing portal. This helper does not establish a shared authenticated session on public domains.

Run `node --test tests/academy-sign-in-return.test.mjs` (16 focused tests) and `node --check assets/academy-sign-in-return.js`. Before production acceptance, test real Microsoft Entra sign-in from a public page and Connections; verify both choices, cancelled login, deep links and light/dark themes. Local unit/fixture checks are not a full-site or live-authentication certification.
