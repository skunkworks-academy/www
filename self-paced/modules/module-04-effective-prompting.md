# Module 4 — Effective Prompting

**Estimated time:** 45 minutes  
**Course:** CLD-UF-101 — Claude User Fundamentals  
**Mode:** Online self-paced

---

## Module Purpose

Prompting is the highest-leverage skill in this course. The difference between a weak Claude response and a useful Claude response is often not the tool. It is the quality of the instruction.

A good prompt is simply a good brief. You tell Claude what you need, why you need it, who it is for, what constraints matter, and what format the answer should take.

---

## Learning Outcomes

By the end of this module, you will be able to:

1. Diagnose why a prompt produced a weak answer.
2. Improve prompts using specificity and context.
3. Add audience, tone, length, constraints, and examples.
4. Use follow-up prompts to refine output.
5. Ask Claude to ask clarifying questions when a task is ambiguous.

---

## 4.1 The Prompting Mindset

A vague prompt usually creates a vague answer.

Weak prompt:

```text
Write an update.
```

Claude has to guess:

- Update for whom?
- About what?
- How long?
- What tone?
- What format?
- What facts must be included?
- What should the reader do next?

A stronger prompt removes guessing.

Strong prompt:

```text
Write a 150-word project update for senior leadership. Tone: confident but realistic. Include current progress, one risk, one blocker, and the next milestone. Format it as concise bullet points.
```

The better prompt gives Claude a clear target.

---

## 4.2 The Six-Part Prompt Framework

Use this framework for most workplace prompts.

| Prompt Element | Question it answers | Example |
|---|---|---|
| Role/context | What situation are we in? | I coordinate monthly customer training sessions. |
| Task | What should Claude do? | Draft a reminder email. |
| Audience | Who is this for? | Learners attending tomorrow’s session. |
| Output format | What should the answer look like? | Email with subject line and body. |
| Constraints | What rules matter? | Under 150 words; include laptop reminder. |
| Tone | How should it sound? | Friendly, clear, and professional. |

You do not need every element every time, but the more important the task, the more useful this structure becomes.

---

## 4.3 Context Is the Biggest Lever

Claude cannot see your organization, project history, audience, internal politics, customer expectations, or previous decisions unless you provide that context.

Generic prompt:

```text
Write a training announcement.
```

Context-rich prompt:

```text
We are launching a half-day Claude fundamentals course for non-technical staff in a financial services company. The learners are busy managers and coordinators who may be nervous about AI. Write a training announcement that is reassuring, practical, and focused on productivity. Include what they will learn, what they need to bring, and why the course matters.
```

The second prompt produces a much more relevant answer because it gives Claude the hidden background.

---

## 4.4 Give Examples

Examples are powerful because they show Claude what good looks like.

Use examples when:

- You want a specific writing style.
- You want a specific structure.
- You need output to match an existing template.
- You want a consistent tone across multiple items.

Example prompt:

```text
Rewrite the following paragraph in the same style as this example.

Style example: Clear, practical, direct, and friendly. Short sentences. No hype.

Paragraph to rewrite: [paste text]
```

You can also provide examples of what to avoid:

```text
Avoid salesy language, buzzwords, and exaggerated claims. Keep it factual and useful.
```

---

## 4.5 Specify the Format

Claude can produce many formats. Tell it what you need.

Useful output formats:

- Bullet list
- Table
- Checklist
- Email
- Executive summary
- Step-by-step guide
- Decision matrix
- FAQ
- Training activity
- Agenda
- Policy summary
- Risk register

Example:

```text
Turn this information into a table with columns for task, owner, due date, risk, and next action.
```

Format instructions make the answer easier to use.

---

## 4.6 Iterate Instead of Starting Over

You do not need the perfect prompt on the first attempt. Prompting is a conversation.

Useful follow-ups:

```text
Make it shorter.
```

```text
Make the tone more formal.
```

```text
Add a clear call to action.
```

```text
Explain the reasoning behind your recommendation.
```

```text
Turn this into a table.
```

```text
Give me three alternative versions.
```

```text
Now write it for a non-technical audience.
```

The follow-up works because Claude has the current conversation context.

---

## 4.7 Ask Claude to Ask You Questions

When a task is complex or ambiguous, ask Claude to gather requirements before answering.

Example:

```text
I need help drafting a client proposal, but I am not sure what details you need. Ask me up to 10 clarifying questions before you draft anything.
```

This is useful for:

- Proposals
- Policies
- Project plans
- Job descriptions
- Training outlines
- Business cases
- Customer communications
- Complex analysis

It reduces the risk of Claude guessing.

---

## 4.8 Prompt Patterns You Can Reuse

### Drafting Pattern

```text
Draft [type of content] for [audience]. The purpose is [purpose]. Include [required points]. Use a [tone] tone. Keep it to [length]. Format as [format].
```

### Summarization Pattern

```text
Summarize the following content for [audience]. Focus on [focus areas]. Format the output as [format]. Highlight any risks, actions, or open questions.
```

### Analysis Pattern

```text
Analyze [input] using these criteria: [criteria]. Present the result in a table, then provide a recommendation with assumptions and risks.
```

### Clarification Pattern

```text
Before answering, ask me the questions you need to produce a useful result. Do not draft the final answer until I respond.
```

### Verification Pattern

```text
Review this output and identify which claims, numbers, dates, names, or recommendations require verification before I use it.
```

---

## 4.9 Worked Example — Weak to Strong

Weak prompt:

```text
Write a project update.
```

Improved prompt:

```text
Write a 150-word project update for senior leadership about the rollout of our internal AI training programme. Tone: confident but realistic. Include progress completed, one key risk, one blocker, and the next milestone. Format as five bullet points and end with one decision needed from leadership.
```

Follow-up:

```text
Make it more concise and remove any vague wording. Keep only statements that sound measurable or actionable.
```

This sequence demonstrates three important skills: specificity, structure, and iteration.

---

## Try It Yourself

Use the prompt or output you created in Module 3.

1. Copy your original prompt into your workbook.
2. Rewrite it using the six-part framework.
3. Run the old prompt and the improved prompt.
4. Compare the outputs.
5. Add one follow-up prompt to refine the improved answer.

Use this checklist:

| Prompt quality item | Included? |
|---|---|
| Clear task | |
| Audience | |
| Context | |
| Required points | |
| Output format | |
| Tone | |
| Length or scope | |
| Constraints | |
| Verification needs | |

---

## Reflection

1. What was missing from your original prompt?
2. Which added detail improved the answer most?
3. Did Claude still make assumptions? What were they?
4. What follow-up prompt gave you the biggest improvement?

---

## Module 4 Self-Check

1. What is the difference between a vague prompt and a specific prompt?
2. Why is context important?
3. When should you give examples?
4. What should you do if you are not sure what details Claude needs?
5. Why is iteration better than trying to write a perfect first prompt?

---

## Completion Checkpoint

You are ready to continue when you have rewritten one weak prompt into a stronger prompt and used at least one follow-up instruction to improve Claude’s answer.
