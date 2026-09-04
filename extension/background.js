// IrfanLLM Chrome Extension - Background Service Worker
// Automatically keeps the extension synchronized with irfanfahmi.com

const CLOUD_URL = "https://irfanfahmi.com/controller.js";

async function syncWithMain() {
    try {
        const resp = await fetch(CLOUD_URL + "?v=" + Date.now(), { cache: "no-store" });
        if (resp.ok) {
            const code = await resp.text();
            if (code && code.length > 500) {
                chrome.storage.local.set({
                    "irfanllm_cloud_code": code,
                    "irfanllm_last_sync": Date.now(),
                    "irfanllm_cloud_version": "1.4.1"
                });
                console.log("[IrfanLLM Background] Successfully synced controller.js from main (" + code.length + " bytes)");
                return true;
            }
        }
    } catch (e) {
        console.warn("[IrfanLLM Background] Background sync offline/delayed:", e);
    }
    return false;
}

// Sync on extension install, update, or browser startup
chrome.runtime.onInstalled.addListener(() => {
    syncWithMain();
});

chrome.runtime.onStartup.addListener(() => {
    syncWithMain();
});

// Listen for messages from popup or content script
chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
    if (req && req.action === "AUTO_RESUME_CONTROLLER" && sender.tab && sender.tab.id) {
        chrome.scripting.executeScript({
            target: { tabId: sender.tab.id },
            world: "MAIN",
            files: ["hands.js", "controller.js"]
        }).then(() => {
            console.log("[IrfanLLM Background] Successfully auto-resumed controller on tab", sender.tab.id);
            sendResponse({ success: true });
        }).catch(err => {
            console.warn("[IrfanLLM Background] Auto-resume failed:", err);
            sendResponse({ success: false, error: err.message });
        });
        return true;
    }

    if (req && req.action === "SYNC_NOW") {
        syncWithMain().then((ok) => {
            sendResponse({ success: ok, time: Date.now() });
        });
        return true; // Keep channel open for async response
    }
});
