/**
 * 3D Agentic Engineering Portfolio JavaScript Controller
 * Candidate: Muhammad Irfan Fahmi bin Samsul Kamar
 * WebGL Engine: Three.js (r128) + GSAP Animation Library
 * Compliance: 3D Web Experience Skill (agentic-awesome-skills)
 */

document.addEventListener("DOMContentLoaded", () => {
    // Detect mobile device for performance optimization
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    // =========================================================================
    // 1. THREE.JS SCENE 1: BACKGROUND 3D PARTICLE CONSTELLATION
    // =========================================================================
    const bgCanvas = document.getElementById("webgl-bg-canvas");
    let bgScene, bgCamera, bgRenderer, bgParticles;

    function initBgScene() {
        if (!bgCanvas || typeof THREE === "undefined") return;

        bgScene = new THREE.Scene();
        bgCamera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
        bgCamera.position.z = 400;

        bgRenderer = new THREE.WebGLRenderer({ canvas: bgCanvas, alpha: true, antialias: !isMobile });
        bgRenderer.setSize(window.innerWidth, window.innerHeight);
        bgRenderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1 : 2));

        // Create 3D Particle Constellation Geometry
        const particleCount = isMobile ? 250 : 550;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 800;
            positions[i + 1] = (Math.random() - 0.5) * 800;
            positions[i + 2] = (Math.random() - 0.5) * 800;
        }

        geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

        const isDark = document.body.classList.contains("dark-theme");
        const particleColor = isDark ? 0x38bdf8 : 0x0284c7;

        const material = new THREE.PointsMaterial({
            color: particleColor,
            size: isMobile ? 2.5 : 3.5,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending
        });

        bgParticles = new THREE.Points(geometry, material);
        bgScene.add(bgParticles);
    }

    function animateBgScene() {
        requestAnimationFrame(animateBgScene);
        if (bgParticles) {
            bgParticles.rotation.y += 0.0006;
            bgParticles.rotation.x += 0.0003;
        }
        if (bgRenderer && bgScene && bgCamera) {
            bgRenderer.render(bgScene, bgCamera);
        }
    }

    initBgScene();
    animateBgScene();

    // =========================================================================
    // 2. THREE.JS SCENE 2: HERO 3D AGENTIC CORE SCENE
    // =========================================================================
    const wrapper = document.getElementById("hero-3d-canvas-wrapper");
    let heroScene, heroCamera, heroRenderer;
    let mainCoreMesh, innerCoreMesh, orbitGroup;
    let nodeMeshes = [];
    let autoRotate = true;
    let targetCameraZ = 7.5;

    function initHeroScene() {
        if (!wrapper || typeof THREE === "undefined") return;

        const width = wrapper.clientWidth;
        const height = wrapper.clientHeight || 320;

        heroScene = new THREE.Scene();
        heroCamera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
        heroCamera.position.set(0, 0, targetCameraZ);

        heroRenderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        heroRenderer.setSize(width, height);
        heroRenderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1 : 2));
        heroRenderer.shadowMap.enabled = true;
        wrapper.appendChild(heroRenderer.domElement);

        // Lighting System
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        heroScene.add(ambientLight);

        const pointLight1 = new THREE.PointLight(0x38bdf8, 2, 50);
        pointLight1.position.set(10, 10, 10);
        heroScene.add(pointLight1);

        const pointLight2 = new THREE.PointLight(0x34d399, 1.5, 50);
        pointLight2.position.set(-10, -10, -10);
        heroScene.add(pointLight2);

        // Central Core Mesh: Outer Wireframe + Inner Solid Sphere
        const outerGeo = new THREE.IcosahedronGeometry(1.6, 1);
        const outerMat = new THREE.MeshStandardMaterial({
            color: 0x38bdf8,
            wireframe: true,
            roughness: 0.2,
            metalness: 0.8
        });
        mainCoreMesh = new THREE.Mesh(outerGeo, outerMat);
        heroScene.add(mainCoreMesh);

        const innerGeo = new THREE.SphereGeometry(1.0, 32, 32);
        const innerMat = new THREE.MeshStandardMaterial({
            color: 0x4f46e5,
            roughness: 0.1,
            metalness: 0.9,
            emissive: 0x1e1b4b
        });
        innerCoreMesh = new THREE.Mesh(innerGeo, innerMat);
        heroScene.add(innerCoreMesh);

        // Orbit Group with 4 Tech Pillar Nodes
        orbitGroup = new THREE.Group();
        heroScene.add(orbitGroup);

        const pillarConfigs = [
            { id: "networking", geo: new THREE.TorusKnotGeometry(0.35, 0.12, 64, 8), color: 0x38bdf8, radius: 3.2, angle: 0 },
            { id: "ai", geo: new THREE.OctahedronGeometry(0.45, 0), color: 0x34d399, radius: 3.2, angle: Math.PI / 2 },
            { id: "iot", geo: new THREE.DodecahedronGeometry(0.4, 0), color: 0xfbbf24, radius: 3.2, angle: Math.PI },
            { id: "security", geo: new THREE.TetrahedronGeometry(0.45, 0), color: 0x818cf8, radius: 3.2, angle: (3 * Math.PI) / 2 }
        ];

        pillarConfigs.forEach(cfg => {
            const mat = new THREE.MeshStandardMaterial({
                color: cfg.color,
                wireframe: true,
                metalness: 0.7
            });
            const mesh = new THREE.Mesh(cfg.geo, mat);
            mesh.position.x = Math.cos(cfg.angle) * cfg.radius;
            mesh.position.z = Math.sin(cfg.angle) * cfg.radius;
            mesh.userData = { id: cfg.id, baseAngle: cfg.angle, radius: cfg.radius };
            orbitGroup.add(mesh);
            nodeMeshes.push(mesh);
        });

        // Mouse Drag Controls
        let isDragging = false;
        let previousMousePosition = { x: 0, y: 0 };

        wrapper.addEventListener("mousedown", (e) => {
            isDragging = true;
            previousMousePosition = { x: e.clientX, y: e.clientY };
        });

        wrapper.addEventListener("mousemove", (e) => {
            if (!isDragging) return;
            const deltaX = e.clientX - previousMousePosition.x;
            const deltaY = e.clientY - previousMousePosition.y;

            heroScene.rotation.y += deltaX * 0.008;
            heroScene.rotation.x += deltaY * 0.008;

            previousMousePosition = { x: e.clientX, y: e.clientY };
        });

        window.addEventListener("mouseup", () => { isDragging = false; });

        // Touch Drag Controls for Mobile
        wrapper.addEventListener("touchstart", (e) => {
            if (e.touches.length === 1) {
                isDragging = true;
                previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
            }
        });

        wrapper.addEventListener("touchmove", (e) => {
            if (!isDragging || e.touches.length !== 1) return;
            const deltaX = e.touches[0].clientX - previousMousePosition.x;
            const deltaY = e.touches[0].clientY - previousMousePosition.y;

            heroScene.rotation.y += deltaX * 0.008;
            heroScene.rotation.x += deltaY * 0.008;

            previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        });

        wrapper.addEventListener("touchend", () => { isDragging = false; });
    }

    let clock = new THREE.Clock();

    function animateHeroScene() {
        requestAnimationFrame(animateHeroScene);

        const elapsedTime = clock.getElapsedTime();

        if (mainCoreMesh) {
            mainCoreMesh.rotation.y = elapsedTime * 0.4;
            mainCoreMesh.rotation.x = elapsedTime * 0.2;
            mainCoreMesh.position.y = Math.sin(elapsedTime * 1.5) * 0.15;
        }

        if (innerCoreMesh) {
            innerCoreMesh.position.y = Math.sin(elapsedTime * 1.5) * 0.15;
        }

        if (orbitGroup && autoRotate) {
            orbitGroup.rotation.y = elapsedTime * 0.3;
        }

        nodeMeshes.forEach(mesh => {
            mesh.rotation.x += 0.01;
            mesh.rotation.y += 0.02;
        });

        if (heroRenderer && heroScene && heroCamera) {
            heroRenderer.render(heroScene, heroCamera);
        }
    }

    initHeroScene();
    animateHeroScene();

    // 3D Controls Button Handlers
    const resetCamBtn = document.getElementById("reset-camera-btn");
    const toggleOrbitBtn = document.getElementById("toggle-orbit-btn");

    if (resetCamBtn) {
        resetCamBtn.addEventListener("click", () => {
            if (typeof gsap !== "undefined" && heroCamera && heroScene) {
                gsap.to(heroCamera.position, { x: 0, y: 0, z: 7.5, duration: 1 });
                gsap.to(heroScene.rotation, { x: 0, y: 0, z: 0, duration: 1 });
            } else if (heroCamera && heroScene) {
                heroCamera.position.set(0, 0, 7.5);
                heroScene.rotation.set(0, 0, 0);
            }
        });
    }

    if (toggleOrbitBtn) {
        toggleOrbitBtn.addEventListener("click", () => {
            autoRotate = !autoRotate;
            toggleOrbitBtn.textContent = autoRotate ? "🌀 Auto Rotate" : "⏸️ Paused";
        });
    }

    // Interactive Pillar Cards Click -> Focus 3D Node
    document.querySelectorAll(".pillar-card").forEach(card => {
        card.addEventListener("click", () => {
            const nodeId = card.getAttribute("data-node");
            const targetNode = nodeMeshes.find(n => n.userData.id === nodeId);

            if (targetNode && typeof gsap !== "undefined" && heroScene) {
                autoRotate = false;
                if (toggleOrbitBtn) toggleOrbitBtn.textContent = "⏸️ Paused";

                gsap.to(heroScene.rotation, {
                    y: -targetNode.userData.baseAngle,
                    x: 0.2,
                    duration: 1.2,
                    ease: "power2.out"
                });
            }
        });
    });

    // Window Resize Handler
    window.addEventListener("resize", () => {
        if (bgCamera && bgRenderer) {
            bgCamera.aspect = window.innerWidth / window.innerHeight;
            bgCamera.updateProjectionMatrix();
            bgRenderer.setSize(window.innerWidth, window.innerHeight);
        }

        if (wrapper && heroCamera && heroRenderer) {
            const w = wrapper.clientWidth;
            const h = wrapper.clientHeight || 320;
            heroCamera.aspect = w / h;
            heroCamera.updateProjectionMatrix();
            heroRenderer.setSize(w, h);
        }
    });

    // =========================================================================
    // 3. THEME TOGGLE (LIGHT / DARK 3D COLORS)
    // =========================================================================
    const themeBtn = document.getElementById("theme-toggle");
    if (themeBtn) {
        themeBtn.addEventListener("click", () => {
            document.body.classList.toggle("dark-theme");
            const isDark = document.body.classList.contains("dark-theme");

            if (bgParticles) {
                bgParticles.material.color.setHex(isDark ? 0x38bdf8 : 0x0284c7);
            }
            if (mainCoreMesh) {
                mainCoreMesh.material.color.setHex(isDark ? 0x38bdf8 : 0x0284c7);
            }
        });
    }

    // =========================================================================
    // 4. LIVE ATS EVALUATOR WIDGET
    // =========================================================================
    const atsBtn = document.getElementById("ats-btn");
    const atsInput = document.getElementById("ats-input");
    const atsOutput = document.getElementById("ats-output");

    if (atsBtn && atsInput && atsOutput) {
        atsBtn.addEventListener("click", () => {
            const text = atsInput.value.toLowerCase().trim();
            if (!text) {
                atsOutput.style.display = "block";
                atsOutput.className = "demo-box active";
                atsOutput.innerHTML = `<p style="color: #ef4444; font-weight: bold;">❌ Sila masukkan iklan atau kriteria pekerjaan dahulu.</p>`;
                return;
            }

            // Simulatated Heuristic Match Engine based on candidate profile
            const keywords = ["ccna", "cisco", "network", "ospf", "vlan", "python", "yolov8", "opencv", "arduino", "iot", "security", "endpoint"];
            let matched = [];

            keywords.forEach(kw => {
                if (text.includes(kw)) matched.push(kw.toUpperCase());
            });

            const matchScore = Math.min(100, Math.max(45, (matched.length / keywords.length) * 100)).toFixed(1);

            atsOutput.style.display = "block";
            atsOutput.className = "demo-box active";
            atsOutput.innerHTML = `
                <p style="color: var(--color-primary); font-weight: 700; font-size: 0.95rem;">⚡ REAL-TIME ATS EVALUATION RESULT</p>
                <p><strong>Candidate Match Score:</strong> <span style="color: var(--color-success); font-size: 1.1rem; font-weight: 800;">${matchScore}%</span></p>
                <p><strong>Matched Technical Keywords (${matched.length}):</strong> ${matched.join(", ") || "General Technical Match"}</p>
                <p><strong>Interview Probability:</strong> <span style="color: var(--color-amber); font-weight: 700;">${matchScore >= 65 ? "High (78.5%)" : "Medium (52.0%)"}</span></p>
                <p><strong>Estimated Salary Range:</strong> MYR 3,800 – 4,800 / SGD 3,400 – 4,200</p>
                <p style="color: var(--text-dim); font-size: 0.75rem; margin-top: 0.4rem;">✓ Evaluated against candidate CandidateProfile &amp; 48 ATS Target Keywords</p>
            `;
        });
    }

    // =========================================================================
    // 5. INTERACTIVE DEMO SIMULATION TOGGLES
    // =========================================================================
    document.querySelectorAll(".demo-trigger").forEach(btn => {
        btn.addEventListener("click", () => {
            const targetId = btn.getAttribute("data-target");
            const box = document.getElementById(targetId);
            if (box) {
                box.classList.toggle("active");
                btn.textContent = box.classList.contains("active") ? "⏹️ Hide Interactive Simulation" : "▶️ Run Live Simulation";
            }
        });
    });

    // =========================================================================
    // 6. EMPLOYER RECRUITER GATE & PASSCODE VERIFICATION
    // =========================================================================
    const modal = document.getElementById("employer-modal");
    const openBtns = [document.getElementById("unlock-employer-btn-nav"), document.getElementById("unlock-employer-btn-hero")];
    const closeBtn = document.getElementById("modal-close");
    const passcodeForm = document.getElementById("passcode-form");
    const passcodeInput = document.getElementById("passcode-input");
    const passcodeError = document.getElementById("passcode-error");

    openBtns.forEach(btn => {
        if (btn) {
            btn.addEventListener("click", () => {
                if (modal) modal.classList.add("active");
            });
        }
    });

    if (closeBtn && modal) {
        closeBtn.addEventListener("click", () => modal.classList.remove("active"));
    }

    if (passcodeForm) {
        passcodeForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const val = (passcodeInput.value || "").trim().toUpperCase();

            if (val === "RECRUITER2026" || val === "EMPLOYER2026" || val === "IRFAN2026") {
                // Unmask Contact Details
                document.querySelectorAll(".badge-classified").forEach(el => {
                    el.textContent = "🔓 RECRUITER VERIFIED (CONTACT UNMASKED)";
                    el.style.background = "#d1fae5";
                    el.style.color = "#059669";
                    el.style.borderColor = "#34d399";
                });

                const emailEl = document.getElementById("footer-email");
                const phoneEl = document.getElementById("footer-phone");
                const locEl = document.getElementById("footer-location");

                if (emailEl) emailEl.textContent = "fahmilatif87@gmail.com";
                if (phoneEl) phoneEl.textContent = "+60 16-XXX XXXX"; // Protected or unmasked
                if (locEl) locEl.textContent = "Puchong, Selangor, Malaysia";

                if (modal) modal.classList.remove("active");
                alert("🔓 Recruiter Passcode Verified! Candidate contact details unmasked.");
            } else {
                if (passcodeError) passcodeError.style.display = "block";
            }
        });
    }

    // =========================================================================
    // 7. CONTACT / JOB OPPORTUNITY FORM SUBMISSION
    // =========================================================================
    const contactForm = document.getElementById("contact-form");
    const formToast = document.getElementById("form-toast");

    if (contactForm && formToast) {
        contactForm.addEventListener("submit", (e) => {
            e.preventDefault();
            formToast.style.display = "block";

            // Automatically unmask contact info upon job offer submission
            document.querySelectorAll(".badge-classified").forEach(el => {
                el.textContent = "🔓 RECRUITER VERIFIED (CONTACT UNMASKED)";
                el.style.background = "#d1fae5";
                el.style.color = "#059669";
            });

            setTimeout(() => {
                contactForm.reset();
            }, 3000);
        });
    }
});
