# Personal portfolio remake — 6 October 2026

## Scope and source checks

Reviewed the deployed irfanfahmi.com in the browser and the authenticated GitHub sources for both repositories. Frontend main is efba5e09f4118487a153d463f7134f03f3d11582. Backend main is c818bbceb37fbfc6f238ac7d00a49fd4ab6ba0a4. The frontend tree has no AGENTS.md. The private backend's AGENTS.md, PROJECT_MEMORY.md, Worker instructions, README and complete Worker source were read. No private backend source, protected contact detail or secret was copied into the frontend.

The remake changes the visible identity from Systems Lab to Irfan Fahmi / AI & Computer Engineering. It uses existing real images, manual featured-project tabs, a filterable project gallery and expanded case-study previews. Checkout and livestock illustrations are labelled as illustrations. Hermes captures are explicitly archived, not live telemetry.

## Required hero elements retained

- Infinite marquee: AI & LLM Agents, Computer Vision, Data Engineering. Two equal groups provide seamless repetition; the second is hidden from accessibility APIs. Visitors can pause the marquee or disable all decorative motion. Reduced motion shows a readable static group.
- Professional registration trackers remain inside the hero: BEM Graduate Engineer; MBOT Graduate Technologist, IT field. Registered → Submitted → Pending Certificate is preserved from the live page and frontend source. Both certificates remain pending. No approval, registration number, or issued certificate is invented. The assistant context includes the same qualification.

## Integration contracts checked against private Worker source

- Existing POST /v1/chat/completions accepts messages, stream, model, temperature and max_tokens; its response is an OpenAI-compatible stream or JSON fallback. The frontend's established gateway and payload are retained.
- Existing GET /health returns availability information. Availability must be confirmed by actual chat success, not a status badge alone.
- Existing POST / verifies turnstileToken (or token alias) using Cloudflare siteverify before returning email and phone from environment configuration. No browser fallback exposes protected contact details.
- Worker CORS allows the production portfolio domains and localhost/127.0.0.1 on ports 8000 and 3000.
- Dashboard authentication and data routes are not used or changed by this remake.
- Resume entry points run through the existing verification UI. After successful verification, the original PDF renders using the shared document preview. Verification state lasts only in this page's memory; the existing static PDF asset and hosting contract are unchanged.

Backend code and remote repository state are unchanged by this remake. Provider logging, upstream handling and retention are not comprehensively audited. The existing policies remain in place; their Hermes/Google scope does not establish a portfolio-chat retention promise.

## Content accuracy

Existing SOURCE_NOTES.md explains the document and project evidence. The contribution PR #167 was rechecked: open, merged=false, merged_at=null on 6 October 2026. A reported cross-validation score remains distinct from real-world performance. Degree completion is not inferred from the live page's graduate headline; supplied dates/documents do not establish completion. BEM/MBOT application progress does not supply that missing evidence.

No generated demo footage, testimonial, metric, portrait or certificate was added. The photograph in the hero is an existing gesture training image from the original repository, and is labelled accordingly.

## Review boundary

This is local implementation work. Do not push, merge or deploy without the user's explicit request. The earlier backend README commits were separate, explicitly authorized documentation updates; they do not authorize publishing this frontend.
