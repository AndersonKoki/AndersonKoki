(function() {
    var root = document.documentElement;
    var menu = document.querySelector(".nav-links");
    var menuToggle = document.querySelector(".menu-toggle");
    var themeToggle = document.getElementById("theme-toggle");
    var toTop = document.getElementById("to-top");
    var currentYear = document.getElementById("current-year");
    var navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav-links a"));
    var sections = navLinks
        .map(function(link) {
            return document.querySelector(link.getAttribute("href"));
        })
        .filter(Boolean);

    root.classList.remove("no-js");

    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }

    function setTheme(theme) {
        root.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);

        if (themeToggle) {
            themeToggle.innerHTML = theme === "dark"
                ? '<i class="fa fa-sun-o" aria-hidden="true"></i>'
                : '<i class="fa fa-moon-o" aria-hidden="true"></i>';
        }
    }

    var savedTheme = localStorage.getItem("theme");
    var prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    setTheme(savedTheme || (prefersDark ? "dark" : "light"));

    if (themeToggle) {
        themeToggle.addEventListener("click", function() {
            setTheme(root.getAttribute("data-theme") === "dark" ? "light" : "dark");
        });
    }

    if (menuToggle && menu) {
        menuToggle.addEventListener("click", function() {
            var isOpen = menu.classList.toggle("open");
            document.body.classList.toggle("menu-open", isOpen);
            menuToggle.setAttribute("aria-expanded", String(isOpen));
            menuToggle.innerHTML = isOpen
                ? '<i class="fa fa-times" aria-hidden="true"></i>'
                : '<i class="fa fa-bars" aria-hidden="true"></i>';
        });
    }

    navLinks.forEach(function(link) {
        link.addEventListener("click", function() {
            if (menu && menu.classList.contains("open")) {
                menu.classList.remove("open");
                document.body.classList.remove("menu-open");
                menuToggle.setAttribute("aria-expanded", "false");
                menuToggle.innerHTML = '<i class="fa fa-bars" aria-hidden="true"></i>';
            }
        });
    });

    if (toTop) {
        toTop.addEventListener("click", function() {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    if ("IntersectionObserver" in window) {
        var revealObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });

        document.querySelectorAll(".reveal").forEach(function(element) {
            revealObserver.observe(element);
        });

        var navObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (!entry.isIntersecting) return;

                navLinks.forEach(function(link) {
                    link.classList.toggle("active", link.getAttribute("href") === "#" + entry.target.id);
                });
            });
        }, {
            rootMargin: "-35% 0px -55% 0px",
            threshold: 0
        });

        sections.forEach(function(section) {
            navObserver.observe(section);
        });
    } else {
        document.querySelectorAll(".reveal").forEach(function(element) {
            element.classList.add("is-visible");
        });
    }
})();
