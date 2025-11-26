// EARLY THEME LOADER – works with GitHub Pages (no inline scripts allowed)

(function () {
    try {
        var raw = localStorage.getItem("gtp_theme");
        var theme = "dark"; // default fallback

        if (raw) {
            try {
                var parsed = JSON.parse(raw);
                if (parsed === "light" || parsed === "dark") {
                    theme = parsed;
                }
            } catch (e) {
                if (raw === "light" || raw === "dark") {
                    theme = raw;
                }
            }
        }

        document.documentElement.setAttribute("data-theme", theme);
    } catch (e) {
        document.documentElement.setAttribute("data-theme", "dark");
    }
})();
