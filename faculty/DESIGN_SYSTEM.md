# Skunkworks Academy Design System

This directory contains the shared visual foundation for Skunkworks Academy static pages, portal pages, forms, landing pages, and faculty pages.

## Purpose

Every new page should feel like part of the same Skunkworks Academy website. Authors must not create one-off page styling unless there is a specific approved brand exception.

## Required assets

Add these files to every page:

```html
<link rel="stylesheet" href="/faculty/assets/css/skunkworks-design-system.css" />
<script src="/faculty/assets/js/skunkworks-ui.js" defer></script>
```

## Page shell

Use the same high-level structure on every page:

```html
<html lang="en-ZA" data-brand="academy">
<body>
  <div class="sk-app">
    <header class="sk-topbar">...</header>
    <main class="sk-main">...</main>
    <footer class="sk-footer">...</footer>
  </div>
</body>
</html>
```

## Brand variants

Use the `data-brand` attribute to keep one base system while allowing controlled colour variation:

- `data-brand="academy"` for Skunkworks Academy public pages.
- `data-brand="skunkworks"` for Skunkworks corporate/service pages.
- `data-brand="portal"` for authenticated portals, dashboards, login screens, and learner/admin forms.

## Core components

| Component | Classes |
|---|---|
| Header/navigation | `sk-topbar`, `sk-brand`, `sk-nav`, `sk-nav-toggle` |
| Page header | `sk-page-header`, `sk-eyebrow`, `sk-actions` |
| Hero landing area | `sk-hero`, `sk-hero__inner`, `sk-hero__content` |
| Layout container | `sk-container`, `sk-section`, `sk-grid` |
| Cards | `sk-card`, `sk-card__media`, `sk-card__body`, `sk-card__title`, `sk-card__text` |
| Buttons | `sk-button`, `sk-button--secondary`, `sk-button--ghost` |
| Tags | `sk-tags`, `sk-tag` |
| Forms | `sk-form`, `sk-field`, `sk-label`, `sk-input`, `sk-select`, `sk-textarea`, `sk-help-text` |
| Portal layout | `sk-portal-layout`, `sk-sidebar`, `sk-panel` |
| Login layout | `sk-login-layout`, `sk-form-card` |
| Tables | `sk-table-wrap`, `sk-table` |
| Footer | `sk-footer`, `sk-footer__inner`, `sk-footer__bottom` |

## Implementation rules

1. Do not use inline page-level CSS for layout, buttons, cards, forms, or navigation.
2. Use design tokens from `skunkworks-design-system.css` for colour, spacing, typography, borders, and states.
3. Every page must include the shared header and footer pattern.
4. Every portal form must use the `sk-form` component classes.
5. Every login screen must use `sk-login-layout` and `sk-form-card`.
6. Every dashboard/portal page should use `sk-portal-layout` with `sk-sidebar` and `sk-panel`.
7. Use `aria-current="page"` on the active navigation item.
8. Use semantic HTML: `header`, `main`, `section`, `article`, `footer`, `form`, `label`.
9. Keep spacing on the shared 2x scale through existing utility/component classes.
10. Use `data-brand` for controlled brand colour variation instead of creating new CSS files per page.

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

## Governance

When a new page is created, it should first be built using this design system. Only page-specific content should change. Structural layout, navigation, buttons, cards, forms, and footer patterns should remain consistent.
