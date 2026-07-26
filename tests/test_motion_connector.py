"""
Unit tests for Motion (UseMotion.com) Task & Calendar Connector.
"""

import unittest
import sys
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent.parent
SRC_DIR = ROOT_DIR / "src"
if str(SRC_DIR) not in sys.path:
    sys.path.insert(0, str(SRC_DIR))

from motion_connector import MotionConnector, MotionTask


class TestMotionConnector(unittest.TestCase):

    def setUp(self):
        self.connector = MotionConnector()

    def test_motion_connector_initialization(self):
        self.assertIsNotNone(self.connector)

    def test_motion_create_task_simulated(self):
        result = self.connector.create_task(
            name="Interview Prep: Network Engineer",
            description="Review OSPF, VLAN, and CCNA enterprise topics",
            duration_minutes=45,
            priority="HIGH"
        )
        self.assertIn("id", result)
        self.assertEqual(result.get("name"), "Interview Prep: Network Engineer")

    def test_motion_sync_application_deadline(self):
        result = self.connector.sync_application_deadline(
            job_title="IT Support Engineer",
            company="TechCorp Malaysia",
            deadline_days=2
        )
        self.assertIn("id", result)
        self.assertIn("TechCorp Malaysia", result.get("name", ""))


if __name__ == "__main__":
    unittest.main()
