# Skunkworks Academy assets/theme audit — 2026-08-27

Scope: `skunkworks-academy/www/assets` at baseline commit `0e5ce733bdeb38e559de50ebd9e2e6726cf90d92`, reconciled against current `main` before remediation.

## Executive summary

The assets directory had evolved into a layered compatibility architecture with three separate public theme stylesheets (`academy-brand-theme.css`, `academy-theme-conformance.css`, `academy-page-contract.css`) defining overlapping semantic tokens, light/dark behaviour, focus states and surface rules. The base design system and global navigation/footer runtime also retained earlier IBM/Carbon and Microsoft-reference colours and typography. The result worked because later stylesheets repeatedly overrode earlier stylesheets, not because one source owned the visual contract.

This pass reduces that ambiguity without breaking historical HTML contracts:

1. `academy-brand-theme.css` becomes the single authored public theme layer.
2. `academy-theme-conformance.css` and `academy-page-contract.css` remain zero-rule compatibility entry points so existing HTML markers and direct URLs keep resolving.
3. Official Academy colours and typography are enforced at the public theme layer.
4. Shared navigation/footer fallback styling is remapped to the Academy palette instead of Microsoft-reference grey/blue styling.
5. The duplicated `isLearnSurface()` implementation in `academy-navigation.js` is removed.
6. The unreferenced legacy `academy-ecosystem.js` runtime is deleted.
7. Navigation/configuration metadata is brought forward to the current v11 shell contract.
8. Theme validation is rewritten to validate the consolidated architecture rather than require duplicated CSS bodies.

## Brand conformance target

Canonical palette:

| Token | Value | Intended use |
| --- | --- | --- |
| Ink Navy | `#03033A` | premium/dark shells and inverse surfaces |
| Skunk Blue | `#1E6BD0` | primary actions, links and active states |
| Signal Orange | `#F24208` | focus, warning, urgency and restrained editorial accent |
| White | `#FFFFFF` | primary learning surfaces and reversed foregrounds |
| Off White | `#F7F9FC` | secondary learning surfaces |
| Graphite | `#15171A` | primary light-surface text |
| Steel Gray | `#D8DEE8` | borders and separators |
| Slate Text | `#5A6472` | muted/supporting copy |

Typography contract:

- Display/H1/H2: Inter.
- Body/UI: Open Sans.
- Technical/code: IBM Plex Mono.

## Findings by severity

### High

**H1 — Three overlapping theme implementations.** Brand, conformance and page-contract CSS independently declared overlapping colour, theme, focus and component rules. The runtime depended on stylesheet order and repeated `moveToEnd` operations. This is now consolidated into `academy-brand-theme.css`.

**H2 — Base/runtime styling did not match the current Academy brand kit.** `skunkworks-design-system.css` retained `#0F62FE`, purple/cyan dark gradients and IBM Plex Sans as the body/UI font. `skunkworks-ui.js` and `skunkworks-footer.js` carried Microsoft-reference Segoe UI and grey/blue fallback palettes. The consolidated brand layer now remaps the effective public palette and typography to Academy tokens while leaving the lower-level runtime mechanics stable.

**H3 — Multiple page namespaces could bypass the canonical palette.** Hub, course registration, forms and Labs assets maintain legacy namespace variables. The consolidated theme now bridges those namespaces to Academy tokens so individual page CSS can be migrated incrementally without visual drift.

### Medium

**M1 — Duplicate Learn-surface detection.** `academy-navigation.js` defined `isLearnSurface()` twice. The bootstrap now has one implementation.

**M2 — Dead legacy runtime.** `academy-ecosystem.js` described itself as legacy and repository-wide reference analysis found no active runtime consumers. It has been removed. `academy-ecosystem.css` is still actively referenced by legacy subdomain snapshots, so it is retained.

**M3 — Stale navigation metadata.** `academy-navigation.config.json` identified the repository as `.github`, advertised v9 and referenced August 14 shell assets. It is updated to describe the current v11 runtime and August 27 theme contract.

**M4 — Asset version drift.** `verified-domains.json` advertised July 7 navigation/UI asset versions. The verified-domain evidence itself is preserved, while canonical asset metadata is refreshed.

### Low / follow-up

**L1 — Inline shell CSS remains in JavaScript.** `skunkworks-ui.js` and `skunkworks-footer.js` still inject sizeable style strings. The consolidated brand layer corrects their effective palette/font, but a future low-risk refactor should move structural shell CSS into the shared design-system stylesheet and leave JavaScript responsible only for behaviour/DOM state.

**L2 — Base design-system defaults still carry historical colours.** This pass deliberately does not rewrite all defaults inside `skunkworks-design-system.css` because it is consumed across many historical documents and subdomains. `academy-brand-theme.css` is the supported public theme layer and now deterministically overrides those defaults. A later migration can collapse the lower-level defaults after cross-property visual regression coverage is available.

**L3 — Generated catalogue payload belongs in a generated-data pipeline.** `course-catalog.generated.js` is a compressed/generated runtime payload and is not suitable for manual content merging. It remains unchanged.

## Asset disposition

| Asset | Disposition | Rationale |
| --- | --- | --- |
| `README.md` | Updated | Documents ownership, brand tokens and compatibility strategy. |
| `academy-brand-theme.css` | **Canonical / consolidated** | Single authored public palette, typography, conformance and runtime contrast CSS. |
| `academy-ecosystem.css` | Keep, legacy | Still referenced by subdomain snapshot pages. |
| `academy-ecosystem.js` | **Deleted** | Legacy helper with no active repository runtime consumers. |
| `academy-forms.css` | Keep, specialised | Print/document behaviour is legitimately page-specific; canonical theme bridges its variables. |
| `academy-hub.css` | Keep, specialised legacy | Actively referenced by hub pages; canonical theme now governs effective palette/typography. |
| `academy-learn.css` | Keep, specialised | Learning-specific layout/components; already closest to current brand system. |
| `academy-navigation-loader.js` | Keep, compatibility | Historical loader URL may still be used externally. No new logic should be added. |
| `academy-navigation-v11.js` | Keep, canonical runtime | Menu grouping/section-brand orchestration. |
| `academy-navigation.config.json` | Updated | Stale v9 metadata corrected to current v11 architecture. |
| `academy-navigation.js` | Updated | Compatibility/bootstrap owner; duplicate Learn detection removed and asset versions refreshed. |
| `academy-page-contract.css` | Compatibility shim | Duplicate CSS moved into canonical brand theme; path retained to avoid breaking normalized HTML. |
| `academy-page-contract.js` | Keep, runtime | Surface classification remains functional and distinct from static CSS. |
| `academy-theme-conformance.css` | Compatibility shim | Duplicate CSS moved into canonical brand theme; path/marker retained for backwards compatibility. |
| `course-catalog-renderer.js` | Keep | Functional catalogue renderer/search/data recovery logic. |
| `course-catalog.generated.js` | Keep, generated | Generated compressed catalogue data; not manually merged. |
| `course-registration.css` | Keep, specialised | Registration workflow layout; namespace mapped to canonical theme. |
| `course-registration.js` | Keep | Registration validation and confirmation behaviour. |
| `publisher.css` | Keep, specialised | Publisher/article layout; accessibility layer still targets this surface. |
| `publisher.js` | Keep | Publisher navigation behaviour and controlled AdSense loader. |
| `skunkworks-accessibility.css` | Keep | Explicit WCAG/publisher contrast safeguards and CI validation dependency. |
| `skunkworks-design-system.css` | Keep, base | Shared base geometry/components. Effective public brand mapping is owned by `academy-brand-theme.css`. |
| `skunkworks-footer.js` | Keep, canonical runtime | Footer DOM/theme controls. Brand layer overrides historical fallback palette/font. |
| `skunkworks-shell.js` | Keep, deprecated compatibility | No active repository page references, but retained to avoid breaking historical external includes. |
| `skunkworks-ui.js` | Keep, canonical runtime | Global navigation DOM/interaction runtime. Brand layer overrides historical fallback palette/font. |
| `verified-domains.json` | Updated | Canonical asset-version metadata refreshed without inventing new verification claims. |

## Why some apparently redundant files were not deleted

A repository-wide search shows large numbers of historical pages directly reference the brand/conformance/page-contract URLs and active hub/ecosystem CSS files. Deleting those paths immediately would turn a theme cleanup into a large migration with avoidable 404 and rendering risk. The chosen pattern removes duplicate **implementation content** while keeping zero-rule compatibility URLs until those references can be normalized in a separate migration.

## Validation gates

The repository exposes these relevant checks:

```text
npm run audit:theme
npm run validate:theme
npm run validate:contrast
npm run validate
```

`validate-theme-conformance.mjs` is updated in this branch to test the consolidated architecture and compatibility shims.

## Recommended next phase

1. Add browser visual-regression coverage at 320, 375, 768, 1024, 1440 and 1920 widths for home, courses, self-paced, instructor-led, forms, portal-facing shell, Labs, Jobs, Microsoft, IBM, Security and CompTIA surfaces.
2. Move global navigation/footer structural CSS out of JS string injection and into the base design system.
3. Migrate active legacy page CSS (`academy-ecosystem.css`, `academy-hub.css`, form/registration namespaces) to direct `--sk-*` tokens.
4. Once repository and external usage telemetry shows no consumers, remove compatibility assets (`academy-navigation-loader.js`, `skunkworks-shell.js`, `academy-theme-conformance.css`, `academy-page-contract.css`).
