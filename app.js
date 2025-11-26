console.log("LOADER GREEN TIME PRO – APP.JS v2");

console.log("LOADER GREEN TIME PRO – APP.JS v2");

/* ======================================================
   AFSNIT 01 – GLOBAL STATE & HJÆLPEFUNKTIONER
   ====================================================== */

let customers = [];
let employees = [];
let logs = [];
let plans = [];

let quickTimer = null;
let quickIntervalId = null;

let activeTimer = null;

let currentLang = "da";
let calendarMonth = new Date();
let selectedCalendarDate = null;

const STORAGE_KEYS = {
    customers: "gtp_customers",
    employees: "gtp_employees",
    logs: "gtp_logs",
    plans: "gtp_plans",
    activeTimer: "gtp_active_timer",
    quickTimer: "gtp_quick_timer",
    theme: "gtp_theme",
    lang: "gtp_lang"
};

function uuid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

function toDateString(d) {
    return d.toISOString().slice(0, 10);
}

function parseDateString(dateStr) {
    return new Date(`${dateStr}T00:00:00`);
}

function formatTimeFromSeconds(sec) {
    const h = String(Math.floor(sec / 3600)).padStart(2, "0");
    const m = String(Math.floor((sec % 3600) / 60)).padStart(2, "0");
    const s = String(sec % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
}

function safeParse(key, fallback) {
    try {
        const raw = localStorage.getItem(key);
        if (!raw) return fallback;
        const value = JSON.parse(raw);
        return value == null ? fallback : value;
    } catch (e) {
        return fallback;
    }
}

function getCustomerName(id) {
    const c = customers.find(c => c.id === id);
    return c ? c.name : "";
}

function getEmployeeName(id) {
    const e = employees.find(e => e.id === id);
    return e ? e.name : "";
}

function getLocaleForLang(lang) {
    switch (lang) {
        case "en": return "en-GB";
        case "de": return "de-DE";
        case "lt": return "lt-LT";
        default:   return "da-DK";
    }
}

/* Demo-data til første gang / tom app */
function seedDemoDataIfEmpty() {
    if (!customers || customers.length === 0) {
        customers = [
            { id: uuid(), name: "Lars",  phone: "12345678", email: "lars@example.com",  address: "Hornbæk" },
            { id: uuid(), name: "Ronny", phone: "22345678", email: "ronny@example.com", address: "Helsingør" }
        ];
    }

    if (!employees || employees.length === 0) {
        employees = [
            { id: uuid(), name: "lars",  email: "lars@firma.dk",  role: "employee" },
            { id: uuid(), name: "ronny", email: "ronny@firma.dk", role: "employee" },
            { id: uuid(), name: "emma",  email: "emma@firma.dk",  role: "employee" },
            { id: uuid(), name: "lasse", email: "lasse@firma.dk", role: "employee" }
        ];
    }
}

/* ======================================================
   AFSNIT 02 – LOCAL STORAGE (LOAD / SAVE)
   ====================================================== */

function loadAll() {
    customers   = safeParse(STORAGE_KEYS.customers, []);
    employees   = safeParse(STORAGE_KEYS.employees, []);
    logs        = safeParse(STORAGE_KEYS.logs, []);
    plans       = safeParse(STORAGE_KEYS.plans, []);

    activeTimer = safeParse(STORAGE_KEYS.activeTimer, null);
    quickTimer  = safeParse(STORAGE_KEYS.quickTimer, null);

    currentLang = safeParse(STORAGE_KEYS.lang, "da");

    // <-- VIGTIGT: fyld på med demo-data hvis alt er tomt
    seedDemoDataIfEmpty();

    // Gem dem, så de ligger i localStorage fremover
    saveAll();
}

function saveAll() {
    localStorage.setItem(STORAGE_KEYS.customers, JSON.stringify(customers));
    localStorage.setItem(STORAGE_KEYS.employees, JSON.stringify(employees));
    localStorage.setItem(STORAGE_KEYS.logs, JSON.stringify(logs));
    localStorage.setItem(STORAGE_KEYS.plans, JSON.stringify(plans));
    localStorage.setItem(STORAGE_KEYS.activeTimer, JSON.stringify(activeTimer));
    localStorage.setItem(STORAGE_KEYS.quickTimer, JSON.stringify(quickTimer));
}



/* ======================================================
   AFSNIT 03 – I18N (TEKSTER & SPROG)
   ====================================================== */

const translations = {
    da: {
        app_title: "GreenTime Pro",
        menu_dashboard: "Tidsregistrering",
        menu_customers: "Kunder",
        menu_employees: "Medarbejdere",
        menu_time_tracking: "Detaljeret tid",
        menu_schedule: "Plan & kalender",
        menu_logs: "Logs",
        menu_reports: "Rapporter",
        menu_settings: "Indstillinger",

        title_customer: "Kunde",
        title_customer_select: "Vælg kunde",
        title_employee_list: "Medarbejderen hos kunden",
        title_mode: "Mode",
        title_day: "Dag",
        title_total: "Total",
        title_time: "Tid",
        title_note: "Note",
        title_duration: "Varighed",
        title_date: "Dato",
        title_starttime: "Starttid",

        cust_name: "Navn",
        cust_phone: "Telefon",
        cust_email: "Email",
        cust_address: "Adresse",
        cust_save: "Gem kunde",
        cust_overview: "Oversigt over kunder",
        cust_reset_label: "Nulstil tid for kunde",
        cust_reset_btn: "Nulstil",

        emp_name: "Navn",
        emp_email: "Email",
        emp_role: "Rolle",
        emp_save: "Gem medarbejder",
        role_employee: "Medarbejder",
        role_admin: "Administrator",

        timer_start: "Start",
        timer_stop: "Stop",
        timer_status: "Status",

        log_today: "Registreringer i dag",
        log_start: "Start",
        log_end: "Slut",
        log_duration: "Minutter",
        log_customer: "Kunde",
        log_employee: "Medarbejder",

        plan_month: "Kalendermåned",
        plan_day_tasks: "Dagens opgaver",
        plan_save: "Gem plan",

        report_customer: "Kunde",
        report_employee: "Medarbejder",
        report_output: "Resultat"
    },

    en: {
        app_title: "GreenTime Pro",
        menu_dashboard: "Time tracking",
        menu_customers: "Customers",
        menu_employees: "Employees",
        menu_time_tracking: "Detailed time",
        menu_schedule: "Plan & calendar",
        menu_logs: "Logs",
        menu_reports: "Reports",
        menu_settings: "Settings",

        title_customer: "Customer",
        title_customer_select: "Select customer",
        title_employee_list: "Employees at customer",
        title_mode: "Mode",
        title_day: "Day",
        title_total: "Total",
        title_time: "Time",
        title_note: "Note",
        title_duration: "Duration",
        title_date: "Date",
        title_starttime: "Start time",

        cust_name: "Name",
        cust_phone: "Phone",
        cust_email: "Email",
        cust_address: "Address",
        cust_save: "Save customer",
        cust_overview: "Customer overview",
        cust_reset_label: "Reset customer time",
        cust_reset_btn: "Reset",

        emp_name: "Name",
        emp_email: "Email",
        emp_role: "Role",
        emp_save: "Save employee",
        role_employee: "Employee",
        role_admin: "Administrator",

        timer_start: "Start",
        timer_stop: "Stop",
        timer_status: "Status",

        log_today: "Today’s registrations",
        log_start: "Start",
        log_end: "End",
        log_duration: "Minutes",
        log_customer: "Customer",
        log_employee: "Employee",

        plan_month: "Calendar month",
        plan_day_tasks: "Tasks of the day",
        plan_save: "Save plan",

        report_customer: "Customer",
        report_employee: "Employee",
        report_output: "Result"
    },

    de: {
        app_title: "GreenTime Pro",
        menu_dashboard: "Zeiterfassung",
        menu_customers: "Kunden",
        menu_employees: "Mitarbeiter",
        menu_time_tracking: "Detailzeit",
        menu_schedule: "Plan & Kalender",
        menu_logs: "Protokolle",
        menu_reports: "Berichte",
        menu_settings: "Einstellungen",

        title_customer: "Kunde",
        title_customer_select: "Kunde wählen",
        title_employee_list: "Mitarbeiter beim Kunden",
        title_mode: "Modus",
        title_day: "Tag",
        title_total: "Gesamt",
        title_time: "Zeit",
        title_note: "Notiz",
        title_duration: "Dauer",
        title_date: "Datum",
        title_starttime: "Startzeit",

        cust_name: "Name",
        cust_phone: "Telefon",
        cust_email: "E-Mail",
        cust_address: "Adresse",
        cust_save: "Kunde speichern",
        cust_overview: "Kundenübersicht",
        cust_reset_label: "Zeit für Kunde zurücksetzen",
        cust_reset_btn: "Zurücksetzen",

        emp_name: "Name",
        emp_email: "E-Mail",
        emp_role: "Rolle",
        emp_save: "Mitarbeiter speichern",
        role_employee: "Mitarbeiter",
        role_admin: "Administrator",

        timer_start: "Start",
        timer_stop: "Stopp",
        timer_status: "Status",

        log_today: "Heutige Einträge",
        log_start: "Start",
        log_end: "Ende",
        log_duration: "Minuten",
        log_customer: "Kunde",
        log_employee: "Mitarbeiter",

        plan_month: "Kalendermonat",
        plan_day_tasks: "Aufgaben des Tages",
        plan_save: "Plan speichern",

        report_customer: "Kunde",
        report_employee: "Mitarbeiter",
        report_output: "Ergebnis"
    },

    lt: {
        app_title: "GreenTime Pro",
        menu_dashboard: "Laiko registracija",
        menu_customers: "Klientai",
        menu_employees: "Darbuotojai",
        menu_time_tracking: "Detali apskaita",
        menu_schedule: "Planavimas ir kalendorius",
        menu_logs: "Žurnalai",
        menu_reports: "Ataskaitos",
        menu_settings: "Nustatymai",

        title_customer: "Klientas",
        title_customer_select: "Pasirinkite klientą",
        title_employee_list: "Darbuotojai pas klientą",
        title_mode: "Režimas",
        title_day: "Diena",
        title_total: "Iš viso",
        title_time: "Laikas",
        title_note: "Pastaba",
        title_duration: "Trukmė",
        title_date: "Data",
        title_starttime: "Pradžios laikas",

        cust_name: "Vardas",
        cust_phone: "Telefonas",
        cust_email: "El. paštas",
        cust_address: "Adresas",
        cust_save: "Išsaugoti klientą",
        cust_overview: "Klientų sąrašas",
        cust_reset_label: "Atstatyti kliento laiką",
        cust_reset_btn: "Atstatyti",

        emp_name: "Vardas",
        emp_email: "El. paštas",
        emp_role: "Vaidmuo",
        emp_save: "Išsaugoti darbuotoją",
        role_employee: "Darbuotojas",
        role_admin: "Administratorius",

        timer_start: "Pradėti",
        timer_stop: "Stabdyti",
        timer_status: "Būsena",

        log_today: "Šiandienos įrašai",
        log_start: "Pradžia",
        log_end: "Pabaiga",
        log_duration: "Minutės",
        log_customer: "Klientas",
        log_employee: "Darbuotojas",

        plan_month: "Kalendorinis mėnuo",
        plan_day_tasks: "Dienos užduotys",
        plan_save: "Išsaugoti planą",

        report_customer: "Klientas",
        report_employee: "Darbuotojas",
        report_output: "Rezultatas"
    }
};

function t(key) {
    const pack = translations[currentLang] || translations["da"];
    return pack[key] || translations["da"][key] || "";
}

function applyTranslations() {
    document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.dataset.i18n;
        if (!key) return;
        const txt = t(key);
        if (txt) el.textContent = txt;
    });
}

function applyLangActiveButton() {
    document.querySelectorAll(".lang-btn").forEach(btn => {
        btn.classList.toggle("active", btn.dataset.lang === currentLang);
    });
}

function initLanguage() {
    applyLangActiveButton();
    applyTranslations();

    document.querySelectorAll(".lang-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const lang = btn.dataset.lang;
            if (!lang) return;
            currentLang = lang;
            localStorage.setItem(STORAGE_KEYS.lang, JSON.stringify(currentLang));
            applyLangActiveButton();
            applyTranslations();
        });
    });
}



/* ======================================================
   TEMA – DARK/LIGHT MODE (GENSKABT)
====================================================== */

function initTheme() {
    const saved = localStorage.getItem("theme") || "dark";
    document.documentElement.setAttribute("data-theme", saved);
}

function initThemeToggle() {
    const btn = document.getElementById("themeToggle");

    btn.addEventListener("click", () => {
        let current = document.documentElement.getAttribute("data-theme");
        let next = current === "dark" ? "light" : "dark";

        document.documentElement.setAttribute("data-theme", next);
        localStorage.setItem("theme", next);
    });
}

initTheme();
initThemeToggle();



/* ======================================================
   AFSNIT 05 – NAVIGATION / SIDEBAR
   ====================================================== */

function initNavigation() {
    const sidebar = document.getElementById("sidebar");
    const menuButtons = document.querySelectorAll(".menu-item");
    const allPages = document.querySelectorAll(".page");
    const pageTitle = document.getElementById("pageTitle");
    const menuToggle = document.getElementById("menuToggle");

    if (menuToggle && sidebar) {
        menuToggle.addEventListener("click", () => {
            sidebar.classList.toggle("open");
        });
    }

    menuButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const page = btn.dataset.page;
            if (!page) return;

            allPages.forEach(p => p.classList.remove("page-visible"));
            const newPage = document.getElementById(page);
            if (newPage) newPage.classList.add("page-visible");

            menuButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            if (pageTitle) pageTitle.textContent = btn.textContent.trim();

            if (sidebar) sidebar.classList.remove("open");
        });
    });
}



/* ======================================================
   AFSNIT 06 – KUNDER
   ====================================================== */

function refreshCustomerSelects() {
    const ids = [
        "quickCustomerSelect",
        "timerCustomerSelect",
        "planCustomerSelect",
        "reportCustomerSelect",
        "resetCustomerSelect"
    ];

    ids.forEach(id => {
        const sel = document.getElementById(id);
        if (!sel) return;

        sel.innerHTML = "";

        const isReport = id === "reportCustomerSelect";
        const placeholderKey = isReport ? "cust_overview" : "title_customer_select";
        const opt = document.createElement("option");
        opt.value = "";
        opt.textContent = t(placeholderKey) || "";
        sel.appendChild(opt);

        customers.forEach(c => {
            const o = document.createElement("option");
            o.value = c.id;
            o.textContent = c.name;
            sel.appendChild(o);
        });
    });
}

function renderCustomerTable() {
    const table = document.getElementById("customerTable");
    if (!table) return;
    const tbody = table.querySelector("tbody");
    tbody.innerHTML = "";

    customers.forEach(c => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${c.name}</td>
            <td>${c.phone}</td>
            <td>${c.email}</td>
            <td>${c.address}</td>
        `;
        tbody.appendChild(tr);
    });
}

function initCustomers() {
    const btn = document.getElementById("saveCustomerBtn");
    if (!btn) return;

    btn.addEventListener("click", () => {
        const name  = document.getElementById("custName").value.trim();
        const phone = document.getElementById("custPhone").value.trim();
        const email = document.getElementById("custEmail").value.trim();
        const addr  = document.getElementById("custAddress").value.trim();

        if (!name) {
            alert("Skriv et navn på kunden.");
            return;
        }

        customers.push({
            id: uuid(),
            name,
            phone,
            email,
            address: addr
        });

        saveAll();
        renderCustomerTable();
        refreshCustomerSelects();

        document.getElementById("custName").value = "";
        document.getElementById("custPhone").value = "";
        document.getElementById("custEmail").value = "";
        document.getElementById("custAddress").value = "";
    });

    const resetBtn = document.getElementById("resetCustomerTimeBtn");
    if (resetBtn) {
        resetBtn.addEventListener("click", () => {
            const sel = document.getElementById("resetCustomerSelect");
            if (!sel.value) {
                alert("Vælg en kunde.");
                return;
            }
            const before = logs.length;
            logs = logs.filter(l => l.customerId !== sel.value);
            const removed = before - logs.length;

            saveAll();
            renderTodayLogs();

            const info = document.getElementById("resetCustomerInfo");
            if (info) info.textContent = `Slettede ${removed} registreringer for kunden.`;
        });
    }
}



/* ======================================================
   AFSNIT 07 – MEDARBEJDERE
   ====================================================== */

function renderEmployeeTable() {
    const table = document.getElementById("employeeTable");
    if (!table) return;
    const tbody = table.querySelector("tbody");
    tbody.innerHTML = "";

    employees.forEach(e => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${e.name}</td>
            <td>${e.email}</td>
            <td>${e.role}</td>
        `;
        tbody.appendChild(tr);
    });
}

function refreshEmployeeSelects() {
    const ids = ["timerEmployeeSelect", "reportEmployeeSelect"];

    ids.forEach(id => {
        const sel = document.getElementById(id);
        if (!sel) return;

        sel.innerHTML = "";

        const isReport = id === "reportEmployeeSelect";
        const placeholder = isReport ? t("report_employee") : t("emp_name");

        const opt = document.createElement("option");
        opt.value = "";
        opt.textContent = placeholder;
        sel.appendChild(opt);

        employees.forEach(e => {
            const o = document.createElement("option");
            o.value = e.id;
            o.textContent = e.name;
            sel.appendChild(o);
        });
    });
}

function renderEmployeeChips() {
    const lists = [
        document.getElementById("quickEmployeeList"),
        document.getElementById("planEmployeeList")
    ];

    lists.forEach(list => {
        if (!list) return;
        list.innerHTML = "";

        employees.forEach(e => {
            const chip = document.createElement("button");
            chip.type = "button";
            chip.className = "chip";
            chip.dataset.id = e.id;
            chip.textContent = e.name;

            chip.addEventListener("click", () => {
                chip.classList.toggle("selected");
            });

            list.appendChild(chip);
        });
    });
}

function initEmployees() {
    const btn = document.getElementById("saveEmployeeBtn");
    if (!btn) return;

    btn.addEventListener("click", () => {
        const name  = document.getElementById("empName").value.trim();
        const email = document.getElementById("empEmail").value.trim();
        const role  = document.getElementById("empRole").value;

        if (!name) {
            alert("Skriv et navn på medarbejderen.");
            return;
        }

        employees.push({
            id: uuid(),
            name,
            email,
            role
        });

        saveAll();
        renderEmployeeTable();
        refreshEmployeeSelects();
        renderEmployeeChips();

        document.getElementById("empName").value = "";
        document.getElementById("empEmail").value = "";
        document.getElementById("empRole").value = "employee";
    });
}



/* ======================================================
   AFSNIT 08 – CHIP-HJÆLPER
   ====================================================== */

function getSelectedIdsFromChipList(containerId) {
    const box = document.getElementById(containerId);
    if (!box) return [];
    return [...box.querySelectorAll(".chip.selected")].map(chip => chip.dataset.id);
}



/* ======================================================
   AFSNIT 09 – QUICK TIMER (FORSIDE)
   ====================================================== */

function updateQuickTimerDisplay() {
    const display = document.getElementById("quickTimerDisplay");
    if (!display) return;

    if (!quickTimer) {
        display.textContent = "00:00:00";
        return;
    }

    const start = new Date(quickTimer.start);
    const now = new Date();
    const diffSec = Math.floor((now - start) / 1000);
    display.textContent = formatTimeFromSeconds(diffSec);
}

function stopQuickInterval() {
    if (quickIntervalId) clearInterval(quickIntervalId);
    quickIntervalId = null;
}

function initQuickTimer() {
    const startBtn = document.getElementById("quickStartBtn");
    const stopBtn  = document.getElementById("quickStopBtn");
    if (!startBtn || !stopBtn) return;

    if (quickTimer && quickTimer.start) {
        quickIntervalId = setInterval(updateQuickTimerDisplay, 1000);
        updateQuickTimerDisplay();
    }

    startBtn.addEventListener("click", () => {
        const customerSel = document.getElementById("quickCustomerSelect");
        const customerId  = customerSel.value;

        if (!customerId) {
            alert("Vælg en kunde.");
            return;
        }

        const employeeIds = getSelectedIdsFromChipList("quickEmployeeList");
        if (!employeeIds.length) {
            alert("Vælg en eller flere medarbejdere.");
            return;
        }

        let mode = "day";
        if (document.getElementById("quickModeTotal").checked) mode = "total";

        quickTimer = {
            id: uuid(),
            customerId,
            employeeIds,
            mode,
            start: new Date().toISOString()
        };

        saveAll();
        stopQuickInterval();
        quickIntervalId = setInterval(updateQuickTimerDisplay, 1000);
        updateQuickTimerDisplay();
    });

    stopBtn.addEventListener("click", () => {
        if (!quickTimer) return;

        const start = new Date(quickTimer.start);
        const now = new Date();
        const diffSec = Math.floor((now - start) / 1000);
        const minutes = Math.max(1, Math.round(diffSec / 60));
        const dateStr = toDateString(start);

        quickTimer.employeeIds.forEach(empId => {
            logs.push({
                id: uuid(),
                date: dateStr,
                customerId: quickTimer.customerId,
                employeeId: empId,
                start: start.toISOString(),
                end: now.toISOString(),
                durationMinutes: minutes
            });
        });

        quickTimer = null;
        stopQuickInterval();
        updateQuickTimerDisplay();
        saveAll();
        renderTodayLogs();
    });
}



/* ======================================================
   AFSNIT 10 – DETALJERET TIMER
   ====================================================== */

function initDetailedTimer() {
    const startBtn = document.getElementById("startTimerBtn");
    const stopBtn  = document.getElementById("stopTimerBtn");
    const statusEl = document.getElementById("timerStatus");

    if (!startBtn || !stopBtn) return;

    if (activeTimer && statusEl) {
        const cName = getCustomerName(activeTimer.customerId);
        const eName = getEmployeeName(activeTimer.employeeId);
        statusEl.textContent = `${cName} / ${eName}`;
    } else if (statusEl) {
        statusEl.textContent = "Ingen aktiv timer";
    }

    startBtn.addEventListener("click", () => {
        const custSel = document.getElementById("timerCustomerSelect");
        const empSel  = document.getElementById("timerEmployeeSelect");

        const customerId = custSel.value;
        const employeeId = empSel.value;

        if (!customerId || !employeeId) {
            alert("Vælg kunde og medarbejder.");
            return;
        }

        activeTimer = {
            id: uuid(),
            customerId,
            employeeId,
            start: new Date().toISOString(),
            date: toDateString(new Date())
        };

        saveAll();

        if (statusEl) {
            statusEl.textContent =
                `${getCustomerName(customerId)} / ${getEmployeeName(employeeId)}`;
        }
    });

    stopBtn.addEventListener("click", () => {
        if (!activeTimer) {
            alert("Ingen aktiv timer.");
            return;
        }

        const now = new Date();
        const start = new Date(activeTimer.start);
        const diffSec = Math.floor((now - start) / 1000);
        const minutes = Math.max(1, Math.round(diffSec / 60));

        logs.push({
            id: uuid(),
            date: activeTimer.date,
            customerId: activeTimer.customerId,
            employeeId: activeTimer.employeeId,
            start: start.toISOString(),
            end: now.toISOString(),
            durationMinutes: minutes
        });

        activeTimer = null;
        saveAll();
        renderTodayLogs();

        if (statusEl) statusEl.textContent = "Ingen aktiv timer";
    });
}



/* ======================================================
   AFSNIT 11 – DAGENS LOGS
   ====================================================== */

function renderTodayLogs() {
    const table = document.getElementById("timeLogTable");
    if (!table) return;
    const tbody = table.querySelector("tbody");
    tbody.innerHTML = "";

    const todayStr = toDateString(new Date());
    const todaysLogs = logs.filter(l => l.date === todayStr);

    todaysLogs.forEach(l => {
        const tr = document.createElement("tr");

        const start = new Date(l.start);
        const end   = new Date(l.end);

        tr.innerHTML = `
            <td>${start.toLocaleTimeString(getLocaleForLang(currentLang), {hour:"2-digit", minute:"2-digit"})}</td>
            <td>${end.toLocaleTimeString(getLocaleForLang(currentLang), {hour:"2-digit", minute:"2-digit"})}</td>
            <td>${l.durationMinutes}</td>
            <td>${getCustomerName(l.customerId)}</td>
            <td>${getEmployeeName(l.employeeId)}</td>
        `;

        tbody.appendChild(tr);
    });
}



/* ======================================================
   AFSNIT 12 – PLANLÆGNING (OPRET PLAN)
   ====================================================== */

function setupPlanDurationInput() {
    const inp = document.getElementById("planDuration");
    if (!inp) return;
    inp.min = "0.5";
    inp.max = "8";
    inp.step = "0.5";
}

function initPlanning() {
    setupPlanDurationInput();

    const saveBtn = document.getElementById("savePlanBtn");
    if (!saveBtn) return;

    saveBtn.addEventListener("click", () => {
        const dateInput     = document.getElementById("planDate");
        const startInput    = document.getElementById("planStart");
        const durationInput = document.getElementById("planDuration");
        const customerSel   = document.getElementById("planCustomerSelect");
        const noteInput     = document.getElementById("planNote");

        const dateStr    = dateInput.value;
        const startTime  = startInput.value;
        const durationHr = parseFloat(durationInput.value.replace(",", "."));
        const customerId = customerSel.value;
        const employeeIds = getSelectedIdsFromChipList("planEmployeeList");
        const note       = noteInput.value.trim();

        if (!dateStr)  { alert("Vælg dato."); return; }
        if (!startTime){ alert("Vælg starttid."); return; }
        if (!customerId){ alert("Vælg kunde."); return; }
        if (isNaN(durationHr) || durationHr < 0.5 || durationHr > 8) {
            alert("Varigheden skal være 0,5–8 timer.");
            return;
        }

        const durationMinutes = Math.round(durationHr * 60);

        plans.push({
            id: uuid(),
            date: dateStr,
            startTime,
            durationMinutes,
            customerId,
            employeeIds,
            note
        });

        startInput.value = "";
        durationInput.value = "";
        noteInput.value = "";
        document
            .querySelectorAll("#planEmployeeList .chip.selected")
            .forEach(chip => chip.classList.remove("selected"));

        saveAll();

        selectedCalendarDate = dateStr;
        renderCalendar();
        renderDayDetails(dateStr);
    });
}



/* ======================================================
   AFSNIT 13 – KALENDER
   ====================================================== */

function renderCalendar() {
    const cellsContainer = document.getElementById("calendarCells");
    const monthLabel     = document.getElementById("calMonthLabel");
    const dateInput      = document.getElementById("planDate");

    if (!cellsContainer || !monthLabel) return;

    cellsContainer.innerHTML = "";

    const year  = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();

    const locale = getLocaleForLang(currentLang);
    monthLabel.textContent = calendarMonth.toLocaleDateString(locale, {
        month: "long",
        year: "numeric"
    });

    const firstOfMonth = new Date(year, month, 1);
    const lastOfMonth  = new Date(year, month + 1, 0);
    const daysInMonth  = lastOfMonth.getDate();

    const weekday = firstOfMonth.getDay();
    const mondayIndex = (weekday + 6) % 7;

    for (let i = 0; i < mondayIndex; i++) {
        const emptyCell = document.createElement("div");
        emptyCell.className = "calendar-cell calendar-day-empty";
        cellsContainer.appendChild(emptyCell);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${String(month+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
        const dayPlans = plans.filter(p => p.date === dateStr);
        const count = dayPlans.length;

        const cell = document.createElement("button");
        cell.type = "button";
        cell.className = "calendar-cell";

        if (count === 0) {
            cell.classList.add("calendar-day-empty");
        } else if (count <= 4) {
            cell.classList.add("calendar-day-medium");
        } else {
            cell.classList.add("calendar-day-busy");
        }

        if (selectedCalendarDate === dateStr) {
            cell.classList.add("selected");
        }

        cell.textContent = day;

        cell.addEventListener("click", () => {
            selectedCalendarDate = dateStr;
            if (dateInput) dateInput.value = dateStr;
            renderCalendar();
            renderDayDetails(dateStr);
        });

        cellsContainer.appendChild(cell);
    }
}

function renderDayDetails(dateStr) {
    const label = document.getElementById("selectedDayLabel");
    const list  = document.getElementById("dayPlanList");
    if (!label || !list) return;

    if (!dateStr) {
        label.textContent = t("plan_day_tasks");
        list.innerHTML = "";
        return;
    }

    const locale = getLocaleForLang(currentLang);
    const d = parseDateString(dateStr);

    label.textContent = d.toLocaleDateString(locale, {
        weekday: "short",
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
    });

    const dayPlans = plans.filter(p => p.date === dateStr);
    list.innerHTML = "";

    if (!dayPlans.length) {
        const li = document.createElement("li");
        li.textContent = "Ingen planer for denne dag";
        list.appendChild(li);
        return;
    }

    dayPlans.forEach(p => {
        const li = document.createElement("li");
        const durHr = p.durationMinutes / 60;
        const durText = String(durHr).replace(".", ",");

        li.innerHTML = `
            <strong>${p.startTime}</strong> – ${durText}t<br>
            Kunde: ${getCustomerName(p.customerId)}<br>
            Note: ${p.note || ""}
        `;

        list.appendChild(li);
    });
}

function initCalendarMonthSwitch() {
    const prevBtn = document.getElementById("calPrevMonth");
    const nextBtn = document.getElementById("calNextMonth");

    if (prevBtn) {
        prevBtn.addEventListener("click", () => {
            calendarMonth.setMonth(calendarMonth.getMonth() - 1);
            renderCalendar();
            renderDayDetails(selectedCalendarDate);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener("click", () => {
            calendarMonth.setMonth(calendarMonth.getMonth() + 1);
            renderCalendar();
            renderDayDetails(selectedCalendarDate);
        });
    }
}



/* ======================================================
   AFSNIT 14 – RAPPORTER
   ====================================================== */

function initReports() {
    const customerSel = document.getElementById("reportCustomerSelect");
    const employeeSel = document.getElementById("reportEmployeeSelect");
    if (!customerSel || !employeeSel) return;

    function renderReport() {
        const out = document.getElementById("reportOutput");
        if (!out) return;

        const custId = customerSel.value;
        const empId  = employeeSel.value;

        let filtered = logs.slice();
        if (custId) filtered = filtered.filter(l => l.customerId === custId);
        if (empId)  filtered = filtered.filter(l => l.employeeId === empId);

        if (!filtered.length) {
            out.textContent = "Ingen data til rapport.";
            return;
        }

        const totalMinutes = filtered.reduce((sum, l) => sum + (l.durationMinutes || 0), 0);

        const perDay = {};
        filtered.forEach(l => {
            perDay[l.date] = (perDay[l.date] || 0) + (l.durationMinutes || 0);
        });

        let html = "";
        html += `<p><strong>Poster:</strong> ${filtered.length}</p>`;
        html += `<p><strong>Samlet tid:</strong> ${totalMinutes} min</p>`;
        html += "<h4>Dage</h4>";
        html += "<ul>";
        Object.keys(perDay).sort().forEach(d => {
            html += `<li>${d}: ${perDay[d]} min</li>`;
        });
        html += "</ul>";

        out.innerHTML = html;
    }

    customerSel.addEventListener("change", renderReport);
    employeeSel.addEventListener("change", renderReport);
}



/* ======================================================
   AFSNIT 15 – INIT-KÆDE (STARTER HELE APPEN)
   ====================================================== */

function initApp() {
    loadAll();
    initLanguage();
    initThemeToggle();
    initNavigation();

    refreshCustomerSelects();
    renderCustomerTable();
    initCustomers();

    renderEmployeeTable();
    refreshEmployeeSelects();
    renderEmployeeChips();
    initEmployees();

    initQuickTimer();
    initDetailedTimer();
    renderTodayLogs();

    initPlanning();
    initCalendarMonthSwitch();
    renderCalendar();
    renderDayDetails(selectedCalendarDate);

    initReports();
}

document.addEventListener("DOMContentLoaded", initApp);
