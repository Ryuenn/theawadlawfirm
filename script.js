// Video Modal Script
const playBtn = document.getElementById('playBtn');
const videoModal = document.getElementById('videoModal');
const closeBtn = document.getElementById('closeBtn');
const youtubePlayer = document.getElementById('youtubePlayer');

// Replace with your YouTube video ID
const YOUTUBE_VIDEO_ID = 'JyZ_4v8df8A'; // Origin Story Video

playBtn.addEventListener('click', () => {
  // Set the YouTube URL with the video ID
  youtubePlayer.src = `https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}?autoplay=1`;
  videoModal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
});

closeBtn.addEventListener('click', () => {
  videoModal.style.display = 'none';
  youtubePlayer.src = '';
  document.body.style.overflow = 'auto';
});

// Close modal when clicking outside the content
videoModal.addEventListener('click', (e) => {
  if (e.target === videoModal) {
    videoModal.style.display = 'none';
    youtubePlayer.src = '';
    document.body.style.overflow = 'auto';
  }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && videoModal.style.display !== 'none') {
    videoModal.style.display = 'none';
    youtubePlayer.src = '';
    document.body.style.overflow = 'auto';
  }
});

/* CAROUSEL SCRIPT */
const carousel = document.getElementById('carousel');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const cards = Array.from(document.querySelectorAll('.carousel-card'));
let currentIndex = 2; // Start with middle card active

const STEP_X = 280; // Horizontal spacing between visible cards
const MAX_VISIBLE_DISTANCE = 2; // Distance from center (-2..2) that stays visible
const ROTATE_Y = 35; // 3D rotation angle for side cards

function getSignedDistance(i, centerIndex, n) {
  // Shortest signed distance around a circular list
  let d = i - centerIndex;
  if (d > n / 2) d -= n;
  if (d < -n / 2) d += n;
  return d;
}

function setActiveButton(index, practiceButtons) {
  practiceButtons.forEach(b => b.classList.remove('active'));
  if (practiceButtons[index]) practiceButtons[index].classList.add('active');
}

function applyPosition(card, dist, animate = true) {
  const absd = Math.abs(dist);
  const canShow = absd <= MAX_VISIBLE_DISTANCE;

  const x = dist * STEP_X;
  const rotY = dist < 0 ? ROTATE_Y : dist > 0 ? -ROTATE_Y : 0;
  const tz = absd === 0 ? 0 : -80; // push side cards back in Z
  const scale = absd === 0 ? 1 : absd === 1 ? 0.95 : 1.05;
  const z = absd === 0 ? 3 : absd === 1 ? 2 : 1;

  card.style.transition = animate
    ? 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.5s ease, box-shadow 0.5s ease'
    : 'none';

  card.style.transform = `translate(-50%, -50%) translateX(${x}px) translateZ(${tz}px) rotateY(${rotY}deg) scale(${scale})`;
  card.style.opacity = canShow ? 1 : 0;
  card.style.zIndex = canShow ? z : 0;
  card.style.boxShadow = canShow
    ? (absd === 0
      ? '0 20px 50px rgba(0,0,0,0.18)'
      : '0 10px 30px rgba(0,0,0,0.10)')
    : 'none';

  // Only center card shows overlay
  if (absd === 0) {
    card.classList.add('active-card');
  } else {
    card.classList.remove('active-card');
  }

  // Avoid hidden cards blocking clicks
  card.style.pointerEvents = canShow ? 'auto' : 'none';
}

function updateCarousel() {
  const n = cards.length;
  cards.forEach((card, i) => {
    const dist = getSignedDistance(i, currentIndex, n);
    applyPosition(card, dist, true);
  });
}

prevBtn.addEventListener('click', () => {
  currentIndex = (currentIndex - 1 + cards.length) % cards.length;
  updateCarousel();
  // Sync active tab
  practiceButtons.forEach((b, i) => {
    if (i === currentIndex) b.classList.add('active');
    else b.classList.remove('active');
  });
});

nextBtn.addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % cards.length;
  updateCarousel();
  // Sync active tab
  practiceButtons.forEach((b, i) => {
    if (i === currentIndex) b.classList.add('active');
    else b.classList.remove('active');
  });
});

// Sync category buttons
const practiceButtons = document.querySelectorAll('.practice-btn');
practiceButtons.forEach((btn, i) => {
  btn.addEventListener('click', () => {
    currentIndex = Math.min(i, cards.length - 1);
    setActiveButton(currentIndex, practiceButtons);
    updateCarousel();
  });
});

// Clicking a card selects the matching tab + recenters it
cards.forEach((card, i) => {
  card.addEventListener('click', () => {
    currentIndex = i;
    setActiveButton(currentIndex, practiceButtons);
    updateCarousel();
  });
});

/* ══════════════════════════════════════
   CASE STUDIES — Carousel + Scroll Animation
   Place before </body>:  <script src="case-studies.js"></script>
══════════════════════════════════════ */

(function () {
  'use strict';

  /* ── Config ── */
  const CARDS_PER_VIEW_DESKTOP = 3;
  const CARDS_PER_VIEW_TABLET  = 2;
  const CARDS_PER_VIEW_MOBILE  = 1;

  /* ── Elements ── */
  const track    = document.getElementById('csTrack');
  const prevBtn  = document.getElementById('csPrev');
  const nextBtn  = document.getElementById('csNext');
  const dotsWrap = document.getElementById('csDots');

  if (!track || !prevBtn || !nextBtn) return; // guard if section not on page

  const cards = Array.from(track.querySelectorAll('.cs-card'));
  const total = cards.length;

  let currentIndex = 0;

  /* ── Responsive: how many cards visible ── */
  function getPerView() {
    if (window.innerWidth <= 480) return CARDS_PER_VIEW_MOBILE;
    if (window.innerWidth <= 720) return CARDS_PER_VIEW_TABLET;
    return CARDS_PER_VIEW_DESKTOP;
  }

  /* ── Total "pages" ── */
  function maxIndex() {
    return Math.max(0, total - getPerView());
  }

  /* ── Move track ── */
  function goTo(index) {
    const perView = getPerView();
    currentIndex = Math.max(0, Math.min(index, maxIndex()));

    const cardWidth = cards[0].getBoundingClientRect().width;
    const gap = 20; // must match CSS gap
    const offset = currentIndex * (cardWidth + gap);

    track.style.transform = `translateX(-${offset}px)`;

    updateDots();
    updateButtons();
  }

  /* ── Button states ── */
  function updateButtons() {
    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex >= maxIndex();
  }

  /* ── Dots ── */
  function buildDots() {
    dotsWrap.innerHTML = '';
    const pages = maxIndex() + 1;
    for (let i = 0; i < pages; i++) {
      const dot = document.createElement('button');
      dot.className = 'cs-dot' + (i === 0 ? ' cs-dot-active' : '');
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    }
  }

  function updateDots() {
    const dots = dotsWrap.querySelectorAll('.cs-dot');
    dots.forEach((d, i) => {
      d.classList.toggle('cs-dot-active', i === currentIndex);
    });
  }

  /* ── Button listeners ── */
  prevBtn.addEventListener('click', () => goTo(currentIndex - 1));
  nextBtn.addEventListener('click', () => goTo(currentIndex + 1));

  /* ── Touch / swipe support ── */
  let touchStartX = 0;
  let touchEndX   = 0;

  track.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 40) {
      goTo(diff > 0 ? currentIndex + 1 : currentIndex - 1);
    }
  }, { passive: true });

  /* ── Keyboard nav ── */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') goTo(currentIndex + 1);
    if (e.key === 'ArrowLeft')  goTo(currentIndex - 1);
  });

  /* ── Rebuild on resize ── */
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      buildDots();
      goTo(Math.min(currentIndex, maxIndex()));
    }, 120);
  });

  /* ── Scroll-in animation (IntersectionObserver) ── */
  function initScrollAnimation() {
    if (!('IntersectionObserver' in window)) {
      // Fallback: just show everything
      cards.forEach(c => c.classList.add('cs-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('cs-visible');
            observer.unobserve(entry.target); // animate once
          }
        });
      },
      {
        root: null,
        rootMargin: '0px 0px -60px 0px',
        threshold: 0.15,
      }
    );

    cards.forEach((card) => {
      observer.observe(card);
      // Check if card is already in viewport on page load
      const rect = card.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        setTimeout(() => {
          card.classList.add('cs-visible');
          observer.unobserve(card);
        }, 100);
      }
    });
  }

  /* ── Init ── */
  buildDots();
  goTo(0);
  initScrollAnimation();
})();

// Initialize
updateCarousel();
setActiveButton(currentIndex, practiceButtons);

/* ══════════════════════════════════════
   FAQ Accordion
══════════════════════════════════════ */
(function () {
  'use strict';

  const items = document.querySelectorAll('.faq-item');
  if (!items || items.length === 0) return;

  items.forEach((item) => {
    const btn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    if (!btn || !answer) return;

    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      item.classList.toggle('open', !isOpen);
      btn.setAttribute('aria-expanded', String(!isOpen));
      answer.setAttribute('aria-hidden', String(isOpen));
    });
  });
})();

/* ══════════════════════════════════════
   Team Section Carousel (After CS)
══════════════════════════════════════ */
(function () {
  'use strict';

  const track = document.getElementById('teamTrack');
  const prevBtn = document.getElementById('teamPrev');
  const nextBtn = document.getElementById('teamNext');

  if (!track || !prevBtn || !nextBtn) return;

  const cards = Array.from(track.querySelectorAll('.team-card'));
  const total = cards.length;

  if (total === 0) return;

  const GAP_PX = 20; // must match .team-track gap
  const CARDS_PER_VIEW_DESKTOP = 4;
  const CARDS_PER_VIEW_TABLET = 2;
  const CARDS_PER_VIEW_MOBILE = 1;

  let currentIndex = 0;

  function getPerView() {
    if (window.innerWidth <= 480) return CARDS_PER_VIEW_MOBILE;
    if (window.innerWidth <= 900) return CARDS_PER_VIEW_TABLET;
    return CARDS_PER_VIEW_DESKTOP;
  }

  function maxIndex() {
    return Math.max(0, total - getPerView());
  }

  function updateButtons() {
    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex >= maxIndex();
  }

  function goTo(index) {
    currentIndex = Math.max(0, Math.min(index, maxIndex()));

    const cardWidth = cards[0].getBoundingClientRect().width;
    const offset = currentIndex * (cardWidth + GAP_PX);
    track.style.transform = `translateX(-${offset}px)`;

    updateButtons();
  }

  // Init
  goTo(0);

  prevBtn.addEventListener('click', () => goTo(currentIndex - 1));
  nextBtn.addEventListener('click', () => goTo(currentIndex + 1));

  // Swipe support
  let touchStartX = 0;
  let touchEndX = 0;

  track.parentElement.addEventListener(
    'touchstart',
    (e) => {
      touchStartX = e.changedTouches[0].screenX;
    },
    { passive: true }
  );

  track.parentElement.addEventListener(
    'touchend',
    (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) {
        goTo(diff > 0 ? currentIndex + 1 : currentIndex - 1);
      }
    },
    { passive: true }
  );

  // Keyboard nav
  document.addEventListener('keydown', (e) => {
    const section = track.closest('.team-section');
    if (!section) return;

    const rect = section.getBoundingClientRect();
    const inView = rect.top < window.innerHeight && rect.bottom > 0;
    if (!inView) return;

    if (e.key === 'ArrowRight') goTo(currentIndex + 1);
    if (e.key === 'ArrowLeft') goTo(currentIndex - 1);
  });

  // Rebuild on resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => goTo(currentIndex), 150);
  });
})();

/* ──────────────────────────────────────
   FAQ Accordion Script
   ────────────────────────────────────── */
function initFAQAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  console.log('FAQ Accordion: Found ' + faqItems.length + ' items');
  
  if (faqItems.length === 0) {
    console.warn('No FAQ items found');
    return;
  }
  
  faqItems.forEach((item, index) => {
    const question = item.querySelector('.faq-question');
    
    if (!question) {
      console.warn('FAQ question button not found in item ' + index);
      return;
    }
    
    console.log('Attaching click handler to FAQ item ' + index);
    
    question.addEventListener('click', (e) => {
      console.log('FAQ item ' + index + ' clicked');
      e.stopPropagation();
      
      const isActive = item.classList.contains('active');
      console.log('Item was active: ' + isActive);
      
      // Close all items
      faqItems.forEach(i => i.classList.remove('active'));
      
      // Open clicked item if it wasn't active
      if (!isActive) {
        item.classList.add('active');
        console.log('Opened item ' + index);
      }
    });
  });
}

// Run immediately if DOM is ready, otherwise wait for DOMContentLoaded
if (document.readyState === 'loading') {
  console.log('FAQ: DOM still loading, waiting for DOMContentLoaded');
  document.addEventListener('DOMContentLoaded', initFAQAccordion);
} else {
  console.log('FAQ: DOM already loaded, initializing immediately');
  initFAQAccordion();
}


