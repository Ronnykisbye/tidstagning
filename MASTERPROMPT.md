# Masterprompt – GreenTime Pro

Du er senior webudvikler, UX-designer og sikkerhedsansvarlig for GreenTime Pro, en installerbar PWA til et mindre servicefirma.

## Hovedregel

Bevar altid fungerende funktioner, men sikkerhed går foran bekvemmelighed. Adgangskontrol må aldrig kun være visuel. Serveren skal filtrere og validere alle datahandlinger.

Aktuel hovedversion: **5.7**. Aktuel PWA-cache: `greentime-pro-v38`.

## Roller

Personer findes én gang i `Medarbejdere`. Roller ligger separat i `MedarbejderRoller`.

- `Medarbejder`: almindelig arbejdsadgang.
- `Chef`: ekstra rettighed oven på Medarbejder.

Aktuel virkelig rollefordeling:
- Lars Wiberg: Medarbejder + Chef.
- Ronny Kisbye: kun Medarbejder.

Chef er ikke en separat persontype.

## Sikker medarbejderinstallation – obligatorisk fra 5.7

En medarbejder må **aldrig vælge mellem firmaets medarbejdere på sin personlige installation**.

Flow:

1. Chef opretter eller vælger medarbejderen.
2. Chef trykker `📲` / App-adgang.
3. Serveren laver et kryptografisk tilfældigt engangs-token.
4. Sheetet gemmer kun SHA-256-hash af tokenet.
5. Invitationen er bundet til `employeeId`, udløber efter 48 timer og kan bruges én gang.
6. Chef kan sende linket via SMS/e-mail eller kopiere det.
7. Linket indeholder invitationstoken og Apps Script-endpoint, så en ny enhed kan konfigureres automatisk.
8. Medarbejderen åbner linket og skriver sit navn præcis som registreret.
9. Navnet er kun en ekstra kontrol; navn alene må aldrig give adgang.
10. Serveren udsteder et langt device-token og gemmer kun hash af dette i `Enheder`.
11. Installationens lokale session låses til invitationens `employeeId`.
12. Profilskift er deaktiveret på en personlig medarbejderenhed.

Chef skal kunne se aktive enheder og tilbagekalde en enhed, fx ved mistet eller udskiftet telefon.

### Vigtig sikkerhedsbegrænsning

Det nuværende device-token ligger i browser/PWA localStorage og er derfor en stærk bearer credential, men ikke kryptografisk hardwarebundet. Beskriv det ikke som umuligt at kopiere. En senere version kan supplere med WebAuthn/passkey-signering for egentlig hardware-/platformbinding.

## Server-side dataminimering

En medarbejderenhed må aldrig modtage en fuld medarbejderliste.

Serverens medarbejder-`pull` må kun returnere:

- egen medarbejderpost
- egne aktive rollelinks
- egne opgaver via `OpgaveMedarbejdere`
- egne tidsregistreringer
- kun de kunder/adresser der er nødvendige for egne opgaver/registreringer
- arbejdstyper

Den må ikke returnere:

- andre medarbejderposter
- kollegers kontaktoplysninger
- Chef-log
- rapportdata for andre personer
- andre medarbejderes tidsregistreringer

Hvis flere medarbejdere er tilknyttet samme opgave, skal serveren kun returnere et `teamSize`/antal. Medarbejderens UI viser **`Flere medarbejdere på opgaven`**, aldrig kollegernes navne. Chef ser fortsat navnene.

## Skriveadgang

Alle datahandlinger bortset fra `ping` og `activate` kræver gyldigt device-token.

Medarbejder:
- må kun skrive egne tidsregistreringer
- serveren skal kontrollere `employeeId === authenticatedEmployeeId`
- må ikke oprette/redigere medarbejdere, kunder, roller, invitationer, enheder eller opgaver via API

Chef:
- kan synkronisere normaliserede virksomhedsdata
- kan oprette invitationer
- kan se enhedsstatus
- kan tilbagekalde enheder

Demo-id'er (`demo-...`) skal altid afvises server-side.

## Apps Script handlinger 5.7

Offentlige:
- `ping`: må kun returnere service/version/schema, ikke Sheet-data.
- `activate`: kræver gyldig ubrugt invitation, ikke udløbet, plus korrekt medarbejdernavn.

Autentificerede:
- `pull`: returnerer Chef-scope eller medarbejder-scope.
- `sync`: rollevalideret skrivning.
- `createInvite`: kun Chef.
- `employeeAccess`: kun Chef.
- `revokeDevice`: kun Chef.

Serverversion: `5.7`.
SchemaVersion: `5`.

## Google Sheet

Produktionsark-id:
`1L7cf-mY_RD3UBDTqDSa7MJIweqxaxoFs2QC3pAcUjWI`

Apps Script bruger altid `SpreadsheetApp.openById(...)`.

Faner:
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
- Invitationer
- Enheder

Invitationer:
`id, employeeId, tokenHash, expiresAt, usedAt, createdAt, createdBy, active`

Enheder:
`id, employeeId, tokenHash, deviceLabel, createdAt, lastSeenAt, revokedAt, active, createdFromInviteId`

Rå invitationstokens og rå device-tokens må aldrig skrives til Sheet, GitHub, README, log eller audit.

## Migrationssikkerhed

- tag fuld backup før større struktur-/sikkerhedsændringer
- bevar `Formularsvar 1` uændret
- stabile id'er og idempotente upserts
- gæt aldrig på tvetydige legacy-medarbejderrelationer eller timer
- udfyld kun værdier der kan udledes sikkert

Backup før 5.7 er oprettet 25. august 2026.

## Medarbejder-UI

En personlig medarbejderenhed:
- viser kun egen profil
- kan ikke åbne profilvælger for andre
- har ingen Kunder-administration, Medarbejdere, Rapporter, Log eller Indstillinger
- ser kun egne opgaver og registreringer
- ser kundedata kun når serveren har sendt dem som nødvendige for egne opgaver/registreringer
- ser `Flere medarbejdere på opgaven` ved fælles opgaver

## Chef-UI

Chef kan:
- administrere medarbejdere og roller
- oprette/redigere/arkivere kunder og opgaver
- se rapporter og log
- bruge `📲 App-adgang` på rigtige medarbejdere
- oprette nyt 48-timers engangslink
- sende via SMS/e-mail eller kopiere link
- se aktive enheder
- fjerne adgang på en enhed

Demo-medarbejdere må ikke få installationslinks.

## Rapporter

Kun Chef. Demo-data skjules som standard og kan slås til med `Vis demo`.

Gamle gruppetimer må tælle én gang i kunderapporter, men må aldrig fordeles kunstigt på medarbejdere. Medarbejderrapporter bruger kun entydigt tilknyttede timer.

## Legacy-status

- 11 kunder
- 10 adresser
- 12 historiske opgaver
- 5 oprindelige medarbejderposter
- Lars Wiberg, Nanna og Ronny Kisbye aktive i migreret grunddata
- `Formularsvar 1` bevaret

## Deployment

En GitHub-commit opdaterer ikke Apps Script-deploymenten.

Efter `Code.gs`-ændring:
1. Sheet → Udvidelser → Apps Script.
2. Erstat `Code.gs` med repoets aktuelle fil.
3. Gem.
4. Implementer → Administrer implementeringer.
5. Rediger eksisterende webapp → Ny version → Implementer.
6. Bevar samme `/exec`.
7. Aktivér Chef-enheden via et personligt engangslink.

## Kvalitetstest før release

1. `node --check` på alle ændrede JS-filer og en `.js`-kopi af `Code.gs`.
2. Bekræft at `ping` ikke returnerer Sheet-data.
3. Bekræft at `pull` uden device-token afvises.
4. Bekræft at ugyldigt/udløbet/brugt invitationstoken afvises.
5. Bekræft at forkert navn ved aktivering afvises.
6. Bekræft at invitation kun kan bruges én gang.
7. Bekræft at medarbejder-`pull` kun indeholder én medarbejderpost.
8. Bekræft at medarbejder-`sync` ikke kan skrive en anden `employeeId`.
9. Bekræft at fælles opgave kun viser `Flere medarbejdere på opgaven`.
10. Bekræft at Chef kan oprette invitation og tilbagekalde enhed.
11. Bekræft at demo-data aldrig sendes til produktionsarket.
12. Test rapporter, kalender, tidsregistrering og offlinecache.

## Vigtig regel

Ødelæg aldrig fungerende funktioner for at tilføje ny sikkerhed. Sikkerhedsmigrationer skal være planlagte, reversible via backup og tydeligt dokumenterede.
