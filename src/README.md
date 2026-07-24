# Autonomous Job Application Agent — Candidate Memory Blueprint

An autonomous, memory-augmented Job Application Agent built on a **Finite State Machine (FSM)** architecture and powered by the candidate profile of **Muhammad Irfan Fahmi bin Samsul Kamar** extracted from `PROJECT_MEMORY.md`.

---

## 🏗️ Architecture & FSM Overview

The agent operates as an explicit FSM controller with isolated state handlers, candidate memory matching, resilience mechanisms, and database persistence.

```
       +--------------+
       |     IDLE     |  --> Initialize Browser I/O (Playwright / Fallback Engine)
       +-------+------+
               |
               v
       +--------------+
  +--> |  FETCH_JOB   |  --> Pop job, check Idempotency in SQLite DB
  |    +-------+------+
  |            |
  |            v
  |    +--------------+
  |    |  PARSE_DOM   |  --> Extract job description & DOM inputs
  |    +-------+------+
  |            |
  |            v
  |    +--------------+
  |    |  THINK_LLM   |  --> Compute ATS Match Score & Tailor Cover Letter
  |    +-------+------+
  |            |  (Match >= Threshold)
  |            v
  |    +--------------+
  |    |  HUMAN_ACT   |  --> Auto-fill candidate credentials into forms
  |    +-------+------+
  |            |
  |            v
  |    +--------------+
  |    | LOG_DATABASE |  --> Persist application record to SQLite DB
  |    +-------+------+
  |            |
  +------------+ (Loop until Queue Empty -> DONE)
```

---

## 🧠 Candidate Memory Integration (`candidate.py`)

The agent dynamically integrates candidate memory from `PROJECT_MEMORY.md`:

- **Candidate Profile**: Muhammad Irfan Fahmi bin Samsul Kamar
- **Contact Details**: `fahmilatif87@gmail.com` | Melaka, Malaysia | [LinkedIn](https://linkedin.com/in/mifi99) | [GitHub](https://github.com/l3al3y) | `irfanfahmi.dev`
- **Education**: B.Cert Computer Engineering (UTeM), Dip. Electronic Engineering (Politeknik Port Dickson), Cert. Systems & Networking (Kolej Komuniti Selandar, CGPA 3.58).
- **Credentials & Certifications**:
  - Festo Professional Certificate – Industrial Automation with AI in Manufacturing
  - CCNA: Enterprise Networking, Security, and Automation
  - CCNA: Switching, Routing, and Wireless Essentials
  - Cisco Endpoint Security & Cyber Threat Management
- **Key Projects**:
  - Capstone: Hybrid Self-Checkout System (YOLOv8, 50 epochs, 77.4% Precision, <150ms latency)
  - IoT Livestock Weight Tracking System (INOTEK 2025 3rd Place, 98%+ precision)
- **42 ATS Target Keywords** mapped across 5 Technical Pillars:
  1. *Networking* (CCNA, Cisco, OSPF, VLAN, TCP/IP, WAN/LAN)
  2. *IT Support* (Desktop Support, Hardware Troubleshooting, User Support)
  3. *Security* (Cybersecurity, Endpoint Security, Incident Response)
  4. *Automation & AI* (Industrial Automation, Python, OpenCV, YOLOv8, Predictive Maintenance)
  5. *Embedded/IoT* (Arduino, Embedded Systems, Load cell/HX711, MySQL)

---

## 📁 Directory Structure

```
Template/
├── candidate.py     # Candidate Memory loader & ATS matching engine
├── models.py        # Data Transfer Objects (JobPosting, ApplicationRecord, ApplicationStatus)
├── states.py        # AgentState enum (IDLE, FETCH_JOB, PARSE_DOM, THINK_LLM, HUMAN_ACT, LOG_DATABASE, ERROR_RECOVERY, DONE)
├── database.py      # SQLite repository layer with non-blocking thread execution & schema migration
├── agent.py         # Main FSM controller, Playwright interaction, circuit breaker, & graceful error recovery
├── main.py          # Demo entry point testing candidate memory & diverse job postings
├── requirements.txt # Dependencies (Playwright)
└── README.md        # Architecture & documentation blueprint
```

---

## 🚀 Execution & Quickstart

```bash
# 1. Activate virtual environment (if using local environment)
.\library\Scripts\activate

# 2. Run the updated agent entry point
python main.py
```

### Verification & Database Inspection

The agent creates and updates `job_agent.db`. You can view application statistics, match scores, and stored cover letters inside SQLite.
