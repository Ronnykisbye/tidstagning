(function(app){
  let syncTimer;
  const WORK_TYPES=['Service','Rengøring','Vedligeholdelse','Reparation','Tilsyn','Levering','Andet'];
  const DEVICE_KEY='gtp_device_token_v1',IDENTITY_KEY='gtp_device_identity_v1';
  const real=item=>!String(item.id||'').startsWith('demo-');
  const demo=item=>String(item.id||'').startsWith('demo-');
  function endpoint(){return String(app.db.settings?.sheetEndpoint||'').trim();}
  function deviceToken(){return localStorage.getItem(DEVICE_KEY)||'';}
  function identity(){try{return JSON.parse(localStorage.getItem(IDENTITY_KEY))||null;}catch{return null;}}
  function setState(text,state='local'){const node=document.getElementById('syncState');if(!node)return;node.textContent=text;node.dataset.state=state;}
  async function request(action,payload={},extra={}){
    if(!endpoint())throw new Error('Der er ikke angivet en Apps Script-webadresse.');
    const body={action,payload,clientVersion:'5.7',deviceToken:deviceToken(),...extra};
    const response=await fetch(endpoint(),{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(body)});
    if(!response.ok)throw new Error(`Forbindelsen svarede med fejl ${response.status}.`);
    const result=await response.json();if(result?.ok===false)throw new Error(result.error||'Forbindelsen afviste handlingen.');return result;
  }
  function normalizedPayload(){
    const timeEntries=app.db.entries.filter(real).flatMap(entry=>(entry.employeeIds||[entry.employeeId]).filter(Boolean).filter(id=>!id.startsWith('demo-')).map(employeeId=>({id:`${entry.id}-${employeeId}`,registrationId:entry.registrationId||entry.id,orderId:entry.orderId||'',customerId:entry.customerId,employeeId,start:entry.start,end:entry.end,breakMinutes:entry.breakMinutes||0,seconds:entry.seconds,workType:entry.workType||'',note:entry.note||'',completion:entry.completion||0,status:entry.status||'',followUp:Boolean(entry.followUp),followUpNote:entry.followUpNote||'',source:entry.source||'local'})));
    if(app.db.secureScope==='employee')return {version:5,timeEntries};
    const customers=app.db.customers.filter(real).map(({address,role,...customer})=>customer),addresses=app.db.addresses.filter(real),employees=app.db.employees.filter(real).map(({role,...employee})=>employee),roles=app.db.roles.filter(real),employeeRoles=app.db.employeeRoles.filter(real);
    const orders=app.db.bookings.filter(real).map(booking=>({id:booking.id,customerId:booking.customerId,addressId:booking.addressId||app.customerAddress(booking.customerId)?.id||'',date:booking.date,start:booking.start,duration:booking.duration,note:booking.note||'',status:booking.status||'Planlagt',S:Boolean(booking.S),active:booking.active!==false}));
    const orderAssignments=app.db.bookings.filter(real).flatMap(booking=>(booking.employeeIds||[]).filter(id=>!id.startsWith('demo-')).map(employeeId=>({id:`${booking.id}-${employeeId}`,orderId:booking.id,employeeId,active:true})));
    const workTypes=WORK_TYPES.map((name,index)=>({id:`work-${index+1}`,name,active:true})),audit=app.db.audit.filter(real).map(item=>({id:item.id,at:item.at,employeeId:item.employeeId||'',action:item.action}));
    return {version:5,customers,addresses,employees,roles,employeeRoles,orders,orderAssignments,timeEntries,workTypes,audit};
  }
  function groupTimeEntries(rows=[]){const grouped=new Map();rows.forEach(row=>{const key=String(row.registrationId||row.id||'');if(!key)return;let item=grouped.get(key);if(!item){item={id:key,registrationId:key,orderId:row.orderId||'',customerId:row.customerId||'',employeeIds:[],start:row.start||'',end:row.end||'',breakMinutes:Number(row.breakMinutes||0),seconds:Number(row.seconds||0),workType:row.workType||'',note:row.note||'',completion:Number(row.completion||0),status:row.status||'',followUp:Boolean(row.followUp),followUpNote:row.followUpNote||'',source:row.source||'google-sheet'};grouped.set(key,item);}if(row.employeeId&&!item.employeeIds.includes(row.employeeId))item.employeeIds.push(row.employeeId);});return [...grouped.values()];}
  function mergeKeepingDemo(current=[],remote=[],mapper=x=>x){const byId=new Map(current.filter(demo).map(item=>[String(item.id),item]));remote.map(mapper).forEach(item=>byId.set(String(item.id),item));return [...byId.values()];}
  function mapBookings(result){const assignments=Array.isArray(result.orderAssignments)?result.orderAssignments:[];return (result.orders||[]).map(order=>({...order,employeeIds:assignments.filter(x=>x.orderId===order.id&&x.active!==false).map(x=>x.employeeId),teamSize:Number(order.teamSize||assignments.filter(x=>x.orderId===order.id&&x.active!==false).length||0)}));}
  function employeeWithRole(employee){const chefRole=app.db.roles.find(x=>x.name==='Chef')?.id,isChef=app.db.employeeRoles.some(x=>x.employeeId===employee.id&&x.roleId===chefRole&&x.active!==false);return {...employee,role:isChef?'Chef':'Medarbejder'};}
  function applyRemote(result){
    const employeeScope=result?.scope==='employee';app.db.secureScope=result?.scope||app.db.secureScope||'';
    if(employeeScope){
      app.db.addresses=Array.isArray(result.addresses)?result.addresses:[];
      app.db.roles=Array.isArray(result.roles)?result.roles:[];
      app.db.employeeRoles=Array.isArray(result.employeeRoles)?result.employeeRoles:[];
      app.db.customers=(result.customers||[]).map(customer=>({...customer,address:app.db.addresses.find(x=>x.customerId===customer.id&&x.active!==false)?.address||''}));
      app.db.employees=(result.employees||[]).map(employeeWithRole);
      app.db.bookings=mapBookings(result);
      app.db.entries=groupTimeEntries(result.timeEntries||[]);
      app.db.audit=[];
      return;
    }
    if(Array.isArray(result?.addresses))app.db.addresses=mergeKeepingDemo(app.db.addresses,result.addresses);
    if(Array.isArray(result?.roles))app.db.roles=result.roles;
    if(Array.isArray(result?.employeeRoles))app.db.employeeRoles=mergeKeepingDemo(app.db.employeeRoles,result.employeeRoles);
    if(Array.isArray(result?.customers))app.db.customers=mergeKeepingDemo(app.db.customers,result.customers,customer=>({...customer,address:app.db.addresses.find(x=>x.customerId===customer.id&&x.active!==false)?.address||''}));
    if(Array.isArray(result?.employees))app.db.employees=mergeKeepingDemo(app.db.employees,result.employees,employeeWithRole);
    if(Array.isArray(result?.orders))app.db.bookings=mergeKeepingDemo(app.db.bookings,mapBookings(result));
    if(Array.isArray(result?.timeEntries))app.db.entries=mergeKeepingDemo(app.db.entries,groupTimeEntries(result.timeEntries));
    if(Array.isArray(result?.audit))app.db.audit=result.audit;
  }
  function persist(action){localStorage.setItem('gtp_data_v4',JSON.stringify(app.db));document.dispatchEvent(new CustomEvent('gtp:data',{detail:{action}}));}
  async function pull(){if(!endpoint()){setState('Gemt på enheden','local');return null;}if(!deviceToken())throw new Error('Denne enhed skal aktiveres via et installationslink fra Chefen.');setState('Henter sikre data…','working');try{const result=await request('pull');applyRemote(result);persist('Sikre data hentet');setState('Sikker forbindelse aktiv','ok');return result;}catch(error){setState('Adgang kræver ny aktivering','error');throw error;}}
  async function sync(){if(!endpoint())return null;if(!deviceToken())throw new Error('Denne enhed er ikke aktiveret.');setState('Synkroniserer…','working');try{const result=await request('sync',normalizedPayload());applyRemote(result);persist('Synkroniseret');setState('Synkroniseret','ok');return result;}catch(error){setState('Lokalt gemt · synkronisering afventer','error');throw error;}}
  async function syncNow(){clearTimeout(syncTimer);return sync();}
  async function activate(inviteToken,name,deviceLabel){const result=await request('activate',{}, {inviteToken,name,deviceLabel});localStorage.setItem(DEVICE_KEY,result.deviceToken);localStorage.setItem(IDENTITY_KEY,JSON.stringify({employeeId:result.employee.id,name:result.employee.name,isChef:Boolean(result.isChef),roles:result.roles||[]}));app.db.secureScope=result.isChef?'chef':'employee';localStorage.setItem('gtp_session_v1',JSON.stringify({mode:result.isChef?'manager':'employee',employeeId:result.employee.id}));return result;}
  async function createInvite(employeeId){return request('createInvite',{}, {employeeId,ttlHours:48});}
  async function employeeAccess(employeeId){return request('employeeAccess',{}, {employeeId});}
  async function revokeDevice(deviceId){return request('revokeDevice',{}, {deviceId});}
  function configureEndpoint(value){app.db.settings.sheetEndpoint=value;localStorage.setItem('gtp_data_v4',JSON.stringify(app.db));}
  app.provider={mode:()=>endpoint()?'google-sheets':'local',queueSync(){if(!deviceToken())return;clearTimeout(syncTimer);syncTimer=setTimeout(()=>sync().catch(()=>{}),1200);},pull,sync,syncNow,activate,createInvite,employeeAccess,revokeDevice,configureEndpoint,hasDeviceToken:()=>Boolean(deviceToken()),identity,test:()=>request('ping'),normalizedPayload};
})(window.GTP);
