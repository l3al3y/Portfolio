// Contracts taken from the original app.js. No backend secrets belong in this file.
export const gateway = Object.freeze({
  contact: 'https://contact-gate-worker.cabalme4.workers.dev/',
  health: 'https://contact-gate-worker.cabalme4.workers.dev/health',
  chat: 'https://contact-gate-worker.cabalme4.workers.dev/v1/chat/completions',
  sitekey: '0x4AAAAAAD9nlicfqO7QQsBk'
});

export function httpError(status) {
  if (status === 429) return 'The assistant is receiving too many requests. Please wait a moment and try again.';
  if (status === 401 || status === 403) return 'The gateway rejected this request. Try again later, or use the contact links.';
  if (status >= 500) return 'The assistant service is temporarily unavailable. You can still explore every case study and credential.';
  return `The request could not be completed (HTTP ${status}). Please try again.`;
}

export async function checkHealth(signal, fetcher = fetch) {
  const response = await fetcher(gateway.health, { signal });
  if (!response.ok) throw new Error(httpError(response.status));
  const data = await response.json();
  if (data.maintenance === true || data.status === 'maintenance') return 'Service is under maintenance. Please try later.';
  if (data.has_active_model === false || data.status === 'offline') return 'Models are currently unavailable. Please try later.';
  if (data.has_active_model === true) return 'Gateway reports an active model.';
  return 'Gateway reachable. Model availability is confirmed when you send.';
}

// SSE records may span arbitrary byte chunks, including a multibyte character.
// Process complete events, flush the last record, and stop at [DONE].
export async function readChatStream(body, onText, signal) {
  if (!body) throw new Error('The gateway returned no response stream.');
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = '', text = '', finished = false;
  function consume(event) {
    const data = event.split('\n').filter(line => line.startsWith('data:')).map(line => line.slice(5).trimStart()).join('\n').trim();
    if (!data) return;
    if (data === '[DONE]') { finished = true; return; }
    let record;
    try { record = JSON.parse(data); } catch { throw new Error('The gateway returned an unreadable response. Please retry.'); }
    if (record.error) throw new Error('The model reported an error. Please try again later.');
    const content = record.choices?.[0]?.delta?.content ?? record.choices?.[0]?.message?.content;
    if (typeof content === 'string') { text += content; onText(text); }
  }
  function flushEvents() {
    buffer = buffer.replace(/\r\n/g, '\n');
    let boundary;
    while ((boundary = buffer.indexOf('\n\n')) !== -1 && !finished) {
      const event = buffer.slice(0, boundary); buffer = buffer.slice(boundary + 2); consume(event);
    }
  }
  try {
    while (!finished) {
      signal?.throwIfAborted();
      const chunk = await reader.read();
      if (chunk.done) { buffer += decoder.decode(); flushEvents(); if (buffer.trim() && !finished) consume(buffer); break; }
      buffer += decoder.decode(chunk.value, { stream: true }); flushEvents();
    }
    if (!text.trim()) throw new Error('The assistant returned an empty response. Please retry.');
    return text;
  } finally {
    await reader.cancel().catch(() => {}); reader.releaseLock();
  }
}

export async function requestChat(messages, onText, signal, fetcher = fetch) {
  const response = await fetcher(gateway.chat, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, signal,
    body: JSON.stringify({ model: 'auto', stream: true, messages, temperature: 0.5, max_tokens: 1024 })
  });
  if (!response.ok) throw new Error(httpError(response.status));
  if ((response.headers.get('content-type') || '').includes('application/json')) {
    const data = await response.json();
    const text = data.choices?.[0]?.message?.content;
    if (data.error || typeof text !== 'string' || !text.trim()) throw new Error('The assistant returned no usable answer. Please retry.');
    onText(text); return text;
  }
  return readChatStream(response.body, onText, signal);
}

export async function verifyContact(turnstileToken, signal, fetcher = fetch) {
  if (!turnstileToken) throw new Error('Please complete the verification challenge.');
  const response = await fetcher(gateway.contact, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ turnstileToken }), signal
  });
  if (response.status === 429) throw new Error('Too many verification attempts. Please wait a minute, then retry.');
  if (response.status >= 500) throw new Error('Contact verification is temporarily unavailable. Please try later, or use LinkedIn.');
  if (!response.ok) throw new Error('Verification was rejected by the gateway. Please retry the challenge.');
  const data = await response.json();
  if (typeof data.email !== 'string' || typeof data.phone !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email) || !/\d{6,}/.test(data.phone.replace(/\D/g, ''))) {
    throw new Error('The gateway did not return valid contact details. Please try again later.');
  }
  return { email: data.email, phone: data.phone };
}
