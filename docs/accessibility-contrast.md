# Accessibility contrast contract

Skunkworks Academy public interfaces use WCAG 2.2 Level AA as the minimum colour-contrast baseline.

## Mandatory thresholds

- Normal text: at least **4.5:1**.
- Large text: at least **3:1**. Do not use the large-text exception for normal UI copy.
- Meaningful icons, controls, focus indicators and component boundaries: at least **3:1** against adjacent colours where WCAG non-text contrast applies.
- Primary body text should target **7:1** or better when practical.
- Light and dark themes are separate accessibility states and must both pass.

## Semantic colour rule

Brand/accent colours are not automatically safe text colours. Use semantic foreground tokens rather than reusing decorative/background colours as text.

Approved text-oriented tokens include:

- `--sk-link`
- `--sk-interactive-text`
- `--sk-text-primary`
- `--sk-text-secondary`
- `--sk-text-muted`
- `--sk-text-success`
- `--sk-text-warning`
- `--sk-text-danger`
- `--sk-text-info`

The button/background interaction token `--sk-interactive` must not be assumed safe as small foreground text on dark surfaces. Use `--sk-interactive-text` for that role.

## Automated enforcement

`npm run validate:contrast` reads the actual CSS custom properties from:

- `assets/publisher.css`
- `assets/skunkworks-design-system.css`
- `assets/skunkworks-accessibility.css`

It calculates WCAG relative luminance and contrast ratios for approved foreground/background pairs. The build fails when a protected pair drops below its threshold.

The release workflow also serves `tests/accessibility-contrast.html` and runs Lighthouse's browser-level `color-contrast` audit. The fixture renders both light and dark states and protects against computed-style/inheritance regressions that static token arithmetic alone might miss.

Do **not** lower the thresholds to make CI pass. Choose a compliant semantic colour instead.

## Authoring rules

1. Use design-system semantic text tokens instead of arbitrary colour literals for copy.
2. Keep links visually identifiable without colour alone; inline content links should retain an underline or equivalent non-colour cue.
3. Never place critical text over uncontrolled photography, video or gradients unless a stable backing surface guarantees the required contrast.
4. Test default, hover, focus, active, selected, disabled, error, success, warning and visited states.
5. Preserve visible keyboard focus and support forced-colours/high-contrast modes.
6. Re-check contrast after changing opacity, overlays, `color-mix()`, gradients or theme variables.
7. Treat placeholder and helper text as readable UI copy; do not intentionally make it low contrast.

## Review checklist

A pull request that changes colours, typography, backgrounds, cards, navigation, forms or theme tokens should confirm:

- `npm run validate:contrast` passes;
- the Lighthouse contrast fixture passes;
- the normal page Lighthouse accessibility gate passes;
- light and dark theme screenshots remain visually coherent;
- no meaning is communicated by colour alone.
