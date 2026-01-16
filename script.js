/* RAWBIT — script.js
   Intro, particles, mobile nav, contact handling
*/

(() => {
  const $ = (s) => document.querySelector(s);

  /* =======================
     ELEMENTS
  ======================= */
  const intro = $('#intro');
  const site = $('#site');
  const logo = $('.logo');
  const canvas = $('#particles');
  const yearEl = $('#year');

  const menuToggle = $('#menuToggle');
  const mobileMenu = $('#mobileMenu');

  const contactForm = $('#contactForm');
  const formMsg = $('#formMsg');

  /* =======================
     YEAR
  ======================= */
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* =======================
     MOBILE MENU
  ======================= */
  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      const isOpen = menuToggle.classList.toggle('active');
      mobileMenu.classList.toggle('active', isOpen);

      menuToggle.setAttribute('aria-expanded', isOpen);
      mobileMenu.setAttribute('aria-hidden', !isOpen);

      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        mobileMenu.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        mobileMenu.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      });
    });
  }

  /* =======================
     INTRO (ALWAYS RUNS)
  ======================= */
  function startIntro() {
    if (!intro || !site) return;

    setTimeout(() => {
      intro.style.transition = 'opacity .6s ease';
      intro.style.opacity = 0;

      setTimeout(() => {
        intro.remove();
        site.classList.remove('hidden');
      }, 650);
    }, 600);
  }

  window.addEventListener('load', startIntro);

  /* =======================
     PARTICLES (OPTIONAL)
  ======================= */
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (canvas && !reduceMotion) {
    canvas.style.pointerEvents = 'none';

    const ctx = canvas.getContext('2d');
    let W = canvas.width = innerWidth;
    let H = canvas.height = innerHeight;

    const particles = [];
    const MAX = innerWidth < 768 ? 50 : 100;

    const rand = (a, b) => Math.random() * (b - a) + a;

    function Particle() {
      this.x = rand(0, W);
      this.y = rand(0, H);
      this.vx = rand(-0.3, 0.3);
      this.vy = rand(-0.4, 0.4);
      this.life = rand(80, 200);
      this.size = rand(0.6, 2.2);
    }

    Particle.prototype.step = function () {
      this.x += this.vx;
      this.y += this.vy;
      this.life--;
      this.size *= 0.995;

      if (this.x < -20) this.x = W + 20;
      if (this.x > W + 20) this.x = -20;
      if (this.y < -20) this.y = H + 20;
      if (this.y > H + 20) this.y = -20;
    };

    function regen() {
      while (particles.length < MAX) particles.push(new Particle());
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        ctx.beginPath();
        ctx.fillStyle = `rgba(255,27,27,${Math.max(0, p.life / 200) * 0.4})`;
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        p.step();

        if (p.life <= 0 || p.size < 0.2) particles.splice(i, 1);
      }

      regen();
      requestAnimationFrame(draw);
    }

    window.addEventListener('resize', () => {
      W = canvas.width = innerWidth;
      H = canvas.height = innerHeight;
    });

    regen();
    draw();
  }

  /* =======================
     CONTACT FORM
  ======================= */
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const data = new FormData(contactForm);
      const name = data.get('name');
      const email = data.get('email');
      const service = data.get('service');
      const notes = data.get('notes') || '';

      if (formMsg) formMsg.textContent = 'Opening mail client…';

      const subject = encodeURIComponent(`[RAWBIT] ${service} — ${name}`);
      const body = encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\nService: ${service}\n\nNotes:\n${notes}`
      );

      window.location.href =
        `mailto:rawbit.services@gmail.com?subject=${subject}&body=${body}`;
    });
  }
})();