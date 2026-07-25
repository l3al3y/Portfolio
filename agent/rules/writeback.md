---
name: writeback-rules
description: Protocol for agents to persist operational results, telemetry, and issues back into the system.
---

# Writeback Rules

## Database & File Persistence
- Every job evaluated or applied MUST be logged in SQLite (`data/job_agent.db` or `src/job_agent.db`).
- SQLite uses WAL mode (`PRAGMA journal_mode=WAL`) to allow concurrent read/write transactions.
- On job status updates, sync the changes to `JobTracker.xlsx` via `python cli.py tracker export`.

## Feedback & Issue Writeback
- When encountering missing features, unexpected errors, or ATS keyword parsing anomalies, agents MUST create an offline issue:
  `python cli.py issue create --title "<Issue Title>" --category <bug|requirement|suggestion|bad-output> --desc "<Details>"`
- When an issue is verified resolved, mark it closed:
  `python cli.py issue resolve --id <issue_id> --notes "<Resolution Notes>"`

## Output Cleanliness
- Data MUST be output to `stdout` as JSON in default agent mode.
- Log telemetry, warnings, and non-fatal progress info MUST be output to `stderr`.
