import {checkHealth,requestChat} from './integrations.js?v=careers20261022';
import {renderAnswer,conversationMessages} from './chat-render.js?v=careers20261022';

export function initAssistant(){
 const $=s=>document.querySelector(s),log=$('#chat-log'),input=$('#chat-input'),error=$('#chat-error'),retry=$('#chat-retry');
 let history=[],controller=null,generation=0,lastQuestion='',lastHistory=[],failedBlock=null;
 const status=(text,state='ready')=>{$('#chat-status').textContent=text;$('#chat-panel').dataset.state=state;};
 function resize(){input.style.height='auto';input.style.height=Math.min(input.scrollHeight,180)+'px';$('#chat-count').textContent=input.value.length+' / 2000';}
 function busy(on){
  $('#chat-send').disabled=on;$('#chat-health').disabled=on;$('#chat-stop').hidden=!on;input.disabled=on;retry.disabled=on;
  $('#chat-suggestions').querySelectorAll('button').forEach(b=>b.disabled=on);log.setAttribute('aria-busy',String(on));
 }
 function message(role,text){
  const block=document.createElement('article');block.className='chat-message '+role;
  const label=document.createElement('span');label.className='chat-speaker';label.textContent=role==='user'?'You':'Irfan’s assistant';
  const content=document.createElement('div');content.className='chat-answer';content.textContent=text;
  block.append(label,content);log.append(block);log.scrollTop=log.scrollHeight;return {block,content};
 }
 async function send(question,isRetry=false){
  if(controller||!question.trim())return;
  question=question.trim().slice(0,2000);const turn=++generation,active=new AbortController();controller=active;
  let timedOut=false;const timeout=setTimeout(()=>{timedOut=true;active.abort();},65000);
  error.hidden=true;retry.hidden=true;lastQuestion=question;
  if(!isRetry){lastHistory=history.slice();failedBlock=null;}else{failedBlock?.remove();failedBlock=null;}
  history=lastHistory.slice();log.querySelector('.chat-greeting')?.remove();
  if(!isRetry)message('user',question);
  input.value='';resize();busy(true);status('Finding the relevant project evidence…','busy');
  const answer=message('assistant','One moment…');answer.block.dataset.pending='true';let received='';
  try{
   const text=await requestChat(conversationMessages(history,question),value=>{
    if(turn!==generation)return;
    const follow=log.scrollHeight-log.scrollTop-log.clientHeight<150;
    received=value;answer.block.dataset.pending='false';renderAnswer(answer.content,value);status('Writing an answer…','busy');if(follow)log.scrollTop=log.scrollHeight;
   },active.signal);
   if(turn!==generation)return;
   history.push({role:'user',content:question},{role:'assistant',content:text});history=history.slice(-8);status('Ready for your next question.');
   answer.block.dataset.pending='false';
   const actions=document.createElement('div');actions.className='chat-answer-actions';const copy=document.createElement('button');copy.type='button';copy.textContent='Copy answer';
   copy.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(text);copy.textContent='Copied';}catch{copy.textContent='Select the answer to copy it.';}});actions.append(copy);answer.block.append(actions);
  }catch(e){
   if(turn!==generation)return;
   answer.block.dataset.pending='false';
   if(received){renderAnswer(answer.content,received);const note=document.createElement('small');note.textContent='Incomplete answer · retry to finish.';answer.block.append(note);failedBlock=answer.block;}else answer.block.remove();
   const stopped=e.name==='AbortError'&&!timedOut;
   error.textContent=stopped?'Answer stopped. Retry or ask another question.':timedOut?'That took too long. Please retry, or open the project evidence below.':e instanceof TypeError?'Could not connect. Please check your connection and retry.':e.message;
   error.hidden=false;retry.hidden=false;status(stopped?'Stopped.':'Please try again shortly.','error');
  }finally{clearTimeout(timeout);if(turn===generation){controller=null;busy(false);}}
 }
 $('#chat-form').addEventListener('submit',e=>{e.preventDefault();send(input.value);});
 input.addEventListener('input',resize);
 input.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey&&!e.isComposing){e.preventDefault();send(input.value);}});
 $('#chat-suggestions').addEventListener('click',e=>{const b=e.target.closest('button');if(b)send(b.dataset.question||b.textContent);});
 $('#chat-stop').addEventListener('click',()=>controller?.abort());retry.addEventListener('click',()=>send(lastQuestion,true));
 $('#chat-clear').addEventListener('click',()=>{
  ++generation;controller?.abort();controller=null;history=[];lastHistory=[];lastQuestion='';failedBlock=null;log.replaceChildren();
  const greeting=document.createElement('div');greeting.className='chat-greeting';const title=document.createElement('h3');title.textContent='What would you like to know about Irfan?';const p=document.createElement('p');p.textContent='Explore a project, compare his experience with a role, or ask where to find the evidence.';greeting.append(title,p);log.append(greeting);
  error.hidden=true;retry.hidden=true;input.value='';resize();busy(false);status('New conversation.');input.focus();
 });
 $('#chat-health').addEventListener('click',async()=>{
  const button=$('#chat-health');button.disabled=true;status('Checking connection…');const c=new AbortController(),timer=setTimeout(()=>c.abort(),12000);
  try{const text=await checkHealth(c.signal);if(!controller)status(text);}catch{if(!controller)status('Connection unavailable. You can still read every project.','error');}
  finally{clearTimeout(timer);button.disabled=!!controller;}
 });
 resize();
}
