// Smooth JavaScript System - AmkyawDev EditorApp

class SmoothSystem {
    constructor() {
        this.isEnabled = true;
        this.transitions = [];
        this.init();
    }

    init() {
        this.setupSmoothScroll();
        this.setupAnimations();
        this.setupParallax();
        this.setupTouchGestures();
    }

    setupSmoothScroll() {
        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    this.smoothScrollTo(target);
                }
            });
        });
    }

    smoothScrollTo(target) {
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        const duration = 1000;
        let startTime = null;

        const animation = (currentTime) => {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = this.easeOutCubic(timeElapsed, startPosition, distance, duration);
            
            window.scrollTo(0, run);
            
            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            }
        };

        requestAnimationFrame(animation);
    }

    easeOutCubic(t, b, c, d) {
        t /= d;
        t--;
        return c * (t * t * t + 1) + b;
    }

    setupAnimations() {
        // Intersection Observer for scroll animations
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            observer.observe(el);
        });
    }

    setupParallax() {
        let ticking = false;

        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    this.updateParallax();
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    updateParallax() {
        const scrolled = window.pageYOffset;
        
        document.querySelectorAll('.parallax').forEach(el => {
            const speed = el.dataset.speed || 0.5;
            el.style.transform = `translateY(${scrolled * speed}px)`;
        });

        // Background parallax
        const bgAnimation = document.querySelector('.bg-animation');
        if (bgAnimation) {
            bgAnimation.style.transform = `translateY(${scrolled * 0.3}px)`;
        }
    }

    setupTouchGestures() {
        let touchStartX = 0;
        let touchStartY = 0;

        document.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        });

        document.addEventListener('touchend', (e) => {
            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;
            const deltaX = touchEndX - touchStartX;
            const deltaY = touchEndY - touchStartY;

            // Swipe detection
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
                if (deltaX > 0) {
                    this.triggerEvent('swipeRight');
                } else {
                    this.triggerEvent('swipeLeft');
                }
            }

            if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 50) {
                if (deltaY > 0) {
                    this.triggerEvent('swipeDown');
                } else {
                    this.triggerEvent('swipeUp');
                }
            }
        });
    }

    triggerEvent(eventName) {
        document.dispatchEvent(new CustomEvent(`smooth:${eventName}`));
    }

    // Add smooth transition to element
    smoothTransition(element, properties, duration = 300) {
        element.style.transition = Object.entries(properties)
            .map(([key, value]) => `${this.toCamelCase(key)} ${duration}ms ease`)
            .join(', ');
        
        Object.assign(element.style, properties);
    }

    toCamelCase(str) {
        return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
    }

    // Fade in element
    fadeIn(element, duration = 300) {
        element.style.opacity = 0;
        element.style.display = 'block';
        
        let opacity = 0;
        const fade = () => {
            opacity += 0.1;
            element.style.opacity = opacity;
            
            if (opacity < 1) {
                requestAnimationFrame(fade);
            }
        };
        
        fade();
    }

    // Fade out element
    fadeOut(element, duration = 300) {
        let opacity = 1;
        const fade = () => {
            opacity -= 0.1;
            element.style.opacity = opacity;
            
            if (opacity > 0) {
                requestAnimationFrame(fade);
            } else {
                element.style.display = 'none';
            }
        };
        
        fade();
    }

    // Slide element
    slide(element, direction = 'left', duration = 300) {
        const state = { opacity: 1, transform: 'translateX(0)' };
        
        if (direction === 'left') {
            state.transform = 'translateX(-100%)';
        } else if (direction === 'right') {
            state.transform = 'translateX(100%)';
        } else if (direction === 'up') {
            state.transform = 'translateY(-100%)';
        } else if (direction === 'down') {
            state.transform = 'translateY(100%)';
        }

        this.smoothTransition(element, { opacity: 0, transform: state.transform }, duration);
        
        setTimeout(() => {
            element.style.display = 'none';
            element.style.opacity = 1;
            element.style.transform = 'translateX(0)';
        }, duration);
    }

    // Enable/disable system
    toggle() {
        this.isEnabled = !this.isEnabled;
        return this.isEnabled;
    }
}

// Global instance
document.addEventListener('DOMContentLoaded', () => {
    window.smoothSystem = new SmoothSystem();
});

if (typeof module !== 'undefined' && module.exports) {
    module.exports = SmoothSystem;
}