:root {
    --bg: #020617;
    --bg-soft: #020617;
    --text: #e5e7eb;
    --muted: #9ca3af;
    --card: #020617;
    --accent: #22c55e;
    --accent-soft: #14532d;
    --border: #1f2937;
}

[data-theme="light"] {
    --bg: #f3f4f6;
    --bg-soft: #e5e7eb;
    --text: #020617;
    --muted: #6b7280;
    --card: #ffffff;
    --accent: #16a34a;
    --accent-soft: #bbf7d0;
    --border: #d1d5db;
}

* {
    box-sizing: border-box;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

body {
    margin: 0;
    min-height: 100vh;
    background:
        radial-gradient(circle at top left, rgba(34, 197, 94, 0.22), transparent 55%),
        radial-gradient(circle at bottom right, rgba(56, 189, 248, 0.18), transparent 55%),
        var(--bg);
    color: var(--text);
}

/* TOPBAR */

.topbar {
    position: sticky;
    top: 0;
    z-index: 30;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.7rem 1.1rem;
    background: rgba(15, 23, 42, 0.9);
    backdrop-filter: blur(18px);
    box-shadow: 0 12px 32px rgba(15, 23, 42, 0.7);
}

.topbar-left {
    display: flex;
    align-items: center;
    gap: 0.7rem;
}

.logo {
    width: 34px;
    height: 34px;
    border-radius: 999px;
    background:
        conic-gradient(from 220deg, #22c55e, #a3e635, #4ade80, #22c55e);
    box-shadow: 0 0 20px rgba(34, 197, 94, 0.9);
}

.topbar-title h1 {
    margin: 0;
    font-size: 1.05rem;
    letter-spacing: 0.03em;
}

.topbar-title span {
    display: block;
    font-size: 0.75rem;
    color: #9ca3af;
    margin-top: 0.1rem;
}

.topbar-right {
    display: flex;
    align-items: center;
    gap: 0.4rem;
}

/* CHIP BUTTONS */

.chip-btn {
    border-radius: 999px;
    border: 1px solid rgba(148, 163, 184, 0.8);
    background: rgba(15, 23, 42, 0.85);
    color: #e5e7eb;
    padding: 0.3rem 0.7rem;
    font-size: 0.9rem;
    cursor: pointer;
}

/* SIDEBAR */

.sidebar {
    position: fixed;
    top: 56px;
    bottom: 0;
    left: 0;
    width: 230px;
    background: rgba(15, 23, 42, 0.96);
    border-right: 1px solid rgba(30, 64, 175, 0.6);
    padding: 0.7rem 0.3rem;
    overflow-y: auto;
}

.sidebar ul {
    list-style: none;
    margin: 0;
    padding: 0;
}

.sidebar li {
    padding: 0.7rem 0.9rem;
    margin: 0.15rem 0.4rem;
    cursor: pointer;
    border-radius: 999px;
    font-size: 0.92rem;
    color: #e5e7eb;
    display: flex;
    align-items: center;
    transition: background 0.16s ease, transform 0.12s ease;
}

.sidebar li:hover {
    background: rgba(30, 64, 175, 0.7);
    transform: translateX(2px);
}

.sidebar li.active {
    background: linear-gradient(90deg, #16a34a, #22c55e);
    color: #f9fafb;
    box-shadow: 0 0 16px rgba(22, 163, 74, 0.9);
}

/* MAIN LAYOUT */

main {
    margin-left: 244px;
    padding: 1.4rem 1.6rem 2.6rem;
    max-width: 1240px;
}

.page {
    display: none;
    animation: fadeIn 0.25s ease-out;
}

.page.visible {
    display: block;
}

h2 {
    margin-top: 0;
    margin-bottom: 0.35rem;
}

.page-intro {
    margin-top: 0;
    margin-bottom: 1rem;
    font-size: 0.9rem;
    color: var(--muted);
}

/* CARDS & GRID */

.card {
    background:
        radial-gradient(circle at top left, rgba(56, 189, 248, 0.12), transparent 55%),
        radial-gradient(circle at bottom right, rgba(34, 197, 94, 0.18), transparent 65%),
        var(--card);
    border-radius: 18px;
    padding: 1rem 1.25rem 1.3rem;
    margin-bottom: 1rem;
    border: 1px solid rgba(148, 163, 184, 0.4);
    box-shadow: 0 22px 40px rgba(15, 23, 42, 0.7);
}

.grid-2 {
    display: grid;
    grid-template-columns: minmax(0, 1.05fr) minmax(0, 1.15fr);
    gap: 1rem;
}

/* DASHBOARD CARDS */

.dashboard-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
    gap: 1rem;
}

.dash-card {
    background:
        radial-gradient(circle at top, var(--accent-soft), transparent 60%),
        var(--card);
    border-radius: 18px;
    padding: 0.9rem 1rem;
    border: 1px solid rgba(148, 163, 184, 0.5);
    box-shadow: 0 20px 42px rgba(15, 23, 42, 0.75);
}

.dash-card h3 {
    margin: 0;
    font-size: 0.9rem;
    color: var(--muted);
}

.dash-card p {
    margin: 0.4rem 0 0;
    font-size: 1.6rem;
    font-weight: 700;
}

/* FORMS */

label {
    display: block;
    font-size: 0.82rem;
    margin-bottom: 0.15rem;
    color: var(--muted);
}

input,
select,
button {
    width: 100%;
    padding: 0.55rem 0.7rem;
    border-radius: 999px;
    border: 1px solid var(--border);
    background: rgba(15, 23, 42, 0.12);
    color: var(--text);
    font-size: 0.9rem;
    margin-bottom: 0.55rem;
}

input:focus,
select:focus {
    outline: none;
    border-color: var(--accent);
    box-shadow: 0 0 0 2px rgba(34, 197, 94, 0.5);
}

button {
    background: linear-gradient(135deg, var(--accent), #4ade80);
    color: #052e16;
    font-weight: 600;
    border: none;
    cursor: pointer;
    box-shadow: 0 14px 30px rgba(22, 163, 74, 0.7);
    margin-top: 0.1rem;
    transition: transform 0.1s ease, box-shadow 0.1s ease;
}

button:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 18px 40px rgba(22, 163, 74, 0.85);
}

button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    box-shadow: none;
}

.button-row {
    display: flex;
    gap: 0.7rem;
    margin-top: 0.4rem;
}

/* TIMER STATUS */

.timer-status {
    margin: 0.4rem 0 0.6rem;
    font-size: 0.92rem;
    font-weight: 500;
}

/* TABLES */

table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.86rem;
}

th,
td {
    padding: 0.45rem 0.55rem;
    border-bottom: 1px solid rgba(148, 163, 184, 0.4);
}

th {
    text-align: left;
    font-weight: 600;
    color: var(--muted);
    font-size: 0.8rem;
}

/* FILTER ROW (REPORTS) */

.filter-row {
    display: flex;
    flex-wrap: wrap;
    gap: 0.8rem;
    margin-bottom: 0.4rem;
}

.filter-row > div {
    flex: 1 1 160px;
}

/* CALENDAR */

.calendar-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.6rem;
}

.cal-month-label {
    font-weight: 600;
}

.calendar-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 0.25rem;
    font-size: 0.8rem;
}

.day-name {
    text-align: center;
    font-weight: 600;
    color: var(--muted);
    padding-bottom: 0.2rem;
}

#calendarCells {
    display: contents;
}

.calendar-cell {
    min-height: 70px;
    border-radius: 12px;
    border: 1px solid rgba(148, 163, 184, 0.45);
    padding: 0.25rem 0.3rem;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background: rgba(15, 23, 42, 0.18);
}

.calendar-cell.empty {
    border-style: dashed;
    opacity: 0.3;
    cursor: default;
}

.calendar-cell .date-number {
    font-size: 0.78rem;
    color: var(--muted);
}

.calendar-cell .load-pill {
    align-self: flex-start;
    margin-top: 0.3rem;
    padding: 0.15rem 0.45rem;
    border-radius: 999px;
    background: rgba(34, 197, 94, 0.15);
    color: #bbf7d0;
    font-size: 0.72rem;
}

.calendar-cell.selected {
    border-color: var(--accent);
    box-shadow: 0 0 0 1px rgba(34, 197, 94, 0.8);
}

.selected-day-label {
    margin-top: 0.7rem;
    font-size: 0.85rem;
    color: var(--muted);
}

/* DAY PLAN LIST */

.day-plan-list {
    list-style: none;
    padding: 0;
    margin: 0;
    font-size: 0.86rem;
}

.day-plan-list li {
    padding: 0.4rem 0.3rem;
    border-bottom: 1px solid rgba(148, 163, 184, 0.4);
}

.day-plan-list li span {
    display: inline-block;
    margin-right: 0.4rem;
}

/* FOOTER */

.footer {
    text-align: center;
    padding: 0.9rem 0.6rem 1.4rem;
    font-size: 0.78rem;
    color: var(--muted);
}

/* ANIMATION */

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(4px); }
    to   { opacity: 1; transform: translateY(0); }
}

/* RESPONSIVE */

.nav-toggle {
    display: none;
}

@media (max-width: 900px) {
    main {
        margin-left: 0;
        padding: 1rem 1rem 2.4rem;
    }

    .sidebar {
        display: none;
        width: 220px;
        z-index: 40;
    }

    .sidebar.open {
        display: block;
    }

    .nav-toggle {
        display: inline-flex;
    }

    .grid-2 {
        grid-template-columns: minmax(0, 1fr);
    }
}
