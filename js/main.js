// Save contact data to Firestore.
// IMPORTANT: Do NOT call Mailgun directly from the browser.
// Email sending is handled securely by a Firebase Cloud Function (see /functions/index.js).
async function saveContactToFirestore(data) {
  try {
    const { collection, addDoc, serverTimestamp } = await import(
      "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js"
    );

    if (!window.db) {
      throw new Error("Firestore not initialized. window.db is missing.");
    }

    const docRef = await addDoc(collection(window.db, "contactMessages"), {
      name: (data.name || "").trim(),
      email: (data.email || "").trim(),
      phone: (data.phone || "").trim(),
      businessName: (data.businessName || "").trim(),
      page: window.location.href,
      userAgent: navigator.userAgent,
      createdAt: serverTimestamp(),
    });

    return docRef.id;
  } catch (error) {
    console.error("Error saving contact message:", error);
    throw error;
  }
}


// Save contact data to Firestore.
// IMPORTANT: Do NOT call Mailgun directly from the browser.
// Email sending is handled securely by a Firebase Cloud Function (see /functions/index.js).



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

// Prevent double-init
let __RV_INIT_DONE__ = false;

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
  const navLinksLive = document.querySelectorAll('.nav-link');
  if (!navLinksLive.length) return;

  const sections = document.querySelectorAll('section[id]');
  const scrollY = window.scrollY + 100;

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute('id');

    if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
      navLinksLive.forEach((link) => {
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
  if (!playbar) {
    document.documentElement.style.setProperty('--playbar-safe-area', `0px`);
    return;
  }

  // If docked (below footer), don't add extra bottom padding (removes empty space)
  if (playbar.classList.contains('playbar--docked')) {
    document.documentElement.style.setProperty('--playbar-safe-area', `0px`);
    return;
  }

  // Fixed mode: keep content from hiding behind the bar
  const safeArea = playbar.offsetHeight + 24;
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
  const playbarH = playbar.offsetHeight;

  // Dock when footer would start going under the fixed playbar
  const shouldDock = footerRect.top <= (window.innerHeight - playbarH);

  if (shouldDock) {
    playbar.classList.add('playbar--docked');
    playbar.style.transform = 'none';
  } else {
    playbar.classList.remove('playbar--docked');
    playbar.style.transform = 'translateY(0)';
  }

  // keep bottom padding correct (0 when docked, playbar height when fixed)
  syncPlaybarSafeArea();
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
  // If GSAP/ScrollTrigger not present, silently skip.
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  // ✅ REMOVED: SHOWS SECTION animations (header + show cards)
  // ✅ REMOVED: ABOUT SECTION animations (text + images + stat items)

  // ---- CONTACT SECTION ANIMATIONS ----
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

  // Update carousel on window resize (carousel-only recalcs)
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
  if (!carousel) return;

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
  if (!carousel) return;

  const maxSlide = Math.max(0, totalSlides - slidesVisible);
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

  counters.forEach((counter) => {
    const target = parseInt(counter.getAttribute('data-count'), 10);
    const duration = 2000;
    const startTime = performance.now();

    function updateCounter(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic
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
// 7. CONTACT FORM (Firestore + Mailgun via Cloud Function)
// ========================================

if (contactForm) {
  contactForm.addEventListener("submit", handleFormSubmit);
}

async function handleFormSubmit(e) {
  e.preventDefault();
  if (!contactForm) return;

  const formData = new FormData(contactForm);
  const data = {
    name: (formData.get("name") || "").toString().trim(),
    email: (formData.get("email") || "").toString().trim(),
    phone: (formData.get("phone") || "").toString().trim(),
    businessName: (formData.get("businessName") || "").toString().trim(),
  };

  const validationError = validateForm(data);
  if (validationError) {
    showFormError(validationError);
    return;
  }

  const submitBtn = contactForm.querySelector(".btn-submit");
  const originalHtml = submitBtn ? submitBtn.innerHTML : "";

  try {
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = "<span>Sending...</span>";
    }

    // Save to Firestore. A Firebase Cloud Function will send the Mailgun email.
    await saveContactToFirestore(data);

    contactForm.reset();
    showFormSuccess("Thanks! We'll reach out soon.");
  } catch (err) {
    console.error(err);
    showFormError("Sorry, something went wrong. Please try again.");
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalHtml;
    }
  }
}

function validateForm(data) {
  if (!data.name) return "Please enter your name.";
  if (!data.email) return "Please enter your email.";

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email);
  if (!emailOk) return "Please enter a valid email.";

  if (!data.phone) return "Please enter your phone number.";
  const digits = data.phone.replace(/\D/g, "");
  if (digits.length < 7) return "Please enter a valid phone number.";

  if (!data.businessName) return "Please enter your business name.";
  return null;
}

function showFormError(message) {
  if (!contactForm) return;

  const existing = contactForm.querySelector(".form-message");
  if (existing) existing.remove();

  const el = document.createElement("div");
  el.className = "form-message form-error";
  el.textContent = message;
  el.style.cssText = `
    padding: 12px 16px;
    border-radius: 8px;
    background: rgba(255, 68, 68, 0.10);
    border: 1px solid rgba(255, 68, 68, 0.25);
    color: #b10000;
    font-weight: 600;
    margin-bottom: 12px;
  `;

  contactForm.prepend(el);
  setTimeout(() => el.remove(), 6000);
}

function showFormSuccess(message) {
  if (!contactForm) return;

  const existing = contactForm.querySelector(".form-message");
  if (existing) existing.remove();

  const el = document.createElement("div");
  el.className = "form-message form-success";
  el.textContent = message;
  el.style.cssText = `
    padding: 12px 16px;
    border-radius: 8px;
    background: rgba(72, 187, 120, 0.12);
    border: 1px solid rgba(72, 187, 120, 0.25);
    color: #0b6b2a;
    font-weight: 600;
    margin-bottom: 12px;
  `;

  contactForm.prepend(el);
  setTimeout(() => el.remove(), 6000);
}


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
  let inThrottle = false;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => { inThrottle = false; }, limit);
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

function resetShowsAndAboutVisibility() {
  const selectors = [
    '.shows-section .section-header',
    '#shows-carousel .show-card',
    '.about-text > *',
    '.about-img',
    '.stat-item'
  ];

  selectors.forEach(sel => {
    document.querySelectorAll(sel).forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
  });
}



function initAboutCountersObserver() {
  const stats = document.querySelector('.about-stats');
  if (!stats) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounters();
        obs.disconnect();
      }
    });
  }, { threshold: 0.25 });

  obs.observe(stats);
}


function initRadioPlayer() {
  const audio = document.getElementById('radio-audio');
  const btn = document.getElementById('play-toggle');
  const icon = document.getElementById('play-icon');
  const text = document.getElementById('play-text');

  if (!audio || !btn || !icon || !text) return;

  const STREAM_URL = 'https://streamlky.alsolnet.com/vanakkamaudio';
  audio.src = STREAM_URL;

  function setUI(state) {
    if (state === 'playing') {
      icon.textContent = '⏸';
      text.textContent = 'Pause';
      btn.setAttribute('aria-label', 'Pause');
    } else if (state === 'loading') {
      icon.textContent = '⏳';
      text.textContent = 'Loading';
      btn.setAttribute('aria-label', 'Loading');
    } else {
      icon.textContent = '▶';
      text.textContent = 'Play';
      btn.setAttribute('aria-label', 'Play');
    }
  }

  btn.addEventListener('click', async () => {
    try {
      if (audio.paused) {
        setUI('loading');
        await audio.play();
        setUI('playing');
      } else {
        audio.pause();
        setUI('paused');
      }
    } catch (err) {
      console.warn('Audio play failed:', err);
      setUI('paused');
      alert('Unable to start the live stream. Please try again.');
    }
  });

  audio.addEventListener('playing', () => setUI('playing'));
  audio.addEventListener('pause', () => setUI('paused'));
  audio.addEventListener('waiting', () => setUI('loading'));
  audio.addEventListener('stalled', () => setUI('loading'));
  audio.addEventListener('error', () => setUI('paused'));

  setUI('paused');
}





function init() {
  if (__RV_INIT_DONE__) return;
  __RV_INIT_DONE__ = true;

  // Initialize hero animations
  initHeroAnimations();

  initRadioPlayer();

  // Initialize scroll animations
  initScrollAnimations();

  // Initialize carousel
  initCarousel();

  resetShowsAndAboutVisibility();
initAboutCountersObserver();

  // ✅ FIXED: Proper scroll listener (your file had a broken nested addEventListener)
  window.addEventListener('scroll', throttle(() => {
    handleNavbarScroll();
    updateActiveNavLink();
    updatePlaybarPosition();
  }, 100));

  // ✅ Proper resize listener for playbar (carousel has its own resize debounce inside initCarousel)
  window.addEventListener('resize', throttle(() => {
    syncPlaybarSafeArea();
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

  // Add shake animation CSS (for form error)
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
