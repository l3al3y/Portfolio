import os
import re

KEYWORDS = [
    "IT Support", "Technical Support", "Desktop Support", "Windows", "Network Engineer",
    "CCNA", "Cisco", "Routing", "Switching", "TCP/IP", "DHCP", "DNS", "VLAN", "OSPF",
    "LAN", "WAN", "Network Troubleshooting", "Infrastructure", "Firewall", "Cybersecurity",
    "Endpoint Security", "Incident Response", "Hardware Troubleshooting", "Printer Support",
    "Microsoft Office", "Python", "Git", "GitHub", "MySQL", "Automation",
    "Industrial Automation", "Artificial Intelligence", "AI", "Predictive Maintenance",
    "Computer Vision", "OpenCV", "YOLOv8", "IoT", "Arduino", "Customer Support",
    "Documentation", "Problem Solving"
]

def analyze_resume(file_path):
    if not os.path.exists(file_path):
        print(f"File not found: {file_path}")
        return

    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    # Strip HTML tags for clean text analysis
    text = re.sub(r'<[^>]+>', ' ', content)

    print(f"\n=== ATS Resume Analysis: {os.path.basename(file_path)} ===")
    words = text.split()
    print(f"Total Word Count: {len(words)} words")

    found_count = 0
    missing = []
    for kw in KEYWORDS:
        match = re.search(r'\b' + re.escape(kw) + r'\b', text, re.IGNORECASE)
        if match:
            found_count += 1
        else:
            missing.append(kw)

    score = (found_count / len(KEYWORDS)) * 100
    print(f"ATS Keyword Match Score: {score:.1f}% ({found_count}/{len(KEYWORDS)} target keywords matched)")
    if missing:
        print(f"  Missing: {', '.join(missing)}")

if __name__ == "__main__":
    base_dir = os.path.dirname(os.path.abspath(__file__))
    for fname in ["resume.html", "resume.md", "resume.txt"]:
        analyze_resume(os.path.join(base_dir, fname))
