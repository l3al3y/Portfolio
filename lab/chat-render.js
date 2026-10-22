import {projects} from './content.js?v=community20261022';
const allowed=new Set(['/careers/','/careers/ai-ml/','/careers/software/','/careers/embedded-iot/','/resume/','/resume/ai-ml-engineer-20261022-plain.pdf','/resume/software-engineer-20261022-community.pdf','/resume/embedded-iot-engineer-20261022-community.pdf','/','/ask/','/projects/','/about/','/credentials/','/contact/','/resume/computer-engineering-20261022-community.pdf','/smc/','/smc/downloads/#download-counts','https://engineer.org.my/public/Engineers/Index/325542']);
for(const p of projects){allowed.add('/projects/'+p.id+'/');for(const link of [...p.links,...p.sources]){try{const u=new URL(link.url,'https://irfanfahmi.com/');allowed.add(u.origin==='https://irfanfahmi.com'?u.pathname+u.search+u.hash:u.href);}catch{}}}
export function safeAnswerLink(raw){
 try{const u=new URL(raw,'https://irfanfahmi.com/');if(u.protocol!=='https:'||u.username||u.password)return null;
 let candidate=u.origin==='https://irfanfahmi.com'?u.pathname+u.search+u.hash:u.href;
 candidate={"/resume/resume.pdf":"/resume/computer-engineering-20261022-community.pdf","/resume/computer-engineering-20261022.pdf":"/resume/computer-engineering-20261022-community.pdf","/resume/ai-ml-engineer.pdf":"/resume/ai-ml-engineer-20261022-plain.pdf","/resume/software-engineer.pdf":"/resume/software-engineer-20261022-community.pdf","/resume/embedded-iot-engineer.pdf":"/resume/embedded-iot-engineer-20261022-community.pdf"}[candidate]??candidate;
 return allowed.has(candidate)?candidate:null;
 }catch{return null;}
}
function inline(element,text){
 for(const part of text.split(/(\*\*[^*\n]+\*\*|`[^`\n]+`|\[[^\]\n]+\]\([^\s)]+\))/g)){
  const match=part.match(/^\[([^\]]+)\]\(([^)]+)\)$/),href=match&&safeAnswerLink(match[2]);
  if(href){const a=document.createElement('a');a.href=href;a.textContent=match[1];if(href.startsWith('https:')){a.target='_blank';a.rel='noopener noreferrer';}element.append(a);}
  else if(part.startsWith('**')&&part.endsWith('**')){const b=document.createElement('strong');b.textContent=part.slice(2,-2);element.append(b);}
  else if(part.startsWith('`')&&part.endsWith('`')){const code=document.createElement('code');code.textContent=part.slice(1,-1);element.append(code);}
  else element.append(document.createTextNode(part));
 }
}
export function renderAnswer(element,text){
 const fragment=document.createDocumentFragment();let list=null;
 for(const paragraph of text.split(/\n\s*\n/)){
  for(const line of paragraph.split('\n')){
   if(/^\s*[-*]\s+/.test(line)){
    if(!list){list=document.createElement('ul');fragment.append(list);}const li=document.createElement('li');inline(li,line.replace(/^\s*[-*]\s+/,''));list.append(li);
   }else if(line.trim()){
    list=null;const p=document.createElement('p');inline(p,line.replace(/^#{1,3}\s+/,''));fragment.append(p);
   }
  }
  list=null;
 }
 element.replaceChildren(fragment);
}
export function conversationMessages(history,question){
 const recent=history.slice(-8);while(recent.length&&recent.reduce((n,m)=>n+m.content.length,question.length)>15000)recent.splice(0,2);
 return [...recent,{role:'user',content:question}];
}
