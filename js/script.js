"use strict";

/* =================================================================
   MARCELL JUNIAR WIJAYA - PERSONAL PORTFOLIO
   -----------------------------------------------------------------
   File    : script.js
   Purpose : Main website interaction and animation
   ================================================================= */


/* =================================================================
   1. WAIT UNTIL HTML IS READY
   =================================================================
   
   Walaupun script.js sudah menggunakan "defer" di index.html,
   DOMContentLoaded tetap kita gunakan agar semua element HTML sudah
   siap sebelum JavaScript mencoba mengaksesnya.
   ================================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =============================================================
       2. GLOBAL ELEMENT REFERENCES
       ============================================================= */

    const html = document.documentElement;
    const body = document.body;

    const header = document.getElementById("site-header");

    const navMenu = document.getElementById("nav-menu");
    const navLinks = [...document.querySelectorAll(".nav-link")];

    const mobileMenuToggle =
        document.getElementById("mobile-menu-toggle");

    const themeToggle =
        document.getElementById("theme-toggle");

    const themeIcon =
        themeToggle?.querySelector(".theme-icon");

    const backToTop =
        document.getElementById("back-to-top");

    const currentYear =
        document.getElementById("current-year");


    /* =============================================================
       3. USER MOTION PREFERENCE
       =============================================================
       
       Beberapa user mengaktifkan:
       
       "Reduce Motion"
       
       pada Windows / macOS / Android / iOS.
       
       Website profesional sebaiknya menghormati setting tersebut.
       ============================================================= */

    const reduceMotionQuery =
        window.matchMedia("(prefers-reduced-motion: reduce)");

    const prefersReducedMotion =
        () => reduceMotionQuery.matches;


    /* =============================================================
       4. CURRENT YEAR
       =============================================================
       
       Footer tidak perlu di-update manual setiap tahun.
       ============================================================= */

    if (currentYear) {
        currentYear.textContent =
            new Date().getFullYear();
    }


    /* =================================================================
       5. DARK / LIGHT MODE
       ================================================================= */

    const THEME_STORAGE_KEY =
        "marcell-portfolio-theme";

    const systemDarkMode =
        window.matchMedia("(prefers-color-scheme: dark)");


    /* -------------------------------------------------------------
       Safe localStorage reader
       ------------------------------------------------------------- */

    function getSavedTheme() {

        try {
            return localStorage.getItem(
                THEME_STORAGE_KEY
            );
        }

        catch (error) {
            return null;
        }
    }


    /* -------------------------------------------------------------
       Safe localStorage writer
       ------------------------------------------------------------- */

    function saveTheme(theme) {

        try {

            localStorage.setItem(
                THEME_STORAGE_KEY,
                theme
            );

        }

        catch (error) {

            /*
               Kalau browser memblokir localStorage,
               website tetap bekerja.
            */

        }
    }


    /* -------------------------------------------------------------
       Update icon + accessibility text
       ------------------------------------------------------------- */

    function updateThemeButton(theme) {

        if (!themeToggle || !themeIcon) {
            return;
        }


        if (theme === "dark") {

            /* Sun = click to return to light mode. */
            themeIcon.textContent = "☀";

            themeToggle.setAttribute(
                "aria-label",
                "Switch to light mode"
            );

        }

        else {

            /* Moon = click to enter dark mode. */
            themeIcon.textContent = "☾";

            themeToggle.setAttribute(
                "aria-label",
                "Switch to dark mode"
            );

        }

    }


    /* -------------------------------------------------------------
       Apply theme
       ------------------------------------------------------------- */

    function applyTheme(
        theme,
        persist = false
    ) {

        const validTheme =
            theme === "dark"
                ? "dark"
                : "light";


        html.setAttribute(
            "data-theme",
            validTheme
        );


        updateThemeButton(
            validTheme
        );


        if (persist) {

            saveTheme(
                validTheme
            );

        }

    }


    /* -------------------------------------------------------------
       Determine initial theme
       ------------------------------------------------------------- */

    const savedTheme =
        getSavedTheme();


    if (
        savedTheme === "dark" ||
        savedTheme === "light"
    ) {

        applyTheme(
            savedTheme
        );

    }

    else {

        applyTheme(
            systemDarkMode.matches
                ? "dark"
                : "light"
        );

    }


    /* -------------------------------------------------------------
       Theme button click
       ------------------------------------------------------------- */

    themeToggle?.addEventListener(
        "click",
        () => {

            const currentTheme =
                html.getAttribute(
                    "data-theme"
                );


            const nextTheme =
                currentTheme === "dark"
                    ? "light"
                    : "dark";


            applyTheme(
                nextTheme,
                true
            );

        }
    );


    /* -------------------------------------------------------------
       Follow OS theme automatically,
       BUT only if user has never manually chosen a theme.
       ------------------------------------------------------------- */

    systemDarkMode.addEventListener(
        "change",
        event => {

            if (getSavedTheme()) {
                return;
            }


            applyTheme(
                event.matches
                    ? "dark"
                    : "light"
            );

        }
    );


    /* =================================================================
       6. MOBILE NAVIGATION
       ================================================================= */

    function setMobileMenuState(isOpen) {

        if (
            !navMenu ||
            !mobileMenuToggle
        ) {
            return;
        }


        navMenu.classList.toggle(
            "open",
            isOpen
        );


        mobileMenuToggle.setAttribute(
            "aria-expanded",
            String(isOpen)
        );


        mobileMenuToggle.setAttribute(
            "aria-label",
            isOpen
                ? "Close navigation menu"
                : "Open navigation menu"
        );


        /*
           Animate hamburger:
           
           ☰
           ↓
           X
        */

        const lines =
            mobileMenuToggle.querySelectorAll(
                "span"
            );


        if (lines.length === 3) {

            if (isOpen) {

                lines[0].style.transform =
                    "translateY(6px) rotate(45deg)";

                lines[1].style.opacity =
                    "0";

                lines[2].style.transform =
                    "translateY(-6px) rotate(-45deg)";

            }

            else {

                lines[0].style.transform = "";
                lines[1].style.opacity = "";
                lines[2].style.transform = "";

            }

        }

    }


    function openMobileMenu() {

        setMobileMenuState(
            true
        );

    }


    function closeMobileMenu() {

        setMobileMenuState(
            false
        );

    }


    function toggleMobileMenu() {

        const isCurrentlyOpen =
            navMenu?.classList.contains(
                "open"
            );


        setMobileMenuState(
            !isCurrentlyOpen
        );

    }


    /* -------------------------------------------------------------
       Hamburger click
       ------------------------------------------------------------- */

    mobileMenuToggle?.addEventListener(
        "click",
        event => {

            event.stopPropagation();

            toggleMobileMenu();

        }
    );


    /* -------------------------------------------------------------
       Clicking outside menu closes it
       ------------------------------------------------------------- */

    document.addEventListener(
        "click",
        event => {

            if (
                !navMenu ||
                !mobileMenuToggle ||
                !navMenu.classList.contains("open")
            ) {
                return;
            }


            const clickedInsideMenu =
                navMenu.contains(
                    event.target
                );


            const clickedToggle =
                mobileMenuToggle.contains(
                    event.target
                );


            if (
                !clickedInsideMenu &&
                !clickedToggle
            ) {

                closeMobileMenu();

            }

        }
    );


    /* -------------------------------------------------------------
       ESC closes mobile menu
       ------------------------------------------------------------- */

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape" &&
                navMenu?.classList.contains("open")
            ) {

                closeMobileMenu();

                mobileMenuToggle?.focus();

            }

        }
    );


    /* -------------------------------------------------------------
       If screen becomes desktop-sized again,
       remove mobile menu state automatically.
       ------------------------------------------------------------- */

    const desktopBreakpoint =
        window.matchMedia(
            "(min-width: 921px)"
        );


    desktopBreakpoint.addEventListener(
        "change",
        event => {

            if (event.matches) {

                closeMobileMenu();

            }

        }
    );


    /* =================================================================
       7. SMOOTH NAVIGATION
       =================================================================
       
       Semua link:
       
       href="#about"
       href="#projects"
       ...
       
       akan melakukan smooth scroll tanpa reload halaman.
       ================================================================= */

    const internalLinks =
        [
            ...document.querySelectorAll(
                'a[href^="#"]'
            )
        ];


    internalLinks.forEach(link => {

        const href =
            link.getAttribute(
                "href"
            );


        if (
            !href ||
            href === "#"
        ) {
            return;
        }


        link.addEventListener(
            "click",
            event => {

                const target =
                    document.querySelector(
                        href
                    );


                if (!target) {
                    return;
                }


                event.preventDefault();


                /* Mobile navbar closes after selection. */
                closeMobileMenu();


                /* Start smooth scrolling. */
                target.scrollIntoView({

                    behavior:
                        prefersReducedMotion()
                            ? "auto"
                            : "smooth",

                    block: "start"

                });


                /*
                   Update browser URL hash without reloading.
                */

                if (
                    history.pushState
                ) {

                    history.pushState(
                        null,
                        "",
                        href
                    );

                }

                else {

                    window.location.hash =
                        href;

                }


                /*
                   Immediately indicate the selected menu item.
                   
                   Scroll spy will later verify it based on
                   actual scroll position.
                */

                const id =
                    href.substring(1);


                setActiveNavLink(
                    id
                );

            }
        );

    });


    /* =================================================================
       8. NAVIGATION ACTIVE STATE / SCROLL SPY
       ================================================================= */


    const sections =
        navLinks
            .map(link => {

                const href =
                    link.getAttribute(
                        "href"
                    );


                if (!href) {
                    return null;
                }


                return document.querySelector(
                    href
                );

            })
            .filter(Boolean);


    function setActiveNavLink(sectionId) {

        navLinks.forEach(link => {

            const target =
                link.getAttribute(
                    "href"
                );


            link.classList.toggle(
                "active",
                target ===
                    `#${sectionId}`
            );

        });

    }


    /* -------------------------------------------------------------
       Determine which section currently occupies the main viewport.
       ------------------------------------------------------------- */

    function getCurrentSection() {

        if (
            sections.length === 0
        ) {
            return null;
        }


        /*
           If user reaches very bottom,
           Contact should definitely become active.
        */

        const nearBottom =
            window.innerHeight +
            window.scrollY
            >=
            document.documentElement.scrollHeight -
            5;


        if (nearBottom) {

            return (
                document.getElementById(
                    "contact"
                ) ||
                sections[
                    sections.length - 1
                ]
            );

        }


        const headerHeight =
            header?.offsetHeight || 0;


        /*
           Virtual marker inside viewport.

           Instead of using exact top edge,
           we check a position about 35% down the screen.

           This makes active navigation feel much more natural.
        */

        const markerPosition =
            window.scrollY +
            headerHeight +
            window.innerHeight * 0.35;


        let currentSection =
            sections[0];


        sections.forEach(section => {

            if (
                section.offsetTop <=
                markerPosition
            ) {

                currentSection =
                    section;

            }

        });


        return currentSection;
    }


    /* =================================================================
       9. HEADER SCROLL EFFECT + BACK TO TOP + SCROLL SPY
       =================================================================
       
       requestAnimationFrame prevents running expensive code
       dozens/hundreds of times per second unnecessarily.
       ================================================================= */

    let scrollTicking = false;


    function updateScrollInterface() {

        const scrollY =
            window.scrollY;


        /* ------------------------------------------
           Navbar shadow
           ------------------------------------------ */

        header?.classList.toggle(
            "scrolled",
            scrollY > 15
        );


        /* ------------------------------------------
           Back-to-top visibility
           ------------------------------------------ */

        const showBackToTop =
            scrollY >
            Math.max(
                500,
                window.innerHeight * 0.6
            );


        backToTop?.classList.toggle(
            "show",
            showBackToTop
        );


        /* ------------------------------------------
           Active navigation
           ------------------------------------------ */

        const currentSection =
            getCurrentSection();


        if (currentSection) {

            setActiveNavLink(
                currentSection.id
            );

        }


        scrollTicking = false;
    }


    function requestScrollUpdate() {

        if (scrollTicking) {
            return;
        }


        scrollTicking = true;


        requestAnimationFrame(
            updateScrollInterface
        );

    }


    window.addEventListener(
        "scroll",
        requestScrollUpdate,
        {
            passive: true
        }
    );


    window.addEventListener(
        "resize",
        requestScrollUpdate
    );


    /* Run once during startup. */

    updateScrollInterface();


    /* =================================================================
       10. HERO ENTRANCE ANIMATION
       ================================================================= */

    function animateHero() {

        if (
            prefersReducedMotion()
        ) {
            return;
        }


        const heroElements = [

            {
                selector: ".hero-badge",
                delay: 50,
                x: 0,
                y: 18
            },

            {
                selector: ".hero-title",
                delay: 120,
                x: 0,
                y: 22
            },

            {
                selector: ".hero-subtitle",
                delay: 190,
                x: 0,
                y: 20
            },

            {
                selector: ".hero-description",
                delay: 260,
                x: 0,
                y: 18
            },

            {
                selector: ".hero-actions",
                delay: 330,
                x: 0,
                y: 16
            },

            {
                selector: ".hero-socials",
                delay: 390,
                x: 0,
                y: 14
            },

            {
                selector: ".hero-location",
                delay: 440,
                x: 0,
                y: 12
            },

            {
                selector: ".profile-card",
                delay: 180,
                x: 28,
                y: 0,
                preserveRotation: true
            },

            {
                selector: ".availability-card",
                delay: 430,
                x: 0,
                y: -16
            }

        ];


        heroElements.forEach(item => {

            const element =
                document.querySelector(
                    item.selector
                );


            if (!element) {
                return;
            }


            let startTransform =
                `translate(${item.x}px, ${item.y}px)`;


            let endTransform =
                "translate(0, 0)";


            /*
               Profile card already has rotate(1deg) from CSS,
               so preserve it.
            */

            if (
                item.preserveRotation
            ) {

                startTransform +=
                    " scale(0.96) rotate(1deg)";

                endTransform =
                    "translate(0, 0) scale(1) rotate(1deg)";

            }


            element.animate(

                [
                    {
                        opacity: 0,
                        transform:
                            startTransform
                    },

                    {
                        opacity: 1,
                        transform:
                            endTransform
                    }
                ],

                {
                    duration: 700,
                    delay: item.delay,

                    easing:
                        "cubic-bezier(0.22, 1, 0.36, 1)",

                    fill: "both"
                }

            );

        });

    }


    /*
       Give browser a moment to finish first layout
       before playing the hero animation.
    */

    requestAnimationFrame(
        animateHero
    );


    /* =================================================================
       11. SCROLL REVEAL ANIMATIONS
       ================================================================= */


    const revealElements = [];


    /* -------------------------------------------------------------
       Main section headings
       ------------------------------------------------------------- */

    document
        .querySelectorAll(
            ".section-heading"
        )
        .forEach(element => {

            revealElements.push({
                element,
                delay: 0
            });

        });


    /* -------------------------------------------------------------
       About description
       ------------------------------------------------------------- */

    document
        .querySelectorAll(
            ".about-content"
        )
        .forEach(element => {

            revealElements.push({
                element,
                delay: 80
            });

        });


    /* -------------------------------------------------------------
       About information cards
       ------------------------------------------------------------- */

    document
        .querySelectorAll(
            ".info-card"
        )
        .forEach(
            (element, index) => {

                revealElements.push({

                    element,

                    delay:
                        index * 80

                });

            }
        );


    /* -------------------------------------------------------------
       Skill cards
       ------------------------------------------------------------- */

    document
        .querySelectorAll(
            ".skill-card"
        )
        .forEach(
            (element, index) => {

                revealElements.push({

                    element,

                    delay:
                        (index % 5) * 60

                });

            }
        );


    /* -------------------------------------------------------------
       Project cards
       ------------------------------------------------------------- */

    document
        .querySelectorAll(
            ".project-card"
        )
        .forEach(
            (element, index) => {

                revealElements.push({

                    element,

                    delay:
                        index * 110

                });

            }
        );


    /* -------------------------------------------------------------
       Education cards
       ------------------------------------------------------------- */

    document
        .querySelectorAll(
            ".education-card"
        )
        .forEach(
            (element, index) => {

                revealElements.push({

                    element,

                    delay:
                        index * 120

                });

            }
        );


    /* -------------------------------------------------------------
       Contact
       ------------------------------------------------------------- */

    document
        .querySelectorAll(
            ".contact-card"
        )
        .forEach(element => {

            revealElements.push({
                element,
                delay: 0
            });

        });


    function revealElement(
        element,
        delay
    ) {

        const animation =
            element.animate(

                [
                    {
                        opacity: 0,
                        transform:
                            "translateY(28px)"
                    },

                    {
                        opacity: 1,
                        transform:
                            "translateY(0)"
                    }
                ],

                {
                    duration: 650,
                    delay,

                    easing:
                        "cubic-bezier(0.22, 1, 0.36, 1)",

                    fill: "both"
                }

            );


        animation.addEventListener(
            "finish",
            () => {

                /*
                   Clear animation styles afterward so
                   CSS hover transformations remain completely free.
                */

                element.style.opacity = "";
                element.style.transform = "";
                element.style.willChange = "";

            },
            {
                once: true
            }
        );

    }


    if (
        !prefersReducedMotion() &&
        "IntersectionObserver" in window
    ) {

        const revealObserver =
            new IntersectionObserver(

                entries => {

                    entries.forEach(
                        entry => {

                            if (
                                !entry.isIntersecting
                            ) {
                                return;
                            }


                            const data =
                                revealElements.find(
                                    item =>
                                        item.element ===
                                        entry.target
                                );


                            revealElement(

                                entry.target,

                                data?.delay || 0

                            );


                            revealObserver.unobserve(
                                entry.target
                            );

                        }
                    );

                },

                {
                    threshold: 0.12,

                    rootMargin:
                        "0px 0px -7% 0px"
                }

            );


        revealElements.forEach(
            item => {

                item.element.style.opacity =
                    "0";

                item.element.style.willChange =
                    "transform, opacity";


                revealObserver.observe(
                    item.element
                );

            }
        );

    }


    /* =================================================================
       12. PAGE SCROLL LOCK
       =================================================================
       
       Digunakan ketika modal / lightbox terbuka.
       
       Prevent website background from scrolling.
       ================================================================= */

    let scrollLockCount = 0;
    let previousBodyOverflow = "";


    function lockPageScroll() {

        if (
            scrollLockCount === 0
        ) {

            previousBodyOverflow =
                body.style.overflow;

            body.style.overflow =
                "hidden";

        }


        scrollLockCount++;

    }


    function unlockPageScroll() {

        scrollLockCount =
            Math.max(
                0,
                scrollLockCount - 1
            );


        if (
            scrollLockCount === 0
        ) {

            body.style.overflow =
                previousBodyOverflow;

        }

    }


    /* =================================================================
       13. PROJECT DETAIL MODALS
       ================================================================= */


    const projectButtons =
        [
            ...document.querySelectorAll(
                ".project-details-button"
            )
        ];


    const projectModalMap = {

        flowlist:
            document.getElementById(
                "flowlist-modal"
            ),

        compass:
            document.getElementById(
                "compass-modal"
            ),

        bakery:
            document.getElementById(
                "bakery-modal"
            )

    };


    let lastProjectTrigger =
        null;


    /* -------------------------------------------------------------
       Open project modal
       ------------------------------------------------------------- */

    function openProjectModal(
        projectName,
        trigger
    ) {

        const modal =
            projectModalMap[
                projectName
            ];


        if (
            !modal ||
            modal.open
        ) {
            return;
        }


        lastProjectTrigger =
            trigger;


        /*
           Native HTML dialog.
        */

        modal.showModal();


        lockPageScroll();

    }


    /* -------------------------------------------------------------
       Close project modal
       ------------------------------------------------------------- */

    function closeProjectModal(
        modal
    ) {

        if (
            modal?.open
        ) {

            modal.close();

        }

    }


    /* -------------------------------------------------------------
       Project button clicks
       ------------------------------------------------------------- */

    projectButtons.forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    const projectName =
                        button.dataset.project;


                    openProjectModal(
                        projectName,
                        button
                    );

                }
            );

        }
    );


    /* -------------------------------------------------------------
       Configure each project modal
       ------------------------------------------------------------- */

    Object
        .values(projectModalMap)
        .filter(Boolean)
        .forEach(modal => {

            const closeButton =
                modal.querySelector(
                    ".modal-close"
                );


            /* X button. */

            closeButton?.addEventListener(
                "click",
                () => {

                    closeProjectModal(
                        modal
                    );

                }
            );


            /*
               Clicking backdrop closes modal.

               event.target === modal means user clicked
               outside modal content itself.
            */

            modal.addEventListener(
                "click",
                event => {

                    if (
                        event.target === modal
                    ) {

                        closeProjectModal(
                            modal
                        );

                    }

                }
            );


            /*
               Native ESC automatically closes <dialog>.
               
               "close" event handles cleanup.
            */

            modal.addEventListener(
                "close",
                () => {

                    unlockPageScroll();


                    /*
                       Return keyboard focus to the button
                       that originally opened modal.
                    */

                    lastProjectTrigger?.focus();

                }
            );

        });


    /* =================================================================
       14. SCREENSHOT LIGHTBOX
       =================================================================
       
       Flow:
       
       View Details
            ↓
       Project Modal
            ↓
       Click screenshot
            ↓
       Full-size Lightbox
       ================================================================= */


    /* -------------------------------------------------------------
       Create lightbox dynamically.
       
       No additional HTML file is needed.
       ------------------------------------------------------------- */

    const lightbox =
        document.createElement(
            "dialog"
        );


    lightbox.className =
        "image-lightbox";


    lightbox.setAttribute(
        "aria-label",
        "Project screenshot preview"
    );


    lightbox.innerHTML = `

        <div class="lightbox-shell">

            <button
                type="button"
                class="lightbox-close"
                aria-label="Close image preview"
            >
                ×
            </button>

            <button
                type="button"
                class="lightbox-navigation lightbox-previous"
                aria-label="Previous screenshot"
            >
                ‹
            </button>

            <figure class="lightbox-figure">

                <img
                    class="lightbox-image"
                    src=""
                    alt=""
                >

                <figcaption
                    class="lightbox-caption"
                ></figcaption>

            </figure>

            <button
                type="button"
                class="lightbox-navigation lightbox-next"
                aria-label="Next screenshot"
            >
                ›
            </button>

        </div>

    `;


    body.appendChild(
        lightbox
    );


    /* =================================================================
       15. LIGHTBOX STYLING
       =================================================================
       
       Lightbox did not exist in the original HTML,
       so its small isolated stylesheet is created here.
       
       Main website styling still stays inside style.css.
       ================================================================= */

    const lightboxStyle =
        document.createElement(
            "style"
        );


    lightboxStyle.textContent = `

        .image-lightbox {
            width: min(96vw, 1280px);
            max-width: 1280px;
            height: auto;
            max-height: 94svh;
            padding: 0;
            border: none;
            overflow: visible;
            color: var(--text-primary);
            background: transparent;
        }

        .image-lightbox::backdrop {
            background: rgba(2, 6, 23, 0.84);
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
        }

        .lightbox-shell {
            position: relative;
            width: 100%;
            max-height: 92svh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 24px 70px 22px;
            background: var(--card-background);
            border: 1px solid var(--border-color);
            border-radius: 22px;
            box-shadow: 0 30px 100px rgba(0, 0, 0, 0.4);
        }

        .lightbox-figure {
            width: 100%;
            margin: 0;
            text-align: center;
        }

        .lightbox-image {
            width: 100%;
            max-height: 78svh;
            object-fit: contain;
            margin-inline: auto;
            border-radius: 14px;
            background: var(--background-secondary);
        }

        .lightbox-caption {
            margin-top: 12px;
            color: var(--text-secondary);
            font-size: 0.82rem;
        }

        .lightbox-close,
        .lightbox-navigation {
            position: absolute;
            z-index: 2;
            display: grid;
            place-items: center;
            border: 1px solid var(--border-color);
            color: var(--text-primary);
            background: var(--card-background);
            box-shadow: var(--shadow-md);
            cursor: pointer;
        }

        .lightbox-close {
            top: 14px;
            right: 14px;
            width: 42px;
            height: 42px;
            border-radius: 12px;
            font-size: 1.5rem;
        }

        .lightbox-navigation {
            top: 50%;
            width: 46px;
            height: 56px;
            transform: translateY(-50%);
            border-radius: 14px;
            font-size: 2rem;
        }

        .lightbox-previous {
            left: 12px;
        }

        .lightbox-next {
            right: 12px;
        }

        .lightbox-close:hover,
        .lightbox-navigation:hover {
            color: var(--primary);
            border-color: var(--primary);
        }

        .project-gallery img {
            cursor: zoom-in;
        }

        @media (max-width: 600px) {

            .lightbox-shell {
                padding: 58px 12px 16px;
            }

            .lightbox-image {
                max-height: 68svh;
            }

            .lightbox-navigation {
                top: auto;
                bottom: 10px;
                transform: none;
                width: 44px;
                height: 44px;
            }

            .lightbox-previous {
                left: calc(50% - 52px);
            }

            .lightbox-next {
                right: calc(50% - 52px);
            }

            .lightbox-caption {
                padding-bottom: 50px;
            }

        }

    `;


    document.head.appendChild(
        lightboxStyle
    );


    /* =================================================================
       16. LIGHTBOX REFERENCES
       ================================================================= */

    const lightboxImage =
        lightbox.querySelector(
            ".lightbox-image"
        );

    const lightboxCaption =
        lightbox.querySelector(
            ".lightbox-caption"
        );

    const lightboxClose =
        lightbox.querySelector(
            ".lightbox-close"
        );

    const lightboxPrevious =
        lightbox.querySelector(
            ".lightbox-previous"
        );

    const lightboxNext =
        lightbox.querySelector(
            ".lightbox-next"
        );


    let currentGalleryImages = [];
    let currentImageIndex = 0;
    let lastLightboxTrigger = null;


    /* =================================================================
       17. LIGHTBOX IMAGE RENDERER
       ================================================================= */

    function renderLightboxImage() {

        if (
            currentGalleryImages.length === 0
        ) {
            return;
        }


        const image =
            currentGalleryImages[
                currentImageIndex
            ];


        lightboxImage.src =
            image.currentSrc ||
            image.src;


        lightboxImage.alt =
            image.alt || "Project screenshot";


        lightboxCaption.textContent =
            image.alt ||
            `Screenshot ${
                currentImageIndex + 1
            }`;


        /*
           Hide navigation arrows if project
           only has one image.
        */

        const multipleImages =
            currentGalleryImages.length > 1;


        lightboxPrevious.hidden =
            !multipleImages;

        lightboxNext.hidden =
            !multipleImages;

    }


    /* =================================================================
       18. OPEN LIGHTBOX
       ================================================================= */

    function openLightbox(
        image
    ) {

        const gallery =
            image.closest(
                ".project-gallery"
            );


        if (!gallery) {
            return;
        }


        currentGalleryImages =
            [
                ...gallery.querySelectorAll(
                    "img"
                )
            ];


        currentImageIndex =
            currentGalleryImages.indexOf(
                image
            );


        if (
            currentImageIndex < 0
        ) {

            currentImageIndex = 0;

        }


        lastLightboxTrigger =
            image;


        renderLightboxImage();


        lightbox.showModal();


        lockPageScroll();


        lightboxClose?.focus();

    }


    /* =================================================================
       19. CLOSE LIGHTBOX
       ================================================================= */

    function closeLightbox() {

        if (
            lightbox.open
        ) {

            lightbox.close();

        }

    }


    /* =================================================================
       20. PREVIOUS / NEXT SCREENSHOT
       ================================================================= */

    function showPreviousImage() {

        if (
            currentGalleryImages.length <= 1
        ) {
            return;
        }


        currentImageIndex =
            (
                currentImageIndex -
                1 +
                currentGalleryImages.length
            )
            %
            currentGalleryImages.length;


        renderLightboxImage();

    }


    function showNextImage() {

        if (
            currentGalleryImages.length <= 1
        ) {
            return;
        }


        currentImageIndex =
            (
                currentImageIndex +
                1
            )
            %
            currentGalleryImages.length;


        renderLightboxImage();

    }


    /* =================================================================
       21. MAKE PROJECT SCREENSHOTS INTERACTIVE
       ================================================================= */

    const galleryImages =
        [
            ...document.querySelectorAll(
                ".project-gallery img"
            )
        ];


    galleryImages.forEach(image => {

        /*
           Makes screenshot keyboard-accessible.
        */

        image.setAttribute(
            "tabindex",
            "0"
        );


        image.setAttribute(
            "role",
            "button"
        );


        image.setAttribute(
            "aria-label",
            `Open larger preview: ${
                image.alt ||
                "project screenshot"
            }`
        );


        image.addEventListener(
            "click",
            () => {

                openLightbox(
                    image
                );

            }
        );


        /*
           Keyboard accessibility:
           
           Enter / Space = open image.
        */

        image.addEventListener(
            "keydown",
            event => {

                if (
                    event.key === "Enter" ||
                    event.key === " "
                ) {

                    event.preventDefault();

                    openLightbox(
                        image
                    );

                }

            }
        );

    });


    /* =================================================================
       22. LIGHTBOX CONTROLS
       ================================================================= */

    lightboxClose?.addEventListener(
        "click",
        closeLightbox
    );


    lightboxPrevious?.addEventListener(
        "click",
        showPreviousImage
    );


    lightboxNext?.addEventListener(
        "click",
        showNextImage
    );


    /* Backdrop click closes lightbox. */

    lightbox.addEventListener(
        "click",
        event => {

            if (
                event.target === lightbox
            ) {

                closeLightbox();

            }

        }
    );


    /* Keyboard arrow navigation. */

    lightbox.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "ArrowLeft"
            ) {

                event.preventDefault();

                showPreviousImage();

            }


            if (
                event.key === "ArrowRight"
            ) {

                event.preventDefault();

                showNextImage();

            }

        }
    );


    /* Cleanup after lightbox closes. */

    lightbox.addEventListener(
        "close",
        () => {

            unlockPageScroll();


            lastLightboxTrigger?.focus();

        }
    );


    /* =================================================================
       23. OPTIONAL SWIPE SUPPORT FOR MOBILE LIGHTBOX
       =================================================================
       
       Swipe left  -> next screenshot
       Swipe right -> previous screenshot
       ================================================================= */

    let touchStartX = 0;
    let touchEndX = 0;


    lightbox.addEventListener(
        "touchstart",
        event => {

            touchStartX =
                event.changedTouches[
                    0
                ].screenX;

        },
        {
            passive: true
        }
    );


    lightbox.addEventListener(
        "touchend",
        event => {

            touchEndX =
                event.changedTouches[
                    0
                ].screenX;


            const difference =
                touchStartX -
                touchEndX;


            /*
               Minimum ~50px movement required
               so accidental touches don't change images.
            */

            if (
                Math.abs(difference) <
                50
            ) {
                return;
            }


            if (
                difference > 0
            ) {

                /* Swipe left. */
                showNextImage();

            }

            else {

                /* Swipe right. */
                showPreviousImage();

            }

        },
        {
            passive: true
        }
    );


    /* =================================================================
       24. BROWSER BACK / FORWARD HASH SUPPORT
       ================================================================= */

    window.addEventListener(
        "popstate",
        () => {

            const hash =
                window.location.hash ||
                "#home";


            const target =
                document.querySelector(
                    hash
                );


            if (!target) {
                return;
            }


            target.scrollIntoView({

                behavior:
                    prefersReducedMotion()
                        ? "auto"
                        : "smooth",

                block: "start"

            });


            setActiveNavLink(
                hash.substring(1)
            );

        }
    );


    /* =================================================================
       25. INITIAL HASH SUPPORT
       =================================================================
       
       Example:
       
       someone opens:
       
       marwij505.github.io/#projects
       
       Website starts directly at Projects.
       ================================================================= */

    if (
        window.location.hash
    ) {

        const initialTarget =
            document.querySelector(
                window.location.hash
            );


        if (initialTarget) {

            /*
               Small delay lets fixed navbar dimensions
               finish rendering first.
            */

            setTimeout(
                () => {

                    initialTarget.scrollIntoView({

                        behavior: "auto",

                        block: "start"

                    });


                    setActiveNavLink(
                        initialTarget.id
                    );

                },
                50
            );

        }

    }


    /* =================================================================
       26. IMAGE DRAG PREVENTION
       =================================================================
       
       Project screenshots are UI previews,
       so accidentally dragging them around is unnecessary.
       ================================================================= */

    document
        .querySelectorAll(
            ".project-image, .project-gallery img, .profile-image"
        )
        .forEach(image => {

            image.setAttribute(
                "draggable",
                "false"
            );

        });


    /* =================================================================
       27. FINAL INITIALIZATION
       ================================================================= */

    requestScrollUpdate();


    console.log(
        "%cMarcell Juniar Wijaya Portfolio",
        "color:#2563eb;font-weight:700;font-size:14px;"
    );


    console.log(
        "Portfolio initialized successfully."
    );

});