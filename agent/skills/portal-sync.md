---
name: portal-sync
description: Synchronizes candidate job applications and candidate profile details across multi-portal connectors (MYFutureJobs, MauKerja, JobStreet, LinkedIn).
---

# Skill: Multi-Portal Sync & Profile Automation (`portal sync` / `portal update-profile`)

## Command Usage
```bash
# 1. Update MauKerja Candidate Profile & Upload PDF Resume
python cli.py portal update-profile --portal maukerja

# 2. Synchronize Job Listings across Portals
python cli.py portal sync --portal all
python cli.py portal sync --portal maukerja
python cli.py portal sync --portal myfuturejobs
python cli.py portal list
```

## Connectors Supported
- 🇲🇾 **MauKerja** (`maukerja.my`) — Direct password login, candidate details sync, and PDF resume upload.
- 🇲🇾 **MYFutureJobs** (`myfuturejobs.gov.my` - Official MY Govt Portal) — Biometric MyDigitalID / PERKESO authentication.
- 🇲🇾 **JobStreet Malaysia** (`jobstreet.com.my`) — Email verification OTP.
- 🇸🇬 **LinkedIn Southeast Asia** (`linkedin.com/jobs`) — Public job scraping & application automation.

---

## MauKerja Candidate Profile Synchronization Workflow

### Execution Pipeline (`python cli.py portal update-profile --portal maukerja`)
1. **Validate Environment & Config**: Check `MAUKERJA_EMAIL` and `MAUKERJA_PASSWORD` in `.env`.
2. **Load Candidate Data**: Retrieve profile details from approved source of truth ([PROJECT_MEMORY.md](file:///D:/Resume%20ats%20cli/PROJECT_MEMORY.md)).
3. **Validate Required Fields**: Ensure Full Name, Email, Phone, Education, and Skills exist.
4. **Authenticate Securely**: Login via Playwright (`https://www.maukerja.my/login`).
5. **Open Profile Page**: Navigate to `https://www.maukerja.my/profile`.
6. **Locate Profile Fields**: Target elements using robust selector strategy.
7. **Update Candidate Profile**: Fill Full Name, Phone, LinkedIn, GitHub, Portfolio URLs.
8. **Validate Saved Values**: Trigger save button click (`Save` / `Simpan` / `Kemaskini`).
9. **Prepare PDF Resume**: Verify existence of `resume/resume.pdf` (or render via `python scripts/generate_pdf.py`).
10. **Upload PDF Resume**: Target file input element and upload `resume.pdf`.
11. **Verify Upload Success**: Ensure document is set and confirmation received.
12. **Record Safe Summary**: Log status `SUCCESS` with updated field count.
13. **Security Invariant**: Never log passwords, OTPs, session cookies, or tokens to stdout/stderr.

### Playwright Selector Strategy Hierarchy
1. **Stable `data-testid` / Accessibility Selectors**: e.g., `[data-testid='full-name-input']`
2. **Semantic Role + Accessible Name**: e.g., `page.get_by_role("button", name="Upload Resume")`
3. **Stable Labels**: e.g., `page.get_by_label("Full Name")`
4. **Stable IDs**: e.g., `#applicant_name`
5. **CSS Selectors**: e.g., `input[name='full_name'], input[name='name']`
6. **XPath**: Only as a last resort.

*Selectors must NOT depend on generated class names, positional index selectors, fragile DOM hierarchy, or visual styling.*

---

## Microsoft Edge Live Automation Runner (`scripts/automate_edge_maukerja.py`)

For live desktop browser profile updates, the script [scripts/automate_edge_maukerja.py](file:///D:/Resume%20ats%20cli/scripts/automate_edge_maukerja.py) connects directly to Microsoft Edge (`channel="msedge"`):
- Reuses candidate profile loader ([src/candidate.py](file:///D:/Resume%20ats%20cli/src/candidate.py)).
- Supports safe authentication without hard-coded credentials.
- Displays non-headless browser page for manual verification when required.
- Provides informative logging without secret leakage.
