GreenTime Pro – Digital tidsregistreringsplatform

GreenTime Pro er et moderne web-system udviklet til virksomheder, der ønsker at registrere tid hos kunder, planlægge besøg og holde styr på medarbejdernes arbejde.
Appen er designet til både PC og mobil og understøtter flere sprog og både lys og mørk tilstand.

🧩 1. Projektets formål

GreenTime Pro gør det muligt at:

Registrere tid hos hver kunde

Udvælge de medarbejdere der deltager i besøget

Starte og stoppe en timer for kunden

Se både “I dag” og “Samlet tid”

Oprette kunder og medarbejdere

Planlægge besøg via en farvekodet kalender

Se detaljeret tidsforbrug og køre rapporter

Fungere på både mobil og PC

Understøtte flere sprog (DK, EN, DE, LT)

Understøtte lys og mørk tilstand

🏗️ 2. Teknisk struktur

Appen består af tre hovedfiler:

index.html

Indeholder al HTML-strukturen

Alt indhold ligger i tydelige Afsnit 01–08

Hver side (Dashboard, Kunder, Medarbejdere osv.) er en <section>

Kun én side er synlig ad gangen

style.css

Styrer layout, farver og responsiv design

Underopdelt i mange afsnit, så du nemt kan finde ting

Understøtter både light mode og dark mode

Bruges til knapper, chips, dropdowns, timer-display osv.

app.js

Hovedmotoren

Styrer navigation, sider, timer, sprog, tema og data

Organiseret i mange afsnit: Afsnit 01, 02, 03a, 03b, 04… 09

Indeholder funktioner til:

Timer

Kundeliste

Medarbejderliste

Kalender

Sprogskift

Tema

Chips-knapper der bliver grønne/grå

Start/Stop funktion

Data gemt i localStorage

🧱 3. Appens funktioner
Dashboard – Tidsregistrering

Vælg kunde (dropdown)

Vælg medarbejdere (knapper/chips som skifter farve ved valg)

Timer (start/stop)

To tilstande: I dag / Samlet tid

Timeren viser altid korrekt tid

Alle data gemmes automatisk

Kunder

Opret ny kunde

Se kundeliste

Viser navn, telefon, email og adresse

Bruges i alle dropdowns

Medarbejdere

Tilføj medarbejdere

Vises som chips i dashboard

Kan vælges fra/til

Farver skifter automatisk i lys/mørk tilstand

Kalender

Farvekoder:

0 kunder = grå

1–3 kunder = gul

4+ kunder = rød

Man kan bladre frem og tilbage

Viser hurtigt travle dage

Rapporter

Find kunde

Se alt tidsforbrug

Mulighed for nulstilling

Viser samlet timer + antal medarbejdere

🌍 4. Multisprog

Appen bruger data-i18n="" til alle tekster
Sprog gemmes i localStorage og skifter uden reload.
Understøttede sprog:

Dansk (DK)

Engelsk (GB)

Tysk (DE)

Litauisk (LT)

🌗 5. Lys & Mørk mode

Skiftes med sol/måne-knap

Hele appen styres via CSS-variabler

Timer, chips, sidebar, tekst – alt skifter automatisk

Gemmes i localStorage

🔄 6. Datahåndtering

Alle data gemmes i browseren via localStorage, fx:

gtp_customers

gtp_employees

gtp_active_timer

gtp_quick_timer

gtp_theme

gtp_lang

Data går aldrig tabt, selv hvis browseren lukkes.

⚙️ 7. Navigation

Kun én side er synlig ad gangen.
Følgende styrer hele navigationen:

showPage("dashboardPage");


Sidebar-knapper har data-page="".

📱 8. Mobil & PC design
PC

Venstremenu er altid synlig

Content ligger i højre område

Mobil

Burger-menu (side-menu gemt)

Content fylder hele skærmen

Store knapper og touch-optimeret design

🔧 9. Sådan arbejder vi videre (meget vigtigt)

Når vi arbejder i nye sessioner:

Du skriver: “fortsæt”

Jeg fortsætter præcis hvor vi slap

Vi arbejder altid SBS (ét trin ad gangen)

Jeg laver aldrig noget, før du skriver “klar”

Vi ødelægger aldrig funktioner der virker

Du downloader filerne, uploader dem igen i ny session

Jeg arbejder KUN ud fra filerne du uploader

Alt kodes i tydelige afsnit (Afsnit 01, 02, 03a osv.)

⭐ 10. Visionen for GreenTime Pro

Målet er at lave:

Den bedste digitale tidsregistreringsapp

Moderne UI

Hurtig at bruge

Driftssikker

Let at udvide

Utrolig flot i både lys og mørk tilstand

Perfekt til real-life brug hos et firma
