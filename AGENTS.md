# Agentic Resume ATS CLI - Agent & Maintainer Guidelines

## Overview
This repository provides an **Agent-Native CLI & Autonomous Career Intelligence Engine** for **MUHAMMAD IRFAN FAHMI BIN SAMSUL KAMAR**. It enables AI agents to evaluate candidate fit, automate job tracking, sync multi-portal connectors, generate ATS-verified resumes, and maintain an offline feedback issue system.

## AI-Native CLI Compliance Standard
This CLI complies with **Agent-Native Level Certification (Agent CLI Spec v0.1)**.

### Core Execution Rules
1. **JSON Output by Default:** All subcommands output structured JSON to `stdout` by default. No `--json` flag is required.
2. **Human Interface (`--human`):** Pass `--human` to enable rich terminal formatting, tables, panels, and colored gauges via the `rich` library.
3. **Stderr for Logs:** Non-data progress logs, warnings, and error messages go strictly to `stderr`.
4. **Fail-Fast Error Format:** On error, write JSON to `stderr` and exit with non-zero exit code:
   ```json
   {
     "error": true,
     "code": "MISSING_PARAM",
     "message": "Parameter --title is required",
     "suggestion": "Pass --title '<Job Title>' to specify the position."
   }
   ```
5. **No Interactive Prompts on Error:** Never prompt interactively during command failures.

### Exit Codes
- `0`: Success
- `1`: General execution failure
- `2`: Missing or invalid parameter usage
- `10`: Authentication / authorization error
- `20`: Resource or record not found
- `30`: Conflict or precondition failure

### Reserved Flags
- `--agent`: Explicit JSON output mode (default).
- `--human`: Human-friendly Rich terminal UI.
- `--brief`: One-paragraph identity summary (`agent/brief.md`).
- `--help`: Structured JSON command schema (or Rich help in `--human` mode).
- `--version`: Output semver version string (`1.0.0`).
- `--yes`: Confirm destructive operations.
- `--fields`: Comma-separated list of JSON output fields to include.

## Quick CLI Reference Commands

```bash
# Briefing
python cli.py --brief

# ATS Evaluation
python cli.py ats evaluate --title "Network Engineer" --desc "Cisco CCNA OSPF VLAN" --company "TechNova"

# Resume Verification
python cli.py ats verify

# Resume Generation
python cli.py resume generate --format md --out resume/resume.md

# Job Application Management
python cli.py job list
python cli.py job add --title "DevOps Engineer" --company "CloudCorp" --url "https://example.com" --email "hr@cloudcorp.com" --desc "AWS Linux Python"

# Multi-Portal Sync
python cli.py portal sync --portal all

# Master Excel Export
python cli.py tracker export

# Offline Feedback Issues
python cli.py issue create --title "Anomalous match score" --category bug --desc "Score dropped unexpectedly."
python cli.py issue list --status open
python cli.py issue resolve --id ISSUE-1 --notes "Fixed keyword dictionary."

# Autonomous Agent Execution Loop
python cli.py agent run
```

## Directory Structure
- `agent/`: Agent self-description (`brief.md`), behavior constraints (`rules/`), and skill definitions (`skills/`).
- `src/`: Core Python modules (`cli.py`, `agent.py`, `candidate.py`, `database.py`, `excel_tracker.py`, `portals.py`, `issue.py`, `models.py`).
- `data/`: Local SQLite database (`job_agent.db`) and master spreadsheet (`JobTracker.xlsx`).
- `resume/`: 100% ATS verified documents (`resume.md`, `resume.html`, `resume.txt`, `verify_ats.py`).
- `tests/`: Automated unit test suite (`test_candidate.py`, `test_database.py`, `test_portals.py`, `test_cli.py`, `test_issue.py`).
- `web/`: Portfolio & Web applications (`index.html`, `portfolio.html`).
