/* ========================================
   RADIO VANAKKAM - MAIN JAVASCRIPT
   ========================================
   Table of Contents:
   1. DOM Elements & Variables
   2. Navbar Functionality
   3. Hero Animations
   4. Scroll Animations (GSAP)
   5. Carousel Functionality
   6. Counter Animation
   7. Contact Form
   8. Utility Functions
   9. Initialization
   ======================================== */

// ========================================
// 1. DOM ELEMENTS & VARIABLES
// ========================================

// Navbar Elements
const navbar = document.getElementById('navbar');
const navMenu = document.getElementById('nav-menu');
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.querySelectorAll('.nav-link');

// Carousel Elements
const carousel = document.getElementById('shows-carousel');
const carouselPrev = document.getElementById('carousel-prev');
const carouselNext = document.getElementById('carousel-next');
const carouselDotsContainer = document.getElementById('carousel-dots');

// Form Elements
const contactForm = document.getElementById('contact-form');

// Scroll & Animation Variables
let lastScrollY = window.scrollY;
let ticking = false;

// ========================================
// 2. NAVBAR FUNCTIONALITY
// ========================================

/**
 * Handle navbar scroll effects
 * Adds 'scrolled' class when user scrolls down
 */
function handleNavbarScroll() {
    const navbarEl = document.getElementById('navbar');
    if (!navbarEl) return;

    if (window.scrollY > 50) {
        navbarEl.classList.add('scrolled');
    } else {
        navbarEl.classList.remove('scrolled');
    }
}

/**
 * Toggle mobile menu
 */
function toggleMobileMenu() {
    const navToggleEl = document.getElementById('nav-toggle');
    const navMenuEl = document.getElementById('nav-menu');
    if (!navToggleEl || !navMenuEl) return;

    navToggleEl.classList.toggle('active');
    navMenuEl.classList.toggle('active');
    document.body.style.overflow = navMenuEl.classList.contains('active') ? 'hidden' : '';
}

/**
 * Close mobile menu when a link is clicked
 */
function closeMobileMenu() {
    const navToggleEl = document.getElementById('nav-toggle');
    const navMenuEl = document.getElementById('nav-menu');
    if (!navToggleEl || !navMenuEl) return;

    navToggleEl.classList.remove('active');
    navMenuEl.classList.remove('active');
    document.body.style.overflow = '';
}

/**
 * Update active nav link based on scroll position
 */
function updateActiveNavLink() {
    const navLinks = document.querySelectorAll('.nav-link');
    if (!navLinks.length) return;

    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.scrollY + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

/**
 * Sync bottom padding so content is never hidden behind the fixed playbar
 */
function syncPlaybarSafeArea() {
    const playbar = document.getElementById('playbar');
    const safeArea = playbar ? (playbar.offsetHeight + 24) : 0;
    document.documentElement.style.setProperty('--playbar-safe-area', `${safeArea}px`);
}

/**
 * Move the fixed playbar up when the main footer enters the viewport
 * so it sits right above the footer (no overlap).
 */
function updatePlaybarPosition() {
    const playbar = document.getElementById('playbar');
    const footer = document.getElementById('footer');
    if (!playbar || !footer) return;

    const footerRect = footer.getBoundingClientRect();
    const offset = Math.max(0, window.innerHeight - footerRect.top);
    playbar.style.transform = offset > 0 ? `translateY(-${offset}px)` : 'translateY(0)';
}



// Navbar Event Listeners are set up in init() using event delegation

// ========================================
// 3. HERO ANIMATIONS
// ========================================

/**
 * Initialize hero section animations using GSAP
 */
function initHeroAnimations() {
    // Check if GSAP is loaded
    if (typeof gsap === 'undefined') {
        console.warn('GSAP not loaded. Skipping hero animations.');
        return;
    }

    // Create a timeline for hero animations
    const heroTimeline = gsap.timeline({
        defaults: { ease: 'power3.out' }
    });

    // Animate hero elements in sequence
    heroTimeline
        .to('.hero-subtitle', {
            opacity: 1,
            y: 0,
            duration: 0.8
        })
        .to('.hero-title', {
            opacity: 1,
            y: 0,
            duration: 1
        }, '-=0.5')
        .to('.hero-tagline', {
            opacity: 1,
            y: 0,
            duration: 0.8
        }, '-=0.6')
        .to('.hero-description', {
            opacity: 1,
            y: 0,
            duration: 0.8
        }, '-=0.5')
        .to('.hero-buttons', {
            opacity: 1,
            y: 0,
            duration: 0.8
        }, '-=0.4')
        .to('.hero-visual', {
            opacity: 1,
            scale: 1,
            duration: 1,
            ease: 'back.out(1.5)'
        }, '-=0.6');
}

// ========================================
// 4. SCROLL ANIMATIONS (GSAP + ScrollTrigger)
// ========================================

/**
 * Initialize scroll-triggered animations using GSAP ScrollTrigger
 */
function initScrollAnimations() {
    // Check if GSAP and ScrollTrigger are loaded
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.warn('GSAP or ScrollTrigger not loaded. Skipping scroll animations.');
        return;
    }

    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    // ---- SHOWS SECTION ANIMATIONS ----
    
    // Section Header Animation
    gsap.from('.shows-section .section-header', {
        scrollTrigger: {
            trigger: '.shows-section',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        },
        opacity: 0,
        y: 50,
        duration: 1,
        ease: 'power3.out'
    });

    // Show Cards Stagger Animation
    gsap.from('.show-card', {
        scrollTrigger: {
            trigger: '.carousel',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        },
        opacity: 0,
        y: 60,
        stagger: 0.15,
        duration: 0.8,
        ease: 'power3.out'
    });

    // ---- ABOUT SECTION ANIMATIONS ----
    
    // About Text Animation
    gsap.from('.about-text > *', {
        scrollTrigger: {
            trigger: '.about-section',
            start: 'top 70%',
            toggleActions: 'play none none reverse'
        },
        opacity: 0,
        x: -50,
        stagger: 0.1,
        duration: 0.8,
        ease: 'power3.out'
    });

    // About Images Animation
    gsap.from('.about-img', {
        scrollTrigger: {
            trigger: '.about-visual',
            start: 'top 70%',
            toggleActions: 'play none none reverse'
        },
        opacity: 0,
        scale: 0.8,
        y: 50,
        stagger: 0.2,
        duration: 1,
        ease: 'back.out(1.5)'
    });

    // Stats Animation
    gsap.from('.stat-item', {
        scrollTrigger: {
            trigger: '.about-stats',
            start: 'top 85%',
            toggleActions: 'play none none reverse',
            onEnter: () => animateCounters()
        },
        opacity: 0,
        y: 30,
        stagger: 0.1,
        duration: 0.6,
        ease: 'power3.out'
    });

    // ---- CONTACT SECTION ANIMATIONS ----
    
    // Contact Info Animation
    gsap.from('.contact-info > *', {
        scrollTrigger: {
            trigger: '.contact-section',
            start: 'top 70%',
            toggleActions: 'play none none reverse'
        },
        opacity: 0,
        x: -50,
        stagger: 0.1,
        duration: 0.8,
        ease: 'power3.out'
    });

    // Contact Form Animation
    gsap.from('.contact-form-wrapper', {
        scrollTrigger: {
            trigger: '.contact-form-wrapper',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        },
        opacity: 0,
        x: 50,
        duration: 1,
        ease: 'power3.out'
    });

    // ---- FOOTER ANIMATIONS ----
    
    gsap.from('.footer-main > *', {
        scrollTrigger: {
            trigger: '.footer',
            start: 'top 90%',
            toggleActions: 'play none none reverse'
        },
        opacity: 0,
        y: 30,
        stagger: 0.15,
        duration: 0.8,
        ease: 'power3.out'
    });

    // ---- PARALLAX EFFECTS ----
    
    // Hero background parallax
    gsap.to('.hero-bg', {
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 1
        },
        y: 200,
        ease: 'none'
    });

    // Floating notes parallax
    gsap.to('.floating-notes .note', {
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 1
        },
        y: -100,
        stagger: 0.1,
        ease: 'none'
    });
}

// ========================================
// 5. CAROUSEL FUNCTIONALITY
// ========================================

let currentSlide = 0;
let totalSlides = 0;
let slideWidth = 0;
let slidesVisible = 1;

/**
 * Initialize the carousel
 */
function initCarousel() {
    if (!carousel) return;

    const cards = carousel.querySelectorAll('.show-card');
    totalSlides = cards.length;

    // Calculate slides visible based on viewport
    updateSlidesVisible();

    // Create dots
    createCarouselDots();

    // Update carousel on window resize
    window.addEventListener('resize', debounce(() => {
        updateSlidesVisible();
        updateCarouselDots();
        goToSlide(currentSlide);
    }, 100));
}

/**
 * Update the number of visible slides based on viewport width
 */
function updateSlidesVisible() {
    const viewportWidth = window.innerWidth;
    if (viewportWidth >= 1200) {
        slidesVisible = 4;
    } else if (viewportWidth >= 992) {
        slidesVisible = 3;
    } else if (viewportWidth >= 768) {
        slidesVisible = 2;
    } else {
        slidesVisible = 1;
    }

    const card = carousel.querySelector('.show-card');
    if (card) {
        slideWidth = card.offsetWidth + 32; // card width + gap
    }
}

/**
 * Create carousel navigation dots
 */
function createCarouselDots() {
    if (!carouselDotsContainer) return;

    carouselDotsContainer.innerHTML = '';
    const numDots = Math.ceil(totalSlides / slidesVisible);

    for (let i = 0; i < numDots; i++) {
        const dot = document.createElement('button');
        dot.classList.add('carousel-dot');
        dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i * slidesVisible));
        carouselDotsContainer.appendChild(dot);
    }
}

/**
 * Update carousel dots to match current position
 */
function updateCarouselDots() {
    const dots = carouselDotsContainer?.querySelectorAll('.carousel-dot');
    if (!dots) return;

    const activeDotIndex = Math.floor(currentSlide / slidesVisible);
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === activeDotIndex);
    });
}

/**
 * Navigate to a specific slide
 * @param {number} index - The slide index to navigate to
 */
function goToSlide(index) {
    const maxSlide = totalSlides - slidesVisible;
    currentSlide = Math.max(0, Math.min(index, maxSlide));

    carousel.scrollTo({
        left: currentSlide * slideWidth,
        behavior: 'smooth'
    });

    updateCarouselDots();
}

/**
 * Navigate to the next slide
 */
function nextSlide() {
    goToSlide(currentSlide + slidesVisible);
}

/**
 * Navigate to the previous slide
 */
function prevSlide() {
    goToSlide(currentSlide - slidesVisible);
}

// Carousel Event Listeners
carouselPrev?.addEventListener('click', prevSlide);
carouselNext?.addEventListener('click', nextSlide);

// Touch/Swipe support for carousel
let touchStartX = 0;
let touchEndX = 0;

carousel?.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

carousel?.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
}, { passive: true });

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            nextSlide();
        } else {
            prevSlide();
        }
    }
}

// ========================================
// 6. COUNTER ANIMATION
// ========================================

let countersAnimated = false;

/**
 * Animate number counters
 */
function animateCounters() {
    if (countersAnimated) return;
    countersAnimated = true;

    const counters = document.querySelectorAll('.stat-number');

    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'), 10);
        const duration = 2000;
        const startTime = performance.now();

        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Ease out quad
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(easeProgress * target);

            counter.textContent = current.toLocaleString();

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        }

        requestAnimationFrame(updateCounter);
    });
}

// ========================================
// 7. CONTACT FORM
// ========================================

/**
 * Handle contact form submission
 * @param {Event} e - The submit event
 */
function handleFormSubmit(e) {
    e.preventDefault();

    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData.entries());

    // Validate form
    if (!validateForm(data)) {
        return;
    }

    // Show loading state
    const submitBtn = contactForm.querySelector('.btn-submit');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span>Sending...</span>';
    submitBtn.disabled = true;

    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
        // Reset form
        contactForm.reset();
        
        // Show success message
        submitBtn.innerHTML = '<span>Message Sent! ✓</span>';
        submitBtn.style.background = '#27ae60';

        // Reset button after delay
        setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.style.background = '';
            submitBtn.disabled = false;
        }, 3000);

    }, 1500);
}

/**
 * Validate form data
 * @param {Object} data - Form data object
 * @returns {boolean} - Whether the form is valid
 */
function validateForm(data) {
    const { name, email, subject, message } = data;

    if (!name || name.trim().length < 2) {
        showFormError('Please enter your name');
        return false;
    }

    if (!email || !isValidEmail(email)) {
        showFormError('Please enter a valid email address');
        return false;
    }

    if (!subject) {
        showFormError('Please select a subject');
        return false;
    }

    if (!message || message.trim().length < 10) {
        showFormError('Please enter a message (at least 10 characters)');
        return false;
    }

    return true;
}

/**
 * Validate email format
 * @param {string} email - Email address to validate
 * @returns {boolean} - Whether the email is valid
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Show form error message
 * @param {string} message - Error message to display
 */
function showFormError(message) {
    // Create error element if it doesn't exist
    let errorEl = contactForm.querySelector('.form-error');
    if (!errorEl) {
        errorEl = document.createElement('div');
        errorEl.classList.add('form-error');
        errorEl.style.cssText = `
            background: #ff6b6b;
            color: white;
            padding: 12px 16px;
            border-radius: 8px;
            margin-bottom: 16px;
            font-size: 0.9rem;
            animation: shake 0.5s ease;
        `;
        contactForm.prepend(errorEl);
    }

    errorEl.textContent = message;

    // Remove error after 5 seconds
    setTimeout(() => {
        errorEl.remove();
    }, 5000);
}

// Form Event Listener
contactForm?.addEventListener('submit', handleFormSubmit);

// ========================================
// 8. UTILITY FUNCTIONS
// ========================================

/**
 * Debounce function to limit function calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} - Debounced function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttle function to limit function calls
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} - Throttled function
 */
function throttle(func, limit) {
    let inThrottle;
    return function executedFunction(...args) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Smooth scroll to element
 * @param {string} selector - CSS selector for target element
 */
function smoothScrollTo(selector) {
    const element = document.querySelector(selector);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// ========================================
// 9. INITIALIZATION
// ========================================

/**
 * Main initialization function
 */
function init() {
    // Initialize hero animations
    initHeroAnimations();

    // Initialize scroll animations
    initScrollAnimations();

    // Initialize carousel
    initCarousel();

    // Add scroll event listeners
    window.addEventListener('scroll', throttle(() => {
        handleNavbarScroll();

    window.addEventListener('resize', throttle(() => {
        syncPlaybarSafeArea();
        updatePlaybarPosition();
    }, 100));
        updateActiveNavLink();
        updatePlaybarPosition();
    }, 100));
// Initial calls
    handleNavbarScroll();
    updateActiveNavLink();

    
    // Playbar sizing + position
    syncPlaybarSafeArea();
    updatePlaybarPosition();
    // Click handling (delegated):
    // - Mobile menu toggle
    // - Smooth scrolling for #anchor links (works even if navbar is injected later)
    document.addEventListener('click', (e) => {
        const toggleBtn = e.target.closest('#nav-toggle');
        if (toggleBtn) {
            e.preventDefault();
            toggleMobileMenu();
            return;
        }

        const anchor = e.target.closest('a[href^="#"]');
        if (!anchor) return;

        const href = anchor.getAttribute('href');
        if (!href || href === '#') return;

        const target = document.querySelector(href);
        if (!target) return;

        e.preventDefault();

        const navbarEl = document.getElementById('navbar');
        const navHeight = navbarEl ? navbarEl.offsetHeight : 0;
        const targetPosition = target.offsetTop - navHeight;

        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });

        closeMobileMenu();
    });

    // Add keyboard navigation for carousel
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevSlide();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
        }
    });

    // Add shake animation CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
    `;
    document.head.appendChild(style);

    console.log('🎵 Radio Vanakkam website initialized successfully!');
}

// Run initialization when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Export functions for external use (if needed)
window.RadioVanakkam = {
    goToSlide,
    nextSlide,
    prevSlide,
    smoothScrollTo
};