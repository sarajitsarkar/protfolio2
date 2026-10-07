/**
 * SARJIT SARKAR — PORTFOLIO  |  script.js
 * Navbar · Typing effect · Scroll reveal · Active nav · Mobile menu
 */

'use strict';

/* ═══════════════════════════════════════════════════════════════
   NAVBAR — scroll state & active link tracking
   ═══════════════════════════════════════════════════════════════ */
(function initNavbar() {
  const navbar   = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-links a');

  // Add scrolled class for background blur
  function onScroll() {
    if (window.scrollY > 24) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    updateActiveLink();
  }

  // Highlight the nav link whose section is currently in view
  function updateActiveLink() {
    const sections = document.querySelectorAll('section[id]');
    let currentId = '';

    sections.forEach(section => {
      const top    = section.getBoundingClientRect().top;
      const height = section.offsetHeight;
      if (top <= 80 && top + height > 80) {
        currentId = section.id;
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();


/* ═══════════════════════════════════════════════════════════════
   MOBILE HAMBURGER MENU
   ═══════════════════════════════════════════════════════════════ */
(function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  const navbar    = document.getElementById('navbar');

  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close menu when a nav link is clicked
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // Close on outside click
  document.addEventListener('click', e => {
    if (navbar && !navbar.contains(e.target) && navLinks.classList.contains('open')) {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });
})();


/* ═══════════════════════════════════════════════════════════════
   TYPING EFFECT — hero role line
   ═══════════════════════════════════════════════════════════════ */
(function initTypingEffect() {
  const el = document.getElementById('typed-text');
  if (!el) return;

  const strings = [
    'Final-Year B.Tech CSE Student',
    'Full-Stack Developer (Learning)',
    'AI/ML Enthusiast',
    'Problem Solver',
  ];

  let stringIndex  = 0;
  let charIndex    = 0;
  let isDeleting   = false;
  let pauseFrames  = 0;

  const TYPE_SPEED   = 65;    // ms per character when typing
  const DELETE_SPEED = 35;    // ms per character when deleting
  const PAUSE_AFTER  = 1800;  // ms pause at full string
  const PAUSE_EMPTY  = 400;   // ms pause at empty string

  function tick() {
    const current = strings[stringIndex];

    if (!isDeleting && charIndex <= current.length) {
      el.textContent = current.slice(0, charIndex);
      charIndex++;

      if (charIndex > current.length) {
        // Finished typing — pause before deleting
        setTimeout(tick, PAUSE_AFTER);
        return;
      }
      setTimeout(tick, TYPE_SPEED);

    } else if (isDeleting && charIndex >= 0) {
      el.textContent = current.slice(0, charIndex);
      charIndex--;

      if (charIndex < 0) {
        // Finished deleting — move to next string
        isDeleting = false;
        stringIndex = (stringIndex + 1) % strings.length;
        setTimeout(tick, PAUSE_EMPTY);
        return;
      }
      setTimeout(tick, DELETE_SPEED);

    } else {
      isDeleting = !isDeleting;
      setTimeout(tick, isDeleting ? 0 : PAUSE_AFTER);
    }
  }

  // Slight start delay for page load feel
  setTimeout(tick, 600);
})();


/* ═══════════════════════════════════════════════════════════════
   SCROLL REVEAL — Intersection Observer
   ═══════════════════════════════════════════════════════════════ */
(function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal');

  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Unobserve after reveal so it doesn't reset
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  // Stagger children inside grid/timeline parents for a cascade effect
  const staggerParents = document.querySelectorAll(
    '.skills-grid, .projects-grid, .cert-grid, .timeline, .about-grid, .contact-grid'
  );

  staggerParents.forEach(parent => {
    const children = parent.querySelectorAll('.reveal');
    children.forEach((child, i) => {
      child.style.transitionDelay = `${i * 80}ms`;
    });
  });

  elements.forEach(el => observer.observe(el));
})();


/* ═══════════════════════════════════════════════════════════════
   SMOOTH SCROLL — handle anchor links
   ═══════════════════════════════════════════════════════════════ */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
})();


/* ═══════════════════════════════════════════════════════════════
   CONTACT FORM — graceful mailto fallback
   ═══════════════════════════════════════════════════════════════ */
(function initContactForm() {
  const form = document.querySelector('.contact-form');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    // If action is still a placeholder, prevent broken mailto
    const action = form.getAttribute('action');
    if (!action || action.includes('[EMAIL]')) {
      e.preventDefault();
      alert('Please update the email address in index.html before using the contact form.');
    }
    // Otherwise let the browser handle the mailto: action
  });
})();


/* ═══════════════════════════════════════════════════════════════
   DARK / LIGHT THEME TOGGLE
   ═══════════════════════════════════════════════════════════════ */
(function initThemeToggle() {
  const btn  = document.getElementById('themeToggle');
  const root = document.documentElement;

  if (!btn) return;

  function applyTheme(theme) {
    if (theme === 'light') {
      root.setAttribute('data-theme', 'light');
    } else {
      root.removeAttribute('data-theme');
    }
    try { localStorage.setItem('theme', theme); } catch (e) {}
  }

  btn.addEventListener('click', () => {
    const current = root.getAttribute('data-theme');
    applyTheme(current === 'light' ? 'dark' : 'light');
  });
})();

