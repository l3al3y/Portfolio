"""
Microsoft Edge Live MauKerja Profile Automation Script
======================================================
Connects to or launches Microsoft Edge (channel="msedge"), navigates to MauKerja,
and performs live profile modifications and PDF resume upload.
"""

from __future__ import annotations
import asyncio
import logging
import os
from pathlib import Path
from playwright.async_api import async_playwright

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("maukerja_edge")

async def automate_edge_maukerja():
    root_dir = Path(__file__).resolve().parent.parent
    memory_path = root_dir / "PROJECT_MEMORY.md"
    pdf_resume_path = root_dir / "resume" / "resume.pdf"
    txt_resume_path = root_dir / "resume" / "resume.txt"

    selected_resume = pdf_resume_path if pdf_resume_path.exists() else txt_resume_path

    logger.info("======================================================")
    logger.info(" AUTOMATING MAUKERJA PROFILE ON MICROSOFT EDGE")
    logger.info(" Resume Document: %s", selected_resume.resolve())
    logger.info("======================================================")

    async with async_playwright() as p:
        try:
            # Try launching Edge with channel="msedge" in non-headless mode so user sees it live
            browser = await p.chromium.launch(channel="msedge", headless=False)
            logger.info("Successfully connected to Microsoft Edge engine.")
        except Exception as exc:
            logger.warning("Could not launch msedge channel (%s). Launching Chromium browser...", exc)
            browser = await p.chromium.launch(headless=False)

        context = await browser.new_context(viewport={"width": 1280, "height": 800})
        page = await context.new_page()

        try:
            logger.info("Navigating to MauKerja profile page...")
            await page.goto("https://www.maukerja.my/profile", timeout=30_000, wait_until="domcontentloaded")
            await asyncio.sleep(2.0)

            curr_url = page.url.lower()
            logger.info("Current Microsoft Edge page URL: %s", page.url)

            # If redirected to login, prompt or autofill
            if "login" in curr_url:
                logger.info("Page is at Login. Attempting auto-fill...")
                email_input = page.locator("input[name='email'], input[type='email']")
                pass_input = page.locator("input[name='password'], input[type='password']")
                if await email_input.count() > 0:
                    await email_input.first.fill("fahmilatif87@gmail.com")
                    await asyncio.sleep(0.5)

                maukerja_pass = os.getenv("MAUKERJA_PASSWORD", "")
                if maukerja_pass and await pass_input.count() > 0:
                    await pass_input.first.fill(maukerja_pass)
                    submit_btn = page.locator("button[type='submit'], .btn-login")
                    if await submit_btn.count() > 0:
                        await submit_btn.first.click()
                        await asyncio.sleep(3.0)

            # Navigate / Ensure we are on Profile page
            if "profile" not in page.url.lower():
                await page.goto("https://www.maukerja.my/profile", timeout=30_000, wait_until="domcontentloaded")
                await asyncio.sleep(2.0)

            # Fill Candidate Details
            field_updates = [
                ("input[name='full_name'], input[name='name'], #applicant_name", "MUHAMMAD IRFAN FAHMI BIN SAMSUL KAMAR", "Full Name"),
                ("input[name='linkedin']", "https://linkedin.com/in/mifi99", "LinkedIn"),
                ("input[name='github']", "https://github.com/l3al3y", "GitHub"),
                ("input[name='portfolio']", "https://l3al3y.github.io/ResumeAgent/", "Portfolio"),
            ]

            for selector, val, label in field_updates:
                try:
                    loc = page.locator(selector)
                    if await loc.count() > 0:
                        await loc.first.fill(val)
                        logger.info("Updated field [%s] in Edge page.", label)
                        await asyncio.sleep(0.3)
                except Exception as e:
                    logger.debug("Field [%s] skip: %s", label, e)

            # Upload Resume File
            upload_triggers = [
                "button:has-text('Upload Resume')",
                "a:has-text('Upload Resume')",
                "button:has-text('Kemaskini Resume')",
                "a:has-text('Kemaskini Resume')",
                "button:has-text('Upload CV')",
                "a:has-text('Upload CV')",
                ".btn-upload",
            ]
            for trigger in upload_triggers:
                try:
                    btn = page.locator(trigger)
                    if await btn.count() > 0:
                        logger.info("Clicked resume upload trigger [%s] in Edge page.", trigger)
                        await btn.first.click()
                        await asyncio.sleep(1.0)
                        break
                except Exception:
                    pass

            file_input = page.locator("input[type='file'][name='resume'], input[type='file'][name='cv'], input[type='file']")
            if await file_input.count() > 0 and selected_resume.exists():
                try:
                    await file_input.first.set_input_files(str(selected_resume))
                    logger.info("SUCCESS: Uploaded resume file [%s] directly to Edge page!", selected_resume.name)
                    await asyncio.sleep(1.5)
                except Exception as e:
                    logger.warning("Resume file set_input_files exception: %s", e)

            # Save / Submit
            save_btns = [
                "button:has-text('Save')",
                "button:has-text('Simpan')",
                "button:has-text('Kemaskini')",
                "button[type='submit']",
            ]
            for s_btn in save_btns:
                try:
                    btn = page.locator(s_btn)
                    if await btn.count() > 0:
                        await btn.first.click()
                        logger.info("Clicked Save Profile button [%s] in Edge page.", s_btn)
                        await asyncio.sleep(2.0)
                        break
                except Exception:
                    pass

            logger.info("======================================================")
            logger.info(" MAUKERJA EDGE AUTOMATION COMPLETED!")
            logger.info("======================================================")

        except Exception as err:
            logger.error("Edge MauKerja automation error: %s", err)
        finally:
            await asyncio.sleep(3.0)
            await browser.close()

if __name__ == "__main__":
    asyncio.run(automate_edge_maukerja())
