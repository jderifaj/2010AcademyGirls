document.addEventListener("DOMContentLoaded", () => {
    const stickyNav = document.querySelector("nav");
    const navContainer = document.querySelector(".nav-container");
    const menuToggle = document.getElementById("playerMenuToggle");
    const yearGroups = document.querySelectorAll(".year-group");
    const main = document.querySelector("main");
    const mobileQuery = window.matchMedia("(max-width: 1025px)");
    const hoverQuery = window.matchMedia("(hover: hover) and (pointer: fine)");

    // Sort each year group's jump links numerically, then mirror that order in player sections.
    const orderedSectionIds = [];

    yearGroups.forEach((group) => {
        const linkContainer = group.querySelector("div");
        if (!linkContainer) {
            return;
        }

        const links = Array.from(linkContainer.querySelectorAll(".jump-link"));
        links.sort((a, b) => Number(a.textContent.trim()) - Number(b.textContent.trim()));
        links.forEach((link) => {
            linkContainer.appendChild(link);
            const href = link.getAttribute("href");
            if (href && href.startsWith("#")) {
                orderedSectionIds.push(href.slice(1));
            }
        });
    });

    if (main) {
        const sectionById = new Map(
            Array.from(main.querySelectorAll(".player-section[id]")).map((section) => [section.id, section])
        );

        orderedSectionIds.forEach((id) => {
            const section = sectionById.get(id);
            if (section) {
                main.appendChild(section);
            }
        });
    }

    let introAnimationComplete = false;
    const tl = gsap.timeline({
        defaults: { ease: "sine.inOut" },
        onComplete: () => {
            introAnimationComplete = true;
        }
    });
    const path = document.querySelector("#outline");
    if (path) {
        const pathLength = path.getTotalLength();
        gsap.set(path, { strokeDasharray: pathLength, strokeDashoffset: pathLength });
        tl.to(path, { strokeDashoffset: 0, duration: 2.5, ease: "power2.inOut" });
    }

    if (!mobileQuery.matches) {
        tl.to(".jump-link", { backgroundColor: "var(--courage-red)", scale: 1.1, duration: 0.2, stagger: { each: 0.06, from: "end" } }, "-=1.0");
        tl.to(".jump-link", { backgroundColor: "var(--courage-navy)", scale: 1, duration: 0.6, stagger: 0.04 });
    }

    const links = document.querySelectorAll(".jump-link");
    const isMobileMenuMode = () => menuToggle && window.getComputedStyle(menuToggle).display !== "none";

    function clearFloatingNames() {
        document.querySelectorAll(".floating-name").forEach((node) => node.remove());
    }

    function applyResponsiveJumpLinkState() {
        if (mobileQuery.matches) {
            // Remove any inline animation styles from desktop to avoid color/scale bleed on mobile.
            gsap.set(links, { clearProps: "backgroundColor,scale,transform" });
            clearFloatingNames();
        } else {
            // Restore predictable desktop base styles after resizing back up.
            gsap.set(links, { clearProps: "backgroundColor,scale,transform" });
        }
    }

    applyResponsiveJumpLinkState();

    const onMediaChange = () => {
        applyResponsiveJumpLinkState();
    };

    mobileQuery.addEventListener("change", onMediaChange);
    hoverQuery.addEventListener("change", onMediaChange);

    if (menuToggle && navContainer) {
        menuToggle.addEventListener("click", () => {
            const isOpen = navContainer.classList.toggle("menu-open");
            menuToggle.setAttribute("aria-expanded", String(isOpen));
        });
    }

    function showFloatingName(link) {
        const name = link.getAttribute("data-name");
        if (!name) {
            return;
        }

        clearFloatingNames();

        const rect = link.getBoundingClientRect();
        const floater = document.createElement("div");
        floater.className = "floating-name";
        floater.innerText = name;
        document.body.appendChild(floater);

        const startY = rect.top + window.scrollY;
        const startX = rect.left + (rect.width / 2);

        gsap.set(floater, { left: startX, top: startY, xPercent: -50, opacity: 0, scale: 0.5 });

        const nameTl = gsap.timeline({
            onComplete: () => {
                floater.remove();
            }
        });

        nameTl.to(floater, { top: startY - 48, opacity: 1, scale: 1.08, duration: 1.0, ease: "power1.out" });
        nameTl.to(floater, { x: 9, duration: 0.16, ease: "sine.inOut", repeat: 1, yoyo: true }, "-=0.68");
        nameTl.to(floater, { opacity: 0, top: startY - 62, duration: 0.38, delay: 0.1, ease: "power1.in" });
    }

    links.forEach(link => {
        link.addEventListener("mouseenter", () => {
            if (mobileQuery.matches || !hoverQuery.matches || !introAnimationComplete) {
                return;
            }

            gsap.to(link, { scale: 1.07, duration: 0.18, ease: "power2.out", overwrite: true });
            showFloatingName(link);
        });

        link.addEventListener("mouseleave", () => {
            if (mobileQuery.matches || !hoverQuery.matches) {
                return;
            }

            gsap.to(link, { scale: 1, duration: 0.2, ease: "power2.out", overwrite: true });
        });

        link.addEventListener("click", function(e) {
            e.preventDefault();
            const targetId = this.getAttribute("href");
            const target = document.querySelector(targetId);
            if (!target) {
                return;
            }

            const scrollToTarget = () => {
                if (isMobileMenuMode()) {
                    const navHeight = stickyNav ? stickyNav.offsetHeight : 0;
                    const targetTop = target.getBoundingClientRect().top + window.scrollY;
                    const scrollTop = Math.max(targetTop - navHeight - 8, 0);
                    window.scrollTo({ top: scrollTop, behavior: "smooth" });
                } else {
                    target.scrollIntoView({ behavior: "smooth", block: "start" });
                }
            };

            if (isMobileMenuMode() && navContainer && menuToggle) {
                navContainer.classList.remove("menu-open");
                menuToggle.setAttribute("aria-expanded", "false");
                window.setTimeout(scrollToTarget, 220);
            } else {
                scrollToTarget();
            }
        });
    });
    const btt = document.getElementById("backToTop");

    if (!btt) {
        return;
    }

    // Back to Top Logic
    window.addEventListener("scroll", () => {
        if (window.scrollY > 500) {
            gsap.to(btt, { autoAlpha: 1, duration: 0.3 });
        } else {
            gsap.to(btt, { autoAlpha: 0, duration: 0.3 });
        }
    });

    btt.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
});
