console.log("GreenTime Pro – ny UI-version kører");

/* ======================================================
   AFSNIT 01 – GLOBAL STATE
   ====================================================== */

let customers = [];
let employees = [];
let logs = [];

let timerInterval = null;
let timerStart = null;

/* Aktuel side + sprog */
let currentPageId = "dashboardPage";
let currentLang = "da";

/* ======================================================
   AFSNIT 02 – INIT
   ====================================================== */

document.addEventListener("DOMContentLoaded", () => {
    initSidebarNavigation();
    initLanguage();
    initLanguageButtons();
    initThemeToggle();
    initTimer();

    /* Pre-install demo data */
    installDefaultCustomers();
    installDefaultEmployees();

    /* Init forms AFTER demo data is loaded */
    initCustomerForm();
    initEmployeeForm();

    /* Render tables immediately */
    renderCustomers();
    renderEmployees();
});


/* ======================================================
   AFSNIT 03 – SPROG
   ====================================================== */

const translations = {
    da: {
        app_title: "GreenTime Pro",

        menu_dashboard: "Tidsregistrering",
        menu_customers: "Kunder",
        menu_employees: "Medarbejdere",
        menu_logs: "Logs",
        menu_reports: "Rapporter",
        menu_settings: "Indstillinger",

        page_dashboard_title: "Tidsregistrering",
        page_dashboard_sub: "Start og stop tid for opgaver – hurtigt overblik.",

        page_customers_title: "Kunder",
        page_customers_sub: "Opret og vedligehold din kundeliste.",

        page_employees_title: "Medarbejdere",
        page_employees_sub: "Hold styr på medarbejdere og roller.",

        page_logs_title: "Logs",
        page_logs_sub: "Historik over registreret arbejdstid.",

        page_reports_title: "Rapporter",
        page_reports_sub: "Fremtidig placering til grafer og rapporter.",

        page_settings_title: "Indstillinger",
        page_settings_sub: "Konfiguration af appen.",

        customers_form_title: "Ny kunde",
        customers_list_title: "Oversigt over kunder",

        employees_form_title: "Ny medarbejder",
        employees_list_title: "Liste over medarbejdere",

        reports_placeholder: "Her kan du senere tilføje dashboards, grafer og eksport.",
        settings_placeholder: "Her kan du senere justere avancerede indstillinger.",

        label_name: "Navn",
        label_phone: "Telefon",
        label_email: "Email",
        label_address: "Adresse",
        label_role: "Rolle",

        role_employee: "Medarbejder",
        role_admin: "Admin",

        col_name: "Navn",
        col_phone: "Telefon",
        col_email: "Email",
        col_address: "Adresse",
        col_role: "Rolle",
        col_log_time: "Tidspunkt",
        col_log_duration: "Varighed",

        btn_save_customer: "Gem kunde",
        btn_save_employee: "Gem medarbejder",
        btn_start: "Start",
        btn_stop: "Stop"
    },

    en: {
        app_title: "GreenTime Pro",

        menu_dashboard: "Time tracking",
        menu_customers: "Customers",
        menu_employees: "Employees",
        menu_logs: "Logs",
        menu_reports: "Reports",
        menu_settings: "Settings",

        page_dashboard_title: "Time tracking",
        page_dashboard_sub: "Start and stop work quickly.",

        page_customers_title: "Customers",
        page_customers_sub: "Create and maintain your customer list.",

        page_employees_title: "Employees",
        page_employees_sub: "Keep track of employees and roles.",

        page_logs_title: "Logs",
        page_logs_sub: "History of recorded time.",

        page_reports_title: "Reports",
        page_reports_sub: "Space for future dashboards and reports.",

        page_settings_title: "Settings",
        page_settings_sub: "Configure the app.",

        customers_form_title: "New customer",
        customers_list_title: "Customer overview",

        employees_form_title: "New employee",
        employees_list_title: "Employee list",

        reports_placeholder: "Add dashboards, graphs and exports here later.",
        settings_placeholder: "Adjust advanced settings here later.",

        label_name: "Name",
        label_phone: "Phone",
        label_email: "Email",
        label_address: "Address",
        label_role: "Role",

        role_employee: "Employee",
        role_admin: "Admin",

        col_name: "Name",
        col_phone: "Phone",
        col_email: "Email",
        col_address: "Address",
        col_role: "Role",
        col_log_time: "Time",
        col_log_duration: "Duration",

        btn_save_customer: "Save customer",
        btn_save_employee: "Save employee",
        btn_start: "Start",
        btn_stop: "Stop"
    },

    de: {
        app_title: "GreenTime Pro",

        menu_dashboard: "Zeiterfassung",
        menu_customers: "Kunden",
        menu_employees: "Mitarbeiter",
        menu_logs: "Protokolle",
        menu_reports: "Berichte",
        menu_settings: "Einstellungen",

        page_dashboard_title: "Zeiterfassung",
        page_dashboard_sub: "Zeit für Aufgaben starten und stoppen.",

        page_customers_title: "Kunden",
        page_customers_sub: "Verwalte deine Kundenliste.",

        page_employees_title: "Mitarbeiter",
        page_employees_sub: "Behalte Mitarbeiter und Rollen im Blick.",

        page_logs_title: "Protokolle",
        page_logs_sub: "Historie der erfassten Zeiten.",

        page_reports_title: "Berichte",
        page_reports_sub: "Platz für zukünftige Dashboards.",

        page_settings_title: "Einstellungen",
        page_settings_sub: "Konfiguration der App.",

        customers_form_title: "Neuer Kunde",
        customers_list_title: "Kundenübersicht",

        employees_form_title: "Neuer Mitarbeiter",
        employees_list_title: "Mitarbeiterliste",

        reports_placeholder: "Hier kannst du später Dashboards hinzufügen.",
        settings_placeholder: "Hier kannst du später Einstellungen anpassen.",

        label_name: "Name",
        label_phone: "Telefon",
        label_email: "E-Mail",
        label_address: "Adresse",
        label_role: "Rolle",

        role_employee: "Mitarbeiter",
        role_admin: "Admin",

        col_name: "Name",
        col_phone: "Telefon",
        col_email: "E-Mail",
        col_address: "Adresse",
        col_role: "Rolle",
        col_log_time: "Zeitpunkt",
        col_log_duration: "Dauer",

        btn_save_customer: "Kunden speichern",
        btn_save_employee: "Mitarbeiter speichern",
        btn_start: "Start",
        btn_stop: "Stopp"
    },

    lt: {
        app_title: "GreenTime Pro",

        menu_dashboard: "Laiko registravimas",
        menu_customers: "Klientai",
        menu_employees: "Darbuotojai",
        menu_logs: "Žurnalai",
        menu_reports: "Ataskaitos",
        menu_settings: "Nustatymai",

        page_dashboard_title: "Laiko registravimas",
        page_dashboard_sub: "Greitai pradėk ir sustabdyk darbą.",

        page_customers_title: "Klientai",
        page_customers_sub: "Tvarkyk klientų sąrašą.",

        page_employees_title: "Darbuotojai",
        page_employees_sub: "Stebėk darbuotojus ir jų roles.",

        page_logs_title: "Žurnalai",
        page_logs_sub: "Užregistruoto laiko istorija.",

        page_reports_title: "Ataskaitos",
        page_reports_sub: "Vieta būsimoms ataskaitoms.",

        page_settings_title: "Nustatymai",
        page_settings_sub: "Programos konfigūracija.",

        customers_form_title: "Naujas klientas",
        customers_list_title: "Klientų sąrašas",

        employees_form_title: "Naujas darbuotojas",
        employees_list_title: "Darbuotojų sąrašas",

        reports_placeholder: "Čia vėliau galėsite pridėti grafikus ir ataskaitas.",
        settings_placeholder: "Čia galėsite koreguoti nustatymus.",

        label_name: "Vardas",
        label_phone: "Telefonas",
        label_email: "El. paštas",
        label_address: "Adresas",
        label_role: "Rolė",

        role_employee: "Darbuotojas",
        role_admin: "Administratorius",

        col_name: "Vardas",
        col_phone: "Telefonas",
        col_email: "El. paštas",
        col_address: "Adresas",
        col_role: "Rolė",
        col_log_time: "Laikas",
        col_log_duration: "Trukmė",

        btn_save_customer: "Išsaugoti klientą",
        btn_save_employee: "Išsaugoti darbuotoją",
        btn_start: "Startas",
        btn_stop: "Stop"
    }
};

function initLanguage() {
    const stored = localStorage.getItem("gtp_lang");
    if (stored && translations[stored]) {
        currentLang = stored;
    } else {
        currentLang = "da";
    }
    applyTranslations();
    updateLangButtonActiveState();
}

function t(key) {
    const pack = translations[currentLang] || translations["da"];
    return pack[key] || translations["da"][key] || "";
}

function applyTranslations() {
    document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.dataset.i18n;
        if (!key) return;
        const text = t(key);
        if (text) {
            el.textContent = text;
        }
    });
}

function initLanguageButtons() {
    document.querySelectorAll(".lang-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const lang = btn.dataset.lang;
            if (!translations[lang]) return;
            currentLang = lang;
            localStorage.setItem("gtp_lang", lang);
            applyTranslations();
            updateLangButtonActiveState();
            updatePageTitleFromActiveMenu();
        });
    });
}

function updateLangButtonActiveState() {
    document.querySelectorAll(".lang-btn").forEach(btn => {
        btn.classList.toggle("active", btn.dataset.lang === currentLang);
    });
}

/* ======================================================
   AFSNIT 04 – TEMA
   ====================================================== */

function initThemeToggle() {
    const btn = document.getElementById("themeToggle");
    if (!btn) return;

    updateThemeButtonIcon();

    btn.addEventListener("click", () => {
        const current = document.documentElement.getAttribute("data-theme") || "dark";
        const next = current === "light" ? "dark" : "light";
        document.documentElement.setAttribute("data-theme", next);
        localStorage.setItem("gtp_theme", JSON.stringify(next));
        updateThemeButtonIcon();
    });
}

function updateThemeButtonIcon() {
    const btn = document.getElementById("themeToggle");
    if (!btn) return;
    const current = document.documentElement.getAttribute("data-theme") || "dark";
    btn.textContent = current === "light" ? "🌙" : "🌞";
}



/* ======================================================
   AFSNIT 05 – NAVIGATION & SIDEBAR (RETTET VERSION)
   Denne version sikrer:
   - Menu-knapper skifter side korrekt
   - Aktiv menu får korrekt .active
   - pageTitle skifter efter sprog
   - Sidebar virker på mobil (open/close)
   - Ingen fejl der stopper sprogsystemet
====================================================== */

function initSidebarNavigation() {
    const menuButtons = document.querySelectorAll(".menu-item");
    const sidebar = document.getElementById("sidebar");
    const toggleBtn = document.getElementById("menuToggle");

    if (menuButtons.length === 0) {
        console.error("Ingen menu-knapper fundet. Tjek HTML-strukturen.");
        return;
    }

    /* --- Klik på menupunkt skifter side --- */
    menuButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const pageId = btn.dataset.page;

            if (!pageId) {
                console.error("Menu-knap uden data-page:", btn);
                return;
            }

            // Skift side
            showPage(pageId);

            // Aktiv menu-styling
            menuButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            // Opdater titel i topbar
            updatePageTitleFromActiveMenu();

            // Luk sidebar på mobil
            closeSidebarOnMobile();
        });
    });

    /* --- Mobil-toggle (☰ knap) --- */
    if (toggleBtn && sidebar) {
        toggleBtn.addEventListener("click", () => {
            sidebar.classList.toggle("open");
        });
    }
}


/* ======================================================
   Viser en side og skjuler andre
====================================================== */
function showPage(pageId) {
    const pages = document.querySelectorAll(".page");

    pages.forEach(page => {
        const isVisible = (page.id === pageId);
        page.classList.toggle("visible", isVisible);
    });
}


/* ======================================================
   Opdaterer teksten i topbar midten (pageTitle)
====================================================== */
function updatePageTitleFromActiveMenu() {
    const active = document.querySelector(".menu-item.active");
    const pageTitleEl = document.getElementById("pageTitle");

    if (!active || !pageTitleEl) return;

    const key = active.dataset.i18n;

    if (key) {
        pageTitleEl.textContent = t(key);  // bruger sprog-systemet
    } else {
        pageTitleEl.textContent = active.textContent.trim();
    }
}


/* ======================================================
   Luk sidebar når man klikker på menu i mobil-visning
====================================================== */
function closeSidebarOnMobile() {
    const sidebar = document.getElementById("sidebar");
    if (!sidebar) return;

    if (window.innerWidth <= 880) {
        sidebar.classList.remove("open");
    }
}

/* ======================================================
   AFSNIT 06 – TIMER
   ====================================================== */

function initTimer() {
    const startBtn = document.getElementById("timerStartBtn");
    const stopBtn = document.getElementById("timerStopBtn");

    if (!startBtn || !stopBtn) return;

    startBtn.addEventListener("click", () => {
        if (timerInterval) return;
        timerStart = Date.now();
        timerInterval = setInterval(updateTimerDisplay, 1000);
        updateTimerDisplay();
    });

    stopBtn.addEventListener("click", () => {
        if (!timerInterval) return;
        clearInterval(timerInterval);
        timerInterval = null;

        const elapsedMs = Date.now() - timerStart;
        timerStart = null;
        addLogEntry(elapsedMs);
        updateTimerDisplay(0);
    });

    updateTimerDisplay(0);
}

function updateTimerDisplay(forceMs) {
    const display = document.getElementById("timerDisplay");
    if (!display) return;

    let ms = typeof forceMs === "number" ? forceMs : (timerStart ? (Date.now() - timerStart) : 0);

    const totalSeconds = Math.floor(ms / 1000);
    const h = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
    const m = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
    const s = String(totalSeconds % 60).padStart(2, "0");

    display.textContent = `${h}:${m}:${s}`;
}

/* ======================================================
   AFSNIT 06B – DEMO DATA: KUNDER
====================================================== */

function installDefaultCustomers() {
    const existing = JSON.parse(localStorage.getItem("gtp_customers"));
    if (existing && existing.length > 0) return;

    const demoCustomers = [
        { name: "Søren Olsen", phone: "21345678", email: "soren@demo.dk", address: "Sølvgade 14, København" },
        { name: "Peter Jensen", phone: "21453377", email: "peter@firma.dk", address: "Hygge Allé 3, Aarhus" },
        { name: "Lise Holm", phone: "64732467", email: "lise@holm.dk", address: "Vibevej 22, Hornbæk" },
        { name: "Camilla Sørensen", phone: "42356789", email: "camilla@camilco.dk", address: "Parkvej 5, Hillerød" },
        { name: "Anders Lund", phone: "29887766", email: "anders@lund.dk", address: "Nørregade 80, Aalborg" },
        { name: "Jenny Madsen", phone: "20228855", email: "jenny@mad.dk", address: "Havnevej 7, Esbjerg" }
    ];

    localStorage.setItem("gtp_customers", JSON.stringify(demoCustomers));
}


/* ======================================================
   AFSNIT 07 – LOGS
   ====================================================== */

function addLogEntry(ms) {
    if (!ms || ms <= 0) return;

    const now = new Date();
    const durationSeconds = Math.floor(ms / 1000);

    logs.unshift({
        timestamp: now.toISOString(),
        seconds: durationSeconds
    });

    renderLogs();
}

function renderLogs() {
    const body = document.getElementById("logsTableBody");
    if (!body) return;

    body.innerHTML = "";

    logs.forEach(entry => {
        const tr = document.createElement("tr");

        const timeTd = document.createElement("td");
        const d = new Date(entry.timestamp);
        timeTd.textContent = d.toLocaleString();

        const durTd = document.createElement("td");
        const h = Math.floor(entry.seconds / 3600);
        const m = Math.floor((entry.seconds % 3600) / 60);
        const s = entry.seconds % 60;
        const hStr = String(h).padStart(2, "0");
        const mStr = String(m).padStart(2, "0");
        const sStr = String(s).padStart(2, "0");
        durTd.textContent = `${hStr}:${mStr}:${sStr}`;

        tr.appendChild(timeTd);
        tr.appendChild(durTd);
        body.appendChild(tr);
    });
}

/* ======================================================
   AFSNIT 07B – DEMO DATA: MEDARBEJDERE
====================================================== */

function installDefaultEmployees() {
    const existing = JSON.parse(localStorage.getItem("gtp_employees"));
    if (existing && existing.length > 0) return;

    const demoEmployees = [
        { name: "Lars Kristensen", email: "lars@firma.dk", role: "employee" },
        { name: "Ronny Kisbye", email: "ronny@kisbye.eu", role: "admin" },
        { name: "Emma Larsen", email: "emma@firma.dk", role: "employee" },
        { name: "Lasse Mikkelsen", email: "lasse@firma.dk", role: "employee" },
        { name: "Mia Knudsen", email: "mia@firma.dk", role: "admin" }
    ];

    localStorage.setItem("gtp_employees", JSON.stringify(demoEmployees));
}



/* ======================================================
   AFSNIT 08 – KUNDER
   ====================================================== */

function initCustomerForm() {
    const form = document.getElementById("customerForm");
    if (!form) return;

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const name = document.getElementById("customerName").value.trim();
        const phone = document.getElementById("customerPhone").value.trim();
        const email = document.getElementById("customerEmail").value.trim();
        const address = document.getElementById("customerAddress").value.trim();

        if (!name) return;

        customers.push({ name, phone, email, address });
        form.reset();
        renderCustomers();
    });
}

function renderCustomers() {
    const body = document.getElementById("customersTableBody");
    if (!body) return;

    body.innerHTML = "";

    customers.forEach(c => {
        const tr = document.createElement("tr");

        const nameTd = document.createElement("td");
        nameTd.textContent = c.name;

        const phoneTd = document.createElement("td");
        phoneTd.textContent = c.phone;

        const emailTd = document.createElement("td");
        emailTd.textContent = c.email;

        const addressTd = document.createElement("td");
        addressTd.textContent = c.address;

        tr.appendChild(nameTd);
        tr.appendChild(phoneTd);
        tr.appendChild(emailTd);
        tr.appendChild(addressTd);

        body.appendChild(tr);
    });
}

/* ======================================================
   AFSNIT 09 – MEDARBEJDERE
   ====================================================== */

function initEmployeeForm() {
    const form = document.getElementById("employeeForm");
    if (!form) return;

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const name = document.getElementById("employeeName").value.trim();
        const email = document.getElementById("employeeEmail").value.trim();
        const role = document.getElementById("employeeRole").value;

        if (!name) return;

        employees.push({ name, email, role });
        form.reset();
        renderEmployees();
    });
}

function renderEmployees() {
    const body = document.getElementById("employeesTableBody");
    if (!body) return;

    body.innerHTML = "";

    employees.forEach(emp => {
        const tr = document.createElement("tr");

        const nameTd = document.createElement("td");
        nameTd.textContent = emp.name;

        const emailTd = document.createElement("td");
        emailTd.textContent = emp.email;

        const roleTd = document.createElement("td");
        roleTd.textContent = emp.role === "admin" ? t("role_admin") : t("role_employee");

        tr.appendChild(nameTd);
        tr.appendChild(emailTd);
        tr.appendChild(roleTd);

        body.appendChild(tr);
    });
}
