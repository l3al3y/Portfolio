"""
Entry Point Autonomous Job Application Agent
===================================================
Menjalankan JobApplicationAgent bersama Candidate Memory, Email Service (SMTP/IMAP),
dan Excel Tracker Sync (.xlsx).
"""

import sys
import asyncio
import logging
from pathlib import Path

# Menambah direktori semasa ke sys.path
sys.path.insert(0, str(Path(__file__).resolve().parent))

from agent import JobApplicationAgent
from models import JobPosting
from candidate import CandidateProfile

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)-8s | %(name)s | %(message)s",
)
logger = logging.getLogger("main")


async def main() -> None:
    base_dir = Path(__file__).resolve().parent
    memory_path = base_dir.parent / "PROJECT_MEMORY.md"

    logger.info("Memuatkan profil calon daripada %s...", memory_path)
    profile = CandidateProfile.from_markdown_file(memory_path)

    print("\n" + "=" * 65)
    print(f" [PROFILE] CANDIDATE LOADED: {profile.name}")
    print(f" [EMAIL] {profile.email} | [TEL] {profile.phone}")
    print(f" [LOCATION] {profile.location}")
    print(f" [CREDENTIALS] CCNA Enterprise/Wireless, Festo AI in Manufacturing")
    print(f" [CAPSTONE] Hybrid Self-Checkout System (YOLOv8, 77.4% Precision)")
    print(f" [AWARD] INOTEK 2025 3rd Place (IoT Weight Tracking System)")
    print("=" * 65 + "\n")

    # Sample Job Postings
    sample_jobs = [
        JobPosting(
            job_id="JOB-101",
            company="TechNova Solutions",
            title="Network & Infrastructure Engineer",
            url="https://example.com/jobs/101",
            hr_email="careers@technova.example.com",
            description=(
                "We are seeking a Network Engineer skilled in Cisco Enterprise Networking, CCNA certification, "
                "OSPFv2 routing, VLAN configuration, WAN/LAN infrastructure, TCP/IP, and Python network automation."
            ),
        ),
        JobPosting(
            job_id="JOB-102",
            company="Cyberdyne Robotics",
            title="Industrial AI & Computer Vision Developer",
            url="https://example.com/jobs/102",
            hr_email="hr@cyberdyne.example.com",
            description=(
                "Looking for a Computer Vision Developer with experience in Python, OpenCV, YOLOv8 object detection, "
                "industrial automation, and AI predictive maintenance for smart manufacturing systems."
            ),
        ),
        JobPosting(
            job_id="JOB-103",
            company="Apex Enterprise",
            title="IT Technical Support Specialist",
            url="https://example.com/jobs/103",
            hr_email="jobs@apex.example.com",
            description=(
                "Seeking an IT Support Specialist responsible for Desktop Support, Windows troubleshooting, "
                "hardware maintenance, endpoint security monitoring, printer support, and user documentation."
            ),
        ),
        JobPosting(
            job_id="JOB-104",
            company="AgriTech Global",
            title="IoT & Embedded Systems Engineer",
            url="https://example.com/jobs/104",
            hr_email="talent@agritech.example.com",
            description=(
                "Join our IoT engineering team! Required: Arduino embedded microcontrollers, C/C++ programming, "
                "sensor interfacing (load cells, HX711), wireless telemetry, and MySQL database integration."
            ),
        ),
        JobPosting(
            job_id="JOB-105",
            company="Global Financial Corp",
            title="Senior Investment Accountant",
            url="https://example.com/jobs/105",
            hr_email="recruiting@globalfinancial.example.com",
            description=(
                "Seeking a Senior Investment Accountant with CPA qualification, hedge fund accounting experience, "
                "GAAP compliance, SEC filings, and quarterly portfolio financial audits."
            ),
        ),
    ]

    db_file = base_dir / "job_agent.db"
    excel_file = base_dir.parent / "JobTracker.xlsx"

    agent = JobApplicationAgent(
        job_queue=sample_jobs,
        db_path=str(db_file),
        excel_path=str(excel_file),
        candidate_memory_path=str(memory_path),
        headless=True,
        min_match_score=40.0,
        email_dry_run=True,  # Simulasi emel selamat
    )

    await agent.run()

    print("\n" + "=" * 65)
    print(" [EXCEL TRACKER READY] You can open your Job Application Tracker in Excel:")
    print(f"  Path: {excel_file.resolve()}")
    print("=" * 65 + "\n")


if __name__ == "__main__":
    asyncio.run(main())
