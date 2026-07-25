"""
Modul Profil & Memori Calon (Candidate Memory Layer)
=====================================================
Modul ini bertanggungjawab memuatkan, mengurus, dan menganalisis profil
serta memori calon daripada fail PROJECT_MEMORY.md.

Ia mengekstrak maklumat calon secara dinamik (atau menggunakan rekod fallback)
dan menyediakan kaedah penilaian padanan ATS (ATS match scoring), penjanaan
surat iringan (cover letter) khusus mengikut domain pekerjaan, serta penyediaan
data bagi isian borang otomatik.
"""

from __future__ import annotations
import re
import logging
from dataclasses import dataclass, field
from pathlib import Path
from typing import Dict, List, Optional, Set

logger = logging.getLogger("job_agent.candidate")


@dataclass
class EducationItem:
    degree: str
    institution: str
    period: str
    details: str


@dataclass
class CertificationItem:
    name: str
    issuer: str
    date: str
    skills: str


@dataclass
class ProjectItem:
    title: str
    tagline: str
    tech_stack: List[str]
    metrics: str


@dataclass
class CandidateProfile:
    name: str = "MUHAMMAD IRFAN FAHMI BIN SAMSUL KAMAR"
    email: str = "f********7@gmail.com [PROTECTED]"
    phone: str = "+60 1X-XXX XXXX [PROTECTED]"
    location: str = "Puchong, Malaysia"
    linkedin: str = "https://linkedin.com/in/mifi99"
    github: str = "https://github.com/l3al3y"
    portfolio: str = "https://l3al3y.github.io/ResumeAgent/"

    education: List[EducationItem] = field(default_factory=list)
    certifications: List[CertificationItem] = field(default_factory=list)
    projects: List[ProjectItem] = field(default_factory=list)
    awards: List[str] = field(default_factory=list)
    keywords_by_pillar: Dict[str, List[str]] = field(default_factory=dict)
    all_keywords: List[str] = field(default_factory=list)

    @classmethod
    def from_markdown_file(cls, filepath: str | Path = "PROJECT_MEMORY.md") -> CandidateProfile:
        """
        Membaca dan mengekstrak data calon daripada PROJECT_MEMORY.md.
        Jika fail tidak ditemui, profil fallback default akan digunakan.
        """
        path = Path(filepath)
        if not path.is_file():
            # Cuba cari di direktori induk jika tiada dalam cwd
            parent_path = path.parent.parent / "PROJECT_MEMORY.md"
            if parent_path.is_file():
                path = parent_path
            else:
                logger.warning("PROJECT_MEMORY.md tidak ditemui di %s. Menggunakan profil fallback.", path)
                return cls._create_default_profile()

        try:
            content = path.read_text(encoding="utf-8")
            return cls._parse_markdown(content)
        except Exception as e:
            logger.error("Gagal membaca PROJECT_MEMORY.md: %s. Menggunakan fallback.", e)
            return cls._create_default_profile()

    @classmethod
    def _create_default_profile(cls) -> CandidateProfile:
        """Membuat profil lalai calon Muhammad Irfan Fahmi bin Samsul Kamar."""
        profile = cls()
        profile.education = [
            EducationItem(
                degree="Bachelor of Computer Engineering with Honours",
                institution="Universiti Teknikal Malaysia Melaka (UTeM)",
                period="October 2022 – Present (Expected Nov 2026)",
                details="Computer Networks, Operating Systems, Computer Architecture, Microcontroller Systems, AI & Computer Vision."
            ),
            EducationItem(
                degree="Diploma in Electronic Engineering (Computer)",
                institution="Politeknik Port Dickson",
                period="December 2018 – May 2022",
                details="Embedded Systems, Digital Electronics, Network Infrastructure, Microcontroller Interfacing."
            ),
            EducationItem(
                degree="Certificate in Computer Systems and Networking",
                institution="Kolej Komuniti Selandar",
                period="July 2017 – February 2019",
                details="CGPA: 3.58 / 4.00 | Awarded Best Student of the Semester."
            )
        ]

        profile.certifications = [
            CertificationItem(
                name="Festo Professional Certificate – Industrial Automation with AI in Manufacturing",
                issuer="Festo Didactic",
                date="16 July 2026",
                skills="Applied AI, predictive maintenance, quality inspection, energy optimization, AI model integration."
            ),
            CertificationItem(
                name="CCNA: Enterprise Networking, Security, and Automation",
                issuer="Cisco Networking Academy / UTeM FTKE",
                date="23 February 2026",
                skills="WAN architectures, OSPFv2, QoS, network virtualization, REST APIs, network automation."
            ),
            CertificationItem(
                name="CCNA: Switching, Routing, and Wireless Essentials",
                issuer="Cisco Networking Academy / UTeM FTKE",
                date="23 February 2026",
                skills="VLANs, Inter-VLAN routing, STP, EtherChannel, WLAN security, IPv4/IPv6 troubleshooting."
            ),
            CertificationItem(
                name="Endpoint Security Certification",
                issuer="Cisco Networking Academy",
                date="12 December 2024",
                skills="Host-based firewalls, antimalware, device hardening, access control, endpoint telemetry analysis."
            ),
            CertificationItem(
                name="Cyber Threat Management Certification",
                issuer="Cisco Networking Academy",
                date="17 November 2024",
                skills="Threat intelligence, vulnerability assessment, incident response frameworks, SOC workflows."
            ),
            CertificationItem(
                name="Fiber Optic Splicing & Polishing Training",
                issuer="Technical Workshop",
                date="3 February 2018",
                skills="Fusion splicing, mechanical polishing, OTDR testing, optical cable termination."
            ),
            CertificationItem(
                name="Arduino Workshop & Embedded Systems Hands-On",
                issuer="Workshop Series",
                date="9 September 2018",
                skills="C/C++ embedded programming, sensor interfacing, PWM, I2C/SPI/UART protocols."
            ),
            CertificationItem(
                name="Kursus Asas Askar Wataniah (Territorial Army Basic Training)",
                issuer="Malaysian Army Reserve",
                date="2019",
                skills="High-stress problem solving, military discipline, tactical communication, team dynamics under pressure."
            )
        ]

        profile.projects = [
            ProjectItem(
                title="Hybrid Self-Checkout System using Barcode Scanner & Camera (Computer Vision)",
                tagline="Capstone Project - Dual-verification anti-fraud system",
                tech_stack=["Python", "OpenCV", "YOLOv8", "USB Barcode Scanner", "MySQL"],
                metrics="77.4% Precision, 72.0% Recall (50 epochs), <150ms inference latency."
            ),
            ProjectItem(
                title="Development of Livestock Weight Tracking System Based on IoT",
                tagline="INOTEK 2025 3rd Place Award Winner",
                tech_stack=["Arduino", "Load cell strain gauges", "HX711 ICs", "C/C++", "Wireless telemetry"],
                metrics="98%+ measurement precision, real-time data logging dashboard."
            )
        ]

        profile.awards = [
            "Third Place - INOTEK 2025 Innovation & Technology Competition Series 1",
            "Silver Medal - Pertandingan Rekacipta dan Inovasi Pelajar 2018",
            "Best Student Award - Kolej Komuniti Selandar (March 2018)",
            "Outstanding Achievement in Subject - Kolej Komuniti Selandar (Nov 2017)"
        ]

        profile.keywords_by_pillar = {
            "Networking": [
                "CCNA", "Cisco", "Network Engineer", "Network Troubleshooting", "TCP/IP", "VLAN",
                "OSPF", "Routing", "Switching", "LAN", "WAN", "DHCP", "DNS", "Firewall", "Wireshark", "Infrastructure"
            ],
            "IT Support": [
                "IT Support", "Technical Support", "Desktop Support", "Windows", "Hardware Troubleshooting",
                "User Support", "Customer Support", "Printer Support", "Microsoft Office", "Technical Documentation"
            ],
            "Security": [
                "Cybersecurity", "Endpoint Security", "Incident Response", "Cyber Threat Management"
            ],
            "Automation & AI": [
                "Automation", "Industrial Automation", "Artificial Intelligence", "AI", "Predictive Maintenance",
                "Python", "OpenCV", "YOLOv8", "Computer Vision"
            ],
            "Embedded/IoT": [
                "IoT", "Arduino", "Embedded Systems", "Circuit Design", "MySQL", "Git", "GitHub", "SQL", "Problem Solving"
            ]
        }

        all_kw: List[str] = []
        for kw_list in profile.keywords_by_pillar.values():
            all_kw.extend(kw_list)
        profile.all_keywords = list(dict.fromkeys(all_kw))
        return profile

    @classmethod
    def _parse_markdown(cls, content: str) -> CandidateProfile:
        """Parses PROJECT_MEMORY.md into a CandidateProfile instance."""
        profile = cls._create_default_profile()

        name_match = re.search(r'\*\*Candidate Name:\*\*\s*(.+)', content)
        if name_match:
            profile.name = name_match.group(1).strip()

        email_match = re.search(r'\*\*Email:\*\*\s*(.+)', content)
        if email_match:
            profile.email = email_match.group(1).strip()

        phone_match = re.search(r'\*\*Phone:\*\*\s*(.+)', content)
        if phone_match:
            profile.phone = phone_match.group(1).strip()

        loc_match = re.search(r'\*\*Location:\*\*\s*(.+)', content)
        if loc_match:
            profile.location = loc_match.group(1).strip()

        linkedin_match = re.search(r'\*\*LinkedIn:\*\*\s*(https?://\S+)', content)
        if linkedin_match:
            profile.linkedin = linkedin_match.group(1).strip()

        github_match = re.search(r'\*\*GitHub:\*\*\s*(https?://\S+)', content)
        if github_match:
            profile.github = github_match.group(1).strip()

        portfolio_match = re.search(r'\*\*Portfolio:\*\*\s*(\S+)', content)
        if portfolio_match:
            profile.portfolio = portfolio_match.group(1).strip()

        return profile

    def analyze_job_match(self, job_title: str, job_description: str) -> dict:
        """
        Menganalisis tahap padanan ATS secara terperinci (Explainable Scoring),
        kebarangkalian temuduga, ramalan gaji, jurang kemahiran, dan skor impak kerjaya.
        """
        from models import ATSBreakdown, InterviewProbability, SalaryPrediction, SkillsGap, CareerImpact, DualConfidence

        text = f"{job_title} {job_description}".lower()
        matched_keywords: List[str] = []
        pillar_matches: Dict[str, List[str]] = {}

        for pillar, kws in self.keywords_by_pillar.items():
            matched_in_pillar = []
            for kw in kws:
                pattern = r'\b' + re.escape(kw.lower()) + r'\b'
                if re.search(pattern, text):
                    matched_in_pillar.append(kw)
                    if kw not in matched_keywords:
                        matched_keywords.append(kw)
            pillar_matches[pillar] = matched_in_pillar

        total_possible = len(self.all_keywords)
        raw_score = (len(matched_keywords) / total_possible) * 100 if total_possible > 0 else 0.0

        # Dominant pillar determination
        dominant_pillar = max(pillar_matches, key=lambda k: len(pillar_matches[k])) if pillar_matches else "General"
        dominant_count = len(pillar_matches.get(dominant_pillar, []))

        # Adjusted match score focusing on relevant domain keywords
        if dominant_count > 0:
            pillar_total = len(self.keywords_by_pillar.get(dominant_pillar, []))
            domain_score = (dominant_count / pillar_total) * 100
            adjusted_score = min(100.0, round((raw_score * 0.4) + (domain_score * 0.6), 1))
        else:
            adjusted_score = round(raw_score, 1)

        # 1. Explainable ATS Breakdown (Max 100)
        kw_score = min(30.0, round((len(matched_keywords) / 15.0) * 30.0, 1))
        edu_score = 10.0  # Computer Engineering B.Eng / Diploma
        cert_score = 10.0 if any(c in text for c in ["ccna", "cisco", "festo", "ai", "security"]) else 7.0
        proj_score = 13.0 if any(p in text for p in ["yolo", "opencv", "iot", "arduino", "vision", "weight"]) else 9.0
        exp_score = 8.0   # Graduate / Academic experience
        soft_score = 9.0  # Askar Wataniah military reserve leadership
        ats_final = round(min(100.0, kw_score + edu_score + cert_score + proj_score + exp_score + soft_score), 1)

        ats_breakdown = ATSBreakdown(
            resume_keywords_score=kw_score,
            education_score=edu_score,
            certifications_score=cert_score,
            projects_score=proj_score,
            experience_score=exp_score,
            soft_skills_score=soft_score,
            final_score=ats_final,
        )

        # 2. Interview Probability Engine (%)
        prob_val = min(95.0, round((ats_final * 0.55) + (cert_score * 2.0) + (soft_score * 2.0), 1))
        prob_rating = "High" if prob_val >= 65 else ("Medium" if prob_val >= 40 else "Low")
        interview_prob = InterviewProbability(
            estimated_chance=prob_val,
            rating=prob_rating,
            factors={"ATS Match": ats_final, "Certification Match": cert_score * 10, "Soft Skills": soft_score * 10}
        )

        # 3. Salary Range Prediction (MYR / SGD)
        if "singapore" in text or "sg" in text or "sgd" in text:
            currency = "SGD"
            min_sal, likely_sal, opt_sal = 3200, 3800, 4800
        else:
            currency = "MYR"
            if dominant_pillar == "Automation & AI":
                min_sal, likely_sal, opt_sal = 3800, 4500, 5500
            elif dominant_pillar == "Networking":
                min_sal, likely_sal, opt_sal = 3500, 4200, 5000
            else:
                min_sal, likely_sal, opt_sal = 3200, 3800, 4500

        salary_pred = SalaryPrediction(
            min_salary=min_sal, likely_salary=likely_sal, optimistic_salary=opt_sal,
            currency=currency, confidence_percent=82.0
        )

        # 4. Skills Gap Analysis
        target_skills = ["active directory", "azure", "aws", "powershell", "itil", "vmware", "bgp", "ansible", "docker"]
        missing = [s.title() for s in target_skills if s in text and s not in [k.lower() for k in matched_keywords]]
        skills_gap = SkillsGap(
            missing_skills=missing,
            learning_time_weeks=max(2, len(missing) * 2),
            expected_ats_boost=round(len(missing) * 4.5, 1)
        )

        # 5. Career Impact Score (0 - 10)
        career_impact = CareerImpact(
            overall_score=8.8, growth_potential=9.0, learning_potential=9.2, future_cloud_path=9.5
        )

        # 6. Dual Confidence Metric
        dual_confidence = DualConfidence(execution_confidence=100.0, analysis_confidence=82.0)

        # Top relevant certifications
        relevant_certs = []
        if "Networking" in dominant_pillar or "CCNA" in matched_keywords or "Router" in text or "Switch" in text:
            relevant_certs.extend(["CCNA Enterprise Networking", "CCNA Routing & Switching"])
        if "Security" in dominant_pillar or "Cybersecurity" in matched_keywords or "Endpoint" in text:
            relevant_certs.extend(["Cisco Endpoint Security", "Cyber Threat Management"])
        if "Automation" in dominant_pillar or "AI" in matched_keywords or "YOLOv8" in text:
            relevant_certs.append("Festo Industrial Automation with AI")

        if not relevant_certs and self.certifications:
            relevant_certs = [self.certifications[0].name, self.certifications[1].name]

        return {
            "match_score": max(adjusted_score, ats_final),
            "matched_keywords": matched_keywords,
            "matched_count": len(matched_keywords),
            "total_keywords": total_possible,
            "dominant_pillar": dominant_pillar,
            "pillar_matches": pillar_matches,
            "relevant_certs": list(dict.fromkeys(relevant_certs)),
            "ats_breakdown": ats_breakdown,
            "interview_prob": interview_prob,
            "salary_pred": salary_pred,
            "skills_gap": skills_gap,
            "career_impact": career_impact,
            "dual_confidence": dual_confidence,
        }

    def generate_tailored_cover_letter(self, job_title: str, company: str, job_description: str) -> str:
        """
        Menjana surat iringan khusus (tailored cover letter) berasaskan
        pilar kepakaran calon dan keperluan jawatan.
        """
        analysis = self.analyze_job_match(job_title, job_description)
        dominant_pillar = analysis["dominant_pillar"]

        if dominant_pillar == "Networking":
            focus_intro = "dengan latar belakang kukuh dalam Kejuruteraan Rangkaian & Infrastruktur Komputer (pemegang CCNA Enterprise & Wireless)."
            focus_highlights = (
                "Saya mempunyai kepakaran praktikal dalam konfigurasi WAN/LAN, OSPFv2, VLAN, Inter-VLAN routing, "
                "QoS, serta device hardening dan troubleshooting infrastruktur Cisco."
            )
        elif dominant_pillar == "Automation & AI":
            focus_intro = "dengan fokus mendalam terhadap Automasi Industri, AI, dan Computer Vision."
            focus_highlights = (
                "Saya telah membina sistem Capstone Hybrid Self-Checkout berkuasa YOLOv8 (50 epochs) & OpenCV dengan "
                "kadar presisi 77.4% dan latensi inferens <150ms, serta memegang Sijil Profesional Festo dalam AI Industri."
            )
        elif dominant_pillar == "Security":
            focus_intro = "dengan pengkhususan dalam Keselamatan Endpoint dan Pengurusan Ancaman Siber."
            focus_highlights = (
                "Berdasarkan persijilan Cisco Endpoint Security & Cyber Threat Management, saya mahir dalam pemantauan SOC, "
                "perkakasan firewall, antimalware telemetry, serta penilaian kerentanan sistem."
            )
        elif dominant_pillar == "Embedded/IoT":
            focus_intro = "dengan rekod kejayaan dalam Pembangunan Sistem Terbenam (Embedded Systems) dan IoT."
            focus_highlights = (
                "Saya merupakan pemenang Tempat Ketiga INOTEK 2025 menerusi projek Sistem Penjejakan Berat Ternakan "
                "berasaskan IoT (mikrokawal Arduino & HX711) berketepatan 98%+."
            )
        else:
            focus_intro = "dengan latar belakang ijazah Kejuruteraan Komputer (UTeM) dan persijilan CCNA & Festo AI."
            focus_highlights = (
                "Saya memiliki kemahiran serba boleh merentasi penyelesaian masalah teknikal, penyelarasan sistem IT, "
                "dan pembangunan perisian Python/C++."
            )

        cover_letter = (
            f"Dear Hiring Manager at {company},\n\n"
            f"Saya ingin mengemukakan permohonan saya bagi jawatan {job_title}. "
            f"Sebagai graduan Penyelidikan Kejuruteraan Komputer dari UTeM, saya hadir {focus_intro}\n\n"
            f"{focus_highlights}\n\n"
            f"Dengan gabungan latar belakang akademik, disiplin kepimpinan (Kursus Asas Askar Wataniah), "
            f"dan keupayaan menyelesaikan masalah teknikal secara berstruktur, saya yakin dapat memberi sumbangan serta-merta "
            f"kepada pasukan di {company}.\n\n"
            f"Terima kasih atas masa dan pertimbangan anda. Saya amat mengelu-alukan peluang untuk ditemuduga.\n\n"
            f"Yang benar,\n"
            f"{self.name}\n"
            f"Emel: {self.email} | Tel: {self.phone}\n"
            f"LinkedIn: {self.linkedin} | Portfolio: {self.portfolio}"
        )
        return cover_letter

    def get_form_fill_data(self) -> dict:
        """Mengembalikan data canonical bagi isian borang permohonan kerja."""
        return {
            "full_name": self.name,
            "email": self.email,
            "phone": self.phone,
            "location": self.location,
            "linkedin": self.linkedin,
            "github": self.github,
            "portfolio": self.portfolio,
            "education": "Bachelor of Computer Engineering (Hons) - UTeM",
            "skills": ", ".join(self.all_keywords[:15]),
        }
