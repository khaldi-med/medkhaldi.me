(() => {
  'use strict';

  // ─── Loader ─────────────────────────────────────────────
  window.addEventListener('load', () => {
    setTimeout(() => document.getElementById('loaderWrapper')?.classList.add('gone'), 700);
  });

  // ─── Theme toggle (persisted) ───────────────────────────
  const html = document.documentElement;
  const themeBtn = document.getElementById('themeToggle');
  html.setAttribute('data-theme', localStorage.getItem('theme') || 'dark');

  themeBtn?.addEventListener('click', () => {
    const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });

  // ─── Custom cursor (hover devices) ──────────────────────
  const cur = document.getElementById('cursor');
  const fol = document.getElementById('cursorFollower');
  if (cur && fol && matchMedia('(hover:hover)').matches) {
    let fx = 0, fy = 0;
    document.addEventListener('mousemove', e => {
      cur.style.left = e.clientX + 'px';
      cur.style.top  = e.clientY + 'px';
      fx += (e.clientX - fx) * 0.12;
      fy += (e.clientY - fy) * 0.12;
    });
    (function raf() {
      fol.style.left = fx + 'px';
      fol.style.top  = fy + 'px';
      requestAnimationFrame(raf);
    })();
    document.querySelectorAll('a,button,.proj-card,.svc-card,.channel').forEach(el => {
      el.addEventListener('mouseenter', () => { cur.style.width = '16px'; cur.style.height = '16px'; });
      el.addEventListener('mouseleave', () => { cur.style.width = '8px';  cur.style.height = '8px'; });
    });
  }

  // ─── Navbar (scroll styling + active link) ──────────────
  const navbar    = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const mobMenu   = document.getElementById('mobileOverlay');
  const navLinks  = document.querySelectorAll('.nav-link');
  const sections  = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    navbar.classList.toggle('scrolled', y > 50);
    document.getElementById('backTop')?.classList.toggle('show', y > 500);
    updateActive();
  }, { passive: true });

  function updateActive() {
    const y = window.scrollY + 120;
    sections.forEach(sec => {
      const top = sec.offsetTop, bot = top + sec.offsetHeight, id = sec.id;
      navLinks.forEach(l => {
        if (l.dataset.section === id) l.classList.toggle('active', y >= top && y < bot);
      });
    });
  }

  // ─── Mobile menu ────────────────────────────────────────
  navToggle?.addEventListener('click', () => {
    navToggle.classList.toggle('open');
    mobMenu.classList.toggle('open');
    document.body.style.overflow = mobMenu.classList.contains('open') ? 'hidden' : '';
  });
  document.querySelectorAll('.mob-link').forEach(l => {
    l.addEventListener('click', () => {
      navToggle.classList.remove('open');
      mobMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // ─── Smooth scroll ─────────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const t = document.querySelector(a.getAttribute('href'));
      if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth' }); }
    });
  });

  // ─── Back to top ────────────────────────────────────────
  document.getElementById('backTop')?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ─── Skill bars (animate on scroll) ─────────────────────
  const skillRows = document.querySelectorAll('.skill-row');
  const skillObs = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        const fill = en.target.querySelector('.sk-fill');
        if (fill) fill.style.width = en.target.dataset.pct + '%';
        skillObs.unobserve(en.target);
      }
    });
  }, { threshold: 0.35 });
  skillRows.forEach(r => skillObs.observe(r));

  // ─── Project filter ─────────────────────────────────────
  const fBtns = document.querySelectorAll('.fbtn');
  const cards = document.querySelectorAll('.proj-card');
  fBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      fBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.filter;
      cards.forEach(c => c.classList.toggle('hide', f !== 'all' && c.dataset.category !== f));
    });
  });

  // ─── Reveal on scroll ──────────────────────────────────
  const revealEls = document.querySelectorAll('.reveal');
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach((en, i) => {
      if (en.isIntersecting) {
        setTimeout(() => en.target.classList.add('visible'), i * 55);
        revealObs.unobserve(en.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
  revealEls.forEach(el => revealObs.observe(el));

  // ─── Typed hero word ────────────────────────────────────
  const typed = document.getElementById('typedLine');
  if (typed) {
    const words = ['high-performance', 'scalable', 'robust', 'elegant'];
    let wi = 0, ci = 0, del = false;
    function tick() {
      const w = words[wi];
      typed.textContent = del ? w.slice(0, ci--) : w.slice(0, ci++);
      let d = del ? 50 : 90;
      if (!del && ci > w.length) { d = 2400; del = true; }
      else if (del && ci < 0) { del = false; wi = (wi + 1) % words.length; ci = 0; d = 380; }
      setTimeout(tick, d);
    }
    setTimeout(tick, 1600);
  }

  // ─── Contact form ───────────────────────────────────────
  const form = document.getElementById('contactForm');
  const fmsg = document.getElementById('formMsg');
  if (form) {
    const v = f => {
      const e = f.closest('.field')?.querySelector('.ferr');
      f.classList.remove('err','ok'); if (e) e.textContent = '';
      if (!f.value.trim())        { f.classList.add('err'); if (e) e.textContent = 'Required.';       return false; }
      if (f.type==='email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.value))
                                  { f.classList.add('err'); if (e) e.textContent = 'Invalid email.';   return false; }
      if (f.id==='message' && f.value.trim().length < 10)
                                  { f.classList.add('err'); if (e) e.textContent = 'Min 10 chars.';    return false; }
      f.classList.add('ok'); return true;
    };
    form.querySelectorAll('input,textarea').forEach(f => {
      f.addEventListener('blur',  () => v(f));
      f.addEventListener('input', () => { if (f.classList.contains('err')) v(f); });
    });
    form.addEventListener('submit', e => {
      e.preventDefault();
      const fields = [...form.querySelectorAll('input,textarea')];
      if (!fields.every(f => v(f))) return;
      const btn = document.getElementById('submitBtn');
      btn.disabled = true;
      btn.querySelector('.btn-label').textContent = 'Sending…';
      setTimeout(() => {
        fmsg.textContent = "Thanks! I'll get back to you soon.";
        fmsg.className = 'form-msg success';
        form.reset(); fields.forEach(f => f.classList.remove('ok','err'));
        btn.disabled = false; btn.querySelector('.btn-label').textContent = 'Send message';
        setTimeout(() => { fmsg.className = 'form-msg'; }, 5000);
      }, 1100);
    });
  }

  // ─── Console ────────────────────────────────────────────
  console.log('%c { mk } ', 'font-size:18px;font-weight:700;color:#7c6af7;font-family:monospace');
  console.log('%c github.com/khaldi-med', 'color:#8888a8;font-size:12px');
})();
