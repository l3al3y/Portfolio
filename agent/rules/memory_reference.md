---
name: memory-reference-rules
description: Mandates referencing candidate project memory and repository tree at the start of any conversation.
---

# Memory & Project Tree Initialization Rule

## Purpose
Establishes `PROJECT_MEMORY.md` as the repository's single source of truth for candidate background, credentials, capstone benchmarks, and system configurations across all agent execution sessions.

## Mandatory Startup Procedure
1. **Read Single Source of Truth**: At the beginning of every new task or conversation session, the AI agent MUST read [PROJECT_MEMORY.md](file:///D:/Resume%20ats%20cli/PROJECT_MEMORY.md) completely before forming hypotheses or making architectural decisions.
2. **Inspect Repository Structure**: The AI agent MUST inspect the physical workspace directory structure before modifying any code or running CLI commands.

## Repository Verification Requirements
The agent MUST verify the existence and role of the core project components:
- **`index.html`**: Primary WebGL 3D portfolio & floating AI assistant app.
- **`src/`**: Autonomous agent engine, FSM controller, LLM client, database, & portal connectors.
- **`scripts/`**: Evaluation benchmark harnesses, PDF renderers, and Edge automation scripts.
- **`resume/`**: 100% ATS-verified resume suite (`resume.md`, `resume.html`, `resume.txt`, `resume.pdf`).
- **`tests/`**: Automated unit test suite (`test_candidate.py`, `test_chatbot_engine.py`, `test_cli.py`, `test_database.py`, `test_issue.py`, `test_llm_client.py`, `test_portals.py`).
- **`data/`**: Local persistence (`job_agent.db`, `JobTracker.xlsx`, benchmark reports).

## Memory Reconciliation & Verification Rules
1. **Reconcile Repository State**: Compare physical repository files against `PROJECT_MEMORY.md`.
2. **Authoritative Physical State**: Treat the actual, physical repository state as authoritative whenever `PROJECT_MEMORY.md` is stale or incomplete.
3. **No Unverified Assumptions**: Never assume a previous agent's implementation or script exists without explicitly checking file existence on disk.

## Memory Synchronization Requirements
- Update `PROJECT_MEMORY.md` whenever an architectural modification, candidate profile update, or portal connector change materially updates the project.

## Security & Secret Protection Restrictions
- **Strict Secret Exclusion**: NEVER store credentials, passwords, OTP codes, session cookies, API keys, MyDigitalID secrets, or authentication tokens in `PROJECT_MEMORY.md` or any Git-tracked documentation file.
