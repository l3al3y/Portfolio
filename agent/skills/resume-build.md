---
name: resume-build
description: Generates ATS-verified, 100% keyword compliant resume documents across Markdown, HTML, Plain Text, and single-page PDF formats.
---

# Skill: Resume Generation & PDF Rendering (`resume generate` / `generate_pdf.py`)

## Command Usage
```bash
# 1. Generate Markdown, HTML, and Plain Text Resumes
python cli.py resume generate --format md --out resume/resume.md

# 2. Render Printable Single-Page PDF Resume
python scripts/generate_pdf.py

# 3. Verify ATS Keyword Compliance (100% Target Score)
python cli.py ats verify
```

---

## Canonical Resume Build Pipeline

```text
SOURCE: resume/resume.md
           ↓
HTML:   resume/resume.html
           ↓
TXT:    resume/resume.txt
           ↓
PDF:    resume/resume.pdf (Single-Page A4)
```

---

## Pipeline Specification & Requirements

1. **Source Document (`resume/resume.md`)**: Single-source-of-truth Markdown generated from [PROJECT_MEMORY.md](file:///D:/Resume%20ats%20cli/PROJECT_MEMORY.md).
2. **HTML Layout (`resume/resume.html`)**: Clean 1-page A4 CSS layout optimized for printing, PDF conversion, and screen readers.
3. **Plain Text (`resume/resume.txt`)**: Plain text document for legacy ATS portal file uploads.
4. **Single-Page PDF (`resume/resume.pdf`)**: Playwright Chromium PDF renderer script ([scripts/generate_pdf.py](file:///D:/Resume%20ats%20cli/scripts/generate_pdf.py)) executing:
   - A4 page formatting with 10mm margins.
   - High-contrast typography and preserved hyperlinks.
   - 100% ATS-readable text layer without destructive visual canvas rasterization.
   - Saved in the canonical `resume/` directory.
