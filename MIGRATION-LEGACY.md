# GreenTime Pro – legacy migration

## Status

Den oprindelige fane `Formularsvar 1` bevares uændret som historisk kilde. Normaliserede data skrives til de nye GreenTime Pro-faner.

## Fastlagt tidsregel

Feltet `Tidsforbrug` i Google Forms-legacydata er decimaltimer.

Eksempler:

- `0,25` = 0,25 time = 15 minutter = 900 sekunder
- `1,5` = 1,5 time = 90 minutter = 5.400 sekunder
- `3` = 3 timer = 10.800 sekunder
- `8` = 8 timer = 28.800 sekunder

Ved migration beregnes `seconds = tidsforbrug * 3600`.

## Roller og rettigheder

`Chef` er en ekstra adgangsrolle og ikke en anden type person. En person kan derfor godt have både `Medarbejder` og `Chef`.

- Lars Wiberg har både rollen `Medarbejder` og rollen `Chef`. Chef-rollen giver de ekstra rettigheder i appen.
- Ronny Kisbye har kun rollen `Medarbejder` og må ikke få adgang til chefsiden via sin egen profil.

Rolleadgang skal afgøres via `MedarbejderRoller` og ikke via ét enkelt tekstfelt på medarbejderen.

## Bekræftede medarbejderinitialer

- `LW` / `lw` = Lars Wiberg. Aktiv medarbejder.
- `Ronny` / `ronny` = Ronny Kisbye. Aktiv medarbejder, kun rollen Medarbejder.
- `Nanna` / `nanna` = Nanna. Aktiv medarbejder.
- `MB` / `mb` = Morten B. er sandsynligt, men ikke endeligt bekræftet. Medarbejderen opbevares derfor som inaktiv, indtil navnet er bekræftet.
- `LL` / `ll` = Lille Lars er sandsynligt, men ikke endeligt bekræftet. Medarbejderen opbevares som inaktiv, indtil navnet er bekræftet.

`mike` / `michael` og `bjarke` er endnu ikke sikkert matchet til fulde medarbejdernavne og må ikke aktiveres automatisk.

## Allerede migrerede tidsregistreringer

Kun rækker med én entydig medarbejder er foreløbig konverteret til `Tidsregistreringer`.

- legacy-form-r7: `lw`, 0,25 time → Lars Wiberg, 900 sekunder.
- legacy-form-r10: `mb`, 3 timer → Morten B. (ikke bekræftet), 10.800 sekunder.

Begge poster bruger `source = google-form-legacy`.

## Poster der bevidst afventer

Følgende typer må ikke fordeles automatisk:

- `Lw mb`
- `lw ll mike nanna`
- `bjarke ronny ll lw michael`
- `alle`

Årsagen er, at legacy-rækken ikke fortæller sikkert, om `Tidsforbrug` gælder pr. medarbejder eller samlet for gruppen. En automatisk opsplitning kan derfor fordoble eller mangedoble de historiske timer.

## Migrationsprincipper

1. Bevar altid `Formularsvar 1` uændret.
2. Brug stabile `legacy-...` id'er, så migrationen er gentagelig uden dubletter.
3. Relationer skal bruge id-felter og ikke fritekst.
4. Usikre medarbejdere oprettes ikke som aktive.
5. Ingen fler-medarbejder-række konverteres, før fordelingsreglen er kendt.
6. Alle migrerede tidsregistreringer mærkes `source = google-form-legacy`.
7. Historiske statusværdier og færdiggørelsesprocenter bevares, hvor de kan aflæses sikkert.
