// ======================================================
// ================  GLOBAL DATA  ========================
// ======================================================

let customers = [];
let employees = [];
let timeLogs = [];
let plannedTasks = [];
let activeTimer = null;

let currentCalendarMonth = new Date();
let selectedCalendarDate = null;
let currentLang = "da";

// ======================================================
// ================  I18N TEKSTER  =======================
// ======================================================

const translations = {
    da: {
        app_title: "GreenTime Pro",
        menu_dashboard: "Dashboard",
        menu_customers: "Kunder",
        menu_employees: "Medarbejdere",
        menu_time_tracking: "Tidsregistrering",
        menu_schedule: "Plan & kalender",
        menu_logs: "Logs",
        menu_reports: "Rapporter",
        menu_settings: "Indstillinger",

        dashboard_title: "Overblik",
        card_customers: "Kunder",
        card_employees: "Medarbejdere",
        card_logs_today: "Logs i dag",

        customers_title: "Kunder",
        customers_add: "Tilføj kunde",
        customers_list: "Kundeliste",

        label_customer_name: "Navn",
        label_customer_phone: "Telefon",
        label_customer_email: "Email",
        label_customer_address: "Adresse",
        btn_save_customer: "Gem kunde",
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
        time_start_stop: "Start / stop timer",
        label_timer_customer: "Kunde",
        label_timer_employee: "Medarbejder",
        timer_no_active: "Ingen aktiv timer",
        btn_start_timer: "Start",
        btn_stop_timer: "Stop",
        logs_today_title: "Dagens logs",
        th_log_start: "Start",
        th_log_end: "Slut",
        th_log_duration: "Minutter",
        th_log_customer: "Kunde",
        th_log_employee: "Medarbejder",

        schedule_title: "Planlægning & kalender",
        schedule_plan_job: "Planlæg opgave",
        label_plan_date: "Dato",
        label_plan_start: "Starttid",
        label_plan_duration: "Varighed (min)",
        label_plan_customer: "Kunde",
        label_plan_employee: "Medarbejder",
        label_plan_note: "Note",
        btn_save_plan: "Gem planlagt opgave",
        schedule_selected_day: "Klik på en dag for at se opgaver.",
        weekday_mon: "Man",
        weekday_tue: "Tir",
        weekday_wed: "Ons",
        weekday_thu: "Tor",
        weekday_fri: "Fre",
        weekday_sat: "Lør",
        weekday_sun: "Søn",

        logs_page_title: "Logs (alle)",
        logs_page_desc: "Her kan du senere få et fuldt log-overblik. Brug indtil da dashboard og tidsregistrering.",

        reports_title: "Rapporter",
        reports_filter_title: "Filter",
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
        settings_lang_info: "Du kan skifte sprog via flagene i topbaren. Appen husker dit valg."
    },
    en: {
        app_title: "GreenTime Pro",
        menu_dashboard: "Dashboard",
        menu_customers: "Customers",
        menu_employees: "Employees",
        menu_time_tracking: "Time tracking",
        menu_schedule: "Schedule",
        menu_logs: "Logs",
        menu_reports: "Reports",
        menu_settings: "Settings",

        dashboard_title: "Overview",
        card_customers: "Customers",
        card_employees: "Employees",
        card_logs_today: "Logs today",

        customers_title: "Customers",
        customers_add: "Add customer",
        customers_list: "Customer list",

        label_customer_name: "Name",
        label_customer_phone: "Phone",
        label_customer_email: "Email",
        label_customer_address: "Address",
        btn_save_customer: "Save customer",
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
        time_start_stop: "Start / stop timer",
        label_timer_customer: "Customer",
        label_timer_employee: "Employee",
        timer_no_active: "No active timer",
        btn_start_timer: "Start",
        btn_stop_timer: "Stop",
        logs_today_title: "Logs today",
        th_log_start: "Start",
        th_log_end: "End",
        th_log_duration: "Minutes",
        th_log_customer: "Customer",
        th_log_employee: "Employee",

        schedule_title: "Schedule & calendar",
        schedule_plan_job: "Plan job",
        label_plan_date: "Date",
        label_plan_start: "Start time",
        label_plan_duration: "Duration (min)",
        label_plan_customer: "Customer",
        label_plan_employee: "Employee",
        label_plan_note: "Note",
        btn_save_plan: "Save planned job",
        schedule_selected_day: "Click a day to see planned jobs.",
        weekday_mon: "Mon",
        weekday_tue: "Tue",
        weekday_wed: "Wed",
        weekday_thu: "Thu",
        weekday_fri: "Fri",
        weekday_sat: "Sat",
        weekday_sun: "Sun",

        logs_page_title: "Logs (all)",
        logs_page_desc: "You can later add a full log overview here. For now, use the dashboard and time tracking.",

        reports_title: "Reports",
        reports_filter_title: "Filter",
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
        settings_lang_info: "You can change language using the flags in the top bar. The app remembers your choice."
    },
    lt: {
        app_title: "GreenTime Pro",
        menu_dashboard: "Suvestinė",
        menu_customers: "Klientai",
        menu_employees: "Darbuotojai",
        menu_time_tracking: "Laiko sekimas",
        menu_schedule: "Grafikas",
        menu_logs: "Įrašai",
        menu_reports: "Ataskaitos",
        menu_settings: "Nustatymai",

        dashboard_title: "Pagrindinis ekranas",
        card_customers: "Klientai",
        card_employees: "Darbuotojai",
        card_logs_today: "Šiandienos įrašai",

        customers_title: "Klientai",
        customers_add: "Pridėti klientą",
        customers_list: "Klientų sąrašas",

        label_customer_name: "Vardas",
        label_customer_phone: "Telefonas",
        label_customer_email: "El. paštas",
        label_customer_address: "Adresas",
        btn_save_customer: "Išsaugoti klientą",
        th_customer_name: "Vardas",
        th_customer_phone: "Telefonas",
        th_customer_email: "El. paštas",
        th_customer_address: "Adresas",

        employees_title: "Darbuotojai",
        employees_add: "Pridėti darbuotoją",
        employees_list: "Darbuotojų sąrašas",
        label_employee_name: "Vardas",
        label_employee_email: "El. paštas",
        label_employee_role: "Vaidmuo",
        role_employee: "Darbuotojas",
        role_admin: "Administratorius",
        btn_save_employee: "Išsaugoti darbuotoją",
        th_employee_name: "Vardas",
        th_employee_email: "El. paštas",
        th_employee_role: "Vaidmuo",

        time_title: "Laiko sekimas",
        time_start_stop: "Pradėti / sustabdyti laikmatį",
        label_timer_customer: "Klientas",
        label_timer_employee: "Darbuotojas",
        timer_no_active: "Aktyvaus laikmačio nėra",
        btn_start_timer: "Pradėti",
        btn_stop_timer: "Sustabdyti",
        logs_today_title: "Šiandienos įrašai",
        th_log_start: "Pradžia",
        th_log_end: "Pabaiga",
        th_log_duration: "Minutės",
        th_log_customer: "Klientas",
        th_log_employee: "Darbuotojas",

        schedule_title: "Grafikas ir kalendorius",
        schedule_plan_job: "Planuoti darbą",
        label_plan_date: "Data",
        label_plan_start: "Pradžios laikas",
        label_plan_duration: "Trukmė (min)",
        label_plan_customer: "Klientas",
        label_plan_employee: "Darbuotojas",
        label_plan_note: "Pastaba",
        btn_save_plan: "Išsaugoti suplanuotą darbą",
        schedule_selected_day: "Paspauskite dieną, kad pamatytumėte darbus.",
        weekday_mon: "Pr",
        weekday_tue: "An",
        weekday_wed: "Tr",
        weekday_thu: "Kt",
        weekday_fri: "Pn",
        weekday_sat: "Št",
        weekday_sun: "Sk",

        logs_page_title: "Įrašai (visi)",
        logs_page_desc: "Vėliau čia galima bus rodyti pilną įrašų sąrašą. Kol kas naudokite suvestinę ir laiko sekimą.",

        reports_title: "Ataskaitos",
        reports_filter_title: "Filtras",
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
        settings_lang_info: "Kalbą galite pakeisti naudodami vėliavėles viršuje. Programa prisimena jūsų pasirinkimą."
    },
    de: {
        app_title: "GreenTime Pro",
        menu_dashboard: "Übersicht",
        menu_customers: "Kunden",
        menu_employees: "Mitarbeiter",
        menu_time_tracking: "Zeiterfassung",
        menu_schedule: "Plan & Kalender",
        menu_logs: "Logs",
        menu_reports: "Berichte",
        menu_settings: "Einstellungen",

        dashboard_title: "Übersicht",
        card_customers: "Kunden",
        card_employees: "Mitarbeiter",
        card_logs_today: "Logs heute",

        customers_title: "Kunden",
        customers_add: "Kunden hinzufügen",
        customers_list: "Kundenliste",

        label_customer_name: "Name",
        label_customer_phone: "Telefon",
        label_customer_email: "E-Mail",
        label_customer_address: "Adresse",
        btn_save_customer: "Kunde speichern",
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
        time_start_stop: "Timer starten / stoppen",
        label_timer_customer: "Kunde",
        label_timer_employee: "Mitarbeiter",
        timer_no_active: "Kein aktiver Timer",
        btn_start_timer: "Start",
        btn_stop_timer: "Stop",
        logs_today_title: "Logs heute",
        th_log_start: "Start",
        th_log_end: "Ende",
        th_log_duration: "Minuten",
        th_log_customer: "Kunde",
        th_log_employee: "Mitarbeiter",

        schedule_title: "Planung & Kalender",
        schedule_plan_job: "Job planen",
        label_plan_date: "Datum",
        label_plan_start: "Startzeit",
        label_plan_duration: "Dauer (Minuten)",
        label_plan_customer: "Kunde",
        label_plan_employee: "Mitarbeiter",
        label_plan_note: "Notiz",
        btn_save_plan: "Geplanten Job speichern",
        schedule_selected_day: "Klicken Sie auf einen Tag, um geplante Jobs zu sehen.",
        weekday_mon: "Mo",
        weekday_tue: "Di",
        weekday_wed: "Mi",
        weekday_thu: "Do",
        weekday_fri: "Fr",
        weekday_sat: "Sa",
        weekday_sun: "So",

        logs_page_title: "Logs (alle)",
        logs_page_desc: "Später kann hier eine vollständige Log-Ansicht erscheinen. Verwenden Sie vorerst Übersicht und Zeiterfassung.",

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
        settings_lang_info: "Sie können die Sprache über die Flaggen in der oberen Leiste ändern. Die App merkt sich Ihre Auswahl."
    }
};

// ======================================================
// ================  STORAGE  ============================
// ======================================================

function loadData() {
    customers = JSON.parse(localStorage.getItem("gtp_customers") || "[]");
    employees = JSON.parse(localStorage.getItem("gtp_employees") || "[]");
    timeLogs = JSON.parse(localStorage.getItem("gtp_logs") || "[]");
    plannedTasks = JSON.parse(localStorage.getItem("gtp_plans") || "[]");
    activeTimer = JSON.parse(localStorage.getItem("gtp_active") || "null");

    currentLang = localStorage.getItem("gtp_lang") || "da";
}

function saveData() {
    localStorage.setItem("gtp_customers", JSON.stringify(customers));
    localStorage.setItem("gtp_employees", JSON.stringify(employees));
    localStorage.setItem("gtp_logs", JSON.stringify(timeLogs));
    localStorage.setItem("gtp_plans", JSON.stringify(plannedTasks));
    localStorage.setItem("gtp_active", JSON.stringify(activeTimer));
}

// ======================================================
// ================  I18N FUNKTIONER  ====================
// ======================================================

function applyTranslations() {
    const dict = translations[currentLang] || translations.da;
    document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.getAttribute("data-i18n");
        if (dict[key]) {
            el.textContent = dict[key];
        }
    });
    document.title = dict.app_title || "GreenTime Pro";

    // Opdatér role option labels i select (de ligger som textContent)
    const empRole = document.getElementById("empRole");
    if (empRole && empRole.options.length >= 2) {
        empRole.options[0].textContent = dict.role_employee || "Employee";
        empRole.options[1].textContent = dict.role_admin || "Admin";
    }
}

function setLanguage(lang) {
    if (!translations[lang]) lang = "da";
    currentLang = lang;
    localStorage.setItem("gtp_lang", lang);

    document.querySelectorAll(".lang-btn").forEach(btn => {
        btn.classList.toggle("active", btn.dataset.lang === lang);
    });

    applyTranslations();
}

function initLanguageSwitcher() {
    document.querySelectorAll(".lang-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            setLanguage(btn.dataset.lang);
        });
    });
}

// ======================================================
// ================  NAVIGATION  =========================
// ======================================================

function showPage(pageId) {
    document.querySelectorAll(".page").forEach(p => p.classList.remove("visible"));
    const page = document.getElementById(pageId);
    if (page) page.classList.add("visible");

    document.querySelectorAll(".sidebar li").forEach(li => li.classList.remove("active"));
    const navLi = document.querySelector(`.sidebar li[data-page="${pageId}"]`);
    if (navLi) navLi.classList.add("active");
}

function initNavigation() {
    document.querySelectorAll(".sidebar li").forEach(li => {
        li.addEventListener("click", () => {
            showPage(li.dataset.page);
        });
    });
}

// ======================================================
// ================  MOBILE MENU  ========================
// ======================================================

function initMobileMenu() {
    const menuToggle = document.getElementById("menuToggle");
    const sidebar = document.querySelector(".sidebar");

    // Åbn/luk ved klik
    menuToggle.addEventListener("click", (e) => {
        e.stopPropagation();
        sidebar.classList.toggle("open");
    });

    // Luk ved klik udenfor (desktop + mobil)
    document.addEventListener("click", (e) => {
        if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
            sidebar.classList.remove("open");
        }
    });

    document.addEventListener("touchstart", (e) => {
        if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
            sidebar.classList.remove("open");
        }
    });

    // Luk når man vælger menupunkt
    document.querySelectorAll(".sidebar li").forEach(li => {
        li.addEventListener("click", () => {
            sidebar.classList.remove("open");
        });
    });
}

// ======================================================
// ================  THEME TOGGLE  =======================
// ======================================================

function initThemeToggle() {
    const themeToggle = document.getElementById("themeToggle");
    const savedTheme = localStorage.getItem("gtp_theme") || "dark";
    document.documentElement.setAttribute("data-theme", savedTheme);
    themeToggle.textContent = savedTheme === "dark" ? "☀️" : "🌙";

    themeToggle.addEventListener("click", () => {
        const now = document.documentElement.getAttribute("data-theme");
        const next = now === "dark" ? "light" : "dark";
        document.documentElement.setAttribute("data-theme", next);
        themeToggle.textContent = next === "dark" ? "☀️" : "🌙";
        localStorage.setItem("gtp_theme", next);
    });
}

// ======================================================
// ================  CUSTOMERS  ==========================
// ======================================================

function renderCustomers() {
    const tbody = document.querySelector("#customerTable tbody");
    const timerSel = document.getElementById("timerCustomerSelect");
    const planSel = document.getElementById("planCustomerSelect");
    const repSel = document.getElementById("reportCustomerSelect");

    if (tbody) tbody.innerHTML = "";
    if (timerSel) timerSel.innerHTML = "";
    if (planSel) planSel.innerHTML = "";
    if (repSel) repSel.innerHTML = "";

    if (repSel) {
        const opt = document.createElement("option");
        opt.value = "";
        opt.textContent = "—";
        repSel.appendChild(opt);
    }

    customers.forEach(c => {
        if (tbody) {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${c.name}</td>
                <td>${c.phone || ""}</td>
                <td>${c.email || ""}</td>
                <td>${c.address || ""}</td>
            `;
            tbody.appendChild(tr);
        }

        [timerSel, planSel].forEach(sel => {
            if (sel) {
                const opt = document.createElement("option");
                opt.value = c.id;
                opt.textContent = c.name;
                sel.appendChild(opt);
            }
        });

        if (repSel) {
            const opt = document.createElement("option");
            opt.value = c.id;
            opt.textContent = c.name;
            repSel.appendChild(opt);
        }
    });

    const dash = document.getElementById("dashTotalCustomers");
    if (dash) dash.textContent = customers.length;
}

function initCustomerSave() {
    const btn = document.getElementById("saveCustomerBtn");
    if (!btn) return;

    btn.addEventListener("click", () => {
        const name = document.getElementById("custName").value.trim();
        const phone = document.getElementById("custPhone").value.trim();
        const email = document.getElementById("custEmail").value.trim();
        const address = document.getElementById("custAddress").value.trim();

        if (!name) {
            alert("Please enter a customer name.");
            return;
        }

        customers.push({
            id: Date.now().toString(),
            name,
            phone,
            email,
            address
        });

        saveData();
        renderCustomers();

        document.getElementById("custName").value = "";
        document.getElementById("custPhone").value = "";
        document.getElementById("custEmail").value = "";
        document.getElementById("custAddress").value = "";
    });
}

// ======================================================
// ================  EMPLOYEES  ==========================
// ======================================================

function renderEmployees() {
    const tbody = document.querySelector("#employeeTable tbody");
    const timerSel = document.getElementById("timerEmployeeSelect");
    const planSel = document.getElementById("planEmployeeSelect");
    const repSel = document.getElementById("reportEmployeeSelect");

    if (tbody) tbody.innerHTML = "";
    if (timerSel) timerSel.innerHTML = "";
    if (planSel) planSel.innerHTML = "";
    if (repSel) repSel.innerHTML = "";

    if (repSel) {
        const opt = document.createElement("option");
        opt.value = "";
        opt.textContent = "—";
        repSel.appendChild(opt);
    }

    employees.forEach(e => {
        if (tbody) {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${e.name}</td>
                <td>${e.email || ""}</td>
                <td>${e.role}</td>
            `;
            tbody.appendChild(tr);
        }

        [timerSel, planSel].forEach(sel => {
            if (sel) {
                const opt = document.createElement("option");
                opt.value = e.id;
                opt.textContent = e.name;
                sel.appendChild(opt);
            }
        });

        if (repSel) {
            const opt = document.createElement("option");
            opt.value = e.name;
            opt.textContent = e.name;
            repSel.appendChild(opt);
        }
    });

    const dash = document.getElementById("dashTotalEmployees");
    if (dash) dash.textContent = employees.length;
}

function initEmployeeSave() {
    const btn = document.getElementById("saveEmployeeBtn");
    if (!btn) return;

    btn.addEventListener("click", () => {
        const name = document.getElementById("empName").value.trim();
        const email = document.getElementById("empEmail").value.trim();
        const role = document.getElementById("empRole").value;

        if (!name) {
            alert("Please enter an employee name.");
            return;
        }

        employees.push({
            id: Date.now().toString(),
            name,
            email,
            role
        });

        saveData();
        renderEmployees();

        document.getElementById("empName").value = "";
        document.getElementById("empEmail").value = "";
        document.getElementById("empRole").value = "employee";

        // Opdatér dashboard direkte
        const dash = document.getElementById("dashTotalEmployees");
        if (dash) dash.textContent = employees.length;
    });
}

// ======================================================
// ================  TIME LOGS & TIMER  ==================
// ======================================================

function renderLogs() {
    const tbody = document.querySelector("#timeLogTable tbody");
    if (!tbody) return;

    tbody.innerHTML = "";
    const today = new Date().toISOString().slice(0, 10);
    let count = 0;

    timeLogs
        .filter(l => l.startTime.slice(0, 10) === today)
        .forEach(log => {
            const cust = customers.find(c => c.id === log.customerId);
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${new Date(log.startTime).toLocaleTimeString()}</td>
                <td>${new Date(log.endTime).toLocaleTimeString()}</td>
                <td>${log.duration}</td>
                <td>${cust ? cust.name : "?"}</td>
                <td>${log.employee}</td>
            `;
            tbody.appendChild(tr);
            count++;
        });

    const dash = document.getElementById("dashTodayLogs");
    if (dash) dash.textContent = count;
}

function renderTimer() {
    const status = document.getElementById("timerStatus");
    const stopBtn = document.getElementById("stopTimerBtn");

    if (!activeTimer) {
        status.textContent = translations[currentLang].timer_no_active || "No active timer";
        stopBtn.disabled = true;
    } else {
        const cust = customers.find(c => c.id === activeTimer.customerId);
        status.textContent = `Running: ${cust ? cust.name : "?"} – ${activeTimer.employee}`;
        stopBtn.disabled = false;
    }
}

function initTimerControls() {
    const startBtn = document.getElementById("startTimerBtn");
    const stopBtn = document.getElementById("stopTimerBtn");
    const custSel = document.getElementById("timerCustomerSelect");
    const empSel = document.getElementById("timerEmployeeSelect");

    if (!startBtn || !stopBtn) return;

    startBtn.addEventListener("click", () => {
        if (activeTimer) {
            alert("Timer is already running.");
            return;
        }
        const custId = custSel.value;
        const empId = empSel.value;

        const empObj = employees.find(e => e.id === empId);

        if (!custId || !empObj) {
            alert("Please select customer and employee.");
            return;
        }

        activeTimer = {
            customerId: custId,
            employeeId: empId,
            employee: empObj.name,
            startTime: new Date().toISOString()
        };

        saveData();
        renderTimer();
    });

    stopBtn.addEventListener("click", () => {
        if (!activeTimer) return;

        const endTime = new Date();
        const startTime = new Date(activeTimer.startTime);
        const diffMs = endTime - startTime;
        const durationMinutes = Math.max(1, Math.round(diffMs / 60000));

        timeLogs.push({
            customerId: activeTimer.customerId,
            employeeId: activeTimer.employeeId,
            employee: activeTimer.employee,
            startTime: activeTimer.startTime,
            endTime: endTime.toISOString(),
            duration: durationMinutes
        });

        activeTimer = null;
        saveData();
        renderTimer();
        renderLogs();
        generateReport(); // så rapporter også opdateres
    });
}

// ======================================================
// ================  CALENDAR  ===========================
// ======================================================

function dateToYMD(d) {
    return d.toISOString().slice(0, 10);
}

function renderCalendar() {
    const label = document.getElementById("calMonthLabel");
    const cells = document.getElementById("calendarCells");

    cells.innerHTML = "";

    const y = currentCalendarMonth.getFullYear();
    const m = currentCalendarMonth.getMonth();

    const first = new Date(y, m, 1);
    const days = new Date(y, m + 1, 0).getDate();
    const weekday = (first.getDay() + 6) % 7;

    label.textContent = currentCalendarMonth.toLocaleDateString(currentLang === "de" ? "de-DE" :
        currentLang === "lt" ? "lt-LT" :
        currentLang === "da" ? "da-DK" : "en-GB", {
        month: "long",
        year: "numeric"
    });

    for (let i = 0; i < weekday; i++) {
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

        const span = document.createElement("div");
        span.className = "date-number";
        span.textContent = d;

        cell.appendChild(span);

        cell.addEventListener("click", () => {
            selectedCalendarDate = dateStr;
            renderCalendar();
            renderDayPlans();
        });

        cells.appendChild(cell);
    }
}

function renderDayPlans() {
    const list = document.getElementById("dayPlanList");
    const label = document.getElementById("selectedDayLabel");

    list.innerHTML = "";

    if (!selectedCalendarDate) {
        label.textContent = translations[currentLang].schedule_selected_day;
        return;
    }

    label.textContent = `${translations[currentLang].schedule_selected_day} (${selectedCalendarDate})`;

    const jobs = plannedTasks.filter(j => j.date === selectedCalendarDate);

    if (jobs.length === 0) {
        const li = document.createElement("li");
        li.textContent = "-";
        list.appendChild(li);
        return;
    }

    jobs.forEach(j => {
        const cust = customers.find(c => c.id === j.customerId);
        const li = document.createElement("li");
        li.textContent = `${j.startTime} (${j.durationMinutes} min) – ${cust ? cust.name : "?"} – ${j.employeeName || "?"}${j.note ? " – " + j.note : ""}`;
        list.appendChild(li);
    });
}

function initCalendarControls() {
    document.getElementById("prevMonthBtn").addEventListener("click", () => {
        currentCalendarMonth.setMonth(currentCalendarMonth.getMonth() - 1);
        renderCalendar();
        renderDayPlans();
    });

    document.getElementById("nextMonthBtn").addEventListener("click", () => {
        currentCalendarMonth.setMonth(currentCalendarMonth.getMonth() + 1);
        renderCalendar();
        renderDayPlans();
    });

    const savePlanBtn = document.getElementById("savePlanBtn");
    savePlanBtn.addEventListener("click", () => {
        const date = document.getElementById("planDate").value;
        const startTime = document.getElementById("planStart").value;
        const duration = parseInt(document.getElementById("planDuration").value || "0", 10);
        const customerId = document.getElementById("planCustomerSelect").value;
        const employeeId = document.getElementById("planEmployeeSelect").value;
        const note = document.getElementById("planNote").value.trim();

        if (!date || !startTime || !duration || !customerId || !employeeId) {
            alert("Please fill all fields for planned job.");
            return;
        }

        const empObj = employees.find(e => e.id === employeeId);

        plannedTasks.push({
            id: Date.now().toString(),
            date,
            startTime,
            durationMinutes: duration,
            customerId,
            employeeId,
            employeeName: empObj ? empObj.name : "",
            note
        });

        saveData();
        renderCalendar();
        if (selectedCalendarDate === date) {
            renderDayPlans();
        }
    });
}

// ======================================================
// ================  REPORTS  ============================
// ======================================================

function generateReport() {
    const from = document.getElementById("reportDateFrom").value;
    const to = document.getElementById("reportDateTo").value;
    const custId = document.getElementById("reportCustomerSelect").value;
    const emp = document.getElementById("reportEmployeeSelect").value;

    const tbody = document.querySelector("#reportTable tbody");
    const summary = document.getElementById("reportSummary");

    tbody.innerHTML = "";

    let data = [...timeLogs];

    if (from) data = data.filter(l => l.startTime.slice(0, 10) >= from);
    if (to) data = data.filter(l => l.startTime.slice(0, 10) <= to);
    if (custId) data = data.filter(l => l.customerId === custId);
    if (emp) data = data.filter(l => l.employee === emp);

    let total = 0;

    data.forEach(log => {
        const cust = customers.find(c => c.id === log.customerId);
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${log.startTime.slice(0, 10)}</td>
            <td>${new Date(log.startTime).toLocaleTimeString()}</td>
            <td>${new Date(log.endTime).toLocaleTimeString()}</td>
            <td>${log.duration}</td>
            <td>${cust ? cust.name : "?"}</td>
            <td>${log.employee}</td>
        `;

        tbody.appendChild(tr);
        total += log.duration;
    });

    summary.textContent = `${data.length} logs – ${total} min (${(total / 60).toFixed(1)} h)`;
}

function initReportControls() {
    const btn = document.getElementById("runReportBtn");
    if (!btn) return;
    btn.addEventListener("click", generateReport);
}

// ======================================================
// ================  INIT  ===============================
// ======================================================

document.addEventListener("DOMContentLoaded", () => {
    loadData();

    initNavigation();
    initMobileMenu();
    initThemeToggle();
    initLanguageSwitcher();

    // Sprog først
    setLanguage(currentLang);

    // State
    const today = new Date();
    selectedCalendarDate = dateToYMD(today);

    // Init funktioner
    initCustomerSave();
    initEmployeeSave();
    initTimerControls();
    initCalendarControls();
    initReportControls();

    // Render
    renderCustomers();
    renderEmployees();
    renderLogs();
    renderTimer();
    renderCalendar();
    renderDayPlans();
    generateReport();

    // Vis dashboard som start
    showPage("dashboardPage");
});
