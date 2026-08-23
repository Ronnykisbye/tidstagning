(function(app){
  const KEY='gtp_session_v1';
  const parse=()=>{try{return JSON.parse(localStorage.getItem(KEY))||{};}catch{return {};}};
  app.session=parse();
  app.isManager=()=>app.session?.mode==='manager';
  app.currentEmployee=()=>app.employee(app.session?.employeeId);
  app.canSeeEntry=entry=>app.isManager()||(entry.employeeIds||[entry.employeeId]).includes(app.session?.employeeId);
  app.canSeeBooking=booking=>app.isManager()||(booking.employeeIds||[]).includes(app.session?.employeeId);

  function profileOptions(){
    const select=document.getElementById('profileEmployee');if(!select)return;
    const mode=document.getElementById('profileMode').value;
    let people=app.activeEmployees();
    if(mode==='manager'){
      const managers=people.filter(x=>x.role==='Chef');
      if(managers.length)people=managers;
    }
    select.innerHTML='<option value="">Vælg navn</option>'+people.map(x=>`<option value="${x.id}">${app.escape(x.name)}</option>`).join('');
    const current=app.currentEmployee();
    if(current&&people.some(x=>x.id===current.id))select.value=current.id;
    document.getElementById('profileHint').textContent=mode==='manager'?'Chefversionen giver adgang til administration, rapporter og planlægning.':'Medarbejderversionen viser egne opgaver og registreringer.';
  }
  function initials(name='?'){return name.split(/\s+/).filter(Boolean).slice(0,2).map(x=>x[0]).join('').toUpperCase();}
  function apply(){
    const employee=app.currentEmployee(),manager=app.isManager();
    document.body.dataset.role=manager?'manager':'employee';
    document.querySelectorAll('[data-role-only="manager"]').forEach(x=>x.hidden=!manager);
    document.querySelectorAll('[data-role-page="manager"]').forEach(x=>x.setAttribute('aria-hidden',String(!manager)));
    document.getElementById('profileName').textContent=employee?.name||'Vælg bruger';
    document.getElementById('profileInitials').textContent=initials(employee?.name);
    document.getElementById('roleBadge').textContent=manager?'Chefversion':'Medarbejderversion';
    document.getElementById('welcomeTitle').textContent=employee?`God arbejdsdag, ${employee.name}`:'Velkommen til GreenTime Pro';
    document.getElementById('welcomeText').textContent=manager?'Her er firmaets samlede overblik. Du kan også selv registrere arbejde.':'Her ser du dine opgaver og kan registrere det udførte arbejde.';
    document.getElementById('weekHoursNote').textContent=manager?'alle registrerede timer':'dine registrerede timer';
    document.getElementById('calendarTitle').textContent=manager?'Plan & kalender':'Mine planlagte opgaver';
    document.getElementById('calendarIntro').textContent=manager?'Planlæg hvem der skal arbejde hos hvilke kunder.':'Kun opgaver, hvor du er valgt, vises.';
    document.getElementById('recentEntriesTitle').textContent=manager?'Seneste registreringer':'Mine seneste registreringer';
    app.fillSelects?.();
    document.dispatchEvent(new CustomEvent('gtp:session'));
  }
  function open(force=false){
    const dialog=document.getElementById('profileDialog');
    document.getElementById('profileMode').value=app.session?.mode||'employee';
    profileOptions();
    dialog.dataset.force=force?'true':'false';
    if(!dialog.open)dialog.showModal();
  }
  app.initAccess=function(){
    document.getElementById('profileButton').onclick=()=>open(false);
    document.getElementById('profileMode').onchange=profileOptions;
    document.getElementById('profileCancel').onclick=()=>{if(app.session?.employeeId)document.getElementById('profileDialog').close();};
    document.getElementById('profileDialog').addEventListener('cancel',event=>{if(!app.currentEmployee())event.preventDefault();});
    document.getElementById('profileForm').onsubmit=e=>{
      e.preventDefault();const values=Object.fromEntries(new FormData(e.target));
      const employee=app.employee(values.employeeId);if(!employee)return;
      if(values.mode==='manager'&&employee.role!=='Chef')return alert('Vælg en medarbejder med rollen Chef.');
      app.session={mode:values.mode,employeeId:values.employeeId};localStorage.setItem(KEY,JSON.stringify(app.session));
      document.getElementById('profileDialog').close();apply();app.showPage?.('dashboardPage');app.toast('Profilen er gemt på denne enhed');
    };
    apply();
    if(!app.currentEmployee())setTimeout(()=>open(true),100);
  };
  app.applyAccess=apply;
})(window.GTP);
