# Skunkworks Academy Theme Conformance

Version: **2026.08.23.2**

The canonical Academy shell and page normaliser load the theme-conformance layer after the design system and Academy brand bridge. Every complete HTML document receives the canonical colour-scheme metadata and direct stylesheet marker; the shell is a resilient second line for cached and legacy pages.

Use the existing public-shell compatibility include:

    <script defer src="https://skunkworksacademy.com/assets/academy-navigation.js?v=2026.08.23.1&rev=2026.08.23.1" data-skunkworks-global-nav="v10"></script>

New documents should use the canonical normaliser rather than copying a local palette or stylesheet stack.

## What is governed

- Semantic colour, type, spacing, control, surface and focus tokens.
- An Academy-owned page canvas, typography, colour scheme and legacy-token bridge.
- Light and dark semantic surfaces with a single source of truth for the public palette.
- Accessible, responsive button, card, field, notice and prose components.
- Reduced-motion behaviour for the shared components.
- Deterministic asset ordering: design system, brand bridge, then theme conformance.

## Component contract

Use the following markers on new public content:

| Purpose | Preferred marker |
|---|---|
| Primary action | data-sk-component="button" data-variant="primary" |
| Secondary action | data-sk-component="button" data-variant="secondary" |
| Surface/card | data-sk-component="card" |
| Input group | data-sk-component="field" |
| Informational callout | data-sk-component="notice" |
| Article/content region | data-sk-component="prose" |

Equivalent `.sk-*` and `.swa-*` component classes are supported for existing static content.

## Governance guardrail

The conformance layer owns the public page canvas and normalises common legacy surfaces, controls and content tokens. Pages may retain their content and layout, but they do not redefine the public background or palette.

The only escape hatch is `data-swa-theme-scope="isolated"` for a self-contained embedded application. It must include a non-empty `data-swa-theme-scope-reason` on the same element. The audit fails unaccounted-for exceptions.

The global page-contract workflow repairs current HTML documents, verifies the result, and writes a JSON audit report. It runs on relevant pull requests, pushes to `main`, and on a daily schedule so future pages cannot silently drift.

Run the shared-layer gate and the repository audit locally with:

    node scripts/validate-theme-conformance.mjs
    node scripts/enforce-global-page-contract.mjs --write .
    node scripts/audit-theme-governance.mjs
