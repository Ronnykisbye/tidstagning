(function(app){
  const KEY='gtp_session_v1';
  const parse=()=>{try{return JSON.parse(localStorage.getItem(KEY))||{};}catch{return {};}};
  const deviceIdentity=()=>app.provider?.identity?.()||null;
  const secureDevice=()=>Boolean(deviceIdentity());
  const chefDevice=()=>{const id=deviceIdentity();return Boolean(id&&id.isChef);};
  function forceSecureIdentity(){
    const id=deviceIdentity();if(!id)return;
    app.session={mode:id.isChef?'manager':'employee',employeeId:id.employeeId};
    localStorage.setItem(KEY,JSON.stringify(app.session));
  }
  app.session=parse();
  forceSecureIdentity();
  app.deviceLocked=secureDevice()&&!app.deviceVerifiedAtBoot;
  app.managerLocked=app.deviceLocked;
  app.isManager=()=>app.session?.mode==='manager'&&!app.deviceLocked&&chefDevice();
  app.currentEmployee=()=>app.employee(app.session?.employeeId);
  app.canSeeEntry=entry=>!app.deviceLocked&&(app.isManager()||(entry.employeeIds||[entry.employeeId]).includes(app.session?.employeeId));
  app.canSeeBooking=booking=>!app.deviceLocked&&(app.isManager()||(booking.employeeIds||[]).includes(app.session?.employeeId));

  function profileOptions(){
    const select=document.getElementById('profileEmployee');if(!select)return;
    const mode=document.getElementById('profileMode').value;
    let people=secureDevice()?[app.currentEmployee()].filter(Boolean):app.activeEmployees();
    if(mode==='manager'){
      const managers=people.filter(x=>app.hasRole?.(x.id,'role-chef'));
      if(managers.length)people=managers;
    }
    select.innerHTML='<option value="">Vælg navn</option>'+people.map(x=>`<option value="${x.id}">${app.escape(x.name)}</option>`).join('');
    const current=app.currentEmployee();if(current&&people.some(x=>x.id===current.id))select.value=current.id;
    document.getElementById('profileHint').textContent=secureDevice()?'Denne installation er låst til den godkendte profil.':mode==='manager'?'Chefversionen giver adgang til administration, rapporter og planlægning.':'Medarbejderversionen viser egne opgaver og registreringer.';
  }
  function initials(name='?'){return name.split(/\s+/).filter(Boolean).slice(0,2).map(x=>x[0]).join('').toUpperCase();}
  function apply(){
    forceSecureIdentity();
    const employee=app.currentEmployee(),manager=app.isManager(),locked=secureDevice()&&app.deviceLocked;
    document.body.dataset.role=locked?'locked':manager?'manager':'employee';
    document.querySelectorAll('[data-role-only="manager"]').forEach(x=>x.hidden=!manager);
    document.querySelectorAll('[data-role-page="manager"]').forEach(x=>x.setAttribute('aria-hidden',String(!manager)));
    document.getElementById('profileName').textContent=employee?.name||'Vælg bruger';
    document.getElementById('profileInitials').textContent=initials(employee?.name);
    document.getElementById('roleBadge').textContent=locked?'Låst':manager?'Chefversion':'Medarbejderversion';
    document.getElementById('welcomeTitle').textContent=locked?'Appen er låst':employee?`God arbejdsdag, ${employee.name}`:'Velkommen til GreenTime Pro';
    document.getElementById('welcomeText').textContent=locked?'Bekræft din identitet med Windows Hello, PIN, fingeraftryk, Face ID eller enhedens sikkerhed for at fortsætte.':manager?'Her er firmaets samlede overblik. Du kan også selv registrere arbejde.':'Her ser du dine opgaver og kan registrere det udførte arbejde.';
    document.getElementById('weekHoursNote').textContent=manager?'alle registrerede timer':'dine registrerede timer';
    document.getElementById('calendarTitle').textContent=manager?'Plan & kalender':'Mine planlagte opgaver';
    document.getElementById('calendarIntro').textContent=manager?'Planlæg hvem der skal arbejde hos hvilke kunder.':'Kun dine egne opgaver vises. Ved fælles opgaver vises kun “Flere medarbejdere på opgaven”.';
    document.getElementById('recentEntriesTitle').textContent=manager?'Seneste registreringer':'Mine seneste registreringer';
    app.fillSelects?.();document.dispatchEvent(new CustomEvent('gtp:session'));
  }
  function open(force=false){
    if(secureDevice())return app.toast('Denne app er låst til den godkendte profil');
    const dialog=document.getElementById('profileDialog');document.getElementById('profileMode').value=app.session?.mode||'employee';profileOptions();dialog.dataset.force=force?'true':'false';if(!dialog.open)dialog.showModal();
  }
  function lockDialog(){return document.getElementById('managerLockDialog');}
  function openLock(){
    const dialog=lockDialog();
    const title=dialog?.querySelector('h2'),text=dialog?.querySelector('p');
    if(title)title.textContent='Bekræft din identitet';
    if(text)text.textContent='Brug Windows Hello, PIN, fingeraftryk, Face ID eller enhedens sikkerhed.';
    const button=document.getElementById('managerUnlock');if(button){button.textContent='Godkend';button.hidden=false;}
    if(dialog&&!dialog.open)dialog.showModal();
  }
  async function ensureVerification(){
    if(!secureDevice())return;
    const employee=app.currentEmployee()||deviceIdentity();
    try{
      if(!app.bio?.enrolledFor?.(employee?.id||employee?.employeeId)){
        if(app.bio?.enrolled?.())app.bio.remove();
        const profile=employee?.id?employee:{id:employee.employeeId,name:employee.name||'GreenTime-medarbejder'};
        await app.bio.setup(profile);
      }
      await app.bio.verify(employee?.id||employee?.employeeId);
      app.deviceLocked=false;app.managerLocked=false;apply();
      const dialog=lockDialog();if(dialog?.open)dialog.close();
      app.toast('Identitet godkendt');
    }catch(error){
      app.deviceLocked=true;app.managerLocked=true;apply();openLock();
      if(error?.name!=='NotAllowedError')alert(error.message||'Identiteten kunne ikke godkendes.');
    }
  }
  app.lockManager=function(){if(!secureDevice())return;app.deviceLocked=true;app.managerLocked=true;apply();app.showPage?.('dashboardPage',{push:false});openLock();};
  app.initAccess=function(){
    let hiddenAt=0;forceSecureIdentity();
    if(app.deviceVerifiedAtBoot){app.deviceLocked=false;app.managerLocked=false;}
    document.getElementById('profileButton').onclick=()=>open(false);
    document.getElementById('profileMode').onchange=profileOptions;
    document.getElementById('profileCancel').onclick=()=>{if(app.session?.employeeId)document.getElementById('profileDialog').close();};
    document.getElementById('profileDialog').addEventListener('cancel',event=>{if(!app.currentEmployee())event.preventDefault();});
    lockDialog().addEventListener('cancel',event=>event.preventDefault());
    document.getElementById('managerUnlock').onclick=async()=>{const button=document.getElementById('managerUnlock');button.disabled=true;try{await ensureVerification();}finally{button.disabled=false;}};
    document.getElementById('managerUseEmployee').hidden=secureDevice();
    document.getElementById('managerUseEmployee').onclick=()=>{if(secureDevice())return;lockDialog().close();open(false);document.getElementById('profileMode').value='employee';profileOptions();};
    document.getElementById('profileForm').onsubmit=async e=>{
      e.preventDefault();if(secureDevice())return apply();const values=Object.fromEntries(new FormData(e.target));const employee=app.employee(values.employeeId);if(!employee)return;
      if(values.mode==='manager'&&!app.hasRole?.(employee.id,'role-chef'))return alert('Vælg en medarbejder med rollen Chef.');
      app.session={mode:values.mode,employeeId:values.employeeId};localStorage.setItem(KEY,JSON.stringify(app.session));document.getElementById('profileDialog').close();apply();app.showPage?.('dashboardPage');app.toast('Profilen er gemt på denne enhed');
    };
    apply();
    if(secureDevice()&&!app.deviceVerifiedAtBoot)setTimeout(ensureVerification,150);
    else if(!secureDevice()&&!app.currentEmployee())setTimeout(()=>open(true),100);
    document.addEventListener('visibilitychange',()=>{if(document.hidden)hiddenAt=Date.now();else if(hiddenAt&&Date.now()-hiddenAt>=300000)app.lockManager();});
  };
  app.applyAccess=apply;
})(window.GTP);