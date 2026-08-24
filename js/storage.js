window.GTP=window.GTP||{};
(function(app){
  const KEY='gtp_data_v4';
  const OLD_KEYS=['gtp_data_v3','gtp_data_v2'];
  const empty=()=>({version:4,customers:[],addresses:[],employees:[],roles:[],employeeRoles:[],entries:[],bookings:[],audit:[],settings:{sheetEndpoint:''}});
  const uid=()=>globalThis.crypto?.randomUUID?.()||Date.now().toString(36)+Math.random().toString(36).slice(2);
  const localDate=(days=0)=>{const d=new Date();d.setDate(d.getDate()+days);d.setMinutes(d.getMinutes()-d.getTimezoneOffset());return d.toISOString().slice(0,10);};

  function demoEntry(id,daysAgo,startHour,minutes,customerId,employeeId,note,completion=100,status='Færdig'){
    const start=new Date();start.setDate(start.getDate()-daysAgo);start.setHours(startHour,0,0,0);
    return {id,customerId,employeeIds:[employeeId],start:start.toISOString(),end:new Date(start.getTime()+minutes*60000).toISOString(),seconds:minutes*60,breakMinutes:0,workType:'Service',note,completion,status,followUp:false,followUpNote:'',source:'demo'};
  }

  function seed(data){
    if((data.demoSeedVersion||0)>=8)return data;
    const customers=[
      {id:'demo-customer-1',customerNumber:'1001',name:'Kronborg Kontorservice ApS',phone:'70 00 30 01',email:'kontakt@kronborg-kontor.example',address:'Stengade 52, 3000 Helsingør',defaultWorkType:'Rengøring',notes:'DEMOKUNDE – fiktiv. Ugentlig rengøring af kontorer, køkken og mødelokaler.',active:true},
      {id:'demo-customer-2',customerNumber:'1002',name:'Hornbæk Strandhotel Drift',phone:'70 00 31 02',email:'drift@hornbaek-strandhotel.example',address:'Kystvej 18, 3100 Hornbæk',defaultWorkType:'Service',notes:'DEMOKUNDE – fiktiv. Klargøring af fællesarealer.',active:true},
      {id:'demo-customer-3',customerNumber:'1003',name:'Fredensborg Grønne Anlæg',phone:'70 00 34 03',email:'service@fredensborg-groent.example',address:'Jernbanegade 24, 3480 Fredensborg',defaultWorkType:'Vedligeholdelse',notes:'DEMOKUNDE – fiktiv. Pleje af udearealer.',active:true},
      {id:'demo-customer-4',customerNumber:'1004',name:'Hillerød Erhvervscenter',phone:'70 00 34 04',email:'teknik@hilleroed-erhverv.example',address:'Slotsgade 41, 3400 Hillerød',defaultWorkType:'Reparation',notes:'DEMOKUNDE – fiktiv. Teknisk tilsyn.',active:true},
      {id:'demo-customer-5',customerNumber:'1005',name:'Espergærde Sundhedshus',phone:'70 00 30 05',email:'info@espergaerde-sundhed.example',address:'Mørdrupvej 15, 3060 Espergærde',defaultWorkType:'Rengøring',notes:'DEMOKUNDE – fiktiv. Rengøring uden for åbningstid.',active:true}
    ];
    const employees=[
      {id:'demo-employee-ronny',name:'Ronny Kisbye',email:'ronny@demo-firma.example',phone:'20 00 00 00',active:true},
      {id:'demo-employee-1',name:'Lars W',email:'lars.w@demo-firma.example',phone:'20 00 00 01',active:true},
      {id:'demo-employee-2',name:'Sofie Larsen',email:'sofie@demo-firma.example',phone:'20 00 00 02',active:true},
      {id:'demo-employee-3',name:'Jonas Holm',email:'jonas@demo-firma.example',phone:'20 00 00 03',active:true},
      {id:'demo-employee-4',name:'Amalie Nielsen',email:'amalie@demo-firma.example',phone:'20 00 00 04',active:true}
    ];
    const demoRoles=[
      {id:'demo-ronny-medarbejder',employeeId:'demo-employee-ronny',roleId:'role-medarbejder',active:true},
      {id:'demo-lars-medarbejder',employeeId:'demo-employee-1',roleId:'role-medarbejder',active:true},
      {id:'demo-lars-chef',employeeId:'demo-employee-1',roleId:'role-chef',active:true},
      {id:'demo-sofie-medarbejder',employeeId:'demo-employee-2',roleId:'role-medarbejder',active:true},
      {id:'demo-jonas-medarbejder',employeeId:'demo-employee-3',roleId:'role-medarbejder',active:true},
      {id:'demo-amalie-medarbejder',employeeId:'demo-employee-4',roleId:'role-medarbejder',active:true}
    ];
    const entries=[
      demoEntry('demo-entry-1',1,8,180,'demo-customer-1','demo-employee-2','Kontorrengøring og klargøring.'),
      demoEntry('demo-entry-2',2,9,240,'demo-customer-3','demo-employee-3','Pleje af udearealer.',75,'I gang'),
      demoEntry('demo-entry-3',3,7,150,'demo-customer-5','demo-employee-2','Rengøring og opfyldning.')
    ];
    customers.forEach(x=>{const existing=data.customers.find(y=>y.id===x.id);if(!existing)data.customers.push(x);else if(existing.active===false)Object.assign(existing,x);});
    employees.forEach(x=>{const existing=data.employees.find(y=>y.id===x.id);if(!existing)data.employees.push(x);else Object.assign(existing,x);});
    data.employeeRoles=(data.employeeRoles||[]).filter(x=>!String(x.id||'').startsWith('demo-')&&!String(x.employeeId||'').startsWith('demo-'));
    demoRoles.forEach(x=>data.employeeRoles.push(x));
    entries.forEach(x=>{if(!data.entries.some(y=>y.id===x.id))data.entries.push(x);});
    data.demoSeedVersion=8;
    return data;
  }

  function refreshDemoCalendar(data){
    const anchor=localDate();
    if(data.demoCalendarAnchor===anchor&&data.bookings.some(x=>String(x.id).startsWith('demo-calendar-')))return data;
    data.bookings=data.bookings.filter(x=>!/^demo-(booking|calendar)-/.test(String(x.id||'')));
    const counts=[2,3,4,2,3,4,2,3,4],starts=['07:00','09:30','12:00','14:30'],durations=['2','2','2','3'];
    const customers=['demo-customer-1','demo-customer-2','demo-customer-3','demo-customer-4','demo-customer-5'];
    const employees=['demo-employee-ronny','demo-employee-1','demo-employee-2','demo-employee-3','demo-employee-4'];
    const notes=['rengøring af kontorer og møderum','klargøring af fællesarealer','pleje af udearealer og bede','teknisk kontrol og fejlsøgning','morgenrengøring og opfyldning','vinduespudsning og gulvpleje','mindre reparationer og eftersyn','hækklipning og oprydning'];
    counts.forEach((count,dayIndex)=>{
      const dayOffset=dayIndex-1;
      for(let taskIndex=0;taskIndex<count;taskIndex++){
        const employeeIndex=(dayIndex+taskIndex)%employees.length,employeeIds=[employees[employeeIndex]];
        if(taskIndex===3)employeeIds.push(employees[(employeeIndex+2)%employees.length]);
        data.bookings.push({id:`demo-calendar-${anchor}-${dayIndex}-${taskIndex+1}`,date:localDate(dayOffset),start:starts[taskIndex],duration:durations[taskIndex],customerId:customers[(dayIndex*2+taskIndex)%customers.length],employeeIds,note:`Fiktiv opgave: ${notes[(dayIndex+taskIndex)%notes.length]}.`,S:(dayIndex+taskIndex)%7===0,status:dayOffset<0?'Færdig':'Planlagt',active:true});
      }
    });
    data.demoCalendarAnchor=anchor;
    return data;
  }

  function normalize(data){
    const base={...empty(),...data,version:4,settings:{...empty().settings,...(data.settings||{})}};
    base.customers=(base.customers||[]).map(x=>({customerNumber:'',defaultWorkType:'Service',S:false,active:true,...x}));
    base.employees=(base.employees||[]).map(x=>({phone:'',active:true,...x}));
    base.entries=(base.entries||[]).map(x=>({employeeIds:x.employeeIds||[x.employeeId].filter(Boolean),breakMinutes:0,workType:'Service',completion:100,status:'Færdig',followUp:false,followUpNote:'',source:'local',...x}));
    base.roles=[{id:'role-chef',name:'Chef',active:true},{id:'role-medarbejder',name:'Medarbejder',active:true}];
    base.employeeRoles=(base.employeeRoles||[]).map(link=>({...link,roleId:link.roleId==='role-manager'?'role-chef':link.roleId==='role-employee'?'role-medarbejder':link.roleId}));
    const seeded=refreshDemoCalendar(seed(base));
    seeded.customers=seeded.customers.map(customer=>({...customer,S:customer.S===true||String(customer.S).toLowerCase()==='true'}));
    seeded.addresses=seeded.addresses||[];
    seeded.customers.forEach(customer=>{
      let address=seeded.addresses.find(x=>x.customerId===customer.id&&x.active!==false);
      if(!address&&String(customer.id).startsWith('demo-')){address=seeded.addresses.find(x=>x.customerId===customer.id);if(address){address.active=true;address.address=customer.address||address.address;}}
      if(!address&&customer.address){address={id:`${customer.id}-address-1`,customerId:customer.id,label:'Primær',address:customer.address,postalCode:'',city:'',active:true};seeded.addresses.push(address);}
      if(address&&!customer.address)customer.address=address.address;
    });
    seeded.bookings=(seeded.bookings||[]).map(booking=>({status:'Planlagt',active:true,addressId:seeded.addresses.find(x=>x.customerId===booking.customerId&&x.active!==false)?.id||'',...booking,S:booking.S===true||String(booking.S).toLowerCase()==='true'}));
    return seeded;
  }

  function load(){
    try{const savedText=localStorage.getItem(KEY)||OLD_KEYS.map(key=>localStorage.getItem(key)).find(Boolean)||'null';const saved=JSON.parse(savedText);const data=normalize(saved||empty());localStorage.setItem(KEY,JSON.stringify(data));return data;}
    catch{return normalize(empty());}
  }

  app.db=load();
  app.uid=uid;
  app.hasRole=(employeeId,roleId)=>app.db.employeeRoles.some(x=>x.employeeId===employeeId&&x.roleId===roleId&&x.active!==false);
  app.employeeRoleNames=employeeId=>app.db.employeeRoles.filter(x=>x.employeeId===employeeId&&x.active!==false).map(link=>app.db.roles.find(r=>r.id===link.roleId)?.name).filter(Boolean);
  app.save=function(action){if(action)app.db.audit.unshift({id:uid(),at:new Date().toISOString(),employeeId:app.session?.employeeId||'',action});app.db.audit=app.db.audit.slice(0,500);localStorage.setItem(KEY,JSON.stringify(app.db));document.dispatchEvent(new CustomEvent('gtp:data',{detail:{action}}));app.provider?.queueSync?.();};
  app.toast=function(message){const node=document.getElementById('toast');if(!node)return;node.textContent=message;node.classList.add('show');clearTimeout(app.toastTimer);app.toastTimer=setTimeout(()=>node.classList.remove('show'),2600);};
  app.escape=s=>String(s??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  app.customer=id=>app.db.customers.find(x=>x.id===id);
  app.employee=id=>app.db.employees.find(x=>x.id===id);
  app.address=id=>app.db.addresses.find(x=>x.id===id);
  app.customerAddress=customerId=>app.db.addresses.find(x=>x.customerId===customerId&&x.active!==false);
  app.activeCustomers=()=>app.db.customers.filter(x=>x.active!==false).sort((a,b)=>a.name.localeCompare(b.name,'da'));
  app.activeEmployees=()=>app.db.employees.filter(x=>x.active!==false).sort((a,b)=>a.name.localeCompare(b.name,'da'));
})(window.GTP);
