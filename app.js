
console.log("LOADER DENNE APP.JS → VERSION 777");



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

let calendarMonth = new Date(); // den måned der vises i kalenderen
let selectedCalendarDate = null; // "yyyy-mm-dd" string

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

function getLocaleForLang(lang) {
    switch (lang) {
        case "en": return "en-GB";
        case "de": return "de-DE";
        case "lt": return "lt-LT";
        default:   return "da-DK";
    }
}

function parseDateString(dateStr) {
    // "yyyy-mm-dd" -> Date
    return new Date(`${dateStr}T00:00:00`);
}

/* ======================================================
   AFSNIT 02 – LOCAL STORAGE
   ====================================================== */

function loadAll() {
    customers   = safeParse(STORAGE_KEYS.customers, []);
    employees   = safeParse(STORAGE_KEYS.employees, []);
    logs        = safeParse(STORAGE_KEYS.logs, []);
    plans       = safeParse(STORAGE_KEYS.plans, []);
    activeTimer = safeParse(STORAGE_KEYS.activeTimer, null);
    quickTimer  = safeParse(STORAGE_KEYS.quickTimer, null);

    // VIGTIGT: Samme fallback som early theme loader i index.html
    // Hvis der IKKE er gemt noget tema → brug "dark"
    currentTheme = safeParse(STORAGE_KEYS.theme, "dark");

    // Sprog: "da" som standard
    currentLang  = safeParse(STORAGE_KEYS.lang, "da");
}

/* ======================================================
   AFSNIT 03 – SPROG & TEMA  (SAMLET OG FEJLFRI VERSION)
   ====================================================== */

/* ==========================
   03A – OVERSÆTTELSER
   ========================== */
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

/* ==========================
   03B – OVERSÆTTELSESFUNKTION
   ========================== */
function t(key) {
    const langPack = translations[currentLang] || translations["da"];
    return langPack[key] || translations["da"][key] || "";
}

/* =======================================
   03C – ANVEND OVERSÆTTELSER PÅ ELEMENTER
   ======================================= */
function applyTranslations() {
    document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.dataset.i18n;
        if (key) el.textContent = t(key);
    });
}

/* =======================================
   03D – MARKÉR AKTIV SPROGKNAP
   ======================================= */
function applyLangActiveButton() {
    document.querySelectorAll(".lang-btn").forEach(btn => {
        btn.classList.toggle("active", btn.dataset.lang === currentLang);
    });
}

/* =======================================
   03E – INITIALISER SPROG
   ======================================= */
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

/* ============================================================
   03F – LYS/MØRK TEMA (REN VERSION – FJERNER 1-SEKUND BLINK)
   ============================================================ */

/* VIGTIGT:
   Temaet LOADES nu KUN i index.html (EARLY THEME LOADER).
   Derfor skal app.js IKKE sætte tema ved load.
*/

function initTheme() {
    // tom – vi lader index.html bestemme initialt tema
}

function initThemeToggle() {
    const btn = document.getElementById("themeToggle");
    if (!btn) return;

    // Korrekt ikon ved load
    const current = document.documentElement.getAttribute("data-theme");
    btn.textContent = current === "light" ? "🌙" : "🌞";

    btn.addEventListener("click", () => {
        // Skift tema
        const now = document.documentElement.getAttribute("data-theme");
        const next = now === "light" ? "dark" : "light";

        // Opdater HTML
        document.documentElement.setAttribute("data-theme", next);

        // Gem rigtigt
        localStorage.setItem("gtp_theme", JSON.stringify(next));

        // Opdater ikon
        btn.textContent = next === "light" ? "🌙" : "🌞";
    });
}

/* ======================================================
   AFSNIT 03E – SIDEBAR TOGGLE (STABIL VERSION)
   ====================================================== */

/*
   Din sidebar er statisk i desktop-versionen,
   og der er ingen toggle-knap i layoutet endnu.

   Men app.js kalder stadig initSidebarToggle(),
   og derfor laver vi en sikker, tom funktion,
   som ikke ændrer noget – men forhindrer fejl.
*/

function initSidebarToggle() {
    // Kig efter en toggle-knap (på mobil)
    const btn = document.getElementById("sidebarToggle");
    const sidebar = document.getElementById("sidebar");

    // Hvis ingen knap findes → gør ingenting
    if (!btn || !sidebar) return;

    // Fremtidssikring: simple toggle
    btn.addEventListener("click", () => {
        sidebar.classList.toggle("open");
    });
}

/* ======================================================
   AFSNIT 04 – NAVIGATION & SIDEBAR
   (Stabil version – påvirker intet andet)
====================================================== */

function initNavigation() {
    const sidebar = document.getElementById("sidebar");
    const menuButtons = document.querySelectorAll(".menu-item");
    const allPages = document.querySelectorAll("section");
    const menuToggle = document.getElementById("menuToggle");

    if (!sidebar || !menuButtons || !allPages) return;

    /* ---------------------------------------------
       MOBIL: ÅBN/LUK SIDEBAR
    --------------------------------------------- */
    if (menuToggle) {
        menuToggle.addEventListener("click", () => {
            sidebar.classList.toggle("open");
        });
    }

    /* ---------------------------------------------
       SKIFT SIDE VED MENUKLIK
    --------------------------------------------- */
    menuButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const page = btn.dataset.page;
            if (!page) return;

            // skjul alle sider
            allPages.forEach(pg => pg.classList.remove("page-visible"));

            // vis valgt side
            const newPage = document.getElementById(page);
            if (newPage) {
                newPage.classList.add("page-visible");
            }

            // aktiv menu-knap
            menuButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            // opdater sidetitlen
            const title = document.getElementById("pageTitle");
            if (title) {
                title.textContent = btn.textContent.trim();
            }

            // luk menu på mobil
            sidebar.classList.remove("open");
        });
    });
}

/* ======================================================
   AUTO-INDLÆSNING AF NAVIGATION
====================================================== */

document.addEventListener("DOMContentLoaded", () => {
    initNavigation();
});



/* ======================================================
   AFSNIT 05 – KUNDER
   ====================================================== */

function refreshCustomerSelects() {
    const ids = [
        "quickCustomerSelect",
        "timerCustomerSelect",
        "planCustomerSelect",
        "reportCustomerSelect"
    ];

    ids.forEach(selectId => {
        const sel = document.getElementById(selectId);
        if (!sel) return;
        sel.innerHTML = "";

        const isReport = selectId === "reportCustomerSelect";
        const placeholder = isReport ? t("placeholder_all_customers")
                                     : t("placeholder_select_customer");

        const optEmpty = document.createElement("option");
        optEmpty.value = "";
        optEmpty.textContent = placeholder;
        sel.appendChild(optEmpty);

        customers.forEach(c => {
            const opt = document.createElement("option");
            opt.value = c.id;
            opt.textContent = c.name;
            sel.appendChild(opt);
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
    const saveBtn = document.getElementById("saveCustomerBtn");
    if (!saveBtn) return;

    saveBtn.addEventListener("click", () => {
        const nameInput  = document.getElementById("custName");
        const phoneInput = document.getElementById("custPhone");
        const emailInput = document.getElementById("custEmail");
        const addrInput  = document.getElementById("custAddress");

        const name  = nameInput.value.trim();
        const phone = phoneInput.value.trim();
        const email = emailInput.value.trim();
        const addr  = addrInput.value.trim();

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

        nameInput.value = "";
        phoneInput.value = "";
        emailInput.value = "";
        addrInput.value = "";

        saveAll();
        renderCustomerTable();
        refreshCustomerSelects();
    });

    const resetBtn = document.getElementById("resetCustomerTimeBtn");
    if (resetBtn) {
        resetBtn.addEventListener("click", () => {
            const sel = document.getElementById("resetCustomerSelect");
            if (!sel) return;
            const customerId = sel.value;
            if (!customerId) {
                alert(t("msg_reset_choose_customer"));
                return;
            }

            const before = logs.length;
            logs = logs.filter(l => l.customerId !== customerId);
            const removed = before - logs.length;

            saveAll();
            renderTodayLogs();
            initReports();

            const info = document.getElementById("resetCustomerInfo");
            if (info) {
                info.textContent = `${t("msg_reset_done_prefix")} ${removed} ${t("msg_reset_done_suffix")}`;
            }
        });
    }
}

/* ======================================================
   AFSNIT 05B – INIT DASHBOARD (GENOPBYGNING)
   ====================================================== */

function initDashboard() {
    console.log("INIT DASHBOARD KØRER…");

    // hent kunder + medarbejdere fra storage
    loadCustomers?.();
    loadEmployees?.();

    // byg dropdown til kunder
    if (typeof renderCustomerQuickSelect === "function") {
        renderCustomerQuickSelect();
    }

    // byg medarbejderchips
    if (typeof renderTimerEmployeeChips === "function") {
        renderTimerEmployeeChips();
    }

    // start timer systemet
    if (typeof initTimer === "function") {
        initTimer();
    }

    console.log("DASHBOARD KLAR ✔");
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

function refreshEmployeeSelects() {
    const ids = [
        "timerEmployeeSelect",
        "reportEmployeeSelect"
    ];

    ids.forEach(selectId => {
        const sel = document.getElementById(selectId);
        if (!sel) return;
        sel.innerHTML = "";

        const isReport = selectId === "reportEmployeeSelect";
        const placeholder = isReport ? t("placeholder_all_employees")
                                     : t("placeholder_select_employee");

        const optEmpty = document.createElement("option");
        optEmpty.value = "";
        optEmpty.textContent = placeholder;
        sel.appendChild(optEmpty);

        employees.forEach(e => {
            const opt = document.createElement("option");
            opt.value = e.id;
            opt.textContent = e.name;
            sel.appendChild(opt);
        });
    });
}

function renderEmployeeChips() {
    const quickBox = document.getElementById("quickEmployeeList");
    const planBox  = document.getElementById("planEmployeeList");

    if (quickBox) quickBox.innerHTML = "";
    if (planBox)  planBox.innerHTML  = "";

    employees.forEach(e => {
        if (quickBox) {
            const chip = document.createElement("button");
            chip.type = "button";
            chip.className = "chip";
            chip.dataset.id = e.id;
            chip.textContent = e.name;
            chip.addEventListener("click", () => {
                chip.classList.toggle("selected");
            });
            quickBox.appendChild(chip);
        }

        if (planBox) {
            const chip = document.createElement("button");
            chip.type = "button";
            chip.className = "chip";
            chip.dataset.id = e.id;
            chip.textContent = e.name;
            chip.addEventListener("click", () => {
                chip.classList.toggle("selected");
            });
            planBox.appendChild(chip);
        }
    });
}

function initEmployees() {
    const saveBtn = document.getElementById("saveEmployeeBtn");
    if (!saveBtn) return;

    saveBtn.addEventListener("click", () => {
        const nameInput  = document.getElementById("empName");
        const emailInput = document.getElementById("empEmail");
        const roleSelect = document.getElementById("empRole");

        const name  = nameInput.value.trim();
        const email = emailInput.value.trim();
        const role  = roleSelect.value || "employee";

        if (!name) {
            alert("Skriv et navn på medarbejderen.");
            return;
        }

        employees.push({
            id: uuid(),
            name,
            email,
            role: role === "admin" ? t("role_admin") : t("role_employee")
        });

        nameInput.value = "";
        emailInput.value = "";
        roleSelect.value = "employee";

        saveAll();
        renderEmployeeTable();
        refreshEmployeeSelects();
        renderEmployeeChips();
    });
}

/* ======================================================
   AFSNIT 07 – CHIP-HJÆLPEFUNKTIONER
   ====================================================== */

function getSelectedIdsFromChipList(containerId) {
    const box = document.getElementById(containerId);
    if (!box) return [];
    return Array.from(box.querySelectorAll(".chip.selected")).map(chip => chip.dataset.id);
}

/* ======================================================
   AFSNIT 08 – QUICK TIMER (FORSIDE)
   ====================================================== */

function updateQuickTimerDisplay() {
    const display = document.getElementById("quickTimerDisplay");
    if (!display) return;

    display.classList.add("quick-timer-display");

    if (!quickTimer) {
        display.textContent = "00:00:00";
        return;
    }

    const start = new Date(quickTimer.start);
    const now = new Date();
    const diffSec = Math.max(0, Math.floor((now - start) / 1000));
    display.textContent = formatTimeFromSeconds(diffSec);
}

function stopQuickInterval() {
    if (quickIntervalId != null) {
        clearInterval(quickIntervalId);
        quickIntervalId = null;
    }
}

function initQuickTimer() {
    const startBtn = document.getElementById("quickStartBtn");
    const stopBtn  = document.getElementById("quickStopBtn");
    const modeDay  = document.getElementById("quickModeDay");
    const modeTot  = document.getElementById("quickModeTotal");

    if (!startBtn || !stopBtn) return;

    // Hvis der allerede ligger en quickTimer i storage
    if (quickTimer && quickTimer.start) {
        quickIntervalId = setInterval(updateQuickTimerDisplay, 1000);
        updateQuickTimerDisplay();
    }

    startBtn.addEventListener("click", () => {
        const customerSel = document.getElementById("quickCustomerSelect");
        const customerId  = customerSel ? customerSel.value : "";

        if (!customerId) {
            alert(t("msg_select_customer"));
            return;
        }

        const employeeIds = getSelectedIdsFromChipList("quickEmployeeList");
        if (!employeeIds.length) {
            alert(t("msg_select_employees"));
            return;
        }

        let mode = "day";
        if (modeDay && modeDay.checked) mode = "day";
        if (modeTot && modeTot.checked) mode = "total";

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
        const now   = new Date();
        const diffSec = Math.max(0, Math.floor((now - start) / 1000));
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
        initReports();
    });
}

/* ======================================================
   AFSNIT 09 – DETALJERET TIMER & DAGENS LOGS
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
        statusEl.textContent = t("timer_no_active");
    }

    startBtn.addEventListener("click", () => {
        const custSel = document.getElementById("timerCustomerSelect");
        const empSel  = document.getElementById("timerEmployeeSelect");

        const customerId = custSel ? custSel.value : "";
        const employeeId = empSel  ? empSel.value  : "";

        if (!customerId || !employeeId) {
            alert(t("msg_select_customer_employee"));
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
            statusEl.textContent = `${getCustomerName(customerId)} / ${getEmployeeName(employeeId)}`;
        }
    });

    stopBtn.addEventListener("click", () => {
        if (!activeTimer) {
            alert(t("timer_no_active"));
            return;
        }

        const now = new Date();
        const start = new Date(activeTimer.start);
        const diffSec = Math.max(0, Math.floor((now - start) / 1000));
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
        initReports();

        if (statusEl) {
            statusEl.textContent = t("timer_no_active");
        }
    });
}

function renderTodayLogs() {
    const table = document.getElementById("timeLogTable");
    if (!table) return;
    const tbody = table.querySelector("tbody");
    if (!tbody) return;

    tbody.innerHTML = "";

    const todayStr = toDateString(new Date());
    const todaysLogs = logs.filter(l => l.date === todayStr);

    todaysLogs.forEach(l => {
        const tr = document.createElement("tr");
        const start = new Date(l.start);
        const end   = new Date(l.end);

        tr.innerHTML = `
            <td>${start.toLocaleTimeString(getLocaleForLang(currentLang), { hour: "2-digit", minute: "2-digit" })}</td>
            <td>${end.toLocaleTimeString(getLocaleForLang(currentLang), { hour: "2-digit", minute: "2-digit" })}</td>
            <td>${l.durationMinutes}</td>
            <td>${getCustomerName(l.customerId)}</td>
            <td>${getEmployeeName(l.employeeId)}</td>
        `;
        tbody.appendChild(tr);
    });
}

/* ======================================================
   AFSNIT 10 – NULSTIL TID FOR KUNDE
   (selve logikken sidder i initCustomers)
   ====================================================== */
// Se initCustomers ovenfor – her er kun heading for strukturens skyld.

/* ======================================================
   AFSNIT 11 – PLANLÆGNING (VARIGHED I HALVE TIMER)
   ====================================================== */

function setupPlanDurationInput() {
    const durationInput = document.getElementById("planDuration");
    if (!durationInput) return;

    // Vi bruger stadig <input type="number">, men tolker det som timer i trin á 0,5
    durationInput.min = "0.5";
    durationInput.max = "8";
    durationInput.step = "0.5";
    durationInput.placeholder = "0,5 – 8";
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

        if (!dateStr) {
            alert(t("msg_select_date"));
            return;
        }
        if (!startTime) {
            alert(t("msg_select_start"));
            return;
        }
        if (!customerId) {
            alert(t("msg_select_customer_plan"));
            return;
        }
        if (isNaN(durationHr) || durationHr < 0.5 || durationHr > 8) {
            alert(t("msg_duration_invalid"));
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

        // ryd felter (dato lader vi stå, så man kan oprette flere på samme dag)
        // start & duration nulstilles
        startInput.value = "";
        durationInput.value = "";
        noteInput.value = "";
        const chips = document.querySelectorAll("#planEmployeeList .chip.selected");
        chips.forEach(chip => chip.classList.remove("selected"));

        saveAll();

        selectedCalendarDate = dateStr;
        renderCalendar();
        renderDayDetails(dateStr);
    });
}

/* ======================================================
   AFSNIT 12 – KALENDER
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

    // mandag = 0
    const weekday = firstOfMonth.getDay(); // søndag=0, mandag=1...
    const mondayIndex = (weekday + 6) % 7;

    for (let i = 0; i < mondayIndex; i++) {
        const emptyCell = document.createElement("div");
        emptyCell.className = "calendar-cell";
        cellsContainer.appendChild(emptyCell);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
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

        cell.textContent = day.toString();

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
   AFSNIT 13 – DAGEN OPGAVER (DETAILLISTE)
   ====================================================== */

function renderDayDetails(dateStr) {
    const label = document.getElementById("selectedDayLabel");
    const list  = document.getElementById("dayPlanList");
    if (!label || !list) return;

    if (!dateStr) {
        label.textContent = t("schedule_selected_day");
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
        li.textContent = t("msg_no_plans_for_day");
        list.appendChild(li);
        return;
    }

    dayPlans.forEach(p => {
        const li = document.createElement("li");
        const durHr = (p.durationMinutes || 0) / 60;
        const durText = durHr ? `${durHr.toString().replace(".", ",")} t` : "";
        const customerName = getCustomerName(p.customerId);
        const employeesNames = (p.employeeIds || []).map(getEmployeeName).filter(Boolean).join(", ");

        li.textContent = `${p.startTime || ""} – ${durText} – ${customerName}${
            employeesNames ? " (" + employeesNames + ")" : ""
        }${p.note ? " – " + p.note : ""}`;

        list.appendChild(li);
    });
}

/* ======================================================
   AFSNIT 14 – RAPPORTER
   ====================================================== */

function initReports() {
    refreshCustomerSelects();
    refreshEmployeeSelects();
    renderReportsTable([]);

    const runBtn = document.getElementById("runReportBtn");
    if (!runBtn) return;

    runBtn.addEventListener("click", () => {
        const fromInput = document.getElementById("reportDateFrom");
        const toInput   = document.getElementById("reportDateTo");
        const custSel   = document.getElementById("reportCustomerSelect");
        const empSel    = document.getElementById("reportEmployeeSelect");

        const fromStr = fromInput.value;
        const toStr   = toInput.value;
        const customerId = custSel.value;
        const employeeId = empSel.value;

        let result = logs.slice();

        if (fromStr) {
            result = result.filter(l => l.date >= fromStr);
        }
        if (toStr) {
            result = result.filter(l => l.date <= toStr);
        }
        if (customerId) {
            result = result.filter(l => l.customerId === customerId);
        }
        if (employeeId) {
            result = result.filter(l => l.employeeId === employeeId);
        }

        renderReportsTable(result);
    });
}

function renderReportsTable(rows) {
    const table = document.getElementById("reportTable");
    const summary = document.getElementById("reportSummary");
    if (!table) return;

    const tbody = table.querySelector("tbody");
    if (!tbody) return;
    tbody.innerHTML = "";

    rows.forEach(l => {
        const tr = document.createElement("tr");
        const start = new Date(l.start);
        const end   = new Date(l.end);

        tr.innerHTML = `
            <td>${l.date}</td>
            <td>${start.toLocaleTimeString(getLocaleForLang(currentLang), { hour: "2-digit", minute: "2-digit" })}</td>
            <td>${end.toLocaleTimeString(getLocaleForLang(currentLang), { hour: "2-digit", minute: "2-digit" })}</td>
            <td>${l.durationMinutes}</td>
            <td>${getCustomerName(l.customerId)}</td>
            <td>${getEmployeeName(l.employeeId)}</td>
        `;
        tbody.appendChild(tr);
    });

    if (summary) {
        summary.textContent = `${t("msg_report_summary_prefix")} ${rows.length} ${t("msg_report_summary_suffix")}`;
    }
}

/* ======================================================
   AFSNIT 15 – INITIALISERING
   ====================================================== */

window.addEventListener("load", () => {
    loadAll();

    initTheme();
    initThemeToggle();

    initLanguage();

    initNavigation();
    initSidebarToggle();

    renderCustomerTable();
    renderEmployeeTable();
    refreshCustomerSelects();
    refreshEmployeeSelects();
    renderEmployeeChips();

    initCustomers();
    initEmployees();

    initQuickTimer();
    initDetailedTimer();
    renderTodayLogs();

    initPlanning();
    renderCalendar();
    renderDayDetails(selectedCalendarDate);

    initReports();
});
