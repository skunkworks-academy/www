# Canonical public shell v10 enforcement audit

Generated: 2026-08-16

Canonical repository: `skunkworks-academy/www`

## Required public include

Every standalone public Skunkworks Academy page must resolve to exactly one compatibility loader:

```html
<script defer src="https://skunkworksacademy.com/assets/academy-navigation.js?v=2026.08.15.1" data-skunkworks-global-nav="v10"></script>
```

The compatibility loader delegates to the canonical assets hosted by `www`:

```html
<script defer src="https://skunkworksacademy.com/assets/skunkworks-ui.js?v=2026.08.15.1" data-skunkworks-ui="canonical"></script>
<script defer src="https://skunkworksacademy.com/assets/skunkworks-footer.js?v=2026.08.15.1" data-skunkworks-global-footer="canonical"></script>
<link rel="stylesheet" href="https://skunkworksacademy.com/assets/skunkworks-design-system.css?v=2026.08.15.1" data-skunkworks-design-system="canonical" />
```

## Runtime contract

- `skunkworks-ui.js` is the only canonical public navigation runtime.
- `skunkworks-footer.js` is the only canonical public legal/company footer runtime.
- `skunkworks-design-system.css` is the canonical public design-system stylesheet.
- `academy-navigation.js` and any repository-local `academy-navigation-loader.js` are compatibility loaders only.
- Public repository-specific top menus, logo switchers, burger menus and legal footers are removed or superseded by the canonical runtime.
- Intentionally local/authenticated application chrome may be preserved with `data-sk-preserve-header` and `data-sk-preserve-footer`.
- Docusaurus/framework public navbar/footer chrome is removed by the compatibility shell unless explicitly preserved.
- Legacy top-level static mastheads are removed only when they contain clear navigation/brand chrome, protecting content/document headers.
- Legacy top-level public footers are removed unless explicitly preserved.

## Deployment enforcement

Public Pages pipelines now use one of two equivalent controls:

1. Source emits the exact v10 loader directly, with publish-time verification.
2. Build/deploy normalizer rewrites every standalone HTML document to exactly one v10 loader before upload and rejects duplicate or malformed standalone pages.

HTML fragments/templates that are not complete documents are not treated as deployable pages. This prevents false failures while preserving strict enforcement for actual published pages.

## Verified deployments

The following public surfaces were migrated or revalidated during this rollout and completed successful GitHub Pages workflows with canonical-shell enforcement:

- `www` — Academy apex/site release
- `portal`
- `labs`
- `course-catalog`
- `ibm`
- `learn`
- `microsoft`
- `media`
- `comptia`
- `badging`
- `publish`
- `brand`
- `marketing`
- `classrooms`
- `dashboard`
- `CSES-01`
- `dpg-610a`
- `prod-101`
- `ls1607`
- `lms`
- `app`
- `faculty`
- `prompt` — Pages artifact deployment now succeeds; custom-domain DNS remains tracked separately.

Additional framework/source integration was aligned for Docs, OSINT and IDR/Docusaurus public surfaces where the canonical compatibility loader is declared in application configuration.

## Source-level drift corrected

The rollout also corrected source/config references so deploy-time normalization is not the only control where practical:

- Course Catalog Docusaurus config now emits the exact `2026.08.15.1` / `v10` loader.
- Labs Docusaurus config now emits the exact `2026.08.15.1` / `v10` loader.
- Docs public entry page was upgraded from the legacy July/v7 loader to v10.
- Portal Reports public entry page was upgraded from the legacy July/v7 loader to v10.
- Prompt navigation-standard documentation was upgraded from `2026.08.15.2` to the canonical `2026.08.15.1` / v10 contract.
- Jobs and Security legacy compatibility loaders/pages were upgraded to v10 earlier in this rollout.
- Microsoft, Media and CompTIA compatibility/deployment paths now normalize published HTML to the canonical loader.

Large application/static source files that still contain historical loader markup are protected by publish-time normalization; the deployed artifact is authoritative and cannot publish with a non-v10 public shell through the enforced Pages workflow.

## Named-property coverage

The canonical shell applies to Academy, Portal, Labs, Jobs, Security, IBM, Microsoft, Badging, Media, publishing, Docs, course/self-paced pages and the other public Pages surfaces listed above.

`Forms` does not currently exist as a separate `skunkworks-academy` repository or indexed `forms.skunkworksacademy.com` code surface. It therefore has no independent public shell implementation to consolidate at this time. When a Forms public surface is added, it must consume the exact canonical v10 include above before publication.

## Outstanding external dependency

`prompt.skunkworksacademy.com` is not currently active in the GitHub Pages custom-domain configuration even though the repository contains a `CNAME` file. GitHub Pages currently publishes the repository through its organization Pages URL. The shell deployment and artifact verification are successful; DNS/custom-domain remediation is tracked in:

- `skunkworks-academy/prompt#1` — **Configure prompt.skunkworksacademy.com custom domain and DNS**

The Prompt workflow now verifies the deployed Pages artifact independently and treats unresolved external DNS as a warning rather than falsely marking a correct shell deployment as failed.

## Governance rule

A public Skunkworks Academy property is compliant only when the final published standalone HTML resolves to the canonical v10 compatibility loader exactly once and therefore receives the canonical navigation, footer and design system. Repository-local public navigation/footer implementations are not a supported parallel design system.
