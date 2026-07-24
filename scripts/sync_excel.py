"""
Standalone Excel Sync Utility
==============================
Jalankan skrip ini pada bila-bila masa untuk mengemaskini fail JobTracker.xlsx
berdasarkan rekod pangkalan data SQLite dan emel terkini.

Penggunaan:
    python sync_excel.py
"""

import os
import sys
from pathlib import Path

# Fix sys.path to point to root, src, and Template
root_dir = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(root_dir / "src"))
sys.path.insert(0, str(root_dir / "Template"))

from excel_tracker import ExcelTracker
from database import JobDatabase

def main():
    db_file = root_dir / "src" / "job_agent.db"
    if not db_file.exists():
        db_file = root_dir / "Template" / "job_agent.db"
    excel_file = root_dir / "JobTracker.xlsx"

    print("==================================================")
    print(" SYNCHRONIZING JOB APPLICATION TRACKER TO EXCEL")
    print(f" Database: {db_file}")
    print(f" Target Excel File: {excel_file}")
    print("==================================================")

    if not db_file.exists():
        print(f"Ralat: Pangkalan data {db_file} tidak ditemui.")
        sys.exit(1)

    tracker = ExcelTracker(excel_file)
    output_path = tracker.sync_from_db(db_file)

    print("\n" + "=" * 50)
    print(f" SUCCESS! Excel Tracker created successfully at:")
    print(f" {output_path.resolve()}")
    print("==================================================")

if __name__ == "__main__":
    main()
