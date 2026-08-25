const CACHE='greentime-pro-v49';
const FILES=['./','./index.html','./manifest.webmanifest','./assets/icon-192.png','./assets/icon-512.png','./assets/icon-maskable-512.png','./assets/apple-touch-icon.png','./assets/favicon.ico','./install/','./install/index.html','./install/install.js','./css/theme.css','./css/layout.css','./css/components.css','./css/home.css','./css/calendar-enhancements.css','./css/scroll-indicator.css','./css/responsive.css','./css/navigation-controls.css','./css/stitch-ux.css','./css/top-navigation.css','./css/roles.css','./js/storage.js','./js/data-provider.js','./js/biometric.js','./js/access.js','./js/dashboard.js','./js/i18n.js','./js/navigation.js','./js/customers.js','./js/employees.js','./js/time-selects.js','./js/timer.js','./js/calendar.js','./js/reports.js','./js/settings.js','./js/scroll-indicator.js','./js/app.js'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;
  const url=new URL(event.request.url);
  const appAsset=url.origin===self.location.origin&&(url.pathname.includes('/js/')||url.pathname.includes('/css/'));
  if(event.request.mode==='navigate'||appAsset){
    event.respondWith(fetch(event.request,{cache:'no-store'}).then(response=>{const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(event.request,copy));return response;}).catch(()=>caches.match(event.request).then(cached=>cached||caches.match(event.request,{ignoreSearch:true})||caches.match('./index.html'))));
    return;
  }
  event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request).then(response=>{const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(event.request,copy));return response;})));
});