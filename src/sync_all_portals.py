"""
Skrip Pelancaran Multi-Portal Sync & Automated Application Engine
================================================================
Skrip ini menarik iklan jawatan daripada MYFutureJobs, MauKerja,
JobStreet, dan LinkedIn, membuat penilaian ATS, serta menyinkronkan
hasil ke SQLite dan Excel Tracker.
"""

import sys
import asyncio
from pathlib import Path

# Fix sys.path
sys.path.insert(0, str(Path(__file__).resolve().parent))

from agent import JobApplicationAgent
from portals import MultiPortalAggregator, PortalJobQuery

async def main():
    root_dir = Path(__file__).resolve().parent.parent
    memory_path = root_dir / "PROJECT_MEMORY.md"
    db_file = root_dir / "Template" / "job_agent.db"
    excel_file = root_dir / "JobTracker.xlsx"

    print("==================================================================")
    print(" MULTI-PORTAL SYNC ENGINE: MYFUTUREJOBS | MAUKERJA | JOBSTREET | LINKEDIN")
    print(" Candidate Profile: MUHAMMAD IRFAN FAHMI BIN SAMSUL KAMAR")
    print("==================================================================\n")

    aggregator = MultiPortalAggregator()
    query = PortalJobQuery(
        keywords=["Network Engineer", "IT Support", "Cybersecurity", "Computer Vision", "Automation"],
        location="Malaysia & Singapore"
    )

    portal_jobs = aggregator.fetch_all_portal_jobs(query)
    print(f"\n[PORTAL AGGREGATOR] Menerima {len(portal_jobs)} iklan pekerjaan merentasi 4 portal.\n")

    agent = JobApplicationAgent(
        job_queue=portal_jobs,
        db_path=str(db_file),
        excel_path=str(excel_file),
        candidate_memory_path=str(memory_path),
        headless=True,
        min_match_score=35.0,
        email_dry_run=True,
    )

    await agent.run()

    print("\n" + "=" * 65)
    print(" SUCCESS! Multi-Portal Jobs Processed & Recorded.")
    print(f" Excel Dashboard Updated at: {excel_file.resolve()}")
    print("==================================================================")

if __name__ == "__main__":
    asyncio.run(main())
