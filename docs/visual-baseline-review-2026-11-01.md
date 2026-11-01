# Visual regression baseline review — 2026-11-01

The existing visual baseline was captured from workflow run `34156115011` at commit `91d351204bf598ed18e6624e0a58df0c3730c54d`. Its page-height and perceptual fingerprints no longer reflect the current site shell and contents.

The [Chromium render matrix from workflow 41289305691](https://github.com/skunkworks-academy/www/actions/runs/41289305691) provided fresh measured visual fingerprints and screenshot artifacts at 1440px desktop and 390px mobile. [Screenshot artifact](https://github.com/skunkworks-academy/www/actions/runs/41289305691/artifacts/13076975344).

Eight affected cases were refreshed while **retaining all prior thresholds**, `maxDHashDistance=12`, `maxHeightRatioDelta=0.08`, and `maxAverageLumaDelta=18`:

| Case | Old height | New height | Reason for review |
|---|---:|---:|---|
| home-desktop | 3497 | 4932 | Prior site baseline no longer reflects current rendered content length |
| home-mobile | 6035 | 9579 | Prior site baseline no longer reflects current rendered content length |
| learn-desktop | 4592 | 4649 | Perceptual difference in shared shell |
| ibm-desktop | 3489 | 3520 | Perceptual difference in shared shell |
| cisco-desktop | 4216 | 4247 | Perceptual difference in shared shell |
| forms-desktop | 3346 | 3161 | Color and layout difference; forms responsive layout also repaired |
| forms-mobile | 5745 | 5570 | Fixed real 403px overflow at 390px viewport; updated visual after fix |
| self-paced-mobile | 19576 | 21357 | Content-length difference in the current site |

The Forms overflow was diagnosed with DOM bounding rectangles and fixed via shrinkable CSS-grid tracks and child min-width: 0. No global overflow clipping was introduced.

**Evidence scope:** The fingerprints above are measured from GitHub Actions, not a subjective human screenshot approval. The CI screenshot artifact remains attached for independent review. A future UI change must still pass the unchanged pixel-fingerprint limits, asset checks and full-page layout checks. The build is not authorized to ignore failing visual, accessibility or route tests.

**Release dependency:** The same PR introduces canonical course navigation, sitemap composition, learner registration and per-course Chromium/axe contrast testing. This baseline refresh alone is not evidence that those tests have passed.
