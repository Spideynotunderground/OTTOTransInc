// Mobile menu
const menuToggle = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');

if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
    });

    mobileMenu.addEventListener('click', (e) => {
        if (e.target === mobileMenu) {
            mobileMenu.classList.remove('active');
        }
    });

    document.querySelectorAll('.mobile-nav a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
        });
    });
}

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Opportunity cards
document.querySelectorAll('.opportunity-card').forEach(card => {
    card.addEventListener('click', function() {
        const contactSection = document.getElementById('contacts');
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

// File upload display
const fileInput = document.getElementById('id_drivers_license');
const fileLabel = document.getElementById('fileLabel');
const fileText = document.getElementById('fileText');

if (fileInput && fileLabel && fileText) {
    function truncateFileName(fileName, maxLength = 30) {
        if (fileName.length <= maxLength) return fileName;
        
        const extension = fileName.split('.').pop();
        const nameWithoutExt = fileName.substring(0, fileName.lastIndexOf('.'));
        const truncatedName = nameWithoutExt.substring(0, maxLength - 3 - (extension?.length || 0));
        
        return `${truncatedName}...${extension ? `.${extension}` : ''}`;
    }

    fileInput.addEventListener('change', function() {
        if (this.files && this.files.length > 0) {
            const fileName = this.files[0].name;
            const truncated = truncateFileName(fileName);
            fileText.innerHTML = `<span style="color: #2e7d32; font-weight: 600;">File selected: <strong>${truncated}</strong></span>`;
            fileLabel.classList.add('has-file');
        } else {
            fileText.textContent = "Upload Driver's License (photo)";
            fileLabel.classList.remove('has-file');
        }
    });
}

// Driver form submit
const driverForm = document.getElementById('driverForm');
const driverSubmitBtn = document.getElementById('driverSubmitBtn');

if (driverForm && driverSubmitBtn) {
    driverForm.addEventListener('submit', function(e) {
        driverSubmitBtn.disabled = true;
        driverSubmitBtn.textContent = 'Sending...';
    });
}

// Phone formatting
const phoneInputs = document.querySelectorAll('input[type="tel"]');
phoneInputs.forEach(phoneInput => {
    phoneInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 0) {
            if (value.length <= 3) {
                value = `(${value}`;
            } else if (value.length <= 6) {
                value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
            } else {
                value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
            }
        }
        e.target.value = value;
    });
});

// DATE RANGE PICKER - FLATPICKR
const frequencyInput = document.getElementById('frequency-date-range');
if (frequencyInput && typeof flatpickr !== 'undefined') {
    flatpickr(frequencyInput, {
        mode: 'range',
        dateFormat: 'm/d/Y',
        minDate: 'today',
        onChange: function(selectedDates, dateStr, instance) {
            // Update the input value with formatted date range
            if (selectedDates.length === 2) {
                const start = instance.formatDate(selectedDates[0], 'm/d/Y');
                const end = instance.formatDate(selectedDates[1], 'm/d/Y');
                frequencyInput.value = `${start} - ${end}`;
            }
        }
    });
}

// Shipper Modal
const shipperModal = document.getElementById('shipperModal');
const shipperBtns = document.querySelectorAll('#shipperBtn, #shipperBtn2');
const modalClose = document.getElementById('modalClose');
const modalOverlay = document.querySelector('.modal-overlay');
const shipperForm = document.getElementById('shipperForm');
const shipperSubmitBtn = document.getElementById('shipperSubmitBtn');
const modalMessage = document.getElementById('modalMessage');

// Open modal
shipperBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        shipperModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
});

// Close modal
function closeModal() {
    shipperModal.classList.remove('active');
    document.body.style.overflow = '';
    shipperForm.reset();
    modalMessage.style.display = 'none';
    document.querySelectorAll('.modal-error').forEach(error => {
        error.textContent = '';
    });
}

modalClose.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', closeModal);

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && shipperModal.classList.contains('active')) {
        closeModal();
    }
});

// Handle shipper form submission
shipperForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Clear errors
    document.querySelectorAll('.modal-error').forEach(error => {
        error.textContent = '';
    });
    modalMessage.style.display = 'none';
    
    shipperSubmitBtn.disabled = true;
    shipperSubmitBtn.textContent = 'Submitting...';
    
    const formData = new FormData(shipperForm);
    
    try {
        const response = await fetch(window.location.href, {
            method: 'POST',
            body: formData,
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        });
        
        const data = await response.json();
        
        if (data.success) {
            modalMessage.textContent = data.message || 'Request submitted successfully!';
            modalMessage.className = 'modal-message success';
            modalMessage.style.display = 'block';
            
            shipperForm.reset();
            
            setTimeout(() => {
                closeModal();
            }, 2000);
        } else {
            if (data.errors) {
                Object.keys(data.errors).forEach(field => {
                    const errorElement = document.getElementById(`error_${field}`);
                    if (errorElement) {
                        errorElement.textContent = data.errors[field];
                    }
                });
            }
            
            modalMessage.textContent = data.message || 'Please fix the errors below';
            modalMessage.className = 'modal-message error';
            modalMessage.style.display = 'block';
        }
    } catch (error) {
        console.error('Error:', error);
        modalMessage.textContent = 'An error occurred. Please try again.';
        modalMessage.className = 'modal-message error';
        modalMessage.style.display = 'block';
    } finally {
        shipperSubmitBtn.disabled = false;
        shipperSubmitBtn.textContent = 'Submit Request';
    }
});