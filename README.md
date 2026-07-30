# 🚀 MUHAMMAD IRFAN FAHMI — Computer Engineering Portfolio & AI Career Agent

[![Live Portfolio](https://img.shields.io/badge/Live_Portfolio-GitHub_Pages-38bdf8.svg?style=for-the-badge&logo=github)](https://l3al3y.github.io/ResumeAgent/)
[![Cisco CCNA Certified](https://img.shields.io/badge/Cisco-CCNA_Enterprise-1ba0d7.svg?style=for-the-badge&logo=cisco)](certificates/)
[![Festo Industrial AI](https://img.shields.io/badge/Festo-Industrial_AI-005293.svg?style=for-the-badge)](certificates/)
[![Recruiter Safety Audit](https://img.shields.io/badge/Recruiter_QA_Audit-370%2F370_Pass_(100%25)-059669.svg?style=for-the-badge)](scripts/)
[![1M Context AI Router](https://img.shields.io/badge/AI_Router-1M_Context_17_Models-7c3aed.svg?style=for-the-badge)](AGENTS.md)
[![ATS Resume Score](https://img.shields.io/badge/ATS_Keyword_Match-100.0%25-047857.svg?style=for-the-badge)](resume/resume.pdf)
[![Backend Engine Sync](https://img.shields.io/badge/Backend_Engine-Commit_6d44b23_(v1.14.0)-6366f1.svg?style=for-the-badge&logo=fastapi)](https://github.com/l3al3y/ResumeAgent-Backend/commit/6d44b23)

> **Official Personal Engineering Portfolio & Agent-Native Application** for **MUHAMMAD IRFAN FAHMI BIN SAMSUL KAMAR**, a Computer Engineering graduate specializing in Network Engineering, IT Infrastructure, Cyber Security, Computer Vision, and Industrial AI Automation.

---

## 🌐 Quick Links & Live Application

- 🔗 **Live Web Application**: [https://l3al3y.github.io/ResumeAgent/](https://l3al3y.github.io/ResumeAgent/)
- 📄 **Printable 1-Page A4 PDF Resume**: [resume/resume.pdf](resume/resume.pdf)
- 📜 **Official Certifications**: [certificates/](certificates/)
- ⚙️ **Backend Engine Sync (Milestones 1–14)**: [https://github.com/l3al3y/ResumeAgent-Backend](https://github.com/l3al3y/ResumeAgent-Backend) `(Synced at Commit: 6d44b23)`

---

## 👨‍💻 Candidate Profile Summary

```text
Candidate:      MUHAMMAD IRFAN FAHMI BIN SAMSUL KAMAR
Target Roles:   Network Engineer | IT Infrastructure | IT Support | Network Security | AI Automation | Embedded Systems
Education:      B.Eng Computer Engineering (Hons) — UTeM (Expected Nov 2026)
                Diploma in Electronic Engineering (Computer) — Politeknik Port Dickson (3.26 CGPA)
                Certificate in System & Networking — Kolej Komuniti Selandar (3.58 CGPA, Best Student Award)
Certifications: Cisco CCNA (Enterprise Networking, Switching & Routing)
                Festo Industrial Automation with AI
                Cisco Endpoint Security & Cyber Threat Management
                Fiber Optic Splicing & Polishing
Location:       Puchong, Selangor, Malaysia (Open to On-site, Hybrid, Relocation & Outstation)
Military:       Askar Wataniah (Territorial Army Reserve — High Discipline & Stress Resilience)
```

---

## 🛒 Featured Capstone Project Spotlight

### **Hybrid Self-Checkout System (Computer Vision + Barcode Integration)**

Designed to prevent item evasion and fraud in automated self-checkout systems by cross-referencing visual object detection against physical barcode scans.

```mermaid
graph TD
    A[Product Placed on Checkout Platform] --> B[USB Barcode Reader Node]
    A --> C[YOLOv8 Camera Vision Node]
    B --> D[Cross-Verification Engine]
    C --> D
    D -->|Barcode & Vision Match| E[MySQL Inventory Sync & Approval]
    D -->|Mismatch / Evasion Detected| F[Security Audit Alert & Flag]
```

#### **Key Technical Achievements & Verified Benchmarks:**
- 🧠 **Dual Verification Engine:** Integrates YOLOv8 PyTorch model with OpenCV live camera feed, USB barcode scanner (serial HID interface), and MySQL database synchronization.
- 📊 **Verified Metrics at 50 Epochs:**
  - **77.4% Precision** *(Custom local product dataset)*
  - **72.0% Recall** *(50 Epochs training)*
  - **<90ms Real-Time Camera Inference Latency**
- 📹 **Split-View Camera Fusion:** Conducted dual-view camera placement experiments to eliminate product occlusion and mitigate false negatives during scanning.

---

## ⚡ Primary RootSys Cloud AI Career Assistant Architecture

The portfolio features a live, interactive **AI Career Assistant** powered directly by **RootSys Cloud API** (`https://rootsys.cloud/v1`) via Cloudflare Worker Proxy with **100% Live Execution**, **High Availability Provider Policy**, and **1M-Token Context Persistence**:

```mermaid
graph LR
    UserQuery[Recruiter / Visitor Inquiry] --> Router[RootSys Cloud Primary Gateway]
    Router -->|Primary General & Career Representative| GLM51[glm-5.1]
    Router -->|Computer Vision, YOLOv8 & Camera Inspection| GLM52[glm-5.2]
    Router -->|Code, Scripts, Python, C++ & SQL| DS4Pro[deepseek-v4-pro]
    Router -->|High-Speed Summaries & Fast Execution| DS4Flash[deepseek-v4-flash]
    Router -->|High-Context Reasoning & Deep Profile Evaluation| MiniMax[minimax-m3]
    Router -->|Long-Form Technical & Architecture Synthesis| KimiK3[kimi-k3]
    Router -->|Multilingual Dialect & Natural Communication| KimiK27[kimi-k2.7]
    Router -->|Network Protocol & Automation Analysis| HY3[hy3-tencent]
```

### **RootSys Production High Availability & Security Standards:**
- **RootSys First Policy:** 100% of normal traffic is served directly by RootSys Cloud (`https://rootsys.cloud/v1`). Zero load balancing, zero cost routing, zero latency degradation.
- **Emergency Fallback Protection:** Emergency backup (OpenRouter free models) is triggered **ONLY** during verified infrastructure outages (HTTP 500/502/503/504, 429, timeouts).
- **Forbidden Fallback Guardrail:** Switching providers is strictly **FORBIDDEN** for configuration or authorization errors (HTTP 401/403/404). Real status codes are returned directly without hiding issues.
- **Zero Secrets in Frontend:** API keys are bound exclusively in Cloudflare Worker edge environment (`env.ROOTSYS_API_KEY`).
- **370 / 370 Recruiter QA Pass (100.0%):** Verified across 17 intent categories with strict candidate profile veracity (CCNA Certification = YES).

---

## 🛠️ Core Engineering Capabilities

| Domain | Key Skills & Technologies |
|---|---|
| **Networking & Infrastructure** | Cisco CCNA, OSPF, VLAN, Inter-VLAN Routing, STP, EtherChannel, TCP/IP, Wireshark, Cisco Packet Tracer, Fiber Optic Splicing |
| **IT Support & Operations** | Workstation Assembly, PC Maintenance, Windows Administration, Driver Deployment, Technical Documentation, User Support |
| **Cybersecurity** | Cisco Endpoint Security, Cyber Threat Management, Host Hardening, Firewall ACLs, Threat Mitigation, Cloudflare Turnstile |
| **Computer Vision & AI** | Python, OpenCV, YOLOv8 PyTorch, Model Fine-Tuning, Dataset Preparation, Real-Time Video Stream Inference |
| **Hardware & IoT** | Microcontrollers, Arduino, Sensors (HX711, Load Cells), EasyEDA Schematic Design, Embedded C/C++ Firmware |

---

## 📄 Printable Resume & Credentials

- 📄 **1-Page A4 Printable PDF Resume**: [`resume/resume.pdf`](resume/resume.pdf)
- 🌐 **HTML ATS Resume Mirror**: [`resume/resume.html`](resume/resume.html)
- 📜 **Verified Certificates Folder**: [`certificates/`](certificates/)

---

© 2026 **Muhammad Irfan Fahmi Bin Samsul Kamar** · Built with HTML5, Vanilla CSS3, JavaScript & Autonomous Agent Engineering.
