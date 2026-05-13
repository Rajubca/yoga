document.addEventListener('DOMContentLoaded', () => {
    // Initialize AOS
    AOS.init({
        duration: 800,
        once: true,
        offset: 100

    // Search Filter Logic
    const searchInput = document.getElementById('yoga-search');
    const allCards = document.querySelectorAll('.yoga-card');

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();

            allCards.forEach(card => {
                const title = card.querySelector('h3').textContent.toLowerCase();
                const desc = card.querySelector('p').textContent.toLowerCase();

                if (title.includes(searchTerm) || desc.includes(searchTerm)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }

    // Back to Top Logic
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        });
    }
});




    // Subhashita Modal Logic (Show only once per session)
    const subhashitaModal = document.getElementById('subhashita-modal');
    const closeSubhashitaBtn = document.querySelector('.close-subhashita');

    if (subhashitaModal && closeSubhashitaBtn) {
        // Show it unconditionally on every page load as requested by user
        subhashitaModal.classList.add('active');
        document.body.style.overflow = 'hidden';

        const closeSubhashita = () => {
            subhashitaModal.classList.remove('active');
            document.body.style.overflow = 'auto';
            setTimeout(() => {
                subhashitaModal.style.display = 'none';
            }, 300);
        };

        closeSubhashitaBtn.addEventListener('click', closeSubhashita);
        subhashitaModal.addEventListener('click', (e) => {
            if (e.target === subhashitaModal) {
                closeSubhashita();
            }
        });
    }

    // Modal Logic


    const modalsData = window.yogaData || {};
    const cards = document.querySelectorAll('.yoga-card');
    const modalOverlay = document.getElementById('yoga-modal');
    const closeBtn = document.querySelector('.close-modal');

    const modalTitle = document.getElementById('modal-title');
    const modalImg = document.getElementById('modal-img');
    const modalDesc = document.getElementById('modal-desc');

    cards.forEach(card => {
        card.addEventListener('click', () => {
            const yogaId = card.getAttribute('data-id');
            const data = modalsData[yogaId];

            if (data) {
                modalTitle.textContent = data.name;
                modalImg.src = data.image_url;
                // Preserve formatting securely
                modalDesc.innerHTML = '';
                const parts = data.detailed_description.split(/\n/g);
                parts.forEach((part, index) => {
                    modalDesc.appendChild(document.createTextNode(part));
                    if (index < parts.length - 1) {
                        modalDesc.appendChild(document.createElement('br'));
                    }
                });

                modalOverlay.classList.add('active');
                document.body.style.overflow = 'hidden'; // Prevent scrolling
            }
        });
    });

    const closeModal = () => {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    };

    closeBtn.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });
});
