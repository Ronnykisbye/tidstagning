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
  audit: {sheet:'Ændringslog', headers:['id','at','employeeId','action']}
};

function doGet() {
  return json_({ok:true,service:'GreenTime Pro',version:'5.0',schemaVersion:3});
}

function doPost(event) {
  try {
    const request=JSON.parse(event.postData.contents||'{}');
    if(request.action==='ping')return json_({ok:true,action:'pong',schemaVersion:3,at:new Date().toISOString()});
    if(request.action!=='sync')return json_({ok:false,error:'Ukendt handling'});
    const payload=request.payload||{};
    Object.keys(TABLES).forEach(key=>upsert_(key,payload[key]||[]));
    return json_({
      ok:true,schemaVersion:3,syncedAt:new Date().toISOString(),
      customers:read_('customers'),addresses:read_('addresses'),employees:read_('employees'),
      roles:read_('roles'),employeeRoles:read_('employeeRoles')
    });
  } catch(error) {
    return json_({ok:false,error:String(error.message||error)});
  }
}

function sheet_(key) {
  const config=TABLES[key],book=SpreadsheetApp.getActiveSpreadsheet();
  let sheet=book.getSheetByName(config.sheet);
  if(!sheet)sheet=book.insertSheet(config.sheet);
  if(sheet.getLastRow()>0) {
    const existing=sheet.getRange(1,1,1,Math.max(1,sheet.getLastColumn())).getValues()[0].map(String);
    config.headers.forEach((header,index)=>{
      if(existing.includes(header))return;
      const column=index+1;
      sheet.insertColumnBefore(column);
      existing.splice(index,0,header);
    });
  }
  sheet.getRange(1,1,1,config.headers.length).setValues([config.headers]).setFontWeight('bold');
  sheet.setFrozenRows(1);
  applyCheckboxes_(sheet,config.headers);
  return sheet;
}

function applyCheckboxes_(sheet,headers) {
  const rule=SpreadsheetApp.newDataValidation().requireCheckbox().build();
  ['S','active','followUp'].forEach(header=>{
    const column=headers.indexOf(header)+1;
    if(column>0)sheet.getRange(2,column,Math.max(1,sheet.getMaxRows()-1),1).setDataValidation(rule);
  });
}

function upsert_(key,items) {
  const config=TABLES[key],sheet=sheet_(key);
  if(!items.length)return;
  const lastRow=sheet.getLastRow();
  const ids=lastRow>1?sheet.getRange(2,1,lastRow-1,1).getValues().flat().map(String):[];
  const rowById=new Map(ids.map((id,index)=>[id,index+2]));
  items.forEach(item=>{
    if(!item.id)return;
    const values=config.headers.map(header=>{
      const value=item[header];
      if(Array.isArray(value))return JSON.stringify(value);
      return value===undefined||value===null?'':value;
    });
    const row=rowById.get(String(item.id));
    if(row)sheet.getRange(row,1,1,values.length).setValues([values]);
    else {sheet.appendRow(values);rowById.set(String(item.id),sheet.getLastRow());}
  });
  sheet.autoResizeColumns(1,config.headers.length);
}

function read_(key) {
  const config=TABLES[key],sheet=sheet_(key),lastRow=sheet.getLastRow();
  if(lastRow<2)return [];
  return sheet.getRange(2,1,lastRow-1,config.headers.length).getValues().filter(row=>row[0]).map(row=>{
    const item={};
    config.headers.forEach((header,index)=>{
      let value=row[index];
      if(['S','active','followUp'].includes(header))value=value===true||String(value).toLowerCase()==='true';
      item[header]=value;
    });
    return item;
  });
}

function json_(value) {
  return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON);
}
