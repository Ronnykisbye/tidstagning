(function(app){
  const da={dashboard:'Overblik',customers:'Kunder',employees:'Medarbejdere',calendar:'Plan & kalender',logs:'Log',reports:'Rapporter',settings:'Indstillinger',start:'Start',stop:'Stop',save:'Gem',cancel:'Annuller',delete:'Slet',edit:'Rediger',noData:'Ingen data endnu'};
  const packs={da,en:{dashboard:'Overview',customers:'Customers',employees:'Employees',calendar:'Plan & calendar',logs:'Log',reports:'Reports',settings:'Settings',start:'Start',stop:'Stop',save:'Save',cancel:'Cancel',delete:'Delete',edit:'Edit',noData:'No data yet'},de:{dashboard:'Übersicht',customers:'Kunden',employees:'Mitarbeiter',calendar:'Plan & Kalender',logs:'Protokoll',reports:'Berichte',settings:'Einstellungen',start:'Start',stop:'Stopp',save:'Speichern',cancel:'Abbrechen',delete:'Löschen',edit:'Bearbeiten',noData:'Noch keine Daten'},lt:{dashboard:'Apžvalga',customers:'Klientai',employees:'Darbuotojai',calendar:'Planavimas ir kalendorius',logs:'Žurnalas',reports:'Ataskaitos',settings:'Nustatymai',start:'Pradėti',stop:'Stabdyti',save:'Išsaugoti',cancel:'Atšaukti',delete:'Ištrinti',edit:'Redaguoti',noData:'Duomenų dar nėra'}};
  app.lang=localStorage.getItem('gtp_lang')||'da';
  app.t=k=>(packs[app.lang]||da)[k]||da[k]||k;
  app.applyLanguage=function(){
    document.documentElement.lang=app.lang;
    document.querySelectorAll('[data-i18n]').forEach(el=>el.textContent=app.t(el.dataset.i18n));
    document.querySelectorAll('[data-lang]').forEach(el=>el.classList.toggle('active',el.dataset.lang===app.lang));
    app.refreshPageTitle?.();
  };
  app.setLanguage=l=>{app.lang=l;localStorage.setItem('gtp_lang',l);app.applyLanguage();};
})(window.GTP);

