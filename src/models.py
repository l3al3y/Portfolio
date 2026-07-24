"""
Modul Model Data (Data Transfer Objects & Enterprise Career CRM DTOs)
======================================================================
Mendefinisikan struktur data yang digunakan merentasi keseluruhan sistem agent.
Sebut harga skor ATS terperinci, kebarangkalian temuduga, ramalan gaji,
jurang kemahiran, dan bifurcated confidence metrics.
"""

from __future__ import annotations
from dataclasses import dataclass, field
from enum import Enum
from datetime import datetime
from typing import Optional, Dict, List, Any


class ApplicationStatus(str, Enum):
    """Status hasil akhir bagi setiap percubaan memohon kerja."""
    APPLIED = "APPLIED"
    INTERVIEW_INVITE = "INTERVIEW_INVITE"
    APPLICATION_RECEIVED = "APPLICATION_RECEIVED"
    SKIPPED_DUPLICATE = "SKIPPED_DUPLICATE"
    SKIPPED_LOW_MATCH = "SKIPPED_LOW_MATCH"
    FAILED = "FAILED"
    PENDING = "PENDING"


@dataclass
class ATSBreakdown:
    """Breakdown peratusan skor ATS yang boleh dijelaskan (Explainable Scoring)."""
    resume_keywords_score: float = 0.0  # Max 30
    education_score: float = 0.0        # Max 10
    certifications_score: float = 0.0   # Max 10
    projects_score: float = 0.0         # Max 15
    experience_score: float = 0.0       # Max 15
    soft_skills_score: float = 0.0      # Max 10
    final_score: float = 0.0            # Max 100

    def to_dict(self) -> Dict[str, float]:
        return {
            "Resume Keywords": self.resume_keywords_score,
            "Education": self.education_score,
            "Certifications": self.certifications_score,
            "Projects": self.projects_score,
            "Experience": self.experience_score,
            "Soft Skills": self.soft_skills_score,
            "Final Score": self.final_score,
        }


@dataclass
class InterviewProbability:
    """Anggaran kebarangkalian dipanggil temuduga (%) berasaskan persaingan & padanan."""
    estimated_chance: float = 0.0
    rating: str = "Low"  # Low, Medium, High
    factors: Dict[str, float] = field(default_factory=dict)


@dataclass
class SalaryPrediction:
    """Anggaran julat gaji bagi jawatan berkenaan (MYR / SGD)."""
    min_salary: int = 3500
    likely_salary: int = 4200
    optimistic_salary: int = 5000
    currency: str = "MYR"
    confidence_percent: float = 85.0


@dataclass
class SkillsGap:
    """Analisis jurang kemahiran & nilai ROI pembelajaran."""
    missing_skills: List[str] = field(default_factory=list)
    learning_time_weeks: int = 4
    expected_ats_boost: float = 15.0


@dataclass
class CareerImpact:
    """Skor impak kerjaya jangka panjang (1 - 10)."""
    overall_score: float = 8.5
    growth_potential: float = 8.5
    learning_potential: float = 9.0
    future_cloud_path: float = 9.0


@dataclass
class DualConfidence:
    """Bifurcated confidence metrics separating Execution from Analysis."""
    execution_confidence: float = 100.0  # Verification in DB/Excel
    analysis_confidence: float = 82.0   # Heuristic/LLM estimation certainty


@dataclass(slots=True)
class JobPosting:
    """Representasi satu iklan pekerjaan yang belum/sedang diproses."""
    job_id: str
    company: str
    title: str
    url: str
    hr_email: Optional[str] = None
    description: Optional[str] = None
    parsed_fields: Dict[str, Any] = field(default_factory=dict)
    match_score: float = 0.0
    dominant_pillar: str = ""
    tailored_cover_letter: Optional[str] = None
    status: ApplicationStatus = ApplicationStatus.PENDING
    
    # Advanced CRM Analytics
    ats_breakdown: Optional[ATSBreakdown] = None
    interview_prob: Optional[InterviewProbability] = None
    salary_pred: Optional[SalaryPrediction] = None
    skills_gap: Optional[SkillsGap] = None
    career_impact: Optional[CareerImpact] = None
    dual_confidence: Optional[DualConfidence] = None


@dataclass(slots=True)
class ApplicationRecord:
    """Rekod permohonan yang disimpan secara kekal dalam SQLite."""
    job_id: str
    company: str
    title: str
    url: str
    match_score: float
    status: ApplicationStatus | str
    timestamp: datetime = field(default_factory=datetime.utcnow)
    error_message: Optional[str] = None
    cover_letter: Optional[str] = None
    
    # Extended analytics
    interview_prob_pct: float = 0.0
    likely_salary: int = 4000
    missing_skills_str: str = ""
    career_impact_score: float = 8.5
    execution_confidence: float = 100.0
    analysis_confidence: float = 82.0
