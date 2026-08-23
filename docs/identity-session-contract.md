# Skunkworks Academy Identity and Session Contract

Status: Architecture contract / documentation only  
Date: 2026-08-23  
Depends on: `docs/platform-architecture-foundation.md`  
Production behavior change: none

## 1. Purpose

This document defines the identity/session contract that must exist before cross-property authentication is enabled.

Microsoft Entra ID remains the identity provider. Each participating Academy application establishes its own first-party server session through a same-origin BFF/session boundary. The design deliberately avoids sharing browser bearer tokens, copying portal MSAL state between origins, or issuing a broad `.skunkworksacademy.com` authentication cookie.

## 2. Non-negotiable security properties

1. No raw Entra access token, refresh token or ID token is exposed to the shared shell.
2. No application reads another application's `localStorage` or `sessionStorage` authentication state.
3. No broad `Domain=.skunkworksacademy.com` session cookie is the Academy SSO mechanism.
4. Authorization is enforced server-side/API-side; navigation state is presentation only.
5. Production session cookies are host-only, `Secure`, `HttpOnly`, `Path=/` and normally `SameSite=Lax`; prefer `__Host-` names.
6. `GET /session` is non-cacheable and never returns bearer credentials or session-store keys.
7. Login return targets are same-origin, allow-listed/canonicalized and stored server-side with the transaction.
8. Browser-facing OIDC uses Authorization Code Flow with PKCE.
9. PKCE is `S256` only: `code_challenge = BASE64URL(SHA256(code_verifier))`; `plain` is prohibited and unsupported S256 fails closed.
10. Every authorization request sends the server-generated transaction `nonce`, `code_challenge` and `code_challenge_method=S256`.
11. `state`, nonce, PKCE verifier/challenge and authorization codes are single-use and validated at the server callback boundary.
12. The callback must also prove that it is returning to the browser that initiated the transaction through a short-lived host-only pre-auth browser binding.
13. Authorization/entitlement records reference an immutable internal Academy `subject_id`, never email, UPN, display name or another mutable profile value.

## 3. Current Entra inventory and migration boundary

| Application / runtime | Tenant / authority | Client / audience | Migration status |
| --- | --- | --- | --- |
| Portal SPA | `338a8916-80d9-467c-a94a-7f61d04ef7d5` | `e22672ae-61a6-434e-b135-3360557819ec` | Current browser login owner; MSAL persists state in `localStorage` today |
| Portal Azure Functions API | `338a8916-80d9-467c-a94a-7f61d04ef7d5` | `e22672ae-61a6-434e-b135-3360557819ec` / `api://...` | Current API baseline; validates Entra bearer JWTs with `jose` |
| Legacy Express API | `972e8de4-e365-43a3-99ec-c86a0cc249e8` | `8b1e77b3-3017-4c54-8ab3-0e4864511b55` | Conflicting legacy identity/deployment model; quarantined from new BFF work |
| Labs Access Gateway | Dedicated app recommended | runtime-provided client | Separate Guacamole product boundary; not the Academy-wide session pattern |

The first BFF rollout accepts only the canonical Skunkworks workforce tenant `338a8916-80d9-467c-a94a-7f61d04ef7d5`. Guest, multi-tenant and personal Microsoft accounts remain denied until a separately reviewed identity-linking policy is implemented.

## 4. Per-property session authority

There is no browser session cookie shared across Academy subdomains.

Each protected property owns same-origin browser-visible identity routes, for example:

- `https://portal.skunkworksacademy.com/auth/*`
- `https://www.skunkworksacademy.com/auth/*`
- `https://microsoft.skunkworksacademy.com/auth/*`
- `https://<property>.skunkworksacademy.com/session`

The implementation may use an application backend, edge worker, BFF or reverse-proxied serverless function, but the browser-visible identity boundary must be the same origin as the property receiving the host-only cookie.

Static GitHub Pages alone cannot perform confidential code exchange or create an `HttpOnly` server session. A static property requiring authenticated state must first gain an edge/reverse-proxy boundary that routes `/auth/*` and `/session` to trusted server-side code. Until then it remains anonymous/session-unaware and must not recover portal tokens from browser storage.

## 5. Cross-property SSO sequence

Cross-property SSO is achieved through the Microsoft Entra IdP session, not through portal-session transfer.

1. The user signs in to one Academy property.
2. That property's BFF establishes a host-only server session.
3. The user navigates to another Academy property.
4. The target shell calls only its own same-origin `GET /session`.
5. If no local session exists, the target remains anonymous until sign-in is requested or approved automatic bootstrap is enabled.
6. `GET /auth/login` creates the complete server-side OIDC transaction.
7. The BFF creates a short-lived host-only pre-auth browser binding associated with the one-time `state` and sends it as a `Secure`, `HttpOnly`, `SameSite=Lax`, `Path=/`, no-`Domain` cookie.
8. The authorization request sends the transaction's `state`, `nonce`, `code_challenge` and `code_challenge_method=S256`, plus the target property's exact registered redirect URI.
9. Entra may reuse its existing IdP session and return an authorization code without prompting for credentials again when policy permits.
10. `/auth/callback` first verifies that the returned `state` is accompanied by the initiating browser's matching pre-auth binding.
11. Only after browser binding succeeds does the BFF look up and atomically consume the server transaction.
12. The BFF redeems the code using the stored verifier, then validates issuer, audience, tenant and the stored nonce.
13. The verified upstream identity maps to an immutable Academy `subject_id`.
14. The target BFF creates a new target-local server session and host-only session cookie.
15. The pre-auth browser binding is cleared after callback processing, whether the callback succeeds or is rejected.
16. The browser returns only to the server-stored canonical local `returnTo` path.
17. The shell re-queries `GET /session` to render authenticated navigation.

A portal session is never copied into the target property.

## 6. OIDC transaction contract

Each `/auth/login` creates one short-lived server-side authorization transaction. `state` is a high-entropy opaque value generated once. Implementations should store a cryptographic hash of `state` as the datastore lookup key where practical.

The transaction contains at minimum:

- `state` or its cryptographic lookup hash;
- server-generated OIDC nonce;
- PKCE `code_verifier`;
- derived `code_challenge`;
- PKCE method fixed to `S256`;
- exact registered `redirect_uri`;
- expected application/property identifier;
- expected public origin;
- canonical local `returnTo` path;
- creation timestamp;
- expiry timestamp, normally 5 minutes and never more than 10 minutes without reviewed provider justification;
- one-time/consumption state or equivalent conditional-deletion semantics;
- privacy-safe audit correlation ID.

The server-generated nonce stored in this transaction is authoritative. The authorization request must use that exact nonce, and callback identity validation must compare the returned token nonce against that stored value. Browser or IdP parameters must never override it.

Sensitive values such as the verifier, nonce and raw `state` are not logged. Use correlation IDs or non-reversible hashes when operational correlation is required.

### PKCE requirements

- Generate the verifier with a cryptographically secure random generator and standards-compliant entropy/length.
- Derive the challenge with SHA-256 and unpadded base64url encoding.
- Send `code_challenge=<derived-value>` and `code_challenge_method=S256` on every authorization request.
- Keep the verifier server-side and send it only to the token endpoint during code redemption.
- Reject an absent/non-S256 method. Never downgrade to `plain`.

## 7. Initiating-browser binding

OIDC `state` binds the authorization response to the server transaction but does not, by itself, prove that the callback is returning to the browser that initiated login.

Every login transaction therefore requires a second, short-lived browser binding:

- it is delivered only as a host-only `Secure`, `HttpOnly`, `Path=/`, `SameSite=Lax` pre-auth cookie;
- it expires no later than the OIDC transaction;
- it is cryptographically bound to that one-time transaction/state (for example, a random value whose hash is stored with the transaction, or a server-secret HMAC over the one-time state);
- it contains no access token, refresh token, ID token, authorization code, user identity or entitlement data;
- the callback verifies the binding before transaction consumption or token redemption;
- a missing or mismatched binding fails closed and does not redeem the authorization code;
- the binding is cleared after callback success or rejection;
- a binding for one `state` cannot authorize another transaction.

This prevents an authorization transaction initiated in an attacker-controlled browser or on the backend origin from being relayed into a valid session on the victim's Academy property.

## 8. Callback binding and replay protection

Before token exchange, `/auth/callback` must:

1. require `state`;
2. verify the short-lived initiating-browser binding for that `state`;
3. resolve exactly one unexpired server-side transaction;
4. verify expected property, public origin, exact redirect URI, tenant policy and callback route;
5. verify the transaction is unconsumed;
6. atomically consume or conditionally delete the transaction using datastore concurrency/ETag semantics;
7. only then redeem the authorization code using the stored PKCE verifier;
8. validate issuer, audience, tenant and the stored nonce before identity/session creation.

Missing, expired, already-consumed, mismatched-state, mismatched-browser-binding, mismatched-origin, mismatched-redirect, mismatched-nonce or non-S256 flows fail closed. A replay must never produce a second code exchange or second session.

The callback never trusts a `returnTo`, origin, redirect URI, tenant ID or application ID supplied only by callback parameters when the server transaction defines the expected value.

## 9. Session cookie and server session

Baseline cookie:

```text
Name: __Host-swa_session
Secure: true
HttpOnly: true
Path: /
Domain: omitted
SameSite: Lax
```

The cookie value is an opaque cryptographically random session identifier. It contains no Entra tokens, profile, roles or entitlement payload.

The server record contains only what the BFF requires, including:

- secure session lookup hash;
- immutable Academy `subject_id`;
- verified upstream identity linkage;
- property/application ID;
- issued-at/expiry timestamps;
- role/entitlement references or version;
- revocation state;
- CSRF-verification material;
- audit correlation ID;
- encrypted server-only token material only where required for downstream API access/refresh.

Production storage must be multi-instance capable, support revocation and bounded expiry, and support atomic/conditional operations for authorization transactions. In-memory-only production storage is prohibited.

## 10. Canonical Academy subject mapping

The canonical authorization key is an immutable internal Academy `subject_id`.

For the initial single-tenant rollout:

- validate exact issuer and tenant;
- use verified `{iss, tid, oid}` as the Entra upstream identity linkage when `oid` is present;
- map that linkage to one internal `subject_id`;
- entitlements and learner-resource ownership reference `subject_id`, not raw Entra IDs;
- email, UPN, `preferred_username` and display name are display/contact attributes only and never identity merge keys.

`oid` is tenant-local, so it must not be treated as a universal Academy key outside the verified tenant context. Provider `sub` may be retained as supporting linkage/audit data but is not assumed to be a universal cross-application identifier.

Guests, personal Microsoft accounts and identities from other tenants are denied in the initial rollout. If tenant migration, guest support or additional per-property Entra clients are introduced later, a controlled account-linking process must associate the verified new upstream identity with the existing Academy `subject_id`. Never infer equivalence merely because two accounts present the same email address.

## 11. `GET /session`

The shared shell consumes only a same-origin minimal session view.

```http
GET /session
Accept: application/json
```

Required browser behavior:

```text
credentials: same-origin
cache: no-store
```

Authenticated response shape:

```json
{
  "authenticated": true,
  "subject": "academy-subject-id",
  "displayName": "Example User",
  "roles": ["learner"],
  "sessionExpiresAt": "2026-08-23T23:00:00Z"
}
```

Anonymous response:

```json
{
  "authenticated": false
}
```

Required headers include `Cache-Control: no-store, private`, `Pragma: no-cache`, and JSON content type. The endpoint never returns Entra access/refresh/ID tokens, authorization codes, session IDs, raw Graph claims or datastore keys.

If a CSRF synchronizer token is exposed for same-origin writes, it is request-integrity material only and conveys no authentication or authorization authority.

## 12. Origin, CORS and CSRF policy

Identity/session endpoints are same-origin by default and do not require credentialed CORS.

- Never use `Access-Control-Allow-Origin: *` with credentials.
- Never reflect arbitrary `Origin` values.
- Never broaden cookie scope to solve CORS.
- Public static properties are not credentialed origins unless they operate a first-party BFF/session boundary.

All state-changing cookie-authenticated endpoints require CSRF protection. The baseline combines a synchronizer token (or framework-equivalent mechanism), exact same-origin `Origin` checking and `SameSite` cookie behavior.

`GET /session` remains read-only and has no state-changing side effects.

## 13. Logout and revocation

`POST /auth/logout`:

1. requires CSRF and exact same-origin validation;
2. revokes/deletes the local server session;
3. expires the host-only session cookie;
4. returns the property to anonymous state.

Coordinated Academy sign-out may additionally invoke Entra logout and supported front-/back-channel mechanisms. One property never attempts to delete another property's host-only cookie.

## 14. Roles and entitlements

Authentication proves identity; authorization is a separate server-side decision.

Minimum Academy role vocabulary:

- `anonymous`
- `learner`
- `instructor`
- `staff`
- `administrator`

Current `Portal.Student`, `Portal.Instructor`, `Portal.Staff` and `Portal.Admin` claims may be mapped server-side into this vocabulary.

Course enrolment, lab access, certification eligibility, cohort membership and commercial learning rights are entitlements, not roles. They are data-driven and reference the canonical Academy `subject_id`.

## 15. Course catalogue implication

The existing catalogue pattern that reads `skw_access_token` from browser storage and targets `https://portal.skunkworksacademy.com/api/course-access` must not be extended.

Protected catalogue functionality must eventually use either a same-origin BFF route that performs server-side entitlement checks or a public catalogue plus authenticated launch/enrolment routes behind a BFF-capable boundary. Static client-side gating is presentation logic, not protection for licensed/sensitive material.

## 16. Labs gateway exception

Apache Guacamole's documented Entra integration remains a product-specific boundary. Its implicit-flow constraint must not be copied into the Academy portal, shell, catalogue or future BFF implementations. Academy web BFFs use Authorization Code + S256 PKCE.

## 17. Feature flags

Identity migration remains property-scoped:

- `identity_bff_enabled` — enables BFF/session routes;
- `identity_shell_session_enabled` — lets the shell call `GET /session`;
- `identity_auto_bootstrap_enabled` — permits automatic OIDC bootstrap;
- `identity_enforcement_enabled` — enables protected-route/entitlement enforcement.

Flags default off until staging validation passes. Shell awareness does not imply authorization enforcement is complete.

## 18. Required telemetry

Emit privacy-minimized events for:

- login initiated;
- callback success/failure;
- browser-binding rejection;
- OIDC transaction/replay rejection reason class;
- session creation/rotation/revocation/expiry;
- authenticated/anonymous/error `GET /session` outcome;
- local/global logout;
- authorization denial;
- CSRF failure;
- unexpected origin/redirect rejection;
- identity-link mapping created/reused/rejected.

Never log tokens, authorization codes, session cookie values, raw state, PKCE verifiers, OIDC nonces or pre-auth browser-binding values.

## 19. Production prerequisites

Production enablement requires confirmation of:

- authoritative `api.skunkworksacademy.com` ownership;
- same-origin BFF-capable edge/routing topology;
- confidential Entra web application model and exact redirect URI inventory;
- server-side distributed transaction/session storage with atomic conditional operations;
- session lifetime/revocation policy;
- CSRF mechanism;
- immutable `subject_id` identity-link store and owner;
- role/entitlement owner;
- staging registrations;
- secrets and encryption-key ownership;
- Azure/GitHub environment boundaries and least-privilege deployment identity.

An implementation PR may be developed before all production prerequisites are activated only if it is default-disabled, cannot alter current login behavior and fails closed until required configuration exists.

## 20. Definition of done

The identity-contract phase is complete when:

- Entra inventory and legacy quarantine are reviewed;
- per-property host-only session authority is approved;
- cross-property SSO is defined through Entra rather than token/session transfer;
- S256 PKCE, nonce binding, initiating-browser binding and atomic one-time transaction consumption are explicit;
- immutable Academy `subject_id` mapping is approved;
- static-host BFF prerequisites are assigned;
- `/session`, origin, CSRF, logout and replay contracts are approved;
- no production authentication behavior changed in this documentation-only phase.
