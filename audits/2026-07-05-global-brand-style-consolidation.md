# Global Brand Style Consolidation

Date: 2026-07-05  
Repository: `skunkworks-academy/.github`  
Branch: `codex/global-brand-styling`

## Objective

Consolidate Skunkworks Academy styling and themed formats into one global brand system.

## Canonical assets

All new pages must load:

```html
<link rel="stylesheet" href="/assets/skunkworks-design-system.css" />
<script src="/assets/skunkworks-ui.js" defer></script>
```

## What changed

- `/assets/skunkworks-design-system.css` is now the canonical source for brand tokens, navigation styling, layout, cards, forms, document styles, print styles, and legacy selector bridges.
- `/faculty/assets/css/skunkworks-design-system.css` is now a compatibility alias only.
- `/assets/skunkworks-ui.js` is now the canonical source for global navigation, legacy header cleanup, theme persistence, current-year injection, and form validation.
- `/assets/academy-navigation.js` no longer carries its own private CSS or navigation implementation.
- `/faculty/assets/js/skunkworks-ui.js` is marked as legacy-only so new pages do not treat it as an authority.
- `microsoft/style.css` is reduced to a compatibility shim importing the global design system.
- `index.html` has been refactored to use the global design system instead of an inline style block and standalone static header menu.
- `faculty/DESIGN_SYSTEM.md` now defines one brand model with `data-format` and `data-theme` instead of `data-brand` colour variants.
- `scripts/audit-global-brand.mjs` was added to flag inline style blocks, non-canonical CSS links, deprecated `data-brand`, and legacy theme-token definitions.

## Governance rule

There is one brand. Page-level variation must be expressed through format intent, not new palettes or duplicate styling systems.

Allowed format modes:

- `data-format="course"`
- `data-format="portal"`
- `data-format="document"`
- `data-format="print"`

Allowed theme modes:

- `data-theme="light"`
- `data-theme="dark"`

Deprecated:

- `data-brand="academy"`
- `data-brand="skunkworks"`
- `data-brand="portal"`
- one-off inline `<style>` blocks
- standalone vendor-specific theme CSS
- JavaScript-injected private navigation CSS

## Follow-up migration queue

The repository still contains many legacy pages that may have inline CSS or local page styling. The new audit script should be used to identify and migrate them in batches so each page moves to `.sk-*` components without breaking content.
