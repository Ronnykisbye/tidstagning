document.addEventListener('DOMContentLoaded',()=>{
  const A=window.GTP;
  A.initNavigation();A.initDashboard();A.initCustomers();A.initEmployees();A.initTimer();A.initCalendar();A.initReports();A.initSettings();A.applyLanguage();
  document.querySelectorAll('[data-lang]').forEach(b=>b.onclick=()=>A.setLanguage(b.dataset.lang));
  A.showPage('dashboardPage');
});
