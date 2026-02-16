/* ============================================
   SaaSfolio — Core JavaScript
   Zero dependencies. Pure performance.
   ============================================ */

(function() {
  'use strict';

  // --- Scroll reveal ---
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  // --- Nav scroll state (supports both .nav and .navbar) ---
  const nav = document.querySelector('.nav') || document.querySelector('.navbar');
  if (nav) {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          nav.classList.toggle('scrolled', window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
    nav.classList.toggle('scrolled', window.scrollY > 20);
  }

  // --- Mobile menu (supports both conventions) ---
  const burger = document.querySelector('.nav-burger') || document.querySelector('.hamburger') || document.getElementById('burgerMenu');
  const mobileMenu = document.querySelector('.mobile-menu') || document.querySelector('.mobile-menu-overlay');
  if (burger && mobileMenu) {
    burger.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
      document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // --- FAQ accordion ---
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const wasOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
      if (!wasOpen) item.classList.add('open');
    });
  });

  // --- Tabs (supports .tab-btn, .tab-button, and data-tab/data-panel) ---
  document.querySelectorAll('.tab-btn, .tab-button').forEach(btn => {
    btn.addEventListener('click', () => {
      const group = btn.closest('.tabs-container') || btn.closest('.tabs-wrapper') || btn.closest('section') || document;
      const target = btn.dataset.tab;
      group.querySelectorAll('.tab-btn, .tab-button').forEach(b => b.classList.remove('active'));
      group.querySelectorAll('.tab-content, .tab-panel').forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      const panel = group.querySelector(`[data-panel="${target}"]`) || group.querySelector(`[data-tab-id="${target}"]`);
      if (panel) panel.classList.add('active');
    });
  });

  // --- Active nav link ---
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .nav-menu a').forEach(link => {
    const href = link.getAttribute('href');
    if (href && (href === currentPath || href === './' + currentPath)) {
      link.classList.add('active');
    }
  });

  // --- Smooth scroll for anchor links ---
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // --- Counter animation for stats ---
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const end = parseInt(el.dataset.count, 10);
          const prefix = el.dataset.prefix || '';
          const suffix = el.dataset.suffix || '';
          const duration = 1600;
          const start = performance.now();
          const animate = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = prefix + Math.round(end * eased).toLocaleString() + suffix;
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
          counterObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(c => counterObserver.observe(c));
  }

  // --- Blog filter (if present) ---
  document.querySelectorAll('.blog-filter-btn, .filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const category = btn.dataset.category || btn.textContent.trim();
      const container = btn.closest('section') || document;
      container.querySelectorAll('.blog-filter-btn, .filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      container.querySelectorAll('.blog-card').forEach(card => {
        if (category === 'All' || category === 'all') {
          card.style.display = '';
        } else {
          const cardCategory = card.dataset.category || '';
          card.style.display = cardCategory.includes(category) ? '' : 'none';
        }
      });
    });
  });

})();
