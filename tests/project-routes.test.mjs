import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {projects} from '../lab/content.js';
import {filterProjects} from '../lab/project-view.js';
const root=new URL('../',import.meta.url);
test('six selected projects remain present in initial HTML without JavaScript',async()=>{
 for(const name of ['index.html','projects/index.html']){
  const html=await readFile(new URL(name,root),'utf8');
  const rows=[...html.matchAll(/class="project-row" id="project-([^"]+)"/g)].map(m=>m[1]);
  assert.deepEqual(rows,projects.map(p=>p.id));
  assert.ok(html.includes(`Showing ${rows.length} of ${projects.length} projects.`));
  assert.ok(html.includes('id="work-heading"'));
 }
});
test('filters account for every project with correct memberships',()=>{
 assert.equal(filterProjects(projects).length,projects.length);
 assert.deepEqual(filterProjects(projects,'vision').map(p=>p.id),['checkout','gesture']);
 assert.deepEqual(filterProjects(projects,'systems').map(p=>p.id),['smc-crows','hermes','arcade']);
 assert.deepEqual(filterProjects(projects,'embedded').map(p=>p.id),['livestock']);
 assert.deepEqual(['vision','systems','embedded'].flatMap(f=>filterProjects(projects,f).map(p=>p.id)).sort(),projects.map(p=>p.id).sort());
});
test('every selected project has a directly loadable case page and sitemap entry',async()=>{
 const sitemap=await readFile(new URL('sitemap.xml',root),'utf8');
 for(const p of projects){
  const html=await readFile(new URL(`projects/${p.id}/index.html`,root),'utf8');
  assert.ok(html.includes(`<title>${p.title} — Irfan Fahmi</title>`));
  assert.ok(html.includes('<base href="../../">'));
  assert.ok(html.includes(`rel="canonical" href="https://irfanfahmi.com/projects/${p.id}/"`));
  for(const k of ['problem','implementation','constraints','outcome'])assert.ok(html.includes(p[k].replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll("'",'&#39;')));
  assert.ok(html.includes('href="projects/"'));
  assert.ok(sitemap.includes(`https://irfanfahmi.com/projects/${p.id}/`));
 }
 assert.equal(projects[0].links[0].url,'smc/');
});
