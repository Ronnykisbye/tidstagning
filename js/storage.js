window.GTP = window.GTP || {};
(function (app) {
  const KEY = 'gtp_data_v2';
  const empty = () => ({version:2, customers:[], employees:[], entries:[], bookings:[], audit:[]});

  function localDate(daysFromToday = 0) {
    const date = new Date();
    date.setDate(date.getDate() + daysFromToday);
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    return date.toISOString().slice(0, 10);
  }

  function seedDemoData(data) {
    if ((data.demoSeedVersion || 0) >= 2) return data;

    const demoCustomers = [
      {id:'demo-customer-1',name:'Kronborg Kontorservice ApS',phone:'70 00 30 01',email:'kontakt@kronborg-kontor.example',address:'Stengade 52, 3000 Helsingør',notes:'DEMOKUNDE – fiktiv. Ugentlig rengøring af kontorer, køkken og mødelokaler.',active:true},
      {id:'demo-customer-2',name:'Hornbæk Strandhotel Drift',phone:'70 00 31 02',email:'drift@hornbaek-strandhotel.example',address:'Kystvej 18, 3100 Hornbæk',notes:'DEMOKUNDE – fiktiv. Klargøring af fællesarealer og mindre vedligeholdelsesopgaver.',active:true},
      {id:'demo-customer-3',name:'Fredensborg Grønne Anlæg',phone:'70 00 34 03',email:'service@fredensborg-groent.example',address:'Jernbanegade 24, 3480 Fredensborg',notes:'DEMOKUNDE – fiktiv. Hækklipning, græsslåning og oprydning på udearealer.',active:true},
      {id:'demo-customer-4',name:'Hillerød Erhvervscenter',phone:'70 00 34 04',email:'teknik@hilleroed-erhverv.example',address:'Slotsgade 41, 3400 Hillerød',notes:'DEMOKUNDE – fiktiv. Teknisk tilsyn, udskiftning af lyskilder og månedlig kontrolrunde.',active:true},
      {id:'demo-customer-5',name:'Espergærde Sundhedshus',phone:'70 00 30 05',email:'info@espergaerde-sundhed.example',address:'Mørdrupvej 15, 3060 Espergærde',notes:'DEMOKUNDE – fiktiv. Rengøring uden for åbningstid og opfyldning af forbrugsvarer.',active:true}
    ];

    const demoEmployees = [
      {id:'demo-employee-1',name:'Lars W',email:'lars.w@demo-firma.example',role:'Chef',active:true},
      {id:'demo-employee-2',name:'Sofie Larsen',email:'sofie@demo-firma.example',role:'Medarbejder',active:true},
      {id:'demo-employee-3',name:'Jonas Holm',email:'jonas@demo-firma.example',role:'Medarbejder',active:true},
      {id:'demo-employee-4',name:'Amalie Nielsen',email:'amalie@demo-firma.example',role:'Medarbejder',active:true}
    ];

    const demoBookings = [
      {id:'demo-booking-1',date:localDate(1),start:'08:00',duration:'3',customerId:'demo-customer-1',employeeIds:['demo-employee-1','demo-employee-2'],note:'Kontorrengøring og klargøring af mødelokaler.'},
      {id:'demo-booking-2',date:localDate(2),start:'09:30',duration:'4',customerId:'demo-customer-3',employeeIds:['demo-employee-1','demo-employee-3'],note:'Hækklipning og oprydning ved parkeringsområdet.'},
      {id:'demo-booking-3',date:localDate(3),start:'07:30',duration:'2',customerId:'demo-customer-5',employeeIds:['demo-employee-2'],note:'Morgenrengøring og opfyldning af papirvarer.'},
      {id:'demo-booking-4',date:localDate(5),start:'10:00',duration:'3',customerId:'demo-customer-4',employeeIds:['demo-employee-3','demo-employee-4'],note:'Teknisk kontrolrunde og udskiftning af lyskilder.'},
      {id:'demo-booking-5',date:localDate(7),start:'12:30',duration:'4',customerId:'demo-customer-2',employeeIds:['demo-employee-1','demo-employee-2','demo-employee-4'],note:'Klargøring af fællesarealer før weekendarrangement.'},
      {id:'demo-booking-6',date:localDate(1),start:'07:30',duration:'2',customerId:'demo-customer-5',employeeIds:['demo-employee-3'],note:'Morgenrengøring i venteområde og konsultationsrum.'},
      {id:'demo-booking-7',date:localDate(1),start:'12:30',duration:'3',customerId:'demo-customer-3',employeeIds:['demo-employee-4'],note:'Græsslåning og oprydning langs indkørslen.'},
      {id:'demo-booking-8',date:localDate(2),start:'08:00',duration:'2',customerId:'demo-customer-4',employeeIds:['demo-employee-2'],note:'Kontrol af fællesbelysning og mindre reparationer.'},
      {id:'demo-booking-9',date:localDate(2),start:'13:30',duration:'3',customerId:'demo-customer-2',employeeIds:['demo-employee-4'],note:'Klargøring af reception og fællesarealer.'},
      {id:'demo-booking-10',date:localDate(3),start:'10:30',duration:'4',customerId:'demo-customer-1',employeeIds:['demo-employee-1','demo-employee-3'],note:'Hovedrengøring af køkken og mødelokaler.'},
      {id:'demo-booking-11',date:localDate(5),start:'07:00',duration:'2',customerId:'demo-customer-5',employeeIds:['demo-employee-2'],note:'Tidlig rengøring og opfyldning af forbrugsvarer.'}
    ];

    function demoEntry(id, daysAgo, startHour, minutes, customerId, employeeIds, note) {
      const start = new Date();
      start.setDate(start.getDate() - daysAgo);
      start.setHours(startHour, 0, 0, 0);
      const end = new Date(start.getTime() + minutes * 60000);
      return {id,customerId,employeeIds,start:start.toISOString(),end:end.toISOString(),seconds:minutes*60,note};
    }

    const demoEntries = [
      demoEntry('demo-entry-1',1,8,180,'demo-customer-1',['demo-employee-1','demo-employee-2'],'Kontorrengøring og klargøring af mødelokaler.'),
      demoEntry('demo-entry-2',2,9,240,'demo-customer-3',['demo-employee-3','demo-employee-4'],'Pleje af udearealer og bortkørsel af grønt affald.'),
      demoEntry('demo-entry-3',3,7,150,'demo-customer-5',['demo-employee-2'],'Rengøring og opfyldning af forbrugsvarer.'),
      demoEntry('demo-entry-4',4,10,210,'demo-customer-4',['demo-employee-1','demo-employee-3'],'Teknisk kontrol og udskiftning af defekte lyskilder.'),
      demoEntry('demo-entry-5',5,12,240,'demo-customer-2',['demo-employee-2','demo-employee-4'],'Klargøring efter arrangement og kontrol af fællesarealer.')
    ];

    const demoAudit = [
      {id:'demo-audit-1',at:new Date().toISOString(),action:'Fiktive demonstrationsdata indlæst'},
      {id:'demo-audit-2',at:new Date(Date.now()-3600000).toISOString(),action:'Booking oprettet: Hillerød Erhvervscenter'},
      {id:'demo-audit-3',at:new Date(Date.now()-7200000).toISOString(),action:'Tidsregistrering gemt: Kronborg Kontorservice ApS'},
      {id:'demo-audit-4',at:new Date(Date.now()-10800000).toISOString(),action:'Kunde oprettet: Espergærde Sundhedshus'}
    ];
    demoCustomers.forEach(item => {
      if (!data.customers.some(existing => existing.id === item.id)) data.customers.push(item);
    });
    demoEmployees.forEach(item => {
      if (!data.employees.some(existing => existing.id === item.id)) data.employees.push(item);
    });
    demoBookings.forEach(item => {
      if (!data.bookings.some(existing => existing.id === item.id)) data.bookings.push(item);
    });
    demoEntries.forEach(item => {
      if (!data.entries.some(existing => existing.id === item.id)) data.entries.push(item);
    });
    demoAudit.forEach(item => {
      if (!data.audit.some(existing => existing.id === item.id)) data.audit.push(item);
    });
    data.demoSeedVersion = 2;
    localStorage.setItem(KEY, JSON.stringify(data));
    return data;
  }

  function load(){
    try {
      const saved=JSON.parse(localStorage.getItem(KEY));
      const data=saved && saved.version===2 ? {...empty(),...saved} : migrate();
      return seedDemoData(data);
    } catch { return seedDemoData(empty()); }
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
