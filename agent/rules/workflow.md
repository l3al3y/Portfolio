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
   - Run `python cli.py portal update-profile --portal maukerja` for candidate profile & PDF resume sync.
   - Run `python cli.py portal sync --portal all` or `python cli.py job apply --id <job_id>` to initiate state machine processing.

6. **Excel Tracker Synchronization:**
   - Run `python cli.py tracker export` to sync SQLite database state to `JobTracker.xlsx`.

7. **Error & Issue Reporting:**
   - If an error occurs, inspect stderr JSON: `{"error": true, "code": "...", "message": "...", "suggestion": "..."}`.
   - File an issue via `python cli.py issue create --title "<Summary>" --category bug --desc "<Details>"`.

---

## Multi-Model Parallel Routing Architecture

Tasks are routed across specialized AI models based on domain expertise via RootSys Cloud (`https://rootsys.cloud/v1`):

### 1. CODE_DEV
- **Model**: `fiq/kimi-k2.7-code`
- **Responsibilities**:
  - Code generation
  - Repository implementation
  - Playwright DOM selector parsing
  - Browser automation code
  - Debugging implementation issues

### 2. DEEP_REASONING
- **Model**: `fiq/deepseek-v4-pro`
- **Responsibilities**:
  - Deep ATS match evaluation
  - Job-description analysis
  - Skills-gap analysis
  - Resume-job alignment
  - Complex reasoning tasks

### 3. FAST_FILTER
- **Model**: `fiq/deepseek-v4-flash`
- **Responsibilities**:
  - Fast job filtering
  - Job classification
  - Initial relevance scoring
  - High-volume lightweight processing

### 4. CREATIVE_WRITING
- **Model**: `fiq/grok-4.5`
- **Responsibilities**:
  - Tailored cover letters
  - Recruiter outreach
  - Persuasive professional writing
  - Job-specific application messaging

### 5. CONVERSATIONAL
- **Model**: `fiq/kimi-k3`
- **Responsibilities**:
  - Multilingual conversation
  - Candidate persona representation
  - User-facing explanations
  - Candidate communication assistance

### Parallel Execution Guidelines
- Independent model tasks SHOULD be executed in parallel where technically appropriate using `asyncio.gather()`.
- Do NOT parallelize dependent operations.
- Do NOT introduce race conditions.
- Do NOT duplicate expensive requests unnecessarily.
- Handle model failures independently with fallback logic.
- Provide deterministic fallback behavior where possible.
- Do NOT hard-code secrets.

---

## Portal Authentication Matrix

### MauKerja
- **Auth Strategy**: `AuthType.DIRECT_PASSWORD`
- Credentials are supplied securely through environment/configuration (`.env`).
- Never hard-code credentials.
- Never write credentials to logs.
- Reuse existing authenticated browser/session state only when safely implemented.

### JobStreet
- **Auth Strategy**: `AuthType.EMAIL_VERIFICATION`
- Email OTP / manual verification is required.
- Do NOT attempt to bypass OTP or security controls.
- Pause automation when user verification is required.
- Resume after successful authentication.

### MYFutureJobs
- **Auth Strategy**: `AuthType.BIOMETRIC_MYDIGITALID`
- MyDigitalID / PERKESO mobile approval may be required.
- Do NOT attempt to bypass biometric or mobile authentication.
- Reuse persistent authenticated session cookies only if securely stored.
- Never commit session cookies to Git.

### AUTHENTICATION SECURITY RULE
> The automation system must never bypass MFA, OTP, biometric verification, CAPTCHA, anti-bot mechanisms, or other security controls.
