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
let currentTheme = "light";

let calendarMonth = new Date();       // den måned der vises i kalenderen
let selectedCalendarDate = null;      // "yyyy-mm-dd" string

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
        const val = JSON.parse(raw);
        return val ?? fallback;
    } catch (e) {
        console.warn("Kunne ikke parse localStorage for", key, e);
        return fallback;
    }
}


/* ======================================================
   AFSNIT 02 – LOCAL STORAGE (LOAD / SAVE)
   ====================================================== */

function loadAll() {
    customers = safeParse(STORAGE_KEYS.customers, []);
    employees = safeParse(STORAGE_KEYS.employees, []);
    logs      = safeParse(STORAGE_KEYS.logs, []);
    plans     = safeParse(STORAGE_KEYS.plans, []);

    activeTimer = safeParse(STORAGE_KEYS.activeTimer, null);
    quickTimer  = safeParse(STORAGE_KEYS.quickTimer, null);

    currentTheme = safeParse(STORAGE_KEYS.theme, "light");
    currentLang  = safeParse(STORAGE_KEYS.lang, "da");
}

function saveAll() {
    localStorage.setItem(STORAGE_KEYS.customers, JSON.stringify(customers));
    localStorage.setItem(STORAGE_KEYS.employees, JSON.stringify(employees));
    localStorage.setItem(STORAGE_KEYS.logs, JSON.stringify(logs));
    localStorage.setItem(STORAGE_KEYS.plans, JSON.stringify(plans));
    localStorage.setItem(STORAGE_KEYS.activeTimer, JSON.stringify(activeTimer));
    localStorage.setItem(STORAGE_KEYS.quickTimer, JSON.stringify(quickTimer));
    localStorage.setItem(STORAGE_KEYS.theme, JSON.stringify(currentTheme));
    localStorage.setItem(STORAGE_KEYS.lang, JSON.stringify(currentLang));
}


/* ======================================================
   AFSNIT 03 – SPROG & TEMA
   (sprog-knapperne virker og husker valg,
    teksterne kan vi oversætte senere hvis du ønsker)
   ====================================================== */

function initTheme() {
    if (!currentTheme) currentTheme = "light";
    document.documentElement.dataset.theme = currentTheme;
}

function initThemeToggle() {
    const btn = document.getElementById("themeToggle");
    if (!btn) return;

    btn.addEventListener("click", () => {
        currentTheme = currentTheme === "light" ? "dark" : "light";
        document.documentElement.dataset.theme = currentTheme;
        localStorage.setItem(STORAGE_KEYS.theme, JSON.stringify(currentTheme));
    });
}

function applyLangActiveButton() {
    const buttons = document.querySelectorAll(".lang-btn");
    buttons.forEach(btn => {
        const lang = btn.dataset.lang;
        btn.classList.toggle("active", lang === currentLang);
    });
}

function initLanguage() {
    if (!currentLang) currentLang = "da";

    applyLangActiveButton();

    const buttons = document.querySelectorAll(".lang-btn");
    buttons.forEach(btn => {
        btn.addEventListener("click", () => {
            const lang = btn.dataset.lang;
            if (!lang) return;
            currentLang = lang;
            localStorage.setItem(STORAGE_KEYS.lang, JSON.stringify(currentLang));
            applyLangActiveButton();
            // Teksterne står allerede på dansk – oversættelser kan tilføjes senere
        });
    });
}


/* ======================================================
   AFSNIT 04 – NAVIGATION MELLEM SIDER
   ====================================================== */

function initNavigation() {
    const pages = document.querySelectorAll(".page");
    const menuItems = document.querySelectorAll(".sidebar li[data-page]");

    function showPage(id) {
        pages.forEach(p => p.classList.toggle("visible", p.id === id));
        menuItems.forEach(li => {
            li.classList.toggle("active", li.dataset.page === id);
        });
    }

    menuItems.forEach(li => {
        li.addEventListener("click", () => {
            const target = li.dataset.page;
            if (target) showPage(target);
        });
    });

    // sørg for at en side er synlig fra start
    showPage("dashboardPage");
}


/* ======================================================
   AFSNIT 05 – KUNDER
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
        const el = document.getElementById(id);
        if (!el) return;
        el.innerHTML = `<option value="">Vælg kunde</option>`;
        customers.forEach(c => {
            const opt = document.createElement("option");
            opt.value = c.id;
            opt.textContent = c.name;
            el.appendChild(opt);
        });
    });
}

function renderCustomerTable() {
    const table = document.getElementById("customerTable");
    if (!table) return;
    const tbody = table.querySelector("tbody");
    if (!tbody) return;

    tbody.innerHTML = "";
    customers.forEach(c => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${c.name || ""}</td>
            <td>${c.phone || ""}</td>
            <td>${c.email || ""}</td>
            <td>${c.address || ""}</td>
        `;
        tbody.appendChild(tr);
    });
}

function initCustomers() {
    const nameInput    = document.getElementById("custName");
    const phoneInput   = document.getElementById("custPhone");
    const emailInput   = document.getElementById("custEmail");
    const addressInput = document.getElementById("custAddress");
    const saveBtn      = document.getElementById("saveCustomerBtn");

    if (!saveBtn) return;

    saveBtn.addEventListener("click", () => {
        const name = nameInput.value.trim();
        if (!name) {
            alert("Skriv et kundenavn.");
            return;
        }

        customers.push({
            id: uuid(),
            name,
            phone: phoneInput.value.trim(),
            email: emailInput.value.trim(),
            address: addressInput.value.trim()
        });

        saveAll();
        refreshCustomerSelects();
        renderCustomerTable();

        nameInput.value = "";
        phoneInput.value = "";
        emailInput.value = "";
        addressInput.value = "";
    });
}


/* ======================================================
   AFSNIT 06 – MEDARBEJDERE
   ====================================================== */

function renderEmployeeTable() {
    const table = document.getElementById("employeeTable");
    if (!table) return;
    const tbody = table.querySelector("tbody");
    if (!tbody) return;

    tbody.innerHTML = "";
    employees.forEach(e => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${e.name || ""}</td>
            <td>${e.email || ""}</td>
            <td>${e.role || ""}</td>
        `;
        tbody.appendChild(tr);
    });
}

function renderEmployeeChips(targetId) {
    const box = document.getElementById(targetId);
    if (!box) return;
    box.innerHTML = "";

    employees.forEach(emp => {
        const label = document.createElement("label");
        label.className = "chip-check";
        label.innerHTML = `
            <input type="checkbox" value="${emp.id}">
            <span>${emp.name}</span>
        `;
        box.appendChild(label);
    });
}

function refreshEmployeeSelectsAndChips() {
    // selects
    const ids = ["timerEmployeeSelect", "reportEmployeeSelect"];
    ids.forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        el.innerHTML = `<option value="">Vælg medarbejder</option>`;
        employees.forEach(e => {
            const opt = document.createElement("option");
            opt.value = e.id;
            opt.textContent = e.name;
            el.appendChild(opt);
        });
    });

    // chips
    renderEmployeeChips("quickEmployeeList");
    renderEmployeeChips("planEmployeeList");
}

function initEmployees() {
    const nameInput  = document.getElementById("empName");
    const emailInput = document.getElementById("empEmail");
    const roleSelect = document.getElementById("empRole");
    const saveBtn    = document.getElementById("saveEmployeeBtn");

    if (!saveBtn) return;

    saveBtn.addEventListener("click", () => {
        const name = nameInput.value.trim();
        if (!name) {
            alert("Skriv et navn på medarbejderen.");
            return;
        }

        employees.push({
            id: uuid(),
            name,
            email: emailInput.value.trim(),
            role: roleSelect.value || "employee"
        });

        saveAll();
        renderEmployeeTable();
        refreshEmployeeSelectsAndChips();

        nameInput.value = "";
        emailInput.value = "";
        roleSelect.value = "employee";
    });
}


/* ======================================================
   AFSNIT 07 – QUICK TIMER (FORSIDE)
   ====================================================== */

function getSelectedIdsFromChipList(containerId) {
    const box = document.getElementById(containerId);
    if (!box) return [];
    return Array.from(box.querySelectorAll("input[type=checkbox]:checked"))
        .map(cb => cb.value);
}

function updateQuickTimerDisplay() {
    const display = document.getElementById("quickTimerDisplay");
    if (!display) return;

    // sørg for at CSS-klassen passer til din CSS-fil
    display.classList.add("quick-timer-display");

    if (!quickTimer) {
        display.textContent = "00:00:00";
        return;
    }

    const start = new Date(quickTimer.start);
    const now   = new Date();
    const diffSeconds = Math.floor((now - start) / 1000);
    display.textContent = formatTimeFromSeconds(Math.max(diffSeconds, 0));
}

function stopQuickInterval() {
    if (quickIntervalId) {
        clearInterval(quickIntervalId);
        quickIntervalId = null;
    }
}

function startQuickIntervalIfNeeded() {
    stopQuickInterval();
    if (quickTimer) {
        updateQuickTimerDisplay();
        quickIntervalId = setInterval(updateQuickTimerDisplay, 1000);
    } else {
        updateQuickTimerDisplay();
    }
}

function initQuickTimer() {
    const startBtn = document.getElementById("quickStartBtn");
    const stopBtn  = document.getElementById("quickStopBtn");
    const customerSelect = document.getElementById("quickCustomerSelect");

    if (!startBtn || !stopBtn || !customerSelect) return;

    startBtn.addEventListener("click", () => {
        const customerId = customerSelect.value;
        const employeeIds = getSelectedIdsFromChipList("quickEmployeeList");

        if (!customerId) {
            alert("Vælg en kunde først.");
            return;
        }
        if (employeeIds.length === 0) {
            alert("Vælg mindst én medarbejder.");
            return;
        }

        quickTimer = {
            customerId,
            employeeIds,
            start: new Date().toISOString()
        };

        saveAll();
        startQuickIntervalIfNeeded();
    });

    stopBtn.addEventListener("click", () => {
        if (!quickTimer) return;

        const end   = new Date();
        const start = new Date(quickTimer.start);
        const minutes = Math.max(1, Math.round((end - start) / 60000));

        quickTimer.employeeIds.forEach(empId => {
            const emp  = employees.find(e => e.id === empId);
            const name = emp ? emp.name : "Ukendt";

            logs.push({
                id: uuid(),
                customerId: quickTimer.customerId,
                employeeId: empId,
                employeeName: name,
                startTime: start.toISOString(),
                endTime: end.toISOString(),
                minutes
            });
        });

        quickTimer = null;
        saveAll();
        stopQuickInterval();
        updateQuickTimerDisplay();
        renderTodayLogs();
    });

    // hvis der var en aktiv quickTimer gemt
    startQuickIntervalIfNeeded();
}


/* ======================================================
   AFSNIT 08 – DETALJERET TIMER & DAGENS LOGS
   ====================================================== */

function setTimerButtonsState() {
    const startBtn = document.getElementById("startTimerBtn");
    const stopBtn  = document.getElementById("stopTimerBtn");
    const statusEl = document.getElementById("timerStatus");

    if (!startBtn || !stopBtn || !statusEl) return;

    if (!activeTimer) {
        startBtn.disabled = false;
        stopBtn.disabled  = true;
        statusEl.textContent = "Ingen aktiv timer.";
    } else {
        startBtn.disabled = true;
        stopBtn.disabled  = false;

        const cust = customers.find(c => c.id === activeTimer.customerId);
        const emp  = employees.find(e => e.id === activeTimer.employeeId);
        statusEl.textContent = `Aktiv for ${cust ? cust.name : "kunde"} – ${emp ? emp.name : "medarbejder"}`;
    }
}

function renderTodayLogs() {
    const table = document.getElementById("timeLogTable");
    if (!table) return;
    const tbody = table.querySelector("tbody");
    if (!tbody) return;

    const todayStr = toDateString(new Date());
    tbody.innerHTML = "";

    logs
        .filter(l => l.startTime.slice(0, 10) === todayStr)
        .forEach(l => {
            const tr = document.createElement("tr");

            const cust = customers.find(c => c.id === l.customerId);
            const custName = cust ? cust.name : "";

            tr.innerHTML = `
                <td>${new Date(l.startTime).toLocaleTimeString()}</td>
                <td>${new Date(l.endTime).toLocaleTimeString()}</td>
                <td>${l.minutes}</td>
                <td>${custName}</td>
                <td>${l.employeeName || ""}</td>
            `;
            tbody.appendChild(tr);
        });
}

function initDetailedTimer() {
    const startBtn = document.getElementById("startTimerBtn");
    const stopBtn  = document.getElementById("stopTimerBtn");
    const customerSelect = document.getElementById("timerCustomerSelect");
    const employeeSelect = document.getElementById("timerEmployeeSelect");

    if (!startBtn || !stopBtn || !customerSelect || !employeeSelect) return;

    startBtn.addEventListener("click", () => {
        const customerId = customerSelect.value;
        const employeeId = employeeSelect.value;

        if (!customerId || !employeeId) {
            alert("Vælg både kunde og medarbejder.");
            return;
        }

        activeTimer = {
            customerId,
            employeeId,
            start: new Date().toISOString()
        };
        saveAll();
        setTimerButtonsState();
    });

    stopBtn.addEventListener("click", () => {
        if (!activeTimer) return;

        const end   = new Date();
        const start = new Date(activeTimer.start);
        const minutes = Math.max(1, Math.round((end - start) / 60000));

        const emp = employees.find(e => e.id === activeTimer.employeeId);

        logs.push({
            id: uuid(),
            customerId: activeTimer.customerId,
            employeeId: activeTimer.employeeId,
            employeeName: emp ? emp.name : "",
            startTime: start.toISOString(),
            endTime: end.toISOString(),
            minutes
        });

        activeTimer = null;
        saveAll();
        setTimerButtonsState();
        renderTodayLogs();
    });

    setTimerButtonsState();
}


/* ======================================================
   AFSNIT 09 – NULSTIL TID FOR KUNDE
   ====================================================== */

function initCustomerReset() {
    const select = document.getElementById("resetCustomerSelect");
    const btn    = document.getElementById("resetCustomerTimeBtn");
    const info   = document.getElementById("resetCustomerInfo");

    if (!select || !btn || !info) return;

    btn.addEventListener("click", () => {
        const cid = select.value;
        if (!cid) {
            alert("Vælg en kunde, der skal nulstilles.");
            return;
        }

        const before = logs.length;
        logs = logs.filter(l => l.customerId !== cid);
        const removed = before - logs.length;

        saveAll();
        renderTodayLogs();

        const cust = customers.find(c => c.id === cid);
        const name = cust ? cust.name : "kunden";
        info.textContent = `Nulstillede ${removed} log(s) for ${name}.`;
    });
}


/* ======================================================
   AFSNIT 10 – PLANLÆG OPGAVER (MULTI-MEDARBEJDERE)
   ====================================================== */

function initPlanning() {
    const dateInput     = document.getElementById("planDate");
    const startInput    = document.getElementById("planStart");
    const durationInput = document.getElementById("planDuration");
    const customerSelect= document.getElementById("planCustomerSelect");
    const noteInput     = document.getElementById("planNote");
    const saveBtn       = document.getElementById("savePlanBtn");

    if (!dateInput || !startInput || !durationInput || !customerSelect || !saveBtn) return;

    saveBtn.addEventListener("click", () => {
        const date = dateInput.value;
        const start = startInput.value;
        const duration = parseInt(durationInput.value, 10) || 0;
        const customerId = customerSelect.value;
        const employeeIds = getSelectedIdsFromChipList("planEmployeeList");
        const note = noteInput.value.trim();

        if (!date) {
            alert("Vælg en dato.");
            return;
        }
        if (!start) {
            alert("Vælg en starttid.");
            return;
        }
        if (!customerId) {
            alert("Vælg en kunde.");
            return;
        }
        if (duration <= 0) {
            alert("Skriv en varighed i minutter.");
            return;
        }

        plans.push({
            id: uuid(),
            date,
            start,
            duration,
            customerId,
            employeeIds,
            note
        });

        saveAll();
        renderCalendar();
        renderDayDetails();

        // ryd felter
        // (dato lader vi stå – det giver mening at oprette flere den dag)
        startInput.value = "";
        durationInput.value = "";
        noteInput.value = "";
        const chipBox = document.getElementById("planEmployeeList");
        if (chipBox) {
            chipBox.querySelectorAll("input[type=checkbox]").forEach(cb => cb.checked = false);
        }
    });
}


/* ======================================================
   AFSNIT 11 – KALENDER RENDERING (FARVER & NAVIGATION)
   ====================================================== */

function getPlanCountForDate(dateStr) {
    return plans.filter(p => p.date === dateStr).length;
}

function renderCalendar() {
    const cellsContainer = document.getElementById("calendarCells");
    const monthLabel     = document.getElementById("calMonthLabel");
    if (!cellsContainer || !monthLabel) return;

    // Sørg for at vi altid bruger den 1. i måneden i calendarMonth
    calendarMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), 1);

    const year  = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth(); // 0-11

    monthLabel.textContent = calendarMonth.toLocaleDateString("da-DK", {
        month: "long",
        year: "numeric"
    });

    cellsContainer.innerHTML = "";

    const firstOfMonth = new Date(year, month, 1);
    const daysInMonth  = new Date(year, month + 1, 0).getDate();

    // Mandag som første dag (0 = mandag, 6 = søndag)
    const firstWeekday = (firstOfMonth.getDay() + 6) % 7;

    // tomme felter før dag 1
    for (let i = 0; i < firstWeekday; i++) {
        const empty = document.createElement("div");
        empty.className = "calendar-cell";
        cellsContainer.appendChild(empty);
    }

    const todayStr = toDateString(new Date());
    if (!selectedCalendarDate) {
        selectedCalendarDate = todayStr;
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const d = new Date(year, month, day);
        const dateStr = toDateString(d);
        const count   = getPlanCountForDate(dateStr);

        const btn = document.createElement("button");
        btn.className = "calendar-cell";
        btn.textContent = String(day);

        // farve efter antal opgaver
        if (count === 0) {
            btn.classList.add("calendar-day-empty");
        } else if (count >= 1 && count <= 4) {
            btn.classList.add("calendar-day-medium");
        } else {
            btn.classList.add("calendar-day-busy");
        }

        // marker valgt dag
        if (dateStr === selectedCalendarDate) {
            btn.classList.add("selected");
        }

        btn.addEventListener("click", () => {
            selectedCalendarDate = dateStr;
            const planDateInput = document.getElementById("planDate");
            if (planDateInput) {
                planDateInput.value = dateStr;
            }
            renderCalendar();
            renderDayDetails();
        });

        cellsContainer.appendChild(btn);
    }
}

function initCalendarNavigation() {
    const prevBtn = document.getElementById("prevMonthBtn");
    const nextBtn = document.getElementById("nextMonthBtn");

    if (prevBtn) {
        prevBtn.addEventListener("click", () => {
            calendarMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1);
            renderCalendar();
            renderDayDetails();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener("click", () => {
            calendarMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1);
            renderCalendar();
            renderDayDetails();
        });
    }
}


/* ======================================================
   AFSNIT 12 – DAGENS OPGAVER (UNDER KALENDER)
   ====================================================== */

function renderDayDetails() {
    const labelEl = document.getElementById("selectedDayLabel");
    const listEl  = document.getElementById("dayPlanList");
    if (!labelEl || !listEl) return;

    listEl.innerHTML = "";

    if (!selectedCalendarDate) {
        labelEl.textContent = "Klik på en dag for at se opgaver.";
        return;
    }

    const d = new Date(selectedCalendarDate);
    labelEl.textContent = `Opgaver for ${d.toLocaleDateString("da-DK")}`;

    const dayPlans = plans.filter(p => p.date === selectedCalendarDate);
    if (dayPlans.length === 0) {
        const li = document.createElement("li");
        li.textContent = "Ingen opgaver denne dag.";
        listEl.appendChild(li);
        return;
    }

    dayPlans.forEach(p => {
        const cust = customers.find(c => c.id === p.customerId);
        const custName = cust ? cust.name : "Kunde?";
        const emps = p.employeeIds
            .map(id => {
                const e = employees.find(emp => emp.id === id);
                return e ? e.name : "Medarbejder?";
            })
            .join(", ");

        const li = document.createElement("li");
        li.textContent = `${p.start} – ${custName} – ${emps} (${p.duration} min)${p.note ? " – " + p.note : ""}`;
        listEl.appendChild(li);
    });
}


/* ======================================================
   AFSNIT 13 – RAPPORTER
   ====================================================== */

function initReports() {
    const btn = document.getElementById("runReportBtn");
    if (!btn) return;

    btn.addEventListener("click", () => {
        const fromInput     = document.getElementById("reportDateFrom");
        const toInput       = document.getElementById("reportDateTo");
        const custSelect    = document.getElementById("reportCustomerSelect");
        const empSelect     = document.getElementById("reportEmployeeSelect");
        const table         = document.getElementById("reportTable");
        const summary       = document.getElementById("reportSummary");

        if (!table || !summary) return;
        const tbody = table.querySelector("tbody");
        if (!tbody) return;

        let filtered = logs.slice();

        const from = fromInput?.value || "";
        const to   = toInput?.value || "";
        const cid  = custSelect?.value || "";
        const eid  = empSelect?.value || "";

        if (from) {
            filtered = filtered.filter(l => l.startTime.slice(0,10) >= from);
        }
        if (to) {
            filtered = filtered.filter(l => l.startTime.slice(0,10) <= to);
        }
        if (cid) {
            filtered = filtered.filter(l => l.customerId === cid);
        }
        if (eid) {
            filtered = filtered.filter(l => l.employeeId === eid);
        }

        tbody.innerHTML = "";
        let totalMin = 0;

        filtered.forEach(l => {
            const tr = document.createElement("tr");
            const cust = customers.find(c => c.id === l.customerId);

            tr.innerHTML = `
                <td>${l.startTime.slice(0,10)}</td>
                <td>${new Date(l.startTime).toLocaleTimeString()}</td>
                <td>${new Date(l.endTime).toLocaleTimeString()}</td>
                <td>${l.minutes}</td>
                <td>${cust ? cust.name : ""}</td>
                <td>${l.employeeName || ""}</td>
            `;
            tbody.appendChild(tr);
            totalMin += l.minutes;
        });

        summary.textContent = `Total minutter: ${totalMin}`;
    });
}


/* ======================================================
   AFSNIT 14 – INITIALISERING (ALT STARTER HER)
   ====================================================== */

window.addEventListener("load", () => {
    // load data
    loadAll();

    // tema & sprog
    initTheme();
    initThemeToggle();
    initLanguage();

    // navigation
    initNavigation();

    // data-visning
    refreshCustomerSelects();
    renderCustomerTable();

    renderEmployeeTable();
    refreshEmployeeSelectsAndChips();

    renderTodayLogs();

    // kalender + plan
    renderCalendar();
    renderDayDetails();
    initCalendarNavigation();
    initPlanning();

    // funktioner
    initCustomers();
    initEmployees();
    initQuickTimer();
    initDetailedTimer();
    initCustomerReset();
    initReports();
});
