# Shared shell visual repair — 2026-11-05

PR146's [initial visual run](https://github.com/skunkworks-academy/www/actions/runs/42110635033) failed IBM mobile (distance 13) and CompTIA desktop (distance 17) against the unchanged tolerance of 12. The [main control run](https://github.com/skunkworks-academy/www/actions/runs/42111350810) passed all 20 cases, but its downloaded screenshots visibly reproduce the duplicate IBM masthead and CompTIA's white heading on a light surface. These defects predate the portal account menu.

The IBM banner was mid-fade in the failing screenshot and visible in the control screenshot. The previous test captured 250ms after DOMContentLoaded while the canonical loader was still injecting styles and fonts. Both captures had identical page dimensions; a passing fingerprint alone did not prove readable contrast or a single header.

The repair uses the existing canonical contracts:

- The publisher hero rule now uses the page runtime's computed foreground/surface pair instead of forcing white on every `main .hero h1`. Publisher heroes on dark surfaces retain their inverse foreground.
- IBM's existing legacy nav is marked `ibm-masthead`, which the canonical navigation runtime already removes. No parallel header or page-specific hiding rule is introduced.
- The browser test waits for the load event, visible shared header, loaded stylesheets and font readiness, and disables screenshot animations. It explicitly checks that IBM's duplicate masthead is absent and that CompTIA's heading contrast is at least 4.5:1.
- Shared navigation/theme cache revisions advance together; the stable theme contract version stays unchanged.

The baseline thresholds are unchanged. Any later baseline refresh must reference corrected screenshot evidence inspected after this repair; this document does not approve the unreadable original screenshots.

## Corrected screenshot review

The [repair render matrix](https://github.com/skunkworks-academy/www/actions/runs/42113041801) at `e829617a7c62e9f970f0b74c4bf35954f463ea5e` passed the new explicit contrast and duplicate-header checks, all runtime/asset/overflow checks, and 17 existing visual fingerprints. The [screenshot artifact](https://github.com/skunkworks-academy/www/actions/runs/42113041801/artifacts/13454987839) was downloaded and its three changed images inspected before recording these measured replacements:

| Case | Height | dHash | Average luminance | Inspected result |
|---|---:|---|---:|---|
| IBM desktop | 3421 | `0080000181000080` | 251.296875 | Single canonical black header; legacy blue masthead removed; visible IBM banner, text, filters, three cards and footer |
| IBM mobile | 6472 | `890041010101a400` | 245.90625 | Same header correction at390px; completed banner animation; stacked cards and full footer without horizontal overflow |
| CompTIA desktop | 3467 | `9492aaa151202080` | 211.515625 | Readable dark heading on light surface; computed heading contrast check passes; cards and footer retain their layout |

Only these three cases were refreshed. The tolerances remain dHash12, height ratio0.08 and average luminance18. This is an agent screenshot review, not a claim of separate human approval or production deployment. A subsequent CI run must pass the unchanged gate before merge.
