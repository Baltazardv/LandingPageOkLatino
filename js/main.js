document.addEventListener('DOMContentLoaded', function () {
    // --- Menú Móvil ---
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('open');
        });
    }

    // --- Header dinámico al hacer scroll ---
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // --- LÓGICA DE ANIMACIÓN DE CRECIMIENTO DE NEGOCIO ---
    const animationContainer = document.getElementById('process-animation-container');
    if (animationContainer) {
        const ingredients = animationContainer.querySelectorAll('.process-ingredient');
        const stages = animationContainer.querySelectorAll('.business-stage');
        const resultDisplay = animationContainer.querySelector('.result-display');
        let currentStageIndex = 0;
        let isAnimating = false;
        let animationTimeout;

        function resetAnimationState() {
            resultDisplay.style.transition = 'none';
            resultDisplay.style.opacity = '0';
            resultDisplay.style.transform = 'translate(-50%, 50px)';
            ingredients.forEach(ing => {
                ing.style.transition = 'none';
                ing.style.opacity = '0';
                ing.style.transform = 'translate(-50%, -80px)';
            });
            stages.forEach(stage => stage.classList.remove('active'));
            stages[0].classList.add('active');
            currentStageIndex = 0;
            void animationContainer.offsetWidth; // Force reflow
            ingredients.forEach(ing => {
                ing.style.transition = 'opacity 0.5s ease-out, transform 1.5s ease-in-out';
            });
        }

        function runAnimationStep(index) {
            if (!isAnimating) return;
            if (index >= ingredients.length) {
                setTimeout(() => {
                    if (!isAnimating) return;
                    if (stages[currentStageIndex]) {
                        stages[currentStageIndex].classList.remove('active');
                    }
                    resultDisplay.style.transition = 'opacity 0.5s ease-in-out, transform 0.5s ease-in-out';
                    resultDisplay.style.opacity = '1';
                    resultDisplay.style.transform = 'translate(-50%, 0)';
                    setTimeout(() => {
                        if (!isAnimating) return;
                        resultDisplay.style.transition = 'opacity 1.5s ease-in, transform 1.5s ease-in';
                        resultDisplay.style.opacity = '0';
                        resultDisplay.style.transform = 'translate(-50%, -300px)';
                        animationTimeout = setTimeout(startAnimationCycle, 1500);
                    }, 2000);
                }, 1000);
                return;
            }
            const ingredient = ingredients[index];
            setTimeout(() => {
                if (!isAnimating) return;
                ingredient.style.opacity = '1';
                ingredient.style.transform = 'translate(-50%, 150px)';
            }, 100);
            setTimeout(() => {
                if (!isAnimating) return;
                ingredient.style.opacity = '0';
                if (stages[currentStageIndex]) {
                    stages[currentStageIndex].classList.remove('active');
                }
                currentStageIndex++;
                if (stages[currentStageIndex]) {
                    stages[currentStageIndex].classList.add('active');
                }
                runAnimationStep(index + 1);
            }, 2200);
        }

        function startAnimationCycle() {
            if (!isAnimating) return;
            resetAnimationState();
            runAnimationStep(0);
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (!isAnimating) {
                        isAnimating = true;
                        startAnimationCycle();
                    }
                } else {
                    isAnimating = false;
                    clearTimeout(animationTimeout);
                }
            });
        }, { threshold: 0.5 });
        observer.observe(animationContainer);
    }

    // --- Carrusel de Testimonios ---
    const slider = document.getElementById('testimonial-slider');
    const dots = document.querySelectorAll('.testimonial-controls button');
    const prevBtn = document.getElementById('prev-testimonial');
    const nextBtn = document.getElementById('next-testimonial');
    let currentSlide = 0;
    const totalSlides = slider ? slider.children.length : 0;

    function updateCarousel() {
        if (!slider || totalSlides === 0) return;
        slider.style.transform = `translateX(-${currentSlide * 100}%)`;
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }

    if (nextBtn && prevBtn) {
        nextBtn.addEventListener('click', () => {
            currentSlide = (currentSlide + 1) % totalSlides;
            updateCarousel();
        });
        prevBtn.addEventListener('click', () => {
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            updateCarousel();
        });
        dots.forEach(dot => {
            dot.addEventListener('click', (e) => {
                currentSlide = parseInt(e.target.dataset.slide);
                updateCarousel();
            })
        });
        setInterval(() => nextBtn.click(), 7000);
        updateCarousel();
    }

    // --- Lógica del Modal de Pago ---
    const paymentModal = document.getElementById('payment-modal');
    const closeModalBtn = document.getElementById('close-modal');
    const serviceButtons = document.querySelectorAll('.service-button');
    const modalPackageName = document.getElementById('modal-package-name');
    const modalPackagePrice = document.getElementById('modal-package-price');

    serviceButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const packageName = button.dataset.package;
            const packagePrice = button.dataset.price;
            modalPackageName.textContent = packageName;
            modalPackagePrice.textContent = packagePrice;
            paymentModal.classList.remove('hidden');
        });
    });

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            paymentModal.classList.add('hidden');
        });
    }

    if (paymentModal) {
        paymentModal.addEventListener('click', (e) => {
            if (e.target === paymentModal) {
                paymentModal.classList.add('hidden');
            }
        });
    }

    // --- Efecto de toque para tarjetas en móvil ---
    document.querySelectorAll('.service-card').forEach(card => {
        card.addEventListener('touchstart', () => {
            card.classList.add('tapped');
        }, { passive: true });
        card.addEventListener('touchend', () => {
            setTimeout(() => {
                card.classList.remove('tapped');
            }, 150);
        });
    });


    // --- INICIALIZACIÓN DE GSAP Y LENIS ---

    // 1. INICIALIZACIÓN DE LENIS (SCROLL SUAVE)
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Integración de Lenis con los enlaces de ancla
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId.length > 1 && targetId !== '#') {
                const headerOffset = document.querySelector('.header').offsetHeight;
                lenis.scrollTo(targetId, { offset: -headerOffset });
            }
            // Cierra el menú móvil si está abierto
            const mobileMenu = document.getElementById('mobile-menu');
            if (mobileMenu && mobileMenu.classList.contains('open')) {
                mobileMenu.classList.remove('open');
            }
        });
    });

    // 2. INICIALIZACIÓN DE GSAP (ANIMACIONES)
    gsap.registerPlugin(ScrollTrigger);

    // Animación de entrada para el Hero
    const heroContent = document.querySelector("#hero-content");
    if (heroContent) {
        gsap.from(heroContent.children, {
            opacity: 0,
            y: 30,
            duration: 1,
            stagger: 0.2,
            ease: "power3.out",
            delay: 0.5
        });
    }

    // Animación genérica de aparición para secciones
    const fadeUpElements = document.querySelectorAll(".gsap-fade-up");
    fadeUpElements.forEach(el => {
        gsap.to(el, {
            scrollTrigger: {
                trigger: el,
                start: "top 85%",
                toggleActions: "play none none none"
            },
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            delay: el.style.getPropertyValue("--stagger-delay") || 0
        });
    });

    // Animación escalonada para las tarjetas de servicios
    gsap.to(".service-card", {
        scrollTrigger: {
            trigger: "#services",
            start: "top 70%",
            toggleActions: "play none none none"
        },
        opacity: 1,
        y: 0,
        stagger: 0.15,
        duration: 0.8,
        ease: "power2.out"
    });
});
