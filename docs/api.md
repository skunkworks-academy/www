# API reference

This repository is primarily a static Skunkworks Academy website and course catalogue. The API surface is small and split across:

- a local-only OWASP Top 10 training lab server;
- a course enrolment API contract consumed by the OWASP course runtime;
- browser globals and configuration used by shared navigation and course runtimes;
- a minimal SCORM 1.2 wrapper for LMS packages;
- a PHP mail script that currently acts as a direct SMTP/OAuth send script, not a general form API.

## Runtime overview

| Area | Source | Runtime | Status |
|---|---|---:|---|
| OWASP local lab HTTP API | `self-paced/security/skw-owasp-top10-2025/vulnerable-app/server.js` | Node.js >= 18 | Active local training API |
| OWASP course runtime API client | `self-paced/security/skw-owasp-top10-2025/assets/course-runtime.js` | Browser | Expects portal/enrolment integration |
| Navigation globals | `assets/skunkworks-ui.js`, `assets/academy-navigation.js`, `assets/academy-navigation.config.json` | Browser | Shared public-site contract |
| SCORM wrapper | `ibm/db2/cla96/scorm-api.js`, `ibm/db2/CLA96G_Unified_LMS_SCORMReady/scorm-api.js` | Browser in LMS frame | Minimal SCORM 1.2 integration |
| Cookie helper | `index.js` | Browser | Demo utility |
| Mail script | `contact.php` | PHP + Composer dependencies | Direct SMTP/OAuth send script |

## OWASP local lab HTTP API

The local lab lives at:

```text
self-paced/security/skw-owasp-top10-2025/vulnerable-app/
```

Start it with:

```bash
cd self-paced/security/skw-owasp-top10-2025/vulnerable-app
npm start
```

By default it listens on `http://localhost:3025`. Override the port with `PORT`.

```bash
PORT=4000 npm start
```

The server is intentionally for local educational use only. Do not expose it publicly.

### Common behavior

- CORS: `Access-Control-Allow-Origin: *`
- Methods advertised: `GET,POST,OPTIONS`
- Headers advertised: `Content-Type`
- JSON endpoints return `application/json; charset=utf-8`
- The home page returns `text/html; charset=utf-8`
- Unknown routes return `404` with `{ "error": "Route not found" }`
- Unhandled server errors return `500` with `{ "error": "Internal server error" }`

### `GET /`

Returns a simple HTML landing page listing useful lab routes.

### `GET /api/health`

Health check used by the course runtime.

Response:

```json
{
  "status": "online",
  "name": "skw-owasp10-2025-local-lab",
  "port": 3025
}
```

### `GET /api/profile/:id`

Training endpoint for A01 Broken Access Control.

Query parameters:

| Name | Required | Description |
|---|---:|---|
| `viewer` | No | Simulated viewer name. Defaults to `unknown`. |

Example:

```bash
curl "http://localhost:3025/api/profile/1?viewer=alice"
```

Success response includes:

- `lab`
- `viewer`
- `record`
- `teachingPoint`

Returns `404` when the profile ID is not found.

### `GET /api/debug`

Training endpoint for A02 Security Misconfiguration.

Returns diagnostic runtime details:

- Node.js version
- platform
- current working directory
- teaching point

This endpoint is intentionally risky as a teaching aid and should not exist in production.

### `GET /api/orders`

Training endpoint for A05 Injection and data/syntax separation.

Query parameters:

| Name | Required | Description |
|---|---:|---|
| `customer` | No | Customer selector. Defaults to `unknown`. |

Example:

```bash
curl "http://localhost:3025/api/orders?customer=alice"
```

Special training value:

- `customer=all_demo_records` returns all seeded demo orders.

Response includes:

- `lab`
- `simulatedQuery`
- `boundValue`
- `result`
- `teachingPoint`

### `GET /api/token-demo`

Training endpoint for A04 Cryptographic Failures.

Query parameters:

| Name | Required | Description |
|---|---:|---|
| `user` | No | User value used to derive a predictable demo token. Defaults to `unknown`. |

Example:

```bash
curl "http://localhost:3025/api/token-demo?user=alice"
```

Response includes a predictable `demoToken`. This is intentionally insecure for training.

### `GET /api/session-demo`

Training endpoint for A07 Authentication Failures.

Returns a base64-encoded JSON claim:

```json
{
  "sub": "alice",
  "role": "learner"
}
```

The teaching point is that encoding is not signing or integrity protection.

### `GET /api/log`

Training endpoint for A09 Logging and Alerting Failures.

Query parameters:

| Name | Required | Description |
|---|---:|---|
| `event` | No | Security event name. Defaults to `unknown`. |

Example:

```bash
curl "http://localhost:3025/api/log?event=login_failed"
```

The server normalizes the event and writes a structured JSON log line to stdout.

Response:

```json
{
  "status": "logged",
  "teachingPoint": "Log fields are normalized and structured before being written."
}
```

### `GET /api/calculate`

Training endpoint for A10 Mishandling of Exceptional Conditions.

Query parameters:

| Name | Required | Description |
|---|---:|---|
| `items` | Yes | Comma-separated numbers. |

Example:

```bash
curl "http://localhost:3025/api/calculate?items=10,20,30"
```

Success response:

```json
{
  "total": 60
}
```

Invalid input returns `400`:

```json
{
  "error": "Invalid item list",
  "teachingPoint": "User responses should be safe while diagnostics remain server-side."
}
```

### `GET /api/authorize`

Training endpoint for fail-closed authorization behavior.

Query parameters:

| Name | Required | Description |
|---|---:|---|
| `mode` | No | Use `dependency_timeout` to simulate a dependency failure. |

Default response:

```json
{
  "authorized": false
}
```

When `mode=dependency_timeout`, the endpoint returns `503` and `authorized: false`.

### `POST /api/transfer`

Training endpoint for A06 Insecure Design.

Request body:

- JSON object; no strict schema is enforced by the lab.

Example:

```bash
curl -X POST "http://localhost:3025/api/transfer" \
  -H "Content-Type: application/json" \
  -d "{\"learner\":\"demo\",\"amount\":100}"
```

Response echoes the parsed body under `received` and includes a teaching point about ownership, limits, approvals, and balance rules.

Malformed JSON does not fail the request. It is represented as:

```json
{
  "parseError": true,
  "rawLength": 123
}
```

### `POST /api/import-profile`

Training endpoint for A08 Software or Data Integrity Failures.

Accepted request fields:

- `displayName`
- `preferredLanguage`

Example:

```bash
curl -X POST "http://localhost:3025/api/import-profile" \
  -H "Content-Type: application/json" \
  -d "{\"displayName\":\"Demo Learner\",\"preferredLanguage\":\"en\",\"role\":\"admin\"}"
```

Response:

```json
{
  "lab": "A08 Software or Data Integrity Failures",
  "acceptedFields": {
    "displayName": "Demo Learner",
    "preferredLanguage": "en"
  },
  "rejectedProtectedFields": ["role"],
  "teachingPoint": "Only allow-listed fields should be accepted from client-submitted profile imports."
}
```

## OWASP course runtime integration

Source:

```text
self-paced/security/skw-owasp-top10-2025/assets/course-runtime.js
```

The browser runtime uses two API contracts.

### Enrolment check

Primary hook:

```js
window.SkunkworksAcademyEnrollment.hasCourseAccess("SKW-OWASP10-2025")
```

If the hook exists, it may return a boolean or a promise resolving to a boolean.

Fallback HTTP check:

```http
GET /api/enrolments/SKW-OWASP10-2025
Accept: application/json
Credentials: include
```

The course unlocks when the JSON response contains either:

```json
{ "enrolled": true }
```

or:

```json
{ "access": "granted" }
```

Final local fallback:

```text
localStorage["skwacademy.entitlement.SKW-OWASP10-2025"] = "granted"
```

### Lab health check

The runtime calls:

```http
GET {labBaseUrl}/api/health
```

The default lab base URL is:

```text
http://localhost:3025
```

Learners can change the lab base URL in the course UI. The value is stored in local storage as part of `skw-owasp10-2025-progress-v3`.

## Browser globals and navigation contract

### `window.SKUNKWORKS_ACADEMY_NAVIGATION`

Sources:

- `assets/skunkworks-ui.js`
- `assets/academy-navigation.js`
- `assets/academy-navigation-loader.js`
- `assets/academy-navigation.config.json`

Shape:

```js
{
  version: "2026.07.07.1",
  title: "Skunkworks Academy navigation",
  statusLabel: "Verified domains",
  pages: [
    {
      label: "Home",
      domain: "skunkworksacademy.com",
      url: "https://skunkworksacademy.com/",
      verified: true
    }
  ]
}
```

Page entries may also include:

- `aliases`: alternate hostnames treated as current for active-link detection.

### `window.SkunkworksAcademy`

The canonical UI script sets:

```js
window.SkunkworksAcademy = {
  uiLoaded: true,
  version: "2026.07.07.1",
  navigation: {
    pages: [...]
  }
}
```

The script also:

- injects the canonical design-system CSS if missing;
- creates the global navigation header unless `body[data-sk-global-nav="off"]` is present;
- preserves headers marked with `data-sk-preserve-header`;
- removes known legacy page headers outside document content;
- binds theme toggles marked with `data-sk-theme-toggle`;
- updates elements marked with `data-sk-year`;
- enables simple client search for `[data-site-search]` over `[data-search]`;
- prevents invalid `form[data-sk-validate]` submissions and focuses the first invalid field.

### Navigation loader compatibility

`assets/academy-navigation.js` and `assets/academy-navigation-loader.js` are compatibility loaders. They expose `window.SKUNKWORKS_ACADEMY_NAVIGATION`, then load the canonical UI script unless it is already present:

```text
https://skunkworksacademy.com/assets/skunkworks-ui.js?v=2026.07.07.1
```

## SCORM 1.2 wrapper

Sources:

- `ibm/db2/cla96/scorm-api.js`
- `ibm/db2/CLA96G_Unified_LMS_SCORMReady/scorm-api.js`

The wrapper searches parent windows for `window.API`, initializes the LMS session, and exposes:

```js
window.SCORM = {
  APIExists: true,
  init(),
  commit(),
  finish(),
  update(scorePct, completionPct, status)
}
```

### `SCORM.update(scorePct, completionPct, status)`

Arguments:

| Name | Description |
|---|---|
| `scorePct` | Numeric score clamped between `0` and `100`. |
| `completionPct` | Numeric completion percent clamped between `0` and `100`. |
| `status` | Optional lesson status. Allowed values: `passed`, `failed`, `completed`, `incomplete`. |

LMS fields set:

- `cmi.core.score.raw`
- `cmi.core.score.min`
- `cmi.core.score.max`
- `cmi.core.lesson_status`
- `cmi.suspend_data`

If `status` is absent or invalid, the wrapper sets:

- `completed` when `completionPct >= 90`
- otherwise `incomplete`

The wrapper commits after each update and attempts `commit()` plus `finish()` on `beforeunload`.

## Root cookie helper

Source:

```text
index.js
```

Functions:

```js
setCookie(name, value, daysToLive)
getCookie(name)
deleteCookie(name)
```

Behavior:

- `setCookie` writes a cookie at path `/` with an expiry based on `daysToLive`.
- `getCookie` decodes `document.cookie` and returns the matching value or `null`.
- `deleteCookie` expires the cookie at path `/`.

The file currently includes demo calls that set `firstName` and `lastName`, log cookies, and delete `firstName`.

## PHP mail script

Sources:

- `contact.php`
- `composer.json`

Dependencies:

- `phpmailer/phpmailer`
- `greew/oauth2-azure-provider`

`contact.php` configures PHPMailer for Office 365 SMTP with XOAUTH2 and sends a hard-coded test email. It does not currently read an HTTP request body or contact form fields, and it should not be treated as a public contact-form API without refactoring.

Expected operational concerns before production use:

- move client IDs, tenant IDs, secrets, refresh tokens, sender, and recipients to environment variables or a secret store;
- remove hard-coded credentials and test recipients;
- validate and rate-limit request input if it becomes a form handler;
- return structured success/error responses instead of direct text output;
- avoid exposing detailed mailer errors to public users.

## Non-API content

Most repository files are static HTML, Markdown, images, PDFs, course outlines, and course-specific client scripts. They provide site pages or learning content but do not expose server-side HTTP APIs.

`python/app.py` is currently empty, so it does not expose a Flask, FastAPI, or other Python API surface.
