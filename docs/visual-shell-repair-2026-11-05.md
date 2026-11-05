# Shared shell visual repair — 2026-11-05

PR146's [initial visual run](https://github.com/skunkworks-academy/www/actions/runs/42110635033) failed IBM mobile (distance 13) and CompTIA desktop (distance 17) against the unchanged tolerance of 12. The [main control run](https://github.com/skunkworks-academy/www/actions/runs/42111350810) passed all 20 cases, but its downloaded screenshots visibly reproduce the duplicate IBM masthead and CompTIA's white heading on a light surface. These defects predate the portal account menu.

The IBM banner was mid-fade in the failing screenshot and visible in the control screenshot. The previous test captured 250ms after DOMContentLoaded while the canonical loader was still injecting styles and fonts. Both captures had identical page dimensions; a passing fingerprint alone did not prove readable contrast or a single header.

The repair uses the existing canonical contracts:

- The publisher hero rule now uses the page runtime's computed foreground/surface pair instead of forcing white on every `main .hero h1`. Publisher heroes on dark surfaces retain their inverse foreground.
- IBM's existing legacy nav is marked `ibm-masthead`, which the canonical navigation runtime already removes. No parallel header or page-specific hiding rule is introduced.
- The browser test waits for the load event, visible shared header, loaded stylesheets and font readiness, and disables screenshot animations. It explicitly checks that IBM's duplicate masthead is absent and that CompTIA's heading contrast is at least 4.5:1.
- Shared navigation/theme cache revisions advance together; the stable theme contract version stays unchanged.

The baseline thresholds are unchanged. Any later baseline refresh must reference corrected screenshot evidence inspected after this repair; this document does not approve the unreadable original screenshots.
