# Module 5 — Working with Documents and Files

**Estimated time:** 40 minutes  
**Course:** CLD-UF-101 — Claude User Fundamentals  
**Mode:** Online self-paced

---

## Module Purpose

This module shows you how to move from general questions to working with your own material. Claude becomes much more useful when you can provide a document, spreadsheet, image, slide deck, or text extract and ask questions about that specific content.

The key workflow is simple:

> Upload or provide the material, then point a use case at it.

---

## Learning Outcomes

By the end of this module, you will be able to:

1. Identify common file-based Claude workflows.
2. Upload appropriate files safely.
3. Ask targeted questions about a document or file.
4. Convert file content into summaries, tables, checklists, or drafts.
5. Identify data sensitivity risks before uploading material.

---

## 5.1 What Can You Work With?

Depending on your Claude plan and workspace configuration, Claude may be able to work with common file types such as:

- PDF reports
- Word documents
- Text and Markdown files
- Spreadsheets and CSV files
- Slide decks
- Images and screenshots
- Charts and diagrams

Always confirm what is supported in your environment. If a file does not upload or cannot be read, you may need to paste a small extract or use another approved method.

---

## 5.2 Before You Upload Anything

Before uploading a file, ask three questions:

1. **Am I allowed to upload this?**
2. **Does it contain personal, customer, financial, confidential, or regulated information?**
3. **Would I be comfortable sending this externally under my organization’s policy?**

If the answer is unclear, stop and follow your organization’s policy.

Do not upload sensitive documents unless your organization has approved the use case and platform.

---

## 5.3 Common Document Tasks

Once a document is available to Claude, you can ask it to:

- Summarize the document
- Extract key decisions
- Identify action items
- Find contradictions or gaps
- Convert content into a table
- Explain a section in plain language
- Draft a response based on the document
- Create a checklist
- Compare two documents
- Identify risks and assumptions

The best document prompts are specific. Instead of asking, “Summarize this,” ask for the type of summary you need.

---

## 5.4 Document Prompt Examples

### Executive Summary

```text
Summarize this document for a senior manager. Focus on business impact, risks, decisions needed, and next steps. Keep it under 300 words.
```

### Action Items

```text
Extract all action items from this document. Present them in a table with columns for action, owner, due date, dependency, and risk. If owner or date is missing, write "not specified".
```

### Contract or Policy Review Support

```text
Review this document and identify sections related to cancellation, payment terms, confidentiality, and responsibilities. Do not provide legal advice. Summarize what the document says and list items a qualified reviewer should check.
```

### Inconsistency Check

```text
Find possible inconsistencies, unclear statements, duplicated points, or missing information in this document. Group the findings by severity.
```

### Training Conversion

```text
Turn this document into a learner-friendly checklist and a five-question knowledge check.
```

---

## 5.5 Spreadsheet and Data Tasks

For spreadsheets, CSV files, or tables, Claude can often help you reason about the structure and meaning of the data.

Possible tasks:

- Summarize trends
- Identify missing values
- Group records by category
- Create a pivot-style summary
- Explain columns
- Identify outliers
- Draft a narrative summary
- Create a management update

Important caution:

> Claude’s analysis should be checked against the original data. For financial, operational, or compliance data, validate calculations independently.

Example prompt:

```text
Review this spreadsheet and summarize what stands out. Identify missing values, unusual patterns, and three questions I should ask before making a decision from this data.
```

---

## 5.6 Image and Screenshot Tasks

Claude can be useful with images and screenshots where supported. Examples include:

- Interpreting a chart
- Explaining a screenshot
- Reading a diagram
- Turning a whiteboard photo into structured notes
- Summarizing a slide image
- Identifying UI elements in a screenshot

Example prompt:

```text
Review this screenshot and explain what it shows. Identify the key information, any visible errors, and what follow-up action I should take.
```

For screenshots of systems, avoid exposing sensitive customer data, credentials, tokens, internal hostnames, or confidential information.

---

## 5.7 Artifacts and Reusable Outputs

When Claude creates a substantial output, it may produce an Artifact or reusable content panel depending on your interface. Artifacts are useful for outputs you may want to revise, copy, export, or continue editing.

Good Artifact candidates:

- Policies
- Draft documents
- Tables
- Lesson plans
- Checklists
- Code snippets
- Project plans
- Rubrics
- FAQs
- Structured reports

Prompt example:

```text
Create a reusable checklist from this document. Structure it with sections, checkboxes, and short guidance notes under each section.
```

---

## 5.8 Worked Example — File to Checklist

Scenario: You upload a training policy and need a checklist for coordinators.

Prompt sequence:

```text
Summarize this policy in plain English for training coordinators.
```

```text
Now extract the operational requirements that coordinators must follow.
```

```text
Turn those requirements into a checklist with columns for requirement, evidence needed, owner, and frequency.
```

```text
Identify anything in the checklist that should be verified against the official policy before use.
```

This workflow produces useful output while keeping verification in the process.

---

## Try It Yourself

Use a document that is safe and appropriate to upload.

1. Upload the file.
2. Ask Claude to summarize it.
3. Ask one specific question about the content.
4. Ask Claude to turn part of the answer into a reusable output.
5. Identify what must be checked before using the output.

Suggested prompt:

```text
Summarize this document in five bullets. Then list the key actions, risks, and questions I should clarify before using it.
```

Follow-up:

```text
Turn the actions into a checklist I can reuse.
```

---

## Reflection

1. What type of file did you use?
2. What did Claude summarize well?
3. What did Claude miss or misunderstand?
4. What part of the output must be verified?
5. What reusable output did you create?

---

## Module 5 Self-Check

1. What should you ask before uploading a file?
2. Name three useful document prompts.
3. Why should spreadsheet calculations be checked?
4. What are Artifacts useful for?
5. What should you avoid exposing in screenshots?

---

## Completion Checkpoint

You are ready to continue when you have used Claude with one safe file or document extract and produced a reusable summary, checklist, table, or draft.
