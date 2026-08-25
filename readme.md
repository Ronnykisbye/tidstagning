# GreenTime Pro 5.6

GreenTime Pro er en mobilvenlig PWA til et mindre servicefirma. Den kombinerer tidsregistrering, kundedata, medarbejdere, planlægning og rapporter i én interaktiv app.

Live app: https://ronnykisbye.github.io/tidstagning/

## Roller og adgang

En person er én medarbejderpost. Rettigheder ligger separat i `MedarbejderRoller`, så samme person kan have flere roller.

- `Medarbejder` giver almindelig adgang til egne opgaver og tidsregistreringer.
- `Chef` er en ekstra adgangsrolle med administration, rapporter, planlægning, log og indstillinger.
- Lars Wiberg har Medarbejder + Chef.
- Ronny Kisbye er kun Medarbejder.

## Rapportgenerator

Chef-siden har rapporter for bl.a. medarbejdertimer, kundetimer, samlet timeforbrug pr. kunde/medarbejder, ikke-færdige registreringer og opfølgning.

Legacy-feltet `Tidsforbrug` er decimaltimer. Gamle gruppetimer tælles én gang i kundetotaler, men fordeles aldrig automatisk på medarbejdere.

## Data og Google Regneark

Produktionsarket er:
`1L7cf-mY_RD3UBDTqDSa7MJIweqxaxoFs2QC3pAcUjWI`

Apps Script åbner dette ark direkte med `SpreadsheetApp.openById(...)`.

Den normaliserede struktur bruger fanerne Kunder, Adresser, Medarbejdere, Roller, MedarbejderRoller, Opgaver, OpgaveMedarbejdere, Tidsregistreringer, Arbejdstyper og Ændringslog.

### Ny synkroniseringsmodel i 5.6

Læsning og skrivning er nu adskilt:

- `pull` er ren læsning fra Sheetet og skriver ingenting.
- `sync` bruges til at gemme reelle ændringer og returnerer derefter opdaterede data.
- appstart bruger `pull`, hvis `/exec` er konfigureret.
- `Test forbindelse` bruger `ping` + `pull`.
- demo-id'er afvises både i klienten og serveren.

Det betyder, at første indlæsning ikke længere sender lokale eller delvist indlæste data op, før de rigtige Sheet-data er hentet.

## Legacy-data

`Formularsvar 1` bevares som historisk kilde.

Migreret status:
- 11 kunder
- 10 adresser
- 12 historiske opgaver
- 5 medarbejderposter, hvor Lars Wiberg, Nanna og Ronny Kisbye er aktive
- entydige tidsregistreringer migreret
- uklare gruppetimer ikke fordelt på personer

## Apps Script og deployment

Repoets serverkode ligger i `google-apps-script/Code.gs` og er version 5.6.

Når serverkoden ændres:
1. Åbn Google Sheet → Udvidelser → Apps Script.
2. Erstat `Code.gs` med repoets aktuelle fil.
3. Gem.
4. Implementer → Administrer implementeringer.
5. Rediger eksisterende webapp og vælg ny version.
6. Bevar samme `/exec`-adresse.
7. Test i GreenTime Pro → Chef → Indstillinger → Google Regneark.

Ping skal svare med version `5.6`, schemaVersion `4`.

Testen viser både antal poster i Sheetet og antal aktive poster, så det bliver tydeligt, om hele datasættet er hentet.

## PWA

Aktuel cache: `greentime-pro-v35`.

## Vigtige filer

- `index.html` – sider og formularer
- `js/storage.js` – lokal datamodel og demo-data
- `js/access.js` – rollebaseret adgang
- `js/reports.js` – rapportgenerator
- `js/data-provider.js` – Google Sheets-adapter med `pull` og `sync`
- `js/settings.js` – forbindelsestest og diagnostik
- `google-apps-script/Code.gs` – serverdel til Google Regneark
- `MASTERPROMPT.md` – samlet udviklingsgrundlag
- `MIGRATION-LEGACY.md` – regler for gamle data
- `service-worker.js` – offlinecache

## Versionshistorik

- 5.6: Ren read-only `pull` fra Sheetet ved opstart og forbindelsestest, fast produktions-Sheet-ID, separat skrivende `sync`, forbedret diagnostik og cache v35.
- 5.5: Apps Script blev låst til det konkrete produktions-Sheet-ID.
- 5.4: Flerrollemodel, rapportgenerator og læsning af migrerede opgaver/tidsregistreringer.
- 5.3: Sikker Google Sheets-migration, demo-blokering og revisionslog.
