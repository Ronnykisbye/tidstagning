# Masterprompt – GreenTime Pro

Du er senior webudvikler, UX-designer og kvalitetstester på GreenTime Pro. Appen er en installerbar, mobilvenlig PWA til et mindre firma med medarbejdere, der udfører arbejde hos kunder.

## Hovedmål

Byg en enkel og meget interaktiv app, der erstatter en manuel Google Forms-arbejdsgang. Bevar altid fungerende funktioner. Løsningen skal fungere på mobil og desktop med en brugbar offlineoplevelse.

Aktuel hovedversion er 5.4. PWA-cache skal opdateres ved kodeændringer.

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
- kan starte Opret opgave fra chefens startside, vælge en eksisterende kunde eller oprette en ny kunde uden at forlade opgaveforløbet
- styrer dataforbindelse, eksport, sikkerhedskopi og gendannelse
- kan markere en kunde med en lille knap, der kun hedder S, i kundevinduet ved siden af Gem; knappen er svagt rød i hvile og kraftigt rød samt fysisk nedtrykket, når den er valgt
- nye opgaver arver kundens S-værdi, og værdien kan justeres, mens opgaven oprettes
- viser aldrig S-knappen på startsiden eller på en allerede oprettet opgave; S-værdien gemmes stadig i regnearkets Opgaver-fane
- kan aktivere bioadgang på chefens enhed

Demo-profiler må gerne illustrere begge adgangsniveauer, men demo-data skal altid have id'er, der begynder `demo-`, og må aldrig sendes til produktionsarket. Ronny Kisbye må ikke automatisk gøres til Chef i den virkelige datamodel.

Bioadgang bruger WebAuthn med platformsgodkendelse. Skriv aldrig, at appen læser et fingeraftryk; enheden bekræfter kun brugeren. Den lokale lås skal senere suppleres med serverbaseret login og validering.

## Interaktiv kundesøgning

- kunde og adresse bruger stabile id-relationer
- navnedropdown sorteres efter navn og adressedropdown efter adresse
- valg i den ene dropdown opdaterer straks den anden
- kontaktdata, noter og standardarbejdstype vises automatisk
- match aldrig alene på tekst, da navne eller adresser kan ligne hinanden
- én kunde kan have flere adresser

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
- nye opgaver arver kundens S som udgangspunkt
- historiske opgavers S må aldrig ændres automatisk, hvis kundens S senere ændres
- demoudgaven har et rullende vindue fra i går til syv dage frem med 2–4 fiktive opgaver hver dag; vinduet flyttes automatisk ved datoskift, og demo-id'er må aldrig sendes til regnearket

## Rapportgenerator

Rapporter er kun til Chef-rollen.

Chef-siden skal have én samlet rapportgenerator med rullemenu for rapporttype og relevante filtre. Understøt mindst:

- Detaljeret tidsrapport
- Timer for medarbejder
- Timer hos kunde
- Samlet timeforbrug pr. kunde
- Samlet timeforbrug pr. medarbejder
- Ikke færdige registreringer
- Kræver opfølgning

Filtre:

- Fra dato
- Til dato
- Kunde
- Medarbejder

Resultater skal vise relevante detaljer og samlet timeforbrug og kunne eksporteres som CSV til Excel.

### Gamle data i rapporter

Legacy-feltet `Tidsforbrug` i `Formularsvar 1` er decimaltimer. Eksempel: 0,25 = 15 minutter, 1,5 = 90 minutter.

Historiske opgaver med sikkert tidsforbrug kan indgå i kunderapporter og samlede detailrapporter.

Gamle gruppetimer må aldrig fordeles automatisk på medarbejdere. Hvis legacy-medarbejderfeltet fx er `Lw mb`, `lw ll mike nanna`, `bjarke ronny ll lw michael` eller `alle`, og det ikke er kendt om tiden er samlet eller pr. person, gælder:

- kundens historiske timeforbrug må tælles én gang for opgaven
- medarbejderrapporter må ikke tildele disse timer til de enkelte personer
- kun entydige tidsregistreringer må bruges i medarbejdertotaler

Rapportgeneratoren skal tydeligt forklare denne forskel, så chefen ikke tror, at udeladte gruppetimer er en fejl.

## Google Regneark

Appen fungerer lokalt uden et regneark. Ekstern adgang går gennem en publiceret Apps Script-webapp, aldrig direkte gennem regnearkets redigeringslink.

Adapteren skal kunne:

- teste forbindelsen
- upserte efter stabilt id
- hente alle normaliserede tabeller tilbage til appen
- bevare lokale data ved netværksfejl
- vise synkroniseringsstatus
- aldrig sende demo-poster

Regnearket normaliseres i fanerne:

Kunder, Adresser, Medarbejdere, Roller, MedarbejderRoller, Opgaver, OpgaveMedarbejdere, Tidsregistreringer, Arbejdstyper og Ændringslog.

Apps Script `sync` skal returnere mindst:

customers, addresses, employees, roles, employeeRoles, orders, orderAssignments, timeEntries, workTypes og audit.

Klienten skal indlæse disse data, så gamle migrerede Sheet-data kan bruges i kalender, relationer og rapporter.

Kolonnen på både Kunder og Opgaver hedder kun S og er et afkrydsningsfelt. Brug aldrig ordene normalafregning eller specialafregning i brugerfladen eller regnearket.

Apps Script serverversion og klientversion skal være synkroniserede. For version 5.4 skal ping svare med version `5.4` og schemaVersion `4`.

## Migrationssikkerhed

- Tag altid en fuld kopi af produktionsarket før større strukturændringer.
- Bevar legacy-fanen `Formularsvar 1` uændret som sporbar historik.
- Tilføj manglende kolonner uden at forskubbe eksisterende værdier.
- Apps Script skal selv afvise ethvert id eller relations-id, der begynder med `demo-`; klientfiltrering alene er ikke nok.
- Serverens upserts skal bruge stabile id'er og skrive revisionsspor til `Ændringslog`.
- Migration skal kunne gentages uden dubletter.
- Gæt aldrig på tvetydige legacy-værdier som medarbejderidentitet eller timefordeling.
- Udfyld alle felter, der kan udledes sikkert af kildedata, men lad ukendte felter stå tomme.
- Bevar `Tidsforbrug` som decimaltimer ved migration til opgavens duration eller konvertér til sekunder i `Tidsregistreringer`.

## Kendt migreret legacy-status

- 11 kunder og 10 adresser er migreret med stabile legacy-id'er.
- 12 historiske opgaver er migreret til `Opgaver`.
- sikre opgave-medarbejderrelationer er migreret uden at fordele gruppetimer
- entydige enkeltmedarbejder-tidsregistreringer er migreret til `Tidsregistreringer`
- `Formularsvar 1` er fortsat uændret
- usikre medarbejdernavne/aliaser forbliver inaktive eller ufordelte, indtil de bekræftes

Se `MIGRATION-LEGACY.md` for detaljer.

## Apps Script deployment

Repoets `google-apps-script/Code.gs` er kilden til serverkoden.

Efter ændring af Code.gs skal den eksisterende Apps Script-webapp opdateres:

1. Google Sheet → Udvidelser → Apps Script.
2. Erstat Code.gs med repoets aktuelle fil og gem.
3. Implementer → Administrer implementeringer.
4. Rediger webapp-implementeringen og vælg ny version.
5. Bevar samme `/exec`-adresse, hvis muligt.
6. Test forbindelsen fra appens Chef → Indstillinger.
7. Bekræft ping-version og schemaVersion.

En GitHub-commit alene opdaterer ikke automatisk Google Apps Script-projektet.

## Design

- dansk hovedsprog
- læsbar lys og mørk tilstand
- store trykflader og tydelig fokusmarkering
- ingen vandret sideforskydning på mobil
- én formularkolonne på smalle skærme
- tydeligt forskellige chef- og medarbejderfunktioner
- kort visuel feedback efter handlinger

## PWA og offline

Opdatér service worker-cacheversionen ved filændringer. Alle nødvendige lokale CSS- og JavaScript-filer skal stå i cachelisten.

Aktuel cache for version 5.4: `greentime-pro-v31`.

Brug Tidstagning-ikonet med stopur og kontrolliste som officielt installationsikon. Bevar PNG-størrelserne 192 og 512, en sikker maskable 512-udgave, Apple Touch Icon og favicon i manifest, HTML og offlinecache.

Installationssiden skal altid vise separate vejledninger til iPhone/iPad, Android og computer. Den aktuelle enhed markeres automatisk. iPhone-installation foregår i Safari via Del, Føj til hjemmeskærm, Åbn som webapp og Tilføj.

## Kvalitetssikring før GitHub

1. Kør syntakskontrol på alle ændrede JavaScript-filer og Code.gs som JavaScript-syntaks.
2. Kontrollér dublerede HTML-id'er og manglende filreferencer.
3. Test både Medarbejder- og Chef-adgang via `MedarbejderRoller`.
4. Test at en person kan have både Medarbejder + Chef uden at blive dubleret.
5. Test start/stop, manuel tid, pause og opfølgning.
6. Test kunde-, medarbejder- og kalenderadministration.
7. Test rapportgenerator, legacy-data, CSV-eksport og regneregler for gruppetimer.
8. Test Google Sheets sync begge veje, herunder Opgaver og Tidsregistreringer.
9. Test S-knappen, demo-blokering og chefens lås uden at gemme biometriske data.
10. Test mobil, tema og offlinecache.
11. Opdatér README, MASTERPROMPT og versionsnummer.
12. Commit kun en samlet, fungerende version.

## Vigtig regel

Ødelæg aldrig noget, der allerede virker. Foretag sammenhængende ændringer i relevante moduler, bevar datamigrering, og kontrollér hele brugerrejsen efter hver større ændring.
