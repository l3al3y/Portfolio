import test from 'node:test';
import assert from 'node:assert/strict';
import {initMotion} from '../lab/portfolio-motion.js';

function fixture(reduced){
  const keys=['document','window','matchMedia','localStorage'];
  const previous=Object.fromEntries(keys.map(k=>[k,globalThis[k]]));
  class Element{
    constructor(){this.attrs={};this.dataset={};this.events={};this.classes=new Set();this.classList={toggle:(name,on)=>on?this.classes.add(name):this.classes.delete(name)};}
    setAttribute(name,value){this.attrs[name]=value;}
    addEventListener(name,callback){this.events[name]=callback;}
    querySelector(){return this.span??=new Element();}
  }
  const root=new Element(),toggle=new Element(),pause=new Element(),marquee=new Element();
  const documentEvents={},preference={matches:reduced,addEventListener(name,callback){this.change=callback;}};
  let stored='on';
  globalThis.document={documentElement:root,hidden:false,querySelector:s=>({'#motion-toggle':toggle,'#marquee-toggle':pause,'.hero-marquee':marquee})[s],addEventListener:(name,callback)=>{documentEvents[name]=callback;}};
  globalThis.window={};globalThis.matchMedia=()=>preference;
  globalThis.localStorage={getItem:()=>stored,setItem:(key,value)=>{stored=value;}};
  return {root,toggle,pause,marquee,preference,documentEvents,restore(){for(const k of keys){if(previous[k]===undefined)delete globalThis[k];else globalThis[k]=previous[k];}}};
}

test('system reduced motion overrides a saved-on choice and cannot restart the marquee',()=>{
  const f=fixture(true);
  try{
    initMotion();assert.equal(f.toggle.attrs['aria-pressed'],'false');assert.ok(f.root.classes.has('no-motion'));
    assert.equal(f.marquee.dataset.paused,'true');assert.equal(f.pause.disabled,true);
    f.toggle.events.click();f.pause.events.click();assert.equal(f.marquee.dataset.paused,'true');
    f.preference.matches=false;f.preference.change();assert.equal(f.toggle.attrs['aria-pressed'],'true');assert.equal(f.pause.disabled,false);
  }finally{f.restore();}
});

test('manual marquee pause survives motion toggles and backgrounding does not restart it',()=>{
  const f=fixture(false);
  try{
    initMotion();assert.equal(f.marquee.dataset.paused,'false');
    f.pause.events.click();assert.equal(f.pause.attrs['aria-label'],'Resume infinite marquee');
    f.toggle.events.click();f.toggle.events.click();assert.equal(f.marquee.dataset.paused,'true');
    document.hidden=true;f.documentEvents.visibilitychange();document.hidden=false;f.documentEvents.visibilitychange();assert.equal(f.marquee.dataset.paused,'true');
    f.pause.events.click();assert.equal(f.marquee.dataset.paused,'false');
    document.hidden=true;f.documentEvents.visibilitychange();assert.equal(f.marquee.dataset.paused,'true');
    document.hidden=false;f.documentEvents.visibilitychange();assert.equal(f.marquee.dataset.paused,'false');
  }finally{f.restore();}
});
