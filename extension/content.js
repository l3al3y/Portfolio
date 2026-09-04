// IrfanLLM Chrome Extension Content Script
(function() {
    'use strict';
    // Inject controller script into the host webpage
    const script = document.createElement('script');
    script.src = chrome.runtime.getURL('controller.js');
    script.onload = function() {
        this.remove();
    };
    (document.head || document.documentElement).appendChild(script);
})();
