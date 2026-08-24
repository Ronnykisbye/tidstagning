(function(app){
  let syncTimer;
  const WORK_TYPES=['Service','Rengøring','Vedligeholdelse','Reparation','Tilsyn','Levering','Andet'];
  const real=item=>!String(item.id||'').startsWith('demo-');
  function endpoint(){return String(app.db.settings?.sheetEndpoint||'').trim();}
  function setState(text,state='local'){const node=document.getElementById('syncState');if(!node)return;node.textContent=text;node.dataset.state=state;}
  async function request(action,payload={}){
    if(!endpoint())throw new Error('Der er ikke angivet en Apps Script-webadresse.');
    const response=await fetch(endpoint(),{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify({action,payload,clientVersion:'5.3'})});
    if(!response.ok)throw new Error(`Forbindelsen svarede med fejl ${response.status}.`);
    const result=await response.json();if(result?.ok===false)throw new Error(result.error||'Forbindelsen afviste handlingen.');return result;
  }
  function normalizedPayload(){
    const customers=app.db.customers.filter(real).map(({address,role,...customer})=>customer);
    const addresses=app.db.addresses.filter(real);
    const employees=app.db.employees.filter(real).map(({role,...employee})=>employee);
    const roles=app.db.roles.filter(real);
    const employeeRoles=app.db.employeeRoles.filter(real);
    const orders=app.db.bookings.filter(real).map(booking=>({
      id:booking.id,customerId:booking.customerId,addressId:booking.addressId||app.customerAddress(booking.customerId)?.id||'',date:booking.date,start:booking.start,duration:booking.duration,
      note:booking.note||'',status:booking.status||'Planlagt',S:Boolean(booking.S),active:booking.active!==false
    }));
    const orderAssignments=app.db.bookings.filter(real).flatMap(booking=>(booking.employeeIds||[]).filter(id=>!id.startsWith('demo-')).map(employeeId=>({id:`${booking.id}-${employeeId}`,orderId:booking.id,employeeId,active:true})));
    const timeEntries=app.db.entries.filter(real).flatMap(entry=>(entry.employeeIds||[entry.employeeId]).filter(Boolean).filter(id=>!id.startsWith('demo-')).map(employeeId=>({
      id:`${entry.id}-${employeeId}`,registrationId:entry.id,orderId:entry.orderId||'',customerId:entry.customerId,employeeId,start:entry.start,end:entry.end,breakMinutes:entry.breakMinutes||0,
      seconds:entry.seconds,workType:entry.workType||'',note:entry.note||'',completion:entry.completion||0,status:entry.status||'',followUp:Boolean(entry.followUp),followUpNote:entry.followUpNote||'',source:entry.source||'local'
    })));
    const workTypes=WORK_TYPES.map((name,index)=>({id:`work-${index+1}`,name,active:true}));
    const audit=app.db.audit.filter(real).map(item=>({id:item.id,at:item.at,employeeId:item.employeeId||'',action:item.action}));
    return {version:4,customers,addresses,employees,roles,employeeRoles,orders,orderAssignments,timeEntries,workTypes,audit};
  }
  function applyRemote(result){
    if(result?.addresses?.length)app.db.addresses=result.addresses;
    if(result?.roles?.length)app.db.roles=result.roles;
    if(result?.employeeRoles?.length)app.db.employeeRoles=result.employeeRoles;
    if(result?.customers?.length){
      app.db.customers=result.customers.map(customer=>({...customer,address:app.db.addresses.find(x=>x.customerId===customer.id&&x.active!==false)?.address||''}));
    }
    if(result?.employees?.length){
      app.db.employees=result.employees.map(employee=>{
        const link=app.db.employeeRoles.find(x=>x.employeeId===employee.id&&x.active!==false),role=app.db.roles.find(x=>x.id===link?.roleId)?.name||'Medarbejder';
        return {...employee,role};
      });
    }
  }
  async function sync(){
    if(!endpoint()){setState('Gemt på enheden','local');return;}
    setState('Synkroniserer…','working');
    try{
      const result=await request('sync',normalizedPayload());applyRemote(result);
      localStorage.setItem('gtp_data_v4',JSON.stringify(app.db));
      document.dispatchEvent(new CustomEvent('gtp:data',{detail:{action:'Synkroniseret'}}));setState('Synkroniseret','ok');
    }catch(error){console.warn('Synkronisering afventer',error);setState('Lokalt gemt · synkronisering afventer','error');}
  }
  app.provider={
    mode:()=>endpoint()?'google-sheets':'local',queueSync(){clearTimeout(syncTimer);syncTimer=setTimeout(sync,1200);},sync,
    async test(){return request('ping',{sentAt:new Date().toISOString()});},
    normalizedPayload,
    columns:{
      customers:['id','customerNumber','name','phone','email','defaultWorkType','notes','S','active'],
      addresses:['id','customerId','label','address','postalCode','city','active'],
      employees:['id','name','email','phone','active'],
      roles:['id','name','active'],
      employeeRoles:['id','employeeId','roleId','active'],
      orders:['id','customerId','addressId','date','start','duration','note','status','S','active'],
      orderAssignments:['id','orderId','employeeId','active'],
      timeEntries:['id','registrationId','orderId','customerId','employeeId','start','end','breakMinutes','seconds','workType','note','completion','status','followUp','followUpNote','source'],
      workTypes:['id','name','active'],
      audit:['id','at','employeeId','action']
    }
  };
})(window.GTP);
