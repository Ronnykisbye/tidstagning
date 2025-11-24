/* ======================================================
   AFSNIT 1 – GLOBAL VARIABLER
====================================================== */

let customers = JSON.parse(localStorage.getItem("customers") || "[]");
let employees = JSON.parse(localStorage.getItem("employees") || "[]");
let logs = JSON.parse(localStorage.getItem("logs") || "[]");

let timerInterval = null;
let timerStartTime = null;
let timerSelectedEmployees = [];


/* ======================================================
   AFSNIT 2 – GEM TIL LOCALSTORAGE
====================================================== */

function saveAll() {
    localStorage.setItem("customers", JSON.stringify(customers));
    localStorage.setItem("employees", JSON.stringify(employees));
    localStorage.setItem("logs", JSON.stringify(logs));
}


/* ======================================================
   AFSNIT 3 – SIDESKIFT (MENU)
====================================================== */

function showPage(page) {

    document.querySelectorAll(".page").forEach(p => {
        p.style.display = "none";
    });

    const active = document.getElementById(page);
    if (active) active.style.display = "block";

    document.querySelectorAll(".sidebar-nav button").forEach(btn => {
        btn.classList.remove("active");
        if (btn.dataset.page === page) btn.classList.add("active");
    });

    // VIGTIGT → når vi åbner tidsregistrering, opdater chips
    if (page === "timereg") {
        renderTimerEmployeeChips();
        renderCustomerDropdown();
        renderTodayLogs();
    }
}

document.querySelectorAll(".sidebar-nav button").forEach(btn => {
    btn.addEventListener("click", () => showPage(btn.dataset.page));
});

// Start på Tidsregistrering
showPage("timereg");


/* ======================================================
   AFSNIT 4 – KUNDER (OPRET, VIS, SLET)
====================================================== */

function addCustomer() {
    const name = document.getElementById("custName").value.trim();
    const phone = document.getElementById("custPhone").value.trim();
    const email = document.getElementById("custEmail").value.trim();
    const address = document.getElementById("custAddress").value.trim();

    if (!name) return;

    customers.push({
        id: Date.now(),
        name, phone, email, address
    });

    saveAll();
    renderCustomers();
    renderCustomerDropdown();

    document.getElementById("custName").value = "";
    document.getElementById("custPhone").value = "";
    document.getElementById("custEmail").value = "";
    document.getElementById("custAddress").value = "";
}

document.getElementById("saveCustomerBtn").addEventListener("click", addCustomer);


function renderCustomers() {
    const list = document.getElementById("customerList");
    list.innerHTML = "";

    customers.forEach(c => {
        const item = document.createElement("div");
        item.className = "list-item";

        item.innerHTML = `
            <strong>${c.name}</strong>
            <div>📞 ${c.phone || "-"}</div>
            <div>📧 ${c.email || "-"}</div>
            <div>🏠 ${c.address || "-"}</div>
            <button class="btn-red">Slet kunde</button>
        `;

        item.querySelector("button").addEventListener("click", () => {
            customers = customers.filter(x => x.id !== c.id);
            saveAll();
            renderCustomers();
            renderCustomerDropdown();
        });

        list.appendChild(item);
    });
}

document.getElementById("clearCustomersBtn").addEventListener("click", () => {
    if (!confirm("Vil du slette alle kunder?")) return;
    customers = [];
    saveAll();
    renderCustomers();
    renderCustomerDropdown();
});


function renderCustomerDropdown() {
    const dd = document.getElementById("customerSelect");
    if (!dd) return;

    dd.innerHTML = "";

    customers.forEach(c => {
        const opt = document.createElement("option");
        opt.value = c.id;
        opt.textContent = c.name;
        dd.appendChild(opt);
    });
}

renderCustomers();
renderCustomerDropdown();


/* ======================================================
   AFSNIT 5 – MEDARBEJDERE (OPRET + VIS)
====================================================== */

document.getElementById("saveEmployeeBtn").addEventListener("click", () => {
    const name = document.getElementById("empName").value.trim();
    if (!name) return;

    employees.push({ id: Date.now(), name });

    document.getElementById("empName").value = "";

    saveAll();
    renderEmployees();
    renderTimerEmployeeChips();
});

function renderEmployees() {
    const list = document.getElementById("employeeList");
    if (!list) return;

    list.innerHTML = "";

    employees.forEach(emp => {
        const div = document.createElement("div");
        div.className = "list-item";
        div.innerHTML = `<strong>${emp.name}</strong>`;
        list.appendChild(div);
    });
}

renderEmployees();


/* ======================================================
   AFSNIT 6 – MEDARBEJDER CHIPS I TIDSREGISTRERING
====================================================== */

function renderTimerEmployeeChips() {
    const area = document.getElementById("timerEmployeeChips");
    if (!area) return;

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
   AFSNIT 7 – TIMER FUNKTION
====================================================== */

function updateTimerDisplay() {
    const diff = Date.now() - timerStartTime;
    document.getElementById("timerDisplay").textContent =
        new Date(diff).toISOString().substr(11, 8);
}

document.getElementById("startTimerBtn").addEventListener("click", () => {
    timerStartTime = Date.now();
    timerInterval = setInterval(updateTimerDisplay, 1000);
});

document.getElementById("stopTimerBtn").addEventListener("click", () => {
    if (!timerInterval) return;

    clearInterval(timerInterval);

    const duration = document.getElementById("timerDisplay").textContent;
    const customerId = document.getElementById("customerSelect").value;

    logs.push({
        id: Date.now(),
        customerId,
        employees: [...timerSelectedEmployees],
        duration,
        date: new Date().toLocaleDateString()
    });

    saveAll();
    renderTodayLogs();

    timerSelectedEmployees = [];
    renderTimerEmployeeChips();
});


/* ======================================================
   AFSNIT 8 – DAGENS LOGS
====================================================== */

function renderTodayLogs() {
    const box = document.getElementById("todayLogs");
    if (!box) return;

    box.innerHTML = "";

    logs.forEach(l => {
        const cust = customers.find(c => c.id == l.customerId);
        const names = l.employees
            .map(id => employees.find(e => e.id == id)?.name)
            .join(", ");

        const div = document.createElement("div");
        div.className = "list-item";

        div.innerHTML = `
            <strong>${cust?.name || "Ukendt kunde"}</strong>
            <div>⏱️ ${l.duration}</div>
            <div>👷 ${names || "-"}</div>
            <div>📅 ${l.date}</div>
        `;

        box.appendChild(div);
    });
}

renderTodayLogs();
