/(function() {
    try {
        const savedTheme = localStorage.getItem("gtp_theme");
        const themeToUse = savedTheme === "light" ? "light" : "dark";
        document.documentElement.setAttribute("data-theme", themeToUse);
    } catch(e) {
        document.documentElement.setAttribute("data-theme", "dark");
    }
})();
