# Skunkworks Academy Design System

This document defines the single visual foundation for Skunkworks Academy static pages, portal pages, forms, landing pages, faculty pages, course pages, and document-style templates.

## Purpose

Every page must feel like part of the same Skunkworks Academy ecosystem. Authors must not create one-off page styling, duplicate navigation systems, page-local colour palettes, or vendor-specific themes.

The only approved brand styling authority is:

```html
<link rel="stylesheet" href="/assets/skunkworks-design-system.css" />
<script src="/assets/skunkworks-ui.js" defer></script>
```

The older faculty paths remain as compatibility aliases only:

```html
<link rel="stylesheet" href="/faculty/assets/css/skunkworks-design-system.css" />
```

New pages must not use the faculty path unless maintaining a legacy page that cannot yet be moved.

## Page shell

Use the same high-level structure on every page:

```html
<!doctype html>
<html lang="en-ZA" data-theme="light" data-format="course">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <link rel="stylesheet" href="/assets/skunkworks-design-system.css" />
  <script src="/assets/skunkworks-ui.js" defer></script>
</head>
<body>
  <a class="sk-skip-link" href="#main">Skip to main content</a>
  <div class="sk-app">
    <main id="main" class="sk-main">...</main>
    <footer class="sk-footer">...</footer>
  </div>
</body>
</html>
```

The global navigation is injected by `/assets/skunkworks-ui.js`. Do not add a second header menu unless a page has an approved exception and uses `data-sk-preserve-header`.

## Format modes

There is one brand. Use format modes for layout needs, not separate brand variants.

| Attribute | Use |
|---|---|
| `data-format="course"` | Course, learning path, lesson, lab, and catalogue pages. |
| `data-format="portal"` | Learner/admin portal screens, dashboards, and login screens. |
| `data-format="document"` | Policies, agreements, forms, vendor templates, and long-form documents. |
| `data-format="print"` | Print-first or PDF-first pages. |

Allowed theme values:

| Attribute | Use |
|---|---|
| `data-theme="light"` | Explicit light mode. |
| `data-theme="dark"` | Explicit dark mode. |

Do not use `data-brand` for colour variation. Do not create Microsoft, IBM, partner, faculty, forms, or portal colour systems.

## Core components

| Component | Classes |
|---|---|
| Global navigation | Injected `.swa-global-nav` from `/assets/skunkworks-ui.js` |
| Static header exception | `sk-site-header`, `sk-site-header__inner`, `sk-site-brand`, `sk-nav` |
| Page header | `sk-page-header`, `sk-eyebrow`, `sk-actions` |
| Hero landing area | `sk-hero`, `sk-hero__inner`, `sk-hero__content` |
| Layout container | `sk-container`, `sk-section`, `sk-grid` |
| Cards | `sk-card`, `sk-card__media`, `sk-card__body`, `sk-card__title`, `sk-card__text` |
| Buttons | `sk-button`, `sk-button--secondary`, `sk-button--ghost` |
| Tags | `sk-tags`, `sk-tag` |
| Forms | `sk-form`, `sk-field`, `sk-label`, `sk-input`, `sk-select`, `sk-textarea`, `sk-help-text` |
| Portal layout | `sk-portal-layout`, `sk-sidebar`, `sk-panel` |
| Login layout | `sk-login-layout`, `sk-form-card` |
| Documents | `sk-document`, `sk-document-header`, `sk-document-title`, `sk-signature-grid`, `sk-signature-box` |
| Tables | `sk-table-wrap`, `sk-table` |
| Footer | `sk-footer`, `sk-footer__inner`, `sk-footer__bottom` |

## Implementation rules

1. Load `/assets/skunkworks-design-system.css` and `/assets/skunkworks-ui.js` on every new HTML page.
2. Do not use inline page-level CSS for layout, buttons, cards, forms, typography, colours, or navigation.
3. Do not create new page-specific CSS files unless they are thin compatibility shims importing the global design system.
4. Use `--sk-*` design tokens for colour, spacing, typography, borders, elevation, and states.
5. Use `data-format` for page layout intent and `data-theme` for light/dark mode.
6. Do not use `data-brand` for colour variation.
7. Every page must use the shared global navigation or an explicitly approved static-header exception.
8. Every portal form must use the `sk-form` component classes.
9. Every login screen must use `sk-login-layout` and `sk-form-card`.
10. Every dashboard/portal page should use `sk-portal-layout` with `sk-sidebar` and `sk-panel`.
11. Use `aria-current="page"` on any static active navigation item.
12. Use semantic HTML: `header`, `main`, `section`, `article`, `footer`, `form`, and `label`.
13. Keep spacing on the shared scale through the existing utility/component classes.
14. Print/PDF documents must use `sk-document` classes and the shared `@media print` rules.

## Portal form starter

```html
<section class="sk-login-layout">
  <form class="sk-form sk-form-card" data-sk-validate>
    <p class="sk-eyebrow">Portal Access</p>
    <h1>Sign in</h1>
    <div class="sk-field">
      <label class="sk-label" for="email">Email address</label>
      <input class="sk-input" id="email" name="email" type="email" required />
    </div>
    <div class="sk-field">
      <label class="sk-label" for="password">Password</label>
      <input class="sk-input" id="password" name="password" type="password" required />
    </div>
    <button class="sk-button" type="submit">Continue</button>
  </form>
</section>
```

## Document starter

```html
<main id="main" class="sk-main">
  <article class="sk-document">
    <header class="sk-document-header">
      <p class="sk-eyebrow">Skunkworks Academy</p>
      <h1 class="sk-document-title">Document Title</h1>
    </header>
    ...
  </article>
</main>
```

## Governance

When a new page is created, it must first be built using the global design system. Only page-specific content should change. Structural layout, navigation, buttons, cards, forms, print styles, document styles, and footer patterns must remain consistent.

Any deviation must be documented in the pull request and treated as a brand exception.
