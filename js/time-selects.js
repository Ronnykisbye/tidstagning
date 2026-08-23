(function () {
  function buildTimeOptions() {
    document.querySelectorAll('[data-time-select]').forEach(select => {
      const selected = select.value;
      select.innerHTML = '<option value="">Vælg klokkeslæt</option>';
      for (let hour = 0; hour < 24; hour += 1) {
        for (const minute of [0, 30]) {
          const value = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
          select.insertAdjacentHTML('beforeend', `<option value="${value}">${value}</option>`);
        }
      }
      select.value = selected;
    });
  }

  function buildWorkTypes() {
    const options=['Service','Rengøring','Vedligeholdelse','Reparation','Tilsyn','Levering','Andet'];
    document.querySelectorAll('[data-work-type]').forEach(select => {
      const selected=select.value;
      select.innerHTML=options.map(value=>`<option value="${value}">${value}</option>`).join('');
      if(options.includes(selected))select.value=selected;
    });
  }

  document.addEventListener('DOMContentLoaded',()=>{buildTimeOptions();buildWorkTypes();});
  window.GTP = window.GTP || {};
  window.GTP.buildTimeOptions = buildTimeOptions;
  window.GTP.buildWorkTypes = buildWorkTypes;
})();
