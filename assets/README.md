# Skunkworks Academy shared public web shell

Repository: `www`

This folder contains the canonical public web-shell assets for Skunkworks Academy. The objective is one uniform public header, footer, colour system, typography contract and accessibility baseline across Academy, Portal, Labs, Jobs, Security, IBM, Microsoft, Badging, Media, Forms, learning pages and other public Academy properties.

## Canonical include

Public pages should load the compatibility shell include:

```html
<script defer src="https://skunkworksacademy.com/assets/academy-navigation.js?v=2026.08.27.1" data-skunkworks-global-nav="v10"></script>
```

The compatibility include loads the v11 navigation runtime, which in turn loads the canonical UI runtime, footer runtime and base design system.

```text
academy-navigation.js
  -> academy-navigation-v11.js
     -> skunkworks-design-system.css
     -> skunkworks-ui.js
     -> skunkworks-footer.js
  -> academy-brand-theme.css
  -> academy-page-contract.js
  -> academy-learn.css (learning surfaces only)
```

## Theme source of truth

`academy-brand-theme.css` is the single authored public theme layer. It owns:

- Skunkworks Academy brand palette and semantic token mapping;
- Inter display typography and Open Sans body/UI typography;
- IBM Plex Mono technical/code typography;
- light, dark and system-theme mapping;
- legacy variable bridges while older pages are migrated;
- shared buttons, cards, fields, notices and prose rules;
- runtime `data-swa-surface-tone` foreground/contrast styling;
- Academy navigation/footer brand overrides;
- namespace bridges for Labs, forms, hub pages and course registration.

The canonical palette is:

- Ink Navy `#03033A`
- Skunk Blue `#1E6BD0`
- Signal Orange `#F24208`
- White `#FFFFFF`
- Off White `#F7F9FC`
- Graphite `#15171A`
- Steel Gray `#D8DEE8`
- Slate Text `#5A6472`

Signal Orange is reserved for focus, alerts and restrained editorial emphasis. Primary actions remain Skunk Blue.

## Compatibility assets

`academy-theme-conformance.css` and `academy-page-contract.css` are intentionally rule-free compatibility entry points. Historical pages and repository normalisation checks still reference their marker attributes, but their formerly duplicated CSS now lives in `academy-brand-theme.css`.

`academy-navigation-loader.js` and `skunkworks-shell.js` remain compatibility loaders for external/historical integrations. They must not receive new navigation logic.

`academy-ecosystem.js` was removed because repository-wide reference analysis found no active runtime consumers; its navigation responsibility had already moved to the canonical UI runtime.

## Page-specific assets

Keep specialised behaviour separate when it is genuinely page-specific:

- `academy-learn.css` — Learn-area layout and learning-specific components.
- `academy-forms.css` — printable forms/document layouts.
- `course-registration.css` / `course-registration.js` — registration workflow UI and interactions.
- `course-catalog-renderer.js` / `course-catalog.generated.js` — catalogue rendering and generated catalogue payload.
- `publisher.css` / `publisher.js` — publisher/article presentation and AdSense loading logic.
- `skunkworks-accessibility.css` — targeted publisher/contrast safeguards that are validated independently.

These files should consume canonical tokens where possible rather than creating new brand palettes.

## Navigation standard

Public top bars must use the canonical Skunkworks Academy global navigation rather than repository-specific navigation. The v11 runtime provides Academy identity, grouped navigation, search, section branding and account entry points.

The machine-readable companion is `academy-navigation.config.json`. Runtime menu grouping remains authoritative in `academy-navigation-v11.js`.

## Footer standard

`skunkworks-footer.js` is the canonical global footer runtime. It provides social links, locale/privacy utilities, theme selection, legal/company links and dynamic copyright. Page-local public footers are removed when the shell loads unless the local footer explicitly carries `data-sk-preserve-footer`.

## Consolidation rules

- `academy-brand-theme.css` is the canonical Academy theme source.
- `skunkworks-design-system.css` is the base component/layout system loaded by the v11 runtime.
- `academy-navigation-v11.js` is the canonical global-navigation orchestration runtime.
- `skunkworks-ui.js` is the public navigation UI implementation.
- `skunkworks-footer.js` is the public footer implementation.
- `academy-navigation.js` is the supported compatibility/bootstrap include.
- Compatibility shims contain no new product logic or duplicate styling.
- Repositories must not maintain independent public top menus, logo switchers, burger menus or public legal footers.
- Local application navigation and application-specific footers are allowed inside authenticated workspaces when they are not the public website shell.
- Preserve an intentionally local header with `data-sk-preserve-header`.
- Preserve an intentionally local footer with `data-sk-preserve-footer`.
- New colour values must use the canonical Academy palette or semantic tokens; do not sample colours from screenshots.
- New public UI uses Inter for display headings and Open Sans for body/UI copy.

## Governance

Before publishing shared-asset changes, run:

```bash
npm run audit:theme
npm run validate:theme
npm run validate:contrast
npm run validate
```

Generated on: 2026-08-27
