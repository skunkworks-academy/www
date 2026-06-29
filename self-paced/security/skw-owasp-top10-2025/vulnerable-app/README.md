# Skunkworks OWASP Top 10:2025 Local Lab Server

This local lab server supports the interactive self-paced course at:

`https://skunkworksacademy.com/self-paced/security/skw-owasp-top10-2025/`

It uses only built-in Node.js modules, so there are no third-party package dependencies to install.

## Safety boundary

Use this lab only on your own local machine or inside an approved Skunkworks Academy lab environment. Do not expose the server to the public internet.

## Requirements

- Node.js 18 or later
- A browser
- Terminal access

## Start the lab

```bash
cd self-paced/security/skw-owasp-top10-2025/vulnerable-app
npm start
```

The server starts at:

```text
http://localhost:3025
```

Health check:

```text
http://localhost:3025/api/health
```

## Lab routes

| Lab | Route | Purpose |
|---|---|---|
| L01 | `/api/profile/1?viewer=alice` | Access-control review |
| L02 | `/api/debug` | Misconfiguration review |
| L04 | `/api/token-demo?user=alice` | Predictable token review |
| L05 | `/api/orders?customer=alice` | Query/data separation review |
| L06 | `/api/transfer` | Business-rule review using POST |
| L07 | `/api/session-demo` | Session-claim integrity review |
| L08 | `/api/import-profile` | Allow-list profile import review using POST |
| L09 | `/api/log?event=login_failed` | Structured logging review |
| L10 | `/api/calculate?items=abc` | Safe error handling review |

## POST examples

Transfer scenario:

```bash
curl -X POST http://localhost:3025/api/transfer \
  -H "Content-Type: application/json" \
  -d '{"from":"alice","to":"bob","amount":100}'
```

Profile import scenario:

```bash
curl -X POST http://localhost:3025/api/import-profile \
  -H "Content-Type: application/json" \
  -d '{"displayName":"Alice Updated","role":"admin","preferredLanguage":"en-ZA"}'
```

## Completion evidence

For each lab, record:

1. Lab ID and route.
2. What you observed.
3. Why it matters.
4. The required secure control.
5. How you would verify the fix.

Do not capture secrets, tokens, personal data or private customer information in your evidence.
