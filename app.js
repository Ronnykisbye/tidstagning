// ========== STORAGE ==========
let customers = [];
let employees = [];
let timeLogs = [];
let activeTimer = null;

function loadData() {
    customers = JSON.parse(localStorage.getItem("gtp_customers") || "[]");
    employees = JSON.parse(localStorage.getItem("gtp_employees") || "[]");
    timeLogs = JSON.parse(localStorage.getItem("gtp_logs") || "[]");
    activeTimer = JSON.parse(localStorage.getItem("gtp_active") || "null");
}
function saveData() {
    localStorage.setItem("gtp_customers", JSON.stringify(customers));
    localStorage.setItem("gtp_employees", JSON.stringify(employees));
    localStorage.setItem("gtp_logs", JSON.stringify(timeLogs));
    localStorage.setItem("gtp_active", JSON.stringify(activeTimer));
}

// ========== SPA NAVIGATION ==========
function showPage(pageId) {
    document.querySelectorAll(".page").forEach(p => p.classList.remove("visible"));
    document.getElementById(pageId).classList.add("visible");

    document.querySelectorAll(".sidebar li").forEach(li => li.classList.remove("active"));
    document.querySelector(`.sidebar li[data-page="${pageId}"]`).classList.add("active");
}

// ========== RENDER FUNCTIONS ==========
function renderCustomers() {
    const tbody = document.querySelector("#customerTable tbody");
    const sel = document.getElementById("timerCustomerSelect");
    tbody.innerHTML = "";
    sel.innerHTML = "";

    customers.forEach(c => {
        tbody.innerHTML += `<tr><td>${c.name}</td><td>${c.phone}</td><td>${c.email}</td><td>${c.address}</td></tr>`;
        sel.innerHTML += `<option value="${c.id}">${c.name}</option>`;
    });

    document.getElementById("dashTotalCustomers").textContent = customers.length;
}

function renderEmployees() {
    const tbody = document.querySelector("#employeeTable tbody");
    const sel = document.getElementById("timerEmployeeSelect");
    tbody.innerHTML = "";
    sel.innerHTML = "";

    employees.forEach(e => {
        tbody.innerHTML += `<tr><td>${e.name}</td><td>${e.email}</td><td>${e.role}</td></tr>`;
        sel.innerHTML += `<option value="${e.id}">${e.name}</option>`;
    });

    document.getElementById("dashTotalEmployees").textContent = employees.length;
}

function renderLogs() {
    const tbody = document.querySelector("#timeLogTable tbody");
    tbody.innerHTML = "";

    const today = new Date().toISOString().slice(0, 10);

    let count = 0;

    timeLogs.filter(l => l.startTime.slice(0,10) === today)
    .forEach(log => {
        const customer = customers.find(c => c.id === log.customerId);
        tbody.innerHTML += `
            <tr>
                <td>${new Date(log.startTime).toLocaleTimeString()}</td>
                <td>${new Date(log.endTime).toLocaleTimeString()}</td>
                <td>${log.duration} min</td>
                <td>${customer ? customer.name : "?"}</td>
                <td>${log.employee}</td>
            </tr>
        `;
        count++;
    });

    document.getElementById("dashTodayLogs").textContent = count;
}

function renderTimer() {
    const status = document.getElementById("timerStatus");
    const stopBtn = document.getElementById("stopTimerBtn");

    if (!activeTimer) {
        status.textContent = "No active timer";
        stopBtn.disabled = true;
    } else {
        const customer = customers.find(c => c.id === activeTimer.customerId);
        status.textContent = `Running: ${customer.name} – ${activeTimer.employee}`;
        stopBtn.disabled = false;
    }
}

// ========== ADD CUSTOMER ==========
document.addEventListener("DOMContentLoaded", () => {
    loadData();

    // SPA
    document.querySelectorAll(".sidebar li").forEach(li => {
        li.addEventListener("click", () => showPage(li.dataset.page));
    });

    // DARK MODE
    const themeToggle = document.getElementById("themeToggle");
    const savedTheme = localStorage.getItem("gtp_theme") || "light";

    document.documentElement.setAttribute("data-theme", savedTheme);
    themeToggle.textContent = savedTheme === "dark" ? "☀️" : "🌙";

    themeToggle.onclick = () => {
        const current = document.documentElement.getAttribute("data-theme");
        const next = current === "dark" ? "light" : "dark";
        document.documentElement.setAttribute("data-theme", next);
        localStorage.setItem("gtp_theme", next);
        themeToggle.textContent = next === "dark" ? "☀️" : "🌙";
    };

    // ADD CUSTOMER
    document.getElementById("customerForm").onsubmit = e => {
        e.preventDefault();
        const c = {
            id: "c" + Date.now(),
            name: customerName.value,
            phone: customerPhone.value,
            email: customerEmail.value,
            address: customerAddress.value
        };
        customers.push(c);
        saveData();
        renderCustomers();
        e.target.reset();
    };

    // ADD EMPLOYEE
    document.getElementById("employeeForm").onsubmit = e => {
        e.preventDefault();
        const emp = {
            id: "e" + Date.now(),
            name: employeeName.value,
            email: employeeEmail.value,
            role: employeeRole.value
        };
        employees.push(emp);
        saveData();
        renderEmployees();
        e.target.reset();
    };

    // TIMER START
    document.getElementById("startTimerBtn").onclick = () => {
        const cid = timerCustomerSelect.value;
        let ename = timerEmployeeSelect.value ?
            employees.find(e => e.id === timerEmployeeSelect.value).name :
            timerEmployeeName.value;

        if (!cid || !ename) return alert("Choose customer and employee");

        activeTimer = {
            customerId: cid,
            employee: ename,
            startTime: new Date().toISOString()
        };
        saveData();
        renderTimer();
    };

    // TIMER STOP
    document.getElementById("stopTimerBtn").onclick = () => {
        const end = new Date();
        const start = new Date(activeTimer.startTime);
        const minutes = Math.max(1, Math.round((end - start) / 60000));

        timeLogs.push({
            customerId: activeTimer.customerId,
            employee: activeTimer.employee,
            startTime: activeTimer.startTime,
            endTime: end.toISOString(),
            duration: minutes
        });

        activeTimer = null;
        saveData();
        renderLogs();
        renderTimer();
    };

    // FIRST RENDER
    renderCustomers();
    renderEmployees();
    renderLogs();
    renderTimer();
});
