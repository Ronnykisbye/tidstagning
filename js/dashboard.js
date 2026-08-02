(function(app){
  const localDate=(date=new Date())=>{const d=new Date(date);d.setMinutes(d.getMinutes()-d.getTimezoneOffset());return d.toISOString().slice(0,10);};
  function renderMetrics(){
    const today=localDate(),todayBookings=app.db.bookings.filter(b=>b.date===today);
    const activeEmployees=new Set(todayBookings.flatMap(b=>b.employeeIds||[])).size;
    const monday=new Date();monday.setHours(0,0,0,0);monday.setDate(monday.getDate()-((monday.getDay()+6)%7));
    const weekSeconds=app.db.entries.filter(e=>new Date(e.start)>=monday).reduce((sum,e)=>sum+Number(e.seconds||0),0);
    const values={todayBookingCount:todayBookings.length,weekHours:(weekSeconds/3600).toLocaleString('da-DK',{maximumFractionDigits:1}),activeEmployeeCount:activeEmployees};
    Object.entries(values).forEach(([id,value])=>{const node=document.getElementById(id);if(node)node.textContent=value;});
  }
  function render(){
    const box=document.getElementById('upcomingBookings');if(!box)return;
    const items=app.db.bookings.filter(b=>b.date>=localDate()).sort((a,b)=>(a.date+a.start).localeCompare(b.date+b.start)).slice(0,4);
    box.innerHTML=items.length?items.map(b=>{const date=new Date(b.date+'T12:00').toLocaleDateString('da-DK',{weekday:'short',day:'numeric',month:'short'}),names=(b.employeeIds||[]).map(id=>app.employee(id)?.name).filter(Boolean).join(', ');return '<article class="upcoming-item"><div><strong>'+app.escape(app.customer(b.customerId)?.name||'Ukendt kunde')+'</strong><p>'+app.escape(b.note||'Planlagt opgave')+'</p><small>'+app.escape(names)+'</small></div><div class="upcoming-date">'+date+' · '+app.escape(b.start)+'</div></article>';}).join(''):'<p>Der er ingen kommende aftaler.</p>';
    renderMetrics();
  }
  app.initDashboard=function(){
    document.querySelectorAll('[data-go-page]').forEach(button=>button.onclick=()=>{app.showPage(button.dataset.goPage);if(button.hasAttribute('data-open-customer'))setTimeout(()=>document.getElementById('addCustomerBtn')?.click(),0);});
    document.getElementById('showCalendarBtn')?.addEventListener('click',()=>app.showPage('calendarPage'));
    document.addEventListener('gtp:data',render);render();
  };
})(window.GTP);
