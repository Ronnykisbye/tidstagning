window.GTP = window.GTP || {};
(function (app) {
  const KEY = 'gtp_data_v2';
  const empty = () => ({version:2, customers:[], employees:[], entries:[], bookings:[], audit:[]});
  function load(){
    try {
      const saved=JSON.parse(localStorage.getItem(KEY));
      return saved && saved.version===2 ? {...empty(),...saved} : migrate();
    } catch { return empty(); }
  }
  function migrate(){
    const data=empty();
    try {
      const oldCustomers=JSON.parse(localStorage.getItem('gtp_customers')||'[]');
      const oldEmployees=JSON.parse(localStorage.getItem('gtp_employees')||'[]');
      data.customers=oldCustomers.map(c=>({...c,id:c.id||crypto.randomUUID(),notes:c.notes||'',active:c.active!==false}));
      data.employees=oldEmployees.map(e=>({...e,id:e.id||crypto.randomUUID(),active:e.active!==false}));
      const oldLogs=JSON.parse(localStorage.getItem('gtp_logs')||'[]');
      data.entries=oldLogs.map(l=>({...l,id:l.id||crypto.randomUUID()}));
      const oldPlans=JSON.parse(localStorage.getItem('gtp_plans')||'[]');
      data.bookings=oldPlans.map(p=>({...p,id:p.id||crypto.randomUUID()}));
    } catch {}
    localStorage.setItem(KEY,JSON.stringify(data));
    return data;
  }
  app.db=load();
  app.uid=()=>crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36)+Math.random().toString(36).slice(2);
  app.save=function(action){
    if(action) app.db.audit.unshift({id:app.uid(),at:new Date().toISOString(),action});
    app.db.audit=app.db.audit.slice(0,500);
    localStorage.setItem(KEY,JSON.stringify(app.db));
    document.dispatchEvent(new CustomEvent('gtp:data')); 
  };
  app.escape=s=>String(s??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  app.customer=id=>app.db.customers.find(x=>x.id===id);
  app.employee=id=>app.db.employees.find(x=>x.id===id);
})(window.GTP);

