#!/usr/bin/env python3
"""
Root CLI Entry Point for Autonomous Career Intelligence Agent & ATS Portfolio System.
Exposes Agent-Native CLI interface (Agent CLI Spec v0.1).
"""

import sys
from pathlib import Path

# Insert src directory to path
SRC_DIR = Path(__file__).resolve().parent / "src"
if str(SRC_DIR) not in sys.path:
    sys.path.insert(0, str(SRC_DIR))

from cli import main

if __name__ == "__main__":
    main()
