# Portfolio atmosphere

The live background combines a silent Remotion ambient film with a vector network driven by the actual Hyperframes `createGSAPFrameAdapter`. The adapter seeks a paused GSAP timeline at 24 fps on a 16-second loop. It is not a hosted Hyperframes service or a globally installed MCP connector.

- `ambient.jsx`: periodic Remotion composition, 960 × 600, 384 frames, 24 fps; first and final sampled frames join without a scene cut.
- `render-entry.jsx`: project-local MCP server and client using `InMemoryTransport`, tool `render_portfolio_atmosphere`, Remotion web renderer. Served through a loopback-only page with COOP/COEP; its authored render button saves the loop and poster through allowlisted POST routes.
- `network.js`: reusable SVG and paused timeline. The browser build aliases the core package to its official GSAP adapter module, excluding Node-only parsers and editor code.
- `background-entry.js`: production playback, persistent pause, tab visibility, reduced motion, Save-Data and unobtrusive pointer feedback. No runtime CDN, analytics, camera or pointer tracking service.
- `index.html` and `hyperframes-entry.js`: standalone Hyperframes composition using that same timeline, with framework-owned video playback. Build before previewing with the Hyperframes CLI. The live website uses the adapter directly, rather than shipping the editor/renderer.
- `motion-check.html`: local browser test harness for initial and changing reduced-motion preferences and Save-Data. Not in the public website artifact.

Install the pinned packages in this folder, then run `npm run build:background`, `npm run build:render`, and optionally `npm run build:hyperframes`. A lockfile records transitive dependencies. Rendering dependencies and source are excluded by the explicit public staging script. The production files are `lab/background.js`, `lab/atmosphere.css`, and the two `assets/portfolio-atmosphere.*` files.

The film is 225,774 bytes; poster 16,625 bytes. The motion module is about 76 kB uncompressed. The background never intercepts clicks, and its decorative markup is excluded from accessibility navigation. Reduced motion and Save-Data prevent loading the video. A saved pause is honored on every portfolio route.

Dependencies: Hyperframes core 0.8.180 (Apache-2.0); GSAP 3.15.0 (GSAP standard license); Remotion 4.0.536 (Remotion license); React 19.3.1 (MIT); MCP SDK 1.32.1 (MIT). No paid API or hosted rendering service was used. Check the respective licenses when reusing these dependencies for another organization.

References: https://hyperframes.app/docs/5-packages/1-core, https://github.com/heygen-com/hyperframes, https://www.remotion.dev/docs/web-renderer/render-media-on-web.
