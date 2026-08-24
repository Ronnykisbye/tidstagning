# GreenTime Pro 5.4

GreenTime Pro er en mobilvenlig PWA til et mindre servicefirma. Den kombinerer tidsregistrering, kundedata, medarbejdere, planlægning og rapporter i én interaktiv app.

Live app: https://ronnykisbye.github.io/tidstagning/

## Roller og adgang

En person er én medarbejderpost. Rettigheder ligger separat i `MedarbejderRoller`, så samme person kan have flere roller.

- `Medarbejder` giver almindelig adgang til egne opgaver og tidsregistreringer.
- `Chef` er en ekstra adgangsrolle med administration, rapporter, planlægning, log og indstillinger.
- Lars Wiberg kan derfor være både Medarbejder og Chef.
- Ronny Kisbye er kun Medarbejder og giver ikke adgang til Chef-siden.

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
- tildeler og fjerner Chef-rettighed uden at fjerne personens medarbejderidentitet
- planlægger kundeopgaver og kontrollerer dobbeltbookinger
- bruger rapportgeneratoren og eksporterer CSV til Excel
- ser log, sikkerhedskopi og synkroniseringsindstillinger
- kan markere en kunde med den diskrete S-knap i kundevinduet; nye opgaver hos kunden arver markeringen
- kan beskytte chefudgaven med telefonens lokale godkendelse

Bioadgangen bruger WebAuthn og telefonens platformsgodkendelse. Telefonen bestemmer selv, om der bruges fingeraftryk, ansigt eller enheds-PIN. Den nuværende løsning er en lokal enhedslås; fuld central autentifikation kræver senere serverbaseret kontrol.

## Kunde og adresse

Hver kunde har ét stabilt id. Begge dropdowns bruger dette id:

1. Vælges kundenavnet, vælges adressen automatisk.
2. Vælges adressen, vælges kundenavnet automatisk.
3. Kontaktdata, noter og standardarbejdstype vises straks.

## Rapportgenerator

Chef-siden har en rapportgenerator med rullemenu for rapporttype samt filtre for periode, kunde og medarbejder.

Rapporttyper:

- Detaljeret tidsrapport
- Timer for medarbejder
- Timer hos kunde
- Samlet timeforbrug pr. kunde
- Samlet timeforbrug pr. medarbejder
- Ikke færdige registreringer
- Kræver opfølgning

Rapporterne bruger både nye data og migrerede historiske data fra Sheetet.

### Regel for gamle data

Legacy-feltet `Tidsforbrug` er decimaltimer. Historiske opgaver med sikkert tidsforbrug kan indgå i kunderapporter og samlede detailrapporter.

Gamle gruppetimer fordeles aldrig automatisk på medarbejdere. Derfor:

- kunderapporter kan bruge historiske gruppetimer én gang pr. opgave
- medarbejderrapporter bruger kun timer, der sikkert kan knyttes til en bestemt medarbejder
- der opfindes aldrig medarbejdertimer ud fra `alle` eller flerpersonsfelter

## Data og Google Regneark

Appen fungerer lokalt og kan synkronisere gennem en publiceret Google Apps Script-webapp. Kommunikation går aldrig direkte til regnearkets almindelige redigeringslink.

Den normaliserede struktur bruger fanerne:

- Kunder
- Adresser
- Medarbejdere
- Roller
- MedarbejderRoller
- Opgaver
- OpgaveMedarbejdere
- Tidsregistreringer
- Arbejdstyper
- Ændringslog

Version 5.4 udvider synkroniseringen, så Apps Script returnerer alle normaliserede tabeller, herunder `Opgaver`, `OpgaveMedarbejdere`, `Tidsregistreringer`, `Arbejdstyper` og `Ændringslog`. Appen indlæser dermed også migrerede historiske Sheet-data til rapporter.

Sikkerhedsregler:

- demo-id'er afvises både i klienten og på Apps Script-serveren
- manglende kolonner tilføjes uden at forskubbe eksisterende data
- upserts bruger stabile id'er
- serverændringer registreres i Ændringslog
- gamle Forms-data bevares uændret i `Formularsvar 1`
- migration er idempotent og må ikke gætte på uklare værdier

Kolonnen S findes på fanerne Kunder og Opgaver som et afkrydsningsfelt. Kundens S-værdi er kun standard for nye opgaver; en allerede oprettet opgaves historiske S-værdi ændres ikke automatisk.

## Legacy Google Forms-data

`Formularsvar 1` er den originale historiske kilde og ændres ikke.

De sikre gamle data er migreret til de normaliserede faner med stabile `legacy-...`-id'er. Kunder, adresser, 12 historiske opgaver, sikre medarbejderrelationer og entydige tidsregistreringer er bevaret. Uklare gruppetimer bliver stående som historiske opgavetimer og fordeles ikke på personer.

Se også `MIGRATION-LEGACY.md`.

## Apps Script og deployment

Repoets serverkode ligger i `google-apps-script/Code.gs` og er version 5.4.

Når serverkoden ændres, skal den publicerede Google Apps Script-webapp opdateres:

1. Åbn firmaets Google-regneark.
2. Vælg Udvidelser → Apps Script.
3. Erstat `Code.gs` med repoets aktuelle `google-apps-script/Code.gs`.
4. Gem projektet.
5. Vælg Implementer → Administrer implementeringer.
6. Rediger den eksisterende webapp-implementering og vælg en ny version.
7. Bevar den eksisterende `/exec`-adresse, hvis muligt.
8. Åbn GreenTime Pro → Indstillinger → Google Regneark → Test forbindelse.
9. Ping skal svare med version `5.4` og schemaVersion `4`.

Hvis der ikke findes en eksisterende webapp, vælges Implementer → Ny implementering → Webapp, hvorefter `/exec`-adressen indsættes i appens indstillinger.

## Installation og kvalitet

Appen kan installeres på mobil, tablet og computer og har manifest, service worker og offlinecache. Den har responsivt layout, lys/mørk tilstand, store trykflader, lokal sikkerhedskopi og CSV-eksport.

PWA-cache for 5.4 er `greentime-pro-v31`.

## Vigtige filer

- `index.html` – sider, formularer og dialoger
- `js/storage.js` – lokal datamodel og demo-data
- `js/access.js` – rollebaseret adgang
- `js/employees.js` – medarbejdere og roller
- `js/reports.js` – rapportgenerator og historiske rapportregler
- `js/data-provider.js` – lokal/Google Sheets-adapter
- `google-apps-script/Code.gs` – serverdel til Google Regneark
- `MIGRATION-LEGACY.md` – regler for gamle Forms-data
- `NORMALISERET-REGNEARK.md` – faner, nøgler og relationer
- `MASTERPROMPT.md` – samlet udviklingsgrundlag
- `service-worker.js` – offlinecache

## Versionshistorik

- 5.4: Flerrollemodel, Ronny kun Medarbejder, Lars Medarbejder + Chef, migrerede historiske opgaver i Sheetet, rapportgenerator med flere rapporttyper samt læsning af Opgaver/Tidsregistreringer tilbage fra Google Sheets. Historiske gruppetimer tælles i kundetotaler, men fordeles aldrig kunstigt på medarbejdere.
- 5.3: Sikker Google Sheets-migration, server-side demo-blokering, revisionslog, ikke-forskydende kolonneoprettelse og synkroniseret klient/server-version.
- 5.2: Fast installationsvejledning til iPhone/iPad, Android og computer med automatisk markering af den aktuelle enhed.
- 5.1: Gendanner manglende fiktive kunder i eksisterende demoer og henter nye sider før ældre offlinecache.
- 5.0: Lille rød S-knap i kundevinduet; markeringen gemmes på kunden og følger automatisk nye opgaver til regnearket.
- 4.9: Nyt officielt Tidstagning-installationsikon til Android, iPhone, Windows og browser.
- 4.8: Rullende demokalender fra i går til syv dage frem med 2–4 fiktive opgaver hver dag.
- 4.7: Otte ekstra fiktive kalenderopgaver, heraf to i dag; demoopgaver sendes fortsat aldrig til regnearket.
- 4.6: Samlet chef-flow til Opret opgave med eksisterende eller ny kunde og S-valg før gemning.
- 4.1: Normaliseret regnearksmodel, S-felt og bioadgang til chefudgaven.
- 4.0: Chef/medarbejder-roller, koblet kunde/adresse, udvidet arbejdsregistrering og Google Sheets-forberedelse.
