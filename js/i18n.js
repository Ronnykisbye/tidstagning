(function(app){
  const da={dashboard:'Overblik',customers:'Kunder',employees:'Medarbejdere',calendar:'Plan & kalender',logs:'Log',reports:'Rapporter',settings:'Indstillinger',about:'Om appen',language:'Sprog',start:'Start',stop:'Stop',save:'Gem',cancel:'Annuller',delete:'Slet',edit:'Rediger',noData:'Ingen data endnu'};
  const packs={
    da,
    en:{dashboard:'Overview',customers:'Customers',employees:'Employees',calendar:'Plan & calendar',logs:'Log',reports:'Reports',settings:'Settings',about:'About the app',language:'Language',start:'Start',stop:'Stop',save:'Save',cancel:'Cancel',delete:'Delete',edit:'Edit',noData:'No data yet'},
    de:{dashboard:'Übersicht',customers:'Kunden',employees:'Mitarbeiter',calendar:'Plan & Kalender',logs:'Protokoll',reports:'Berichte',settings:'Einstellungen',about:'Über die App',language:'Sprache',start:'Start',stop:'Stopp',save:'Speichern',cancel:'Abbrechen',delete:'Löschen',edit:'Bearbeiten',noData:'Noch keine Daten'},
    lt:{dashboard:'Apžvalga',customers:'Klientai',employees:'Darbuotojai',calendar:'Planavimas ir kalendorius',logs:'Žurnalas',reports:'Ataskaitos',settings:'Nustatymai',about:'Apie programėlę',language:'Kalba',start:'Pradėti',stop:'Stabdyti',save:'Išsaugoti',cancel:'Atšaukti',delete:'Ištrinti',edit:'Redaguoti',noData:'Duomenų dar nėra'}
  };
  const content={
    en:{
      'Chefens overblik':"Manager's overview",'Velkommen tilbage, Lars W. Her er status for firmaet i dag.':'Welcome back, Lars W. Here is the company status today.','Dagens aftaler':"Today's appointments",'planlagte kundeopgaver':'planned customer jobs','Ugens timer':'Hours this week','registrerede timer':'registered hours','Aktive i dag':'Active today','medarbejdere på opgaver':'employees on jobs','Hvad vil du gøre?':'What would you like to do?','Vælg en hurtig handling.':'Choose a quick action.','Tidsregistrér':'Register time','Start eller indtast arbejdstid':'Start or enter working time','Opret kunde':'Create customer','Kunder, adresser og noter':'Customers, addresses and notes','Planlæg opgave':'Plan a job','Sæt medarbejdere på en kunde':'Assign employees to a customer','Åbn kalender':'Open calendar','Se aftaler dag for dag':'View appointments day by day','Næste planlagte opgaver':'Next planned jobs','Dine nærmeste aftaler fra kalenderen.':'Your upcoming calendar appointments.','Se hele kalenderen':'View full calendar','Tidsregistrering':'Time registration','Registrer arbejdstid på en kunde og en eller flere medarbejdere.':'Register working time for a customer and one or more employees.','Manuel registrering':'Manual entry','Gem registrering':'Save entry','Seneste tidsregistreringer':'Latest time entries','Kontaktoplysninger, arbejdssted og noter.':'Contact details, workplace and notes.','+ Tilføj kunde':'+ Add customer','Opret og vedligehold medarbejderlisten.':'Create and maintain the employee list.','+ Tilføj medarbejder':'+ Add employee','Planlæg hvem der skal arbejde hos hvilke kunder.':'Plan who will work for which customers.','Opret booking':'Create booking','Gem booking':'Save booking','De seneste handlinger i appen.':'The latest actions in the app.','Filtrer timer og eksporter resultatet til Excel-kompatibel CSV.':'Filter hours and export the result as an Excel-compatible CSV.','Vis rapport':'Show report','Eksportér CSV':'Export CSV','Installation, sikkerhedskopi og gendannelse.':'Installation, backup and restore.','Installér appen':'Install the app','Sikkerhedskopi':'Backup','Hent sikkerhedskopi':'Download backup','Gendan':'Restore','Vælg sikkerhedskopi':'Choose backup','Om appen':'About the app','Sådan kommer du i gang':'Getting started','Vigtigt om demoversionen':'Important about the demo version'
    },
    de:{
      'Chefens overblik':'Übersicht der Leitung','Velkommen tilbage, Lars W. Her er status for firmaet i dag.':'Willkommen zurück, Lars W. Hier ist der heutige Firmenstatus.','Dagens aftaler':'Heutige Termine','planlagte kundeopgaver':'geplante Kundenaufträge','Ugens timer':'Wochenstunden','registrerede timer':'erfasste Stunden','Aktive i dag':'Heute aktiv','medarbejdere på opgaver':'Mitarbeiter im Einsatz','Hvad vil du gøre?':'Was möchten Sie tun?','Vælg en hurtig handling.':'Wählen Sie eine Schnellaktion.','Tidsregistrér':'Zeit erfassen','Start eller indtast arbejdstid':'Arbeitszeit starten oder eingeben','Opret kunde':'Kunden anlegen','Kunder, adresser og noter':'Kunden, Adressen und Notizen','Planlæg opgave':'Auftrag planen','Sæt medarbejdere på en kunde':'Mitarbeiter einem Kunden zuordnen','Åbn kalender':'Kalender öffnen','Se aftaler dag for dag':'Termine Tag für Tag anzeigen','Næste planlagte opgaver':'Nächste geplante Aufträge','Dine nærmeste aftaler fra kalenderen.':'Ihre nächsten Kalendertermine.','Se hele kalenderen':'Gesamten Kalender anzeigen','Tidsregistrering':'Zeiterfassung','Registrer arbejdstid på en kunde og en eller flere medarbejdere.':'Arbeitszeit für einen Kunden und einen oder mehrere Mitarbeiter erfassen.','Manuel registrering':'Manuelle Erfassung','Gem registrering':'Eintrag speichern','Seneste tidsregistreringer':'Neueste Zeiteinträge','Kontaktoplysninger, arbejdssted og noter.':'Kontaktdaten, Arbeitsort und Notizen.','+ Tilføj kunde':'+ Kunde hinzufügen','Opret og vedligehold medarbejderlisten.':'Mitarbeiterliste erstellen und pflegen.','+ Tilføj medarbejder':'+ Mitarbeiter hinzufügen','Planlæg hvem der skal arbejde hos hvilke kunder.':'Planen Sie, wer bei welchen Kunden arbeitet.','Opret booking':'Buchung erstellen','Gem booking':'Buchung speichern','De seneste handlinger i appen.':'Die letzten Aktionen in der App.','Filtrer timer og eksporter resultatet til Excel-kompatibel CSV.':'Stunden filtern und als Excel-kompatible CSV exportieren.','Vis rapport':'Bericht anzeigen','Eksportér CSV':'CSV exportieren','Installation, sikkerhedskopi og gendannelse.':'Installation, Sicherung und Wiederherstellung.','Installér appen':'App installieren','Sikkerhedskopi':'Sicherung','Hent sikkerhedskopi':'Sicherung herunterladen','Gendan':'Wiederherstellen','Vælg sikkerhedskopi':'Sicherung auswählen','Om appen':'Über die App','Sådan kommer du i gang':'Erste Schritte','Vigtigt om demoversionen':'Wichtig zur Demoversion'
    },
    lt:{
      'Chefens overblik':'Vadovo apžvalga','Velkommen tilbage, Lars W. Her er status for firmaet i dag.':'Sveiki sugrįžę, Lars W. Štai šiandienos įmonės būklė.','Dagens aftaler':'Šiandienos susitikimai','planlagte kundeopgaver':'suplanuotos klientų užduotys','Ugens timer':'Savaitės valandos','registrerede timer':'užregistruotos valandos','Aktive i dag':'Šiandien dirba','medarbejdere på opgaver':'darbuotojai užduotyse','Hvad vil du gøre?':'Ką norite daryti?','Vælg en hurtig handling.':'Pasirinkite greitą veiksmą.','Tidsregistrér':'Registruoti laiką','Start eller indtast arbejdstid':'Pradėkite arba įveskite darbo laiką','Opret kunde':'Sukurti klientą','Kunder, adresser og noter':'Klientai, adresai ir pastabos','Planlæg opgave':'Planuoti užduotį','Sæt medarbejdere på en kunde':'Priskirti darbuotojus klientui','Åbn kalender':'Atidaryti kalendorių','Se aftaler dag for dag':'Peržiūrėti susitikimus pagal dienas','Næste planlagte opgaver':'Kitos suplanuotos užduotys','Dine nærmeste aftaler fra kalenderen.':'Artimiausi kalendoriaus susitikimai.','Se hele kalenderen':'Rodyti visą kalendorių','Tidsregistrering':'Laiko registracija','Registrer arbejdstid på en kunde og en eller flere medarbejdere.':'Registruokite kliento ir vieno ar kelių darbuotojų darbo laiką.','Manuel registrering':'Rankinis įrašas','Gem registrering':'Išsaugoti įrašą','Seneste tidsregistreringer':'Naujausi laiko įrašai','Kontaktoplysninger, arbejdssted og noter.':'Kontaktai, darbo vieta ir pastabos.','+ Tilføj kunde':'+ Pridėti klientą','Opret og vedligehold medarbejderlisten.':'Kurkite ir tvarkykite darbuotojų sąrašą.','+ Tilføj medarbejder':'+ Pridėti darbuotoją','Planlæg hvem der skal arbejde hos hvilke kunder.':'Planuokite, kas dirbs pas kuriuos klientus.','Opret booking':'Sukurti rezervaciją','Gem booking':'Išsaugoti rezervaciją','De seneste handlinger i appen.':'Naujausi veiksmai programėlėje.','Filtrer timer og eksporter resultatet til Excel-kompatibel CSV.':'Filtruokite valandas ir eksportuokite į CSV.','Vis rapport':'Rodyti ataskaitą','Eksportér CSV':'Eksportuoti CSV','Installation, sikkerhedskopi og gendannelse.':'Diegimas, atsarginė kopija ir atkūrimas.','Installér appen':'Įdiegti programėlę','Sikkerhedskopi':'Atsarginė kopija','Hent sikkerhedskopi':'Atsisiųsti kopiją','Gendan':'Atkurti','Vælg sikkerhedskopi':'Pasirinkti kopiją','Om appen':'Apie programėlę','Sådan kommer du i gang':'Kaip pradėti','Vigtigt om demoversionen':'Svarbu apie demonstracinę versiją'
    }
  };
  const originals=new WeakMap();
  const valid=new Set(Object.keys(packs));
  app.lang=valid.has(localStorage.getItem('gtp_lang'))?localStorage.getItem('gtp_lang'):'da';
  app.t=k=>(packs[app.lang]||da)[k]||da[k]||k;

  function translateContent(){
    const map=content[app.lang]||{};
    const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
    let node;
    while((node=walker.nextNode())){
      if(node.parentElement?.closest('script,style,[data-no-i18n]'))continue;
      if(!originals.has(node))originals.set(node,node.nodeValue);
      const original=originals.get(node);
      const trimmed=original.trim();
      if(!trimmed)continue;
      const translated=map[trimmed];
      node.nodeValue=translated?original.replace(trimmed,translated):original;
    }
  }

  app.applyLanguage=function(){
    document.documentElement.lang=app.lang;
    document.querySelectorAll('[data-i18n]').forEach(el=>el.textContent=app.t(el.dataset.i18n));
    translateContent();
    document.querySelectorAll('[data-lang]').forEach(el=>{
      const active=el.dataset.lang===app.lang;
      el.classList.toggle('active',active);
      el.setAttribute('aria-pressed',String(active));
    });
    app.refreshPageTitle?.();
  };
  app.setLanguage=l=>{
    if(!valid.has(l))return;
    app.lang=l;
    localStorage.setItem('gtp_lang',l);
    app.applyLanguage();
  };
})(window.GTP);
