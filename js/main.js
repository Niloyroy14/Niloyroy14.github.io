/* ============================================================
   NILOY ROY PORTFOLIO — main.js
   ============================================================ */

/* ── THEME TOGGLE ────────────────────────────────────────── */
(function initTheme() {
  const saved = localStorage.getItem('nr-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
})();

document.addEventListener('DOMContentLoaded', function () {

  /* ── THEME BUTTON ──────────────────────────────────────── */
  const themeBtn = document.getElementById('themeToggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const html  = document.documentElement;
      const next  = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', next);
      localStorage.setItem('nr-theme', next);
    });
  }

  /* ── CUSTOM CURSOR ─────────────────────────────────────── */
  const cursor = document.getElementById('cursor');
  const ring   = document.getElementById('cursorRing');
  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.transform = `translate(${mx - 5}px, ${my - 5}px)`;
  });

  (function animRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.transform = `translate(${rx - 17}px, ${ry - 17}px)`;
    requestAnimationFrame(animRing);
  })();

  document.querySelectorAll('a, button, .skill-card, .project-card, .ref-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      ring.style.width  = '54px';
      ring.style.height = '54px';
      ring.style.borderColor = 'rgba(0,229,255,.7)';
    });
    el.addEventListener('mouseleave', () => {
      ring.style.width  = '34px';
      ring.style.height = '34px';
      ring.style.borderColor = 'rgba(0,229,255,.45)';
    });
  });

  /* ── MOBILE NAV ────────────────────────────────────────── */
  const menuBtn  = document.getElementById('menuBtn');
  const navLinks = document.getElementById('navLinks');
  if (menuBtn) {
    menuBtn.addEventListener('click', () => navLinks.classList.toggle('open'));
    navLinks.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => navLinks.classList.remove('open'))
    );
  }

  /* ── SCROLL REVEAL ─────────────────────────────────────── */
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) setTimeout(() => e.target.classList.add('visible'), i * 70);
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

  document.querySelectorAll(
    '.timeline-item, .project-card, .edu-card, .about-img-wrap, .about-text'
  ).forEach(el => revealObs.observe(el));

  /* Stagger project cards */
  document.querySelectorAll('.project-card').forEach((c, i) => {
    c.style.transitionDelay = `${i * 0.055}s`;
  });

  /* ── PROJECT TABS ──────────────────────────────────────── */
  const tabs  = document.querySelectorAll('.tab-btn');
  const cards = document.querySelectorAll('.project-card');

  tabs.forEach(btn => {
    btn.addEventListener('click', () => {
      tabs.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.tab;
      cards.forEach(c => {
        const show = cat === 'all' || c.dataset.cat === cat;
        if (show) {
          c.removeAttribute('data-hidden');
        } else {
          c.setAttribute('data-hidden', '');
        }
      });
      setTimeout(() => {
        document.querySelectorAll('.project-card:not([data-hidden])')
          .forEach(c => c.classList.add('visible'));
      }, 50);
    });
  });

  /* ── REFERENCES SLIDER ─────────────────────────────────── */
  const track      = document.getElementById('refsTrack');
  const dotsWrap   = document.getElementById('refsDots');
  const refCards   = track ? track.querySelectorAll('.ref-card') : [];
  const total      = refCards.length;
  let cur          = 0;
  let autoSlide;

  if (track && total > 0) {
    refCards.forEach((_, i) => {
      const d = document.createElement('div');
      d.className = 'refs-dot' + (i === 0 ? ' active' : '');
      d.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(d);
    });

    function cardWidth() {
      return refCards[0].offsetWidth + 24;
    }

    function goTo(idx) {
      cur = (idx + total) % total;
      track.style.transform = `translateX(-${cur * cardWidth()}px)`;
      dotsWrap.querySelectorAll('.refs-dot').forEach((d, i) =>
        d.classList.toggle('active', i === cur)
      );
    }

    document.getElementById('refPrev').addEventListener('click', () => goTo(cur - 1));
    document.getElementById('refNext').addEventListener('click', () => goTo(cur + 1));

    autoSlide = setInterval(() => goTo(cur + 1), 5000);
    const sliderWrap = track.closest('.refs-slider-wrap');
    sliderWrap.addEventListener('mouseenter', () => clearInterval(autoSlide));
    sliderWrap.addEventListener('mouseleave', () => {
      autoSlide = setInterval(() => goTo(cur + 1), 5000);
    });

    /* Touch/swipe support */
    let touchStart = 0;
    track.addEventListener('touchstart', e => { touchStart = e.touches[0].clientX; });
    track.addEventListener('touchend',   e => {
      const dx = e.changedTouches[0].clientX - touchStart;
      if (Math.abs(dx) > 50) goTo(dx < 0 ? cur + 1 : cur - 1);
    });
  }

  /* ── NAV ACTIVE HIGHLIGHT on scroll ───────────────────── */
  const sections = document.querySelectorAll('section[id]');
  const navAs    = document.querySelectorAll('.nav-links a');

  const activeObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const id = e.target.id;
        navAs.forEach(a => {
          a.style.color = '';
          if (a.getAttribute('href') === `#${id}`) a.style.color = 'var(--accent)';
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => activeObs.observe(s));

}); /* end DOMContentLoaded */
