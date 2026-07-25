import unittest
import os
import json
import subprocess
import sys

class TestChatbotEngine(unittest.TestCase):
    def test_spontaneous_intent_benchmark(self):
        index_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'index.html')
        clean_index_path = index_path.replace("\\", "/")

        queries = [
            {"query": "hi", "expected": "greeting"},
            {"query": "who is irfan", "expected": "identity"},
            {"query": "how old is irfan", "expected": "age"},
            {"query": "army service", "expected": "military"},
            {"query": "where are you located", "expected": "location"},
            {"query": "when do you graduate", "expected": "availability"},
            {"query": "why should we hire you", "expected": "strengths"},
            {"query": "salary expectations", "expected": "salary"},
            {"query": "can work night shift", "expected": "shift"},
            {"query": "tell me about YOLOv8 project", "expected": "capstone"},
            {"query": "do you have CCNA certification", "expected": "ccna"},
            {"query": "festo industrial ai cert", "expected": "festo"},
            {"query": "arduino and iot experience", "expected": "hardware"},
            {"query": "web development stack", "expected": "webdev"},
            {"query": "what languages can you speak", "expected": "languages"},
            {"query": "how to contact irfan", "expected": "contact"}
        ]

        node_script = """
        const fs = require('fs');
        const html = fs.readFileSync('""" + clean_index_path + """', 'utf8');
        const dataStr = html.match(/const RESUME_DATA = ([\\s\\S]*?);\\n\\s*const SYSTEM_PROMPT/)[1];
        const langStr = html.match(/function detectUserLanguage[\\s\\S]*?\\n        \\}/)[0];
        const funcStr = html.match(/function generateNativeSpontaneousAnswer[\\s\\S]*?\\n        \\}/)[0];

        const RESUME_DATA = eval('(' + dataStr + ')');
        eval(langStr);
        eval(funcStr);

        const queries = """ + json.dumps(queries) + """;
        const results = queries.map(item => {
            const lang = detectUserLanguage(item.query);
            const ans = generateNativeSpontaneousAnswer(item.query, lang);
            const isFallback = ans.includes("I don't have that exact detail") || ans.includes("Saya tidak mempunyai maklumat khusus");
            return { query: item.query, passed: !isFallback };
        });

        console.log(JSON.stringify(results));
        """

        res = subprocess.run(['node', '-e', node_script], stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, encoding='utf-8', errors='replace')
        self.assertEqual(res.returncode, 0, f"Node script error: {res.stderr}")

        results = json.loads(res.stdout)
        failed = [r['query'] for r in results if not r['passed']]
        self.assertEqual(len(failed), 0, f"Failed queries fell through to fallback: {failed}")

if __name__ == '__main__':
    unittest.main()
