// Mobile menu toggle
const menuToggle = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');

if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking backdrop
    mobileMenu.addEventListener('click', (e) => {
        if (e.target === mobileMenu) {
            mobileMenu.classList.remove('active');
        }
    });

    // Close mobile menu when clicking a link
    document.querySelectorAll('.mobile-nav a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
        });
    });
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Opportunity cards click to apply
document.querySelectorAll('.opportunity-card').forEach(card => {
    card.addEventListener('click', function() {
        // Scroll to contact form
        const contactSection = document.getElementById('contact');
        if (contactSection) {
            contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Partners Carousel
const partnersTrack = document.getElementById('partnersTrack');
const partnersPrev = document.getElementById('partnersPrev');
const partnersNext = document.getElementById('partnersNext');
const partnersDots = document.getElementById('partnersDots');
const partnerLogos = document.querySelectorAll('.partner-logo');

if (partnersTrack && partnersPrev && partnersNext && partnersDots) {
    let currentSlide = 0;
    let slidesPerView = getSlidesPerView();
    const totalSlides = partnerLogos.length;
    let maxSlide = totalSlides - slidesPerView;
    let autoScrollInterval;

    function getSlidesPerView() {
        if (window.innerWidth >= 1024) return 4;
        if (window.innerWidth >= 768) return 3;
        if (window.innerWidth >= 480) return 2;
        return 1;
    }

    function updateCarousel() {
        const slideWidth = 100 / slidesPerView;
        partnersTrack.style.transform = `translateX(-${currentSlide * slideWidth}%)`;
        updateDots();
        updateButtons();
    }

    function createDots() {
        partnersDots.innerHTML = '';
        for (let i = 0; i <= maxSlide; i++) {
            const dot = document.createElement('button');
            dot.classList.add('carousel-dot');
            if (i === currentSlide) dot.classList.add('active');
            dot.addEventListener('click', () => {
                currentSlide = i;
                updateCarousel();
                resetAutoScroll();
            });
            partnersDots.appendChild(dot);
        }
    }

    function updateDots() {
        const dots = partnersDots.querySelectorAll('.carousel-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }

    function updateButtons() {
        partnersPrev.disabled = currentSlide === 0;
        partnersNext.disabled = currentSlide >= maxSlide;
    }

    function nextSlide() {
        if (currentSlide < maxSlide) {
            currentSlide++;
        } else {
            currentSlide = 0;
        }
        updateCarousel();
    }

    function prevSlide() {
        if (currentSlide > 0) {
            currentSlide--;
            updateCarousel();
        }
    }

    function startAutoScroll() {
        autoScrollInterval = setInterval(() => {
            nextSlide();
        }, 3000);
    }

    function resetAutoScroll() {
        clearInterval(autoScrollInterval);
        startAutoScroll();
    }

    partnersPrev.addEventListener('click', () => {
        prevSlide();
        resetAutoScroll();
    });

    partnersNext.addEventListener('click', () => {
        if (currentSlide < maxSlide) {
            currentSlide++;
        } else {
            currentSlide = 0;
        }
        updateCarousel();
        resetAutoScroll();
    });

    window.addEventListener('resize', () => {
        const newSlidesPerView = getSlidesPerView();
        if (newSlidesPerView !== slidesPerView) {
            slidesPerView = newSlidesPerView;
            maxSlide = totalSlides - slidesPerView;
            currentSlide = Math.min(currentSlide, maxSlide);
            createDots();
            updateCarousel();
        }
    });

    createDots();
    updateCarousel();
    startAutoScroll();

    const partnersCarousel = document.getElementById('partnersCarousel');
    partnersCarousel.addEventListener('mouseenter', () => {
        clearInterval(autoScrollInterval);
    });

    partnersCarousel.addEventListener('mouseleave', () => {
        startAutoScroll();
    });
}

// Shipper/Broker button handlers
const shipperBtns = document.querySelectorAll('#shipperBtn, #shipperBtn2');
shipperBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // You can customize this - could open a modal, redirect, etc.
        alert('For Broker/Shipper inquiries, please call (267) 270-6626 or email operations@ottotransinc.com');
    });
});

// File upload display
const fileInput = document.getElementById('id_drivers_license');
const fileNameDisplay = document.getElementById('fileName');

if (fileInput && fileNameDisplay) {
    fileInput.addEventListener('change', function() {
        if (this.files && this.files.length > 0) {
            fileNameDisplay.textContent = this.files[0].name;
        } else {
            fileNameDisplay.textContent = 'No file chosen';
        }
    });
}