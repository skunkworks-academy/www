# Skunkworks Academy organisation global navigation audit

Date: 2026-07-04
Scope: organisation-level public web repositories, static HTML pages, React/Docusaurus surfaces, page headers, menu navigation blocks, logo handling, burger menus, and global theme consistency.

## Executive decision

All Skunkworks Academy web properties must use the shared global navigation asset as the single source of truth:

```html
<script defer src="https://skunkworksacademy.com/assets/academy-navigation.js?v=2026.07.04" data-skunkworks-global-nav="v3"></script>
```

No repository should maintain its own public top-header menu, desktop nav list, logo switcher, navbar, or burger-menu implementation unless it is an application-internal sidebar or authenticated workspace navigation.

## Canonical global menu

The organisation-level public menu is now limited to:

```text
Home
Self-paced
Portal
Labs
Plans
Purchase
```

The brand remains visible by default. The menu links are hidden by default and are shown only after the burger button is clicked.

## Canonical logo assets

```text
https://raw.githubusercontent.com/skunkworks-academy/.github/refs/heads/main/images/favicon-black.png
https://raw.githubusercontent.com/skunkworks-academy/.github/refs/heads/main/images/favicon-white.png
```

## Changes applied

### skunkworks-academy/.github

- Updated `assets/academy-navigation.js` to `data-skunkworks-global-header="v3"`.
- Removed the desktop always-visible global menu behaviour.
- Enforced burger-only global navigation across desktop and mobile.
- Reduced the public menu set to Home, Self-paced, Portal, Labs, Plans, and Purchase.
- Kept the Skunkworks Academy brand and logo visible in the top bar.
- Added `document.body.classList.add('swa-has-global-nav')` so application-specific fallback headers can hide themselves when the central shell is loaded.
- Expanded replacement selectors to replace older local headers such as `site-header`, `sk-topbar`, `header.top`, and `[data-sk-nav-shell]`.

### skunkworks-academy/portal

- Updated `index.html` to reference `academy-navigation.js?v=2026.07.04` with `data-skunkworks-global-nav="v3"`.
- Updated `public/termsofservice/index.html` to remove the duplicate old navigation reference and use only the v3 shared asset.
- Previous portal React header compatibility work remains in place, but the central global shell now takes precedence when loaded.

### skunkworks-academy/academy-validation

- Added `rules/global-navigation.json`.
- Added `scripts/audit-global-navigation.mjs`.
- Added `npm run audit:global-nav`.
- Documented the rule that repositories should reference the shared navigation asset and should not maintain duplicated local top-nav structures.

## Audit signals found

The organisation tree shows multiple public website surfaces that need governance, including:

```text
.github
portal
www
jobs
labs
labs-catalog
badging
dashboard
ibm
microsoft
security
media
classrooms
academy-portal
academy-validation
```

Search signals found in GitHub include:

```text
site-header
navbar
menu-toggle
nav-toggle
data-sk-nav
sk-topbar
academy-navigation.js
```

These patterns indicate that older page-level headers still exist in parts of the organisation and must be replaced, suppressed, or converted to the central global shell reference.

## Highest-risk repositories

| Repository | Risk | Reason |
|---|---:|---|
| `.github` | High | Main website repository with many static HTML pages and historical local navigation patterns. |
| `portal` | High | React app plus static legal pages; already has central shell reference but still has app-level fallback header. |
| `jobs` | Medium | Separate public subdomain and documented navigation standard. |
| `labs` | Medium | Uses shared include-based static site assets. |
| `ibm` | Medium | Separate public subdomain with static course pages and 404 page. |
| `microsoft` | Medium | Many static/product training pages. |
| `badging` | Medium | Public subdomain with standalone HTML and prior mobile UI fixes. |
| `dashboard` | Medium | Standalone static site with CSS/JS. |
| `security` | Medium | Public subdomain pages. |
| `media` | Medium | Public subdomain page. |

## Required remediation rule

Every public static page or app shell must do one of the following:

1. Include the canonical global navigation script in the page head.
2. Use a build template or include file that injects the canonical script.
3. Use the central React/app wrapper that loads the canonical script.

The following must be treated as failures in public page headers:

```text
local header nav menus
navbar blocks
site-header blocks
page-specific burger menus
page-specific logo-light/logo-dark switching
hard-coded top menu link groups
old academy-navigation.js cache keys
```

## Validation command

From a checked-out repository or organisation folder:

```bash
npm run audit:global-nav -- /path/to/repo-or-organisation-checkout
```

from the `academy-validation` repository.

## Follow-up items

- Update `portal/public/privacystatement/index.html` to remove the duplicate old navigation asset reference. The attempted connector update was blocked, so this remains open.
- Update remaining pages that reference `academy-navigation.js?v=2026.06.23`, `v=2026.06.24`, or `v=2026.06.26` to `v=2026.07.04`.
- Run the new validator locally against the organisation checkout.
- Add the validator as a GitHub Actions prerequisite in each public web repository.
- For Docusaurus repositories, inject the global navigation asset through the site config or root layout instead of editing generated build output.
- For Jekyll/static repos, inject the global navigation asset through `_includes/mandatory-head.html` or the repo's equivalent shared layout.

## Acceptance criteria

- The brand/logo appears once at the top of every public Skunkworks Academy web surface.
- Public global navigation links are hidden until the burger button is clicked.
- The public global menu is uniform across all sites.
- Header links always come from the central global navigation asset.
- No public page maintains an independent top-level menu bar.
- Each repository has a build or audit check that fails when duplicate local header navigation is introduced.
