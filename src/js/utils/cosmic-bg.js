/* ============================================================
   GENESIS — Cosmic Background Engine
   Animated galaxies, planet-stars, asteroids & satellites
   ============================================================ */

export class CosmicBackground {
  constructor(container, options = {}) {
    this.container = container;
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.animationId = null;
    this.time = 0;

    // Configuration
    this.config = {
      starCount: options.starCount || 350,
      planetStarCount: options.planetStarCount || 8,
      asteroidCount: options.asteroidCount || 12,
      satelliteCount: options.satelliteCount || 4,
      nebulaCount: options.nebulaCount || 5,
      shootingStarInterval: options.shootingStarInterval || 400,  // frames
      opacity: options.opacity ?? 1,
      subtle: options.subtle || false,  // For app shell (reduced effects)
    };

    if (this.config.subtle) {
      this.config.starCount = 150;
      this.config.planetStarCount = 4;
      this.config.asteroidCount = 5;
      this.config.satelliteCount = 2;
      this.config.nebulaCount = 3;
    }

    // Style canvas
    this.canvas.style.cssText = `
      position: absolute;
      top: 0; left: 0;
      width: 100%; height: 100%;
      pointer-events: none;
      z-index: 0;
      opacity: ${this.config.opacity};
    `;

    this.container.style.position = this.container.style.position || 'relative';
    this.container.insertBefore(this.canvas, this.container.firstChild);

    // Initialize entities
    this.stars = [];
    this.planetStars = [];
    this.asteroids = [];
    this.satellites = [];
    this.nebulae = [];
    this.shootingStars = [];

    this._resize();
    this._createEntities();

    // Resize observer
    this._resizeObserver = new ResizeObserver(() => this._resize());
    this._resizeObserver.observe(this.container);

    // Start animation
    this._animate();
  }

  _resize() {
    const rect = this.container.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio, 2);
    this.width = rect.width;
    this.height = rect.height;
    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    this.ctx.scale(dpr, dpr);
  }

  _createEntities() {
    const { width: w, height: h } = this;

    // ── Stars ──────────────────────────────────────────
    this.stars = Array.from({ length: this.config.starCount }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      size: 0.3 + Math.random() * 1.2,
      brightness: 0.3 + Math.random() * 0.7,
      twinkleSpeed: 0.005 + Math.random() * 0.02,
      twinkleOffset: Math.random() * Math.PI * 2,
      color: this._randomStarColor(),
    }));

    // ── Planet-like Stars (larger, with glow rings) ───
    this.planetStars = Array.from({ length: this.config.planetStarCount }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      size: 3 + Math.random() * 5,
      color: this._randomPlanetColor(),
      glowSize: 8 + Math.random() * 15,
      pulseSpeed: 0.003 + Math.random() * 0.008,
      pulseOffset: Math.random() * Math.PI * 2,
      hasRing: Math.random() > 0.5,
      ringAngle: Math.random() * Math.PI * 0.3,
    }));

    // ── Asteroids (irregular shapes drifting) ─────────
    this.asteroids = Array.from({ length: this.config.asteroidCount }, () => {
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.15 + Math.random() * 0.4;
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        size: 1.5 + Math.random() * 3,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.03,
        vertices: this._generateAsteroidShape(),
        color: `rgba(${160 + Math.random() * 40}, ${140 + Math.random() * 30}, ${120 + Math.random() * 30}`,
        opacity: 0.4 + Math.random() * 0.4,
        trail: [],
      };
    });

    // ── Satellites (orbiting with trail) ──────────────
    this.satellites = Array.from({ length: this.config.satelliteCount }, () => ({
      centerX: w * (0.2 + Math.random() * 0.6),
      centerY: h * (0.2 + Math.random() * 0.6),
      orbitRadiusX: 80 + Math.random() * 200,
      orbitRadiusY: 40 + Math.random() * 100,
      angle: Math.random() * Math.PI * 2,
      speed: 0.003 + Math.random() * 0.006,
      size: 1.5 + Math.random() * 1.5,
      tilt: (Math.random() - 0.5) * 0.5,
      color: '#c47a5a',
      panelFlash: Math.random() * Math.PI * 2,
      trail: [],
    }));

    // ── Nebulae (soft galaxy clouds) ──────────────────
    this.nebulae = Array.from({ length: this.config.nebulaCount }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      radiusX: 100 + Math.random() * 250,
      radiusY: 60 + Math.random() * 150,
      rotation: Math.random() * Math.PI,
      color: this._randomNebulaColor(),
      opacity: 0.015 + Math.random() * 0.025,
      driftX: (Math.random() - 0.5) * 0.05,
      driftY: (Math.random() - 0.5) * 0.03,
    }));

    // ── Shooting Stars ───────────────────────────────
    this.shootingStars = [];
  }

  _randomStarColor() {
    const colors = [
      '#e8e4e0', '#d4c0b0', '#f0ebe6', '#c8c0b8',
      '#d4967a', '#96b8a8', '#a4bdd0',  // warm accent stars
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  _randomPlanetColor() {
    const colors = [
      '#c47a5a', '#7a9e8e', '#8ba5b8', '#c4a35a',
      '#b85c5c', '#6b9e7a', '#a87a8a',
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  _randomNebulaColor() {
    const colors = [
      'rgba(196, 122, 90,',   // terra cotta
      'rgba(122, 158, 142,',  // sage
      'rgba(139, 165, 184,',  // steel blue
      'rgba(196, 163, 90,',   // warm amber
      'rgba(107, 158, 122,',  // green
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  _generateAsteroidShape() {
    const points = 6 + Math.floor(Math.random() * 4);
    return Array.from({ length: points }, (_, i) => {
      const angle = (i / points) * Math.PI * 2;
      const r = 0.6 + Math.random() * 0.4;
      return { x: Math.cos(angle) * r, y: Math.sin(angle) * r };
    });
  }

  _animate() {
    this.time++;
    const ctx = this.ctx;
    const { width: w, height: h } = this;

    // Clear
    ctx.clearRect(0, 0, w, h);

    // Draw nebulae first (background layer)
    this._drawNebulae(ctx);

    // Draw stars
    this._drawStars(ctx);

    // Draw planet-like stars
    this._drawPlanetStars(ctx);

    // Draw asteroids
    this._drawAsteroids(ctx);

    // Draw satellites
    this._drawSatellites(ctx);

    // Draw shooting stars
    this._drawShootingStars(ctx);

    // Spawn shooting star occasionally
    if (this.time % this.config.shootingStarInterval === 0) {
      this._spawnShootingStar();
    }

    this.animationId = requestAnimationFrame(() => this._animate());
  }

  _drawNebulae(ctx) {
    this.nebulae.forEach(n => {
      n.x += n.driftX;
      n.y += n.driftY;

      // Wrap around
      if (n.x > this.width + n.radiusX) n.x = -n.radiusX;
      if (n.x < -n.radiusX) n.x = this.width + n.radiusX;
      if (n.y > this.height + n.radiusY) n.y = -n.radiusY;
      if (n.y < -n.radiusY) n.y = this.height + n.radiusY;

      ctx.save();
      ctx.translate(n.x, n.y);
      ctx.rotate(n.rotation);

      const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, n.radiusX);
      gradient.addColorStop(0, `${n.color} ${n.opacity})`);
      gradient.addColorStop(0.4, `${n.color} ${n.opacity * 0.5})`);
      gradient.addColorStop(1, `${n.color} 0)`);

      ctx.fillStyle = gradient;
      ctx.scale(1, n.radiusY / n.radiusX);
      ctx.beginPath();
      ctx.arc(0, 0, n.radiusX, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
  }

  _drawStars(ctx) {
    this.stars.forEach(star => {
      const twinkle = Math.sin(this.time * star.twinkleSpeed + star.twinkleOffset);
      const alpha = star.brightness * (0.6 + twinkle * 0.4);

      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fillStyle = star.color;
      ctx.globalAlpha = Math.max(0.1, alpha);
      ctx.fill();
      ctx.globalAlpha = 1;
    });
  }

  _drawPlanetStars(ctx) {
    this.planetStars.forEach(p => {
      const pulse = Math.sin(this.time * p.pulseSpeed + p.pulseOffset);
      const glowAlpha = 0.08 + pulse * 0.04;

      // Outer glow
      const gradient = ctx.createRadialGradient(p.x, p.y, p.size * 0.5, p.x, p.y, p.glowSize);
      gradient.addColorStop(0, this._colorWithAlpha(p.color, 0.15));
      gradient.addColorStop(0.5, this._colorWithAlpha(p.color, glowAlpha));
      gradient.addColorStop(1, this._colorWithAlpha(p.color, 0));
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.glowSize, 0, Math.PI * 2);
      ctx.fill();

      // Core sphere with gradient
      const coreGrad = ctx.createRadialGradient(
        p.x - p.size * 0.2, p.y - p.size * 0.2, 0,
        p.x, p.y, p.size
      );
      coreGrad.addColorStop(0, this._lightenColor(p.color, 30));
      coreGrad.addColorStop(0.7, p.color);
      coreGrad.addColorStop(1, this._darkenColor(p.color, 40));
      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();

      // Optional ring
      if (p.hasRing) {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.ringAngle);
        ctx.scale(1, 0.3);
        ctx.strokeStyle = this._colorWithAlpha(p.color, 0.25);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(0, 0, p.size * 2.2, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0, 0, p.size * 2.8, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }
    });
  }

  _drawAsteroids(ctx) {
    this.asteroids.forEach(a => {
      // Update position
      a.x += a.vx;
      a.y += a.vy;
      a.rotation += a.rotationSpeed;

      // Wrap around screen
      if (a.x > this.width + 20) a.x = -20;
      if (a.x < -20) a.x = this.width + 20;
      if (a.y > this.height + 20) a.y = -20;
      if (a.y < -20) a.y = this.height + 20;

      // Trail
      a.trail.push({ x: a.x, y: a.y });
      if (a.trail.length > 8) a.trail.shift();

      // Draw trail
      if (a.trail.length > 1) {
        for (let i = 1; i < a.trail.length; i++) {
          const alpha = (i / a.trail.length) * a.opacity * 0.3;
          ctx.beginPath();
          ctx.arc(a.trail[i].x, a.trail[i].y, a.size * (i / a.trail.length) * 0.5, 0, Math.PI * 2);
          ctx.fillStyle = `${a.color}, ${alpha})`;
          ctx.fill();
        }
      }

      // Draw asteroid body (irregular polygon)
      ctx.save();
      ctx.translate(a.x, a.y);
      ctx.rotate(a.rotation);
      ctx.beginPath();
      a.vertices.forEach((v, i) => {
        const px = v.x * a.size;
        const py = v.y * a.size;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.closePath();

      // Asteroid shading
      const aGrad = ctx.createRadialGradient(-a.size * 0.2, -a.size * 0.2, 0, 0, 0, a.size);
      aGrad.addColorStop(0, `${a.color}, ${a.opacity + 0.1})`);
      aGrad.addColorStop(1, `${a.color}, ${a.opacity * 0.5})`);
      ctx.fillStyle = aGrad;
      ctx.fill();

      // Subtle edge highlight
      ctx.strokeStyle = `${a.color}, ${a.opacity * 0.3})`;
      ctx.lineWidth = 0.5;
      ctx.stroke();
      ctx.restore();
    });
  }

  _drawSatellites(ctx) {
    this.satellites.forEach(sat => {
      // Update orbital position
      sat.angle += sat.speed;
      sat.panelFlash += 0.05;

      const x = sat.centerX + Math.cos(sat.angle) * sat.orbitRadiusX;
      const y = sat.centerY + Math.sin(sat.angle + sat.tilt) * sat.orbitRadiusY;

      // Trail
      sat.trail.push({ x, y });
      if (sat.trail.length > 20) sat.trail.shift();

      // Draw orbital path (faint)
      ctx.save();
      ctx.translate(sat.centerX, sat.centerY);
      ctx.strokeStyle = 'rgba(196, 122, 90, 0.03)';
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.ellipse(0, 0, sat.orbitRadiusX, sat.orbitRadiusY, sat.tilt, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // Draw trail
      for (let i = 1; i < sat.trail.length; i++) {
        const alpha = (i / sat.trail.length) * 0.15;
        ctx.beginPath();
        ctx.moveTo(sat.trail[i - 1].x, sat.trail[i - 1].y);
        ctx.lineTo(sat.trail[i].x, sat.trail[i].y);
        ctx.strokeStyle = `rgba(196, 122, 90, ${alpha})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }

      // Draw satellite body
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(sat.angle * 2);

      // Central body
      ctx.fillStyle = '#9a9590';
      ctx.fillRect(-sat.size * 0.5, -sat.size * 0.3, sat.size, sat.size * 0.6);

      // Solar panels (two rectangles on sides)
      const panelFlicker = 0.4 + Math.sin(sat.panelFlash) * 0.3;
      ctx.fillStyle = `rgba(122, 158, 142, ${panelFlicker})`;
      ctx.fillRect(-sat.size * 2.5, -sat.size * 0.2, sat.size * 1.8, sat.size * 0.4);
      ctx.fillRect(sat.size * 0.7, -sat.size * 0.2, sat.size * 1.8, sat.size * 0.4);

      // Panel grid lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 0.3;
      for (let i = 0; i < 4; i++) {
        const lx = -sat.size * 2.5 + (i * sat.size * 0.45);
        ctx.beginPath();
        ctx.moveTo(lx, -sat.size * 0.2);
        ctx.lineTo(lx, sat.size * 0.2);
        ctx.stroke();
        const rx = sat.size * 0.7 + (i * sat.size * 0.45);
        ctx.beginPath();
        ctx.moveTo(rx, -sat.size * 0.2);
        ctx.lineTo(rx, sat.size * 0.2);
        ctx.stroke();
      }

      // Antenna dot
      ctx.fillStyle = `rgba(196, 122, 90, ${0.5 + Math.sin(sat.panelFlash * 2) * 0.5})`;
      ctx.beginPath();
      ctx.arc(0, -sat.size * 0.6, 0.8, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    });
  }

  _drawShootingStars(ctx) {
    this.shootingStars = this.shootingStars.filter(s => {
      s.x += s.vx;
      s.y += s.vy;
      s.life -= 1;
      s.trail.push({ x: s.x, y: s.y });
      if (s.trail.length > 25) s.trail.shift();

      const alpha = Math.max(0, s.life / s.maxLife);

      // Draw trail
      for (let i = 1; i < s.trail.length; i++) {
        const t = i / s.trail.length;
        ctx.beginPath();
        ctx.moveTo(s.trail[i - 1].x, s.trail[i - 1].y);
        ctx.lineTo(s.trail[i].x, s.trail[i].y);
        ctx.strokeStyle = `rgba(232, 228, 224, ${t * alpha * 0.6})`;
        ctx.lineWidth = t * 2;
        ctx.stroke();
      }

      // Head glow
      const headGrad = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, 4);
      headGrad.addColorStop(0, `rgba(232, 228, 224, ${alpha * 0.8})`);
      headGrad.addColorStop(1, `rgba(232, 228, 224, 0)`);
      ctx.fillStyle = headGrad;
      ctx.beginPath();
      ctx.arc(s.x, s.y, 4, 0, Math.PI * 2);
      ctx.fill();

      return s.life > 0;
    });
  }

  _spawnShootingStar() {
    const side = Math.floor(Math.random() * 2); // top or right
    let x, y, vx, vy;

    if (side === 0) {
      x = Math.random() * this.width;
      y = -10;
      vx = (Math.random() - 0.3) * 4;
      vy = 3 + Math.random() * 4;
    } else {
      x = this.width + 10;
      y = Math.random() * this.height * 0.5;
      vx = -(3 + Math.random() * 4);
      vy = 1 + Math.random() * 3;
    }

    this.shootingStars.push({
      x, y, vx, vy,
      life: 60 + Math.random() * 40,
      maxLife: 100,
      trail: [],
    });
  }

  // ── Color Utility Helpers ───────────────────────────
  _colorWithAlpha(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  _lightenColor(hex, amount) {
    const r = Math.min(255, parseInt(hex.slice(1, 3), 16) + amount);
    const g = Math.min(255, parseInt(hex.slice(3, 5), 16) + amount);
    const b = Math.min(255, parseInt(hex.slice(5, 7), 16) + amount);
    return `rgb(${r}, ${g}, ${b})`;
  }

  _darkenColor(hex, amount) {
    const r = Math.max(0, parseInt(hex.slice(1, 3), 16) - amount);
    const g = Math.max(0, parseInt(hex.slice(3, 5), 16) - amount);
    const b = Math.max(0, parseInt(hex.slice(5, 7), 16) - amount);
    return `rgb(${r}, ${g}, ${b})`;
  }

  // ── Public API ──────────────────────────────────────
  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    if (this._resizeObserver) {
      this._resizeObserver.disconnect();
    }
    if (this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }
  }

  pause() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  resume() {
    if (!this.animationId) {
      this._animate();
    }
  }
}
