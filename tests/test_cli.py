"""
Unit test suite for Agent-Native CLI (cli.py)
"""

import sys
import unittest
import json
from pathlib import Path
from io import StringIO
from unittest.mock import patch

SRC_DIR = Path(__file__).resolve().parent.parent / "src"
if str(SRC_DIR) not in sys.path:
    sys.path.insert(0, str(SRC_DIR))

from cli import build_parser, main


class TestAgentCLI(unittest.TestCase):
    def setUp(self):
        self.parser = build_parser()

    def test_parser_construction(self):
        args = self.parser.parse_args(["--agent", "ats", "verify"])
        self.assertTrue(args.agent)
        self.assertEqual(args.subcommand, "ats")
        self.assertEqual(args.action, "verify")

    def test_brief_flag(self):
        with patch("sys.argv", ["cli.py", "--brief"]):
            with patch("sys.stdout", new_callable=StringIO) as mock_stdout:
                with self.assertRaises(SystemExit) as cm:
                    main()
                self.assertEqual(cm.exception.code, 0)
                output = mock_stdout.getvalue()
                self.assertIn("MUHAMMAD IRFAN FAHMI BIN SAMSUL KAMAR", output)

    def test_ats_evaluate_json(self):
        with patch("sys.argv", ["cli.py", "ats", "evaluate", "--title", "Network Engineer", "--desc", "CCNA Cisco OSPF VLAN"]):
            with patch("sys.stdout", new_callable=StringIO) as mock_stdout:
                with self.assertRaises(SystemExit) as cm:
                    main()
                self.assertEqual(cm.exception.code, 0)
                data = json.loads(mock_stdout.getvalue())
                self.assertEqual(data["status"], "success")
                self.assertIn("match_score", data["result"])


if __name__ == "__main__":
    unittest.main()
