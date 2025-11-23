// ======================================================
// ================  DATA & STORAGE  ====================
// ======================================================

let customers = [];
let employees = [];
let timeLogs = [];
let plannedTasks = [];
let activeTimer = null; 

let currentCalendarMonth = new Date();
let selectedCalendarDate = null;

function loadData() {
    customers = JSON.parse(localStorage.getItem("gtp_customers") || "[]");
    employees = JSON.parse(localStorage.getItem("gtp_employees") || "[]" );
    timeLogs = JSON.parse(localStorage.getItem("gtp_logs") || "[]");
    plannedTasks = JSON.parse(localStorage.getItem("gtp_plans") || "[]");
    activeTimer = JSON.parse(localStorage.getItem("gtp_active") || "null");
}

function saveData() {
    localStorage.setItem("gtp_customers", JSON.stringify(customers));
    localStorage.setItem("gtp_employees", JSON.stringify(employees));
    localStorage.setItem("gtp_logs", JSON.stringify(timeLogs));
    localStorage.setItem("gtp_plans", JSON.stringify(plannedTasks));
    localStorage.setItem("gtp_active", JSON.stringify(activeTimer));
}

// ======================================================
// ================  NAVIGATION  =========================
// ======================================================

function showPage(pageId) {
    document.querySelectorAll(".page").forEach(p => p.classList.remove("visible"));
    document.getElementById(pageId).classList.add("visible");

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

    const navToggle = document.getElementById("navToggle");
    const sidebar = document.getElementById("sidebar");
    if (navToggle && sidebar) {
        navToggle.addEventListener("click", () => sidebar.classList.toggle("open"));
    }
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
// ================  RENDER CUSTOMER  ====================
// ======================================================

function renderCustomers() {
    const tbody = document.querySelector("#customerTable tbody");
    const timerSel = document.getElementById("timerCustomerSelect");
    const planSel = document.getElementById("planCustomerSelect");
    const repSel = document.getElementById("reportCustomerSelect");

    [tbody, timerSel, planSel, repSel].forEach(el => { if (el) el.innerHTML = ""; });

    if (repSel) {
        const opt = document.createElement("option");
        opt.value = "";
        opt.textContent = "All customers";
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

// ======================================================
// ================  RENDER EMPLOYEES  ===================
// ======================================================

function renderEmployees() {
    const tbody = document.querySelector("#employeeTable tbody");
    const timerSel = document.getElementById("timerEmployeeSelect");
    const planSel = document.getElementById("planEmployeeSelect");
    const repSel = document.getElementById("reportEmployeeSelect");

    [tbody, timerSel, planSel, repSel].forEach(el => { if (el) el.innerHTML = ""; });

    if (repSel) {
        const opt = document.createElement("option");
        opt.value = "";
        opt.textContent = "All employees";
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

// ======================================================
// ================  RENDER LOGS  ========================
// ======================================================

function renderLogs() {
    const tbody = document.querySelector("#timeLogTable tbody");
    if (!tbody) return;

    tbody.innerHTML = "";
    const today = new Date().toISOString().slice(0, 10);
    let count = 0;

    timeLogs
        .filter(l => l.startTime.slice(0,10) === today)
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

// ======================================================
// ================  TIMER  ==============================
// ======================================================

function renderTimer() {
    const status = document.getElementById("timerStatus");
    const stopBtn = document.getElementById("stopTimerBtn");

    if (!activeTimer) {
        status.textContent = "No active timer";
        stopBtn.disabled = true;
    } else {
        const cust = customers.find(c => c.id === activeTimer.customerId);
        status.textContent = `Running: ${cust ? cust.name : "?"} – ${activeTimer.employee}`;
        stopBtn.disabled = false;
    }
}

// ======================================================
// ================  CALENDAR  ===========================
// ======================================================

function dateToYMD(d) { return d.toISOString().slice(0, 10); }

function renderCalendar() {
    const label = document.getElementById("calMonthLabel");
    const cells = document.getElementById("calendarCells");

    cells.innerHTML = "";

    const y = currentCalendarMonth.getFullYear();
    const m = currentCalendarMonth.getMonth();

    const first = new Date(y, m, 1);
    const days = new Date(y, m+1, 0).getDate();
    const weekday = (first.getDay() + 6) % 7;

    label.textContent = currentCalendarMonth.toLocaleDateString("en-GB", {
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
        label.textContent = "Click a day to see planned jobs.";
        return;
    }

    label.textContent = `Planned jobs for ${selectedCalendarDate}:`;

    const jobs = plannedTasks.filter(j => j.date === selectedCalendarDate);

    if (jobs.length === 0) {
        list.innerHTML = "<li>No planned jobs</li>";
        return;
    }

    jobs.forEach(j => {
        const cust = customers.find(c => c.id === j.customerId);
        const li = document.createElement("li");
        li.innerHTML = `
            <strong>${j.startTime}</strong> 
            (${j.durationMinutes} min) – 
            ${cust ? cust.name : "?"} – 
            ${j.employeeName || "Unknown"}
            ${j.note ? " – " + j.note : ""}
        `;
        list.appendChild(li);
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

    if (from) data = data.filter(l => l.startTime.slice(0,10) >= from);
    if (to) data = data.filter(l => l.startTime.slice(0,10) <= to);
    if (custId) data = data.filter(l => l.customerId === custId);
    if (emp) data = data.filter(l => l.employee === emp);

    let total = 0;

    data.forEach(log => {
        const cust = customers.find(c => c.id === log.customerId);
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${log.startTime.slice(0,10)}</td>
            <td>${new Date(log.startTime).toLocaleTimeString()}</td>
            <td>${new Date(log.endTime).toLocaleTimeString()}</td>
            <td>${log.duration}</td>
            <td>${cust ? cust.name : "?"}</td>
            <td>${log.employee}</td>
        `;

        tbody.appendChild(tr);
        total += log.duration;
    });

    summary.textContent = `${data.length} logs – ${total} min (${(total/60).toFixed(1)} h)`;
}

// ======================================================
// ================  INIT (LOAD ALL)  ====================
// ======================================================

document.addEventListener("DOMContentLoaded", () => {
    loadData();
    initNavigation();
    initThemeToggle();

    const today = new Date();
    selectedCalendarDate = dateToYMD(today);

    renderCustomers();
    renderEmployees();
    renderLogs();
    renderTimer();
    renderCalendar();
    renderDayPlans();
    generateReport();
});
