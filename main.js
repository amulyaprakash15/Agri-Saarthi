// static/js/main.js

// ScrollReveal Animations
ScrollReveal().reveal('.reveal', {
  duration: 1000,
  origin: 'bottom',
  distance: '30px',
  reset: false
});
// JS for basic fade-in animation on scroll
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.card');
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, { threshold: 0.2 });

    cards.forEach(card => {
        observer.observe(card);
    });
});
