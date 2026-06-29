# SKW-OWASP10-2025 — OWASP Top 10:2025 Web Application Security

Canonical course page:

`https://skunkworksacademy.com/self-paced/security/skw-owasp-top10-2025/`

This folder contains a fully interactive Skunkworks Academy self-paced HTML course for OWASP Top 10:2025 web application security training.

## Included

- `index.html` — complete interactive web course.
- `vulnerable-app/` — local training lab server for the practical exercises.
- Browser-based progress tracking using `localStorage`.
- Clickable modules, lab cards, lab route launchers, command copy buttons, evidence notes, final assessment and downloadable completion record.

## Course structure

1. Orientation: ethics, scope and lab operations.
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

This requires the Skunkworks Academy hosting layer to serve this repository path at the domain root.

## Originality and attribution

The course text, lab structure and assessment content are original Skunkworks Academy material. OWASP names and public references are used for taxonomy alignment and attribution. This course is not endorsed by OWASP.

Primary references:

- OWASP Top 10:2025
- OWASP Top Ten Project
- OWASP ASVS
- OWASP WSTG
- OWASP Cheat Sheet Series
- NIST SSDF SP 800-218
