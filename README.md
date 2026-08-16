# Muhammad Irfan Fahmi — Portfolio
Personal engineering portfolio (Network Engineering, IT Infrastructure, Cyber Security, Computer Vision, Industrial AI).

## Quick Links
- Live: https://l3al3y.github.io/Portfolio/
- Backend: https://github.com/l3al3y/Portfolio-Backend
- Resume: resume/resume.pdf
- Certificates: certificates/ (18 verified)

## Run locally
```bash
python3 -m http.server 8000   # or: npx serve .
```
Architecture: static index.html + Cloudflare Worker backend (chat/contact). Degrades to offline Q&A when API down.

## Features
- AI chatbot: multilingual + Malaysian dialects, CNN typo correction, 8-model chain (DeepSeek V4 Pro/Flash, GLM 5.1/5.2, HY3 Tencent, Kimi K2.7/K3, MiniMax M3) via Worker
- Offline-first: 50+ resume Q&A topics
- Security: Turnstile CAPTCHA, rate limiting, XSS sanitization, no keys in browser
- 18-cert registry with modal viewer + filters
- Glassmorphism UI, 3D Three.js bg, dark/light theme, SEO

## Capstone
Hybrid Self-Checkout: YOLOv8 + barcode cross-verification, 77.4% precision / 72.0% recall / <90ms

## Open Source
Parliament of Minds governance agent -> 500-AI-Agents-Projects (36.2k star) PR #167
