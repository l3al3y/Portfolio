---
name: trigger-rules
description: Defines when an AI agent should invoke the Career Intelligence & ATS CLI tool.
---

# Trigger Rules

## When to Invoke
- **ATS Evaluation:** When assessing how well a candidate profile matches a specific job description (`ats evaluate`).
- **Resume Verification:** When validating keyword density and ATS compliance against the 42-keyword standard (`ats verify`).
- **Resume Generation:** When building customized ATS-formatted resumes in HTML, Markdown, Plain Text, or JSON (`resume generate`).
- **Job Tracking & Management:** When querying, adding, or updating job applications in the local SQLite audit database (`job list`, `job add`, `job status`).
- **Portal Syncing:** When launching multi-portal application connectors for MYFutureJobs, MauKerja, JobStreet, or LinkedIn (`portal sync`).
- **Master Excel Export:** When exporting or updating `JobTracker.xlsx` multi-sheet tracker (`tracker export`).
- **Offline Issue & Feedback:** When recording feedback, logging agent failures, or tracking feature requests offline (`issue create`, `issue list`, `issue resolve`).
- **Agent Skill Discovery:** When querying supported agent capabilities (`skills list`, `skills show`).

## When NOT to Invoke
- Do NOT invoke for direct live production SMTP emails unless `--email-dry-run=false` is explicitly requested by the user.
- Do NOT perform destructive database purges without passing the `--yes` confirmation flag.
