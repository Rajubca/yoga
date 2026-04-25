document.addEventListener('DOMContentLoaded', () => {
    // Initialize AOS
    AOS.init({
        duration: 800,
        once: true,
        offset: 100
    });

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
                // Preserve formatting
                modalDesc.innerHTML = data.detailed_description.replace(/\n/g, '<br>');

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
