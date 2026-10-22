# Computer Engineering resumes

Four one-page A4 resumes share the public facts in `profiles.json`. The Computer Engineering version is the primary `computer-engineering-20261022-community.pdf`; AI/ML, Software and Embedded/IoT versions select different projects and skills. The Professional Summary is immediately below the contact details in every version. The legacy `resume.pdf` remains a compatibility copy; active links use the dated address to avoid previously cached copies. Use a new dated filename for a future primary CV revision.

Generated with RenderCV 2.8, its engineeringresumes theme, Source Sans 3 and 10 pt body text. Editable YAML lives in `source/`. Graduation is scheduled for 2 November 2026, based on Irfan's confirmation on 22 October 2026. Contact information comes from the existing public portfolio; protected placeholders and private identifiers are excluded.

To update with Python 3.12 or later:

```sh
pip install "rendercv[full]==2.8"
python scripts/build_resumes.py
rendercv render resume/source/computer-engineering.yaml -o rendercv_output/computer-engineering
rendercv render resume/source/ai-ml.yaml -o rendercv_output/ai-ml
rendercv render resume/source/software.yaml -o rendercv_output/software
rendercv render resume/source/embedded-iot.yaml -o rendercv_output/embedded-iot
```

Copy each generated PDF to its intended `pdf` path from `profiles.json` only after inspection. Refresh document previews with `python scripts/refresh-resume-previews.py` (requires pypdfium2 and Pillow). Run the portfolio page generators and tests. PDF previews must come from the actual new PDFs.

The public role views are `/careers/ai-ml/`, `/careers/software/` and `/careers/embedded-iot/`; `/careers/` explains the shared foundation and `/resume/` offers all four documents.

Local validation used pypdf and pdfplumber to check extraction and section order, and every final page was rendered and visually inspected. This establishes document readability checks, not an employer ATS score or a guarantee of successful parsing. Employer file-type requirements and autofilled application fields still need checking.

Guidance reviewed: [UTM Career Centre](https://careercentre.utm.my/career-guidance/resume/), [Jobstreet Malaysia](https://my.jobstreet.com/career-advice/article/resume-summary-for-fresh-graduates), [Greenhouse Support](https://support.greenhouse.io/hc/en-us/articles/200989175-Unsuccessful-resume-parse), and [RenderCV](https://github.com/rendercv/rendercv).

The SMC Crows community contribution uses the dated all-version counter snapshot in `community-impact.json`. It sums every listed release/setup bucket once, including direct and mirror requests and retries. It is not a count of installations or unique users. Computer Engineering, Software and Embedded/IoT CVs include this project; the AI/ML project selection remains focused on ML evidence.

All four CVs use a plain layout with no semicolons, bullet glyphs, decorative contact separators or date-range dashes. Essential email, URL and C++ characters are preserved. Dates use the word to. The dated AI/ML PDF is `ai-ml-engineer-20261022-plain.pdf`. This is a formatting preference, not a claim that ATS software rejects ordinary punctuation.

Thin horizontal section dividers were restored at Irfan's request. They are visual rules, separate from the selectable CV text.
