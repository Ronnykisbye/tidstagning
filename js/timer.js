(function(app){
  const ACTIVE='gtp_active_v3';let ticker,selectedCustomerId='';
  const active=()=>{try{return JSON.parse(localStorage.getItem(ACTIVE));}catch{return null;}};
  const elapsed=item=>Math.max(0,Math.floor((Date.now()-new Date(item.start).getTime())/1000));
  const today=()=>{const d=new Date();d.setMinutes(d.getMinutes()-d.getTimezoneOffset());return d.toISOString().slice(0,10);};

  function customerOptions(){
    const customers=app.activeCustomers(),byName=document.getElementById('workCustomer'),byAddress=document.getElementById('workAddress');
    const nameOld=selectedCustomerId||byName.value,addressOld=selectedCustomerId||byAddress.value;
    byName.innerHTML='<option value="">Vælg kundens navn</option>'+customers.map(c=>`<option value="${c.id}">${app.escape(c.name)}</option>`).join('');
    byAddress.innerHTML='<option value="">Vælg arbejdsadresse</option>'+[...customers].sort((a,b)=>a.address.localeCompare(b.address,'da')).map(c=>`<option value="${c.id}">${app.escape(c.address)}</option>`).join('');
    selectedCustomerId=customers.some(c=>c.id===nameOld)?nameOld:(customers.some(c=>c.id===addressOld)?addressOld:'');
    byName.value=selectedCustomerId;byAddress.value=selectedCustomerId;preview();
  }
  function preview(){
    const customer=app.customer(selectedCustomerId),box=document.getElementById('customerPreview');
    if(!customer){box.textContent='Vælg kunde eller adresse.';return;}
    box.innerHTML=`<strong>${app.escape(customer.name)}</strong><br>${app.escape(customer.address)}${customer.phone?` · ${app.escape(customer.phone)}`:''}${customer.notes?`<br><small>${app.escape(customer.notes)}</small>`:''}`;
    if(customer.defaultWorkType)document.getElementById('timerWorkType').value=customer.defaultWorkType;
  }
  function selectCustomer(id){
    selectedCustomerId=id||'';document.getElementById('workCustomer').value=selectedCustomerId;document.getElementById('workAddress').value=selectedCustomerId;preview();
  }
  function employeeOptions(){
    const people=app.activeEmployees(),current=app.session?.employeeId;
    ['timerEmployee','manualEmployee','reportEmployee'].forEach(id=>{
      const select=document.getElementById(id);if(!select)return;const old=select.value;
      const first=id==='reportEmployee'?'<option value="">Alle medarbejdere</option>':'<option value="">Vælg medarbejder</option>';
      select.innerHTML=first+people.map(e=>`<option value="${e.id}">${app.escape(e.name)}</option>`).join('');
      select.value=(old&&people.some(e=>e.id===old)?old:current)||'';
      select.disabled=!app.isManager()&&id!=='reportEmployee';
    });
  }
  app.renderEmployeeChecks=function(containerId,selected=[]){
    const box=document.getElementById(containerId);if(!box)return;
    box.innerHTML=app.activeEmployees().map(e=>`<label class="chip"><input type="checkbox" value="${e.id}" ${selected.includes(e.id)?'checked':''}><span>${app.escape(e.name)}</span></label>`).join('');
  };
  app.fillSelects=function(){
    document.querySelectorAll('[data-customer-select]').forEach(select=>{const old=select.value;select.innerHTML='<option value="">Vælg kunde</option>'+app.activeCustomers().map(c=>`<option value="${c.id}">${app.escape(c.name)}</option>`).join('');select.value=old;});
    customerOptions();employeeOptions();app.renderEmployeeChecks('bookingEmployees');app.buildWorkTypes?.();
  };
  function draw(){
    const item=active(),display=document.getElementById('timerDisplay'),state=document.getElementById('timerState');
    if(!item){display.textContent='00:00:00';state.textContent='Ingen aktiv tidsregistrering';return;}
    const seconds=elapsed(item);display.textContent=[seconds/3600,(seconds%3600)/60,seconds%60].map(n=>String(Math.floor(n)).padStart(2,'0')).join(':');
    state.textContent=`${app.customer(item.customerId)?.name||''} · ${app.employee(item.employeeIds[0])?.name||''}`;
  }
  function visibleEntries(){return [...app.db.entries].filter(app.canSeeEntry).sort((a,b)=>b.start.localeCompare(a.start)).slice(0,100);}
  function renderEntries(){
    const body=document.querySelector('#entryTable tbody');if(!body)return;body.innerHTML='';
    visibleEntries().forEach(entry=>{
      const names=(entry.employeeIds||[entry.employeeId]).map(id=>app.employee(id)?.name).filter(Boolean).join(', ');
      const statusClass=entry.followUp?'status-pill follow-up':'status-pill';
      const tr=document.createElement('tr');tr.innerHTML=`<td>${new Date(entry.start).toLocaleDateString('da-DK')}</td><td>${Math.round(entry.seconds/60)} min.</td><td>${app.escape(app.customer(entry.customerId)?.name||'')}</td><td>${app.escape(names)}</td><td><span class="${statusClass}">${app.escape(entry.status||'Færdig')}</span></td><td><span class="progress-mini"><b>${Number(entry.completion||0)} %</b><i style="--progress:${Number(entry.completion||0)}%"></i></span></td><td>${app.escape(entry.note||'')}<small>${app.escape(entry.workType||'')}</small></td><td>${app.isManager()?`<button class="icon-btn danger" data-entry-del="${entry.id}" aria-label="Slet">🗑️</button>`:''}</td>`;body.append(tr);
    });
    body.querySelectorAll('[data-entry-del]').forEach(button=>button.onclick=()=>{if(confirm('Slet tidsregistreringen?')){app.db.entries=app.db.entries.filter(x=>x.id!==button.dataset.entryDel);app.save('Tidsregistrering slettet');}});
  }
  function saveEntry(entry,message){
    app.db.entries.push({breakMinutes:0,workType:'Service',completion:100,status:'Færdig',followUp:false,followUpNote:'',source:'local',...entry,id:app.uid()});
    app.save(message);app.toast('Registreringen er gemt');
  }
  app.initTimer=function(){
    document.querySelector('input[name="date"]').value=today();app.fillSelects();draw();ticker=setInterval(draw,1000);
    document.getElementById('workCustomer').onchange=e=>selectCustomer(e.target.value);document.getElementById('workAddress').onchange=e=>selectCustomer(e.target.value);
    document.getElementById('timerStart').onclick=()=>{
      const employeeId=document.getElementById('timerEmployee').value;
      if(!selectedCustomerId||!employeeId)return alert('Vælg kunde/adresse og medarbejder.');
      if(active())return alert('Der kører allerede en tidsregistrering.');
      localStorage.setItem(ACTIVE,JSON.stringify({customerId:selectedCustomerId,employeeIds:[employeeId],start:new Date().toISOString(),workType:document.getElementById('timerWorkType').value,note:document.getElementById('timerNote').value.trim()}));
      app.save('Timer startet');draw();
    };
    document.getElementById('timerStop').onclick=()=>{
      const item=active();if(!item)return alert('Der er ingen aktiv timer.');
      const seconds=elapsed(item);saveEntry({...item,end:new Date().toISOString(),seconds},`Timer stoppet: ${Math.round(seconds/60)} minutter`);localStorage.removeItem(ACTIVE);draw();
    };
    document.getElementById('manualEntryForm').onsubmit=event=>{
      event.preventDefault();if(!selectedCustomerId)return alert('Vælg kunde eller adresse øverst.');
      const values=Object.fromEntries(new FormData(event.target)),start=new Date(`${values.date}T${values.start}`),end=new Date(`${values.date}T${values.end}`),breakSeconds=Number(values.breakMinutes||0)*60,seconds=(end-start)/1000-breakSeconds;
      if(end<=start||seconds<=0)return alert('Kontrollér starttid, sluttid og pause.');
      saveEntry({customerId:selectedCustomerId,employeeIds:[values.employeeId],start:start.toISOString(),end:end.toISOString(),seconds,breakMinutes:Number(values.breakMinutes||0),workType:values.workType,note:values.note,completion:Number(values.completion||0),status:values.status,followUp:values.followUp==='yes',followUpNote:values.followUpNote},'Manuel tidsregistrering gemt');
      event.target.reset();event.target.elements.date.value=today();employeeOptions();app.buildTimeOptions?.();app.buildWorkTypes?.();
    };
    document.addEventListener('gtp:data',()=>{customerOptions();renderEntries();});
    document.addEventListener('gtp:session',()=>{employeeOptions();renderEntries();});
    renderEntries();
  };
})(window.GTP);
