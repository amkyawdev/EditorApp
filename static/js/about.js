// About Page JavaScript - AmkyawDev EditorApp

class AboutPage {
    constructor() {
        this.stats = {
            projects: 150,
            users: 2500,
            commits: 5000,
            rating: 4.9
        };
        this.skills = [
            { name: 'HTML', icon: '🌐', level: 95 },
            { name: 'CSS', icon: '🎨', level: 90 },
            { name: 'JavaScript', icon: '⚡', level: 92 },
            { name: 'Python', icon: '🐍', level: 88 },
            { name: 'React', icon: '⚛️', level: 85 },
            { name: 'Node.js', icon: '🟢', level: 87 },
            { name: 'Flask', icon: '🍶', level: 80 },
            { name: 'Docker', icon: '🐳', level: 75 }
        ];
        this.init();
    }

    init() {
        this.renderStats();
        this.renderSkills();
        this.initAnimations();
        this.initTimeline();
    }

    renderStats() {
        const statsContainer = document.querySelector('.stats');
        if (!statsContainer) return;

        statsContainer.innerHTML = Object.entries(this.stats).map(([key, value]) => `
            <div class="stat-card">
                <div class="stat-number">${value.toLocaleString()}${key === 'rating' ? '★' : '+'}</div>
                <div class="stat-label">${this.formatStatLabel(key)}</div>
            </div>
        `).join('');
    }

    formatStatLabel(key) {
        const labels = {
            projects: 'Projects Built',
            users: 'Active Users',
            commits: 'Git Commits',
            rating: 'App Rating'
        };
        return labels[key] || key;
    }

    renderSkills() {
        const skillsGrid = document.querySelector('.skills-grid');
        if (!skillsGrid) return;

        skillsGrid.innerHTML = this.skills.map(skill => `
            <div class="skill-item">
                <div class="skill-icon">${skill.icon}</div>
                <div class="skill-name">${skill.name}</div>
            </div>
        `).join('');
    }

    initAnimations() {
        // Animate stats on scroll
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateStats();
                }
            });
        }, { threshold: 0.5 });

        const statsSection = document.querySelector('.stats');
        if (statsSection) {
            statsObserver.observe(statsSection);
        }
    }

    animateStats() {
        const statNumbers = document.querySelectorAll('.stat-number');
        
        statNumbers.forEach(stat => {
            const text = stat.textContent;
            const num = parseFloat(text.replace(/[^0-9.]/g, ''));
            const suffix = text.replace(/[0-9.]/g, '');
            
            if (!isNaN(num)) {
                let current = 0;
                const increment = num / 30;
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= num) {
                        current = num;
                        clearInterval(timer);
                    }
                    stat.textContent = Math.floor(current).toLocaleString() + suffix;
                }, 50);
            }
        });
    }

    initTimeline() {
        const timelineData = [
            { year: '2024', title: 'Started Development', desc: 'Began building the EditorApp from scratch' },
            { year: '2024', title: 'First Release', desc: 'Launched v1.0 with basic editor features' },
            { year: '2025', title: 'Major Update', desc: 'Added advanced editing capabilities' },
            { year: '2025', title: 'Mobile Support', desc: 'Fully responsive mobile webapp' },
            { year: '2026', title: 'Current Version', desc: 'Smooth system & beautiful UI' }
        ];

        const timeline = document.querySelector('.timeline');
        if (!timeline) return;

        timeline.innerHTML = timelineData.map(item => `
            <div class="timeline-item">
                <div class="timeline-content">
                    <div class="timeline-year">${item.year}</div>
                    <div class="timeline-title">${item.title}</div>
                    <div class="timeline-desc">${item.desc}</div>
                </div>
                <div class="timeline-dot"></div>
            </div>
        `).join('');
    }

    // Contact form handling
    async sendContactMessage(message) {
        console.log('📨 Contact message:', message);
        return { success: true, message: 'Message sent!' };
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    window.aboutPage = new AboutPage();
});

if (typeof module !== 'undefined' && module.exports) {
    module.exports = AboutPage;
}