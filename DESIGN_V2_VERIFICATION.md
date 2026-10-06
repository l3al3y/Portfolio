# Revised personal portfolio — verification

6 October 2026. This revision builds on the existing uncommitted implementation. It retains the verified content, document assets, static stack, original demos, gateway contracts, contact module and policies. No commit, push, merge, deployment or remote configuration update was performed.

## What changed

- Personal MIF.dev identity, graphite/cyan presentation and independently styled light theme.
- Clearer name/role; desktop candidate summary plus compact genuine project media. The gesture training image no longer dominates the hero.
- Mobile hero ordering: availability, infinite focus marquee, identity/headline, introduction/actions, registration trackers, candidate disclosure and optional media. BEM/MBOT certificates remain pending.
- Desktop retains one document; mobile at <=768px uses five dock destinations. Only the selected destination's sections participate in layout and keyboard reading order. Home also contains approach and contact. Original skills/experience/chat aliases remain usable.
- Phone project list, compact capability/credential presentation, full-height case/document dialogs and a dedicated assistant layout. About and assistant/privacy details are collapsible on mobile and expanded on desktop.
- Credential reset and loading guard. Original filters/search, incremental reveal and document previews remain intact.
- Case links now have history entries. Closing waits for back navigation before releasing the modal, preventing a quick underlying click from racing history traversal. Direct links close to Projects. Native Escape follows the same path.
- Health checks cannot overwrite a running chat's status or re-enable its connection control prematurely.

## Automated checks

All 14 existing tests passed after the final logic change. They cover the 26 actual PDF records, all 27 document preview manifests (including résumé), five substantial sourced cases and local destinations, SSE framing/UTF-8/abort, JSON fallback, rate/service errors, contact token contract, health and reduced-motion behavior. One test covers the inactive original layer controller; it is not evidence for the new navigation. The navigation and revised visual compositions were checked in the browser.

Syntax checks passed for the changed main, navigation, hero and assistant modules. git diff --check passed; Git emitted only an existing README line-ending normalization warning.

## Browser checks

- Widths 360, 390, 768, 769, 1024 and 1440: no horizontal document overflow in the observed states. At <=768, the dock is present and inactive destination sections are hidden. At >=769, all seven sections and top navigation are present, with the dock hidden. Candidate details expand/collapse with the mode change.
- All five mobile destinations opened. Skills & Experience has its own phone heading and density. Candidate disclosure and hero tabs work; End/Home keyboard navigation selected Arcade/Hermes correctly.
- Project gallery contains five cards with copy inside their bounds on desktop and mobile. The Play filter reduced it to one case; the filtered case opened and closed correctly. Shared/direct Hermes URLs, browser Back, Escape and rapid close-then-Home were checked.
- Credential search for Cisco returned four; a conflicting academic category produced an empty state; Reset restored 26. Incremental reveal showed all 26. The Cisco Enterprise Networking preview rendered from the original PDF. Zoom/Fit, original PDF link and close controls were present and functional.
- Menu Escape closed the sheet and aria-expanded returned to false. Focus is moved to a destination heading when appropriate; dialogs use native modal behavior and their close buttons remain reachable.
- Dark/light theme controls worked. Marquee pause held its animation; Motion off removed the animation; returning Motion on preserved the manual pause until resumed. Reduced-motion precedence is covered by the active motion tests.
- A live gateway health check returned reachability information. A live question about technical capabilities completed, with coursework/degree/registration/benchmark qualifications preserved in the response.
- Résumé entry point completed the existing automatic Cloudflare verification and opened the original PDF preview. A later independent contact attempt remained on the challenge screen before it was closed. Contact reveal success was not reverified in that attempt. No challenge was manually solved or bypassed, no fallback contact details were introduced, and no protected contact values were saved into screenshots/reports.
- Captured browser error entries were empty in the inspected session after these checks.

## Limits

These are in-app browser viewport checks, not tests on physical phones or all browsers. Actual virtual-keyboard behavior, camera input for the gesture demo, 200% browser zoom and cross-browser behavior were not comprehensively reverified in this revision. Existing local demo links and all source documents resolve in the automated content checks; external hosting/account configuration remains subject to the earlier integration audit.

The contact challenge may need visitor interaction. Static résumé/certificate PDF URLs remain public as in the original hosting contract; the résumé UI verification does not create file-level authentication. Upstream provider behavior/retention and live infrastructure configuration were not changed or comprehensively audited here. SOURCE_NOTES.md and the earlier integration audit retain their content/evidence limitations.

Preview: http://127.0.0.1:8000/#home
