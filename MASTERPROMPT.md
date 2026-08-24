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
- styrer dataforbindelse, eksport, sikkerhedskopi og gendannelse
- kan markere en opgave med en knap, der kun hedder S
- kan aktivere bioadgang på chefens enhed

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

Kunder: id, customerNumber, name, address, phone, email, defaultWorkType, notes, active.

Medarbejdere: id, name, email, phone, role, active.

Arkivér i stedet for fysisk sletning. Historiske registreringer skal bevare deres id-reference.

## Kalender

- chef kan oprette og slette bookinger
- medarbejder ser kun bookinger, hvor eget id findes i employeeIds
- vis antal aftaler på hver kalenderdag
- advar om overlappende bookinger for samme medarbejder

## Google Regneark

Appen fungerer lokalt uden et regneark. Ekstern adgang går gennem en Apps Script-webapp, aldrig direkte gennem regnearkets redigeringslink.

Adapteren skal kunne teste forbindelsen, upserte efter stabilt id, hente kunder/medarbejdere, bevare lokale data ved netværksfejl, vise synkroniseringsstatus og aldrig sende demo-poster.

Regnearket normaliseres i fanerne Kunder, Adresser, Medarbejdere, Roller, MedarbejderRoller, Opgaver, OpgaveMedarbejdere, Tidsregistreringer, Arbejdstyper og Ændringslog. Relationer bruger id-felter. Kolonnen på Opgaver hedder kun S og er et afkrydsningsfelt. Brug aldrig ordene normal eller specialafregning i brugerfladen eller regnearket.

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
