/* Cursor Control — main.js */

// Sticky nav shadow on scroll
const header = document.getElementById('site-header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 10);
}, { passive: true });

// Mobile nav toggle
const navToggle = document.getElementById('nav-toggle');
const navLinks  = document.getElementById('nav-links');

navToggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(open));
});

// Close mobile nav on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// Contact form — Netlify Forms submission
const form    = document.getElementById('contact-form');
const success = document.getElementById('form-success');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const name   = form.querySelector('#name').value.trim();
  const agency = form.querySelector('#agency').value.trim();
  const email  = form.querySelector('#email').value.trim();

  // Basic validation
  if (!name || !agency || !email) {
    const first = !name ? form.querySelector('#name') : !agency ? form.querySelector('#agency') : form.querySelector('#email');
    first.focus();
    first.style.borderColor = '#E53E3E';
    setTimeout(() => first.style.borderColor = '', 2000);
    return;
  }

  // Submit to Netlify
  const data = new FormData(form);
  fetch('/', { method: 'POST', body: data })
    .then(() => {
      success.classList.add('visible');
      form.reset();
      setTimeout(() => success.classList.remove('visible'), 6000);
    })
    .catch(() => {
      // Fallback to mailto if fetch fails
      window.location.href = `mailto:info@cursorcontrol.com?subject=${encodeURIComponent('CDM Pro Inquiry — ' + agency)}`;
    });
});

// Smooth-scroll offset for fixed nav
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = header.offsetHeight + 16;
    const top    = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// Fade-in on scroll for cards
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll(
  '.value-card, .feature-card, .who-card, .step, .reason, .delivery-card'
).forEach(el => {
  el.style.opacity    = '0';
  el.style.transform  = 'translateY(20px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  observer.observe(el);
});

// Add visible class style
const style = document.createElement('style');
style.textContent = `.visible { opacity: 1 !important; transform: translateY(0) !important; }`;
document.head.appendChild(style);
