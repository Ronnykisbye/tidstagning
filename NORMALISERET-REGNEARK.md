# Normaliseret Google-regneark

Regnearket fungerer som et relationelt datalager med én post pr. række og stabile id-felter. Navne og adresser bruges ikke som relationer.

## Faner og primærnøgler

| Fane | Primærnøgle | Formål |
|---|---|---|
| Kunder | id | Kundens stamdata |
| Adresser | id | En eller flere adresser pr. kunde |
| Medarbejdere | id | Medarbejderens stamdata |
| Roller | id | Chef og medarbejder |
| MedarbejderRoller | id | Kobling mellem medarbejder og rolle |
| Opgaver | id | Planlagt ordre hos en kunde |
| OpgaveMedarbejdere | id | Kobling mellem opgave og medarbejder |
| Tidsregistreringer | id | Én medarbejders tid på en registrering |
| Arbejdstyper | id | Kontrolleret liste over arbejdstyper |
| Ændringslog | id | Sporbar historik |

## Relationer

- Adresser.customerId peger på Kunder.id.
- MedarbejderRoller.employeeId peger på Medarbejdere.id.
- MedarbejderRoller.roleId peger på Roller.id.
- Opgaver.customerId peger på Kunder.id.
- Opgaver.addressId peger på Adresser.id.
- OpgaveMedarbejdere.orderId peger på Opgaver.id.
- OpgaveMedarbejdere.employeeId peger på Medarbejdere.id.
- Tidsregistreringer.orderId peger på Opgaver.id, når registreringen stammer fra en opgave.
- Tidsregistreringer.customerId og employeeId peger på deres respektive stamtabeller.

## S

Fanerne Kunder og Opgaver har kolonnen S. Apps Script anvender et ægte afkrydsningsfelt:

- markeret felt gemmes som TRUE
- tomt felt gemmes som FALSE
- kun chefudgaven kan ændre værdien
- medarbejderudgaven viser ikke markeringen
- kundens markering er standard for nye opgaver hos kunden
- opgavens værdi gemmes selvstændigt, så historikken ikke ændres, hvis kunden senere ændres

Der må ikke tilføjes forklarende afregningstekst til appen eller regnearket.

## Datasikkerhed

Regnearkets redigeringslink må ikke indbygges i appen. Kommunikation går gennem den publicerede Apps Script-webapp. Ejeren af Google-kontoen bestemmer adgang og publicering.

Bioadgang gemmer ingen fingeraftryk eller ansigtsdata. WebAuthn gemmer kun et credential-id og en offentlig nøgleoplysning lokalt på chefens enhed. En central løsning skal senere verificere signaturen på en server.
