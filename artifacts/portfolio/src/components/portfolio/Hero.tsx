import { useEffect, useRef, useCallback, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { useTheme } from "@/lib/theme";

// ─── Constants ─────────────────────────────────────────────────────────────
const N           = 85;
const REPEL_R     = 150;
const REPEL_F     = 4.2;
const CLICK_R     = 240;
const CLICK_F     = 10;
const MAX_SPEED   = 6.5;
const IDLE_SPEED  = 0.4;
const IDLE_DELAY  = 2000;
const TRAIL_LEN   = 20;

interface Particle { x:number; y:number; vx:number; vy:number; bvx:number; bvy:number; r:number; hue:number; alpha:number; maxAlpha:number }
interface Ripple   { id:number; x:number; y:number }

// ─── Component ─────────────────────────────────────────────────────────────
export function Hero() {
  const sectionRef  = useRef<HTMLElement>(null);
  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const rafRef      = useRef(0);
  const particles   = useRef<Particle[]>([]);
  const mouse       = useRef({ x: -999, y: -999 });
  const impulse     = useRef<{ x:number; y:number } | null>(null);
  const isIdle      = useRef(true);          // starts idle → autonomous animation
  const idleTimer   = useRef<ReturnType<typeof setTimeout>>();
  const trailRef    = useRef<Array<{ x:number; y:number }>>([]);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const rippleId = useRef(0);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // ── Orb springs ──────────────────────────────────────────────────────────
  const rawX = useMotionValue(0.5);
  const rawY = useMotionValue(0.5);

  const px = useSpring(rawX, { stiffness: 90,  damping: 22, mass: 0.5 });
  const py = useSpring(rawY, { stiffness: 90,  damping: 22, mass: 0.5 });
  const tx = useSpring(rawX, { stiffness: 22,  damping: 13, mass: 1.7 });
  const ty = useSpring(rawY, { stiffness: 22,  damping: 13, mass: 1.7 });

  const pLeft  = useTransform(px, v => `${v * 100}%`);
  const pTop   = useTransform(py, v => `${v * 100}%`);
  const tLeft  = useTransform(tx, v => `${v * 100}%`);
  const tTop   = useTransform(ty, v => `${v * 100}%`);

  // Velocity-driven orb stretch
  const stretchX = useMotionValue(1);
  const stretchY = useMotionValue(1);
  const stretchR = useMotionValue(0);
  const sxS = useSpring(stretchX, { stiffness: 240, damping: 26 });
  const syS = useSpring(stretchY, { stiffness: 240, damping: 26 });
  const srS = useSpring(stretchR, { stiffness: 200, damping: 24 });

  // ── Particle init ─────────────────────────────────────────────────────────
  const initParticles = useCallback((w:number, h:number) => {
    particles.current = Array.from({ length: N }, () => {
      const angle = Math.random() * Math.PI * 2;
      const spd   = Math.random() * 0.38 + 0.09;
      const hue   = 236 + Math.random() * 32;
      const maxA  = Math.random() * 0.5 + 0.18;
      return { x: Math.random()*w, y: Math.random()*h, vx: Math.cos(angle)*spd, vy: Math.sin(angle)*spd, bvx: Math.cos(angle)*spd, bvy: Math.sin(angle)*spd, r: Math.random()*2.4+0.8, hue, alpha: maxA*0.5, maxAlpha: maxA };
    });
  }, []);

  // ── Canvas render loop ───────────────────────────────────────────────────
  const loop = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const { width: W, height: H } = canvas;
    ctx.clearRect(0, 0, W, H);

    const mx    = mouse.current.x;
    const my    = mouse.current.y;
    const imp   = impulse.current;
    const idle  = isIdle.current;
    const dark  = document.documentElement.classList.contains("dark");
    const idleMul = idle ? 0.25 : 1;
    // In light mode particles are more saturated/darker to be visible
    const saturation = dark ? 78 : 90;
    const lightness  = dark ? 70 : 48;

    // ── Cursor trail ──────────────────────────────────────────────────────
    const trail = trailRef.current;
    if (trail.length > 1) {
      trail.forEach((pt, i) => {
        const t = 1 - i / trail.length;
        const tAlpha = t * (dark ? 0.5 : 0.4);
        const tSize  = Math.max(0.5, 3 * t);
        const grd = ctx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, tSize * 2.5);
        grd.addColorStop(0, `hsla(245,82%,${dark ? 72 : 50}%,${tAlpha})`);
        grd.addColorStop(1, `hsla(245,82%,${dark ? 72 : 50}%,0)`);
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, tSize * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();
      });
    }

    // ── Particles ─────────────────────────────────────────────────────────
    particles.current.forEach(p => {
      // Click impulse
      if (imp) {
        const dx = p.x - imp.x, dy = p.y - imp.y;
        const d = Math.hypot(dx, dy);
        if (d < CLICK_R && d > 0) {
          const f = ((CLICK_R - d) / CLICK_R) * CLICK_F;
          p.vx += (dx/d)*f; p.vy += (dy/d)*f;
        }
      }

      // Cursor repulsion
      const dx = p.x - mx, dy = p.y - my;
      const d  = Math.hypot(dx, dy);
      if (!idle && d < REPEL_R && d > 0) {
        const f = ((REPEL_R - d) / REPEL_R) * REPEL_F;
        p.vx += (dx/d)*f*0.07; p.vy += (dy/d)*f*0.07;
      }

      // Opacity — brighter near cursor
      const prox = d < REPEL_R ? 1 - d/REPEL_R : 0;
      const targetAlpha = idle ? p.maxAlpha*0.35 : Math.min(1, p.maxAlpha + prox * 0.6);
      p.alpha += (targetAlpha - p.alpha) * 0.055;

      // Return to base velocity
      p.vx += (p.bvx*idleMul - p.vx)*0.018;
      p.vy += (p.bvy*idleMul - p.vy)*0.018;

      // Speed cap
      const spd = Math.hypot(p.vx, p.vy);
      const cap = idle ? IDLE_SPEED : MAX_SPEED;
      if (spd > cap) { p.vx = p.vx/spd*cap; p.vy = p.vy/spd*cap; }

      p.x += p.vx; p.y += p.vy;
      if (p.x < -8) p.x = W+8; if (p.x > W+8) p.x = -8;
      if (p.y < -8) p.y = H+8; if (p.y > H+8) p.y = -8;

      const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r*4);
      grd.addColorStop(0,   `hsla(${p.hue},${saturation}%,${lightness}%,${p.alpha})`);
      grd.addColorStop(0.4, `hsla(${p.hue},${saturation}%,${lightness-6}%,${p.alpha*0.45})`);
      grd.addColorStop(1,   `hsla(${p.hue},${saturation}%,${lightness}%,0)`);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r*4, 0, Math.PI*2);
      ctx.fillStyle = grd;
      ctx.fill();
    });

    if (imp) impulse.current = null;
    rafRef.current = requestAnimationFrame(loop);
  }, []);

  // ── Canvas resize + start ─────────────────────────────────────────────────
  useEffect(() => {
    const section = sectionRef.current;
    const canvas  = canvasRef.current;
    if (!section || !canvas) return;

    const resize = () => {
      const { width, height } = section.getBoundingClientRect();
      canvas.width  = width;
      canvas.height = height;
      if (!particles.current.length) initParticles(width, height);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(section);
    rafRef.current = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(rafRef.current); ro.disconnect(); };
  }, [loop, initParticles]);

  // ── Mouse move ────────────────────────────────────────────────────────────
  const handleMouseMove = useCallback((e:MouseEvent) => {
    const el = sectionRef.current;
    if (!el) return;
    const { left, top, width, height } = el.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;
    const prev = mouse.current;
    const vx = x - prev.x;
    const vy = y - prev.y;
    mouse.current = { x, y };

    // Cursor trail
    trailRef.current.unshift({ x, y });
    if (trailRef.current.length > TRAIL_LEN) trailRef.current.pop();

    rawX.set((e.clientX - left) / width);
    rawY.set((e.clientY - top)  / height);

    // Orb stretch based on velocity
    const spd = Math.hypot(vx, vy);
    if (spd > 1.5) {
      const s = Math.min(spd * 0.018, 0.4);
      stretchX.set(1 + s * 1.6);
      stretchY.set(1 - s * 0.5);
      stretchR.set(Math.atan2(vy, vx) * (180/Math.PI));
    }

    // Wake from idle
    isIdle.current = false;
    if (!hasInteracted) setHasInteracted(true);
    clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => {
      isIdle.current = true;
      stretchX.set(1); stretchY.set(1); stretchR.set(0);
      trailRef.current = [];
    }, IDLE_DELAY);
  }, [rawX, rawY, stretchX, stretchY, stretchR, hasInteracted]);

  // ── Click ─────────────────────────────────────────────────────────────────
  const handleClick = useCallback((e:MouseEvent) => {
    const el = sectionRef.current;
    if (!el) return;
    const { left, top } = el.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;
    impulse.current = { x, y };
    const id = rippleId.current++;
    setRipples(r => [...r, { id, x, y }]);
    setTimeout(() => setRipples(r => r.filter(rr => rr.id !== id)), 900);
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    el.addEventListener("mousemove", handleMouseMove);
    el.addEventListener("click", handleClick);
    return () => { el.removeEventListener("mousemove", handleMouseMove); el.removeEventListener("click", handleClick); };
  }, [handleMouseMove, handleClick]);

  // Orb colors adapt to theme
  const primaryOrb = isDark
    ? "radial-gradient(circle, rgba(99,102,241,0.30) 0%, rgba(99,102,241,0.12) 40%, transparent 68%)"
    : "radial-gradient(circle, rgba(79,82,220,0.22) 0%, rgba(79,82,220,0.07) 42%, transparent 68%)";
  const trailOrb = isDark
    ? "radial-gradient(circle, rgba(139,92,246,0.22) 0%, transparent 65%)"
    : "radial-gradient(circle, rgba(110,60,220,0.16) 0%, transparent 65%)";
  const ambientOrb = isDark
    ? "radial-gradient(circle, rgba(99,102,241,0.09) 0%, transparent 62%)"
    : "radial-gradient(circle, rgba(79,82,220,0.07) 0%, transparent 62%)";
  const heroBg = isDark ? "bg-[#0a0a0f]" : "bg-background";
  const gridOpacity = isDark ? "rgba(255,255,255,0.03)" : "rgba(80,80,200,0.06)";

  return (
    <section
      ref={sectionRef}
      id="home"
      className={`relative min-h-[100dvh] flex items-center justify-center ${heroBg} overflow-hidden transition-colors duration-500`}
    >
      {/* Canvas: particles + trail */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />

      {/* Click ripples */}
      <AnimatePresence>
        {ripples.map(rpl => (
          <motion.div key={rpl.id}
            className="absolute rounded-full pointer-events-none border border-primary/60"
            style={{ left: rpl.x, top: rpl.y, translateX: "-50%", translateY: "-50%", zIndex: 5 }}
            initial={{ width: 0, height: 0, opacity: 1 }}
            animate={{ width: 360, height: 360, opacity: 0 }}
            exit={{}}
            transition={{ duration: 0.8, ease: [0.15, 0.85, 0.35, 1] }}
          />
        ))}
        {ripples.map(rpl => (
          <motion.div key={`${rpl.id}-b`}
            className="absolute rounded-full pointer-events-none border border-violet-500/40"
            style={{ left: rpl.x, top: rpl.y, translateX: "-50%", translateY: "-50%", zIndex: 5 }}
            initial={{ width: 0, height: 0, opacity: 0.7 }}
            animate={{ width: 240, height: 240, opacity: 0 }}
            exit={{}}
            transition={{ duration: 0.58, ease: [0.15, 0.85, 0.35, 1], delay: 0.07 }}
          />
        ))}
      </AnimatePresence>

      {/* Primary cursor orb — stretches with velocity */}
      <motion.div
        className="absolute pointer-events-none rounded-full z-[1]"
        style={{ width: 600, height: 600, left: pLeft, top: pTop, translateX: "-50%", translateY: "-50%", scaleX: sxS, scaleY: syS, rotate: srS, background: primaryOrb }}
      />

      {/* Trail orb */}
      <motion.div
        className="absolute pointer-events-none rounded-full z-[1]"
        style={{ width: 360, height: 360, left: tLeft, top: tTop, translateX: "-50%", translateY: "-50%", background: trailOrb }}
      />

      {/* Ambient orb — always visible, breathes prominently */}
      <motion.div
        className="absolute pointer-events-none rounded-full z-0"
        style={{ width: 780, height: 780, top: "50%", left: "50%", translateX: "-50%", translateY: "-50%", background: ambientOrb }}
        animate={{ scale: [1, 1.16, 0.96, 1.1, 1], opacity: [0.55, 1, 0.65, 0.9, 0.55] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Second ambient orb — offset, creates depth */}
      <motion.div
        className="absolute pointer-events-none rounded-full z-0"
        style={{ width: 380, height: 380, top: "32%", left: "65%", translateX: "-50%", translateY: "-50%", background: isDark ? "radial-gradient(circle, rgba(139,92,246,0.13) 0%, transparent 65%)" : "radial-gradient(circle, rgba(110,60,220,0.09) 0%, transparent 65%)" }}
        animate={{ x: [0, 35, -20, 0], y: [0, -25, 18, 0], opacity: [0.5, 0.85, 0.4, 0.5] }}
        transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Dot grid */}
      <div
        className="absolute inset-0 z-0 [mask-image:radial-gradient(ellipse_72%_72%_at_50%_50%,#000_15%,transparent_100%)]"
        style={{ backgroundImage: `radial-gradient(circle, ${gridOpacity} 1px, transparent 1px)`, backgroundSize: "36px 36px" }}
      />

      {/* ── Content ── */}
      <div className="relative z-10 max-w-2xl mx-auto px-6 text-center select-none">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-xs text-primary font-semibold tracking-[0.22em] uppercase mb-7"
        >
          AI / ML · Systems Engineering · Problem Solving
        </motion.p>

        {/* Name with hover glow */}
        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.1 }}
          className="text-7xl md:text-[6.5rem] font-bold tracking-tight text-foreground mb-7 leading-none cursor-default"
          whileHover={{
            textShadow: isDark
              ? "0 0 48px rgba(99,102,241,0.6), 0 0 90px rgba(139,92,246,0.28)"
              : "0 0 36px rgba(79,82,220,0.4), 0 0 60px rgba(110,60,220,0.18)",
            transition: { duration: 0.28 },
          }}
        >
          Soubhagya
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.2 }}
          className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-lg mx-auto mb-10"
        >
          I solve hard problems by building intelligent systems — combining machine
          learning, algorithms, and reliable infrastructure into software that works at scale.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.3 }}
          className="flex items-center justify-center gap-3 flex-wrap"
        >
          <motion.a
            href="#projects"
            className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium text-sm"
            whileHover={{ scale: 1.05, boxShadow: isDark ? "0 0 32px rgba(99,102,241,0.6)" : "0 0 24px rgba(79,82,220,0.4)" }}
            whileTap={{ scale: 0.97 }}
            animate={{ boxShadow: isDark
              ? ["0 0 0px rgba(99,102,241,0)", "0 0 20px rgba(99,102,241,0.4)", "0 0 0px rgba(99,102,241,0)"]
              : ["0 0 0px rgba(79,82,220,0)", "0 0 14px rgba(79,82,220,0.28)", "0 0 0px rgba(79,82,220,0)"],
            }}
            transition={{ boxShadow: { duration: 2.8, repeat: Infinity, ease: "easeInOut" } }}
          >
            See My Work
          </motion.a>

          <motion.a
            href="#contact"
            className="px-6 py-3 rounded-lg border border-border text-muted-foreground font-medium text-sm"
            whileHover={{ scale: 1.05, backgroundColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)", color: "var(--color-foreground)" }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.18 }}
          >
            Get in Touch
          </motion.a>
        </motion.div>
      </div>

      {/* ── Discovery cue — fades away after first interaction ── */}
      <AnimatePresence>
        {!hasInteracted && (
          <motion.div
            className="absolute bottom-24 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.7, 0.4, 0.7] }}
            exit={{ opacity: 0, y: 8, transition: { duration: 0.35 } }}
            transition={{ duration: 2.5, delay: 1.8, times: [0, 0.3, 0.6, 1], repeat: Infinity, repeatType: "loop" }}
          >
            <span className="text-[11px] text-primary/60 tracking-[0.25em] uppercase font-medium">
              Move your cursor
            </span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-primary/40" stroke="currentColor" strokeWidth="1.5">
              <path d="M5 9l4-4 4 4"/><path d="M9 5v14"/><path d="M15 9l4 4-4 4"/>
            </svg>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Scroll indicator ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.9, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-[10px] text-muted-foreground/45 tracking-[0.22em] uppercase">Scroll</span>
          <div className="w-px h-7 bg-gradient-to-b from-muted-foreground/30 to-transparent" />
        </motion.div>
      </motion.div>
    </section>
  );
}
