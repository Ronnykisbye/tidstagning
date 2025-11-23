/* ======================================================
   AFSNIT 01 – GLOBAL STATE
   ====================================================== */

let customers = [];
let employees = [];
let logs = [];
let plans = [];

let quickTimer = null;
let quickInterval = null;

let activeTimer = null;

let currentLang = "da";
let currentTheme = "light";

let selectedCalendarDate = null;
let calendarMonth = new Date();


/* ======================================================
   AFSNIT 02 – LOCAL STORAGE
   ====================================================== */

function loadAll() {
    customers = JSON.parse(localStorage.getItem("gt_customers") || "[]");
    employees = JSON.parse(localStorage.getItem("gt_employees") || "[]");
    logs = JSON.parse(localStorage.getItem("gt_logs") || "[]");
    plans = JSON.parse(localStorage.getItem("gt_plans") || "[]");
    activeTimer = JSON.parse(localStorage.getItem("gt_timer") || "null");
}

function saveAll() {
    localStorage.setItem("gt_customers", JSON.stringify(customers));
    localStorage.setItem("gt_employees", JSON.stringify(employees));
    localStorage.setItem("gt_logs", JSON.stringify(logs));
    localStorage.setItem("gt_plans", JSON.stringify(plans));
    localStorage.setItem("gt_timer", JSON.stringify(activeTimer));
}


/* ======================================================
   AFSNIT 03 – HJÆLPEFUNKTIONER
   ====================================================== */

function uuid() {
    return Date.now().toString() + Math.floor(Math.random() * 9999);
}

function formatTime(sec) {
    const h = String(Math.floor(sec / 3600)).padStart(2, "0");
    const m = String(Math.floor((sec % 3600) / 60)).padStart(2, "0");
    const s = String(sec % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
}


/* ======================================================
   AFSNIT 04 – POPULATE DROPDOWNS
   ====================================================== */

function populateCustomerSelects() {
    const ids = [
        "quickCustomerSelect",
        "timerCustomerSelect",
        "planCustomerSelect",
        "reportCustomerSelect",
        "resetCustomerSelect"
    ];

    ids.forEach(id => {
        const box = document.getElementById(id);
        if (!box) return;

        box.innerHTML = `<option value="">Vælg...</option>`;

        customers.forEach(c => {
            const opt = document.createElement("option");
            opt.value = c.id;
            opt.textContent = c.name;
            box.appendChild(opt);
        });
    });
}

function populateEmployeeSelects() {
    const ids = [
        "timerEmployeeSelect",
        "reportEmployeeSelect"
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

    renderQuickEmployeeChips();
    renderPlanEmployeeChips();
}


/* ======================================================
   AFSNIT 05 – QUICK TIMER MED MULTI-MEDARBEJDERE
   ====================================================== */

function renderQuickEmployeeChips() {
    const box = document.getElementById("quickEmployeeList");
    if (!box) return;

    box.innerHTML = "";

    employees.forEach(emp => {
        const lbl = document.createElement("label");
        lbl.className = "chip-check";
        lbl.innerHTML = `
            <input type="checkbox" value="${emp.id}">
            <span>${emp.name}</span>
        `;
        box.appendChild(lbl);
    });
}

function getQuickEmployees() {
    return Array.from(document.querySelectorAll("#quickEmployeeList input:checked"))
        .map(x => x.value);
}

function updateQuickTimerDisplay() {
    const disp = document.getElementById("quickTimerDisplay");
    if (!disp) return;

    if (quickTimer) {
        const diff = Math.floor((Date.now() - new Date(quickTimer.start).getTime()) / 1000);
        disp.textContent = formatTime(diff);
    }
}

function initQuickTimer() {
    document.getElementById("quickStartBtn").addEventListener("click", () => {
        const cust = document.getElementById("quickCustomerSelect").value;
        const emps = getQuickEmployees();
        if (!cust) return alert("Vælg kunde");
        if (emps.length === 0) return alert("Vælg medarbejdere");

        quickTimer = {
            customerId: cust,
            employeeIds: emps,
            start: new Date().toISOString()
        };

        quickInterval = setInterval(updateQuickTimerDisplay, 1000);
        updateQuickTimerDisplay();
    });

    document.getElementById("quickStopBtn").addEventListener("click", () => {
        if (!quickTimer) return;

        const end = new Date();
        const start = new Date(quickTimer.start);

        const minutes = Math.max(1, Math.round((end - start) / 60000));

        quickTimer.employeeIds.forEach(eid => {
            const e = employees.find(x => x.id === eid);

            logs.push({
                id: uuid(),
                customerId: quickTimer.customerId,
                employeeId: eid,
                employee: e ? e.name : "?",
                startTime: quickTimer.start,
                endTime: end.toISOString(),
                duration: minutes
            });
        });

        quickTimer = null;
        clearInterval(quickInterval);
        updateQuickTimerDisplay();
        saveAll();
        renderTodayLogs();
    });
}


/* ======================================================
   AFSNIT 06 – KUNDER
   ====================================================== */

function initCustomerSave() {
    document.getElementById("saveCustomerBtn")?.addEventListener("click", () => {
        const name = custName.value.trim();
        if (!name) return alert("Skriv navn");

        customers.push({
            id: uuid(),
            name,
            phone: custPhone.value,
            email: custEmail.value,
            address: custAddress.value
        });

        saveAll();
        populateCustomerSelects();
        renderCustomerTable();

        custName.value = "";
        custPhone.value = "";
        custEmail.value = "";
        custAddress.value = "";
    });
}

function renderCustomerTable() {
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
}


/* ======================================================
   AFSNIT 07 – MEDARBEJDERE
   ====================================================== */

function initEmployeeSave() {
    document.getElementById("saveEmployeeBtn")?.addEventListener("click", () => {
        const name = empName.value.trim();
        if (!name) return alert("Skriv navn");

        employees.push({
            id: uuid(),
            name,
            email: empEmail.value,
            role: empRole.value
        });

        saveAll();
        populateEmployeeSelects();
        renderEmployeeTable();

        empName.value = "";
        empEmail.value = "";
        empRole.value = "medarbejder";
    });
}

function renderEmployeeTable() {
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
}


/* ======================================================
   AFSNIT 08 – DETALJERET TIMER
   ====================================================== */

function initDetailedTimer() {
    startTimerBtn?.addEventListener("click", () => {
        const cust = timerCustomerSelect.value;
        const emp = timerEmployeeSelect.value;

        if (!cust || !emp) return alert("Vælg kunde og medarbejder");

        activeTimer = {
            customerId: cust,
            employeeId: emp,
            start: new Date().toISOString()
        };

        saveAll();
        renderTimerStatus();
    });

    stopTimerBtn?.addEventListener("click", () => {
        if (!activeTimer) return;

        const end = new Date();
        const start = new Date(activeTimer.start);

        const minutes = Math.max(1, Math.round((end - start) / 60000));

        const emp = employees.find(x => x.id === activeTimer.employeeId);

        logs.push({
            id: uuid(),
            customerId: activeTimer.customerId,
            employeeId: activeTimer.employeeId,
            employee: emp?.name || "?",
            startTime: activeTimer.start,
            endTime: end.toISOString(),
            duration: minutes
        });

        activeTimer = null;
        saveAll();
        renderTimerStatus();
        renderTodayLogs();
    });
}

function renderTimerStatus() {
    const box = document.getElementById("timerStatus");
    if (!box) return;

    if (!activeTimer) {
        box.textContent = "Ingen aktiv timer";
    } else {
        const cust = customers.find(x => x.id === activeTimer.customerId);
        const emp = employees.find(x => x.id === activeTimer.employeeId);
        box.textContent = `Kører for ${cust?.name} – ${emp?.name}`;
    }
}


/* ======================================================
   AFSNIT 09 – LOGS
   ====================================================== */

function renderTodayLogs() {
    const tbody = document.querySelector("#timeLogTable tbody");
    if (!tbody) return;

    const today = new Date().toISOString().slice(0, 10);

    tbody.innerHTML = "";

    logs.filter(l => l.startTime.slice(0, 10) === today)
        .forEach(l => {
            const cust = customers.find(c => c.id === l.customerId);
            const tr = document.createElement("tr");

            tr.innerHTML = `
                <td>${new Date(l.startTime).toLocaleTimeString()}</td>
                <td>${new Date(l.endTime).toLocaleTimeString()}</td>
                <td>${l.duration}</td>
                <td>${cust?.name}</td>
                <td>${l.employee}</td>
            `;
            tbody.appendChild(tr);
        });
}


/* ======================================================
   AFSNIT 10 – PLANLÆG OPGAVER (MULTI-MEDARBEJDERE)
   ====================================================== */

function renderPlanEmployeeChips() {
    const box = document.getElementById("planEmployeeList");
    if (!box) return;

    box.innerHTML = "";

    employees.forEach(emp => {
        const lbl = document.createElement("label");
        lbl.className = "chip-check";
        lbl.innerHTML = `
            <input type="checkbox" value="${emp.id}">
            <span>${emp.name}</span>
        `;
        box.appendChild(lbl);
    });
}

function initPlanning() {
    savePlanBtn?.addEventListener("click", () => {
        const date = planDate.value;
        if (!date) return alert("Vælg dato");

        const start = planStart.value;
        const dur = Number(planDuration.value);
        const cust = planCustomerSelect.value;
        const note = planNote.value;

        const employeesSelected = Array.from(
            document.querySelectorAll("#planEmployeeList input:checked")
        ).map(cb => cb.value);

        plans.push({
            id: uuid(),
            date,
            start,
            duration: dur,
            customerId: cust,
            employeeIds: employeesSelected,
            employeeNames: employeesSelected.map(id => employees.find(e => e.id === id)?.name || "?"),
            note
        });

        saveAll();
        renderCalendar();
        if (selectedCalendarDate === date) renderDayPlanList();
    });
}


/* ======================================================
   AFSNIT 11 – KALENDER
   ====================================================== */

function ymd(d) {
    return d.toISOString().slice(0, 10);
}

function renderCalendar() {
    const box = document.getElementById("calendarCells");
    const label = document.getElementById("calMonthLabel");
    if (!box || !label) return;

    box.innerHTML = "";

    const y = calendarMonth.getFullYear();
    const m = calendarMonth.getMonth();

    label.textContent = calendarMonth.toLocaleDateString("da-DK", {
        month: "long",
        year: "numeric"
    });

    const first = new Date(y, m, 1);
    const days = new Date(y, m + 1, 0).getDate();

    const empty = (first.getDay() + 6) % 7;

    for (let i = 0; i < empty; i++) {
        const div = document.createElement("div");
        div.className = "calendar-cell empty";
        box.appendChild(div);
    }

    for (let d = 1; d <= days; d++) {
        const date = new Date(y, m, d);
        const ds = ymd(date);

        const div = document.createElement("div");
        div.className = "calendar-cell";
        div.dataset.date = ds;
        div.innerHTML = d;

        if (ds === selectedCalendarDate) {
            div.classList.add("selected");
        }

        div.addEventListener("click", () => {
            selectedCalendarDate = ds;
            renderCalendar();
            renderDayPlanList();
        });

        box.appendChild(div);
    }
}

function renderDayPlanList() {
    const list = document.getElementById("dayPlanList");
    const label = document.getElementById("selectedDayLabel");
    if (!list || !label) return;

    list.innerHTML = "";
    if (!selectedCalendarDate) {
        label.textContent = "Klik på en dag for at se opgaver";
        return;
    }

    label.textContent = selectedCalendarDate;

    const items = plans.filter(p => p.date === selectedCalendarDate);

    if (items.length === 0) {
        list.innerHTML = "<li>Ingen opgaver denne dag</li>";
    } else {
        items.forEach(p => {
            const cust = customers.find(c => c.id === p.customerId);
            const li = document.createElement("li");
            li.textContent = `${p.start} – ${cust?.name || "?"} – ${p.employeeNames.join(", ")} (${p.duration} min)`;
            list.appendChild(li);
        });
    }
}


/* ======================================================
   AFSNIT 12 – RAPPORTER
   ====================================================== */

function initReports() {
    runReportBtn?.addEventListener("click", () => {
        const tbody = document.querySelector("#reportTable tbody");
        const sum = document.getElementById("reportSummary");
        if (!tbody) return;

        tbody.innerHTML = "";

        let data = logs.slice();

        const f = reportDateFrom.value;
        const t = reportDateTo.value;
        const c = reportCustomerSelect.value;
        const e = reportEmployeeSelect.value;

        if (f) data = data.filter(x => x.startTime.slice(0, 10) >= f);
        if (t) data = data.filter(x => x.startTime.slice(0, 10) <= t);
        if (c) data = data.filter(x => x.customerId === c);
        if (e) data = data.filter(x => x.employeeId === e);

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

        sum.textContent = `Total minutter: ${total}`;
    });
}


/* ======================================================
   AFSNIT 13 – SIDEBAR / NAVIGATION
   ====================================================== */

function initNavigation() {
    document.querySelectorAll(".sidebar li").forEach(li => {
        li.addEventListener("click", () => {
            document.querySelectorAll(".page").forEach(p => p.classList.remove("visible"));
            document.getElementById(li.dataset.page).classList.add("visible");

            document.querySelectorAll(".sidebar li").forEach(x => x.classList.remove("active"));
            li.classList.add("active");
        });
    });
}


/* ======================================================
   AFSNIT 14 – TEMA (LYS / MØRK)
   ====================================================== */

function initTheme() {
    currentTheme = localStorage.getItem("gt_theme") || "light";
    document.documentElement.dataset.theme = currentTheme;
}

function initThemeButton() {
    document.getElementById("themeToggle")?.addEventListener("click", () => {
        currentTheme = currentTheme === "light" ? "dark" : "light";
        document.documentElement.dataset.theme = currentTheme;
        localStorage.setItem("gt_theme", currentTheme);
    });
}


/* ======================================================
   AFSNIT 15 – INITIALISERING (RETTET VERSION)
   ====================================================== */

window.addEventListener("load", () => {
    loadAll();

    // UI og tema
    initNavigation();
    initTheme();
    initThemeButton();

    // Dropdowns og tabeller
    populateCustomerSelects();
    populateEmployeeSelects();

    renderCustomerTable();
    renderEmployeeTable();
    renderTodayLogs();
    renderCalendar();

    // Funktionelle moduler
    initCustomerSave();
    initEmployeeSave();
    initQuickTimer();
    initDetailedTimer();
    initPlanning();
    initReports();
});
