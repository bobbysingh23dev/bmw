"use client";

import { useEffect, useRef } from "react";

const PETAL_COLORS = ["#c9506a", "#f2a3b5", "#9b1d33", "#e8962f", "#f7c6d0", "#e2c172"];

type Petal = { x: number; y: number; s: number; vy: number; vx: number; rot: number; vr: number; sway: number; phase: number; color: string };
type Dust = { x: number; y: number; vx: number; vy: number; life: number; max: number; r: number };

/**
 * One full-screen canvas: drifting rose petals, a slow field of gold motes,
 * and a sparkle trail that follows the pointer. Bursts on `burst()`.
 */
export default function Atmosphere({ burstKey }: { burstKey: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const api = useRef<{ burst: () => void } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0, h = 0, dpr = 1, raf = 0;
    const petals: Petal[] = [];
    const dust: Dust[] = [];

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const makePetal = (x = Math.random() * w, y = -20 - Math.random() * h): Petal => ({
      x, y,
      s: 7 + Math.random() * 9,
      vy: 0.35 + Math.random() * 0.6,
      vx: (Math.random() - 0.5) * 0.3,
      rot: Math.random() * Math.PI * 2,
      vr: (Math.random() - 0.5) * 0.03,
      sway: 0.6 + Math.random() * 1.2,
      phase: Math.random() * Math.PI * 2,
      color: PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)],
    });
    const count = w < 640 ? 14 : 24;
    if (!reduce) for (let i = 0; i < count; i++) petals.push(makePetal(Math.random() * w, Math.random() * h));

    const ambientDust = () => {
      if (dust.length < (w < 640 ? 40 : 70)) {
        dust.push({ x: Math.random() * w, y: h + 10, vx: (Math.random() - 0.5) * 0.15, vy: -0.15 - Math.random() * 0.35, life: 0, max: 400 + Math.random() * 500, r: 0.6 + Math.random() * 1.4 });
      }
    };

    const onMove = (e: PointerEvent) => {
      if (reduce) return;
      for (let i = 0; i < 2; i++) {
        dust.push({ x: e.clientX, y: e.clientY, vx: (Math.random() - 0.5) * 1.2, vy: (Math.random() - 0.5) * 1.2 - 0.3, life: 0, max: 40 + Math.random() * 40, r: 0.8 + Math.random() * 1.8 });
      }
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    api.current = {
      burst() {
        if (reduce) return;
        const cx = w / 2, cy = h / 2;
        for (let i = 0; i < 70; i++) {
          const a = Math.random() * Math.PI * 2;
          const sp = 4 + Math.random() * 9;
          const p = makePetal(cx, cy);
          p.vx = Math.cos(a) * sp;
          p.vy = Math.sin(a) * sp - 3;
          p.s *= 1.2;
          petals.push(p);
        }
        for (let i = 0; i < 120; i++) {
          const a = Math.random() * Math.PI * 2, sp = 1 + Math.random() * 7;
          dust.push({ x: cx, y: cy, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: 0, max: 60 + Math.random() * 80, r: 1 + Math.random() * 2.2 });
        }
      },
    };

    const drawPetal = (p: Petal) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.scale(1, 0.55 + 0.45 * Math.sin(p.phase * 2));
      ctx.fillStyle = p.color;
      ctx.globalAlpha = 0.85;
      ctx.beginPath();
      ctx.moveTo(0, -p.s);
      ctx.bezierCurveTo(p.s * 0.9, -p.s * 0.5, p.s * 0.7, p.s * 0.6, 0, p.s);
      ctx.bezierCurveTo(-p.s * 0.7, p.s * 0.6, -p.s * 0.9, -p.s * 0.5, 0, -p.s);
      ctx.fill();
      ctx.globalAlpha = 0.35;
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 0.6;
      ctx.beginPath();
      ctx.moveTo(0, -p.s * 0.8);
      ctx.lineTo(0, p.s * 0.8);
      ctx.stroke();
      ctx.restore();
    };

    const frame = () => {
      ctx.clearRect(0, 0, w, h);
      ambientDust();

      ctx.globalCompositeOperation = "lighter";
      for (let i = dust.length - 1; i >= 0; i--) {
        const d = dust[i];
        d.x += d.vx; d.y += d.vy; d.vx *= 0.985; d.vy *= 0.985; d.life++;
        const t = d.life / d.max;
        if (t >= 1) { dust.splice(i, 1); continue; }
        const alpha = Math.sin(t * Math.PI) * 0.9;
        const g = ctx.createRadialGradient(d.x, d.y, 0, d.x, d.y, d.r * 4);
        g.addColorStop(0, `rgba(255,236,180,${alpha})`);
        g.addColorStop(1, "rgba(255,200,90,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r * 4, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalCompositeOperation = "source-over";

      for (let i = petals.length - 1; i >= 0; i--) {
        const p = petals[i];
        p.phase += 0.012;
        p.vx = p.vx * 0.97 + Math.sin(p.phase) * p.sway * 0.03;
        p.vy = p.vy * 0.97 + (0.5 + p.s * 0.02) * 0.03;
        p.x += p.vx + Math.sin(p.phase) * 0.4;
        p.y += p.vy;
        p.rot += p.vr;
        drawPetal(p);
        if (p.y > h + 30 || p.x < -60 || p.x > w + 60) {
          if (petals.length > count) petals.splice(i, 1);
          else Object.assign(p, makePetal());
        }
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    const onVis = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden) raf = requestAnimationFrame(frame);
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  useEffect(() => {
    if (burstKey > 0) api.current?.burst();
  }, [burstKey]);

  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-60 size-full" aria-hidden="true" />;
}
