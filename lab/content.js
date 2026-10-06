// Public facts checked against the original portfolio, résumé, project source, and registry.
export const projects = [
  {
    id: 'checkout', number: '01', title: 'Hybrid Self-Checkout', category: 'Computer vision · Capstone',
    summary: 'A second pair of eyes for the checkout counter. Barcode identity meets visual verification.',
    image: 'assets/thumb-yolov8.png', alt: 'Original Hybrid Self-Checkout project screenshot',
    stack: ['YOLOv8', 'OpenCV', 'Python', 'MySQL'],
    problem: 'A barcode alone cannot tell whether the item in front of the camera is the item being scanned. Missed scans and item switching create gaps in conventional self-checkout.',
    implementation: 'I built a hybrid validation pipeline that identifies local retail products with YOLOv8 and compares detections with USB barcode scanner input. Python and OpenCV handle the video stream; MySQL stores product and transaction data. Split-view experiments address occlusion by observing products from multiple angles.',
    constraints: 'Similar packaging, overlapping items, lighting changes, and missed detections make visual verification difficult. The model was trained on a custom dataset of Malaysian retail items, including bread, tissues, toothpaste, and Maggi. Raising recall remains an improvement target.',
    outcome: 'The project repository reports approximately 77.4% precision and 72.0% recall after 50 epochs. These are model evaluation figures, not a measured reduction in retail fraud. The portfolio and résumé disagree on inference latency, so no latency figure is presented here.',
    result: '77.4% precision', resultNote: 'Reported model benchmark · 50 epochs',
    links: [{label: 'Explore source', url: 'https://github.com/l3al3y/FYP-PROJECT'}],
    sources: [{label: 'Project README & architecture', url: 'https://github.com/l3al3y/FYP-PROJECT#readme'}]
  },
  {
    id: 'hermes', number: '02', title: 'Hermes', category: 'Agent systems · Edge infrastructure',
    summary: 'Many models. One decision pipeline. An experiment in consensus, failure, and recovery on a phone.',
    image: 'assets/thumb-hermes.png', alt: 'Original Hermes telemetry dashboard screenshot',
    stack: ['Python', 'Termux', 'LLM orchestration', 'Cloudflare'],
    problem: 'An autonomous system needs more than a model response: it needs a way to weigh disagreement, handle unavailable providers, and inspect decisions after they fail.',
    implementation: 'The documented Hermes setup runs on a Samsung Galaxy A54 using Termux/Linux. A “Parliament of Minds” routes multiple LLM models through a consensus process for XAUUSD signal experiments. Separate serve and gateway processes, a cron watchdog, telemetry, and causal post-mortems support operation and review.',
    constraints: 'Mobile hardware and external model availability constrain reliability. Consensus does not guarantee correctness. The original portfolio records a strategy refit pause from 22 September 2026; current operational status belongs to the telemetry console.',
    outcome: 'The result is a documented multi-model orchestration experiment with observable operations and recovery mechanisms. Historical trading figures on the previous site have not been independently verified and are not presented as evidence of real-world investment performance. The contribution to 500-AI-Agents-Projects is PR #167: open and unmerged when checked on 6 October 2026.',
    result: 'Consensus + recovery', resultNote: 'Experimental system · contribution submitted',
    links: [{label: 'Telemetry console', url: 'https://live.irfanfahmi.com'}, {label: 'View open PR #167', url: 'https://github.com/ashishpatel26/500-AI-Agents-Projects/pull/167'}],
    sources: [{label: 'Contribution and review status', url: 'https://github.com/ashishpatel26/500-AI-Agents-Projects/pull/167'}, {label: 'System telemetry', url: 'https://live.irfanfahmi.com'}]
  },
  {
    id: 'gesture', number: '03', title: 'Gesture recognition', category: 'Human interaction · Browser ML',
    summary: 'Read without touching the screen. Hand geometry becomes a quiet, practical interface.',
    image: 'assets/thumb-irfanllm.png', alt: 'Original IrfanLLM touchless reader interface',
    stack: ['MediaPipe Hands', 'Random Forest', 'JavaScript', 'Python'],
    problem: 'Reading manga or webtoons while eating makes a touchscreen an awkward interface. A touchless controller needs deliberate gestures without scrolling again on the return stroke.',
    implementation: 'IrfanLLM uses MediaPipe hand landmarks and 71-dimensional geometric features. A 100-tree Random Forest trained from video demonstrations is compiled to JavaScript for browser inference. Geometric checks, a 0.30-second scroll cooldown, and virtual air buttons translate gestures into navigation. The existing demo, bookmarklet, and extension remain available.',
    constraints: 'Camera permission, hand visibility, lighting, and browser support affect the experience. A classifier score does not include camera capture or landmark extraction latency. The demo requires explicit camera access and must be tested in the visitor’s environment.',
    outcome: 'The source portfolio reports 98.6% cross-validation accuracy. This is an evaluation on the training workflow’s folds, not a measured accuracy across all users or real-world reading sessions. The working browser controller offers a concrete way to explore that gap.',
    result: '98.6% cross-validation', resultNote: 'Reported score · not real-world accuracy',
    links: [{label: 'Try the reader demo', url: 'manga.html'}, {label: 'Download extension', url: 'assets/manga/irfanllm-manga-extension.zip'}],
    sources: [{label: 'Demo and implementation notes', url: 'manga.html'}, {label: 'Controller source', url: 'https://github.com/l3al3y/Portfolio/blob/main/controller.js'}]
  },
  {
    id: 'livestock', number: '04', title: 'IoT livestock monitoring', category: 'Embedded systems · Team project',
    summary: 'From a physical load to a useful reading. A connected weighing platform built around the sensor.',
    image: '', alt: '', stack: ['Arduino', 'HX711', 'Load cells', 'C/C++'],
    problem: 'Tracking livestock weight requires a repeatable way to turn physical measurements into readings that can be monitored over time.',
    implementation: 'The résumé documents an IoT load-cell weighing platform using Arduino microcontrollers, HX711 amplifiers, C/C++ signal filtering firmware, and real-time telemetry dashboards. I contributed to the weighing and monitoring system as part of the team named on the INOTEK certificate.',
    constraints: 'Calibration and signal stability matter as much as connectivity. The résumé reports a measurement precision claim but supplies no test protocol or reference weights; it is therefore omitted from the headline results.',
    outcome: 'The team received Third Place for “Development of Livestock Weight Tracking System Based on IoT” at INOTEK 2025 (Series 1), held on 15 January 2025. The certificate verifies the team award; it does not validate sensor accuracy or a production deployment.',
    result: 'INOTEK 2025 · Third Place', resultNote: 'Documented team award · 15 January 2025',
    links: [{label: 'View award document', url: 'certificates/INOTEK_2025_Third_Place.pdf', preview: true}],
    sources: [{label: 'INOTEK team achievement certificate', url: 'certificates/INOTEK_2025_Third_Place.pdf'}, {label: 'Existing résumé', url: 'resume/resume.pdf'}]
  },
  {
    id: 'arcade', number: '05', title: 'Mini Arcade', category: 'Interactive software · Web',
    summary: 'A small playground for decisions, timing, and memory. Short sessions, built for the browser.',
    image: 'assets/thumb-arcade.png', alt: 'Original Mini Arcade games interface',
    stack: ['React', 'TypeScript', 'Game logic', 'Tailwind CSS'],
    problem: 'A browser game needs clear feedback, responsive controls, and enough structure to make a short session feel complete.',
    implementation: 'The original portfolio documents a React and TypeScript arcade with minimax-based Tic Tac Toe, a soccer penalty shootout, and a sports memory match, styled with Tailwind CSS. The current live application lists Pulse Tic Tac Toe, Penalty Shootout, Sports Memory, and the beta Shinobi Legends RPG. Pulse adds rotating rows, decaying marks, and link-based online multiplayer.',
    constraints: 'Each game has different input and state rules, and the interface needs to work on touch and desktop screens. Hosting latency alone does not describe gameplay responsiveness, so the previous site’s latency claim is omitted.',
    outcome: 'The current application is available as a live demo, with three core games and one RPG marked beta/testing when checked on 6 October 2026. It explores decision-making alongside interface and game-state design. The current game internals were not audited, and no visitor or engagement metrics are claimed.',
    result: 'Three core games + a beta', resultNote: 'Live application checked · 6 October 2026',
    links: [{label: 'Launch Mini Arcade', url: 'https://arcade.irfanfahmi.com'}],
    sources: [{label: 'Existing application', url: 'https://arcade.irfanfahmi.com'}]
  }
];

export const layers = [
  { name: 'Sense', subtitle: 'Bring the outside in.', text: 'Cameras, barcode scanners, and load cells turn a physical event into data. Start with the signal—and the ways it can go wrong.', detail: 'Vision · Sensors · Input', color: 'cyan' },
  { name: 'Infer', subtitle: 'Find meaning in the signal.', text: 'Object detection, hand geometry, and language models interpret the input. Evaluation matters; a model score is only one part of the story.', detail: 'Models · Features · Evaluation', color: 'lime' },
  { name: 'Decide', subtitle: 'Make the next step explicit.', text: 'Cross-verification, model consensus, and minimax turn inference into a decision. Rules, uncertainty, and failure paths belong in the design.', detail: 'Verification · Consensus · Logic', color: 'cyan' },
  { name: 'Respond', subtitle: 'Close the loop.', text: 'A useful system acts through an interface, an alert, or a control. Telemetry and feedback make its behaviour inspectable and improvable.', detail: 'Interfaces · Actions · Feedback', color: 'lime' }
];

export const approach = [
  ['Build', 'Make the idea tangible. Connect the model, hardware, and interface early.'],
  ['Test', 'Measure behaviour against a clear question. Keep the test conditions visible.'],
  ['Break', 'Try occlusion, noisy inputs, unavailable services, and unexpected interactions.'],
  ['Understand', 'Trace the failure through the system. Find the cause before changing the parts.'],
  ['Improve', 'Refine the smallest useful thing, then test the whole loop again.']
];

export const professionalRegistrationContext = 'The public hero reports BEM Graduate Engineer and MBOT Graduate Technologist (IT field) application progress: Registered, Submitted, Pending Certificate. Both certificates are pending. Do not describe these applications as approved professional registrations or issued certificates.';

export const assistantContext = `You are the portfolio assistant for Irfan Fahmi. Use only the supplied portfolio facts. Be concise and distinguish reported benchmarks from verified outcomes. Do not invent dates, achievements, contact information or project details. Cisco credentials are Networking Academy course completions, not evidence of passing the CCNA professional exam. Education: Bachelor of Computer Engineering with Honours at UTeM, Oct 2022–Present according to existing résumé; completion date is not confirmed. Diploma in Electronic Engineering (Computer), Politeknik Port Dickson, Dec 2018–May 2022. Certificate in Computer Systems and Networking, Kolej Komuniti Selandar, Jul 2017–Feb 2019. Based in Klang Valley, Malaysia. Interests span hardware, software, networks and AI. Contact details require the site's Cloudflare verification. Refer visitors to Contact for direct access. Projects: ${JSON.stringify(projects.map(({title, problem, implementation, constraints, outcome}) => ({title, problem, implementation, constraints, outcome})))}`;
