🌱 GreenTime Pro

GreenTime Pro er en moderne web-applikation udviklet til servicefirmaer som gartnerier, håndværkere, rengøringsfirmaer og alle andre, der har brug for:

kundehåndtering

medarbejderstyring

tidsregistrering

planlægning i kalender

rapporter

mobilvenlig brugerflade

mørk/lys tilstand

Appen er designet til at køre direkte i en webbrowser og kan hostes på fx GitHub Pages eller en almindelig webserver.

🚀 Funktioner
🧭 Navigation

Appen bruger en Single-Page-Application-struktur (SPA).
Når du klikker i menuen, skifter kun indholdet i midten af skærmen.

Menuen indeholder:

Dashboard

Customers

Employees

Time Tracking

Logs

Calendar

Reports

Settings

🎨 Lys / Mørk tilstand

Øverst i højre hjørne findes en tema-knap:

🌙 betyder lys-tilstand kan aktiveres

☀️ betyder mørk-tilstand kan aktiveres

Temaet gemmes i browseren, så brugeren får det samme look næste gang appen åbnes.

👥 Kunder

Under Customers kan man:

oprette nye kunder (navn, telefon, email, adresse)

se kundeliste i tabel

bruge kunderne i timer og planlægning

Kunder gemmes lokalt i browseren.

🧑‍🔧 Medarbejdere

Under Employees kan man:

oprette medarbejdere (navn, email, rolle)

vælge om medarbejderen er employee eller admin

bruge medarbejdere i timer og planlægning

Også gemt lokalt.

⏱ Time Tracking

Under Time Tracking kan du registrere arbejdstid:

vælg kunde

vælg medarbejder eller skriv navn

tryk Start Timer

tryk Stop Timer

systemet beregner automatisk antal minutter

Alle timer bliver gemt og kan ses under Logs eller Reports.

📋 Logs

Under Logs vises tidsregistreringer for i dag:

starttid

sluttid

varighed

kunde

medarbejder

Dashboardet viser også dagens antal registreringer.

📅 Kalender

Kalenderen viser:

hele måneden

mulighed for at skifte måned

klik på en dag → se planlagte opgaver

opgaver bliver vist som liste

Opgaver der kan planlægges:

kunde

medarbejder

starttid

varighed

note

Planlagte opgaver gemmes lokalt i browseren.

📊 Rapporter

Under Reports kan du filtrere tidsregistreringer efter:

dato fra / til

kunde

medarbejder

Systemet viser:

liste over arbejdstider

total antal logs

samlet tidsforbrug i minutter og timer

💾 Dataopbevaring

I denne version (uden server) bliver data gemt i:

localStorage

fungerer uden login

gemmer kundedata, medarbejdere, timer og kalender

virker på samme enhed / browser

deles ikke mellem brugere

I næste version bygges der en rigtig SQL-database, så flere brugere kan dele data.

📁 Filstruktur
/ (roden af projektet)
│
├── index.html       → hovedfilen (layout + sektioner)
├── style.css        → hele designet (mørk/lys tema, layout, grid osv.)
├── app.js           → al logik (navigation, kalender, timer, kunder, rapporter)
└── README.md        → denne fil

🛠 Installation / Hosting
GitHub Pages

Opret et repository

Upload index.html, style.css, app.js

Gå til
Settings → Pages → Deploy from branch

Vælg main og / (root)

Appen ligger nu på:
https://DIT_BRUGERNAVN.github.io/DIT_REPO

Webserver / hotel

Hvis din ven har adgang til en server:

upload filerne via FTP

appen virker med det samme

ingen backend nødvendig endnu

Næste version får SQL-backend.

📱 Mobilvenlig

Appen er fuldt responsiv:

automatisk menu (hamburger på mobil)

sidebar skjules på små skærme

alt layout tilpasser sig mobil

🔮 Fremtidige funktioner

De næste store funktioner bliver:

database på rigtig server (SQL)

brugerlogin (adgang pr. medarbejder)

rolle-styring (admin / medarbejder)

delte data mellem alle brugere

API-forbindelse mellem app og database

synkronisering i realtime

foto-upload pr. kunde

ruteplanlægning / GPS
