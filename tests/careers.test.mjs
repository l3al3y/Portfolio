import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,stat} from 'node:fs/promises';
import {allowedDocumentPath} from '../lab/document-paths.js';
import {safeAnswerLink} from '../lab/chat-render.js';
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
  assert.ok(html.includes(`href="resume/${p.pdf}?v=black20261022"`));
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
 for(const bad of ['resume/other.pdf','resume/../private.pdf','certificates/../../secret.pdf','resume/computer-engineering-20261022.pdf?redirect=https://evil.example','https://evil.example/resume.pdf','resume/computer-engineering-20261022.pdf#x',null])assert.equal(allowedDocumentPath(bad),false);
});

test('default resume buttons and assistant links avoid the previously cached PDF address',async()=>{
 const current='resume/'+data.profiles[0].pdf;
 assert.notEqual(current,'resume/resume.pdf');
 const routes=['index.html','about/index.html','credentials/index.html','contact/index.html','projects/index.html','ask/index.html','resume/index.html','careers/index.html',...Object.keys(expected).map(id=>`careers/${id}/index.html`)];
 for(const path of routes){
  const html=await readFile(new URL(path,root),'utf8');
  assert.ok(!html.includes('href="resume/resume.pdf"'),path+' still links the cached PDF');
  assert.ok(html.includes(`href="${current}"`),path+' has no current View resume link');
 }
 assert.equal(safeAnswerLink('https://irfanfahmi.com/resume/resume.pdf'),'/'+current);
 assert.equal(safeAnswerLink('https://irfanfahmi.com/'+current),'/'+current);
 const manifest=JSON.parse(await readFile(new URL('assets/documents/manifest.json',root),'utf8'));
 assert.ok(!manifest[current][0].src.endsWith('/resume-1.webp'));
});

test('community reach is the dated sum across all version counters and stays distinct from users',async()=>{
 const impact=JSON.parse(await readFile(new URL('resume/community-impact.json',root),'utf8'));
 assert.equal(impact.versions.length,9);
 assert.equal(impact.total_requests,impact.versions.reduce((sum,row)=>sum+row.requests,0));
 assert.ok(impact.versions.some(row=>row.label.includes('Setup')));
 assert.match(impact.definition,/retries/);
 const formatted=impact.total_requests.toLocaleString('en-MY');
 for(const id of ['computer-engineering','software','embedded-iot']){
  const source=await readFile(new URL('resume/source/'+id+'.yaml',root),'utf8');
  assert.ok(source.replaceAll(',','').includes(String(impact.total_requests)),id);
  assert.ok(source.includes('Contributed to the SMC Crows community'),id);
  const profile=data.profiles.find(p=>p.id===id);
  for(const alias of profile.legacy_pdfs)assert.equal(safeAnswerLink('https://irfanfahmi.com/resume/'+alias),'/resume/'+profile.pdf);
 }
 const casePage=await readFile(new URL('projects/smc-crows/index.html',root),'utf8');
 assert.ok(casePage.includes(formatted));
 assert.ok(casePage.includes('22 October 2026'));
 assert.ok(casePage.includes('completed downloads, installations and unique players are not measured'));
});
