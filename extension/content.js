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

        // User turned to next/prev chapter while IrfanLLM was active! Auto-resume seamlessly:
        chrome.storage.local.get(["irfanllm_cloud_code"], (res) => {
            const cloudCode = res && res.irfanllm_cloud_code;
            const script = document.createElement('script');
            script.id = 'irfanllm-script';

            if (cloudCode && cloudCode.length > 500) {
                try {
                    script.textContent = cloudCode;
                    (document.head || document.documentElement).appendChild(script);
                    return;
                } catch (cspErr) {
                    console.warn("[IrfanLLM] Inline injection restricted, falling back to bundle URL", cspErr);
                }
            }

            // Fallback: local extension bundle URL
            script.src = chrome.runtime.getURL('controller.js');
            (document.head || document.documentElement).appendChild(script);
        });
    } catch (err) {
        console.warn("[IrfanLLM] Content script check:", err);
    }
})();
