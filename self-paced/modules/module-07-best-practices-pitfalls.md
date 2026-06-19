# Module 7 — Best Practices and Pitfalls

**Estimated time:** 40 minutes  
**Course:** CLD-UF-101 — Claude User Fundamentals  
**Mode:** Online self-paced

---

## Module Purpose

This module is about using Claude responsibly. Responsible use is not about being afraid of AI. It is about knowing where the risks are so you can use the tool with confidence.

The strongest Claude users are not the ones who accept every answer. They are the ones who know when to trust, when to improve, and when to verify.

---

## Learning Outcomes

By the end of this module, you will be able to:

1. Explain what “confidently wrong” means.
2. Identify high-stakes outputs that require verification.
3. Apply a simple risk-based checking model.
4. Recognize sensitive data situations.
5. Build a personal verification list for your role.

---

## 7.1 Pitfall 1 — Confidently Wrong Output

Claude can produce an answer that sounds polished, clear, and confident while still being wrong.

This can happen with:

- Incorrect facts
- Invented or inaccurate citations
- Wrong dates
- Misstated names
- Incorrect calculations
- Unsupported claims
- Overconfident recommendations
- Misread document details

The danger is not only that the answer is wrong. The danger is that it may sound right.

Practical rule:

> Confidence is not accuracy.

---

## 7.2 Pitfall 2 — Treating Drafts as Sign-Off

Claude is excellent for first drafts, structured thinking, and revision. It is not the final authority for important decisions.

Use Claude for:

- Getting started
- Improving wording
- Structuring information
- Generating options
- Identifying risks
- Creating checklists
- Drafting summaries

Do not use Claude as the sole authority for:

- Legal decisions
- Medical decisions
- Safety decisions
- Compliance sign-off
- Financial commitments
- Customer-facing claims
- Employment decisions
- Contract interpretation
- Security incident response decisions

Claude can assist, but humans and approved processes remain responsible.

---

## 7.3 Pitfall 3 — Data Sensitivity

Do not enter sensitive information unless your organization has approved the use case and the platform.

Sensitive information may include:

- Personal information
- Customer data
- Employee records
- Financial information
- Contracts
- Credentials
- API keys
- Internal system details
- Confidential strategy
- Legal documents
- Unreleased product information
- Security vulnerabilities or incident details

When unsure, pause and ask your organization’s policy owner, security team, data protection officer, legal team, or manager.

---

## 7.4 The Stakes-Based Verification Model

Use this model to decide how much checking is needed.

| Risk level | Example tasks | Verification required |
|---|---|---|
| Low | Brainstorming names, rewriting an internal note, drafting a rough outline | Light review |
| Medium | Internal team update, process checklist, meeting summary, training material | Check facts, names, dates, actions, and assumptions |
| High | Client proposal, board deck, policy summary, compliance-related wording, financial analysis | Verify against source documents and obtain required review |
| Critical | Legal, medical, safety, regulated, security, or contractual decisions | Use qualified experts and approved processes; Claude may support drafting only |

The higher the stakes, the more verification is required.

---

## 7.5 What to Always Verify

Build the habit of checking these items:

- Names and titles
- Company names
- Dates and deadlines
- Numbers and calculations
- Currency amounts
- Quotes
- Citations and references
- Product features
- Legal or compliance claims
- Policy requirements
- Technical configuration steps
- Security recommendations
- Customer commitments
- Medical, financial, or safety guidance

If the output will influence a real decision, verify it.

---

## 7.6 Verification Prompts

Claude can help you identify what needs checking.

Use prompts like:

```text
Review this draft and identify every statement that should be verified before I send it to a customer.
```

```text
List all names, dates, numbers, commitments, and claims in this output that require source confirmation.
```

```text
Separate this response into three categories: safe to use as general wording, needs fact-checking, and requires expert review.
```

```text
What assumptions are you making in this answer?
```

These prompts do not replace verification, but they help you spot verification points.

---

## 7.7 Data Sensitivity Decision Tree

Before entering information into Claude, ask:

1. Is this public information?  
   - If yes, it may be safe to use.
   - If no, continue.

2. Is it internal but non-sensitive?  
   - If yes, check organizational rules.
   - If no, continue.

3. Does it include personal, customer, financial, legal, confidential, or regulated data?  
   - If yes, do not use it unless explicitly approved.

4. Does it include credentials, secrets, tokens, passwords, or security-sensitive details?  
   - If yes, do not enter it.

5. Can the data be anonymized, summarized, or reduced?  
   - If yes, use the minimum necessary information.

Minimum necessary context is a strong practice. Give Claude what it needs, not everything you have.

---

## 7.8 Practical Safer Use Patterns

### Redaction

Remove sensitive details before sharing.

Instead of:

```text
Customer John Smith, ID number 123..., owes R45,000 and lives at...
```

Use:

```text
Customer A has an overdue balance. Help draft a neutral follow-up message.
```

### Generalization

Use representative details rather than real records.

```text
Use a hypothetical client in the manufacturing sector with 250 employees.
```

### Source Attachment with Policy Approval

If your organization allows document upload, use approved documents and confirm whether they may be shared in the platform.

### Verification Notes

Ask Claude to mark claims that need source confirmation.

---

## 7.9 Worked Example — Client-Facing Draft

Task: Draft a client proposal email.

Safe workflow:

1. Provide non-sensitive context.
2. Ask Claude for a draft.
3. Ask Claude to list all claims and commitments.
4. Verify pricing, dates, scope, and legal language.
5. Send through the normal approval process.

Prompt:

```text
Draft a professional client follow-up email after a training discovery call. Do not include pricing or contractual commitments. Ask the client to confirm learner numbers, preferred dates, delivery mode, and success criteria.
```

Follow-up:

```text
Identify any part of this draft that should be checked before sending.
```

---

## Try It Yourself

Take one output from a previous module.

Ask Claude:

```text
Review this output and list what I must verify before using it. Focus on names, dates, numbers, assumptions, claims, policy-sensitive content, and customer-facing statements.
```

Then create your personal verification list.

Use this structure:

| I will always verify... | Example from my work |
|---|---|
| Names and titles | |
| Dates and deadlines | |
| Numbers and calculations | |
| Customer-facing claims | |
| Legal/compliance wording | |
| Sensitive data | |
| Other | |

---

## Reflection

1. Where in your work would a wrong AI answer cause real damage?
2. Which outputs can you use quickly after light review?
3. Which outputs require formal approval?
4. What data should you avoid entering into Claude?
5. What verification habit will you adopt immediately?

---

## Module 7 Self-Check

1. What does confidently wrong mean?
2. Why should high-stakes outputs be verified?
3. Name five items that should always be checked.
4. What should you do before entering sensitive information?
5. How can Claude help you identify verification points?

---

## Completion Checkpoint

You are ready to continue when you have created a personal verification list and can explain how you will handle sensitive information in your role.
