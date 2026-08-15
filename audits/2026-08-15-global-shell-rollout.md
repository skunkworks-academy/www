# Skunkworks Academy global navigation and footer rollout

**Date:** 15 August 2026  
**Canonical shell version:** `2026.08.15.2`  
**Canonical repository:** `skunkworks-academy/www`

## Executive result

The Skunkworks Academy organisation was audited against the organisation source sitemap and GitHub Pages/deployment configuration. The inventory covers 78 repositories (68 public, 10 private), 14,531 tracked paths, 223 static HTML candidates on the apex inventory, 214 first-party apex sitemap URLs, and 20 source-declared Academy custom domains.

A single canonical, responsive Academy UI shell has been implemented and rolled out across Academy-owned deployable web surfaces. The shell provides a uniform fixed top navigation, responsive mobile menu, brand identity, active-route state, global footer, legal navigation, and compatibility handling for legacy headers/footers.

The visual implementation follows the Skunkworks Academy brand system: Ink Navy `#03033A`, Skunk Blue `#1E6BD0`, Signal Orange `#F24208`, white/off-white surfaces, strong keyboard focus states, short UI labels, and Academy-wide navigation hierarchy.

## Canonical architecture

### Runtime

- `www/assets/skunkworks-shell.js`
  - canonical global header/navigation/footer implementation
  - versioned as `2026.08.15.2`
  - responsive desktop/mobile navigation
  - Home, Courses, Labs, Portal, Partners and Resources navigation
  - Plans & purchase CTA
  - global Learning / Platforms / Partners / Academy footer
  - Privacy / Cookies / Terms / Editorial / Advertising disclosure links
  - route-aware active state including SPA history changes
  - hides known legacy Academy headers/footers to prevent duplicate site chrome
  - print-safe and keyboard accessible

### Compatibility loaders

- `www/assets/academy-navigation.js`
  - now loads the canonical global shell
  - existing pages that already reference this URL inherit the new header/footer without duplicating page-specific markup
- `www/assets/academy-navigation-loader.js`
  - legacy compatibility loader now routes to the current canonical runtime

### Deployment enforcement

For generated/static GitHub Pages builds, deployment workflows now either:

1. inject the exact canonical loader into every generated HTML page, or
2. load the canonical shell from the application/framework root layout/configuration.

Where deployment-time injection is used, the workflow fails if any published HTML page is missing the canonical shell marker. This prevents future page drift.

The apex repository now uses one canonical Pages release pipeline (`site-release.yml`) and a separate validation-only quality workflow. Their concurrency groups are isolated so quality checks cannot cancel an in-flight production release.

## Rollout matrix

| Repository / surface | Integration method | Result |
|---|---|---|
| `www` / `skunkworksacademy.com` | canonical runtime + loader + release-time all-HTML enforcement + separate quality validation | deployed and verified |
| `portal` | generated `dist/**/*.html` deployment enforcement | deployed successfully |
| `labs` | generated Docusaurus `build/**/*.html` enforcement | deployed successfully |
| `ibm` | staged `_site/**/*.html` enforcement | deployed successfully, including public-domain verification |
| `learn` | generated `build/**/*.html` enforcement | deployed successfully |
| `course-catalog` | generated Docusaurus HTML enforcement | initial edge case fixed; deployment succeeded |
| `docs` | Docusaurus root script integration | deployed successfully |
| `careers` | Next.js root layout script integration | deployed successfully |
| `osint` | Docusaurus root script integration | deployed successfully |
| `aacca` | Docusaurus root script integration | deployed successfully |
| `fksmm` | Docusaurus root script integration | deployed successfully |
| `brand` | deploy-time all-HTML injection and verification | deployed successfully |
| `badging` | deploy-time all-HTML injection and verification | deployed successfully |
| `marketing` | public artifact all-HTML injection and verification | deployed successfully |
| `publish` | deploy-time all-HTML injection and verification | deployed successfully |
| `dashboard` | corrected Pages artifact path + all-HTML shell enforcement | deployed successfully |
| `classrooms` | deploy-time all-HTML injection and verification | deployed successfully |
| `ls1607` | generated Docusaurus HTML enforcement | deployed successfully |
| `prod-101` | published `site/**/*.html` enforcement | deployed successfully |
| `lms` | static staging with all-HTML shell enforcement | broken Jekyll path removed; deployment succeeded |
| `CSES-01` | generated Docusaurus HTML enforcement | deployed successfully |
| `dpg-610a` | generated Docusaurus HTML enforcement | deployed successfully |
| `jobs` | existing canonical navigation loader reference | inherits current canonical shell |
| `security` | existing canonical navigation loader reference | inherits current canonical shell |
| `microsoft` | existing shared Academy loader/layout integration | inherits current canonical shell |
| `media` | existing canonical navigation loader reference | inherits current canonical shell |
| `comptia` and apex CompTIA pages | existing canonical navigation loader reference / apex enforcement | inherits current canonical shell |
| `prompt` and other Academy pages already using `academy-navigation.js` | canonical runtime compatibility | inherits current canonical shell |

## Audit boundary and exceptions

The rollout applies to **Academy-owned deployable websites and web applications**. It does not inject visual site chrome into:

- backend/API-only repositories with no browser UI;
- private repositories that do not publish a public page;
- repositories whose current source contains no deployable HTML/application surface;
- upstream/vendor training repositories whose published site is owned by the upstream vendor rather than Skunkworks Academy (for example Microsoft Learning-hosted course repositories);
- third-party external destinations that happen to be referenced from Academy navigation.

Examples such as `faculty` currently declare a custom domain but do not expose a normal deployable page entry point in the audited source; these remain deployment/content gaps rather than shell failures.

## CI/CD verification

Verified successful rollout/deployment runs include the apex website, Portal, Labs, IBM, Learn, Course Catalogue, Docs, Careers, OSINT, AACC/AACC IDR, FKSMM IDR, Brand portal, Badging, Marketing, Publish, Dashboard, Classrooms, LS1607, PROD-101, LMS, CSES-01 and DPG-610A.

Two pre-existing deployment weaknesses were exposed and corrected during rollout:

- **Course Catalogue:** generated HTML contained inconsistent historical navigation-script URLs. The workflow now removes arbitrary old `academy-navigation.js` script tags and injects one exact canonical loader into every generated HTML file. The corrected deployment completed successfully.
- **LMS:** the legacy GitHub Pages Jekyll workflow was failing before the shell step because Jekyll attempted to parse Markdown inside a committed `microsoft/node_modules` tree and raised a Liquid syntax error. The workflow now stages the LMS as a static site, excludes `node_modules`, injects the canonical shell into every published HTML page, and deploys successfully.

The apex CI/CD was also consolidated: `site-quality-and-pages.yml` is validation-only, while `site-release.yml` is the sole production Pages release path. Separate concurrency groups prevent one workflow from cancelling the other.

## Governance standard going forward

All new Academy pages should consume the canonical shell rather than hand-building a new global navigation/footer. Framework sites should load `https://skunkworksacademy.com/assets/academy-navigation.js?v=2026.08.15.2` once at root layout/config level. Static-site deployment workflows should verify every publishable `.html` artifact contains the canonical shell. Local navigation may remain for course/module-specific navigation, but it must not replace or duplicate the Academy global shell.

When a new major shell version is released, update the canonical runtime and deployment enforcement version together, validate representative desktop/mobile routes, then update this audit record.
