# Academy navigation and the Skunkworks Design System

The shared Academy header follows the navigation pattern and semantic colour roles in the Skunkworks Design System 1.0.0, as published in `skunkworks-africa/brand` at commit `b7b974123d4c20daef1a1cb903f26a673f2999d6`. It retains the Academy's existing destinations and separates account actions from content navigation. The first keyboard stop is a skip link; the header includes search, a theme toggle, account access and an ecosystem switcher. On smaller screens the menu opens a native modal drawer with a close control, Escape handling and focus return.

The light and dark header roles are scoped to the navigation, using the design system's background, surface, text, muted text, border, hover and focus values. The header and footer share the existing `swa-theme` preference and `skunkworksacademy:theme-change` event. The header search continues to search Academy destinations; it does not claim to index every page's content.

The course catalogue and digital-platform course builds load the same navigation runtime with `data-skunkworks-react-safe="true"`. In that mode the runtime updates its own header but does not remove or restyle React-owned navigation or footers. Deploy the `www` runtime first; only then merge the course-repository configuration updates and run the `www` site release so the rebuilt courses include them. Loading the old runtime with the new course configuration is unsafe.

The reviewed MB-800 guide bypasses the legacy loader. The website's composition step attaches the same versioned runtimes to each published guide page while leaving the pinned Microsoft source unchanged. Its release browser checks verify the navigation theme and mobile drawer alongside the course itself.

`tests/account-navigation.test.mjs` checks account and keyboard behaviour, the shared theme preference, current links and React-owned DOM preservation. `tests/brand-navigation.spec.cjs` checks representative pages in both themes at desktop and mobile sizes, measures rendered contrast, exercises menus and saves screenshots for review. The platform visual regression matrix remains a separate release gate.

After deployment, `tests/live-navigation.spec.cjs` opens the live home, partner, catalogue, beginner-course and MB-800 pages to check the shared navigation, theme colours, logos and keyboard-operated menus.
