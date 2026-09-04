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

        // User turned to next/prev chapter while IrfanLLM was active!
        // Directly contact main with cache-busting timestamp so any GitHub JS updates run immediately!
        const prev = document.getElementById('irfanllm-script');
        if (prev) prev.remove();

        const script = document.createElement('script');
        script.id = 'irfanllm-script';
        script.src = 'https://irfanfahmi.com/controller.js?v=' + Date.now();
        script.onerror = () => {
            console.warn('[IrfanLLM] Cloud unreachable, loading local bundle fallback...');
            const fallback = document.createElement('script');
            fallback.id = 'irfanllm-script';
            fallback.src = chrome.runtime.getURL('controller.js');
            (document.head || document.documentElement).appendChild(fallback);
        };
        (document.head || document.documentElement).appendChild(script);
    } catch (err) {
        console.warn("[IrfanLLM] Content script check:", err);
    }
})();
