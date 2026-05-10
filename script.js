// ============================================
// Dockit — Immersive Landing Page Scripts
// ============================================

document.addEventListener('DOMContentLoaded', () => {

  // ---------- 1. LOADER ----------
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('hidden'), 400);
  });
  // fallback
  setTimeout(() => loader.classList.add('hidden'), 3000);

  // ---------- 2. NAVBAR SCROLL ----------
  const navbar = document.getElementById('navbar');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    navbar.classList.toggle('scrolled', y > 60);
    lastScroll = y;
  });

  // ---------- 3. MOBILE HAMBURGER ----------
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.querySelector('.nav-links');

  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });

  // close on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('open'));
  });

  // ---------- 4. SMOOTH SCROLL FOR ANCHOR LINKS ----------
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ---------- 5. SCROLL REVEAL (Intersection Observer) ----------
  const revealEls = document.querySelectorAll('[data-reveal]');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.getAttribute('data-delay')) || 0;
        setTimeout(() => entry.target.classList.add('revealed'), delay);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));

  // ---------- 6. PARTICLE CANVAS ----------
  const canvas = document.getElementById('particle-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let w, h;
    let mouseX = -1000, mouseY = -1000;
    const MAX = 80;

    function resize() {
      const rect = canvas.parentElement.getBoundingClientRect();
      w = canvas.width = rect.width;
      h = canvas.height = rect.height;
    }

    class Particle {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.size = Math.random() * 2 + 1;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = (Math.random() - 0.5) * 0.3;
        this.opacity = Math.random() * 0.5 + 0.15;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // mouse interaction
        const dx = this.x - mouseX;
        const dy = this.y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          const force = (150 - dist) / 150;
          this.x += dx * force * 0.02;
          this.y += dy * force * 0.02;
        }

        if (this.x < 0 || this.x > w || this.y < 0 || this.y > h) {
          this.reset();
        }
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(162, 155, 254, ${this.opacity})`;
        ctx.fill();
      }
    }

    function initParticles() {
      particles = [];
      const count = Math.min(MAX, Math.floor((w * h) / 12000));
      for (let i = 0; i < count; i++) {
        particles.push(new Particle());
      }
    }

    function drawConnections() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(162, 155, 254, ${0.08 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
    }

    function animate() {
      ctx.clearRect(0, 0, w, h);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      drawConnections();
      requestAnimationFrame(animate);
    }

    canvas.addEventListener('mousemove', e => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    });

    canvas.addEventListener('mouseleave', () => {
      mouseX = -1000;
      mouseY = -1000;
    });

    // touch support
    canvas.addEventListener('touchmove', e => {
      const touch = e.touches[0];
      const rect = canvas.getBoundingClientRect();
      mouseX = touch.clientX - rect.left;
      mouseY = touch.clientY - rect.top;
    }, { passive: true });

    resize();
    initParticles();
    animate();
    window.addEventListener('resize', () => {
      resize();
      initParticles();
    });
  }

  // ---------- 7. 3D PHONE TILT ----------
  const phone = document.getElementById('phone3d');
  if (phone) {
    const hero = document.querySelector('.hero');

    hero.addEventListener('mousemove', e => {
      const rect = hero.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;

      const rotateY = (x - 0.5) * 30;
      const rotateX = (0.5 - y) * 25;
      const translateZ = 20;

      phone.style.transform = `rotateY(${rotateY}deg) rotateX(${rotateX}deg) translateZ(${translateZ}px)`;
    });

    hero.addEventListener('mouseleave', () => {
      phone.style.transform = 'rotateY(0deg) rotateX(0deg) translateZ(0)';
    });
  }

  // ---------- 8. PARALLAX ON SCROLL ----------
  const heroContent = document.querySelector('.hero-content');

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y < window.innerHeight) {
      const progress = y / window.innerHeight;
      heroContent.style.transform = `translateY(${progress * 30}px)`;
      heroContent.style.opacity = 1 - progress * 0.4;
    }
  }, { passive: true });

  // ---------- 10. COPY CHECKSUM ----------
  const copyBtn = document.getElementById('copy-checksum');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const codeBlock = copyBtn.parentElement.querySelector('code');
      const text = codeBlock ? codeBlock.textContent.trim() : '';
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
          const orig = copyBtn.textContent;
          copyBtn.textContent = 'Copied!';
          copyBtn.style.background = 'var(--accent2)';
          copyBtn.style.color = '#000';
          setTimeout(() => {
            copyBtn.textContent = orig;
            copyBtn.style.background = '';
            copyBtn.style.color = '';
          }, 1800);
        });
      }
    });
  }

  // ---------- 11. CURSOR GLOW ----------
  const glow = document.createElement('div');
  glow.className = 'cursor-glow';
  Object.assign(glow.style, {
    position: 'fixed',
    width: '300px',
    height: '300px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(108,92,231,0.06) 0%, transparent 70%)',
    pointerEvents: 'none',
    zIndex: '0',
    transform: 'translate(-50%, -50%)',
    transition: 'left 0.15s ease-out, top 0.15s ease-out',
  });
  document.body.appendChild(glow);

  document.addEventListener('mousemove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
  });

  // ---------- 12. REVEAL STAGGER FOR GRID ITEMS ----------
  document.querySelectorAll('.trust-grid, .download-cards').forEach(grid => {
    const children = grid.querySelectorAll(':scope > *');
    children.forEach((child, i) => {
      child.setAttribute('data-delay', (i * 100).toString());
      revealObserver.observe(child);
    });
  });

  document.querySelectorAll('.features-showcase > *').forEach((item, i) => {
    item.setAttribute('data-delay', (i * 80).toString());
    revealObserver.observe(item);
  });

  // re-observe elements that might have been removed
  revealEls.forEach(el => {
    if (!el.classList.contains('revealed')) {
      revealObserver.observe(el);
    }
  });

  // ---------- 13. FAQ ACCORDION ----------
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement;
      item.classList.toggle('open');
    });
  });

  console.log('%c◇ Dockit v1.2', 'font-size:20px; font-weight:800; color:#6c5ce7;');
  console.log('%cOpen source. Audited. Yours.', 'font-size:12px; color:#8888a0;');
});