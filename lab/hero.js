// Real source assets. The showcase changes only when the visitor selects a story.
const stories = [
  {id:'hermes',category:'MULTI-AGENT SYSTEMS',title:'Many models.<br>One conversation.',name:'Hermes',src:'assets/thumb-hermes.png',alt:'Archived Hermes operations dashboard',caption:'Archived dashboard · not live data'},
  {id:'gesture',category:'HUMAN INTERACTION',title:'A gesture.<br>A page turned.',name:'Gesture recognition',src:'assets/manga/gesture_pageup.jpg',alt:'Irfan demonstrating the page-up hand gesture for IrfanLLM',caption:'Original gesture training image'},
  {id:'arcade',category:'INTERACTIVE SOFTWARE',title:'A little logic.<br>A lot of play.',name:'Mini Arcade',src:'assets/thumb-arcade.png',alt:'Mini Arcade browser games interface',caption:'Original application capture'}
];

export function initHero(){
  const tabs=[...document.querySelectorAll('[data-story]')],panel=document.querySelector('#hero-story');
  let selected=0;
  function select(index,focus=false){
    selected=index;const s=stories[index];
    tabs.forEach((tab,i)=>{tab.setAttribute('aria-selected',String(i===index));tab.tabIndex=i===index?0:-1;if(focus&&i===index)tab.focus();});
    panel.setAttribute('aria-labelledby',`story-${s.id}`);
    panel.innerHTML=`<a class="story-media ${s.id==='gesture'?'':'story-interface'}" href="#case-${s.id}" data-case="${s.id}" aria-label="Read ${s.name} case study"><img src="${s.src}" width="${s.id==='gesture'?480:900}" height="${s.id==='gesture'?480:400}" alt="${s.alt}"><span class="story-label">${s.category}</span><span class="story-title">${s.title}</span><span class="story-arrow" aria-hidden="true">↗</span></a><div class="story-caption"><span>${s.name}</span><small>${s.caption}</small></div>`;
    document.querySelector('#story-number').textContent=`0${index+1} / 03`;
  }
  tabs.forEach((tab,index)=>tab.addEventListener('click',()=>select(index)));
  document.querySelector('.story-tabs').addEventListener('keydown',e=>{
    const next=e.key==='ArrowRight'?(selected+1)%3:e.key==='ArrowLeft'?(selected+2)%3:e.key==='Home'?0:e.key==='End'?2:null;
    if(next!==null){e.preventDefault();select(next,true);}
  });
}
