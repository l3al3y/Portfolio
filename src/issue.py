"""
Modul Pengurusan Isu & Maklum Balas Luar Talian (Offline Issue & Feedback Tracker)
=============================================================================
Mematuhi Spesifikasi Agent-Native CLI (Level 3).
Membenarkan ejen dan pengguna merekod isu, cadangan, atau ralat secara tempatan
dalam pangkalan data SQLite tanpa kebergantungan kepada perkhidmatan awan pihak ketiga.
"""

from __future__ import annotations
import sqlite3
import logging
from dataclasses import dataclass, field
from datetime import datetime
from pathlib import Path
from typing import List, Optional, Dict, Any

logger = logging.getLogger("job_agent.issue")

ISSUE_SCHEMA = """
CREATE TABLE IF NOT EXISTS system_issues (
    id               TEXT PRIMARY KEY,
    title            TEXT NOT NULL,
    category         TEXT NOT NULL DEFAULT 'bug',
    status           TEXT NOT NULL DEFAULT 'open',
    description      TEXT NOT NULL DEFAULT '',
    resolution_notes TEXT DEFAULT '',
    created_at       TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at       TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_issues_status ON system_issues(status);
CREATE INDEX IF NOT EXISTS idx_issues_category ON system_issues(category);
"""


@dataclass
class IssueRecord:
    id: str
    title: str
    category: str = "bug"  # bug, requirement, suggestion, bad-output
    status: str = "open"    # open, in-progress, resolved, closed
    description: str = ""
    resolution_notes: str = ""
    created_at: str = field(default_factory=lambda: datetime.utcnow().isoformat())
    updated_at: str = field(default_factory=lambda: datetime.utcnow().isoformat())

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "title": self.title,
            "category": self.category,
            "status": self.status,
            "description": self.description,
            "resolution_notes": self.resolution_notes,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
        }


class IssueManager:
    """Pengurus isu dan maklum balas luar talian."""

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
            conn.executescript(ISSUE_SCHEMA)
            conn.commit()

    def create_issue(self, title: str, category: str = "bug", description: str = "") -> IssueRecord:
        """Mencipta isu baharu secara automatik dengan ID berurut."""
        valid_categories = {"bug", "requirement", "suggestion", "bad-output"}
        if category not in valid_categories:
            category = "bug"

        with self._get_connection() as conn:
            cur = conn.execute("SELECT COUNT(*) as cnt FROM system_issues")
            count = cur.fetchone()["cnt"] + 1
            issue_id = f"ISSUE-{count:03d}"
            now = datetime.utcnow().isoformat()

            conn.execute(
                """
                INSERT INTO system_issues (id, title, category, status, description, created_at, updated_at)
                VALUES (?, ?, ?, 'open', ?, ?, ?)
                """,
                (issue_id, title, category, description, now, now),
            )
            conn.commit()

        logger.info("Isu baharu dicipta: %s (%s)", issue_id, title)
        return IssueRecord(
            id=issue_id, title=title, category=category, status="open",
            description=description, created_at=now, updated_at=now
        )

    def list_issues(self, status: Optional[str] = None, category: Optional[str] = None) -> List[IssueRecord]:
        """Menyenaraikan semua isu dengan tapisan status/kategori."""
        query = "SELECT * FROM system_issues WHERE 1=1"
        params: list = []

        if status:
            query += " AND status = ?"
            params.append(status)
        if category:
            query += " AND category = ?"
            params.append(category)

        query += " ORDER BY created_at DESC"

        with self._get_connection() as conn:
            cur = conn.execute(query, params)
            rows = cur.fetchall()
            return [
                IssueRecord(
                    id=row["id"], title=row["title"], category=row["category"],
                    status=row["status"], description=row["description"],
                    resolution_notes=row["resolution_notes"] or "",
                    created_at=row["created_at"], updated_at=row["updated_at"]
                )
                for row in rows
            ]

    def get_issue(self, issue_id: str) -> Optional[IssueRecord]:
        """Mendapatkan maklumat lanjut bagi satu isu mengikut ID."""
        with self._get_connection() as conn:
            cur = conn.execute("SELECT * FROM system_issues WHERE id = ?", (issue_id,))
            row = cur.fetchone()
            if not row:
                return None
            return IssueRecord(
                id=row["id"], title=row["title"], category=row["category"],
                status=row["status"], description=row["description"],
                resolution_notes=row["resolution_notes"] or "",
                created_at=row["created_at"], updated_at=row["updated_at"]
            )

    def resolve_issue(self, issue_id: str, notes: str = "") -> Optional[IssueRecord]:
        """Menanda isu sebagai 'resolved' bersama nota penyelesaian."""
        now = datetime.utcnow().isoformat()
        with self._get_connection() as conn:
            cur = conn.execute(
                """
                UPDATE system_issues
                SET status = 'resolved', resolution_notes = ?, updated_at = ?
                WHERE id = ?
                """,
                (notes, now, issue_id),
            )
            conn.commit()

            if cur.rowcount == 0:
                return None

        return self.get_issue(issue_id)
