# Skunkworks Academy — Site & Source Sitemap

> Generated from the `skunkworks-academy` GitHub organisation on 14 August 2026. This is a source-of-truth inventory for public Academy web properties and source trees.

## Scope and privacy boundary

- Organisation snapshot: **78 repositories** — **68 public** and **10 private**.
- Source-tree snapshot: **14,531 tracked paths** (12,151 files and 2,380 directories).
- This public repository contains an exact manifest of **14,122 public paths**. Private repository names, folders and filenames are intentionally excluded; **409 private paths** were assessed only in aggregate.
- The crawler sitemap is host-scoped to `https://skunkworksacademy.com/`. Subdomains are catalogued below but are not inserted into this XML file, because sitemap entries must be for the same host.

## Delivered files

- [sitemap.xml](./sitemap.xml) — 214 first-party, indexable static URLs on the canonical apex host.
- [SITEMAP-PUBLIC-REPOSITORY-FILES-01.tsv](./SITEMAP-PUBLIC-REPOSITORY-FILES-01.tsv) and [SITEMAP-PUBLIC-REPOSITORY-FILES-02.tsv](./SITEMAP-PUBLIC-REPOSITORY-FILES-02.tsv) — complete public repository folder/file manifest, split below the GitHub Contents API comfort limit.
- `SITEMAP.md` — this human-readable audit, deployment register and URL map.

## Executive findings

| Priority | Finding | Evidence / impact |
|---|---|---|
| High | Canonical-host conflict | Source canonicals, `robots.txt` and the CNAME use the apex host, while the live crawl observed an apex-to-`www` redirect. Align redirect, canonical tags and sitemap host. |
| High | Existing sitemap was incomplete and host-invalid | The previous XML had 22 URLs, including 5 cross-subdomain entries, while 214 first-party indexable static URLs were discovered. |
| High | Subdomain sitemap ownership is fragmented | 20 source-declared custom domains and 0 homepage-declared subdomains require their own `robots.txt` and sitemap controls. |
| Medium | Canonical coverage is low | 42 of 223 static HTML candidates define a canonical; 181 do not. This makes duplicate-path consolidation harder. |
| Medium | Repository metadata mismatch | `comptia` declares `comptia.skunkworksacademy.com` in CNAME but its GitHub homepage still points to the GitHub Pages URL. |
| Medium | Stale public repositories | 12 public repositories have had no push for more than six months; review whether they should be actively surfaced, archived or refreshed. |

## Main-site XML URL inventory

The generated XML lists **214** URLs. It excludes 3 noindex source pages, 5 cross-subdomain bridge pages, and duplicate canonical URLs. The URL groups below are the exact sitemap entries.

<details>
<summary><strong>/https:/ </strong> — 214 URLs</summary>

- [https://skunkworksacademy.com/](https://skunkworksacademy.com/) — Skunkworks Academy | Practical Technology Guides, Labs and Learning Paths
- [https://skunkworksacademy.com/about.html](https://skunkworksacademy.com/about.html) — About Skunkworks Academy
- [https://skunkworksacademy.com/adobe/](https://skunkworksacademy.com/adobe/) — Adobe Courses - Skunkworks Academy
- [https://skunkworksacademy.com/advertising-disclosure.html](https://skunkworksacademy.com/advertising-disclosure.html) — Advertising Disclosure | Skunkworks Academy
- [https://skunkworksacademy.com/ai/](https://skunkworksacademy.com/ai/) — AI Training - Skunkworks Academy
- [https://skunkworksacademy.com/ai/ai-bots-and-agents/](https://skunkworksacademy.com/ai/ai-bots-and-agents/) — AI Bots, Chatbots, LLMs and AI Agents | Skunkworks Academy
- [https://skunkworksacademy.com/app-dev/](https://skunkworksacademy.com/app-dev/) — Application Development - Skunkworks Academy
- [https://skunkworksacademy.com/asterisk/](https://skunkworksacademy.com/asterisk/) — Asterisk Courses and Learning Content
- [https://skunkworksacademy.com/asterisk/advanced-dial-plans.html](https://skunkworksacademy.com/asterisk/advanced-dial-plans.html) — Hands-on Lab - Implementing Advanced Dial Plans and Features
- [https://skunkworksacademy.com/asterisk/basic-voip-setup.html](https://skunkworksacademy.com/asterisk/basic-voip-setup.html) — Hands-on Lab - Setting Up a Basic VoIP Environment
- [https://skunkworksacademy.com/asterisk/custom-voicemail-application.html](https://skunkworksacademy.com/asterisk/custom-voicemail-application.html) — Hands-on Lab - Building a Custom Voicemail Application with Asterisk
- [https://skunkworksacademy.com/asterisk/installing-asterisk-and-basic-configuration.html](https://skunkworksacademy.com/asterisk/installing-asterisk-and-basic-configuration.html) — Hands-on Lab - Installing Asterisk and Basic Configuration
- [https://skunkworksacademy.com/asterisk/troubleshooting-common-issues.html](https://skunkworksacademy.com/asterisk/troubleshooting-common-issues.html) — Hands-on Lab - Troubleshooting Common Issues
- [https://skunkworksacademy.com/asterisk/voip-phone-and-sip-configuration.html](https://skunkworksacademy.com/asterisk/voip-phone-and-sip-configuration.html) — Hands-on Lab - VoIP Phone and SIP Configuration
- [https://skunkworksacademy.com/authors/raydo-matthee.html](https://skunkworksacademy.com/authors/raydo-matthee.html) — Raydo Matthee | Author and Technical Reviewer
- [https://skunkworksacademy.com/automation/](https://skunkworksacademy.com/automation/) — Automation Training - Skunkworks Academy
- [https://skunkworksacademy.com/blockchaincourse/](https://skunkworksacademy.com/blockchaincourse/) — Blockchain Basics by Oliver Bodemer
- [https://skunkworksacademy.com/blockchaincourse/assessment.html](https://skunkworksacademy.com/blockchaincourse/assessment.html) — Assessment Form
- [https://skunkworksacademy.com/blockchaincourse/enrollment.html](https://skunkworksacademy.com/blockchaincourse/enrollment.html) — Enrollment Form
- [https://skunkworksacademy.com/blockchaincourse/feedback.html](https://skunkworksacademy.com/blockchaincourse/feedback.html) — Feedback Form
- [https://skunkworksacademy.com/checkpoint/](https://skunkworksacademy.com/checkpoint/) — Checkpoint Security Training
- [https://skunkworksacademy.com/cisco/](https://skunkworksacademy.com/cisco/) — CISCO
- [https://skunkworksacademy.com/cloud/](https://skunkworksacademy.com/cloud/) — Cloud Training - Skunkworks Academy
- [https://skunkworksacademy.com/comptia/](https://skunkworksacademy.com/comptia/) — CompTIA Certifications | Skunkworks Academy
- [https://skunkworksacademy.com/comptia/a-plus.html](https://skunkworksacademy.com/comptia/a-plus.html) — A+ Certification – Skunkworks Academy
- [https://skunkworksacademy.com/comptia/cloud-plus.html](https://skunkworksacademy.com/comptia/cloud-plus.html) — Cloud+ Certification – Skunkworks Academy
- [https://skunkworksacademy.com/comptia/cysa-plus.html](https://skunkworksacademy.com/comptia/cysa-plus.html) — CySA+ Certification – Skunkworks Academy
- [https://skunkworksacademy.com/comptia/data-plus.html](https://skunkworksacademy.com/comptia/data-plus.html) — Data+ Certification – Skunkworks Academy
- [https://skunkworksacademy.com/comptia/linux-plus.html](https://skunkworksacademy.com/comptia/linux-plus.html) — Linux+ Certification – Skunkworks Academy
- [https://skunkworksacademy.com/comptia/network-plus.html](https://skunkworksacademy.com/comptia/network-plus.html) — Network+ Certification – Skunkworks Academy
- [https://skunkworksacademy.com/comptia/pentest-plus.html](https://skunkworksacademy.com/comptia/pentest-plus.html) — PenTest+ Certification – Skunkworks Academy
- [https://skunkworksacademy.com/comptia/project-plus.html](https://skunkworksacademy.com/comptia/project-plus.html) — Project+ Certification – Skunkworks Academy
- [https://skunkworksacademy.com/comptia/security-plus.html](https://skunkworksacademy.com/comptia/security-plus.html) — Security+ Certification – Skunkworks Academy
- [https://skunkworksacademy.com/comptia/tech-plus.html](https://skunkworksacademy.com/comptia/tech-plus.html) — Tech+ Certification – Skunkworks Academy
- [https://skunkworksacademy.com/contact.html](https://skunkworksacademy.com/contact.html) — Contact Skunkworks Academy
- [https://skunkworksacademy.com/cookie-policy.html](https://skunkworksacademy.com/cookie-policy.html) — Cookie Policy | Skunkworks Academy
- [https://skunkworksacademy.com/course-registration/](https://skunkworksacademy.com/course-registration/) — Course Registration | Skunkworks Academy
- [https://skunkworksacademy.com/course-registration/skunkworks-academy-cyber-security-training-email.html](https://skunkworksacademy.com/course-registration/skunkworks-academy-cyber-security-training-email.html) — Skunkworks Academy Cyber Security Training — June 2026 Intake
- [https://skunkworksacademy.com/course-registration/thank-you.html](https://skunkworksacademy.com/course-registration/thank-you.html) — Registration Received | Skunkworks Academy
- [https://skunkworksacademy.com/cpp/cpp-cpe-2024.html](https://skunkworksacademy.com/cpp/cpp-cpe-2024.html) — C++ Course Outline
- [https://skunkworksacademy.com/data/](https://skunkworksacademy.com/data/) — Data Analytics & BI - Skunkworks Academy
- [https://skunkworksacademy.com/devops-agile/](https://skunkworksacademy.com/devops-agile/) — DevOps & Agile Training - Skunkworks Academy
- [https://skunkworksacademy.com/editorial-policy.html](https://skunkworksacademy.com/editorial-policy.html) — Editorial Policy | Skunkworks Academy
- [https://skunkworksacademy.com/faculty/](https://skunkworksacademy.com/faculty/) — Faculty | Skunkworks Academy
- [https://skunkworksacademy.com/forms/](https://skunkworksacademy.com/forms/) — Career Growth and Learning Assessment | Skunkworks Academy Forms
- [https://skunkworksacademy.com/forms/Skunkworks_Academy_Accounts_Payable_Policy.html](https://skunkworksacademy.com/forms/Skunkworks_Academy_Accounts_Payable_Policy.html) — Skunkworks Academy - Accounts Payable Policy
- [https://skunkworksacademy.com/forms/Skunkworks_Academy_Global_Vendor_Form.html](https://skunkworksacademy.com/forms/Skunkworks_Academy_Global_Vendor_Form.html) — Skunkworks Academy - Global Vendor Form
- [https://skunkworksacademy.com/forms/Skunkworks_Academy_Instructor_Handbook.html](https://skunkworksacademy.com/forms/Skunkworks_Academy_Instructor_Handbook.html) — Skunkworks Academy Instructor Handbook
- [https://skunkworksacademy.com/forms/Skunkworks_Academy_Instructor_Task_Order_Template.html](https://skunkworksacademy.com/forms/Skunkworks_Academy_Instructor_Task_Order_Template.html) — Skunkworks Academy - Instructor Task Order Template
- [https://skunkworksacademy.com/forms/Skunkworks_Academy_NDA_Template.html](https://skunkworksacademy.com/forms/Skunkworks_Academy_NDA_Template.html) — Skunkworks Academy - Non-Disclosure Agreement
- [https://skunkworksacademy.com/forms/Skunkworks_Academy_Subcontractor_Agreement_Template.html](https://skunkworksacademy.com/forms/Skunkworks_Academy_Subcontractor_Agreement_Template.html) — Skunkworks Academy - Subcontractor Agreement Template
- [https://skunkworksacademy.com/github/](https://skunkworksacademy.com/github/) — Github
- [https://skunkworksacademy.com/google/](https://skunkworksacademy.com/google/) — Google
- [https://skunkworksacademy.com/guides/](https://skunkworksacademy.com/guides/) — Technical Guides | Skunkworks Academy
- [https://skunkworksacademy.com/guides/ai-enabled-learning-path.html](https://skunkworksacademy.com/guides/ai-enabled-learning-path.html) — Designing an AI-Enabled Learning Path | Skunkworks Academy
- [https://skunkworksacademy.com/guides/cloud-certification-roadmap.html](https://skunkworksacademy.com/guides/cloud-certification-roadmap.html) — Cloud Certification Roadmap for Delivery Teams | Skunkworks Academy
- [https://skunkworksacademy.com/guides/learning-readiness-canvas.html](https://skunkworksacademy.com/guides/learning-readiness-canvas.html) — Learning Readiness Canvas | Skunkworks Academy
- [https://skunkworksacademy.com/guides/zero-trust-lab-controls.html](https://skunkworksacademy.com/guides/zero-trust-lab-controls.html) — Zero-Trust Controls for Hands-On Labs | Skunkworks Academy
- [https://skunkworksacademy.com/hashicorp/](https://skunkworksacademy.com/hashicorp/) — HashiCorp
- [https://skunkworksacademy.com/ibm/](https://skunkworksacademy.com/ibm/) — IBM
- [https://skunkworksacademy.com/ibm/carbon.html](https://skunkworksacademy.com/ibm/carbon.html)
- [https://skunkworksacademy.com/ibm/cl207-u01.html](https://skunkworksacademy.com/ibm/cl207-u01.html) — Unit 1: Overview of Db2 11.1
- [https://skunkworksacademy.com/ibm/cl207-u02.html](https://skunkworksacademy.com/ibm/cl207-u02.html) — IBM DB2 Administration Workshop
- [https://skunkworksacademy.com/ibm/cl207-u03.html](https://skunkworksacademy.com/ibm/cl207-u03.html) — Unit 3 - Demonstration 1: Create a new Db2 instance
- [https://skunkworksacademy.com/ibm/cl207-u04.html](https://skunkworksacademy.com/ibm/cl207-u04.html) — Unit 4 - Demonstration 1: Creating databases and data placement
- [https://skunkworksacademy.com/ibm/cl207-u05.html](https://skunkworksacademy.com/ibm/cl207-u05.html) — Unit 5: Creating Database Objects - Demonstration
- [https://skunkworksacademy.com/ibm/cl207-u06.html](https://skunkworksacademy.com/ibm/cl207-u06.html) — Unit 6: Moving Data - Demonstration
- [https://skunkworksacademy.com/ibm/cl207-u07.html](https://skunkworksacademy.com/ibm/cl207-u07.html) — Unit 7: Backup and Recovery - Demonstration
- [https://skunkworksacademy.com/ibm/cl207-u08.html](https://skunkworksacademy.com/ibm/cl207-u08.html) — Unit 8: Database Maintenance, Monitoring, and Problem Determination
- [https://skunkworksacademy.com/ibm/cl207-u09.html](https://skunkworksacademy.com/ibm/cl207-u09.html) — Unit 9: Locking and Concurrency
- [https://skunkworksacademy.com/ibm/cl207-u10.html](https://skunkworksacademy.com/ibm/cl207-u10.html) — Unit 10: Security
- [https://skunkworksacademy.com/ibm/db2.html](https://skunkworksacademy.com/ibm/db2.html) — IBM DB2 Administration Workshop
- [https://skunkworksacademy.com/ibm/db2/cla96/](https://skunkworksacademy.com/ibm/db2/cla96/) — CLA96G â€“ Unified LMS Portal
- [https://skunkworksacademy.com/ibm/db2/cla96/analytics.html](https://skunkworksacademy.com/ibm/db2/cla96/analytics.html) — CLA96G – Analytics
- [https://skunkworksacademy.com/ibm/db2/cla96/assessment.html](https://skunkworksacademy.com/ibm/db2/cla96/assessment.html) — CLA96G – Final Assessment
- [https://skunkworksacademy.com/ibm/db2/cla96/part-1.html](https://skunkworksacademy.com/ibm/db2/cla96/part-1.html) — CLA96G – Part 1
- [https://skunkworksacademy.com/ibm/db2/cla96/part-2.html](https://skunkworksacademy.com/ibm/db2/cla96/part-2.html) — CLA96G – Part 2
- [https://skunkworksacademy.com/ibm/db2/cla96/part-3.html](https://skunkworksacademy.com/ibm/db2/cla96/part-3.html) — CLA96G – Part 3
- [https://skunkworksacademy.com/ibm/db2/cla96/part-4.html](https://skunkworksacademy.com/ibm/db2/cla96/part-4.html) — CLA96G – Part 4
- [https://skunkworksacademy.com/ibm/db2/CLA96G_Unified_LMS_SCORMReady/](https://skunkworksacademy.com/ibm/db2/CLA96G_Unified_LMS_SCORMReady/) — CLA96G â€“ Unified LMS Portal
- [https://skunkworksacademy.com/ibm/db2/CLA96G_Unified_LMS_SCORMReady/analytics.html](https://skunkworksacademy.com/ibm/db2/CLA96G_Unified_LMS_SCORMReady/analytics.html) — CLA96G – Analytics
- [https://skunkworksacademy.com/ibm/db2/CLA96G_Unified_LMS_SCORMReady/assessment.html](https://skunkworksacademy.com/ibm/db2/CLA96G_Unified_LMS_SCORMReady/assessment.html) — CLA96G – Final Assessment
- [https://skunkworksacademy.com/ibm/db2/CLA96G_Unified_LMS_SCORMReady/part-1.html](https://skunkworksacademy.com/ibm/db2/CLA96G_Unified_LMS_SCORMReady/part-1.html) — CLA96G – Part 1
- [https://skunkworksacademy.com/ibm/db2/CLA96G_Unified_LMS_SCORMReady/part-2.html](https://skunkworksacademy.com/ibm/db2/CLA96G_Unified_LMS_SCORMReady/part-2.html) — CLA96G – Part 2
- [https://skunkworksacademy.com/ibm/db2/CLA96G_Unified_LMS_SCORMReady/part-3.html](https://skunkworksacademy.com/ibm/db2/CLA96G_Unified_LMS_SCORMReady/part-3.html) — CLA96G – Part 3
- [https://skunkworksacademy.com/ibm/db2/CLA96G_Unified_LMS_SCORMReady/part-4.html](https://skunkworksacademy.com/ibm/db2/CLA96G_Unified_LMS_SCORMReady/part-4.html) — CLA96G – Part 4
- [https://skunkworksacademy.com/ibm/db2/db2.html](https://skunkworksacademy.com/ibm/db2/db2.html) — IBM DB2 Administration Workshop
- [https://skunkworksacademy.com/ibm/db2/DB2%20on%20Linux%20Workshop/](https://skunkworksacademy.com/ibm/db2/DB2%20on%20Linux%20Workshop/) — CLA93 â€“ IBM Db2 Foundation | Skunkworks Academy
- [https://skunkworksacademy.com/ibm/db2/DB2%20on%20Linux%20Workshop/assessment.html](https://skunkworksacademy.com/ibm/db2/DB2%20on%20Linux%20Workshop/assessment.html) — CLA96G – Delegate Knowledge Assessment
- [https://skunkworksacademy.com/ibm/db2/DB2%20on%20Linux%20Workshop/cl207-u01.html](https://skunkworksacademy.com/ibm/db2/DB2%20on%20Linux%20Workshop/cl207-u01.html) — Unit 1: Overview of Db2 11.1
- [https://skunkworksacademy.com/ibm/db2/DB2%20on%20Linux%20Workshop/cl207-u01%201.html](https://skunkworksacademy.com/ibm/db2/DB2%20on%20Linux%20Workshop/cl207-u01%201.html) — Unit 1: Overview of Db2 11.1
- [https://skunkworksacademy.com/ibm/db2/DB2%20on%20Linux%20Workshop/cl207-u02.html](https://skunkworksacademy.com/ibm/db2/DB2%20on%20Linux%20Workshop/cl207-u02.html) — IBM DB2 Administration Workshop
- [https://skunkworksacademy.com/ibm/db2/DB2%20on%20Linux%20Workshop/cl207-u03.html](https://skunkworksacademy.com/ibm/db2/DB2%20on%20Linux%20Workshop/cl207-u03.html) — Unit 3 - Demonstration 1: Create a new Db2 instance
- [https://skunkworksacademy.com/ibm/db2/DB2%20on%20Linux%20Workshop/cl207-u03%201.html](https://skunkworksacademy.com/ibm/db2/DB2%20on%20Linux%20Workshop/cl207-u03%201.html) — Unit 3 - Demonstration 1: Create a new Db2 instance
- [https://skunkworksacademy.com/ibm/db2/DB2%20on%20Linux%20Workshop/cl207-u04.html](https://skunkworksacademy.com/ibm/db2/DB2%20on%20Linux%20Workshop/cl207-u04.html) — Unit 4 - Demonstration 1: Creating databases and data placement
- [https://skunkworksacademy.com/ibm/db2/DB2%20on%20Linux%20Workshop/cl207-u04%201.html](https://skunkworksacademy.com/ibm/db2/DB2%20on%20Linux%20Workshop/cl207-u04%201.html) — Unit 4 - Demonstration 1: Creating databases and data placement
- [https://skunkworksacademy.com/ibm/db2/DB2%20on%20Linux%20Workshop/cl207-u05.html](https://skunkworksacademy.com/ibm/db2/DB2%20on%20Linux%20Workshop/cl207-u05.html) — Unit 5: Creating Database Objects - Demonstration
- [https://skunkworksacademy.com/ibm/db2/DB2%20on%20Linux%20Workshop/cl207-u05%201.html](https://skunkworksacademy.com/ibm/db2/DB2%20on%20Linux%20Workshop/cl207-u05%201.html) — Unit 5: Creating Database Objects - Demonstration
- [https://skunkworksacademy.com/ibm/db2/DB2%20on%20Linux%20Workshop/cl207-u06.html](https://skunkworksacademy.com/ibm/db2/DB2%20on%20Linux%20Workshop/cl207-u06.html) — Unit 6: Moving Data - Demonstration
- [https://skunkworksacademy.com/ibm/db2/DB2%20on%20Linux%20Workshop/cl207-u07.html](https://skunkworksacademy.com/ibm/db2/DB2%20on%20Linux%20Workshop/cl207-u07.html) — Unit 7: Backup and Recovery - Demonstration
- [https://skunkworksacademy.com/ibm/db2/DB2%20on%20Linux%20Workshop/cl207-u08.html](https://skunkworksacademy.com/ibm/db2/DB2%20on%20Linux%20Workshop/cl207-u08.html) — Unit 8: Database Maintenance, Monitoring, and Problem Determination
- [https://skunkworksacademy.com/ibm/db2/DB2%20on%20Linux%20Workshop/cl207-u09.html](https://skunkworksacademy.com/ibm/db2/DB2%20on%20Linux%20Workshop/cl207-u09.html) — Unit 9: Locking and Concurrency
- [https://skunkworksacademy.com/ibm/db2/DB2%20on%20Linux%20Workshop/cl207-u10.html](https://skunkworksacademy.com/ibm/db2/DB2%20on%20Linux%20Workshop/cl207-u10.html) — Unit 10: Security
- [https://skunkworksacademy.com/ibm/db2/DB2%20on%20Linux%20Workshop/part-1.html](https://skunkworksacademy.com/ibm/db2/DB2%20on%20Linux%20Workshop/part-1.html) — CLA93 – Part 1 | Db2 Essentials
- [https://skunkworksacademy.com/ibm/db2/DB2%20on%20Linux%20Workshop/part-2.html](https://skunkworksacademy.com/ibm/db2/DB2%20on%20Linux%20Workshop/part-2.html) — CLA93 – Part 2 | Databases & Data Placement
- [https://skunkworksacademy.com/ibm/db2/DB2%20on%20Linux%20Workshop/part-3.html](https://skunkworksacademy.com/ibm/db2/DB2%20on%20Linux%20Workshop/part-3.html) — CLA93 – Part 3 | Security & Concurrency
- [https://skunkworksacademy.com/ibm/db2/DB2%20on%20Linux%20Workshop/part-4.html](https://skunkworksacademy.com/ibm/db2/DB2%20on%20Linux%20Workshop/part-4.html) — CLA96G – Part 4: Performance and Tuning Optimization (Db2 12.1)
- [https://skunkworksacademy.com/ibm/FICON-301.html](https://skunkworksacademy.com/ibm/FICON-301.html) — Course Outline: Integration and Cloud Solutions Bootcamp
- [https://skunkworksacademy.com/ibm/IBCPI-OC-01.html](https://skunkworksacademy.com/ibm/IBCPI-OC-01.html) — Course Outline: Integration and Cloud Solutions Bootcamp
- [https://skunkworksacademy.com/ibm/icb-bootcamp.html](https://skunkworksacademy.com/ibm/icb-bootcamp.html) — Course Outline: Integration and Cloud Solutions Bootcamp
- [https://skunkworksacademy.com/ibm/maximo/Preparation%20and%20Certification%20Learning%20Path.html](https://skunkworksacademy.com/ibm/maximo/Preparation%20and%20Certification%20Learning%20Path.html)
- [https://skunkworksacademy.com/ibm/scbb-ot10.html](https://skunkworksacademy.com/ibm/scbb-ot10.html) — Course Catalog
- [https://skunkworksacademy.com/instructor-led/](https://skunkworksacademy.com/instructor-led/) — Instructor-Led Course Catalog | Skunkworks Academy
- [https://skunkworksacademy.com/iso/](https://skunkworksacademy.com/iso/) — ISO Certification Training
- [https://skunkworksacademy.com/learning-paths/devops-zero2hero.html](https://skunkworksacademy.com/learning-paths/devops-zero2hero.html) — DevOps Zero2Hero by Skunkworks - Introduction Chapter
- [https://skunkworksacademy.com/mainframe/](https://skunkworksacademy.com/mainframe/) — Mainframe Training
- [https://skunkworksacademy.com/microsoft/ai-platform.html](https://skunkworksacademy.com/microsoft/ai-platform.html) — AI Platform – Microsoft Training | Skunkworks Academy
- [https://skunkworksacademy.com/microsoft/data-analytics.html](https://skunkworksacademy.com/microsoft/data-analytics.html) — Data Analytics – Microsoft Training | Skunkworks Academy
- [https://skunkworksacademy.com/microsoft/data-platform.html](https://skunkworksacademy.com/microsoft/data-platform.html) — Data Platform – Microsoft Training | Skunkworks Academy
- [https://skunkworksacademy.com/microsoft/index.html](https://skunkworksacademy.com/microsoft/index.html) — Microsoft Training Catalogue | Skunkworks Academy
- [https://skunkworksacademy.com/microsoft/index1.html](https://skunkworksacademy.com/microsoft/index1.html) — Skunkworks Academy • Microsoft Training
- [https://skunkworksacademy.com/microsoft/japanese.html](https://skunkworksacademy.com/microsoft/japanese.html) — Japanese – Microsoft Training | Skunkworks Academy
- [https://skunkworksacademy.com/microsoft/microsoft-365.html](https://skunkworksacademy.com/microsoft/microsoft-365.html) — Microsoft 365 – Microsoft Training | Skunkworks Academy
- [https://skunkworksacademy.com/microsoft/microsoft-azure.html](https://skunkworksacademy.com/microsoft/microsoft-azure.html) — Microsoft Azure – Microsoft Training | Skunkworks Academy
- [https://skunkworksacademy.com/microsoft/microsoft-dynamics-365-business-edition.html](https://skunkworksacademy.com/microsoft/microsoft-dynamics-365-business-edition.html) — Dynamics 365 Business Edition – Microsoft Training | Skunkworks Academy
- [https://skunkworksacademy.com/microsoft/microsoft-dynamics-365.html](https://skunkworksacademy.com/microsoft/microsoft-dynamics-365.html) — Microsoft Dynamics 365 – Microsoft Training | Skunkworks Academy
- [https://skunkworksacademy.com/microsoft/microsoft-dynamics.html](https://skunkworksacademy.com/microsoft/microsoft-dynamics.html) — Microsoft Dynamics – Microsoft Training | Skunkworks Academy
- [https://skunkworksacademy.com/microsoft/microsoft-endpoint-configuration-manager.html](https://skunkworksacademy.com/microsoft/microsoft-endpoint-configuration-manager.html) — Endpoint Configuration Manager – Microsoft Training | Skunkworks Academy
- [https://skunkworksacademy.com/microsoft/microsoft-office-365.html](https://skunkworksacademy.com/microsoft/microsoft-office-365.html) — Microsoft Office 365 – Microsoft Training | Skunkworks Academy
- [https://skunkworksacademy.com/microsoft/microsoft-office.html](https://skunkworksacademy.com/microsoft/microsoft-office.html) — Microsoft Office – Microsoft Training | Skunkworks Academy
- [https://skunkworksacademy.com/microsoft/microsoft-products.html](https://skunkworksacademy.com/microsoft/microsoft-products.html) — Microsoft Products – Microsoft Training | Skunkworks Academy
- [https://skunkworksacademy.com/microsoft/microsoft-sharepoint.html](https://skunkworksacademy.com/microsoft/microsoft-sharepoint.html) — Microsoft SharePoint – Microsoft Training | Skunkworks Academy
- [https://skunkworksacademy.com/microsoft/microsoft-skype-for-business.html](https://skunkworksacademy.com/microsoft/microsoft-skype-for-business.html) — Skype for Business – Microsoft Training | Skunkworks Academy
- [https://skunkworksacademy.com/microsoft/microsoft-sql-server.html](https://skunkworksacademy.com/microsoft/microsoft-sql-server.html) — SQL Server – Microsoft Training | Skunkworks Academy
- [https://skunkworksacademy.com/microsoft/microsoft-system-center.html](https://skunkworksacademy.com/microsoft/microsoft-system-center.html) — System Center – Microsoft Training | Skunkworks Academy
- [https://skunkworksacademy.com/microsoft/microsoft-visual-studio.html](https://skunkworksacademy.com/microsoft/microsoft-visual-studio.html) — Visual Studio – Microsoft Training | Skunkworks Academy
- [https://skunkworksacademy.com/microsoft/microsoft-windows-server.html](https://skunkworksacademy.com/microsoft/microsoft-windows-server.html) — Microsoft Windows Server – Microsoft Training | Skunkworks Academy
- [https://skunkworksacademy.com/microsoft/non-microsoft-products-and-technologies.html](https://skunkworksacademy.com/microsoft/non-microsoft-products-and-technologies.html) — Non‑Microsoft Products – Training | Skunkworks Academy
- [https://skunkworksacademy.com/microsoft/power-bi.html](https://skunkworksacademy.com/microsoft/power-bi.html) — Power BI – Microsoft Training | Skunkworks Academy
- [https://skunkworksacademy.com/microsoft/power-platform.html](https://skunkworksacademy.com/microsoft/power-platform.html) — Power Platform – Microsoft Training | Skunkworks Academy
- [https://skunkworksacademy.com/microsoft/preview.html](https://skunkworksacademy.com/microsoft/preview.html) — Skunkworks Academy • Microsoft Training
- [https://skunkworksacademy.com/microsoft/security.html](https://skunkworksacademy.com/microsoft/security.html) — Security – Microsoft Training | Skunkworks Academy
- [https://skunkworksacademy.com/microsoft/teams.html](https://skunkworksacademy.com/microsoft/teams.html) — Teams – Microsoft Training | Skunkworks Academy
- [https://skunkworksacademy.com/microsoft/training/azure/](https://skunkworksacademy.com/microsoft/training/azure/) — Azure training â€¢ Skunkworks Academy
- [https://skunkworksacademy.com/microsoft/waypoint.html](https://skunkworksacademy.com/microsoft/waypoint.html) — Waypoint – Microsoft Training | Skunkworks Academy
- [https://skunkworksacademy.com/microsoft/web-development.html](https://skunkworksacademy.com/microsoft/web-development.html) — Web Development – Microsoft Training | Skunkworks Academy
- [https://skunkworksacademy.com/microsoft/windows-server-technologies.html](https://skunkworksacademy.com/microsoft/windows-server-technologies.html) — Windows Server Tech – Microsoft Training | Skunkworks Academy
- [https://skunkworksacademy.com/microsoft/windows.html](https://skunkworksacademy.com/microsoft/windows.html) — Windows – Microsoft Training | Skunkworks Academy
- [https://skunkworksacademy.com/middleware/](https://skunkworksacademy.com/middleware/) — Middleware Certifications | Skunkworks Academy
- [https://skunkworksacademy.com/networking/](https://skunkworksacademy.com/networking/) — Cisco Networking Certifications | Skunkworks Academy
- [https://skunkworksacademy.com/occupational/](https://skunkworksacademy.com/occupational/) — Occupational Safety Dashboard
- [https://skunkworksacademy.com/owasp/](https://skunkworksacademy.com/owasp/) — OWASP Security Training | Skunkworks Academy
- [https://skunkworksacademy.com/owasp/owasp-401.html](https://skunkworksacademy.com/owasp/owasp-401.html) — DevOps Zero2Hero by Skunkworks - Introduction Chapter
- [https://skunkworksacademy.com/paloalto/](https://skunkworksacademy.com/paloalto/) — Paloalto
- [https://skunkworksacademy.com/partners/cisco.html](https://skunkworksacademy.com/partners/cisco.html) — Cisco
- [https://skunkworksacademy.com/partners/comptia.html](https://skunkworksacademy.com/partners/comptia.html) — Comptia
- [https://skunkworksacademy.com/partners/github.html](https://skunkworksacademy.com/partners/github.html) — Github
- [https://skunkworksacademy.com/partners/google.html](https://skunkworksacademy.com/partners/google.html) — Google
- [https://skunkworksacademy.com/partners/hashicorp.html](https://skunkworksacademy.com/partners/hashicorp.html) — HashiCorp
- [https://skunkworksacademy.com/partners/ibm.html](https://skunkworksacademy.com/partners/ibm.html) — IBM
- [https://skunkworksacademy.com/partners/microsoft.html](https://skunkworksacademy.com/partners/microsoft.html) — Microsoft
- [https://skunkworksacademy.com/partners/paloalto.html](https://skunkworksacademy.com/partners/paloalto.html) — Paloalto Networks
- [https://skunkworksacademy.com/partners/red%20hat.html](https://skunkworksacademy.com/partners/red%20hat.html) — Red Hat
- [https://skunkworksacademy.com/partners/sage.html](https://skunkworksacademy.com/partners/sage.html) — Sage
- [https://skunkworksacademy.com/partners/salesforce.html](https://skunkworksacademy.com/partners/salesforce.html) — Salesforce
- [https://skunkworksacademy.com/partners/sap.html](https://skunkworksacademy.com/partners/sap.html) — SAP
- [https://skunkworksacademy.com/plans-and-purchases/](https://skunkworksacademy.com/plans-and-purchases/) — Plans & Purchases | Skunkworks Academy
- [https://skunkworksacademy.com/privacy.html](https://skunkworksacademy.com/privacy.html) — Privacy Policy | Skunkworks Academy
- [https://skunkworksacademy.com/python/](https://skunkworksacademy.com/python/) — Python Course Outline
- [https://skunkworksacademy.com/python/activities.html](https://skunkworksacademy.com/python/activities.html) — Python Programming Activities
- [https://skunkworksacademy.com/python/activities1.html](https://skunkworksacademy.com/python/activities1.html) — Python Programming by Skunkworks
- [https://skunkworksacademy.com/python/assessment.html](https://skunkworksacademy.com/python/assessment.html) — Assessment Form
- [https://skunkworksacademy.com/python/code-review.html](https://skunkworksacademy.com/python/code-review.html) — Code Review - Python Programming by Skunkworks
- [https://skunkworksacademy.com/python/coding-challenge.html](https://skunkworksacademy.com/python/coding-challenge.html) — Coding Challenge - Python Programming by Skunkworks
- [https://skunkworksacademy.com/python/data-lab.html](https://skunkworksacademy.com/python/data-lab.html) — Data Lab - Python Programming by Skunkworks
- [https://skunkworksacademy.com/python/discussion-forum.html](https://skunkworksacademy.com/python/discussion-forum.html) — Discussion Forum - Python Programming by Skunkworks
- [https://skunkworksacademy.com/python/enrollment.html](https://skunkworksacademy.com/python/enrollment.html) — Enrollment Form
- [https://skunkworksacademy.com/python/feedback.html](https://skunkworksacademy.com/python/feedback.html) — Feedback Form
- [https://skunkworksacademy.com/python/hardware-simulator.html](https://skunkworksacademy.com/python/hardware-simulator.html) — Hardware Simulator - Python Programming by Skunkworks
- [https://skunkworksacademy.com/python/idea-board.html](https://skunkworksacademy.com/python/idea-board.html) — Project Idea Board - Python Programming by Skunkworks
- [https://skunkworksacademy.com/python/index2.html](https://skunkworksacademy.com/python/index2.html) — Python Course Outline
- [https://skunkworksacademy.com/python/project-showcase.html](https://skunkworksacademy.com/python/project-showcase.html) — Project Showcase - Python Programming by Skunkworks
- [https://skunkworksacademy.com/python/terms.html](https://skunkworksacademy.com/python/terms.html) — Terms and Conditions - Skunkworks
- [https://skunkworksacademy.com/python/week1-theory.html](https://skunkworksacademy.com/python/week1-theory.html) — Week 1: Introduction to Python - Theory Guide
- [https://skunkworksacademy.com/python/week2-theory.html](https://skunkworksacademy.com/python/week2-theory.html) — Week 2: Variables and Expressions - Python Course
- [https://skunkworksacademy.com/python/week3-theory.html](https://skunkworksacademy.com/python/week3-theory.html) — Week 2: Variables and Expressions - Python Course
- [https://skunkworksacademy.com/python/week4-theory.html](https://skunkworksacademy.com/python/week4-theory.html) — Week 2: Variables and Expressions - Python Course
- [https://skunkworksacademy.com/redhat/](https://skunkworksacademy.com/redhat/) — Red Hat Training & Certification | Skunkworks Academy
- [https://skunkworksacademy.com/redhat/drools-8.html](https://skunkworksacademy.com/redhat/drools-8.html) — Mastering Drools 8: Comprehensive Training Course
- [https://skunkworksacademy.com/sage/](https://skunkworksacademy.com/sage/) — Sage
- [https://skunkworksacademy.com/salesforce/](https://skunkworksacademy.com/salesforce/) — Salesforce
- [https://skunkworksacademy.com/sap/](https://skunkworksacademy.com/sap/) — SAP
- [https://skunkworksacademy.com/security/](https://skunkworksacademy.com/security/) — Security Training - Skunkworks Academy
- [https://skunkworksacademy.com/self-paced/](https://skunkworksacademy.com/self-paced/) — Self-Paced Course Catalog | Skunkworks Academy
- [https://skunkworksacademy.com/self-paced/claude/cld-dev-201/](https://skunkworksacademy.com/self-paced/claude/cld-dev-201/) — CLD-DEV-201 Claude for Developers | Self-Paced Claude API Course | Skunkworks Academy
- [https://skunkworksacademy.com/self-paced/claude/cld-uf-101/](https://skunkworksacademy.com/self-paced/claude/cld-uf-101/) — CLD-UF-101 | Claude User Fundamentals | Skunkworks Academy
- [https://skunkworksacademy.com/self-paced/json-course-interface-design/](https://skunkworksacademy.com/self-paced/json-course-interface-design/) — JSON Course Interface Design | Skunkworks Academy
- [https://skunkworksacademy.com/self-paced/microsoft-exchange-online-bulk-mail-management/](https://skunkworksacademy.com/self-paced/microsoft-exchange-online-bulk-mail-management/) — Exchange Online Bulk Mail Management | Skunkworks Academy
- [https://skunkworksacademy.com/self-paced/microsoft/d365-ce-bp-101/](https://skunkworksacademy.com/self-paced/microsoft/d365-ce-bp-101/) — D365-CE-BP-101 Best Practices for Developing with Dynamics 365 Customer Engagement | Self-Paced Microsoft Course | Skunkworks Academy
- [https://skunkworksacademy.com/self-paced/microsoft/ms-mp-bp-101/](https://skunkworksacademy.com/self-paced/microsoft/ms-mp-bp-101/) — MS-MP-BP-101 Create a Business Profile for Microsoft Marketplace to Get Sales Leads and Referrals | Self-Paced Microsoft Course | Skunkworks Academy
- [https://skunkworksacademy.com/self-paced/microsoft/ms-saas-plan-101/](https://skunkworksacademy.com/self-paced/microsoft/ms-saas-plan-101/) — MS-SaaS-PLAN-101 Create Plans for a SaaS Offer | Self-Paced Microsoft Course | Skunkworks Academy
- [https://skunkworksacademy.com/self-paced/mongodb-self-paced-technical-course/](https://skunkworksacademy.com/self-paced/mongodb-self-paced-technical-course/) — MongoDB Self-Paced Technical Course | Skunkworks Academy
- [https://skunkworksacademy.com/self-paced/reader.html](https://skunkworksacademy.com/self-paced/reader.html) — CLD-UF-101 Module Reader
- [https://skunkworksacademy.com/self-paced/secure-coding-owasp-top-10/](https://skunkworksacademy.com/self-paced/secure-coding-owasp-top-10/) — Secure Coding with OWASP Top 10 | Skunkworks Academy
- [https://skunkworksacademy.com/self-paced/security/](https://skunkworksacademy.com/self-paced/security/) — Security Self-Paced Course Catalog | Skunkworks Academy
- [https://skunkworksacademy.com/self-paced/security/skw-owasp-top10-2025/](https://skunkworksacademy.com/self-paced/security/skw-owasp-top10-2025/) — OWASP Top 10:2025 Web Application Security | Skunkworks Academy
- [https://skunkworksacademy.com/softskills/](https://skunkworksacademy.com/softskills/) — Soft Skills Development
- [https://skunkworksacademy.com/storage/](https://skunkworksacademy.com/storage/) — Storage Training - Skunkworks Academy
- [https://skunkworksacademy.com/terms.html](https://skunkworksacademy.com/terms.html) — Terms of Use | Skunkworks Academy
- [https://skunkworksacademy.com/terms/](https://skunkworksacademy.com/terms/) — Terms &amp; Conditions | Skunkworks Academy Power Platform Maker Environment
- [https://skunkworksacademy.com/webinars/workbooks/pp-101/](https://skunkworksacademy.com/webinars/workbooks/pp-101/) — PP-101 Personal Productivity Workbook | Skunkworks Academy
- [https://skunkworksacademy.com/website/](https://skunkworksacademy.com/website/) — CLD-UF-101 â€” Claude User Fundamentals
- [https://skunkworksacademy.com/website/self-paced.html](https://skunkworksacademy.com/website/self-paced.html) — CLD-UF-101 Self-Paced
- [https://skunkworksacademy.com/whatsapp/](https://skunkworksacademy.com/whatsapp/) — WhatsApp Business API Training - Skunkworks Academy

</details>

### Explicit exclusions

- `noindex`: `about/index.html`, `catalogue/index.html`, `repositories/index.html`.
- Cross-host canonical bridge pages (owned by their target subdomain sitemap): `subdomains/blog/index.html` → https://blog.skunkworksacademy.com/; `subdomains/docs/index.html` → https://docs.skunkworksacademy.com/; `subdomains/jobs/index.html` → https://jobs.skunkworksacademy.com/; `subdomains/prompt/index.html` → https://prompt.skunkworksacademy.com/; `subdomains/publish/index.html` → https://publish.skunkworksacademy.com/.
- Duplicate canonical consolidation: `pricing.index.html` resolves to `/plans-and-purchases/`; `about/index.html` resolves to `/about.html` and is noindex.

## Subdomain and deployment register

### Source-declared custom domains

| Domain | Repository evidence | Sitemap treatment |
|---|---|---|
| [aacca.skunkworksacademy.com](https://aacca.skunkworksacademy.com/) | `aacca/static/CNAME`<br>`aacca/static/DOMAIN` | Maintain a host-specific sitemap and robots directive |
| [badging.skunkworksacademy.com](https://badging.skunkworksacademy.com/) | `badging/CNAME` | Maintain a host-specific sitemap and robots directive |
| [brand.skunkworksacademy.com](https://brand.skunkworksacademy.com/) | `brand/CNAME` | Maintain a host-specific sitemap and robots directive |
| [careers.skunkworksacademy.com](https://careers.skunkworksacademy.com/) | `careers/public/CNAME` | Maintain a host-specific sitemap and robots directive |
| [catalog.skunkworksacademy.com](https://catalog.skunkworksacademy.com/) | `course-catalog/static/CNAME` | Maintain a host-specific sitemap and robots directive |
| [comptia.skunkworksacademy.com](https://comptia.skunkworksacademy.com/) | `comptia/CNAME` | Maintain a host-specific sitemap and robots directive |
| [docs.skunkworksacademy.com](https://docs.skunkworksacademy.com/) | `docs/static/CNAME` | Maintain a host-specific sitemap and robots directive |
| [faculty.skunkworksacademy.com](https://faculty.skunkworksacademy.com/) | `faculty/CNAME` | Maintain a host-specific sitemap and robots directive |
| [fksmm.skunkworksacademy.com](https://fksmm.skunkworksacademy.com/) | `fksmm/CNAME`<br>`fksmm/static/CNAME` | Maintain a host-specific sitemap and robots directive |
| [ibm.skunkworksacademy.com](https://ibm.skunkworksacademy.com/) | `ibm/CNAME` | Maintain a host-specific sitemap and robots directive |
| [jobs.skunkworksacademy.com](https://jobs.skunkworksacademy.com/) | `jobs/CNAME` | Maintain a host-specific sitemap and robots directive |
| [labs.skunkworksacademy.com](https://labs.skunkworksacademy.com/) | `labs/CNAME`<br>`labs/site/static/CNAME` | Maintain a host-specific sitemap and robots directive |
| [marketing.skunkworksacademy.com](https://marketing.skunkworksacademy.com/) | `marketing/CNAME` | Maintain a host-specific sitemap and robots directive |
| [media.skunkworksacademy.com](https://media.skunkworksacademy.com/) | `media/CNAME` | Maintain a host-specific sitemap and robots directive |
| [microsoft.skunkworksacademy.com](https://microsoft.skunkworksacademy.com/) | `microsoft/CNAME` | Maintain a host-specific sitemap and robots directive |
| [osint.skunkworksacademy.com](https://osint.skunkworksacademy.com/) | `osint/static/CNAME` | Maintain a host-specific sitemap and robots directive |
| [portal.skunkworksacademy.com](https://portal.skunkworksacademy.com/) | `portal/CNAME`<br>`portal/public/CNAME` | Maintain a host-specific sitemap and robots directive |
| [publish.skunkworksacademy.com](https://publish.skunkworksacademy.com/) | `publish/CNAME` | Maintain a host-specific sitemap and robots directive |
| [security.skunkworksacademy.com](https://security.skunkworksacademy.com/) | `security/CNAME` | Maintain a host-specific sitemap and robots directive |
| [skunkworksacademy.com](https://skunkworksacademy.com/) | `www/CNAME` | Included in this apex sitemap |

### Homepage-declared Academy properties without a CNAME file at the repository root

| Repository | Declared homepage | Audit note |
|---|---|---|

### Externally referenced Academy endpoints

| Endpoint | Discovery source | Status in the apex sitemap |
|---|---|---|
| `blog.skunkworksacademy.com` | Existing site navigation and live Blogger index | Excluded: belongs to its own host. |
| `prompt.skunkworksacademy.com` | `www/subdomains/prompt/` canonical and Jobs navigation | Excluded: no source-declared CNAME found in the organisation scan. |
| `badge-hub.skunkworksacademy.com` | Jobs navigation | Needs DNS/hosting-owner verification; no matching source-declared CNAME found. |
| `www.skunkworksacademy.com` | Live canonical gateway alias | Must be aligned with apex redirect/canonical policy; not separately listed. |

## Public repository catalogue

Each tree link exposes the full public repository source. The exact machine-readable folder/file listing is in the TSV manifests above.

| Repository | Ref | Source paths | Deployment | Public tree |
|---|---:|---:|---|---|
| [8G](https://github.com/skunkworks-academy/8G) | `main` | 139 (112 files / 27 dirs) | [link](https://skunkworks-academy.github.io/8G/) | [browse](https://github.com/skunkworks-academy/8G/tree/main) |
| [aacca](https://github.com/skunkworks-academy/aacca) | `main` | 70 (57 files / 13 dirs) | [link](https://aacca.skunkworksacademy.com/) | [browse](https://github.com/skunkworks-academy/aacca/tree/main) |
| [aap-demo](https://github.com/skunkworks-academy/aap-demo) | `main` | 112 (86 files / 26 dirs) | [link](https://—) | [browse](https://github.com/skunkworks-academy/aap-demo/tree/main) |
| [academy-validation](https://github.com/skunkworks-academy/academy-validation) | `main` | 21 (15 files / 6 dirs) | [link](https://—) | [browse](https://github.com/skunkworks-academy/academy-validation/tree/main) |
| [api](https://github.com/skunkworks-academy/api) | `main` | 24 (19 files / 5 dirs) | [link](https://api.skunkworksacademy.com/) | [browse](https://github.com/skunkworks-academy/api/tree/main) |
| [app](https://github.com/skunkworks-academy/app) | `main` | 7 (6 files / 1 dirs) | [link](https://—) | [browse](https://github.com/skunkworks-academy/app/tree/main) |
| [asterisk](https://github.com/skunkworks-academy/asterisk) | `main` | 17 (16 files / 1 dirs) | [link](https://—) | [browse](https://github.com/skunkworks-academy/asterisk/tree/main) |
| [AZ-040T00-Automating-Administration-with-PowerShell](https://github.com/skunkworks-academy/AZ-040T00-Automating-Administration-with-PowerShell) | `master` | 128 (102 files / 26 dirs) | [link](https://microsoftlearning.github.io/AZ-040T00-Automating-Administration-with-PowerShell/) | [browse](https://github.com/skunkworks-academy/AZ-040T00-Automating-Administration-with-PowerShell/tree/master) |
| [AZ-104-MicrosoftAzureAdministrator](https://github.com/skunkworks-academy/AZ-104-MicrosoftAzureAdministrator) | `master` | 113 (99 files / 14 dirs) | [link](https://microsoftlearning.github.io/AZ-104-MicrosoftAzureAdministrator/) | [browse](https://github.com/skunkworks-academy/AZ-104-MicrosoftAzureAdministrator/tree/master) |
| [AZ500-AzureSecurityTechnologies](https://github.com/skunkworks-academy/AZ500-AzureSecurityTechnologies) | `master` | 133 (110 files / 23 dirs) | [link](https://microsoftlearning.github.io/AZ500-AzureSecurityTechnologies/) | [browse](https://github.com/skunkworks-academy/AZ500-AzureSecurityTechnologies/tree/master) |
| [badging](https://github.com/skunkworks-academy/badging) | `main` | 35 (31 files / 4 dirs) | [link](https://badging.skunkworksacademy.com/) | [browse](https://github.com/skunkworks-academy/badging/tree/main) |
| [brand](https://github.com/skunkworks-academy/brand) | `main` | 18 (14 files / 4 dirs) | [link](https://brand.skunkworksacademy.com/) | [browse](https://github.com/skunkworks-academy/brand/tree/main) |
| [careers](https://github.com/skunkworks-academy/careers) | `main` | 27 (18 files / 9 dirs) | [link](https://careers.skunkworksacademy.com/) | [browse](https://github.com/skunkworks-academy/careers/tree/main) |
| [cdn](https://github.com/skunkworks-academy/cdn) | `main` | 7 (6 files / 1 dirs) | [link](https://—) | [browse](https://github.com/skunkworks-academy/cdn/tree/main) |
| [cisco](https://github.com/skunkworks-academy/cisco) | `main` | 2 (2 files / 0 dirs) | [link](https://—) | [browse](https://github.com/skunkworks-academy/cisco/tree/main) |
| [classrooms](https://github.com/skunkworks-academy/classrooms) | `main` | 65 (51 files / 14 dirs) | [link](https://skunkworks-academy.github.io/classrooms/) | [browse](https://github.com/skunkworks-academy/classrooms/tree/main) |
| [cld-uf-101](https://github.com/skunkworks-academy/cld-uf-101) | `main` | 10 (8 files / 2 dirs) | [link](https://skunkworks-academy.github.io/cld-uf-101/) | [browse](https://github.com/skunkworks-academy/cld-uf-101/tree/main) |
| [CO.LAB](https://github.com/skunkworks-academy/CO.LAB) | `master` | 82 (68 files / 14 dirs) | [link](https://www.redhat.com/en/open-source-stories/colab) | [browse](https://github.com/skunkworks-academy/CO.LAB/tree/master) |
| [comptia](https://github.com/skunkworks-academy/comptia) | `main` | 13 (11 files / 2 dirs) | [link](https://skunkworks-academy.github.io/comptia/) | [browse](https://github.com/skunkworks-academy/comptia/tree/main) |
| [copilot-cli-for-beginners](https://github.com/skunkworks-academy/copilot-cli-for-beginners) | `main` | 331 (270 files / 61 dirs) | [link](https://gh.io/copilot-cli-course) | [browse](https://github.com/skunkworks-academy/copilot-cli-for-beginners/tree/main) |
| [course-catalog](https://github.com/skunkworks-academy/course-catalog) | `main` | 62 (45 files / 17 dirs) | [link](https://—) | [browse](https://github.com/skunkworks-academy/course-catalog/tree/main) |
| [cp4ba-labs](https://github.com/skunkworks-academy/cp4ba-labs) | `main` | 1,395 (1,131 files / 264 dirs) | [link](https://—) | [browse](https://github.com/skunkworks-academy/cp4ba-labs/tree/main) |
| [CSES-01](https://github.com/skunkworks-academy/CSES-01) | `main` | 89 (75 files / 14 dirs) | [link](https://skunkworks-academy.github.io/CSES-01/) | [browse](https://github.com/skunkworks-academy/CSES-01/tree/main) |
| [dashboard](https://github.com/skunkworks-academy/dashboard) | `main` | 16 (11 files / 5 dirs) | [link](https://skunkworksacademy.github.io/dashboard/) | [browse](https://github.com/skunkworks-academy/dashboard/tree/main) |
| [DataVault-EDW-Training](https://github.com/skunkworks-academy/DataVault-EDW-Training) | `main` | 3 (3 files / 0 dirs) | [link](https://—) | [browse](https://github.com/skunkworks-academy/DataVault-EDW-Training/tree/main) |
| [db2-summit-lab](https://github.com/skunkworks-academy/db2-summit-lab) | `main` | 998 (979 files / 19 dirs) | [link](https://—) | [browse](https://github.com/skunkworks-academy/db2-summit-lab/tree/main) |
| [DockSec](https://github.com/skunkworks-academy/DockSec) | `main` | 78 (68 files / 10 dirs) | [link](https://owasp.org/DockSec/) | [browse](https://github.com/skunkworks-academy/DockSec/tree/main) |
| [docs](https://github.com/skunkworks-academy/docs) | `main` | 31 (21 files / 10 dirs) | [link](https://docs.skunkworksacademy.com/) | [browse](https://github.com/skunkworks-academy/docs/tree/main) |
| [DonkAI](https://github.com/skunkworks-academy/DonkAI) | `main` | 82 (64 files / 18 dirs) | [link](https://—) | [browse](https://github.com/skunkworks-academy/DonkAI/tree/main) |
| [dp-300-database-administrator](https://github.com/skunkworks-academy/dp-300-database-administrator) | `master` | 71 (53 files / 18 dirs) | [link](https://microsoftlearning.github.io/dp-300-database-administrator/) | [browse](https://github.com/skunkworks-academy/dp-300-database-administrator/tree/master) |
| [dpg-610a](https://github.com/skunkworks-academy/dpg-610a) | `main` | 93 (70 files / 23 dirs) | [link](https://skunkworks-academy.github.io/dpg-610a/) | [browse](https://github.com/skunkworks-academy/dpg-610a/tree/main) |
| [faculty](https://github.com/skunkworks-academy/faculty) | `main` | 9 (8 files / 1 dirs) | [link](https://faculty.skunkworksacademy.com/) | [browse](https://github.com/skunkworks-academy/faculty/tree/main) |
| [financial-literacy](https://github.com/skunkworks-academy/financial-literacy) | `main` | 2 (2 files / 0 dirs) | [link](https://skunkworks-academy.github.io/financial-literacy/) | [browse](https://github.com/skunkworks-academy/financial-literacy/tree/main) |
| [fksmm](https://github.com/skunkworks-academy/fksmm) | `main` | 50 (37 files / 13 dirs) | [link](https://fksmm.skunkworksacademy.com/) | [browse](https://github.com/skunkworks-academy/fksmm/tree/main) |
| [google](https://github.com/skunkworks-academy/google) | `main` | 2 (2 files / 0 dirs) | [link](https://—) | [browse](https://github.com/skunkworks-academy/google/tree/main) |
| [ibm](https://github.com/skunkworks-academy/ibm) | `main` | 411 (349 files / 62 dirs) | [link](https://ibm.skunkworksacademy.com/) | [browse](https://github.com/skunkworks-academy/ibm/tree/main) |
| [instructors](https://github.com/skunkworks-academy/instructors) | `main` | 8 (7 files / 1 dirs) | [link](https://skunkworks-academy.github.io/instructors/) | [browse](https://github.com/skunkworks-academy/instructors/tree/main) |
| [jobs](https://github.com/skunkworks-academy/jobs) | `main` | 23 (19 files / 4 dirs) | [link](https://jobs.skunkworksacademy.com/) | [browse](https://github.com/skunkworks-academy/jobs/tree/main) |
| [labs](https://github.com/skunkworks-academy/labs) | `main` | 231 (177 files / 54 dirs) | [link](https://labs.skunkworksacademy.com/) | [browse](https://github.com/skunkworks-academy/labs/tree/main) |
| [labs-catalog](https://github.com/skunkworks-academy/labs-catalog) | `main` | 24 (18 files / 6 dirs) | [link](https://—) | [browse](https://github.com/skunkworks-academy/labs-catalog/tree/main) |
| [labs-guides](https://github.com/skunkworks-academy/labs-guides) | `main` | 31 (18 files / 13 dirs) | [link](https://—) | [browse](https://github.com/skunkworks-academy/labs-guides/tree/main) |
| [learn](https://github.com/skunkworks-academy/learn) | `main` | 46 (34 files / 12 dirs) | [link](http://learn.skunkworksacademy.com/) | [browse](https://github.com/skunkworks-academy/learn/tree/main) |
| [lms](https://github.com/skunkworks-academy/lms) | `main` | 2,350 (1,968 files / 382 dirs) | [link](https://skunkworks-academy.github.io/Roadmaps/) | [browse](https://github.com/skunkworks-academy/lms/tree/main) |
| [login](https://github.com/skunkworks-academy/login) | `main` | 2 (2 files / 0 dirs) | [link](https://login.skunkworksacademy.com/) | [browse](https://github.com/skunkworks-academy/login/tree/main) |
| [ls1607](https://github.com/skunkworks-academy/ls1607) | `main` | 122 (81 files / 41 dirs) | [link](https://skunkworks-academy.github.io/ls1607/) | [browse](https://github.com/skunkworks-academy/ls1607/tree/main) |
| [marketing](https://github.com/skunkworks-academy/marketing) | `main` | 102 (70 files / 32 dirs) | [link](https://marketing.skunkworksacademy.com/) | [browse](https://github.com/skunkworks-academy/marketing/tree/main) |
| [maximo-labs](https://github.com/skunkworks-academy/maximo-labs) | `main` | 2,553 (2,415 files / 138 dirs) | [link](https://—) | [browse](https://github.com/skunkworks-academy/maximo-labs/tree/main) |
| [MCT-User-Guide](https://github.com/skunkworks-academy/MCT-User-Guide) | `master` | 20 (12 files / 8 dirs) | [link](https://microsoftlearning.github.io/MCT-User-Guide/) | [browse](https://github.com/skunkworks-academy/MCT-User-Guide/tree/master) |
| [media](https://github.com/skunkworks-academy/media) | `main` | 34 (31 files / 3 dirs) | [link](https://media.skunkworksacademy.com/) | [browse](https://github.com/skunkworks-academy/media/tree/main) |
| [microsoft](https://github.com/skunkworks-academy/microsoft) | `main` | 405 (324 files / 81 dirs) | [link](https://microsoft.skunkworksacademy.com/) | [browse](https://github.com/skunkworks-academy/microsoft/tree/main) |
| [ms-102](https://github.com/skunkworks-academy/ms-102) | `main` | 16 (14 files / 2 dirs) | [link](https://skunkworks-academy.github.io/ms-102/) | [browse](https://github.com/skunkworks-academy/ms-102/tree/main) |
| [mslearn-github](https://github.com/skunkworks-academy/mslearn-github) | `main` | 62 (50 files / 12 dirs) | [link](https://microsoftlearning.github.io/mslearn-github) | [browse](https://github.com/skunkworks-academy/mslearn-github/tree/main) |
| [osint](https://github.com/skunkworks-academy/osint) | `main` | 64 (44 files / 20 dirs) | [link](https://osint.skunkworksacademy.com/) | [browse](https://github.com/skunkworks-academy/osint/tree/main) |
| [PL-300-Microsoft-Power-BI-Data-Analyst](https://github.com/skunkworks-academy/PL-300-Microsoft-Power-BI-Data-Analyst) | `Main` | 410 (370 files / 40 dirs) | [link](https://microsoftlearning.github.io/PL-300-Microsoft-Power-BI-Data-Analyst/) | [browse](https://github.com/skunkworks-academy/PL-300-Microsoft-Power-BI-Data-Analyst/tree/Main) |
| [PL-900-Microsoft-Power-Platform-Fundamentals](https://github.com/skunkworks-academy/PL-900-Microsoft-Power-Platform-Fundamentals) | `master` | 200 (194 files / 6 dirs) | [link](https://microsoftlearning.github.io/PL-900-Microsoft-Power-Platform-Fundamentals/) | [browse](https://github.com/skunkworks-academy/PL-900-Microsoft-Power-Platform-Fundamentals/tree/master) |
| [portal](https://github.com/skunkworks-academy/portal) | `main` | 243 (187 files / 56 dirs) | [link](https://portal.skunkworksacademy.com/) | [browse](https://github.com/skunkworks-academy/portal/tree/main) |
| [prod-101](https://github.com/skunkworks-academy/prod-101) | `main` | 73 (64 files / 9 dirs) | [link](https://skunkworks-academy.github.io/prod-101/) | [browse](https://github.com/skunkworks-academy/prod-101/tree/main) |
| [prompt](https://github.com/skunkworks-academy/prompt) | `main` | 3 (3 files / 0 dirs) | [link](https://—) | [browse](https://github.com/skunkworks-academy/prompt/tree/main) |
| [publish](https://github.com/skunkworks-academy/publish) | `main` | 17 (13 files / 4 dirs) | [link](https://publish.skunkworksacademy.com/) | [browse](https://github.com/skunkworks-academy/publish/tree/main) |
| [python](https://github.com/skunkworks-academy/python) | `main` | 8 (5 files / 3 dirs) | [link](https://skunkworks-academy.github.io/python/) | [browse](https://github.com/skunkworks-academy/python/tree/main) |
| [security](https://github.com/skunkworks-academy/security) | `main` | 62 (46 files / 16 dirs) | [link](http://security.skunkworksacademy.com/) | [browse](https://github.com/skunkworks-academy/security/tree/main) |
| [sso](https://github.com/skunkworks-academy/sso) | `main` | 2 (2 files / 0 dirs) | [link](https://sso.skunkworksacademy.com/) | [browse](https://github.com/skunkworks-academy/sso/tree/main) |
| [TeamGuide](https://github.com/skunkworks-academy/TeamGuide) | `main` | 23 (17 files / 6 dirs) | [link](https://skunkworksacademy.github.io/TeamGuide/) | [browse](https://github.com/skunkworks-academy/TeamGuide/tree/main) |
| [udemy](https://github.com/skunkworks-academy/udemy) | `main` | 8 (7 files / 1 dirs) | [link](https://—) | [browse](https://github.com/skunkworks-academy/udemy/tree/main) |
| [watsonx-genai-lab](https://github.com/skunkworks-academy/watsonx-genai-lab) | `main` | 76 (65 files / 11 dirs) | [link](https://ibm.github.io/watsonx-genai-lab) | [browse](https://github.com/skunkworks-academy/watsonx-genai-lab/tree/main) |
| [webspherelab](https://github.com/skunkworks-academy/webspherelab) | `main` | 1,288 (887 files / 401 dirs) | [link](https://—) | [browse](https://github.com/skunkworks-academy/webspherelab/tree/main) |
| [www](https://github.com/skunkworks-academy/www) | `main` | 825 (696 files / 129 dirs) | [link](https://www.skunkworksacademy.com/) | [browse](https://github.com/skunkworks-academy/www/tree/main) |
| [www-project-eks-goat](https://github.com/skunkworks-academy/www-project-eks-goat) | `main` | 45 (36 files / 9 dirs) | [link](https://eksgoat.peachycloudsecurity.com/) | [browse](https://github.com/skunkworks-academy/www-project-eks-goat/tree/main) |

## `www` root source tree

This is the complete tracked file/directory snapshot for the web gateway repository (825 source entries before the generated files below).

<details>
<summary>Expand full www tree</summary>

```text
_index.html
.DS_Store
.github
.github/dependabot.yml
.github/workflows
.github/workflows/apply-theme-assets.yml
.github/workflows/auto-fix-cld-uf-101-force.yml
.github/workflows/auto-fix-cld-uf-101.yml
.github/workflows/markdown-check.yml
.github/workflows/repair-academy-destinations.yml
.github/workflows/repository-health.yml
.github/workflows/site-quality-and-pages.yml
.github/workflows/site-release.yml
.github/workflows/ux-load-regression.yml
.gitignore
.nojekyll
.well-known
.well-known/microsoft-identity-association.json
404.html
about
about.html
about/index.html
activities
activities/hands-on-labs.md
adobe
adobe/index.html
adobe/index.html.bak-20260624-104719
ads.txt
advertising-disclosure.html
ai
ai/ai-bots-and-agents
ai/ai-bots-and-agents/index.html
ai/ai-bots-and-agents/index.html.bak-20260624-104719
ai/index.html
ai/index.html.bak-20260624-104719
ai/test
app-dev
app-dev/index.html
app-dev/index.html.bak-20260624-104719
assessments
assessments/lab-review-rubric.md
assessments/quiz.md
assets
assets/academy-ecosystem.css
assets/academy-ecosystem.js
assets/academy-navigation-loader.js
assets/academy-navigation.config.json
assets/academy-navigation.js
assets/course-catalog-renderer.js
assets/course-catalog.generated.js
assets/publisher.css
assets/publisher.js
assets/README.md
assets/skunkworks-design-system.css
assets/skunkworks-ui.js
assets/verified-domains.json
asterisk
asterisk/advanced-dial-plans.html
asterisk/assets
asterisk/assets/4.png
asterisk/assets/assignmnets.png
asterisk/assets/Asteisk PBX System.png
asterisk/assets/Asterisk and Telephony Integration.png
asterisk/assets/Asterisk Course Media.png
asterisk/assets/Asterisk Course Media.pptx
asterisk/assets/asterisk logo.png
asterisk/assets/asterisk-aro-in-action-dark.png
asterisk/assets/asterisk-aro-in-action.png
asterisk/assets/Asterisk.png
asterisk/assets/downloads-page.png
asterisk/assets/hello-world.png
asterisk/assets/README.md
asterisk/assets/tramsforming Communication with Asterisk & VoIP.png
asterisk/basic-voip-setup.html
asterisk/course-outline.md
asterisk/custom-voicemail-application.html
asterisk/index.html
asterisk/index.html.bak-20260624-104719
asterisk/installing-asterisk-and-basic-configuration.html
asterisk/LICENSE
asterisk/README.md
asterisk/troubleshooting-common-issues.html
asterisk/voip-phone-and-sip-configuration.html
audits
audits/2026-06-20-public-web-recon.md
audits/2026-06-26-organisation-site-hardening.md
audits/2026-07-04-global-navigation-completion-log.md
audits/2026-07-04-global-navigation-organisation-audit.md
audits/2026-07-05-global-brand-style-consolidation.md
authors
authors/raydo-matthee.html
automation
automation/index.html
automation/index.html.bak-20260624-104719
blockchaincourse
blockchaincourse/assessment.html
blockchaincourse/capstone.md
blockchaincourse/enrollment.html
blockchaincourse/exercises-data.js
blockchaincourse/feedback.html
blockchaincourse/index.html
blockchaincourse/index.html.bak-20260624-104719
blockchaincourse/script.js
blockchaincourse/styles.css
catalogue
catalogue/index.html
checkpoint
checkpoint/index.html
checkpoint/index.html.bak-20260624-104719
cisco
cisco/Cisco.png
cisco/index.html
cisco/index.html.bak-20260624-104719
cloud
cloud/index.html
cloud/index.html.bak-20260624-104719
CNAME
composer.json
composer.lock
comptia
comptia/a-plus.html
comptia/assets
comptia/assets/.sa
comptia/assets/a_Cyber_CompCert.svg
comptia/assets/a_Network_CompCert.svg
comptia/assets/CompTIA Logo SVG.svg
comptia/assets/CompTIA logo white.svg
comptia/assets/CompTIA_Logo WHITE.png
comptia/assets/CompTIA_Logo_Red_PNG Transparent Background.png
comptia/assets/CompTIA_Logo.eps
comptia/assets/CompTIA_Logo.png
comptia/assets/Essentials_AI for Marketing_CompCert.svg
comptia/assets/Essentials_AI for Sales_CompCert.svg
comptia/assets/Essentials_AI_CompCert.svg
comptia/assets/Essentials_Business_CompCert.svg
comptia/assets/Plus_A_Certification.svg
comptia/assets/Plus_DataSys_Certification.svg
comptia/assets/Plus_Server_Certification.svg
comptia/assets/Plus_Stackable_CCAP_Certification_Products.svg
comptia/assets/Plus_Stackable_CCAP_Certification.svg
comptia/assets/Plus_Stackable_CIOS_Certification_Products.svg
comptia/assets/Plus_Stackable_CIOS_Certification.svg
comptia/assets/Plus_Stackable_CLNP_Certification_Products.svg
comptia/assets/Plus_Stackable_CLNP_Certification.svg
comptia/assets/Plus_Stackable_CNIP_Certification_Products.svg
comptia/assets/Plus_Stackable_CNIP_Certification.svg
comptia/assets/Plus_Stackable_CNSP_Certification_Products.svg
comptia/assets/Plus_Stackable_CNSP_Certification.svg
comptia/assets/Plus_Stackable_CNVP_Certification.svg
comptia/assets/Plus_Stackable_CSAP_Certification.svg
comptia/assets/Plus_Stackable_CSCP_Certification_Products.svg
comptia/assets/Plus_Stackable_CSIS_Certification_Products.svg
comptia/assets/Plus_Stackable_CSIS_Certification.svg
comptia/assets/Plus_Stackable_CSSS_Certification.svg
comptia/assets/Plus_Tech_Certification.svg
comptia/assets/Pro_Cisco Networking_CompCert.svg
comptia/assets/Pro_CyberDefense_CompCert.svg
comptia/assets/Pro_DigitalLiteracy_CompCert.svg
comptia/assets/Pro_EthicalHacker_CompCert.svg
comptia/assets/Pro_MicrosoftExcel_CompCert.svg
comptia/assets/Pro_MicrosoftOffice_CompCert.svg
comptia/assets/Pro_PC_CompCert.svg
comptia/assets/Pro_WindowsClient_CompCert.svg
comptia/assets/Pro_WindowsHybridServer_II_CompCert.svg
comptia/assets/Xpert_CloudNetX_Certification.svg
comptia/assets/Xpert_Stackable_CSAE_Certification_Products.svg
comptia/assets/Xpert_Stackable_CSAE_Certification.svg
comptia/assets/Xpert_Stackable_CSIE_Certification_Products.svg
comptia/assets/Xpert_Stackable_CSIE_Certification.svg
comptia/cloud-plus.html
comptia/Comptia-logo.svg
comptia/cysa-plus.html
comptia/data-plus.html
comptia/index.html
comptia/index.html.bak-20260624-104719
comptia/linux-plus.html
comptia/network-plus.html
comptia/package.json
comptia/pentest-plus.html
comptia/project-plus.html
comptia/README.md
comptia/security-plus.html
comptia/tech-plus.html
contact.html
contact.php
cookie-policy.html
course-registration
course-registration/index.html
course-registration/index.html.bak-20260624-104719
course-registration/skunkworks-academy-cyber-security-training-email.html
course-registration/thank-you.html
course.yml
cpp
cpp/cpp_logo.svg
cpp/cpp-cpe-2024.html
cpp/favicon.svg
css
css/main.css
css/styles.css
data
data/index.html
data/index.html.bak-20260624-104720
devops-agile
devops-agile/index.html
devops-agile/index.html.bak-20260624-104720
docs
docs/api.md
docs/facilitation-plan.md
docs/global-navigation.md
docs/instructor-guide.md
docs/student-guide.md
editorial-policy.html
faculty
faculty/069E9310-26B5-4958-B65F-209CBA8E982C.png
faculty/6D6729F1-E6DA-4F00-92D8-04A74A6CDB61.png
faculty/A98BFE31-A3E6-44DE-AE6B-C102D1D1CF22.png
faculty/assets
faculty/assets/css
faculty/assets/css/skunkworks-design-system.css
faculty/assets/js
faculty/assets/js/skunkworks-ui.js
faculty/assets/portraits
faculty/assets/portraits/analita-goncalves.svg
faculty/assets/portraits/john-lewis.svg
faculty/assets/portraits/maria-dercksen.svg
faculty/assets/portraits/raydo-matthee.svg
faculty/B343F691-D8C3-44BA-AA41-6F781C37C0FA.png
faculty/bradley-nel.jpg
faculty/brandon-mloyi.jpg
faculty/clifton-molele.jpg
faculty/dan-opiyo.jpg
faculty/DESIGN_SYSTEM.md
faculty/emmanuel-okechukwu.jpg
faculty/index.html
faculty/index.html.bak-20260624-104720
faculty/jolandi-van-heerden.jpg
faculty/malusi-mthiyane.jpg
faculty/selaelo-langa.jpg
faculty/templates
faculty/templates/page-shell-fragment.html
faculty/templates/portal-form-fragment.html
faculty/zamri-marais.jpg
forms
forms/index.html
forms/index.html.bak-20260624-104720
forms/Skunkworks_Academy_Accounts_Payable_Policy.html
forms/Skunkworks_Academy_Global_Vendor_Form.html
forms/Skunkworks_Academy_Instructor_Handbook.html
forms/Skunkworks_Academy_Instructor_Task_Order_Template.html
forms/Skunkworks_Academy_NDA_Template.html
forms/Skunkworks_Academy_Subcontractor_Agreement_Template.html
github
github/gh-logo.png
github/index.com
github/index.html
github/index.html.bak-20260624-104720
google
google/Google_logo.png
google/icons8-google.svg
google/index.html
google/index.html.bak-20260624-104720
guides
guides/ai-enabled-learning-path.html
guides/cloud-certification-roadmap.html
guides/index.html
guides/learning-readiness-canvas.html
guides/zero-trust-lab-controls.html
hashicorp
hashicorp/HashiCorp_Logo.png
hashicorp/Hashicorp-Horizontal_onDark.png
hashicorp/Hashicorp-Horizontal_onDark.svg
hashicorp/Hashicorp-Horizontal_onLight.png
hashicorp/Hashicorp-Horizontal_onLight.svg
hashicorp/Hashicorp-Mark_onDark.png
hashicorp/Hashicorp-Mark_onDark.svg
hashicorp/Hashicorp-Mark_onLight.png
hashicorp/Hashicorp-Mark_onLight.svg
hashicorp/Hashicorp-Vault_onDark.png
hashicorp/Hashicorp-Vault_onDark.svg
hashicorp/Hashicorp-Vault_onLight.png
hashicorp/Hashicorp-Vault_onLight.svg
hashicorp/Hashicorp-Vertical_onDark.png
hashicorp/Hashicorp-Vertical_onDark.svg
hashicorp/Hashicorp-Vertical_onLight.png
hashicorp/Hashicorp-Vertical_onLight.svg
hashicorp/HCP-Vault_onDark.png
hashicorp/HCP-Vault_onDark.svg
hashicorp/HCP-Vault_onLight.png
hashicorp/HCP-Vault_onLight.svg
hashicorp/HCP-Vault-Dedicated_onDark.png
hashicorp/HCP-Vault-Dedicated_onDark.svg
hashicorp/HCP-Vault-Dedicated_onLight.png
hashicorp/HCP-Vault-Dedicated_onLight.svg
hashicorp/HCP-Vault-Radar_onDark.png
hashicorp/HCP-Vault-Radar_onDark.svg
hashicorp/HCP-Vault-Radar_onLight.png
hashicorp/HCP-Vault-Radar_onLight.svg
hashicorp/HCP-Vault-Secrets_onDark.png
hashicorp/HCP-Vault-Secrets_onDark.svg
hashicorp/HCP-Vault-Secrets_onLight.png
hashicorp/HCP-Vault-Secrets_onLight.svg
hashicorp/index.html
hashicorp/index.html.bak-20260624-104720
hashicorp/README.md
hashicorp/Vault_onDark.png
hashicorp/Vault_onDark.svg
hashicorp/Vault_onLight.png
hashicorp/Vault_onLight.svg
hashicorp/Vault-LogoMark_onDark.png
hashicorp/Vault-LogoMark_onDark.svg
hashicorp/Vault-LogoMark_onLight.png
hashicorp/Vault-LogoMark_onLight.svg
ibm
ibm/blue uni.jfif
ibm/carbon.html
ibm/cl207-u01.html
ibm/cl207-u02.html
ibm/cl207-u03.html
ibm/cl207-u04.html
ibm/cl207-u05.html
ibm/cl207-u06.html
ibm/cl207-u07.html
ibm/cl207-u08.html
ibm/cl207-u09.html
ibm/cl207-u10.html
ibm/csm
ibm/csm/IBM Control Services Manager_loop slide deck.pptx
ibm/csm/IBM Control Services Manager.pptx
ibm/db2
ibm/db2.html
ibm/db2/cla96
ibm/db2/cla96/analytics.html
ibm/db2/cla96/app.js
ibm/db2/cla96/assessment.html
ibm/db2/cla96/data
ibm/db2/cla96/data/part1-data.js
ibm/db2/cla96/data/part2-data.js
ibm/db2/cla96/data/part3-data.js
ibm/db2/cla96/data/part4-data.js
ibm/db2/cla96/index.html
ibm/db2/cla96/index.html.bak-20260624-104720
ibm/db2/cla96/part-1.html
ibm/db2/cla96/part-2.html
ibm/db2/cla96/part-3.html
ibm/db2/cla96/part-4.html
ibm/db2/cla96/quiz-engine.js
ibm/db2/cla96/scorm-api.js
ibm/db2/cla96/styles.css
ibm/db2/CLA96G_Unified_LMS_SCORMReady
ibm/db2/CLA96G_Unified_LMS_SCORMReady.zip
ibm/db2/CLA96G_Unified_LMS_SCORMReady/analytics.html
ibm/db2/CLA96G_Unified_LMS_SCORMReady/app.js
ibm/db2/CLA96G_Unified_LMS_SCORMReady/assessment.html
ibm/db2/CLA96G_Unified_LMS_SCORMReady/data
ibm/db2/CLA96G_Unified_LMS_SCORMReady/data/part1-data.js
ibm/db2/CLA96G_Unified_LMS_SCORMReady/data/part2-data.js
ibm/db2/CLA96G_Unified_LMS_SCORMReady/data/part3-data.js
ibm/db2/CLA96G_Unified_LMS_SCORMReady/data/part4-data.js
ibm/db2/CLA96G_Unified_LMS_SCORMReady/index.html
ibm/db2/CLA96G_Unified_LMS_SCORMReady/index.html.bak-20260624-104720
ibm/db2/CLA96G_Unified_LMS_SCORMReady/part-1.html
ibm/db2/CLA96G_Unified_LMS_SCORMReady/part-2.html
ibm/db2/CLA96G_Unified_LMS_SCORMReady/part-3.html
ibm/db2/CLA96G_Unified_LMS_SCORMReady/part-4.html
ibm/db2/CLA96G_Unified_LMS_SCORMReady/quiz-engine.js
ibm/db2/CLA96G_Unified_LMS_SCORMReady/scorm-api.js
ibm/db2/CLA96G_Unified_LMS_SCORMReady/styles.css
ibm/db2/Db2 12 for zOS Classroom notes.png
ibm/db2/DB2 on Linux Workshop
ibm/db2/DB2 on Linux Workshop/assessment.html
ibm/db2/DB2 on Linux Workshop/cl207-u01 1.html
ibm/db2/DB2 on Linux Workshop/cl207-u01.html
ibm/db2/DB2 on Linux Workshop/cl207-u02.html
ibm/db2/DB2 on Linux Workshop/cl207-u03 1.html
ibm/db2/DB2 on Linux Workshop/cl207-u03.html
ibm/db2/DB2 on Linux Workshop/cl207-u04 1.html
ibm/db2/DB2 on Linux Workshop/cl207-u04.html
ibm/db2/DB2 on Linux Workshop/cl207-u05 1.html
ibm/db2/DB2 on Linux Workshop/cl207-u05.html
ibm/db2/DB2 on Linux Workshop/cl207-u06.html
ibm/db2/DB2 on Linux Workshop/cl207-u07.html
ibm/db2/DB2 on Linux Workshop/cl207-u08.html
ibm/db2/DB2 on Linux Workshop/cl207-u09.html
ibm/db2/DB2 on Linux Workshop/cl207-u10.html
ibm/db2/DB2 on Linux Workshop/DB2 - Zero to Hero.md
ibm/db2/DB2 on Linux Workshop/favicon.ico
ibm/db2/DB2 on Linux Workshop/index.html
ibm/db2/DB2 on Linux Workshop/index.html.bak-20260624-104720
ibm/db2/DB2 on Linux Workshop/part-1.html
ibm/db2/DB2 on Linux Workshop/part-2.html
ibm/db2/DB2 on Linux Workshop/part-3.html
ibm/db2/DB2 on Linux Workshop/part-4.html
ibm/db2/DB2 on Linux Workshop/Unit 3 - Demonstration 1 -  Create a new Db2 instance.md
ibm/db2/DB2 on Linux Workshop/Unit 4 - Demonstration 1 -  Creating databases and data placement.md
ibm/db2/DB2 on Linux Workshop/Unit 5 - Creating Database Objects - Demonstration.md
ibm/db2/DB2 on Mainframe
ibm/db2/DB2 on Mainframe/Classroom Notes.pdf
ibm/db2/DB2 on Mainframe/IBM DB2 12 For zOS Classroom Notes.md
ibm/db2/DB2 on Mainframe/IBM DB2 12 For zOS Classroom Notes.pdf
ibm/db2/DB2 on Mainframe/IBM Remote Lab notification.md
ibm/db2/DB2 on Mainframe/Unit 1 Slide 10.md
ibm/db2/DB2 on Mainframe/unit 1 slide 12.md
ibm/db2/DB2 on Mainframe/Unit 1 slide 9.md
ibm/db2/Db2 Sales Foundation.md
ibm/db2/db2.html
ibm/db2/Pasted image 20240628030202.png
ibm/db2/Pasted image 20240628030250.png
ibm/FICON-301.html
ibm/IBCPI-OC-01.html
ibm/IBM_svg.png
ibm/ibm-aside-image-or-logo.png
ibm/ibm-svg.svg
ibm/ibm.jsx
ibm/icb-bootcamp.html
ibm/index.html
ibm/index.html.bak-20260624-104720
ibm/maximo
ibm/maximo/Courses Outline.md
ibm/maximo/IBM Certified Administrator - Maximo Manage v8.x Exam Preparation and Certification Learning Path.pdf
ibm/maximo/IBM Maximo
ibm/maximo/IBM Maximo Manage v8.x Certified Administrator - Preparation and Certification Learning Path.md
ibm/maximo/IBM Maximo/Commercials.pdf
ibm/maximo/IBM Maximo/Course Outline.pdf
ibm/maximo/Maximo.pdf
ibm/maximo/Preparation and Certification Learning Path.html
ibm/maximo/Preparation and Certification Learning Path.md
ibm/maximo/Preparation and Certification Learning Path.pdf
ibm/safer-payments
ibm/safer-payments/ibm_safer_payments_training_roadmap.md.pdf
ibm/safer-payments/Safer Payments
ibm/safer-payments/Safer Payments/ibm_safer_payments_training_roadmap.md.pdf
ibm/safer-payments/Untitled.md
ibm/scbb-ot10.html
ibm/spectrum-protect
ibm/spectrum-protect/Examination Preparation Guide.md
ibm/spectrum-protect/Lab Setup Guide.md
ibm/spectrum-protect/Mock Test - C1000-137.md
ibm/spectrum-protect/Spectrum Protect 8.12 - TS619.pdf
ibm/spectrum-protect/The IBM Certified Deployment Professional - Spectrum Protect V8.1.12 Certification Examination Preparation Guide.md
ibm/spectrum-protect/TSP13
ibm/spectrum-protect/TSP13/0. IBM Spectrum Protect Plus 10.1.8 Implementation and Administration.md
ibm/spectrum-protect/TSP13/TSP13.canvas
ibm/spectrum-protect/Untitled.md
images
images/2pexels-adam-sondel-381265-20432872.jpg
images/Cisco.png
images/Comptia-logo.png
images/favicon-black.png
images/favicon-white.png
images/gh-logo.png
images/Google_2015_logo.png
images/HashiCorp_Logo.png
images/ibm-aside-image-or-logo.png
images/lenovo logo.png
images/Lenovo_logo_2015.png
images/logo.png
images/microsoft logo.png
images/paloalto_logo.png
images/pexels-adam-sondel-381265-20432872.jpg
images/pexels-cup-of-couple-6177682.jpg
images/pexels-enginakyurt-2952871.jpg
images/pexels-julia-m-cameron-4144144.jpg
images/pexels-julia-m-cameron-4144225.jpg
images/pexels-mikhail-nilov-7583935.jpg
images/pexels-mikhail-nilov-7594479.jpg
images/pexels-shvets-production-7516348.jpg
images/red hat logo.webp
images/Red_Hat_Logo_2019.svg
images/Red_Hat-Logo.png
images/sage logo.png
images/Salesforce_logo.png
images/SAP_2011_logo.png
index.html
index.html.bak-20260624-104720
index.js
instructor-led
instructor-led/index.html
iso
iso/index.html
iso/index.html.bak-20260624-104720
learning-paths
learning-paths/devops-zero2hero.html
LICENSE
llms.txt
mainframe
mainframe/index.html
mainframe/index.html.bak-20260624-104720
microsoft
microsoft-identity-association.json
microsoft/ai-platform.html
microsoft/assets
microsoft/assets/css
microsoft/assets/css/styles.css
microsoft/assets/js
microsoft/assets/js/app.js
microsoft/data-analytics.html
microsoft/data-platform.html
microsoft/hero.png
microsoft/images
microsoft/images/hero.png
microsoft/images/logo.png
microsoft/images/ms-hero.png
microsoft/images/ms-logo.png
microsoft/images/teste.tst
microsoft/index.html
microsoft/index.html.bak-20260624-104720
microsoft/index1.html
microsoft/japanese.html
microsoft/microsoft logo.png
microsoft/microsoft-365.html
microsoft/microsoft-azure.html
microsoft/microsoft-dynamics-365-business-edition.html
microsoft/microsoft-dynamics-365.html
microsoft/microsoft-dynamics.html
microsoft/microsoft-endpoint-configuration-manager.html
microsoft/microsoft-office-365.html
microsoft/microsoft-office.html
microsoft/microsoft-products.html
microsoft/microsoft-sharepoint.html
microsoft/microsoft-skype-for-business.html
microsoft/microsoft-sql-server.html
microsoft/microsoft-system-center.html
microsoft/microsoft-visual-studio.html
microsoft/microsoft-windows-server.html
microsoft/non-microsoft-products-and-technologies.html
microsoft/power-bi.html
microsoft/power-platform.html
microsoft/preview.html
microsoft/README.md
microsoft/security.html
microsoft/style.css
microsoft/teams.html
microsoft/training
microsoft/training/azure
microsoft/training/azure/index.html
microsoft/training/azure/index.html.bak-20260624-104720
microsoft/waypoint.html
microsoft/web-development.html
microsoft/windows-server-technologies.html
microsoft/windows.html
middleware
middleware/index.html
middleware/index.html.bak-20260624-104720
MIGRATION_PLAN.md
nbproject
nbproject/project.properties
nbproject/project.xml
networking
networking/index.html
networking/index.html.bak-20260624-104720
occupational
occupational/index.html
occupational/index.html.bak-20260624-104720
owasp
owasp/6.jpeg
owasp/6.png
owasp/ANN.md
owasp/Announcements.md
owasp/assessment.pdf
owasp/assessment.png
owasp/assessment.pspimage
owasp/Course Cover OWASP TOP 10.png
owasp/index.html
owasp/index.html.bak-20260624-104720
owasp/Introduction to Application Security.md
owasp/legitimate website.png
owasp/NIST.SP.800-61r2.pdf
owasp/OWASP Top Ten Web Vulnerabilities and the Role of rel=noopener noreferrer (3).png
owasp/OWASP Top Ten Web Vulnerabilities and the Role of rel=noopener noreferrer.svg
owasp/owasp-401.html
owasp/owasp-banner.svg
owasp/README.md
owasp/SANS Dev522.pdf
owasp/SCP-OWASP10-2024_PKG.md
owasp/Secure Coding Knowledge Assessment - From Theory to Practice.pdf
owasp/Student Course Guide.pdf
owasp/student course guide.png
owasp/student course guide.pspimage
owasp/Understanding the Importance of rel=_noopener noreferrer_ for External Links.webp
package-lock.json
package.json
paloalto
paloalto/index.html
paloalto/index.html.bak-20260624-104720
paloalto/paloalto_logo.png
partners
partners/cisco.html
partners/comptia.html
partners/github.html
partners/google.html
partners/hashicorp.html
partners/ibm.html
partners/images
partners/images/Cisco.png
partners/images/Comptia-logo.png
partners/images/gh-logo.png
partners/images/Google_2015_logo.png
partners/images/HashiCorp_Logo.png
partners/images/ibm-aside-image-or-logo.png
partners/images/lenovo logo.png
partners/images/Lenovo_logo_2015.png
partners/images/microsoft logo.png
partners/images/paloalto_logo.png
partners/images/red hat logo.webp
partners/images/Red_Hat_Logo_2019.svg
partners/images/Red_Hat-Logo.png
partners/images/sage logo.png
partners/images/Salesforce_logo.png
partners/images/SAP_2011_logo.png
partners/microsoft.html
partners/paloalto.html
partners/red hat.html
partners/sage.html
partners/salesforce.html
partners/sap.html
plans-and-purchases
plans-and-purchases/index.html
pricing.index.html
privacy.html
profile
profile/README.md
python
python/activities.html
python/activities1.html
python/app.py
python/assessment.html
python/capstone.md
python/code-review.html
python/coding-challenge.html
python/data-lab.html
python/discussion-forum.html
python/enrollment.html
python/exercises-data.js
python/feedback.html
python/file operations.md
python/hardware-simulator.html
python/idea-board.html
python/index.html
python/index.html.bak-20260624-104720
python/index2.html
python/lab exercises demo1.md
python/project-showcase.html
python/README.md
python/script.js
python/styles.css
python/terms.html
python/week 1 theory.md
python/week 6 theory.md
python/week 7 theory.md
python/week1-theory.html
python/week2-theory.html
python/week3-theory.html
python/week4-theory.html
python/week5theory.md
python/week6_strings.md
README.md
redhat
redhat/drools-8.html
redhat/index.html
redhat/index.html.bak-20260624-104720
repositories
repositories/index.html
robots.txt
sage
sage/index.html
sage/index.html.bak-20260624-104720
sage/sage logo.png
salesforce
salesforce/index.html
salesforce/index.html.bak-20260624-104720
salesforce/Salesforce_logo.png
sap
sap/index.html
sap/index.html.bak-20260624-104720
sap/SAP_2011_logo.png
scripts
scripts/audit-global-brand.mjs
scripts/audit-site.mjs
scripts/repair-course-catalog.mjs
scripts/ux-load-test.mjs
scripts/validate-course-catalog.mjs
scripts/validate-publisher-readiness.mjs
scripts/validate-self-paced.mjs
security
SECURITY.md
security/index.html
security/index.html.bak-20260624-104720
self-paced
self-paced/assessments
self-paced/assessments/capstone-project.md
self-paced/assessments/final-knowledge-check.md
self-paced/assessments/grading-guide.md
self-paced/assessments/module-knowledge-checks.md
self-paced/assets
self-paced/assets/course.css
self-paced/assets/course.js
self-paced/assets/reader.js
self-paced/catalog.json
self-paced/claude
self-paced/claude/cld-dev-201
self-paced/claude/cld-dev-201/index.html
self-paced/claude/cld-dev-201/index.html.bak-20260624-104720
self-paced/claude/cld-uf-101
self-paced/claude/cld-uf-101/assets
self-paced/claude/cld-uf-101/assets/app.js
self-paced/claude/cld-uf-101/assets/styles.css
self-paced/claude/cld-uf-101/index.html
self-paced/claude/cld-uf-101/index.html.bak-20260624-104720
self-paced/course-map.yml
self-paced/index.html
self-paced/json-course-interface-design
self-paced/json-course-interface-design/index.html
self-paced/lms
self-paced/lms/implementation-guide.md
self-paced/lms/imsmanifest.xml
self-paced/lms/scorm-readme.md
self-paced/microsoft
self-paced/microsoft-exchange-online-bulk-mail-management
self-paced/microsoft-exchange-online-bulk-mail-management/index.html
self-paced/microsoft/d365-ce-bp-101
self-paced/microsoft/d365-ce-bp-101/assets
self-paced/microsoft/d365-ce-bp-101/assets/app.js
self-paced/microsoft/d365-ce-bp-101/assets/styles.css
self-paced/microsoft/d365-ce-bp-101/index.html
self-paced/microsoft/ms-mp-bp-101
self-paced/microsoft/ms-mp-bp-101/assets
self-paced/microsoft/ms-mp-bp-101/assets/app.js
self-paced/microsoft/ms-mp-bp-101/assets/styles.css
self-paced/microsoft/ms-mp-bp-101/index.html
self-paced/microsoft/ms-saas-plan-101
self-paced/microsoft/ms-saas-plan-101/assets
self-paced/microsoft/ms-saas-plan-101/assets/app.js
self-paced/microsoft/ms-saas-plan-101/assets/styles.css
self-paced/microsoft/ms-saas-plan-101/index.html
self-paced/modules
self-paced/modules/module-01-introduction.md
self-paced/modules/module-02-getting-started.md
self-paced/modules/module-03-core-use-cases.md
self-paced/modules/module-04-effective-prompting.md
self-paced/modules/module-05-documents-files.md
self-paced/modules/module-06-projects-memory.md
self-paced/modules/module-07-best-practices-pitfalls.md
self-paced/modules/module-08-capstone-qa.md
self-paced/mongodb-self-paced-technical-course
self-paced/mongodb-self-paced-technical-course/index.html
self-paced/reader.html
self-paced/README.md
self-paced/resources
self-paced/resources/ai-use-policy-template.md
self-paced/resources/learner-workbook.md
self-paced/resources/prompt-library.md
self-paced/resources/verification-checklist.md
self-paced/secure-coding-owasp-top-10
self-paced/secure-coding-owasp-top-10/index.html
self-paced/security
self-paced/security/.md
self-paced/security/index.html
self-paced/security/skw-owasp-top10-2025
self-paced/security/skw-owasp-top10-2025/.nojekyll
self-paced/security/skw-owasp-top10-2025/assets
self-paced/security/skw-owasp-top10-2025/assets/course-content.js
self-paced/security/skw-owasp-top10-2025/assets/course-labs.js
self-paced/security/skw-owasp-top10-2025/assets/course-runtime.js
self-paced/security/skw-owasp-top10-2025/assets/course.css
self-paced/security/skw-owasp-top10-2025/CHANGELOG.md
self-paced/security/skw-owasp-top10-2025/index.html
self-paced/security/skw-owasp-top10-2025/README.md
self-paced/security/skw-owasp-top10-2025/references.md
self-paced/security/skw-owasp-top10-2025/vulnerable-app
self-paced/security/skw-owasp-top10-2025/vulnerable-app/package.json
self-paced/security/skw-owasp-top10-2025/vulnerable-app/README.md
self-paced/security/skw-owasp-top10-2025/vulnerable-app/server.js
SITEMAP-PUBLIC-REPOSITORY-FILES-01.tsv
SITEMAP-PUBLIC-REPOSITORY-FILES-02.tsv
SITEMAP.md
sitemap.xml
slides
slides/README.md
softskills
softskills/index.html
softskills/index.html.bak-20260624-104720
storage
storage/index.html
storage/index.html.bak-20260624-104720
subdomains
subdomains/badging
subdomains/badging/Test
subdomains/blog
subdomains/blog/index.html
subdomains/blog/index.html.bak-20260624-104720
subdomains/docs
subdomains/docs/index.html
subdomains/docs/index.html.bak-20260624-104720
subdomains/jobs
subdomains/jobs/index.html
subdomains/jobs/index.html.bak-20260624-104720
subdomains/labs
subdomains/labs/Test
subdomains/portal
subdomains/portal/Test
subdomains/prompt
subdomains/prompt/index.html
subdomains/prompt/index.html.bak-20260624-104720
subdomains/publish
subdomains/publish/index.html
subdomains/publish/index.html.bak-20260624-104720
subdomains/README.md
terms
terms.html
terms/index.html
webinars
webinars/workbooks
webinars/workbooks/pp-101
webinars/workbooks/pp-101/api-handler.js
webinars/workbooks/pp-101/config.js
webinars/workbooks/pp-101/index.html
webinars/workbooks/pp-101/README.md
website
website/index.html
website/index.html.bak-20260624-104720
website/self-paced.html
whatsapp
whatsapp/Establishing and maintaining a WhatsApp community - planning.docx
whatsapp/Establishing and maintaining a WhatsApp community - planning.pdf
whatsapp/index.html
whatsapp/index.html.bak-20260624-104720
workbooks
workbooks/README.md
```

</details>

## Private repository handling

The audit included all 10 private repositories for aggregate size, activity and repository-state checks. Their names, directory structure, files, configuration and inferred endpoints are not reproduced in this public repository. Use the GitHub organisation’s private repository view for authorised internal review.

## Follow-up actions

1. Choose one canonical host (`skunkworksacademy.com` or `www.skunkworksacademy.com`) and make DNS/CDN redirects, canonical tags, Open Graph URLs, `robots.txt`, sitemap URLs and Search Console properties agree.
2. Give every deployed subdomain its own `robots.txt` and same-host sitemap; submit each property separately in Search Console.
3. Add canonical and robots directives consistently to the remaining static HTML paths, especially alternate directory/index routes and workflow pages.
4. Review stale public repositories before presenting them as active Academy learning destinations.
5. Keep this manifest current by regenerating it after repository, domain or deployment changes.
