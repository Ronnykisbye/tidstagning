(function(app){
  const hours=value=>(Number(value||0)/3600);
  const fmtHours=value=>Number(value||0).toFixed(2).replace('.',',');
  const dateOfEntry=entry=>{
    if(entry.start)return String(entry.start).slice(0,10);
    if(entry.orderId)return app.db.bookings.find(x=>x.id===entry.orderId)?.date||'';
    return '';
  };
  const assignedNames=entry=>(entry.employeeIds||[entry.employeeId]).map(id=>app.employee(id)?.name).filter(Boolean);
  const historicalOrders=()=>app.db.bookings.filter(x=>String(x.id||'').startsWith('legacy-order-')&&Number(x.duration||0)>0&&x.active!==false);
  const representedOrderIds=()=>new Set(app.db.entries.map(x=>x.orderId).filter(Boolean));
  const periodMatch=(date,from,to)=>(!from||date>=from)&&(!to||date<=to);

  function ensureReportControls(){
    const filters=document.querySelector('#reportsPage .filters');if(!filters||document.getElementById('reportType'))return;
    const first=filters.firstElementChild;
    const label=document.createElement('label');
    label.innerHTML='Rapporttype<select id="reportType"><option value="details">Detaljeret tidsrapport</option><option value="employee">Timer for medarbejder</option><option value="customer">Timer hos kunde</option><option value="customer-summary">Samlet timeforbrug pr. kunde</option><option value="employee-summary">Samlet timeforbrug pr. medarbejder</option><option value="unfinished">Ikke færdige registreringer</option><option value="followup">Kræver opfølgning</option></select>';
    filters.insertBefore(label,first);
    const note=document.createElement('p');note.id='reportDataNote';note.className='wide';note.textContent='Gamle Sheet-data med sikkert tidsforbrug indgår. Gamle gruppetimer fordeles ikke på medarbejdere.';filters.appendChild(note);
  }

  function baseEntryRows(){
    return app.db.entries.map(entry=>({
      kind:'entry',id:entry.id,orderId:entry.orderId||'',date:dateOfEntry(entry),customerId:entry.customerId||'',employeeIds:entry.employeeIds||[entry.employeeId].filter(Boolean),
      seconds:Number(entry.seconds||0),status:entry.status||'',completion:Number(entry.completion||0),followUp:Boolean(entry.followUp),note:entry.note||'',workType:entry.workType||'',source:entry.source||''
    }));
  }
  function legacyOrderRows(){
    const represented=representedOrderIds();
    return historicalOrders().filter(order=>!represented.has(order.id)).map(order=>({
      kind:'legacy-order',id:order.id,orderId:order.id,date:order.date||'',customerId:order.customerId||'',employeeIds:[],seconds:Number(order.duration||0)*3600,status:order.status||'',completion:/færdigt/i.test(order.status||'')&&!/75%/.test(order.status||'')?100:(/75%/.test(order.status||'')?75:0),followUp:false,note:order.note||'',workType:'',source:'legacy-order'
    }));
  }
  function allRows(includeLegacyOrders=true){return [...baseEntryRows(),...(includeLegacyOrders?legacyOrderRows():[])];}
  function filters(){return {type:document.getElementById('reportType')?.value||'details',from:document.getElementById('reportFrom').value,to:document.getElementById('reportTo').value,customer:document.getElementById('reportCustomer').value,employee:document.getElementById('reportEmployee').value};}
  function filteredRows(){
    const f=filters(),needsEmployee=Boolean(f.employee)||f.type==='employee'||f.type==='employee-summary';
    let rows=allRows(!needsEmployee);
    rows=rows.filter(row=>periodMatch(row.date,f.from,f.to));
    if(f.customer)rows=rows.filter(row=>row.customerId===f.customer);
    if(f.employee)rows=rows.filter(row=>row.employeeIds.includes(f.employee));
    if(f.type==='unfinished')rows=rows.filter(row=>row.completion<100&&!/færdigt/i.test(row.status||''));
    if(f.type==='followup')rows=rows.filter(row=>row.followUp||/opfølg/i.test(row.status||''));
    return rows;
  }
  function setHeaders(labels){const head=document.querySelector('#reportTable thead tr');if(head)head.innerHTML=labels.map(x=>`<th>${app.escape(x)}</th>`).join('');}
  function renderDetails(rows){
    setHeaders(['Dato','Kunde','Medarbejdere','Status','Færdig','Timer']);
    const body=document.querySelector('#reportTable tbody');
    body.innerHTML=rows.map(row=>`<tr><td>${row.date?new Date(row.date+'T12:00:00').toLocaleDateString('da-DK'):''}</td><td>${app.escape(app.customer(row.customerId)?.name||'')}</td><td>${app.escape(row.employeeIds.length?row.employeeIds.map(id=>app.employee(id)?.name).filter(Boolean).join(', '):(row.kind==='legacy-order'?'Historisk gruppedata':''))}</td><td>${app.escape(row.status||'')}</td><td>${row.completion||0} %</td><td>${fmtHours(hours(row.seconds))}</td></tr>`).join('');
    return rows.reduce((sum,row)=>sum+row.seconds,0);
  }
  function renderGrouped(rows,keyFn,nameFn){
    const grouped=new Map();
    rows.forEach(row=>{const key=keyFn(row);if(!key)return;grouped.set(key,(grouped.get(key)||0)+row.seconds);});
    const data=[...grouped.entries()].map(([key,seconds])=>({key,name:nameFn(key),seconds})).sort((a,b)=>b.seconds-a.seconds);
    setHeaders(['Navn','Timer']);
    document.querySelector('#reportTable tbody').innerHTML=data.map(x=>`<tr><td>${app.escape(x.name||'Ukendt')}</td><td>${fmtHours(hours(x.seconds))}</td></tr>`).join('');
    return data.reduce((sum,x)=>sum+x.seconds,0);
  }
  function run(){
    const f=filters(),rows=filteredRows();let total=0;
    if(f.type==='customer-summary')total=renderGrouped(rows,row=>row.customerId,id=>app.customer(id)?.name||id);
    else if(f.type==='employee-summary'){
      const expanded=[];rows.forEach(row=>row.employeeIds.forEach(employeeId=>expanded.push({...row,employeeId})));
      total=renderGrouped(expanded,row=>row.employeeId,id=>app.employee(id)?.name||id);
    } else if(f.type==='employee'&&!f.employee){
      const expanded=[];rows.forEach(row=>row.employeeIds.forEach(employeeId=>expanded.push({...row,employeeId})));
      total=renderGrouped(expanded,row=>row.employeeId,id=>app.employee(id)?.name||id);
    } else if(f.type==='customer'&&!f.customer)total=renderGrouped(rows,row=>row.customerId,id=>app.customer(id)?.name||id);
    else total=renderDetails(rows);
    document.getElementById('reportTotal').textContent=`I alt: ${fmtHours(hours(total))} timer`;
    const note=document.getElementById('reportDataNote');if(note)note.textContent=(f.employee||f.type==='employee'||f.type==='employee-summary')?'Medarbejderrapporter bruger kun timer, der kan knyttes sikkert til en medarbejder. Gamle gruppetimer er udeladt.':'Gamle Sheet-data med sikkert tidsforbrug indgår. Historiske gruppetimer tælles én gang i kundetotaler og samlede detailrapporter.';
    return rows;
  }
  function csvRows(){
    const rows=filteredRows();
    return rows.map(row=>[row.date,app.customer(row.customerId)?.name||'',row.employeeIds.map(id=>app.employee(id)?.name).filter(Boolean).join(', '),row.status||'',row.completion||0,fmtHours(hours(row.seconds)),row.note||'',row.source||'']);
  }
  app.renderAudit=function(){const node=document.getElementById('auditList');if(!node)return;node.innerHTML=app.db.audit.slice(0,100).map(x=>`<li><time>${new Date(x.at).toLocaleString('da-DK')}</time>${app.escape(x.action)}</li>`).join('')||'<li>Ingen hændelser endnu.</li>';};
  app.initReports=function(){
    ensureReportControls();
    document.getElementById('runReport').onclick=run;
    document.getElementById('reportType').onchange=run;
    document.getElementById('exportCsv').onclick=()=>{
      run();const header=['Dato','Kunde','Medarbejdere','Status','Færdig procent','Timer','Beskrivelse','Kilde'];
      const csv=[header,...csvRows()].map(row=>row.map(value=>`"${String(value??'').replaceAll('"','""')}"`).join(';')).join('\n'),link=document.createElement('a');
      link.href=URL.createObjectURL(new Blob(['\ufeff'+csv],{type:'text/csv'}));link.download='greentime-rapport.csv';link.click();URL.revokeObjectURL(link.href);
    };
    document.addEventListener('gtp:data',()=>{app.renderAudit();run();});app.renderAudit();run();
  };
})(window.GTP);
