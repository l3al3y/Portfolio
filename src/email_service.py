"""
Modul Perkhidmatan Emel (Incoming & Outgoing Email Service)
============================================================
Modul ini menguruskan penghantaran emel permohonan (SMTP) dan pemantauan
emel masuk (IMAP) daripada pihak perekrut / HR syarikat.

Keupayaan Utama:
  1. Penghantaran Emel Masuk/Keluar (SMTP) - Menghantar surat iringan & resume
     secara formal menerusi pelayan SMTP (Gmail / Outlook / Custom).
  2. Pemantau Kotak Surat (IMAP Inbox Scanner) - Membaca & mengekstrak status
     daripada emel jawapan perekrut (Jemputan Temuduga, Pengesahan, Penolakan).
  3. Mod Simulasi / Dry-Run - Sekiranya maklumat laluan SMTP/IMAP tidak
     disediakan, sistem beroperasi dalam mod simulasi selamat tanpa crash.
"""

from __future__ import annotations
import os
import re
import imaplib
import smtplib
import logging
from dataclasses import dataclass, field
from datetime import datetime
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.application import MIMEApplication
from pathlib import Path
from typing import List, Dict, Optional, Tuple, Any

logger = logging.getLogger("job_agent.email")


@dataclass
class EmailMessageRecord:
    direction: str  # "OUTGOING" atau "INCOMING"
    sender: str
    recipient: str
    subject: str
    body: str
    category: str  # "APPLICATION_SENT", "INTERVIEW_INVITE", "APPLICATION_RECEIVED", "REJECTED", "INFO"
    timestamp: datetime = field(default_factory=datetime.now)
    company_matched: Optional[str] = None


class EmailService:
    def __init__(
        self,
        candidate_email: str = "fahmilatif87@gmail.com",
        smtp_server: Optional[str] = None,
        smtp_port: int = 587,
        smtp_user: Optional[str] = None,
        smtp_password: Optional[str] = None,
        imap_server: Optional[str] = None,
        imap_port: int = 993,
        imap_user: Optional[str] = None,
        imap_password: Optional[str] = None,
        dry_run: bool = True,
    ) -> None:
        self.candidate_email = candidate_email
        self.smtp_server = smtp_server or os.getenv("SMTP_SERVER", "smtp.gmail.com")
        self.smtp_port = int(os.getenv("SMTP_PORT", str(smtp_port)))
        self.smtp_user = smtp_user or os.getenv("SMTP_USER", candidate_email)
        self.smtp_password = smtp_password or os.getenv("SMTP_PASSWORD", "")

        self.imap_server = imap_server or os.getenv("IMAP_SERVER", "imap.gmail.com")
        self.imap_port = int(os.getenv("IMAP_PORT", str(imap_port)))
        self.imap_user = imap_user or os.getenv("IMAP_USER", candidate_email)
        self.imap_password = imap_password or os.getenv("IMAP_PASSWORD", "")

        # Sekiranya kata laluan emel tiada, aktifkan mod simulasi selamat
        self.dry_run = dry_run or not bool(self.smtp_password or self.imap_password)
        self.email_log: List[EmailMessageRecord] = []

        if self.dry_run:
            logger.info("Perkhidmatan Emel diinisialisasi dalam MOD SIMULASI (Dry-Run).")
        else:
            logger.info("Perkhidmatan Emel diinisialisasi dalam MOD PRODUKSI (SMTP: %s, IMAP: %s).",
                        self.smtp_server, self.imap_server)

    # ------------------------------------------------------------------
    # OUTGOING EMAIL (SMTP)
    # ------------------------------------------------------------------

    def send_application_email(
        self,
        hr_email: str,
        company_name: str,
        job_title: str,
        cover_letter: str,
        attachment_paths: Optional[List[str | Path]] = None,
    ) -> EmailMessageRecord:
        """
        Menghantar emel permohonan kerja berserta surat iringan & fail lampiran.
        """
        subject = f"Job Application: {job_title} - Muhammad Irfan Fahmi bin Samsul Kamar"
        logger.info("[OUTGOING EMAIL] Menjana emel permohonan ke %s (%s)...", hr_email, company_name)

        if self.dry_run:
            logger.info("[OUTGOING EMAIL - SIMULATED] Emel dihantar secara simulasi ke %s.", hr_email)
            record = EmailMessageRecord(
                direction="OUTGOING",
                sender=self.candidate_email,
                recipient=hr_email,
                subject=subject,
                body=cover_letter,
                category="APPLICATION_SENT",
                company_matched=company_name,
            )
            self.email_log.append(record)
            return record

        try:
            msg = MIMEMultipart()
            msg["From"] = self.candidate_email
            msg["To"] = hr_email
            msg["Subject"] = subject

            msg.attach(MIMEText(cover_letter, "plain", "utf-8"))

            # Lampiran (Resume / Sijil)
            if attachment_paths:
                for fpath in attachment_paths:
                    path = Path(fpath)
                    if path.is_file():
                        with open(path, "rb") as f:
                            part = MIMEApplication(f.read(), Name=path.name)
                            part['Content-Disposition'] = f'attachment; filename="{path.name}"'
                            msg.attach(part)

            with smtplib.SMTP(self.smtp_server, self.smtp_port, timeout=15) as server:
                server.starttls()
                server.login(self.smtp_user, self.smtp_password)
                server.sendmail(self.candidate_email, [hr_email], msg.as_string())

            logger.info("[OUTGOING EMAIL] Emel BERJAYA DIHANTAR ke %s", hr_email)
            record = EmailMessageRecord(
                direction="OUTGOING",
                sender=self.candidate_email,
                recipient=hr_email,
                subject=subject,
                body=cover_letter,
                category="APPLICATION_SENT",
                company_matched=company_name,
            )
            self.email_log.append(record)
            return record

        except Exception as e:
            logger.error("[OUTGOING EMAIL ERROR] Gagal menghantar emel ke %s: %s", hr_email, e)
            record = EmailMessageRecord(
                direction="OUTGOING",
                sender=self.candidate_email,
                recipient=hr_email,
                subject=subject,
                body=f"FAILED: {e}",
                category="FAILED",
                company_matched=company_name,
            )
            self.email_log.append(record)
            return record

    # ------------------------------------------------------------------
    # INCOMING EMAIL MONITOR (IMAP / Parser)
    # ------------------------------------------------------------------

    def check_inbox_updates(self, known_companies: List[str]) -> List[EmailMessageRecord]:
        """
        Imbas emel masuk untuk mengesan jawapan daripada perekrut
        (Temuduga, Pengesahan Permohonan, Penolakan, dll).
        """
        logger.info("[INCOMING EMAIL] Memeriksa kotak surat emel masuk...")
        new_records: List[EmailMessageRecord] = []

        if self.dry_run:
            logger.info("[INCOMING EMAIL - SIMULATED] Menggunakan jawapan emel simulasi perekrut.")
            simulated_inbound = [
                EmailMessageRecord(
                    direction="INCOMING",
                    sender="hr@technova.example.com",
                    recipient=self.candidate_email,
                    subject="Interview Invitation: Network Engineer at TechNova Solutions",
                    body="Dear Irfan, We were impressed by your CCNA credentials and YOLOv8 Capstone. We would like to invite you for an interview next Tuesday.",
                    category="INTERVIEW_INVITE",
                    company_matched="TechNova Solutions",
                ),
                EmailMessageRecord(
                    direction="INCOMING",
                    sender="careers@cyberdyne.example.com",
                    recipient=self.candidate_email,
                    subject="Application Received - Industrial AI Developer",
                    body="Thank you for applying to Cyberdyne Robotics. We have received your resume and application.",
                    category="APPLICATION_RECEIVED",
                    company_matched="Cyberdyne Robotics",
                )
            ]
            self.email_log.extend(simulated_inbound)
            return simulated_inbound

        try:
            mail = imaplib.IMAP4_SSL(self.imap_server, self.imap_port)
            mail.login(self.imap_user, self.imap_password)
            mail.select("inbox")

            status, search_data = mail.search(None, "UNSEEN")
            if status != "OK":
                logger.info("[INCOMING EMAIL] Tiada emel baharu ditemui.")
                mail.logout()
                return []

            email_ids = search_data[0].split()
            logger.info("[INCOMING EMAIL] %d emel baharu belum dibaca ditemui.", len(email_ids))

            for eid in email_ids[-10:]:  # Hadkan 10 emel terkini
                _, data = mail.fetch(eid, "(RFC822)")
                raw_email = data[0][1]
                # Parser asas kandungan emel
                content_str = raw_email.decode("utf-8", errors="ignore")

                subject_match = re.search(r"Subject:\s*(.*)", content_str, re.IGNORECASE)
                subject = subject_match.group(1).strip() if subject_match else "No Subject"

                from_match = re.search(r"From:\s*(.*)", content_str, re.IGNORECASE)
                sender = from_match.group(1).strip() if from_match else "Unknown"

                category, company = self._classify_email_content(subject, content_str, known_companies)

                rec = EmailMessageRecord(
                    direction="INCOMING",
                    sender=sender,
                    recipient=self.candidate_email,
                    subject=subject,
                    body=content_str[:300],
                    category=category,
                    company_matched=company,
                )
                new_records.append(rec)
                self.email_log.append(rec)

            mail.logout()
            return new_records

        except Exception as e:
            logger.error("[INCOMING EMAIL ERROR] Gagal menyemak kotak surat IMAP: %s", e)
            return []

    def _classify_email_content(
        self, subject: str, body: str, known_companies: List[str]
    ) -> Tuple[str, Optional[str]]:
        """Menganalisis dan mengelaskan kategori emel masuk."""
        combined = f"{subject} {body}".lower()

        # Semak padanan syarikat
        company_matched = None
        for comp in known_companies:
            if comp.lower() in combined:
                company_matched = comp
                break

        if any(w in combined for w in ["interview", "temuduga", "shortlisted", "schedule a call", "invitation"]):
            return "INTERVIEW_INVITE", company_matched
        if any(w in combined for w in ["received your application", "thank you for applying", "permohonan diterima"]):
            return "APPLICATION_RECEIVED", company_matched
        if any(w in combined for w in ["assessment", "test", "quiz", "technical test"]):
            return "ASSESSMENT_REQUEST", company_matched
        if any(w in combined for w in ["regret", "unfortunately", "not moving forward", "other candidates"]):
            return "REJECTED", company_matched

        return "INFO", company_matched
