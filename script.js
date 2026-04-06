/* ============================================================
   ALIGNWIN — script.js
   Mobile Menu · Video Modal · Scroll Animations · Counters · FAQ · ROI Calculator
============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ─────────────────────────────────────────────────────────
     VIEWPORT HEIGHT FIX (iOS Safari 100vh bug)
  ───────────────────────────────────────────────────────── */
  function setVH() {
    document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
  }
  setVH();
  window.addEventListener('resize', setVH);


  /* ─────────────────────────────────────────────────────────
     OVERLAY LOCK MANAGER
  ───────────────────────────────────────────────────────── */
  const overlayLock = (() => {
    let count = 0;
    return {
      lock()         { count++; document.body.style.overflow = 'hidden'; },
      unlock()       { count = Math.max(0, count - 1); if (count === 0) document.body.style.overflow = ''; },
      forceRelease() { count = 0; document.body.style.overflow = ''; },
    };
  })();


  /* ─────────────────────────────────────────────────────────
     MOBILE MENU
  ───────────────────────────────────────────────────────── */
  const menuBtn       = document.getElementById('menu-btn');
  const mobileNav     = document.getElementById('mobile-nav');
  const menuOpenIcon  = document.getElementById('menu-open');
  const menuCloseIcon = document.getElementById('menu-close');

  if (menuBtn && mobileNav) {
    const openMenu = () => {
      mobileNav.classList.add('is-open');
      menuOpenIcon.style.display  = 'none';
      menuCloseIcon.style.display = 'block';
      overlayLock.lock();
      menuBtn.setAttribute('aria-expanded', 'true');
    };

    const closeMenu = () => {
      mobileNav.classList.remove('is-open');
      menuOpenIcon.style.display  = 'block';
      menuCloseIcon.style.display = 'none';
      overlayLock.unlock();
      menuBtn.setAttribute('aria-expanded', 'false');
    };

    menuBtn.addEventListener('click', () => {
      mobileNav.classList.contains('is-open') ? closeMenu() : openMenu();
    });

    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth >= 1101) closeMenu();
    });
  }


  /* ─────────────────────────────────────────────────────────
     SCROLL ANIMATIONS
  ───────────────────────────────────────────────────────── */
  if ('IntersectionObserver' in window) {

    const heroAnimObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05 });

    document.querySelectorAll('.anim, .anim-right').forEach(el => {
      heroAnimObserver.observe(el);
    });

    const cardObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity   = '1';
          entry.target.style.transform = 'translateY(0)';
          cardObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });

    document.querySelectorAll(
      '.service-card, .who-card, .advantage-card, .testi-card, .result-card, .result-proof-card'
    ).forEach(el => {
      el.style.opacity    = '0';
      el.style.transform  = 'translateY(28px)';
      el.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
      cardObserver.observe(el);
    });

  } else {
    document.querySelectorAll('.anim, .anim-right').forEach(el => el.classList.add('visible'));
  }


  /* ─────────────────────────────────────────────────────────
     VIDEO MODAL
  ───────────────────────────────────────────────────────── */
  const videoTrigger = document.getElementById('video-card-trigger');
  const heroModal    = document.getElementById('hero-modal');
  const heroVid      = document.getElementById('hero-vid');

  if (videoTrigger && heroModal && heroVid) {
    videoTrigger.addEventListener('click', openModal);
  }

  if (heroModal) {
    heroModal.addEventListener('click', (e) => {
      if (e.target === heroModal) closeModal();
    });
  }


  /* ─────────────────────────────────────────────────────────
     ANIMATED COUNTERS
  ───────────────────────────────────────────────────────── */
  const counters  = document.querySelectorAll('.stat-item__num[data-target]');
  let countersRun = false;

  const animateCounter = (el) => {
    const target   = parseInt(el.getAttribute('data-target'), 10);
    const suffix   = el.getAttribute('data-suffix') || '';
    const duration = 1800;
    const steps    = 60;
    let step       = 0;

    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const eased    = 1 - Math.pow(1 - progress, 3);
      const current  = Math.min(Math.round(eased * target), target);
      el.textContent = (current >= 1000 ? current.toLocaleString() : current) + suffix;
      if (step >= steps) clearInterval(timer);
    }, duration / steps);
  };

  if ('IntersectionObserver' in window && counters.length) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !countersRun) {
          countersRun = true;
          counters.forEach(animateCounter);
          statsObserver.disconnect();
        }
      });
    }, { threshold: 0.3 });

    const statsBar = document.querySelector('.stats-bar');
    if (statsBar) statsObserver.observe(statsBar);
  } else {
    counters.forEach(el => {
      const target = parseInt(el.getAttribute('data-target'), 10);
      const suffix = el.getAttribute('data-suffix') || '';
      el.textContent = (target >= 1000 ? target.toLocaleString() : target) + suffix;
    });
  }


  /* ─────────────────────────────────────────────────────────
     ACTIVE NAV HIGHLIGHTING (scrollspy)
  ───────────────────────────────────────────────────────── */
  const sections = document.querySelectorAll('section[id], footer[id]');
  const navLinks = document.querySelectorAll('.header__nav a, .mobile-nav a');
  const headerH  = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height')) || 76;

  if (sections.length && navLinks.length) {
    const scrollspyObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            const href = link.getAttribute('href');
            link.classList.toggle('is-active', href === `#${id}`);
          });
        }
      });
    }, {
      rootMargin: `-${headerH}px 0px -55% 0px`,
      threshold: 0,
    });

    sections.forEach(sec => scrollspyObserver.observe(sec));
  }


  /* ─────────────────────────────────────────────────────────
     ROI CALCULATOR
  ───────────────────────────────────────────────────────── */
  const LEADS_PER_CALLER = 35;
  const CONVERSION_RATE  = 1 / 50;
  const SERVICE_COST     = 1500;

  const rc1 = document.getElementById('rc1');
  const rc2 = document.getElementById('rc2');

  function updateSliderTrack(slider) {
    if (!slider) return;
    const pct = ((slider.value - slider.min) / (slider.max - slider.min)) * 100;
    slider.style.background = `linear-gradient(to right, #FF8C00 ${pct}%, #333 ${pct}%)`;
  }

  function updateROI() {
    if (!rc1 || !rc2) return;

    const callers = parseInt(rc1.value) || 1;
    const profit  = parseInt(rc2.value) || 5000;
    const leads   = callers * LEADS_PER_CALLER;
    const deals   = +(leads * CONVERSION_RATE).toFixed(1);
    const revenue = Math.round(deals * profit);
    const cost    = callers * SERVICE_COST;
    const roi     = cost > 0 ? (revenue / cost).toFixed(1) : '0';

    const rc1Val     = document.getElementById('rc1-value');
    const rc2Val     = document.getElementById('rc2-value');
    const roiLeads   = document.getElementById('roi-leads');
    const roiDeals   = document.getElementById('roi-deals');
    const roiRevenue = document.getElementById('roi-revenue');
    const roiRoas    = document.getElementById('roi-roas');

    if (rc1Val)     rc1Val.textContent     = callers + (callers === 1 ? ' caller' : ' callers');
    if (rc2Val)     rc2Val.textContent     = '$' + profit.toLocaleString();
    if (roiLeads)   roiLeads.textContent   = '~' + leads + ' leads';
    if (roiDeals)   roiDeals.textContent   = '~' + deals + ' deals';
    if (roiRevenue) roiRevenue.textContent = '$' + revenue.toLocaleString();
    if (roiRoas)    roiRoas.textContent    = roi + 'X';

    updateSliderTrack(rc1);
    updateSliderTrack(rc2);
  }

  if (rc1) rc1.addEventListener('input', updateROI);
  if (rc2) rc2.addEventListener('input', updateROI);
  updateROI();


  /* ─────────────────────────────────────────────────────────
     TESTIMONIAL SLIDER
  ───────────────────────────────────────────────────────── */
  const track = document.getElementById('testi-track');
  const dots  = document.querySelectorAll('.testi-dot');
  const prev  = document.getElementById('testi-prev');
  const next  = document.getElementById('testi-next');
  const total = document.querySelectorAll('.testi-slide').length;
  let current = 0;
  let autoTimer;

  function goTo(index) {
    current = (index + total) % total;
    if (track) track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  function startAuto() { autoTimer = setInterval(() => goTo(current + 1), 5000); }
  function stopAuto()  { clearInterval(autoTimer); }

  if (prev) prev.addEventListener('click', () => { stopAuto(); goTo(current - 1); startAuto(); });
  if (next) next.addEventListener('click', () => { stopAuto(); goTo(current + 1); startAuto(); });
  dots.forEach(dot => dot.addEventListener('click', () => { stopAuto(); goTo(+dot.dataset.index); startAuto(); }));

  if (track) {
    let startX = 0;
    track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; stopAuto(); }, { passive: true });
    track.addEventListener('touchend',   e => {
      const diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) goTo(diff > 0 ? current + 1 : current - 1);
      startAuto();
    }, { passive: true });
    track.addEventListener('mouseenter', stopAuto);
    track.addEventListener('mouseleave', startAuto);
  }

  startAuto();

}); // end DOMContentLoaded


/* ─────────────────────────────────────────────────────────
   VIDEO MODAL — global helpers
───────────────────────────────────────────────────────── */
function openModal() {
  const modal = document.getElementById('hero-modal');
  const vid   = document.getElementById('hero-vid');
  if (!modal) return;

  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';

  const closeBtn = modal.querySelector('button');
  if (closeBtn) setTimeout(() => closeBtn.focus(), 50);

  if (vid) {
    vid.load();
    vid.play().catch(() => {});
  }
}

function closeModal() {
  const modal = document.getElementById('hero-modal');
  const vid   = document.getElementById('hero-vid');

  if (modal) {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
  if (vid) {
    vid.pause();
    vid.currentTime = 0;
  }
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    const modal = document.getElementById('hero-modal');
    if (modal && modal.classList.contains('is-open')) closeModal();
  }
});


/* ─────────────────────────────────────────────────────────
   FAQ ACCORDION
───────────────────────────────────────────────────────── */
function toggleFaq(btn) {
  const answer = btn.nextElementSibling;
  const isOpen = btn.classList.contains('is-open');

  document.querySelectorAll('.faq-btn.is-open').forEach(openBtn => {
    openBtn.classList.remove('is-open');
    openBtn.setAttribute('aria-expanded', 'false');
    if (openBtn.nextElementSibling) openBtn.nextElementSibling.classList.remove('is-open');
  });

  if (!isOpen) {
    btn.classList.add('is-open');
    btn.setAttribute('aria-expanded', 'true');
    if (answer) answer.classList.add('is-open');
  }
}
