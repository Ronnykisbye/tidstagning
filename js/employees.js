(function(app){
  let showDemo=false;
  const isDemo=id=>String(id||'').startsWith('demo-');
  function roleNames(employeeId){
    const names=app.employeeRoleNames?.(employeeId)||[];
    return names.length?names.join(' + '):'Ingen rolle';
  }
  function setRole(employeeId,roleId,active){
    let link=app.db.employeeRoles.find(x=>x.employeeId===employeeId&&x.roleId===roleId);
    if(link)link.active=active;
    else app.db.employeeRoles.push({id:`${employeeId}-${roleId}`,employeeId,roleId,active});
  }
  function ensureDemoToggle(){
    const head=document.querySelector('#employeesPage .page-head');
    if(!head||document.getElementById('toggleEmployeeDemo'))return;
    const actions=document.createElement('div');actions.className='actions';
    const demo=document.createElement('button');demo.id='toggleEmployeeDemo';demo.type='button';demo.textContent='Vis demo';demo.title='Vis eller skjul fiktive demo-medarbejdere';demo.setAttribute('aria-pressed','false');
    const add=document.getElementById('addEmployeeBtn');
    if(add){add.parentNode.insertBefore(actions,add);actions.append(demo,add);}else head.append(actions);
    demo.onclick=()=>{showDemo=!showDemo;demo.textContent=showDemo?'Skjul demo':'Vis demo';demo.setAttribute('aria-pressed',String(showDemo));render();};
  }
  function render(){
    const body=document.querySelector('#employeeTable tbody');if(!body)return;body.innerHTML='';
    const employees=app.activeEmployees().filter(employee=>showDemo||!isDemo(employee.id));
    employees.forEach(employee=>{
      const tr=document.createElement('tr');
      tr.innerHTML=`<td><strong>${app.escape(employee.name)}</strong>${isDemo(employee.id)?' <small>(demo)</small>':''}</td><td>${app.escape(employee.email)}</td><td>${app.escape(employee.phone)}</td><td><span class="status-pill">${app.escape(roleNames(employee.id))}</span></td><td><button class="icon-btn" data-emp-edit="${employee.id}" aria-label="Rediger">✏️</button><button class="icon-btn danger" data-emp-del="${employee.id}" aria-label="Arkivér">🗑️</button></td>`;body.append(tr);
    });
    body.querySelectorAll('[data-emp-edit]').forEach(b=>b.onclick=()=>open(app.employee(b.dataset.empEdit)));
    body.querySelectorAll('[data-emp-del]').forEach(b=>b.onclick=async()=>{const employee=app.employee(b.dataset.empDel);if(employee.id===app.session?.employeeId)return alert('Du kan ikke arkivere den profil, der bruges lige nu.');if(confirm(`Arkivér ${employee.name}?`)){employee.active=false;app.db.employeeRoles.filter(x=>x.employeeId===employee.id).forEach(x=>x.active=false);app.save(`Medarbejder arkiveret: ${employee.name}`);render();if(isDemo(employee.id))return app.toast('Demo-medarbejderen er skjult lokalt');try{await app.provider?.syncNow?.();app.toast('Medarbejderen er arkiveret i Sheetet');}catch{app.toast('Arkiveret lokalt · Sheet-synkronisering fejlede');}}});
    app.fillSelects?.();
  }
  function open(employee={}){
    if(!app.isManager())return app.toast('Kun chefen kan redigere medarbejdere');
    const form=document.getElementById('employeeForm');form.reset();form.elements.id.value=employee.id||'';
    ['name','email','phone'].forEach(key=>form.elements[key].value=employee[key]||'');
    form.elements.role.value=employee.id&&app.hasRole?.(employee.id,'role-chef')?'Chef':'Medarbejder';
    document.getElementById('employeeDialog').showModal();
  }
  app.initEmployees=function(){
    ensureDemoToggle();
    document.getElementById('addEmployeeBtn').onclick=()=>open();
    document.getElementById('employeeCancel').onclick=()=>document.getElementById('employeeDialog').close();
    document.getElementById('employeeForm').onsubmit=async event=>{
      event.preventDefault();const form=event.target,values=Object.fromEntries(new FormData(form));let employee=app.employee(values.id);const isNew=!employee;
      if(employee)Object.assign(employee,{name:values.name,email:values.email,phone:values.phone});
      else {employee={id:app.uid(),name:values.name,email:values.email,phone:values.phone,active:true};app.db.employees.push(employee);}
      if(values.role==='Chef'){
        setRole(employee.id,'role-chef',true);
        setRole(employee.id,'role-medarbejder',true);
      }else{
        setRole(employee.id,'role-medarbejder',true);
        setRole(employee.id,'role-chef',false);
      }
      employee.role=values.role;
      app.save(`Medarbejder gemt: ${values.name}`);document.getElementById('employeeDialog').close();render();app.applyAccess?.();
      if(isDemo(employee.id))return app.toast('Demo-medarbejderen er gemt lokalt');
      if(app.provider?.mode?.()==='google-sheets'){
        try{await app.provider.syncNow();app.toast('Medarbejderen er gemt i Sheetet');}
        catch(error){alert(`Medarbejderen er gemt lokalt, men kunne ikke gemmes i Sheetet: ${error.message}`);}
      }else app.toast('Medarbejderen er gemt lokalt');
    };
    document.addEventListener('gtp:data',render);render();
  };
})(window.GTP);
