let promptEvent;const btn=document.getElementById('installBtn');
addEventListener('beforeinstallprompt',e=>{e.preventDefault();promptEvent=e;btn.hidden=false;});
btn.onclick=async()=>{if(!promptEvent)return;promptEvent.prompt();await promptEvent.userChoice;promptEvent=null;btn.hidden=true;};
const ua=navigator.userAgent,iphone=/iPhone|iPad/.test(ua)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1),android=/Android/.test(ua);
const guide=document.getElementById(iphone?'iphoneGuide':android?'androidGuide':'desktopGuide');
guide?.classList.add('current');guide?.setAttribute('aria-current','true');
