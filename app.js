/* ======================================================
   AFSNIT 01 – SPROG-DATA (I18N)
====================================================== */

const translations = {
    da: {
        app_title: "GreenTime Pro",
        menu_dashboard: "Tidsregistrering",
        menu_customers: "Kunder",
        menu_employees: "Medarbejdere",
        menu_logs: "Logs",
        menu_reports: "Rapporter",
        menu_planning: "Planlægning",
        timer_title: "Tidsregistrering",
        customers_title: "Kunder",
        employees_title: "Medarbejdere"
    },

    en: {
        app_title: "GreenTime Pro",
        menu_dashboard: "Time Tracking",
        menu_customers: "Customers",
        menu_employees: "Employees",
        menu_logs: "Logs",
        menu_reports: "Reports",
        menu_planning: "Planning",
        timer_title: "Time Tracking",
        customers_title: "Customers",
        employees_title: "Employees"
    },

    de: {
        app_title: "GreenTime Pro",
        menu_dashboard: "Zeiterfassung",
        menu_customers: "Kunden",
        menu_employees: "Mitarbeiter",
        menu_logs: "Protokolle",
        menu_reports: "Berichte",
        menu_planning: "Planung",
        timer_title: "Zeiterfassung",
        customers_title: "Kunden",
        employees_title: "Mitarbeiter"
    },

    lt: {
        app_title: "GreenTime Pro",
        menu_dashboard: "Laiko Sekimas",
        menu_customers: "Klientai",
        menu_employees: "Darbuotojai",
        menu_logs: "Žurnalai",
        menu_reports: "Ataskaitos",
        menu_planning: "Planavimas",
        timer_title: "Laiko Sekimas",
        customers_title: "Klientai",
        employees_title: "Darbuotojai"
    }
};

let currentLang = "da";

function t(key) {
    return translations[currentLang]?.[key] || translations["da"][key] || key;
}


/* ======================================================
   AFSNIT 02 – INITIALISERING (KORREKT VERSION)
====================================================== */

document.addEventListener("DOMContentLoaded", () => {
    initSidebarNavigation();
    initLanguage();
    initLanguageButtons();
    initThemeToggle();
    initTimer();

    installDefaultCustomers();
    installDefaultEmployees();

    initCustomerForm();
    initEmployeeForm();

    renderCustomers();
    renderEmployees();
});


/* ======================================================
   AFSNIT 03 – SIDEBAR + NAVIGATION
====================================================== */

function initSidebarNavigation() {
    const buttons = document.querySelectorAll(".menu-item");

    buttons.forEach(btn => {
        btn.addEventListener("click", () => {
            const pageId = btn.dataset.page;
            if (!pageId) return;

            showPage(pageId);

            buttons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            updatePageTitleFromActiveMenu();
        });
    });
}

function showPage(pageId) {
    document.querySelectorAll(".page").forEach(page => {
        page.classList.toggle("visible", page.id === pageId);
    });
}

function updatePageTitleFromActiveMenu() {
    const activeBtn = document.querySelector(".menu-item.active");
    const pageTitle = document.getElementById("pageTitle");

    if (activeBtn && pageTitle) {
        const i18nKey = activeBtn.dataset.i18n;
        pageTitle.textContent = t(i18nKey);
    }
}


/* ======================================================
   AFSNIT 04 – SPROG (I18N-System)
====================================================== */

function initLanguage() {
    const stored = localStorage.getItem("gtp_lang");
    if (stored && translations[stored]) currentLang = stored;
    applyTranslations();
}

function updateLangButtonActiveState() {
    document.querySelectorAll(".lang-btn").forEach(btn => {
        btn.classList.toggle("active", btn.dataset.lang === currentLang);
    });
}

function applyTranslations() {
    document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.dataset.i18n;
        el.textContent = t(key);
    });

    updateLangButtonActiveState();
}

function initLanguageButtons() {
    document.querySelectorAll(".lang-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const lang = btn.dataset.lang;
            currentLang = lang;

            localStorage.setItem("gtp_lang", lang);
            applyTranslations();
            updatePageTitleFromActiveMenu();
        });
    });
}


/* ======================================================
   AFSNIT 05 – TEMA (DARK / LIGHT)
====================================================== */

function initThemeToggle() {
    const btn = document.getElementById("themeToggle");
    if (!btn) return;

    btn.addEventListener("click", () => {
        const current = document.documentElement.getAttribute("data-theme");
        const next = current === "light" ? "dark" : "light";
        document.documentElement.setAttribute("data-theme", next);
        localStorage.setItem("gtp_theme", next);
    });
}


/* ======================================================
   AFSNIT 06 – TIMER
====================================================== */

let timerInterval = null;
let timerSeconds = 0;

function initTimer() {
    const startBtn = document.getElementById("timerStartBtn");
    const stopBtn = document.getElementById("timerStopBtn");
    const display = document.getElementById("timerDisplay");

    updateTimerDisplay(display);

    startBtn?.addEventListener("click", () => startTimer(display));
    stopBtn?.addEventListener("click", () => stopTimer());
}

function startTimer(display) {
    if (timerInterval) return;

    timerInterval = setInterval(() => {
        timerSeconds++;
        updateTimerDisplay(display);
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
}

function updateTimerDisplay(display) {
    if (!display) return;
    const h = String(Math.floor(timerSeconds / 3600)).padStart(2, "0");
    const m = String(Math.floor((timerSeconds % 3600) / 60)).padStart(2, "0");
    const s = String(timerSeconds % 60).padStart(2, "0");
    display.textContent = `${h}:${m}:${s}`;
}


/* ======================================================
   AFSNIT 06B – DEMO DATA: KUNDER
====================================================== */

function installDefaultCustomers() {
    const existing = JSON.parse(localStorage.getItem("gtp_customers"));
    if (existing && existing.length > 0) return;

    const demoCustomers = [
        { name: "Søren Olsen", phone: "21345678", email: "soren@demo.dk", address: "Sølvgade 14, København" },
        { name: "Peter Jensen", phone: "21453377", email: "peter@firma.dk", address: "Hygge Allé 3, Aarhus" },
        { name: "Lise Holm", phone: "64732467", email: "lise@holm.dk", address: "Vibevej 22, Hornbæk" },
        { name: "Camilla Sørensen", phone: "42356789", email: "camilla@camilco.dk", address: "Parkvej 5, Hillerød" },
        { name: "Anders Lund", phone: "29887766", email: "anders@lund.dk", address: "Nørregade 80, Aalborg" },
        { name: "Jenny Madsen", phone: "20228855", email: "jenny@mad.dk", address: "Havnevej 7, Esbjerg" }
    ];

    localStorage.setItem("gtp_customers", JSON.stringify(demoCustomers));
}


/* ======================================================
   AFSNIT 07 – KUNDER (FORM + LISTE)
====================================================== */

function initCustomerForm() {
    const form = document.getElementById("customerForm");
    if (!form) return;

    form.addEventListener("submit", e => {
        e.preventDefault();

        const customer = {
            name: form.customerName.value,
            phone: form.customerPhone.value,
            email: form.customerEmail.value,
            address: form.customerAddress.value
        };

        saveCustomer(customer);
        renderCustomers();
        form.reset();
    });
}

function saveCustomer(customer) {
    const customers = JSON.parse(localStorage.getItem("gtp_customers")) || [];
    customers.push(customer);
    localStorage.setItem("gtp_customers", JSON.stringify(customers));
}

function renderCustomers() {
    const container = document.getElementById("customerList");
    if (!container) return;

    const customers = JSON.parse(localStorage.getItem("gtp_customers")) || [];
    container.innerHTML = customers
        .map(c => `<li>${c.name} – ${c.phone}</li>`)
        .join("");
}


/* ======================================================
   AFSNIT 07B – DEMO DATA: MEDARBEJDERE
====================================================== */

function installDefaultEmployees() {
    const existing = JSON.parse(localStorage.getItem("gtp_employees"));
    if (existing && existing.length > 0) return;

    const demoEmployees = [
        { name: "Lars Kristensen", email: "lars@firma.dk", role: "employee" },
        { name: "Ronny Kisbye", email: "ronny@kisbye.eu", role: "admin" },
        { name: "Emma Larsen", email: "emma@firma.dk", role: "employee" },
        { name: "Lasse Mikkelsen", email: "lasse@firma.dk", role: "employee" },
        { name: "Mia Knudsen", email: "mia@firma.dk", role: "admin" }
    ];

    localStorage.setItem("gtp_employees", JSON.stringify(demoEmployees));
}


/* ======================================================
   AFSNIT 08 – MEDARBEJDERE (FORM + LISTE)
====================================================== */

function initEmployeeForm() {
    const form = document.getElementById("employeeForm");
    if (!form) return;

    form.addEventListener("submit", e => {
        e.preventDefault();

        const employee = {
            name: form.employeeName.value,
            email: form.employeeEmail.value,
            role: form.employeeRole.value
        };

        saveEmployee(employee);
        renderEmployees();
        form.reset();
    });
}

function saveEmployee(employee) {
    const employees = JSON.parse(localStorage.getItem("gtp_employees")) || [];
    employees.push(employee);
    localStorage.setItem("gtp_employees", JSON.stringify(employees));
}

function renderEmployees() {
    const container = document.getElementById("employeeList");
    if (!container) return;

    const employees = JSON.parse(localStorage.getItem("gtp_employees")) || [];
    container.innerHTML = employees
        .map(e => `<li>${e.name} – ${e.email}</li>`)
        .join("");
}
