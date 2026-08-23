document.addEventListener('DOMContentLoaded',()=>{
  const A=window.GTP;
  if(!A)return;
  try{A.initNavigation?.();}catch(error){console.error('Navigation kunne ikke starte',error);}
  const initializers=['initAccess','initDashboard','initCustomers','initEmployees','initTimer','initCalendar','initReports','initSettings'];
  initializers.forEach(name=>{try{A[name]?.();}catch(error){console.error(name+' kunne ikke starte',error);}});
  try{A.showPage?.('dashboardPage',{push:false,instant:true});}catch(error){console.error('Startsiden kunne ikke åbnes',error);}
  try{A.applyLanguage?.();}catch(error){console.error('Sprog kunne ikke indlæses',error);}
  document.querySelectorAll('[data-lang]').forEach(button=>button.onclick=()=>A.setLanguage?.(button.dataset.lang));
});
