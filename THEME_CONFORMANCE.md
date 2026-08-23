# Skunkworks Academy Theme Conformance

Version: **2026.08.23.1**

The canonical Academy shell now loads the theme-conformance layer after the design system and Academy brand bridge.

Use the existing public-shell compatibility include:

    <script defer src="https://skunkworksacademy.com/assets/academy-navigation.js?v=2026.08.22.2&rev=2026.08.22.2" data-skunkworks-global-nav="v10"></script>

No additional stylesheet is required for a public property using the canonical shell.

## What is governed

- Semantic colour, type, spacing, control, surface and focus tokens.
- Light and dark semantic surfaces, while preserving page-owned backgrounds.
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

Equivalent .sk-* and .swa-* component classes are supported for existing static content.

## Guardrail

The conformance layer intentionally does **not** set html or body backgrounds. Feature pages retain their own visual hierarchy, while reusable UI elements inherit the same Academy tokens.

Run the gate locally with:

    node scripts/validate-theme-conformance.mjs
