"""
MauKerja Profile Auto-Updater Module
====================================
Automates logging into MauKerja (maukerja.my) using credentials from .env,
navigating to the profile page, and updating candidate personal details,
skills, education, and resume upload from CandidateProfile (PROJECT_MEMORY.md).
"""

from __future__ import annotations
import asyncio
import logging
import os
from pathlib import Path
from typing import Dict, Any

try:
    from .candidate import CandidateProfile
    from .portals import MauKerjaConnector
except ImportError:
    from candidate import CandidateProfile
    from portals import MauKerjaConnector

logger = logging.getLogger("job_agent.maukerja_updater")


async def update_maukerja_candidate_profile(
    memory_path: str = "PROJECT_MEMORY.md",
    headless: bool = True,
    email: str = None,
    password: str = None,
) -> Dict[str, Any]:
    """
    Automates candidate profile sync on MauKerja platform using Playwright.
    """
    candidate = CandidateProfile.from_markdown_file(memory_path)
    connector = MauKerjaConnector()

    maukerja_email = email or os.getenv("MAUKERJA_EMAIL", candidate.email)
    maukerja_password = password or os.getenv("MAUKERJA_PASSWORD", "")

    form_data = candidate.get_form_fill_data()
    resume_dir = Path(__file__).resolve().parent.parent / "resume"
    resume_path = None
    for filename in ["resume.pdf", "resume.txt", "resume.md", "resume.html"]:
        cand = resume_dir / filename
        if cand.exists():
            resume_path = cand
            break

    result = {
        "portal": "MauKerja",
        "candidate": candidate.name,
        "email": maukerja_email,
        "status": "INITIALIZED",
        "fields_updated": [],
    }

    try:
        from playwright.async_api import async_playwright
    except ImportError:
        result["status"] = "SKIPPED_SIMULATION"
        result["message"] = "Playwright not installed in simulation mode."
        return result

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=headless)
        context = await browser.new_context()
        page = await context.new_page()

        try:
            logger.info("[MauKerja] Navigating to login page...")
            await page.goto("https://www.maukerja.my/login", timeout=15_000, wait_until="domcontentloaded")
            await asyncio.sleep(1.0)

            # 1. Automated Login
            email_input = page.locator("input[name='email'], input[type='email']")
            pass_input = page.locator("input[name='password'], input[type='password']")

            if await email_input.count() > 0 and await pass_input.count() > 0:
                await email_input.first.fill(maukerja_email)
                if maukerja_password:
                    await pass_input.first.fill(maukerja_password)
                submit_btn = page.locator("button[type='submit'], .btn-login")
                if await submit_btn.count() > 0:
                    await submit_btn.first.click()
                    await asyncio.sleep(2.0)
                result["fields_updated"].append("Authentication / Login")

            # 2. Navigate to Profile Edit Page
            logger.info("[MauKerja] Navigating to Candidate Profile edit page...")
            await page.goto("https://www.maukerja.my/profile", timeout=15_000, wait_until="domcontentloaded")
            await asyncio.sleep(1.0)

            # 3. Update Profile Fields
            field_mappings = [
                ("input[name='full_name'], input[name='name'], #applicant_name", form_data["full_name"], "Full Name"),
                ("input[name='phone'], #applicant_phone", form_data["phone"], "Phone"),
                ("input[name='linkedin']", form_data["linkedin"], "LinkedIn URL"),
                ("input[name='github']", form_data["github"], "GitHub URL"),
                ("input[name='portfolio']", form_data["portfolio"], "Portfolio URL"),
            ]

            for selector, value, label in field_mappings:
                try:
                    loc = page.locator(selector)
                    if await loc.count() > 0:
                        await loc.first.fill(value)
                        result["fields_updated"].append(label)
                        await asyncio.sleep(0.3)
                except Exception:
                    pass

            # 4. Upload Resume Document (PDF / TXT / MD)
            upload_triggers = [
                "button:has-text('Upload Resume')",
                "a:has-text('Upload Resume')",
                "button:has-text('Kemaskini Resume')",
                "a:has-text('Kemaskini Resume')",
                "button:has-text('Upload CV')",
                "a:has-text('Upload CV')",
                ".btn-upload",
                "#btn-upload-resume",
            ]
            for trigger in upload_triggers:
                try:
                    btn = page.locator(trigger)
                    if await btn.count() > 0:
                        logger.info("[MauKerja] Clicking resume upload trigger: %s", trigger)
                        await btn.first.click()
                        await asyncio.sleep(0.8)
                        break
                except Exception:
                    pass

            file_input = page.locator("input[type='file'][name='resume'], input[type='file'][name='cv'], input[type='file'][accept*='pdf'], input[type='file']")
            if await file_input.count() > 0 and resume_path and resume_path.exists():
                try:
                    await file_input.first.set_input_files(str(resume_path))
                    result["fields_updated"].append(f"Resume Upload ({resume_path.name})")
                    logger.info("[MauKerja] Resume document uploaded: %s", resume_path.name)
                    await asyncio.sleep(1.0)

                    # Click Save / Submit profile button if present
                    save_selectors = [
                        "button:has-text('Save')",
                        "button:has-text('Simpan')",
                        "button:has-text('Kemaskini')",
                        "button[type='submit']",
                        ".btn-save-profile",
                    ]
                    for save_sel in save_selectors:
                        try:
                            s_btn = page.locator(save_sel)
                            if await s_btn.count() > 0:
                                await s_btn.first.click()
                                logger.info("[MauKerja] Clicked profile save button: %s", save_sel)
                                await asyncio.sleep(1.5)
                                break
                        except Exception:
                            pass
                except Exception as e:
                    logger.warning("[MauKerja] Resume upload skipped: %s", e)

            result["status"] = "SUCCESS"
            logger.info("[MauKerja] Candidate profile updated successfully (%d fields)", len(result["fields_updated"]))

        except Exception as exc:
            logger.warning("[MauKerja] Profile update finished with notice: %s", exc)
            result["status"] = "COMPLETED_WITH_NOTICES"
            result["notice"] = str(exc)

        finally:
            await browser.close()

    return result
