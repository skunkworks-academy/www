# SKW-OWASP10-2025 — OWASP Top 10:2025 Web Application Security

Canonical course page:

`https://skunkworksacademy.com/self-paced/security/skw-owasp-top10-2025/`

This folder contains the Skunkworks Academy OWASP Top 10:2025 self-paced course. The public page exposes a course overview and enrolment call to action. Full course content is rendered only after an enrolment check grants access.

## Access model

Course content is enrolment-gated in the browser runtime:

1. The landing page renders only public overview content by default.
2. The interactive workspace stays locked until access is verified.
3. The runtime checks the Academy portal hook first:

```js
window.SkunkworksAcademyEnrollment.hasCourseAccess('SKW-OWASP10-2025')
```

4. If no hook is available, it checks the entitlement API:

```text
/api/enrolments/SKW-OWASP10-2025
```

5. Only after access is granted does the page dynamically load:

```text
./assets/course-content.js
./assets/course-labs.js
```

For production-grade protection, the hosting layer should also restrict direct access to gated content assets or move them behind an authenticated API.

## Included

- `index.html` — enrolment-gated course landing page and locked workspace shell.
- `assets/course.css` — responsive course styling.
- `assets/course-runtime.js` — enrolment check, progress tracking, rendering and completion export.
- `assets/course-content.js` — expanded module content loaded after enrolment.
- `assets/course-labs.js` — lab, assessment and reference data loaded after enrolment.
- `vulnerable-app/` — local training lab server for practical exercises.
- Browser-based progress tracking using `localStorage` after enrolment.
- Evidence notes, final assessment, capstone notes and downloadable completion record.

## Expanded course structure

1. Orientation: ethics, scope, environment and evidence.
2. A01: Broken Access Control.
3. A02: Security Misconfiguration.
4. A03: Software Supply Chain Failures.
5. A04: Cryptographic Failures.
6. A05: Injection.
7. A06: Insecure Design.
8. A07: Authentication Failures.
9. A08: Software or Data Integrity Failures.
10. A09: Security Logging and Alerting Failures.
11. A10: Mishandling of Exceptional Conditions.

Each module now includes:

- summary
- learning outcomes
- lesson content
- practical checklist
- immediate knowledge check

## Labs and assessment

The course includes ten practical labs, a 12-question final assessment and a capstone remediation report prompt. Labs are rendered only after enrolment verification.

## Local lab execution

```bash
cd self-paced/security/skw-owasp-top10-2025/vulnerable-app
npm start
```

Then open:

```text
http://localhost:3025
```

## Publishing note

The requested public path is:

`https://skunkworksacademy.com/self-paced/security/skw-owasp-top10-2025/`

The Skunkworks Academy hosting layer must serve this repository path at the domain root and should enforce learner entitlement for gated assets or API responses.

## Originality and attribution

The course text, lab structure and assessment content are original Skunkworks Academy material. OWASP names and public references are used for taxonomy alignment and attribution. This course is not endorsed by OWASP.

Primary references:

- OWASP Top 10:2025
- OWASP Top Ten Project
- OWASP ASVS
- OWASP WSTG
- OWASP Cheat Sheet Series
- NIST SSDF SP 800-218
