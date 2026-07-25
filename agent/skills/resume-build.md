---
name: resume-build
description: Generates ATS-verified, 100% keyword compliant resume files in Markdown, HTML, TXT, or JSON.
---

# Skill: Resume Generation (`resume generate`)

## Command Usage
```bash
python cli.py resume generate --format md --out resume/resume.md
python cli.py resume generate --format html --out resume/resume.html
python cli.py resume generate --format txt --out resume/resume.txt
python cli.py resume generate --format json --out resume/resume.json
```

## Verification
```bash
python cli.py ats verify
```
Checks target 42 candidate keywords (Networking, Security, Automation/AI, Embedded/IoT, IT Support) to ensure 100% ATS coverage score.
