import { layers } from './content.js';

const readPreference = () => { try { return localStorage.getItem('lab-motion'); } catch { return null; } };
export function initMotion() {
  const root = document.documentElement;
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  let enabled = !preference.matches && readPreference() !== 'off';
  let manual = false, target = 1, current = 1, selected = 0, frame = 0;
  const visual = document.querySelector('#system-visual');
  const toggle = document.querySelector('#motion-toggle');
  const assembly = document.querySelector('#assembly-toggle');
  const range = document.querySelector('#separation');
  const follow = document.querySelector('#scroll-mode');
  const detail = document.querySelector('#layer-detail');
  const tablist = document.querySelector('#layer-tabs');
  const circuitPaths = [
    '<path d="M170 260l60-34 55 32 60-34 80 46M195 307l75-44 45 26 72-42"/><circle cx="230" cy="226" r="6"/><circle cx="425" cy="270" r="5"/><path d="M240 305l45-26 70 40"/>',
    '<path d="M185 257l82-47 73 42 75-43M175 286l70-40 103 60 70-40M230 328l80-47 78 45"/><circle cx="267" cy="210" r="5"/><circle cx="388" cy="326" r="5"/>',
    '<path d="M190 267l90-52 55 32 57-33M207 306l90-52 83 48M250 331l45-26 48 28"/><circle cx="280" cy="215" r="6"/><circle cx="380" cy="302" r="6"/>',
    '<path d="M185 263l57-33 92 53 71-41M195 296l50-28 60 35 63-37M253 329l40-23 51 29"/><circle cx="242" cy="230" r="5"/><circle cx="405" cy="242" r="5"/>'
  ];
  visual.innerHTML = `<svg viewBox="0 0 600 530" xmlns="http://www.w3.org/2000/svg"><defs><pattern id="technical-grid" width="30" height="30" patternUnits="userSpaceOnUse"><path d="M30 0H0V30" fill="none" stroke="currentColor" opacity=".045"/></pattern></defs><rect width="600" height="530" fill="url(#technical-grid)"/><path class="axis" d="M300 25V500M90 265H540M150 150L470 360M470 150L150 360"/>${[3,2,1,0].map(i => `<g class="layer ${i === 0 ? 'selected' : ''}" data-layer="${i}"><path class="plate-edge" d="M130 264l170 98 170-98v12L300 374l-170-98z"/><path class="plate-face" d="M130 264l170-98 170 98-170 98z"/><g class="trace ${i%2 ? 'lime-trace' : ''}">${circuitPaths[i]}</g><path class="core" d="M267 265l33-19 33 19-33 19z"/><path class="trace" d="M282 264l18-10 18 10-18 10z"/><circle class="node" cx="160" cy="264" r="3"/><circle class="node" cx="300" cy="184" r="3"/><circle class="node" cx="440" cy="264" r="3"/><circle class="node" cx="300" cy="344" r="3"/><path class="axis" d="M468 264h42"/><text class="layer-label" x="519" y="268">0${i+1}</text></g>`).join('')}<text class="layer-label" x="20" y="490" style="font-size:9px">SENSE / INFER / DECIDE / RESPOND</text><text class="layer-label" x="475" y="490" style="font-size:9px">SYS—IF.01</text></svg>`;
  const groups = [...visual.querySelectorAll('.layer')];
  tablist.innerHTML = layers.map((l,i) => `<button id="layer-${i}" role="tab" aria-controls="layer-detail" aria-selected="${i===0}" tabindex="${i===0 ? 0 : -1}" data-layer-index="${i}"><small>0${i+1}</small>${l.name}</button>`).join('');
  function select(index, focus = false) {
    selected = index;
    const l = layers[index];
    tablist.querySelectorAll('button').forEach((b,i) => { b.setAttribute('aria-selected',String(i===index)); b.tabIndex = i===index ? 0 : -1; if (focus && i===index) b.focus(); });
    detail.setAttribute('aria-labelledby', `layer-${index}`);
    detail.innerHTML = `<h3>${l.subtitle}</h3><p>${l.text}</p>`;
    groups.forEach(g => g.classList.toggle('selected', Number(g.dataset.layer)===selected));
  }
  tablist.addEventListener('click', e => { const b=e.target.closest('button'); if(b) select(Number(b.dataset.layerIndex)); });
  visual.addEventListener('click',e=>{const layer=e.target.closest('[data-layer]');if(layer)select(Number(layer.dataset.layer));});
  tablist.addEventListener('keydown', e => {
    let next;
    if (e.key==='ArrowRight') next=(selected+1)%4;
    if (e.key==='ArrowLeft') next=(selected+3)%4;
    if (e.key==='Home') next=0;
    if (e.key==='End') next=3;
    if(next!==undefined){e.preventDefault();select(next,true);}
  });
  function paint() {
    groups.forEach(g => { const i=Number(g.dataset.layer); const y=(i-1.5)*(16+current*70); g.setAttribute('transform',`translate(${(i-1.5)*current*9} ${y})`); });
  }
  function tick() {
    frame=0;
    current = enabled ? current+(target-current)*.16 : target;
    if(Math.abs(current-target)<.001) current=target;
    paint();
    if(current!==target) frame=requestAnimationFrame(tick);
  }
  function setTarget(value) {
    target=Math.max(0,Math.min(1,value));
    range.value=String(Math.round(target*100));
    assembly.setAttribute('aria-pressed',String(target<.5));
    assembly.textContent=target<.5?'⊟ Separate layers':'⊞ Assemble system';
    if(!frame) tick();
  }
  function syncScroll() {
    if(manual || !enabled || innerWidth<=850) return;
    const hero=document.querySelector('#home');
    const progress=Math.max(0,Math.min(1,-hero.getBoundingClientRect().top/(hero.offsetHeight*.7)));
    setTarget(1-progress);
  }
  function applyPreference() {
    root.classList.toggle('no-motion',!enabled);
    toggle.setAttribute('aria-pressed',String(enabled));
    toggle.querySelector('span').textContent=enabled?'on':'off';
    toggle.title=preference.matches?'Reduced motion is enabled in your system settings':'Toggle animation';
    follow.disabled=!enabled;
    if(!enabled){cancelAnimationFrame(frame);frame=0;current=target;paint();}
  }
  toggle.addEventListener('click',()=>{
    if(preference.matches){enabled=false;applyPreference();return;}
    enabled=!enabled;try{localStorage.setItem('lab-motion',enabled?'on':'off');}catch{}
    applyPreference();
  });
  preference.addEventListener('change',()=>{enabled=!preference.matches && readPreference()!=='off';applyPreference();});
  assembly.addEventListener('click',()=>{manual=true;setTarget(target<.5?1:0);});
  range.addEventListener('input',()=>{manual=true;setTarget(Number(range.value)/100);});
  follow.addEventListener('click',()=>{manual=false;setTarget(1);syncScroll();});
  let scrollFrame=0;
  window.addEventListener('scroll',()=>{if(!enabled||manual||innerWidth<=850)return;if(!scrollFrame)scrollFrame=requestAnimationFrame(()=>{scrollFrame=0;syncScroll();});},{passive:true});
  window.addEventListener('resize',syncScroll,{passive:true});
  document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0;}else if(current!==target)tick();});
  select(0);paint();applyPreference();
}
