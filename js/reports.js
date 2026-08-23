(function(app){
  function filtered(){
    const from=document.getElementById('reportFrom').value,to=document.getElementById('reportTo').value,customer=document.getElementById('reportCustomer').value,employee=document.getElementById('reportEmployee').value;
    return app.db.entries.filter(x=>(!from||x.start.slice(0,10)>=from)&&(!to||x.start.slice(0,10)<=to)&&(!customer||x.customerId===customer)&&(!employee||(x.employeeIds||[x.employeeId]).includes(employee)));
  }
  function run(){
    const rows=filtered(),body=document.querySelector('#reportTable tbody');
    body.innerHTML=rows.map(x=>`<tr><td>${new Date(x.start).toLocaleDateString('da-DK')}</td><td>${app.escape(app.customer(x.customerId)?.name||'')}</td><td>${(x.employeeIds||[x.employeeId]).map(id=>app.employee(id)?.name).filter(Boolean).join(', ')}</td><td>${app.escape(x.status||'Færdig')}</td><td>${Number(x.completion||0)} %</td><td>${(x.seconds/3600).toFixed(2).replace('.',',')}</td></tr>`).join('');
    document.getElementById('reportTotal').textContent=`I alt: ${(rows.reduce((sum,x)=>sum+Number(x.seconds||0),0)/3600).toFixed(2).replace('.',',')} timer`;return rows;
  }
  app.renderAudit=function(){document.getElementById('auditList').innerHTML=app.db.audit.slice(0,100).map(x=>`<li><time>${new Date(x.at).toLocaleString('da-DK')}</time>${app.escape(x.action)}</li>`).join('')||'<li>Ingen hændelser endnu.</li>';};
  app.initReports=function(){
    document.getElementById('runReport').onclick=run;
    document.getElementById('exportCsv').onclick=()=>{
      const rows=run(),header=['Dato','Kunde','Adresse','Medarbejdere','Start','Slut','Pause minutter','Timer','Arbejdstype','Status','Færdig procent','Opfølgning','Beskrivelse','Opfølgningsnote'];
      const values=rows.map(x=>[x.start.slice(0,10),app.customer(x.customerId)?.name||'',app.customer(x.customerId)?.address||'',(x.employeeIds||[]).map(id=>app.employee(id)?.name).filter(Boolean).join(', '),new Date(x.start).toLocaleTimeString('da-DK',{hour:'2-digit',minute:'2-digit'}),new Date(x.end).toLocaleTimeString('da-DK',{hour:'2-digit',minute:'2-digit'}),x.breakMinutes||0,(x.seconds/3600).toFixed(2),x.workType||'',x.status||'',x.completion||0,x.followUp?'Ja':'Nej',x.note||'',x.followUpNote||'']);
      const csv=[header,...values].map(row=>row.map(value=>`"${String(value).replaceAll('"','""')}"`).join(';')).join('\n'),link=document.createElement('a');link.href=URL.createObjectURL(new Blob(['\ufeff'+csv],{type:'text/csv'}));link.download='greentime-rapport.csv';link.click();URL.revokeObjectURL(link.href);
    };
    document.addEventListener('gtp:data',app.renderAudit);app.renderAudit();
  };
})(window.GTP);
