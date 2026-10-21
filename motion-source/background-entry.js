import {createNetwork,networkMarkup,seconds,fps} from './network.js';

const root=document.querySelector('.portfolio-atmosphere');
const toggle=document.querySelector('#background-toggle');
if(root&&toggle){
 root.insertAdjacentHTML('beforeend',networkMarkup);
 const video=root.querySelector('video');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const saveData=navigator.connection?.saveData===true;
 const {adapter,timeline}=createNetwork(root);
 // GSAP is seeked by Hyperframes; no independent animation ticker is needed.
 timeline.pause();
 let enabled=true,raf=0,origin=0,elapsed=0,playing=false,lastFrame=-1;
 try{enabled=localStorage.getItem('portfolio-background')!=='off';}catch{}
 const canMove=()=>enabled&&!reduced.matches&&!saveData;
 function tick(now){
  if(!playing)return;
  const frame=Math.floor(((elapsed+now-origin)/1000%seconds)*fps);
  if(frame!==lastFrame){adapter.seekFrame(frame);lastFrame=frame;}
  raf=requestAnimationFrame(tick);
 }
 function sync(){
  const moving=canMove(),run=moving&&!document.hidden;
  toggle.disabled=reduced.matches||saveData;
  toggle.setAttribute('aria-pressed',String(moving));
  toggle.setAttribute('aria-label',reduced.matches?'Background motion reduced by system preference':saveData?'Background motion off to save data':moving?'Pause background animation':'Play background animation');
  toggle.querySelector('.motion-label').textContent=moving?'Motion on':'Motion off';
  toggle.querySelector('.motion-icon').textContent=moving?'Ⅱ':'▷';
  root.dataset.motion=run?'playing':'paused';
  if(run&&!playing){
   playing=true;origin=performance.now();
   if(!video.getAttribute('src')){video.src=video.dataset.src;video.load();}
   video.play().catch(()=>{});
   raf=requestAnimationFrame(tick);
  }else if(!run&&playing){
   elapsed+=performance.now()-origin;playing=false;cancelAnimationFrame(raf);video.pause();
  }
 }
 toggle.addEventListener('click',()=>{enabled=!enabled;try{localStorage.setItem('portfolio-background',enabled?'on':'off');}catch{}sync();});
 reduced.addEventListener('change',sync);
 document.addEventListener('visibilitychange',sync);
 // Feedback follows actual interaction without intercepting links or form controls.
 document.addEventListener('pointerdown',e=>{
  if(!canMove()||!e.target.closest('a,button,summary'))return;
  const ring=document.createElement('span');ring.className='interaction-ring';
  ring.style.left=e.clientX+'px';ring.style.top=e.clientY+'px';root.append(ring);
  ring.addEventListener('animationend',()=>ring.remove(),{once:true});
  setTimeout(()=>ring.remove(),1000);
 },{passive:true});
 sync();
}
