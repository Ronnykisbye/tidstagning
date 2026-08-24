# GreenTime Pro 4.4

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
- kan markere den enkelte opgave med den diskrete S-knap
- kan beskytte chefudgaven med telefonens lokale godkendelse

Bioadgangen bruger WebAuthn og telefonens platformsgodkendelse. Telefonen bestemmer selv, om der bruges fingeraftryk, ansigt eller enheds-PIN. Den nuværende løsning er en lokal enhedslås; fuld central autentifikation kræver senere serverbaseret kontrol.

## Kunde og adresse

Hver kunde har ét stabilt id. Begge dropdowns bruger dette id:

1. Vælges kundenavnet, vælges adressen automatisk.
2. Vælges adressen, vælges kundenavnet automatisk.
3. Kontaktdata, noter og standardarbejdstype vises straks.

## Data og Google Regneark

Appen virker nu med lokal lagring og fiktive demodata. Datakoden er forberedt til Google Regneark gennem en publiceret Google Apps Script-webapp.

Fanerne oprettes automatisk: Kunder, Adresser, Medarbejdere, Roller, MedarbejderRoller, Opgaver, OpgaveMedarbejdere, Tidsregistreringer, Arbejdstyper og Ændringslog. Demoposter med id, der begynder med demo-, sendes ikke til regnearket.

Kolonnen S findes kun på fanen Opgaver og vises som et afkrydsningsfelt. Der bruges ingen yderligere afregningstekst i appen eller regnearket.

### Tilkobling senere

1. Opret eller åbn firmaets Google-regneark.
2. Vælg Udvidelser → Apps Script.
3. Kopiér indholdet fra google-apps-script/Code.gs ind i Apps Script.
4. Vælg Implementer → Ny implementering → Webapp.
5. Angiv den nødvendige adgang for firmaets brugere.
6. Kopiér webappens /exec-adresse.
7. Åbn Indstillinger → Google Regneark i chefversionen.
8. Indsæt adressen, gem og vælg Test forbindelse.

Regnearkslinket alene er ikke nok til sikker synkronisering. Appen bruger Apps Script-webadressen, så læse- og skriveadgangen kan kontrolleres.

## Registreringsfelter

Dato, start, slut, pause, kunde-id, medarbejder-id, arbejdstype, beskrivelse, tidsforbrug, færdiggørelsesgrad, status, opfølgning, opfølgningsnote, datakilde og stabilt registrerings-id.

Når Google Forms-formularen igen kan aflæses, sammenholdes dens præcise felter med datamodellen. Nye felter kan tilføjes uden at ændre rolle- eller synkroniseringsarkitekturen.

## Installation og kvalitet

Appen kan installeres på mobil, tablet og computer og har manifest, service worker og offlinecache. Den har responsivt layout, lys/mørk tilstand, store trykflader, lokal sikkerhedskopi og CSV-eksport.

## Vigtige filer

- index.html – sider, formularer og dialoger
- css/roles.css – roller og nye komponenter
- js/access.js – profil og adgang
- js/biometric.js – lokal chef-lås med WebAuthn
- js/data-provider.js – lokal/Google Sheets-adapter
- js/storage.js – datamodel og migrering
- js/timer.js – kunde/adressekobling og tidsregistrering
- google-apps-script/Code.gs – serverdel til Google Regneark
- NORMALISERET-REGNEARK.md – faner, nøgler og relationer
- MASTERPROMPT.md – samlet udviklingsgrundlag

## Versionshistorik

- 4.4: Fast rød S-genvej på chefens startside åbner opgaveformularen med S aktiveret.
- 4.3: Chefens S-knap er svagt rød i hvile og kraftigt rød samt fysisk nedtrykket, når den er valgt.
- 4.2: Fast demochef til Ronny Kisbye og otte ekstra kalenderopgaver, også for eksisterende installationer.
- 4.1: Normaliseret regnearksmodel, S-felt og bioadgang til chefudgaven.
- 4.0: Chef/medarbejder-roller, koblet kunde/adresse, udvidet arbejdsregistrering og Google Sheets-forberedelse.
- 3.5: Om-side, navigation og mobilforbedringer.
