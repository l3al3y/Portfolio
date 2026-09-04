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
                });
                isRunning = false;
            } else {
                // Enable / Turn ON (inject controller.js directly from extension bundle)
                const scriptUrl = chrome.runtime.getURL("controller.js");
                await executeInTab((url) => {
                    if (window.__IRFANLLM_ACTIVE__) return;
                    const existing = document.getElementById("irfanllm-script");
                    if (existing) existing.remove();
                    const s = document.createElement("script");
                    s.id = "irfanllm-script";
                    s.src = url;
                    (document.head || document.documentElement).appendChild(s);
                }, [scriptUrl]);
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
});
