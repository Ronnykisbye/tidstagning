function gtpStampVersion(){
  document.querySelectorAll('.brand small').forEach(node=>{node.textContent='Interaktiv tidsregistrering · v5.7';});
  document.querySelectorAll('#aboutPage p').forEach(node=>{if(/GreenTime Pro version/i.test(node.textContent||''))node.textContent='GreenTime Pro version 5.7';});
}

function gtpIdentityDialog(){
  const dialog=document.getElementById('managerLockDialog');
  if(!dialog)return null;
  const title=dialog.querySelector('h2'),text=dialog.querySelector('p'),button=document.getElementById('managerUnlock');
  if(title)title.textContent='Bekræft din identitet';
  if(text)text.textContent='Brug Windows Hello, PIN, fingeraftryk, Face ID eller enhedens sikkerhed.';
  if(button){button.textContent='Godkend';button.hidden=true;}
  const other=document.getElementById('managerUseEmployee');if(other)other.hidden=true;
  if(!dialog.open)dialog.showModal();
  return dialog;
}

function gtpDataLoadingDialog(){
  let dialog=document.getElementById('gtpDataLoadingDialog');
  if(!dialog){
    dialog=document.createElement('dialog');
    dialog.id='gtpDataLoadingDialog';
    dialog.className='dialog-card';
    dialog.innerHTML='<div style="min-width:min(420px,80vw)"><h2>Henter data fra Sheetet…</h2><p>Vent venligst. Dine sikre data bliver hentet og klargjort.</p><p class="muted">Det kan tage nogle sekunder.</p></div>';
    document.body.append(dialog);
    dialog.addEventListener('cancel',event=>event.preventDefault());
  }
  if(!dialog.open)dialog.showModal();
  return dialog;
}
function gtpCloseDataLoading(){
  const dialog=document.getElementById('gtpDataLoadingDialog');
  if(dialog?.open)dialog.close();
}

async function gtpVerifyBeforeStart(A){
  if(!A.provider?.hasDeviceToken?.())return false;
  const identity=A.provider?.identity?.();
  if(!identity?.employeeId)throw new Error('Den sikre enhedsidentitet mangler. Bed Chefen sende et nyt installationslink.');
  const dialog=gtpIdentityDialog();
  const employee={id:identity.employeeId,name:identity.name||'GreenTime-medarbejder'};
  try{
    if(!A.bio?.enrolledFor?.(identity.employeeId)){
      if(A.bio?.enrolled?.())A.bio.remove();
      await A.bio.setup(employee);
      A.deviceVerifiedAtBoot=true;
      if(dialog?.open)dialog.close();
      return true;
    }
    await A.bio.verify(identity.employeeId);
    A.deviceVerifiedAtBoot=true;
    if(dialog?.open)dialog.close();
    return true;
  }catch(error){
    if(dialog?.open)dialog.close();
    throw error;
  }
}

async function gtpSecurePull(A){
  gtpDataLoadingDialog();
  try{return await A.provider.pull();}
  finally{gtpCloseDataLoading();}
}

async function gtpActivateInvite(A){
  const params=new URLSearchParams(location.search),invite=params.get('invite');
  if(!invite)return false;
  const api=params.get('api');
  if(api){if(!/^https:\/\/script\.google\.com\/macros\/s\//.test(api))throw new Error('Installationslinket indeholder en ugyldig serveradresse.');A.provider.configureEndpoint(api);}
  const needsEndpoint=A.provider.mode()!=='google-sheets';
  const dialog=document.createElement('dialog');dialog.className='dialog-card';dialog.innerHTML=`<form method="dialog" id="deviceActivationForm"><h2>Aktivér GreenTime Pro</h2><p>Denne invitation er personlig. Skriv dit navn præcis som Chefen har oprettet dig.</p>${needsEndpoint?'<label>Apps Script-webadresse<input name="endpoint" type="url" placeholder="https://script.google.com/macros/s/.../exec" required></label><p class="muted">Serveradressen bruges kun til at forbinde appen til virksomhedens Sheet.</p>':''}<label>Dit navn<input name="name" autocomplete="name" required autofocus></label><p class="muted">Efter aktivering låses denne installation til din medarbejderprofil. Du kan ikke se andre medarbejdere.</p><p class="muted"><strong>Aktiveringen kan tage op til 30 sekunder.</strong> Luk ikke siden og tryk ikke F5 imens.</p><div class="actions"><button class="primary" value="activate">Aktivér appen</button></div><p id="deviceActivationStatus" class="muted"></p><p id="deviceActivationError" role="alert"></p></form>`;document.body.append(dialog);dialog.showModal();
  return new Promise((resolve,reject)=>{
    const form=dialog.querySelector('form'),errorNode=dialog.querySelector('#deviceActivationError'),statusNode=dialog.querySelector('#deviceActivationStatus');
    dialog.addEventListener('cancel',e=>e.preventDefault());
    form.onsubmit=async event=>{
      event.preventDefault();const button=form.querySelector('button');button.disabled=true;button.textContent='Aktiverer…';errorNode.textContent='';statusNode.textContent='Vent venligst. Det kan tage op til 30 sekunder…';
      try{
        const data=new FormData(form),endpointValue=String(data.get('endpoint')||'').trim();
        if(endpointValue){if(!/^https:\/\/script\.google\.com\/macros\/s\//.test(endpointValue))throw new Error('Apps Script-webadressen er ikke gyldig.');A.provider.configureEndpoint(endpointValue);}
        if(A.provider.mode()!=='google-sheets')throw new Error('Der mangler en Apps Script-webadresse (/exec).');
        const name=data.get('name'),label=navigator.userAgentData?.platform||navigator.platform||'GreenTime-enhed';
        await A.provider.activate(invite,name,label);statusNode.textContent='Enheden er aktiveret. Bekræft nu din identitet…';
        dialog.close();dialog.remove();
        await gtpVerifyBeforeStart(A);
        await gtpSecurePull(A);history.replaceState({},'',location.pathname);resolve(true);
      }catch(error){if(!dialog.isConnected){reject(error);return;}statusNode.textContent='';errorNode.textContent=error.message;button.disabled=false;button.textContent='Aktivér appen';}
    };
  });
}

document.addEventListener('DOMContentLoaded',async()=>{
  gtpStampVersion();
  const A=window.GTP;if(!A)return;let activated=false;
  try{
    activated=await gtpActivateInvite(A);
    if(!activated&&A.provider?.hasDeviceToken?.()){
      await gtpVerifyBeforeStart(A);
      if(A.provider?.mode?.()==='google-sheets')await gtpSecurePull(A);
    }
  }catch(error){
    gtpCloseDataLoading();
    console.error('Sikker opstart kunne ikke gennemføres',error);
    alert(error.message||'Identiteten kunne ikke godkendes.');
    return;
  }
  try{A.initNavigation?.();}catch(error){console.error('Navigation kunne ikke starte',error);}
  ['initAccess','initDashboard','initCustomers','initEmployees','initTimer','initCalendar','initReports','initSettings'].forEach(name=>{try{A[name]?.();}catch(error){console.error(name+' kunne ikke starte',error);}});
  try{A.showPage?.('dashboardPage',{push:false,instant:true});}catch(error){console.error('Startsiden kunne ikke åbnes',error);}
  try{A.applyLanguage?.();}catch(error){console.error('Sprog kunne ikke indlæses',error);}
  document.querySelectorAll('[data-lang]').forEach(button=>button.onclick=()=>A.setLanguage?.(button.dataset.lang));
  if(activated)A.toast?.('Denne enhed er nu sikkert aktiveret');
});