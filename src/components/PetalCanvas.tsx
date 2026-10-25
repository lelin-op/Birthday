import React, { useEffect, useRef } from 'react';

export const PetalCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;

    // 1. Twinkling Stars in Background
    interface Star {
      x: number;
      y: number;
      radius: number;
      alpha: number;
      speed: number;
    }
    const stars: Star[] = Array.from({ length: 40 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      radius: Math.random() * 1.5 + 0.5,
      alpha: Math.random(),
      speed: Math.random() * 0.02 + 0.005,
    }));

    // 2. Drifting Sakura Petals, Neon Hearts, and Golden Fireflies
    class MagicParticle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      rotation: number;
      rotationSpeed: number;
      opacity: number;
      type: 'petal' | 'heart' | 'sparkle' | 'star';
      color: string;

      constructor(initY?: number) {
        this.x = Math.random() * (canvas?.width || window.innerWidth);
        this.y = initY !== undefined ? initY : Math.random() * -60;
        this.size = Math.random() * 7 + 5;
        this.speedX = Math.random() * 1.2 - 0.6;
        this.speedY = Math.random() * 1.2 + 0.6;
        this.rotation = Math.random() * 360;
        this.rotationSpeed = Math.random() * 1.2 - 0.6;
        this.opacity = Math.random() * 0.5 + 0.4;

        const rand = Math.random();
        if (rand > 0.82) {
          this.type = 'heart';
          this.color = Math.random() > 0.5 ? '#f43f5e' : '#ec4899'; // neon pink
        } else if (rand > 0.65) {
          this.type = 'sparkle';
          this.color = '#fbbf24'; // gold sparkle
        } else if (rand > 0.5) {
          this.type = 'star';
          this.color = '#c084fc'; // purple star
        } else {
          this.type = 'petal';
          this.color = '#fbcfe8'; // soft pink sakura
        }
      }

      update() {
        this.x += this.speedX + Math.sin(this.y / 45) * 0.8;
        this.y += this.speedY;
        this.rotation += this.rotationSpeed;

        if (this.y > (canvas?.height || window.innerHeight) + 20) {
          this.y = -20;
          this.x = Math.random() * (canvas?.width || window.innerWidth);
        }
      }

      draw() {
        if (!ctx) return;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate((this.rotation * Math.PI) / 180);

        if (this.type === 'heart') {
          // Fast, crisp Neon Heart
          ctx.fillStyle = this.color;
          ctx.globalAlpha = this.opacity;
          ctx.beginPath();
          const s = this.size * 0.7;
          ctx.moveTo(0, s * 0.3);
          ctx.bezierCurveTo(-s, -s * 0.5, -s * 0.5, -s, 0, -s * 0.3);
          ctx.bezierCurveTo(s * 0.5, -s, s, -s * 0.5, 0, s * 0.3);
          ctx.fill();
        } else if (this.type === 'sparkle' || this.type === 'star') {
          // Twinkling Starlight Speck with cross flare
          ctx.fillStyle = this.color;
          ctx.globalAlpha = this.opacity;
          ctx.beginPath();
          const r = this.size * 0.4;
          ctx.moveTo(0, -r * 1.5);
          ctx.lineTo(r * 0.3, -r * 0.3);
          ctx.lineTo(r * 1.5, 0);
          ctx.lineTo(r * 0.3, r * 0.3);
          ctx.lineTo(0, r * 1.5);
          ctx.lineTo(-r * 0.3, r * 0.3);
          ctx.lineTo(-r * 1.5, 0);
          ctx.lineTo(-r * 0.3, -r * 0.3);
          ctx.closePath();
          ctx.fill();
        } else {
          // Delicate Sakura Blossom Petal
          ctx.fillStyle = '#f472b6';
          ctx.globalAlpha = this.opacity;
          ctx.beginPath();
          ctx.moveTo(0, -this.size);
          ctx.bezierCurveTo(this.size * 0.85, -this.size * 0.8, this.size * 0.9, this.size * 0.4, 0, this.size);
          ctx.bezierCurveTo(-this.size * 0.9, this.size * 0.4, -this.size * 0.85, -this.size * 0.8, 0, -this.size);
          ctx.fill();
        }

        ctx.restore();
      }
    }

    let particles: MagicParticle[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particles = Array.from({ length: 35 }, () => new MagicParticle(Math.random() * window.innerHeight));
    };

    window.addEventListener('resize', resize);
    resize();

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. Draw Twinkling Stars
      ctx.fillStyle = '#ffffff';
      stars.forEach((star) => {
        star.alpha += star.speed;
        const currentAlpha = 0.3 + Math.sin(star.alpha) * 0.5;
        ctx.globalAlpha = Math.max(0.1, currentAlpha);
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // 2. Draw Moving Magic Particles
      particles.forEach((p) => {
        p.update();
        p.draw();
      });

      animationFrameId = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0 will-change-transform" />;
};
