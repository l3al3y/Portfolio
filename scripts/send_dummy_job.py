"""
Script to apply to a new high-match dummy job posting and sync directly to JobTracker.xlsx
"""

import sys
import asyncio
from pathlib import Path

# Fix sys.path to point to root, src, and Template
root_dir = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(root_dir / "src"))
sys.path.insert(0, str(root_dir / "Template"))

from agent import JobApplicationAgent
from models import JobPosting

async def run_dummy_application():
    memory_path = root_dir / "PROJECT_MEMORY.md"
    db_file = root_dir / "src" / "job_agent.db"
    if not db_file.exists():
        db_file = root_dir / "Template" / "job_agent.db"
    excel_file = root_dir / "JobTracker.xlsx"

    dummy_job = JobPosting(
        job_id="JOB-2026-TM01",
        company="Telekom Malaysia (TM R&D)",
        title="Enterprise Network & Security Automation Specialist",
        url="https://tm.com.my/careers/JOB-2026-TM01",
        hr_email="talent.acquisition@tm.com.my",
        description=(
            "Telekom Malaysia R&D is seeking an Enterprise Network & Security Automation Specialist. "
            "Qualifications required: CCNA Certification, Network Engineer experience, Cisco routing and switching, "
            "OSPF, VLAN, TCP/IP, Wireshark, Incident Response, Endpoint Security, Cybersecurity, "
            "Hardware Troubleshooting, IT Support, Desktop Support, Windows, Python, Automation, "
            "Industrial Automation, Computer Vision, OpenCV, YOLOv8, and Artificial Intelligence."
        )
    )

    print("==================================================")
    print(" SUBMITTING DUMMY JOB APPLICATION VIA AGENT ENGINE")
    print(f" Target Company: {dummy_job.company}")
    print(f" Target Title:   {dummy_job.title}")
    print("==================================================")

    agent = JobApplicationAgent(
        job_queue=[dummy_job],
        db_path=str(db_file),
        excel_path=str(excel_file),
        candidate_memory_path=str(memory_path),
        headless=True,
        min_match_score=30.0,
        email_dry_run=True,
    )

    await agent.run()

    print("\n" + "=" * 50)
    print(" DUMMY JOB APPLICATION COMPLETED & RECORDED!")
    print(f" Synced Excel Dashboard: {excel_file.resolve()}")
    print("==================================================")

if __name__ == "__main__":
    asyncio.run(run_dummy_application())
