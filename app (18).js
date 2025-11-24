/* ======================================================
   AFSNIT 01 – GLOBAL STATE & HJÆLPEFUNKTIONER
   ====================================================== */

let customers = [];
let employees = [];
let logs = [];
let plans = [];

let quickTimer = null;
let quickIntervalId = null;

let activeTimer = null;

let currentLang = "da";
let currentTheme = "light";

let calendarMonth = new Date(); // den måned der vises i kalenderen
let selectedCalendarDate = null; // "yyyy-mm-dd" string

const STORAGE_KEYS = {
    customers: "gtp_customers",
    employees: "gtp_employees",
    logs: "gtp_logs",
    plans: "gtp_plans",
    activeTimer: "gtp_active_timer",
    quickTimer: "gtp_quick_timer",
    theme: "gtp_theme",
    lang: "gtp_lang"
};

function uuid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

function toDateString(d) {
    return d.toISOString().slice(0, 10);
}

function formatTimeFromSeconds(sec) {
    const h = String(Math.floor(sec / 3600)).padStart(2, "0");
    const m = String(Math.floor((sec % 3600) / 60)).padStart(2, "0");
    const s = String(sec % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
}

function safeParse(key, fallback) {
    try {
        const raw = localStorage.getItem(key);
        if (!raw) return fallback;
        const value = JSON.parse(raw);
        return value == null ? fallback : value;
    } catch (e) {
        return fallback;
    }
}

function getCustomerName(id) {
    const c = customers.find(c => c.id === id);
    return c ? c.name : "";
}

function getEmployeeName(id) {
    const e = employees.find(e => e.id === id);
    return e ? e.name : "";
}

function getLocaleForLang(lang) {
    switch (lang) {
        case "en": return "en-GB";
        case "de": return "de-DE";
        case "lt": return "lt-LT";
        default:   return "da-DK";
    }
}

function parseDateString(dateStr) {
    // "yyyy-mm-dd" -> Date
    return new Date(`${dateStr}T00:00:00`);
}

/* ======================================================
   AFSNIT 02 – LOCAL STORAGE
   ====================================================== */

function loadAll() {
    customers   = safeParse(STORAGE_KEYS.customers, []);
    employees   = safeParse(STORAGE_KEYS.employees, []);
    logs        = safeParse(STORAGE_KEYS.logs, []);
    plans       = safeParse(STORAGE_KEYS.plans, []);
    activeTimer = safeParse(STORAGE_KEYS.activeTimer, null);
    quickTimer  = safeParse(STORAGE_KEYS.quickTimer, null);

    currentTheme = safeParse(STORAGE_KEYS.theme, "light");
    currentLang  = safeParse(STORAGE_KEYS.lang, "da");
}

function saveAll() {
    localStorage.setItem(STORAGE_KEYS.customers, JSON.stringify(customers));
    localStorage.setItem(STORAGE_KEYS.employees, JSON.stringify(employees));
    localStorage.setItem(STORAGE_KEYS.logs, JSON.stringify(logs));
    localStorage.setItem(STORAGE_KEYS.plans, JSON.stringify(plans));
    localStorage.setItem(STORAGE_KEYS.activeTimer, JSON.stringify(activeTimer));
    localStorage.setItem(STORAGE_KEYS.quickTimer, JSON.stringify(quickTimer));
    localStorage.setItem(STORAGE_KEYS.theme, JSON.stringify(currentTheme));
    localStorage.setItem(STORAGE_KEYS.lang, JSON.stringify(currentLang));
}

/* ======================================================
   AFSNIT 03 – SPROG & TEMA
   ====================================================== */

/* --- Oversættelser (forenklet, kan udvides senere) --- */

const translations = {
    da: {
        app_title: "GreenTime Pro",

        menu_dashboard: "Tidsregistrering",
        menu_customers: "Kunder",
        menu_employees: "Medarbejdere",
        menu_time_tracking: "Detaljeret tid",
        menu_schedule: "Plan & kalender",
        menu_logs: "Logs",
        menu_reports: "Rapporter",
        menu_settings: "Indstillinger",

        dashboard_title: "Tidsregistrering",
        quick_select_customer: "Vælg kunde",
        quick_select_employees: "Vælg medarbejdere",
        quick_time_label: "Vis tid for kunden:",
        quick_mode_today: "I dag",
        quick_mode_total: "Samlet tid",
        quick_hint: "Vælg kunde og medarbejdere og brug Start / Stop.",
        btn_start_timer: "Start",
        btn_stop_timer: "Stop",

        customers_title: "Kunder",
        customers_add: "Tilføj kunde",
        customers_list: "Kundeliste",
        customers_reset_title: "Nulstil tid for kunde",

        label_customer_name: "Navn",
        label_customer_phone: "Telefon",
        label_customer_email: "Email",
        label_customer_address: "Adresse",
        label_reset_customer: "Vælg kunde",
        btn_save_customer: "Gem kunde",
        btn_reset_customer_time: "Nulstil al tid",

        employees_title: "Medarbejdere",
        employees_add: "Tilføj medarbejder",
        employees_list: "Medarbejderliste",
        label_employee_name: "Navn",
        label_employee_email: "Email",
        label_employee_role: "Rolle",
        role_employee: "Medarbejder",
        role_admin: "Admin",
        btn_save_employee: "Gem medarbejder",

        time_title: "Tidsregistrering",
        time_start_stop: "Start / stop",
        label_timer_customer: "Kunde",
        label_timer_employee: "Medarbejder",
        timer_no_active: "Ingen aktiv timer",

        logs_page_title: "Logs",
        logs_page_desc: "Senere kan du få fuldt overblik her. Brug indtil videre fanerne for tid og rapporter.",
        logs_today_title: "Dagens logs",

        schedule_title: "Plan & kalender",
        schedule_plan_job: "Planlæg opgave",
        label_plan_date: "Dato",
        label_plan_start: "Starttid",
        label_plan_duration: "Varighed (timer, 0,5–8)",
        label_plan_customer: "Kunde",
        label_plan_employee: "Medarbejdere",
        label_plan_note: "Note",
        btn_save_plan: "Gem opgave",
        schedule_selected_day: "Klik på en dag for at se opgaver.",

        reports_title: "Rapporter",
        reports_filter_title: "Filtre",
        reports_result_title: "Resultat",
        label_report_date_from: "Fra dato",
        label_report_date_to: "Til dato",
        label_report_customer: "Kunde",
        label_report_employee: "Medarbejder",
        btn_run_report: "Kør rapport",

        settings_title: "Indstillinger",
        settings_language_title: "Sprog",
        settings_theme_title: "Tema",

        th_customer_name: "Navn",
        th_customer_phone: "Telefon",
        th_customer_email: "Email",
        th_customer_address: "Adresse",

        th_employee_name: "Navn",
        th_employee_email: "Email",
        th_employee_role: "Rolle",

        th_log_start: "Start",
        th_log_end: "Slut",
        th_log_duration: "Minutter",
        th_log_customer: "Kunde",
        th_log_employee: "Medarbejder",

        th_report_date: "Dato",
        th_report_start: "Start",
        th_report_end: "Slut",
        th_report_duration: "Minutter",
        th_report_customer: "Kunde",
        th_report_employee: "Medarbejder",

        weekday_mon: "Man",
        weekday_tue: "Tir",
        weekday_wed: "Ons",
        weekday_thu: "Tor",
        weekday_fri: "Fre",
        weekday_sat: "Lør",
        weekday_sun: "Søn",

        // Tekster som kun bruges i JS:
        msg_select_customer: "Vælg en kunde først.",
        msg_select_employees: "Vælg mindst én medarbejder.",
        msg_select_customer_employee: "Vælg både kunde og medarbejder.",
        msg_select_date: "Vælg en dato.",
        msg_select_start: "Vælg en starttid.",
        msg_select_customer_plan: "Vælg en kunde.",
        msg_duration_invalid: "Varighed skal være mellem 0,5 og 8 timer.",
        msg_no_plans_for_day: "Ingen opgaver på denne dag.",
        msg_reset_choose_customer: "Vælg en kunde, der skal nulstilles.",
        msg_reset_done_prefix: "Nulstillede",
        msg_reset_done_suffix: "log(s) for kunden.",
        msg_report_summary_prefix: "Fundet",
        msg_report_summary_suffix: "linje(r) i rapporten.",
        placeholder_select_customer: "Vælg kunde",
        placeholder_select_employee: "Vælg medarbejder",
        placeholder_all_customers: "Alle kunder",
        placeholder_all_employees: "Alle medarbejdere"
    },

    // Engelske tekster (kort og tydelige)
    en: {
        app_title: "GreenTime Pro",

        menu_dashboard: "Time tracking",
        menu_customers: "Customers",
        menu_employees: "Employees",
        menu_time_tracking: "Detailed time",
        menu_schedule: "Plan & calendar",
        menu_logs: "Logs",
        menu_reports: "Reports",
        menu_settings: "Settings",

        dashboard_title: "Time tracking",
        quick_select_customer: "Select customer",
        quick_select_employees: "Select employees",
        quick_time_label: "Show time for customer:",
        quick_mode_today: "Today",
        quick_mode_total: "Total time",
        quick_hint: "Select customer and employees, then use Start / Stop.",
        btn_start_timer: "Start",
        btn_stop_timer: "Stop",

        customers_title: "Customers",
        customers_add: "Add customer",
        customers_list: "Customer list",
        customers_reset_title: "Reset time for customer",

        label_customer_name: "Name",
        label_customer_phone: "Phone",
        label_customer_email: "Email",
        label_customer_address: "Address",
        label_reset_customer: "Select customer",
        btn_save_customer: "Save customer",
        btn_reset_customer_time: "Reset all time",

        employees_title: "Employees",
        employees_add: "Add employee",
        employees_list: "Employee list",
        label_employee_name: "Name",
        label_employee_email: "Email",
        label_employee_role: "Role",
        role_employee: "Employee",
        role_admin: "Admin",
        btn_save_employee: "Save employee",

        time_title: "Time tracking",
        time_start_stop: "Start / stop",
        label_timer_customer: "Customer",
        label_timer_employee: "Employee",
        timer_no_active: "No active timer",

        logs_page_title: "Logs",
        logs_page_desc: "Later you can get full overview here. For now use the time and report tabs.",
        logs_today_title: "Today’s logs",

        schedule_title: "Plan & calendar",
        schedule_plan_job: "Plan task",
        label_plan_date: "Date",
        label_plan_start: "Start time",
        label_plan_duration: "Duration (hours, 0.5–8)",
        label_plan_customer: "Customer",
        label_plan_employee: "Employees",
        label_plan_note: "Note",
        btn_save_plan: "Save task",
        schedule_selected_day: "Click a day to see tasks.",

        reports_title: "Reports",
        reports_filter_title: "Filters",
        reports_result_title: "Result",
        label_report_date_from: "From date",
        label_report_date_to: "To date",
        label_report_customer: "Customer",
        label_report_employee: "Employee",
        btn_run_report: "Run report",

        settings_title: "Settings",
        settings_language_title: "Language",
        settings_theme_title: "Theme",

        th_customer_name: "Name",
        th_customer_phone: "Phone",
        th_customer_email: "Email",
        th_customer_address: "Address",

        th_employee_name: "Name",
        th_employee_email: "Email",
        th_employee_role: "Role",

        th_log_start: "Start",
        th_log_end: "End",
        th_log_duration: "Minutes",
        th_log_customer: "Customer",
        th_log_employee: "Employee",

        th_report_date: "Date",
        th_report_start: "Start",
        th_report_end: "End",
        th_report_duration: "Minutes",
        th_report_customer: "Customer",
        th_report_employee: "Employee",

        weekday_mon: "Mon",
        weekday_tue: "Tue",
        weekday_wed: "Wed",
        weekday_thu: "Thu",
        weekday_fri: "Fri",
        weekday_sat: "Sat",
        weekday_sun: "Sun",

        msg_select_customer: "Please select a customer first.",
        msg_select_employees: "Please select at least one employee.",
        msg_select_customer_employee: "Please select both customer and employee.",
        msg_select_date: "Please select a date.",
        msg_select_start: "Please select a start time.",
        msg_select_customer_plan: "Please select a customer.",
        msg_duration_invalid: "Duration must be between 0.5 and 8 hours.",
        msg_no_plans_for_day: "No tasks for this day.",
        msg_reset_choose_customer: "Select a customer to reset.",
        msg_reset_done_prefix: "Reset",
        msg_reset_done_suffix: "log(s) for the customer.",
        msg_report_summary_prefix: "Found",
        msg_report_summary_suffix: "row(s) in the report.",
        placeholder_select_customer: "Select customer",
        placeholder_select_employee: "Select employee",
        placeholder_all_customers: "All customers",
        placeholder_all_employees: "All employees"
    },

    // Tysk (forenklet, kan finpudses)
    de: {
        app_title: "GreenTime Pro",

        menu_dashboard: "Zeiterfassung",
        menu_customers: "Kunden",
        menu_employees: "Mitarbeiter",
        menu_time_tracking: "Detailzeit",
        menu_schedule: "Plan & Kalender",
        menu_logs: "Protokolle",
        menu_reports: "Berichte",
        menu_settings: "Einstellungen",

        dashboard_title: "Zeiterfassung",
        quick_select_customer: "Kunden wählen",
        quick_select_employees: "Mitarbeiter wählen",
        quick_time_label: "Zeit für Kunden anzeigen:",
        quick_mode_today: "Heute",
        quick_mode_total: "Gesamtzeit",
        quick_hint: "Kunden und Mitarbeiter wählen und Start / Stop benutzen.",
        btn_start_timer: "Start",
        btn_stop_timer: "Stop",

        customers_title: "Kunden",
        customers_add: "Kunden hinzufügen",
        customers_list: "Kundenliste",
        customers_reset_title: "Zeit für Kunden zurücksetzen",

        label_customer_name: "Name",
        label_customer_phone: "Telefon",
        label_customer_email: "E-Mail",
        label_customer_address: "Adresse",
        label_reset_customer: "Kunden wählen",
        btn_save_customer: "Kunden speichern",
        btn_reset_customer_time: "Alle Zeiten löschen",

        employees_title: "Mitarbeiter",
        employees_add: "Mitarbeiter hinzufügen",
        employees_list: "Mitarbeiterliste",
        label_employee_name: "Name",
        label_employee_email: "E-Mail",
        label_employee_role: "Rolle",
        role_employee: "Mitarbeiter",
        role_admin: "Admin",
        btn_save_employee: "Mitarbeiter speichern",

        time_title: "Zeiterfassung",
        time_start_stop: "Start / Stopp",
        label_timer_customer: "Kunde",
        label_timer_employee: "Mitarbeiter",
        timer_no_active: "Kein aktiver Timer",

        logs_page_title: "Protokolle",
        logs_page_desc: "Später bekommst du hier den vollen Überblick. Nutze vorerst die Zeit- und Bericht-Reiter.",
        logs_today_title: "Heutige Protokolle",

        schedule_title: "Plan & Kalender",
        schedule_plan_job: "Aufgabe planen",
        label_plan_date: "Datum",
        label_plan_start: "Startzeit",
        label_plan_duration: "Dauer (Stunden, 0,5–8)",
        label_plan_customer: "Kunde",
        label_plan_employee: "Mitarbeiter",
        label_plan_note: "Notiz",
        btn_save_plan: "Aufgabe speichern",
        schedule_selected_day: "Klicke einen Tag an, um Aufgaben zu sehen.",

        reports_title: "Berichte",
        reports_filter_title: "Filter",
        reports_result_title: "Ergebnis",
        label_report_date_from: "Von Datum",
        label_report_date_to: "Bis Datum",
        label_report_customer: "Kunde",
        label_report_employee: "Mitarbeiter",
        btn_run_report: "Bericht ausführen",

        settings_title: "Einstellungen",
        settings_language_title: "Sprache",
        settings_theme_title: "Theme",

        th_customer_name: "Name",
        th_customer_phone: "Telefon",
        th_customer_email: "E-Mail",
        th_customer_address: "Adresse",

        th_employee_name: "Name",
        th_employee_email: "E-Mail",
        th_employee_role: "Rolle",

        th_log_start: "Start",
        th_log_end: "Ende",
        th_log_duration: "Minuten",
        th_log_customer: "Kunde",
        th_log_employee: "Mitarbeiter",

        th_report_date: "Datum",
        th_report_start: "Start",
        th_report_end: "Ende",
        th_report_duration: "Minuten",
        th_report_customer: "Kunde",
        th_report_employee: "Mitarbeiter",

        weekday_mon: "Mo",
        weekday_tue: "Di",
        weekday_wed: "Mi",
        weekday_thu: "Do",
        weekday_fri: "Fr",
        weekday_sat: "Sa",
        weekday_sun: "So",

        msg_select_customer: "Bitte zuerst einen Kunden wählen.",
        msg_select_employees: "Bitte mindestens einen Mitarbeiter wählen.",
        msg_select_customer_employee: "Bitte Kunde und Mitarbeiter wählen.",
        msg_select_date: "Bitte ein Datum wählen.",
        msg_select_start: "Bitte eine Startzeit wählen.",
        msg_select_customer_plan: "Bitte einen Kunden wählen.",
        msg_duration_invalid: "Dauer muss zwischen 0,5 und 8 Stunden liegen.",
        msg_no_plans_for_day: "Keine Aufgaben an diesem Tag.",
        msg_reset_choose_customer: "Wähle einen Kunden zum Zurücksetzen.",
        msg_reset_done_prefix: "Zurückgesetzt:",
        msg_reset_done_suffix: "Protokoll(e) für den Kunden.",
        msg_report_summary_prefix: "Gefunden:",
        msg_report_summary_suffix: "Zeile(n) im Bericht.",
        placeholder_select_customer: "Kunde wählen",
        placeholder_select_employee: "Mitarbeiter wählen",
        placeholder_all_customers: "Alle Kunden",
        placeholder_all_employees: "Alle Mitarbeiter"
    },

    // Litauisk (simpel, kan forbedres)
    lt: {
        app_title: "GreenTime Pro",

        menu_dashboard: "Laiko registracija",
        menu_customers: "Klientai",
        menu_employees: "Darbuotojai",
        menu_time_tracking: "Detali laiko apskaita",
        menu_schedule: "Planavimas ir kalendorius",
        menu_logs: "Žurnalai",
        menu_reports: "Ataskaitos",
        menu_settings: "Nustatymai",

        dashboard_title: "Laiko registracija",
        quick_select_customer: "Pasirinkite klientą",
        quick_select_employees: "Pasirinkite darbuotojus",
        quick_time_label: "Rodyti laiką klientui:",
        quick_mode_today: "Šiandien",
        quick_mode_total: "Bendras laikas",
        quick_hint: "Pasirinkite klientą ir darbuotojus, tada naudokite Start / Stop.",
        btn_start_timer: "Start",
        btn_stop_timer: "Stop",

        customers_title: "Klientai",
        customers_add: "Pridėti klientą",
        customers_list: "Klientų sąrašas",
        customers_reset_title: "Nustatyti kliento laiką iš naujo",

        label_customer_name: "Vardas",
        label_customer_phone: "Telefonas",
        label_customer_email: "El. paštas",
        label_customer_address: "Adresas",
        label_reset_customer: "Pasirinkite klientą",
        btn_save_customer: "Išsaugoti klientą",
        btn_reset_customer_time: "Ištrinti visą laiką",

        employees_title: "Darbuotojai",
        employees_add: "Pridėti darbuotoją",
        employees_list: "Darbuotojų sąrašas",
        label_employee_name: "Vardas",
        label_employee_email: "El. paštas",
        label_employee_role: "Vaidmuo",
        role_employee: "Darbuotojas",
        role_admin: "Administratorius",
        btn_save_employee: "Išsaugoti darbuotoją",

        time_title: "Laiko registracija",
        time_start_stop: "Start / Stop",
        label_timer_customer: "Klientas",
        label_timer_employee: "Darbuotojas",
        timer_no_active: "Aktyvaus laikmačio nėra",

        logs_page_title: "Žurnalai",
        logs_page_desc: "Vėliau čia matysite pilną vaizdą. Kol kas naudokite laiko ir ataskaitų skirtukus.",
        logs_today_title: "Šiandienos žurnalai",

        schedule_title: "Planavimas ir kalendorius",
        schedule_plan_job: "Planuoti užduotį",
        label_plan_date: "Data",
        label_plan_start: "Pradžios laikas",
        label_plan_duration: "Trukmė (val., 0,5–8)",
        label_plan_customer: "Klientas",
        label_plan_employee: "Darbuotojai",
        label_plan_note: "Pastaba",
        btn_save_plan: "Išsaugoti užduotį",
        schedule_selected_day: "Paspauskite dieną, kad pamatytumėte užduotis.",

        reports_title: "Ataskaitos",
        reports_filter_title: "Filtrai",
        reports_result_title: "Rezultatas",
        label_report_date_from: "Nuo datos",
        label_report_date_to: "Iki datos",
        label_report_customer: "Klientas",
        label_report_employee: "Darbuotojas",
        btn_run_report: "Vykdyti ataskaitą",

        settings_title: "Nustatymai",
        settings_language_title: "Kalba",
        settings_theme_title: "Tema",

        th_customer_name: "Vardas",
        th_customer_phone: "Telefonas",
        th_customer_email: "El. paštas",
        th_customer_address: "Adresas",

        th_employee_name: "Vardas",
        th_employee_email: "El. paštas",
        th_employee_role: "Vaidmuo",

        th_log_start: "Pradžia",
        th_log_end: "Pabaiga",
        th_log_duration: "Minutės",
        th_log_customer: "Klientas",
        th_log_employee: "Darbuotojas",

        th_report_date: "Data",
        th_report_start: "Pradžia",
        th_report_end: "Pabaiga",
        th_report_duration: "Minutės",
        th_report_customer: "Klientas",
        th_report_employee: "Darbuotojas",

        weekday_mon: "Pr",
        weekday_tue: "An",
        weekday_wed: "Tr",
        weekday_thu: "Kt",
        weekday_fri: "Pn",
        weekday_sat: "Št",
        weekday_sun: "Sk",

        msg_select_customer: "Pirmiausia pasirinkite klientą.",
        msg_select_employees: "Pasirinkite bent vieną darbuotoją.",
        msg_select_customer_employee: "Pasirinkite ir klientą, ir darbuotoją.",
        msg_select_date: "Pasirinkite datą.",
        msg_select_start: "Pasirinkite pradžios laiką.",
        msg_select_customer_plan: "Pasirinkite klientą.",
        msg_duration_invalid: "Trukmė turi būti nuo 0,5 iki 8 valandų.",
        msg_no_plans_for_day: "Šiai dienai nėra užduočių.",
        msg_reset_choose_customer: "Pasirinkite klientą, kuriam iš naujo nustatyti laiką.",
        msg_reset_done_prefix: "Ištrinta",
        msg_reset_done_suffix: "įrašų šiam klientui.",
        msg_report_summary_prefix: "Rasta",
        msg_report_summary_suffix: "eilutė(-ių) ataskaitoje.",
        placeholder_select_customer: "Pasirinkite klientą",
        placeholder_select_employee: "Pasirinkite darbuotoją",
        placeholder_all_customers: "Visi klientai",
        placeholder_all_employees: "Visi darbuotojai"
    }
};

function t(key) {
    const langPack = translations[currentLang] || translations["da"];
    return langPack[key] || translations["da"][key] || "";
}

function applyTranslations() {
    const elements = document.querySelectorAll("[data-i18n]");
    elements.forEach(el => {
        const key = el.dataset.i18n;
        if (!key) return;
        const txt = t(key);
        if (txt) el.textContent = txt;
    });
}

function applyLangActiveButton() {
    const buttons = document.querySelectorAll(".lang-btn");
    buttons.forEach(btn => {
        const lang = btn.dataset.lang;
        btn.classList.toggle("active", lang === currentLang);
    });
}

function initLanguage() {
    if (!currentLang) currentLang = "da";
    applyLangActiveButton();
    applyTranslations();

    const buttons = document.querySelectorAll(".lang-btn");
    buttons.forEach(btn => {
        btn.addEventListener("click", () => {
            const lang = btn.dataset.lang;
            if (!lang) return;
            currentLang = lang;
            localStorage.setItem(STORAGE_KEYS.lang, JSON.stringify(currentLang));
            applyLangActiveButton();
            applyTranslations();
            renderCalendar();    // månedstekst
            renderTodayLogs();   // evt. oversatte tekster
            renderReportsTable([]); // overskrifter er allerede med data-i18n
        });
    });
}

function initTheme() {
    if (!currentTheme) currentTheme = "light";
    document.documentElement.dataset.theme = currentTheme;
}

function initThemeToggle() {
    const btn = document.getElementById("themeToggle");
    if (!btn) return;

    btn.addEventListener("click", () => {
        currentTheme = currentTheme === "light" ? "dark" : "light";
        document.documentElement.dataset.theme = currentTheme;
        localStorage.setItem(STORAGE_KEYS.theme, JSON.stringify(currentTheme));
    });
}

/* ======================================================
   AFSNIT 04 – NAVIGATION & SIDEBAR (MOBIL)
   ====================================================== */

function showPage(pageId) {
    const pages = document.querySelectorAll(".page");
    pages.forEach(p => {
        p.classList.toggle("visible", p.id === pageId);
    });
}

function initNavigation() {
    const menuItems = document.querySelectorAll(".sidebar nav li[data-page]");
    menuItems.forEach(li => {
        li.addEventListener("click", () => {
            const pageId = li.dataset.page;
            if (!pageId) return;

            menuItems.forEach(m => m.classList.remove("active"));
            li.classList.add("active");

            showPage(pageId);
            const sidebar = document.querySelector(".sidebar");
            if (sidebar) sidebar.classList.remove("open");
        });
    });

    showPage("dashboardPage");
}

function initSidebarToggle() {
    const btn = document.getElementById("menuToggle");
    const sidebar = document.querySelector(".sidebar");
    if (!btn || !sidebar) return;

    btn.addEventListener("click", () => {
        sidebar.classList.toggle("open");
    });
}

/* ======================================================
   AFSNIT 05 – KUNDER
   ====================================================== */

function refreshCustomerSelects() {
    const ids = [
        "quickCustomerSelect",
        "timerCustomerSelect",
        "planCustomerSelect",
        "reportCustomerSelect"
    ];

    ids.forEach(selectId => {
        const sel = document.getElementById(selectId);
        if (!sel) return;
        sel.innerHTML = "";

        const isReport = selectId === "reportCustomerSelect";
        const placeholder = isReport ? t("placeholder_all_customers")
                                     : t("placeholder_select_customer");

        const optEmpty = document.createElement("option");
        optEmpty.value = "";
        optEmpty.textContent = placeholder;
        sel.appendChild(optEmpty);

        customers.forEach(c => {
            const opt = document.createElement("option");
            opt.value = c.id;
            opt.textContent = c.name;
            sel.appendChild(opt);
        });
    });
}

function renderCustomerTable() {
    const table = document.getElementById("customerTable");
    if (!table) return;
    const tbody = table.querySelector("tbody");
    if (!tbody) return;

    tbody.innerHTML = "";
    customers.forEach(c => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${c.name || ""}</td>
            <td>${c.phone || ""}</td>
            <td>${c.email || ""}</td>
            <td>${c.address || ""}</td>
        `;
        tbody.appendChild(tr);
    });
}

function initCustomers() {
    const saveBtn = document.getElementById("saveCustomerBtn");
    if (!saveBtn) return;

    saveBtn.addEventListener("click", () => {
        const nameInput  = document.getElementById("custName");
        const phoneInput = document.getElementById("custPhone");
        const emailInput = document.getElementById("custEmail");
        const addrInput  = document.getElementById("custAddress");

        const name  = nameInput.value.trim();
        const phone = phoneInput.value.trim();
        const email = emailInput.value.trim();
        const addr  = addrInput.value.trim();

        if (!name) {
            alert("Skriv et navn på kunden.");
            return;
        }

        customers.push({
            id: uuid(),
            name,
            phone,
            email,
            address: addr
        });

        nameInput.value = "";
        phoneInput.value = "";
        emailInput.value = "";
        addrInput.value = "";

        saveAll();
        renderCustomerTable();
        refreshCustomerSelects();
    });

    const resetBtn = document.getElementById("resetCustomerTimeBtn");
    if (resetBtn) {
        resetBtn.addEventListener("click", () => {
            const sel = document.getElementById("resetCustomerSelect");
            if (!sel) return;
            const customerId = sel.value;
            if (!customerId) {
                alert(t("msg_reset_choose_customer"));
                return;
            }

            const before = logs.length;
            logs = logs.filter(l => l.customerId !== customerId);
            const removed = before - logs.length;

            saveAll();
            renderTodayLogs();
            initReports();

            const info = document.getElementById("resetCustomerInfo");
            if (info) {
                info.textContent = `${t("msg_reset_done_prefix")} ${removed} ${t("msg_reset_done_suffix")}`;
            }
        });
    }
}

/* ======================================================
   AFSNIT 06 – MEDARBEJDERE
   ====================================================== */

function renderEmployeeTable() {
    const table = document.getElementById("employeeTable");
    if (!table) return;
    const tbody = table.querySelector("tbody");
    if (!tbody) return;

    tbody.innerHTML = "";
    employees.forEach(e => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${e.name || ""}</td>
            <td>${e.email || ""}</td>
            <td>${e.role || ""}</td>
        `;
        tbody.appendChild(tr);
    });
}

function refreshEmployeeSelects() {
    const ids = [
        "timerEmployeeSelect",
        "reportEmployeeSelect"
    ];

    ids.forEach(selectId => {
        const sel = document.getElementById(selectId);
        if (!sel) return;
        sel.innerHTML = "";

        const isReport = selectId === "reportEmployeeSelect";
        const placeholder = isReport ? t("placeholder_all_employees")
                                     : t("placeholder_select_employee");

        const optEmpty = document.createElement("option");
        optEmpty.value = "";
        optEmpty.textContent = placeholder;
        sel.appendChild(optEmpty);

        employees.forEach(e => {
            const opt = document.createElement("option");
            opt.value = e.id;
            opt.textContent = e.name;
            sel.appendChild(opt);
        });
    });
}

function renderEmployeeChips() {
    const quickBox = document.getElementById("quickEmployeeList");
    const planBox  = document.getElementById("planEmployeeList");

    if (quickBox) quickBox.innerHTML = "";
    if (planBox)  planBox.innerHTML  = "";

    employees.forEach(e => {
        if (quickBox) {
            const chip = document.createElement("button");
            chip.type = "button";
            chip.className = "chip";
            chip.dataset.id = e.id;
            chip.textContent = e.name;
            chip.addEventListener("click", () => {
                chip.classList.toggle("selected");
            });
            quickBox.appendChild(chip);
        }

        if (planBox) {
            const chip = document.createElement("button");
            chip.type = "button";
            chip.className = "chip";
            chip.dataset.id = e.id;
            chip.textContent = e.name;
            chip.addEventListener("click", () => {
                chip.classList.toggle("selected");
            });
            planBox.appendChild(chip);
        }
    });
}

function initEmployees() {
    const saveBtn = document.getElementById("saveEmployeeBtn");
    if (!saveBtn) return;

    saveBtn.addEventListener("click", () => {
        const nameInput  = document.getElementById("empName");
        const emailInput = document.getElementById("empEmail");
        const roleSelect = document.getElementById("empRole");

        const name  = nameInput.value.trim();
        const email = emailInput.value.trim();
        const role  = roleSelect.value || "employee";

        if (!name) {
            alert("Skriv et navn på medarbejderen.");
            return;
        }

        employees.push({
            id: uuid(),
            name,
            email,
            role: role === "admin" ? t("role_admin") : t("role_employee")
        });

        nameInput.value = "";
        emailInput.value = "";
        roleSelect.value = "employee";

        saveAll();
        renderEmployeeTable();
        refreshEmployeeSelects();
        renderEmployeeChips();
    });
}

/* ======================================================
   AFSNIT 07 – CHIP-HJÆLPEFUNKTIONER
   ====================================================== */

function getSelectedIdsFromChipList(containerId) {
    const box = document.getElementById(containerId);
    if (!box) return [];
    return Array.from(box.querySelectorAll(".chip.selected")).map(chip => chip.dataset.id);
}

/* ======================================================
   AFSNIT 08 – QUICK TIMER (FORSIDE)
   ====================================================== */

function updateQuickTimerDisplay() {
    const display = document.getElementById("quickTimerDisplay");
    if (!display) return;

    display.classList.add("quick-timer-display");

    if (!quickTimer) {
        display.textContent = "00:00:00";
        return;
    }

    const start = new Date(quickTimer.start);
    const now = new Date();
    const diffSec = Math.max(0, Math.floor((now - start) / 1000));
    display.textContent = formatTimeFromSeconds(diffSec);
}

function stopQuickInterval() {
    if (quickIntervalId != null) {
        clearInterval(quickIntervalId);
        quickIntervalId = null;
    }
}

function initQuickTimer() {
    const startBtn = document.getElementById("quickStartBtn");
    const stopBtn  = document.getElementById("quickStopBtn");
    const modeDay  = document.getElementById("quickModeDay");
    const modeTot  = document.getElementById("quickModeTotal");

    if (!startBtn || !stopBtn) return;

    // Hvis der allerede ligger en quickTimer i storage
    if (quickTimer && quickTimer.start) {
        quickIntervalId = setInterval(updateQuickTimerDisplay, 1000);
        updateQuickTimerDisplay();
    }

    startBtn.addEventListener("click", () => {
        const customerSel = document.getElementById("quickCustomerSelect");
        const customerId  = customerSel ? customerSel.value : "";

        if (!customerId) {
            alert(t("msg_select_customer"));
            return;
        }

        const employeeIds = getSelectedIdsFromChipList("quickEmployeeList");
        if (!employeeIds.length) {
            alert(t("msg_select_employees"));
            return;
        }

        let mode = "day";
        if (modeDay && modeDay.checked) mode = "day";
        if (modeTot && modeTot.checked) mode = "total";

        quickTimer = {
            id: uuid(),
            customerId,
            employeeIds,
            mode,
            start: new Date().toISOString()
        };
        saveAll();

        stopQuickInterval();
        quickIntervalId = setInterval(updateQuickTimerDisplay, 1000);
        updateQuickTimerDisplay();
    });

    stopBtn.addEventListener("click", () => {
        if (!quickTimer) return;

        const start = new Date(quickTimer.start);
        const now   = new Date();
        const diffSec = Math.max(0, Math.floor((now - start) / 1000));
        const minutes = Math.max(1, Math.round(diffSec / 60));

        const dateStr = toDateString(start);

        quickTimer.employeeIds.forEach(empId => {
            logs.push({
                id: uuid(),
                date: dateStr,
                customerId: quickTimer.customerId,
                employeeId: empId,
                start: start.toISOString(),
                end: now.toISOString(),
                durationMinutes: minutes
            });
        });

        quickTimer = null;
        stopQuickInterval();
        updateQuickTimerDisplay();
        saveAll();
        renderTodayLogs();
        initReports();
    });
}

/* ======================================================
   AFSNIT 09 – DETALJERET TIMER & DAGENS LOGS
   ====================================================== */

function initDetailedTimer() {
    const startBtn = document.getElementById("startTimerBtn");
    const stopBtn  = document.getElementById("stopTimerBtn");
    const statusEl = document.getElementById("timerStatus");

    if (!startBtn || !stopBtn) return;

    if (activeTimer && statusEl) {
        const cName = getCustomerName(activeTimer.customerId);
        const eName = getEmployeeName(activeTimer.employeeId);
        statusEl.textContent = `${cName} / ${eName}`;
    } else if (statusEl) {
        statusEl.textContent = t("timer_no_active");
    }

    startBtn.addEventListener("click", () => {
        const custSel = document.getElementById("timerCustomerSelect");
        const empSel  = document.getElementById("timerEmployeeSelect");

        const customerId = custSel ? custSel.value : "";
        const employeeId = empSel  ? empSel.value  : "";

        if (!customerId || !employeeId) {
            alert(t("msg_select_customer_employee"));
            return;
        }

        activeTimer = {
            id: uuid(),
            customerId,
            employeeId,
            start: new Date().toISOString(),
            date: toDateString(new Date())
        };
        saveAll();

        if (statusEl) {
            statusEl.textContent = `${getCustomerName(customerId)} / ${getEmployeeName(employeeId)}`;
        }
    });

    stopBtn.addEventListener("click", () => {
        if (!activeTimer) {
            alert(t("timer_no_active"));
            return;
        }

        const now = new Date();
        const start = new Date(activeTimer.start);
        const diffSec = Math.max(0, Math.floor((now - start) / 1000));
        const minutes = Math.max(1, Math.round(diffSec / 60));

        logs.push({
            id: uuid(),
            date: activeTimer.date,
            customerId: activeTimer.customerId,
            employeeId: activeTimer.employeeId,
            start: start.toISOString(),
            end: now.toISOString(),
            durationMinutes: minutes
        });

        activeTimer = null;
        saveAll();
        renderTodayLogs();
        initReports();

        if (statusEl) {
            statusEl.textContent = t("timer_no_active");
        }
    });
}

function renderTodayLogs() {
    const table = document.getElementById("timeLogTable");
    if (!table) return;
    const tbody = table.querySelector("tbody");
    if (!tbody) return;

    tbody.innerHTML = "";

    const todayStr = toDateString(new Date());
    const todaysLogs = logs.filter(l => l.date === todayStr);

    todaysLogs.forEach(l => {
        const tr = document.createElement("tr");
        const start = new Date(l.start);
        const end   = new Date(l.end);

        tr.innerHTML = `
            <td>${start.toLocaleTimeString(getLocaleForLang(currentLang), { hour: "2-digit", minute: "2-digit" })}</td>
            <td>${end.toLocaleTimeString(getLocaleForLang(currentLang), { hour: "2-digit", minute: "2-digit" })}</td>
            <td>${l.durationMinutes}</td>
            <td>${getCustomerName(l.customerId)}</td>
            <td>${getEmployeeName(l.employeeId)}</td>
        `;
        tbody.appendChild(tr);
    });
}

/* ======================================================
   AFSNIT 10 – NULSTIL TID FOR KUNDE
   (selve logikken sidder i initCustomers)
   ====================================================== */
// Se initCustomers ovenfor – her er kun heading for strukturens skyld.

/* ======================================================
   AFSNIT 11 – PLANLÆGNING (VARIGHED I HALVE TIMER)
   ====================================================== */

function setupPlanDurationInput() {
    const durationInput = document.getElementById("planDuration");
    if (!durationInput) return;

    // Vi bruger stadig <input type="number">, men tolker det som timer i trin á 0,5
    durationInput.min = "0.5";
    durationInput.max = "8";
    durationInput.step = "0.5";
    durationInput.placeholder = "0,5 – 8";
}

function initPlanning() {
    setupPlanDurationInput();

    const saveBtn = document.getElementById("savePlanBtn");
    if (!saveBtn) return;

    saveBtn.addEventListener("click", () => {
        const dateInput     = document.getElementById("planDate");
        const startInput    = document.getElementById("planStart");
        const durationInput = document.getElementById("planDuration");
        const customerSel   = document.getElementById("planCustomerSelect");
        const noteInput     = document.getElementById("planNote");

        const dateStr    = dateInput.value;
        const startTime  = startInput.value;
        const durationHr = parseFloat(durationInput.value.replace(",", "."));
        const customerId = customerSel.value;
        const employeeIds = getSelectedIdsFromChipList("planEmployeeList");
        const note       = noteInput.value.trim();

        if (!dateStr) {
            alert(t("msg_select_date"));
            return;
        }
        if (!startTime) {
            alert(t("msg_select_start"));
            return;
        }
        if (!customerId) {
            alert(t("msg_select_customer_plan"));
            return;
        }
        if (isNaN(durationHr) || durationHr < 0.5 || durationHr > 8) {
            alert(t("msg_duration_invalid"));
            return;
        }

        const durationMinutes = Math.round(durationHr * 60);

        plans.push({
            id: uuid(),
            date: dateStr,
            startTime,
            durationMinutes,
            customerId,
            employeeIds,
            note
        });

        // ryd felter (dato lader vi stå, så man kan oprette flere på samme dag)
        // start & duration nulstilles
        startInput.value = "";
        durationInput.value = "";
        noteInput.value = "";
        const chips = document.querySelectorAll("#planEmployeeList .chip.selected");
        chips.forEach(chip => chip.classList.remove("selected"));

        saveAll();

        selectedCalendarDate = dateStr;
        renderCalendar();
        renderDayDetails(dateStr);
    });
}

/* ======================================================
   AFSNIT 12 – KALENDER
   ====================================================== */

function renderCalendar() {
    const cellsContainer = document.getElementById("calendarCells");
    const monthLabel     = document.getElementById("calMonthLabel");
    const dateInput      = document.getElementById("planDate");

    if (!cellsContainer || !monthLabel) return;

    cellsContainer.innerHTML = "";

    const year  = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();

    const locale = getLocaleForLang(currentLang);
    monthLabel.textContent = calendarMonth.toLocaleDateString(locale, {
        month: "long",
        year: "numeric"
    });

    const firstOfMonth = new Date(year, month, 1);
    const lastOfMonth  = new Date(year, month + 1, 0);
    const daysInMonth  = lastOfMonth.getDate();

    // mandag = 0
    const weekday = firstOfMonth.getDay(); // søndag=0, mandag=1...
    const mondayIndex = (weekday + 6) % 7;

    for (let i = 0; i < mondayIndex; i++) {
        const emptyCell = document.createElement("div");
        emptyCell.className = "calendar-cell";
        cellsContainer.appendChild(emptyCell);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        const dayPlans = plans.filter(p => p.date === dateStr);
        const count = dayPlans.length;

        const cell = document.createElement("button");
        cell.type = "button";
        cell.className = "calendar-cell";

        if (count === 0) {
            cell.classList.add("calendar-day-empty");
        } else if (count <= 4) {
            cell.classList.add("calendar-day-medium");
        } else {
            cell.classList.add("calendar-day-busy");
        }

        if (selectedCalendarDate === dateStr) {
            cell.classList.add("selected");
        }

        cell.textContent = day.toString();

        cell.addEventListener("click", () => {
            selectedCalendarDate = dateStr;
            if (dateInput) dateInput.value = dateStr;
            renderCalendar();
            renderDayDetails(dateStr);
        });

        cellsContainer.appendChild(cell);
    }
}

/* ======================================================
   AFSNIT 13 – DAGEN OPGAVER (DETAILLISTE)
   ====================================================== */

function renderDayDetails(dateStr) {
    const label = document.getElementById("selectedDayLabel");
    const list  = document.getElementById("dayPlanList");
    if (!label || !list) return;

    if (!dateStr) {
        label.textContent = t("schedule_selected_day");
        list.innerHTML = "";
        return;
    }

    const locale = getLocaleForLang(currentLang);
    const d = parseDateString(dateStr);
    label.textContent = d.toLocaleDateString(locale, {
        weekday: "short",
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
    });

    const dayPlans = plans.filter(p => p.date === dateStr);
    list.innerHTML = "";

    if (!dayPlans.length) {
        const li = document.createElement("li");
        li.textContent = t("msg_no_plans_for_day");
        list.appendChild(li);
        return;
    }

    dayPlans.forEach(p => {
        const li = document.createElement("li");
        const durHr = (p.durationMinutes || 0) / 60;
        const durText = durHr ? `${durHr.toString().replace(".", ",")} t` : "";
        const customerName = getCustomerName(p.customerId);
        const employeesNames = (p.employeeIds || []).map(getEmployeeName).filter(Boolean).join(", ");

        li.textContent = `${p.startTime || ""} – ${durText} – ${customerName}${
            employeesNames ? " (" + employeesNames + ")" : ""
        }${p.note ? " – " + p.note : ""}`;

        list.appendChild(li);
    });
}

/* ======================================================
   AFSNIT 14 – RAPPORTER
   ====================================================== */

function initReports() {
    refreshCustomerSelects();
    refreshEmployeeSelects();
    renderReportsTable([]);

    const runBtn = document.getElementById("runReportBtn");
    if (!runBtn) return;

    runBtn.addEventListener("click", () => {
        const fromInput = document.getElementById("reportDateFrom");
        const toInput   = document.getElementById("reportDateTo");
        const custSel   = document.getElementById("reportCustomerSelect");
        const empSel    = document.getElementById("reportEmployeeSelect");

        const fromStr = fromInput.value;
        const toStr   = toInput.value;
        const customerId = custSel.value;
        const employeeId = empSel.value;

        let result = logs.slice();

        if (fromStr) {
            result = result.filter(l => l.date >= fromStr);
        }
        if (toStr) {
            result = result.filter(l => l.date <= toStr);
        }
        if (customerId) {
            result = result.filter(l => l.customerId === customerId);
        }
        if (employeeId) {
            result = result.filter(l => l.employeeId === employeeId);
        }

        renderReportsTable(result);
    });
}

function renderReportsTable(rows) {
    const table = document.getElementById("reportTable");
    const summary = document.getElementById("reportSummary");
    if (!table) return;

    const tbody = table.querySelector("tbody");
    if (!tbody) return;
    tbody.innerHTML = "";

    rows.forEach(l => {
        const tr = document.createElement("tr");
        const start = new Date(l.start);
        const end   = new Date(l.end);

        tr.innerHTML = `
            <td>${l.date}</td>
            <td>${start.toLocaleTimeString(getLocaleForLang(currentLang), { hour: "2-digit", minute: "2-digit" })}</td>
            <td>${end.toLocaleTimeString(getLocaleForLang(currentLang), { hour: "2-digit", minute: "2-digit" })}</td>
            <td>${l.durationMinutes}</td>
            <td>${getCustomerName(l.customerId)}</td>
            <td>${getEmployeeName(l.employeeId)}</td>
        `;
        tbody.appendChild(tr);
    });

    if (summary) {
        summary.textContent = `${t("msg_report_summary_prefix")} ${rows.length} ${t("msg_report_summary_suffix")}`;
    }
}

/* ======================================================
   AFSNIT 15 – INITIALISERING
   ====================================================== */

window.addEventListener("load", () => {
    loadAll();

    initTheme();
    initThemeToggle();

    initLanguage();

    initNavigation();
    initSidebarToggle();

    renderCustomerTable();
    renderEmployeeTable();
    refreshCustomerSelects();
    refreshEmployeeSelects();
    renderEmployeeChips();

    initCustomers();
    initEmployees();

    initQuickTimer();
    initDetailedTimer();
    renderTodayLogs();

    initPlanning();
    renderCalendar();
    renderDayDetails(selectedCalendarDate);

    initReports();
});
