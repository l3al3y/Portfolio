"""
Modul Data Persistence (Lapisan Storan SQLite)
==============================================
Lapisan ini bertanggungjawab terhadap long-term memory agent -- iaitu jejak
audit (audit trail) bagi setiap pekerjaan yang telah diproses.
"""

from __future__ import annotations
import sqlite3
import asyncio
import logging
from pathlib import Path
from typing import List, Optional, Dict, Any

try:
    from .models import ApplicationRecord, ApplicationStatus
except ImportError:
    from models import ApplicationRecord, ApplicationStatus

logger = logging.getLogger("job_agent.database")

SCHEMA = """
CREATE TABLE IF NOT EXISTS applied_jobs (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    job_id          TEXT NOT NULL,
    title           TEXT NOT NULL DEFAULT '',
    company         TEXT NOT NULL,
    url             TEXT NOT NULL,
    match_score     REAL NOT NULL DEFAULT 0.0,
    status          TEXT NOT NULL,
    cover_letter    TEXT,
    error_message   TEXT,
    last_contact_at TEXT,
    created_at      TEXT NOT NULL DEFAULT (datetime('now')),
    UNIQUE(company)
);

CREATE INDEX IF NOT EXISTS idx_applied_company ON applied_jobs(company);
CREATE INDEX IF NOT EXISTS idx_applied_status  ON applied_jobs(status);
"""


class JobDatabase:
    """Data Access Layer bagi pengurusan rekod permohonan kerja."""

    def __init__(self, db_path: str = "job_agent.db") -> None:
        self.db_path = Path(db_path)
        self._init_schema()

    def _get_connection(self) -> sqlite3.Connection:
        conn = sqlite3.connect(self.db_path, timeout=10)
        conn.execute("PRAGMA journal_mode=WAL;")
        conn.row_factory = sqlite3.Row
        return conn

    def _init_schema(self) -> None:
        with self._get_connection() as conn:
            conn.executescript(SCHEMA)
            # Semak sekiranya kolum baharu perlu ditambah (migration safety)
            cursor = conn.execute("PRAGMA table_info(applied_jobs)")
            cols = [row["name"] for row in cursor.fetchall()]
            if "title" not in cols:
                conn.execute("ALTER TABLE applied_jobs ADD COLUMN title TEXT NOT NULL DEFAULT ''")
            if "match_score" not in cols:
                conn.execute("ALTER TABLE applied_jobs ADD COLUMN match_score REAL NOT NULL DEFAULT 0.0")
            if "cover_letter" not in cols:
                conn.execute("ALTER TABLE applied_jobs ADD COLUMN cover_letter TEXT")
            if "last_contact_at" not in cols:
                conn.execute("ALTER TABLE applied_jobs ADD COLUMN last_contact_at TEXT")
            conn.commit()
        logger.info("Skema pangkalan data disahkan di %s", self.db_path)

    # ---- Sync Operations ----

    def _sync_is_duplicate(self, company: str) -> bool:
        with self._get_connection() as conn:
            cur = conn.execute(
                "SELECT 1 FROM applied_jobs WHERE company = ? AND status IN (?, ?) LIMIT 1",
                (company, ApplicationStatus.APPLIED.value, "INTERVIEW_INVITE"),
            )
            return cur.fetchone() is not None

    def _sync_save_record(self, record: ApplicationRecord) -> None:
        with self._get_connection() as conn:
            conn.execute(
                """
                INSERT INTO applied_jobs (job_id, title, company, url, match_score, status, cover_letter, error_message)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                ON CONFLICT(company) DO UPDATE SET
                    title         = excluded.title,
                    url           = excluded.url,
                    match_score   = excluded.match_score,
                    status        = excluded.status,
                    cover_letter  = excluded.cover_letter,
                    error_message = excluded.error_message,
                    created_at    = datetime('now')
                """,
                (
                    record.job_id,
                    record.title,
                    record.company,
                    record.url,
                    record.match_score,
                    record.status.value if isinstance(record.status, ApplicationStatus) else str(record.status),
                    record.cover_letter,
                    record.error_message,
                ),
            )
            conn.commit()

    def _sync_update_status_from_email(self, company: str, new_status: str, note: str) -> bool:
        with self._get_connection() as conn:
            cur = conn.execute(
                """
                UPDATE applied_jobs
                SET status = ?, last_contact_at = datetime('now'), error_message = ?
                WHERE company LIKE ? OR company = ?
                """,
                (new_status, note, f"%{company}%", company),
            )
            conn.commit()
            return cur.rowcount > 0

    def _sync_get_all_companies(self) -> List[str]:
        with self._get_connection() as conn:
            cur = conn.execute("SELECT company FROM applied_jobs")
            return [row["company"] for row in cur.fetchall()]

    def _sync_get_summary_stats(self) -> Dict[str, Any]:
        with self._get_connection() as conn:
            cur = conn.execute(
                """
                SELECT status, COUNT(*) as count, AVG(match_score) as avg_score
                FROM applied_jobs
                GROUP BY status
                """
            )
            rows = cur.fetchall()
            stats = {row["status"]: {"count": row["count"], "avg_score": round(row["avg_score"] or 0, 1)} for row in rows}
            return stats

    # ---- Async Interfaces ----

    async def is_duplicate(self, company: str) -> bool:
        return await asyncio.to_thread(self._sync_is_duplicate, company)

    async def save_record(self, record: ApplicationRecord) -> None:
        await asyncio.to_thread(self._sync_save_record, record)

    async def update_status_from_email(self, company: str, new_status: str, note: str) -> bool:
        return await asyncio.to_thread(self._sync_update_status_from_email, company, new_status, note)

    async def get_all_companies(self) -> List[str]:
        return await asyncio.to_thread(self._sync_get_all_companies)

    async def get_summary_stats(self) -> Dict[str, Any]:
        return await asyncio.to_thread(self._sync_get_summary_stats)
