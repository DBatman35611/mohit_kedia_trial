document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();

    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth'
      });

      // Flash effect on footer-contact after scrolling to footer
      if (this.getAttribute('href') === '#footer') {
        const footerContact = document.querySelector('.footer-contact');

        // Function to check if an element is in viewport
        const isInViewport = elem => {
          const rect = elem.getBoundingClientRect();
          return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
          );
        };

        // Check if footer is in viewport after scrolling
        const checkFooterInView = () => {
          if (isInViewport(target)) {
            footerContact.style.backgroundColor = '#FCF7FF';

            // Flash duration in milliseconds (ms)
            const flashDuration = 300; // Adjust as needed

            setTimeout(() => {
              footerContact.style.backgroundColor = '#1f3695'; // Restore original color
            }, flashDuration);

            // Remove event listener after flashing once
            window.removeEventListener('scroll', checkFooterInView);
          }
        };

        // Add event listener to check when footer comes into view
        window.addEventListener('scroll', checkFooterInView);
      }
    }
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const contactButton = document.querySelector('.contact-button');
  const footerContact = document.querySelector('.footer-contact');

  contactButton.addEventListener('click', () => {
    footerContact.scrollIntoView({ behavior: 'smooth' });

    // Flash effect after scrolling to footer
    const flashDuration = 300; // Adjust as needed

    setTimeout(() => {
      footerContact.style.backgroundColor = '#FCF7FF';
    }, 0);

    setTimeout(() => {
      footerContact.style.backgroundColor = '#1f3695'; // Restore original color
    }, flashDuration);
  });
});

function toggleMenu() {
  const header = document.querySelector('.header');
  header.classList.toggle('active');
}
