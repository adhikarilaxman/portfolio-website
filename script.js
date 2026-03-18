// Theme Toggle Functionality
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

// Check for saved theme preference or default to light mode
const currentTheme = localStorage.getItem('theme') || 'light';

if (currentTheme === 'dark') {
    body.classList.add('dark-mode');
    themeToggle.querySelector('i').classList.remove('fa-moon');
    themeToggle.querySelector('i').classList.add('fa-sun');
}

themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    
    const icon = themeToggle.querySelector('i');
    if (body.classList.contains('dark-mode')) {
        localStorage.setItem('theme', 'dark');
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        localStorage.setItem('theme', 'light');
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
});

// Navigation and Section Switching
const navLinks = document.querySelectorAll('.nav-link');
const pageSections = document.querySelectorAll('.page-section');
const logoLink = document.querySelector('.logo-link');

// Typewriter headings mapping
const typewriterMap = {
    '#home': document.getElementById('aboutHeading'),
    '#resume': document.getElementById('resumeHeading'),
    '#work': document.getElementById('portfolioHeading'),
    '#contact': document.getElementById('contactHeading')
};
const typedHeadings = new Set();

function startTypewriterFor(targetId) {
    const heading = typewriterMap[targetId];
    if (!heading || typedHeadings.has(targetId)) return;

    const fullText = heading.textContent.trim();
    heading.textContent = '';

    let index = 0;
    const speed = 80; // ms per character

    const intervalId = setInterval(() => {
        heading.textContent = fullText.slice(0, index + 1);
        index++;

        if (index >= fullText.length) {
            clearInterval(intervalId);
            heading.classList.add('finished');
            typedHeadings.add(targetId);
        }
    }, speed);
}

// Function to switch sections
function switchSection(targetId) {
    // Hide all sections
    pageSections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Show target section
    const targetSection = document.querySelector(targetId);
    if (targetSection) {
        targetSection.classList.add('active');
    }

    // Trigger typewriter for the section's heading
    startTypewriterFor(targetId);
    
    // Update active nav link
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === targetId) {
            link.classList.add('active');
        }
    });
}

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        
        const targetId = link.getAttribute('href');
        if (targetId && targetId !== '#') {
            switchSection(targetId);
        }
    });
});

// Logo click behavior - go to Home, reload if already there
if (logoLink) {
    logoLink.addEventListener('click', (e) => {
        e.preventDefault();

        if (window.location.hash === '#home' || window.location.hash === '') {
            // Already on home - reload full page
            window.location.reload();
        } else {
            // Navigate to home section without full reload
            switchSection('#home');
            window.location.hash = '#home';
        }
    });
}

// Download Resume Button
const downloadBtn = document.querySelector('.download-btn');

if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
        // Open resume PDF in a new tab
        window.open('My Resume 1.pdf', '_blank', 'noopener');
    });
}

// Portfolio Filter Functionality
const filterButtons = document.querySelectorAll('.filter-btn');
const portfolioItems = document.querySelectorAll('.portfolio-item');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        
        // Add active class to clicked button
        button.classList.add('active');
        
        // Get filter value
        const filterValue = button.getAttribute('data-filter');
        
        // Filter portfolio items
        portfolioItems.forEach(item => {
            if (filterValue === 'all') {
                item.classList.remove('hidden');
            } else {
                const itemCategory = item.getAttribute('data-category');
                if (itemCategory === filterValue) {
                    item.classList.remove('hidden');
                } else {
                    item.classList.add('hidden');
                }
            }
        });
    });
});

// Weather App project card - choose Live or GitHub
const weatherAppCard = document.getElementById('weatherAppCard');

if (weatherAppCard) {
    const liveUrl = 'https://adhikarilaxman.github.io/Weather-App/';
    const githubUrl = 'https://github.com/adhikarilaxman/Weather-App?tab=readme-ov-file';

    const openWeatherAppLink = (target) => {
        const url = target === 'live' ? liveUrl : githubUrl;
        window.open(url, '_blank', 'noopener');
    };

    const handleWeatherAppClick = () => {
        const goLive = confirm(
            'Weather App\n\nClick "OK" to view the live project.\nClick "Cancel" to view the GitHub repository.'
        );
        if (goLive) {
            openWeatherAppLink('live');
        } else {
            openWeatherAppLink('github');
        }
    };

    weatherAppCard.addEventListener('click', handleWeatherAppClick);
    weatherAppCard.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            handleWeatherAppClick();
        }
    });
}

// Contact Form: sends to adhikarilaxman441@gmail.com
// Option A (current): uses mailto – opens visitor's email client with your address and their message.
// Option B: for in-inbox delivery without opening an app, add your Formspree form ID below and use Formspree.
const CONTACT_EMAIL = 'adhikarilaxman441@gmail.com';
const FORMSPREE_FORM_ID = 'YOUR_FORMSPREE_FORM_ID'; // Optional: set this after creating a form at https://formspree.io

const contactForm = document.getElementById('contactForm');
const formFeedback = document.getElementById('formFeedback');
const submitBtn = document.getElementById('submitBtn');

function setFeedback(message, isError = false) {
    if (!formFeedback) return;
    formFeedback.textContent = message;
    formFeedback.className = 'form-feedback ' + (isError ? 'form-feedback-error' : 'form-feedback-success');
    formFeedback.style.display = 'block';
}

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();

        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';
        }

        // Use Formspree if configured
        if (FORMSPREE_FORM_ID && FORMSPREE_FORM_ID !== 'YOUR_FORMSPREE_FORM_ID') {
            setFeedback('Sending your message...');
            try {
                const res = await fetch('https://formspree.io/f/' + FORMSPREE_FORM_ID, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, message })
                });
                if (res.ok) {
                    setFeedback("Thank you! I'll get back to you soon.");
                    contactForm.reset();
                } else {
                    const data = await res.json().catch(() => ({}));
                    setFeedback(data.error || 'Something went wrong. Please try again or email me directly.', true);
                }
            } catch (err) {
                setFeedback('Network error. Please check your connection and try again.', true);
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Send message';
                }
            }
            return;
        }

        // Fallback: open mailto so the message goes to your email
        const subject = encodeURIComponent('Portfolio contact from ' + (name || 'Someone'));
        const body = encodeURIComponent(
            (name ? 'Name: ' + name + '\n' : '') +
            (email ? 'Email: ' + email + '\n\n' : '') +
            'Message:\n' + (message || '(No message)')
        );
        window.location.href = 'mailto:' + CONTACT_EMAIL + '?subject=' + subject + '&body=' + body;

        setFeedback("Thank you! Your email client should open with the message ready to send.");
        contactForm.reset();
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send message';
        }
    });
}

// Initialize page on load
window.addEventListener('DOMContentLoaded', () => {
    // Check for hash in URL
    if (window.location.hash) {
        const hash = window.location.hash;
        switchSection(hash);
        startTypewriterFor(hash);
    } else {
        // Default to home section
        switchSection('#home');
        startTypewriterFor('#home');
    }
});

