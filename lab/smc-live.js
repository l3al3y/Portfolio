const historicalKeys=['previous_v2','previous_v2_mirror','previous_setup','previous_v1','previous_r4','previous_r2','historical_v4'];
export function summarizeSMCMetrics(data){
  if(!data||typeof data.version!=='string'||!data.version.startsWith('smc-crows-'))throw new Error('Unexpected release data');
  for(const key of ['starts','mirror_requests','total_requests',...historicalKeys])if(!Number.isSafeInteger(data[key])||data[key]<0)throw new Error('Incomplete download counters');
  if(data.total_requests!==data.starts+data.mirror_requests)throw new Error('Inconsistent download counters');
  const total=historicalKeys.reduce((sum,key)=>sum+data[key],data.total_requests);
  if(!Number.isSafeInteger(total))throw new Error('Download counter exceeds supported range');
  return {total,current:data.total_requests,direct:data.starts,mirror:data.mirror_requests,release:data.version.match(/-(v\d+(?:\.\d+)*)-/)?.[1]||'Current release'};
}
export function initSMCLive(root=document.querySelector('#smc-live')){
  if(!root)return;
  const status=root.querySelector('[data-smc-status]'),button=root.querySelector('[data-smc-refresh]');
  let busy=false,lastSuccess=null,visible=false,stopped=false,controller;
  const format=new Intl.NumberFormat('en-MY');
  async function refresh(){
    if(busy||stopped)return;busy=true;button.disabled=true;controller=new AbortController();
    const timeout=setTimeout(()=>controller.abort(),8000);
    if(!lastSuccess)status.textContent='Fetching the latest SMC counts…';
    try{
      const response=await fetch('/smc/api/apk-stat',{cache:'no-store',credentials:'omit',signal:controller.signal});
      if(!response.ok)throw new Error('Download counters unavailable');
      const metrics=summarizeSMCMetrics(await response.json());
      if(stopped)return;
      for(const key of ['total','current','direct','mirror'])root.querySelector(`[data-smc-count="${key}"]`).textContent=format.format(metrics[key]);
      root.querySelector('[data-smc-release]').textContent=metrics.release;
      lastSuccess=new Date();
      const time=new Intl.DateTimeFormat('en-MY',{hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false,timeZone:'Asia/Kuala_Lumpur'}).format(lastSuccess);
      status.textContent=`Fetched ${time} MYT · refreshes every minute while visible`;
      root.dataset.state='live';
    }catch{
      if(!stopped){root.dataset.state=lastSuccess?'stale':'unavailable';status.textContent=lastSuccess?'Refresh unavailable. Showing the last fetched counts; try again.':'Live counts are temporarily unavailable. Try again or open the SMC download page.';}
    }finally{clearTimeout(timeout);busy=false;button.disabled=false;}
  }
  button.addEventListener('click',refresh);
  let observer;
  if('IntersectionObserver' in window){observer=new IntersectionObserver(entries=>{visible=entries.some(e=>e.isIntersecting);if(visible&&document.visibilityState==='visible')refresh();});observer.observe(root);}else visible=true;
  const timer=setInterval(()=>{if(visible&&document.visibilityState==='visible')refresh();},60000);
  const resume=()=>{if(visible&&document.visibilityState==='visible')refresh();};document.addEventListener('visibilitychange',resume);
  const stop=()=>{stopped=true;clearInterval(timer);observer?.disconnect();controller?.abort();document.removeEventListener('visibilitychange',resume);};
  window.addEventListener('pagehide',event=>{if(event.persisted)controller?.abort();else stop();});
  window.addEventListener('pageshow',event=>{if(event.persisted)resume();});
  refresh();return {refresh,stop};
}
