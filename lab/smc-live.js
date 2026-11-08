const historyLabels = {
  starts: 'v3.0 Direct',
  mirror_requests: 'v3.0 MediaFire',
  previous_v2: 'v2.0 Direct',
  previous_v2_mirror: 'v2.0 MediaFire',
  previous_setup: 'v1.0 Setup',
  previous_v1: 'v1.0',
  previous_r4: 'Early build r4',
  previous_r2: 'Early build r2',
  historical_v4: 'Early download revision',
};

function readSMCCount(value) {
  if (!Number.isSafeInteger(value) || value < 0) throw new Error('Invalid download count');
  return value;
}

export function summarizeSMCMetrics(data) {
  return {direct: readSMCCount(data?.direct), mirror: readSMCCount(data?.mirror)};
}

function initHistory(history, format) {
  const status = history.querySelector('[data-smc-history-status]');
  const list = history.querySelector('[data-smc-history-counts]');
  let loading = false;

  history.addEventListener('toggle', async () => {
    if (!history.open || loading || !list.hidden) return;
    loading = true;
    status.textContent = 'Loading earlier download counts…';
    try {
      const response = await fetch('/smc/api/apk-stat', {
        cache: 'no-store',
        credentials: 'omit',
        signal: AbortSignal.timeout(8000),
      });
      if (!response.ok) throw new Error('Download history unavailable');
      const data = await response.json();
      if (!data.version?.startsWith('smc-crows-v3.0-')) throw new Error('Unexpected history version');
      const rows = Object.entries(historyLabels).map(([key, label]) => {
        const row = document.createElement('li');
        row.textContent = label + ': ' + format.format(readSMCCount(data[key]));
        return row;
      });
      list.replaceChildren(...rows);
      list.hidden = false;
      status.textContent = '';
    } catch {
      status.textContent = 'Earlier counts are temporarily unavailable.';
    } finally {
      loading = false;
    }
  });
}

export function initSMCLive(root=document.querySelector('#smc-live')){
  if(!root)return;
  const status=root.querySelector('[data-smc-status]'),button=root.querySelector('[data-smc-refresh]');
  let busy=false,lastSuccess=null,visible=false,stopped=false,controller;
  const format=new Intl.NumberFormat('en-MY');
  initHistory(root.querySelector('[data-smc-history]'), format);
  async function refresh(){
    if(busy||stopped)return;busy=true;button.disabled=true;controller=new AbortController();
    const timeout=setTimeout(()=>controller.abort(),8000);
    if(!lastSuccess)status.textContent='Fetching the latest SMC counts…';
    try{
      const response=await fetch('/smc/api/v4-download-counts',{cache:'no-store',credentials:'omit',signal:controller.signal});
      if(!response.ok)throw new Error('Download counters unavailable');
      const metrics=summarizeSMCMetrics(await response.json());
      if(stopped)return;
      for(const key of ['direct','mirror'])root.querySelector(`[data-smc-count="${key}"]`).textContent=format.format(metrics[key]);
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
