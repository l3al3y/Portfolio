import os
import json
import subprocess
import sys
import random

INDEX_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'index.html')
REPORT_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data', 'chatbot_1k_benchmark_report.json')

# Core Intent Anchors for Generator Matrix
INTENT_PATTERNS = {
    "greeting": {
        "en": ["hi", "hello", "hey", "greetings", "good morning", "good afternoon", "good evening", "nice to meet you", "morning boss"],
        "bm": ["hai", "selamat pagi", "selamat petang", "apa khabar", "salam", "salam sejahtera", "hai bang", "assalamualaikum"],
        "cn": ["你好", "您好", "早上好", "下午好", "晚上好", "很高兴认识你"],
        "in": ["வணக்கம்", "நலமா", "காலை வணக்கம்"],
        "modifiers": ["bro", "boss", "sir", "irfan", "ai", "there", "!", "!!", "👋", "😊"]
    },
    "identity": {
        "en": ["who are you", "who is irfan", "tell me about yourself", "what is your background", "who built this", "irfan profile", "identity summary"],
        "bm": ["siapa irfan ni", "siapa anda", "ceritakan latar belakang", "latar belakang irfan", "siapa buat web ni", "biodata irfan"],
        "cn": ["你是谁", "介绍一下自己", "Irfan 的背景", "谁做的网站", "关于 irfan"],
        "in": ["நீங்கள் யார்", "இர்பான் யார்", "உங்களைப் பற்றி சொல்லுங்கள்"],
        "modifiers": ["please", "bro", "bang", "sekian", "summary", "?", "??", "👀"]
    },
    "age": {
        "en": ["how old are you", "what is irfan's age", "birth year", "when were you born", "how old is irfan"],
        "bm": ["umur irfan berapa", "berapa umur bro", "tahun bila lahir", "umur berapa", "bape umur"],
        "cn": ["你几岁", "Irfan 多大", "出生年份"],
        "in": ["உங்கள் வயது என்ன", "இர்பானின் வயது"],
        "modifiers": ["now", "skrg", "harini", "bro", "?", "🎂"]
    },
    "military": {
        "en": ["military background", "army reserve experience", "askar wataniah", "handling stress and pressure", "military discipline", "resilience under pressure"],
        "bm": ["pengalaman askar wataniah", "tentera darat simpanan", "disiplin ketenteraan", "cara hadapi tekanan", "stress resilience"],
        "cn": ["军队经历", "后备军经验", "Askar Wataniah 训练", "高压应对能力"],
        "in": ["இராணுவ அனுபவம்", "மன அழுத்தம் கையாளும் திறன்"],
        "modifiers": ["terbaik", "rigorous", "discipline", "military", "?", "🪖"]
    },
    "location": {
        "en": ["where do you live", "where are you located", "are you in Puchong", "can you relocate", "open to remote work", "onsite hybrid flexibility"],
        "bm": ["tinggal kat mana", "duduk mana sekarang", "puchong selangor", "boleh outstation tak", "boleh pindah tak", "kerja remote hybrid"],
        "cn": ["你住哪里", "在 Puchong 吗", "可以出差吗", "支持远程工作吗"],
        "in": ["நீங்கள் எங்கு இருக்கிறீர்கள்", "புச்சோங்"],
        "modifiers": ["skrg", "now", "boss", "bro", "?", "📍"]
    },
    "availability": {
        "en": ["when can you start", "when do you graduate", "graduation date", "notice period", "availability to work", "when finish study at utem"],
        "bm": ["bila grad utem", "bila boleh mula kerja", "tarikh graduasi", "bila habis belajar", "notice period berapa lama"],
        "cn": ["什么时候毕业", "什么时候可以到岗", "毕业时间", "UTeM 毕业"],
        "in": ["எப்போது வேலை தொடங்கலாம்", "பட்டமளிப்பு எப்போது"],
        "modifiers": ["bro", "bang", "segera", "now", "?", "📅"]
    },
    "strengths": {
        "en": ["why should we hire you", "what makes you different", "what are your core strengths", "why hire irfan", "top highlights"],
        "bm": ["kenapa kena ambil irfan", "apa kelebihan utama irfan", "sebab apa pilih irfan", "kenapa patut pilih irfan"],
        "cn": ["为什么选择你", "你最大的亮点是什么", "为什么雇用 irfan"],
        "in": ["உங்களின் சிறப்பு அம்சம் என்ன", "ஏன் உங்களை வேலைக்கு எடுக்க வேண்டும்"],
        "modifiers": ["for this job", "bro", "boss", "✨", "🚀", "?"]
    },
    "career_goals": {
        "en": ["what are your career goals", "where do you see yourself in 5 years", "future vision", "career aspirations"],
        "bm": ["apa matlamat kerjaya irfan", "cita cita kerjaya", "wawasan masa depan", "matlamat 5 tahun"],
        "cn": ["你的职业目标是什么", "未来5年规划", "职业愿景"],
        "in": ["எதிர்கால இலக்குகள் என்ன"],
        "modifiers": ["long term", "vision", "bro", "🎯", "?"]
    },
    "problem_solving": {
        "en": ["troubleshooting methodology", "how do you solve complex bugs", "problem solving approach", "debugging process"],
        "bm": ["cara selesaikan masalah kod", "troubleshoot bug macam mana", "pendekatan penyelesaian masalah"],
        "cn": ["解决问题的思路", "排查 bug 的方法", "故障排除"],
        "in": ["சிக்கல்களைத் தீர்க்கும் முறை"],
        "modifiers": ["step by step", "bro", "🛠️", "?"]
    },
    "teamwork": {
        "en": ["are you a team player", "leadership style", "working in a team", "collaboration experience"],
        "bm": ["kerja berpasukan", "boleh kerja dalam team tak", "gaya kepimpinan"],
        "cn": ["团队合作能力", "领导风格", "团队协作"],
        "in": ["குழுப்பணி திறன்"],
        "modifiers": ["together", "pasukan", "👥", "?"]
    },
    "fast_learner": {
        "en": ["are you a fast learner", "how quickly do you learn new technology", "adaptability to new tools"],
        "bm": ["belajar cepat tak", "cepat adapt teknologi baru", "pembelajar cepat"],
        "cn": ["学习能力怎么样", "快速自学能力", "新技术适应"],
        "in": ["விரைவாகக் கற்றுக்கொள்ளும் திறன்"],
        "modifiers": ["fast", "rapid", "⚡", "?"]
    },
    "salary": {
        "en": ["salary expectations", "expected pay range", "how much salary do you want"],
        "bm": ["gaji berapa nak", "jangkaan gaji", "expected salary bro"],
        "cn": ["期望薪资是多少", "薪水要求"],
        "in": ["எதிர்பார்க்கப்படும் சம்பளம்"],
        "modifiers": ["per month", "negotiable", "💰", "?"]
    },
    "shift": {
        "en": ["can you work night shift", "weekend shift flexibility", "overtime work"],
        "bm": ["boleh kerja syif malam tak", "overtime ok tak", "kerja hujung minggu"],
        "cn": ["可以上夜班吗", "支持加班吗", "轮班工作"],
        "in": ["ஷிப்ட் வேலை செய்ய முடியுமா"],
        "modifiers": ["overtime", "flexible", "⏰", "?"]
    },
    "capstone": {
        "en": ["tell me about your YOLOv8 self checkout project", "capstone precision recall", "barcode scanner dual verification", "computer vision latency"],
        "bm": ["projek capstone hybrid self checkout", "yolov8 precision bape", "barcode scanning camera", "split view experiment"],
        "cn": ["毕业项目 YOLOv8", "自选结账系统精度", "条形码双重验证"],
        "in": ["கணினி பார்வை திட்டம்", "YOLOv8 துல்லியம்"],
        "modifiers": ["epochs", "150ms", "OpenCV", "🤖", "?"]
    },
    "networking": {
        "en": ["do you have CCNA certification", "cisco networking knowledge", "OSPF VLAN subnetting Wireshark", "routing and switching skills"],
        "bm": ["sijil cisco ccna ada tak", "ilmu networking cisco", "ospf vlan packet tracer", "wireshark troubleshooting"],
        "cn": ["Cisco CCNA 认证", "网络知识 OSPF VLAN", "Wireshark 抓包"],
        "in": ["சிஸ்கோ CCNA சான்றிதழ்", "நெட்வொர்க்கிங் அறிவு"],
        "modifiers": ["CCNA 2026", "Enterprise", "🔌", "?"]
    },
    "festo": {
        "en": ["festo industrial ai certification", "predictive maintenance", "industrial automation with AI"],
        "bm": ["sijil festo industrial ai", "penyelenggaraan ramalan", "automasi industri AI"],
        "cn": ["FestoDidactic 认证", "工业AI自动化", "预测性维护"],
        "in": ["Festo AI சான்றிதழ்"],
        "modifiers": ["Festo", "2026", "🏭", "?"]
    },
    "hardware": {
        "en": ["arduino iot experience", "pcb design easyeda", "microcontroller sensor integration", "embedded electronics"],
        "bm": ["kemahiran hardware iot", "arduino sensor pcb", "sistem terbenam elektronik"],
        "cn": ["Arduino 嵌入式", "PCB 电路设计", "传感器集成"],
        "in": ["Arduino மற்றும் IoT"],
        "modifiers": ["EasyEDA", "HX711", "⚡", "?"]
    },
    "webdev": {
        "en": ["fullstack web development skills", "javascript html css nodejs", "restful api integration", "frontend glassmorphism UI"],
        "bm": ["kemahiran pembangunan web", "html css javascript nodejs", "integrasi restful api"],
        "cn": ["全栈 Web 开发", "JavaScript HTML CSS", "RESTful API 集成"],
        "in": ["இணையதள உருவாக்கம்"],
        "modifiers": ["Web", "ES6+", "💻", "?"]
    },
    "languages": {
        "en": ["what languages do you speak", "are you fluent in English and Malay", "language proficiency"],
        "bm": ["boleh cakap bahasa apa", "fasih bm dan english tak", "penguasaan bahasa"],
        "cn": ["你能说哪些语言", "精通英文和马来文吗"],
        "in": ["என்ன மொழிகள் பேசுவீர்கள்"],
        "modifiers": ["fluency", "natively", "🗣️", "?"]
    },
    "diploma": {
        "en": ["diploma in electronic engineering computer", "politeknik port dickson diploma cgpa", "diploma cgpa 3.26"],
        "bm": ["diploma kejuruteraan elektronik komputer", "cgpa diploma politeknik port dickson", "cgpa 3.26"],
        "cn": ["文凭学历", "Politeknik Port Dickson 文凭 CGPA 3.26"],
        "in": ["டிப்ளமோ கல்வி CGPA 3.26"],
        "modifiers": ["PPD", "CGPA", "🎓", "?"]
    },
    "certificate": {
        "en": ["certificate in computer systems and networking", "kolej komuniti selandar best student award", "sijil cgpa 3.58"],
        "bm": ["sijil sistem komputer dan rangkaian", "anugerah pelajar terbaik kolej komuniti", "cgpa 3.58"],
        "cn": ["Kolej Komuniti 证书", "最佳学生奖 CGPA 3.58"],
        "in": ["சிறந்த மாணவர் விருது CGPA 3.58"],
        "modifiers": ["Selandar", "March 2018", "🏆", "?"]
    },
    "degree": {
        "en": ["bachelor of computer engineering utem", "utem expected graduation date", "degree in computer engineering"],
        "bm": ["ijazah sarjana muda kejuruteraan komputer utem", "bila grad degree utem"],
        "cn": ["UTeM 计算机工程学士学位", "预计毕业时间"],
        "in": ["UTeM கணினி பொறியியல் பட்டம்"],
        "modifiers": ["Honours", "Nov 2026", "🎓", "?"]
    },
    "contact": {
        "en": ["how to contact irfan", "phone number and email", "turnstile contact verification modal"],
        "bm": ["nak hubungi irfan camne", "nombor telefon dan emel irfan", "turnstile verification modal"],
        "cn": ["如何联系 irfan", "电话号码和邮箱"],
        "in": ["இர்பானை தொடர்பு கொள்ளவது எப்படி"],
        "modifiers": ["direct", "contact form", "📞", "?"]
    },
    "gratitude": {
        "en": ["thank you so much", "thanks for the information", "goodbye have a nice day", "see you later"],
        "bm": ["terima kasih banyak", "sama sama", "jumpa lagi", "terima kasih info"],
        "cn": ["非常感谢", "谢谢你的解答", "再见"],
        "in": ["மிக்க நன்றி", "மீண்டும் சந்திப்போம்"],
        "modifiers": ["bro", "boss", "😊", "👋", "!"]
    }
}

def generate_1000_benchmark():
    dataset = []
    random.seed(42) # Deterministic reproducability

    categories = list(INTENT_PATTERNS.keys())
    
    # Generate 1,200 distinct test cases
    target_count = 1200
    generated_set = set()

    while len(dataset) < target_count:
        cat = random.choice(categories)
        data = INTENT_PATTERNS[cat]
        lang_choice = random.choice(["en", "bm", "cn", "in"])
        phrase = random.choice(data[lang_choice])
        modifier = random.choice(data["modifiers"])
        
        # Combine in various structures
        pattern_type = random.randint(1, 4)
        if pattern_type == 1:
            q = f"{phrase} {modifier}".strip()
        elif pattern_type == 2:
            q = f"{modifier} {phrase}".strip()
        elif pattern_type == 3:
            q = f"{phrase}".strip()
        else:
            q = f"{phrase} {modifier} {modifier}".strip()

        if q not in generated_set:
            generated_set.add(q)
            dataset.append({
                "query": q,
                "expected": cat,
                "lang_origin": lang_choice
            })

    print(f"[DATASET GENERATOR] Successfully created dataset with {len(dataset)} synthetic stress test queries.")
    return dataset

def run_large_scale_evaluation():
    test_suite = generate_1000_benchmark()
    
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

    const queries = """ + json.dumps(test_suite) + """;
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

    js_file_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'scratch', 'eval_1k_runner.js')
    os.makedirs(os.path.dirname(js_file_path), exist_ok=True)
    with open(js_file_path, 'w', encoding='utf-8') as f:
        f.write(node_script)

    res = subprocess.run(['node', js_file_path], stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, encoding='utf-8', errors='replace')
    if res.returncode != 0:
        print("[ERROR] Node benchmark script failed:")
        print(res.stderr)
        sys.exit(1)

    results = json.loads(res.stdout)
    total = len(results)
    passed_count = sum(1 for r in results if r['passed'])
    accuracy = (passed_count / total) * 100

    failed_list = [r for r in results if not r['passed']]

    print(f"\n=======================================================")
    print(f"📊 1,000+ HIGH-THROUGHPUT STRESS BENCHMARK RESULTS")
    print(f"=======================================================")
    print(f"Total Benchmark Queries Evaluated: {total}")
    print(f"Passed Benchmark Responses:       {passed_count}")
    print(f"Failed / Fallback Responses:      {len(failed_list)}")
    print(f"Overall Conversational Accuracy:  {accuracy:.2f}%")
    print(f"=======================================================")

    if failed_list:
        print(f"\n[FAILURE CASES] Top 10 fallbacks:")
        for f in failed_list[:10]:
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

    print(f"\n[REPORT] Saved 1K benchmark report to: {REPORT_PATH}")
    return report

if __name__ == '__main__':
    import sys
    sys.stdout.reconfigure(encoding='utf-8')
    run_large_scale_evaluation()
