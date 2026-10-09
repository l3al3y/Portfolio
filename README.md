# Irfan Fahmi — Personal Portfolio

A working portfolio for AI and computer engineering projects. The presentation puts Irfan and his work first, with real project images, dark/light themes, and the existing static HTML/CSS/JavaScript stack.

## Local preview

Requires Node.js 24 or newer. No dependency installation or build step is needed.

```sh
npm start
```

Open **http://127.0.0.1:8000**. The server binds to localhost. Deployment uses the existing GitHub Pages workflow.

```sh
npm test
```

## Preserved functionality

- Infinite hero marquee with a pause control, global motion preference, and system reduced-motion support.
- Hero BEM/MBOT application trackers: Registered → Submitted → Pending Certificate. Certificates remain pending.
- Desktop shows the full portfolio with top navigation. At 768px and below, the floating dock switches separate Home, Projects, Skills & Experience, Certs and AI Chat destinations. Mobile also has an accessible navigation sheet for contact, résumé and other links.
- Five sourced case studies, project filters, manual hero tabs, original demos, telemetry and external links.
- Existing 26-document certificate registry with search, category filters, filter reset, incremental reveal and genuine PDF-derived previews.
- Streaming assistant, stop/retry/clear/copy controls and useful unavailable-service states.
- Cloudflare contact verification and résumé entry points, followed by the original résumé PDF preview.
- Original privacy/terms content, gesture controller and extension.

## Structure

| File | Purpose |
| --- | --- |
| `index.html` | Semantic page, hero marquee/registrations, navigation and dialogs |
| `lab/content.js` | Source-backed case studies, approach and assistant facts |
| `lab/portfolio.css`, `lab/design.css`, `lab/fonts.css` | Shared presentation, revised device compositions, dark/light tokens and local fonts |
| `lab/hero.js` | Visitor-controlled project showcase and keyboard tabs |
| `lab/portfolio-motion.js` | Marquee pause, reduced motion and decorative transitions |
| `lab/navigation.js` | Mobile screen routing, anchor aliases/history, desktop section navigation, accessible menu and keyboard clearance |
| `lab/main.js` | Project filters, case studies, credentials and document previews |
| `lab/integrations.js` | Existing gateway payloads, SSE parser, health and contact contracts |
| `lab/assistant.js`, `lab/contact.js` | Conversation and verification interfaces |
| `lab/project-art.js` | Clearly labelled illustrations for checkout and livestock |
| `certificates/registry.json` | Canonical credential records |
| `assets/documents/` | Previews rendered from actual PDFs |
| `manga.html`, `controller.js`, `assets/manga/` | Original gesture demo and extension |
| `privacy.html`, `terms.html` | Existing legal content |

Legacy `app.js` and `style.css` remain for demo compatibility. The original Systems Lab prototype modules are inactive on the main page. Fonts are self-hosted with OFL licenses. No new runtime framework or third-party generation service is required.

The revised hero restores the personal MIF.dev identity. Desktop pairs the introduction with a candidate summary and compact original project media. Mobile puts the marquee and pending registration trackers before the candidate disclosure and media. Longer About/assistant details collapse on phones. Case studies and documents use full-height phone dialogs; the assistant composer stays visible above the dock on the tested 390 × 844 viewport.

## Evidence and integrations

[REMAKE_NOTES.md](REMAKE_NOTES.md) records the live-site and authenticated frontend/private-backend inspection, required hero preservation, and actual Worker contracts. [SOURCE_NOTES.md](SOURCE_NOTES.md) records the project and document evidence. [DESIGN_V2_VERIFICATION.md](DESIGN_V2_VERIFICATION.md) records the approved revision's checks and limits; [VERIFICATION.md](VERIFICATION.md) preserves the earlier implementation checks.

The existing Worker endpoints and request formats are unchanged. Provider secrets and protected contacts remain server-side; the Turnstile site key is intentionally public. The page keeps conversation history in memory and sends relevant context to the existing gateway when asked. Upstream retention is not fully audited, and no new retention promise is made.

The GitHub Pages deployment workflow now runs the Node tests before upload/deployment. It still deploys on a push to main. The existing `_headers` file is specific to Cloudflare Pages and does not configure GitHub Pages. Credential fetches request revalidation; the optional Pages document rules also revalidate mutable URLs.

## Document maintenance

After replacing a registry PDF or résumé, regenerate its previews:

```sh
python scripts/generate_previews.py
```

This optional script requires pypdfium2 and Pillow. Neither is a website runtime dependency.

## Approved release

The revised desktop/mobile design was approved on 6 October 2026 for publication to GitHub. The release is based on `efba5e09f4118487a153d463f7134f03f3d11582`; revert the release commit to restore that version while preserving history. The backend integration contracts remain unchanged. Deployment success must be checked in GitHub Actions after publication; local test results alone do not establish that the live site has updated.

## Public repository boundary

This repository contains the portfolio frontend and its intentionally published project/document assets. Keep provider credentials, contact/account records, job-application databases, phone diagnostics, signing keys and local build artifacts outside it. `.gitignore` helps prevent accidental staging; it does not sanitize existing Git history or release assets.

SMC development and build records belong in the private `l3al3y/smc-crows-source` repository. Its public site and current release files belong in `l3al3y/smc-crows-downloads`. Portfolio retains only a small recovery page and the legacy resource release URLs required by previously installed APKs. The current SMC release is available at https://irfanfahmi.com/smc/.

GitHub Pages publishes an explicit website staging directory rather than the entire checkout. Tests, development scripts, Markdown work notes and repository configuration are excluded from that artifact. Published certificate and résumé assets remain intentional public content.


## Credential protection

Keep provider keys in server-side environment variables or a local secret store, never in website JavaScript, APKs, public source ZIPs or Git commits. GitHub standard secret scanning and push protection are enabled. The repository-specific checker also recognizes Rootsys keys and inspects small ZIP members; it reports file locations and credential types without printing values. CI checks the committed tree and blocks deployment on findings.

For prevention before a local commit, install and enable the provided hook once per fresh clone:

`sh
python -m pip install pre-commit
python -m pre_commit install
`

You can also run python scripts/check_secrets.py --staged before committing. Hooks are opt-in for each clone. CI runs after a push and cannot undo an already exposed key. Revoke or rotate any published credential, even after history cleanup. Re-clone after the October 2026 sanitation; never merge or push the old contaminated history back into this repository. Preserve original local work separately.
