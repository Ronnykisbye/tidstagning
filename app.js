/* ======================================================
   AFSNIT 01 – SPROGDATA
====================================================== */

const i18n = {
    da:{
        menu_timer:"Tidsregistrering",
        menu_customers:"Kunder",
        menu_employees:"Medarbejdere",
        menu_logs:"Logs",
        customer:"Kunde",
        employees:"Medarbejder",
        mode:"Mode",
        day:"Dag",
        total:"Total",
        start:"Start",
        stop:"Stop",
        time:"Tid"
    },
    en:{
        menu_timer:"Time Tracking",
        menu_customers:"Customers",
        menu_employees:"Employees",
        menu_logs:"Logs",
        customer:"Customer",
        employees:"Employees",
        mode:"Mode",
        day:"Day",
        total:"Total",
        start:"Start",
        stop:"Stop",
        time:"Time"
    },
    de:{
        menu_timer:"Zeiterfassung",
        menu_customers:"Kunden",
        menu_employees:"Mitarbeiter",
        menu_logs:"Protokolle",
        customer:"Kunde",
        employees:"Mitarbeiter",
        mode:"Modus",
        day:"Tag",
        total:"Gesamt",
        start:"Start",
        stop:"Stop",
        time:"Zeit"
    },
    lt:{
        menu_timer:"Laiko sekimas",
        menu_customers:"Klientai",
        menu_employees:"Darbuotojai",
        menu_logs:"Įrašai",
        customer:"Klientas",
        employees:"Darbuotojai",
        mode:"Režimas",
        day:"Diena",
        total:"Viso",
        start:"Pradėti",
        stop:"Stabdyti",
        time:"Laikas"
    }
};

let lang="da";

/* ======================================================
   AFSNIT 02 – NAVIGATION
====================================================== */

const main=document.getElementById("mainContent");
const pageTitle=document.getElementById("pageTitle");

function render(page){
    document.querySelectorAll(".menu-item")
        .forEach(btn=>btn.classList.remove("active"));

    document.querySelector(`.menu-item[data-page='${page}']`)
        .classList.add("active");

    if(page==="timer") renderTimer();
    if(page==="customers") renderCustomers();
    if(page==="employees") renderEmployees();
    if(page==="logs") renderLogs();
}

/* TIMER PAGE */
function renderTimer(){
    pageTitle.textContent=i18n[lang].menu_timer;

    main.innerHTML=`
        <div class="label">${i18n[lang].customer}</div>
        <select><option>–</option></select>

        <div class="label">${i18n[lang].employees}</div>
        <div class="chip">Ronny</div>
        <div class="chip">Emma</div>

        <div class="label">${i18n[lang].mode}</div>
        <label><input type="radio" name="m" checked> ${i18n[lang].day}</label>
        <label><input type="radio" name="m"> ${i18n[lang].total}</label>

        <div class="label">${i18n[lang].time}</div>
        <div id="timerDisplay">00:00:00</div>

        <button class="btn btn-start">${i18n[lang].start}</button>
        <button class="btn btn-stop">${i18n[lang].stop}</button>
    `;
}

function renderCustomers(){
    pageTitle.textContent=i18n[lang].menu_customers;
    main.innerHTML="<h2>Kunder kommer her</h2>";
}

function renderEmployees(){
    pageTitle.textContent=i18n[lang].menu_employees;
    main.innerHTML="<h2>Medarbejdere kommer her</h2>";
}

function renderLogs(){
    pageTitle.textContent=i18n[lang].menu_logs;
    main.innerHTML="<h2>Logs kommer her</h2>";
}

/* ======================================================
   AFSNIT 03 – SPROGSKIFTER
====================================================== */

document.querySelectorAll(".lang-btn").forEach(btn=>{
    btn.onclick=()=>{
        lang = btn.dataset.lang;
        document.querySelectorAll(".lang-btn").forEach(b=>b.classList.remove("active"));
        btn.classList.add("active");
        render("timer");
    };
});

/* ======================================================
   AFSNIT 04 – TEMA
====================================================== */

document.getElementById("themeToggle").onclick=()=>{
    const h=document.documentElement;
    const next=h.getAttribute("data-theme")==="dark"?"light":"dark";
    h.setAttribute("data-theme",next);
};

/* ======================================================
   AFSNIT 05 – MOBIL SIDEBAR
====================================================== */

document.getElementById("sidebarToggle").onclick=()=>{
    document.getElementById("sidebar").classList.toggle("open");
};

/* ======================================================
   AFSNIT 06 – INIT
====================================================== */
render("timer");
