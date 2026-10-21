import {renderMediaOnWeb,renderStillOnWeb} from '@remotion/web-renderer';
import {McpServer} from '@modelcontextprotocol/sdk/server/mcp.js';
import {Client} from '@modelcontextprotocol/sdk/client/index.js';
import {InMemoryTransport} from '@modelcontextprotocol/sdk/inMemory.js';
import {Ambient} from './ambient.jsx';
const composition={component:Ambient,id:'PortfolioAtmosphere',width:960,height:600,fps:24,durationInFrames:384};
const status=document.querySelector('#status');
async function save(name,blob){const r=await fetch('/save/'+name,{method:'POST',body:blob});if(!r.ok)throw Error('Save failed');}
const server=new McpServer({name:'portfolio-atmosphere',version:'1.0.0'});
server.registerTool('render_portfolio_atmosphere',{description:'Render the silent sixteen-second seamless ambient background for the portfolio.'},async()=>{
 const still=await renderStillOnWeb({composition,frame:0});await save('portfolio-atmosphere.jpg',await still.blob({format:'jpeg',quality:.9}));
 const result=await renderMediaOnWeb({composition,muted:true,videoBitrate:180000,container:'mp4',videoCodec:'h264',outputTarget:'arraybuffer',onProgress:({progress})=>status.textContent=`Rendering ${Math.round(progress*100)}%`});
 const blob=await result.getBlob();await save('portfolio-atmosphere.mp4',blob);
 return {content:[{type:'text',text:JSON.stringify({file:'portfolio-atmosphere.mp4',bytes:blob.size,seconds:16,width:960,height:600,fps:24,audio:false,renderer:'Remotion 4.0.536',transport:'MCP InMemoryTransport',tool:'render_portfolio_atmosphere'})}]};
});
const [ct,st]=InMemoryTransport.createLinkedPair();await server.connect(st);const client=new Client({name:'portfolio-atmosphere-client',version:'1.0.0'});await client.connect(ct);await client.listTools();status.textContent='Ready · Remotion MCP connected';
document.querySelector('button').onclick=async()=>{
 document.querySelector('button').disabled=true;
 try{const r=await client.callTool({name:'render_portfolio_atmosphere',arguments:{}},undefined,{timeout:1200000});if(r.isError)throw Error(r.content[0].text);await save('portfolio-atmosphere-render.json',new Blob([JSON.stringify(r,null,2)]));status.textContent='Complete · atmosphere saved';}
 catch(e){status.textContent=e.message;document.querySelector('button').disabled=false;}
};
