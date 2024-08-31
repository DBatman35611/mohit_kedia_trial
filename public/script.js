document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();

    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth'
      });
    }
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const contactButton = document.querySelector('.contact-button');

  // Updated to redirect to contact.html instead of scrolling to footer
  contactButton.addEventListener('click', () => {
    window.location.href = 'contact.html';
  });
});

function toggleMenu() {
  const header = document.querySelector('.header');
  header.classList.toggle('active');
}