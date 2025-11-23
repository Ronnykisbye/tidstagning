/* ======================================================
   AFSNIT 01 – GLOBAL STATE & DATASTRUKTUR
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
   AFSNIT 02 – SPROG / I18N TEKSTER
   ====================================================== */

const translations = {
    da: {
        app_title: "GreenTime Pro",

        // Menupunkter
        menu_dashboard: "Tidsregistrering",
        menu_customers: "Kunder",
        menu_employees: "Medarbejdere",
        menu_time_tracking: "Detaljeret tid",
        menu_schedule: "Plan & kalender",
        menu_logs: "Logs",
        menu_reports: "Rapporter",
        menu_settings: "Indstillinger",

        // Forside
        dashboard_title: "Tidsregistrering",

        quick_title: "Hurtig tidsregistrering",
        quick_select_customer: "Vælg kunde",
        quick_select_employees: "Vælg medarbejdere",
        quick_time_label: "Vis tid for kunden:",
        quick_mode_today: "I dag",
        quick_mode_total: "Samlet tid",
        quick_hint: "Vælg kunde og medarbejdere og brug Start/Stop.",

        // Kunder
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

        // Medarbejdere
        employees_title: "Medarbejdere",
        employees_add: "Tilføj medarbejder",
        employees_list: "Medarbejderliste",

        label_employee_name: "Navn",
        label_employee_email: "Email",
        label_employee_role: "Rolle",
        btn_save_employee: "Gem medarbejder",

        role_employee: "Medarbejder",
        role_admin: "Admin",

        // Timer
        time_title: "Tidsregistrering",
        time_start_stop: "Start / stop",
        label_timer_customer: "Kunde",
        label_timer_employee: "Medarbejder",
        timer_no_active: "Ingen aktiv timer",
        btn_start_timer: "Start",
        btn_stop_timer: "Stop",

        // Logs
        logs_today_title: "Dagens logs",
        th_log_start: "Start",
        th_log_end: "Slut",
        th_log_duration: "Minutter",
        th_log_customer: "Kunde",
        th_log_employee: "Medarbejder",

        // Kalender
        schedule_title: "Plan & kalender",
        schedule_plan_job: "Planlæg opgave",
        schedule_selected_day: "Klik på en dag for at se opgaver.",

        weekday_mon: "Man",
        weekday_tue: "Tir",
        weekday_wed: "Ons",
        weekday_thu: "Tor",
        weekday_fri: "Fre",
        weekday_sat: "Lør",
        weekday_sun: "Søn",

        // Rapporter
        reports_title: "Rapporter",
        reports_filter_title: "Filtre",
        label_report_date_from: "Fra dato",
        label_report_date_to: "Til dato",
        label_report_customer: "Kunde",
        label_report_employee: "Medarbejder",
        btn_run_report: "Kør rapport",

        th_report_date: "Dato",
        th_report_start: "Start",
        th_report_end: "Slut",
        th_report_duration: "Minutter",
        th_report_customer: "Kunde",
        th_report_employee: "Medarbejder",

        // Settings
        settings_title: "Indstillinger",
        settings_lang_info: "Appen husker automatisk dit sprog og tema."
    }
};


/* ======================================================
   AFSNIT 03 – LOCALSTORAGE / DATA HÅNDTERING
   ====================================================== */

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


/* ======================================================
   AFSNIT 04 – SPROG FUNKTIONER
   ====================================================== */

function applyTranslations() {
    const dict = translations[currentLang];

    document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.dataset.i18n;
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
}

function initLanguageSwitcher() {
    document.querySelectorAll(".lang-btn").forEach(btn => {
        btn.addEventListener("click", () => setLanguage(btn.dataset.lang));
    });
}


/* ======================================================
   AFSNIT 05 – NAVIGATION
   ====================================================== */

function showPage(pageId) {
    document.querySelectorAll(".page").forEach(p => p.classList.remove("visible"));
    document.getElementById(pageId).classList.add("visible");

    document.querySelectorAll(".sidebar li").forEach(li => li.classList.remove("active"));
    document.querySelector(`.sidebar li[data-page="${pageId}"]`).classList.add("active");
}

function initNavigation() {
    document.querySelectorAll(".sidebar li").forEach(li => {
        li.addEventListener("click", () => showPage(li.dataset.page));
    });
}

function initMobileMenu() {
    const sidebar = document.querySelector(".sidebar");
    const toggle = document.getElementById("menuToggle");

    toggle.addEventListener("click", () => sidebar.classList.toggle("open"));
}


/* ======================================================
   AFSNIT 06 – TEMA (LYS / MØRK)
   ====================================================== */

function initThemeToggle() {
    const toggle = document.getElementById("themeToggle");
    const saved = localStorage.getItem("gtp_theme") || "dark";

    document.documentElement.dataset.theme = saved;
    toggle.textContent = saved === "dark" ? "☀️" : "🌙";

    toggle.addEventListener("click", () => {
        const now = document.documentElement.dataset.theme;
        const next = now === "dark" ? "light" : "dark";
        document.documentElement.dataset.theme = next;
        toggle.textContent = next === "dark" ? "☀️" : "🌙";
        localStorage.setItem("gtp_theme", next);
    });
}


/* ======================================================
   AFSNIT 07 – KUNDER (CRUD + TABEL)
   ====================================================== */

function renderCustomerTable() {
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
        if (!name) return alert("Skriv navn");

        customers.push({
            id: Date.now().toString(),
            name,
            phone: custPhone.value,
            email: custEmail.value,
            address: custAddress.value
        });

        saveData();
        renderCustomerTable();

        custName.value = custPhone.value = custEmail.value = custAddress.value = "";
    });
}

function initCustomerReset() {
    document.getElementById("resetCustomerTimeBtn").addEventListener("click", () => {
        const id = resetCustomerSelect.value;
        if (!id) return alert("Vælg kunde");

        const before = timeLogs.length;
        timeLogs = timeLogs.filter(l => l.customerId !== id);
        const removed = before - timeLogs.length;

        saveData();
        document.getElementById("resetCustomerInfo").textContent =
            `Fjernede ${removed} log-poster`;

        renderLogs();
    });
}


/* ======================================================
   AFSNIT 08 – MEDARBEJDERE (CRUD + LISTER)
   ====================================================== */

function renderEmployeeTable() {
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
    const ids = [
        "timerEmployeeSelect"
    ];

    ids.forEach(id => {
        const sel = document.getElementById(id);
        if (!sel) return;
        sel.innerHTML = "";
        employees.forEach(e => {
            const opt = document.createElement("option");
            opt.value = e.id;
            opt.textContent = e.name;
            sel.appendChild(opt);
        });
    });

    // Multi-select til planlæg opgave
    renderPlanEmployeeList();

    // Multi-select til Quick Timer
    renderQuickEmployeeList();
}

function initEmployeeSave() {
    document.getElementById("saveEmployeeBtn").addEventListener("click", () => {
        const name = empName.value.trim();
        if (!name) return alert("Skriv navn");

        employees.push({
            id: Date.now().toString(),
            name,
            email: empEmail.value,
            role: empRole.value
        });

        saveData();
        renderEmployeeTable();

        empName.value = empEmail.value = "";
        empRole.value = "medarbejder";
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

function updateQuickTimerDisplay() {
    const el = document.getElementById("quickTimerDisplay");
    const custId = quickCustomerSelect.value;

    if (!custId) {
        el.textContent = "00:00:00";
        return;
    }

    if (quickActiveTimer && quickActiveTimer.customerId === custId) {
        const sec = Math.floor((Date.now() - new Date(quickActiveTimer.startTime).getTime()) / 1000);
        el.textContent = formatSeconds(sec);
        return;
    }

    const minutes = getCustomerMinutes(custId, quickMode);
    el.textContent = formatSeconds(minutes * 60);
}

function getCustomerMinutes(custId, mode) {
    let total = 0;
    const today = new Date().toISOString().slice(0, 10);

    timeLogs.forEach(l => {
        if (l.customerId !== custId) return;
        if (mode === "day" && l.startTime.slice(0, 10) !== today) return;
        total += l.duration;
    });

    return total;
}

function formatSeconds(sec) {
    const h = String(Math.floor(sec / 3600)).padStart(2, "0");
    const m = String(Math.floor((sec % 3600) / 60)).padStart(2, "0");
    const s = String(sec % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
}

function initQuickTimerControls() {
    quickStartBtn.addEventListener("click", () => {
        if (quickActiveTimer) return alert("Quick timer kører allerede.");

        const cust = quickCustomerSelect.value;
        const empIds = getSelectedQuickEmployees();

        if (!cust) return alert("Vælg kunde");
        if (empIds.length === 0) return alert("Vælg medarbejdere");

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
