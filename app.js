// Simple client-side app for customer management and time tracking

// ---- Data storage ----
let customers = [];
let timeLogs = [];
let activeTimer = null; // { customerId, employeeName, startTime }

// Load from localStorage when app starts
function loadData() {
    const customersRaw = localStorage.getItem("gtp_customers");
    const logsRaw = localStorage.getItem("gtp_timelogs");

    customers = customersRaw ? JSON.parse(customersRaw) : [];
    timeLogs = logsRaw ? JSON.parse(logsRaw) : [];
}

// Save to localStorage
function saveData() {
    localStorage.setItem("gtp_customers", JSON.stringify(customers));
    localStorage.setItem("gtp_timelogs", JSON.stringify(timeLogs));
}

// ---- Rendering ----
function renderCustomers() {
    const tbody = document.querySelector("#customerTable tbody");
    const select = document.getElementById("timerCustomerSelect");

    tbody.innerHTML = "";
    select.innerHTML = "";

    customers.forEach((c) => {
        // table row
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${c.name}</td>
            <td>${c.phone || ""}</td>
            <td>${c.email || ""}</td>
            <td>${c.address || ""}</td>
        `;
        tbody.appendChild(tr);

        // select option
        const opt = document.createElement("option");
        opt.value = c.id;
        opt.textContent = c.name;
        select.appendChild(opt);
    });

    // If no customers, show placeholder
    if (customers.length === 0) {
        const opt = document.createElement("option");
        opt.value = "";
        opt.textContent = "No customers yet";
        select.appendChild(opt);
    }
}

function renderTimeLogs() {
    const tbody = document.querySelector("#timeLogTable tbody");
    tbody.innerHTML = "";

    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

    timeLogs
        .filter((log) => log.startTime.slice(0, 10) === today)
        .forEach((log) => {
            const tr = document.createElement("tr");
            const start = new Date(log.startTime);
            const end = new Date(log.endTime);
            const customer = customers.find((c) => c.id === log.customerId);
            tr.innerHTML = `
                <td>${start.toLocaleTimeString()}</td>
                <td>${end.toLocaleTimeString()}</td>
                <td>${log.durationMinutes}</td>
                <td>${customer ? customer.name : "Unknown"}</td>
                <td>${log.employeeName || ""}</td>
            `;
            tbody.appendChild(tr);
        });
}

function renderTimerStatus() {
    const statusDiv = document.getElementById("timerStatus");
    const startBtn = document.getElementById("startTimerBtn");
    const stopBtn = document.getElementById("stopTimerBtn");

    if (!activeTimer) {
        statusDiv.textContent = "No active timer";
        startBtn.disabled = false;
        stopBtn.disabled = true;
    } else {
        const customer = customers.find(
            (c) => c.id === activeTimer.customerId
        );
        const name = customer ? customer.name : "Unknown customer";
        statusDiv.textContent = `Running: ${name} (${activeTimer.employeeName || "no employee name"})`;
        startBtn.disabled = true;
        stopBtn.disabled = false;
    }
}

// ---- Event handlers ----
function handleAddCustomer(event) {
    event.preventDefault();

    const nameInput = document.getElementById("customerName");
    const phoneInput = document.getElementById("customerPhone");
    const emailInput = document.getElementById("customerEmail");
    const addrInput = document.getElementById("customerAddress");

    const name = nameInput.value.trim();
    if (!name) return;

    const newCustomer = {
        id: "c_" + Date.now(),
        name,
        phone: phoneInput.value.trim(),
        email: emailInput.value.trim(),
        address: addrInput.value.trim()
    };

    customers.push(newCustomer);
    saveData();
    renderCustomers();

    // Clear form
    nameInput.value = "";
    phoneInput.value = "";
    emailInput.value = "";
    addrInput.value = "";
}

function handleStartTimer() {
    if (activeTimer) return; // already running

    const customerSelect = document.getElementById("timerCustomerSelect");
    const employeeInput = document.getElementById("timerEmployeeName");

    const customerId = customerSelect.value;
    if (!customerId) {
        alert("Please select a customer first.");
        return;
    }

    const employeeName = employeeInput.value.trim();

    activeTimer = {
        customerId,
        employeeName,
        startTime: new Date().toISOString()
    };

    renderTimerStatus();
}

function handleStopTimer() {
    if (!activeTimer) return;

    const endTime = new Date().toISOString();
    const start = new Date(activeTimer.startTime);
    const end = new Date(endTime);

    const durationMinutes = Math.max(
        1,
        Math.round((end.getTime() - start.getTime()) / 60000)
    );

    const log = {
        id: "l_" + Date.now(),
        customerId: activeTimer.customerId,
        employeeName: activeTimer.employeeName,
        startTime: activeTimer.startTime,
        endTime,
        durationMinutes
    };

    timeLogs.push(log);
    activeTimer = null;

    saveData();
    renderTimerStatus();
    renderTimeLogs();
}

// ---- Init ----
document.addEventListener("DOMContentLoaded", () => {
    loadData();
    renderCustomers();
    renderTimeLogs();
    renderTimerStatus();

    document
        .getElementById("customerForm")
        .addEventListener("submit", handleAddCustomer);

    document
        .getElementById("startTimerBtn")
        .addEventListener("click", handleStartTimer);

    document
        .getElementById("stopTimerBtn")
        .addEventListener("click", handleStopTimer);
});
