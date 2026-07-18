(function(app){
  app.initSettings=function(){document.getElementById('backupBtn').onclick=()=>{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(app.db,null,2)],{type:'application/json'}));a.download=`greentime-backup-${new Date().toISOString().slice(0,10)}.json`;a.click();URL.revokeObjectURL(a.href);};document.getElementById('restoreFile').onchange=async e=>{try{const data=JSON.parse(await e.target.files[0].text());if(data.version!==2)throw Error();if(!confirm('Erstat alle nuværende data med sikkerhedskopien?'))return;app.db=data;app.save('Sikkerhedskopi gendannet');location.reload();}catch{alert('Filen er ikke en gyldig GreenTime Pro-sikkerhedskopi.');}};};
})(window.GTP);

