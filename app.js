/* ======================================================
   AFSNIT 01 – NAVIGATION
====================================================== */
const pages = document.querySelectorAll(".page");
const menuItems = document.querySelectorAll(".menu-item");
const pageTitle = document.getElementById("pageTitle");

menuItems.forEach(item => {
    item.addEventListener("click", () => {
        const page = item.dataset.page;
        showPage(page);
    });
});

function showPage(pageName) {
    pages.forEach(p => p.classList.add("hidden"));
    document.getElementById("page-" + pageName).classList.remove("hidden");

    menuItems.forEach(i => i.classList.remove("active"));
    document.querySelector(`[data-page="${pageName}"]`).classList.add("active");

    pageTitle.textContent = document.querySelector(`[data-page="${pageName}"]`).textContent;
}

/* ======================================================
   AFSNIT 02 – SPROG
====================================================== */
const langBtns = document.querySelectorAll(".langBtn");

langBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        localStorage.setItem("gtp_lang", btn.dataset.lang);
    });
});

/* ======================================================
   AFSNIT 03 – TEMA
====================================================== */
document.getElementById("themeToggle").addEventListener("click", () => {
    let current = document.documentElement.getAttribute("data-theme");
    let next = current === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("gtp_theme", JSON.stringify(next));
});

/* ======================================================
   AFSNIT 04 – TIMER
====================================================== */
let timerInterval;
let timerSeconds = 0;

function updateTimer() {
    let h = String(Math.floor(timerSeconds / 3600)).padStart(2, "0");
    let m = String(Math.floor((timerSeconds % 3600) / 60)).padStart(2, "0");
    let s = String(timerSeconds % 60).padStart(2, "0");
    document.getElementById("timerDisplay").textContent = `${h}:${m}:${s}`;
}

document.getElementById("startTimer").addEventListener("click", () => {
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timerSeconds++;
        updateTimer();
    }, 1000);
});

document.getElementById("stopTimer").addEventListener("click", () => {
    clearInterval(timerInterval);
});
