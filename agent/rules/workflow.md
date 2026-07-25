---
name: workflow-rules
description: Step-by-step workflow guide for AI agents interacting with the Career Intelligence CLI.
---

# Workflow Rules

## Step-by-Step Execution Sequence

1. **Discovery & Briefing:**
   - Run `python cli.py --brief` to load agent identity and candidate profile metadata into context.
   - Run `python cli.py --help` (JSON mode) to inspect available subcommands and flags.

2. **Job Description Evaluation:**
   - Run `python cli.py ats evaluate --title "<Title>" --desc "<Description>" --company "<Company>"`
   - Read the structured JSON response:
     - Check `ats_breakdown.final_score` (Target: >= 40.0 for basic fit, >= 65.0 for high fit).
     - Inspect `skills_gap.missing_skills` to report missing technical requirements.
     - Review `salary_pred` (likely_salary, currency) and `interview_prob.rating`.

3. **Job Record Persistence:**
   - Run `python cli.py job add --title "<Title>" --company "<Company>" --url "<URL>" --email "<HR Email>" --desc "<Desc>"`
   - Record the unique `job_id` returned.

4. **Resume & Cover Letter Generation:**
   - Run `python cli.py resume generate --format md --out resume/resume.md` to update ATS resume.

5. **Application Execution & Portal Sync:**
   - Run `python cli.py portal sync --portal all` or `python cli.py job apply --id <job_id>` to initiate state machine processing.

6. **Excel Tracker Synchronization:**
   - Run `python cli.py tracker export` to sync SQLite database state to `JobTracker.xlsx`.

7. **Error & Issue Reporting:**
   - If an error occurs, inspect stderr JSON: `{"error": true, "code": "...", "message": "...", "suggestion": "..."}`.
   - File an issue via `python cli.py issue create --title "<Summary>" --category bug --desc "<Details>"`.
