/* ======================================================
   AFSNIT 01 – SPROG-DATA (I18N)
   (Alle tekster til menu, sider og knapper)
====================================================== */

const translations = {
    da: {
        app_title: "GreenTime Pro",

        /* Menu */
        menu_dashboard: "Tidsregistrering",
        menu_customers: "Kunder",
        menu_employees: "Medarbejdere",
        menu_planning: "Planlægning",
        menu_logs: "Logs",
        menu_reports: "Rapporter",
        menu_settings: "Indstillinger",

        /* Tidsregistrering */
        timereg_title: "Tidsregistrering",
        timereg_sub: "Registrer tid på kunder du arbejder hos.",
        timereg_customer_label: "Kunde vi arbejder hos",
        timereg_choose_customer: "Vælg en kunde",
        timereg_today_time: "Tid i dag",
        timereg_btn_start: "Start",
        timereg_btn_stop: "Stop",

        /* Kunder */
        customers_title: "Kunder",
        customers_sub: "Opret og se dine kunder.",
        customers_add_btn: "Tilføj kunde",

        /* Medarbejdere */
        employees_title: "Medarbejdere",
        employees_sub: "Opret og se medarbejdere.",
        employees_add_btn: "Tilføj medarbejder",

        /* Planlægning */
        planning_title: "Planlægning",
        planning_sub: "Planlæg kommende opgaver, aftaler og ressourcer.",

        /* Logs */
        logs_title: "Logs",
        logs_sub: "Her vil dine logs komme senere.",

        /* Rapporter */
        reports_title: "Rapporter",
        reports_sub: "Rapportmodul bliver tilføjet senere.",

        /* Indstillinger */
        settings_title: "Indstillinger",
        settings_sub: "Basisindstillinger for appen."
    },
    en: {
        app_title: "GreenTime Pro",

        menu_dashboard: "Time tracking",
        menu_customers: "Customers",
        menu_employees: "Employees",
        menu_planning: "Planning",
        menu_logs: "Logs",
        menu_reports: "Reports",
        menu_settings: "Settings",

        timereg_title: "Time tracking",
        timereg_sub: "Track time on the customers you work for.",
        timereg_customer_label: "Customer we work for",
        timereg_choose_customer: "Choose a customer",
        timereg_today_time: "Time today",
        timereg_btn_start: "Start",
        timereg_btn_stop: "Stop",

        customers_title: "Customers",
        customers_sub: "Create and view your customers.",
        customers_add_btn: "Add customer",

        employees_title: "Employees",
        employees_sub: "Create and view employees.",
        employees_add_btn: "Add employee",

        planning_title: "Planning",
        planning_sub: "Plan upcoming tasks, meetings and resources.",

        logs_title: "Logs",
        logs_sub: "Your logs will appear here later.",

        reports_title: "Reports",
        reports_sub: "Report module will be added later.",

        settings_title: "Settings",
        settings_sub: "Basic settings for the app."
    },
    de: {
        app_title: "GreenTime Pro",

        menu_dashboard: "Zeiterfassung",
        menu_customers: "Kunden",
        menu_employees: "Mitarbeiter",
        menu_planning: "Planung",
        menu_logs: "Protokolle",
        menu_reports: "Berichte",
        menu_settings: "Einstellungen",

        timereg_title: "Zeiterfassung",
        timereg_sub: "Erfasse Arbeitszeit für deine Kunden.",
        timereg_customer_label: "Kunde, für den wir arbeiten",
        timereg_choose_customer: "Wähle einen Kunden",
        timereg_today_time: "Zeit heute",
        timereg_btn_start: "Start",
        timereg_btn_stop: "Stopp",

        customers_title: "Kunden",
        customers_sub: "Kunden verwalten und anzeigen.",
        customers_add_btn: "Kunde hinzufügen",

        employees_title: "Mitarbeiter",
        employees_sub: "Mitarbeiter verwalten und anzeigen.",
        employees_add_btn: "Mitarbeiter hinzufügen",

        planning_title: "Planung",
        planning_sub: "Anstehende Aufgaben und Ressourcen planen.",

        logs_title: "Protokolle",
        logs_sub: "Protokolle werden später hier angezeigt.",

        reports_title: "Berichte",
        reports_sub: "Berichtsmodul wird später hinzugefügt.",

        settings_title: "Einstellungen",
        settings_sub: "Grundeinstellungen der Anwendung."
    },
    lt: {
        app_title: "GreenTime Pro",

        menu_dashboard: "Laiko sekimas",
        menu_customers: "Klientai",
        menu_employees: "Darbuotojai",
        menu_planning: "Planavimas",
        menu_logs: "Žurnalai",
        menu_reports: "Ataskaitos",
        menu_settings: "Nustatymai",

        timereg_title: "Laiko sekimas",
        timereg_sub: "Sekite laiką pas klientus, pas kuriuos dirbate.",
        timereg_customer_label: "Klientas, pas kurį dirbame",
        timereg_choose_customer: "Pasirinkite klientą",
        timereg_today_time: "Laikas šiandien",
        timereg_btn_start: "Pradėti",
        timereg_btn_stop: "Stabdyti",

        customers_title: "Klientai",
        customers_sub: "Kurti ir peržiūrėti klientus.",
        customers_add_btn: "Pridėti klientą",

        employees_title: "Darbuotojai",
        employees_sub: "Kurti ir peržiūrėti darbuotojus.",
        employees_add_btn: "Pridėti darbuotoją",

        planning_title: "Planavimas",
        planning_sub: "Planuokite užduotis, susitikimus ir išteklius.",

        logs_title: "Žurnalai",
        logs_sub: "Žurnalai bus rodomi čia vėliau.",

        reports_title: "Ataskaitos",
        reports_sub: "Ataskaitų modulis bus pridėtas vėliau.",

        settings_title: "Nustatymai",
        settings_sub: "Pagrindiniai programos nustatymai."
    }
};

let currentLang = localStorage.getItem("gtp_lang") || "da";

function t(key) {
    const dict = translations[currentLang] || translations["da"];
    return dict[key] || key;
}

/* ======================================================
   AFSNIT 02 – INITIALISERING (DOMContentLoaded)
====================================================== */

document.addEventListener("DOMContentLoaded", () => {
    initLanguage();
    initThemeToggle();
    initSidebarNavigation();

    installDefaultCustomers();
    installDefaultEmployees();

    initCustomerUI();
    initEmployeeUI();

    renderCustomers();
    renderEmployees();

    renderTimereg();
    initTimer();
});

/* ======================================================
   AFSNIT 03 – SIDEBAR + NAVIGATION
====================================================== */

function initSidebarNavigation() {
    const buttons = document.querySelectorAll(".sidebar-menu .menu-item");
    const pages = document.querySelectorAll(".page");
    if (!buttons.length || !pages.length) return;

    // gør første menupunkt aktiv
    const first = buttons[0];
    first.classList.add("active");
    showPage(first.dataset.page);
    updatePageTitleFromActiveMenu();

    buttons.forEach(btn => {
        btn.addEventListener("click", () => {
            buttons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            const pageId = btn.dataset.page;
            showPage(pageId);
            updatePageTitleFromActiveMenu();
        });
    });
}

function showPage(pageId) {
    const pages = document.querySelectorAll(".page");
    pages.forEach(page => {
        const isActive = page.id === pageId;
        page.classList.toggle("active", isActive);
    });
}

function updatePageTitleFromActiveMenu() {
    const activeBtn = document.querySelector(".sidebar-menu .menu-item.active");
    const pageTitle = document.getElementById("pageTitle");
    if (!activeBtn || !pageTitle) return;

    const labelEl = activeBtn.querySelector("[data-i18n]");
    const key = labelEl && labelEl.dataset.i18n;
    if (key) {
        pageTitle.textContent = t(key);
    } else if (labelEl) {
        pageTitle.textContent = labelEl.textContent.trim();
    }
}

/* ======================================================
   AFSNIT 04 – SPROG (I18N-SYSTEM)
====================================================== */

function applyTranslations() {
    document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.dataset.i18n;
        if (!key) return;

        // Timer-display styres af timer-koden, ikke her
        if (el.id === "timeregDisplayText") return;

        el.textContent = t(key);
    });

    updateLangButtonActiveState();
    updatePageTitleFromActiveMenu();
}

function updateLangButtonActiveState() {
    document.querySelectorAll(".lang-btn").forEach(btn => {
        btn.classList.toggle("active", btn.dataset.lang === currentLang);
    });
}

function initLanguage() {
    const stored = localStorage.getItem("gtp_lang");
    if (stored && translations[stored]) {
        currentLang = stored;
    }
    applyTranslations();

    document.querySelectorAll(".lang-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const lang = btn.dataset.lang;
            if (!translations[lang]) return;

            currentLang = lang;
            localStorage.setItem("gtp_lang", lang);
            applyTranslations();
        });
    });
}

/* ======================================================
   AFSNIT 05 – TEMA (DARK / LIGHT) – LMM
====================================================== */

function initThemeToggle() {
    const btn = document.getElementById("themeToggle");
    const icon = document.getElementById("themeIcon");
    if (!btn || !icon) return;

    const saved = localStorage.getItem("gtp_theme") || "light";
    document.documentElement.setAttribute("data-theme", saved);
    icon.textContent = saved === "dark" ? "🌙" : "☀️";

    btn.addEventListener("click", () => {
        const current = document.documentElement.getAttribute("data-theme");
        const next = current === "light" ? "dark" : "light";

        document.documentElement.setAttribute("data-theme", next);
        localStorage.setItem("gtp_theme", next);
        icon.textContent = next === "dark" ? "🌙" : "☀️";
    });
}

/* ======================================================
   AFSNIT 06 – DEMODATA (KUNDER & MEDARBEJDERE)
====================================================== */

function installDefaultCustomers() {
    const existing = JSON.parse(localStorage.getItem("gtp_customers") || "[]");
    if (existing && existing.length > 0) return;

    const demoCustomers = [
        {
            name: "Helsingør Have & Service",
            email: "info@have-service.dk",
            phone: "+45 30 11 22 33",
            address: "Strandvejen 12, 3000 Helsingør"
        },
        {
            name: "Nordic Green Parks",
            email: "kontakt@nordicparks.dk",
            phone: "+45 40 22 33 44",
            address: "Park Allé 7, 2100 København Ø"
        },
        {
            name: "Byens Ejendomme A/S",
            email: "drift@byensejendomme.dk",
            phone: "+45 50 33 44 55",
            address: "Hovedgaden 99, 4000 Roskilde"
        }
    ];

    localStorage.setItem("gtp_customers", JSON.stringify(demoCustomers));
}

function installDefaultEmployees() {
    const existing = JSON.parse(localStorage.getItem("gtp_employees") || "[]");
    if (existing && existing.length > 0) return;

    const demoEmployees = [
        { name: "Lars Kristensen", email: "lars@firma.dk", role: "Medarbejder" },
        { name: "Ronny Kisbye", email: "ronny@kisbye.eu", role: "Admin" },
        { name: "Emma Larsen", email: "emma@firma.dk", role: "Medarbejder" }
    ];

    localStorage.setItem("gtp_employees", JSON.stringify(demoEmployees));
}

/* ======================================================
   AFSNIT 07 – KUNDER UI
====================================================== */

function getCustomers() {
    return JSON.parse(localStorage.getItem("gtp_customers") || "[]");
}

function saveCustomers(customers) {
    localStorage.setItem("gtp_customers", JSON.stringify(customers));
}

function renderCustomers() {
    const container = document.getElementById("customerList");
    if (!container) return;

    const customers = getCustomers();
    container.innerHTML = "";

    if (!customers.length) {
        const p = document.createElement("p");
        p.textContent = "Ingen kunder endnu.";
        container.appendChild(p);
        return;
    }

    customers.forEach(customer => {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
            <strong>${customer.name}</strong>
            <div>${customer.address || ""}</div>
            <div>${customer.phone || ""}</div>
            <div>${customer.email || ""}</div>
        `;
        container.appendChild(card);
    });
}

function initCustomerUI() {
    const btn = document.getElementById("addCustomerBtn");
    if (!btn) return;

    btn.addEventListener("click", () => {
        const name = prompt("Navn på kunde:");
        if (!name) return;

        const address = prompt("Adresse (valgfri):") || "";
        const phone = prompt("Telefon (valgfri):") || "";
        const email = prompt("E-mail (valgfri):") || "";

        const customers = getCustomers();
        customers.push({ name, address, phone, email });
        saveCustomers(customers);
        renderCustomers();
        renderTimereg();
    });
}

/* ======================================================
   AFSNIT 08 – MEDARBEJDERE UI
====================================================== */

function getEmployees() {
    return JSON.parse(localStorage.getItem("gtp_employees") || "[]");
}

function saveEmployees(employees) {
    localStorage.setItem("gtp_employees", JSON.stringify(employees));
}

function renderEmployees() {
    const container = document.getElementById("employeeList");
    if (!container) return;

    const employees = getEmployees();
    container.innerHTML = "";

    if (!employees.length) {
        const p = document.createElement("p");
        p.textContent = "Ingen medarbejdere endnu.";
        container.appendChild(p);
        return;
    }

    employees.forEach(emp => {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
            <strong>${emp.name}</strong>
            <div>${emp.email || ""}</div>
            <div>${emp.role || ""}</div>
        `;
        container.appendChild(card);
    });
}

function initEmployeeUI() {
    const btn = document.getElementById("addEmployeeBtn");
    if (!btn) return;

    btn.addEventListener("click", () => {
        const name = prompt("Navn på medarbejder:");
        if (!name) return;

        const email = prompt("E-mail (valgfri):") || "";
        const role = prompt("Rolle (valgfri):") || "";

        const employees = getEmployees();
        employees.push({ name, email, role });
        saveEmployees(employees);
        renderEmployees();
    });
}

/* ======================================================
   AFSNIT 09 – TIDSREGISTRERING (TIMER)
====================================================== */

let timerInterval = null;
let timerSeconds = 0;

function initTimer() {
    const startBtn = document.getElementById("timeregStartBtn");
    const stopBtn = document.getElementById("timeregStopBtn");
    const display = document.getElementById("timeregDisplayText");

    if (!startBtn || !stopBtn || !display) return;

    updateTimerDisplay(display);

    startBtn.addEventListener("click", () => startTimer(display));
    stopBtn.addEventListener("click", () => stopTimer(display));
}

function startTimer(display) {
    if (timerInterval) return;

    timerInterval = setInterval(() => {
        timerSeconds += 60; // ét minut ad gangen
        updateTimerDisplay(display);
    }, 1000);
}

function stopTimer(display) {
    if (!timerInterval) return;

    clearInterval(timerInterval);
    timerInterval = null;
    updateTimerDisplay(display);
}

function updateTimerDisplay(display) {
    if (!display) return;
    const h = String(Math.floor(timerSeconds / 3600)).padStart(2, "0");
    const m = String(Math.floor((timerSeconds % 3600) / 60)).padStart(2, "0");

    const label = t("timereg_today_time");
    display.textContent = `${label}: ${h}:${m}`;
}

/* ======================================================
   AFSNIT 10 – TIDSREGISTRERING: KUNDE-DROPDOWN
====================================================== */

function renderTimereg() {
    const select = document.getElementById("timeregCustomerSelect");
    if (!select) return;

    const customers = getCustomers();
    select.innerHTML = `
        <option value="" data-i18n="timereg_choose_customer">
            ${t("timereg_choose_customer")}
        </option>
    `;

    customers.forEach(c => {
        const opt = document.createElement("option");
        opt.value = c.name;
        opt.textContent = c.name;
        select.appendChild(opt);
    });
   renderTimeregEmployees();

    applyTranslations();
}

/* ======================================================
   AFSNIT 11 – MOBIL SIDEBAR TOGGLE (OPTION)
====================================================== */

function toggleSidebar() {
    const sidebar = document.getElementById("sidebar");
    const overlay = document.querySelector(".sidebar-overlay");
    if (!sidebar || !overlay) return;

    sidebar.classList.toggle("open");
    overlay.classList.toggle("visible");
}


/* ======================================================
   AFSNIT 12 – TIMEREG MEDARBEJDER-KNAPPER
   (Viser én knap pr. medarbejder under kunde-vælgeren)
====================================================== */

function renderTimeregEmployees() {
    const container = document.getElementById("timeregEmployeeContainer");
    if (!container) return;

    const employees = getEmployees(); // henter alle medarbejdere
    container.innerHTML = ""; // ryd containeren før vi fylder på

    employees.forEach((emp, index) => {
        const btn = document.createElement("button");
        btn.className = "timereg-employee-btn";
        btn.textContent = emp.name;

        // Klik → toggle active (kun visuel funktion)
        btn.addEventListener("click", () => {
            btn.classList.toggle("active");
        });

        container.appendChild(btn);
    });
}
