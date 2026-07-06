# Skunkworks Academy assets

Repository: `.github`

This folder contains the shared public web-shell assets for the Skunkworks Academy ecosystem. The goal is one canonical public header across Academy, Portal, Labs, Jobs, Security, IBM, Badging, Media, Forms and self-paced pages.

## Canonical includes

Use the compatibility navigation include on public pages:

```html
<script defer src="https://skunkworksacademy.com/assets/academy-navigation.js?v=2026.07.07.1" data-skunkworks-global-nav="v6"></script>
```

The compatibility include loads the canonical UI runtime:

```html
<script defer src="https://skunkworksacademy.com/assets/skunkworks-ui.js?v=2026.07.07.1" data-skunkworks-ui="canonical"></script>
```

The UI runtime injects the canonical design system automatically:

```html
<link rel="stylesheet" href="https://skunkworksacademy.com/assets/skunkworks-design-system.css?v=2026.07.07.1" data-skunkworks-design-system="canonical" />
```

## Navigation standard

Top bars must show only:

- theme-aware Skunkworks icon
- `Skunkworks Academy` text
- icon-only burger menu

The burger menu renders the verified navigation targets from `academy-navigation.config.json` and `verified-domains.json`.

## Verified routes

| Label | Domain | URL |
| --- | --- | --- |
| Home | skunkworksacademy.com | https://skunkworksacademy.com/ |
| Plans & Purchases | skunkworksacademy.com | https://skunkworksacademy.com/plans-and-purchases/ |
| Secure Checkout | portal.skunkworksacademy.com | https://portal.skunkworksacademy.com/checkout/ |
| AI Learning | skunkworksacademy.com | https://skunkworksacademy.com/#new-way-to-learn |
| Self-paced | skunkworksacademy.com | https://skunkworksacademy.com/self-paced/ |
| Portal | portal.skunkworksacademy.com | https://portal.skunkworksacademy.com/ |
| Labs | lab.skunkworksacademy.com | https://lab.skunkworksacademy.com/ |
| Forms | skunkworksacademy.com | https://skunkworksacademy.com/forms/ |
| Badging | badging.skunkworksacademy.com | https://badging.skunkworksacademy.com/ |
| Jobs | jobs.skunkworksacademy.com | https://jobs.skunkworksacademy.com/ |
| Media | media.skunkworksacademy.com | https://media.skunkworksacademy.com/ |
| Security | security.skunkworksacademy.com | https://security.skunkworksacademy.com/ |
| IBM | ibm.skunkworksacademy.com | https://ibm.skunkworksacademy.com/ |

## Consolidation rules

- `skunkworks-ui.js` is the canonical runtime.
- `skunkworks-design-system.css` is the canonical style source.
- `academy-navigation.js` and `academy-navigation-loader.js` are compatibility loaders only.
- Repositories must not maintain independent public top-menu, logo-switcher, or burger-menu implementations.
- Local application navigation is allowed only inside authenticated application workspaces or content areas where it is not the public website header.
- Preserve a page-local header only by adding `data-sk-preserve-header`.

Generated on: 2026-07-07 17:00:00 +02:00
