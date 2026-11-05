# Shared shell DOM checks

From the repository root, with Node 24 or newer:

```sh
npm ci --prefix tests/shell-dom --ignore-scripts
npm test --prefix tests/shell-dom
```

These fixtures execute the canonical navigation, UI and footer scripts in jsdom with the existing portal account bridge. They check role labeling, path precedence, same-origin account links, keyboard/focus handling, sign-out callbacks, public-mode compatibility, navigation publication, sidebar events and compact footer content. They do not make network calls or verify browser layout, native keyboard activation, authentication or a live deployment.

DOM-test dependencies are isolated from the site's older workspace lockfile. Browser checks should additionally cover 320/390/768/1440px, long names, both color schemes, native Enter/Space activation, Tab traversal and sidebar/footer alignment.

The asset checks also execute both shell loaders in either order against the homepage's static theme declaration. They verify one stable stylesheet URL across Academy origins and local previews, upgrading an older URL only once. Preview header images stay local while the official artwork and production navigation destinations remain unchanged.
