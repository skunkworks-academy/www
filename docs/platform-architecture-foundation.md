# Skunkworks Academy Platform Architecture Foundation

Status: Architecture baseline / documentation only  
Date: 2026-08-23  
Scope: No production authentication, routing, API, or deployment behavior changes

## 1. Purpose

This document establishes the current-state platform baseline and the migration guardrails for consolidating Skunkworks Academy into a coherent learning platform with secure cross-property identity, clear runtime ownership, and controlled deployment boundaries.

No authentication implementation should precede this architecture/ownership foundation.

## 2. Current-state architecture

| Property / layer | Repository | Runtime / hosting | Current identity / shell status |
| --- | --- | --- | --- |
| Main Academy site | `www` | Static GitHub Pages | Source of global asset loader and design CSS; no secure cross-site session lookup |
| Learner portal | `portal` | Vite/React on GitHub Pages + Azure Functions | Microsoft Entra MSAL SPA authentication; browser token cache in `localStorage` |
| Live API | `portal/api` | Azure Functions at `api.skunkworksacademy.com` | Validates Entra bearer JWTs with `jose`; current production API contract |
| Legacy/shadow API | `api` | Express + Vercel/Docker configuration | Different Entra tenant/client and route contract; conflicting API ownership |
| Course catalogue | `course-catalog` | Docusaurus/GitHub Pages | Client-side access gate reads browser-stored token; invalid portal-hosted API path |
| Labs catalogue | `labs` | Docusaurus/GitHub Pages | Static; no platform identity integration |
| Lab access | `labs-access-gateway` | Private Docker/Guacamole design | Separate Entra OIDC model documented; implicit-flow guidance must be modernized |
| Vendor sites | `microsoft`, `security`, `ibm`, `cisco`, `comptia` | Primarily static/GitHub Pages | Multiple shell variants; no validated Academy session state |
| Badges / jobs | `badging`, `jobs` and related properties | Static/application mix | No evidence of shared Academy SSO; final runtime ownership to be confirmed |
| Shared validation | `academy-validation` | GitHub Actions / checks | Foundation for shell, accessibility and brand conformance |
| Identity-named repos | `login`, `sso` | Minimal / placeholder | Not active central identity services |
| Search | `search-index` | Private | Ownership, authorization filtering and privacy model require separate inspection |

Observed production domains include the Academy apex site, portal, API, labs, Microsoft, security, IBM, CompTIA, badging and jobs properties. The canonical `www` versus apex redirect policy requires an explicit DNS/routing decision.

## 3. Authentication baseline

- Identity provider: Microsoft Entra ID.
- Canonical login today: `portal.skunkworksacademy.com` via MSAL redirect login.
- Canonical Academy server session: none.
- Current auth owner: `portal`.
- Cross-subdomain recognition: not implemented.
- Portal token cache: browser `localStorage`.
- Course catalogue token handling: browser-stored `skw_access_token` from local/session storage.
- Academy session cookie: not implemented.
- Current API authorization: Azure Functions validate Entra bearer JWTs.
- Legacy API authorization: separate legacy Entra configuration and route contract.
- Logout: portal-local / IdP redirect only; not coordinated product-wide.
- Roles: backend Entra role enforcement exists, but there is no central learner profile / entitlement service.

### Root cause of cross-property login failure

The portal's identity state is confined to that origin's MSAL browser cache. Other Academy subdomains load separate documents and do not have a trusted Academy session endpoint, their own standards-compliant OIDC flow, or a server-issued session cookie. The shared navigation runtime therefore cannot validate login state across properties.

## 4. Security and migration risks

| Severity | Finding |
| --- | --- |
| Critical | Two repositories claim `api.skunkworksacademy.com` with incompatible Entra tenants, route contracts and deployment models. Deployment authority must be resolved before API/auth migration. |
| Critical | Secure cross-property SSO does not exist. Static applications cannot safely consume portal identity state. |
| High | Portal stores MSAL authentication material in `localStorage`; the course catalogue reads a browser-stored bearer token, increasing XSS token-exfiltration exposure. |
| High | `course-catalog` points to `https://portal.skunkworksacademy.com/api/course-access` while the live API baseline is `https://api.skunkworksacademy.com/api`. |
| High | Client-side gating cannot protect publicly deployed static course material. |
| High | Legacy Express API scope enforcement and in-memory state require remediation before any supported reuse. |
| High | Lab gateway implicit-flow guidance must not become the Academy-wide identity pattern. |
| Medium | No global logout, central revocation, back-channel logout or consistent session-expiry/multi-tab behavior. |
| Medium | CORS and API contracts differ between current and legacy API implementations. |
| Medium | CSP, HSTS and clickjacking protection must be validated at the actual serving edge before enforcement changes. |
| Medium | Multiple navigation loader versions and DOM-removal behavior increase accessibility and regression risk. |
| Low | UI-only portal role override is local state and must never imply server-side entitlement. |
| Low | Legacy CI/runtime practices and deployment ownership are ambiguous. |

## 5. Target architecture decision

Adopt a hybrid central IdP + per-application BFF/session-gateway architecture.

### Identity and session rules

1. Keep Microsoft Entra ID as the central OpenID Connect provider.
2. Use Authorization Code Flow with PKCE for interactive login initiation.
3. Move token exchange and refresh-token handling to an Academy BFF/session service.
4. Use host-only, `Secure`, `HttpOnly`, `SameSite` session cookies for participating applications. Prefer `__Host-` cookie names where deployment constraints permit.
5. Do not default to a broad `.skunkworksacademy.com` session cookie; that unnecessarily enlarges the subdomain blast radius.
6. Expose a minimal authenticated `GET /session` contract with `Cache-Control: no-store` for shell/session awareness.
7. Never expose raw Entra access or refresh tokens to the shared shell.
8. Centralize subject mapping, learner profile, roles and entitlements behind APIs.
9. Enforce authorization server-side/API-side. UI state reflects authorization but does not define it.
10. Implement coordinated logout/revocation and use front-channel/back-channel logout where supported.

### Minimum authorization vocabulary

- anonymous
- learner
- instructor
- staff
- administrator

Future entitlements should be data-driven and independently auditable rather than hard-coded into client components.

## 6. Repository ownership and required work

| Repository / group | Required work |
| --- | --- |
| `www` | Become a versioned consumer of a secure session contract; retain a compatibility loader during migration. |
| `portal` | Migrate from browser-persistent token storage toward BFF/server-session architecture while preserving current Entra login during staged rollout. |
| `portal/api` | Treat as the current API baseline; document and then separate identity/session concerns behind a service boundary. |
| `api` | Freeze deployment authority; fix authorization defects; retire, quarantine or explicitly convert to a supported service after compatibility analysis. |
| `course-catalog` | Remove browser token reads; correct API ownership; enforce entitlements server-side for protected functionality. |
| `labs`, vendor sites, badging, jobs | Adopt the session-aware shell and protected-route strategy where required. |
| `labs-access-gateway` | Modernize OIDC separately and validate Guacamole constraints without making it the platform-wide auth template. |
| `academy-validation` | Add shell, accessibility, responsive, metadata and authenticated-state conformance checks. |
| Shared CDN/design assets | Establish versioned distribution and immutable-release rules; avoid mutable remote runtime behavior. |
| `search-index` | Define data ownership, privacy, authorization filtering and indexing boundaries after separate inspection. |
| GitHub org settings | Require CI, review, CodeRabbit/security review, least-privilege workflows and protected production branches. |

## 7. Migration sequence

1. Foundation documentation and ownership PR.
2. Identity contract PR: session/API contracts, Entra client inventory, feature flags; no behavior cutover.
3. Identity BFF PR: server-side code exchange, session store, CSRF, logout and revocation.
4. Portal migration PR: adopt BFF and remove persistent browser token storage.
5. Shared shell PR: expose a secure `SkunkworksIdentity` facade backed by `GET /session`, retaining compatibility during rollout.
6. Main-site and vendor-site rollout PRs, one property at a time.
7. Course/catalogue entitlement PR: eliminate `skw_access_token`, correct API ownership and protect sensitive functionality server-side.
8. Labs and gateway PRs: modernize lab authentication independently from the public catalogue.
9. Profile/course/search API PRs: define canonical schemas and ownership.
10. Security, observability, conformance and legacy cleanup PRs after behavior stabilizes.

## 8. Deployment and verification strategy

Development -> preview/staging -> automated integration checks -> CodeRabbit -> manual SSO verification -> production canary -> post-deploy smoke tests.

Required telemetry should include login initiation, callback failure, token/session refresh failure, logout, API authorization failure and shared-shell session-state failure.

Feature-flag BFF sessions per property. Do not delete legacy shell assets or API paths until live consumers are inventoried and migrated.

## 9. Rollback guardrails

- Documentation PR: revert only the documentation PR.
- Identity BFF: disable the per-property feature flag and retain current portal login during diagnosis.
- Shell rollout: pin the previous loader version and remove the new session endpoint integration.
- Per-site adoption: revert only the affected property's integration.
- API contract changes: preserve versioned routes and compatibility adapters until traffic demonstrates migration completion.
- Never roll back by exposing browser-stored tokens or weakening cookie flags.

## 10. Code review policy

CodeRabbit review is mandatory for implementation PRs that touch:

- `portal/src/authConfig.ts`, `main.tsx`, `api.ts` and Azure Function auth middleware
- BFF session, cookie, CSRF, logout, Entra/OIDC and identity-mapping code
- `www/assets/academy-navigation*.js`, shared shell runtime and design-token loaders
- course catalogue access gating and protected-content routing
- legacy/current API authorization middleware and deployment configuration
- `.github/workflows/**`, infrastructure code and secret references

All Blocker/Critical and High issues must be resolved before merge. Security-relevant Medium issues require resolution or a documented and approved deferral.

## 11. Existing PR risk register

- `www#56`: large theme/conformance change; previously reported as non-mergeable with contrast, print-style, workflow-audit and external-script-integrity concerns.
- `security#8`: previously reported navigation-version CI mismatch and brand-token issues.
- `labs#21`: previously reported mutable Docker base-image risk.
- `lms#4`: previously reported stale/non-mergeable dependency PR.
- `portal#92`: merged; improves workflow hygiene but does not provide cross-property identity.

These PR risks must be revalidated against current GitHub state before any merge action.

## 12. Brand and shell conformance

The Academy Brand Kit is the source of truth for production UI treatment. Canonical palette:

- Ink Navy `#03033A`
- Skunk Blue `#1E6BD0`
- Signal Orange `#F24208`
- White `#FFFFFF`
- Off White `#F7F9FC`
- Graphite `#15171A`
- Steel Gray `#D8DEE8`
- Slate Text `#5A6472`

Public digital UI should use the approved horizontal logo in navigation, blue primary actions/active states, restrained orange accents, visible focus states and a consistent typography hierarchy. Shared shell work must not recreate the official wordmark as live text where an approved logo asset is required.

## 13. Definition of done for the foundation phase

This foundation phase is complete when:

- architecture and runtime ownership are documented;
- API ownership conflict is explicitly recorded as a migration blocker;
- the target BFF/session architecture and security guardrails are approved;
- the migration/rollback sequence is reviewed;
- implementation work remains feature-flagged and isolated from production until subsequent PRs;
- no authentication behavior has changed as part of this documentation-only change.
