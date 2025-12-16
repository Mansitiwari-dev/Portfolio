// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      window.scrollTo({
        top: target.offsetTop - 80,
        behavior: 'smooth'
      });
    }
  });
});

// Add animation on scroll
const animateOnScroll = () => {
  const elements = document.querySelectorAll('.animate-on-scroll');
  
  elements.forEach(element => {
    const elementPosition = element.getBoundingClientRect().top;
    const screenPosition = window.innerHeight / 1.3;
    
    if (elementPosition < screenPosition) {
      element.classList.add('animate-fade-in-up');
    }
  });
};

window.addEventListener('scroll', animateOnScroll);

// Initial check
document.addEventListener('DOMContentLoaded', () => {
  animateOnScroll();
  
  // Add animation class to elements
  document.querySelectorAll('.skill-card, .project-card, .about-content, .about-image').forEach((el, index) => {
    el.classList.add('animate-on-scroll');
    el.style.animationDelay = `${index * 0.1}s`;
  });
});