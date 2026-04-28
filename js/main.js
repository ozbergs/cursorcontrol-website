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

// Contact form — mailto fallback (no server-side needed for static hosting)
const form    = document.getElementById('contact-form');
const success = document.getElementById('form-success');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const name     = form.name.value.trim();
  const agency   = form.agency.value.trim();
  const email    = form.email.value.trim();
  const phone    = form.phone.value.trim();
  const interest = form.interest.value;
  const message  = form.message.value.trim();

  // Basic validation
  if (!name || !agency || !email) {
    const first = !name ? form.name : !agency ? form.agency : form.email;
    first.focus();
    first.style.borderColor = '#E53E3E';
    setTimeout(() => first.style.borderColor = '', 2000);
    return;
  }

  // Build mailto body
  const body = [
    `Name: ${name}`,
    `Agency: ${agency}`,
    `Email: ${email}`,
    phone    ? `Phone: ${phone}` : '',
    interest ? `Interest: ${interest}` : '',
    message  ? `\nMessage:\n${message}` : '',
  ].filter(Boolean).join('\n');

  const subject = encodeURIComponent(`CDM Inquiry — ${agency}`);
  const bodyEnc = encodeURIComponent(body);

  window.location.href = `mailto:info@cursorcontrol.com?subject=${subject}&body=${bodyEnc}`;

  // Show success message
  success.classList.add('visible');
  form.reset();

  // Hide success after 6s
  setTimeout(() => success.classList.remove('visible'), 6000);
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
