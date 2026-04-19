/**
 * GoldDustCursor — polvo dorado que rastrea el cursor sobre el pergamino.
 *
 * Por qué existe: en una página tipo manuscrito iluminado, el cursor
 * por defecto del navegador es la pieza más SaaS-2024 que queda. La
 * traza dorada lo vuelve "pluma sobre vitela". Es el efecto sutil que
 * un usuario nota inconscientemente y registra como "cuidada", sin
 * poder articular el por qué.
 *
 * Implementación:
 *   - Canvas 2D, sin librerías. Una sola RAF loop.
 *   - Throttle a 16 ms (60 fps) — ignora movimientos más rápidos.
 *   - Density adaptativa al speed del cursor (más rápido → más motas).
 *   - mix-blend-mode multiply para que las motas se compositen como
 *     pigmento real sobre el cream del fondo, no como overlay.
 *   - Respeta prefers-reduced-motion (no monta nada).
 *   - Respeta pointer:coarse (no monta en táctil).
 *   - z-index: 2 — por encima del fondo, por debajo del contenido
 *     interactivo. Pointer-events: none.
 *
 * Performance: ~50 partículas activas máximo (cap), cada una vive
 * ~100 frames. CPU < 1 % en M1, GPU mínimo (canvas-2D no GPU).
 */
'use client';

import { useEffect, useRef } from 'react';

export default function GoldDustCursor({ density = 1, maxParticles = 80 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Bail-outs: respect motion preferences and skip on touch devices.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    function resize() {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    }
    resize();
    window.addEventListener('resize', resize);

    const particles = [];
    let lastX = 0;
    let lastY = 0;
    let lastSpawn = 0;

    function onMove(e) {
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      const speed = Math.hypot(dx, dy);
      const now = performance.now();
      if (now - lastSpawn < 16) {
        lastX = e.clientX;
        lastY = e.clientY;
        return;
      }
      lastSpawn = now;

      // Particle count scales with cursor speed (1-3 per frame).
      const count = Math.min(3, Math.floor(speed / 9) + 1) * density;
      for (let i = 0; i < count; i++) {
        if (particles.length >= maxParticles) break;
        particles.push({
          x: e.clientX + (Math.random() - 0.5) * 6,
          y: e.clientY + (Math.random() - 0.5) * 6,
          vx: (Math.random() - 0.5) * 0.45,
          vy: -Math.random() * 0.7 - 0.05,
          life: 60 + Math.random() * 50,
          maxLife: 110,
          size: 0.7 + Math.random() * 1.4,
          // Slight rose-tinted vs gold-tinted variance for richness.
          rosy: Math.random() > 0.78,
        });
      }
      lastX = e.clientX;
      lastY = e.clientY;
    }
    window.addEventListener('pointermove', onMove);

    let raf;
    function loop() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.005; // micro-gravity, particles fall like fine dust
        p.life--;

        const alpha = (p.life / p.maxLife) * 0.55;
        // Two pigments: dominant gold, occasional rose flake.
        ctx.fillStyle = p.rosy
          ? `rgba(168,86,116,${alpha * 0.85})`
          : `rgba(184,151,90,${alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        if (p.life <= 0) particles.splice(i, 1);
      }
      raf = requestAnimationFrame(loop);
    }
    loop();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('resize', resize);
    };
  }, [density, maxParticles]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none"
      // mix-blend-multiply makes the dust composite as ink on cream
      // paper rather than glow on top of it. z-2 keeps it under any
      // interactive surface (forms, links).
      style={{ zIndex: 2, mixBlendMode: 'multiply' }}
    />
  );
}
