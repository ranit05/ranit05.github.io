/* RAWBIT — script.js
   Particles, intro -> reveal, motion reactive effects, simple contact stub.
*/

(() => {
  // helper
  const $ = (sel) => document.querySelector(sel);

  // Elements
  const intro = $('#intro');
  const site = $('#site');
  const logo = $('#logo');
  const particlesCanvas = document.getElementById('particles');
  const yearEl = document.getElementById('year');
  const contactForm = document.getElementById('contactForm');
  const formMsg = document.getElementById('formMsg');

  // set year
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---------- Particles (canvas) ----------
  const ctx = particlesCanvas.getContext('2d');
  let W = particlesCanvas.width = innerWidth;
  let H = particlesCanvas.height = innerHeight;
  const particles = [];
  const MAX = 120;

  function rand(min,max){ return Math.random()*(max-min)+min }

  function Particle(){
    this.x = rand(0,W);
    this.y = rand(0,H);
    this.vx = rand(-0.3,0.3);
    this.vy = rand(-0.4,0.4);
    this.life = rand(60,220);
    this.size = rand(0.6,2.6);
    this.h = rand(0,360);
  }
  Particle.prototype.step = function(){
    this.x += this.vx;
    this.y += this.vy;
    this.life--;
    this.size *= 0.9992;
    if(this.x < -20) this.x = W+20;
    if(this.x > W+20) this.x = -20;
    if(this.y < -20) this.y = H+20;
    if(this.y > H+20) this.y = -20;
  };

  function regen(){
    while(particles.length < MAX) particles.push(new Particle());
  }
  function draw(){
    ctx.clearRect(0,0,W,H);
    for(let i=0;i<particles.length;i++){ 
      const p = particles[i];
      ctx.beginPath();
      const alpha = Math.max(0, Math.min(1, p.life / 220));
      ctx.fillStyle = `rgba(255,27,27,${0.6 * alpha})`;
      ctx.shadowColor = 'rgba(255,27,27,0.18)';
      ctx.shadowBlur = 8;
      ctx.arc(p.x, p.y, p.size, 0, Math.PI*2);
      ctx.fill();
      p.step();
      if(p.life <= 0 || p.size < 0.2) particles.splice(i,1);
    }
    regen();
    requestAnimationFrame(draw);
  }

  // resize
  window.addEventListener('resize', () => {
    W = particlesCanvas.width = innerWidth;
    H = particlesCanvas.height = innerHeight;
  });

  // ---------- Intro sequence ----------
  function startIntroSequence(){
    // small pulse + glitch then reveal main site
    logo.style.animation = 'logoPulse 700ms ease-in-out 2';
    setTimeout(()=> {
      // short glitch shake
      intro.animate([{transform:'translateY(0)'},{transform:'translateY(-6px)'},{transform:'translateY(0)'}], {duration:420,iterations:1});
      // then fade out intro -> reveal
      setTimeout(()=> {
        intro.style.transition = 'opacity .6s ease';
        intro.style.opacity = 0;
        setTimeout(()=> {
          intro.style.display = 'none';
          revealSite();
        }, 650);
      }, 420);
    }, 900);
  }

  function revealSite(){
    // show site
    site.classList.remove('hidden');
    // small camera zoom
    document.body.style.overflow = 'hidden';
    setTimeout(()=> {
      document.body.style.overflow = '';
    }, 1100);
  }

  // ---------- motion reactive effect ----------
  let lastX = innerWidth/2, lastY = innerHeight/2;
  window.addEventListener('mousemove', (e) => {
    // small parallax on hero title
    const heroTitle = document.querySelector('.hero-title');
    if(heroTitle){
      const dx = (e.clientX - innerWidth/2)/50;
      const dy = (e.clientY - innerHeight/2)/80;
      heroTitle.style.transform = `translate(${dx}px, ${dy}px)`;
    }

    // create a burst particle at cursor
    for(let i=0;i<2;i++){ 
      const p = new Particle();
      p.x = e.clientX + rand(-6,6);
      p.y = e.clientY + rand(-6,6);
      p.vx = rand(-0.8,0.8);
      p.vy = rand(-0.8,0.8);
      p.size = rand(1.4,3.2);
      p.life = 50;
      particles.push(p);
    }
  });

  // ---------- contact form (simple stub) ----------
  if(contactForm){
    contactForm.addEventListener('submit', (ev) => {
      ev.preventDefault();
      const data = new FormData(contactForm);
      const name = data.get('name');
      const email = data.get('email');
      const what = data.get('what');
      formMsg.textContent = 'Sending...';
      // simple redirect to mailto for now
      const subject = encodeURIComponent(`[RAWBIT INQUIRY] ${what} — ${name}`);
      const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nNeed: ${what}\n\nDetails:\n${data.get('notes') || ''}`);
      window.location.href = `mailto:rawbit.services@gmail.com?subject=${subject}&body=${body}`;
      setTimeout(()=> formMsg.textContent = 'If mail client did not open, copy the email and message manually.', 800);
    });
  }

  // start canvas draw and intro
  regen();
  draw();
  // small delay if page already loaded
  window.addEventListener('load', () => {
    setTimeout(startIntroSequence, 300);
  });
})();