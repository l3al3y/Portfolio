const readPreference=()=>{try{return localStorage.getItem('lab-motion');}catch{return null;}};

// One preference controls the infinite marquee and decorative transitions.
// System reduced motion always wins. Content and navigation never wait for motion.
export function initMotion(){
  const root=document.documentElement,preference=matchMedia('(prefers-reduced-motion: reduce)');
  const toggle=document.querySelector('#motion-toggle'),pause=document.querySelector('#marquee-toggle'),marquee=document.querySelector('.hero-marquee');
  let enabled=!preference.matches&&readPreference()!=='off',paused=false;
  function sync(){
    root.classList.toggle('no-motion',!enabled);root.classList.toggle('motion-ready',enabled);
    toggle.setAttribute('aria-pressed',String(enabled));toggle.querySelector('span').textContent=enabled?'on':'off';
    toggle.title=preference.matches?'Respecting your system reduced-motion preference':'Toggle animation';
    const stopped=paused||!enabled||document.hidden;
    marquee.dataset.paused=String(stopped);pause.setAttribute('aria-pressed',String(stopped));
    pause.textContent=stopped?'▷':'Ⅱ';pause.disabled=!enabled;
    pause.setAttribute('aria-label',!enabled?'Marquee paused because motion is off':paused?'Resume infinite marquee':'Pause infinite marquee');
    pause.title=!enabled?'Motion is off':paused?'Resume marquee':'Pause marquee';
  }
  toggle.addEventListener('click',()=>{if(preference.matches){enabled=false;sync();return;}enabled=!enabled;try{localStorage.setItem('lab-motion',enabled?'on':'off');}catch{}sync();});
  pause.addEventListener('click',()=>{if(!enabled)return;paused=!paused;sync();});
  preference.addEventListener('change',()=>{enabled=!preference.matches&&readPreference()!=='off';sync();});
  document.addEventListener('visibilitychange',sync);
  if('IntersectionObserver' in window){
    const observer=new IntersectionObserver(entries=>{for(const entry of entries){if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}}},{threshold:.08});
    function observe(){document.querySelectorAll('[data-reveal]:not(.is-visible)').forEach(el=>observer.observe(el));}
    document.addEventListener('portfolio:content',observe);observe();
  }
  sync();
}
