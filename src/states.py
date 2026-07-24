"""
Modul State Enum
=================
Definisi formal bagi setiap state dalam Finite State Machine (FSM) agent.
"""

from enum import Enum, auto


class AgentState(Enum):
    IDLE = auto()             # Sedia, belum ada resource I/O dibuka
    FETCH_JOB = auto()        # Ambil job seterusnya + semak idempotency
    PARSE_DOM = auto()        # Navigasi & ekstrak data daripada halaman web
    THINK_LLM = auto()        # Reasoning: LLM menentukan tindakan & tailoring
    HUMAN_ACT = auto()        # Simulasi tindakan manusia (isi borang web)
    SEND_EMAIL = auto()       # Hantar emel permohonan / cover letter via SMTP
    CHECK_INBOX = auto()      # Semak emel masuk via IMAP untuk update temuduga/permohonan
    LOG_DATABASE = auto()     # Tulis hasil ke SQLite (long-term memory)
    EXPORT_EXCEL = auto()     # Eksport & selaraskan pangkalan data ke fail Excel (.xlsx)
    ERROR_RECOVERY = auto()   # Pusat pemulihan ralat (resilience / circuit breaker)
    DONE = auto()             # Terminal state - agent selesai
