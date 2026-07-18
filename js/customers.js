(function(app){
  function render(){
    const body=document.querySelector('#customerTable tbody'); body.innerHTML='';
    app.db.customers.filter(x=>x.active!==false).forEach(c=>{
      const tr=document.createElement('tr');tr.innerHTML=`<td><strong>${app.escape(c.name)}</strong><small>${app.escape(c.notes)}</small></td><td>${app.escape(c.phone)}</td><td>${app.escape(c.email)}</td><td>${app.escape(c.address)}</td><td><button class="icon-btn" data-edit="${c.id}">✏️</button><button class="icon-btn danger" data-del="${c.id}">🗑️</button></td>`;body.append(tr);
    });
    document.querySelectorAll('[data-edit]').forEach(b=>b.onclick=()=>open(app.customer(b.dataset.edit)));
    document.querySelectorAll('[data-del]').forEach(b=>b.onclick=()=>{const c=app.customer(b.dataset.del);if(confirm(`Arkivér ${c.name}?`)){c.active=false;app.save(`Kunde arkiveret: ${c.name}`);render();}});
    app.fillSelects();
  }
  function open(c={}){const f=document.getElementById('customerForm');f.reset();f.elements.id.value=c.id||'';['name','phone','email','address','notes'].forEach(k=>f.elements[k].value=c[k]||'');document.getElementById('customerDialog').showModal();}
  app.initCustomers=function(){
    document.getElementById('addCustomerBtn').onclick=()=>open();
    document.getElementById('customerCancel').onclick=()=>document.getElementById('customerDialog').close();
    document.getElementById('customerForm').onsubmit=e=>{e.preventDefault();const x=Object.fromEntries(new FormData(e.target));let c=app.customer(x.id);if(c)Object.assign(c,x);else app.db.customers.push({...x,id:app.uid(),active:true});app.save(`Kunde gemt: ${x.name}`);document.getElementById('customerDialog').close();render();};
    document.addEventListener('gtp:data',render);render();
  };
})(window.GTP);

