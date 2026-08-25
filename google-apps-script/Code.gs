const APP_VERSION = '5.7';
const SCHEMA_VERSION = 5;
const SPREADSHEET_ID = '1L7cf-mY_RD3UBDTqDSa7MJIweqxaxoFs2QC3pAcUjWI';
const APP_URL = 'https://ronnykisbye.github.io/tidstagning/';
const SYNC_KEYS = ['customers','addresses','employees','roles','employeeRoles','orders','orderAssignments','timeEntries','workTypes'];

const TABLES = {
  customers: {sheet:'Kunder', headers:['id','customerNumber','name','phone','email','defaultWorkType','notes','S','active']},
  addresses: {sheet:'Adresser', headers:['id','customerId','label','address','postalCode','city','active']},
  employees: {sheet:'Medarbejdere', headers:['id','name','email','phone','active']},
  roles: {sheet:'Roller', headers:['id','name','active']},
  employeeRoles: {sheet:'MedarbejderRoller', headers:['id','employeeId','roleId','active']},
  orders: {sheet:'Opgaver', headers:['id','customerId','addressId','date','start','duration','note','status','S','active']},
  orderAssignments: {sheet:'OpgaveMedarbejdere', headers:['id','orderId','employeeId','active']},
  timeEntries: {sheet:'Tidsregistreringer', headers:['id','registrationId','orderId','customerId','employeeId','start','end','breakMinutes','seconds','workType','note','completion','status','followUp','followUpNote','source']},
  workTypes: {sheet:'Arbejdstyper', headers:['id','name','active']},
  audit: {sheet:'Ændringslog', headers:['id','at','employeeId','action']},
  invitations: {sheet:'Invitationer', headers:['id','employeeId','tokenHash','expiresAt','usedAt','createdAt','createdBy','active']},
  devices: {sheet:'Enheder', headers:['id','employeeId','tokenHash','deviceLabel','createdAt','lastSeenAt','revokedAt','active','createdFromInviteId']}
};

function workbook_(){ return SpreadsheetApp.openById(SPREADSHEET_ID); }
function doGet(){ return json_({ok:true,service:'GreenTime Pro',version:APP_VERSION,schemaVersion:SCHEMA_VERSION}); }

function doPost(event){
  try{
    const request = JSON.parse((event && event.postData && event.postData.contents) || '{}');
    const action = String(request.action || '');
    if(action === 'ping') return json_({ok:true,action:'pong',version:APP_VERSION,schemaVersion:SCHEMA_VERSION,at:new Date().toISOString()});
    if(action === 'activate') return json_(activate_(request));
    const auth = authorize_(request.deviceToken);
    if(action === 'pull') return json_(scopedData_(auth));
    if(action === 'sync') return json_(sync_(auth, request.payload || {}));
    if(action === 'saveEmployee') return json_(saveEmployee_(auth, request.employee || {}, request.roles || []));
    if(action === 'createInvite') return json_(createInvite_(auth, request.employeeId, request.ttlHours));
    if(action === 'employeeAccess') return json_(employeeAccess_(auth, request.employeeId));
    if(action === 'revokeDevice') return json_(revokeDevice_(auth, request.deviceId));
    return json_({ok:false,error:'Ukendt handling'});
  }catch(error){ return json_({ok:false,error:String(error && error.message ? error.message : error)}); }
}

function activate_(request){
  const rawToken = String(request.inviteToken || '').trim();
  const name = normalizeName_(request.name || '');
  if(!rawToken || !name) throw new Error('Invitation og navn er påkrævet.');
  const invitation = read_('invitations').find(x => x.active !== false && !x.usedAt && x.tokenHash === hash_(rawToken));
  if(!invitation) throw new Error('Invitationen er ugyldig eller allerede brugt.');
  if(!invitation.expiresAt || new Date(invitation.expiresAt).getTime() <= Date.now()) throw new Error('Invitationen er udløbet. Bed Chefen sende et nyt link.');
  const employee = activeEmployee_(invitation.employeeId);
  if(!employee) throw new Error('Medarbejderen er ikke aktiv.');
  if(normalizeName_(employee.name) !== name) throw new Error('Navnet passer ikke til invitationen.');
  const deviceToken = secureToken_(), now = new Date().toISOString();
  const device = {id:'device-'+Utilities.getUuid(),employeeId:employee.id,tokenHash:hash_(deviceToken),deviceLabel:String(request.deviceLabel||'GreenTime-enhed').slice(0,100),createdAt:now,lastSeenAt:now,revokedAt:'',active:true,createdFromInviteId:invitation.id};
  invitation.usedAt=now; invitation.active=false;
  upsert_('invitations',[invitation],false); upsert_('devices',[device],false); audit_('DEVICE ACTIVATE '+employee.id,employee.id);
  const roles=employeeRoleIds_(employee.id);
  return {ok:true,version:APP_VERSION,schemaVersion:SCHEMA_VERSION,deviceToken,employee:{id:employee.id,name:employee.name},roles,isChef:roles.includes('role-chef')};
}

function authorize_(rawToken){
  rawToken=String(rawToken||'').trim(); if(!rawToken)throw new Error('Denne enhed er ikke aktiveret.');
  const tokenHash=hash_(rawToken),device=read_('devices').find(x=>x.active!==false&&!x.revokedAt&&x.tokenHash===tokenHash);
  if(!device)throw new Error('Enhedens adgang er ugyldig eller tilbagekaldt.');
  const employee=activeEmployee_(device.employeeId); if(!employee)throw new Error('Medarbejderen er ikke aktiv.');
  device.lastSeenAt=new Date().toISOString(); upsert_('devices',[device],false);
  const roles=employeeRoleIds_(employee.id); return {device,employee,roles,isChef:roles.includes('role-chef')};
}
function assertChef_(auth){ if(!auth||!auth.isChef)throw new Error('Kun Chef har adgang til denne handling.'); }
function scopedData_(auth){ return auth.isChef?fullData_(auth):employeeData_(auth); }
function fullData_(auth){ return {ok:true,version:APP_VERSION,schemaVersion:SCHEMA_VERSION,scope:'chef',currentEmployeeId:auth.employee.id,customers:read_('customers'),addresses:read_('addresses'),employees:read_('employees'),roles:read_('roles'),employeeRoles:read_('employeeRoles'),orders:read_('orders'),orderAssignments:read_('orderAssignments'),timeEntries:read_('timeEntries'),workTypes:read_('workTypes'),audit:read_('audit')}; }

function employeeData_(auth){
  const employeeId=auth.employee.id,allAssignments=read_('orderAssignments').filter(x=>x.active!==false),ownAssignments=allAssignments.filter(x=>x.employeeId===employeeId),orderIds=new Set(ownAssignments.map(x=>x.orderId));
  const orders=read_('orders').filter(x=>x.active!==false&&orderIds.has(x.id)).map(order=>{const copy=Object.assign({},order);copy.teamSize=allAssignments.filter(x=>x.orderId===order.id).length;return copy;});
  const timeEntries=read_('timeEntries').filter(x=>x.employeeId===employeeId),customerIds=new Set(); orders.forEach(x=>x.customerId&&customerIds.add(x.customerId)); timeEntries.forEach(x=>x.customerId&&customerIds.add(x.customerId));
  const customers=read_('customers').filter(x=>x.active!==false&&customerIds.has(x.id)),addresses=read_('addresses').filter(x=>x.active!==false&&customerIds.has(x.customerId)),employeeRoles=read_('employeeRoles').filter(x=>x.active!==false&&x.employeeId===employeeId),roleIds=new Set(employeeRoles.map(x=>x.roleId)),roles=read_('roles').filter(x=>roleIds.has(x.id));
  return {ok:true,version:APP_VERSION,schemaVersion:SCHEMA_VERSION,scope:'employee',currentEmployeeId:employeeId,customers,addresses,employees:[auth.employee],roles,employeeRoles,orders,orderAssignments:ownAssignments,timeEntries,workTypes:read_('workTypes').filter(x=>x.active!==false),audit:[]};
}

function sync_(auth,payload){
  rejectDemoPayload_(payload);
  if(auth.isChef){ SYNC_KEYS.forEach(key=>upsert_(key,Array.isArray(payload[key])?payload[key]:[])); upsert_('audit',Array.isArray(payload.audit)?payload.audit:[],false); }
  else{
    const rows=Array.isArray(payload.timeEntries)?payload.timeEntries:[];
    rows.forEach(row=>{if(row.employeeId!==auth.employee.id)throw new Error('Medarbejderen må kun gemme egne tidsregistreringer.');if(!row.id||String(row.id).startsWith('demo-'))throw new Error('Ugyldig tidsregistrering.');});
    upsert_('timeEntries',rows); audit_('EMPLOYEE SYNC '+rows.length+' timeEntries',auth.employee.id);
  }
  return scopedData_(auth);
}

function saveEmployee_(auth,employee,roles){
  assertChef_(auth);
  if(!employee || !employee.id) throw new Error('Medarbejderen mangler id.');
  if(String(employee.id).startsWith('demo-')) throw new Error('Demo-data må ikke gemmes.');
  const clean={id:String(employee.id),name:String(employee.name||'').trim(),email:String(employee.email||'').trim(),phone:String(employee.phone||'').trim(),active:employee.active!==false};
  if(!clean.name) throw new Error('Medarbejderen mangler navn.');
  writeOne_('employees',clean);
  const requested=new Set((Array.isArray(roles)?roles:[]).filter(x=>x==='role-chef'||x==='role-medarbejder'));
  requested.add('role-medarbejder');
  ['role-medarbejder','role-chef'].forEach(roleId=>writeOne_('employeeRoles',{id:clean.id+'-'+roleId,employeeId:clean.id,roleId,active:requested.has(roleId)}));
  audit_('EMPLOYEE SAVE '+clean.id,auth.employee.id);
  return {ok:true,employee:clean,roles:[...requested]};
}

function createInvite_(auth,employeeId,ttlHours){
  assertChef_(auth); const employee=activeEmployee_(String(employeeId||'')); if(!employee)throw new Error('Medarbejderen findes ikke eller er arkiveret.');
  read_('invitations').filter(x=>x.employeeId===employee.id&&x.active!==false&&!x.usedAt).forEach(x=>{x.active=false;upsert_('invitations',[x],false);});
  const token=secureToken_(),hours=Math.min(168,Math.max(1,Number(ttlHours||48))),now=new Date(),invitation={id:'invite-'+Utilities.getUuid(),employeeId:employee.id,tokenHash:hash_(token),expiresAt:new Date(now.getTime()+hours*3600000).toISOString(),usedAt:'',createdAt:now.toISOString(),createdBy:auth.employee.id,active:true};
  upsert_('invitations',[invitation],false); audit_('INVITE CREATE '+employee.id,auth.employee.id);
  return {ok:true,employeeId:employee.id,employeeName:employee.name,expiresAt:invitation.expiresAt,inviteUrl:APP_URL+'?invite='+encodeURIComponent(token)};
}
function employeeAccess_(auth,employeeId){ assertChef_(auth);const id=String(employeeId||'');return {ok:true,invitations:read_('invitations').filter(x=>x.employeeId===id).map(x=>({id:x.id,expiresAt:x.expiresAt,usedAt:x.usedAt,createdAt:x.createdAt,active:x.active!==false})),devices:read_('devices').filter(x=>x.employeeId===id).map(x=>({id:x.id,deviceLabel:x.deviceLabel,createdAt:x.createdAt,lastSeenAt:x.lastSeenAt,revokedAt:x.revokedAt,active:x.active!==false}))}; }
function revokeDevice_(auth,deviceId){ assertChef_(auth);const device=read_('devices').find(x=>x.id===String(deviceId||''));if(!device)throw new Error('Enheden blev ikke fundet.');if(device.id===auth.device.id)throw new Error('Du kan ikke tilbagekalde den Chef-enhed, du bruger lige nu.');device.active=false;device.revokedAt=new Date().toISOString();upsert_('devices',[device],false);audit_('DEVICE REVOKE '+device.employeeId,auth.employee.id);return {ok:true}; }

function activeEmployee_(id){ return read_('employees').find(x=>x.id===id&&x.active!==false); }
function employeeRoleIds_(employeeId){ return read_('employeeRoles').filter(x=>x.employeeId===employeeId&&x.active!==false).map(x=>x.roleId); }
function normalizeName_(value){ return String(value||'').trim().replace(/\s+/g,' ').toLocaleLowerCase('da-DK'); }
function secureToken_(){ return (Utilities.getUuid()+Utilities.getUuid()+Utilities.getUuid()).replace(/-/g,''); }
function hash_(value){ return Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256,String(value),Utilities.Charset.UTF_8).map(b=>('0'+((b+256)%256).toString(16)).slice(-2)).join(''); }

function rejectDemoPayload_(payload){ Object.keys(payload||{}).forEach(key=>{const items=payload[key];if(!Array.isArray(items))return;items.forEach(item=>Object.keys(item||{}).forEach(field=>{const value=item[field];if(typeof value==='string'&&value.startsWith('demo-'))throw new Error('Demo-data må ikke sendes til virksomhedens regneark.');if(Array.isArray(value)&&value.some(v=>typeof v==='string'&&v.startsWith('demo-')))throw new Error('Demo-data må ikke sendes til virksomhedens regneark.');}));}); }

function sheet_(key){
  const config=TABLES[key],book=workbook_();
  let sheet=book.getSheetByName(config.sheet),schemaChanged=false;
  if(!sheet){sheet=book.insertSheet(config.sheet);schemaChanged=true;}
  let existing=[];
  if(sheet.getLastColumn()>0)existing=sheet.getRange(1,1,1,sheet.getLastColumn()).getValues()[0].map(v=>String(v).trim());
  config.headers.forEach(header=>{
    if(existing.includes(header))return;
    const col=Math.max(1,sheet.getLastColumn()+1);
    sheet.getRange(1,col).setValue(header);
    existing.push(header);
    schemaChanged=true;
  });
  if(schemaChanged){
    const map=headerMap_(sheet),width=Math.max(1,sheet.getLastColumn());
    sheet.getRange(1,1,1,width).setFontWeight('bold');
    sheet.setFrozenRows(1);
    applyCheckboxes_(sheet,map);
  }
  return sheet;
}
function headerMap_(sheet){ const width=Math.max(1,sheet.getLastColumn()),headers=sheet.getRange(1,1,1,width).getValues()[0],map={};headers.forEach((v,i)=>{const n=String(v).trim();if(n&&!map[n])map[n]=i+1;});return map; }
function applyCheckboxes_(sheet,map){ const rule=SpreadsheetApp.newDataValidation().requireCheckbox().build();['S','active','followUp'].forEach(h=>{const c=map[h];if(c)sheet.getRange(2,c,Math.max(1,sheet.getMaxRows()-1),1).setDataValidation(rule);}); }
function firstFreeRow_(sheet,idColumn){
  const maxRows=Math.max(2,sheet.getMaxRows());
  const values=sheet.getRange(2,idColumn,maxRows-1,1).getValues();
  const index=values.findIndex(row=>String(row[0]||'').trim()==='');
  if(index>=0)return index+2;
  sheet.insertRowAfter(maxRows);
  return maxRows+1;
}
function writeOne_(key,item){
  const config=TABLES[key],sheet=sheet_(key),columns=headerMap_(sheet),idColumn=columns.id;
  if(!idColumn)throw new Error('Mangler id-kolonne i '+config.sheet);
  const lastRow=sheet.getLastRow();
  let row=0;
  if(lastRow>1){const ids=sheet.getRange(2,idColumn,lastRow-1,1).getValues().flat().map(String);const found=ids.indexOf(String(item.id));if(found>=0)row=found+2;}
  if(!row)row=firstFreeRow_(sheet,idColumn);
  const width=Math.max(1,sheet.getLastColumn()),values=Array(width).fill('');
  if(row<=sheet.getLastRow()){
    const existing=sheet.getRange(row,1,1,width).getValues()[0];
    existing.forEach((value,index)=>values[index]=value);
  }
  config.headers.forEach(header=>{const col=columns[header];if(!col)return;let value=item[header];if(Array.isArray(value))value=JSON.stringify(value);if(value===undefined||value===null)value='';values[col-1]=value;});
  sheet.getRange(row,1,1,width).setValues([values]);
}
function upsert_(key,items,writeAudit){
  if(!items.length)return;
  const config=TABLES[key],sheet=sheet_(key),columns=headerMap_(sheet),idColumn=columns.id;
  if(!idColumn)throw new Error('Mangler id-kolonne i '+config.sheet);
  const lastRow=sheet.getLastRow(),ids=lastRow>1?sheet.getRange(2,idColumn,lastRow-1,1).getValues().flat().map(String):[],rowById=new Map(ids.map((id,i)=>[id,i+2])),auditEnabled=writeAudit!==false&&key!=='audit'&&key!=='devices'&&key!=='invitations',width=Math.max(1,sheet.getLastColumn());
  items.forEach(item=>{
    if(!item||!item.id)return;
    if(String(item.id).startsWith('demo-'))throw new Error('Demo-data må ikke gemmes.');
    let row=rowById.get(String(item.id)),isNew=!row;
    if(!row){row=Math.max(2,sheet.getLastRow()+1);rowById.set(String(item.id),row);}
    const values=isNew?Array(width).fill(''):sheet.getRange(row,1,1,width).getValues()[0];
    config.headers.forEach(header=>{
      const col=columns[header];if(!col)return;
      let value=item[header];if(Array.isArray(value))value=JSON.stringify(value);if(value===undefined||value===null)value='';
      values[col-1]=value;
    });
    sheet.getRange(row,1,1,width).setValues([values]);
    if(auditEnabled)audit_((isNew?'CREATE ':'UPDATE ')+config.sheet+' '+item.id,item.employeeId||'');
  });
}
function audit_(action,employeeId){
  const sheet=sheet_('audit'),columns=headerMap_(sheet),row=Math.max(2,sheet.getLastRow()+1),width=Math.max(1,sheet.getLastColumn()),values=Array(width).fill(''),item={id:'audit-'+Utilities.getUuid(),at:new Date().toISOString(),employeeId:employeeId||'',action};
  TABLES.audit.headers.forEach(h=>{if(columns[h])values[columns[h]-1]=item[h]||'';});
  sheet.getRange(row,1,1,width).setValues([values]);
}
function read_(key){ const config=TABLES[key],sheet=sheet_(key),columns=headerMap_(sheet),lastRow=sheet.getLastRow();if(lastRow<2)return[];return sheet.getRange(2,1,lastRow-1,Math.max(1,sheet.getLastColumn())).getValues().map(row=>{const item={};config.headers.forEach(header=>{const c=columns[header];let value=c?row[c-1]:'';if(['S','active','followUp'].includes(header))value=value===true||String(value).toLowerCase()==='true';if(value instanceof Date)value=value.toISOString();item[header]=value;});return item;}).filter(item=>item.id); }
function json_(value){ return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON); }
