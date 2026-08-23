(function(app){
  let syncTimer;
  function endpoint(){return String(app.db.settings?.sheetEndpoint||'').trim();}
  function setState(text,state='local'){
    const node=document.getElementById('syncState');if(!node)return;
    node.textContent=text;node.dataset.state=state;
  }
  async function request(action,payload={}){
    if(!endpoint())throw new Error('Der er ikke angivet en Apps Script-webadresse.');
    const response=await fetch(endpoint(),{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify({action,payload,clientVersion:'4.0'})});
    if(!response.ok)throw new Error(`Forbindelsen svarede med fejl ${response.status}.`);
    const result=await response.json();
    if(result?.ok===false)throw new Error(result.error||'Forbindelsen afviste handlingen.');
    return result;
  }
  async function sync(){
    if(!endpoint()){setState('Gemt på enheden','local');return;}
    setState('Synkroniserer…','working');
    try{
      const real=item=>!String(item.id||'').startsWith('demo-');
      const result=await request('sync',{version:app.db.version,customers:app.db.customers.filter(real),employees:app.db.employees.filter(real),entries:app.db.entries.filter(real),bookings:app.db.bookings.filter(real)});
      if(result?.customers?.length)app.db.customers=result.customers;
      if(result?.employees?.length)app.db.employees=result.employees;
      localStorage.setItem('gtp_data_v3',JSON.stringify(app.db));
      document.dispatchEvent(new CustomEvent('gtp:data',{detail:{action:'Synkroniseret'}}));
      setState('Synkroniseret','ok');
    }catch(error){console.warn('Synkronisering afventer',error);setState('Lokalt gemt · synkronisering afventer','error');}
  }
  app.provider={
    mode:()=>endpoint()?'google-sheets':'local',
    queueSync(){clearTimeout(syncTimer);syncTimer=setTimeout(sync,1200);},
    sync,
    async test(){return request('ping',{sentAt:new Date().toISOString()});},
    columns:{
      customers:['id','customerNumber','name','address','phone','email','defaultWorkType','notes','active'],
      employees:['id','name','email','phone','role','active'],
      entries:['id','date','customerId','employeeIds','start','end','breakMinutes','seconds','workType','note','completion','status','followUp','followUpNote','source'],
      bookings:['id','date','start','duration','customerId','employeeIds','note']
    }
  };
})(window.GTP);
