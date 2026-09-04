document.getElementById("btn-toggle").addEventListener("click", async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab || !tab.id) return;

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
            if (window.__IRFANLLM_ACTIVE__ && typeof window.__IRFANLLM_STOP__ === "function") {
                window.__IRFANLLM_STOP__();
            } else {
                const s = document.createElement("script");
                s.src = "https://irfanfahmi.com/manga.js?v=" + Date.now();
                (document.head || document.documentElement).appendChild(s);
            }
        }
    });
    window.close();
});
