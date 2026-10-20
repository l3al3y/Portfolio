import { projectArt } from './project-art.js?v=bem20261021-final';
export const escapeHtml = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const external = url => /^https:\/\//.test(url) ? 'target="_blank" rel="noopener noreferrer"' : '';
export const media = {
  'smc-crows': { caption:'Illustration · Android release engineering', filter:'systems' },
  checkout: { caption:'Illustration · vision + barcode verification', filter:'vision' },
  hermes: { src:'assets/thumb-hermes.png', alt:'Archived Hermes operations dashboard', caption:'Archived dashboard capture · not live telemetry', filter:'agents' },
  gesture: { src:'assets/manga/gesture_pageup.jpg', alt:'Irfan demonstrating a hand gesture for the touchless reader', caption:'Original gesture training image', filter:'vision' },
  livestock: { caption:'Illustration · load-cell measurement', filter:'embedded' },
  arcade: { src:'assets/thumb-arcade.png', alt:'Mini Arcade interface with its browser games', caption:'Original Mini Arcade interface capture', filter:'play' }
};
export function projectMedia(p){const m=media[p.id];return m.src?`<img src="${m.src}" alt="${escapeHtml(m.alt)}" loading="lazy" decoding="async">`:projectArt(p.id);}

export function filterProjects(projects,filter='all'){return projects.filter(p=>filter==='all'||media[p.id].filter===filter||(filter==='systems'&&['agents','play'].includes(media[p.id].filter)));}
export function projectRow(p){return `<details class="project-row" id="project-${p.id}"><summary><span class="project-index">${p.number}</span><span class="project-heading"><span class="project-meta">${escapeHtml(p.category)}</span><strong>${escapeHtml(p.title)}</strong><span class="project-one-line">${escapeHtml(p.summary)}</span></span><span class="project-signal">${escapeHtml(p.result)}<small>${escapeHtml(p.resultNote)}</small></span><span class="detail-indicator" aria-hidden="true">＋</span></summary><div class="project-expanded"><div><div class="tags">${p.stack.map(t=>`<span>${escapeHtml(t)}</span>`).join('')}</div><h3>What I built</h3><p>${escapeHtml(p.implementation)}</p><h3>Result & evidence</h3><p>${escapeHtml(p.outcome)}</p><div class="inline-links"><a class="button" href="projects/${p.id}/">Full case study ↗</a>${p.links.slice(0,1).map(l=>`<a class="text-button" href="${l.url}" ${external(l.url)}>${escapeHtml(l.label)} ↗</a>`).join('')}</div></div><figure><div>${projectMedia(p)}</div><figcaption>${media[p.id].caption}</figcaption></figure></div></details>`;}
