# Portfolio assistant backend

Production Worker: `irfan-portfolio-chat.cabalme4.workers.dev`.

`ROOTSYS_API_KEY` is an encrypted production Worker secret, configured through Cloudflare's Variables and Secrets UI. Never place its value in source, a public environment file, HTML, browser JavaScript, a ZIP, a screenshot or this README. The browser sends only conversation messages to the Worker; it never authenticates to Roots directly.

The Worker fixes the Roots endpoint, `deepseek-v4.1-flash` model, 1,024 output-token limit and public portfolio context on the server. Client system roles and oversized/invalid histories are rejected. It exposes only sanitized answer content, never provider reasoning, IDs or raw error bodies. A 45-second upstream deadline and explicit stream cancellation limit abandoned requests.

CORS allows the production portfolio origins. In-memory throttling allows six questions per minute per connecting IP and thirty per minute per isolate. This is best-effort abuse reduction, not a durable global spending cap; Worker isolates and locations do not share these counters. The optional `CHAT_RATE_LIMITER` binding can add Cloudflare's native limiter if configured separately. No database or transcript store is used. The host may retain invocation metadata under its platform settings; request contents are never logged by this application.

Rebuild public facts with `node scripts/build-chat-worker.mjs` when project or registration facts change. Bundle `server/portfolio-chat/worker.js` as an ES module with esbuild and deploy the bundled file to this Worker. Verify copied editor source against the tested bundle before publishing. Preserve the existing encrypted secret when deploying code. Source and generated knowledge live outside the folders copied by `scripts/stage_site.py`.

`/health` reports whether the secret is configured; it does not claim to verify upstream model availability. Verify an actual streamed answer after deployment. Unit tests cover origin rejection, system-role injection, body limits, server-owned model settings, credential-error sanitization, stream filtering, burst limiting and safe answer links.

Frontend: `lab/assistant.js`, `lab/chat-render.js`, `lab/integrations.js`, `lab/chat.css`. `/ask/` is a real static entry path, and the homepage includes the same assistant. The local preview server proxies only the two fixed chat paths; it does not receive or need the provider key. Browser history stays in page memory and is cleared by New chat or page departure.
