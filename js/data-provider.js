(function(app){
  let syncTimer;
  const WORK_TYPES=['Service','Rengøring','Vedligeholdelse','Reparation','Tilsyn','Levering','Andet'];
  const real=item=>!String(item.id||'').startsWith('demo-');
  function endpoint(){return String(app.db.settings?.sheetEndpoint||'').trim();}
  function setState(text,state='local'){const node=document.getElementById('syncState');if(!node)return;node.textContent=text;node.dataset.state=state;}
  async function request(action,payload={}){
    if(!endpoint())throw new Error('Der er ikke angivet en Apps Script-webadresse.');
    const response=await fetch(endpoint(),{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify({action,payload,clientVersion:'5.4'})});
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
      id:`${entry.id}-${employeeId}`,registrationId:entry.registrationId||entry.id,orderId:entry.orderId||'',customerId:entry.customerId,employeeId,start:entry.start,end:entry.end,breakMinutes:entry.breakMinutes||0,
      seconds:entry.seconds,workType:entry.workType||'',note:entry.note||'',completion:entry.completion||0,status:entry.status||'',followUp:Boolean(entry.followUp),followUpNote:entry.followUpNote||'',source:entry.source||'local'
    })));
    const workTypes=WORK_TYPES.map((name,index)=>({id:`work-${index+1}`,name,active:true}));
    const audit=app.db.audit.filter(real).map(item=>({id:item.id,at:item.at,employeeId:item.employeeId||'',action:item.action}));
    return {version:4,customers,addresses,employees,roles,employeeRoles,orders,orderAssignments,timeEntries,workTypes,audit};
  }
  function groupTimeEntries(rows=[]){
    const grouped=new Map();
    rows.forEach(row=>{
      const key=String(row.registrationId||row.id||'');
      if(!key)return;
      let item=grouped.get(key);
      if(!item){
        item={id:key,registrationId:key,orderId:row.orderId||'',customerId:row.customerId||'',employeeIds:[],start:row.start||'',end:row.end||'',breakMinutes:Number(row.breakMinutes||0),seconds:Number(row.seconds||0),workType:row.workType||'',note:row.note||'',completion:Number(row.completion||0),status:row.status||'',followUp:Boolean(row.followUp),followUpNote:row.followUpNote||'',source:row.source||'google-sheet'};
        grouped.set(key,item);
      }
      if(row.employeeId&&!item.employeeIds.includes(row.employeeId))item.employeeIds.push(row.employeeId);
    });
    return [...grouped.values()];
  }
  function applyRemote(result){
    if(Array.isArray(result?.addresses))app.db.addresses=result.addresses;
    if(Array.isArray(result?.roles))app.db.roles=result.roles;
    if(Array.isArray(result?.employeeRoles))app.db.employeeRoles=result.employeeRoles;
    if(Array.isArray(result?.customers)){
      app.db.customers=result.customers.map(customer=>({...customer,address:app.db.addresses.find(x=>x.customerId===customer.id&&x.active!==false)?.address||''}));
    }
    if(Array.isArray(result?.employees)){
      app.db.employees=result.employees.map(employee=>{
        const chefRole=app.db.roles.find(x=>x.name==='Chef')?.id;
        const isChef=app.db.employeeRoles.some(x=>x.employeeId===employee.id&&x.roleId===chefRole&&x.active!==false);
        return {...employee,role:isChef?'Chef':'Medarbejder'};
      });
    }
    if(Array.isArray(result?.orders)){
      const assignments=Array.isArray(result.orderAssignments)?result.orderAssignments:[];
      app.db.bookings=result.orders.map(order=>({...order,employeeIds:assignments.filter(x=>x.orderId===order.id&&x.active!==false).map(x=>x.employeeId)}));
    }
    if(Array.isArray(result?.timeEntries))app.db.entries=groupTimeEntries(result.timeEntries);
    if(Array.isArray(result?.audit))app.db.audit=result.audit;
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
