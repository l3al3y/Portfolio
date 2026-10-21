import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root=path.resolve(fileURLToPath(new URL('../',import.meta.url)));
const mime={'.vtt':'text/vtt; charset=utf-8','.txt':'text/plain; charset=utf-8','.mp4':'video/mp4','.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.json':'application/json','.pdf':'application/pdf','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.woff2':'font/woff2','.jpg':'image/jpeg','.zip':'application/zip','.ico':'image/x-icon','.xml':'application/xml'};
http.createServer(async(req,res)=>{
  try{
    let pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
    if(pathname.startsWith('/__portfolio-chat/')){
      const target=pathname.slice('/__portfolio-chat'.length);
      if(!['/health','/v1/chat/completions'].includes(target)||!['GET','POST','OPTIONS'].includes(req.method)){res.writeHead(404);res.end();return;}
      const chunks=[];let size=0;for await(const chunk of req){size+=chunk.length;if(size>24000){res.writeHead(413);res.end();return;}chunks.push(chunk);}
      const response=await fetch('https://irfan-portfolio-chat.cabalme4.workers.dev'+target,{method:req.method,headers:{Origin:'https://irfanfahmi.com','Content-Type':'application/json'},body:req.method==='POST'?Buffer.concat(chunks):undefined,signal:AbortSignal.timeout(60000)});
      res.writeHead(response.status,{'Content-Type':response.headers.get('Content-Type')||'application/json','Cache-Control':'no-store'});
      if(response.body)for await(const chunk of response.body)res.write(chunk);res.end();return;
    }
    if(!['GET','HEAD'].includes(req.method)){res.writeHead(405);res.end();return;}
    if(pathname==='/smc/api/apk-stat'){const upstream=await fetch('https://irfanfahmi.com/smc/api/apk-stat',{signal:AbortSignal.timeout(8000),cache:'no-store'});res.writeHead(upstream.status,{'Content-Type':'application/json','Cache-Control':'no-store'});res.end(await upstream.text());return;}
    if(pathname==='/')pathname='/index.html';
    const file=path.resolve(root,'.'+pathname);
    if(!file.startsWith(root+path.sep)||pathname.split('/').some(p=>p.startsWith('.'))){res.writeHead(403);res.end();return;}
    let targetFile = file;
    let info = await stat(targetFile).catch(()=>null);
    if(info && info.isDirectory()){
      targetFile = path.join(targetFile, 'index.html');
      info = await stat(targetFile).catch(()=>null);
    }
    if(!info || !info.isFile())throw new Error();
    res.writeHead(200,{'Content-Type':mime[path.extname(targetFile)]||'application/octet-stream','Content-Length':info.size,'Cache-Control':'no-store'});
    if(req.method==='HEAD')res.end();else res.end(await readFile(targetFile));
  }catch{res.writeHead(404,{'Content-Type':'text/plain'});res.end('Not found');}
}).listen(8000,'127.0.0.1',()=>console.log('Irfan Fahmi portfolio preview: http://127.0.0.1:8000'));
