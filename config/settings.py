"""
Centralized Configuration & Settings Module
============================================
Centralizes system paths, ATS match thresholds, currency standards,
and logging options to eliminate hardcoded values across the codebase.
"""

import os
from pathlib import Path

# Base Directory Resolution
BASE_DIR = Path(__file__).resolve().parent.parent

# AI & LLM Service Configuration
API_BASE_URL = os.getenv("API_BASE_URL", "https://rootsys.cloud/v1")
API_KEY = os.getenv("API_KEY", "fiq-a0fd300c5ed7b18a767f753f36547435")

# Data & Persistence Paths
DATA_DIR = BASE_DIR / "data"
DATA_DIR.mkdir(parents=True, exist_ok=True)

DB_PATH = DATA_DIR / "job_agent.db"
EXCEL_PATH = BASE_DIR / "JobTracker.xlsx"  # Kept at root or data/

# Memory & Document Paths
MEMORY_PATH = BASE_DIR / "PROJECT_MEMORY.md"
RESUME_DIR = BASE_DIR / "resume"
DOCS_DIR = BASE_DIR / "docs"

# Logging Paths
LOG_DIR = BASE_DIR / "logs"
LOG_DIR.mkdir(parents=True, exist_ok=True)
MAIN_LOG_PATH = LOG_DIR / "career_agent.log"

# Default ATS & Agent Rules
DEFAULT_MIN_MATCH_SCORE = 35.0
DEFAULT_EMAIL_DRY_RUN = True
DEFAULT_HEADLESS = True
MAX_CONSECUTIVE_ERRORS = 3

# Target Job Portals
TARGET_PORTALS = ["MYFutureJobs", "MauKerja", "JobStreet", "LinkedIn"]

# System Debug / Verbose Mode
VERBOSE_DEBUG_MODE = False
