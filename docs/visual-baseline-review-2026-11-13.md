# Visual baseline review — 13 November 2026

## Scope and evidence

The [Chromium render matrix in GitHub Actions run 43447211862](https://github.com/skunkworks-academy/www/actions/runs/43447211862) captured all 20 representative surfaces at desktop (1440px) and mobile (390px). [Screenshot artifact](https://github.com/skunkworks-academy/www/actions/runs/43447211862/artifacts/14049265780).

PR #160 adds two educational resource cards to the Academy homepage, taking the feature grid to eight cards. The test now explicitly decodes the lazy-loaded partner logos before its full-page capture; the reviewed desktop screenshot shows Google Cloud Partner, Microsoft in Education, IBM Silver, Red Hat Ready, Cisco NetAcad, CompTIA and GitHub artwork. The Linux Foundation remains a neutral text nameplate pending commercial brand-use permission.

The IBM course catalogue has grown since the existing approval and renders more rows. The captured IBM desktop/mobile pages retain one canonical navigation header, functional visible filters/search, course grid, and footer. No horizontal overflow or failed local image/CSS/JS asset checks were reported.

## Reviewed replacements

| Case | Previous height | New height | Reason |
|---|---:|---:|---|
| home-desktop | 5265 | 5648 | Eight cards, logos successfully loaded |
| home-mobile | 9953 | 10837 | Additional stacked partner/resource cards, accessible width |
| ibm-desktop | 3421 | 4730 | Expanded IBM catalogue, no clipping |
| ibm-mobile | 6472 | 10225 | Expanded responsive IBM catalogue, no horizontal overflow |

All four baselines use the measured width, page height, dHash and average luminance from the same CI run above. The existing strict limits are unchanged: `maxDHashDistance=12`, `maxHeightRatioDelta=0.08`, `maxAverageLumaDelta=18`. All existing page/asset/console checks remain active. This update does **not** disable visual regression; future changes will still be rejected against these measured fingerprints.

## Brand constraints

Linux Foundation brand guidelines require checking with the foundation before using its logo on a commercial website. Do not substitute an unverified partnership logo or claim Authorized Training Partner status. Likewise the existing GitHub wordmark is a referential platform logo, not an official Skunkworks partner status badge. Partner affiliations and logos remain subject to the partner programme's actual permissions.

The updated run must pass all checks before release. The published site should be checked after merge.
