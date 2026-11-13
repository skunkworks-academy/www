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

## Additional pre-existing self-paced screenshot baseline

The self-paced desktop render was also found to vary around a stale visual fingerprint. The [reviewed 1440px screenshot in CI run 43444390166](https://github.com/skunkworks-academy/www/actions/runs/43444390166/artifacts/14047592910) shows the full, readable 37-course catalogue, one Academy header, and the footer with no horizontal overflow. Its measured fingerprint was approved as the self-paced desktop baseline: width 1440, height 7937, dHash `a101028101010101`, average luminance 241.21875. The previous recorded height was 7383.

That screenshot's real hash is within 10 bits of the other two observed fingerprint variants (`2101210131a50101` and `a101010101218001`), using the unchanged dHash distance limit of 12. The previous stale hash could reject these otherwise acceptable full-catalogue renders. The updated visual test additionally waits for the asynchronous course catalogue to finish loading and the layout to settle. No visual check was disabled.

## Brand constraints

Linux Foundation brand guidelines require checking with the foundation before using its logo on a commercial website. Do not substitute an unverified partnership logo or claim Authorized Training Partner status. Likewise the existing GitHub wordmark is a referential platform logo, not an official Skunkworks partner status badge. Partner affiliations and logos remain subject to the partner programme's actual permissions.

The updated run must pass all checks before release. The published site should be checked after merge.
