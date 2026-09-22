/**
 * Portfolio — navbar, scroll reveal, GitHub projects, contact → WhatsApp
 */

const escapeHtml = (str) => {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
};

const safeHttpUrl = (raw) => {
  if (!raw || typeof raw !== 'string') return '';
  const t = raw.trim();
  try {
    const u = new URL(t);
    if (u.protocol !== 'http:' && u.protocol !== 'https:') return '';
    return u.href;
  } catch {
    return '';
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const navbar = document.querySelector('.glass-nav');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    if (!navbar) return;

    if (window.scrollY > 50) {
      navbar.style.background = 'rgba(255, 255, 255, 0.98)';
      navbar.style.backdropFilter = 'blur(12px)';
      navbar.style.boxShadow = '0 1px 0 rgba(15, 23, 42, 0.08)';
    } else {
      navbar.style.background = 'rgba(255, 255, 255, 0.92)';
      navbar.style.backdropFilter = 'blur(10px)';
      navbar.style.boxShadow = 'none';
    }

    let current = '';
    document.querySelectorAll('section').forEach((section) => {
      const id = section.getAttribute('id');
      if (!id) return;
      if (window.pageYOffset >= section.offsetTop - 150) {
        current = id;
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      const href = link.getAttribute('href') || '';
      if (current && href === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  const observerOptions = { root: null, rootMargin: '0px', threshold: 0.12 };
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        obs.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (!href || href === '#') return;

      e.preventDefault();
      const targetElement = document.querySelector(href);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 70,
          behavior: 'smooth',
        });
        const navCollapse = document.getElementById('navMenu');
        if (navCollapse && navCollapse.classList.contains('show')) {
          const toggler = document.querySelector('.navbar-toggler');
          if (toggler) toggler.click();
        }
      }
    });
  });

  const GITHUB_USER = 'Mansitiwari-dev';
  const PLACEHOLDER_IMG =
    'https://placehold.co/800x400/f1f5f9/64748b?text=Repository';

  const fetchGitHubProjects = async () => {
    const container = document.getElementById('github-projects');
    if (!container) return;

    try {
      const res = await fetch(
        `https://api.github.com/users/${GITHUB_USER}/repos?sort=updated&per_page=12&type=owner`
      );
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error('GitHub API error:', res.status, errorText);
        throw new Error(`GitHub API returned ${res.status}: ${errorText}`);
      }

      const repos = await res.json();
      const publicRepos = repos.filter((repo) => !repo.fork);
      container.innerHTML = '';

      if (!publicRepos.length) {
        container.innerHTML = `
          <div class="col-12 text-center text-muted py-4">
            <p class="mb-0">No public repositories found. View <a href="https://github.com/${GITHUB_USER}" target="_blank" rel="noopener noreferrer">GitHub</a>.</p>
          </div>`;
        return;
      }

      const shown = publicRepos.slice(0, 9);
      shown.forEach((repo, index) => {
        const delayClass = `delay-${(index % 3) * 100}`;
        const title = escapeHtml(repo.name.replace(/-/g, ' '));
        const desc = escapeHtml(
          repo.description || 'Source code and README on GitHub.'
        );
        const lang = escapeHtml(repo.language || 'Repo');
        const screenshotUrl = `https://raw.githubusercontent.com/${GITHUB_USER}/${repo.name}/main/screenshot.png`;
        const demoUrl = safeHttpUrl(repo.homepage);
        const homepage = demoUrl
          ? `<a href="${escapeHtml(demoUrl)}" target="_blank" rel="noopener noreferrer" class="btn text-decoration-none btn-project-outline"><i class="fa-solid fa-arrow-up-right-from-square me-1 small"></i>Live demo</a>`
          : '';

        const cardHTML = `
          <div class="col-md-6 col-lg-4 reveal active ${delayClass}">
            <article class="glass-card h-100 d-flex flex-column p-0 overflow-hidden" style="padding-bottom: 0 !important;">
              <div class="project-image-container m-3 mb-0 position-relative">
                <img src="${screenshotUrl}" alt=""
                  onerror="this.onerror=null;this.src='${PLACEHOLDER_IMG}'">
                <div class="position-absolute top-0 end-0 m-2">
                  <span class="badge rounded-pill px-2 py-1 small fw-semibold" style="background: var(--bg-elevated); color: var(--accent); border: 1px solid var(--border);">${lang}</span>
                </div>
              </div>
              <div class="p-4 pt-3 flex-grow-1 d-flex flex-column">
                <h3 class="project-card-title text-truncate" title="${title}">${title}</h3>
                <p class="text-muted small mb-3 flex-grow-1" style="display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">${desc}</p>
                <div class="d-flex flex-wrap gap-2 mt-auto">
                  <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="btn text-decoration-none btn-project-primary">
                    <i class="fab fa-github me-1 small"></i>Repository
                  </a>
                  ${homepage}
                </div>
              </div>
            </article>
          </div>`;
        container.insertAdjacentHTML('beforeend', cardHTML);
      });
    } catch (err) {
      console.error('GitHub projects fetch error:', err);
      container.innerHTML = `
        <div class="col-12 text-center text-muted py-4">
          <p class="mb-2">Could not load projects from GitHub. <small class="text-muted d-block mt-1">${err.message}</small></p>
          <a href="https://github.com/${GITHUB_USER}?tab=repositories" target="_blank" rel="noopener noreferrer" class="btn btn-project-primary btn-sm">View all repositories on GitHub</a>
        </div>`;
    }
  };

  fetchGitHubProjects();

  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contact-name')?.value.trim() || '';
      const email =
        document.getElementById('contact-email')?.value.trim() || '';
      const subject =
        document.getElementById('contact-subject')?.value.trim() || '';
      const message =
        document.getElementById('contact-message')?.value.trim() || '';
      const phone = '917499828906';
      const lines = [
        'Portfolio contact',
        '',
        `Name: ${name}`,
        `Email: ${email}`,
        `Subject: ${subject}`,
        '',
        message,
      ];
      const url = `https://wa.me/${phone}?text=${encodeURIComponent(lines.join('\n'))}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    });
  }
});
