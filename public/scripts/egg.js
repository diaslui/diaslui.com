(function () {
  'use strict';

  function loadMatter(cb) {
    if (window.Matter) { cb(); return; }
    const s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/matter-js/0.19.0/matter.min.js';
    s.onload = cb;
    document.head.appendChild(s);
  }

  function injectStyles() {
    if (document.getElementById('entropy-styles')) return;
    const st = document.createElement('style');
    st.id = 'entropy-styles';
    st.textContent = `
      @keyframes eq-shake {
        0%,100%{ transform:translate(0,0) rotate(0deg) }
        5%  { transform:translate(-20px,-12px) rotate(-2deg) }
        10% { transform:translate(18px, 14px) rotate( 1.5deg) }
        15% { transform:translate(-16px, 8px) rotate(-1deg) }
        20% { transform:translate(14px,-10px) rotate( 2deg) }
        25% { transform:translate(-10px, 6px) rotate(-1.5deg) }
        30% { transform:translate( 8px,-14px) rotate( 1deg) }
        35% { transform:translate(-14px, 10px) rotate(-2deg) }
        40% { transform:translate(12px, -8px) rotate( 1.5deg) }
        45% { transform:translate(-8px,  4px) rotate(-1deg) }
        50% { transform:translate( 6px,-10px) rotate( 2deg) }
        55% { transform:translate(-10px,  8px) rotate(-1.5deg) }
        60% { transform:translate( 8px, -4px) rotate( 1deg) }
        65% { transform:translate(-6px,  6px) rotate(-2deg) }
        70% { transform:translate( 4px, -8px) rotate( 1.5deg) }
        75% { transform:translate(-8px,  4px) rotate(-1deg) }
        80% { transform:translate( 6px, -6px) rotate( 2deg) }
        85% { transform:translate(-4px,  8px) rotate(-1.5deg) }
        90% { transform:translate( 2px, -4px) rotate( 1deg) }
        95% { transform:translate(-2px,  2px) rotate(-0.5deg) }
      }
      @keyframes eq-flash {
        0%   { opacity:1 }
        100% { opacity:0 }
      }
      @keyframes eq-scanline {
        0%   { top: -100% }
        100% { top:  200% }
      }
      @keyframes eq-glitch-h {
        0%,100% { clip-path:inset(0 0 95% 0); transform:translateX(0) }
        20% { clip-path:inset(33% 0 55% 0); transform:translateX(-8px) }
        40% { clip-path:inset(66% 0 20% 0); transform:translateX( 8px) }
        60% { clip-path:inset(10% 0 80% 0); transform:translateX(-4px) }
        80% { clip-path:inset(50% 0 40% 0); transform:translateX( 4px) }
      }
      @keyframes eq-crack {
        0%   { opacity:0; stroke-dashoffset:1000 }
        30%  { opacity:1 }
        100% { opacity:1; stroke-dashoffset:0 }
      }
      @keyframes eq-vignette-pulse {
        0%,100% { opacity:0.3 }
        50% { opacity:0.9 }
      }
      @keyframes eq-rgb-split {
        0%,100% { text-shadow: -3px 0 #f00, 3px 0 #0ff }
        50%      { text-shadow:  4px 0 #f00,-4px 0 #0ff }
      }
      #eq-overlay {
        position:fixed; inset:0; z-index:999990;
        pointer-events:none; overflow:hidden;
      }
      #eq-canvas {
        position:absolute; inset:0;
        width:100%; height:100%;
      }
      #eq-flash {
        position:fixed; inset:0; z-index:999995;
        background:#fff; pointer-events:none;
        opacity:0; transition:none;
      }
      #eq-vignette {
        position:fixed; inset:0; z-index:999991; pointer-events:none;
        background: radial-gradient(ellipse at center,
          transparent 40%, rgba(255,0,40,0.7) 100%);
        opacity:0;
        animation: eq-vignette-pulse 0.3s ease-in-out infinite;
      }
      #eq-scanlines {
        position:fixed; inset:0; z-index:999992; pointer-events:none;
        background: repeating-linear-gradient(
          to bottom, transparent 0, transparent 3px,
          rgba(0,0,0,0.18) 3px, rgba(0,0,0,0.18) 4px);
        opacity:0;
      }
      .eq-scanline-bar {
        position:fixed; left:0; width:100%; height:60px;
        background:rgba(255,255,255,0.06);
        pointer-events:none; z-index:999993;
        animation: eq-scanline 1.2s linear infinite;
      }
      #eq-glitch {
        position:fixed; inset:0; z-index:999994; pointer-events:none;
        opacity:0;
      }
      #eq-glitch::before,
      #eq-glitch::after {
        content:''; position:absolute; inset:0;
        background:inherit;
      }
      .eq-matter-canvas {
        position:fixed !important;
        top:0 !important; left:0 !important;
        z-index:999996 !important;
        pointer-events:none !important;
        background:transparent !important;
      }
      .eq-phys-el {
        position:fixed !important;
        pointer-events:none !important;
        z-index:999997 !important;
        transform-origin: center center !important;
        transition: none !important;
      }
      #eq-warning {
        position:fixed; top:50%; left:50%;
        transform:translate(-50%,-50%);
        z-index:999998; pointer-events:none;
        font-family: monospace; font-size: clamp(18px,3vw,32px);
        font-weight:900; color:#ff2244;
        text-align:center; letter-spacing:0.15em;
        opacity:0; text-transform:uppercase;
        animation: eq-rgb-split 0.1s linear infinite;
      }
      #eq-debris-canvas {
        position:fixed; inset:0;
        z-index:999989; pointer-events:none;
        width:100%; height:100%;
      }
    `;
    document.head.appendChild(st);
  }

  function shakeBody(duration, intensity = 1) {
    document.documentElement.style.animation = `eq-shake ${0.08 / intensity}s ease-in-out infinite`;
    setTimeout(() => {
      document.documentElement.style.animation = '';
    }, duration);
  }

  function flash(color = '#fff', duration = 120) {
    const el = document.getElementById('eq-flash');
    if (!el) return;
    el.style.background = color;
    el.style.opacity = '1';
    el.style.transition = `opacity ${duration}ms ease`;
    setTimeout(() => { el.style.opacity = '0'; }, 16);
  }

  function glitchScreen(duration) {
    const scanlines = document.getElementById('eq-scanlines');
    const vignette = document.getElementById('eq-vignette');
    if (scanlines) scanlines.style.opacity = '1';
    if (vignette) vignette.style.opacity = '1';
    setTimeout(() => {
      if (scanlines) scanlines.style.opacity = '0';
      if (vignette) vignette.style.opacity = '0';
    }, duration);
  }

  function showWarning(text, duration = 600) {
    return new Promise(res => {
      const w = document.getElementById('eq-warning');
      if (!w) { res(); return; }
      w.textContent = text;
      w.style.opacity = '1';
      setTimeout(() => { w.style.opacity = '0'; setTimeout(res, 100); }, duration);
    });
  }

  function activateEntropy(mouseX, mouseY) {
    loadMatter(async () => {
      injectStyles();

      const W = window.innerWidth;
      const H = window.innerHeight;
      const { Engine, Render, Runner, Bodies, Composite, Body, Events, Vector } = Matter;

      const overlay      = document.createElement('div');   overlay.id = 'eq-overlay';
      const canvas       = document.createElement('canvas'); canvas.id = 'eq-canvas';
      const flashEl      = document.createElement('div');   flashEl.id = 'eq-flash';
      const vignette     = document.createElement('div');   vignette.id = 'eq-vignette';
      const scanlinesEl  = document.createElement('div');   scanlinesEl.id = 'eq-scanlines';
      const scanBar      = document.createElement('div');   scanBar.className = 'eq-scanline-bar';
      const warningEl    = document.createElement('div');   warningEl.id = 'eq-warning';
      const debrisCanvas = document.createElement('canvas'); debrisCanvas.id = 'eq-debris-canvas';

      debrisCanvas.width = W; debrisCanvas.height = H;
      canvas.width = W; canvas.height = H;
      overlay.appendChild(canvas);
      document.body.append(overlay, flashEl, vignette, scanlinesEl, scanBar, warningEl, debrisCanvas);

      const ctx = canvas.getContext('2d');
      const dctx = debrisCanvas.getContext('2d');

      flash('#fff', 60);
      shakeBody(700, 20);
      glitchScreen(600);

      await showWarning('SUDO RM -RF / --no-preserve-root', 1200);
      await showWarning('DELETING ROOT; ITS OVER', 700);
      await new Promise(r => setTimeout(r, 200));

      drawCracks(ctx, W, H);
      flash('rgba(255,30,50,0.6)', 200);
      shakeBody(600, 12);
      await new Promise(r => setTimeout(r, 700));

      const engine = Engine.create({ gravity: { y: 1.2 } });
      const runner = Runner.create();

      const render = Render.create({
        element: document.body,
        engine,
        options: { width: W, height: H, wireframes: false, background: 'transparent' }
      });
      render.canvas.classList.add('eq-matter-canvas');
      render.canvas.style.opacity = '0'; /* we handle our own visuals */

      const selectors = 'header, footer, section, article, aside, nav, h1, h2, h3, p, button, a, img, input, .card, [class*="rounded"], [class*="p-"], [class*="bg-"]';
      const domEls = Array.from(document.querySelectorAll(selectors)).filter(el => {
        const r = el.getBoundingClientRect();
        return r.width > 10 && r.height > 10 &&
               r.top < H && r.bottom > 0 &&
               r.left < W && r.right > 0 &&
               !el.closest('#eq-overlay') && !el.closest('#eq-warning');
      });

      const captured = [];
      domEls.forEach(el => {
        if (!captured.some(c => c.contains(el))) captured.push(el);
      });

      const physItems = [];
      captured.forEach(el => {
        const rect = el.getBoundingClientRect();
        const clone = el.cloneNode(true);
        clone.className += ' eq-phys-el';
        clone.style.left   = rect.left + 'px';
        clone.style.top    = rect.top  + 'px';
        clone.style.width  = rect.width  + 'px';
        clone.style.height = rect.height + 'px';
        clone.style.margin = '0';
        document.body.appendChild(clone);

        el._origVisibility = el.style.visibility;
        el.style.visibility = 'hidden';

        const body = Bodies.rectangle(
          rect.left + rect.width / 2,
          rect.top  + rect.height / 2,
          rect.width, rect.height,
          { restitution: 0.35, friction: 0.08, frictionAir: 0.005,
            label: 'domEl',
            collisionFilter: { category: 0x0001, mask: 0x0001 } }
        );

        physItems.push({ el: clone, body, rect });
        Composite.add(engine.world, body);
      });

      const ground = Bodies.rectangle(W/2, H + 55, W*2, 100, { isStatic:true });
      const wallL  = Bodies.rectangle(-55, H/2, 100, H*3, { isStatic:true });
      const wallR  = Bodies.rectangle(W+55, H/2, 100, H*3, { isStatic:true });
      Composite.add(engine.world, [ground, wallL, wallR]);

      flash('#ff2244', 100);
      shakeBody(800, 3);
      glitchScreen(800);

      Composite.allBodies(engine.world).forEach(b => {
        if (b.isStatic) return;
        const dx = b.position.x - mouseX;
        const dy = b.position.y - mouseY;
        const dist = Math.sqrt(dx*dx + dy*dy) || 1;
        const force = (0.08 + Math.random() * 0.12) * b.mass;
        Body.applyForce(b, b.position, {
          x: (dx / dist) * force + (Math.random()-0.5) * 0.05,
          y: (dy / dist) * force - Math.random() * 0.2
        });
        Body.setAngularVelocity(b, (Math.random()-0.5) * 0.5);
      });

      const debris = spawnDebris(mouseX, mouseY, 120);

      let running = true;
      Runner.run(runner, engine);

      function syncLoop() {
        if (!running) return;
        physItems.forEach(({ el, body, rect }) => {
          el.style.left      = (body.position.x - rect.width  / 2) + 'px';
          el.style.top       = (body.position.y - rect.height / 2) + 'px';
          el.style.transform = `rotate(${body.angle}rad)`;
          const vy = body.velocity.y;
          el.style.opacity = Math.max(0.1, 1 - Math.max(0, body.position.y - H) / 300);
        });
        updateDebris(dctx, debris, W, H);
        requestAnimationFrame(syncLoop);
      }
      syncLoop();

      const shakeSchedule = [300, 700, 1400, 2500, 3800];
      shakeSchedule.forEach((t, i) => {
        setTimeout(() => {
          shakeBody(300 + i * 30, 1 + i * 0.3);
          flash(i % 2 === 0 ? 'rgba(255,30,50,0.4)' : 'rgba(80,0,255,0.3)', 80);
          glitchScreen(250);
        }, t);
      });

      setTimeout(() => {
        Composite.allBodies(engine.world).forEach(b => {
          if (b.isStatic) return;
          Body.applyForce(b, b.position, {
            x: (Math.random()-0.5) * 0.15 * b.mass,
            y: -(Math.random() * 0.25) * b.mass
          });
        });
        flash('#fff', 60);
        shakeBody(500, 2);
        const more = spawnDebris(W/2, H/2, 60);
        debris.push(...more);
      }, 1800);

      const TOTAL = 1200;

      await new Promise(r => setTimeout(r, TOTAL - 1500));
      await showWarning('/ -fr mr odus', 800);

      const fadeOverlay = document.createElement('div');
      fadeOverlay.style.cssText = `position:fixed;inset:0;z-index:1000000;
        background:#000;opacity:0;pointer-events:none;
        transition:opacity 1.2s ease;`;
      document.body.appendChild(fadeOverlay);
      requestAnimationFrame(() => { fadeOverlay.style.opacity = '1'; });

      await new Promise(r => setTimeout(r, 600));

      running = false;
      Runner.stop(runner);
      Composite.clear(engine.world);
      Engine.clear(engine);
      render.canvas.remove();
      Render.stop(render);

      physItems.forEach(({ el, body }) => {
        el.remove();
      });
      captured.forEach(el => {
        el.style.visibility = el._origVisibility || '';
      });

      overlay.remove();
      flashEl.remove();
      vignette.remove();
      scanlinesEl.remove();
      scanBar.remove();
      warningEl.remove();
      debrisCanvas.remove();
      fadeOverlay.remove();
      document.documentElement.style.animation = '';
      document.body.style.overflow = '';
    });
  }


  function drawCracks(ctx, W, H) {
    ctx.save();
    const cx = W / 2 + (Math.random()-0.5)*W*0.3;
    const cy = H / 2 + (Math.random()-0.5)*H*0.3;
    const branches = 12 + Math.floor(Math.random()*6);

    for (let b = 0; b < branches; b++) {
      const angle = (b / branches) * Math.PI * 2 + (Math.random()-0.5)*0.3;
      const length = (0.4 + Math.random()*0.5) * Math.max(W,H);
      let x = cx, y = cy;
      let a = angle;

      ctx.beginPath();
      ctx.moveTo(x, y);

      for (let seg = 0; seg < 8; seg++) {
        a += (Math.random()-0.5)*0.5;
        const segLen = length / 8 * (1 - seg * 0.08);
        x += Math.cos(a) * segLen;
        y += Math.sin(a) * segLen;
        ctx.lineTo(x, y);

        if (Math.random() < 0.5) {
          const sa = a + (Math.random()-0.5)*1.2;
          ctx.moveTo(x, y);
          ctx.lineTo(
            x + Math.cos(sa)*segLen*0.5,
            y + Math.sin(sa)*segLen*0.5
          );
          ctx.moveTo(x, y);
        }
      }

      ctx.strokeStyle = `rgba(255,${30+b*5},${50+b*3},${0.6+Math.random()*0.4})`;
      ctx.lineWidth = Math.max(0.5, 2.5 - b * 0.15);
      ctx.shadowColor = '#ff2244';
      ctx.shadowBlur = 8;
      ctx.stroke();
    }

    const grad = ctx.createRadialGradient(cx,cy,0,cx,cy,80);
    grad.addColorStop(0,'rgba(255,255,255,0.9)');
    grad.addColorStop(0.3,'rgba(255,80,40,0.5)');
    grad.addColorStop(1,'rgba(255,0,0,0)');
    ctx.beginPath();
    ctx.arc(cx,cy,80,0,Math.PI*2);
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.restore();
  }
  function spawnDebris(ox, oy, count) {
    const particles = [];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 3 + Math.random() * 12;
      particles.push({
        x: ox + (Math.random()-0.5)*60,
        y: oy + (Math.random()-0.5)*60,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - Math.random()*4,
        r: 1.5 + Math.random() * 5,
        life: 1,
        decay: 0.008 + Math.random()*0.018,
        hue: Math.random() < 0.5 ? 0 : (Math.random() < 0.5 ? 30 : 260),
        trail: [],
      });
    }
    return particles;
  }

  function updateDebris(ctx, particles, W, H) {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      if (p.life <= 0) return;
      p.trail.push({ x: p.x, y: p.y });
      if (p.trail.length > 8) p.trail.shift();

      p.vy += 0.25;
      p.vx *= 0.985;
      p.x += p.vx;
      p.y += p.vy;
      p.life -= p.decay;

      if (p.life <= 0) return;

      if (p.trail.length > 1) {
        ctx.beginPath();
        ctx.moveTo(p.trail[0].x, p.trail[0].y);
        p.trail.forEach(t => ctx.lineTo(t.x, t.y));
        ctx.strokeStyle = `hsla(${p.hue},100%,65%,${p.life * 0.4})`;
        ctx.lineWidth = p.r * 0.6;
        ctx.stroke();
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * p.life, 0, Math.PI*2);
      ctx.fillStyle = `hsla(${p.hue},100%,70%,${p.life})`;
      ctx.shadowColor = `hsl(${p.hue},100%,60%)`;
      ctx.shadowBlur = p.r * 3;
      ctx.fill();
    });
  }
  function boot() {
    document.querySelectorAll('.clickeme').forEach(el => {
      el.addEventListener('click', e => {
        if (e.detail === 3) activateEntropy(e.clientX, e.clientY);
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

})();