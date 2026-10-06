import { assistantContext, professionalRegistrationContext } from './content.js';
import { checkHealth, requestChat } from './integrations.js';

// A small, text-only Markdown renderer. No model-provided HTML or links execute.
function renderAnswer(element,text){
  const parts=text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  element.replaceChildren(...parts.map(part=>{
    if(part.startsWith('**')&&part.endsWith('**')){const strong=document.createElement('strong');strong.textContent=part.slice(2,-2);return strong;}
    if(part.startsWith('`')&&part.endsWith('`')){const code=document.createElement('code');code.textContent=part.slice(1,-1);return code;}
    return document.createTextNode(part);
  }));
}

export function initAssistant(){
  const $=s=>document.querySelector(s);
  const log=$('#chat-log'),input=$('#chat-input'),error=$('#chat-error'),retry=$('#chat-retry');
  let history=[],controller=null,generation=0,lastQuestion='',lastHistory=[];
  function busy(state){$('#chat-send').disabled=state;$('#chat-health').disabled=state;$('#chat-stop').hidden=!state;input.disabled=state;$('#chat-suggestions').querySelectorAll('button').forEach(b=>b.disabled=state);retry.disabled=state;log.setAttribute('aria-busy',String(state));}
  function message(role,text){
    const block=document.createElement('div');block.className=`chat-message ${role}`;
    const label=document.createElement('span');label.className='mono';label.textContent=role==='user'?'YOU':'PORTFOLIO ASSISTANT';
    const p=document.createElement('p');p.textContent=text;block.append(label,p);log.append(block);log.scrollTop=log.scrollHeight;
    return {block,p};
  }
  async function send(question,isRetry=false){
    if(controller || !question.trim())return;
    question=question.trim().slice(0,2000);
    const turn=++generation;controller=new AbortController();const active=controller;
    let timedOut=false;const timeout=setTimeout(()=>{timedOut=true;active.abort();},60000);
    error.hidden=true;retry.hidden=true;lastQuestion=question;
    if(!isRetry)lastHistory=history.slice();
    history=lastHistory.slice();
    if(!isRetry){log.querySelector('.chat-greeting')?.remove();message('user',question);}
    input.value='';busy(true);$('#chat-status').textContent='Connecting to the AI gateway…';
    const answer=message('assistant','Waiting for the model…');let received='';
    try{
      const text=await requestChat([{role:'system',content:assistantContext+'\n'+professionalRegistrationContext+'\nDo not infer current hosting from legacy portfolio claims. Mini Arcade has Lovable-generated metadata; its current hosting account configuration is unverified. The main portfolio uses GitHub Pages behind Cloudflare. Describe capabilities through documented projects, rather than inventing proficiency levels or deployment claims.'},...history.slice(-10),{role:'user',content:question}],value=>{
        if(turn!==generation)return;received=value;renderAnswer(answer.p,value);$('#chat-status').textContent='Receiving response…';
        const nearBottom=log.scrollHeight-log.scrollTop-log.clientHeight<130;if(nearBottom)log.scrollTop=log.scrollHeight;
      },active.signal);
      if(turn!==generation)return;
      history.push({role:'user',content:question},{role:'assistant',content:text});$('#chat-status').textContent='Response complete.';
      const copy=document.createElement('button');copy.className='text-button';copy.textContent='Copy response';
      copy.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(text);copy.textContent='Copied';}catch{copy.textContent='Copy unavailable—select the response text.';}});answer.block.append(copy);
    }catch(e){
      if(turn!==generation)return;
      if(received){answer.p.textContent=received;const note=document.createElement('small');note.textContent='Partial response. The conversation did not record this answer.';answer.block.append(note);}else answer.block.remove();
      const stopped=e.name==='AbortError'&&!timedOut;
      error.textContent=stopped?'Response stopped. You can retry or ask another question.':timedOut?'The response timed out. Please retry, or explore the project notes.':e instanceof TypeError?'Unable to connect to the assistant. Check your connection, or try again later.':e.message;
      error.hidden=false;retry.hidden=false;$('#chat-status').textContent=stopped?'Stopped.': 'Service unavailable for this request.';
    }finally{clearTimeout(timeout);if(turn===generation){controller=null;busy(false);}}
  }
  $('#chat-form').addEventListener('submit',e=>{e.preventDefault();send(input.value);});
  input.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey&&!e.isComposing){e.preventDefault();send(input.value);}});
  $('#chat-suggestions').addEventListener('click',e=>{const b=e.target.closest('button');if(b)send(b.textContent);});
  $('#chat-stop').addEventListener('click',()=>controller?.abort());
  retry.addEventListener('click',()=>send(lastQuestion,true));
  $('#chat-clear').addEventListener('click',()=>{
    ++generation;controller?.abort();controller=null;history=[];lastHistory=[];lastQuestion='';
    log.innerHTML='<div class="chat-greeting"><span class="mono">IRFAN’S PORTFOLIO ASSISTANT</span><p>What would you like to explore?</p></div>';
    error.hidden=true;retry.hidden=true;input.value='';$('#chat-status').textContent='Conversation cleared.';busy(false);input.focus();
  });
  $('#chat-health').addEventListener('click',async()=>{
    const b=$('#chat-health');b.disabled=true;$('#chat-status').textContent='Checking gateway…';
    const c=new AbortController(),timer=setTimeout(()=>c.abort(),12000);
    try{const status=await checkHealth(c.signal);if(!controller)$('#chat-status').textContent=status;}catch{if(!controller)$('#chat-status').textContent='Gateway unavailable. Please try later.';}finally{clearTimeout(timer);b.disabled=!!controller;}
  });
}
