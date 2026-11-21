/**
 * Sumit.Dev Developer Portfolio — Vanilla JavaScript Interactions
 * Pure ES6+ Vanilla JS (no external libraries or frameworks)
 */

document.addEventListener('DOMContentLoaded', () => {
  initAmbientWaveBackground();
  initResponsiveNav();
  initTypewriter();
  initSkillsSlideshow();
  initProjectCardFlips();
  initLightbox();
  initContactForm();
  initBackToTop();
  initActiveNavObserver();
  initScrollReveal();
  initCopyrightYear();
});

/* ==========================================================================
   0. Full-Page Ambient Sculpted Wave Ribbon Canvas (Video-Like Motion)
   ========================================================================== */
function initAmbientWaveBackground() {
  const canvas = document.getElementById('ambient-bg-canvas');
  if (!canvas || !canvas.getContext) return;

  const ctx = canvas.getContext('2d');
  const prefersReducedMotion =
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let width = 0;
  let height = 0;
  let dpr = 1;
  let time = 0;
  let rafId = 0;

  const resize = () => {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  const drawFrame = (t) => {
    // Pure obsidian black canvas base
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);

    // Draw overlapping flowing curved architectural wave ribbons
    const ribbonCount = 13;
    const stepX = Math.max(24, Math.floor(width / 38));

    for (let i = 0; i < ribbonCount; i += 1) {
      const progress = i / (ribbonCount - 1);
      const baseOffset = (progress - 0.15) * height * 1.15;
      const phase = t * (0.45 + progress * 0.16) + i * 0.58;
      const ampA = height * (0.14 + progress * 0.08);
      const ampB = height * (0.07 + (1 - progress) * 0.05);

      ctx.beginPath();
      for (let x = -40; x <= width + 60; x += stepX) {
        const nx = x / Math.max(width, 1);
        const curveSlope = Math.pow(nx, 1.35) * height * 0.42;
        const y =
          baseOffset -
          curveSlope +
          Math.sin(nx * 2.6 + phase) * ampA +
          Math.cos(nx * 4.2 - phase * 0.7) * ampB;

        if (x === -40) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }

      // Close ribbon polygon to bottom of viewport for smooth depth layering
      ctx.lineTo(width + 60, height + 60);
      ctx.lineTo(-40, height + 60);
      ctx.closePath();

      const grad = ctx.createLinearGradient(0, baseOffset - height * 0.4, width * 0.9, height);
      const lumA = Math.round(16 + progress * 16);
      const lumB = Math.round(5 + progress * 5);
      grad.addColorStop(0, `rgba(${lumA}, ${lumA}, ${lumA + 2}, 0.9)`);
      grad.addColorStop(0.38, `rgba(${lumB}, ${lumB}, ${lumB + 1}, 0.95)`);
      grad.addColorStop(1, 'rgba(0, 0, 0, 0.99)');

      ctx.fillStyle = grad;
      ctx.fill();

      // Subtle satin ridge highlight along the upper edge of each ribbon fold
      ctx.beginPath();
      for (let x = -40; x <= width + 60; x += stepX) {
        const nx = x / Math.max(width, 1);
        const curveSlope = Math.pow(nx, 1.35) * height * 0.42;
        const y =
          baseOffset -
          curveSlope +
          Math.sin(nx * 2.6 + phase) * ampA +
          Math.cos(nx * 4.2 - phase * 0.7) * ampB;
        if (x === -40) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = `rgba(255, 255, 255, ${0.03 + progress * 0.04})`;
      ctx.lineWidth = 1.1;
      ctx.stroke();
    }
  };

  const animate = () => {
    time += 0.008;
    drawFrame(time);
    rafId = window.requestAnimationFrame(animate);
  };

  resize();
  window.addEventListener('resize', () => {
    resize();
    if (prefersReducedMotion) drawFrame(time);
  });

  if (prefersReducedMotion) {
    drawFrame(0);
  } else {
    rafId = window.requestAnimationFrame(animate);
  }

  // Pause animation when browser tab is hidden to conserve battery
  document.addEventListener('visibilitychange', () => {
    if (prefersReducedMotion) return;
    if (document.hidden) {
      window.cancelAnimationFrame(rafId);
    } else {
      rafId = window.requestAnimationFrame(animate);
    }
  });
}

/* ==========================================================================
   1. Responsive Mobile Navigation Drawer
   ========================================================================== */
function initResponsiveNav() {
  const menuToggle = document.getElementById('menu-toggle');
  const drawer = document.getElementById('mobile-drawer');
  if (!menuToggle || !drawer) return;

  const setDrawerState = (open) => {
    menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (open) {
      drawer.removeAttribute('hidden');
    } else {
      drawer.setAttribute('hidden', '');
    }
  };

  menuToggle.addEventListener('click', () => {
    const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
    setDrawerState(!isExpanded);
  });

  drawer.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setDrawerState(false));
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
      setDrawerState(false);
      menuToggle.focus();
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 980 && !drawer.hasAttribute('hidden')) {
      setDrawerState(false);
    }
  });
}

/* ==========================================================================
   3. Navbar Typewriter Animation (Sumit static, .Dev animated)
   ========================================================================== */
function initTypewriter() {
  const target = document.getElementById('typewriter-text');
  if (!target) return;

  const prefersReducedMotion =
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const suffixes = ['.Dev', ' Patel'];
  if (prefersReducedMotion) {
    target.textContent = suffixes[0];
    return;
  }

  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  const tick = () => {
    const currentWord = suffixes[wordIndex];
    if (!isDeleting) {
      charIndex += 1;
      target.textContent = currentWord.slice(0, charIndex);
      if (charIndex === currentWord.length) {
        isDeleting = true;
        window.setTimeout(tick, 2200);
        return;
      }
      window.setTimeout(tick, 150);
    } else {
      charIndex -= 1;
      target.textContent = currentWord.slice(0, charIndex);
      if (charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % suffixes.length;
        window.setTimeout(tick, 420);
        return;
      }
      window.setTimeout(tick, 95);
    }
  };

  target.textContent = '';
  window.setTimeout(tick, 320);
}

/* ==========================================================================
   4. Technical Stack & Tools Continuous Slideshow
   ========================================================================== */
function initSkillsSlideshow() {
  const tracks = document.querySelectorAll('.marquee-track');

  // Seamlessly duplicate items for continuous infinite loop
  tracks.forEach((track) => {
    if (track.dataset.cloned === 'true') return;
    const children = Array.from(track.children);
    children.forEach((item) => {
      const clone = item.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      clone.setAttribute('tabindex', '-1');
      track.appendChild(clone);
    });
    track.dataset.cloned = 'true';
  });
}

/* ==========================================================================
   5. 3D Project Card Flip (Click/Tap & Keyboard Support)
   ========================================================================== */
function initProjectCardFlips() {
  const cards = document.querySelectorAll('.project-flip-card');

  cards.forEach((card) => {
    const toggleFlip = (forceState) => {
      const next =
        typeof forceState === 'boolean' ? forceState : !card.classList.contains('is-flipped');
      card.classList.toggle('is-flipped', next);
    };

    const detailsBtn = card.querySelector('.flip-trigger-btn');
    const backBtn = card.querySelector('.flip-back-btn');

    if (detailsBtn) {
      detailsBtn.addEventListener('click', (event) => {
        event.stopPropagation();
        toggleFlip(true);
      });
    }

    if (backBtn) {
      backBtn.addEventListener('click', (event) => {
        event.stopPropagation();
        toggleFlip(false);
      });
    }

    card.addEventListener('click', (event) => {
      if (event.target.closest('button')) return;
      toggleFlip();
    });

    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        if (event.target.closest('button')) return;
        event.preventDefault();
        toggleFlip();
      } else if (event.key === 'Escape' && card.classList.contains('is-flipped')) {
        toggleFlip(false);
      }
    });
  });
}

/* ==========================================================================
   6. Image Lightbox Preview Modal
   ========================================================================== */
function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  const backdrop = document.getElementById('lightbox-backdrop');
  const closeBtn = document.getElementById('lightbox-close');
  const prevBtn = document.getElementById('lightbox-prev');
  const nextBtn = document.getElementById('lightbox-next');
  const imgEl = document.getElementById('lightbox-image');
  const titleEl = document.getElementById('lightbox-title');
  const catEl = document.getElementById('lightbox-category');
  const descEl = document.getElementById('lightbox-desc');

  if (!lightbox || !imgEl || !titleEl || !catEl || !descEl) return;

  let activeTriggers = [];
  let currentIndex = 0;
  let lastFocusedEl = null;

  const getVisibleTriggers = (galleryName) => {
    return Array.from(
      document.querySelectorAll(`.showcase-card[data-gallery="${galleryName}"] .lightbox-trigger`)
    );
  };

  const renderSlide = (index) => {
    if (!activeTriggers.length) return;
    currentIndex = (index + activeTriggers.length) % activeTriggers.length;
    const trigger = activeTriggers[currentIndex];
    imgEl.src = trigger.dataset.src || '';
    imgEl.alt = trigger.querySelector('img')?.alt || trigger.dataset.title || 'Design preview';
    titleEl.textContent = trigger.dataset.title || '';
    catEl.textContent = trigger.dataset.category || '';
    descEl.textContent = trigger.dataset.desc || '';

    const hasMultiple = activeTriggers.length > 1;
    if (prevBtn) prevBtn.disabled = !hasMultiple;
    if (nextBtn) nextBtn.disabled = !hasMultiple;
  };

  const openLightbox = (trigger) => {
    const parentCard = trigger.closest('.showcase-card');
    const galleryName = parentCard ? parentCard.dataset.gallery : '';
    activeTriggers = galleryName
      ? getVisibleTriggers(galleryName)
      : Array.from(document.querySelectorAll('.lightbox-trigger'));

    const idx = activeTriggers.indexOf(trigger);
    lastFocusedEl = document.activeElement;
    renderSlide(idx >= 0 ? idx : 0);

    lightbox.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
    if (closeBtn) closeBtn.focus();
  };

  const closeLightbox = () => {
    lightbox.setAttribute('hidden', '');
    document.body.style.overflow = '';
    imgEl.src = '';
    if (lastFocusedEl && typeof lastFocusedEl.focus === 'function') {
      lastFocusedEl.focus();
    }
  };

  document.querySelectorAll('.lightbox-trigger').forEach((trigger) => {
    trigger.addEventListener('click', () => openLightbox(trigger));
  });

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (backdrop) backdrop.addEventListener('click', closeLightbox);
  if (prevBtn) prevBtn.addEventListener('click', () => renderSlide(currentIndex - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => renderSlide(currentIndex + 1));

  document.addEventListener('keydown', (event) => {
    if (lightbox.hasAttribute('hidden')) return;
    if (event.key === 'Escape') {
      closeLightbox();
    } else if (event.key === 'ArrowLeft') {
      renderSlide(currentIndex - 1);
    } else if (event.key === 'ArrowRight') {
      renderSlide(currentIndex + 1);
    }
  });
}

/* ==========================================================================
   8. Contact Form Validation & Honest Local Submission Feedback
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const subjectInput = document.getElementById('contact-subject');
  const messageInput = document.getElementById('contact-message');
  const feedbackEl = document.getElementById('form-feedback');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  const setFieldError = (input, errorId, message) => {
    const errEl = document.getElementById(errorId);
    if (message) {
      input.setAttribute('aria-invalid', 'true');
      if (errEl) errEl.textContent = message;
      return false;
    }
    input.removeAttribute('aria-invalid');
    if (errEl) errEl.textContent = '';
    return true;
  };

  const validateField = (field) => {
    const value = field.value.trim();
    if (field === nameInput) {
      return setFieldError(
        nameInput,
        'error-name',
        value.length < 2 ? 'Please enter your full name (at least 2 characters).' : ''
      );
    }
    if (field === emailInput) {
      return setFieldError(
        emailInput,
        'error-email',
        !emailRegex.test(value) ? 'Please enter a valid email address.' : ''
      );
    }
    if (field === subjectInput) {
      return setFieldError(
        subjectInput,
        'error-subject',
        value.length < 3 ? 'Please enter a brief subject (at least 3 characters).' : ''
      );
    }
    if (field === messageInput) {
      return setFieldError(
        messageInput,
        'error-message',
        value.length < 10 ? 'Please write a message of at least 10 characters.' : ''
      );
    }
    return true;
  };

  [nameInput, emailInput, subjectInput, messageInput].forEach((input) => {
    if (!input) return;
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => {
      if (input.getAttribute('aria-invalid') === 'true') {
        validateField(input);
      }
    });
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const validName = validateField(nameInput);
    const validEmail = validateField(emailInput);
    const validSubject = validateField(subjectInput);
    const validMessage = validateField(messageInput);

    if (!validName || !validEmail || !validSubject || !validMessage) {
      if (feedbackEl) {
        feedbackEl.hidden = false;
        feedbackEl.className = 'form-feedback is-error';
        feedbackEl.textContent = 'Please fix the highlighted fields above before submitting.';
      }
      return;
    }

    const senderName = nameInput.value.trim();

    if (feedbackEl) {
      feedbackEl.hidden = false;
      feedbackEl.className = 'form-feedback is-success';
      feedbackEl.innerHTML = '';

      const titleStrong = document.createElement('strong');
      titleStrong.textContent = `Message validated for ${senderName}.`;

      const noteP = document.createElement('p');
      noteP.style.marginTop = '0.35rem';
      noteP.textContent =
        'All fields passed client-side validation. Because this static portfolio is not connected to an email backend service, no email was sent automatically—please connect via GitHub or LinkedIn above.';

      feedbackEl.appendChild(titleStrong);
      feedbackEl.appendChild(noteP);
    }

    form.reset();
  });
}

/* ==========================================================================
   9. Back-to-Top Button
   ========================================================================== */
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ==========================================================================
   10. Active Navigation Indicator (Scroll Spy)
   ========================================================================== */
function initActiveNavObserver() {
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.nav-link[data-section]');
  if (!sections.length || !navLinks.length) return;

  const setActiveLink = (sectionId) => {
    navLinks.forEach((link) => {
      link.classList.toggle('active', link.dataset.section === sectionId);
    });
  };

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveLink(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-35% 0px -55% 0px',
        threshold: 0,
      }
    );

    sections.forEach((section) => observer.observe(section));
  }
}

/* ==========================================================================
   11. Subtle Section Scroll Reveal
   ========================================================================== */
function initScrollReveal() {
  const revealItems = document.querySelectorAll('[data-reveal]');
  if (!revealItems.length) return;

  if (!('IntersectionObserver' in window)) {
    revealItems.forEach((el) => el.classList.add('is-revealed'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
  );

  revealItems.forEach((item) => observer.observe(item));
}

/* ==========================================================================
   12. Dynamic Copyright Year
   ========================================================================== */
function initCopyrightYear() {
  const yearEl = document.getElementById('copyright-year');
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }
}
