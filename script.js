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

// Stagger grid cards
function staggerObserve(selector) {
  document.querySelectorAll(selector).forEach((el, i) => {
    el.style.transitionDelay = (i * 90) + 'ms';
    animObs.observe(el);
  });
}
staggerObserve('.fcard');
staggerObserve('.wcard');
staggerObserve('.tcard');
staggerObserve('.step');

/* ================================================
   DEMO CAROUSEL
   ================================================ */
const TOTAL_STEPS = 7;
let currentStep = 0;

// Step → role mapping for the flow indicator
const stepRoles = ['client','client','client','admin','admin','courier','finish'];

const slides = document.querySelectorAll('.dc-slide');
const dots   = document.querySelectorAll('.dd');
const flowNodes = document.querySelectorAll('.df-node');

function showStep(idx) {
  idx = ((idx % TOTAL_STEPS) + TOTAL_STEPS) % TOTAL_STEPS;
  currentStep = idx;

  slides.forEach((s, i) => {
    s.classList.toggle('active', i === idx);
  });

  dots.forEach((d, i) => {
    d.classList.toggle('active', i === idx);
  });

  const role = stepRoles[idx];
  flowNodes.forEach(n => {
    n.classList.toggle('active', n.dataset.role === role);
  });
}

window.demoNav = function(dir) {
  showStep(currentStep + dir);
};

window.demoJump = function(idx) {
  showStep(idx);
};

// Touch / swipe support
let touchX = null;
const slidesCont = document.getElementById('demoSlides');
if (slidesCont) {
  slidesCont.addEventListener('touchstart', e => {
    touchX = e.touches[0].clientX;
  }, { passive: true });
  slidesCont.addEventListener('touchend', e => {
    if (touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 40) {
      showStep(currentStep + (dx < 0 ? 1 : -1));
    }
    touchX = null;
  }, { passive: true });
}

// Keyboard arrow support
document.addEventListener('keydown', e => {
  if (e.key === 'ArrowRight') showStep(currentStep + 1);
  if (e.key === 'ArrowLeft')  showStep(currentStep - 1);
});

// Initialize
showStep(0);

/* ================================================
   TARIFF TIER CHOOSER
   ================================================ */
const tierBtns   = document.querySelectorAll('.tier-btn');
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
