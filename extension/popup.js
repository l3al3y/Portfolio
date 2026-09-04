// IrfanLLM Chrome Extension - Popup Controller
document.addEventListener("DOMContentLoaded", async () => {
    const btnToggle = document.getElementById("btn-toggle");
    const statusDot = document.getElementById("status-dot");
    const statusText = document.getElementById("status-text");
    const siteUrlEl = document.getElementById("site-url");

    let activeTab = null;
    try {
        const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
        activeTab = tabs && tabs[0];
    } catch (e) {
        console.error("Failed to query active tab:", e);
    }

    if (!activeTab || !activeTab.id) {
        siteUrlEl.innerText = "No active page";
        statusText.innerText = "Cannot detect tab";
        btnToggle.disabled = true;
        return;
    }

    // Validate page URL
    try {
        const parsed = new URL(activeTab.url);
        if (parsed.protocol.startsWith("chrome") || parsed.protocol.startsWith("edge") || parsed.protocol === "about:") {
            siteUrlEl.innerText = "Browser System Page";
            statusText.innerText = "Extensions disabled here";
            btnToggle.disabled = true;
            btnToggle.style.opacity = "0.5";
            btnToggle.innerText = "⚠️ Open a Website First";
            return;
        }
        siteUrlEl.innerText = parsed.hostname;
    } catch (e) {
        siteUrlEl.innerText = "Current Page";
    }

    // Helper: run script in webpage's MAIN world context
    async function executeInTab(codeFunc, args = []) {
        try {
            return await chrome.scripting.executeScript({
                target: { tabId: activeTab.id },
                world: "MAIN",
                func: codeFunc,
                args: args
            });
        } catch (e) {
            // Fallback for older Chromium engines that don't support 'world'
            return await chrome.scripting.executeScript({
                target: { tabId: activeTab.id },
                func: codeFunc,
                args: args
            });
        }
    }

    // Query active state on tab
    async function checkIsActive() {
        try {
            const res = await executeInTab(() => !!(window.__IRFANLLM_ACTIVE__));
            return (res && res[0] && res[0].result) || false;
        } catch (e) {
            return false;
        }
    }

    function updateUI(isActive) {
        if (isActive) {
            statusDot.style.background = "#22c55e";
            statusDot.style.boxShadow = "0 0 8px #22c55e";
            statusText.innerText = "Enabled & Active on this site";
            statusText.style.color = "#22c55e";

            btnToggle.className = "btn-action btn-disable";
            btnToggle.innerHTML = "🔴 Disable Controller (Turn OFF)";
        } else {
            statusDot.style.background = "#94a3b8";
            statusDot.style.boxShadow = "none";
            statusText.innerText = "Disabled (Inactive)";
            statusText.style.color = "#94a3b8";

            btnToggle.className = "btn-action btn-enable";
            btnToggle.innerHTML = "🟢 Enable Controller (Turn ON)";
        }
    }

    let isRunning = await checkIsActive();
    updateUI(isRunning);

    // Toggle button click handler
    btnToggle.addEventListener("click", async () => {
        btnToggle.disabled = true;
        btnToggle.innerText = "⏳ Updating...";

        try {
            if (isRunning) {
                // Disable / Turn OFF
                await executeInTab(() => {
                    if (typeof window.__IRFANLLM_STOP__ === "function") {
                        window.__IRFANLLM_STOP__();
                    }
                    try {
                        sessionStorage.removeItem("__IRFANLLM_ACTIVE__");
                        sessionStorage.setItem("__IRFANLLM_ACTIVE__", "false");
                    } catch (e) {}
                });
                isRunning = false;
            } else {
                // Enable / Turn ON: Execute hands.js + controller.js directly via chrome.scripting.executeScript
                // This bypasses the webpage's Content Security Policy (CSP) completely and prevents "Refused to load script" errors!
                await executeInTab(() => {
                    try {
                        sessionStorage.setItem("__IRFANLLM_ACTIVE__", "true");
                    } catch (e) {}
                });

                await chrome.scripting.executeScript({
                    target: { tabId: activeTab.id },
                    world: "MAIN",
                    files: ["hands.js", "controller.js"]
                });

                isRunning = true;
            }
        } catch (err) {
            console.error("Toggle error:", err);
            statusText.innerText = "Error: " + err.message;
            statusText.style.color = "#ef4444";
        } finally {
            btnToggle.disabled = false;
            updateUI(isRunning);
        }
    });

    // Dedicated Manual Cloud Sync / Update Handler
    const btnSync = document.getElementById("btn-sync");
    const btnSyncText = document.getElementById("btn-sync-text");
    const syncStatus = document.getElementById("sync-status");

    if (btnSync) {
        btnSync.addEventListener("click", async () => {
            btnSync.disabled = true;
            btnSyncText.innerText = "Connecting to main...";
            btnSync.style.opacity = "0.7";

            try {
                const resp = await fetch("https://irfanfahmi.com/controller.js?v=" + Date.now(), { cache: "no-store" });
                if (resp.ok) {
                    const code = await resp.text();
                    if (code && code.length > 500) {
                        chrome.storage.local.set({
                            "irfanllm_cloud_code": code,
                            "irfanllm_last_sync": Date.now(),
                            "irfanllm_cloud_version": "1.4.1"
                        });

                        btnSyncText.innerText = "✅ Updated & Synced!";
                        btnSync.style.background = "rgba(16,185,129,0.2)";
                        btnSync.style.borderColor = "#34d399";
                        btnSync.style.color = "#34d399";
                        syncStatus.innerText = "Latest code loaded (" + (code.length / 1024).toFixed(1) + " KB) • Ready!";
                        syncStatus.style.color = "#34d399";

                        // If currently active in tab, cleanly re-execute controller without DOM script tags!
                        if (isRunning) {
                            await executeInTab(() => {
                                if (typeof window.__IRFANLLM_STOP__ === "function") {
                                    window.__IRFANLLM_STOP__();
                                }
                            });
                            await chrome.scripting.executeScript({
                                target: { tabId: activeTab.id },
                                world: "MAIN",
                                files: ["hands.js", "controller.js"]
                            });
                        }

                        setTimeout(() => {
                            btnSync.disabled = false;
                            btnSyncText.innerText = "Check & Sync Code from Main";
                            btnSync.style.background = "";
                            btnSync.style.borderColor = "";
                            btnSync.style.color = "";
                            btnSync.style.opacity = "1";
                        }, 3000);
                        return;
                    }
                }
                throw new Error("Could not fetch remote script");
            } catch (err) {
                console.warn("[IrfanLLM] Manual sync error:", err);
                btnSyncText.innerText = "⚠️ Network Retry Needed";
                syncStatus.innerText = "Could not reach main (" + (err.message || "offline") + ")";
                syncStatus.style.color = "#f87171";
                setTimeout(() => {
                    btnSync.disabled = false;
                    btnSyncText.innerText = "Check & Sync Code from Main";
                    btnSync.style.opacity = "1";
                }, 3000);
            }
        });
    }

    // In-Popup Donation Drawer Toggle Handler
    const btnDonateToggle = document.getElementById("btn-donate-toggle");
    const donateDrawer = document.getElementById("donate-drawer");
    const donateChevron = document.getElementById("donate-chevron");

    if (btnDonateToggle && donateDrawer) {
        btnDonateToggle.addEventListener("click", () => {
            const isHidden = donateDrawer.style.display === "none" || !donateDrawer.style.display;
            donateDrawer.style.display = isHidden ? "block" : "none";
            if (donateChevron) {
                donateChevron.style.transform = isHidden ? "rotate(180deg)" : "rotate(0deg)";
            }
            if (isHidden) {
                setTimeout(() => {
                    donateDrawer.scrollIntoView({ behavior: "smooth", block: "nearest" });
                }, 50);
            }
        });
    }
});

