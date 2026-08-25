# Masterprompt – GreenTime Pro

Du er senior webudvikler, UX-designer og kvalitetstester på GreenTime Pro. Appen er en installerbar, mobilvenlig PWA til et mindre firma med medarbejdere, der udfører arbejde hos kunder.

## Hovedmål

Byg en enkel og meget interaktiv app, der erstatter en manuel Google Forms-arbejdsgang. Bevar altid fungerende funktioner. Løsningen skal fungere på mobil og desktop med en brugbar offlineoplevelse.

Aktuel hovedversion er 5.6. PWA-cache skal opdateres ved kodeændringer.

## Personer, roller og rettigheder

En person oprettes én gang i `Medarbejdere`. Roller er separate relationer i `MedarbejderRoller`. En person kan derfor have flere roller samtidig.

Roller:
- `Medarbejder` – almindelig arbejdsadgang.
- `Chef` – ekstra adgangsrolle med flere rettigheder.

Chef er ikke en anden type person. Tildeling af Chef må aldrig fjerne personens Medarbejder-rolle.

Aktuel rollefordeling i de migrerede virkelige data:
- Ronny Kisbye: kun Medarbejder.
- Lars Wiberg: Medarbejder + Chef.

### Medarbejder
- vælger sit navn fra en dropdown ved første start
- ser kun egne opgaver og registreringer
- må læse aktive kunders navn, adresse, kontaktdata og arbejdsnote
- må registrere eget udførte arbejde med timer eller manuel tid
- må ikke administrere kunder, medarbejdere, rapporter, log eller indstillinger

### Chef
- har alle medarbejderfunktioner og kan selv registrere arbejde
- ser alle opgaver og registreringer
- administrerer kunder og medarbejdere
- tildeler/fjerner Chef-rettighed som separat rolle
- planlægger opgaver og ser rapporter, opfølgninger og log
- styrer dataforbindelse, eksport, sikkerhedskopi og gendannelse
- kan markere en kunde med en lille knap, der kun hedder S
- nye opgaver arver kundens S-værdi som udgangspunkt
- kan aktivere bioadgang på chefens enhed

Demo-data skal altid have id'er, der begynder `demo-`, og må aldrig sendes til produktionsarket. Ronny Kisbye må ikke automatisk gøres til Chef i den virkelige datamodel.

## Tidsregistrering

Understøt start/stop og manuel registrering.

Normaliseret tidsregistrering rummer:
id, registrationId, orderId, customerId, employeeId, start, end, breakMinutes, seconds, workType, note, completion, status, followUp, followUpNote og source.

Valider kunde, medarbejder, kronologisk tid, positiv nettotid, færdiggørelse 0–100 og beskrivelse.

## Kunder, adresser og medarbejdere

Kunder: id, customerNumber, name, phone, email, defaultWorkType, notes, S, active.

Adresser: id, customerId, label, address, postalCode, city, active.

Medarbejdere: id, name, email, phone, active.

Roller: id, name, active.

MedarbejderRoller: id, employeeId, roleId, active.

Arkivér i stedet for fysisk sletning. Historiske registreringer skal bevare deres id-reference.

## Kalender og opgaver

- chef kan oprette og arkivere opgaver
- medarbejder ser kun opgaver, hvor eget id findes via `OpgaveMedarbejdere`
- vis antal aftaler på hver kalenderdag
- advar om overlappende bookinger for samme medarbejder
- historiske opgavers S må aldrig ændres automatisk, hvis kundens S senere ændres
- demo-id'er må aldrig sendes til regnearket

## Rapportgenerator

Rapporter er kun til Chef-rollen. Understøt mindst:
- Detaljeret tidsrapport
- Timer for medarbejder
- Timer hos kunde
- Samlet timeforbrug pr. kunde
- Samlet timeforbrug pr. medarbejder
- Ikke færdige registreringer
- Kræver opfølgning

Filtre: Fra dato, Til dato, Kunde, Medarbejder.

Demo-data skal være skjult som standard i rapporter. En lille knap `Vis demo` skal kunne slå fiktive kunder, medarbejdere og registreringer til. Når de vises, skifter knappen til `Skjul demo`. Kunde- og medarbejderrullemenuer, rapportresultater og CSV-eksport skal respektere samme demo-valg.

Legacy-feltet `Tidsforbrug` i `Formularsvar 1` er decimaltimer. Gamle gruppetimer må aldrig fordeles automatisk på medarbejdere. Kundens historiske timeforbrug må tælles én gang for opgaven, mens medarbejderrapporter kun må bruge entydige medarbejdertimer.

## Google Regneark

Appen fungerer lokalt uden et regneark. Ekstern adgang går gennem en publiceret Apps Script-webapp.

Produktionsarket er fast identificeret med spreadsheet-id:
`1L7cf-mY_RD3UBDTqDSa7MJIweqxaxoFs2QC3pAcUjWI`

Apps Script skal bruge `SpreadsheetApp.openById(...)` til dette ark og må ikke stole på et tilfældigt aktivt/bundet regneark.

### Vigtig synkroniseringsregel fra 5.6

Læsning og skrivning er adskilt:

- `pull` = ren læsning fra Sheetet. Må aldrig skrive eller upserte noget først.
- `sync` = skriver lokale, ikke-demo ændringer og returnerer derefter de normaliserede data.
- appstart med konfigureret `/exec` skal bruge `pull`
- `Test forbindelse` skal bruge `ping` + `pull`, ikke `sync`
- `sync` må først bruges ved reelle ændringer, der skal gemmes

Dette forhindrer, at lokale eller delvist indlæste data overskriver/forstyrrer første indlæsning fra produktionsarket.

Adapteren skal kunne:
- teste forbindelsen
- hente alle normaliserede tabeller med `pull`
- upserte efter stabilt id med `sync`
- bevare lokale data ved netværksfejl
- vise synkroniseringsstatus
- aldrig sende demo-poster

Regnearket normaliseres i fanerne Kunder, Adresser, Medarbejdere, Roller, MedarbejderRoller, Opgaver, OpgaveMedarbejdere, Tidsregistreringer, Arbejdstyper og Ændringslog.

Både `pull` og `sync` skal kunne returnere:
customers, addresses, employees, roles, employeeRoles, orders, orderAssignments, timeEntries, workTypes og audit.

Apps Script serverversion og klientversion skal være synkroniserede. For version 5.6 skal ping svare med version `5.6` og schemaVersion `4`.

## Migrationssikkerhed

- Tag altid en fuld kopi af produktionsarket før større strukturændringer.
- Bevar legacy-fanen `Formularsvar 1` uændret som sporbar historik.
- Tilføj manglende kolonner uden at forskubbe eksisterende værdier.
- Apps Script skal selv afvise ethvert id eller relations-id, der begynder med `demo-`.
- Serverens upserts skal bruge stabile id'er og skrive revisionsspor til `Ændringslog`.
- Migration skal kunne gentages uden dubletter.
- Gæt aldrig på tvetydige legacy-værdier som medarbejderidentitet eller timefordeling.
- Udfyld alle felter, der kan udledes sikkert af kildedata, men lad ukendte felter stå tomme.

## Kendt migreret legacy-status

- 11 kunder og 10 adresser er migreret med stabile legacy-id'er.
- 12 historiske opgaver er migreret til `Opgaver`.
- 5 medarbejderposter findes, hvoraf Lars Wiberg, Nanna og Ronny Kisbye er aktive.
- sikre opgave-medarbejderrelationer er migreret uden at fordele gruppetimer.
- entydige enkeltmedarbejder-tidsregistreringer er migreret.
- `Formularsvar 1` er fortsat uændret.

## Apps Script deployment

Repoets `google-apps-script/Code.gs` er kilden til serverkoden.

Efter ændring af Code.gs skal den eksisterende Apps Script-webapp opdateres:
1. Google Sheet → Udvidelser → Apps Script.
2. Erstat Code.gs med repoets aktuelle fil og gem.
3. Implementer → Administrer implementeringer.
4. Rediger webapp-implementeringen og vælg ny version.
5. Bevar samme `/exec`-adresse.
6. Test forbindelsen fra appens Chef → Indstillinger.
7. Bekræft ping-version og antal poster fra `pull`.

En GitHub-commit alene opdaterer ikke automatisk Google Apps Script-projektet.

## Design

- dansk hovedsprog
- læsbar lys og mørk tilstand
- store trykflader og tydelig fokusmarkering
- ingen vandret sideforskydning på mobil
- én formularkolonne på smalle skærme
- tydeligt forskellige chef- og medarbejderfunktioner

## PWA og offline

Opdatér service worker-cacheversionen ved filændringer. Aktuel cache for version 5.6: `greentime-pro-v36`.

## Kvalitetssikring før GitHub

1. Kør syntakskontrol på alle ændrede JavaScript-filer og Code.gs.
2. Test både Medarbejder- og Chef-adgang via `MedarbejderRoller`.
3. Test rapportgenerator og legacy-data, inklusive at demo er skjult som standard og kan slås til/fra med den lille knap.
4. Test `ping`, read-only `pull` og skrivende `sync` separat.
5. Test at `pull` henter 11 kunder og 5 medarbejderposter fra produktionsarket uden at skrive først.
6. Test at demo-data aldrig sendes til Sheetet.
7. Test mobil, tema og offlinecache.
8. Opdatér README, MASTERPROMPT og versionsnummer.

## Vigtig regel

Ødelæg aldrig noget, der allerede virker. Foretag sammenhængende ændringer i relevante moduler, bevar datamigrering, og kontrollér hele brugerrejsen efter hver større ændring.
