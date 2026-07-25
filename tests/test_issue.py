"""
Unit test suite for Offline Issue Tracker (src/issue.py)
"""

import sys
import unittest
import tempfile
from pathlib import Path

SRC_DIR = Path(__file__).resolve().parent.parent / "src"
if str(SRC_DIR) not in sys.path:
    sys.path.insert(0, str(SRC_DIR))

from issue import IssueManager, IssueRecord


class TestIssueManager(unittest.TestCase):
    def setUp(self):
        self.tmp_db = tempfile.NamedTemporaryFile(suffix=".db", delete=False)
        self.tmp_db.close()
        self.mgr = IssueManager(db_path=self.tmp_db.name)

    def tearDown(self):
        try:
            Path(self.tmp_db.name).unlink(missing_ok=True)
        except PermissionError:
            pass


    def test_create_and_get_issue(self):
        issue = self.mgr.create_issue(
            title="Test Issue",
            category="bug",
            description="Test Description"
        )
        self.assertEqual(issue.id, "ISSUE-001")
        self.assertEqual(issue.status, "open")

        fetched = self.mgr.get_issue("ISSUE-001")
        self.assertIsNotNone(fetched)
        self.assertEqual(fetched.title, "Test Issue")

    def test_resolve_issue(self):
        self.mgr.create_issue(title="To Resolve", category="suggestion")
        resolved = self.mgr.resolve_issue("ISSUE-001", notes="Fixed successfully.")
        self.assertIsNotNone(resolved)
        self.assertEqual(resolved.status, "resolved")
        self.assertEqual(resolved.resolution_notes, "Fixed successfully.")


if __name__ == "__main__":
    unittest.main()
