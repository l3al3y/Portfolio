import { projects, approach } from './content.js';
import { initMotion } from './portfolio-motion.js';
import { initAssistant } from './assistant.js';
import { initContact } from './contact.js';
import { projectArt } from './project-art.js';
import { initHero } from './hero.js';
import { initNavigation } from './navigation.js';

const $ = selector => document.querySelector(selector);
export const escapeHtml = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const external = url => /^https:\/\//.test(url) ? 'target="_blank" rel="noopener noreferrer"' : '';

const media = {
  checkout: { caption:'Illustration · vision + barcode verification', filter:'vision' },
  hermes: { src:'assets/thumb-hermes.png', alt:'Archived Hermes operations dashboard', caption:'Archived dashboard capture · not live telemetry', filter:'agents' },
  gesture: { src:'assets/manga/gesture_pageup.jpg', alt:'Irfan demonstrating a hand gesture for the touchless reader', caption:'Original gesture training image', filter:'vision' },
  livestock: { caption:'Illustration · load-cell measurement', filter:'embedded' },
  arcade: { src:'assets/thumb-arcade.png', alt:'Mini Arcade interface with its browser games', caption:'Original Mini Arcade interface capture', filter:'play' }
};
function projectMedia(p){const m=media[p.id];return m.src?`<img src="${m.src}" alt="${escapeHtml(m.alt)}" loading="lazy" decoding="async">`:projectArt(p.id);}
function renderProjects(filter='all'){
  const visible=projects.filter(p=>filter==='all'||media[p.id].filter===filter);
  $('#projects-grid').innerHTML=visible.map(p=>{
    const demo=p.links.find(l=>/Try|Launch|Telemetry/.test(l.label));
    return `<article class="project-card ${p.id==='checkout'||visible.length===1?'featured':''}" data-reveal><button class="project-visual ${p.id==='gesture'?'gesture-photo':''}" data-case="${p.id}" aria-label="Read ${p.title} case study">${projectMedia(p)}<span class="project-number">SELECTED / ${p.number}</span><span class="media-caption">${media[p.id].caption}</span><span class="project-open" aria-hidden="true">↗</span></button><div class="project-copy"><p class="project-meta">${p.category}</p><h3>${p.title}</h3><p class="project-summary">${p.summary}</p><div class="tags">${p.stack.map(t=>`<span>${t}</span>`).join('')}</div><p class="project-provenance">${media[p.id].caption}</p>${demo?`<a class="project-demo" href="${demo.url}" ${external(demo.url)}>${demo.label} ↗</a>`:''}<div class="project-bottom"><div class="project-result"><strong>${p.result}</strong><small>${p.resultNote}</small></div><button data-case="${p.id}">Read case study ↗</button></div></div></article>`;
  }).join('');
  $('#project-status').textContent=`Showing ${visible.length} of ${projects.length} projects.`;
  document.dispatchEvent(new Event('portfolio:content'));
}
$('#project-filters').addEventListener('click',e=>{const b=e.target.closest('[data-filter]');if(!b)return;$('#project-filters').querySelectorAll('button').forEach(item=>item.setAttribute('aria-pressed',String(item===b)));renderProjects(b.dataset.filter);});
renderProjects();
$('#approach-steps').innerHTML = approach.map(([title,text],i)=>`<article class="approach-step"><span class="mono">0${i+1} /</span><h3>${title}${i===4?' ↺':''}</h3><p>${text}</p></article>`).join('');

document.querySelectorAll('dialog').forEach(dialog => {
  const close=()=>dialog.id==='case-dialog'?dismissCase():dialog.close();
  dialog.querySelector('[data-close]').addEventListener('click',close);
  dialog.addEventListener('click', e=>{if(e.target!==dialog)return; const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)close();});
});
const caseDialog = $('#case-dialog');
function openCase(id) {
  const p=projects.find(p=>p.id===id);if(!p)return;
  $('#case-content').innerHTML=`<p class="project-meta">${p.category}</p><h2 id="case-title">${p.title}</h2><p class="case-lead">${p.summary}</p><div class="tags">${p.stack.map(t=>`<span>${t}</span>`).join('')}</div><figure class="case-media"><div>${projectMedia(p)}</div><figcaption>${media[p.id].caption}</figcaption></figure><div class="case-result"><strong>${p.result}</strong><small>${p.resultNote}</small></div><div class="case-sections">${['problem','implementation','constraints','outcome'].map(k=>`<section><h3>${k}</h3><p>${p[k]}</p></section>`).join('')}</div><div class="inline-links">${p.links.map(l=>l.preview?`<button class="button" data-document="${l.url}" data-title="INOTEK 2025 achievement certificate">${l.label} ↗</button>`:`<a class="button" href="${l.url}" ${external(l.url)}>${l.label} ↗</a>`).join('')}<button class="text-button" id="case-copy">Copy case-study link</button></div><div class="case-sources"><p>SOURCE NOTES</p>${p.sources.map(s=>`<a href="${s.url}" ${external(s.url)}>${s.label} ↗</a>`).join('')}</div>`;
  $('#case-content').querySelectorAll('a[href="resume/resume.pdf"]').forEach(link=>{const button=document.createElement('button');button.className='text-button';button.dataset.resume='';button.textContent=link.textContent;link.replaceWith(button);});
  if(!caseDialog.open)caseDialog.showModal();
  caseDialog.scrollTop=0;
  $('#case-copy').addEventListener('click',async e=>{try{await navigator.clipboard.writeText(location.href);e.target.textContent='Link copied';}catch{e.target.textContent='Copy the URL from your browser to share this case study.';}});
}
let caseClosing=false;
function dismissCase(){
  if(caseClosing)return;
  if(!location.hash.startsWith('#case-')){caseDialog.close();return;}
  caseClosing=true;
  // Keep the modal active until back navigation completes. Closing it first lets
  // a rapid click underneath race the asynchronous history traversal.
  if(history.state?.portfolioCase&&history.state.returnHash)history.back();
  else{
    history.replaceState(null,'','#projects');window.dispatchEvent(new HashChangeEvent('hashchange'));
    const heading=$('#work-heading');heading.tabIndex=-1;heading.focus({preventScroll:true});
  }
}
caseDialog.addEventListener('cancel',event=>{event.preventDefault();dismissCase();});
caseDialog.addEventListener('close',()=>{
  if(location.hash.startsWith('#case-')){history.replaceState(null,'','#projects');window.dispatchEvent(new HashChangeEvent('hashchange'));}
});
document.addEventListener('click',e=>{
  const b=e.target.closest('[data-case]');if(!b)return;
  if(e.ctrlKey||e.metaKey||e.shiftKey||e.altKey)return;
  e.preventDefault();
  const hash=`#case-${b.dataset.case}`;
  if(location.hash!==hash){history.pushState({portfolioCase:true,returnHash:location.hash||'#home'},'',hash);window.dispatchEvent(new HashChangeEvent('hashchange'));}
  else openCase(b.dataset.case);
});
function readHash(){caseClosing=false;if(location.hash.startsWith('#case-'))openCase(location.hash.slice(6));else if(caseDialog.open)caseDialog.close();}
window.addEventListener('hashchange',readHash);readHash();

const documentDialog = $('#document-dialog');
let documentController;
let previewManifest;
export async function openDocument(url,title) {
  if(!/^(certificates\/[^/]+\.pdf|resume\/resume\.pdf)$/.test(url))return;
  documentController?.abort();
  documentController=new AbortController();
  const controller=documentController;
  $('#document-title').textContent=title;
  $('#document-link').href=url;
  $('#document-status').textContent='Loading document…';
  $('#document-frame').replaceChildren();
  if(!documentDialog.open)documentDialog.showModal();
  try{
    const response=await fetch(url,{method:'HEAD',signal:controller.signal});
    if(!response.ok)throw new Error('Document is unavailable. Please try again later.');
    if(!documentDialog.open || controller!==documentController)return;
    if(!previewManifest){const manifestResponse=await fetch('assets/documents/manifest.json',{signal:controller.signal});if(!manifestResponse.ok)throw new Error();previewManifest=await manifestResponse.json();}
    const pages=previewManifest[url];if(!pages?.length)throw new Error();
    if(!documentDialog.open || controller!==documentController)return;
    const viewer=document.createElement('div');viewer.className='document-page';
    const image=document.createElement('img');image.alt=`${title} — document page`;image.decoding='async';
    viewer.append(image);
    const tools=document.createElement('div');tools.className='document-tools';
    const zoom=document.createElement('button');zoom.textContent='Zoom in';zoom.className='text-button';zoom.setAttribute('aria-pressed','false');
    zoom.addEventListener('click',()=>{const enlarged=viewer.classList.toggle('enlarged');zoom.textContent=enlarged?'Fit page':'Zoom in';zoom.setAttribute('aria-pressed',String(enlarged));});
    tools.append(zoom);let pageIndex=0;
    function showPage(){const page=pages[pageIndex];image.width=page.width;image.height=page.height;image.src=page.src;image.alt=`${title} — page ${pageIndex+1}`;$('#document-status').textContent=`Page ${pageIndex+1} of ${pages.length} · Loading preview…`;}
    image.addEventListener('load',()=>{if(controller===documentController)$('#document-status').textContent=`Page ${pageIndex+1} of ${pages.length} · Rendered from the original PDF.`;});
    image.addEventListener('error',()=>{if(controller===documentController)$('#document-status').textContent='Preview unavailable. Open the original PDF using the link.';});
    if(pages.length>1){for(const [label,delta] of [['Previous page',-1],['Next page',1]]){const b=document.createElement('button');b.className='text-button';b.textContent=label;b.addEventListener('click',()=>{pageIndex=(pageIndex+delta+pages.length)%pages.length;showPage();});tools.append(b);}}
    $('#document-frame').append(tools,viewer);showPage();
  }catch(error){if(error.name!=='AbortError' && controller===documentController)$('#document-status').textContent=error.message==='Document is unavailable. Please try again later.'?error.message:'Unable to reach this document. Check your connection or try Open PDF.';}
}
documentDialog.addEventListener('close',()=>{documentController?.abort();$('#document-frame').replaceChildren();});
let contact;
document.addEventListener('click',e=>{
  const preview=e.target.closest('[data-document]');if(preview)openDocument(preview.dataset.document,preview.dataset.title);
  if(e.target.closest('[data-resume]'))contact.requestResume();
});

let registry=[],limit=9;
function renderCredentials(){
  if(!registry.length){$('#credential-status').textContent='No credential documents are currently available. Please check back later.';$('#credential-grid').replaceChildren();$('#credential-more').hidden=true;return;}
  const query=$('#credential-search').value.trim().toLocaleLowerCase();
  const category=$('#credential-category').value;
  const matches=registry.filter(c=>(category==='all'||c.category===category)&&`${c.title} ${c.issuer} ${c.date} ${c.category_label}`.toLocaleLowerCase().includes(query));
  $('#credential-status').textContent=matches.length?`${matches.length} DOCUMENT${matches.length===1?'':'S'} FOUND / SHOWING ${Math.min(limit,matches.length)} OF ${registry.length} IN THE REGISTRY`:'No credentials match your search. Try a different word or category.';
  $('#credential-grid').innerHTML=matches.slice(0,limit).map(c=>`<article class="credential-card"><span class="mono">${escapeHtml(c.category_label)}</span><h3>${escapeHtml(c.title)}</h3><p>${escapeHtml(c.issuer)}<br>${escapeHtml(c.date)}</p><div class="credential-actions"><button data-document="certificates/${escapeHtml(c.filename)}" data-title="${escapeHtml(c.title)}" aria-label="Preview ${escapeHtml(c.title)}">Preview document ↗</button><a href="certificates/${escapeHtml(c.filename)}" download aria-label="Download ${escapeHtml(c.title)}">PDF ↓</a></div></article>`).join('');
  $('#credential-more').hidden=matches.length<=limit;
  $('#credential-more').textContent=`Show more documents (${matches.length-limit} remaining)`;
}
async function loadCredentials(){
  $('#credential-status').textContent='Loading credential registry…';$('#credential-retry').hidden=true;$('#credential-search').disabled=true;$('#credential-category').disabled=true;$('#credential-reset').disabled=true;
  const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),10000);
  try{
    const response=await fetch('certificates/registry.json',{signal:controller.signal,cache:'no-cache'});
    if(!response.ok)throw new Error();
    const data=await response.json();
    if(!Array.isArray(data)||!data.every(c=>['title','issuer','date','category','category_label','filename'].every(k=>typeof c[k]==='string')&&/^[\w.-]+\.pdf$/.test(c.filename)))throw new Error();
    registry=data;
    const categories=[...new Set(registry.map(c=>c.category))];
    $('#credential-category').innerHTML='<option value="all">All categories</option>'+categories.map(k=>`<option value="${escapeHtml(k)}">${escapeHtml(registry.find(c=>c.category===k).category_label)} (${registry.filter(c=>c.category===k).length})</option>`).join('');
    renderCredentials();
  }catch{$('#credential-status').textContent='The credential registry could not be loaded. Please check your connection and retry.';$('#credential-retry').hidden=false;}
  finally{clearTimeout(timer);$('#credential-search').disabled=!registry.length;$('#credential-category').disabled=!registry.length;$('#credential-reset').disabled=!registry.length;}
}
$('#credential-search').addEventListener('input',()=>{limit=9;renderCredentials();});
$('#credential-category').addEventListener('change',()=>{limit=9;renderCredentials();});
$('#credential-reset').addEventListener('click',()=>{$('#credential-search').value='';$('#credential-category').value='all';limit=9;renderCredentials();});
$('#credential-more').addEventListener('click',()=>{limit+=9;renderCredentials();});
$('#credential-retry').addEventListener('click',loadCredentials);
if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){loadCredentials();observer.disconnect();}},{rootMargin:'500px'});observer.observe($('#certificates'));}else loadCredentials();

$('#theme-toggle').addEventListener('click',()=>{const theme=document.documentElement.dataset.theme==='dark'?'light':'dark';document.documentElement.dataset.theme=theme;try{localStorage.setItem('lab-theme',theme);}catch{}syncTheme();});
function syncTheme(){$('#theme-toggle').setAttribute('aria-label',`Switch to ${document.documentElement.dataset.theme==='dark'?'light':'dark'} theme`);$('meta[name="theme-color"]').content=document.documentElement.dataset.theme==='dark'?'#0c1117':'#f6f4ee';}
syncTheme();
initNavigation();
initMotion();initHero();initAssistant();contact=initContact({onResume:()=>openDocument('resume/resume.pdf','Muhammad Irfan Fahmi — Résumé')});
