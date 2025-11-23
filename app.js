/* ======================================================
   AFSNIT 01 – GLOBAL DATA & INITIAL STATE
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
let quickMode = "day";  // "day" eller "total"

/* ======================================================
   AFSNIT 02 – I18N TEKSTER (DANSK, ENG, LT, DE)
   ====================================================== */

const translations = {
    da: {
        app_title: "GreenTime Pro",
        menu_dashboard: "Tidsregistrering",
        menu_customers: "Kunder",
        menu_employees: "Medarbejdere",
        menu_time_tracking: "Tidsregistrering",
        menu_schedule: "Plan & kalender",
        menu_logs: "Logs",
        menu_reports: "Rapporter",
        menu_settings: "Indstillinger",

        dashboard_title: "Tidsregistrering",
        card_customers: "Kunder",
        card_employees: "Medarbejdere",
        card_logs_today: "Logs i dag",

        quick_title: "Hurtig tidsregistrering",
        quick_select_customer: "Vælg kunde",
        quick_select_employees: "Vælg medarbejdere hos kunden i dag",
        quick_time_label: "Vis tid for kunden:",
        quick_mode_today: "I dag",
        quick_mode_total: "Samlet tid",
        quick_hint: "Vælg kunde og medarbejdere og brug Start/Stop.",

        customers_title: "Kunder",
        customers_add: "Tilføj kunde",
        customers_list: "Kundeliste",
        customers_reset_title: "Nulstil tid for kunde",

        label_reset_customer: "Vælg kunde",
        btn_reset_customer_time: "Nulstil al logget tid",

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
        label_plan_duration: "Varighed (minutter)",
        label_plan_customer: "Kunde",
        label_plan_employee: "Medarbejder",
        label_plan_note: "Note",
        btn_save_plan: "Gem opgave",

        schedule_selected_day: "Klik en dag for at se opgaver.",

        weekday_mon: "Man",
        weekday_tue: "Tir",
        weekday_wed: "Ons",
        weekday_thu: "Tor",
        weekday_fri: "Fre",
        weekday_sat: "Lør",
        weekday_sun: "Søn",

        logs_page_title: "Logs (alle)",
        logs_page_desc: "Her kan du senere få fuldt log-overblik.",

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
        settings_lang_info: "Skift sprog via knapperne i topbaren."
    }
};

/* ======================================================
   AFSNIT 03 – STORAGE (LOCALSTORAGE)
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
   AFSNIT 04 – SPROG & OVERSÆTTELSER
   ====================================================== */

function applyTranslations() {
    const dict = translations[currentLang] || translations.da;

    document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.getAttribute("data-i18n");
        if (dict[key]) el.textContent = dict[key];
    });

    document.title = dict.app_title;

    // Rolle-tekst i medarbejder-dropdown
    const empRole = document.getElementById("empRole");
    if (empRole) {
        empRole.options[0].textContent = dict.role_employee;
        empRole.options[1].textContent = dict.role_admin;
    }
}

function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem("gtp_lang", lang);

    document.querySelectorAll(".lang-btn").forEach(btn => {
        btn.classList.toggle("active", btn.dataset.lang === lang);
    });

    applyTranslations();
    updateQuickTimerDisplay();
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

    document.querySelectorAll(".sidebar li").forEach(li => li.classList.remove("active"));
    document.querySelector(`.sidebar li[data-page="${pageId}"]`).classList.add("active");
}

function initNavigation() {
    document.querySelectorAll(".sidebar li").forEach(li => {
        li.addEventListener("click", () => showPage(li.dataset.page));
    });
}

function initMobileMenu() {
    const menuToggle = document.getElementById("menuToggle");
    const sidebar = document.querySelector(".sidebar");

    menuToggle.addEventListener("click", () => sidebar.classList.toggle("open"));
    document.addEventListener("click", (e) => {
        if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) sidebar.classList.remove("open");
    });
}

/* ======================================================
   AFSNIT 06 – TEMA (MØRK / LYS)
   ====================================================== */

function initThemeToggle() {
    const themeToggle = document.getElementById("themeToggle");
    const saved = localStorage.getItem("gtp_theme") || "dark";

    document.documentElement.setAttribute("data-theme", saved);
    themeToggle.textContent = saved === "dark" ? "☀️" : "🌙";

    themeToggle.addEventListener("click", () => {
        const now = document.documentElement.getAttribute("data-theme");
        const next = now === "dark" ? "light" : "dark";
        document.documentElement.setAttribute("data-theme", next);
        themeToggle.textContent = next === "dark" ? "☀️" : "🌙";
        localStorage.setItem("gtp_theme", next);
    });
}

/* ======================================================
   AFSNIT 07 – KUNDER
   ====================================================== */

function populateCustomerSelects() {
    const ids = ["timerCustomerSelect", "planCustomerSelect", "reportCustomerSelect", "quickCustomerSelect", "resetCustomerSelect"];

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

function renderCustomers() {
    const tbody = document.querySelector("#customerTable tbody");
    if (!tbody) return;

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

    document.getElementById("cardCustomerCount").textContent = customers.length;

    populateCustomerSelects();
    renderQuickEmployeeList();
}

function initCustomerSave() {
    document.getElementById("saveCustomerBtn").addEventListener("click", () => {
        const name = custName.value.trim();
        if (!name) return alert("Skriv et navn.");

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
        if (!id) return alert("Vælg en kunde.");

        const before = timeLogs.length;
        timeLogs = timeLogs.filter(l => l.customerId !== id);
        const removed = before - timeLogs.length;

        saveData();
        document.getElementById("resetCustomerInfo").textContent = `Fjernede ${removed} log-poster.`;
        renderLogs();
    });
}

/* ======================================================
   AFSNIT 08 – MEDARBEJDERE
   ====================================================== */

function renderEmployees() {
    const tbody = document.querySelector("#employeeTable tbody");
    if (!tbody) return;

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

    document.getElementById("cardEmployeeCount").textContent = employees.length;

    populateEmployeeSelects();
}

function populateEmployeeSelects() {
    const ids = ["timerEmployeeSelect", "planEmployeeSelect"];

    ids.forEach(id => {
        const sel = document.getElementById(id);
        if (sel) {
            sel.innerHTML = "";
            employees.forEach(e => {
                const opt = document.createElement("option");
                opt.value = e.id;
                opt.textContent = e.name;
                sel.appendChild(opt);
            });
        }
    });

    const repSel = document.getElementById("reportEmployeeSelect");
    if (repSel) {
        repSel.innerHTML = `<option value=""></option>`;
        employees.forEach(e => {
            const opt = document.createElement("option");
            opt.value = e.name;
            opt.textContent = e.name;
            repSel.appendChild(opt);
        });
    }

    renderQuickEmployeeList();
}

function initEmployeeSave() {
    document.getElementById("saveEmployeeBtn").addEventListener("click", () => {
        const name = empName.value.trim();
        if (!name) return alert("Skriv navn.");

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
   AFSNIT 09 – TIMER (NORMAL)
   ====================================================== */

function renderTimer() {
    const status = document.getElementById("timerStatus");
    const stopBtn = document.getElementById("stopTimerBtn");

    if (!activeTimer) {
        status.textContent = translations[currentLang].timer_no_active;
        stopBtn.disabled = true;
        return;
    }

    const cust = customers.find(c => c.id === activeTimer.customerId);
    const emp = employees.find(e => e.id === activeTimer.employeeId);

    status.textContent = `Kører: ${cust?.name} - ${emp?.name}`;
    stopBtn.disabled = false;
}

function initTimerControls() {
    const startBtn = document.getElementById("startTimerBtn");
    const stopBtn = document.getElementById("stopTimerBtn");

    startBtn.addEventListener("click", () => {
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
        renderTimer();
    });

    stopBtn.addEventListener("click", () => {
        if (!activeTimer) return;

        const end = new Date();
        const start = new Date(activeTimer.startTime);

        const minutes = Math.max(1, Math.round((end - start) / 60000));
        const emp = employees.find(e => e.id === activeTimer.employeeId);

        timeLogs.push({
            customerId: activeTimer.customerId,
            employeeId: activeTimer.employeeId,
            employee: emp ? emp.name : "",
            startTime: activeTimer.startTime,
            endTime: end.toISOString(),
            duration: minutes
        });

        activeTimer = null;

        saveData();
        renderTimer();
        renderLogs();
        updateQuickTimerDisplay();
    });
}

/* ======================================================
   AFSNIT 10 – QUICK TIMER (FORSIDE)
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

function getSelectedQuickEmployeeIds() {
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

function updateQuickTimerDisplay() {
    const display = document.getElementById("quickTimerDisplay");
    const cust = quickCustomerSelect.value;

    if (!cust) return display.textContent = "00:00:00";

    if (quickActiveTimer && quickActiveTimer.customerId === cust) {
        const sec = (Date.now() - new Date(quickActiveTimer.startTime).getTime()) / 1000;
        display.textContent = formatSeconds(sec);
    } else {
        const minutes = getCustomerMinutes(cust, quickMode);
        display.textContent = formatSeconds(minutes * 60);
    }
}

function formatSeconds(sec) {
    sec = Math.max(0, Math.floor(sec));
    const h = String(Math.floor(sec / 3600)).padStart(2, "0");
    const m = String(Math.floor((sec % 3600) / 60)).padStart(2, "0");
    const s = String(sec % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
}

function initQuickTimerControls() {
    const startBtn = document.getElementById("quickStartBtn");
    const stopBtn = document.getElementById("quickStopBtn");

    startBtn.addEventListener("click", () => {
        if (quickActiveTimer) return alert("Quick timer kører.");

        const cust = quickCustomerSelect.value;
        const empIds = getSelectedQuickEmployeeIds();

        if (!cust) return alert("Vælg kunde.");
        if (empIds.length === 0) return alert("Vælg medarbejdere.");

        quickActiveTimer = {
            customerId: cust,
            employeeIds: empIds,
            startTime: new Date().toISOString()
        };

        quickTimerInterval = setInterval(updateQuickTimerDisplay, 1000);
        updateQuickTimerDisplay();
    });

    stopBtn.addEventListener("click", () => {
        if (!quickActiveTimer) return;

        const end = new Date();
        const start = new Date(quickActiveTimer.startTime);
        const minutes = Math.max(1, Math.round((end - start) / 60000));

        quickActiveTimer.employeeIds.forEach(id => {
            const emp = employees.find(e => e.id === id);

            timeLogs.push({
                customerId: quickActiveTimer.customerId,
                employeeId: id,
                employee: emp ? emp.name : "",
                startTime: quickActiveTimer.startTime,
                endTime: end.toISOString(),
                duration: minutes
            });
        });

        quickActiveTimer = null;
        clearInterval(quickTimerInterval);
        quickTimerInterval = null;

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
   AFSNIT 11 – LOG VISNING
   ====================================================== */

function renderLogs() {
    const tbody = document.querySelector("#timeLogTable tbody");
    if (!tbody) return;

    const today = new Date().toISOString().slice(0, 10);
    tbody.innerHTML = "";

    const todayLogs = timeLogs.filter(l => l.startTime.slice(0, 10) === today);

    todayLogs.forEach(l => {
        const cust = customers.find(c => c.id === l.customerId);

        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${new Date(l.startTime).toLocaleTimeString()}</td>
            <td>${new Date(l.endTime).toLocaleTimeString()}</td>
            <td>${l.duration}</td>
            <td>${cust ? cust.name : "?"}</td>
            <td>${l.employee}</td>
        `;
        tbody.appendChild(tr);
    });

    document.getElementById("cardLogsToday").textContent = todayLogs.length;
}

/* ======================================================
   AFSNIT 12 – KALENDER
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

        if (selectedCalendarDate === dateStr) {
            cell.classList.add("selected");
        }

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

    const jobs = plannedTasks.filter(j => j.date === selectedCalendarDate);

    label.textContent = `Opgaver ${selectedCalendarDate}`;

    if (jobs.length === 0) {
        list.innerHTML = "<li>-</li>";
        return;
    }

    jobs.forEach(j => {
        const cust = customers.find(c => c.id === j.customerId);

        const li = document.createElement("li");
        li.textContent = `${j.startTime} – ${cust?.name} (${j.durationMinutes} min)`;
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
        const start = planStart.value;
        const dur = planDuration.value;
        const cust = planCustomerSelect.value;
        const emp = planEmployeeSelect.value;
        const note = planNote.value.trim();

        if (!date || !start || !dur || !cust || !emp) {
            return alert("Udfyld alle felter.");
        }

        const employeeObj = employees.find(e => e.id === emp);

        plannedTasks.push({
            id: Date.now().toString(),
            date,
            startTime: start,
            durationMinutes: Number(dur),
            customerId: cust,
            employeeId: emp,
            employeeName: employeeObj?.name,
            note
        });

        saveData();
        renderCalendar();
        if (selectedCalendarDate === date) renderDayPlans();
    });
}

/* ======================================================
   AFSNIT 13 – RAPPORTER
   ====================================================== */

function generateReport() {
    const from = reportDateFrom.value;
    const to = reportDateTo.value;
    const custId = reportCustomerSelect.value;
    const emp = reportEmployeeSelect.value;
    const tbody = document.querySelector("#reportTable tbody");
    const summary = document.getElementById("reportSummary");

    let data = [...timeLogs];

    if (from) data = data.filter(l => l.startTime.slice(0, 10) >= from);
    if (to) data = data.filter(l => l.startTime.slice(0, 10) <= to);
    if (custId) data = data.filter(l => l.customerId === custId);
    if (emp) data = data.filter(l => l.employee === emp);

    tbody.innerHTML = "";
    let total = 0;

    data.forEach(l => {
        const cust = customers.find(c => c.id === l.customerId);

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

        total += l.duration;
    });

    summary.textContent = `Total tid: ${total} minutter`;
}

function initReportControls() {
    runReportBtn.addEventListener("click", generateReport);
}

/* ======================================================
   AFSNIT 14 – INIT (KØRES NÅR SIDEN LOADES)
   ====================================================== */

document.addEventListener("DOMContentLoaded", () => {
    loadData();

    applyTranslations();
    initLanguageSwitcher();
    initNavigation();
    initMobileMenu();
    initThemeToggle();

    renderCustomers();
    renderEmployees();
    renderLogs();
    renderCalendar();
    renderDayPlans();

    initCustomerSave();
    initEmployeeSave();
    initCustomerReset();

    initTimerControls();
    initQuickTimerControls();
    initCalendarControls();
    initReportControls();

    updateQuickTimerDisplay();
});
