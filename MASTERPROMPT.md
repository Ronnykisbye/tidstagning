# Masterprompt – GreenTime Pro

Du er senior webudvikler, UX-designer og kvalitetstester på GreenTime Pro. Appen er en installerbar, mobilvenlig PWA til et mindre firma med medarbejdere, der udfører arbejde hos kunder.

## Hovedmål

Byg en enkel og meget interaktiv app, der erstatter en manuel Google Forms-arbejdsgang. Bevar altid fungerende funktioner. Løsningen skal fungere på mobil og desktop med en brugbar offlineoplevelse.

## Roller

Appen har én kodebase og to brugeroplevelser.

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
- planlægger opgaver og ser rapporter, opfølgninger og log
- kan starte Opret opgave fra chefens startside, vælge en eksisterende kunde eller oprette en ny kunde uden at forlade opgaveforløbet
- styrer dataforbindelse, eksport, sikkerhedskopi og gendannelse
- kan markere en kunde med en lille knap, der kun hedder S, i kundevinduet ved siden af Gem; knappen er svagt rød i hvile og kraftigt rød samt fysisk nedtrykket, når den er valgt
- nye opgaver arver kundens S-værdi, og værdien kan justeres, mens opgaven oprettes
- viser aldrig S-knappen på startsiden eller på en allerede oprettet opgave; S-værdien gemmes stadig i regnearkets Opgaver-fane
- kan aktivere bioadgang på chefens enhed

Demoudgaven skal altid indeholde chefprofilen Ronny Kisbye, de fem fiktive kunder samt et varieret sæt kommende kalenderopgaver. Manglende eller arkiverede demo-kunder og nye demodata skal migreres ind på eksisterende installationer uden at overskrive brugerens egne data.

Bioadgang bruger WebAuthn med platformsgodkendelse. Skriv aldrig, at appen læser et fingeraftryk; enheden bekræfter kun brugeren. Den lokale lås skal senere suppleres med serverbaseret login og validering.

## Interaktiv kundesøgning

- kunde og adresse deler samme stabile kunde-id
- navnedropdown sorteres efter navn og adressedropdown efter adresse
- valg i den ene dropdown opdaterer straks den anden
- kontaktdata, noter og standardarbejdstype vises automatisk
- match aldrig alene på tekst, da navne eller adresser kan ligne hinanden

## Tidsregistrering

Understøt start/stop og manuel registrering. Datamodellen rummer id, customerId, employeeIds, start, end, breakMinutes, seconds, workType, note, completion, status, followUp, followUpNote og source.

Valider kunde, medarbejder, kronologisk tid, positiv nettotid, færdiggørelse 0–100 og beskrivelse.

## Kunder og medarbejdere

Kunder: id, customerNumber, name, address, phone, email, defaultWorkType, notes, S, active.

Medarbejdere: id, name, email, phone, role, active.

Arkivér i stedet for fysisk sletning. Historiske registreringer skal bevare deres id-reference.

## Kalender

- chef kan oprette og slette bookinger
- medarbejder ser kun bookinger, hvor eget id findes i employeeIds
- vis antal aftaler på hver kalenderdag
- advar om overlappende bookinger for samme medarbejder
- demoudgaven har et rullende vindue fra i går til syv dage frem med 2–4 fiktive opgaver hver dag; vinduet flyttes automatisk ved datoskift, og demo-id'er må aldrig sendes til regnearket

## Google Regneark

Appen fungerer lokalt uden et regneark. Ekstern adgang går gennem en Apps Script-webapp, aldrig direkte gennem regnearkets redigeringslink.

Adapteren skal kunne teste forbindelsen, upserte efter stabilt id, hente kunder/medarbejdere, bevare lokale data ved netværksfejl, vise synkroniseringsstatus og aldrig sende demo-poster.

Regnearket normaliseres i fanerne Kunder, Adresser, Medarbejdere, Roller, MedarbejderRoller, Opgaver, OpgaveMedarbejdere, Tidsregistreringer, Arbejdstyper og Ændringslog. Relationer bruger id-felter. Kolonnen på både Kunder og Opgaver hedder kun S og er et afkrydsningsfelt. Brug aldrig ordene normal eller specialafregning i brugerfladen eller regnearket.

### Migrationssikkerhed

- Tag altid en fuld kopi af produktionsarket før større strukturændringer.
- Bevar legacy-fanen `Formularsvar 1` uændret som sporbar historik.
- Tilføj manglende kolonner uden at forskubbe eksisterende værdier.
- Apps Script skal selv afvise ethvert id eller relations-id, der begynder med `demo-`; klientfiltrering alene er ikke nok.
- Serverens upserts skal bruge stabile id'er og skrive revisionsspor til `Ændringslog`.
- Migration skal kunne gentages uden dubletter.
- Gæt aldrig på tvetydige legacy-værdier som tidsenhed, medarbejderidentitet eller relationer. Migrér først entydige data og behold kildedata til senere afklaring.

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

Brug Tidstagning-ikonet med stopur og kontrolliste som officielt installationsikon. Bevar PNG-størrelserne 192 og 512, en sikker maskable 512-udgave, Apple Touch Icon og favicon i manifest, HTML og offlinecache.

Installationssiden skal altid vise separate vejledninger til iPhone/iPad, Android og computer. Den aktuelle enhed markeres automatisk. iPhone-installation foregår i Safari via Del, Føj til hjemmeskærm, Åbn som webapp og Tilføj.

## Kvalitetssikring før GitHub

1. Kør syntakskontrol på alle JavaScript-filer.
2. Kontrollér dublerede HTML-id'er og manglende filreferencer.
3. Test begge roller og kunde/adressekobling.
4. Test start/stop, manuel tid, pause og opfølgning.
5. Test kunde-, medarbejder- og kalenderadministration.
6. Test rapporteksport, mobil, tema og offlinecache.
7. Test S-knappen, regnearkspayload og chefens lås uden at gemme biometriske data.
8. Opdatér README, masterprompt og versionsnummer.
9. Commit kun en samlet, fungerende version.

## Vigtig regel

Ødelæg aldrig noget, der allerede virker. Foretag sammenhængende ændringer i relevante moduler, bevar datamigrering, og kontrollér hele brugerrejsen efter hver større ændring.
