# Skunkworks Academy shared public web shell

Repository: `www`

This folder contains the canonical public web-shell assets for the Skunkworks Academy ecosystem. The goal is one uniform public header and footer across Academy, Portal, Labs, Jobs, Security, IBM, Microsoft, Badging, Media, Forms, self-paced pages and other public Skunkworks Academy properties.

## Canonical include

Public pages should load the compatibility shell include:

```html
<script defer src="https://skunkworksacademy.com/assets/academy-navigation.js?v=2026.08.15.1" data-skunkworks-global-nav="v10"></script>
```

The compatibility include loads the canonical UI runtime:

```html
<script defer src="https://skunkworksacademy.com/assets/skunkworks-ui.js?v=2026.08.15.1" data-skunkworks-ui="canonical"></script>
```

It also loads the canonical global footer runtime:

```html
<script defer src="https://skunkworksacademy.com/assets/skunkworks-footer.js?v=2026.08.15.1" data-skunkworks-global-footer="canonical"></script>
```

The UI runtime injects the canonical design system automatically:

```html
<link rel="stylesheet" href="https://skunkworksacademy.com/assets/skunkworks-design-system.css?v=2026.08.15.1" data-skunkworks-design-system="canonical" />
```

## Navigation standard

Top bars must use the canonical Skunkworks Academy global navigation rather than repository-specific public navigation. The current shell provides the theme-aware Academy identity, verified navigation targets, search and account entry points.

The navigation destinations are maintained centrally and include Academy home, catalogue, purchases, portal, labs, security, Microsoft, IBM, badging, jobs, forms, docs, publishing and blog destinations.

## Footer standard

The canonical footer follows a compact Microsoft-inspired two-row layout and is injected automatically by `academy-navigation.js`.

Utility row:

- `English (South Africa)` locale indicator
- `Your Privacy Choices` link to the Academy cookie/privacy controls
- `Theme` selector with System, Light and Dark modes

Legal/company row:

- About
- Blog
- Contribute
- Privacy
- Cookie Policy
- Terms of Use
- Editorial Policy
- Advertising Disclosure
- Contact
- dynamic `© Skunkworks Academy <year>` copyright

The footer is responsive, keyboard accessible, theme-aware and uses a single canonical runtime so public Academy properties remain visually consistent. A page-local footer is removed when the canonical shell loads unless the local footer explicitly carries `data-sk-preserve-footer`.

## Consolidation rules

- `skunkworks-ui.js` is the canonical navigation runtime.
- `skunkworks-footer.js` is the canonical footer runtime.
- `skunkworks-design-system.css` is the canonical design-system style source.
- `academy-navigation.js` and local `academy-navigation-loader.js` files are compatibility loaders only.
- Repositories must not maintain independent public top-menu, logo-switcher, burger-menu or public legal-footer implementations.
- Local application navigation and application-specific footers are allowed inside authenticated workspaces when they are not the public website shell.
- Preserve an intentionally local header with `data-sk-preserve-header`.
- Preserve an intentionally local footer with `data-sk-preserve-footer`.

Generated on: 2026-08-15
