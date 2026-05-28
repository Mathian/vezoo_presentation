/* ================================================
   VEZOO — COMMERCIAL PROPOSAL  |  script.js
   ================================================ */

/* ---------- Telegram Web App ---------- */
if (window.Telegram && window.Telegram.WebApp) {
  const tg = window.Telegram.WebApp;
  tg.ready();
  tg.expand();
}

/* ---------- Scroll animations ---------- */
const animObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      animObs.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('[data-anim]').forEach((el, i) => {
  el.style.transitionDelay = (i * 60) + 'ms';
  animObs.observe(el);
});

function staggerObserve(selector) {
  document.querySelectorAll(selector).forEach((el, i) => {
    el.style.transitionDelay = (i * 90) + 'ms';
    animObs.observe(el);
  });
}
staggerObserve('.fcard');
staggerObserve('.wcard');
staggerObserve('.tcard');

/* ================================================
   DEMO CAROUSEL — manual navigation only
   ================================================ */
const TOTAL_STEPS = 7;
let currentStep = 0;
let transitioning = false;

const stepRoles = ['client','client','client','admin','admin','courier','finish'];

const slides    = document.querySelectorAll('.dc-slide');
const dots      = document.querySelectorAll('.dd');
const flowNodes = document.querySelectorAll('.df-node');

function showStep(idx, dir) {
  if (transitioning) return;

  idx = ((idx % TOTAL_STEPS) + TOTAL_STEPS) % TOTAL_STEPS;
  if (idx === currentStep) return;

  /* Determine slide direction if not provided */
  if (dir === undefined) {
    const diff = idx - currentStep;
    const wrap = Math.abs(diff) > TOTAL_STEPS / 2;
    dir = wrap ? (diff < 0 ? 1 : -1) : (diff > 0 ? 1 : -1);
  }

  transitioning = true;
  const prev = currentStep;
  currentStep = idx;

  const prevSlide = slides[prev];
  const nextSlide = slides[idx];

  /* ── Exit outgoing slide ── */
  prevSlide.style.transition = 'opacity .38s ease, transform .38s ease';
  prevSlide.style.opacity    = '0';
  prevSlide.style.transform  = `translateX(${dir > 0 ? -48 : 48}px)`;
  prevSlide.classList.remove('active');

  /* ── Position incoming slide off-screen instantly ── */
  nextSlide.style.transition = 'none';
  nextSlide.style.opacity    = '0';
  nextSlide.style.transform  = `translateX(${dir > 0 ? 48 : -48}px)`;

  /* Force reflow so the browser registers the starting position */
  nextSlide.getBoundingClientRect();

  /* ── Animate incoming slide to centre ── */
  nextSlide.style.transition = 'opacity .38s ease, transform .38s ease';
  nextSlide.style.opacity    = '';
  nextSlide.style.transform  = '';
  nextSlide.classList.add('active');

  /* ── Update dots & role indicator ── */
  dots.forEach((d, i) => d.classList.toggle('active', i === idx));
  const role = stepRoles[idx];
  flowNodes.forEach(n => n.classList.toggle('active', n.dataset.role === role));

  /* ── Cleanup after transition ── */
  setTimeout(() => {
    prevSlide.style.transition = '';
    prevSlide.style.opacity    = '';
    prevSlide.style.transform  = '';
    transitioning = false;
  }, 420);
}

window.demoNav = function(d) {
  showStep(currentStep + d, d > 0 ? 1 : -1);
};

window.demoJump = function(idx) {
  showStep(idx);
};

/* Touch / swipe support */
let touchX = null;
const slidesCont = document.getElementById('demoSlides');
if (slidesCont) {
  slidesCont.addEventListener('touchstart', e => {
    touchX = e.touches[0].clientX;
  }, { passive: true });
  slidesCont.addEventListener('touchend', e => {
    if (touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 44) {
      showStep(currentStep + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
    }
    touchX = null;
  }, { passive: true });
}

/* Keyboard arrow support */
document.addEventListener('keydown', e => {
  if (e.key === 'ArrowRight') showStep(currentStep + 1, 1);
  if (e.key === 'ArrowLeft')  showStep(currentStep - 1, -1);
});

/* Initialize — slide 0 is already active in HTML; just sync dots & flow */
dots.forEach((d, i) => d.classList.toggle('active', i === 0));
flowNodes.forEach(n => n.classList.toggle('active', n.dataset.role === stepRoles[0]));

/* ================================================
   TARIFF TIER CHOOSER
   ================================================ */
const tierBtns    = document.querySelectorAll('.tier-btn');
const tierPriceEl = document.getElementById('tierPrice');
const tierRangeEl = document.getElementById('tierRange');

tierBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    tierBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    if (tierPriceEl) {
      tierPriceEl.style.cssText = 'transform:scale(.88);opacity:0;transition:transform .18s ease,opacity .18s ease';
      setTimeout(() => {
        tierPriceEl.textContent = btn.dataset.p + ' ₸';
        tierPriceEl.style.cssText = 'transform:scale(1);opacity:1;transition:transform .22s ease,opacity .22s ease';
      }, 180);
    }
    if (tierRangeEl) {
      tierRangeEl.textContent = btn.dataset.d + ' доставок включено';
    }
  });
});

/* ================================================
   SMOOTH SCROLL
   ================================================ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 40;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});
