/* ======================================================
   AFSNIT 01 – SPROG-DATA (I18N)
====================================================== */

const translations = {
    da: {
        app_title: "GreenTime Pro",

        /* Menu */
        menu_dashboard: "Tidsregistrering",
        menu_customers: "Kunder",
        menu_employees: "Medarbejdere",
        menu_logs: "Logs",
        menu_reports: "Rapporter",
        menu_settings: "Indstillinger",

        /* Dashboard / Timer */
        page_dashboard_title: "Tidsregistrering",
        page_dashboard_sub: "Start og stop tid for opgaver – hurtigt overblik.",
        btn_start: "Start",
        btn_stop: "Stop",

        /* Kundevalg til timer */
        select_customer_placeholder: "Vælg en kunde",

        /* Kunder */
        customers_title: "Kunder",
        customers_sub: "Opret og vedligehold din kundeliste.",
        customers_new: "Ny kunde",
        customers_save: "Gem kunde",
        customers_list: "Oversigt over kunder",

        /* Medarbejdere */
        employees_title: "Medarbejdere",
        employees_sub: "Hold styr på medarbejdere og roller.",
        employees_new: "Ny medarbejder",
        employees_save: "Gem medarbejder",
        employees_list: "Liste over medarbejdere",

        /* Kolonner */
        col_name: "Navn",
        col_phone: "Telefon",
        col_email: "Email",
        col_address: "Adresse",
        col_role: "Rolle",

        /* Labels */
        label_name: "Navn",
        label_phone: "Telefon",
        label_email: "Email",
        label_address: "Adresse",
        label_role: "Rolle",

        /* Roller */
        role_employee: "Medarbejder",
        role_admin: "Admin"
    },

    en: {
        app_title: "GreenTime Pro",

        menu_dashboard: "Time Tracking",
        menu_customers: "Customers",
        menu_employees: "Employees",
        menu_logs: "Logs",
        menu_reports: "Reports",
        menu_settings: "Settings",

        page_dashboard_title: "Time Tracking",
        page_dashboard_sub: "Start and stop time for tasks – quick overview.",
        btn_start: "Start",
        btn_stop: "Stop",

        /* Customer select for timer */
        select_customer_placeholder: "Select a customer",

        customers_title: "Customers",
        customers_sub: "Create and maintain your customer list.",
        customers_new: "New customer",
        customers_save: "Save customer",
        customers_list: "Customer overview",

        employees_title: "Employees",
        employees_sub: "Manage employees and roles.",
        employees_new: "New employee",
        employees_save: "Save employee",
        employees_list: "Employee list",

        col_name: "Name",
        col_phone: "Phone",
        col_email: "Email",
        col_address: "Address",
        col_role: "Role",

        label_name: "Name",
        label_phone: "Phone",
        label_email: "Email",
        label_address: "Address",
        label_role: "Role",

        role_employee: "Employee",
        role_admin: "Admin"
    },

    de: {
        app_title: "GreenTime Pro",

        menu_dashboard: "Zeiterfassung",
        menu_customers: "Kunden",
        menu_employees: "Mitarbeiter",
        menu_logs: "Protokolle",
        menu_reports: "Berichte",
        menu_settings: "Einstellungen",

        page_dashboard_title: "Zeiterfassung",
        page_dashboard_sub: "Zeit für Aufgaben schnell starten und stoppen.",
        btn_start: "Start",
        btn_stop: "Stopp",

        /* Kundenauswahl für Timer */
        select_customer_placeholder: "Kunde auswählen",

        customers_title: "Kunden",
        customers_sub: "Erstellen und pflegen Sie Ihre Kundenliste.",
        customers_new: "Neuer Kunde",
        customers_save: "Kunden speichern",
        customers_list: "Kundenübersicht",

        employees_title: "Mitarbeiter",
        employees_sub: "Verwalten Sie Mitarbeiter und Rollen.",
        employees_new: "Neuer Mitarbeiter",
        employees_save: "Mitarbeiter speichern",
        employees_list: "Mitarbeiterübersicht",

        col_name: "Name",
        col_phone: "Telefon",
        col_email: "E-Mail",
        col_address: "Adresse",
        col_role: "Rolle",

        label_name: "Name",
        label_phone: "Telefon",
        label_email: "E-Mail",
        label_address: "Adresse",
        label_role: "Rolle",

        role_employee: "Mitarbeiter",
        role_admin: "Admin"
    },

    lt: {
        app_title: "GreenTime Pro",

        menu_dashboard: "Laiko sekimas",
        menu_customers: "Klientai",
        menu_employees: "Darbuotojai",
        menu_logs: "Žurnalai",
        menu_reports: "Ataskaitos",
        menu_settings: "Nustatymai",

        page_dashboard_title: "Laiko sekimas",
        page_dashboard_sub: "Greitai pradėkite ir sustabdykite užduočių laiką.",
        btn_start: "Startas",
        btn_stop: "Stop",

        /* Kliento pasirinkimas laikmačiui */
        select_customer_placeholder: "Pasirinkite klientą",

        customers_title: "Klientai",
        customers_sub: "Kurti ir tvarkyti klientų sąrašą.",
        customers_new: "Naujas klientas",
        customers_save: "Išsaugoti klientą",
        customers_list: "Klientų sąrašas",

        employees_title: "Darbuotojai",
        employees_sub: "Stebėti darbuotojus ir roles.",
        employees_new: "Naujas darbuotojas",
        employees_save: "Išsaugoti darbuotoją",
        employees_list: "Darbuotojų sąrašas",

        col_name: "Vardas",
        col_phone: "Telefonas",
        col_email: "El. paštas",
        col_address: "Adresas",
        col_role: "Rolė",

        label_name: "Vardas",
        label_phone: "Telefonas",
        label_email: "El. paštas",
        label_address: "Adresas",
        label_role: "Rolė",

        role_employee: "Darbuotojas",
        role_admin: "Administratorius"
    }
};

let currentLang = "da";

function t(key) {
    return translations[currentLang]?.[key] || translations.da[key] || key;
}



/* ======================================================
   AFSNIT 02 – INITIALISERING (KORREKT VERSION)
====================================================== */

document.addEventListener("DOMContentLoaded", () => {
    initSidebarNavigation();
    initLanguage();
    initLanguageButtons();
    initThemeToggle();

    // Demo-data
    installDefaultCustomers();
    installDefaultEmployees();

    // Formularer
    initCustomerForm();
    initEmployeeForm();

    // Tabeller
    renderCustomers();
    renderEmployees();

    // Timer + kunde-dropdown på dashboard
    initTimer();
    initCustomerSelectForTimer();
});


/* ======================================================
   AFSNIT 03 – SIDEBAR + NAVIGATION (FAST & KORREKT)
====================================================== */

function initSidebarNavigation() {
    // Find alle menupunkter i venstre sidebar
    const buttons = document.querySelectorAll(".sidebar-menu a[data-page]");
    if (!buttons.length) return;

    // Gør første menupunkt aktivt og vis den tilhørende side
    const first = buttons[0];
    first.classList.add("active");
    showPage(first.dataset.page);
    updatePageTitleFromActiveMenu();

    // Klik-håndtering på alle menupunkter
    buttons.forEach(btn => {
        // Sørg for at de også har menu-item class, hvis vi vil style på den
        btn.classList.add("menu-item");

        btn.addEventListener("click", (evt) => {
            evt.preventDefault();

            const pageId = btn.dataset.page;
            if (!pageId) return;

            // Skift aktivt menupunkt
            buttons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            // Vis korrekt side
            showPage(pageId);

            // Opdatér topbar-titel
            updatePageTitleFromActiveMenu();
        });
    });
}

function showPage(pageId) {
    // Viser kun den side, der matcher pageId
    document.querySelectorAll(".page").forEach(page => {
        const isActive = page.id === pageId;
        page.classList.toggle("visible", isActive);
    });
}

function updatePageTitleFromActiveMenu() {
    const activeBtn = document.querySelector(".sidebar-menu a.active");
    const pageTitle = document.getElementById("pageTitle");
    if (!activeBtn || !pageTitle) return;

    // Find det indre element med data-i18n (span med selve menuteksten)
    const labelEl = activeBtn.querySelector("[data-i18n]");
    const key = labelEl?.dataset.i18n;

    // Hvis der findes en i18n-nøgle, brug oversættelser – ellers brug ren tekst
    if (key) {
        pageTitle.textContent = t(key);
    } else if (labelEl) {
        pageTitle.textContent = labelEl.textContent.trim();
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
   AFSNIT 05 – TEMA (DARK / LIGHT) – FIX MED IKON
====================================================== */

function initThemeToggle() {
    const btn = document.getElementById("themeToggle");
    const icon = document.getElementById("themeIcon"); // <-- IKON!!!

    if (!btn || !icon) return;

    // Indlæs gemt tema
    const saved = localStorage.getItem("gtp_theme") || "light";
    document.documentElement.setAttribute("data-theme", saved);
    icon.textContent = saved === "dark" ? "🌙" : "☀️";

    btn.addEventListener("click", () => {
        const current = document.documentElement.getAttribute("data-theme");
        const next = current === "light" ? "dark" : "light";

        // Skift tema
        document.documentElement.setAttribute("data-theme", next);
        localStorage.setItem("gtp_theme", next);

        // Skift ikon
        icon.textContent = next === "dark" ? "🌙" : "☀️";
    });
}



/* ======================================================
   AFSNIT – KUNDEVALG TIL TIDSREGISTRERING
====================================================== */

function renderTimereg() {
    console.log("Render timereg...");

    const select = document.getElementById("timeregCustomerSelect");
    if (!select) return;

    // ryd dropdown
    select.innerHTML = `
        <option value="" data-i18n="timereg_choose_customer">
            ${i18n.timereg_choose_customer[currentLang]}
        </option>
    `;

    // hent kunder
    const customers = JSON.parse(localStorage.getItem("customers") || "[]");

    customers.forEach(c => {
        const opt = document.createElement("option");
        opt.value = c.id;
        opt.textContent = c.name;
        select.appendChild(opt);
    });

    updateI18nTexts();
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
   AFSNIT 07 – KUNDER (FORM + LISTE) – TABELVERSION
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
    const tbody = document.getElementById("customerTableBody");
    if (!tbody) return;

    const customers = JSON.parse(localStorage.getItem("gtp_customers")) || [];

    tbody.innerHTML = customers
        .map(c => `
            <tr>
                <td>${c.name}</td>
                <td>${c.phone}</td>
                <td>${c.email}</td>
                <td>${c.address}</td>
            </tr>
        `)
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
   AFSNIT 08 – MEDARBEJDERE (FORM + LISTE) – TABELVERSION
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
    const tbody = document.getElementById("employeeTableBody");
    if (!tbody) return;

    const employees = JSON.parse(localStorage.getItem("gtp_employees")) || [];

    tbody.innerHTML = employees
        .map(e => `
            <tr>
                <td>${e.name}</td>
                <td>${e.email}</td>
                <td>${e.role}</td>
            </tr>
        `)
        .join("");
}
