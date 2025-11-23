// ====== DATA & STORAGE ======

let customers = [];
let employees = [];
let timeLogs = [];
let plannedTasks = [];
let activeTimer = null; 

let currentCalendarMonth = new Date();
let selectedCalendarDate = null;

function loadData() {
    customers = JSON.parse(localStorage.getItem("gtp_customers") || "[]");
    employees = JSON.parse(localStorage.getItem("gtp_employees") || "[]");
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

// ====== NAVIGATION ======

function showPage(pageId) {
    document.querySelectorAll(".page").forEach(p => p.classList.remove("visible"));
    const page = document.getElementById(pageId);
    if (page) page.classList.add("visible");

    document.querySelectorAll(".sidebar li").forEach(li => li.classList.remove("active"));
    const nav = document.querySelector(`.sidebar li[data-page="${pageId}"]`);
    if (nav) nav.classList.add("active");
}

// ====== RENDERING FUNCTIONS ======

function renderCustomers() {
    const tbody = document.querySelector("#customerTable tbody");
    const selTimer = document.getElementById("timerCustomerSelect");
    const selPlan = document.getElementById("planCustomerSelect");
    const selReport = document.getElementById("reportCustomerSelect");

    if (tbody) tbody.innerHTML = "";
    if (selTimer) selTimer.innerHTML = "";
    if (selPlan) selPlan.innerHTML = "";
    if (selReport) selReport.innerHTML = "";

    if (selReport) {
        const opt = document.createElement("option");
        opt.value = "";
        opt.textContent = "All customers";
        selReport.appendChild(opt);
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

        [selTimer, selPlan, selReport].forEach(sel => {
            if (sel) {
                const opt = document.createElement("option");
                opt.value = c.id;
                opt.textContent = c.name;
                sel.appendChild(opt);
            }
        });
    });

    const dash = document.getElementById("dashTotalCustomers");
    if (dash) dash.textContent = customers.length;
}

function renderEmployees() {
    const tbody = document.querySelector("#employeeTable tbody");
    const selTimer = document.getElementById("timerEmployeeSelect");
    const selPlan = document.getElementById("planEmployeeSelect");
    const selReport = document.getElementById("reportEmployeeSelect");

    if (tbody) tbody.innerHTML = "";
    if (selTimer) selTimer.innerHTML = "";
    if (selPlan) selPlan.innerHTML = "";
    if (selReport) selReport.innerHTML = "";

    if (selReport) {
        const opt = document.createElement("option");
        opt.value = "";
        opt.textContent = "All employees";
        selReport.appendChild(opt);
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

        [selTimer, selPlan].forEach(sel => {
            if (sel) {
                const opt = document.createElement("option");
                opt.value = e.id;
                opt.textContent = e.name;
                sel.appendChild(opt);
            }
        });

        if (selReport) {
            const opt = document.createElement("option");
            opt.value = e.name;
            opt.textContent = e.name;
            selReport.appendChild(opt);
        }
    });

    const dash = document.getElementById("dashTotalEmployees");
    if (dash) dash.textContent = employees.length;
}

function renderLogs() {
    const tbody = document.querySelector("#timeLogTable tbody");
    if (!tbody) return;

    tbody.innerHTML = "";

    const today = new Date().toISOString().slice(0, 10);

    let count = 0;
    timeLogs
        .filter(l => (l.startTime || "").slice(0, 10) === today)
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
        status.textContent = "No active timer";
        stopBtn.disabled = true;
    } else {
        const cust = customers.find(c => c.id === activeTimer.customerId);
        status.textContent = `Running: ${cust ? cust.name : "?"} – ${activeTimer.employee}`;
        stopBtn.disabled = false;
    }
}

// ====== CALENDAR ======

function dateToYMD(d) {
    return d.toISOString().slice(0, 10);
}

function renderCalendar() {
    const label = document.getElementById("calMonthLabel");
    const cells = document.getElementById("calendarCells");

    if (!label || !cells) return;

    cells.innerHTML = "";

    const year = currentCalendarMonth.getFullYear();
    const month = currentCalendarMonth.getMonth();

    const first = new Date(year, month, 1);
    const days = new Date(year, month + 1, 0).getDate();
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
        const date = new Date(year, month, d);
        const dateStr = dateToYMD(date);

        const cell = document.createElement("div");
        cell.className = "calendar-cell";
        cell.dataset.date = dateStr;

        const span = document.createElement("div");
        span.className = "date-number";
        span.textContent = d;

        cell.appendChild(span);

        if (selectedCalendarDate === dateStr) {
            cell.classList.add("selected");
        }

        cell.onclick = () => {
            selectedCalendarDate = dateStr;
            renderCalendar();
            renderDayPlans();
        };

        cells.appendChild(cell);
    }
}

function renderDayPlans() {
    const list = document.getElementById("dayPlanList");
    const label = document.getElementById("selectedDayLabel");

    if (!list || !label) return;

    list.innerHTML = "";

    if (!selectedCalendarDate) {
        label.textContent = "Click a day to see planned jobs.";
        return;
    }

    label.textContent = `Planned jobs for ${selectedCalendarDate}:`;

    const jobs = plannedTasks.filter(p => p.date === selectedCalendarDate);

    if (jobs.length === 0) {
        list.innerHTML = "<li>No planned jobs.</li>";
        return;
    }

    jobs.forEach(j => {
        const cust = customers.find(c => c.id === j.customerId);
        const li = document.createElement("li");
        li.innerHTML = `
            <strong>${j.startTime}</strong> (${j.durationMinutes} min) 
            – ${cust ? cust.name : "?"} 
            – ${j.employeeName || "Unknown"}
            ${j.note ? " – " + j.note : ""}
        `;
        list.appendChild(li);
    });
}

// ====== REPORTS ======

function generateReport() {
    const from = document.getElementById("reportDateFrom").value;
    const to = document.getElementById("reportDateTo").value;
    const custId = document.getElementById("reportCustomerSelect").value;
    const empName = document.getElementById("reportEmployeeSelect").value;

    const tbody = document.querySelector("#reportTable tbody");
    const summary = document.getElementById("reportSummary");

    tbody.innerHTML = "";

    let filtered = [...timeLogs];

    if (from) filtered = filtered.filter(l => l.startTime.slice(0, 10) >= from);
    if (to)   filtered = filtered.filter(l => l.startTime.slice(0, 10) <= to);
    if (custId) filtered = filtered.filter(l => l.customerId === custId);
    if (empName) filtered = filtered.filter(l => l.employee === empName);

    let total = 0;

    filtered.forEach(log => {
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

    summary.textContent =
        `${filtered.length} logs — ${total} min (${(total/60).toFixed(1)} h)`;
}

// ====== INIT ======

document.addEventListener("DOMContentLoaded", () => {
    loadData();

    // Theme
    const theme = localStorage.getItem("gtp_theme") || "dark";
    document.documentElement.setAttribute("data-theme", theme);
    const toggle = document.getElementById("themeToggle");
    if (toggle) {
        toggle.textContent = theme === "dark" ? "☀️" : "🌙";
        toggle.onclick = () => {
            const now = document.documentElement.getAttribute("data-theme");
            const next = now === "dark" ? "light" : "dark";
            document.documentElement.setAttribute("data-theme", next);
            localStorage.setItem("gtp_theme", next);
            toggle.textContent = next === "dark" ? "☀️" : "🌙";
        };
    }

    // Navigation
    document.querySelectorAll(".sidebar li").forEach(li => {
        li.addEventListener("click", () => {
            showPage(li.dataset.page);
        });
    });

    // Mobile menu
    const navToggle = document.getElementById("navToggle");
    const sidebar = document.getElementById("sidebar");
    if (navToggle && sidebar) {
        navToggle.onclick = () => sidebar.classList.toggle("open");
    }

    // Customer form
    const custForm = document.getElementById("customerForm");
    if (custForm) {
        custForm.onsubmit = e => {
            e.preventDefault();
            customers.push({
                id: "c" + Date.now(),
                name: document.getElementById("customerName").value,
                phone: document.getElementById("customerPhone").value,
                email: document.getElementById("customerEmail").value,
                address: document.getElementById("customerAddress").value
            });
            saveData();
            renderCustomers();
            renderCalendar();
            custForm.reset();
        };
    }

    // Employee form
    const empForm = document.getElementById("employeeForm");
    if (empForm) {
        empForm.onsubmit = e => {
            e.preventDefault();
            employees.push({
                id: "e" + Date.now(),
                name: document.getElementById("employeeName").value,
                email: document.getElementById("employeeEmail").value,
                role: document.getElementById("employeeRole").value
            });
            saveData();
            renderEmployees();
            empForm.reset();
        };
    }

    // Start timer
    const startBtn = document.getElementById("startTimerBtn");
    if (startBtn) {
        startBtn.onclick = () => {
            const cid = document.getElementById("timerCustomerSelect").value;
            const empId = document.getElementById("timerEmployeeSelect").value;
            const empInput = document.getElementById("timerEmployeeName").value.trim();

            if (!cid) {
                alert("Select a customer");
                return;
            }

            let emp = "Unknown";
            const obj = employees.find(e => e.id === empId);
            if (obj) emp = obj.name;
            if (empInput) emp = empInput;

            activeTimer = {
                customerId: cid,
                employee: emp,
                startTime: new Date().toISOString()
            };

            saveData();
            renderTimer();
        };
    }

    // Stop timer
    const stopBtn = document.getElementById("stopTimerBtn");
    if (stopBtn) {
        stopBtn.onclick = () => {
            if (!activeTimer) return;

            const end = new Date();
            const start = new Date(activeTimer.startTime);
            const min = Math.round((end - start) / 60000);

            timeLogs.push({
                customerId: activeTimer.customerId,
                employee: activeTimer.employee,
                startTime: activeTimer.startTime,
                endTime: end.toISOString(),
                duration: Math.max(1, min)
            });

            activeTimer = null;

            saveData();
            renderLogs();
            renderTimer();
            renderCalendar();
        };
    }

    // Planning
    const planForm = document.getElementById("planForm");
    if (planForm) {
        planForm.onsubmit = e => {
            e.preventDefault();

            const empObj = employees.find(
                e => e.id === document.getElementById("planEmployeeSelect").value
            );

            plannedTasks.push({
                id: "p" + Date.now(),
                date: document.getElementById("planDate").value,
                startTime: document.getElementById("planStartTime").value,
                durationMinutes: Number(document.getElementById("planDuration").value),
                customerId: document.getElementById("planCustomerSelect").value,
                employeeName: empObj ? empObj.name : "Unknown",
                note: document.getElementById("planNote").value
            });

            saveData();
            renderCalendar();
            renderDayPlans();
            planForm.reset();
        };
    }

    // Calendar navigation
    const prev = document.getElementById("calPrev");
    const next = document.getElementById("calNext");

    if (prev) prev.onclick = () => {
        currentCalendarMonth.setMonth(currentCalendarMonth.getMonth() - 1);
        renderCalendar();
        renderDayPlans();
    };

    if (next) next.onclick = () => {
        currentCalendarMonth.setMonth(currentCalendarMonth.getMonth() + 1);
        renderCalendar();
        renderDayPlans();
    };

    // Reports
    const rep = document.getElementById("reportGenerateBtn");
    if (rep) rep.onclick = () => generateReport();

    // Default selected day
    selectedCalendarDate = dateToYMD(new Date());

    // First render
    renderCustomers();
    renderEmployees();
    renderLogs();
    renderTimer();
    renderCalendar();
    renderDayPlans();
    generateReport();
});
