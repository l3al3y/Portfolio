---
name: ats-evaluate
description: Evaluates candidate resume/profile against a target job description with 100% explainable scoring.
---

# Skill: ATS Evaluation (`ats evaluate`)

## Command Usage
```bash
python cli.py ats evaluate --title "Network Engineer" --desc "Seeking CCNA certified engineer with OSPF and VLAN skills..." --company "TechCorp"
```

## Response Schema
Returns JSON object containing:
- `match_score` (0 - 100)
- `ats_breakdown` (Keywords 30, Education 10, Certifications 10, Projects 15, Experience 15, Soft Skills 10)
- `interview_prob` (estimated_chance %, rating: Low/Medium/High)
- `salary_pred` (min_salary, likely_salary, optimistic_salary, currency)
- `skills_gap` (missing_skills, learning_time_weeks, expected_ats_boost)
- `career_impact` (overall_score, growth_potential, learning_potential)
- `dual_confidence` (execution_confidence: 100%, analysis_confidence: 85%)
