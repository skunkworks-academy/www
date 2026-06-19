# CLD-UF-101 Prompt Library

Use these prompts during and after the course. Replace bracketed text with your own context.

---

## 1. Universal Prompt Template

```text
I need help with [task].
Context: [background Claude needs].
Audience: [who this is for].
Goal: [what the output should achieve].
Format: [email/table/checklist/summary/report/etc.].
Tone: [professional/friendly/executive/plain English/etc.].
Constraints: [length, must-include points, exclusions, deadlines].
Before answering, ask me any critical questions if something is unclear.
```

---

## 2. Writing and Editing Prompts

### Draft an Email

```text
Draft a [tone] email to [audience] about [topic]. Include [required points]. Keep it under [word count] words and include a subject line.
```

### Improve an Existing Message

```text
Improve this message for clarity, tone, and structure. Keep the meaning the same. Make it suitable for [audience].

Text:
[paste text]
```

### Shorten Text

```text
Shorten this to [length] while keeping the key message, next step, and professional tone.
```

### Change Tone

```text
Rewrite this in a [warmer/more formal/more executive/more direct] tone. Do not add unsupported claims.
```

---

## 3. Summarization Prompts

### Meeting Notes Summary

```text
Summarize these meeting notes into decisions, action items, risks, and open questions. Use a table for action items with owner and due date where available.
```

### Executive Summary

```text
Summarize this document for senior leadership. Focus on business impact, risks, decisions needed, and next steps. Keep it under [word count] words.
```

### Email Thread Summary

```text
Summarize this email thread. Identify what was decided, what is still unresolved, and what I need to do next.
```

### Plain-English Summary

```text
Explain this content in plain English for a non-technical audience. Avoid jargon and include a simple example.
```

---

## 4. Brainstorming Prompts

### Generate Ideas

```text
Generate [number] ideas for [problem/opportunity]. Group them by low, medium, and high effort. Include one benefit and one risk for each.
```

### Pressure-Test a Plan

```text
Review this plan and identify weak points, missing assumptions, risks, and questions I should answer before proceeding.
```

### Alternatives

```text
Give me five alternative approaches to [task]. Compare them by cost, effort, time, risk, and likely impact.
```

---

## 5. Analysis Prompts

### Compare Options

```text
Compare these options using the following criteria: [criteria]. Present the comparison in a table and recommend the strongest option with assumptions and risks.
```

### Risk Analysis

```text
Analyze this plan for operational, financial, customer, compliance, and timeline risks. Rate each risk as low, medium, or high and suggest mitigations.
```

### Decision Matrix

```text
Create a decision matrix for these options. Use weighted criteria: [criteria and weights]. Explain the scoring and recommend a next step.
```

---

## 6. Ask and Explain Prompts

### Plain-English Explanation

```text
Explain [concept] in plain English for [audience]. Include one analogy and one workplace example.
```

### Meeting Preparation

```text
I have a meeting about [topic]. Give me a short briefing: what it means, why it matters, key terms, risks, and five questions I should ask.
```

### Role-Based Explanation

```text
Explain [topic] from the perspective of a [role]. Focus on what that person needs to know to make better decisions.
```

---

## 7. Document and File Prompts

### Document Summary

```text
Summarize this document in five bullets, then list actions, risks, and questions that need clarification.
```

### Extract Requirements

```text
Extract all requirements from this document. Put them in a table with requirement, owner, deadline, evidence needed, and source section.
```

### Find Gaps

```text
Review this document for unclear wording, contradictions, missing information, duplicated points, and assumptions. Group findings by severity.
```

### Convert to Checklist

```text
Turn this document into a practical checklist for [audience]. Include sections, checkboxes, and short guidance notes.
```

---

## 8. Projects and Memory Prompts

### Project Instruction Draft

```text
Help me write Project instructions for a Claude workspace used for [recurring task]. The Project should help with [outputs]. It should use a [tone] tone, follow [rules], and always flag [verification items]. Ask me questions before finalizing.
```

### Context Cleanup

```text
Review this Project instruction and make it shorter, clearer, and less repetitive. Keep only instructions that will be useful across many conversations.
```

---

## 9. Verification Prompts

### Verify List

```text
Review this output and identify every claim, number, date, name, quote, citation, recommendation, or assumption that should be verified before use.
```

### Risk Categorization

```text
Classify this output into three categories: safe to use after light review, needs fact-checking, and requires expert or formal review.
```

### Assumptions

```text
What assumptions are you making in this answer? Which assumptions could materially change the recommendation?
```

---

## 10. Capstone Prompt Builder

Use this at the end of the course:

```text
I am completing a Claude fundamentals capstone.
Task: [describe task].
Use case: [writing/summarization/brainstorming/analysis/Q&A/document workflow].
Audience: [audience].
Context: [background].
Desired output: [format].
Tone: [tone].
Constraints: [length, must include, must avoid].
Verification: After drafting, list what I must verify before using the output.
```
