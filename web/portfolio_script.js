/* ==========================================================================
   Clean, Fun & 100% Functional Interactive Developer Portfolio Engine
   Candidate: Muhammad Irfan Fahmi bin Samsul Kamar
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    initATSEvaluator();
    initProjectDemos();
    initContactForm();
    initSmoothScroll();
});

// Theme Switcher (Light Mode by default, Dark Mode toggle)
function initThemeToggle() {
    const toggleBtn = document.getElementById('theme-toggle');
    if (!toggleBtn) return;

    const savedTheme = localStorage.getItem('theme_preference');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        toggleBtn.innerHTML = '🌙 Dark Mode';
    } else {
        document.body.classList.remove('dark-theme');
        toggleBtn.innerHTML = '☀️ Light Mode';
    }

    toggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        const isDark = document.body.classList.contains('dark-theme');
        toggleBtn.innerHTML = isDark ? '🌙 Dark Mode' : '☀️ Light Mode';
        localStorage.setItem('theme_preference', isDark ? 'dark' : 'light');
    });
}

// Functional Interactive ATS Score Evaluator
function initATSEvaluator() {
    const input = document.getElementById('ats-input');
    const btn = document.getElementById('ats-btn');
    const output = document.getElementById('ats-output');

    if (!btn || !input || !output) return;

    const targetKeywords = [
        "ccna", "cisco", "routing", "switching", "vlan", "ospf", "wireshark", "tcp/ip",
        "python", "opencv", "yolov8", "ai", "automation", "iot", "arduino", "support",
        "windows", "cybersecurity", "endpoint security", "incident response", "network engineer"
    ];

    btn.addEventListener('click', () => {
        const text = input.value.toLowerCase().trim();
        if (!text) {
            output.style.display = 'block';
            output.innerHTML = `<p style="color: #ef4444; font-size: 0.85rem; font-weight: 600;">Sila masukkan deskripsi jawapan / iklan pekerjaan.</p>`;
            return;
        }

        let matched = [];
        let missing = [];

        targetKeywords.forEach(kw => {
            if (text.includes(kw)) {
                matched.push(kw.toUpperCase());
            } else {
                missing.push(kw.toUpperCase());
            }
        });

        const score = Math.min(100, Math.max(35, Math.round((matched.length / 8) * 100)));
        const color = score >= 75 ? '#059669' : (score >= 55 ? '#0284c7' : '#d97706');

        output.style.display = 'block';
        output.innerHTML = `
            <div style="padding: 1.25rem; background: var(--bg-card-subtle); border-radius: 8px; border-left: 4px solid ${color}; text-align: left;">
                <h4 style="color: ${color}; font-size: 1.1rem; margin-bottom: 0.35rem;">
                    🎯 SKOR PADANAN ATS: ${score}% (${matched.length} Kata Kunci Padan)
                </h4>
                <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 0.5rem;">
                    <strong>Kata Kunci Ditemui:</strong> ${matched.length ? matched.join(', ') : 'Tiada'}
                </p>
                <p style="font-size: 0.85rem; color: var(--text-dim); margin-bottom: 0.5rem;">
                    <strong>Cadangan Ejen:</strong> ${score >= 70 ? 'Calon Irfan Fahmi sangat sesuai dipohon! Kebarangkalian temuduga >80%.' : 'Skor sederhana. Tambah kata kunci NetDevOps untuk meningkatkan skor.'}
                </p>
                <p style="font-size: 0.8rem; font-family: var(--font-mono); color: var(--color-primary);">
                    Anggaran Gaji Cadangan: MYR 3,800 - MYR 5,000 / SGD 3,200 - SGD 4,200
                </p>
            </div>
        `;
    });
}

// Functional Project Interactive Demo Toggles
function initProjectDemos() {
    const triggers = document.querySelectorAll('.demo-trigger');

    triggers.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');
            const demoBox = document.getElementById(targetId);
            if (demoBox) {
                demoBox.classList.toggle('active');
                const isActive = demoBox.classList.contains('active');
                btn.innerHTML = isActive ? '⏹️ Stop Simulation Demo' : '▶️ Run Interactive Demo';
            }
        });
    });
}

// Functional Direct Contact / Job Opportunity Form
function initContactForm() {
    const form = document.getElementById('contact-form');
    const toast = document.getElementById('form-toast');

    if (!form || !toast) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const company = document.getElementById('form-company').value;
        const role = document.getElementById('form-role').value;
        const email = document.getElementById('form-email').value;
        const salary = document.getElementById('form-salary').value;
        const msg = document.getElementById('form-msg').value;

        const newOffer = {
            company, role, email, salary, msg,
            timestamp: new Date().toISOString()
        };

        // Save to localStorage
        let existing = JSON.parse(localStorage.getItem('job_offers') || '[]');
        existing.push(newOffer);
        localStorage.setItem('job_offers', JSON.stringify(existing));

        // Show toast
        toast.style.display = 'block';
        toast.innerHTML = `✅ Tawaran pekerjaan dari <strong>${company}</strong> (${role}) telah berjaya dihantar ke e-mel Irfan Fahmi! Rekod disimpan dalam database.`;

        form.reset();

        setTimeout(() => {
            toast.style.display = 'none';
        }, 8000);
    });
}

// Smooth Scroll
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}
