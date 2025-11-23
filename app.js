/* ======================================================
   AFSNIT 01 – GLOBAL STATE & DATA
   ====================================================== */

let customers = [];
let employees = [];
let timeLogs = [];
let plannedTasks = [];

let activeTimer = null;
let quickActiveTimer = null;
let quickTimerInterval = null;

let currentCalendarMonth = new Date();
let selectedCalendarDate = null;

let currentLang = "da";
let quickMode = "day"; // "day" eller "total"


/* ======================================================
   AFSNIT 02 – I18N TEKSTER (4 SPROG)
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

        dashboard_title: "Tidsregistrering",
        quick_select_customer: "Vælg kunde",
        quick_select_employees: "Vælg medarbejdere",
        quick_time_label: "Vis tid for kunden:",
        quick_mode_today: "I dag",
        quick_mode_total: "Samlet tid",
        quick_hint: "Vælg kunde og medarbejdere og brug Start / Stop.",
        btn_start_timer: "Start",
        btn_stop_timer: "Stop",

        customers_title: "Kunder",
        customers_add: "Tilføj kunde",
        customers_list: "Kundeliste",
        customers_reset_title: "Nulstil tid for kunde",

        label_customer_name: "Navn",
        label_customer_phone: "Telefon",
        label_customer_email: "Email",
        label_customer_address: "Adresse",
        btn_save_customer: "Gem kunde",
        label_reset_customer: "Vælg kunde",
        btn_reset_customer_time: "Nulstil al tid",

        th_customer_name: "Navn",
        th_customer_phone: "Telefon",
        th_customer_email: "Email",
        th_customer_address: "Adresse",

        employees_title: "Medarbejdere",
        employees_add: "Tilføj medarbejder",
        employees_list: "Medarbejderliste",
        label_employee_name: "Navn",
        label_employee_email: "Email",
        label_employee_role: "Rolle",
        role_employee: "Medarbejder",
        role_admin: "Admin",
        btn_save_employee: "Gem medarbejder",
        th_employee_name: "Navn",
        th_employee_email: "Email",
        th_employee_role: "Rolle",

        time_title: "Tidsregistrering",
        time_start_stop: "Start / stop",
        label_timer_customer: "Kunde",
        label_timer_employee: "Medarbejder",
        timer_no_active: "Ingen aktiv timer",
        logs_today_title: "Dagens logs",
        th_log_start: "Start",
        th_log_end: "Slut",
        th_log_duration: "Minutter",
        th_log_customer: "Kunde",
        th_log_employee: "Medarbejder",

        schedule_title: "Plan & kalender",
        schedule_plan_job: "Planlæg opgave",
        label_plan_date: "Dato",
        label_plan_start: "Starttid",
        label_plan_duration: "Varighed (minutter)",
        label_plan_customer: "Kunde",
        label_plan_employee: "Medarbejdere",
        label_plan_note: "Note",
        btn_save_plan: "Gem opgave",
        schedule_selected_day: "Klik på en dag for at se opgaver.",

        weekday_mon: "Man",
        weekday_tue: "Tir",
        weekday_wed: "Ons",
        weekday_thu: "Tor",
        weekday_fri: "Fre",
        weekday_sat: "Lør",
        weekday_sun: "Søn",

        logs_page_title: "Logs",
        logs_page_desc: "Senere kan du få fuldt overblik her.",

        reports_title: "Rapporter",
        reports_filter_title: "Filtre",
        label_report_date_from: "Fra dato",
        label_report_date_to: "Til dato",
        label_report_customer: "Kunde",
        label_report_employee: "Medarbejder",
        btn_run_report: "Kør rapport",
        reports_result_title: "Resultat",
        th_report_date: "Dato",
        th_report_start: "Start",
        th_report_end: "Slut",
        th_report_duration: "Minutter",
        th_report_customer: "Kunde",
        th_report_employee: "Medarbejder",

        settings_title: "Indstillinger",
        settings_lang_info: "Appen husker automatisk dit sprog og tema."
    },

    en: {
        app_title: "GreenTime Pro",

        menu_dashboard: "Time tracking",
        menu_customers: "Customers",
        menu_employees: "Employees",
        menu_time_tracking: "Detailed time",
        menu_schedule: "Schedule & calendar",
        menu_logs: "Logs",
        menu_reports: "Reports",
        menu_settings: "Settings",

        dashboard_title: "Time tracking",
        quick_select_customer: "Select customer",
        quick_select_employees: "Select employees",
        quick_time_label: "Show time for customer:",
        quick_mode_today: "Today",
        quick_mode_total: "Total time",
        quick_hint: "Select customer and employees, then use Start / Stop.",
        btn_start_timer: "Start",
        btn_stop_timer: "Stop",

        customers_title: "Customers",
        customers_add: "Add customer",
        customers_list: "Customer list",
        customers_reset_title: "Reset time for customer",

        label_customer_name: "Name",
        label_customer_phone: "Phone",
        label_customer_email: "Email",
        label_customer_address: "Address",
        btn_save_customer: "Save customer",
        label_reset_customer: "Select customer",
        btn_reset_customer_time: "Reset all time",

        th_customer_name: "Name",
        th_customer_phone: "Phone",
        th_customer_email: "Email",
        th_customer_address: "Address",

        employees_title: "Employees",
        employees_add: "Add employee",
        employees_list: "Employee list",
        label_employee_name: "Name",
        label_employee_email: "Email",
        label_employee_role: "Role",
        role_employee: "Employee",
        role_admin: "Admin",
        btn_save_employee: "Save employee",
        th_employee_name: "Name",
        th_employee_email: "Email",
        th_employee_role: "Role",

        time_title: "Time tracking",
        time_start_stop: "Start / stop",
        label_timer_customer: "Customer",
        label_timer_employee: "Employee",
        timer_no_active: "No active timer",
        logs_today_title: "Logs today",
        th_log_start: "Start",
        th_log_end: "End",
        th_log_duration: "Minutes",
        th_log_customer: "Customer",
        th_log_employee: "Employee",

        schedule_title: "Schedule & calendar",
        schedule_plan_job: "Plan task",
        label_plan_date: "Date",
        label_plan_start: "Start time",
        label_plan_duration: "Duration (minutes)",
        label_plan_customer: "Customer",
        label_plan_employee: "Employees",
        label_plan_note: "Note",
        btn_save_plan: "Save task",
        schedule_selected_day: "Click a day to see tasks.",

        weekday_mon: "Mon",
        weekday_tue: "Tue",
        weekday_wed: "Wed",
        weekday_thu: "Thu",
        weekday_fri: "Fri",
        weekday_sat: "Sat",
        weekday_sun: "Sun",

        logs_page_title: "Logs",
        logs_page_desc: "Later you can see full overview here.",

        reports_title: "Reports",
        reports_filter_title: "Filters",
        label_report_date_from: "From date",
        label_report_date_to: "To date",
        label_report_customer: "Customer",
        label_report_employee: "Employee",
        btn_run_report: "Run report",
        reports_result_title: "Result",
        th_report_date: "Date",
        th_report_start: "Start",
        th_report_end: "End",
        th_report_duration: "Minutes",
        th_report_customer: "Customer",
        th_report_employee: "Employee",

        settings_title: "Settings",
        settings_lang_info: "The app remembers your language and theme."
    },

    de: {
        app_title: "GreenTime Pro",

        menu_dashboard: "Zeiterfassung",
        menu_customers: "Kunden",
        menu_employees: "Mitarbeiter",
        menu_time_tracking: "Details Zeiten",
        menu_schedule: "Plan & Kalender",
        menu_logs: "Protokolle",
        menu_reports: "Berichte",
        menu_settings: "Einstellungen",

        dashboard_title: "Zeiterfassung",
        quick_select_customer: "Kunde wählen",
        quick_select_employees: "Mitarbeiter wählen",
        quick_time_label: "Zeit anzeigen für Kunde:",
        quick_mode_today: "Heute",
        quick_mode_total: "Gesamtzeit",
        quick_hint: "Kunde und Mitarbeiter wählen, dann Start / Stop.",
        btn_start_timer: "Start",
        btn_stop_timer: "Stopp",

        customers_title: "Kunden",
        customers_add: "Kunde hinzufügen",
        customers_list: "Kundenliste",
        customers_reset_title: "Zeit für Kunde zurücksetzen",

        label_customer_name: "Name",
        label_customer_phone: "Telefon",
        label_customer_email: "E-Mail",
        label_customer_address: "Adresse",
        btn_save_customer: "Kunde speichern",
        label_reset_customer: "Kunde wählen",
        btn_reset_customer_time: "Alle Zeiten löschen",

        th_customer_name: "Name",
        th_customer_phone: "Telefon",
        th_customer_email: "E-Mail",
        th_customer_address: "Adresse",

        employees_title: "Mitarbeiter",
        employees_add: "Mitarbeiter hinzufügen",
        employees_list: "Mitarbeiterliste",
        label_employee_name: "Name",
        label_employee_email: "E-Mail",
        label_employee_role: "Rolle",
        role_employee: "Mitarbeiter",
        role_admin: "Admin",
        btn_save_employee: "Mitarbeiter speichern",
        th_employee_name: "Name",
        th_employee_email: "E-Mail",
        th_employee_role: "Rolle",

        time_title: "Zeiterfassung",
        time_start_stop: "Start / Stopp",
        label_timer_customer: "Kunde",
        label_timer_employee: "Mitarbeiter",
        timer_no_active: "Keine aktive Zeitmessung",

        logs_today_title: "Protokolle heute",
        th_log_start: "Start",
        th_log_end: "Ende",
        th_log_duration: "Minuten",
        th_log_customer: "Kunde",
        th_log_employee: "Mitarbeiter",

        schedule_title: "Plan & Kalender",
        schedule_plan_job: "Aufgabe planen",
        label_plan_date: "Datum",
        label_plan_start: "Startzeit",
        label_plan_duration: "Dauer (Minuten)",
        label_plan_customer: "Kunde",
        label_plan_employee: "Mitarbeiter",
        label_plan_note: "Notiz",
        btn_save_plan: "Aufgabe speichern",
        schedule_selected_day: "Tag anklicken, um Aufgaben zu sehen.",

        weekday_mon: "Mo",
        weekday_tue: "Di",
        weekday_wed: "Mi",
        weekday_thu: "Do",
        weekday_fri: "Fr",
        weekday_sat: "Sa",
        weekday_sun: "So",

        logs_page_title: "Protokolle",
        logs_page_desc: "Später erscheint hier eine Übersicht.",

        reports_title: "Berichte",
        reports_filter_title: "Filter",
        label_report_date_from: "Von Datum",
        label_report_date_to: "Bis Datum",
        label_report_customer: "Kunde",
        label_report_employee: "Mitarbeiter",
        btn_run_report: "Bericht ausführen",
        reports_result_title: "Ergebnis",
        th_report_date: "Datum",
        th_report_start: "Start",
        th_report_end: "Ende",
        th_report_duration: "Minuten",
        th_report_customer: "Kunde",
        th_report_employee: "Mitarbeiter",

        settings_title: "Einstellungen",
        settings_lang_info: "Sprache und Thema werden gespeichert."
    },

    lt: {
        app_title: "GreenTime Pro",

        menu_dashboard: "Laiko sekimas",
        menu_customers: "Klientai",
        menu_employees: "Darbuotojai",
        menu_time_tracking: "Detalus laikas",
        menu_schedule: "Grafikas ir kalendorius",
        menu_logs: "Žurnalai",
        menu_reports: "Ataskaitos",
        menu_settings: "Nustatymai",

        dashboard_title: "Laiko sekimas",
        quick_select_customer: "Pasirinkite klientą",
        quick_select_employees: "Pasirinkite darbuotojus",
        quick_time_label: "Rodyti laiką klientui:",
        quick_mode_today: "Šiandien",
        quick_mode_total: "Bendras laikas",
        quick_hint: "Pasirinkite klientą ir darbuotojus, tada spauskite Start / Stop.",
        btn_start_timer: "Start",
        btn_stop_timer: "Stop",

        customers_title: "Klientai",
        customers_add: "Pridėti klientą",
        customers_list: "Klientų sąrašas",
        customers_reset_title: "Nustatyti laiką iš naujo klientui",

        label_customer_name: "Vardas",
        label_customer_phone: "Telefonas",
        label_customer_email: "El. paštas",
        label_customer_address: "Adresas",
        btn_save_customer: "Išsaugoti klientą",
        label_reset_customer: "Pasirinkite klientą",
        btn_reset_customer_time: "Ištrinti visą laiką",

        th_customer_name: "Vardas",
        th_customer_phone: "Telefonas",
        th_customer_email: "El. paštas",
        th_customer_address: "Adresas",

        employees_title: "Darbuotojai",
        employees_add: "Pridėti darbuotoją",
        employees_list: "Darbuotojų sąrašas",
        label_employee_name: "Vardas",
        label_employee_email: "El. paštas",
        label_employee_role: "Rolė",
        role_employee: "Darbuotojas",
        role_admin: "Adminas",
        btn_save_employee: "Išsaugoti darbuotoją",
        th_employee_name: "Vardas",
        th_employee_email: "El. paštas",
        th_employee_role: "Rolė",

        time_title: "Laiko sekimas",
        time_start_stop: "Start / Stop",
        label_timer_customer: "Klientas",
        label_timer_employee: "Darbuotojas",
        timer_no_active: "Nėra aktyvaus laikmačio",

        logs_today_title: "Šiandienos žurnalai",
        th_log_start: "Pradžia",
        th_log_end: "Pabaiga",
        th_log_duration: "Minutės",
        th_log_customer: "Klientas",
        th_log_employee: "Darbuotojas",

        schedule_title: "Grafikas ir kalendorius",
        schedule_plan_job: "Suplanuoti užduotį",
        label_plan_date: "Data",
        label_plan_start: "Pradžios laikas",
        label_plan_duration: "Trukmė (minutėmis)",
        label_plan_customer: "Klientas",
        label_plan_employee: "Darbuotojai",
        label_plan_note: "Pastaba",
        btn_save_plan: "Išsaugoti užduotį",
        schedule_selected_day: "Paspauskite dieną, kad pamatytumėte užduotis.",

        weekday_mon: "Pr",
        weekday_tue: "An",
        weekday_wed: "Tr",
        weekday_thu: "Kt",
        weekday_fri: "Pn",
        weekday_sat: "Št",
        weekday_sun: "Sk",

        logs_page_title: "Žurnalai",
        logs_page_desc: "Vėliau čia matysite pilną apžvalgą.",

        reports_title: "Ataskaitos",
        reports_filter_title: "Filtrai",
        label_report_date_from: "Nuo datos",
        label_report_date_to: "Iki datos",
        label_report_customer: "Klientas",
        label_report_employee: "Darbuotojas",
        btn_run_report: "Vykdyti ataskaitą",
        reports_result_title: "Rezultatas",
        th_report_date: "Data",
        th_report_start: "Pradžia",
        th_report_end: "Pabaiga",
        th_report_duration: "Minutės",
        th_report_customer: "Klientas",
        th_report_employee: "Darbuotojas",

        settings_title: "Nustatymai",
        settings_lang_info: "Programa prisimena kalbą ir temą."
    }
};


/* ======================================================
   AFSNIT 03 – LOCALSTORAGE LOAD / SAVE
   ====================================================== */

function loadData() {
    customers = JSON.parse(localStorage.getItem("gtp_customers") || "[]");
    employees = JSON.parse(localStorage.getItem("gtp_employees") || "[]");
    timeLogs = JSON.parse(localStorage.getItem("gtp_logs") || "[]");
    plannedTasks = JSON.parse(localStorage.getItem("gtp_plans") || "[]");
    activeTimer = JSON.parse(localStorage.getItem("gtp_active") || "null");
    currentLang = localStorage.getItem("gtp_lang") || "da";

    if (!Array.isArray(customers)) customers = [];
    if (!Array.isArray(employees)) employees = [];
    if (!Array.isArray(timeLogs)) timeLogs = [];
    if (!Array.isArray(plannedTasks)) plannedTasks = [];
}

function saveData() {
    localStorage.setItem("gtp_customers", JSON.stringify(customers));
    localStorage.setItem("gtp_employees", JSON.stringify(employees));
    localStorage.setItem("gtp_logs", JSON.stringify(timeLogs));
    localStorage.setItem("gtp_plans", JSON.stringify(plannedTasks));
    localStorage.setItem("gtp_active", JSON.stringify(activeTimer));
}


/* ======================================================
   AFSNIT 04 – SPROG FUNKTIONER
   ====================================================== */

function applyTranslations() {
    const dict = translations[currentLang];

    document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.getAttribute("data-i18n");
        if (dict[key]) el.textContent = dict[key];
    });

    document.title = dict.app_title;
}

function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem("gtp_lang", lang);

    document.querySelectorAll(".lang-btn").forEach(btn => {
        btn.classList.toggle("active", btn.dataset.lang === lang);
    });

    applyTranslations();
    renderTimerStatus();
    renderDayPlans();
}

function initLanguageSwitcher() {
    document.querySelectorAll(".lang-btn").forEach(btn => {
        btn.addEventListener("click", () => setLanguage(btn.dataset.lang));
    });
}


/* ======================================================
   AFSNIT 05 – NAVIGATION & MOBILMENU
   ====================================================== */

function showPage(pageId) {
    document.querySelectorAll(".page").forEach(p => p.classList.remove("visible"));
    document.getElementById(pageId).classList.add("visible");

    document.querySelectorAll(".nav li").forEach(li => li.classList.remove("active"));
    document.querySelector(`.nav li[data-page="${pageId}"]`).classList.add("active");
}

function initNavigation() {
    document.querySelectorAll(".nav li").forEach(li => {
        li.addEventListener("click", () => showPage(li.dataset.page));
    });
}

function initMobileMenu() {
    const sidebar = document.querySelector(".sidebar");
    const toggle = document.getElementById("menuToggle");

    toggle.addEventListener("click", () => {
        sidebar.classList.toggle("open");
    });
}


/* ======================================================
   AFSNIT 06 – TEMA (LYS / MØRK)
   ====================================================== */

function initThemeToggle() {
    const toggle = document.getElementById("themeToggle");
    const saved = localStorage.getItem("gtp_theme") || "dark";

    document.documentElement.setAttribute("data-theme", saved);
    toggle.textContent = saved === "dark" ? "☀️" : "🌙";

    toggle.addEventListener("click", () => {
        const now = document.documentElement.getAttribute("data-theme");
        const next = now === "dark" ? "light" : "dark";
        document.documentElement.setAttribute("data-theme", next);
        toggle.textContent = next === "dark" ? "☀️" : "🌙";
        localStorage.setItem("gtp_theme", next);
    });
}


/* ======================================================
   AFSNIT 07 – KUNDER
   ====================================================== */

function renderCustomers() {
    const tbody = document.querySelector("#customerTable tbody");
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

    populateCustomerSelects();
}

function populateCustomerSelects() {
    const ids = [
        "quickCustomerSelect",
        "resetCustomerSelect",
        "timerCustomerSelect",
        "planCustomerSelect",
        "reportCustomerSelect"
    ];

    ids.forEach(id => {
        const sel = document.getElementById(id);
        if (!sel) return;
        sel.innerHTML = `<option value=""></option>`;
        customers.forEach(c => {
            const opt = document.createElement("option");
            opt.value = c.id;
            opt.textContent = c.name;
            sel.appendChild(opt);
        });
    });
}

function initCustomerSave() {
    document.getElementById("saveCustomerBtn").addEventListener("click", () => {
        const name = custName.value.trim();
        if (!name) return alert("Skriv et navn");

        customers.push({
            id: Date.now().toString(),
            name,
            phone: custPhone.value.trim(),
            email: custEmail.value.trim(),
            address: custAddress.value.trim()
        });

        saveData();
        renderCustomers();

        custName.value = custPhone.value = custEmail.value = custAddress.value = "";
    });
}

function initCustomerReset() {
    document.getElementById("resetCustomerTimeBtn").addEventListener("click", () => {
        const id = resetCustomerSelect.value;
        if (!id) return alert("Vælg en kunde");

        const before = timeLogs.length;
        timeLogs = timeLogs.filter(l => l.customerId !== id);
        const removed = before - timeLogs.length;

        saveData();
        renderLogs();
        document.getElementById("resetCustomerInfo").textContent =
            `Fjernede ${removed} log-poster.`;
    });
}


/* ======================================================
   AFSNIT 08 – MEDARBEJDERE
   ====================================================== */

function renderEmployees() {
    const tbody = document.querySelector("#employeeTable tbody");
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

    populateEmployeeSelects();
}

function populateEmployeeSelects() {
    const timerSel = document.getElementById("timerEmployeeSelect");
    if (timerSel) {
        timerSel.innerHTML = "";
        employees.forEach(e => {
            const opt = document.createElement("option");
            opt.value = e.id;
            opt.textContent = e.name;
            timerSel.appendChild(opt);
        });
    }

    renderQuickEmployeeList();
    renderPlanEmployeeList();
}

function initEmployeeSave() {
    document.getElementById("saveEmployeeBtn").addEventListener("click", () => {
        const name = empName.value.trim();
        if (!name) return alert("Skriv et navn");

        employees.push({
            id: Date.now().toString(),
            name,
            email: empEmail.value.trim(),
            role: empRole.value
        });

        saveData();
        renderEmployees();

        empName.value = empEmail.value = "";
        empRole.value = "employee";
    });
}


/* ======================================================
   AFSNIT 09 – QUICK TIMER (FORSIDE)
   ====================================================== */

function renderQuickEmployeeList() {
    const container = document.getElementById("quickEmployeeList");
    if (!container) return;

    container.innerHTML = "";
    employees.forEach(e => {
        const label = document.createElement("label");
        label.className = "chip-check";
        label.innerHTML = `
            <input type="checkbox" value="${e.id}">
            <span>${e.name}</span>
        `;
        container.appendChild(label);
    });
}

function getSelectedQuickEmployees() {
    return Array.from(
        document.querySelectorAll("#quickEmployeeList input:checked")
    ).map(cb => cb.value);
}

function getCustomerMinutes(customerId, mode) {
    const today = new Date().toISOString().slice(0, 10);
    let total = 0;

    timeLogs.forEach(l => {
        if (l.customerId !== customerId) return;
        if (mode === "day" && l.startTime.slice(0, 10) !== today) return;
        total += l.duration;
    });

    return total;
}

function formatSeconds(sec) {
    sec = Math.max(0, Math.floor(sec));
    const h = String(Math.floor(sec / 3600)).padStart(2, "0");
    const m = String(Math.floor((sec % 3600) / 60)).padStart(2, "0");
    const s = String(sec % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
}

function updateQuickTimerDisplay() {
    const disp = document.getElementById("quickTimerDisplay");
    const cust = quickCustomerSelect.value;

    if (!cust) {
        disp.textContent = "00:00:00";
        return;
    }

    if (quickActiveTimer && quickActiveTimer.customerId === cust) {
        const sec = (Date.now() - new Date(quickActiveTimer.startTime).getTime()) / 1000;
        disp.textContent = formatSeconds(sec);
        return;
    }

    const minutes = getCustomerMinutes(cust, quickMode);
    disp.textContent = formatSeconds(minutes * 60);
}

function initQuickTimerControls() {
    quickStartBtn.addEventListener("click", () => {
        if (quickActiveTimer) return alert("Quick timer kører allerede.");

        const cust = quickCustomerSelect.value;
        const empIds = getSelectedQuickEmployees();

        if (!cust) return alert("Vælg kunde");
        if (empIds.length === 0) return alert("Vælg mindst én medarbejder");

        quickActiveTimer = {
            customerId: cust,
            employeeIds: empIds,
            startTime: new Date().toISOString()
        };

        quickTimerInterval = setInterval(updateQuickTimerDisplay, 1000);
        updateQuickTimerDisplay();
    });

    quickStopBtn.addEventListener("click", () => {
        if (!quickActiveTimer) return;

        const end = new Date();
        const start = new Date(quickActiveTimer.startTime);
        const minutes = Math.max(1, Math.round((end - start) / 60000));

        quickActiveTimer.employeeIds.forEach(id => {
            const emp = employees.find(e => e.id === id);
            timeLogs.push({
                customerId: quickActiveTimer.customerId,
                employeeId: id,
                employee: emp ? emp.name : "?",
                startTime: quickActiveTimer.startTime,
                endTime: end.toISOString(),
                duration: minutes
            });
        });

        quickActiveTimer = null;
        clearInterval(quickTimerInterval);

        saveData();
        renderLogs();
        updateQuickTimerDisplay();
    });

    quickModeDay.addEventListener("change", () => {
        quickMode = "day";
        updateQuickTimerDisplay();
    });
    quickModeTotal.addEventListener("change", () => {
        quickMode = "total";
        updateQuickTimerDisplay();
    });

    quickCustomerSelect.addEventListener("change", updateQuickTimerDisplay);
}

/* ======================================================
   AFSNIT 10 – DETALJERET TIMER-SIDE
   ====================================================== */

function renderTimerStatus() {
    const el = document.getElementById("timerStatus");
    if (!activeTimer) {
        el.textContent = translations[currentLang].timer_no_active;
        stopTimerBtn.disabled = true;
        return;
    }

    const cust = customers.find(c => c.id === activeTimer.customerId);
    const emp = employees.find(e => e.id === activeTimer.employeeId);

    el.textContent = `Kører: ${cust?.name} – ${emp?.name}`;
    stopTimerBtn.disabled = false;
}

function initTimerControls() {
    startTimerBtn.addEventListener("click", () => {
        if (activeTimer) return alert("Timer kører allerede.");

        const cust = timerCustomerSelect.value;
        const emp = timerEmployeeSelect.value;

        if (!cust || !emp) return alert("Vælg kunde og medarbejder.");

        activeTimer = {
            customerId: cust,
            employeeId: emp,
            startTime: new Date().toISOString()
        };

        saveData();
        renderTimerStatus();
    });

    stopTimerBtn.addEventListener("click", () => {
        if (!activeTimer) return;

        const end = new Date();
        const start = new Date(activeTimer.startTime);

        const minutes = Math.max(1, Math.round((end - start) / 60000));
        const emp = employees.find(e => e.id === activeTimer.employeeId);

        timeLogs.push({
            customerId: activeTimer.customerId,
            employeeId: activeTimer.employeeId,
            employee: emp?.name || "?",
            startTime: activeTimer.startTime,
            endTime: end.toISOString(),
            duration: minutes
        });

        activeTimer = null;
        saveData();

        renderTimerStatus();
        renderLogs();
    });
}


/* ======================================================
   AFSNIT 11 – LOG OVERSIGT
   ====================================================== */

function renderLogs() {
    const tbody = document.querySelector("#timeLogTable tbody");
    if (!tbody) return;

    tbody.innerHTML = "";
    const today = new Date().toISOString().slice(0, 10);

    const todayLogs = timeLogs.filter(l => l.startTime.slice(0, 10) === today);

    todayLogs.forEach(l => {
        const cust = customers.find(c => c.id === l.customerId);

        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${new Date(l.startTime).toLocaleTimeString()}</td>
            <td>${new Date(l.endTime).toLocaleTimeString()}</td>
            <td>${l.duration}</td>
            <td>${cust?.name || "?"}</td>
            <td>${l.employee}</td>
        `;
        tbody.appendChild(tr);
    });
}


/* ======================================================
   AFSNIT 12 – KALENDER RENDERING
   ====================================================== */

function dateToYMD(d) {
    return d.toISOString().slice(0, 10);
}

function renderCalendar() {
    const cells = document.getElementById("calendarCells");
    const label = document.getElementById("calMonthLabel");

    cells.innerHTML = "";

    const y = currentCalendarMonth.getFullYear();
    const m = currentCalendarMonth.getMonth();

    label.textContent = currentCalendarMonth.toLocaleDateString("da-DK", {
        month: "long",
        year: "numeric"
    });

    const first = new Date(y, m, 1);
    const days = new Date(y, m + 1, 0).getDate();
    const empty = (first.getDay() + 6) % 7;

    for (let i = 0; i < empty; i++) {
        const div = document.createElement("div");
        div.className = "calendar-cell empty";
        cells.appendChild(div);
    }

    for (let d = 1; d <= days; d++) {
        const date = new Date(y, m, d);
        const dateStr = dateToYMD(date);

        const cell = document.createElement("div");
        cell.className = "calendar-cell";
        cell.dataset.date = dateStr;

        if (selectedCalendarDate === dateStr) cell.classList.add("selected");

        cell.innerHTML = `<div class="date-number">${d}</div>`;

        cell.addEventListener("click", () => {
            selectedCalendarDate = dateStr;
            renderCalendar();
            renderDayPlans();
        });

        cells.appendChild(cell);
    }
}


/* ======================================================
   AFSNIT 13 – PLANLAGTE OPGAVER (MULTI-MEDARBEJDER)
   ====================================================== */

function renderPlanEmployeeList() {
    const box = document.getElementById("planEmployeeList");
    if (!box) return;

    box.innerHTML = "";

    employees.forEach(e => {
        const label = document.createElement("label");
        label.className = "chip-check";
        label.innerHTML = `
            <input type="checkbox" value="${e.id}">
            <span>${e.name}</span>
        `;
        box.appendChild(label);
    });
}

function renderDayPlans() {
    const list = document.getElementById("dayPlanList");
    list.innerHTML = "";

    if (!selectedCalendarDate) return;

    const jobs = plannedTasks.filter(j => j.date === selectedCalendarDate);

    if (jobs.length === 0) {
        list.innerHTML = "<li>Ingen opgaver</li>";
        return;
    }

    jobs.forEach(j => {
        const cust = customers.find(c => c.id === j.customerId);

        const li = document.createElement("li");
        li.textContent = `${j.startTime} – ${cust?.name || "?"} – ${j.employeeNames.join(", ")} (${j.durationMinutes} min)`;

        list.appendChild(li);
    });
}

function initCalendarControls() {
    prevMonthBtn.addEventListener("click", () => {
        currentCalendarMonth.setMonth(currentCalendarMonth.getMonth() - 1);
        renderCalendar();
    });

    nextMonthBtn.addEventListener("click", () => {
        currentCalendarMonth.setMonth(currentCalendarMonth.getMonth() + 1);
        renderCalendar();
    });

    savePlanBtn.addEventListener("click", () => {
        const date = planDate.value;
        if (!date) return alert("Vælg mindst dato");

        const start = planStart.value;
        const duration = planDuration.value;
        const cust = planCustomerSelect.value;
        const note = planNote.value;

        const empIds = Array.from(
            document.querySelectorAll("#planEmployeeList input:checked")
        ).map(cb => cb.value);

        plannedTasks.push({
            id: Date.now().toString(),
            date,
            startTime: start,
            durationMinutes: Number(duration),
            customerId: cust,
            employeeIds: empIds,
            employeeNames: empIds.map(id => {
                const f = employees.find(e => e.id === id);
                return f ? f.name : "?";
            }),
            note
        });

        saveData();
        renderCalendar();
        renderDayPlans();
    });
}


/* ======================================================
   AFSNIT 14 – RAPPORT GENERERING
   ====================================================== */

function initReportControls() {
    runReportBtn.addEventListener("click", () => {
        const tbody = document.querySelector("#reportTable tbody");
        const summary = document.getElementById("reportSummary");

        tbody.innerHTML = "";

        let data = [...timeLogs];

        const from = reportDateFrom.value;
        const to = reportDateTo.value;
        const customerId = reportCustomerSelect.value;
        const employee = reportEmployeeSelect.value;

        if (from) data = data.filter(l => l.startTime.slice(0, 10) >= from);
        if (to) data = data.filter(l => l.startTime.slice(0, 10) <= to);
        if (customerId) data = data.filter(l => l.customerId === customerId);
        if (employee) data = data.filter(l => l.employee === employee);

        let total = 0;

        data.forEach(l => {
            const cust = customers.find(c => c.id === l.customerId);
            total += l.duration;

            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${l.startTime.slice(0, 10)}</td>
                <td>${new Date(l.startTime).toLocaleTimeString()}</td>
                <td>${new Date(l.endTime).toLocaleTimeString()}</td>
                <td>${l.duration}</td>
                <td>${cust?.name}</td>
                <td>${l.employee}</td>
            `;
            tbody.appendChild(tr);
        });

        summary.textContent = `Total tid: ${total} min`;
    });
}


/* ======================================================
   AFSNIT 15 – APP INITIALISERING
   ====================================================== */

document.addEventListener("DOMContentLoaded", () => {
    loadData();

    applyTranslations();
    initLanguageSwitcher();
    initNavigation();
    initMobileMenu();
    initThemeToggle();

    // Render data
    renderCustomerTable();
    renderEmployeeTable();
    renderLogs();
    renderCalendar();
    renderDayPlans();

    // Init funktioner
    initCustomerSave();
    initCustomerReset();
    initEmployeeSave();
    initTimerControls();
    initQuickTimerControls();
    initCalendarControls();
    initReportControls();

    updateQuickTimerDisplay();
});
