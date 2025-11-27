1 færdig – fortsæt med 2”

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
