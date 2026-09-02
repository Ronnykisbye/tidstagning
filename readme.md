# GreenTime Pro 5.8

GreenTime Pro er en mobilvenlig PWA til tidsregistrering, kunder, medarbejdere, planlægning og rapporter.

Live app: https://ronnykisbye.github.io/tidstagning/

## Roller

Rettigheder ligger i `MedarbejderRoller`.

- `Medarbejder`: egne opgaver og egne tidsregistreringer.
- `Chef`: ekstra adgang til administration, alle opgaver, medarbejdere, rapporter, log og indstillinger.
- Lars Wiberg: Medarbejder + Chef.
- Ronny Kisbye: kun Medarbejder.

## Sikker medarbejderinstallation – 5.7

En medarbejder vælger ikke længere mellem firmaets medarbejdere på sin egen installation.

Chefen bruger knappen `📲` på Medarbejdere-siden til at:

1. oprette et personligt engangslink
2. sende linket via SMS eller e-mail eller kopiere det
3. se aktive enheder for medarbejderen
4. tilbagekalde en enhed, fx ved mistet eller udskiftet telefon

Invitationen:

- er knyttet til én bestemt medarbejder
- udløber efter 48 timer
- kan kun bruges én gang
- gemmes kun som SHA-256-hash i Sheetet; rå invitationstoken gemmes aldrig

Ved første åbning skriver medarbejderen sit navn. Navnet er kun en ekstra kontrol; selve adgangen kommer fra det personlige invitationstoken. Serveren opretter derefter et langt device-token, gemmer kun tokenets hash i Sheetet og låser installationens session til medarbejderens id.

### Dataminimering

Sikkerheden ligger på serveren, ikke kun i brugerfladen.

En medarbejderenhed får kun sendt:

- medarbejderens egen profil
- medarbejderens egne opgaver
- medarbejderens egne tidsregistreringer
- kunder og adresser, som er nødvendige for de egne opgaver/registreringer
- relevante arbejdstyper

Serveren sender **ingen liste over andre medarbejdere** til en medarbejderenhed. Profilskift er deaktiveret på en personlig medarbejderenhed.

Hvis flere medarbejdere er på samme opgave, modtager medarbejderen ikke kollegernes navne. Appen viser kun `Flere medarbejdere på opgaven`. Chefen kan fortsat se navnene.

En medarbejder må via `sync` kun skrive tidsregistreringer, hvor `employeeId` er medarbejderens eget id. Serveren afviser forsøg på at skrive andres data.

## Google Sheet

Produktionsark:
`1L7cf-mY_RD3UBDTqDSa7MJIweqxaxoFs2QC3pAcUjWI`

Normaliserede faner:

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

`Invitationer` indeholder: `id, employeeId, tokenHash, expiresAt, usedAt, createdAt, createdBy, active`.

`Enheder` indeholder: `id, employeeId, tokenHash, deviceLabel, createdAt, lastSeenAt, revokedAt, active, createdFromInviteId`.

Rå invitationstokens og rå device-tokens må aldrig skrives til Sheetet, GitHub eller loggen.

## Apps Script 5.7

`google-apps-script/Code.gs` er serverkilden.

Offentlige handlinger er begrænset til:

- `ping` – kun versionsstatus
- `activate` – kræver gyldigt, ubrugt og ikke-udløbet invitationstoken samt korrekt medarbejdernavn

Alle datahandlinger kræver herefter et gyldigt device-token.

- `pull`: serverfiltreret efter Chef/Medarbejder
- `sync`: Chef kan synkronisere normaliserede data; Medarbejder kan kun skrive egne tidsregistreringer
- `createInvite`: kun Chef
- `employeeAccess`: kun Chef
- `revokeDevice`: kun Chef

Apps Script er version `5.7`, `schemaVersion 5`.

## Rapporter

Rapporter er Chef-only. Demo-data er skjult som standard og kan vises med knappen `Vis demo`.

Gamle gruppetimer må aldrig fordeles kunstigt på medarbejdere. De kan tælle én gang i kundetotaler, mens medarbejderrapporter kun bruger entydigt tilknyttede timer.

## Legacy-data

`Formularsvar 1` bevares uændret. Migreret status omfatter 11 kunder, 10 adresser, 12 historiske opgaver og 5 medarbejderposter. Lars Wiberg, Nanna og Ronny Kisbye er aktive i de oprindelige migrerede data.

## Deployment

Efter ændring af `Code.gs`:

1. Google Sheet → Udvidelser → Apps Script.
2. Erstat `Code.gs` med repoets aktuelle fil.
3. Gem.
4. Implementer → Administrer implementeringer.
5. Rediger eksisterende webapp og vælg Ny version.
6. Bevar samme `/exec`-adresse.
7. Aktivér Chef-enheden via et personligt Chef-invitationslink.

En GitHub-commit opdaterer ikke Apps Script-deploymenten automatisk.

## PWA

Aktuel cache: `greentime-pro-v38`.

## Vigtige sikkerhedsregler

- demo-id'er må aldrig sendes til produktionsarket
- en medarbejderenhed må aldrig modtage andre medarbejderposter
- adgang må aldrig baseres på navn alene
- invitationer er engangslinks med udløb
- kun token-hashes gemmes server-side
- en mistet enhed skal kunne tilbagekaldes af Chef
- `Formularsvar 1` må ikke ændres af sikkerhedsmigrationen
- tag backup før større sikkerheds- eller strukturændringer

Backup før 5.7 blev oprettet 25. august 2026.

## Versionshistorik

- 5.8: Det almindelige applink er låst for ikke-aktiverede enheder. Adgang kræver et personligt installationslink, og profilknappen er fastlåst på sikre enheder, så en medarbejder ikke kan åbne eller se en liste med andre medarbejdere.
- 5.7: Personlige engangsinvitationer, device-token, server-side rollefiltrering, ingen kollegaliste på medarbejderenheder, `Flere medarbejdere på opgaven`, SMS/e-mail/kopiér installationslink og enhedstilbagekaldelse. Nye Sheet-faner `Invitationer` og `Enheder`. Cache v38.
- 5.6: Read-only `pull`, separat `sync`, fast produktions-Sheet-ID og forbedret diagnostik.
- 5.5: Apps Script låst til det konkrete produktions-Sheet-ID.
- 5.4: Flerrollemodel, rapportgenerator og historiske Sheet-data.
