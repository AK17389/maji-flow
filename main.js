/* main.js — Maji-Flow client-side scripts */

document.addEventListener('DOMContentLoaded', function () {

  /* ── Smooth scroll for anchor links ── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ── Animate stat numbers on scroll ── */
  const counters = document.querySelectorAll('.big-num, .ch-num');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  counters.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(12px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
  });

  /* ── Animate chart bars on load ── */
  const bars = document.querySelectorAll('.chart-bar');
  bars.forEach((bar, i) => {
    const finalH = bar.style.height;
    bar.style.height = '0%';
    bar.style.transition = `height 0.6s ease ${i * 0.08}s`;
    setTimeout(() => { bar.style.height = finalH; }, 200);
  });

  /* ── Animate zone fill bars ── */
  const zoneFills = document.querySelectorAll('.zone-fill, .mb-fill');
  zoneFills.forEach((bar, i) => {
    const finalW = bar.style.width;
    bar.style.width = '0%';
    bar.style.transition = `width 0.7s ease ${i * 0.1}s`;
    setTimeout(() => { bar.style.width = finalW; }, 300);
  });

  /* ── Nav highlight on scroll ── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');
  if (sections.length && navLinks.length) {
    window.addEventListener('scroll', () => {
      let current = '';
      sections.forEach(section => {
        if (window.scrollY >= section.offsetTop - 80) {
          current = section.id;
        }
      });
      navLinks.forEach(link => {
        link.classList.remove('active-nav');
        if (link.href.includes(current)) {
          link.classList.add('active-nav');
        }
      });
    });
  }

  /* ── Flash message auto-dismiss ── */
  const flashBanners = document.querySelectorAll('.form-success-banner, .form-error-banner');
  flashBanners.forEach(banner => {
    setTimeout(() => {
      banner.style.transition = 'opacity 0.5s';
      banner.style.opacity = '0';
    }, 6000);
  });

});
