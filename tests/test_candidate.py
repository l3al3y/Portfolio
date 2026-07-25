"""
Unit Tests for Candidate Memory & Explainable ATS Engine (Unittest Framework)
"""

import unittest
import sys
from pathlib import Path

root_dir = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(root_dir / "src"))
sys.path.insert(0, str(root_dir / "config"))

from candidate import CandidateProfile

class TestCandidateProfile(unittest.TestCase):

    def test_candidate_profile_defaults(self):
        profile = CandidateProfile._create_default_profile()
        self.assertEqual(profile.name, "MUHAMMAD IRFAN FAHMI BIN SAMSUL KAMAR")
        self.assertIn("f********7@gmail.com", profile.email)
        self.assertGreaterEqual(len(profile.education), 3)
        self.assertGreaterEqual(len(profile.certifications), 5)

    def test_analyze_job_match_scoring(self):
        profile = CandidateProfile._create_default_profile()
        result = profile.analyze_job_match(
            job_title="Senior Network & Infrastructure Engineer",
            job_description="Required skills: Cisco CCNA, Routing, Switching, OSPF, VLAN, TCP/IP, Wireshark, Python automation."
        )
        self.assertGreaterEqual(result["match_score"], 40.0)
        self.assertEqual(result["dominant_pillar"], "Networking")
        self.assertIn("ats_breakdown", result)
        self.assertGreater(result["interview_prob"].estimated_chance, 50.0)

    def test_generate_tailored_cover_letter(self):
        profile = CandidateProfile._create_default_profile()
        letter = profile.generate_tailored_cover_letter(
            job_title="Computer Vision Engineer",
            company="Cyberdyne Robotics",
            job_description="YOLOv8, OpenCV, Python industrial automation."
        )
        self.assertIn("Dear Hiring Manager at Cyberdyne Robotics", letter)

if __name__ == "__main__":
    unittest.main()
