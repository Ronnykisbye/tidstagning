/* ======================================================
   AFSNIT 01 – SPROG-DATA (I18N)
====================================================== */

const translations = {
    da: {
        menu_dashboard: "Tidsregistrering",
        menu_customers: "Kunder",
        menu_employees: "Medarbejdere",
        menu_planning: "Planlægning",
        menu_logs: "Logs",
        menu_reports: "Rapporter",
        menu_settings: "Indstillinger",

        timereg_title: "Tidsregistrering",
        timereg_customer_label: "Kunde vi arbejder hos",
        timereg_choose_customer: "Vælg en kunde",
        timereg_today_time: "Tid i dag: 0:00",
        timereg_btn_start: "Start",
        timereg_btn_stop: "Stop",

        customers_title: "Kunder",
        customers_sub: "Opret og se dine kunder.",
        customers_add_btn: "Tilføj kunde",

        employees_title: "Medarbejdere",
        employees_sub: "Opret og se medarbejdere.",
        employees_add_btn: "Tilføj medarbejder",

        planning_title: "Planlægning",
        planning_sub: "Planlæg kommende opgaver, aftaler og ressourcer.",

        logs_title: "Logs",
        logs_sub: "Her vil dine logs komme senere.",

        reports_title: "Rapporter",
        reports_sub: "Rapportmodul bliver tilføjet senere.",

        settings_title: "Indstillinger",
        settings_sub: "Basisindstillinger for appen."
    },
    en: {
        menu_dashboard: "Time tracking",
        menu_customers: "Customers",
        menu_employees: "Employees",
        menu_planning: "Planning",
        menu_logs: "Logs",
        menu_reports: "Reports",
        menu_settings: "Settings",

        timereg_title: "Time tracking",
        timereg_customer_label: "Customer we work for",
        timereg_choose_customer: "Choose a customer",
        timereg_today_time: "Time today: 0:00",
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
        menu_dashboard: "Zeiterfassung",
        menu_customers: "Kunden",
        menu_employees: "Mitarbeiter",
        menu_planning: "Planung",
        menu_logs: "Protokolle",
        menu_reports: "Berichte",
        menu_settings: "Einstellungen",

        timereg_title: "Zeiterfassung",
        timereg_customer_label: "Kunde, für den wir arbeiten",
        timereg_choose_customer: "Wähle einen Kunden",
        timereg_today_time: "Zeit heute: 0:00",
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
        menu_dashboard: "Laiko sekimas",
        menu_customers: "Klientai",
        menu_employees: "Darbuotojai",
        menu_planning: "Planavimas",
        menu_logs: "Žurnalai",
        menu_reports: "Ataskaitos",
        menu_settings: "Nustatymai",

        timereg_title: "Laiko sekimas",
        timereg_customer_label: "Klientas, pas kurį dirbame",
        timereg_choose_customer: "Pasirinkite klientą",
        timereg_today_time: "Laikas šiandien: 0:00",
        timereg_btn_start: "Pradėti",
        timereg_btn_stop: "Stabdyti",

        customers_title: "Klientai",
        customers_sub: "Kurti ir peržiūrėti klientus.",
        customers_add_btn: "Pridėti klientą",

        employees_title: "Darbuotojai",
        employees_sub: "Kurti ir peržiūrėti darbuotojus.",
        employees_add_btn: "Pridėti darbuotoją",

        planning_title: "Planavimas",
        planning_sub: "Planuokite užduotis ir susitikimus.",

        logs_title: "Žurnalai",
        logs_sub: "Žurnalai bus rodomi čia vėliau.",

        reports_title: "Ataskaitos",
        reports_sub: "Ataskaitų modulis bus pridėtas vėliau.",

        settings_title: "Nustatymai",
        settings_sub: "Pagrindiniai programos nustatymai."
    }
};

let currentLang = "da";

function t(key) {
    return translations[currentLang]?.[key] || translations.da[key] || key;
}


/* ======================================================
   AFSNIT 02 – INITIALISERING (DOMContentLoaded)
====================================================== */

document.addEventListener("DOMContentLoaded", () => {
    initSidebarNavigation();
    initLanguage();
    initLanguageButtons();
    initThemeToggle();

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
    const buttons = document.querySelectorAll(".sidebar-menu a[data-page]");
    if (!buttons.length) return;

    // gør første menupunkt aktiv
    const first = buttons[0];
    first.classList.add("active");
    showPage(first.dataset.page);
    updatePageTitleFromActiveMenu();

    buttons.forEach(btn => {
        btn.classList.add("menu-item");

        btn.addEventListener("click", (evt) => {
            evt.preventDefault();

            const pageId = btn.dataset.page;
            if (!pageId) return;

            buttons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            showPage(pageId);
            updatePageTitleFromActiveMenu();
        });
    });
}

function showPage(pageId) {
    document.querySelectorAll(".page").forEach(page => {
        const isActive = page.id === pageId;
        page.classList.toggle("active", isActive);
    });
}

function updatePageTitleFromActiveMenu() {
    const activeBtn = document.querySelector(".sidebar-menu a.active");
    const pageTitle = document.getElementById("pageTitle");
    if (!activeBtn || !pageTitle) return;

    const labelEl = activeBtn.querySelector("[data-i18n]");
    const key = labelEl?.dataset.i18n;

    if (key) {
        pageTitle.textContent = t(key);
    } else if (labelEl) {
        pageTitle.textContent = labelEl.textContent.trim();
    }
}


/* ======================================================
   AFSNIT 04 – SPROG (I18N-SYSTEM)
====================================================== */

function initLanguage() {
    const stored = localStorage.getItem("gtp_lang");
    if (stored && translations[stored]) currentLang = stored;
    applyTranslations();
}

function updateLangButtonActiveState() {
    document.querySelectorAll(".lang-btn").forEach(btn => {
        btn.classList.toggle("active", btn.dataset.lang === currentLang);
    });
}

function applyTranslations() {
    document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.dataset.i18n;
        el.textContent = t(key);
    });

    updateLangButtonActiveState();
}

function initLanguageButtons() {
    document.querySelectorAll(".lang-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const lang = btn.dataset.lang;
            if (!translations[lang]) return;

            currentLang = lang;
            localStorage.setItem("gtp_lang", lang);
            applyTranslations();
            updatePageTitleFromActiveMenu();
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
   AFSNIT 06 – TIMER (TIDSREGISTRERING)
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
        timerSeconds++;
        updateTimerDisplay(display);
    }, 1000);
}

function stopTimer(display) {
    if (!timerInterval) return;

    clearInterval(timerInterval);
    timerInterval = null;
    updateTimerDisplay(display);
}

function resetTimer(display) {
    timerSeconds = 0;
    updateTimerDisplay(display);
}

function updateTimerDisplay(display) {
    if (!display) return;
    const h = String(Math.floor(timerSeconds / 3600)).padStart(2, "0");
    const m = String(Math.floor((timerSeconds % 3600) / 60)).padStart(2, "0");
    const s = String(timerSeconds % 60).padStart(2, "0");
    display.textContent = `${t("timereg_today_time").split(":")[0]}: ${h}:${m}:${s}`;
}


/* ======================================================
   AFSNIT 07 – DEMO DATA: KUNDER & MEDARBEJDERE
====================================================== */

function installDefaultCustomers() {
    const existing = JSON.parse(localStorage.getItem("gtp_customers") || "[]");
    if (existing && existing.length > 0) return;

    const demoCustomers = [
        { name: "Søren Olsen", phone: "21 34 56 78", email: "soren@demo.dk", address: "Sølvgade 14, København" },
        { name: "Peter Jensen", phone: "21 45 33 77", email: "peter@firma.dk", address: "Hygge Allé 3, Aarhus" },
        { name: "Lise Holm", phone: "64 73 24 67", email: "lise@holm.dk", address: "Vibevej 22, Hornbæk" }
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
   AFSNIT 08 – KUNDER (UI)
====================================================== */

function initCustomerUI() {
    const btn = document.getElementById("addCustomerBtn");
    if (!btn) return;

    btn.addEventListener("click", () => {
        const name = prompt("Kundenavn:");
        if (!name) return;

        const customer = {
            name,
            phone: "",
            email: "",
            address: ""
        };

        const customers = JSON.parse(localStorage.getItem("gtp_customers") || "[]");
        customers.push(customer);
        localStorage.setItem("gtp_customers", JSON.stringify(customers));

        renderCustomers();
        renderTimereg();
    });
}

function renderCustomers() {
    const container = document.getElementById("customerList");
    if (!container) return;

    const customers = JSON.parse(localStorage.getItem("gtp_customers") || "[]");

    if (!customers.length) {
        container.innerHTML = "<p>Ingen kunder endnu.</p>";
        return;
    }

    container.innerHTML = customers.map(c => `
        <div class="card customer-card">
            <div><strong>${c.name}</strong></div>
            <div>${c.phone || ""}</div>
            <div>${c.email || ""}</div>
            <div>${c.address || ""}</div>
        </div>
    `).join("");
}


/* ======================================================
   AFSNIT 09 – MEDARBEJDERE (UI)
====================================================== */

function initEmployeeUI() {
    const btn = document.getElementById("addEmployeeBtn");
    if (!btn) return;

    btn.addEventListener("click", () => {
        const name = prompt("Medarbejdernavn:");
        if (!name) return;

        const employee = {
            name,
            email: "",
            role: "Medarbejder"
        };

        const employees = JSON.parse(localStorage.getItem("gtp_employees") || "[]");
        employees.push(employee);
        localStorage.setItem("gtp_employees", JSON.stringify(employees));

        renderEmployees();
    });
}

function renderEmployees() {
    const container = document.getElementById("employeeList");
    if (!container) return;

    const employees = JSON.parse(localStorage.getItem("gtp_employees") || "[]");

    if (!employees.length) {
        container.innerHTML = "<p>Ingen medarbejdere endnu.</p>";
        return;
    }

    container.innerHTML = employees.map(e => `
        <div class="card employee-card">
            <div><strong>${e.name}</strong></div>
            <div>${e.email || ""}</div>
            <div>${e.role || ""}</div>
        </div>
    `).join("");
}


/* ======================================================
   AFSNIT 10 – TIDSREGISTRERING (KUNDE-DROPDOWN)
====================================================== */

function renderTimereg() {
    const select = document.getElementById("timeregCustomerSelect");
    if (!select) return;

    const customers = JSON.parse(localStorage.getItem("gtp_customers") || "[]");

    // default-option
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
