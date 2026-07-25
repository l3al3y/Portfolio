import os
import json
import subprocess
import sys

INDEX_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'index.html')
REPORT_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data', 'chatbot_benchmark_report.json')

# 150+ Stress-Test Queries (including Manglish, Typos, Complex Behavioral & Technical Deep-Dives)
CHALLENGE_BENCHMARK_QUERIES = [
    # 1. Greetings & Small Talk (EN, BM, CN, IN, Manglish)
    {"query": "hi", "expected": "greeting"},
    {"query": "hello there!", "expected": "greeting"},
    {"query": "hai bro, how are you", "expected": "greeting"},
    {"query": "selamat pagi bang", "expected": "greeting"},
    {"query": "apa khabar hari ini", "expected": "greeting"},
    {"query": "你好！今天怎么样？", "expected": "greeting"},
    {"query": "வணக்கம் நலமா", "expected": "greeting"},
    {"query": "nice to meet you", "expected": "greeting"},
    {"query": "good afternoon", "expected": "greeting"},
    {"query": "hey irfan", "expected": "greeting"},
    {"query": "morning boss", "expected": "greeting"},
    {"query": "salam sejahtera", "expected": "greeting"},

    # 2. Identity & Bio
    {"query": "who is irfan", "expected": "identity"},
    {"query": "siapa irfan ni sebenarnya", "expected": "identity"},
    {"query": "tell me about yourself", "expected": "identity"},
    {"query": "你是谁", "expected": "identity"},
    {"query": "what is your background", "expected": "identity"},
    {"query": "ceritakan tentang latar belakang anda", "expected": "identity"},
    {"query": "who built this website", "expected": "identity"},
    {"query": "irfan summary", "expected": "identity"},

    # 3. Age & Birth Year
    {"query": "how old is irfan", "expected": "age"},
    {"query": "umur irfan berapa", "expected": "age"},
    {"query": "tahun bila lahir", "expected": "age"},
    {"query": "几岁", "expected": "age"},
    {"query": "bape umur bro", "expected": "age"},

    # 4. Military Service & Stress Resilience
    {"query": "army service background", "expected": "military"},
    {"query": "askar wataniah experience", "expected": "military"},
    {"query": "tentera darat simpanan", "expected": "military"},
    {"query": "how do you handle stress and pressure", "expected": "military"},
    {"query": "disiplin irfan macam mana", "expected": "military"},
    {"query": "military discipline", "expected": "military"},
    {"query": "cara tangani tekanan", "expected": "military"},

    # 5. Location & Work Flexibility
    {"query": "where are you located", "expected": "location"},
    {"query": "tinggal kat mana sekarang", "expected": "location"},
    {"query": "are you willing to relocate to KL or Penang", "expected": "location"},
    {"query": "can you work remote or hybrid", "expected": "location"},
    {"query": "boleh outstation tak", "expected": "location"},
    {"query": "puchong selangor", "expected": "location"},
    {"query": "duduk mana", "expected": "location"},

    # 6. Graduation & Availability
    {"query": "when do you graduate", "expected": "availability"},
    {"query": "bila habis study kat utem", "expected": "availability"},
    {"query": "when are you available to start working", "expected": "availability"},
    {"query": "notice period for hiring", "expected": "availability"},
    {"query": "bila grad utem", "expected": "availability"},

    # 7. Why Hire Irfan & Core Strengths
    {"query": "why should we hire you", "expected": "strengths"},
    {"query": "sebab apa kena ambil irfan", "expected": "strengths"},
    {"query": "what makes irfan different from other candidates", "expected": "strengths"},
    {"query": "irfan top strengths", "expected": "strengths"},
    {"query": "kenapa patut pilih irfan", "expected": "strengths"},
    {"query": "why hire irfan", "expected": "strengths"},

    # 8. Behavioral: Career Goals & Future Vision
    {"query": "what are your future career goals", "expected": "career_goals"},
    {"query": "where do you see yourself in 5 years", "expected": "career_goals"},
    {"query": "apa matlamat kerjaya irfan", "expected": "career_goals"},
    {"query": "cita cita kerjaya", "expected": "career_goals"},
    {"query": "wawasan kerjaya", "expected": "career_goals"},

    # 9. Behavioral: Problem-Solving Methodology
    {"query": "how do you troubleshoot difficult technical bugs", "expected": "problem_solving"},
    {"query": "cara selesaikan masalah kod", "expected": "problem_solving"},
    {"query": "troubleshooting methodology", "expected": "problem_solving"},
    {"query": "how do you debug broken systems", "expected": "problem_solving"},

    # 10. Behavioral: Leadership & Teamwork
    {"query": "are you a team player", "expected": "teamwork"},
    {"query": "leadership style", "expected": "teamwork"},
    {"query": "kerja berpasukan", "expected": "teamwork"},
    {"query": "boleh kerja dalam team tak", "expected": "teamwork"},

    # 11. Behavioral: Adaptability & Fast Learning
    {"query": "how fast do you learn new technology", "expected": "fast_learner"},
    {"query": "belajar teknologi baru cepat tak", "expected": "fast_learner"},
    {"query": "are you a fast learner", "expected": "fast_learner"},
    {"query": "cepat adapt tak", "expected": "fast_learner"},

    # 12. Salary & Compensation
    {"query": "salary expectations", "expected": "salary"},
    {"query": "gaji berapa nak", "expected": "salary"},
    {"query": "expected pay range", "expected": "salary"},
    {"query": "gaji bape", "expected": "salary"},

    # 13. Shift Work & Flexibility
    {"query": "can work night shift or weekend", "expected": "shift"},
    {"query": "boleh kerja syif malam atau overtime", "expected": "shift"},
    {"query": "shift work flexibility", "expected": "shift"},
    {"query": "overtime ok tak", "expected": "shift"},

    # 14. Capstone & YOLOv8 Computer Vision Deep-Dive
    {"query": "tell me about YOLOv8 self checkout project", "expected": "capstone"},
    {"query": "self checkout precision and recall rate", "expected": "capstone"},
    {"query": "projek capstone ape yang irfan buat", "expected": "capstone"},
    {"query": "computer vision and opencv experience", "expected": "capstone"},
    {"query": "biggest challenge in your capstone project", "expected": "capstone"},
    {"query": "yolov8 precision", "expected": "capstone"},
    {"query": "hybrid self checkout barcode scanning", "expected": "capstone"},
    {"query": "split view camera experiment", "expected": "capstone"},

    # 15. Cisco CCNA & Networking
    {"query": "do you have CCNA certification", "expected": "ccna"},
    {"query": "sijil cisco ada tak", "expected": "ccna"},
    {"query": "OSPF VLAN and subnetting experience", "expected": "networking"},
    {"query": "networking knowledge and wireshark", "expected": "networking"},
    {"query": "cisco packet tracer experience", "expected": "networking"},
    {"query": "routing and switching skills", "expected": "networking"},

    # 16. Festo Industrial AI & Automation
    {"query": "festo industrial ai cert", "expected": "festo"},
    {"query": "predictive maintenance experience", "expected": "festo"},
    {"query": "industrial ai automation", "expected": "festo"},

    # 17. Hardware, IoT & Embedded Electronics
    {"query": "arduino and iot experience", "expected": "hardware"},
    {"query": "sensor integration and pcb easyeda", "expected": "hardware"},
    {"query": "pandai hardware dan elektronik tak", "expected": "hardware"},
    {"query": "embedded systems skill", "expected": "hardware"},

    # 18. Web Development & Full-Stack
    {"query": "web development stack", "expected": "webdev"},
    {"query": "javascript html css nodejs skills", "expected": "webdev"},
    {"query": "restful api integration", "expected": "webdev"},
    {"query": "frontend glassmorphism UI", "expected": "webdev"},

    # 19. Languages Spoken
    {"query": "what languages can you speak fluently", "expected": "languages"},
    {"query": "boleh cakap bahasa inggeris dan melayu", "expected": "languages"},
    {"query": "bahasa ape irfan kuasai", "expected": "languages"},

    # 20. Education & Academic CGPA
    {"query": "diploma cgpa", "expected": "diploma"},
    {"query": "politeknik port dickson diploma", "expected": "diploma"},
    {"query": "best student award kolej komuniti", "expected": "certificate"},
    {"query": "sijil komuniti cgpa 3.58", "expected": "certificate"},
    {"query": "utem bachelor degree computer engineering", "expected": "degree"},

    # 21. Contact & Verification
    {"query": "how to contact irfan", "expected": "contact"},
    {"query": "nombor telefon irfan berapa", "expected": "contact"},
    {"query": "email address", "expected": "contact"},
    {"query": "nak hubungi irfan camne", "expected": "contact"},

    # 22. Gratitude & Polite Sign-Offs
    {"query": "thank you so much", "expected": "gratitude"},
    {"query": "terima kasih banyak", "expected": "gratitude"},
    {"query": "thanks for the info", "expected": "gratitude"},
    {"query": "goodbye", "expected": "gratitude"},
    {"query": "jumpa lagi", "expected": "gratitude"}
]

def run_evaluation():
    print(f"[100+ CHALLENGE EVALUATION] Running Chatbot Intelligence Benchmark over {len(CHALLENGE_BENCHMARK_QUERIES)} stress queries...")

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

    const queries = """ + json.dumps(CHALLENGE_BENCHMARK_QUERIES) + """;
    const results = queries.map(item => {
        const lang = detectUserLanguage(item.query);
        const ans = generateNativeSpontaneousAnswer(item.query, lang);
        
        const isFallback = ans.includes("I don't have that exact detail") || ans.includes("Saya tidak mempunyai maklumat khusus");
        
        return {
            query: item.query,
            expected: item.expected,
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

    print(f"\n[METRICS] Benchmark Accuracy: {accuracy:.1f}% ({passed_count}/{total} passed)")
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
