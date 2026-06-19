# Module 6 — Projects and Memory

**Estimated time:** 35 minutes  
**Course:** CLD-UF-101 — Claude User Fundamentals  
**Mode:** Online self-paced

---

## Module Purpose

By this point, you have used Claude for one-off tasks. This module focuses on repeated work: the reports, clients, programmes, projects, and workflows where you do not want to explain the same background every time.

Claude features such as Projects, custom instructions, styles, and Memory can help preserve context, but they must be used intentionally and in line with organizational policy.

---

## Learning Outcomes

By the end of this module, you will be able to:

1. Explain what Projects are useful for.
2. Describe how instructions and styles affect Claude’s responses.
3. Explain the purpose and caution around Memory.
4. Match recurring work tasks to the right context feature.
5. Plan a simple Project setup for a recurring task.

---

## 6.1 The Problem: Re-Explaining Context

One-off prompts are useful, but recurring work often needs context:

- Client background
- Preferred tone
- Product details
- Course requirements
- Project goals
- Internal terminology
- Standard templates
- Recurring report structure

Without saved or repeated context, you may find yourself typing the same background repeatedly.

The solution is to manage context deliberately.

---

## 6.2 Projects

A Project is a dedicated workspace for related work. In a Project, you can group conversations and, where supported, add reference files or project-specific instructions.

Good Project examples:

- A recurring client account
- A training programme
- A sales proposal workspace
- A weekly reporting workflow
- A policy review workspace
- A marketing campaign
- A product launch
- A research project

A Project is useful when you want Claude to operate with consistent background across multiple conversations.

### Example Project: Weekly Operations Report

Project purpose:

> Help prepare weekly operations reports for leadership.

Reference context might include:

- Report template
- Preferred tone
- Audience description
- Key metrics definitions
- Previous report examples
- Standard risk categories

Project instruction:

```text
When helping with weekly operations reports, write in a concise executive style. Focus on progress, blockers, risks, decisions needed, and next steps. Avoid hype. Ask for missing metrics before drafting final summaries.
```

---

## 6.3 Custom Instructions and Styles

Custom instructions and styles tell Claude how you prefer responses.

Examples:

- Keep answers concise and practical.
- Use bullet points first, then details.
- Write in plain English for non-technical business users.
- Use a formal executive tone.
- Always include assumptions and risks.
- Ask clarifying questions before drafting complex outputs.

Use instructions for repeated preferences. Do not overload them with too many rules. Keep them clear, stable, and relevant.

---

## 6.4 Memory

Memory can help Claude retain useful context across conversations, depending on your plan and configuration. Memory should be handled carefully because it may involve personal or organizational context.

Important principles:

- Memory should be optional and user-controlled where available.
- Do not store sensitive information unnecessarily.
- Review and manage remembered information where the interface allows.
- Keep personal, client, and confidential contexts separated where possible.
- Follow your organization’s AI and data policy.

Memory is useful for preferences, recurring work style, role context, and long-term projects. It is not a substitute for verification or policy compliance.

---

## 6.5 Choosing the Right Context Tool

| Need | Best option |
|---|---|
| Work on one task | Normal conversation |
| Refine the same output | Same conversation |
| Keep files and context for a recurring project | Project |
| Apply preferred tone or format repeatedly | Custom instructions or style |
| Retain general preferences across chats | Memory, where enabled and appropriate |
| Separate client or workstream contexts | Separate Projects |
| Avoid storing sensitive context | Do not use Memory; provide approved context only when needed |

---

## 6.6 What to Put in a Project

A useful Project should include only relevant context.

Possible Project contents:

- Purpose of the Project
- Audience or stakeholder description
- Standard deliverables
- Templates
- Brand or tone guidance
- Approved source documents
- Examples of good output
- Common constraints
- Review or verification rules

Avoid adding:

- Unnecessary personal information
- Passwords, secrets, or tokens
- Confidential customer data unless approved
- Outdated documents
- Contradictory instructions
- Too many irrelevant files

---

## 6.7 Project Setup Template

Use this template when planning a Project:

```text
Project name:

Purpose:

Audience or stakeholders:

Recurring tasks:

Reference files needed:

Preferred tone/style:

Output formats:

Verification requirements:

Data sensitivity notes:

Things Claude should ask before drafting:
```

Example:

```text
Project name: Monthly Training Operations Report
Purpose: Help summarize training delivery, attendance, learner feedback, risks, and next actions.
Audience: Training leadership and operations managers.
Recurring tasks: Summaries, action lists, issue analysis, executive updates.
Preferred style: Concise, factual, action-oriented.
Verification: Check dates, attendee numbers, revenue figures, client names, and commitments.
```

---

## 6.8 Worked Example — Recurring Proposal Support

Scenario: A sales team writes similar training proposals every month.

Without a Project:

- They repeatedly paste company background.
- They rewrite the same service descriptions.
- Proposal tone varies.
- Important assumptions are missed.

With a Project:

- Approved company positioning is available.
- Proposal structure is consistent.
- Claude can draft from a standard pattern.
- The team still verifies pricing, dates, legal terms, and scope.

Possible Project instruction:

```text
Support training proposal drafting. Use a professional, consultative tone. Structure proposals with client context, recommended solution, delivery approach, assumptions, exclusions, timeline, and next steps. Always flag pricing, dates, scope, legal terms, and customer claims for verification.
```

---

## Try It Yourself

Choose one recurring task from your work.

Complete this table:

| Question | Your answer |
|---|---|
| What recurring task do I repeat? | |
| What context do I repeat often? | |
| Would this be a Project, instruction, style, Memory item, or normal chat? | |
| What files or examples would help? | |
| What should not be stored? | |
| What must always be verified? | |

Then draft a Project instruction for that task.

---

## Reflection

1. Which part of your work would benefit most from saved context?
2. What is safe to include as context?
3. What should never be stored or uploaded?
4. How would you keep client or project contexts separate?
5. What instruction would make Claude more useful by default?

---

## Module 6 Self-Check

1. What is a Project useful for?
2. When would you use custom instructions or styles?
3. Why should Memory be handled carefully?
4. What should you avoid putting into a Project?
5. How do Projects differ from a normal conversation?

---

## Completion Checkpoint

You are ready to continue when you have mapped one recurring task to a context strategy and written a draft Project or instruction statement.
