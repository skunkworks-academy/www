# Global navigation contract

Figma source: https://www.figma.com/design/7ig3vhoODEpKhiyr1J5rCp

Use this header on every Skunkworks Academy web property. It is the Academy-level navigation; do not add a second site-specific top bar.

## Required structure

```html
<header class="topbar" data-nav data-open="false">
  <a class="brand" href="https://skunkworksacademy.com/" aria-label="Skunkworks Academy home">
    <img class="brand__logo logo-light" src="https://raw.githubusercontent.com/skunkworks-academy/www/refs/heads/main/images/favicon-black.png" alt="" width="40" height="40">
    <img class="brand__logo logo-dark" src="https://raw.githubusercontent.com/skunkworks-academy/www/refs/heads/main/images/favicon-white.png" alt="" width="40" height="40">
    <span>
      <span class="brand__title">Skunkworks Academy</span>
      <span class="brand__subtitle">Unified learning platform</span>
    </span>
  </a>
  <label class="academy-search">
    <span class="sr-only">Search Academy destinations</span>
    <input type="search" placeholder="Search Academy destinations, partners, courses, jobs…">
  </label>
  <button class="nav-toggle" type="button" data-nav-toggle aria-label="Toggle navigation" aria-expanded="false" aria-controls="academy-nav">
    <span aria-hidden="true">☰</span>
  </button>
</header>
<nav id="academy-nav" class="academy-nav" aria-label="Academy destinations">…</nav>
```

## Behaviour

- Use the black favicon in light themes and the white favicon in dark themes; show only one.
- Header height: 76px. Minimum interactive control: 44 × 44px.
- Desktop shows the Academy destination search field.
- At 920px and below, hide desktop navigation and show the menu button.
- The open mobile menu is a panel immediately below the header with Home, Catalogue, Portal, Labs, Jobs, Partners, Resources, and Sign in.
- The toggle must update `aria-expanded`; its controlled navigation uses `aria-controls="academy-nav"`.
- Keep a visible keyboard focus indicator and preserve sufficient contrast in both theme modes.

## Figma component

The `Global navigation` component has:

- `Viewport`: Desktop or Mobile
- `Menu`: Closed or Open
- `Theme`: Light or Dark
- Editable `Brand title` and `Brand subtitle`

Do not recreate the Academy mark in CSS or SVG; use the approved favicon assets.
