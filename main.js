/**
 * Caprecon International Development Foundation
 * Main JavaScript File
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
    
    // Initialize all components
    initMobileMenu();
    initScrollReveal();
    initStatsCounter();
    initSlider();
    initTabs();
    initScrollTop();
    initHeaderScroll();
    initDonationForm();
    initVolunteerForm();
    initNewsletterForm();
    initCategoryFilter();
});

function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileMenuClose = document.getElementById('mobileMenuClose');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
        
        mobileMenuClose.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
        
        const mobileNavLinks = mobileMenu.querySelectorAll('.mobile-nav-link');
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }
}

function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    revealElements.forEach(el => {
        revealObserver.observe(el);
    });
}

function initStatsCounter() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.dataset.target);
                animateCounter(entry.target, target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5
    });
    
    statNumbers.forEach(stat => {
        counterObserver.observe(stat);
    });
}

function animateCounter(element, target) {
    const duration = 2000;
    const start = 0;
    const startTime = performance.now();
    
    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(start + (target - start) * easeOut);
        
        element.textContent = current;
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    }
    
    requestAnimationFrame(updateCounter);
}

function initSlider() {
    const slider = document.querySelector('.vision-mission-slider');
    if (!slider) return;
    
    const images = slider.querySelectorAll('.slider-img');
    const prevBtn = slider.querySelector('.slider-prev');
    const nextBtn = slider.querySelector('.slider-next');
    
    if (images.length === 0) return;
    
    let currentIndex = 0;
    let autoSlideInterval;
    
    function showImage(index) {
        images.forEach((img, i) => {
            img.classList.toggle('active', i === index);
        });
    }
    
    function nextImage() {
        currentIndex = (currentIndex + 1) % images.length;
        showImage(currentIndex);
    }
    
    function prevImage() {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        showImage(currentIndex);
    }
    
    function startAutoSlide() {
        autoSlideInterval = setInterval(nextImage, 5000);
    }
    
    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
    }
    
    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            stopAutoSlide();
            prevImage();
            startAutoSlide();
        });
        
        nextBtn.addEventListener('click', () => {
            stopAutoSlide();
            nextImage();
            startAutoSlide();
        });
    }
    
    startAutoSlide();
}

function initTabs() {
    const tabsContainer = document.querySelector('.tabs');
    if (!tabsContainer) return;
    
    const tabBtns = tabsContainer.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.dataset.tab;
            
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanels.forEach(p => p.classList.remove('active'));
            
            btn.classList.add('active');
            const panel = document.getElementById(tabId);
            if (panel) {
                panel.classList.add('active');
            }
        });
    });
}

function initScrollTop() {
    const scrollTopBtn = document.getElementById('scrollTop');
    if (!scrollTopBtn) return;
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });
    
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

function initHeaderScroll() {
    const header = document.getElementById('header');
    if (!header) return;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 50) {
            header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.05)';
        }
    });
}

function initDonationForm() {
    const donationForm = document.getElementById('donationForm');
    if (!donationForm) return;
    
    const amountBtns = donationForm.querySelectorAll('.amount-btn');
    const customAmount = document.getElementById('customAmount');
    
    amountBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            amountBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            customAmount.value = '';
        });
    });
    
    customAmount.addEventListener('focus', () => {
        amountBtns.forEach(b => b.classList.remove('active'));
    });
    
    donationForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        let amount = customAmount.value;
        if (!amount) {
            const activeBtn = donationForm.querySelector('.amount-btn.active');
            if (activeBtn) {
                amount = activeBtn.dataset.amount;
            }
        }
        
        if (amount) {
            alert('Thank you for your donation of £' + amount + '! You will be redirected to our secure payment gateway.');
        } else {
            alert('Please select or enter a donation amount.');
        }
    });
}

function initVolunteerForm() {
    const volunteerForm = document.getElementById('volunteerForm');
    if (!volunteerForm) return;
    
    volunteerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const submitBtn = volunteerForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Submitting...';
        
        setTimeout(() => {
            alert('Thank you for your application! We will review your submission and get back to you within 5 business days.');
            volunteerForm.reset();
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }, 2000);
    });
}

function initNewsletterForm() {
    const newsletterForm = document.getElementById('newsletterForm');
    if (!newsletterForm) return;
    
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const email = newsletterForm.querySelector('input[type="email"]').value;
        
        alert('Thank you for subscribing! Updates will be sent to ' + email);
        newsletterForm.reset();
    });
}

function initCategoryFilter() {
    const categoryBtns = document.querySelectorAll('.category-btn');
    const newsCards = document.querySelectorAll('.news-card');
    
    if (categoryBtns.length === 0) return;
    
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.dataset.category;
            
            categoryBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            newsCards.forEach(card => {
                if (category === 'all' || card.dataset.category === category) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        
        if (target) {
            const headerHeight = document.getElementById('header').offsetHeight;
            const targetPosition = target.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});
