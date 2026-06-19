# CLD-UF-101 Verification Checklist

Use this checklist before applying Claude output in real work.

---

## Fast Rule

> The higher the stakes, the more you verify.

Claude can help draft, summarize, structure, and reason. You remain responsible for checking and final use.

---

## Always Verify

| Category | Check |
|---|---|
| Names | Correct spelling, roles, titles, organizations, departments |
| Dates | Deadlines, meeting dates, contract dates, start dates, version dates |
| Numbers | Calculations, totals, percentages, prices, budgets, learner counts |
| Currency | Currency symbol, tax/VAT, exchange rate assumptions, billing terms |
| Quotes | Exact wording, speaker attribution, source |
| Citations | Source exists, supports the claim, is current and authoritative |
| Legal wording | Approved terms, jurisdiction, obligations, exclusions |
| Compliance | Policy alignment, regulatory obligations, retention, consent |
| Technical details | Commands, configuration values, product versions, system names |
| Security | Credentials, secrets, vulnerabilities, access controls, incident details |
| Customer-facing claims | Accuracy, scope, promise, evidence, brand alignment |
| Sensitive data | Personal, customer, employee, financial, confidential, regulated data |

---

## Risk-Based Review

### Low Risk

Examples:

- Brainstorming names
- Rewriting internal notes
- Drafting a rough outline
- Creating practice examples

Review level:

- Light human review
- Check tone and usefulness

### Medium Risk

Examples:

- Internal team update
- Process checklist
- Training notes
- Meeting summary

Review level:

- Check facts, actions, owners, dates, and assumptions
- Compare against source material

### High Risk

Examples:

- Client proposal
- Board presentation
- Policy summary
- Financial analysis
- Customer communication

Review level:

- Verify against authoritative sources
- Use required internal approval process
- Check all commitments and figures

### Critical Risk

Examples:

- Legal interpretation
- Medical or safety advice
- Regulated compliance decision
- Security incident response
- Contractual commitment

Review level:

- Use qualified experts
- Follow formal processes
- Treat Claude as drafting support only

---

## Data Sensitivity Questions

Before entering or uploading information, ask:

1. Is this information public?
2. Is this internal but non-sensitive?
3. Does it include personal, customer, employee, financial, legal, or regulated data?
4. Does it include credentials, secrets, tokens, passwords, or internal security details?
5. Has my organization approved this use case?
6. Can I anonymize or reduce the information?
7. Do I need permission from a policy owner?

If unsure, do not enter the data.

---

## Verification Prompt

Use this prompt before applying important output:

```text
Review this output and identify every claim, number, date, name, quote, citation, recommendation, assumption, and sensitive-data item that should be verified before use. Group the list by risk level and suggest how each item should be checked.
```

---

## Personal Verify List

Complete this for your role:

| I will always check | My example |
|---|---|
| Names and titles | |
| Dates and deadlines | |
| Numbers and calculations | |
| Client or customer claims | |
| Compliance or policy language | |
| Pricing or commercial terms | |
| Sensitive information | |
| Technical instructions | |
| Other | |
