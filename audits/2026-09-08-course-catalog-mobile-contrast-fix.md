# Course catalogue mobile contrast remediation

Date: 2026-09-08

## Production symptom

The canonical `/courses` hero rendered dark graphite/slate foregrounds over the dark navy/blue gradient on mobile. The affected content included the catalogue eyebrow, H1, lead copy and CTA labels.

## Root cause

The course catalogue intentionally defines a dark layered gradient hero with light foregrounds. The Academy global foreground/background runtime can classify layered/transparent gradient descendants as a light surface and apply its global `!important` foreground contract after the Docusaurus CSS is loaded. This overrides the intended hero colours.

## Remediation

Source repository: `skunkworks-academy/course-catalog`

Merged PR: `#42` — Fix mobile course catalogue hero contrast

Merged commit: `f59efb7e3fb032ff2271491147c0dfaa37464b86`

The course-catalog global stylesheet now contains a hero-specific contrast guard that deliberately outranks the Academy runtime foreground contract while remaining scoped to hero surfaces. It restores:

- white hero headings;
- high-contrast light body copy;
- a brighter light-blue eyebrow;
- white CTA labels, including the primary blue CTA;
- readable hero metric text.

The catalogue layout, gradient, filters, course cards and global Academy shell are unchanged.

## Pre-merge verification

GitHub Actions run `34171508158` completed successfully. The following checks passed:

- dependency installation;
- course-content validation;
- generated-catalog validation;
- deployment-config validation;
- Docusaurus production build;
- canonical `/courses` output verification;
- build artifact upload.

Registry Governance run `34171508442` also passed.

## Contrast targets

Representative static colour pairs are above WCAG AA requirements:

- white `#ffffff` on Ink Navy `#03033a`: approximately 19.5:1;
- lead copy `#dce8f8` on dark navy `#0a1643`: approximately 14.0:1;
- primary CTA white text on Skunk Blue `#1e6bd0`: approximately 5.16:1.

## Production acceptance gate

The `www` release pipeline must rebuild the canonical course catalogue from `course-catalog/main`, mount it under `/courses`, validate the final composed site, deploy GitHub Pages and complete the production-domain verification job. The change is not considered production-verified until those stages pass.
