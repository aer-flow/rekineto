document.addEventListener('DOMContentLoaded', () => {
    const header = document.getElementById('navbar');
    const emergencyBanner = document.getElementById('top');
    const isSubpage = document.body.classList.contains('subpage');

    function updateMobileHeaderOffset() {
        const mobileHeaderOffset = (!isSubpage && emergencyBanner) ? emergencyBanner.offsetHeight : 0;
        document.documentElement.style.setProperty('--mobile-header-offset', `${mobileHeaderOffset}px`);
    }

    // 0. HERO IMAGE ROTATOR
    function initHeroSlider() {
        const slides = Array.from(document.querySelectorAll('.hero-slide'));
        if (slides.length <= 1 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        let activeIndex = 0;

        const showSlide = (nextIndex) => {
            slides.forEach((slide) => slide.classList.remove('is-active'));
            const nextSlide = slides[nextIndex];
            void nextSlide.offsetWidth;
            nextSlide.classList.add('is-active');
        };

        setInterval(() => {
            activeIndex = (activeIndex + 1) % slides.length;
            showSlide(activeIndex);
        }, 4800);
    }

    initHeroSlider();

    // 0. PREMIUM HERO ANIMATION (GSAP)
    function initHeroAnimation() {
        const tl = gsap.timeline({ defaults: { ease: "power4.out", duration: 1.2 } });

        tl.from("#hero-subtitle", { y: 20, opacity: 0, delay: 0.5 })
            .from("#hero-title .line", {
                y: 100,
                opacity: 0,
                stagger: 0.2,
                skewY: 7,
                transformOrigin: "left top"
            }, "-=0.8")
            .from("#hero-desc", { y: 20, opacity: 0 }, "-=0.8")
            .from("#hero-cta", { y: 20, opacity: 0, scale: 0.9, duration: 1 }, "-=0.6");
    }

    initHeroAnimation();

    // 0.1 MOBILE NAV
    function initMobileNav() {
        const menuButton = document.querySelector('.mobile-menu');
        const nav = document.querySelector('.nav-links');
        const menuIcon = menuButton ? menuButton.querySelector('i') : null;

        if (!menuButton || !nav || !header) return;

        const setMenuState = (isOpen) => {
            document.body.classList.toggle('mobile-nav-open', isOpen);
            menuButton.setAttribute('aria-expanded', String(isOpen));
            menuButton.setAttribute('aria-label', isOpen ? 'Închide meniul' : 'Deschide meniul');

            if (menuIcon) {
                menuIcon.classList.toggle('fa-bars', !isOpen);
                menuIcon.classList.toggle('fa-xmark', isOpen);
            }
        };

        menuButton.addEventListener('click', (event) => {
            event.stopPropagation();
            const isOpen = !document.body.classList.contains('mobile-nav-open');
            setMenuState(isOpen);
        });

        nav.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', () => setMenuState(false));
        });

        document.addEventListener('click', (event) => {
            if (!document.body.classList.contains('mobile-nav-open')) return;
            if (!header.contains(event.target)) {
                setMenuState(false);
            }
        });

        window.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                setMenuState(false);
            }
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                setMenuState(false);
            }
        });
    }

    initMobileNav();

    // 0.2 STATS COUNT-UP ANIMATION
    function initStatsAnimation() {
        const stats = document.querySelectorAll('.stat-number');
        if (stats.length === 0) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target;
                    const endValue = parseInt(target.getAttribute('data-target'));

                    gsap.to(target, {
                        innerText: endValue,
                        duration: 2.5,
                        snap: { innerText: 1 },
                        ease: "power2.out",
                        onUpdate: function () {
                            // Optional: add commas for large numbers if needed
                            // target.innerText = Math.ceil(this.targets()[0].innerText).toLocaleString();
                        }
                    });
                    observer.unobserve(target);
                }
            });
        }, { threshold: 0.5 });

        stats.forEach(stat => observer.observe(stat));
    }

    initStatsAnimation();

    // 0.3 MAGNETIC BUTTONS
    function initMagneticButtons() {
        const buttons = document.querySelectorAll('.btn-emerald, .btn-outline, .btn-primary');

        buttons.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;

                gsap.to(btn, {
                    x: x * 0.3,
                    y: y * 0.3,
                    duration: 0.4,
                    ease: "power2.out"
                });
            });

            btn.addEventListener('mouseleave', () => {
                gsap.to(btn, {
                    x: 0,
                    y: 0,
                    duration: 0.6,
                    ease: "elastic.out(1, 0.3)"
                });
            });
        });
    }

    initMagneticButtons();

    // 0.4 CUSTOM PREMIUM CURSOR
    function initCustomCursor() {
        if (window.matchMedia("(hover: none) and (pointer: coarse)").matches) return;

        const dot = document.querySelector(".cursor-dot");
        const outline = document.querySelector(".cursor-outline");

        if (!dot || !outline) return;

        const xDotSetter = gsap.quickSetter(dot, "x", "px");
        const yDotSetter = gsap.quickSetter(dot, "y", "px");
        const xOutlineSetter = gsap.quickSetter(outline, "x", "px");
        const yOutlineSetter = gsap.quickSetter(outline, "y", "px");

        window.addEventListener("mousemove", (e) => {
            xDotSetter(e.clientX - 3);
            yDotSetter(e.clientY - 3);

            gsap.to(outline, {
                x: e.clientX - 20,
                y: e.clientY - 20,
                duration: 0.5,
                ease: "power3.out"
            });
        });

        const interactiveElements = document.querySelectorAll('a, button, .svc-card, .doc');

        interactiveElements.forEach(el => {
            el.addEventListener("mouseenter", () => {
                gsap.to(outline, { scale: 1.5, backgroundColor: "rgba(139, 92, 246, 0.1)", borderColor: "transparent", duration: 0.3 });
                gsap.to(dot, { scale: 0, duration: 0.3 });
            });
            el.addEventListener("mouseleave", () => {
                gsap.to(outline, { scale: 1, backgroundColor: "transparent", borderColor: "var(--primary)", duration: 0.3 });
                gsap.to(dot, { scale: 1, duration: 0.3 });
            });
        });
    }

    initCustomCursor();

    // 0.5 CARD REFINEMENTS
    function initCardRefinements() {
        const cards = document.querySelectorAll('.svc-card, .doc');
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                gsap.to(card, { scale: 1.02, duration: 0.4, ease: "power2.out" });
            });
            card.addEventListener('mouseleave', () => {
                gsap.to(card, { scale: 1, duration: 0.4, ease: "power2.out" });
            });
        });
    }

    initCardRefinements();

    // 1. SCROLL REVEAL ANIMATIONS
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, { rootMargin: "0px 0px -50px 0px", threshold: 0.1 });

    revealElements.forEach(el => revealObserver.observe(el));

    // 2. HEADER SCROLL EFFECT
    function syncHeaderState() {
        if (!header) return;

        const threshold = emergencyBanner ? emergencyBanner.offsetHeight : 0;
        const shouldStayPinned = isSubpage || window.scrollY > threshold;

        header.classList.toggle('scrolled', shouldStayPinned);
    }

    updateMobileHeaderOffset();
    syncHeaderState();

    window.addEventListener('scroll', syncHeaderState, { passive: true });
    window.addEventListener('resize', () => {
        updateMobileHeaderOffset();
        syncHeaderState();
    });

    if (window.visualViewport) {
        window.visualViewport.addEventListener('resize', updateMobileHeaderOffset);
    }

    // 3. FORM DEMO PREVENT DEFAULT
    const form = document.querySelector('.smart-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = form.querySelector('button');
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fa-solid fa-circle-check"></i> Programare Trimisă!';
            btn.style.backgroundColor = '#257A53';
            setTimeout(() => {
                form.reset();
                btn.innerHTML = originalText;
                btn.style.backgroundColor = '';
            }, 3000);
        });
    }
});
