# Skunkworks Academy organisation site hardening audit

Date: 2026-06-26
Scope: public Academy organisation web surfaces, navigation consistency, Badge Hub domain migration, portal auth defaults, and metadata correctness.

## Changes applied

- Updated the shared `assets/academy-navigation.js` fallback header to include the full organisation navigation set: Home, AI Learning, Self-paced, Portal, Labs, Badge Hub, Jobs, Media, Security, IBM, Plans and Purchase.
- Rebuilt the global navigation asset with a mobile-safe burger menu and removed the earlier rule that forcibly hid local navigation toggles.
- Migrated Badge Hub references to `https://badging.skunkworksacademy.com/`.
- Rebuilt `skunkworks-academy/badging/index.html` as a clean standalone page with correct canonical, Open Graph, schema URL, repo URL and footer encoding.
- Fixed the Labs metadata from singular `lab.skunkworksacademy.com` to `labs.skunkworksacademy.com`.
- Updated Security, IBM and Media hub navigation to use the new badging domain.
- Updated Portal landing navigation and portal map to include Badge Hub.
- Hardened Portal MSAL defaults in `src/authConfig.ts` with the real delegated API scope and an authority override via `VITE_MSAL_AUTHORITY`.

## Repositories touched

- `skunkworks-academy/.github`
- `skunkworks-academy/badging`
- `skunkworks-academy/labs`
- `skunkworks-academy/security`
- `skunkworks-academy/ibm`
- `skunkworks-academy/media`
- `skunkworks-academy/portal`

## Remaining verification required

1. Confirm GitHub Pages deployment has completed for each touched repository.
2. Re-test live domains after cache/CDN propagation:
   - `https://skunkworksacademy.com/`
   - `https://portal.skunkworksacademy.com/`
   - `https://labs.skunkworksacademy.com/`
   - `https://badging.skunkworksacademy.com/`
   - `https://jobs.skunkworksacademy.com/`
   - `https://media.skunkworksacademy.com/`
   - `https://security.skunkworksacademy.com/`
   - `https://ibm.skunkworksacademy.com/`
3. Confirm `https://badging.skunkworksacademy.com/` DNS and GitHub Pages custom domain are mapped to the `skunkworks-academy/badging` repository.
4. Confirm root site deployment picks up `assets/academy-navigation.js?v=2026.06.26`.
5. Confirm Portal production variables:
   - `VITE_MSAL_CLIENT_ID`
   - `VITE_SKUNKWORKS_TENANT_ID`
   - `VITE_API_SCOPE`
   - optional `VITE_MSAL_AUTHORITY`

## Recommended next controls

- Add a reusable `academy-sites.json` or `academy-sites.js` manifest and generate nav/schema links from that single source.
- Add a CI check that fails when old `badge-hub.skunkworksacademy.com` references are introduced.
- Add a static HTML validation workflow for all public `index.html` pages.
- Add a link checker for canonical URLs, Open Graph URLs, and main navigation targets.
