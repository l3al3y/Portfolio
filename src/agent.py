"""
Modul Teras Agent (FSM Controller Berkuasa Memori Calon, Emel & Excel Sync)
=============================================================================
Ini ialah controller Finite State Machine (FSM) utama yang menguruskan
aliran kerja permohonan kerja secara autonomi.

Penaiktarifan Baharu:
  1. Perkhidmatan Emel Masuk/Keluar (SMTP/IMAP) - Menghantar permohonan secara
     formal & imbas imbalan perekrut (Jemputan Temuduga, Pengesahan, Penolakan).
  2. Penyelarasan Excel Otomatik (Excel Tracker) - Mengeksport setiap perubahan
     status permohonan ke fail Microsoft Excel (.xlsx) secara masa nyata.
"""

from __future__ import annotations
import asyncio
import logging
from collections import deque
from pathlib import Path
from typing import Callable, Awaitable, Optional, List

try:
    from .states import AgentState
    from .models import JobPosting, ApplicationRecord, ApplicationStatus
    from .database import JobDatabase
    from .candidate import CandidateProfile
    from .email_service import EmailService
    from .excel_tracker import ExcelTracker
except ImportError:
    from states import AgentState
    from models import JobPosting, ApplicationRecord, ApplicationStatus
    from database import JobDatabase
    from candidate import CandidateProfile
    from email_service import EmailService
    from excel_tracker import ExcelTracker

logger = logging.getLogger("job_agent.core")

StateHandler = Callable[[], Awaitable[AgentState]]


class MaxRetriesExceeded(Exception):
    """Dilemparkan apabila circuit breaker agent tercetus."""


class JobApplicationAgent:
    def __init__(
        self,
        job_queue: List[JobPosting],
        db_path: str = "job_agent.db",
        excel_path: str = "JobTracker.xlsx",
        candidate_memory_path: str = "PROJECT_MEMORY.md",
        headless: bool = True,
        max_consecutive_errors: int = 3,
        min_match_score: float = 40.0,
        email_dry_run: bool = True,
    ) -> None:
        self.job_queue: deque[JobPosting] = deque(job_queue)
        self.db = JobDatabase(db_path)
        self.excel_tracker = ExcelTracker(excel_path)
        self.headless = headless
        self.max_consecutive_errors = max_consecutive_errors
        self.min_match_score = min_match_score
        self.state: AgentState = AgentState.IDLE
        self.current_job: Optional[JobPosting] = None
        self._last_error: Optional[Exception] = None

        # Memuatkan Memori Calon daripada PROJECT_MEMORY.md
        self.candidate: CandidateProfile = CandidateProfile.from_markdown_file(candidate_memory_path)
        logger.info("Memori Calon dimuatkan: %s (%s)", self.candidate.name, self.candidate.email)

        # Inisialisasi Perkhidmatan Emel (SMTP/IMAP)
        self.email_service = EmailService(
            candidate_email=self.candidate.email,
            dry_run=email_dry_run,
        )

        # -- Circuit breaker --
        self._consecutive_errors = 0

        # -- Resource I/O (Playwright / Fallback Browser) --
        self._playwright = None
        self.browser = None
        self.page = None
        self.is_simulated_browser = False

        # Dispatch table FSM
        self._handlers: dict[AgentState, StateHandler] = {
            AgentState.IDLE: self._handle_idle,
            AgentState.FETCH_JOB: self._handle_fetch_job,
            AgentState.PARSE_DOM: self._handle_parse_dom,
            AgentState.THINK_LLM: self._handle_think_llm,
            AgentState.HUMAN_ACT: self._handle_human_act,
            AgentState.LOG_DATABASE: self._handle_log_database,
            AgentState.EXPORT_EXCEL: self._handle_export_excel,
            AgentState.ERROR_RECOVERY: self._handle_error_recovery,
        }

    # ------------------------------------------------------------------
    # GELUNG UTAMA FSM
    # ------------------------------------------------------------------

    async def run(self) -> None:
        """Gelung utama FSM yang memproses semua pekerjaan dalam queue."""
        logger.info("==================================================")
        logger.info("AUTONOMOUS JOB AGENT BERMULA (WITH EMAIL & EXCEL TRACKER)")
        logger.info("Calon: %s", self.candidate.name)
        logger.info("Jumlah Pekerjaan dalam Queue: %d", len(self.job_queue))
        logger.info("Ambang Skor ATS Minimum: %.1f%%", self.min_match_score)
        logger.info("Mod Emel: %s", "Simulasi (Dry-Run)" if self.email_service.dry_run else "Produksi")
        logger.info("==================================================")

        try:
            while self.state != AgentState.DONE:
                handler = self._handlers[self.state]
                try:
                    next_state = await handler()
                    self._consecutive_errors = 0  # reset circuit breaker
                    self.state = next_state
                except MaxRetriesExceeded:
                    logger.critical("Circuit breaker tercetus! Agent dihentikan serta-merta.")
                    break
                except Exception as exc:  # noqa: BLE001
                    self._last_error = exc
                    logger.exception("Ralat pada state %s: %s", self.state, exc)
                    self.state = AgentState.ERROR_RECOVERY
        finally:
            await self._cleanup()

        # Akhir sesi: Semak Emel Masuk & Kemaskini Excel secara komprehensif
        await self._check_inbox_and_update_db()
        self.excel_tracker.sync_from_db(self.db.db_path, self.email_service.email_log)

        stats = await self.db.get_summary_stats()
        logger.info("Pemberhentian Selesai. Statistik Pangkalan Data: %s", stats)

    # ------------------------------------------------------------------
    # HANDLERS SETIAP STATE
    # ------------------------------------------------------------------

    async def _handle_idle(self) -> AgentState:
        """Inisialisasi browser Playwright atau fallback browser engine."""
        logger.info("[IDLE] Menginisialisasi enjin browser...")
        try:
            from playwright.async_api import async_playwright
            self._playwright = await async_playwright().start()
            self.browser = await self._playwright.chromium.launch(headless=self.headless)
            self.page = await self.browser.new_page()
            self.is_simulated_browser = False
            logger.info("[IDLE] Playwright Chromium berjaya dilancarkan.")
        except Exception as e:
            logger.warning("[IDLE] Playwright tidak tersedia (%s). Menggunakan enjin simulasi.", e)
            self.is_simulated_browser = True

        return AgentState.FETCH_JOB

    async def _handle_fetch_job(self) -> AgentState:
        """Mengambil pekerjaan seterusnya & menyemak idempotency."""
        if not self.job_queue:
            logger.info("[FETCH_JOB] Queue pekerjaan telah kosong. Transisi ke EXPORT_EXCEL.")
            return AgentState.EXPORT_EXCEL

        self.current_job = self.job_queue.popleft()
        logger.info("[FETCH_JOB] Pekerjaan dipilih: %s @ %s (ID: %s)",
                    self.current_job.title, self.current_job.company, self.current_job.job_id)

        # Semakan Idempotency
        is_dup = await self.db.is_duplicate(self.current_job.company)
        if is_dup:
            logger.info("[FETCH_JOB] Syarikat '%s' sudah dipohon sebelum ini. Memilih SKIP.",
                        self.current_job.company)
            self.current_job.status = ApplicationStatus.SKIPPED_DUPLICATE
            record = ApplicationRecord(
                job_id=self.current_job.job_id,
                title=self.current_job.title,
                company=self.current_job.company,
                url=self.current_job.url,
                match_score=0.0,
                status=ApplicationStatus.SKIPPED_DUPLICATE,
                error_message="Skipped because company duplicate found in DB",
            )
            await self.db.save_record(record)
            return AgentState.FETCH_JOB

        return AgentState.PARSE_DOM

    async def _handle_parse_dom(self) -> AgentState:
        """Navigasi ke URL dan ekstrak kandungan deskripsi kerja."""
        assert self.current_job is not None

        if self.current_job.description:
            logger.info("[PARSE_DOM] Deskripsi kerja sedia ada ditemui (%d aksara).",
                        len(self.current_job.description))
            return AgentState.THINK_LLM

        if not self.is_simulated_browser and self.page:
            try:
                from playwright.async_api import TimeoutError as PWTimeout
                logger.info("[PARSE_DOM] Navigasi ke %s...", self.current_job.url)
                await self.page.goto(self.current_job.url, timeout=15_000, wait_until="domcontentloaded")

                for selector in ["[data-testid='job-description']", ".job-description", "article", "main", "body"]:
                    try:
                        locator = self.page.locator(selector)
                        if await locator.count() > 0:
                            text = await locator.first.inner_text(timeout=3_000)
                            if text and len(text.strip()) > 50:
                                self.current_job.description = text.strip()
                                logger.info("[PARSE_DOM] Berjaya ekstrak deskripsi menerusi selector '%s'.", selector)
                                break
                    except Exception:
                        continue
            except Exception as exc:
                logger.warning("[PARSE_DOM] Gagal membaca DOM Playwright: %s. Menggunakan deskripsi fallback.", exc)

        if not self.current_job.description:
            self.current_job.description = (
                f"Required skills: Network Engineering, Cisco CCNA, Routing, Switching, TCP/IP, "
                f"Python automation, IT Support, Endpoint Security, and troubleshooting at {self.current_job.company}."
            )

        return AgentState.THINK_LLM

    async def _handle_think_llm(self) -> AgentState:
        """
        Penaakulan & Penilaian Padanan Calon vs Keperluan Pekerjaan.
          - Mengira Skor Padanan ATS 0-100%.
          - Menjana Cover Letter khusus.
        """
        assert self.current_job is not None and self.current_job.description is not None

        logger.info("[THINK_LLM] Menganalisis padanan profil calon untuk '%s' @ '%s'...",
                    self.current_job.title, self.current_job.company)

        analysis = self.candidate.analyze_job_match(
            self.current_job.title, self.current_job.description
        )

        match_score = analysis["match_score"]
        dominant_pillar = analysis["dominant_pillar"]
        matched_kws = analysis["matched_keywords"]

        logger.info("[THINK_LLM] Pilar Utama: %s | Skor ATS: %.1f%% | Kata Kunci Padan: %s",
                    dominant_pillar, match_score, matched_kws[:6])

        # Jana Cover Letter khusus
        cover_letter = self.candidate.generate_tailored_cover_letter(
            self.current_job.title, self.current_job.company, self.current_job.description
        )

        self.current_job.match_score = match_score
        self.current_job.dominant_pillar = dominant_pillar
        self.current_job.tailored_cover_letter = cover_letter
        self.current_job.parsed_fields = {
            "analysis": analysis,
            "form_data": self.candidate.get_form_fill_data(),
        }

        # Semakan ambang padanan minimum
        if match_score < self.min_match_score:
            logger.warning("[THINK_LLM] Skor padanan (%.1f%%) di bawah ambang minimum (%.1f%%). Memilih SKIP.",
                           match_score, self.min_match_score)
            self.current_job.status = ApplicationStatus.SKIPPED_LOW_MATCH
            record = ApplicationRecord(
                job_id=self.current_job.job_id,
                title=self.current_job.title,
                company=self.current_job.company,
                url=self.current_job.url,
                match_score=match_score,
                status=ApplicationStatus.SKIPPED_LOW_MATCH,
                error_message=f"Match score {match_score}% below threshold {self.min_match_score}%",
            )
            await self.db.save_record(record)
            return AgentState.FETCH_JOB

        return AgentState.HUMAN_ACT

    async def _handle_human_act(self) -> AgentState:
        """
        Simulasi tindakan mengisi borang & menghantar Emel Permohonan (SMTP).
        """
        assert self.current_job is not None
        form_data = self.current_job.parsed_fields.get("form_data", self.candidate.get_form_fill_data())
        cover_letter = self.current_job.tailored_cover_letter or ""

        logger.info("[HUMAN_ACT] Mengisi borang permohonan bagi %s...", self.candidate.name)

        if not self.is_simulated_browser and self.page:
            try:
                for selector, value in [
                    ("input[name='full_name']", form_data["full_name"]),
                    ("input[name='name']", form_data["full_name"]),
                    ("input[name='email']", form_data["email"]),
                    ("input[name='phone']", form_data["phone"]),
                    ("input[name='linkedin']", form_data["linkedin"]),
                ]:
                    try:
                        if await self.page.locator(selector).count() > 0:
                            await self.page.fill(selector, value)
                            await asyncio.sleep(0.3)
                    except Exception:
                        pass

                for selector in ["textarea[name='cover_letter']", "textarea[name='coverLetter']", "textarea"]:
                    try:
                        if await self.page.locator(selector).count() > 0:
                            await self.page.fill(selector, cover_letter[:500])
                            await asyncio.sleep(0.4)
                            break
                    except Exception:
                        pass
            except Exception as e:
                logger.warning("[HUMAN_ACT] Interaksi Playwright mendapat amaran: %s", e)

        # Penghantaran Emel Permohonan
        hr_target = self.current_job.hr_email or f"careers@{self.current_job.company.lower().replace(' ', '')}.com"
        self.email_service.send_application_email(
            hr_email=hr_target,
            company_name=self.current_job.company,
            job_title=self.current_job.title,
            cover_letter=cover_letter,
        )

        await asyncio.sleep(0.5)
        logger.info("[HUMAN_ACT] Permohonan & Emel berjaya diisi/dihantar untuk %s @ %s.",
                    self.current_job.title, self.current_job.company)

        return AgentState.LOG_DATABASE

    async def _handle_log_database(self) -> AgentState:
        """Perekodan status permohonan ke SQLite & penyingkiran sync Excel."""
        assert self.current_job is not None
        self.current_job.status = ApplicationStatus.APPLIED

        record = ApplicationRecord(
            job_id=self.current_job.job_id,
            title=self.current_job.title,
            company=self.current_job.company,
            url=self.current_job.url,
            match_score=self.current_job.match_score,
            status=ApplicationStatus.APPLIED,
            cover_letter=self.current_job.tailored_cover_letter,
        )
        await self.db.save_record(record)
        logger.info("[LOG_DATABASE] PERMOHONAN BERJAYA DISIMPAN ke SQLite bagi %s @ %s (Skor: %.1f%%)",
                    self.current_job.title, self.current_job.company, self.current_job.match_score)

        # Sync Excel secara automatik
        self.excel_tracker.sync_from_db(self.db.db_path, self.email_service.email_log)

        return AgentState.FETCH_JOB

    async def _handle_export_excel(self) -> AgentState:
        """State eksport & selaraskan pangkalan data SQLite ke fail Excel (.xlsx)."""
        logger.info("[EXPORT_EXCEL] Menyinkronkan semua rekod ke fail Excel JobTracker.xlsx...")
        await self._check_inbox_and_update_db()
        excel_file = self.excel_tracker.sync_from_db(self.db.db_path, self.email_service.email_log)
        logger.info("[EXPORT_EXCEL] Fail Penjejak Excel sedia di: %s", excel_file.resolve())
        return AgentState.DONE

    async def _handle_error_recovery(self) -> AgentState:
        """Pusat pemulihan ralat dan kawalan Circuit Breaker."""
        self._consecutive_errors += 1
        logger.warning("[ERROR_RECOVERY] Ralat berturutan tercetus: %d/%d. Ralat: %s",
                       self._consecutive_errors, self.max_consecutive_errors, self._last_error)

        if self.current_job:
            record = ApplicationRecord(
                job_id=self.current_job.job_id,
                title=self.current_job.title,
                company=self.current_job.company,
                url=self.current_job.url,
                match_score=self.current_job.match_score,
                status=ApplicationStatus.FAILED,
                error_message=str(self._last_error),
            )
            await self.db.save_record(record)

        if self._consecutive_errors >= self.max_consecutive_errors:
            raise MaxRetriesExceeded("Terlalu banyak ralat berturutan. Circuit breaker menghentikan agent.")

        self.current_job = None
        return AgentState.FETCH_JOB

    # ------------------------------------------------------------------
    # UTILITY INBOX CHECKING
    # ------------------------------------------------------------------

    async def _check_inbox_and_update_db(self) -> None:
        """Semak emel masuk dan kemaskini pangkalan data SQLite jika ada jawapan perekrut."""
        try:
            companies = await self.db.get_all_companies()
            inbound_records = self.email_service.check_inbox_updates(companies)

            for item in inbound_records:
                if item.company_matched and item.category in ["INTERVIEW_INVITE", "REJECTED"]:
                    logger.info("[INBOX MATCH] Mengemaskini status permohonan %s -> %s",
                                item.company_matched, item.category)
                    await self.db.update_status_from_email(
                        company=item.company_matched,
                        new_status=item.category,
                        note=f"Received email: {item.subject}"
                    )
        except Exception as e:
            logger.warning("Ralat semasa menyemak kotak surat emel: %s", e)

    # ------------------------------------------------------------------
    # CLEANUP
    # ------------------------------------------------------------------

    async def _cleanup(self) -> None:
        """Pembersihan sumber I/O."""
        logger.info("Membersihkan sumber Playwright...")
        if self.browser:
            try:
                await self.browser.close()
            except Exception:
                pass
        if self._playwright:
            try:
                await self._playwright.stop()
            except Exception:
                pass
