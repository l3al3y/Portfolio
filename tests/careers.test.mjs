import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,stat} from 'node:fs/promises';
import {allowedDocumentPath} from '../lab/document-paths.js';
const root=new URL('../',import.meta.url);
const data=JSON.parse(await readFile(new URL('resume/profiles.json',root),'utf8'));
const expected={
 'ai-ml':['checkout','gesture','hermes'],
 software:['smc-crows','arcade','gesture'],
 'embedded-iot':['livestock','checkout','smc-crows']
};

test('each career route keeps the engineering foundation and links its matching evidence and resume',async()=>{
 const sitemap=await readFile(new URL('sitemap.xml',root),'utf8');
 for(const [id,ids] of Object.entries(expected)){
  const p=data.profiles.find(x=>x.id===id);
  const html=await readFile(new URL(`careers/${id}/index.html`,root),'utf8');
  assert.ok(html.includes(data.degree));
  assert.ok(html.includes('Graduation scheduled: 2 November 2026'));
  assert.ok(html.includes(`<base href="../../">`));
  assert.ok(html.includes(`rel="canonical" href="https://irfanfahmi.com/careers/${id}/"`));
  assert.ok(html.includes(`href="resume/${p.pdf}?v=careers20261022"`));
  assert.ok(html.includes(`data-document="resume/${p.pdf}"`));
  assert.deepEqual([...html.matchAll(/data-career-project="([^"]+)"/g)].map(x=>x[1]),ids);
  for(const project of ids)assert.ok(html.includes(`href="projects/${project}/"`));
  assert.ok(sitemap.includes(`https://irfanfahmi.com/careers/${id}/`));
 }
 const home=await readFile(new URL('index.html',root),'utf8');
 assert.ok(home.includes('id="career-paths"'));
 assert.ok(home.includes('Computer<br>engineering.'));
 assert.ok(home.includes('href="resume/">Choose a resume'));
});

test('all four public resumes have editable sources, original PDF previews and complete download destinations',async()=>{
 const manifest=JSON.parse(await readFile(new URL('assets/documents/manifest.json',root),'utf8'));
 const hub=await readFile(new URL('resume/index.html',root),'utf8');
 assert.equal(data.profiles.length,4);
 for(const p of data.profiles){
  const path='resume/'+p.pdf;
  assert.ok(allowedDocumentPath(path));
  const bytes=await readFile(new URL(path,root));
  assert.equal(bytes.subarray(0,4).toString(),'%PDF');
  assert.ok(bytes.length>10000);
  assert.equal(manifest[path].length,1);
  assert.ok((await stat(new URL(manifest[path][0].src,root))).size>0);
  const source=await readFile(new URL('resume/source/'+p.id+'.yaml',root),'utf8');
  assert.ok(source.includes('Professional Summary:'));
  assert.ok(source.includes('theme: engineeringresumes'));
  assert.ok(hub.includes(`download="${p.download_name}"`));
 }
});

test('document previews reject unlisted files, traversal and remote destinations',()=>{
 assert.ok(allowedDocumentPath('certificates/INOTEK_2025_Third_Place.pdf'));
 for(const bad of ['resume/other.pdf','resume/../private.pdf','certificates/../../secret.pdf','resume/resume.pdf?redirect=https://evil.example','https://evil.example/resume.pdf','resume/resume.pdf#x',null])assert.equal(allowedDocumentPath(bad),false);
});
