# Verification — 6 October 2026

The preview serves the implemented personal portfolio and uses the existing production gateway. There are no mock assistant answers or contact fallbacks.

## Sources and preserved behaviour

- Read the live irfanfahmi.com site and both repositories through the authenticated GitHub connection, including the private backend root instructions, project memory, worker instructions, README, and worker implementation.
- Frontend source: main at efba5e09f4118487a153d463f7134f03f3d11582. Backend source: main at c818bbceb37fbfc6f238ac7d00a49fd4ab6ba0a4.
- The infinite marquee remains inside the hero, with an explicit pause/resume control. BEM Graduate Engineer and MBOT Graduate Technologist (IT field) trackers also remain inside the hero: Registered → Submitted → Pending Certificate. These are application-progress statements, not proof of issued certificates.
- Confirmed existing chat, health, contact-token and CORS contracts against the worker source. No backend code, configuration, authentication or secrets changed for this remake.
- Rechecked Hermes contribution PR #167: open and not merged. Project scores are labelled as reported model evaluation or cross-validation, rather than field performance. Source conflicts and incomplete education evidence are recorded in SOURCE_NOTES.md.

## Completed checks

- Automated: 14 Node tests pass; JavaScript syntax checks and git diff --check pass. Coverage includes split UTF-8/CRLF SSE, completion markers, final-event flush, empty/malformed/error responses, abort, original chat payload and JSON fallback, HTTP errors, contact validation, health distinctions, registry/PDF integrity, real rendered previews and reduced-motion/manual marquee behaviour. One retained test covers the inactive earlier layer prototype.
- Desktop: 1280×900, dark and light themes. Navigation, hero story tabs (including arrow/Home/End keyboard controls), all five project filters and case studies, copy-link control and direct case-study reload checked. Both registration cards remain within the hero. Marquee resume restarts while its button has focus. Motion preferences and pause state survive toggles.
- Mobile: 390×844 and 360×800. No horizontal page overflow. Menu opens/closes and section links work; project/dialog content, gesture hero, marquee and stacked professional trackers fit. Dark and light layouts and a real award document preview checked. System reduced motion is verified by module tests.
- Credentials: the 26-record existing registry is retained. Cisco search returns four records, award category five, INOTEK search one; empty search results are explicit. Incremental reveal and PDF preview, zoom/fit, Escape close, original PDF links checked. All 26 registry PDFs and the résumé have real rendered preview assets, loaded on demand. Controls are disabled until the lazy-loaded registry is available, with retry and empty-registry states.
- Assistant: the actual gateway streamed a complete checkout response. A second question correctly described both registration certificates as pending. Copy, Stop, Retry, Clear and health controls checked. Failure paths are covered by deterministic tests. Browser conversation history stays in page memory; upstream retention remains unverified.
- Contact and résumé: automatic Turnstile verification and the actual gateway succeeded. Valid email and WhatsApp actions appeared only after verification. The verified résumé opened its real PDF-derived preview. Hero, About, Contact and case-study résumé entry points use the same verification integration. No CAPTCHA was manually solved or bypassed.
- Links and policy pages: local asset/document integrity is checked; original legal pages, gesture demo, extension archive, project sources, résumé and external destinations are retained. Telemetry and Mini Arcade live pages were read during research. The legal pages use the matching themes.

## Remaining limits

### Mobile navigation and infrastructure follow-up

- Desktop retains top navigation and a two-column hero/project presentation. Mobile uses the original five-destination floating dock, compact paired hero actions, stacked cards and a native menu sheet. Tested at 360×800 and 390×844 in light/dark themes. Dock controls are at least 54 pixels high, show the active section, reserve bottom space and hide while editing an input. Menu links, Escape, resize-to-desktop cleanup and verified résumé access passed. Desktop hides the dock. CSS safe-area support is present; hardware iPhone/Android keyboard behaviour remains unverified.
- Corrected a percentage-height issue that could clip featured project descriptions on mobile. All five cards and single-project filtered cards now fit their complete content.
- Re-ran 14 frontend tests and added assertions for contact 429/503 errors. Syntax and diff checks pass. Deployment now runs the frontend tests before upload.
- Live DNS, TLS, redirects, cache/permission headers, CORS, health and missing-contact-token rejection checked. The main site is proxied through Cloudflare; the recorded deployment remains GitHub Pages. Mini Arcade contains Lovable-generated metadata, so an unverified current Cloudflare Pages hosting claim was removed.
- Seven direct checks against the current worker source pass with test-only configuration. The full original worker Vitest suite could not start because the Windows sandbox denied its native esbuild process; this is not an assertion failure or a passing suite.
- Cloudflare/Lovable account dashboards, billing, secret values and full provider failover were not inspected. Separate infrastructure evidence and existing backend hardening findings are saved outside the publishable frontend folder in outputs/INTEGRATION_AUDIT.md.

No hardware-phone, camera-recognition, full screen-reader or performance benchmark audit was performed. Backend source inspection confirms the integration contract, but does not establish full upstream privacy/retention behaviour. External services and automatic challenge results can change by browser and hostname.

The résumé still uses October 2022–Present for the bachelor programme; no bachelor award document was supplied. Cisco documents evidence Networking Academy course completions, not a professional CCNA exam credential. Confirm/reconcile these source details before changing the public wording or publishing.

All frontend changes remain local and uncommitted on redesign/systems-lab. No frontend push, merge or deployment was performed. The branch name is historical; the active page is the personal portfolio remake.
