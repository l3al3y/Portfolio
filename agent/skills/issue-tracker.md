---
name: issue-tracker
description: Built-in local offline feedback and issue tracking system for AI agents and users.
---

# Skill: Issue & Feedback Tracker (`issue`)

## Command Usage
```bash
# Create an issue
python cli.py issue create --title "ATS parsing error for Kubernetes" --category bug --desc "Kubernetes keyword was missing from cloud pillar match."

# List issues
python cli.py issue list --status open

# View an issue
python cli.py issue show --id ISSUE-101

# Resolve an issue
python cli.py issue resolve --id ISSUE-101 --notes "Added Kubernetes to cloud infrastructure pillar dictionary."
```
