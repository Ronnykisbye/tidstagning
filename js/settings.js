(function(app){
  app.initSettings=function(){
    const endpoint=document.getElementById('sheetEndpoint');endpoint.value=app.db.settings?.sheetEndpoint||'';
    const refresh=()=>{document.getElementById('providerDescription').textContent=app.provider.mode()==='google-sheets'?'Google Regneark-forbindelsen er konfigureret. Nye ændringer forsøges synkroniseret automatisk.':'Appen bruger lokale demodata, indtil regnearket tilkobles.';};refresh();
    document.getElementById('saveEndpoint').onclick=()=>{
      const value=endpoint.value.trim();if(value&&!/^https:\/\/script\.google\.com\/macros\/s\//.test(value))return alert('Brug webadressen fra en publiceret Google Apps Script-webapp.');
      app.db.settings.sheetEndpoint=value;app.save('Regnearksforbindelse opdateret');refresh();app.toast(value?'Forbindelsen er gemt':'Lokal lagring er valgt');
    };
    document.getElementById('testEndpoint').onclick=async()=>{
      const button=document.getElementById('testEndpoint');button.disabled=true;button.textContent='Tester…';
      try{app.db.settings.sheetEndpoint=endpoint.value.trim();await app.provider.test();app.toast('Forbindelsen virker');}
      catch(error){alert(`Forbindelsen kunne ikke godkendes: ${error.message}`);}
      finally{button.disabled=false;button.textContent='Test forbindelse';}
    };
    document.getElementById('backupBtn').onclick=()=>{const link=document.createElement('a');link.href=URL.createObjectURL(new Blob([JSON.stringify(app.db,null,2)],{type:'application/json'}));link.download=`greentime-backup-${new Date().toISOString().slice(0,10)}.json`;link.click();URL.revokeObjectURL(link.href);};
    document.getElementById('restoreFile').onchange=async event=>{try{const data=JSON.parse(await event.target.files[0].text());if(![2,3].includes(data.version))throw Error();if(!confirm('Erstat alle nuværende data med sikkerhedskopien?'))return;localStorage.setItem('gtp_data_v3',JSON.stringify({...data,version:3}));location.reload();}catch{alert('Filen er ikke en gyldig GreenTime Pro-sikkerhedskopi.');}};
  };
})(window.GTP);
