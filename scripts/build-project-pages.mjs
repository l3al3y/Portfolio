// All project rows and standalone routes share the same data and HTML renderer.
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {projects} from '../lab/content.js';
import {projectRow,projectMedia,media,escapeHtml as esc} from '../lab/project-view.js';
const root=new URL('../',import.meta.url);
for(const name of ['index.html','projects/index.html']){
 let html=await readFile(new URL(name,root),'utf8');
 const list=`<!-- project-list:start --><div id="projects-grid" class="projects-grid">${projects.map(projectRow).join('')}</div><!-- project-list:end -->`;
 html=html.includes('<!-- project-list:start -->')?html.replace(/<!-- project-list:start -->[\s\S]*?<!-- project-list:end -->/,list):html.replace('<div id="projects-grid" class="projects-grid"></div>',list);
 html=html.replace(/<p id="project-status"[^>]*>.*?<\/p>/,'<p id="project-status" class="project-status" role="status">Showing '+projects.length+' of '+projects.length+' projects.</p>');
 html=html.replace(/All work <span[^>]*>\d+<\/span>/,`All work <span data-project-total>${String(projects.length).padStart(2,'0')}</span>`);
 html=html.replace('Six projects across','Projects across').replace(/(<p class="eyebrow">01 \/ SELECTED WORK<\/p>)<h([12])(?! id)/,'$1<h$2 id="work-heading"');
 html=html.replace(/href="#case-checkout" data-case="checkout"/,'href="projects/checkout/"');
 html=html.replace(/<noscript>.*?<\/noscript>/,'');
 await writeFile(new URL(name,root),html);
}
const shell=await readFile(new URL('projects/index.html',root),'utf8');
const links=items=>items.map(l=>`<a class="button" href="${esc(l.url)}"${l.url.startsWith('https:')?' target="_blank" rel="noopener noreferrer"':''}>${esc(l.label)} ↗</a>`).join('');
for(const [i,p] of projects.entries()){
 const next=projects[(i+1)%projects.length];
 const article=`<main id="main-content"><article class="section wrap case-page"><nav class="case-breadcrumb" aria-label="Breadcrumb"><a href="projects/">← All projects</a><span>/ ${esc(p.title)}</span></nav><p class="eyebrow">${esc(p.category)}</p><h1>${esc(p.title)}</h1><p class="case-lead">${esc(p.summary)}</p><div class="tags">${p.stack.map(t=>`<span>${esc(t)}</span>`).join('')}</div><figure class="case-media"><div>${projectMedia(p)}</div><figcaption>${media[p.id].caption}</figcaption></figure><div class="case-result"><strong>${esc(p.result)}</strong><small>${esc(p.resultNote)}</small></div><div class="case-sections">${['problem','implementation','constraints','outcome'].map(k=>`<section><h2>${({problem:'The problem',implementation:'What I built',constraints:'Constraints & lessons',outcome:'Result & evidence'})[k]}</h2><p>${esc(p[k])}</p></section>`).join('')}</div><div class="inline-links">${links(p.links)}</div><div class="case-sources"><p>SOURCE NOTES</p>${links(p.sources)}</div><nav class="case-next" aria-label="More projects"><a href="projects/">← All ${projects.length} projects</a><a href="projects/${next.id}/">Next: ${esc(next.title)} →</a></nav></article>${shell.match(/<section id="contact"[\s\S]*?<\/section>/)[0]}</main>`;
 let html=shell.replace('<base href="../">','<base href="../../">').replace(/<title>.*?<\/title>/,`<title>${esc(p.title)} — Irfan Fahmi</title>`).replaceAll('https://irfanfahmi.com/projects/',`https://irfanfahmi.com/projects/${p.id}/`).replace(/content="Computer engineering portfolio[^\"]*"/g,`content="${esc(p.summary)}"`).replace(/<main id="main-content">[\s\S]*?<\/main>/,article).replace('href="projects/#main-content"',`href="projects/${p.id}/#main-content"`).replace('content="Selected Work — Irfan Fahmi"',`content="${esc(p.title)} — Irfan Fahmi"`);
 await mkdir(new URL(`projects/${p.id}/`,root),{recursive:true});
 await writeFile(new URL(`projects/${p.id}/index.html`,root),html);
}
let sitemap=await readFile(new URL('sitemap.xml',root),'utf8');
for(const p of projects)if(!sitemap.includes(`/projects/${p.id}/`))sitemap=sitemap.replace('</urlset>',`  <url><loc>https://irfanfahmi.com/projects/${p.id}/</loc><lastmod>2026-10-21</lastmod><changefreq>monthly</changefreq><priority>0.6</priority></url>\n</urlset>`);
await writeFile(new URL('sitemap.xml',root),sitemap);
console.log('Built',projects.length,'static project rows and case-study routes.');
