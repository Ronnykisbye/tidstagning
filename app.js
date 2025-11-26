console.log("LOADER DENNE APP.JS → VERSION GREEN-TIME-PRO");

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
let currentTheme = "dark";

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

function parseDateString(dateStr) {
    return new Date(`${dateStr}T00:00:00`);
}

function getLocaleForLang(lang) {
    switch (lang) {
        case "en": return "en-GB";
        case "de": return "de-DE";
        case "lt": return "lt-LT";
        default:   return "da-DK";
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

    currentTheme = safeParse(STORAGE_KEYS.theme, "dark");
    currentLang  = safeParse(STORAGE_KEYS.lang, "da");
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
   AFSNIT 03 – SPROG & TEMA
   (REN VERSION – MATCHER INDEX.HTML EARLY LOADER)
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
        menu_settings: "Indstillinger"
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
        menu_settings: "Settings"
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
        menu_settings: "Einstellungen"
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
        menu_settings: "Nustatymai"
    }
};

function t(key) {
    const langPack = translations[currentLang] || translations["da"];
    return langPack[key] || translations["da"][key] || "";
}

function applyTranslations() {
    document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.dataset.i18n;
        if (key) el.textContent = t(key);
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
            currentLang = btn.dataset.lang;
            localStorage.setItem(STORAGE_KEYS.lang, JSON.stringify(currentLang));
            applyLangActiveButton();
            applyTranslations();
        });
    });
}


/* ------------------------ TEMA ------------------------ */

function initThemeToggle() {
    const btn = document.getElementById("themeToggle");
    if (!btn) return;

    const current = document.documentElement.getAttribute("data-theme");
    btn.textContent = current === "light" ? "🌙" : "🌞";

    btn.addEventListener("click", () => {
        const now = document.documentElement.getAttribute("data-theme");
        const next = now === "light" ? "dark" : "light";
        document.documentElement.setAttribute("data-theme", next);
        btn.textContent = next === "light" ? "🌙" : "🌞";
        localStorage.setItem(STORAGE_KEYS.theme, JSON.stringify(next));
    });
}



/* ======================================================
   AFSNIT 04 – NAVIGATION / SIDEBAR
   ====================================================== */

function initNavigation() {
    const sidebar = document.getElementById("sidebar");
    const menuButtons = document.querySelectorAll(".menu-item");
    const allPages = document.querySelectorAll(".page");
    const pageTitle = document.getElementById("pageTitle");

    const menuToggle = document.getElementById("menuToggle");
    if (menuToggle) {
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

            sidebar.classList.remove("open");
        });
    });
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
        const sel = document.getElementById(id);
        if (!sel) return;

        sel.innerHTML = "";

        const isReport = id === "reportCustomerSelect";
        const placeholder = isReport ? "Alle kunder" : "Vælg kunde";

        const opt = document.createElement("option");
        opt.value = "";
        opt.textContent = placeholder;
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

            document.getElementById("resetCustomerInfo").textContent =
                `Slettede ${removed} registreringer for kunden.`;
        });
    }
}



/* ======================================================
   AFSNIT 06 – MEDARBEJDERE
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
    const ids = [
        "timerEmployeeSelect",
        "reportEmployeeSelect"
    ];

    ids.forEach(id => {
        const sel = document.getElementById(id);
        if (!sel) return;

        sel.innerHTML = "";

        const isReport = id === "reportEmployeeSelect";
        const placeholder = isReport ? "Alle medarbejdere" : "Vælg medarbejder";

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
   AFSNIT 07 – CHIP-HJÆLPEFUNKTIONER
   ====================================================== */

function getSelectedIdsFromChipList(containerId) {
    const box = document.getElementById(containerId);
    if (!box) return [];
    return [...box.querySelectorAll(".chip.selected")].map(chip => chip.dataset.id);
}



/* ======================================================
   AFSNIT 08 – QUICK TIMER (FORSIDE)
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
    });
}


/* ======================================================
   AFSNIT 09 – DETALJERET TIMER
   ====================================================== */

function initDetailedTimer() {
    const startBtn = document.getElementById("startTimerBtn");
    const stopBtn  = document.getElementById("stopTimerBtn");
    const statusEl = document.getElementById("timerStatus");

    if (!startBtn || !stopBtn) return;

    // Vis igangværende timer ved load
    if (activeTimer && statusEl) {
        const cName = getCustomerName(activeTimer.customerId);
        const eName = getEmployeeName(activeTimer.employeeId);
        statusEl.textContent = `${cName} / ${eName}`;
    } else if (statusEl) {
        statusEl.textContent = "Ingen aktiv timer";
    }

    /* ---------- START ---------- */
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

    /* ---------- STOP ---------- */
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
   AFSNIT 10 – DAGENS LOGS
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
   AFSNIT 11 – PLANLÆGNING (KALENDER + OPGAVER)
   ====================================================== */

function setupPlanDurationInput() {
    const inp = document.getElementById("planDuration");
    if (!inp) return;

    inp.min = "0.5";
    inp.max = "8";
    inp.step = "0.5";
    inp.placeholder = "0,5 – 8";
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

        // ryd
        startInput.value = "";
        durationInput.value = "";
        noteInput.value = "";
        document.querySelectorAll("#planEmployeeList .chip.selected")
            .forEach(chip => chip.classList.remove("selected"));

        saveAll();

        selectedCalendarDate = dateStr;
        renderCalendar();
        renderDayDetails(dateStr);
    });
}


/* ======================================================
   AFSNIT 12 – KALENDER (RENDER HELE MÅNEDEN)
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

    // Søndag=0 → mandag=0
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



/* ======================================================
   AFSNIT 13 – DAGEN OPGAVER (LISTE)
   ====================================================== */

function renderDayDetails(dateStr) {
    const label = document.getElementById("selectedDayLabel");
    const list  = document.getElementById("dayPlanList");
    if (!label || !list) return;

    if (!dateStr) {
        label.textContent = "Vælg en dato";
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
            <strong>${p.startTime}</strong> – ${durText}t  
            <br>Kunde: ${getCustomerName(p.customerId)}  
            <br>Note: ${p.note || ""}
        `;

        list.appendChild(li);
    });
}



/* ======================================================
   AFSNIT 14 – SKIFT MÅNED (FORRIGE / NÆSTE)
   ====================================================== */

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
}

document.addEventListener("DOMContentLoaded", initApp);
