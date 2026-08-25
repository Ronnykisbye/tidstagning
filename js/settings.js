(function(app){
  app.initSettings=function(){
    const endpoint=document.getElementById('sheetEndpoint');endpoint.value=app.db.settings?.sheetEndpoint||'';
    const refresh=()=>{document.getElementById('providerDescription').textContent=app.provider.mode()==='google-sheets'?'Google Regneark-forbindelsen er konfigureret. Data hentes fra Sheetet ved opstart, og nye ændringer synkroniseres automatisk.':'Appen bruger lokale demodata, indtil regnearket tilkobles.';};refresh();
    const refreshBio=async()=>{const enrolled=app.bio.enrolled(),supported=await app.bio.supported();document.getElementById('bioStatus').textContent=enrolled?'Bioadgang er aktiveret på denne enhed.':supported?'Bioadgang kan aktiveres på denne enhed.':'Bioadgang understøttes ikke på denne enhed.';document.getElementById('bioSetup').disabled=!supported;document.getElementById('bioSetup').textContent=enrolled?'Opret igen':'Aktivér bioadgang';document.getElementById('bioTest').disabled=!enrolled;document.getElementById('bioRemove').disabled=!enrolled;};refreshBio();
    document.getElementById('saveEndpoint').onclick=()=>{const value=endpoint.value.trim();if(value&&!/^https:\/\/script\.google\.com\/macros\/s\//.test(value))return alert('Brug webadressen fra en publiceret Google Apps Script-webapp.');app.db.settings.sheetEndpoint=value;app.save('Regnearksforbindelse opdateret');refresh();app.toast(value?'Forbindelsen er gemt':'Lokal lagring er valgt');};
    document.getElementById('testEndpoint').onclick=async()=>{
      const button=document.getElementById('testEndpoint');button.disabled=true;button.textContent='Tester…';
      try{
        const value=endpoint.value.trim();if(!value)throw new Error('Der mangler en Apps Script-webadresse (/exec).');app.db.settings.sheetEndpoint=value;
        const ping=await app.provider.test();
        const result=await app.provider.pull();
        const realCustomers=(app.db.customers||[]).filter(x=>!String(x.id||'').startsWith('demo-')&&x.active!==false).length;
        const realEmployees=(app.db.employees||[]).filter(x=>!String(x.id||'').startsWith('demo-')&&x.active!==false).length;
        const totalCustomers=(result?.customers||[]).length,totalEmployees=(result?.employees||[]).length;
        localStorage.setItem('gtp_data_v4',JSON.stringify(app.db));refresh();
        alert(`Forbindelsen virker · version ${ping?.version||'?'}. Sheet: ${totalCustomers} kunder i alt / ${realCustomers} aktive, ${totalEmployees} medarbejdere i alt / ${realEmployees} aktive.`);
      }catch(error){alert(`Forbindelsen kunne ikke godkendes: ${error.message}`);}finally{button.disabled=false;button.textContent='Test forbindelse';}
    };
    document.getElementById('bioSetup').onclick=async()=>{const button=document.getElementById('bioSetup');button.disabled=true;try{await app.bio.setup(app.currentEmployee());app.toast('Bioadgang er aktiveret');await refreshBio();}catch(error){alert(error.name==='NotAllowedError'?'Oprettelsen blev afbrudt.':error.message);}finally{button.disabled=false;}};
    document.getElementById('bioTest').onclick=async()=>{try{await app.bio.verify();app.toast('Godkendelsen virker');}catch(error){alert(error.name==='NotAllowedError'?'Godkendelsen blev afbrudt.':error.message);}};
    document.getElementById('bioRemove').onclick=async()=>{try{await app.bio.verify();if(!confirm('Fjern bioadgang fra denne enhed?'))return;app.bio.remove();app.toast('Bioadgang er fjernet');await refreshBio();}catch(error){alert(error.name==='NotAllowedError'?'Godkendelsen blev afbrudt.':error.message);}};
    document.getElementById('backupBtn').onclick=()=>{const link=document.createElement('a');link.href=URL.createObjectURL(new Blob([JSON.stringify(app.db,null,2)],{type:'application/json'}));link.download=`greentime-backup-${new Date().toISOString().slice(0,10)}.json`;link.click();URL.revokeObjectURL(link.href);};
    document.getElementById('restoreFile').onchange=async event=>{try{const data=JSON.parse(await event.target.files[0].text());if(![2,3,4].includes(data.version))throw Error();if(!confirm('Erstat alle nuværende data med sikkerhedskopien?'))return;localStorage.setItem('gtp_data_v4',JSON.stringify({...data,version:4}));location.reload();}catch{alert('Filen er ikke en gyldig GreenTime Pro-sikkerhedskopi.');}};
  };
})(window.GTP);
