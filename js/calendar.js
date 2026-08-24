(function(app){
  let shown=new Date();shown.setDate(1);let selected=new Date().toISOString().slice(0,10),draftS=false;
  const localDate=date=>new Date(date.getTime()-date.getTimezoneOffset()*60000).toISOString().slice(0,10);
  const visible=()=>app.db.bookings.filter(x=>x.active!==false).filter(app.canSeeBooking);
  function conflict(candidate){
    const start=new Date(`${candidate.date}T${candidate.start}`),end=new Date(start.getTime()+Number(candidate.duration)*3600000);
    return app.db.bookings.find(booking=>booking.id!==candidate.id&&(booking.employeeIds||[]).some(id=>candidate.employeeIds.includes(id))&&(()=>{const bs=new Date(`${booking.date}T${booking.start}`),be=new Date(bs.getTime()+Number(booking.duration)*3600000);return start<be&&end>bs;})());
  }
  function calendar(){
    const grid=document.getElementById('calendarGrid'),bookings=visible();
    document.getElementById('monthLabel').textContent=shown.toLocaleDateString('da-DK',{month:'long',year:'numeric'});
    grid.innerHTML=['Man','Tir','Ons','Tor','Fre','Lør','Søn'].map(x=>`<div class="weekday">${x}</div>`).join('');
    const first=(shown.getDay()+6)%7,last=new Date(shown.getFullYear(),shown.getMonth()+1,0).getDate();
    for(let i=0;i<first;i++)grid.insertAdjacentHTML('beforeend','<div></div>');
    for(let day=1;day<=last;day++){
      const key=localDate(new Date(shown.getFullYear(),shown.getMonth(),day)),count=bookings.filter(x=>x.date===key).length,button=document.createElement('button'),level=count>=4?'appointment-high':count?'appointment-low':'';
      button.className=`day ${key===selected?'selected':''} ${count?'has-appointments':''} ${level}`;
      button.innerHTML=`<span class="day-number">${day}</span>${count?`<span class="appointment-count">${count}</span>`:''}`;
      button.setAttribute('aria-label',`${day}.: ${count} aftaler`);button.onclick=()=>{selected=key;document.getElementById('bookingDate').value=key;calendar();dayList();};grid.append(button);
    }
  }
  function dayList(){
    const box=document.getElementById('dayBookings'),items=visible().filter(x=>x.date===selected).sort((a,b)=>a.start.localeCompare(b.start));
    document.getElementById('selectedDate').textContent=new Date(`${selected}T12:00`).toLocaleDateString('da-DK',{weekday:'long',day:'numeric',month:'long'});
    box.innerHTML=items.length?items.map(booking=>`<article class="booking"><div><strong>${booking.start} · ${app.escape(app.customer(booking.customerId)?.name||'')}</strong><p>${app.escape(booking.note||'')}</p><small>${(booking.employeeIds||[]).map(id=>app.employee(id)?.name).filter(Boolean).join(', ')} · ${booking.duration} timer</small></div>${app.isManager()?`<div class="booking-controls"><button class="icon-btn danger" data-book-del="${booking.id}">🗑️</button></div>`:''}</article>`).join(''):'<p>Ingen bookinger denne dag.</p>';
    box.querySelectorAll('[data-book-del]').forEach(button=>button.onclick=()=>{if(confirm('Arkivér bookingen?')){const booking=app.db.bookings.find(x=>x.id===button.dataset.bookDel);booking.active=false;app.save('Booking arkiveret');}});
  }
  app.initCalendar=function(){
    document.getElementById('prevMonth').onclick=()=>{shown.setMonth(shown.getMonth()-1);calendar();};document.getElementById('nextMonth').onclick=()=>{shown.setMonth(shown.getMonth()+1);calendar();};
    document.getElementById('bookingDate').value=selected;
    const specialButton=document.getElementById('bookingSpecial');
    const drawSpecial=()=>{specialButton.classList.toggle('active',draftS);specialButton.setAttribute('aria-pressed',String(draftS));};
    specialButton.onclick=()=>{draftS=!draftS;drawSpecial();};
    app.openBookingCreator=()=>{if(!app.isManager())return;app.showPage('calendarPage');setTimeout(()=>{document.getElementById('bookingEditor')?.scrollIntoView({behavior:'smooth',block:'start'});document.getElementById('bookingCustomer')?.focus();},100);};
    let waitingForCustomer=false;
    document.getElementById('bookingNewCustomer').onclick=()=>{waitingForCustomer=true;app.openCustomer?.();};
    document.addEventListener('gtp:customer-saved',event=>{if(!waitingForCustomer)return;waitingForCustomer=false;app.fillSelects?.();document.getElementById('bookingCustomer').value=event.detail.customerId;document.getElementById('bookingEditor')?.scrollIntoView({behavior:'smooth',block:'start'});});
    document.getElementById('bookingForm').onsubmit=event=>{
      event.preventDefault();if(!app.isManager())return;
      const values=Object.fromEntries(new FormData(event.target)),employeeIds=[...document.querySelectorAll('#bookingEmployees input:checked')].map(x=>x.value),booking={...values,id:app.uid(),employeeIds,S:draftS,status:'Planlagt',active:true,addressId:app.customerAddress(values.customerId)?.id||''};
      if(!employeeIds.length)return alert('Vælg mindst én medarbejder.');
      const hit=conflict(booking);if(hit&&!confirm(`En medarbejder er allerede booket kl. ${hit.start}. Gem alligevel?`))return;
      app.db.bookings.push(booking);app.save('Opgave oprettet');selected=booking.date;event.target.reset();draftS=false;drawSpecial();document.getElementById('bookingDate').value=selected;app.fillSelects();app.toast('Opgaven er planlagt');
    };
    const update=()=>{calendar();dayList();};document.addEventListener('gtp:data',update);document.addEventListener('gtp:session',update);update();
  };
})(window.GTP);
