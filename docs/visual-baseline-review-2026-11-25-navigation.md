# Single-header visual baseline review — 25 November 2026

The [Platform visual regression job](https://github.com/skunkworks-academy/www/actions/runs/45549928716/job/138988400226) at `288a28ac6dfd76ffaf9b17dbc37a337de6afe3c8` passed all nine navigation browser tests and 16 of 20 platform screenshots. Four desktop fingerprints exceeded the existing dHash limit after the approved removal of the second navigation row.

The [captured screenshot artifact](https://github.com/skunkworks-academy/www/actions/runs/45549928716/artifacts/14993410669) was downloaded and inspected before refreshing those four entries. The images retain their main content, controls and footer, with no clipping or horizontal overflow detected by the existing checks.

| Case | Reviewed dimensions | dHash | Average luminance | Comparison |
|---|---|---|---:|---|
| Learn desktop | 1440 × 4460 | `9888019090031124` | 211.515625 | Compared with run 44749756254: removing the second row shortens the page by 44px. The hero, five learning routes, five vendor cards, capability links, process, FAQs and footer retain their layout. |
| IBM desktop | 1440 × 4541 | `88000000d4000000` | 220.640625 | Compared with run 43447211862: the single header and compact footer replace the historical shell. After the 56px content shift, the main region is pixel-identical; 104 matching courses, 400 references, 12 cards and page 1 of 9 remain. |
| CompTIA desktop | 1440 × 3278 | `4c11aa51a155a020` | 221.765625 | Compared with run 44749756254: the page is 44px shorter, with its readable heading, 13 certification cards, actions, pricing note and footer retained. |
| Self-paced desktop | 1440 × 7807 | `4001118101a5d101` | 243.78125 | Compared with run 43444390166: the single header and compact footer accompany the already expanded catalogue of 38 courses, including MB-800-PREP. Filters, card actions and featured links remain intact. |

Aligning the Learn and CompTIA page bodies by 44px leaves no pixel with a colour-channel difference greater than 16/255. The IBM main-content comparison is exact across current rows 160–4199 and historical rows 216–4255. These measurements support the visual review of the layout changes.

Only these four baseline entries were refreshed, using the exact fingerprints emitted by the reviewed CI run. The limits remain `maxDHashDistance=12`, `maxHeightRatioDelta=0.08` and `maxAverageLumaDelta=18`. Every platform case now also checks for exactly one compact shared header and the absence of the removed horizontal row, so a similar whole-page fingerprint cannot mask its return.

This records an agent review of the captured evidence. A subsequent CI run must pass the unchanged visual thresholds before release; the baseline update itself is not a deployment result or a full accessibility audit of page content.
