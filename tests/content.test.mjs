import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,stat} from 'node:fs/promises';
import {projects} from '../lab/content.js';
const root=new URL('../',import.meta.url);
test('every registry record resolves to an existing PDF',async()=>{
  const records=JSON.parse(await readFile(new URL('certificates/registry.json',root),'utf8'));
  assert.equal(records.length,26);assert.equal(new Set(records.map(c=>c.id)).size,records.length);
  for(const record of records){assert.match(record.filename,/^[\w.-]+\.pdf$/);const data=await readFile(new URL('certificates/'+record.filename,root));assert.equal(data.subarray(0,4).toString(),'%PDF');}
});
test('case studies have required substance and preserved local destinations',async()=>{
  assert.equal(projects.length,5);
  for(const p of projects){for(const key of ['problem','implementation','constraints','outcome'])assert.ok(p[key].length>80);
    if(p.image)assert.ok((await stat(new URL(p.image,root))).size>0);
    for(const link of [...p.links,...p.sources]){if(!link.url.startsWith('https:'))assert.ok((await stat(new URL(link.url,root))).size>0);}
  }
  assert.match(projects.find(p=>p.id==='hermes').outcome,/open and unmerged/);
  assert.match(projects.find(p=>p.id==='gesture').outcome,/not a measured accuracy/);
});
test('all documents have real rendered preview pages',async()=>{
  const manifest=JSON.parse(await readFile(new URL('assets/documents/manifest.json',root),'utf8'));
  assert.equal(Object.keys(manifest).length,27);
  for(const [pdf,pages] of Object.entries(manifest)){
    assert.ok((await stat(new URL(pdf,root))).size>0);
    for(const page of pages){assert.ok(page.width>500);assert.ok(page.height>500);assert.ok((await stat(new URL(page.src,root))).size>0);}
  }
});
