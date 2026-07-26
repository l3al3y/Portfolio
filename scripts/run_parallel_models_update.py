import asyncio
import json
import logging
import sys
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent.parent
SRC_DIR = ROOT_DIR / "src"
if str(SRC_DIR) not in sys.path:
    sys.path.insert(0, str(SRC_DIR))
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

from src.llm_client import ModelExpertise, execute_parallel_model_tasks

logging.basicConfig(level=logging.INFO)

async def main():
    task_specs = {
        "exp_polish": {
            "model": ModelExpertise.CREATIVE_WRITING,  # fiq/grok-4.5
            "messages": [
                {"role": "system", "content": "You are a senior career consultant."},
                {"role": "user", "content": "Refine work experience highlights for Technical Staff at Global Elite Ventures, Contract Assistant Engineer at ARNN Technologies, and Technician at OKCS Seri Kembangan for MUHAMMAD IRFAN FAHMI BIN SAMSUL KAMAR."}
            ]
        },
        "ats_audit": {
            "model": ModelExpertise.DEEP_REASONING,  # fiq/deepseek-v4-pro
            "messages": [
                {"role": "system", "content": "You are an ATS auditing expert."},
                {"role": "user", "content": "Verify technical keywords for CCNA, Festo AI, YOLOv8 77.4% precision 72.0% recall, and embedded systems."}
            ]
        },
        "code_gen": {
            "model": ModelExpertise.CODE_DEV,  # fiq/kimi-k2.7-code
            "messages": [
                {"role": "system", "content": "You are a front-end UI developer."},
                {"role": "user", "content": "Generate clean HTML timeline elements for Work Experience cards with badges."}
            ]
        }
    }

    print("Launching parallel multi-model tasks across Grok 4.5, DeepSeek V4 Pro, and Kimi K2.7 Code...")
    results = await execute_parallel_model_tasks(task_specs)
    print("Parallel execution complete!")
    for k, v in results.items():
        snippet = (v[:120] + "...") if v else "None (Fallback active)"
        print(f"[{k}] -> {snippet}")

if __name__ == "__main__":
    asyncio.run(main())
