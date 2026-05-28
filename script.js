/* ================================================
   VEZOO — COMMERCIAL PROPOSAL  |  script.js
   ================================================ */

/* ---------- Telegram Web App ---------- */
if (window.Telegram && window.Telegram.WebApp) {
  const tg = window.Telegram.WebApp;
  tg.ready();
  tg.expand();
}

/* ---------- Navigation ---------- */
const nav = document.getElementById('nav');
const navBurger = document.getElementById('navBurger');
const navMobile = document.getElementById('navMobile');

window.addEventListener('scroll', () => {
  nav.classList.toggle('solid', window.scrollY > 40);
}, { passive: true });

navBurger.addEventListener('click', () => {
  navMobile.classList.toggle('open');
});
navMobile.querySelectorAll('.nm-link').forEach(l => {
  l.addEventListener('click', () => navMobile.classList.remove('open'));
});

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
let demoTimer = null;
const AUTO_INTERVAL = 4200;

// Step → role mapping for the flow indicator
const stepRoles = ['client','client','client','admin','admin','courier','finish'];

const slides = document.querySelectorAll('.dc-slide');
const dots   = document.querySelectorAll('.dd');
const flowNodes = document.querySelectorAll('.df-node');

function showStep(idx, animate = true) {
  // Clamp
  idx = ((idx % TOTAL_STEPS) + TOTAL_STEPS) % TOTAL_STEPS;
  const prev = currentStep;
  currentStep = idx;

  // Slides
  slides.forEach((s, i) => {
    s.classList.toggle('active', i === idx);
  });

  // Dots
  dots.forEach((d, i) => {
    d.classList.toggle('active', i === idx);
  });

  // Role flow indicator
  const role = stepRoles[idx];
  flowNodes.forEach(n => {
    n.classList.toggle('active', n.dataset.role === role);
  });

  // Step-specific side effects
  if (idx === 2) {
    // Slide 3: show success toast after a delay
    setTimeout(() => {
      const t = document.getElementById('s3toast');
      if (t) t.classList.add('show');
    }, 900);
  } else {
    const t = document.getElementById('s3toast');
    if (t) t.classList.remove('show');
  }
}

window.demoNav = function(dir) {
  stopTimer();
  showStep(currentStep + dir);
  startTimer();
};

window.demoJump = function(idx) {
  stopTimer();
  showStep(idx);
  startTimer();
};

function startTimer() {
  stopTimer();
  demoTimer = setInterval(() => showStep(currentStep + 1), AUTO_INTERVAL);
}
function stopTimer() {
  if (demoTimer) { clearInterval(demoTimer); demoTimer = null; }
}

// Pause on hover
const demoCW = document.querySelector('.demo-cw');
if (demoCW) {
  demoCW.addEventListener('mouseenter', stopTimer);
  demoCW.addEventListener('mouseleave', startTimer);
}

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
      stopTimer();
      showStep(currentStep + (dx < 0 ? 1 : -1));
      startTimer();
    }
    touchX = null;
  }, { passive: true });
}

// Auto-start when demo section enters viewport
const demoSection = document.getElementById('demo');
if (demoSection) {
  const demoObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        showStep(0, false);
        setTimeout(startTimer, 800);
        demoObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.25 });
  demoObs.observe(demoSection);
}

// Keyboard arrow support
document.addEventListener('keydown', e => {
  if (e.key === 'ArrowRight') { stopTimer(); showStep(currentStep + 1); startTimer(); }
  if (e.key === 'ArrowLeft')  { stopTimer(); showStep(currentStep - 1); startTimer(); }
});

// Initialize
showStep(0, false);

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
      const top = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ================================================
   HERO PHONE PARALLAX
   ================================================ */
const heroPhoneWrap = document.querySelector('.hero-phone-wrap');
if (heroPhoneWrap && window.innerWidth > 960) {
  window.addEventListener('mousemove', e => {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx;
    const dy = (e.clientY - cy) / cy;
    heroPhoneWrap.style.transform = `perspective(1000px) rotateY(${dx * 5}deg) rotateX(${-dy * 3}deg)`;
  }, { passive: true });
  window.addEventListener('mouseleave', () => {
    heroPhoneWrap.style.transform = '';
  });
}
