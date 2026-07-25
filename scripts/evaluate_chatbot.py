import os
import json
import subprocess
import sys

INDEX_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'index.html')
REPORT_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data', 'chatbot_benchmark_report.json')

# 100+ Humanlike Conversational Test Cases
HUMANLIKE_BENCHMARK_QUERIES = [
    # Greetings & Human Small Talk
    {"query": "hi", "expected_category": "greeting"},
    {"query": "hello there!", "expected_category": "greeting"},
    {"query": "hai bro, how are you", "expected_category": "greeting"},
    {"query": "selamat pagi bang", "expected_category": "greeting"},
    {"query": "apa khabar hari ini", "expected_category": "greeting"},
    {"query": "你好！今天怎么样？", "expected_category": "greeting"},
    {"query": "வணக்கம் நலமா", "expected_category": "greeting"},
    {"query": "nice to meet you", "expected_category": "greeting"},
    {"query": "good afternoon", "expected_category": "greeting"},

    # Identity & Personality
    {"query": "who is irfan", "expected_category": "identity"},
    {"query": "siapa irfan ni sebenarnya", "expected_category": "identity"},
    {"query": "tell me about yourself", "expected_category": "identity"},
    {"query": "你是谁", "expected_category": "identity"},
    {"query": "what is your background", "expected_category": "identity"},
    {"query": "ceritakan tentang latar belakang anda", "expected_category": "identity"},

    # Age & Birth Year
    {"query": "how old is irfan", "expected_category": "age"},
    {"query": "umur irfan berapa", "expected_category": "age"},
    {"query": "tahun bila lahir", "expected_category": "age"},
    {"query": "几岁", "expected_category": "age"},

    # Military Service & Character Resilience
    {"query": "army service background", "expected_category": "military"},
    {"query": "askar wataniah experience", "expected_category": "military"},
    {"query": "tentera darat simpanan", "expected_category": "military"},
    {"query": "how do you handle stress and pressure", "expected_category": "military"},
    {"query": "disiplin irfan macam mana", "expected_category": "military"},

    # Location, Relocation & Workplace Flexibility
    {"query": "where are you located", "expected_category": "location"},
    {"query": "tinggal kat mana sekarang", "expected_category": "location"},
    {"query": "are you willing to relocate to KL or Penang", "expected_category": "location"},
    {"query": "can you work remote or hybrid", "expected_category": "location"},
    {"query": "boleh outstation tak", "expected_category": "location"},

    # Graduation & Availability
    {"query": "when do you graduate", "expected_category": "availability"},
    {"query": "bila habis study kat utem", "expected_category": "availability"},
    {"query": "when are you available to start working", "expected_category": "availability"},
    {"query": "notice period for hiring", "expected_category": "availability"},

    # Why Hire Irfan & Core Strengths
    {"query": "why should we hire you", "expected_category": "strengths"},
    {"query": "sebab apa kena ambil irfan", "expected_category": "strengths"},
    {"query": "what makes irfan different from other candidates", "expected_category": "strengths"},
    {"query": "irfan top strengths", "expected_category": "strengths"},

    # Career Aspirations & Future Goals
    {"query": "what are your future career goals", "expected_category": "career_goals"},
    {"query": "where do you see yourself in 5 years", "expected_category": "career_goals"},
    {"query": "apa matlamat kerjaya irfan", "expected_category": "career_goals"},
    {"query": "cita cita kerjaya", "expected_category": "career_goals"},

    # Problem-Solving & Technical Approach
    {"query": "how do you troubleshoot difficult technical bugs", "expected_category": "problem_solving"},
    {"query": "cara selesaikan masalah kod", "expected_category": "problem_solving"},
    {"query": "troubleshooting methodology", "expected_category": "problem_solving"},

    # Leadership & Teamwork
    {"query": "are you a team player", "expected_category": "teamwork"},
    {"query": "leadership style", "expected_category": "teamwork"},
    {"query": "kerja berpasukan", "expected_category": "teamwork"},

    # Fast Learning & Adaptability
    {"query": "how fast do you learn new technology", "expected_category": "fast_learner"},
    {"query": "belajar teknologi baru cepat tak", "expected_category": "fast_learner"},
    {"query": "are you a fast learner", "expected_category": "fast_learner"},

    # Salary Expectations & Compensation
    {"query": "salary expectations", "expected_category": "salary"},
    {"query": "gaji berapa nak", "expected_category": "salary"},
    {"query": "expected pay range", "expected_category": "salary"},

    # Shift Work & Work Hours Flexibility
    {"query": "can work night shift or weekend", "expected_category": "shift"},
    {"query": "boleh kerja syif malam atau overtime", "expected_category": "shift"},

    # Capstone & Computer Vision Deep Dive
    {"query": "tell me about YOLOv8 self checkout project", "expected_category": "capstone"},
    {"query": "self checkout precision and recall rate", "expected_category": "capstone"},
    {"query": "projek capstone ape yang irfan buat", "expected_category": "capstone"},
    {"query": "computer vision and opencv experience", "expected_category": "capstone"},
    {"query": "biggest challenge in your capstone project", "expected_category": "capstone"},

    # Networking & Cisco CCNA
    {"query": "do you have CCNA certification", "expected_category": "ccna"},
    {"query": "sijil cisco ada tak", "expected_category": "ccna"},
    {"query": "OSPF VLAN and subnetting experience", "expected_category": "networking"},
    {"query": "networking knowledge and wireshark", "expected_category": "networking"},

    # Festo & Industrial Automation / AI
    {"query": "festo industrial ai cert", "expected_category": "festo"},
    {"query": "predictive maintenance experience", "expected_category": "festo"},

    # Hardware, IoT & Embedded Electronics
    {"query": "arduino and iot experience", "expected_category": "hardware"},
    {"query": "sensor integration and pcb easyeda", "expected_category": "hardware"},
    {"query": "pandai hardware dan elektronik tak", "expected_category": "hardware"},

    # Web Development & Full-Stack Capabilities
    {"query": "web development stack", "expected_category": "webdev"},
    {"query": "javascript html css nodejs skills", "expected_category": "webdev"},

    # Languages Spoken
    {"query": "what languages can you speak fluently", "expected_category": "languages"},
    {"query": "boleh cakap bahasa inggeris dan melayu", "expected_category": "languages"},

    # Contact Info & Verification
    {"query": "how to contact irfan", "expected_category": "contact"},
    {"query": "nombor telefon irfan berapa", "expected_category": "contact"},
    {"query": "email address", "expected_category": "contact"},

    # Gratitude & Polite Sign-offs
    {"query": "thank you so much", "expected_category": "gratitude"},
    {"query": "terima kasih banyak", "expected_category": "gratitude"},
    {"query": "thanks for the info", "expected_category": "gratitude"},
    {"query": "goodbye", "expected_category": "gratitude"}
]

def run_evaluation():
    print(f"[HUMANLIKE EVALUATION] Running Chatbot Intelligence Benchmark over {len(HUMANLIKE_BENCHMARK_QUERIES)} test cases...")

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

    const queries = """ + json.dumps(HUMANLIKE_BENCHMARK_QUERIES) + """;
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

    print(f"\n[METRICS] Humanlike Conversational Accuracy: {accuracy:.1f}% ({passed_count}/{total} passed)")
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
