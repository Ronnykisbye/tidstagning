const APP_VERSION = '5.6';
const SCHEMA_VERSION = 4;
const SPREADSHEET_ID = '1L7cf-mY_RD3UBDTqDSa7MJIweqxaxoFs2QC3pAcUjWI';

const TABLES = {
  customers:{sheet:'Kunder',headers:['id','customerNumber','name','phone','email','defaultWorkType','notes','S','active']},
  addresses:{sheet:'Adresser',headers:['id','customerId','label','address','postalCode','city','active']},
  employees:{sheet:'Medarbejdere',headers:['id','name','email','phone','active']},
  roles:{sheet:'Roller',headers:['id','name','active']},
  employeeRoles:{sheet:'MedarbejderRoller',headers:['id','employeeId','roleId','active']},
  orders:{sheet:'Opgaver',headers:['id','customerId','addressId','date','start','duration','note','status','S','active']},
  orderAssignments:{sheet:'OpgaveMedarbejdere',headers:['id','orderId','employeeId','active']},
  timeEntries:{sheet:'Tidsregistreringer',headers:['id','registrationId','orderId','customerId','employeeId','start','end','breakMinutes','seconds','workType','note','completion','status','followUp','followUpNote','source']},
  workTypes:{sheet:'Arbejdstyper',headers:['id','name','active']},
  audit:{sheet:'Ændringslog',headers:['id','at','employeeId','action']}
};

function workbook_(){ return SpreadsheetApp.openById(SPREADSHEET_ID); }
function doGet(){ return json_({ok:true,service:'GreenTime Pro',version:APP_VERSION,schemaVersion:SCHEMA_VERSION,spreadsheetId:SPREADSHEET_ID}); }

function dataResponse_(){
  return {
    ok:true,version:APP_VERSION,schemaVersion:SCHEMA_VERSION,spreadsheetId:SPREADSHEET_ID,syncedAt:new Date().toISOString(),
    customers:read_('customers'),addresses:read_('addresses'),employees:read_('employees'),roles:read_('roles'),employeeRoles:read_('employeeRoles'),
    orders:read_('orders'),orderAssignments:read_('orderAssignments'),timeEntries:read_('timeEntries'),workTypes:read_('workTypes'),audit:read_('audit')
  };
}

function doPost(event){
  try{
    const request=JSON.parse((event&&event.postData&&event.postData.contents)||'{}');
    if(request.action==='ping') return json_({ok:true,action:'pong',version:APP_VERSION,schemaVersion:SCHEMA_VERSION,spreadsheetId:SPREADSHEET_ID,at:new Date().toISOString()});
    if(request.action==='pull') return json_(dataResponse_());
    if(request.action!=='sync') return json_({ok:false,error:'Ukendt handling'});
    const payload=request.payload||{};
    rejectDemoPayload_(payload);
    Object.keys(TABLES).forEach(key=>{ if(key!=='audit') upsert_(key,Array.isArray(payload[key])?payload[key]:[]); });
    upsert_('audit',Array.isArray(payload.audit)?payload.audit:[],false);
    return json_(dataResponse_());
  }catch(error){ return json_({ok:false,error:String(error&&error.message?error.message:error)}); }
}

function rejectDemoPayload_(payload){
  Object.keys(TABLES).forEach(key=>{
    const items=payload[key]; if(!Array.isArray(items))return;
    items.forEach(item=>Object.keys(item||{}).forEach(field=>{
      const value=item[field];
      if(typeof value==='string'&&value.startsWith('demo-')) throw new Error('Demo-data må ikke sendes til virksomhedens regneark.');
      if(Array.isArray(value)&&value.some(v=>typeof v==='string'&&v.startsWith('demo-'))) throw new Error('Demo-data må ikke sendes til virksomhedens regneark.');
    }));
  });
}

function sheet_(key){
  const config=TABLES[key],book=workbook_(); let sheet=book.getSheetByName(config.sheet); if(!sheet)sheet=book.insertSheet(config.sheet);
  let existing=[]; if(sheet.getLastColumn()>0)existing=sheet.getRange(1,1,1,sheet.getLastColumn()).getValues()[0].map(v=>String(v).trim());
  config.headers.forEach(header=>{ if(existing.includes(header))return; const c=Math.max(1,sheet.getLastColumn()+1); sheet.getRange(1,c).setValue(header); existing.push(header); });
  const map=headerMap_(sheet); config.headers.forEach(header=>sheet.getRange(1,map[header]).setFontWeight('bold')); sheet.setFrozenRows(1); applyCheckboxes_(sheet,map); return sheet;
}
function headerMap_(sheet){ const width=Math.max(1,sheet.getLastColumn()),headers=sheet.getRange(1,1,1,width).getValues()[0],map={}; headers.forEach((v,i)=>{const n=String(v).trim();if(n&&!map[n])map[n]=i+1;}); return map; }
function applyCheckboxes_(sheet,map){ const rule=SpreadsheetApp.newDataValidation().requireCheckbox().build(); ['S','active','followUp'].forEach(h=>{const c=map[h];if(c)sheet.getRange(2,c,Math.max(1,sheet.getMaxRows()-1),1).setDataValidation(rule);}); }

function upsert_(key,items,writeAudit){
  if(!items.length)return; const config=TABLES[key],sheet=sheet_(key),columns=headerMap_(sheet),idColumn=columns.id; if(!idColumn)throw new Error('Mangler id-kolonne i '+config.sheet);
  const lastRow=sheet.getLastRow(),ids=lastRow>1?sheet.getRange(2,idColumn,lastRow-1,1).getValues().flat().map(String):[],rowById=new Map(ids.map((id,i)=>[id,i+2]));
  items.forEach(item=>{
    if(!item||!item.id)return; if(String(item.id).startsWith('demo-'))throw new Error('Demo-data må ikke gemmes.');
    let row=rowById.get(String(item.id)),isNew=!row; if(!row){row=Math.max(2,sheet.getLastRow()+1);rowById.set(String(item.id),row);}
    config.headers.forEach(header=>{if(!columns[header])return;let value=item[header];if(Array.isArray(value))value=JSON.stringify(value);if(value===undefined||value===null)value='';sheet.getRange(row,columns[header]).setValue(value);});
    if(writeAudit!==false&&key!=='audit')audit_((isNew?'CREATE ':'UPDATE ')+config.sheet+' '+item.id,item.employeeId||'');
  });
}
function audit_(action,employeeId){ const sheet=sheet_('audit'),columns=headerMap_(sheet),row=Math.max(2,sheet.getLastRow()+1),values={id:'audit-'+Utilities.getUuid(),at:new Date().toISOString(),employeeId:employeeId||'',action}; TABLES.audit.headers.forEach(h=>sheet.getRange(row,columns[h]).setValue(values[h]||'')); }
function read_(key){
  const config=TABLES[key],sheet=sheet_(key),columns=headerMap_(sheet),lastRow=sheet.getLastRow(); if(lastRow<2)return [];
  return sheet.getRange(2,1,lastRow-1,Math.max(1,sheet.getLastColumn())).getValues().map(row=>{const item={};config.headers.forEach(header=>{const c=columns[header];let value=c?row[c-1]:'';if(['S','active','followUp'].includes(header))value=value===true||String(value).toLowerCase()==='true';item[header]=value;});return item;}).filter(item=>item.id);
}
function json_(value){ return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON); }
