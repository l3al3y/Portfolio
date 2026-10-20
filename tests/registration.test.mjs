import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,access} from 'node:fs/promises';
import {professionalRegistrationContext} from '../lab/content.js';
const root=new URL('../',import.meta.url);
test('issued BEM registration and pending MBOT stay distinct across public entry points',async()=>{
 for(const name of ['index.html','about/index.html']){
  const html=await readFile(new URL(name,root),'utf8');
  assert.ok(html.includes('BEM Graduate Engineer · Computer Engineering'));
  assert.ok(html.includes('Registered · Approved 15 October 2026.'));
  assert.ok(html.includes('MBOT Graduate Technologist (IT)</strong> · Application submitted; certificate pending.'));
  assert.ok(html.includes('href="https://engineer.org.my/public/Engineers/Index/325542"'));
  assert.ok(html.includes('Verify BEM registration'));
  assert.ok(!html.includes('BEM_Graduate_Engineer_Redacted.pdf'));
  assert.ok(html.includes('View resume'));
  assert.ok(!html.includes('résumé'));
 }
 assert.match(professionalRegistrationContext,/registered Graduate Engineer in the Computer branch, approved 15 October 2026/);
 assert.match(professionalRegistrationContext,/MBOT:.*still pending/);
 assert.doesNotMatch(professionalRegistrationContext,/Both certificates are pending/);
});
test('BEM certificate and preview are not included in the public document catalog',async()=>{
 const registry=JSON.parse(await readFile(new URL('certificates/registry.json',root),'utf8'));
 assert.ok(!registry.some(x=>x.filename.includes('BEM_Graduate_Engineer')));
 const manifest=JSON.parse(await readFile(new URL('assets/documents/manifest.json',root),'utf8'));
 assert.ok(!Object.keys(manifest).some(x=>x.includes('BEM_Graduate_Engineer')));
 await assert.rejects(access(new URL('certificates/BEM_Graduate_Engineer_Redacted.pdf',root)));
 await assert.rejects(access(new URL('assets/documents/BEM_Graduate_Engineer_Redacted-1.webp',root)));
});
