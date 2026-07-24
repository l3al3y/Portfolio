"""
Unit Tests for Multi-Portal Connectors (Unittest Framework)
"""

import unittest
import sys
from pathlib import Path

root_dir = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(root_dir / "src"))

from portals import MultiPortalAggregator, PortalJobQuery, PortalType

class TestMultiPortal(unittest.TestCase):

    def test_portal_aggregator_fetch(self):
        aggregator = MultiPortalAggregator()
        query = PortalJobQuery(keywords=["Network Engineer"])
        jobs = aggregator.fetch_all_portal_jobs(query)
        
        self.assertGreaterEqual(len(jobs), 4)
        companies = [j.company for j in jobs]
        self.assertTrue(any("Telekom Malaysia" in c for c in companies))
        self.assertTrue(any("Axiata" in c for c in companies))
        self.assertTrue(any("Petronas" in c for c in companies))
        self.assertTrue(any("Singtel" in c for c in companies))

if __name__ == "__main__":
    unittest.main()
