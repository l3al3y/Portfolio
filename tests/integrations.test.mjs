import test from 'node:test';
import assert from 'node:assert/strict';
import { readChatStream, requestChat, verifyContact, checkHealth, gateway } from '../lab/integrations.js';
function stream(text, size=1){const bytes=new TextEncoder().encode(text);let offset=0;return new ReadableStream({pull(c){if(offset>=bytes.length){c.close();return;}c.enqueue(bytes.slice(offset,offset+=size));}});}
test('SSE handles byte-split UTF-8, CRLF, comments, and stops at DONE',async()=>{
  const updates=[];
  const data=': keepalive\r\n\r\ndata: {"choices":[{"delta":{"content":"Hello "}}]}\r\n\r\ndata: {"choices":[{"delta":{"content":"世界"}}]}\r\n\r\ndata: [DONE]\r\n\r\ndata: {"choices":[{"delta":{"content":"ignored"}}]}\n\n';
  assert.equal(await readChatStream(stream(data),t=>updates.push(t)),'Hello 世界');assert.deepEqual(updates,['Hello ','Hello 世界']);
});
test('SSE flushes final event without trailing blank line',async()=>{assert.equal(await readChatStream(stream('data: {"choices":[{"delta":{"content":"Last"}}]}'),()=>{}),'Last');});
test('empty and malformed model responses surface useful errors',async()=>{
  await assert.rejects(readChatStream(stream('data: [DONE]\n\n'),()=>{}),/empty response/);
  await assert.rejects(readChatStream(stream('data: invalid\n\n'),()=>{}),/unreadable response/);
  await assert.rejects(readChatStream(stream('data: {"error":"unavailable"}\n\n'),()=>{}),/model reported an error/);
});
test('abort stops stream processing',async()=>{const c=new AbortController();c.abort();await assert.rejects(readChatStream(stream('data: [DONE]\n\n'),()=>{},c.signal),{name:'AbortError'});});
test('chat preserves original endpoint and payload, accepts JSON fallback',async()=>{
  const messages=[{role:'user',content:'Explain checkout'}];
  const text=await requestChat(messages,()=>{},undefined,async(url,options)=>{
    assert.equal(url,gateway.chat);assert.equal(options.method,'POST');
    const body=JSON.parse(options.body);assert.equal(body.model,'auto');assert.equal(body.stream,true);assert.equal(body.max_tokens,1024);assert.deepEqual(body.messages,messages);
    return new Response(JSON.stringify({choices:[{message:{content:'Answer'}}]}),{headers:{'content-type':'application/json'}});
  });assert.equal(text,'Answer');
});
test('rate limiting and service failures are explicit',async()=>{
  await assert.rejects(requestChat([],()=>{},undefined,async()=>new Response('',{status:429})),/too many requests/);
  await assert.rejects(requestChat([],()=>{},undefined,async()=>new Response('',{status:503})),/temporarily unavailable/);
});
test('contact uses token contract and never reveals fallback credentials',async()=>{
  const result=await verifyContact('test-token',undefined,async(url,options)=>{
    assert.equal(url,gateway.contact);assert.deepEqual(JSON.parse(options.body),{turnstileToken:'test-token'});
    return new Response(JSON.stringify({email:'test@example.com',phone:'+60 123456789'}));
  });assert.equal(result.email,'test@example.com');
  await assert.rejects(verifyContact('test-token',undefined,async()=>new Response('{}')),/valid contact details/);
  await assert.rejects(verifyContact('',undefined,async()=>{throw new Error('must not call');}),/complete the verification/);
  await assert.rejects(verifyContact('test-token',undefined,async()=>new Response('{}',{status:403})),/rejected/);
  await assert.rejects(verifyContact('test-token',undefined,async()=>new Response('{}',{status:429})),/Too many verification attempts/);
  await assert.rejects(verifyContact('test-token',undefined,async()=>new Response('{}',{status:503})),/temporarily unavailable/);
});
test('health distinguishes reachability, model availability, and maintenance',async()=>{
  assert.match(await checkHealth(undefined,async()=>new Response('{"status":"maintenance"}')),/maintenance/);
  assert.match(await checkHealth(undefined,async()=>new Response('{"has_active_model":false}')),/unavailable/);
  assert.match(await checkHealth(undefined,async()=>new Response('{"has_active_model":true}')),/active model/);
  assert.match(await checkHealth(undefined,async()=>new Response('{}')),/availability is confirmed/);
});
