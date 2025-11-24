
/* ======================================================
   AFSNIT – Sprogdata
====================================================== */

const translations = {
    da: {
        timereg: "Tidsregistrering",
        customers: "Kunder",
        employees: "Medarbejdere",
        details: "Detaljeret tid",
        planner: "Plan & kalender",
        logs: "Logs",
        reports: "Rapporter",
        settings: "Indstillinger",
        customer: "Kunde",
        today: "I dag",
        total: "Samlet tid",
        start: "Start",
        stop: "Stop",
        todayLogs: "Dagens logs",
        saveCustomer: "Gem kunde",
        clearCustomers: "Ryd alle kunder",
        customerList: "Kundeliste",
        addEmployee: "Tilføj medarbejder",
        employeeList: "Medarbejderliste"
    },

    en: {
        timereg: "Time Tracking",
        customers: "Customers",
        employees: "Employees",
        details: "Detailed Time",
        planner: "Schedule",
        logs: "Logs",
        reports: "Reports",
        settings: "Settings",
        customer: "Customer",
        today: "Today",
        total: "Total time",
        start: "Start",
        stop: "Stop",
        todayLogs: "Today's logs",
        saveCustomer: "Save customer",
        clearCustomers: "Clear customers",
        customerList: "Customer list",
        addEmployee: "Add employee",
        employeeList: "Employee list"
    },

    de: {
        timereg: "Zeiterfassung",
        customers: "Kunden",
        employees: "Mitarbeiter",
        details: "Details Zeit",
        planner: "Plan",
        logs: "Protokolle",
        reports: "Berichte",
        settings: "Einstellungen",
        customer: "Kunde",
        today: "Heute",
        total: "Gesamtzeit",
        start: "Start",
        stop: "Stopp",
        todayLogs: "Heutige Einträge",
        saveCustomer: "Kunde speichern",
        clearCustomers: "Alle Kunden löschen",
        customerList: "Kundenliste",
        addEmployee: "Mitarbeiter hinzufügen",
        employeeList: "Mitarbeiterliste"
    },

    lt: {
        timereg: "Laiko registracija",
        customers: "Klientai",
        employees: "Darbuotojai",
        details: "Išsami laiko",
        planner: "Planas",
        logs: "Įrašai",
        reports: "Ataskaitos",
        settings: "Nustatymai",
        customer: "Klientas",
        today: "Šiandien",
        total: "Bendras laikas",
        start: "Pradėti",
        stop: "Stabdyti",
        todayLogs: "Šiandienos įrašai",
        saveCustomer: "Išsaugoti klientą",
        clearCustomers: "Išvalyti klientus",
        customerList: "Klientų sąrašas",
        addEmployee: "Pridėti darbuotoją",
        employeeList: "Darbuotojų sąrašas"
    }
};



/* ======================================================
   GLOBAL STATE
====================================================== */

let customers = JSON.parse(localStorage.getItem("customers") || "[]");
let employees = JSON.parse(localStorage.getItem("employees") || "[]");
let logs = JSON.parse(localStorage.getItem("logs") || "[]");

let timerStart = null;
let timerInterval = null;
let timerSelectedEmployees = [];


/* ======================================================
   SAVE STATE
====================================================== */

function saveAll() {
    localStorage.setItem("customers", JSON.stringify(customers));
    localStorage.setItem("employees", JSON.stringify(employees));
    localStorage.setItem("logs", JSON.stringify(logs));
}


/* ======================================================
   PAGE SWITCHING
====================================================== */

function showPage(page) {
    document.querySelectorAll(".page").forEach(p => p.style.display = "none");
    document.getElementById(page).style.display = "block";

    document.querySelectorAll(".sidebar-nav button")
        .forEach(btn => btn.classList.toggle("active", btn.dataset.page === page));

    if (page === "timereg") {
        renderTimerEmployeeChips();
        renderCustomerDropdown();
        renderTodayLogs();
    }
}

document.querySelectorAll(".sidebar-nav button").forEach(btn => {
    btn.addEventListener("click", () => showPage(btn.dataset.page));
});

showPage("timereg");


/* ======================================================
   KUNDER
====================================================== */

function renderCustomerDropdown() {
    const dd = document.getElementById("customerSelect");
    dd.innerHTML = "";
    customers.forEach(c => {
        const opt = document.createElement("option");
        opt.value = c.id;
        opt.textContent = c.name;
        dd.appendChild(opt);
    });
}

function renderCustomers() {
    const list = document.getElementById("customerList");
    list.innerHTML = "";

    customers.forEach(c => {
        const div = document.createElement("div");
        div.className = "list-item";
        div.innerHTML = `
            <strong>${c.name}</strong><br>
            📞 ${c.phone}<br>
            📧 ${c.email}<br>
            🏠 ${c.address}<br>
            <button class="btn-red">Slet kunde</button>
        `;

        div.querySelector("button").addEventListener("click", () => {
            customers = customers.filter(x => x.id !== c.id);
            saveAll();
            renderCustomers();
            renderCustomerDropdown();
        });

        list.appendChild(div);
    });
}

document.getElementById("saveCustomerBtn").addEventListener("click", () => {
    const name = custName.value.trim();
    if (!name) return;

    customers.push({
        id: Date.now(),
        name,
        phone: custPhone.value,
        email: custEmail.value,
        address: custAddress.value
    });

    saveAll();
    renderCustomers();
    renderCustomerDropdown();
});


/* ======================================================
   MEDARBEJDERE
====================================================== */

function renderEmployees() {
    const list = employeeList;
    list.innerHTML = "";

    employees.forEach(e => {
        const div = document.createElement("div");
        div.className = "list-item";
        div.textContent = e.name;
        list.appendChild(div);
    });
}

document.getElementById("saveEmployeeBtn").addEventListener("click", () => {
    const name = empName.value.trim();
    if (!name) return;

    employees.push({
        id: Date.now(),
        name
    });

    saveAll();
    renderEmployees();
    renderTimerEmployeeChips();
});


/* ======================================================
   MEDARBEJDER CHIPS
====================================================== */

function renderTimerEmployeeChips() {
    const area = document.getElementById("timerEmployeeChips");
    area.innerHTML = "";

    employees.forEach(emp => {
        const chip = document.createElement("button");
        chip.className = "chip";
        chip.textContent = emp.name;

        if (timerSelectedEmployees.includes(emp.id)) {
            chip.classList.add("chip-selected");
        }

        chip.addEventListener("click", () => {
            if (timerSelectedEmployees.includes(emp.id)) {
                timerSelectedEmployees = timerSelectedEmployees.filter(id => id !== emp.id);
            } else {
                timerSelectedEmployees.push(emp.id);
            }
            renderTimerEmployeeChips();
        });

        area.appendChild(chip);
    });
}


/* ======================================================
   TIMER
====================================================== */

document.getElementById("startTimerBtn").addEventListener("click", () => {
    timerStart = Date.now();
    timerInterval = setInterval(() => {
        const diff = Date.now() - timerStart;
        timerDisplay.textContent = new Date(diff).toISOString().substr(11, 8);
    }, 1000);
});

document.getElementById("stopTimerBtn").addEventListener("click", () => {
    if (!timerInterval) return;
    clearInterval(timerInterval);

    logs.push({
        id: Date.now(),
        customerId: customerSelect.value,
        employees: [...timerSelectedEmployees],
        duration: timerDisplay.textContent,
        date: new Date().toLocaleDateString()
    });

    saveAll();
    renderTodayLogs();
    timerSelectedEmployees = [];
    renderTimerEmployeeChips();
});


/* ======================================================
   DAGENS LOGS
====================================================== */

function renderTodayLogs() {
    const area = todayLogs;
    area.innerHTML = "";

    logs.forEach(l => {
        const cu = customers.find(x => x.id == l.customerId);

        const div = document.createElement("div");
        div.className = "list-item";

        const names = l.employees.map(eid =>
            employees.find(e => e.id == eid)?.name
        ).join(", ");

        div.innerHTML = `
            <strong>${cu?.name || "Ukendt kunde"}</strong><br>
            👷 ${names}<br>
            ⏱️ ${l.duration}<br>
            📅 ${l.date}
        `;

        area.appendChild(div);
    });
}

renderCustomers();
renderEmployees();
renderCustomerDropdown();
renderTodayLogs();
