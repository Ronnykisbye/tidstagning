# GreenTime Pro 5.3

GreenTime Pro er en mobilvenlig PWA til et mindre servicefirma. Den kombinerer tidsregistrering, kundedata, medarbejdere, planlægning og rapporter i én interaktiv app.

Live app: https://ronnykisbye.github.io/tidstagning/

## Ny rollebaseret app

Ved første start vælger brugeren app-type og navn. Valget gemmes på den enkelte telefon.

### Medarbejderversion

- vælger sin profil fra medarbejderlisten
- ser egne planlagte opgaver og tidsregistreringer
- ser kundens navn, adresse, telefon og arbejdsnote
- vælger kunde efter navn eller adresse; det andet felt udfyldes automatisk
- bruger start/stop-timer eller manuel registrering
- registrerer arbejdstype, pause, status, færdig procent og opfølgning

### Chefversion

- har alle medarbejderfunktioner og kan selv registrere arbejde
- ser hele firmaets kalender, timer og registreringer
- opretter, redigerer og arkiverer kunder og medarbejdere
- planlægger kundeopgaver og kontrollerer dobbeltbookinger
- filtrerer rapporter og eksporterer CSV til Excel
- ser log, sikkerhedskopi og synkroniseringsindstillinger
- kan markere en kunde med den diskrete S-knap i kundevinduet; nye opgaver hos kunden arver markeringen
- kan beskytte chefudgaven med telefonens lokale godkendelse
- opretter en opgave fra startsiden og vælger en eksisterende kunde eller opretter en ny direkte i opgaveforløbet

Bioadgangen bruger WebAuthn og telefonens platformsgodkendelse. Telefonen bestemmer selv, om der bruges fingeraftryk, ansigt eller enheds-PIN. Den nuværende løsning er en lokal enhedslås; fuld central autentifikation kræver senere serverbaseret kontrol.

## Kunde og adresse

Hver kunde har ét stabilt id. Begge dropdowns bruger dette id:

1. Vælges kundenavnet, vælges adressen automatisk.
2. Vælges adressen, vælges kundenavnet automatisk.
3. Kontaktdata, noter og standardarbejdstype vises straks.

## Data og Google Regneark

Appen fungerer lokalt og kan synkronisere gennem en publiceret Google Apps Script-webapp. Kommunikation går aldrig direkte til regnearkets almindelige redigeringslink.

Den normaliserede struktur bruger fanerne Kunder, Adresser, Medarbejdere, Roller, MedarbejderRoller, Opgaver, OpgaveMedarbejdere, Tidsregistreringer, Arbejdstyper og Ændringslog.

Version 5.3 styrker synkroniseringen:

- demo-id'er afvises både i klienten og på Apps Script-serveren
- manglende kolonner tilføjes uden at forskubbe eksisterende data
- upserts bruger stabile id'er
- serverændringer registreres i Ændringslog
- service- og klientversion er synkroniseret til 5.3

Kolonnen S findes på fanerne Kunder og Opgaver som et afkrydsningsfelt. Kundens S-værdi er kun standard for nye opgaver; en allerede oprettet opgaves historiske S-værdi ændres ikke automatisk.

### Legacy Google Forms-data

Det eksisterende `Formularsvar 1` bevares som original historik. Normaliserede data oprettes ved siden af legacy-fanen i stedet for at omskrive formularsvarene. Migration skal kunne gentages uden dubletter og må ikke gætte på uklare enheder, medarbejderrelationer eller andre tvetydige værdier.

### Tilkobling

1. Åbn firmaets Google-regneark.
2. Vælg Udvidelser → Apps Script.
3. Kopiér indholdet fra `google-apps-script/Code.gs` ind i Apps Script.
4. Vælg Implementer → Ny implementering → Webapp.
5. Angiv den nødvendige adgang for firmaets brugere.
6. Kopiér webappens `/exec`-adresse.
7. Åbn Indstillinger → Google Regneark i chefversionen.
8. Indsæt adressen, gem og vælg Test forbindelse.

## Installation og kvalitet

Appen kan installeres på mobil, tablet og computer og har manifest, service worker og offlinecache. Den har responsivt layout, lys/mørk tilstand, store trykflader, lokal sikkerhedskopi og CSV-eksport.

## Vigtige filer

- `index.html` – sider, formularer og dialoger
- `js/data-provider.js` – lokal/Google Sheets-adapter
- `google-apps-script/Code.gs` – serverdel til Google Regneark
- `NORMALISERET-REGNEARK.md` – faner, nøgler og relationer
- `MASTERPROMPT.md` – samlet udviklingsgrundlag
- `service-worker.js` – offlinecache

## Versionshistorik

- 5.3: Sikker Google Sheets-migration, server-side demo-blokering, revisionslog, ikke-forskydende kolonneoprettelse og synkroniseret klient/server-version.
- 5.2: Fast installationsvejledning til iPhone/iPad, Android og computer med automatisk markering af den aktuelle enhed.
- 5.1: Gendanner manglende fiktive kunder i eksisterende demoer og henter nye sider før ældre offlinecache.
- 5.0: Lille rød S-knap i kundevinduet; markeringen gemmes på kunden og følger automatisk nye opgaver til regnearket.
- 4.9: Nyt officielt Tidstagning-installationsikon til Android, iPhone, Windows og browser.
- 4.8: Rullende demokalender fra i går til syv dage frem med 2–4 fiktive opgaver hver dag.
- 4.7: Otte ekstra fiktive kalenderopgaver, heraf to i dag; demoopgaver sendes fortsat aldrig til regnearket.
- 4.6: Samlet chef-flow til Opret opgave med eksisterende eller ny kunde og S-valg før gemning.
- 4.5: Den lille S-knap vises kun, mens chefen opretter en opgave; efter gemning ses markeringen kun i regnearket.
- 4.4: Fast rød S-genvej på chefens startside åbner opgaveformularen med S aktiveret.
- 4.3: Chefens S-knap er svagt rød i hvile og kraftigt rød samt fysisk nedtrykket, når den er valgt.
- 4.2: Fast demochef til Ronny Kisbye og otte ekstra kalenderopgaver, også for eksisterende installationer.
- 4.1: Normaliseret regnearksmodel, S-felt og bioadgang til chefudgaven.
- 4.0: Chef/medarbejder-roller, koblet kunde/adresse, udvidet arbejdsregistrering og Google Sheets-forberedelse.
- 3.5: Om-side, navigation og mobilforbedringer.
