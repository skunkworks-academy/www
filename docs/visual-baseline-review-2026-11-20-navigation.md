# Navigation visual baseline review — 20 November 2026

The [Chromium matrix in run 44682397770](https://github.com/skunkworks-academy/www/actions/runs/44682397770) exercised the proposed navigation at commit `5f36220941795afde9a3b8c92d22a3ee6026dfec`. Its [screenshots](https://github.com/skunkworks-academy/www/actions/runs/44682397770/artifacts/14605096710) include the desktop/mobile and light/dark navigation checks as well as the full-page matrix. The nine new navigation browser checks passed, including measured colours, loaded theme-specific artwork, focus and menu behaviour, contrast, and control bounds.

Four existing full-page fingerprints exceeded their old thresholds. The actual screenshots were compared with the [previous baseline screenshots](https://github.com/skunkworks-academy/www/actions/runs/41289305691/artifacts/13076975344), rather than changing tolerances:

| Surface | Review observation |
| --- | --- |
| Publisher, desktop | The intentional light header replaces the black header; the slides hero, three resource cards and footer remain visible and aligned. |
| Learn, mobile | The light header, learning-format and partner cards, process steps and footer remain present without horizontal overflow. |
| Microsoft, mobile | The light header and existing training hero, catalogue, journey and footer remain visible; no horizontal overflow was reported. |
| Cisco, mobile | The current page includes the Networking Academy mark and membership information added after the earlier baseline; its catalogue and footer remain present without horizontal overflow. |

The four entries in `tests/platform-visual-baseline.json` use the exact fingerprints reported by the reviewed run. No dHash, height or luminance tolerance was changed. These screenshots do not constitute a full accessibility audit of unrelated page content; the navigation checks and the existing platform checks remain in force.
