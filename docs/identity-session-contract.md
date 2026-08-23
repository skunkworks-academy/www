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
9. OIDC `state`, `nonce`, PKCE verifier/challenge and authorization codes are single-use and validated at the server-side callback boundary.
10. Session rotation occurs on successful login, privilege elevation and other security-sensitive identity changes.

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
2. The portal BFF completes Authorization Code Flow with PKCE and establishes a portal-local host-only session.
3. The user navigates to another Academy property, for example `microsoft.skunkworksacademy.com`.
4. The target property's shell calls its own same-origin `GET /session` endpoint.
5. If no local session exists, the target property remains anonymous unless the user requests an authenticated action or the property is explicitly configured for automatic sign-in bootstrap.
6. The target property starts its own same-origin `/auth/login` flow.
7. `/auth/login` creates server-tracked OIDC transaction state and redirects the browser to Microsoft Entra ID with the target property's registered redirect URI.
8. Entra may reuse the user's existing IdP session, allowing SSO without requesting credentials again when policy permits.
9. Entra redirects to the target property's `/auth/callback` with an authorization code.
10. The target BFF validates `state`, `nonce`, issuer, tenant policy and PKCE binding, redeems the code server-side, and maps the Entra subject to the Academy identity record.
11. The BFF creates a new target-property server session and returns a host-only `Secure`, `HttpOnly` session cookie.
12. The browser returns to a validated local `returnTo` path.
13. The shell re-queries `GET /session` and renders authenticated navigation from the returned minimal session view.

### Explicitly prohibited bootstrap mechanisms

- Reading the portal's MSAL cache from another origin.
- Copying a bearer token into a query string, URL fragment, `postMessage`, shared browser storage or navigation payload.
- Using a long-lived signed bootstrap token that can be replayed across properties.
- Setting a `.skunkworksacademy.com` authentication cookie merely to make cross-subdomain recognition convenient.
- Cross-origin `GET /session` calls that depend on third-party cookie behavior.

## 6. OIDC transaction contract

Each `/auth/login` request creates a short-lived server-side transaction containing at minimum:

- transaction identifier;
- expected application/origin;
- canonical local `returnTo` path;
- OIDC `state`;
- OIDC `nonce`;
- PKCE verifier;
- creation time and expiry;
- consumed/not-consumed state.

The browser receives only the values required by the OIDC protocol. Sensitive transaction material such as the PKCE verifier remains server-side.

### Replay protection

- Authorization codes are redeemed once only.
- OIDC transaction records are single-use and marked consumed before session issuance.
- Expired, duplicate, mismatched-origin, mismatched-state, mismatched-nonce or mismatched-PKCE callbacks fail closed.
- Callback processing must not accept a `returnTo` URL supplied by the IdP response unless it matches the server-side transaction.
- A successful login rotates the application session identifier.

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

The cookie value should be an opaque random session identifier. It must not contain an Entra access token, refresh token, user profile, role list or entitlement payload.

### Server session record

The corresponding server-side record should contain only what is required to operate the session, including:

- session ID hash or equivalent secure lookup key;
- canonical Academy subject ID;
- Entra tenant ID and object/subject identifier;
- application ID;
- issued-at, last-seen and expiry timestamps;
- authentication context needed for policy decisions;
- role/entitlement version or references rather than a permanently trusted client snapshot;
- revocation state;
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

The endpoint must not return Entra access tokens, refresh tokens, ID tokens, authorization codes, session-store keys, raw Graph claims, CSRF secrets or personally unnecessary profile data.

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

All state-changing BFF endpoints authenticated by cookies require CSRF protection. Acceptable controls include a synchronizer token or equivalent robust framework mechanism, combined with same-origin checks and `SameSite` cookie semantics.

CSRF tokens must not be used as authorization tokens and must not be stored in long-lived URLs.

## 11. Logout and revocation contract

### Local logout

`POST /auth/logout`:

1. requires CSRF protection;
2. revokes/deletes the local server session;
3. expires the host-only session cookie;
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

## 13. Course catalogue migration implication

`course-catalog` currently reads `skw_access_token` from browser storage and calls `https://portal.skunkworksacademy.com/api/course-access`.

That pattern must not be extended.

The catalogue should migrate to either:

1. a same-origin BFF route that performs server-side entitlement checks; or
2. a public catalogue plus authenticated launch/enrolment routes hosted behind a BFF-capable application boundary.

Static client-side gating is presentation logic only and must not be treated as protection for sensitive or licensed content.

## 14. Labs gateway exception boundary

Apache Guacamole's current documented Entra OIDC integration is a separate product-specific authentication boundary.

The documented Guacamole 1.6.0 implicit-flow requirement must not be copied into the Academy shell, portal, catalogue or future BFFs. The gateway should remain isolated and be modernized according to Guacamole-supported capabilities and Entra policy without weakening the platform-wide Authorization Code + PKCE standard.

## 15. Feature flags

Identity migration must be property-scoped. Minimum flag semantics:

- `identity_bff_enabled`: enables same-origin BFF/session routes for the property;
- `identity_shell_session_enabled`: allows the shell to call `GET /session`;
- `identity_auto_bootstrap_enabled`: permits automatic OIDC bootstrap when no local session exists;
- `identity_enforcement_enabled`: enables server-side protected-route/entitlement enforcement.

Flags must default off until staging validation passes. Enabling shell awareness must not imply that protected-route enforcement is complete.

## 16. Required telemetry

Each participating application should emit privacy-minimized events for:

- login initiated;
- login callback succeeded/failed;
- OIDC transaction rejected and reason class;
- session created/rotated/revoked/expired;
- `GET /session` authenticated/anonymous/error outcome;
- logout local/global initiated/completed;
- authorization denied by role or entitlement;
- CSRF validation failure;
- unexpected origin or redirect target rejection.

Do not log access tokens, refresh tokens, authorization codes, session cookie values or PKCE verifiers.

## 17. Implementation prerequisites

No BFF implementation PR should begin until all of the following are confirmed:

- authoritative owner of `api.skunkworksacademy.com`;
- target hosting/edge mechanism that supports same-origin BFF routing for static properties;
- approved Entra app-registration model: dedicated client per application or explicitly documented shared-client exceptions;
- canonical redirect URI inventory;
- session-store technology and production availability model;
- session idle/absolute lifetime policy;
- logout/revocation policy;
- CSRF mechanism;
- role and entitlement mapping owner;
- staging domain/redirect registrations;
- secrets ownership and GitHub/Azure environment boundaries.

## 18. Definition of done for the identity-contract phase

This phase is complete when:

- the Entra client inventory is reviewed and ownership assigned;
- the legacy tenant/client conflict is explicitly quarantined from new development;
- the per-property first-party session model is approved;
- the cross-property bootstrap flow is approved;
- static-host BFF prerequisites are assigned;
- `GET /session`, logout, CSRF, origin and replay rules are approved;
- redirect URI and feature-flag inventories are ready for implementation;
- no production authentication behavior has changed as part of this documentation-only phase.
