"use client";

import { useEffect, useRef, useState } from "react";
import { defaultEffectId, effects } from "@/lib/effects";

const STORAGE_KEY = "hoc-effect";
const validEffect = (id: string | null) => effects.some((effect) => effect.id === id) ? id! : defaultEffectId;
const random = (min: number, max: number) => min + Math.random() * (max - min);
type Particle = { x: number; y: number; vx: number; vy: number; age: number; life: number; size: number; phase: number };

export default function EffectsLayer() {
  const [effectId, setEffectId] = useState(defaultEffectId);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const sync = () => setEffectId(getStoredEffect());
    const change = (event: Event) => setEffectId(validEffect((event as CustomEvent<string>).detail));
    sync();
    window.addEventListener("hoc-effect-change", change);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("hoc-effect-change", change);
      window.removeEventListener("storage", sync);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx || effectId === "none") return;

    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let width = 0, height = 0, frame = 0, lastTime = 0, elapsed = 0, nextStar = 0;
    let particles: Particle[] = [];
    let gold = "", cream = "";
    const pointer = { x: -1000, y: -1000, last: 0 };
    const palette = () => {
      const style = getComputedStyle(document.documentElement);
      gold = style.getPropertyValue("--color-gold").trim();
      cream = style.getPropertyValue("--color-cream").trim();
    };
    const makeParticle = (x: number, y: number): Particle => ({
      x, y, vx: random(-25, 25), vy: random(-25, -10), age: 0,
      life: random(9, 17), size: random(2, 5), phase: random(0, Math.PI * 2),
    });
    const seed = () => {
      particles = [];
      if (effectId === "fireflies" || effectId === "stars") {
        const count = width < 640 ? 14 : 28;
        particles = Array.from({ length: count }, () => ({
          ...makeParticle(random(0, width), random(0, height)), age: random(0, 8),
        }));
      }
    };
    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };
    const glow = (x: number, y: number, radius: number, alpha: number) => {
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
      gradient.addColorStop(0, cream);
      gradient.addColorStop(0.18, gold);
      gradient.addColorStop(1, `${gold}00`);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = gradient;
      ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
    };
    const burst = (x: number, y: number) => {
      if (preference.matches || document.hidden) return;
      if (effectId === "ripple") {
        for (let i = 0; i < 3; i++) particles.push({ ...makeParticle(x, y), age: -i * 0.24, life: 2.4 });
      } else if (effectId === "confetti") {
        for (let i = 0; i < 30; i++) {
          const angle = random(-Math.PI * 0.95, -Math.PI * 0.05);
          const speed = random(65, 210);
          particles.push({ ...makeParticle(x, y), vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, life: random(2, 3.6), size: random(3, 6) });
        }
      }
      particles = particles.slice(-100);
    };
    const onPointer = (event: PointerEvent) => {
      if (event.target instanceof Element && event.target.closest("[data-preview-controls]")) return;
      if (effectId !== "trail" || event.pointerType === "touch" || preference.matches || document.hidden) return;
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      if (performance.now() - pointer.last < 45) return;
      pointer.last = performance.now();
      particles.push({ ...makeParticle(pointer.x, pointer.y), life: 1.3, size: random(1, 2.5) });
      particles = particles.slice(-70);
    };
    const onClick = (event: MouseEvent) => {
      if (event.target instanceof Element && event.target.closest("button, a, input, textarea, select, [data-preview-controls]")) return;
      burst(event.clientX, event.clientY);
    };
    const preview = () => burst(width * 0.42, height * 0.42);
    const draw = (time: number) => {
      const dt = Math.min((time - (lastTime || time)) / 1000, 0.04);
      lastTime = time;
      elapsed += dt;
      ctx.clearRect(0, 0, width, height);
      if (effectId === "stars" && elapsed >= nextStar) {
        particles.push({ ...makeParticle(random(width * 0.2, width), random(0, height * 0.45)), vx: -170, vy: 90, life: 2.5, size: 0 });
        nextStar = elapsed + random(3, 6);
      }
      for (const p of particles) {
        p.age += dt;
        if (p.age < 0) continue;
        const progress = Math.min(p.age / p.life, 1);
        const fade = Math.sin(progress * Math.PI);
        if (effectId === "ripple") {
          const radius = 8 + (1 - Math.pow(1 - progress, 3)) * 140;
          ctx.globalAlpha = fade * 0.3;
          ctx.strokeStyle = gold;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.ellipse(p.x, p.y, radius, radius * 0.62, -0.15, 0, Math.PI * 2);
          ctx.stroke();
          ctx.globalAlpha = fade * 0.18;
          ctx.strokeStyle = cream;
          ctx.beginPath();
          ctx.ellipse(p.x, p.y - 2, radius + 3, radius * 0.62 + 2, -0.15, 0, Math.PI * 2);
          ctx.stroke();
        } else if (effectId === "confetti") {
          p.vx *= Math.exp(-dt * 0.8);
          p.vy += dt * 100;
          p.x += p.vx * dt;
          p.y += p.vy * dt;
          ctx.save();
          ctx.translate(p.x + Math.sin(p.age * 3 + p.phase) * 8, p.y);
          ctx.rotate(p.phase + p.age * 1.3);
          ctx.scale(Math.cos(p.age * 5 + p.phase) * 0.7 + 0.3, 1);
          ctx.globalAlpha = Math.min(p.age * 8, 1) * Math.min((1 - progress) * 3, 1) * 0.85;
          ctx.fillStyle = Math.sin(p.phase + p.age * 5) > 0 ? gold : cream;
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size * 0.5, p.size * 1.4, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        } else if (effectId === "stars" && p.size === 0) {
          p.x += p.vx * dt;
          p.y += p.vy * dt;
          const tail = ctx.createLinearGradient(p.x, p.y, p.x + 100, p.y - 53);
          tail.addColorStop(0, cream);
          tail.addColorStop(0.25, gold);
          tail.addColorStop(1, `${gold}00`);
          ctx.globalAlpha = fade * 0.65;
          ctx.strokeStyle = tail;
          ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x + 100, p.y - 53); ctx.stroke();
          glow(p.x, p.y, 5, fade * 0.65);
        } else {
          p.x += Math.sin(p.age * 0.7 + p.phase) * dt * 7;
          p.y += dt * (effectId === "trail" ? -10 : -7);
          const twinkle = 0.65 + Math.sin(elapsed * 1.2 + p.phase) * 0.35;
          glow(p.x, p.y, p.size * (effectId === "fireflies" ? 5 : 2), fade * twinkle * 0.42);
          ctx.globalAlpha = fade * twinkle * 0.55;
          ctx.fillStyle = gold;
          ctx.beginPath(); ctx.arc(p.x, p.y, p.size * 0.3, 0, Math.PI * 2); ctx.fill();
        }
        if (p.age >= p.life && (effectId === "fireflies" || (effectId === "stars" && p.size > 0))) {
          Object.assign(p, makeParticle(random(0, width), random(0, height)));
        }
      }
      particles = particles.filter((p) => p.age < p.life);
      ctx.globalAlpha = 1;
      frame = requestAnimationFrame(draw);
    };
    const run = () => {
      cancelAnimationFrame(frame);
      lastTime = 0;
      ctx.clearRect(0, 0, width, height);
      if (!preference.matches && !document.hidden) frame = requestAnimationFrame(draw);
    };
    palette();
    resize();
    preview();
    run();
    const observer = new MutationObserver(palette);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("click", onClick);
    window.addEventListener("hoc-effect-preview", preview);
    document.addEventListener("visibilitychange", run);
    preference.addEventListener("change", run);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      ctx.clearRect(0, 0, width, height);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("click", onClick);
      window.removeEventListener("hoc-effect-preview", preview);
      document.removeEventListener("visibilitychange", run);
      preference.removeEventListener("change", run);
    };
  }, [effectId]);

  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-[65] h-full w-full print:hidden" aria-hidden="true" />;
}

export function setEffect(id: string) {
  const value = validEffect(id);
  try { localStorage.setItem(STORAGE_KEY, value); } catch { /* Session preview still works. */ }
  window.dispatchEvent(new CustomEvent("hoc-effect-change", { detail: value }));
}

export function getStoredEffect(): string {
  try { return validEffect(localStorage.getItem(STORAGE_KEY)); } catch { return defaultEffectId; }
}
