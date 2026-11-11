# Academy training schedule — implementation and handover

Implemented locally on 11 November 2026 across `www`, `portal` and `api`. No deployment, real session creation, vendor booking, enrolment submission or external LMS write was performed.

## What is implemented

- `/schedule/`: catalogue-wide search, vendor/format/date/status/timezone filters, public/self-paced/private enquiry options, paginated course list and monthly calendar. Courses without dates retain a training request route. Errors fetching dates are distinguished from an empty published calendar.
- Staff dashboard in the portal's Staff operations section, anchored at `#academy-schedule-admin`. It uses the existing MSAL account/token acquisition and the API's existing `Portal.Staff`/`Portal.Admin` plus delegated-scope checks.
- Staff can create, edit, publish, unpublish and cancel Academy sessions; select courses from the complete assembled registry; add multiple meeting days; assign instructors, venues, lab pools and courseware; record seat counts, prerequisites and learning platforms; manage resource blackouts; and import reviewed JSON.
- A published public session appears in `GET /api/public/schedule`. Private cohorts and drafts are excluded. Cancelled future sessions remain visibly cancelled and have no enrolment CTA.
- SQLite transactions enforce revision checks across writes. Changes are audited with actor ID, time, action and revision. No sample sessions are seeded in production. Calendar publishing is not a learner seat reservation or vendor LMS write.
- Confirmation checks course identity, provider/platform IDs, instructor assignment, readiness, delivery resources, shared seat pools, room/instructor overlaps, blackouts, partner verification and imported IBM content restrictions. Draft/proposed dates retain visible readiness issues. External confirmation expires back to a pending public status.

## Course counts and provenance

The central source at commit `fa6c9ffc318cbebeeec85fa792f334ceba459595` contains **197 courses** in its rendered catalogue (generated entries merged by course ID with published entries). The older public JavaScript asset contains **183**. Its hard-coded validator remains untouched; the new scheduler does not depend on that fixed count.

| Source | Source records | Meaning |
| --- | ---: | --- |
| Central catalogue | 197 | Current generated and published courses |
| Central manifest | 21 | Overlaps the central listing |
| Curated additions | 7 | Courses and learning paths; review labels preserved |
| Existing website catalogue | 183 | Historical snapshot, mostly overlapping |
| Website self-paced manifest | 9 | Additional/overlapping local courses |
| Cisco Networking Academy page export | 89 | Offerings, not scheduled cohorts |
| CompTIA page | 13 | Certification/voucher offerings; not necessarily separate courses |
| IBM page | 3 | Existing partner listings |
| IBM GTP feed | 400 | Partner reference course codes, not Academy delivery commitments |

The first eight sources produce **300 Academy-listed offerings** after exact ID/title matching. The IBM feed adds **400 separately identified partner reference records**, giving **700 selectable catalogue records**. Do not describe this as 700 unique, active, Academy-deliverable courses: delivery variants can have identical titles, central entries may overlap partner curriculum without a verified code mapping, and partner records require delivery review. IBM codes are deliberately not collapsed by title. Future reconciliation should use verified vendor code mappings.

The IBM feed was retrieved over HTTPS and recorded with retrieval time and SHA-256 in `data/schedule/ibm-catalogue.json`. Observed content statuses: 382 Content Available, 4 Content Under Development, 14 No Content Available. The conservative adapter flags 296 records for clarification because content, replacement or retirement signals are incomplete/conflicting. This is **not** an assertion that 296 courses are retired. For example, some rows have a future expiry and “Content Available” alongside “Unsupported product”. Until IBM clarifies semantics, these records cannot become confirmed sessions.

Source links: [central catalogue](https://github.com/skunkworks-academy/course-catalog/blob/fa6c9ffc318cbebeeec85fa792f334ceba459595/src/pages/courses.tsx), [IBM feed](https://www.ibm.com/training/files/GTPjson/CourseFeed_Global.json), [IBM training providers](https://www.ibm.com/training/partners).

## Updating the whole registry

From `www`, using a current read-only checkout of the central catalogue:

```powershell
node scripts/import-ibm-schedule-catalogue.mjs
node scripts/build-schedule-catalogue.mjs --catalog-root <catalogue-checkout> --api-root ../api
node --test tests/schedule.test.mjs
```

Review and release `www/data/schedule/catalogue.json` and `api/data/schedule/catalogue.json` together. The upstream snapshot stores only public catalogue fields. The IBM importer strips markup, retains source status/expiry/replacement/retirement metadata and omits PRICE, tuition assumptions, lab pricing and learner data. Refresh is explicit; there is no claim of a continuously synchronized feed. The generator fails on source format changes instead of silently dropping records.

## Partner integration findings and remaining access

| Provider | Verified capability / current handling | Minimum next input |
| --- | --- | --- |
| Academy | Staff CRUD, publication, cancellation, persistence and public read API implemented | Hosted API, persistent disk, aligned Entra configuration |
| Microsoft | Learn catalogue APIs describe content. ILT Scheduler is an invited partner programme for publishing partner schedules to Learn; it is not a general booking feed | Learning Partner programme access, relevant API registration and actual session export/feed |
| Skillable | TMS documents authenticated public schedule search and class management; Studio lab APIs and TMS classes are distinct | Organisation integration key, correct TMS base URL, course/lab IDs, allowed scope and a read-only verification call |
| Cisco Networking Academy | Existing Academy export supplies 89 catalogue entries; no authorized scheduling API contract verified here | Academy administrator export, course/section IDs and approved API documentation if available |
| CompTIA | Existing listings supply 13 offerings; no authorized scheduling API contract verified here | Exact portal product (e.g. CertMaster), institutional access/export and supported integration contract |
| IBM | Public GTP catalogue feed verified; partner course availability and rights are separate | Training-provider schedule feed/export, delivery rights, instructor/lab readiness and status semantics |
| LMS | No specific deployed LMS scheduling contract established in this task | Product/version, tenant, supported API/export and course/instructor mappings |
| Other partners | Canonical managed JSON import is available | Provider identity, export and verified mappings |
| Skyworks (unresolved) | Original spoken name retained; no provider inferred | Exact provider/product name |

References checked: [Microsoft Learn Platform API](https://learn.microsoft.com/en-us/training/support/integrations-learn-platform-api-catalog-quickstart), [Microsoft ILT Scheduler](https://learn.microsoft.com/en-us/training/support/ilt-scheduler), [Skillable public schedule search](https://docs.skillable.com/apidocs/search-for-public-class-schedules), [Skillable API access and class management](https://docs.skillable.com/docs/api-access), [Skillable update-class operation](https://docs.skillable.com/apidocs/updates-a-specified-class-1).

All external scheduling providers are explicitly marked disconnected in the staff dashboard. A catalogue feed does not change that status. Reviewed JSON imports use the same role, revision and conflict checks as manual edits; raw vendor exports require mapping. No vendor write adapter has been enabled or tested against live credentials.

## Production prerequisites and limits

See `api/docs/scheduling.md` for the deployment contract. The feature is implemented and locally testable but not yet production activated. Existing portal and API defaults use different Entra tenants/application audiences; an operator must confirm the intended owning API and align its accepted tenant/audience with the portal's access-token scope before real sign-in can be verified. No tenant migration or identity configuration was performed.

The API requires Node 24 and an absolute persistent `SCHEDULE_DB_PATH`. Use a single API instance with a local persistent volume and backups; the current SQLite adapter is not suitable for ephemeral serverless storage, horizontal replicas or a network share. Vendor sync needs a hosted integration worker and credentials; those are not present in this implementation.

Seat counts are staff-maintained. Public enquiries use the existing registration form and do not reserve capacity, charge fees or enroll the learner in an external platform. Instructor/resource conflicts cover the records entered/imported into this calendar; they cannot detect unknown bookings in disconnected platforms.

## Validation

Domain/API tests cover authentication, Staff/Admin boundaries, source and field validation, publication, private/draft exclusion, edits, cancellation, optimistic locking, transaction rollback, persistence, time-zone conversion, DST gaps/folds, resource capacity and conflicts, and expired partner confirmation. Browser tests use an in-memory local API fixture and a local MSAL test context; they do not claim a successful real Microsoft sign-in.

Run backend and portal `npm test` / `npm run build`, plus website `npm run build` and `node --test tests/schedule.test.mjs`. `tests/schedule-ui.spec.cjs` exercises the staff-to-public workflow, enquiry prefill and responsive catalogue. It requires Playwright, the sibling API/portal repositories and their installed dependencies. Test-only HTML/servers are not production build entries.

Verified results: API build passed with 22 tests; portal production build passed with 19 tests; website validation/build passed, including publisher, site, catalogue, contrast, theme, Cisco, registration and CompTIA gates; 5 schedule/catalogue unit tests and 2 browser workflows passed. Existing portal merge conflicts in `.env.example`, `local.settings.sample.json` and `teams/manifest.json` were left untouched. The portal build emits an existing non-module script warning for `connections/assets/app.js`.
