async function gtpActivateInvite(A){
  const params=new URLSearchParams(location.search),invite=params.get('invite');
  if(!invite)return false;
  const api=params.get('api');
  if(api){if(!/^https:\/\/script\.google\.com\/macros\/s\//.test(api))throw new Error('Installationslinket indeholder en ugyldig serveradresse.');A.provider.configureEndpoint(api);}
  if(A.provider.mode()!=='google-sheets')throw new Error('Installationslinket mangler serverforbindelsen. Bed Chefen sende et nyt link.');
  const dialog=document.createElement('dialog');dialog.className='dialog-card';dialog.innerHTML=`<form method="dialog" id="deviceActivationForm"><h2>Aktivér GreenTime Pro</h2><p>Denne invitation er personlig. Skriv dit navn præcis som Chefen har oprettet dig.</p><label>Dit navn<input name="name" autocomplete="name" required autofocus></label><p class="muted">Efter aktivering låses denne installation til din medarbejderprofil. Du kan ikke se andre medarbejdere.</p><div class="actions"><button class="primary" value="activate">Aktivér appen</button></div><p id="deviceActivationError" role="alert"></p></form>`;document.body.append(dialog);dialog.showModal();
  return new Promise((resolve,reject)=>{
    const form=dialog.querySelector('form'),errorNode=dialog.querySelector('#deviceActivationError');
    dialog.addEventListener('cancel',e=>e.preventDefault());
    form.onsubmit=async event=>{
      event.preventDefault();const button=form.querySelector('button');button.disabled=true;button.textContent='Aktiverer…';errorNode.textContent='';
      try{
        const name=new FormData(form).get('name'),label=navigator.userAgentData?.platform||navigator.platform||'GreenTime-enhed';
        await A.provider.activate(invite,name,label);await A.provider.pull();history.replaceState({},'',location.pathname);dialog.close();dialog.remove();resolve(true);
      }catch(error){errorNode.textContent=error.message;button.disabled=false;button.textContent='Aktivér appen';}
    };
  });
}

document.addEventListener('DOMContentLoaded',async()=>{
  const A=window.GTP;if(!A)return;let activated=false;
  try{activated=await gtpActivateInvite(A);}catch(error){alert(error.message);}
  if(!activated&&A.provider?.mode?.()==='google-sheets'&&A.provider?.hasDeviceToken?.()){
    try{await A.provider.pull();}catch(error){console.warn('Sikker Sheet-hentning kunne ikke gennemføres',error);}
  }
  try{A.initNavigation?.();}catch(error){console.error('Navigation kunne ikke starte',error);}
  ['initAccess','initDashboard','initCustomers','initEmployees','initTimer','initCalendar','initReports','initSettings'].forEach(name=>{try{A[name]?.();}catch(error){console.error(name+' kunne ikke starte',error);}});
  try{A.showPage?.('dashboardPage',{push:false,instant:true});}catch(error){console.error('Startsiden kunne ikke åbnes',error);}
  try{A.applyLanguage?.();}catch(error){console.error('Sprog kunne ikke indlæses',error);}
  document.querySelectorAll('[data-lang]').forEach(button=>button.onclick=()=>A.setLanguage?.(button.dataset.lang));
  if(activated)A.toast?.('Denne enhed er nu sikkert aktiveret');
});
