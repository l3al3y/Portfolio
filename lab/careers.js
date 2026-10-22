document.addEventListener('click', async event => {
  const button = event.target.closest('[data-share-career]');
  if (!button) return;
  const status = document.querySelector('#career-share-status');
  try {
    await navigator.clipboard.writeText(location.origin + location.pathname);
    status.textContent = 'Portfolio link copied. Share it with the hiring team.';
  } catch {
    status.textContent = 'Copy this page’s address from your browser to share it.';
  }
});
