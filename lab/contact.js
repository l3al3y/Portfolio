import { gateway, verifyContact } from './integrations.js';

export function initContact({onResume=()=>{}}={}){
  const dialog=document.querySelector('#contact-dialog'),container=document.querySelector('#turnstile-container');
  const status=document.querySelector('#contact-status'),details=document.querySelector('#contact-details');
  let widget=null,request=null,version=0,scriptPromise=null,verified=false,resumeRequested=false;
  function loadScript(){
    if(window.turnstile)return Promise.resolve();
    if(scriptPromise)return scriptPromise;
    scriptPromise=new Promise((resolve,reject)=>{
      const script=document.createElement('script');script.src='https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';script.async=true;
      const timeout=setTimeout(()=>{script.remove();scriptPromise=null;reject(new Error('Verification did not load. Check your connection and retry.'));},15000);
      script.onload=()=>{clearTimeout(timeout);if(window.turnstile)resolve();else{scriptPromise=null;reject(new Error('Verification is unavailable. Please retry.'));}};
      script.onerror=()=>{clearTimeout(timeout);script.remove();scriptPromise=null;reject(new Error('Verification could not load. Please check your connection or browser settings.'));};
      document.head.append(script);
    });return scriptPromise;
  }
  async function begin(){
    const current=++version;request?.abort();details.hidden=true;details.replaceChildren();status.textContent='Loading verification…';
    document.querySelector('#contact-retry').disabled=true;
    if(widget!==null&&window.turnstile){try{window.turnstile.remove(widget);}catch{}widget=null;}
    container.replaceChildren();
    try{
      await loadScript();if(current!==version||!dialog.open)return;
      widget=window.turnstile.render(container,{
        sitekey:gateway.sitekey,theme:document.documentElement.dataset.theme,
        callback:async token=>{
          if(current!==version||!dialog.open)return;
          status.textContent='Verifying with the contact gateway…';request=new AbortController();const active=request;
          const timer=setTimeout(()=>active.abort(),12000);
          try{
            const contact=await verifyContact(token,active.signal);
            if(current!==version||!dialog.open)return;
            verified=true;
            if(resumeRequested){resumeRequested=false;dialog.close();onResume();return;}
            const email=document.createElement('a');email.href=`mailto:${contact.email}`;email.textContent=contact.email;
            const phone=document.createElement('a');phone.href=`https://wa.me/${contact.phone.replace(/\D/g,'')}`;phone.textContent=`WhatsApp · ${contact.phone}`;phone.target='_blank';phone.rel='noopener noreferrer';
            const resume=document.createElement('button');resume.className='text-button';resume.dataset.resume='';resume.textContent='View résumé ↗';
            details.append(email,phone,resume);details.hidden=false;container.hidden=true;status.textContent='Verified. Choose a contact method below.';
          }catch(e){if(current===version&&dialog.open){status.textContent=e.name==='AbortError'?'Verification timed out. Please retry.':e instanceof TypeError?'The contact gateway could not be reached. Please retry.':e.message;}}
          finally{clearTimeout(timer);if(current===version)document.querySelector('#contact-retry').disabled=false;}
        },
        'error-callback':()=>{if(current===version){status.textContent='The verification challenge failed. On localhost, the production site key may reject this domain. Retry or use LinkedIn.';document.querySelector('#contact-retry').disabled=false;}},
        'expired-callback':()=>{if(current===version){status.textContent='The challenge expired. Please retry verification.';document.querySelector('#contact-retry').disabled=false;}}
      });
      status.textContent='Complete the Cloudflare verification to continue.';
    }catch(e){if(current===version&&dialog.open)status.textContent=e.message;}
    finally{if(current===version)document.querySelector('#contact-retry').disabled=false;}
  }
  function open(){if(!dialog.open)dialog.showModal();container.hidden=false;begin();}
  document.querySelector('#contact-open').addEventListener('click',()=>{resumeRequested=false;open();});
  document.querySelector('#contact-retry').addEventListener('click',()=>{container.hidden=false;begin();});
  dialog.addEventListener('close',()=>{++version;resumeRequested=false;request?.abort();if(widget!==null&&window.turnstile){try{window.turnstile.remove(widget);}catch{}widget=null;}details.replaceChildren();details.hidden=true;container.replaceChildren();});
  return {requestResume(){if(verified){if(dialog.open)dialog.close();onResume();}else{resumeRequested=true;open();}}};
}
