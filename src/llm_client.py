"""
Multi-Model Parallel LLM Routing Engine (RootSys Cloud)
======================================================
Routes tasks concurrently across specialized AI models based on domain expertise:
  - CODE_DEV (fiq/kimi-k2.7-code): Code generation, Playwright scripts, DOM parsing
  - DEEP_REASONING (fiq/deepseek-v4-pro): Deep candidate evaluation, ATS reasoning
  - FAST_FILTER (fiq/deepseek-v4-flash): Rapid job filtering & fast classification
  - CREATIVE_WRITING (fiq/grok-4.5): Tailored cover letters & persuasive pitch
  - CONVERSATIONAL (fiq/kimi-k3): Multilingual chat & candidate persona
"""

from __future__ import annotations
import asyncio
import json
import logging
import urllib.request
import urllib.error
from typing import Optional, List, Dict, Any

try:
    from config.settings import API_BASE_URL, API_KEY
except ImportError:
    API_BASE_URL = "https://rootsys.cloud/v1"
    API_KEY = "fiq-a0fd300c5ed7b18a767f753f36547435"

logger = logging.getLogger("job_agent.llm")


class ModelExpertise:
    """Model specialization routing table."""
    CODE_DEV = "fiq/kimi-k2.7-code"        # Scripting, DOM selector extraction, Code
    DEEP_REASONING = "fiq/deepseek-v4-pro"  # ATS scoring, deep match reasoning, gap analysis
    FAST_FILTER = "fiq/deepseek-v4-flash"   # Rapid job filtering & quick classification
    CREATIVE_WRITING = "fiq/grok-4.5"      # Tailored cover letters & persuasive pitch
    CONVERSATIONAL = "fiq/kimi-k3"          # Multilingual chat & candidate persona


def select_model_by_prompt(messages: List[Dict[str, str]]) -> str:
    """Infer the specialized LLM model based on prompt content and task domain."""
    text = " ".join([m.get("content", "") for m in messages]).lower()
    if any(k in text for k in ["code", "script", "python", "html", "c++", "sql", "troubleshoot", "playwright"]):
        return ModelExpertise.CODE_DEV
    if any(k in text for k in ["evaluate", "network", "ccna", "vlan", "ospf", "security", "ats", "audit"]):
        return ModelExpertise.DEEP_REASONING
    if any(k in text for k in ["cover letter", "pitch", "persuasive", "recommend", "writing"]):
        return ModelExpertise.CREATIVE_WRITING
    if any(k in text for k in ["quick", "filter", "classify", "fast"]):
        return ModelExpertise.FAST_FILTER
    return ModelExpertise.CONVERSATIONAL


def query_llm_model(
    messages: List[Dict[str, str]],
    model: Optional[str] = None,
    temperature: float = 0.6,
    base_url: Optional[str] = None,
    api_key: Optional[str] = None,
    timeout: int = 15,
) -> Optional[str]:
    """
    Synchronous completion request to a specialized model based on domain expertise.
    """
    if not model or model == "AUTO":
        model = select_model_by_prompt(messages)

    url = f"{(base_url or API_BASE_URL).rstrip('/')}/chat/completions"
    key = api_key or API_KEY

    payload = {
        "model": model,
        "messages": messages,
        "temperature": temperature,
    }

    headers = {
        "Authorization": f"Bearer {key}",
        "Content-Type": "application/json",
        "User-Agent": "Antigravity-MultiModel/1.0",
    }

    try:
        req = urllib.request.Request(
            url,
            data=json.dumps(payload).encode("utf-8"),
            headers=headers,
            method="POST",
        )
        with urllib.request.urlopen(req, timeout=timeout) as res:
            if res.status == 200:
                response_data = json.loads(res.read().decode("utf-8"))
                content = response_data["choices"][0]["message"]["content"]
                logger.info("[%s] API completion success (%d chars)", model, len(content))
                return content
            else:
                logger.warning("[%s] API status code %d", model, res.status)
    except urllib.error.HTTPError as e:
        logger.warning("[%s] API HTTP Error %d: %s", model, e.code, e.reason)
    except Exception as e:
        logger.warning("[%s] Connection failed (%s).", model, e)

    return None


async def query_llm_model_async(
    messages: List[Dict[str, str]],
    model: str = ModelExpertise.CONVERSATIONAL,
    temperature: float = 0.6,
    timeout: int = 15,
) -> Optional[str]:
    """
    Asynchronous non-blocking completion request.
    """
    return await asyncio.to_thread(query_llm_model, messages, model, temperature, None, None, timeout)


async def execute_parallel_model_tasks(task_specs: Dict[str, Dict[str, Any]]) -> Dict[str, Optional[str]]:
    """
    Executes multiple specialized model tasks concurrently in parallel.
    Example task_specs:
    {
       "ats_reasoning": {"model": ModelExpertise.DEEP_REASONING, "messages": [...]},
       "cover_letter": {"model": ModelExpertise.CREATIVE_WRITING, "messages": [...]},
       "code_parse": {"model": ModelExpertise.CODE_DEV, "messages": [...]},
    }
    """
    logger.info("Executing %d specialized model tasks in parallel...", len(task_specs))
    keys = list(task_specs.keys())
    coroutines = [
        query_llm_model_async(
            messages=spec["messages"],
            model=spec.get("model", ModelExpertise.CONVERSATIONAL),
            temperature=spec.get("temperature", 0.6),
            timeout=spec.get("timeout", 15),
        )
        for spec in task_specs.values()
    ]

    results = await asyncio.gather(*coroutines, return_exceptions=True)
    out = {}
    for k, res in zip(keys, results):
        if isinstance(res, Exception):
            logger.warning("Parallel task [%s] failed with exception: %s", k, res)
            out[k] = None
        else:
            out[k] = res
    return out


# Alias for backward compatibility
query_kimi3 = query_llm_model
