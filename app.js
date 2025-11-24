/* ======================================================
   AFSNIT 1. – GLOBAL VARIABLER
====================================================== */

let customers = [];
let employees = [];
let logs = [];
let plans = [];
let currentLang = "da";
let currentTheme = "dark";


/* ======================================================
   AFSNIT 2. – LOCALSTORAGE FUNKTIONER
====================================================== */

function saveAll() {
    localStorage.setItem("customers", JSON.stringify(customers));
    localStorage.setItem("employees", JSON.stringify(employees));
    localStorage.setItem("logs", JSON.stringify(logs));
    localStorage.setItem("plans", JSON.stringify(plans));
}

function loadAll() {
    customers = JSON.parse(localStorage.getItem("customers") || "[]");
    employees = JSON.parse(localStorage.getItem("employees") || "[]");
    logs = JSON.parse(localStorage.getItem("logs") || "[]");
    plans = JSON.parse(localStorage.getItem("plans") || "[]");
}


/* ======================================================
   AFSNIT 3. – SPROGDATABASE & SPROGSKIFT
====================================================== */

const translations = {
    da: {
        dashboard: "Tidsregistrering",
        customers: "Kunder",
        employees: "Medarbejdere",
        detailed: "Detaljeret tid",
        planner: "Plan & kalender",
        logs: "Logs",
        reports: "Rapporter",
        settings: "Indstillinger",
        today: "I dag",
        total: "Samlet tid"
    },
    en: {
        dashboard: "Time Tracking",
        customers: "Customers",
        employees: "Employees",
        detailed: "Detailed Time",
        planner: "Planner & Calendar",
        logs: "Logs",
        reports: "Reports",
        settings: "Settings",
        today: "Today",
        total: "Total Time"
    },
    de: {
        dashboard: "Zeiterfassung",
        customers: "Kunden",
        employees: "Mitarbeiter",
        detailed: "Detailzeit",
        planner: "Plan & Kalender",
        logs: "Protokolle",
        reports: "Berichte",
        settings: "Einstellungen",
        today: "Heute",
        total: "Gesamtzeit"
    },
    lt: {
        dashboard: "Laiko registravimas",
        customers: "Klientai",
        employees: "Darbuotojai",
        detailed: "Išsamus laikas",
        planner: "Planas ir kalendorius",
        logs: "Žurnalai",
        reports: "Ataskaitos",
        settings: "Nustatymai",
        today: "Šiandien",
        total: "Iš viso"
    }
};

function setLang(lang) {
    currentLang = lang;
    localStorage.setItem("lang", lang);
    applyTranslations();
    highlightActiveLanguage();
}

function applyTranslations() {
    document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.dataset.i18n;
        if (translations[currentLang][key]) {
            el.textContent = translations[currentLang][key];
        }
    });
}

function highlightActiveLanguage() {
    document.querySelectorAll(".lang-btn").forEach(btn => {
        if (btn.dataset.lang === currentLang) {
            btn.classList.add("active-lang");
        } else {
            btn.classList.remove("active-lang");
        }
    });
}


/* ======================================================
   AFSNIT 4. – TEMA (LIGHT / DARK MODE)
====================================================== */

function loadTheme() {
    const saved = localStorage.getItem("theme") || "dark";
    currentTheme = saved;
    document.documentElement.setAttribute("data-theme", saved);
}

function toggleTheme() {
    currentTheme = currentTheme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", currentTheme);
    localStorage.setItem("theme", currentTheme);

    const icon = document.getElementById("themeToggle");
    if (currentTheme === "light") icon.textContent = "🌙";
    else icon.textContent = "☀";
}


/* ======================================================
   AFSNIT 5. – NAVIGATION MELLEM SIDER
====================================================== */

function showPage(pageName) {
    document.querySelectorAll(".page").forEach(p => p.classList.remove("visible"));
    document.getElementById(pageName).classList.add("visible");

    document.querySelectorAll(".sidebar-nav button").forEach(btn => {
        if (btn.dataset.page === pageName) btn.classList.add("active");
        else btn.classList.remove("active");
    });
}


/* ======================================================
   AFSNIT 6. – EVENT LISTENERS (NAVIGATION / SPROG / TEMA)
====================================================== */

function initEventListeners() {

    // Sidebar navigation
    document.querySelectorAll(".sidebar-nav button").forEach(btn => {
        btn.addEventListener("click", () => {
            const page = btn.dataset.page;
            showPage(page);
        });
    });

    // Sprogskift
    document.querySelectorAll(".lang-btn").forEach(btn => {
        btn.addEventListener("click", () => setLang(btn.dataset.lang));
    });

    // Tema
    document.getElementById("themeToggle").addEventListener("click", toggleTheme);

    // Start / stop tid
    document.getElementById("startBtn").addEventListener("click", startTimer);
    document.getElementById("stopBtn").addEventListener("click", stopTimer);

    // Kunde
    document.getElementById("saveCustomerBtn").addEventListener("click", addCustomer);

    // Medarbejder
    document.getElementById("saveEmployeeBtn").addEventListener("click", addEmployee);

    // Plan (opgaver)
    document.getElementById("addPlanBtn").addEventListener("click", addPlan);
}


/* ======================================================
   AFSNIT 7. – TIMER FUNKTIONER
====================================================== */

let timerInterval;
let startTime = null;

function startTimer() {
    if (timerInterval) return;

    startTime = Date.now();
    timerInterval = setInterval(updateTimerUI, 500);
}

function stopTimer() {
    if (!timerInterval) return;

    clearInterval(timerInterval);
    timerInterval = null;

    const duration = Date.now() - startTime;
    saveLog(duration);
    updateLogList();
}

function updateTimerUI() {
    const elapsed = Date.now() - startTime;
    const h = Math.floor(elapsed / 3600000).toString().padStart(2, "0");
    const m = Math.floor((elapsed % 3600000) / 60000).toString().padStart(2, "0");
    const s = Math.floor((elapsed % 60000) / 1000).toString().padStart(2, "0");
    document.getElementById("liveTimer").textContent = `${h}:${m}:${s}`;
}


/* ======================================================
   AFSNIT 8. – LOG HÅNDTERING
====================================================== */

function saveLog(duration) {
    const customer = document.getElementById("customerSelect").value;
    const emps = [...document.getElementById("employeeSelect").selectedOptions].map(o => o.value);
    const timestamp = new Date().toISOString();

    logs.push({ customer, emps, duration, timestamp });
    saveAll();
}

function updateLogList() {
    const container = document.getElementById("logList");
    container.innerHTML = "";

    if (logs.length === 0) {
        container.innerHTML = `<div class="empty-state">Ingen logs</div>`;
        return;
    }

    logs.forEach(log => {
        const div = document.createElement("div");
        div.className = "log-entry";

        const hours = (log.duration / 3600000).toFixed(2);

        div.innerHTML = `
            <strong>Kunde:</strong> ${log.customer}<br>
            <strong>Medarb.:</strong> ${log.emps.join(", ")}<br>
            <strong>Timer:</strong> ${hours} t<br>
            <small>${new Date(log.timestamp).toLocaleString()}</small>
        `;
        container.appendChild(div);
    });
}


/* ======================================================
   AFSNIT 9. – KUNDER (MED SLET-KNAP)
====================================================== */

function addCustomer() {
    const name = document.getElementById("custName").value.trim();
    const phone = document.getElementById("custPhone").value.trim();
    const email = document.getElementById("custEmail").value.trim();
    const address = document.getElementById("custAddress").value.trim();

    if (!name) return;

    customers.push({
        id: Date.now(),   // unikt ID
        name,
        phone,
        email,
        address
    });

    saveAll();

    document.getElementById("custName").value = "";
    document.getElementById("custPhone").value = "";
    document.getElementById("custEmail").value = "";
    document.getElementById("custAddress").value = "";

    renderCustomers();
}

function renderCustomers() {
    const list = document.getElementById("customerList");
    const select = document.getElementById("customerSelect");

    list.innerHTML = "";
    select.innerHTML = "";

    if (customers.length === 0) {
        list.innerHTML = `<div class="empty-state">Ingen kunder</div>`;
        return;
    }

    customers.forEach((c) => {
        const item = document.createElement("div");
        item.className = "list-item";
        item.innerHTML = `
            <div><strong>${c.name}</strong></div>
            <div>📞 ${c.phone || "-"}</div>
            <div>📧 ${c.email || "-"}</div>
            <div>🏠 ${c.address || "-"}</div>
            <button class="btn-red delete-btn" data-id="${c.id}" style="margin-top:10px;">Slet kunde</button>
        `;
        list.appendChild(item);

        const opt = document.createElement("option");
        opt.value = c.id;
        opt.textContent = c.name;
        select.appendChild(opt);
    });

    // Gør alle slet-knapperne aktive
    document.querySelectorAll(".delete-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            deleteCustomer(btn.dataset.id);
        });
    });
}

function deleteCustomer(id) {
    customers = customers.filter(c => c.id.toString() !== id.toString());
    saveAll();
    renderCustomers();
}



/* ======================================================
   AFSNIT 10. – MEDARBEJDERE & CHIPS
====================================================== */

function addEmployee() {
    const name = document.getElementById("empName").value.trim();
    if (!name) return;

    employees.push({ name });
    saveAll();

    document.getElementById("empName").value = "";
    renderEmployees();
    renderEmployeeSelect();
}

function renderEmployees() {
    const list = document.getElementById("employeeList");
    list.innerHTML = "";

    if (employees.length === 0) {
        list.innerHTML = `<div class="empty-state">Ingen medarbejdere</div>`;
        return;
    }

    employees.forEach(emp => {
        const div = document.createElement("div");
        div.className = "list-item";
        div.innerHTML = `<span>${emp.name}</span>`;
        list.appendChild(div);
    });
}

function renderEmployeeSelect() {
    const select = document.getElementById("employeeSelect");
    const chips = document.getElementById("employeeChips");

    select.innerHTML = "";
    chips.innerHTML = "";

    employees.forEach(emp => {
        const opt = document.createElement("option");
        opt.value = emp.name;
        opt.textContent = emp.name;
        select.appendChild(opt);
    });

    select.addEventListener("change", () => {
        chips.innerHTML = "";
        [...select.selectedOptions].forEach(opt => {
            const chip = document.createElement("div");
            chip.className = "chip";
            chip.innerHTML = `${opt.value} <button data-remove="${opt.value}">x</button>`;
            chips.appendChild(chip);
        });
    });
}


/* ======================================================
   AFSNIT 11. – KALENDER GENERERING
====================================================== */

function renderCalendar() {
    const container = document.getElementById("calendar");
    container.innerHTML = "";

    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();

    const first = new Date(year, month, 1);
    const last = new Date(year, month + 1, 0);

    const totalDays = last.getDate();
    const startDay = first.getDay() === 0 ? 7 : first.getDay();

    // Tomme celler før dag 1
    for (let i = 1; i < startDay; i++) {
        const empty = document.createElement("div");
        empty.className = "calendar-day";
        empty.style.visibility = "hidden";
        container.appendChild(empty);
    }

    // Faktiske dage
    for (let day = 1; day <= totalDays; day++) {
        const div = document.createElement("div");
        div.className = "calendar-day";

        const dateISO = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

        div.dataset.date = dateISO;
        div.textContent = day;

        // Marker i dag
        const todayISO = new Date().toISOString().slice(0, 10);
        if (dateISO === todayISO) {
            div.classList.add("today");
        }

        // Marker dage med events
        const has = plans.some(p => p.date === dateISO);
        if (has) div.classList.add("has-events");

        // Klik på dag
        div.addEventListener("click", () => showPlansForDay(dateISO));

        container.appendChild(div);
    }
}


/* ======================================================
   AFSNIT 12. – TILFØJ PLAN / OPGAVE
====================================================== */

function addPlan() {
    const title = document.getElementById("planTitle").value.trim();
    const date = document.getElementById("planDate").value;

    if (!title || !date) return;

    plans.push({ title, date });
    saveAll();

    document.getElementById("planTitle").value = "";

    renderCalendar();
    showPlansForDay(date);
}


/* ======================================================
   AFSNIT 13. – VIS OPGAVER FOR EN VALGT DATO
====================================================== */

function showPlansForDay(date) {
    const list = document.getElementById("planList");
    list.innerHTML = "";

    const dayPlans = plans.filter(p => p.date === date);

    if (dayPlans.length === 0) {
        list.innerHTML = `<div class="empty-state">Ingen opgaver</div>`;
        return;
    }

    dayPlans.forEach((p, i) => {
        const div = document.createElement("div");
        div.className = "plan-item";

        div.innerHTML = `
            <span>${p.title} – ${p.date}</span>
            <button class="delete-plan" data-title="${p.title}" data-date="${p.date}">Slet</button>
        `;

        list.appendChild(div);
    });

    // Gør slet-knapper klikbare
    list.querySelectorAll(".delete-plan").forEach(btn => {
        btn.addEventListener("click", () => {
            openDeleteModal(btn.dataset.title, btn.dataset.date);
        });
    });
}


/* ======================================================
   AFSNIT 14. – POPUP (SLET OPGAVE)
====================================================== */

function openDeleteModal(title, date) {
    const overlay = document.getElementById("modalOverlay");
    const msg = document.getElementById("modalMessage");
    const confirmBtn = document.getElementById("modalConfirm");

    msg.textContent = `Slet opgave: "${title}"?`;

    overlay.classList.add("visible");

    confirmBtn.onclick = () => {
        deletePlan(title, date);
        overlay.classList.remove("visible");
    };
}

function closeModal() {
    document.getElementById("modalOverlay").classList.remove("visible");
}


/* ======================================================
   AFSNIT 15. – SLET OPGAVE (ENDGYLDIG HANDLING)
====================================================== */

function deletePlan(title, date) {
    plans = plans.filter(p => !(p.title === title && p.date === date));
    saveAll();

    renderCalendar();
    showPlansForDay(date);
}

/* ======================================================
   AFSNIT 16. – SIDEBAR TOGGLE (MOBIL)
====================================================== */

const sidebarToggle = document.getElementById("sidebarToggle");
const sidebar = document.getElementById("sidebar");

sidebarToggle.addEventListener("click", () => {
    sidebar.classList.toggle("visible");
});


/* ======================================================
   AFSNIT 17. – INIT SPRÅG / THEME / DATA
====================================================== */

function initLanguage() {
    const saved = localStorage.getItem("lang");
    currentLang = saved ? saved : "da";
    highlightActiveLanguage();
    applyTranslations();
}

function initTheme() {
    loadTheme();
    const icon = document.getElementById("themeToggle");
    if (currentTheme === "light") icon.textContent = "🌙";
    else icon.textContent = "☀";
}

function initData() {
    loadAll();
    renderCustomers();
    renderEmployees();
    renderEmployeeSelect();
    updateLogList();
    renderCalendar();
}


/* ======================================================
   AFSNIT 18. – INITIALISERING EFTER DOM LOADED
====================================================== */

document.addEventListener("DOMContentLoaded", () => {

    initEventListeners();

    initTheme();
    initLanguage();
    initData();

    showPage("dashboard");  // Standard startside

    // Opret modal baggrund hvis ikke til stede
    setupModalFramework();
});


/* ======================================================
   AFSNIT 19. – MODAL INFRASTRUKTUR (AUTO OPRETTELSE)
====================================================== */

function setupModalFramework() {
    // Hvis modal allerede findes → stop
    if (document.getElementById("modalOverlay")) return;

    const overlay = document.createElement("div");
    overlay.id = "modalOverlay";
    overlay.className = "modal-overlay";

    overlay.innerHTML = `
        <div class="modal-box">
            <h3 id="modalMessage">Er du sikker?</h3>
            <div class="modal-actions">
                <button id="modalConfirm" class="btn-red">Slet</button>
                <button id="modalCancel" class="btn-green">Annuller</button>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);

    document.getElementById("modalCancel").addEventListener("click", closeModal);
}


/* ======================================================
   AFSNIT 20. – UTILITY (DATOFORMATER M.M.)
====================================================== */

function formatDate(date) {
    return new Date(date).toLocaleDateString(currentLang);
}

function formatTime(ms) {
    const h = Math.floor(ms / 3600000);
    const m = Math.floor((ms % 3600000) / 60000);
    return `${h}t ${m}m`;
}

