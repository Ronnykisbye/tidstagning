window.GTP=window.GTP||{};
(function(app){
  const KEY='gtp_data_v3';
  const OLD_KEY='gtp_data_v2';
  const empty=()=>({version:3,customers:[],employees:[],entries:[],bookings:[],audit:[],settings:{sheetEndpoint:''}});
  const uid=()=>globalThis.crypto?.randomUUID?.()||Date.now().toString(36)+Math.random().toString(36).slice(2);
  const localDate=(days=0)=>{const d=new Date();d.setDate(d.getDate()+days);d.setMinutes(d.getMinutes()-d.getTimezoneOffset());return d.toISOString().slice(0,10);};

  function demoEntry(id,daysAgo,startHour,minutes,customerId,employeeId,note,completion=100,status='Færdig'){
    const start=new Date();start.setDate(start.getDate()-daysAgo);start.setHours(startHour,0,0,0);
    return {id,customerId,employeeIds:[employeeId],start:start.toISOString(),end:new Date(start.getTime()+minutes*60000).toISOString(),seconds:minutes*60,breakMinutes:0,workType:'Service',note,completion,status,followUp:false,followUpNote:'',source:'demo'};
  }
  function seed(data){
    if((data.demoSeedVersion||0)>=3)return data;
    const customers=[
      {id:'demo-customer-1',customerNumber:'1001',name:'Kronborg Kontorservice ApS',phone:'70 00 30 01',email:'kontakt@kronborg-kontor.example',address:'Stengade 52, 3000 Helsingør',defaultWorkType:'Rengøring',notes:'DEMOKUNDE – fiktiv. Ugentlig rengøring af kontorer, køkken og mødelokaler.',active:true},
      {id:'demo-customer-2',customerNumber:'1002',name:'Hornbæk Strandhotel Drift',phone:'70 00 31 02',email:'drift@hornbaek-strandhotel.example',address:'Kystvej 18, 3100 Hornbæk',defaultWorkType:'Service',notes:'DEMOKUNDE – fiktiv. Klargøring af fællesarealer.',active:true},
      {id:'demo-customer-3',customerNumber:'1003',name:'Fredensborg Grønne Anlæg',phone:'70 00 34 03',email:'service@fredensborg-groent.example',address:'Jernbanegade 24, 3480 Fredensborg',defaultWorkType:'Vedligeholdelse',notes:'DEMOKUNDE – fiktiv. Pleje af udearealer.',active:true},
      {id:'demo-customer-4',customerNumber:'1004',name:'Hillerød Erhvervscenter',phone:'70 00 34 04',email:'teknik@hilleroed-erhverv.example',address:'Slotsgade 41, 3400 Hillerød',defaultWorkType:'Reparation',notes:'DEMOKUNDE – fiktiv. Teknisk tilsyn.',active:true},
      {id:'demo-customer-5',customerNumber:'1005',name:'Espergærde Sundhedshus',phone:'70 00 30 05',email:'info@espergaerde-sundhed.example',address:'Mørdrupvej 15, 3060 Espergærde',defaultWorkType:'Rengøring',notes:'DEMOKUNDE – fiktiv. Rengøring uden for åbningstid.',active:true}
    ];
    const employees=[
      {id:'demo-employee-1',name:'Lars W',email:'lars.w@demo-firma.example',phone:'20 00 00 01',role:'Chef',active:true},
      {id:'demo-employee-2',name:'Sofie Larsen',email:'sofie@demo-firma.example',phone:'20 00 00 02',role:'Medarbejder',active:true},
      {id:'demo-employee-3',name:'Jonas Holm',email:'jonas@demo-firma.example',phone:'20 00 00 03',role:'Medarbejder',active:true},
      {id:'demo-employee-4',name:'Amalie Nielsen',email:'amalie@demo-firma.example',phone:'20 00 00 04',role:'Medarbejder',active:true}
    ];
    const bookings=[
      {id:'demo-booking-1',date:localDate(1),start:'08:00',duration:'3',customerId:'demo-customer-1',employeeIds:['demo-employee-1','demo-employee-2'],note:'Kontorrengøring og klargøring.'},
      {id:'demo-booking-2',date:localDate(2),start:'09:30',duration:'4',customerId:'demo-customer-3',employeeIds:['demo-employee-3'],note:'Hækklipning og oprydning.'},
      {id:'demo-booking-3',date:localDate(3),start:'07:30',duration:'2',customerId:'demo-customer-5',employeeIds:['demo-employee-2'],note:'Morgenrengøring og opfyldning.'},
      {id:'demo-booking-4',date:localDate(5),start:'10:00',duration:'3',customerId:'demo-customer-4',employeeIds:['demo-employee-1','demo-employee-4'],note:'Teknisk kontrolrunde.'}
    ];
    const entries=[
      demoEntry('demo-entry-1',1,8,180,'demo-customer-1','demo-employee-2','Kontorrengøring og klargøring.'),
      demoEntry('demo-entry-2',2,9,240,'demo-customer-3','demo-employee-3','Pleje af udearealer.',75,'I gang'),
      demoEntry('demo-entry-3',3,7,150,'demo-customer-5','demo-employee-2','Rengøring og opfyldning.')
    ];
    customers.forEach(x=>{if(!data.customers.some(y=>y.id===x.id))data.customers.push(x);});
    employees.forEach(x=>{if(!data.employees.some(y=>y.id===x.id))data.employees.push(x);});
    bookings.forEach(x=>{if(!data.bookings.some(y=>y.id===x.id))data.bookings.push(x);});
    entries.forEach(x=>{if(!data.entries.some(y=>y.id===x.id))data.entries.push(x);});
    data.demoSeedVersion=3;
    return data;
  }
  function normalize(data){
    const base={...empty(),...data,version:3,settings:{...empty().settings,...(data.settings||{})}};
    base.customers=base.customers.map(x=>({customerNumber:'',defaultWorkType:'Service',active:true,...x}));
    base.employees=base.employees.map(x=>({phone:'',role:'Medarbejder',active:true,...x}));
    base.entries=base.entries.map(x=>({employeeIds:x.employeeIds||[x.employeeId].filter(Boolean),breakMinutes:0,workType:'Service',completion:100,status:'Færdig',followUp:false,followUpNote:'',source:'local',...x}));
    return seed(base);
  }
  function load(){
    try{
      const saved=JSON.parse(localStorage.getItem(KEY)||localStorage.getItem(OLD_KEY)||'null');
      const data=normalize(saved||empty());localStorage.setItem(KEY,JSON.stringify(data));return data;
    }catch{return seed(empty());}
  }
  app.db=load();
  app.uid=uid;
  app.save=function(action){
    if(action)app.db.audit.unshift({id:uid(),at:new Date().toISOString(),employeeId:app.session?.employeeId||'',action});
    app.db.audit=app.db.audit.slice(0,500);
    localStorage.setItem(KEY,JSON.stringify(app.db));
    document.dispatchEvent(new CustomEvent('gtp:data',{detail:{action}}));
    app.provider?.queueSync?.();
  };
  app.toast=function(message){
    const node=document.getElementById('toast');if(!node)return;
    node.textContent=message;node.classList.add('show');clearTimeout(app.toastTimer);app.toastTimer=setTimeout(()=>node.classList.remove('show'),2600);
  };
  app.escape=s=>String(s??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  app.customer=id=>app.db.customers.find(x=>x.id===id);
  app.employee=id=>app.db.employees.find(x=>x.id===id);
  app.activeCustomers=()=>app.db.customers.filter(x=>x.active!==false).sort((a,b)=>a.name.localeCompare(b.name,'da'));
  app.activeEmployees=()=>app.db.employees.filter(x=>x.active!==false).sort((a,b)=>a.name.localeCompare(b.name,'da'));
})(window.GTP);
