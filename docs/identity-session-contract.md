# Skunkworks Academy Identity and Session Contract

Status: Architecture contract / documentation only  
Date: 2026-08-23  
Depends on: `docs/platform-architecture-foundation.md`  
Production behavior change: none

## 1. Purpose

This document defines the identity/session contract that must exist before any cross-property authentication implementation begins.

The contract deliberately avoids sharing browser bearer tokens, copying the portal's MSAL cache between origins, or issuing a broad `.skunkworksacademy.com` session cookie.

Microsoft Entra ID remains the identity provider. Each participating Academy application establishes its own first-party server session through a same-origin BFF/session boundary.

## 2. Non-negotiable security properties

1. No raw Entra access token or refresh token is exposed to the shared shell.
2. No application reads authentication state from another application's `localStorage` or `sessionStorage`.
3. No broad `Domain=.skunkworksacademy.com` session cookie is used as the default SSO mechanism.
4. Protected authorization decisions are enforced server-side or API-side, never by navigation or client-side route hiding alone.
5. Every production session cookie is `Secure`, `HttpOnly`, host-only and `Path=/`; prefer a `__Host-` cookie name.
6. Session endpoints are non-cacheable and do not expose secrets or bearer credentials.
7. Login return targets are allow-listed and canonicalized before redirect.
8. Authorization Code Flow with PKCE is the required browser-facing OAuth/OIDC flow for Academy applications that participate in shared sign-in.
9. PKCE uses `S256` only. `plain` PKCE is prohibited. The challenge is `BASE64URL(SHA256(code_verifier))` and the authorization request explicitly sends `code_challenge_method=S256`.
10. OIDC `state`, `nonce`, PKCE verifier/challenge and authorization codes are single-use and validated at the server-side callback boundary.
11. Session rotation occurs on successful login, privilege elevation and other security-sensitive identity changes.
12. Authorization and entitlement records reference an immutable internal Academy `subject_id`, never email address, display name or another mutable profile attribute.

## 3. Current Entra application inventory

The following inventory is derived from current repository configuration and is descriptive, not approval to deploy any configuration change.

| Application / runtime | Repository source | Tenant / authority | Client / audience | Current status |
| --- | --- | --- | --- | --- |
| Skunkworks Academy Portal SPA | `portal/src/authConfig.ts` | Tenant `338a8916-80d9-467c-a94a-7f61d04ef7d5` | Client `e22672ae-61a6-434e-b135-3360557819ec` | Current browser login owner; MSAL uses `localStorage` today |
| Portal Azure Functions API | `portal/api/config.ts`, `portal/api/auth.ts` | Tenant `338a8916-80d9-467c-a94a-7f61d04ef7d5` | Audience/client `e22672ae-61a6-434e-b135-3360557819ec` / `api://...` | Current API baseline; validates bearer JWTs with `jose` |
| Legacy Express API | `api/src/config.ts`, `api/src/auth.ts` | Tenant `972e8de4-e365-43a3-99ec-c86a0cc249e8` | Client `8b1e77b3-3017-4c54-8ab3-0e4864511b55` | Conflicting legacy identity/deployment model; must not become the BFF baseline |
| Retired / blocked portal application IDs | `portal/src/authConfig.ts` | Not authoritative | `21f093b0-e91a-4f62-ad71-2dee1e0cbc20`, `8b1e77b3-3017-4c54-8ab3-0e4864511b55` | Explicitly blocked by current portal configuration |
| Labs Access Gateway | `labs-access-gateway/docs/entra-oidc.md` | Dedicated Entra app recommended | Runtime client ID supplied through `OPENID_CLIENT_ID`; concrete ID not committed | Separate Guacamole integration; not an Academy-wide session pattern |
| `login` / `sso` repositories | repository audit | No active client configuration confirmed | None confirmed | Placeholder/minimal; no current central identity service should be inferred |

### Inventory decision

The `portal` Entra tenant (`338a8916-80d9-467c-a94a-7f61d04ef7d5`) is the current Academy identity baseline for the migration design. The legacy Express API tenant/client pair must be quarantined from new identity work until compatibility and retirement decisions are complete.

Although the existing SPA metadata describes broad Microsoft account support, the first BFF rollout is deliberately narrower: it accepts only identities issued by the canonical Skunkworks workforce tenant unless a separately reviewed multi-tenant/guest/personal-account mapping policy is approved. This prevents ambiguous subject correlation from becoming an authorization primitive during migration.

## 4. Session authority model

There is no single browser cookie shared across Academy subdomains.

Instead, each participating property owns a first-party session authority at the same origin as the application, for example:

- `https://portal.skunkworksacademy.com/auth/*`
- `https://www.skunkworksacademy.com/auth/*`
- `https://microsoft.skunkworksacademy.com/auth/*`

The exact implementation may be a BFF service, edge worker, reverse-proxied serverless function, or application backend, but the browser-visible session endpoints must remain same-origin with the property that receives the host-only cookie.

### Important hosting prerequisite

A static GitHub Pages origin cannot by itself perform server-side OIDC code exchange, maintain an opaque server session, or set an `HttpOnly` server-managed session as the application backend.

Therefore, any static property that needs authenticated state must first gain a BFF-capable serving boundary, such as a reverse-proxy/edge layer that routes `/auth/*` and `/session` to trusted server-side code while continuing to serve static assets for the rest of the host.

Until that boundary exists, the property remains anonymous/session-unaware and must not attempt to recover portal tokens from browser storage.

## 5. Cross-property bootstrap sequence

Cross-property SSO is achieved through the Entra IdP session, not by transferring the portal's application session to another subdomain.

### Sequence

1. The user signs in to the portal using Microsoft Entra ID.
2. The portal BFF completes Authorization Code Flow with S256 PKCE and establishes a portal-local host-only session.
3. The user navigates to another Academy property, for example `microsoft.skunkworksacademy.com`.
4. The target property's shell calls its own same-origin `GET /session` endpoint.
5. If no local session exists, the target property remains anonymous unless the user requests an authenticated action or the property is explicitly configured for automatic sign-in bootstrap.
6. The target property starts its own same-origin `/auth/login` flow.
7. `/auth/login` creates a high-entropy server-tracked OIDC transaction and redirects the browser to Microsoft Entra ID with the target property's registered redirect URI and `code_challenge_method=S256`.
8. Entra may reuse the user's existing IdP session, allowing SSO without requesting credentials again when policy permits.
9. Entra redirects to the target property's `/auth/callback` with an authorization code and `state`.
10. The target BFF looks up the complete server-side transaction by the opaque `state`, validates it, atomically consumes it, and only then redeems the authorization code with the stored PKCE verifier.
11. The BFF validates the returned identity token/claims against issuer, audience, nonce and canonical tenant policy, maps the verified upstream identity to an immutable Academy `subject_id`, and never derives that key from email or display name.
12. The BFF creates a new target-property server session and returns a host-only `Secure`, `HttpOnly` session cookie.
13. The browser returns to the canonicalized local `returnTo` path stored in the transaction.
14. The shell re-queries `GET /session` and renders authenticated navigation from the returned minimal session view.

### Explicitly prohibited bootstrap mechanisms

- Reading the portal's MSAL cache from another origin.
- Copying a bearer token into a query string, URL fragment, `postMessage`, shared browser storage or navigation payload.
- Using a long-lived signed bootstrap token that can be replayed across properties.
- Setting a `.skunkworksacademy.com` authentication cookie merely to make cross-subdomain recognition convenient.
- Cross-origin `GET /session` calls that depend on third-party cookie behavior.

## 6. OIDC transaction contract

Each `/auth/login` request creates one short-lived server-side authorization transaction. The high-entropy opaque `state` value is generated exactly once and is the browser-visible lookup handle for that transaction; implementations should store a cryptographic hash of `state` as the datastore key where practical.

The transaction contains at minimum:

- high-entropy opaque `state` value or its cryptographic lookup hash;
- generated OIDC `nonce`;
- PKCE `code_verifier`;
- derived PKCE `code_challenge = BASE64URL(SHA256(code_verifier))`;
- required PKCE method `S256`;
- exact registered `redirect_uri` used for the authorization request;
- expected application/property identifier;
- expected public origin;
- canonical local `returnTo` path;
- creation timestamp;
- expiry timestamp, with a default lifetime of 5 minutes and a maximum of 10 minutes unless a reviewed provider constraint requires otherwise;
- consumed/not-consumed state or equivalent one-time storage semantics;
- privacy-safe audit correlation ID.

Sensitive transaction material, including the PKCE verifier and nonce, remains server-side. Raw `state`, verifier, nonce and authorization codes must not be logged; logs should use a correlation ID or a non-reversible hash where correlation is required.

### S256 PKCE requirements

- Generate a standards-compliant high-entropy `code_verifier` with a cryptographically secure random generator.
- Derive `code_challenge` with SHA-256 and base64url encoding without padding.
- Send both `code_challenge=<derived-value>` and `code_challenge_method=S256` on the authorization request.
- Persist the original verifier in the server-side transaction and provide it only to the token endpoint during code redemption.
- Reject any transaction or callback path whose stored/requested method is absent or not `S256`. The `plain` method is never accepted.

### Callback binding and atomic replay protection

Before any token exchange, `/auth/callback` must:

1. require a `state` value;
2. resolve exactly one unexpired server-side transaction using that `state`/state hash;
3. verify that the transaction's expected property, public origin, exact `redirect_uri`, tenant policy and callback route match the current request;
4. verify the transaction has not already been consumed;
5. atomically consume or conditionally delete the transaction using datastore concurrency/ETag semantics so two callbacks cannot both succeed;
6. only after successful atomic consumption, redeem the authorization code with the stored PKCE verifier;
7. validate issuer, audience, nonce and tenant policy on the resulting identity before session creation.

A missing, expired, already-consumed, mismatched-state, mismatched-origin, mismatched-redirect, mismatched-nonce, non-S256 or otherwise invalid transaction fails closed. A replay after successful or attempted consumption must not produce a second token exchange or session.

The callback must never trust a `returnTo`, origin, redirect URI, tenant identifier or application identifier supplied only by browser/IdP callback parameters when a server-side transaction already defines the expected value.

## 7. Session cookie contract

Recommended baseline cookie semantics:

```text
Name: __Host-swa_session
Secure: true
HttpOnly: true
Path: /
Domain: omitted
SameSite: Lax
```

`SameSite=Lax` is the default because the OIDC callback uses top-level navigation. Any deviation requires a documented compatibility reason and security review.

The cookie value should be an opaque cryptographically random session identifier. It must not contain an Entra access token, refresh token, ID token, user profile, role list or entitlement payload.

### Server session record

The corresponding server-side record should contain only what is required to operate the session, including:

- session ID hash or equivalent secure lookup key;
- immutable canonical Academy `subject_id`;
- verified upstream identity linkage (`iss`, `tid`, `oid` and/or provider `sub` according to the approved mapping policy), stored separately from the Academy authorization key;
- application/property ID;
- issued-at, last-seen and expiry timestamps;
- authentication context needed for policy decisions;
- role/entitlement version or references rather than a permanently trusted client snapshot;
- revocation state;
- CSRF-verification material for cookie-authenticated state-changing operations;
- audit correlation ID.

Session stores must support revocation and bounded expiry. In-memory-only storage is not acceptable for production multi-instance deployments.

## 8. `GET /session` contract

The shared shell consumes a minimal same-origin session view. It does not consume tokens.

### Request

```http
GET /session
Accept: application/json
```

Browser fetch policy:

```text
credentials: same-origin
cache: no-store
```

### Authenticated response

```json
{
  "authenticated": true,
  "subject": "academy-subject-id",
  "displayName": "Example User",
  "roles": ["learner"],
  "entitlementsVersion": "2026-08-23T15:00:00Z",
  "sessionExpiresAt": "2026-08-23T23:00:00Z"
}
```

### Anonymous response

```json
{
  "authenticated": false
}
```

### Required headers

```text
Cache-Control: no-store, private
Pragma: no-cache
Content-Type: application/json
```

The endpoint must not return Entra access tokens, refresh tokens, ID tokens, authorization codes, session-store keys, raw Graph claims, session cookie values or personally unnecessary profile data. If a CSRF synchronizer token is exposed for subsequent same-origin writes, it is a request-integrity value only and must not convey authentication or authorization authority.

## 9. CORS and origin policy

Identity/session endpoints are same-origin by default and should not require CORS.

Where a deployment exception requires cross-origin administration or API access:

- use an explicit origin allow-list;
- never use `Access-Control-Allow-Origin: *` with credentials;
- never reflect arbitrary `Origin` values;
- never broaden cookie scope to solve CORS;
- require the security owner to document why same-origin routing is impossible.

Public static Academy sites must not be added as credentialed origins unless they actually operate a first-party BFF/session boundary.

## 10. CSRF contract

`GET /session` is read-only and must have no state-changing side effects.

All state-changing BFF endpoints authenticated by cookies require CSRF protection. The baseline is a synchronizer token held in the server-side session and supplied through a request header, combined with an exact same-origin `Origin` check and `SameSite` cookie semantics. A reviewed framework-equivalent mechanism may replace this only if it provides equivalent or stronger protection.

CSRF tokens must not be used as authorization tokens, must not be stored in long-lived URLs, and must be rotated with the session when the session identifier is rotated.

## 11. Logout and revocation contract

### Local logout

`POST /auth/logout`:

1. requires CSRF protection and exact same-origin validation;
2. revokes/deletes the local server session;
3. expires the host-only session cookie with matching host/path attributes;
4. returns the application to an anonymous state.

### Coordinated sign-out

A user-facing "sign out of Skunkworks Academy" action may additionally invoke the Entra end-session/logout flow and then visit or signal other participating applications through supported front-channel/back-channel mechanisms.

Because sessions are host-only, one application must not attempt to delete another application's cookie.

Where central revocation is required, the canonical identity/session service should maintain a revocation marker or session-family version that each application checks according to the agreed session validation policy.

## 12. Roles and entitlement contract

Authentication proves identity. Authorization remains a separate server-side decision.

Canonical minimum role vocabulary:

- `anonymous`
- `learner`
- `instructor`
- `staff`
- `administrator`

Current Entra application roles such as `Portal.Student`, `Portal.Instructor`, `Portal.Staff` and `Portal.Admin` may be mapped into this vocabulary, but the mapping must live in server-side identity/authorization logic rather than the shell.

Course enrolment, lab access, certification eligibility, cohort membership and other commercial/learning rights are entitlements, not roles. They should be data-driven and retrieved from an authoritative entitlement service.

## 13. Canonical Academy subject mapping

The Academy must not make Entra object IDs, provider subject values or mutable profile fields the permanent authorization key shared by every application.

### Internal subject rule

- Create an immutable, opaque Academy `subject_id` when a verified upstream identity is first linked.
- Store entitlements, learner-profile ownership and authorization references against `subject_id`.
- Store provider-specific identifiers in a separate identity-link table/record so provider/app-registration changes do not rewrite entitlement ownership.
- Never derive or merge `subject_id` from `email`, `preferred_username`, UPN, display name or another mutable/reassignable attribute.

### First BFF rollout policy

The first rollout is single-tenant and accepts only the canonical workforce tenant `338a8916-80d9-467c-a94a-7f61d04ef7d5`.

For that rollout, the BFF must validate issuer and tenant and use the verified upstream tuple `{iss, tid, oid}` as the Entra identity linkage when `oid` is present. A provider `sub` may be retained as supporting linkage/audit data, but it is not assumed to be a universal cross-application Academy key. The verified linkage resolves to one internal `subject_id`.

Guest, multi-tenant and personal Microsoft accounts are denied by the first BFF rollout unless an explicit identity-linking policy is reviewed and enabled. This is intentionally narrower than the existing SPA's advertised account-type support.

### Future account/application linking

When additional tenants, guests, personal Microsoft accounts or dedicated per-property Entra applications are introduced, they must be linked to an existing/new Academy `subject_id` through a controlled server-side account-linking process with proof of both identities or an administrator-governed lifecycle. Implementations must not infer equivalence merely because two identities present the same email address.

## 14. Course catalogue migration implication

`course-catalog` currently reads `skw_access_token` from browser storage and calls `https://portal.skunkworksacademy.com/api/course-access`.

That pattern must not be extended.

The catalogue should migrate to either:

1. a same-origin BFF route that performs server-side entitlement checks; or
2. a public catalogue plus authenticated launch/enrolment routes hosted behind a BFF-capable application boundary.

Static client-side gating is presentation logic only and must not be treated as protection for sensitive or licensed content.

## 15. Labs gateway exception boundary

Apache Guacamole's current documented Entra OIDC integration is a separate product-specific authentication boundary.

The documented Guacamole 1.6.0 implicit-flow requirement must not be copied into the Academy shell, portal, catalogue or future BFFs. The gateway should remain isolated and be modernized according to Guacamole-supported capabilities and Entra policy without weakening the platform-wide Authorization Code + S256 PKCE standard.

## 16. Feature flags

Identity migration must be property-scoped. Minimum flag semantics:

- `identity_bff_enabled`: enables same-origin BFF/session routes for the property;
- `identity_shell_session_enabled`: allows the shell to call `GET /session`;
- `identity_auto_bootstrap_enabled`: permits automatic OIDC bootstrap when no local session exists;
- `identity_enforcement_enabled`: enables server-side protected-route/entitlement enforcement.

Flags must default off until staging validation passes. Enabling shell awareness must not imply that protected-route enforcement is complete.

## 17. Required telemetry

Each participating application should emit privacy-minimized events for:

- login initiated;
- login callback succeeded/failed;
- OIDC transaction rejected and reason class;
- replay/conditional-consume rejection;
- session created/rotated/revoked/expired;
- `GET /session` authenticated/anonymous/error outcome;
- logout local/global initiated/completed;
- authorization denied by role or entitlement;
- CSRF validation failure;
- unexpected origin or redirect target rejection;
- identity-link mapping created/reused/rejected.

Do not log access tokens, refresh tokens, ID tokens, authorization codes, session cookie values, raw `state`, PKCE verifiers or OIDC nonces.

## 18. Implementation prerequisites

No BFF production enablement should occur until all of the following are confirmed:

- authoritative owner of `api.skunkworksacademy.com`;
- target hosting/edge mechanism that supports same-origin BFF routing for static properties;
- approved Entra app-registration model: dedicated client per application or explicitly documented shared-client exceptions;
- canonical redirect URI inventory;
- production server-side transaction/session-store technology with conditional/atomic operations;
- session idle/absolute lifetime policy;
- logout/revocation policy;
- CSRF mechanism;
- role and entitlement mapping owner;
- immutable `subject_id` identity-linking store and ownership;
- staging domain/redirect registrations;
- secrets ownership, encryption-key management and GitHub/Azure environment boundaries.

A BFF implementation PR may be developed before these production prerequisites are all activated only when it is default-disabled, cannot alter current login behavior, and fails closed until required configuration is supplied.

## 19. Definition of done for the identity-contract phase

This phase is complete when:

- the Entra client inventory is reviewed and ownership assigned;
- the legacy tenant/client conflict is explicitly quarantined from new development;
- the per-property first-party session model is approved;
- the cross-property bootstrap flow is approved;
- S256 PKCE and atomic one-time transaction consumption are explicit requirements;
- the canonical internal Academy `subject_id` and identity-linking policy are approved;
- static-host BFF prerequisites are assigned;
- `GET /session`, logout, CSRF, origin and replay rules are approved;
- redirect URI and feature-flag inventories are ready for implementation;
- no production authentication behavior has changed as part of this documentation-only phase.
