const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let particlesArray;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', function() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  init();
});

class Particle {
  constructor(x, y, size, color, velocityX, velocityY) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.color = color;
    this.velocityX = velocityX;
    this.velocityY = velocityY;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
  update(mouse) {
    this.x += this.velocityX + (mouse.x - window.innerWidth / 2) * 0.0005;
    this.y += this.velocityY + (mouse.y - window.innerHeight / 2) * 0.0005;
    if (this.size > 0.2) this.size -= 0.005;
  }
}

function init() {
  particlesArray = [];
  const count = 100;
  for (let i = 0; i < count; i++) {
    const size = Math.random() * 2;
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const color = 'rgba(255, 0, 0, 0.7)';
    const velocityX = (Math.random() - 0.5) * 0.3;
    const velocityY = (Math.random() - 0.5) * 0.3;
    particlesArray.push(new Particle(x, y, size, color, velocityX, velocityY));
  }
}

const mouse = { x: null, y: null };
window.addEventListener('mousemove', function(event) {
  mouse.x = event.x;
  mouse.y = event.y;
});

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particlesArray.forEach(particle => {
    particle.update(mouse);
    particle.draw();
  });
  requestAnimationFrame(animate);
}

init();
animate();