# Skunkworks Academy canonical public shell v10 enforcement — 2026-08-16

## Decision

`skunkworks-academy/www` is the canonical source of truth for the Skunkworks Academy public web shell.

Every public browser-rendered Skunkworks Academy property must converge on this compatibility include:

```html
<script defer src="https://skunkworksacademy.com/assets/academy-navigation.js?v=2026.08.15.1" data-skunkworks-global-nav="v10"></script>
```

The compatibility include loads the canonical runtime chain:

```html
<script defer src="https://skunkworksacademy.com/assets/skunkworks-ui.js?v=2026.08.15.1" data-skunkworks-ui="canonical"></script>
<script defer src="https://skunkworksacademy.com/assets/skunkworks-footer.js?v=2026.08.15.1" data-skunkworks-global-footer="canonical"></script>
<link rel="stylesheet" href="https://skunkworksacademy.com/assets/skunkworks-design-system.css?v=2026.08.15.1" data-skunkworks-design-system="canonical" />
```

`skunkworks-ui.js` is the canonical public navigation runtime. `skunkworks-footer.js` is the canonical public legal/footer runtime. `skunkworks-design-system.css` is the canonical public design-system stylesheet. `academy-navigation.js` and repository-local `academy-navigation-loader.js` files are compatibility loaders only.

The former monolithic `skunkworks-shell.js` implementation is no longer authoritative. It is retained only as a legacy shim that resolves historical consumers to `academy-navigation.js` v10.

## Runtime consolidation

The v10 compatibility runtime now:

- injects the canonical design-system stylesheet, navigation runtime and footer runtime exactly once;
- removes known repository-local public mastheads, Docusaurus public navbars and public legal footers unless intentionally preserved;
- handles hydrated framework chrome with a `MutationObserver` so duplicate navigation introduced after initial page load is removed;
- removes a direct `body > header` only when it clearly contains navigation/brand chrome, preserving content-only document headers;
- preserves intentionally local application/header chrome when marked `data-sk-preserve-header`;
- preserves intentionally local application/footer chrome when marked `data-sk-preserve-footer`;
- leaves authenticated workspace/application navigation valid when it is not the public website shell.

## Deployment enforcement standard

Public deployment workflows now normalize the publish artifact instead of trusting individual page authors to keep shell versions aligned.

For each standalone HTML document the deployment gate:

1. removes historical `academy-navigation.js`, `academy-navigation-loader.js`, `data-skunkworks-global-nav` and `data-skunkworks-global-shell` script tags;
2. injects exactly one `2026.08.15.1` / `v10` compatibility include;
3. fails the build if the canonical marker is missing;
4. fails the build if duplicate Academy shell loaders remain;
5. skips `.html` fragments that are not standalone HTML documents;
6. fails malformed standalone documents that cannot accept the canonical include.

This approach prevents generated Docusaurus, React/Vite, static-course and repository-root pages from reintroducing stale public chrome during build or deployment.

## Enforced public surfaces

The rollout covers the canonical apex and the deployable/browser-rendered Academy properties identified by the organisation web-surface audit, including:

- Canonical/apex: `www` and its public HTML trees, Forms, self-paced/static pages and apex subdomain source pages.
- Core platform: `portal`, `labs`, `ibm`, `learn`, `course-catalog`, `docs`, `careers`.
- Public Academy properties: `brand`, `badging`, `marketing`, `publish`, `dashboard`, `classrooms`, `faculty`, `app`, `prompt`, `jobs`, `security`, `microsoft`, `media`, `comptia`.
- Course and lab publishing surfaces: `CSES-01`, `dpg-610a`, `prod-101`, `ls1607`, `lms`.
- Docusaurus/IDR surfaces: `osint`, `aacca`, `fksmm`.

Repository-local compatibility loaders were aligned in `labs`, `portal`, `jobs`, `security`, `microsoft`, `media` and `comptia`. Framework roots were aligned in `careers`, `docs`, `osint`, `aacca` and `fksmm`.

## Deployment verification snapshot

Successful GitHub Pages/Actions validation observed during this rollout includes:

| Surface | Workflow run | Result |
|---|---:|---|
| `www` | 31919080297 | success |
| `labs` | 31919011642 | success |
| `portal` | 31918637744 | success |
| `ibm` | 31918652599 | success |
| `learn` | 31918661741 | success |
| `course-catalog` | 31918680226 | success |
| `publish` | 31918701218 | success |
| `dpg-610a` | 31918757893 | success |
| `prod-101` | 31918764984 | success |
| `ls1607` | 31918776262 | success |
| `lms` | 31918784793 | success |
| `badging` | 31918885351 | success |
| `faculty` | 31918539923 | success |
| `app` | 31918807349 | success |
| `prompt` | 31919375569 | success |
| `microsoft` | 31919195971 | success |
| `media` | 31919213786 | success |
| `comptia` | 31919222750 | success |

Additional modified public-site workflows were validated during the rollout, including Brand, Marketing, Classrooms and the generated course-site pipelines.

## Prompt custom-domain exception

The Prompt repository's canonical shell validation, `actions/deploy-pages` deployment and deployed Pages artifact verification now succeed. The custom hostname remains an external DNS/Pages-setting dependency.

Repository state at the time of the rollout:

- checked-in `CNAME`: `prompt.skunkworksacademy.com`;
- GitHub Pages API: workflow build published at `https://skunkworks-academy.github.io/prompt/` with no active Pages custom-domain setting;
- the earlier production verification failure was DNS resolution only; shell validation and Pages deployment jobs succeeded;
- remediation tracking: `skunkworks-academy/prompt#1` — **Configure prompt.skunkworksacademy.com custom domain and DNS**;
- replacement workflow run `31919375569` completed successfully and now verifies the actual deployed Pages artifact while reporting custom-domain DNS as a non-fatal external warning.

The Prompt custom hostname therefore remains an external DNS/Pages-configuration dependency; it is not a canonical-shell implementation failure.

## Intentional exclusions

The shell is not injected into repositories that are not public browser-rendered sites, including backend/API-only services, internal/private repositories, infrastructure/tooling repositories and vendor/course source repositories that do not publish a public Academy web surface.

Authenticated application workspaces may retain application-specific navigation/footer chrome where it is not the public website shell. Explicit preservation markers remain the supported override mechanism.

## Governance

Going forward:

- public repositories must not introduce independent public top menus, logo switchers, burger menus or legal footers;
- new public Pages/build workflows should normalize generated HTML to the canonical compatibility include;
- changes to global destinations, search/account entry points, public footer/legal links, theme handling or design-system styling belong in `skunkworks-academy/www` canonical assets;
- historical version strings may remain visible temporarily in GitHub code-search indexes after source changes; current repository content and deployed build artifacts are authoritative;
- public-shell changes should be validated through the relevant Pages workflow and production check before being treated as released.

Generated on: 2026-08-16
