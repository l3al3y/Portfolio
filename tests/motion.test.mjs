import test from 'node:test';
import assert from 'node:assert/strict';
import { initMotion } from '../lab/motion.js';

test('system reduced-motion preference overrides stored-on and keeps manual layers functional',()=>{
  const globals=['document','window','matchMedia','localStorage','requestAnimationFrame','cancelAnimationFrame','innerWidth'];
  const previous=Object.fromEntries(globals.map(k=>[k,globalThis[k]]));
  class Element{
    constructor(){this.attrs={};this.dataset={};this.events={};this.classes=new Set();this.classList={toggle:(c,on)=>{if(on)this.classes.add(c);else this.classes.delete(c);}};}
    setAttribute(k,v){this.attrs[k]=v;}
    addEventListener(k,f){this.events[k]=f;}
    querySelector(){return this.span??=new Element();}
    querySelectorAll(){return this.children||[];}
    focus(){}
  }
  const root=new Element(),nodes={};
  for(const id of ['system-visual','motion-toggle','assembly-toggle','separation','scroll-mode','layer-detail','layer-tabs'])nodes['#'+id]=new Element();
  nodes['#system-visual'].children=Array.from({length:4},(_,i)=>{const e=new Element();e.dataset.layer=String(i);return e;});
  nodes['#layer-tabs'].children=Array.from({length:4},()=>new Element());
  let frameRequests=0;
  try{
    globalThis.document={documentElement:root,querySelector:s=>nodes[s],addEventListener(){}};
    globalThis.window={addEventListener(){}};
    globalThis.matchMedia=()=>({matches:true,addEventListener(){}});
    globalThis.localStorage={getItem:()=> 'on',setItem(){}};
    globalThis.requestAnimationFrame=()=>{frameRequests++;return 1;};
    globalThis.cancelAnimationFrame=()=>{};globalThis.innerWidth=1280;
    initMotion();
    assert.equal(nodes['#motion-toggle'].attrs['aria-pressed'],'false');
    assert.ok(root.classes.has('no-motion'));assert.equal(nodes['#scroll-mode'].disabled,true);
    nodes['#motion-toggle'].events.click();assert.equal(nodes['#motion-toggle'].attrs['aria-pressed'],'false');
    const before=nodes['#system-visual'].children[0].attrs.transform;
    nodes['#assembly-toggle'].events.click();
    assert.equal(nodes['#separation'].value,'0');assert.notEqual(nodes['#system-visual'].children[0].attrs.transform,before);
    assert.equal(frameRequests,0);
    nodes['#layer-tabs'].events.keydown({key:'End',preventDefault(){}});
    assert.equal(nodes['#layer-tabs'].children[3].attrs['aria-selected'],'true');
  }finally{for(const key of globals){if(previous[key]===undefined)delete globalThis[key];else globalThis[key]=previous[key];}}
});
