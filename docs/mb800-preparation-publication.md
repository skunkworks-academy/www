# MB-800 preparation publication

`skunkworks-academy/microsoft` owns the authored MB-800 preparation guide.
`skunkworks-academy/www` composes its public pages under
`https://www.skunkworksacademy.com/courses/mb-800-exam-preparation/`.

## Release contract

- `config/microsoft-preparation-release.json` records a full reviewed source commit. The source checkout and composer both verify that immutable revision.
- The Microsoft generator emits the overview, eight module pages, study plan, mock exam, public assets, course manifest and sitemap.
- `scripts/compose-microsoft-prep.mjs` copies only the enumerated HTML routes and allowed top-level assets. It does not copy authoring content, facilitator notes, repository metadata or learner files.
- The composer merges `MB-800-PREP` into the generated course manifest, appends the guide routes to the Docusaurus sitemap input, and adds a discovery section outside the catalogue's React root.
- `scripts/publish-course-contract.mjs` verifies the combined canonical routes. The existing publisher policy preserves composed course markup and sitemap entries.
- The guide loads the Academy's central UI and footer directly. Its `data-swa-owned-course-shell="MB-800-PREP"` marker prevents the release normalizer from adding a second DOM-mutating legacy shell.

The searchable self-paced catalogue and training schedule list `MB-800-PREP`.
Guided preparation enquiries use `/course-registration/?course=MB-800-PREP`,
which selects the matching registration option. An enquiry does not create an
enrolment, reserve a date, grant access, take payment or award a credential.

## Assessment boundary

The source question bank is original public formative practice. Browser-local
results and feedback support study and review; they are not protected
summative assessments or Microsoft exam results. Do not publish private exam
items, verified learner grades or personal data through this composition.

## Validation

```sh
node --test tests/compose-microsoft-prep.test.mjs
node scripts/validate-course-catalog.mjs
npm run build
```

The release workflow additionally builds and validates the pinned Microsoft
source and runs the composition tests against the actual generated artifact.
The final course browser gate verifies the canonical shell, registration,
responsive width, light/dark rendering and accessibility. Required checks
must remain successful before merging. A successful build does not establish
production publication; verify the deployed canonical routes, exam start and
results review, nested assets and sitemap after the Pages deployment.
