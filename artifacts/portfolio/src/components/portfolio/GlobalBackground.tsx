/**
 * GlobalBackground — Fixed behind the entire page.
 * Handles: canvas particle system, cursor trail, click ripples,
 *          and cursor-following orbs — all globally.
 * Works everywhere on the page, not just the hero.
 */
import { useEffect, useRef, useCallback, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
} from "framer-motion";

// ── Config ──────────────────────────────────────────────────────────────────
const N          = 52;   // particle count (reduced for clarity)
const REPEL_R    = 155;
const REPEL_F    = 4.5;
const CLICK_R    = 260;
const CLICK_F    = 11;
const MAX_SPD    = 7;
const IDLE_SPD   = 0.45;
const IDLE_DELAY = 2400;
const TRAIL_LEN  = 22;

interface Particle { x:number; y:number; vx:number; vy:number; bvx:number; bvy:number; r:number; hue:number; alpha:number; maxAlpha:number }
interface Ripple   { id:number; x:number; y:number }

export function GlobalBackground() {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const rafRef     = useRef(0);
  const particles  = useRef<Particle[]>([]);
  const mouse      = useRef({ x: -999, y: -999 });
  const impulse    = useRef<{ x:number; y:number } | null>(null);
  const isIdle     = useRef(true);
  const idleTimer  = useRef<ReturnType<typeof setTimeout>>();
  const trail      = useRef<Array<{ x:number; y:number }>>([]);

  const [ripples, setRipples] = useState<Ripple[]>([]);
  const rippleId = useRef(0);

  // ── Orb spring system (viewport-relative 0-1) ────────────────────────────
  const rawX = useMotionValue(0.5);
  const rawY = useMotionValue(0.5);

  const px = useSpring(rawX, { stiffness: 85,  damping: 22, mass: 0.5 });
  const py = useSpring(rawY, { stiffness: 85,  damping: 22, mass: 0.5 });
  const tx = useSpring(rawX, { stiffness: 22,  damping: 13, mass: 1.8 });
  const ty = useSpring(rawY, { stiffness: 22,  damping: 13, mass: 1.8 });

  const pLeft = useTransform(px, v => `${v * 100}%`);
  const pTop  = useTransform(py, v => `${v * 100}%`);
  const tLeft = useTransform(tx, v => `${v * 100}%`);
  const tTop  = useTransform(ty, v => `${v * 100}%`);

  // Velocity stretch
  const sX = useMotionValue(1); const sXs = useSpring(sX, { stiffness: 230, damping: 26 });
  const sY = useMotionValue(1); const sYs = useSpring(sY, { stiffness: 230, damping: 26 });
  const sR = useMotionValue(0); const sRs = useSpring(sR, { stiffness: 200, damping: 24 });

  // ── Init particles in viewport space ─────────────────────────────────────
  const initParticles = useCallback(() => {
    const W = window.innerWidth, H = window.innerHeight;
    particles.current = Array.from({ length: N }, () => {
      const angle = Math.random() * Math.PI * 2;
      const spd   = Math.random() * 0.36 + 0.08;
      const hue   = 234 + Math.random() * 34;
      const maxA  = Math.random() * 0.48 + 0.16;
      return {
        x: Math.random()*W, y: Math.random()*H,
        vx: Math.cos(angle)*spd, vy: Math.sin(angle)*spd,
        bvx: Math.cos(angle)*spd, bvy: Math.sin(angle)*spd,
        r: Math.random()*2.4+0.9, hue, alpha: maxA*0.45, maxAlpha: maxA,
      };
    });
  }, []);

  // ── Render loop ───────────────────────────────────────────────────────────
  const loop = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    const mx   = mouse.current.x;
    const my   = mouse.current.y;
    const imp  = impulse.current;
    const idle = isIdle.current;
    const dark = document.documentElement.classList.contains("dark");
    const sat  = dark ? 78 : 88;
    const lit  = dark ? 72 : 46;
    const idleMul = idle ? 0.22 : 1;

    // Cursor trail
    if (trail.current.length > 1) {
      trail.current.forEach((pt, i) => {
        const t = 1 - i / trail.current.length;
        const a = t * (dark ? 0.52 : 0.38);
        const g = ctx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, 7*t);
        g.addColorStop(0, `hsla(245,82%,${dark?72:52}%,${a})`);
        g.addColorStop(1, `hsla(245,82%,${dark?72:52}%,0)`);
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 7*t, 0, Math.PI*2);
        ctx.fillStyle = g;
        ctx.fill();
      });
    }

    // Particles
    particles.current.forEach(p => {
      if (imp) {
        const dx=p.x-imp.x, dy=p.y-imp.y, d=Math.hypot(dx,dy);
        if (d < CLICK_R && d > 0) {
          const f = ((CLICK_R-d)/CLICK_R)*CLICK_F;
          p.vx+=(dx/d)*f; p.vy+=(dy/d)*f;
        }
      }
      const dx=p.x-mx, dy=p.y-my, d=Math.hypot(dx,dy);
      if (!idle && d < REPEL_R && d > 0) {
        const f=((REPEL_R-d)/REPEL_R)*REPEL_F;
        p.vx+=(dx/d)*f*0.07; p.vy+=(dy/d)*f*0.07;
      }
      const prox = d < REPEL_R ? 1 - d/REPEL_R : 0;
      const tA = idle ? p.maxAlpha*0.3 : Math.min(1, p.maxAlpha + prox*0.62);
      p.alpha += (tA - p.alpha)*0.05;

      p.vx += (p.bvx*idleMul - p.vx)*0.018;
      p.vy += (p.bvy*idleMul - p.vy)*0.018;
      const spd = Math.hypot(p.vx,p.vy);
      const cap = idle ? IDLE_SPD : MAX_SPD;
      if (spd > cap) { p.vx=p.vx/spd*cap; p.vy=p.vy/spd*cap; }

      p.x += p.vx; p.y += p.vy;
      if (p.x < -8) p.x=W+8; if (p.x>W+8) p.x=-8;
      if (p.y < -8) p.y=H+8; if (p.y>H+8) p.y=-8;

      const gr = p.r*4.5;
      const grd = ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,gr);
      grd.addColorStop(0,   `hsla(${p.hue},${sat}%,${lit}%,${p.alpha})`);
      grd.addColorStop(0.4, `hsla(${p.hue},${sat}%,${lit-5}%,${p.alpha*0.4})`);
      grd.addColorStop(1,   `hsla(${p.hue},${sat}%,${lit}%,0)`);
      ctx.beginPath(); ctx.arc(p.x,p.y,gr,0,Math.PI*2);
      ctx.fillStyle=grd; ctx.fill();
    });

    if (imp) impulse.current = null;
    rafRef.current = requestAnimationFrame(loop);
  }, []);

  // ── Canvas resize ─────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
      if (!particles.current.length) initParticles();
    };
    resize();
    window.addEventListener("resize", resize);
    rafRef.current = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(rafRef.current); window.removeEventListener("resize", resize); };
  }, [loop, initParticles]);

  // ── Global mouse move ─────────────────────────────────────────────────────
  const handleMove = useCallback((e: MouseEvent) => {
    const x = e.clientX, y = e.clientY;
    const prev = mouse.current;
    const vx = x - prev.x, vy = y - prev.y;
    mouse.current = { x, y };
    trail.current.unshift({ x, y });
    if (trail.current.length > TRAIL_LEN) trail.current.pop();

    rawX.set(x / window.innerWidth);
    rawY.set(y / window.innerHeight);

    const spd = Math.hypot(vx, vy);
    if (spd > 1.5) {
      const s = Math.min(spd*0.017, 0.38);
      sX.set(1+s*1.55); sY.set(1-s*0.5);
      sR.set(Math.atan2(vy,vx)*(180/Math.PI));
    }

    isIdle.current = false;
    clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => {
      isIdle.current = true;
      sX.set(1); sY.set(1); sR.set(0);
      trail.current = [];
    }, IDLE_DELAY);
  }, [rawX, rawY, sX, sY, sR]);

  // ── Global click ──────────────────────────────────────────────────────────
  const handleClick = useCallback((e: MouseEvent) => {
    impulse.current = { x: e.clientX, y: e.clientY };
    const id = rippleId.current++;
    setRipples(r => [...r, { id, x: e.clientX, y: e.clientY }]);
    setTimeout(() => setRipples(r => r.filter(rr => rr.id !== id)), 900);
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("click", handleClick);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("click", handleClick);
    };
  }, [handleMove, handleClick]);

  const isDark = document.documentElement.classList.contains("dark");

  return (
    <>
      {/* Fixed canvas — behind everything */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none"
        style={{ zIndex: 0 }}
      />

      {/* Global click ripples (fixed to viewport) */}
      <AnimatePresence>
        {ripples.map(rpl => (
          <motion.div key={rpl.id}
            className="fixed rounded-full pointer-events-none border border-primary/55"
            style={{ left: rpl.x, top: rpl.y, translateX: "-50%", translateY: "-50%", zIndex: 2 }}
            initial={{ width: 0, height: 0, opacity: 1 }}
            animate={{ width: 380, height: 380, opacity: 0 }}
            exit={{}}
            transition={{ duration: 0.82, ease: [0.12, 0.85, 0.32, 1] }}
          />
        ))}
        {ripples.map(rpl => (
          <motion.div key={`${rpl.id}-b`}
            className="fixed rounded-full pointer-events-none border border-violet-400/35"
            style={{ left: rpl.x, top: rpl.y, translateX: "-50%", translateY: "-50%", zIndex: 2 }}
            initial={{ width: 0, height: 0, opacity: 0.65 }}
            animate={{ width: 250, height: 250, opacity: 0 }}
            exit={{}}
            transition={{ duration: 0.58, ease: [0.12, 0.85, 0.32, 1], delay: 0.08 }}
          />
        ))}
      </AnimatePresence>

      {/* Primary cursor orb — stretches with velocity */}
      <motion.div
        className="fixed pointer-events-none rounded-full"
        style={{
          width: 580, height: 580,
          left: pLeft, top: pTop,
          translateX: "-50%", translateY: "-50%",
          scaleX: sXs, scaleY: sYs, rotate: sRs,
          zIndex: 1,
          background: "radial-gradient(circle, rgba(99,102,241,0.26) 0%, rgba(99,102,241,0.09) 42%, transparent 68%)",
        }}
      />

      {/* Trail orb */}
      <motion.div
        className="fixed pointer-events-none rounded-full"
        style={{
          width: 340, height: 340,
          left: tLeft, top: tTop,
          translateX: "-50%", translateY: "-50%",
          zIndex: 1,
          background: "radial-gradient(circle, rgba(139,92,246,0.20) 0%, transparent 64%)",
        }}
      />

      {/* Ambient breathing orb — top-center */}
      <motion.div
        className="fixed pointer-events-none rounded-full"
        style={{
          width: 820, height: 820,
          left: "50%", top: "42%",
          translateX: "-50%", translateY: "-50%",
          zIndex: 0,
          background: "radial-gradient(circle, rgba(99,102,241,0.075) 0%, transparent 60%)",
        }}
        animate={{ scale: [1, 1.13, 0.94, 1.08, 1], opacity: [0.5, 0.95, 0.55, 0.85, 0.5] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Drifting secondary ambient orb */}
      <motion.div
        className="fixed pointer-events-none rounded-full"
        style={{
          width: 420, height: 420,
          left: "68%", top: "30%",
          translateX: "-50%", translateY: "-50%",
          zIndex: 0,
          background: "radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 62%)",
        }}
        animate={{ x: [0, 45, -25, 0], y: [0, -30, 20, 0], opacity: [0.45, 0.82, 0.38, 0.45] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
    </>
  );
}
