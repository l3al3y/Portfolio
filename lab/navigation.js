const screenSections = {
  home: ['home','approach','contact'], projects: ['projects'], about: ['about'],
  certificates: ['certificates'], assistant: ['assistant']
};

// Preserve original portfolio links alongside the new case-study URLs.
export function screenForHash(hash) {
  const id=hash.replace(/^#/,'');
  if(id.startsWith('case-'))return 'projects';
  if(['about','skills','experience'].includes(id))return 'about';
  if(['assistant','chat'].includes(id))return 'assistant';
  if(id==='certificates')return 'certificates';
  if(id==='projects')return 'projects';
  return 'home';
}

export function initNavigation(){
  const root=document.documentElement;
  const sheet=document.querySelector('#mobile-menu'),menu=document.querySelector('#menu-toggle');
  const details=document.querySelector('#candidate-details');
  const expanded=[details,...document.querySelectorAll('.desktop-expanded')];
  const dockLinks=[...document.querySelectorAll('.mobile-bottom-dock a')];
  const desktopLinks=[...document.querySelectorAll('#main-nav a')];
  const sections=[...document.querySelectorAll('main > section')];
  const mobile=matchMedia('(max-width: 768px)');
  const positions=new Map();
  const known=new Set([...sections.map(s=>s.id),'skills','experience','chat','main-content']);
  let active=screenForHash(location.hash),frame=0;
  if('scrollRestoration' in history)history.scrollRestoration='manual';

  function mark(screen){
    for(const link of [...dockLinks,...desktopLinks]){
      if(screenForHash(link.hash)===screen)link.setAttribute('aria-current','location');
      else link.removeAttribute('aria-current');
    }
  }
  function target(){return document.getElementById(location.hash.slice(1)) || document.getElementById(screenForHash(location.hash));}
  function focusHeading(section){
    const heading=section?.querySelector('h1,h2') || section;
    if(heading){heading.tabIndex=-1;heading.focus({preventScroll:true});}
  }
  function route({initial=false,top=false,resize=false}={}){
    cancelAnimationFrame(frame);frame=0;
    const next=screenForHash(location.hash),changed=next!==active;
    active=next;
    for(const section of sections)section.hidden=mobile.matches&&!screenSections[next].includes(section.id);
    root.dataset.screen=next;mark(next);
    const isCase=location.hash.startsWith('#case-');
    const dialogOpen=!!document.querySelector('dialog[open]');
    if(mobile.matches){
      const explicit=['#approach','#contact','#skills','#experience'].includes(location.hash);
      if(explicit)target()?.scrollIntoView({block:'start',behavior:'instant'});
      else if(initial||changed||top||resize)window.scrollTo({top:top?0:(positions.get(next)||0),behavior:'instant'});
      if(!initial&&!isCase&&!dialogOpen&&(changed||top||explicit))focusHeading(explicit?target():document.getElementById(next));
    }else if(!isCase&&!dialogOpen&&(!initial||location.hash)){
      target()?.scrollIntoView({block:'start',behavior:'instant'});
      if(!initial)focusHeading(target());
    }
    syncInput();
    document.dispatchEvent(new Event('portfolio:screen'));
  }

  // Reveal a mobile destination before scrolling; plain anchors still work without JS.
  document.addEventListener('click',event=>{
    const link=event.target.closest('a[href^="#"]');
    if(!link||event.defaultPrevented||event.button!==0||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;
    if(link.hasAttribute('data-case')){positions.set(active,window.scrollY);return;}
    if(!known.has(link.hash.slice(1)))return;
    event.preventDefault();positions.set(active,window.scrollY);
    if(sheet.open)sheet.close();
    if(location.hash===link.hash)route({top:true});
    else{history.pushState({portfolioNavigation:true},'',link.hash);window.dispatchEvent(new HashChangeEvent('hashchange'));}
  });
  menu.addEventListener('click',()=>{if(!sheet.open)sheet.showModal();menu.setAttribute('aria-expanded','true');});
  sheet.addEventListener('close',()=>menu.setAttribute('aria-expanded','false'));
  sheet.addEventListener('click',event=>{if(event.target.closest('[data-resume]'))sheet.close();});
  window.addEventListener('hashchange',()=>route());
  mobile.addEventListener('change',()=>{
    if(!mobile.matches&&sheet.open)sheet.close();
    expanded.forEach(detail=>detail.open=!mobile.matches);route({resize:true});
  });
  expanded.forEach(detail=>detail.open=!mobile.matches);
  window.addEventListener('scroll',()=>{
    if(frame)return;
    frame=requestAnimationFrame(()=>{
      frame=0;
      if(mobile.matches){positions.set(active,window.scrollY);return;}
      const marker=Math.min(innerHeight*.3,220);let current='home';
      for(const section of sections)if(section.getBoundingClientRect().top<=marker)current=screenForHash('#'+section.id);
      mark(current);
    });
  },{passive:true});
  function syncInput(){root.classList.toggle('mobile-editing',!!document.activeElement?.matches('input,textarea,[contenteditable="true"]'));}
  document.addEventListener('focusin',syncInput);
  document.addEventListener('focusout',()=>queueMicrotask(syncInput));
  route({initial:true});
}
