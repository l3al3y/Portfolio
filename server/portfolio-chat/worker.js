import {knowledge,systemPrompt} from './knowledge.js';

const ORIGINS=new Set(['https://irfanfahmi.com','https://www.irfanfahmi.com']);
const UPSTREAM='https://rootsys.cloud/v1/chat/completions';
const MODEL='deepseek-v4.1-flash';
const encoder=new TextEncoder();
const limits=new Map();
function headers(origin,type='application/json'){
 const h={'Content-Type':type,'Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Vary':'Origin'};
 if(ORIGINS.has(origin))h['Access-Control-Allow-Origin']=origin;
 return h;
}
const json=(data,status,origin)=>new Response(JSON.stringify(data),{status,headers:headers(origin)});
function localLimit(key,now,max=6){
 const bucket=Math.floor(now/60000),id=key+':'+bucket;
 const n=limits.get(id)||0;if(n>=max)return false;
 if(limits.size>1500)for(const k of limits.keys())if(!k.endsWith(':'+bucket))limits.delete(k);
 if(limits.size>2000)return false;
 limits.set(id,n+1);return true;
}
async function readBody(request){
 if(Number(request.headers.get('Content-Length'))>24000)throw Error('size');
 const reader=request.body?.getReader();if(!reader)throw Error('body');
 let size=0;const chunks=[];
 try{while(true){const {done,value}=await reader.read();if(done)break;size+=value.length;if(size>24000)throw Error('size');chunks.push(value);}}
 finally{await reader.cancel().catch(()=>{});reader.releaseLock();}
 const bytes=new Uint8Array(size);let at=0;for(const c of chunks){bytes.set(c,at);at+=c.length;}
 return JSON.parse(new TextDecoder().decode(bytes));
}
export function validateMessages(data){
 if(!data||!Array.isArray(data.messages)||!data.messages.length||data.messages.length>9)throw Error('messages');
 let total=0;
 const messages=data.messages.map((m,i)=>{
  const role=i%2===0?'user':'assistant';
  if(m?.role!==role||typeof m.content!=='string'||!m.content.trim()||m.content.length>(role==='user'?2000:7000))throw Error('messages');
  total+=m.content.length;return {role,content:m.content.trim()};
 });
 if(messages.length%2!==1||total>16000)throw Error('messages');
 return messages;
}
export function createHandler(fetcher=(input,init)=>globalThis.fetch(input,init)){return async function handle(request,env){
 const origin=request.headers.get('Origin')||'',path=new URL(request.url).pathname;
 if(origin&&!ORIGINS.has(origin))return json({error:'This origin is not allowed.'},403,origin);
 if(request.method==='OPTIONS')return new Response(null,{status:204,headers:{...headers(origin),'Access-Control-Allow-Methods':'GET, POST, OPTIONS','Access-Control-Allow-Headers':'Content-Type','Access-Control-Max-Age':'86400'}});
 if(path==='/health'&&request.method==='GET')return json({status:env.ROOTSYS_API_KEY?'ready':'offline',configured:!!env.ROOTSYS_API_KEY,version:'2026-10-21'},env.ROOTSYS_API_KEY?200:503,origin);
 if(path!=='/v1/chat/completions')return json({error:'Not found.'},404,origin);
 if(request.method!=='POST')return json({error:'Use POST.'},405,origin);
 if(!ORIGINS.has(origin))return json({error:'Send questions from the portfolio.'},403,origin);
 if(!env.ROOTSYS_API_KEY)return json({error:'The assistant is temporarily unavailable.'},503,origin);
 if(!(request.headers.get('Content-Type')||'').includes('application/json'))return json({error:'Use a JSON question.'},415,origin);
 let messages;try{messages=validateMessages(await readBody(request));}catch{return json({error:'Please send a question of up to 2,000 characters.'},400,origin);}
 const ip=request.headers.get('CF-Connecting-IP')||'unknown';
 const now=Date.now();
 const nativeAllowed=env.CHAT_RATE_LIMITER? (await env.CHAT_RATE_LIMITER.limit({key:ip})).success:true;
 if(!nativeAllowed||!localLimit(ip,now)||!localLimit('all',now,30))return new Response(JSON.stringify({error:'Please wait a minute before asking another question.'}),{status:429,headers:{...headers(origin),'Retry-After':'60'}});
 const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),45000);
 request.signal?.addEventListener('abort',()=>controller.abort(),{once:true});
 let upstream;
 try{
  upstream=await fetcher(UPSTREAM,{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+env.ROOTSYS_API_KEY},body:JSON.stringify({model:MODEL,messages:[{role:'system',content:systemPrompt+'\nPUBLIC PORTFOLIO FACTS:\n'+JSON.stringify(knowledge)},...messages],temperature:.35,max_tokens:1024,stream:true}),signal:controller.signal,redirect:'manual'});
 }catch{clearTimeout(timer);return json({error:'The assistant could not connect. Please try again shortly.',code:'upstream_connection_failed'},503,origin);}
 if(!upstream.ok){clearTimeout(timer);await upstream.body?.cancel();return json({error:'The assistant is temporarily unavailable. Please try again shortly.'},upstream.status===429?429:503,origin);}
 const reader=upstream.body?.getReader();if(!reader){clearTimeout(timer);return json({error:'No answer was returned. Please retry.'},502,origin);}
 let readerDone=false;
 const body=new ReadableStream({
  async start(out){
   let buffer='',length=0;const decoder=new TextDecoder();
   const emit=value=>out.enqueue(encoder.encode('data: '+JSON.stringify(value)+'\n\n'));
   const answer=text=>{if(typeof text==='string'&&text){length+=text.length;if(length>14000)throw Error('limit');emit({choices:[{delta:{content:text}}]});}};
   const event=raw=>{
    const data=raw.split('\n').filter(x=>x.startsWith('data:')).map(x=>x.slice(5).trimStart()).join('\n').trim();
    if(!data)return;if(data==='[DONE]'){readerDone=true;return;}
    const record=JSON.parse(data);if(record.error)throw Error('upstream');
    answer(record.choices?.[0]?.delta?.content??record.choices?.[0]?.message?.content);
   };
   const flush=()=>{buffer=buffer.replace(/\r\n/g,'\n');let i;while(!readerDone&&(i=buffer.indexOf('\n\n'))>=0){const record=buffer.slice(0,i);buffer=buffer.slice(i+2);event(record);}};
   try{
    const isJSON=(upstream.headers.get('Content-Type')||'').includes('application/json');
    while(!readerDone){const {done,value}=await reader.read();if(done){buffer+=decoder.decode();break;}buffer+=decoder.decode(value,{stream:true});if(buffer.length>100000)throw Error('limit');if(!isJSON)flush();}
    if(isJSON){const record=JSON.parse(buffer);if(record.error)throw Error('upstream');answer(record.choices?.[0]?.message?.content);}
    else{flush();if(buffer.trim()&&!readerDone)event(buffer);}
    if(!length)throw Error('empty');
    out.enqueue(encoder.encode('data: [DONE]\n\n'));out.close();
   }catch{try{emit({error:'The response was interrupted. Please retry.'});out.close();}catch{}}
   finally{clearTimeout(timer);await reader.cancel().catch(()=>{});reader.releaseLock();}
  },
  cancel(){controller.abort();return reader.cancel().catch(()=>{});}
 });
 return new Response(body,{headers:headers(origin,'text/event-stream; charset=utf-8')});
};}
export default {fetch: createHandler()};
