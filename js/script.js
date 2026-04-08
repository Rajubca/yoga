document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize AOS
    AOS.init({
        duration: 800,
        once: true,
        offset: 100
    });

    // 2. Sticky Header
    const header = document.getElementById('main-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 3. Mobile Menu Toggle
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            navLinks.classList.toggle('show');
        });
    }

    // 4. Background Music Toggle
    const musicToggle = document.getElementById('music-toggle');
    const bgMusic = document.getElementById('bg-music');
    let isPlaying = false;

    if (musicToggle && bgMusic) {
        musicToggle.addEventListener('click', () => {
            if (isPlaying) {
                bgMusic.pause();
                musicToggle.classList.remove('playing');
                musicToggle.innerHTML = '<i class="fas fa-music"></i>';
            } else {
                // Handle autoplay restrictions by requiring user interaction first
                bgMusic.play().then(() => {
                    musicToggle.classList.add('playing');
                    musicToggle.innerHTML = '<i class="fas fa-pause"></i>';
                }).catch(e => {
                    console.log("Audio play failed, user interaction required.", e);
                });
            }
            isPlaying = !isPlaying;
        });
    }

    // 5. Daily Quotes
    const quotes = [
        "Yoga is the journey of the self, through the self, to the self.",
        "Yoga does not just change the way we see things, it transforms the person who sees.",
        "Inhale the future, exhale the past.",
        "The pose begins when you want to leave it.",
        "Yoga is a light, which once lit will never dim. The better your practice, the brighter your flame."
    ];

    const quoteEl = document.getElementById('daily-quote-text');
    if (quoteEl) {
        // Change quote based on day of year to keep it consistent for the day
        const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
        quoteEl.textContent = `"${quotes[dayOfYear % quotes.length]}"`;
    }

    // 6. AJAX Page Loading Logic
    const contentArea = document.getElementById('app-content');

    async function loadPage(pageName) {
        // Show loader
        contentArea.innerHTML = '<div id="loader"><div class="spinner"></div><p>Loading...</p></div>';
        document.getElementById('loader').style.display = 'block';

        try {
            const response = await fetch(`pages/${pageName}.html`);
            if (!response.ok) throw new Error('Page not found');
            const html = await response.text();

            // Safely parse and append content to avoid XSS warnings from linters
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            // Clear current content securely
            contentArea.textContent = '';

            // Append all nodes from the parsed document body
            while (doc.body.firstChild) {
                contentArea.appendChild(doc.body.firstChild);
            }

            // Re-initialize scripts specific to new content
            AOS.refresh();
            initPageSpecificScripts(pageName);

            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });

            // Close mobile menu if open
            if (navLinks.classList.contains('show')) {
                navLinks.classList.remove('show');
            }

            // Update active state in nav
            document.querySelectorAll('.ajax-link').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('data-target') === pageName) {
                    link.classList.add('active');
                }
            });

        } catch (error) {
            contentArea.innerHTML = `
                <section class="container" style="text-align: center; padding: 100px 0;">
                    <h2>Content Loading Error</h2>
                    <p>Sorry, we couldn't load the requested content. Please try again.</p>
                </section>
            `;
            console.error('Error loading page:', error);
        }
    }

    // Handle Link Clicks
    document.addEventListener('click', (e) => {
        const link = e.target.closest('.ajax-link');
        if (link) {
            e.preventDefault();
            const target = link.getAttribute('data-target');

            // Push state to history
            const urlParams = target === 'home' ? '' : `?page=${target}`;
            history.pushState({ page: target }, '', window.location.pathname + urlParams);

            loadPage(target);
        }
    });

    // Handle Back/Forward buttons
    window.addEventListener('popstate', (e) => {
        const target = e.state ? e.state.page : 'home';
        loadPage(target);
    });

    // Initial Load based on path
    const urlParams = new URLSearchParams(window.location.search);
    const pageParam = urlParams.get('page');
    const initialPage = pageParam || 'home';
    loadPage(initialPage);
});

// Function to initialize logic specific to newly loaded fragments
function initPageSpecificScripts(pageName) {
    if (pageName === 'home') {
        // Animate counters
        const counters = document.querySelectorAll('.counter-number');
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const duration = 2000;
            const increment = target / (duration / 16); // 60fps

            let current = 0;
            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    counter.innerText = Math.ceil(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.innerText = target + "+";
                }
            };

            // Simple intersection observer to start when visible
            const observer = new IntersectionObserver((entries) => {
                if(entries[0].isIntersecting) {
                    updateCounter();
                    observer.disconnect();
                }
            });
            observer.observe(counter);
        });
    }

    if (pageName === 'contact') {
        // Initialize Contact Form AJAX
        const form = document.getElementById('ajax-contact-form');
        const msgContainer = document.getElementById('form-message');

        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                const submitBtn = form.querySelector('button[type="submit"]');
                const originalText = submitBtn.innerText;
                submitBtn.innerText = 'Sending...';
                submitBtn.disabled = true;

                try {
                    const formData = new FormData(form);
                    const response = await fetch('contact.php', {
                        method: 'POST',
                        body: formData
                    });

                    const result = await response.json();

                    if (result.status === 'success') {
                        msgContainer.innerHTML = "";
                        const div = document.createElement("div");
                        div.className = "alert success";
                        div.innerHTML = "<i class=\"fas fa-check-circle\"></i> ";
                        div.appendChild(document.createTextNode(result.message));
                        msgContainer.appendChild(div);
                        form.reset();
                    } else {
                        msgContainer.innerHTML = "";
                        const div = document.createElement("div");
                        div.className = "alert error";
                        div.innerHTML = "<i class=\"fas fa-exclamation-circle\"></i> ";
                        div.appendChild(document.createTextNode(result.message));
                        msgContainer.appendChild(div);
                    }
                } catch (error) {
                    msgContainer.innerHTML = "";
                    const div = document.createElement("div");
                    div.className = "alert error";
                    div.innerHTML = "<i class=\"fas fa-exclamation-circle\"></i> An error occurred. Please try again.";
                    msgContainer.appendChild(div);
                } finally {
                    submitBtn.innerText = originalText;
                    submitBtn.disabled = false;
                    // Auto clear message after 5 seconds
                    setTimeout(() => { msgContainer.innerHTML = ''; }, 5000);
                }
            });
        }
    }
}
