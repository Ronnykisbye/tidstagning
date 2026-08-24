(function(app){
  function render(){
    const body=document.querySelector('#customerTable tbody');if(!body)return;body.innerHTML='';
    app.activeCustomers().forEach(c=>{
      const tr=document.createElement('tr');
      tr.innerHTML=`<td><strong>${app.escape(c.name)}</strong><small>${app.escape(c.notes)}</small></td><td>${app.escape(c.phone)}</td><td>${app.escape(c.email)}</td><td>${app.escape(c.address)}</td><td><span class="status-pill">${app.escape(c.customerNumber||'Aktiv')}</span></td><td><button class="icon-btn" data-edit="${c.id}" aria-label="Rediger">✏️</button><button class="icon-btn danger" data-del="${c.id}" aria-label="Arkivér">🗑️</button></td>`;
      body.append(tr);
    });
    body.querySelectorAll('[data-edit]').forEach(b=>b.onclick=()=>open(app.customer(b.dataset.edit)));
    body.querySelectorAll('[data-del]').forEach(b=>b.onclick=()=>{const c=app.customer(b.dataset.del);if(confirm(`Arkivér ${c.name}?`)){c.active=false;app.db.addresses.filter(x=>x.customerId===c.id).forEach(x=>x.active=false);app.save(`Kunde arkiveret: ${c.name}`);render();}});
    app.fillSelects?.();
  }
  function open(customer={}){
    if(!app.isManager())return app.toast('Kun chefen kan redigere kunder');
    const form=document.getElementById('customerForm');form.reset();app.buildWorkTypes?.();
    form.elements.id.value=customer.id||'';
    ['name','phone','email','address','customerNumber','defaultWorkType','notes'].forEach(key=>{if(form.elements[key])form.elements[key].value=customer[key]||'';});
    document.getElementById('customerDialog').showModal();
  }
  app.openCustomer=open;
  app.initCustomers=function(){
    document.getElementById('addCustomerBtn').onclick=()=>open();
    document.getElementById('customerCancel').onclick=()=>document.getElementById('customerDialog').close();
    document.getElementById('customerForm').onsubmit=event=>{
      event.preventDefault();const values=Object.fromEntries(new FormData(event.target));let customer=app.customer(values.id),created=!customer;
      if(customer)Object.assign(customer,values);else {customer={...values,id:app.uid(),active:true};app.db.customers.push(customer);}
      let address=app.customerAddress(customer.id);
      if(address)address.address=values.address;
      else app.db.addresses.push({id:`${customer.id}-address-1`,customerId:customer.id,label:'Primær',address:values.address,postalCode:'',city:'',active:true});
      app.save(`Kunde gemt: ${values.name}`);document.getElementById('customerDialog').close();render();document.dispatchEvent(new CustomEvent('gtp:customer-saved',{detail:{customerId:customer.id,created}}));app.toast('Kunden er gemt');
    };
    document.addEventListener('gtp:data',render);render();
  };
})(window.GTP);
