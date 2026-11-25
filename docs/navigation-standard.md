# Academy global navigation standard — single header

Effective with navigation revision 2026.11.25.1.

- One canonical fixed header: 72px desktop and 64px mobile (620px and below). Reserve the same space before first paint.
- One global hamburger navigation drawer, available at every viewport. Nine native disclosure groups derive from GLOBAL_NAV_GROUPS; every existing destination is preserved, the current group is marked and an initial group is expanded. No second horizontal navigation row.
- Retain canonical logo, search, theme, ecosystem and sign-in/account controls. Course discovery and local section navigation belong in the page body. Authenticated portal workspaces continue to use the authorized sidebar and account bridge; menu visibility is not authorization.
- Use accessible native details/summary, visible keyboard focus, current-page indication, modal close and Escape/focus return. Preserve light/dark design tokens. The WCAG 2.2 AA target requires ongoing verification.
- The stable v11 compatibility interface and topMenu metadata remain for external consumers; they do not authorize rendering a second global navigation element. Integrators must use the canonical asset rather than fork it.
- Regression gates: account-navigation unit tests, brand-navigation and MB-800 local browser tests, course publishing checks and production live-navigation smoke tests. Test on desktop/mobile and both themes; do not remove the canonical header or React-managed course chrome.
