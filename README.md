# Muhammad Irfan Fahmi — Portfolio

**Network Engineering · IT Infrastructure · Cyber Security · Computer Vision · Industrial AI**

[![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![CCNA](https://img.shields.io/badge/CCNA-Routing%20%26%20Switching-005BBB?style=for-the-badge&logo=cisco&logoColor=white)](https://www.cisco.com/)
[![Computer Vision](https://img.shields.io/badge/Computer%20Vision-YOLOv8-6FBEFF?style=for-the-badge&logo=opencv&logoColor=white)](https://github.com/ultralytics/ultralytics)
[![Networking](https://img.shields.io/badge/Networking-GNS3%20%7C%20EVE--NG-00C7B7?style=for-the-badge&logo=cisco&logoColor=white)](https://www.gns3.com/)
[![AI Automation](https://img.shields.io/badge/AI%20Automation-Agentic%20AI-9CF?style=for-the-badge&logo=openai&logoColor=white)](https://l3al3y.github.io/Portfolio/)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare%20Workers-F38020?style=for-the-badge&logo=cloudflare&logoColor=white)](https://workers.cloudflare.com/)

[![Live Site](https://img.shields.io/badge/🌐%20Live%20Site-l3al3y.github.io%2FPortfolio-58A6FF?style=flat-square)](https://l3al3y.github.io/Portfolio/)
[![Open to Work](https://img.shields.io/badge/✅%20Open%20to%20Work-Available-2EA043?style=flat-square)](https://l3al3y.github.io/Portfolio/)

---

## Quick Links

- 🔗 **Live site:** [l3al3y.github.io/Portfolio](https://l3al3y.github.io/Portfolio/)
- 📄 **Resume:** [`resume/resume.pdf`](resume/resume.pdf)
- 🏅 **Certificates:** 18 verified records — [`certificates/registry.json`](certificates/registry.json)

## Run locally

```bash
python3 -m http.server 8000
```
or
```bash
npx serve .
```

## Architecture

A **fast, zero-cost, serverless** architecture — the frontend is served as static files
on GitHub Pages (no server to run, no hosting bill), while all interactivity is handled
by a **Cloudflare Worker** backend.

- **Frontend (this repo):** instant-loading HTML/CSS/JS — Three.js animation, AI chat,
  contact form, dynamic backend health detection
- **Backend (separate repo):** Cloudflare Worker — `/api/health` + `/v1/chat/completions`
- **Resilience:** if the Worker is unreachable, the site falls back to a built-in offline
  Q&A engine so the portfolio assistant still works

---

**Autonomy without security is disaster.**
