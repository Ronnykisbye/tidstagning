(function(app){
  function roleNames(employeeId){
    const names=app.employeeRoleNames?.(employeeId)||[];
    return names.length?names.join(' + '):'Ingen rolle';
  }
  function setRole(employeeId,roleId,active){
    let link=app.db.employeeRoles.find(x=>x.employeeId===employeeId&&x.roleId===roleId);
    if(link)link.active=active;
    else app.db.employeeRoles.push({id:`${employeeId}-${roleId}`,employeeId,roleId,active});
  }
  function render(){
    const body=document.querySelector('#employeeTable tbody');if(!body)return;body.innerHTML='';
    app.activeEmployees().forEach(employee=>{
      const tr=document.createElement('tr');
      tr.innerHTML=`<td><strong>${app.escape(employee.name)}</strong></td><td>${app.escape(employee.email)}</td><td>${app.escape(employee.phone)}</td><td><span class="status-pill">${app.escape(roleNames(employee.id))}</span></td><td><button class="icon-btn" data-emp-edit="${employee.id}" aria-label="Rediger">✏️</button><button class="icon-btn danger" data-emp-del="${employee.id}" aria-label="Arkivér">🗑️</button></td>`;body.append(tr);
    });
    body.querySelectorAll('[data-emp-edit]').forEach(b=>b.onclick=()=>open(app.employee(b.dataset.empEdit)));
    body.querySelectorAll('[data-emp-del]').forEach(b=>b.onclick=()=>{const employee=app.employee(b.dataset.empDel);if(employee.id===app.session?.employeeId)return alert('Du kan ikke arkivere den profil, der bruges lige nu.');if(confirm(`Arkivér ${employee.name}?`)){employee.active=false;app.db.employeeRoles.filter(x=>x.employeeId===employee.id).forEach(x=>x.active=false);app.save(`Medarbejder arkiveret: ${employee.name}`);render();}});
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
    document.getElementById('addEmployeeBtn').onclick=()=>open();
    document.getElementById('employeeCancel').onclick=()=>document.getElementById('employeeDialog').close();
    document.getElementById('employeeForm').onsubmit=event=>{
      event.preventDefault();const values=Object.fromEntries(new FormData(event.target));let employee=app.employee(values.id);const isNew=!employee;
      if(employee)Object.assign(employee,{name:values.name,email:values.email,phone:values.phone});
      else {employee={id:app.uid(),name:values.name,email:values.email,phone:values.phone,active:true};app.db.employees.push(employee);}
      if(values.role==='Chef'){
        setRole(employee.id,'role-chef',true);
        if(isNew)setRole(employee.id,'role-medarbejder',true);
      }else{
        setRole(employee.id,'role-medarbejder',true);
        setRole(employee.id,'role-chef',false);
      }
      employee.role=values.role;
      app.save(`Medarbejder gemt: ${values.name}`);document.getElementById('employeeDialog').close();render();app.applyAccess?.();app.toast('Medarbejderen er gemt');
    };
    document.addEventListener('gtp:data',render);render();
  };
})(window.GTP);
