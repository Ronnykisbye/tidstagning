const TABLES = {
  customers: {sheet:'Kunder', headers:['id','customerNumber','name','address','phone','email','defaultWorkType','notes','active']},
  employees: {sheet:'Medarbejdere', headers:['id','name','email','phone','role','active']},
  entries: {sheet:'Tidsregistreringer', headers:['id','customerId','employeeIds','start','end','breakMinutes','seconds','workType','note','completion','status','followUp','followUpNote','source']},
  bookings: {sheet:'Bookinger', headers:['id','date','start','duration','customerId','employeeIds','note']}
};

function doGet() {
  return json_({ok:true, service:'GreenTime Pro', version:'4.0'});
}

function doPost(event) {
  try {
    const request=JSON.parse(event.postData.contents||'{}');
    if(request.action==='ping')return json_({ok:true, action:'pong', at:new Date().toISOString()});
    if(request.action!=='sync')return json_({ok:false, error:'Ukendt handling'});
    const payload=request.payload||{};
    Object.keys(TABLES).forEach(key=>upsert_(key,payload[key]||[]));
    return json_({ok:true,customers:read_('customers'),employees:read_('employees'),syncedAt:new Date().toISOString()});
  } catch(error) {
    return json_({ok:false,error:String(error.message||error)});
  }
}

function sheet_(key) {
  const config=TABLES[key],book=SpreadsheetApp.getActiveSpreadsheet();
  let sheet=book.getSheetByName(config.sheet);
  if(!sheet)sheet=book.insertSheet(config.sheet);
  if(sheet.getLastRow()===0)sheet.getRange(1,1,1,config.headers.length).setValues([config.headers]).setFontWeight('bold');
  return sheet;
}

function upsert_(key, items) {
  if(!items.length)return;
  const config=TABLES[key],sheet=sheet_(key),lastRow=sheet.getLastRow();
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
      if(header==='employeeIds'){try{value=JSON.parse(value||'[]');}catch(e){value=[];}}
      if(['active','followUp'].includes(header))value=value===true||String(value).toLowerCase()==='true';
      item[header]=value;
    });
    return item;
  });
}

function json_(value) {
  return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON);
}
