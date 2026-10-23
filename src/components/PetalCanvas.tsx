import React, { useEffect, useRef } from 'react';

export const PetalCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Petal[] = [];

    class Petal {
      x: number; y: number; size: number; speedX: number; speedY: number; rotation: number; rotationSpeed: number;
      constructor() {
        this.x = Math.random() * canvas!.width;
        this.y = -20;
        this.size = Math.random() * 8 + 5;
        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * 1 + 1;
        this.rotation = Math.random() * 360;
        this.rotationSpeed = Math.random() * 2 - 1;
      }
      update() {
        this.x += this.speedX + Math.sin(this.y / 50);
        this.y += this.speedY;
        this.rotation += this.rotationSpeed;
        if (this.y > canvas!.height) {
          this.y = -20;
          this.x = Math.random() * canvas!.width;
        }
      }
      draw() {
        ctx!.save();
        ctx!.translate(this.x, this.y);
        ctx!.rotate((this.rotation * Math.PI) / 180);
        ctx!.fillStyle = '#fbcfe8';
        ctx!.beginPath();
        ctx!.ellipse(0, 0, this.size, this.size / 2, 0, 0, Math.PI * 2);
        ctx!.fill();
        ctx!.restore();
      }
    }

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particles = Array.from({ length: 40 }, () => new Petal());
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

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />;
};
