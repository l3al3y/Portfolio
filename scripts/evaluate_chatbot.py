import os
import json
import subprocess
import sys

INDEX_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'index.html')
REPORT_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data', 'chatbot_benchmark_report.json')

BENCHMARK_QUERIES = [
    # Greetings & Casual
    {"query": "hi", "expected_category": "greeting"},
    {"query": "hello there", "expected_category": "greeting"},
    {"query": "hai bro", "expected_category": "greeting"},
    {"query": "selamat pagi", "expected_category": "greeting"},
    {"query": "apa khabar", "expected_category": "greeting"},
    {"query": "你好", "expected_category": "greeting"},
    {"query": "வணக்கம்", "expected_category": "greeting"},

    # Identity & Bio
    {"query": "who is irfan", "expected_category": "identity"},
    {"query": "siapa irfan ni", "expected_category": "identity"},
    {"query": "tell me about yourself", "expected_category": "identity"},
    {"query": "你是谁", "expected_category": "identity"},

    # Age
    {"query": "how old is irfan", "expected_category": "age"},
    {"query": "umur irfan berapa", "expected_category": "age"},
    {"query": "tahun bila lahir", "expected_category": "age"},
    {"query": "几岁", "expected_category": "age"},

    # Military & Resilience
    {"query": "army service", "expected_category": "military"},
    {"query": "askar wataniah", "expected_category": "military"},
    {"query": "tentera darat", "expected_category": "military"},
    {"query": "stress resilience", "expected_category": "military"},

    # Location & Relocation
    {"query": "where are you located", "expected_category": "location"},
    {"query": "tinggal kat mana", "expected_category": "location"},
    {"query": "willing to relocate to KL", "expected_category": "location"},
    {"query": "can work remote", "expected_category": "location"},

    # Graduation & Availability
    {"query": "when do you graduate", "expected_category": "availability"},
    {"query": "bila habis study", "expected_category": "availability"},
    {"query": "available date", "expected_category": "availability"},
    {"query": "notice period", "expected_category": "availability"},

    # Why Hire & Strengths
    {"query": "why should we hire you", "expected_category": "strengths"},
    {"query": "sebab apa kena ambil irfan", "expected_category": "strengths"},
    {"query": "what makes irfan special", "expected_category": "strengths"},
    {"query": "irfan strengths", "expected_category": "strengths"},

    # Salary & Shift
    {"query": "salary expectations", "expected_category": "salary"},
    {"query": "gaji berapa nak", "expected_category": "salary"},
    {"query": "can work night shift", "expected_category": "shift"},
    {"query": "boleh kerja syif malam", "expected_category": "shift"},

    # Projects & Computer Vision
    {"query": "tell me about YOLOv8 project", "expected_category": "capstone"},
    {"query": "self checkout precision rate", "expected_category": "capstone"},
    {"query": "projek capstone ape", "expected_category": "capstone"},
    {"query": "computer vision experience", "expected_category": "capstone"},

    # Cisco & Networking
    {"query": "do you have CCNA certification", "expected_category": "ccna"},
    {"query": "sijil cisco ada tak", "expected_category": "ccna"},
    {"query": "OSPF and VLAN experience", "expected_category": "networking"},
    {"query": "networking knowledge", "expected_category": "networking"},

    # Festo & Industrial AI
    {"query": "festo industrial ai cert", "expected_category": "festo"},
    {"query": "predictive maintenance", "expected_category": "festo"},

    # Hardware & IoT
    {"query": "arduino and iot experience", "expected_category": "hardware"},
    {"query": "sensor integration and pcb", "expected_category": "hardware"},
    {"query": "pandai hardware tak", "expected_category": "hardware"},

    # Web & Full-Stack
    {"query": "web development stack", "expected_category": "webdev"},
    {"query": "javascript and html css", "expected_category": "webdev"},

    # Languages
    {"query": "what languages can you speak", "expected_category": "languages"},
    {"query": "boleh cakap bahasa inggeris", "expected_category": "languages"},

    # Contact
    {"query": "how to contact irfan", "expected_category": "contact"},
    {"query": "nombor telefon irfan", "expected_category": "contact"},
    {"query": "email address", "expected_category": "contact"}
]

def run_evaluation():
    print(f"[EVALUATION] Running Chatbot Intelligence Benchmark over {len(BENCHMARK_QUERIES)} test cases...")

    clean_index_path = INDEX_PATH.replace("\\", "/")
    node_script = """
    const fs = require('fs');
    const html = fs.readFileSync('""" + clean_index_path + """', 'utf8');
    const dataStr = html.match(/const RESUME_DATA = ([\\s\\S]*?);\\n\\s*const SYSTEM_PROMPT/)[1];
    const langStr = html.match(/function detectUserLanguage[\\s\\S]*?\\n        \\}/)[0];
    const funcStr = html.match(/function generateNativeSpontaneousAnswer[\\s\\S]*?\\n        \\}/)[0];

    const RESUME_DATA = eval('(' + dataStr + ')');
    eval(langStr);
    eval(funcStr);

    const queries = """ + json.dumps(BENCHMARK_QUERIES) + """;
    const results = queries.map(item => {
        const lang = detectUserLanguage(item.query);
        const ans = generateNativeSpontaneousAnswer(item.query, lang);
        
        const isFallback = ans.includes("I don't have that exact detail") || ans.includes("Saya tidak mempunyai maklumat khusus");
        
        return {
            query: item.query,
            expected: item.expected_category,
            lang: lang,
            answer: ans,
            is_fallback: isFallback,
            passed: !isFallback
        };
    });

    console.log(JSON.stringify(results, null, 2));
    """

    res = subprocess.run(['node', '-e', node_script], stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, encoding='utf-8', errors='replace')
    if res.returncode != 0:
        print("[ERROR] Node benchmark script failed:")
        print(res.stderr)
        sys.exit(1)

    results = json.loads(res.stdout)
    total = len(results)
    passed_count = sum(1 for r in results if r['passed'])
    accuracy = (passed_count / total) * 100

    failed_list = [r for r in results if not r['passed']]

    print(f"\n[METRICS] Accuracy: {accuracy:.1f}% ({passed_count}/{total} passed)")
    if failed_list:
        print(f"[FAILURE CASES] {len(failed_list)} queries fell back to generic summary:")
        for f in failed_list:
            print(f"  - [{f['lang'].upper()}] \"{f['query']}\" (Expected: {f['expected']})")

    report = {
        "total_queries": total,
        "passed": passed_count,
        "failed": len(failed_list),
        "accuracy_percent": round(accuracy, 2),
        "failed_queries": failed_list,
        "results": results
    }

    os.makedirs(os.path.dirname(REPORT_PATH), exist_ok=True)
    with open(REPORT_PATH, 'w', encoding='utf-8') as f:
        json.dump(report, f, indent=2, ensure_ascii=False)

    print(f"[REPORT] Saved full benchmark report to: {REPORT_PATH}")
    return report

if __name__ == '__main__':
    run_evaluation()
