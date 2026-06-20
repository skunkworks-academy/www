# Skunkworks Academy Public Web Recon Audit

Date: 2026-06-20
Scope: skunkworksacademy.com public web estate, verified subdomains shown by GitHub Pages, and connected skunkworks-academy GitHub repositories.

## Executive summary

Skunkworks Academy has a visible public ecosystem with a main navigation domain, course pages, partner/course catalogues, jobs directory, and several verified or planned subdomains. The current estate is functional enough to act as a public entry point, but it is not yet fully unified as one governed product surface.

The main gaps are:

1. Multiple visual systems are active at the same time.
2. Several routes are advertised in navigation and sitemap but appear planned, incomplete, separately deployed, or not yet aligned.
3. The sitemap is too shallow for the volume of public HTML content in the .github repository.
4. The main domain, faculty directory, self-paced courses, Microsoft catalogue, IBM content, CompTIA pages, jobs subdomain, and portal-related repositories are not yet driven by one shared layout contract.
5. Some pages still use inline CSS or page-specific CSS instead of the shared Skunkworks design system.
6. Public pages do not yet expose a single canonical repository/source map, making maintenance and backlink ownership harder.

## Verified domains observed

From the GitHub verified domains screen supplied during this audit:

- skunkworksacademy.com
- portal.skunkworksacademy.com
- jobs.skunkworksacademy.com
- security.skunkworksacademy.com
- ibm.skunkworksacademy.com
- badge-hub.skunkworksacademy.com

## Public sitemap inventory

The active sitemap currently lists these public URLs:

| URL | Frequency | Priority | Audit status |
|---|---:|---:|---|
| https://skunkworksacademy.com/ | weekly | 1.0 | Active main landing page |
| https://skunkworksacademy.com/self-paced/ | weekly | 0.8 | Redirect-style landing page |
| https://skunkworksacademy.com/self-paced/claude/cld-uf-101/ | weekly | 0.9 | Active course page |
| https://skunkworksacademy.com/self-paced/claude/cld-dev-201/ | weekly | 0.9 | Active course page |
| https://skunkworksacademy.com/microsoft/index.html | weekly | 0.8 | Listed, should be checked against actual source repo and live availability |
| https://portal.skunkworksacademy.com/ | weekly | 0.8 | Verified domain, portal target |
| https://jobs.skunkworksacademy.com/ | weekly | 0.7 | Active jobs directory |
| https://labs.skunkworksacademy.com/ | weekly | 0.8 | Listed as platform destination |
| https://blog.skunkworksacademy.com/ | weekly | 0.6 | Listed as planned content area |
| https://docs.skunkworksacademy.com/ | weekly | 0.7 | Listed as planned content area |
| https://prompt.skunkworksacademy.com/ | weekly | 0.7 | Listed as planned content area |
| https://publish.skunkworksacademy.com/ | weekly | 0.6 | Listed as planned content area |

## Main page findings

Source: skunkworks-academy/.github/index.html

Strengths:

- Has SEO title, description, keywords, author, robots, canonical, Open Graph, Twitter card, favicon, and JSON-LD metadata.
- Presents the domain as a unified learning ecosystem.
- Provides high-level platform cards for Portal, Jobs, Labs, Blog, Docs, Prompt, and Publish.
- Includes a visible site tree and learner journey.

Gaps:

- Uses `/assets/academy-ecosystem.css`, not the new shared design system.
- Uses a different class naming model from the new `sk-*` design-system convention.
- Main navigation references partner pages that may not all exist or may not be listed in sitemap.
- Blog, Docs, Prompt, and Publish are labelled planned but still appear as navigable public destinations.
- Sitemap does not include faculty, CompTIA pages, partner pages, IBM DB2 pages, Python pages, or course-registration pages discovered in repository search.

Recommended action:

- Migrate the main landing page to `/faculty/assets/css/skunkworks-design-system.css` or promote that file to a root `/assets/skunkworks-design-system.css`.
- Replace one-off `academy-ecosystem.css` classes with `sk-*` components.
- Update sitemap to include every public route intentionally published.
- Add clear status badges for Active, Preview, Planned, Deprecated, and Redirect.

## Self-paced findings

Source: skunkworks-academy/.github/self-paced/index.html

Findings:

- The self-paced index uses a meta refresh redirect to `claude/cld-uf-101/index.html`.
- It uses inline page-specific CSS.
- It does not act as a real catalogue despite being labelled Self-Paced Courses.

Recommended action:

- Replace redirect page with an actual catalogue landing page listing CLD-UF-101, CLD-DEV-201, Microsoft, CompTIA, IBM, Python, and future course pathways.
- Use shared header/footer and `sk-card` layout.
- Keep redirect only if there is a specific campaign reason.

## Claude course page findings

Sources:

- skunkworks-academy/.github/self-paced/claude/cld-uf-101/index.html
- skunkworks-academy/.github/self-paced/claude/cld-dev-201/index.html

Strengths:

- Strong SEO and course-specific metadata.
- Course schema/JSON-LD exists.
- Clear course board, outcomes, curriculum, locked content model, and enrolment forms.
- Course routes are present in sitemap.

Gaps:

- Both pages use their own local CSS and inline CSS blocks.
- Header/navigation differs from main landing page and new faculty page.
- Forms do not yet use shared `sk-form`, `sk-field`, `sk-input`, and `sk-button` components.
- `formsubmit.co` workflow is functional but should be reviewed for governance, privacy, delivery reliability, and automation into CRM/LMS.

Recommended action:

- Migrate both course pages to the shared design system while preserving course-specific branding.
- Standardise enrolment forms and consent blocks.
- Add course data to a central JSON catalogue and render cards dynamically.

## Jobs subdomain findings

Source: skunkworks-academy/job-sites/index.html

Strengths:

- Simple directory page with search, filters, copy/export buttons, and application tips.
- Footer links back to GitHub repository and contact email.

Gaps:

- Uses its own `css/style.css`, not shared design-system CSS.
- Does not share the global Skunkworks Academy navigation shell.
- The parsed public page can show an empty state before JavaScript renders job cards.
- The domain is linked from main landing page and sitemap, but the visual treatment is not unified.

Recommended action:

- Migrate to `sk-topbar`, `sk-page-header`, `sk-card`, `sk-form`, and `sk-footer`.
- Add canonical link, Open Graph metadata, and JSON-LD.
- Ensure the no-JavaScript fallback includes at least a useful static list or explanatory message.

## Faculty findings

Source: skunkworks-academy/.github/faculty/index.html

Current status:

- The faculty page has been refactored to consume the shared Skunkworks Academy design system.
- It now uses `data-brand="academy"`, `sk-topbar`, `sk-hero`, `sk-grid`, `sk-card`, `sk-stats`, `sk-cta`, and `sk-footer`.

Remaining action:

- Add faculty route to sitemap.
- Confirm live GitHub Pages routing exposes `/faculty/` from the expected source branch/root.
- Add missing target faculty members if required: Raydo Matthee, John Lewis, Maria Dercksen, Analita Goncalves.

## GitHub repository inventory snapshot

Connected repositories discovered in the skunkworks-academy installation include:

| Repository | Approx size KB | Likely role |
|---|---:|---|
| skunkworks-academy/.github | 64404 | Main public pages, sitemap, faculty, self-paced, IBM/CompTIA/partners/static assets |
| skunkworks-academy/www | 103726 | Legacy/main website assets and older Carbon/Bootstrap implementation |
| skunkworks-academy/lms | 3227 | LMS / portal source candidate |
| skunkworks-academy/job-sites | 62 | jobs.skunkworksacademy.com source |
| skunkworks-academy/ibm | 20284 | IBM subdomain/source candidate |
| skunkworks-academy/security | 30 | security subdomain/source candidate |
| skunkworks-academy/labs | 1 | labs subdomain/source candidate, appears minimal |
| skunkworks-academy/Microsoft | 149 | Microsoft catalogue/source candidate |
| skunkworks-academy/app | 1 | app placeholder/minimal |
| skunkworks-academy/dashboard | 11 | dashboard placeholder/minimal |

## Public content hierarchy observed

```text
skunkworksacademy.com/
├── /                         Main ecosystem landing page
├── /sitemap.xml              Sitemap with 12 URLs
├── /robots.txt               Allows all crawlers and points to sitemap
├── /self-paced/              Redirect-style page
├── /self-paced/claude/
│   ├── /cld-uf-101/          Claude User Fundamentals
│   └── /cld-dev-201/         Claude for Developers
├── /microsoft/index.html     Listed in sitemap and main navigation
├── /faculty/                 Public faculty page, design-system migrated
├── /partners/                Partner pages discovered in repository search
├── /comptia/                 CompTIA pages discovered in repository search
├── /ibm/                     IBM and DB2 pages discovered in repository search
├── /python/                  Python pages discovered in repository search
├── /course-registration/     Registration/thank-you route discovered
└── subdomains
    ├── portal.skunkworksacademy.com
    ├── jobs.skunkworksacademy.com
    ├── labs.skunkworksacademy.com
    ├── blog.skunkworksacademy.com
    ├── docs.skunkworksacademy.com
    ├── prompt.skunkworksacademy.com
    ├── publish.skunkworksacademy.com
    ├── security.skunkworksacademy.com
    ├── ibm.skunkworksacademy.com
    └── badge-hub.skunkworksacademy.com
```

## Design uniformity risk matrix

| Area | Current state | Risk | Priority |
|---|---|---:|---:|
| Main landing page | Good content, separate CSS | Medium | P1 |
| Faculty | Design-system migrated | Low | P2 |
| Self-paced index | Redirect with inline CSS | High | P0 |
| CLD-UF-101 | Good content, separate CSS/inline CSS | Medium | P1 |
| CLD-DEV-201 | Good content, separate CSS/inline CSS | Medium | P1 |
| Jobs | Functional but separate UI | Medium | P1 |
| Blog/Docs/Prompt/Publish | Publicly linked but planned | High | P0 |
| Security/IBM/Badge Hub verified domains | Need live/source mapping | Medium | P1 |
| Microsoft/Partner/CompTIA pages | Discovered, not fully sitemap-governed | Medium | P1 |

## Navigation and backlink risks

- The main page acts as a central backlink hub, but several destinations are planned or not yet proven live.
- Some internal pages link directly to raw GitHub assets for favicons and images, which is functional but not ideal for long-term asset governance.
- Partner pages are linked from navigation but are not all represented in sitemap.
- Some public content exists in repositories but is not discoverable through the main sitemap.
- Jobs footer links directly to its GitHub repository, while other pages do not consistently expose repository provenance.

## Required remediation backlog

### P0: stabilise public navigation

1. Decide which subdomains are active, preview, planned, or retired.
2. Remove or clearly badge planned domains from user-facing primary navigation until they have landing pages.
3. Replace `/self-paced/` redirect with a real catalogue page.
4. Publish a root-level design-system asset path, preferably `/assets/skunkworks-design-system.css`.
5. Add `/faculty/` to sitemap.

### P1: unify design system

1. Migrate main index page to `sk-*` design-system components.
2. Migrate jobs page to the shared design system.
3. Migrate Claude course pages to the shared design system.
4. Migrate Microsoft/CompTIA/IBM/partner pages into the same header/footer/card/form pattern.
5. Replace inline CSS blocks with shared CSS tokens and components.

### P1: repository/domain mapping

1. Create `PUBLIC_WEB_MAP.json` mapping domains, paths, source repos, branch, deployment method, status, owner, and primary CTA.
2. Create `PUBLIC_ROUTE_INVENTORY.csv` with URL, route type, source repo, file path, status, canonical, design-system status, and notes.
3. Add a consistent `README.md` to each public-facing repo explaining deployment and domain ownership.

### P2: SEO and compliance

1. Expand sitemap to include all intentional public content.
2. Add canonical links and Open Graph metadata consistently.
3. Add noindex to placeholder/planned domains or unpublished preview routes.
4. Standardise privacy, terms, learner agreement, and data-processing links.
5. Add `security.txt` if security.skunkworksacademy.com is intended as a security disclosure endpoint.

## Recommended canonical governance file

Create a machine-readable public web map:

```json
{
  "domain": "skunkworksacademy.com",
  "status": "active",
  "source_repo": "skunkworks-academy/.github",
  "branch": "main",
  "design_system": "skunkworks-design-system.css",
  "routes": [
    {"path": "/", "status": "active", "type": "landing"},
    {"path": "/self-paced/", "status": "needs-rework", "type": "catalogue"},
    {"path": "/faculty/", "status": "active", "type": "directory"}
  ]
}
```

## Immediate next action

The next implementation step should be to create and maintain:

- `/PUBLIC_WEB_MAP.json`
- `/PUBLIC_ROUTE_INVENTORY.csv`
- root-level `/assets/skunkworks-design-system.css`
- updated `/sitemap.xml`
- a real `/self-paced/` catalogue page

This will make the public web estate navigable, searchable, indexable, and easier to keep visually unified.
