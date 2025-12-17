document.addEventListener('DOMContentLoaded', () => {
  const menuBtn = document.getElementById('menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const menuOpenIcon = document.getElementById('menu-open');
  const menuCloseIcon = document.getElementById('menu-close');

  if (!menuBtn || !mobileMenu) return;

  // --- initial ARIA ---
  menuBtn.setAttribute('aria-expanded', 'false');

  const openMenu = () => {
    mobileMenu.classList.remove('hidden');
    mobileMenu.classList.add('animate-slide-down');
    menuOpenIcon.classList.add('hidden');
    menuCloseIcon.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');
    menuBtn.setAttribute('aria-expanded', 'true');
  };

  const closeMenu = () => {
    mobileMenu.classList.add('hidden');
    mobileMenu.classList.remove('animate-slide-down');
    menuOpenIcon.classList.remove('hidden');
    menuCloseIcon.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
    menuBtn.setAttribute('aria-expanded', 'false');
  };

  menuBtn.addEventListener('click', () => {
    const isOpen = !mobileMenu.classList.contains('hidden');
    isOpen ? closeMenu() : openMenu();
  });

  // ✅ AUTO-CLOSE on resize (tablet / desktop)
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 1024) {
      closeMenu();
    }
  });
});


  // ================= TESTIMONIALS SLIDER =================
  const slider = document.getElementById('slider');
  const dotsContainer = document.getElementById('dots');
  const cards = document.querySelectorAll('.testimonial-card');

  if (cards.length > 0) {
    const cardWidth = cards[0].offsetWidth + 16; // gap included
    let currentIndex = 0;

    // create dots
    cards.forEach((_, i) => {
      const dot = document.createElement('span');
      dot.classList.add('dot');
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => {
        currentIndex = i;
        updateSlider();
      });
      dotsContainer.appendChild(dot);
    });

    function updateSlider() {
      slider.scrollTo({ left: cardWidth * currentIndex, behavior: 'smooth' });
      document.querySelectorAll('.dot').forEach((d, i) =>
        d.classList.toggle('active', i === currentIndex)
      );
    }

    const nextBtn = document.getElementById('next');
    const prevBtn = document.getElementById('prev');

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % cards.length;
        updateSlider();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + cards.length) % cards.length;
        updateSlider();
      });
    }

    setInterval(() => {
      currentIndex = (currentIndex + 1) % cards.length;
      updateSlider();
    }, 5000);
  }
})();
