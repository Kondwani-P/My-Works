document.addEventListener('DOMContentLoaded', () => {
  // Year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile nav toggle
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });
  }

  // Scroll reveal
  const revealables = document.querySelectorAll('.card, .section-header, .timeline .step, .highlight-inner, .cta-band');
  const markRevealClass = (el) => el.classList.add('reveal');
  revealables.forEach(markRevealClass);
  const io = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    }
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });
  revealables.forEach((el) => io.observe(el));

  // Template preview <-> description toggle
  const templatesGrid = document.getElementById('templatesGrid');
  if (templatesGrid) {
    templatesGrid.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-action="toggle"]');
      if (!btn) return;
      const card = btn.closest('.template-card');
      if (!card) return;
      const preview = card.querySelector('.preview');
      const description = card.querySelector('.description');
      if (!preview || !description) return;
      const showingPreview = description.hasAttribute('hidden');
      if (showingPreview) {
        description.removeAttribute('hidden');
        preview.setAttribute('hidden', '');
        btn.textContent = 'View preview';
      } else {
        preview.removeAttribute('hidden');
        description.setAttribute('hidden', '');
        btn.textContent = 'View description';
      }
    });
  }
  // Generate PNG preview for Ignite if needed
  const igniteImg = document.querySelector('img[data-generate="ignite-png"]');
  if (igniteImg) {
    try {
      const canvas = document.createElement('canvas');
      const width = 1200, height = 700;
      canvas.width = width; canvas.height = height;
      const ctx = canvas.getContext('2d');
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, '#0b0c0f');
      grad.addColorStop(1, '#1a1d22');
      ctx.fillStyle = grad; ctx.fillRect(0, 0, width, height);
      // Panel
      roundRect(ctx, 80, 80, 1040, 540, 20, '#0f1115', '#1b1f27');
      // Headline and lines
      ctx.fillStyle = '#c9cfd8'; roundRect(ctx, 120, 140, 520, 44, 8, '#c9cfd8');
      ctx.fillStyle = '#9aa3b2'; roundRect(ctx, 120, 200, 520, 18, 6, '#9aa3b2');
      roundRect(ctx, 120, 226, 420, 18, 6, '#9aa3b2');
      // Buttons
      const btnGrad = ctx.createLinearGradient(0, 264, 200, 312);
      btnGrad.addColorStop(0, '#f0f3f8'); btnGrad.addColorStop(1, '#c6ccd6');
      ctx.fillStyle = btnGrad; roundRect(ctx, 120, 264, 200, 48, 12, null, '#2a2e38');
      ctx.fillStyle = 'rgba(0,0,0,0)'; roundRect(ctx, 332, 264, 200, 48, 12, null, '#2a2e38');
      // Right art
      roundRect(ctx, 680, 140, 380, 320, 16, '#0a0b0d', '#1b1f27');
      ctx.fillStyle = 'rgba(255,255,255,0.1)'; ctx.beginPath(); ctx.arc(760, 200, 60, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = 'rgba(192,195,202,0.14)'; ctx.beginPath(); ctx.arc(960, 360, 50, 0, Math.PI*2); ctx.fill();
      // Cards
      roundRect(ctx, 120, 356, 300, 120, 14, '#0a0b0d', '#1b1f27');
      roundRect(ctx, 440, 356, 300, 120, 14, '#0a0b0d', '#1b1f27');
      roundRect(ctx, 120, 496, 300, 120, 14, '#0a0b0d', '#1b1f27');
      roundRect(ctx, 440, 496, 300, 120, 14, '#0a0b0d', '#1b1f27');
      igniteImg.src = canvas.toDataURL('image/png');
    } catch (e) {
      // Fallback to SVG if canvas blocked
      igniteImg.src = 'Templates/ignite/assets/img/ignite-preview-solid.svg';
    }
  }

  // Contact form demo handler (no backend attached yet)
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(contactForm);
      const name = formData.get('name') || 'there';
      alert(`Thanks, ${name}! I will reply within 24 hours with next steps.`);
      contactForm.reset();
    });
  }

  // Inject sticky mobile CTA on all pages except contact
  const isContact = document.body.classList.contains('page-contact');
  if (!isContact) {
    const mobileCta = document.createElement('div');
    mobileCta.className = 'mobile-cta';
    mobileCta.innerHTML = `
      <div class="inner">
        <div class="copy">Ready to grow? Get a free 15‑min audit.</div>
        <div class="actions">
          <a class="btn btn-ghost" href="templates.html">View templates</a>
          <a class="btn btn-primary" href="contact.html">Start now</a>
        </div>
      </div>
    `;
    document.body.appendChild(mobileCta);
  }

  // Avoid heavy work per scroll frame
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const scrolled = window.scrollY > 24;
        document.documentElement.classList.toggle('is-scrolling', scrolled);
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
});

// Helpers
function roundRect(ctx, x, y, w, h, r, fill, stroke) {
  const radius = typeof r === 'number' ? {tl:r,tr:r,br:r,bl:r} : r;
  ctx.beginPath();
  ctx.moveTo(x + radius.tl, y);
  ctx.lineTo(x + w - radius.tr, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + radius.tr);
  ctx.lineTo(x + w, y + h - radius.br);
  ctx.quadraticCurveTo(x + w, y + h, x + w - radius.br, y + h);
  ctx.lineTo(x + radius.bl, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - radius.bl);
  ctx.lineTo(x, y + radius.tl);
  ctx.quadraticCurveTo(x, y, x + radius.tl, y);
  ctx.closePath();
  if (fill) { ctx.fillStyle = fill; ctx.fill(); } else { ctx.fill(); }
  if (stroke) { ctx.strokeStyle = stroke; ctx.stroke(); }
}


