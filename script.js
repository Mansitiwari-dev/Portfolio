/**
 * Main Portfolio Script
 * Handles Animations, Navbar state, and GitHub Repository Fetching
 */

document.addEventListener('DOMContentLoaded', () => {
    
  // 1. Navbar Glass Effect on Scroll
  const navbar = document.querySelector('.glass-nav');
  const navLinks = document.querySelectorAll('.nav-link');
  
  window.addEventListener('scroll', () => {
      if (!navbar) return;

      if (window.scrollY > 50) {
          navbar.style.background = 'rgba(10, 10, 10, 0.85)';
          navbar.style.backdropFilter = 'blur(16px)';
          navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.5)';
      } else {
          navbar.style.background = 'rgba(10, 10, 10, 0.5)';
          navbar.style.backdropFilter = 'blur(12px)';
          navbar.style.boxShadow = 'none';
      }

      // Active link switching based on scroll position
      let current = '';
      const sections = document.querySelectorAll('section');
      if (!sections.length) return;

      sections.forEach(section => {
          const sectionTop = section.offsetTop;
          if (window.pageYOffset >= sectionTop - 150) {
              current = section.getAttribute('id');
          }
      });

      if (!current) return;

      navLinks.forEach(link => {
          link.classList.remove('active');
          const href = link.getAttribute('href') || '';
          if (href === `#${current}`) {
              link.classList.add('active');
          }
      });
  });

  // 2. Intersection Observer for Scroll Animations
  const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.15
  };

  const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
          if (entry.isIntersecting) {
              entry.target.classList.add('active');
              // Unobserve after animating once to improve performance
              observer.unobserve(entry.target);
          }
      });
  }, observerOptions);

  const revealElements = document.querySelectorAll('.reveal');
  revealElements.forEach(el => observer.observe(el));

  // 3. Smooth Scrolling for internal links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
          const href = this.getAttribute('href');
          if (!href || href === '#') return;

          e.preventDefault();
          const targetElement = document.querySelector(href);
          if (targetElement) {
              window.scrollTo({
                  top: targetElement.offsetTop - 70, // offset for fixed navbar
                  behavior: 'smooth'
              });
              
              // Close mobile navbar if open
              const navCollapse = document.getElementById('navMenu');
              if (navCollapse && navCollapse.classList.contains('show')) {
                  const toggler = document.querySelector('.navbar-toggler');
                  if (toggler) toggler.click();
              }
          }
      });
  });

  // 4. GitHub API integration for Projects
  const fetchGitHubProjects = async () => {
      const username = 'Mansitiwari-dev';
      const container = document.getElementById('github-projects');
      
      try {
          const res = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`);
          if (!res.ok) throw new Error('Network response was not ok');
          
          const repos = await res.json();
          container.innerHTML = ''; // Clear loading spinner
          
          const publicRepos = repos.filter(repo => !repo.fork);
          if (!publicRepos.length) {
              container.innerHTML = `<div class="col-12 text-center text-muted"><p>No public non-fork repositories found. Check GitHub profile.</p></div>`;
              return;
          }

          publicRepos.slice(0, 6).forEach((repo, index) => {
              const delayClass = `delay-${(index % 3) * 100}`;
              
              // Beautiful Glassmorphism card for projects
              const cardHTML = `
                  <div class="col-md-6 col-lg-4 reveal active ${delayClass}">
                      <div class="glass-card h-100 d-flex flex-column p-0" style="padding-bottom: 1.5rem !important;">
                          <div class="project-image-container m-3">
                              <img src="https://raw.githubusercontent.com/${username}/${repo.name}/main/screenshot.png" 
                                   alt="${repo.name}" 
                                   onerror="this.src='https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'"
                              >
                              <div class="position-absolute top-0 end-0 m-2">
                                  <span class="badge bg-primary rounded-pill px-3 py-2 shadow"><i class="fa-solid fa-code me-1"></i> ${repo.language || 'Code'}</span>
                              </div>
                          </div>
                          <div class="px-4 flex-grow-1 d-flex flex-column">
                              <h4 class="brand-text text-white mb-2 fw-bold text-truncate" title="${repo.name}">
                                  ${repo.name.replace(/-/g, ' ')}
                              </h4>
                              <p class="text-muted small mb-4 flex-grow-1" style="display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">
                                  ${repo.description || 'A unique project exploring modern development techniques and solutions.'}
                              </p>
                              <div class="d-flex gap-2 mt-auto">
                                  <a href="${repo.html_url}" target="_blank" class="btn-premium btn-outline-glass flex-fill text-center p-2 rounded-3 text-white text-decoration-none small">
                                      <i class="fab fa-github me-1"></i> Repository
                                  </a>
                                  ${repo.homepage && repo.homepage !== "" ? `
                                  <a href="${repo.homepage}" target="_blank" class="btn-premium btn-primary-gradient flex-fill text-center p-2 rounded-3 text-white text-decoration-none small">
                                      <i class="fa-solid fa-arrow-up-right-from-square me-1"></i> Live Demo
                                  </a>` : ''}
                              </div>
                          </div>
                      </div>
                  </div>
              `;
              container.insertAdjacentHTML('beforeend', cardHTML);
          });

      } catch (error) {
          console.error('Error fetching repo:', error);
          container.innerHTML = `
              <div class="col-12 text-center text-muted">
                  <i class="fa-solid fa-triangle-exclamation fs-1 mb-3 text-warning"></i>
                  <p>Could not load projects dynamically. Please visit my GitHub directly.</p>
              </div>`;
      }
  };

  fetchGitHubProjects();
});