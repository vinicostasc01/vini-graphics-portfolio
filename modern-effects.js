const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function initLenis() {
  const Lenis = window.Lenis;
  if (prefersReducedMotion || !Lenis) return;

  const lenis = new Lenis({
    duration: 1.15,
    smoothWheel: true,
    wheelMultiplier: 0.9,
    touchMultiplier: 1.2,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (event) => {
      const target = anchor.getAttribute('href');
      if (!target || target === '#') return;
      const node = document.querySelector(target);
      if (!node) return;
      event.preventDefault();
      lenis.scrollTo(node, { offset: -72 });
    });
  });
}

function initSpotlights() {
  const targets = document.querySelectorAll('.service-card, .proj-cat-card, .arte-card, .contact-link, .behance-link');

  targets.forEach((target) => {
    target.addEventListener('pointermove', (event) => {
      const rect = target.getBoundingClientRect();
      target.style.setProperty('--mx', `${event.clientX - rect.left}px`);
      target.style.setProperty('--my', `${event.clientY - rect.top}px`);
    });
  });
}

function initIconMotion() {
  const serviceIcons = document.querySelectorAll('.service-icon svg');
  const arrowIcons = document.querySelectorAll('.contact-link-arrow svg, .proj-cat-arrow svg, .carousel-btn svg');

  if (!window.gsap || prefersReducedMotion) {
    document.documentElement.classList.add('modern-ready');
    return;
  }

  serviceIcons.forEach((icon, index) => {
    gsap.fromTo(
      icon,
      { rotate: -18, scale: 0.78, opacity: 0 },
      {
        rotate: 0,
        scale: 1,
        opacity: 1,
        duration: 0.85,
        delay: index * 0.08,
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: icon.closest('.service-card'),
          start: 'top 84%',
        },
      },
    );
  });

  arrowIcons.forEach((icon) => {
    const host = icon.closest('a, button, .proj-cat-card');
    if (!host) return;

    host.addEventListener('mouseenter', () => {
      gsap.to(icon, { x: 2, y: -2, rotate: 8, duration: 0.22, ease: 'power2.out' });
    });

    host.addEventListener('mouseleave', () => {
      gsap.to(icon, { x: 0, y: 0, rotate: 0, duration: 0.32, ease: 'power3.out' });
    });
  });

  gsap.utils.toArray('.service-card').forEach((card, index) => {
    gsap.from(card, {
      y: 34,
      opacity: 0,
      duration: 0.75,
      delay: index * 0.08,
      ease: 'power3.out',
      scrollTrigger: { trigger: card, start: 'top 86%' },
    });
  });

  document.documentElement.classList.add('modern-ready');
}

function initModernNav() {
  const nav = document.getElementById('mainNav');
  if (!nav) return;

  const update = () => {
    nav.classList.toggle('modern-nav-compact', window.scrollY > 24);
  };

  update();
  window.addEventListener('scroll', update, { passive: true });
}

function initHeroDepth() {
  const hero = document.querySelector('.hero');
  if (!hero || prefersReducedMotion || !window.matchMedia('(pointer:fine)').matches) return;

  hero.addEventListener('pointermove', (event) => {
    const rect = hero.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    hero.style.setProperty('--heroX', x.toFixed(3));
    hero.style.setProperty('--heroY', y.toFixed(3));
  });
}

function initProgressBar() {
  const bar = document.createElement('div');
  bar.className = 'scroll-progress';
  document.body.appendChild(bar);

  const update = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const progress = max > 0 ? window.scrollY / max : 0;
    bar.style.transform = `scaleX(${progress})`;
  };

  update();
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
}

initLenis();
initSpotlights();
initIconMotion();
initModernNav();
initHeroDepth();
initProgressBar();
