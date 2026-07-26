# 🚀 Autonomous Career Intelligence Engine & Agent-Native ATS Portfolio

[![Agent-Native Spec](https://img.shields.io/badge/Agent--Native-Spec_v0.1_Certified-0284c7.svg?style=for-the-badge&logo=openai)](AGENTS.md)
[![ATS Score](https://img.shields.io/badge/ATS_Keyword_Match-100.0%25-34d399.svg?style=for-the-badge&logo=checkmarx)](resume/verify_ats.py)
[![Chatbot Accuracy](https://img.shields.io/badge/Chatbot_1.2K_Benchmark-100.0%25_Pass-8b5cf6.svg?style=for-the-badge&logo=probot)](scripts/generate_and_evaluate_1k.py)
[![Python Version](https://img.shields.io/badge/Python-3.10%2B-fbbf24.svg?style=for-the-badge&logo=python)](cli.py)
[![License](https://img.shields.io/badge/License-MIT-a855f7.svg?style=for-the-badge)](LICENSE)
[![Live Portfolio](https://img.shields.io/badge/Live_Portfolio-GitHub_Pages-38bdf8.svg?style=for-the-badge&logo=github)](https://l3al3y.github.io/ResumeAgent/)

> **Agent-Native CLI & Autonomous Career Intelligence System** engineered for **MUHAMMAD IRFAN FAHMI BIN SAMSUL KAMAR** — Computer Engineering Graduate, Cisco CCNA Certified Network Specialist, and Festo Industrial AI Developer.

---

## 🌐 Live Portfolio & Interactive App
- 🔗 **Live Web Application:** [https://l3al3y.github.io/ResumeAgent/](https://l3al3y.github.io/ResumeAgent/)
- 📱 **Mobile-First Responsive Architecture:** Features 3D WebGL Constellation (Three.js), Floating Circle FAB Multilingual AI Assistant Widget, Cloudflare Turnstile CAPTCHA Contact Protection, and 4-Language Adaptability Switcher (EN, BM, CN, IN).

---

## 👨‍💻 Candidate Overview

```text
Name:        MUHAMMAD IRFAN FAHMI BIN SAMSUL KAMAR
Age:         26–27 years old (Born 1999)
Degree:      Bachelor of Computer Engineering with Honours (UTeM, Expected Nov 2026)
Diploma:     Diploma in Electronic Engineering (Computer) (Politeknik Port Dickson, CGPA 3.26)
Certificate: Sijil Sistem Komputer dan Rangkaian (Kolej Komuniti Selandar, CGPA 3.58 - Best Student)
Location:    Puchong, Selangor, Malaysia
Credentials: Cisco CCNA (Enterprise & Routing), Festo Industrial AI, Endpoint Security, Cyber Threat Management
Military:    Askar Wataniah Reserve (Malaysian Army - High Discipline & Stress Resilience)
```

### Executive Summary & Growth Mindset
> *"I'm a Computer Engineering graduate who enjoys turning ideas into practical solutions through software, networking, and AI. My interests span IT support, full-stack web development, cloud technologies, and automation, and I'm always looking for opportunities to learn and apply new tools. I enjoy building projects that improve workflows, strengthen my technical skills, and demonstrate real-world problem-solving. My goal is to grow into an engineer who bridges hardware, software, and artificial intelligence to create reliable and impactful technology."*

---

## 🌟 Key Architecture & Capabilities

### 1. 🤖 Agent-Native Level Certification (CLI Spec v0.1)
- **JSON Output by Default:** All subcommands output structured JSON to `stdout` for autonomous agent orchestration.
- **Human Mode (`--human`):** Rich terminal UI with colored gauges, tables, and panels powered by `rich`.
- **Fail-Fast Standard & Standard Exit Codes:** Structured JSON error payloads to `stderr` with strict exit codes (`0`: Success, `2`: Missing Param, `20`: Not Found).

### 2. 🧠 100.0% Verified Multilingual AI Chatbot & Large-Scale Benchmark Engine
- **Structured Retrieval Engine over `RESUME_DATA`:** 28+ spontaneous intent categories spanning English, Bahasa Melayu (🇲🇾), Chinese 华语 (🇨🇳), and Tamil தமிழ் (🇮🇳).
- **Interactive Suggestion Prompt Chips:** 32 suggestion prompt chips across 4 languages backed by dedicated proficient response branches.
- **1.2K Synthetic High-Throughput Stress Suite (`scripts/generate_and_evaluate_1k.py`):** Generates and evaluates 1,200 multi-lingual, code-switched, typo-ridden synthetic queries achieving **100.0% Pass Accuracy (1200/1200 passed)**.
- **Manual Benchmark Suite (`scripts/evaluate_chatbot.py`):** 149-query challenge test suite achieving **100.0% Pass Accuracy (149/149 passed)**.

### 3. 🔒 Cloudflare Turnstile CAPTCHA Contact Protection
- Deployed Cloudflare Worker `contact-gate-worker` (`0x4AAAAAAD9nlicfqO7QQsBk` sitekey) to perform server-side siteverify before revealing candidate Email & Phone.
- **Zero Plaintext Leakage:** No plaintext or base64 contact strings exist in client-side HTML source files.

### 4. 📄 100.0% Verified ATS Resume Suite (`verify_ats.py`)
- Standardized 1-Page A4 printable HTML resume (`resume/resume.html`), Markdown (`resume/resume.md`), and Plain Text (`resume/resume.txt`).
- **Empirically Verified Score:** `100.0% Keyword Match` (42/42 target network, AI, and IT support keywords).

---

## ⚡ Quick CLI Reference & Usage

```bash
# 1. Candidate Briefing & Identity Summary
python cli.py --brief

# 2. Evaluate ATS Match for a Job Opportunity
python cli.py ats evaluate --title "Network Engineer" --desc "Cisco CCNA OSPF VLAN Security" --company "TechNova"

# 3. Verify ATS Resume Keyword Match Score (100% Target)
python cli.py ats verify

# 4. Run Automated Chatbot Intelligence Benchmark (100% Target)
python scripts/evaluate_chatbot.py

# 5. Generate Standard ATS Resume Formats (HTML / MD / TXT)
python cli.py resume generate --format md --out resume/resume.md

# 6. List Application Pipeline & Add Applications
python cli.py job list
python cli.py job add --title "DevOps Engineer" --company "CloudCorp" --url "https://example.com" --desc "AWS Linux Python"

# 7. Execute Multi-Portal Sync Engine
python cli.py portal sync --portal all

# 8. Export Master Excel Tracker (JobTracker.xlsx)
python cli.py tracker export

# 9. Manage Offline Feedback Issues
python cli.py issue create --title "Score anomaly" --category bug --desc "Score dropped unexpectedly"
python cli.py issue list --status open
python cli.py issue resolve --id ISSUE-1 --notes "Fixed keyword dictionary"

# 10. Launch Autonomous Agent Execution Loop
python cli.py agent run
```

---

## 📁 Repository Structure

```text
ResumeAgent/
├── index.html                        # Primary WebGL 3D Portfolio & Floating AI Assistant App
├── PROJECT_MEMORY.md                 # Single Source of Truth for Candidate Profile & Memory
├── AGENTS.md                         # Agent & Maintainer Guidelines (CLI Spec v0.1)
├── README.md                         # Project Master Documentation
├── cli.py                            # Agent-Native CLI Entrypoint
├── src/                              # Autonomous Agent Engine & Core Logic
│   ├── agent.py                      # FSM Controller Engine
│   ├── models.py                     # Dataclasses & DTO Schemas
│   ├── database.py                   # SQLite Persistence Layer (WAL Mode)
│   ├── candidate.py                  # Candidate Profile Loader & ATS Match Engine
│   ├── excel_tracker.py              # Multi-Sheet Excel Tracker Exporter
│   ├── portals.py                    # Multi-Portal Connectors (MYFutureJobs, MauKerja, JobStreet, LinkedIn)
│   ├── sync_all_portals.py           # Multi-Portal Launcher
│   ├── issue.py                      # Offline Feedback Issue System
│   └── job_agent.db                  # SQLite Database
├── scripts/                          # Evaluation & Benchmark Harnesses
│   └── evaluate_chatbot.py           # 117-Query Chatbot Intelligence Evaluator (100.0% Benchmark)
├── web/                              # Web Application Mirrors
│   ├── index.html                    # Synced Entrypoint
│   └── portfolio.html                # Synced Entrypoint
├── resume/                           # 100% ATS Verified Resume Suite
│   ├── resume.html                   # Printable 1-Page A4 ATS Resume
│   ├── resume.md                     # Markdown ATS Resume
│   ├── resume.txt                    # Plain Text ATS Resume
│   └── verify_ats.py                 # Keyword Verification Tool (100.0% Match)
├── tests/                            # Unit Test Suite (11/11 Passed)
│   ├── test_candidate.py
│   ├── test_chatbot_engine.py        # Automated Chatbot Intent Benchmark Test
│   ├── test_cli.py
│   ├── test_database.py
│   ├── test_issue.py
│   └── test_portals.py
└── data/                             # Data Storage
    ├── chatbot_benchmark_report.json # Benchmark Report Log (100.0% Pass Report)
    ├── job_agent.db                  # Local Audit Database
    └── JobTracker.xlsx               # Master Excel Spreadsheet
```

---

## 🛠️ Local Development & Web Server

```bash
# Clone Repository
git clone https://github.com/l3al3y/ResumeAgent.git
cd ResumeAgent

# Run Unit Test Suite (11/11 Passed)
python -m unittest discover -s tests

# Run Chatbot Intelligence Benchmark (100% Target)
python scripts/evaluate_chatbot.py

# Start Local Web Server
python -m http.server 8000
# Open http://localhost:8000 in your browser
```

---

## 🛡️ Dual Confidence Metrics Standard

- **Execution Confidence:** `100%` (Empirically verified runtime, SQLite DB write, and Excel file export)
- **Analysis Confidence:** `100%` (100% ATS keyword match & 100% Chatbot benchmark accuracy score)

---

## 📄 License & Maintainer

Maintained by **MUHAMMAD IRFAN FAHMI BIN SAMSUL KAMAR**.  
Licensed under the [MIT License](LICENSE).
