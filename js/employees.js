(function(app){
  function render(){
    const body=document.querySelector('#employeeTable tbody');if(!body)return;body.innerHTML='';
    app.activeEmployees().forEach(employee=>{
      const tr=document.createElement('tr');
      tr.innerHTML=`<td><strong>${app.escape(employee.name)}</strong></td><td>${app.escape(employee.email)}</td><td>${app.escape(employee.phone)}</td><td><span class="status-pill">${app.escape(employee.role)}</span></td><td><button class="icon-btn" data-emp-edit="${employee.id}" aria-label="Rediger">✏️</button><button class="icon-btn danger" data-emp-del="${employee.id}" aria-label="Arkivér">🗑️</button></td>`;body.append(tr);
    });
    body.querySelectorAll('[data-emp-edit]').forEach(b=>b.onclick=()=>open(app.employee(b.dataset.empEdit)));
    body.querySelectorAll('[data-emp-del]').forEach(b=>b.onclick=()=>{const employee=app.employee(b.dataset.empDel);if(employee.id===app.session?.employeeId)return alert('Du kan ikke arkivere den profil, der bruges lige nu.');if(confirm(`Arkivér ${employee.name}?`)){employee.active=false;app.db.employeeRoles.filter(x=>x.employeeId===employee.id).forEach(x=>x.active=false);app.save(`Medarbejder arkiveret: ${employee.name}`);render();}});
    app.fillSelects?.();
  }
  function open(employee={}){
    if(!app.isManager())return app.toast('Kun chefen kan redigere medarbejdere');
    const form=document.getElementById('employeeForm');form.reset();form.elements.id.value=employee.id||'';
    ['name','email','phone','role'].forEach(key=>form.elements[key].value=employee[key]||'');
    document.getElementById('employeeDialog').showModal();
  }
  app.initEmployees=function(){
    document.getElementById('addEmployeeBtn').onclick=()=>open();
    document.getElementById('employeeCancel').onclick=()=>document.getElementById('employeeDialog').close();
    document.getElementById('employeeForm').onsubmit=event=>{
      event.preventDefault();const values=Object.fromEntries(new FormData(event.target));let employee=app.employee(values.id);
      if(employee)Object.assign(employee,values);else {employee={...values,id:app.uid(),active:true};app.db.employees.push(employee);}
      const roleId=values.role==='Chef'?'role-manager':'role-employee';let link=app.db.employeeRoles.find(x=>x.employeeId===employee.id);
      if(link)Object.assign(link,{roleId,active:true});else app.db.employeeRoles.push({id:`${employee.id}-role`,employeeId:employee.id,roleId,active:true});
      app.save(`Medarbejder gemt: ${values.name}`);document.getElementById('employeeDialog').close();render();app.applyAccess?.();app.toast('Medarbejderen er gemt');
    };
    document.addEventListener('gtp:data',render);render();
  };
})(window.GTP);
