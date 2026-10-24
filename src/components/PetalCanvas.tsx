import React, { useEffect, useRef } from 'react';

export const PetalCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Blossom[] = [];

    class Blossom {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      rotation: number;
      rotationSpeed: number;
      hue: number;
      opacity: number;
      type: 'petal' | 'heart' | 'sparkle';

      constructor() {
        this.x = Math.random() * (canvas?.width || window.innerWidth);
        this.y = Math.random() * -50;
        this.size = Math.random() * 7 + 6;
        this.speedX = Math.random() * 1.5 - 0.75;
        this.speedY = Math.random() * 1.2 + 0.8;
        this.rotation = Math.random() * 360;
        this.rotationSpeed = Math.random() * 1.8 - 0.9;
        this.hue = Math.random() > 0.6 ? 340 : 350; // soft rose / cherry blossom
        this.opacity = Math.random() * 0.35 + 0.35;
        const rand = Math.random();
        this.type = rand > 0.85 ? 'heart' : rand > 0.7 ? 'sparkle' : 'petal';
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
          // Floating tiny love heart
          ctx.fillStyle = `rgba(244, 114, 182, ${this.opacity * 0.8})`;
          ctx.beginPath();
          const s = this.size * 0.6;
          ctx.moveTo(0, s * 0.3);
          ctx.bezierCurveTo(-s, -s * 0.5, -s * 0.5, -s, 0, -s * 0.3);
          ctx.bezierCurveTo(s * 0.5, -s, s, -s * 0.5, 0, s * 0.3);
          ctx.fill();
        } else if (this.type === 'sparkle') {
          // Sparkling starlight speck
          ctx.fillStyle = `rgba(251, 191, 36, ${this.opacity})`;
          ctx.beginPath();
          ctx.arc(0, 0, this.size * 0.3, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Realistic Sakura Flower Petal
          const grad = ctx.createLinearGradient(0, -this.size, 0, this.size);
          grad.addColorStop(0, `hsla(${this.hue}, 90%, 88%, ${this.opacity})`);
          grad.addColorStop(1, `hsla(${this.hue}, 95%, 78%, ${this.opacity})`);

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.moveTo(0, -this.size);
          ctx.bezierCurveTo(this.size * 0.8, -this.size * 0.8, this.size * 0.9, this.size * 0.4, 0, this.size);
          ctx.bezierCurveTo(-this.size * 0.9, this.size * 0.4, -this.size * 0.8, -this.size * 0.8, 0, -this.size);
          ctx.fill();
        }

        ctx.restore();
      }
    }

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particles = Array.from({ length: 35 }, () => new Blossom());
    };

    window.addEventListener('resize', resize);
    resize();

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
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

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0 opacity-80" />;
};
