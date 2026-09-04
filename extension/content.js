// IrfanLLM Chrome Extension Content Script - Chapter Auto-Resume Listener
(function() {
    'use strict';

    // Only auto-resume if the user actively enabled IrfanLLM on this tab/domain
    try {
        const isSessionActive = sessionStorage.getItem("__IRFANLLM_ACTIVE__") === "true";
        if (!isSessionActive) {
            // User did not activate on this tab; stay dormant (0 CPU, 0 camera)
            return;
        }

        // Notify background service worker to execute controller directly via chrome.scripting.executeScript
        // This completely bypasses the webpage's Content Security Policy (CSP) and prevents "Refused to load script" errors!
        chrome.runtime.sendMessage({ action: "AUTO_RESUME_CONTROLLER" });
    } catch (err) {
        console.warn("[IrfanLLM] Content script auto-resume check:", err);
    }
})();
