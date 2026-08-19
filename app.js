// Retired portfolio runtime. Personal profile data and the old chatbot were removed.
// Current portfolio pages use lab/main.js; retained only for previously cached links.
(() => {
  const openAssistant=()=>window.location.assign('/ask/');
  window.toggleFloatingChat=openAssistant;
  window.submitChatMessage=openAssistant;
  window.submitMobileChatMessage=openAssistant;
})();
