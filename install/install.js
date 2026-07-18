let promptEvent;const btn=document.getElementById('installBtn');
addEventListener('beforeinstallprompt',e=>{e.preventDefault();promptEvent=e;btn.hidden=false;});
btn.onclick=async()=>{if(!promptEvent)return;promptEvent.prompt();await promptEvent.userChoice;promptEvent=null;btn.hidden=true;};
const ua=navigator.userAgent,iphone=/iPhone|iPad/.test(ua),android=/Android/.test(ua),desktop=/Edg|Chrome/.test(ua);
document.getElementById('deviceTitle').textContent=iphone?'iPhone eller iPad':android?'Android':desktop?'Windows, Mac eller Chromebook':'Din enhed';
document.getElementById('instructions').innerHTML=iphone?'<div class="install-step">1. Åbn siden i Safari.</div><div class="install-step">2. Tryk på Del-knappen.</div><div class="install-step">3. Vælg Føj til hjemmeskærm.</div>':android?'<div class="install-step">1. Åbn siden i Chrome.</div><div class="install-step">2. Tryk på menuen med tre prikker.</div><div class="install-step">3. Vælg Installér app.</div>':'<div class="install-step">1. Åbn siden i Chrome eller Edge.</div><div class="install-step">2. Tryk på installationsikonet i adresselinjen.</div><div class="install-step">3. Vælg Installér.</div>';
