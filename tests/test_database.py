"""
Unit Tests for SQLite Data Persistence Layer (Unittest Framework)
"""

import unittest
import os
import sys
import tempfile
from pathlib import Path

root_dir = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(root_dir / "src"))

from database import JobDatabase
from models import ApplicationRecord, ApplicationStatus

class TestJobDatabase(unittest.TestCase):

    def test_database_init_and_save(self):
        with tempfile.NamedTemporaryFile(suffix=".db", delete=False) as tmp:
            db_path = tmp.name

        try:
            db = JobDatabase(db_path)
            record = ApplicationRecord(
                job_id="TEST-001",
                company="Test Tech Enterprise",
                title="Systems Engineer",
                url="https://example.com/test",
                match_score=75.5,
                status=ApplicationStatus.APPLIED
            )
            db._sync_save_record(record)
            
            self.assertTrue(db._sync_is_duplicate("Test Tech Enterprise"))
            stats = db._sync_get_summary_stats()
            self.assertIn("APPLIED", stats)
            self.assertEqual(stats["APPLIED"]["count"], 1)
        finally:
            if os.path.exists(db_path):
                try:
                    os.remove(db_path)
                except PermissionError:
                    pass

if __name__ == "__main__":
    unittest.main()
