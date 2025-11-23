// =================== DATA & STORAGE ===================

let customers = [];
let employees = [];
let timeLogs = [];
let activeTimer = null; // { customerId, employee, startTime }

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

// =================== NAVIGATION (SPA) ===================

function showPage(pageId) {
    document.querySelectorAll(".page").forEach(p => p.classList.remove("visible"));
    const page = document.getElementById(pageId);
    if (page) page.classList.add("visible");

    document.querySelectorAll(".sidebar li").forEach(li => li.classList.remove("active"));
    const navItem = document.querySelector(`.sidebar li[data-page="${pageId}"]`);
    if (navItem) navItem.classList.add("active");
}

// =================== RENDER FUNCTIONS ===================

function renderCustomers() {
    const tbody = document.querySelector("#customerTable tbody");
    const selTimer = document.getElementById("timerCustomerSelect");
    const selReport = document.getElementById("reportCustomerSelect");

    if (tbody) tbody.innerHTML = "";
    if (selTimer) selTimer.innerHTML = "";
    if (selReport) selReport.innerHTML = "";

    // "All customers" option for reports
    if (selReport) {
        const optAll = document.createElement("option");
        optAll.value = "";
        optAll.textContent = "All customers";
        selReport.appendChild(optAll);
    }

    customers.forEach(c => {
        if (tbody) {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${c.name}</td>
                <td>${c.phone || ""}</td>
                <td>${c.email || ""}</td>
                <td>${c.address || ""}</td>
            `;
            tbody.appendChild(tr);
        }

        if (selTimer) {
            const opt = document.createElement("option");
            opt.value = c.id;
            opt.textContent = c.name;
            selTimer.appendChild(opt);
        }

        if (selReport) {
            const opt2 = document.createElement("option");
            opt2.value = c.id;
            opt2.textContent = c.name;
            selReport.appendChild(opt2);
        }
    });

    const dashCustomers = document.getElementById("dashTotalCustomers");
    if (dashCustomers) dashCustomers.textContent = customers.length;
}

function renderEmployees() {
    const tbody = document.querySelector("#employeeTable tbody");
    const selTimer = document.getElementById("timerEmployeeSelect");
    const selReport = document.getElementById("reportEmployeeSelect");

    if (tbody) tbody.innerHTML = "";
    if (selTimer) selTimer.innerHTML = "";
    if (selReport) selReport.innerHTML = "";

    // "All employees" option for reports
    if (selReport) {
        const optAllEmp = document.createElement("option");
        optAllEmp.value = "";
        optAllEmp.textContent = "All employees";
        selReport.appendChild(optAllEmp);
    }

    employees.forEach(e => {
        if (tbody) {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${e.name}</td>
                <td>${e.email || ""}</td>
                <td>${e.role}</td>
            `;
            tbody.appendChild(tr);
        }

        if (selTimer) {
            const opt = document.createElement("option");
            opt.value = e.id;
            opt.textContent = e.name;
            selTimer.appendChild(opt);
        }

        if (selReport) {
            const opt2 = document.createElement("option");
            opt2.value = e.name; // filter by name in logs
            opt2.textContent = e.name;
            selReport.appendChild(opt2);
        }
    });

    const dashEmp = document.getElementById("dashTotalEmployees");
    if (dashEmp) dashEmp.textContent = employees.length;
}

function renderLogs() {
    const tbody = document.querySelector("#timeLogTable tbody");
    if (!tbody) return;

    tbody.innerHTML = "";
    const today = new Date().toISOString().slice(0, 10);
    let count = 0;

    timeLogs
        .filter(l => (l.startTime || "").slice(0, 10) === today)
        .forEach(log => {
            const tr = document.createElement("tr");
            const customer = customers.find(c => c.id === log.customerId);
            tr.innerHTML = `
                <td>${new Date(log.startTime).toLocaleTimeString()}</td>
                <td>${new Date(log.endTime).toLocaleTimeString()}</td>
                <td>${log.duration}</td>
                <td>${customer ? customer.name : "?"}</td>
                <td>${log.employee}</td>
            `;
            tbody.appendChild(tr);
            count++;
        });

    const dashLogs = document.getElementById("dashTodayLogs");
    if (dashLogs) dashLogs.textContent = count;
}

function renderTimer() {
    const status = document.getElementById("timerStatus");
    const stopBtn = document.getElementById("stopTimerBtn");

    if (!status || !stopBtn) return;

    if (!activeTimer) {
        status.textContent = "No active timer";
        stopBtn.disabled = true;
    } else {
        const customer = customers.find(c => c.id === activeTimer.customerId);
        const cname = customer ? customer.name : "?";
        status.textContent = `Running: ${cname} – ${activeTimer.employee}`;
        stopBtn.disabled = false;
    }
}

// =================== REPORTS ===================

function generateReport() {
    const fromInput = document.getElementById("reportDateFrom");
    const toInput = document.getElementById("reportDateTo");
    const custSel = document.getElementById("reportCustomerSelect");
    const empSel = document.getElementById("reportEmployeeSelect");
    const tbody = document.querySelector("#reportTable tbody");
    const summary = document.getElementById("reportSummary");

    if (!tbody || !summary) return;

    tbody.innerHTML = "";

    const fromDate = fromInput?.value || "";
    const toDate = toInput?.value || "";
    const custId = custSel?.value || "";
    const empName = empSel?.value || "";

    let filtered = [...timeLogs];

    // Date filter (inclusive)
    if (fromDate) {
        filtered = filtered.filter(l => (l.startTime || "").slice(0, 10) >= fromDate);
    }
    if (toDate) {
        filtered = filtered.filter(l => (l.startTime || "").slice(0, 10) <= toDate);
    }

    if (custId) {
        filtered = filtered.filter(l => l.customerId === custId);
    }

    if (empName) {
        filtered = filtered.filter(l => l.employee === empName);
    }

    let totalMinutes = 0;

    filtered.forEach(log => {
        const customer = customers.find(c => c.id === log.customerId);
        const dateStr = (log.startTime || "").slice(0, 10);
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${dateStr}</td>
            <td>${new Date(log.startTime).toLocaleTimeString()}</td>
            <td>${new Date(log.endTime).toLocaleTimeString()}</td>
            <td>${log.duration}</td>
            <td>${customer ? customer.name : "?"}</td>
            <td>${log.employee}</td>
        `;
        tbody.appendChild(tr);
        totalMinutes += Number(log.duration) || 0;
    });

    const hours = (totalMinutes / 60).toFixed(2);
    const periodText =
        fromDate || toDate
            ? `Period: ${fromDate || "…"} – ${toDate || "…"}`
            : "All dates";

    summary.textContent = `${filtered.length} log(s), ${totalMinutes} minutes (${hours} hours). ${periodText}`;
}

// =================== INIT & EVENTS ===================

document.addEventListener("DOMContentLoaded", () => {
    loadData();

    // Side menu navigation
    document.querySelectorAll(".sidebar li").forEach(li => {
        li.addEventListener("click", () => {
            showPage(li.dataset.page);
        });
    });

    // Mobile nav toggle
    const navToggle = document.getElementById("navToggle");
    const sidebar = document.getElementById("sidebar");
    if (navToggle && sidebar) {
        navToggle.addEventListener("click", () => {
            sidebar.classList.toggle("open");
        });
    }

    // Theme toggle
    const themeToggle = document.getElementById("themeToggle");
    const savedTheme = localStorage.getItem("gtp_theme") || "light";
    document.documentElement.setAttribute("data-theme", savedTheme);
    if (themeToggle) {
        themeToggle.textContent = savedTheme === "dark" ? "☀️" : "🌙";
        themeToggle.onclick = () => {
            const current = document.documentElement.getAttribute("data-theme");
            const next = current === "dark" ? "light" : "dark";
            document.documentElement.setAttribute("data-theme", next);
            localStorage.setItem("gtp_theme", next);
            themeToggle.textContent = next === "dark" ? "☀️" : "🌙";
        };
    }

    // Forms
    const customerForm = document.getElementById("customerForm");
    if (customerForm) {
        customerForm.addEventListener("submit", e => {
            e.preventDefault();
            const c = {
                id: "c" + Date.now(),
                name: document.getElementById("customerName").value.trim(),
                phone: document.getElementById("customerPhone").value.trim(),
                email: document.getElementById("customerEmail").value.trim(),
                address: document.getElementById("customerAddress").value.trim()
            };
            if (!c.name) return;
            customers.push(c);
            saveData();
            renderCustomers();
            customerForm.reset();
        });
    }

    const employeeForm = document.getElementById("employeeForm");
    if (employeeForm) {
        employeeForm.addEventListener("submit", e => {
            e.preventDefault();
            const emp = {
                id: "e" + Date.now(),
                name: document.getElementById("employeeName").value.trim(),
                email: document.getElementById("employeeEmail").value.trim(),
                role: document.getElementById("employeeRole").value
            };
            if (!emp.name) return;
            employees.push(emp);
            saveData();
            renderEmployees();
            employeeForm.reset();
        });
    }

    // Timer start
    const startBtn = document.getElementById("startTimerBtn");
    if (startBtn) {
        startBtn.addEventListener("click", () => {
            const custSel = document.getElementById("timerCustomerSelect");
            const empSel = document.getElementById("timerEmployeeSelect");
            const empNameInput = document.getElementById("timerEmployeeName");

            const cid = custSel ? custSel.value : "";
            if (!cid) {
                alert("Please select a customer.");
                return;
            }

            let empName = "";
            if (empSel && empSel.value) {
                const empObj = employees.find(e => e.id === empSel.value);
                empName = empObj ? empObj.name : "";
            }
            if (!empName && empNameInput) {
                empName = empNameInput.value.trim();
            }
            if (!empName) empName = "Unknown";

            activeTimer = {
                customerId: cid,
                employee: empName,
                startTime: new Date().toISOString()
            };
            saveData();
            renderTimer();
        });
    }

    // Timer stop
    const stopBtn = document.getElementById("stopTimerBtn");
    if (stopBtn) {
        stopBtn.addEventListener("click", () => {
            if (!activeTimer) return;
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
            generateReport(); // opdater rapport automatisk
        });
    }

    // Report generate
    const reportBtn = document.getElementById("reportGenerateBtn");
    if (reportBtn) {
        reportBtn.addEventListener("click", () => {
            generateReport();
        });
    }

    // Sæt default datoer til i dag
    const todayStr = new Date().toISOString().slice(0, 10);
    const reportFrom = document.getElementById("reportDateFrom");
    const reportTo = document.getElementById("reportDateTo");
    if (reportFrom) reportFrom.value = todayStr;
    if (reportTo) reportTo.value = todayStr;

    // Første rendering
    renderCustomers();
    renderEmployees();
    renderLogs();
    renderTimer();
    generateReport();
});
