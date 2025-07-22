document.addEventListener('DOMContentLoaded', () => {
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;

  const audio = document.getElementById('audio-control');
  function playAudio() {
    audio.volume = 0.8;
    audio.play().catch(e => console.log('Erro ao reproduzir áudio:', e));
  }
  document.body.addEventListener(isTouchDevice ? 'touchstart' : 'click', playAudio);

  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  const cursor = document.getElementById('cursor');

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();

  if (isTouchDevice) {
    cursor.style.display = 'none';
  } else {
    document.addEventListener('mousemove', e => {
      cursor.style.left = `${e.clientX - 16}px`;
      cursor.style.top = `${e.clientY - 16}px`;
      cursor.style.transform = `scale(${1 + Math.sin(Date.now() / 300) * 0.05})`;
    });
    document.addEventListener('mousedown', () => {
      cursor.style.transform = 'scale(0.8)';
    });
    document.addEventListener('mouseup', () => {
      cursor.style.transform = 'scale(1.1)';
      setTimeout(() => {
        cursor.style.transform = 'scale(1)';
      }, 100);
    });
  }

  const text = "TE AMO";
  const baseFontSize = isTouchDevice ? 24 : 42;
  let columns = Math.floor(canvas.width / (baseFontSize * 2));
  const drops = new Array(columns).fill(1);

  ctx.font = `bold ${baseFontSize}px monospace`;

  function drawMatrix() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#ff69b4";
    for (let i = 0; i < drops.length; i++) {
      const x = i * baseFontSize * 2;
      const y = drops[i] * baseFontSize;

      ctx.shadowColor = "rgba(255, 105, 180, 0.7)";
      ctx.shadowBlur = 10;
      ctx.fillText(text, x, y);

      ctx.shadowBlur = 0;
      ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
      ctx.lineWidth = 2;
      ctx.strokeText(text, x, y);
      ctx.fillText(text, x, y);

      if (y > canvas.height && Math.random() > 0.992) {
        drops[i] = 0;
      }
      drops[i] += 0.3;
    }
  }

  let particles = [];
  const handleInteraction = (e) => {
    const x = isTouchDevice ? e.touches[0].clientX : e.clientX;
    const y = isTouchDevice ? e.touches[0].clientY : e.clientY;

    const directions = [
      { x: 0, y: -1 },
      { x: 0, y: 1 },
      { x: -1, y: 0 },
      { x: 1, y: 0 }
    ];

    directions.forEach(dir => {
      particles.push({
        x: x,
        y: y,
        vx: dir.x * (3 + Math.random() * 2),
        vy: dir.y * (3 + Math.random() * 2),
        alpha: 1,
        size: baseFontSize + Math.random() * 30,
        color: `#${Math.random() > 0.5 ? 'ff69b4' : 'ff007f'}`
      });
    });

    for (let i = 0; i < 16; i++) {
      particles.push({
        x: x,
        y: y,
        vx: (Math.random() - 0.5) * 6,
        vy: (Math.random() - 0.5) * 6,
        alpha: 1,
        size: baseFontSize + Math.random() * 20,
        color: `#${Math.random() > 0.5 ? 'ff69b4' : 'ff007f'}`
      });
    }
  };

  canvas.addEventListener(isTouchDevice ? 'touchstart' : 'click', handleInteraction);

  function drawParticles() {
    particles.forEach((p, index) => {
      ctx.globalAlpha = p.alpha;
      ctx.font = `bold ${p.size}px monospace`;
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 15;
      ctx.fillText("TE AMO", p.x, p.y);
      ctx.shadowBlur = 0;
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= 0.005;
      if (p.alpha <= 0) {
        particles.splice(index, 1);
      }
    });
    ctx.globalAlpha = 1;
  }

  function animate() {
    drawMatrix();
    drawParticles();
    requestAnimationFrame(animate);
  }

  animate();

  window.addEventListener('resize', () => {
    resizeCanvas();
    columns = Math.floor(canvas.width / (baseFontSize * 2));
    drops.length = columns;
    drops.fill(1);
  });
});
