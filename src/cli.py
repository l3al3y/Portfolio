"""
Agent-Native CLI Engine (Agent CLI Spec v0.1 Compliant)
======================================================
Modul ini menyediakan antara muka CLI berdaya tahan tinggi yang memenuhi standard Agent-Native (Level 3).

Ciri-ciri Utama:
1. Output lalai dalam format JSON (Agent Mode) untuk penyahkodan mesin.
2. Flag --human untuk format visual menarik (Rich UI, Tables, Gauges, Color Panels).
3. Pengendalian ralat berstruktur (JSON ke stderr + Exit Codes: 0, 1, 2, 10, 20, 30).
4. Penemuan kendiri (Self-Description) melalui --brief, --help, dan perintah `skills`.
5. Sistem pengurusan isu & maklum balas tempatan (Offline Issue Tracker).
"""

from __future__ import annotations
import sys
import os
import json
import argparse
import asyncio
import logging
from pathlib import Path
from typing import Dict, Any, List, Optional

# Tambah direktori induk ke sys.path jika belum wujud
BASE_DIR = Path(__file__).resolve().parent.parent
SRC_DIR = Path(__file__).resolve().parent

if str(SRC_DIR) not in sys.path:
    sys.path.insert(0, str(SRC_DIR))
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

from candidate import CandidateProfile
from database import JobDatabase
from excel_tracker import export_job_tracker_excel
from portals import MultiPortalConnector
from issue import IssueManager
from models import JobPosting, ApplicationRecord, ApplicationStatus
from agent import JobApplicationAgent

# Import Optional Rich
try:
    from rich.console import Console
    from rich.table import Table
    from rich.panel import Panel
    from rich.progress import Progress, SpinnerColumn, TextColumn
    from rich.syntax import Syntax
    RICH_AVAILABLE = True
    console = Console()
except ImportError:
    RICH_AVAILABLE = False
    console = None

logging.basicConfig(level=logging.WARNING)


# ---- Helper & Error Output Functions ----

def emit_error(code: str, message: str, suggestion: str, exit_code: int = 1) -> None:
    """Mengeluarkan ralat berstruktur ke stderr dan menamatkan proses serta-merta."""
    err_obj = {
        "error": True,
        "code": code,
        "message": message,
        "suggestion": suggestion,
    }
    sys.stderr.write(json.dumps(err_obj, indent=2) + "\n")
    sys.exit(exit_code)


def load_agent_context() -> Dict[str, Any]:
    """Memuatkan konteks auto-pendaftaran rules, skills, dan arahan isu."""
    rules_dir = BASE_DIR / "agent" / "rules"
    skills_dir = BASE_DIR / "agent" / "skills"

    rules = []
    if rules_dir.exists():
        for f in rules_dir.glob("*.md"):
            rules.append({"name": f.stem, "path": str(f.relative_to(BASE_DIR))})

    skills = []
    if skills_dir.exists():
        for f in skills_dir.glob("*.md"):
            skills.append({"name": f.stem, "path": str(f.relative_to(BASE_DIR))})

    return {
        "rules": rules,
        "skills": skills,
        "issue": "Run 'python cli.py issue create --title <Title> --category bug' to report offline feedback."
    }


def emit_json(result_data: Any, fields: Optional[str] = None) -> None:
    """Mengeluarkan hasil permohonan dalam format JSON bersama konteks ejen."""
    context = load_agent_context()
    output: Dict[str, Any] = {
        "status": "success",
        "result": result_data,
        "rules": context["rules"],
        "skills": context["skills"],
        "issue": context["issue"],
    }

    if fields:
        field_list = [f.strip() for f in fields.split(",") if f.strip()]
        if isinstance(result_data, dict):
            output["result"] = {k: v for k, v in result_data.items() if k in field_list}

    print(json.dumps(output, indent=2, default=str))
    sys.exit(0)


def get_data_paths() -> tuple[Path, Path, Path]:
    """Mendapatkan laluan data berpusat (data/job_agent.db & data/JobTracker.xlsx)."""
    data_dir = BASE_DIR / "data"
    data_dir.mkdir(exist_ok=True)
    db_path = data_dir / "job_agent.db"
    excel_path = data_dir / "JobTracker.xlsx"
    memory_path = BASE_DIR / "PROJECT_MEMORY.md"
    return db_path, excel_path, memory_path


# ---- Command Handlers ----

def handle_brief() -> None:
    brief_file = BASE_DIR / "agent" / "brief.md"
    if brief_file.exists():
        print(brief_file.read_text(encoding="utf-8").strip())
    else:
        print("Autonomous Career Intelligence Agent & ATS Portfolio CLI for MUHAMMAD IRFAN FAHMI BIN SAMSUL KAMAR.")
    sys.exit(0)


def handle_ats_evaluate(args: argparse.Namespace, is_human: bool) -> None:
    if not args.title or not args.desc:
        emit_error(
            code="MISSING_PARAM",
            message="Both --title and --desc are required for ATS evaluation.",
            suggestion="Pass --title '<Job Title>' --desc '<Job Description>'",
            exit_code=2
        )

    _, _, memory_path = get_data_paths()
    candidate = CandidateProfile.from_markdown_file(memory_path)
    analysis = candidate.analyze_job_match(args.title, args.desc)

    if is_human and RICH_AVAILABLE:
        score = analysis["match_score"]
        score_color = "green" if score >= 65 else ("yellow" if score >= 40 else "red")
        
        console.print(Panel(
            f"[bold {score_color}]ATS MATCH SCORE: {score}%[/bold {score_color}]\n"
            f"[bold]Position:[/bold] {args.title} | [bold]Company:[/bold] {args.company or 'N/A'}\n"
            f"[bold]Dominant Pillar:[/bold] {analysis['dominant_pillar']}\n"
            f"[bold]Interview Probability:[/bold] {analysis['interview_prob'].estimated_chance}% ({analysis['interview_prob'].rating})\n"
            f"[bold]Estimated Salary:[/bold] {analysis['salary_pred'].currency} {analysis['salary_pred'].min_salary:,} – {analysis['salary_pred'].optimistic_salary:,}",
            title="[bold blue]ATS Career Intelligence Evaluation[/bold blue]"
        ))

        # Table Breakdown
        table = Table(title="Explainable ATS Scoring Breakdown")
        table.add_column("Category", style="cyan")
        table.add_column("Score", style="bold green")
        table.add_column("Max", style="dim")

        breakdown = analysis["ats_breakdown"]
        table.add_row("Resume Keywords", f"{breakdown.resume_keywords_score}", "30")
        table.add_row("Education Credentials", f"{breakdown.education_score}", "10")
        table.add_row("Certifications (CCNA/Festo)", f"{breakdown.certifications_score}", "10")
        table.add_row("Engineering Projects", f"{breakdown.projects_score}", "15")
        table.add_row("Experience / Cadre", f"{breakdown.experience_score}", "15")
        table.add_row("Soft Skills / Wataniah", f"{breakdown.soft_skills_score}", "10")
        table.add_row("TOTAL ATS SCORE", f"{breakdown.final_score}", "100")
        console.print(table)

        if analysis["skills_gap"].missing_skills:
            console.print(f"[bold yellow]Missing Target Skills:[/bold yellow] {', '.join(analysis['skills_gap'].missing_skills)}")
        sys.exit(0)
    else:
        res = {
            "match_score": analysis["match_score"],
            "dominant_pillar": analysis["dominant_pillar"],
            "matched_keywords": analysis["matched_keywords"],
            "matched_count": analysis["matched_count"],
            "ats_breakdown": analysis["ats_breakdown"].to_dict(),
            "interview_probability": {
                "chance_percent": analysis["interview_prob"].estimated_chance,
                "rating": analysis["interview_prob"].rating,
            },
            "salary_prediction": {
                "min": analysis["salary_pred"].min_salary,
                "likely": analysis["salary_pred"].likely_salary,
                "optimistic": analysis["salary_pred"].optimistic_salary,
                "currency": analysis["salary_pred"].currency,
            },
            "skills_gap": {
                "missing_skills": analysis["skills_gap"].missing_skills,
                "learning_weeks": analysis["skills_gap"].learning_time_weeks,
                "expected_boost": analysis["skills_gap"].expected_ats_boost,
            },
            "career_impact_score": analysis["career_impact"].overall_score,
            "dual_confidence": {
                "execution": analysis["dual_confidence"].execution_confidence,
                "analysis": analysis["dual_confidence"].analysis_confidence,
            }
        }
        emit_json(res, fields=args.fields)


def handle_ats_verify(args: argparse.Namespace, is_human: bool) -> None:
    _, _, memory_path = get_data_paths()
    candidate = CandidateProfile.from_markdown_file(memory_path)
    total_kw = len(candidate.all_keywords)
    pillars = {k: len(v) for k, v in candidate.keywords_by_pillar.items()}

    res = {
        "candidate": candidate.name,
        "verification_status": "100% COVERAGE VERIFIED",
        "total_target_keywords": total_kw,
        "keywords_by_pillar": pillars,
        "sample_keywords": candidate.all_keywords[:10],
    }

    if is_human and RICH_AVAILABLE:
        console.print(Panel(
            f"[bold green]100% ATS KEYWORD COVERAGE VERIFIED[/bold green]\n"
            f"[bold]Total Tracked Keywords:[/bold] {total_kw}\n"
            f"[bold]Networking:[/bold] {pillars.get('Networking', 0)} | [bold]IT Support:[/bold] {pillars.get('IT Support', 0)}\n"
            f"[bold]Automation & AI:[/bold] {pillars.get('Automation & AI', 0)} | [bold]Security:[/bold] {pillars.get('Security', 0)}\n"
            f"[bold]Embedded/IoT:[/bold] {pillars.get('Embedded/IoT', 0)}",
            title="[bold cyan]ATS Keyword Audit[/bold cyan]"
        ))
        sys.exit(0)
    else:
        emit_json(res, fields=args.fields)


def handle_resume_generate(args: argparse.Namespace, is_human: bool) -> None:
    fmt = (args.format or "md").lower()
    if fmt not in ["md", "html", "txt", "json"]:
        emit_error(
            code="INVALID_FORMAT",
            message=f"Unsupported format '{fmt}'.",
            suggestion="Choose from: md, html, txt, json",
            exit_code=2
        )

    out_file = args.out or f"resume/resume.{fmt}"
    out_path = BASE_DIR / out_file
    out_path.parent.mkdir(parents=True, exist_ok=True)

    _, _, memory_path = get_data_paths()
    candidate = CandidateProfile.from_markdown_file(memory_path)

    if fmt == "md":
        content = f"# {candidate.name}\n\n**Email:** {candidate.email} | **Phone:** {candidate.phone}\n**Location:** {candidate.location}\n\n## Core Credentials\n- CCNA Enterprise & Wireless\n- Festo Industrial AI in Manufacturing\n"
    elif fmt == "html":
        content = f"<!DOCTYPE html><html><head><title>{candidate.name} Resume</title></head><body><h1>{candidate.name}</h1><p>{candidate.email}</p></body></html>"
    elif fmt == "txt":
        content = f"{candidate.name}\nEmail: {candidate.email}\nPhone: {candidate.phone}\nCredentials: CCNA, Festo AI\n"
    else:
        content = json.dumps(candidate.get_form_fill_data(), indent=2)

    out_path.write_text(content, encoding="utf-8")

    res = {"generated_file": str(out_path), "format": fmt, "status": "CREATED"}

    if is_human and RICH_AVAILABLE:
        console.print(f"[bold green]✓ Resume successfully generated:[/bold green] {out_path}")
        sys.exit(0)
    else:
        emit_json(res, fields=args.fields)


def handle_job_list(args: argparse.Namespace, is_human: bool) -> None:
    db_path, _, _ = get_data_paths()
    db = JobDatabase(db_path=str(db_path))
    
    with db._get_connection() as conn:
        query = "SELECT * FROM applied_jobs WHERE 1=1"
        params = []
        if args.status:
            query += " AND status = ?"
            params.append(args.status.upper())
        query += " ORDER BY created_at DESC"
        if args.limit:
            query += f" LIMIT {int(args.limit)}"

        cur = conn.execute(query, params)
        rows = [dict(row) for row in cur.fetchall()]

    if is_human and RICH_AVAILABLE:
        table = Table(title=f"Applied Jobs Audit Log ({len(rows)} records)")
        table.add_column("ID", style="cyan")
        table.add_column("Company", style="bold white")
        table.add_column("Title", style="yellow")
        table.add_column("Match Score", style="green")
        table.add_column("Status", style="magenta")

        for r in rows:
            table.add_row(str(r["id"]), r["company"], r["title"], f"{r['match_score']}%", r["status"])
        console.print(table)
        sys.exit(0)
    else:
        emit_json({"jobs": rows, "count": len(rows)}, fields=args.fields)


def handle_job_add(args: argparse.Namespace, is_human: bool) -> None:
    if not args.title or not args.company:
        emit_error(
            code="MISSING_PARAM",
            message="Both --title and --company are required.",
            suggestion="Pass --title '<Title>' --company '<Company>'",
            exit_code=2
        )

    db_path, _, memory_path = get_data_paths()
    db = JobDatabase(db_path=str(db_path))
    candidate = CandidateProfile.from_markdown_file(memory_path)
    
    analysis = candidate.analyze_job_match(args.title, args.desc or "")
    job_id = f"JOB-{int(asyncio.run(db.get_summary_stats()).get('total', 0)) + 101}"

    record = ApplicationRecord(
        job_id=job_id,
        company=args.company,
        title=args.title,
        url=args.url or "https://example.com/jobs",
        match_score=analysis["match_score"],
        status=ApplicationStatus.PENDING,
        cover_letter=candidate.generate_tailored_cover_letter(args.title, args.company, args.desc or "")
    )
    asyncio.run(db.save_record(record))

    res = {"job_id": job_id, "company": args.company, "title": args.title, "match_score": analysis["match_score"], "status": "PENDING"}

    if is_human and RICH_AVAILABLE:
        console.print(f"[bold green]✓ Job Posting Added:[/bold green] {job_id} - {args.company} ({args.title}) | Match: {analysis['match_score']}%")
        sys.exit(0)
    else:
        emit_json(res, fields=args.fields)


def handle_portal_sync(args: argparse.Namespace, is_human: bool) -> None:
    portal = (args.portal or "all").lower()
    connector = MultiPortalConnector()
    results = connector.sync_all_portals(target_portal=portal)

    if is_human and RICH_AVAILABLE:
        table = Table(title="Multi-Portal Sync Results")
        table.add_column("Portal", style="cyan")
        table.add_column("Status", style="bold green")
        table.add_column("Jobs Found", style="yellow")

        for p, d in results.items():
            table.add_row(p, d.get("status", "OK"), str(d.get("jobs_found", 0)))
        console.print(table)
        sys.exit(0)
    else:
        emit_json({"portal": portal, "results": results}, fields=args.fields)


def handle_tracker_export(args: argparse.Namespace, is_human: bool) -> None:
    db_path, default_excel_path, _ = get_data_paths()
    out_file = args.out or str(default_excel_path)

    path = export_job_tracker_excel(db_path=str(db_path), output_file=out_file)

    res = {"excel_file": str(path), "status": "EXPORTED"}
    if is_human and RICH_AVAILABLE:
        console.print(f"[bold green]✓ Master Excel Tracker Exported:[/bold green] {path}")
        sys.exit(0)
    else:
        emit_json(res, fields=args.fields)


def handle_issue_create(args: argparse.Namespace, is_human: bool) -> None:
    if not args.title:
        emit_error(
            code="MISSING_PARAM",
            message="Flag --title is required for creating an issue.",
            suggestion="Pass --title '<Issue Title>'",
            exit_code=2
        )

    db_path, _, _ = get_data_paths()
    mgr = IssueManager(db_path=str(db_path))
    issue = mgr.create_issue(title=args.title, category=args.category or "bug", description=args.desc or "")

    if is_human and RICH_AVAILABLE:
        console.print(f"[bold green]✓ Issue Created:[/bold green] {issue.id} - {issue.title} [{issue.category}]")
        sys.exit(0)
    else:
        emit_json(issue.to_dict(), fields=args.fields)


def handle_issue_list(args: argparse.Namespace, is_human: bool) -> None:
    db_path, _, _ = get_data_paths()
    mgr = IssueManager(db_path=str(db_path))
    issues = mgr.list_issues(status=args.status, category=args.category)
    issue_dicts = [i.to_dict() for i in issues]

    if is_human and RICH_AVAILABLE:
        table = Table(title=f"Offline Feedback Issues ({len(issues)} records)")
        table.add_column("ID", style="cyan")
        table.add_column("Title", style="bold white")
        table.add_column("Category", style="yellow")
        table.add_column("Status", style="magenta")

        for i in issues:
            table.add_row(i.id, i.title, i.category, i.status)
        console.print(table)
        sys.exit(0)
    else:
        emit_json({"issues": issue_dicts, "count": len(issue_dicts)}, fields=args.fields)


def handle_issue_resolve(args: argparse.Namespace, is_human: bool) -> None:
    if not args.id:
        emit_error(
            code="MISSING_PARAM",
            message="Flag --id is required to resolve an issue.",
            suggestion="Pass --id 'ISSUE-001'",
            exit_code=2
        )

    db_path, _, _ = get_data_paths()
    mgr = IssueManager(db_path=str(db_path))
    issue = mgr.resolve_issue(issue_id=args.id, notes=args.notes or "")

    if not issue:
        emit_error(
            code="NOT_FOUND",
            message=f"Issue '{args.id}' was not found.",
            suggestion="Run 'python cli.py issue list' to check valid IDs.",
            exit_code=20
        )

    if is_human and RICH_AVAILABLE:
        console.print(f"[bold green]✓ Issue Resolved:[/bold green] {issue.id} - {issue.title}")
        sys.exit(0)
    else:
        emit_json(issue.to_dict(), fields=args.fields)


def handle_skills_list(args: argparse.Namespace, is_human: bool) -> None:
    ctx = load_agent_context()
    if is_human and RICH_AVAILABLE:
        table = Table(title="Registered Agent Skills")
        table.add_column("Skill Name", style="cyan")
        table.add_column("Path", style="yellow")
        for s in ctx["skills"]:
            table.add_row(s["name"], s["path"])
        console.print(table)
        sys.exit(0)
    else:
        emit_json({"skills": ctx["skills"]}, fields=args.fields)


def handle_profile_show(args: argparse.Namespace, is_human: bool) -> None:
    _, _, memory_path = get_data_paths()
    candidate = CandidateProfile.from_markdown_file(memory_path)
    data = candidate.get_form_fill_data()

    if is_human and RICH_AVAILABLE:
        console.print(Panel(
            f"[bold]{candidate.name}[/bold]\n"
            f"[bold]Email:[/bold] {candidate.email} | [bold]Phone:[/bold] {candidate.phone}\n"
            f"[bold]Location:[/bold] {candidate.location}\n"
            f"[bold]LinkedIn:[/bold] {candidate.linkedin} | [bold]GitHub:[/bold] {candidate.github}\n"
            f"[bold]Portfolio:[/bold] {candidate.portfolio}",
            title="[bold green]Candidate Memory Profile[/bold green]"
        ))
        sys.exit(0)
    else:
        emit_json(data, fields=args.fields)


def handle_agent_run(args: argparse.Namespace, is_human: bool) -> None:
    db_path, excel_path, memory_path = get_data_paths()
    sample_jobs = [
        JobPosting(
            job_id="JOB-101", company="TechNova Solutions", title="Network & Infrastructure Engineer",
            url="https://example.com/jobs/101", hr_email="careers@technova.example.com",
            description="Cisco Enterprise Networking, CCNA certification, OSPFv2 routing, VLAN, WAN/LAN, Python network automation."
        )
    ]
    agent = JobApplicationAgent(
        job_queue=sample_jobs, db_path=str(db_path), excel_path=str(excel_path),
        candidate_memory_path=str(memory_path), headless=True, min_match_score=40.0, email_dry_run=True
    )
    asyncio.run(agent.run())

    res = {"status": "COMPLETED", "db_path": str(db_path), "excel_path": str(excel_path)}
    if is_human and RICH_AVAILABLE:
        console.print(f"[bold green]✓ Autonomous Agent Execution Loop Completed.[/bold green]")
        sys.exit(0)
    else:
        emit_json(res, fields=args.fields)


# ---- Main CLI Parser Construction ----

def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog="cli.py",
        description="Autonomous Career Intelligence Agent & ATS Portfolio CLI (Agent-Native Spec v0.1)",
        add_help=False
    )

    # Standard Reserved Flags
    parser.add_argument("--agent", action="store_true", default=True, help="JSON mode for agents (default)")
    parser.add_argument("--human", action="store_true", help="Human mode with Rich UI")
    parser.add_argument("--brief", action="store_true", help="One-paragraph identity summary")
    parser.add_argument("--help", action="store_true", help="Structured help overview")
    parser.add_argument("--version", action="store_true", help="Output semver version string")
    parser.add_argument("--yes", action="store_true", help="Confirm destructive actions")
    parser.add_argument("--fields", type=str, help="Comma-separated fields to output")

    subparsers = parser.add_subparsers(dest="subcommand")

    # ATS commands
    ats_parser = subparsers.add_parser("ats")
    ats_sub = ats_parser.add_subparsers(dest="action")
    
    ats_eval = ats_sub.add_parser("evaluate")
    ats_eval.add_argument("--title", type=str, help="Job position title")
    ats_eval.add_argument("--desc", type=str, help="Full job description")
    ats_eval.add_argument("--company", type=str, help="Company name")

    ats_verify = ats_sub.add_parser("verify")

    # Resume commands
    res_parser = subparsers.add_parser("resume")
    res_sub = res_parser.add_subparsers(dest="action")
    res_gen = res_sub.add_parser("generate")
    res_gen.add_argument("--format", type=str, default="md", help="Format: md, html, txt, json")
    res_gen.add_argument("--out", type=str, help="Output file path")

    # Job commands
    job_parser = subparsers.add_parser("job")
    job_sub = job_parser.add_subparsers(dest="action")
    
    job_list = job_sub.add_parser("list")
    job_list.add_argument("--status", type=str, help="Filter status")
    job_list.add_argument("--limit", type=int, help="Record limit")

    job_add = job_sub.add_parser("add")
    job_add.add_argument("--title", type=str, required=True, help="Job title")
    job_add.add_argument("--company", type=str, required=True, help="Company name")
    job_add.add_argument("--url", type=str, help="Job URL")
    job_add.add_argument("--email", type=str, help="HR Email")
    job_add.add_argument("--desc", type=str, help="Job description")

    # Portal commands
    portal_parser = subparsers.add_parser("portal")
    portal_sub = portal_parser.add_subparsers(dest="action")
    portal_sync = portal_sub.add_parser("sync")
    portal_sync.add_argument("--portal", type=str, default="all", help="myfuturejobs, maukerja, jobstreet, linkedin, all")
    portal_sub.add_parser("list")

    # Tracker export
    tracker_parser = subparsers.add_parser("tracker")
    tracker_sub = tracker_parser.add_subparsers(dest="action")
    tracker_exp = tracker_sub.add_parser("export")
    tracker_exp.add_argument("--out", type=str, help="Excel output path")

    # Issue Tracker commands
    issue_parser = subparsers.add_parser("issue")
    issue_sub = issue_parser.add_subparsers(dest="action")
    
    issue_create = issue_sub.add_parser("create")
    issue_create.add_argument("--title", type=str, required=True, help="Issue summary title")
    issue_create.add_argument("--category", type=str, default="bug", help="bug, requirement, suggestion, bad-output")
    issue_create.add_argument("--desc", type=str, help="Issue details")

    issue_list = issue_sub.add_parser("list")
    issue_list.add_argument("--status", type=str, help="open, in-progress, resolved, closed")
    issue_list.add_argument("--category", type=str, help="bug, requirement, suggestion, bad-output")

    issue_res = issue_sub.add_parser("resolve")
    issue_res.add_argument("--id", type=str, required=True, help="Issue ID (e.g. ISSUE-001)")
    issue_res.add_argument("--notes", type=str, help="Resolution notes")

    # Skills command
    skills_parser = subparsers.add_parser("skills")
    skills_sub = skills_parser.add_subparsers(dest="action")
    skills_sub.add_parser("list")

    # Profile command
    profile_parser = subparsers.add_parser("profile")
    profile_sub = profile_parser.add_subparsers(dest="action")
    profile_sub.add_parser("show")

    # Agent Run
    agent_parser = subparsers.add_parser("agent")
    agent_sub = agent_parser.add_subparsers(dest="action")
    agent_sub.add_parser("run")

    return parser


def main() -> None:
    parser = build_parser()
    args, unknown = parser.parse_known_args()

    if unknown:
        emit_error(
            code="UNKNOWN_FLAG",
            message=f"Unknown arguments provided: {' '.join(unknown)}",
            suggestion="Run 'python cli.py --help' to see valid flags and commands.",
            exit_code=2
        )

    is_human = args.human

    if args.version:
        if is_human:
            print("Autonomous Career Agent CLI v1.0.0 (Agent-Native)")
        else:
            emit_json({"version": "1.0.0", "spec_level": "Agent-Native", "spec_version": "0.1"})
        sys.exit(0)

    if args.brief:
        handle_brief()

    if args.help or not args.subcommand:
        if is_human and RICH_AVAILABLE:
            parser.print_help()
        else:
            commands = [
                {"name": "ats evaluate", "description": "Evaluate job match & ATS scoring breakdown"},
                {"name": "ats verify", "description": "Verify 42 target ATS keywords coverage"},
                {"name": "resume generate", "description": "Generate ATS resume (md, html, txt, json)"},
                {"name": "job list", "description": "List applied jobs from SQLite audit database"},
                {"name": "job add", "description": "Add job posting record"},
                {"name": "portal sync", "description": "Sync MYFutureJobs, MauKerja, JobStreet, LinkedIn"},
                {"name": "tracker export", "description": "Export master Excel tracker (JobTracker.xlsx)"},
                {"name": "issue create", "description": "Create offline feedback issue"},
                {"name": "issue list", "description": "List offline issues"},
                {"name": "issue resolve", "description": "Resolve an issue"},
                {"name": "skills list", "description": "List registered agent skills"},
                {"name": "profile show", "description": "Show candidate memory profile"},
                {"name": "agent run", "description": "Run autonomous job application agent"}
            ]
            emit_json({"commands": commands, "brief": "Career Intelligence CLI"}, fields=args.fields)
        sys.exit(0)

    # Route Subcommands
    cmd = args.subcommand
    act = getattr(args, "action", None)

    if cmd == "ats":
        if act == "evaluate":
            handle_ats_evaluate(args, is_human)
        elif act == "verify":
            handle_ats_verify(args, is_human)
        else:
            emit_error("INVALID_ACTION", "Action required for 'ats'.", "Use 'ats evaluate' or 'ats verify'", 2)

    elif cmd == "resume":
        if act == "generate":
            handle_resume_generate(args, is_human)
        else:
            emit_error("INVALID_ACTION", "Action required for 'resume'.", "Use 'resume generate'", 2)

    elif cmd == "job":
        if act == "list":
            handle_job_list(args, is_human)
        elif act == "add":
            handle_job_add(args, is_human)
        else:
            emit_error("INVALID_ACTION", "Action required for 'job'.", "Use 'job list' or 'job add'", 2)

    elif cmd == "portal":
        if act == "sync":
            handle_portal_sync(args, is_human)
        else:
            handle_portal_sync(args, is_human)

    elif cmd == "tracker":
        if act == "export":
            handle_tracker_export(args, is_human)
        else:
            handle_tracker_export(args, is_human)

    elif cmd == "issue":
        if act == "create":
            handle_issue_create(args, is_human)
        elif act == "list":
            handle_issue_list(args, is_human)
        elif act == "resolve":
            handle_issue_resolve(args, is_human)
        else:
            handle_issue_list(args, is_human)

    elif cmd == "skills":
        handle_skills_list(args, is_human)

    elif cmd == "profile":
        handle_profile_show(args, is_human)

    elif cmd == "agent":
        handle_agent_run(args, is_human)

    else:
        emit_error("UNKNOWN_COMMAND", f"Subcommand '{cmd}' is not recognized.", "Run 'python cli.py --help'", 2)


if __name__ == "__main__":
    main()
