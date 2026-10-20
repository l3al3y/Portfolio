# Irfan Fahmi — Portfolio

Personal portfolio for AI, software and embedded systems roles, published at https://irfanfahmi.com/.

The October 2026 redesign uses a compact dark/light layout inspired by the SMC portal. Six project accordions start collapsed, with standalone case-study pages and legacy hash dialogs and source links. The homepage highlights availability, relevant skills, résumé and contact links. Related Projects, Experience, Credentials and Contact pages share the same design.

## Preview and checks

Requires Node.js 24+. No runtime packages. Generate static case pages with `node scripts/build-project-pages.mjs` when project content changes.

```sh
npm start
node scripts/build-project-pages.mjs
npm test
python scripts/check_secrets.py
python -m unittest discover -s tests -p test_secret_guard.py
python scripts/stage_site.py
```

The preview serves http://127.0.0.1:8000. `stage_site.py` requires a fresh output directory and stages the website's explicit public allowlist. The existing GitHub Pages workflow tests, stages and deploys on pushes to main.

## Source

- `index.html`, `projects/`, `about/`, `credentials/`, `contact/`: pages.
- `lab/hiring.css`: responsive presentation and light/dark themes; local fonts remain in `lab/fonts.css`.
- `lab/main.js`: collapsed projects, case-study dialogs, document viewer, credential filters and theme toggle.
- `lab/smc-live.js`: current SMC counters from `/smc/api/apk-stat`, refreshed every minute only while visible, with manual refresh and explicit unavailable/stale states.
- `lab/project-view.js`, `scripts/build-project-pages.mjs`: shared project renderer and generation of all six initial HTML rows and `/projects/{id}/` routes. Visible counts follow the active filter.
- `404.html`: recovery navigation for unknown URLs.
- `lab/content.js`: source-backed project narratives and assistant context.
- `lab/assistant.js`, `lab/contact.js`, `lab/integrations.js`: original assistant and Cloudflare verified-contact contracts.
- `certificates/registry.json`: 26 credential documents, with original PDF previews in `assets/documents/`.
- `assets/irfan-employer-pitch-v3.mp4`, `assets/employer-pitch-v3-poster.jpg`: narrated 72-second, 1280 × 720, 30 fps Remotion introduction with animated clicks and SMC evidence. The original silent film remains available at its existing URL.
- `assets/checkout-architecture.svg`: clearly labelled architecture illustration, not a live screenshot.

The Remotion source and MCP renderer are delivered separately from the static website; visitors do not need Remotion, React or MCP. Video controls are visitor-operated and the video does not autoplay. Narration uses open-source Kokoro-82M with the stock am_michael voice (Apache-2.0); attribution, transcript, captions and metrics sources are public assets. Speech is synthesized locally, not a recording or clone of Irfan. The video contains a dated snapshot; live figures are fetched separately beside it. The legacy motion and navigation modules remain for compatibility and their existing tests.

## Evidence and integrations

Reported model benchmarks are labelled with their evaluation context. SMC compatibility and performance evidence lives in the current release portal; the portfolio avoids global device-support or uptime guarantees. BEM Graduate Engineer registration in Computer Engineering was approved on 15 October 2026; the portfolio links to the official BEM public directory for verification. The certificate is not published. MBOT remains an application with its certificate pending. Cisco Networking Academy documents are course completions. Degree completion has not been newly confirmed.

Résumé and public email/LinkedIn links are available directly. Additional contact details retain Cloudflare verification. The assistant is optional, sends questions to the existing gateway on request, and keeps frontend history in memory. No backend keys are included.

Original demos, extension, telemetry, arcade, PDFs and legal pages remain available. The existing source/evidence notes are retained as historical records of earlier versions.

## Public repository boundary

Publish only intentional frontend and document assets. Keep provider credentials, private contact/account records, application databases, phone diagnostics, signing keys and build artifacts out of the repository. Run the credential guard before publication. Standard secret scanning and push protection are additional checks, not a substitute for reviewing public files.

SMC private development belongs in `l3al3y/smc-crows-source`; current public SMC releases belong in `l3al3y/smc-crows-downloads`. This redesign does not alter SMC APKs or release resources.
